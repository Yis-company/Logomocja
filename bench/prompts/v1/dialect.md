### Lexical rules

- Keywords, procedure names and parameter names ignore case. Accented Polish spellings listed below work alongside the unaccented ones.
- Whitespace separates tokens; newlines matter only for procedure headers and endings (see Procedures).
- A semicolon starts a comment that runs to the end of the line.
- Numbers are finite signed decimal literals: `80`, `-12.5`, `.5`, `+3`. Nothing else is a number: no arithmetic, no expressions.
- Square brackets `[` and `]` delimit repeat bodies and may nest.
- A colour literal is a quoted six-digit hex string: `"#16866a"` (case-insensitive hex digits).

### Commands

| Polish | English | Argument | Meaning |
| --- | --- | --- | --- |
| `np`, `naprzod`, `naprzód` | `fd`, `forward` | number | Move forward by that distance |
| `ws`, `wstecz` | `bk`, `back` | number | Move backward |
| `pw`, `prawo` | `rt`, `right` | number | Turn right by that many degrees |
| `lw`, `lewo` | `lt`, `left` | number | Turn left by that many degrees |
| `pod`, `podnies`, `podnieś` | `pu`, `penup` | none | Raise the pen |
| `opu`, `opusc`, `opuść` | `pd`, `pendown` | none | Lower the pen |
| `kolor` | `color` | colour literal | Set the pen colour |
| `grubosc`, `grubość` | `width` | integer 1–12 | Set the stroke width |
| `powtorz`, `powtórz` | `repeat` | integer 0–10000, then `[ body ]` | Run the body that many times |
| `gora`, `góra` | `pitchup` | number | Pitch the nose up by that many degrees (3D only) |
| `dol`, `dół` | `pitchdown` | number | Pitch the nose down (3D only) |

Every Polish and English alias is equivalent. Numeric arguments may be a parameter name inside a procedure (see below).

### Turtle and geometry

- Coordinates are right-handed: +X to the right, +Y forward on the page, +Z up out of the page. The 2D plane is the XY plane (z = 0).
- The turtle starts at the origin (0, 0, 0), heading +Y, with its right side along +X and its up vector along +Z, pen down, colour `#16866a`, width 3.
- `np d` moves the turtle `d` units along its heading; `ws d` moves it `-d`. If the pen is down and the distance is not zero, a straight segment from the old to the new position is drawn with the current colour and width. A move of zero draws nothing.
- `pw a` rotates the heading `a` degrees to the right around the turtle's up vector (clockwise when seen from above); `lw a` rotates left. The right vector follows the heading.
- `gora a` rotates the heading `a` degrees towards the up vector around the right vector (the up vector follows, so after `gora 90` the turtle heads along its former up); `dol a` rotates the opposite way. In 2D mode, `gora` and `dol` are errors.
- Angles are in degrees, any decimal value; negative values turn the other way.
- Pen state, colour and width persist until changed. Programs made only of flat commands produce identical coordinates in 2D and 3D mode.

### Repeat

`powtorz n [ ... ]` runs the bracketed commands `n` times; `n` must be an integer from 0 to 10000 (0 runs nothing). Bodies may contain any commands, nested repeats and procedure calls.

### Procedures

```logo
oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90
```

- A definition starts with `oto` (alias `to`) at the beginning of a line, followed on the same line by the name and, optionally, `ma:` and a comma-separated parameter list. The body follows on the next lines and ends with `już` (aliases `juz`, `end`) alone on its own line.
- The legacy header `oto kwadrat :bok :kąt` is also accepted, and a parameter may be referenced in the body as `:bok` as well as plainly as `bok`.
- Calls take positional numeric arguments separated by whitespace, exactly as many as the procedure has parameters.
- Parameters are local to the procedure and can stand in for any numeric argument, including repeat counts and arguments of other procedure calls.
- Definitions are top-level only (never inside a repeat body or another procedure) and may appear before or after the calls that use them. A name may be defined once. Procedures cannot call themselves, directly or indirectly: that is an error even if the call would never run.
- There are no global variables, no return values and no arithmetic.

### Errors and limits

- Any problem is reported with the 1-based line and column of the offending token: an unknown command, a missing or non-numeric argument, a malformed colour, a width outside 1–12 or not an integer, a repeat count outside 0–10000 or not an integer, an unbalanced bracket, a procedure call with the wrong number of arguments, a definition inside a body, a missing `już`, recursion, or a pitch command in 2D mode.
- A program is validated as a whole before anything is drawn: with a parse-time error nothing is drawn. Errors that can only be found while running (for example a limit exceeded) stop execution and keep what was drawn so far.
- Limits: 50,000 source characters, 10,000 tokens, nesting depth 32 for brackets and for active procedure/repeat frames, 10,000 executed operations counting repeat and call bookkeeping, 10,000 drawn segments, and every coordinate within ±100,000. Exceeding a limit is an error.
