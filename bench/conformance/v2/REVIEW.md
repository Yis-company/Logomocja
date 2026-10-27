# Conformance v2: adjudication

The reference app implements dialect v2 (`bench/prompts/v2/dialect.md`). Before any v2 suite existed, the frozen v1 suites were run against it: 151 of 153 (Fable) and 116 of 118 (Astra). The four failures are v1 rules that v2 changed on purpose, so the v1 suites stay as they are and are not used for v2 builds:

- `recursion in never-run repeat`, `recursion in uncalled procedure` (Fable), `direct recursion even in zero repeat` (Astra): recursion is legal in v2.
- `invalid number 1+2` (Astra): `fd 1+2` is the expression 3 in v2.

Round-1 and round-2 suites are adjudicated below once they exist.
