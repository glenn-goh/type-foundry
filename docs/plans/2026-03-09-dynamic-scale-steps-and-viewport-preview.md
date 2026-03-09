# Dynamic Scale Steps & Viewport Preview Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow users to add, remove, rename, and reorder type scale steps; add a mobile/tablet/desktop device-frame toggle to the live preview panel.

**Architecture:** `ScaleStep[]` replaces the fixed `ScaleToken` union in `AppConfig`; exponents are computed from position relative to the base step at runtime. The viewport toggle lives in local state in `LandingPagePreview` and wraps content in a CSS device frame scaled to fit the panel using `ResizeObserver`.

**Tech Stack:** React, TypeScript, Tailwind CSS, shadcn/ui (existing), Lucide icons (existing), no new dependencies.

---

## Task 1: Add `ScaleStep` type and update `types.ts`

**Files:**
- Modify: `src/lib/types.ts`

**Step 1: Add `ScaleStep` interface after line 3 (after `ScaleToken`)**

```typescript
export interface ScaleStep {
  id: string;      // stable key used in CSS vars and exports; never changes after creation
  label: string;   // editable display name shown in UI and scale table
  isBase: boolean; // exactly one step has isBase=true; that step renders at baseFontSize
}
```

**Step 2: Add `DEFAULT_STEPS` constant after the `ScaleStep` interface**

```typescript
export const DEFAULT_STEPS: ScaleStep[] = [
  { id: "h1",    label: "h1",    isBase: false },
  { id: "h2",    label: "h2",    isBase: false },
  { id: "h3",    label: "h3",    isBase: false },
  { id: "h4",    label: "h4",    isBase: false },
  { id: "h5",    label: "h5",    isBase: false },
  { id: "h6",    label: "h6",    isBase: false },
  { id: "p",     label: "p",     isBase: true  },
  { id: "small", label: "small", isBase: false },
  { id: "xs",    label: "xs",    isBase: false },
];
```

**Step 3: Update `ScaleEntry` interface — change `token` to `string`, add `id` and `exponent`**

Replace the existing `ScaleEntry` interface:
```typescript
export interface ScaleEntry {
  token: string;    // display label (was ScaleToken)
  id: string;       // stable step id for exports and sizeMap lookups
  px: number;
  rem: number;
  pt: number;
  exponent: number; // positive = above base (heading-like), 0 = base, negative = below base
}
```

**Step 4: Add `steps` field to `AppConfig` (before the closing brace)**

```typescript
  steps: ScaleStep[];
```

**Step 5: Add `steps: DEFAULT_STEPS` to `DEFAULT_CONFIG`**

Inside `DEFAULT_CONFIG`, add after `theme: "light"`:
```typescript
  steps: DEFAULT_STEPS,
```

**Step 6: Run the dev server to see TypeScript errors**

```bash
npm run dev
```

Expected: Multiple TS errors about `ScaleToken` usage — these will be fixed in subsequent tasks.

---

## Task 2: Update `calculateTypeScale` in `scale-utils.ts`

**Files:**
- Modify: `src/lib/scale-utils.ts`

**Step 1: Add `ScaleStep` and `DEFAULT_STEPS` to the import line at the top**

Change:
```typescript
import type { BreakpointConfig, RoundingGrid, ScaleEntry, ScaleToken, Unit } from "./types";
```
To:
```typescript
import type { BreakpointConfig, RoundingGrid, ScaleEntry, ScaleStep, Unit } from "./types";
import { DEFAULT_STEPS } from "./types";
```

**Step 2: Delete the `TOKEN_EXPONENTS` constant (lines 3–13)**

Remove:
```typescript
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
```

**Step 3: Replace `calculateTypeScale` with the dynamic version**

Replace the entire `calculateTypeScale` function:
```typescript
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
```

**Step 4: Update all export generators to use `e.id` instead of `e.token`, and `e.exponent > 0` instead of the heading token set**

In `generateCssVariables`, replace:
```typescript
const lines = scale.map((e) => `  --font-size-${e.token === "p" ? "body" : e.token}: ${formatValue(e, unit)};`);
```
With:
```typescript
const lines = scale.map((e) => `  --font-size-${e.id}: ${formatValue(e, unit)};`);
```
And the responsive lines:
```typescript
const rLines = responsive.scale.map(
  (e) => `    --font-size-${e.id}: ${formatValue(e, unit)};`
);
```

In `generateResponsiveCss`, replace:
```typescript
const lines = scale.map(
  (e) => `  --font-size-${e.token === "p" ? "body" : e.token}: ${formatValue(e, unit)};`
);
```
With:
```typescript
const lines = scale.map((e) => `  --font-size-${e.id}: ${formatValue(e, unit)};`);
```
And the indented lines similarly:
```typescript
const indented = lines.map((l) => `  ${l}`);
```
(No change needed here, already uses `lines`.)

In `generateJsonTokens`, replace:
```typescript
scale.forEach((e) => {
  obj[e.token === "p" ? "body" : e.token] = formatValue(e, unit);
});
```
With:
```typescript
scale.forEach((e) => {
  obj[e.id] = formatValue(e, unit);
});
```

In `generateTailwindConfig`, replace:
```typescript
const lines = scale.map((e) => `  ${e.token === "p" ? "body" : e.token}: "${formatValue(e, unit)}",`);
```
With:
```typescript
const lines = scale.map((e) => `  ${e.id}: "${formatValue(e, unit)}",`);
```

In `generateFigmaTokens`, replace:
```typescript
const headingTokens = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
// ...
const name = e.token === "p" ? "body" : e.token;
const isHeading = headingTokens.has(e.token);
```
With:
```typescript
const name = e.id;
const isHeading = e.exponent > 0;
```
(Remove the `headingTokens` Set declaration entirely.)

**Step 5: Run TypeScript check**

```bash
npm run build 2>&1 | head -40
```

Expected: Errors in components that still use `ScaleToken` — fixed in next tasks.

---

## Task 3: Update `AppConfigContext.tsx`

**Files:**
- Modify: `src/context/AppConfigContext.tsx`

**Step 1: Add `ScaleStep` and `DEFAULT_STEPS` to the types import**

Change:
```typescript
import type { AppConfig, SavedSystem } from "@/lib/types";
import { DEFAULT_CONFIG } from "@/lib/types";
```
To:
```typescript
import type { AppConfig, SavedSystem, ScaleStep } from "@/lib/types";
import { DEFAULT_CONFIG, DEFAULT_STEPS } from "@/lib/types";
```

**Step 2: Add `updateSteps` to the context interface**

In `AppConfigContextType`, add after `updateCompare`:
```typescript
  updateSteps: (steps: ScaleStep[]) => void;
```

**Step 3: Update `loadConfig` to merge `steps` from `DEFAULT_CONFIG`**

In the `loadConfig` function, update the return inside the try block:
```typescript
return {
  ...DEFAULT_CONFIG,
  ...parsed,
  body: { ...DEFAULT_CONFIG.body, ...(parsed.body || {}) },
  headings: { ...DEFAULT_CONFIG.headings, ...(parsed.headings || {}) },
  responsive: { ...DEFAULT_CONFIG.responsive, ...(parsed.responsive || {}) },
  compare: { ...DEFAULT_CONFIG.compare, ...(parsed.compare || {}) },
  steps: Array.isArray(parsed.steps) && parsed.steps.length > 0
    ? parsed.steps
    : DEFAULT_STEPS,
};
```

**Step 4: Add the `updateSteps` callback inside `AppConfigProvider` (after `updateCompare`)**

```typescript
const updateSteps = useCallback(
  (steps: ScaleStep[]) => setConfig((prev) => ({ ...prev, steps })),
  []
);
```

**Step 5: Add `updateSteps` to the Provider value**

In the `<AppConfigContext.Provider value={{...}}>`, add `updateSteps` alongside `updateCompare`.

**Step 6: Run dev server**

```bash
npm run dev
```

Expected: TS errors resolved in context file; remaining errors in component files.

---

## Task 4: Update `TypeScalePreview.tsx`

**Files:**
- Modify: `src/components/TypeScalePreview.tsx`

**Step 1: Pass `config.steps` to `calculateTypeScale`**

Find:
```typescript
const scale = useMemo(
  () => calculateTypeScale(config.baseFontSize, config.scaleRatio, config.rounding),
  [config.baseFontSize, config.scaleRatio, config.rounding]
);
```
Replace with:
```typescript
const scale = useMemo(
  () => calculateTypeScale(config.baseFontSize, config.scaleRatio, config.rounding, config.steps),
  [config.baseFontSize, config.scaleRatio, config.rounding, config.steps]
);
```

**Step 2: Update `TypeRow` — `isHeading` now comes from `entry.exponent > 0`**

In the parent where `TypeRow` is rendered, find the heading check. It likely looks like:
```typescript
const isHeading = ["h1","h2","h3","h4","h5","h6"].includes(entry.token);
```
Replace with:
```typescript
const isHeading = entry.exponent > 0;
```

**Step 3: Remove `ScaleToken` import if no longer used**

Check the import line:
```typescript
import type { ScaleEntry } from "@/lib/types";
```
`ScaleToken` should be removed if it was imported.

**Step 4: Run TypeScript check**

```bash
npm run build 2>&1 | head -40
```

Expected: TypeScalePreview errors resolved.

---

## Task 5: Update `LandingPagePreview.tsx` — scale consumption

**Files:**
- Modify: `src/components/LandingPagePreview.tsx`

**Step 1: Pass `config.steps` to `calculateTypeScale`**

Find:
```typescript
const scale = useMemo(
  () => calculateTypeScale(config.baseFontSize, config.scaleRatio, config.rounding),
  [config.baseFontSize, config.scaleRatio, config.rounding]
);
```
Replace with:
```typescript
const scale = useMemo(
  () => calculateTypeScale(config.baseFontSize, config.scaleRatio, config.rounding, config.steps),
  [config.baseFontSize, config.scaleRatio, config.rounding, config.steps]
);
```

**Step 2: Change `sizeMap` to use `entry.id` as key**

Find:
```typescript
const sizeMap = Object.fromEntries(scale.map((e) => [e.token, e.px]));
```
Replace with:
```typescript
const sizeMap = Object.fromEntries(scale.map((e) => [e.id, e.px]));
```

**Step 3: Add a safe size accessor after `sizeMap`**

```typescript
// Falls back to positional lookup when a step id isn't in the map
// (e.g. user deleted "h1" — fall back to the largest available step)
const sz = (id: string, fallbackIndex = 0): number =>
  sizeMap[id] ?? scale[Math.min(fallbackIndex, scale.length - 1)]?.px ?? config.baseFontSize;
```

**Step 4: Replace all `sizeMap.h1`, `sizeMap.h2` etc. with `sz("h1")`, `sz("h2")` etc. throughout the component**

Do a find-replace for each token reference. For example:
- `sizeMap.h1` → `sz("h1", 0)`
- `sizeMap.h2` → `sz("h2", 1)`
- `sizeMap.h3` → `sz("h3", 2)`
- `sizeMap.h4` → `sz("h4", 3)`
- `sizeMap.h5` → `sz("h5", 4)`
- `sizeMap.h6` → `sz("h6", 5)`
- `sizeMap.p` → `sz("p", 6)`
- `sizeMap.small` → `sz("small", 7)`
- `sizeMap.xs` → `sz("xs", 8)`

Also update the `T` component and `hStyle` uses that reference `sizeMap[token]`:
```typescript
const T = ({ token, children, className }: { token: string; children: React.ReactNode; className?: string }) => (
  <TypeLabel token={token} size={sz(token)} className={className}>
    {children}
  </TypeLabel>
);
```
And `hStyle`:
```typescript
const hStyle = (token: string): React.CSSProperties => ({
  fontSize: `${sz(token)}px`,
  // ...rest unchanged
});
```

**Step 5: Run TypeScript check**

```bash
npm run build 2>&1 | head -40
```

Expected: No errors in LandingPagePreview.

---

## Task 6: Fix remaining `ScaleToken` usages across codebase

**Files:**
- Check: `src/components/ComparePanel.tsx`, `src/components/ScaleGraph.tsx`, `src/components/ResponsiveBreakpointPreview.tsx`, `src/components/ExportPanel.tsx`

**Step 1: Find all remaining `ScaleToken` usages**

```bash
grep -rn "ScaleToken" src/
```

**Step 2: For each file found — replace `ScaleToken` type with `string` where used as `entry.token`**

Common pattern to replace:
```typescript
// Before
entry: ScaleEntry & { token: ScaleToken }
// or
const isHeading = ["h1","h2","h3","h4","h5","h6"].includes(entry.token);

// After
const isHeading = entry.exponent > 0;
```

**Step 3: Pass `config.steps` to any other `calculateTypeScale` calls found**

```bash
grep -rn "calculateTypeScale" src/
```

For each call not yet updated, add `config.steps` (or the relevant steps variable) as the 4th argument.

**Step 4: Full TypeScript build**

```bash
npm run build
```

Expected: Clean build with no errors.

**Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/scale-utils.ts src/context/AppConfigContext.tsx src/components/TypeScalePreview.tsx src/components/LandingPagePreview.tsx
git commit -m "feat: replace fixed ScaleToken with dynamic ScaleStep array"
```

---

## Task 7: Add Scale Steps UI to `ControlsPanel.tsx`

**Files:**
- Modify: `src/components/ControlsPanel.tsx`

**Step 1: Import new icons and types**

Add to existing imports:
```typescript
import { GripVertical, X, Plus, ChevronUp, ChevronDown } from "lucide-react";
import type { ScaleStep } from "@/lib/types";
import { DEFAULT_STEPS } from "@/lib/types";
```
And destructure `updateSteps` from `useAppConfig()`:
```typescript
const { ..., updateSteps } = useAppConfig();
```

**Step 2: Add helper functions inside the component (before `return`)**

```typescript
const moveStep = (index: number, direction: "up" | "down") => {
  const steps = [...config.steps];
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= steps.length) return;
  [steps[index], steps[target]] = [steps[target], steps[index]];
  updateSteps(steps);
};

const removeStep = (index: number) => {
  if (config.steps.length <= 1) return;
  const steps = config.steps.filter((_, i) => i !== index);
  // If removed step was base, promote the nearest step
  if (config.steps[index].isBase) {
    const newBaseIndex = Math.min(index, steps.length - 1);
    steps[newBaseIndex] = { ...steps[newBaseIndex], isBase: true };
  }
  updateSteps(steps);
};

const renameStep = (index: number, label: string) => {
  const steps = config.steps.map((s, i) => i === index ? { ...s, label } : s);
  updateSteps(steps);
};

const addStep = () => {
  const id = `custom-${Date.now()}`;
  const newStep: ScaleStep = { id, label: id, isBase: false };
  updateSteps([...config.steps, newStep]);
};

const setBase = (index: number) => {
  const steps = config.steps.map((s, i) => ({ ...s, isBase: i === index }));
  updateSteps(steps);
};
```

**Step 3: Add a new "Steps" `AccordionItem` after the existing "Scale" section (after line ~314)**

```tsx
{/* ── STEPS ── */}
<AccordionItem value="steps" className="border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5"
    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--sidebar-muted))' }}>
    Steps
  </AccordionTrigger>
  <AccordionContent className="px-4 pb-4 pt-1 space-y-1.5">
    {config.steps.map((step, i) => (
      <div key={step.id} className="flex items-center gap-1.5">
        {/* Up/Down */}
        <div className="flex flex-col">
          <button
            onClick={() => moveStep(i, "up")}
            disabled={i === 0}
            className="h-3.5 w-4 flex items-center justify-center rounded disabled:opacity-20"
            style={{ color: 'hsl(var(--sidebar-muted))' }}>
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            onClick={() => moveStep(i, "down")}
            disabled={i === config.steps.length - 1}
            className="h-3.5 w-4 flex items-center justify-center rounded disabled:opacity-20"
            style={{ color: 'hsl(var(--sidebar-muted))' }}>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Label input */}
        <input
          value={step.label}
          onChange={(e) => renameStep(i, e.target.value)}
          className="flex-1 h-7 rounded-md border px-2"
          style={{
            borderColor: 'hsl(var(--sidebar-border))',
            backgroundColor: 'hsl(var(--sidebar-surface))',
            color: 'hsl(var(--sidebar-foreground))',
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            outline: 'none',
          }} />

        {/* Base indicator / toggle */}
        <button
          onClick={() => !step.isBase && setBase(i)}
          title={step.isBase ? "Base step (body size)" : "Set as base"}
          className="h-5 w-5 flex items-center justify-center rounded-full text-[9px] font-bold shrink-0"
          style={{
            backgroundColor: step.isBase ? 'hsl(var(--sidebar-accent))' : 'transparent',
            color: step.isBase ? 'hsl(var(--sidebar-background))' : 'hsl(var(--sidebar-muted))',
            border: `1px solid ${step.isBase ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-border))'}`,
            cursor: step.isBase ? 'default' : 'pointer',
          }}>
          B
        </button>

        {/* Remove */}
        <button
          onClick={() => removeStep(i)}
          disabled={config.steps.length <= 1}
          className="h-5 w-5 flex items-center justify-center rounded disabled:opacity-20"
          style={{ color: 'hsl(var(--sidebar-muted))' }}>
          <X className="h-3 w-3" />
        </button>
      </div>
    ))}

    {/* Add step */}
    <button
      onClick={addStep}
      className="flex items-center gap-1 mt-2 transition-opacity hover:opacity-100"
      style={{ fontSize: '10px', color: 'hsl(var(--sidebar-muted))', opacity: 0.6 }}>
      <Plus className="h-3 w-3" />
      Add step
    </button>
  </AccordionContent>
</AccordionItem>
```

**Step 4: Add "steps" to the `defaultValue` of the `Accordion`**

Find:
```typescript
<Accordion type="multiple" defaultValue={["scale", "body", "headings"]}
```
Change to:
```typescript
<Accordion type="multiple" defaultValue={["scale", "steps", "body", "headings"]}
```

**Step 5: Manual test**
- Add a new step → appears at bottom with "custom-..." label
- Rename it → label updates in the scale table immediately
- Move it up → it moves up, font size updates
- Mark it as base (B button) → previous base loses B, this step is now body size
- Remove a step → step disappears from table

**Step 6: Commit**

```bash
git add src/components/ControlsPanel.tsx
git commit -m "feat: add Scale Steps management UI (add, remove, rename, reorder)"
```

---

## Task 8: Add viewport device frame toggle to `LandingPagePreview.tsx`

**Files:**
- Modify: `src/components/LandingPagePreview.tsx`

**Step 1: Add imports**

Add to existing imports:
```typescript
import { useRef, useEffect, useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
```
(If `useMemo` is already imported, add the others to the same line.)

**Step 2: Add local state and ref inside the component (after `const { config, updateConfig } = useAppConfig()`)**

```typescript
type ViewportMode = "mobile" | "tablet" | "desktop";
const [viewport, setViewport] = useState<ViewportMode>("desktop");
const [scaleFactor, setScaleFactor] = useState(1);
const containerRef = useRef<HTMLDivElement>(null);
```

**Step 3: Add `ResizeObserver` effect**

```typescript
const FRAME_WIDTHS: Record<ViewportMode, number | null> = {
  mobile: 390,
  tablet: 768,
  desktop: null,
};

useEffect(() => {
  const frameWidth = FRAME_WIDTHS[viewport];
  if (!frameWidth || !containerRef.current) {
    setScaleFactor(1);
    return;
  }
  const observer = new ResizeObserver(([entry]) => {
    const available = entry.contentRect.width - 48; // account for padding
    setScaleFactor(Math.min(1, available / frameWidth));
  });
  observer.observe(containerRef.current);
  return () => observer.disconnect();
}, [viewport]);
```

**Step 4: Add viewport toggle buttons to the header bar**

Find the header `<div>` containing `"Live Preview"` label and the preview mode `<Select>`.

Insert between them:
```tsx
{/* Viewport toggle */}
<div className="flex items-center gap-0.5 rounded-md border p-0.5"
  style={{ borderColor: 'hsl(var(--border))' }}>
  {([
    { mode: "mobile" as const,  Icon: Smartphone, label: "Mobile"  },
    { mode: "tablet" as const,  Icon: Tablet,     label: "Tablet"  },
    { mode: "desktop" as const, Icon: Monitor,    label: "Desktop" },
  ] as const).map(({ mode, Icon, label }) => (
    <button
      key={mode}
      onClick={() => setViewport(mode)}
      title={label}
      className="h-6 w-6 flex items-center justify-center rounded transition-colors"
      style={{
        backgroundColor: viewport === mode ? 'hsl(var(--accent))' : 'transparent',
        color: viewport === mode ? 'hsl(var(--accent-foreground))' : 'hsl(var(--muted-foreground))',
      }}>
      <Icon className="h-3.5 w-3.5" />
    </button>
  ))}
</div>
```

**Step 5: Wrap the preview content area with the device frame logic**

Find the outer scrollable div (currently `<div className="flex-1 overflow-auto bg-muted/40 p-6" ...>`).

Replace that div and everything inside with:

```tsx
<div
  ref={containerRef}
  className="flex-1 overflow-auto bg-muted/40"
  style={{ padding: viewport === "desktop" ? "24px" : "24px 0 24px" }}
>
  {viewport === "desktop" ? (
    // Desktop: current full-width layout
    <div
      className="mx-auto max-w-4xl rounded-lg shadow-sm border border-border overflow-hidden"
      style={{ backgroundColor: config.body.backgroundColor }}
    >
      {/* ← all existing preview content goes here unchanged → */}
    </div>
  ) : (
    // Mobile / Tablet: centered device frame
    <div className="flex justify-center">
      <div style={{
        width: FRAME_WIDTHS[viewport]!,
        transform: `scale(${scaleFactor})`,
        transformOrigin: "top center",
        // Compensate for scale shrink so container height matches visual height
        marginBottom: `calc(${FRAME_WIDTHS[viewport]}px * ${scaleFactor - 1})`,
      }}>
        {/* Device frame */}
        <div style={{
          borderRadius: viewport === "mobile" ? 40 : 20,
          border: `2px solid hsl(var(--border))`,
          overflow: "hidden",
          backgroundColor: config.body.backgroundColor,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}>
          {/* Notch bar (mobile only) */}
          {viewport === "mobile" && (
            <div style={{
              height: 32,
              backgroundColor: config.body.backgroundColor,
              borderBottom: `1px solid hsl(var(--border))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                width: 80,
                height: 10,
                borderRadius: 8,
                backgroundColor: "hsl(var(--border))",
              }} />
            </div>
          )}
          {/* Preview content — same as desktop but inside frame */}
          <div style={{ backgroundColor: config.body.backgroundColor }}>
            {/* ← all existing preview content goes here unchanged → */}
          </div>
        </div>
      </div>
    </div>
  )}
</div>
```

> **Note:** The preview content (navbar, hero, sections etc.) is duplicated between the desktop and device frame branches above. To avoid duplication, extract the preview content into a local variable before the return statement:
>
> ```typescript
> const previewContent = (
>   <>
>     {/* all existing JSX content */}
>   </>
> );
> ```
>
> Then reference `{previewContent}` in both branches.

**Step 6: Test all three viewports**
- Desktop: full width preview, no frame
- Tablet: 768px wide, rounded border frame, no notch
- Mobile: 390px wide, rounded border frame, notch bar at top
- Resize the panel → scale factor adjusts so frame always fits

**Step 7: Commit**

```bash
git add src/components/LandingPagePreview.tsx
git commit -m "feat: add mobile/tablet/desktop viewport device frame to live preview"
```

---

## Task 9: Verify complete build and smoke test

**Step 1: Full build**

```bash
npm run build
```

Expected: Clean build, no TypeScript errors.

**Step 2: Manual smoke test checklist**
- [ ] Default 9-step scale renders correctly in all panels
- [ ] Adding a step: appears at bottom of scale table and Controls
- [ ] Renaming a step: updates everywhere (scale table, live preview, export)
- [ ] Moving a step up/down: font sizes shift accordingly
- [ ] Setting a new base (B): body size stays correct
- [ ] Removing a step: disappears cleanly, no crash if a live preview referenced it
- [ ] Export CSS variables use step `id` not `label`
- [ ] Viewport mobile: phone frame visible, content narrowed to 390px
- [ ] Viewport tablet: tablet frame visible, content narrowed to 768px
- [ ] Viewport desktop: current full-width layout
- [ ] Resizing panel: frame scales down to fit
- [ ] Config persists in localStorage (reload page, steps are restored)

**Step 3: Final commit**

```bash
git add -p  # stage any remaining changes
git commit -m "feat: dynamic scale steps and viewport device preview complete"
```
