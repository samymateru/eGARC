"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm } from "react-hook-form";
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
import { ResolveTaskSchema, Response } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
import { ErrorMessage } from "@/lib/utils";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ResolveTaskValues = z.infer<typeof ResolveTaskSchema>;

interface ResolveTaskFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: "create" | "update";
}

export const ResolveTaskForm = ({
  children,
  id,
  endpoint,
  title,
}: ResolveTaskFormProps) => {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();
  const methods = useForm<ResolveTaskValues>({
    resolver: zodResolver(ResolveTaskSchema),
  });

  const query_client = useQueryClient();

  const { mutate: resolveTask, isPending: resolveTaskPending } = useMutation({
    mutationKey: ["_resolve_review_comment_"],
    mutationFn: async (data: ResolveTaskValues): Promise<Response> => {
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
    formState: { errors },
  } = methods;

  const onSubmit = (data: ResolveTaskValues) => {
    const resolveData: ResolveTaskValues = {
      ...data,
      resolved_by: {
        name: localStorage.getItem("user_name") || "",
        email: localStorage.getItem("user_email") || "",
        date_issued: new Date(),
      },
    };
    resolveTask(resolveData, {
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
        <AlertDialogContent className="p-0 max-w-[500px] bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="font-helvetica-large px-2 pt-2">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="bg-neutral-600" />
            <main className="px-5 py-3 flex flex-col gap-3">
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="resolution_summary"
                  className="font-helvetica-13">
                  Resolution Summary <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="title"
                  placeholder="Resolution Summary"
                  {...register("resolution_summary")}
                  className="font-helvetica-input-13 placeholder:font-helvetica-13"
                />
                <FormError error={errors.resolution_summary} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="resolution_details"
                  className="font-helvetica-13">
                  Resolution Details<span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="resolution_details"
                  placeholder="Resolution Details"
                  {...register("resolution_details")}
                  className="font-helvetica-input-13 placeholder:font-helvetica-13"
                />
                <FormError error={errors.resolution_details} />
              </div>
            </main>

            <Separator className="bg-neutral-600" />
            <footer className="flex justify-center gap-2 p-4">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-black text-white flex-1 font-helvetica-13">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={resolveTaskPending}
                type="submit"
                className="bg-green-900 text-white flex-1 font-helvetica-13">
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
