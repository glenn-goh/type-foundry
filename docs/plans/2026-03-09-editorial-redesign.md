# Editorial Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restyle Type Foundry with an editorial precision aesthetic — dark sidebar, warm-canvas panels, DM Mono + DM Sans typography, amber accent, strict 8px spacing grid, and collapsible accordion controls.

**Architecture:** Visual-only changes across 5 files. No logic, routing, context, or data changes. The existing shadcn Accordion component (`src/components/ui/accordion.tsx`) will power the collapsible sidebar sections. CSS custom properties in `index.css` drive the color system.

**Tech Stack:** React 18, Tailwind CSS 3, shadcn/ui (Radix), DM Mono + DM Sans (Google Fonts)

---

## Reference: Design Tokens

```
Sidebar bg:      #0e1117
Sidebar surface: #161b27
Sidebar border:  #1e2535
Sidebar text:    #e2e8f0
Sidebar muted:   #64748b
Accent:          #e8a020
Canvas bg:       #f7f6f2
Canvas border:   #e4e1da
Canvas text:     #1a1814
```

Spacing: 8px grid — section padding 16px, control gap 8px, label-to-input 6px.

---

## Task 1: Fonts + CSS Variables (`index.css`)

**Files:**
- Modify: `src/index.css`

**Step 1: Replace font imports**

Replace the existing `@import url(...)` line at the top of `src/index.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
```

**Step 2: Update `:root` CSS variables**

Replace the entire `:root { ... }` block inside `@layer base` with:

```css
:root {
  /* Canvas (light panels) */
  --background: 40 15% 97%;        /* #f7f6f2 warm off-white */
  --foreground: 25 8% 10%;         /* #1a1814 near-black warm */

  --card: 40 15% 97%;
  --card-foreground: 25 8% 10%;

  --popover: 0 0% 100%;
  --popover-foreground: 25 8% 10%;

  --primary: 25 8% 10%;
  --primary-foreground: 40 15% 97%;

  --secondary: 35 12% 92%;
  --secondary-foreground: 25 8% 10%;

  --muted: 35 10% 91%;
  --muted-foreground: 25 6% 45%;

  --accent: 35 10% 91%;
  --accent-foreground: 25 8% 10%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;

  --border: 33 15% 88%;            /* #e4e1da warm border */
  --input: 33 15% 88%;
  --ring: 38 75% 51%;              /* #e8a020 amber accent */

  --radius: 0.375rem;

  /* Sidebar tokens (used in Index.tsx sidebar) */
  --sidebar-background: 225 18% 7%;       /* #0e1117 */
  --sidebar-foreground: 213 27% 90%;      /* #e2e8f0 */
  --sidebar-surface: 225 24% 12%;         /* #161b27 */
  --sidebar-border: 220 28% 16%;          /* #1e2535 */
  --sidebar-muted: 215 14% 45%;           /* #64748b */
  --sidebar-accent: 38 75% 51%;           /* #e8a020 amber */
  --sidebar-primary: 38 75% 51%;
  --sidebar-primary-foreground: 225 18% 7%;
  --sidebar-accent-foreground: 225 18% 7%;
  --sidebar-ring: 38 75% 51%;
}
```

**Step 3: Update `.dark` block**

Replace the `.dark { ... }` block:

```css
.dark {
  --background: 225 18% 7%;
  --foreground: 213 27% 90%;

  --card: 225 24% 10%;
  --card-foreground: 213 27% 90%;

  --popover: 225 24% 10%;
  --popover-foreground: 213 27% 90%;

  --primary: 213 27% 90%;
  --primary-foreground: 225 18% 7%;

  --secondary: 225 20% 15%;
  --secondary-foreground: 213 27% 90%;

  --muted: 225 20% 15%;
  --muted-foreground: 215 14% 50%;

  --accent: 225 20% 18%;
  --accent-foreground: 213 27% 90%;

  --destructive: 0 62% 30%;
  --destructive-foreground: 213 27% 90%;

  --border: 225 20% 18%;
  --input: 225 20% 18%;
  --ring: 38 75% 51%;

  --sidebar-background: 225 18% 5%;
  --sidebar-foreground: 213 27% 90%;
  --sidebar-surface: 225 24% 10%;
  --sidebar-border: 220 28% 14%;
  --sidebar-muted: 215 14% 45%;
  --sidebar-accent: 38 75% 51%;
  --sidebar-primary: 38 75% 51%;
  --sidebar-primary-foreground: 225 18% 7%;
  --sidebar-accent-foreground: 225 18% 7%;
  --sidebar-ring: 38 75% 51%;
}
```

**Step 4: Add font-family to body**

In the `@layer base` body rule, update:

```css
body {
  @apply bg-background text-foreground;
  font-family: 'DM Sans', system-ui, sans-serif;
}
```

**Step 5: Visual verify**

Run `npm run dev`. The app should still render. The canvas area will shift to warm off-white, overall text will use DM Sans. The sidebar will not change yet (that comes in Task 2).

**Step 6: Commit**

```bash
git add src/index.css
git commit -m "style: update CSS variables and fonts for editorial redesign"
```

---

## Task 2: AppShell — Sidebar Background (`Index.tsx`)

**Files:**
- Modify: `src/pages/Index.tsx`

**Step 1: Update sidebar `<aside>` classes**

Find the `<aside>` element. Replace its className with:

```tsx
<aside className="w-full shrink-0 border-b lg:w-64 lg:min-w-[16rem] lg:max-w-[16rem] lg:border-b-0 lg:border-r"
  style={{ backgroundColor: 'hsl(var(--sidebar-background))', borderColor: 'hsl(var(--sidebar-border))' }}>
```

**Step 2: Update the ScrollArea wrapper**

The `ScrollArea` inside the sidebar should stay as-is. No changes needed.

**Step 3: Update collapsed preview strip**

Find the `previewCollapsed` strip div and update its classes:

```tsx
<div className="flex h-full flex-col items-center border-l px-1 pt-2 shrink-0"
  style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
```

**Step 4: Visual verify**

The sidebar should now be dark (`#0e1117`). The main panels remain light.

**Step 5: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "style: apply dark sidebar background in AppShell"
```

---

## Task 3: TypeScalePreview Restyle (`TypeScalePreview.tsx`)

**Files:**
- Modify: `src/components/TypeScalePreview.tsx`

**Step 1: Update `TypeRow` component**

Replace the existing `TypeRow` return JSX:

```tsx
return (
  <div className="group flex items-baseline gap-3 border-b px-4 py-3 transition-colors"
    style={{ borderColor: 'hsl(var(--border))', backgroundColor: undefined }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0ece4')}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
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
```

**Step 2: Update panel header — inline preview input**

Replace the two separate header elements (the `h-10` header div + the preview input div) with one combined header:

```tsx
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
```

**Step 3: Update bottom tabs styling**

Find the `<Tabs>` section at the bottom. Update `TabsList` and `TabsTrigger` classes:

```tsx
<TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2 h-8"
  style={{ borderColor: 'hsl(var(--border))' }}>
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
```

**Step 4: Visual verify**

Type scale rows should have DM Mono labels, warm hover, and the preview input sits inline in the header row.

**Step 5: Commit**

```bash
git add src/components/TypeScalePreview.tsx
git commit -m "style: restyle TypeScalePreview with editorial design system"
```

---

## Task 4: LandingPagePreview Restyle (`LandingPagePreview.tsx`)

**Files:**
- Modify: `src/components/LandingPagePreview.tsx`

**Step 1: Update header bar**

Find the header `<div className="flex items-center justify-between border-b border-border px-4 h-10">`. Replace:

```tsx
<div className="flex items-center justify-between border-b px-4 h-10"
  style={{ borderColor: 'hsl(var(--border))' }}>
  <div className="flex items-center gap-2">
    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onCollapse} title="Collapse live preview">
      <PanelRightClose className="h-3.5 w-3.5" />
    </Button>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
      Live Preview
    </span>
  </div>
  <Select value={config.previewMode} onValueChange={(v) => updateConfig({ previewMode: v as PreviewMode })}>
    <SelectTrigger className="h-7 w-40 text-[11px]"><SelectValue /></SelectTrigger>
    <SelectContent>
      {PREVIEW_MODES.map((m) => (
        <SelectItem key={m.value} value={m.value} className="text-xs">{m.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

**Step 2: Update canvas wrapper background**

Find the `<div className="flex-1 overflow-auto bg-muted/30 p-6" ...>`. Change `bg-muted/30` to remove it and rely on the CSS variable instead:

```tsx
<div className="flex-1 overflow-auto p-6"
  style={{ backgroundColor: 'hsl(var(--muted) / 0.4)', color: baseStyle.color, fontFamily: baseStyle.fontFamily, fontWeight: baseStyle.fontWeight, lineHeight: baseStyle.lineHeight, letterSpacing: baseStyle.letterSpacing }}>
```

**Step 3: Visual verify**

Live preview header matches the Type Scale header styling. Canvas remains warm off-white.

**Step 4: Commit**

```bash
git add src/components/LandingPagePreview.tsx
git commit -m "style: restyle LandingPagePreview header to match editorial system"
```

---

## Task 5: ControlsPanel — Scaffold + Header + Section Component

**Files:**
- Modify: `src/components/ControlsPanel.tsx`

This is the largest task. The accordion uses the existing `Accordion` from `@/components/ui/accordion`.

**Step 1: Add imports**

At the top of `ControlsPanel.tsx`, add to the existing imports:

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
```

Remove the `Separator` import (no longer used after accordion replaces separators).

**Step 2: Replace the entire `return` JSX**

Replace everything from `return (` to the closing `)` with the scaffold below. The accordion has 4 items: `scale`, `body`, `headings`, `advanced`. Three are open by default.

```tsx
return (
  <div className="flex flex-col h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>

    {/* Persistent Header */}
    <div className="flex items-center justify-between px-4 py-3 border-b shrink-0"
      style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
      <div className="flex items-center gap-2">
        <Type className="h-3.5 w-3.5" style={{ color: 'hsl(var(--sidebar-accent))' }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', fontWeight: 500, color: 'hsl(var(--sidebar-foreground))', letterSpacing: '0.02em' }}>
          Type Foundry
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShareOpen(true)} title="Share"
          style={{ color: 'hsl(var(--sidebar-muted))' }}>
          <Share2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost" size="icon" className="h-7 w-7"
          style={{ color: 'hsl(var(--sidebar-muted))' }}
          onClick={() => {
            const isDark = config.theme === "light";
            updateConfig({ theme: isDark ? "dark" : "light" });
            updateBody({ textColor: isDark ? "#E5E7EB" : "#222222", backgroundColor: isDark ? "#111318" : "#FFFFFF" });
            updateHeadings({ color: isDark ? "#F3F4F6" : "#222222" });
          }}
        >
          {config.theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>

    {/* Accordion Sections */}
    <Accordion type="multiple" defaultValue={["scale", "body", "headings"]} className="flex-1 overflow-auto">

      {/* ── SCALE ── */}
      <AccordionItem value="scale" className="border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--sidebar-muted))' }}>
          Scale
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-1 space-y-3">

          {/* Base Font Size */}
          <div className="space-y-1.5">
            <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Base Font Size</label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-7 w-7 shrink-0 border"
                style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))' }}
                onClick={() => wrappedUpdateConfig({ baseFontSize: Math.max(10, config.baseFontSize - 1) })}>
                <Minus className="h-3 w-3" />
              </Button>
              <div className="flex h-7 flex-1 items-center justify-center rounded-md border"
                style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'hsl(var(--sidebar-foreground))' }}>
                {config.baseFontSize}
              </div>
              <Button variant="outline" size="icon" className="h-7 w-7 shrink-0 border"
                style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))' }}
                onClick={() => wrappedUpdateConfig({ baseFontSize: Math.min(24, config.baseFontSize + 1) })}>
                <Plus className="h-3 w-3" />
              </Button>
              <span style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))' }}>px</span>
            </div>
          </div>

          {/* Scale Ratio */}
          <div className="space-y-1.5">
            <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Scale Ratio</label>
            <Select
              value={!isCustomRatio && SCALE_RATIOS.some((r) => r.value === config.scaleRatio) ? String(config.scaleRatio) : "custom"}
              onValueChange={(v) => {
                if (v === "custom") { setIsCustomRatio(true); }
                else { setIsCustomRatio(false); wrappedUpdateConfig({ scaleRatio: Number(v) }); }
              }}
            >
              <SelectTrigger className="h-7 border" style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>
                <SelectValue>
                  {!isCustomRatio && SCALE_RATIOS.some((r) => r.value === config.scaleRatio)
                    ? `${config.scaleRatio} — ${SCALE_RATIOS.find((r) => r.value === config.scaleRatio)?.label}`
                    : `${config.scaleRatio} — Custom`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SCALE_RATIOS.map((r) => (
                  <SelectItem key={r.value} value={String(r.value)} className="text-xs font-mono">{r.value} — {r.label}</SelectItem>
                ))}
                <SelectItem value="custom" className="text-xs">Custom...</SelectItem>
              </SelectContent>
            </Select>
            {isCustomRatio && (
              <Input type="number" step={0.001} min={1} max={3} value={config.scaleRatio}
                onChange={(e) => { const v = Number(e.target.value); if (v >= 1 && v <= 3) wrappedUpdateConfig({ scaleRatio: Math.round(v * 1000) / 1000 }); }}
                className="h-7 border" placeholder="e.g. 1.333"
                style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
            )}
          </div>

          {/* Unit + Rounding */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Unit</label>
              <div className="flex gap-0.5">
                {(["rem", "px", "pt"] as const).map((u) => (
                  <button key={u}
                    onClick={() => updateConfig({ unit: u })}
                    className="flex-1 h-6 rounded text-[10px] font-medium transition-colors"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      backgroundColor: config.unit === u ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-surface))',
                      color: config.unit === u ? 'hsl(var(--sidebar-background))' : 'hsl(var(--sidebar-muted))',
                      border: `1px solid ${config.unit === u ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-border))'}`,
                    }}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Rounding</label>
              <div className="flex gap-0.5">
                {([["none", "Off"], ["4px", "4"], ["8px", "8"]] as const).map(([value, label]) => (
                  <button key={value}
                    onClick={() => updateConfig({ rounding: value as RoundingGrid })}
                    className="flex-1 h-6 rounded text-[10px] font-medium transition-colors"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      backgroundColor: config.rounding === value ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-surface))',
                      color: config.rounding === value ? 'hsl(var(--sidebar-background))' : 'hsl(var(--sidebar-muted))',
                      border: `1px solid ${config.rounding === value ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-border))'}`,
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compare Mode */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))' }}>Compare Mode</label>
              <Switch checked={config.compare.enabled} onCheckedChange={(v) => updateCompare({ enabled: v })}
                className="data-[state=unchecked]:bg-white/10 data-[state=checked]:bg-amber-500" />
            </div>
            {config.compare.enabled && (
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Compare Ratio</label>
                <Select
                  value={SCALE_RATIOS.some((r) => r.value === config.compare.scaleRatio) ? String(config.compare.scaleRatio) : "custom-compare"}
                  onValueChange={(v) => { if (v !== "custom-compare") updateCompare({ scaleRatio: Number(v) }); }}
                >
                  <SelectTrigger className="h-7 border" style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>
                    <SelectValue>
                      {SCALE_RATIOS.some((r) => r.value === config.compare.scaleRatio)
                        ? `${config.compare.scaleRatio} — ${SCALE_RATIOS.find((r) => r.value === config.compare.scaleRatio)?.label}`
                        : `${config.compare.scaleRatio} — Custom`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SCALE_RATIOS.map((r) => (
                      <SelectItem key={r.value} value={String(r.value)} className="text-xs font-mono">{r.value} — {r.label}</SelectItem>
                    ))}
                    <SelectItem value="custom-compare" className="text-xs">Custom...</SelectItem>
                  </SelectContent>
                </Select>
                {!SCALE_RATIOS.some((r) => r.value === config.compare.scaleRatio) && (
                  <Input type="number" step={0.001} min={1} max={3} value={config.compare.scaleRatio}
                    onChange={(e) => { const v = Number(e.target.value); if (v >= 1 && v <= 3) updateCompare({ scaleRatio: Math.round(v * 1000) / 1000 }); }}
                    className="h-7 border" placeholder="e.g. 1.333"
                    style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
                )}
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={() => setResetOpen(true)}
            className="flex items-center gap-1.5 transition-colors hover:opacity-100"
            style={{ fontSize: '10px', color: 'hsl(var(--sidebar-muted))', opacity: 0.6 }}>
            <RotateCcw className="h-3 w-3" />
            Reset to defaults
          </button>

        </AccordionContent>
      </AccordionItem>

      {/* ── BODY ── */}
      <AccordionItem value="body" className="border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--sidebar-muted))' }}>
          Body
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-1 space-y-3">

          <div className="space-y-1.5">
            <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Font Family</label>
            <FontSelector value={config.body.fontFamily} onValueChange={(v) => wrappedUpdateBody({ fontFamily: v })} />
          </div>

          <div className="space-y-1.5">
            <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>
              Weight: <span style={{ fontFamily: "'DM Mono', monospace" }}>{config.body.fontWeight}</span>
            </label>
            <Slider min={100} max={900} step={100} value={[config.body.fontWeight]}
              onValueChange={([v]) => wrappedUpdateBody({ fontWeight: v })} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Line Height</label>
              <Input type="number" step={0.1} min={1} max={3} value={config.body.lineHeight}
                onChange={(e) => wrappedUpdateBody({ lineHeight: Number(e.target.value) })}
                className="h-7 border"
                style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
            </div>
            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Letter Spacing</label>
              <Input type="number" step={0.01} value={config.body.letterSpacing}
                onChange={(e) => wrappedUpdateBody({ letterSpacing: Number(e.target.value) })}
                className="h-7 border"
                style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Text Color</label>
              <div className="flex items-center gap-1.5">
                <input type="color" value={config.body.textColor}
                  onChange={(e) => wrappedUpdateBody({ textColor: e.target.value })}
                  className="h-6 w-6 cursor-pointer rounded border"
                  style={{ borderColor: 'hsl(var(--sidebar-border))' }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--sidebar-muted))' }}>
                  {config.body.textColor}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Background</label>
              <div className="flex items-center gap-1.5">
                <input type="color" value={config.body.backgroundColor}
                  onChange={(e) => wrappedUpdateBody({ backgroundColor: e.target.value })}
                  className="h-6 w-6 cursor-pointer rounded border"
                  style={{ borderColor: 'hsl(var(--sidebar-border))' }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--sidebar-muted))' }}>
                  {config.body.backgroundColor}
                </span>
              </div>
            </div>
          </div>

        </AccordionContent>
      </AccordionItem>

      {/* ── HEADINGS ── */}
      <AccordionItem value="headings" className="border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--sidebar-muted))' }}>
          Headings
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-1 space-y-3">

          <div className="flex items-center justify-between">
            <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))' }}>Inherit body</label>
            <Switch checked={config.headings.inherit} onCheckedChange={(v) => wrappedUpdateHeadings({ inherit: v })}
              className="data-[state=unchecked]:bg-white/10 data-[state=checked]:bg-amber-500" />
          </div>

          {!config.headings.inherit && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Font Family</label>
                <FontSelector value={config.headings.fontFamily} onValueChange={(v) => wrappedUpdateHeadings({ fontFamily: v })} />
              </div>
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>
                  Weight: <span style={{ fontFamily: "'DM Mono', monospace" }}>{config.headings.fontWeight}</span>
                </label>
                <Slider min={100} max={900} step={100} value={[config.headings.fontWeight]}
                  onValueChange={([v]) => wrappedUpdateHeadings({ fontWeight: v })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Line Height</label>
                  <Input type="number" step={0.05} min={0.8} max={2} value={config.headings.lineHeight}
                    onChange={(e) => wrappedUpdateHeadings({ lineHeight: Number(e.target.value) })}
                    className="h-7 border"
                    style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
                </div>
                <div className="space-y-1.5">
                  <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Letter Spacing</label>
                  <Input type="number" step={0.01} value={config.headings.letterSpacing}
                    onChange={(e) => wrappedUpdateHeadings({ letterSpacing: Number(e.target.value) })}
                    className="h-7 border"
                    style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Color</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={config.headings.color}
                    onChange={(e) => wrappedUpdateHeadings({ color: e.target.value })}
                    className="h-6 w-6 cursor-pointer rounded border"
                    style={{ borderColor: 'hsl(var(--sidebar-border))' }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--sidebar-muted))' }}>
                    {config.headings.color}
                  </span>
                </div>
              </div>
            </div>
          )}

        </AccordionContent>
      </AccordionItem>

      {/* ── ADVANCED ── */}
      <AccordionItem value="advanced" className="border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--sidebar-muted))' }}>
          Advanced
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-1 space-y-4">

          {/* Responsive */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))' }}>Responsive</label>
              <Switch checked={config.responsive.enabled} onCheckedChange={(v) => updateResponsive({ enabled: v })}
                className="data-[state=unchecked]:bg-white/10 data-[state=checked]:bg-amber-500" />
            </div>
            {config.responsive.enabled && (
              <div className="space-y-2">
                {config.responsive.breakpoints.map((bp, i) => (
                  <div key={i} className="space-y-1.5 rounded-md border p-2"
                    style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'hsl(var(--sidebar-foreground))' }}>{bp.label}</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: 'Min Width', key: 'minWidth' as const, step: 1 },
                        { label: 'Base', key: 'baseFontSize' as const, step: 1 },
                        { label: 'Ratio', key: 'scaleRatio' as const, step: 0.001 },
                      ].map(({ label, key, step }) => (
                        <div key={key} className="space-y-0.5">
                          <span style={{ fontSize: '9px', color: 'hsl(var(--sidebar-muted))' }}>{label}</span>
                          <Input type="number" step={step} value={bp[key]}
                            onChange={(e) => {
                              const bps = [...config.responsive.breakpoints];
                              bps[i] = { ...bps[i], [key]: Number(e.target.value) };
                              updateResponsive({ breakpoints: bps });
                            }}
                            className="h-6 border px-1.5"
                            style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-background))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '10px' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Library */}
          <div className="space-y-2">
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Presets</label>
            <Select value={activePresetKey ?? "custom"} onValueChange={(v) => { if (v !== "custom") handleApplyPreset(v); }}>
              <SelectTrigger className="h-7 border" style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontSize: '11px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="py-1">
                <SelectItem value="custom" className="py-2 pl-3 pr-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Custom</span>
                    <span className="text-[10px] text-muted-foreground">{config.baseFontSize}px · {config.scaleRatio}</span>
                  </div>
                </SelectItem>
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <SelectItem key={key} value={key} className="py-2 pl-3 pr-8">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{preset.label}</span>
                      <span className="text-[10px] text-muted-foreground">{preset.config.baseFontSize}px · {preset.config.scaleRatio}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--sidebar-muted))', display: 'block' }}>
              Saved <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px' }}>({savedSystems.length})</span>
            </label>
            <div className="flex gap-1.5">
              <Input placeholder="System name..." value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="h-7 border flex-1"
                style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontSize: '11px' }} />
              <Button variant="outline" size="sm" className="h-7 shrink-0 border text-xs"
                style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))' }}
                onClick={handleSave} disabled={!saveName.trim()}>
                <Save className="mr-1 h-3 w-3" />Save
              </Button>
            </div>
            {savedSystems.map((sys) => (
              <div key={sys.id} className="flex items-center justify-between rounded-md border px-2 py-1.5"
                style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))' }}>
                <button onClick={() => handleLoadSystem(sys.id)} className="text-left">
                  <span className="block text-xs font-medium hover:underline" style={{ color: 'hsl(var(--sidebar-foreground))' }}>{sys.name}</span>
                  <span className="block" style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--sidebar-muted))' }}>
                    {(sys.config as any).baseFontSize}px · {(sys.config as any).scaleRatio}
                  </span>
                </button>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => deleteSystem(sys.id)}>
                  <Trash2 className="h-3 w-3" style={{ color: 'hsl(var(--sidebar-muted))' }} />
                </Button>
              </div>
            ))}
          </div>

        </AccordionContent>
      </AccordionItem>

    </Accordion>
  </div>
);
```

**Step 3: Keep all existing state + dialogs**

The dialogs (AlertDialog for reset, Dialog for share) and all state variables remain unchanged. They appear just before the `return` — don't remove them.

**Step 4: Visual verify**

- Sidebar is dark with DM Mono logo + amber accent on the Type icon
- All 4 accordion sections expand/collapse independently
- Scale, Body, Headings open by default; Advanced closed
- Compare Mode toggle is in the Scale section
- Reset link is at the bottom of Scale section
- All inputs/selects have dark surface styling

**Step 5: Commit**

```bash
git add src/components/ControlsPanel.tsx
git commit -m "style: rework ControlsPanel with accordion sections and editorial design"
```

---

## Task 6: Final Polish Pass

**Files:**
- Modify: `src/components/ControlsPanel.tsx` (minor tweaks only)
- Modify: `src/index.css` (minor tweaks only)

**Step 1: Verify accordion chevron color**

The `AccordionTrigger` renders a `ChevronDown` icon. In the dark sidebar this icon may render in the default foreground color (light). Wrap the trigger content to ensure the chevron matches sidebar muted color by adding this to `index.css`:

```css
/* Sidebar accordion chevron */
[data-radix-collection-item] svg {
  color: hsl(var(--sidebar-muted));
}
```

**Step 2: Verify font loading**

Open the app, open DevTools → Network → filter by "DM". Confirm `DM+Mono` and `DM+Sans` are loading from Google Fonts.

**Step 3: Check scrollbar in sidebar**

The existing scrollbar-hide CSS uses `scrollbar-color: transparent transparent`. This works on the light canvas. On the dark sidebar, add a sidebar-specific rule to `index.css`:

```css
aside *:hover::-webkit-scrollbar-thumb {
  background: hsl(var(--sidebar-border));
}
```

**Step 4: Final commit**

```bash
git add src/index.css src/components/ControlsPanel.tsx
git commit -m "style: final polish — sidebar chevron color and scrollbar"
```

---

## Verification Checklist

- [ ] DM Mono and DM Sans load from Google Fonts
- [ ] Sidebar is `#0e1117` dark background
- [ ] Accordion sections open/close independently
- [ ] Scale, Body, Headings open by default; Advanced closed
- [ ] Compare Mode is in the Scale section
- [ ] Reset link is at bottom of Scale section (not next to Library)
- [ ] Type scale rows have DM Mono token/size labels
- [ ] Preview input is inline in the Type Scale header row
- [ ] Live Preview header matches Type Scale header style
- [ ] Unit/Rounding button groups use amber accent for active state
- [ ] Sliders, inputs, and selects have dark surface styling in sidebar
- [ ] Canvas panels are warm off-white `#f7f6f2`
- [ ] No console errors
