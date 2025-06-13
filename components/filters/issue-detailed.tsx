import { Dispatch, SetStateAction, useState } from "react";
import MultiStatusFilter from "../shared/multi-status-filter";
import { Label } from "../ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { Separator } from "../ui/separator";

interface IssueDetailedFilterProps {
  revisedOptions: string[];
  revised: string[];
  setSelectedRevised: Dispatch<SetStateAction<string[]>>;
  overDueOptions: string[];
  overdue: string[];
  setSelectedOverdue: Dispatch<SetStateAction<string[]>>;
  issueRatingOptions: string[];
  issueRating: string[];
  setIssueRating: Dispatch<SetStateAction<string[]>>;
  issueSource: string[];
  issueSourceOptions: string[];
  setIssueSource: Dispatch<SetStateAction<string[]>>;
  issueYear: string[];
  issueYearOptions: string[];
  setIssueYear: Dispatch<SetStateAction<string[]>>;
  issueStatus: string[];
  issueStatusOptions: string[];
  setIssueStatus: Dispatch<SetStateAction<string[]>>;
}

export const IssueDetailedFilter = ({
  revisedOptions,
  revised,
  setSelectedRevised,
  overDueOptions,
  overdue,
  setSelectedOverdue,
  issueRatingOptions,
  issueRating,
  setIssueRating,
  issueSource,
  issueSourceOptions,
  setIssueSource,
  issueYear,
  issueYearOptions,
  setIssueYear,
  issueStatus,
  issueStatusOptions,
  setIssueStatus,
}: IssueDetailedFilterProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleReset = () => {
    setSelectedRevised([]);
    setSelectedOverdue([]);
    setIssueRating([]);
    setIssueSource([]);
    setIssueYear([]);
    setIssueStatus([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          className="w-[200px] h-7 text-white bg-blue-700 items-center flex justify-between font-[helvetica] font-bold"
          variant="ghost">
          <span className="flex items-center gap-1">
            <Filter size={16} strokeWidth={3} />
            Filter
          </span>
          <span>
            {open ? (
              <ChevronUp size={16} strokeWidth={3} />
            ) : (
              <ChevronDown size={16} strokeWidth={3} />
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px]">
        <Label className="font-bold text-[20px] font-[helvetica]">
          Isssue Filters
        </Label>
        <Separator className="my-2" />
        <div className="w-full flex items-center gap-5 py-3 flex-col">
          <section className="w-full flex items-center gap-2">
            <section className="flex-1 flex items-start flex-col gap-1">
              <Label className="font-[helvetica] font-[550]">
                Revised Issues
              </Label>
              <MultiStatusFilter
                options={revisedOptions}
                value={revised}
                onChange={setSelectedRevised}
              />
            </section>
            <section className="flex-1 flex items-start flex-col gap-1">
              <Label className="font-[helvetica] font-[550]">
                Overdue Issues
              </Label>
              <MultiStatusFilter
                options={overDueOptions}
                value={overdue}
                onChange={setSelectedOverdue}
              />
            </section>
          </section>
          <section className="w-full flex items-center gap-2">
            <section className="flex-1 flex items-start flex-col gap-1">
              <Label className="font-[helvetica] font-[550]">
                Issue Rating
              </Label>
              <MultiStatusFilter
                options={issueRatingOptions}
                value={issueRating}
                onChange={setIssueRating}
              />
            </section>
            <section className="flex-1 flex items-start flex-col gap-1">
              <Label className="font-[helvetica] font-[550]">
                Issue Source
              </Label>
              <MultiStatusFilter
                options={issueSourceOptions}
                value={issueSource}
                onChange={setIssueSource}
              />
            </section>
          </section>
          <section className="w-full flex items-center gap-2">
            <section className="flex-1 flex items-start flex-col gap-1">
              <Label className="font-[helvetica] font-[550]">
                Financial Year
              </Label>
              <MultiStatusFilter
                options={issueYearOptions}
                value={issueYear}
                onChange={setIssueYear}
              />
            </section>
            <section className="flex-1 flex items-start flex-col gap-1">
              <Label className="font-[helvetica] font-[550]">
                Overall Status
              </Label>
              <MultiStatusFilter
                options={issueStatusOptions}
                value={issueStatus}
                onChange={setIssueStatus}
              />
            </section>
          </section>
        </div>
        <Separator className="my-2" />
        <section className="flex items-center justify-end">
          <Button
            onClick={handleReset}
            className="text-white font-bold font-[helvetica] bg-blue-700 w-[130px] h-7 flex items-center justify-start"
            variant="ghost">
            <X size={16} strokeWidth={3} />
            Reset
          </Button>
        </section>
      </PopoverContent>
    </Popover>
  );
};
