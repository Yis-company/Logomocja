import type { Vec } from '../lang/interp';
import { cssVar, lerp, nextFrame, shownTurtlePos, type Scene, type View } from './scene';

type Proj = (p: Vec) => [number, number];

const TOP: Proj = (p) => [p[0], p[1]];

/** Rzut aksonometryczny dla podglądu 3D bez WebGL (ten sam kierunek co kamera 3D). */
export function isoProjection(): Proj {
  const c = norm([0.9, -1.3, 1.1]);
  const f: Vec = [-c[0], -c[1], -c[2]];
  const right = norm(cross(f, [0, 0, 1]));
  const up = cross(right, f);
  return (p) => [dot(p, right), dot(p, up)];
}

function cross(a: Vec, b: Vec): Vec {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function dot(a: Vec, b: Vec) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function norm(a: Vec): Vec {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
}

interface Palette {
  sheet: string;
  grid: string;
  gridMajor: string;
  axis: string;
  ink: string;
  now: string;
  ghost: string;
  label: string;
}

export class View2D implements View {
  readonly kind = '2d' as const;
  readonly element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scene: Scene | null = null;
  private zoom = 1;
  /** Przesunięcie początku układu względem środka płótna, w pikselach CSS. */
  private panX = 0;
  private panY = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private pal!: Palette;
  private queued = false;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinch: { d: number; zoom: number } | null = null;
  private proj: Proj;
  private active = true;

  constructor(label: string, private projection: 'top' | 'iso' = 'top') {
    this.proj = projection === 'top' ? TOP : isoProjection();
    this.element = document.createElement('div');
    this.element.className = 'view view-2d';
    this.canvas = document.createElement('canvas');
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', label);
    this.element.append(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.onThemeChange();
    new ResizeObserver(() => this.resize()).observe(this.element);
    this.bindInput();
  }

  setActive(active: boolean) {
    this.active = active;
    if (active) this.resize();
  }

  setLabel(label: string) {
    this.canvas.setAttribute('aria-label', label);
  }

  onThemeChange() {
    this.pal = {
      sheet: cssVar('--sheet'),
      grid: cssVar('--grid'),
      gridMajor: cssVar('--grid-major'),
      axis: cssVar('--axis'),
      ink: cssVar('--ink'),
      now: cssVar('--now'),
      ghost: cssVar('--ghost'),
      label: cssVar('--ink-2'),
    };
    this.queue();
  }

  setScene(scene: Scene) {
    this.scene = scene;
    this.queue();
  }

  private resize() {
    const r = this.element.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    this.dpr = window.devicePixelRatio || 1;
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    this.canvas.style.width = r.width + 'px';
    this.canvas.style.height = r.height + 'px';
    this.paint();
  }

  private queue() {
    if (this.queued) return;
    this.queued = true;
    requestAnimationFrame(() => {
      this.queued = false;
      this.paint();
    });
  }

  async flush() {
    this.resize();
    this.paint();
    await nextFrame();
    await nextFrame();
  }

  // --- widok ---------------------------------------------------------------

  private toScreen(p: Vec): [number, number] {
    const [x, y] = this.proj(p);
    return [this.w / 2 + this.panX + x * this.zoom, this.h / 2 + this.panY - y * this.zoom];
  }

  zoomBy(f: number, cx = this.w / 2, cy = this.h / 2) {
    const z = Math.min(400, Math.max(0.002, this.zoom * f));
    const k = z / this.zoom;
    // punkt pod kursorem zostaje na miejscu
    const ox = this.w / 2 + this.panX;
    const oy = this.h / 2 + this.panY;
    this.panX = cx - (cx - ox) * k - this.w / 2;
    this.panY = cy - (cy - oy) * k - this.h / 2;
    this.zoom = z;
    this.queue();
  }

  resetView() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.queue();
  }

  fit() {
    if (!this.w) this.resize();
    const pts: [number, number][] = [];
    const s = this.scene;
    if (s) {
      for (const seg of s.segments) pts.push(this.proj(seg.from), this.proj(seg.to));
      if (s.ghost) for (const seg of s.ghost) pts.push(this.proj(seg.from), this.proj(seg.to));
      pts.push(this.proj(s.turtle.pos));
    }
    pts.push([0, 0]);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [x, y] of pts) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    const bw = Math.max(maxX - minX, 40);
    const bh = Math.max(maxY - minY, 40);
    const margin = 36;
    const z = Math.min((this.w - margin * 2) / bw, (this.h - margin * 2) / bh);
    this.zoom = Math.min(Math.max(z, 0.002), 40);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    this.panX = -cx * this.zoom;
    this.panY = cy * this.zoom;
    this.queue();
  }

  private bindInput() {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), zoom: this.zoom };
      }
      c.classList.add('dragging');
    });
    c.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const cur = { x: e.clientX, y: e.clientY };
      this.pointers.set(e.pointerId, cur);
      if (this.pointers.size === 2 && this.pinch) {
        const [a, b] = [...this.pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const r = c.getBoundingClientRect();
        const target = this.pinch.zoom * (d / this.pinch.d);
        this.zoomBy(target / this.zoom, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
        return;
      }
      this.panX += cur.x - prev.x;
      this.panY += cur.y - prev.y;
      this.queue();
    });
    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
      if (this.pointers.size === 0) c.classList.remove('dragging');
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = c.getBoundingClientRect();
      const f = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015));
      this.zoomBy(f, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    c.addEventListener('keydown', (e) => {
      const step = 40;
      let handled = true;
      switch (e.key) {
        case 'ArrowLeft': this.panX += step; break;
        case 'ArrowRight': this.panX -= step; break;
        case 'ArrowUp': this.panY += step; break;
        case 'ArrowDown': this.panY -= step; break;
        case '+': case '=': this.zoomBy(1.25); break;
        case '-': case '_': this.zoomBy(0.8); break;
        case '0': this.fit(); break;
        default: handled = false;
      }
      if (handled) {
        e.preventDefault();
        this.queue();
      }
    });
  }

  // --- rysowanie -------------------------------------------------------------

  private paint() {
    if (!this.active || !this.w) return;
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.drawInto(ctx, this.w, this.h, true);
  }

  private drawInto(ctx: CanvasRenderingContext2D, w: number, h: number, withTurtle: boolean) {
    const p = this.pal;
    ctx.fillStyle = p.sheet;
    ctx.fillRect(0, 0, w, h);
    if (this.projection === 'top') this.drawGrid(ctx, w, h);
    else this.drawIsoAxes(ctx);
    const s = this.scene;
    if (!s) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (s.ghost) {
      ctx.strokeStyle = p.ghost;
      ctx.lineWidth = 7;
      ctx.beginPath();
      for (const seg of s.ghost) {
        const a = this.toScreen(seg.from), b = this.toScreen(seg.to);
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
    }
    // Odcinki tego samego koloru i grubości łączymy w jedną ścieżkę.
    let path = false;
    let key = '';
    const segs = s.segments;
    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      let to = seg.to;
      if (s.partial && s.partial.index === i) to = lerp(seg.from, seg.to, s.partial.t);
      const k = seg.color + seg.width;
      if (k !== key) {
        if (path) ctx.stroke();
        ctx.strokeStyle = seg.color;
        ctx.lineWidth = seg.width;
        ctx.beginPath();
        key = k;
        path = true;
      }
      const a = this.toScreen(seg.from), b = this.toScreen(to);
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
    }
    if (path) ctx.stroke();
    if (withTurtle) this.drawTurtle(ctx, s);
  }

  private drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const p = this.pal;
    const steps = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
    const step = steps.find((s) => s * this.zoom >= 14) ?? 100000;
    const ox = w / 2 + this.panX;
    const oy = h / 2 + this.panY;
    const x0 = Math.floor((0 - ox) / this.zoom / step) * step;
    const x1 = Math.ceil((w - ox) / this.zoom / step) * step;
    const y0 = Math.floor((oy - h) / this.zoom / step) * step;
    const y1 = Math.ceil(oy / this.zoom / step) * step;
    ctx.lineWidth = 1;
    for (const pass of [0, 1]) {
      ctx.strokeStyle = pass ? p.gridMajor : p.grid;
      ctx.beginPath();
      for (let x = x0; x <= x1; x += step) {
        const isMajor = Math.round(x / step) % 5 === 0;
        if (isMajor !== !!pass) continue;
        const sx = Math.round(ox + x * this.zoom) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
      }
      for (let y = y0; y <= y1; y += step) {
        const isMajor = Math.round(y / step) % 5 === 0;
        if (isMajor !== !!pass) continue;
        const sy = Math.round(oy - y * this.zoom) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
      }
      ctx.stroke();
    }
    // osie i początek układu
    ctx.strokeStyle = p.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(ox) + 0.5, 0);
    ctx.lineTo(Math.round(ox) + 0.5, h);
    ctx.moveTo(0, Math.round(oy) + 0.5);
    ctx.lineTo(w, Math.round(oy) + 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ox, oy, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = p.label;
    ctx.font = '600 11px Lato, system-ui, sans-serif';
    ctx.fillText('0', ox + 6, oy + 14);
    ctx.fillText('x', w - 14, oy - 6);
    ctx.fillText('y', ox + 6, 14);
    this.drawScale(ctx, h, step * 5);
  }

  /** Podziałka jak pod rysunkiem w podręczniku: odcinek o długości jednej dużej kratki. */
  private drawScale(ctx: CanvasRenderingContext2D, h: number, units: number) {
    const len = units * this.zoom;
    const x = 16, y = h - 18;
    ctx.font = '700 11px Lato, system-ui, sans-serif';
    const label = `${units.toLocaleString('pl-PL')} ${units === 1 ? 'krok' : 'kroków'}`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = this.pal.sheet;
    ctx.fillRect(x - 6, y - 12, len + tw + 20, 20);
    ctx.strokeStyle = this.pal.ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - 5); ctx.lineTo(x, y); ctx.lineTo(x + len, y); ctx.lineTo(x + len, y - 5);
    ctx.stroke();
    ctx.fillStyle = this.pal.label;
    ctx.fillText(label, x + len + 8, y + 1);
  }

  private drawIsoAxes(ctx: CanvasRenderingContext2D) {
    const axes: [Vec, string][] = [[[80, 0, 0], 'x'], [[0, 80, 0], 'y'], [[0, 0, 80], 'z']];
    const o = this.toScreen([0, 0, 0]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.pal.axis;
    ctx.fillStyle = this.pal.label;
    ctx.font = '600 11px Lato, system-ui, sans-serif';
    for (const [v, name] of axes) {
      const e = this.toScreen(v);
      ctx.beginPath();
      ctx.moveTo(o[0], o[1]);
      ctx.lineTo(e[0], e[1]);
      ctx.stroke();
      ctx.fillText(name, e[0] + 4, e[1] - 4);
    }
  }

  private drawTurtle(ctx: CanvasRenderingContext2D, s: Scene) {
    const pos = shownTurtlePos(s);
    const t = s.turtle;
    const [cx, cy] = this.toScreen(pos);
    const hp = this.proj(t.heading);
    const rp = this.proj(t.right);
    // kierunki na ekranie (oś y w dół)
    let hx = hp[0], hy = -hp[1];
    const hl = Math.hypot(hx, hy);
    if (hl < 1e-6) {
      // żółw patrzy prosto na widza (tylko w rzucie): pokaż kółko
      hx = 0; hy = -1;
    } else {
      hx /= hl; hy /= hl;
    }
    let rx = rp[0], ry = -rp[1];
    const rl = Math.hypot(rx, ry) || 1;
    rx /= rl; ry /= rl;
    const L = 13, B = 6, W = 7.5;
    ctx.beginPath();
    ctx.moveTo(cx + hx * L, cy + hy * L);
    ctx.lineTo(cx - hx * B + rx * W, cy - hy * B + ry * W);
    ctx.lineTo(cx - hx * 2, cy - hy * 2);
    ctx.lineTo(cx - hx * B - rx * W, cy - hy * B - ry * W);
    ctx.closePath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.pal.ink;
    if (t.pen) {
      ctx.fillStyle = this.pal.now;
      ctx.fill();
    }
    ctx.stroke();
  }

  async toPNG(): Promise<Blob | null> {
    const scale = 2;
    const out = document.createElement('canvas');
    out.width = Math.round(this.w * scale);
    out.height = Math.round(this.h * scale);
    const ctx = out.getContext('2d')!;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    this.drawInto(ctx, this.w, this.h, false);
    return new Promise((r) => out.toBlob((b) => r(b), 'image/png'));
  }
}
