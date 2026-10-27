import { describe, expect, test } from "bun:test";
import { runProgram } from "../src/lang";
import { EXAMPLES, WELCOME } from "../src/ui/examples";

const run2 = (s: string) => runProgram(s, "2d");
const run3 = (s: string) => runProgram(s, "3d");
const ends = (s: string, mode: "2d" | "3d" = "2d") => runProgram(s, mode).segments.map((x) => x.to);

function expectError(src: string, line: number, column: number, mode: "2d" | "3d" = "2d") {
  const r = runProgram(src, mode);
  expect(r.error).not.toBeNull();
  expect({ line: r.error!.line, column: r.error!.column }).toEqual({ line, column });
  expect(r.error!.message.length).toBeGreaterThan(5);
  return r;
}

describe("geometry", () => {
  test("square from the brief", () => {
    const r = run2("oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90");
    expect(r.error).toBeNull();
    expect(r.segments).toEqual([
      { from: [0, 0, 0], to: [0, 80, 0], color: "#16866a", width: 3 },
      { from: [0, 80, 0], to: [80, 80, 0], color: "#16866a", width: 3 },
      { from: [80, 80, 0], to: [80, 0, 0], color: "#16866a", width: 3 },
      { from: [80, 0, 0], to: [0, 0, 0], color: "#16866a", width: 3 },
    ]);
  });

  test("left, back, negative angles", () => {
    expect(ends("lw 90 np 10")).toEqual([[-10, 0, 0]]);
    expect(ends("ws 10")).toEqual([[0, -10, 0]]);
    expect(ends("pw -90 np 10")).toEqual([[-10, 0, 0]]);
    expect(ends("pw 45 np 10")[0]![0]).toBeCloseTo(Math.SQRT1_2 * 10, 9);
  });

  test("zero move draws nothing; pen up moves without drawing", () => {
    expect(run2("np 0").segments).toEqual([]);
    const r = run2("pod np 10 opu np 5");
    expect(r.segments).toEqual([{ from: [0, 10, 0], to: [0, 15, 0], color: "#16866a", width: 3 }]);
  });

  test("pitch in 3D follows the up vector", () => {
    expect(ends("gora 90 np 10", "3d")).toEqual([[0, 0, 10]]);
    expect(ends("dol 90 np 10", "3d")).toEqual([[0, 0, -10]]);
    // after pitching up, the old heading is "down" for the up vector; right stays +X
    expect(ends("gora 90 pw 90 np 10", "3d")).toEqual([[10, 0, 0]]);
    // after gora 90, up is -Y; gora 90 again heads along -Y
    expect(ends("gora 90 gora 90 np 10", "3d")).toEqual([[0, -10, 0]]);
  });

  test("flat programs match in 2D and 3D", () => {
    for (const ex of [...EXAMPLES.filter((e) => e.mode === "2d").map((e) => e.source), WELCOME]) {
      expect(run3(ex)).toEqual(run2(ex));
    }
  });

  test("colour and width persist; colour is lowercased", () => {
    const r = run2('kolor "#ABCDEF" grubość 7 np 1 pw 90 np 1');
    expect(r.segments.map((s) => [s.color, s.width])).toEqual([
      ["#abcdef", 7],
      ["#abcdef", 7],
    ]);
  });
});

describe("lexical rules", () => {
  test("aliases and case-insensitivity", () => {
    const a = run2("NAPRZÓD 10 Prawo 90 forward 10 RT 90 fd 10");
    const b = run2("np 10 pw 90 np 10 pw 90 np 10");
    expect(a).toEqual(b);
    expect(run2("powtórz 2 [naprzod 5] REPEAT 1 [bk 1] podnieś opuść podnies opusc pu pd penup pendown lewo 1 left 1 lt 1 back 1 wstecz 1 width 2 grubosc 2 color \"#000000\"").error).toBeNull();
    expect(run3("góra 10 gora 10 dół 10 dol 10 pitchup 1 pitchdown 1").error).toBeNull();
  });

  test("number formats", () => {
    expect(ends("np .5")).toEqual([[0, 0.5, 0]]);
    expect(ends("np +3")).toEqual([[0, 3, 0]]);
    expect(ends("np -12.5")).toEqual([[0, -12.5, 0]]);
    expectError("np 1e3", 1, 4);
    expectError("np 0x10", 1, 4);
    expectError("np --5", 1, 4);
  });

  test("comments and brackets without spaces", () => {
    expect(run2("; komentarz\nnp 10 ; jeszcze\npowtorz 2[np 1]").segments.length).toBe(3);
  });
});

describe("procedures", () => {
  test("legacy header, :param references, definitions after calls", () => {
    const r = run2("kwadrat 80 90\noto kwadrat :bok :kąt\n  powtorz 4 [np :bok pw kąt]\nJUŻ");
    expect(r.error).toBeNull();
    expect(r.segments.length).toBe(4);
  });

  test("parameters as repeat counts and nested call arguments", () => {
    const r = run2("oto a ma: n, d\n powtorz n [b d]\njuż\noto b ma: x\n np x\nend\na 3 7");
    expect(r.error).toBeNull();
    expect(ends("oto a ma: n, d\n powtorz n [b d]\njuż\noto b ma: x\n np x\nend\na 3 7").at(-1)).toEqual([0, 21, 0]);
  });

  test("case-insensitive names and params", () => {
    expect(run2("TO Kw MA: Bok\nnp BOK\nend\nkw 5").segments.length).toBe(1);
  });

  test("errors", () => {
    expectError("oto a\nnp 1\njuż\noto A\nnp 2\njuż", 4, 5); // duplicate
    expectError("a\noto a\n a\njuż", 3, 2); // direct recursion, never called
    expectError("oto a\n b\njuż\noto b\n a\njuż", 2, 2); // indirect recursion
    expectError("oto k ma: x, y\nnp x\njuż\nk 1", 4, 1); // too few
    expectError("oto k ma: x\nnp x\njuż\nk 1 2", 4, 1); // too many
    expectError("powtorz 2 [\noto a\njuż\n]", 2, 1); // definition inside repeat
    expectError("oto a\noto b\njuż\njuż", 2, 1); // definition inside a procedure
    expectError("oto a\nnp 10\n", 1, 1); // missing już
    expectError("np 10\njuż", 2, 1); // stray już
    expectError("np :x", 1, 4); // parameter outside a procedure
  });
});

describe("errors", () => {
  test("parse errors draw nothing", () => {
    const r = expectError("np 10\npw 90\nfoo 10", 3, 1);
    expect(r.segments).toEqual([]);
  });

  test("positions of common mistakes", () => {
    expectError("np", 1, 1); // missing argument
    expectError("np abc", 1, 4); // non-numeric
    expectError('kolor "16866a"', 1, 7);
    expectError("kolor #16866a", 1, 7);
    expectError("grubość 13", 1, 9);
    expectError("grubość 2.5", 1, 9);
    expectError("grubość 0", 1, 9);
    expectError("powtorz 10001 [np 1]", 1, 9);
    expectError("powtorz -1 [np 1]", 1, 9);
    expectError("powtorz 1.5 [np 1]", 1, 9);
    expectError("powtorz 2 [np 1", 1, 11);
    expectError("np 1]", 1, 5);
    expectError("np 10 gora 90", 1, 7, "2d");
    expectError("  np 10\n  dół 5", 2, 3, "2d");
  });

  test("pitch error in 2D even inside an unused procedure", () => {
    expectError("oto x\ngora 5\njuż\nnp 1", 2, 1);
    expect(run3("oto x\ngora 5\njuż\nnp 1").error).toBeNull();
  });

  test("run-time errors keep what was drawn", () => {
    const r = run2("np 50\nnp 100000");
    expect(r.error).toMatchObject({ line: 2, column: 1 });
    expect(r.segments.length).toBe(1);
    const w = run2("oto g ma: w\ngrubosc w\njuż\nnp 5 g 13");
    expect(w.error).toMatchObject({ line: 2, column: 9 });
    expect(w.segments.length).toBe(1);
  });

  test("limits", () => {
    expect(run2("powtorz 10000 [pw 1]").error).not.toBeNull(); // bookkeeping counts
    expect(run2("powtorz 9999 [pw 1]").error).toBeNull();
    expect(run2("np 1 ".repeat(5001)).error).not.toBeNull(); // > 10 000 tokens
    expect(run2("np 1\n".repeat(5000)).error).toBeNull();
    expect(run2(" ".repeat(50_001)).error).not.toBeNull();
    expect(run2("[".repeat(33)).error!.column).toBe(1); // "[" cannot start a statement
    const deep = "powtorz 1 [".repeat(33) + "np 1" + "]".repeat(33);
    expect(run2(deep).error).not.toBeNull();
    const ok = "powtorz 1 [".repeat(32) + "np 1" + "]".repeat(32);
    expect(run2(ok).error).toBeNull();
    // 33 nested active frames through procedures
    let src = "";
    for (let i = 0; i < 33; i++) src += `oto p${i}\n${i < 32 ? `p${i + 1}` : "np 1"}\njuż\n`;
    const d = run2(src + "p0");
    expect(d.error).not.toBeNull();
    expect(d.segments).toEqual([]);
  });
});
