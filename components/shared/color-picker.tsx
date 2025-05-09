import { Editor } from "@tiptap/react";
import { Input } from "@/components/ui/input"; // or use a native input
import { PipetteIcon } from "lucide-react";
import { Button } from "../ui/button";

interface TextColorPickerProps {
  editor: Editor | undefined;
}

export const TextColorPicker = ({ editor }: TextColorPickerProps) => {
  if (!editor) return null;

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  return (
    <Button
      variant="ghost"
      className="w-[30px] h-[30px] rounded-md relative p-0">
      <PipetteIcon size={16} />
      {/* Invisible input on top of button */}
      <Input
        type="color"
        onChange={handleColorChange}
        value={editor.getAttributes("textStyle")?.color || "#000000"}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </Button>
  );
};
