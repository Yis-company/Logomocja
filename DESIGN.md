---
name: Logomocja
description: A quiet Polish turtle workshop, with live geometric specimens beside their recipes.
colors:
  primary: "#187552"
  leaf: "#d7e7b7"
  paper: "#f5f5ef"
  surface: "#fcfcf8"
  ink: "#283d36"
  muted: "#6c786e"
  line: "#dcdfd5"
  editor: "#202c29"
  code: "#e2e8dd"
  focus: "#c17a3d"
typography:
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "29px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-1px"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  code:
    fontFamily: "LogoMono, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "26px"
rounded:
  control: "6px"
  workbench: "10px"
spacing:
  tight: "8px"
  regular: "16px"
  shell: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "8px 14px"
    height: "38px"
  button-run:
    backgroundColor: "{colors.leaf}"
    textColor: "#243e30"
    rounded: "{rounded.control}"
    padding: "8px 14px"
---

# Design System: Logomocja

## Overview

**Creative North Star: "A living geometry index"**

A botanical learning index contributes pine ink, pale leaf, paper and compact specimen previews. Familiar application controls carry the task. The actual turtle geometry is the signature: previews are executed programs, and the primary canvas is always the work itself.

The interface stays quiet during sustained editing. A dark editor separates the recipe from the light drawing surface. The dark theme retains the green family and the same hierarchy. Every font and asset ships locally.

**Key Characteristics:**
- Code and geometric consequence share the workspace.
- Pine and leaf carry navigation and execution state.
- Linework is exact output, never illustrative decoration.
- Flat surfaces, fine rules and compact controls.

## Colors

Primary green marks active navigation and actions. Pale leaf distinguishes Run within the dark editor. Paper and surface separate the application shell from the canvas. Ink and muted text provide hierarchy; fine neutral rules divide functional areas.

The editor uses its own persistent dark ground and a restrained syntax palette: yellow-green commands, peach numbers, mint strings and subdued comments. Focus is copper. Errors use warm red and always include a textual position and explanation.

Dark mode uses background #17231f, surface #202b27, ink #e0e8d8, secondary text #a5b4a4 and accent #a8cd8c. User-selected drawing colors remain their true values.

**The True Geometry Rule.** Interface themes never recolor a user's drawing.

## Typography

**Display and Body Font:** locally hosted Manrope. Its open, rounded forms make the shell approachable without decorative lettering.

**Label/Mono Font:** locally hosted DejaVu Sans Mono, exposed as LogoMono. Used for code, coordinates, keyboard notation and measurement.

Hierarchy: workspace heading 29px / 650; mobile heading 25px; section title 17px / 600; primary prose and controls 12–14px; compact supporting information 9–11px. Reference text uses 14px and 1.8 line height with a maximum 75-character measure. Editor text is 12px / 26px, growing to 13px / 28px on wide screens and using 24px line height on phones.

## Layout

Desktop shell has 40px side padding and a maximum 1600px width. The editor and canvas form one workbench, split approximately 38/62; on large screens the editor is 440px. Execution controls sit beneath the editor. View controls sit on the canvas. Four compact example rows lead into the library.

At 1100px shell padding reduces to 25px. At 720px it becomes 16px; navigation remains at the top, editor and canvas stack, and example previews form two columns. The drawing refits when its viewport changes. Hidden canvases are excluded from fitting.

## Elevation & Depth

Main surfaces use a single fine border. Floating canvas controls use a low offset shadow, `0 3px 10px #243b2710`; status toasts use `0 6px 24px #172a2228`. No embossed or simulated paper materials.

## Shapes

Controls have gently rounded 6px corners, the unified workbench 10px. Small tags use 3px corners. Turtle, file and control icons share authored SVG strokes. The actual turtle marker is a directional Canvas shape, with an additional up-vector indicator in 3D.

## Components

### Buttons

Primary actions fill green; Run uses pale leaf against the dark editor. Secondary controls use the surface ground and a fine rule. Focus is a 3px copper outline with a 4px offset. Hover changes the ground. Most actions are at least 38px high; compact editor actions retain clear labels and keyboard access.

### Navigation

Four conventional text tabs. Active state uses green text and a bottom rule. Mobile navigation fits the available width and can scroll at narrower sizes.

### Editor

A labelled textarea and aligned syntax layer share font metrics. Line numbers are separate and scroll in sync. Execution highlights the current line, including stepping. Errors underline the token with a wavy stroke and show line, column and Polish explanation beneath the editor. Editing invalidates paused execution while preserving the drawing.

### Canvas

A dotted measurement field in 2D; projected ground grid and XYZ axes in 3D. The origin remains visible. Zoom, fit and camera reset controls use a compact floating toolbar. The 3D pan toggle is explicit, including on touch screens. Every spatial operation also has keyboard controls.

### Examples and challenges

Real interpreter output provides every preview. Examples preserve the previous draft. Challenges show a geometric target, task description and an inline result. Completion is textual and persisted locally.

### Motion

150–200ms transitions communicate control state and toast appearance. A small pulsing execution dot indicates running. Reduced motion disables authored animation and transitions. There is no entrance sequence.

## Do's and Don'ts

### Do:
- **Do** use actual interpreted geometry for previews.
- **Do** keep errors positioned and written in Polish.
- **Do** preserve independent drafts and make recovery visible.
- **Do** retain the same navigation and controls across viewport sizes.

### Don't:
- **Don't** recolor drawing segments to match a theme.
- **Don't** simulate botanical materials or add decorative specimens.
- **Don't** use monospace for general interface prose.
