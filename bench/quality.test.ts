import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { scoreRun, scoreSource } from "./quality";

const fixtures = fileURLToPath(new URL("fixtures/quality/", import.meta.url));

describe("q1 code-quality score", () => {
  it("counts complexity and defects in Q and TypeScript-only findings separately", () => {
    expect(scoreSource(join(fixtures, "ts"))).toMatchObject({
      q: 3,
      types: 2,
      families: { complexity: 2, defects: 1, types: 2 },
      language: "ts",
      files: ["src/main.ts"],
    });
  });

  it("gives equivalent JavaScript the same Q and no types penalty", () => {
    expect(scoreSource(join(fixtures, "js"))).toMatchObject({
      q: 3,
      types: null,
      language: "js",
    });
  });

  it("gives the same result on a repeat run", () => {
    expect(scoreSource(join(fixtures, "ts"))).toEqual(
      scoreSource(join(fixtures, "ts")),
    );
  });

  it("records missing source and failed scans as unavailable, never as zero", () => {
    const empty = mkdtempSync(join(tmpdir(), "quality-empty-"));
    try {
      expect(scoreSource(empty)).toEqual({
        version: "q1",
        q: null,
        reason: "no source",
      });
    } finally {
      rmSync(empty, { recursive: true });
    }
    expect(
      scoreSource(join(fixtures, "ts"), join(fixtures, "missing.json")),
    ).toEqual({
      version: "q1",
      q: null,
      reason: "scan failed",
    });
    expect(scoreRun({ id: "no-such-run", task: "app" })).toMatchObject({
      q: null,
      reason: "no source",
    });
    expect(scoreRun({ id: "no-such-run", task: "tests" })).toMatchObject({
      q: null,
      reason: "not an app task",
    });
  });
});
