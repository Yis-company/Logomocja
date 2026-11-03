---
name: Logomocja
description: Spokojna pracownia kodu i geometrii.
colors:
  primary: "#196a50"
  primary-hover: "#12563f"
  neutral-bg: "#f5f6f2"
  surface: "#ffffff"
  tint: "#edf3ef"
  ink: "#263d34"
  muted: "#617167"
  border: "#dce3dd"
  selected: "#e6f1e9"
  code-bg: "#fcfdfb"
  error: "#b54435"
  error-bg: "#fff0ec"
  dark-bg: "#111c18"
  dark-surface: "#1b2922"
  dark-ink: "#d6e4d9"
  dark-primary: "#8dc8a5"
typography:
  headline:
    fontFamily: "Inter Variable, ui-sans-serif, sans-serif"
    fontSize: "26px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.8px"
  title:
    fontFamily: "Inter Variable, ui-sans-serif, sans-serif"
    fontSize: "17px"
    fontWeight: 620
  body:
    fontFamily: "Inter Variable, ui-sans-serif, sans-serif"
    fontSize: "13px"
    lineHeight: 1.85
  label:
    fontFamily: "Inter Variable, ui-sans-serif, sans-serif"
    fontSize: "11px"
  code:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "12px"
    lineHeight: "26px"
rounded:
  control: "5px"
  preview: "6px"
  workspace: "8px"
  dialog: "10px"
spacing:
  compact: "8px"
  regular: "16px"
  section: "30px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    height: "36px"
  tag:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "9px 12px"
---

# Design System: Logomocja

## Overview

**Creative North Star: "Współczesny zeszyt matematyczny"**

A precise, quiet tool for making geometry. The reference to school mathematics comes through restrained ink colors, legible code and the actual construction grid on the drawing canvas. Familiar web controls keep the learner's attention on their program. The geometric turtle mark and the live drawings provide the identity.

**Key Characteristics:**
- Real drawings carry visual interest.
- Compact controls, generous drawing space.
- Flat surfaces and fine structural rules.
- Polish copy that explains the next action.

## Colors

Bottle green marks the main action, active navigation and selected states. Cool paper grounds distinguish the app shell, panels and canvas. Muted green-gray supports labels; red identifies errors. Syntax adds restrained clay numbers and blue names. Drawing colors belong to the user's program and are preserved in both themes.

**The Ink Rule.** Interface color describes action or state; drawings own their own colors.

## Typography

Inter Variable is locally bundled for UI and prose. JetBrains Mono Variable is locally bundled for source code and coordinates. Both include Polish characters. The type has a compact fixed scale, with workspace headings, section titles, body copy and small utility labels. Reference prose is limited to 72ch. Code uses a fixed line height shared with its gutter and input overlay.

**The Code Alignment Rule.** Highlight layer, textarea and line numbers must share font metrics; visual styling cannot move tokens away from editable text.

## Layout

The desktop shell has a 78px header and a centered main area capped at 1600px with 42px side padding. The studio divides code and drawing in a 38/62 ratio. A shared execution toolbar sits above them; status sits below. Example previews form seven columns on desktop, five at intermediate widths and three or two on phones.

At 760px and below, navigation moves to its own header row and the editor stacks above the canvas. The mode selector gains its own toolbar row. At 390px, previews use two columns and challenges become a single column. The reference uses a sticky contents rail on desktop and a horizontal list on mobile. The drawing preserves a fitted view across viewport changes until the user manually moves the camera.

## Elevation & Depth

Flat panels use borders and tonal changes for structure. Shadows are reserved for overlays and the small selected mode inset. Dialogs use a soft offset shadow; transient feedback floats above content. Interaction color transitions last 150ms and are removed for reduced motion. There are no entrance animations.

## Shapes

Controls use modest rounded corners. Workspace corners are slightly larger; dialogs are the softest. A single thin border defines each container. The turtle and all control icons are authored stroke SVGs with consistent round caps. The grid is confined to the drawing surface, where it is functional.

## Components

### Buttons

Primary actions use a solid green fill; secondary actions use a thin neutral border; utility actions are quiet text or icon buttons. Hover gains a tint, keyboard focus uses an offset green outline, and disabled controls reduce opacity. Icons accompany text when space permits and have explicit labels when alone.

### Editor

A real textarea sits over an aria-hidden syntax layer. Commands, numbers, strings, names, comments and operators have distinct treatments. Running lines receive a pale green field; errors receive a red field, exact character marker and inline message. Focus also changes the heading and draws an inset editor outline. Esc exits to the Run button.

### Navigation and mode selection

Top-level navigation uses icons, text and an active underline. Mode selection is a two-button segmented control with `aria-pressed`. Active navigation exposes `aria-current`.

### Previews and challenges

Examples show actual interpreter output as a small canvas, with a name, explanation and mode label. Challenge previews show the expected drawing; task copy and hints sit below. Success is expressed in text and a completion indicator, not by color alone.

### Dialogs and feedback

Native dialogs contain protected tasks such as selecting a historical draft and copying a link when clipboard access is unavailable. Toasts report a successful action and can offer restoration. Errors remain inline near their source. Ordinary learning and navigation stay on the page.

## Do's and Don'ts

### Do:
- **Do** give geometry the largest uninterrupted work area.
- **Do** keep every syntax overlay aligned with its textarea.
- **Do** preserve original drawing colors in every theme and export.
- **Do** name actions and recovery steps in Polish.

### Don't:
- **Don't** use a decorative construction grid outside a real drawing surface.
- **Don't** turn command reference text into a display typography treatment.
- **Don't** replace a learner's program without preserving a recoverable version.
