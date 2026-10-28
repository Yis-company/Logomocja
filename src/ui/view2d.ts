import { h, iconButton, ICONS } from './dom';
import { boundsOf, fmtNum, niceStep, type Scene } from './geom';
import { paper } from './theme';
import type { DrawingView } from './view';

export class View2D implements DrawingView {
  readonly el: HTMLElement;
  autoFit = true;
  readonly mode = '2d' as const;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scene: Scene = { segments: [], pose: null };
  private cx = 0;
  private cy = 0;
  private scale = 1;
  private W = 300;
  private H = 300;
  private dpr = 1;
  private raf = 0;
  private fitted = false;
  private ptrs = new Map<number, { x: number; y: number }>();
  private pinch = 0;

  constructor() {
    this.canvas = h('canvas', {
      class: 'view-canvas', tabindex: 0, role: 'img',
      'aria-label': 'Rysunek żółwia w trybie 2D. Strzałki przesuwają widok, plus i minus zmieniają powiększenie, zero dopasowuje rysunek.',
    });
    this.ctx = this.canvas.getContext('2d')!;
    const tools = h('div', { class: 'view-tools', role: 'group', 'aria-label': 'Narzędzia widoku 2D' },
      iconButton('Przybliż', ICONS.plus, () => this.zoomBy(1.25)),
      iconButton('Oddal', ICONS.minus, () => this.zoomBy(0.8)),
      iconButton('Dopasuj rysunek do okna (0)', ICONS.fit, () => { this.autoFit = false; this.fit(); }),
    );
    this.el = h('div', { class: 'view view2d' }, this.canvas, tools);
    new ResizeObserver(() => this.resize()).observe(this.el);
    this.bind();
    this.resize();
  }

  setScene(scene: Scene): void {
    this.scene = scene;
    if (this.autoFit) this.fit();
    this.invalidate();
  }

  invalidate(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => { this.raf = 0; this.draw(); });
  }

  private resize(): void {
    const r = this.el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const first = !this.fitted;
    this.W = r.width;
    this.H = r.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
    if (first) { this.fitted = true; this.fit(); } else this.invalidate();
  }

  /** Visible again after being hidden: re-measure. */
  show(): void { this.resize(); this.invalidate(); }

  fit(): void {
    const b = boundsOf(this.scene.segments);
    const bw = Math.max(b.max[0] - b.min[0], 20);
    const bh = Math.max(b.max[1] - b.min[1], 20);
    const m = 36;
    this.scale = Math.min((this.W - 2 * m) / bw, (this.H - 2 * m) / bh, 40);
    this.cx = (b.min[0] + b.max[0]) / 2;
    this.cy = (b.min[1] + b.max[1]) / 2;
    if (!this.scene.segments.length) { this.cx = 0; this.cy = 0; this.scale = Math.min(this.W, this.H) / 440; }
    this.invalidate();
  }

  reset(): void { this.fit(); }

  zoomBy(f: number, px = this.W / 2, py = this.H / 2): void {
    this.autoFit = false;
    const wx = this.cx + (px - this.W / 2) / this.scale;
    const wy = this.cy - (py - this.H / 2) / this.scale;
    this.scale = Math.min(Math.max(this.scale * f, 0.0005), 5000);
    this.cx = wx - (px - this.W / 2) / this.scale;
    this.cy = wy + (py - this.H / 2) / this.scale;
    this.invalidate();
  }

  private panPx(dx: number, dy: number): void {
    this.autoFit = false;
    this.cx -= dx / this.scale;
    this.cy += dy / this.scale;
    this.invalidate();
  }

  private bind(): void {
    const c = this.canvas;
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = c.getBoundingClientRect();
      this.zoomBy(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.pinch = this.pinchDist();
      c.classList.add('grabbing');
    });
    c.addEventListener('pointermove', (e) => {
      const p = this.ptrs.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      const before = this.pinchCenter();
      p.x = e.clientX; p.y = e.clientY;
      if (this.ptrs.size === 1) this.panPx(dx, dy);
      else if (this.ptrs.size === 2) {
        const d = this.pinchDist();
        const ctr = this.pinchCenter();
        const r = c.getBoundingClientRect();
        if (this.pinch > 0 && d > 0) this.zoomBy(d / this.pinch, ctr.x - r.left, ctr.y - r.top);
        this.panPx(ctr.x - before.x, ctr.y - before.y);
        this.pinch = d;
      }
    });
    const up = (e: PointerEvent) => {
      this.ptrs.delete(e.pointerId);
      this.pinch = this.pinchDist();
      if (!this.ptrs.size) c.classList.remove('grabbing');
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('dblclick', () => { this.autoFit = false; this.fit(); });
    c.addEventListener('keydown', (e) => {
      const step = 40;
      switch (e.key) {
        case 'ArrowLeft': this.panPx(step, 0); break;
        case 'ArrowRight': this.panPx(-step, 0); break;
        case 'ArrowUp': this.panPx(0, step); break;
        case 'ArrowDown': this.panPx(0, -step); break;
        case '+': case '=': this.zoomBy(1.25); break;
        case '-': case '_': this.zoomBy(0.8); break;
        case '0': case 'Home': this.autoFit = false; this.fit(); break;
        default: return;
      }
      e.preventDefault();
    });
  }

  private pinchDist(): number {
    const [a, b] = [...this.ptrs.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  }
  private pinchCenter(): { x: number; y: number } {
    const v = [...this.ptrs.values()];
    if (v.length < 2) return v[0] ?? { x: 0, y: 0 };
    return { x: (v[0].x + v[1].x) / 2, y: (v[0].y + v[1].y) / 2 };
  }

  private draw(): void {
    const { ctx, W, H } = this;
    const col = paper();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.paint(ctx, W, H, this.cx, this.cy, this.scale, col, true);
  }

  private paint(ctx: CanvasRenderingContext2D, W: number, H: number, cx: number, cy: number, scale: number, col: ReturnType<typeof paper>, chrome: boolean): void {
    ctx.fillStyle = col.bg;
    ctx.fillRect(0, 0, W, H);
    const sx = (x: number) => W / 2 + (x - cx) * scale;
    const sy = (y: number) => H / 2 - (y - cy) * scale;
    if (chrome) {
      const step = niceStep(scale, 48);
      const x0 = cx - W / 2 / scale, x1 = cx + W / 2 / scale;
      const y0 = cy - H / 2 / scale, y1 = cy + H / 2 / scale;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = col.grid;
      for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) { const px = Math.round(sx(x)) + 0.5; ctx.moveTo(px, 0); ctx.lineTo(px, H); }
      for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) { const py = Math.round(sy(y)) + 0.5; ctx.moveTo(0, py); ctx.lineTo(W, py); }
      ctx.stroke();
      // axes
      ctx.strokeStyle = col.axis;
      ctx.beginPath();
      const ax = Math.round(sx(0)) + 0.5, ay = Math.round(sy(0)) + 0.5;
      ctx.moveTo(0, ay); ctx.lineTo(W, ay);
      ctx.moveTo(ax, 0); ctx.lineTo(ax, H);
      ctx.stroke();
      // labels
      ctx.fillStyle = col.text;
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      const ly = Math.min(Math.max(ay + 4, 2), H - 14);
      for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) {
        if (Math.abs(x) < step / 2) continue;
        ctx.fillText(fmtNum(x), sx(x), ly);
      }
      ctx.textAlign = 'left';
      const lx = Math.min(Math.max(ax + 5, 2), W - 40);
      ctx.textBaseline = 'middle';
      for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) {
        if (Math.abs(y) < step / 2) continue;
        ctx.fillText(fmtNum(y), lx, sy(y));
      }
      // origin marker
      ctx.fillStyle = col.axis;
      ctx.beginPath();
      ctx.arc(sx(0), sy(0), 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.textBaseline = 'top';
      ctx.fillStyle = col.text;
      ctx.fillText('0, 0', sx(0) + 7, sy(0) + 6);
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let curKey = '';
    let open = false;
    for (const s of this.scene.segments) {
      const key = s.color + s.width;
      if (key !== curKey) {
        if (open) ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        curKey = key;
        open = true;
      }
      ctx.moveTo(sx(s.from[0]), sy(s.from[1]));
      ctx.lineTo(sx(s.to[0]), sy(s.to[1]));
    }
    if (open) ctx.stroke();
    const pose = this.scene.pose;
    if (chrome && pose) {
      const px = sx(pose.pos[0]), py = sy(pose.pos[1]);
      const dx = pose.h[0], dy = -pose.h[1];
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const nx = -uy, ny = ux;
      ctx.beginPath();
      ctx.moveTo(px + ux * 15, py + uy * 15);
      ctx.lineTo(px - ux * 9 + nx * 9, py - uy * 9 + ny * 9);
      ctx.lineTo(px - ux * 4, py - uy * 4);
      ctx.lineTo(px - ux * 9 - nx * 9, py - uy * 9 - ny * 9);
      ctx.closePath();
      ctx.fillStyle = pose.pen ? col.marker : 'rgba(255,255,255,0.7)';
      ctx.strokeStyle = col.marker;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }
  }

  async toPNG(): Promise<Blob | null> {
    const b = boundsOf(this.scene.segments);
    const bw = Math.max(b.max[0] - b.min[0], 20);
    const bh = Math.max(b.max[1] - b.min[1], 20);
    const W = 1200;
    const H = Math.round(Math.min(1600, Math.max(500, (W * bh) / bw)));
    const m = 60;
    const scale = Math.min((W - 2 * m) / bw, (H - 2 * m) / bh);
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const col = paper();
    this.paint(ctx, W, H, (b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, scale, col, false);
    return new Promise((res) => cv.toBlob((bl) => res(bl), 'image/png'));
  }

  describe(n: number): void {
    this.canvas.setAttribute('aria-label', `Rysunek żółwia w trybie 2D, odcinków: ${n}. Strzałki przesuwają widok, plus i minus zmieniają powiększenie, zero dopasowuje rysunek.`);
  }
}
