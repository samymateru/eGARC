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
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { RegulationSchema, Response } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
import { DatePicker } from "../shared/date-picker";
import { ErrorMessage } from "@/lib/utils";

type RegulationValues = z.infer<typeof RegulationSchema>;

type DefaultRegulationValues = {
  name?: string;
  issue_date?: Date;
  key_areas?: string;
  attachment?: File;
};

interface RegulationFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: "create" | "update";
  data?: DefaultRegulationValues;
}

export const RegulationForm = ({
  children,
  id,
  endpoint,
  title,
  data,
  mode,
}: RegulationFormProps) => {
  const [open, setOpen] = useState(false);

  const params = useSearchParams();

  const query_client = useQueryClient();
  const methods = useForm<RegulationValues>({
    resolver: zodResolver(RegulationSchema),
    defaultValues: data,
  });

  const { mutate: createRegulation, isPending: createRegulationLoading } =
    useMutation({
      mutationKey: ["_create_regulation_", id],
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

  const { mutate: updateRegulation, isPending: updateRegulationLoading } =
    useMutation({
      mutationKey: ["_update_regulation_", id],
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

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = (data: RegulationValues) => {
    const regulationData = new FormData();
    regulationData.append("name", data.name);
    regulationData.append("issue_date", data.issue_date.toISOString());
    regulationData.append("key_areas", data.key_areas);
    regulationData.append("attachment", data.attachment);

    if (mode === "create") {
      createRegulation(regulationData, {
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
    } else {
      updateRegulation(regulationData, {
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
    }
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
              <div className="*:not-first:mt-2 flex-1 flex flex-col gap-1">
                <Label className="ml-[2px] font-helvetica-13 pb-[1px]">
                  Issue Date
                </Label>
                <Controller
                  name="issue_date"
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

                <FormError error={errors.issue_date} />
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor="key_areas" className="font-helvetica-13">
                  Key areas <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="key_areas"
                  placeholder="Key areas"
                  {...register("key_areas")}
                  className="font-helvetica-13"
                />
                <FormError error={errors.key_areas} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="attachment"
                  className="ml-[2px] font-helvetica-13">
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
                        className="font-helvetica-input-13 placeholder:font-helvetica-13"
                      />
                    </>
                  )}
                />

                <FormError error={errors.attachment} />
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
                disabled={createRegulationLoading || updateRegulationLoading}
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
