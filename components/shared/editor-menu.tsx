"use client";
import { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold,
  Code2,
  Italic,
  PaintBucketIcon,
  Redo2,
  Strikethrough,
  Table,
  Underline,
  Undo2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { TextColorPicker } from "./color-picker";

interface EditorProps {
  editor?: Editor;
}
export const EditorMenu = ({ editor }: EditorProps) => {
  const [alingment, setAlignment] = useState<string>("left");

  return (
    <section className="flex py-1 gap-3 m-2">
      <div className="flex gap-1 items-center border-r border-r-neutral-600 pr-2">
        <Button
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          variant={"ghost"}
          className={`w-[30px] h-[30px] rounded-md flex justify-center items-center ${
            editor?.can().undo() ? "bg-accent" : ""
          }`}>
          <Undo2 size={16} />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          variant={"ghost"}
          className={`w-[30px] h-[30px] rounded-md flex justify-center items-center ${
            editor?.can().redo() ? "bg-accent" : ""
          }`}>
          <Redo2 size={16} />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          variant={"ghost"}
          className={`w-[30px] h-[30px] rounded-md flex justify-center items-center ${
            editor?.isActive("bold") ? "bg-accent" : ""
          }`}>
          <Bold size={16} />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          variant={"ghost"}
          className={`w-[30px] h-[30px] rounded-md flex justify-center items-center ${
            editor?.isActive("italic") ? "bg-accent" : ""
          }`}>
          <Italic size={16} />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          variant={"ghost"}
          className={`w-[30px] h-[30px] rounded-md flex justify-center items-center ${
            editor?.isActive("underline") ? "bg-accent" : ""
          }`}>
          <Underline size={16} />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          variant={"ghost"}
          className={`w-[30px] h-[30px] rounded-md flex justify-center items-center ${
            editor?.isActive("strike") ? "bg-accent" : ""
          }`}>
          <Strikethrough size={16} />
        </Button>
        <Button
          variant={"ghost"}
          className="w-[30px] h-[30px] rounded-md flex justify-center items-center">
          <Code2 size={16} />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <TextColorPicker editor={editor} />

        <Button
          variant={"ghost"}
          className="w-[30px] h-[30px] rounded-md flex justify-center items-center">
          <PaintBucketIcon size={16} />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="border-none rounded-md w-[30px] h-[30px] flex items-center justify-center dark:hover:bg-accent">
              {alingment === "center" ? (
                <AlignCenterIcon size={16} />
              ) : alingment === "left" ? (
                <AlignLeftIcon size={16} />
              ) : alingment === "right" ? (
                <AlignRightIcon size={16} />
              ) : alingment === "justify" ? (
                <AlignJustifyIcon size={16} />
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[190px] dark:bg-black">
              <DropdownMenuLabel className="font-serif tracking-wide scroll-m-0">
                Alingment
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="font-serif tracking-wide scroll-m-0 flex items-center justify-start gap-2 dark:hover:bg-neutral-800 rounded-md px-2 h-7 cursor-pointer"
                onClick={() => {
                  console.log("center");
                  setAlignment("center");
                  editor?.chain().focus().setTextAlign("center").run();
                }}>
                <AlignCenterIcon size={16} />
                Center
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-serif tracking-wide scroll-m-0 flex items-center justify-start gap-2 dark:hover:bg-neutral-800 rounded-md px-2 h-7 cursor-pointer"
                onClick={() => {
                  setAlignment("left");
                  editor?.chain().focus().setTextAlign("left").run();
                }}>
                <AlignLeftIcon size={16} />
                Left
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-serif tracking-wide scroll-m-0 flex items-center justify-start gap-2 dark:hover:bg-neutral-800 rounded-md px-2 h-7 cursor-pointer"
                onClick={() => {
                  setAlignment("right");
                  editor?.chain().focus().setTextAlign("right").run();
                }}>
                <AlignRightIcon size={16} />
                Right
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-serif tracking-wide scroll-m-0 flex items-center justify-start gap-2 dark:hover:bg-neutral-800 rounded-md px-2 h-7 cursor-pointer"
                onClick={() => {
                  setAlignment("justify");
                  editor?.chain().focus().setTextAlign("justify").run();
                }}>
                <AlignJustifyIcon size={16} />
                Justify
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          variant={"ghost"}
          className="w-[30px] h-[30px] rounded-md flex justify-center items-center">
          <Table size={16} />
        </Button>
      </div>
    </section>
  );
};
