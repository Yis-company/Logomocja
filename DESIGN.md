---
name: Logomocja
description: A Polish turtle-drawing studio set like a printed PKP departure timetable.
colors:
  timetable-yellow: "#ffd200"
  yellow-deep: "#f0c200"
  yellow-wash: "#fff3b8"
  ink: "#141414"
  ink-2: "#45443f"
  ink-3: "#64635c"
  ground: "#ffffff"
  panel-2: "#f4f4f0"
  panel-3: "#eaeae4"
  line: "#dddcd5"
  signal-red: "#c4122f"
  red-wash: "#fdeef0"
  amber: "#c96f00"
  plate: "#fdfdfb"
  plate-minor: "#f0f0ec"
  plate-major: "#dfdfd8"
  plate-axis: "#8a8982"
  plate-ghost: "#e4e3dc"
  ground-night: "#131311"
  panel-night: "#191916"
  panel-2-night: "#21211d"
  line-night: "#35342f"
  ink-night: "#f2f0e8"
  ink-3-night: "#a09e94"
  red-night: "#ff7373"
  amber-night: "#ffad3d"
  plate-night: "#1c1c19"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 820
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.4375rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 780
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  prose:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    letterSpacing: "0.07em"
    fontVariation: "'wdth' 82"
  figure:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 800
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 78"
  code:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  s: "3px"
  m: "5px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "64px"
components:
  button-primary:
    backgroundColor: "{colors.timetable-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.s}"
    padding: "0 12px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.yellow-deep}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.s}"
    padding: "0 12px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.panel-2}"
  button-quiet-hover:
    backgroundColor: "{colors.panel-3}"
  nav-link-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.timetable-yellow}"
    rounded: "{rounded.s}"
    padding: "0 12px"
  mode-switch-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.timetable-yellow}"
    typography: "{typography.figure}"
    height: "34px"
  trace-row-current:
    backgroundColor: "{colors.timetable-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    height: "28px"
  trace-row-error:
    backgroundColor: "{colors.red-wash}"
    textColor: "{colors.signal-red}"
  stamp-passed:
    backgroundColor: "{colors.timetable-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.s}"
    padding: "2px 8px 2px 5px"
  chip:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.s}"
    height: "22px"
---

# Design System: Logomocja

<!-- Qualitative language (north star, colour names, philosophy) was inferred in an unattended
     session from the product brief and the built world; no user rounds were held. -->

## Overview

**Creative North Star: "The Departure Board"**

Logomocja is a working studio printed like a Polish railway timetable, the yellow *Rozkład jazdy: Odjazdy* poster
on every station wall. The yellow belongs to the shell: the top bar, the primary action, the
current step. Everything structural is set in timetable black: hairline rules between rows, a
heavier rule under every column head, small condensed uppercase labels, and bold condensed
figures that read like departure hours. The program's run is the schedule. Every executed
statement takes a row, the row in progress rides the yellow bar, and a failure is a red footnote.

The drawing is the reward, so the turtle's ink is quarantined on the plate: an almost-white sheet by
day, a charcoal sheet by night, ruled as a real coordinate field. The shell never borrows the turtle's
colours, and the plate never borrows the shell's furniture beyond its view controls and a tabular
status strip.

Density is a working tool's density, not a poster's. Controls are the standard web controls a learner
already knows (buttons, a segmented switch, a range slider, tabs, menus), in a print vocabulary: flat,
squared, bordered, never glossy.

**Key Characteristics:**
- Timetable yellow carries the shell; black ink and hairline rules carry structure.
- Condensed uppercase labels and bold condensed tabular figures, Archivo throughout the UI.
- Code in Atkinson Hyperlegible Mono, chosen for learners' legibility.
- The run shown as a departure board: one row per step, current row on the yellow bar.
- Turtle colours appear only on the drawing plate, thumbnails and colour swatches.
- Flat print: borders instead of shadows, 3–5px corners.

## Colors

A restrained print palette: one committed shell colour, timetable black, and red that only ever
means "something is wrong."

### Primary
- **Timetable Yellow** (`timetable-yellow`): the top bar (with a 2px black rule under it), the primary
  button, the current trace row, the executing token in the editor, the turtle marker's body, the
  passed-challenge stamp, the speed-slider thumb. Text on it is always ink, in both themes.
- **Deep Yellow** (`yellow-deep`): hover on yellow controls only.
- **Yellow Wash** (`yellow-wash`): the executing line's background and the matching-bracket highlight.

### Secondary
- **Signal Red** (`signal-red`, night `red-night`): errors and nothing else: the inline error note's
  heading, the wavy underline under the offending token, the gutter number, the trace's footnote row,
  the error tone of the run status, missing parts in a challenge check.
- **Red Wash** (`red-wash`): the error line, the error note and error rows.

### Tertiary
- **Warning Amber** (`amber`, night `amber-night`): warnings and "extra" parts in a challenge check:
  the stopped-run status, the no-WebGL notice. Never decorative.

### Neutral
- **Timetable Black** (`ink`, night `ink-night`): text, rules under heads, the active nav item and active
  mode (inverse, with yellow text).
- **Pencil** (`ink-2`) and **Faint Pencil** (`ink-3`, night `ink-3-night`): secondary and tertiary text,
  line:column figures, column heads. Both pass 4.5:1 on their grounds.
- **Station White** (`ground`) by day, **Night Platform** (`ground-night`, `panel-night`) by night: panes.
- **Toolbar Grey** (`panel-2`, night `panel-2-night`) and **Pressed Grey** (`panel-3`): the toolbar band,
  status strip, code blocks, hover fills.
- **Hairline** (`line`, night `line-night`): row and pane dividers.
- **Plate** (`plate`, night `plate-night`) with **Minor/Major Grid** (`plate-minor`, `plate-major`), **Axis**
  (`plate-axis`) and **Tracing Ghost** (`plate-ghost`, the challenge target drawn as a wide pale band).

### Named Rules
**The Quarantine Rule.** Turtle ink (`#16866a` and every colour a program sets) lives only on the plate,
in thumbnails and in colour swatches next to the literal that sets it. The shell is yellow, black,
grey and red.

**The Footnote Rule.** Red is reserved for errors. A red element that does not report a problem is a bug.

**The Ink-On-Yellow Rule.** Yellow is a ground, never a text or line colour on white. On yellow, use ink.

## Typography

**Display Font:** Archivo Variable, self-hosted (with system-ui)
**Body Font:** Archivo Variable
**Label/Mono Font:** Atkinson Hyperlegible Mono for program text and trace commands

**Character:** a sturdy grotesque with a real width axis: normal width for reading, condensed and heavy
for the timetable's column heads and figures. The mono is chosen for legibility (distinct 0/O, 1/l/I),
because the readers are learning.

### Hierarchy
- **Display** (820, 2.125rem, 1.1; 1.75rem on phones): page titles (Przykłady, Zadania, Polecenia).
- **Headline** (800, 1.4375rem): reference sections, set above a 2px ink rule.
- **Title** (760–780, 1.0625–1.1875rem): example, challenge and task titles.
- **Body** (400, 0.875rem, 1.45): UI text. **Prose** (1rem, 1.6) on reference and page ledes, capped at 36–38em
  (about 70 characters of Polish text; the `ch` unit is too wide for this face).
- **Label** (800, 0.6875–0.8125rem, condensed to 82%, uppercase, 0.06–0.07em tracking): pane titles
  (PROGRAM, PRZEBIEG), column heads, status-strip keys, table heads.
- **Figure** (800, condensed to 75–78%, tabular): trace step numbers, challenge numbers, the 2D/3D switch.
- **Code** (Atkinson Hyperlegible Mono, 15px in the editor, 14px in blocks, 13px in the trace).

### Named Rules
**The Departure Hour Rule.** Every number that changes while a program runs is tabular. Step numbers are
bold and condensed, so the board never jitters.

**The One Family Rule.** UI, headings and data share Archivo; only program text is monospace. Never use
mono to make something look technical.

## Layout

The studio is a fixed-height working grid below the 52px top bar. Desktop (≥760px): a toolbar row,
then a left column of `minmax(380px, 42fr)` stacking editor, run-status line and the Przebieg board
(`minmax(140px, 34%)`), and a `58fr` plate on the right that takes every remaining pixel. From 760 to
1365px the mode switch drops its sub-labels and Plik/Udostępnij go icon-only (names stay for assistive
tech). Phones (<760px): a 48px bar; one pane at a time behind a Program / Rysunek / Przebieg tab switch;
the run status and a two-row toolbar docked to the bottom edge, above the safe area. Running from the
Program pane switches to Rysunek.

Pages (examples, challenges, reference) sit in a 1240px column with 32/24px padding, headed by a title,
a lede and a 2px ink rule. Lists are timetable boards: a thumbnail of the real drawing, title and
description, quiet metadata, the action on the right, rows separated by hairlines. Examples run as
two boards side by side (2D | 3D) from 1100px. The reference uses a 210px sticky table of contents
beside a 76ch content column.

Spacing follows a 4px base (4, 8, 12, 16, 24, 32, 48, 64), tight inside groups and generous between them.

## Elevation & Depth

Flat by default. Depth comes from tonal bands (toolbar grey under white panes) and rules, not shadows.
Only things floating above the work cast a shadow, and only in the light theme: popovers
(`0 2px 4px rgb(20 20 20 / .08), 0 12px 32px rgb(20 20 20 / .14)`, no border) and toasts
(`0 8px 28px rgb(0 0 0 / .22)`). In the dark theme popovers use a 1px border and no shadow.

### Named Rules
**The Border-Or-Shadow Rule.** An element declares its elevation once: a border (view controls, notices,
chips, buttons) or a shadow (light popovers, toasts), never both.

## Shapes

Squared print geometry: 3px corners on controls, chips, stamps, code blocks and inline code; 5px on
popovers, notices, toasts and the view-control panel. Borders are 1px hairlines; rules that head a column
or section are 2px ink. The only round shapes are the slider thumb, the run-status dot and the plate's origin ring.

## Components

### Buttons
- **Shape:** squared (3px), 36px tall, 12px side padding, weight 620, icon at 20px.
- **Primary (Uruchom, Sprawdź rozwiązanie, Rozwiąż):** timetable yellow, ink text, 1px ink border by day,
  yellow border by night. Hover: deep yellow. Press: 1px down.
- **Secondary:** white pane, hairline border; hover darkens the border and fills toolbar grey.
- **Quiet:** borderless; hover fills pressed grey. Used for Plik, Udostępnij, Wypróbuj and toast actions.
- **Disabled:** 42% opacity, not-allowed cursor (Pauza when nothing runs).
- **Focus:** 2px ink outline (yellow at night) with a 2px offset; ink on the yellow bar in both themes.

### Mode switch
A two-cell bordered group (2D | 3D) with condensed heavy figures, like a platform number. The active
cell is inverse ink with yellow text. Arrow keys move between cells. It is disabled while a challenge fixes the mode.

### Navigation
Top-bar links in ink on yellow, 650 weight; hover is a 9% ink tint; the current page is an inverse ink
block with yellow text. The theme control (Auto / Jasny / Ciemny) sits at the far right as a bordered quiet button.

### Inputs / Fields
- **Editor:** CodeMirror on the pane ground, mono 15px, gutter in faint pencil with tabular numbers, the
  active line in a faint grey wash; focus draws a 2px pencil ring inside the pane.
- **Speed slider:** 4px hairline track, yellow thumb with a 2px ink ring.
- **Share field:** mono text on toolbar grey, hairline border.

### Przebieg board (signature)
Six columns: Nr (bold condensed figure), Wiersz (line:col in faint pencil), Polecenie (the command as
written with evaluated arguments, in mono, indented 10px per call/repeat depth up to 6), x, y, and
kurs or z (right-aligned, tabular). 28px rows on hairlines under a condensed uppercase head. The current
row rides the yellow bar while running or paused; a run-time error closes the board as a red footnote row
marked "!". Virtualised; clicking a row moves the editor to that place.

### Error note
A red-wash block inserted under the offending line, with a small rotated-square caret pointing at the
column, a red "Błąd · wiersz N, kolumna M" heading and the Polish explanation. The token gets a red wavy
underline and the gutter number turns red.

### Plate
Grid paper with minor and major lines from the 1-2-5 series, labelled axes and a ringed origin. The turtle
marker is a notched yellow arrowhead with an ink outline and a pen dot (filled in the pen colour when
down, hollow when up). In 3D the same arrowhead lies in the heading-right plane, with an ink fin along the up
vector to show roll. View controls sit in a bordered column at the top right; a toolbar-grey status strip
along the foot shows x, y, z, kurs/kierunek, pen, colour and width.

### Chips and stamps
Chips are hairline-bordered 3px labels in pencil (the mode of a program or task). The passed stamp is a
yellow block with an ink check: the only celebratory element in the system.

### Toasts
Inverse blocks (ink by day, light ink by night, signal red for errors) at the bottom right (above the
toolbar on phones), with an underlined action such as "Przywróć szkic" and a close button.

## Do's and Don'ts

### Do:
- **Do** keep yellow on the shell and on state (current row, executing token, primary action, passed stamp).
- **Do** put a 2px ink rule under every column head, pane title and page head, and hairlines between rows.
- **Do** set changing numbers in tabular figures and step numbers in bold condensed Archivo.
- **Do** face lists of programs and tasks with thumbnails of their real drawings.
- **Do** report errors in red with the line, the column and a fix in Polish, at the exact token.
- **Do** keep copy gender-neutral in Polish: present tense, imperatives or impersonal forms, no gendered past tense.

### Don't:
- **Don't** let turtle colours leak into the shell (no green buttons because the default pen is green).
- **Don't** use red for anything that is not an error.
- **Don't** set yellow text or yellow lines on white.
- **Don't** round corners beyond 5px, or add shadows to panes, buttons or panels.
- **Don't** use monospace outside program text, trace commands and identifiers.
- **Don't** put a kicker or eyebrow line above a heading; metadata follows the title.
