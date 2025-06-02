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
  color: string;
}

function buildChartDataAndConfig(
  data?: Record<string, number>,
  color?: string
) {
  const maxCount = Math.max(...Object.values(data ?? 0));
  const minCount = Math.min(...Object.values(data ?? 0));
  const chartData = Object.entries(data ?? 0)
    .map(([cause, count]) => {
      // Normalize count between 0 and 1
      const normalized = (count - minCount) / (maxCount - minCount || 1);

      // Generate color: light to dark blue based on count
      const fill = `hsl(${color}, 100%, ${80 - normalized * 40}%)`; // 80% to 40% lightness

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
              dataKey="cause"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={200}
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
                className="text-white"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
