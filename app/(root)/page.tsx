"use client";
import { useQuery } from "@tanstack/react-query";
import "@/app/globals.css";

import { OrganizationSchema } from "@/lib/types";
import { z } from "zod";
import OrganizationTable from "@/components/data-table/organization-table";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type OrganizationValues = z.infer<typeof OrganizationSchema>;

export default function HomePage() {
  const { data } = useQuery({
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

  return (
    <section className="w-full h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">Organizations</h1>
      <section className="flex flex-col h-full gap-1 px-2">
        <p className="text-center text-xs">
          These are organization that you were added on
        </p>
        <OrganizationTable data={data ?? []} />
      </section>
    </section>
  );
}
