# Conformance v2: adjudication

The reference app implements dialect v2 (`bench/prompts/v2/dialect.md`). Before any v2 suite existed, the frozen v1 suites were run against it: 151 of 153 (Fable) and 116 of 118 (Astra). The four failures are v1 rules that v2 changed on purpose, so the v1 suites stay as they are and are not used for v2 builds:

- `recursion in never-run repeat`, `recursion in uncalled procedure` (Fable), `direct recursion even in zero repeat` (Astra): recursion is legal in v2.
- `invalid number 1+2` (Astra): `fd 1+2` is the expression 3 in v2.
- `wrong argument count inside another procedure` (Fable): since the round-1 amendment below, a missing argument is reported at the token found in its place, here the `już` on the next line, where v1 expected the line of the call.

## Round 1: gpt-6-astra (196 cases, run `v2-e2-codex-gpt-6-astra-20261027-203902Z`)

Reference result before review: 194 passed. Decisions:

- **Reference fixed, cases kept (2):** `missing argument before bracket` (`repeat 1 [fd ]`) and `malformed expression operand` (`fd (2 * )`). The suite places a missing argument at the token found in its place (`]`, `)`); the reference placed it at the command. The dialect text said only "the offending token". The author's reading matches the stray-value and missing-bracket rules, so the reference now reports the token found in its place, or the command when the program ends there, and the dialect text says so explicitly (amended 2026-10-27 before any v2 app build).

Reference result after review: 196 of 196.
