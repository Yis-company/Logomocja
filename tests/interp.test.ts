import { describe, expect, test } from "bun:test";
import { run, LIMITS } from "../src/core/interp";
import { EXAMPLES } from "../src/core/examples";

const ok = (src: string, mode: "2d" | "3d" = "2d") => {
  const r = run(src, mode);
  expect(r.error).toBeNull();
  return r.segments;
};
const err = (src: string, mode: "2d" | "3d" = "2d") => {
  const r = run(src, mode);
  expect(r.error).not.toBeNull();
  return { ...r.error!, n: r.segments.length };
};
const end = (src: string, mode: "2d" | "3d" = "2d") => {
  const s = ok(src, mode);
  return s[s.length - 1].to;
};
const near = (a: number[], b: number[]) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 9));

describe("ruch i geometria", () => {
  test("stan początkowy i np", () => {
    expect(ok("np 80")).toEqual([{ from: [0, 0, 0], to: [0, 80, 0], color: "#16866a", width: 3 }]);
  });
  test("aliasy poleceń są równoważne", () => {
    const a = ok('np 10 pw 90 ws 5 lw 90 pod np 1 opu kolor "#ABCDEF" grubosc 2 np 3');
    const b = ok('FORWARD 10 right 90 BACK 5 lewo 90 podnieś naprzód 1 opuść color "#abcdef" grubość 2 fd 3');
    expect(a).toEqual(b);
    expect(a[2].color).toBe("#abcdef");
    expect(a[2].width).toBe(2);
  });
  test("pw obraca zgodnie z ruchem wskazówek zegara", () => {
    expect(end("pw 90 np 10")).toEqual([10, 0, 0]);
    expect(end("lw 90 np 10")).toEqual([-10, 0, 0]);
    expect(end("pw 180 np 10")).toEqual([0, -10, 0]);
    near(end("pw 45 np 10"), [Math.SQRT1_2 * 10, Math.SQRT1_2 * 10, 0]);
    expect(end("pw -90 np 10")).toEqual([-10, 0, 0]);
  });
  test("ruch o zero nic nie rysuje, pisak w górze też", () => {
    expect(ok("np 0 ws 0 pod np 50")).toEqual([]);
  });
  test("dom rysuje odcinek i przywraca orientację", () => {
    const s = ok("pw 90 np 50 dom np 10");
    expect(s.length).toBe(3);
    expect(s[1].to).toEqual([0, 0, 0]);
    expect(s[2].to).toEqual([0, 10, 0]);
    expect(ok("dom")).toEqual([]);
  });
  test("czyść usuwa odcinki, reszta bez zmian", () => {
    const s = ok('kolor "#ff0000" np 50 czyść np 10');
    expect(s).toEqual([{ from: [0, 50, 0], to: [0, 60, 0], color: "#ff0000", width: 3 }]);
  });
  test("3D: gora, dol, pp, pl", () => {
    expect(end("gora 90 np 10", "3d")).toEqual([0, 0, 10]);
    expect(end("dol 90 np 10", "3d")).toEqual([0, 0, -10]);
    // po pp 90 góra żółwia to dawna prawa strona, więc „gora” kieruje ku +X
    expect(end("pp 90 gora 90 np 10", "3d")).toEqual([10, 0, 0]);
    expect(end("pl 90 gora 90 np 10", "3d")).toEqual([-10, 0, 0]);
    // prawa strona po pp 90 to dawny dół
    expect(end("pp 90 pw 90 np 10", "3d")).toEqual([0, 0, -10]);
    // po gora 90 góra to dawny tył
    expect(end("gora 90 gora 90 np 10", "3d")).toEqual([0, -10, 0]);
    expect(end("gora 90 pw 90 np 10", "3d")).toEqual([10, 0, 0]);
  });
  test("polecenia płaskie dają to samo w 2D i 3D", () => {
    for (const e of EXAMPLES.filter((x) => x.mode === "2d")) {
      expect(run(e.source, "3d")).toEqual(run(e.source, "2d"));
    }
  });
  test("polecenia 3D są błędem w 2D", () => {
    const e = err("np 10\n  gora 90");
    expect([e.line, e.column, e.n]).toEqual([2, 3, 0]);
    for (const c of ["dol", "pp", "pl", "góra", "dół", "pitchup", "rr", "rollleft", "przechylprawo"]) err(`${c} 10`);
  });
  test("sześcian zamyka się dokładnie", () => {
    const s = ok(EXAMPLES.find((e) => e.id === "szescian")!.source, "3d");
    expect(s.length).toBe(17);
    for (const g of s) for (const p of [g.from, g.to]) for (const v of p) expect([0, 100]).toContain(v);
  });
});

describe("wyrażenia", () => {
  const d = (src: string) => end(src)[1];
  test("priorytety i łączność", () => {
    expect(d("np 20 - 5 - 3")).toBe(12);
    expect(d("np 2 + 3 * 4")).toBe(14);
    expect(d("np (2 + 3) * 4")).toBe(20);
    expect(d("np 100 / 4 / 5")).toBe(5);
    expect(d("np 12.5 + .5")).toBe(13);
  });
  test("odstępy wokół operatorów", () => {
    expect(d("np 10 - 5")).toBe(5);
    expect(d("np 10-5")).toBe(5);
    const e = err("np 10 -5");
    expect([e.line, e.column, e.n]).toEqual([1, 7, 0]);
    expect(err("np 10 +5").column).toBe(7);
    expect(err("np 10 *5").column).toBe(7);
    expect(err("np 10 /5").column).toBe(7);
    expect(err("np 10- 5").column).toBe(6);
    expect(d("np 2*3+4")).toBe(10);
  });
  test("znaki jednoargumentowe", () => {
    expect(d("np -(3 - 5)")).toBe(2);
    expect(d("np - -2")).toBe(2);
    expect(d("niech bok 7 ws -bok")).toBe(7);
    expect(d("np +5")).toBe(5);
    expect(d("np 10 - -5")).toBe(15);
    expect(d("np 10--5")).toBe(15);
    expect(d("np -2 * -3")).toBe(6);
  });
  test("argumenty wywołania rozdziela odstęp", () => {
    const s = ok("oto p ma: a, b\n np a pw 90 np b\njuż\np 40 * 2 -5");
    expect(s[0].to).toEqual([0, 80, 0]);
    expect(s[1].to).toEqual([-5, 80, 0]);
  });
  test("to nie są liczby", () => {
    for (const bad of ["1e3", "0x10", "NaN", "Infinity", "5.", "1.2.3"]) {
      const e = err(`np ${bad}`);
      expect([e.line, e.column]).toEqual([1, 4]);
    }
  });
  test("dzielenie przez zero to błąd wykonania przy początku argumentu", () => {
    const e = err("np 50\nnp 10 + 5 / 0");
    expect([e.line, e.column, e.n]).toEqual([2, 4, 1]);
    const f = err("np 50 grubosc 1 / 0");
    expect([f.column, f.n]).toEqual([15, 1]);
  });
  test("warunki są dokładne", () => {
    expect(ok("jeśli 0.1 + 0.2 = 0.3 [np 10]")).toEqual([]);
    expect(ok("jeśli 1<2 [np 10]").length).toBe(1);
    expect(ok("jeśli 2 <> 2 [np 10]").length).toBe(0);
    expect(ok("jeśli 2 >= 2 [np 10]").length).toBe(1);
    expect(ok("jeśli 2 <= 1 [np 10]").length).toBe(0);
    expect(d("jeżeli 3 < 2 [np 1] [np 2]")).toBe(2);
    expect(d("jeśli 1 < -5 + 10 [np 3]")).toBe(3);
  });
  test("głębokie nawiasy i długie łańcuchy znaków nie przepełniają stosu", () => {
    const n = 4000;
    expect(d(`np ${"(".repeat(n)}7${")".repeat(n)}`)).toBe(7);
    expect(d(`np ${"- ".repeat(4000)}7`)).toBe(7);
  });
});

describe("powtórzenia, zmienne, warunki, procedury", () => {
  test("nrpowt liczy od 1 w najbliższym powtórzeniu", () => {
    const s = ok("powtorz 3 [np nrpowt * 10 pw 90]");
    expect(s.map((g) => g.to)).toEqual([[0, 10, 0], [20, 10, 0], [20, -20, 0]]);
    const t = ok("powtorz 2 [powtorz 2 [pod np repcount opu] np nrpowt]");
    expect(t.length).toBe(2);
  });
  test("nrpowt poza powtórzeniem to błąd składni", () => {
    expect(err("np 10 np nrpowt").n).toBe(0);
    const e = err("oto p\n np nrpowt\njuż\npowtorz 3 [p]");
    expect([e.line, e.column, e.n]).toEqual([2, 5, 0]);
    ok("powtorz 2 [jeśli nrpowt = 2 [np nrpowt]]");
  });
  test("powtorz 0 i granice", () => {
    expect(ok("powtorz 0 [np 10]")).toEqual([]);
    expect(err("powtorz 2.5 [np 10]").column).toBe(9);
    expect(err("powtorz -1 [np 10]").column).toBe(9);
    expect(err("np 5 powtorz 10001 [np 10]").n).toBe(0);
    const e = err("niech n 2.5 np 5 powtorz n [np 10]");
    expect([e.column, e.n]).toEqual([26, 1]);
  });
  test("grubość", () => {
    expect(err("np 5 grubosc 13").n).toBe(0);
    expect(err("grubosc 0").column).toBe(9);
    expect(err("grubosc 1.5").column).toBe(9);
    expect(ok("grubosc 6 / 2 np 1")[0].width).toBe(3);
    const e = err("niech g 20 np 5 grubosc g - 1");
    expect([e.column, e.n]).toEqual([25, 1]);
  });
  test("kolor", () => {
    expect(err('kolor "#12345"').column).toBe(7);
    expect(err('kolor "zielony"').column).toBe(7);
    expect(err("kolor 5").column).toBe(7);
    expect(err("kolor").column).toBe(1);
    expect(err('kolor "#12345g').column).toBe(7);
  });
  test("zmienne globalne i lokalne", () => {
    const s = ok("niech x 5\noto p\n np x\n niech x 20\n np x\njuż\np np x");
    expect(s.map((g) => g.to[1])).toEqual([5, 25, 30]);
    // parametr można nadpisać
    expect(end("oto p ma: a\n niech a a * 2\n np a\njuż\np 4")[1]).toBe(8);
    // użycie przed przypisaniem na poziomie głównym jest dozwolone składniowo
    const e = err("np 10\nnp 1 + x\nniech x 5");
    expect([e.line, e.column, e.n]).toEqual([2, 4, 1]);
  });
  test("nieznana nazwa to błąd składni", () => {
    const e = err("np 10 np bok");
    expect([e.line, e.column, e.n]).toEqual([1, 10, 0]);
    // zmienna lokalna innej procedury nie jest widoczna
    expect(err("oto a\n niech k 1\njuż\noto b\n np k\njuż\na b").line).toBe(5);
  });
  test("nazwa zmiennej nie może być poleceniem ani procedurą", () => {
    expect(err("niech np 5").column).toBe(7);
    expect(err("oto p\njuż\nniech p 5").line).toBe(3);
  });
  test("procedury: nagłówki, stare i nowe", () => {
    const a = ok("oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90");
    const b = ok("oto kwadrat :bok :kąt\n  powtorz 4 [np :bok pw :kąt]\njuż\nkwadrat 80 90");
    const c = ok("KWADRAT 80 90\nTO Kwadrat ma: BOK, Kąt\n  repeat 4 [fd bok rt :kąt]\nEND");
    expect(a.length).toBe(4);
    expect(b).toEqual(a);
    expect(c).toEqual(a);
  });
  test("parametr o nazwie procedury", () => {
    expect(end("oto bok ma: bok\n np bok\njuż\nbok 7")[1]).toBe(7);
  });
  test("stop kończy procedurę, a na poziomie głównym program", () => {
    expect(ok("oto p\n powtorz 5 [np 10 jeśli nrpowt = 2 [stop]]\n np 100\njuż\np np 1").length).toBe(3);
    expect(ok("np 10 powtorz 3 [stop] np 20").length).toBe(1);
  });
  test("rekurencja wzajemna", () => {
    expect(ok("oto a ma: n\n jeśli n = 0 [stop]\n np 1 b n - 1\njuż\noto b ma: n\n pw 90 a n\njuż\na 4").length).toBe(4);
  });
  test("błędy definicji", () => {
    expect(err("powtorz 2 [\noto p\njuż\n]").line).toBe(2);
    expect(err("oto p\n np 10").line).toBe(1);
    expect(err("oto p\noto q\njuż\njuż").line).toBe(2);
    expect(err("oto p\njuż\noto p\njuż").line).toBe(3);
    expect(err("np 10 oto p\njuż").column).toBe(7);
    expect(err("oto p\n np 10 już").column).toBe(8);
    expect(err("już").line).toBe(1);
    expect(err("oto np\njuż").column).toBe(5);
    expect(err("oto p ma: a, a\njuż").column).toBe(14);
  });
  test("zła liczba argumentów", () => {
    const src = "oto p ma: a, b\n np a\njuż\n";
    expect(err(src + "p 1").line).toBe(4);
    const e = err(src + "p 1 2 3");
    expect([e.line, e.column]).toEqual([4, 7]);
    const f = err(src + "powtorz 2 [p 1]");
    expect([f.line, f.column]).toEqual([4, 15]);
  });
  test("pozycje błędów składni", () => {
    expect(err("np 10\n  skok 5")).toMatchObject({ line: 2, column: 3 });
    expect(err("powtorz 4 [np]")).toMatchObject({ line: 1, column: 14 });
    expect(err("np (2 + )")).toMatchObject({ column: 9 });
    expect(err("np")).toMatchObject({ column: 1 });
    expect(err("np 10 20")).toMatchObject({ column: 7 });
    expect(err("powtorz 4 [np 10")).toMatchObject({ column: 11 });
    expect(err("np 10 ]")).toMatchObject({ column: 7 });
    expect(err("np (10")).toMatchObject({ column: 4 });
    expect(err("np 10 )")).toMatchObject({ column: 7 });
    expect(err("jeśli 1 [np 1]")).toMatchObject({ column: 9 });
    expect(err("jeżeli 1 = 1 [np 1]")).toMatchObject({ column: 1 });
    expect(err("np 10 @")).toMatchObject({ column: 7 });
  });
  test("komentarze i wielkość liter", () => {
    expect(ok("; komentarz\nNP 10 ; dalej\n; np 50").length).toBe(1);
    expect(end("niech Bok 5 np BOK")[1]).toBe(5);
  });
});

describe("limity", () => {
  test("liczba operacji", () => {
    // 1 (powtorz) + n * (1 + 1)
    expect(run("powtorz 4999 [np 1]", "2d").error).toBeNull();
    const r = run("powtorz 5000 [np 1]", "2d");
    expect(r.error).not.toBeNull();
    expect(r.segments.length).toBe(5000);
    const s = run("powtorz 10000 [pod]\nnp 1", "2d");
    expect(s.error!.line).toBe(1);
  });
  test("ramki: 32 aktywne wywołania i powtórzenia", () => {
    const nest = (n: number) => "powtorz 1 [".repeat(n) + "np 1" + "]".repeat(n);
    expect(run(nest(32), "2d").error).toBeNull();
    expect(run(nest(33), "2d")).toMatchObject({ segments: [], error: { column: 32 * 11 + 11 } });
    const rec = (n: number) => `oto p ma: n\n jeśli n > 1 [p n - 1]\n np 1\njuż\np ${n}`;
    expect(run(rec(32), "2d").error).toBeNull();
    const r = run(rec(33), "2d");
    expect(r.error).not.toBeNull();
    expect(run("oto p\n np 1 p\njuż\np", "2d").segments.length).toBe(32);
    // bloki warunkowe nie są ramkami, ale liczą się do głębokości nawiasów
    const ifs = (n: number) => "jeśli 1 = 1 [".repeat(n) + "np 1" + "]".repeat(n);
    expect(run(ifs(32), "2d").error).toBeNull();
    expect(run(ifs(33), "2d").error).not.toBeNull();
  });
  test("odcinki, współrzędne, rozmiar", () => {
    const r = run("np 60000 np 60000", "2d");
    expect(r.segments.length).toBe(1);
    expect(r.error).toMatchObject({ line: 1, column: 10 });
    expect(run("np 100000", "2d").error).toBeNull();
    expect(run(";" + "x".repeat(LIMITS.chars), "2d").error).toMatchObject({ line: 1, column: 1 });
    expect(run(";" + "x".repeat(LIMITS.chars - 1), "2d").error).toBeNull();
    expect(run("pod ".repeat(10000), "2d").error).toBeNull();
    expect(run("pod ".repeat(10001), "2d").error).not.toBeNull();
    expect(run("np 1e999", "2d").error).not.toBeNull();
  });
  test("nieznany tryb", () => {
    expect(run("np 1", "4d" as never).error).not.toBeNull();
  });
});

describe("programy wzorcowe", () => {
  const counts: Record<string, number> = {
    kwadrat: 4, gwiazda: 5, rozeta: 48, spirala: 90, wielokaty: 42, drzewo: 255, sniezynka: 768,
    schody: 12, szescian: 17, pierscien: 36, kula: 432, helisa: 240, drzewo3d: 121,
  };
  test("jest ich trzynaście", () => expect(EXAMPLES.length).toBe(13));
  for (const e of EXAMPLES) {
    test(`${e.name} działa w trybie ${e.mode}`, () => {
      const r = run(e.source, e.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBe(counts[e.id]);
      for (const s of r.segments) {
        expect(s.color).toMatch(/^#[0-9a-f]{6}$/);
        expect(Number.isInteger(s.width)).toBe(true);
      }
    });
  }
  test("programy 3D są błędem w 2D", () => {
    for (const e of EXAMPLES.filter((x) => x.mode === "3d")) expect(run(e.source, "2d").error).not.toBeNull();
  });
  test("śnieżynka wraca do punktu wyjścia", () => {
    const s = run(EXAMPLES.find((e) => e.id === "sniezynka")!.source, "2d").segments;
    near(s[s.length - 1].to, s[0].from);
  });
});

test("brak argumentu na końcu wiersza wskazuje polecenie, nie następny wiersz", () => {
  const r = run("np 100\nnp\npw 90", "2d");
  expect(r.segments).toEqual([]);
  expect(r.error?.line).toBe(2);
  expect(r.error?.column).toBe(1);
});
