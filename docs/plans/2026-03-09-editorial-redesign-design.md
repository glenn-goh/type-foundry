# Type Foundry — Editorial Redesign Design

**Date:** 2026-03-09
**Approach:** Full Restyle + Controls Reorganization (Approach 2)

---

## Aesthetic Direction

**Editorial / Refined Precision** — dark sidebar, light canvas. Feels like a professional design tool: precise, intentional, and built for craftspeople. Amber accent nods to printer's marks and typographic heritage.

---

## Visual System

### Typography

| Role | Font | Size |
|------|------|------|
| Logo / token labels / size values | DM Mono | 10–13px |
| UI labels / buttons / section headers | DM Sans | 10–12px |
| Section headers (uppercase) | DM Sans | 10px, tracked |

Both fonts loaded from Google Fonts and added to `index.css`.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--sidebar-bg` | `#0e1117` | Left panel background |
| `--sidebar-surface` | `#161b27` | Input backgrounds, accordion header hover |
| `--sidebar-border` | `#1e2535` | Dividers, input borders |
| `--sidebar-text` | `#e2e8f0` | Primary text in sidebar |
| `--sidebar-muted` | `#64748b` | Labels, secondary text |
| `--accent` | `#e8a020` | Active states, focus rings |
| `--canvas-bg` | `#f7f6f2` | Main content + live preview background |
| `--canvas-border` | `#e4e1da` | Panel borders on light side |
| `--canvas-text` | `#1a1814` | Near-black warm text |

### Spacing System (8px grid)

| Context | Value |
|---------|-------|
| Section padding | 16px |
| Control-to-control gap | 8px |
| Label-to-input gap | 6px |
| Intra-section gaps | 12px |
| Type row padding | `px-4 py-3` |
| Panel headers | `h-10 px-4` |

---

## Sidebar Redesign (`ControlsPanel.tsx`)

### Persistent Header (not scrollable)
- Left: `⌨ Type Foundry` in DM Mono, warm white
- Right: Share icon button + Theme toggle icon button

### Accordion Sections

Each section is independently collapsible with a chevron on the right side of the header.

#### 1. Scale (open by default)
- **Base Font Size**: single row — `−` button · value display · `+` button · `px` label flush right
- **Scale Ratio**: dropdown select
- **Custom ratio input**: appears inline when "Custom..." selected
- **Unit**: 3-button group (rem / px / pt)
- **Rounding**: 3-button group (Off / 4 / 8)
- **Compare Mode**: toggle switch moved here (it is a scale-level setting, not buried below ratio)
- **Compare Ratio**: appears inline when Compare Mode is enabled
- **Reset**: small `↺ Reset to defaults` ghost text-link at section bottom

#### 2. Body (open by default)
- Font Family selector
- Weight slider with inline value label (`Weight: 400`)
- Line Height + Letter Spacing: 2-col grid
- Text Color + Background: 2-col grid (color swatch + hex value)

#### 3. Headings (open by default)
- Header row: "Headings" label + "Inherit body" toggle on the right
- Conditional controls (when not inheriting): Font Family, Weight, Line Height, Letter Spacing, Color

#### 4. Advanced (collapsed by default)
- Responsive: toggle + breakpoints when enabled
- Library: presets dropdown + saved systems (name input + save + list)

---

## Type Scale Panel (center)

- Background: `--canvas-bg` (`#f7f6f2`)
- **Header**: `Type Scale` label + preview text input right-aligned in the same row (saves vertical space)
- **Type rows**: token in DM Mono muted · size in DM Mono muted · preview text full-width
- **Hover**: subtle `#f0ece4` background
- **Bottom tabs**: Graph / Compare / Responsive — DM Sans labels, cleaner styling

---

## Live Preview Panel (right)

- Background: `--canvas-bg` (`#f7f6f2`)
- **Header**: collapse button · `Live Preview` label · preview mode selector

---

## Files to Change

| File | Change |
|------|--------|
| `src/index.css` | New Google Fonts (DM Mono + DM Sans), new CSS variables for sidebar and canvas colors, updated spacing tokens |
| `src/components/ControlsPanel.tsx` | Full rework: accordion sections, reorganized controls, new visual system |
| `src/components/TypeScalePreview.tsx` | Canvas background, header with inline preview input, restyled rows and tabs |
| `src/components/LandingPagePreview.tsx` | Canvas background, header styling |
| `src/pages/Index.tsx` | Sidebar background class, border color |

No new files. No changes to logic, context, or data layer.

---

## Out of Scope

- No changes to export functionality
- No changes to type scale calculation logic
- No changes to routing or app architecture
- No mobile-specific layout changes (existing responsive behavior preserved)
