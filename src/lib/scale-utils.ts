import type { BreakpointConfig, RoundingGrid, ScaleEntry, ScaleStep, Unit } from "./types";
import { DEFAULT_STEPS } from "./types";

function applyRounding(px: number, rounding: RoundingGrid): number {
  if (rounding === "none") return Math.round(px * 100) / 100;
  const grid = rounding === "4px" ? 4 : 8;
  return Math.max(grid, Math.round(px / grid) * grid);
}

export function calculateTypeScale(
  base: number,
  ratio: number,
  rounding: RoundingGrid = "none",
  steps: ScaleStep[] = DEFAULT_STEPS
): ScaleEntry[] {
  const baseIndex = steps.findIndex((s) => s.isBase);
  const pivot = baseIndex === -1 ? Math.floor(steps.length / 2) : baseIndex;
  return steps.map((step, i) => {
    const exp = pivot - i;
    const rawPx = base * Math.pow(ratio, exp);
    const px = applyRounding(rawPx, rounding);
    return {
      token: step.label,
      id: step.id,
      px,
      rem: px / 16,
      pt: px * 0.75,
      exponent: exp,
    };
  });
}

export function formatValue(entry: ScaleEntry, unit: Unit): string {
  switch (unit) {
    case "rem": {
      const v = Math.round(entry.rem * 1000) / 1000;
      return `${v}rem`;
    }
    case "px": {
      const v = Math.round(entry.px * 100) / 100;
      return `${v}px`;
    }
    case "pt": {
      const v = Math.round(entry.pt * 100) / 100;
      return `${v}pt`;
    }
  }
}

export function generateCssVariables(
  scale: ScaleEntry[],
  unit: Unit,
  responsive?: { scale: ScaleEntry[]; minWidth: number }
): string {
  const lines = scale.map((e) => `  --font-size-${e.id}: ${formatValue(e, unit)};`);
  let css = `:root {\n${lines.join("\n")}\n}`;
  if (responsive) {
    const rLines = responsive.scale.map(
      (e) => `    --font-size-${e.id}: ${formatValue(e, unit)};`
    );
    css += `\n\n@media (min-width: ${responsive.minWidth}px) {\n  :root {\n${rLines.join("\n")}\n  }\n}`;
  }
  return css;
}

export function generateResponsiveCss(
  breakpoints: BreakpointConfig[],
  unit: Unit,
  rounding: RoundingGrid
): string {
  const sorted = [...breakpoints].sort((a, b) => a.minWidth - b.minWidth);
  let css = "";

  sorted.forEach((bp, i) => {
    const scale = calculateTypeScale(bp.baseFontSize, bp.scaleRatio, rounding);
    const lines = scale.map(
      (e) => `  --font-size-${e.id}: ${formatValue(e, unit)};`
    );

    if (i === 0) {
      css += `/* ${bp.label} */\n:root {\n${lines.join("\n")}\n}`;
    } else {
      const indented = lines.map((l) => `  ${l}`);
      css += `\n\n/* ${bp.label} */\n@media (min-width: ${bp.minWidth}px) {\n  :root {\n${indented.join("\n")}\n  }\n}`;
    }
  });

  return css;
}

export function generateJsonTokens(scale: ScaleEntry[], unit: Unit): string {
  const obj: Record<string, string> = {};
  scale.forEach((e) => {
    obj[e.id] = formatValue(e, unit);
  });
  return JSON.stringify({ fontSize: obj }, null, 2);
}

export function generateTailwindConfig(scale: ScaleEntry[], unit: Unit): string {
  const lines = scale.map((e) => `  ${e.id}: "${formatValue(e, unit)}",`);
  return `fontSize: {\n${lines.join("\n")}\n}`;
}

export function generateFigmaTokens(
  scale: ScaleEntry[],
  unit: Unit,
  body: { fontFamily: string; fontWeight: number; lineHeight: number; letterSpacing: number },
  headings: { inherit: boolean; fontFamily: string; fontWeight: number; lineHeight: number; letterSpacing: number }
): string {
  const tokens: Record<string, Record<string, unknown>> = {};

  scale.forEach((e) => {
    const name = e.id;
    const isHeading = e.exponent > 0;
    const settings = isHeading && !headings.inherit ? headings : body;

    tokens[name] = {
      value: {
        fontFamily: settings.fontFamily,
        fontWeight: String(settings.fontWeight),
        lineHeight: String(settings.lineHeight),
        fontSize: formatValue(e, unit),
        letterSpacing: `${settings.letterSpacing}em`,
        paragraphSpacing: "0",
        textDecoration: "none",
        textCase: "none",
      },
      type: "typography",
    };
  });

  const output = {
    "type-scale": tokens,
  };

  return JSON.stringify(output, null, 2);
}

const SYSTEM_FONT_STACKS: Record<string, string> = {
  Inter: "'Inter', system-ui, sans-serif",
  Roboto: "'Roboto', system-ui, sans-serif",
  "Open Sans": "'Open Sans', system-ui, sans-serif",
  "System UI": "system-ui, -apple-system, sans-serif",
  "Helvetica Neue": "'Helvetica Neue', Helvetica, Arial, sans-serif",
  Arial: "Arial, Helvetica, sans-serif",
  Georgia: "Georgia, 'Times New Roman', serif",
};

const SERIF_FONTS = new Set([
  "Georgia", "Crimson Text", "DM Serif Display", "Libre Baskerville",
  "Lora", "Merriweather", "Noto Serif", "Playfair Display", "Source Serif 4", "Bitter",
]);

const MONO_FONTS = new Set([
  "Inconsolata", "JetBrains Mono", "Source Code Pro", "Space Mono",
]);

export function getFontFamilyStack(family: string): string {
  if (SYSTEM_FONT_STACKS[family]) return SYSTEM_FONT_STACKS[family];
  const fallback = MONO_FONTS.has(family) ? "monospace" : SERIF_FONTS.has(family) ? "serif" : "sans-serif";
  return `'${family}', ${fallback}`;
}

// Track loaded Google Fonts to avoid duplicate link elements
const loadedGoogleFonts = new Set<string>();

export function loadGoogleFont(family: string): void {
  if (loadedGoogleFonts.has(family)) return;
  if (SYSTEM_FONT_STACKS[family]) return; // system font, no need to load
  loadedGoogleFonts.add(family);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

export function getScaleDensity(ratio: number): { label: string; description: string } {
  if (ratio <= 1.1) return { label: "Tight", description: "Compact spacing, ideal for data-dense interfaces" };
  if (ratio <= 1.2) return { label: "Balanced", description: "Versatile spacing for general use" };
  if (ratio <= 1.35) return { label: "Expressive", description: "Clear hierarchy for marketing & editorial" };
  return { label: "Dramatic", description: "Strong visual contrast between sizes" };
}

export function getAccessibilityWarnings(config: { baseFontSize: number; body: { lineHeight: number } }): string[] {
  const warnings: string[] = [];
  if (config.baseFontSize < 14) {
    warnings.push("Body size below 14px may harm readability. Recommended minimum: 16px.");
  } else if (config.baseFontSize < 16) {
    warnings.push("Body size below 16px may reduce readability for some users.");
  }
  if (config.body.lineHeight < 1.4) {
    warnings.push("Line height below 1.4 can reduce readability for body text.");
  }
  return warnings;
}

export function configToUrlParams(config: AppConfig): string {
  const params = new URLSearchParams();
  params.set("base", String(config.baseFontSize));
  params.set("scale", String(config.scaleRatio));
  params.set("unit", config.unit);
  params.set("font", config.body.fontFamily);
  if (config.rounding !== "none") params.set("round", config.rounding);
  return params.toString();
}

export function urlParamsToConfig(search: string): Partial<AppConfig> | null {
  const params = new URLSearchParams(search);
  const partial: Partial<AppConfig> = {};
  let hasAny = false;

  const base = params.get("base");
  if (base) { partial.baseFontSize = Number(base); hasAny = true; }

  const scale = params.get("scale");
  if (scale) { partial.scaleRatio = Number(scale); hasAny = true; }

  const unit = params.get("unit");
  if (unit && ["rem", "px", "pt"].includes(unit)) { partial.unit = unit as Unit; hasAny = true; }

  const round = params.get("round");
  if (round && ["4px", "8px"].includes(round)) { partial.rounding = round as RoundingGrid; hasAny = true; }

  return hasAny ? partial : null;
}

// Re-export for URL param helpers
import type { AppConfig } from "./types";
