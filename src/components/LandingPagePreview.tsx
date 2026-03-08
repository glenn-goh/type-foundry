import { useMemo } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, getFontFamilyStack } from "@/lib/scale-utils";
import { Button } from "@/components/ui/button";

export default function LandingPagePreview() {
  const { config, updateConfig } = useAppConfig();
  const scale = useMemo(
    () => calculateTypeScale(config.baseFontSize, config.scaleRatio, config.rounding),
    [config.baseFontSize, config.scaleRatio, config.rounding]
  );

  const sizeMap = Object.fromEntries(scale.map((e) => [e.token, e.px]));

  const bodyFont = getFontFamilyStack(config.body.fontFamily);
  const headingFont = config.headings.inherit ? bodyFont : getFontFamilyStack(config.headings.fontFamily);
  const headingWeight = config.headings.inherit ? config.body.fontWeight : config.headings.fontWeight;
  const headingLH = config.headings.inherit ? config.body.lineHeight : config.headings.lineHeight;
  const headingLS = config.headings.inherit ? config.body.letterSpacing : config.headings.letterSpacing;
  const headingColor = config.headings.inherit ? config.body.textColor : config.headings.color;

  const hStyle = (token: string): React.CSSProperties => ({
    fontSize: `${sizeMap[token]}px`,
    fontFamily: headingFont,
    fontWeight: headingWeight,
    lineHeight: headingLH,
    letterSpacing: `${headingLS}em`,
    color: headingColor,
  });

  const baseStyle: React.CSSProperties = {
    backgroundColor: config.body.backgroundColor,
    color: config.body.textColor,
    fontFamily: bodyFont,
    fontWeight: config.body.fontWeight,
    lineHeight: config.body.lineHeight,
    letterSpacing: `${config.body.letterSpacing}em`,
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Preview Mode Switcher */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-semibold text-foreground">Live Preview</span>
        <div className="flex gap-1">
          {([["marketing", "Marketing"], ["article", "Article"], ["product", "Product UI"]] as const).map(([v, l]) => (
            <Button key={v} variant={config.previewMode === v ? "default" : "outline"} size="sm"
              className="h-6 text-[10px] px-2.5" onClick={() => updateConfig({ previewMode: v as "marketing" | "article" | "product" })}>
              {l}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto" style={baseStyle}>
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b px-6 py-3" style={{ borderColor: `${config.body.textColor}15` }}>
        <span style={{ fontSize: `${sizeMap.h5}px`, fontFamily: headingFont, fontWeight: headingWeight, color: headingColor }}>
          Archway
        </span>
        <div className="hidden md:flex items-center gap-5">
          {["Overview", "Solutions", "Resources", "Docs", "Blog"].map((item) => (
            <span key={item} style={{ fontSize: `${sizeMap.small}px` }} className="cursor-pointer opacity-70 transition-opacity hover:opacity-100">
              {item}
            </span>
          ))}
        </div>
      </nav>

      {/* Content by preview mode */}
      {config.previewMode === "marketing" && (
        <div className="flex flex-1 items-center px-6 py-12 md:px-12">
          <div className="max-w-xl space-y-6">
            <h1 style={hStyle("h1")}>Ship faster with tools that scale</h1>
            <p style={{ fontSize: `${sizeMap.p}px` }} className="opacity-75">
              From prototype to production in minutes. Archway gives your team the infrastructure to build, deploy, and iterate without limits.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-lg px-5 py-2.5 font-medium transition-opacity hover:opacity-90"
                style={{ fontSize: `${sizeMap.small}px`, backgroundColor: config.body.textColor, color: config.body.backgroundColor }}>
                Start building
              </button>
              <button className="rounded-lg border px-5 py-2.5 font-medium transition-opacity hover:opacity-80"
                style={{ fontSize: `${sizeMap.small}px`, borderColor: `${config.body.textColor}30` }}>
                View docs
              </button>
            </div>
            <p style={{ fontSize: `${sizeMap.xs}px` }} className="opacity-50">Free tier available · No setup needed</p>
          </div>
          <div className="ml-auto hidden lg:block">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <rect x="30" y="30" width="140" height="140" rx="16" stroke={`${config.body.textColor}15`} strokeWidth="1" />
              <rect x="55" y="55" width="90" height="90" rx="10" stroke={`${config.body.textColor}10`} strokeWidth="1" />
              <rect x="80" y="80" width="40" height="40" rx="6" stroke={`${config.body.textColor}08`} strokeWidth="1" />
            </svg>
          </div>
        </div>
      )}

      {config.previewMode === "article" && (
        <article className="mx-auto max-w-2xl px-6 py-10 space-y-6">
          <h1 style={hStyle("h1")}>The Evolution of Typography in Digital Design</h1>
          <p style={{ fontSize: `${sizeMap.h6}px` }} className="opacity-60">
            How modern type systems shape the way we read and interact with digital products.
          </p>
          <hr style={{ borderColor: `${config.body.textColor}15` }} />
          <p style={{ fontSize: `${sizeMap.p}px` }}>
            Typography is the backbone of any well-crafted interface. It establishes hierarchy, guides the reader's eye, and communicates tone before a single word is consciously read. In the era of design systems, getting typography right means creating a scalable, consistent set of decisions.
          </p>
          <h2 style={hStyle("h2")}>Building a Type Scale</h2>
          <p style={{ fontSize: `${sizeMap.p}px` }}>
            A modular scale provides a predictable set of font sizes derived from a base value and a ratio. This mathematical relationship ensures visual harmony across an interface while maintaining clear distinction between levels of hierarchy.
          </p>
          <blockquote className="border-l-2 pl-4 italic opacity-70" style={{ borderColor: `${config.body.textColor}30`, fontSize: `${sizeMap.h5}px` }}>
            "The details are not the details. They make the design."
          </blockquote>
          <h3 style={hStyle("h3")}>Choosing the Right Ratio</h3>
          <p style={{ fontSize: `${sizeMap.p}px` }}>
            Smaller ratios like the Major Second (1.125) create tight, uniform scales perfect for data-dense applications. Larger ratios like the Perfect Fourth (1.333) produce dramatic contrast ideal for editorial and marketing contexts.
          </p>
          <p style={{ fontSize: `${sizeMap.small}px` }} className="opacity-50">
            Published on March 8, 2026 · 5 min read
          </p>
        </article>
      )}

      {config.previewMode === "product" && (
        <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 style={hStyle("h3")}>Dashboard</h2>
            <button className="rounded-md px-3 py-1.5 text-xs font-medium"
              style={{ backgroundColor: config.body.textColor, color: config.body.backgroundColor, fontSize: `${sizeMap.small}px` }}>
              New Project
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Active Users", value: "2,847", change: "+12.5%" },
              { label: "Revenue", value: "$48,290", change: "+8.2%" },
              { label: "Conversion", value: "3.24%", change: "-0.4%" },
            ].map((card) => (
              <div key={card.label} className="rounded-lg border p-4" style={{ borderColor: `${config.body.textColor}15` }}>
                <p style={{ fontSize: `${sizeMap.small}px` }} className="opacity-50">{card.label}</p>
                <p style={{ ...hStyle("h4") }} className="mt-1">{card.value}</p>
                <p style={{ fontSize: `${sizeMap.xs}px` }} className="mt-1 opacity-60">{card.change} from last month</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border p-4" style={{ borderColor: `${config.body.textColor}15` }}>
            <h3 style={hStyle("h5")} className="mb-3">Recent Activity</h3>
            {[
              { title: "Design system updated", desc: "Typography tokens regenerated", time: "2m ago" },
              { title: "New component added", desc: "Card variant with metadata", time: "15m ago" },
              { title: "Figma sync complete", desc: "All tokens exported successfully", time: "1h ago" },
              { title: "Color palette updated", desc: "Neutral scale adjusted", time: "3h ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b py-2.5 last:border-0" style={{ borderColor: `${config.body.textColor}10` }}>
                <div>
                  <p style={{ fontSize: `${sizeMap.p}px`, fontWeight: 500 }}>{item.title}</p>
                  <p style={{ fontSize: `${sizeMap.small}px` }} className="opacity-50">{item.desc}</p>
                </div>
                <span style={{ fontSize: `${sizeMap.xs}px` }} className="opacity-40">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
