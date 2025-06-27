/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useQueries } from "@tanstack/react-query";
import { Tabs, TabsContent } from "@/components/ui/tabs";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import z from "zod";
import {
  SummaryFindingSchema,
  ReviewCommentsSchema,
  StandardTemplateSchema,
} from "@/lib/types";
import { Administration } from "./_administration/administration-home";
import { StandardTemplateProcedure } from "@/components/shared/standard-template-procedure";
import { SummaryProcedure } from "./_fieldwork/summary-procedures";
import { useSearchParams } from "next/navigation";
import { SummaryReviewComments } from "./_fieldwork/summary-review-comments";
import { WorkProgramProcedure } from "@/components/shared/work_program_procedure";
import { Loader } from "@/components/shared/loader";
import { SummaryFindings } from "./_reporting/summary-findings";
import { IssueDetails } from "@/components/shared/issue-details";
import { EngagementDashboard } from "@/components/dashboards/engagement-dashboard";
import "@/app/globals.css";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SummaryProcess } from "./_reporting/summary-process";
import { ReviewComment } from "./_fieldwork/review-comment";
import { SummaryTasks } from "./_fieldwork/summary-tasks";
import { Tasks } from "./_fieldwork/task";
import { ErrorQuery } from "@/components/shared/error-query";
import { ErrorMessage } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EngagementRatingForm } from "@/components/forms/engagement-rating-form";
import {
  AlertTriangle,
  ListTodo,
  MessageCircle,
  PanelLeft,
  Settings,
  Star,
} from "lucide-react";
import { RiskMaturityRatingTable } from "@/components/data-table/risk-maturity-table";

type IssueValues = z.infer<typeof SummaryFindingSchema>;
type CommentAndTaskValues = z.infer<typeof ReviewCommentsSchema>;

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
    const errorBody = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      body: errorBody,
    };
  }
  return await response.json();
};

export default function EngagementPage() {
  const [error, setError] = useState<boolean>(false);
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
        queryKey: ["_summary_findinds_", params.get("id")],
        queryFn: async (): Promise<IssueValues[]> =>
          fetchData("summary_findings", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["_summary_review_comments_", params.get("id")],
        queryFn: async (): Promise<CommentAndTaskValues[]> =>
          fetchData("fieldwork/summary_review_notes", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("action"),
      },
      {
        queryKey: ["_summary_tasks_", params.get("id")],
        queryFn: async (): Promise<CommentAndTaskValues[]> =>
          fetchData("fieldwork/summary_task", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("action"),
      },
    ],
  });

  useEffect(() => {
    if (results[0].isError) {
      if (!error) {
        ErrorMessage(results[0].error);
        setError(true);
      }
    }
    if (results[1].isError) {
      if (!error) {
        ErrorMessage(results[1].error);
        setError(true);
      }
    }
    if (results[2].isError) {
      if (!error) {
        ErrorMessage(results[2].error);
        setError(true);
      }
    }
    if (results[3].isError) {
      if (!error) {
        ErrorMessage(results[3].error);
        setError(true);
      }
    }
    if (results[4].isError) {
      if (!error) {
        ErrorMessage(results[4].error);
        setError(true);
      }
    }
    if (results[5].isError) {
      if (!error) {
        ErrorMessage(results[5].error);
        setError(true);
      }
    }
    if (results[6].isError) {
      if (!error) {
        ErrorMessage(results[6].error);
        setError(true);
      }
    }
  }, [results]);

  if (
    results[0].isLoading ||
    results[1].isLoading ||
    results[2].isLoading ||
    results[3].isLoading ||
    results[4].isLoading ||
    results[5].isLoading ||
    results[6].isLoading
  ) {
    return (
      <div className="w-full h-full relative">
        <Loader title="Engagement" />
      </div>
    );
  }

  if (
    results[0].isError ||
    results[1].isError ||
    results[2].isError ||
    results[3].isError ||
    results[4].isError ||
    results[5].isError ||
    results[6].isError
  ) {
    return (
      <div className="w-full h-full relative">
        <ErrorQuery />
      </div>
    );
  }

  return (
    <Tabs
      value={params.get("action") ?? "dashboard"}
      className="w-full flex-1 h-full flex flex-col">
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
        <section className="pt-[4px] pl-2 flex items-center gap-2">
          <section>
            <Button className="w-[28px] flex justify-center items-center h-[28px]">
              <PanelLeft size={16} strokeWidth={3} />
            </Button>
          </section>
          <Separator
            orientation="vertical"
            className="bg-neutral-400 h-[28px] mx-2"
          />
          <section>
            <Settings
              size={16}
              strokeWidth={2}
              className="inline-block text-black mb-1 mr-2"
            />
            <Label className="font-helvetica-medium text-black">
              Summary of Procedures
            </Label>
          </section>
        </section>
        <Separator className="mt-1 mb-3 bg-neutral-500" />
        <SummaryProcedure />
      </TabsContent>
      <TabsContent
        value="summary_review_comments"
        className="flex-1 text-white mt-0">
        <section className="pt-[4px] pl-2 flex items-center gap-2">
          <section>
            <Button className="w-[28px] flex justify-center items-center h-[28px]">
              <PanelLeft size={16} strokeWidth={3} />
            </Button>
          </section>
          <Separator
            orientation="vertical"
            className="bg-neutral-400 h-[28px] mx-2"
          />
          <section>
            <MessageCircle
              size={16}
              strokeWidth={2}
              className="inline-block text-black mb-1 mr-2"
            />
            <Label className="font-helvetica-medium text-black">
              Summary of Review Comments
            </Label>
          </section>
        </section>
        <Separator className="mt-1 mb-3 bg-neutral-500" />
        <SummaryReviewComments />
      </TabsContent>
      <TabsContent value="summary_tasks" className="flex-1 text-white mt-0">
        <section className="pt-[4px] pl-2 flex items-center gap-2">
          <section>
            <Button className="w-[28px] flex justify-center items-center h-[28px]">
              <PanelLeft size={16} strokeWidth={3} />
            </Button>
          </section>
          <Separator
            orientation="vertical"
            className="bg-neutral-400 h-[28px] mx-2"
          />
          <section>
            <ListTodo
              size={16}
              strokeWidth={2}
              className="inline-block text-black mb-1 mr-2"
            />
            <Label className="font-helvetica-medium text-black">
              Summary of Tasks
            </Label>
          </section>
        </section>
        <Separator className="mt-1 mb-3 bg-neutral-500" />
        <SummaryTasks />
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
              <section className="pt-[4px] px-2 flex items-center justify-between">
                <section className="flex items-center gap-2">
                  <section>
                    <Button className="w-[28px] flex justify-center items-center h-[28px]">
                      <PanelLeft size={16} strokeWidth={3} />
                    </Button>
                  </section>
                  <Separator
                    orientation="vertical"
                    className="bg-neutral-400 h-[28px] mx-2"
                  />
                  <section>
                    <AlertTriangle
                      size={16}
                      strokeWidth={2}
                      className="inline-block text-red-500 mb-1 mr-2"
                    />
                    <Label className="font-helvetica-medium text-black">
                      Summary of Findings/Issue
                    </Label>
                  </section>
                </section>
                <section></section>
              </section>
              <Separator className="mt-1 mb-3 bg-neutral-500" />
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
              <section className="pt-[4px] px-2 flex items-center justify-between">
                <section className="flex items-center gap-2">
                  <section>
                    <Button className="w-[28px] flex justify-center items-center h-[28px]">
                      <PanelLeft size={16} strokeWidth={3} />
                    </Button>
                  </section>
                  <Separator
                    orientation="vertical"
                    className="bg-neutral-400 h-[28px] mx-2"
                  />
                  <section>
                    <Star
                      size={16}
                      strokeWidth={2}
                      className="inline-block text-black mb-1 mr-2"
                    />
                    <Label className="font-helvetica-medium text-black">
                      Summary of Process
                    </Label>
                  </section>
                </section>
                <section>
                  <EngagementRatingForm
                    title="Engagement Rating"
                    endpoint=""
                    id={"sam"}>
                    <Button className="w-[130px] h-7 flex items-center justify-start action text-white font-helvetica-13">
                      <Star size={16} strokeWidth={2} />
                      Rate
                    </Button>
                  </EngagementRatingForm>
                </section>
              </section>
              <Separator className="mt-1 mb-3 bg-neutral-500" />
              <section className="flex flex-col gap-3 h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto">
                <section>
                  <SummaryProcess />
                </section>
                <section className="self-start">
                  <RiskMaturityRatingTable />
                </section>
              </section>
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
          className="data-[state=inactive]:hidden data-[state=active]:flex-1 mt-0 data-[state=active]:flex overflow-auto hide-scrollbar">
          <IssueDetails data={item} />
        </TabsContent>
      ))}

      {results[5].data?.map((item, index) => (
        <TabsContent
          value={item.id ?? ""}
          key={index}
          className="data-[state=inactive]:hidden data-[state=active]:flex-1 mt-0 data-[state=active]:flex h-full">
          <ReviewComment review_comment={item} />
        </TabsContent>
      ))}
      {results[6].data?.map((item, index) => (
        <TabsContent
          value={item.id ?? ""}
          key={index}
          className="data-[state=inactive]:hidden data-[state=active]:flex-1 mt-0 data-[state=active]:flex h-full">
          <Tasks task={item} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
