export type Unit = "rem" | "px" | "pt";

export type ScaleToken = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small" | "xs";

export interface ScaleEntry {
  token: ScaleToken;
  px: number;
  rem: number;
  pt: number;
}

export interface BodySettings {
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  textColor: string;
  backgroundColor: string;
}

export interface HeadingSettings {
  inherit: boolean;
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
}

export interface ResponsiveSettings {
  enabled: boolean;
  minWidth: number;
  baseFontSize: number | null;
  inheritRatio: boolean;
  scaleRatio: number | null;
}

export type RoundingGrid = "none" | "4px" | "8px";

export interface AppConfig {
  baseFontSize: number;
  scaleRatio: number;
  unit: Unit;
  rounding: RoundingGrid;
  body: BodySettings;
  headings: HeadingSettings;
  responsive: ResponsiveSettings;
  theme: "light" | "dark";
}

export const SCALE_RATIOS = [
  { label: "Minor Second", value: 1.067 },
  { label: "Major Second", value: 1.125 },
  { label: "Minor Third", value: 1.2 },
  { label: "Major Third", value: 1.25 },
  { label: "Perfect Fourth", value: 1.333 },
  { label: "Augmented Fourth", value: 1.414 },
  { label: "Perfect Fifth", value: 1.5 },
  { label: "Golden Ratio", value: 1.618 },
] as const;

export const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Open Sans",
  "System UI",
  "Helvetica Neue",
  "Arial",
  "Georgia",
] as const;

export const DEFAULT_CONFIG: AppConfig = {
  baseFontSize: 16,
  scaleRatio: 1.2,
  unit: "rem",
  rounding: "none",
  body: {
    fontFamily: "Inter",
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: 0,
    textColor: "#222222",
    backgroundColor: "#FFFFFF",
  },
  headings: {
    inherit: true,
    fontFamily: "Inter",
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: -0.02,
    color: "#222222",
  },
  responsive: {
    enabled: false,
    minWidth: 768,
    baseFontSize: null,
    inheritRatio: true,
    scaleRatio: null,
  },
  theme: "light",
};
