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
import { EngagementProcessSchema } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type EngagementProcessValues = z.infer<typeof EngagementProcessSchema>;

interface EngagementProcessFormProps {
  children: React.ReactNode;
  engagement_id?: string;
  title: string;
  mode?: string;
}

type BusinessProcessResponse = {
  process_name?: string;
  code?: string;
  sub_process_name: Array<string>;
};

export const EngagementProcessForm = ({
  children,
  engagement_id,
  title,
  mode,
}: EngagementProcessFormProps) => {
  const [processOpen, setProcessOpen] = useState(false);
  const [subProcessOpen, setSubProcessOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const methods = useForm<EngagementProcessValues>({
    resolver: zodResolver(EngagementProcessSchema),
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["__process__"],
    queryFn: async (): Promise<BusinessProcessResponse[]> => {
      const response = await fetch(`${BASE_URL}/profile/business_process`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      return await response.json();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: EngagementProcessValues) => {
    console.log(data);
    console.log(engagement_id, mode);
    reset();
    setOpen(false);
  };
  if (isLoading) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div>loading</div>;
  }
  const selectedProcess = watch("process");
  const subProcesses =
    data?.find((bp) => bp.process_name === selectedProcess)?.sub_process_name ??
    [];

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
                  htmlFor="process"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Process<span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="process"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      open={processOpen}
                      onOpenChange={(open) => {
                        setProcessOpen(open);
                        if (open) setSubProcessOpen(false); // close sub-process if opening process
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select control type" />
                      </SelectTrigger>

                      <SelectContent className="">
                        <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                          {data?.map((process, index: number) => (
                            <SelectItem
                              className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                              key={index}
                              value={process.process_name ?? ""}>
                              {process.process_name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.process} />
              </div>
              <div></div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="sub_process"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Sub process<span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="sub_process"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      open={subProcessOpen}
                      onOpenChange={(open) => {
                        setSubProcessOpen(open);
                        if (open) setProcessOpen(false); // close process if opening sub-process
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select control type" />
                      </SelectTrigger>

                      <SelectContent className="">
                        <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                          {subProcesses?.map((sub_process, index: number) => (
                            <SelectItem
                              className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                              key={index}
                              value={sub_process ?? ""}>
                              {sub_process}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.sub_process} />
              </div>

              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="description"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Description here"
                  className="min-h-[100px] max-h-[120px]"
                  {...register("description")}
                />
                <FormError error={errors.description} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="business_unit"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Business unit
                </Label>
                <Input
                  id="business_unit"
                  placeholder="Description here"
                  className=""
                  {...register("business_unit")}
                />
                <FormError error={errors.business_unit} />
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
