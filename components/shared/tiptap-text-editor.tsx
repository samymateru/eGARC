"use client";
import { useImperativeHandle, forwardRef } from "react";
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

export interface TextEditorRef {
  getEditor: () => Editor | null;
}

interface TextEditorProps {
  initialContent?: string;
}

const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(
  ({ initialContent = "<p>Hello World!</p>" }, ref) => {
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
        Table.configure({
          resizable: true,
        }),
        TableCell,
        TableHeader,
        TableRow,
      ],
    });

    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
    }));

    return (
      <>
        {editor && (
          <section>
            <EditorMenu editor={editor} />
            <EditorWrapper editor={editor} />
          </section>
        )}
      </>
    );
  }
);

TextEditor.displayName = "TextEditor";
export default TextEditor;
