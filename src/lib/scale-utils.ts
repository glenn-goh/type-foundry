import type { ScaleEntry, ScaleToken, Unit } from "./types";

const TOKEN_EXPONENTS: Record<ScaleToken, number> = {
  h1: 6,
  h2: 5,
  h3: 4,
  h4: 3,
  h5: 2,
  h6: 1,
  p: 0,
  small: -1,
  xs: -2,
};

export function calculateTypeScale(base: number, ratio: number): ScaleEntry[] {
  const tokens: ScaleToken[] = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "small", "xs"];
  return tokens.map((token) => {
    const exp = TOKEN_EXPONENTS[token];
    const px = base * Math.pow(ratio, exp);
    return {
      token,
      px,
      rem: px / 16,
      pt: px * 0.75,
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
  const lines = scale.map((e) => `  --font-size-${e.token === "p" ? "body" : e.token}: ${formatValue(e, unit)};`);
  let css = `:root {\n${lines.join("\n")}\n}`;
  if (responsive) {
    const rLines = responsive.scale.map(
      (e) => `    --font-size-${e.token === "p" ? "body" : e.token}: ${formatValue(e, unit)};`
    );
    css += `\n\n@media (min-width: ${responsive.minWidth}px) {\n  :root {\n${rLines.join("\n")}\n  }\n}`;
  }
  return css;
}

export function generateJsonTokens(scale: ScaleEntry[], unit: Unit): string {
  const obj: Record<string, string> = {};
  scale.forEach((e) => {
    obj[e.token === "p" ? "body" : e.token] = formatValue(e, unit);
  });
  return JSON.stringify({ fontSize: obj }, null, 2);
}

export function generateTailwindConfig(scale: ScaleEntry[], unit: Unit): string {
  const lines = scale.map((e) => `  ${e.token === "p" ? "body" : e.token}: "${formatValue(e, unit)}",`);
  return `fontSize: {\n${lines.join("\n")}\n}`;
}

export function generateFigmaTokens(
  scale: ScaleEntry[],
  unit: Unit,
  body: { fontFamily: string; fontWeight: number; lineHeight: number; letterSpacing: number },
  headings: { inherit: boolean; fontFamily: string; fontWeight: number; lineHeight: number; letterSpacing: number }
): string {
  const headingTokens = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
  const tokens: Record<string, Record<string, unknown>> = {};

  scale.forEach((e) => {
    const name = e.token === "p" ? "body" : e.token;
    const isHeading = headingTokens.has(e.token);
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

export function getFontFamilyStack(family: string): string {
  const stacks: Record<string, string> = {
    Inter: "'Inter', system-ui, sans-serif",
    Roboto: "'Roboto', system-ui, sans-serif",
    "Open Sans": "'Open Sans', system-ui, sans-serif",
    "System UI": "system-ui, -apple-system, sans-serif",
    "Helvetica Neue": "'Helvetica Neue', Helvetica, Arial, sans-serif",
    Arial: "Arial, Helvetica, sans-serif",
    Georgia: "Georgia, 'Times New Roman', serif",
  };
  return stacks[family] || "system-ui, sans-serif";
}
