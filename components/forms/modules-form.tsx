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
import { ErrorMessage } from "@/lib/utils";
import { NewModuleSchema } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ModuleValues = z.infer<typeof NewModuleSchema>;

const moduleName = [
  "eAuditNext",
  "eRisk",
  "eGovernance",
  "eCompliance",
  "eFraud",
];
interface ModuleFormProps {
  children: ReactNode;
  title: string;
  id: string | null;
  endpoint: string;
  mode?: string;
}

export const ModuleForm = ({
  children,
  title,
  id,
  endpoint,
}: ModuleFormProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const query_client = useQueryClient();

  const { mutate: createModule, isPending: createModuleLoading } = useMutation({
    mutationKey: ["signin"],
    mutationFn: async (data: ModuleValues) => {
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

  const methods = useForm<ModuleValues>({
    resolver: zodResolver(NewModuleSchema),
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: ModuleValues) => {
    const moduleData: ModuleValues = {
      name: data.name,
      licence_id: "cb67a203f8da",
    };

    createModule(moduleData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_modules_"],
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

            <Separator />

            <section className="py-5 px-5 flex flex-col gap-3">
              <div className="*:not-first:mt-2">
                <Label htmlFor="name" className="font-helvetica-table-13">
                  Module name<span className="text-destructive">*</span>
                </Label>

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="font-helvetica-13 border border-neutral-600">
                        <SelectValue
                          placeholder="Choose module"
                          className="placeholder:font-helvetica-13"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-200">
                        {moduleName.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item}
                            className="font-helvetica-13 cursor-pointer hover:bg-neutral-400">
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.name} />
              </div>
            </section>

            <Separator />

            <footer className="rounded-br rounded-bl flex px-4 py-2 gap-2">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-black font-helvetica-13 text-white flex-1">
                <CircleX size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={createModuleLoading}
                type="submit"
                className="bg-green-700 font-helvetica-13 text-white flex-1">
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
