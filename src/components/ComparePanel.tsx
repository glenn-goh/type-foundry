import { useMemo } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, formatValue } from "@/lib/scale-utils";
import { SCALE_RATIOS } from "@/lib/types";

export default function ComparePanel() {
  const { config } = useAppConfig();

  const scaleA = useMemo(
    () => calculateTypeScale(config.baseFontSize, config.scaleRatio, config.rounding, config.steps),
    [config.baseFontSize, config.scaleRatio, config.rounding, config.steps]
  );

  const scaleB = useMemo(
    () => calculateTypeScale(config.baseFontSize, config.compare.scaleRatio, config.rounding, config.steps),
    [config.baseFontSize, config.compare.scaleRatio, config.rounding, config.steps]
  );

  const labelA = SCALE_RATIOS.find((r) => r.value === config.scaleRatio)?.label || String(config.scaleRatio);
  const labelB = SCALE_RATIOS.find((r) => r.value === config.compare.scaleRatio)?.label || String(config.compare.scaleRatio);

  return (
    <div className="border-t border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compare Ratios</h3>
      </div>
      <div className="px-4 py-2">
        <div className="mb-2 grid grid-cols-[60px_1fr_1fr] gap-2 text-xs">
          <span className="font-semibold text-muted-foreground">Token</span>
          <span className="text-right font-semibold text-muted-foreground">{labelA} ({config.scaleRatio})</span>
          <span className="text-right font-semibold text-muted-foreground">{labelB} ({config.compare.scaleRatio})</span>
        </div>
        {scaleA.map((a, i) => {
          const b = scaleB[i];
          const diff = b.px - a.px;
          return (
            <div key={a.token} className="grid grid-cols-[60px_1fr_1fr] gap-2 border-b border-border py-1.5 text-xs last:border-0">
              <span className="font-semibold uppercase text-muted-foreground">{a.token}</span>
              <span className="text-right font-mono">{formatValue(a, config.unit)}</span>
              <div className="flex items-center justify-end gap-1.5">
                <span className="font-mono">{formatValue(b, config.unit)}</span>
                <span className={`text-[10px] ${diff > 0 ? "text-green-600 dark:text-green-400" : diff < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                  {diff > 0 ? "+" : ""}{Math.round(diff * 100) / 100}px
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
