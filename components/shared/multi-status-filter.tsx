"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { FilterIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

type MultiStatusFilterProps = {
  options?: string[];
  value: string[];
  onChange: (selected: string[]) => void;
};

export default function MultiStatusFilter({
  options,
  value,
  onChange,
}: MultiStatusFilterProps) {
  const [open, setOpen] = useState(false);

  const handleCheck = (status: string) => {
    const exists = value.includes(status);
    const updated = exists
      ? value.filter((v) => v !== status)
      : [...value, status];
    onChange(updated);
  };

  const buttonLabel = (
    <span>
      {value.length === 0 ? (
        "All"
      ) : value.length === 1 ? (
        value[0]
      ) : (
        <>
          <span className="font-helvetica-13">Selected</span>
          <span className="ml-3 font-helvetica-13">({value.length})</span>
        </>
      )}
    </span>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="min-w-[130px] h-7 flex items-center justify-start font-helvetica-13 bg-black">
          <FilterIcon size={16} strokeWidth={2} />
          <span className="flex flex-col">{buttonLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] space-y-2 px-3 py-2 bg-neutral-300">
        <div>
          <Label className="font-helvetica-14">Filter By</Label>
        </div>
        <Separator className="bg-neutral-500 my-1" />
        {options?.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <Checkbox
              id={option}
              checked={value.includes(option)}
              onCheckedChange={() => handleCheck(option)}
            />
            <label
              htmlFor={option}
              className="font-helvetica-13 hover:bg-blue-400 w-full rounded-md py-1 px-3 cursor-pointer">
              {option}
            </label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
