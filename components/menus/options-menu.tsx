"use client";
import { ReactNode, useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Settings, Bell, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { NotificationCenter } from "@/app/(root)/_notifications/notification-center";

interface HoverSubmenuPopoverProps {
  children: ReactNode;
}

export const OptionsMenu = ({ children }: HoverSubmenuPopoverProps) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setTheme } = useTheme();
  const router = useRouter();
  const handleMouseEnter = () => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    enterTimeout.current = setTimeout(() => {
      setShowSubmenu(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    leaveTimeout.current = setTimeout(() => {
      setShowSubmenu(false);
    }, 200);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[250px] dark:bg-black p-2 pop-bg">
        <ul className="text-sm divide-y">
          <Button
            onClick={() => router.push("/preferences")}
            variant="ghost"
            className="dark:hover:bg-neutral-800 px-3 py-1 h-8 w-full  dark:bg-black dark:text-neutral-300 font-hel-heading flex justify-start gap-1">
            <Settings size={16} strokeWidth={3} />
            Preferences
          </Button>
          <NotificationCenter>
            <Button
              variant="ghost"
              className="dark:hover:bg-neutral-800 px-3 py-1 h-8 w-full  dark:bg-black dark:text-neutral-300 font-hel-heading flex justify-start gap-1">
              <Bell size={16} strokeWidth={3} />
              Notification
            </Button>
          </NotificationCenter>
          <li
            className="cursor-pointer hover:bg-white rounded-md relative p-2 flex justify-start gap-1 dark:hover:bg-neutral-800 px-3 py-1 h-8 w-full dark:bg-black dark:text-neutral-300 font-hel-heading"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <Moon size={16} strokeWidth={3} />
            Theme
            {showSubmenu && (
              <section className="p-1 absolute top-0 right-full divide-y mr-1 dark:bg-black shadow-md rounded-md border w-[200px] z-10 pop-bg">
                <Button
                  variant="ghost"
                  className="dark:hover:bg-neutral-800 px-3 py-1 h-8 w-full  dark:bg-black dark:text-neutral-300 font-hel-heading flex justify-start gap-1"
                  onClick={() => {
                    setShowSubmenu(false);
                    setTheme("light");
                  }}>
                  <Sun size={16} strokeWidth={3} />
                  Light
                </Button>
                <Button
                  variant="ghost"
                  className="dark:hover:bg-neutral-800 px-3 py-1 h-8 w-full  dark:bg-black dark:text-neutral-300 font-hel-heading flex justify-start gap-1"
                  onClick={() => {
                    setShowSubmenu(false);
                    setTheme("dark");
                  }}>
                  <Moon size={16} strokeWidth={3} />
                  Dark
                </Button>
                <Button
                  variant="ghost"
                  className="dark:hover:bg-neutral-800 px-3 py-1 h-8 w-full  dark:bg-black dark:text-neutral-300 font-hel-heading flex justify-start gap-1"
                  onClick={() => {
                    setShowSubmenu(false);
                    setTheme("system");
                  }}>
                  <Settings size={16} strokeWidth={3} />
                  System
                </Button>
              </section>
            )}
          </li>
          <Button
            variant="ghost"
            className="dark:hover:bg-neutral-800 px-3 py-1 h-8 w-full  dark:bg-black dark:text-neutral-300 font-hel-heading flex justify-start gap-1"
            onClick={() => router.push("/")}>
            <X size={16} strokeWidth={3} />
            Quit
          </Button>
        </ul>
      </PopoverContent>
    </Popover>
  );
};
