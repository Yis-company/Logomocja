---
version: 1
slug: "src-main-ts"
primary_target: "src/main.ts"
related_targets: ["index.html"]
---

# Surface: Logomocja studio (all routes)

Scope: the whole app — Pracownia (editor + view), Przykłady, Zadania, Pomoc. Visitor mode: **Operate** (Pomoc is a Read sub-surface inside the same shell).

Audience/job: Polish learners and teachers write a Logo program, run or step it, look at the drawing, fix errors, solve tasks, share. Frequent short loops. Constraints: offline static site, Polish UI, phone + desktop, light + dark.

Decision round: unattended run, no question tool or approval page permitted by the benchmark; assigned direction taken as-is. Grounded list (by resonance): 1 zeszyt w kratkę, 2 przybory geometryczne (ekierka/kątomierz), 3 tablica i kreda, 4 polska szkoła plakatu, 5 wycinanki łowickie, **6 podręcznik szkolny WSiP lat 80. — druk dwukolorowy**, 7 pudełko Spirografu. Challengers all declined (low audience identification and clarity for Polish learners); each lends one discipline, raised below.

## Direction contract

THESIS: The studio is set like a two-colour Polish school textbook: black key plus one spot green, figures numbered and captioned, exercises numbered. It refuses the dark-IDE-with-neon look and the cream-and-serif "nostalgia" look.

OWN-WORLD: Uncoated cool-white paper ground (not cream), near-black ink, one spot green (#0e6e57 family) owning the header band, primary buttons, exercise markers and figure numbers. Lato (a Polish-designed face) for all UI, JetBrains Mono for code. Hairline rules, 6px radii, no shadows except popovers. Highlighter yellow is reserved for "now" only. Dark theme is the same print on dark stock.

STORY: Learner sees code on the left and the sheet on the right, presses Uruchom, watches the turtle; the caption under the sheet states what was drawn; errors point at a line in plain Polish; tasks read like textbook exercises.

FIRST VIEWPORT: Spot-green header band (wordmark, nav tabs Pracownia/Przykłady/Zadania/Pomoc, theme toggle). Below: left 40% editor card with run toolbar (Uruchom primary, Krok, Pauza, Reset, speed), file actions, status line; right 60% drawing sheet with 2D/3D segmented control, view tools, and the figure caption bar. Phone: sheet on top, editor below, toolbar wraps.

FORM: Textbook two-colour print, item 6 of 7 on the ordered list. seed:534bd2c931bf44a0
Signature move: every drawing is set as a numbered textbook figure — "Rys. N." in spot green plus a live caption (title, odcinki, łączna długość, operacje) under the sheet.
Raise (emission-line rail): strict registration — toolbar, editor gutter and caption share one left rail and one 4px baseline rhythm.
Raise (botanical folio): fixed-scale comparison — a task's target is ghosted on the sheet at the exact same scale and registration as the learner's drawing.
Raise (orienteering map): one reserved colour for the active leg — highlighter yellow marks only the executing line and the turtle.
Raise (gate board): a changed state holds until noticed — the error marker stays lit until that line is edited.
Raise (metro tiles): chrome deletion — no icon tiles, no decorative cards; type and rules carry structure.
Raise (doujin catalog): whole-cell thumbnail grid — examples and tasks are packed grids of real interpreter-rendered drawings, solved tasks marked.
Motion grammar: 150–200ms state transitions; the only authored motion is the turtle drawing its line.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
