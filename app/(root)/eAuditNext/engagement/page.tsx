"use client";
import { useQueries } from "@tanstack/react-query";
import { Tabs, TabsContent } from "@/components/ui/tabs";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import z from "zod";
import { StandardTemplateSchema } from "@/lib/types";
import { Administration } from "./_administration/administration-home";
import { StandardTemplateProcedure } from "@/components/shared/standard-template-procedure";
import { SummaryProcedure } from "./_fieldwork/summary-procedures";
import { useSearchParams } from "next/navigation";
import { SummaryReviewComments } from "./_fieldwork/summary-review-comments";
import { Tasks } from "./_fieldwork/summary-tasks";
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
        queryKey: ["planning"],
        queryFn: async (): Promise<z.infer<typeof StandardTemplateSchema>[]> =>
          fetchData("planning_procedures", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["finalization"],
        queryFn: async (): Promise<z.infer<typeof StandardTemplateSchema>[]> =>
          fetchData("finalization_procedures", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["reporting"],
        queryFn: async (): Promise<z.infer<typeof StandardTemplateSchema>[]> =>
          fetchData("reporting_procedures", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
    ],
  });

  if (results[0].isLoading || results[1].isLoading || results[2].isLoading) {
    return <div>loading...</div>;
  }
  if (results[0].isError || results[1].isError || results[2].isError) {
    return <div>Error</div>;
  }

  return (
    <Tabs
      value={params.get("action") ?? "administation"}
      className="w-full flex-1 flex">
      <TabsContent
        value="administration"
        className="flex-1 text-white mt-0 flex w-full data-[state=inactive]:hidden">
        <Administration />
      </TabsContent>
      <TabsContent
        value="summary_procedures"
        className="flex-1 text-white mt-0">
        <SummaryProcedure />
      </TabsContent>
      <TabsContent
        value="summary_review_comments"
        className="flex-1 text-white mt-0">
        <SummaryReviewComments />
      </TabsContent>
      <TabsContent value="summary_tasks" className="flex-1 text-white mt-0">
        <Tasks />
      </TabsContent>

      {results[0].data?.map((item, index) => (
        <TabsContent
          value={item.reference}
          key={index}
          className="w-full data-[state=active]:flex-1 data-[state=inactive]:bg-white mt-0 data-[state=active]:flex">
          <StandardTemplateProcedure data={item} />
        </TabsContent>
      ))}

      {results[1].data?.map((item, index) => (
        <TabsContent
          value={item.reference}
          key={index}
          className="w-full data-[state=active]:flex-1 data-[state=inactive]:bg-white mt-0 data-[state=active]:flex">
          <StandardTemplateProcedure data={item} />
        </TabsContent>
      ))}

      {results[2].data?.map((item, index) => (
        <TabsContent
          value={item.reference}
          key={index}
          className="w-full data-[state=active]:flex-1 data-[state=inactive]:bg-white mt-0 data-[state=active]:flex">
          <StandardTemplateProcedure data={item} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
