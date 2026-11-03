---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Studio surface (Logomocja app shell)

Scope: the whole single-page app (Studio, Przykłady, Zadania, Polecenia), entry `index.html`.
Visitor mode: **Operate** (the reference page is a Read section inside the same shell).

Audience and job: Polish learners and returning Logomocja users write a short Logo program,
run or step it, read the error at the exact word, fix it, solve challenges and share a link.
Constraints: product brief language/features/delivery are fixed; no network at runtime;
phone and desktop; light and dark; keyboard operable.

Decision round: unattended (benchmark authorises inference; no decision page served).
Built the assigned direction; no telemetry ping (no attended round resolved).

## Direction contract

THESIS: The studio is set like a PKP printed departure timetable (Rozkład jazdy, Odjazdy): a
run is a schedule of steps read in strict column rhythm. It refuses the dark VS-Code-clone
IDE and the cartoon-turtle kids' app.

OWN-WORLD: Timetable yellow carries the shell (top bar, current-step bar, primary action);
timetable black ink and hairline rules; white ground by day, charcoal by night; signal red
only for errors and footnote notes. Archivo at normal and condensed widths, tabular figures,
bold condensed step numbers set like departure hours. Turtle ink lives on a paper plate.

STORY: The learner lands on a ready program beside its drawing, presses Uruchom, watches the
turtle while the Przebieg timetable fills row by row, meets an error as a red footnote at the
exact word, fixes it, then shares a link or takes a challenge.

FIRST VIEWPORT: Desktop: 52px yellow bar (wordmark, Studio/Przykłady/Zadania/Polecenia,
theme). Toolbar row: 2D/3D switch, Uruchom (primary), Krok, Pauza, Reset, speed, Plik. Editor
left ~40% above the Przebieg timetable; drawing plate right ~60%, view controls top-right,
tabular status strip along its foot. Phone: same bar, Program/Rysunek/Przebieg switch,
toolbar docked to the bottom edge.

FORM: Candidate 4 of 7, PKP printed departure timetable. seed:2d7ca5ddb4517c90
Signature move: the Przebieg panel, executed steps set as departure rows (step number in bold
condensed figures, line:column, command with evaluated arguments, x/y/z, heading), the
current row on the yellow bar, a run-time error as a red footnote row.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Raises (named for their donors)

- From the streaming title-card wall (declined): the artwork is the tile's face. Examples and
  challenges are faced by their real rendered drawings, never icons.
- From the lexicon shoulder-and-plate (declined): colour quarantine. Turtle ink colours appear
  only inside the drawing plate and thumbnails; the shell's colour is yellow, black and red
  doing their jobs.
- From the star atlas (declined): matched coordinate field. Both views label the same unit
  grid, so a flat program reads at the same scale in 2D and 3D.
- From the Factory catalog sleeve (declined): one plot owns the field. The plate takes every
  pixel the editor does not need; only view controls and the status strip sit on it.
- From Ikeda datamatics (declined): tabular numerals at data density. Every number that
  changes while running is tabular, so nothing jitters.

## Verdicts

- cassette j-card: competitive (holds audience identification, 1990s mixtape nostalgia; loses
  product clarity, hand-lettered labels break a working screen). Unbuilt alternate.
- streaming wall, lexicon, star atlas, Factory sleeve, Ikeda: declined (kept lines above).
- Impeccable's pick (not built): candidate 1, zeszyt w kratkę. Risk: the most familiar
  reading of a school subject.

## Unresolved

- None blocking. Challenge checker tolerance is an implementation decision (see README).

## Finish record

- Finish review: run in-thread (no subagents in this harness), code-led, no comp or QUALITY BAR
  card. Round 1 disposition `fix` (dark popover ghost card, eyebrow-style task crumb, trace
  ignoring call depth). Verdict pass: all three resolved, disposition `ship` for the scored fixes.
- Detector: rendered routes clean via CDP; one static false positive (`.cm-cursor` 2px caret read
  as a side-tab), not canonized.
- DESIGN.md and `.impeccable/design.json` written from the built world (documenter run in-thread).
- Shipping rasters: none (SVG favicon, woff2 fonts only); `embed-prompt --scan` reports 0.
- Adaptation on record: the plate is charcoal in the dark theme (night use scene), colour
  quarantine kept.
