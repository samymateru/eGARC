"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatLabel } from "@/lib/utils";

interface ChartProps {
  title: string;
  description: string;
  data?: Record<string, number>;
  colors?: Record<string, string>;
  labels?: Record<string, string>;
}

function buildChartDataAndConfig(
  data?: Record<string, number>,
  colors?: Record<string, string>
): {
  chartData: Array<{
    key: string;
    count: number;
    fill: string;
  }>;
  chartConfig: Record<string, { label: string }>;
} {
  const keys = Object.keys(colors ?? {});

  const chartData = keys.map((key) => ({
    key,
    count: data?.[key] ?? 0,
    fill: colors?.[key] ?? "#999999",
  }));

  const chartConfig = Object.fromEntries(
    Object.keys(data ?? {}).map((cause) => [
      cause,
      {
        label: cause,
      },
    ])
  ) satisfies ChartConfig;

  chartConfig["count"] = {
    label: "Count",
  };
  return { chartData, chartConfig };
}

export function ColoredBarChart({
  title,
  description,
  data,
  colors,
}: ChartProps) {
  const { chartData, chartConfig } = buildChartDataAndConfig(data, colors);

  return (
    <Card className="flex-1 border-none">
      <CardHeader>
        <CardTitle className="font-[helvetica] font-semibold text-[22px] tracking-wide">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="py-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px]  w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            barSize={40}
            margin={{ left: 50, right: 50 }}>
            <YAxis dataKey="key" type="category" hide />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={5} isAnimationActive={true}>
              <LabelList
                dataKey="count"
                position="left"
                content={({ x, y, value, height }) => {
                  const dy = typeof height === "number" ? height / 2 + 4 : 0;
                  return (
                    <text
                      x={x != null ? Number(x) + -40 : 0}
                      y={y}
                      dy={dy}
                      fill="white"
                      fontWeight="bold"
                      fontSize={12}>
                      {value}
                    </text>
                  );
                }}
              />
              <LabelList
                dataKey="key"
                position="insideLeft"
                content={({ x, y, value, height }) => {
                  const dy = typeof height === "number" ? height / 2 + 4 : 0;
                  return (
                    <text
                      x={x != null ? Number(x) + 10 : 0}
                      y={y}
                      dy={dy}
                      fill="white"
                      strokeWidth={200}
                      fontWeight={900}
                      fontSize={12}>
                      {formatLabel(String(value))}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
