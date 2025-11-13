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
import { useSearchParams } from "next/navigation";

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
  endpoint: string;
  mode?: "create" | "update";
  data: OrganizationValues;
}

export const OrganizationForm = ({
  children,
  title,
  endpoint,
  data,
  mode,
}: OrganizationFormProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const params = useSearchParams();
  const query_client = useQueryClient();

  const { mutate: createOrganization, isPending: createOrganizationLoading } =
    useMutation({
      mutationKey: ["create_organization"],
      mutationFn: async (data: OrganizationValues) => {
        const response = await fetch(
          `${BASE_URL}/${endpoint}/${params.get("entityId")}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                typeof window === "undefined"
                  ? ""
                  : localStorage.getItem("token")
              }`,
            },
            body: JSON.stringify(data),
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
    });

  const { mutate: updateOrganization, isPending: updateOrganizationLoading } =
    useMutation({
      mutationKey: ["update_organization"],
      mutationFn: async (data: OrganizationValues) => {
        const response = await fetch(`${BASE_URL}/${endpoint}/`, {
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
        <DialogContent className="p-0 gap-0 max-w-[500px] bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="rounded-tl rounded-tr  py-2">
              <DialogTitle className="font-helvetica-large px-2 pt-2">
                {title}
              </DialogTitle>
              <DialogDescription className="hidden" />
            </DialogHeader>

            <Separator className="bg-neutral-600" />

            <section className="py-5 px-5 flex flex-col gap-3">
              <div className="*:not-first:mt-2 flex-1">
                <Label htmlFor="name" className="font-helvetica-13">
                  Organization<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Organization name"
                  {...register("name")}
                  className="font-helvetica-input-13 placeholder:font-helvetica-13"
                />
                <FormError error={errors.name} />
              </div>
              <div className="*:not-first:mt-2 flex-1">
                <Label htmlFor="email" className="font-helvetica-13">
                  Email<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  placeholder="Organization Email"
                  {...register("email")}
                  className="font-helvetica-input-13 placeholder:font-helvetica-13"
                />
                <FormError error={errors.email} />
              </div>
              <div className="*:not-first:mt-2 flex-1">
                <Label htmlFor="telephone" className="font-helvetica-13">
                  Telephone<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  placeholder="Organization Telephone"
                  {...register("telephone")}
                  className="font-helvetica-input-13 placeholder:font-helvetica-13"
                />
                <FormError error={errors.telephone} />
              </div>
              <div className="*:not-first:mt-2 flex-1">
                <Label htmlFor="type" className="font-helvetica-13">
                  Type <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="font-helvetica-13 border border-neutral-600">
                        <SelectValue placeholder="Select Organization type" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-200">
                        {organization_types.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.value}
                            className="font-helvetica-13 cursor-pointer hover:bg-neutral-400">
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
                type="button"
                onClick={() => setOpen(false)}
                className="font-helvetica-13 bg-black text-white flex-1">
                <CircleX size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={
                  createOrganizationLoading || updateOrganizationLoading
                }
                type="submit"
                className="bg-green-900 font-helvetica-13 flex-1">
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
