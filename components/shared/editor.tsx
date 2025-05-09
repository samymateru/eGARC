"use client";
import { Editor, EditorContent } from "@tiptap/react";
import "../../app/globals.css";

interface EditorProps {
  editor: Editor;
}
export default function EditorWrapper({ editor }: EditorProps) {
  if (editor === null) return;
  return (
    <div className="flex flex-col gap-2">
      <EditorContent
        editor={editor}
        className="[&>div]:focus:border-0 [&>div]:focus:ring-offset-0 [&>div]:min-h-[200px] [&>div]:focus:outline-none [&>div]:rounded-md [&>div]:dark:bg-black [&>div]:focus:ring-0 [&>div]:p-2 px-5"
      />
    </div>
  );
}
