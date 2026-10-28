import { describe, expect, test } from "bun:test";
import { run } from "../src/lang/interp";
import { EXAMPLES } from "../src/examples";

const r2 = (s: string) => run(s, "2d");
const r3 = (s: string) => run(s, "3d");
const ends = (s: string, mode: "2d" | "3d" = "2d") => {
  const res = run(s, mode);
  expect(res.error).toBeNull();
  const last = res.segments[res.segments.length - 1]!;
  return last.to.map((v) => Math.round(v * 1e6) / 1e6);
};
const err = (s: string, mode: "2d" | "3d" = "2d") => {
  const res = run(s, mode);
  expect(res.error).not.toBeNull();
  return res;
};

describe("standard programs", () => {
  for (const ex of EXAMPLES) {
    test(`${ex.id} runs without error`, () => {
      const res = run(ex.source, ex.mode);
      expect(res.error).toBeNull();
      expect(res.segments.length).toBeGreaterThan(0);
    });
  }
  test("kwadrat draws a closed square", () => {
    const res = r2(EXAMPLES[0]!.source);
    expect(res.segments.map((s) => s.to)).toEqual([[0, 120, 0], [120, 120, 0], [120, 0, 0], [0, 0, 0]]);
    expect(res.segments[0]).toEqual({ from: [0, 0, 0], to: [0, 120, 0], color: "#16866a", width: 3 });
  });
  test("flat programs are identical in 2D and 3D", () => {
    for (const ex of EXAMPLES.filter((e) => e.mode === "2d")) expect(r3(ex.source)).toEqual(r2(ex.source));
  });
  test("examples have no trailing newline and 13 entries", () => {
    expect(EXAMPLES.length).toBe(13);
    for (const e of EXAMPLES) expect(e.source.endsWith("\n")).toBe(false);
  });
});

describe("expressions", () => {
  test("precedence and associativity", () => {
    expect(ends("np 20 - 5 - 3")).toEqual([0, 12, 0]);
    expect(ends("np 2 + 3 * 4")).toEqual([0, 14, 0]);
    expect(ends("np 100 / 5 / 2")).toEqual([0, 10, 0]);
  });
  test("whitespace rule", () => {
    expect(ends("np 10 - 5")).toEqual([0, 5, 0]);
    expect(ends("np 10-5")).toEqual([0, 5, 0]);
    const e = err("np 10 -5");
    expect(e.error!.line).toBe(1);
    expect(e.error!.column).toBe(7);
    expect(e.segments).toEqual([]);
    expect(err("np 10 *5").error!.column).toBe(7);
  });
  test("unary signs", () => {
    expect(ends("np -(3 - 5)")).toEqual([0, 2, 0]);
    expect(ends("np - -2")).toEqual([0, 2, 0]);
    expect(ends("niech bok 4\nnp -bok")).toEqual([0, -4, 0]);
    expect(ends("np +3")).toEqual([0, 3, 0]);
  });
  test("bad numbers", () => {
    for (const s of ["np 1e3", "np 0x10", "np NaN", "np Infinity"]) expect(err(s).error!.column).toBe(4);
  });
  test(".5 is a number", () => {
    expect(ends("np .5")).toEqual([0, 0.5, 0]);
  });
  test("exact comparisons", () => {
    expect(r2("jeśli 0.1 + 0.2 = 0.3 [np 10]").segments).toEqual([]);
    expect(r2("jeśli 0.5 + 0.25 = 0.75 [np 10]").segments.length).toBe(1);
    expect(r2("jeśli 1 <> 2 [np 10]").segments.length).toBe(1);
    expect(r2("jeśli 2 <= 2 [np 10]").segments.length).toBe(1);
    expect(r2("jeżeli 2 >= 3 [np 10] [np 20]").segments[0]!.to).toEqual([0, 20, 0]);
  });
  test("division by zero is a run-time error at the argument", () => {
    const res = r2("np 10\nnp 5 / (2 - 2)");
    expect(res.error).toMatchObject({ line: 2, column: 4 });
    expect(res.segments.length).toBe(1);
  });
  test("non-finite result", () => {
    const res = r2("niech a 99999999999999999999\nniech b a * a * a * a * a * a * a * a * a * a * a * a * a * a * a * a\nnp 1");
    expect(res.error!.line).toBe(2);
  });
});

describe("turtle", () => {
  test("turns", () => {
    expect(ends("pw 90 np 10")).toEqual([10, 0, 0]);
    expect(ends("lw 90 np 10")).toEqual([-10, 0, 0]);
    expect(ends("pw -90 np 10")).toEqual([-10, 0, 0]);
    expect(ends("ws 10")).toEqual([0, -10, 0]);
  });
  test("3D pitch and roll", () => {
    expect(ends("gora 90 np 10", "3d")).toEqual([0, 0, 10]);
    expect(ends("dol 90 np 10", "3d")).toEqual([0, 0, -10]);
    // after pp 90 up is former right: gora 90 goes +X
    expect(ends("pp 90 gora 90 np 10", "3d")).toEqual([10, 0, 0]);
    // after pp 90 right is former down: pw 90 goes -Z
    expect(ends("pp 90 pw 90 np 10", "3d")).toEqual([0, 0, -10]);
    expect(ends("pl 90 pw 90 np 10", "3d")).toEqual([0, 0, 10]);
  });
  test("pitch/roll are errors in 2D", () => {
    for (const c of ["gora", "dol", "pp", "pl", "góra", "dół", "pitchup", "rollleft"]) {
      const res = r2(`np 10\n${c} 10`);
      expect(res.error).toMatchObject({ line: 2, column: 1 });
      expect(res.segments).toEqual([]);
    }
  });
  test("pen, colour and width", () => {
    const res = r2('pod np 10 opu kolor "#ABCDEF" grubosc 7 np 10');
    expect(res.segments).toEqual([{ from: [0, 10, 0], to: [0, 20, 0], color: "#abcdef", width: 7 }]);
  });
  test("zero move draws nothing", () => {
    expect(r2("np 0").segments).toEqual([]);
  });
  test("home draws and resets orientation", () => {
    const res = r2("pw 90 np 10 dom np 5");
    expect(res.segments.map((s) => s.to)).toEqual([[10, 0, 0], [0, 0, 0], [0, 5, 0]]);
    expect(r2("dom").segments).toEqual([]);
  });
  test("clear screen", () => {
    const res = r2("np 10 czyść np 5");
    expect(res.segments).toEqual([{ from: [0, 10, 0], to: [0, 15, 0], color: "#16866a", width: 3 }]);
    const e = r2("np 10 czysc np 5 np 1 / 0");
    expect(e.segments.length).toBe(1);
    expect(e.error).not.toBeNull();
  });
  test("aliases and case", () => {
    expect(ends("FORWARD 10 RT 90 Naprzód 5")).toEqual([5, 10, 0]);
    expect(ends("powtórz 2 [fd 1]")).toEqual([0, 2, 0]);
  });
});

describe("repeat & variables", () => {
  test("nrpowt", () => {
    expect(ends("powtorz 3 [np nrpowt]")).toEqual([0, 6, 0]);
    expect(ends("powtorz 2 [powtorz 3 [np nrpowt] np repcount * 10]")).toEqual([0, 42, 0]);
  });
  test("nrpowt outside repeat is a parse error", () => {
    expect(err("np 1\nnp nrpowt").segments).toEqual([]);
    const e = err("oto a\nnp nrpowt\njuż\npowtorz 2 [a]");
    expect(e.error).toMatchObject({ line: 2, column: 4 });
  });
  test("repeat count checks", () => {
    expect(err("powtorz 10001 [np 1]").error!.column).toBe(9);
    expect(err("powtorz 2.5 [np 1]").error!.column).toBe(9);
    expect(r2("powtorz 0 [np 1]")).toEqual({ segments: [], error: null });
    const res = r2("np 1\nniech n -1\npowtorz n [np 1]");
    expect(res.error).toMatchObject({ line: 3, column: 9 });
    expect(res.segments.length).toBe(1);
  });
  test("width checks", () => {
    expect(err("np 1 grubosc 13").segments).toEqual([]);
    expect(err("grubosc 0").error!.column).toBe(9);
    expect(err("grubosc 1.5").error!.column).toBe(9);
    const res = r2("np 1\nniech g 20\ngrubosc g");
    expect(res.error).toMatchObject({ line: 3, column: 9 });
    expect(res.segments.length).toBe(1);
  });
  test("undeclared name is a parse error", () => {
    expect(err("np 1 np x").error).toMatchObject({ line: 1, column: 9 });
  });
  test("global declared later; unassigned read is run-time error at arg start", () => {
    const res = r2("np 1\nnp 2 + x\nniech x 5");
    expect(res.error).toMatchObject({ line: 2, column: 4 });
    expect(res.segments.length).toBe(1);
  });
  test("legacy :name", () => {
    expect(ends("niech a 7 np :a")).toEqual([0, 7, 0]);
  });
  test("variable names may not be commands or procedures", () => {
    err("niech np 5");
    err("oto f\nnp 1\njuż\nniech f 1");
  });
  test("locals shadow globals and are discarded", () => {
    const src = `niech x 10
oto f
  np x
  niech x 1
  np x
już
f
np x`;
    expect(r2(src).segments.map((s) => s.to[1])).toEqual([10, 11, 21]);
  });
});

describe("procedures", () => {
  test("basic call, forward reference, expression args", () => {
    const src = `kwadrat 40 * 2 90
oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już`;
    const res = r2(src);
    expect(res.error).toBeNull();
    expect(res.segments[0]!.to).toEqual([0, 80, 0]);
  });
  test("legacy header", () => {
    expect(ends("oto kw :bok :kąt\npowtorz 4 [np :bok pw kąt]\njuż\nKW 10 90")).toEqual([0, 0, 0]);
  });
  test("parameter sharing a procedure name", () => {
    expect(ends("oto a ma: b\nnp b\njuż\noto b ma: a\na a + 1\njuż\nb 4")).toEqual([0, 5, 0]);
  });
  test("wrong arg count", () => {
    expect(err("oto a ma: x, y\nnp x\njuż\na 1").error).toMatchObject({ line: 4, column: 1 });
    expect(err("oto a ma: x, y\nnp x\njuż\npowtorz 1 [a 1]").error).toMatchObject({ line: 4, column: 15 });
  });
  test("definitions errors", () => {
    expect(err("powtorz 2 [\noto a\nnp 1\njuż\n]").error).toMatchObject({ line: 2, column: 1 });
    expect(err("oto a\nnp 1\noto b\nnp 1\njuż").error).toMatchObject({ line: 3, column: 1 });
    expect(err("oto a\nnp 1").error).toMatchObject({ line: 1, column: 1 });
    expect(err("oto a\njuż\noto a\njuż").error).toMatchObject({ line: 3, column: 5 });
  });
  test("stop ends the call, also from inside a repeat", () => {
    expect(ends("oto a\npowtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\nnp 100\njuż\na np 10")).toEqual([0, 12, 0]);
    expect(ends("np 1 powtorz 3 [np 1 stop] np 5")).toEqual([0, 2, 0]);
  });
  test("recursion frame limit", () => {
    const res = r2("oto a ma: n\nnp 1\na n + 1\njuż\na 1");
    expect(res.error!.message).toContain("32");
    expect(res.segments.length).toBe(32);
  });
});

describe("errors & limits", () => {
  test("unknown command, stray value, brackets", () => {
    expect(err("np 1\n  foo 3").error).toMatchObject({ line: 2, column: 3 });
    expect(err("np 1 5").error).toMatchObject({ column: 6 });
    expect(err("powtorz 2 [np 1").error).toMatchObject({ column: 11 });
    expect(err("np 1 ]").error).toMatchObject({ column: 6 });
    expect(err("np (1 + 2").error).toMatchObject({ column: 4 });
    expect(err("powtorz 2 [np]").error).toMatchObject({ column: 14 });
    expect(err("np").error).toMatchObject({ column: 1 });
  });
  test("colour errors", () => {
    expect(err('kolor "#12345"').error!.column).toBe(7);
    expect(err("kolor 5").error!.column).toBe(7);
    expect(err('kolor "#zzzzzz"').error!.column).toBe(7);
  });
  test("ops limit", () => {
    const res = r2("powtorz 10000 [pw 1]");
    expect(res.error!.message).toContain("operacji");
    expect(r2("powtorz 4999 [pw 1]").error).toBeNull();
    expect(r2("powtorz 5000 [pw 1]").error).not.toBeNull();
  });
  test("segment and coordinate limits", () => {
    expect(r2("powtorz 2 [powtorz 3000 [np 1]]").error!.message).toContain("operacji");
    expect(r2("np 100000").error).toBeNull();
    const c = r2("np 50000 np 60000");
    expect(c.error).not.toBeNull();
    expect(c.segments.length).toBe(1);
  });
  test("nesting limit", () => {
    const deep = (n: number) => "powtorz 1 [".repeat(n) + "np 1" + "]".repeat(n);
    expect(r2(deep(32)).error).toBeNull();
    expect(err(deep(33)).segments).toEqual([]);
    const ifs = (n: number) => "jeśli 1 = 1 [".repeat(n) + "np 1" + "]".repeat(n);
    expect(r2(ifs(32)).error).toBeNull();
    expect(r2(ifs(33)).error).not.toBeNull();
  });
  test("source and token limits", () => {
    expect(err("np 1 ".repeat(5001)).error!.message).toContain("elementów");
    expect(err(";".repeat(50001)).error!.message).toContain("długi");
  });
});
