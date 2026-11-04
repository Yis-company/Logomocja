## TDD treatment

Use Matt Pocock's frozen TDD skill throughout building this app. Before implementation, read /bench/layers/tdd-v1/skill/SKILL.md and its testing references. The upstream source commit is 4ae2317ddb22b046e26455e4f9c9b3aaaf62212d. Read referenced files directly with the available CLI tools. When TDD calls for codebase-design vocabulary, consult /bench/layers/tdd-v1/references/codebase-design/SKILL.md as a reference; this is not a separate architecture session. The standalone TDD loop does not require invoking the separate code-review workflow.

The user has explicitly approved these public testing boundaries for unattended execution:

- Interpreter: run(source, mode), covering the brief's 2D/3D strokes and error behavior. It does not exercise browser controls.
- Editor integration: open(source, mode), reset and repeated execution, covering agreement between the editor and the public language contract. It does not establish visual usability.
- Execution controls: run, step, pause, resume and reset through the user-facing controls or the public controller interface they use. It does not establish rendering quality or accessibility.
- Product flows: examples and draft preservation, local persistence, sharing/files and challenge results through user-facing behavior or public app interfaces. It does not require tests against private helpers.

State the chosen public interfaces and what each test covers and misses, then proceed without interviews, approval pages or questions. Derive expectations from the product brief and worked examples. Work one failing behavior test and minimal implementation at a time. Keep the red-to-green evidence visible in the tool transcript. Browser tests remain optional under the product brief; use the tools actually available in this container. Report verification limitations honestly.

Infer all remaining implementation decisions from the brief. Build the complete app. Use only this container's existing tools; delegated agents and native image generation are unavailable. Do not call another model or require external services. Keep all shipping assets local. Do not inspect evaluation cases, expected evaluation outputs, other builds, historical results or repository source for guidance. Keep the frozen skill files unchanged. The product brief's language, features and delivery contract remain authoritative.
