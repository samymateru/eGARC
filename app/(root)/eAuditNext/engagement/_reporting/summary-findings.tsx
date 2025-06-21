import { IssueTable } from "@/components/data-table/issue-table";
import { Loader } from "@/components/shared/loader";
import { SummaryFindingSchema } from "@/lib/types";
import { ErrorMessage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type IssueValues = z.infer<typeof SummaryFindingSchema>;

export const SummaryFindings = () => {
  const params = useSearchParams();
  const [findings, setFindings] = useState<IssueValues[]>([]);
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["_summary_findinds_", params.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/summary_findings/${params.get("id")}`,
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

  useEffect(() => {
    if (!data) return;

    const sorted = [...data].sort((a, b) => a.ref.localeCompare(b.ref));
    setFindings(sorted);
  }, [data]);

  if (isLoading) {
    <div className="w-full h-full relative">
      <Loader title="Findings" />
    </div>;
  }

  return (
    <div className="w-[calc(100vw-332px)]">
      <IssueTable data={findings ?? []} />
    </div>
  );
};
