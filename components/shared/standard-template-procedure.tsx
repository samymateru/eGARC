import { StandardTemplateSchema } from "@/lib/types";
import z from "zod";
import { Button } from "../ui/button";
import { ListTodoIcon, MessagesSquare, Save } from "lucide-react";
import { RaiseTask } from "../forms/raise-task-form";
import { RaiseReviewComment } from "../forms/raise-review_comment-form";
import { SummaryAuditProgram } from "@/app/(root)/eAuditNext/engagement/_planning/summary-audit-program";
import { useSearchParams } from "next/navigation";
interface PlanningHomeProps {
  data?: z.infer<typeof StandardTemplateSchema>;
}

export const StandardTemplateProcedure = ({ data }: PlanningHomeProps) => {
  const params = useSearchParams();
  console.log(data);
  return (
    <section className="flex flex-col w-full pt-1">
      <header className="flex justify-between px-1">
        <section className="flex items-center gap-1">
          <RaiseTask
            title="Raise Task"
            endpoint="task/raise"
            id={params.get("id")}>
            <Button
              variant={"ghost"}
              className="dark:bg-neutral-800 w-[150px] flex justify-start font-table h-[30px]">
              <ListTodoIcon size={16} strokeWidth={3} />
              Task
            </Button>
          </RaiseTask>
          <RaiseReviewComment
            title="Raise Review Comment"
            endpoint="review_comment/raise"
            id={params.get("id")}>
            <Button
              variant={"ghost"}
              className="dark:bg-neutral-800 w-[150px] flex justify-start font-serif font-semibold tracking-wide h-[30px]">
              <MessagesSquare size={16} strokeWidth={3} />
              Comment
            </Button>
          </RaiseReviewComment>
          <Button
            variant={"ghost"}
            className="dark:bg-neutral-800 w-[150px] flex justify-start font-serif font-semibold tracking-wide h-[30px]">
            <Save size={16} strokeWidth={3} />
            Save
          </Button>
        </section>
        <section className="flex-1 flex justify-end items-center"></section>
      </header>
      <main className="flex-1">
        <SummaryAuditProgram />
      </main>
    </section>
  );
};
