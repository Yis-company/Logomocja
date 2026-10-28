import type { Segment, Vec3 } from './types';

export interface CheckResult {
  ok: boolean;
  reason: string;
  /** Places where the expected drawing is not covered. */
  missing: Vec3[];
  /** Places where the user drew something that is not expected. */
  extra: Vec3[];
}

type Seg = [Vec3, Vec3];

const len = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function real(segs: Segment[]): Seg[] {
  return segs.filter((s) => len(s.from, s.to) > 1e-9).map((s) => [s.from, s.to] as Seg);
}

function sample(segs: Seg[], step: number): Vec3[] {
  const pts: Vec3[] = [];
  for (const [a, b] of segs) {
    const n = Math.max(1, Math.ceil(len(a, b) / step));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
    }
  }
  return pts;
}

function distPointSeg(p: Vec3, a: Vec3, b: Vec3): number {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const l2 = dx * dx + dy * dy + dz * dz;
  let t = l2 === 0 ? 0 : ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy + (p[2] - a[2]) * dz) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + dx * t), p[1] - (a[1] + dy * t), p[2] - (a[2] + dz * t));
}

function uncovered(points: Vec3[], segs: Seg[], tol: number): Vec3[] {
  const out: Vec3[] = [];
  for (const p of points) {
    let ok = false;
    for (const [a, b] of segs) {
      if (
        p[0] < Math.min(a[0], b[0]) - tol || p[0] > Math.max(a[0], b[0]) + tol ||
        p[1] < Math.min(a[1], b[1]) - tol || p[1] > Math.max(a[1], b[1]) + tol ||
        p[2] < Math.min(a[2], b[2]) - tol || p[2] > Math.max(a[2], b[2]) + tol
      ) continue;
      if (distPointSeg(p, a, b) <= tol) { ok = true; break; }
    }
    if (!ok) out.push(p);
  }
  return out;
}

/** Up to `n` representative points that are at least `gap` apart. */
function spread(points: Vec3[], n: number, gap: number): Vec3[] {
  const out: Vec3[] = [];
  for (const p of points) {
    if (out.every((q) => len(p, q) > gap)) out.push(p);
    if (out.length >= n) break;
  }
  return out;
}

/**
 * Compares two drawings as sets of strokes, ignoring colour, width, direction and
 * how strokes are split. Every part of one must lie within `tol` of the other.
 */
export function compareDrawings(expected: Segment[], actual: Segment[], tol = 1.5): CheckResult {
  const e = real(expected);
  const a = real(actual);
  if (!a.length) return { ok: false, reason: 'Nic nie narysowano – wzór wymaga narysowania linii (pamiętaj o opuszczonym piórze).', missing: [], extra: [] };
  const total = [...e, ...a].reduce((s, [p, q]) => s + len(p, q), 0);
  const step = Math.max(tol / 2, total / 4000);
  const ep = sample(e, step);
  const ap = sample(a, step);
  const missing = uncovered(ep, a, tol);
  const extra = uncovered(ap, e, tol);
  const mp = (missing.length / ep.length) * 100;
  const xp = (extra.length / ap.length) * 100;
  const fmt = (v: number) => (v < 1 ? 'mniej niż 1%' : `około ${Math.round(v)}%`);
  const gap = Math.max(tol * 4, Math.sqrt(total) );
  if (!missing.length && !extra.length) return { ok: true, reason: 'Rysunek zgadza się ze wzorem.', missing: [], extra: [] };
  let reason: string;
  if (missing.length && extra.length) {
    reason = `Rysunek różni się od wzoru: brakuje ${fmt(mp)} wzoru, a ${fmt(xp)} narysowanych linii leży poza wzorem.`;
  } else if (missing.length) {
    reason = `Brakuje części wzoru (${fmt(mp)}). Sprawdź długości boków i kąty skrętu – czerwone kółka pokazują puste miejsca.`;
  } else {
    reason = `Narysowano za dużo: ${fmt(xp)} linii leży poza wzorem. Czerwone kółka pokazują nadmiarowe miejsca.`;
  }
  return { ok: false, reason, missing: spread(missing, 4, gap), extra: spread(extra, 4, gap) };
}
