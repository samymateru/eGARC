import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "../shared/form-error";
import { useState } from "react";
import { Send, CircleX } from "lucide-react";
import { DatePicker } from "../shared/date-picker";
import { PlanSchema, Response } from "@/lib/types";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PlanFormValues = z.infer<typeof PlanSchema>;

interface PlanDialogProps {
  title?: string;
  mode?: string;
  endpoint?: string;
  company_module_id?: string;
  audit_plan_id?: string;
  children: React.ReactNode;
}

export const PlanningForm = ({
  children,
  title,
  company_module_id,
  endpoint,
}: PlanDialogProps) => {
  const [open, setOpen] = useState(false);
  const query_client = useQueryClient();
  const methods = useForm<PlanFormValues>({
    resolver: zodResolver(PlanSchema),
  });

  const { mutate: createMutation, isPending } = useMutation({
    mutationKey: ["_create_annual_plan_"],
    mutationFn: async (data: FormData): Promise<Response> => {
      const response = await fetch(
        `${BASE_URL}/${endpoint}/${company_module_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
          body: data,
        }
      );
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

  const onSubmit = (data: PlanFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("year", data.year);
    formData.append("start", data.start.toISOString());
    formData.append("end", data.end.toISOString());
    formData.append("attachment", data.attachment);
    createMutation(formData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({ queryKey: ["_annual_plan_"] });
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
        <AlertDialogContent className="p-0 w-max-h-[500px] dark:bg-black">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="text-[20px] font-bold font-serif tracking-wider scroll-m-1">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="" />
            <section className="px-5 py-3 flex flex-col gap-2">
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="name"
                  className="ml-[2px] font-serif tracking-wide scroll-m-0 text-[14px] font-semibold">
                  Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Plan name"
                />
                <FormError error={errors.name} />
              </div>

              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="year"
                  className="ml-[2px] font-serif tracking-wide scroll-m-0 text-[14px] font-semibold">
                  Year
                </Label>
                <Input
                  id="year"
                  {...register("year")}
                  placeholder="e.g., 2025"
                />
                <FormError error={errors.year} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="attachment"
                  className="ml-[2px] font-serif tracking-wide scroll-m-0 text-[14px] font-semibold">
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
              <section className="flex items-center gap-2">
                <div className="*:not-first:mt-2 flex-1 flex flex-col">
                  <Label
                    htmlFor="year"
                    className="ml-[2px] font-serif tracking-wide scroll-m-0 text-[14px] font-semibold">
                    Start
                  </Label>
                  <Controller
                    name="start"
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
                  <div className="h-5">
                    <FormError error={errors.start} />
                  </div>
                </div>
                <div className="*:not-first:mt-2 flex-1 flex flex-col">
                  <Label
                    htmlFor="year"
                    className="ml-[2px] font-serif tracking-wide scroll-m-0 text-[14px] font-semibold">
                    End
                  </Label>
                  <Controller
                    name="end"
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
                  <div className="h-5">
                    <FormError error={errors.end} />
                  </div>
                </div>
              </section>
            </section>
            <Separator />
            <footer className="flex justify-center gap-2 p-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                }}
                className="bg-red-800 text-white flex-1 font-serif tracking-wide scroll-m-1 font-bold">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={isPending}
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
