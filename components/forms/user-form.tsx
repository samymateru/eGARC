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
import { ErrorMessage } from "@/lib/utils";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type UsersValues = z.infer<typeof UserSchema>;

const titles = [
  "Head of Audit",
  "Chief Audit Executive",
  "Senior Auditor",
  "Audit Specialist",
  "System Auditor",
  "Auditor",
  "Audit Associate",
  "Administrator",
];

const auditRoles = ["Head of Audit", "Administrator", "Member"];

const businessRoles = [
  "Business Management",
  "Risk Oversight Role",
  "Compliance Oversight Role",
];

const business = [
  "Chief Executive Officer (CEO/MD)",
  "Director/Head of Public Relations",
  "Director/Head of Finance",
  "Director/Head of Human Resource",
  "Director/Head of IT",
  "Director/Head of Business",
  "Director/Head of Risk",
  "Director/Head of Compliance",
  "Director/Head of Commercial",
  "Director/Head of Marketing",
  "Chief Operating Officer",
  "Management Assurance Specialist (MAS)",
  "Business Manager",
  "Business Specialist/Senior",
  "Business Officer",
  "Officer",
];

interface UsersProps {
  children: React.ReactNode;
  id: string | null;
  endpoint?: string;
  title: string;
  mode?: "create" | "update";
  member: string;
  data: UsersValues;
}

export const UsersForm = ({
  children,
  id,
  endpoint,
  title,
  member,
  data,
  mode,
}: UsersProps) => {
  const [open, setOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState<"title" | "role" | null>(null);

  const methods = useForm<UsersValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: data,
  });

  const query_client = useQueryClient();
  const params = useSearchParams();

  const { mutate: updateUser, isPending: updateUserLoading } = useMutation({
    mutationKey: ["_update_teams_", id],
    mutationFn: async (data: UsersValues): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "PUT",
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
      title: data.title,
      module: params.get("moduleId") ?? "",
      type: member,
    };

    if (mode === "create") {
      createUser(userData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_teams_", params.get("moduleId")],
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
    } else {
      updateUser(userData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["_teams_", params.get("moduleId")],
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
    }
  };

  return (
    <FormProvider {...methods}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="p-0 max-w-[500px] bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="font-helvetica-large px-2 pt-2">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="bg-neutral-600" />
            <main className="px-5 py-3 flex flex-col gap-2">
              {mode === "create" ? (
                <>
                  <div className="*:not-first:mt-2">
                    <Label htmlFor="name" className="font-helvetica-13">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Team member name"
                      {...register("name")}
                      className="font-helvetica-input-13 placeholder:font-helvetica-13"
                    />
                    <FormError error={errors.name} />
                  </div>
                  <div className="*:not-first:mt-2">
                    <Label htmlFor="email" className="font-helvetica-13">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      placeholder="Team member email"
                      {...register("email")}
                      className="font-helvetica-input-13 placeholder:font-helvetica-13"
                    />
                    <FormError error={errors.email} />
                  </div>
                  <div className="*:not-first:mt-2">
                    <Label htmlFor="telephone" className="font-helvetica-13">
                      Telephone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="telephone"
                      placeholder="+255 787306314"
                      {...register("telephone")}
                      className="font-helvetica-input-13 placeholder:font-helvetica-13"
                    />
                    <FormError error={errors.telephone} />
                  </div>
                </>
              ) : null}
              <div className="*:not-first:mt-2 flex-1">
                <Label htmlFor="title" className="font-helvetica-13">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Select
                      open={openSelect === "title"}
                      onOpenChange={(isOpen) =>
                        setOpenSelect(isOpen ? "title" : null)
                      }
                      onValueChange={field.onChange}
                      value={field.value}>
                      <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                        <SelectValue placeholder="Select Member Title" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-200">
                        {member === "audit"
                          ? titles.map((item, index) => (
                              <SelectItem
                                key={index}
                                value={item}
                                className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                {item}
                              </SelectItem>
                            ))
                          : business.map((item, index) => (
                              <SelectItem
                                key={index}
                                value={item}
                                className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                {item}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.title} />
              </div>
              <div className="*:not-first:mt-2 flex-1">
                <Label htmlFor="role" className="font-helvetica-13">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      open={openSelect === "role"}
                      onOpenChange={(isOpen) =>
                        setOpenSelect(isOpen ? "role" : null)
                      }
                      onValueChange={field.onChange}
                      value={field.value}>
                      <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                        <SelectValue placeholder="Select Member Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-200 z-50 pointer-events-auto">
                        {member === "audit"
                          ? auditRoles.map((item, index) => (
                              <SelectItem
                                key={index}
                                value={item}
                                className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                {item}
                              </SelectItem>
                            ))
                          : businessRoles.map((item, index) => (
                              <SelectItem
                                key={index}
                                value={item}
                                className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
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
                onClick={() => setOpen(false)}
                className="bg-black text-white flex-1 font-helvetica-13">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={createUserLoading || updateUserLoading}
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
