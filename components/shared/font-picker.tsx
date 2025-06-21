"use client";
import { Editor } from "@tiptap/react";
import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontFamilyPickerProps {
  editor: Editor | undefined;
}

export const FontFamilyPicker = ({ editor }: FontFamilyPickerProps) => {
  const id = useId();
  if (!editor) return null;
  return (
    <div className="*:not-first:mt-2">
      <Select
        defaultValue="Helvetica"
        value={editor.getAttributes("textStyle")?.fontFamily}
        onValueChange={(font) =>
          editor.chain().focus().setFontFamily(font).run()
        }>
        <SelectTrigger
          id={id}
          className="w-[150px] h-[32px] text-editor-action font-helvetica-13">
          <SelectValue placeholder="Choose font" />
        </SelectTrigger>
        <SelectContent className="bg-neutral-200 w-[200px]">
          <section className="flex flex-col gap-1">
            <SelectItem
              value="Helvetica"
              className="hover:bg-blue-400 cursor-pointer font-helvetica-13">
              Helvetica
            </SelectItem>
            <SelectItem
              value="Inter"
              className="hover:bg-blue-400 cursor-pointer font-helvetica-13">
              Inter
            </SelectItem>
            <SelectItem
              value="Monospace"
              className="hover:bg-blue-400 cursor-pointer font-helvetica-13">
              Monospace
            </SelectItem>
            <SelectItem
              value="Serif"
              className="hover:bg-blue-400 cursor-pointer font-helvetica-13">
              Serif
            </SelectItem>
          </section>
        </SelectContent>
      </Select>
    </div>
  );
};
