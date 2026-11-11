import { run, type Mode, type Segment } from "./interp";
import { compareDrawings, type CheckResult } from "./check";

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  task: string;
  hint: string;
  /** program startowy w edytorze */
  starter: string;
  /** rozwiązanie wzorcowe: z niego powstaje wzór na arkuszu */
  solution: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "trojkat",
    title: "Trójkąt równoboczny",
    mode: "2d",
    task: "Narysuj trójkąt równoboczny o boku 100. Pierwszy bok biegnie prosto w górę od punktu startu, kolejne skręcają w prawo.",
    hint: "Żółw skręca o kąt zewnętrzny. Trzy równe skręty muszą dać pełny obrót: 360 / 3.",
    starter: "; Trójkąt równoboczny o boku 100\n",
    solution: "powtorz 3 [np 100 pw 120]",
  },
  {
    id: "schodki",
    title: "Schodki",
    mode: "2d",
    task: "Narysuj pięć schodków wspinających się w prawo. Każdy stopień to 30 w górę i 30 w prawo.",
    hint: "Jeden stopień to: np 30, pw 90, np 30, lw 90. Powtórz go pięć razy.",
    starter: "; Pięć schodków: 30 w górę, 30 w prawo\n",
    solution: "powtorz 5 [np 30 pw 90 np 30 lw 90]",
  },
  {
    id: "przerywana",
    title: "Linia przerywana",
    mode: "2d",
    task: "Narysuj pionową linię przerywaną: pięć kresek o długości 20, a między nimi przerwy o długości 20. Linia zaczyna się w punkcie startu.",
    hint: "Polecenie pod podnosi pisak, a opu go opuszcza. Żółw z podniesionym pisakiem idzie, ale nie rysuje.",
    starter: "; Pięć kresek po 20 z przerwami po 20\n",
    solution: "powtorz 5 [np 20 pod np 20 opu]",
  },
  {
    id: "domek",
    title: "Domek",
    mode: "2d",
    task: "Narysuj domek: kwadrat o boku 100 (lewy dolny róg w punkcie startu) i na nim dach, czyli trójkąt równoboczny o boku 100.",
    hint: "Po narysowaniu kwadratu przejdź do lewego górnego rogu. Dach zaczyna się skrętem pw 30.",
    starter: "; Kwadrat 100 i trójkątny dach\n",
    solution: "powtorz 4 [np 100 pw 90]\nnp 100 pw 30\npowtorz 3 [np 100 pw 120]",
  },
  {
    id: "promienie",
    title: "Promienie",
    mode: "2d",
    task: "Narysuj osiem promieni o długości 80, które rozchodzą się z punktu startu co 45 stopni. Pierwszy promień biegnie prosto w górę.",
    hint: "Po każdym promieniu wróć do środka poleceniem ws, a potem skręć.",
    starter: "; Osiem promieni co 45 stopni\n",
    solution: "powtorz 8 [np 80 ws 80 pw 45]",
  },
  {
    id: "rosnace",
    title: "Rosnące kwadraty",
    mode: "2d",
    task: "Narysuj cztery kwadraty o bokach 40, 80, 120 i 160. Wszystkie mają wspólny lewy dolny róg w punkcie startu. Użyj zmiennej albo procedury z parametrem.",
    hint: "Zacznij od niech bok 40. Po każdym kwadracie zwiększ zmienną: niech bok bok + 40.",
    starter: "; Cztery kwadraty: 40, 80, 120, 160\nniech bok 40\n",
    solution: "niech bok 40\npowtorz 4 [\n  powtorz 4 [np bok pw 90]\n  niech bok bok + 40\n]",
  },
  {
    id: "naroznik",
    title: "Narożnik w przestrzeni",
    mode: "3d",
    task: "Narysuj trzy krawędzie o długości 80 wychodzące z punktu startu: jedną do przodu, jedną w prawo i jedną pionowo w górę.",
    hint: "Polecenie gora 90 kieruje żółwia pionowo w górę. Po każdej krawędzi wróć na start poleceniem ws.",
    starter: "; Trzy krawędzie po 80: przód, prawo, góra\n",
    solution: "np 80 ws 80\npw 90 np 80 ws 80 lw 90\ngora 90 np 80",
  },
  {
    id: "piramida",
    title: "Piramida",
    mode: "3d",
    task: "Narysuj piramidę: kwadratową podstawę o boku 100 (jak w przykładzie Kwadrat) i cztery krawędzie boczne o długości 100, które spotykają się nad środkiem podstawy.",
    hint: "W każdym rogu skręć o 45 stopni do środka i unieś nos o 45 stopni: pw 45 gora 45. Po krawędzi wróć z podniesionym pisakiem i cofnij oba obroty.",
    starter: "; Podstawa 100 x 100 i cztery krawędzie po 100\n",
    solution:
      "powtorz 4 [\n  pw 45 gora 45\n  np 100\n  pod ws 100 opu\n  dol 45 lw 45\n  np 100 pw 90\n]",
  },
];

const targets = new Map<string, Segment[]>();

export function challengeById(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export function targetOf(c: Challenge): Segment[] {
  let t = targets.get(c.id);
  if (!t) {
    t = run(c.solution, c.mode).segments;
    targets.set(c.id, t);
  }
  return t;
}

export function checkChallenge(c: Challenge, source: string): CheckResult {
  const r = run(source, c.mode);
  if (r.error) {
    return {
      pass: false, covered: 0, extra: 0,
      reason: `Program zatrzymał się na błędzie w wierszu ${r.error.line}: ${r.error.message}`,
    };
  }
  return compareDrawings(r.segments, targetOf(c));
}
