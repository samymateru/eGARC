import { SummaryProceduresTable } from "@/components/data-table/summary-procedures-table";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const SummaryProcedure = () => {
  const params = useSearchParams();
  const { data } = useQuery({
    queryKey: ["_summary_procedures_"],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/fieldwork/summary_procedures/${params.get(
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

  return <SummaryProceduresTable data={data ?? []} />;
};
