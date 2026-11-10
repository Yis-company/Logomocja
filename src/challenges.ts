// Wyzwania i automatyczne sprawdzanie rysunków.
import { run, type Mode, type Segment, type Vec } from "./interp/machine";

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  level: 1 | 2 | 3;
  task: string;
  hint: string;
  /** Program wzorcowy — z niego powstaje oczekiwany rysunek. */
  solution: string;
  starter: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "trojkat", title: "Trójkąt", mode: "2d", level: 1,
    task: "Narysuj trójkąt równoboczny o boku 100.",
    hint: "Żółw skręca o kąt zewnętrzny: 360 / 3 = 120 stopni.",
    solution: "powtorz 3 [np 100 pw 120]",
    starter: "; Trójkąt równoboczny o boku 100\n",
  },
  {
    id: "prostokat", title: "Prostokąt", mode: "2d", level: 1,
    task: "Narysuj prostokąt o bokach 160 i 80 (dowolnie obrócony).",
    hint: "Dwa razy powtórz: długi bok, skręt o 90, krótki bok, skręt o 90.",
    solution: "powtorz 2 [np 80 pw 90 np 160 pw 90]",
    starter: "; Prostokąt 160 na 80\n",
  },
  {
    id: "szesciokat", title: "Sześciokąt", mode: "2d", level: 1,
    task: "Narysuj sześciokąt foremny o boku 60.",
    hint: "Sześć boków, a skręt to 360 / 6.",
    solution: "powtorz 6 [np 60 pw 60]",
    starter: "; Sześciokąt foremny o boku 60\n",
  },
  {
    id: "schodki", title: "Schodki", mode: "2d", level: 2,
    task: "Narysuj pięć schodków: każdy stopień ma 30 w górę i 30 w bok.",
    hint: "Jeden stopień to: np 30, skręt w prawo, np 30, skręt w lewo. Powtórz pięć razy.",
    solution: "powtorz 5 [np 30 pw 90 np 30 lw 90]",
    starter: "; Pięć schodków 30 na 30\n",
  },
  {
    id: "przerywana", title: "Linia przerywana", mode: "2d", level: 2,
    task: "Narysuj linię przerywaną: pięć kresek o długości 20, między nimi przerwy o długości 20.",
    hint: "Po każdej kresce podnieś pióro (pod), przejdź 20 i opuść je z powrotem (opu).",
    solution: "powtorz 5 [np 20 pod np 20 opu]",
    starter: "; Pięć kresek po 20, przerwy po 20\n",
  },
  {
    id: "gwiazda8", title: "Gwiazda ośmioramienna", mode: "2d", level: 2,
    task: "Narysuj gwiazdę o ośmiu ramionach: osiem odcinków o długości 150, po każdym skręt o 135 stopni.",
    hint: "To jedna pętla: powtorz 8 [ ... ].",
    solution: "powtorz 8 [np 150 pw 135]",
    starter: "; Gwiazda: 8 odcinków po 150, skręt 135\n",
  },
  {
    id: "kwadraty", title: "Rosnące kwadraty", mode: "2d", level: 3,
    task: "Napisz procedurę rysującą kwadrat i narysuj nią cztery kwadraty o bokach 40, 80, 120 i 160, wszystkie ze wspólnym narożnikiem.",
    hint: "oto kwadrat ma: bok … już, a potem powtorz 4 [kwadrat nrpowt * 40].",
    solution: "oto kwadrat ma: bok\n  powtorz 4 [np bok pw 90]\njuż\npowtorz 4 [kwadrat nrpowt * 40]",
    starter: "; Cztery kwadraty: 40, 80, 120, 160\noto kwadrat ma: bok\n  \njuż\n",
  },
  {
    id: "naroznik", title: "Narożnik", mode: "3d", level: 2,
    task: "Narysuj trzy krawędzie o długości 80 wychodzące z jednego punktu: w prawo, naprzód i do góry.",
    hint: "Po każdej krawędzi wróć (pod ws 80 opu albo po prostu ws 80). Do góry prowadzi „gora 90”.",
    solution: "np 80 ws 80 pw 90 np 80 ws 80 lw 90 gora 90 np 80",
    starter: "; Trzy krawędzie po 80: wzdłuż x, y i z\n",
  },
  {
    id: "wieza", title: "Wieża", mode: "3d", level: 3,
    task: "Narysuj trzy kwadraty o boku 100, jeden nad drugim: na wysokości 0, 50 i 100.",
    hint: "Po każdym kwadracie podnieś pióro, wejdź o 50 wyżej (gora 90, np 50, dol 90) i opuść pióro.",
    solution: "powtorz 3 [powtorz 4 [np 100 pw 90] pod gora 90 np 50 dol 90 opu]",
    starter: "; Trzy kwadraty o boku 100 na wysokościach 0, 50 i 100\n",
  },
];

export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

const targets = new Map<string, Segment[]>();
export function targetOf(ch: Challenge): Segment[] {
  let t = targets.get(ch.id);
  if (!t) { t = run(ch.solution, ch.mode).segments; targets.set(ch.id, t); }
  return t;
}

// ---- sprawdzanie ----

export interface Verdict { pass: boolean; reason: string }

const TOL = 2.5;

function sample(segs: Segment[], step: number): Vec[] {
  const out: Vec[] = [];
  for (const s of segs) {
    const d = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
    const n = Math.max(1, Math.ceil(d / step));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      out.push([s.from[0] + (s.to[0] - s.from[0]) * t, s.from[1] + (s.to[1] - s.from[1]) * t, s.from[2] + (s.to[2] - s.from[2]) * t]);
    }
  }
  return out;
}

function dist2ToSeg(p: Vec, s: Segment): number {
  const ax = s.from[0], ay = s.from[1], az = s.from[2];
  const dx = s.to[0] - ax, dy = s.to[1] - ay, dz = s.to[2] - az;
  const len2 = dx * dx + dy * dy + dz * dz;
  let t = len2 ? ((p[0] - ax) * dx + (p[1] - ay) * dy + (p[2] - az) * dz) / len2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const ex = p[0] - ax - dx * t, ey = p[1] - ay - dy * t, ez = p[2] - az - dz * t;
  return ex * ex + ey * ey + ez * ez;
}

/** Jaka część punktów leży dalej niż tolerancja od zbioru odcinków. */
function missFraction(points: Vec[], segs: Segment[], tol: number): number {
  if (!points.length) return 0;
  const t2 = tol * tol;
  let miss = 0, hint = 0;
  for (const p of points) {
    let ok = false;
    // najpierw odcinek, który pasował ostatnio — sąsiednie punkty zwykle trafiają w ten sam
    if (dist2ToSeg(p, segs[hint]) <= t2) ok = true;
    else for (let i = 0; i < segs.length; i++) if (dist2ToSeg(p, segs[i]) <= t2) { ok = true; hint = i; break; }
    if (!ok) miss++;
  }
  return miss / points.length;
}

function bbox(segs: Segment[]): { min: Vec; max: Vec } {
  const min: Vec = [Infinity, Infinity, Infinity], max: Vec = [-Infinity, -Infinity, -Infinity];
  for (const s of segs) for (const p of [s.from, s.to]) for (let i = 0; i < 3; i++) { if (p[i] < min[i]) min[i] = p[i]; if (p[i] > max[i]) max[i] = p[i]; }
  return { min, max };
}

function totalLength(segs: Segment[]): number {
  let l = 0;
  for (const s of segs) l += Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
  return l;
}

type Xf = (p: Vec) => Vec;
/** Dopuszczalne ułożenia: w 2D obroty o 90° i odbicia; w 3D obroty o 90° wokół osi pionowej. */
function transforms(mode: Mode): Xf[] {
  const rots: Xf[] = [(p) => [p[0], p[1], p[2]], (p) => [-p[1], p[0], p[2]], (p) => [-p[0], -p[1], p[2]], (p) => [p[1], -p[0], p[2]]];
  if (mode === "3d") return rots;
  return [...rots, ...rots.map((r): Xf => (p) => { const q = r(p); return [-q[0], q[1], q[2]]; })];
}

function apply(segs: Segment[], xf: Xf, shift: Vec): Segment[] {
  const mv = (p: Vec): Vec => { const q = xf(p); return [q[0] + shift[0], q[1] + shift[1], q[2] + shift[2]]; };
  return segs.map((s) => ({ from: mv(s.from), to: mv(s.to), color: s.color, width: s.width }));
}

/** Porównuje rysunek z wzorem. Kolejność, kolory, położenie i obrót o 90° nie mają znaczenia. */
export function compare(user: Segment[], target: Segment[], mode: Mode): Verdict {
  if (!user.length) return { pass: false, reason: "Rysunek jest pusty — żółw nic jeszcze nie narysował." };
  if (user.length > 4000) return { pass: false, reason: "Rysunek ma o wiele za dużo odcinków jak na to zadanie." };
  const tb = bbox(target);
  const tc: Vec = [(tb.min[0] + tb.max[0]) / 2, (tb.min[1] + tb.max[1]) / 2, (tb.min[2] + tb.max[2]) / 2];
  const tLen = totalLength(target);
  const step = Math.max(1, tLen / 600);
  const tPts = sample(target, step);
  let best = { extra: 1, missing: 1 };
  for (const xf of transforms(mode)) {
    const turned = apply(user, xf, [0, 0, 0]);
    const ub = bbox(turned);
    const shift: Vec = [tc[0] - (ub.min[0] + ub.max[0]) / 2, tc[1] - (ub.min[1] + ub.max[1]) / 2, tc[2] - (ub.min[2] + ub.max[2]) / 2];
    const placed = apply(turned, (p) => p, shift);
    const extra = missFraction(sample(placed, step), target, TOL);
    const missing = missFraction(tPts, placed, TOL);
    if (extra + missing < best.extra + best.missing) best = { extra, missing };
    if (extra === 0 && missing === 0) break;
  }
  if (best.extra <= 0.01 && best.missing <= 0.01) return { pass: true, reason: "Brawo! Rysunek zgadza się ze wzorem." };

  // podpowiedź: może dobry kształt, zła wielkość?
  const ub = bbox(user);
  const size = (b: { min: Vec; max: Vec }) => Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]);
  const ratio = size(ub) / Math.max(1e-9, size(tb));
  if (ratio > 0 && Math.abs(ratio - 1) > 0.04) {
    const scaled = apply(user, (p) => [p[0] / ratio, p[1] / ratio, p[2] / ratio], [0, 0, 0]);
    const again = compareExact(scaled, target, mode, step, tPts, tc);
    if (again) return { pass: false, reason: ratio > 1 ? "Kształt jest dobry, ale za duży — sprawdź długości." : "Kształt jest dobry, ale za mały — sprawdź długości." };
  }
  if (best.missing > 0.01 && best.extra <= 0.01)
    return { pass: false, reason: `Jeszcze nie: brakuje części wzoru (około ${Math.round(best.missing * 100)}%).` };
  if (best.extra > 0.01 && best.missing <= 0.01)
    return { pass: false, reason: "Jeszcze nie: wzór jest cały, ale narysowano też kreski, których w nim nie ma." };
  return { pass: false, reason: "Jeszcze nie: rysunek różni się od wzoru. Porównaj go z szarym śladem na planszy." };
}

function compareExact(user: Segment[], target: Segment[], mode: Mode, step: number, tPts: Vec[], tc: Vec): boolean {
  for (const xf of transforms(mode)) {
    const turned = apply(user, xf, [0, 0, 0]);
    const ub = bbox(turned);
    const shift: Vec = [tc[0] - (ub.min[0] + ub.max[0]) / 2, tc[1] - (ub.min[1] + ub.max[1]) / 2, tc[2] - (ub.min[2] + ub.max[2]) / 2];
    const placed = apply(turned, (p) => p, shift);
    if (missFraction(sample(placed, step), target, TOL) <= 0.01 && missFraction(tPts, placed, TOL) <= 0.01) return true;
  }
  return false;
}

/** Uruchamia program ucznia i ocenia go. */
export function check(ch: Challenge, source: string): Verdict {
  if (!source.trim()) return { pass: false, reason: "Najpierw napisz program." };
  const res = run(source, ch.mode);
  if (res.error)
    return { pass: false, reason: `Program zatrzymał się z błędem (wiersz ${res.error.line}, kolumna ${res.error.column}): ${res.error.message}` };
  return compare(res.segments, targetOf(ch), ch.mode);
}
