"use client";
import { Button } from "../ui/button";
import { Package } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { EngagementDropdownMenu } from "../menus/engagement-dropdown-menu";
import SearchBar from "../shared/search";

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
      <section className="flex gap-2 items-center pr-2">
        <EngagementDropdownMenu>
          <Button
            className="w-[200px] font-bold font-[helvetica] h-[28px] bg-blue-700 flex items-center justify-start text-white"
            variant="ghost">
            <Package size={16} strokeWidth={3} />
            Options
          </Button>
        </EngagementDropdownMenu>
        <SearchBar className="bg-black" />
      </section>
    </section>
  );
};
