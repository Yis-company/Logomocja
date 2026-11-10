# Logomocja

A Polish-language web studio for Logo turtle graphics: write a program, watch the turtle draw it on a 2D plane or in real 3D space. Static site, no backend, no runtime dependencies.

## Run, build, test

Requires [Bun](https://bun.sh) (1.1+).

```sh
bun install          # nothing to download – the project has no dependencies
bun run build        # writes the self-contained static site to dist/
bun run test         # interpreter, example and challenge-checker tests
bun run serve        # serves dist/ on http://localhost:4173 (PORT=… to change)
bun run dev          # build + serve
```

### Hosting under a sub-path

The build honours `BASE_PATH` (default `/`):

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
BASE_PATH=/Logomocja/builds/x/ bun run serve   # local check at the same prefix
```

`dist/` then contains `index.html` plus `assets/` and `favicon.svg`, all referenced with the prefix. Routing is hash-based (`#/`, `#/wyzwania`, `#/polecenia`, `#/p/<mode>/<program>`), so any static host works without rewrite rules and every deep link survives a reload.

## Automation API

```js
window.logomocja.version            // "1.0.0"
window.logomocja.run(source, mode)  // pure: → { segments, error }, no UI change
await window.logomocja.open(source, mode)
// loads the program into the editor as if pasted, runs it without animation,
// fits the view, resolves with the same { segments, error } once it is drawn
```

`mode` is `"2d"` or `"3d"`. Segments are `{ from:[x,y,z], to:[x,y,z], color:"#rrggbb", width }` in drawing order; `error` is `null` or `{ message, line, column }` (1-based, columns counted in characters). When a program stops with an error, the segments drawn before it are still returned.

## What is in the app

- **Pracownia** (studio): editor with line numbers, syntax highlighting, an inline error marker with the message at the exact spot, and a highlight of the line being executed; run / step / pause / resume / reset, speed slider, turtle marker with heading (and orientation in 3D).
- **2D view**: drag to pan, wheel or pinch to zoom, fit-to-drawing, back to origin; keyboard: arrows, `+`, `−`, `0`.
- **3D view**: drag to orbit, Shift-drag or two fingers to pan, wheel to zoom, reset, ground grid and coloured axes.
- **Przykłady**: the thirteen standard programs, loadable by name. Loading over an edited draft asks first and keeps a restorable backup.
- **Wyzwania**: nine challenges (seven 2D, two 3D), checked automatically against a target shape; progress is stored locally.
- **Sharing**: permalink containing the whole program and mode, PNG export of the current view, `.logo` download and open.
- **Polecenia**: command reference in Polish with a runnable example per command.
- Drafts persist per mode (and per challenge) in `localStorage`; light/dark theme (auto, or forced); responsive down to phone widths; full keyboard operation.

Shortcuts: `Ctrl/⌘+Enter` run, `Ctrl/⌘+Shift+Enter` step, `Ctrl/⌘+.` pause/resume, `Ctrl/⌘+Shift+Backspace` reset. They are listed in the app under *Skróty*.

## Layout

```
build.ts, serve.ts      build script and tiny static server
src/interp/             lexer, parser, machine (the language; no DOM)
src/examples.ts         the 13 standard programs, verbatim
src/challenges.ts       challenges and the shape checker
src/reference.ts        command reference content
src/ui/                 editor, 2D/3D views, small UI helpers
src/main.ts             app wiring, routing, window.logomocja
tests/                  bun tests
```

## Design decisions

- **No dependencies.** Vanilla TypeScript bundled by `Bun.build` into one script and one stylesheet (about 75 kB of minified JS).
- **3D without WebGL.** The 3D view is a real perspective camera (orbit, pan, dolly) with depth-sorted segments, rendered on a 2D canvas. It therefore works on machines without WebGL; if no canvas context is available at all, the stage shows a message instead and the editor, the interpreter and `window.logomocja.run` keep working.
- **One interpreter for everything.** Animated runs, stepping, the instant `run`/`open` API, example thumbnails and the challenge checker all use the same generator-based machine, so they cannot disagree.
- **Errors are found before anything is drawn when they can be.** Syntax, unknown names, wrong argument counts, 3D commands in 2D mode and bad literal arguments are reported at parse time, pointing at the offending token (an unclosed bracket is reported at its opening). Errors that depend on values (division by zero, limits) stop the run and keep what was drawn.
- **Editing during a run stops it** rather than continuing with a program that no longer matches the editor.
- **Challenge checking compares shapes, not code**: the drawing is sampled along its lines and compared with the target, ignoring colour, width, stroke order, position and (2D) rotations by 90° and mirroring / (3D) rotation about the vertical axis. Size matters.
- **Nothing is destroyed silently**: loading an example, a file or a permalink over an edited draft keeps a backup that the toast offers to restore.

## Verification notes

Besides `bun run test`, the build was exercised in headless Chromium under `BASE_PATH=/Logomocja/builds/x/`: all thirteen programs through the examples dialog and through `open()`, stepping, pause/resume, shortcuts, draft persistence per mode across reloads, permalink round-trip, file open/download, PNG export, theme switching, challenge pass/fail and persistence, and phone-width layout, with no console or network errors.
