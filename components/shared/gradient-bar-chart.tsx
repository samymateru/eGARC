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

//import { formatLabel } from "@/lib/utils";

interface ChartProps {
  title: string;
  description: string;
  data?: Record<string, number>;
  color: string;
}

function buildChartDataAndConfig(
  data?: Record<string, number>,
  color?: string
) {
  const chartData = Object.entries(data ?? 0)
    .map(([cause, count]) => {
      const fill = color;

      return { cause, count, fill };
    })
    .sort((a, b) => a.count - b.count);

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

export function GradientBarChart({
  title,
  description,
  data,
  color,
}: ChartProps) {
  const { chartData, chartConfig } = buildChartDataAndConfig(data, color);

  return (
    <Card className="flex-1 border-none bg-neutral-100 pb-3">
      <CardHeader className="">
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
            margin={{ left: 50, right: 0 }}>
            <YAxis dataKey="count" type="category" hide />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              radius={5}
              isAnimationActive={true}
              barSize={45}>
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
                dataKey="cause"
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
                      fontFamily="Helvetica"
                      fontWeight={700}
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
