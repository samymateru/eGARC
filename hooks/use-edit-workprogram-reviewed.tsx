import { Response } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

type PreparedReviewedByValues = {
  name: string;
  email: string;
  date_issued: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const useWorkProgramProcedureReview = (action: string | null) => {
  const mutation = useMutation({
    mutationKey: ["_save_work_program_review"],
    mutationFn: async (data: PreparedReviewedByValues): Promise<Response> => {
      const token =
        typeof window === "undefined" ? "" : localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/engagements/sub_program/review/${action}`,
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
