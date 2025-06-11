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

  const query_client = useQueryClient();
  const [openSelect, setOpenSelect] = useState<null | "risk" | "dept" | "type">(
    null
  );

  const results = useQueries({
    queries: [
      {
        queryKey: ["__engagement_types__"],
        queryFn: async (): Promise<EngagementTypeResponse> =>
          fetchData("profile/engagement_type", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!id,
      },
      {
        queryKey: ["__risk_rating__"],
        queryFn: async (): Promise<RiskRatingResponse> =>
          fetchData("profile/risk_rating", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!id,
      },
      {
        queryKey: ["__business_process__"],
        queryFn: async (): Promise<BusinessProcessResponse[]> =>
          fetchData("profile/business_process", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!id,
      },
      {
        queryKey: ["__leads__"],
        queryFn: async (): Promise<UserValuses[]> =>
          fetchData("users/module", localStorage.getItem("moduleId")),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!id,
      },
    ],
  });

  useEffect(() => {
    if (results[3]?.data && Array.isArray(results[3]?.data)) {
      setAuditUsers(results[3].data?.filter((user) => user.type === "audit"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results[3].data]);

  const params = useSearchParams();

  const { mutate: createEngagement, isPending: createEngagementPending } =
    useMutation({
      mutationKey: ["_create_engagement_"],
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
        leads: data.leads.map((lead) => ({
          name: lead.name,
          email: lead.email,
          role: "Lead",
        })),
      };
      createEngagement(engagementData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_engagements_", id],
          });
          showToast(data.detail, "success");
        },
        onError: (error) => {
          console.log(error);
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
          console.log(error);
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

        <AlertDialogContent className="p-0 max-w-[700px] flex flex-col dark:bg-black">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full">
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="text-[20px] font-bold font-serif tracking-wider scroll-m-1">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="" />

            <main className="px-5 py-3 flex flex-col gap-2 flex-1 overflow-auto">
              <ScrollArea className="max-h-[430px] h-auto overflow-auto">
                <section className="flex flex-col gap-2">
                  <div className="*:not-first:mt-2 flex-1">
                    <Label
                      htmlFor="_name_"
                      className="font-serif tracking-wide scroll-m-0 font-medium">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="_name_"
                      placeholder="Engagement name"
                      {...register("name")}
                    />
                    <FormError error={errors.name} />
                  </div>
                  {mode === "create" ? (
                    <div className="*:not-first:mt-2 flex-1">
                      <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                        Leads
                      </Label>
                      <Controller
                        name="leads"
                        control={control}
                        render={({ field }) => (
                          <UserMultiSelector
                            trigger="Select Team leads"
                            users={auditUsers}
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
                    <Label
                      htmlFor="_process_"
                      className="font-serif tracking-wide scroll-m-0 font-medium">
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {results[2]?.data?.map(
                                (department, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
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
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Sub Departments
                    </Label>
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
                    <Label
                      htmlFor="process"
                      className="font-serif tracking-wide scroll-m-0 font-medium">
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {results[1]?.data?.values?.map(
                                (rating, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={rating.name ?? ""}>
                                    {rating.name}
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
                    <Label
                      htmlFor="type"
                      className="font-serif tracking-wide scroll-m-0 font-medium">
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {results[0]?.data?.values?.map(
                                (type, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
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
              </ScrollArea>
            </main>

            <Separator />
            <footer className="flex justify-center gap-2 p-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                }}
                className="bg-red-800 text-white flex-1 font-serif tracking-wide scroll-m-1 font-bold">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={createEngagementPending || updateEngagementPending}
                type="submit"
                variant="ghost"
                className="bg-green-800 text-white flex-1 font-serif tracking-wide scroll-m-1 font-bold">
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
