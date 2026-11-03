# Product

<!-- impeccable:product-schema 1 -->

> Every fact below is inferred from the written product brief; no interview was possible in this session (no question tool, benchmark instructs to proceed unattended). Inferred facts are marked *(inferred)*.

## Platform

web

## Stack

delegated: Vite + TypeScript, no UI framework, Three.js for the 3D view, Vitest for interpreter tests. Chosen because the deliverable must be a self-contained static site built with `bun run build`, honour `BASE_PATH`, and run offline. *(inferred)*

## Users

Polish-speaking learners writing turtle-graphics programs: pupils meeting programming for the first time, teachers preparing a lesson, and adults who remember the classic Polish Logomocja environment from school and want it back. They work on a school or home desktop and on a phone. *(inferred)*

## Product Purpose

Logomocja is a Polish-language studio for writing Logo programs and watching a turtle draw them, on a flat plane (2D) or in space (3D). Success: a learner opens it, reads what the language can do, runs the examples, writes their own programs, solves the challenges and shares what they made — without an account or network.

## Positioning

A faithful, precisely specified Polish Logo dialect (Polish and English aliases, accented spellings, Polish error messages with line and column) that draws the same program in 2D and in true 3D space with pitch and roll.

## Operating Context

Classroom and home use; short sessions of write → run → look → tweak. Programs are shared as permalinks and `.logo` files; drawings exported as PNG. No backend, no network at runtime, local storage only.

## Capabilities and Constraints

- Editor with line numbers, highlighting, inline error marker, executing-line highlight.
- Run / step / pause / resume / reset with speed control; animated turtle marker.
- 2D view (pan, zoom, fit, origin) and 3D view (orbit, pan, zoom, reset, grid, axes); 3D degrades with an explanation when WebGL is missing.
- Thirteen fixed standard programs, at least five auto-checked challenges with locally persisted progress.
- Permalinks, PNG export, `.logo` download/open, Polish command reference, per-mode drafts in local storage, keyboard shortcuts.
- Interface entirely in Polish. Testing hook `window.logomocja`.

## Brand Commitments

Name: Logomocja — a nod to the classic Polish Logo environment. Default pen colour `#16866a`; the standard programs use `#c1763d`, `#2b6fb3`, `#a478c0`, `#6b4f2a`, `#2f8f4e`. *(inferred: these colours come from the shipped example programs.)*

## Evidence on Hand

The thirteen standard programs in the brief are the only shipped content. No testimonials, users, schools or statistics exist; none may be invented.

## Product Principles

1. The drawing is the point: the canvas gets the space, chrome stays out of its way.
2. Errors teach: every error names a place and explains the fix in plain Polish.
3. Nothing is lost: drafts persist, examples never silently overwrite work.
4. Same program, same shape: 2D and 3D agree for flat programs.

## Accessibility & Inclusion

Keyboard-operable, labelled controls with visible focus; light and dark theme following the system; usable on phone-sized screens. Audience includes children, so copy stays plain. *(inferred)*
