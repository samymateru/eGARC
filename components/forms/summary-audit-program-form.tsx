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
import { ErrorMessage } from "@/lib/utils";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type SummaryAuditProgramValues = z.infer<typeof SummaryAuditProgramSchema>;

interface SummaryAuditProgramFormProps {
  children: React.ReactNode;
  prcm_id: string | null;
  endpoint: string;
  title: string;
  mode?: string;
}

type Procedure = {
  procedure_id?: string;
  procedure_title?: string;
  reference?: string;
};

type WorkProgramResponse = {
  id?: string;
  name?: string;
  procedures: Array<Procedure>;
};

export const SummaryAuditProgramForm = ({
  children,
  prcm_id,
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
  const [procedureId, setProcedureId] = useState<string>("");
  const [reference, setReference] = useState<string>("");

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
    mutationKey: ["_create_summary_audit_program_", prcm_id],
    mutationFn: async (
      formData: SummaryAuditProgramValues
    ): Promise<Response> => {
      const response = await fetch(
        `${BASE_URL}/${endpoint}/${prcm_id}?procedure_id=${procedureId}&reference=${reference}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
          body: JSON.stringify(formData),
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
    createSummaryAuditProgram(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_summary_program_", params.get("id")],
        });
        query_client.invalidateQueries({
          queryKey: ["_prcm_", params.get("id")],
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
        <AlertDialogContent
          className="p-0 max-w-[500px] bg-white"
          onClick={(e) => e.stopPropagation()}>
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
                <Label className="font-helvetica-13">
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
                        setValue("procedure", "");
                      }}
                      value={field.value}
                      open={programOpen}
                      onOpenChange={(open) => {
                        setProgramOpen(open);
                        if (open) setSubProcedureOpen(false);
                      }}>
                      <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                        <SelectValue
                          placeholder="Select control type"
                          className="placeholder:font-helvetica-13"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-100">
                        <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                          {data?.map((program) => (
                            <SelectItem
                              key={program.id}
                              value={program.name ?? ""}
                              className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
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
                <Label htmlFor="procedure" className="font-helvetica-13">
                  Procedure<span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="procedure"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selectedProcedure = data
                          ?.find((p) => p.id === programId)
                          ?.procedures.find(
                            (procedure) => procedure.procedure_title === value
                          );
                        setProcedureId(selectedProcedure?.procedure_id ?? "");
                        setReference(selectedProcedure?.reference ?? "");
                      }}
                      value={field.value}
                      open={subProcedureOpen}
                      onOpenChange={(open) => {
                        setSubProcedureOpen(open);
                        if (open) setProgramOpen(false);
                      }}>
                      <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                        <SelectValue
                          placeholder="Select control type"
                          className="placeholder:font-helvetica-13"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-100">
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
                                className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
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
                onClick={(e) => {
                  setOpen(false);
                  e.stopPropagation();
                }}
                className="bg-black text-white flex-1 font-helvetica-13">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                onClick={(e) => e.stopPropagation()}
                disabled={createSummaryAuditProgramLoading}
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
