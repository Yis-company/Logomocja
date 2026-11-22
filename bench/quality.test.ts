import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { productFiles, scoreRun, scoreSource } from "./quality";

const fixtures = fileURLToPath(new URL("fixtures/quality/", import.meta.url));

function withTree(files: Record<string, string>, check: (dir: string) => void) {
  const dir = mkdtempSync(join(tmpdir(), "quality-tree-"));
  try {
    for (const [path, text] of Object.entries(files)) {
      mkdirSync(join(dir, path, ".."), { recursive: true });
      writeFileSync(join(dir, path), text);
    }
    check(dir);
  } finally {
    rmSync(dir, { recursive: true });
  }
}

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

  it("scans app code by its place in the project, not by folder name alone", () => {
    withTree(
      {
        "src/scripts/runner.ts": "export {};\n",
        "src/build.ts": "export {};\n",
        "src/worker.mts": "export {};\n",
        "build.ts": "export {};\n",
        "scripts/release.ts": "export {};\n",
        "tests/helper.ts": "export {};\n",
        "src/main.test.ts": "export {};\n",
        "src/vendor.js/readme.txt": "export {};\n",
      },
      (dir) => {
        symlinkSync("../missing.ts", join(dir, "src/link.ts"));
        expect(productFiles(dir)).toEqual([
          "src/build.ts",
          "src/scripts/runner.ts",
          "src/worker.mts",
        ]);
        expect(scoreSource(dir)).toMatchObject({ q: 0, language: "ts" });
      },
    );
  });

  it("counts findings that generated code tries to disable", () => {
    withTree(
      {
        "src/main.js":
          "/* eslint-disable */\ndebugger; // oxlint-disable-line no-debugger\n",
      },
      (dir) => expect(scoreSource(dir)).toMatchObject({ q: 1 }),
    );
  });

  it("reports a file oxlint cannot parse as a failed scan", () => {
    withTree({ "src/main.ts": "const a = (;\n" }, (dir) =>
      expect(scoreSource(dir)).toEqual({
        version: "q1",
        q: null,
        reason: "scan failed",
      }),
    );
  });
});
