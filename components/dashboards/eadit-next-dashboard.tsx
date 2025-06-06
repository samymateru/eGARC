import { useSearchParams } from "next/navigation";
import { IssueRecurringDonutChart } from "../shared/issue-recurring-donut-chart";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GradientBarChart } from "../shared/gradient-bar-chart";
import { AuditSummaryDonutChart } from "../shared/audit-summary-donut-chart";
import { EngagementSummaryDonutChart } from "../shared/engagement-summary-donut-chart";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { IssueStatusDonutChart } from "../shared/issue-status-donut-chart";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const allRootCauses = [
  "People",
  "Governance",
  "Process",
  "Financial",
  "ExternalFactors",
  "TechnologySystem",
];

const allImpactCategory = [
  "Reputational Impact",
  "Financial Impact",
  "Compliance & Regulatory Impact",
  "Strategic & Governance Impact",
  "Operational Impact",
];

export const EauditDashboard = () => {
  const params = useSearchParams();
  const [rootCause, setRootCause] = useState<Record<string, number>>();
  const [recurring, setRecurring] = useState<Record<string, number>>();
  const [process, setProcess] = useState<Record<string, number>>();
  const [issueStatus, setIssueStatus] = useState<Record<string, number>>();
  const [impactCategory, setImpactCategory] =
    useState<Record<string, number>>();
  const [auditSummary, setAuditSummary] = useState<Record<string, number>>();
  const [engagementSummary, setEngagementSummary] =
    useState<Record<string, number>>();

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["_eaudit_next_dashboard", params.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/dashboards/eauditNext/${params.get("id")}`,
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
            (data?.issues_data?.root_cause_summary || {})[cause] || 0;
        }
        return acc;
      }, {} as Record<string, number>);

      const impact = allImpactCategory.reduce((acc, cause) => {
        if (typeof cause === "string" || typeof cause === "number") {
          acc[cause] = (data?.issues_data?.impact_summary || {})[cause] || 0;
        }
        return acc;
      }, {} as Record<string, number>);

      const auditSummary = data?.audits_summary;
      const engagementSummary = data?.engagements_summary;
      const issueRecurring = data?.issues_data.recurring_summary;
      const issueStatus = data?.issues_data.status_summary;
      const topRatedProcess = data.issues_data.process_summary;
      setRootCause(root);
      setImpactCategory(impact);
      setAuditSummary(auditSummary);
      setEngagementSummary(engagementSummary);
      setRecurring(issueRecurring);
      setIssueStatus(issueStatus);
      setProcess(topRatedProcess);
    }
  }, [data, isLoading, isSuccess]);

  console.log(data?.issues_data?.impact_summary);
  if (isSuccess && data) {
    return (
      <section className="w-full flex flex-col h-[100vh]">
        <section className="py-2">
          <Label className="font-[helvetica] font-bold text-[24px] tracking-wide scroll-m-0 pl-3">
            eAuditNext Dashboard
          </Label>
          <Separator />
        </section>
        <section className="w-full flex-1 overflow-auto">
          <section className="flex flex-col">
            <section className="flex items-center gap-1 w-full">
              <AuditSummaryDonutChart data={auditSummary} />
              <EngagementSummaryDonutChart data={engagementSummary} />
            </section>
            <section className="flex items-center gap-1">
              <IssueStatusDonutChart data={issueStatus} />
              <IssueRecurringDonutChart data={recurring} />
            </section>
            <section className="flex items-center gap-1">
              <GradientBarChart
                title="Root Cause Insights"
                description=""
                color="#1e40af"
                data={rootCause}
              />
              <GradientBarChart
                title="Impact Category Insights"
                description=""
                color="#1e40af"
                data={impactCategory}
              />
            </section>
            <section className="flex items-center gap-1">
              <GradientBarChart
                title="Top Rated Processes"
                description=""
                color="#1e40af"
                data={process}
              />
            </section>
          </section>
        </section>
      </section>
    );
  }
};
