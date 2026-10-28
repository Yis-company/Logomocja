import type { Segment } from '../lang';
import type { Vec3 } from '../lang/geometry';
import { h, nextPaint } from './dom';
import {
  EMPTY_FRAME, boundsOf, fitTransform, gridStep, paintScene, readPalette,
  type Palette, type Projection, type SceneFrame, type ViewTransform,
} from './paint';

/** Wspólny interfejs widoków rysunku (2D na płótnie i 3D w WebGL). */
export interface StageView {
  readonly element: HTMLElement;
  setFrame(frame: SceneFrame): void;
  /** Przed uruchomieniem: dopasuj widok do całego przyszłego rysunku, jeśli włączone autodopasowanie. */
  prepare(segments: readonly Segment[], points: Vec3[]): void;
  fit(): void;
  resetView(): void;
  zoom(factor: number): void;
  exportPng(): Promise<Blob | null>;
  setVisible(visible: boolean): void;
  refreshTheme(): void;
  painted(): Promise<void>;
}

export interface View2DOptions {
  project: Projection;
  label: string;
  axes3d?: boolean;
  /** Komunikat nad płótnem (np. brak WebGL). */
  notice?: HTMLElement;
}

export class View2D implements StageView {
  readonly element: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly scaleLabel: HTMLElement;
  private ctx: CanvasRenderingContext2D;
  private frame: SceneFrame = EMPTY_FRAME;
  private view: ViewTransform = { cx: 0, cy: 60, scale: 1 };
  private autoFit = true;
  private width = 300;
  private height = 300;
  private dpr = 1;
  private palette: Palette;
  private pending = false;
  private visible = true;
  private initialized = false;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private pinch: { dist: number; cx: number; cy: number } | null = null;

  constructor(private readonly opts: View2DOptions) {
    this.canvas = h('canvas', {
      class: 'stage-canvas',
      tabindex: '0',
      role: 'img',
      'aria-label': opts.label,
      'aria-roledescription': 'rysunek',
    });
    this.scaleLabel = h('div', { class: 'stage-scale', 'aria-hidden': 'true' });
    this.element = h('div', { class: 'stage-view stage-2d' }, opts.notice ?? null, this.canvas, this.scaleLabel);
    this.ctx = this.canvas.getContext('2d')!;
    this.palette = readPalette();
    new ResizeObserver(() => this.resize()).observe(this.element);
    this.bindInput();
  }

  setFrame(frame: SceneFrame): void {
    this.frame = frame;
    this.schedule();
  }

  prepare(segments: readonly Segment[], points: Vec3[]): void {
    if (!this.autoFit) return;
    this.view = this.fitFor(segments, points);
    this.schedule();
  }

  fit(): void {
    this.autoFit = true;
    const f = this.frame;
    const segs = [...f.segments, ...(f.partial ? [f.partial] : []), ...(f.ghost ?? [])];
    this.view = this.fitFor(segs, f.turtle ? [f.turtle.pos] : []);
    this.schedule();
  }

  resetView(): void {
    this.autoFit = true;
    this.view = this.defaultView();
    this.schedule();
  }

  zoom(factor: number, at?: { x: number; y: number }): void {
    this.autoFit = false;
    const v = this.view;
    const px = at?.x ?? this.width / 2, py = at?.y ?? this.height / 2;
    // Punkt pod kursorem zostaje na miejscu.
    const wx = v.cx + (px - this.width / 2) / v.scale;
    const wy = v.cy - (py - this.height / 2) / v.scale;
    const scale = Math.min(500, Math.max(0.002, v.scale * factor));
    this.view = {
      scale,
      cx: wx - (px - this.width / 2) / scale,
      cy: wy + (py - this.height / 2) / scale,
    };
    this.schedule();
  }

  panBy(dx: number, dy: number): void {
    this.autoFit = false;
    this.view = { ...this.view, cx: this.view.cx - dx / this.view.scale, cy: this.view.cy + dy / this.view.scale };
    this.schedule();
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.element.hidden = !visible;
    if (visible) this.resize();
  }

  refreshTheme(): void {
    this.palette = readPalette();
    this.schedule();
  }

  async painted(): Promise<void> {
    this.paint();
    await nextPaint();
  }

  async exportPng(): Promise<Blob | null> {
    // Eksport: sam rysunek dopasowany do obrazu, bez siatki i żółwia.
    const f = this.frame;
    const segs = [...f.segments, ...(f.partial ? [f.partial] : [])];
    const b = boundsOf(segs, this.opts.project);
    const bw = b ? b.maxX - b.minX : 1, bh = b ? b.maxY - b.minY : 1;
    const longSide = 1600;
    const aspect = Math.min(3, Math.max(1 / 3, (bw + 1) / (bh + 1)));
    const w = aspect >= 1 ? longSide : Math.round(longSide * aspect);
    const hgt = aspect >= 1 ? Math.round(longSide / aspect) : longSide;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = hgt;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const view = fitTransform(b, w, hgt, 64);
    paintScene(ctx, w, hgt, view, { segments: segs, partial: null, turtle: null, ghost: null }, {
      grid: false, axes: false, widthScale: 2, palette: this.palette, project: this.opts.project,
    });
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
  }

  private fitFor(segments: readonly Segment[], points: Vec3[]): ViewTransform {
    const b = boundsOf(segments, this.opts.project, points);
    if (!b) return this.defaultView();
    // Początek układu też powinien być widoczny, jeśli rysunek jest blisko.
    return fitTransform(b, this.width, this.height, 36);
  }

  private defaultView(): ViewTransform {
    const s = Math.max(0.3, Math.min(this.width, this.height) / 420);
    return { cx: 0, cy: this.opts.axes3d ? 40 : 60, scale: s };
  }

  private resize(): void {
    const r = this.element.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    this.width = r.width;
    this.height = r.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    if (!this.initialized) {
      this.initialized = true;
      this.view = this.defaultView();
    }
    this.paint();
  }

  private schedule(): void {
    if (this.pending || !this.visible) return;
    this.pending = true;
    requestAnimationFrame(() => {
      this.pending = false;
      this.paint();
    });
  }

  private paint(): void {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    paintScene(ctx, this.width, this.height, this.view, this.frame, {
      grid: true, axes: true, axes3d: this.opts.axes3d, widthScale: 1,
      palette: this.palette, project: this.opts.project,
    });
    const step = gridStep(this.view.scale);
    this.scaleLabel.textContent = this.opts.axes3d ? '' : `kratka = ${step < 1 ? step : Math.round(step)}`;
  }

  private bindInput(): void {
    const c = this.canvas;
    const local = (e: { clientX: number; clientY: number }) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, local(e));
      if (this.pointers.size === 2) this.pinch = this.pinchState();
    });
    c.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const p = local(e);
      this.pointers.set(e.pointerId, p);
      if (this.pointers.size === 1) {
        this.panBy(p.x - prev.x, p.y - prev.y);
      } else if (this.pointers.size === 2 && this.pinch) {
        const now = this.pinchState();
        this.panBy(now.cx - this.pinch.cx, now.cy - this.pinch.cy);
        if (this.pinch.dist > 0) this.zoom(now.dist / this.pinch.dist, { x: now.cx, y: now.cy });
        this.pinch = now;
      }
    });
    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      this.pinch = this.pointers.size === 2 ? this.pinchState() : null;
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      this.zoom(Math.exp(-dy * 0.0015), local(e));
    }, { passive: false });
    c.addEventListener('dblclick', () => this.fit());
    c.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const step = 40;
      switch (e.key) {
        case 'ArrowLeft': this.panBy(step, 0); break;
        case 'ArrowRight': this.panBy(-step, 0); break;
        case 'ArrowUp': this.panBy(0, step); break;
        case 'ArrowDown': this.panBy(0, -step); break;
        case '+': case '=': this.zoom(1.25); break;
        case '-': case '_': this.zoom(0.8); break;
        case '0': case 'f': case 'F': this.fit(); break;
        default: return;
      }
      e.preventDefault();
    });
  }

  private pinchState() {
    const [a, b] = [...this.pointers.values()];
    return { dist: Math.hypot(a!.x - b!.x, a!.y - b!.y), cx: (a!.x + b!.x) / 2, cy: (a!.y + b!.y) / 2 };
  }
}
