# Logomocja

Polskie studio grafiki żółwia, inspirowane klasyczną Logomocją. Piszesz program w Logo, uruchamiasz go i patrzysz, jak żółw rysuje: na płaszczyźnie (2D) albo w przestrzeni (3D). Całość działa w przeglądarce, bez kont, serwera i sieci.

A Polish turtle-graphics studio for the browser: a Logo dialect with Polish commands, flat 2D drawing and real 3D drawing, built-in examples, auto-checked challenges, a full language reference, sharing and files. The interface is in Polish.

## Quick start

Requirements: [Bun](https://bun.sh) 1.1 or newer.

```sh
bun install        # install dependencies
bun run dev        # development server with hot reload (http://localhost:5173)
bun run build      # static site in dist/
bun run preview    # serve dist/ locally
bun run test       # interpreter and app-logic tests
bun run typecheck  # TypeScript check
```

### Building for a sub-path

The build honours `BASE_PATH` (default `/`). The site in `dist/` is plain static files. All routes are hash routes (`#/przyklady`, `#/opis`, …), so a refresh works on any static host without rewrite rules.

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

## What is inside

- **Studio**: the editor and the drawing side by side (stacked on phones).
  - The editor has line numbers, syntax highlighting, live syntax checking, an inline error bubble at the line and column, and a highlight of the command being executed.
  - Controls: run, step, pause/resume and reset, plus a speed slider (level 10 draws instantly).
  - Editing while a program runs stops the run and keeps the drawing.
- **2D view**: pan, zoom (wheel, pinch, keys), fit, reset, and a visible origin and axes.
- **3D view**: orbit, pan and zoom camera; camera presets (default angle, top, front, side); ground grid; X/Y/Z axes.
  - The turtle is a dart with a light top, dark belly and orange fin, so pitch and roll are visible.
  - 3D is rendered with a perspective projection on Canvas 2D, so it does not need WebGL and works everywhere 2D does.
- **Examples**: the 13 standard programs, verbatim, each with a preview. You can load one by name with `#/przyklad/<nazwa>`, e.g. `#/przyklad/drzewo3d`.
  - Loading over a modified draft asks first and can keep a copy in *Moje programy*. The toast also offers to restore the draft.
- **Challenges** (`#/wyzwania`): 9 tasks (7 in 2D, 2 in 3D) with a dashed target drawing and automatic checking.
  - The checker merges collinear pieces, ignores drawing order and direction, allows any starting position (translation), and uses a tolerance of 0.5 units.
  - A failed check says why (wrong size, missing or extra segments drawn in red, a required command not used, wrong colour).
  - Progress and solutions are stored locally.
- **Sharing and files**:
  - A permalink (`#/p/<tryb>/<dane>`) stores the program, deflate-compressed and base64url-encoded, and its mode. Opening it loads and runs the program, and the old draft is backed up.
  - PNG export of the current view.
  - Download and open `.logo` files. A file that uses 3D commands opens in 3D mode.
- **Opis języka** (`#/opis`): the whole dialect in Polish, with an example and preview for every command, plus expressions, variables, conditions, procedures, 3D, errors and limits.
- **Persistence**: drafts for 2D and 3D, theme, speed, challenge progress and saved programs live in `localStorage`.
- **Shortcuts** (also listed in the app under *Skróty*, or press `?`):
  - `Ctrl+Enter` (⌘+Enter): run
  - `Alt+K`: step
  - `Alt+P`: pause / resume
  - `Alt+R`: reset
  - `Tab` / `Shift+Tab`: indent; `Esc`: hide the error bubble; `Esc` then `Tab`: leave the editor
  - `Ctrl+/`: comment toggle
- **Accessibility**:
  - Every control is a labelled button or input and works with the keyboard; focus is always visible.
  - Dialogs are native `<dialog>`s, and status changes are announced through a live region.
  - The canvas is focusable for keyboard pan/zoom/orbit.
  - Light and dark themes follow the system, with a manual toggle (system → light → dark).

## Testing hook

Once the page has loaded, `window.logomocja` exposes:

- `version`: the app version (from `package.json`).
- `run(source, mode)`: interprets `source` (`mode` is `"2d"` or `"3d"`) without touching the UI and returns `{ segments, error }`.
  - `segments`: `{ from: [x, y, z], to: [x, y, z], color: "#rrggbb", width }`, in drawing order.
  - `error`: `null` or `{ message, line, column }`.
- `open(source, mode)`: puts the program in the editor as if pasted, runs it instantly, fits the view (3D: default angle), and resolves with the same `{ segments, error }` once the frame is painted.

## Project layout

```
src/
  lang/        the interpreter (no DOM): lexer, parser, executor, geometry, keywords, errors
  run/         playback of a recorded run (animation, stepping, pause)
  render/      Canvas 2D renderers for 2D and 3D, cameras, turtle markers, the interactive viewport
  editor/      textarea-with-overlay editor and the highlighter
  content/     standard examples, challenges and the drawing checker
  state/       app state (signals), drafts, permalinks, router, theme, storage
  ui/          Preact components: studio, pages, dialogs, toasts
  styles/      one stylesheet with light/dark design tokens
tests/         bun:test suites for the language and the app logic
```

### How the interpreter works

1. **Lexing.** `tokenize` never throws. Bad input becomes error tokens, so problems are reported in source order. Each token records whether whitespace is on its left and right; the spacing rule for binary operators uses this.
2. **Parsing.** `parse` first pre-scans procedure headers (calls may come before definitions, and arities are needed for parsing) and the names assigned with `niech`. It then validates the whole program left to right.
   - Expressions are parsed with an operator-precedence loop into postfix code, so deep nesting cannot overflow the stack.
   - Literal widths and repeat counts are checked here; nothing is drawn if parsing fails.
3. **Execution.** `Machine` executes the tree and counts operations exactly as the specification says. It enforces every limit and can record a trace of steps.
   - While the turtle only turns in the plane, its heading is kept as an exact angle. Sines and cosines of multiples of 90° (and 30°/45°) are exact, so squares close precisely and flat programs give identical results in 2D and 3D.
   - Errors carry the Polish message, line, column and source offsets.
4. **Playback.** The UI always runs the program to completion first, then plays the recorded trace. Moves and turns are animated in proportion to distance and angle. Stepping, pausing and the speed control are therefore exact and independent of the interpreter.

## Tech

TypeScript, [Preact](https://preactjs.com) with signals, [Vite](https://vite.dev). No runtime dependencies beyond Preact; no network access at runtime; no WebGL required.
