import { useQuery } from "@tanstack/react-query";
import { GradientBarChart } from "../shared/gradient-bar-chart";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReviewCommentsStatusPieChart } from "../shared/review-comments-status-pie-chart";
import { ProcedureStatusPieChart } from "../shared/procedure-status-pie-chart";
import { ColoredBarChart } from "../shared/colored-bar-chart";
import { Label } from "../ui/label";
import { Loader } from "../shared/loader";
import { ErrorQuery } from "../shared/error-query";
import { ErrorMessage } from "@/lib/utils";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const allRootCauses = [
  "People",
  "Governance",
  "Process",
  "Financial",
  "External factors",
  "Technology / Systems",
];

const labelMap: Record<string, string> = {
  Acceptable: "Acceptable",
  ImprovementRequired: "Improvement Required",
  SignificantImprovementRequired: "Significant Improvement Required",
  Unacceptable: "Unacceptable",
};

const allFindings = Object.keys(labelMap);

const findingColors = {
  Acceptable: "#22c55e",
  ImprovementRequired: "#fde047",
  SignificantImprovementRequired: "#f59e0b",
  Unacceptable: "#ef4444",
};

export const EngagementDashboard = () => {
  const params = useSearchParams();
  const [rootCause, setRootCause] = useState<Record<string, number>>();
  const [findingRating, setFindingRating] = useState<Record<string, number>>();
  const [procedure, setProcedure] = useState<Record<string, number>>();
  const [reviewComment, setReviewComment] = useState<Record<string, number>>();

  const { data, isSuccess, isError, error, isLoading } = useQuery({
    queryKey: ["_engagement_dashboard_", params.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/dashboards/eauditNext/engagement_details/${params.get(
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
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!params.get("id"),
  });

  useEffect(() => {
    if (isSuccess) {
      const root = allRootCauses.reduce((acc, cause) => {
        if (typeof cause === "string" || typeof cause === "number") {
          acc[cause] =
            (data?.issue_details?.root_cause_summary || {})[cause] || 0;
        }
        return acc;
      }, {} as Record<string, number>);

      const finding = allFindings.reduce((acc, cause) => {
        if (typeof cause === "string" || typeof cause === "number") {
          acc[cause] =
            (data?.issue_details?.risk_rating_summary || {})[labelMap[cause]] ||
            0;
        }

        return acc;
      }, {} as Record<string, number>);

      const procedureStatus = data.procedure_summary as Record<string, number>;
      const reviewCommentsStatus = data.review_comment as Record<
        string,
        number
      >;
      setRootCause(root);
      setFindingRating(finding);
      setProcedure(procedureStatus);
      setReviewComment(reviewCommentsStatus);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (isError) {
      ErrorMessage(error);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="w-full h-full relative">
        <Loader title="eAudit Next Dashboard" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex item-center justify-center relative">
        <ErrorQuery />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <section className="w-full flex flex-col pt-2">
        <section>
          <Label className="text-white font-serif text-[20px] font-semibold pl-4">
            Engagement Dashboard
          </Label>
        </section>
        <div className="w-full py-3 flex flex-col gap-2 h-[calc(100vh-136px)] hide-scrollbar overflow-auto">
          <section className="flex items-center gap-3 px-4">
            <section className="flex-1 bg-white h-full rounded-md">
              <GradientBarChart
                color="#3b82f6"
                data={rootCause}
                title="Root Cause Summary"
                description="Display the review comments status and their corresponding percentage"
              />
            </section>
            <section className="flex-1 bg-white h-full rounded-md">
              <ColoredBarChart
                colors={findingColors}
                data={findingRating}
                title="Audit Findings Rating"
                description="cause"
              />
            </section>
          </section>

          <section className="flex items-center gap-3 px-4">
            <section className="flex-1 bg-white h-full rounded-md">
              <ReviewCommentsStatusPieChart data={reviewComment} />
            </section>
            <section className="flex-1 bg-white h-full rounded-md">
              <ProcedureStatusPieChart data={procedure} />
            </section>
          </section>
        </div>
      </section>
    );
  }
};
