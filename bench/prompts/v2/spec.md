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

{{dialect}}

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

{{programs}}
