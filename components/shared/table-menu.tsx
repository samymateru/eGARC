import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ReactNode } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

interface TableMenuProps {
  children: ReactNode;
  editor?: Editor | null;
}

export const TableMenu = ({ editor, children }: TableMenuProps) => {
  if (!editor) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="dark:bg-black p-2">
        <Label className="font-bold text-[20px] font-[helvetica]">
          Table Actions
        </Label>
        <Separator />
        <div className="flex flex-col py-2">
          <Button
            type="button"
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }>
            Insert Table
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            disabled={!editor.can().addColumnBefore()}>
            Add Column Before
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.can().addColumnAfter()}>
            Add Column After
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.can().deleteColumn()}>
            Delete Column
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            disabled={!editor.can().addRowBefore()}>
            Add Row Before
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.can().addRowAfter()}>
            Add Row After
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]"
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.can().deleteRow()}>
            Delete Row
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]"
            onClick={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.can().deleteTable()}>
            Delete Table
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
