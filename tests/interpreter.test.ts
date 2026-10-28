import { describe, test, expect } from "bun:test";
import { run, Session } from "../src/interpreter";
import { examples } from "../src/examples";
const end = (s: string, mode: "2d" | "3d" = "2d") =>
  run(s, mode).segments.at(-1)?.to;
const error = (s: string, line?: number, column?: number) => {
  const r = run(s);
  expect(r.error).not.toBeNull();
  if (line) expect(r.error!.line).toBe(line);
  if (column) expect(r.error!.column).toBe(column);
  return r;
};
describe("Słownik i geometria", () => {
  test("stan początkowy i 2D = płaskie 3D", () => {
    const s = "powtórz 4 [NP 120 PRAWO 90]";
    expect(run(s).segments).toEqual(run(s, "3d").segments);
    expect(run(s).segments).toHaveLength(4);
    expect(end(s)![0]).toBeCloseTo(0);
    expect(end(s)![1]).toBeCloseTo(0);
  });
  test("style, pióro, dom i czyść", () => {
    const r = run(
      'pod np 5 opu kolor "#ABCdef" grubość 8 np 10 dom czyść np 2',
    );
    expect(r.error).toBeNull();
    expect(r.segments).toEqual([
      { from: [0, 0, 0], to: [0, 2, 0], color: "#abcdef", width: 8 },
    ]);
  });
  test("orientacja lokalna 3D", () => {
    expect(end("góra 90 np 20", "3d")![2]).toBeCloseTo(20);
    expect(end("pp 90 gora 90 np 20", "3d")![0]).toBeCloseTo(20);
    expect(end("pp 90 pw 90 np 20", "3d")![2]).toBeCloseTo(-20);
    expect(end("gora 90 dol 90 pl 45 pp 45 np 5", "3d")![1]).toBeCloseTo(5);
  });
  test("komendy 3D odrzucane w całym programie 2D", () => {
    expect(error("np 10\npowtorz 0 [gora 20]", 2, 12).segments).toHaveLength(0);
  });
  test("każdy standardowy przykład działa", () => {
    for (const e of examples) {
      const r = run(e.source, e.mode);
      expect(r.error, e.id).toBeNull();
      expect(r.segments.length, e.id).toBeGreaterThan(0);
    }
  });
});
describe("Wyrażenia i leksyka", () => {
  test("priorytety, łączność, znaki i nawiasy", () => {
    expect(end("np 2 + 3 * 4")).toEqual([0, 14, 0]);
    expect(end("np 20 - 5 - 3")).toEqual([0, 12, 0]);
    expect(end("np -(3 - 5)")).toEqual([0, 2, 0]);
    expect(end("np - -2")).toEqual([0, 2, 0]);
    expect(end("niech bok 2 np -bok")).toEqual([0, -2, 0]);
    expect(end("np .5 + 12.5")).toEqual([0, 13, 0]);
  });
  test("symetria odstępów operatorów", () => {
    expect(end("np 10-5")).toEqual([0, 5, 0]);
    expect(end("np 10 - 5")).toEqual([0, 5, 0]);
    error("np 10 -5", 1, 7);
    error("np 10* 5");
    error("np 10 /2");
  });
  test("niepoprawne liczby i kolory", () => {
    for (const v of ["1e3", "0x10", "NaN", "Infinity", "1.2.3"])
      error("np " + v);
    error('kolor "red"', 1, 7);
    error('kolor "#abc"');
  });
  test("dokładne porównania i wszystkie operatory", () => {
    expect(run("jeśli 0.1 + 0.2 = 0.3 [np 1]").segments).toHaveLength(0);
    expect(
      run("if 2<=2 [fd 1] ifelse 3<>3 [fd 5] [fd 2]").segments,
    ).toHaveLength(2);
  });
  test("dzielenie przez zero zachowuje rysunek i pozycję argumentu", () => {
    const r = error("np 10\nnp 5 + (2 / 0)", 2, 4);
    expect(r.segments).toHaveLength(1);
  });
  test("brakujący argument, nawias i wartość w miejscu komendy", () => {
    error("np", 1, 1);
    error("powtorz 2 [np ]", 1, 15);
    error("np (2 + )", 1, 9);
    error("np 2 3", 1, 6);
    error("powtorz 2 [np 3", 1, 11);
  });
});
describe("Zmienne i procedury", () => {
  test("zmienne później deklarowane, lecz jeszcze nieprzypisane", () => {
    expect(error("np bok\nniech bok 5", 1, 4).segments).toHaveLength(0);
    error("np brak", 1, 4);
    error("jeśli 1 > 2 [niech bok 5] np 2 + bok", 1, 30);
  });
  test("procedury przed definicją, oba nagłówki i parametry o nazwie procedury", () => {
    expect(
      end("kwadrat 40 * 2\noto kwadrat ma: kwadrat\n np kwadrat\njuż"),
    ).toEqual([0, 80, 0]);
    expect(end("oto f :bok :kąt\nnp :bok pw :kąt\nend\nf 10 90")).toEqual([
      0, 10, 0,
    ]);
  });
  test("lokalne zmienne, parametry i globalne pozostają w swoich zakresach", () => {
    expect(
      end("niech x 10\noto f ma: y\nniech x y np x\njuż\nf 20 np x"),
    ).toEqual([0, 30, 0]);
  });
  test("rekurencja i stop wychodzący przez powtórzenie", () => {
    expect(
      run("oto f ma: n\nif n = 0 [stop]\nnp n f n - 1\njuż\nf 4").segments,
    ).toHaveLength(4);
    expect(end("oto f\npowtorz 4 [np 2 stop] np 100\njuż\nf np 3")).toEqual([
      0, 5, 0,
    ]);
    expect(run("powtorz 3 [np 1 stop] np 100").segments).toHaveLength(1);
  });
  test("nrpowt ma zakres leksykalny", () => {
    expect(end("powtorz 3 [np nrpowt]")).toEqual([0, 6, 0]);
    expect(end("powtorz 2 [powtorz 2 [np nrpowt] np nrpowt]")).toEqual([
      0, 9, 0,
    ]);
    error("nrpowt");
    error("oto f\nnp nrpowt\njuż\npowtorz 2 [f]", 2, 4);
  });
  test("walidacja całego programu przed rysowaniem", () => {
    for (const s of [
      "np 10\nnieznane",
      "np 10\ngrubosc 2 * 8",
      "np 10\npowtorz -1 [np 1]",
      "np 10\noto f\nnp 5",
      "np 10\npowtorz 1 [oto f]",
      "np 10\noto f\njuż\noto f\njuż",
    ])
      expect(error(s).segments).toHaveLength(0);
  });
  test("argumenty zależne od nazw sprawdzane w wykonaniu", () => {
    expect(error("niech x 20 np 5 grubosc x", 1, 25).segments).toHaveLength(1);
    expect(error("niech x -1 np 5 powtorz x [np 1]").segments).toHaveLength(1);
  });
});
describe("Limity i sesja krokowa", () => {
  test("operacje i ramki ograniczają puste pętle i rekurencję", () => {
    expect(error("powtorz 10000 []").error!.message).toContain("operacji");
    expect(error("oto f\nf\njuż\nf").error!.message).toContain("32");
    expect(run("powtorz 9999 []").error).toBeNull();
  });
  test("warunki nie zajmują ramek, powtórzenia tak", () => {
    const s = "if 1 = 1 [".repeat(32) + "np 1" + "]".repeat(32);
    expect(run(s).error).toBeNull();
    error("if 1 = 1 [" + s + "]");
  });
  test("współrzędne i rozmiar źródła", () => {
    expect(error("np 100000 np 1").segments).toHaveLength(1);
    error(";".repeat(50001));
  });
  test("kroki oraz reset przez nową sesję", () => {
    const s = new Session("np 10 pw 90 np 20", "2d");
    s.step();
    expect(s.segments).toHaveLength(1);
    expect(s.current!.column).toBe(1);
    s.step();
    s.step();
    expect(s.segments).toHaveLength(2);
    s.step();
    expect(s.done).toBe(true);
    expect(new Session("np 10", "2d").segments).toHaveLength(0);
  });
});
describe("Dalsze przypadki języka", () => {
  test("każdy alias jest równoważny", () => {
    const groups = [
      ["np", "naprzod", "naprzód", "fd", "forward"],
      ["ws", "wstecz", "bk", "back"],
      ["pw", "prawo", "rt", "right"],
      ["lw", "lewo", "lt", "left"],
      ["pod", "podnies", "podnieś", "pu", "penup"],
      ["opu", "opusc", "opuść", "pd", "pendown"],
      ["kolor", "color"],
      ["grubosc", "grubość", "width"],
      ["powtorz", "powtórz", "repeat"],
      ["niech", "let"],
      ["jeśli", "jesli", "if"],
      ["jeżeli", "jezeli", "ifelse"],
      ["dom", "home"],
      ["czyść", "czysc", "cs", "clearscreen"],
      ["gora", "góra", "pitchup"],
      ["dol", "dół", "pitchdown"],
      ["pp", "przechylprawo", "rr", "rollright"],
      ["pl", "przechyllewo", "rl", "rollleft"],
    ];
    const args = [
      "25",
      "25",
      "30",
      "30",
      "",
      "",
      '"#ABC123"',
      "5",
      "2 [np 3]",
      "bok 5",
      "1 < 2 [np 5]",
      "1 = 2 [np 5] [np 10]",
      "",
      "",
      "40",
      "40",
      "40",
      "40",
    ];
    groups.forEach((g, i) => {
      const expected = run("np 3 " + g[0] + " " + args[i] + " np 10", "3d");
      for (const cmd of g)
        expect(
          run("np 3 " + cmd.toUpperCase() + " " + args[i] + " np 10", "3d"),
        ).toEqual(expected);
    });
  });
  test("parametr o nazwie procedury można zmienić", () => {
    expect(end("oto f ma: f\nniech f f + 1 np f\njuż\nf 4")).toEqual([0, 5, 0]);
  });
  test("lokalna wartość przesłania globalną po przypisaniu", () => {
    expect(
      end("niech x 4\noto f\nnp x niech x x + 1 np x\njuż\nf np x"),
    ).toEqual([0, 13, 0]);
  });
  test("nieznana nazwa w nawiasie wskazuje nazwę, błąd wykonania wskazuje cały argument", () => {
    error("np (brak)", 1, 5);
    error("np (bok + 1) niech bok 5", 1, 4);
    error("np -(4 / 0)", 1, 4);
  });
  test("czyść przed błędem zachowuje tylko nowy rysunek", () => {
    const r = error("np 5 czyść np 3 np 1 / 0");
    expect(r.segments).toHaveLength(1);
    expect(r.segments[0].from).toEqual([0, 5, 0]);
  });
  test("różne gałęzie i procedury walidowane nawet bez wykonania", () => {
    expect(error("np 10 jeśli 0 = 1 [grubosc 0]").segments).toHaveLength(0);
    expect(error("np 10\noto f\nnp nieznana\njuż").segments).toHaveLength(0);
    error("oto f ma: bok, bok\njuż");
    error("oto f\njuż np 2");
    error("f 2\noto f ma: a, b\nnp a\njuż");
  });
  test("dokładny limit tokenów i operacji", () => {
    expect(run("stop ".repeat(10000)).error).toBeNull();
    error("stop ".repeat(10001));
    const source = "powtorz 4999 [np 0] np 1";
    expect(run(source).error).toBeNull();
    expect(error(source + " np 2").segments).toHaveLength(1);
  });
  test("ramki procedur i powtórzeń sumują się", () => {
    const source = "oto f ma: n\nif n > 0 [powtorz 1 [f n - 1]]\njuż\nf 16";
    expect(run(source).error!.message).toContain("32");
  });
});
test("długie poprawne wyrażenia nie zależą od stosu JavaScript", () => {
  expect(end("np " + "(".repeat(4000) + "2" + ")".repeat(4000))).toEqual([
    0, 2, 0,
  ]);
  expect(end("np " + "- ".repeat(4000) + "2")).toEqual([0, 2, 0]);
  expect(end("np " + Array(4000).fill("1").join("+"))).toEqual([0, 4000, 0]);
});
