# Logomocja: product brief

You are building **Logomocja** from scratch in the current working directory: a Polish-language web studio for turtle drawing, inspired by the classic Polish Logo environment of the same name, with flat 2D drawing and real 3D spatial drawing. It is a nostalgia project that should feel good to use today, on a desktop and on a phone, and it should be complete: a learner can open it, read what the language can do, run the examples, write programs, solve the challenges and share what they made.

Nobody will answer questions. Decide everything yourself, build the complete app, verify it works, and stop when it is done. Design, architecture, technology, project structure and visual direction are yours. Three things are fixed: the language, the feature list, and the delivery contract at the end.

## What the app is

A workspace where you write a Logo program, run it and watch the turtle draw, with two modes: 2D (a plane) and 3D (space). The interface is in Polish. No accounts, no backend, no network at runtime.

## Features (fixed)

Every item below must exist and work. How it looks and how it is organised is up to you.

1. **Editor.** Line numbers; syntax highlighting of the dialect (commands, numbers, names, strings, comments, brackets); an inline marker at the line and column of the current error, with the Polish message; a highlight of the line being executed while running or stepping. A plain textarea with an overlay is fine; a code-editor library is fine.
2. **Execution.** Run the whole program, step through it command by command, pause, resume, reset. A speed control for the animation. The turtle is drawn as a marker that shows its position and heading (and its orientation in 3D). Editing while a program runs is handled sensibly. Errors name a line and column and explain the problem in Polish; a parse-time error draws nothing, a run-time error keeps what was drawn.
3. **2D view.** Pan, zoom, fit the drawing, and a visible origin.
4. **3D view.** A camera the user can orbit, pan and zoom, a reset, a ground grid and axes. A program made only of flat commands draws the same shape in both modes. The 3D part may need WebGL; if it is unavailable the 2D part must still work and the app must say why 3D is off.
5. **Standard programs.** The thirteen programs listed at the end are shipped verbatim as built-in examples, each loadable by its name into the right mode. Loading an example must not silently destroy the user's unsaved draft.
6. **Challenges.** At least five practice tasks. Each shows what to draw, accepts the user's program, checks it automatically against the expected drawing (your checker, your tolerance), and reports pass or fail with a reason. Progress is persisted locally.
7. **Sharing and files.** A permalink encodes the current program and mode in the URL; opening it loads and runs the program. Export the drawing as a PNG. Download the program as a `.logo` text file and open such a file.
8. **Command reference.** A page in Polish documenting the whole dialect below, with an example per command, expressions, variables, conditionals, procedures and the limits.
9. **Persistence and shortcuts.** The draft of each mode survives a reload (local storage only). Keyboard shortcuts for run, step, pause and reset, listed somewhere in the interface.
10. **Responsive and accessible.** Usable on a phone-sized screen and on a desktop. Light and dark theme, following the system with a manual toggle. Every control is keyboard-operable and labelled; focus is visible.
11. **Tests.** A `test` script that runs your interpreter tests and passes. Browser tests are optional.

Anything beyond this, for example a gallery, animation of the turtle, sound, more examples, is your call. Prefer correct and polished over large.

## The language (fixed)

The interpreter must implement exactly these semantics. You may add more commands, but every program below must behave as specified.

### Lexical rules

- Keywords, procedure names, variable names and parameter names ignore case. Accented Polish spellings listed below work alongside the unaccented ones.
- Whitespace separates tokens; newlines matter only for procedure headers and endings (see Procedures).
- A semicolon starts a comment that runs to the end of the line.
- Numbers are unsigned decimal literals: `80`, `12.5`, `.5`. A sign is an operator (see Expressions). Nothing else is a number: `1e3`, `0x10`, `NaN` and `Infinity` are errors.
- Square brackets `[` and `]` delimit repeat and conditional bodies and may nest. Parentheses `(` and `)` group expressions.
- A colour literal is a quoted six-digit hex string: `"#16866a"` (case-insensitive hex digits).
- The operators are `+ - * /`, the comparisons `< > = <= >= <>`.

### Commands

| Polish | English | Argument | Meaning |
| --- | --- | --- | --- |
| `np`, `naprzod`, `naprzód` | `fd`, `forward` | expression | Move forward by that distance |
| `ws`, `wstecz` | `bk`, `back` | expression | Move backward |
| `pw`, `prawo` | `rt`, `right` | expression | Turn right by that many degrees |
| `lw`, `lewo` | `lt`, `left` | expression | Turn left by that many degrees |
| `pod`, `podnies`, `podnieś` | `pu`, `penup` | none | Raise the pen |
| `opu`, `opusc`, `opuść` | `pd`, `pendown` | none | Lower the pen |
| `kolor` | `color` | colour literal | Set the pen colour |
| `grubosc`, `grubość` | `width` | expression, integer 1–12 | Set the stroke width |
| `powtorz`, `powtórz` | `repeat` | expression, integer 0–10000, then `[ body ]` | Run the body that many times |
| `niech` | `let` | name, then expression | Assign a variable |
| `jeśli`, `jesli` | `if` | condition, then `[ body ]` | Run the body when the condition holds |
| `jeżeli`, `jezeli` | `ifelse` | condition, then `[ body ]` `[ body ]` | Run the first body when the condition holds, else the second |
| `stop` | `stop` | none | End the current procedure; at top level, end the program |
| `dom` | `home` | none | Return to the origin and the initial orientation |
| `czyść`, `czysc` | `cs`, `clearscreen` | none | Forget every drawn segment |
| `gora`, `góra` | `pitchup` | expression | Pitch the nose up by that many degrees (3D only) |
| `dol`, `dół` | `pitchdown` | expression | Pitch the nose down (3D only) |
| `pp`, `przechylprawo` | `rr`, `rollright` | expression | Roll to the right around the heading (3D only) |
| `pl`, `przechyllewo` | `rl`, `rollleft` | expression | Roll to the left (3D only) |

Every Polish and English alias is equivalent. `nrpowt` (alias `repcount`) is a value, not a command: see Repeat.

### Expressions

- Wherever a command takes an expression, it accepts a number, a name (a parameter or a variable, also in the legacy form `:name`), `nrpowt`, a parenthesised expression, a unary `-` or `+` applied to any of these, or two expressions joined by `+`, `-`, `*` or `/`.
- `*` and `/` bind tighter than `+` and `-`; operators of equal precedence associate to the left: `np 20 - 5 - 3` moves 12 and `np 2 + 3 * 4` moves 14.
- A binary operator must have whitespace on both sides or on neither side. `np 10 - 5` and `np 10-5` both move 5. `np 10 -5` is `np 10` followed by the stray token `-5`, which is an error, because the `-` has whitespace only on its left. The same rule applies to `+`, `*` and `/`. The rule does not apply to comparisons.
- Unary signs may be stacked and applied anywhere an operand is expected: `np -(3 - 5)`, `np - -2`, `np -bok`.
- Division by zero and any non-finite result are run-time errors. Evaluating an expression is not an executed operation (see Limits).
- A condition is `expression comparison expression`. Comparisons are exact: `jeśli 0.1 + 0.2 = 0.3 [...]` does not run its body.

### Turtle and geometry

- Coordinates are right-handed: +X to the right, +Y forward on the page, +Z up out of the page. The 2D plane is the XY plane (z = 0).
- The turtle starts at the origin (0, 0, 0), heading +Y, with its right side along +X and its up vector along +Z, pen down, colour `#16866a`, width 3.
- `np d` moves the turtle `d` units along its heading; `ws d` moves it `-d`. If the pen is down and the position changes, a straight segment from the old to the new position is drawn with the current colour and width. A move of zero draws nothing.
- `pw a` rotates the heading `a` degrees to the right around the turtle's up vector (clockwise when seen from above); `lw a` rotates left. The right vector follows the heading.
- `gora a` rotates the heading `a` degrees towards the up vector around the right vector (the up vector follows, so after `gora 90` the turtle heads along its former up); `dol a` rotates the opposite way.
- `pp a` rotates the turtle's up vector `a` degrees towards its right vector, around the heading (the right vector follows, so after `pp 90` the turtle's up is its former right and its right is its former down); `pl a` rotates the opposite way. The heading does not change.
- In 2D mode, `gora`, `dol`, `pp` and `pl` are errors.
- Angles are in degrees, any decimal value; negative values turn the other way.
- `dom` moves the turtle to the origin, drawing a segment if the pen is down and the turtle is not already there, then sets the heading to +Y, the right vector to +X and the up vector to +Z. Pen state, colour and width are untouched.
- `czyść` removes every segment drawn so far and changes nothing else: `run` then returns only the segments drawn afterwards. The segment limit (see Limits) counts the segments currently kept.
- Pen state, colour and width persist until changed. Programs made only of flat commands produce identical coordinates in 2D and 3D mode.

### Repeat

`powtorz n [ ... ]` runs the bracketed commands `n` times; `n` must evaluate to an integer from 0 to 10000 (0 runs nothing). Bodies may contain any commands, nested repeats, conditionals and procedure calls.

Inside a repeat body, `nrpowt` is the number of the current iteration of the innermost enclosing repeat, starting at 1. The enclosing repeat is found lexically: `nrpowt` written in a procedure body that is not itself inside a repeat is a parse-time error, even if the procedure is only ever called from inside a repeat. `nrpowt` written outside any repeat at top level is a parse-time error too.

### Variables

- `niech x 5` assigns the value of the expression to the variable `x`; any later `niech x ...` reassigns it. Variable names follow the rules for procedure names and may not be command words or the name of a procedure.
- A `niech` at top level creates or updates a global variable. A `niech` inside a procedure creates or updates a variable local to that call; it shadows a global of the same name for the rest of the call and is discarded when the call ends. A parameter can be reassigned the same way.
- A name may be used in an expression only if it is a parameter of the enclosing procedure, or is assigned by `niech` somewhere in the body of the enclosing procedure, or is assigned by `niech` somewhere at top level (before or after the use). Any other name is a parse-time error.
- Reading a declared variable that has not been assigned yet on the current path is a run-time error, reported at the first token of the argument that contains the reference.

### Conditionals

`jeśli warunek [ ... ]` runs the body when the condition holds. `jeżeli warunek [ ... ] [ ... ]` runs the first body when it holds and the second otherwise. Bodies may contain anything a repeat body may contain. Conditional bodies count towards the bracket nesting limit but are not execution frames.

### Procedures

```logo
oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90
```

- A definition starts with `oto` (alias `to`) at the beginning of a line, followed on the same line by the name and, optionally, `ma:` and a comma-separated parameter list. The body follows on the next lines and ends with `już` (aliases `juz`, `end`) alone on its own line.
- The legacy header `oto kwadrat :bok :kąt` is also accepted, and a parameter may be referenced in the body as `:bok` as well as plainly as `bok`.
- Calls take positional arguments separated by whitespace, exactly as many as the procedure has parameters; each argument is an expression, so `kwadrat 40 * 2 90` passes 80 and 90. A parameter may share its name with a procedure: in command position the name is a call, in argument position it is the parameter.
- Parameters and local variables are local to the call and can stand in for any expression, including repeat counts and arguments of other procedure calls.
- Definitions are top-level only (never inside a repeat body, a conditional body or another procedure) and may appear before or after the calls that use them. A name may be defined once.
- Procedures may call themselves, directly or through other procedures. `stop` ends the current call immediately; at top level it ends the program. A `stop` inside a repeat or conditional body ends the enclosing procedure call (or the program), not just the body.
- There are no return values.

### Errors and limits

- Any problem is reported with the 1-based line and column of the offending token: an unknown command, a missing or malformed argument, a malformed colour, a width outside 1–12 or not an integer, a repeat count outside 0–10000 or not an integer, an unbalanced bracket or parenthesis, a procedure call with the wrong number of arguments, a definition inside a body, a missing `już`, a name that is neither a parameter nor a declared variable, `nrpowt` outside a repeat, a pitch or roll command in 2D mode, division by zero, an unassigned variable, or a limit exceeded.
- An invalid argument (a bad width or repeat count, a division by zero, a non-finite result, an unassigned variable) is reported at the first token of that argument's expression, not at the command. A missing argument is reported at the token found where the argument should have started (for example a `]` or `)`), or at the command itself when the program ends there. A stray value where a command is expected is reported at that value.
- A program is validated as a whole before anything is drawn: with a parse-time error nothing is drawn. Widths and repeat counts written as literal expressions (no names) are checked at parse time; those that depend on names are checked when executed. Errors that can only be found while running (a limit exceeded, division by zero, an unassigned variable, a bad width or repeat count computed from a name) stop execution and keep what was drawn so far, after any `czyść` that ran.
- Limits: 50,000 source characters, 10,000 tokens (operators, parentheses, brackets and commas are tokens), nesting depth 32 for brackets, 32 active procedure-call and repeat frames at any moment (conditional bodies do not count), 10,000 executed operations counting each command, each `niech`, each conditional, each repeat and each call, plus one for finishing each repeat iteration, conditional body or procedure call (reaching the end of the program is not counted), 10,000 kept segments, and every coordinate within ±100,000. Exceeding a limit is an error.

## Delivery (fixed)

- Leave a complete project in the working directory with a `README.md` explaining how to run, build and test it. Use any stack that satisfies the rest of this list.
- `bun install` followed by `bun run build` must produce a self-contained static site in `dist/`: plain files, no server-side code, no runtime network access.
- The build must honour the environment variable `BASE_PATH` (default `/`): with `BASE_PATH=/Logomocja/builds/x/` the site in `dist/` must work when served from that sub-path on a static host with no rewrite rules. If the app has routes, make sure a refresh on any of them still works under those conditions (hash routing is one way).
- Testing hook: once the page has loaded, `window.logomocja` must be an object with `version` (a string), `run(source, mode)` and `open(source, mode)`, where `mode` is `"2d"` or `"3d"`.
  - `run` interprets `source` with the semantics above, without touching the UI, and returns (or resolves to) `{ segments, error }`:
    - `segments`: the drawn strokes in drawing order, each `{ from: [x, y, z], to: [x, y, z], color, width }` with numbers for coordinates and width and the colour as a lowercase `#rrggbb` string;
    - `error`: `null`, or `{ message, line, column }` with the Polish message and 1-based position. For a parse-time error `segments` is empty; for a run-time error it holds what was drawn before the error.
  - `open` loads `source` into the editor in the given mode as if the user had pasted it, runs it to the end without animation, fits the view so the whole drawing is visible, and resolves to the same `{ segments, error }` once the drawing is on screen. It is used to take screenshots of the standard programs.
- `bun run test` must exist and pass.
- You may commit as you go or not at all; the harness records the final state of the directory.

## Standard programs

Ship these as the built-in examples, byte for byte, under the given names and modes.

### Kwadrat (`kwadrat`, 2D)

Cztery kroki do pierwszego rysunku.

```logo
; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]
```

### Gwiazda (`gwiazda`, 2D)

Mała zmiana kąta, wielka różnica.

```logo
; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]
```

### Rozeta (`rozeta`, 2D)

Jeden kwadrat. Wiele możliwości.

```logo
; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]
```

### Spirala (`spirala`, 2D)

Licznik powtórzeń i zmienna zmieniają kolor.

```logo
; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]
```

### Wielokąty (`wielokaty`, 2D)

Procedura liczy kąt z liczby boków.

```logo
; Jedna procedura, wiele figur: kąt liczy się sam.
oto wielokąt ma: boki, bok
  powtorz boki [np bok pw 360 / boki]
już

grubosc 2
niech n 3
powtorz 7 [
  wielokąt n 60
  niech n n + 1
  pw 360 / 7
]
```

### Drzewo (`drzewo`, 2D)

Gałąź rysuje dwie mniejsze gałęzie.

```logo
; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
oto gałąź ma: dł
  jeśli dł < 6 [stop]
  jeżeli dł > 30 [kolor "#6b4f2a" grubosc 3] [kolor "#2f8f4e" grubosc 1]
  np dł
  lw 25
  gałąź dł * 0.7
  pw 50
  gałąź dł * 0.7
  lw 25
  pod ws dł opu
już

pod ws 120 opu
gałąź 90
```

### Śnieżynka (`sniezynka`, 2D)

Krzywa Kocha z czterech poziomów.

```logo
; Krzywa Kocha: każdy odcinek dzieli się na cztery.
oto koch ma: dł, poziom
  jeśli poziom = 0 [np dł stop]
  koch dł / 3 poziom - 1
  lw 60
  koch dł / 3 poziom - 1
  pw 120
  koch dł / 3 poziom - 1
  lw 60
  koch dł / 3 poziom - 1
już

kolor "#2b6fb3"
grubosc 1
pod pw 90 ws 135 lw 90 np 80 opu
powtorz 3 [
  koch 270 4
  pw 120
]
```

### Schody (`schody`, 3D)

Pierwszy krok w trzeci wymiar.

```logo
; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]
```

### Sześcian (`szescian`, 3D)

Zbuduj bryłę z prostych poleceń.

```logo
; Dwa kwadraty połączone krawędziami.
kolor "#16866a"
grubosc 3
powtorz 4 [np 100 pw 90]
gora 90 np 100 dol 90
powtorz 4 [np 100 pw 90]
powtorz 4 [
  np 100
  dol 90 np 100
  pod ws 100 opu
  gora 90 pw 90
]
```

### Pierścień (`pierscien`, 3D)

Okrąg przechylony w przestrzeni.

```logo
; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]
```

### Kula (`kula`, 3D)

Okręgi obrócone wokół kierunku żółwia.

```logo
; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]
```

### Helisa (`helisa`, 3D)

Spirala wznosi się obrót po obrocie.

```logo
; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]
```

### Drzewo 3D (`drzewo3d`, 3D)

Gałęzie obracają się wokół pnia.

```logo
; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
oto gałąź ma: dł
  jeśli dł < 8 [stop]
  jeżeli dł > 30 [kolor "#6b4f2a" grubosc 3] [kolor "#2f8f4e" grubosc 1]
  np dł
  powtorz 3 [
    gora 35
    gałąź dł * 0.6
    dol 35
    pp 120
  ]
  pod ws dł opu
już

gora 90
gałąź 70
```

## Benchmark layer: impeccable-tdd-v1

Use Impeccable 4.7.0 throughout building this app. First read /bench/layers/impeccable-v1/skill/SKILL.md and follow its applicable references. Its base directory is /bench/layers/impeccable-v1/skill. Run its context loader from /work.

This benchmark explicitly authorizes you to infer all audience, design and implementation decisions from the product brief and proceed without human interviews, approval pages or questions. Build an Operate surface. You have no incumbent design to preserve. Do not inspect other benchmark builds, results or source for inspiration.

Use the same CLI tools available in this container. Native image generation, MCP browser controls and delegated agents are unavailable: use the skill's documented in-thread/degraded workflows where applicable, and report tool limitations honestly. Do not call another model or require external services. Do not update the frozen skill or engine; ignore update-offer directives. Keep all shipping assets local. Finish the app, perform the applicable finish review and document the resulting design. The product brief's language, features and delivery contract remain authoritative.

## TDD treatment

Use Matt Pocock's frozen TDD skill throughout building this app. Before implementation, read /bench/layers/tdd-v1/skill/SKILL.md and its testing references. The upstream source commit is 4ae2317ddb22b046e26455e4f9c9b3aaaf62212d. Read referenced files directly with the available CLI tools. When TDD calls for codebase-design vocabulary, consult /bench/layers/tdd-v1/references/codebase-design/SKILL.md as a reference; this is not a separate architecture session. The standalone TDD loop does not require invoking the separate code-review workflow.

The user has explicitly approved these public testing boundaries for unattended execution:

- Interpreter: run(source, mode), covering the brief's 2D/3D strokes and error behavior. It does not exercise browser controls.
- Editor integration: open(source, mode), reset and repeated execution, covering agreement between the editor and the public language contract. It does not establish visual usability.
- Execution controls: run, step, pause, resume and reset through the user-facing controls or the public controller interface they use. It does not establish rendering quality or accessibility.
- Product flows: examples and draft preservation, local persistence, sharing/files and challenge results through user-facing behavior or public app interfaces. It does not require tests against private helpers.

State the chosen public interfaces and what each test covers and misses, then proceed without interviews, approval pages or questions. Derive expectations from the product brief and worked examples. Work one failing behavior test and minimal implementation at a time. Keep the red-to-green evidence visible in the tool transcript. Browser tests remain optional under the product brief; use the tools actually available in this container. Report verification limitations honestly.

Infer all remaining implementation decisions from the brief. Build the complete app. Use only this container's existing tools; delegated agents and native image generation are unavailable. Do not call another model or require external services. Keep all shipping assets local. Do not inspect evaluation cases, expected evaluation outputs, other builds, historical results or repository source for guidance. Keep the frozen skill files unchanged. The product brief's language, features and delivery contract remain authoritative.
