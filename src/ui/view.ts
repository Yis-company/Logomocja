// Widoki rysunku: płaski (2D) i przestrzenny (3D, rzut perspektywiczny na zwykłym canvasie).
import type { Segment, Vec } from "../interp/machine";

export interface TurtlePose { pos: Vec; h: Vec; r: Vec; u: Vec; pen: boolean; color: string }
export interface Scene { segments: Segment[]; turtle: TurtlePose | null; ghost: Segment[] | null }

interface Palette {
  bg: string; grid: string; gridStrong: string; ink: string; ghost: string;
  axisX: string; axisY: string; axisZ: string; turtle: string; turtleFin: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export abstract class View {
  scene: Scene = { segments: [], turtle: null, ghost: null };
  /** Ustawiane, gdy użytkownik sam poruszy widokiem. */
  onUserMove: (() => void) | null = null;
  protected ctx: CanvasRenderingContext2D;
  protected w = 300;
  protected h = 300;
  protected dpr = 1;
  protected hideTurtle = false;
  private raf = 0;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinch = 0;

  constructor(public canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Brak kontekstu 2D");
    this.ctx = ctx;
    this.bind();
  }

  abstract fit(): void;
  abstract reset(): void;
  abstract zoomBy(factor: number, sx?: number, sy?: number): void;
  protected abstract drag(dx: number, dy: number, alt: boolean): void;
  protected abstract key(e: KeyboardEvent): boolean;
  protected abstract draw(pal: Palette): void;

  setScene(scene: Scene): void {
    this.scene = scene;
    this.invalidate();
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const w = Math.max(50, Math.round(rect.width));
    const h = Math.max(50, Math.round(rect.height));
    if (w === this.w && h === this.h && dpr === this.dpr && this.canvas.width === Math.round(w * dpr)) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.render();
  }

  invalidate(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => { this.raf = 0; this.render(); });
  }

  render(): void {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
    const cs = getComputedStyle(this.canvas);
    const v = (n: string, d: string) => cs.getPropertyValue(n).trim() || d;
    const pal: Palette = {
      bg: v("--canvas-bg", "#fbf8f1"), grid: v("--canvas-grid", "#e9e3d4"), gridStrong: v("--canvas-grid-strong", "#d6cdb8"),
      ink: v("--canvas-ink", "#6c6557"), ghost: v("--canvas-ghost", "#c9bfa6"),
      axisX: v("--axis-x", "#c8553d"), axisY: v("--axis-y", "#3d8f56"), axisZ: v("--axis-z", "#3f74c4"),
      turtle: v("--turtle", "#16866a"), turtleFin: v("--turtle-fin", "#c1763d"),
    };
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.globalAlpha = 1;
    c.setLineDash([]);
    c.fillStyle = pal.bg;
    c.fillRect(0, 0, this.w, this.h);
    c.lineCap = "round";
    c.lineJoin = "round";
    this.draw(pal);
  }

  /** PNG z samym rysunkiem (bez żółwia). */
  toBlob(): Promise<Blob | null> {
    this.hideTurtle = true;
    this.render();
    return new Promise((resolve) => {
      this.canvas.toBlob((b) => {
        this.hideTurtle = false;
        this.render();
        resolve(b);
      }, "image/png");
    });
  }

  protected userMoved(): void {
    this.onUserMove?.();
    this.invalidate();
  }

  private bind(): void {
    const el = this.canvas;
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.pinch = 0;
    });
    el.addEventListener("pointermove", (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
      prev.x = e.clientX; prev.y = e.clientY;
      if (this.pointers.size === 1) {
        this.drag(dx, dy, e.shiftKey || e.ctrlKey || e.metaKey || (e.buttons & 6) !== 0);
        this.userMoved();
      } else if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const rect = el.getBoundingClientRect();
        if (this.pinch > 0 && d > 0) this.zoomBy(d / this.pinch, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
        this.pinch = d;
        this.drag(dx / 2, dy / 2, true);
        this.userMoved();
      }
    });
    const up = (e: PointerEvent) => { this.pointers.delete(e.pointerId); this.pinch = 0; };
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("contextmenu", (e) => e.preventDefault());
    el.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const unit = e.deltaMode === 1 ? 30 : 1;
      this.zoomBy(Math.exp(-e.deltaY * unit * 0.0015), e.clientX - rect.left, e.clientY - rect.top);
      this.userMoved();
    }, { passive: false });
    el.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      let used = true;
      if (e.key === "+" || e.key === "=") this.zoomBy(1.25);
      else if (e.key === "-" || e.key === "_") this.zoomBy(0.8);
      else if (e.key === "0") { this.fit(); this.invalidate(); e.preventDefault(); return; }
      else used = this.key(e);
      if (used) { e.preventDefault(); this.userMoved(); }
    });
  }

  protected bounds(): { min: Vec; max: Vec } | null {
    const min: Vec = [Infinity, Infinity, Infinity], max: Vec = [-Infinity, -Infinity, -Infinity];
    const add = (p: Vec) => { for (let i = 0; i < 3; i++) { if (p[i] < min[i]) min[i] = p[i]; if (p[i] > max[i]) max[i] = p[i]; } };
    for (const s of this.scene.segments) { add(s.from); add(s.to); }
    if (this.scene.ghost) for (const s of this.scene.ghost) { add(s.from); add(s.to); }
    if (this.scene.turtle) add(this.scene.turtle.pos);
    return min[0] === Infinity ? null : { min, max };
  }
}

// ---------------------------------------------------------------- 2D

export class View2D extends View {
  private cx = 0;
  private cy = 0;
  private zoom = 1;

  reset(): void { this.cx = 0; this.cy = 0; this.zoom = 1; this.invalidate(); }

  fit(): void {
    const b = this.bounds();
    if (!b) { this.cx = 0; this.cy = 0; this.zoom = 1; this.invalidate(); return; }
    const pad = Math.min(48, this.w * 0.12, this.h * 0.12);
    const bw = b.max[0] - b.min[0], bh = b.max[1] - b.min[1];
    this.cx = (b.min[0] + b.max[0]) / 2;
    this.cy = (b.min[1] + b.max[1]) / 2;
    const z = Math.min((this.w - 2 * pad) / Math.max(bw, 1e-9), (this.h - 2 * pad) / Math.max(bh, 1e-9));
    this.zoom = clamp(z, 0.002, 4);
    this.invalidate();
  }

  zoomBy(f: number, sx = this.w / 2, sy = this.h / 2): void {
    const wx = this.cx + (sx - this.w / 2) / this.zoom, wy = this.cy - (sy - this.h / 2) / this.zoom;
    this.zoom = clamp(this.zoom * f, 0.002, 200);
    this.cx = wx - (sx - this.w / 2) / this.zoom;
    this.cy = wy + (sy - this.h / 2) / this.zoom;
    this.invalidate();
  }

  protected drag(dx: number, dy: number): void {
    this.cx -= dx / this.zoom;
    this.cy += dy / this.zoom;
  }

  protected key(e: KeyboardEvent): boolean {
    const s = 40;
    if (e.key === "ArrowLeft") this.drag(s, 0);
    else if (e.key === "ArrowRight") this.drag(-s, 0);
    else if (e.key === "ArrowUp") this.drag(0, s);
    else if (e.key === "ArrowDown") this.drag(0, -s);
    else return false;
    return true;
  }

  private sx(x: number): number { return this.w / 2 + (x - this.cx) * this.zoom; }
  private sy(y: number): number { return this.h / 2 - (y - this.cy) * this.zoom; }

  protected draw(pal: Palette): void {
    const c = this.ctx, { w, h, zoom } = this;
    // siatka
    let step = 10;
    for (const m of [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]) { step = m * 10; if (step * zoom >= 22) break; }
    const x0 = this.cx - w / 2 / zoom, x1 = this.cx + w / 2 / zoom;
    const y0 = this.cy - h / 2 / zoom, y1 = this.cy + h / 2 / zoom;
    for (const strong of [false, true]) {
      c.beginPath();
      for (let i = Math.ceil(x0 / step); i * step <= x1; i++) {
        if ((i % 5 === 0) !== strong) continue;
        const x = Math.round(this.sx(i * step)) + 0.5; c.moveTo(x, 0); c.lineTo(x, h);
      }
      for (let i = Math.ceil(y0 / step); i * step <= y1; i++) {
        if ((i % 5 === 0) !== strong) continue;
        const y = Math.round(this.sy(i * step)) + 0.5; c.moveTo(0, y); c.lineTo(w, y);
      }
      c.strokeStyle = strong ? pal.gridStrong : pal.grid;
      c.lineWidth = 1;
      c.stroke();
    }
    // osie i początek układu
    const ox = this.sx(0), oy = this.sy(0);
    c.lineWidth = 1.25;
    c.globalAlpha = 0.75;
    c.strokeStyle = pal.axisX; c.beginPath(); c.moveTo(0, Math.round(oy) + 0.5); c.lineTo(w, Math.round(oy) + 0.5); c.stroke();
    c.strokeStyle = pal.axisY; c.beginPath(); c.moveTo(Math.round(ox) + 0.5, 0); c.lineTo(Math.round(ox) + 0.5, h); c.stroke();
    c.globalAlpha = 1;
    c.fillStyle = pal.bg; c.strokeStyle = pal.ink; c.lineWidth = 1.5;
    c.beginPath(); c.arc(ox, oy, 4.5, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = pal.ink;
    c.font = "11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    c.textBaseline = "top";
    c.fillText("0,0", ox + 7, oy + 6);
    if (ox < w - 30) { c.fillStyle = pal.axisX; c.textAlign = "right"; c.fillText("x", w - 6, clamp(oy + 6, 4, h - 16)); }
    if (oy > 20) { c.fillStyle = pal.axisY; c.textAlign = "left"; c.fillText("y", clamp(ox + 7, 4, w - 14), 5); }
    c.textAlign = "left";

    const k = clamp(Math.sqrt(zoom), 0.6, 2.2);
    if (this.scene.ghost) {
      c.strokeStyle = pal.ghost;
      c.lineWidth = Math.max(3, 7 * k);
      c.beginPath();
      for (const s of this.scene.ghost) { c.moveTo(this.sx(s.from[0]), this.sy(s.from[1])); c.lineTo(this.sx(s.to[0]), this.sy(s.to[1])); }
      c.stroke();
    }
    // odcinki, łączone w ścieżki o wspólnym stylu
    const segs = this.scene.segments;
    let open = false, color = "", width = 0, lx = NaN, ly = NaN;
    for (const s of segs) {
      if (!open || s.color !== color || s.width !== width) {
        if (open) c.stroke();
        c.beginPath(); open = true; color = s.color; width = s.width;
        c.strokeStyle = color; c.lineWidth = Math.max(0.75, width * k);
        lx = NaN;
      }
      if (s.from[0] !== lx || s.from[1] !== ly) c.moveTo(this.sx(s.from[0]), this.sy(s.from[1]));
      c.lineTo(this.sx(s.to[0]), this.sy(s.to[1]));
      lx = s.to[0]; ly = s.to[1];
    }
    if (open) c.stroke();

    const t = this.scene.turtle;
    if (t && !this.hideTurtle) {
      const px = this.sx(t.pos[0]), py = this.sy(t.pos[1]);
      const len = Math.hypot(t.h[0], t.h[1]);
      c.lineWidth = 2;
      c.strokeStyle = pal.turtle;
      c.fillStyle = t.pen ? pal.turtle : pal.bg;
      if (len < 0.05) {
        c.beginPath(); c.arc(px, py, 7, 0, Math.PI * 2); c.fill(); c.stroke();
      } else {
        const hx = t.h[0] / len, hy = -t.h[1] / len;
        const S = 15;
        c.beginPath();
        c.moveTo(px + hx * S, py + hy * S);
        c.lineTo(px - hx * S * 0.55 - hy * S * 0.62, py - hy * S * 0.55 + hx * S * 0.62);
        c.lineTo(px - hx * S * 0.2, py - hy * S * 0.2);
        c.lineTo(px - hx * S * 0.55 + hy * S * 0.62, py - hy * S * 0.55 - hx * S * 0.62);
        c.closePath();
        c.globalAlpha = 0.92; c.fill(); c.globalAlpha = 1; c.stroke();
      }
    }
  }
}

// ---------------------------------------------------------------- 3D

const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: Vec): Vec => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const mad = (a: Vec, b: Vec, k: number): Vec => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

const AZ0 = 0.62, EL0 = 0.42, DIST0 = 620;
const FOV = (40 * Math.PI) / 180;

export class View3D extends View {
  private target: Vec = [0, 0, 0];
  private az = AZ0;
  private el = EL0;
  private dist = DIST0;
  // kamera wyliczana przy każdym rysowaniu
  private C: Vec = [0, 0, 0];
  private R: Vec = [1, 0, 0];
  private U: Vec = [0, 0, 1];
  private F: Vec = [0, 1, 0];
  private focal = 500;

  reset(): void { this.target = [0, 0, 0]; this.az = AZ0; this.el = EL0; this.dist = DIST0; this.invalidate(); }

  fit(): void {
    const b = this.bounds();
    if (!b) { this.target = [0, 0, 0]; this.dist = DIST0; this.invalidate(); return; }
    this.target = [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2];
    const rad = Math.max(10, Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]) / 2);
    const aspect = Math.min(1, this.w / this.h);
    const half = Math.atan(Math.tan(FOV / 2) * aspect);
    this.dist = clamp((rad / Math.sin(half)) * 1.12, 20, 2e6);
    this.invalidate();
  }

  zoomBy(f: number): void {
    this.dist = clamp(this.dist / f, 5, 2e6);
    this.invalidate();
  }

  protected drag(dx: number, dy: number, alt: boolean): void {
    if (alt) {
      this.camera();
      const k = this.dist / this.focal;
      this.target = mad(mad(this.target, this.R, -dx * k), this.U, dy * k);
    } else {
      this.az -= dx * 0.008;
      this.el = clamp(this.el + dy * 0.008, -1.5, 1.5);
    }
  }

  protected key(e: KeyboardEvent): boolean {
    const s = 12;
    if (e.key === "ArrowLeft") this.drag(s, 0, e.shiftKey);
    else if (e.key === "ArrowRight") this.drag(-s, 0, e.shiftKey);
    else if (e.key === "ArrowUp") this.drag(0, s, e.shiftKey);
    else if (e.key === "ArrowDown") this.drag(0, -s, e.shiftKey);
    else return false;
    return true;
  }

  private camera(): void {
    const ce = Math.cos(this.el), se = Math.sin(this.el);
    const off: Vec = [Math.sin(this.az) * ce, -Math.cos(this.az) * ce, se];
    this.C = mad(this.target, off, this.dist);
    this.F = unit(sub(this.target, this.C));
    this.R = unit(cross(this.F, [0, 0, 1]));
    this.U = cross(this.R, this.F);
    this.focal = this.h / 2 / Math.tan(FOV / 2);
  }

  /** Punkt świata -> [x, y, głębia] w układzie kamery. */
  private cam(p: Vec): Vec {
    const d = sub(p, this.C);
    return [dot(d, this.R), dot(d, this.U), dot(d, this.F)];
  }

  /** Rzutuje odcinek z przycięciem do bliskiej płaszczyzny. */
  private proj(a: Vec, b: Vec): [number, number, number, number, number] | null {
    let p = this.cam(a), q = this.cam(b);
    const near = Math.max(0.5, this.dist * 0.02);
    if (p[2] < near && q[2] < near) return null;
    if (p[2] < near) { const t = (near - p[2]) / (q[2] - p[2]); p = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, near]; }
    else if (q[2] < near) { const t = (near - q[2]) / (p[2] - q[2]); q = [q[0] + (p[0] - q[0]) * t, q[1] + (p[1] - q[1]) * t, near]; }
    const f = this.focal, w2 = this.w / 2, h2 = this.h / 2;
    return [w2 + (p[0] * f) / p[2], h2 - (p[1] * f) / p[2], w2 + (q[0] * f) / q[2], h2 - (q[1] * f) / q[2], (p[2] + q[2]) / 2];
  }

  private line(a: Vec, b: Vec): void {
    const s = this.proj(a, b);
    if (!s) return;
    this.ctx.moveTo(s[0], s[1]);
    this.ctx.lineTo(s[2], s[3]);
  }

  protected draw(pal: Palette): void {
    this.camera();
    const c = this.ctx;
    const b = this.bounds();
    let reach = 200;
    if (b) for (let i = 0; i < 3; i++) reach = Math.max(reach, Math.abs(b.min[i]), Math.abs(b.max[i]));
    const mag = Math.pow(10, Math.floor(Math.log10(reach)));
    const ext = Math.ceil((reach * 1.15) / mag) * mag;
    const step = ext / 10;
    // siatka podłoża (płaszczyzna z = 0)
    for (const strong of [false, true]) {
      c.beginPath();
      for (let i = -10; i <= 10; i++) {
        if ((i % 5 === 0) !== strong || i === 0) continue;
        this.line([i * step, -ext, 0], [i * step, ext, 0]);
        this.line([-ext, i * step, 0], [ext, i * step, 0]);
      }
      c.strokeStyle = strong ? pal.gridStrong : pal.grid;
      c.lineWidth = 1;
      c.stroke();
    }
    // osie
    const axes: [Vec, string, string][] = [[[1, 0, 0], pal.axisX, "x"], [[0, 1, 0], pal.axisY, "y"], [[0, 0, 1], pal.axisZ, "z"]];
    c.font = "bold 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    c.textBaseline = "middle"; c.textAlign = "center";
    for (const [d, col, name] of axes) {
      c.strokeStyle = col;
      c.globalAlpha = 0.35; c.lineWidth = 1;
      if (name !== "z") { c.beginPath(); this.line([0, 0, 0], mad([0, 0, 0], d, -ext)); c.stroke(); }
      c.globalAlpha = 0.9; c.lineWidth = 1.75;
      const tip = mad([0, 0, 0], d, name === "z" ? ext * 0.6 : ext);
      c.beginPath(); this.line([0, 0, 0], tip); c.stroke();
      const t = this.cam(mad(tip, d, ext * 0.05));
      if (t[2] > 1) { c.fillStyle = col; c.globalAlpha = 1; c.fillText(name, this.w / 2 + (t[0] * this.focal) / t[2], this.h / 2 - (t[1] * this.focal) / t[2]); }
    }
    c.globalAlpha = 1;
    const o = this.cam([0, 0, 0]);
    if (o[2] > 1) {
      c.fillStyle = pal.bg; c.strokeStyle = pal.ink; c.lineWidth = 1.5;
      c.beginPath(); c.arc(this.w / 2 + (o[0] * this.focal) / o[2], this.h / 2 - (o[1] * this.focal) / o[2], 4, 0, Math.PI * 2); c.fill(); c.stroke();
    }

    if (this.scene.ghost) {
      c.strokeStyle = pal.ghost; c.lineWidth = 6;
      c.beginPath();
      for (const s of this.scene.ghost) this.line(s.from, s.to);
      c.stroke();
    }

    // odcinki posortowane od najdalszych
    const segs = this.scene.segments;
    const n = segs.length;
    const pr: ([number, number, number, number, number] | null)[] = new Array(n);
    const order: number[] = [];
    let zmin = Infinity, zmax = -Infinity;
    for (let i = 0; i < n; i++) {
      const p = (pr[i] = this.proj(segs[i].from, segs[i].to));
      if (p) { order.push(i); if (p[4] < zmin) zmin = p[4]; if (p[4] > zmax) zmax = p[4]; }
    }
    order.sort((x, y) => pr[y]![4] - pr[x]![4]);
    const zr = Math.max(1e-6, zmax - zmin);
    for (const i of order) {
      const p = pr[i]!, s = segs[i];
      c.globalAlpha = 1 - 0.5 * ((p[4] - zmin) / zr);
      c.strokeStyle = s.color;
      c.lineWidth = clamp((s.width * this.dist) / p[4], 0.6, s.width * 4);
      c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[2], p[3]); c.stroke();
    }
    c.globalAlpha = 1;

    const t = this.scene.turtle;
    if (t && !this.hideTurtle) {
      const pc = this.cam(t.pos);
      if (pc[2] > 1) {
        const S = (17 * pc[2]) / this.focal;
        const nose = mad(t.pos, t.h, S);
        const tail = mad(t.pos, t.h, -S * 0.55);
        const left = mad(tail, t.r, -S * 0.62), right = mad(tail, t.r, S * 0.62);
        const top = mad(tail, t.u, S * 0.7);
        const P = (v: Vec): [number, number, number] => { const q = this.cam(v); const z = Math.max(q[2], 0.5); return [this.w / 2 + (q[0] * this.focal) / z, this.h / 2 - (q[1] * this.focal) / z, q[2]]; };
        const tri = (pts: Vec[], fill: string, stroke: string) => {
          const s = pts.map(P);
          c.beginPath(); c.moveTo(s[0][0], s[0][1]); c.lineTo(s[1][0], s[1][1]); c.lineTo(s[2][0], s[2][1]); c.closePath();
          c.fillStyle = fill; c.strokeStyle = stroke; c.lineWidth = 1.75; c.globalAlpha = 0.9; c.fill(); c.globalAlpha = 1; c.stroke();
        };
        const body = () => tri([nose, left, right], t.pen ? pal.turtle : pal.bg, pal.turtle);
        const fin = () => tri([nose, tail, top], pal.turtleFin, pal.turtleFin);
        // płetwa (kierunek „góra” żółwia) rysowana przed lub za korpusem zależnie od strony
        if (this.cam(top)[2] > this.cam(t.pos)[2]) { fin(); body(); } else { body(); fin(); }
      }
    }
  }
}
