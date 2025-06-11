import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ReviewCommentsSchema } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  CircleCheck,
  Mail,
  Menu,
  Pencil,
  SendHorizonal,
  Trash,
  Undo,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import z from "zod";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ResolveTaskForm } from "@/components/forms/resolve-task-form";
import { TaskDecisionForm } from "@/components/forms/task-decision-form";

type TaskValue = z.infer<typeof ReviewCommentsSchema>;

interface TaskProps {
  task: TaskValue;
}
export const Tasks = ({ task }: TaskProps) => {
  const params = useSearchParams();
  const router = useRouter();

  return (
    <section className="w-[calc(100vw-320px)] h-[calc(100vh-53px)] overflow-auto flex flex-col">
      <section className="flex items-center justify-between px-2 mb-1">
        <section className="flex items-center h-[30px]">
          <Button
            variant="ghost"
            className="w-[30px] h-[30px]"
            onClick={() => {
              router.replace(
                `/eAuditNext/engagement?id=${params.get(
                  "id"
                )}&action=summary_tasks&name=${params.get("name")}&stage=Tasks`
              );
            }}>
            <ArrowLeft size={16} strokeWidth={3} />
          </Button>
          <Separator orientation="vertical" className="mx-3" />
          <Label className="font-[helvetica] tracking-normal scroll-m-1 font-semibold">
            {task.reference}
          </Label>
          <Separator orientation="vertical" className="mx-3" />
          <Label className="font-[helvetica] tracking-normal scroll-m-1 font-semibold">
            {task.status}
          </Label>
        </section>
        <section>
          <Actions status={task.status} id={task.id}>
            <Button
              className="h-[30px] w-[100px] flex items-center justify-start"
              variant="ghost">
              <Menu size={16} strokeWidth={3} />
              Menu
            </Button>
          </Actions>
        </section>
      </section>
      <Separator />
      <section className="flex-1 flex flex-col gap-4 px-3 py-2 overflow-auto">
        <section className="flex gap-2 items-center">
          <Label className="font-[helvetica] font-bold text-[18px]">
            Title:
          </Label>
          <Label className="font-[helvetica] font-medium text-neutral-300">
            {task.title}
          </Label>
        </section>
        <section className="flex flex-col mb-2">
          <Label className="font-[helvetica] font-bold text-[18px]">
            Raised By:
          </Label>
          <section className="flex flex-col gap-2 pl-1">
            <section className="flex item-center gap-2">
              <User
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300">{task.raised_by?.name}</Label>
            </section>
            <section className="flex item-center gap-2">
              <Mail
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300 italic">
                {task.raised_by?.email}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Calendar
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300">
                {task.raised_by !== null
                  ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(task.raised_by.date_issued ?? ""))
                  : "N/A"}
              </Label>
            </section>
          </section>
        </section>
        <section className="flex gap-2 items-center">
          <Label className="font-[helvetica] font-bold text-[18px]">
            Decision:
          </Label>
          <Label className="font-[helvetica] font-medium text-neutral-300">
            {task.decision === null ? "N/A" : task.decision}
          </Label>
        </section>
        <section className="flex flex-col">
          <Label className="font-[helvetica] font-bold text-[18px]">
            Description:
          </Label>
          <Label className="font-[helvetica] font-medium text-neutral-300 pl-2">
            {task.description === null ? "N/A" : task.description}
          </Label>
        </section>
        <section className="flex flex-col">
          <Label className="font-[helvetica] font-bold text-[18px]">
            Resolution Summary:
          </Label>
          <Label className="font-[helvetica] font-medium text-neutral-300 pl-2">
            {task.resolution_summary === null ? "N/A" : task.resolution_summary}
          </Label>
        </section>
        <section className="flex flex-col">
          <Label className="font-[helvetica] font-bold text-[18px]">
            Resolution Details:
          </Label>
          <Label className="font-[helvetica] font-medium text-neutral-300 pl-2">
            {task.resolution_details === null ? "N/A" : task.resolution_details}
          </Label>
        </section>
        <section className="flex flex-col mb-2">
          <Label className="font-[helvetica] font-bold text-[18px]">
            Resolved By:
          </Label>
          <section className="flex flex-col gap-2 pl-1">
            <section className="flex item-center gap-2">
              <User
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300">
                {task?.resolved_by === null ? "N/A" : task.resolved_by?.name}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Mail
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300 italic">
                {task.resolved_by === null ? "N/A" : task.resolved_by.email}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Calendar
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300">
                {task.resolved_by !== null
                  ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(task.resolved_by.date_issued ?? ""))
                  : "N/A"}
              </Label>
            </section>
          </section>
        </section>
        <section>
          <Label className="font-[helvetica] font-bold text-[18px]">
            Action Owners
          </Label>
          <section className="flex flex-col gap-[6px] pl-2 max-h-[400px]">
            {task.action_owner.map((user, index: number) => (
              <Label className="text-neutral-300 flex gap-[6px]" key={index}>
                {user.name}
                <span className="italic">&lt;{user.email}&gt;</span>
              </Label>
            ))}
          </section>
        </section>
      </section>
    </section>
  );
};

interface ActionsProps {
  children: ReactNode;
  status: string;
  id: string;
}

enum Status {
  PENDING = "Pending",
  ONGOING = "Ongoing",
  CLOSED = "Closed",
}

export const Actions = ({ children, status, id }: ActionsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[250px] px-1 py-2">
        {status === Status.PENDING ? (
          <ResolveTaskForm title="Resolve Task" id={id} endpoint="task/resolve">
            <Button
              variant="ghost"
              className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-8 font-table">
              <SendHorizonal size={16} strokeWidth={3} />
              Resolve
            </Button>
          </ResolveTaskForm>
        ) : null}
        {status === Status.ONGOING ? (
          <TaskDecisionForm
            title="Task Decision"
            id={id}
            endpoint="task/resolve/decision">
            <Button
              variant="ghost"
              className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-8 font-table">
              <CircleCheck size={16} strokeWidth={3} />
              Decision
            </Button>
          </TaskDecisionForm>
        ) : null}
        {status === Status.PENDING ? (
          <Button
            variant="ghost"
            className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-8 font-table">
            <Pencil size={16} strokeWidth={3} />
            Edit
          </Button>
        ) : null}
        <Button
          variant="ghost"
          className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-8 font-table">
          <Trash size={16} strokeWidth={3} className="text-red-800" />
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );
};
