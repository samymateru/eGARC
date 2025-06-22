import { TasksTable } from "@/components/data-table/tasks-table";
import { Loader } from "@/components/shared/loader";
import { TasksSchema } from "@/lib/types";
import { ErrorMessage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { z } from "zod";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
type TasksValues = z.infer<typeof TasksSchema>;

export const SummaryTasks = () => {
  const params = useSearchParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["_summary_tasks_", params.get("id")],
    queryFn: async (): Promise<TasksValues[]> => {
      const response = await fetch(
        `${BASE_URL}/engagements/fieldwork/summary_task/${params.get("id")}`,
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

  const tasks = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const getRefNumber = (ref: string) =>
        parseInt(ref.replace(/[^\d]/g, ""), 10);
      return getRefNumber(b.reference) - getRefNumber(a.reference); // descending
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-full relative">
        <Loader title="Tasks" />
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-332px)]">
      <TasksTable data={tasks ?? []} />
    </div>
  );
};
