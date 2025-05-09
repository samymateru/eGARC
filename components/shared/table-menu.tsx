import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";

interface TableMenuProps {
  editor: Editor | null;
}

export const TableMenu = ({ editor }: TableMenuProps) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
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
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!editor.can().addColumnBefore()}>
        Add Column Before
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}>
        Add Column After
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}>
        Delete Column
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().addRowBefore().run()}
        disabled={!editor.can().addRowBefore()}>
        Add Row Before
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}>
        Add Row After
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}>
        Delete Row
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}>
        Delete Table
      </Button>
    </div>
  );
};
