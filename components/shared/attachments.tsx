import {
  FaFileImage,
  FaFilePdf,
  FaFileExcel,
  FaFileWord,
} from "react-icons/fa";
import { Label } from "../ui/label";
import { File, FileText, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Attachement = {
  id?: string;
  name?: string;
  value?: string;
  size?: string;
  extension?: string;
  type?: string;
};

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import UploadFile from "./upload-file";

export const Attachments = () => {
  const params = useSearchParams();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["_engagement_letter_", params.get("id")],
    queryFn: async (): Promise<Attachement[]> => {
      const response = await fetch(
        `${BASE_URL}/engagements/engagement_letter/${params.get("id")}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!params.get("id"),
  });

  if (!isLoading && isSuccess && data) {
    return (
      <section className="flex flex-col gap-5">
        <Separator className="mt-2" />
        {data.sort().map((letter, index: number) => {
          const { type, name, size, extension } = letter;
          if (letter.type !== "") {
            return (
              <section key={index} className="flex flex-col gap-1">
                <section className="flex items-center justify-between px-2">
                  <Label className="font-[helvetica] font-bold scroll-m-1 tracking-normal">
                    {letter.type === "final"
                      ? "Signed Engagement Letter"
                      : "Scoped Engagement Letter"}
                  </Label>
                  {type === "final" ? <UploadDialog /> : null}
                </section>
                <section
                  key={index}
                  className=" px-2 py-2 rounded-md flex items-center bg-neutral-800">
                  <section className="flex-1 flex items-center gap-2">
                    <section>
                      {extension === "pdf" ? (
                        <FaFilePdf size={24} />
                      ) : extension === "xls" ? (
                        <FaFileExcel size={24} />
                      ) : extension === "docx" ? (
                        <FaFileWord size={24} />
                      ) : extension === "image/png" ? (
                        <FaFileImage size={24} />
                      ) : extension === "image/jpeg" ? (
                        <FaFileImage size={24} />
                      ) : (
                        <FileText size={24} />
                      )}
                    </section>
                    <section>
                      <Label className="font-[helvetica] font-semibold tracking-normal scroll-m-1 truncate text-[15px]">
                        {name}
                      </Label>
                    </section>
                  </section>
                  <section className="flex items-center gap-1 h-[20px]">
                    <section>
                      <Label className="font-[helvetica] font-semibold italic">
                        {size}MB
                      </Label>
                    </section>
                    <Separator
                      orientation="vertical"
                      className="mx-2 bg-white"
                    />
                    <section>
                      <Label className="font-[helvetica] font-semibold">
                        {extension}
                      </Label>
                    </section>
                    <Separator
                      orientation="vertical"
                      className="mx-2 bg-white"
                    />
                    <section>
                      <Button
                        className="w-[30px] h-[30px] hover:bg-black"
                        variant="ghost">
                        <Trash2
                          size={16}
                          className="text-red-700"
                          strokeWidth={3}
                        />
                      </Button>
                    </section>
                  </section>
                </section>
              </section>
            );
          }
        })}
        <Separator className="mb-2" />
      </section>
    );
  }
};

const UploadDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="w-[130px] h-[28px] bg-blue-700" variant="ghost">
          <File size={16} strokeWidth={3} />
          Attach
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 relative">
        <Button
          onClick={() => setOpen(false)}
          className="w-[30px] h-[30px] absolute z-10 top-1 right-1"
          variant="ghost">
          <X size={16} strokeWidth={3} />
        </Button>
        <UploadFile />
      </DialogContent>
    </Dialog>
  );
};
