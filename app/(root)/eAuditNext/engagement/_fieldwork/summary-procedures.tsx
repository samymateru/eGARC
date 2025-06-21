import { SummaryProceduresTable } from "@/components/data-table/summary-procedures-table";
import { Loader } from "@/components/shared/loader";
import { ErrorMessage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const SummaryProcedure = () => {
  const params = useSearchParams();
  const { data, isLoading, isError, error } = useQuery({
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

  useEffect(() => {
    if (isError) {
      ErrorMessage(error);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="w-full h-full relative">
        <Loader title="Summary of procedures" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-[calc(100vw-332px)]">
      <SummaryProceduresTable data={data ?? []} />
    </div>
  );
};
