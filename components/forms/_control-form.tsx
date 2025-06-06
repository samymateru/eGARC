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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormError } from "../shared/form-error";
import { showToast } from "../shared/toast";
import { ControlSchema } from "@/lib/types";
import { useSearchParams } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ControlValues = z.infer<typeof ControlSchema>;

type ControlTypeResponse = {
  values?: Array<string>;
};

interface DialogHelperProps {
  children: ReactNode;
  title: string;
  id: string | null;
  endpoint: string;
  mode?: string;
}

export const ControlForm = ({
  children,
  title,
  id,
  endpoint,
}: DialogHelperProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const query_client = useQueryClient();

  const params = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["control_type"],
    queryFn: async (): Promise<ControlTypeResponse> => {
      const response = await fetch(`${BASE_URL}/profile/control_type`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch control");
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const { mutate: createControl, isPending: createControlLoading } =
    useMutation({
      mutationKey: ["signin"],
      mutationFn: async (data: ControlValues) => {
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

  const methods = useForm<ControlValues>({
    resolver: zodResolver(ControlSchema),
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: ControlValues) => {
    createControl(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["sub_program_procedure", params.get("action")],
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

            <ScrollArea className="h-[400px]">
              <section className="py-5 px-5 flex flex-col gap-3">
                <div className="*:not-first:mt-2">
                  <Label
                    htmlFor="name"
                    className="font-serif tracking-wide scroll-m-1 font-semibold">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Control name"
                    {...register("name")}
                  />
                  <FormError error={errors.name} />
                </div>

                <div className="*:not-first:mt-2">
                  <Label
                    htmlFor="objective"
                    className="font-serif tracking-wide scroll-m-1 font-semibold">
                    Objective <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="objective"
                    placeholder="Provide a control objective"
                    {...register("objective")}
                    className="min-h-[90px] max-h-[120px]"
                  />
                  <FormError error={errors.objective} />
                </div>

                <div className="*:not-first:mt-2">
                  <Label
                    htmlFor="type"
                    className="font-serif tracking-wide scroll-m-1 font-semibold">
                    Type <span className="text-destructive">*</span>
                  </Label>
                  {!isLoading && data && (
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.values?.map((item, index) => (
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
                  )}
                  {errors.type && (
                    <p className="text-red-500 text-sm">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </section>
            </ScrollArea>

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
                disabled={createControlLoading}
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
