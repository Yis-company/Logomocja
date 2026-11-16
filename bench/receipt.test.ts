import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { record } from "./receipt";

it("merges each phase into one receipt without leaving a partial file", () => {
  const file = join(mkdtempSync(join(tmpdir(), "logomocja-receipt-")), "1.run.json");
  record(file, { id: "run", transcript: "t", phase: "container" });
  record(file, { phase: "finalized", outcome: "completed", artifacts: { result: "r" } });
  record(file, { phase: "done", cleanup: { error: "EACCES" } });
  expect(JSON.parse(readFileSync(file, "utf8"))).toEqual({
    id: "run",
    transcript: "t",
    phase: "done",
    outcome: "completed",
    artifacts: { result: "r" },
    cleanup: { error: "EACCES" },
  });
  expect(existsSync(`${file}.tmp`)).toBe(false);
});
