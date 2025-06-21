import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { RiskControlTable } from "../data-table/risk-control-table";
import { Label } from "../ui/label";
import { AlertTriangle } from "lucide-react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ProcedureRiskControlMatrix = () => {
  const params = useSearchParams();
  const { data } = useQuery({
    queryKey: ["_risk_control_", params.get("action")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/sub_program/risk_control/${params.get(
          "action"
        )}`,
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
    enabled: !!params.get("action"),
  });
  return (
    <div className="flex flex-col gap-3 pt-2 pb-3 w-[calc(100vw-332px)]">
      <section className="pl-2">
        <Label className="font-helvetica-medium pl-1 text-black flex items-center gap-2">
          <AlertTriangle
            size={17}
            strokeWidth={3}
            className="mb-[2px] text-red-600"
          />
          Risk & Control Details
        </Label>
      </section>
      <RiskControlTable data={data ?? []} />
    </div>
  );
};
