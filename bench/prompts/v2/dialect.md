### Lexical rules

- Keywords, procedure names, variable names and parameter names ignore case. Accented Polish spellings listed below work alongside the unaccented ones.
- Whitespace separates tokens; newlines matter only for procedure headers and endings (see Procedures).
- A semicolon starts a comment that runs to the end of the line.
- Numbers are unsigned decimal literals: `80`, `12.5`, `.5`. A sign is an operator (see Expressions). Nothing else is a number: `1e3`, `0x10`, `NaN` and `Infinity` are errors.
- Square brackets `[` and `]` delimit repeat and conditional bodies and may nest. Parentheses `(` and `)` group expressions.
- A colour literal is a quoted six-digit hex string: `"#16866a"` (case-insensitive hex digits).
- The operators are `+ - * /`, the comparisons `< > = <= >= <>`.

### Commands

| Polish | English | Argument | Meaning |
| --- | --- | --- | --- |
| `np`, `naprzod`, `naprzód` | `fd`, `forward` | expression | Move forward by that distance |
| `ws`, `wstecz` | `bk`, `back` | expression | Move backward |
| `pw`, `prawo` | `rt`, `right` | expression | Turn right by that many degrees |
| `lw`, `lewo` | `lt`, `left` | expression | Turn left by that many degrees |
| `pod`, `podnies`, `podnieś` | `pu`, `penup` | none | Raise the pen |
| `opu`, `opusc`, `opuść` | `pd`, `pendown` | none | Lower the pen |
| `kolor` | `color` | colour literal | Set the pen colour |
| `grubosc`, `grubość` | `width` | expression, integer 1–12 | Set the stroke width |
| `powtorz`, `powtórz` | `repeat` | expression, integer 0–10000, then `[ body ]` | Run the body that many times |
| `niech` | `let` | name, then expression | Assign a variable |
| `jeśli`, `jesli` | `if` | condition, then `[ body ]` | Run the body when the condition holds |
| `jeżeli`, `jezeli` | `ifelse` | condition, then `[ body ]` `[ body ]` | Run the first body when the condition holds, else the second |
| `stop` | `stop` | none | End the current procedure; at top level, end the program |
| `dom` | `home` | none | Return to the origin and the initial orientation |
| `czyść`, `czysc` | `cs`, `clearscreen` | none | Forget every drawn segment |
| `gora`, `góra` | `pitchup` | expression | Pitch the nose up by that many degrees (3D only) |
| `dol`, `dół` | `pitchdown` | expression | Pitch the nose down (3D only) |
| `pp`, `przechylprawo` | `rr`, `rollright` | expression | Roll to the right around the heading (3D only) |
| `pl`, `przechyllewo` | `rl`, `rollleft` | expression | Roll to the left (3D only) |

Every Polish and English alias is equivalent. `nrpowt` (alias `repcount`) is a value, not a command: see Repeat.

### Expressions

- Wherever a command takes an expression, it accepts a number, a name (a parameter or a variable, also in the legacy form `:name`), `nrpowt`, a parenthesised expression, a unary `-` or `+` applied to any of these, or two expressions joined by `+`, `-`, `*` or `/`.
- `*` and `/` bind tighter than `+` and `-`; operators of equal precedence associate to the left: `np 20 - 5 - 3` moves 12 and `np 2 + 3 * 4` moves 14.
- A binary operator must have whitespace on both sides or on neither side. `np 10 - 5` and `np 10-5` both move 5. `np 10 -5` is `np 10` followed by the stray token `-5`, which is an error, because the `-` has whitespace only on its left. The same rule applies to `+`, `*` and `/`. The rule does not apply to comparisons.
- Unary signs may be stacked and applied anywhere an operand is expected: `np -(3 - 5)`, `np - -2`, `np -bok`.
- Division by zero and any non-finite result are run-time errors. Evaluating an expression is not an executed operation (see Limits).
- A condition is `expression comparison expression`. Comparisons are exact: `jeśli 0.1 + 0.2 = 0.3 [...]` does not run its body.

### Turtle and geometry

- Coordinates are right-handed: +X to the right, +Y forward on the page, +Z up out of the page. The 2D plane is the XY plane (z = 0).
- The turtle starts at the origin (0, 0, 0), heading +Y, with its right side along +X and its up vector along +Z, pen down, colour `#16866a`, width 3.
- `np d` moves the turtle `d` units along its heading; `ws d` moves it `-d`. If the pen is down and the position changes, a straight segment from the old to the new position is drawn with the current colour and width. A move of zero draws nothing.
- `pw a` rotates the heading `a` degrees to the right around the turtle's up vector (clockwise when seen from above); `lw a` rotates left. The right vector follows the heading.
- `gora a` rotates the heading `a` degrees towards the up vector around the right vector (the up vector follows, so after `gora 90` the turtle heads along its former up); `dol a` rotates the opposite way.
- `pp a` rotates the turtle's up vector `a` degrees towards its right vector, around the heading (the right vector follows, so after `pp 90` the turtle's up is its former right and its right is its former down); `pl a` rotates the opposite way. The heading does not change.
- In 2D mode, `gora`, `dol`, `pp` and `pl` are errors.
- Angles are in degrees, any decimal value; negative values turn the other way.
- `dom` moves the turtle to the origin, drawing a segment if the pen is down and the turtle is not already there, then sets the heading to +Y, the right vector to +X and the up vector to +Z. Pen state, colour and width are untouched.
- `czyść` removes every segment drawn so far and changes nothing else: `run` then returns only the segments drawn afterwards. The segment limit (see Limits) counts the segments currently kept.
- Pen state, colour and width persist until changed. Programs made only of flat commands produce identical coordinates in 2D and 3D mode.

### Repeat

`powtorz n [ ... ]` runs the bracketed commands `n` times; `n` must evaluate to an integer from 0 to 10000 (0 runs nothing). Bodies may contain any commands, nested repeats, conditionals and procedure calls.

Inside a repeat body, `nrpowt` is the number of the current iteration of the innermost enclosing repeat, starting at 1. The enclosing repeat is found lexically: `nrpowt` written in a procedure body that is not itself inside a repeat is a parse-time error, even if the procedure is only ever called from inside a repeat. `nrpowt` written outside any repeat at top level is a parse-time error too.

### Variables

- `niech x 5` assigns the value of the expression to the variable `x`; any later `niech x ...` reassigns it. Variable names follow the rules for procedure names and may not be command words or the name of a procedure.
- A `niech` at top level creates or updates a global variable. A `niech` inside a procedure creates or updates a variable local to that call; it shadows a global of the same name for the rest of the call and is discarded when the call ends. A parameter can be reassigned the same way.
- A name may be used in an expression only if it is a parameter of the enclosing procedure, or is assigned by `niech` somewhere in the body of the enclosing procedure, or is assigned by `niech` somewhere at top level (before or after the use). Any other name is a parse-time error.
- Reading a declared variable that has not been assigned yet on the current path is a run-time error, reported at the first token of the argument that contains the reference.

### Conditionals

`jeśli warunek [ ... ]` runs the body when the condition holds. `jeżeli warunek [ ... ] [ ... ]` runs the first body when it holds and the second otherwise. Bodies may contain anything a repeat body may contain. Conditional bodies count towards the bracket nesting limit but are not execution frames.

### Procedures

```logo
oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90
```

- A definition starts with `oto` (alias `to`) at the beginning of a line, followed on the same line by the name and, optionally, `ma:` and a comma-separated parameter list. The body follows on the next lines and ends with `już` (aliases `juz`, `end`) alone on its own line.
- The legacy header `oto kwadrat :bok :kąt` is also accepted, and a parameter may be referenced in the body as `:bok` as well as plainly as `bok`.
- Calls take positional arguments separated by whitespace, exactly as many as the procedure has parameters; each argument is an expression, so `kwadrat 40 * 2 90` passes 80 and 90. A parameter may share its name with a procedure: in command position the name is a call, in argument position it is the parameter.
- Parameters and local variables are local to the call and can stand in for any expression, including repeat counts and arguments of other procedure calls.
- Definitions are top-level only (never inside a repeat body, a conditional body or another procedure) and may appear before or after the calls that use them. A name may be defined once.
- Procedures may call themselves, directly or through other procedures. `stop` ends the current call immediately; at top level it ends the program. A `stop` inside a repeat or conditional body ends the enclosing procedure call (or the program), not just the body.
- There are no return values.

### Errors and limits

- Any problem is reported with the 1-based line and column of the offending token: an unknown command, a missing or malformed argument, a malformed colour, a width outside 1–12 or not an integer, a repeat count outside 0–10000 or not an integer, an unbalanced bracket or parenthesis, a procedure call with the wrong number of arguments, a definition inside a body, a missing `już`, a name that is neither a parameter nor a declared variable, `nrpowt` outside a repeat, a pitch or roll command in 2D mode, division by zero, an unassigned variable, or a limit exceeded.
- An invalid argument (a bad width or repeat count, a division by zero, a non-finite result, an unassigned variable) is reported at the first token of that argument's expression, not at the command. A missing argument is reported at the token found where the argument should have started (for example a `]` or `)`), or at the command itself when the program ends there. A stray value where a command is expected is reported at that value.
- A program is validated as a whole before anything is drawn: with a parse-time error nothing is drawn. Widths and repeat counts written as literal expressions (no names) are checked at parse time; those that depend on names are checked when executed. Errors that can only be found while running (a limit exceeded, division by zero, an unassigned variable, a bad width or repeat count computed from a name) stop execution and keep what was drawn so far, after any `czyść` that ran.
- Limits: 50,000 source characters, 10,000 tokens (operators, parentheses, brackets and commas are tokens), nesting depth 32 for brackets, 32 active procedure-call and repeat frames at any moment (conditional bodies do not count), 10,000 executed operations counting each command, each `niech`, each conditional, each repeat and each call, plus one for finishing each repeat iteration, conditional body or procedure call (reaching the end of the program is not counted), 10,000 kept segments, and every coordinate within ±100,000. Exceeding a limit is an error.
