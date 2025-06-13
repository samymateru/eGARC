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

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const IssueReportSchema = z.object({
  reportable: z.string(),
});

type IssueReportValues = z.infer<typeof IssueReportSchema>;

interface IssueReportFormProps {
  children: ReactNode;
  title: string;
  id: string | null;
  endpoint: string;
}

const reportables = ["False", "True"];

export const IssueReportForm = ({
  children,
  title,
  id,
  endpoint,
}: IssueReportFormProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const query_client = useQueryClient();

  const { mutate: issueReportable, isPending: issueReportablePending } =
    useMutation({
      mutationKey: ["issue_reportable", id],
      mutationFn: async (data: IssueReportValues) => {
        const response = await fetch(
          `${BASE_URL}/${endpoint}/${id}?reportable=${data.reportable}`,
          {
            method: "PUT",
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

  const methods = useForm<IssueReportValues>({
    resolver: zodResolver(IssueReportSchema),
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: IssueReportValues) => {
    issueReportable(data, {
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
                  htmlFor="reportable"
                  className="font-serif tracking-wide scroll-m-1 font-semibold">
                  Reportable <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="reportable"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportables.map((item, index) => (
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
                <FormError error={errors.reportable} />
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
                disabled={issueReportablePending}
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
