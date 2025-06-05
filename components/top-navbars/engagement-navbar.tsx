"use client";
import { Button } from "../ui/button";
import { Package } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { EngagementDropdownMenu } from "../menus/engagement-dropdown-menu";

export const EngagementNavbar = () => {
  const params = useSearchParams();
  return (
    <section className="flex flex-1 justify-between">
      <section>
        {params.get("name") && (
          <Label className="font-[helvetica] text-[24px] font-semibold ml-4">
            {params.get("name")}
          </Label>
        )}
      </section>
      <section className="flex gap-1 items-center pr-2">
        <EngagementDropdownMenu>
          <Button className="dark:hover:bg-neutral-900 px-3 py-1 h-7 w-[120px]  bg-black text-neutral-200 font-table flex items-center gap-1">
            <Package size={16} strokeWidth={3} />
            Modules
          </Button>
        </EngagementDropdownMenu>
      </section>
    </section>
  );
};
