import type { Mode } from "./lang/parser";
import { run, type Segment, type Vec } from "./lang/interp";

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  task: string;
  hint: string;
  /** reference solution (not shown to the learner) */
  solution: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "trojkat",
    title: "Trójkąt",
    mode: "2d",
    task: "Narysuj trójkąt równoboczny o boku 100. Zacznij w punkcie startowym i idź najpierw prosto w górę, potem skręcaj w prawo.",
    hint: "Suma kątów zewnętrznych to 360°. Ile wynosi jeden skręt?",
    solution: "powtorz 3 [np 100 pw 120]",
  },
  {
    id: "prostokat",
    title: "Prostokąt",
    mode: "2d",
    task: "Narysuj prostokąt o wysokości 150 i szerokości 80. Wysokość biegnie w górę od punktu startowego, szerokość w prawo.",
    hint: "Powtórz dwa razy: dłuższy bok, skręt, krótszy bok, skręt.",
    solution: "powtorz 2 [np 150 pw 90 np 80 pw 90]",
  },
  {
    id: "szesciokat",
    title: "Sześciokąt",
    mode: "2d",
    task: "Narysuj sześciokąt foremny o boku 60, zaczynając w górę i skręcając w prawo.",
    hint: "Sześć boków, każdy skręt to 360 / 6.",
    solution: "powtorz 6 [np 60 pw 60]",
  },
  {
    id: "schodki",
    title: "Schodki",
    mode: "2d",
    task: "Narysuj pięć schodków: każdy ma 20 w górę i 20 w prawo. Zacznij od kroku w górę.",
    hint: "W pętli: np, pw 90, np, lw 90.",
    solution: "powtorz 5 [np 20 pw 90 np 20 lw 90]",
  },
  {
    id: "domek",
    title: "Domek",
    mode: "2d",
    task: "Narysuj domek: kwadrat o boku 100 (w górę i w prawo od startu), a na nim dach — trójkąt równoboczny o boku 100.",
    hint: "Po narysowaniu ściany w górę skręć o 30°, narysuj dwa boki dachu, a potem dokończ kwadrat.",
    solution: "np 100 pw 30 np 100 pw 120 np 100 pw 30 np 100 pw 90 np 100 pw 90 np 100 pw 90 np 100",
  },
  {
    id: "kropki",
    title: "Linia przerywana",
    mode: "2d",
    task: "Narysuj w górę linię przerywaną długości 200: dziesięć kresek po 10, a między nimi przerwy po 10.",
    hint: "Użyj pod i opu wewnątrz powtórz.",
    solution: "powtorz 10 [np 10 pod np 10 opu]",
  },
  {
    id: "ramka3d",
    title: "Pionowa ramka",
    mode: "3d",
    task: "W trybie 3D narysuj kwadrat o boku 80 stojący pionowo: pierwszy bok biegnie w górę osi Z, potem kwadrat zamyka się po stronie +Y.",
    hint: "Najpierw gora 90, potem kwadrat, w którym zamiast pw skręcasz poleceniem dol 90.",
    solution: "gora 90 powtorz 4 [np 80 dol 90]",
  },
  {
    id: "spirala-kw",
    title: "Kwadratowa spirala",
    mode: "2d",
    task: "Narysuj kwadratową spiralę z 20 odcinków: pierwszy ma długość 5, każdy następny jest o 5 dłuższy. Skręcaj w prawo o 90°.",
    hint: "nrpowt * 5 to długość odcinka.",
    solution: "powtorz 20 [np nrpowt * 5 pw 90]",
  },
];

const TOL = 2;
const STEP = 2;

function sample(segs: Segment[]): Vec[] {
  const pts: Vec[] = [];
  for (const s of segs) {
    const d = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
    const n = Math.max(1, Math.ceil(d / STEP));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push([s.from[0] + (s.to[0] - s.from[0]) * t, s.from[1] + (s.to[1] - s.from[1]) * t, s.from[2] + (s.to[2] - s.from[2]) * t]);
    }
  }
  return pts;
}

function distToSeg(p: Vec, s: Segment): number {
  const a = s.from;
  const ab = [s.to[0] - a[0], s.to[1] - a[1], s.to[2] - a[2]];
  const ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
  const len2 = ab[0]! ** 2 + ab[1]! ** 2 + ab[2]! ** 2;
  let t = len2 === 0 ? 0 : (ap[0]! * ab[0]! + ap[1]! * ab[1]! + ap[2]! * ab[2]!) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(ap[0]! - ab[0]! * t, ap[1]! - ab[1]! * t, ap[2]! - ab[2]! * t);
}

const near = (p: Vec, segs: Segment[]) => segs.some((s) => distToSeg(p, s) <= TOL);
const fmtP = (p: Vec, mode: Mode) =>
  mode === "2d" ? `(${Math.round(p[0])}, ${Math.round(p[1])})` : `(${Math.round(p[0])}, ${Math.round(p[1])}, ${Math.round(p[2])})`;

export interface Verdict {
  pass: boolean;
  reason: string;
}

export function targetSegments(c: Challenge): Segment[] {
  return run(c.solution, c.mode).segments;
}

/** Compare the learner's drawing with the expected one (shape and position, tolerance 2 units). */
export function check(c: Challenge, source: string): Verdict {
  const res = run(source, c.mode);
  if (res.error) return { pass: false, reason: `Program ma błąd (linia ${res.error.line}, kolumna ${res.error.column}): ${res.error.message}` };
  const user = res.segments;
  if (user.length === 0) return { pass: false, reason: "Program nic nie narysował." };
  const target = targetSegments(c);
  const missing = sample(target).find((p) => !near(p, user));
  if (missing) return { pass: false, reason: `Brakuje części rysunku w okolicy punktu ${fmtP(missing, c.mode)}.` };
  const extra = sample(user).find((p) => !near(p, target));
  if (extra) return { pass: false, reason: `Rysunek ma linię, której nie powinno być — w okolicy punktu ${fmtP(extra, c.mode)}.` };
  return { pass: true, reason: "Brawo! Rysunek zgadza się z wzorem." };
}
