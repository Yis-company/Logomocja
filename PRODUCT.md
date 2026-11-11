# Product

<!-- impeccable:product-schema 1 -->

> Provenance: no interview was possible in this session (unattended benchmark run, explicit authorization to infer). Everything below is taken from the written product brief; inferences are marked *(assumption)*.

## Platform

web

## Stack

Delegated: static site built with Bun's bundler from TypeScript, no UI framework, hand-written CSS, Canvas 2D for both views: the plane is drawn directly and space goes through a small hand-written perspective projector with depth-sorted strokes, so 3D never depends on WebGL. Chosen because the delivery contract demands a self-contained `dist/` with no runtime network and a `BASE_PATH`-relocatable build; fewer dependencies means fewer ways to break that.

## Users

Polish-speaking learners and the adults who once were those learners: people who met Logomocja or Logo Komeniusz in a school computer lab in the 1990s–2000s and want to draw with the turtle again, and children or students meeting turtle graphics for the first time, often with a parent or teacher beside them *(assumption: mixed nostalgic adults and school-age learners)*. They sit at a desktop or hold a phone; nobody has an account.

## Product Purpose

A studio where you write a Logo program, run it, and watch a turtle draw it on a plane (2D) or in space (3D). Success: a learner can open it, read what the language can do, run the examples, write their own programs, solve the challenges and share what they made, without ever leaving the page or hitting a network.

## Positioning

The Polish Logo dialect (`np`, `pw`, `powtórz`, `oto … już`) with exact, documented semantics, precise Polish error messages with line and column, and a turtle that leaves the page: the same language draws flat figures and real 3D solids.

## Operating Context

- One workspace: editor, drawing surface, run controls. Run, step command by command, pause, resume, reset, change speed.
- Thirteen standard programs shipped verbatim; at least five auto-checked challenges; a full command reference in Polish.
- Sharing by permalink, PNG export, `.logo` file download and open.
- Classroom desks, home laptops, phones on a couch *(assumption)*.

## Capabilities and Constraints

- Language semantics, limits and the `window.logomocja` testing hook are fixed by the brief.
- No backend, no accounts, no runtime network. Local storage only.
- Static build relocatable under any `BASE_PATH`.
- 3D must not be able to fail separately from 2D: it is drawn on Canvas 2D, needs no WebGL, and so is available wherever the app runs.
- Interface language: Polish.

## Brand Commitments

- Name: Logomocja. A nostalgia project that must feel good to use today.
- The default pen colour `#16866a` and the example palette (`#c1763d`, `#2b6fb3`, `#a478c0`, `#6b4f2a`, `#2f8f4e`) are product facts that appear in every drawing.

## Evidence on Hand

- The thirteen standard programs and the language specification from the brief.
- No logo, illustrations, photography or testimonials exist; none may be fabricated.

## Product Principles

1. The drawing is the reward: nothing competes with the canvas for attention.
2. Errors teach: every message names a place and a remedy, in plain Polish.
3. Never lose a learner's work: drafts persist, examples do not overwrite silently.
4. One language, two worlds: flat programs behave identically in 2D and 3D.
5. Works everywhere it is opened: phone, desktop, keyboard only, no network.

## Accessibility & Inclusion

Every control keyboard-operable and labelled, visible focus, light and dark themes following the system with a manual toggle, WCAG AA text contrast, reduced-motion respected.
