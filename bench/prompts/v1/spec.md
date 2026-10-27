# Logomocja: product brief

You are building **Logomocja** from scratch in the current working directory: a Polish-language web studio for turtle drawing, inspired by the classic Polish Logo environment of the same name, with flat 2D drawing and real 3D spatial drawing. It is a nostalgia project that should feel good to use today, on a desktop and on a phone.

Nobody will answer questions. Decide everything yourself, build the complete app, verify it works, and stop when it is done. Design, architecture, technology, project structure, visual direction and feature depth are yours. Only two things are fixed: the language, and the delivery contract at the end.

## What the app is

- A workspace where you write a Logo program, run it and watch the turtle draw. The interface is in Polish.
- Two modes: 2D (a plane) and 3D (space, with a camera the user can orbit, pan and zoom). A program made only of flat commands draws the same shape in both.
- Running a program: run it whole, step through it command by command, pause and resume, reset. Editing while a program runs should be handled sensibly.
- Errors name a line and column and explain the problem in Polish.
- A few built-in examples the user can load; the user's draft survives a reload (local storage only). No accounts, no backend, no network at runtime.
- Works in current browsers. The 3D part may need WebGL; if it is unavailable the 2D part must still work and the app must say why 3D is off.

Anything beyond this, for example practice challenges, a gallery, sharing, themes, animation of the turtle, is your call. Prefer a smaller app that is polished and correct over a larger one that is not.

## The language (fixed)

The interpreter must implement exactly these semantics. You may add more commands, but every program below must behave as specified.

{{dialect}}

## Delivery (fixed)

- Leave a complete project in the working directory with a `README.md` explaining how to run, build and test it. Use any stack that satisfies the rest of this list.
- `bun install` followed by `bun run build` must produce a self-contained static site in `dist/`: plain files, no server-side code, no runtime network access.
- The build must honour the environment variable `BASE_PATH` (default `/`): with `BASE_PATH=/Logomocja/builds/x/` the site in `dist/` must work when served from that sub-path on a static host with no rewrite rules. If the app has routes, make sure a refresh on any of them still works under those conditions (hash routing is one way).
- Testing hook: once the page has loaded, `window.logomocja` must be an object with `version` (a string) and `run(source, mode)`, where `mode` is `"2d"` or `"3d"`. `run` interprets `source` with the semantics above, without touching the UI, and returns (or resolves to) `{ segments, error }`:
  - `segments`: the drawn strokes in drawing order, each `{ from: [x, y, z], to: [x, y, z], color, width }` with numbers for coordinates and width and the colour as a lowercase `#rrggbb` string;
  - `error`: `null`, or `{ message, line, column }` with the Polish message and 1-based position. For a parse-time error `segments` is empty; for a run-time error it holds what was drawn before the error.
- Tests are welcome but not required. If you add a `test` script, it must pass.
- You may commit as you go or not at all; the harness records the final state of the directory.
