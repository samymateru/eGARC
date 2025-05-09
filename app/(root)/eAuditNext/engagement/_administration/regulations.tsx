import { RegulationsTable } from "@/components/data-table/regulations-table";
import { useQuery } from "@tanstack/react-query";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const Regulations = () => {
  const { data } = useQuery({
    queryKey: ["_regulations_"],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/context/regulations/${"0d19fb18dd59"}`,
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
        throw new Error("Failed to fetch ");
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return <RegulationsTable data={data ?? []} />;
};
