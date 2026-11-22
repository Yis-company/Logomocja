# Code-quality lint score

Revision 4. Council: round 1 Opus 6/10, Astra 6/10; round 2 7/10, 7/10; round 3 8/10, 8/10; round 4 Opus 9/10, Astra 10/10, both approve.

## Outcome

Add `quality` as a separate benchmark score. It is never combined into a single rank with other scores, and it always appears next to conformance.

The headline number is **Q**, the number of `q1` lint findings in an app's product source. Each finding counts 1, and lower is better. Every app builds the same frozen brief, so the score counts findings per app; per-KLOC rates mostly measure app size. Q has two parts that apply to every language: complexity and defects.

TypeScript apps also get a separate types count. It covers the TypeScript rules plus the anti-slop rules that depend on TypeScript, including `no-runtime-typeof`, whose type-guard exemption works only in TypeScript. JavaScript apps show "—" for types and take no penalty, because the brief lets each agent choose its stack.

Q measures how well an app fits Yi's lint standard. The agents never saw that standard. Label the score that way.

## Ruleset `q1`

Rules come from Yi's 7 linted T3 projects. The ruleset keeps:

- correctness rules
- complexity rules: `max-depth` 3 and `sonarjs/no-nested-conditional`
- React and `jsx-a11y` rules
- Yi's anti-slop plugin, which feeds the types count

These are removed:

- autofixable style rules: `require-readable-spacing`, `prefer-const`, `no-useless-escape`, `consistent-type-imports`, `import/no-duplicates`, `no-inferrable-types`
- the duplicate React Compiler plugin
- 3 rules that flagged correct code: `no-thenable` (the Logo `if` node), `no-fallthrough` (code after functions that return `never`), and `no-shape-in-symbol-names` (three.js `Shape`)

## Prototype result

The prototype scored 49 apps: 45 runs and 4 Gemini apps. The lint pass took 3 s.

| Group (n) | Median Q | Range | Median LOC |
|---|---|---|---|
| Fable 5.1 (1) | 9 | 9 | 2,836 |
| Fable 5.2 (2) | 25.5 | 23–28 | 3,261 |
| Haiku 5.5 (5) | 5 | 2–9 | 3,278 |
| Opus 5.5 (9) | 21 | 12–67 | 5,191 |
| Sonnet 5.5 (5) | 16 | 8–36 | 4,037 |
| Astra 6 (5) | 32 | 20–45 | 1,275 |
| Luna 6 (4) | 33.5 | 13–91 | 100.5 |
| Sol 6.1 (9) | 31 | 14–42 | 1,855 |
| Terra 6.1 (5) | 25 | 21–25 | 257 |
| Gemini 4 (4) | 53.5 | 37–56 | 5,165 |

LOC is context only. Codex apps pack up to 600 characters on a line, so their LOC understates their size. Spearman ρ between Q and non-whitespace characters is 0.03 across the 45 runs and 0.13 across all 49 apps (average ranks for ties). Both are weak, so Q is not a proxy for app size.

What the data shows:

- Complexity rules produce 86% of Q.
- Anti-slop contributes 2 findings to Q. Its value is in the types count.
- Groups have 1 to 9 runs each, which is too few to rank them.
- Conformance has too little spread to validate Q: 39 of 45 runs score at least 98%.

## Steps

1. Freeze `bench/quality/q1/`. It holds the oxlint config with every rule named and no categories, a manifest that maps each rule to its family, and the anti-slop snapshot. Pin oxlint, `@oxlint/plugins` and sonarjs.
2. Sample the hits for every rule that has any, and disable false positives before freezing.
3. Write `bench/quality.ts [--only <id>]`:
   - For a run whose task is not `app`, write `quality: null, reason: "not an app task"` and stop. Otherwise lint it.
   - Read source from the local `build/<id>`; if that doesn't exist, use `origin/build/<id>`.
   - Lint the original files.
   - Write `result.quality`: per-rule counts, families, LOC, language and the staged file paths.
   - Write `quality: null, reason: "no source"` when there is no branch or no eligible file.
   - It is idempotent, so the same command is the backfill. `run.ts` calls it after the source import.
4. Show Q, its families and the types count in one place: the run details in `src/pages/BenchmarkEvidence.tsx`. Add no table column.
5. Tests:
   - a JavaScript fixture and a TypeScript fixture with known counts
   - build scripts are excluded
   - an empty source gives null, not 0
   - a failed scan is unavailable
   - a repeat run gives the same output

## Decisions

- 58 runs get `quality: null`. 52 have reason "no source": 48 TDD-layer runs and 4 `v2-e5` runs with no branch. 6 test-authoring runs have reason "not an app task". None are rerun.
- The 4 Gemini apps stay in the Gemini comparison folder only.
- `tsgolint` (type-aware rules) and Biome-formatted LOC are deferred.

## Risks

- An app that implements less has fewer chances to break rules, so Q is always shown with conformance.
- Oxlint JS plugins are experimental. Pin the versions.
- The rules for picking product files are heuristic. The stored paths make that choice auditable.

## Acceptance

- Lint, typecheck and unit tests pass.
- In under 30 s, the backfill writes `quality` for the 45 runs with source, and a null reason for the other 58: 52 "no source" and 6 "not an app task".
- The run details show Q for a scored run and the null reason for a null run.
- Existing scores don't change.

Prototype: `prototype/` holds the config, `stage.sh`, `aggregate.py` and `scores.json` (file paths are stored for each app).
