import { useMemo } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, formatValue } from "@/lib/scale-utils";

export default function ResponsiveBreakpointPreview() {
  const { config } = useAppConfig();

  const breakpointScales = useMemo(() => {
    return config.responsive.breakpoints.map((bp) => ({
      ...bp,
      scale: calculateTypeScale(bp.baseFontSize, bp.scaleRatio, config.rounding),
    }));
  }, [config.responsive.breakpoints, config.rounding]);

  const tokens = breakpointScales[0]?.scale.map((e) => e.token) ?? [];

  return (
    <div className="border-t border-border">
      <div className="border-b border-border px-4 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Responsive Sizes</h3>
      </div>
      <div className="overflow-x-auto px-4 py-2">
        <div className="mb-2 grid gap-2 text-xs" style={{ gridTemplateColumns: `60px repeat(${breakpointScales.length}, 1fr)` }}>
          <span className="font-semibold text-muted-foreground">Token</span>
          {breakpointScales.map((bp) => (
            <span key={bp.label} className="text-right font-semibold text-muted-foreground">
              {bp.label}
            </span>
          ))}
        </div>
        {tokens.map((token, ti) => (
          <div
            key={token}
            className="grid gap-2 border-b border-border py-1.5 text-xs last:border-0"
            style={{ gridTemplateColumns: `60px repeat(${breakpointScales.length}, 1fr)` }}
          >
            <span className="font-semibold uppercase text-muted-foreground">{token}</span>
            {breakpointScales.map((bp) => (
              <span key={bp.label} className="text-right font-mono">
                {formatValue(bp.scale[ti], config.unit)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
