import { describe, test, expect } from "bun:test";
import { run, parse, createExecution } from "../src/interpreter.js";
import { examples } from "../src/examples.js";
const end = (s) => run(s).segments.at(-1)?.to;
const near = (actual, expected) =>
  actual.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 8));
describe("przykłady", () => {
  for (const e of examples)
    test(e.id, () => {
      let r = run(e.source, e.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
      if (e.mode === "2d") expect(run(e.source, "3d")).toEqual(r);
    });
});
describe("wyrażenia i leksyka", () => {
  test("kolejność działań", () => {
    near(end("np 20 - 5 - 3"), [0, 12, 0]);
    near(end("np 2 + 3 * 4"), [0, 14, 0]);
    near(end("np -(3 - 5)"), [0, 2, 0]);
    near(end("np - -2"), [0, 2, 0]);
    near(end("niech bok 4 np -bok"), [0, -4, 0]);
  });
  test("odstępy operatorów", () => {
    expect(run("np 10 -5").segments).toEqual([]);
    expect(run("np 10-5").error).toBeNull();
    for (let op of ["+", "-", "*", "/"]) {
      expect(run("np 10 " + op + "5").error).not.toBeNull();
      expect(run("np 10" + op + " 5").error).not.toBeNull();
    }
  });
  test("liczby i komentarze", () => {
    near(end("NP .5 ; komentarz\nnaprzód 12.5"), [0, 13, 0]);
    for (let n of ["1e3", "0x10", "NaN", "Infinity", "1.2.3"])
      expect(run("np " + n).segments).toEqual([]);
  });
  test("dokładne porównania", () =>
    expect(run("jeśli 0.1 + 0.2 = 0.3 [np 10]").segments).toHaveLength(0));
  test("wszystkie porównania", () => {
    for (let op of ["<", ">", "=", "<=", ">=", "<>"])
      expect(run(`jeżeli 2 ${op} 3 [np 1] [np 2]`).error).toBeNull();
  });
  test("błędy runtime w argumencie", () => {
    let r = run("np 10\nnp 3 + 2 / 0");
    expect(r.segments).toHaveLength(1);
    expect(r.error).toMatchObject({ line: 2, column: 4 });
    r = run("np 10 niech n 1 grubosc n / 0");
    expect(r.segments).toHaveLength(1);
  });
});
describe("walidacja całego programu", () => {
  test("nie rysuje po błędzie składni", () => {
    for (let s of [
      "np 10 błąd",
      "np 10 grubosc 13",
      "np 10 powtorz 1.5 []",
      'np 10 kolor "#abc"',
      "np 10 gora 90",
      "np 10 np x",
      "np 10 np nrpowt",
      "np 10 powtorz 3 [np 5",
      "np 10 np (2 + 3",
    ])
      expect(run(s).segments).toEqual([]);
  });
  test("pozycje błędów", () => {
    expect(run("np 10\ngrubosc 13").error).toMatchObject({
      line: 2,
      column: 9,
    });
    expect(run("powtorz 2 [np ]").error).toMatchObject({ line: 1, column: 15 });
    expect(run("np").error).toMatchObject({ line: 1, column: 1 });
    expect(run("np 10 -5").error).toMatchObject({ line: 1, column: 7 });
  });
  test("statyczna i dynamiczna grubość", () => {
    expect(run("np 5 grubosc 6 * 3").segments).toHaveLength(0);
    expect(run("np 5 niech n 13 grubosc n").segments).toHaveLength(1);
  });
  test("licznik leksykalny", () => {
    expect(run("oto p\nnp nrpowt\njuż\npowtorz 2 [p]").error).not.toBeNull();
    near(end("powtorz 3 [powtorz 2 [np nrpowt] np nrpowt]"), [0, 15, 0]);
  });
});
describe("procedury i zakresy", () => {
  test("definicja po wywołaniu", () => {
    near(
      end(
        "kwadrat 40 * 2 90\noto kwadrat ma: bok, kąt\npowtorz 4 [np bok pw kąt]\njuż",
      ),
      [0, 0, 0],
    );
  });
  test("legacy i wielkość liter", () =>
    near(end("OTO idź :BOK\nNP :bok\nEND\nIDŹ 20"), [0, 20, 0]));
  test("globalne i lokalne", () =>
    near(
      end(
        "niech x 10\noto p ma: x\nniech x x + 1 np x\nniech y 3\njuż\np 20 np x",
      ),
      [0, 31, 0],
    ));
  test("nieprzypisana zmienna", () => {
    let r = run("np 5 jeśli 0 = 1 [niech x 3] np x");
    expect(r.segments).toHaveLength(1);
    expect(r.error.message).toContain("wartości");
  });
  test("stop wychodzi z procedury", () =>
    near(
      end(
        "oto p\npowtorz 4 [np 2 jeśli 1 = 1 [stop] np 100]\nnp 200\njuż\np np 3",
      ),
      [0, 5, 0],
    ));
  test("parametr o nazwie procedury", () =>
    near(end("oto a ma: a\nnp a\njuż\na 12"), [0, 12, 0]));
  test("rekurencja i limity ramek", () =>
    expect(run("oto p\np\njuż\np").error.message).toContain("32"));
  test("niepoprawne definicje i wywołania", () => {
    for (let s of [
      "oto p\nnp 1",
      "oto p ma: x,\nnp 1\njuż",
      "oto p\njuż\noto p\njuż",
      "powtorz 1 [oto p\njuż]",
      "oto p ma: x\nnp x\njuż\np",
      "oto p\njuż np 1",
    ])
      expect(run(s).error).not.toBeNull();
  });
});
describe("geometria i stan", () => {
  test("obroty przestrzenne", () => {
    near(run("gora 90 np 10", "3d").segments[0].to, [0, 0, 10]);
    near(run("pp 90 gora 90 np 10", "3d").segments[0].to, [10, 0, 0]);
    near(run("pl 90 gora 90 np 10", "3d").segments[0].to, [-10, 0, 0]);
    near(run("pw 90 np 10", "3d").segments[0].to, [10, 0, 0]);
  });
  test("pisak, dom i czyść", () => {
    let r = run('kolor "#AABBCC" grubosc 5 np 20 pw 90 np 10 dom np 10');
    expect(r.segments).toHaveLength(4);
    expect(r.segments.at(-1)).toMatchObject({ color: "#aabbcc", width: 5 });
    near(r.segments.at(-1).to, [0, 10, 0]);
    expect(run("np 10 czyść np 5").segments[0]).toMatchObject({
      from: [0, 10, 0],
      to: [0, 15, 0],
    });
    expect(run("np 0 pod np 5").segments).toHaveLength(0);
  });
  test("błąd runtime zachowuje wynik po czyść", () => {
    let r = run("np 5 czyść np 6 np 1 / 0");
    expect(r.segments).toHaveLength(1);
    near(r.segments[0].from, [0, 5, 0]);
  });
  test("limity operacji i współrzędnych", () => {
    expect(run("powtorz 10000 []").error.message).toContain("operacji");
    expect(run("np 100000 np 1").segments).toHaveLength(1);
    expect(run("np 100001").error).not.toBeNull();
  });
  test("limity źródła, tokenów i nawiasów", () => {
    expect(run(" ".repeat(50001)).error).not.toBeNull();
    expect(run("np 0 ".repeat(5001)).error).not.toBeNull();
    expect(run("powtorz 1 [".repeat(33) + "]".repeat(33)).error).not.toBeNull();
  });
  test("wykonanie krokowe zgodne z run", () => {
    let e = createExecution(examples[2].source);
    while (!e.state.done) e.step();
    expect(e.state.segments).toEqual(run(examples[2].source).segments);
  });
});

describe("odporność wyrażeń", () => {
  test("pierwszy token argumentu w nawiasach", () => {
    expect(run("np 5\nnp (3 / 0)").error).toMatchObject({ line: 2, column: 4 });
    expect(run("grubosc (3 * 5)").error).toMatchObject({ line: 1, column: 9 });
  });
  test("długie wyrażenia i znaki bez przepełnienia stosu", () => {
    near(end("np " + "1+".repeat(4000) + "1"), [0, 4001, 0]);
    near(end("np " + "(".repeat(4000) + "2" + ")".repeat(4000)), [0, 2, 0]);
    near(end("np " + "-".repeat(4000) + "2"), [0, 2, 0]);
  });
  test("zwykłe nazwy pokrywające się z polami JavaScript", () => {
    near(
      end("niech constructor 7 niech __proto__ 4 np constructor + __proto__"),
      [0, 11, 0],
    );
    expect(run("constructor").error).not.toBeNull();
  });
});
