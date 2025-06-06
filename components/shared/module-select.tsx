import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CirclePlus,
  Edit,
  Package,
  Trash,
  TriangleAlert,
  X,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { ModuleForm } from "../forms/modules-form";
import { Separator } from "../ui/separator";
import { OrganizationForm } from "../forms/organization-form";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ModuleResponse = {
  id?: string;
  name?: string;
  status?: string;
};

interface ModuleSelectProps {
  children: ReactNode;
  organizationName: string;
  organizationType: string;
  id: string;
}

export const ModuleSelect = ({
  children,
  id,
  organizationName,
  organizationType,
}: ModuleSelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data } = useQuery({
    queryKey: ["_modules_", id],
    queryFn: async (): Promise<ModuleResponse[]> => {
      const response = await fetch(`${BASE_URL}/modules/${id}`, {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[350px] max-h-[80vh] overflow-y-auto px-2 py-3 relative gap-0">
        <Button
          onClick={() => setOpen(false)}
          className="absolute top-1 right-1 w-[24px] h-[24px]"
          variant="ghost"
          size="icon">
          <X size={16} />
        </Button>
        <DialogHeader>
          <DialogTitle className="font-[helvetica] font-bold tracking-normal scroll-m-0 text-xl pl-2">
            Organization
          </DialogTitle>
          <DialogDescription className="absolute" />
        </DialogHeader>
        <section className="flex items-center justify-end gap-1 my-1">
          <OrganizationForm
            data={{
              name: organizationName,
              type: organizationType,
            }}
            endpoint="organization"
            title="Organization"
            mode="create"
            id={id}>
            <Button className="w-[30px] h-[30px]" variant="ghost">
              <Edit size={16} />
            </Button>
          </OrganizationForm>
          <Button className="w-[30px] h-[30px]" variant="ghost">
            <Trash size={16} />
          </Button>
        </section>
        <Separator className="" />
        <section className="flex flex-col gap-2 mt-3">
          <section>
            <h2 className="font-[helvetica] text-[14px] tracking-normal flex items-center gap-2">
              <Package size={16} />
              Modules
            </h2>
          </section>
          {data && data.length > 0 ? (
            <ul className="">
              {data.map((module) => (
                <Link
                  onClick={() => {
                    localStorage.setItem("moduleId", module.id ?? "");
                    localStorage.setItem("moduleName", module.name ?? "");
                    localStorage.setItem("organizationId", id);
                  }}
                  className="px-3 font-[helvetica] text-[15px] font-medium tracking-wide w-full dark:hover:bg-neutral-800 h-8 rounded-md flex items-center gap-2"
                  key={module.id}
                  href={{
                    pathname: `/${module.name}`,
                    query: { id: module.id, organizationId: id },
                  }}>
                  {module.name === "eAuditNext" ? (
                    <Activity size={16} />
                  ) : module.name === "eRisk" ? (
                    <TriangleAlert size={16} />
                  ) : null}

                  {module.name}
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-center font-[helvetica] text-[15px] tracking-normal">
              No modules found.
            </p>
          )}
        </section>
        <footer className="flex justify-center gap-2 my-3">
          <ModuleForm title="New Module" id={id} endpoint="modules">
            <Button
              type="submit"
              variant="ghost"
              className="bg-blue-950 text-white flex-1 font-[helvetica] tracking-wide h-8 scroll-m-1 font-bold">
              <CirclePlus className="mr-1" size={16} strokeWidth={3} />
              New Module
            </Button>
          </ModuleForm>
        </footer>
        <Separator className="" />
        <section className="py-1">
          <p className="text-balance text-[13px] font-[helvetica] tracking-normal text-neutral-500 mt-2">
            In this upper section you can edit or remove the current
            organization selected, be carefully while doing that, the low
            section list the modules in current organization
          </p>
        </section>
      </DialogContent>
    </Dialog>
  );
};
