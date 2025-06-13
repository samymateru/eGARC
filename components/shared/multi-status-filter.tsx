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
          <span>Selected</span>
          <span className="ml-3">({value.length})</span>
        </>
      )}
    </span>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full dark:bg-neutral-800 dark:hover:bg-neutral-900 h-7 flex items-center justify-start font-serif tracking-wide scroll-m-0">
          <FilterIcon size={16} strokeWidth={3} />
          <span className="flex flex-col">{buttonLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] space-y-2 p-2">
        {options?.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <Checkbox
              id={option}
              checked={value.includes(option)}
              onCheckedChange={() => handleCheck(option)}
            />
            <label
              htmlFor={option}
              className="text-sm font-serif tracking-wide scroll-m-0 dark:hover:bg-neutral-800 w-full rounded-md py-1 px-3 cursor-pointer">
              {option}
            </label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
