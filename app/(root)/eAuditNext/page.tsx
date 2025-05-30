"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanSchema } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Folder, ListCollapse, Notebook, CircleGauge } from "lucide-react";
import "../../globals.css";
import { z } from "zod";
import { EauditDashboard } from "@/components/dashboards/eadit-next-dashboard";
import PropagateLoader from "react-spinners/PropagateLoader";
import { usePathname, useSearchParams } from "next/navigation";
import AnnualAuditPlanningTable from "@/components/data-table/annual_audit_planning-table";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SystemOptions } from "@/components/menus/system-options";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type AuditPlanType = z.infer<typeof PlanSchema>;

export default function AuditNextPage() {
  const pathname = usePathname();
  return (
    <Tabs defaultValue="dashboard" className="w-full flex-1 flex justify-start">
      <TabsList className="bg-blue-950 flex flex-col gap-1 rounded-none justify-start min-w-[300px] h-full">
        <section className="w-full px-2">
          <Label className="font-[helvetica] font-bold tracking-normal text-xl text-white">
            {pathname.slice(1)}
          </Label>
        </section>
        <Separator className="bg-neutral-400" />
        <section className="mt-2 flex flex-col w-full gap-[2px] flex-1">
          <TabsTrigger
            value="dashboard"
            className=" data-[state=active]:bg-black data-[state=active]:text-neutral-200 text-neutral-200 hover:dark:bg-neutral-800 font-table flex justify-start items-center gap-2 w-full h-[33px] font-bold">
            <CircleGauge size={16} strokeWidth={3} />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="audit_plan"
            className="data-[state=active]:bg-black data-[state=active]:text-neutral-200 text-neutral-200  hover:dark:bg-neutral-800 font-table flex justify-start items-center  gap-2 w-full h-[33px] font-bold">
            <Notebook size={16} strokeWidth={3} />
            Audit plans
          </TabsTrigger>
          <TabsTrigger
            value="follow_up"
            className="data-[state=active]:bg-black data-[state=active]:text-neutral-200 text-neutral-200 hover:dark:bg-neutral-800 font-table flex justify-start items-center  gap-2 w-full h-[33px] font-bold">
            <ListCollapse size={16} strokeWidth={3} />
            Follow up
          </TabsTrigger>
          <TabsTrigger
            value="report"
            className="data-[state=active]:bg-black data-[state=active]:text-neutral-200 text-neutral-200 hover:dark:bg-neutral-800 font-table flex justify-start items-center  gap-2 w-full h-[33px] font-bold">
            <Folder size={16} strokeWidth={3} />
            Reports
          </TabsTrigger>
        </section>
        <section className="w-full mb-1">
          <SystemOptions>
            <Button className="w-full h-[33px]">click</Button>
          </SystemOptions>
        </section>
      </TabsList>
      <section className="pl-3 flex-1">
        <TabsContent value="dashboard" className="flex-1">
          <EauditDashboard />
        </TabsContent>
        <TabsContent
          value="audit_plan"
          className=" flex flex-col flex-1 overflow-auto pt-2">
          <AnnualAuditPlan />
        </TabsContent>
        <TabsContent value="follow_up" className="flex-1"></TabsContent>
        <TabsContent value="report" className="flex-1"></TabsContent>
      </section>
    </Tabs>
  );
}

const AnnualAuditPlan = () => {
  const searchParams = useSearchParams();
  const [auditplans, setAuditPlans] = useState<AuditPlanType[]>([]);
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["_annual_plan_", searchParams.get("id")],
    queryFn: async (): Promise<AuditPlanType[]> => {
      const response = await fetch(
        `${BASE_URL}/annual_plans/${searchParams.get("id")}`,
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
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    enabled: !!searchParams.get("id"),
  });
  useEffect(() => {
    if (!isLoading && isSuccess) {
      const auditPlans = data?.sort((a: AuditPlanType, b: AuditPlanType) => {
        return (
          new Date(b.created_at ?? "").getTime() -
          new Date(a.created_at ?? "").getTime()
        );
      });
      setAuditPlans(auditPlans ?? []);
    }
  }, [isLoading, isSuccess, data]);

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center w-full">
        <PropagateLoader className="text-white" color="white" />
      </div>
    );
  }

  if (isSuccess) {
    return <AnnualAuditPlanningTable data={auditplans ?? []} />;
  }
};
