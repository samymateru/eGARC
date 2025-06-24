import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ErrorMessage } from "@/lib/utils";
import { Calendar, CalendarClock, ListTodo, Notebook } from "lucide-react";
import { z } from "zod";
import { PlanSchema } from "@/lib/types";
import { Separator } from "../ui/separator";
import { AnnualPlanBarchart } from "./annual-plan-barchar";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AnnuaPlanDashboardProps {
  value: number;
}

type PlanDetailsValues = z.infer<typeof PlanSchema>;

type DashBoard = {
  total: number;
  completed: number;
  pending: number;
  ongoing: number;
  [key: string]: number; // Add index signature for dynamic access
};

const statusColors = {
  Completed: "#22c55e",
  Ongoing: "#f59e0b",
  Pending: "#ef4444",
};

const statusMap: Record<string, string> = {
  Completed: "completed",
  Ongoing: "ongoing",
  Pending: "pending",
};

const allStatus = Object.keys(statusMap);

export const AnnuaPlanDashboard = ({}: AnnuaPlanDashboardProps) => {
  const params = useSearchParams();
  const [status, setStatus] = useState<Record<string, number>>();

  const { data, isError, error, isSuccess } = useQuery({
    queryKey: ["_eaudit_plan_details_", params.get("id")],
    queryFn: async (): Promise<DashBoard> => {
      const response = await fetch(
        `${BASE_URL}/dashboards/eauditNext/plan_details/${params.get("id")}`,
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

  const {
    data: planData,
    isError: isPlanError,
    error: planError,
  } = useQuery({
    queryKey: ["_plan_data_", params.get("id")],
    queryFn: async (): Promise<PlanDetailsValues> => {
      const response = await fetch(
        `${BASE_URL}/annual_plans/plan/${params.get("id")}`,
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
    if (isSuccess) {
      const status = allStatus.reduce((acc, cause) => {
        if (typeof cause === "string" || typeof cause === "number") {
          acc[cause] = (data || {})[statusMap[cause]] || 0;
        }

        return acc;
      }, {} as Record<string, number>);
      setStatus(status);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError || isPlanError) {
      ErrorMessage(error);
      ErrorMessage(planError);
    }
  }, [isError, error, planError, isPlanError]);

  console.log(planData);

  return (
    <section className="flex items-center justify-center w-[100vw] mb-2">
      <section className="w-1/2 h-fit py-6 bg-neutral-100 flex shadow-md shadow-blue-400 flex-col gap-2 p-5 rounded-lg">
        <section className="flex">
          <Label className="font-helvetica-medium">Plan Details</Label>
        </section>
        <Separator className="bg-neutral-500" />
        <section className="flex w-full items-center justify-start gap-2">
          <section className="flex-1 flex flex-col items-start gap-[10px] h-full">
            <section className="flex items-start gap-1">
              <Label className="font-helvetica-14 text-black flex items-center gap-1">
                <Notebook size={16} strokeWidth={2} />
                Name:
              </Label>
              <Label className="font-helvetica-13 text-black mt-[1px]">
                {planData?.name}
              </Label>
            </section>
            <section className="flex items-start gap-1">
              <Label className="font-helvetica-14 text-black flex items-center gap-1">
                <CalendarClock size={16} strokeWidth={2} />
                Status:
              </Label>
              <Label className="font-helvetica-13 text-black mt-[1px]">
                {planData?.status}
              </Label>
            </section>
            <section className="flex items-start gap-1">
              <Label className="font-helvetica-14 text-black flex items-center gap-1">
                <Calendar size={16} strokeWidth={2} />
                Year:
              </Label>
              <Label className="font-helvetica-13 text-black mt-[1px]">
                {planData?.year}
              </Label>
            </section>
            <section className="flex items-start gap-1">
              <Label className="font-helvetica-14 text-black flex items-center gap-1">
                <Calendar size={16} strokeWidth={2} />
                Start:
              </Label>
              <Label className="font-helvetica-13 text-black mt-[1px]">
                {planData
                  ? new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(planData.start))
                  : ""}
              </Label>
            </section>
            <section className="flex items-start gap-1">
              <Label className="font-helvetica-14 text-black flex items-center gap-1">
                <Calendar size={16} strokeWidth={2} />
                End:
              </Label>
              <Label className="font-helvetica-13 text-black mt-[1px]">
                {planData
                  ? new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(planData.end))
                  : ""}
              </Label>
            </section>
            <section className="flex items-start gap-1">
              <Label className="font-helvetica-14 text-black flex items-center gap-1">
                <ListTodo size={16} strokeWidth={2} />
                Total Engagements:
              </Label>
              <Label className="font-helvetica-13 text-black mt-[1px]">
                {data?.total}
              </Label>
            </section>
          </section>
          <section className="flex-1">
            <AnnualPlanBarchart colors={statusColors} data={status} />
          </section>
        </section>
      </section>
    </section>
  );
};
