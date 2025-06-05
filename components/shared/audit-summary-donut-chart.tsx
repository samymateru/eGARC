"use client";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useMemo, useState } from "react";

const colorMap = {
  completed: "#15803d",
  ongoing: "#b45309",
  pending: "#dc2626",
};

export type AuditSummary = {
  completed?: number;
  ongoing?: number;
  pending?: number;
};

interface AuditSummaryDonutChartProps {
  data?: AuditSummary;
}

const chartConfig = {
  value: {
    label: "Audits",
  },
  pending: {
    label: "Pending",
  },
  ongoing: {
    label: "Ongoing",
  },
  completed: {
    label: "Completed",
  },
} satisfies ChartConfig;

export function AuditSummaryDonutChart({ data }: AuditSummaryDonutChartProps) {
  const [chartData, setChartData] = useState<
    { state: string; value: number; fill: string }[]
  >([]);

  const totalVisitors = useMemo(() => {
    return chartData?.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  useEffect(() => {
    const chartData = Object.entries(data ?? {})
      .filter(([key]) => key !== "total")
      .map(([state, value]) => ({
        state,
        value: Number(value),
        fill: colorMap[state as keyof typeof colorMap] || "#6b7280",
      }));
    setChartData(chartData);
  }, [data]);

  return (
    <Card className="flex flex-col border-none flex-1">
      <CardHeader className="items-center pb-3">
        <CardTitle className="font-[helvetica] font-semibold text-[22px] tracking-wide">
          Audit Plans Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 py-1">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              label
              data={chartData}
              dataKey="value"
              nameKey="state"
              innerRadius={60}
              strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground">
                          Audits
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
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
