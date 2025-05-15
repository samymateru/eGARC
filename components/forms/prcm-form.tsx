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
import { PRCMSchema, Response } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../ui/scroll-area";
import { showToast } from "../shared/toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
type PRCMFormValues = z.infer<typeof PRCMSchema>;

interface PRCMFormPros {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: string;
}

type ControlTypeResponse = {
  values?: Array<string>;
};

type Rating = {
  name?: string;
  magnitude: string;
};

type RiskRatingResponse = {
  values?: Array<Rating>;
};

type BusinessProcessResponse = {
  process_name?: string;
  code?: string;
  sub_process_name: Array<string>;
};

const fetchData = async (endpont: string, id?: string) => {
  const response = await fetch(`${BASE_URL}/${endpont}/${id}`, {
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
};

export const PRCMForm = ({ children, id, endpoint, title }: PRCMFormPros) => {
  const [open, setOpen] = useState(false);

  const query_client = useQueryClient();

  const methods = useForm<PRCMFormValues>({
    resolver: zodResolver(PRCMSchema),
  });

  const results = useQueries({
    queries: [
      {
        queryKey: ["_process_"],
        queryFn: async (): Promise<BusinessProcessResponse[]> =>
          fetchData("profile/business_process", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!id,
      },
      {
        queryKey: ["_risk_rating_"],
        queryFn: async (): Promise<RiskRatingResponse> =>
          fetchData("profile/risk_rating", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!id,
      },
      {
        queryKey: ["_control_type_"],
        queryFn: async (): Promise<ControlTypeResponse> =>
          fetchData("profile/control_type", ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!id,
      },
    ],
  });

  const { mutate: createPRCM, isPending: createPRCMLoading } = useMutation({
    mutationKey: ["_create_prcm_"],
    mutationFn: async (data: PRCMFormValues): Promise<Response> => {
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

  const onSubmit = (data: PRCMFormValues) => {
    createPRCM(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_prcm_"],
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

  if (results[0].isLoading || results[1].isLoading || results[2].isLoading) {
    return <div>loading</div>;
  }
  if (results[0].isError || results[1].isError || results[2].isError) {
    return <div>Error</div>;
  }
  return (
    <FormProvider {...methods}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="p-0 max-w-[550px] dark:bg-black">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="text-[20px] font-bold font-serif tracking-wider scroll-m-1">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="" />
            <ScrollArea className="max-h-[450px] h-auto overflow-y-auto">
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
                        value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select control type" />
                        </SelectTrigger>

                        <SelectContent className="">
                          <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                            {results[0].data?.map((process, index: number) => (
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
                <div className="*:not-first:mt-2">
                  <Label
                    htmlFor="risk"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Risk name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="risk"
                    placeholder="Risk name"
                    {...register("risk")}
                  />
                  <FormError error={errors.risk} />
                </div>
                <div className="*:not-first:mt-2">
                  <Label
                    htmlFor="risk_rating"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Risk rating<span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="risk_rating"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select control type" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                            {results[1].data?.values?.map(
                              (risk, index: number) => (
                                <SelectItem
                                  key={index}
                                  value={risk.name ?? ""}
                                  className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer">
                                  {risk.name}
                                </SelectItem>
                              )
                            )}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormError error={errors.risk_rating} />
                </div>
                <div className="*:not-first:mt-2">
                  <Label
                    htmlFor="control"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Control name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="control"
                    placeholder="Control name"
                    {...register("control")}
                  />
                  <FormError error={errors.control} />
                </div>
                <div className="*:not-first:mt-2">
                  <Label
                    htmlFor="control_objective"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Control objective<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="control_objective"
                    placeholder="Control objective"
                    {...register("control_objective")}
                  />
                  <FormError error={errors.control_objective} />
                </div>
                <div className="*:not-first:mt-2">
                  <Label
                    htmlFor="control_type"
                    className="font-serif tracking-wide scroll-m-0 font-medium">
                    Control type<span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="control_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select control type" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                            {results[2].data?.values?.map(
                              (control, index: number) => (
                                <SelectItem
                                  key={index}
                                  value={control ?? ""}
                                  className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer">
                                  {control}
                                </SelectItem>
                              )
                            )}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormError error={errors.control_type} />
                </div>
              </main>
            </ScrollArea>

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
                disabled={createPRCMLoading}
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
