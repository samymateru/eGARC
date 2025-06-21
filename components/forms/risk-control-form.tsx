import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { useEffect, useState } from "react";
import { Send, CircleX } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { RiskControlSchema, Response } from "@/lib/types";
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
import { useSearchParams } from "next/navigation";
import { ErrorMessage } from "@/lib/utils";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RiskControlFormValues = z.infer<typeof RiskControlSchema>;

interface RiskControlPros {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: "create" | "update";
  data?: RiskControlFormValues;
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

const fetchData = async (endpont: string, id?: string | null) => {
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

export const RiskControlForm = ({
  children,
  id,
  endpoint,
  title,
  data,
}: RiskControlPros) => {
  const [open, setOpen] = useState(false);

  const query_client = useQueryClient();

  const [openSelect, setOpenSelect] = useState<"rating" | "type" | null>(null);

  const [entityId, setEntityId] = useState<string | null>(null);

  const params = useSearchParams();

  useEffect(() => {
    const entityId = localStorage.getItem("entity_id");
    if (entityId) {
      setEntityId(entityId);
    }
  }, []);

  const methods = useForm<RiskControlFormValues>({
    resolver: zodResolver(RiskControlSchema),
    defaultValues: data,
  });

  const results = useQueries({
    queries: [
      {
        queryKey: ["_process_", entityId],
        queryFn: async (): Promise<BusinessProcessResponse[]> =>
          fetchData("profile/business_process", entityId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!entityId,
      },
      {
        queryKey: ["_risk_rating_", entityId],
        queryFn: async (): Promise<RiskRatingResponse> =>
          fetchData("profile/risk_rating", entityId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!entityId,
      },
      {
        queryKey: ["_control_type_", entityId],
        queryFn: async (): Promise<ControlTypeResponse> =>
          fetchData("profile/control_type", entityId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!entityId,
      },
    ],
  });

  const { mutate: createRiskControl, isPending: createRiskControlLoading } =
    useMutation({
      mutationKey: ["_create_risk_control_", id],
      mutationFn: async (data: RiskControlFormValues): Promise<Response> => {
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

  const onSubmit = (data: RiskControlFormValues) => {
    createRiskControl(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_risk_control_", params.get("action")],
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
        <AlertDialogContent className="p-0 max-w-[550px] bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="font-helvetica-large px-2 pt-2">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="" />
            <ScrollArea className="max-h-[450px] h-auto overflow-y-auto">
              <main className="px-5 py-3 flex flex-col gap-3">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="risk" className="font-helvetica-13">
                    Risk name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="risk"
                    placeholder="Risk name"
                    {...register("risk")}
                    className="font-helvetica-input-13 placeholder:font-helvetica-13"
                  />
                  <FormError error={errors.risk} />
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor="risk_rating" className="font-helvetica-13">
                    Risk rating<span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="risk_rating"
                    control={control}
                    render={({ field }) => (
                      <Select
                        open={openSelect === "rating"}
                        onOpenChange={(isOpen) =>
                          setOpenSelect(isOpen ? "rating" : null)
                        }
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                          <SelectValue
                            placeholder="Select control type"
                            className="placeholder:font-helvetica-13"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-100">
                          <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                            {results[1].data?.values?.map(
                              (risk, index: number) => (
                                <SelectItem
                                  key={index}
                                  value={risk.name ?? ""}
                                  className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
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
                  <Label htmlFor="control" className="font-helvetica-13">
                    Control name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="control"
                    placeholder="Control name"
                    {...register("control")}
                    className="font-helvetica-input-13 placeholder:font-helvetica-13"
                  />
                  <FormError error={errors.control} />
                </div>
                <div className="*:not-first:mt-2">
                  <Label
                    htmlFor="control_objective"
                    className="font-helvetica-13">
                    Control objective<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="control_objective"
                    placeholder="Control objective"
                    {...register("control_objective")}
                    className="font-helvetica-input-13 placeholder:font-helvetica-13"
                  />
                  <FormError error={errors.control_objective} />
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor="control_type" className="font-helvetica-13">
                    Control type<span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="control_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        open={openSelect === "type"}
                        onOpenChange={(isOpen) =>
                          setOpenSelect(isOpen ? "type" : null)
                        }
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                          <SelectValue
                            placeholder="Select control type"
                            className="placeholder:font-helvetica-13"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-100">
                          <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                            {results[2].data?.values?.map(
                              (control, index: number) => (
                                <SelectItem
                                  key={index}
                                  value={control ?? " "}
                                  className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
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
                disabled={createRiskControlLoading}
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
