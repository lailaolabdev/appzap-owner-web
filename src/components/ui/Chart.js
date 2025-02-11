"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "../../utils/cn";

const THEMES = { light: "", dark: ".dark" };

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = React.forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          data-chart={chartId}
          ref={ref}
          className={cn("flex aspect-video justify-center text-xs", className)}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );
  if (!colorConfig.length) {
    return null;
  }
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border bg-white px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className="flex w-full flex-wrap items-stretch gap-2"
              >
                <div className="flex flex-1 justify-between leading-none">
                  <span className="text-muted-foreground">{item.name}</span>
                  {item.value && (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          return (
            <div key={item.value} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
              {item.value}
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegend";

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
