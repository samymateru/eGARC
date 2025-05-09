"use client";

import { Button } from "@/components/ui/button";
import TextEditor, {
  TextEditorRef,
} from "@/components/shared/tiptap-text-editor";
import { useRef } from "react";
export default function HomePage() {
  const editorRef = useRef<TextEditorRef>(null);
  const handleSave = () => {
    const json = editorRef.current?.getEditor()?.getJSON();
    console.log("Editor JSON:", json);
  };

  return (
    <section className="w-full">
      <main className="w-full">
        <TextEditor
          ref={editorRef}
          initialContent="<h2>Welcome to your custom editor!</h2><p>Edit this content as needed.</p>"
        />
      </main>
      <Button onClick={handleSave}>save</Button>
    </section>
  );
}
