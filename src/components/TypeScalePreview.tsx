import { useMemo } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, formatValue, getFontFamilyStack } from "@/lib/scale-utils";
import type { ScaleEntry } from "@/lib/types";
import ExportPanel from "./ExportPanel";
import ScaleGraph from "./ScaleGraph";
import ComparePanel from "./ComparePanel";
import ResponsiveBreakpointPreview from "./ResponsiveBreakpointPreview";
import AccessibilityPanel from "./AccessibilityPanel";

const PREVIEW_TEXT = "How vexingly quick daft zebras jump";

function TypeRow({ entry, unit, bodyStyle, headingStyle, isHeading }: {
  entry: ScaleEntry;
  unit: "rem" | "px" | "pt";
  bodyStyle: React.CSSProperties;
  headingStyle: React.CSSProperties;
  isHeading: boolean;
}) {
  const style = isHeading ? headingStyle : bodyStyle;
  return (
    <div className="group flex items-baseline gap-3 border-b border-border px-4 py-2.5 transition-colors hover:bg-accent/50">
      <div className="w-10 shrink-0">
        <span className="text-[10px] font-semibold uppercase text-muted-foreground">{entry.token}</span>
      </div>
      <div className="w-16 shrink-0 text-right">
        <span className="font-mono text-[10px] text-muted-foreground">{formatValue(entry, unit)}</span>
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="truncate" style={{ fontSize: `${entry.px}px`, ...style }}>
          {PREVIEW_TEXT}
        </p>
      </div>
    </div>
  );
}

export default function TypeScalePreview() {
  const { config } = useAppConfig();
  const scale = useMemo(
    () => calculateTypeScale(config.baseFontSize, config.scaleRatio, config.rounding),
    [config.baseFontSize, config.scaleRatio, config.rounding]
  );

  const bodyStyle: React.CSSProperties = {
    fontFamily: getFontFamilyStack(config.body.fontFamily),
    fontWeight: config.body.fontWeight,
    lineHeight: config.body.lineHeight,
    letterSpacing: `${config.body.letterSpacing}em`,
    color: config.body.textColor,
  };

  const headingStyle: React.CSSProperties = config.headings.inherit
    ? bodyStyle
    : {
        fontFamily: getFontFamilyStack(config.headings.fontFamily),
        fontWeight: config.headings.fontWeight,
        lineHeight: config.headings.lineHeight,
        letterSpacing: `${config.headings.letterSpacing}em`,
        color: config.headings.color,
      };

  const headingTokens = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-xs font-semibold text-foreground">Type Scale</h2>
        <span className="text-[10px] text-muted-foreground">
          {config.baseFontSize}px · {config.scaleRatio}
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        {scale.map((entry) => (
          <TypeRow
            key={entry.token}
            entry={entry}
            unit={config.unit}
            bodyStyle={bodyStyle}
            headingStyle={headingStyle}
            isHeading={headingTokens.has(entry.token)}
          />
        ))}
        <ScaleGraph />
        {config.compare.enabled && <ComparePanel />}
        {config.responsive.enabled && <ResponsiveBreakpointPreview />}
        <AccessibilityPanel />
      </div>
      <ExportPanel scale={scale} />
    </div>
  );
}
