import type { Segment, TurtleState, V3 } from '../lang/interpreter';

export interface Callout {
  n: number;
  color: string;
  anchor: V3;
  /** direction of the stroke the callout points at */
  along: V3;
  count: number;
  length: number;
}

/** Shared contract of the 2D canvas view and the 3D WebGL view. */
export interface DrawingView {
  readonly element: HTMLElement;
  setSegments(segments: Segment[]): void;
  setPartial(segment: Segment | null): void;
  setTurtle(turtle: TurtleState | null): void;
  setGhost(segments: Segment[] | null): void;
  setCallouts(callouts: Callout[] | null): void;
  setInk(color: string): void;
  fit(): void;
  zoom(factor: number): void;
  resetView(): void;
  /** true when the user moved the view since the last fit or reset */
  readonly userMoved: boolean;
  isVisible(points: V3[]): boolean;
  refreshTheme(): void;
  resize(): void;
  toPNG(title: string): Promise<Blob>;
  destroy(): void;
}

/** Inks in order of first use, each anchored on its first stroke. */
export function computeCallouts(segments: Segment[]): Callout[] {
  const map = new Map<string, Callout>();
  for (const s of segments) {
    let c = map.get(s.color);
    const len = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
    if (!c) {
      c = {
        n: map.size + 1,
        color: s.color,
        anchor: [(s.from[0] + s.to[0]) / 2, (s.from[1] + s.to[1]) / 2, (s.from[2] + s.to[2]) / 2],
        along: [s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]],
        count: 0,
        length: 0,
      };
      map.set(s.color, c);
    }
    c.count++;
    c.length += len;
  }
  return [...map.values()];
}

/**
 * Screen direction for a callout leader: perpendicular to its stroke, on the
 * side facing away from the drawing's centre.
 */
export function leaderDir(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): [number, number] {
  let sx = bx - ax;
  let sy = by - ay;
  const sl = Math.hypot(sx, sy);
  let dx: number;
  let dy: number;
  if (sl > 0.5) {
    sx /= sl;
    sy /= sl;
    dx = -sy;
    dy = sx;
    if (dx * (ax - cx) + dy * (ay - cy) < 0) {
      dx = -dx;
      dy = -dy;
    }
  } else {
    dx = ax - cx;
    dy = ay - cy;
    const l = Math.hypot(dx, dy);
    if (l < 1) return [0.7, -0.7];
    dx /= l;
    dy /= l;
  }
  return [dx, dy];
}

export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export interface Bounds {
  min: V3;
  max: V3;
  empty: boolean;
}

export function boundsOf(segments: Segment[], extra: V3[] = []): Bounds {
  const min: V3 = [Infinity, Infinity, Infinity];
  const max: V3 = [-Infinity, -Infinity, -Infinity];
  const add = (p: V3) => {
    for (let k = 0; k < 3; k++) {
      if (p[k] < min[k]) min[k] = p[k];
      if (p[k] > max[k]) max[k] = p[k];
    }
  };
  for (const s of segments) {
    add(s.from);
    add(s.to);
  }
  for (const p of extra) add(p);
  const empty = !Number.isFinite(min[0]);
  return empty ? { min: [0, 0, 0], max: [0, 0, 0], empty } : { min, max, empty };
}

/**
 * Draws numbered wall-chart callouts: a dot on the stroke, a leader line,
 * and a numbered roundel keyed to the legend.
 */
export function drawCalloutMarks(
  ctx: CanvasRenderingContext2D,
  marks: { n: number; x: number; y: number; dx: number; dy: number }[],
  w: number,
  h: number,
  colors: { ink: string; sheet: string },
  avoid: { x: number; y: number }[] = [],
) {
  const R = 11;
  const placed: { x: number; y: number }[] = [...avoid];
  ctx.save();
  ctx.font = `700 12px ${cssVar('--font-ui') || 'sans-serif'}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const m of marks) {
    let lx = 0;
    let ly = 0;
    const free = (x: number, y: number) => !placed.some((p) => Math.hypot(p.x - x, p.y - y) < R * 2 + 6);
    // try the preferred side first, then the opposite side, each further out
    search: for (const side of [1, -1]) {
      for (let len = 34; len <= 120; len += 22) {
        const x = m.x + m.dx * side * len;
        const y = m.y + m.dy * side * len;
        if (x < R + 4 || y < R + 4 || x > w - R - 4 || y > h - R - 4) continue;
        lx = x;
        ly = y;
        if (free(x, y)) break search;
      }
    }
    if (!lx && !ly) {
      lx = Math.min(w - R - 4, Math.max(R + 4, m.x + m.dx * 34));
      ly = Math.min(h - R - 4, Math.max(R + 4, m.y + m.dy * 34));
    }
    placed.push({ x: lx, y: ly });
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    const ex = lx - (lx - m.x) * (R / Math.max(1, Math.hypot(lx - m.x, ly - m.y)));
    const ey = ly - (ly - m.y) * (R / Math.max(1, Math.hypot(lx - m.x, ly - m.y)));
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.fillStyle = colors.ink;
    ctx.beginPath();
    ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.sheet;
    ctx.beginPath();
    ctx.arc(lx, ly, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = colors.ink;
    ctx.fillText(String(m.n), lx, ly + 0.5);
  }
  ctx.restore();
}
