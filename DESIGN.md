---
name: Logomocja
description: A drafting sheet with a live title block — Polish turtle-drawing studio in 2D and 3D.
colors:
  rail: "#123a31"
  rail-ink: "#e6f0eb"
  ground: "#e9eee9"
  panel: "#f8faf7"
  panel-2: "#eef2ee"
  sheet: "#f6f8f2"
  ink: "#1b2422"
  ink-2: "#4c5955"
  line: "#cfd8d3"
  line-strong: "#aab7b1"
  frame: "#9aa8a2"
  pen: "#16866a"
  action: "#12765d"
  action-hover: "#0f6650"
  active: "#6a3fb5"
  error: "#b3372c"
  error-soft: "#fbe9e6"
  ok-soft: "#e3f2ec"
  warn: "#8a5a00"
  dark-ground: "#0c1210"
  dark-panel: "#131b18"
  dark-sheet: "#101714"
  dark-ink: "#e2ebe6"
  dark-action: "#1e9b7a"
  dark-active: "#b49cf2"
typography:
  ui:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  code:
    fontFamily: "ui-monospace, Cascadia Mono, SF Mono, Menlo, Consolas, Liberation Mono, monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: "21px"
  page-title:
    fontFamily: "{typography.ui.fontFamily}"
    fontSize: "24px"
    fontWeight: 700
    letterSpacing: "-0.015em"
  section-title:
    fontFamily: "{typography.ui.fontFamily}"
    fontSize: "21px"
    fontWeight: 700
    letterSpacing: "-0.01em"
  title-block-label:
    fontFamily: "{typography.ui.fontFamily}"
    fontSize: "10px"
    fontWeight: 400
    letterSpacing: "0.06em"
  title-block-value:
    fontFamily: "{typography.ui.fontFamily}"
    fontSize: "12px"
    fontWeight: 600
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 12px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 12px"
  rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.rail-ink}"
    height: "52px"
  sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "2px"
  title-block:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.title-block-value}"
---

# Design System: Logomocja

## Overview

Logomocja is a working tool first: a code editor on the left, a drawing on the right, standard controls everywhere. The world it borrows is the **technical-drawing sheet** (rysunek techniczny) that Polish pupils know from school: cool drafting paper, millimetre grid, rulers along the edges, an inner frame line, and the ruled **title block** (tabliczka rysunkowa) in the corner. The world contributes type, palette, density and that one signature move; it never dictates navigation or controls.

The title block is live: it reads out the sheet name, mode, scale, segment count, turtle position, heading and pen state while the program runs. Grid, rulers and origin cross are real measuring tools on a real canvas, not decoration.

## Colors

### Primary
- **Pen green** `#16866a` is the turtle's default ink and the brand. **Action green** `#12765d` (dark: `#1e9b7a`) fills the one primary button per area (Uruchom, Sprawdź) because white text on `#16866a` falls just under 4.5:1.

### Neutral
- A cool, faintly green neutral family: ground `#e9eee9`, panel `#f8faf7`, bar `#eef2ee`, sheet `#f6f8f2`, ink `#1b2422`, secondary ink `#4c5955`. Dark theme mirrors it on near-black green (`#0c1210` / `#131b18` / `#101714`).
- The **header rail** is deep green-graphite `#123a31` — the committed shell colour.

### Named Rules
- **The Copying-Pencil Rule.** Violet `#6a3fb5` (dark `#b49cf2`) means "executing now" and nothing else: the highlighted editor line, the turtle marker, the newest segment, the title block border while running or paused, `nrpowt` in the highlighter.
- **Red is for errors only.** `#b3372c` marks the error token, gutter number, inline bubble and status bar.
- Theme follows the system by default; the manual toggle cycles System → Jasny → Ciemny.

## Typography

One system sans for all UI, one system mono only for code (editor, examples, `kbd`). No display face. Fixed rem/px scale with small steps: 24 page title, 21–22 section/challenge title, 16 task text, 15 body, 13.5 secondary and code, 12 title-block values, 10 title-block labels (uppercase, 0.06em — they are table field labels, never kickers above headings). Tabular numerals everywhere.

## Layout

- Desktop studio: two columns, editor `minmax(340px, 40%)`, sheet takes the rest; status and run bar dock under the editor. The page itself never scrolls; the editor and sheet do.
- ≤ 860px: a Kod / Rysunek tab switch replaces the split; the dock (status + run bar) stays visible on both tabs; secondary run buttons become icon-only with screen-reader labels.
- Pages (Wyzwania, Pomoc) sit in a 1200px container with a sticky left list/TOC; prose capped at ~70ch.

## Elevation & Depth

Flat by default. Borders separate regions. Shadows only on things that float above the sheet: view tools (`0 2px 8px`), popovers and toasts (`0 6px 24px` + `0 1px 3px`). Never a border and a wide shadow together.

## Shapes

Radii: 6px controls, 8px cards and toasts, 12px popovers and the challenge panel, 2px on the sheet (paper has square corners). Pills only for small status badges.

## Components

### Buttons
Primary (action green, white text, 600), secondary (panel, 1px `line-strong` border), ghost (transparent, for icon actions in bars). Height 36px; icon + label; disabled at 45% opacity. Icons are one authored SVG set, 20×20 grid, 1.75 stroke.

### Navigation
Header rail links with a 2px pen-green underline on the current route. Hash routes: `#/`, `#/wyzwania[/id]`, `#/pomoc`.

### Editor
Textarea over a highlighted `<pre>`, gutter with line numbers, violet execution band, wavy red error underline plus a red bubble with the Polish message under the error line. Colour literals get an underline in their own colour.

### Title block (signature)
Ruled grid drawn with 1px gaps over ink, 1.5px outer border, labels over values; bottom-right of the sheet. Border turns violet while executing.

### Example cells
Whole-cell grid of thumbnails rendered from the programs themselves, with name, mode badge and one-line blurb.

## Do's and Don'ts

### Do:
- Keep the drawing the largest thing on screen.
- Use violet only for live execution state.
- Name errors with line, column and a recovery, in Polish.

### Don't:
- Don't add eyebrows/kickers, gradient text or decorative glass.
- Don't put coloured side stripes on list items or cards (the editor's execution band is a line highlight, not a stripe).
- Don't use mono outside code and keys.
- Don't introduce a second accent colour for decoration.
