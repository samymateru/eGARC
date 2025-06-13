"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { useState } from "react";
import { Send, CircleX } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { EngagementProcessSchema, Response } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
import { ListMultiSelector } from "../shared/list-multi-select";
import { ErrorMessage } from "@/lib/utils";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type EngagementProcessValues = z.infer<typeof EngagementProcessSchema>;

type DefaultEngagementProcessValues = {
  process?: string;
  sub_process?: string[];
  description?: string;
  business_unit?: string;
};

interface EngagementProcessFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: "create" | "update";
  data?: DefaultEngagementProcessValues;
}

type BusinessProcessResponse = {
  process_name?: string;
  code?: string;
  sub_process_name: Array<string>;
};

export const EngagementProcessForm = ({
  children,
  id,
  endpoint,
  title,
  data,
  mode,
}: EngagementProcessFormProps) => {
  const [open, setOpen] = useState(false);

  const query_client = useQueryClient();
  const params = useSearchParams();

  const methods = useForm<EngagementProcessValues>({
    resolver: zodResolver(EngagementProcessSchema),
    defaultValues: data,
  });

  const { data: process } = useQuery({
    queryKey: ["__process__"],
    queryFn: async (): Promise<BusinessProcessResponse[]> => {
      const response = await fetch(`${BASE_URL}/profile/business_process`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      return await response.json();
    },
  });

  const { mutate: createProcess, isPending: createProcessLoading } =
    useMutation({
      mutationKey: ["_create_process_", id],
      mutationFn: async (data: EngagementProcessValues): Promise<Response> => {
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

  const { mutate: updateProcess, isPending: updateProcessLoading } =
    useMutation({
      mutationKey: ["_update_process_", id],
      mutationFn: async (data: EngagementProcessValues): Promise<Response> => {
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
    watch,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit = (data: EngagementProcessValues) => {
    if (mode === "create") {
      createProcess(data, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_engagement_processes_", params.get("id")],
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
      updateProcess(data, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_engagement_processes_", params.get("id")],
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

  const selectedProcess = watch("process");
  const subProcesses =
    process?.find((bp) => bp.process_name === selectedProcess)
      ?.sub_process_name ?? [];

  return (
    <FormProvider {...methods}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="p-0 max-w-[500px] dark:bg-black">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="text-[20px] font-bold font-serif tracking-wider scroll-m-1">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="" />
            <main className="px-5 py-3 flex flex-col gap-2">
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="_process_"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Department<span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="process"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        setValue("sub_process", []);
                        field.onChange(value);
                      }}
                      value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select control type" />
                      </SelectTrigger>

                      <SelectContent className="">
                        <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                          {process?.map((department, index: number) => (
                            <SelectItem
                              className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                              key={index}
                              value={department.process_name ?? ""}>
                              {department.process_name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.process} />
              </div>
              <div>
                <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                  Sub Departments
                </Label>
                <Controller
                  name="sub_process"
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
                <FormError error={errors.sub_process} />
              </div>

              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="description"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Description here"
                  className="min-h-[100px] max-h-[120px]"
                  {...register("description")}
                />
                <FormError error={errors.description} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="business_unit"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Business unit
                </Label>
                <Input
                  id="business_unit"
                  placeholder="Description here"
                  className=""
                  {...register("business_unit")}
                />
                <FormError error={errors.business_unit} />
              </div>
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
                disabled={createProcessLoading || updateProcessLoading}
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
