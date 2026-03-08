import { useMemo, useState } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, formatValue, getFontFamilyStack } from "@/lib/scale-utils";
import type { ScaleEntry } from "@/lib/types";
import ExportPanel from "./ExportPanel";
import ScaleGraph from "./ScaleGraph";
import ComparePanel from "./ComparePanel";
import ResponsiveBreakpointPreview from "./ResponsiveBreakpointPreview";
import AccessibilityPanel from "./AccessibilityPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RotateCcw } from "lucide-react";

const DEFAULT_PREVIEW_TEXT = "How vexingly quick daft zebras jump";

function TypeRow({ entry, unit, bodyStyle, headingStyle, isHeading, previewText }: {
  entry: ScaleEntry;
  unit: "rem" | "px" | "pt";
  bodyStyle: React.CSSProperties;
  headingStyle: React.CSSProperties;
  isHeading: boolean;
  previewText: string;
}) {
  const style = isHeading ? headingStyle : bodyStyle;
  return (
    <div
      className="group flex items-baseline gap-3 border-b px-4 py-3 transition-colors hover:bg-accent/60"
      style={{ borderColor: 'hsl(var(--border))' }}
    >
      <div className="w-10 shrink-0">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--muted-foreground))', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {entry.token}
        </span>
      </div>
      <div className="w-14 shrink-0 text-right">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>
          {formatValue(entry, unit)}
        </span>
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="truncate" style={{ fontSize: `${entry.px}px`, color: 'hsl(var(--foreground))', ...style }}>
          {previewText}
        </p>
      </div>
    </div>
  );
}

export default function TypeScalePreview() {
  const { config } = useAppConfig();
  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW_TEXT);
  const scale = useMemo(
    () => calculateTypeScale(config.baseFontSize, config.scaleRatio, config.rounding),
    [config.baseFontSize, config.scaleRatio, config.rounding]
  );

  const bodyStyle: React.CSSProperties = {
    fontFamily: getFontFamilyStack(config.body.fontFamily),
    fontWeight: config.body.fontWeight,
    lineHeight: config.body.lineHeight,
    letterSpacing: `${config.body.letterSpacing}em`,
  };

  const headingStyle: React.CSSProperties = config.headings.inherit
    ? bodyStyle
    : {
        fontFamily: getFontFamilyStack(config.headings.fontFamily),
        fontWeight: config.headings.fontWeight,
        lineHeight: config.headings.lineHeight,
        letterSpacing: `${config.headings.letterSpacing}em`,
      };

  const headingTokens = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

  return (
    <div className="flex h-full flex-col">
      {/* Header with inline preview input */}
      <div className="flex items-center gap-3 border-b px-4 h-10" style={{ borderColor: 'hsl(var(--border))' }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>
          Type Scale
        </h2>
        <div className="flex flex-1 items-center gap-1.5">
          <Input
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="Preview text..."
            className="h-7 flex-1 text-xs"
            style={{ fontFamily: "'DM Mono', monospace" }}
          />
          {previewText !== DEFAULT_PREVIEW_TEXT && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => setPreviewText(DEFAULT_PREVIEW_TEXT)}
              title="Reset to default text"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Type scale rows */}
      <div className="flex-1 overflow-auto">
        {scale.map((entry) => (
          <TypeRow
            key={entry.token}
            entry={entry}
            unit={config.unit}
            bodyStyle={bodyStyle}
            headingStyle={headingStyle}
            isHeading={headingTokens.has(entry.token)}
            previewText={previewText || DEFAULT_PREVIEW_TEXT}
          />
        ))}
      </div>

      {/* Bottom tabbed section */}
      <div className="border-t border-border">
        <Tabs defaultValue="graph" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2 h-8" style={{ borderColor: 'hsl(var(--border))' }}>
            <TabsTrigger value="graph"
              className="h-6 px-3 rounded-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 500 }}>
              Graph
            </TabsTrigger>
            <TabsTrigger value="compare"
              className="h-6 px-3 rounded-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 500 }}>
              Compare & Density
            </TabsTrigger>
            {config.responsive.enabled && (
              <TabsTrigger value="responsive"
                className="h-6 px-3 rounded-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 500 }}>
                Responsive
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="graph" className="m-0 max-h-52 overflow-auto">
            <ScaleGraph />
          </TabsContent>
          <TabsContent value="compare" className="m-0 max-h-52 overflow-auto">
            {config.compare.enabled && <ComparePanel />}
            <AccessibilityPanel />
          </TabsContent>
          {config.responsive.enabled && (
            <TabsContent value="responsive" className="m-0 max-h-52 overflow-auto">
              <ResponsiveBreakpointPreview />
            </TabsContent>
          )}
        </Tabs>
      </div>

      <ExportPanel scale={scale} />
    </div>
  );
}
