import {
  run,
  type Mode,
  type Result,
  type Segment,
  type Vec,
} from "./interpreter";
export type Challenge = {
  id: string;
  name: string;
  mode: Mode;
  level: string;
  description: string;
  hint: string;
  target: string;
  starter: string;
};
export const challenges: Challenge[] = [
  {
    id: "linia",
    name: "Pierwsza kreska",
    mode: "2d",
    level: "01 · Rozgrzewka",
    description:
      "Narysuj od początku układu prostą linię o długości 100, w górę. Jeden ruch wystarczy.",
    hint: "Żółw patrzy w górę. Polecenie np przyjmuje długość kroku.",
    target: "np 100",
    starter: "; Narysuj linię o długości 100.\n",
  },
  {
    id: "kwadrat100",
    name: "Cztery równe boki",
    mode: "2d",
    level: "02 · Powtórzenia",
    description:
      "Narysuj kwadrat o boku 100. Zacznij w punkcie (0, 0), idź w górę, skręcaj w prawo.",
    hint: "Po każdym boku skręć o 90°. Powtórz parę poleceń cztery razy.",
    target: "powtorz 4 [np 100 pw 90]",
    starter: "; Kwadrat o boku 100.\npowtorz 4 [\n  ; Twój ruch!\n]\n",
  },
  {
    id: "trojkat",
    name: "Trzy to też figura",
    mode: "2d",
    level: "03 · Kąty",
    description:
      "Narysuj trójkąt równoboczny o boku 120. Zacznij od ruchu w górę, potem skręcaj w prawo.",
    hint: "Kąt skrętu to kąt zewnętrzny: 360 / liczba boków.",
    target: "powtorz 3 [np 120 pw 120]",
    starter: "; Trzy boki, trzy skręty.\n",
  },
  {
    id: "gwiazda140",
    name: "Sięgnij gwiazd",
    mode: "2d",
    level: "04 · Eksperyment",
    description:
      "Narysuj pięcioramienną gwiazdę z pięciu odcinków o długości 140. Pierwszy odcinek biegnie w górę, skręty w prawo.",
    hint: "Przy każdym wierzchołku żółw skręca o 144°.",
    target: "powtorz 5 [np 140 pw 144]",
    starter: "; Pięć odcinków po 140.\n",
  },
  {
    id: "okna",
    name: "Dwa okna",
    mode: "2d",
    level: "05 · Pióro",
    description:
      "Narysuj dwa kwadraty o boku 60: pierwszy od (0, 0), drugi od (100, 0). Oba w górę i w prawo. Nie łącz ich linią.",
    hint: "Po pierwszym kwadracie podnieś pióro: pod. Przesuń się o 100 w prawo i użyj opu.",
    target:
      "powtorz 4 [np 60 pw 90] pod pw 90 np 100 lw 90 opu powtorz 4 [np 60 pw 90]",
    starter: "; Dwa kwadraty, bez łączącej kreski.\n",
  },
  {
    id: "schody4",
    name: "Wejdź w przestrzeń",
    mode: "3d",
    level: "06 · Trzeci wymiar",
    description:
      "Zbuduj cztery stopnie w płaszczyźnie YZ. Każdy: 30 do przodu wzdłuż +Y, potem 20 w górę wzdłuż +Z. Zacznij w (0, 0, 0).",
    hint: "gora 90 kieruje żółwia w górę, a dol 90 przywraca poziomy kierunek.",
    target: "powtorz 4 [np 30 gora 90 np 20 dol 90]",
    starter: "; Cztery stopnie: 30 do przodu, 20 w górę.\npowtorz 4 [\n\n]\n",
  },
];
const distance = (p: Vec, s: Segment) => {
  const d = s.to.map((v, i) => v - s.from[i]),
    len = d.reduce((a, v) => a + v * v, 0);
  const t = Math.max(
    0,
    Math.min(
      1,
      p.reduce((a, v, i) => a + (v - s.from[i]) * d[i], 0) / (len || 1),
    ),
  );
  return Math.hypot(...p.map((v, i) => v - s.from[i] - t * d[i]));
};
const length = (segments: Segment[]) =>
  segments.reduce(
    (sum, s) => sum + Math.hypot(...s.to.map((v, i) => v - s.from[i])),
    0,
  );
function covered(a: Segment[], b: Segment[], tolerance: number) {
  return a.every((s) =>
    Array.from(
      { length: 21 },
      (_, i) => s.from.map((v, j) => v + ((s.to[j] - v) * i) / 20) as Vec,
    ).every((p) => b.some((t) => distance(p, t) <= tolerance)),
  );
}
export function checkChallenge(
  challenge: Challenge,
  result: Result,
): { passed: boolean; message: string } {
  if (result.error)
    return {
      passed: false,
      message: `Najpierw popraw program: ${result.error.message} (wiersz ${result.error.line}).`,
    };
  if (!result.segments.length)
    return {
      passed: false,
      message: "Jeszcze nie ma rysunku. Opuść pióro i zrób pierwszy krok.",
    };
  const expected = run(challenge.target, challenge.mode).segments;
  const expectedLength = length(expected),
    actualLength = length(result.segments);
  if (!covered(result.segments, expected, 1.2))
    return {
      passed: false,
      message:
        "Część linii jest poza wzorem. Sprawdź długości, kąty i położenie początku rysunku.",
    };
  if (!covered(expected, result.segments, 1.2))
    return {
      passed: false,
      message:
        "Brakuje części wzoru. Sprawdź liczbę boków lub powtórzeń i czy pióro jest opuszczone.",
    };
  if (Math.abs(expectedLength - actualLength) > expectedLength * 0.025)
    return {
      passed: false,
      message:
        "Kształt pasuje, ale długość wszystkich kresek się różni. Czy nie rysujesz któregoś odcinka drugi raz?",
    };
  return {
    passed: true,
    message:
      "Udało się! Wszystkie linie pasują do wzoru. Kolejny krok należy do Ciebie.",
  };
}
