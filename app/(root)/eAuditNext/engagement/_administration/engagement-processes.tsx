import { EngagementProcessesTable } from "@/components/data-table/engagement-procesess-table";
import { useQuery } from "@tanstack/react-query";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const EngagementProcesses = () => {
  const { data } = useQuery({
    queryKey: ["_engagement_processes_"],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/context/engagement_process/${"0d19fb18dd59"}`,
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
        throw new Error("Failed to fetch ");
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return <EngagementProcessesTable data={data ?? []} />;
};
