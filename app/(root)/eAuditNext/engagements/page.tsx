"use client";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import z from "zod";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { CircleGauge, ListCollapse } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EngagementSchema } from "@/lib/types";
import EngagementTable from "@/components/data-table/engagement-table";
import { EngagementNavbar } from "@/components/top-navbars/engagement-navbar";

type EngagementsValues = z.infer<typeof EngagementSchema>;

export default function EngagementPage() {
  const searchParams = useSearchParams();
  const [engagements, setEngagements] = useState<EngagementsValues[]>([]);
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["_engagements_", searchParams.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/${searchParams.get("id")}`,
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
    enabled: !!searchParams.get("id"),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSuccess, data]);

  return (
    <Tabs className="w-full dark:bg-background" defaultValue="dashboard">
      <TabsList className="dark:bg-background w-full rounded-none py-5 pl-1">
        <section className="flex items-center justify-between w-full">
          <section className="flex items-center justify-start w-fit gap-1">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
              <CircleGauge size={16} strokeWidth={3} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="engagements"
              className="flex items-center gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
              <ListCollapse size={16} strokeWidth={3} />
              Engagements
            </TabsTrigger>
          </section>
          <section className="flex-1">
            <EngagementNavbar />
          </section>
        </section>
      </TabsList>
      <TabsContent value="dashboard" className="mt-0"></TabsContent>
      <TabsContent value="engagements" className="mt-0">
        <EngagementTable data={engagements ?? []} />
      </TabsContent>
    </Tabs>
  );
}
