import { initialState, type Execution, type Segment, type Step, type TurtleState } from '../lang';
import type { Vec3 } from '../lang/geometry';

export type PlayerState = 'idle' | 'running' | 'paused' | 'done';

export interface PlayerFrame {
  segments: readonly Segment[];
  partial: Segment | null;
  turtle: TurtleState;
  /** Indeks kroku właśnie wykonywanego (lub ostatnio wykonanego), -1 gdy brak. */
  stepIndex: number;
}

/** Poziomy tempa: jednostki pracy na sekundę i maksymalny czas całego rysunku. */
export const SPEEDS: { rate: number; cap: number; label: string }[] = [
  { rate: 1.2, cap: Infinity, label: 'bardzo wolno' },
  { rate: 3, cap: 180, label: 'wolno' },
  { rate: 8, cap: 20, label: 'spokojnie' },
  { rate: 25, cap: 10, label: 'szybko' },
  { rate: 90, cap: 5, label: 'bardzo szybko' },
  { rate: 400, cap: 1.5, label: 'błyskawicznie' },
  { rate: Infinity, cap: 0, label: 'natychmiast' },
];
export const DEFAULT_SPEED = 3;

/** Ruch zajmuje pełną jednostkę czasu, obrót nieco mniej, reszta – chwilę. */
function weight(step: Step): number {
  switch (step.kind) {
    case 'move': case 'home': return 1;
    case 'turn': case 'pitch': case 'roll': return 0.6;
    default: return 0.2;
  }
}

export class Player {
  exec: Execution | null = null;
  state: PlayerState = 'idle';
  private applied = 0;
  private progress = 0;
  private weights: number[] = [];
  private totalWeight = 0;
  private speed = DEFAULT_SPEED;
  private stepTarget: number | null = null;
  private raf = 0;
  private lastTime = 0;
  private cacheKey = '';
  private cache: readonly Segment[] = [];

  constructor(
    private readonly onFrame: (frame: PlayerFrame) => void,
    private readonly onState: (state: PlayerState, player: Player) => void,
  ) {}

  get speedLevel(): number {
    return this.speed;
  }

  setSpeed(level: number): void {
    this.speed = Math.max(1, Math.min(SPEEDS.length, Math.round(level)));
  }

  get stepCount(): number {
    return this.exec?.steps.length ?? 0;
  }

  get appliedSteps(): number {
    return this.applied;
  }

  /** Wczytuje wynik wykonania; rysunek jest pusty, dopóki nie ruszy odtwarzanie. */
  load(exec: Execution): void {
    this.cancel();
    this.exec = exec;
    this.applied = 0;
    this.progress = 0;
    this.stepTarget = null;
    this.weights = exec.steps.map(weight);
    this.totalWeight = this.weights.reduce((a, b) => a + b, 0);
    this.cacheKey = '';
    this.setState('paused');
    this.emit();
  }

  play(): void {
    if (!this.exec) return;
    if (this.applied >= this.exec.steps.length) {
      this.finish();
      return;
    }
    this.stepTarget = null;
    if (SPEEDS[this.speed - 1]!.rate === Infinity) {
      this.finishNow();
      return;
    }
    this.setState('running');
    this.startLoop();
  }

  pause(): void {
    if (this.state !== 'running') return;
    this.cancel();
    this.stepTarget = null;
    this.setState('paused');
    this.emit();
  }

  /** Wykonuje jeden krok (z krótką animacją). */
  step(): void {
    if (!this.exec) return;
    const n = this.exec.steps.length;
    if (this.stepTarget !== null) {
      // Poprzedni krok jeszcze trwa – dokończ go od razu.
      this.applied = Math.min(n, this.stepTarget);
      this.progress = 0;
    }
    if (this.applied >= n) {
      this.finish();
      return;
    }
    this.stepTarget = this.applied + 1;
    this.setState('running');
    this.startLoop();
  }

  finishNow(): void {
    if (!this.exec) return;
    this.cancel();
    this.applied = this.exec.steps.length;
    this.progress = 0;
    this.finish();
  }

  /** Przerywa odtwarzanie, zostawiając to, co już narysowano. */
  halt(): void {
    if (!this.exec || this.state === 'idle') return;
    this.cancel();
    this.progress = 0;
    this.stepTarget = null;
    this.setState('idle');
    this.emit();
  }

  /** Czyści wszystko: żółw wraca na start, rysunek znika. */
  clear(): void {
    this.cancel();
    this.exec = null;
    this.applied = 0;
    this.progress = 0;
    this.stepTarget = null;
    this.cacheKey = '';
    this.setState('idle');
    this.emit();
  }

  private finish(): void {
    this.cancel();
    this.stepTarget = null;
    this.setState('done');
    this.emit();
  }

  private setState(s: PlayerState): void {
    this.state = s;
    this.onState(s, this);
  }

  private cancel(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private startLoop(): void {
    this.cancel();
    this.lastTime = performance.now();
    const tick = (now: number) => {
      this.raf = 0;
      const dt = Math.min(0.1, Math.max(0, (now - this.lastTime) / 1000));
      this.lastTime = now;
      this.advance(dt);
      if (this.state === 'running') this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private rate(): number {
    const s = SPEEDS[this.speed - 1]!;
    if (this.stepTarget !== null) return Math.max(4, Math.min(s.rate, 12));
    if (s.rate === Infinity) return Infinity;
    return Math.max(s.rate, s.cap === Infinity ? 0 : this.totalWeight / s.cap);
  }

  private advance(dt: number): void {
    const exec = this.exec!;
    const n = exec.steps.length;
    const target = this.stepTarget ?? n;
    let budget = dt * this.rate();
    while (budget > 0 && this.applied < target) {
      const w = this.weights[this.applied]!;
      const left = w - this.progress;
      if (budget >= left) {
        budget -= left;
        this.applied++;
        this.progress = 0;
      } else {
        this.progress += budget;
        budget = 0;
      }
    }
    if (this.applied >= n) {
      this.finish();
      return;
    }
    if (this.stepTarget !== null && this.applied >= this.stepTarget) {
      this.stepTarget = null;
      this.cancel();
      this.setState('paused');
    }
    this.emit();
  }

  private visible(drawnCount: number, from: number): readonly Segment[] {
    const key = `${from}:${drawnCount}`;
    if (key !== this.cacheKey) {
      this.cacheKey = key;
      this.cache = this.exec ? this.exec.drawn.slice(from, drawnCount) : [];
    }
    return this.cache;
  }

  /** Bieżąca klatka (stan po zastosowanych krokach plus ułamek następnego). */
  frame(): PlayerFrame {
    const exec = this.exec;
    if (!exec) return { segments: [], partial: null, turtle: initialState(), stepIndex: -1 };
    const k = this.applied;
    const steps = exec.steps;
    const prev = k > 0 ? steps[k - 1]! : null;
    const prevState = prev ? prev.state : initialState();
    const segments = this.visible(prev ? prev.drawn : 0, prev ? prev.visibleFrom : 0);
    const cur = steps[k];
    if (!cur || this.progress <= 0) {
      return { segments, partial: null, turtle: prevState, stepIndex: k - 1 };
    }
    const t = Math.min(1, this.progress / this.weights[k]!);
    let partial: Segment | null = null;
    const drawnBefore = prev ? prev.drawn : 0;
    if (cur.drawn > drawnBefore) {
      const seg = exec.drawn[drawnBefore]!;
      partial = { ...seg, to: lerp(seg.from, seg.to, t) };
    }
    return {
      segments, partial, stepIndex: k,
      turtle: { ...cur.state, ...interpolatePose(prevState, cur.state, t) },
    };
  }

  private emit(): void {
    this.onFrame(this.frame());
  }
}

const lerp = (a: Vec3, b: Vec3, t: number): Vec3 =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

type Quat = [number, number, number, number];

/** Kwaternion z bazy (kolumny macierzy obrotu: r, h, u). */
function quatFromBasis(r: Vec3, h: Vec3, u: Vec3): Quat {
  const m00 = r[0], m01 = h[0], m02 = u[0];
  const m10 = r[1], m11 = h[1], m12 = u[1];
  const m20 = r[2], m21 = h[2], m22 = u[2];
  const tr = m00 + m11 + m22;
  if (tr > 0) {
    const s = 0.5 / Math.sqrt(tr + 1);
    return [(m21 - m12) * s, (m02 - m20) * s, (m10 - m01) * s, 0.25 / s];
  }
  if (m00 > m11 && m00 > m22) {
    const s = 2 * Math.sqrt(1 + m00 - m11 - m22);
    return [0.25 * s, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s];
  }
  if (m11 > m22) {
    const s = 2 * Math.sqrt(1 + m11 - m00 - m22);
    return [(m01 + m10) / s, 0.25 * s, (m12 + m21) / s, (m02 - m20) / s];
  }
  const s = 2 * Math.sqrt(1 + m22 - m00 - m11);
  return [(m02 + m20) / s, (m12 + m21) / s, 0.25 * s, (m10 - m01) / s];
}

function slerp(a: Quat, b: Quat, t: number): Quat {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  let bb = b;
  if (dot < 0) { dot = -dot; bb = [-b[0], -b[1], -b[2], -b[3]]; }
  if (dot > 0.9995) {
    const q: Quat = [a[0] + (bb[0] - a[0]) * t, a[1] + (bb[1] - a[1]) * t, a[2] + (bb[2] - a[2]) * t, a[3] + (bb[3] - a[3]) * t];
    const l = Math.hypot(...q);
    return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
  }
  const th = Math.acos(dot), s = Math.sin(th);
  const wa = Math.sin((1 - t) * th) / s, wb = Math.sin(t * th) / s;
  return [a[0] * wa + bb[0] * wb, a[1] * wa + bb[1] * wb, a[2] * wa + bb[2] * wb, a[3] * wa + bb[3] * wb];
}

function rotate(q: Quat, v: Vec3): Vec3 {
  const [x, y, z, w] = q;
  const ix = w * v[0] + y * v[2] - z * v[1];
  const iy = w * v[1] + z * v[0] - x * v[2];
  const iz = w * v[2] + x * v[1] - y * v[0];
  const iw = -x * v[0] - y * v[1] - z * v[2];
  return [
    ix * w + iw * -x + iy * -z - iz * -y,
    iy * w + iw * -y + iz * -x - ix * -z,
    iz * w + iw * -z + ix * -y - iy * -x,
  ];
}

function interpolatePose(a: TurtleState, b: TurtleState, t: number) {
  const qa = quatFromBasis(a.r, a.h, a.u), qb = quatFromBasis(b.r, b.h, b.u);
  const q = slerp(qa, qb, t);
  return {
    pos: lerp(a.pos, b.pos, t),
    r: rotate(q, [1, 0, 0]), h: rotate(q, [0, 1, 0]), u: rotate(q, [0, 0, 1]),
  };
}
