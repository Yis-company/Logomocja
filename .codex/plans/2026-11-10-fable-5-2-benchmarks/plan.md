# Fable 5.2 benchmarks

Run eight fresh Logomocja app benchmarks with `claude:claude-fable-5-2`. Compare base against Impeccable at matching efforts.

| Condition | Efforts | Attempts |
| --- | --- | --- |
| Base | low, medium, high, xhigh | 4 |
| `impeccable-v1` | low, medium, high, xhigh | 4 |

Use frozen Impeccable 4.7.0 and engine 0.1.16. TDD, combined Impeccable+TDD, max, ultrathink, and extra trials remain outside scope.

1. **Prepare after approval.** Install locked dependencies and Chromium. Recheck queue ownership, pinned image, CLI compatibility, isolated inputs, and container-user output writes. Validate the pinned Impeccable engine before model calls. Confirm subscription authentication through documented OAuth environment/file inputs without exposing credentials; request credentials privately if needed. Stop on incompatibility; propose environment changes separately.
2. **Run sequentially.** Use frozen prompt v2, environment e4, and Claude Code 2.1.318. Save one four-entry matrix beside this plan. Run the base queue, then the same matrix with `--layer impeccable-v1`; both use `--prompt v2 --no-push --stop-on-limit`. One attempt per effort/condition; no time cap or automatic retries. Preserve failures and stop both queues on authentication/quota failures. Preserve services and Git history; stop on conflicts.
3. **Score built apps.** Retain clean install/build and generated-test results. Run all v2 conformance suites through `run` and editor `open`, including stress cases. Capture desktop/mobile galleries. Preserve prompts, layer metadata, transcripts, timings, tokens, costs, local branches, builds, and scores. Do not repair generated apps.
4. **Compare and validate.** Deliver an eight-attempt ledger, downloadable CSV, correctness/time/cost charts, and paired galleries. Match each layered result to its successful e4 base. Label older Fable 5.1/e2 results as historical context. Run lint, typecheck, unit tests, Pages build, and Pages acceptance. Report blockers and tool limitations. Human scores stay unset; single trials and sequential order limit conclusions.

Authentication remains unverified. No production edits, pushes, publication, or release. Execution requires approval of this revised plan.
