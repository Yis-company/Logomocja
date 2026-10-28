// Re-runs the conformance suites against every built app of a prompt version and
// rewrites the scores in its results, for when the suites or the runner change.
// Usage: bun bench/rescore.ts [--prompt v2] [--only <run-id>]
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { runConformance } from "./conformance/run";
import type { RunResult } from "./result";

const root = fileURLToPath(new URL("..", import.meta.url));
const { values } = parseArgs({ options: { prompt: { type: "string", default: "v2" }, only: { type: "string" } } });
const resultsDir = join(root, "bench/results");
const suitesDir = join(root, "bench/conformance", values.prompt);
for (const id of readdirSync(resultsDir).sort()) {
  if (values.only && id !== values.only) continue;
  const file = join(resultsDir, id, "result.json");
  if (!existsSync(file)) continue;
  const result = JSON.parse(readFileSync(file, "utf8")) as RunResult;
  const buildDir = join(root, "builds", id);
  if (result.task !== "app" || result.prompt !== values.prompt || !result.verify?.built || !existsSync(buildDir)) continue;
  console.error(`rescoring ${id}`);
  const report = await runConformance(buildDir, `/Logomocja/builds/${id}/`, suitesDir);
  writeFileSync(join(resultsDir, id, "conformance.json"), `${JSON.stringify(report, null, 2)}\n`);
  result.conformance = Object.fromEntries(
    Object.entries(report.suites).map(([name, suite]) => [name, { passed: suite.passed, total: suite.total, hook: name.endsWith("@open") ? report.open : report.hook }]),
  );
  writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`);
  console.error(`  ${Object.entries(result.conformance).map(([n, s]) => `${n} ${s.passed}/${s.total}`).join(", ")}`);
}
