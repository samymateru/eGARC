"use client";
import { TeamsTable } from "@/components/data-table/teams-table";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeftCircle,
  Edit,
  Landmark,
  ListTodo,
  LoaderCircle,
  Mail,
  Phone,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserSchema } from "@/lib/types";
import { z } from "zod";
import "@/app/globals.css";
import { ErrorMessage } from "@/lib/utils";
import { Eva } from "@/components/shared/loader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UpdateUserForm } from "@/components/forms/update-user-form";
import { ExitModuleForm } from "@/components/forms/exit-module-form";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      <TabsContent value="account" className="mt-0 flex-1 flex relative">
        <Account />
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

const Account = () => {
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      const moduleId = localStorage.getItem("moduleId");
      const userId = localStorage.getItem("user_id");
      setModuleId(moduleId);
      setUserId(userId);
    }
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["_module_user_", moduleId],
    queryFn: async (): Promise<UserValuses> => {
      const response = await fetch(
        `${BASE_URL}/users/module/user/${userId}?module_id=${moduleId}`,
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
    enabled: !!moduleId && !!userId,
  });

  useEffect(() => {
    if (isError) {
      ErrorMessage(error);
    }
  }, [isError, error]);

  return (
    <section className="flex-1 flex items-center justify-center w-[calc(100vw-301px)] h-[calc(100vh-87px)] gap-2 px-2">
      <section className="h-full py-2">
        <section
          id="profile"
          className="w-[370px] shadow-lg bg-neutral-50 shadow-blue-300 h-full pl-2 flex flex-col gap-2 rounded-lg">
          <section className="px-5 flex justify-center pt-4">
            <Label className="text-[24px] font-bold font-[serif] text-black">
              Profile
            </Label>
          </section>
          <section className="flex justify-center relative">
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden relative">
              <Image
                src="https://media.vaticannews.va/media/content/dam-archive/vaticannews/multimedia/2019/11/18/Tanzania.-President-Julius-Nyere.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.1500.844.jpeg"
                alt="Account"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </div>
            <Button className="absolute shadow-md shadow-black bottom-3 right-[calc(50%-85px)] -translate-x-1/2 bg-green-600 text-white  w-[30px] h-[30px] rounded-full p-1">
              <Edit size={16} strokeWidth={2} />
            </Button>
          </section>
          <section className="flex flex-col gap-3 px-5 pt-3">
            <section className="flex items-center">
              <Label className="font-helvetica-14 text-black">
                {isLoading ? (
                  <LoaderCircle
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block animate-spin"
                  />
                ) : (
                  <User
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block"
                  />
                )}
                Name:
              </Label>
              <p className="text-neutral-800 font-helvetica-13 ml-2">
                {data?.name}
              </p>
            </section>
            <section className="flex items-center">
              <Label className="font-helvetica-14 text-black">
                {isLoading ? (
                  <LoaderCircle
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block animate-spin"
                  />
                ) : (
                  <Mail
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block"
                  />
                )}
                Email:
              </Label>
              <p className="text-neutral-800 font-helvetica-13 ml-2">
                {data?.email}
              </p>
            </section>
            <section className="flex items-center">
              <Label className="font-helvetica-14 text-black">
                {isLoading ? (
                  <LoaderCircle
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block animate-spin"
                  />
                ) : (
                  <Phone
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block"
                  />
                )}
                Phone:
              </Label>
              <p className="text-neutral-800 font-helvetica-13 ml-2">
                {data?.telephone}
              </p>
            </section>
            <section className="flex items-center">
              <Label className="font-helvetica-14 text-black">
                {isLoading ? (
                  <LoaderCircle
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block animate-spin"
                  />
                ) : (
                  <Shield
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block"
                  />
                )}
                Role:
              </Label>
              <p className="text-neutral-800 font-helvetica-13 ml-2">
                {data?.role}
              </p>
            </section>
            <section className="flex items-center">
              <Label className="font-helvetica-14 text-black">
                {isLoading ? (
                  <LoaderCircle
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block animate-spin"
                  />
                ) : (
                  <Landmark
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block"
                  />
                )}
                Title:
              </Label>
              <p className="text-neutral-800 font-helvetica-13 ml-2">
                {data?.title}
              </p>
            </section>
            <section className="flex items-center gap-1">
              <Label className="font-helvetica-14 text-black">
                {isLoading ? (
                  <LoaderCircle
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block animate-spin"
                  />
                ) : (
                  <ListTodo
                    size={16}
                    strokeWidth={2}
                    className="mb-[2px] mr-1 inline-block"
                  />
                )}
                Engagements
              </Label>
              <p className="text-neutral-800 font-helvetica-13 ml-2">
                {data?.engagements?.length}
              </p>
            </section>
          </section>
          <section className="flex items-end pb-2 gap-2 px-5 pt-3 flex-1">
            <section className="flex-1">
              <ExitModuleForm title="Exit module" endpoint="" id="">
                <Button className="w-full bg-red-600 h-[30px] flex justify-center font-helvetica-13 text-white">
                  <ArrowLeftCircle size={16} strokeWidth={2} />
                  Exit
                </Button>
              </ExitModuleForm>
            </section>
            <section className="flex-1">
              <UpdateUserForm title="Update user" endpoint="" id="">
                <Button className="w-full h-[30px] bg-green-600 flex justify-center font-helvetica-13 text-white">
                  <Edit size={16} strokeWidth={2} />
                  Update
                </Button>
              </UpdateUserForm>
            </section>
          </section>
        </section>
      </section>
      <section className="h-full py-2 flex-1 flex">
        <section
          id="recents"
          className="bg-neutral-900 flex-1 h-full py-2 rounded-md">
          k
        </section>
      </section>
    </section>
  );
};
