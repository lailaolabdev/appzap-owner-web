"use client";

import React, { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/Chart";
import { cn } from "../../utils/cn";

export function DonutChart({ chartConfig, chartData, className, ...props }) {
  const totalVisitors = useMemo(() => {
    return chartData.length;
  }, []);

  return (
    <Card className={cn("flex flex-col overflow-hidden", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl">ລາຍງານສາຂາ</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="flex-1 p-0 max-w-[460px] mx-auto"
        >
          <PieChart className="">
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="income"
              nameKey="branch"
              innerRadius={64}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-lg font-bold"
                        >
                          ສາຂາ
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
      <CardFooter className="w-full">
        <div className="border mx-4 px-4 py-3 w-full rounded-xl relative">
          {chartData.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              <h3 className="text-lg font-bold sticky top-0 z-10 pb-2 bg-white text-center">
                ລາຍການສາຂາ
              </h3>
              <div className="flex flex-col gap-2">
                {chartData.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn("w-4 h-4 rounded-full")}
                        style={{
                          backgroundColor: `hsl(var(--chart-${
                            (index % 9) + 1
                          }))`,
                        }}
                      />
                      <div>{data.branch}</div>
                    </div>
                    <div className="font-medium">
                      {data.income.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
