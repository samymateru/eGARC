import { useQuery } from "@tanstack/react-query";
import { PRCMSchema } from "@/lib/types";
import z from "zod";
import { useSearchParams } from "next/navigation";
import { PRCMTable } from "@/components/data-table/prcm-table";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PRCMValues = z.infer<typeof PRCMSchema>;

export const PRCM = () => {
  const params = useSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ["_prcm_", params.get("id")],
    queryFn: async (): Promise<PRCMValues[]> => {
      const response = await fetch(
        `${BASE_URL}/engagements/PRCM/${params.get("id")}`,
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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    enabled: !!params.get("id"),
  });
  if (isLoading) {
    return <div>loading...</div>;
  }
  return (
    <section className="w-[calc(100vw-320px)]">
      <PRCMTable data={data ?? []} />
    </section>
  );
};
