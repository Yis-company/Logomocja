# Logomocja

A Polish-language studio for turtle graphics in Logo, with 2D (plane) and 3D (space) modes. It's a static site: no accounts, no backend, no network access at runtime.

## Running

```sh
bun install
bun run dev        # development server (Vite)
```

## Building

```sh
bun run build                                  # → dist/, served from /
BASE_PATH=/Logomocja/builds/x/ bun run build   # → dist/, served from a sub-path
```

`dist/` holds only static files (HTML, JS, CSS, fonts). Routing lives after the `#` (`#/pracownia`, `#/przyklady`, `#/zadania/<id>`, `#/pomoc/<section>`, a permalink `#/p?tryb=2d&kod=…`), so a refresh works on any static host without rewrite rules. Fonts (Lato, JetBrains Mono) and Three.js are bundled. The 3D view loads in a separate chunk the first time it's needed.

To preview the build: `bun run preview`, or `BASE_PATH=/Logomocja/builds/x/ PORT=4174 bun scripts/serve.ts` (a minimal static server that serves `dist/` under the base path).

## Tests

```sh
bun run test       # interpreter, task checker, help examples, permalinks (bun test)
```

There's also an optional browser test (needs Chromium from `playwright-core`; run against a sub-path build):

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
BASE_PATH=/Logomocja/builds/x/ PORT=4174 bun scripts/serve.ts &
bun scripts/e2e.ts
```

## Testing hook

Once the page has loaded, `window.logomocja` has:

- `version`: a string;
- `run(source, mode)`: interprets the program without touching the UI and returns `{ segments, error }`;
- `open(source, mode)`: loads the program into the editor (the previous draft goes to the stash), runs it without animation, fits the view and resolves to `{ segments, error }` once the drawing is on screen.

`mode` is `"2d"` or `"3d"`.

## Structure

- `src/lang/`: lexer, parser (whole-program validation, name resolution, literal checks), executor (a generator that pauses before each command; limits, 3D geometry).
- `src/examples.ts`: the 13 standard programs, verbatim.
- `src/challenges.ts`: 8 tasks and the checker. It compares drawings as sets of lines (order, direction and splitting of segments don't matter; tolerance is 1.5 units).
- `src/ui/`: editor (textarea plus a highlighting overlay), 2D view (canvas), 3D view (Three.js; when WebGL is missing it falls back to an isometric projection with a notice), animation controller, pages, permalinks, files.
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/`: product and design-system description.

## Keyboard shortcuts

Ctrl/⌘+Enter runs; F10 or Ctrl+Shift+Enter steps; F9 or Ctrl+Shift+Space pauses and resumes; Esc resets. On the drawing: arrows pan, + and − zoom, 0 fits. The full list is under "Skróty" in the studio and in the Pomoc section.
