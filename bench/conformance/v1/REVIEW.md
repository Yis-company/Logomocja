# Conformance v1: adjudication

Each agent-authored suite was run unchanged against the reference app (this repository, `window.logomocja.run`). Cases that failed there were reviewed by hand. The agent's original file is kept untouched under `bench/results/<run-id>/cases.json`; the files in this directory are the frozen suites.

## gpt-6-astra (119 cases, run `v1-e1-codex-gpt-6-astra-20261027-061629Z`)

Reference result before review: 110 passed. Decisions:

- **Column removed, line kept (8 cases):** `invalid width 0`, `invalid width 13`, `invalid width 1.5`, `invalid width -1`, `invalid repeat count -1`, `invalid repeat count 10001`, `invalid repeat count 2.5`, `repeat missing opening bracket`. The suite expected the column of the bad value; the reference reports the column of the command. The dialect spec says only "the offending token", which reads either way, so the column is not checked for these. A later prompt version should say which token an invalid-argument error points at.
- **Dropped (1 case):** `token limit is inclusive`. A program of exactly 10,000 tokens is allowed by the token limit, but 10,000 top-level commands also reach the 10,000 executed-operation limit once end-of-program bookkeeping is counted, which the spec permits. The case conflates the two limits.

Reference result after review: 118 of 118.

## claude-fable-5-1 (153 cases, run `v1-e1-claude-claude-fable-5-1-20261027-061629Z`)

Reference result before review: 146 passed. Decisions:

- **Column removed, line kept (7 cases):** `width zero`, `width thirteen`, `non-integer width`, `width error after drawing draws nothing`, `negative repeat count`, `repeat count above 10000`, `non-integer repeat count`. Same ambiguity as above: the suite expected the column of the bad value, the reference reports the command.

Reference result after review: 153 of 153.

## Note for the next prompt version

Both authors, independently, placed invalid-argument errors at the value token. The reference app places them at the command. The dialect spec should state the value token explicitly in v2, and the reference app should follow.
