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
  date_issued: z.string().optional(),
});

export const PlanSchema = z.object({
  id: z.string().optional(),
  module: z.string().optional(),
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
  due_date: z.date({ required_error: "Due date required" }),
  href: z.string().optional(),
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
  due_date: z.date({ required_error: "Due date required" }),
  href: z.string().optional(),
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
  id: z.string().optional(),
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
  process: z
    .string({ required_error: "Business process is required" })
    .min(1, "Business process is required"),
  risk: z.string().min(1, "Risk is required"),
  risk_rating: z
    .string({ required_error: "Risk rating is required" })
    .min(1, "Risk rating is required"),
  control: z.string().min(1, "Control is required"),
  control_objective: z.string().min(1, "Control objective is required"),
  control_type: z
    .string({ required_error: "Control type is required" })
    .min(1, "Control type is required"),
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
  id: z.string().optional(),
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
  role: z.string().default("Lead").optional(),
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
  engagement: z.string().optional(),
  reference: z.string(),
  href: z.string().optional(),
  title: z.string().optional(),
  description: z.string(),
  raised_by: User,
  due_date: z.date().optional(),
  action_owner: z.array(User),
  resolution_summary: z.string(),
  resolution_details: z.string(),
  resolved_by: User,
  decision: z.string(),
  status: z.string(),
});

export const TasksSchema = z.object({
  id: z.string(),
  engagement: z.string().optional(),
  reference: z.string(),
  href: z.string().optional(),
  title: z.string().optional(),
  description: z.string(),
  raised_by: User,
  due_date: z.date().optional(),
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
  audit_background: z.record(z.any()),
  audit_objectives: z.record(z.any()),
  key_legislations: z.record(z.any()),
  relevant_systems: z.record(z.any()),
  key_changes: z.record(z.any()),
  reliance: z.record(z.any()),
  scope_exclusion: z.record(z.any()),
  core_risk: z.array(z.string()),
});

export const IssueSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Provide issue title"),
  ref: z.string().optional(),
  criteria: z.string().min(1, "Criteria is required"),
  finding: z.string().min(1, "Povide finding weakness"),
  risk_rating: z
    .string({ required_error: "Providee risk rating" })
    .min(1, "Providee risk rating"),
  process: z
    .string({ required_error: "Provide process" })
    .min(1, "Provide process"),
  source: z
    .string({ required_error: "Provide issue source" })
    .min(1, "Provide issue source"),
  sdi_name: z.string().optional(),
  sub_process: z
    .string({ required_error: "Provide sub process" })
    .min(1, "Provide sub process"),
  root_cause_description: z.string().min(1, "Provide root cause description"),
  root_cause: z
    .string({ required_error: "Root cause required" })
    .min(1, "Root cause required"),
  sub_root_cause: z
    .string({ required_error: "Sub root cause is required" })
    .min(1, "Sub root cause is required"),
  risk_category: z
    .string({ required_error: "Provide risk category" })
    .min(1, "Provide risk category"),
  sub_risk_category: z
    .string({ required_error: "Provide sub risk category" })
    .min(1, "Provide sub risk category"),
  impact_description: z.string().min(1, "Impact description required"),
  impact_category: z
    .string({ required_error: "Provide impact category" })
    .min(1, "Provide impact category"),
  impact_sub_category: z
    .string({ required_error: "Provide sub category" })
    .min(1, "Provide sub category"),
  recurring_status: z.boolean().optional(),
  reportable: z.boolean().optional(),
  recommendation: z.string().min(1, "Provide recommendation"),
  management_action_plan: z.string().min(1, "Action plan needed"),
  regulatory: z.boolean().optional(),
  estimated_implementation_date: z.date({
    required_error: "Estimated date required",
  }),
  status: z
    .enum(["Not started", "In progress", "Completed", "Closed"])
    .optional()
    .default("Not started"),
  lod1_implementer: z.array(User),
  lod1_owner: z.array(User),
  observers: z.array(User),
  lod2_risk_manager: z.array(User),
  lod2_compliance_officer: z.array(User),
  lod3_audit_manager: z.array(User),
});

export const ModuleSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: "Provide module name" }),
  purchase_date: z.date().optional(),
  status: z.string().optional(),
});

export const OrganizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Organization name is required"),
  email: z.string().email(),
  telephone: z.string(),
  default: z.boolean().optional(),
  type: z
    .string({ required_error: "Organization type is required" })
    .min(1, "Organization type is required"),
  status: z.enum(["Active", "Inactive"]).optional(),
  website: z.string().url({ message: "Invalid website URL" }).optional(),
  created_at: z.string().datetime().optional(),
});

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Please provide member name"),
  email: z.string().email({ message: "Provide valid email please" }),
  telephone: z.string().optional(),
  role: z.string({ required_error: "Provide user role" }),
  title: z.string({ required_error: "Provide user title" }),
  module: z.string().optional(),
  type: z.string().optional(),
});

export const StaffSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Please provide staff name"),
  email: z.string().email().optional(),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date({ required_error: "End date is required" }),
  role: z.string().optional(),
});

export const IssueResponder = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  date_issued: z.date().optional(),
});

export const IssueResponsesSchema = z.object({
  id: z.string().optional(),
  notes: z.string(),
  attachments: z.array(z.string()),
  issued_by: IssueResponder,
  type: z.string(),
});

export const IssueDetailedSchema = z.object({
  id: z.string().optional(),
  reference: z.string().optional(),
  engagement_name: z.string().optional(),
  engagement_code: z.string().optional(),
  financial_year: z.date().optional(),
  overall_opinion_rating: z.string().optional(),
  issue_name: z.string().optional(),
  issue_rating: z.string(), // Could be narrowed to enum: z.enum(["Improvement Required", ...])
  issue_source: z.string(), // e.g., z.enum(["Internal Audit", ...])
  issue_criteria: z.string(),
  root_cause_description: z.string(),
  impact_description: z.string(),
  issue_recommendation: z.string(),
  issue_management_action_plan: z.string(),
  issue_reportable: z.boolean(),
  is_issue_sent_to_owner: z.string(), // e.g., z.enum(["Yes", "No"])
  date_issue_sent_to_client: z.nullable(z.string().datetime()), // ISO date format
  estimated_implementation_date: z.string().datetime(), // Can validate ISO 8601 date
  is_issue_revised: z.string(), // e.g., z.enum(["Yes", "No"])
  latest_revised_date: z.string().datetime(),
  actual_implementation_date: z.nullable(z.string().datetime()),
  issue_revised_count: z.number().int(),
  is_issue_pass_due: z.string(), // e.g., z.enum(["Yes", "No"])
  days_remaining_to_implementation: z.number().int(),
  issue_due_more_than_90_days: z.string(), // e.g., z.enum(["Yes", "No"])
  issue_due_more_than_365_days: z.string(), // e.g., z.enum(["Yes", "No"])
  issue_overall_status: z.string(), // e.g., z.enum(["Open", "Closed", ...])
  lod1_owner: z.string(), // Format: "Name <email>"
  lod1_implementer: z.string(),
  lod2_risk_manager: z.string(),
  lod2_compliance_officer: z.string(),
  lod3_audit_manager: z.string(), // Multiple entries separated by commas
  observers: z.string(), // Multiple entries separated by commas
  latest_response: z.nullable(z.any()),
});

export const RevieCommentReportSchema = z.object({
  title: z.string().optional(),
  reference: z.string().optional(),
  description: z.string().optional(),
  raised_by: IssueResponder,
  resolution_summary: z.string().optional(),
  resolution_details: z.string().optional(),
  resolved_by: IssueResponder,
  decision: z.string().optional(),
  status: z.string().optional(),
  href: z.string().optional(),
});

export const SummaryProceduresSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  process_rating: z.string().optional(),
  issue_count: z.number().int(),
  acceptable: z.number().int(),
  improvement_required: z.number().int(),
  significant_improvement_required: z.number().int(),
  unacceptable: z.number().int(),
  recurring_issues: z.number().int(),
});

export const ResolveTaskSchema = z.object({
  resolution_summary: z.string().min(1, "Resolution summary required"),
  resolution_details: z.string().min(1, "Resolution summary required"),
  resolved_by: IssueResponder.optional(),
});

export const ResolveReviewCommentSchema = z.object({
  resolution_summary: z.string().min(1, "Resolution summary required"),
  resolution_details: z.string().min(1, "Resolution summary required"),
  resolved_by: IssueResponder.optional(),
});

export const SummaryAuditProcessSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional().default("N/A"),
  status: z.string().optional().default("N/A"),
  process_rating: z.string().optional().default("N/A"),
  issue_count: z.number().int().default(0),
  acceptable: z.number().int().default(0),
  improvement_required: z.number().int().default(0),
  significant_improvement_required: z.number().int().default(0),
  unacceptable: z.number().int().default(0),
  recurring_issues: z.number().int().default(0),
});

export const SummaryFindingSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Provide issue title"),
  ref: z.string().optional(),
  criteria: z.string().min(1, "Criteria is required"),
  finding: z.string().min(1, "Povide finding weakness"),
  risk_rating: z
    .string({ required_error: "Providee risk rating" })
    .min(1, "Providee risk rating"),
  process: z
    .string({ required_error: "Provide process" })
    .min(1, "Provide process"),
  source: z
    .string({ required_error: "Provide issue source" })
    .min(1, "Provide issue source"),
  sdi_name: z.string().optional(),
  sub_process: z
    .string({ required_error: "Provide sub process" })
    .min(1, "Provide sub process"),
  root_cause_description: z.string().min(1, "Provide root cause description"),
  root_cause: z
    .string({ required_error: "Root cause required" })
    .min(1, "Root cause required"),
  sub_root_cause: z
    .string({ required_error: "Sub root cause is required" })
    .min(1, "Sub root cause is required"),
  risk_category: z
    .string({ required_error: "Provide risk category" })
    .min(1, "Provide risk category"),
  sub_risk_category: z
    .string({ required_error: "Provide sub risk category" })
    .min(1, "Provide sub risk category"),
  impact_description: z.string().min(1, "Impact description required"),
  impact_category: z
    .string({ required_error: "Provide impact category" })
    .min(1, "Provide impact category"),
  impact_sub_category: z
    .string({ required_error: "Provide sub category" })
    .min(1, "Provide sub category"),
  recurring_status: z.boolean().optional(),
  reportable: z.boolean().optional(),
  recommendation: z.string().min(1, "Provide recommendation"),
  management_action_plan: z.string().min(1, "Action plan needed"),
  regulatory: z.boolean().optional(),
  estimated_implementation_date: z.date({
    required_error: "Estimated date required",
  }),
  status: z
    .enum(["Not started", "In progress", "Completed", "Closed"])
    .optional()
    .default("Not started"),
  lod1_implementer: z.array(User),
  lod1_owner: z.array(User),
  observers: z.array(User),
  lod2_risk_manager: z.array(User),
  lod2_compliance_officer: z.array(User),
  lod3_audit_manager: z.array(User),
  date_opened: z.date().optional(),
  date_closed: z.date().optional(),
  date_revised: z.date().optional(),
  revised_status: z.boolean().default(false),
  revised_count: z.number().int().default(0),
  prepared_by: IssueResponder.optional(),
  reviewed_by: IssueResponder.optional(),
});

export const EngagementProfile = z.object({
  audit_background: z.record(z.any()),
  audit_objectives: z.record(z.any()),
  key_legislations: z.record(z.any()),
  relevant_systems: z.record(z.any()),
  key_changes: z.record(z.any()),
  reliance: z.record(z.any()),
  scope_exclusion: z.record(z.any()),
  core_risk: z.array(z.string()),
});

const PreparedReviewedBy = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  date_issued: z.string().optional(),
});

export const StandardTemplateSchema = z.object({
  id: z.string(),
  reference: z.string(),
  title: z.string(),
  objectives: z.object({
    value: z.string(),
  }),
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
  prepared_by: PreparedReviewedBy.optional(),
  reviewed_by: PreparedReviewedBy.optional(),
});

export const BusinessContactSchema = z.object({
  id: z.string().optional(),
  user: z.array(IssueResponder),
  type: z.string().optional(),
});

export type Search = {
  tag?: string;
  name?: string;
  value?: string;
};

type Body = {
  detail?: string;
};

export type ErrorHandlerSchema = {
  status?: number;
  body?: Body;
};
