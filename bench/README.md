# Agent benchmark

Each AI coding agent builds the whole Logomocja app from the same product brief, alone, inside a versioned Docker container, with no time cap. We record how long it took, what it used in tokens and what that costs at API list prices, whether the result installs and builds, how it scores on the language conformance suites, and a human quality score. Every attempt's source is on its own branch and its built app is published on the Pages site, listed by benchmark version and model.

Models run through the Claude Code and Codex CLIs under the existing subscriptions. No API keys.

## Run

```sh
bun run bench -- --model claude:claude-sonnet-5-5             # build the app
bun run bench -- --model codex:gpt-6-astra --task tests       # author a conformance suite
bun run bench -- --model claude:claude-opus-5-5 --effort high --no-push
bun run bench:conformance -- --dist builds/<run-id> --base /Logomocja/builds/<run-id>/
```

Authentication: `CLAUDE_CODE_OAUTH_TOKEN` (or `CLAUDE_CODE_OAUTH_TOKEN_FILE`) from `claude setup-token` for Claude; `~/.codex/auth.json` (ChatGPT login) is copied into a temporary `CODEX_HOME` for the run and deleted afterwards.

## What one run does

1. Builds `logomocja-bench:env-<VERSION>` from `env/Dockerfile` if missing: Node, Bun, pinned Claude Code and Codex, git, a non-root `agent` user, an empty `/work`.
2. Renders the brief (`prompts/<version>/spec.md` or `tests.md`, with `dialect.md` filled in) and starts the container with `bench/` mounted read-only and an output directory mounted at `/out`.
3. Inside, `agent.ts` launches the CLI with the brief on stdin, fully autonomous (`--dangerously-skip-permissions` for Claude, `--dangerously-bypass-approvals-and-sandbox` for Codex; the container is the sandbox), and streams the CLI's events to `transcript.jsonl`. Host configuration is excluded: fresh home, `--setting-sources ""`, `--ignore-user-config --ignore-rules`. The CLIs keep their own default system prompts; they are part of what is measured and are pinned by version.
4. When the agent stops, the harness commits whatever is in `/work`, bundles it, and for the `app` task verifies it in a clean shell: `bun install`, `BASE_PATH=/Logomocja/builds/<run-id>/ bun run build`, and `bun run test` if the project defines one.
5. Back on the host: the source becomes branch `build/<run-id>` (pushed unless `--no-push`), the verified `dist/` is copied to `builds/<run-id>/`, the conformance suites in `conformance/<prompt version>/` are run against it headlessly, and `results/<run-id>/` receives `result.json`, `transcript.jsonl`, `verify.log` and `conformance.json`. For the `tests` task the agent's `cases.json` is copied to `conformance/<prompt version>/<model>.json` for review.

Run id: `<prompt>-e<env>-<runner>-<model>-<UTC stamp>`.

## Conformance suites

The brief requires every build to expose `window.logomocja.run(source, mode)` returning the drawn segments and any error. Suites are case files (see `prompts/v1/tests.md` for the format) authored by agents from the dialect specification alone, then checked against the reference app (this repository, which exposes the same hook): cases that fail there are reviewed and either dropped, with the reason in `conformance/<version>/REVIEW.md`, or kept when they reveal a reference bug that then gets fixed. A build without the hook scores zero on every suite.

## Versioning

- **Prompt.** `prompts/v1/` is immutable once a result references it; change anything by copying to `v2/`. Conformance suites belong to the prompt version they were authored from.
- **Environment.** `env/VERSION` bumps whenever a change could alter an outcome: the Dockerfile and pinned CLI versions, the CLI flags in `runners.ts`, `agent.ts`, the verification steps, the conformance runner or its tolerance.

A run's benchmark version is the pair `v1/e1`. The repo's own package version is recorded too, since every merged PR is a new version of the project. To re-run the same models after a change, bump the version that changed and run again; the page groups runs by benchmark version.

## Scoring by hand

`costUsd` is the figure the Claude CLI reports (`costBasis: "cli"`) or, for Codex, an estimate from the token counts and the list prices in `prices.ts` (`costBasis: "list"`, shown with ≈). The runs go through subscriptions, so this is what the same work would have cost on the API, not what was paid. Update `prices.ts` when prices change; stored results keep the figure computed at run time.

`results/<run-id>/result.json` has `humanScore` (null until set) and `notes`. Open the build from the page, judge it, edit the two fields, commit. The page and `SUMMARY` columns update on the next build.
