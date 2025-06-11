import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { SummaryAuditProcessSchema } from "@/lib/types";
import { z } from "zod";
import { SummaryAuditProcessTable } from "@/components/data-table/summary-processes-table";

type SummaryAuditProcessValue = z.infer<typeof SummaryAuditProcessSchema>;

export const SummaryProcess = () => {
  const params = useSearchParams();
  const { data } = useQuery({
    queryKey: ["_summary_procedures_", params.get("id")],
    queryFn: async (): Promise<SummaryAuditProcessValue[]> => {
      const response = await fetch(
        `${BASE_URL}/engagements/summary_audit_process/${params.get("id")}`,
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

  return (
    <div className="w-[calc(100vw-320px)]">
      <SummaryAuditProcessTable data={data ?? []} />
    </div>
  );
};
