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
  ListTodoIcon,
  MessagesSquare,
  Paperclip,
  Share,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useSearchParams } from "next/navigation";
import { RiskControlForm } from "../forms/risk-control-form";
import { IssueForm } from "../forms/issue-form";
import { SubProgramForm } from "../forms/sub-program-form";
import { RaiseReviewComment } from "../forms/raise-review_comment-form";
import { RaiseTask } from "../forms/raise-task-form";
import { ProcedureFileUploaderForm } from "../forms/procedure-file-uploader-form";

interface ProcedureActionProps {
  children?: ReactNode;
  side?: "right" | "bottom" | "left" | "top";
  subProgramTitle: string;
}

const handleOpen = (isOpen: boolean) => {
  console.log(isOpen);
};

export const ProcedureAction = ({
  children,
  side,
  subProgramTitle,
}: ProcedureActionProps) => {
  const params = useSearchParams();
  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side ?? "bottom"}
        className="p-2 bg-neutral-300"
        align="end">
        <Label className="font-helvetica-medium pl-5">Actions</Label>
        <Separator className="bg-neutral-500 my-1" />
        <section className="mt-1">
          <RiskControlForm
            data={{
              risk: "",
              risk_rating: "",
              control: "",
              control_objective: "",
              control_type: "",
            }}
            mode="create"
            title="Risk & Control"
            id={params.get("action")}
            endpoint="engagements/sub_program/risk_control">
            <Button
              variant="ghost"
              className="w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px]">
              <TriangleAlert size={16} strokeWidth={2} />
              Risk & Control
            </Button>
          </RiskControlForm>
          <IssueForm
            title="Add Issue"
            endpoint="issue"
            id={params.get("action")}>
            <Button
              variant="ghost"
              className="w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px]">
              <AlertCircle size={16} strokeWidth={2} />
              Add Issue
            </Button>
          </IssueForm>
          <RaiseTask
            data={{
              title: "",
              description: "",
              action_owner: [],
            }}
            mode="create"
            title="Raise Task"
            endpoint="task/raise"
            id={params.get("id")}>
            <Button
              variant={"ghost"}
              className=" w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px]">
              <ListTodoIcon size={16} strokeWidth={2} />
              Raise Task
            </Button>
          </RaiseTask>
          <RaiseReviewComment
            data={{
              title: "",
              description: "",
              action_owner: [],
            }}
            title="Raise Review Comment"
            endpoint="review_comment/raise"
            mode="create"
            id={params.get("id")}>
            <Button
              variant={"ghost"}
              className="w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px]">
              <MessagesSquare size={16} strokeWidth={2} />
              Raise Comment
            </Button>
          </RaiseReviewComment>
          <SubProgramForm
            data={{
              title: subProgramTitle,
            }}
            mode="create"
            title="Sub Program"
            endpoint="engagements/sub_program"
            id={""}>
            <Button
              variant="ghost"
              className="w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px]">
              <Edit size={16} strokeWidth={2} />
              Edit
            </Button>
          </SubProgramForm>
          <ProcedureFileUploaderForm
            title="Upload file"
            endpoint="attachments"
            engagement_id={params.get("id")}
            procedure_id={params.get("action")}>
            <Button
              variant={"ghost"}
              className="w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px]">
              <Paperclip size={16} strokeWidth={2} />
              Attach File
            </Button>
          </ProcedureFileUploaderForm>

          <Button
            variant="ghost"
            className="w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px]">
            <Share size={16} strokeWidth={2} />
            Assign
          </Button>

          <Button
            variant="ghost"
            className="w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px]">
            <ArrowRightFromLine size={16} strokeWidth={2} />
            Export
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px]">
            <Trash size={16} strokeWidth={2} />
            Remove
          </Button>
        </section>
      </PopoverContent>
    </Popover>
  );
};
