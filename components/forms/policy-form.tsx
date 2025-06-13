"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
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
import { PolicySchema, Response } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { ErrorMessage } from "@/lib/utils";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PolicyValues = z.infer<typeof PolicySchema>;

type DefaultPoliciesValues = {
  name?: string;
  version?: string;
  key_areas?: string;
  attachment?: File;
};

interface PolicyFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: "create" | "update";
  data?: DefaultPoliciesValues;
}

export const PolicyForm = ({
  children,
  id,
  endpoint,
  title,
  data,
  mode,
}: PolicyFormProps) => {
  const [open, setOpen] = useState(false);

  const params = useSearchParams();

  const query_client = useQueryClient();

  const methods = useForm<PolicyValues>({
    resolver: zodResolver(PolicySchema),
    defaultValues: data,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const { mutate: createPolicy, isPending: createPolicyLoading } = useMutation({
    mutationKey: ["_create_policy_", id],
    mutationFn: async (data: FormData): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
        body: data,
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

  const { mutate: updatePolicy, isPending: updatePolicyLoading } = useMutation({
    mutationKey: ["_update_policy_", id],
    mutationFn: async (data: FormData): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
        body: data,
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

  const onSubmit = (data: PolicyValues) => {
    const policyData = new FormData();
    policyData.append("name", data.name);
    policyData.append("version", data.version);
    policyData.append("key_areas", data.key_areas);
    policyData.append("attachment", data.attachment);

    if (mode === "create") {
      createPolicy(policyData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_policies_", params.get("id")],
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
      updatePolicy(policyData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_policies_", params.get("id")],
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
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Policy name"
                  {...register("name")}
                />
                <FormError error={errors.name} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="version"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Version<span className="text-destructive">*</span>
                </Label>
                <Input id="version" placeholder="" {...register("version")} />
                <FormError error={errors.version} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="key_areas"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Key areas <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="key_areas"
                  placeholder="Key areas"
                  {...register("key_areas")}
                />
                <FormError error={errors.key_areas} />
              </div>
              {mode === "create" ? (
                <div className="*:not-first:mt-2">
                  <Label htmlFor="attachment" className="ml-[2px] font-table">
                    Attachment
                  </Label>

                  <Controller
                    control={control}
                    name="attachment"
                    rules={{
                      required: "Attachment is required",
                      validate: (file) =>
                        file?.type === "application/pdf" ||
                        file?.type === "application/msword" ||
                        file?.type ===
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                        "Only PDF or Word documents are allowed",
                    }}
                    render={({ field }) => (
                      <>
                        <Input
                          id="attachment"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                          ref={field.ref}
                        />
                      </>
                    )}
                  />
                  <FormError error={errors.attachment} />
                </div>
              ) : null}
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
                disabled={createPolicyLoading || updatePolicyLoading}
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
