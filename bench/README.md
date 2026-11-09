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

Check only these authorized sources when diagnosing authentication. Report a source as available, rejected by the provider, or not observable from the current sandbox. Not observable means unknown; it does not establish that the credential is missing. Never print credential values. With `--stop-on-limit`, the existing queue guard stops on the first reported authentication failure; recover access before an explicitly authorized retry. Keep the failed attempt as evidence.

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
2. Renders the brief (`prompts/<version>/spec.md`, `tests.md` or `tests-round2.md`, with `dialect.md` and the standard programs filled in). Stages only `agent.ts`, `prices.ts`, `runners.ts`, `result.ts`, and the selected condition's frozen skill/reference directories at read-only `/bench`. Engine preparation mounts only the frozen Impeccable skill. Evaluations, results, runner manifests, matrices and other conditions stay outside these mounts. `/out` remains a read-write mount; round-2 test authors receive the explicit own/other pair there. The network remains open: published results can still be fetched, so this is filesystem isolation, not a guarantee against all contamination.
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

Environment `e4` restricts mounted inputs. Layered e4 runs have a null baseline until fresh matching e4 base controls exist; historical e2/e3 controls remain context and are not rewritten or silently matched across environments.

## Scoring by hand

`costUsd` is the figure the Claude CLI reports (`costBasis: "cli"`) or, for Codex, an estimate from the token counts and the list prices in `prices.ts` (`costBasis: "list"`, shown with ≈). The runs go through subscriptions, so this is what the same work would have cost on the API, not what was paid. Update `prices.ts` when prices change; stored results keep the figure computed at run time.

`results/<run-id>/result.json` has `humanScore` (null until set) and `notes`. Open the build from the page, judge it, edit the two fields, commit. The page and `SUMMARY` columns update on the next build.

### Review transitions and evidence

Generated tests, independent conformance scores and human review answer different questions. Passing generated tests can preserve an author's mistaken expectation; conformance scores cover their declared cases. Neither establishes complete usability. Benchmark scores do not gate PR CI. The reference app's existing E2E suite runs in `Validation` alongside lint, typecheck and unit tests.

Reference-app E2E checks build the app before starting the browser and serve that fresh bundle. Headless checks use SwiftShader for WebGL with ordinary software page compositing (`--use-angle=swiftshader-webgl`). This avoids emulating a GPU for the whole page. The checks retain actual spatial drawing, orbit/image comparisons and the WebGL-unavailable fallback. Benchmark generation and scoring keep their separate versioned browser settings.

For human review, exercise these transitions and record the starting state, actions, result and recovery:

- Invalid run → visible error → correction → successful run, with stale output and diagnostics checked.
- Permalink → New → import → edit → reload, checking each draft and saved state.
- Failed backup → replacement, checking that failure cannot discard the recoverable draft.
- Keyboard entry into an interactive surface → keyboard exit, checking focus and controls.

Label each conclusion **source inference**, **browser reproduction**, or **untested flow**. Name the build, environment and evidence location. An untested or non-reproduced flow remains unknown. Validation against seeded transition defects is deferred; this checklist alone does not prove review effectiveness. Preserve historical apps and scores.

Load each skill/reference once; reread only changed or specifically relevant sections. When a reporting tool accepts saved HTML paths, pass the path. If only inline HTML is accepted, use a small summary; for a large report, provide its file link and summary instead of pasting the complete HTML.

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

### Impeccable v1 results — 3 November 2026

All eight layered app runs completed, built and passed their own interpreter tests. Four pass every conformance suite. These are additional results; the base benchmark remains the default and its records are unchanged.

Each row compares the new result to its recorded `baselineId`, matching model, effort, prompt v2, environment e2 and pinned CLI. Language counts are out of 595 on each path; stress counts are out of 23. `run/open` separates the isolated interpreter hook from the editor path. Times are agent minutes. Costs are stored API-list estimates (CLI-reported for Opus), not subscription charges.

| Model / effort | Language run/open, base → layer | Stress run/open, base → layer | Minutes, base → layer | USD estimate, base → layer | Evidence |
| --- | --- | --- | --- | --- | --- |
| Sol / low | 595/595 → 589/589 | 23/23 → 23/23 | 16.4 → 19.8 | 0.73 → 1.29 | [base](results/v2-e2-codex-gpt-6.1-sol-20261028-114651Z/result.json) · [layer](results/v2-e2-impeccable-v1-codex-gpt-6.1-sol-20261103-034140Z/result.json) · [screenshots](results/v2-e2-impeccable-v1-codex-gpt-6.1-sol-20261103-034140Z/gallery) |
| Sol / medium | 595/595 → 595/595 | 23/23 → 23/23 | 25.0 → 25.2 | 0.83 → 1.65 | [base](results/v2-e2-codex-gpt-6.1-sol-20261028-072527Z/result.json) · [layer](results/v2-e2-impeccable-v1-codex-gpt-6.1-sol-20261103-040149Z/result.json) · [screenshots](results/v2-e2-impeccable-v1-codex-gpt-6.1-sol-20261103-040149Z/gallery) |
| Sol / high | 595/595 → 593/593 | 23/23 → 23/23 | 23.4 → 24.2 | 1.24 → 1.36 | [base](results/v2-e2-codex-gpt-6.1-sol-20261028-075037Z/result.json) · [layer](results/v2-e2-impeccable-v1-codex-gpt-6.1-sol-20261103-042728Z/result.json) · [screenshots](results/v2-e2-impeccable-v1-codex-gpt-6.1-sol-20261103-042728Z/gallery) |
| Sol / xhigh | 595/595 → 595/595 | 23/23 → 23/23 | 36.1 → 28.6 | 1.32 → 1.60 | [base](results/v2-e2-codex-gpt-6.1-sol-20261028-081413Z/result.json) · [layer](results/v2-e2-impeccable-v1-codex-gpt-6.1-sol-20261103-045158Z/result.json) · [screenshots](results/v2-e2-impeccable-v1-codex-gpt-6.1-sol-20261103-045158Z/gallery) |
| Opus / low | 593/593 → 594/442 | 23/23 → 23/21 | 15.6 → 33.5 | 4.06 → 8.56 | [base](results/v2-e2-claude-claude-opus-5-5-20261028-113509Z/result.json) · [layer](results/v2-e2-impeccable-v1-claude-claude-opus-5-5-20261103-085938Z/result.json) · [screenshots](results/v2-e2-impeccable-v1-claude-claude-opus-5-5-20261103-085938Z/gallery) |
| Opus / medium | 594/594 → 594/594 | 23/23 → 23/23 | 32.3 → 34.5 | 8.74 → 11.08 | [base](results/v2-e2-claude-claude-opus-5-5-20261028-115143Z/result.json) · [layer](results/v2-e2-impeccable-v1-claude-claude-opus-5-5-20261103-093344Z/result.json) · [screenshots](results/v2-e2-impeccable-v1-claude-claude-opus-5-5-20261103-093344Z/gallery) |
| Opus / high | 592/592 → 595/595 | 23/23 → 23/23 | 48.3 → 45.4 | 15.74 → 15.63 | [base](results/v2-e2-claude-claude-opus-5-5-20261028-122444Z/result.json) · [layer](results/v2-e2-impeccable-v1-claude-claude-opus-5-5-20261103-100913Z/result.json) · [screenshots](results/v2-e2-impeccable-v1-claude-claude-opus-5-5-20261103-100913Z/gallery) |
| Opus / xhigh | 595/595 → 595/595 | 23/23 → 23/23 | 77.1 → 67.0 | 34.24 → 22.10 | [base](results/v2-e2-claude-claude-opus-5-5-20261028-131400Z/result.json) · [layer](results/v2-e2-impeccable-v1-claude-claude-opus-5-5-20261103-105529Z/result.json) · [screenshots](results/v2-e2-impeccable-v1-claude-claude-opus-5-5-20261103-105529Z/gallery) |

Visual assessment from the saved 1280×800 desktop and 390×844 phone captures:

- **Sol:** high/xhigh replace large introductory areas with persistent examples and a more compact workspace; the pale green visual style remains similar.
- **Opus:** stronger drawing-sheet treatments, captions and annotations; xhigh makes the clearest stylistic departure with yellow/black chrome and an execution trace. Low’s desktop capture also shows stacked draft notifications obscuring controls; the rapid gallery sequence can exaggerate this transient state.

Correctness limits: Sol low loses six language cases per path and high loses two. Opus medium retains its historical error-column failure. Opus low has one isolated language failure and a substantial `open` regression: 152 combined cases and both failed stress cases return leftover segments after errors; another case incorrectly rejects deeply nested parentheses. Its saved `src/ui/studio.ts` clears the view on compile failure without resetting `this.machine`, while `result()` still reads that machine’s segments. The defect is preserved as benchmark evidence. Opus high and xhigh pass every suite.

All thirteen standard drawings match for every pair; that and the generated apps’ own tests do not establish complete product correctness or usability. No automatic design score was assigned. The historical controls ran on 28 October and the layer ran on 3 November, once per model/effort/condition. Run variance and service-side model changes prevent a causal claim or a general design-quality ranking.

## TDD and Impeccable + TDD conditions

`--layer tdd-v1` uses Matt Pocock's TDD skill alone. `--layer impeccable-tdd-v1` adds the existing frozen Impeccable treatment to exactly the same TDD instructions. Both build new apps from prompt v2 in environment e2. The base and `impeccable-v1` prompts remain unchanged.

The TDD snapshot comes from `mattpocock/skills` commit `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`. Its testing references are preserved verbatim; codebase-design is available only as its vocabulary reference. The shared instruction adapter records the user-approved public testing boundaries: interpreter, editor integration, execution controls and product flows. Agents proceed without interviews and derive test expectations from the brief. Evaluation cases and historical defects are excluded from their guidance. No separate architecture or delegated review workflow is added.

The supplied matrix has Sonnet, Opus, Sol and Terra, each at low, medium, high and xhigh: sixteen entries per condition, thirty-two new runs. Run these queues sequentially; do not run them together in this checkout:

```sh
bun run bench:queue -- --matrix bench/layers/tdd-v1/matrix.json --layer tdd-v1 --prompt v2 --no-push
# After the first queue finishes:
bun run bench:queue -- --matrix bench/layers/tdd-v1/matrix.json --layer impeccable-tdd-v1 --prompt v2 --no-push
```

TDD alone prepares no Impeccable engine. The combined condition reuses the pinned snapshot and engine cache from `impeccable-v1`. Each new run saves its actual prompt and layer manifest, TDD source revision, transcript, independent conformance, gallery, time, tokens and estimated cost. Queue resume validates the condition as well as the model and effort. For unattended runs, add `--stop-on-limit` to leave later entries queued after a reported provider quota/rate limit or authentication failure. Resume after recovery with the same flag and without `--retry`; the failed attempt remains evidence.

Compare the new conditions at matching model/effort and use historical controls as context. There is one attempt per condition, with no new baseline or Impeccable-only runs. Sonnet and Terra have no historical Impeccable-only condition. Run variance, service drift and incomplete controls limit causal conclusions. Generated tests passing and evidence of a red-to-green loop are distinct from independent conformance and human usability assessment.

### Initial TDD experiment outcomes — 4 November 2026

All 32 planned initial attempts are recorded. The sixteen OpenAI attempts completed, built and passed their generated tests. Seven pass every independent conformance suite. All sixteen pass 23/23 stress cases through both `run` and `open`; all 208 standard-drawing checks match. Human scores remain unset.

The sixteen Claude attempts were rejected before app generation with `401 Invalid bearer token`; they produced no apps and provide no evidence about Sonnet or Opus quality. Authentication failures are preserved as operational failures, excluded from quality comparisons. No retries were performed. Representative saved failures: [Sonnet TDD](results/v2-e2-tdd-v1-claude-claude-sonnet-5-5-20261104-073724Z/result.json) and [Opus combined](results/v2-e2-impeccable-tdd-v1-claude-claude-opus-5-5-20261104-073815Z/result.json).

Language counts below are out of 595 and match on both `run` and editor `open`. Minutes are agent time; USD figures are stored API-list equivalents. Each new condition has one attempt per model/effort; historical base controls were collected earlier.

| Model / effort | Historical base language | TDD language | Both language | Minutes TDD / both | USD TDD / both | Saved results |
| --- | --- | --- | --- | --- | --- | --- |
| Sol / low | 595 | 594 | 592 | 11.8 / 25.4 | 0.801 / 1.493 | [TDD](results/v2-e2-tdd-v1-codex-gpt-6.1-sol-20261103-153405Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-codex-gpt-6.1-sol-20261103-210853Z/result.json) |
| Sol / medium | 595 | 595 | 595 | 28.1 / 24.3 | 1.718 / 1.652 | [TDD](results/v2-e2-tdd-v1-codex-gpt-6.1-sol-20261103-154622Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-codex-gpt-6.1-sol-20261103-213447Z/result.json) |
| Sol / high | 595 | 595 | 595 | 28.7 / 28.4 | 1.073 / 1.738 | [TDD](results/v2-e2-tdd-v1-codex-gpt-6.1-sol-20261103-161459Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-codex-gpt-6.1-sol-20261103-215928Z/result.json) |
| Sol / xhigh | 595 | 595 | 595 | 14.7 / 34.9 | 1.009 / 1.903 | [TDD](results/v2-e2-tdd-v1-codex-gpt-6.1-sol-20261103-164410Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-codex-gpt-6.1-sol-20261103-222821Z/result.json) |
| Terra / low | 588 | 570 | 593 | 3.2 / 5.9 | 0.123 / 0.154 | [TDD](results/v2-e2-tdd-v1-codex-gpt-6.1-terra-20261103-165922Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-codex-gpt-6.1-terra-20261103-230353Z/result.json) |
| Terra / medium | 595 | 589 | 595 | 3.7 / 6.1 | 0.166 / 0.140 | [TDD](results/v2-e2-tdd-v1-codex-gpt-6.1-terra-20261103-170250Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-codex-gpt-6.1-terra-20261103-231007Z/result.json) |
| Terra / high | 594 | 576 | 594 | 3.8 / 7.2 | 0.139 / 0.164 | [TDD](results/v2-e2-tdd-v1-codex-gpt-6.1-terra-20261103-170652Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-codex-gpt-6.1-terra-20261103-231620Z/result.json) |
| Terra / xhigh | 595 | 587 | 593 | 5.8 / 10.7 | 0.245 / 0.342 | [TDD](results/v2-e2-tdd-v1-codex-gpt-6.1-terra-20261103-171056Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-codex-gpt-6.1-terra-20261103-232351Z/result.json) |

The TDD-only condition tied its historical base in three matched efforts and scored lower in five. Sol low encoded a mistaken pre-assignment local-shadowing expectation in its own passing test. Terra failures mostly involve precise error locations; its medium TDD parser also rejects a procedure ending at EOF without a trailing newline. These defects remain untouched as benchmark evidence. The paired combined condition scored higher than TDD alone at every Terra effort, while only Terra medium was fully conformant. Single runs, sequential condition order and service drift prevent attributing those differences confidently to the skills.

Transcript command screening referenced TDD in all sixteen successful attempts and Impeccable in all eight combined attempts, with no evaluation-path command candidates. This limited screening does not establish full TDD adherence or rule out every evaluation-access route. Drawing agreement and generated tests do not establish full product usability.

The initial queue guard stopped on reported quota limits but did not recognize authentication failures, so it advanced through all sixteen rejected Claude entries. The optional guard now also stops after the first authentication failure, leaving subsequent entries queued. Completing the Claude comparison requires a valid subscription OAuth token and explicit authorization to retry the failed entries.

### Completed TDD comparison and authorized Claude retry — 4 November 2026

The initial outcome section above is retained as the pre-retry history. Yi subsequently authorized **Retry the 16 Claude entries** and provided a replacement private credential. All sixteen new Claude attempts completed; the original sixteen HTTP 401 failures remain preserved and excluded from quality comparisons. There are now **48 authorized attempt records and 32 completed apps**, with no further repetitions. All runs used the same frozen prompt/environment and sequential no-push execution.

**32/32 apps built and passed their own tests. 11/32 passed every independent suite: 5/16 TDD and 6/16 combined.** All 32 passed 23/23 stress cases through both `run` and editor `open`; language counts agree at both entry points. All 416/416 standard-drawing checks matched. Human scores remain unset.

The table below completes the earlier OpenAI table. Scores are language cases /595; minutes are agent time; Claude USD values are CLI-reported list equivalents, not subscription charges. Historical controls were not rerun.

| Model / effort | Base | Impeccable | TDD | Both | Minutes TDD / both | USD TDD / both | Saved results |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sonnet / low | 593 | — | 595 | 595 | 19.1 / 36.4 | 3.067 / 5.073 | [base](results/v2-e2-claude-claude-sonnet-5-5-20261028-045442Z/result.json) · [TDD](results/v2-e2-tdd-v1-claude-claude-sonnet-5-5-20261104-074629Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-claude-claude-sonnet-5-5-20261104-130957Z/result.json) |
| Sonnet / medium | 593 | — | 595 | 577 | 24.7 / 30.4 | 3.921 / 5.013 | [base](results/v2-e2-claude-claude-sonnet-5-5-20261028-072501Z/result.json) · [TDD](results/v2-e2-tdd-v1-claude-claude-sonnet-5-5-20261104-080628Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-claude-claude-sonnet-5-5-20261104-134649Z/result.json) |
| Sonnet / high | 595 | — | 592 | 594 | 44.7 / 58.5 | 8.696 / 9.980 | [base](results/v2-e2-claude-claude-sonnet-5-5-20261028-074837Z/result.json) · [TDD](results/v2-e2-tdd-v1-claude-claude-sonnet-5-5-20261104-083151Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-claude-claude-sonnet-5-5-20261104-141754Z/result.json) |
| Sonnet / xhigh | 595 | — | 594 | 594 | 68.0 / 82.2 | 15.221 / 20.938 | [base](results/v2-e2-claude-claude-sonnet-5-5-20261028-082944Z/result.json) · [TDD](results/v2-e2-tdd-v1-claude-claude-sonnet-5-5-20261104-091715Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-claude-claude-sonnet-5-5-20261104-151720Z/result.json) |
| Opus / low | 593 | 594 | 594 | 594 | 16.2 / 22.1 | 4.018 / 6.528 | [base](results/v2-e2-claude-claude-opus-5-5-20261028-113509Z/result.json) · [TDD](results/v2-e2-tdd-v1-claude-claude-opus-5-5-20261104-102546Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-claude-claude-opus-5-5-20261104-164006Z/result.json) |
| Opus / medium | 594 | 594 | 594 | 595 | 27.8 / 35.1 | 7.698 / 11.359 | [base](results/v2-e2-claude-claude-opus-5-5-20261028-115143Z/result.json) · [TDD](results/v2-e2-tdd-v1-claude-claude-opus-5-5-20261104-104227Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-claude-claude-opus-5-5-20261104-170255Z/result.json) |
| Opus / high | 592 | 595 | 594 | 593 | 43.6 / 45.3 | 13.998 / 15.265 | [base](results/v2-e2-claude-claude-opus-5-5-20261028-122444Z/result.json) · [TDD](results/v2-e2-tdd-v1-claude-claude-opus-5-5-20261104-111054Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-claude-claude-opus-5-5-20261104-173840Z/result.json) |
| Opus / xhigh | 595 | 595 | 594 | 594 | 74.4 / 57.1 | 31.060 / 21.189 | [base](results/v2-e2-claude-claude-opus-5-5-20261028-131400Z/result.json) · [TDD](results/v2-e2-tdd-v1-claude-claude-opus-5-5-20261104-115510Z/result.json) · [both](results/v2-e2-impeccable-tdd-v1-claude-claude-opus-5-5-20261104-182429Z/result.json) |

Across matching efforts, combined scored higher than TDD in six, tied in seven and lower in three. TDD versus historical base had four higher, four tied and eight lower results; combined versus base had five higher, five tied and six lower results. One app per condition and historical service drift prevent causal conclusions. Sonnet and Terra still have no Impeccable-only control.

Claude failures included valid procedure endings rejected at EOF (Sonnet high TDD), a parentheses limit incorrectly applying the bracket-only depth rule (several Sonnet runs and Opus high combined), and condition-RHS error-column mismatches (all Opus TDD runs and most Opus combined runs). Sonnet medium combined missed eighteen cases, chiefly diagnostic columns. Opus medium combined was fully conformant; Opus xhigh combined retained one column mismatch. Generated apps were left untouched.

All 32 successful transcripts referenced TDD and all sixteen combined transcripts referenced Impeccable. Repeated test-command candidates were present in all 32; limited path/tool-input screening found no evaluation-path candidates. Error-then-later-success command candidates were found in eighteen runs, but can include infrastructure failures; this does not verify complete red/green/refactor adherence or exclude every contamination route. Passing self-authored tests can preserve mistaken expectations, as in Sol low.

The final local evidence bundle is [comparison and metrics](../output/bench-experiments/2026-11-03-tdd/results.html), [exact run metrics](../output/bench-experiments/2026-11-03-tdd/results.json), [all independent failures](../output/bench-experiments/2026-11-03-tdd/failures.json), [desktop/phone screenshots](../output/bench-experiments/2026-11-03-tdd/screenshots.html), [transcript audit](../output/bench-experiments/2026-11-03-tdd/transcript-audit.json), and [attempt accounting](../output/bench-experiments/2026-11-03-tdd/attempt-status.json). These ignored operational artifacts are local-only; durable run evidence remains in `bench/results/`. Token totals retain provider categories; reasoning is not added to output a second time. The experiment did not publish a Pages release.

Final local validation: lint and typecheck passed; all **292 unit tests** and **3 Pages browser tests** passed; Pages rebuilt with the completed records and builds. Existing Biome configuration and bundle-size warnings remain. Charts and the 64-image desktop/phone gallery were previewed at desktop/narrow widths and shown inline; all effort/screen pairs and image enlargement controls passed assertions. The full shared chart exceeds the inline preview size limit, so compact native charts show the same reviewed values; full interactive chart files remain local. Validation evidence: [validation.json](../output/bench-experiments/2026-11-03-tdd/validation.json).
