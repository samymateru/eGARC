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

interface ChartProps {
  title: string;
  description: string;
  data: Record<string, number>;
  colors: Record<string, string>;
}

function buildChartDataAndConfig(
  data: Record<string, number>,
  colors: Record<string, string>
) {
  const chartData = Object.entries(data).map(([cause, count]) => ({
    cause,
    count,
    fill: cause in colors ? colors[cause as keyof typeof colors] : "#cccccc",
  }));

  const chartConfig = Object.fromEntries(
    Object.keys(data).map((cause) => [
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

export function Chart({ title, description, data, colors }: ChartProps) {
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
            margin={{ left: 100, right: 50 }}>
            <YAxis
              dataKey="cause"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
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
                className="text-white"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
