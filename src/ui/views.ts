import type { Segment, TurtleState, Vec } from '../logo/index';

export interface Colors {
  bg: string;
  grid: string;
  axis: string;
  ink: string;
  accent: string;
  x: string;
  y: string;
  z: string;
}

export function readColors(): Colors {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    bg: v('--c-bg'),
    grid: v('--c-grid'),
    axis: v('--c-axis'),
    ink: v('--c-ink'),
    accent: v('--c-accent'),
    x: v('--c-x'),
    y: v('--c-y'),
    z: v('--c-z'),
  };
}

/** Common surface of the 2D plane and the 3D space. */
export interface PlanView {
  readonly canvas: HTMLCanvasElement;
  render(segments: Segment[], turtle: TurtleState | null): void;
  fit(segments: Segment[]): void;
  reset(): void;
  /** Called when the user changes the view, so the caller can redraw. */
  onChange: (() => void) | null;
}

interface Box {
  min: Vec;
  max: Vec;
}

/** Bounding box of the drawing, always including the origin. */
export function boundsOf(segments: Segment[]): Box {
  const min: Vec = [0, 0, 0];
  const max: Vec = [0, 0, 0];
  for (const s of segments) {
    for (const p of [s.from, s.to]) {
      for (let i = 0; i < 3; i++) {
        if (p[i] < min[i]) min[i] = p[i];
        if (p[i] > max[i]) max[i] = p[i];
      }
    }
  }
  return { min, max };
}

/** Sets up a canvas for high-density screens and returns its size in CSS pixels. */
function prepare(canvas: HTMLCanvasElement): { ctx: CanvasRenderingContext2D; w: number; h: number } {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, canvas.clientWidth);
  const h = Math.max(1, canvas.clientHeight);
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

/** A step of 1, 2 or 5 times a power of ten, giving roughly `target` pixels between lines. */
function niceStep(unitsPerPx: number, target: number): number {
  const raw = unitsPerPx * target;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 5, 10]) if (p * m >= raw) return p * m;
  return p * 10;
}

/** Pointer handling shared by both views: drag to pan or rotate, wheel and pinch to zoom. */
function attachPointers(
  canvas: HTMLCanvasElement,
  onDrag: (dx: number, dy: number, pan: boolean) => void,
  onZoom: (factor: number, x: number, y: number) => void,
  onKey: (e: KeyboardEvent) => boolean,
  onDoubleClick: () => void,
): void {
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch = 0;
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pinch = pointers.size === 2 ? distance() : 0;
  });
  canvas.addEventListener('pointermove', (e) => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const d = distance();
      if (pinch > 0 && d > 0) {
        const r = canvas.getBoundingClientRect();
        const mid = midpoint();
        onZoom(pinch / d, mid.x - r.left, mid.y - r.top);
      }
      pinch = d;
    } else if (pointers.size === 1) {
      onDrag(dx, dy, e.shiftKey || e.button === 2);
    }
  });
  const end = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    pinch = 0;
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('dblclick', onDoubleClick);
  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      onZoom(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    },
    { passive: false },
  );
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('keydown', (e) => {
    if (onKey(e)) e.preventDefault();
  });

  function distance(): number {
    const [a, b] = [...pointers.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  }
  function midpoint(): { x: number; y: number } {
    const [a, b] = [...pointers.values()];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }
}

/** The flat plane: +X to the right, +Y up the screen, origin marked. */
export class Plane2D implements PlanView {
  readonly canvas: HTMLCanvasElement;
  onChange: (() => void) | null = null;
  private cx = 0;
  private cy = 0;
  private scale = 2;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    attachPointers(
      canvas,
      (dx, dy) => {
        this.cx -= dx / this.scale;
        this.cy += dy / this.scale;
        this.changed();
      },
      (f, x, y) => {
        const { w, h } = this.size();
        const wx = this.cx + (x - w / 2) / this.scale;
        const wy = this.cy - (y - h / 2) / this.scale;
        this.scale = Math.min(2000, Math.max(0.01, this.scale * f));
        this.cx = wx - (x - w / 2) / this.scale;
        this.cy = wy + (y - h / 2) / this.scale;
        this.changed();
      },
      (e) => this.key(e),
      () => this.reset(),
    );
  }

  private size() {
    return { w: Math.max(1, this.canvas.clientWidth), h: Math.max(1, this.canvas.clientHeight) };
  }

  private changed() {
    this.onChange?.();
  }

  private key(e: KeyboardEvent): boolean {
    const step = 40 / this.scale;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step],
    };
    const m = moves[e.key];
    if (m) {
      this.cx += m[0];
      this.cy += m[1];
      this.changed();
      return true;
    }
    if (e.key === '+' || e.key === '=') this.zoomBy(1.25);
    else if (e.key === '-') this.zoomBy(0.8);
    else if (e.key === '0') this.reset();
    else return false;
    return true;
  }

  private zoomBy(f: number) {
    this.scale = Math.min(2000, Math.max(0.01, this.scale * f));
    this.changed();
  }

  reset() {
    this.cx = 0;
    this.cy = 0;
    this.scale = 2;
    this.changed();
  }

  fit(segments: Segment[]) {
    const b = boundsOf(segments);
    const { w, h } = this.size();
    const spanX = Math.max(b.max[0] - b.min[0], 20);
    const spanY = Math.max(b.max[1] - b.min[1], 20);
    this.scale = Math.min((w * 0.86) / spanX, (h * 0.86) / spanY);
    this.cx = (b.min[0] + b.max[0]) / 2;
    this.cy = (b.min[1] + b.max[1]) / 2;
    this.changed();
  }

  private toScreen(x: number, y: number, w: number, h: number): [number, number] {
    return [w / 2 + (x - this.cx) * this.scale, h / 2 - (y - this.cy) * this.scale];
  }

  render(segments: Segment[], turtle: TurtleState | null) {
    const { ctx, w, h } = prepare(this.canvas);
    const c = readColors();
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, w, h);

    const step = niceStep(1 / this.scale, 70);
    ctx.strokeStyle = c.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const x0 = Math.floor((this.cx - w / 2 / this.scale) / step) * step;
    const x1 = this.cx + w / 2 / this.scale;
    for (let x = x0; x <= x1; x += step) {
      const [sx] = this.toScreen(x, 0, w, h);
      ctx.moveTo(Math.round(sx) + 0.5, 0);
      ctx.lineTo(Math.round(sx) + 0.5, h);
    }
    const y0 = Math.floor((this.cy - h / 2 / this.scale) / step) * step;
    const y1 = this.cy + h / 2 / this.scale;
    for (let y = y0; y <= y1; y += step) {
      const [, sy] = this.toScreen(0, y, w, h);
      ctx.moveTo(0, Math.round(sy) + 0.5);
      ctx.lineTo(w, Math.round(sy) + 0.5);
    }
    ctx.stroke();

    const [ox, oy] = this.toScreen(0, 0, w, h);
    ctx.strokeStyle = c.axis;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(oy) + 0.5);
    ctx.lineTo(w, Math.round(oy) + 0.5);
    ctx.moveTo(Math.round(ox) + 0.5, 0);
    ctx.lineTo(Math.round(ox) + 0.5, h);
    ctx.stroke();
    ctx.fillStyle = c.axis;
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('0', ox + 6, oy - 6);

    ctx.lineCap = 'round';
    for (const s of segments) {
      const [ax, ay] = this.toScreen(s.from[0], s.from[1], w, h);
      const [bx, by] = this.toScreen(s.to[0], s.to[1], w, h);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = Math.max(1, s.width * Math.min(1, Math.max(0.5, this.scale / 2)));
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }

    if (turtle) {
      const [tx, ty] = this.toScreen(turtle.pos[0], turtle.pos[1], w, h);
      const hx = turtle.heading[0];
      const hy = turtle.heading[1];
      const len = Math.hypot(hx, hy) || 1;
      const dx = hx / len;
      const dy = -hy / len; // screen y grows downwards
      const px = -dy;
      const py = dx;
      ctx.fillStyle = c.accent;
      ctx.beginPath();
      ctx.moveTo(tx + dx * 13, ty + dy * 13);
      ctx.lineTo(tx - dx * 6 + px * 7, ty - dy * 6 + py * 7);
      ctx.lineTo(tx - dx * 6 - px * 7, ty - dy * 6 - py * 7);
      ctx.closePath();
      ctx.fill();
    }
  }
}

/** The space: a perspective camera orbiting the origin around the vertical axis Z. */
export class Space3D implements PlanView {
  readonly canvas: HTMLCanvasElement;
  onChange: (() => void) | null = null;
  private yaw = 0.7;
  private pitch = 0.45;
  private dist = 400;
  private target: Vec = [0, 0, 0];
  private radius = 100;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    attachPointers(
      canvas,
      (dx, dy, pan) => {
        if (pan) {
          const { r, u } = this.basis();
          const k = this.dist / this.focal();
          for (let i = 0; i < 3; i++) this.target[i] += (-dx * r[i] + dy * u[i]) * k;
        } else {
          this.yaw -= dx * 0.008;
          this.pitch = Math.max(-1.5, Math.min(1.5, this.pitch + dy * 0.008));
        }
        this.changed();
      },
      (f) => {
        this.dist = Math.min(1e6, Math.max(0.5, this.dist / f));
        this.changed();
      },
      (e) => this.key(e),
      () => this.reset(),
    );
  }

  private changed() {
    this.onChange?.();
  }

  private focal(): number {
    const { w, h } = { w: Math.max(1, this.canvas.clientWidth), h: Math.max(1, this.canvas.clientHeight) };
    return Math.min(w, h) * 0.9;
  }

  private key(e: KeyboardEvent): boolean {
    switch (e.key) {
      case 'ArrowLeft': this.yaw += 0.08; break;
      case 'ArrowRight': this.yaw -= 0.08; break;
      case 'ArrowUp': this.pitch = Math.min(1.5, this.pitch + 0.08); break;
      case 'ArrowDown': this.pitch = Math.max(-1.5, this.pitch - 0.08); break;
      case '+': case '=': this.dist = Math.max(0.5, this.dist / 1.25); break;
      case '-': this.dist = Math.min(1e6, this.dist * 1.25); break;
      case '0': this.reset(); return true;
      default: return false;
    }
    this.changed();
    return true;
  }

  private eye(): Vec {
    const cp = Math.cos(this.pitch);
    return [
      this.target[0] + this.dist * cp * Math.cos(this.yaw),
      this.target[1] + this.dist * cp * Math.sin(this.yaw),
      this.target[2] + this.dist * Math.sin(this.pitch),
    ];
  }

  /** Camera axes: f forward, r right, u up. */
  private basis(): CameraBasis {
    const e = this.eye();
    const f = norm(sub(this.target, e));
    const r = norm(cross(f, [0, 0, 1]));
    const u = cross(r, f);
    return { e, f, r, u };
  }

  /** Projects a point to CSS pixels; null when it is behind the camera. */
  private project(p: Vec, b: CameraBasis, w: number, h: number): [number, number] | null {
    const v = sub(p, b.e);
    const zc = dot(v, b.f);
    if (zc < 0.01 * this.dist) return null;
    const k = this.focal() / zc;
    return [w / 2 + dot(v, b.r) * k, h / 2 - dot(v, b.u) * k];
  }

  reset() {
    this.yaw = 0.7;
    this.pitch = 0.45;
    this.target = [0, 0, 0];
    this.dist = Math.max(this.radius * 2.6, 60);
    this.changed();
  }

  fit(segments: Segment[]) {
    const b = boundsOf(segments);
    this.target = [0, 1, 2].map((i) => (b.min[i] + b.max[i]) / 2) as Vec;
    const ext = [0, 1, 2].map((i) => b.max[i] - b.min[i]);
    this.radius = Math.max(10, Math.hypot(ext[0], ext[1], ext[2]) / 2);
    this.dist = this.radius * 2.6;
    this.changed();
  }

  render(segments: Segment[], turtle: TurtleState | null) {
    const { ctx, w, h } = prepare(this.canvas);
    const c = readColors();
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, w, h);
    const b = this.basis();
    const R = this.radius;

    // ground grid on z = 0
    const step = niceStep((R * 2.6) / 900, 60) * 1;
    const G = Math.ceil((R * 3) / step) * step;
    ctx.strokeStyle = c.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = -G; k <= G + 1e-9; k += step) {
      this.line([k, -G, 0], [k, G, 0], b, ctx, w, h);
      this.line([-G, k, 0], [G, k, 0], b, ctx, w, h);
    }
    ctx.stroke();

    // axes: X red, Y green, Z blue
    const L = R * 1.2;
    const axes: [Vec, string, string][] = [
      [[L, 0, 0], c.x, 'X'],
      [[0, L, 0], c.y, 'Y'],
      [[0, 0, L], c.z, 'Z'],
    ];
    ctx.lineWidth = 2;
    for (const [tip, color, label] of axes) {
      ctx.strokeStyle = color;
      ctx.beginPath();
      this.line([0, 0, 0], tip, b, ctx, w, h);
      ctx.stroke();
      const p = this.project(tip, b, w, h);
      if (p) {
        ctx.fillStyle = color;
        ctx.font = '600 13px system-ui, sans-serif';
        ctx.fillText(label, p[0] + 6, p[1] - 4);
      }
    }

    ctx.lineCap = 'round';
    for (const s of segments) {
      const a = this.project(s.from, b, w, h);
      const d = this.project(s.to, b, w, h);
      if (!a || !d) continue;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = Math.max(1, Math.min(8, s.width * (this.focal() / this.dist) * 0.25));
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(d[0], d[1]);
      ctx.stroke();
    }

    if (turtle) {
      const arrow = R * 0.12;
      const tp = this.project(turtle.pos, b, w, h);
      if (tp) {
        ctx.fillStyle = c.accent;
        ctx.beginPath();
        ctx.arc(tp[0], tp[1], 4, 0, Math.PI * 2);
        ctx.fill();
        const hd = this.project(add(turtle.pos, scale(turtle.heading, arrow)), b, w, h);
        const up = this.project(add(turtle.pos, scale(turtle.up, arrow)), b, w, h);
        for (const [tip, color] of [[hd, c.accent], [up, c.z]] as const) {
          if (!tip) continue;
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(tp[0], tp[1]);
          ctx.lineTo(tip[0], tip[1]);
          ctx.stroke();
        }
      }
    }
  }

  private line(a: Vec, bp: Vec, b: CameraBasis, ctx: CanvasRenderingContext2D, w: number, h: number) {
    const pa = this.project(a, b, w, h);
    const pb = this.project(bp, b, w, h);
    if (!pa || !pb) return;
    ctx.moveTo(pa[0], pa[1]);
    ctx.lineTo(pb[0], pb[1]);
  }
}

// ---- small vector helpers -------------------------------------------------

interface CameraBasis {
  e: Vec;
  f: Vec;
  r: Vec;
  u: Vec;
}

type V = readonly [number, number, number];
const sub = (a: V, b: V): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V, b: V): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: V, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V): Vec => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

