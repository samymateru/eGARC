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
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";
import { ResolveReviewCommentForm } from "@/components/forms/resolve-review-comment-form";
import { ReviewCommentDecisionForm } from "@/components/forms/review-comment-decision-form";

type ReviewCommentValue = z.infer<typeof ReviewCommentsSchema>;

interface ReviewCommentProps {
  review_comment: ReviewCommentValue;
}
export const ReviewComment = ({ review_comment }: ReviewCommentProps) => {
  const params = useSearchParams();
  const router = useRouter();
  return (
    <section className=" w-[calc(100vw-332px)] h-[calc(100vh-53px)] overflow-auto flex flex-col bg-neutral-50">
      <section className="flex items-center justify-between px-2 pt-1">
        <section className="flex items-center h-[30px]">
          <Button
            className="w-[30px] h-[30px] action text-white"
            onClick={() => {
              router.replace(
                `/eAuditNext/engagement?id=${params.get(
                  "id"
                )}&action=summary_review_comments&name=${params.get(
                  "name"
                )}&stage=ReviewComment`
              );
            }}>
            <ArrowLeft size={16} strokeWidth={3} />
          </Button>
          <Separator orientation="vertical" className="mx-3 bg-neutral-400" />
          <Label className="font-helvetica-14">
            {review_comment.reference}
          </Label>
          <Separator orientation="vertical" className="mx-3 bg-neutral-400" />
          <Label className="font-helvetica-13">{review_comment.status}</Label>
        </section>
        <section>
          <Actions status={review_comment.status} id={review_comment.id}>
            <Button className="h-[30px] w-[100px] flex items-center justify-start bg-black font-helvetica-13 text-white">
              <Menu size={16} strokeWidth={2} />
              Menu
            </Button>
          </Actions>
        </section>
      </section>
      <Separator className="bg-neutral-500 mt-[2px]" />
      <section className="flex-1 flex flex-col gap-4 px-3 py-2 overflow-auto">
        <section className="flex gap-2 items-center">
          <Label className="font-helvetica-14">Title:</Label>
          <Label className="font-helvetica-13">{review_comment.title}</Label>
        </section>
        <section className="flex flex-col gap-1 mb-2">
          <Label className="font-helvetica-14">Raised By:</Label>
          <section className="flex flex-col gap-1">
            <section className="flex item-center gap-2 ">
              <User size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {review_comment.raised_by?.name}
              </Label>
            </section>
            <section className="flex item-center gap-2 ">
              <Mail size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {review_comment.raised_by?.email}
              </Label>
            </section>
            <section className="flex item-center gap-2  ">
              <Calendar size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {review_comment.raised_by !== null
                  ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(
                      new Date(review_comment.raised_by.date_issued ?? "")
                    )
                  : "N/A"}
              </Label>
            </section>
          </section>
        </section>
        <section className="flex gap-2 items-center">
          <Label className="font-helvetica-14">Decision:</Label>
          <Label className="font-helvetica-13 text-black">
            {review_comment.decision === null ? "N/A" : review_comment.decision}
          </Label>
        </section>
        <section className="flex flex-col">
          <Label className="font-helvetica-14 text-black">Description:</Label>
          <Label className="font-helvetica-13 text-black">
            {review_comment.description === null
              ? "N/A"
              : review_comment.description}
          </Label>
        </section>
        <section className="flex flex-col">
          <Label className="font-helvetica-14 text-black">
            Resolution Summary:
          </Label>
          <Label className="font-helvetica-13 text-black">
            {review_comment.resolution_summary === null
              ? "N/A"
              : review_comment.resolution_summary}
          </Label>
        </section>
        <section className="flex flex-col">
          <Label className="font-helvetica-14 text-black">
            Resolution Details:
          </Label>
          <Label className="font-helvetica-13 text-black">
            {review_comment.resolution_details === null
              ? "N/A"
              : review_comment.resolution_details}
          </Label>
        </section>
        <section className="flex flex-col mb-2">
          <Label className="font-helvetica-14 text-black">Resolved By:</Label>
          <section className="flex flex-col gap-2">
            <section className="flex item-center gap-2">
              <User size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {review_comment?.resolved_by === null
                  ? "N/A"
                  : review_comment.resolved_by?.name}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Mail size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {review_comment.resolved_by === null
                  ? "N/A"
                  : review_comment.resolved_by.email}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Calendar size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {review_comment.resolved_by !== null
                  ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(
                      new Date(review_comment.resolved_by.date_issued ?? "")
                    )
                  : "N/A"}
              </Label>
            </section>
          </section>
        </section>
        <section className="">
          <Label className="font-helvetica-14">Action Owners</Label>
          <section className="flex flex-col gap-[6px] max-h-[400px]">
            {review_comment.action_owner.map((user, index: number) => (
              <Label
                className="font-helvetica-13 text-black flex gap-[6px]"
                key={index}>
                <User size="16" strokeWidth={2} className="mb-[2px]" />
                {user.name}
                <span className="italic font-helvetica-13 text-black">
                  &lt;{user.email}&gt;
                </span>
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
      <PopoverContent className="w-[250px] px-1 py-2 bg-neutral-200">
        {status === Status.PENDING ? (
          <ResolveReviewCommentForm
            id={id}
            endpoint="review_comment/resolve"
            title="Resolve Comment">
            <Button className="w-full hover:bg-blue-400 text-black bg-inherit shadow-none rounded-md px-4 flex items-center justify-start gap-2 h-8 font-helvetica-13">
              <SendHorizonal size={16} strokeWidth={2} />
              Resolve
            </Button>
          </ResolveReviewCommentForm>
        ) : null}
        {status === Status.ONGOING ? (
          <ReviewCommentDecisionForm
            title="Decision"
            id={id}
            endpoint="review_comment/resolve/decision">
            <Button
              variant="ghost"
              className="w-full hover:bg-blue-400 text-black rounded-md px-4 flex items-center justify-start gap-2 h-8 font-helvetica-13">
              <CircleCheck size={16} strokeWidth={2} />
              Decision
            </Button>
          </ReviewCommentDecisionForm>
        ) : null}
        {status === Status.PENDING ? (
          <Button
            variant="ghost"
            className="w-full hover:bg-blue-400 text-black rounded-md px-4 flex items-center justify-start gap-2 h-8 font-helvetica-13">
            <Pencil size={16} strokeWidth={2} />
            Edit
          </Button>
        ) : null}
        <Button
          variant="ghost"
          className="w-full hover:bg-blue-400 text-black rounded-md px-4 flex items-center justify-start gap-2 h-8 font-helvetica-13">
          <Trash size={16} strokeWidth={2} className="text-red-700" />
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );
};
