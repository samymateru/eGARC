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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormError } from "./form-error";
import { showToast } from "./toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ControlTypeResponse = {
  values?: Array<string>;
};

const ControlSchema = z.object({
  name: z.string().min(1, "Control name is required"),
  objective: z.string().min(1, "Objective is required"),
  type: z.string().min(1, "Type is required"),
});

interface DialogHelperProps {
  children: ReactNode;
  title: string;
  submit_text?: string;
  sub_program_id: number;
}

export const DialogHelper = ({
  children,
  title,
  submit_text,
  sub_program_id,
}: DialogHelperProps) => {
  const [open, setOpen] = useState<boolean>(false);

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
  console.log(data);

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: async (data: z.infer<typeof ControlSchema>) => {
      console.log(data);
      const response = await fetch(`${BASE_URL}/control/${sub_program_id}`, {
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
        <DialogContent className="p-0 gap-0 max-w-[500px]">
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
                  <Label htmlFor="name">
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
                  <Label htmlFor="objective">
                    Objective <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="objective"
                    placeholder="Provide a control objective"
                    {...register("objective")}
                    className="max-h-[120px]"
                  />
                  <FormError error={errors.objective} />
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor="type">
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
                              <SelectItem key={index} value={item}>
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
