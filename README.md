# Logomocja

A Polish-language studio for turtle drawing in Logo, on a plane (2D) and in space (3D).
Write a program, run it or step through it, watch the turtle draw, read errors at the exact
line and column, solve challenges and share what you made. Everything runs in the browser:
no accounts, no backend, no network access at runtime.

## Run, build, test

Requires [Bun](https://bun.sh) 1.1 or newer.

```sh
bun install          # dependencies
bun run dev          # development server (Vite) at http://localhost:5173
bun run build        # type-check, then build the static site into dist/
bun run preview      # serve dist/ locally
bun run test         # interpreter, challenge and content tests (bun test)
```

`dist/` is plain static files: `index.html`, hashed JS/CSS chunks, self-hosted fonts and a
favicon. Serve it from any static host.

### Deploying under a sub-path

The build honours `BASE_PATH` (default `/`):

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

The app uses hash routing (`#/przyklady`, `#/zadania/kwiat`, `#/polecenia/procedury`), so a
refresh on any route works on a host without rewrite rules. Permalinks are built from the
current page URL, so they work under the sub-path too.

## What is in the app

- **Studio** (`#/`): editor with line numbers, highlighting from the interpreter's own lexer,
  live error checking, an inline error note at the exact line and column, and the executing
  line highlighted while running or stepping. Run, step, pause/resume, reset, speed control.
  The **Przebieg** panel lists every executed statement like a departure timetable (step,
  line:column, command with evaluated arguments, position, heading). Click a row to jump to
  that place in the program. Editing while a program runs stops the run and keeps the drawing.
- **2D plate**: pan (drag, arrows), zoom (wheel, pinch, + and −), fit (button, `0`, double
  click), grid with labelled axes and a visible origin, a turtle marker showing position,
  heading and pen state.
- **3D plate** (Three.js, loaded only when needed): orbit, pan, zoom, camera reset, fit, ground
  grid in the XY plane with labelled x/y/z axes, and an oriented turtle marker whose fin shows
  roll. Without WebGL the app says why 3D is off and shows a static axonometric projection;
  2D is unaffected.
- **Przykłady** (`#/przyklady`): the thirteen standard programs, verbatim, each with a
  thumbnail of its real drawing. `#/przyklady/<name>` loads one into its mode.
- **Zadania** (`#/zadania`): ten challenges, checked automatically; progress is stored locally.
- **Polecenia** (`#/polecenia`): the full dialect reference with a runnable example per command.
- **Files and sharing**: download the program as `.logo`, open a `.logo` file (or drop it on
  the studio), export the drawing as PNG, copy a permalink that encodes program and mode.
- **Persistence**: each mode's draft, the chosen mode, theme, speed and challenge progress
  live in `localStorage`. Loading an example, file or link never silently replaces your
  draft: the old draft is set aside and can be restored from the toast or **Plik → Przywróć
  odłożony szkic**, and the replacement is a single undoable edit (Ctrl+Z).
- **Theme**: follows the system; the top-bar button cycles Auto → Jasny → Ciemny.

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| Ctrl+Enter (⌘+Enter) | Run from the start |
| Ctrl+Shift+Enter | Step one statement |
| Ctrl+Shift+Space | Pause / resume |
| Esc | Reset (clear the drawing, turtle home) |
| + − 0, arrows | On the plate: zoom, fit, pan (3D: Shift+arrows orbit) |

They are listed in the studio (keyboard button) and in the reference.

## Testing hook

Once the page has loaded, `window.logomocja` provides:

- `version`: string (from `package.json`).
- `run(source, mode)`: interprets without touching the UI and returns
  `{ segments, error }`, where each segment is `{ from: [x,y,z], to: [x,y,z], color, width }`
  (colour as lowercase `#rrggbb`) and `error` is `null` or `{ message, line, column }`.
- `open(source, mode)`: loads the source into the editor as a paste in that mode, runs it to
  the end without animation, fits the view and resolves to the same `{ segments, error }`
  once the drawing is on screen (3D waits for its renderer).

## Project structure

```
src/lang/         lexer, parser (pre-scan + single pass, RPN expressions), interpreter
src/examples.ts   the thirteen standard programs
src/challenges.ts challenges and the drawing checker
src/content/      reference text
src/ui/           editor (CodeMirror 6), 2D/3D plates, runner, trace, studio, pages
src/app/          app shell, routing, storage, permalinks, starter drafts
src/styles/       the single stylesheet
tests/            bun tests
```

## Interpretation notes

The language follows the product brief. Where it left room, these are the decisions:

- **Operation count.** Each command, `niech`, conditional, `powtórz` and call costs one;
  finishing a repeat iteration, an executed conditional body or a call costs one more. A call
  ended by `stop` still counts its finish; an iteration or body cut short by `stop` does not.
  The 10 001st operation is the error. So `powtorz 3333 [jeśli 1 = 1 [ ]]` is exactly 10 000.
- **Frames.** A `powtórz` takes a frame when it starts (even with count 0); conditionals never do.
- **Error positions.** A missing `już` is reported at its `oto`; an unclosed `[` or `(` at end
  of program at that bracket; a stray value after a call mentions the procedure's argument
  count. Limit errors (operations, frames, segments, coordinates) are reported at the command.
  Literal width and repeat expressions are evaluated at parse time, so `grubosc 1/0` is a parse
  error; `np 1/0` is a run-time error.
- **Names.** Case-insensitive (NFC + lower case); accented and unaccented forms are distinct
  for user names (`kąt` ≠ `kat`), while the listed keyword aliases are equivalent.
- **`ma:`** In headers, `ma:` with or without the colon is accepted, and `:name` parameters too.
- **Exactness.** Turning uses exact sine/cosine at multiples of 30° and 45°, and a flat turtle
  keeps an exact yaw angle, so squares close exactly and 2D/3D coordinates of flat programs are
  identical. `dom` treats the turtle as "already there" within 1e-9.
- **Checker.** A challenge passes when, after the best of: same position, aligned bounding box
  centres, aligned minimum corners or aligned first points, optionally mirrored left–right,
  both drawings cover each other within 1.5 units (or 0.6 % of the target's diagonal), allowing
  1 % of the target's length to differ. Colour and width are checked only when the task asks.
  Some tasks also require a construct (`powtórz`, a procedure with parameters, a counter, 3D
  commands).

## Design

Visual direction: a working studio set like a PKP printed departure timetable: yellow shell,
black ink and hairline rules, red for errors, Archivo with condensed tabular figures, the
drawing on a paper plate. Details are in `DESIGN.md` and `.impeccable/design.json`;
product context is in `PRODUCT.md`.

Fonts (Archivo, Atkinson Hyperlegible Mono) are self-hosted from `@fontsource` packages under
the SIL Open Font License.
