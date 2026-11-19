# Logomocja benchmark homepage

Make GitHub Pages and the README benchmark-first. Open on one results table, with every source visible by default. Use English by default with an EN/PL switch. Keep the Polish studio one click away.

## One table · sample rows

| Model | Source | Protocol | Condition | Interpreter |
| --- | --- | --- | --- | --- |
| Gemini 4 Neon | Antigravity | v2 · macOS | Base | 618/618 |
| Claude Fable 5.2 | Docker | v2/e5 | Base | 617/618 |

## Scale bound

One static metadata transfer, one pass per filter, zero API calls. Docker records are 9.7 KB gzip today. At 10×, expect about 97 KB and render 25 rows per page. At 100×, roughly 1 MB compressed makes transfer and parsing the first limits. Load galleries on demand.

## Implementation

1. **Route.** Open the hosted root on Benchmark. Keep existing benchmark and run links, legacy examples links, generated builds, and local studio entry. Link Studio directly from Pages and the README. Keep the README English and lead with results and methodology.
2. **Unify.** Read existing checked-in evidence into one table. Include 103 finalized Docker records, one interrupted attempt, and seven Gemini pilot attempts, including three setup blockers. Keep task, source, protocol, condition, status, and evidence visible. Display missing metrics as unavailable. Label API-equivalent prices.
3. **Explore.** Search model and run ID. Filter source, protocol, model, runner, effort, condition, task, and status. Sort by date or model across sources, and by metrics within a protocol. Preserve filters, language, selected run, and comparison in shareable URLs. Show build, source, and evidence links where available.
4. **Compare.** Select two built app runs under the same protocol. Show observed conformance, time, cost where available, and CLI versions. Keep protocol and pilot caveats visible.
5. **Verify.** Run lint, typecheck, unit tests, Pages build, and Pages browser tests. Check row coverage, filtering, share links, compare eligibility, keyboard access, EN/PL at 390px and 1440px, and studio navigation and draft recovery.

## Approval

Approve this plan before implementation.
