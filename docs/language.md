# The Logomocja dialect, as implemented

This is the language as the interpreter in `src/lang/` actually behaves. The user-facing (Polish) reference
lives in the app, on the *Polecenia* page (`src/data/reference.ts`). This file records the precise rules and the
decisions taken where a rule could be read more than one way.

## Pipeline

```
source ──lex──▶ tokens ──prepass──▶ procedures + declared names ──parse──▶ AST ──Machine──▶ segments
         (limits)            (never fails)                      (first error wins)   (generator)
```

* `lex` produces tokens with `line`, `col`, `spaceBefore`, `spaceAfter`, `firstOnLine`, `lastOnLine`.
  Lexical problems become `err` tokens that are reported only when the parser reaches them, so the error
  reported is always the **earliest one in the source**.
* The pre-pass collects procedure headers (name, parameters) and, per scope (top level or procedure body), every
  name assigned with `niech`. Names may therefore be used before they are assigned or defined.
* `parse` validates the whole program. Any error means nothing is executed.
* `Machine.steps()` is a generator yielding one `Step` per executed command, `niech`, repeat, conditional and
  call. The UI animates/steps over it; `runSource` simply drains it.

## Lexical details

* Names are NFC-normalised and lower-cased. Diacritics are **not** folded (`kąt` ≠ `kat`); only the aliases
  listed in the command table exist in both spellings.
* A number is `digits`, `digits.digits` or `.digits`. A digit-led run that continues with letters, digits,
  underscores or dots (`1e3`, `0x10`, `5.`, `1.2.3`, `10pw`) is one error token reported at its start.
  `NaN` / `Infinity` are ordinary words, hence unknown names.
* `:name` is one token when the colon is not glued to a preceding word character; `ma:` is the word `ma`
  followed by a lone colon. Colour literals are a `"` … `"` string on one line.
* Whitespace before/after an operator includes line breaks, the start/end of the file and an adjacent comment.

## Expressions

`expr := term (('+'|'-') term)*`, `term := unary (('*'|'/') unary)*`, `unary := ('+'|'-')* primary`,
`primary := number | name | :name | nrpowt | '(' expr ')'`.

A binary operator is accepted only when `spaceBefore === spaceAfter`. Otherwise the expression simply ends there;
the operator is then either a unary sign beginning the next call argument (`f 10 -5` with two parameters passes
`10` and `-5`) or a stray token reported at the operator.

Expressions compile to postfix. Evaluation is exact IEEE-754; every intermediate result must be finite and
division by zero is an error. Literal-only expressions are folded at parse time for the width / repeat-count
checks (a fold that divides by zero is left to run time).

## Statements

| Statement | Notes |
| --- | --- |
| movement / turning | `np ws pw lw` (+ `gora dol pp pl` in 3D); the argument is any expression |
| `pod opu dom czyść stop` | no argument |
| `kolor "#rrggbb"` | literal only; stored lower-case |
| `grubosc e` | integer 1–12; checked at parse time when `e` has no names, otherwise when executed |
| `powtorz e [ … ]` | integer 0–10000, same literal/dynamic split |
| `niech name e` | name must not be a keyword or a procedure |
| `jeśli a ⋄ b [ … ]`, `jeżeli a ⋄ b [ … ] [ … ]` | `⋄` is one of `< > = <= >= <>` |
| `name e₁ … eₙ` | call of a user procedure (exactly *n* arguments) |
| `oto name [ma: p, …] … już` | top level only; header on one line, `już` alone on its line |

### Scoping

* Top-level `niech` → global. In a procedure → local to that call (shadows a global for the rest of the call).
* Reading looks in the call's locals first, then in the globals. Parameters are locals.
* A name is *declared* in a procedure if it is a parameter or assigned there; it is declared at top level if
  assigned at top level. Use of a name that is not declared in the current scope or at top level is a parse error;
  use before assignment on the executed path is a run-time error.
* `nrpowt` is checked lexically: it must be inside a `powtorz` body **of the same procedure body (or the top
  level)**. At run time each call frame keeps its own stack of repeat counters.

## Turtle

State: position, unit vectors *heading* `h` (+Y), *right* `r` (+X), *up* `u` (+Z), pen, colour, width.

| Command | Effect on the frame |
| --- | --- |
| `pw a` | `h' = h·cos a + r·sin a`, `r' = r·cos a − h·sin a` |
| `gora a` | `h' = h·cos a + u·sin a`, `u' = u·cos a − h·sin a` |
| `pp a` | `u' = u·cos a + r·sin a`, `r' = r·cos a − u·sin a` |

`lw`, `dol`, `pl` use `−a`. Angles are reduced modulo 360 first; multiples of 90° use exact values, so the
flat programs of the spec produce exact coordinates (and `-0` is normalised to `0`). A move to a coordinate with
`|c| > 100000` is rejected before it happens.

## Limits and error positions

| Limit | Behaviour |
| --- | --- |
| 50 000 characters | parse error at the first character over the limit |
| 10 000 tokens | parse error at the 10 001st token |
| bracket depth 32 | parse error at the 33rd nested `[` |
| parenthesis depth | no limit of its own (the expression parser is iterative); bounded only by the 10 000-token limit |
| 32 active frames | run-time error at the call / `powtorz` that would be the 33rd; conditionals do not count; `powtorz 0` does not open a frame |
| 10 000 operations | run-time error at the operation that would be the 10 001st |
| 10 000 kept segments | run-time error at the move (unreachable in practice: each segment costs an operation) |
| ±100 000 coordinates | run-time error at the move command |

Operation accounting: 1 per command, `niech`, `jeśli`/`jeżeli`, `powtorz`, call; plus 1 per finished repeat
iteration, per finished conditional body that actually ran, and per finished call (also when left by `stop`).
Leaving a body through `stop` does not count the abandoned iteration / conditional body. Reaching the end of the
program counts nothing. Hence `powtorz 9999 []` fits exactly (1 + 9999) and `powtorz 10000 []` does not.

Where errors point (always 1-based line and column):

* invalid argument value (bad width / count, division by zero, non-finite result, unassigned variable) → first
  token of that argument's expression (for conditions: of the left or right operand containing the problem);
* missing argument → the token found where it should start, or the command itself when the program ends there;
* stray value where a command is expected → that value;
* unclosed `[` / `(` → the opening bracket; unmatched `]` / `)` → that bracket;
* missing `już` → the `oto` of the unterminated definition; `oto` inside a body or procedure → that `oto`;
* limit exceeded → the offending token / command.

Parse errors leave `segments` empty; run-time errors keep the segments drawn so far (after any `czyść`).
