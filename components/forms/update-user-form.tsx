"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
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
import { Response, UpdateUserSchema } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
import { ErrorMessage } from "@/lib/utils";

type UpdateUserValues = z.infer<typeof UpdateUserSchema>;

interface UpdateUserFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: "create" | "update";
}

export const UpdateUserForm = ({
  children,
  id,
  endpoint,
  title,
}: UpdateUserFormProps) => {
  const [open, setOpen] = useState(false);

  const params = useSearchParams();

  const query_client = useQueryClient();
  const methods = useForm<UpdateUserValues>({
    resolver: zodResolver(UpdateUserSchema),
  });

  const { mutate: updateUser, isPending: updateUserLoading } = useMutation({
    mutationKey: ["_update_", id],
    mutationFn: async (data: UpdateUserValues): Promise<Response> => {
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
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = (data: UpdateUserValues) => {
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
                  Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Regulation name"
                  {...register("name")}
                  className="font-helvetica-input-13 placeholder:font-helvetica-13"
                />
                <FormError error={errors.name} />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="key_areas" className="font-helvetica-13">
                  Telephone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="Telephone"
                  {...register("telephone")}
                  className="font-helvetica-13"
                />
                <FormError error={errors.telephone} />
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
