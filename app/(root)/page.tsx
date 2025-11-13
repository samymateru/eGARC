"use client";
import { useQuery } from "@tanstack/react-query";
import "@/app/globals.css";

import { OrganizationSchema } from "@/lib/types";
import { z } from "zod";
import OrganizationTable from "@/components/data-table/organization-table";
import { useEffect, useState } from "react";
import { Loader } from "@/components/shared/loader";
import { ErrorMessage } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type OrganizationValues = z.infer<typeof OrganizationSchema>;
export default function HomePage() {
  const [organization, setOrganization] = useState<OrganizationValues[]>([]);
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: async (): Promise<OrganizationValues[]> => {
      const response = await fetch(
        `${BASE_URL}/organization/entity/8e7fd5133152`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
        }
      );
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

  useEffect(() => {
    if (!isLoading && isSuccess) {
      const sortedOrganization = data?.sort(
        (a: OrganizationValues, b: OrganizationValues) => {
          return (
            new Date(b.created_at ?? "").getTime() -
            new Date(a.created_at ?? "").getTime()
          );
        }
      );
      setOrganization(sortedOrganization ?? []);
    }
    if (isError) {
      ErrorMessage(error);
    }
  }, [isLoading, isSuccess, isError, error, data]);

  return (
    <section className="w-[100vw] h-[100vh] flex flex-col bg-neutral-50">
      <section className="py-3 px-3">
        <section className="flex flex-col gap-2">
          <Label className="font-serif text-2xl font-bold">
            Your Organizations
          </Label>
          <p className="font-helvetica-13 text-neutral-800 w-1/2 text-balance">
            Welcome these are organization that some you own and other you were
            invited on. you can select on of them them start your journey
          </p>
        </section>
      </section>
      <section className="flex flex-col h-full gap-1  flex-1 px-2">
        <div>
          {isLoading ? (
            <Loader title="Organizations" />
          ) : (
            <OrganizationTable data={organization ?? []} />
          )}
        </div>
      </section>
    </section>
  );
}
