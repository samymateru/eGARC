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
    <Card className="flex-1 border-none h-full bg-inherit">
      <CardHeader className="pt-3 px-3 pb-2">
        <CardTitle className="font-helvetica-medium">{title}</CardTitle>
        <CardDescription className="font-helvetica-13 text-neutral-700">
          {description}
        </CardDescription>
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
                      fill="black"
                      fontWeight="700"
                      fontFamily="Helvetica"
                      fontSize={13}>
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
                      fill="black"
                      strokeWidth={200}
                      fontWeight={700}
                      fontFamily="Helvetica"
                      fontSize={13}>
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
