import Link from "next/link";
import { ModeToggle } from "./toggle-button";
import { Bell, Settings } from "lucide-react";

export const TopNavbar = () => {
  return (
    <section className="flex justify-end pt-1">
      <ul className="pr-1 flex items-center gap-2">
        <li className="w-[38px] h-[38px] rounded-full border border-neutral-700 hover:bg-neutral-800">
          <Link
            href="/notifications"
            className="w-full h-full flex justify-center items-center">
            <Bell size={16} />
          </Link>
        </li>
        <li className="w-[38px] h-[38px] rounded-full border border-neutral-700 hover:bg-neutral-800">
          <Link
            href="/settings"
            className="w-full h-full flex justify-center items-center">
            <Settings size={16} />
          </Link>
        </li>
        <li>
          <ModeToggle />
        </li>
      </ul>
    </section>
  );
};
