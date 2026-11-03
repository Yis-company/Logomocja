// The 2D drafting sheet: millimetre grid, rulers, origin, segments and the turtle marker.
import type { Segment, Vec } from '../lang/interp';

export interface TurtlePose { pos: Vec; h: Vec; r: Vec; u: Vec; pen: boolean; color: string }

export interface Palette {
  ground: string; minor: string; major: string; axis: string; ink: string; inkSoft: string; active: string; activeInk: string;
}

export function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el);
  const v = (n: string) => cs.getPropertyValue(n).trim();
  return {
    ground: v('--sheet'), minor: v('--grid-minor'), major: v('--grid-major'), axis: v('--grid-axis'),
    ink: v('--ink'), inkSoft: v('--ink-2'), active: v('--active'), activeInk: v('--on-active'),
  };
}

/** Stroke segments in runs of identical style, so 10 000 segments stay cheap. */
export function strokeSegments(ctx: CanvasRenderingContext2D, segs: Segment[], tx: (p: Vec) => [number, number], widthScale = 1) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  let i = 0;
  while (i < segs.length) {
    const { color, width } = segs[i];
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width * widthScale;
    let lastTo: [number, number] | null = null;
    while (i < segs.length && segs[i].color === color && segs[i].width === width) {
      const a = tx(segs[i].from);
      const b = tx(segs[i].to);
      if (!lastTo || lastTo[0] !== a[0] || lastTo[1] !== a[1]) ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      lastTo = b;
      i++;
    }
    ctx.stroke();
  }
}

export function bounds(segs: Segment[], pose?: TurtlePose | null) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (p: Vec) => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); };
  for (const s of segs) { add(s.from); add(s.to); }
  if (pose) add(pose.pos);
  if (x0 === Infinity) return null;
  return { x0, y0, x1, y1 };
}

export function drawTurtle(ctx: CanvasRenderingContext2D, x: number, y: number, hx: number, hy: number, pal: Palette, pen: boolean, size = 13) {
  const len = Math.hypot(hx, hy) || 1;
  const ux = hx / len, uy = hy / len;
  const px = -uy, py = ux;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + ux * size, y + uy * size);
  ctx.lineTo(x - ux * size * 0.6 + px * size * 0.62, y - uy * size * 0.6 + py * size * 0.62);
  ctx.lineTo(x - ux * size * 0.25, y - uy * size * 0.25);
  ctx.lineTo(x - ux * size * 0.6 - px * size * 0.62, y - uy * size * 0.6 - py * size * 0.62);
  ctx.closePath();
  ctx.fillStyle = pen ? pal.active : 'transparent';
  ctx.strokeStyle = pal.active;
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(0,0,0,.18)';
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 3;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = pen ? pal.activeInk : pal.active;
  ctx.fill();
  ctx.restore();
}

function niceStep(min: number) {
  const p = Math.pow(10, Math.floor(Math.log10(min)));
  for (const m of [1, 2, 5, 10]) if (p * m >= min) return p * m;
  return p * 10;
}

export class View2D {
  canvas: HTMLCanvasElement;
  scale = 1;
  ox = 0;
  oy = 0;
  segments: Segment[] = [];
  pose: TurtlePose | null = null;
  /** While a program executes, the newest segment is traced in the active ink. */
  active = false;
  private pal!: Palette;
  private raf = 0;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinch: { d: number; s: number } | null = null;
  /** Did the user move the view by hand since the last fit? */
  touched = false;
  private sized = false;
  onChange: () => void = () => {};

  constructor(private host: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'sheet-canvas';
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', 'Rysunek 2D. Strzałki przesuwają widok, plus i minus przybliżają, zero dopasowuje.');
    host.appendChild(this.canvas);
    new ResizeObserver(() => this.resize()).observe(host);
    this.refreshPalette();
    this.bind();
  }

  refreshPalette() { this.pal = readPalette(this.host); this.request(); }

  private bind() {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: this.scale };
      }
    });
    c.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const cur = { x: e.clientX, y: e.clientY };
      this.pointers.set(e.pointerId, cur);
      if (this.pointers.size === 1) {
        this.ox += cur.x - prev.x;
        this.oy += cur.y - prev.y;
      } else if (this.pinch && this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        const r = c.getBoundingClientRect();
        const mx = (a.x + b.x) / 2 - r.left, my = (a.y + b.y) / 2 - r.top;
        this.zoomAt(this.pinch.s * (Math.hypot(a.x - b.x, a.y - b.y) / this.pinch.d) / this.scale, mx, my);
        this.ox += (cur.x - prev.x) / 2;
        this.oy += (cur.y - prev.y) / 2;
      }
      this.touched = true;
      this.request();
    });
    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = c.getBoundingClientRect();
      const k = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015));
      this.zoomAt(k, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    c.addEventListener('dblclick', () => this.fit());
    c.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 120 : 40;
      const k: Record<string, () => void> = {
        ArrowLeft: () => this.pan(step, 0), ArrowRight: () => this.pan(-step, 0),
        ArrowUp: () => this.pan(0, step), ArrowDown: () => this.pan(0, -step),
        '+': () => this.zoom(1.25), '=': () => this.zoom(1.25), '-': () => this.zoom(0.8), '0': () => this.fit(),
      };
      if (k[e.key] && !e.ctrlKey && !e.metaKey) { e.preventDefault(); k[e.key](); }
    });
  }

  pan(dx: number, dy: number) { this.ox += dx; this.oy += dy; this.touched = true; this.request(); }

  zoom(k: number) {
    const r = this.canvas.getBoundingClientRect();
    this.zoomAt(k, r.width / 2, r.height / 2);
  }

  private zoomAt(k: number, mx: number, my: number) {
    const s = Math.min(400, Math.max(0.002, this.scale * k));
    const kk = s / this.scale;
    this.ox = mx - (mx - this.ox) * kk;
    this.oy = my - (my - this.oy) * kk;
    this.scale = s;
    this.touched = true;
    this.request();
  }

  private size() {
    const r = this.host.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  }

  private resize() {
    const { w, h } = this.size();
    if (w < 2 || h < 2) return; // hidden: keep the last real size
    const first = !this.sized;
    this.sized = true;
    const prev = { w: this.canvas.clientWidth, h: this.canvas.clientHeight };
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    if (first || prev.w < 2) this.fit();
    else { this.ox += (w - prev.w) / 2; this.oy += (h - prev.h) / 2; }
    this.draw();
  }

  /** Fit the drawing (and the origin) into view with a margin. */
  fit() {
    const { w, h } = this.size();
    const b = bounds(this.segments, this.pose) ?? { x0: 0, y0: 0, x1: 0, y1: 0 };
    const pad = Math.min(72, Math.min(w, h) * 0.12);
    const bw = Math.max(b.x1 - b.x0, 1), bh = Math.max(b.y1 - b.y0, 1);
    let s = Math.min((w - pad * 2) / bw, (h - pad * 2) / bh);
    if (b.x1 - b.x0 < 1 && b.y1 - b.y0 < 1) s = 1;
    this.scale = Math.min(Math.max(s, 0.002), 40);
    const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    this.ox = w / 2 - cx * this.scale;
    this.oy = h / 2 + cy * this.scale;
    this.touched = false;
    this.request();
  }

  /** Fit only when part of the drawing is outside the view and the user has not moved it. */
  fitIfNeeded() {
    const b = bounds(this.segments, this.pose);
    if (!b) return;
    const { w, h } = this.size();
    const a = this.toScreen([b.x0, b.y1, 0]);
    const c = this.toScreen([b.x1, b.y0, 0]);
    if (a[0] < 8 || a[1] < 8 || c[0] > w - 8 || c[1] > h - 8) this.fit();
  }

  toScreen(p: Vec): [number, number] {
    return [this.ox + p[0] * this.scale, this.oy - p[1] * this.scale];
  }

  request() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => { this.raf = 0; this.draw(); this.onChange(); });
  }

  draw() {
    const ctx = this.canvas.getContext('2d')!;
    const dpr = this.canvas.width / Math.max(1, this.canvas.clientWidth || 1);
    const { w, h } = { w: this.canvas.width / dpr, h: this.canvas.height / dpr };
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintSheet(ctx, w, h, this, this.pal);
    strokeSegments(ctx, this.segments, (p) => this.toScreen(p));
    const last = this.segments[this.segments.length - 1];
    if (this.active && last) {
      const a = this.toScreen(last.from), b = this.toScreen(last.to);
      ctx.save();
      ctx.strokeStyle = this.pal.active;
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(2, last.width * 0.5);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.restore();
    }
    if (this.pose) {
      const [x, y] = this.toScreen(this.pose.pos);
      drawTurtle(ctx, x, y, this.pose.h[0], -this.pose.h[1], this.pal, this.pose.pen);
    }
  }

  /** Export the fitted drawing on plain sheet ground. */
  toPNG(): Promise<Blob | null> {
    const b = bounds(this.segments) ?? { x0: -50, y0: -50, x1: 50, y1: 50 };
    const bw = Math.max(b.x1 - b.x0, 1), bh = Math.max(b.y1 - b.y0, 1);
    const max = 1600, pad = 48;
    const s = Math.min((max - pad * 2) / bw, (max - pad * 2) / bh, 8);
    const c = document.createElement('canvas');
    c.width = Math.ceil(bw * s + pad * 2);
    c.height = Math.ceil(bh * s + pad * 2);
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = this.pal.ground;
    ctx.fillRect(0, 0, c.width, c.height);
    strokeSegments(ctx, this.segments, (p) => [pad + (p[0] - b.x0) * s, pad + (b.y1 - p[1]) * s], 2);
    return new Promise((res) => c.toBlob(res, 'image/png'));
  }
}

/** Grid, rulers and origin cross for a view transform. */
export function paintSheet(ctx: CanvasRenderingContext2D, w: number, h: number, v: { scale: number; ox: number; oy: number }, pal: Palette) {
  ctx.fillStyle = pal.ground;
  ctx.fillRect(0, 0, w, h);
  const minor = niceStep(9 / v.scale);
  const lead = Math.round(minor / Math.pow(10, Math.floor(Math.log10(minor))));
  const major = minor * (lead === 2 ? 5 : lead === 5 ? 2 : 10);
  const lines = (step: number, color: string, lw: number) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    const x0 = Math.floor(-v.ox / v.scale / step) * step;
    for (let x = x0; v.ox + x * v.scale <= w; x += step) {
      const sx = Math.round(v.ox + x * v.scale) + 0.5;
      ctx.moveTo(sx, 0); ctx.lineTo(sx, h);
    }
    const y0 = Math.floor((v.oy - h) / v.scale / step) * step;
    for (let y = y0; v.oy - y * v.scale >= 0; y += step) {
      const sy = Math.round(v.oy - y * v.scale) + 0.5;
      ctx.moveTo(0, sy); ctx.lineTo(w, sy);
    }
    ctx.stroke();
  };
  lines(minor, pal.minor, 1);
  lines(major, pal.major, 1);
  // origin cross
  ctx.beginPath();
  ctx.strokeStyle = pal.axis;
  ctx.lineWidth = 1;
  const ox = Math.round(v.ox) + 0.5, oy = Math.round(v.oy) + 0.5;
  ctx.moveTo(ox - 18, oy); ctx.lineTo(ox + 18, oy);
  ctx.moveTo(ox, oy - 18); ctx.lineTo(ox, oy + 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ox, oy, 5, 0, Math.PI * 2);
  ctx.stroke();
  // rulers along the top and left edge; labels at least ~56px apart
  let label = major;
  while (label * v.scale < 56) label *= Math.round(label / Math.pow(10, Math.floor(Math.log10(label)))) === 2 ? 2.5 : 2;
  ctx.fillStyle = pal.inkSoft;
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.strokeStyle = pal.axis;
  ctx.beginPath();
  const x0 = Math.floor(-v.ox / v.scale / major) * major;
  for (let x = x0; v.ox + x * v.scale <= w; x += major) {
    const sx = Math.round(v.ox + x * v.scale) + 0.5;
    ctx.moveTo(sx, 0); ctx.lineTo(sx, 6);
    if (sx > 26 && isMultiple(x, label)) ctx.fillText(fmtRuler(x), sx + 3, 3);
  }
  const y0 = Math.floor((v.oy - h) / v.scale / major) * major;
  for (let y = y0; v.oy - y * v.scale >= 0; y += major) {
    const sy = Math.round(v.oy - y * v.scale) + 0.5;
    ctx.moveTo(0, sy); ctx.lineTo(6, sy);
    if (sy > 18 && sy < h - 14 && isMultiple(y, label)) ctx.fillText(fmtRuler(y), 3, sy + 3);
  }
  ctx.stroke();
}

function isMultiple(v: number, step: number) {
  const r = v / step;
  return Math.abs(r - Math.round(r)) < 1e-6;
}

function fmtRuler(n: number) {
  const r = Math.round(n * 1000) / 1000;
  return String(r).replace('.', ',').replace('-', '−');
}
