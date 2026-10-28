import { runSource } from './index';
import type { Mode } from './ast';
import type { Segment, Vec3 } from './machine';

/** Largest distance (in turtle units) at which two drawn points count as the same. */
export const TOLERANCE = 1.5;
const STEP = 1;

export interface Requirement {
  pattern: RegExp;
  hint: string;
}

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  task: string;
  /** A program whose drawing is the expected result. */
  reference: string;
  requires?: Requirement[];
}

export interface Verdict {
  passed: boolean;
  reason: string;
}

export function samplePoints(segments: Segment[]): Vec3[] {
  const out: Vec3[] = [];
  for (const s of segments) {
    const [a, b] = [s.from, s.to];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const n = Math.max(1, Math.ceil(len / STEP));
    for (let k = 0; k <= n; k++) {
      const f = k / n;
      out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]);
    }
  }
  return out;
}

/** Spatial hash with cells of the tolerance size, so nearest-point queries stay cheap. */
class PointGrid {
  private cells = new Map<string, Vec3[]>();
  constructor(points: Vec3[]) {
    for (const p of points) {
      const k = this.key(Math.floor(p[0] / TOLERANCE), Math.floor(p[1] / TOLERANCE), Math.floor(p[2] / TOLERANCE));
      const cell = this.cells.get(k);
      if (cell) cell.push(p);
      else this.cells.set(k, [p]);
    }
  }
  private key(x: number, y: number, z: number) {
    return `${x},${y},${z}`;
  }
  near(p: Vec3): boolean {
    const cx = Math.floor(p[0] / TOLERANCE);
    const cy = Math.floor(p[1] / TOLERANCE);
    const cz = Math.floor(p[2] / TOLERANCE);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const cell = this.cells.get(this.key(cx + dx, cy + dy, cz + dz));
          if (cell?.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) <= TOLERANCE)) return true;
        }
    return false;
  }
}

const fmt = (p: Vec3) => `(${p.map((v) => Math.round(v)).join(', ')})`;

/** Finds the first point of `from` that has no counterpart in `to`. */
function firstUnmatched(from: Vec3[], to: PointGrid): Vec3 | null {
  for (const p of from) if (!to.near(p)) return p;
  return null;
}

/** Judges a program against a challenge: same drawing within tolerance, in both directions. */
export function judge(source: string, challenge: Challenge): Verdict {
  for (const req of challenge.requires ?? []) {
    if (!req.pattern.test(source)) return { passed: false, reason: req.hint };
  }
  const user = runSource(source, challenge.mode);
  if (user.error) {
    const { line, column, message } = user.error;
    return { passed: false, reason: `Program zawiera błąd (wiersz ${line}, kolumna ${column}): ${message}` };
  }
  if (user.segments.length === 0) {
    return { passed: false, reason: 'Nic nie narysowano. Sprawdź, czy żółw ma opuszczone pióro (opu).' };
  }
  const expected = samplePoints(runSource(challenge.reference, challenge.mode).segments);
  const drawn = samplePoints(user.segments);

  const missing = firstUnmatched(expected, new PointGrid(drawn));
  if (missing) {
    return { passed: false, reason: `Brakuje fragmentu rysunku w punkcie ${fmt(missing)}.` };
  }
  const extra = firstUnmatched(drawn, new PointGrid(expected));
  if (extra) {
    return { passed: false, reason: `Rysunek ma linię, której nie ma we wzorze, w punkcie ${fmt(extra)}.` };
  }
  return { passed: true, reason: 'Zgadza się! Rysunek pasuje do wzoru.' };
}
