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
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  ListTodoIcon,
  MessagesSquare,
} from "lucide-react";
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
      <PopoverContent className="p-2">
        <section>
          <Label className="font-hel-heading-bold">Actions</Label>
        </section>
        <Separator />
        <section className="pt-1 divide-y">
          <RaiseTask
            title="Raise Task"
            endpoint="task/raise"
            id={params.get("id")}>
            <Button
              variant={"ghost"}
              className=" w-full flex justify-start items-center font-table h-[30px]">
              <ListTodoIcon size={16} strokeWidth={3} />
              Raise Task
            </Button>
          </RaiseTask>
          <RaiseReviewComment
            data={{
              title: "",
              description: "",
              action_owner: [],
            }}
            title="Raise Review Note"
            endpoint="review_comment/raise"
            mode="create"
            id={params.get("id")}>
            <Button
              variant={"ghost"}
              className="w-full flex justify-start items-center h-[30px]">
              <MessagesSquare size={16} strokeWidth={3} />
              Raise Note
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
              <Button
                variant={"ghost"}
                className="w-full flex justify-start items-center h-[30px]">
                <AlertTriangle size={16} strokeWidth={3} />
                Add PRCM
              </Button>
            </PRCMForm>
          ) : null}
          {data?.prepared_by === null ? (
            <Button
              variant={"ghost"}
              className="w-full flex justify-start items-center h-[30px]">
              <CheckCircle size={16} strokeWidth={3} />
              Mark Prepared
            </Button>
          ) : null}
          {data?.reviewed_by === null && data.prepared_by !== null ? (
            <Button
              variant={"ghost"}
              className="w-full flex justify-start items-center h-[30px]">
              <Eye size={16} strokeWidth={3} />
              Mark Reviewed
            </Button>
          ) : null}
        </section>
      </PopoverContent>
    </Popover>
  );
};
