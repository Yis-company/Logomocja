import { run, type Mode, type Segment } from "./interpreter";
export const challenges = [
  {
    id: "kwadrat100",
    name: "Kwadrat na start",
    mode: "2d" as Mode,
    description:
      "Narysuj kwadrat o boku 100. Zacznij w początku układu, pierwszy bok poprowadź w +Y, kolejne w prawo.",
    hint: "Pełny obrót ma 360°. Podziel go przez liczbę boków.",
    source: "powtorz 4 [np 100 pw 90]",
  },
  {
    id: "trojkat",
    name: "Trzy równe boki",
    mode: "2d" as Mode,
    description:
      "Narysuj trójkąt równoboczny o boku 120. Start w (0, 0), pierwszy bok w +Y, skręty w prawo.",
    hint: "Kąt skrętu żółwia jest kątem zewnętrznym: 360 / 3.",
    source: "powtorz 3 [np 120 pw 120]",
  },
  {
    id: "gwiazda100",
    name: "Złap gwiazdę",
    mode: "2d" as Mode,
    description:
      "Narysuj pięcioramienną gwiazdę z pięciu odcinków o długości 150. Start w (0, 0), pierwszy odcinek w +Y, skręty w prawo.",
    hint: "Wypróbuj kąt skrętu 144°.",
    source: "powtorz 5 [np 150 pw 144]",
  },
  {
    id: "okna",
    name: "Przerwa na pisak",
    mode: "2d" as Mode,
    description:
      "Narysuj dwa pionowe odcinki długości 100: od (0, 0) do (0, 100) oraz od (60, 0) do (60, 100). Bez łączącej kreski.",
    hint: "Podnieś pisak na czas przejścia między odcinkami.",
    source: "np 100 pod ws 100 pw 90 np 60 lw 90 opu np 100",
  },
  {
    id: "schody3d",
    name: "W górę!",
    mode: "3d" as Mode,
    description:
      "Zbuduj cztery stopnie: każdy 40 jednostek w +Y, następnie 25 w +Z. Zacznij w (0, 0, 0).",
    hint: "Unieś nos o 90°, narysuj pion, opuść nos o 90°.",
    source: "powtorz 4 [np 40 gora 90 np 25 dol 90]",
  },
  {
    id: "szescian80",
    name: "Trzeci wymiar",
    mode: "3d" as Mode,
    description:
      "Narysuj wszystkie 12 krawędzi sześcianu o boku 80: X od 0 do 80, Y od 0 do 80, Z od 0 do 80. Powtórzone krawędzie są dozwolone.",
    hint: "Dwa kwadraty na różnych wysokościach połącz czterema pionowymi krawędziami.",
    source:
      "powtorz 4 [np 80 pw 90] gora 90 np 80 dol 90 powtorz 4 [np 80 pw 90] powtorz 4 [np 80 dol 90 np 80 pod ws 80 opu gora 90 pw 90]",
  },
];
function distance(p: number[], s: Segment) {
  const v = s.to.map((n, i) => n - s.from[i]),
    w = p.map((n, i) => n - s.from[i]),
    length = v.reduce((n, x) => n + x * x, 0);
  const t = Math.max(
    0,
    Math.min(1, w.reduce((n, x, i) => n + x * v[i], 0) / length),
  );
  return Math.hypot(...p.map((n, i) => n - s.from[i] - t * v[i]));
}
export function checkDrawing(actual: Segment[], expected: Segment[]) {
  if (!actual.length)
    return {
      pass: false,
      reason: "Plansza jest pusta. Dodaj ruch z opuszczonym pisakiem.",
    };
  const covered = (a: Segment[], b: Segment[]) =>
    a.every((s) => {
      const length = Math.hypot(...s.to.map((n, i) => n - s.from[i]));
      const count = Math.min(300, Math.max(2, Math.ceil(length / 2)));
      for (let j = 0; j <= count; j++) {
        const p = s.from.map((v, i) => v + ((s.to[i] - v) * j) / count);
        if (!b.some((t) => distance(p, t) <= 1.2)) return false;
      }
      return true;
    });
  if (!covered(actual, expected))
    return {
      pass: false,
      reason:
        "Co najmniej jeden odcinek jest poza wzorem. Sprawdź długości, skręty i położenie względem początku układu.",
    };
  if (!covered(expected, actual))
    return {
      pass: false,
      reason: "Brakuje części wzoru. Sprawdź liczbę powtórzeń i stan pisaka.",
    };
  return {
    pass: true,
    reason: "Wszystkie krawędzie pasują do wzoru. Dobra robota!",
  };
}
export const target = (id: string) => {
  const c = challenges.find((c) => c.id === id)!;
  return run(c.source, c.mode).segments;
};
