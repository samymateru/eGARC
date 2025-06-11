import { Response } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

type PreparedReviewedByValues = {
  name: string;
  email: string;
  date_issued: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const useStdTemplatePrepare = (
  action: string | null,
  resource: string
) => {
  const mutation = useMutation({
    mutationKey: ["_prepare_std_template_", action],
    mutationFn: async (data: PreparedReviewedByValues): Promise<Response> => {
      const token =
        typeof window === "undefined" ? "" : localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/engagements/procedure/prepare/${action}?resource=${resource}`,
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

export const useStdTemplateReview = (
  action: string | null,
  resource: string
) => {
  const mutation = useMutation({
    mutationKey: ["_review_std_template_", action],
    mutationFn: async (data: PreparedReviewedByValues): Promise<Response> => {
      const token =
        typeof window === "undefined" ? "" : localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/engagements/procedure/review/${action}?resource=${resource}`,
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
