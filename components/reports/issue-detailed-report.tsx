import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import IssueDetailedTable from "../data-table/issue-detailed-table";
import { Separator } from "../ui/separator";
import { useEffect } from "react";
import { ErrorMessage } from "@/lib/utils";
import { Loader } from "../shared/loader";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const IssueDetailedReport = () => {
  const params = useSearchParams();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["_issue_detailed_", params.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/reports/issue_detailed/${params.get("id")}`,
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
      <div className="w-[calc(100vw-300px)] h-[100vh] relative">
        <Loader title="Issue Reports" />
      </div>
    );
  }

  return (
    <section className="w-full">
      <Separator className="my-2" />
      <IssueDetailedTable data={data ?? []} />
    </section>
  );
};
