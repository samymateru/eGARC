import { Response } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

type SaveWorkProgramProcedure = {
  brief_description?: string;
  audit_objective?: string;
  test_description?: string;
  test_type?: string;
  sampling_approach?: string;
  results_of_test?: string;
  observation?: string;
  extended_testing?: boolean;
  extended_procedure?: string;
  extended_results?: string;
  effectiveness?: string;
  conclusion?: string;
};
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // Use env variable

export const useSaveWorkProgramProcedure = (action: string | null) => {
  const mutation = useMutation({
    mutationKey: ["_save_work_program_procedure"],
    mutationFn: async (data: SaveWorkProgramProcedure): Promise<Response> => {
      const token =
        typeof window === "undefined" ? "" : localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/engagements/sub_program/save/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          body: errorBody,
        };
      }

      return response.json();
    },
  });

  return mutation;
};
