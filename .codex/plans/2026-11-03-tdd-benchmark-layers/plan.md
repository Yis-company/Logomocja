# Add TDD and Impeccable + TDD benchmark conditions

## Decision for review

Add two opt-in, from-scratch app conditions: `tdd-v1` and `impeccable-tdd-v1`. Run each on Sonnet, Opus, Sol and Terra at low, medium, high and xhigh: **32 new runs**, one attempt per model/effort/condition.

Yi selected all previously used supported effort levels. Stored v2/e2 results show successful runs for all sixteen model/effort combinations under the pinned CLIs. This is historical compatibility evidence; current service availability is checked when running.

Yi approves this plan in Plannotator before Codex changes the implementation or starts benchmark runs. Approval also confirms the testing boundaries below for unattended TDD.

## Confirmed run matrix

| Model | Exact CLI model | Efforts | TDD | Impeccable + TDD |
| --- | --- | --- | --- | --- |
| Sonnet | `claude:claude-sonnet-5-5` | low, medium, high, xhigh | 4 | 4 |
| Opus | `claude:claude-opus-5-5` | low, medium, high, xhigh | 4 | 4 |
| Sol | `codex:gpt-6.1-sol` | low, medium, high, xhigh | 4 | 4 |
| Terra | `codex:gpt-6.1-terra` | low, medium, high, xhigh | 4 | 4 |

Use prompt v2, environment e2, the existing pinned CLIs and subscriptions, and the existing product brief, conformance suites, build verification and gallery capture. Run sequentially in this checkout with `--no-push`. The first condition uses TDD alone; the second adds the existing frozen Impeccable v4.7.0 / engine 0.1.16 treatment to the identical TDD instructions.

## TDD treatment and approved testing boundaries

Freeze Matt Pocock's TDD skill and its local testing references from `mattpocock/skills` commit `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`. Record source, commit and files in a plain manifest. Include its referenced codebase-design vocabulary as reference material; it is consulted only when TDD needs interface terminology. No separate architecture exercise, delegated review, additional model or additional skill treatment is introduced.

The upstream TDD skill requires user-confirmed testing boundaries. Both conditions receive the same explicit pre-approval for these public behaviors, derived only from the existing brief:

- **Interpreter:** `run(source, mode)`, including 2D/3D strokes, error positions and parse/runtime error behavior. This checks language behavior without exercising browser controls.
- **Editor integration:** `open(source, mode)` and reset/repeated execution, checked against the same public language contract. This checks that the editor and returned drawing agree; it does not establish visual usability.
- **Execution controls:** run, step, pause, resume and reset through user-facing controls or the public controller interface those controls use. This checks lifecycle behavior; rendering and accessibility still need separate inspection.
- **Product flows:** examples and draft preservation, local persistence, sharing/files and challenge results through their user-facing behavior or public app interfaces. This checks observable outcomes without requiring tests against private helpers.

The agent states its chosen public interfaces and what each test covers, then works one failing behavior test and minimal implementation at a time. Tests derive expectations from the brief and worked examples. Browser tests remain optional, as in the original brief; the treatment supplies no extra browser tools. The test count is not a score.

Keep upstream snapshot files verbatim. Put the unattended authorization, approved boundaries, file-based reference access and tool limitations in the benchmark instruction adapter. Both conditions use the same adapter. The combined condition also retains Impeccable's applicable design setup, finish review and documentation. Neither condition receives evaluation cases, expected evaluation outputs, historical defects, other builds or this repository's product/design context as extra guidance.

## Sequence, ownership and acceptance

| Step | Owner | Work and dependency | Acceptance |
| --- | --- | --- | --- |
| 1. Freeze the inputs | Codex | After approval, vendor the pinned TDD snapshot and required references. Add the two manifests; reuse the existing Impeccable snapshot. | Source provenance is recorded; TDD inputs are identical in both new conditions; existing Impeccable files remain intact. |
| 2. Extend layer execution | Codex | Extend the small layer loader, prompt adapter and conditional engine preparation for the two named conditions. Keep the current base and Impeccable behavior. | Base and existing Impeccable prompts remain byte-for-byte unchanged. TDD alone does not prepare/mount an Impeccable engine. Combined runs use the existing pinned engine. Unknown layers and layers on non-app tasks fail before launch. |
| 3. Label and preserve evidence | Codex | Extend layer metadata and benchmark-page labels to identify skills and source revisions. Reuse existing grouping, baseline links, galleries and queue resume checks. | The page clearly separates base, Impeccable, TDD and combined conditions. Each new run retains its actual prompt, manifest, transcript, scores, timings, tokens and cost. A result from another condition cannot satisfy resume. Historical records remain readable. |
| 4. Verify implementation | Codex | Add focused behavior tests for condition isolation, prompts, conditional preparation, saved metadata and resume/grouping. Run lint, typecheck, unit tests and Pages build, plus applicable existing Pages browser checks. | Required checks pass or an actionable blocker is reported before spending benchmark quota. No frozen prompt, historical result or existing build is changed. |
| 5. Execute the approved matrix | Codex | Recheck Docker and queue ownership, credentials without exposing values, and pinned tools. Run the sixteen TDD entries, then the sixteen combined entries, sequentially. Use saved queue state and `--no-push`. | All 32 requested entries are accounted for as completed or explicitly failed/blocked. No extra models, effort levels, repeated trials, new base/Impeccable-only runs or automatic retries. Auth/quota failures are reported; affected provider work waits for recovery where needed. |
| 6. Assess and hand back | Codex; Yi judges design | Compare the two new conditions at matching model/effort, and show available historical base/Impeccable context. Aggregate correctness, build/tests, time, tokens, estimated cost and desktop/mobile gallery evidence. Inspect transcripts for use of the TDD loop and report missing evidence. | Findings link exact run evidence and distinguish generated tests from independent conformance. No generated app is repaired after scoring. Human design scores remain unset unless Yi supplies them. |

## Scope and versioning

This experiment adds two conditions and their 32 results. It adds no new conformance cases, visual scoring model, generic skill-composition framework, baseline reruns, publication, PR or release. Existing source branches are preserved; the harness creates its ordinary local source branches for each run. Preserve the unrelated `.serena/` directory, other worktrees and running services.

Keep environment e2 only while agent flags, Docker image, in-container runner, verification, conformance and gallery behavior stay unchanged. If an outcome-affecting environment change becomes necessary, stop and revise the plan and version before running. The layer extension stays on the host, as for Impeccable v1.

## Limits and operational dependencies

- One attempt per condition cannot estimate run variance. Historical controls were collected earlier; service-side drift remains possible. Comparisons describe these runs and do not establish a general causal ranking.
- Sonnet and Terra have no existing Impeccable-only result. Their new combined runs can be compared with TDD and historical base, but cannot isolate the TDD increment over Impeccable alone.
- Model/effort availability and quotas can change despite stored successful results. Report an unavailable requested model rather than substituting one. There is no new time cap; the existing queue remains resumable.
- Docker and upstream downloads require sandbox escalation. The read-only container check found no active env-2 benchmark container. Recheck before execution. Dependencies are not installed in this checkout yet.
- Use existing subscription credentials through the established scripts. If credentials are absent, use the private secret workflow. Never print tokens or authentication files.
- The existing harness mounts benchmark materials read-only. Do not strengthen or weaken that environment as a side effect; audit transcripts for evaluation access and flag any contaminated result.

<details>
<summary>Investigated source and acceptance evidence</summary>

- `bench/layers.ts` currently accepts only `impeccable-v1`, constructs its fixed prompt and prepares its engine. New conditions require an explicit extension rather than a hidden default change.
- `bench/result.ts` currently assumes every layer has Impeccable version fields; it needs a compatible representation for TDD source provenance.
- `bench/run.ts` renders the prompt on the host, saves layered metadata, imports source branches and captures scores. `bench/queue.ts` carries the layer and validates model/effort/condition on resume.
- `src/benchmark.ts` already groups by condition. `src/pages/Benchmark.tsx` currently labels every non-base condition as Impeccable; that label must become accurate for TDD and combined results.
- `bench/prompts/v2/spec.md` fixes the language, features and delivery hooks, permits unattended decisions and makes browser tests optional. It is the sole source for the approved testing boundaries.
- `bench/README.md` defines versioning, sequential checkout ownership, local source branches, immutable prompts and evidence limits. Existing stored results verify the four requested efforts for all four exact model IDs.
- `bench/env/Dockerfile` pins Claude Code 2.1.310, Codex 0.164.0, Bun 1.4.4 and Node 24.22.1. No change is planned.
- Upstream pinned TDD directory contains `SKILL.md`, `tests.md`, `mocking.md` and agent metadata. Its SKILL requires confirmed testing boundaries and optionally references codebase-design vocabulary. Review-stage code-review orchestration is not part of the standalone TDD loop.
- `.github/workflows/pr.yml` requires lint, typecheck and unit tests. Pages build and applicable existing browser tests cover changed result labels and local build links.

</details>


## Completion — 4 November 2026

All six implementation, execution and assessment steps are complete. The approved comparison produced 32 apps. The original sixteen Claude authentication failures and sixteen explicitly authorized replacements are preserved as 48 total attempts. Eleven apps passed every independent suite; all 32 built and passed their own tests and stress suites. Human design scores remain unset; no generated app was repaired and nothing was published.

Final validation passed lint, typecheck, 292 unit tests, Pages build and three Pages browser tests. The comparison charts and 64-image desktop/phone gallery were previewed and shown inline. The one-shot follow-up has been disabled.

Evidence: [final report](../../../output/bench-experiments/2026-11-03-tdd/results.html), [metrics and exact result paths](../../../output/bench-experiments/2026-11-03-tdd/results.json), [validation](../../../output/bench-experiments/2026-11-03-tdd/validation.json), and [completion record](completion.json). The approved plan and original outcomes above are retained.
