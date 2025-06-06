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
import { RaiseTaskSchema, Response, UserSchema } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { UserMultiSelector } from "../shared/user-multiselector";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { DatePicker } from "../shared/date-picker";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RaiseTaskValues = z.infer<typeof RaiseTaskSchema>;
type UserValuses = z.infer<typeof UserSchema>;

type ActionOwner = {
  name?: string;
  email?: string;
};

type DefaultTaskValues = {
  title?: string;
  description?: string;
  action_owner: ActionOwner[];
  due_date?: Date;
};

interface RaiseTaskProps {
  children: React.ReactNode;
  id: string | null;
  endpoint?: string;
  title: string;
  mode?: "create" | "update";
  data?: DefaultTaskValues;
}

export const RaiseTask = ({
  children,
  id,
  endpoint,
  title,
  data,
}: RaiseTaskProps) => {
  const [open, setOpen] = useState(false);

  const methods = useForm<RaiseTaskValues>({
    resolver: zodResolver(RaiseTaskSchema),
    defaultValues: data,
  });

  const [auditUsers, setAuditUsers] = useState<UserValuses[]>([]);
  const [moduleId, setModuleId] = useState<string | null>();
  const router = useRouter();
  const [fullUrl, setFullUrl] = useState("");

  const query_client = useQueryClient();

  const { data: users, isLoading: userLoading } = useQuery({
    queryKey: ["__users_", moduleId],
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
  });

  useEffect(() => {
    const storedModuleID = localStorage.getItem("moduleId");
    setModuleId(storedModuleID);
  }, []);

  useEffect(() => {
    if (users && Array.isArray(users)) {
      setAuditUsers(users?.filter((user) => user.type === "audit"));
    }
  }, [users]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.href);
    }
  }, [router]);

  const { mutate: raiseTask, isPending: raiseTaskPending } = useMutation({
    mutationKey: ["_raise_task_"],
    mutationFn: async (data: RaiseTaskValues): Promise<Response> => {
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

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: RaiseTaskValues) => {
    const raiseData = {
      ...data,
      href: fullUrl,
      raised_by: {
        name: localStorage.getItem("user_name") || "",
        email: localStorage.getItem("user_email") || "",
        date_issued: new Date(),
      },
    };

    raiseTask(raiseData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({ queryKey: ["_summary_tasks_"] });
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
  if (userLoading) {
    return <div>loading...</div>;
  }

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
                  htmlFor="title"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Task title"
                  {...register("title")}
                />
                <FormError error={errors.title} />
              </div>
              <div>
                <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                  Action owners
                </Label>
                <Controller
                  name="action_owner"
                  control={control}
                  render={({ field }) => (
                    <UserMultiSelector
                      users={auditUsers ?? []}
                      trigger="Select action owners"
                      title="Action owner"
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FormError error={errors.action_owner} />
              </div>

              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="description"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Description here"
                  className="min-h-[100px] max-h-[160px]"
                  {...register("description")}
                />
                <FormError error={errors.description} />
              </div>
              <div className="*:not-first:mt-2 flex-1 flex flex-col">
                <Label htmlFor="year" className="ml-[2px] font-table pb-[3px]">
                  Due Date
                </Label>
                <Controller
                  name="due_date"
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
                <FormError error={errors.due_date} />
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
                disabled={raiseTaskPending}
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
