# Quality ruleset q1

Frozen. To change any rule, create `q2` and backfill; never compare scores across versions.

- `oxlintrc.json` names every rule explicitly (no categories), so an oxlint upgrade cannot add rules silently. oxlint and `@oxlint/plugins` are pinned to 1.94.0 in `package.json`.
- Sources: rules shared by Yi's linted projects (platform-app, ZhongXin, yitam.dev, skills-manager, huimiaofactory.com, GitHub-client, hub-huimiao), plus oxlint's correctness rules.
- `anti-slop/` is a snapshot of Yi's anti-slop oxlint plugin, copied from skills-manager commit `8aed9b9` (`tools/oxlint/anti-slop`), without its unregistered `effect/` plugin. See `anti-slop/UPSTREAM.md`.
- Families (`bench/quality.ts`): `complexity` is `max-depth` 3 and `no-nested-ternary`; `types` is every `typescript/*` rule plus the anti-slop rules that need TypeScript; everything else is `defects`. Q = complexity + defects. JavaScript apps get no types count.
- Removed before freezing: autofixable style (`require-readable-spacing`, `prefer-const`, `no-useless-escape`, `consistent-type-imports`, `import/no-duplicates`, `no-inferrable-types`) and false positives on correct benchmark code (`unicorn/no-thenable` on the Logo `if` node, `no-fallthrough` after `never` calls, `anti-slop/no-shape-in-symbol-names` on three.js `Shape`).
- `sonarjs/no-nested-conditional` was replaced by the native `no-nested-ternary`: the sonarjs plugin needs TypeScript's JavaScript API, which TypeScript 7 does not ship.

Q measures fit to this ruleset, which the agents never saw. Show it next to conformance and never fold it into a combined rank.
