// 2D canvas view: pan, zoom, fit, origin, turtle marker.
import type { Segment, Turtle } from "../lang/interp";

export interface Bounds {
  min: [number, number, number];
  max: [number, number, number];
}

export function boundsOf(segs: Segment[], extra: [number, number, number][] = []): Bounds | null {
  const pts = [...extra];
  for (const s of segs) pts.push(s.from, s.to);
  if (!pts.length) return null;
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (const p of pts)
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i]!, p[i]!);
      max[i] = Math.max(max[i]!, p[i]!);
    }
  return { min, max };
}

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export class View2D {
  canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  /** world point at the canvas centre */
  cx = 0;
  cy = 60;
  scale = 1.6;
  segments: Segment[] = [];
  ghost: Segment[] = [];
  turtle: Turtle | null = null;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinch: { d: number; scale: number } | null = null;
  private queued = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    new ResizeObserver(() => this.draw()).observe(canvas);
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      this.zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    canvas.addEventListener("pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinch = { d: Math.hypot(a!.x - b!.x, a!.y - b!.y), scale: this.scale };
      }
    });
    canvas.addEventListener("pointermove", (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (this.pointers.size === 1) {
        this.cx -= dx / this.scale;
        this.cy += dy / this.scale;
        this.request();
      } else if (this.pinch && this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
        const r = canvas.getBoundingClientRect();
        const target = this.pinch.scale * (d / this.pinch.d);
        this.zoomAt(target / this.scale, (a!.x + b!.x) / 2 - r.left, (a!.y + b!.y) / 2 - r.top);
      }
    });
    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
    };
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("keydown", (e) => {
      const step = 40 / this.scale;
      const k = e.key;
      if (k === "ArrowLeft") this.cx -= step;
      else if (k === "ArrowRight") this.cx += step;
      else if (k === "ArrowUp") this.cy += step;
      else if (k === "ArrowDown") this.cy -= step;
      else if (k === "+" || k === "=") this.zoom(1.25);
      else if (k === "-" || k === "_") this.zoom(0.8);
      else if (k === "0" || k === "f") this.fit();
      else return;
      e.preventDefault();
      this.request();
    });
  }

  zoom(f: number) {
    const r = this.canvas.getBoundingClientRect();
    this.zoomAt(f, r.width / 2, r.height / 2);
  }

  private zoomAt(f: number, sx: number, sy: number) {
    const r = this.canvas.getBoundingClientRect();
    const ns = Math.min(200, Math.max(0.002, this.scale * f));
    const wx = this.cx + (sx - r.width / 2) / this.scale;
    const wy = this.cy - (sy - r.height / 2) / this.scale;
    this.scale = ns;
    this.cx = wx - (sx - r.width / 2) / ns;
    this.cy = wy + (sy - r.height / 2) / ns;
    this.request();
  }

  fit() {
    const extra: [number, number, number][] = [];
    if (!this.segments.length && !this.ghost.length) extra.push([0, 0, 0]);
    if (this.turtle) extra.push(this.turtle.pos);
    const b = boundsOf([...this.segments, ...this.ghost], extra)!;
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(b.max[0] - b.min[0], this.segments.length ? 40 : 240);
    const h = Math.max(b.max[1] - b.min[1], this.segments.length ? 40 : 240);
    const pad = 36;
    this.scale = Math.min(200, Math.max(0.002, Math.min((r.width - pad * 2) / w, (r.height - pad * 2) / h)));
    if (!Number.isFinite(this.scale) || this.scale <= 0) this.scale = 1;
    this.cx = (b.min[0] + b.max[0]) / 2;
    this.cy = (b.min[1] + b.max[1]) / 2;
    this.draw();
  }

  request() {
    if (this.queued) return;
    this.queued = true;
    requestAnimationFrame(() => {
      this.queued = false;
      this.draw();
    });
  }

  draw() {
    const c = this.canvas;
    const dpr = window.devicePixelRatio || 1;
    const W = c.clientWidth;
    const H = c.clientHeight;
    if (!W || !H) return;
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    const g = this.ctx;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = css("--canvas");
    g.fillRect(0, 0, W, H);
    const sx = (x: number) => W / 2 + (x - this.cx) * this.scale;
    const sy = (y: number) => H / 2 - (y - this.cy) * this.scale;

    // grid
    const target = 60 / this.scale;
    const pow = Math.pow(10, Math.floor(Math.log10(target)));
    const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= target) ?? pow * 10;
    g.strokeStyle = css("--grid");
    g.lineWidth = 1;
    g.beginPath();
    const x0 = Math.floor((this.cx - W / 2 / this.scale) / step) * step;
    for (let x = x0; sx(x) <= W; x += step) {
      g.moveTo(Math.round(sx(x)) + 0.5, 0);
      g.lineTo(Math.round(sx(x)) + 0.5, H);
    }
    const y0 = Math.floor((this.cy - H / 2 / this.scale) / step) * step;
    for (let y = y0; sy(y) >= 0; y += step) {
      g.moveTo(0, Math.round(sy(y)) + 0.5);
      g.lineTo(W, Math.round(sy(y)) + 0.5);
    }
    g.stroke();
    // origin axes
    g.strokeStyle = css("--axis");
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(0, sy(0));
    g.lineTo(W, sy(0));
    g.moveTo(sx(0), 0);
    g.lineTo(sx(0), H);
    g.stroke();
    g.fillStyle = css("--axis");
    g.beginPath();
    g.arc(sx(0), sy(0), 3.5, 0, Math.PI * 2);
    g.fill();
    g.font = "11px system-ui, sans-serif";
    g.fillText("0", sx(0) + 6, sy(0) + 14);
    g.fillText("x", W - 14, sy(0) - 6);
    g.fillText("y", sx(0) + 6, 14);
    g.fillStyle = css("--muted");
    g.fillText(`siatka: ${step}`, 8, H - 8);

    g.lineCap = "round";
    g.lineJoin = "round";
    if (this.ghost.length) {
      g.strokeStyle = css("--ghost");
      g.lineWidth = 9;
      g.beginPath();
      for (const s of this.ghost) {
        g.moveTo(sx(s.from[0]), sy(s.from[1]));
        g.lineTo(sx(s.to[0]), sy(s.to[1]));
      }
      g.stroke();
    }
    let key = "";
    for (const s of this.segments) {
      const k = s.color + s.width;
      if (k !== key) {
        if (key) g.stroke();
        key = k;
        g.strokeStyle = s.color;
        g.lineWidth = s.width;
        g.beginPath();
      }
      g.moveTo(sx(s.from[0]), sy(s.from[1]));
      g.lineTo(sx(s.to[0]), sy(s.to[1]));
    }
    if (key) g.stroke();

    const t = this.turtle;
    if (t) {
      const px = sx(t.pos[0]);
      const py = sy(t.pos[1]);
      // heading projected onto the plane
      let hx = t.h[0];
      let hy = t.h[1];
      const l = Math.hypot(hx, hy) || 1;
      hx /= l;
      hy /= l;
      const ang = Math.atan2(-hy, hx);
      g.save();
      g.translate(px, py);
      g.rotate(ang);
      g.beginPath();
      g.moveTo(13, 0);
      g.lineTo(-8, 8);
      g.lineTo(-4, 0);
      g.lineTo(-8, -8);
      g.closePath();
      g.fillStyle = t.pen ? css("--turtle") : css("--turtle-up");
      g.strokeStyle = css("--canvas");
      g.lineWidth = 1.5;
      g.fill();
      g.stroke();
      g.restore();
    }
  }

  toBlob(): Promise<Blob | null> {
    this.draw();
    return new Promise((res) => this.canvas.toBlob(res, "image/png"));
  }
}
