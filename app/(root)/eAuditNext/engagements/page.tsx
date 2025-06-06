"use client";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import z from "zod";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EngagementSchema } from "@/lib/types";
import EngagementTable from "@/components/data-table/engagement-table";
import { EngagementNavbar } from "@/components/top-navbars/engagement-navbar";
import { EngagementForm } from "@/components/forms/engagement-form";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { AnnuaPlanDashboard } from "@/components/dashboards/annual-plan-dashboard";
import { Label } from "@/components/ui/label";

type EngagementsValues = z.infer<typeof EngagementSchema>;

export default function EngagementPage() {
  const searchParams = useSearchParams();
  const [engagements, setEngagements] = useState<EngagementsValues[]>([]);
  const params = useSearchParams();
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
    <Tabs
      className="w-full dark:bg-background flex flex-col gap-[6px]"
      defaultValue="engagements">
      <TabsList className="bg-neutral-300 w-full rounded-none flex gap-1 justify-start py-5 pl-1">
        <section className="flex items-center justify-between w-full">
          <section className="flex-1">
            <Label className="text-black font-bold text-[25px] pl-2">
              {params.get("plan")}
            </Label>
          </section>
          <section className="flex items-center gap-2 justify-end">
            <EngagementForm
              endpoint="engagements"
              title="Engagement"
              mode="create"
              data={{
                name: "",
                type: "",
                leads: [],
                department: {
                  name: "",
                  code: "",
                },
                sub_departments: [],
                risk: {
                  name: "",
                  magnitude: 0,
                },
              }}
              id={searchParams.get("id") ?? undefined}>
              <Button
                variant="ghost"
                className="bg-black text-white hover:text-white hover:bg-neutral-900  flex items-center gap-2 h-[30px] w-fit justify-start font-table">
                <CirclePlus size={16} strokeWidth={3} />
                Engagement
              </Button>
            </EngagementForm>
            <EngagementNavbar />
          </section>
        </section>
      </TabsList>
      <TabsContent
        value="engagements"
        className="w-[100vw] px-2 flex flex-col gap-2">
        <AnnuaPlanDashboard value={100} />
        <EngagementTable data={engagements ?? []} />
      </TabsContent>
    </Tabs>
  );
}
