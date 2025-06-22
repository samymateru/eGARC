import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { SummaryAuditProcessSchema } from "@/lib/types";
import { z } from "zod";
import { SummaryAuditProcessTable } from "@/components/data-table/summary-processes-table";
import { Loader } from "@/components/shared/loader";
import { useEffect } from "react";
import { ErrorMessage } from "@/lib/utils";

type SummaryAuditProcessValue = z.infer<typeof SummaryAuditProcessSchema>;

export const SummaryProcess = () => {
  const params = useSearchParams();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["_summary_process_", params.get("id")],
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

  useEffect(() => {
    if (isError) {
      ErrorMessage(error);
    }
  }, [isError, error]);

  if (isLoading) {
    <div className="w-full h-full relative">
      <Loader title="Summary of Process" />
    </div>;
  }

  return (
    <div className="w-[calc(100vw-332px)]">
      <SummaryAuditProcessTable data={data ?? []} />
    </div>
  );
};
