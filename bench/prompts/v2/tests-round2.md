# Logomocja: conformance test suite, second round

Two conformance suites for the Logo dialect below were written independently from the specification: `round1/own.json` is yours, `round1/other.json` was written by another author. Both will be merged into one suite and run, unchanged, against several independent implementations that have not seen any of the cases. Your job in this round is to make the merged suite sharper.

Nobody will answer questions. Work from the specification and the two files alone, decide everything yourself, and stop when both deliverables are complete.

## The language

{{dialect}}

## What `run` returns

`run(source, mode)` with `mode` `"2d"` or `"3d"` returns `{ segments, error }`:

- `segments`: the drawn strokes in drawing order, each `{ from: [x, y, z], to: [x, y, z], color, width }`; coordinates and width are numbers, colour is a lowercase `#rrggbb` string. After `czyść` only the segments drawn afterwards are returned.
- `error`: `null`, or `{ message, line, column }` with a 1-based position. For a parse-time error `segments` is empty; for a run-time error it holds what was drawn before the error.

## Deliverable 1: `review.json`

Read every case of `round1/other.json` against the specification. List each case you believe is wrong, with the rule it violates and what the correct expectation would be:

```json
{
  "version": 2,
  "disputed": [
    {
      "name": "the case name as it appears in round1/other.json",
      "reason": "which rule of the specification the case violates and why",
      "correct": { "error": { "line": 1, "column": 7 } }
    }
  ]
}
```

`correct` is optional and uses the same shape as `expect` in a case. Be exact and be sparing: a dispute that turns out to be wrong costs more than one you did not raise. If you find nothing wrong, deliver an empty `disputed` list. Do the same for your own file if, on rereading, you find mistakes there, and list them under `"ownMistakes"` with the same shape.

## Deliverable 2: `cases.json`

New cases only: nothing that duplicates a case in either file by source. Use the same format as before (`"version": 2`, `cases` with `name`, `mode`, `source`, `expect`), with these rules:

- `expect.segments` is the complete ordered list of segments, compared exactly in count and order with a tolerance of 0.0001; give at least six decimal places for values that are not exact.
- `expect.error` requires an error; `line` is checked, and `column` when given. Give `column` whenever the specification makes it unambiguous. `segments` may accompany `error` for run-time errors.
- Do not test message wording. Every case must follow from the specification alone.

Target fifty to one hundred cases. Put them where the two suites are weakest:

- Rules that neither suite exercises. Make a checklist of the specification's rules, tick off what the two files cover, and write cases for the rest.
- Combinations: a case that only passes if two rules are both implemented correctly (for example `nrpowt` inside a conditional inside a recursive call, or a `czyść` inside a repeat whose count is an expression of a global).
- Edges: exactly at a limit and one past it, whitespace rules with every operator and with tabs and newlines, exact floating-point comparisons, orientation sequences in 3D that must compose to the identity.
- Programs long enough that an implementation with a subtle state bug (locals leaking, counters not restored after an inner repeat, roll drifting) shows it, while each still tests one idea.

You may write scratch scripts to compute expected coordinates; double precision is required. The deliverables are `review.json` and `cases.json` in the working directory, both valid JSON.
