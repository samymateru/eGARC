import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import {
  AlertCircle,
  ArrowRightFromLine,
  Edit,
  Share,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useSearchParams } from "next/navigation";
import { RiskControlForm } from "../forms/risk-control-form";
import { IssueForm } from "../forms/issue-form";

interface ProcedureActionProps {
  children?: ReactNode;
  side?: "right" | "bottom" | "left" | "top";
}

const handleOpen = (isOpen: boolean) => {
  console.log(isOpen);
};

export const ProcedureAction = ({ children, side }: ProcedureActionProps) => {
  const params = useSearchParams();
  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side={side ?? "bottom"} className="dark:bg-black p-2">
        <Label className="font-bold text-[20px] font-[helvetica]">
          Procedure Actions
        </Label>
        <Separator />
        <section className="mt-1">
          <RiskControlForm
            title="Risk & Control"
            id={params.get("action")}
            endpoint="engagements/sub_program/risk_control">
            <Button
              variant="ghost"
              className="w-full flex justify-start gap-2 items-center h-[30px]">
              <TriangleAlert size={16} strokeWidth={3} />
              Risk & Control
            </Button>
          </RiskControlForm>
          <IssueForm
            title="Add Issue"
            endpoint="issue"
            id={params.get("action")}>
            <Button
              variant="ghost"
              className="w-full flex justify-start gap-2 items-center h-[30px]">
              <AlertCircle size={16} strokeWidth={3} />
              Add Issue
            </Button>
          </IssueForm>

          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]">
            <Edit size={16} strokeWidth={3} />
            Edit
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]">
            <Share size={16} strokeWidth={3} />
            Assign
          </Button>

          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]">
            <ArrowRightFromLine size={16} strokeWidth={3} />
            Export
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]">
            <Trash size={16} strokeWidth={3} />
            Remove
          </Button>
        </section>
      </PopoverContent>
    </Popover>
  );
};
