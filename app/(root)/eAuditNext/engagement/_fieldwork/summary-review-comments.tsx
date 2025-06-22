import { ReviewCommentsTable } from "@/components/data-table/review_comments-table";
import { Loader } from "@/components/shared/loader";
import { ReviewCommentsSchema } from "@/lib/types";
import { ErrorMessage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { z } from "zod";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ReviewCommentsValues = z.infer<typeof ReviewCommentsSchema>;

export const SummaryReviewComments = () => {
  const params = useSearchParams();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["_summary_review_comments_", params.get("id")],
    queryFn: async (): Promise<ReviewCommentsValues[]> => {
      const response = await fetch(
        `${BASE_URL}/engagements/fieldwork/summary_review_notes/${params.get(
          "id"
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
        }
      );
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          body: errorBody,
        };
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!params.get("id"),
  });

  useEffect(() => {
    if (isError) {
      ErrorMessage(error);
    }
  }, [isError, error]);

  const reviewComments = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const getRefNumber = (ref: string) =>
        parseInt(ref.replace(/[^\d]/g, ""), 10);
      return getRefNumber(b.reference) - getRefNumber(a.reference); // descending
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-full relative">
        <Loader title="Review comments" />
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-332px)]">
      <ReviewCommentsTable data={reviewComments ?? []} />
    </div>
  );
};
