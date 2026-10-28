import type { Mode } from '../../lang/ast';
import type { Pose, Segment } from '../../lang/turtle';
import { currentTheme, onThemeChange, type ResolvedTheme } from '../theme';
import { h } from '../dom';
import { prefersReducedMotion } from '../dom';

/** To, co widok ma narysować w danej chwili. */
export interface Scene {
  segments: Segment[];
  /** Ile pierwszych odcinków rysujemy w całości. */
  count: number;
  /** Odcinek rysowany częściowo (animacja). */
  partial: Segment | null;
  pose: Pose;
  showTurtle: boolean;
  /** Wzór wyzwania rysowany w tle. */
  ghost: Segment[] | null;
}

export interface Palette {
  theme: ResolvedTheme;
  bg: string;
  gridMinor: string;
  gridMajor: string;
  axis: string;
  axisX: string;
  axisY: string;
  axisZ: string;
  label: string;
  ink: string;
  paper: string;
  ghost: string;
  origin: string;
}

export const LIGHT: Palette = {
  theme: 'light',
  bg: '#fffefa',
  gridMinor: 'rgba(60,70,60,0.07)',
  gridMajor: 'rgba(60,70,60,0.15)',
  axis: 'rgba(40,50,50,0.45)',
  axisX: '#d6453d',
  axisY: '#2f9e5a',
  axisZ: '#2f6fd0',
  label: '#66767a',
  ink: '#1f2a2e',
  paper: '#fffefa',
  ghost: 'rgba(120,100,60,0.55)',
  origin: '#1f2a2e',
};

export const DARK: Palette = {
  theme: 'dark',
  bg: '#10161a',
  gridMinor: 'rgba(200,220,220,0.06)',
  gridMajor: 'rgba(200,220,220,0.14)',
  axis: 'rgba(220,235,235,0.45)',
  axisX: '#ef7d74',
  axisY: '#58c785',
  axisZ: '#6ea5ff',
  label: '#8fa1a6',
  ink: '#e8eeee',
  paper: '#10161a',
  ghost: 'rgba(230,200,140,0.5)',
  origin: '#e8eeee',
};

export const EXPORT_PALETTE: Palette = { ...LIGHT, bg: '#ffffff', paper: '#ffffff' };

export function paletteFor(theme: ResolvedTheme): Palette {
  return theme === 'dark' ? DARK : LIGHT;
}

// ---------------------------------------------------------------------------
// Kolory

function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]: [number, number, number]): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

const adaptCache = new Map<string, string>();

/** Na ciemnym tle rozjaśnia zbyt ciemne kolory pióra (tylko wyświetlanie; dane zostają bez zmian). */
export function inkFor(hex: string, pal: Palette): string {
  if (pal.theme !== 'dark') return hex;
  const hit = adaptCache.get(hex);
  if (hit) return hit;
  const rgb = parseHex(hex);
  const bgL = luminance(parseHex('#10161a'));
  const target = 4.6;
  let out = hex;
  let t = 0;
  for (; t <= 1; t += 0.05) {
    const m: [number, number, number] = [
      Math.round(rgb[0] + (255 - rgb[0]) * t),
      Math.round(rgb[1] + (255 - rgb[1]) * t),
      Math.round(rgb[2] + (255 - rgb[2]) * t),
    ];
    if ((luminance(m) + 0.05) / (bgL + 0.05) >= target) {
      out = '#' + m.map((v) => v.toString(16).padStart(2, '0')).join('');
      break;
    }
  }
  adaptCache.set(hex, out);
  return out;
}

// ---------------------------------------------------------------------------
// Liczby

/** Najbliższy „ładny” krok (1, 2, 5 × 10^k) nie mniejszy niż `raw`. */
export function niceStep(raw: number): number {
  if (!(raw > 0) || !Number.isFinite(raw)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  const n = m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10;
  return n * p;
}

export interface Bounds {
  minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number;
}

export function emptyBounds(): Bounds {
  return { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity };
}

export function extend(b: Bounds, x: number, y: number, z: number): void {
  if (x < b.minX) b.minX = x;
  if (x > b.maxX) b.maxX = x;
  if (y < b.minY) b.minY = y;
  if (y > b.maxY) b.maxY = y;
  if (z < b.minZ) b.minZ = z;
  if (z > b.maxZ) b.maxZ = z;
}

export function isEmptyBounds(b: Bounds): boolean {
  return b.minX > b.maxX;
}

export function sceneBounds(scene: Scene, includeTurtle: boolean): Bounds {
  const b = emptyBounds();
  const n = Math.min(scene.count, scene.segments.length);
  for (let i = 0; i < n; i++) {
    const s = scene.segments[i]!;
    extend(b, s.from[0], s.from[1], s.from[2]);
    extend(b, s.to[0], s.to[1], s.to[2]);
  }
  if (scene.partial) {
    extend(b, scene.partial.from[0], scene.partial.from[1], scene.partial.from[2]);
    extend(b, scene.partial.to[0], scene.partial.to[1], scene.partial.to[2]);
  }
  if (scene.ghost) {
    for (const s of scene.ghost) {
      extend(b, s.from[0], s.from[1], s.from[2]);
      extend(b, s.to[0], s.to[1], s.to[2]);
    }
  }
  if (includeTurtle && scene.showTurtle) extend(b, scene.pose.pos[0], scene.pose.pos[1], scene.pose.pos[2]);
  return b;
}

export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

// ---------------------------------------------------------------------------
// Widok na kanwie

export interface View {
  readonly el: HTMLElement;
  readonly mode: Mode;
  autoFit: boolean;
  topInset: number;
  setScene(scene: Scene): void;
  /** Dopasowuje kamerę do rysunku. */
  fit(animate?: boolean): void;
  resetView(): void;
  /** Widoki ustalone (tylko 3D): z góry, z przodu, z boku. */
  preset?(kind: 'top' | 'front' | 'side'): void;
  zoomBy(factor: number): void;
  exportPng(maxSide?: number): Promise<Blob>;
  /** Wywoływane, gdy użytkownik sam zmienia kamerę. */
  onUserCamera: (() => void) | null;
  /** Odświeża natychmiast i zwraca, gdy obraz jest namalowany. */
  paintNow(): void;
  /** Krótki opis dla czytników ekranu. */
  setDescription(text: string): void;
  dispose(): void;
}

export interface DrawOpts {
  palette: Palette;
  exporting: boolean;
}

function emptyScene(): Scene {
  return {
    segments: [],
    count: 0,
    partial: null,
    pose: { pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1], penDown: true, color: '#16866a', width: 3 },
    showTurtle: true,
    ghost: null,
  };
}

/** Wspólna część widoków: kanwa, rozmiar, pętla rysowania, wskaźniki, animacja kamery. */
export abstract class CanvasView implements View {
  readonly el: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected width = 300;
  protected height = 200;
  protected dpr = 1;
  protected scene: Scene = emptyScene();
  autoFit = true;
  /** Pas u góry zasłonięty przez pływający przybornik (piksele) — dopasowanie go omija. */
  topInset = 0;
  onUserCamera: (() => void) | null = null;
  private raf = 0;
  private ro: ResizeObserver | null = null;
  private offTheme: () => void;
  protected palette: Palette;
  private pointers = new Map<number, { x: number; y: number }>();
  private lastPinch: { dist: number; cx: number; cy: number } | null = null;
  private anim: { t0: number; dur: number; step: (k: number) => void; done?: () => void } | null = null;
  private descEl: HTMLElement;

  constructor(readonly mode: Mode, hint: string) {
    this.canvas = h('canvas', {
      class: 'view-canvas',
      tabindex: '0',
      role: 'img',
      'aria-label': `Rysunek żółwia, tryb ${mode.toUpperCase()}`,
    });
    this.descEl = h('span', { class: 'sr-only', id: `view-desc-${mode}` }, hint);
    this.canvas.setAttribute('aria-describedby', this.descEl.id);
    this.el = h('div', { class: `view view-${mode}` }, this.canvas, this.descEl);
    this.ctx = this.canvas.getContext('2d')!;
    this.palette = paletteFor(currentTheme());
    this.offTheme = onThemeChange((t) => {
      this.palette = paletteFor(t);
      this.invalidate();
    });
    this.ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.resize()) : null;
    this.ro?.observe(this.el);
    this.bindInput();
    queueMicrotask(() => this.resize());
  }

  setDescription(text: string): void {
    this.canvas.setAttribute('aria-label', text);
  }

  // ----- rozmiar i rysowanie --------------------------------------------

  /**
   * Odczytuje rozmiar kontenera. Ukryty kontener (np. pracownia na innej stronie) zwraca 0×0 —
   * wtedy nic nie zmieniamy. Zwraca true, gdy rozmiar się zmienił.
   */
  protected syncSize(): boolean {
    const r = this.el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const w = Math.max(40, Math.round(r.width));
    const hgt = Math.max(40, Math.round(r.height));
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    if (w === this.width && hgt === this.height && dpr === this.dpr && this.canvas.width) return false;
    this.width = w;
    this.height = hgt;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(hgt * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${hgt}px`;
    return true;
  }

  protected resize(): void {
    if (!this.syncSize()) return;
    this.onResized();
    this.invalidate();
  }

  /** Po zmianie rozmiaru: dopóki użytkownik nie ruszył kamery, rysunek pozostaje dopasowany. */
  protected onResized(): void {
    if (this.autoFit) this.fit(false);
  }

  invalidate(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame((t) => {
      this.raf = 0;
      this.frame(t);
    });
  }

  private frame(now: number): void {
    if (this.anim) {
      const a = this.anim;
      const k = clamp((now - a.t0) / a.dur, 0, 1);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      a.step(e);
      if (k >= 1) {
        this.anim = null;
        a.done?.();
      } else this.invalidate();
    }
    this.paintNow();
  }

  paintNow(): void {
    if (this.syncSize()) this.onResized();
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.draw(ctx, this.width, this.height, { palette: this.palette, exporting: false });
  }

  protected abstract draw(ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts): void;

  /** Animuje parametry kamery: `step(k)` dostaje k ∈ [0,1] (po wygładzeniu). */
  protected animate(dur: number, step: (k: number) => void, done?: () => void): void {
    if (prefersReducedMotion() || dur <= 0) {
      step(1);
      done?.();
      this.anim = null;
      this.invalidate();
      return;
    }
    this.anim = { t0: performance.now(), dur, step, done };
    this.invalidate();
  }

  protected stopAnimation(): void {
    this.anim = null;
  }

  setScene(scene: Scene): void {
    this.scene = scene;
    this.afterScene();
    this.invalidate();
  }

  protected afterScene(): void {}

  abstract fit(animate?: boolean): void;
  abstract resetView(): void;
  abstract zoomBy(factor: number): void;
  abstract exportPng(maxSide?: number): Promise<Blob>;

  // ----- wejście --------------------------------------------------------

  protected abstract dragBy(dx: number, dy: number, secondary: boolean): void;
  protected abstract wheelZoom(factor: number, x: number, y: number): void;
  protected abstract pinchBy(factor: number, cx: number, cy: number, dx: number, dy: number): void;
  protected abstract keyCamera(key: string, shift: boolean): boolean;

  protected userCamera(): void {
    this.stopAnimation();
    if (this.autoFit) this.autoFit = false;
    this.onUserCamera?.();
  }

  private bindInput(): void {
    const c = this.canvas;
    let secondary = false;
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      secondary = e.button === 1 || e.button === 2 || e.shiftKey || e.ctrlKey || e.metaKey;
      this.lastPinch = null;
      c.classList.add('grabbing');
    });
    c.addEventListener('pointermove', (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (this.pointers.size === 1) {
        if (dx === 0 && dy === 0) return;
        this.userCamera();
        this.dragBy(dx, dy, secondary);
      } else if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()] as [{ x: number; y: number }, { x: number; y: number }];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const rect = c.getBoundingClientRect();
        const cx = (a.x + b.x) / 2 - rect.left;
        const cy = (a.y + b.y) / 2 - rect.top;
        if (this.lastPinch && this.lastPinch.dist > 0) {
          this.userCamera();
          this.pinchBy(dist / this.lastPinch.dist, cx, cy, cx - this.lastPinch.cx, cy - this.lastPinch.cy);
        }
        this.lastPinch = { dist, cx, cy };
      }
    });
    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      this.lastPinch = null;
      if (this.pointers.size === 0) c.classList.remove('grabbing');
      if (c.hasPointerCapture(e.pointerId)) c.releasePointerCapture(e.pointerId);
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    c.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const rect = c.getBoundingClientRect();
        let dy = e.deltaY;
        if (e.deltaMode === 1) dy *= 16;
        else if (e.deltaMode === 2) dy *= 300;
        const k = e.ctrlKey ? 0.01 : 0.0016;
        this.userCamera();
        this.wheelZoom(Math.exp(-dy * k), e.clientX - rect.left, e.clientY - rect.top);
      },
      { passive: false },
    );
    c.addEventListener('dblclick', () => {
      this.autoFit = true;
      this.fit(true);
    });
    c.addEventListener('keydown', (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === '0' || e.key === 'Home') {
        e.preventDefault();
        this.autoFit = true;
        this.fit(true);
        return;
      }
      if (this.keyCamera(e.key, e.shiftKey)) {
        e.preventDefault();
        this.userCamera();
        this.invalidate();
      }
    });
  }

  dispose(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    this.offTheme();
  }
}

/** Zapisuje kanwę jako PNG. */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Nie udało się utworzyć obrazu PNG.'))), 'image/png');
  });
}
