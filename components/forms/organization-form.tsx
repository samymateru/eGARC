import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { CircleX, Send } from "lucide-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormError } from "../shared/form-error";
import { showToast } from "../shared/toast";
import { OrganizationSchema } from "@/lib/types";
import { Input } from "../ui/input";
import { ErrorMessage } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type OrganizationValues = z.infer<typeof OrganizationSchema>;

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

interface OrganizationFormProps {
  children: ReactNode;
  title: string;
  id: string | null;
  endpoint: string;
  mode?: "create" | "update";
  data: OrganizationValues;
}

export const OrganizationForm = ({
  children,
  title,
  id,
  endpoint,
  data,
  mode,
}: OrganizationFormProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const query_client = useQueryClient();

  const { mutate: createOrganization, isPending: createOrganizationLoading } =
    useMutation({
      mutationKey: ["signin"],
      mutationFn: async (data: OrganizationValues) => {
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
        return await response.json();
      },
    });

  const { mutate: updateOrganization, isPending: updateOrganizationLoading } =
    useMutation({
      mutationKey: ["update_organization"],
      mutationFn: async (data: OrganizationValues) => {
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
        return await response.json();
      },
    });

  const methods = useForm<OrganizationValues>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: data,
  });

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: OrganizationValues) => {
    const organizationData: OrganizationValues = {
      name: data.name,
      email: data.email,
      type: data.type,
      telephone: data.telephone,
      website: "",
    };

    if (mode === "create") {
      createOrganization(organizationData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["organizations"],
          });
          showToast(data.detail, "success");
        },
        onError: (error: unknown) => {
          ErrorMessage(error);
        },
        onSettled: () => {
          reset();
          setOpen(false);
        },
      });
    } else {
      updateOrganization(organizationData, {
        onSuccess: (data) => {
          query_client.invalidateQueries({
            queryKey: ["organizations"],
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="p-0 gap-0 max-w-[500px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="rounded-tl rounded-tr  py-2">
              <DialogTitle className="font-serif text-[20px] pl-3 tracking-wide scroll-m-0 font-bold text-xl">
                {title}
              </DialogTitle>
              <DialogDescription className="hidden" />
            </DialogHeader>

            <Separator />

            <section className="py-5 px-5 flex flex-col gap-3">
              <div className="*:not-first:mt-2 flex-1">
                <Label
                  htmlFor="website"
                  className="font-table tracking-wide scroll-m-1 font-semibold">
                  Organization<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Organization name"
                  {...register("name")}
                />
                <FormError error={errors.name} />
              </div>
              <div className="*:not-first:mt-2 flex-1">
                <Label
                  htmlFor="website"
                  className="font-table tracking-wide scroll-m-1 font-semibold">
                  Email<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  placeholder="Organization Email"
                  {...register("email")}
                />
                <FormError error={errors.email} />
              </div>
              <div className="*:not-first:mt-2 flex-1">
                <Label
                  htmlFor="website"
                  className="font-table tracking-wide scroll-m-1 font-semibold">
                  Telephone<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  placeholder="Organization Telephone"
                  {...register("telephone")}
                />
                <FormError error={errors.telephone} />
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
                        <SelectValue placeholder="Select Organization type" />
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
                <FormError error={errors.type} />
              </div>
            </section>

            <Separator />

            <footer className="rounded-br rounded-bl flex px-4 py-2 gap-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setOpen(false)}
                className="bg-red-800 font-serif font-semibold flex-1">
                <CircleX size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                variant="ghost"
                disabled={
                  createOrganizationLoading || updateOrganizationLoading
                }
                type="submit"
                className="bg-green-800 font-serif font-semibold flex-1">
                <Send size={16} strokeWidth={3} />
                {"Submit"}
              </Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
