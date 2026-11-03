---
name: Logomocja
description: A Polish turtle-drawing studio set as a classroom wall chart, with an ink title band, the figure, and a numbered key.
colors:
  chart-green: "#16866a"
  chart-green-band: "#137a60"
  ultramarine: "#2b6fb3"
  ultramarine-band: "#2b68a8"
  ochre: "#c1763d"
  ochre-band: "#96561f"
  trunk-brown: "#6b4f2a"
  trunk-brown-band: "#5d4325"
  vermilion: "#b9341b"
  vermilion-wash: "#fbe8e2"
  printing-ink: "#15211d"
  ink-secondary: "#44524d"
  ink-tertiary: "#5c6a65"
  header-ink: "#14302a"
  chart-paper: "#eef1ec"
  sheet: "#fbfcfa"
  sheet-2: "#f5f7f3"
  canvas-paper: "#fcfdfb"
  rule: "#d3dad4"
  rule-strong: "#aeb9b2"
  grid: "#e6ebe6"
  grid-major: "#d4dcd5"
  exec-yellow: "#fff1c7"
  focus-blue: "#1f5d9e"
  on-band: "#ffffff"
typography:
  chart-title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 780
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 68"
  page-title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 780
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 68"
  section-title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 780
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 68"
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1
  code:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "24px"
  readout:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "'tnum'"
rounded:
  ctl: "5px"
  panel: "4px"
  menu: "8px"
  chip: "3px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  header: "52px"
  band: "56px"
  key: "44px"
components:
  button-run:
    backgroundColor: "{colors.chart-green-band}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.ctl}"
    padding: "0 16px"
    height: "36px"
    typography: "{typography.label}"
  button-run-3d:
    backgroundColor: "{colors.ultramarine-band}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.ctl}"
    padding: "0 16px"
    height: "36px"
  button-quiet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.printing-ink}"
    rounded: "{rounded.ctl}"
    padding: "0 12px"
    height: "36px"
    typography: "{typography.label}"
  button-check:
    backgroundColor: "{colors.ochre-band}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.ctl}"
    padding: "0 16px"
    height: "36px"
  segmented-mode-on:
    backgroundColor: "{colors.chart-green-band}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.ctl}"
    height: "30px"
  chart-band:
    backgroundColor: "{colors.chart-green-band}"
    textColor: "{colors.on-band}"
    height: "{spacing.band}"
    typography: "{typography.chart-title}"
  key-band:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.printing-ink}"
    height: "{spacing.key}"
  app-header:
    backgroundColor: "{colors.header-ink}"
    textColor: "{colors.on-band}"
    height: "{spacing.header}"
  tag-2d:
    backgroundColor: "{colors.chart-green-band}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.chip}"
  tag-3d:
    backgroundColor: "{colors.ultramarine-band}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.chip}"
  error-bubble:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.ctl}"
    padding: "6px 10px"
---

# Design System: Logomocja

## Overview

**Creative North Star: "The Classroom Wall Chart"**

Logomocja looks like the printed teaching charts (*plansze dydaktyczne*) that hung in Polish classrooms. The drawing area is the chart. It has a solid ink title band with the program's name in condensed capitals, a figure on gridded paper, and a key band that numbers each ink and says how much it drew. Everything else is a working editor and the controls people already know (buttons, a segmented switch, a slider, a disclosure menu), with no costume. The world contributes four things: type, palette, density and one signature move (the numbered callouts).

Colour is a set of flat spot inks taken from the language's own colours, and each ink belongs to one part of the app: chart green for 2D, ultramarine for 3D, ochre for challenges and trunk brown for the reference. The ground is cool, slightly green chart paper, never cream. The dark theme is the classroom blackboard, a green-black slate with the same inks lightened. Vermilion is used for errors only.

**Key Characteristics:**
- An ink title band on every chart and page, with condensed uppercase Archivo set at width 68%.
- Numbered roundel callouts with leader lines, keyed to the key band below the figure.
- Flat fills and 1px rules. Depth comes from popovers only.
- Each section owns one ink. The ink of the current mode drives the primary button, the band and the turtle.
- The figure gets the most room. The chrome sits at the edges.

## Colors

Flat printer's spot inks on cool chart paper, one ink per section of the app.

### Primary
- **Chart Green** (#16866a): the default pen colour and the 2D ink. The darker band shade (#137a60) fills the 2D title band, the Run button, the pressed 2D switch and the 2D tags. On the dark theme it lifts to #4cc59c.

### Secondary
- **Ultramarine** (#2b6fb3): the 3D ink, with #2b68a8 for its band and button. It also marks the z axis in 3D. Dark theme: #86b6ec.

### Tertiary
- **Ochre** (#c1763d): the challenge ink. It draws the dashed target pattern on the canvas, and the darker #96561f fills the challenges band and the Check button. It also marks the x axis in 3D.
- **Trunk Brown** (#6b4f2a): the reference ink, with #5d4325 for its band. It is the bark colour from the *drzewo* example.

### Neutral
- **Printing Ink** (#15211d): body text and the key band's 2px top rule.
- **Header Ink** (#14302a): the app header, toasts and the example-gallery band.
- **Ink Secondary / Tertiary** (#44524d / #5c6a65): secondary text, hints, axis labels and the grid scale note.
- **Chart Paper** (#eef1ec): the page ground. **Sheet** (#fbfcfa): panels, the editor and cells. **Canvas Paper** (#fcfdfb): the drawing surface.
- **Rules** (#d3dad4 / #aeb9b2) and **Grid** (#e6ebe6 minor / #d4dcd5 major): 1px separators and the chart's printed grid.
- **Exec Yellow** (#fff1c7 with #e0b33d rules): highlights the line being executed, like a highlighter on the listing.

### Named Rules
**The Vermilion Is for Errors Rule.** Vermilion (#b9341b, washed #fbe8e2) appears only for errors: the editor's wavy underline, the error bubble, the error status and destructive buttons. The error marker stays until the code is edited. Never use it for emphasis or decoration.

**The One Ink per Section Rule.** Each section owns one ink: 2D green, 3D ultramarine, challenges ochre, reference brown. The current mode's ink drives the primary button, the band and the turtle, and nothing else picks it up.

**The Program Owns Its Colours Rule.** Strokes always render in the colour the program set, in both themes. The UI never retints a learner's drawing.

## Typography

**Display Font:** Archivo Variable, condensed to width 68% (fallback: system-ui)
**Body Font:** Archivo Variable at normal width
**Mono Font:** JetBrains Mono Variable (code, readouts, colour hex values)

**Character:** One grotesque family in two widths. Condensed heavy capitals do the wall-chart lettering. The normal width carries every label and paragraph. The mono face is for code and numbers only.

### Hierarchy
- **Page Title** (780, 2.25rem, line-height 1, uppercase, width 68%): the band title on Przykłady, Zadania and Pomoc.
- **Chart Title** (780, 1.75rem, line-height 1, uppercase, width 68%): the program's name in the studio band. It truncates with an ellipsis and drops to 1.375rem on phones.
- **Section Title** (780, 1.375rem, uppercase, width 68%, with a 2px rule in the section ink): section headings in the gallery and the reference.
- **Body** (400, 0.9375rem, line-height 1.45; prose capped at 62ch with `text-wrap: pretty`).
- **Label** (650, 0.8125rem): buttons, nav links and the status line.
- **Code** (400, 14px, line-height 24px): the editor. Commands are 650 green, control words 750 violet-plum (#6e4789), numbers ochre-brown (#8a4b17), procedure names blue (#2b5f99), comments italic.
- **Readout** (400, 12px, tabular figures): the turtle's x, y, z, heading and pen state.

### Named Rules
**The Chart Lettering Rule.** Condensed capitals are for chart and page titles and section heads only. Labels, buttons and data are never condensed or uppercase.

**The No Kicker Rule.** No eyebrow or kicker labels above headings. The only thing beside a chart title is the bordered mode chip ("2D" or "3D"), placed inline after it.

## Layout

The studio fills the viewport below the 52px header. On desktop it is a two-column grid: the code panel takes `minmax(400px, 36%)` (42% below 1100px) and the chart takes the rest. The code panel stacks the head (mode switch and file menu), an optional challenge panel, the run bar, the editor (flexible height) and a 64px status line. The chart stacks a 56px ink band, the figure (flexible) and the key band (at least 44px). At 860px and below, the layout becomes one column with the chart first: band, a figure of `minmax(300px, 50vh)`, and the key. Under it come the code panel and a sticky run bar, with the editor at `max(300px, 52vh)`. The header wraps the navigation onto its own row of four equal tabs. Pages (examples, challenges, reference) use a full-bleed ink band, then a body capped at 1320px with `clamp(16px, 4vw, 48px)` side padding. Cell grids use `repeat(auto-fill, minmax(232px, 1fr))` (160px on phones). The reference uses a 210px sticky table of contents beside a 76ch article, which becomes a wrap of pill links on phones. Spacing steps are 4, 8, 12, 16, 24, 32 and 48px.

## Elevation & Depth

The system is flat. Panels, bands and cells sit on the paper, separated by 1px rules (#d3dad4) and one heavy 2px ink rule above the key band. The only shadow is the pop shadow, for things that float above the work: the file menu, the shortcuts popover, toasts and the error bubble.

### Shadow Vocabulary
- **Pop** (`box-shadow: 0 8px 24px -6px rgb(20 48 42 / 0.28), 0 2px 6px rgb(20 48 42 / 0.12)`): floating layers only.
- **Cell hover** (`box-shadow: 0 4px 14px -6px rgb(20 48 42 / 0.25)`): a gallery or challenge cell under the pointer.

### Named Rules
**The Printed Sheet Rule.** Surfaces at rest have no shadow and no gradient. A shadow means "this is floating" and nothing else.

## Shapes

The form language is the rectangular printed sheet. Bands and panels have square edges. Cells and code examples have barely softened corners (4px), controls 5px, menus and popovers 8px, tags and the mode chip 3px. The circles in the system are functional: the numbered callout roundels (11px radius, 1.5px ink stroke), the key's number roundels (21px), and the origin marker. The turtle is an arrowhead: a flat triangle with a notched tail in 2D, and the same arrowhead plus a translucent fin along its up vector in 3D, so roll is visible.

## Components

### Buttons
- **Shape:** gently squared (5px), 36px tall (30px for small).
- **Primary (Run):** the band shade of the current mode's ink, white label and icon, 0 16px padding. Hover darkens it by mixing 16% black, active by 28%.
- **Quiet (Step, Pause/Resume, Reset, Plik):** sheet fill with a 1px #aeb9b2 border. Hover moves to #f5f7f3 with an ink-tertiary border. Disabled drops to 42% opacity.
- **Band buttons:** transparent, with a white label and a 32% white border on the ink band. Pressed (aria-pressed) gets a 24% black overlay and a 75% white border.
- **Check (challenges):** ochre band fill (#96561f) with a white label.
- **Focus:** a 2px #1f5d9e outline with a 2px offset. On ink bands and the header the outline turns white.

### Segmented Mode Switch
A pill tray (#f5f7f3, 1px rule) holds two 30px buttons. The pressed one fills with its own mode's band ink: green for 2D, ultramarine for 3D. During a challenge the other mode is disabled.

### Editor
A native textarea over a highlighted mirror, so it keeps native undo, IME and screen-reader behaviour. A 3.4em gutter (#f1f4f0) holds tabular line numbers. The executing line gets an exec-yellow band with gold rules in both the gutter and the code. On an error, the line is washed vermilion, the token gets a wavy underline, and a vermilion bubble with an arrow appears under the column with the Polish message. Focus is shown as a 2px inset focus-blue ring.

### Chart Band and Key Band (signature)
The band is the current mode's ink with the condensed title and an inline bordered chip. The key band sits under a 2px printing-ink rule and lists each ink as a numbered roundel, a 22×10 swatch, the hex code in mono, and the segment count and length. The live turtle readout is right-aligned in tabular mono.

### Numbered Callouts (signature)
On the figure, each ink gets a roundel numbered in the order of first use. A 1px leader runs perpendicular to that ink's first stroke, on the side away from the drawing's centre, and the roundel moves aside when it would cover the turtle or another roundel. The Opisy button toggles them. They draw on the 2D canvas and on the 3D overlay, projected from the camera.

### Cells (examples and challenges)
A sheet rectangle (4px, 1px rule) with the program's real drawing rendered as the thumbnail on canvas paper, then the title, the mode tag and a one-line description. Hover darkens the border and adds the cell-hover shadow. Solved challenges get a green-tinted border and a "rozwiązane" status with a check.

### Navigation
The header is header ink, 52px tall. Links are 600 weight in #b5c8bf, turning white on hover. The current page gets white text and a 3px underline in its section's ink (light variants on the dark header: #4cc59c, #86b6ec, #e6a669, #d6b48a).

### Toasts
Header-ink pills at the bottom centre with an icon, the message, an optional quiet action ("Przywróć mój szkic") and a close button. They pause while hovered or focused.

## Do's and Don'ts

### Do:
- **Do** give every new surface an ink title band in its section's ink, with condensed caps at width 68% and weight 780.
- **Do** keep strokes in the program's own colours. Show the challenge target as a dashed ochre line (6/5 dash, 75% opacity).
- **Do** use standard controls: buttons, a segmented switch, a range slider, details/summary, a disclosure menu and native popovers.
- **Do** keep prose at 62ch with `text-wrap: pretty`, and keep UI text at 11px or larger.
- **Do** put state colour where state lives: exec yellow for the running line, vermilion for errors, green for done and passed.

### Don't:
- **Don't** use vermilion for anything but errors and destructive actions.
- **Don't** add eyebrows, kickers, gradient text, glass, colored side stripes or hard offset shadows.
- **Don't** fake material, such as wooden chart rods, paper grain or chalk texture. The world comes through in type, ink, density and the callouts only.
- **Don't** use violet or purple as a section ink. The reference moved to trunk brown for this reason.
- **Don't** put a cream or warm ground under the chart. The paper is cool and slightly green (#eef1ec), and the dark ground is slate green (#101a17).
