import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";

interface DetailedIssueReportFilterProps {
  children: ReactNode;
}
export const DetailedIssueReportFilter = ({
  children,
}: DetailedIssueReportFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
};
