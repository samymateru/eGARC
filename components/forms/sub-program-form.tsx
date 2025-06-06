import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { Dispatch, SetStateAction, useState } from "react";
import { Send, CircleX } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Response, SubProgramSchema } from "@/lib/types";
import { showToast } from "../shared/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type SubProgramValues = z.infer<typeof SubProgramSchema>;

interface SubProgramFormPros {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: "create" | "update";
  data?: SubProgramValues;
  setOnSuccess?: Dispatch<SetStateAction<boolean>>;
}

export const SubProgramForm = ({
  children,
  id,
  endpoint,
  title,
  data,
  setOnSuccess,
}: SubProgramFormPros) => {
  const [open, setOpen] = useState(false);

  const methods = useForm<SubProgramValues>({
    resolver: zodResolver(SubProgramSchema),
    defaultValues: data,
  });

  const query_client = useQueryClient();

  const { mutate: createSubProgram, isPending: createSubProgramLoading } =
    useMutation({
      mutationKey: ["_create_sub_program_"],
      mutationFn: async (data: SubProgramValues): Promise<Response> => {
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
    formState: { errors },
  } = methods;

  const onSubmit = (data: SubProgramValues) => {
    createSubProgram(data, {
      onSuccess: (data) => {
        setOnSuccess?.(false);
        query_client.invalidateQueries({
          queryKey: ["work_program"],
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
                  htmlFor="title"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Sub program title<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Sub program title"
                  {...register("title")}
                />
                <FormError error={errors.title} />
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
                disabled={createSubProgramLoading}
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
