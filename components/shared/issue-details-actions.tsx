import { ReactNode, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Check, CheckCircle, CircleX, Clipboard, Loader } from "lucide-react";
import { Separator } from "../ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IssueResponder } from "@/lib/types";
import { z } from "zod";
import { showToast } from "./toast";
import { IssueReportForm } from "../forms/issue-reportable-form";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PreparedBy = z.infer<typeof IssueResponder>;

interface IssueDetailsActionsProps {
  children: ReactNode;
  id?: string;
}
export const IssueDetailsActions = ({
  children,
  id,
}: IssueDetailsActionsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const query_client = useQueryClient();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { mutate: prepareIssue, isPending: prepareIssuePending } = useMutation({
    mutationKey: ["prepare_issue", id],
    mutationFn: async (data: PreparedBy) => {
      const response = await fetch(`${BASE_URL}/issue/prepared/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          body: errorBody,
        };
      }
      return await response.json();
    },
  });

  const { mutate: reviewIssue, isPending: reviewIssuePending } = useMutation({
    mutationKey: ["review_issue", id],
    mutationFn: async (data: PreparedBy) => {
      const response = await fetch(`${BASE_URL}/issue/reviewed/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          body: errorBody,
        };
      }
      return await response.json();
    },
  });

  const onPrepare = () => {
    const data: PreparedBy = {
      name: name,
      email: email,
      date_issued: new Date(),
    };
    prepareIssue(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["organizations"],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {
        setOpen(false);
      },
    });
  };

  const onReview = () => {
    const data: PreparedBy = {
      name: name,
      email: email,
      date_issued: new Date(),
    };
    reviewIssue(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["organizations"],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {
        setOpen(false);
      },
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const email = localStorage.getItem("user_email");
        const name = localStorage.getItem("user_name");
        setName(name ?? "");
        setEmail(email ?? "");
      } catch (err) {
        console.error("Failed to parse localStorage data:", err);
      }
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-1">
        <section>
          <header>
            <Label className="font-[helvetica] tracking-normal scroll-m-0 font-semibold text-[16px] pl-2 pb-2">
              Actions
            </Label>
          </header>
          <Separator />
          <main className="flex flex-col pt-2">
            <Button
              onClick={onPrepare}
              disabled={prepareIssuePending}
              className="h-[33px] flex items-center justify-start"
              variant="ghost">
              <Loader size={16} strokeWidth={3} />
              Prepare
            </Button>
            <Button
              onClick={onReview}
              disabled={reviewIssuePending}
              className="h-[33px] flex items-center justify-start"
              variant="ghost">
              <CheckCircle size={16} strokeWidth={3} />
              Review
            </Button>
            <IssueReportForm
              title="Issue Reportabe"
              endpoint="issue/reportable"
              id={id ?? null}>
              <Button
                className="h-[33px] flex items-center justify-start"
                variant="ghost">
                <Clipboard size={16} strokeWidth={3} />
                Reportable
              </Button>
            </IssueReportForm>
            <Button
              className="h-[33px] flex items-center justify-start"
              variant="ghost">
              <Check size={16} strokeWidth={3} className="text-green-700" />
              Accept
            </Button>
            <Button
              className="h-[33px] flex items-center justify-start"
              variant="ghost">
              <CircleX size={16} strokeWidth={3} className="text-red-700" />
              Decline
            </Button>
          </main>
        </section>
      </PopoverContent>
    </Popover>
  );
};
