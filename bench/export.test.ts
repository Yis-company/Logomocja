import { chmodSync, mkdirSync, mkdtempSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { shareExport } from "./export";

const mode = (path: string) => statSync(path).mode & 0o777;

it("opens a restrictive nested export to the host group only, so the host can delete it", () => {
  const out = mkdtempSync(join(tmpdir(), "logomocja-export-"));
  const tree = ["dist", "dist/assets", "dist/fonts"];
  for (const dir of tree) mkdirSync(join(out, dir));
  const files = ["transcript.jsonl", "dist/index.html", "dist/assets/app.js", "dist/fonts/a.woff2"];
  for (const file of files) writeFileSync(join(out, file), "x");
  for (const file of files) chmodSync(join(out, file), 0o600);
  for (const dir of tree) chmodSync(join(out, dir), 0o700);
  chmodSync(out, 0o770);

  shareExport(out);

  for (const dir of tree) expect(mode(join(out, dir))).toBe(0o770);
  for (const file of files) expect(mode(join(out, file))).toBe(0o640);
  expect(mode(out)).toBe(0o770);
  expect(statSync(join(out, "dist/assets")).gid).toBe(statSync(out).gid);
  rmSync(out, { recursive: true });
});

it("rejects links instead of following them out of the export", () => {
  const out = mkdtempSync(join(tmpdir(), "logomocja-export-"));
  mkdirSync(join(out, "dist"));
  symlinkSync("/etc/passwd", join(out, "dist/link"));
  expect(() => shareExport(out)).toThrow(/symbolic link/);
  rmSync(out, { recursive: true });
});
