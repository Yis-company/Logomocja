// Automatyczne sprawdzanie wyzwań: porównanie rysunku użytkownika ze wzorem.
//
// Rysunki porównujemy geometrycznie, a nie program ze wzorcowym programem:
// obie linie łamane są próbkowane co kilka jednostek, a następnie sprawdzamy,
// czy (1) każdy punkt wzoru leży blisko rysunku użytkownika (pokrycie) oraz
// (2) każdy punkt rysunku użytkownika leży blisko wzoru (precyzja).
// Kolejność rysowania, kierunek, podział na odcinki i grubość nie mają znaczenia.

import type { Segment, Vec3 } from '../lang';

export interface CheckOptions {
  /** Maksymalne odchylenie w jednostkach; domyślnie 2% przekątnej wzoru (min. 1,5). */
  tolerance?: number;
  /** Czy kolory mają się zgadzać. */
  colors?: boolean;
  /** Minimalny odsetek zgodnych punktów (0–1). */
  threshold?: number;
}

export interface CheckResult {
  pass: boolean;
  reason: string;
  coverage: number;
  precision: number;
  colorMatch: number | null;
}

const MAX_SAMPLES = 2500;

interface Sample {
  p: Vec3;
  color: string;
}

function length(s: Segment): number {
  return Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
}

function sample(segs: Segment[], spacing: number): Sample[] {
  let total = 0;
  for (const s of segs) total += Math.max(1, Math.ceil(length(s) / spacing));
  const sp = total > MAX_SAMPLES ? spacing * (total / MAX_SAMPLES) : spacing;
  const out: Sample[] = [];
  for (const s of segs) {
    const n = Math.max(1, Math.ceil(length(s) / sp));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      out.push({
        p: [
          s.from[0] + (s.to[0] - s.from[0]) * t,
          s.from[1] + (s.to[1] - s.from[1]) * t,
          s.from[2] + (s.to[2] - s.from[2]) * t,
        ],
        color: s.color,
      });
    }
  }
  return out;
}

function distToSegment(p: Vec3, s: Segment): number {
  const ax = s.from[0];
  const ay = s.from[1];
  const az = s.from[2];
  const dx = s.to[0] - ax;
  const dy = s.to[1] - ay;
  const dz = s.to[2] - az;
  const l2 = dx * dx + dy * dy + dz * dz;
  let t = l2 > 0 ? ((p[0] - ax) * dx + (p[1] - ay) * dy + (p[2] - az) * dz) / l2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const x = ax + dx * t - p[0];
  const y = ay + dy * t - p[1];
  const z = az + dz * t - p[2];
  return Math.sqrt(x * x + y * y + z * z);
}

interface Match {
  ok: boolean;
  colorOk: boolean;
}

function matchSamples(
  samples: Sample[],
  against: Segment[],
  tol: number,
): { matched: Match[]; firstMiss: Sample | null; misses: number } {
  const matched: Match[] = [];
  let firstMiss: Sample | null = null;
  let misses = 0;
  for (const s of samples) {
    let ok = false;
    let colorOk = false;
    for (const seg of against) {
      if (distToSegment(s.p, seg) <= tol) {
        ok = true;
        if (seg.color === s.color) {
          colorOk = true;
          break;
        }
      }
    }
    matched.push({ ok, colorOk });
    if (!ok) {
      misses++;
      if (!firstMiss) firstMiss = s;
    }
  }
  return { matched, firstMiss, misses };
}

function where(s: Sample | null): string {
  if (!s) return '';
  const r = (v: number) => Math.round(v);
  return ` Np. w okolicy punktu (${r(s.p[0])}, ${r(s.p[1])}${Math.abs(s.p[2]) > 0.5 ? `, ${r(s.p[2])}` : ''}).`;
}

export function compareDrawings(user: Segment[], target: Segment[], options: CheckOptions = {}): CheckResult {
  const threshold = options.threshold ?? 0.97;
  if (user.length === 0) {
    return {
      pass: false,
      reason: 'Nic nie narysowano. Uruchom program, który rysuje wzór.',
      coverage: 0,
      precision: 0,
      colorMatch: null,
    };
  }
  const mn: Vec3 = [Infinity, Infinity, Infinity];
  const mx: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const s of target) {
    for (const p of [s.from, s.to]) {
      for (let i = 0; i < 3; i++) {
        mn[i] = Math.min(mn[i], p[i]);
        mx[i] = Math.max(mx[i], p[i]);
      }
    }
  }
  const diag = Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]);
  const tol = options.tolerance ?? Math.max(1.5, diag * 0.02);
  const spacing = Math.max(tol, 1);

  const cover = matchSamples(sample(target, spacing), user, tol);
  const prec = matchSamples(sample(user, spacing), target, tol);
  const coverage = 1 - cover.misses / cover.matched.length;
  const precision = 1 - prec.misses / prec.matched.length;

  let colorMatch: number | null = null;
  if (options.colors) {
    const okColors = cover.matched.filter((m) => m.ok && m.colorOk).length;
    colorMatch = okColors / cover.matched.length;
  }

  const pct = (v: number) => `${Math.floor(v * 100)}%`;
  const reasons: string[] = [];
  if (coverage < threshold) {
    reasons.push(
      `Brakuje części wzoru (narysowano ${pct(coverage)} jego linii).${where(cover.firstMiss)}`,
    );
  }
  if (precision < threshold) {
    reasons.push(
      `W rysunku są linie, których nie ma we wzorze (${pct(precision)} rysunku leży na wzorze).${where(prec.firstMiss)}`,
    );
  }
  if (reasons.length === 0 && colorMatch !== null && colorMatch < threshold) {
    reasons.push(`Kształt się zgadza, ale kolory różnią się od wzoru (zgodnych ${pct(colorMatch)}).`);
  }
  if (reasons.length === 0) {
    return { pass: true, reason: 'Rysunek zgadza się ze wzorem.', coverage, precision, colorMatch };
  }
  return { pass: false, reason: reasons.join(' '), coverage, precision, colorMatch };
}
