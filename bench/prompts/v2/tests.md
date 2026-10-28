# Logomocja: conformance test suite

Write a conformance test suite for the Logo dialect specified below. The suite will be run, unchanged, against several independent implementations of this language, none of which will have seen your cases; each implementation exposes `run(source, mode)` returning the segments it drew and any error. Your cases decide whether an implementation is correct, so precision matters more than quantity, and a case that a careless implementation passes is worth little.

Nobody will answer questions. Work from the specification alone, decide everything yourself, and stop when the suite is complete.

## The language

{{dialect}}

## What `run` returns

`run(source, mode)` with `mode` `"2d"` or `"3d"` returns `{ segments, error }`:

- `segments`: the drawn strokes in drawing order, each `{ from: [x, y, z], to: [x, y, z], color, width }`; coordinates and width are numbers, colour is a lowercase `#rrggbb` string. After `czyść` only the segments drawn afterwards are returned.
- `error`: `null`, or `{ message, line, column }` with a 1-based position. For a parse-time error `segments` is empty; for a run-time error it holds what was drawn before the error.

## Case file format

Deliver a single file `cases.json` in the working directory:

```json
{
  "version": 2,
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
      "name": "stray number after an operator with whitespace on one side",
      "mode": "2d",
      "source": "np 10 -5",
      "expect": { "error": { "line": 1, "column": 7 } }
    }
  ]
}
```

- `expect.segments` is the complete ordered list of segments; the comparison is exact in count and order, with a numeric tolerance of 0.0001 on coordinates. Give at least six decimal places for values that are not exact.
- `expect.error` means an error is required; `line` is checked and `column` is checked when you give it. Give `column` whenever the specification makes it unambiguous, and it usually does: an invalid argument is reported at the first token of that argument's expression. You may give `segments` together with `error` for run-time errors: they are then the segments that must have been drawn before the error.
- Every case must be independent and must not rely on any implementation detail beyond the specification. Do not test error message wording.
- Keep each case small enough that a failure points at one rule, but make the rule worth testing: prefer a case that combines two features, or sits exactly on an edge, over a case that any first attempt would pass.

## What to cover

Aim for one hundred to two hundred cases. The list below is the minimum; add anything the specification implies that is not on it.

- Expressions: precedence, left associativity, parentheses, stacked unary signs, a sign applied to a name and to a parenthesis, the whitespace rule for every binary operator in both its accepted and its rejected forms, expressions as repeat counts, widths, pitch angles and call arguments, division by zero at parse-visible and run-time-only positions, exact floating-point behaviour such as `0.1 + 0.2`.
- Variables: globals read inside procedures, globals declared after their use, locals shadowing globals and disappearing after the call, reassigning a parameter, a name that is declared only in another procedure, an unassigned variable read before its `niech` on the current path, a variable with the name of a procedure.
- Conditionals: every comparison operator, both branches of `jeżeli`, nested conditionals, a conditional containing a repeat and a repeat containing a conditional, a `stop` inside a conditional inside a repeat inside a procedure, conditional bodies not counting as frames.
- Recursion and `stop`: a recursive procedure with a base case, mutual recursion, `stop` at top level ending the program with what was drawn, exactly 32 active frames accepted and 33 rejected with the segments drawn so far, the operation limit reached through recursion.
- `nrpowt`: nested repeats, a procedure called from a repeat that uses `nrpowt` in its own repeat, the lexical parse-time errors, `nrpowt` in a repeat count and in a call argument.
- 3D: roll alone, roll then pitch, roll then turn, pitch then roll, sequences of roll, pitch and turn that must bring the turtle back to its starting orientation, a tilted circle, roll rejected in 2D including inside a never-run body.
- `dom` and `czyść`: `dom` with the pen up, `dom` when already at the origin, `dom` after a 3D rotation, `czyść` followed by more drawing, `czyść` followed by a run-time error, the segment limit after `czyść`.
- Error positions: at least one case per error category in the specification, each with a column, including the first-token rule for invalid arguments and the stray-value rule.
- Everything from version 1 that still applies: aliases including accented forms, case-insensitivity, comments hiding brackets, number forms, pen state, colour and width persistence, zero moves, procedures with `ma:` and legacy headers, definitions after use, flat programs identical in both modes, each limit.

You may write scratch scripts, in any language available, to compute expected coordinates; double precision is required. The only deliverable is `cases.json`, which must be valid JSON matching the format above.
