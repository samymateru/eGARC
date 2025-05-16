import { z } from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
];

export type Response = {
  detail?: string;
};

export type UserResponse = {
  id?: string;
  name?: string;
  email?: string;
};

export const User = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  date_issued: z.string(),
});

export const PlanSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Plan name is equired"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit string"),
  status: z.enum(["Not Started", "In Progress", "Completed"]).optional(),
  start: z.date({ required_error: "Start date is required" }),
  end: z.date({ required_error: "End date is required" }),
  attachment: z
    .instanceof(File, { message: "Provide attachment" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5MB",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Unsupported file type",
    }),
  created_at: z.string().datetime().optional(),
});

export const StandardTemplateSchema = z.object({
  id: z.string(),
  reference: z.string(),
  title: z.string(),
  tests: z.object({
    value: z.string(),
  }),
  results: z.object({
    value: z.string(),
  }),
  observation: z.object({
    value: z.string(),
  }),
  attachments: z.array(z.string()),
  conclusion: z.object({
    value: z.string(),
  }),
  type: z.string(),
  prepared_by: z.object({
    id: z.string(),
    name: z.string(),
  }),
  reviewed_by: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const RaiseTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  raised_by: z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
      date_issued: z.date({ required_error: "Date issued is required" }),
    })
    .optional(),
  action_owner: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
      })
    )
    .min(1, "At least one action owner is required"),
});

export const RaiseReviewCommentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  raised_by: z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
      date_issued: z.date({ required_error: "Date issued is required" }),
    })
    .optional(),
  action_owner: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
      })
    )
    .min(1, "At least one action owner is required"),
});

export const MainProgramSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Program name is required"),
});

export const SubProgramSchema = z.object({
  title: z.string().min(1, "Sub program title is required"),
});

export const PolicySchema = z.object({
  name: z.string().min(1, "Please provide policy name"),
  version: z.string().min(1, "Please provide policy version"),
  key_areas: z.string().min(1, "Provide keys areas"),
  attachment: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5MB",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Unsupported file type",
    }),
});

export const ControlSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Control name is required"),
  objective: z.string().min(1, "Objective is required"),
  type: z.string().min(1, "Type is required"),
});

export const RiskSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Risk name is required"),
    magnitude: z
      .number({ required_error: "Magnitude is required" })
      .gte(1, "Magnitude must be at least 1"),
  })
  .refine((data) => data.magnitude && data.name, {
    message: "Both Risk ID and Name are required",
    path: ["id", "name"],
  });

export const PRCMSchema = z.object({
  id: z.string().optional(),
  process: z.string({ required_error: "Business process is required" }),
  risk: z.string().min(1, "Risk is required"),
  risk_rating: z.string({ required_error: "Risk rating is required" }),
  control: z.string().min(1, "Control is required"),
  control_objective: z.string().min(1, "Control objective is required"),
  control_type: z.string({ required_error: "Control type is required" }),
  residue_risk: z.string().optional(),
  summary_audit_program: z.string().optional(),
});

export const RiskControlSchema = z.object({
  id: z.string().optional(),
  risk: z.string().min(1, "Risk is required"),
  risk_rating: z.string({ required_error: "Risk rating is required" }),
  control: z.string().min(1, "Control is required"),
  control_objective: z.string().min(1, "Control objective is required"),
  control_type: z.string({ required_error: "Control type is required" }),
  residue_risk: z.string().optional(),
});

export const SummaryAuditProgramSchema = z.object({
  id: z.string().optional(),
  process: z.string().optional(),
  risk: z.string().optional(),
  risk_rating: z.string().optional(),
  control: z.string().optional(),
  control_objective: z.string().optional(),
  control_type: z.string().optional(),
  program: z.string({ required_error: "Program name is required" }),
  procedure: z
    .string({ required_error: "Procudure name is required" })
    .min(1, "Procudure name is required"),
});

export const BusinessProcessSchema = z.object({
  process_name: z.string().optional(),
});

export const RiskRatingSchema = z.object({
  name: z.string().optional(),
});

export const ControlTypeSchema = z.object({
  name: z.string().optional(),
});

export const RegulationSchema = z.object({
  name: z.string().min(1, "Please provide policy name"),
  issue_date: z.date({ required_error: "Issue date is required" }),
  key_areas: z.string().min(1, "Provide keys areas"),
  attachment: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5MB",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Unsupported file type",
    }),
});

export const RoleSchema = z.object({
  name: z.string(),
});

export const LeadSchema = z.object({
  name: z.string().min(1, "Leader name is required"),
  email: z.string().min(1, "Leader email is required"),
});

export const DepartmentSchema = z.object({
  name: z.string().min(1, "Please select a department name"),
  code: z.string().min(1, "Please select a department name"),
});

export const EngagementSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Provide engagement name"),
  type: z.string({ required_error: "Provide engagement type" }),
  code: z.string().optional(),
  risk: RiskSchema,
  leads: z.array(LeadSchema).min(1, "At least one lead is required"),
  quarter: z.string().optional(),
  department: DepartmentSchema,
  sub_departments: z
    .array(z.string())
    .min(1, "At least one sub department required"),
  status: z.enum(["Not started", "In progress", "Completed"]).optional(),
  stage: z.enum(["Not Started", "In Progress", "Completed"]).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
});

export const SummaryProcedureSchema = z.object({
  reference: z.string(),
  program: z.string(),
  title: z.string(),
  prepared_by: z.object({
    name: z.string(),
    email: z.string(),
    date_issued: z.string(),
  }),
  reviewed_by: z.object({
    name: z.string(),
    email: z.string(),
    date_issued: z.string(),
  }),
  effectiveness: z.string(),
  issue_count: z.number(),
});

export const ReviewCommentsSchema = z.object({
  id: z.string(),
  reference: z.string(),
  title: z.string(),
  description: z.string(),
  raised_by: User,
  action_owner: z.array(User),
  resolution_summary: z.string(),
  resolution_details: z.string(),
  resolved_by: User,
  decision: z.string(),
  status: z.string(),
});

export const TasksSchema = z.object({
  id: z.string(),
  reference: z.string(),
  title: z.string(),
  description: z.string(),
  raised_by: User,
  action_owner: z.array(User),
  resolution_summary: z.string(),
  resolution_details: z.string(),
  resolved_by: User,
  decision: z.string(),
  status: z.string(),
});

export const SubProgramSchema_ = z.object({
  id: z.string(),
  reference: z.string(),
  title: z.string(),
  brief_description: z.string(),
  audit_objective: z.string(),
  test_description: z.string(),
  test_type: z.string(),
  sampling_approach: z.string(),
  results_of_test: z.string(),
  observation: z.string(),
  extended_testing: z.boolean(),
  extended_procedure: z.string(),
  extended_results: z.string(),
  effectiveness: z.string(),
  reviewed_by: z.object({
    name: z.string(),
    email: z.string().email(),
    date_issued: z.string().datetime(), // or z.coerce.date() if you want a Date object
  }),
  prepared_by: z.object({
    name: z.string(),
    email: z.string().email(),
    date_issued: z.string().datetime(), // same here
  }),
  conclusion: z.string(),
});

export const EngagementRiskSchema = z.object({
  name: z.string().min(1, "Risk name is required"),
  rating: z
    .string({ required_error: "Provide risk rating" })
    .min(1, "Provide risk rating"),
});

export const EngagementProcessSchema = z.object({
  id: z.string().optional(),
  process: z
    .string({ required_error: "Process is required" })
    .min(1, "Process is required"),
  sub_process: z.array(z.string()).min(1, "At least one sub process required"),
  description: z.string().min(1, "Description is required"),
  business_unit: z.string().min(1, "Business unit is required"),
});

export const EngagementProfileSchema = z.object({
  id: z.string(),
  audit_background: z.object({
    value: z.string(),
  }),
  audit_objectives: z.object({
    value: z.string(),
  }),
  key_legislations: z.object({
    value: z.string(),
  }),
  relevant_systems: z.object({
    value: z.string(),
  }),
  key_changes: z.object({
    value: z.string(),
  }),
  reliance: z.object({
    value: z.string(),
  }),
  scope_exclusion: z.object({
    value: z.string(),
  }),
  core_risk: z.array(z.string()),
  estimated_dates: z.object({
    value: z.string(),
  }),
});
