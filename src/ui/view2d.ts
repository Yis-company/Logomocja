import { type Segment, type Turtle, type Vec3 } from '../lang/index';
import { cssVar, download, el } from './dom';

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** The plane view: pan, zoom, fit and a visible origin. Coordinates are Logo's (x right, y up the page). */
export class View2D {
  readonly element: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private segments: readonly Segment[] = [];
  private ghost: readonly Segment[] | null = null;
  private turtle: Turtle | null = null;
  /** Pixels per Logo unit. */
  private scale = 2;
  /** Screen position (CSS pixels) of the origin. */
  private ox = 0;
  private oy = 0;
  private width = 0;
  private height = 0;
  private pointers = new Map<number, { x: number; y: number }>();
  /** True until the user pans or zooms; while true the view follows the drawing. */
  autoFit = true;
  private readonly onChange: () => void;
  private readonly themeListener = (): void => this.draw();
  private readonly resizeObserver: ResizeObserver;

  constructor(container: HTMLElement, onChange: () => void = () => undefined) {
    this.onChange = onChange;
    this.canvas = el('canvas', { class: 'stage-canvas', role: 'img', 'aria-label': 'Rysunek żółwia na płaszczyźnie 2D', tabindex: '-1' });
    this.ctx = this.canvas.getContext('2d')!;
    this.element = el('div', { class: 'view view-2d' }, this.canvas);
    container.append(this.element);
    this.attachPointer();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.element);
    window.addEventListener('logomocja:theme', this.themeListener);
    this.resize();
  }

  /** Draws the current state. Call after every change to the segments or the turtle. */
  render(segments: readonly Segment[], turtle: Turtle | null, ghost: readonly Segment[] | null = null): void {
    this.segments = segments;
    this.turtle = turtle;
    this.ghost = ghost;
    if (this.autoFit && (segments.length > 0 || turtle)) this.fitTo(this.boundsOf(segments, ghost));
    this.draw();
  }

  /** Zooms around the centre of the view; used by the keyboard-operable zoom buttons. */
  zoomBy(factor: number): void {
    this.zoomAt(this.width / 2, this.height / 2, factor);
    this.userChanged();
  }

  /** Fits the drawing (and the origin) into the view. */
  fit(): void {
    this.autoFit = true;
    this.fitTo(this.boundsOf(this.segments, this.ghost));
    this.draw();
  }

  resize(): void {
    const rect = this.element.getBoundingClientRect();
    // Hidden views have no size; wait until they are shown again.
    if (rect.width === 0 || rect.height === 0) return;
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    if (w === this.width && h === this.height) return;
    const isFirst = this.width === 0;
    this.width = w;
    this.height = h;
    if (isFirst) {
      this.ox = w / 2;
      this.oy = h / 2;
    }
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    if (this.autoFit) this.fitTo(this.boundsOf(this.segments, this.ghost));
    this.draw();
  }

  /** A PNG of the whole drawing on the background colour, with a margin. */
  exportPng(filename: string): void {
    const bounds = this.boundsOf(this.segments, null);
    const margin = 24;
    const scaleFactor = 2;
    const spanX = Math.max(bounds.maxX - bounds.minX, 1);
    const spanY = Math.max(bounds.maxY - bounds.minY, 1);
    const fitScale = Math.min(1200 / spanX, 1200 / spanY, 4);
    const w = Math.ceil(spanX * fitScale + margin * 2);
    const h = Math.ceil(spanY * fitScale + margin * 2);
    const out = document.createElement('canvas');
    out.width = w * scaleFactor;
    out.height = h * scaleFactor;
    const ctx = out.getContext('2d')!;
    ctx.scale(scaleFactor, scaleFactor);
    ctx.fillStyle = cssVar('--canvas-bg') || '#ffffff';
    ctx.fillRect(0, 0, w, h);
    const toPx = (p: Vec3): [number, number] => [margin + (p[0] - bounds.minX) * fitScale, margin + (bounds.maxY - p[1]) * fitScale];
    this.strokeSegments(ctx, this.segments, toPx, 1);
    canvasToBlob(out).then((blob) => download(filename, blob, 'image/png'));
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    window.removeEventListener('logomocja:theme', this.themeListener);
    this.element.remove();
  }

  // ---- geometry ----

  private boundsOf(segments: readonly Segment[], ghost: readonly Segment[] | null): Bounds {
    // With nothing drawn, show a default window around the origin.
    if (segments.length === 0 && (!ghost || ghost.length === 0)) return { minX: -100, minY: -100, maxX: 100, maxY: 100 };
    const b: Bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    let any = false;
    const add = (p: Vec3): void => {
      if (!any) {
        b.minX = b.maxX = p[0];
        b.minY = b.maxY = p[1];
        any = true;
      } else {
        b.minX = Math.min(b.minX, p[0]);
        b.maxX = Math.max(b.maxX, p[0]);
        b.minY = Math.min(b.minY, p[1]);
        b.maxY = Math.max(b.maxY, p[1]);
      }
    };
    for (const s of segments) {
      add(s.from);
      add(s.to);
    }
    if (ghost) {
      for (const s of ghost) {
        add(s.from);
        add(s.to);
      }
    }
    add([0, 0, 0]);
    return b;
  }

  private fitTo(b: Bounds): void {
    const margin = 40;
    const spanX = Math.max(b.maxX - b.minX, 10);
    const spanY = Math.max(b.maxY - b.minY, 10);
    const availW = Math.max(40, this.width - margin * 2);
    const availH = Math.max(40, this.height - margin * 2);
    this.scale = Math.min(availW / spanX, availH / spanY);
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    this.ox = this.width / 2 - cx * this.scale;
    this.oy = this.height / 2 + cy * this.scale;
  }

  private toScreen(p: Vec3): [number, number] {
    return [this.ox + p[0] * this.scale, this.oy - p[1] * this.scale];
  }

  // ---- drawing ----

  private draw(): void {
    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = cssVar('--canvas-bg') || '#ffffff';
    ctx.fillRect(0, 0, this.width, this.height);
    this.drawGrid();
    this.drawAxes();
    const toPx = (p: Vec3): [number, number] => this.toScreen(p);
    if (this.ghost) this.strokeSegments(ctx, this.ghost, toPx, 1.5, cssVar('--ghost') || '#999', [6, 5]);
    this.strokeSegments(ctx, this.segments, toPx, 0);
    this.drawOrigin();
    if (this.turtle) this.drawTurtle(this.turtle);
  }

  private strokeSegments(
    ctx: CanvasRenderingContext2D,
    segments: readonly Segment[],
    toPx: (p: Vec3) => [number, number],
    fixedWidth: number,
    colour?: string,
    dash: number[] = [],
  ): void {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash(dash);
    let lastColour = '';
    let lastWidth = -1;
    ctx.beginPath();
    const flush = (): void => {
      ctx.stroke();
      ctx.beginPath();
    };
    for (const s of segments) {
      const c = colour ?? s.color;
      const w = fixedWidth || Math.max(1, s.width);
      if (c !== lastColour || w !== lastWidth) {
        flush();
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        lastColour = c;
        lastWidth = w;
      }
      const [x1, y1] = toPx(s.from);
      const [x2, y2] = toPx(s.to);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    flush();
    ctx.setLineDash([]);
  }

  private drawGrid(): void {
    const ctx = this.ctx;
    // Choose a grid step that gives roughly 60–150 pixels between lines.
    const raw = 100 / this.scale;
    const step = Math.pow(10, Math.floor(Math.log10(raw)));
    const pxStep = step * this.scale >= 60 ? step * this.scale : step * 10 * this.scale;
    if (pxStep < 8) return;
    ctx.strokeStyle = cssVar('--grid') || 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const startX = this.ox % pxStep;
    for (let x = startX; x < this.width; x += pxStep) {
      ctx.moveTo(Math.round(x) + 0.5, 0);
      ctx.lineTo(Math.round(x) + 0.5, this.height);
    }
    const startY = this.oy % pxStep;
    for (let y = startY; y < this.height; y += pxStep) {
      ctx.moveTo(0, Math.round(y) + 0.5);
      ctx.lineTo(this.width, Math.round(y) + 0.5);
    }
    ctx.stroke();
  }

  private drawAxes(): void {
    const ctx = this.ctx;
    ctx.lineWidth = 1;
    ctx.strokeStyle = cssVar('--axis') || 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.moveTo(0, Math.round(this.oy) + 0.5);
    ctx.lineTo(this.width, Math.round(this.oy) + 0.5);
    ctx.moveTo(Math.round(this.ox) + 0.5, 0);
    ctx.lineTo(Math.round(this.ox) + 0.5, this.height);
    ctx.stroke();
  }

  private drawOrigin(): void {
    const ctx = this.ctx;
    ctx.fillStyle = cssVar('--ink-soft') || '#555';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText('0', this.ox + 6, this.oy + 4);
    ctx.beginPath();
    ctx.arc(this.ox, this.oy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawTurtle(t: Turtle): void {
    const ctx = this.ctx;
    const [x, y] = this.toScreen(t.pos);
    // Heading on screen: +X is right, +Y is up, so the y component is flipped.
    const angle = Math.atan2(-t.heading[1], t.heading[0]);
    const size = 9;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(size * 1.5, 0);
    ctx.lineTo(-size, size * 0.9);
    ctx.lineTo(-size * 0.4, 0);
    ctx.lineTo(-size, -size * 0.9);
    ctx.closePath();
    ctx.fillStyle = t.pen ? cssVar('--turtle') || '#16866a' : 'transparent';
    ctx.strokeStyle = cssVar('--turtle') || '#16866a';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // ---- pan and zoom ----

  private attachPointer(): void {
    const c = this.canvas;
    c.style.touchAction = 'none';
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
    });
    c.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const now = { x: e.offsetX, y: e.offsetY };
      if (this.pointers.size === 1) {
        this.ox += now.x - prev.x;
        this.oy += now.y - prev.y;
      } else {
        // Two fingers: pinch to zoom around their midpoint.
        const other = [...this.pointers.entries()].find(([id]) => id !== e.pointerId)![1];
        const oldDist = Math.hypot(prev.x - other.x, prev.y - other.y) || 1;
        const newDist = Math.hypot(now.x - other.x, now.y - other.y) || 1;
        this.zoomAt((now.x + other.x) / 2, (now.y + other.y) / 2, newDist / oldDist);
      }
      this.pointers.set(e.pointerId, now);
      this.userChanged();
    });
    const end = (e: PointerEvent): void => {
      this.pointers.delete(e.pointerId);
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.zoomAt(e.offsetX, e.offsetY, Math.exp(-e.deltaY * 0.0015));
        this.userChanged();
      },
      { passive: false },
    );
  }

  private zoomAt(x: number, y: number, factor: number): void {
    const next = Math.min(Math.max(this.scale * factor, 1e-4), 1e3);
    const k = next / this.scale;
    this.ox = x - (x - this.ox) * k;
    this.oy = y - (y - this.oy) * k;
    this.scale = next;
    this.draw();
  }

  private userChanged(): void {
    this.autoFit = false;
    this.draw();
    this.onChange();
  }
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Nie udało się zapisać obrazu'))), 'image/png');
  });
}
