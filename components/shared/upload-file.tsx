"use client";

import { CircleUserRoundIcon, Trash2 } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Response } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { showToast } from "./toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UploadFile() {
  const params = useSearchParams();
  const query_client = useQueryClient();
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const { mutate: upload, isPending: uploadPending } = useMutation({
    mutationKey: ["_upload_file_", params.get("id")],
    mutationFn: async (data: FormData): Promise<Response> => {
      const response = await fetch(
        `${BASE_URL}/engagements/engagement_letter/${params.get("id")}`,
        {
          method: "PUT",
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

  const handleUpload = () => {
    if (!files[0]) return;

    const formData = new FormData();
    formData.append("attachment", files[0]?.file as Blob);
    upload(formData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_engagement_letter_", params.get("id")],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {},
    });
  };

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  return (
    <section className="relative py-4 px-2 min-h-[110px]">
      <section className="py-2">
        <Label className="font-[helvetica] text-[18px] scroll-m-1 font-bold truncate">
          Upload File
        </Label>
      </section>
      <section className="flex flex-col gap-5">
        <section className="flex items-center justify-between gap-1">
          <section className="flex items-center gap-2">
            <div
              className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
              aria-label={
                previewUrl ? "Preview of uploaded image" : "Default user avatar"
              }>
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="size-full object-cover"
                  src={previewUrl}
                  alt="Preview of uploaded image"
                  width={32}
                  height={32}
                />
              ) : (
                <div aria-hidden="true">
                  <CircleUserRoundIcon className="opacity-60" size={16} />
                </div>
              )}
            </div>
            <p
              className="font-[helvetica] scroll-m-1 font-medium text-[14px] truncate"
              aria-live="polite">
              {fileName}
            </p>
          </section>
          {fileName && (
            <div className="flex items-center font-[helvetica] text-[14px]">
              <Button
                variant="ghost"
                onClick={() => removeFile(files[0]?.id)}
                className="w-[33px] h-[33px] self-end"
                aria-label={`Remove ${fileName}`}>
                <Trash2 size={16} strokeWidth={3} />
              </Button>
            </div>
          )}
        </section>
        <section className="w-full flex items-center gap-2">
          <Button
            onClick={openFileDialog}
            aria-haspopup="dialog"
            className="flex-1 h-[30px]">
            {fileName ? "Change image" : "Upload image"}
          </Button>
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
          />
          <Button
            className="flex-1 h-[30px]"
            disabled={uploadPending}
            onClick={handleUpload}>
            Submit
          </Button>
        </section>
      </section>
    </section>
  );
}
