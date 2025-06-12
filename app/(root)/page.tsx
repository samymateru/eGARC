"use client";
import { useQuery } from "@tanstack/react-query";
import "@/app/globals.css";

import { OrganizationSchema } from "@/lib/types";
import { z } from "zod";
import OrganizationTable from "@/components/data-table/organization-table";
import { useEffect, useState } from "react";
import SearchBar from "@/components/shared/search";
import { Button } from "@/components/ui/button";
import { saveSearchToLocalStorage } from "@/lib/utils";
import { Search } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type OrganizationValues = z.infer<typeof OrganizationSchema>;

export default function HomePage() {
  const [organization, setOrganization] = useState<OrganizationValues[]>([]);
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["organizations"],
    queryFn: async (): Promise<OrganizationValues[]> => {
      const response = await fetch(`${BASE_URL}/organization`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSuccess, data]);

  return (
    <section className="w-full h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">Organizations</h1>
      <section className="flex flex-col h-full gap-1 px-2">
        <p className="text-center text-xs">
          These are organization that you were added on
        </p>

        <SearchBar>
          <Button className="w-[150px] justify-start h-[30px]" variant="ghost">
            <Search size={6} strokeWidth={3} />
            Search
          </Button>
        </SearchBar>
        <Button
          onClick={() =>
            saveSearchToLocalStorage({
              name: "hello",
              value: "value",
              tag: "tag",
            })
          }>
          click
        </Button>
        <OrganizationTable data={organization ?? []} />
      </section>
    </section>
  );
}
