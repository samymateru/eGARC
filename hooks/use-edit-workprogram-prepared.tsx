import { Response } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

type PreparedReviewedByValues = {
  name: string;
  email: string;
  date_issued: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // Use env variable

export const useWorkProgramProcedurePrepare = (action: string | null) => {
  const mutation = useMutation({
    mutationKey: ["_save_work_program_prepare"],
    mutationFn: async (data: PreparedReviewedByValues): Promise<Response> => {
      const token =
        typeof window === "undefined" ? "" : localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/engagements/sub_program/prepare/${action}`,
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
