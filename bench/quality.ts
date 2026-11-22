// Scores a run's generated source against the frozen q1 lint ruleset. Q counts complexity
// and defect findings; TypeScript-only findings are reported separately as `types`.
// Idempotent, so it is also the backfill.
// Usage: bun bench/quality.ts [--only <run-id>]
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
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

// Never product source, wherever they appear.
const skippedAnywhere = new Set(["node_modules", "dist", "__tests__"]);
// Test and tooling folders at the project root; under src/ the same names can hold app code.
const skippedAtRoot = new Set(["tests", "test", "scripts", "e2e"]);
const sourceFile = /\.([cm]?[jt]s|[jt]sx)$/;
const nonProductFile = /\.(test|spec|config)\.|\.d\.[cm]?ts$/;
const disableDirective =
  /\/\*\s*(?:eslint|oxlint)-disable[\s\S]*?\*\/|\/\/\s*(?:eslint|oxlint)-disable.*$/gm;

/** Product source only: regular files, no tests, configs, build scripts or declaration files. */
export function productFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)))
    .filter((path) => {
      const parts = path.split("/");
      const name = parts[parts.length - 1];
      return (
        sourceFile.test(name) &&
        !nonProductFile.test(name) &&
        !(parts.length === 1 && name.startsWith("build.")) &&
        !skippedAtRoot.has(parts[0]) &&
        !parts.some((part) => skippedAnywhere.has(part))
      );
    })
    .sort();
}

const unavailable = (
  reason: Extract<Quality, { q: null }>["reason"],
): Quality => ({ version: "q1", q: null, reason });

/**
 * Lints a copy of the product files with lint-disable comments removed, so generated
 * code cannot hide its own findings. Any failure is "scan failed", never a zero.
 */
export function scoreSource(dir: string, config = q1Config): Quality {
  const files = productFiles(dir);
  if (files.length === 0) return unavailable("no source");
  const copy = mkdtempSync(join(tmpdir(), "logomocja-quality-src-"));
  try {
    let loc = 0;
    for (const file of files) {
      const text = readFileSync(join(dir, file), "utf8").replace(
        disableDirective,
        "",
      );
      loc += text.split("\n").filter((line) => line.trim()).length;
      mkdirSync(dirname(join(copy, file)), { recursive: true });
      writeFileSync(join(copy, file), text);
    }
    const lint = spawnSync(
      oxlint,
      ["-c", config, "--disable-nested-config", "--format", "json", ...files],
      { cwd: copy, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    const { diagnostics } = JSON.parse(lint.stdout) as {
      diagnostics: { code?: string }[];
    };
    const rules: Record<string, number> = {};
    const families: Record<QualityFamily, number> = {
      complexity: 0,
      defects: 0,
      types: 0,
    };
    for (const { code } of diagnostics) {
      // A diagnostic without a rule is a parse error: the file was not fully linted.
      if (!code) return unavailable("scan failed");
      rules[code] = (rules[code] ?? 0) + 1;
      families[family(code)] += 1;
    }
    const language = files.some((file) => /\.[cm]?tsx?$/.test(file))
      ? "ts"
      : "js";
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
  } catch {
    return unavailable("scan failed");
  } finally {
    rmSync(copy, { recursive: true, force: true });
  }
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
