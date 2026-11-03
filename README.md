# Logomocja

A Polish-language web studio for turtle drawing in Logo, on a flat plane (2D) and in space (3D). It takes its inspiration from the classic Polish *Logomocja* environment. You write a program, run it or step through it, and watch the turtle draw. Errors are reported in Polish at the exact line and column. The app also has thirteen standard example programs, eight challenges with automatic checking, a command reference, and permalinks.

The site is fully static: no backend, no accounts, and no network access while it runs. Drafts, settings and challenge progress are kept in the browser's `localStorage`.

## Running, building, testing

Requires [Bun](https://bun.sh) 1.1 or newer.

```sh
bun install          # dependencies
bun run dev          # development server (Vite), http://localhost:5173
bun run build        # static site in dist/
bun run preview      # serve dist/ locally
bun run test         # interpreter, example and challenge tests (bun test)
```

### Sub-path hosting

The build honours the `BASE_PATH` environment variable (default `/`):

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

`dist/` then works when served from that sub-path on any static host, with no rewrite rules. All routes are hash routes (`#/`, `#/przyklady`, `#/zadania`, `#/zadanie/<id>`, `#/pomoc/<section>`), so refreshing any route works.

## What's inside

| Path | Contents |
| --- | --- |
| `src/lang/` | The interpreter: lexer, parser and validation (all parse-time errors), the expression evaluator, and an execution engine built as a generator that yields after every command, so the UI can step through programs and animate them. Limits, error positions and the operation count follow the specification. |
| `src/examples.ts` | The thirteen standard programs, verbatim. |
| `src/challenges.ts` | The challenges and their checker. |
| `src/ui/` | Editor (a textarea over a highlighted mirror), 2D canvas view, 3D view (three.js, loaded lazily), playback, studio, pages, Polish reference content. |
| `src/styles/` | Design tokens (`tokens.css`) and styles (`app.css`). |
| `tests/` | `bun test` suites for the language, the examples and the challenges. |

### The studio

- **Uruchom / Krok / Pauza (Wznów) / Reset** with the shortcuts `Ctrl+Enter`, `Ctrl+Shift+Enter`, `Alt+P`, `Alt+R` (`⌘` and `⌥` on a Mac). They are listed under the keyboard button in the header and in Pomoc → Skróty klawiszowe.
- **Tempo** ranges from 1 (very slow) to 10 (instant). The turtle animates each stroke, and a whole drawing is capped at a reasonable length at each tempo, so large programs don't take minutes to draw.
- **Editing while a program runs** stops the run. The drawing stays on the chart, and the status line says that the code has changed.
- **Errors:** a parse-time error draws nothing. A run-time error keeps what was drawn so far. Both are marked at the line and column, with a Polish message both in the code and in the status line.
- **2D view:** drag to pan, use the wheel, a pinch or the +/− buttons to zoom, fit with the button or `0`, and the origin and axes stay visible. **3D view:** orbit, pan and zoom, reset the view, a grid on the XY plane, and labelled X, Y and Z axes. Without WebGL, the app explains why 3D is off and shows a simplified isometric projection. 2D works normally.
- **Plik (File) menu:** open a `.logo` file, download the program, copy a permalink (`#/?tryb=2d&kod=…`, which loads and runs the program when opened), and save the drawing as a PNG.
- **Loading an example, link or file** never destroys the draft without a trace. The previous draft is kept as a backup and can be restored from the notification or the File menu.
- **Light and dark themes** follow the system by default. The button in the header switches between system, light and dark.

### Challenges

There are eight tasks (six 2D, two 3D). The checker compares your drawing with the reference drawing by sampling points along both sets of segments. It ignores where the drawing starts (translation) and also accepts the mirror image. The tolerance is 1% of the pattern's diagonal, and at least 1.5 units. Some tasks also check colours or require a construct (`powtórz` or a procedure). Every failure comes with a reason. Progress is saved locally.

### Testing hook

Once the page has loaded, `window.logomocja` has these members:

- `version`: the version string.
- `run(source, mode)` returns `{ segments, error }` without touching the UI.
- `open(source, mode)` loads the program into the editor as if it were pasted, runs it to the end without animation, fits the view, and resolves to `{ segments, error }` once the drawing is on screen.

`mode` is `"2d"` or `"3d"`.

### Choices the specification left open

- **Operation counting:** each command, `niech`, conditional, repeat and call counts as one operation. One more is counted for each finished repeat iteration, each conditional body that runs to its end, and each finished procedure call (including one that ended with `stop`). Exceeding the limit is reported at the token of the operation that went over it.
- A frame limit error is reported at the call or `powtórz` that would open the 33rd frame. Coordinate and segment limit errors are reported at the moving command.
- Literal widths and repeat counts, including a division by zero inside them, are checked at parse time.
- Angles that are multiples of 90° use exact sines and cosines, so squares close exactly.

## Design

The visual system is documented in `DESIGN.md`: a classroom wall chart, with an ink title band, the figure and a numbered key. The tokens live in `src/styles/tokens.css`.
