# Logomocja

**Logomocja** is a Polish-language turtle-graphics studio in the spirit of the classic Polish Logo
environment of the same name. You write a short Logo program, run it, and watch the turtle draw —
on a flat plane (**2D**) or in real space (**3D**). The whole interface is in Polish; everything runs
in the browser (no accounts, no backend, no network at runtime).

> *Pracownia żółwia: pisz programy w Logo, uruchamiaj je krok po kroku, rozwiązuj wyzwania i dziel
> się rysunkami — na płaszczyźnie i w przestrzeni.*

## What is in the box

| Area | What you get |
| --- | --- |
| Editor | Line numbers, syntax highlighting (commands, numbers, names, colour literals with a swatch, comments, bracket-depth colours), inline error marker at line/column with the Polish message, highlight of the line being executed, live validation while typing |
| Execution | Run, step (command by command), pause/resume, reset, 6 speed levels (down to "instant"), animated turtle marker with position, heading and (3D) orientation, sensible handling of edits while running |
| 2D view | Pan, zoom (wheel, pinch, keys), fit-to-drawing, grid with rulers, visible origin and axes |
| 3D view | Orbit / pan / zoom camera (mouse, touch, keyboard), reset, ground grid, axes, orientation gizmo, depth cueing. Rendered with the 2D canvas API (no WebGL needed, so it works everywhere) |
| Examples | The thirteen standard programs, verbatim, loadable by name into the right mode (toolbar list or the *Przykłady* gallery with thumbnails). Loading never silently destroys an unsaved draft: the previous text is kept in *Szkice* and an *Undo* button appears |
| Challenges | 11 practice tasks (8 in 2D, 3 in 3D). Each shows the target drawing, checks your program automatically against it (geometric comparison with tolerance, independent of drawing order and direction), and explains why a try fails. Progress is stored locally |
| Sharing & files | Permalink with program + mode in the URL hash (opening it loads and runs the program), PNG export, download a `.logo` file, open a `.logo` file |
| Reference | *Polecenia* page: every command with aliases and a runnable example, expressions, variables, conditionals, procedures, 3D orientation, errors and limits, keyboard shortcuts |
| Persistence | Draft of each mode, speed, theme, challenge progress and saved drafts live in `localStorage` only |
| UI | Responsive (desktop split view, phone stack with bottom navigation), light/dark theme following the system with a manual toggle, keyboard-operable and labelled controls, visible focus, reduced-motion aware |

### Keyboard shortcuts

| Action | Keys |
| --- | --- |
| Run | `Ctrl+Enter` (`⌘+Enter`), `F9` |
| Step | `Ctrl+Shift+Enter`, `F10` |
| Pause / resume | `Ctrl+.`, `F8` |
| Reset (stop, clear drawing) | `Esc` |
| Download `.logo` | `Ctrl+S` |
| Show shortcuts | `?` (outside the editor) |

On the drawing canvas: arrows pan (2D) / orbit (3D), `Shift`+arrows pan, `+`/`−` zoom, `0` or `Home` fits the view.

## Getting started

Requirements: [Bun](https://bun.sh) ≥ 1.1. There are **no runtime or build dependencies** — `bun install`
has nothing to download — so the build works offline.

```sh
bun install          # nothing to fetch, but harmless
bun run build        # static site in dist/
bun run test         # interpreter, checker, share/file helpers, reference examples, fuzzing
bun run dev          # build + watch + serve on http://localhost:4173/
bun run preview      # serve the already built dist/ (see below for sub-paths)
bun run e2e          # optional browser smoke test (needs Playwright, see e2e/smoke.ts)
```

### Building for a sub-path

`BASE_PATH` (default `/`) tells the build where the site will be hosted:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
bun run preview --base /Logomocja/builds/x/        # http://localhost:4173/Logomocja/builds/x/
```

* `dist/` is plain static files: `index.html`, one hashed JS bundle (classic script, no ES-module
  loading so it even works from `file://`), one hashed CSS file, a favicon and a web manifest.
* Asset URLs in `index.html` start with `BASE_PATH`; if the site is served from somewhere else, an
  `onerror` fallback loads the same files relative to the page.
* Routes use the URL hash (`#/`, `#/przyklady`, `#/wyzwania/<id>`, `#/polecenia/<sekcja>`), so refreshing
  on any route works on any static host with no rewrite rules. A permalink looks like
  `#/?tryb=3d&kod=<base64url, deflate-compressed when smaller>`.

## Testing hook

Once the page has loaded, `window.logomocja` is available:

```js
window.logomocja.version                 // "1.0.0"
window.logomocja.run(source, "2d" | "3d")   // pure interpreter, no UI → { segments, error }
await window.logomocja.open(source, mode)   // loads into the editor as if pasted, runs to the end
                                            // without animation, fits the view, resolves with the
                                            // same { segments, error } once the drawing is painted
```

`segments` are `{ from: [x, y, z], to: [x, y, z], color: "#rrggbb", width }` in drawing order;
`error` is `null` or `{ message, line, column }` (Polish message, 1-based position).

## Project layout

```
build.ts               static build (Bun.build) honouring BASE_PATH
scripts/               dev server, static preview server
src/lang/              the interpreter: lexer, parser (AST + validation), evaluator, turtle geometry
src/data/              the 13 standard programs, challenges + checker, reference content
src/ui/                app shell, router, workspace (editor + runner + views), pages, dialogs
src/ui/view/           2D and 3D canvas views, thumbnails
src/styles/            CSS (design tokens, light/dark)
tests/                 bun:test suites (language, limits, examples, challenges, share, fuzz, …)
docs/language.md       the dialect as implemented, with the decisions taken on ambiguous points
```

### Design notes

* **Interpreter first.** `parse()` validates the whole program (names, arities, literal widths and
  repeat counts, nesting, `nrpowt` placement, 2D restrictions) before anything is drawn; `Machine`
  executes the resulting AST as a generator, so the UI can animate, pause and single-step on the same
  code path the tests use. Expressions are compiled to postfix and evaluated with an explicit stack, so
  very long or deeply nested expressions cannot overflow the JavaScript stack.
* **One turtle model for both modes.** The turtle is a position plus three unit vectors (heading, right,
  up); 2D is simply 3D with pitch/roll rejected at parse time, which is why flat programs give
  bit-identical coordinates in both modes. Multiples of 90° use exact sine/cosine values.
* **Canvas 2D for 3D.** A perspective camera + depth-bucketed painter's algorithm draws the lines with
  depth cueing; no WebGL means nothing to fall back from.
* **No framework.** Plain TypeScript with a tiny DOM helper keeps the bundle around 150 kB.

See [`docs/language.md`](docs/language.md) for the language reference as implemented.

## License

MIT
