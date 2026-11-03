import { test, expect, describe } from "bun:test";
import { run, createExecution, tokenize } from "../src/interpreter.js";
import { examples } from "../src/examples.js";
const good = (s, m = "2d") => {
  const r = run(s, m);
  expect(r.error).toBeNull();
  return r.segments;
};
const bad = (s, line, column, m = "2d") => {
  const r = run(s, m);
  expect(r.error).not.toBeNull();
  if (line) expect(r.error.line).toBe(line);
  if (column) expect(r.error.column).toBe(column);
  return r;
};
const endpoint = (s, m = "2d") => good(s, m).at(-1)?.to;
const point = (a, b) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 7));
describe("Standardowe programy", () => {
  const lengths = [4, 5, 48, 90, 42, 255, 768, 12, 17, 36, 432, 240, 121];
  examples.forEach((e, i) =>
    test(e.name, () => expect(good(e.source, e.mode)).toHaveLength(lengths[i])),
  );
});
describe("Leksyka i wyrażenia", () => {
  test("wielkość liter, komentarze, liczby i aliasy", () => {
    point(endpoint("; c\nNAPRZÓD .5 RIGHT 90 FD 12.5"), [12.5, 0.5, 0]);
    expect(good('kolor "#AbC123" np 1')[0].color).toBe("#abc123");
  });
  test("precedencja, łączność i znaki", () => {
    for (const [expr, value] of [
      ["20 - 5 - 3", 12],
      ["2 + 3 * 4", 14],
      ["-(3 - 5)", 2],
      ["- -2", 2],
      ["--+2", 2],
      ["2*-3", -6],
      ["(2+3)*4", 20],
    ])
      point(endpoint("np " + expr), [0, value, 0]);
  });
  test("odstępy wokół operatorów", () => {
    point(endpoint("np 10-5"), [0, 5, 0]);
    point(endpoint("np 10 - 5"), [0, 5, 0]);
    for (const op of ["+", "-", "*", "/"]) {
      expect(bad("np 10 " + op + "5").segments).toHaveLength(0);
      expect(bad("np 10" + op + " 5").segments).toHaveLength(0);
    }
  });
  test("błędne liczby", () => {
    for (const value of ["1e3", "0x10", "NaN", "Infinity", "12..5"])
      expect(bad("np " + value, 1, 4).segments).toHaveLength(0);
  });
  test("nawiasy, brakujące argumenty i zbędne wartości", () => {
    bad("powtorz 2 [np ]", 1, 15);
    bad("np", 1, 1);
    bad("np (2 + 3", 1, 4);
    bad("np 10 20", 1, 7);
    bad("]", 1, 1);
    bad("powtorz 2 [np 10", 1);
  });
  test("kolory", () => {
    for (const value of [
      '"red"',
      '"#fff"',
      '"#abcdefg"',
      "#123456",
      '"#gg0000"',
    ])
      bad("kolor " + value);
  });
  test("pozycje argumentów przy błędach wykonania", () => {
    let r = bad("np 3\nnp 1 + (8 / 0)", 2, 4);
    expect(r.segments).toHaveLength(1);
    r = bad("np 3\nniech x 0\nnp 20 / x", 3, 4);
    expect(r.segments).toHaveLength(1);
    bad("np 2\nnp 3e3", 2, 4);
  });
});
describe("Zmienne, zakresy i procedury", () => {
  test("deklaracja w przód i brak wartości", () => {
    bad("np brak", 1, 4);
    let r = bad("np x\nniech x 5", 1, 4);
    expect(r.error.message).toContain("wartości");
    expect(r.segments).toHaveLength(0);
  });
  test("lokalne przypisania i parametry", () => {
    point(
      endpoint("niech x 10\noto p ma: x\n niech x x * 2\n np x\njuż\np 5 np x"),
      [0, 20, 0],
    );
    point(
      endpoint("niech x 8\noto p\n niech x 5\n np x\njuż\np np x"),
      [0, 13, 0],
    );
  });
  test("parametr może mieć nazwę procedury i można go zmienić", () => {
    point(endpoint("oto p ma: p\n niech p p + 1\n np p\njuż\np 4"), [0, 5, 0]);
  });
  test("lokalna zmienna nie wycieka", () => {
    bad("oto p\nniech x 4\njuż\np np x", 4, 6);
  });
  test("procedury w przód i legacy", () => {
    point(
      endpoint(
        "kwadrat 40 * 2 90\noto kwadrat :bok :kąt\npowtorz 4 [np :bok pw :kąt]\njuz",
      ),
      [0, 0, 0],
    );
  });
  test("rekurencja, warunki i stop", () => {
    expect(
      good("oto p ma: x\njeśli x = 0 [stop]\nnp x p x - 1\njuż\np 3"),
    ).toHaveLength(3);
    expect(good("powtorz 3 [np 1 jeśli 1 = 1 [stop] np 5] np 9")).toHaveLength(
      1,
    );
  });
  test("brak i nadmiar argumentów", () => {
    bad("oto p ma: x, y\nnp x\njuż\np 4", 4, 1);
    bad("oto p ma: x\nnp x\njuż\np 1 2", 4, 5);
  });
  test("błędne definicje", () => {
    for (const s of [
      "oto p\nnp 1",
      "oto p\njuż\noto p\njuż",
      "powtorz 2 [\noto p\nnp 2\njuż\n]",
      "oto p\noto q\njuż\njuż",
      "oto np\njuż",
      "oto p ma: x, x\njuż",
      "oto p ma: x,\njuż",
    ])
      bad(s);
  });
  test("nrpowt leksykalnie i wewnętrzna pętla", () => {
    bad("np nrpowt", 1, 4);
    bad("oto p\nnp nrpowt\njuż\npowtorz 2 [p]", 2, 4);
    point(endpoint("powtorz 2 [np nrpowt powtorz 2 [np nrpowt]]"), [0, 9, 0]);
    point(endpoint("oto p\npowtorz 3 [np repcount]\njuż\np"), [0, 6, 0]);
  });
  test("warunki dokładne i obie gałęzie", () => {
    expect(good("jeśli 0.1 + 0.2 = 0.3 [np 2]")).toHaveLength(0);
    point(endpoint("jeżeli 2<>3 [np 5] [np 9]"), [0, 5, 0]);
    expect(bad("jeśli 0 = 1 [np xyz]").segments).toHaveLength(0);
  });
});
describe("Geometria", () => {
  test("flat identyczny w obu trybach", () => {
    const s = "pw 35 np 80 lw 15 ws 30 pod np 9 opu dom";
    expect(good(s, "2d")).toEqual(good(s, "3d"));
  });
  test("ruch zerowy i dom", () => {
    expect(good("np 0 ws 0 dom")).toHaveLength(0);
    const s = good('kolor "#ff0000" grubosc 5 np 20 pw 40 dom np 10');
    expect(s).toHaveLength(3);
    point(s.at(-1).to, [0, 10, 0]);
    expect(s.at(-1).width).toBe(5);
  });
  test("pitch i roll w osiach lokalnych", () => {
    point(endpoint("gora 90 np 10", "3d"), [0, 0, 10]);
    point(endpoint("pp 90 gora 90 np 10", "3d"), [10, 0, 0]);
    point(endpoint("pl 90 gora 90 np 10", "3d"), [-10, 0, 0]);
    point(endpoint("pw 90 gora 90 np 10 dol 90 np 5", "3d"), [5, 0, 10]);
  });
  test("3D zakazane w 2D nawet w nieużywanej gałęzi", () => {
    for (const s of [
      "góra 20",
      "dol 20",
      "pp 20",
      "pl 20",
      "jeśli 0 = 1 [gora 90]",
    ])
      expect(bad("np 2 " + s).segments).toHaveLength(0);
  });
  test("czyść zachowuje stan i poprzedza błąd", () => {
    const r = bad("np 10 czyść np 5 np 1 / 0");
    expect(r.segments).toHaveLength(1);
    point(r.segments[0].from, [0, 10, 0]);
    point(r.segments[0].to, [0, 15, 0]);
  });
});
describe("Limity i walidacja", () => {
  test("szerokość i repeat: stałe przed rysowaniem, zmienne w trakcie", () => {
    for (const [cmd, v] of [
      ["grubosc", "0"],
      ["grubosc", "1.5"],
      ["grubosc", "13"],
      ["powtorz", "-1"],
      ["powtorz", "10001"],
      ["powtorz", "1.2"],
    ]) {
      const suffix = cmd === "powtorz" ? " []" : "";
      expect(bad("np 3 " + cmd + " " + v + suffix).segments).toHaveLength(0);
      expect(
        bad("np 3 niech x " + v + " " + cmd + " x" + suffix).segments,
      ).toHaveLength(1);
    }
  });
  test("repeat 0 nic nie wykonuje", () =>
    expect(good("powtorz 0 [np 1 / 0]")).toHaveLength(0));
  test("współrzędne", () => {
    expect(good("np 100000")).toHaveLength(1);
    expect(bad("np 2 np 100000").segments).toHaveLength(1);
  });
  test("limit operacji i zachowanie rysunku", () => {
    let r = bad("powtorz 10000 [np 1]");
    expect(r.segments.length).toBeGreaterThan(1);
    expect(r.error.message).toContain("operacji");
  });
  test("precyzyjne liczenie operacji", () => {
    let ex = createExecution("powtorz 2 [jeśli 1 = 1 [np 1]]");
    for (const _ of ex.iterator) {
    }
    expect(ex.state.operations).toBe(9);
  });
  test("ramki rekurencji", () => {
    const r = bad("oto p\np\njuż\np");
    expect(r.error.message).toContain("32");
  });
  test("warunki nie tworzą ramek", () => {
    const s = "jeśli 1 = 1 [".repeat(32) + "np 1" + "]".repeat(32);
    expect(good(s)).toHaveLength(1);
  });
  test("limit zagnieżdżenia", () => {
    bad("powtorz 1 [".repeat(33) + "np 1" + "]".repeat(33));
  });
  test("źródło i tokeny", () => {
    bad(";".repeat(50001));
    expect(() => tokenize("np 1 ".repeat(5001))).toThrow();
  });
});
describe("Pełny zestaw aliasów", () => {
  test("ruch i skręty", () => {
    for (const cmd of [
      "np",
      "naprzod",
      "naprzód",
      "fd",
      "forward",
      "ws",
      "wstecz",
      "bk",
      "back",
    ])
      expect(good(cmd + " 4")).toHaveLength(1);
    for (const cmd of [
      "pw",
      "prawo",
      "rt",
      "right",
      "lw",
      "lewo",
      "lt",
      "left",
    ])
      expect(good(cmd + " 90 np 1")).toHaveLength(1);
  });
  test("pisak, kolor i grubość", () => {
    for (const cmd of ["pod", "podnies", "podnieś", "pu", "penup"])
      expect(good(cmd + " np 4")).toHaveLength(0);
    for (const cmd of ["opu", "opusc", "opuść", "pd", "pendown"])
      expect(good("pod " + cmd + " np 4")).toHaveLength(1);
    for (const cmd of ["grubosc", "grubość", "width"])
      expect(good(cmd + " 7 np 1")[0].width).toBe(7);
    for (const cmd of ["kolor", "color"])
      expect(good(cmd + ' "#ABCDEF" np 1')[0].color).toBe("#abcdef");
  });
  test("kontrola przepływu", () => {
    for (const cmd of ["powtorz", "powtórz", "repeat"])
      expect(good(cmd + " 2 [np 1]")).toHaveLength(2);
    for (const cmd of ["jeśli", "jesli", "if"])
      expect(good(cmd + " 1 = 1 [np 1]")).toHaveLength(1);
    for (const cmd of ["jeżeli", "jezeli", "ifelse"])
      expect(good(cmd + " 0 > 1 [np 1] [np 2]")[0].to[1]).toBe(2);
    for (const cmd of ["niech", "let"])
      point(endpoint(cmd + " a 8 np a"), [0, 8, 0]);
  });
  test("dom i ekran", () => {
    for (const cmd of ["dom", "home"])
      point(endpoint("np 10 " + cmd), [0, 0, 0]);
    for (const cmd of ["czyść", "czysc", "cs", "clearscreen"])
      expect(good("np 4 " + cmd)).toHaveLength(0);
  });
  test("obrót przestrzenny", () => {
    for (const cmd of ["gora", "góra", "pitchup", "dol", "dół", "pitchdown"])
      expect(good(cmd + " 10 np 1", "3d")).toHaveLength(1);
    for (const cmd of [
      "pp",
      "przechylprawo",
      "rr",
      "rollright",
      "pl",
      "przechyllewo",
      "rl",
      "rollleft",
    ])
      expect(good(cmd + " 90 gora 90 np 1", "3d")).toHaveLength(1);
  });
  test("nazwy i zakończenia", () => {
    for (const end of ["już", "juz", "end"])
      point(
        endpoint("TO RYSUJ :BÓK\nFD :bók\n" + end + "\nrysuj 4"),
        [0, 4, 0],
      );
    for (const s of ["oto x:\njuż", "niech x: 3", "oto p ma: x:\njuż"]) bad(s);
  });
  test("ogromny skończony kąt nie psuje orientacji", () =>
    expect(good("pw " + "9".repeat(307) + " np 1")).toHaveLength(1));
});
test("wyrażenia przy granicy tokenów nie zależą od stosu JavaScript", () => {
  point(endpoint("np " + "-".repeat(9998) + "1"), [0, 1, 0]);
  point(endpoint("np " + "(".repeat(4500) + "1" + ")".repeat(4500)), [0, 1, 0]);
  expect(
    good("grubosc " + Array(4900).fill("0").join("+") + "+1 np 1")[0].width,
  ).toBe(1);
});
