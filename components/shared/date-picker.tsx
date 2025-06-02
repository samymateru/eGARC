"use client";

import * as React from "react";
import { format, getYear, setYear, setMonth, getMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [month, setMonthState] = React.useState<Date>(new Date());

  const years = Array.from(
    { length: 30 },
    (_, i) => getYear(new Date()) - 15 + i
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleYearChange = (year: number) => {
    const updated = setYear(month, year);
    setMonthState(updated);
  };

  const handleMonthChange = (monthIndex: number) => {
    const updated = setMonth(month, monthIndex);
    setMonthState(updated);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-auto p-2 flex flex-col dark:bg-black"
        align="center">
        <div className="flex items-center gap-2 mb-2">
          {/* Month Selector */}
          <Select
            key={"month"}
            value={getMonth(month).toString()}
            onValueChange={(val) => handleMonthChange(parseInt(val))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup className="max-h-[250px] overflow-y-auto">
                {months.map((name, index) => (
                  <SelectItem
                    key={name}
                    value={index.toString()}
                    className="dark:hover:bg-neutral-800 cursor-pointer">
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Year Selector */}
          <Select
            key={"year"}
            value={getYear(month).toString()}
            onValueChange={(val) => handleYearChange(parseInt(val))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>

            <SelectContent position="popper" className="">
              <SelectGroup className="max-h-[min(26rem,var(--radix-select-content-available-height))] overflow-y-auto">
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="dark:hover:bg-neutral-800 cursor-pointer">
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Calendar
          className=""
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          month={month}
          onMonthChange={setMonthState}
        />
      </PopoverContent>
    </Popover>
  );
}
