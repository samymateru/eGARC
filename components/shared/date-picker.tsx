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
import { useState } from "react";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  side?: "left" | "right";
  offset?: number;
}

export function DatePicker({
  value,
  onChange,
  side = "left",
  offset = 0,
}: DatePickerProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [month, setMonthState] = React.useState<Date>(new Date());
  const [openSelect, setOpenSelect] = useState<"month" | "year" | null>(null);

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

  const handleMonthOpenChange = (open: boolean) => {
    setOpenSelect(open ? "month" : null);
  };

  const handleYearOpenChange = (open: boolean) => {
    setOpenSelect(open ? "year" : null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "justify-start text-left font-helvetica-13 bg-neutral-200 text-black hover:bg-neutral-300",
            !value && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-4 w-4 text-black" />
          {value ? (
            format(value, "PPP")
          ) : (
            <span className="text-black font-helvetica-13"> Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-auto p-2 flex flex-col bg-neutral-200"
        side={side}
        align="center"
        sideOffset={offset}>
        <div className="flex items-center gap-2 mb-2">
          {/* Month Selector */}
          <Select
            key={"month"}
            value={getMonth(month).toString()}
            open={openSelect === "month"}
            onOpenChange={handleMonthOpenChange}
            onValueChange={(val) => handleMonthChange(parseInt(val))}>
            <SelectTrigger className="w-[140px] font-helvetica-13 border border-neutral-500">
              <SelectValue
                placeholder="Select month"
                className="font-helvetica-13"
              />
            </SelectTrigger>

            <SelectContent className="w-[250px]">
              <SelectGroup className="max-h-[250px] overflow-y-auto hide-scrollbar">
                {months.map((name, index) => (
                  <SelectItem
                    key={name}
                    value={index.toString()}
                    className="hover:bg-blue-400 cursor-pointer font-helvetica-13">
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
            open={openSelect === "year"}
            onOpenChange={handleYearOpenChange}
            onValueChange={(val) => handleYearChange(parseInt(val))}>
            <SelectTrigger className="w-[100px] font-helvetica-13 border border-neutral-500">
              <SelectValue
                placeholder="Select year"
                className="font-helvetica-13"
              />
            </SelectTrigger>

            <SelectContent
              position="popper"
              className="w-[150px]"
              alignOffset={-30}>
              <SelectGroup className="max-h-[min(26rem,var(--radix-select-content-available-height))] overflow-y-auto hide-scrollbar">
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="hover:bg-blue-400 cursor-pointer font-helvetica-13">
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
