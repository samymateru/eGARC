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
import { EngagementRiskSchema, Response } from "@/lib/types";
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

type RiskValues = z.infer<typeof EngagementRiskSchema>;

type Rating = {
  name?: string;
  magnitude: string;
};

type RiskRatingResponse = {
  values?: Array<Rating>;
};

interface RiskFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: string;
}

export const RiskForm = ({ children, id, endpoint, title }: RiskFormProps) => {
  const [open, setOpen] = useState(false);

  const methods = useForm<RiskValues>({
    resolver: zodResolver(EngagementRiskSchema),
  });

  const query_client = useQueryClient();

  const params = useSearchParams();

  const { data } = useQuery({
    queryKey: ["_risk_rating_"],
    queryFn: async (): Promise<RiskRatingResponse> => {
      const response = await fetch(`${BASE_URL}/profile/risk_rating`, {
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
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

  const { mutate: createRisk, isPending: createRiskLoading } = useMutation({
    mutationKey: ["_create_prcm_"],
    mutationFn: async (data: RiskValues): Promise<Response> => {
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

  const onSubmit = (data: RiskValues) => {
    createRisk(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["sub_program_procedure", params.get("action")],
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
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Risk name"
                  {...register("name")}
                />
                <FormError error={errors.name} />
              </div>
              <div>
                <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                  Risk rating
                </Label>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select control type" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                          {data?.values?.map((risk, index: number) => (
                            <SelectItem
                              key={index}
                              value={risk.name ?? ""}
                              className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer">
                              {risk.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.rating} />
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
                disabled={createRiskLoading}
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
