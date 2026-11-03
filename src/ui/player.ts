import type { Program } from '../lang/ast';
import type { LogoError } from '../lang/errors';
import { Execution, initialTurtle, type Segment, type StepEvent, type TurtleState, type V3 } from '../lang/interpreter';

/** A recorded run: every executed command in order, replayed at the chosen tempo. */
export interface Recording {
  events: StepEvent[];
  costs: number[];
  natural: number;
  error: LogoError | null;
  ops: number;
  segments: Segment[];
}

const angle = (a: V3, b: V3) => {
  const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  return (Math.acos(d) * 180) / Math.PI;
};

export function record(program: Program): Recording {
  const exec = new Execution(program);
  const events: StepEvent[] = [];
  for (const ev of exec.steps()) events.push(ev);
  const costs: number[] = [];
  let prev: TurtleState = initialTurtle();
  let natural = 0;
  for (const ev of events) {
    const t = ev.turtle;
    const dist = Math.hypot(t.pos[0] - prev.pos[0], t.pos[1] - prev.pos[1], t.pos[2] - prev.pos[2]);
    const turn = Math.max(angle(t.heading, prev.heading), angle(t.up, prev.up));
    const c = dist / 400 + turn / 720 + 0.03;
    costs.push(c);
    natural += c;
    prev = t;
  }
  return { events, costs, natural, error: exec.error, ops: exec.ops, segments: exec.segments };
}

/** Tempo 1–10: speed multipliers and the longest a whole drawing may take. 10 is instant. */
const MULT = [0.2, 0.35, 0.6, 1, 1.7, 3, 6, 15, 50];
const CAP = [90, 45, 25, 12, 7, 4, 2, 1, 0.4];

export const TEMPO_MAX = 10;

export function secondsPerCost(rec: Recording, tempo: number): number {
  if (tempo >= TEMPO_MAX || rec.natural <= 0) return 0;
  const i = Math.max(0, Math.min(MULT.length - 1, Math.round(tempo) - 1));
  const duration = Math.min(rec.natural / MULT[i], CAP[i]);
  return duration / rec.natural;
}

export function tempoLabel(tempo: number): string {
  if (tempo >= TEMPO_MAX) return 'natychmiast';
  if (tempo <= 2) return 'bardzo wolno';
  if (tempo <= 4) return 'spokojnie';
  if (tempo <= 6) return 'szybko';
  return 'bardzo szybko';
}

const lerp = (a: V3, b: V3, f: number): V3 => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
const normalize = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return l < 1e-9 ? v : [v[0] / l, v[1] / l, v[2] / l];
};

/** The turtle part-way through an event, and the part of its stroke drawn so far. */
export function interpolate(prev: TurtleState, ev: StepEvent, f: number): { turtle: TurtleState; partial: Segment | null } {
  const t = ev.turtle;
  const turtle: TurtleState = {
    ...t,
    pos: lerp(prev.pos, t.pos, f),
    heading: normalize(lerp(prev.heading, t.heading, f)),
    right: normalize(lerp(prev.right, t.right, f)),
    up: normalize(lerp(prev.up, t.up, f)),
  };
  // turning by 180° passes through zero; keep the old orientation until halfway
  if (Math.hypot(...lerp(prev.heading, t.heading, f)) < 1e-6) turtle.heading = f < 0.5 ? prev.heading : t.heading;
  const partial = ev.segment ? { ...ev.segment, to: lerp(ev.segment.from, ev.segment.to, f) } : null;
  return { turtle, partial };
}
