"use client";
import { Button } from "../ui/button";
import { ModuleDropdown } from "../shared/module-dropdown";
import { List, Package } from "lucide-react";
import { OptionsMenu } from "../menus/options-menu";
import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";

export const EngagementNavbar = () => {
  const params = useSearchParams();
  return (
    <section className="flex flex-1 justify-between">
      <section>
        {params.get("name") && (
          <Label className="font-[helvetica] text-[20px] font-medium ml-4">
            {params.get("name")}
          </Label>
        )}
      </section>
      <section className="flex gap-1 items-center pr-2">
        <OptionsMenu>
          <Button className="dark:hover:bg-neutral-800 px-3 py-1 h-7 w-[120px]  dark:bg-background dark:text-neutral-400 font-serif font-semibold flex items-center gap-1">
            <List size={16} strokeWidth={3} />
            Options
          </Button>
        </OptionsMenu>
        <ModuleDropdown>
          <Button className="dark:hover:bg-neutral-800 px-3 py-1 h-7 w-[120px]  dark:bg-background dark:text-neutral-400 font-serif font-semibold flex items-center gap-1">
            <Package size={16} strokeWidth={3} />
            Modules
          </Button>
        </ModuleDropdown>
      </section>
    </section>
  );
};
