import { run, type Segment } from '../lang';
import type { Challenge } from './challenges';

type Point = [number, number, number];

/** Two drawings match when every sampled point of each lies within this distance of the other. */
export const TOLERANCE = 1;
const SAMPLE_STEP = TOLERANCE / 4;
const MAX_SAMPLES_PER_SEGMENT = 4000;

export type Comparison =
  | { ok: true }
  | { ok: false; reason: 'empty' | 'missing' | 'extra'; at: Point | null };

/** Points spread along a segment, both ends included. */
function sample(s: Segment, out: Point[]): number {
  const dx = s.to[0] - s.from[0];
  const dy = s.to[1] - s.from[1];
  const dz = s.to[2] - s.from[2];
  const length = Math.hypot(dx, dy, dz);
  const count = Math.min(Math.max(1, Math.ceil(length / SAMPLE_STEP)), MAX_SAMPLES_PER_SEGMENT);
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    out.push([s.from[0] + dx * t, s.from[1] + dy * t, s.from[2] + dz * t]);
  }
  return length / count;
}

/** Points bucketed in a grid whose cell size equals the search radius. */
class PointIndex {
  private readonly cells = new Map<string, Point[]>();
  constructor(private readonly cell: number) {}

  private key(x: number, y: number, z: number): string {
    return `${Math.floor(x / this.cell)},${Math.floor(y / this.cell)},${Math.floor(z / this.cell)}`;
  }

  add(p: Point): void {
    const key = this.key(p[0], p[1], p[2]);
    const bucket = this.cells.get(key);
    if (bucket) bucket.push(p);
    else this.cells.set(key, [p]);
  }

  hasWithin(p: Point, radius: number): boolean {
    const cx = Math.floor(p[0] / this.cell);
    const cy = Math.floor(p[1] / this.cell);
    const cz = Math.floor(p[2] / this.cell);
    const r2 = radius * radius;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const bucket = this.cells.get(`${cx + dx},${cy + dy},${cz + dz}`);
          if (!bucket) continue;
          for (const q of bucket) {
            const ex = p[0] - q[0];
            const ey = p[1] - q[1];
            const ez = p[2] - q[2];
            if (ex * ex + ey * ey + ez * ez <= r2) return true;
          }
        }
      }
    }
    return false;
  }
}

/**
 * Compares two drawings by geometry only. Order, start point, colour and
 * width do not matter; position, size and shape do.
 */
export function compareDrawings(expected: readonly Segment[], actual: readonly Segment[]): Comparison {
  if (actual.length === 0) return { ok: false, reason: 'empty', at: null };

  const expectedPoints: Point[] = [];
  const actualPoints: Point[] = [];
  let stepSlack = 0;
  for (const s of expected) stepSlack = Math.max(stepSlack, sample(s, expectedPoints));
  for (const s of actual) stepSlack = Math.max(stepSlack, sample(s, actualPoints));
  const radius = TOLERANCE + stepSlack;

  const expectedIndex = new PointIndex(radius);
  for (const p of expectedPoints) expectedIndex.add(p);
  const actualIndex = new PointIndex(radius);
  for (const p of actualPoints) actualIndex.add(p);

  for (const p of expectedPoints) {
    if (!actualIndex.hasWithin(p, radius)) return { ok: false, reason: 'missing', at: p };
  }
  for (const p of actualPoints) {
    if (!expectedIndex.hasWithin(p, radius)) return { ok: false, reason: 'extra', at: p };
  }
  return { ok: true };
}

export interface ChallengeResult {
  passed: boolean;
  message: string;
  /** The target drawing, shown faintly when the user asks for it. */
  target: Segment[];
}

function formatPoint(p: Point | null): string {
  if (!p) return '';
  const round = (v: number) => {
    const rounded = Math.round(v * 10) / 10;
    return (rounded === 0 ? 0 : rounded).toString();
  };
  return p[2] === 0 ? `(${round(p[0])}, ${round(p[1])})` : `(${round(p[0])}, ${round(p[1])}, ${round(p[2])})`;
}

/** Runs the learner's program and compares its drawing with the challenge's target. */
export function checkChallenge(challenge: Challenge, source: string): ChallengeResult {
  const target = run(challenge.reference, challenge.mode);
  if (target.error) throw new Error(`Wzór wyzwania „${challenge.id}” nie działa: ${target.error.message}`);

  const attempt = run(source, challenge.mode);
  if (attempt.error) {
    const { line, column, message } = attempt.error;
    return {
      passed: false,
      message: `Program zgłasza błąd w linii ${line}, kolumnie ${column}: ${message}`,
      target: target.segments,
    };
  }

  const comparison = compareDrawings(target.segments, attempt.segments);
  if (comparison.ok) {
    return { passed: true, message: 'Zaliczone! Rysunek zgadza się ze wzorem.', target: target.segments };
  }
  const where = formatPoint(comparison.at);
  const messages = {
    empty: 'Program nic nie narysował.',
    missing: `Brakuje fragmentu wzoru w pobliżu punktu ${where}.`,
    extra: `Rysunek ma fragment, którego nie ma we wzorze, w pobliżu punktu ${where}.`,
  } as const;
  return { passed: false, message: messages[comparison.reason], target: target.segments };
}
