# Logomocja

A Polish-language, Logo-inspired web studio with **2D turtle drawing** and **real 3D spatial drawing**. Write commands, run or step through them, and explore the result. The interface works on desktop and mobile.

## Run locally

Use Bun 1.4.0 or later. The package manager is pinned to Bun 1.4.0; Node.js 22.12+ remains required by tools with Node entry points.

```sh
bun install --frozen-lockfile
bun run dev
```

Open the local URL printed by Vite. For a production build:

```sh
bun run build
bun run preview
```

The app has no server, account system or external runtime services. The 3D renderer loads when you enter 3D mode and requires WebGL2. If WebGL2 is unavailable, the app explains the problem and keeps 2D usable.

## Drawing

- **Uruchom** starts from the origin after validating the entire program. **Pauza** preserves progress; **Wznów** resumes it.
- **Krok** executes one primitive command. Repeat bookkeeping runs internally. At the end, another step finishes the program.
- **Reset** cancels execution, clears the drawing, resets the view and retains your code.
- Editing cancels execution and leaves the previous drawing visible. Switching modes cancels execution, restores the other draft and starts with a fresh stage.
- Seven examples cover a square, star, rosette, spatial staircase, cube, spiral and reusable procedure. Loading an example asks before replacing edited code.
- 2D controls zoom or fit the drawing. 3D controls orbit, pan, zoom, reset the camera, or show top/front views. Use one finger to orbit and two fingers to pan/zoom; on desktop, drag to orbit, right-drag to pan, and scroll to zoom.
- The native editor uses standard Tab navigation. View presets and zoom buttons work with the keyboard.

## Supported language

This is an original Logo-inspired app with a small explicit command subset. It does **not** implement the full original Logomocja language or import classic project files. Named numeric procedures are supported. Global variables, arithmetic expressions and recursion are outside this version.

Keywords ignore case. Corresponding accented Polish spellings also work. Numeric arguments are finite signed decimal literals, for example `80`, `-12.5` or `.5`. Semicolons start line comments. Brackets enclose repeat bodies, including nested repeats.

| Polish | English | Meaning |
| --- | --- | --- |
| `np`, `naprzod`, `naprzód` | `fd`, `forward` | Move forward |
| `ws`, `wstecz` | `bk`, `back` | Move backward |
| `pw`, `prawo` | `rt`, `right` | Turn right by degrees |
| `lw`, `lewo` | `lt`, `left` | Turn left by degrees |
| `pod`, `podnies`, `podnieś` | `pu`, `penup` | Raise pen |
| `opu`, `opusc`, `opuść` | `pd`, `pendown` | Lower pen |
| `kolor "#16866a"` | `color "#16866a"` | Set six-digit hex color |
| `grubosc 3`, `grubość 3` | `width 3` | Set integer stroke width, 1–12 pixels |
| `powtorz 4 [ … ]`, `powtórz` | `repeat` | Repeat a bracketed body |
| `gora 90`, `góra` | `pitchup` | Pitch upward in 3D |
| `dol 90`, `dół` | `pitchdown` | Pitch downward in 3D |

```logo
; A square in either mode
kolor "#16866a"
grubosc 3
powtorz 4 [np 100 pw 90]
```

```logo
; A staircase in 3D
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]
```

The turtle starts at the origin, facing +Y with the pen down. The XY plane is shared between modes; +Z points upward. Right turns clockwise when viewed from above. Spatial turns rotate the turtle's local frame. Flat programs generate identical coordinates in both modes; pitch commands are rejected in 2D.

Errors identify a line and column. Parse errors preserve the prior drawing. Runtime errors stop at the last valid state. Work is bounded to 50,000 source characters, 10,000 tokens, depth 32, repeat counts 0–10,000, 10,000 execution operations including loop and procedure bookkeeping, 10,000 segments, and coordinates within ±100,000. Limits prevent nested empty loops from freezing the interface.

## Local drafts

The app saves only source drafts and selected mode to `localStorage` under `logomocja.drafts.v1`. Saves are debounced and flushed when the page closes. Reload never automatically executes code. Drafts remain in this browser; they are not synced or sent elsewhere. If storage is denied or full, the editor stays usable and shows an unsaved notice. Copy your code before closing in that case.

## Checks

```sh
bun run lint
bun run typecheck
bun run test
bun run build
bunx playwright install chromium
bun run test:e2e
```

`bun run test` runs the existing Vitest suite.

Unit tests cover grammar, geometry, local 3D rotations, aliases, pen styles, bounds, all examples and draft recovery. Browser tests cover actual canvas output, spatial drawing, camera interaction, controls, cancellation, reload, denied storage, missing WebGL2, keyboard navigation and layouts at 1440px/390px. Screenshots go into ignored `output/playwright/`.

Browser verification uses Chromium with software WebGL rendering. Physical GPU/other-browser coverage is separate. The production build warns about the main UI chunk (approximately 508 kB minified / 165 kB gzip) and the Three.js chunk (approximately 585 kB minified / 146 kB gzip). Three.js loads only in 3D mode.

## Structure

`src/logo/` owns parsing and a lazy, finite executor independent of React/Three.js. React schedules cancellable animation frames and owns the controls. Segment records feed Canvas2D or batched Three.js thick-line geometry. Renderer teardown disposes GPU resources, controls, observers and the WebGL context. UI styling combines semantic CSS with scoped Tailwind utilities and the existing font stack.

## Navigation and local practice

The app has real routes: `/` (studio), `/examples`, `/commands`, `/challenges` and `/challenges/:slug`. The ordinary build uses BrowserRouter and needs a static host that serves `index.html` for unknown paths. The Pages build uses hash routes such as `/Logomocja/#/challenges`, so deep links and refresh work without server rewrites. `/#examples` redirects to the examples page. Leaving the studio pauses playback and retains its runtime/drawing while navigating; reloading restores sources only.

Named Logo procedures list parameters after `ma:`, separated by commas. The name and complete parameter list stay on the same header line; the body follows on later lines and ends with a standalone `już` (also `juz`, or `to`/`end`). Use `oto name` without `ma:` for a procedure with no parameters.

```logo
oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90
```

Calls still take positional values separated by whitespace. Parameters are local to the current procedure and can replace numbers in commands, repeat counts and helper calls. Names ignore case. Legacy headers such as `oto kwadrat :bok` and references such as `:bok` remain supported; plain references work in either header form. Recursion, arithmetic and globals are outside this grammar. Definitions are validated even when unused. Execution remains bounded and cancellable.

Six original practice tasks take procedure-only submissions and test geometry against varied inputs. Checks compare unions of collinear segments, accepting reversed, subdivided and retraced strokes. Test cases are local practice checks, not protected competition infrastructure. Drafts and historical completion stay in this browser under separate storage from studio drafts; there are no accounts or leaderboard.

Light/dark mode follows the operating system until a manual choice. The choice persists under `logomocja.theme.v1`; denied storage still permits a session choice. Theme changes preserve drawing data, playback and camera view.

## Components and versions

Controls use the authentic shadcn Base UI `base-nova` registry sources in `src/components/ui`; `src/components/reui/frame.tsx` comes from the public free ReUI Frame registry. Imports, icons, translations, orientation attributes and sidebar preference behavior are adapted to this app and the installed Base UI API. Tailwind utilities are layered without importing its broad preflight reset. `components.json` records registry paths and aliases.

The sidebar displays the version imported from `package.json`. Run `bun run changeset` to describe a change, `bun run changeset:status` to inspect pending releases, and `bun run changeset:version` when intentionally updating the local version and refreshing bun.lock. Changesets versions the private app without npm publication; the release workflow creates the version tag after Pages deployment succeeds. The pending minor changeset proposes `0.2.0`, while the current app remains `0.1.0`.


## GitHub Actions and releases

- **PR checks**: one Ubuntu Validation job installs with Bun's frozen lockfile, checks a newly added changeset, and runs lint, type checking and unit tests. An empty changeset is valid for maintenance. Existing pending changesets do not satisfy a new PR's requirement.
- **Version PR**: main pushes with pending releases open/update `changeset-release/main`. Changesets updates the package version/changelog, consumes changesets and refreshes the Bun lockfile. The built-in GitHub token dispatches validation on the exact version-PR head; verified version PRs are exempt only from adding another changeset.
- **Release**: merging the automation version PR automatically dispatches a second Release run on `main`, where the `github-pages` environment permits deployment. The merge run only dispatches; the main run verifies the merged PR, runs checks, builds Pages and runs Chromium acceptance against the static output. Successful Pages deployment is followed by `v<version>`, a GitHub Release with changelog notes and a ZIP of that same build. Ordinary PR merges do not deploy. No npm publication or extra secret is needed.

Pages uses GitHub Actions as its source. The published URL is [Logomocja](https://yis-company.github.io/Logomocja/). The version displayed in the sidebar comes from the released package version. Browser drafts stay on their own origin; localhost drafts are separate from published-site drafts.

To verify the Pages build locally:

```sh
bun run build:pages
bun run test:pages
```

The Pages test server serves only actual files under `/Logomocja/`, with no SPA fallback. It uses port 5182, separately from development. The release suite checks assets, routes/history/refresh, legacy links, dark mode, procedures, stepping, lazy WebGL and challenge solutions. The full development browser suite remains available with `bun run test:e2e`.

Retry a failed release using the Release workflow's manual dispatch with the **merged Changesets PR number** on main. The workflow resolves its merge SHA, verifies version metadata and tag ownership, and rejects older releases superseded by a newer version. It builds once, safely reuses matching tags/releases and replaces matching ZIP assets. An arbitrary ref or ordinary merged PR cannot trigger publication.

After merging the workflow setup PR, merge the generated version PR to publish the first `0.2.0` release. Workflow setup itself does not publish. Branch protection and required-check settings are managed separately.
