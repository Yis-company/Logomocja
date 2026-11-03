# Logomocja

Polskie studio rysowania żółwiem — Logo w 2D i prawdziwym 3D, w całości w przeglądarce.
A Polish-language turtle-graphics studio with flat 2D and spatial 3D drawing. No accounts, no backend, no network at runtime.

## Run, build, test

```sh
bun install
bun run dev        # development server (Vite)
bun run build      # static site in dist/
bun run preview    # serve dist/ locally
bun run test       # interpreter tests (bun test)
```

The build honours `BASE_PATH` (default `/`):

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

All asset URLs are prefixed with that path, and the app uses hash routing (`#/`, `#/wyzwania`, `#/pomoc`), so a refresh on any route works from a sub-path on a static host with no rewrite rules.

## What is inside

- **Studio** (`#/`): editor with line numbers, highlighting, an inline error marker and the executing line; run, step, pause/resume, reset and a speed control; a 2D drafting sheet (pan, zoom, fit, origin, rulers) or a 3D view (orbit, pan, zoom, camera reset, ground grid, axes). The title block on the sheet shows the sheet name, mode, scale, segment count, and the turtle's position, heading and pen.
- **Przykłady**: the thirteen standard programs, loadable into their mode. Loading never discards a draft: the previous draft is kept and can be restored from the notice or the examples panel.
- **Wyzwania** (`#/wyzwania`): seven tasks checked automatically. The checker samples both drawings every 2 units and requires every point of each to lie within 2 units of the other; colour and stroke order do not matter. Progress is kept in `localStorage`.
- **Pomoc** (`#/pomoc`): the full dialect reference in Polish, each example runnable.
- **Sharing and files**: permalink (`#/kod?tryb=2d&p=<base64url>`) loads and runs the program; PNG export; `.logo` download and open.
- **Persistence**: drafts per mode, theme, speed and progress in `localStorage`.
- **Shortcuts**: Ctrl/⌘+Enter run, Ctrl/⌘+Shift+Enter step, Ctrl/⌘+. pause/resume, Ctrl/⌘+Shift+Backspace reset (listed under the keyboard button and in Pomoc).

## Testing hook

`window.logomocja = { version, run(source, mode), open(source, mode) }`.
`run` interprets without touching the UI and returns `{ segments, error }`; `open` loads the program into the editor, runs it without animation, fits the view and resolves once painted.

## Layout

- `src/lang/` — lexer, parser (all parse-time validation), generator-based interpreter (`run`, `Machine`).
- `src/content/` — standard examples, challenges and checker, reference text.
- `src/ui/` — editor, 2D sheet, 3D view (Three.js, loaded only when 3D is used), studio, pages.
- `tests/` — interpreter tests.
- `PRODUCT.md`, `DESIGN.md` — product and design records.

Stack: Vite + TypeScript, no UI framework; Three.js for 3D. If WebGL is unavailable, 2D works and the 3D sheet explains why it is off.
