# Add an Impeccable benchmark layer

## Decision for review

Add an opt-in `impeccable-v1` layer to the existing from-scratch app benchmark. Keep the base benchmark as the default. Run only `claude:claude-opus-5-5` and `codex:gpt-6.1-sol` with the layer, comparing each build with its existing base result at the same effort.

This tests using Impeccable during app creation, rather than redesigning an existing result.

**Confirmed matrix:** Yi chose low, medium, high, and xhigh for both Opus and Sol: eight new Impeccable runs. No other models or new base runs are included.

**Approval:** Yi reviews this plan in Plannotator. Codex implements and runs the approved experiment afterward.

## What stays fixed

- Existing prompt v2, dialect, examples, conformance suites, results, builds, and source branches stay intact.
- Ordinary invocations retain their prompt, CLI flags, isolated environment, ID format, scoring and behavior. No host user rules, repository PRODUCT.md, existing design, or preselected aesthetic enter benchmark agents.
- Layered runs use the same pinned CLIs, effort values, product requirements, build verification, conformance tests and screenshot capture as the base.
- Existing human scores remain unchanged. No automated design score or new ranking formula is added.

## Sequence and ownership

| Step | Owner | Work and dependency | Acceptance |
| --- | --- | --- | --- |
| 1. Freeze the layer | Codex | Snapshot installed Impeccable v4.7.0 into a versioned benchmark layer, preserving instructions, references, agent guidance, launcher and required data. Record source and versions in a plain manifest. Exclude the macOS executable; prepare Linux engine 0.1.16 through the shipped pinned launcher/release mechanism. | Repository assets and the pinned engine release reproduce the layer. Runtime does not depend on mutable global skills. |
| 2. Wire opt-in execution | Codex | Add a named layer option to the host runner and queue. Expose the frozen skill and explicitly direct both CLIs to read it. Keep the original rendered brief as a complete unchanged section. Store the combined prompt and manifest with layered results. | Base runs receive no extra instructions or skill mount. Layered IDs and metadata identify the condition. Unknown layers and layers on non-app tasks fail before launch. |
| 3. Preserve unattended execution | Codex | Give both models the same explicit authorization to infer design decisions from the brief and proceed without human interviews. Use only tools available in the container. Preflight the Linux skill launcher before spending model quota. | Codex loads the skill despite ignored user rules. Required setup failures are reported; no silent fallback to a base run. Both models receive identical skill assets and autonomy instructions. |
| 4. Show the layer | Codex | Keep base tables and galleries. Add a labelled Impeccable section, grouped by prompt/environment and layer, reusing current tables and galleries. Show effort in comparison labels, the skill version and matching base run IDs. | Historical results without layer metadata stay in the base condition. Layered results cannot blend into base rankings. Each retains scores, gallery, time, tokens, cost and source links. |
| 5. Verify the change | Codex | Add focused behavior tests for base compatibility, layer prompts/metadata, queue forwarding and resume validation, and grouping. Run lint, typecheck, unit tests and Pages build. Inspect the changed page at desktop and phone widths with existing browser-test tooling. | Required checks pass or failures are reported with evidence. Run the Impeccable detector once on changed benchmark UI. Confirm no historical prompt/result changed. |
| 6. Run Sol, then Opus | Codex | After approval and checks, recheck live queues/containers. Run approved Sol entries first. Schedule one continuation for Opus no earlier than 2026-11-03 06:20 Europe/Warsaw (05:20 UTC), conservatively two hours after this session's timing check. If preparation finishes later, start after preparation. The continuation checks Sol has finished and avoids duplicate runs. | No Claude call before the reset allowance. Only approved models/efforts run, sequentially in this checkout. Save queue paths and outcomes; quota failures stay visible without repeated retries. |
| 7. Compare outputs | Codex; Yi judges | Compare matching base/layer model and effort using existing desktop/mobile screenshots. Explain visible differences and correctness changes, plus time/cost changes. Yi may enter human scores afterward. | Findings separate visual observations from measured conformance, link exact runs, and acknowledge run variance. |

## Versioning and isolation

Use an immutable layer ID and snapshot. Keep prompt v2 and environment e2 if their contents and base behavior remain unchanged. Keep wiring on the host side, without changing `agent.ts`, CLI flags, Dockerfile, verification or screenshot machinery. If any such outcome-affecting component must change, bump the environment per benchmark policy and label cross-environment comparisons.

Use `--no-push` for experiment runs. Imported source branches and built apps stay local for review; publication is outside scope. Use existing subscription authentication. If Claude authentication is missing, request it through the private secret tool after approval; never print credentials.

## Limits and dependencies

- Existing baselines are historical single runs. Matching prompt, model, effort and CLI pins helps, but service-side changes and randomness prevent a strong causal claim. Fresh paired controls would expand scope.
- Impeccable context, design decisions and finish review may increase tokens and time; measure that overhead as part of the layer's effect.
- Optional native image-generation, browser and subagent integrations may be absent inside these CLI containers. Use the same available tool surface for both models and record limitations; do not add external services or another model silently.
- 06:20 local is a conservative earliest start derived from the stated two-hour reset, not live verification of Claude quota.
- Docker requires sandbox escalation. A read-only check found no active Logomocja benchmark container; this checkout has no saved queue directory. Recheck before running.
- Preserve the unrelated untracked `.serena/` directory, running services, Git history and other worktrees.

<details>
<summary>Current-source evidence</summary>

- `bench/README.md`: isolation, immutable prompts, environment versioning, scoring and screenshot contracts.
- `bench/run.ts`: host arguments, Docker invocation, prompt, IDs, scores and source import.
- `bench/agent.ts`, `bench/runners.ts`: fresh work directory, CLI flags, excluded host configuration and verification.
- `bench/prompt.ts`, `bench/prompts/v2/spec.md`: shared brief, fixed semantics/features/delivery, autonomous decisions.
- `bench/queue.ts`: explicit model/effort matrix, sequential execution and saved-result validation.
- `bench/result.ts`, `src/benchmark.ts`, `src/pages/Benchmark.tsx`: schema, grouping and galleries.
- `bench/gallery.ts`: 1280×800 desktop screenshots and 390×844 mobile capture through the app's `open` hook.
- Stored v2/e2 results include Opus and Sol at low, medium, high and xhigh. All eight report completed, built and own tests passing. These are saved records, not checks rerun today.
- Installed `/Users/yitam/.agents/skills/impeccable/SKILL.md`: v4.7.0; engine `scripts/VERSION`: 0.1.16. Context loading succeeded in this planning session.
- `.github/workflows/pr.yml`: lint, typecheck and unit tests. Release adds Pages build and Pages browser checks. No release is included here.

</details>
