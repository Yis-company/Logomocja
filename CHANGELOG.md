# logomocja

## 0.6.0

### Minor Changes

- 9f10691: Make benchmark results readable on phones and put screenshot evidence and playable apps on each run. Add full-size screenshot inspection and host the four scored Gemini pilot demos.

## 0.5.0

### Minor Changes

- 3b0a57d: Make the benchmark the GitHub Pages homepage, with one bilingual results explorer, shareable filters and comparisons, and direct access to the drawing studio.

## 0.4.0

### Minor Changes

- 0ed50d4: Dialect v2: arithmetic expressions, variables (`niech`), conditionals (`jeśli`, `jeżeli`), recursion with `stop`, the repeat counter `nrpowt`, 3D roll (`pp`, `pl`), `dom` and `czyść`; invalid arguments are reported at the argument. The examples are the benchmark's thirteen standard programs with true previews, the testing hook gains `open`, and the benchmark page shows a screenshot gallery of every build next to the reference.
- 3bec1f5: Add an opt-in Impeccable design layer to the agent benchmark, with separate results and matching base-run links.
- 6f31114: Add opt-in TDD and Impeccable + TDD benchmark conditions with saved results for Sonnet, Opus, Sol and Terra at all four effort levels. Preserve historical controls and authentication failures, and stop unattended queues on provider authentication or quota failures.

### Patch Changes

- 21a9e9f: Benchmark environment e6 makes fresh container exports removable by the host, the queue stops on the 32,000-token response ceiling with `--stop-on-limit`, and Linux queues run as transient user services with durable per-run receipts.
- ff63ecc: Update dependencies to latest stable, move CI and the bench agent image to Node 26.13.1, and bump the bench agent CLI pins (Claude Code 2.1.327, Codex 0.170.0).
- 35d0ddf: Allow benchmark containers to write host-owned output and engine-cache directories through a non-root supplementary group, and record the Fable 5.2 low-effort base and Impeccable comparison with preserved failed and interrupted attempts.
- f78c292: Pan and orbit 3D drawings with the keyboard. Keep focus visible during playback and in forced colors. Dismiss example replacement on Back and reuse 3D line geometry when the turtle moves or turns without drawing.
- b145b25: Update dependencies to latest stable, move CI and the bench agent image to Node 26.13.0, and bump the bench agent CLI pins.

## 0.3.0

### Minor Changes

- 4104359: Add the agent benchmark: each AI coding agent builds the whole app from a brief in a versioned Docker container; results, conformance scores and the built apps are published on the `/benchmark` page. Expose `window.logomocja.run` as the testing hook.

## 0.2.0

### Minor Changes

- dfaabd8: Add Polish procedure parameter lists with `ma:` and comma-separated names, with plain parameter references in procedure bodies. Preserve legacy syntax and update examples and challenge starters.
- ca9b838: Add real navigation, light/dark themes, reusable Logo procedures and six automatically checked drawing challenges. Adopt shadcn Base UI controls and ReUI frames, with a visible package version and Changesets workflow.
  
  Use Bun for dependency installation and project commands, with a migrated bun.lock.
