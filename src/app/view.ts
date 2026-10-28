import type { Segment, TurtleState } from '../lang';
import { h } from './dom';
import { onThemeChange } from './theme';

export interface Scene {
  segments: Segment[];
  turtle: TurtleState | null;
  /** Wzór wyzwania rysowany pod rysunkiem użytkownika. */
  ghost: Segment[] | null;
}

export interface Bounds {
  min: [number, number, number];
  max: [number, number, number];
}

export function segmentBounds(segments: Segment[], extra?: [number, number, number][]): Bounds | null {
  let any = false;
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  const add = (p: [number, number, number]) => {
    any = true;
    for (let i = 0; i < 3; i++) {
      if (p[i] < min[i]) min[i] = p[i];
      if (p[i] > max[i]) max[i] = p[i];
    }
  };
  for (const s of segments) {
    add(s.from);
    add(s.to);
  }
  if (extra) extra.forEach(add);
  return any ? { min, max } : null;
}

/** Wspólna część widoków: płótno, rozmiar, rysowanie na żądanie, eksport PNG. */
export abstract class CanvasView {
  readonly el: HTMLElement;
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected w = 0;
  protected h = 0;
  protected dpr = 1;
  protected scene: Scene = { segments: [], turtle: null, ghost: null };
  /** Użytkownik nie przesuwał widoku ręcznie – wolno go automatycznie dopasować. */
  autoFit = true;
  /** Miniatura: bez siatki, osi, początku układu i żółwia, bez interakcji. */
  minimal = false;
  private raf = 0;
  /** Rysunek, do którego dopasowujemy widok (pełny wynik programu, także w trakcie animacji). */
  protected fitTarget: Segment[] | null = null;
  private pendingFit = false;
  /** Wywoływane, gdy użytkownik zmienia widok ręcznie. */
  onUserNavigate: (() => void) | null = null;

  constructor(label: string) {
    this.canvas = h('canvas', { 'aria-hidden': 'true' });
    this.ctx = this.canvas.getContext('2d', { alpha: false })!;
    this.el = h('div', { class: 'view', tabindex: '0', role: 'group', 'aria-label': label }, this.canvas);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(this.el);
    this.offTheme = onThemeChange(() => this.requestDraw());
  }

  private observer: ResizeObserver;
  private offTheme: () => void;

  /** Zwalnia obserwatory (miniatury znikają razem ze stroną). */
  destroy(): void {
    this.observer.disconnect();
    this.offTheme();
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  protected resize(): void {
    const rect = this.el.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const w = Math.max(0, Math.round(rect.width));
    const hh = Math.max(0, Math.round(rect.height));
    if (w === this.w && hh === this.h && dpr === this.dpr) return;
    const first = this.w === 0 || this.h === 0;
    this.w = w;
    this.h = hh;
    this.dpr = dpr;
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(hh * dpr));
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${hh}px`;
    if (w > 0 && hh > 0) {
      if (this.pendingFit) {
        this.pendingFit = false;
        this.fit();
      } else this.onResized(first);
      this.drawNow();
    }
  }

  protected onResized(_first: boolean): void {}

  setScene(scene: Scene): void {
    this.scene = scene;
    this.requestDraw();
  }

  requestDraw(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.drawNow();
    });
  }

  /** Rysuje natychmiast (np. przed zrobieniem zrzutu). */
  drawNow(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    if (this.w === 0 || this.h === 0) {
      this.resize();
      if (this.w === 0 || this.h === 0) return;
    }
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.draw(ctx, this.w, this.h);
  }

  protected abstract draw(ctx: CanvasRenderingContext2D, w: number, h: number): void;
  /** Dopasowuje widok do rysunku (można podać pełny wynik programu, zanim zostanie narysowany). */
  fit(target?: Segment[]): void {
    if (target) this.fitTarget = target;
    if (this.w === 0 || this.h === 0) {
      this.pendingFit = true;
      return;
    }
    this.doFit(this.fitTarget ?? this.scene.segments, !this.fitTarget);
  }
  protected abstract doFit(segments: Segment[], includeTurtle: boolean): void;
  abstract resetView(): void;
  abstract zoomBy(factor: number): void;
  abstract describe(): string;

  protected userNavigated(): void {
    this.autoFit = false;
    this.onUserNavigate?.();
  }

  /** PNG tego, co widać, w podwójnej rozdzielczości. */
  toBlob(): Promise<Blob> {
    const ratio = Math.max(2, this.dpr);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(this.w * ratio));
    canvas.height = Math.max(1, Math.round(this.h * ratio));
    const ctx = canvas.getContext('2d', { alpha: false })!;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw(ctx, this.w, this.h);
    return new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Nie udało się utworzyć PNG'))), 'image/png');
    });
  }
}

/** Najbliższa „ładna” wartość 1/2/5 × 10^k nie mniejsza niż x. */
export function niceCeil(x: number): number {
  if (!(x > 0)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(x)));
  const m = x / p;
  const n = m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10;
  return n * p;
}

export function formatNumber(v: number): string {
  if (Math.abs(v) >= 1e6 || (Math.abs(v) < 1e-3 && v !== 0)) return v.toExponential(0);
  const s = Number(v.toPrecision(6)).toString();
  return s;
}

/** Wspólne przypinanie gestów: przeciąganie, szczypanie, kółko, klawisze. */
export interface Gestures {
  drag(dx: number, dy: number, e: PointerEvent): void;
  pinch(factor: number, cx: number, cy: number, dx: number, dy: number): void;
  wheel(deltaY: number, cx: number, cy: number): void;
  key(e: KeyboardEvent): boolean;
}

export function attachGestures(el: HTMLElement, g: Gestures): void {
  const pointers = new Map<number, { x: number; y: number }>();
  let lastDist = 0;
  let lastMid = { x: 0, y: 0 };
  el.style.touchAction = 'none';

  const local = (e: { clientX: number; clientY: number }) => {
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button > 2) return;
    el.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, local(e));
    el.classList.add('dragging');
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      lastDist = Math.hypot(a.x - b.x, a.y - b.y);
      lastMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
  });
  el.addEventListener('pointermove', (e) => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const cur = local(e);
    pointers.set(e.pointerId, cur);
    if (pointers.size === 1) {
      g.drag(cur.x - prev.x, cur.y - prev.y, e);
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      if (lastDist > 0 && dist > 0) {
        g.pinch(dist / lastDist, mid.x, mid.y, mid.x - lastMid.x, mid.y - lastMid.y);
      }
      lastDist = dist;
      lastMid = mid;
    }
  });
  const end = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) el.classList.remove('dragging');
    if (pointers.size === 1) {
      lastDist = 0;
    }
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.addEventListener('lostpointercapture', end);
  el.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const p = local(e);
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      g.wheel(e.deltaY * unit, p.x, p.y);
    },
    { passive: false },
  );
  el.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (g.key(e)) e.preventDefault();
  });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}
