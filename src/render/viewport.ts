import type { Mode } from '../lang/ast';
import {
  defaultCamera2D, draw2D, fitCamera2D, MAX_SCALE_2D, MIN_SCALE_2D, screenToWorld2D, type Camera2D,
} from './view2d';
import {
  defaultCamera3D, draw3D, fitCamera3D, presetAngles, type Camera3D, type CameraPreset,
} from './view3d';
import { EMPTY_SCENE, readPalette, type Palette, type Scene } from './scene';

interface PointerInfo {
  x: number;
  y: number;
}

/**
 * The interactive drawing canvas: owns the 2D and 3D cameras, handles
 * pan/zoom/orbit with mouse, touch and keyboard, and repaints on demand.
 */
export class Viewport {
  mode: Mode = '2d';
  cam2d: Camera2D = defaultCamera2D();
  cam3d: Camera3D = defaultCamera3D();
  scene: Scene = EMPTY_SCENE;
  palette: Palette;
  /** Set when the user moved the camera by hand since the last fit. */
  userAdjusted = false;
  onPaint: (() => void) | null = null;

  private readonly ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf = 0;
  private pendingFit: Scene | null = null;
  private readonly pointers = new Map<number, PointerInfo>();
  private dragMode: 'pan' | 'orbit' = 'pan';
  private pinch: { dist: number; cx: number; cy: number } | null = null;
  private readonly ro: ResizeObserver;
  private readonly cleanup: (() => void)[] = [];

  constructor(readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.palette = readPalette();
    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(canvas);
    this.measure();
    this.listen();
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    for (const fn of this.cleanup) fn();
  }

  private on<K extends keyof HTMLElementEventMap>(type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) {
    this.canvas.addEventListener(type, fn as EventListener, opts);
    this.cleanup.push(() => this.canvas.removeEventListener(type, fn as EventListener, opts));
  }

  private measure(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    if (this.pendingFit && rect.width > 0 && rect.height > 0) {
      const s = this.pendingFit;
      this.pendingFit = null;
      this.fitTo(s);
    }
    this.paintNow();
  }

  get size(): { w: number; h: number } {
    return { w: this.w, h: this.h };
  }

  setMode(mode: Mode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    this.invalidate();
  }

  setScene(scene: Scene): void {
    this.scene = scene;
    this.invalidate();
  }

  refreshPalette(): void {
    this.palette = readPalette();
    this.invalidate();
  }

  /** Fits the camera so the given scene (default: the current one) is fully visible. */
  fitTo(scene: Scene = this.scene, resetAngles = false): void {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      this.pendingFit = scene;
      return;
    }
    if (this.mode === '2d') {
      const narrow = this.w < 520;
      this.cam2d = fitCamera2D(scene, this.w, this.h, undefined, {
        top: 0,
        right: narrow ? 52 : 44,
        bottom: 24,
        left: 0,
      });
    } else {
      const base = resetAngles ? { ...this.cam3d, ...presetAngles('default') } : this.cam3d;
      this.cam3d = fitCamera3D(scene, this.w, this.h, base);
    }
    this.userAdjusted = false;
    this.invalidate();
  }

  resetView(): void {
    if (this.mode === '2d') {
      this.cam2d = defaultCamera2D();
    } else {
      this.cam3d = { ...this.cam3d, ...presetAngles('default') };
      this.cam3d = fitCamera3D(this.scene, this.w, this.h, this.cam3d);
    }
    this.userAdjusted = false;
    this.invalidate();
  }

  preset(p: CameraPreset): void {
    this.cam3d = fitCamera3D(this.scene, this.w, this.h, { ...this.cam3d, ...presetAngles(p) });
    this.userAdjusted = true;
    this.invalidate();
  }

  zoom(factor: number, sx = this.w / 2, sy = this.h / 2): void {
    if (this.mode === '2d') {
      const c = this.cam2d;
      const scale = Math.min(MAX_SCALE_2D, Math.max(MIN_SCALE_2D, c.scale * factor));
      const [wx, wy] = screenToWorld2D(c, this.w, this.h, sx, sy);
      // Keep the world point under the cursor fixed.
      const cx = wx - (sx - this.w / 2) / scale;
      const cy = wy + (sy - this.h / 2) / scale;
      this.cam2d = { cx, cy, scale };
    } else {
      this.cam3d = { ...this.cam3d, dist: Math.min(2e6, Math.max(1, this.cam3d.dist / factor)) };
    }
    this.userAdjusted = true;
    this.invalidate();
  }

  /** Moves the view by a screen distance in CSS pixels. */
  pan(dx: number, dy: number): void {
    if (this.mode === '2d') {
      const c = this.cam2d;
      this.cam2d = { ...c, cx: c.cx - dx / c.scale, cy: c.cy + dy / c.scale };
    } else {
      const c = this.cam3d;
      const unit = (2 * c.dist * Math.tan((c.fov * Math.PI) / 360)) / Math.max(this.h, 1);
      const az = (c.az * Math.PI) / 180;
      const el = (c.el * Math.PI) / 180;
      const right = [-Math.sin(az), Math.cos(az), 0];
      // Screen-up direction of the camera.
      const up = [-Math.sin(el) * Math.cos(az), -Math.sin(el) * Math.sin(az), Math.cos(el)];
      const t = c.target;
      this.cam3d = {
        ...c,
        target: [
          t[0] - (dx * right[0] - dy * up[0]) * unit,
          t[1] - (dx * right[1] - dy * up[1]) * unit,
          t[2] - (dx * right[2] - dy * up[2]) * unit,
        ],
      };
    }
    this.userAdjusted = true;
    this.invalidate();
  }

  orbit(dAz: number, dEl: number): void {
    const c = this.cam3d;
    this.cam3d = { ...c, az: c.az + dAz, el: Math.max(-89.9, Math.min(89.9, c.el + dEl)) };
    this.userAdjusted = true;
    this.invalidate();
  }

  invalidate(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.paintNow();
    });
  }

  paintNow(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.mode === '2d') draw2D(ctx, this.w, this.h, this.cam2d, this.scene, this.palette);
    else draw3D(ctx, this.w, this.h, this.cam3d, this.scene, this.palette);
    this.onPaint?.();
  }

  /** Renders the current view at a higher resolution and returns it as a PNG. */
  exportPNG(scale = 2): Promise<Blob | null> {
    const k = Math.max(scale, Math.min(4, 1600 / Math.max(this.w, 1)));
    const c = document.createElement('canvas');
    c.width = Math.round(this.w * k);
    c.height = Math.round(this.h * k);
    const ctx = c.getContext('2d')!;
    if (this.mode === '2d') {
      const cam = { ...this.cam2d, scale: this.cam2d.scale * k };
      draw2D(ctx, c.width, c.height, cam, { ...this.scene, turtle: null }, this.palette, { pixelScale: k });
    } else {
      draw3D(ctx, c.width, c.height, this.cam3d, { ...this.scene, turtle: null }, this.palette, { pixelScale: k });
    }
    return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/png'));
  }

  // ------------------------------------------------------------- input

  private listen(): void {
    const canvas = this.canvas;
    this.on('pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 1) {
        const panGesture = e.button === 1 || e.button === 2 || e.shiftKey || e.ctrlKey || e.metaKey;
        this.dragMode = this.mode === '3d' && !panGesture ? 'orbit' : 'pan';
        this.pinch = null;
      } else if (this.pointers.size === 2) {
        this.pinch = this.pinchInfo();
      }
    });
    this.on('pointermove', (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      if (this.pointers.size === 1) {
        p.x = e.clientX;
        p.y = e.clientY;
        if (this.dragMode === 'orbit') this.orbit(-dx * 0.4, dy * 0.4);
        else this.pan(dx, dy);
      } else if (this.pointers.size === 2 && this.pinch) {
        p.x = e.clientX;
        p.y = e.clientY;
        const now = this.pinchInfo();
        const rect = canvas.getBoundingClientRect();
        if (now.dist > 0 && this.pinch.dist > 0) this.zoom(now.dist / this.pinch.dist, now.cx - rect.left, now.cy - rect.top);
        this.pan(now.cx - this.pinch.cx, now.cy - this.pinch.cy);
        this.pinch = now;
      }
    });
    const end = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
      if (this.pointers.size === 1) {
        // Continue with the remaining finger without a jump.
        this.dragMode = this.mode === '3d' ? 'orbit' : 'pan';
      }
    };
    this.on('pointerup', end);
    this.on('pointercancel', end);
    this.on('lostpointercapture', end);
    this.on('contextmenu', (e) => e.preventDefault());
    this.on('dblclick', () => this.fitTo());
    this.on('wheel', (e) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      const delta = e.deltaY * unit;
      const factor = Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.0015));
      const rect = canvas.getBoundingClientRect();
      this.zoom(factor, e.clientX - rect.left, e.clientY - rect.top);
    }, { passive: false });
    this.on('keydown', (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const step = 40;
      let handled = true;
      switch (e.key) {
        case 'ArrowLeft':
          if (this.mode === '3d' && !e.shiftKey) this.orbit(5, 0); else this.pan(step, 0);
          break;
        case 'ArrowRight':
          if (this.mode === '3d' && !e.shiftKey) this.orbit(-5, 0); else this.pan(-step, 0);
          break;
        case 'ArrowUp':
          if (this.mode === '3d' && !e.shiftKey) this.orbit(0, -5); else this.pan(0, step);
          break;
        case 'ArrowDown':
          if (this.mode === '3d' && !e.shiftKey) this.orbit(0, 5); else this.pan(0, -step);
          break;
        case '+': case '=':
          this.zoom(1.25);
          break;
        case '-': case '_':
          this.zoom(0.8);
          break;
        case '0': case 'f': case 'F':
          this.fitTo();
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    });
  }

  private pinchInfo(): { dist: number; cx: number; cy: number } {
    const [a, b] = [...this.pointers.values()];
    return { dist: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
  }
}
