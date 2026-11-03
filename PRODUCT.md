# Product

<!-- impeccable:product-schema 1 -->

> All facts below are inferred from the written product brief (no interview was possible; the brief authorises inference). Inferred items are marked *(inferred)*.

## Platform

web

## Stack
delegated: Vite + TypeScript, no UI framework, Three.js for 3D. Chosen for a small static build in `dist/` that honours `BASE_PATH`, with a pure interpreter module testable under `bun test`.

## Users
Polish-speaking learners and nostalgic adults who knew the classic Polish Logo environment "Logomocja": school pupils, teachers running a lesson, and hobbyists revisiting turtle graphics on a desktop or phone. *(inferred from brief)*

## Product Purpose
A Polish-language studio for turtle drawing in 2D and 3D: write a Logo program, run or step it, watch the turtle draw, read the reference, solve challenges, share a permalink. Success: a learner goes from an empty page to a working drawing, and understands any error from its Polish message.

## Positioning
A faithful Polish Logo dialect (accented keywords, `oto … już`, `nrpowt`) with real 3D spatial turtle (pitch and roll) in the same language, entirely offline in the browser.

## Operating Context
Classroom projector, home laptop, phone on the couch. Short sessions, frequent edit–run loops, sharing links with a teacher or friend. No accounts, no network at runtime.

## Capabilities and Constraints
Fixed by brief: editor with highlighting and error markers, run/step/pause/resume/reset with speed, 2D pan/zoom/fit, 3D orbit camera with grid and axes, thirteen standard examples verbatim, ≥5 auto-checked challenges with local progress, permalink, PNG export, `.logo` download/open, Polish command reference, per-mode drafts in local storage, shortcuts, responsive, light/dark, keyboard accessible, `window.logomocja` testing hook, `bun run test`.

## Brand Commitments
Name "Logomocja". Interface language Polish. Default pen colour `#16866a`; example palette includes `#c1763d`, `#2b6fb3`, `#a478c0`, `#6b4f2a`, `#2f8f4e`.

## Evidence on Hand
The thirteen standard programs and their Polish descriptions in the brief. No testimonials, users, or statistics exist; none may be invented.

## Product Principles
1. The drawing is the hero; the chrome stays out of its way.
2. Errors teach: every message names a place and a fix, in Polish.
3. Never lose the learner's work.
4. Same language, two spaces: flat programs look identical in 2D and 3D.

## Accessibility & Inclusion
Keyboard-operable everything, labelled controls, visible focus, system light/dark plus toggle, phone-sized screens. *(inferred)*
