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
import { UserSchema, Response } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSearchParams } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type UsersValues = z.infer<typeof UserSchema>;

const titles = [
  "Chief Audit Executive",
  "Head of Audit",
  "Senior Auditor",
  "Audit Specialist",
  "System Auditor",
  "Auditor",
  "Audit Associate",
];

const business = [
  "Chief Executive Officer (CEO)",
  "Head of HR",
  "Director of IT",
  "Head of department",
  "Senior Manager",
  "Management Assurance Specialist (MAS)",
  "Business Manager",
  "Business Specialist/Senior",
  "Business Officer",
  "Officer",
  "Compliance Role (CR)",
  "Risk Management Role (RMR)",
];

interface UsersProps {
  children: React.ReactNode;
  id: string | null;
  endpoint?: string;
  title: string;
  mode?: string;
  member: string;
}

export const UsersForm = ({
  children,
  id,
  endpoint,
  title,
  member,
}: UsersProps) => {
  const [open, setOpen] = useState(false);

  const methods = useForm<UsersValues>({
    resolver: zodResolver(UserSchema),
  });

  const query_client = useQueryClient();
  const params = useSearchParams();

  const { mutate: createUser, isPending: createUserLoading } = useMutation({
    mutationKey: ["_create_teams_", id],
    mutationFn: async (data: UsersValues): Promise<Response> => {
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

  const onSubmit = (data: UsersValues) => {
    const userData: UsersValues = {
      name: data.name,
      email: data.email,
      telephone: data.telephone,
      role: data.role,
      module: params.get("moduleId") ?? "",
      type: member,
    };

    createUser(userData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_teams_", params.get("moduleId")],
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
                  placeholder="Team member name"
                  {...register("name")}
                />
                <FormError error={errors.name} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="email"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  placeholder="Team member email"
                  {...register("email")}
                />
                <FormError error={errors.email} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="telephone"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Telephone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="telephone"
                  placeholder="+255 787306314"
                  {...register("telephone")}
                />
                <FormError error={errors.telephone} />
              </div>
              <div className="*:not-first:mt-2 flex-1">
                <Label
                  htmlFor="type"
                  className="font-serif tracking-wide scroll-m-1 font-semibold">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Member Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {member === "audit"
                          ? titles.map((item, index) => (
                              <SelectItem
                                key={index}
                                value={item}
                                className="font-serif tracking-wide scroll-m-1 dark:hover:bg-neutral-800 cursor-pointer">
                                {item}
                              </SelectItem>
                            ))
                          : business.map((item, index) => (
                              <SelectItem
                                key={index}
                                value={item}
                                className="font-serif tracking-wide scroll-m-1 dark:hover:bg-neutral-800 cursor-pointer">
                                {item}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.role} />
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
                disabled={createUserLoading}
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
