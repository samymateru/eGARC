"use client";
import { Button } from "../ui/button";
import { Package } from "lucide-react";
import { EngagementDropdownMenu } from "../menus/engagement-dropdown-menu";
import SearchBar from "../shared/search";

export const EngagementNavbar = () => {
  return (
    <section className="flex flex-1 justify-between">
      <section className="flex gap-2 items-center pr-2">
        <EngagementDropdownMenu>
          <Button className="w-[200px] font-helvetica-13 h-[28px] bg-neutral-800 flex items-center justify-start text-neutral-300 px-2">
            <Package size={16} className="text-neutral-300" />
            Options
          </Button>
        </EngagementDropdownMenu>
        <SearchBar className="bg-neutral-800" />
      </section>
    </section>
  );
};
