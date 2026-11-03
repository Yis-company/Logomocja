import { describe, test, expect } from "bun:test";
import { run, Machine } from "../src/interpreter";
import { examples } from "../src/examples";
const ok = (s: string, m = "2d") => {
  const r = run(s, m);
  expect(r.error).toBeNull();
  return r.segments;
};
const error = (s: string, m = "2d") => {
  const r = run(s, m);
  expect(r.error).not.toBeNull();
  return r;
};
describe("programy standardowe", () => {
  for (const e of examples)
    test(e.name, () => expect(ok(e.code, e.mode).length).toBeGreaterThan(0));
});
describe("wyrażenia i składnia", () => {
  test("priorytet, łączność i znaki", () => {
    expect(ok("np 20 - 5 - 3")[0].to[1]).toBe(12);
    expect(ok("np 2 + 3 * 4")[0].to[1]).toBe(14);
    expect(ok("np -(3 - 5) np - -2 np +.5").at(-1)!.to[1]).toBe(4.5);
  });
  test("symetria spacji operatorów", () => {
    expect(ok("np 10-5")[0].to[1]).toBe(5);
    expect(error("np 10 -5").segments).toHaveLength(0);
    expect(error("np 10- 5").segments).toHaveLength(0);
  });
  test("liczby tylko dziesiętne", () => {
    for (const n of ["1e3", "0x10", "NaN", "Infinity", "1."])
      expect(error("np " + n).segments).toHaveLength(0);
  });
  test("walidacja całego programu", () => {
    expect(error("np 10 błąd").segments).toHaveLength(0);
    expect(error("np 10 grubosc 13").segments).toHaveLength(0);
    expect(error("np 10 powtorz 1.5 []").segments).toHaveLength(0);
  });
  test("pozycje błędów argumentu", () => {
    let r = error("np 5\nnp (2 / 0)");
    expect(r.error).toMatchObject({ line: 2, column: 4 });
    expect(r.segments).toHaveLength(1);
    expect(error("np ]").error).toMatchObject({ line: 1, column: 4 });
    expect(error("np").error).toMatchObject({ line: 1, column: 1 });
    expect(error("grubosc (13)").error).toMatchObject({ line: 1, column: 9 });
  });
  test("aliasy i wielkość liter", () => {
    expect(
      ok('KOLOR "#AABBCC" GRUBOŚĆ 2 NAPRZÓD 5 PRAWO 90 FORWARD 5')[1].color,
    ).toBe("#aabbcc");
    for (const a of [
      "góra",
      "gora",
      "pitchup",
      "dół",
      "dol",
      "pitchdown",
      "pp",
      "przechylprawo",
      "rr",
      "rollright",
      "pl",
      "przechyllewo",
      "rl",
      "rollleft",
    ]) {
      expect(error(a + " 1").segments).toHaveLength(0);
      ok(a + " 1", "3d");
    }
  });
  test("nrpowt jest leksykalny", () => {
    error("np nrpowt");
    error("oto x\nnp nrpowt\njuż\npowtorz 2 [x]");
    expect(ok("powtorz 2 [powtorz 2 [np nrpowt]]").at(-1)!.to[1]).toBe(6);
  });
  test("niedozwolone definicje wewnątrz ciała", () => {
    error("powtorz 2 [\noto x\nnp 5\njuż\n]");
    error("oto x\noto y\njuż\njuż");
    error("oto x\nnp 5");
  });
});
describe("wykonanie i geometria", () => {
  test("błędy wykonania zachowują rysunek", () => {
    expect(error("np 5 np 2 / 0").segments).toHaveLength(1);
    expect(error("np 5 niech x 13 grubosc x").segments).toHaveLength(1);
    expect(error("np 5 niech n -1 powtorz n []").segments).toHaveLength(1);
    expect(error("np 5 np x niech x 2").error).toMatchObject({
      line: 1,
      column: 9,
    });
  });
  test("czyść zachowuje stan", () => {
    let ss = ok('np 5 kolor "#ABCDEF" grubosc 4 czysc np 5');
    expect(ss).toHaveLength(1);
    expect(ss[0]).toMatchObject({
      from: [0, 5, 0],
      to: [0, 10, 0],
      width: 4,
      color: "#abcdef",
    });
    expect(error("np 5 czysc np 2 / 0").segments).toHaveLength(0);
  });
  test("dom i pisak", () => {
    let ss = ok("np 10 dom np 5 pod dom opu np 0");
    expect(ss).toHaveLength(3);
    expect(ss[1].to).toEqual([0, 0, 0]);
    expect(ss[2].to).toEqual([0, 5, 0]);
  });
  test("orientacja 3D i przechył", () => {
    let ss = ok("pp 90 gora 90 np 20", "3d");
    expect(ss[0].to[0]).toBeCloseTo(20);
    expect(ss[0].to[1]).toBeCloseTo(0);
    expect(ok("gora 90 np 10", "3d")[0].to[2]).toBeCloseTo(10);
    let m = new Machine("pp 90", "3d");
    m.run();
    expect(m.up[0]).toBeCloseTo(1);
    expect(m.right[2]).toBeCloseTo(-1);
  });
  test("płaskie programy są identyczne w obu trybach", () => {
    for (const e of examples.filter((e) => e.mode === "2d"))
      expect(ok(e.code, "2d")).toEqual(ok(e.code, "3d"));
  });
  test("warunki porównują dokładnie", () => {
    expect(ok("jeśli 0.1 + 0.2 = 0.3 [np 10]")).toHaveLength(0);
    expect(ok("jeżeli 2 <> 3 [np 10] [np 20]")[0].to[1]).toBe(10);
  });
  test("lokalne zmienne, parametry i deklaracje w przód", () => {
    const s = "niech x 10\noto p ma: x\nniech x x + 2\nnp x\njuż\np 5 np x";
    expect(ok(s).at(-1)!.to[1]).toBe(17);
    ok("p 10\noto p :x\nnp :x\njuż");
    error("np nigdy");
    expect(error("np x niech x 5").segments).toHaveLength(0);
  });
  test("rekurencja i stop kończą wywołanie", () => {
    expect(
      ok("oto p ma: n\nif n = 0 [stop]\nnp 1 p n - 1\njuż\np 8"),
    ).toHaveLength(8);
    expect(ok("oto p\npowtorz 100 [stop]\njuż\npowtorz 100 [p]")).toHaveLength(
      0,
    );
    expect(ok("powtorz 5 [np 1 stop] np 2")).toHaveLength(1);
  });
  test("limity", () => {
    expect(error("powtorz 10000 [np 1]").segments.length).toBeGreaterThan(0);
    expect(error("np 100001").segments).toHaveLength(0);
    error("oto p\np\njuż\np");
    error(" ".repeat(50001));
    error("powtorz 1 [".repeat(33) + "]".repeat(33));
    error("pod ".repeat(10001));
  });
  test("krok wykonuje pojedynczą operację", () => {
    let m = new Machine("np 10 pw 90 np 10");
    m.step();
    expect(m.segments).toHaveLength(1);
    m.step();
    expect(m.segments).toHaveLength(1);
    m.step();
    expect(m.segments).toHaveLength(2);
  });
});
