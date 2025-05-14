"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { CirclePlus, Edit, Import, Share, Trash } from "lucide-react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { SubProgramForm } from "../forms/sub-program-form";

interface MainProgramActionProps {
  children?: ReactNode;
  id: string;
}

export const MainProgramAction = ({ children, id }: MainProgramActionProps) => {
  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        className="dark:bg-black p-2"
        onClick={(e) => e.stopPropagation()}>
        <Label className="font-bold text-[20px] font-[helvetica]">
          Program Actions
        </Label>
        <Separator />
        <section className="mt-1">
          <SubProgramForm
            title="Sub Program"
            endpoint="engagements/sub_program"
            id={id}>
            <DropdownMenuItem
              asChild
              onSelect={(e) => {
                e.preventDefault(); // <- prevents menu from closing
              }}>
              <div className="w-full flex justify-start gap-2 items-center h-[30px] cursor-pointer">
                <CirclePlus size={16} strokeWidth={3} />
                Procedure
              </div>
            </DropdownMenuItem>
          </SubProgramForm>

          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]">
            <Edit size={16} strokeWidth={3} />
            Edit
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]">
            <Share size={16} strokeWidth={3} />
            Assign
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]">
            <Import size={16} strokeWidth={3} />
            Import
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 items-center h-[30px]">
            <Trash size={16} strokeWidth={3} />
            Remove
          </Button>
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
