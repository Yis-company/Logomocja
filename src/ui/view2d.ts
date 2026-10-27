import type { Segment } from '../logo';
import type { TurtleState } from '../logo/turtle';
import { segmentBounds, type Stage } from './stage';

interface PointerInfo {
  x: number;
  y: number;
}

/** Flat view of the XY plane: +X right, +Y up on screen. Pan by dragging, zoom with wheel or pinch. */
export class View2D implements Stage {
  readonly element: HTMLCanvasElement;
  onUserInteraction: (() => void) | null = null;
  private readonly ctx: CanvasRenderingContext2D;
  private segments: Segment[] = [];
  private turtle: TurtleState | null = null;
  private center = { x: 0, y: 0 };
  private scale = 1;
  private grid = true;
  private dirty = true;
  private visible = true;
  private raf = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private readonly pointers = new Map<number, PointerInfo>();
  private pinchStart: { dist: number; scale: number; mid: PointerInfo; center: { x: number; y: number } } | null = null;
  private readonly observer: ResizeObserver;

  constructor(container: HTMLElement) {
    this.element = document.createElement('canvas');
    this.element.className = 'stage-2d';
    this.element.setAttribute('aria-label', 'Rysunek żółwia (2D)');
    container.appendChild(this.element);
    this.ctx = this.element.getContext('2d')!;
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.bindPointer();
    this.resize();
    this.loop();
  }

  setSegments(segments: Segment[]): void {
    this.segments = segments;
    this.dirty = true;
  }

  invalidate(): void {
    this.dirty = true;
  }

  setTurtle(turtle: TurtleState | null): void {
    this.turtle = turtle;
    this.dirty = true;
  }

  setGrid(on: boolean): void {
    this.grid = on;
    this.dirty = true;
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.element.style.display = visible ? '' : 'none';
    if (visible) {
      this.resize();
      this.dirty = true;
    }
  }

  fit(): void {
    const b = segmentBounds(this.segments, this.turtle);
    if (!b || this.width === 0) {
      this.center = { x: 0, y: 0 };
      this.scale = 1;
      this.dirty = true;
      return;
    }
    const w = Math.max(b.max[0] - b.min[0], 1e-6);
    const h = Math.max(b.max[1] - b.min[1], 1e-6);
    const pad = 48;
    const sx = (this.width - 2 * pad) / w;
    const sy = (this.height - 2 * pad) / h;
    this.scale = Math.min(sx, sy, 2.5);
    this.scale = Math.max(this.scale, 0.01);
    this.center = { x: (b.min[0] + b.max[0]) / 2, y: (b.min[1] + b.max[1]) / 2 };
    this.dirty = true;
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    this.element.remove();
  }

  // ---- interaction ------------------------------------------------------

  private bindPointer(): void {
    const el = this.element;
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinchStart = {
          dist: Math.hypot(a!.x - b!.x, a!.y - b!.y),
          scale: this.scale,
          mid: { x: (a!.x + b!.x) / 2, y: (a!.y + b!.y) / 2 },
          center: { ...this.center },
        };
      }
    });
    el.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const cur = { x: e.clientX, y: e.clientY };
      if (this.pointers.size === 1) {
        this.center.x -= (cur.x - prev.x) / this.scale;
        this.center.y += (cur.y - prev.y) / this.scale;
        this.dirty = true;
        this.onUserInteraction?.();
      }
      this.pointers.set(e.pointerId, cur);
      if (this.pointers.size === 2 && this.pinchStart) {
        const [a, b] = [...this.pointers.values()];
        const dist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
        const mid = { x: (a!.x + b!.x) / 2, y: (a!.y + b!.y) / 2 };
        const s = this.pinchStart;
        const newScale = clampScale((s.scale * dist) / Math.max(s.dist, 1));
        // Keep the world point under the initial midpoint fixed, then apply the midpoint drift.
        const rect = el.getBoundingClientRect();
        const wx = s.center.x + (s.mid.x - rect.left - this.width / 2) / s.scale;
        const wy = s.center.y - (s.mid.y - rect.top - this.height / 2) / s.scale;
        this.scale = newScale;
        this.center.x = wx - (mid.x - rect.left - this.width / 2) / newScale;
        this.center.y = wy + (mid.y - rect.top - this.height / 2) / newScale;
        this.dirty = true;
        this.onUserInteraction?.();
      }
    });
    const end = (e: PointerEvent): void => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinchStart = null;
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015));
        const rect = el.getBoundingClientRect();
        this.zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor);
        this.onUserInteraction?.();
      },
      { passive: false },
    );
    el.addEventListener('dblclick', () => {
      this.fit();
    });
  }

  private zoomAt(px: number, py: number, factor: number): void {
    const newScale = clampScale(this.scale * factor);
    const wx = this.center.x + (px - this.width / 2) / this.scale;
    const wy = this.center.y - (py - this.height / 2) / this.scale;
    this.scale = newScale;
    this.center.x = wx - (px - this.width / 2) / newScale;
    this.center.y = wy + (py - this.height / 2) / newScale;
    this.dirty = true;
  }

  // ---- rendering ---------------------------------------------------------

  private resize(): void {
    const rect = this.element.parentElement?.getBoundingClientRect();
    if (!rect) return;
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.element.width = Math.floor(this.width * this.dpr);
    this.element.height = Math.floor(this.height * this.dpr);
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.dirty = true;
  }

  private loop(): void {
    this.raf = requestAnimationFrame(() => this.loop());
    if (!this.dirty || !this.visible) return;
    this.dirty = false;
    this.draw();
  }

  private toScreen(x: number, y: number): [number, number] {
    return [this.width / 2 + (x - this.center.x) * this.scale, this.height / 2 - (y - this.center.y) * this.scale];
  }

  private draw(): void {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    if (this.grid) this.drawGrid();
    this.drawSegments();
    if (this.turtle) this.drawTurtle(this.turtle);
  }

  private drawGrid(): void {
    const ctx = this.ctx;
    // Pick a grid step that is 10^k × {1, 2, 5} and lands between ~28 and ~90 px.
    const target = 50 / this.scale;
    const pow = Math.pow(10, Math.floor(Math.log10(target)));
    let step = pow;
    for (const m of [1, 2, 5, 10]) {
      if (pow * m >= target) {
        step = pow * m;
        break;
      }
    }
    const left = this.center.x - this.width / 2 / this.scale;
    const right = this.center.x + this.width / 2 / this.scale;
    const bottom = this.center.y - this.height / 2 / this.scale;
    const top = this.center.y + this.height / 2 / this.scale;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(31, 42, 36, 0.08)';
    ctx.beginPath();
    for (let x = Math.ceil(left / step) * step; x <= right; x += step) {
      const [sx] = this.toScreen(x, 0);
      ctx.moveTo(Math.round(sx) + 0.5, 0);
      ctx.lineTo(Math.round(sx) + 0.5, this.height);
    }
    for (let y = Math.ceil(bottom / step) * step; y <= top; y += step) {
      const [, sy] = this.toScreen(0, y);
      ctx.moveTo(0, Math.round(sy) + 0.5);
      ctx.lineTo(this.width, Math.round(sy) + 0.5);
    }
    ctx.stroke();
    // Axes.
    ctx.strokeStyle = 'rgba(31, 42, 36, 0.22)';
    ctx.beginPath();
    const [ox, oy] = this.toScreen(0, 0);
    ctx.moveTo(Math.round(ox) + 0.5, 0);
    ctx.lineTo(Math.round(ox) + 0.5, this.height);
    ctx.moveTo(0, Math.round(oy) + 0.5);
    ctx.lineTo(this.width, Math.round(oy) + 0.5);
    ctx.stroke();
    // Scale label.
    ctx.fillStyle = 'rgba(31, 42, 36, 0.45)';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`siatka: ${formatNumber(step)}`, this.width - 10, this.height - 10);
  }

  private drawSegments(): void {
    const ctx = this.ctx;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let color = '';
    let width = -1;
    let open = false;
    let lastX = NaN;
    let lastY = NaN;
    for (const s of this.segments) {
      const w = Math.max(s.width * this.scale, 0.75);
      if (s.color !== color || w !== width) {
        if (open) ctx.stroke();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = w;
        color = s.color;
        width = w;
        ctx.beginPath();
        open = true;
        lastX = NaN;
        lastY = NaN;
      }
      const [x1, y1] = this.toScreen(s.from[0], s.from[1]);
      const [x2, y2] = this.toScreen(s.to[0], s.to[1]);
      if (x1 !== lastX || y1 !== lastY) ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      lastX = x2;
      lastY = y2;
    }
    if (open) ctx.stroke();
  }

  private drawTurtle(t: TurtleState): void {
    const ctx = this.ctx;
    const [x, y] = this.toScreen(t.position[0], t.position[1]);
    const angle = Math.atan2(t.heading[0], t.heading[1]); // 0 = up on screen
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const s = 1;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#0b4d3a';
    ctx.fillStyle = t.penDown ? '#2fa37f' : '#b7d9cb';
    // Legs
    for (const [lx, ly] of [
      [-7, -5],
      [7, -5],
      [-7, 6],
      [7, 6],
    ] as const) {
      ctx.beginPath();
      ctx.ellipse(lx * s, ly * s, 3.2, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // Tail
    ctx.beginPath();
    ctx.moveTo(-1.5, 8);
    ctx.lineTo(0, 13);
    ctx.lineTo(1.5, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Head
    ctx.beginPath();
    ctx.ellipse(0, -11 * s, 3.6, 4.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Shell
    ctx.beginPath();
    ctx.ellipse(0, 0, 8 * s, 9.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Shell pattern
    ctx.strokeStyle = 'rgba(11, 77, 58, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, 4, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Eyes
    ctx.fillStyle = '#0b4d3a';
    ctx.beginPath();
    ctx.arc(-1.5, -12.5, 0.8, 0, Math.PI * 2);
    ctx.arc(1.5, -12.5, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function clampScale(s: number): number {
  return Math.min(200, Math.max(0.005, s));
}

function formatNumber(n: number): string {
  return Number.isInteger(n) ? n.toLocaleString('pl-PL') : n.toLocaleString('pl-PL', { maximumFractionDigits: 3 });
}
