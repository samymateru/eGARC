import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { Response, SummaryAuditProgramSchema } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type SummaryAuditProgramValues = z.infer<typeof SummaryAuditProgramSchema>;

interface SummaryAuditProgramFormProps {
  children: React.ReactNode;
  prcm_id: string | null;
  process: string;
  risk: string;
  risk_rating: string;
  control_: string;
  control_objective: string;
  control_type: string;
  endpoint: string;
  title: string;
  mode?: string;
}

type Procedure = {
  procedure_id?: string;
  procedure_title?: string;
};

type WorkProgramResponse = {
  id?: string;
  name?: string;
  procedures: Array<Procedure>;
};

export const SummaryAuditProgramForm = ({
  children,
  process,
  prcm_id,
  risk,
  risk_rating,
  control_,
  control_objective,
  control_type,
  endpoint,
  title,
}: SummaryAuditProgramFormProps) => {
  const [open, setOpen] = useState(false);
  const methods = useForm<SummaryAuditProgramValues>({
    resolver: zodResolver(SummaryAuditProgramSchema),
  });
  const [programOpen, setProgramOpen] = useState(false);
  const [subProcedureOpen, setSubProcedureOpen] = useState(false);
  const [programId, setProgramId] = useState<string>("");

  const params = useSearchParams();

  const query_client = useQueryClient();

  const { data } = useQuery({
    queryKey: ["work_program", params.get("id")],
    queryFn: async (): Promise<WorkProgramResponse[]> => {
      const response = await fetch(
        `${BASE_URL}/engagements/work_program/${params.get("id")}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
        }
      );
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          body: errorBody,
        };
      }
      return await response.json();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!params.get("id"),
  });

  const {
    mutate: createSummaryAuditProgram,
    isPending: createSummaryAuditProgramLoading,
  } = useMutation({
    mutationKey: ["_create_summary_audit_program_"],
    mutationFn: async (data: SummaryAuditProgramValues): Promise<Response> => {
      const response = await fetch(
        `${BASE_URL}/${endpoint}/${params.get("id")}?prcm_id=${prcm_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
          body: JSON.stringify(data),
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
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit = (data: SummaryAuditProgramValues) => {
    const summaryAuditProgramData = {
      ...data,
      process,
      risk,
      risk_rating,
      control: control_,
      control_objective,
      control_type,
    };
    createSummaryAuditProgram(summaryAuditProgramData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_summary_program_", params.get("id")],
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
        <AlertDialogContent
          className="p-0 max-w-[500px] dark:bg-black"
          onClick={(e) => e.stopPropagation()}>
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
                <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                  Program<span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="program"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selected = data?.find((p) => p.name === value);
                        setProgramId(selected?.id ?? "");
                        setValue("procedure", "", { shouldValidate: true });
                      }}
                      value={field.value}
                      open={programOpen}
                      onOpenChange={(open) => {
                        setProgramOpen(open);
                        if (open) setSubProcedureOpen(false);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select control type" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                          {data?.map((program) => (
                            <SelectItem
                              key={program.id}
                              value={program.name ?? ""}
                              className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer">
                              {program.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.program} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="procedure"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Procedure<span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="procedure"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      open={subProcedureOpen}
                      onOpenChange={(open) => {
                        setSubProcedureOpen(open);
                        if (open) setProgramOpen(false);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select control type" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                          {data
                            ?.find((p) => p.id === programId)
                            ?.procedures.filter(
                              (procedure) => !!procedure.procedure_title
                            )
                            .map((procedure, index: number) => (
                              <SelectItem
                                key={index}
                                value={procedure.procedure_title ?? ""}
                                className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer">
                                {procedure.procedure_title}
                              </SelectItem>
                            ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.procedure} />
              </div>
            </main>

            <Separator />
            <footer className="flex justify-center gap-2 p-4">
              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                  setOpen(false);
                  e.stopPropagation();
                }}
                className="bg-red-800 text-white flex-1 font-serif tracking-wide scroll-m-1 font-bold">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                onClick={(e) => e.stopPropagation()}
                disabled={createSummaryAuditProgramLoading}
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
