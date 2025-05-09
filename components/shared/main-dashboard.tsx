"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

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
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

const chartDat = [
  { status: "Not started", value: 275, fill: "var(--color-not_started)" },
  { status: "In progress", value: 200, fill: "var(--color-in_progress)" },
  { status: "Completed", value: 287, fill: "var(--color-completed)" },
];

const chartConfi = {
  value: {
    label: "Visitors",
  },
  not_started: {
    label: "Not started",
    color: "hsl(var(--chart-1))",
  },
  in_progress: {
    label: "In progress",
    color: "hsl(var(--chart-2))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const chartData = [
  {
    year: "2024",
    not_started: 76,
    in_progress: 300,
    completed: 200,
  },
  { year: "2023", not_started: 70, in_progress: 159, completed: 120 },
  { year: "2022", not_started: 70, in_progress: 159, completed: 120 },
  { year: "2021", not_started: 76, in_progress: 300, completed: 200 },
  { year: "2020", not_started: 70, in_progress: 159, completed: 120 },
  { year: "2019", not_started: 70, in_progress: 159, completed: 120 },
];

const chartConfig = {
  not_started: {
    label: "Not started",
    color: "hsl(var(--chart-1))",
  },
  in_progress: {
    label: "In progress",
    color: "hsl(var(--chart-2))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-3))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export const MainDashboard = () => {
  const totalVisitors = useMemo(() => {
    return chartDat.reduce((acc, curr) => acc + curr.value, 0);
  }, []);
  return (
    <section>
      <h1 className="text-center font-serif font-extrabold text-[25px] tracking-wide scroll-m-0">
        Entity Annual Audit Plans Analyis
      </h1>
      <section className="flex w-full flex-row-reverse">
        <Card className="w-[calc(50%+150px)] border-none">
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent className="">
            <ChartContainer
              config={chartConfig}
              className="max-h-[380px] min-h-[300px]">
              <BarChart
                accessibilityLayer
                data={chartData}
                onClick={(e) => console.log(e)}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      className="w-[180px]"
                      formatter={(value, name, item, index) => (
                        <>
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                            style={
                              {
                                "--color-bg": `var(--color-${name})`,
                              } as React.CSSProperties
                            }
                          />
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {value}
                            <span className="font-normal text-muted-foreground pl-2">
                              {(
                                (parseInt(value.toLocaleString()) /
                                  (item.payload.completed +
                                    item.payload.in_progress +
                                    item.payload.not_started)) *
                                100
                              ).toFixed(0)}
                              %
                            </span>
                          </div>
                          {index === 2 && (
                            <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                              Total
                              <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                {item.payload.completed +
                                  item.payload.in_progress +
                                  item.payload.not_started}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="not_started"
                  stackId="a"
                  fill="var(--color-not_started)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="in_progress"
                  stackId="b"
                  fill="var(--color-in_progress)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  stackId="c"
                  fill="var(--color-completed)"
                  radius={[4, 0, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col flex-1 border-none">
          <CardHeader className="items-center pb-0">
            <CardTitle className="font-serif tracking-wide scroll-m-0 text-[24px] font-bold"></CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent className="flex-1 pt-16">
            <ChartContainer
              config={chartConfi}
              className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      hideLabel
                      formatter={(value, name) => (
                        <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {value}

                            <span className="font-normal text-muted-foreground pl-2">
                              {(
                                (parseInt(value.toString()) / totalVisitors) *
                                100
                              ).toFixed(0)}
                            </span>
                            <span className="font-normal text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={chartDat}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={65}
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
                              Audit Plans
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
    </section>
  );
};
