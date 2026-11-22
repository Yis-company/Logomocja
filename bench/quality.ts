// Scores a run's generated source against the frozen q1 lint ruleset. Q counts complexity
// and defect findings; TypeScript-only findings are reported separately as `types`.
// Idempotent, so it is also the backfill.
// Usage: bun bench/quality.ts [--only <run-id>]
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import type { Quality, QualityFamily, RunResult } from "./result";

const root = fileURLToPath(new URL("..", import.meta.url));
const q1Config = join(root, "bench/quality/q1/oxlintrc.json");
const oxlint = join(root, "node_modules/.bin/oxlint");

const complexity = new Set(["eslint(max-depth)", "eslint(no-nested-ternary)"]);
// Anti-slop rules that only make sense with TypeScript syntax or, for no-runtime-typeof,
// whose type-guard exemption only TypeScript can use.
const typeOnlyAntiSlop = new Set(
  [
    "no-chained-type-assertions",
    "no-known-value-widening",
    "no-object-parameters",
    "no-runtime-typeof",
    "no-unknown-parameters",
    "no-unknown-returns",
    "no-unknown-type-aliases",
    "no-unsafe-dictionary-type",
    "no-widen-then-assert",
    "require-safety-comment-for-type-assertion",
  ].map((rule) => `anti-slop(${rule})`),
);

export function family(code: string): QualityFamily {
  if (complexity.has(code)) return "complexity";
  if (code.startsWith("typescript(") || typeOnlyAntiSlop.has(code))
    return "types";
  return "defects";
}

const skippedDirs = new Set([
  "node_modules",
  "dist",
  "tests",
  "test",
  "__tests__",
  "scripts",
  "e2e",
]);

/** Product source only: no tests, configs, build scripts or declaration files. */
export function productFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((path) => {
      const name = basename(path);
      return (
        /\.(ts|tsx|js|jsx|mjs)$/.test(name) &&
        !/\.(test|spec|config)\.|\.d\.ts$|^build\./.test(name) &&
        !path.split("/").some((part) => skippedDirs.has(part))
      );
    })
    .sort();
}

const unavailable = (
  reason: Extract<Quality, { q: null }>["reason"],
): Quality => ({ version: "q1", q: null, reason });

export function scoreSource(dir: string, config = q1Config): Quality {
  const files = productFiles(dir);
  if (files.length === 0) return unavailable("no source");
  const lint = spawnSync(
    oxlint,
    ["-c", config, "--disable-nested-config", "--format", "json", ...files],
    {
      cwd: dir,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  let diagnostics: { code: string }[];
  try {
    diagnostics = (
      JSON.parse(lint.stdout) as { diagnostics: { code: string }[] }
    ).diagnostics;
  } catch {
    return unavailable("scan failed");
  }
  const rules: Record<string, number> = {};
  const families: Record<QualityFamily, number> = {
    complexity: 0,
    defects: 0,
    types: 0,
  };
  for (const { code } of diagnostics) {
    rules[code] = (rules[code] ?? 0) + 1;
    families[family(code)] += 1;
  }
  const language = files.some((file) => /\.tsx?$/.test(file)) ? "ts" : "js";
  const loc = files.reduce(
    (sum, file) =>
      sum +
      readFileSync(join(dir, file), "utf8")
        .split("\n")
        .filter((line) => line.trim()).length,
    0,
  );
  return {
    version: "q1",
    q: families.complexity + families.defects,
    types: language === "ts" ? families.types : null,
    families,
    rules: Object.fromEntries(
      Object.entries(rules).sort(([a], [b]) => a.localeCompare(b)),
    ),
    loc,
    language,
    files,
  };
}

function sourceRef(id: string) {
  return [`build/${id}`, `origin/build/${id}`].find(
    (ref) =>
      spawnSync(
        "git",
        ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`],
        { cwd: root },
      ).status === 0,
  );
}

export function scoreRun(result: Pick<RunResult, "id" | "task">): Quality {
  if (result.task !== "app") return unavailable("not an app task");
  const ref = sourceRef(result.id);
  if (!ref) return unavailable("no source");
  const dir = mkdtempSync(join(tmpdir(), "logomocja-quality-"));
  try {
    const archive = spawnSync("git", ["archive", ref], {
      cwd: root,
      maxBuffer: 512 * 1024 * 1024,
    });
    const extract = spawnSync("tar", ["-x", "-C", dir], {
      input: archive.stdout,
    });
    if (archive.status !== 0 || extract.status !== 0)
      return unavailable("scan failed");
    return scoreSource(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (import.meta.main) {
  const { values } = parseArgs({ options: { only: { type: "string" } } });
  const resultsDir = join(root, "bench/results");
  for (const id of readdirSync(resultsDir).sort()) {
    const file = join(resultsDir, id, "result.json");
    if ((values.only && id !== values.only) || !existsSync(file)) continue;
    const result = JSON.parse(readFileSync(file, "utf8")) as RunResult;
    result.quality = scoreRun(result);
    writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`);
    const { quality } = result;
    console.error(
      `${id}: ${quality.q === null ? quality.reason : `Q ${quality.q}, types ${quality.types ?? "—"}`}`,
    );
  }
}
