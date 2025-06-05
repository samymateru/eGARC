"use client";
import { useQueries } from "@tanstack/react-query";
import { Tabs, TabsContent } from "@/components/ui/tabs";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import z from "zod";
import { IssueSchema, StandardTemplateSchema } from "@/lib/types";
import { Administration } from "./_administration/administration-home";
import { StandardTemplateProcedure } from "@/components/shared/standard-template-procedure";
import { SummaryProcedure } from "./_fieldwork/summary-procedures";
import { useSearchParams } from "next/navigation";
import { SummaryReviewComments } from "./_fieldwork/summary-review-comments";
import { Tasks } from "./_fieldwork/summary-tasks";
import { WorkProgramProcedure } from "@/components/shared/work_program_procedure";
import { Loader } from "@/components/shared/loader";
import { SummaryFindings } from "./_reporting/summary-findings";
import { IssueDetails } from "@/components/shared/issue-details";
import { EngagementDashboard } from "@/components/dashboards/engagement-dashboard";
import "@/app/globals.css";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SummaryProcess } from "./_reporting/summary-process";

type IssueValues = z.infer<typeof IssueSchema>;

type Procedure = {
  procedure_id?: string;
  procedure_title?: string;
};

type WorkProgramResponse = {
  id?: string;
  name?: string;
  procedures: Array<Procedure>;
};

const fetchData = async (endpont: string, id: string | null) => {
  const response = await fetch(`${BASE_URL}/engagements/${endpont}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        typeof window === "undefined" ? "" : localStorage.getItem("token")
      }`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch modules");
  }
  return await response.json();
};

export default function EngagementPage() {
  const params = useSearchParams();
  const results = useQueries({
    queries: [
      {
        queryKey: ["planning", params.get("id")],
        queryFn: async (): Promise<z.infer<typeof StandardTemplateSchema>[]> =>
          fetchData("planning_procedures", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["finalization", params.get("id")],
        queryFn: async (): Promise<z.infer<typeof StandardTemplateSchema>[]> =>
          fetchData("finalization_procedures", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["reporting", params.get("id")],
        queryFn: async (): Promise<z.infer<typeof StandardTemplateSchema>[]> =>
          fetchData("reporting_procedures", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["work_program", params.get("id")],
        queryFn: async (): Promise<WorkProgramResponse[]> =>
          fetchData("work_program", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["findings", params.get("id")],
        queryFn: async (): Promise<IssueValues[]> =>
          fetchData("summary_findings", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
    ],
  });

  if (
    results[0].isLoading ||
    results[1].isLoading ||
    results[2].isLoading ||
    results[3].isLoading
  ) {
    return <Loader size={15} />;
  }
  if (
    results[0].isError ||
    results[1].isError ||
    results[2].isError ||
    results[3].isError
  ) {
    return <div>Error</div>;
  }

  return (
    <Tabs
      value={params.get("action") ?? "dashboard"}
      className="w-full flex-1 flex flex-col">
      <TabsContent
        value="dashboard"
        className="flex-1 text-white mt-0 flex w-full data-[state=inactive]:hidden">
        <EngagementDashboard />
      </TabsContent>
      <TabsContent
        value="administration"
        className="flex-1 text-white mt-0 flex w-full data-[state=inactive]:hidden">
        <Administration />
      </TabsContent>
      <TabsContent
        value="summary_procedures"
        className="flex-1 text-white mt-0 ">
        <section className="pt-1 pl-4">
          <Label className="text-[20px] font-semibold">
            Summary of Procedures
          </Label>
        </section>
        <Separator className="my-2" />
        <SummaryProcedure />
      </TabsContent>
      <TabsContent
        value="summary_review_comments"
        className="flex-1 text-white mt-0">
        <section className="pt-1 pl-4">
          <Label className="text-[20px] font-semibold">
            Summary of Review Comments
          </Label>
        </section>
        <Separator className="my-2" />
        <SummaryReviewComments />
      </TabsContent>
      <TabsContent value="summary_tasks" className="flex-1 text-white mt-0">
        <section className="pt-1 pl-4">
          <Label className="text-[20px] font-semibold">Summary of Tasks</Label>
        </section>
        <Separator className="my-2" />
        <Tasks />
      </TabsContent>

      {results[0].data?.map((item, index) => (
        <TabsContent
          value={item.id}
          key={index}
          className="data-[state=inactive]:hidden data-[state=active]:flex-1 mt-0 data-[state=active]:flex">
          <StandardTemplateProcedure data={item} />
        </TabsContent>
      ))}

      {results[2].data?.map((item, index) => {
        if (item.type === "finding") {
          return (
            <TabsContent
              value={item.id}
              key={index}
              className="w-full data-[state=inactive]:hidden data-[state=active]:flex-1 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
              <SummaryFindings />
            </TabsContent>
          );
        }

        if (item.type === "audit_process") {
          return (
            <TabsContent
              value={item.id}
              key={index}
              className="w-full data-[state=inactive]:hidden data-[state=active]:flex-1 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
              <SummaryProcess />
            </TabsContent>
          );
        }
        return (
          <TabsContent
            value={item.id}
            key={index}
            className="w-full data-[state=inactive]:hidden data-[state=active]:flex-1 mt-0 data-[state=active]:flex">
            <StandardTemplateProcedure data={item} />
          </TabsContent>
        );
      })}

      {results[1].data?.map((item, index) => (
        <TabsContent
          value={item.id}
          key={index}
          className="w-full data-[state=inactive]:hidden data-[state=active]:flex-1 mt-0 data-[state=active]:flex">
          <StandardTemplateProcedure data={item} />
        </TabsContent>
      ))}

      {results[3].data?.map((item) =>
        item.procedures
          ?.filter(
            (procedure) => procedure.procedure_id && procedure.procedure_title
          )
          .map((procedure) => (
            <TabsContent
              value={procedure?.procedure_id ?? ""}
              key={procedure.procedure_id}
              className="w-full data-[state=inactive]:hidden data-[state=active]:flex-1  mt-0 data-[state=active]:flex">
              <WorkProgramProcedure id={procedure.procedure_id} />
            </TabsContent>
          ))
      )}
      {results[4].data?.map((item, index) => (
        <TabsContent
          value={item.id ?? ""}
          key={index}
          className="data-[state=inactive]:hidden data-[state=active]:flex-1 mt-0 data-[state=active]:flex overflow-auto">
          <IssueDetails data={item} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
