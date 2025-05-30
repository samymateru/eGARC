"use client";
import { FormError } from "@/components/shared/form-error";
import { showToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn, Send } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import "@/app/globals.css";
import z from "zod";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";

const organization_types = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance", label: "Finance" },
  { value: "Education", label: "Education" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Retail", label: "Retail" },
  { value: "Energy", label: "Energy" },
  { value: "Construction", label: "Construction" },
  { value: "Transportation", label: "Transportation" },
  { value: "Agriculture", label: "Agriculture" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Telecommunications", label: "Telecommunications" },
  { value: "Legal Services", label: "Legal Services" },
  { value: "Non-Profit", label: "Non-Profit" },
  { value: "Government", label: "Government" },
  { value: "Media", label: "Media" },
  { value: "Professional Services", label: "Professional Services" },
  { value: "Consulting", label: "Consulting" },
];

const EntitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  owner: z.string().min(1, "Owner is required"),
  email: z.string().email("Provide a valid email"),
  telephone: z.string().min(1, "Telephone is required"),
  website: z.string().min(1, "Provide a valid URL"),
  type: z
    .string({ required_error: "Type is required" })
    .min(1, "Type is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type EntityValues = z.infer<typeof EntitySchema>;

export default function EntityForm() {
  const router = useRouter();
  const methods = useForm<EntityValues>({
    resolver: zodResolver(EntitySchema),
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = methods;

  const { mutate: createEntity, isPending: createControlLoading } = useMutation(
    {
      mutationKey: ["create-entity"],
      mutationFn: async (data: EntityValues) => {
        const response = await fetch(`${BASE_URL}/entity`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        return await response.json();
      },
    }
  );

  const onSubmit = (data: EntityValues) => {
    console.log("Form data:", data);
    createEntity(data, {
      onSuccess: (data) => {
        console.log("Entity created successfully:", data);
        router.push("/signin");
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {
        reset();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center items-center h-screen flex-col gap-4">
        <section className="flex flex-col items-center gap-2 text-center">
          <Label className="text-white font-[helvetica] font-semibold text-2xl">
            eGARC System
          </Label>
          <Label className="text-white font-[helvetica] font-semibold text-[16px]">
            Create Entity
          </Label>
        </section>

        <section className="py-5 px-5 flex flex-col gap-1 min-w-[700px] text-white">
          <section className="flex justify-between items-center gap-2">
            <div className="*:not-first:mt-2 flex-1">
              <Label
                htmlFor="name"
                className="font-table tracking-wide scroll-m-1 font-semibold">
                Entity Name<span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Entity name"
                {...register("name")}
              />
              <div className="h-4">
                <FormError error={errors.name} />
              </div>
            </div>
            <div className="*:not-first:mt-2 flex-1">
              <Label
                htmlFor="owner"
                className="font-table tracking-wide scroll-m-1 font-semibold">
                Entity Owner<span className="text-destructive">*</span>
              </Label>
              <Input
                id="owner"
                placeholder="Entity owner"
                {...register("owner")}
              />
              <div className="h-4">
                <FormError error={errors.owner} />
              </div>
            </div>
          </section>

          <section className="flex justify-between items-center gap-2">
            <div className="*:not-first:mt-2 flex-1">
              <Label
                htmlFor="email"
                className="font-table tracking-wide scroll-m-1 font-semibold">
                Email<span className="text-destructive">*</span>
              </Label>
              <Input id="email" placeholder="Email" {...register("email")} />
              <div className="h-4">
                <FormError error={errors.email} />
              </div>
            </div>
            <div className="*:not-first:mt-2 flex-1">
              <Label
                htmlFor="telephone"
                className="font-table tracking-wide scroll-m-1 font-semibold">
                Telephone<span className="text-destructive">*</span>
              </Label>
              <Input
                id="telephone"
                placeholder="Phone"
                {...register("telephone")}
              />
              <div className="h-4">
                <FormError error={errors.telephone} />
              </div>
            </div>
          </section>

          <section className="flex justify-between items-center gap-2">
            <div className="*:not-first:mt-2 flex-1">
              <Label
                htmlFor="website"
                className="font-table tracking-wide scroll-m-1 font-semibold">
                Website<span className="text-destructive">*</span>
              </Label>
              <Input
                id="website"
                placeholder="Website"
                {...register("website")}
              />
              <div className="h-4">
                <FormError error={errors.website} />
              </div>
            </div>
            <div className="*:not-first:mt-2 flex-1">
              <Label
                htmlFor="type"
                className="font-serif tracking-wide scroll-m-1 font-semibold">
                Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select control type" />
                    </SelectTrigger>
                    <SelectContent>
                      {organization_types.map((item, index) => (
                        <SelectItem
                          key={index}
                          value={item.value}
                          className="font-serif tracking-wide scroll-m-1 dark:hover:bg-neutral-800 cursor-pointer">
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="h-4">
                <FormError error={errors.type} />
              </div>
            </div>
          </section>
          <div className="*:not-first:mt-2">
            <Label
              htmlFor="password"
              className="font-table tracking-wide scroll-m-1 font-semibold">
              Password<span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <FormError error={errors.password} />
          </div>
        </section>

        <footer className="rounded-br rounded-bl flex px-4 py-2 gap-2 min-w-[450px]">
          <Button
            onClick={() => router.push("/signin")}
            disabled={createControlLoading}
            variant="ghost"
            type="button"
            className="bg-red-800 font-serif font-semibold flex-1">
            <LogIn size={16} strokeWidth={3} />
            Login
          </Button>
          <Button
            variant="ghost"
            disabled={createControlLoading}
            type="submit"
            className="bg-green-800 font-serif font-semibold flex-1">
            <Send size={16} strokeWidth={3} />
            {"Submit"}
          </Button>
        </footer>
      </form>
    </FormProvider>
  );
}
