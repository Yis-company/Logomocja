import type { Segment, Turtle } from '../lang';
import { drawTurtle2D, themeColors, type ThemeColors } from './paint';

export interface DrawingState {
  segments: Segment[];
  turtle: Turtle | null;
  /** Wzorzec wyzwania rysowany pod spodem, półprzezroczyście. */
  ghost?: Segment[] | null;
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function bounds2D(segments: Segment[], turtle?: Turtle | null): Bounds | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const add = (x: number, y: number) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };
  for (const s of segments) {
    add(s.from[0], s.from[1]);
    add(s.to[0], s.to[1]);
  }
  if (turtle) add(turtle.pos[0], turtle.pos[1]);
  return minX === Infinity ? null : { minX, minY, maxX, maxY };
}

const MIN_SCALE = 0.002;
const MAX_SCALE = 60;

/** Płaski widok rysunku na płótnie 2D: przesuwanie, powiększanie, dopasowanie. */
export class View2D {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private state: DrawingState = { segments: [], turtle: null };
  private scale = 1.4;
  private cx = 0; // środek widoku w jednostkach świata
  private cy = 0;
  private width = 300;
  private height = 300;
  private dpr = 1;
  private dirty = true;
  /** Dopóki użytkownik sam nie przesunie widoku, rysunek mieści się w kadrze. */
  autoFit = true;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinch: { dist: number; scale: number } | null = null;
  private colors: ThemeColors = themeColors();
  onUserMove: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(canvas);
    this.resize();
    this.bindInput();
    const loop = () => {
      if (this.dirty) this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  refreshTheme(): void {
    this.colors = themeColors();
    this.dirty = true;
  }

  setState(state: DrawingState): void {
    this.state = state;
    // w trakcie rysowania tylko oddalamy, żeby widok nie skakał
    if (this.autoFit && !this.contentVisible()) this.fit(true, true);
    this.dirty = true;
  }

  invalidate(): void {
    this.dirty = true;
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    if (this.autoFit) this.fit(false);
    this.dirty = true;
  }

  /** Widok startowy: początek układu w środku. */
  resetView(): void {
    this.autoFit = true;
    this.cx = 0;
    this.cy = 0;
    this.scale = Math.min(this.width, this.height) / 340;
    this.dirty = true;
  }

  fit(markAuto = true, onlyOut = false): void {
    if (markAuto) this.autoFit = true;
    const prevScale = this.scale;
    const b = bounds2D(this.state.segments, this.state.turtle);
    const g = this.state.ghost ? bounds2D(this.state.ghost) : null;
    if (!b && !g) {
      this.resetView();
      return;
    }
    // początek układu zawsze w kadrze
    const all = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    for (const x of [b, g]) {
      if (!x) continue;
      all.minX = Math.min(all.minX, x.minX);
      all.minY = Math.min(all.minY, x.minY);
      all.maxX = Math.max(all.maxX, x.maxX);
      all.maxY = Math.max(all.maxY, x.maxY);
    }
    if (!this.state.segments.length && !g) {
      this.resetView();
      return;
    }
    const w = Math.max(all.maxX - all.minX, 20);
    const hgt = Math.max(all.maxY - all.minY, 20);
    // marginesy: z prawej panel narzędzi, na dole podpis
    const m = { l: 36, r: 76, t: 36, b: 48 };
    if (this.width < 360) Object.assign(m, { l: 16, r: 60, t: 16, b: 36 });
    const sx = (this.width - m.l - m.r) / w;
    const sy = (this.height - m.t - m.b) / hgt;
    this.scale = Math.min(Math.max(Math.min(sx, sy), MIN_SCALE), 6);
    if (onlyOut) this.scale = Math.min(this.scale, prevScale);
    this.cx = (all.minX + all.maxX) / 2 + (m.r - m.l) / 2 / this.scale;
    this.cy = (all.minY + all.maxY) / 2 - (m.b - m.t) / 2 / this.scale;
    this.dirty = true;
  }

  zoomBy(factor: number, sx = this.width / 2, sy = this.height / 2): void {
    const [wx, wy] = this.toWorld(sx, sy);
    this.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, this.scale * factor));
    // punkt pod kursorem zostaje na miejscu
    this.cx = wx - (sx - this.width / 2) / this.scale;
    this.cy = wy + (sy - this.height / 2) / this.scale;
    this.userMoved();
  }

  panBy(dx: number, dy: number): void {
    this.cx -= dx / this.scale;
    this.cy += dy / this.scale;
    this.userMoved();
  }

  private userMoved(): void {
    this.autoFit = false;
    this.dirty = true;
    this.onUserMove?.();
  }

  private toScreen(x: number, y: number): [number, number] {
    return [this.width / 2 + (x - this.cx) * this.scale, this.height / 2 - (y - this.cy) * this.scale];
  }

  private toWorld(sx: number, sy: number): [number, number] {
    return [this.cx + (sx - this.width / 2) / this.scale, this.cy - (sy - this.height / 2) / this.scale];
  }

  private contentVisible(): boolean {
    const b = bounds2D(this.state.segments, this.state.turtle);
    if (!b) return true;
    const [x0, y0] = this.toScreen(b.minX, b.maxY);
    const [x1, y1] = this.toScreen(b.maxX, b.minY);
    const m = 8;
    return x0 >= m && y0 >= m && x1 <= this.width - m && y1 <= this.height - m;
  }

  private bindInput(): void {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: this.scale };
      }
    });
    c.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const cur = { x: e.offsetX, y: e.offsetY };
      if (this.pointers.size === 1) {
        this.panBy(cur.x - prev.x, cur.y - prev.y);
      } else if (this.pointers.size === 2 && this.pinch) {
        this.pointers.set(e.pointerId, cur);
        const [a, b] = [...this.pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const target = (this.pinch.scale * dist) / Math.max(1, this.pinch.dist);
        this.zoomBy(target / this.scale, mid.x, mid.y);
        // przesunięcie środka szczypnięcia
        this.panBy((cur.x - prev.x) / 2, (cur.y - prev.y) / 2);
      }
      this.pointers.set(e.pointerId, cur);
    });
    const end = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const f = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015));
        this.zoomBy(f, e.offsetX, e.offsetY);
      },
      { passive: false },
    );
    c.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 120 : 40;
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
          this.fit();
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    });
  }

  private gridStep(): number {
    const target = 28 / this.scale; // co najmniej ~28 px między liniami
    const pow = Math.pow(10, Math.floor(Math.log10(target)));
    for (const m of [1, 2, 5, 10]) if (pow * m >= target) return pow * m;
    return pow * 10;
  }

  private draw(): void {
    this.dirty = false;
    const ctx = this.ctx;
    const col = this.colors;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = col.stage;
    ctx.fillRect(0, 0, this.width, this.height);

    // siatka
    const step = this.gridStep();
    const [wx0, wy1] = this.toWorld(0, 0);
    const [wx1, wy0] = this.toWorld(this.width, this.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = col.grid;
    ctx.beginPath();
    for (let x = Math.ceil(wx0 / step) * step; x <= wx1; x += step) {
      const sx = Math.round(this.toScreen(x, 0)[0]) + 0.5;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, this.height);
    }
    for (let y = Math.ceil(wy0 / step) * step; y <= wy1; y += step) {
      const sy = Math.round(this.toScreen(0, y)[1]) + 0.5;
      ctx.moveTo(0, sy);
      ctx.lineTo(this.width, sy);
    }
    ctx.stroke();

    // osie i początek układu
    const [ox, oy] = this.toScreen(0, 0);
    ctx.strokeStyle = col.axis;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(oy) + 0.5);
    ctx.lineTo(this.width, Math.round(oy) + 0.5);
    ctx.moveTo(Math.round(ox) + 0.5, 0);
    ctx.lineTo(Math.round(ox) + 0.5, this.height);
    ctx.stroke();
    ctx.fillStyle = col.axis;
    ctx.beginPath();
    ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillStyle = col.axisText;
    ctx.fillText('0', ox + 6, oy + 14);
    if (ox > -20 && ox < this.width + 20) ctx.fillText('y', ox + 6, 14);
    if (oy > -20 && oy < this.height + 20) ctx.fillText('x', this.width - 14, oy - 6);

    // wzorzec wyzwania
    if (this.state.ghost?.length) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      this.strokeSegments(this.state.ghost, col.ghost, 9);
      ctx.restore();
    }

    this.strokeSegments(this.state.segments);

    if (this.state.turtle) {
      const t = this.state.turtle;
      const [tx, ty] = this.toScreen(t.pos[0], t.pos[1]);
      drawTurtle2D(ctx, tx, ty, Math.atan2(t.heading[0], t.heading[1]), t, col);
    }
  }

  private strokeSegments(segs: Segment[], color?: string, width?: number): void {
    const ctx = this.ctx;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let style = '';
    let open = false;
    let lastX = NaN;
    let lastY = NaN;
    for (const s of segs) {
      const key = `${color ?? s.color}|${width ?? s.width}`;
      if (key !== style) {
        if (open) ctx.stroke();
        ctx.strokeStyle = color ?? s.color;
        ctx.lineWidth = width ?? s.width;
        ctx.beginPath();
        style = key;
        open = true;
        lastX = NaN;
      }
      const [x0, y0] = this.toScreen(s.from[0], s.from[1]);
      const [x1, y1] = this.toScreen(s.to[0], s.to[1]);
      if (x0 !== lastX || y0 !== lastY) ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      lastX = x1;
      lastY = y1;
    }
    if (open) ctx.stroke();
  }
}
