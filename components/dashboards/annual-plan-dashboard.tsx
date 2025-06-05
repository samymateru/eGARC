import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { useQuery } from "@tanstack/react-query";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AnnuaPlanDashboardProps {
  value: number;
}

type DashBoard = {
  total: number;
  completed: number;
  pending: number;
  ongoing: number;
};

export const AnnuaPlanDashboard = ({}: AnnuaPlanDashboardProps) => {
  const params = useSearchParams();

  const { data, isSuccess } = useQuery({
    queryKey: ["_eaudit_plan_details_", params.get("id")],
    queryFn: async (): Promise<DashBoard> => {
      const response = await fetch(
        `${BASE_URL}/dashboards/eauditNext/plan_details/${params.get("id")}`,
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

  if (isSuccess && data) {
    return (
      <section className="flex items-center justify-center w-[100vw] px-[100px] gap-2 relative">
        <section className=" w-[250px] h-[150px] rounded-md relative bg-green-700">
          <header className="text-black font-[helvetica] font-bold text-[30px] text-center text-nowrap">
            Completed
          </header>
          <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 justify-center items-center">
            <Label className="text-[20px] font-mono font-bold tracking-normal text-black text-nowrap">
              {data?.completed}
            </Label>
            <Label className="text-xs italic font-semibold text-black bg-green-400 p-1 rounded-md">
              {(data?.completed / data?.total) * 100}%
            </Label>
          </main>
        </section>
        <section className=" w-[250px] h-[150px] rounded-md relative bg-blue-700">
          <header className="text-black font-[helvetica] font-bold text-[30px] text-center text-nowrap">
            Ongoing
          </header>
          <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 justify-center items-center">
            <Label className="text-[20px] font-mono font-bold tracking-normal text-black text-nowrap">
              {data?.ongoing}
            </Label>
            <Label className="text-xs italic font-semibold text-black bg-blue-400 p-1 rounded-md">
              {(data?.ongoing / data?.total) * 100}%
            </Label>
          </main>
        </section>
        <section className=" w-[250px] h-[150px] rounded-md relative bg-red-700">
          <header className="text-black font-[helvetica] font-bold text-[30px] text-center text-nowrap">
            Pending
          </header>
          <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 justify-center items-center">
            <Label className="text-[20px] font-mono font-bold tracking-normal text-black text-nowrap">
              {data?.pending}
            </Label>
            <Label className="text-xs italic font-semibold text-black bg-red-400 p-1 rounded-md">
              {(data?.pending / data?.total) * 100}%
            </Label>
          </main>
        </section>
      </section>
    );
  }
};
