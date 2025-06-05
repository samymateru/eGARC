import { useQuery } from "@tanstack/react-query";
import { GradientBarChart } from "../shared/gradient-bar-chart";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReviewCommentsStatusPieChart } from "../shared/review-comments-status-pie-chart";
import { ProcedureStatusPieChart } from "../shared/procedure-status-pie-chart";
import { ColoredBarChart } from "../shared/colored-bar-chart";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const allRootCauses = [
  "People",
  "Governance",
  "Process",
  "Financial",
  "ExternalFactors",
  "TechnologySystem",
];

const labelMap: Record<string, string> = {
  Acceptable: "Acceptable",
  ImprovementRequired: "Improvement Required",
  SignificantImprovementRequired: "Significant Improvement Required",
  Unacceptable: "Unacceptable",
};

const allFindings = Object.keys(labelMap);

const findingColors = {
  Acceptable: "#15803d",
  ImprovementRequired: "rgb(234, 179, 8)",
  SignificantImprovementRequired: "#b45309",
  Unacceptable: "#dc2626",
};

export const EngagementDashboard = () => {
  const params = useSearchParams();
  const [rootCause, setRootCause] = useState<Record<string, number>>();
  const [findingRating, setFindingRating] = useState<Record<string, number>>();

  const [procedure, setProcedure] = useState<Record<string, number>>();
  const [reviewComment, setReviewComment] = useState<Record<string, number>>();

  const { data, isSuccess } = useQuery({
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

  if (isSuccess) {
    return (
      <div className="w-full h-[calc(100vh-50px)] overflow-auto flex flex-col gap-2 pt-2">
        <section>
          <Label className="text-[25px] font-semibold font-[helvetica] tracking-wide scroll-m-0 mx-2">
            Engagement Dashboard
          </Label>
        </section>
        <Separator />
        <section className="flex items-center gap-1">
          <GradientBarChart
            color="blue"
            data={rootCause}
            title="Root Cause Summary"
            description="cause"
          />
          <Separator orientation="vertical" />
          <ColoredBarChart
            colors={findingColors}
            data={findingRating}
            title="Audit Findings Rating"
            description="cause"
          />
        </section>

        <section className="flex items-center gap-1 mb-2">
          <section className="flex-1">
            <ReviewCommentsStatusPieChart data={reviewComment} />
          </section>
          <Separator orientation="vertical" />
          <section className="flex-1">
            <ProcedureStatusPieChart data={procedure} />
          </section>
        </section>
      </div>
    );
  }
};
