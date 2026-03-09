# Design: Dynamic Scale Steps & Viewport Device Preview

**Date:** 2026-03-09
**Status:** Approved

---

## Overview

Two features to add to TypeForge:

1. **Dynamic Scale Steps** — Allow users to add, remove, rename, and reorder type scale steps (currently fixed as h1–h6, p, small, xs).
2. **Viewport Device Preview** — A mobile/tablet/desktop toggle in the live preview panel that wraps the preview in a CSS device frame and scales it to fit the panel.

---

## Feature 1: Dynamic Scale Steps

### Data Model

Replace the fixed `ScaleToken` union type in `types.ts` with a `ScaleStep` interface and store an ordered array in `AppConfig`:

```typescript
interface ScaleStep {
  id: string       // stable unique ID used in CSS vars and exports (e.g. "h1", "display-1")
  label: string    // editable display name shown in UI and scale table
  isBase: boolean  // exactly one step is marked as base (exponent 0 = baseFontSize)
}
```

The `AppConfig` gains a new `steps: ScaleStep[]` field. The default value mirrors the current 9-step scale so existing users see no change.

### Exponent Assignment

Exponents are derived at render time from position relative to the base step:

- Base step (`isBase: true`) → exponent `0` (renders at exactly `baseFontSize`)
- Steps above base → exponent `+1`, `+2`, `+3`... (count from base upward)
- Steps below base → exponent `−1`, `−2`, `−3`... (count from base downward)

Reordering changes which step occupies which position, thus changing which label maps to which size. This is intentional: position determines size.

### Default Steps

```
[ h1, h2, h3, h4, h5, h6, p (base), small, xs ]
```

### UI: Scale Steps Section in ControlsPanel

A "Scale Steps" section (below the existing scale ratio controls) shows the ordered list:

- Each row: drag handle | editable label input | base indicator (if base) | remove button
- The base step cannot be removed while it is the only base. To remove it, another step must be designated base first (or the nearest step auto-promotes).
- An **"Add step"** button appends a new step to the bottom with a generated default label (e.g. "custom-1").
- Drag-and-drop reordering (using existing shadcn/dnd or a simple up/down arrow fallback).

### Export Continuity

CSS variable names use `id`, not `label`:

```css
--font-size-h1: 3.052rem;
--font-size-p: 1rem;
```

Renaming a step (changing `label`) does not break existing exports. The `id` is set once on creation and never changes.

### Affected Files

- `src/lib/types.ts` — add `ScaleStep` interface, update `AppConfig`, update defaults
- `src/lib/scale-utils.ts` — replace hardcoded exponent map with positional calculation
- `src/context/AppConfigContext.tsx` — add `updateSteps()` method, migrate defaults
- `src/components/ControlsPanel.tsx` — add Scale Steps UI section
- `src/components/TypeScalePreview.tsx` — consume dynamic steps array
- `src/components/LandingPagePreview.tsx` — consume dynamic steps array
- All export generators in `scale-utils.ts` — use `step.id` for var names

---

## Feature 2: Viewport Device Preview

### UI

A three-button toggle at the top of `LandingPagePreview`, alongside the existing preview mode selector:

```
[ 📱 Mobile ]  [ ⬜ Tablet ]  [ 🖥 Desktop ]
```

Desktop is the default.

### Device Frame Specs

| Viewport | Inner Width | Border Radius | Frame Style |
|----------|-------------|---------------|-------------|
| Mobile   | 390px       | 40px          | Thin border, top notch bar |
| Tablet   | 768px       | 20px          | Slightly thicker border |
| Desktop  | Full width  | 0             | No frame (current behavior) |

### Scaling to Fit Panel

The frame + content is scaled down using CSS `transform: scale(X)` so it always fits the panel without horizontal overflow:

```
scaleX = panelWidth / frameWidth
```

A `ResizeObserver` on the panel container keeps this factor reactive when the user resizes the panel.

### Scrolling

The inner content div scrolls vertically (`overflow-y: auto`). The device frame itself does not scroll — only the content inside it.

### Responsive Scale Integration

When the app's responsive breakpoints feature is enabled:
- Switching to Mobile → applies the mobile breakpoint's `baseFontSize` and `scaleRatio`
- Switching to Tablet → applies the tablet breakpoint's config
- Switching to Desktop → applies the desktop breakpoint's config

When responsive mode is disabled, the viewport toggle is purely visual (frame only, no scale change).

### State

Local `useState<"mobile" | "tablet" | "desktop">` in `LandingPagePreview.tsx`. Not persisted to `AppConfig` — this is a transient UI preference.

### Affected Files

- `src/components/LandingPagePreview.tsx` — viewport toggle state, frame wrapper, scale calculation, ResizeObserver

---

## Out of Scope

- Saving viewport mode to config or URL params
- Custom device dimensions
- Tablet landscape orientation
- iframe-based preview isolation
