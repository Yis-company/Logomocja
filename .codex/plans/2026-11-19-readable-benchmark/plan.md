# Make the benchmark easy to use

Put scores, screenshot evidence, and playable apps within reach from the results.

## Visitor flow

**Browse results → View evidence → Try app**

## Build

1. **Results.** Give Pages a compact benchmark header with an explicit Reference studio link. Keep all 111 attempts, search, protocol filters, and shareable URLs. Show scores and actions in compact desktop rows and a stacked mobile view. Keep same-protocol comparison visible as runs are selected.
2. **Evidence.** Open one program at a time from the row. Label reference and generated captures. Pair them on desktop and switch between them on mobile. Let visitors change program or recorded viewport, enlarge to original pixels, and open the original. Keep match status, missing captures, and raw records explicit.
3. **Play.** Put Try app on each runnable row and evidence view. Open the exact build in a new tab. Rebuild the four scored Gemini pilot apps from archived sources using the recorded toolchain and locked dependencies. Package them under the existing Pages build path. Show availability separately from benchmark status.
4. **Verify.** Run lint, typecheck, unit tests, Pages build and Chromium checks at 390 and 1440 px. Cover EN/PL, both themes, keyboard and deep links. Check every launch target and execute a drawing in all four pilot apps and one existing build. Use the existing Changesets release path.

## Scale

One static results payload, one filter pass, then sort, with 25 rows rendered. Zero screenshot bytes before evidence opens. Load at most two captures per selection. The desktop tree pair is 97 KB. At 10×, keep the same page size. At 100×, index transfer and sorting are the first limits.

## Approval

Approve this plan before implementation.
