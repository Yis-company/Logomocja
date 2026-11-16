import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";

/** What one run has durably reached, kept beside the queue state that launched it. */
export type Receipt = {
  id: string;
  transcript: string;
  phase?: "container" | "import" | "finalized" | "done";
  artifacts?: { result: string; build?: string; branch?: string };
  outcome?: string;
  cleanup?: "ok" | { error: string };
};

/** Merge a change into the receipt with one atomic rename. */
export function record(file: string, change: Partial<Receipt>): Receipt {
  const current = existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as Receipt) : {};
  const next = { ...current, ...change } as Receipt;
  writeFileSync(`${file}.tmp`, `${JSON.stringify(next, null, 2)}\n`);
  renameSync(`${file}.tmp`, file);
  return next;
}
