export type Unit = "rem" | "px" | "pt";

export type ScaleToken = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small" | "xs";

export type RoundingGrid = "none" | "4px" | "8px";

export type PreviewMode = "marketing" | "article" | "product" | "blog" | "ecommerce" | "documentation" | "portfolio";

export const PREVIEW_MODES: { value: PreviewMode; label: string }[] = [
  { value: "marketing", label: "Marketing Page" },
  { value: "article", label: "Article" },
  { value: "product", label: "Product UI" },
  { value: "blog", label: "Blog Feed" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "documentation", label: "Documentation" },
  { value: "portfolio", label: "Portfolio" },
];

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

export interface BreakpointConfig {
  label: string;
  minWidth: number;
  baseFontSize: number;
  scaleRatio: number;
}

export interface ResponsiveSettings {
  enabled: boolean;
  /** @deprecated use breakpoints instead */
  minWidth: number;
  /** @deprecated */
  baseFontSize: number | null;
  /** @deprecated */
  inheritRatio: boolean;
  /** @deprecated */
  scaleRatio: number | null;
  breakpoints: BreakpointConfig[];
}

export interface CompareSettings {
  enabled: boolean;
  scaleRatio: number;
}

export interface SavedSystem {
  id: string;
  name: string;
  config: Omit<AppConfig, "theme">;
  createdAt: number;
}

export interface AppConfig {
  baseFontSize: number;
  scaleRatio: number;
  unit: Unit;
  rounding: RoundingGrid;
  previewMode: PreviewMode;
  body: BodySettings;
  headings: HeadingSettings;
  responsive: ResponsiveSettings;
  compare: CompareSettings;
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

export const PRESETS: Record<string, { label: string; description: string; config: Partial<AppConfig> }> = {
  editorial: {
    label: "Editorial",
    description: "Dramatic scale for long-form reading",
    config: {
      baseFontSize: 20,
      scaleRatio: 1.414,
      body: { fontFamily: "Georgia", fontWeight: 400, lineHeight: 1.7, letterSpacing: 0, textColor: "#1a1a1a", backgroundColor: "#FAFAF8" },
      headings: { inherit: false, fontFamily: "Georgia", fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.03, color: "#111111" },
    },
  },
  productUI: {
    label: "Product UI",
    description: "Tight scale for app interfaces",
    config: {
      baseFontSize: 14,
      scaleRatio: 1.2,
      body: { fontFamily: "Inter", fontWeight: 400, lineHeight: 1.5, letterSpacing: 0, textColor: "#374151", backgroundColor: "#FFFFFF" },
      headings: { inherit: false, fontFamily: "Inter", fontWeight: 600, lineHeight: 1.2, letterSpacing: -0.01, color: "#111827" },
    },
  },
  marketing: {
    label: "Marketing",
    description: "Bold scale for landing pages",
    config: {
      baseFontSize: 18,
      scaleRatio: 1.333,
      body: { fontFamily: "Inter", fontWeight: 400, lineHeight: 1.6, letterSpacing: 0, textColor: "#1f2937", backgroundColor: "#FFFFFF" },
      headings: { inherit: false, fontFamily: "Inter", fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.025, color: "#0f172a" },
    },
  },
  denseDashboard: {
    label: "Dense Dashboard",
    description: "Compact scale for data-heavy UIs",
    config: {
      baseFontSize: 13,
      scaleRatio: 1.125,
      body: { fontFamily: "Inter", fontWeight: 400, lineHeight: 1.4, letterSpacing: 0.01, textColor: "#4b5563", backgroundColor: "#FFFFFF" },
      headings: { inherit: false, fontFamily: "Inter", fontWeight: 600, lineHeight: 1.2, letterSpacing: 0, color: "#1f2937" },
    },
  },
  readableBlog: {
    label: "Readable Blog",
    description: "Optimized for comfortable reading",
    config: {
      baseFontSize: 19,
      scaleRatio: 1.25,
      body: { fontFamily: "Open Sans", fontWeight: 400, lineHeight: 1.75, letterSpacing: 0, textColor: "#333333", backgroundColor: "#FEFEFE" },
      headings: { inherit: false, fontFamily: "Inter", fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.02, color: "#1a1a1a" },
    },
  },
};

export const DEFAULT_CONFIG: AppConfig = {
  baseFontSize: 16,
  scaleRatio: 1.2,
  unit: "rem",
  rounding: "none",
  previewMode: "marketing",
  body: {
    fontFamily: "Inter",
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: 0,
    textColor: "#222222",
    backgroundColor: "#FFFFFF",
  },
  headings: {
    inherit: false,
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
    breakpoints: [
      { label: "Mobile", minWidth: 0, baseFontSize: 14, scaleRatio: 1.2 },
      { label: "Tablet", minWidth: 768, baseFontSize: 16, scaleRatio: 1.25 },
      { label: "Desktop", minWidth: 1024, baseFontSize: 18, scaleRatio: 1.333 },
    ],
  },
  compare: {
    enabled: false,
    scaleRatio: 1.333,
  },
  theme: "light",
};
