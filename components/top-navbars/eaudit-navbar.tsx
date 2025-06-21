"use client";
import { Label } from "../ui/label";
import { EngagementNavbar } from "./engagement-navbar";
import { useEffect, useState } from "react";

export const EauditNavbar = () => {
  const [organizationName, setOrgnizationName] = useState<string | null>(null);

  useEffect(() => {
    const organizationName = localStorage.getItem("organizationName");

    if (organizationName) {
      setOrgnizationName(organizationName);
    }
  }, []);

  return (
    <section className="flex items-center justify-between w-full px-2">
      <section id="logo" className="flex items-center gap-2">
        <span className="w-[30px] h-[30px] bg-black flex items-center justify-center rounded-md text-white font-serif">
          {organizationName?.slice(0, 2).toUpperCase()}
        </span>
        <Label className="text-black font-bold tracking-wide scroll-m-1 truncate text-[20px]">
          {organizationName}
        </Label>
      </section>
      <section>
        <EngagementNavbar />
      </section>
    </section>
  );
};
