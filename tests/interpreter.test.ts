import { describe, expect, test } from "bun:test";
import { run, compile, Execution } from "../src/interpreter";
const end = (source: string, mode: "2d" | "3d" = "2d") => {
  const r = run(source, mode);
  expect(r.error).toBeNull();
  return r.segments.at(-1)!.to;
};
const near = (a: number[], b: number[]) =>
  a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 7));
describe("geometria", () => {
  test("początek, pisak i zerowy krok", () => {
    expect(run("np 0 np 10", "2d")).toEqual({
      segments: [
        { from: [0, 0, 0], to: [0, 10, 0], color: "#16866a", width: 3 },
      ],
      error: null,
    });
  });
  test("prawo, lewo, wstecz i ułamki", () => {
    near(end("pw 90 np 10 lw 90 ws 2.5"), [10, -2.5, 0]);
    near(end("pw -90 np +3 ws .5"), [-2.5, 0, 0]);
  });
  test("kwadrat zamyka się w obu trybach", () => {
    const s = "powtórz 4 [np 80 pw 90]";
    near(end(s), [0, 0, 0]);
    expect(run(s, "2d")).toEqual(run(s, "3d"));
  });
  test("obrót w lokalnym układzie 3D", () => {
    near(end("góra 90 np 10 pw 90 np 20", "3d"), [20, 0, 10]);
    near(end("pw 90 góra 90 np 10 dół 90 np 20", "3d"), [20, 0, 10]);
    near(end("dół -90 np 10", "3d"), [0, 0, 10]);
  });
  test("kolor, grubość i podniesiony pisak", () => {
    const r = run('pod np 10 opu kolor "#AABbCC" grubość 12 np 5', "2d");
    expect(r.segments).toEqual([
      { from: [0, 10, 0], to: [0, 15, 0], color: "#aabbcc", width: 12 },
    ]);
  });
  test("wszystkie aliasy", () => {
    for (const group of [
      "np naprzod naprzód fd forward",
      "ws wstecz bk back",
      "pw prawo rt right",
      "lw lewo lt left",
      "gora góra pitchup",
      "dol dół pitchdown",
    ]) {
      const aliases = group.split(" ");
      for (const alias of aliases)
        expect(run(`${alias.toUpperCase()} 30 np 10`, "3d")).toEqual(
          run(`${aliases[0]} 30 np 10`, "3d"),
        );
    }
    for (const alias of ["pod", "podnies", "podnieś", "pu", "penup"])
      expect(run(`${alias} np 10`, "2d").segments).toHaveLength(0);
    for (const alias of ["opu", "opusc", "opuść", "pd", "pendown"])
      expect(run(`pod ${alias} np 10`, "2d").segments).toHaveLength(1);
  });
});
describe("procedury i powtórzenia", () => {
  test("wywołanie przed definicją, lokalne parametry i wielkość liter", () => {
    near(
      end(
        "KWADRAT 80 90\noto kwadrat ma: Bok, KĄT\n powtórz 4 [np :bok pw kąt]\njuż",
      ),
      [0, 0, 0],
    );
  });
  test("legacy i zagnieżdżone wywołania", () => {
    near(
      end(
        "outer 2\nto outer :n\n repeat n [inner :n]\nend\noto inner ma: x\n np x\njuz",
      ),
      [0, 4, 0],
    );
  });
  test("parametry repeat i width oraz cienie nazw", () => {
    const r = run("oto a ma: n, w\n width w repeat n [np w]\nend\na 2 4", "2d");
    expect(r.error).toBeNull();
    expect(r.segments).toHaveLength(2);
    expect(r.segments[0].width).toBe(4);
  });
  test("zero i puste bloki", () => {
    expect(run("repeat 0 [np 10] repeat 4 []", "2d")).toEqual({
      segments: [],
      error: null,
    });
  });
  test("nazwy odziedziczone z Object nie są wbudowane", () => {
    near(
      end("oto constructor :__proto__\n np :__proto__\nend\nconstructor 3"),
      [0, 3, 0],
    );
  });
});
describe("walidacja całego programu", () => {
  const invalid = [
    "np 10\nnieznane",
    "np 10\nnp",
    "np 10\nnp abc",
    "np 10\nnp 1e2",
    "np 10\nnp 1+2",
    'np 10\ncolor "red"',
    "np 10\nwidth 0",
    "np 10\nwidth 1.5",
    "np 10\nrepeat -1 []",
    "np 10\nrepeat 10001 []",
    "np 10\nrepeat .5 []",
    "np 10\nrepeat 3 np 2",
    "np 10\nrepeat 2 [np 3",
    "np 10\n]",
    "np 10\ngóra 0",
    "np 10\nrepeat 0 [góra 90]",
    "np 10\noto a\nnp 2",
    "oto a\nend\noto A\nend",
    "repeat 0 [\noto a\nend\n]",
    "oto a\noto b\nend\nend",
    "oto a ma: x x\nend",
    "oto a ma: x,\nend",
    "oto a\nend np 2",
    "oto a :n\nnp n\nend\na",
    "oto a :n\nnp n\nend\na 2 3",
    "oto a :n\nnp n\nend\nnp n",
  ];
  for (const source of invalid)
    test(source.replaceAll("\n", " / "), () => {
      const r = run(source, "2d");
      expect(r.error).not.toBeNull();
      expect(r.segments).toHaveLength(0);
      expect(r.error!.line).toBeGreaterThan(0);
      expect(r.error!.column).toBeGreaterThan(0);
    });
  test("pozycja błędu", () => {
    expect(run("; komentarz\n  np 1\n  zle", "2d").error).toMatchObject({
      line: 3,
      column: 3,
    });
    expect(run("  width 13", "2d").error).toMatchObject({ line: 1, column: 9 });
  });
  test("rekurencja także w nieużywanych procedurach i pustych pętlach", () => {
    for (const s of [
      "oto a\n repeat 0 [a]\nend",
      "oto a\nb\nend\noto b\na\nend",
    ])
      expect(run(s, "2d").error?.message).toContain("Rekurencja");
  });
  test("komentarze oraz nowa linia między argumentami", () => {
    near(end("NP ; komentarz\n 10\n PW\n90 np 5"), [5, 10, 0]);
  });
});
describe("limity i stan wykonania", () => {
  test("współrzędne zachowują poprzednie odcinki", () => {
    const r = run("np 100000 np 1", "2d");
    expect(r.segments).toHaveLength(1);
    expect(r.error).toMatchObject({ line: 1, column: 11 });
  });
  test("limit operacji", () => {
    const r = run("repeat 10000 [np 1]", "2d");
    expect(r.error?.message).toContain("10 000 operacji");
    expect(r.segments.length).toBeGreaterThan(0);
    expect(r.segments.length).toBeLessThan(10000);
  });
  test("puste pętle również liczą operacje", () => {
    expect(run("repeat 10000 []", "2d").error?.message).toContain(
      "10 000 operacji",
    );
  });
  test("limit źródła i tokenów", () => {
    expect(run(";".repeat(50001), "2d").error?.message).toContain("50 000");
    expect(run("pu ".repeat(10001), "2d").error?.message).toContain(
      "10 000 tokenów",
    );
  });
  test("limit nawiasów", () => {
    expect(
      run("repeat 1 [".repeat(33) + "np 1" + "]".repeat(33), "2d").error
        ?.message,
    ).toContain("32");
    expect(
      run("repeat 1 [".repeat(32) + "np 1" + "]".repeat(32), "2d").error,
    ).toBeNull();
  });
  test("limit aktywnych procedur", () => {
    const s =
      Array.from(
        { length: 34 },
        (_, i) => `oto a${i}\n${i < 33 ? "a" + (i + 1) : "np 1"}\nend`,
      ).join("\n") + "\na0";
    expect(run(s, "2d").error?.message).toContain("32 aktywnych");
  });
  test("zakres parametru jest błędem wykonania", () => {
    const r = run("oto a :w\nwidth w\nend\nnp 10 a 13", "2d");
    expect(r.segments).toHaveLength(1);
    expect(r.error?.message).toContain("Grubość");
  });
  test("wykonanie krokowe jest identyczne", () => {
    const source = "np 5 repeat 3 [pw 30 np 10]";
    const ex = new Execution(compile(source, "2d"));
    while (!ex.done) ex.step();
    expect(ex.segments).toEqual(run(source, "2d").segments);
  });
});
test("długi graf wywołań waliduje się bez przepełnienia stosu", () => {
  const chain = Array.from(
    { length: 1500 },
    (_, i) => `oto p${i}\np${(i + 1) % 1500}\nend`,
  ).join("\n");
  const r = run(chain, "2d");
  expect(r.error?.message).toContain("Rekurencja");
  expect(r.error!.line).toBe(4499);
});
