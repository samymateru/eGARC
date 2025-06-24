"use client";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import z from "zod";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EngagementSchema } from "@/lib/types";
import EngagementTable from "@/components/data-table/engagement-table";
import { AnnuaPlanDashboard } from "@/components/dashboards/annual-plan-dashboard";
import { ErrorMessage } from "@/lib/utils";
import { Loader } from "@/components/shared/loader";
import { ErrorQuery } from "@/components/shared/error-query";
import { EauditNavbar } from "@/components/top-navbars/eaudit-navbar";
import { BreadCrumbNavbar } from "@/components/shared/breadcrum-nav";
import { Separator } from "@/components/ui/separator";

type EngagementsValues = z.infer<typeof EngagementSchema>;

export default function EngagementPage() {
  const [engagements, setEngagements] = useState<EngagementsValues[]>([]);
  const params = useSearchParams();
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["_engagements_", params.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/${params.get("id")}`,
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
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!params.get("id"),
  });

  useEffect(() => {
    if (!isLoading && isSuccess) {
      const sortedEngagements = data?.sort(
        (a: EngagementsValues, b: EngagementsValues) => {
          return (
            new Date(b.created_at ?? "").getTime() -
            new Date(a.created_at ?? "").getTime()
          );
        }
      );
      setEngagements(sortedEngagements ?? []);
    }
    if (isError) {
      ErrorMessage(error);
    }
  }, [isLoading, isSuccess, data, isError, error]);

  if (isLoading) {
    return (
      <div className="relative w-[100vw] h-[100vh]">
        <Loader title="Engagements" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[100vw] h-[100vh] relative">
        <ErrorQuery />
      </div>
    );
  }
  if (isSuccess && data) {
    return (
      <Tabs
        className="w-[100vw] h-[100vh] flex flex-col gap-[6px]"
        defaultValue="engagements">
        <TabsList className="w-ful h-fit bg-white rounded-none flex flex-col gap-4 my-1">
          <EauditNavbar />
          <section className="self-start pl-4">
            <BreadCrumbNavbar />
          </section>
        </TabsList>
        <Separator className="my-1 bg-neutral-800" />
        <TabsContent
          value="engagements"
          className="w-[100vw] px-2 flex flex-col gap-2 flex-1 mt-0 overflow-x-hidden overflow-y-auto hide-scrollbar">
          <AnnuaPlanDashboard value={100} />
          <EngagementTable data={engagements ?? []} />
        </TabsContent>
      </Tabs>
    );
  }
}
