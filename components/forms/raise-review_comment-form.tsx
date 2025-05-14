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
import { RaiseReviewCommentSchema, Response, UserResponse } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { UserMultiSelector } from "../shared/user-multiselector";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RaiseReviewCommentValues = z.infer<typeof RaiseReviewCommentSchema>;

interface RaiseTaskProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: string;
}

export const RaiseReviewComment = ({
  children,
  id,
  endpoint,
  title,
}: RaiseTaskProps) => {
  const [open, setOpen] = useState(false);

  const methods = useForm<RaiseReviewCommentValues>({
    resolver: zodResolver(RaiseReviewCommentSchema),
  });

  const query_client = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["__users_"],
    queryFn: async (): Promise<UserResponse[]> => {
      const response = await fetch(`${BASE_URL}/users`, {
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

  const { mutate: raiseReviewComment, isPending: raiseReviewCommentPending } =
    useMutation({
      mutationKey: ["_raise_task_"],
      mutationFn: async (data: RaiseReviewCommentValues): Promise<Response> => {
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

  const onSubmit = (data: RaiseReviewCommentValues) => {
    const raiseData = {
      ...data,
      raised_by: {
        name: localStorage.getItem("user_name") || "",
        email: localStorage.getItem("user_email") || "",
        date_issued: new Date(),
      },
    };

    raiseReviewComment(raiseData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_summary_review_comments_"],
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
                      trigger="Selct action owners"
                      users={userData ?? []}
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
                disabled={raiseReviewCommentPending}
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
