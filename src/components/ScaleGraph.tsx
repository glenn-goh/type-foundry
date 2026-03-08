import { useMemo } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale } from "@/lib/scale-utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ScaleEntry } from "@/lib/types";

export default function ScaleGraph() {
  const { config } = useAppConfig();

  const scale = useMemo(
    () => calculateTypeScale(config.baseFontSize, config.scaleRatio, config.rounding),
    [config.baseFontSize, config.scaleRatio, config.rounding]
  );

  const compareScale = useMemo(() => {
    if (!config.compare.enabled) return null;
    return calculateTypeScale(config.baseFontSize, config.compare.scaleRatio, config.rounding);
  }, [config.baseFontSize, config.compare, config.rounding]);

  const data = useMemo(() => {
    return [...scale].reverse().map((entry, i) => {
      const base: Record<string, unknown> = {
        token: entry.token.toUpperCase(),
        size: Math.round(entry.px * 100) / 100,
      };
      if (compareScale) {
        const ce = [...compareScale].reverse()[i];
        base.compareSize = Math.round(ce.px * 100) / 100;
      }
      return base;
    });
  }, [scale, compareScale]);

  const maxSize = Math.max(...data.map((d) => Math.max(d.size as number, (d.compareSize as number) || 0)));

  return (
    <div className="border-t border-border px-4 py-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scale Graph</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 8 }}>
            <XAxis type="number" domain={[0, Math.ceil(maxSize)]} hide />
            <YAxis
              type="category"
              dataKey="token"
              width={40}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: 12,
                color: "hsl(var(--popover-foreground))",
                padding: "6px 10px",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))" }}
              itemStyle={{ color: "hsl(var(--popover-foreground))" }}
              formatter={(value: number, name: string) => [
                `${value}px`,
                name === "size" ? "Current" : "Compare",
              ]}
            />
            <Bar dataKey="size" radius={[0, 3, 3, 0]} maxBarSize={16}>
              {data.map((_, index) => (
                <Cell key={index} fill="hsl(var(--primary))" opacity={0.7 + (index / data.length) * 0.3} />
              ))}
            </Bar>
            {compareScale && (
              <Bar dataKey="compareSize" radius={[0, 3, 3, 0]} maxBarSize={12} fill="hsl(var(--destructive))" opacity={0.5} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
