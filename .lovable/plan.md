

# Type Scale Generator App

A professional design utility tool for generating, previewing, and exporting typographic scales.

## Layout
Three-panel layout (responsive: stacks on mobile):
- **Left**: Settings/Controls panel (sticky on desktop)
- **Center**: Type Scale Preview table
- **Right**: Live Landing Page Preview

## Features

### 1. Scale Controls
- Base font size input (10–24px, default 16px) with stepper buttons
- Scale ratio dropdown with 8 presets (Minor Second through Golden Ratio, default Minor Third 1.200)
- Unit toggle: rem / px / pt (display only, logic stays in px)
- All changes update previews instantly

### 2. Scale Calculation
- Generate sizes for h1–h6, p, small, xs using modular scale formula (base × ratio^n)
- Store in px, derive rem and pt for display
- Smart rounding (3 decimals rem, 2 decimals px/pt, strip trailing zeros)

### 3. Typography Settings
- **Body**: font family, weight, line height, letter spacing, text color, background color
- **Headings**: toggle inherit from body, or set custom font/weight/line-height/letter-spacing/color
- Font choices: Inter, Roboto, Open Sans, System UI, Helvetica Neue, Arial, Georgia

### 4. Responsive Settings
- Toggle responsive mode with breakpoint, alternate base size, and scale ratio
- Generates secondary scale for export

### 5. Type Scale Preview (Center Panel)
- Rows for each token (h1–xs) showing label, computed size, and live text preview
- Uses selected font and styles, hover highlight on rows

### 6. Live Landing Page Preview (Right Panel)
- Mini SaaS landing page with navbar and hero section
- Updates live with all typography and color settings
- Decorative elements for modern feel

### 7. Export Panel
- Tabs for CSS Variables, JSON Design Tokens, and Tailwind config
- Copy-to-clipboard with success toast
- Includes responsive media queries if enabled

### 8. Persistence & Theme
- localStorage for all settings, restore on reload, reset button
- Light/dark mode toggle

## State Management
- React Context for app config state
- Config object holding all settings (base size, ratio, unit, body/heading styles, responsive, theme)

## Component Structure
- `AppShell` → three-panel layout
- `ControlsPanel` → all input sections
- `TypeScalePreview` → token table with `TypeRow` components
- `LandingPagePreview` → navbar + hero preview
- `ExportPanel` → tabbed code blocks with copy buttons
- Utility functions: `calculateTypeScale`, `formatUnit`, `generateCssVariables`, `generateJsonTokens`, `generateTailwindConfig`

## Design Direction
- Minimal, design-tool inspired, crisp and professional
- Neutral grays, generous whitespace, clear borders, medium-radius cards
- Google Fonts loaded for Inter, Roboto, Open Sans

