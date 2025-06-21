import { EngagementProcessesTable } from "@/components/data-table/engagement-procesess-table";
import { Loader } from "@/components/shared/loader";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MonitorUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const EngagementProcesses = () => {
  const params = useSearchParams();
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["_engagement_processes_", params.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/context/engagement_process/${params.get(
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
        <Loader title="Engagement Processes" />
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-330px)] flex flex-col gap-2">
      <section>
        <Label className="font-helvetica-medium text-black pl-2 py-2 flex items-center gap-[5px]">
          <MonitorUp size={16} strokeWidth={2} className="mb-[2px]" />
          Engagement Processes
        </Label>
      </section>
      <EngagementProcessesTable data={data ?? []} />
    </div>
  );
};
