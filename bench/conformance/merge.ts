// Merges several case files into one suite, dropping later duplicates by mode and source.
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { type Case, parseSuite } from "./compare";

export function mergeSuites(files: Record<string, Case[]>): { cases: Case[]; dropped: { file: string; name: string; duplicateOf: string }[] } {
  const seen = new Map<string, string>();
  const cases: Case[] = [];
  const dropped: { file: string; name: string; duplicateOf: string }[] = [];
  for (const [file, suite] of Object.entries(files))
    for (const c of suite) {
      const key = `${c.mode}\n${c.source}`;
      const earlier = seen.get(key);
      if (earlier) dropped.push({ file, name: c.name, duplicateOf: earlier });
      else {
        seen.set(key, `${file}: ${c.name}`);
        cases.push({ ...c, name: `${file}: ${c.name}` });
      }
    }
  return { cases, dropped };
}

if (import.meta.main) {
  const [out, ...inputs] = process.argv.slice(2);
  if (!out || !inputs.length) {
    console.error("Usage: bun bench/conformance/merge.ts <combined.json> <cases.json>...");
    process.exit(2);
  }
  const files = Object.fromEntries(
    inputs.map((path) => [basename(path, ".json"), parseSuite(JSON.parse(readFileSync(path, "utf8")))]),
  );
  const { cases, dropped } = mergeSuites(files);
  writeFileSync(out, `${JSON.stringify({ version: 2, cases }, null, 1)}\n`);
  for (const d of dropped) console.error(`dropped ${d.file}: ${d.name} (duplicate of ${d.duplicateOf})`);
  console.error(`${cases.length} cases written to ${out}, ${dropped.length} duplicates dropped`);
}
