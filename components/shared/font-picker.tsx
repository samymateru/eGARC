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
        <SelectTrigger id={id} className="min-w-[150px] h-[32px]">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Helvetica">Helvetica</SelectItem>
          <SelectItem value="Inter">Inter</SelectItem>
          <SelectItem value="Monospace">Monospace</SelectItem>
          <SelectItem value="Serif">Serif</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
