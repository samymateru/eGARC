"use client";
import { Button } from "@/components/ui/button";
import { Briefcase, LayoutDashboard, ListTodo } from "lucide-react";
import Component from "../shared/test";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export const EngagementSidebarMenu = () => {
  const params = useSearchParams();
  const router = useRouter();

  const setAction = (action: string) => {
    const param = new URLSearchParams(params.toString());
    param.set("action", action);
    router.replace(`?${param.toString()}`, { scroll: false });
  };
  return (
    <section>
      <section className="">
        <Label className="font-helvetica-medium pl-2">
          <ListTodo
            size={16}
            strokeWidth={2}
            className="mb-[2px] inline-block mr-2 "
          />
          Engagement Stages
        </Label>
      </section>
      <Separator className="bg-neutral-500 mt-1" />
      <section className="h-[calc(100vh-138px)] pb-2 overflow-y-auto hide-scrollbar">
        <Button
          className="mb-1 mt-2 flex w-full justify-start font-helvetica-13 bg-black hover:bg-neutral-900"
          onClick={() => setAction("dashboard")}>
          <LayoutDashboard size={16} strokeWidth={3} />
          Dashboard
        </Button>
        <Button
          className="mb-1 flex w-full justify-start font-helvetica-13 bg-black hover:bg-neutral-900"
          onClick={() => setAction("administration")}>
          <Briefcase size={16} strokeWidth={3} />
          Adminstation
        </Button>
        <Component />
      </section>
    </section>
  );
};
