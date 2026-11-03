import { describe, test, expect } from "bun:test";
import { run, Execution, aliases } from "../src/interpreter";
import { examples } from "../src/examples";
import { challenges, checkDrawing, target } from "../src/challenges";
const endpoint = (s: string, mode: "2d" | "3d" = "2d") => {
  const r = run(s, mode);
  expect(r.error).toBeNull();
  return r.segments.at(-1)?.to;
};
const near = (a: number[] | undefined, b: number[]) => {
  expect(a).toBeDefined();
  b.forEach((n, i) => expect(a![i]).toBeCloseTo(n, 8));
};
const error = (
  source: string,
  line: number,
  column: number,
  runtime = false,
) => {
  const r = run(source, "2d");
  expect(r.error).not.toBeNull();
  expect(r.error!.line).toBe(line);
  expect(r.error!.column).toBe(column);
  if (!runtime) expect(r.segments).toEqual([]);
  return r;
};
describe("przykłady", () => {
  for (const e of examples)
    test(e.id, () => {
      const r = run(e.source, e.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
      for (const s of r.segments) {
        expect(s.color).toMatch(/^#[0-9a-f]{6}$/);
        expect(s.from.concat(s.to).every(Number.isFinite)).toBe(true);
      }
    });
});
describe("leksyka i wyrażenia", () => {
  for (const [s, n] of [
    ["20 - 5 - 3", 12],
    ["2 + 3 * 4", 14],
    ["10-5", 5],
    ["10 - 5", 5],
    ["-(3 - 5)", 2],
    ["- -2", 2],
    ["+ - -2", 2],
    [".5", 0.5],
    ["12.5", 12.5],
    ["(2+3)*4", 20],
    ["8 / 2 / 2", 2],
    ["10+-5", 5],
  ] as [string, number][])
    test(s, () => near(endpoint("np " + s), [0, n, 0]));
  for (const s of ["1e3", "0x10", "NaN", "Infinity", "12.", "1.2.3"])
    test("błędna liczba " + s, () => error("np " + s, 1, 4));
  for (const [s, col] of [
    ["10 -5", 7],
    ["10- 5", 6],
    ["10 +5", 7],
    ["10 *5", 7],
    ["10 /5", 7],
  ] as [string, number][])
    test("odstępy " + s, () => error("np " + s, 1, col));
  test("komentarz i wielkość liter", () =>
    near(endpoint("; żółw\nNApRZÓD 10 ; ślad\nPRAWO 90 FD 5"), [5, 10, 0]));
  test("unicode i legacy", () =>
    near(endpoint("niech dł 12 np - -:DŁ"), [0, 12, 0]));
  test("dokładne porównanie", () =>
    expect(run("jeśli 0.1 + 0.2 = 0.3 [np 10]", "2d").segments).toHaveLength(
      0,
    ));
  for (const [cmp, expected] of [
    ["<", false],
    [">", true],
    ["=", false],
    ["<=", false],
    [">=", true],
    ["<>", true],
  ] as [string, boolean][])
    test("porównanie " + cmp, () =>
      near(endpoint(`jeżeli 2${cmp}1 [np 10] [np 20]`), [
        0,
        expected ? 10 : 20,
        0,
      ]),
    );
});
describe("geometria", () => {
  test("początek i skręt w prawo", () =>
    near(endpoint("np 10 pw 90 np 5"), [5, 10, 0]));
  test("obrót w lewo", () => near(endpoint("lw 90 np 10"), [-10, 0, 0]));
  test("ruch wstecz i ujemny kąt", () =>
    near(endpoint("pw -90 ws 10"), [10, 0, 0]));
  test("pisak i ruch zerowy", () => {
    const r = run("np 0 pod np 10 opu np 5", "2d");
    expect(r.segments).toEqual([
      { from: [0, 10, 0], to: [0, 15, 0], color: "#16866a", width: 3 },
    ]);
  });
  test("dom rysuje i resetuje orientację", () => {
    const r = run('kolor "#ABCDEF" grubosc 5 np 10 pw 90 np 10 dom np 5', "2d");
    expect(r.segments[2].to).toEqual([0, 0, 0]);
    expect(r.segments[3]).toEqual({
      from: [0, 0, 0],
      to: [0, 5, 0],
      color: "#abcdef",
      width: 5,
    });
  });
  test("dom z podniesionym pisakiem", () =>
    expect(run("np 10 pod dom", "2d").segments).toHaveLength(1));
  test("czyść zachowuje stan", () => {
    const r = run('kolor "#ABCDEF" grubosc 4 np 10 pw 90 czyść np 20', "2d");
    expect(r.segments).toEqual([
      { from: [0, 10, 0], to: [20, 10, 0], color: "#abcdef", width: 4 },
    ]);
  });
  test("płaszczyzna identyczna", () =>
    expect(run(examples[2].source, "2d")).toEqual(
      run(examples[2].source, "3d"),
    ));
  test("pitch", () => near(endpoint("gora 90 np 10", "3d"), [0, 0, 10]));
  test("pitchdown", () => near(endpoint("dol 90 np 10", "3d"), [0, 0, -10]));
  test("rollright", () =>
    near(endpoint("pp 90 gora 90 np 10", "3d"), [10, 0, 0]));
  test("rollleft", () =>
    near(endpoint("pl 90 gora 90 np 10", "3d"), [-10, 0, 0]));
  test("prawo po pochyleniu", () =>
    near(endpoint("gora 90 pw 90 np 10", "3d"), [10, 0, 0]));
  for (const s of [
    "gora",
    "góra",
    "pitchup",
    "dol",
    "dół",
    "pitchdown",
    "pp",
    "rr",
    "rollright",
    "pl",
    "rl",
    "rollleft",
  ])
    test(s + " w 2D", () => error(s + " 10", 1, 1));
});
describe("zmienne i sterowanie", () => {
  test("pętla 0", () =>
    expect(run("powtorz 0 [np 100]", "2d").segments).toHaveLength(0));
  test("licznik wewnętrzny", () =>
    near(endpoint("powtorz 2 [np nrpowt powtorz 3 [np nrpowt]]"), [0, 15, 0]));
  test("licznik w warunku", () =>
    near(endpoint("powtorz 3 [jeśli nrpowt > 1 [np nrpowt]]"), [0, 5, 0]));
  test("przypisanie i zmiana", () =>
    near(endpoint("niech bok 10 niech bok bok * 2 np bok"), [0, 20, 0]));
  test("stop główny w pętli", () =>
    expect(
      run("powtorz 4 [np 10 jeśli nrpowt = 2 [stop]] np 50", "2d").segments,
    ).toHaveLength(2));
  test("zmienna zadeklarowana później", () => {
    const r = error("np 10\nnp 2 * x\nniech x 5", 2, 4, true);
    expect(r.segments).toHaveLength(1);
  });
  test("deklaracja w niewykonanym warunku", () =>
    error("jeśli 0 = 1 [niech x 3]\nnp x", 2, 4, true));
  test("nieznana zmienna", () => error("np 10\nnp xyz", 2, 4));
  test("licznik poza pętlą", () => error("np nrpowt", 1, 4));
  test("wartość zamiast polecenia", () => error("10", 1, 1));
  test("zmienna jak polecenie", () => error("niech np 2", 1, 7));
  test("złe powtórzenie zależne od nazwy", () => {
    const r = error("np 10 niech n 1.5 powtorz n [np 2]", 1, 27, true);
    expect(r.segments).toHaveLength(1);
  });
});
describe("procedury", () => {
  test("wywołanie przed definicją", () =>
    near(
      endpoint(
        "kwadrat 10 90\noto kwadrat ma: bok, kąt\n powtorz 4 [np bok pw kąt]\njuż",
      ),
      [0, 0, 0],
    ));
  test("nagłówek legacy", () =>
    near(endpoint("oto p :d\nnp :d\nend\np 8"), [0, 8, 0]));
  test("parametr jak procedura", () =>
    near(endpoint("oto p ma: p\nnp p\njuż\np 8"), [0, 8, 0]));
  test("argumenty są wyrażeniami", () =>
    near(
      endpoint("oto p ma: a, b\nnp a pw b np a\njuż\np 4 * 2 90"),
      [8, 8, 0],
    ));
  test("lokalność i przesłanianie", () =>
    near(
      endpoint("niech x 10\np\nnp x\noto p\nnp x niech x 2 np x\njuż"),
      [0, 22, 0],
    ));
  test("parametr można zmieniać", () =>
    near(endpoint("oto p ma: x\nniech x x * 2 np x\njuż\np 3"), [0, 6, 0]));
  test("lokalne nazwy nie wyciekają", () =>
    error("oto p\nniech x 5\njuż\np np x", 4, 6));
  test("stop kończy procedurę", () =>
    near(
      endpoint("oto p\npowtorz 2 [np 10 stop] np 50\njuż\np np 5"),
      [0, 15, 0],
    ));
  test("rekurencja", () =>
    near(
      endpoint("oto p ma: n\njeśli n = 0 [stop] np n p n - 1\njuż\np 5"),
      [0, 15, 0],
    ));
  test("wzajemna rekurencja", () =>
    near(
      endpoint(
        "oto a ma: n\njeśli n = 0 [stop] np 1 b n - 1\njuż\noto b ma: n\njeśli n = 0 [stop] np 1 a n - 1\njuż\na 5",
      ),
      [0, 5, 0],
    ));
  test("licznik nie jest dynamiczny", () =>
    error("oto p\nnp nrpowt\njuż\npowtorz 3 [p]", 2, 4));
  test("duplikat procedury", () => error("oto p\njuż\noto p\njuż", 3, 5));
  test("definicja w bloku", () =>
    error("powtorz 2 [\noto p\nnp 10\njuż\n]", 2, 1));
  test("definicja w procedurze", () => error("oto p\noto q\njuż\njuż", 2, 1));
  test("brak końca", () => error("oto p\nnp 10", 1, 1));
  test("zły koniec", () => error("oto p\nnp 10 już", 2, 7));
  test("nagłówek nie na początku linii", () => error("np 1 oto p\njuż", 1, 6));
  test("za mało argumentów", () =>
    error("oto p ma: a, b\nnp a\njuż\np 1", 4, 1));
  test("za dużo argumentów", () =>
    error("oto p ma: a\nnp a\njuż\np 1 2", 4, 5));
  test("zmienna jak procedura", () => error("niech p 3\noto p\njuż", 1, 7));
});
describe("błędy i limity", () => {
  test("walidacja całości", () => error("np 10\nnieznane", 2, 1));
  for (const s of ["0", "13", "1.5", "(3 * 5)", "-1"])
    test("zła stała grubość " + s, () => error("np 10\ngrubosc " + s, 2, 9));
  for (const s of ["-1", "10001", ".5"])
    test("zła stała liczba powtórzeń " + s, () =>
      error("np 10\npowtorz " + s + " [np 1]", 2, 9),
    );
  test("niewykonana błędna stała", () =>
    error("jeśli 0 = 1 [grubosc 0]", 1, 22));
  test("dzielenie przez zero podczas wykonania", () => {
    const r = error("np 10\nnp 3 + 2 / 0", 2, 4, true);
    expect(r.segments).toHaveLength(1);
  });
  test("czyść przed błędem", () =>
    expect(error("np 10 czyść np 1 / 0", 1, 16, true).segments).toHaveLength(
      0,
    ));
  test("błąd grubości z nazwy", () =>
    expect(
      error("np 10 niech n 13 grubosc n", 1, 26, true).segments,
    ).toHaveLength(1));
  test("błędny kolor", () => error('kolor "#fff"', 1, 7));
  test("brak argumentu", () => error("np", 1, 1));
  test("argument przy nawiasie", () => error("powtorz 1 [np ]", 1, 15));
  test("argument przy nawiasie okrągłym", () => error("np (1 + )", 1, 9));
  test("nadmiarowy nawias", () => error("np 1 ]", 1, 6));
  test("brak nawiasu", () =>
    expect(run("powtorz 2 [np 1", "2d").error).not.toBeNull());
  test("głębokość nawiasów", () =>
    expect(
      run("powtorz 1 [".repeat(33) + "np 1" + "]".repeat(33), "2d").error
        ?.message,
    ).toContain("32"));
  test("liczba ramek", () =>
    expect(run("oto p\np\njuż\np", "2d").error?.message).toContain("32"));
  test("warunki nie liczą ramek", () =>
    expect(
      run("jeśli 1 = 1 [".repeat(32) + "np 1" + "]".repeat(32), "2d").error,
    ).toBeNull());
  test("limit operacji i częściowy wynik", () => {
    const r = run("powtorz 10000 [np 1]", "2d");
    expect(r.error?.message).toContain("10 000");
    expect(r.segments).toHaveLength(5000);
  });
  test("puste pętle liczą obiegi", () => {
    const e = new Execution("powtorz 10000 []", "2d");
    e.finish();
    expect(e.error?.message).toContain("operacji");
    expect(e.operations).toBe(10001);
  });
  test("koszt wywołania i warunku", () => {
    const e = new Execution("oto p\njeśli 1 = 1 [np 1]\njuż\np", "2d");
    e.finish();
    expect(e.operations).toBe(5);
  });
  test("limit współrzędnych", () =>
    expect(error("np 10\nnp 100001", 2, 1, true).segments).toHaveLength(1));
  test("limit znaków", () =>
    expect(run(";".repeat(50001), "2d").error?.message).toContain("50 000"));
  test("limit tokenów", () =>
    expect(run("pw 1 ".repeat(5001), "2d").error?.message).toContain(
      "tokenów",
    ));
  test("krokowe identyczne z pełnym", () => {
    const e = new Execution(examples[3].source, "2d");
    while (!e.done) e.step();
    expect({ segments: e.segments, error: e.error }).toEqual(
      run(examples[3].source, "2d"),
    );
  });
});
describe("zadania", () => {
  for (const c of challenges)
    test(c.id, () => {
      const expected = target(c.id);
      expect(checkDrawing(expected, expected).pass).toBe(true);
      expect(checkDrawing([], expected).pass).toBe(false);
      expect(checkDrawing(run("np 999", "2d").segments, expected).pass).toBe(
        false,
      );
    });
  test("podział krawędzi", () =>
    expect(
      checkDrawing(
        run("powtorz 4 [np 50 np 50 pw 90]", "2d").segments,
        target("kwadrat100"),
      ).pass,
    ).toBe(true));
});
describe("wszystkie aliasy", () => {
  for (const [word, op] of Object.entries(aliases)) {
    if (["to", "end", "rep"].includes(op)) continue;
    const argument =
      op === "color"
        ? ' "#AABBCC"'
        : op === "let"
          ? " x 2"
          : op === "repeat"
            ? " 1 [np 5]"
            : op === "if"
              ? " 1 < 2 [np 5]"
              : op === "ifelse"
                ? " 1 = 2 [np 2] [np 5]"
                : ["pu", "pd", "stop", "clear", "home"].includes(op)
                  ? ""
                  : " 5";
    test(word, () =>
      expect(run(word.toUpperCase() + argument, "3d").error).toBeNull(),
    );
  }
});

describe("długie poprawne wyrażenia", () => {
  test("nawiasy okrągłe bez dodatkowego limitu", () =>
    near(
      endpoint("np " + "(".repeat(2000) + "2" + ")".repeat(2000)),
      [0, 2, 0],
    ));
  test("długi łańcuch sum", () =>
    near(endpoint("np " + Array(4000).fill("1").join("+")), [0, 4000, 0]));
  test("znaki jednoargumentowe", () =>
    near(endpoint("np " + "- ".repeat(4000) + "2"), [0, 2, 0]));
  test("argumenty oddzielone odstępem", () =>
    error("oto p ma: a, b\nnp a np b\njuż\np 1(2)", 4, 4));
  test("bardzo mały ruch", () =>
    expect(run("np .0000000000001", "2d").segments[0].to[1]).toBe(1e-13));
});
