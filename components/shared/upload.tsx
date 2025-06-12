"use client";

import { FileTextIcon, X } from "lucide-react";

import { FileWithPreview } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { InputHTMLAttributes } from "react";
import { Label } from "../ui/label";

interface FileUploaderProps {
  files: FileWithPreview[];
  openFileDialog: () => void;
  removeFile: (id: string) => void;
  getInputProps: () => InputHTMLAttributes<HTMLInputElement>;
}

export default function UploadFile({
  files,
  openFileDialog,
  removeFile,
  getInputProps,
}: FileUploaderProps) {
  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  return (
    <div className="">
      <div className="flex flex-col">
        {fileName && (
          <div
            className="w-full flex justify-between items-center"
            aria-label={
              previewUrl ? "Preview of uploaded image" : "Default user avatar"
            }>
            <div className="flex gap-2 items-center">
              <div className="">
                <FileTextIcon strokeWidth={2} />
              </div>
              <Label className="flex-1 truncate font-serif tracking-wider scroll-m-0 text-[16px]">
                {fileName}
              </Label>
            </div>

            <Button
              onClick={() => removeFile(files[0]?.id)}
              className="w-[30px] h-[30px]"
              aria-label={`Remove ${fileName}`}>
              <X />
            </Button>
          </div>
        )}

        <div className="relative inline-block">
          <Button onClick={openFileDialog} aria-haspopup="dialog">
            {fileName ? "Change image" : "Upload image"}
          </Button>
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
          />
        </div>
      </div>
    </div>
  );
}
