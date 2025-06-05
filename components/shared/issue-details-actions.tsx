import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Check, CheckCircle, CircleX, Clipboard, Loader } from "lucide-react";
import { Separator } from "../ui/separator";

interface IssueDetailsActionsProps {
  children: ReactNode;
}
export const IssueDetailsActions = ({ children }: IssueDetailsActionsProps) => {
  return (
    <Popover>
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
              className="h-[33px] flex items-center justify-start"
              variant="ghost">
              <Loader size={16} strokeWidth={3} />
              Prepare
            </Button>
            <Button
              className="h-[33px] flex items-center justify-start"
              variant="ghost">
              <CheckCircle size={16} strokeWidth={3} />
              Review
            </Button>
            <Button
              className="h-[33px] flex items-center justify-start"
              variant="ghost">
              <Clipboard size={16} strokeWidth={3} />
              Reportable
            </Button>
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
