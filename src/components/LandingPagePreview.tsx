import { useMemo, useState } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, getFontFamilyStack } from "@/lib/scale-utils";
import { PREVIEW_MODES, type PreviewMode } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
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

  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center border-l border-border bg-muted/30 pt-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCollapsed(false)} title="Expand live preview">
          <PanelRightOpen className="h-4 w-4" />
        </Button>
        <span className="mt-2 text-[10px] text-muted-foreground [writing-mode:vertical-rl] rotate-180">Live Preview</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Preview Mode Switcher */}
      <div className="flex items-center justify-between border-b border-border px-4 h-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={config.previewMode} onValueChange={(v) => updateConfig({ previewMode: v as PreviewMode })}>
            <SelectTrigger className="h-7 w-40 text-[11px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PREVIEW_MODES.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-xs">{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setCollapsed(true)} title="Collapse live preview">
            <PanelRightClose className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/30 p-6" style={{ color: baseStyle.color, fontFamily: baseStyle.fontFamily, fontWeight: baseStyle.fontWeight, lineHeight: baseStyle.lineHeight, letterSpacing: baseStyle.letterSpacing }}>
        <div className="mx-auto max-w-4xl rounded-lg shadow-sm border border-border overflow-hidden" style={{ backgroundColor: config.body.backgroundColor }}>
          {/* Navbar */}
          <nav className="flex items-center justify-between border-b px-10 py-3" style={{ borderColor: `${config.body.textColor}15` }}>
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

        {/* Marketing */}
        {config.previewMode === "marketing" && (
          <div className="mx-auto max-w-2xl flex flex-1 items-center px-10 py-10">
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
          </div>
        )}

        {/* Article */}
        {config.previewMode === "article" && (
          <article className="mx-auto max-w-2xl px-10 py-10 space-y-6">
            <h1 style={hStyle("h1")}>The Evolution of Typography in Digital Design</h1>
            <p style={{ fontSize: `${sizeMap.h6}px` }} className="opacity-60">
              How modern type systems shape the way we read and interact with digital products.
            </p>
            <hr style={{ borderColor: `${config.body.textColor}15` }} />
            <p style={{ fontSize: `${sizeMap.p}px` }}>
              Typography is the backbone of any well-crafted interface. It establishes hierarchy, guides the reader's eye, and communicates tone before a single word is consciously read.
            </p>
            <h2 style={hStyle("h2")}>Building a Type Scale</h2>
            <p style={{ fontSize: `${sizeMap.p}px` }}>
              A modular scale provides a predictable set of font sizes derived from a base value and a ratio. This mathematical relationship ensures visual harmony across an interface.
            </p>
            <blockquote className="border-l-2 pl-4 italic opacity-70" style={{ borderColor: `${config.body.textColor}30`, fontSize: `${sizeMap.h5}px` }}>
              "The details are not the details. They make the design."
            </blockquote>
            <h3 style={hStyle("h3")}>Choosing the Right Ratio</h3>
            <p style={{ fontSize: `${sizeMap.p}px` }}>
              Smaller ratios like the Major Second (1.125) create tight, uniform scales perfect for data-dense applications. Larger ratios produce dramatic contrast ideal for editorial contexts.
            </p>
            <p style={{ fontSize: `${sizeMap.small}px` }} className="opacity-50">
              Published on March 8, 2026 · 5 min read
            </p>
          </article>
        )}

        {/* Product UI */}
        {config.previewMode === "product" && (
          <div className="mx-auto max-w-2xl px-10 py-10 space-y-6">
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

        {/* Blog Feed */}
        {config.previewMode === "blog" && (
          <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
            <h1 style={hStyle("h2")}>Latest Posts</h1>
            {[
              { title: "Understanding Modular Type Scales", excerpt: "Why mathematical ratios create better visual hierarchy in your designs.", date: "Mar 7, 2026", tag: "Design" },
              { title: "The Case for System Fonts", excerpt: "Performance, familiarity, and the end of font-loading anxiety.", date: "Mar 3, 2026", tag: "Performance" },
              { title: "Responsive Typography Done Right", excerpt: "Fluid type, breakpoints, and the art of scaling gracefully across viewports.", date: "Feb 28, 2026", tag: "CSS" },
              { title: "Accessibility in Type Design", excerpt: "Line height, contrast, and font size minimums that actually matter.", date: "Feb 22, 2026", tag: "Accessibility" },
            ].map((post, i) => (
              <article key={i} className="space-y-2 border-b pb-6 last:border-0" style={{ borderColor: `${config.body.textColor}10` }}>
                <span style={{ fontSize: `${sizeMap.xs}px` }} className="opacity-40 uppercase tracking-wider font-medium">{post.tag}</span>
                <h2 style={hStyle("h4")} className="cursor-pointer hover:opacity-80 transition-opacity">{post.title}</h2>
                <p style={{ fontSize: `${sizeMap.p}px` }} className="opacity-65">{post.excerpt}</p>
                <p style={{ fontSize: `${sizeMap.xs}px` }} className="opacity-40">{post.date}</p>
              </article>
            ))}
          </div>
        )}

        {/* E-Commerce */}
        {config.previewMode === "ecommerce" && (
          <div className="mx-auto max-w-2xl px-6 py-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 style={hStyle("h3")}>Featured Products</h2>
              <span style={{ fontSize: `${sizeMap.small}px` }} className="opacity-50 cursor-pointer hover:opacity-80">View all →</span>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { name: "Minimalist Desk Lamp", price: "$89.00", category: "Lighting" },
                { name: "Ergonomic Office Chair", price: "$449.00", category: "Furniture" },
                { name: "Wireless Keyboard Pro", price: "$129.00", category: "Accessories" },
              ].map((product) => (
                <div key={product.name} className="rounded-lg border overflow-hidden" style={{ borderColor: `${config.body.textColor}12` }}>
                  <div className="aspect-[4/3] flex items-center justify-center" style={{ backgroundColor: `${config.body.textColor}06` }}>
                    <span style={{ fontSize: `${sizeMap.xs}px` }} className="opacity-30 uppercase tracking-widest">Image</span>
                  </div>
                  <div className="p-4 space-y-1">
                    <p style={{ fontSize: `${sizeMap.xs}px` }} className="opacity-40 uppercase tracking-wider">{product.category}</p>
                    <h3 style={{ fontSize: `${sizeMap.p}px`, fontFamily: headingFont, fontWeight: headingWeight }}>{product.name}</h3>
                    <p style={{ fontSize: `${sizeMap.h6}px`, fontWeight: 600 }}>{product.price}</p>
                    <button className="mt-2 w-full rounded-md py-2 text-center font-medium transition-opacity hover:opacity-90"
                      style={{ fontSize: `${sizeMap.small}px`, backgroundColor: config.body.textColor, color: config.body.backgroundColor }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation */}
        {config.previewMode === "documentation" && (
          <div className="mx-auto max-w-2xl px-6 py-10 space-y-6">
            <div className="space-y-1">
              <p style={{ fontSize: `${sizeMap.xs}px` }} className="opacity-40 uppercase tracking-wider font-medium">Getting Started</p>
              <h1 style={hStyle("h2")}>Installation</h1>
            </div>
            <p style={{ fontSize: `${sizeMap.p}px` }} className="opacity-75">
              Follow these steps to install and configure the library in your project.
            </p>
            <div className="rounded-md border p-4 font-mono" style={{ borderColor: `${config.body.textColor}15`, backgroundColor: `${config.body.textColor}05`, fontSize: `${sizeMap.small}px` }}>
              npm install @archway/core
            </div>
            <h2 style={hStyle("h4")}>Configuration</h2>
            <p style={{ fontSize: `${sizeMap.p}px` }} className="opacity-75">
              Create a configuration file in your project root. The library will automatically detect and load it.
            </p>
            <div className="rounded-md border p-4 font-mono" style={{ borderColor: `${config.body.textColor}15`, backgroundColor: `${config.body.textColor}05`, fontSize: `${sizeMap.small}px` }}>
              <div>{"// archway.config.ts"}</div>
              <div>{"export default {"}</div>
              <div className="pl-4">{"theme: 'default',"}</div>
              <div className="pl-4">{"plugins: [],"}</div>
              <div>{"}"}</div>
            </div>
            <h2 style={hStyle("h4")}>Usage</h2>
            <p style={{ fontSize: `${sizeMap.p}px` }} className="opacity-75">
              Import components and use them in your application. All components support theming and are fully accessible.
            </p>
            <div className="rounded-md border p-3" style={{ borderColor: `${config.body.textColor}15` }}>
              <p style={{ fontSize: `${sizeMap.small}px` }} className="opacity-50">💡 Tip: Use the CLI to scaffold new components quickly.</p>
            </div>
          </div>
        )}

        {/* Portfolio */}
        {config.previewMode === "portfolio" && (
          <div className="px-6 py-10 space-y-10 max-w-3xl mx-auto">
            <div className="space-y-3">
              <h1 style={hStyle("h1")}>Jane Cooper</h1>
              <p style={{ fontSize: `${sizeMap.h5}px` }} className="opacity-60">Product Designer & Creative Technologist</p>
              <p style={{ fontSize: `${sizeMap.p}px` }} className="opacity-50 max-w-lg">
                Crafting thoughtful digital experiences at the intersection of design and engineering. Currently at Archway.
              </p>
            </div>
            <div className="space-y-6">
              <h2 style={hStyle("h4")}>Selected Work</h2>
              {[
                { title: "Design System Overhaul", desc: "Led the redesign of a component library serving 40+ teams.", year: "2025" },
                { title: "E-Commerce Platform", desc: "End-to-end design for a marketplace processing $2M+ monthly.", year: "2024" },
                { title: "Developer Tools Dashboard", desc: "Analytics and monitoring interface for cloud infrastructure.", year: "2024" },
              ].map((work, i) => (
                <div key={i} className="flex items-start justify-between border-b pb-5 last:border-0" style={{ borderColor: `${config.body.textColor}10` }}>
                  <div className="space-y-1">
                    <h3 style={{ fontSize: `${sizeMap.h5}px`, fontFamily: headingFont, fontWeight: headingWeight }}>{work.title}</h3>
                    <p style={{ fontSize: `${sizeMap.p}px` }} className="opacity-55">{work.desc}</p>
                  </div>
                  <span style={{ fontSize: `${sizeMap.small}px` }} className="opacity-35 shrink-0 ml-4">{work.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}