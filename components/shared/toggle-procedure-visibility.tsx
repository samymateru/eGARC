"use client";
import { useId } from "react";
import { Switch } from "@/components/ui/switch";
import { useProcedureEditorVisibility } from "@/lib/store";

export const ToggleProcedureVisibility = () => {
  const id = useId();
  const { openProcedureEditor, setProcedureEditor } =
    useProcedureEditorVisibility();
  const toggleSwitch = () => setProcedureEditor(!openProcedureEditor);

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={openProcedureEditor ? "checked" : "unchecked"}>
      <span
        id={`${id}-off`}
        className="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right font-helvetica-13"
        aria-controls={id}
        onClick={() => setProcedureEditor(false)}>
        View
      </span>
      <Switch
        className="data-[state=checked]:bg-black data-[state=unchecked]:bg-black data-[state=unchecked]:[&_span]:bg-white data-[state=checked]:[&_span]:bg-neutral-500 [&_span]:px-2"
        id={id}
        checked={openProcedureEditor}
        onCheckedChange={toggleSwitch}
        aria-labelledby={`${id}-off ${id}-on`}
      />
      <span
        id={`${id}-on`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left font-helvetica-13"
        aria-controls={id}
        onClick={() => setProcedureEditor(true)}>
        Edit
      </span>
    </div>
  );
};
