import type { Mode, Segment, Vec3 } from "../logo/types";

export type Challenge = {
  id: string;
  title: string;
  mode: Mode;
  difficulty: "Łatwe" | "Średnie";
  params: readonly string[];
  sample: readonly number[];
  cases: readonly (readonly number[])[];
  description: string;
  contract: string;
  hints: readonly [string, string];
  version: 1;
};

const sizes = [[60], [10], [120], [35], [97], [73]];
const counts = [
  [4, 30],
  [1, 10],
  [12, 120],
  [3, 40],
  [8, 17],
  [6, 83],
];

export const challenges: readonly Challenge[] = [
  {
    id: "kwadrat",
    title: "Kwadrat",
    mode: "2d",
    difficulty: "Łatwe",
    params: ["bok"],
    sample: [60],
    cases: sizes,
    version: 1,
    description:
      "Narysuj kwadrat od punktu (0, 0). Jego kolejne wierzchołki to (0, 0), (0, bok), (bok, bok), (bok, 0), a ostatni odcinek wraca do początku.",
    contract: "oto kwadrat :bok · bok: liczba całkowita od 10 do 120",
    hints: [
      "Potrzebujesz czterech boków o tej samej długości.",
      "Po każdym boku obróć żółwia w prawo o 90°.",
    ],
  },
  {
    id: "gwiazda",
    title: "Gwiazda",
    mode: "2d",
    difficulty: "Łatwe",
    params: ["bok"],
    sample: [90],
    cases: [[90], [10], [120], [35], [73], [101]],
    version: 1,
    description:
      "Narysuj pięcioramienną gwiazdę z pięciu równych odcinków. Zacznij w (0, 0), pierwszy odcinek poprowadź w górę osi Y. Po każdym odcinku obróć się w prawo o 144°.",
    contract: "oto gwiazda :bok · bok: liczba całkowita od 10 do 120",
    hints: [
      "Każde ramię ma tę samą długość.",
      "Powtórz pięć razy: naprzód o bok i w prawo o 144°.",
    ],
  },
  {
    id: "schody",
    title: "Schody",
    mode: "2d",
    difficulty: "Łatwe",
    params: ["n", "bok"],
    sample: [4, 30],
    cases: counts,
    version: 1,
    description:
      "Narysuj n stopni od (0, 0). Każdy stopień prowadzi najpierw o bok w górę osi Y, a potem o bok w prawo osi X. Odcinki łączą się bez przerw.",
    contract:
      "oto schody :n :bok · n: 1–12 · bok: 10–120 · tylko liczby całkowite",
    hints: [
      "Jeden stopień tworzą dwa odcinki pod kątem prostym.",
      "Po ruchu w górę obróć w prawo, przejdź bok i znów skieruj żółwia w górę.",
    ],
  },
  {
    id: "rzad",
    title: "Rząd kwadratów",
    mode: "2d",
    difficulty: "Średnie",
    params: ["n", "bok"],
    sample: [3, 40],
    cases: counts,
    version: 1,
    description:
      "Narysuj n oddzielnych kwadratów. Lewy dolny róg k-tego kwadratu ma współrzędne (2 × k × bok, 0), licząc k od zera. Boki są równoległe do osi; nie rysuj linii między kwadratami.",
    contract:
      "oto rzad :n :bok · n: 1–12 · bok: 10–120 · tylko liczby całkowite",
    hints: [
      "Po zamknięciu kwadratu wrócisz do jego lewego dolnego rogu.",
      "Podnieś pisak przed przejściem o 2 × bok do następnego początku.",
    ],
  },
  {
    id: "rozeta",
    title: "Rozeta",
    mode: "2d",
    difficulty: "Średnie",
    params: ["bok"],
    sample: [60],
    cases: sizes,
    version: 1,
    description:
      "Narysuj osiem kwadratów o wspólnym początku (0, 0). Pierwszy ma wierzchołki (0, 0), (0, bok), (bok, bok), (bok, 0). Każdy następny kwadrat obróć w lewo o 45° wokół początku.",
    contract: "oto rozeta :bok · bok: liczba całkowita od 10 do 120",
    hints: [
      "Po zamknięciu kwadratu żółw stoi znów w początku.",
      "Przed kolejnym kwadratem obróć się w lewo o 45°. Powtórz osiem razy.",
    ],
  },
  {
    id: "schody3d",
    title: "Schody 3D",
    mode: "3d",
    difficulty: "Średnie",
    params: ["n", "dlugosc", "wysokosc"],
    sample: [4, 40, 25],
    cases: [
      [4, 40, 25],
      [1, 10, 10],
      [12, 120, 120],
      [3, 55, 20],
      [8, 17, 73],
      [6, 83, 45],
    ],
    version: 1,
    description:
      "Narysuj n stopni w przestrzeni od (0, 0, 0). Każdy stopień biegnie najpierw o dlugosc wzdłuż dodatniej osi Y, a potem o wysokosc wzdłuż dodatniej osi Z. Wszystkie odcinki łączą się.",
    contract:
      "oto schody3d :n :dlugosc :wysokosc · n: 1–12 · długość i wysokość: 10–120 · tylko liczby całkowite",
    hints: [
      "Pierwszy ruch jest zgodny z początkowym kierunkiem żółwia.",
      "Po ruchu wzdłuż Y użyj nachylenia w górę o 90°, narysuj wysokość, potem wróć do kierunku Y.",
    ],
  },
];

export function starter(task: Challenge): string {
  return `; Napisz procedurę ${task.id}.\noto ${task.id} ${task.params.map((p) => `:${p}`).join(" ")}\n  ; Twój kod tutaj\njuż`;
}

type Edge = { from: Vec3; to: Vec3 };
const point = (x: number, y: number, z = 0): Vec3 => [x, y, z];
const edge = (from: Vec3, to: Vec3): Edge => ({ from, to });
function square(x: number, y: number, side: number): Edge[] {
  const vertices = [
    point(x, y),
    point(x, y + side),
    point(x + side, y + side),
    point(x + side, y),
    point(x, y),
  ];
  return vertices.slice(1).map((to, i) => edge(vertices[i], to));
}

export function expectedEdges(
  task: Challenge,
  args: readonly number[],
): Edge[] {
  const [first, second, third] = args;
  switch (task.id) {
    case "kwadrat":
      return square(0, 0, first);
    case "gwiazda": {
      const vertices: Vec3[] = [point(0, 0)];
      for (let i = 0; i < 5; i++) {
        const angle = (i * 144 * Math.PI) / 180;
        const previous = vertices.at(-1) as Vec3;
        vertices.push(
          point(
            previous[0] + first * Math.sin(angle),
            previous[1] + first * Math.cos(angle),
          ),
        );
      }
      return vertices.slice(1).map((to, i) => edge(vertices[i], to));
    }
    case "schody": {
      const result: Edge[] = [];
      for (let i = 0; i < first; i++) {
        result.push(
          edge(
            point(i * second, i * second),
            point(i * second, (i + 1) * second),
          ),
        );
        result.push(
          edge(
            point(i * second, (i + 1) * second),
            point((i + 1) * second, (i + 1) * second),
          ),
        );
      }
      return result;
    }
    case "rzad":
      return Array.from({ length: first }, (_, i) =>
        square(2 * i * second, 0, second),
      ).flat();
    case "rozeta": {
      const base = square(0, 0, first);
      return Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4;
        const rotate = ([x, y]: Vec3): Vec3 =>
          point(
            x * Math.cos(angle) - y * Math.sin(angle),
            x * Math.sin(angle) + y * Math.cos(angle),
          );
        return base.map(({ from, to }) => edge(rotate(from), rotate(to)));
      }).flat();
    }
    case "schody3d": {
      const result: Edge[] = [];
      for (let i = 0; i < first; i++) {
        result.push(
          edge(
            point(0, i * second, i * (third as number)),
            point(0, (i + 1) * second, i * (third as number)),
          ),
        );
        result.push(
          edge(
            point(0, (i + 1) * second, i * (third as number)),
            point(0, (i + 1) * second, (i + 1) * (third as number)),
          ),
        );
      }
      return result;
    }
    default:
      return [];
  }
}

export function expectedDrawing(
  task: Challenge,
  args: readonly number[],
): Segment[] {
  return expectedEdges(task, args).map(({ from, to }) => ({
    from,
    to,
    color: "#16866a",
    width: 3,
  }));
}
