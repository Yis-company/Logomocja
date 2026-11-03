disposition: fix

Review substituted in-thread under the brief's explicit limitation on delegated agents. Code-led Operate surface; no approved raster comp or catalog-world QUALITY BAR applies. Reviewed the supplied brief, PRODUCT.md, studio direction contract, craft floor, source, detector result and actual captures.

## persistence
Pass. PRODUCT.md and the surface contract exist. FORM records seed:f39f069f5115ae8e. No comp-led gates apply. Design documentation follows this review. Mechanical detector ran once on the changed UI and returned [].

## fidelity
| Element | Result | Evidence |
| --- | --- | --- |
| TYPE | Match | Local Manrope for UI and JetBrains Mono for actual code and coordinates. Compact Operate hierarchy; stronger guide headings. |
| MATERIAL | Match | Actual Canvas geometry, plain surfaces, thin structural dividers. No imitation material or raster obligations. |
| GROUND | Match | Sage shell, white canvas, dark green ink; full corresponding dark theme. |
| First viewport | Match | Library, numbered code, execution controls and large rendered rosette appear together at desktop widths. |
| Signature | Match | Each example thumbnail renders its actual program. |
| Responsive structure | Adaptation | Phone stacks the library, editor and canvas, preserving the required controls; brief requires desktop and phone use. 320, 390, 768, 1024, 1280 and 1440 widths have no document overflow. |
| Execution and errors | Match | Executing-line highlight, turtle marker, precise argument marker and Polish message; runtime stroke retained. Browser interactions checked independently. |
| 3D | Match | Spatial cube with XYZ ground grid, axes and turtle orientation; camera controls tested. |
| Reference | Match | Searchable Polish aliases and examples, language rules and limits; usable compact navigation on phones. |
| Challenge target | Contradicted | challenges.png has a tiny square; mobile-challenges.png collapses it almost to a dot. Fixed 60px fit padding is unsuitable for the small preview. |

## ceiling
Reached for the primary studio and guide: actual geometry carries the surface, native controls remain familiar, state and structure are restrained. Challenge preview scaling falls below the same functional precision.

## material_fixes
1. Use viewport-relative fit padding for small canvases, so challenge targets remain clearly recognizable at desktop and phone sizes. Recapture the same viewport set.

## keep
Keep the wide uncluttered drawing field, quiet sage shell, real program thumbnails, clear source/drawing pairing and complete keyboard semantics.

---

## verdict
Resolved: viewport-relative padding makes the challenge square clearly visible (roughly 85 px on desktop and 73 px on the phone) in the same recaptured challenges.png and mobile-challenges.png. Main desktop and phone drawing fits remain intact. The same viewport set was recaptured; keyboard focus is visibly outlined in step-focus.png. No regression from the fit correction was observed.

## remaining
Clear for the scored fix. This verdict pass covers that fix; the original matrix above remains the review scope. Documented system and sidecar were then extracted from the shipped CSS and controls.

disposition: ship

## Verification evidence
- `bun run test`: 207 passing tests, 0 failures.
- `bun run build`: TypeScript and static Vite build pass.
- Full browser workflow passes against both the development app and a plain Python static host at `/Logomocja/builds/x/`, built with that BASE_PATH. No rewrite rules.
- Browser workflow records no page errors and no external requests.
- Captures: desktop 1440 × 900; phone 390 × 844 (full page); widths 320, 768, 1024, 1280; dark, spatial, step/focus, error, challenges and guide states.
- Detector ran once, returned an empty finding list. No second detector pass.
- No MCP browser controls, image generation or external models used. Playwright CLI ran Chromium with local libraries extracted into /tmp after root installation was unavailable. This environment setup is not a shipping dependency.
