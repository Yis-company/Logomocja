# Logomocja: conformance test suite

Write a conformance test suite for the Logo dialect specified below. The suite will be run, unchanged, against several independent implementations of this language; each implementation exposes `run(source, mode)` returning the segments it drew and any error. Your cases decide whether an implementation is correct, so precision matters more than quantity, and breadth matters more than repetition.

Nobody will answer questions. Work from the specification alone, decide everything yourself, and stop when the suite is complete.

## The language

{{dialect}}

## What `run` returns

`run(source, mode)` with `mode` `"2d"` or `"3d"` returns `{ segments, error }`:

- `segments`: the drawn strokes in drawing order, each `{ from: [x, y, z], to: [x, y, z], color, width }`; coordinates and width are numbers, colour is a lowercase `#rrggbb` string.
- `error`: `null`, or `{ message, line, column }` with a 1-based position. For a parse-time error `segments` is empty; for a run-time error it holds what was drawn before the error.

## Case file format

Deliver a single file `cases.json` in the working directory:

```json
{
  "version": 1,
  "cases": [
    {
      "name": "square of side 100",
      "mode": "2d",
      "source": "powtorz 4 [np 100 pw 90]",
      "expect": {
        "segments": [
          { "from": [0, 0, 0], "to": [0, 100, 0], "color": "#16866a", "width": 3 },
          { "from": [0, 100, 0], "to": [100, 100, 0], "color": "#16866a", "width": 3 },
          { "from": [100, 100, 0], "to": [100, 0, 0], "color": "#16866a", "width": 3 },
          { "from": [100, 0, 0], "to": [0, 0, 0], "color": "#16866a", "width": 3 }
        ]
      }
    },
    {
      "name": "pitch is rejected in 2D",
      "mode": "2d",
      "source": "np 10\ngora 90",
      "expect": { "error": { "line": 2 } }
    }
  ]
}
```

- `expect.segments` is the complete ordered list of segments; the comparison is exact in count and order, with a numeric tolerance of 0.0001 on coordinates. Give at least six decimal places for values that are not exact.
- `expect.error` means an error is required; `line` is checked and `column` is checked when you give it. Give `column` only when the specification makes it unambiguous. You may give `segments` together with `error` for run-time errors: they are then the segments that must have been drawn before the error.
- Every case must be independent and must not rely on any implementation detail beyond the specification. Do not test error message wording.
- Keep each case small enough that a failure points at one rule.

## Coverage to aim for

Movement and turning in 2D with exact and non-exact angles, backward moves, zero moves, pen up and down, colour and width changes mid-drawing, every Polish and English alias including accented forms, case-insensitivity, comments, numbers in every allowed form, repeat with 0 and nested repeats, procedures with `ma:` parameters and with legacy `:param` headers, parameters used as repeat counts and as arguments to other procedures, definitions after their use, 3D pitching including combinations of pitch and turn, flat programs giving the same result in both modes, each error category with the right line and column, and each limit. Aim for several dozen to about a hundred cases.

You may write scratch scripts to compute expected coordinates, but the only deliverable is `cases.json`, which must be valid JSON matching the format above.
