import type { Segment, TurtleState, V3 } from '../lang/interpreter';
import { h } from './dom';
import { boundsOf, cssVar, drawCalloutMarks, leaderDir, type Callout, type DrawingView } from './view';

export type Projection = (p: V3) => [number, number];

export const flat: Projection = (p) => [p[0], p[1]];

/** Orthographic projection matching the default 3D camera (for thumbnails and the no-WebGL fallback). */
export function isoProjection(): Projection {
  const f = norm([-0.55, 0.75, -0.6]);
  const r = norm(cross(f, [0, 0, 1]));
  const u = cross(r, f);
  return (p) => [dot(p, r), dot(p, u)];
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

interface Palette {
  canvas: string;
  grid: string;
  gridMajor: string;
  axis: string;
  ink: string;
  ink2: string;
  sheet: string;
  ghost: string;
}

/**
 * The 2D drawing: a chart-paper grid with a visible origin, pan by drag,
 * zoom by wheel, pinch, buttons or keys.
 */
export class View2D implements DrawingView {
  readonly element: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private segments: Segment[] = [];
  private partial: Segment | null = null;
  private turtle: TurtleState | null = null;
  private ghost: Segment[] | null = null;
  private callouts: Callout[] | null = null;
  private ink = '#137a60';
  private scale = 1.6;
  private cx = 0;
  private cy = 0;
  private w = 300;
  private h = 300;
  private dpr = 1;
  private pal!: Palette;
  private frame = 0;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinch: { d: number; scale: number } | null = null;
  private ro: ResizeObserver;
  userMoved = false;

  constructor(private readonly project: Projection = flat, opts: { label: string } = { label: 'Rysunek' }) {
    this.canvas = h('canvas', { class: 'view-canvas' }) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.element = h(
      'div',
      {
        class: 'view view-2d',
        tabindex: '0',
        role: 'img',
        'aria-roledescription': 'rysunek',
        'aria-label': opts.label,
      },
      this.canvas,
    );
    this.refreshTheme();
    this.bind();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.element);
  }

  // ------------------------------------------------------------- data

  setSegments(segments: Segment[]) {
    this.segments = segments;
    this.invalidate();
  }
  setPartial(segment: Segment | null) {
    this.partial = segment;
    this.invalidate();
  }
  setTurtle(turtle: TurtleState | null) {
    this.turtle = turtle;
    this.invalidate();
  }
  setGhost(segments: Segment[] | null) {
    this.ghost = segments;
    this.invalidate();
  }
  setCallouts(callouts: Callout[] | null) {
    this.callouts = callouts;
    this.invalidate();
  }
  setInk(color: string) {
    this.ink = color;
    this.invalidate();
  }

  refreshTheme() {
    this.pal = {
      canvas: cssVar('--canvas') || '#fcfdfb',
      grid: cssVar('--grid') || '#e6ebe6',
      gridMajor: cssVar('--grid-major') || '#d4dcd5',
      axis: cssVar('--axis') || '#a9b5ae',
      ink: cssVar('--ink') || '#15211d',
      ink2: cssVar('--ink-3') || '#5c6a65',
      sheet: cssVar('--sheet') || '#fbfcfa',
      ghost: cssVar('--fill-task') || '#c1763d',
    };
    this.invalidate();
  }

  // ------------------------------------------------------------- view

  fit() {
    this.resize();
    const pts: V3[] = [];
    const all = [...this.segments, ...(this.ghost ?? [])];
    for (const s of all) pts.push(s.from, s.to);
    if (this.turtle) pts.push(this.turtle.pos);
    if (pts.length <= 1) {
      this.cx = 0;
      this.cy = 0;
      this.scale = 1.6;
    } else {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of pts) {
        const [x, y] = this.project(p);
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
      const pad = 40;
      const bw = Math.max(maxX - minX, 1);
      const bh = Math.max(maxY - minY, 1);
      this.scale = Math.min((this.w - pad * 2) / bw, (this.h - pad * 2) / bh, 12);
      this.scale = Math.max(this.scale, 0.002);
      this.cx = (minX + maxX) / 2;
      this.cy = (minY + maxY) / 2;
    }
    this.userMoved = false;
    this.invalidate();
  }

  zoom(factor: number, sx = this.w / 2, sy = this.h / 2) {
    const [wx, wy] = this.toWorld(sx, sy);
    this.scale = Math.min(200, Math.max(0.002, this.scale * factor));
    this.cx = wx - (sx - this.w / 2) / this.scale;
    this.cy = wy + (sy - this.h / 2) / this.scale;
    this.userMoved = true;
    this.invalidate();
  }

  resetView() {
    this.cx = 0;
    this.cy = 0;
    this.scale = 1.6;
    this.userMoved = false;
    this.invalidate();
  }

  isVisible(points: V3[]) {
    return points.every((p) => {
      const [x, y] = this.toScreen(p);
      return x >= 0 && y >= 0 && x <= this.w && y <= this.h;
    });
  }

  resize() {
    const r = this.element.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    this.w = r.width;
    this.h = r.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.draw();
  }

  destroy() {
    this.ro.disconnect();
    cancelAnimationFrame(this.frame);
  }

  private toScreen(p: V3): [number, number] {
    const [x, y] = this.project(p);
    return [this.w / 2 + (x - this.cx) * this.scale, this.h / 2 - (y - this.cy) * this.scale];
  }

  private toWorld(sx: number, sy: number): [number, number] {
    return [this.cx + (sx - this.w / 2) / this.scale, this.cy - (sy - this.h / 2) / this.scale];
  }

  private invalidate() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.draw();
    });
  }

  // ------------------------------------------------------------- input

  private bind() {
    const el = this.element;
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), scale: this.scale };
      }
      el.classList.add('is-grabbing');
    });
    el.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const cur = { x: e.clientX, y: e.clientY };
      this.pointers.set(e.pointerId, cur);
      if (this.pointers.size === 1) {
        this.cx -= (cur.x - prev.x) / this.scale;
        this.cy += (cur.y - prev.y) / this.scale;
        this.userMoved = true;
        this.invalidate();
      } else if (this.pinch && this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const rect = el.getBoundingClientRect();
        const target = this.pinch.scale * (d / this.pinch.d);
        this.zoom(target / this.scale, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
      }
    });
    const end = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
      if (!this.pointers.size) el.classList.remove('is-grabbing');
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015));
        this.zoom(factor, e.clientX - rect.left, e.clientY - rect.top);
      },
      { passive: false },
    );
    el.addEventListener('keydown', (e) => {
      const step = 40 / this.scale;
      let handled = true;
      switch (e.key) {
        case 'ArrowLeft': this.cx -= step; break;
        case 'ArrowRight': this.cx += step; break;
        case 'ArrowUp': this.cy += step; break;
        case 'ArrowDown': this.cy -= step; break;
        case '+': case '=': this.zoom(1.25); break;
        case '-': case '_': this.zoom(0.8); break;
        case '0': this.fit(); break;
        default: handled = false;
      }
      if (handled) {
        e.preventDefault();
        if (e.key.startsWith('Arrow')) {
          this.userMoved = true;
          this.invalidate();
        }
      }
    });
  }

  // ------------------------------------------------------------- drawing

  private draw() {
    const { ctx, w, h, pal } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = pal.canvas;
    ctx.fillRect(0, 0, w, h);
    if (this.project === flat) this.drawGrid();
    else this.drawIsoAxes();
    if (this.ghost) this.drawGhost(this.ghost);
    drawSegments(ctx, this.segments, (p) => this.toScreen(p));
    if (this.partial) drawSegments(ctx, [this.partial], (p) => this.toScreen(p));
    if (this.callouts?.length) this.drawCallouts(this.callouts);
    if (this.turtle) this.drawTurtle(this.turtle);
  }

  private drawGrid() {
    const { ctx, w, h, pal, scale } = this;
    const steps = [1, 2, 5];
    let step = 10;
    outer: for (let p = -3; p < 7; p++) {
      for (const s of steps) {
        const v = s * 10 ** p;
        if (v * scale >= 22) {
          step = v;
          break outer;
        }
      }
    }
    const major = step * 5;
    const [x0, y1] = this.toWorld(0, 0);
    const [x1, y0] = this.toWorld(w, h);
    ctx.lineWidth = 1;
    const line = (isMajor: boolean) => {
      ctx.strokeStyle = isMajor ? pal.gridMajor : pal.grid;
    };
    for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) {
      const isMajor = Math.abs(Math.round(x / major) * major - x) < step / 2;
      line(isMajor);
      const sx = Math.round(this.w / 2 + (x - this.cx) * scale) + 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, h);
      ctx.stroke();
    }
    for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) {
      const isMajor = Math.abs(Math.round(y / major) * major - y) < step / 2;
      line(isMajor);
      const sy = Math.round(this.h / 2 - (y - this.cy) * scale) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(w, sy);
      ctx.stroke();
    }
    // axes through the origin
    const [ox, oy] = this.toScreen([0, 0, 0]);
    ctx.strokeStyle = pal.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(ox) + 0.5, 0);
    ctx.lineTo(Math.round(ox) + 0.5, h);
    ctx.moveTo(0, Math.round(oy) + 0.5);
    ctx.lineTo(w, Math.round(oy) + 0.5);
    ctx.stroke();
    // origin roundel and labels
    ctx.fillStyle = pal.canvas;
    ctx.strokeStyle = pal.ink2;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ox, oy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = pal.ink2;
    ctx.font = `600 11px ${cssVar('--font-ui') || 'sans-serif'}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('0', ox + 7, oy + 5);
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'right';
    ctx.fillText('x', w - 8, oy - 4);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('y', ox + 7, 8);
    // scale note: one grid square
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`kratka = ${step.toLocaleString('pl-PL')}`, w - 10, h - 8);
  }

  private drawIsoAxes() {
    const { ctx, pal } = this;
    const L = 60;
    const axes: [V3, string][] = [
      [[L, 0, 0], 'x'],
      [[0, L, 0], 'y'],
      [[0, 0, L], 'z'],
    ];
    const [ox, oy] = this.toScreen([0, 0, 0]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = pal.axis;
    ctx.fillStyle = pal.ink2;
    ctx.font = `600 11px ${cssVar('--font-ui') || 'sans-serif'}`;
    for (const [p, label] of axes) {
      const [x, y] = this.toScreen(p);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillText(label, x + 4, y - 4);
    }
  }

  private drawGhost(segs: Segment[]) {
    const { ctx } = this;
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.pal.ghost;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const s of segs) {
      const [ax, ay] = this.toScreen(s.from);
      const [bx, by] = this.toScreen(s.to);
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawCallouts(callouts: Callout[]) {
    const b = boundsOf(this.segments);
    const [cx, cy] = this.toScreen([(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2]);
    const marks = callouts.map((c) => {
      const [x, y] = this.toScreen(c.anchor);
      const [bx, by] = this.toScreen([c.anchor[0] + c.along[0], c.anchor[1] + c.along[1], c.anchor[2] + c.along[2]]);
      const [dx, dy] = leaderDir(x, y, bx, by, cx, cy);
      return { n: c.n, x, y, dx, dy };
    });
    const avoid = this.turtle ? [(([x, y]) => ({ x, y }))(this.toScreen(this.turtle.pos))] : [];
    drawCalloutMarks(this.ctx, marks, this.w, this.h, { ink: this.pal.ink, sheet: this.pal.sheet }, avoid);
  }

  private drawTurtle(t: TurtleState) {
    const { ctx } = this;
    const [px, py] = this.toScreen(t.pos);
    const [hx0, hy0] = this.toScreen([t.pos[0] + t.heading[0], t.pos[1] + t.heading[1], t.pos[2] + t.heading[2]]);
    let hx = hx0 - px;
    let hy = hy0 - py;
    const l = Math.hypot(hx, hy) || 1;
    hx /= l;
    hy /= l;
    const rx = -hy;
    const ry = hx;
    const S = 15;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(px + hx * S, py + hy * S);
    ctx.lineTo(px - hx * S * 0.45 + rx * S * 0.55, py - hy * S * 0.45 + ry * S * 0.55);
    ctx.lineTo(px - hx * S * 0.2, py - hy * S * 0.2);
    ctx.lineTo(px - hx * S * 0.45 - rx * S * 0.55, py - hy * S * 0.45 - ry * S * 0.55);
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    if (t.pen) {
      ctx.fillStyle = this.ink;
      ctx.strokeStyle = this.pal.canvas;
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = this.pal.canvas;
      ctx.strokeStyle = this.ink;
      ctx.fill();
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.fillStyle = t.pen ? t.color : this.pal.canvas;
    ctx.strokeStyle = this.pal.canvas;
    ctx.lineWidth = 1.5;
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // ------------------------------------------------------------- export

  async toPNG(title: string): Promise<Blob> {
    return renderPNG(this.segments, this.project, title);
  }
}

/** Draws strokes, batching runs of the same ink and width into one path. */
export function drawSegments(ctx: CanvasRenderingContext2D, segs: Segment[], to: (p: V3) => [number, number], widthScale = 1, minWidth = 0.6) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  let i = 0;
  while (i < segs.length) {
    const { color, width } = segs[i];
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(minWidth, width * widthScale);
    ctx.beginPath();
    let last: [number, number] | null = null;
    while (i < segs.length && segs[i].color === color && segs[i].width === width) {
      const a = to(segs[i].from);
      const b = to(segs[i].to);
      if (!last || Math.abs(last[0] - a[0]) > 0.01 || Math.abs(last[1] - a[1]) > 0.01) ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      last = b;
      i++;
    }
    ctx.stroke();
  }
}

/** Fits segments into a w×h box and draws them; used by thumbnails and exports. */
export function drawFitted(
  ctx: CanvasRenderingContext2D,
  segs: Segment[],
  project: Projection,
  w: number,
  h: number,
  pad: number,
  widthScale = 1,
  minWidth = 0.6,
) {
  if (!segs.length) return;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of segs)
    for (const p of [s.from, s.to]) {
      const [x, y] = project(p);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  const sc = Math.min((w - pad * 2) / Math.max(maxX - minX, 1), (h - pad * 2) / Math.max(maxY - minY, 1), 8);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  drawSegments(ctx, segs, (p) => {
    const [x, y] = project(p);
    return [w / 2 + (x - cx) * sc, h / 2 - (y - cy) * sc];
  }, widthScale, minWidth);
}

/** PNG of the drawing on chart paper, with a small caption. */
export function renderPNG(segs: Segment[], project: Projection, title: string): Promise<Blob> {
  const W = 1600;
  const H = 1200;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fcfdfb';
  ctx.fillRect(0, 0, W, H);
  drawFitted(ctx, segs, project, W, H - 60, 80, 2);
  ctx.fillStyle = '#44524d';
  ctx.font = `600 26px ${cssVar('--font-ui') || 'sans-serif'}`;
  ctx.textBaseline = 'bottom';
  ctx.fillText(`Logomocja · ${title}`, 48, H - 36);
  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG'))), 'image/png'));
}

export function boundsCenter(segs: Segment[]): V3 {
  const b = boundsOf(segs);
  return [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2];
}
