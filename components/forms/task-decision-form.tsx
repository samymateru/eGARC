"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import { Response } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ErrorMessage } from "@/lib/utils";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TaskDecisionSchema = z.object({
  decision: z.enum(["Closed & Accepted", "Re-open"]),
});

type TaskDecisionValues = z.infer<typeof TaskDecisionSchema>;

interface TaskDecisionFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
}

const decisions = ["Closed & Accepted", "Re-open"];

export const TaskDecisionForm = ({
  children,
  id,
  endpoint,
  title,
}: TaskDecisionFormProps) => {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();
  const methods = useForm<TaskDecisionValues>({
    resolver: zodResolver(TaskDecisionSchema),
  });

  const query_client = useQueryClient();

  const { mutate: taskDecision, isPending: taskDecisionPending } = useMutation({
    mutationKey: ["_task_decision_"],
    mutationFn: async (data: TaskDecisionValues): Promise<Response> => {
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
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: TaskDecisionValues) => {
    taskDecision(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_summary_tasks_", params.get("id")],
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
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="name"
                  className="font-serif tracking-wide scroll-m-1 font-semibold">
                  Module name<span className="text-destructive">*</span>
                </Label>

                <Controller
                  name="decision"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pick decision" />
                      </SelectTrigger>
                      <SelectContent>
                        {decisions.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item}
                            className="font-serif tracking-wide scroll-m-1 dark:hover:bg-neutral-800 cursor-pointer">
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.decision} />
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
                disabled={taskDecisionPending}
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
