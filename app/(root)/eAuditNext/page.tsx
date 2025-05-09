"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanSchema } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  List,
  Folder,
  ListCollapse,
  Notebook,
  Package,
  CircleGauge,
} from "lucide-react";
import "../../globals.css";
import { z } from "zod";
import { ModuleDropdown } from "@/components/shared/module-dropdown";
import { EauditDashboard } from "@/components/dashboards/eadit-next-dashboard";
import { OptionsMenu } from "@/components/menus/options-menu";

import { useSearchParams } from "next/navigation";
import AnnualAuditPlanningTable from "@/components/data-table/annual_audit_planning-table";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type AuditPlanType = z.infer<typeof PlanSchema>;

export default function AuditNextPage() {
  return (
    <Tabs
      defaultValue="dashboard"
      className="w-full flex-1 flex flex-col justify-start">
      <TabsList className="bg-white dark:bg-background flex gap-1 rounded-none justify-start py-5 pl-1 w-full">
        <TabsTrigger
          value="dashboard"
          className="data-[state=active]:bg-orange-700 hover:dark:bg-neutral-800 font-serif tracking-wide scroll-m-0 flex gap-1 w-[120px]">
          <CircleGauge size={16} strokeWidth={3} />
          Dashboard
        </TabsTrigger>
        <TabsTrigger
          value="audit_plan"
          className="data-[state=active]:bg-orange-700 hover:dark:bg-neutral-800 font-serif tracking-wide scroll-m-0 flex gap-1 w-[120px]">
          <Notebook size={16} strokeWidth={3} />
          Audit plans
        </TabsTrigger>
        <TabsTrigger
          value="follow_up"
          className="data-[state=active]:bg-orange-700 hover:dark:bg-neutral-800 font-serif tracking-wide scroll-m-0 flex gap-1 w-[120px]">
          <ListCollapse size={16} strokeWidth={3} />
          Follow up
        </TabsTrigger>
        <TabsTrigger
          value="report"
          className="data-[state=active]:bg-orange-700 hover:dark:bg-neutral-800 font-serif tracking-wide scroll-m-0 flex gap-1 w-[120px]">
          <Folder size={16} strokeWidth={3} />
          Reports
        </TabsTrigger>
        <section className="flex-1 flex justify-end gap-1">
          <OptionsMenu>
            <Button className="dark:hover:bg-neutral-800 px-3 py-1 h-7 w-[120px]  dark:bg-background dark:text-neutral-400 font-serif font-semibold flex items-center gap-1">
              <List size={16} strokeWidth={3} />
              Options
            </Button>
          </OptionsMenu>
          <ModuleDropdown>
            <Button className="dark:hover:bg-neutral-800 px-3 py-1 h-7 w-[120px]  dark:bg-background dark:text-neutral-400 font-serif font-semibold flex items-center gap-1">
              <Package size={16} strokeWidth={3} />
              Modules
            </Button>
          </ModuleDropdown>
        </section>
      </TabsList>
      <section className="pl-3">
        <TabsContent value="dashboard" className="flex-1">
          <EauditDashboard />
        </TabsContent>
        <TabsContent value="audit_plan" className="flex-1">
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
    queryKey: ["_annual_plan_"],
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
        throw new Error("Failed to fetch modules");
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

  return <AnnualAuditPlanningTable data={auditplans ?? []} />;
};
