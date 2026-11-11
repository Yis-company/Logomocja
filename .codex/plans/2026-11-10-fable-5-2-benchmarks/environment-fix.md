# Unblock Fable 5.2 benchmarks

Fix benchmark mount permissions, then run the approved eight attempts as **v2/e5**. This replaces the approved e4 environment only.

| Condition | Efforts | Attempts |
| --- | --- | --- |
| Base | low, medium, high, xhigh | 4 |
| Impeccable 4.7.0 / engine 0.1.16 | low, medium, high, xhigh | 4 |

**Observed blocker:** host UID/GID 1000 creates output/cache directories; container UID/GID 1001 cannot write them. Both output probes failed with `EACCES`; engine preparation failed creating its cache. No model calls ran. Authentication remains unverified.

1. **Fix owned writable mounts.** Add a shared helper for benchmark-created output/cache directories. Set explicit group access and supply their non-root host GID as a Docker supplementary group. Apply it to app output and engine preparation. Keep evaluation inputs read-only, credentials unchanged, and avoid world-writable directories. Scope: `bench/inputs.ts`, `bench/run.ts`, `bench/layers.ts`, relevant tests, and `bench/env/VERSION` (4 to 5). Keep CLI versions, frozen prompts/skills, suites, and scoring unchanged.
2. **Prove before spending quota.** Repeat real-container probes using the production helper under restrictive permissions. Require output writes and pinned engine preparation to pass while evaluation data stays excluded. Run lint, typecheck, unit tests, Pages build, and Pages acceptance. Stop on failures or Git conflicts. Confirm OAuth through documented inputs; request credentials privately if needed.
3. **Run and report.** Run base, then Impeccable, sequentially with `--no-push --stop-on-limit`. One attempt per effort/condition; no time cap or automatic retries. Stop both queues on authentication/quota failures. Preserve evidence and generated apps; deliver the approved ledger, CSV, charts, and paired galleries. Match e5 controls; older environments remain historical context. Human scores stay unset. No publication or release.

This benchmark-harness change needs separate approval under the original plan’s incompatibility gate. All other approved commitments remain.
