"use client";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const PreferencesNavbar = () => {
  const router = useRouter();
  return (
    <section className="flex flex-1 justify-between">
      <section className="flex gap-1 items-center pr-2">
        <Button
          onClick={() => router.back()}
          className="dark:hover:bg-neutral-800 px-3 py-1 h-7 w-[120px]  dark:bg-background dark:text-neutral-400 font-serif font-semibold flex items-center gap-1">
          <ArrowLeft size={16} strokeWidth={3} />
          Back
        </Button>
      </section>
    </section>
  );
};
