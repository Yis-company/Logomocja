// Generates the stress suite of a prompt version: programs at the limits of the
// language, with expectations from the reference app and a time budget each.
// Usage: bun bench/conformance/stress.ts v2
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { run } from "../../src/hook";
import type { Case, Vec } from "./compare";

type Spec = { name: string; mode: "2d" | "3d"; source: string; budgetMs: number };
const ring = (n: number, step: number) => `powtorz ${n} [np ${step} pw ${360 / n}]`;
const nest = (depth: number, inner: string) => `${"powtorz 1 [".repeat(depth)}${inner}${"]".repeat(depth)}`;
const specs: Spec[] = [
  // Operation counts: a repeat costs 1 plus, per iteration, one per command and one for finishing the body.
  { name: "3,000 segments in a spiral", mode: "2d", source: "powtorz 30 [powtorz 100 [np 3 pw 3.6] pw 7.2]", budgetMs: 1500 },
  { name: "1,500 segments drawn, cleared, drawn again", mode: "2d", source: "powtorz 15 [powtorz 100 [np 2 pw 3.6]] czyść powtorz 15 [powtorz 100 [np 2 lw 3.6]]", budgetMs: 1500 },
  { name: "3,000 segments in 3D with pitch and roll", mode: "3d", source: "powtorz 30 [powtorz 100 [np 2 pw 3.6] gora 15 pp 20]", budgetMs: 1500 },
  { name: "recursion 32 deep with a repeat at every level", mode: "2d", source: "oto g ma: n\njeśli n = 32 [stop]\npowtorz 4 [np n pw 90]\ng n + 1\njuż\ng 1", budgetMs: 1000 },
  { name: "3,000 variable updates in a loop", mode: "2d", source: "niech a 0 niech b 1 powtorz 1500 [niech a a + b niech b a - b jeśli b > 1000 [niech b 1]] np a", budgetMs: 1000 },
  { name: "conditionals in a loop", mode: "2d", source: "niech k 0 niech p 1 powtorz 1200 [niech p -p jeżeli p > 0 [niech k k + 1] [niech k k - 2] jeśli k < -100 [niech k 0]] np k", budgetMs: 1000 },
  { name: "procedure called 2,000 times with expression arguments", mode: "2d", source: "oto k ma: a, b\nnp a * b - b\njuż\npowtorz 2000 [k nrpowt 0.001]", budgetMs: 1000 },
  { name: "32 nested repeats with a counter at the bottom", mode: "2d", source: nest(32, "np nrpowt"), budgetMs: 1000 },
  { name: "source of 49,999 characters", mode: "2d", source: `np 10 ;${"x".repeat(49_992)}`, budgetMs: 1000 },
  { name: "10,000 tokens exactly", mode: "2d", source: `powtorz 1 [${"pod ".repeat(9_996)}]`, budgetMs: 1000 },
  { name: "10,000 operations exactly", mode: "2d", source: "powtorz 4999 [pod] pod", budgetMs: 1000 },
  { name: "operation limit exceeded after 3,333 segments", mode: "2d", source: "powtorz 5000 [np 1 pw 1]", budgetMs: 1500 },
  { name: "coordinate limit reached at the far end of a long walk", mode: "2d", source: "powtorz 1000 [np 100] np 1", budgetMs: 1000 },
  { name: "state must not leak: declare a global", mode: "2d", source: "niech leak 5 np leak", budgetMs: 1000 },
  { name: "state must not leak: the global of the previous case is unknown", mode: "2d", source: "np leak", budgetMs: 1000 },
  { name: "state must not leak: define a procedure", mode: "2d", source: "oto resztka\nnp 7\njuż\nresztka", budgetMs: 1000 },
  { name: "state must not leak: the procedure of the previous case is unknown", mode: "2d", source: "resztka", budgetMs: 1000 },
  { name: "state must not leak: pen up at the end of a run", mode: "2d", source: "np 1 pod", budgetMs: 1000 },
  { name: "state must not leak: the next run starts with the pen down", mode: "2d", source: "np 1", budgetMs: 1000 },
  { name: "1,200 exact right angles keep the heading exact", mode: "2d", source: `powtorz 300 [${ring(4, 10)}] np 10`, budgetMs: 1500 },
  { name: "many small turns close a circle within tolerance", mode: "2d", source: "powtorz 1800 [np 0.2 pw 0.2]", budgetMs: 1500 },
  { name: "CRLF line endings and tabs separate tokens", mode: "2d", source: "oto k ma: b\r\n\tpowtorz 4 [np b\tpw 90]\r\njuż\r\nk 10\r\n", budgetMs: 1000 },
  { name: "unicode case folding of accented names", mode: "2d", source: "oto Żółw ma: Długość\nnp DŁUGOŚĆ\njuż\nżÓŁW 12", budgetMs: 1000 },
];
const version = process.argv[2] ?? "v2";
const cases: Case[] = specs.map((spec) => {
  const outcome = run(spec.source, spec.mode);
  // Six decimals is well inside the 0.0001 tolerance and keeps the file small.
  const round = (n: number) => Number(n.toFixed(6));
  const segments = outcome.segments.map((s) => ({ ...s, from: s.from.map(round) as Vec, to: s.to.map(round) as Vec }));
  // Limit errors: the spec does not pin the column, so only the line is checked.
  const expect: Case["expect"] = outcome.error ? { error: { line: outcome.error.line }, segments } : { segments };
  return { name: spec.name, mode: spec.mode, source: spec.source, expect, budgetMs: spec.budgetMs };
});
const out = join(import.meta.dirname, version, "stress.json");
writeFileSync(out, `${JSON.stringify({ version: 2, cases })}\n`);
for (const [i, c] of cases.entries()) console.error(`${c.name}: ${c.expect.segments?.length ?? 0} segments${c.expect.error ? `, error line ${c.expect.error.line}: ${run(specs[i].source, specs[i].mode).error?.message}` : ""}`);
console.error(`${cases.length} cases written to ${out}`);
