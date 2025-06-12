"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import { StaffSchema, Response, UserSchema } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { DatePicker } from "../shared/date-picker";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type StaffValues = z.infer<typeof StaffSchema>;
type UserValuses = z.infer<typeof UserSchema>;

type DefaultUsersValues = {
  name?: string;
  role?: string;
  start_date?: Date;
  end_date?: Date;
};

interface StaffFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: "create" | "update";
  defaultValue?: DefaultUsersValues;
}

const engagementRole = ["Reviewer", "Lead", "Member"];

export const StaffForm = ({
  children,
  id,
  endpoint,
  title,
  defaultValue,
  mode,
}: StaffFormProps) => {
  const [open, setOpen] = useState(false);
  const [auditUsers, setAuditUsers] = useState<UserValuses[]>([]);

  const params = useSearchParams();

  const query_client = useQueryClient();

  const methods = useForm<StaffValues>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      name: defaultValue?.name,
      start_date: defaultValue?.start_date,
      end_date: defaultValue?.end_date,
      role: defaultValue?.role,
    },
  });

  const [moduleId, setModuleId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const { data } = useQuery({
    queryKey: ["_teams_", moduleId],
    queryFn: async (): Promise<UserValuses[]> => {
      const response = await fetch(`${BASE_URL}/users/module/${moduleId}`, {
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

  console.log(errors);

  const { mutate: createStaff, isPending: createStaffLoading } = useMutation({
    mutationKey: ["_create_staff_", id],
    mutationFn: async (data: StaffValues): Promise<Response> => {
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

  const { mutate: updateStaff, isPending: updateStaffLoading } = useMutation({
    mutationKey: ["_update_staff_", id],
    mutationFn: async (data: StaffValues): Promise<Response> => {
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

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setAuditUsers(data?.filter((user) => user.type === "audit"));
    }
  }, [data]);

  useEffect(() => {
    const storedOrgId = localStorage.getItem("moduleId");
    setModuleId(storedOrgId);
  }, []);

  const onSubmit = (data: StaffValues) => {
    const staffData: StaffValues = {
      ...data,
      email: auditUsers.find((user) => user.name === data.name)?.email ?? "",
    };

    if (mode === "create") {
      createStaff(staffData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_staff_", params.get("id")],
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
      updateStaff(staffData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_staff_", params.get("id")],
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
              {mode === "create" ? (
                <div className="*:not-first:mt-2 flex-1">
                  <Label
                    htmlFor="name"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Name<span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>

                        <SelectContent className="">
                          <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                            {auditUsers?.map((user, index: number) => (
                              <SelectItem
                                className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                key={index}
                                value={user?.name ?? ""}>
                                {user?.name}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormError error={errors.name} />
                </div>
              ) : null}

              <div className="*:not-first:mt-2 flex-1">
                <Label
                  htmlFor="name"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Role<span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role">
                          {field.value}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent className="">
                        <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                          {engagementRole?.map((role, index: number) => (
                            <SelectItem
                              className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                              key={index}
                              value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.role} />
              </div>
              <section className="flex items-center gap-2">
                <div className="*:not-first:mt-2 flex-1 flex flex-col">
                  <Label
                    htmlFor="year"
                    className="ml-[2px] font-table pb-[3px]">
                    Start
                  </Label>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        side="left"
                        offset={25}
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                      />
                    )}
                  />
                  <div className="h-4">
                    <FormError error={errors.start_date} />
                  </div>
                </div>
                <div className="*:not-first:mt-2 flex-1 flex flex-col">
                  <Label
                    htmlFor="year"
                    className="ml-[2px] font-table pb-[3px]">
                    End
                  </Label>
                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        offset={25}
                        side="right"
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                      />
                    )}
                  />
                  <div className="h-4">
                    <FormError error={errors.end_date} />
                  </div>
                </div>
              </section>
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
                disabled={createStaffLoading || updateStaffLoading}
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
