import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Send,
  CircleX,
  UploadIcon,
  AlertCircleIcon,
  PaperclipIcon,
  XIcon,
  LoaderCircle,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { FileUploadSchema, Response } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { ErrorMessage } from "@/lib/utils";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { useSearchParams } from "next/navigation";

type FileUploadValues = z.infer<typeof FileUploadSchema>;

interface ProcedureFileUploaderFormPros {
  children: React.ReactNode;
  engagement_id: string | null;
  procedure_id: string | null;
  endpoint: string;
  title: string;
}

const sections: { [key: string]: string } = {
  Planning: "planning",
  Finalization: "finalization",
  Reporting: "reporting",
  Program: "program",
};

export const ProcedureFileUploaderForm = ({
  children,
  engagement_id,
  procedure_id,
  endpoint,
  title,
}: ProcedureFileUploaderFormPros) => {
  const [open, setOpen] = useState(false);
  const methods = useForm<FileUploadValues>({
    resolver: zodResolver(FileUploadSchema),
  });

  const params = useSearchParams();

  const maxSize = 5 * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,
  });

  const file = files[0];

  const query_client = useQueryClient();

  const { mutate: updloadFile, isPending: uploadFilePending } = useMutation({
    mutationKey: ["_upload_file_"],
    mutationFn: async (data: FormData): Promise<Response> => {
      const response = await fetch(
        `${BASE_URL}/${endpoint}/${
          sections[params.get("stage") ?? "Planning"]
        }/${engagement_id}?procedure_id=${procedure_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
          body: data,
        }
      );
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

  const { handleSubmit, reset } = methods;

  const onSubmit = () => {
    if (!uploadFilePending && errors.length <= 0) {
      const fileData = new FormData();
      fileData.append("attachment", file.file as Blob);
      updloadFile(fileData, {
        onSuccess: (data) => {
          const isAttachment = !!query_client.getQueryCache().find({
            queryKey: ["_attachments_", params.get("id"), params.get("action")],
          });
          if (isAttachment) {
            query_client.invalidateQueries({
              queryKey: [
                "_attachments_",
                params.get("id"),
                params.get("action"),
              ],
            });
          } else {
            query_client.fetchQuery({
              queryKey: [
                "_attachments_",
                params.get("id"),
                params.get("action"),
              ],
              queryFn: async () => {
                const response = await fetch(
                  `${BASE_URL}/attachments/${params.get(
                    "id"
                  )}?procedure_id=${params.get("action")}`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${
                        typeof window === "undefined"
                          ? ""
                          : localStorage.getItem("token")
                      }`,
                    },
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
          }
          showToast(data.detail, "success");
        },
        onError: (error) => {
          ErrorMessage(error);
        },
        onSettled: () => {
          reset();
          setOpen(false);
          removeFile(files[0]?.id);
        },
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="p-0 max-w-[550px] bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="font-helvetica-large px-2 pt-2">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="bg-neutral-600" />
            <main className="px-5 py-3 flex flex-col gap-2 items-center">
              <div className="flex flex-col gap-2 w-[500px]">
                <div
                  role="button"
                  onClick={openFileDialog}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-dragging={isDragging || undefined}
                  className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]">
                  <input
                    {...getInputProps()}
                    className="sr-only"
                    aria-label="Upload file"
                    disabled={Boolean(file)}
                  />

                  <div className="flex flex-col items-center justify-center text-center">
                    <div
                      className=" mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-neutral-800"
                      aria-hidden="true">
                      <UploadIcon className="size-4 opacity-100" />
                    </div>
                    <p className="mb-1.5 font-helvetica-13">Upload file</p>
                    <p className="text-muted-foreground text-xs">
                      Drag & drop or click to browse (max.{" "}
                      {formatBytes(maxSize)})
                    </p>
                  </div>
                </div>

                {errors.length > 0 && (
                  <div
                    className="text-destructive flex items-center gap-1 text-xs"
                    role="alert">
                    <AlertCircleIcon className="size-4 shrink-0" />
                    <span className="font-helvetica-13">{errors[0]}</span>
                  </div>
                )}
                {file && (
                  <div className="space-y-2">
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <PaperclipIcon
                          className="size-4 shrink-0 opacity-60"
                          aria-hidden="true"
                        />
                        <div className="">
                          <p className="truncate text-[13px] font-medium">
                            {file.file.name}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                        onClick={() => removeFile(files[0]?.id)}
                        aria-label="Remove file">
                        <XIcon className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
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
                type="submit"
                className="bg-green-900 text-white flex-1 font-helvetica-13">
                {uploadFilePending ? (
                  <LoaderCircle
                    className="mr-1 animate-spin"
                    size={16}
                    strokeWidth={3}
                  />
                ) : (
                  <Send className="mr-1" size={16} strokeWidth={3} />
                )}
                Submit
              </Button>
            </footer>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </FormProvider>
  );
};
