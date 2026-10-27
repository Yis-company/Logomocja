# AI benchmark

Measures how well a language model writes correct Logomocja programs from the written spec alone. Each of the six challenge tasks in `src/challenges/tasks.ts` is sent once per sample; the answer is scored by the same geometry judge the app uses, headlessly, against all six cases of the task. A sample passes a task only when every case passes.

Models are reached through the Claude Code and Codex CLIs under your existing subscriptions, inside a Docker container with fresh home directories, so nothing from this machine (CLAUDE.md, memory, skills, MCP servers, shell config) reaches the model. No API keys.

## Run

```sh
bun run bench -- --model claude:claude-opus-5-5
bun run bench -- --model codex:gpt-6.1-terra --samples 3 --effort high
bun run bench -- --model codex:gpt-6.1-sol --probe   # one-word connectivity check
bun run bench:report                                 # rebuild results/SUMMARY.md
```

`bench/bench.sh` builds `logomocja-bench:env-<VERSION>` on first use (`BENCH_REBUILD=1` forces a rebuild), then runs `bench/run.ts` in the container with only `bench/results` mounted.

Authentication:

- **Claude.** Run `claude setup-token` once on this machine and export the result as `CLAUDE_CODE_OAUTH_TOKEN`, or point `CLAUDE_CODE_OAUTH_TOKEN_FILE` at a file holding it. The token is passed to the container through a temporary env file and never written inside the repo.
- **Codex.** The ChatGPT login in `~/.codex/auth.json` is copied to a temporary directory mounted as `CODEX_HOME` (writable so the token can refresh) and deleted when the run ends.

Runs are sequential. When a CLI reports an auth or usage-limit error the run stops, the finished samples are kept and the result is marked `partial`.

## What the model sees

- `prompts/<version>/system.md` as the system prompt (Claude: `--system-prompt`; Codex: `model_instructions_file`).
- `prompts/<version>/task.md` rendered with the task's own Polish description and contract plus `prompts/<version>/reference.md`, sent as the user message on stdin.

Claude runs with `--restricted --tools ""` and no settings sources, in a fresh home directory (`--bare` would be stricter still, but it also skips reading `CLAUDE_CODE_OAUTH_TOKEN`). Codex runs with `--ignore-user-config --ignore-rules --ephemeral` in a read-only sandbox in an empty directory; its shell tool cannot be removed, so the prompt forbids commands and every tool call is counted in `toolCalls`. Both CLIs still add their own fixed scaffolding around the prompt; it is identical across runs and pinned by the CLI versions in the Dockerfile.

## Versioning

- **Prompt.** `prompts/v1/` is immutable once a result references it. To change anything in it, copy the directory to `v2/` and run with `--prompt v2`.
- **Environment.** `env/VERSION` must be bumped whenever a change could alter the score of an unchanged model: the Dockerfile (including the pinned CLI versions), the CLI flags in `runners.ts`, `run.ts`, `extract.ts`, the judge, the tasks or `reference.md` of a prompt version that is already in use (which also means a new prompt version). Additions that cannot change a score, such as a report column, do not bump it.

Every result records both versions, the image tag, the commit, the CLI version and the exact argv, so any two rows in the summary are comparable only when prompt and env match.

## Re-running a release

Every result records `appVersion`, the `package.json` version of the checkout it ran on, and the site groups runs by it. To benchmark a released version on the same models, run from the released code, not from a feature branch:

1. Merge the PR and let Changesets open and merge its version PR, so `main` carries the new version (and the `v<version>` tag).
2. On `main` (or `git checkout v<version>`), run the models: `bun run bench -- --model codex:gpt-6.1-terra`, and so on. `bench.sh` prints the version, commit and branch it is about to attribute the run to; stop if it is not the one you mean.
3. `bun run bench:report`, commit `bench/results/` on a branch together with an empty changeset (`bun run changeset` → no bump), and open a PR. The next release then ships the new rows.

## Results

One JSON file per run in `results/`, named `<runner>-<model>_p<prompt>_e<env>_<started>.json`, with the raw response, extracted code, cases passed, failure kind (`no-code`, `parse`, `runtime`, `geometry`, `cli`), token usage, tool calls and wall-clock time per sample. `humanScore` is `null` until a person fills it in. `results/SUMMARY.md` is generated from these files; regenerate it after every run and commit both. The published site's `/benchmark` page is built from the same files, grouped by `appVersion`.
