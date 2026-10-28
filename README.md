# Logomocja

A Polish-language web studio for turtle drawing in the Logo language. Write a
program, run it and watch the turtle draw in a flat 2D plane or in 3D space.
It is a static site: no accounts, no backend, no network access at runtime.

## Requirements

- [Bun](https://bun.sh) 1.4 or newer (the project was built and tested with 1.4.4).
- A modern browser. 3D needs WebGL; without it the app still works in 2D and says why 3D is off.

## Install, run, build, test

```sh
bun install          # install dependencies
bun run dev          # development server at http://localhost:5173
bun run build        # type-check, then build a static site into dist/
bun run test         # interpreter, standard programs, reference examples, challenges
bun run typecheck    # type-check only
bun run preview      # serve dist/ locally
```

### Serving under a sub-path

The build honours `BASE_PATH` (default `/`). Asset URLs are generated for that
path, and routing uses the URL hash, so `dist/` works on a static host with no
rewrite rules and a refresh on any page keeps working:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

## Using the studio

- **Studio** (`#/`): the editor on the left, the drawing on the right. On a
  phone the two are switched with the Program / Rysunek tabs.
- **Pomoc** (`#/pomoc`): every command, expression, variable, conditional,
  procedure and limit, each with a runnable example.
- **Przykłady**: the thirteen standard programs. Each loads into its mode and runs.
  A standard program can also be opened by name, with `#/?przyklad=kwadrat` (any of
  the names shown in the dialog).
- **Wyzwania**: seven practice tasks. Each one checks the program against a
  target drawing and reports pass or fail with a reason. Progress is saved in the browser.
- **Plik i więcej**: save the program as `.logo`, open a `.logo` file, export
  the drawing as PNG, copy a share link, or restore the previous draft.

Shortcuts (listed under *Skróty* in the app):

| Keys | Action |
| --- | --- |
| Alt+U (or Ctrl+Enter, ⌘+Enter) | Run, or resume a paused program |
| Alt+K | Step: run one command |
| Alt+P | Pause or resume |
| Alt+R | Reset: clear the drawing and stop |

On the drawing: arrow keys pan, `+` and `−` zoom, `Home` fits the drawing.

## Testing hook

Once the page has loaded, `window.logomocja` is available:

- `version`: the version string.
- `run(source, mode)`: interprets `source` without touching the UI and returns
  `{ segments, error }`. Each segment is `{ from: [x, y, z], to: [x, y, z], color, width }`
  with a lower-case `#rrggbb` colour. `error` is `null` or `{ message, line, column }`.
  A parse-time error gives no segments; a run-time error keeps what was drawn before it.
- `open(source, mode)`: loads `source` into the editor in `mode`, runs it to the
  end without animation, fits the view, and resolves to the same `{ segments, error }`
  once the drawing is on screen.

`mode` is `"2d"` or `"3d"`.

## Code layout

```
src/lang/        the Logo language
  spec.ts        limits, command words and their aliases
  lexer.ts       tokens with 1-based positions
  parser.ts      two passes: procedure headers and declared names, then the tree
  machine.ts     the executor: a generator that runs one statement per step
  geometry.ts    turtle orientation: heading, right and up vectors
  index.ts       run(), diagnose(), and Session for stepping and animation
src/ui/          the app: workspace (studio), editor, 2D and 3D views, reference page,
                 routing, theme, storage, permalinks, dialogs and toasts
src/data/        the thirteen standard programs (byte for byte) and the Pomoc content
src/challenges/  challenge definitions and the geometric checker
tests/           bun test suites for the interpreter and for the content
```

3D uses [three.js](https://threejs.org): fat lines for stroke width, orbit
controls with Z up, a ground grid in the XY plane, and an oriented turtle.

## Decisions where the brief left room

- **Routing and permalinks.** Hash routes only. A permalink is
  `#/?tryb=2d&kod=…`, where `kod` is the program as URL-safe base64 of its UTF-8
  bytes. Nothing is sent to a server.
- **Drafts.** Each mode keeps its own draft in `localStorage`. Loading an example,
  a permalink or a file keeps the text it replaces as a backup: a toast offers
  *Przywróć*, and the menu has *Przywróć poprzedni szkic*.
- **Editing during a run.** The current drawing stays on screen. The run stops
  and the status line asks for a new run, so nothing changes under the learner's feet.
- **Operation count.** Each command, `niech`, conditional, repeat and call costs one
  operation. Each repeat iteration, executed conditional body and procedure call
  costs one more when it finishes. This includes finishing early because of `stop`.
- **Parentheses.** Nested parentheses are limited to 256 levels as a guard against
  stack overflow. The brief sets no limit for them.
- **Challenges.** The checker compares geometry only. It samples both drawings
  and accepts a match when every sampled point lies within 1 unit of the other
  drawing. Colour and width are ignored; position, size and shape are not.
- **Without WebGL.** The 3D mode is disabled with an explanation. A 3D permalink
  opens in 2D with a note, and a 3D program then reports the pitch command as a 2D error.

## Verification

The interpreter is covered by `tests/interpreter.test.ts` (grammar, spacing rule,
precedence, every limit, error positions, geometry in 2D and 3D). The thirteen
standard programs, every example in the Pomoc page and every challenge's
reference solution are covered by `tests/content.test.ts`.

The UI was checked by hand in headless Chromium: running, stepping, pausing,
resetting, the error marker, examples and backups, challenges, `.logo` and PNG
files, permalinks, both themes, a phone-sized viewport, 3D with WebGL, the
no-WebGL fallback, and a `BASE_PATH` sub-path build with refreshes on both routes.
