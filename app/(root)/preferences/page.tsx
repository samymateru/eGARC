"use client";
import { TeamsTable } from "@/components/data-table/teams-table";
import { UsersForm } from "@/components/forms/user-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus, Settings, Shield, User, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { UserSchema } from "@/lib/types";
import { z } from "zod";

type UserValuses = z.infer<typeof UserSchema>;

export default function PreferencesPage() {
  return (
    <Tabs defaultValue="account" className="flex-1 flex h-full">
      <TabsList className="bg-neutral-300 flex flex-col gap-[3px] justify-start min-w-[300px] pb-2 h-[100vh] rounded-none">
        <Label className="flex items-center gap-1 text-xl text-black font-bold tracking-tight scroll-m-0 self-start pt-1 pb-2">
          <Settings size={20} />
          Preferences
        </Label>
        <TabsTrigger
          value="account "
          className="h-[30px] text-black data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-900 w-full flex justify-start gap-2 items-center font-[helvetica] rounded-none tracking-wide scroll-m-0 font-semibold">
          <User size={16} strokeWidth={3} />
          Account
        </TabsTrigger>
        <TabsTrigger
          value="teams"
          className="h-[30px] text-black data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-900 w-full flex justify-start gap-2 items-center font-[helvetica]  rounded-none tracking-wide scroll-m-0 font-semibold">
          <Users size={16} strokeWidth={3} />
          Teams
        </TabsTrigger>
        <TabsTrigger
          value="roles"
          className="h-[30px] text-black data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-900 w-full flex justify-start gap-2 items-center font-[helvetica] rounded-none tracking-wide scroll-m-0 font-semibold">
          <Shield size={16} strokeWidth={3} />
          Roles
        </TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" className="" />
      <TabsContent value="account" className="mt-0 flex-1 flex">
        Account
      </TabsContent>
      <TabsContent value="teams" className="mt-0 flex-1 flex">
        <Teams />
      </TabsContent>
      <TabsContent value="roles" className="mt-0 flex-1 flex">
        Roles
      </TabsContent>
    </Tabs>
  );
}

const Teams = () => {
  const [auditUsers, setAuditUsers] = useState<UserValuses[]>([]);
  const [businessUsers, setBusinessUsers] = useState<UserValuses[]>();

  const params = useSearchParams();
  const [tab, setTab] = useState<string>("audit");
  const { data } = useQuery({
    queryKey: ["_teams_", params.get("moduleId")],
    queryFn: async (): Promise<UserValuses[]> => {
      const response = await fetch(
        `${BASE_URL}/users/module/${params.get("moduleId")}`,
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
    enabled: !!params.get("moduleId"),
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setAuditUsers(data?.filter((user) => user.type === "audit"));
      setBusinessUsers(data?.filter((user) => user.type === "business"));
    }
  }, [data]);

  return (
    <Tabs
      className="flex-1 flex flex-col h-full"
      value={tab}
      onValueChange={(tab) => setTab(tab)}>
      <TabsList className="flex justify-between items-center gap-2 w-full dark:bg-background rounded-none">
        <section>
          <Label className="text-[16px] font-[helvetica] font-bold">
            {tab === "audit" ? "Audit Members" : "Business Members"}
          </Label>
        </section>
        <section className="flex items-center gap-2">
          <section className="flex items-center gap-2">
            <TabsTrigger
              value="audit"
              className="h-[30px] data-[state=active]:border-l-[5px] rounded-none data-[state=active]:border-l-blue-900 dark:hover:bg-neutral-800 w-[130px] flex justify-start gap-2 items-center font-[helvetica] tracking-wide scroll-m-0">
              <User size={16} strokeWidth={3} />
              Audit
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="h-[30px] data-[state=active]:border-l-[5px] rounded-none data-[state=active]:border-l-blue-900 dark:hover:bg-neutral-800 w-[130px] flex justify-start gap-2 items-center font-[helvetica] tracking-wide scroll-m-0">
              <User size={16} strokeWidth={3} />
              Business
            </TabsTrigger>
          </section>
          <section className="border-l border-l-neutral-700 pl-2">
            <UsersForm
              data={{
                title: "",
                name: "",
                email: "",
                role: "",
              }}
              mode="create"
              member={tab}
              title={tab === "audit" ? "Audit Member" : "Business Member"}
              endpoint="users"
              id={params.get("organizationId")}>
              <Button
                variant="ghost"
                className="h-8 w-fit px-2 flex items-center justify-start">
                <CirclePlus size={16} className="opacity-80" />
                Member
              </Button>
            </UsersForm>
          </section>
        </section>
      </TabsList>
      <Separator />
      <TabsContent value="business" className="mt-0  w-[calc(100vw-300px)]">
        <TeamsTable data={businessUsers ?? []} />
      </TabsContent>
      <TabsContent value="audit" className="mt-0 w-[calc(100vw-300px)]">
        <TeamsTable data={auditUsers ?? []} />
      </TabsContent>
    </Tabs>
  );
};
