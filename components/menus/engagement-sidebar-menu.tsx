"use client";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Component from "../shared/test";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter, useSearchParams } from "next/navigation";

export const EngagementSidebarMenu = () => {
  const params = useSearchParams();
  const router = useRouter();

  const setAction = (action: string) => {
    const param = new URLSearchParams(params.toString());
    param.set("action", action);
    router.replace(`?${param.toString()}`, { scroll: false });
  };
  return (
    <>
      <ScrollArea className="max-h-[550px] overflow-y-auto hide-scrollbar">
        <Button
          variant={"ghost"}
          className="mb-1 dark:bg-neutral-800 dark:hover:text-white flex w-full justify-start font-hel-heading"
          onClick={() => setAction("administration")}>
          <Briefcase size={16} strokeWidth={3} />
          Adminstation
        </Button>
        <Component />
      </ScrollArea>
    </>
  );
};
