"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { CircleX, Send } from "lucide-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormError } from "./form-error";
import { showToast } from "./toast";
import UploadFile from "./upload";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ControlSchema = z.object({
  notes: z.string().min(1, "Implementation notes is important"),
});

interface SaveIssue {
  children: ReactNode;
  title: string;
  submit_text?: string;
}

export const SaveIssue = ({ children, title, submit_text }: SaveIssue) => {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const [open, setOpen] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: async (data: z.infer<typeof ControlSchema>) => {
      console.log(data);
      const response = await fetch(`${BASE_URL}/control/`, {
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
        throw new Error("Login failed");
      }
      return await response.json();
    },
  });

  const methods = useForm<z.infer<typeof ControlSchema>>({
    resolver: zodResolver(ControlSchema),
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (control_data: z.infer<typeof ControlSchema>) => {
    mutate(control_data, {
      onSuccess: (data) => {
        setOpen(false);
        reset();
        console.log(data);
      },
      onError: (error) => {
        showToast(error.message, "error");
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="p-0 gap-0 max-w-[500px] bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="rounded-tl rounded-tr pl-6 pt-2 flex items-center py-2">
              <DialogTitle className="font-serif tracking-wide scroll-m-0 font-bold text-xl">
                {title}
              </DialogTitle>
              <DialogDescription />
            </DialogHeader>

            <Separator />

            <ScrollArea className="h-[300px]">
              <section className="py-5 px-5 flex flex-col gap-3">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="notes">
                    Implementation notes
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Leave a message"
                    className="min-h-[120px] max-h-[150px]"
                    {...register("notes")}
                  />
                </div>
                <FormError error={errors.notes} />
                <div className="w-full">
                  <UploadFile
                    files={files}
                    removeFile={removeFile}
                    openFileDialog={openFileDialog}
                    getInputProps={getInputProps}
                  />
                </div>
              </section>
            </ScrollArea>

            <Separator />

            <footer className="rounded-br rounded-bl flex justify-end pr-2 py-2 gap-2">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-red-500 font-serif font-semibold w-[120px] truncate">
                <CircleX size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                className="bg-green-500 font-serif font-semibold w-[120px] truncate">
                <Send size={16} strokeWidth={3} />
                {submit_text ?? "Submit"}
              </Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
