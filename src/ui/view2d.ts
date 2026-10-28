import type { Segment, Turtle } from '../lang';
import { cssVar } from './theme';

/** What a view draws. `ghost` is a target drawing shown faintly (used by challenges). */
export interface Scene {
  segments: readonly Segment[];
  revision: number;
  turtle: Turtle | null;
  ghost: readonly Segment[] | null;
}

/** World point at the centre of the view and pixels per world unit. */
export interface View2DState {
  cx: number;
  cy: number;
  scale: number;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Palette {
  background: string;
  minor: string;
  major: string;
  axis: string;
  muted: string;
  accent: string;
  ghost: string;
}

export const MIN_SCALE = 1e-4;
export const MAX_SCALE = 1e3;

export function readPalette(): Palette {
  return {
    background: cssVar('--canvas-bg') || '#f7f4ea',
    minor: cssVar('--grid-minor') || '#e5e0d2',
    major: cssVar('--grid-major') || '#d2cbb8',
    axis: cssVar('--axis') || '#8a8270',
    muted: cssVar('--ink-muted') || '#6b6758',
    accent: cssVar('--accent') || '#16866a',
    ghost: cssVar('--ghost') || '#9a9384',
  };
}

/** Bounds of the drawing, the turtle and the origin. */
export function boundsOf(segments: readonly Segment[], turtle: Turtle | null): Bounds {
  const bounds: Bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  const include = (x: number, y: number) => {
    bounds.minX = Math.min(bounds.minX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.maxY = Math.max(bounds.maxY, y);
  };
  for (const s of segments) {
    include(s.from[0], s.from[1]);
    include(s.to[0], s.to[1]);
  }
  if (turtle) include(turtle.position[0], turtle.position[1]);
  return bounds;
}

/** A view that shows `bounds` with a margin, fitted into a `width` × `height` area. */
export function fitView(bounds: Bounds, width: number, height: number, margin = 0.1): View2DState {
  const spanX = Math.max(bounds.maxX - bounds.minX, 20);
  const spanY = Math.max(bounds.maxY - bounds.minY, 20);
  const usableW = Math.max(width * (1 - 2 * margin), 1);
  const usableH = Math.max(height * (1 - 2 * margin), 1);
  const scale = Math.min(Math.max(Math.min(usableW / spanX, usableH / spanY), MIN_SCALE), MAX_SCALE);
  return {
    cx: (bounds.minX + bounds.maxX) / 2,
    cy: (bounds.minY + bounds.maxY) / 2,
    scale,
  };
}

/** A round step (1, 2 or 5 times a power of ten) that keeps grid lines a comfortable distance apart. */
export function gridStep(scale: number): number {
  const target = 60 / scale;
  const power = Math.pow(10, Math.floor(Math.log10(target)));
  for (const factor of [1, 2, 5, 10]) {
    if (power * factor >= target) return power * factor;
  }
  return power * 10;
}

/** Draws the grid, the drawing, the ghost, the origin and the turtle. */
export function paint2D(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  view: View2DState,
  scene: Scene,
  palette: Palette,
): void {
  const toX = (x: number) => width / 2 + (x - view.cx) * view.scale;
  const toY = (y: number) => height / 2 - (y - view.cy) * view.scale;

  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);

  // Grid: minor lines every step, major lines every fifth step.
  const step = gridStep(view.scale);
  const left = view.cx - width / 2 / view.scale;
  const right = view.cx + width / 2 / view.scale;
  const bottom = view.cy - height / 2 / view.scale;
  const top = view.cy + height / 2 / view.scale;
  ctx.lineWidth = 1;
  for (let x = Math.ceil(left / step) * step; x <= right; x += step) {
    const isMajor = Math.round(x / step) % 5 === 0;
    if (x === 0) continue;
    ctx.strokeStyle = isMajor ? palette.major : palette.minor;
    strokeLine(ctx, Math.round(toX(x)) + 0.5, 0, Math.round(toX(x)) + 0.5, height);
  }
  for (let y = Math.ceil(bottom / step) * step; y <= top; y += step) {
    const isMajor = Math.round(y / step) % 5 === 0;
    if (y === 0) continue;
    ctx.strokeStyle = isMajor ? palette.major : palette.minor;
    strokeLine(ctx, 0, Math.round(toY(y)) + 0.5, width, Math.round(toY(y)) + 0.5);
  }

  // Axes through the origin.
  ctx.strokeStyle = palette.axis;
  strokeLine(ctx, 0, Math.round(toY(0)) + 0.5, width, Math.round(toY(0)) + 0.5);
  strokeLine(ctx, Math.round(toX(0)) + 0.5, 0, Math.round(toX(0)) + 0.5, height);

  if (scene.ghost && scene.ghost.length) {
    ctx.save();
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = palette.ghost;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (const s of scene.ghost) {
      ctx.moveTo(toX(s.from[0]), toY(s.from[1]));
      ctx.lineTo(toX(s.to[0]), toY(s.to[1]));
    }
    ctx.stroke();
    ctx.restore();
  }

  // The drawing, batched into runs of identical colour and width.
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const segments = scene.segments;
  let i = 0;
  while (i < segments.length) {
    const { color, width: lineWidth } = segments[i];
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    let j = i;
    while (j < segments.length && segments[j].color === color && segments[j].width === lineWidth) {
      const s = segments[j];
      ctx.moveTo(toX(s.from[0]), toY(s.from[1]));
      ctx.lineTo(toX(s.to[0]), toY(s.to[1]));
      j++;
    }
    ctx.stroke();
    i = j;
  }

  // Origin.
  ctx.fillStyle = palette.axis;
  ctx.beginPath();
  ctx.arc(toX(0), toY(0), 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.muted;
  ctx.font = '12px system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('0, 0', toX(0) + 6, toY(0) + 6);

  if (scene.turtle) drawTurtle(ctx, scene.turtle, toX, toY, palette);
}

function strokeLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawTurtle(
  ctx: CanvasRenderingContext2D,
  turtle: Turtle,
  toX: (x: number) => number,
  toY: (y: number) => number,
  palette: Palette,
): void {
  const [hx, hy] = turtle.heading;
  const length = Math.hypot(hx, hy) || 1;
  // Screen y points down, so the world heading is mirrored in y.
  const dx = hx / length;
  const dy = -hy / length;
  const px = toX(turtle.position[0]);
  const py = toY(turtle.position[1]);
  const size = 9;
  const tip = [px + dx * size * 1.4, py + dy * size * 1.4];
  const left = [px - dx * size * 0.6 - dy * size * 0.75, py - dy * size * 0.6 + dx * size * 0.75];
  const right = [px - dx * size * 0.6 + dy * size * 0.75, py - dy * size * 0.6 - dx * size * 0.75];
  ctx.beginPath();
  ctx.moveTo(tip[0], tip[1]);
  ctx.lineTo(left[0], left[1]);
  ctx.lineTo(right[0], right[1]);
  ctx.closePath();
  ctx.fillStyle = palette.accent;
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = palette.background;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

/**
 * The 2D view: a canvas with pan (drag or arrow keys), zoom (wheel, pinch or
 * buttons) and a fit-to-drawing action. While a program runs it can keep the
 * drawing in view ("follow").
 */
export class View2D {
  readonly canvas: HTMLCanvasElement;
  private view: View2DState = { cx: 0, cy: 0, scale: 2 };
  private scene: Scene = { segments: [], revision: -1, turtle: null, ghost: null };
  private follow = false;
  private palette = readPalette();
  private dirty = true;
  private width = 0;
  private height = 0;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private pinchDistance = 0;
  private frame = 0;
  private readonly observer: ResizeObserver;
  private readonly onUserView: () => void;

  constructor(canvas: HTMLCanvasElement, onUserView: () => void) {
    this.canvas = canvas;
    this.onUserView = onUserView;
    canvas.addEventListener('pointerdown', (e) => this.pointerDown(e));
    canvas.addEventListener('pointermove', (e) => this.pointerMove(e));
    canvas.addEventListener('pointerup', (e) => this.pointerUp(e));
    canvas.addEventListener('pointercancel', (e) => this.pointerUp(e));
    canvas.addEventListener('wheel', (e) => this.wheel(e), { passive: false });
    canvas.addEventListener('keydown', (e) => this.key(e));
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
    this.loop();
  }

  setScene(scene: Scene): void {
    this.scene = scene;
    if (this.follow) this.fitToScene(false);
    this.dirty = true;
  }

  /** Follow the drawing while it grows. Any manual pan or zoom turns this off. */
  setFollow(enabled: boolean): void {
    this.follow = enabled;
    if (enabled) this.fitToScene(false);
  }

  fitToScene(markUser = true): void {
    if (markUser) this.onUserView();
    this.follow = markUser ? false : this.follow;
    const bounds = boundsOf(this.scene.segments, this.scene.turtle);
    this.view = fitView(bounds, this.width, this.height);
    this.dirty = true;
  }

  zoomBy(factor: number, anchorX = this.width / 2, anchorY = this.height / 2): void {
    this.onUserView();
    this.follow = false;
    const scale = Math.min(Math.max(this.view.scale * factor, MIN_SCALE), MAX_SCALE);
    const worldX = this.view.cx + (anchorX - this.width / 2) / this.view.scale;
    const worldY = this.view.cy - (anchorY - this.height / 2) / this.view.scale;
    this.view.scale = scale;
    this.view.cx = worldX - (anchorX - this.width / 2) / scale;
    this.view.cy = worldY + (anchorY - this.height / 2) / scale;
    this.dirty = true;
  }

  panPixels(dx: number, dy: number): void {
    this.onUserView();
    this.follow = false;
    this.view.cx -= dx / this.view.scale;
    this.view.cy += dy / this.view.scale;
    this.dirty = true;
  }

  resetView(): void {
    this.onUserView();
    this.follow = false;
    this.view = { cx: 0, cy: 0, scale: 2 };
    this.dirty = true;
  }

  /** A PNG of the whole drawing, fitted to a fixed-size canvas with the background filled in. */
  exportPng(): Promise<Blob> {
    const width = 1200;
    const height = 900;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const view = fitView(boundsOf(this.scene.segments, this.scene.turtle), width, height);
    paint2D(ctx, width, height, view, { ...this.scene, turtle: null }, readPalette());
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Nie udało się zapisać obrazu.'))), 'image/png');
    });
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    // A hidden canvas has no size; keep the last one until it is shown again.
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    if (width === this.width && height === this.height && this.canvas.width === Math.round(width * dpr)) return;
    const firstSize = this.width === 0;
    this.width = width;
    this.height = height;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    if (firstSize || this.follow) this.fitToScene(false);
    this.dirty = true;
  }

  private loop = (): void => {
    if (this.dirty && this.width > 0 && this.canvas.clientWidth > 0) this.draw();
    this.frame = requestAnimationFrame(this.loop);
  };

  /** Repaints the canvas if anything changed. Called on the animation frame. */
  private draw(): void {
    const dpr = window.devicePixelRatio || 1;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint2D(ctx, this.width, this.height, this.view, this.scene, this.palette);
    this.dirty = false;
  }

  /** Call after the theme changes. */
  refreshPalette(): void {
    this.palette = readPalette();
    this.dirty = true;
  }

  dispose(): void {
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
  }

  private pointerDown(event: PointerEvent): void {
    this.canvas.focus({ preventScroll: true });
    this.canvas.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.offsetX, y: event.offsetY });
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
    }
  }

  private pointerMove(event: PointerEvent): void {
    const previous = this.pointers.get(event.pointerId);
    if (!previous) return;
    const current = { x: event.offsetX, y: event.offsetY };
    this.pointers.set(event.pointerId, current);
    if (this.pointers.size >= 2) {
      const [a, b] = [...this.pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (this.pinchDistance > 0 && distance > 0) {
        this.zoomBy(distance / this.pinchDistance, (a.x + b.x) / 2, (a.y + b.y) / 2);
      }
      this.pinchDistance = distance;
      return;
    }
    this.panPixels(current.x - previous.x, current.y - previous.y);
  }

  private pointerUp(event: PointerEvent): void {
    this.pointers.delete(event.pointerId);
    if (this.pointers.size < 2) this.pinchDistance = 0;
  }

  private wheel(event: WheelEvent): void {
    event.preventDefault();
    const factor = Math.exp(-event.deltaY * 0.0015);
    this.zoomBy(factor, event.offsetX, event.offsetY);
  }

  private key(event: KeyboardEvent): void {
    const step = 40;
    switch (event.key) {
      case 'ArrowLeft':
        this.panPixels(step, 0);
        break;
      case 'ArrowRight':
        this.panPixels(-step, 0);
        break;
      case 'ArrowUp':
        this.panPixels(0, step);
        break;
      case 'ArrowDown':
        this.panPixels(0, -step);
        break;
      case '+':
      case '=':
        this.zoomBy(1.25);
        break;
      case '-':
      case '_':
        this.zoomBy(0.8);
        break;
      case 'Home':
        this.fitToScene();
        break;
      default:
        return;
    }
    event.preventDefault();
  }
}
