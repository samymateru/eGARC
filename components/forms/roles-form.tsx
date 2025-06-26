"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Send, CircleX, PackageOpen, Archive } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Activity,
  AlertTriangle,
  BarChart,
  Building,
  CalendarRange,
  CircleCheck,
  CirclePlus,
  ClipboardCheck,
  Clock,
  Edit,
  ListTodo,
  Notebook,
  Settings,
  Trash,
  View,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Response, RolesSchema } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
import { ErrorMessage } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormError } from "../shared/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RolesValues = z.infer<typeof RolesSchema>;

const types = [
  {
    label: "Audit",
    value: "audit",
  },
  {
    label: "Business",
    value: "business",
  },
];

const sections = [
  {
    label: "Module",
    value: "e_audit",
  },
  {
    label: "Engagement",
    value: "engagement",
  },
];

interface RolesFormProps {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: "create" | "update";
}

export const RolesForm = ({
  children,
  id,
  endpoint,
  title,
}: RolesFormProps) => {
  const [open, setOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState<null | "section" | "type">(null);
  const params = useSearchParams();
  const methods = useForm<RolesValues>({
    resolver: zodResolver(RolesSchema),
  });

  const query_client = useQueryClient();

  const { mutate: createRole, isPending: createRolePending } = useMutation({
    mutationKey: ["_resolve_review_comment_"],
    mutationFn: async (data: RolesValues): Promise<Response> => {
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
  console.log(errors);
  const onSubmit = (data: RolesValues) => {
    console.log(data);
    const resolveData: RolesValues = {
      ...data,
    };
    createRole(resolveData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_summary_tasks_", params.get("id")],
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

  const handleToggle = (select: "section" | "type") => {
    setOpenSelect((prev) => (prev === select ? null : select));
  };
  return (
    <FormProvider {...methods}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="p-0 max-w-[calc(100vw-300px)] h-[100vh] bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="font-helvetica-large px-2 pt-2">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="bg-neutral-600" />
            <main className="px-5 pt-2 flex flex-col overflow-auto h-[calc(100vh-120px)]">
              <section className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-[84px]">
                  <Label htmlFor="role" className="font-helvetica-13">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="role"
                    placeholder="Roles name"
                    {...register("name")}
                    className="font-helvetica-input-13"
                  />
                  <FormError error={errors.name} />
                </div>
                <div className="flex-1">
                  <Label htmlFor="process" className="font-helvetica-13">
                    Type<span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        open={openSelect === "type"}
                        onOpenChange={() => handleToggle("type")}
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                          <SelectValue placeholder="Select role type" />
                        </SelectTrigger>

                        <SelectContent className="bg-neutral-200">
                          <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                            {types.map((type, index: number) => (
                              <SelectItem
                                className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black"
                                key={index}
                                value={type.value ?? ""}>
                                <span>{type.label}</span>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className="h-6">
                    <FormError error={errors.type} />
                  </div>
                </div>
                <div className="flex-1">
                  <Label htmlFor="process" className="font-helvetica-13">
                    Section<span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="section"
                    control={control}
                    render={({ field }) => (
                      <Select
                        open={openSelect === "section"}
                        onOpenChange={() => handleToggle("section")}
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                          <SelectValue placeholder="Select role section" />
                        </SelectTrigger>

                        <SelectContent className="bg-neutral-200">
                          <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                            {sections.map((type, index: number) => (
                              <SelectItem
                                className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black"
                                key={index}
                                value={type.value ?? ""}>
                                <span>{type.label}</span>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className="h-6">
                    <FormError error={errors.section} />
                  </div>
                </div>
              </section>
              <section className="border border-neutral-500">
                <Table>
                  <TableBody>
                    <TableRow className="*:border-border  bg-blue-100 hover:bg-blue-100 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black text-center">
                        <Activity
                          size={16}
                          strokeWidth={2}
                          className="mb-[4px] mr-[6px] inline-block"
                        />
                        Action
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-black text-center">
                        <View
                          size={16}
                          strokeWidth={2}
                          className="mb-[4px] mr-[6px] inline-block"
                        />
                        View
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-black text-center">
                        <CirclePlus
                          size={16}
                          strokeWidth={2}
                          className="mb-[4px] mr-[6px] inline-block"
                        />
                        Create
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-black text-center">
                        <Edit
                          size={16}
                          strokeWidth={2}
                          className="mb-[4px] mr-[6px] inline-block"
                        />
                        Edit
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-black text-center">
                        <Trash
                          size={16}
                          strokeWidth={2}
                          className="mb-[4px] mr-[6px] inline-block text-red-700"
                        />
                        Delete
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-black text-center">
                        <CircleCheck
                          size={16}
                          strokeWidth={2}
                          className="mb-[4px] mr-[6px] inline-block"
                        />
                        Approve
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black">
                        <Settings
                          size={16}
                          strokeWidth={2}
                          className="inline-block mb-[5px] mr-[6px]"
                        />
                        Settings
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="settings"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="settings.view"
                                checked={field.value?.includes("view")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "view"]
                                    : (field.value || []).filter(
                                        (v) => v !== "view"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="settings"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="settings.create"
                                checked={field.value?.includes("create")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "create"]
                                    : (field.value || []).filter(
                                        (v) => v !== "create"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="settings"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="settings.edit"
                                checked={field.value?.includes("edit")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "edit"]
                                    : (field.value || []).filter(
                                        (v) => v !== "edit"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="settings"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="settings.delete"
                                checked={field.value?.includes("delete")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "delete"]
                                    : (field.value || []).filter(
                                        (v) => v !== "delete"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="settings"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="settings.approve"
                                checked={field.value?.includes("approve")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "approve"]
                                    : (field.value || []).filter(
                                        (v) => v !== "approve"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black">
                        <Notebook
                          size={16}
                          strokeWidth={2}
                          className="inline-block mb-[5px] mr-[6px]"
                        />
                        Audit Plans
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_plans"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_plans.view"
                                checked={field.value?.includes("view")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "view"]
                                    : (field.value || []).filter(
                                        (v) => v !== "view"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_plans"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_plans.create"
                                checked={field.value?.includes("create")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "create"]
                                    : (field.value || []).filter(
                                        (v) => v !== "create"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_plans"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_plans.edit"
                                checked={field.value?.includes("edit")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "edit"]
                                    : (field.value || []).filter(
                                        (v) => v !== "edit"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_plans"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_plans.delete"
                                checked={field.value?.includes("delete")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "delete"]
                                    : (field.value || []).filter(
                                        (v) => v !== "delete"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_plans"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_plans.approve"
                                checked={field.value?.includes("approve")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "approve"]
                                    : (field.value || []).filter(
                                        (v) => v !== "approve"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black">
                        <Building
                          size={16}
                          strokeWidth={2}
                          className="inline-block mb-[5px] mr-[6px]"
                        />
                        Administration
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="administration"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="administration.view"
                                checked={field.value?.includes("view")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "view"]
                                    : (field.value || []).filter(
                                        (v) => v !== "view"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="administration"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="administration.create"
                                checked={field.value?.includes("create")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "create"]
                                    : (field.value || []).filter(
                                        (v) => v !== "create"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="administration"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="administration.edit"
                                checked={field.value?.includes("edit")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "edit"]
                                    : (field.value || []).filter(
                                        (v) => v !== "edit"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="administration"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="administration.delete"
                                checked={field.value?.includes("delete")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "delete"]
                                    : (field.value || []).filter(
                                        (v) => v !== "delete"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="administration"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="administration.approve"
                                checked={field.value?.includes("approve")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "approve"]
                                    : (field.value || []).filter(
                                        (v) => v !== "approve"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black">
                        <CalendarRange
                          size={16}
                          strokeWidth={2}
                          className="inline-block mb-[5px] mr-[6px]"
                        />
                        Planning
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="planning"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="planning.view"
                                checked={field.value?.includes("view")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "view"]
                                    : (field.value || []).filter(
                                        (v) => v !== "view"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="planning"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="planning.create"
                                checked={field.value?.includes("create")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "create"]
                                    : (field.value || []).filter(
                                        (v) => v !== "create"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="planning"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="planning.edit"
                                checked={field.value?.includes("edit")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "edit"]
                                    : (field.value || []).filter(
                                        (v) => v !== "edit"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="planning"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="planning.delete"
                                checked={field.value?.includes("delete")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "delete"]
                                    : (field.value || []).filter(
                                        (v) => v !== "delete"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="planning"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="planning.approve"
                                checked={field.value?.includes("approve")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "approve"]
                                    : (field.value || []).filter(
                                        (v) => v !== "approve"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black">
                        <ClipboardCheck
                          size={16}
                          strokeWidth={2}
                          className="inline-block mb-[5px] mr-[6px]"
                        />
                        Fieldwork
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="fieldwork"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="fieldwork.view"
                                checked={field.value?.includes("view")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "view"]
                                    : (field.value || []).filter(
                                        (v) => v !== "view"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="fieldwork"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="fieldwork.create"
                                checked={field.value?.includes("create")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "create"]
                                    : (field.value || []).filter(
                                        (v) => v !== "create"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="fieldwork"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="fieldwork.edit"
                                checked={field.value?.includes("edit")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "edit"]
                                    : (field.value || []).filter(
                                        (v) => v !== "edit"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="fieldwork"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="fieldwork.delete"
                                checked={field.value?.includes("delete")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "delete"]
                                    : (field.value || []).filter(
                                        (v) => v !== "delete"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="fieldwork"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="fieldwork.approve"
                                checked={field.value?.includes("approve")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "approve"]
                                    : (field.value || []).filter(
                                        (v) => v !== "approve"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black">
                        <BarChart
                          size={16}
                          strokeWidth={2}
                          className="inline-block mb-[5px] mr-[6px]"
                        />
                        Reporting
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="reporting"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="reporting.view"
                                checked={field.value?.includes("view")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "view"]
                                    : (field.value || []).filter(
                                        (v) => v !== "view"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="reporting"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="reporting.create"
                                checked={field.value?.includes("create")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "create"]
                                    : (field.value || []).filter(
                                        (v) => v !== "create"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="reporting"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="reporting.edit"
                                checked={field.value?.includes("edit")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "edit"]
                                    : (field.value || []).filter(
                                        (v) => v !== "edit"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="reporting"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="reporting.delete"
                                checked={field.value?.includes("delete")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "delete"]
                                    : (field.value || []).filter(
                                        (v) => v !== "delete"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="reporting"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="reporting.approve"
                                checked={field.value?.includes("approve")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "approve"]
                                    : (field.value || []).filter(
                                        (v) => v !== "approve"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black">
                        <ListTodo
                          size={16}
                          strokeWidth={2}
                          className="inline-block mb-[5px] mr-[6px]"
                        />
                        Work Program
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_program"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_program.view"
                                checked={field.value?.includes("view")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "view"]
                                    : (field.value || []).filter(
                                        (v) => v !== "view"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_program"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_program.create"
                                checked={field.value?.includes("create")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "create"]
                                    : (field.value || []).filter(
                                        (v) => v !== "create"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_program"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_program.edit"
                                checked={field.value?.includes("edit")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "edit"]
                                    : (field.value || []).filter(
                                        (v) => v !== "edit"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_program"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_program.delete"
                                checked={field.value?.includes("delete")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "delete"]
                                    : (field.value || []).filter(
                                        (v) => v !== "delete"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="audit_program"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="audit_program.approve"
                                checked={field.value?.includes("approve")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "approve"]
                                    : (field.value || []).filter(
                                        (v) => v !== "approve"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black">
                        <Clock
                          size={16}
                          strokeWidth={2}
                          className="inline-block mb-[5px] mr-[6px]"
                        />
                        Follow Up
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="follow_up"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="follow_up.view"
                                checked={field.value?.includes("view")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "view"]
                                    : (field.value || []).filter(
                                        (v) => v !== "view"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="follow_up"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="follow_up.create"
                                checked={field.value?.includes("create")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "create"]
                                    : (field.value || []).filter(
                                        (v) => v !== "create"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="follow_up"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="follow_up.edit"
                                checked={field.value?.includes("edit")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "edit"]
                                    : (field.value || []).filter(
                                        (v) => v !== "edit"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="follow_up"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="follow_up.delete"
                                checked={field.value?.includes("delete")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "delete"]
                                    : (field.value || []).filter(
                                        (v) => v !== "delete"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="follow_up"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="follow_up.approve"
                                checked={field.value?.includes("approve")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "approve"]
                                    : (field.value || []).filter(
                                        (v) => v !== "approve"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                      <TableCell className="font-helvetica-13 text-black">
                        <AlertTriangle
                          size={16}
                          strokeWidth={2}
                          className="inline-block mb-[5px] mr-[6px]"
                        />
                        Issues
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="issue_management"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="issue_management.view"
                                checked={field.value?.includes("view")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "view"]
                                    : (field.value || []).filter(
                                        (v) => v !== "view"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="issue_management"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="issue_management.create"
                                checked={field.value?.includes("create")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "create"]
                                    : (field.value || []).filter(
                                        (v) => v !== "create"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="issue_management"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="issue_management.edit"
                                checked={field.value?.includes("edit")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "edit"]
                                    : (field.value || []).filter(
                                        (v) => v !== "edit"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="issue_management"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="issue_management.delete"
                                checked={field.value?.includes("delete")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "delete"]
                                    : (field.value || []).filter(
                                        (v) => v !== "delete"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 font-helvetica-13 text-center">
                        <div className="flex justify-center items-center h-full">
                          <Controller
                            name="issue_management"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                className="h-4 w-4 p-0 m-0 data-[state=checked]:p-0"
                                id="issue_management.approve"
                                checked={field.value?.includes("approve")}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), "approve"]
                                    : (field.value || []).filter(
                                        (v) => v !== "approve"
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>
              <section className="flex items-center gap-4 mb-3 mt-4">
                <section className="flex items-center gap-2">
                  <Label className="font-helvetica-13">
                    <Archive
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[2px] mr-2"
                    />
                    Archive Audit:
                  </Label>
                  <Controller
                    name="archive_audit"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value === "yes"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "yes" : "no")
                        }
                        className="self-start h-4 w-4 p-0 m-0 shrink-0 overflow-hidden border border-gray-400 rounded-sm data-[state=checked]:bg-black focus-visible:ring-0 focus-visible:outline-none"
                      />
                    )}
                  />
                </section>
                <Separator
                  orientation="vertical"
                  className="h-[20px] bg-neutral-500"
                />
                <section className="flex items-center gap-2">
                  <Label className="font-helvetica-13">
                    <PackageOpen
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[2px] mr-2"
                    />
                    Re-open Audit:
                  </Label>
                  <Controller
                    name="un_archive_audit"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value === "yes"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "yes" : "no")
                        }
                        className="h-4 w-4 p-0 m-0 shrink-0 overflow-hidden border border-gray-400 rounded-sm data-[state=checked]:bg-black focus-visible:ring-0 focus-visible:outline-none"
                      />
                    )}
                  />
                </section>
              </section>
            </main>

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
                disabled={createRolePending}
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
