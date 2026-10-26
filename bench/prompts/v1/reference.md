# Logomocja language reference

Keywords ignore case. Accented Polish spellings also work. Numeric arguments are finite signed decimal literals, for example `80`, `-12.5` or `.5`. Semicolons start line comments. Brackets enclose repeat bodies, including nested repeats.

| Polish | English | Meaning |
| --- | --- | --- |
| `np`, `naprzod`, `naprzód` | `fd`, `forward` | Move forward |
| `ws`, `wstecz` | `bk`, `back` | Move backward |
| `pw`, `prawo` | `rt`, `right` | Turn right by degrees |
| `lw`, `lewo` | `lt`, `left` | Turn left by degrees |
| `pod`, `podnies`, `podnieś` | `pu`, `penup` | Raise pen |
| `opu`, `opusc`, `opuść` | `pd`, `pendown` | Lower pen |
| `kolor "#16866a"` | `color "#16866a"` | Set six-digit hex color |
| `grubosc 3`, `grubość 3` | `width 3` | Set integer stroke width, 1–12 pixels |
| `powtorz 4 [ … ]`, `powtórz` | `repeat` | Repeat a bracketed body |
| `gora 90`, `góra` | `pitchup` | Pitch upward in 3D |
| `dol 90`, `dół` | `pitchdown` | Pitch downward in 3D |

The turtle starts at the origin (0, 0, 0), facing +Y with the pen down. +X points right, +Z points upward. Right turns clockwise when viewed from above. Spatial turns rotate the turtle's local frame. Flat programs produce identical coordinates in both modes; pitch commands are rejected in 2D.

Named procedures list parameters after `ma:`, separated by commas. The name and the complete parameter list stay on the same header line; the body follows on later lines and ends with a standalone `już` (also `juz` or `end`). Use `oto name` without `ma:` for a procedure without parameters. Calls take positional values separated by whitespace. Parameters are local and can replace numbers in commands, repeat counts and helper calls. Recursion, arithmetic and global variables are not available.

```logo
oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90
```

Limits: 10,000 tokens, nesting depth 32, repeat counts 0–10,000, 10,000 execution operations, 10,000 segments, coordinates within ±100,000.
