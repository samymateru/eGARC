"use client";
import {
  useImperativeHandle,
  forwardRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import EditorWrapper from "./editor";
import { EditorMenu } from "./editor-menu";
import FontFamily from "@tiptap/extension-font-family";
import { useProcedureEditorVisibility } from "@/lib/store";

export interface TextEditorRef {
  getEditor: () => Editor | null;
}

interface TextEditorProps {
  initialContent?: string;
  onChange?: Dispatch<SetStateAction<string>>;
}

const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(
  ({ initialContent = "", onChange }, ref) => {
    const editor = useEditor({
      immediatelyRender: false,
      content: initialContent,
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"], // ⬅ required for it to work
        }),
        FontFamily.configure({
          types: ["textStyle"],
        }),
        Table.configure({
          resizable: true,
        }),
        TableCell,
        TableHeader,
        TableRow,
      ],
    });
    const { openProcedureEditor } = useProcedureEditorVisibility();

    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
    }));

    useEffect(() => {
      editor?.setEditable(openProcedureEditor);
    }, [openProcedureEditor, editor]);

    useEffect(() => {
      if (!editor) return;

      const handleUpdate = () => {
        const html = editor.getHTML();
        onChange?.(html); // send back to parent
      };

      editor.on("update", handleUpdate);
    }, [editor, onChange]);

    return (
      <>
        {editor && (
          <section className="">
            {openProcedureEditor ? <EditorMenu editor={editor} /> : null}

            <EditorWrapper editor={editor} />
          </section>
        )}
      </>
    );
  }
);

TextEditor.displayName = "TextEditor";
export default TextEditor;
