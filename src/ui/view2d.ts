import type { Segment, Turtle } from '../logo';
import { cssVar } from './util';

/** Flat view of the plane (XY). Pan by dragging, zoom with the wheel, pinch or + / −. */
export class View2D {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly resizer: ResizeObserver;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private pinchDist = 0;
  private scale = 4;
  private ox = 0;
  private oy = 0;
  private w = 0;
  private h = 0;
  private segments: Segment[] = [];
  private turtle: Turtle | null = null;

  constructor(host: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'view-canvas';
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', 'Płaszczyzna rysunku. Strzałki przesuwają widok, plus i minus powiększają.');
    host.append(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.resizer = new ResizeObserver(() => this.resize());
    this.resizer.observe(host);

    this.canvas.addEventListener('pointerdown', this.onDown);
    this.canvas.addEventListener('pointermove', this.onMove);
    this.canvas.addEventListener('pointerup', this.onUp);
    this.canvas.addEventListener('pointercancel', this.onUp);
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.canvas.addEventListener('keydown', this.onKey);
    this.resize();
  }

  dispose() {
    this.resizer.disconnect();
    this.canvas.remove();
  }

  private resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement!.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    if (w === this.w && h === this.h && this.canvas.width === Math.floor(w * dpr)) return;
    const first = this.w === 0;
    this.w = w;
    this.h = h;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    if (first) {
      this.ox = w / 2;
      this.oy = h / 2;
    }
    this.paint();
  }

  /** Colours are read from CSS variables on every paint, so a theme change only needs a repaint. */
  setTheme() {
    this.paint();
  }

  draw(segments: Segment[], turtle: Turtle | null) {
    this.segments = segments;
    this.turtle = turtle;
    this.paint();
  }

  /** Scales and centres the view so that the whole drawing, the origin and the turtle are visible. */
  fit(segments: Segment[], turtle: Turtle | null) {
    const pts: [number, number][] = [[0, 0]];
    for (const s of segments) pts.push([s.from[0], s.from[1]], [s.to[0], s.to[1]]);
    if (turtle) pts.push([turtle.pos[0], turtle.pos[1]]);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const [x, y] of pts) {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
    const bw = Math.max(x1 - x0, 20);
    const bh = Math.max(y1 - y0, 20);
    const s = Math.min((this.w * 0.85) / bw, (this.h * 0.85) / bh);
    this.scale = Math.min(Math.max(s, 1e-4), 1e4);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    this.ox = this.w / 2 - cx * this.scale;
    this.oy = this.h / 2 + cy * this.scale;
    this.paint();
  }

  zoom(factor: number) {
    this.zoomAt(this.w / 2, this.h / 2, factor);
  }

  private zoomAt(x: number, y: number, factor: number) {
    const next = Math.min(Math.max(this.scale * factor, 1e-4), 1e4);
    const k = next / this.scale;
    this.ox = x - (x - this.ox) * k;
    this.oy = y - (y - this.oy) * k;
    this.scale = next;
    this.paint();
  }

  private pan(dx: number, dy: number) {
    this.ox += dx;
    this.oy += dy;
    this.paint();
  }

  /** The canvas as a PNG file. */
  exportPng(): Promise<Blob> {
    this.paint();
    return new Promise((resolve, reject) =>
      this.canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Nie udało się zapisać obrazu.'))), 'image/png'),
    );
  }

  private toScreen(x: number, y: number): [number, number] {
    return [this.ox + x * this.scale, this.oy - y * this.scale];
  }

  private paint() {
    if (!this.w) return;
    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = cssVar('--canvas-bg') || '#fff';
    ctx.fillRect(0, 0, this.w, this.h);
    this.paintGrid();

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const s of this.segments) {
      const [x1, y1] = this.toScreen(s.from[0], s.from[1]);
      const [x2, y2] = this.toScreen(s.to[0], s.to[1]);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    this.paintOrigin();
    if (this.turtle) this.paintTurtle(this.turtle);
  }

  private paintGrid() {
    const ctx = this.ctx;
    // Pick a grid step so that cells are roughly 40-120 px wide.
    const raw = 80 / this.scale;
    const step = Math.pow(10, Math.floor(Math.log10(raw)));
    const unit = [1, 2, 5, 10].map((m) => m * step).find((s) => s * this.scale >= 40) ?? step;
    const x0 = Math.floor((0 - this.ox) / this.scale / unit) * unit;
    const x1 = (this.w - this.ox) / this.scale;
    const y0 = (this.oy - this.h) / this.scale;
    const y1 = Math.ceil((this.oy - 0) / this.scale / unit) * unit;
    ctx.fillStyle = cssVar('--grid') || '#ddd';
    for (let x = x0; x <= x1; x += unit) {
      for (let y = Math.floor(y0 / unit) * unit; y <= y1; y += unit) {
        const [sx, sy] = this.toScreen(x, y);
        ctx.fillRect(Math.round(sx) - 1, Math.round(sy) - 1, 2, 2);
      }
    }
  }

  private paintOrigin() {
    const ctx = this.ctx;
    const [ox, oy] = this.toScreen(0, 0);
    ctx.strokeStyle = cssVar('--axis') || '#888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(oy) + 0.5);
    ctx.lineTo(this.w, Math.round(oy) + 0.5);
    ctx.moveTo(Math.round(ox) + 0.5, 0);
    ctx.lineTo(Math.round(ox) + 0.5, this.h);
    ctx.stroke();
    ctx.fillStyle = cssVar('--muted') || '#666';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('0,0', ox + 6, oy + 14);
  }

  private paintTurtle(t: Turtle) {
    const ctx = this.ctx;
    const [px, py] = this.toScreen(t.pos[0], t.pos[1]);
    const dx = t.h[0];
    const dy = -t.h[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const tip = [px + ux * 13, py + uy * 13];
    const left = [px - ux * 6 - uy * 7, py - uy * 6 + ux * 7];
    const right = [px - ux * 6 + uy * 7, py - uy * 6 - ux * 7];
    ctx.beginPath();
    ctx.moveTo(tip[0], tip[1]);
    ctx.lineTo(left[0], left[1]);
    ctx.lineTo(right[0], right[1]);
    ctx.closePath();
    const color = cssVar('--turtle') || '#c1763d';
    ctx.fillStyle = t.pen ? color : 'transparent';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  }

  private onDown = (e: PointerEvent) => {
    this.canvas.setPointerCapture(e.pointerId);
    this.canvas.focus({ preventScroll: true });
    this.pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
    if (this.pointers.size === 2) this.pinchDist = this.spread();
  };

  private onMove = (e: PointerEvent) => {
    const prev = this.pointers.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.offsetX, y: e.offsetY };
    this.pointers.set(e.pointerId, cur);
    if (this.pointers.size === 1) {
      this.pan(cur.x - prev.x, cur.y - prev.y);
    } else if (this.pointers.size === 2) {
      const d = this.spread();
      if (this.pinchDist > 0 && d > 0) {
        const [a, b] = [...this.pointers.values()];
        this.zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, d / this.pinchDist);
      }
      this.pinchDist = d;
    }
  };

  private onUp = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    this.pinchDist = this.pointers.size === 2 ? this.spread() : 0;
  };

  private spread(): number {
    const [a, b] = [...this.pointers.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.zoomAt(e.offsetX, e.offsetY, Math.exp(-e.deltaY * 0.0015));
  };

  private onKey = (e: KeyboardEvent) => {
    const step = 40;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => this.pan(step, 0),
      ArrowRight: () => this.pan(-step, 0),
      ArrowUp: () => this.pan(0, step),
      ArrowDown: () => this.pan(0, -step),
      '+': () => this.zoom(1.25),
      '=': () => this.zoom(1.25),
      '-': () => this.zoom(0.8),
      '−': () => this.zoom(0.8),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };
}
