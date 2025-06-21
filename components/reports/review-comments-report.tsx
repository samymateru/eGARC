import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ReviewCommentsReportTable from "../data-table/review-comments-report-table";
import { useEffect } from "react";
import { ErrorMessage } from "@/lib/utils";
import { Loader } from "../shared/loader";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ReviewCommentReport = () => {
  const params = useSearchParams();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["_review_comment_report_", params.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/reports/review_comments/${params.get("id")}`,
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

  if (isLoading) {
    return (
      <div className="w-[calc(100vw-310px)] h-[100vh] relative">
        <Loader title="Issue Reports" />
      </div>
    );
  }

  return (
    <section className="w-[calc(100vw-310px)]">
      <ReviewCommentsReportTable data={data ?? []} />
    </section>
  );
};
