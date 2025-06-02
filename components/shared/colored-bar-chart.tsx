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

  const chartData = keys
    .map((key) => ({
      key,
      count: data?.[key] ?? 0,
      fill: colors?.[key] ?? "#999999",
    }))
    .sort((a, b) => b.count - a.count);

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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px]  w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 50 }}>
            <YAxis
              dataKey="key"
              type="category"
              className="text-nowrap text-white"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={250}
              tickFormatter={formatLabel}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={5} isAnimationActive={true}>
              <LabelList
                dataKey="count"
                position="right"
                className="text-white font-semibold text-[14px]"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
