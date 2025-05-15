import { useQuery } from "@tanstack/react-query";
import { SummaryAuditProgramSchema } from "@/lib/types";
import z from "zod";
import { useSearchParams } from "next/navigation";
import { SummaryAuditProgramTable } from "@/components/data-table/summary-audit-program";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type SummaryAuditProgramValues = z.infer<typeof SummaryAuditProgramSchema>;

export const SummaryAuditProgram = () => {
  const params = useSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ["_summary_program_", params.get("id")],
    queryFn: async (): Promise<SummaryAuditProgramValues[]> => {
      const response = await fetch(
        `${BASE_URL}/engagements/summary_audit_program/${params.get("id")}`,
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
    refetchOnMount: false,
    refetchOnReconnect: true,
    enabled: !!params.get("id"),
  });
  if (isLoading) {
    return <div>loading...</div>;
  }
  return (
    <section>
      <SummaryAuditProgramTable data={data ?? []} />
    </section>
  );
};
