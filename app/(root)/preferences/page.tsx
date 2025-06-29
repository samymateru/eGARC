"use client";
import { TeamsTable } from "@/components/data-table/teams-table";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeftCircle,
  CirclePlus,
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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RolesSchema, UserSchema } from "@/lib/types";
import { z } from "zod";
import "@/app/globals.css";
import { ErrorMessage } from "@/lib/utils";
import { Eva, Loader } from "@/components/shared/loader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UpdateUserForm } from "@/components/forms/update-user-form";
import { ExitModuleForm } from "@/components/forms/exit-module-form";
import RolesTable from "@/components/data-table/roles-table";
import { RoleDetails } from "@/components/shared/role-details";
import { NotificationRecents } from "@/components/shared/notifications-recents";
import { RolesForm } from "@/components/forms/roles-form";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type UserValuses = z.infer<typeof UserSchema>;

type RolesValues = z.infer<typeof RolesSchema>;

type TeamsProps = {
  onStatusChange: (status: { isLoading: boolean; isError: boolean }) => void;
};

interface RolesProps {
  moduleId: string | null;
}

export default function PreferencesPage() {
  const [teamStatus, setTeamStatus] = useState<{
    isLoading: boolean;
    isError: boolean;
  }>({
    isLoading: false,
    isError: false,
  });

  const [moduleId, setModuleId] = useState<string | null>(null);
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== undefined) {
      const moduleId = localStorage.getItem("moduleId");
      setModuleId(moduleId);
    }
  }, []);

  const onTabChange = (tab: string) => {
    const param = new URLSearchParams(params.toString());
    param.set("action", tab);
    router.replace(`?${param.toString()}`, { scroll: false });
  };

  return (
    <Tabs
      defaultValue="account"
      className="flex-1 flex h-full"
      onValueChange={onTabChange}>
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
      <TabsContent
        value="account"
        className="mt-0 flex-1 flex data-[state=inactive]:hidden">
        <Account />
      </TabsContent>
      <TabsContent
        value="teams"
        className="mt-0 flex-1 flex data-[state=inactive]:hidden">
        <Teams onStatusChange={setTeamStatus} />
      </TabsContent>
      <TabsContent
        value="roles"
        className="mt-0 flex-1 flex data-[state=inactive]:hidden">
        <Roles moduleId={moduleId} />
      </TabsContent>
    </Tabs>
  );
}

const Teams = ({ onStatusChange }: TeamsProps) => {
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

  const auditUsers = useMemo(() => {
    if (Array.isArray(data)) {
      return data.filter((user) => user.type === "audit");
    }
    return [];
  }, [data]);

  const businessUsers = useMemo(() => {
    if (Array.isArray(data)) {
      return data.filter((user) => user.type === "business");
    }
    return [];
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
      <TabsContent
        value="business"
        className="mt-0  w-[calc(100vw-310px)] data-[state=inactive]:hidden">
        <section className="px-2 pt-2">
          <TeamsTable data={businessUsers ?? []} type="business" />
        </section>
      </TabsContent>
      <TabsContent
        value="audit"
        className="mt-0 w-[calc(100vw-310px)] data-[state=inactive]:hidden">
        <section className="px-2 pt-2">
          <TeamsTable data={auditUsers ?? []} type="audit" />
        </section>
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
    <section className="flex items-center flex-1  h-[calc(100vh-87px)] gap-2 px-2">
      <section className="w-[370px] h-full py-2">
        <section
          id="profile"
          className="w-full shadow-lg bg-neutral-50 shadow-blue-300 h-full pl-2 flex flex-col gap-2 rounded-lg">
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
      <section className="h-full flex-1  flex py-2">
        <NotificationRecents />
      </section>
    </section>
  );
};

const Roles = ({ moduleId }: RolesProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["_module_roles_", moduleId],
    queryFn: async (): Promise<RolesValues[]> => {
      const response = await fetch(`${BASE_URL}/roles/${moduleId}`, {
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
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!moduleId,
  });

  const onTabChange = (tab: string) => {
    const param = new URLSearchParams(params.toString());
    param.set("action", tab);
    router.replace(`?${param.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (isError) {
      ErrorMessage(error);
    }
  }, [error, isError]);

  const roles = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const getRefNumber = (ref: string) =>
        parseInt(ref.replace(/[^\d]/g, ""), 10);
      return getRefNumber(b.reference ?? "") - getRefNumber(a.reference ?? "");
    });
  }, [data]);

  if (isLoading) {
    return (
      <section className="w-full h-full relative">
        <Loader title="Roles" />
      </section>
    );
  }

  return (
    <Tabs
      className="w-[calc(100vw-301px)] h-full"
      value={params.get("action") ?? "roles"}>
      <TabsContent value="roles" className="mt-0 data-[state=inactive]:hidden">
        <section className="pt-1 pb-[3px] flex items-center justify-between w-full px-2">
          <section className="flex items-center">
            <section>
              <Label className="font-helvetica-medium">
                <Shield
                  size={16}
                  strokeWidth={2}
                  className="mb-1 inline-block mr-2"
                />
                Roles Manager
              </Label>
            </section>
          </section>
          <section>
            <RolesForm title="New Role" endpoint="roles" id={moduleId}>
              <Button className="flex items-center justify-start w-[130px] font-helvetica-13 text-white action h-[30px]">
                <CirclePlus size={16} strokeWidth={2} />
                Role
              </Button>
            </RolesForm>
          </section>
        </section>
        <Separator className="bg-neutral-500 mb-2" />
        <section className="px-2">
          <RolesTable data={roles ?? []} />
        </section>
      </TabsContent>
      {data?.map((role, index: number) => (
        <TabsContent
          value={role.reference ?? "roles"}
          key={index}
          className="mt-0 data-[state=inactive]:hidden">
          <section className="pt-1 pb-[3px] flex items-center justify-between w-full px-2">
            <section className="flex items-center">
              <section>
                <Button
                  onClick={() => onTabChange("roles")}
                  className="flex items-center justify-self-center w-[30px] h-[30px]">
                  <ArrowLeftCircle size={16} strokeWidth={2} />
                </Button>
              </section>
              <Separator
                orientation="vertical"
                className="h-[25px] mx-3 bg-neutral-500"
              />
              <Label className="font-helvetica-14">
                <Shield
                  size={16}
                  strokeWidth={2}
                  className="mb-1 inline-block mr-2"
                />
                {role.name}
              </Label>
            </section>
            <section>
              <Button className="flex items-center justify-start w-[130px] font-helvetica-13 text-white action h-[30px]">
                <Edit size={16} strokeWidth={2} />
                Edit
              </Button>
            </section>
          </section>
          <Separator className="bg-neutral-500 mb-3" />
          <RoleDetails role={role} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
