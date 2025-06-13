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
import { IssueSchema, Response, UserSchema } from "@/lib/types";
//import { UserMultiSelector } from "../shared/user-multiselector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { Textarea } from "../ui/textarea";
import { UserMultiSelector } from "../shared/user-multiselector";
import { Checkbox } from "../ui/checkbox";
import { DatePicker } from "../shared/date-picker";
import { useSearchParams } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type IssueValues = z.infer<typeof IssueSchema>;
type UserValuses = z.infer<typeof UserSchema>;

interface IssueFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: string;
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

type IssueSourceResponse = {
  values?: Array<string>;
};

type RiskRatingResponse = {
  values?: Array<string>;
};

type BusinessProcessResponse = {
  process_name?: string;
  code?: string;
  sub_process_name: Array<string>;
};

type RootCauseResponse = {
  root_cause?: string;
  sub_root_cause: Array<string>;
};

type RiskCategoryResponse = {
  risk_category?: string;
  sub_risk_category: Array<string>;
};

type ImpactCategoryResponse = {
  impact_category?: string;
  impact_sub_category: Array<string>;
};

export const IssueForm = ({
  children,
  id,
  endpoint,
  title,
}: IssueFormProps) => {
  const [open, setOpen] = useState(false);
  const [regulatory, setRegulatory] = useState<boolean>(false);
  const [recurring, setRecurring] = useState<boolean>(false);

  const methods = useForm<IssueValues>({
    resolver: zodResolver(IssueSchema),
  });

  const params = useSearchParams();

  const query_client = useQueryClient();

  const [openSelect, setOpenSelect] = useState<
    | null
    | "risk"
    | "dept"
    | "type"
    | "source"
    | "sub_process"
    | "root_cause"
    | "sub_root_cause"
    | "risk_category"
    | "sub_risk_category"
    | "impact_category"
    | "impact_sub_category"
    | "risk_rating"
  >(null);

  const results = useQueries({
    queries: [
      {
        queryKey: ["__issue_source__"],
        queryFn: async (): Promise<IssueSourceResponse> =>
          fetchData("profile/issue_source", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
      },
      {
        queryKey: ["__control_weakness__"],
        queryFn: async (): Promise<RiskRatingResponse> =>
          fetchData("profile/control_weakness_rating", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
      },
      {
        queryKey: ["__business_process__"],
        queryFn: async (): Promise<BusinessProcessResponse[]> =>
          fetchData("profile/business_process", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
      },
      {
        queryKey: ["__root_cause__"],
        queryFn: async (): Promise<RootCauseResponse[]> =>
          fetchData("profile/root_cause_category", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
      },
      {
        queryKey: ["__risk_category__"],
        queryFn: async (): Promise<RiskCategoryResponse[]> =>
          fetchData("profile/risk_category", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
      },
      {
        queryKey: ["__impact_category__"],
        queryFn: async (): Promise<ImpactCategoryResponse[]> =>
          fetchData("profile/impact_category", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
      },
      {
        queryKey: ["__users__"],
        queryFn: async (): Promise<UserValuses[]> =>
          fetchData("users/module", localStorage.getItem("moduleId")),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!localStorage.getItem("moduleId"),
      },
    ],
  });

  const { mutate: createIssue, isPending: issueLoading } = useMutation({
    mutationKey: ["_create_annual_plan_"],
    mutationFn: async (data: IssueValues): Promise<Response> => {
      const response = await fetch(
        `${BASE_URL}/${endpoint}/${id}?engagement_id=${params.get("id")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
          body: JSON.stringify(data),
        }
      );
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

  const [auditUsers, setAuditUsers] = useState<UserValuses[]>([]);
  const [businessUsers, setBusinessUsers] = useState<UserValuses[]>();

  useEffect(() => {
    if (results[6].data && Array.isArray(results[6].data)) {
      setAuditUsers(results[6]?.data?.filter((user) => user.type === "audit"));
      setBusinessUsers(
        results[6].data.filter((user) => user.type === "business")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results[6].data]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = methods;

  const handleToggle = (
    select:
      | "risk"
      | "dept"
      | "type"
      | "source"
      | "sub_process"
      | "root_cause"
      | "sub_root_cause"
      | "risk_category"
      | "sub_risk_category"
      | "impact_category"
      | "impact_sub_category"
      | "risk_rating"
  ) => {
    setOpenSelect((prev) => (prev === select ? null : select));
  };

  const onSubmit = (data: IssueValues) => {
    const IssueData: IssueValues = {
      ...data,
      lod1_implementer: data.lod1_implementer.map((user) => {
        return {
          ...user,
          date_issued: new Date().toISOString(),
        };
      }),
      lod1_owner: data.lod1_owner.map((user) => {
        return {
          ...user,
          date_issued: new Date().toISOString(),
        };
      }),
      lod2_risk_manager: data.lod2_risk_manager.map((user) => {
        return {
          ...user,
          date_issued: new Date().toISOString(),
        };
      }),
      lod2_compliance_officer: data.lod2_compliance_officer.map((user) => {
        return {
          ...user,
          date_issued: new Date().toISOString(),
        };
      }),
      lod3_audit_manager: data.lod3_audit_manager.map((user) => {
        return {
          ...user,
          date_issued: new Date().toISOString(),
        };
      }),
      observers: data.observers.map((user) => {
        return {
          ...user,
          date_issued: new Date().toISOString(),
        };
      }),
      regulatory: regulatory,
      recurring_status: recurring,
    };

    createIssue(IssueData, {
      onSuccess: (data) => {
        const isSummaryFinding = !!query_client.getQueryCache().find({
          queryKey: ["_summary_findinds_", params.get("id")],
        });
        if (isSummaryFinding) {
          query_client.invalidateQueries({
            queryKey: ["_summary_findinds_", params.get("id")],
          });
        } else {
          query_client.fetchQuery({
            queryKey: ["_summary_findinds_", params.get("id")],
            queryFn: async () => {
              const response = await fetch(
                `${BASE_URL} /engagements/summary_findings/${params.get("id")}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${
                      typeof window === "undefined"
                        ? ""
                        : localStorage.getItem("token")
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
          });
        }

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
  };

  const selectedProcess = watch("process");
  const subProcesses =
    results[2].data?.find((bp) => bp.process_name === selectedProcess)
      ?.sub_process_name ?? [];

  const selectedRootCause = watch("root_cause");
  const subRootCause =
    results[3].data?.find((rc) => rc.root_cause === selectedRootCause)
      ?.sub_root_cause ?? [];

  const selectedRiskCategory = watch("risk_category");
  const subRiskCategory =
    results[4].data?.find((rc) => rc.risk_category === selectedRiskCategory)
      ?.sub_risk_category ?? [];

  const selectedImpactCategory = watch("impact_category");
  const subImpactCategory =
    results[5].data?.find((ic) => ic.impact_category === selectedImpactCategory)
      ?.impact_sub_category ?? [];

  return (
    <FormProvider {...methods}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

        <AlertDialogContent className="p-0 max-w-[1000px] flex flex-col dark:bg-black">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full mx-2">
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="text-[20px] font-bold font-serif tracking-wider scroll-m-1">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="" />

            <main className="px-4 py-3 flex flex-col flex-1 overflow-auto gap-2">
              <ScrollArea className="max-h-[430px] h-auto overflow-auto">
                <div className="*:not-first:mt-2 px-1 mb-2">
                  <Label
                    htmlFor="title"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Title"
                    {...register("title")}
                  />
                  <div className="h-[6]">
                    <FormError error={errors.title} />
                  </div>
                </div>
                <section className="flex items-center gap-2 px-1 mb-2">
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Issue Source
                    </Label>
                    <Controller
                      name="source"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "source"}
                          onOpenChange={() => handleToggle("source")}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select issue source" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {results[0]?.data?.values?.map(
                                (source, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={source ?? ""}>
                                    {source}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <div className="h-4">
                      <FormError error={errors.source} />
                    </div>
                  </div>
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Risk Level
                    </Label>
                    <Controller
                      name="risk_rating"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "risk_rating"}
                          onOpenChange={() => handleToggle("risk_rating")}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select risk level" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {results[1]?.data?.values?.map(
                                (rating, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={rating ?? ""}>
                                    {rating}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <div className="h-4">
                      <FormError error={errors.risk_rating} />
                    </div>
                  </div>
                </section>
                <div className="*:not-first:mt-2 px-1 mb-2">
                  <Label
                    htmlFor="criteria"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Criteria
                  </Label>
                  <Textarea
                    id="criteria"
                    placeholder="Criteria here"
                    className="min-h-[100px] max-h-[120px]"
                    {...register("criteria")}
                  />
                  <FormError error={errors.criteria} />
                </div>
                <div className="*:not-first:mt-2 px-1 mb-2">
                  <Label
                    htmlFor="finding"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Finding Weakness
                  </Label>
                  <Textarea
                    id="finding"
                    placeholder="Finding weakness here"
                    className="min-h-[100px] max-h-[120px]"
                    {...register("finding")}
                  />
                  <FormError error={errors.finding} />
                </div>
                <section className="flex gap-2 px-1 mb-2">
                  <div className="*:not-first:mt-2 flex-1">
                    <Label
                      htmlFor="_process_"
                      className="font-serif tracking-wide scroll-m-0 font-medium">
                      Process<span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="process"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "dept"}
                          onOpenChange={() => handleToggle("dept")}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setValue("sub_process", "");
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select process" />
                          </SelectTrigger>
                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {results[2]?.data?.map(
                                (process, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={process.process_name ?? "0"}>
                                    {process.process_name}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError error={errors?.process} />
                  </div>
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Sub Process<span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="sub_process"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "sub_process"}
                          onOpenChange={() => handleToggle("sub_process")}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub process" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {subProcesses?.map(
                                (sub_process, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={sub_process ?? "0"}>
                                    {sub_process}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError error={errors.sub_process} />
                  </div>
                </section>
                <div className="*:not-first:mt-2 px-1 mb-2">
                  <Label
                    htmlFor="root_cause_description"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Root Cause Description
                  </Label>
                  <Textarea
                    id="root_cause_description"
                    placeholder="Root cause description here"
                    className="min-h-[100px] max-h-[120px]"
                    {...register("root_cause_description")}
                  />
                  <FormError error={errors.root_cause_description} />
                </div>
                <section className="flex gap-2 px-1 mb-2">
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Root Cause<span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="root_cause"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "root_cause"}
                          onOpenChange={() => handleToggle("root_cause")}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setValue("sub_root_cause", "");
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select root cause" />
                          </SelectTrigger>
                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {results[3]?.data?.map(
                                (root_cause, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={root_cause.root_cause ?? "0"}>
                                    {root_cause.root_cause}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <div className="h-4">
                      <FormError error={errors?.root_cause} />
                    </div>
                  </div>
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Sub Root Cause<span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="sub_root_cause"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "sub_root_cause"}
                          onOpenChange={() => handleToggle("sub_root_cause")}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub root cause" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {subRootCause?.map(
                                (sub_root_cause, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={sub_root_cause ?? "0"}>
                                    {sub_root_cause}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <div className="h-4">
                      <FormError error={errors.sub_root_cause} />
                    </div>
                  </div>
                </section>
                <section className="flex gap-2 px-1 mb-2">
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Risk Category<span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="risk_category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "risk_category"}
                          onOpenChange={() => handleToggle("risk_category")}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setValue("sub_risk_category", "");
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select risk category" />
                          </SelectTrigger>
                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {results[4]?.data?.map(
                                (risk_category, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={risk_category.risk_category ?? "0"}>
                                    {risk_category.risk_category}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <div className="h-4">
                      <FormError error={errors?.root_cause} />
                    </div>
                  </div>
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Sub Root Cause<span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="sub_risk_category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "sub_risk_category"}
                          onOpenChange={() => handleToggle("sub_risk_category")}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub risk category" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {subRiskCategory?.map(
                                (sub_risk_category, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={sub_risk_category ?? "0"}>
                                    {sub_risk_category}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <div className="h-4">
                      <FormError error={errors.sub_risk_category} />
                    </div>
                  </div>
                </section>
                <div className="*:not-first:mt-2 px-1 mb-2">
                  <Label
                    htmlFor="impact_description"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Impact Description
                  </Label>
                  <Textarea
                    id="impact_description"
                    placeholder="Impact description here"
                    className="min-h-[100px] max-h-[120px]"
                    {...register("impact_description")}
                  />
                  <FormError error={errors.impact_description} />
                </div>
                <section className="flex gap-2 px-1 mb-2">
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Impact Category<span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="impact_category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "impact_category"}
                          onOpenChange={() => handleToggle("impact_category")}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setValue("impact_sub_category", "");
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select impact category" />
                          </SelectTrigger>
                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {results[5]?.data?.map(
                                (impact_category, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={
                                      impact_category.impact_category ?? "0"
                                    }>
                                    {impact_category.impact_category}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <div className="h-4">
                      <FormError error={errors?.impact_category} />
                    </div>
                  </div>
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Impact Sub Category
                      <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="impact_sub_category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          open={openSelect === "impact_sub_category"}
                          onOpenChange={() =>
                            handleToggle("impact_sub_category")
                          }
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub impact category" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                              {subImpactCategory?.map(
                                (sub_impact_category, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={sub_impact_category ?? "0"}>
                                    {sub_impact_category}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <div className="h-4">
                      <FormError error={errors.impact_sub_category} />
                    </div>
                  </div>
                </section>
                <div className="*:not-first:mt-2 px-1 mb-2">
                  <Label
                    htmlFor="recommendation"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Recommendation
                  </Label>
                  <Textarea
                    id="recommendation"
                    placeholder="recommendation here"
                    className="min-h-[100px] max-h-[120px]"
                    {...register("recommendation")}
                  />
                  <FormError error={errors.recommendation} />
                </div>
                <div className="*:not-first:mt-2 px-1 mb-2">
                  <Label
                    htmlFor="management_action_plan"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Management Action Plan
                  </Label>
                  <Textarea
                    id="management_action_plan"
                    placeholder="Management action plan here"
                    className="min-h-[100px] max-h-[120px]"
                    {...register("management_action_plan")}
                  />
                  <FormError error={errors.management_action_plan} />
                </div>
                <div className="*:not-first:mt-2 flex-1 flex flex-col">
                  <Label className="ml-[2px] font-table pb-[3px]">
                    Estimated Implementation Date
                  </Label>
                  <Controller
                    name="estimated_implementation_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                      />
                    )}
                  />
                  <FormError error={errors.estimated_implementation_date} />
                </div>
                <section className="flex items-center h-[30px] justify-center mb-2 py-5 gap-1">
                  <section className="border-r border-r-neutral-600 justify-center flex items-center gap-2 font-[helvetica] font-semibold tracking-normal scroll-m-0 text-[16px] flex-1">
                    <Checkbox
                      id="recurring"
                      checked={recurring}
                      onCheckedChange={(value) => setRecurring(value === true)}
                    />
                    <Label id="recurring" htmlFor="recurring">
                      Recurring
                    </Label>
                  </section>
                  <section className="justify-center flex items-center gap-2 font-[helvetica] font-semibold tracking-normal scroll-m-0 text-[16px] flex-1">
                    <Checkbox
                      id="compliance"
                      checked={regulatory}
                      onCheckedChange={(value) => setRegulatory(value === true)}
                    />
                    <Label id="compliance" htmlFor="compliance">
                      Compliance
                    </Label>
                  </section>
                </section>
                <section className="flex gap-2 px-1 mb-2">
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      LOD1 Owner
                    </Label>
                    <Controller
                      name="lod1_owner"
                      control={control}
                      render={({ field }) => (
                        <UserMultiSelector
                          trigger="Select LOD1 Owner"
                          users={businessUsers}
                          title="LOD1 Owner"
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FormError error={errors.lod1_owner} />
                  </div>
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      LOD1 Implementer
                    </Label>
                    <Controller
                      name="lod1_implementer"
                      control={control}
                      render={({ field }) => (
                        <UserMultiSelector
                          trigger="Select LOD1 Implementer"
                          users={businessUsers}
                          title="LOD1 Implementer"
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FormError error={errors.lod1_implementer} />
                  </div>
                </section>
                <section className="flex gap-2 px-1 mb-2">
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Risk Officer
                    </Label>
                    <Controller
                      name="lod2_risk_manager"
                      control={control}
                      render={({ field }) => (
                        <UserMultiSelector
                          trigger="Select Risk Manager"
                          users={businessUsers}
                          title="Risk Manager"
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FormError error={errors.lod2_risk_manager} />
                  </div>
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Compliance Officer
                    </Label>
                    <Controller
                      name="lod2_compliance_officer"
                      control={control}
                      render={({ field }) => (
                        <UserMultiSelector
                          trigger="Select Compliance Offiecer"
                          users={businessUsers}
                          title="Select Compliance Offiecer"
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FormError error={errors.lod2_compliance_officer} />
                  </div>
                </section>
                <section className="flex gap-2 px-1 mb-3">
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Audit Manager
                    </Label>
                    <Controller
                      name="lod3_audit_manager"
                      control={control}
                      render={({ field }) => (
                        <UserMultiSelector
                          trigger="Select Audit Manager"
                          users={auditUsers}
                          title="Audit Manager"
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FormError error={errors.lod3_audit_manager} />
                  </div>
                  <div className="*:not-first:mt-2 flex-1">
                    <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                      Observers
                    </Label>
                    <Controller
                      name="observers"
                      control={control}
                      render={({ field }) => (
                        <UserMultiSelector
                          trigger="Select Observers"
                          users={businessUsers}
                          title="Select Observers"
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FormError error={errors.observers} />
                  </div>
                </section>
              </ScrollArea>
            </main>

            <Separator />
            <footer className="flex justify-center gap-2 p-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="bg-red-800 text-white flex-1 font-serif tracking-wide scroll-m-1 font-bold">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={issueLoading}
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
