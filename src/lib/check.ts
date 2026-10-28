import type { Segment, Vec3 } from '../lang/interp';

export interface CheckOptions {
  /** Maksymalna odległość (jednostki żółwia), przy której punkt uznajemy za pokryty. */
  tolerance?: number;
  /** Minimalny udział pokrytych punktów (0-1). */
  threshold?: number;
}

export interface CheckResult {
  ok: boolean;
  coverage: number;
  precision: number;
  reason: string;
}

function dist2(p: Vec3, a: Vec3, b: Vec3): number {
  const abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2];
  const apx = p[0] - a[0], apy = p[1] - a[1], apz = p[2] - a[2];
  const l2 = abx * abx + aby * aby + abz * abz;
  let t = l2 === 0 ? 0 : (apx * abx + apy * aby + apz * abz) / l2;
  t = Math.max(0, Math.min(1, t));
  const dx = apx - t * abx, dy = apy - t * aby, dz = apz - t * abz;
  return dx * dx + dy * dy + dz * dz;
}

function samples(segs: Segment[], step: number): Vec3[] {
  const out: Vec3[] = [];
  for (const s of segs) {
    const [a, b] = [s.from, s.to];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const n = Math.max(1, Math.ceil(len / step));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
    }
  }
  return out;
}

/** Jaka część punktów zbioru `from` leży w pobliżu odcinków `onto`. */
function covered(from: Segment[], onto: Segment[], tol: number): number {
  const pts = samples(from, Math.max(tol, 1));
  if (!pts.length) return 1;
  const t2 = tol * tol;
  let hit = 0;
  for (const p of pts) {
    for (const s of onto) {
      if (dist2(p, s.from, s.to) <= t2) { hit++; break; }
    }
  }
  return hit / pts.length;
}

export function compareDrawings(user: Segment[], expected: Segment[], opts: CheckOptions = {}): CheckResult {
  const tol = opts.tolerance ?? 3;
  const threshold = opts.threshold ?? 0.97;
  if (!user.length) {
    return { ok: false, coverage: 0, precision: 0, reason: 'Nic jeszcze nie narysowano: uruchom program, który rysuje wzór.' };
  }
  const coverage = covered(expected, user, tol);
  const precision = covered(user, expected, tol);
  const pc = (x: number) => `${Math.round(x * 100)}%`;
  if (coverage < threshold) {
    return {
      ok: false, coverage, precision,
      reason: `Brakuje części wzoru: pokryto ${pc(coverage)} linii wzorca. Sprawdź długości boków i kąty skrętu.`,
    };
  }
  if (precision < threshold) {
    return {
      ok: false, coverage, precision,
      reason: `Na rysunku są linie spoza wzoru: tylko ${pc(precision)} rysunku leży na wzorcu. Usuń zbędne ruchy.`,
    };
  }
  return { ok: true, coverage, precision, reason: 'Rysunek zgadza się ze wzorem. Brawo!' };
}
