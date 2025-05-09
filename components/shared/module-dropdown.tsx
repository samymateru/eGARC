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
      const response = await fetch(`${BASE_URL}/company_modules`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch control");
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
      <DropdownMenuContent className="px-2 py-2 w-[250px] dark:bg-black font-serif font-semibold tracking-wide scroll-m-0">
        <Label className="font-serif tracking-wide scroll-m-0 font-semibold text-[20px]">
          Modules
        </Label>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div>loading</div>
        ) : isSuccess && data ? (
          <section className="flex flex-col">
            {data.map((module) => (
              <Link
                onClick={() => setOpen(false)}
                className="font-serif text-[15px] font-medium tracking-wide w-full dark:hover:bg-neutral-800 h-8 rounded-md pl-2 flex items-center gap-2"
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
