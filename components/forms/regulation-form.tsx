"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm } from "react-hook-form";
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
import { RegulationSchema } from "@/lib/types";

type RegulationValues = z.infer<typeof RegulationSchema>;

interface RegulationFormProps {
  children: React.ReactNode;
  engagement_id?: string;
  title: string;
  mode?: string;
}

export const RegulationForm = ({
  children,
  engagement_id,
  title,
  mode,
}: RegulationFormProps) => {
  const [open, setOpen] = useState(false);
  const methods = useForm<RegulationValues>({
    resolver: zodResolver(RegulationSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = (data: RegulationValues) => {
    console.log(data);
    console.log(engagement_id, mode);
    reset();
    setOpen(false);
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
                  Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Policy name"
                  {...register("name")}
                />
                <FormError error={errors.name} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="version"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Version<span className="text-destructive">*</span>
                </Label>
                <Input id="version" placeholder="" {...register("version")} />
                <FormError error={errors.version} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="key_areas"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Key areas <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="key_areas"
                  placeholder="Key areas"
                  {...register("key_areas")}
                />
                <FormError error={errors.key_areas} />
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
