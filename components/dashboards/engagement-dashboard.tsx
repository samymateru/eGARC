import { useQuery } from "@tanstack/react-query";
import { Chart } from "../shared/hello";
import { useSearchParams } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const EngagementDashboard = () => {
  const params = useSearchParams();

  const { data } = useQuery({
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!params.get("id"),
  });

  const rootCauseSummary = {
    People: 1,
    Governance: 1,
    Process: 4,
    Financial: 1,
    ExternalFactors: 3,
    TechnologySystem: 1,
  };

  const colors = {
    People: "#4f46e5",
    Governance: "#16a34a",
  };
  console.log(data);
  return (
    <div className="w-full mx-10">
      <Chart
        data={rootCauseSummary}
        colors={colors}
        title="Root Cause Summary"
        description="cause"
      />
    </div>
  );
};
