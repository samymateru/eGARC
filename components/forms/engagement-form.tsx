"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { useEffect, useState } from "react";
import { Send, CircleX } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { EngagementSchema, Response, UserSchema } from "@/lib/types";
import { UserMultiSelector } from "../shared/user-multiselector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { MultiErrorForm } from "../shared/multi-error-form";
import { ListMultiSelector } from "../shared/list-multi-select";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
import { ErrorMessage } from "@/lib/utils";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type EngagementValues = z.infer<typeof EngagementSchema>;
type UserValuses = z.infer<typeof UserSchema>;

type Risk = {
  name?: string;
  magnitude?: number;
};

type Lead = {
  name?: string;
  email?: string;
};

type Department = {
  name?: string;
  code?: string;
};

type DefaultsEngagementValues = {
  name: string;
  type: string;
  risk?: Risk;
  leads?: Lead[];
  department: Department;
  sub_departments: string[];
};

interface EngagementFormProps {
  children: React.ReactNode;
  id?: string;
  endpoint?: string;
  title: string;
  mode?: "create" | "update";
  data?: DefaultsEngagementValues;
}

const fetchData = async (endpont: string, id?: string | null) => {
  const response = await fetch(`${BASE_URL}/${endpont}/${id}`, {
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

type EngagementTypeResponse = {
  values?: Array<string>;
};

type Rating = {
  name?: string;
  magnitude?: number;
};

type RiskRatingResponse = {
  values?: Array<Rating>;
};

type BusinessProcessResponse = {
  process_name?: string;
  code?: string;
  sub_process_name: Array<string>;
};

export const EngagementForm = ({
  children,
  id,
  endpoint,
  title,
  data,
  mode,
}: EngagementFormProps) => {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();

  const methods = useForm<EngagementValues>({
    resolver: zodResolver(EngagementSchema),
    defaultValues: {
      name: data?.name,
      type: data?.type,
      department: {
        name: data?.department.name,
        code: data?.department.code,
      },
      risk: {
        name: data?.risk?.name,
        magnitude: data?.risk?.magnitude,
      },
      sub_departments: data?.sub_departments,
      leads: data?.leads,
    },
  });

  const [auditUsers, setAuditUsers] = useState<UserValuses[]>([]);
  const [userName, setName] = useState<string | null>(null);
  const [userEmail, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const query_client = useQueryClient();
  const [openSelect, setOpenSelect] = useState<null | "risk" | "dept" | "type">(
    null
  );

  const [entityId, setEntityId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);

  useEffect(() => {
    const userName = localStorage.getItem("user_name");
    const userEmail = localStorage.getItem("user_email");
    const userId = localStorage.getItem("user_id");
    setName(userName);
    setEmail(userEmail);
    setUserId(userId);
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      const entityId = localStorage.getItem("entity_id");
      const moduleId = localStorage.getItem("moduleId");

      if (entityId && moduleId) {
        setEntityId(entityId);
        setModuleId(moduleId);
      }
    }
  }, []);

  const results = useQueries({
    queries: [
      {
        queryKey: ["__engagement_types__", entityId],
        queryFn: async (): Promise<EngagementTypeResponse> =>
          fetchData("profile/engagement_type", entityId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!entityId,
      },
      {
        queryKey: ["__risk_rating__", entityId],
        queryFn: async (): Promise<RiskRatingResponse> =>
          fetchData("profile/risk_rating", entityId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!entityId,
      },
      {
        queryKey: ["__business_process__", entityId],
        queryFn: async (): Promise<BusinessProcessResponse[]> =>
          fetchData("profile/business_process", entityId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!entityId,
      },
      {
        queryKey: ["_teams_", moduleId],
        queryFn: async (): Promise<UserValuses[]> =>
          fetchData("users/module", moduleId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!moduleId,
      },
    ],
  });

  useEffect(() => {
    if (results[3]?.data && Array.isArray(results[3]?.data)) {
      setAuditUsers(results[3].data?.filter((user) => user.type === "audit"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results[3].data]);

  const { mutate: createEngagement, isPending: createEngagementPending } =
    useMutation({
      mutationKey: ["_create_engagement_", id],
      mutationFn: async (data: EngagementValues): Promise<Response> => {
        const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw {
            status: response.status,
            body: errorBody,
          };
        }
        return response.json();
      },
    });

  const { mutate: updateEngagement, isPending: updateEngagementPending } =
    useMutation({
      mutationKey: ["_update_engagement_"],
      mutationFn: async (data: EngagementValues): Promise<Response> => {
        const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw {
            status: response.status,
            body: errorBody,
          };
        }
        return response.json();
      },
    });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = methods;

  const handleToggle = (select: "risk" | "dept" | "type") => {
    setOpenSelect((prev) => (prev === select ? null : select));
  };

  const onSubmit = (data: EngagementValues) => {
    if (mode === "create") {
      const engagementData: EngagementValues = {
        ...data,
        leads: [
          ...data.leads.map((lead) => ({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            role: "Lead",
          })),
          {
            id: userId ?? "",
            name: userName ?? "",
            email: userEmail ?? "",
            role: "Lead",
          },
        ],
      };
      createEngagement(engagementData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_engagements_", id],
          });
          query_client.invalidateQueries({
            queryKey: ["_eaudit_plan_details_", params.get("id")],
          });
          query_client.invalidateQueries({
            queryKey: ["_plan_data_", params.get("id")],
          });

          showToast(data.detail, "success");
        },
        onError: (error) => {
          ErrorMessage(error);
        },
        onSettled: () => {
          reset();
          setOpen(false);
        },
      });
    } else {
      const engagementData: EngagementValues = {
        ...data,
      };
      updateEngagement(engagementData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_engagements_", params.get("id")],
          });
          showToast(data.detail, "success");
        },
        onError: (error) => {
          ErrorMessage(error);
        },
        onSettled: () => {
          reset();
          setOpen(false);
        },
      });
    }
  };

  const selectedProcess = watch("department")?.name;
  const subProcesses =
    results[2].data?.find((bp) => bp.process_name === selectedProcess)
      ?.sub_process_name ?? [];
  return (
    <FormProvider {...methods}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

        <AlertDialogContent className="p-0 max-w-[700px] bg-white flex flex-col ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full">
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="text-[22px] font-bold font-[helvetica] tracking-wide scroll-m-1">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="bg-neutral-600" />

            <main className="px-5 py-3 flex flex-col gap-2 flex-1 overflow-auto ">
              <section className="flex flex-col gap-3">
                <div className="*:not-first:mt-2 flex-1">
                  <Label htmlFor="_name_" className="font-helvetica-13">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="_name_"
                    placeholder="Engagement name"
                    {...register("name")}
                    className="font-helvetica-input-13"
                  />
                  <FormError error={errors.name} />
                </div>
                {mode === "create" ? (
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-helvetica-13">Leads</Label>
                    <Controller
                      name="leads"
                      control={control}
                      render={({ field }) => (
                        <UserMultiSelector
                          trigger="Select Team leads"
                          users={auditUsers.filter(
                            (user) =>
                              user.role !== "Head of Audit" &&
                              user.id !== userId
                          )}
                          title="Engagement leads"
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FormError error={errors.leads} />
                  </div>
                ) : null}
              </section>
              <section className="flex flex-col gap-2">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="_process_" className="font-helvetica-13">
                    Department<span className="text-destructive">*</span>
                  </Label>

                  <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                      <Select
                        open={openSelect === "dept"}
                        onOpenChange={() => handleToggle("dept")}
                        onValueChange={(value) => {
                          setValue("sub_departments", []);
                          const selected = results[2]?.data?.find(
                            (r) => r.process_name === value
                          );

                          if (selected) {
                            const { process_name, code } = selected;
                            field.onChange({ name: process_name, code });
                          }
                        }}
                        value={field.value?.name}>
                        <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>

                        <SelectContent className="bg-neutral-200">
                          <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                            {results[2]?.data?.map(
                              (department, index: number) => (
                                <SelectItem
                                  className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black"
                                  key={index}
                                  value={department.process_name ?? "0"}>
                                  {department.process_name}
                                </SelectItem>
                              )
                            )}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <MultiErrorForm
                    error={
                      errors.department?.code?.message ||
                      errors.department?.name?.message ||
                      errors.department?.message
                    }
                  />
                </div>
                <div>
                  <Label className="font-helvetica-13">Sub Departments</Label>
                  <Controller
                    name="sub_departments"
                    control={control}
                    render={({ field }) => (
                      <ListMultiSelector
                        trigger="Select sub processes"
                        processes={subProcesses}
                        title="Sub Departments"
                        value={field.value || []}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <FormError error={errors.sub_departments} />
                </div>
              </section>
              <section className=" flex items-center gap-2">
                <div className="*:not-first:mt-2 flex-1">
                  <Label htmlFor="process" className="font-helvetica-13">
                    Risk rating<span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="risk"
                    control={control}
                    render={({ field }) => (
                      <Select
                        open={openSelect === "risk"}
                        onOpenChange={() => handleToggle("risk")}
                        onValueChange={(value) => {
                          const selected = results[1]?.data?.values?.find(
                            (r) => r.name === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.name}>
                        <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                          <SelectValue placeholder="Select risk rating" />
                        </SelectTrigger>

                        <SelectContent className="bg-neutral-200">
                          <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                            {results[1]?.data?.values?.map(
                              (rating, index: number) => (
                                <SelectItem
                                  className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black"
                                  key={index}
                                  value={rating.name ?? ""}>
                                  <span>{rating.name}</span>
                                </SelectItem>
                              )
                            )}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className="h-6">
                    <MultiErrorForm
                      error={
                        errors.risk?.name?.message ||
                        errors.risk?.magnitude?.message ||
                        errors.risk?.message
                      }
                    />
                  </div>
                </div>
                <div className="*:not-first:mt-2 flex-1">
                  <Label htmlFor="type" className="font-helvetica-13">
                    Type<span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        open={openSelect === "type"}
                        onOpenChange={() => handleToggle("type")}
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                          <SelectValue
                            placeholder="Select engagement type"
                            className="placeholder:font-helvetica-13"
                          />
                        </SelectTrigger>

                        <SelectContent className="bg-neutral-100">
                          <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                            {results[0]?.data?.values?.map(
                              (type, index: number) => (
                                <SelectItem
                                  className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black"
                                  key={index}
                                  value={type ?? "type"}>
                                  {type}
                                </SelectItem>
                              )
                            )}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className="h-6">
                    <FormError error={errors.type} />
                  </div>
                </div>
              </section>
            </main>

            <Separator className="bg-neutral-600" />
            <footer className="flex justify-center gap-2 p-4">
              <Button
                type="button"
                onClick={() => {
                  setOpen(false);
                }}
                className="bg-black text-white flex-1 font-helvetica-13">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={createEngagementPending || updateEngagementPending}
                type="submit"
                className="bg-green-900 text-white flex-1 flex items-center font-helvetica-13">
                <Send className="mr-1" size={16} strokeWidth={3} />
                Submit
              </Button>
            </footer>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </FormProvider>
  );
};
