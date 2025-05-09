"use client";

import { LabelList, Pie, PieChart } from "recharts";

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
const chartData = [
  {
    status: "Yes",
    value: 100,
    fill: "var(--color-Yes) ",
  },
  { status: "No", value: 20, fill: "var(--color-No)" },
];

const chartConfig = {
  value: {
    label: "Value",
  },
  Yes: {
    label: "Yes",
    color: "hsl(var(--chart-1))",
  },
  No: {
    label: "No",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const IssueReccuring = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Reccuring</CardTitle>
        <CardDescription>
          This chart indicates number of issues in which occured more than once
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie data={chartData} dataKey="value">
              <LabelList
                dataKey="status"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
