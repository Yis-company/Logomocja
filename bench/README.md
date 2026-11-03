# Agent benchmark

Each AI coding agent builds the whole Logomocja app from the same product brief, alone, inside a versioned Docker container, with no time cap. We record how long it took, what it used in tokens and what that costs at API list prices, whether the result installs and builds, how it scores on the language conformance suites, and a human quality score. Every attempt's source is on its own branch and its built app is published on the Pages site, listed by benchmark version and model.

Models run through the Claude Code and Codex CLIs under the existing subscriptions. No API keys.

## Run

```sh
bun run bench -- --model claude:claude-sonnet-5-5             # build the app (prompt v2 by default)
bun run bench -- --model codex:gpt-6-astra --task tests       # author a conformance suite, round 1
bun run bench -- --model codex:gpt-6-astra --task tests-round2 --own <its round-1 cases.json> --other <the other author's>
bun run bench -- --model claude:claude-opus-5-5 --effort high --no-push
bun run bench:conformance -- --dist builds/<run-id> --base /Logomocja/builds/<run-id>/
bun bench/gallery.ts --dist builds/<run-id> --base /Logomocja/builds/<run-id>/ --out results/<run-id>/gallery
```

Authentication: `CLAUDE_CODE_OAUTH_TOKEN` (or `CLAUDE_CODE_OAUTH_TOKEN_FILE`) from `claude setup-token` for Claude; `~/.codex/auth.json` (ChatGPT login) is copied into a temporary `CODEX_HOME` for the run and deleted afterwards.

## Queue and status

Write an explicit JSON array of `{ "model": "codex:gpt-6-astra", "effort": "high" }` entries (effort is optional). `matrix.example.json` is a small example, not a default matrix. Choose model-supported efforts before running it. Entries run sequentially; a failure is recorded and the queue continues, returning a nonzero exit code if any entry did not complete and build successfully.

```sh
bun run bench:queue -- --matrix bench/matrix.example.json --prompt v2 --no-push
bun run bench:status
bun run bench:status -- --queue output/bench-queues/<queue-id> --stale-minutes 30
bun run bench:queue -- --resume output/bench-queues/<queue-id>
bun run bench:queue -- --resume output/bench-queues/<queue-id> --retry
```

The queue prints its directory under `output/bench-queues/` (gitignored). It saves `state.json`, numbered `.log` files, and `.run.json` references to the result ID and live transcript path. Status reads timestamps without printing transcripts or credentials; it also counts historical app results. No recent log activity means **possibly stalled**, not a confirmed failure. While an agent runs, transcript writes count as activity even when the host log is quiet.

Resume keeps the original prompt and push setting and skips completed entries after validating their saved results. It marks dead running entries interrupted and leaves interrupted/failed entries alone unless `--retry` is given. It refuses to duplicate a live process or container. After a T3 restart or interruption, check the indicated Docker container before retrying; if Docker cannot be queried, restore access first. The queue does not stop containers or impose a time cap. Do not run two queues in this same checkout at once: the underlying runner imports Git branches into it.

On macOS, `caffeinate -i` prevents idle system sleep for the queue's lifetime; it cannot prevent lid-close or forced sleep. Other systems run without it. Keep-awake and state saving do not keep the command alive after a terminal or T3 process exits.

Like a single run, the queue **pushes each source branch unless `--no-push` is supplied**. Queue logs and state stay local. The optional `--run-info` flag on the single-run host script is used internally to expose progress paths to the queue; it does not change scoring or the benchmark environment.

## What one run does

1. Builds `logomocja-bench:env-<VERSION>` from `env/Dockerfile` if missing: Node, Bun, pinned Claude Code and Codex, git, a non-root `agent` user, an empty `/work`.
2. Renders the brief (`prompts/<version>/spec.md`, `tests.md` or `tests-round2.md`, with `dialect.md` and the standard programs filled in) and starts the container with `bench/` mounted read-only and an output directory mounted at `/out`.
3. Inside, `agent.ts` launches the CLI with the brief on stdin, fully autonomous (`--dangerously-skip-permissions` for Claude, `--dangerously-bypass-approvals-and-sandbox` for Codex; the container is the sandbox), and streams the CLI's events to `transcript.jsonl`. Host configuration is excluded: fresh home, `--setting-sources ""`, `--ignore-user-config --ignore-rules`. The CLIs keep their own default system prompts; they are part of what is measured and are pinned by version.
4. When the agent stops, the harness commits whatever is in `/work`, bundles it, and for the `app` task verifies it in a clean shell: `bun install`, `BASE_PATH=/Logomocja/builds/<run-id>/ bun run build`, and `bun run test` if the project defines one.
5. Back on the host: the source becomes branch `build/<run-id>` (pushed unless `--no-push`), the verified `dist/` is copied to `builds/<run-id>/`, the conformance suites in `conformance/<prompt version>/` are run against it headlessly, the standard programs are captured through `open` into `results/<run-id>/gallery/` (WebP when `cwebp` is installed, PNG otherwise; `brew install webp`), and `results/<run-id>/` receives `result.json`, `transcript.jsonl`, `verify.log`, `conformance.json` and `gallery.json`. For the test-author tasks the agent's `cases.json` (and `review.json` in round 2) is copied to `conformance/<prompt version>/<model>[-round2].json` for review.

Run id: `<prompt>-e<env>-<runner>-<model>-<UTC stamp>`.

## Conformance suites

The brief requires every build to expose `window.logomocja.run(source, mode)` returning the drawn segments and any error. Suites are case files (see `prompts/<version>/tests.md` for the format) authored by agents from the dialect specification alone, then checked against the reference app (this repository, which exposes the same hook): cases that fail there are reviewed and either dropped, with the reason in `conformance/<version>/REVIEW.md`, or kept when they reveal a reference bug that then gets fixed. A build without the hook scores zero on every suite.

From v2 the suite is written in two rounds by two authors: round 1 from the specification alone, round 2 with both round-1 files as input, delivering new cases plus a `review.json` disputing the other author's cases. The four files are merged into `conformance/<version>/combined.json`.

Every suite is run twice: through `run` (the hook) and through `open` (the app's own editor path, reported as `<suite>@open`), so an app whose UI interpreter differs from its hook loses points. `conformance/<version>/stress.json`, generated by `bun bench/conformance/stress.ts <version>` from the reference app, holds programs at the limits of the language, each with a `budgetMs`: a build that takes longer than the budget on `run` fails the case. Stress cases run in order and include pairs that catch state leaking from one `run` to the next.

When a suite or the runner changes, `bun bench/rescore.ts --prompt <version>` re-runs the suites against every built app of that version and rewrites `conformance.json` and the scores in `result.json`.

`bun run test` checks that each stored, successfully built app has every suite and the current case totals for its prompt version, including UI-path and stress scores for v2. Historical v1 retains its original run-only scores. Zero scores are valid; missing scoring passes are not. Test-author results and failed builds are excluded.

## Standard programs and gallery

`prompts/<version>/programs/` holds the programs every build must ship as examples (`index.json` lists id, mode, name) and `expected.json`, their outcomes on the reference app. They are also the reference app's own examples. After a build is verified the harness calls `window.logomocja.open(source, mode)` for each program in Chromium, screenshots the page, and records whether the returned segments match `expected.json`. The benchmark page shows the screenshots as a grid, with the reference app as the row `wzorzec` (`results/reference-<version>/gallery/`, captured with `bun bench/gallery.ts --dist dist --out bench/results/reference-<version>/gallery` after `bun run build`).

## Versioning

- **Prompt.** `prompts/<version>/` is immutable once a result references it; change anything, including the standard programs, by copying to the next version. Conformance suites belong to the prompt version they were authored from.
- **Environment.** `env/VERSION` bumps whenever a change could alter an outcome: the Dockerfile and pinned CLI versions, the CLI flags in `runners.ts`, `agent.ts`, the verification steps, the conformance runner or its tolerance, the gallery capture.

Versions so far: `v1/e1` (2026-10-27, the first round), `v2/e2` (2026-10-27, dialect with expressions, variables, conditionals, recursion, roll, home and clear; a fixed feature list and the standard programs in the brief; gallery capture). A run's benchmark version is the pair `v2/e2`. The repo's own package version is recorded too, since every merged PR is a new version of the project. To re-run the same models after a change, bump the version that changed and run again; the page groups runs by benchmark version.

## Scoring by hand

`costUsd` is the figure the Claude CLI reports (`costBasis: "cli"`) or, for Codex, an estimate from the token counts and the list prices in `prices.ts` (`costBasis: "list"`, shown with ≈). The runs go through subscriptions, so this is what the same work would have cost on the API, not what was paid. Update `prices.ts` when prices change; stored results keep the figure computed at run time.

`results/<run-id>/result.json` has `humanScore` (null until set) and `notes`. Open the build from the page, judge it, edit the two fields, commit. The page and `SUMMARY` columns update on the next build.

## Impeccable design layer

The base benchmark remains the default. Opt into a separate, from-scratch app condition with `--layer impeccable-v1`; do not modify the frozen v2 brief or existing results. Both CLIs explicitly read the same frozen skill snapshot, even when user rules are disabled. The layer authorizes unattended design decisions and uses the container's existing tools, with the skill's degraded workflows for unavailable native image generation and delegated agents. It does not import this repository's product context or visual design.

```sh
bun run bench -- --model codex:gpt-6.1-sol --effort high --layer impeccable-v1 --no-push
bun run bench:queue -- --matrix bench/layers/impeccable-v1/sol.json --layer impeccable-v1 --prompt v2 --no-push
# After Claude quota resets, and once the Sol queue has finished:
bun run bench:queue -- --matrix bench/layers/impeccable-v1/opus.json --layer impeccable-v1 --prompt v2 --no-push
```

The supplied matrices contain only Sol or Opus, each at low, medium, high and xhigh. Resume preserves the layer; a base result cannot satisfy a layered queue entry. Only app runs support design layers.

`layers/impeccable-v1/` freezes the installed Impeccable v4.7.0 guidance, references and supporting files. Its plain manifest records origin and engine 0.1.16. Platform binaries are excluded from source. Before invoking a model, the host uses the shipped launcher in the unchanged e2 container to prepare and validate the pinned Linux engine, cached under ignored `output/bench-tools/`. Runs mount that cache read-only. Neither the base image nor CLI flags change; base runs never receive the layer instruction or engine-cache mount. To change the design treatment, create a new layer ID and snapshot.

Layered run IDs include `impeccable-v1`; results additionally store `layer`, `baselineId`, the actual `prompt.md`, and `layer.json`. `baselineId` selects the latest successful base app matching prompt, environment, runner, model and effort. The page keeps base rankings first and renders the layer separately, with a link to the matched base row and effort labels on gallery rows.

Use the standard desktop/mobile galleries to judge design, while retaining conformance, build/test results, time, tokens and estimated cost. Historical controls and single runs do not establish a causal effect: model-service changes and run variance remain possible. Optional native tools unavailable in the container are a limitation of this condition, not a reason to introduce another model. No automatic design score is added. Experimental `--no-push` source branches remain local until explicitly published.
