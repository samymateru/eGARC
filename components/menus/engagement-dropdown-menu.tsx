import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { NotificationCenter } from "@/app/(root)/_notifications/notification-center";
import {
  Activity,
  Bell,
  Moon,
  Package,
  Settings,
  Sun,
  TriangleAlert,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type SystemOptionsProps = {
  children: ReactNode;
};

type ModuleResponse = {
  id?: string;
  name?: string;
  status?: string;
};

export const EngagementDropdownMenu = ({ children }: SystemOptionsProps) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [showModules, setShowModules] = useState(false);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moduleLeaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moduleEnterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { setTheme } = useTheme();
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    const storedOrgId = localStorage.getItem("organizationId");
    setOrgId(storedOrgId);
  }, []);

  const { data } = useQuery({
    queryKey: ["_modules_", orgId],
    queryFn: async (): Promise<ModuleResponse[]> => {
      const response = await fetch(`${BASE_URL}/modules/${orgId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          body: errorBody,
        };
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!orgId,
  });

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

  const handleModuleMouseEnter = () => {
    if (moduleLeaveTimeout.current) clearTimeout(moduleLeaveTimeout.current);
    moduleEnterTimeout.current = setTimeout(() => {
      setShowModules(true);
    }, 200);
  };

  const handleModuleMouseLeave = () => {
    if (moduleEnterTimeout.current) clearTimeout(moduleEnterTimeout.current);
    moduleLeaveTimeout.current = setTimeout(() => {
      setShowModules(false);
    }, 200);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="px-2 py-1 border-none min-w-[280px]">
        <ul className="text-sm divide-y flex flex-col gap-[1px]">
          <Button
            onMouseEnter={handleModuleMouseEnter}
            onMouseLeave={handleModuleMouseLeave}
            variant="ghost"
            className="bg-black relative hover:bg-neutral-800 hover:text-neutral-200 text-neutral-200 h-8 px-3 py-1 w-full font-table flex items-center justify-start gap-1">
            <Package size={16} strokeWidth={3} />
            Modules
            {showModules && (
              <section
                className={`p-1 absolute top-[0px] right-full divide-y mr-1 dark:bg-black shadow-md rounded-md border w-[200px] z-10 pop-bg`}>
                {data?.map((module) => (
                  <Link
                    onClick={() => setShowModules(false)}
                    className="font-[helvetica] text-[15px] font-medium tracking-wide w-full dark:hover:bg-neutral-800 h-8 rounded-md pl-2 flex items-center gap-2"
                    key={module.id}
                    href={{
                      pathname: `/${module.name}`,
                      query: { id: module.id },
                    }}>
                    {module.name === "eAuditNext" ? (
                      <Activity size={16} />
                    ) : module.name === "eRisk" ? (
                      <TriangleAlert size={16} />
                    ) : null}

                    {module.name}
                  </Link>
                ))}
              </section>
            )}
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/preferences?organizationId=${localStorage.getItem(
                  "organizationId"
                )}&moduleId=${localStorage.getItem("moduleId")}`
              )
            }
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
              <section
                className={`p-1 absolute top-[0px] right-full divide-y mr-1 dark:bg-black shadow-md rounded-md border w-[200px] z-10 pop-bg`}>
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
