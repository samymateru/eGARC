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
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ModuleForm } from "../forms/modules-form";
import { Separator } from "../ui/separator";
import { OrganizationForm } from "../forms/organization-form";
import { ErrorMessage } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ModuleResponse = {
  id?: string;
  name?: string;
  status?: string;
};

type TokenResponse = {
  token?: string;
};

interface ModuleSelectProps {
  children: ReactNode;
  organizationName: string;
  organizationType: string;
  organizationTelephone: string;
  organizationEmail: string;
  organizationId: string;
  id: string;
}

export const ModuleSelect = ({
  children,
  id,
  organizationName,
  organizationType,
  organizationTelephone,
  organizationEmail,
  organizationId,
}: ModuleSelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [moduleId, setModuleId] = useState<string | null>(null);

  const { data, isError, error } = useQuery({
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

  const {
    data: tokenData,
    isError: tokenisError,
    error: tokenError,
    isSuccess: tokenisSuccess,
    refetch: refreshToken,
  } = useQuery({
    queryKey: ["_token_", moduleId],
    queryFn: async (): Promise<TokenResponse> => {
      const response = await fetch(`${BASE_URL}/token/${moduleId}`, {
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
    enabled: !!moduleId,
  });

  useEffect(() => {
    if (moduleId) {
      refreshToken();
    }
  }, [moduleId, refreshToken]);

  console.log(tokenData?.token);

  useEffect(() => {
    if (tokenisError) {
      ErrorMessage(tokenError);
    }
    if (tokenisSuccess) {
      if (typeof window !== undefined) {
        localStorage.setItem("token", tokenData.token ?? "");
      }
    }
  }, [tokenData, tokenError, tokenisError, tokenisSuccess]);

  useEffect(() => {
    if (isError) {
      ErrorMessage(error);
    }
  }, [data, isError, error]);

  const setProfile = (
    moduleId?: string,
    moduleName?: string,
    organizationId?: string,
    organizationName?: string
  ) => {
    if (typeof window !== undefined) {
      localStorage.setItem("moduleId", moduleId ?? "");
      localStorage.setItem("moduleName", moduleName ?? "");
      localStorage.setItem("organizationId", organizationId ?? "");
      localStorage.setItem("organizationName", organizationName ?? "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[500px] max-h-[70vh]  px-2 py-5 relative gap-0 bg-white">
        <Button
          onClick={() => setOpen(false)}
          variant="ghost"
          className="absolute top-1 right-1 w-[15px] h-[25px] hover:bg-neutral-700">
          <X size={16} />
        </Button>
        <DialogHeader>
          <DialogTitle className="font-helvetica-large pb-2">
            Organization
          </DialogTitle>
          <DialogDescription className="absolute" />
        </DialogHeader>
        <section className="flex items-center justify-end gap-1 my-1">
          <ModuleForm title="New Module" id={id} endpoint="modules">
            <Button
              type="submit"
              className="bg-black font-helvetica-13 text-white h-8 flex-1 flex items-center justify-start">
              <CirclePlus className="mr-1" size={16} strokeWidth={3} />
              Module
            </Button>
          </ModuleForm>
          <OrganizationForm
            data={{
              name: organizationName,
              type: organizationType,
              email: organizationEmail,
              telephone: organizationTelephone,
            }}
            endpoint="organization"
            title="Edit Organization"
            mode="update"
            id={id}>
            <Button className="h-[30px] font-helvetica-13 flex-1 flex items-center justify-start">
              <Edit size={16} />
              Edit
            </Button>
          </OrganizationForm>
          <Button className="flex-1 h-[30px] flex items-center justify-start font-helvetica-13">
            <Trash size={16} className="text-red-700" />
            Remove
          </Button>
        </section>
        <Separator className="" />
        <section className="flex flex-col gap-2 mt-3">
          <section>
            <h2 className="font-helvetica-14 flex items-center gap-2">
              <Package size={16} />
              Modules
            </h2>
          </section>
          {data && data.length > 0 ? (
            <ul className="flex flex-col gap-1 max-h-[200px] overflow-auto">
              {data.map((module) => (
                <Link
                  onClick={() => {
                    setProfile(
                      module.id,
                      module.name,
                      organizationId,
                      organizationName
                    );
                    setModuleId(module.id ?? "");
                  }}
                  className="font-helvetica-13 px-2 w-[calc(100%-30px)] mx-auto bg-neutral-300 h-8 rounded-md flex items-center gap-2"
                  key={module.id}
                  href={{
                    pathname: `/${module.name}`,
                    query: {
                      id: module.id,
                      organizationId: id,
                      action: "dashboard",
                    },
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
        <footer className="flex justify-center gap-2 my-3"></footer>
        <Separator className="" />
        <section className="py-1">
          <p className="text-balance font-helvetica-13 text-neutral-700 mt-2">
            In this upper section you can edit or remove the current
            organization selected, be carefully while doing that, the low
            section list the modules in current organization
          </p>
        </section>
      </DialogContent>
    </Dialog>
  );
};
