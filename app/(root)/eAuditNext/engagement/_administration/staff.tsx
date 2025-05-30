import StaffTable from "@/components/data-table/staff-table";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const Staff = () => {
  const params = useSearchParams();
  const { data } = useQuery({
    queryKey: ["_staff_", params.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/staff/${params.get("id")}`,
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
    enabled: !!params.get("id"),
  });

  return <StaffTable data={data ?? []} />;
};
