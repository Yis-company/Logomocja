import { describe, expect, test } from "bun:test";
import { run, Machine, parse } from "../src/interp/machine";
import { EXAMPLES } from "../src/examples";

const pts = (src: string, mode: "2d" | "3d" = "2d") => run(src, mode);
const end = (src: string, mode: "2d" | "3d" = "2d") => {
  const r = run(src, mode);
  expect(r.error).toBeNull();
  return r.segments[r.segments.length - 1].to;
};
const errAt = (src: string, line: number, column: number, mode: "2d" | "3d" = "2d") => {
  const r = run(src, mode);
  expect(r.error).not.toBeNull();
  expect([r.error!.line, r.error!.column]).toEqual([line, column]);
  return r;
};
const close = (a: number[], b: number[]) => {
  for (let i = 0; i < 3; i++) expect(a[i]).toBeCloseTo(b[i], 9);
};

describe("podstawy", () => {
  test("stan początkowy i odcinek", () => {
    const r = pts("np 100");
    expect(r).toEqual({ segments: [{ from: [0, 0, 0], to: [0, 100, 0], color: "#16866a", width: 3 }], error: null });
  });
  test("aliasy i wielkość liter", () => {
    for (const s of ["NP 10", "naprzod 10", "naprzód 10", "fd 10", "Forward 10", "NAPRZÓD 10"])
      expect(end(s)).toEqual([0, 10, 0]);
    expect(end("ws 10")).toEqual([0, -10, 0]);
    expect(end("pw 90 np 10")).toEqual([10, 0, 0]);
    expect(end("lw 90 np 10")).toEqual([-10, 0, 0]);
    expect(end("rt 90 fd 10")).toEqual([10, 0, 0]);
  });
  test("pióro, kolor, grubość", () => {
    const r = pts('pod np 10 opu KOLOR "#AABBCC" grubość 12 np 5');
    expect(r.segments).toEqual([{ from: [0, 10, 0], to: [0, 15, 0], color: "#aabbcc", width: 12 }]);
  });
  test("ruch zerowy nic nie rysuje", () => {
    expect(pts("np 0 ws 0 np 5 - 5").segments).toEqual([]);
  });
  test("komentarze i puste programy", () => {
    expect(pts("; nic\n\n  ")).toEqual({ segments: [], error: null });
    expect(pts("np 10 ; komentarz np 20").segments.length).toBe(1);
  });
  test("kwadrat ma dokładne współrzędne", () => {
    const r = pts("powtorz 4 [np 120 pw 90]");
    expect(r.segments.map((s) => s.to)).toEqual([[0, 120, 0], [120, 120, 0], [120, 0, 0], [0, 0, 0]]);
  });
  test("dom i czyść", () => {
    const r = pts("np 10 pw 90 np 10 dom np 5");
    expect(r.segments[2]).toMatchObject({ from: [10, 10, 0], to: [0, 0, 0] });
    expect(r.segments[3].to).toEqual([0, 5, 0]);
    expect(pts("dom").segments).toEqual([]);
    expect(pts("np 10 czyść np 10").segments).toEqual([{ from: [0, 10, 0], to: [0, 20, 0], color: "#16866a", width: 3 }]);
    expect(pts("np 10 cs").segments).toEqual([]);
    expect(pts('kolor "#ff0000" grubosc 5 pod np 10 dom opu np 1').segments).toEqual([
      { from: [0, 0, 0], to: [0, 1, 0], color: "#ff0000", width: 5 },
    ]);
  });
});

describe("wyrażenia", () => {
  test("priorytety i łączność", () => {
    expect(end("np 20 - 5 - 3")).toEqual([0, 12, 0]);
    expect(end("np 2 + 3 * 4")).toEqual([0, 14, 0]);
    expect(end("np (2 + 3) * 4")).toEqual([0, 20, 0]);
    expect(end("np 100 / 4 / 5")).toEqual([0, 5, 0]);
    expect(end("np .5 + 12.5")).toEqual([0, 13, 0]);
  });
  test("odstępy przy operatorach", () => {
    expect(end("np 10 - 5")).toEqual([0, 5, 0]);
    expect(end("np 10-5")).toEqual([0, 5, 0]);
    errAt("np 10 -5", 1, 7);
    errAt("np 10 +5", 1, 7);
    errAt("np 10 *5", 1, 7);
    errAt("np 10 /5", 1, 7);
    errAt("np 10- 5", 1, 6);
    expect(pts("np 10 -5").segments).toEqual([]);
  });
  test("znaki jednoargumentowe", () => {
    expect(end("np -(3 - 5)")).toEqual([0, 2, 0]);
    expect(end("np - -2")).toEqual([0, 2, 0]);
    expect(end("niech bok 7 np -bok")).toEqual([0, -7, 0]);
    expect(end("np +4")).toEqual([0, 4, 0]);
    expect(end("np 10 - -2")).toEqual([0, 12, 0]);
    expect(end("np 2 * -3")).toEqual([0, -6, 0]);
  });
  test("złe liczby", () => {
    errAt("np 1e3", 1, 4);
    errAt("np 0x10", 1, 4);
    errAt("np NaN", 1, 4);
    errAt("np Infinity", 1, 4);
    errAt("np 1.", 1, 4);
    errAt("np 1.2.3", 1, 4);
  });
  test("dzielenie przez zero jest błędem wykonania przy początku argumentu", () => {
    const r = errAt("np 10\nnp 5 + 1 / 0", 2, 4);
    expect(r.segments.length).toBe(1);
    errAt("niech x 0 np 10 pw (4 / x)", 1, 20);
  });
  test("porównania są dokładne", () => {
    expect(pts("jeśli 0.1 + 0.2 = 0.3 [np 10]").segments).toEqual([]);
    expect(pts("jeśli 1<2 [np 10]").segments.length).toBe(1);
    expect(pts("jeśli 2 <= 2 [np 10]").segments.length).toBe(1);
    expect(pts("jeśli 2 >= 3 [np 10]").segments.length).toBe(0);
    expect(pts("jeśli 2 <> 3 [np 10]").segments.length).toBe(1);
    expect(pts("jeśli 2<-3 [np 10]").segments.length).toBe(0);
    expect(end("jeżeli 1 > 2 [np 10] [np 20]")).toEqual([0, 20, 0]);
    expect(end("ifelse 3 > 2 [fd 10] [fd 20]")).toEqual([0, 10, 0]);
  });
});

describe("powtórz i nrpowt", () => {
  test("nrpowt liczy od 1, wewnętrzna pętla", () => {
    expect(pts("powtorz 3 [np nrpowt]").segments.map((s) => s.to[1])).toEqual([1, 3, 6]);
    expect(pts("powtorz 2 [powtorz 2 [np repcount * 10] np nrpowt]").segments.map((s) => s.to[1])).toEqual([
      10, 30, 31, 41, 61, 63,
    ]);
    expect(pts("powtorz 0 [np 10]")).toEqual({ segments: [], error: null });
  });
  test("nrpowt poza pętlą", () => {
    errAt("np nrpowt", 1, 4);
    errAt("oto f\n  np nrpowt\njuż\npowtorz 2 [f]", 2, 6);
    expect(pts("powtorz 2 [jeśli nrpowt = 2 [np 10]]").segments.length).toBe(1);
  });
  test("liczba powtórzeń", () => {
    errAt("powtorz 2.5 [np 1]", 1, 9);
    errAt("powtorz -1 [np 1]", 1, 9);
    errAt("powtorz 10001 [np 1]", 1, 9);
    const r = errAt("np 5 niech n 2.5 powtorz n [np 1]", 1, 26);
    expect(r.segments.length).toBe(1);
    expect(pts("np 5 powtorz 2.5 [np 1]").segments).toEqual([]);
  });
});

describe("zmienne", () => {
  test("globalne i lokalne", () => {
    expect(end("niech x 5 niech x x * 2 np x")).toEqual([0, 10, 0]);
    expect(end("niech x 5\noto f\n  niech x 100\n  np x\njuż\nf np x")).toEqual([0, 105, 0]);
    expect(end("oto f ma: a\n  niech a a + 1\n  np a\njuż\nf 1")).toEqual([0, 2, 0]);
    expect(end("oto f\n  np x\njuż\nniech x 3 f")).toEqual([0, 3, 0]);
    expect(end("niech x 4 np :x")).toEqual([0, 4, 0]);
  });
  test("nazwa niezadeklarowana to błąd analizy", () => {
    errAt("np 10 np y", 1, 10);
    errAt("oto f\n  niech a 1\njuż\nnp a", 4, 4);
    errAt("oto f ma: a\n  np a\njuż\noto g\n  np a\njuż", 5, 6);
  });
  test("zmienna bez wartości to błąd wykonania", () => {
    const r = errAt("np 10\nnp 2 + x\nniech x 1", 2, 4);
    expect(r.segments.length).toBe(1);
    errAt("oto f\n  np 1 + x\n  niech x 1\njuż\nf", 2, 6);
  });
  test("zakazane nazwy", () => {
    errAt("niech np 5", 1, 7);
    errAt("oto f\njuż\nniech f 5", 3, 7);
    errAt("niech nrpowt 5", 1, 7);
  });
});

describe("procedury", () => {
  test("definicja, wywołanie, argumenty-wyrażenia", () => {
    const src = "oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 40 * 2 90";
    expect(pts(src).segments.map((s) => s.to)).toEqual([[0, 80, 0], [80, 80, 0], [80, 0, 0], [0, 0, 0]]);
  });
  test("stary nagłówek, :nazwy, wywołanie przed definicją, aliasy", () => {
    expect(end("kw 10\nto kw :bok\n  fd :bok fd bok\nend")).toEqual([0, 20, 0]);
    expect(end("OTO Kw :Bok\n  np BOK\nJUZ\nKW 7")).toEqual([0, 7, 0]);
  });
  test("argumenty rozdzielane odstępem; minus przyklejony to nowy argument", () => {
    expect(end("oto f ma: a, b\n  np a + b\njuż\nf 40 -5")).toEqual([0, 35, 0]);
  });
  test("parametr o nazwie procedury", () => {
    expect(end("oto bok ma: bok\n  np bok\njuż\nbok 9")).toEqual([0, 9, 0]);
  });
  test("stop", () => {
    expect(pts("np 1 stop np 1").segments.length).toBe(1);
    expect(pts("powtorz 5 [np 1 jeśli nrpowt = 2 [stop]] np 1").segments.length).toBe(2);
    expect(pts("oto f\n  powtorz 5 [np 1 stop]\n  np 1\njuż\nf np 1").segments.length).toBe(2);
  });
  test("rekurencja", () => {
    expect(end("oto f ma: n\n  jeśli n = 0 [stop]\n  np 1\n  f n - 1\njuż\nf 10")).toEqual([0, 10, 0]);
  });
  test("błędy definicji i wywołań", () => {
    errAt("oto f ma: a\n  np a\njuż\nf", 4, 1);
    errAt("oto f ma: a\n  np a\njuż\nf 1 2", 4, 5);
    errAt("oto f ma: a\n  np a\njuż\npowtorz 2 [f ]", 4, 14);
    errAt("powtorz 2 [\noto f\njuż\n]", 2, 1);
    errAt("oto f\n  np 1", 1, 1);
    errAt("oto f\njuż\noto f\njuż", 3, 5);
    errAt("oto f\n  oto g\n  już\njuż", 2, 3);
    errAt("np 1 oto f\njuż", 1, 6);
    errAt("oto f\n  np 1 już", 2, 8);
    errAt("już", 1, 1);
    errAt("oto np\njuż", 1, 5);
    errAt("oto f ma: a, a\njuż", 1, 14);
  });
});

describe("błędy składni", () => {
  test("pozycje", () => {
    errAt("np 10\n  skacz 5", 2, 3);
    errAt("np", 1, 1);
    errAt("powtorz 4 [np ]", 1, 15);
    errAt("np (3 + )", 1, 9);
    errAt("np 10 20", 1, 7);
    errAt("np 10 ]", 1, 7);
    errAt("powtorz 4 [np 10", 1, 11);
    errAt("np (3 + 4", 1, 4);
    errAt("np 3)", 1, 5);
    errAt('kolor "#12345"', 1, 7);
    errAt('kolor "#12345g"', 1, 7);
    errAt("kolor 5", 1, 7);
    errAt("kolor", 1, 1);
    errAt('kolor "#123456', 1, 7);
    errAt("grubosc 13", 1, 9);
    errAt("grubosc 0", 1, 9);
    errAt("grubosc 2.5", 1, 9);
    errAt("grubosc 2 + 11", 1, 9);
    errAt("powtorz 4 np 10", 1, 11);
    errAt("jeśli 1 [np 1]", 1, 9);
    errAt("jeżeli 1 = 1 [np 1]", 1, 1);
    errAt("np 10 @", 1, 7);
    errAt("np 10\nnp :", 2, 4);
  });
  test("błąd analizy nic nie rysuje, błąd wykonania zachowuje rysunek", () => {
    expect(pts("np 10 np 10 bzz").segments).toEqual([]);
    const r = errAt("np 10 niech g 20 grubosc g", 1, 26);
    expect(r.segments.length).toBe(1);
    const c = errAt("np 10 czyść np 5 np 1 / 0", 1, 21);
    expect(c.segments).toEqual([{ from: [0, 10, 0], to: [0, 15, 0], color: "#16866a", width: 3 }]);
  });
  test("3D w trybie 2D", () => {
    errAt("np 10 gora 90", 1, 7);
    errAt("np 10 pp 90", 1, 7);
    errAt("dol 1", 1, 1);
    errAt("rollleft 1", 1, 1);
    expect(pts("gora 90 np 10", "3d").error).toBeNull();
  });
});

describe("limity", () => {
  test("znaki i tokeny", () => {
    expect(pts(";" + "x".repeat(49999)).error).toBeNull();
    errAt(";" + "x".repeat(50000), 1, 1);
    expect(pts("pod " + "np 1 ".repeat(4999) + "opu").error).toBeNull();
    expect(pts("np 1 ".repeat(5001)).error).not.toBeNull();
  });
  test("zagnieżdżenie nawiasów", () => {
    const nest = (n: number) => "jeśli 1 = 1 [".repeat(n) + "np 1" + "]".repeat(n);
    expect(pts(nest(32)).error).toBeNull();
    errAt(nest(33), 1, 32 * 13 + 13);
  });
  test("ramki", () => {
    const rec = (n: number) => `oto f ma: n\n  jeśli n > 1 [f n - 1]\njuż\nf ${n}`;
    expect(pts(rec(32)).error).toBeNull();
    errAt(rec(33), 2, 16);
  });
  test("operacje", () => {
    expect(pts("pod powtorz 3332 [np 1 ws 1]").error).toBeNull(); // 2 + 3332*3 = 9998
    expect(pts("powtorz 3333 [np 1 ws 1]").error).toBeNull(); // 1 + 9999 = 10000
    const r = pts("pod powtorz 3333 [np 1 ws 1]"); // 10001
    expect(r.error).not.toBeNull();
    expect(pts("powtorz 10000 [np 1]").segments.length).toBe(5000);
  });
  test("odcinki i współrzędne", () => {
    errAt("np 100001", 1, 1);
    expect(pts("np 100000").error).toBeNull();
    errAt("pod np 100000 np 1", 1, 15);
  });
});

describe("3D", () => {
  test("gora / dol", () => {
    close(end("gora 90 np 10", "3d"), [0, 0, 10]);
    close(end("dol 90 np 10", "3d"), [0, 0, -10]);
    close(end("gora 90 gora 90 np 10", "3d"), [0, -10, 0]);
    close(end("gora 90 pw 90 np 10", "3d"), [10, 0, 0]);
  });
  test("pp / pl", () => {
    close(end("pp 90 gora 90 np 10", "3d"), [10, 0, 0]);
    close(end("pp 90 pw 90 np 10", "3d"), [0, 0, -10]);
    close(end("pl 90 gora 90 np 10", "3d"), [-10, 0, 0]);
    close(end("pp 90 np 10", "3d"), [0, 10, 0]);
  });
  test("dom przywraca orientację", () => {
    close(end("gora 40 pp 30 pw 20 np 10 pod dom opu np 10", "3d"), [0, 10, 0]);
  });
  test("płaskie programy dają to samo w 2D i 3D", () => {
    for (const ex of EXAMPLES.filter((e) => e.mode === "2d")) {
      expect(run(ex.source, "3d")).toEqual(run(ex.source, "2d"));
    }
  });
});

describe("programy wzorcowe", () => {
  const counts: Record<string, number> = {
    kwadrat: 4, gwiazda: 5, rozeta: 48, spirala: 90, wielokaty: 42, sniezynka: 768,
    schody: 12, szescian: 17, pierscien: 36, kula: 432, helisa: 240,
  };
  test("jest ich trzynaście i działają bez błędów", () => {
    expect(EXAMPLES.length).toBe(13);
    for (const ex of EXAMPLES) {
      const r = run(ex.source, ex.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
      if (counts[ex.id]) expect(r.segments.length).toBe(counts[ex.id]);
    }
  });
  test("sześcian ma wierzchołki sześcianu", () => {
    const r = run(EXAMPLES.find((e) => e.id === "szescian")!.source, "3d");
    for (const s of r.segments) for (const p of [s.from, s.to]) for (const c of p) expect([0, 100]).toContain(Math.round(c * 1e6) / 1e6);
  });
  test("śnieżynka się zamyka", () => {
    const r = run(EXAMPLES.find((e) => e.id === "sniezynka")!.source, "2d");
    close(r.segments[r.segments.length - 1].to, r.segments[0].from);
  });
});

describe("praca krokowa", () => {
  test("krok po kroku", () => {
    const m = new Machine(parse("np 10\npw 90\nnp 5", "2d"));
    expect(m.next!.line).toBe(1);
    expect(m.segments.length).toBe(0);
    expect(m.step()).toBe(true);
    expect(m.segments.length).toBe(1);
    expect(m.next!.line).toBe(2);
    m.step();
    expect(m.next!.line).toBe(3);
    expect(m.step()).toBe(false);
    expect(m.done).toBe(true);
    expect(m.segments.length).toBe(2);
  });
});
