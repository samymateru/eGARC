import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Activity, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Label } from "../ui/label";
import { Loader } from "./loader";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ModuleDropdownProps {
  children: ReactNode;
}

type ModuleResponse = {
  id?: string;
  name?: string;
  status?: string;
};

export const ModuleDropdown = ({ children }: ModuleDropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["_modules_"],
    queryFn: async (): Promise<ModuleResponse[]> => {
      const response = await fetch(`${BASE_URL}/modules/e77a2210c368`, {
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
  });
  if (isError) {
    console.log(error);
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side="left"
        align="start"
        sideOffset={12}
        className="px-2 py-2 h-fit w-[250px] dark:bg-black font-serif font-semibold tracking-wide scroll-m-0">
        <Label className="font-[Helvetica] tracking-wide scroll-m-0 font-semibold text-[20px]">
          Modules
        </Label>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="h-[70px]">
            <Loader size={8} title="Modules" />
          </div>
        ) : isSuccess && data ? (
          <section className="flex flex-col">
            {data.map((module) => (
              <Link
                onClick={() => setOpen(false)}
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
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
