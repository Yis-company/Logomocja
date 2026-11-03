---
name: Logomocja
description: A precise, welcoming turtle programming workbench.
colors:
  primary: "#16866a"
  primary-hover: "#106c54"
  primary-soft: "#e5f1e9"
  primary-ink: "#14694f"
  shell: "#f4f4ef"
  panel: "#ffffff"
  canvas: "#fcfcfa"
  ink: "#252b28"
  muted: "#626b61"
  line: "#e1e5dd"
  grid: "#e9ece6"
  tip: "#edeee5"
  error: "#b1403c"
  error-bg: "#fdf0eb"
  code-number: "#9b6338"
  code-name: "#70619b"
  dark-shell: "#1c221f"
  dark-panel: "#252d28"
  dark-canvas: "#222a25"
  dark-ink: "#e3e9e2"
  dark-muted: "#acb5aa"
  dark-line: "#3c473e"
  dark-primary: "#69c9a5"
  dark-primary-soft: "#314b3c"
typography:
  title:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "25px"
    fontWeight: 750
    lineHeight: 1.3
    letterSpacing: "-0.8px"
  body:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 650
    lineHeight: 1.5
  code:
    fontFamily: "JetBrains Mono Variable, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "26px"
  reference-title:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "37px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-1px"
rounded:
  control: "6px"
  item: "8px"
  workbench: "10px"
  dialog: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  workspace: "28px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.panel}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
  navigation-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-ink}"
    padding: "11px 16px"
  example-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.item}"
---

# Design System: Logomocja

## Overview

**Creative North Star: "The geometry workbench"**

A working studio that puts the learner's source and its geometric consequence together. Clear type, measured spacing and ordinary controls make the interface familiar; the turtle's actual drawing gives it character. Nostalgia appears in the language and the little turtle mark, rather than simulated retro chrome.

The shell is quiet and warm, with a forest teal used for action, selection and execution. A dark green neutral palette follows system preference or the learner's manual choice. Both themes keep the same layout and semantic roles.

**Key Characteristics:**
- Live geometry leads; controls support it.
- Flat surfaces with fine shared dividers.
- Local sans typography, with monospace reserved for code and coordinates.
- Teal action and selection; explicit Polish error recovery.

## Colors

### Primary

Forest teal identifies the primary execution action, current mode, selected example and focused controls. Pale mint carries selection without competing with the drawing. Deep teal provides readable text on pale selection surfaces.

### Neutral

The warm shell separates navigation from white editing panels and the paper-white canvas. Muted green gray labels remain readable on the shell and teaching tip. Fine neutral borders divide work areas. Dark counterparts use the same semantic assignments.

### Semantic and code colors

Brick red is reserved for errors, paired with a pale error surface. Code uses teal commands, brown numbers and strings, and violet names. Program stroke colors belong to the program and remain exact in both themes.

**The Exact Ink Rule.** Theme changes may restyle the studio, but must preserve program stroke colors.

## Typography

Manrope is the locally bundled UI family. JetBrains Mono is the locally bundled code family. The workspace title uses the title token; labels are compact and semibold; the reference has a larger reading title and generous prose line height.

Code uses a fixed 26px line height so textarea, highlight overlay, line numbers and error positions align. Mobile code is 11px. Desktop code is 12px. Reference prose is 13px at line height 1.9, inside an article up to 700px wide. Small coordinates and execution metadata use tabular numerals.

**The Two Voices Rule.** Use sans for the interface and prose; use monospace for code, keyboard keys and numerical measurement.

## Layout

The desktop header is 78px tall. The library is 232px wide, followed by a fluid workspace with 28px padding. The workbench splits into an editor at roughly 39% and the remaining drawing area, with a shared status row. At smaller desktop widths, padding and the library shrink before the work areas lose usability.

At 780px and below, the header becomes 66px, the library becomes a scrollable navigation drawer, and the editor and canvas stack. The mobile editor is 330px tall; the drawing pane is 420px. The document can scroll vertically. Native overflow inside the editor preserves long lines. The reference changes from sticky side navigation to wrapping section controls.

Use close spacing inside control groups and larger gaps between task regions. Keep the primary execution control beside the source. Do not insert introductory marketing above a working studio.

## Elevation & Depth

The workspace is flat. A fine border and a neutral surface change define panes. The library drawer, toast and modal dialogs are the elevated states. Dialogs use a soft downward shadow and a dimmed backdrop; ordinary panels do not carry shadows.

**The Flat Work Rule.** Reserve elevation for temporary layers that cover the task.

## Shapes

Controls have small rounded corners; list selections and teaching tips use item corners; the workbench is one clipped shared container. Dialogs use the larger dialog radius. Small dots indicate execution state, and task numbers use circular markers because they convey ordered practice progress. Icons are consistently stroked SVGs.

## Components

### Buttons

Primary actions use forest teal with white text in light mode, mint with dark text in dark mode. Secondary buttons use a panel fill and fine border; ghost and icon buttons use a neutral hover fill. Disabled actions fade and are noninteractive. Focus uses a 2px accent outline, offset 4px. Color and background transitions last 160ms; active buttons move down 1px.

### Inputs and editor

The code editor uses a transparent textarea over a highlighted preformatted overlay. The caret is teal. An execution line uses mint; an error line uses a pale red surface and a wavy underline at the offending character. The error panel names the exact location and links back to the source. Text inputs use a neutral inset surface and fine border.

### Navigation and selected items

Desktop navigation uses icon-and-label buttons. The selected destination uses mint. On phones, labels remain in accessible names while icons conserve width. Example rows pair real generated thumbnails with name and learning topic. The selected row uses a fine border and mint fill, without a heavy side stripe.

### Drawing controls

A compact floating toolbar groups zoom, fit, camera reset and grid state. The camera instructions are quiet but visible. The turtle marker shows heading; in 3D a second indicator shows local up. The grid is generated by the renderer, with a useful world-unit spacing at each scale.

### Temporary layers

Native dialogs provide keyboard focus handling for sharing, saved sketches and keyboard help. Toasts report recovered drafts and transient actions. The mobile library is a scrollable side drawer that returns focus to its opener when closed.

### Motion

Motion is functional: source-line execution and a growing turtle trail. The speed slider controls interpreter pacing. UI transitions are short; reduced motion disables decorative transitions and status pulsing.

## Do's and Don'ts

### Do:
- **Do** show the actual interpreter output in every example thumbnail.
- **Do** preserve the same source-line metrics across the editor layers.
- **Do** keep actions, selections and errors semantically consistent across themes.
- **Do** expose icon-only controls through explicit accessible names.

### Don't:
- **Don't** recolor a program's drawing to match the theme.
- **Don't** cover the source or drawing with persistent decoration.
- **Don't** use display typography for compact task controls.
- **Don't** add shadows to the flat workbench panes.
