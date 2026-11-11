import type { Segment, Vec3 } from "./interp";

export interface CheckResult {
  pass: boolean;
  reason: string;
  /** część wzoru pokryta rysunkiem, 0..1 */
  covered: number;
  /** część rysunku leżąca poza wzorem, 0..1 */
  extra: number;
}

function distToSegment(p: Vec3, s: Segment): number {
  const ax = s.from[0], ay = s.from[1], az = s.from[2];
  const dx = s.to[0] - ax, dy = s.to[1] - ay, dz = s.to[2] - az;
  const len2 = dx * dx + dy * dy + dz * dz;
  let t = len2 === 0 ? 0 : ((p[0] - ax) * dx + (p[1] - ay) * dy + (p[2] - az) * dz) / len2;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const x = ax + dx * t - p[0], y = ay + dy * t - p[1], z = az + dz * t - p[2];
  return Math.sqrt(x * x + y * y + z * z);
}

function totalLength(segs: Segment[]): number {
  let sum = 0;
  for (const s of segs) sum += Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
  return sum;
}

function samples(segs: Segment[], step: number): Vec3[] {
  const out: Vec3[] = [];
  for (const s of segs) {
    const len = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
    const n = Math.max(1, Math.ceil(len / step));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      out.push([
        s.from[0] + (s.to[0] - s.from[0]) * t,
        s.from[1] + (s.to[1] - s.from[1]) * t,
        s.from[2] + (s.to[2] - s.from[2]) * t,
      ]);
    }
  }
  return out;
}

/** Jaka część punktów leżących na `a` znajduje się w odległości `tol` od rysunku `b`. */
function coverage(a: Segment[], b: Segment[], tol: number): number {
  const len = totalLength(a);
  if (len === 0) return 1;
  const pts = samples(a, Math.max(1, len / 1200));
  let hit = 0;
  for (const p of pts) {
    for (let i = 0; i < b.length; i++) {
      if (distToSegment(p, b[i]) <= tol) {
        hit++;
        break;
      }
    }
  }
  return hit / pts.length;
}

function size(segs: Segment[]): number {
  let lo: Vec3 = [Infinity, Infinity, Infinity];
  let hi: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const s of segs) for (const p of [s.from, s.to]) for (let i = 0; i < 3; i++) {
    if (p[i] < lo[i]) lo[i] = p[i];
    if (p[i] > hi[i]) hi[i] = p[i];
  }
  return Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);
}

const pct = (v: number) => `${Math.round(v * 100)}%`;

/**
 * Porównuje rysunek ze wzorem jako zbiory punktów: nie liczy się kolejność odcinków, ich kierunek,
 * podział na części, kolor ani grubość. Liczy się kształt, rozmiar i położenie względem punktu startu.
 */
export function compareDrawings(user: Segment[], target: Segment[], tol = 1.5): CheckResult {
  if (user.length === 0) {
    return { pass: false, covered: 0, extra: 0, reason: "Na arkuszu nie ma żadnej kreski. Narysuj wzór i sprawdź ponownie." };
  }
  const covered = coverage(target, user, tol);
  const extra = 1 - coverage(user, target, tol);
  const okCover = covered >= 0.99;
  const okExtra = extra <= 0.01;
  if (okCover && okExtra) {
    return { pass: true, covered, extra, reason: "Rysunek zgadza się ze wzorem." };
  }
  const a = size(user);
  const b = size(target);
  let hint = "";
  if (covered < 0.5 && b > 0 && Math.abs(a / b - 1) > 0.08) {
    hint = a < b ? " Rysunek jest mniejszy od wzoru: sprawdź długości." : " Rysunek jest większy od wzoru: sprawdź długości.";
  } else if (covered < 0.5) {
    hint = " Sprawdź kąty i kierunek pierwszego ruchu.";
  }
  if (!okCover && !okExtra) {
    return { pass: false, covered, extra, reason: `Rysunek pokrywa ${pct(covered)} wzoru, a ${pct(extra)} kresek leży poza nim.${hint}` };
  }
  if (!okCover) {
    return { pass: false, covered, extra, reason: `Brakuje części wzoru: rysunek pokrywa ${pct(covered)} przerywanej linii.${hint}` };
  }
  return { pass: false, covered, extra, reason: `Wzór jest pokryty, ale ${pct(Math.max(extra, 0.01))} kresek leży poza nim. Usuń zbędne linie albo podnieś pisak przy przejściach.` };
}
