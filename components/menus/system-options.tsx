import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { NotificationCenter } from "@/app/(root)/_notifications/notification-center";
import {
  Activity,
  Bell,
  CircleCheck,
  Flag,
  LogOut,
  Package,
  Settings,
  Shield,
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

export const SystemOptions = ({ children }: SystemOptionsProps) => {
  const [showModules, setShowModules] = useState(false);
  const moduleLeaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moduleEnterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      <PopoverContent className="px-2 py-1 border-none min-w-[280px] bg-neutral-200">
        <ul className="text-sm flex flex-col gap-[1px]">
          <Button
            onMouseEnter={handleModuleMouseEnter}
            onMouseLeave={handleModuleMouseLeave}
            className="relative px-3 shadow-none text-black bg-neutral-200 py-1 h-8 w-full  font-helvetica-13 hover:bg-blue-400 flex justify-start gap-1">
            <Package size={16} strokeWidth={2} />
            Modules
            {showModules && (
              <section className="px-2 py-2 absolute top-[-30px] left-[calc(100%+12px)] mr-1 rounded-md border w-[290px] z-10 bg-neutral-200">
                {data?.map((module) => (
                  <Link
                    onClick={() => setShowModules(false)}
                    className="font-helvetica-13 w-full h-8 rounded-md pl-2 flex items-center gap-2 hover:bg-blue-400"
                    key={module.id}
                    href={{
                      pathname: `/${module.name}`,
                      query: { id: module.id, organizationId: orgId },
                    }}>
                    {module.name === "eAuditNext" ? (
                      <Activity size={16} />
                    ) : module.name === "eRisk" ? (
                      <TriangleAlert size={16} />
                    ) : module.name === "eFraud" ? (
                      <Shield size={16} />
                    ) : module.name === "eGovernance" ? (
                      <Flag size={16} />
                    ) : module.name === "eCompliance" ? (
                      <CircleCheck size={16} />
                    ) : (
                      <Package size={16} />
                    )}

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
            className="px-3 py-1 h-8 w-full  font-helvetica-13 hover:bg-blue-400 flex justify-start gap-1">
            <Settings size={16} strokeWidth={2} />
            Preferences
          </Button>
          <NotificationCenter>
            <Button
              variant="ghost"
              className="px-3 py-1 h-8 w-full  font-helvetica-13 hover:bg-blue-400 flex justify-start gap-1">
              <Bell size={16} strokeWidth={2} />
              Notification
            </Button>
          </NotificationCenter>
          <Button
            variant="ghost"
            className="px-3 py-1 h-8 w-full  font-helvetica-13 hover:bg-blue-400 flex justify-start gap-1"
            onClick={() => router.push("/")}>
            <X size={16} strokeWidth={2} />
            Quit
          </Button>
          <Button
            variant="ghost"
            className="px-3 py-1 h-8 w-full  font-helvetica-13 hover:bg-blue-400 flex justify-start gap-1">
            <LogOut size={16} strokeWidth={2} />
            Logout
          </Button>
        </ul>
      </PopoverContent>
    </Popover>
  );
};
