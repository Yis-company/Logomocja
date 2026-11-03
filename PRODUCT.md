# Product

<!-- impeccable:product-schema 1 -->

> Interview substitution: no answer mechanism was available in this session and the
> benchmark brief authorises inference. Every fact below comes from the written product
> brief; facts marked *(inferred)* are my reading of it, not confirmed answers.

## Platform

web

## Stack

delegated: Vite + TypeScript, no UI framework, Three.js for the 3D view, Bun for scripts and
tests. *(inferred)* Chosen because the deliverable is a self-contained static site honouring a
`BASE_PATH` sub-path, with an interpreter that must be unit-testable in isolation.

## Users

- Learners meeting turtle graphics for the first time, often school-age, on a laptop at home or
  in a classroom, or on a phone. *(inferred)*
- Adults who used the Polish Logo environment "Logomocja" at school and come back out of
  nostalgia, who want the old dialect to feel good on today's devices. Named in the brief.
- Teachers who hand out a link to a program or a challenge. *(inferred from permalink and
  challenge features)*

Their job: write a short Logo program in Polish, run it, watch the turtle draw, fix the
mistake the editor points at, and share the result.

## Product Purpose

A Polish-language studio for turtle drawing in 2D (the plane) and 3D (space). It is complete
on its own: a learner can read what the language can do, run the shipped examples, write
programs, solve practice challenges and share what they made. Success means a first program
runs within a minute of opening, every error is understandable in Polish, and the 3D mode
feels like a natural extension of the 2D one.

## Positioning

The only turtle studio that speaks this specific Polish dialect (accented and unaccented
spellings, `oto … już` procedures, `nrpowt`) and extends it with true 3D turtle orientation
(pitch and roll), while guaranteeing that a flat program draws the same shape in both modes.

## Operating Context

- Interface entirely in Polish. No accounts, no backend, no network at runtime.
- Editor + canvas loop: type, run (or step), watch, read the error marker, fix.
- Drafts persist per mode in local storage; sharing is a URL permalink, a `.logo` file, or a
  PNG export.
- Deployed as static files, possibly under a sub-path, with no rewrite rules.
- Automated testing calls `window.logomocja.run/open` to take screenshots of the thirteen
  standard programs.

## Capabilities and Constraints

- The language, the feature list and the delivery contract are fixed by the brief (see
  README.md and the in-app reference). The interpreter must match the specified semantics
  exactly, including the operator-whitespace rule, error positions, and limits.
- Thirteen standard programs ship verbatim, byte for byte, with fixed names and modes.
- At least five challenges with automatic checking and locally persisted progress.
- 3D needs WebGL; without it 2D must still work and the app must say why 3D is off.
- Phone and desktop, light and dark theme following the system with a manual toggle,
  keyboard operable, labelled controls, visible focus.

## Brand Commitments

- Name: **Logomocja**, after the classic Polish Logo environment. Nostalgic in spirit, but it
  must feel current to use.
- Default pen colour `#16866a`; the standard programs also use `#c1763d`, `#2b6fb3`,
  `#a478c0`, `#6b4f2a`, `#2f8f4e`. These are part of the product's content.

## Evidence on Hand

- The thirteen standard programs and their Polish titles and one-line descriptions, from the
  brief.
- No testimonials, users, classrooms, or usage numbers exist; none may be invented.

## Product Principles

1. The drawing is the reward: the canvas is always the largest thing on screen.
2. Errors teach: every message names the line, the column and the fix, in plain Polish.
3. Never lose the learner's work: drafts survive reloads, examples never silently overwrite.
4. 2D and 3D are one language: a flat program is the same drawing in both modes.
5. Complete over large: every documented command works exactly as documented.

## Accessibility & Inclusion

Keyboard operable throughout with visible focus, labelled controls, WCAG AA contrast in both
themes, reduced-motion respected, usable at 360 px wide. *(inferred from the brief's
"responsive and accessible" requirement)*
