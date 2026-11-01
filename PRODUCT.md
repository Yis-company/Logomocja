# Logomocja product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience is undecided.
Age groups and classroom roles are not specified.

## Product Purpose

Make programming tangible by writing small Logo-inspired programs and exploring
their drawings in 2D and real 3D. The core loop is to write or choose a program,
run or step through it, inspect the result, and revise it. Local procedure
challenges provide practice alongside the open studio.

## Operating Context

A browser-based studio for desktop and mobile web. The studio, examples,
command reference and challenges share navigation. Code and practice progress
stay in the current browser; there are no accounts, cloud sync or runtime
backend services. Use `bun run dev` for local development; see README.md for
build, checks and the separate GitHub Pages routing/release workflow.

## Capabilities and Constraints

- Keep 2D turtle drawing and spatial 3D drawing, including camera controls.
  3D loads lazily and requires WebGL2; unavailable 3D must leave 2D usable.
- Preserve run, pause/resume, single-step, reset and speed controls. Editing or
  switching drawing modes cancels execution; leaving the studio pauses it.
- Preserve separate 2D/3D drafts, confirmation before replacing edited code
  with an example, and draft recovery without executing on reload. Storage
  failures must leave editing usable and make unsaved work clear.
- Preserve the explicit Logo-inspired language subset, Polish/English aliases,
  named numeric procedures, bounded execution, and line/column errors. This is
  not full classic Logomocja compatibility or classic project-file import.
- Challenges use local procedure submissions and geometry checks. They are
  practice, not protected competition infrastructure or a leaderboard.

## Brand Commitments

Keep the Logomocja name and Polish interface and learning content. The existing
implementation is the design authority for refinement: src/styles.css,
src/components/ui/ and the current studio/navigation components. Missing
DESIGN.md does not authorize replacing that design system.

## Accessibility & Inclusion

Preserve keyboard access to the editor, execution and view controls; normal Tab
navigation; manual activation of mode tabs; labelled controls; announced status
and errors; and mobile navigation focus return. Keep desktop and touch workflows
usable in light and dark themes. Existing browser tests cover 1440px and 390px
layouts; this is not a claim of complete accessibility conformance.

## Evidence on Hand

README.md describes language, persistence, architecture and operating contracts.
Implementation lives in src/App.tsx, src/logo/, src/components/, src/pages/ and
src/challenges/. Tests in src/ and tests/ cover language/runtime, drafts,
challenges, controls, navigation and browser layouts. Test presence is evidence
of intended contracts; consult current run results before claiming verification.
