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
  AlertTriangle,
  BarChart,
  Bell,
  CircleArrowLeft,
  CircleCheck,
  Clock,
  Flag,
  Goal,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Package,
  Settings,
  Shield,
  TriangleAlert,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ErrorMessage } from "@/lib/utils";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
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
  const [showModules, setShowModules] = useState(false);
  const [showGoto, setShowGoto] = useState(false);
  const goToLeaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goToEnterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moduleLeaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moduleEnterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      const storedOrgId = localStorage.getItem("organizationId");
      const moduleId = localStorage.getItem("moduleId");
      setOrgId(storedOrgId);
      setModuleId(moduleId);
    }
  }, []);

  const { data, isError, error, isLoading } = useQuery({
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

  useEffect(() => {
    if (isError) {
      ErrorMessage(error);
    }
  }, [error, isError]);

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

  const handleGotoMouseEnter = () => {
    if (goToLeaveTimeout.current) clearTimeout(goToLeaveTimeout.current);
    goToEnterTimeout.current = setTimeout(() => {
      setShowGoto(true);
    }, 200);
  };

  const handleGotoMouseLeave = () => {
    if (goToEnterTimeout.current) clearTimeout(goToEnterTimeout.current);
    goToLeaveTimeout.current = setTimeout(() => {
      setShowGoto(false);
    }, 200);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="px-2 py-1 border-none min-w-[280px] bg-neutral-300 text-black">
        <section className="mt-1">
          <Label className="font-helvetica-medium pl-5 ">Actions</Label>
        </section>
        <Separator className="my-2 bg-neutral-500" />
        <ul className="text-sm flex flex-col gap-[1px]">
          <Button
            onMouseEnter={handleModuleMouseEnter}
            onMouseLeave={handleModuleMouseLeave}
            className="relative hover:bg-blue-400  h-8 px-3 py-1 w-full flex items-center justify-start gap-1 font-helvetica-13 bg-inherit shadow-none text-black">
            {isLoading ? (
              <LoaderCircle
                className="animate-spin"
                size={16}
                strokeWidth={2}
              />
            ) : isError ? (
              <AlertTriangle
                className="text-red-700"
                size={16}
                strokeWidth={2}
              />
            ) : (
              <Package size={16} strokeWidth={2} />
            )}
            Modules
            {showModules && !isLoading && data && (
              <section
                className={`p-1 absolute top-[0px] right-[102%] mr-1 shadow-md rounded-md border w-[280px] z-10 bg-neutral-300 py-2`}>
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
            onMouseEnter={handleGotoMouseEnter}
            onMouseLeave={handleGotoMouseLeave}
            className="relative hover:bg-blue-400  h-8 px-3 py-1 w-full flex items-center justify-start gap-1 font-helvetica-13 bg-inherit shadow-none text-black">
            <CircleArrowLeft size={16} strokeWidth={2} />
            Goto
            {showGoto && (
              <section
                className={`p-1 absolute top-[0px] right-[102%] mr-1 shadow-md rounded-md border w-[280px] z-10 bg-neutral-300 py-2`}>
                <Link
                  onClick={() => setShowGoto(false)}
                  className="font-helvetica-13 w-full h-8 rounded-md pl-2 flex items-center gap-2 hover:bg-blue-400"
                  href={{
                    pathname: `/eAuditNext`,
                    query: {
                      id: moduleId,
                      organizationId: orgId,
                      action: "dashboard",
                    },
                  }}>
                  <LayoutDashboard size={16} strokeWidth={2} />
                  Dashboard
                </Link>
                <Link
                  onClick={() => setShowGoto(false)}
                  className="font-helvetica-13 w-full h-8 rounded-md pl-2 flex items-center gap-2 hover:bg-blue-400"
                  href={{
                    pathname: `/eAuditNext`,
                    query: {
                      id: moduleId,
                      organizationId: orgId,
                      action: "audit_plan",
                    },
                  }}>
                  <Goal size={16} strokeWidth={2} />
                  Audit Plans
                </Link>
                <Link
                  onClick={() => setShowGoto(false)}
                  className="font-helvetica-13 w-full h-8 rounded-md pl-2 flex items-center gap-2 hover:bg-blue-400"
                  href={{
                    pathname: `/eAuditNext`,
                    query: {
                      id: moduleId,
                      organizationId: orgId,
                      action: "report",
                    },
                  }}>
                  <BarChart size={16} strokeWidth={2} />
                  Reports
                </Link>
                <Link
                  onClick={() => setShowGoto(false)}
                  className="font-helvetica-13 w-full h-8 rounded-md pl-2 flex items-center gap-2 hover:bg-blue-400"
                  href={{
                    pathname: `/eAuditNext`,
                    query: {
                      id: moduleId,
                      organizationId: orgId,
                      action: "follow_up",
                    },
                  }}>
                  <Clock size={16} strokeWidth={2} />
                  Follow up
                </Link>
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
            className="relative hover:bg-blue-600 h-8 px-3 py-1 w-full font-helvetica-13 flex items-center justify-start gap-1 text-black">
            <Settings size={16} strokeWidth={2} />
            Preferences
          </Button>
          <NotificationCenter>
            <Button
              variant="ghost"
              className="relative hover:bg-blue-600 h-8 px-3 py-1 w-full font-helvetica-13 flex items-center justify-start gap-1 text-black">
              <Bell size={16} strokeWidth={2} />
              Notification
            </Button>
          </NotificationCenter>

          <Button
            variant="ghost"
            className="relative hover:bg-blue-600 h-8 px-3 py-1 w-full font-helvetica-13 flex items-center justify-start gap-1 text-black"
            onClick={() => router.push("/")}>
            <X size={16} strokeWidth={2} />
            Quit
          </Button>
          <Button
            variant="ghost"
            className="relative hover:bg-blue-600  h-8 px-3 py-1 w-full font-helvetica-13 flex items-center justify-start gap-1 text-black"
            onClick={() => router.push("/")}>
            <LogOut size={16} strokeWidth={2} />
            Logout
          </Button>
        </ul>
      </PopoverContent>
    </Popover>
  );
};
