# Logomocja

Logomocja is a Polish-language web studio for turtle drawing, a tribute to the classic Polish Logo environment of the same name. You write a Logo program, run it, and watch the turtle draw on a plane (2D) or in space (3D, with a camera you can orbit, pan and zoom).

- Run the whole program, step through it one command at a time (the current command is highlighted), pause and resume, or reset.
- Errors give a line and column, explain the problem in Polish, and are underlined in the editor. The draft is also checked in the background while you type.
- If you edit while a program is running, the drawing finishes the version that was started and a notice says so. "Od nowa" (start over) runs the new code. While paused, "Wznów" (resume) and "Krok" (step) start over with the edited code.
- Built-in examples (2D and 3D), help with a full command reference, PNG export, and light, dark and automatic themes.
- The draft, mode, speed and theme are saved in `localStorage`. There are no accounts, no backend and no network access.
- Phone layout: tabs for "Program" and "Rysunek" (drawing), with the controls at the bottom.
- 3D needs WebGL. If WebGL is unavailable, the 3D button is disabled and the app explains why. 2D works normally.

## Running, building, testing

You need [Bun](https://bun.sh).

```sh
bun install          # dependencies
bun run dev          # development server (Vite)
bun run build        # static site in dist/
bun run preview      # serve dist/ locally
bun run test         # interpreter unit tests (bun test)
bun run typecheck    # TypeScript check
```

The build honours `BASE_PATH` (default `/`):

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

The resulting `dist/` contains only static files and works when served from that sub-path with no rewrite rules. The app has a single view and no routes, so a refresh always works. The three.js renderer is a separate chunk that loads only when 3D mode is turned on.

## Testing hook

Once the page has loaded, `window.logomocja` provides:

```js
window.logomocja.version            // "1.0.0"
window.logomocja.run(source, "2d")  // { segments, error }
```

`run` interprets the program without touching the UI. `segments` holds `{ from: [x,y,z], to: [x,y,z], color: "#rrggbb", width }` in drawing order. `error` is `null` or `{ message, line, column }`, where the message is in Polish and the position is 1-based. For a parse-time error `segments` is empty. For a run-time error it holds whatever was drawn before the error. Coordinates are rounded to 1e-9 to remove floating-point noise (for example, 80 rather than 79.99999999999999).

## Project structure

```
src/lang/        language: lexer, parser (whole-program validation), interpreter
src/render/      View2D (canvas, pan/zoom) and View3D (three.js, OrbitControls, fat lines)
src/ui/          app, editor with highlighting, animation player, examples, storage
tests/           bun test: language semantics, errors, limits
```

## Language interpretation decisions

These are choices where the specification leaves room:

- **Operation counter** (10,000 limit): each executed statement counts as one operation. That is every simple command, plus one for each `powtórz` statement and one for each procedure call. Repeat iterations are not counted separately. So `powtorz 9999 [pw 1]` works, and `powtorz 10000 [pw 1]` exceeds the limit.
- **Active frame depth** (32): each running `powtórz` and each procedure call is one frame. This is checked at run time. Bracket depth (32) is checked at parse time.
- **Token limit**: words, numbers, brackets, commas and colour literals count. Comments and line breaks do not.
- **Error positions**: a missing argument is reported at the command. A wrong argument is reported at the argument itself. A wrong number of arguments to a procedure is reported at the call. Recursion is reported at the first call in the source that closes a cycle.
- **Parameters**: a run-time error in a parameter value (for example `grubość w` with `w = 13`) is reported at the place where the parameter is used.
- **Order of errors**: in the main program and procedure bodies, the error that comes first in the source is reported. Structural errors (missing `już`, nested definitions) and recursion are checked in separate passes.
- **Names**: procedure and parameter names cannot be language keywords and must start with a letter. A procedure parameter shadows a procedure of the same name in argument position.
- **Numbers**: `5.` is accepted as 5. `1e3`, `0x10` and `1,5` are not numbers. For a comma, the message suggests writing the decimal with a dot.
- **Coordinates**: before each move the target position is checked against ±100,000. If it is out of range the move does not happen and nothing is drawn.
