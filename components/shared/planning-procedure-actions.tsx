import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StandardTemplateSchema } from "@/lib/types";
import { ReactNode } from "react";
import z from "zod";
import { Label } from "../ui/label";
import { RaiseTask } from "../forms/raise-task-form";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { AlertTriangle, ListTodoIcon, MessagesSquare } from "lucide-react";
import { RaiseReviewComment } from "../forms/raise-review_comment-form";
import { Separator } from "../ui/separator";
import { PRCMForm } from "../forms/prcm-form";

interface PlanningProcedureActionsProps {
  children?: ReactNode;
  data?: z.infer<typeof StandardTemplateSchema>;
}
export const PlanningProcedureActions = ({
  children,
  data,
}: PlanningProcedureActionsProps) => {
  const params = useSearchParams();
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-2 bg-neutral-300" align="end">
        <section>
          <Label className="font-helvetica-medium pl-5">Actions</Label>
        </section>
        <Separator className="bg-neutral-500 my-1" />
        <section className="pt-1 flex flex-col gap-1">
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
          {data?.type === "risk" ? (
            <PRCMForm
              data={{
                process: "",
                risk: "",
                risk_rating: "",
                control: "",
                control_objective: "",
                control_type: "",
              }}
              title="Add PRCM"
              endpoint="engagements/PRCM"
              id={params.get("id")}>
              <Button className="w-full flex justify-start hover:bg-blue-400 items-center font-helvetica-13 h-[30px] bg-inherit text-black shadow-none">
                <AlertTriangle size={16} strokeWidth={2} />
                Add PRCM
              </Button>
            </PRCMForm>
          ) : null}
        </section>
      </PopoverContent>
    </Popover>
  );
};
