"use client";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";

export const description = "A pie chart with a label list";

const statusColors: Record<string, string> = {
  pending: "#991b1b",
  in_progress: "#0369a1",
  completed: "#15803d",
};

type ChartData = {
  state: string;
  value: number;
  fill: string;
};

interface ProcedureStatusPieChartProps {
  data?: Record<string, number>;
}

const chartConfig = {
  value: {
    label: "Value",
  },
  pending: {
    label: "Pending",
  },
  in_progress: {
    label: "In Progress",
  },
  completed: {
    label: "Completed",
  },
} satisfies ChartConfig;

export function ProcedureStatusPieChart({
  data,
}: ProcedureStatusPieChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [total, seTotal] = useState<number>(0);

  useEffect(() => {
    const chartData = Object.entries(statusColors).map(([state, fill]) => ({
      state,
      value: data?.[state as keyof typeof data] || 0,
      fill,
    }));
    setChartData(chartData);
    const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
    seTotal(totalValue);
  }, [data]);

  return (
    <Card className="flex flex-col border-none">
      <CardHeader className="">
        <CardTitle className="font-[helvetica] font-semibold text-[22px] tracking-wide text-left">
          Procudures Summary
        </CardTitle>
        <CardDescription className="flex gap-1 items-center">
          <Label className="text-white text-[16px] font-[helvetica] font-semibold">
            Total
          </Label>
          <Label className="text-white text-[16px] font-mono font-semibold">
            {total}
          </Label>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground  mx-auto aspect-square max-h-[250px] pb-0">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie data={chartData} dataKey="value" label></Pie>
            <ChartLegend
              content={<ChartLegendContent config={chartConfig} />}
              className=""
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

type PayLoad = {
  state: string;
  value: number;
};
interface ChartLegendContentProps {
  payload?: {
    value: number;
    name: string;
    color: string;
    payload: PayLoad;
  }[];
  config: Record<string, { label: string }>;
}

export function ChartLegendContent({
  payload = [],
  config,
}: ChartLegendContentProps) {
  const total = payload.reduce((sum, entry) => sum + entry.payload.value, 0);

  return (
    <div className="flex items-center gap-4 text-nowrap text-center text-sm w-full">
      {payload.map((entry, idx) => {
        const percentage = total
          ? ((entry.payload.value / total) * 100).toFixed(0)
          : "0";
        const label = config[entry.payload.state]?.label || entry.name;
        return (
          <div key={idx} className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{label}</span>
            </div>
            <span className="text-muted-foreground text-xs">{percentage}%</span>
          </div>
        );
      })}
    </div>
  );
}
