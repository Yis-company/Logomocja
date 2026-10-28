import type { Segment, Vec3 } from '../lang/interp';
import { h, raf } from './dom';
import { boundsOf, cssVar, Draw, flatProject, isoProject, View } from './draw';

type Proj = (v: Vec3) => [number, number];
interface Viewport { scale: number; cx: number; cy: number }

function niceStep(raw: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 5, 10]) if (p * m >= raw) return p * m;
  return p * 10;
}

export class View2D implements View {
  readonly el: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private vp: Viewport = { scale: 1, cx: 0, cy: 0 };
  private w = 300;
  private hgt = 300;
  private dpr = 1;
  private pending = false;
  private proj: Proj;
  private pointers = new Map<number, { x: number; y: number }>();
  private lastPinch = 0;
  private waiters: Array<() => void> = [];

  constructor(private draw: Draw, readonly iso = false, label = 'Rysunek żółwia') {
    this.proj = iso ? isoProject : flatProject;
    this.canvas = h('canvas', {
      class: 'view-canvas', tabindex: 0, role: 'img',
      'aria-label': `${label}. Strzałki przesuwają widok, plus i minus zmieniają powiększenie, zero dopasowuje rysunek.`,
    });
    this.ctx = this.canvas.getContext('2d')!;
    this.el = h('div', { class: 'view-host' }, this.canvas);
    new ResizeObserver(() => this.resize()).observe(this.el);
    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const r = this.canvas.getBoundingClientRect();
      this.zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    this.canvas.addEventListener('pointerdown', e => {
      this.canvas.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.lastPinch = this.pinchDist();
    });
    this.canvas.addEventListener('pointermove', e => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (this.pointers.size === 1) this.panPx(dx, dy);
      else if (this.pointers.size === 2) {
        const d = this.pinchDist();
        const r = this.canvas.getBoundingClientRect();
        const pts = [...this.pointers.values()];
        const mx = (pts[0].x + pts[1].x) / 2 - r.left, my = (pts[0].y + pts[1].y) / 2 - r.top;
        if (this.lastPinch > 0) this.zoomAt(d / this.lastPinch, mx, my);
        this.lastPinch = d;
      }
    });
    const up = (e: PointerEvent) => { this.pointers.delete(e.pointerId); this.lastPinch = this.pinchDist(); };
    this.canvas.addEventListener('pointerup', up);
    this.canvas.addEventListener('pointercancel', up);
    this.canvas.addEventListener('dblclick', () => this.fit());
    this.canvas.addEventListener('keydown', e => {
      const k = e.key;
      const step = 40;
      if (k === 'ArrowLeft') this.panPx(step, 0);
      else if (k === 'ArrowRight') this.panPx(-step, 0);
      else if (k === 'ArrowUp') this.panPx(0, step);
      else if (k === 'ArrowDown') this.panPx(0, -step);
      else if (k === '+' || k === '=') this.zoom(1.25);
      else if (k === '-' || k === '_') this.zoom(0.8);
      else if (k === '0' || k === 'f' || k === 'F') this.fit();
      else return;
      e.preventDefault();
    });
    this.reset();
  }

  private pinchDist(): number {
    if (this.pointers.size < 2) return 0;
    const [a, b] = [...this.pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  private resize() {
    const r = this.el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const first = this.w === 300 && this.hgt === 300;
    this.w = r.width; this.hgt = r.height;
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.hgt * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.hgt}px`;
    if (first) this.fit();
    this.invalidate();
  }

  private panPx(dx: number, dy: number) {
    this.vp.cx -= dx / this.vp.scale;
    this.vp.cy += dy / this.vp.scale;
    this.invalidate();
  }

  private zoomAt(f: number, px: number, py: number) {
    const v = this.vp;
    const wx = v.cx + (px - this.w / 2) / v.scale;
    const wy = v.cy - (py - this.hgt / 2) / v.scale;
    v.scale = Math.min(1e4, Math.max(1e-3, v.scale * f));
    v.cx = wx - (px - this.w / 2) / v.scale;
    v.cy = wy + (py - this.hgt / 2) / v.scale;
    this.invalidate();
  }

  zoom(f: number) { this.zoomAt(f, this.w / 2, this.hgt / 2); }

  reset() {
    this.vp = { scale: Math.min(this.w, this.hgt) / 520, cx: 0, cy: this.iso ? 80 : 0 };
    this.invalidate();
  }

  fit(segs?: Segment[]) {
    const list = segs ?? [...this.draw.segments, ...(this.draw.ghost ?? [])];
    const b = boundsOf(list, this.proj);
    if (!b) { this.reset(); return; }
    let [x0, y0, x1, y1] = b;
    x0 = Math.min(x0, 0); y0 = Math.min(y0, 0); x1 = Math.max(x1, 0); y1 = Math.max(y1, 0);
    const margin = 36;
    const bw = Math.max(x1 - x0, 1e-6), bh = Math.max(y1 - y0, 1e-6);
    const s = Math.min((this.w - 2 * margin) / bw, (this.hgt - 2 * margin) / bh);
    this.vp = { scale: Math.min(1e4, Math.max(1e-3, s)), cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
    this.invalidate();
  }

  invalidate() {
    if (this.pending) return;
    this.pending = true;
    requestAnimationFrame(() => {
      this.pending = false;
      this.paint(this.ctx, this.w, this.hgt, this.dpr, this.vp, true);
      const w = this.waiters; this.waiters = [];
      w.forEach(f => f());
    });
  }

  settled(): Promise<void> {
    return new Promise(res => { this.waiters.push(res); this.invalidate(); });
  }

  private paint(ctx: CanvasRenderingContext2D, W: number, H: number, dpr: number, vp: Viewport, withTurtle: boolean, plain = false) {
    const paper = cssVar('--paper') || '#fbf8f1';
    const grid = cssVar('--grid') || 'rgba(0,0,0,.07)';
    const axis = cssVar('--axis') || 'rgba(0,0,0,.45)';
    const ghost = cssVar('--ghost') || 'rgba(80,80,80,.45)';
    const ink = cssVar('--paper-ink') || '#444';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, W, H);
    const P = this.proj;
    const tx = (v: Vec3): [number, number] => {
      const [x, y] = P(v);
      return [W / 2 + (x - vp.cx) * vp.scale, H / 2 - (y - vp.cy) * vp.scale];
    };
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.font = '11px ui-monospace, Menlo, Consolas, monospace';

    // siatka i osie
    const step = niceStep(60 / vp.scale);
    if (!this.iso) {
      const x0 = vp.cx - W / 2 / vp.scale, x1 = vp.cx + W / 2 / vp.scale;
      const y0 = vp.cy - H / 2 / vp.scale, y1 = vp.cy + H / 2 / vp.scale;
      const sx = (x: number) => W / 2 + (x - vp.cx) * vp.scale;
      const sy = (y: number) => H / 2 - (y - vp.cy) * vp.scale;
      ctx.lineWidth = 1;
      ctx.strokeStyle = grid;
      ctx.beginPath();
      for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) { ctx.moveTo(Math.round(sx(x)) + .5, 0); ctx.lineTo(Math.round(sx(x)) + .5, H); }
      for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) { ctx.moveTo(0, Math.round(sy(y)) + .5); ctx.lineTo(W, Math.round(sy(y)) + .5); }
      ctx.stroke();
      // osie
      ctx.strokeStyle = axis;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(0, sy(0)); ctx.lineTo(W, sy(0));
      ctx.moveTo(sx(0), 0); ctx.lineTo(sx(0), H);
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.75;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      const oy = Math.min(Math.max(sy(0) + 4, 2), H - 14);
      for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) if (Math.abs(x) > step / 2) ctx.fillText(fmt(x), sx(x), oy);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const ox = Math.min(Math.max(sx(0) + 5, 2), W - 40);
      for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) if (Math.abs(y) > step / 2) ctx.fillText(fmt(y), ox, sy(y));
      ctx.globalAlpha = 1;
      ctx.fillText('X', Math.min(W - 14, W - 14), Math.min(Math.max(sy(0) - 12, 6), H - 8));
      ctx.fillText('Y', Math.min(Math.max(sx(0) + 8, 2), W - 14), 10);
    } else {
      const ext = Math.max(step, niceStep(this.extent() / 3) * 3);
      ctx.lineWidth = 1;
      ctx.strokeStyle = grid;
      ctx.beginPath();
      for (let k = -ext; k <= ext + 1e-9; k += step) {
        let a = tx([k, -ext, 0]), b = tx([k, ext, 0]);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
        a = tx([-ext, k, 0]); b = tx([ext, k, 0]);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
      const axes: Array<[Vec3, string, string]> = [[[ext, 0, 0], 'X', '#c0392b'], [[0, ext, 0], 'Y', '#2f8f4e'], [[0, 0, ext], 'Z', '#2b6fb3']];
      ctx.lineWidth = 1.5;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      const o = tx([0, 0, 0]);
      for (const [v, name, col] of axes) {
        const e = tx(v);
        ctx.strokeStyle = col; ctx.fillStyle = col;
        ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
        ctx.fillText(name, e[0] + 5, e[1]);
      }
    }
    // początek układu
    if (!plain) {
      const o = tx([0, 0, 0]);
      ctx.fillStyle = paper;
      ctx.strokeStyle = axis;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(o[0], o[1], 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }

    // wzór
    if (this.draw.ghost && !plain) {
      ctx.strokeStyle = ghost;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([7, 6]);
      ctx.beginPath();
      for (const s of this.draw.ghost) {
        const a = tx(s.from), b = tx(s.to);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // rysunek (grupowanie po kolorze i grubości)
    let key = '';
    ctx.beginPath();
    const flush = () => { if (key) ctx.stroke(); };
    for (const s of this.draw.segments) {
      const k = s.color + s.width;
      if (k !== key) {
        flush();
        key = k;
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
      }
      const a = tx(s.from), b = tx(s.to);
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    flush();

    if (withTurtle && this.draw.showTurtle && !plain) this.paintTurtle(ctx, tx);
  }

  private extent(): number {
    let m = 100;
    for (const s of [...this.draw.segments, ...(this.draw.ghost ?? [])]) {
      for (const c of [...s.from, ...s.to]) m = Math.max(m, Math.abs(c));
    }
    return m;
  }

  private paintTurtle(ctx: CanvasRenderingContext2D, tx: (v: Vec3) => [number, number]) {
    const d = this.draw;
    const c = tx(d.pos);
    const tip = tx([d.pos[0] + d.h[0], d.pos[1] + d.h[1], d.pos[2] + d.h[2]]);
    let dx = tip[0] - c[0], dy = tip[1] - c[1];
    const l = Math.hypot(dx, dy);
    if (l < 1e-6) { dx = 0; dy = -1; } else { dx /= l; dy /= l; }
    const nx = -dy, ny = dx;
    const k = 1;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = cssVar('--turtle-edge') || '#0b3d31';
    ctx.fillStyle = d.pen ? (cssVar('--turtle') || '#16866a') : 'rgba(255,255,255,.85)';
    ctx.beginPath();
    ctx.moveTo(c[0] + dx * 15 * k, c[1] + dy * 15 * k);
    ctx.lineTo(c[0] - dx * 9 * k + nx * 9 * k, c[1] - dy * 9 * k + ny * 9 * k);
    ctx.lineTo(c[0] - dx * 4 * k, c[1] - dy * 4 * k);
    ctx.lineTo(c[0] - dx * 9 * k - nx * 9 * k, c[1] - dy * 9 * k - ny * 9 * k);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  async toBlob(): Promise<Blob | null> {
    const segs = this.draw.segments;
    const b = boundsOf(segs, this.proj) ?? [-100, -100, 100, 100];
    const pad = 0.06;
    let bw = Math.max(b[2] - b[0], 1), bh = Math.max(b[3] - b[1], 1);
    const maxDim = 1400;
    const ar = bw / bh;
    let W = ar >= 1 ? maxDim : Math.round(maxDim * ar);
    let H = ar >= 1 ? Math.round(maxDim / ar) : maxDim;
    W = Math.max(480, W); H = Math.max(360, H);
    const s = Math.min((W * (1 - 2 * pad)) / bw, (H * (1 - 2 * pad)) / bh);
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const vp = { scale: s, cx: (b[0] + b[2]) / 2, cy: (b[1] + b[3]) / 2 };
    this.paint(off.getContext('2d')!, W, H, 1, vp, false, true);
    return new Promise(res => off.toBlob(res, 'image/png'));
  }
}

function fmt(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e5 || (a < 1e-2 && a > 0)) return n.toExponential(0);
  return String(Math.round(n * 1e6) / 1e6);
}

void raf;
