// The standard programs of a prompt version: shipped in every build, captured
// in the gallery, and the examples of the reference app.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Mode } from "../src/logo/types";

export type ProgramMeta = { id: string; mode: Mode; name: string; description: string; level: string };
export type StandardProgram = ProgramMeta & { source: string };

export function programsDir(version: string) {
  return join(import.meta.dirname, "prompts", version, "programs");
}

export function loadPrograms(version: string): StandardProgram[] {
  const dir = programsDir(version);
  const index = JSON.parse(readFileSync(join(dir, "index.json"), "utf8")) as ProgramMeta[];
  const files = new Set(readdirSync(dir).filter((name) => name.endsWith(".logo")));
  for (const meta of index) files.delete(`${meta.id}.logo`);
  if (files.size) throw new Error(`programs without index entry: ${[...files].join(", ")}`);
  return index.map((meta) => ({ ...meta, source: readFileSync(join(dir, `${meta.id}.logo`), "utf8").trimEnd() }));
}

export type ProgramOutcome = {
  segments: { from: [number, number, number]; to: [number, number, number]; color: string; width: number }[];
  error: null | { message: string; line: number; column: number };
};

/** Reference outcomes of the standard programs, as frozen in `expected.json`. */
export function loadExpected(version: string): Record<string, ProgramOutcome> {
  return JSON.parse(readFileSync(join(programsDir(version), "expected.json"), "utf8"));
}
