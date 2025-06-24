"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Send, CircleX } from "lucide-react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { ExitModuleSchema, Response } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
import { ErrorMessage } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormError } from "../shared/form-error";
import { Textarea } from "../ui/textarea";

type ExitModuleValues = z.infer<typeof ExitModuleSchema>;

interface ExitModuleFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
}

export const ExitModuleForm = ({
  children,
  id,
  endpoint,
  title,
}: ExitModuleFormProps) => {
  const [open, setOpen] = useState(false);

  const params = useSearchParams();

  const query_client = useQueryClient();
  const methods = useForm<ExitModuleValues>({
    resolver: zodResolver(ExitModuleSchema),
  });

  const { mutate: updateUser, isPending: updateUserLoading } = useMutation({
    mutationKey: ["_update_", id],
    mutationFn: async (data: ExitModuleValues): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "POST",
        headers: {
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
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (data: ExitModuleValues) => {
    updateUser(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_regulations_", params.get("id")],
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
                <Label htmlFor="name" className="font-helvetica-13">
                  Reason<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reason"
                  placeholder="Reason"
                  {...register("reason")}
                  className="font-helvetica-input-13 placeholder:font-helvetica-13"
                />
                <FormError error={errors.reason} />
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor="description" className="font-helvetica-13">
                  Description<span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Description"
                  {...register("reason")}
                  className="font-helvetica-input-13 placeholder:font-helvetica-13 min-h-[100px] max-h-[200px]"
                />
                <FormError error={errors.description} />
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
                disabled={updateUserLoading}
                type="submit"
                className="bg-red-800 text-white flex-1 font-helvetica-13">
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
