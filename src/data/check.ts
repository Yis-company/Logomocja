import type { Segment, Vec3 } from '../lang/turtle';

/** Automatyczne porównanie rysunku użytkownika ze wzorcem. */

export interface CheckOptions {
  /** Tolerancja odległości w jednostkach rysunku (domyślnie ~1,2% przekątnej wzoru). */
  tolerance?: number;
  /** Czy kolor linii ma się zgadzać ze wzorcem. */
  colorMatters?: boolean;
}

export interface CheckResult {
  ok: boolean;
  /** Zgodność 0–100. */
  score: number;
  reason: string;
  missing: number;
  extra: number;
  tolerance: number;
}

const PASS_LIMIT = 0.02;
const MAX_SAMPLES = 5000;

function pointSegDist(p: Vec3, a: Vec3, b: Vec3): number {
  const abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2];
  const apx = p[0] - a[0], apy = p[1] - a[1], apz = p[2] - a[2];
  const len2 = abx * abx + aby * aby + abz * abz;
  let t = len2 > 0 ? (apx * abx + apy * aby + apz * abz) / len2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const dx = apx - abx * t, dy = apy - aby * t, dz = apz - abz * t;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Jednorodna siatka do szybkiego wyszukiwania odcinków w pobliżu punktu. */
class SegIndex {
  private cells = new Map<string, number[]>();
  private big: number[] = [];
  constructor(private segs: Segment[], private cell: number, tol: number) {
    segs.forEach((s, i) => {
      const lo = [0, 1, 2].map((k) => Math.min(s.from[k]!, s.to[k]!) - tol);
      const hi = [0, 1, 2].map((k) => Math.max(s.from[k]!, s.to[k]!) + tol);
      const r = [0, 1, 2].map((k) => [Math.floor(lo[k]! / cell), Math.floor(hi[k]! / cell)] as const);
      const count = (r[0]![1] - r[0]![0] + 1) * (r[1]![1] - r[1]![0] + 1) * (r[2]![1] - r[2]![0] + 1);
      if (count > 600) {
        this.big.push(i);
        return;
      }
      for (let x = r[0]![0]; x <= r[0]![1]; x++)
        for (let y = r[1]![0]; y <= r[1]![1]; y++)
          for (let z = r[2]![0]; z <= r[2]![1]; z++) {
            const key = `${x},${y},${z}`;
            const arr = this.cells.get(key);
            if (arr) arr.push(i);
            else this.cells.set(key, [i]);
          }
    });
  }

  /** Najbliższy odcinek w granicach `tol` albo odległość bez dopasowania. */
  nearest(p: Vec3, tol: number): { dist: number; index: number } {
    const c = this.cell;
    const key = `${Math.floor(p[0] / c)},${Math.floor(p[1] / c)},${Math.floor(p[2] / c)}`;
    let best = Infinity;
    let idx = -1;
    const scan = (list: number[] | undefined) => {
      if (!list) return;
      for (const i of list) {
        const s = this.segs[i]!;
        const d = pointSegDist(p, s.from, s.to);
        if (d < best) {
          best = d;
          idx = i;
        }
      }
    };
    scan(this.cells.get(key));
    scan(this.big);
    void tol;
    return { dist: best, index: idx };
  }
}

function sample(segs: Segment[], step: number): Array<{ p: Vec3; seg: number }> {
  const out: Array<{ p: Vec3; seg: number }> = [];
  segs.forEach((s, i) => {
    const len = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
    const n = Math.max(1, Math.ceil(len / step));
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      out.push({ p: [s.from[0] + (s.to[0] - s.from[0]) * t, s.from[1] + (s.to[1] - s.from[1]) * t, s.from[2] + (s.to[2] - s.from[2]) * t], seg: i });
    }
  });
  return out;
}

function totalLength(segs: Segment[]): number {
  let t = 0;
  for (const s of segs) t += Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
  return t;
}

function diag(segs: Segment[]): number {
  let lo = [Infinity, Infinity, Infinity];
  let hi = [-Infinity, -Infinity, -Infinity];
  for (const s of segs) for (const p of [s.from, s.to]) for (let k = 0; k < 3; k++) {
    lo[k] = Math.min(lo[k]!, p[k]!);
    hi[k] = Math.max(hi[k]!, p[k]!);
  }
  return Math.hypot(hi[0]! - lo[0]!, hi[1]! - lo[1]!, hi[2]! - lo[2]!);
}

const fmt = (v: number) => String(Math.round(v * 10) / 10).replace('.', ',');
const pct = (v: number) => `${Math.max(1, Math.round(v * 100))}%`;
const where = (p: Vec3) => `(${fmt(p[0])}; ${fmt(p[1])}${Math.abs(p[2]) > 1e-6 ? `; ${fmt(p[2])}` : ''})`;

interface Measure {
  missing: number;
  extra: number;
  colorFrac: number;
  firstMissing: Vec3 | null;
  firstExtra: Vec3 | null;
  firstColor: string | null;
}

function measure(user: Segment[], expected: Segment[], tol: number, d: number, colorMatters: boolean): Measure {
  const step = Math.max(tol * 0.8, totalLength(expected) / MAX_SAMPLES, 0.01);
  const cell = Math.max(tol * 6, d / 30, 1);
  const userIdx = new SegIndex(user, cell, tol);
  const expIdx = new SegIndex(expected, cell, tol);

  const expSamples = sample(expected, step);
  let missed = 0;
  let colorBad = 0;
  let firstMissing: Vec3 | null = null;
  let firstColor: string | null = null;
  for (const s of expSamples) {
    const n = userIdx.nearest(s.p, tol);
    if (n.dist > tol) {
      missed++;
      if (!firstMissing) firstMissing = s.p;
    } else if (colorMatters && user[n.index]!.color !== expected[s.seg]!.color) {
      colorBad++;
      firstColor ??= expected[s.seg]!.color;
    }
  }
  const userSamples = sample(user, step);
  let extra = 0;
  let firstExtra: Vec3 | null = null;
  for (const s of userSamples) {
    const n = expIdx.nearest(s.p, tol);
    if (n.dist > tol) {
      extra++;
      if (!firstExtra) firstExtra = s.p;
    }
  }
  return {
    missing: missed / expSamples.length,
    extra: extra / userSamples.length,
    colorFrac: colorBad / expSamples.length,
    firstMissing,
    firstExtra,
    firstColor,
  };
}

const mapSeg = (s: Segment, f: (p: Vec3) => Vec3): Segment => ({ ...s, from: f(s.from), to: f(s.to) });

function bboxMin(segs: Segment[]): Vec3 {
  const m: Vec3 = [Infinity, Infinity, Infinity];
  for (const s of segs) for (const p of [s.from, s.to]) for (let k = 0; k < 3; k++) m[k] = Math.min(m[k]!, p[k]!);
  return m;
}

/** Jeśli rysunek jest poprawnym kształtem, tylko odbitym / obróconym / przesuniętym — powiedz to wprost. */
function diagnose(user: Segment[], expected: Segment[], tol: number, d: number): string | null {
  const passes = (alt: Segment[]) => {
    const m = measure(user, alt, tol, d, false);
    return m.missing <= PASS_LIMIT && m.extra <= PASS_LIMIT;
  };
  const variants: Array<[string, (p: Vec3) => Vec3]> = [
    ['mirror', (p) => [-p[0], p[1], p[2]]],
    ['mirror', (p) => [p[0], -p[1], p[2]]],
    ['rot90', (p) => [p[1], -p[0], p[2]]],
    ['rot180', (p) => [-p[0], -p[1], p[2]]],
    ['rot270', (p) => [-p[1], p[0], p[2]]],
  ];
  for (const [kind, f] of variants) {
    if (!passes(expected.map((s) => mapSeg(s, f)))) continue;
    if (kind === 'mirror') {
      return 'Kształt się zgadza, ale jest odbity lustrzanie — sprawdź, czy skręcasz w tę samą stronę co we wzorze (pw to prawo, lw to lewo).';
    }
    const deg = kind === 'rot90' ? 90 : kind === 'rot180' ? 180 : 270;
    return `Kształt się zgadza, ale jest obrócony o ${deg}° względem wzoru — zacznij od początku układu z żółwiem skierowanym tak jak na starcie (w górę).`;
  }
  const a = bboxMin(user);
  const b = bboxMin(expected);
  const shift: Vec3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  if (Math.hypot(shift[0], shift[1], shift[2]) > tol && passes(expected.map((s) => mapSeg(s, (p) => [p[0] + shift[0], p[1] + shift[1], p[2] + shift[2]])))) {
    return 'Kształt się zgadza, ale leży w innym miejscu — zacznij rysować w początku układu (0, 0).';
  }
  return null;
}

export function checkDrawing(user: Segment[], expected: Segment[], opts: CheckOptions = {}): CheckResult {
  const d = diag(expected);
  const tol = opts.tolerance ?? Math.max(1.2, d * 0.012);
  const base = { tolerance: tol, missing: 1, extra: 0 };
  if (user.length === 0) {
    return { ok: false, score: 0, reason: 'Program niczego nie narysował. Sprawdź, czy pióro jest opuszczone i czy polecenia ruchu są wykonywane.', ...base };
  }
  const m = measure(user, expected, tol, d, !!opts.colorMatters);
  const { missing, extra: extraFrac, colorFrac, firstMissing, firstExtra, firstColor } = m;
  const score = Math.round(Math.max(0, 1 - Math.max(missing, extraFrac, colorFrac)) * 1000) / 10;
  const problems: string[] = [];
  const hint = missing > PASS_LIMIT || extraFrac > PASS_LIMIT ? diagnose(user, expected, tol, d) : null;
  if (hint) problems.push(hint);
  else {
    if (missing > PASS_LIMIT) {
      problems.push(
        missing > 0.6
          ? 'Rysunek wygląda zupełnie inaczej niż wzór.'
          : `Brakuje około ${pct(missing)} wzoru${firstMissing ? `, na przykład w okolicy punktu ${where(firstMissing)}` : ''}.`,
      );
    }
    if (extraFrac > PASS_LIMIT && missing <= 0.6) {
      problems.push(`Około ${pct(extraFrac)} narysowanych linii leży poza wzorem${firstExtra ? `, na przykład w okolicy punktu ${where(firstExtra)}` : ''}.`);
    }
  }
  if (opts.colorMatters && colorFrac > PASS_LIMIT && problems.length === 0) {
    problems.push(`Kształt się zgadza, ale kolor linii jest inny niż we wzorze (spodziewany kolor: ${firstColor}).`);
  }
  const ok = problems.length === 0;
  return {
    ok,
    score,
    reason: ok ? `Rysunek zgadza się ze wzorem (zgodność ${String(score).replace('.', ',')}%).` : problems.join(' '),
    missing,
    extra: extraFrac,
    tolerance: tol,
  };
}
