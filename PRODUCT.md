# Product

<!-- impeccable:product-schema 1 -->

> Every fact below is inferred from the written product brief. There was no interview: the harness had no way to ask questions, and the brief authorized inferring instead. Items marked *(assumed)* are my own reading, not something the brief states.

## Platform

web

## Stack

delegated: Vite + TypeScript with no UI framework, three.js for the 3D view, and `bun test` for the interpreter tests. I chose it because the brief requires a static site built with `bun run build`, and a small hand-written DOM layer keeps the bundle and its dependencies minimal.

## Users

- Polish-speaking learners writing their first turtle programs: school-age children and adult beginners *(assumed)*, on a school or home desktop or on a phone.
- Adults who remember the classic Polish Logo environment "Logomocja" from school and come back for the nostalgia.
- Teachers who share a program as a link or a `.logo` file *(assumed from the sharing feature)*.

Their job: write a short Logo program, run it, watch the turtle draw, then change it and run it again.

## Product Purpose

A Polish-language studio for turtle drawing, in flat 2D and real 3D space. A learner should be able to open it, read what the language can do, run the examples, write programs, solve the challenges and share what they made. Success: a beginner gets from opening the page to their own drawing in minutes, and every error tells them in Polish where they went wrong and why.

## Positioning

A faithful, precisely specified Polish Logo dialect (Polish and English aliases, accented spellings, `oto … już` procedures, `nrpowt`) that also draws in real 3D space with pitch and roll, in a modern browser and with no account or installation.

## Operating Context

- Short write, run, look, edit loops. Programs are usually under 50 lines.
- The app runs offline as a static site that may be hosted on a sub-path. No backend, no accounts, no network at runtime.
- Drafts live only in the browser's local storage. Sharing happens through a permalink URL, a PNG export or a `.logo` text file.

## Capabilities and Constraints

- The language, its semantics, error rules and limits are fixed by the brief. Errors are reported in Polish with a line and column.
- The thirteen standard programs ship byte for byte.
- At least five challenges with automatic checking, and progress kept locally.
- A command reference in Polish.
- The interface is in Polish.
- The test hook is `window.logomocja` with `version`, `run` and `open`.

## Brand Commitments

- The name is "Logomocja", after the classic Polish Logo environment.
- The default pen colour is `#16866a`, and the examples use `#c1763d`, `#2b6fb3`, `#a478c0`, `#6b4f2a` and `#2f8f4e`. These are part of the language's identity.

## Evidence on Hand

- The thirteen standard programs and their one-line descriptions, quoted verbatim in the brief.
- No testimonials, user counts or school partnerships exist, and none may be invented.

## Product Principles

1. The drawing is the point: the canvas gets the space, and the chrome steps back.
2. Errors teach: every message is in Polish, names the place and suggests what was meant.
3. Nothing is lost: drafts persist, and loading an example never silently overwrites the user's work.
4. Familiar controls: run, step, pause and reset behave the way they do in any editor or player.

## Accessibility & Inclusion

Every control is keyboard-operable and labelled, with visible focus. Contrast meets WCAG AA. The app works on phone-sized screens. Light and dark themes follow the system, with a manual toggle. Motion respects `prefers-reduced-motion` *(assumed)*.
