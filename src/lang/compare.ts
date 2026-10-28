import type { Segment, Vec3 } from './interpreter';

/** Odległość punktu od odcinka w przestrzeni. */
export function pointSegmentDistance(p: Vec3, a: Vec3, b: Vec3): number {
  const abx = b[0] - a[0];
  const aby = b[1] - a[1];
  const abz = b[2] - a[2];
  const len2 = abx * abx + aby * aby + abz * abz;
  let t = 0;
  if (len2 > 0) {
    t = ((p[0] - a[0]) * abx + (p[1] - a[1]) * aby + (p[2] - a[2]) * abz) / len2;
    t = Math.max(0, Math.min(1, t));
  }
  const dx = a[0] + abx * t - p[0];
  const dy = a[1] + aby * t - p[1];
  const dz = a[2] + abz * t - p[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Siatka przestrzenna przyspieszająca szukanie odcinków w pobliżu punktu. */
class SegmentIndex {
  private readonly cells = new Map<string, Segment[]>();
  private readonly big: Segment[] = [];

  constructor(
    segments: Segment[],
    private readonly cell: number,
  ) {
    for (const s of segments) {
      const lo = [0, 1, 2].map((k) => Math.floor(Math.min(s.from[k], s.to[k]) / cell));
      const hi = [0, 1, 2].map((k) => Math.floor(Math.max(s.from[k], s.to[k]) / cell));
      const count = (hi[0] - lo[0] + 1) * (hi[1] - lo[1] + 1) * (hi[2] - lo[2] + 1);
      if (count > 512) {
        this.big.push(s);
        continue;
      }
      for (let x = lo[0]; x <= hi[0]; x++)
        for (let y = lo[1]; y <= hi[1]; y++)
          for (let z = lo[2]; z <= hi[2]; z++) {
            const key = `${x},${y},${z}`;
            let list = this.cells.get(key);
            if (!list) this.cells.set(key, (list = []));
            list.push(s);
          }
    }
  }

  /** Odcinki w odległości co najwyżej `r` (r ≤ rozmiar komórki). */
  near(p: Vec3, r: number, accept: (s: Segment) => boolean = () => true): boolean {
    const c = [0, 1, 2].map((k) => Math.floor(p[k] / this.cell));
    for (let x = c[0] - 1; x <= c[0] + 1; x++)
      for (let y = c[1] - 1; y <= c[1] + 1; y++)
        for (let z = c[2] - 1; z <= c[2] + 1; z++) {
          const list = this.cells.get(`${x},${y},${z}`);
          if (!list) continue;
          for (const s of list) if (pointSegmentDistance(p, s.from, s.to) <= r && accept(s)) return true;
        }
    for (const s of this.big) if (pointSegmentDistance(p, s.from, s.to) <= r && accept(s)) return true;
    return false;
  }
}

function samples(s: Segment, step: number): Vec3[] {
  const len = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
  const n = Math.max(1, Math.min(2000, Math.ceil(len / step)));
  const out: Vec3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push([
      s.from[0] + (s.to[0] - s.from[0]) * t,
      s.from[1] + (s.to[1] - s.from[1]) * t,
      s.from[2] + (s.to[2] - s.from[2]) * t,
    ]);
  }
  return out;
}

export type CompareResult =
  | { ok: true }
  | { ok: false; kind: 'missing' | 'extra' | 'color'; at: Vec3; expectedColor?: string };

/**
 * Porównuje rysunki jako zbiory punktów: kolejność, kierunek i podział
 * odcinków nie mają znaczenia. Każdy punkt wzoru musi leżeć blisko linii
 * użytkownika i odwrotnie (z tolerancją `tol` jednostek).
 */
export function compareDrawings(expected: Segment[], actual: Segment[], opts: { tol?: number; colors?: boolean } = {}): CompareResult {
  const tol = opts.tol ?? 1.5;
  const step = 2;
  const actualIdx = new SegmentIndex(actual, Math.max(tol, 8));
  // zgłaszamy środek brakującego (lub nadmiarowego) fragmentu
  const firstGap = (segs: Segment[], idx: SegmentIndex): Vec3 | null => {
    for (const s of segs) {
      const miss = samples(s, step).filter((p) => !idx.near(p, tol));
      if (miss.length) return miss[Math.floor(miss.length / 2)];
    }
    return null;
  };
  const missing = firstGap(expected, actualIdx);
  if (missing) return { ok: false, kind: 'missing', at: missing };
  const extra = firstGap(actual, new SegmentIndex(expected, Math.max(tol, 8)));
  if (extra) return { ok: false, kind: 'extra', at: extra };
  if (opts.colors) {
    for (const s of expected) {
      const pts = samples(s, step);
      // pomijamy końce — w narożnikach stykają się odcinki różnych kolorów
      for (const p of pts.slice(1, -1).length ? pts.slice(1, -1) : pts) {
        if (!actualIdx.near(p, tol, (a) => a.color === s.color)) {
          return { ok: false, kind: 'color', at: p, expectedColor: s.color };
        }
      }
    }
  }
  return { ok: true };
}
