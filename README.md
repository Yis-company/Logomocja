# Logomocja

A Polish-language web studio for turtle drawing, in the spirit of the classic Logo
environment. Write a program, run it and watch the turtle draw in a flat 2D plane or in
real 3D space. Everything runs in the browser: no accounts, no backend, no network at runtime.

Features: a highlighted editor with error markers, run / step / pause / reset with a speed
control, 2D and 3D views, thirteen standard programs, six practice challenges that are checked
automatically, permalinks, PNG export, `.logo` files, a full command reference in Polish, light
and dark themes, and keyboard shortcuts.

## Requirements

- [Bun](https://bun.sh) 1.x (used as package manager, test runner and script runner)

## Run

```sh
bun install
bun run dev        # Vite dev server, open the printed URL
```

## Build

```sh
bun install
bun run build      # type-checks, then writes a static site to dist/
```

`dist/` contains plain files only (HTML, JS, CSS). There is no server-side code and no
runtime network access.

### Serving under a sub-path

The build honours `BASE_PATH` (default `/`):

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

The site then works when served from `/Logomocja/builds/x/` on a static host with no rewrite
rules. Routing is hash-based (`#/`, `#/wyzwania`, `#/referencja`), so a refresh on any screen
works without server configuration.

Preview a build locally with `bun run preview` (or serve `dist/` with any static file server).

## Test

```sh
bun run test       # interpreter, parser, content and sharing tests
```

The tests live in `tests/` and run under `bun test`. They cover the language semantics and the
error positions, all thirteen standard programs, the reference examples, the challenge checker
and the permalink encoding. Browser tests are not part of the suite.

## Testing hook

Once the page has loaded, `window.logomocja` provides:

- `version`: the application version string.
- `run(source, mode)`: interprets `source` without touching the UI. Returns
  `{ segments, error }`. Each segment is `{ from: [x, y, z], to: [x, y, z], color, width }` with
  a lowercase `#rrggbb` colour. `error` is `null` or `{ message, line, column }` (1-based).
  A parse-time error gives no segments; a run-time error keeps what was drawn before it.
- `open(source, mode)`: loads `source` into the editor in `mode` as a paste would, runs it to the
  end without animation, fits the view and resolves to the same `{ segments, error }` once the
  drawing is on screen.

`mode` is `"2d"` or `"3d"`.

## Project layout

```
index.html                 app shell
vite.config.ts             BASE_PATH and build settings
src/main.ts                router, page assembly, window.logomocja
src/lang/                  the language, independent of the UI
  lexer.ts                 tokens with positions, never throws
  commands.ts              command table and aliases
  parser.ts                parse-time checks: names, arities, nesting, literal ranges
  interpreter.ts           step-by-step execution (generator based), limits, drawing
  turtle.ts                orientation maths (heading, right, up)
  highlight.ts             colouring for the editor
  index.ts                 compile(), runSource(), public exports
src/content/
  examples.ts              the thirteen standard programs, byte for byte
  challenges.ts            challenges and the drawing checker
  reference.ts             text of the command reference
src/ui/
  workspace.ts             editor, run controls, stage, files, sharing, keyboard
  editor.ts                textarea over a highlighted layer
  view2d.ts                canvas plane: pan, zoom, fit, origin, PNG export
  view3d.ts                three.js space view (loaded on demand)
  challenges-page.ts       challenge list, editor, check, ghost of the target
  reference-page.ts        the Polish documentation with "open in editor" links
  share.ts, storage.ts     permalink encoding and local storage
  theme.ts, toast.ts, dialogs.ts, webgl.ts, dom.ts
tests/                     bun test suites
```

## Decisions where the specification left room

- **3D fallback.** WebGL is checked at startup. Without it the 3D mode is disabled, the stage
  explains why, and 2D keeps working. Three.js is loaded only when 3D is first used.
- **Operations.** Every executed statement counts once, including `niech`, `jeśli`, `powtórz` and
  calls. Finishing a repeat iteration, a conditional body or a call counts once more, whether it
  ends normally or through `stop`. Reaching the end of the program does not count.
- **Frames.** A repeat or a call occupies a frame while it is active; conditional bodies do not.
- **Variables.** Inside a procedure, a name the procedure assigns is local for the whole call. Reading
  it before its `niech` on that path is a run-time error, even when a global of the same name
  exists. Procedures may read top-level variables.
- **Errors in 2D.** `gora`, `dol`, `pp` and `pl` are rejected when the program is checked in 2D mode,
  so nothing is drawn.
- **Parameters.** Parameters must be introduced with `ma:` (or the legacy `:name` form). A parameter
  cannot use the name of a command or keyword.
- **Argument errors.** A missing argument is reported at the token where it should have started, or at
  the command at the end of the program. A surplus value is a stray value at its own position.
- **Errors while editing.** Editing a program that is running stops it and keeps the drawing, marked
  as stale until the next run. Parse errors are shown live while typing; nothing is drawn by a run
  that fails to parse.
- **Challenges.** A drawing passes when every expected point is drawn within 1.5 units and nothing is
  drawn outside the expected picture. The way the picture is made (loops, procedures, pen moves,
  splitting lines) does not matter. Colour and width are checked only when a challenge asks for them.
- **Permalinks.** `#/?m=<mode>&p=<base64url of UTF-8 source>`. Opening one loads and runs the program,
  then removes the program from the address so that a refresh keeps the user's own draft.
- **Drafts.** Each mode keeps its own draft in local storage. Loading an example, a permalink or a file
  replaces the editor text as a paste would, so Ctrl+Z restores it, and a notice offers to bring the
  previous text back.

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| Ctrl+Enter | Run from the start |
| Alt+K | Step: run one statement |
| Alt+P | Pause or resume |
| Alt+R | Reset the drawing and stop |

The same list is available from the "Wszystkie skróty" link in the interface.
