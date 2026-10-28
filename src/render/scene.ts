import type { Segment, TurtleState } from '../lang/interpreter';
import type { Vec3 } from '../lang/geometry';

/** Everything a view needs to draw one frame. */
export interface Scene {
  /** Segment log; the visible segments are log[start, end). */
  log: readonly Segment[];
  start: number;
  end: number;
  /** A segment being drawn right now (animated), not yet in the log range. */
  partial: Segment | null;
  turtle: TurtleState | null;
  /** Target drawing of a challenge, drawn faintly underneath. */
  ghost: readonly Segment[] | null;
  /** Highlighted segments (e.g. missing parts of a challenge), drawn dashed in their colour. */
  marks?: readonly Segment[] | null;
}

export const EMPTY_SCENE: Scene = { log: [], start: 0, end: 0, partial: null, turtle: null, ghost: null, marks: null };

export interface Palette {
  bg: string;
  grid: string;
  gridMajor: string;
  axisX: string;
  axisY: string;
  axisZ: string;
  label: string;
  ghost: string;
  turtle: string;
  turtleTop: string;
  turtleBottom: string;
  turtleFin: string;
  turtleOutline: string;
}

const FALLBACK: Palette = {
  bg: '#fbf8f1',
  grid: 'rgba(60, 50, 30, 0.07)',
  gridMajor: 'rgba(60, 50, 30, 0.14)',
  axisX: '#c0504d',
  axisY: '#2f8f4e',
  axisZ: '#2b6fb3',
  label: '#6b675e',
  ghost: 'rgba(120, 110, 90, 0.55)',
  turtle: '#16866a',
  turtleTop: '#2aa384',
  turtleBottom: '#56615d',
  turtleFin: '#c1763d',
  turtleOutline: '#103b30',
};

/** Reads the canvas palette from CSS custom properties (so it follows the theme). */
export function readPalette(el: Element = document.documentElement): Palette {
  const cs = getComputedStyle(el);
  const get = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    bg: get('--canvas-bg', FALLBACK.bg),
    grid: get('--canvas-grid', FALLBACK.grid),
    gridMajor: get('--canvas-grid-major', FALLBACK.gridMajor),
    axisX: get('--axis-x', FALLBACK.axisX),
    axisY: get('--axis-y', FALLBACK.axisY),
    axisZ: get('--axis-z', FALLBACK.axisZ),
    label: get('--canvas-label', FALLBACK.label),
    ghost: get('--canvas-ghost', FALLBACK.ghost),
    turtle: get('--turtle', FALLBACK.turtle),
    turtleTop: get('--turtle-top', FALLBACK.turtleTop),
    turtleBottom: get('--turtle-bottom', FALLBACK.turtleBottom),
    turtleFin: get('--turtle-fin', FALLBACK.turtleFin),
    turtleOutline: get('--turtle-outline', FALLBACK.turtleOutline),
  };
}

export interface Bounds {
  min: Vec3;
  max: Vec3;
  empty: boolean;
}

export function sceneBounds(scene: Scene, withTurtle = true, withGhost = true): Bounds {
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  const add = (p: readonly number[]) => {
    for (let k = 0; k < 3; k++) {
      if (p[k] < min[k]) min[k] = p[k];
      if (p[k] > max[k]) max[k] = p[k];
    }
  };
  for (let i = scene.start; i < scene.end; i++) {
    add(scene.log[i].from);
    add(scene.log[i].to);
  }
  if (scene.partial) {
    add(scene.partial.from);
    add(scene.partial.to);
  }
  if (withGhost && scene.ghost) {
    for (const s of scene.ghost) {
      add(s.from);
      add(s.to);
    }
  }
  const hasLines = min[0] !== Infinity;
  if (withTurtle && scene.turtle) add(scene.turtle.pos);
  if (min[0] === Infinity) return { min: [0, 0, 0], max: [0, 0, 0], empty: true };
  return { min, max, empty: !hasLines };
}

/** A "nice" step (1, 2 or 5 times a power of ten) not smaller than `raw`. */
export function niceStep(raw: number): number {
  if (!(raw > 0) || !Number.isFinite(raw)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

/** Draws segments with round caps, merging connected runs of the same style into one path. */
export function strokeRuns(
  ctx: CanvasRenderingContext2D,
  segs: readonly Segment[],
  from: number,
  to: number,
  project: (p: readonly number[]) => [number, number],
  widthScale = 1,
): void {
  let open = false;
  let lastColor = '';
  let lastWidth = -1;
  let lx = NaN;
  let ly = NaN;
  for (let i = from; i < to; i++) {
    const s = segs[i];
    const [ax, ay] = project(s.from);
    const [bx, by] = project(s.to);
    if (s.color !== lastColor || s.width !== lastWidth) {
      if (open) ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width * widthScale;
      lastColor = s.color;
      lastWidth = s.width;
      open = true;
      ctx.moveTo(ax, ay);
    } else if (Math.abs(ax - lx) > 0.01 || Math.abs(ay - ly) > 0.01) {
      ctx.moveTo(ax, ay);
    }
    ctx.lineTo(bx, by);
    lx = bx;
    ly = by;
  }
  if (open) ctx.stroke();
}
