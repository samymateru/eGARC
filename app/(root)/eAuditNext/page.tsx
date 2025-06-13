"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanSchema } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  Folder,
  ListCollapse,
  Notebook,
  CircleGauge,
  TriangleAlert,
  MessageCircle,
  Reply,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
import { IssueDetailedReport } from "@/components/reports/issue-detailed-report";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReviewCommentReport } from "@/components/reports/review-comments-report";
import SearchBar from "@/components/shared/search";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type AuditPlanType = z.infer<typeof PlanSchema>;

export default function AuditNextPage() {
  const pathname = usePathname();
  return (
    <Tabs defaultValue="dashboard" className="flex-1 flex">
      <TabsList className="bg-neutral-300 flex flex-col gap-1 rounded-none justify-start min-w-[300px] h-full">
        <section className="w-full px-2">
          <Label className="font-[helvetica] font-bold tracking-normal text-xl text-black">
            {pathname.slice(1)}
          </Label>
        </section>
        <Separator className="bg-neutral-400" />
        <section className="mt-2 flex flex-col w-full gap-[2px] flex-1">
          <TabsTrigger
            value="dashboard"
            className="h-[33px] text-black data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-900 w-full flex justify-start gap-2 items-center font-[helvetica] rounded-none tracking-wide scroll-m-0 font-semibold">
            <CircleGauge size={16} strokeWidth={3} />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="audit_plan"
            className="h-[33px] text-black data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-900 w-full flex justify-start gap-2 items-center font-[helvetica] rounded-none tracking-wide scroll-m-0 font-semibold">
            <Notebook size={16} strokeWidth={3} />
            Audit plans
          </TabsTrigger>
          <TabsTrigger
            value="follow_up"
            className="h-[33px] text-black data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-900 w-full flex justify-start gap-2 items-center font-[helvetica] rounded-none tracking-wide scroll-m-0 font-semibold">
            <ListCollapse size={16} strokeWidth={3} />
            Follow up
          </TabsTrigger>
          <TabsTrigger
            value="report"
            className="h-[33px] text-black data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-900 w-full flex justify-start gap-2 items-center font-[helvetica] rounded-none tracking-wide scroll-m-0 font-semibold">
            <Folder size={16} strokeWidth={3} />
            Reports
          </TabsTrigger>
        </section>
        <section className="w-full mb-1">
          <SearchBar className="bg-black" />
          <SystemOptions>
            <Button className="w-full h-[33px] bg-black" variant="ghost">
              Options
            </Button>
          </SystemOptions>
        </section>
      </TabsList>
      <section className="w-[calc(100vw-300px)] h-[100vh] flex">
        <TabsContent value="dashboard" className="flex-1 mt-0">
          <EauditDashboard />
        </TabsContent>
        <TabsContent value="audit_plan" className="flex-1 mt-0">
          <AnnualAuditPlan />
        </TabsContent>
        <TabsContent value="follow_up" className="flex-1 mt-0"></TabsContent>
        <TabsContent value="report" className="flex-1 mt-0">
          <Reporting />
        </TabsContent>
      </section>
    </Tabs>
  );
}

const AnnualAuditPlan = () => {
  const params = useSearchParams();
  const [auditplans, setAuditPlans] = useState<AuditPlanType[]>([]);
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["_annual_plan_", params.get("id")],
    queryFn: async (): Promise<AuditPlanType[]> => {
      const response = await fetch(
        `${BASE_URL}/annual_plans/${params.get("id")}`,
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
    enabled: !!params.get("id"),
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
    return (
      <div className="w-[calc(100vw-300px)]">
        <AnnualAuditPlanningTable data={auditplans ?? []} />
      </div>
    );
  }
};

const Reporting = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState("issue");

  const menuItems = [
    {
      value: "issue",
      label: "Issue",
      icon: <TriangleAlert size={16} strokeWidth={3} />,
    },
    {
      value: "comments",
      label: "Comments",
      icon: <MessageCircle size={16} strokeWidth={3} />,
    },
    {
      value: "responses",
      label: "Responses",
      icon: <Reply size={16} strokeWidth={3} />,
    },
    {
      value: "audits",
      label: "Audits",
      icon: <CheckCircle size={16} strokeWidth={3} />,
    },
  ];
  return (
    <Tabs
      defaultValue="issue"
      value={tabValue}
      onValueChange={setTabValue}
      className="flex-1">
      <div className="flex items-center justify-between px-2 pt-2">
        <Label className="font-[helvetica] font-bold text-[24px] tracking-wide scroll-m-1">
          {tabValue === "issue"
            ? "Issues Report"
            : tabValue === "comments"
            ? "Review Comments Report"
            : tabValue === "responses"
            ? "Responses Report"
            : "Report"}
        </Label>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-[200px] font-bold justify-between flex items-center h-7 bg-blue-700 text-white">
              <span className="flex item-center gap-1">
                {menuItems.find((item) => item.value === tabValue)?.icon}
                {menuItems.find((item) => item.value === tabValue)?.label}
              </span>
              <span>
                {open ? (
                  <ChevronUp size={16} strokeWidth={3} />
                ) : (
                  <ChevronDown size={16} strokeWidth={3} />
                )}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[250px]">
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onSelect={() => setTabValue(item.value)}
                className="flex items-center gap-2 w-full h-[30px] justify-start hover:bg-neutral-800 cursor-pointer rounded-md pl-2">
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TabsContent value="issue" className="flex-1">
        <IssueDetailedReport />
      </TabsContent>
      <TabsContent value="comments" className="flex-1">
        <ReviewCommentReport />
      </TabsContent>
      <TabsContent value="responses">
        {/* Replace with your Responses component */}
        Responses section
      </TabsContent>
    </Tabs>
  );
};
