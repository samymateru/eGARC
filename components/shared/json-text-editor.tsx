"use client";
import {
  useImperativeHandle,
  forwardRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useEditor, Editor, JSONContent } from "@tiptap/react";
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
import { useAdministrationEditorVisibility } from "@/lib/store";

export interface TextEditorRef {
  getEditor: () => Editor | null;
}

function isValidTipTapContent(content: unknown): content is JSONContent {
  return (
    typeof content === "object" &&
    content !== null &&
    "type" in content &&
    (content as { type?: unknown }).type === "doc" &&
    Array.isArray((content as { content?: unknown }).content)
  );
}

interface TextEditorProps {
  initialContent?: JSONContent;
  onChange?: Dispatch<SetStateAction<JSONContent>>;
}

const JsonTextEditor = forwardRef<TextEditorRef, TextEditorProps>(
  ({ initialContent = { type: "doc", content: [] }, onChange }, ref) => {
    const safeContent: JSONContent = isValidTipTapContent(initialContent)
      ? initialContent
      : { type: "doc", content: [] };
    const editor = useEditor({
      immediatelyRender: false,
      content: safeContent,
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
    const { openAdministationEditor } = useAdministrationEditorVisibility();

    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
    }));

    useEffect(() => {
      editor?.setEditable(openAdministationEditor);
    }, [openAdministationEditor, editor]);

    useEffect(() => {
      if (!editor) return;

      const handleUpdate = () => {
        const json = editor.getJSON();
        onChange?.(json);
      };

      editor.on("update", handleUpdate);
    }, [editor, onChange]);

    return (
      <>
        {editor && (
          <section className="">
            {openAdministationEditor ? <EditorMenu editor={editor} /> : null}

            <EditorWrapper editor={editor} />
          </section>
        )}
      </>
    );
  }
);

JsonTextEditor.displayName = "JsonTextEditor";
export default JsonTextEditor;
