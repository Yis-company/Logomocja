---
name: Logomocja
description: Polish turtle-graphics studio set like a two-colour school textbook.
colors:
  spot-green: "#0d6b55"
  spot-green-deep: "#0a5a47"
  spot-ink: "#0b5e4a"
  spot-tint: "#dcebe4"
  on-spot: "#f3f7f4"
  highlighter: "#f5c400"
  paper: "#f3f5f1"
  sheet: "#fbfcfa"
  panel: "#e8ebe5"
  panel-2: "#eef0eb"
  rule: "#d3d8d0"
  rule-strong: "#a3aca3"
  ink: "#17201c"
  ink-2: "#4b5650"
  ink-3: "#5c6660"
  danger: "#b42318"
  syntax-number: "#a1470f"
  syntax-name: "#2552a0"
  syntax-string: "#7a3a98"
typography:
  headline:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 900
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  pop: "10px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  bar: "52px"
  foot: "44px"
components:
  button-primary:
    backgroundColor: "{colors.spot-green}"
    textColor: "{colors.on-spot}"
    rounded: "{rounded.md}"
    height: "34px"
    padding: "0 12px"
  button-primary-hover:
    backgroundColor: "{colors.spot-green-deep}"
  button-secondary:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "34px"
    padding: "0 12px"
  button-secondary-hover:
    backgroundColor: "{colors.panel}"
  button-accent:
    backgroundColor: "{colors.spot-tint}"
    textColor: "{colors.spot-ink}"
    rounded: "{rounded.md}"
    height: "34px"
  button-quiet:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    height: "34px"
  exercise-number:
    backgroundColor: "{colors.spot-green}"
    textColor: "{colors.on-spot}"
    rounded: "{rounded.sm}"
    height: "26px"
  chip:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    height: "22px"
  catalog-cell:
    backgroundColor: "{colors.sheet}"
    padding: "14px 14px 16px"
---

# Design System: Logomocja

## Overview

**Creative North Star: "The Two-Colour Textbook"**

Logomocja is set like a Polish school maths textbook from the WSiP era: black ink and one spot green on cool uncoated paper. Drawings are figures with a number and a caption, tasks are numbered exercises, and the turtle is the only thing printed in highlighter yellow. It's a working studio, so it's dense: the editor and the sheet share the screen, and the toolbar rows on both panes line up exactly.

The world shows up as type, palette and one signature move: every drawing is captioned as a textbook figure (**Rys. N.** in spot green, then the title and live statistics). Navigation and controls stay standard web controls. There are no invented affordances, no decorative cards and no icon tiles. Dark theme is the same print on dark stock. Light/dark follows the system, with a manual toggle.

(The qualitative language here was inferred from the product brief. No interview was possible in this session.)

**Key Characteristics:**
- Spot green owns the header band, primary actions, figure and exercise numbers. Nothing else is green except syntax and drawings.
- Highlighter yellow means "now": the executing line and the turtle.
- The drawing sheet has a real measuring grid, an origin, axes and a scale bar (podziałka).
- Hairline rules divide everything; elevation is reserved for overlays.

## Colors

One spot colour plus ink on cool paper. Every other colour on screen is either the user's pen colour or a syntax/state colour doing a job.

### Primary
- **Textbook Spot Green** (spot-green): the header band, primary buttons (Uruchom, Kopiuj), the checked 2D/3D segment, exercise-number squares, solved chips, progress fill.
- **Spot Ink** (spot-ink): spot green as text on paper. Figure numbers, links, keyboard-shortcut labels, active table-of-contents item.
- **Spot Tint** (spot-tint): soft spot ground for the accent button (Sprawdź), callouts, the passing verdict, command-name chips in help.

### Secondary
- **Highlighter Yellow** (highlighter): reserved. Fill of the turtle marker and (at 28% alpha) the executing-line band in the editor and gutter.

### Neutral
- **Cool Paper** (paper): page ground. Slightly green-grey, never cream.
- **Sheet White** (sheet): drawing sheet, editor surface, cells, popovers.
- **Panel** (panel / panel-2): toolbars, gutter, hover fills. It's the second neutral layer.
- **Rule** (rule / rule-strong): hairline dividers; strong rule for control borders and axes.
- **Ink** (ink / ink-2 / ink-3): text, secondary text, gutter numbers and comments. All are at least 4.5:1 on their grounds.
- **Danger Red** (danger): error text, error underline, error band (at 9% alpha).

### Named Rules
**The One Spot Rule.** The shell is printed in ink plus one spot green. A new UI colour has to carry state or data, never decoration.

**The Highlighter Rule.** Yellow marks only what's happening now (the executing line and the turtle). It's never used for brand, emphasis or hover.

## Typography

**Body Font:** Lato (Łukasz Dziedzic's Polish-designed face), with system-ui fallback.
**Label/Mono Font:** JetBrains Mono, for code, key names and the permalink field.

**Character:** One workhorse sans carries everything from the 30px page headline to 12px chips. Weight does the ranking (400 / 700 / 900), not size jumps. Mono appears only where it means code. Both families are self-hosted with latin-ext glyphs for Polish diacritics.

### Hierarchy
- **Headline** (900, 30px, 1.15, −0.02em): page titles (Przykłady, Zadania, Pomoc).
- **Title** (900, 22px): help sections, under a 2px ink rule. Task titles are 18px/900.
- **Body** (400, 15px, 1.5): prose capped at 68–74ch. Status and caption run at 13.5–14px.
- **Label** (700, 14px): buttons, nav (14.5px), segmented control (900).
- **Code** (400, 14px / 22px line): editor and samples. Ligatures off, so every glyph sits on the character grid.

### Named Rules
**The Weight-Not-Size Rule.** Rank with Lato's 700 and 900 inside a tight 12–30px range. Don't add display sizes to working screens.

## Layout

The studio is a two-pane grid: code 42fr (min 360px) and sheet 58fr, filling the viewport below a 52px band. Toolbar rows are 52px on both panes and footer rows are 44px (status/file bar on the left, figure caption on the right), so the panes line up exactly. Spacing runs on a 4px base (4/8/12/16/24). Pages (gallery, tasks, help) sit in a 1240px column. Help uses a 210px sticky table of contents plus a 74ch column.

At ≤860px the panes stack into one column: the task panel first, then the sheet (52vh, min 260px), caption, run bar as a 4-column grid, editor (min 280px), status and a wrapping file bar. The nav moves to its own scrollable row inside the band.

**The Registration Rule.** Rows that face each other across panes share one height. A new bar takes 52px or 44px, nothing in between.

## Elevation & Depth

Flat by default, with depth from tonal layers (paper, panel, sheet) and hairline rules. Shadows exist only on things that float above the work: popovers, toasts and the no-WebGL notice (`0 10px 28px rgb(23 32 28 / .16), 0 2px 6px rgb(23 32 28 / .08)`).

**The Print Rule.** Surfaces at rest have no shadow. Use one border or one shadow, never both on a resting element.

## Shapes

Small, consistent corners: 6px for controls and samples, 4px for exercise numbers and thumbnail grounds, 8px for the segmented control and callouts, 10px for popovers, full pills only for chips. The example and task catalogues are packed whole-cell grids divided by 1px rules, with no gaps and no cards.

## Components

### Buttons
- **Shape:** gently squared (6px), 34px tall, icon plus label, 18px stroke icons.
- **Primary:** spot green with paper text. Hover goes to the deeper green.
- **Secondary:** sheet ground, strong-rule border, ink label. Hover fills panel.
- **Accent:** spot tint with a spot-ink border and label (Sprawdź).
- **Quiet:** borderless ink-2 label (file bar, task back-link).
- **Disabled:** 45% opacity, not-allowed cursor. **Focus:** 2px spot-ink outline, offset 2px, on every control.

### Segmented control (2D / 3D)
Native radios inside a 2px-padded rule frame. The checked segment fills with spot green, and disabled segments (inside a task) fade to 40%.

### Editor
Textarea over a highlighted overlay, with a panel-coloured gutter. Commands are spot-ink bold, numbers burnt orange, names blue, colour strings purple with a 3px underline in their own colour, comments italic ink-3. Errors get a wavy red underline at the token, a red band, and an inline message after the line text that stays until that line is edited.

### Figure caption (signature)
**Rys. N.** (spot ink, 900), then the title (700) and tabular-numeral statistics (odcinki · łączna długość · operacje · mode) in ink-2, in a 44px footer under the sheet. The 2D sheet carries a matching scale bar at bottom left.

### Exercise number
A 26px spot-green square with a 900-weight paper numeral, placed before task titles and in catalogue cells.

### Navigation
Paper-on-green links in the band. The active link gets a 3px paper underline, and inactive links sit at 90% paper.

### Toast
Ink ground with paper text, 8px radius, optional restore action. It sits bottom-right above the footer row on desktop and full width on mobile.

## Do's and Don'ts

### Do:
- **Do** caption every drawing as a numbered figure, and number every task like a textbook exercise.
- **Do** keep the shell to ink plus spot green, with state colours only where they mean something.
- **Do** keep facing bars at 52px and footers at 44px across panes.
- **Do** use hairline rules (1px rule) to divide regions and packed whole-cell grids for catalogues.

### Don't:
- **Don't** use highlighter yellow for anything except the executing line and the turtle.
- **Don't** add shadows to resting surfaces or wrap content in cards.
- **Don't** set UI labels in the mono face. Mono is for code, keys and data only.
- **Don't** use cream paper or a dark-IDE-with-neon look. Both are refused by this world's thesis.
