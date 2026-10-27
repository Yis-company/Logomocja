import type { Turtle } from '../logo/machine';
import type { Segment } from '../logo/types';
import type { StageView } from './view';

const MIN_SCALE = 0.001;
const MAX_SCALE = 500;
const TURTLE_SIZE = 9;
const ACCENT = '#16866a';

interface Pan {
  x: number;
  y: number;
}

/** Top-down view of the XY plane. World +Y points up the screen; scale is pixels per unit. */
export class PlaneView implements StageView {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly pointers = new Map<number, Pan>();
  private center: Pan = { x: 0, y: 0 };
  private scale = 6;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private segments: readonly Segment[] = [];
  private turtle: Turtle | null = null;
  private frame = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D jest niedostępny');
    this.ctx = ctx;

    new ResizeObserver(() => this.resize()).observe(canvas);
    canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
    canvas.addEventListener('pointerup', (e) => this.onPointerEnd(e));
    canvas.addEventListener('pointercancel', (e) => this.onPointerEnd(e));
    canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    this.resize();
  }

  update(segments: readonly Segment[], turtle: Turtle | null): void {
    this.segments = segments;
    this.turtle = turtle;
    this.requestRender();
  }

  fit(): void {
    const points: Array<[number, number]> = [];
    for (const s of this.segments) {
      points.push([s.from[0], s.from[1]], [s.to[0], s.to[1]]);
    }
    if (this.turtle) points.push([this.turtle.position[0], this.turtle.position[1]]);

    if (points.length === 0) {
      this.center = { x: 0, y: 0 };
      this.scale = 6;
    } else {
      const xs = points.map((p) => p[0]);
      const ys = points.map((p) => p[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      this.center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
      const fitX = (this.width * 0.85) / Math.max(maxX - minX, 1);
      const fitY = (this.height * 0.85) / Math.max(maxY - minY, 1);
      this.scale = clamp(Math.min(fitX, fitY), MIN_SCALE, MAX_SCALE);
    }
    this.requestRender();
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.max(1, Math.round(rect.width * this.dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * this.dpr));
    this.requestRender();
  }

  private requestRender(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  }

  private render(): void {
    const { ctx, width, height } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    this.drawAxes();

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const s of this.segments) {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      const [x1, y1] = this.toScreen(s.from[0], s.from[1]);
      const [x2, y2] = this.toScreen(s.to[0], s.to[1]);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    if (this.turtle) this.drawTurtle(this.turtle);
  }

  private drawAxes(): void {
    const { ctx } = this;
    const [ox, oy] = this.toScreen(0, 0);
    ctx.save();
    ctx.strokeStyle = 'rgba(31, 41, 55, 0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(this.width, oy);
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, this.height);
    ctx.stroke();
    ctx.restore();
  }

  private drawTurtle(turtle: Turtle): void {
    const { ctx } = this;
    const [px, py] = this.toScreen(turtle.position[0], turtle.position[1]);
    // Screen y grows downwards, so the heading's y component is flipped.
    const hx = turtle.heading[0];
    const hy = -turtle.heading[1];
    const length = Math.hypot(hx, hy) || 1;
    const dx = hx / length;
    const dy = hy / length;
    const tip = [px + dx * TURTLE_SIZE * 1.4, py + dy * TURTLE_SIZE * 1.4];
    const left = [px - dx * TURTLE_SIZE * 0.6 - dy * TURTLE_SIZE * 0.7, py - dy * TURTLE_SIZE * 0.6 + dx * TURTLE_SIZE * 0.7];
    const right = [px - dx * TURTLE_SIZE * 0.6 + dy * TURTLE_SIZE * 0.7, py - dy * TURTLE_SIZE * 0.6 - dx * TURTLE_SIZE * 0.7];

    ctx.save();
    ctx.fillStyle = turtle.pen ? ACCENT : 'rgba(22, 134, 106, 0.35)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tip[0], tip[1]);
    ctx.lineTo(left[0], left[1]);
    ctx.lineTo(right[0], right[1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  private toScreen(x: number, y: number): [number, number] {
    return [this.width / 2 + (x - this.center.x) * this.scale, this.height / 2 - (y - this.center.y) * this.scale];
  }

  /** Keeps the world point under a screen position fixed while zooming by `factor`. */
  private zoomAt(sx: number, sy: number, factor: number): void {
    const next = clamp(this.scale * factor, MIN_SCALE, MAX_SCALE);
    const wx = this.center.x + (sx - this.width / 2) / this.scale;
    const wy = this.center.y - (sy - this.height / 2) / this.scale;
    this.scale = next;
    this.center = {
      x: wx - (sx - this.width / 2) / next,
      y: wy + (sy - this.height / 2) / next,
    };
    this.requestRender();
  }

  private localPoint(e: PointerEvent | WheelEvent): Pan {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private onPointerDown(e: PointerEvent): void {
    this.canvas.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, this.localPoint(e));
  }

  private onPointerMove(e: PointerEvent): void {
    const previous = this.pointers.get(e.pointerId);
    if (!previous) return;
    const current = this.localPoint(e);
    if (this.pointers.size === 1) {
      this.center = {
        x: this.center.x - (current.x - previous.x) / this.scale,
        y: this.center.y + (current.y - previous.y) / this.scale,
      };
      this.requestRender();
    } else if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      const other = a === previous ? b : a;
      const before = Math.hypot(previous.x - other.x, previous.y - other.y);
      const after = Math.hypot(current.x - other.x, current.y - other.y);
      if (before > 0 && after > 0) {
        this.zoomAt((current.x + other.x) / 2, (current.y + other.y) / 2, after / before);
      }
    }
    this.pointers.set(e.pointerId, current);
  }

  private onPointerEnd(e: PointerEvent): void {
    this.pointers.delete(e.pointerId);
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    const { x, y } = this.localPoint(e);
    this.zoomAt(x, y, Math.exp(-e.deltaY * 0.0015));
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
