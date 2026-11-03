import type { Segment } from '../lang/types';
import type { TurtleState } from '../lang/interpreter';
import { boundsOf, cssVar, type DrawingSurface, type Overlay } from './surface';

interface Palette {
  plate: string;
  minor: string;
  major: string;
  axis: string;
  label: string;
  marker: string;
  markerInk: string;
  ghost: string;
  missing: string;
  extra: string;
}

function readPalette(): Palette {
  return {
    plate: cssVar('--plate'),
    minor: cssVar('--plate-minor'),
    major: cssVar('--plate-major'),
    axis: cssVar('--plate-axis'),
    label: cssVar('--plate-label'),
    marker: cssVar('--yellow'),
    markerInk: cssVar('--marker-ink'),
    ghost: cssVar('--plate-ghost'),
    missing: cssVar('--red'),
    extra: cssVar('--amber'),
  };
}

/** Chooses a "nice" grid step (1, 2 or 5 × 10^k) at least `min` units wide. */
function niceStep(min: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(min)));
  for (const m of [1, 2, 5, 10]) if (m * p >= min) return m * p;
  return 10 * p;
}

function fmtTick(v: number): string {
  const r = Math.round(v * 1000) / 1000;
  return String(r === 0 ? 0 : r).replace('-', '−');
}

export function drawSegments(
  ctx: CanvasRenderingContext2D,
  list: Segment[],
  toScreen: (x: number, y: number) => [number, number],
  pxScale: number,
): void {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  let i = 0;
  while (i < list.length) {
    const first = list[i]!;
    ctx.beginPath();
    ctx.strokeStyle = first.color;
    ctx.lineWidth = first.width * pxScale;
    let lastX = NaN;
    let lastY = NaN;
    while (i < list.length && list[i]!.color === first.color && list[i]!.width === first.width) {
      const s = list[i]!;
      const [ax, ay] = toScreen(s.from[0], s.from[1]);
      const [bx, by] = toScreen(s.to[0], s.to[1]);
      // NaN-safe: the first segment of a batch always starts a new subpath
      if (!(Math.abs(ax - lastX) <= 0.01 && Math.abs(ay - lastY) <= 0.01)) ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      lastX = bx;
      lastY = by;
      i++;
    }
    ctx.stroke();
  }
}

export class View2D implements DrawingSurface {
  readonly kind = '2d' as const;
  readonly element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private segments: Segment[] = [];
  private partial: { seg: Segment; t: number } | null = null;
  private turtle: TurtleState | null = null;
  private overlay: Overlay | null = null;
  private scale = 1.6;
  private cx = 0;
  private cy = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private pal: Palette;
  private raf = 0;
  private anim = 0;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinch: { dist: number; scale: number } | null = null;
  private ro: ResizeObserver;
  userMoved = false;
  private showGrid: boolean;

  constructor(host: HTMLElement, opts: { grid?: boolean } = {}) {
    this.showGrid = opts.grid ?? true;
    this.element = host;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'plate-canvas';
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-roledescription', 'płaszczyzna rysunku');
    host.append(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.pal = readPalette();
    this.bind();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.updateLabel();
  }

  private bind(): void {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinch = { dist: Math.hypot(a!.x - b!.x, a!.y - b!.y), scale: this.scale };
      }
      c.classList.add('is-dragging');
    });
    c.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const cur = { x: e.clientX, y: e.clientY };
      this.pointers.set(e.pointerId, cur);
      if (this.pointers.size === 2 && this.pinch) {
        const [a, b] = [...this.pointers.values()];
        const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
        const rect = c.getBoundingClientRect();
        const mx = (a!.x + b!.x) / 2 - rect.left;
        const my = (a!.y + b!.y) / 2 - rect.top;
        this.zoomAt((this.pinch.scale * d) / this.pinch.dist / this.scale, mx, my);
        this.panBy((cur.x - prev.x) / 2, (cur.y - prev.y) / 2);
      } else if (this.pointers.size === 1) {
        this.panBy(cur.x - prev.x, cur.y - prev.y);
      }
    });
    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
      if (this.pointers.size === 0) c.classList.remove('is-dragging');
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const rect = c.getBoundingClientRect();
        const k = e.deltaMode === 1 ? 16 : 1;
        this.zoomAt(Math.exp((-e.deltaY * k) / (e.ctrlKey ? 120 : 480)), e.clientX - rect.left, e.clientY - rect.top);
      },
      { passive: false },
    );
    c.addEventListener('dblclick', () => this.fit(true));
    c.addEventListener('keydown', (e) => {
      const step = 48;
      let handled = true;
      switch (e.key) {
        case 'ArrowLeft':
          this.panBy(step, 0);
          break;
        case 'ArrowRight':
          this.panBy(-step, 0);
          break;
        case 'ArrowUp':
          this.panBy(0, step);
          break;
        case 'ArrowDown':
          this.panBy(0, -step);
          break;
        case '+':
        case '=':
          this.zoomBy(1.25);
          break;
        case '-':
        case '_':
          this.zoomBy(0.8);
          break;
        case '0':
          this.fit(true);
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    });
  }

  private panBy(dx: number, dy: number): void {
    this.cx -= dx / this.scale;
    this.cy += dy / this.scale;
    this.userMoved = true;
    this.request();
  }

  private zoomAt(factor: number, sx: number, sy: number): void {
    const next = Math.min(Math.max(this.scale * factor, 0.0005), 400);
    const [wx, wy] = this.toWorld(sx, sy);
    this.scale = next;
    // keep the world point under the cursor fixed
    this.cx = wx - (sx - this.w / 2) / this.scale;
    this.cy = wy + (sy - this.h / 2) / this.scale;
    this.userMoved = true;
    this.request();
  }

  zoomBy(factor: number): void {
    this.zoomAt(factor, this.w / 2, this.h / 2);
  }

  private toWorld(sx: number, sy: number): [number, number] {
    return [(sx - this.w / 2) / this.scale + this.cx, this.cy - (sy - this.h / 2) / this.scale];
  }

  private toScreen = (x: number, y: number): [number, number] => {
    return [(x - this.cx) * this.scale + this.w / 2, this.h / 2 - (y - this.cy) * this.scale];
  };

  setSegments(list: Segment[]): void {
    this.segments = list.slice();
    this.updateLabel();
    this.request();
  }

  addSegment(seg: Segment): void {
    this.segments.push(seg);
    this.request();
  }

  setPartial(p: { seg: Segment; t: number } | null): void {
    this.partial = p;
    this.request();
  }

  setTurtle(t: TurtleState | null): void {
    this.turtle = t;
    this.request();
  }

  setOverlay(o: Overlay | null): void {
    this.overlay = o;
    this.request();
  }

  private updateLabel(): void {
    const n = this.segments.length;
    this.canvas.setAttribute(
      'aria-label',
      n === 0
        ? 'Rysunek w trybie 2D: pusty. Strzałki przesuwają widok, plus i minus przybliżają, zero dopasowuje.'
        : `Rysunek w trybie 2D: ${n} ${n === 1 ? 'odcinek' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'odcinki' : 'odcinków'}. Strzałki przesuwają widok, plus i minus przybliżają, zero dopasowuje.`,
    );
  }

  fit(animate = false): void {
    const lists = [this.segments];
    if (this.overlay) lists.push(this.overlay.ghost);
    const extra: [number, number, number][] = [[0, 0, 0]];
    if (this.turtle) extra.push(this.turtle.pos);
    const b = boundsOf(lists, extra)!;
    const spanX = Math.max(b.maxX - b.minX, 1);
    const spanY = Math.max(b.maxY - b.minY, 1);
    const pad = Math.min(48, Math.max(12, Math.min(this.w, this.h) * 0.07));
    let s = Math.min((this.w - pad * 2) / spanX, (this.h - pad * 2) / spanY);
    if (this.segments.length === 0 && !(this.overlay && this.overlay.ghost.length)) s = Math.min(this.w, this.h) / 320;
    s = Math.min(Math.max(s, 0.0005), 40);
    const tx = (b.minX + b.maxX) / 2;
    const ty = (b.minY + b.maxY) / 2;
    this.userMoved = false;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    cancelAnimationFrame(this.anim);
    if (!animate || reduce) {
      this.scale = s;
      this.cx = tx;
      this.cy = ty;
      this.request();
      return;
    }
    const from = { s: this.scale, x: this.cx, y: this.cy };
    const t0 = performance.now();
    const dur = 220;
    cancelAnimationFrame(this.anim);
    const step = (now: number) => {
      const k = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - k, 3);
      this.scale = Math.exp(Math.log(from.s) + (Math.log(s) - Math.log(from.s)) * e);
      this.cx = from.x + (tx - from.x) * e;
      this.cy = from.y + (ty - from.y) * e;
      this.renderNow();
      if (k < 1) this.anim = requestAnimationFrame(step);
    };
    this.anim = requestAnimationFrame(step);
  }

  contentVisible(): boolean {
    const b = boundsOf([this.segments]);
    if (!b) return true;
    const [x0, y0] = this.toScreen(b.minX, b.maxY);
    const [x1, y1] = this.toScreen(b.maxX, b.minY);
    return x0 >= 0 && y0 >= 0 && x1 <= this.w && y1 <= this.h;
  }

  resetView(): void {
    this.fit(true);
  }

  refreshTheme(): void {
    this.pal = readPalette();
    this.request();
  }

  resize(): void {
    const rect = this.element.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    const wasHidden = this.w <= 1 || this.h <= 1;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    // a plate that was hidden (narrow-screen panes) has never been framed at its real size
    if (wasHidden && w > 1 && h > 1 && !this.userMoved) this.fit(false);
    else this.renderNow();
  }

  private request(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.renderNow();
    });
  }

  renderNow(): void {
    const { ctx, dpr, w, h, pal } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = pal.plate;
    ctx.fillRect(0, 0, w, h);
    if (this.showGrid) this.drawGrid();
    const o = this.overlay;
    if (o && o.ghost.length) {
      ctx.save();
      ctx.globalAlpha = 1;
      drawSegments(ctx, o.ghost.map((s) => ({ ...s, color: pal.ghost, width: s.width + 9 })), this.toScreen, 1);
      ctx.restore();
    }
    drawSegments(ctx, this.segments, this.toScreen, 1);
    if (this.partial) {
      const { seg, t } = this.partial;
      const to: [number, number, number] = [
        seg.from[0] + (seg.to[0] - seg.from[0]) * t,
        seg.from[1] + (seg.to[1] - seg.from[1]) * t,
        seg.from[2] + (seg.to[2] - seg.from[2]) * t,
      ];
      drawSegments(ctx, [{ ...seg, to }], this.toScreen, 1);
    }
    if (o) {
      if (o.extra.length) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        drawSegments(ctx, o.extra.map((s) => ({ ...s, color: pal.extra, width: Math.max(s.width, 2) + 4 })), this.toScreen, 1);
        ctx.restore();
      }
      if (o.missing.length) {
        ctx.save();
        ctx.setLineDash([7, 6]);
        drawSegments(ctx, o.missing.map((s) => ({ ...s, color: pal.missing, width: 3 })), this.toScreen, 1);
        ctx.restore();
      }
    }
    this.drawTurtle();
  }

  private drawGrid(): void {
    const { ctx, w, h, pal, scale } = this;
    const minor = niceStep(14 / scale);
    const major = niceStep(minor * 4.5);
    const [x0, y1] = this.toWorld(0, 0);
    const [x1, y0] = this.toWorld(w, h);
    const lines = (step: number, color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) {
        const sx = Math.round(this.toScreen(x, 0)[0]) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
      }
      for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) {
        const sy = Math.round(this.toScreen(0, y)[1]) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
      }
      ctx.stroke();
    };
    if (minor * scale >= 10) lines(minor, pal.minor);
    lines(major, pal.major);
    // axes
    const [ox, oy] = this.toScreen(0, 0);
    ctx.beginPath();
    ctx.strokeStyle = pal.axis;
    ctx.lineWidth = 1;
    const ax = Math.round(ox) + 0.5;
    const ay = Math.round(oy) + 0.5;
    if (ax >= 0 && ax <= w) {
      ctx.moveTo(ax, 0);
      ctx.lineTo(ax, h);
    }
    if (ay >= 0 && ay <= h) {
      ctx.moveTo(0, ay);
      ctx.lineTo(w, ay);
    }
    ctx.stroke();
    // tick labels along the axes (clamped to the edges when the axis is off-screen)
    ctx.fillStyle = pal.label;
    ctx.font = '500 10.5px "Archivo Variable", system-ui, sans-serif';
    ctx.textBaseline = 'top';
    const ly = Math.min(Math.max(ay + 4, 4), h - 16);
    const lx = Math.min(Math.max(ax + 4, 4), w - 40);
    ctx.textAlign = 'left';
    for (let x = Math.ceil(x0 / major) * major; x <= x1; x += major) {
      if (Math.abs(x) < major / 2) continue;
      const sx = this.toScreen(x, 0)[0];
      ctx.fillText(fmtTick(x), sx + 3, ly);
    }
    for (let y = Math.ceil(y0 / major) * major; y <= y1; y += major) {
      if (Math.abs(y) < major / 2) continue;
      const sy = this.toScreen(0, y)[1];
      ctx.fillText(fmtTick(y), lx, sy + 3);
    }
    // origin ring and axis names
    if (ox > -20 && ox < w + 20 && oy > -20 && oy < h + 20) {
      ctx.beginPath();
      ctx.strokeStyle = pal.axis;
      ctx.lineWidth = 1.5;
      ctx.arc(ox, oy, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillText('0', ox + 6, oy + 5);
    }
    ctx.font = '600 12px "Archivo Variable", system-ui, sans-serif';
    ctx.fillStyle = pal.axis;
    if (ay >= 0 && ay <= h) {
      ctx.textAlign = 'right';
      ctx.fillText('x', w - 8, ay - 16);
    }
    if (ax >= 0 && ax <= w) {
      ctx.textAlign = 'left';
      ctx.fillText('y', ax + 7, 8);
    }
    ctx.textAlign = 'left';
  }

  private drawTurtle(): void {
    const t = this.turtle;
    if (!t) return;
    const { ctx, pal } = this;
    const [px, py] = this.toScreen(t.pos[0], t.pos[1]);
    let hx = t.heading[0];
    let hy = -t.heading[1];
    const len = Math.hypot(hx, hy);
    if (len < 1e-6) {
      // heading straight up or down in space: show a ring instead of an arrow
      hx = 0;
      hy = -1;
    } else {
      hx /= len;
      hy /= len;
    }
    const nx = -hy;
    const ny = hx;
    const tip = 13;
    const back = 7;
    const half = 7.5;
    ctx.beginPath();
    ctx.moveTo(px + hx * tip, py + hy * tip);
    ctx.lineTo(px - hx * back + nx * half, py - hy * back + ny * half);
    ctx.lineTo(px - hx * (back - 3), py - hy * (back - 3));
    ctx.lineTo(px - hx * back - nx * half, py - hy * back - ny * half);
    ctx.closePath();
    ctx.fillStyle = pal.marker;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = pal.markerInk;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    if (t.penDown) {
      ctx.fillStyle = t.color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = pal.markerInk;
      ctx.stroke();
    } else {
      ctx.fillStyle = pal.plate;
      ctx.fill();
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = pal.markerInk;
      ctx.stroke();
    }
  }

  async exportPNG(): Promise<Blob | null> {
    return exportSegmentsPNG(this.segments);
  }

  destroy(): void {
    this.ro.disconnect();
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.anim);
    this.canvas.remove();
  }
}

/** Renders a flat drawing onto white paper, fitted with a margin. */
export function exportSegmentsPNG(segments: Segment[]): Promise<Blob | null> {
  const b = boundsOf([segments]);
  if (!b) return Promise.resolve(null);
  const spanX = Math.max(b.maxX - b.minX, 1);
  const spanY = Math.max(b.maxY - b.minY, 1);
  const target = 1600;
  const margin = 64;
  const s = Math.min((target - margin * 2) / spanX, (target - margin * 2) / spanY, 12);
  const w = Math.ceil(spanX * s + margin * 2);
  const hgt = Math.ceil(spanY * s + margin * 2);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = hgt;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, hgt);
  drawSegments(ctx, segments, (x, y) => [margin + (x - b.minX) * s, margin + (b.maxY - y) * s], 2);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
}
