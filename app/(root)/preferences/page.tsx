"use client";
import { TeamsTable } from "@/components/data-table/teams-table";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  LoaderCircle,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { UserSchema } from "@/lib/types";
import { z } from "zod";
import "@/app/globals.css";
import { ErrorMessage } from "@/lib/utils";
import { Eva } from "@/components/shared/loader";

type UserValuses = z.infer<typeof UserSchema>;

type TeamsProps = {
  onStatusChange: (status: { isLoading: boolean; isError: boolean }) => void;
};

export default function PreferencesPage() {
  const [teamStatus, setTeamStatus] = useState<{
    isLoading: boolean;
    isError: boolean;
  }>({
    isLoading: false,
    isError: false,
  });

  return (
    <Tabs defaultValue="account" className="flex-1 flex h-full">
      <TabsList className="bg-white flex flex-col gap-[3px] justify-start min-w-[300px] pb-2 h-[100vh] rounded-none">
        <Label className="pl-1 flex items-center gap-1 font-helvetica-medium self-start pt-1 pb-2 text-black">
          <Settings size={16} strokeWidth={2} className="mb-[2px]" />
          Preferences
        </Label>
        <Separator className="bg-neutral-500" />
        <TabsTrigger
          value="account"
          className="mt-1 h-8 action text-white data-[state=active]:text-white data-[state=active]:border-l-[6px] data-[state=active]:border-l-blue-800 w-full flex justify-start gap-2 items-center font-helvetica-13">
          <User size={16} strokeWidth={2} className="mb-1" />
          Account
        </TabsTrigger>
        <TabsTrigger
          value="teams"
          className="h-8 action text-white data-[state=active]:text-white data-[state=active]:border-l-[6px] data-[state=active]:border-l-blue-800 w-full flex justify-start gap-2 items-center font-helvetica-13">
          {teamStatus.isLoading ? (
            <LoaderCircle size={16} strokeWidth={3} className="animate-spin" />
          ) : teamStatus.isError ? (
            <AlertTriangle size={16} strokeWidth={3} className="text-red-700" />
          ) : (
            <Users size={16} strokeWidth={3} />
          )}
          Teams
        </TabsTrigger>
        <TabsTrigger
          value="roles"
          className="h-8 action text-white data-[state=active]:text-white data-[state=active]:border-l-[6px] data-[state=active]:border-l-blue-800 w-full flex justify-start gap-2 items-center font-helvetica-13">
          <Shield size={16} strokeWidth={3} />
          Roles
        </TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" className="bg-neutral-500 h-full" />
      <TabsContent value="account" className="mt-0 flex-1 flex">
        Account
      </TabsContent>
      <TabsContent value="teams" className="mt-0 flex-1 flex">
        <Teams onStatusChange={setTeamStatus} />
      </TabsContent>
      <TabsContent value="roles" className="mt-0 flex-1 flex">
        Roles
      </TabsContent>
    </Tabs>
  );
}

const Teams = ({ onStatusChange }: TeamsProps) => {
  const [auditUsers, setAuditUsers] = useState<UserValuses[]>([]);
  const [businessUsers, setBusinessUsers] = useState<UserValuses[]>();

  const params = useSearchParams();
  const [tab, setTab] = useState<string>("audit");
  const { data, isLoading, isError, error } = useQuery({
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

  useEffect(() => {
    if (isError) {
      ErrorMessage(error);
    }
  }, [isError, error]);

  useEffect(() => {
    onStatusChange({ isLoading, isError });
  }, [isLoading, isError, onStatusChange]);

  if (isLoading) {
    return (
      <div className="w-full h-full relative">
        <Eva title="Team" />
      </div>
    );
  }

  return (
    <Tabs
      className="flex-1 flex flex-col h-full"
      value={tab}
      onValueChange={(tab) => setTab(tab)}>
      <TabsList className="flex justify-between items-center gap-2 w-full bg-white rounded-none">
        <section>
          <Label className="font-helvetica-medium text-black flex items-center gap-2">
            <User size={16} strokeWidth={2} className="mb-1" />
            {tab === "audit" ? "Audit Members" : "Business Members"}
          </Label>
        </section>
        <section className="flex items-center gap-2">
          <section className="flex items-center gap-2">
            <TabsTrigger
              value="audit"
              className="h-[30px] action data-[state=active]:text-white text-white data-[state=active]:border-l-[6px] rounded-none data-[state=active]:border-l-blue-800  w-[130px] flex justify-start gap-2 items-center font-helvetica-13">
              <User size={16} strokeWidth={3} />
              Audit
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="h-[30px] action data-[state=active]:text-white text-white data-[state=active]:border-l-[6px] rounded-none data-[state=active]:border-l-blue-800 w-[130px] flex justify-start gap-2 items-center font-helvetica-13">
              <User size={16} strokeWidth={3} />
              Business
            </TabsTrigger>
          </section>
        </section>
      </TabsList>
      <Separator className="bg-neutral-500" />
      <TabsContent value="business" className="mt-0  w-[calc(100vw-310px)]">
        <TeamsTable data={businessUsers ?? []} type="business" />
      </TabsContent>
      <TabsContent value="audit" className="mt-0 w-[calc(100vw-310px)]">
        <TeamsTable data={auditUsers ?? []} type="audit" />
      </TabsContent>
    </Tabs>
  );
};

Teams.displayName = "Teams";
