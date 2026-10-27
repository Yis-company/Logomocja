import type { Frame } from "../ui/player";
import { cssVar, type DrawingView } from "./view";

interface Theme {
  bg: string;
  minor: string;
  major: string;
  axis: string;
  outline: string;
}

const MIN_SCALE = 0.002;
const MAX_SCALE = 80;

/** Flat drawing on a 2D canvas with pan (drag) and zoom (wheel / pinch). */
export class View2D implements DrawingView {
  readonly element: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly ro: ResizeObserver;
  private w = 1;
  private h = 1;
  private dpr = 1;
  private cx = 0;
  private cy = 0;
  private scale = 1;
  private theme!: Theme;
  private last: Frame | null = null;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private pinchDist = 0;
  private pending = 0;

  constructor(host: HTMLElement) {
    this.element = document.createElement("div");
    this.element.className = "view view-2d";
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("role", "img");
    this.canvas.setAttribute("aria-label", "Rysunek żółwia (2D)");
    this.element.append(this.canvas);
    host.append(this.element);
    this.ctx = this.canvas.getContext("2d")!;
    this.refreshTheme();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.element);
    this.resize();
    this.bindInput();
  }

  refreshTheme(): void {
    this.theme = {
      bg: cssVar("--paper", "#fbf8f1"),
      minor: cssVar("--grid-minor", "rgba(0,0,0,0.05)"),
      major: cssVar("--grid-major", "rgba(0,0,0,0.1)"),
      axis: cssVar("--grid-axis", "rgba(0,0,0,0.22)"),
      outline: cssVar("--turtle-outline", "#1d2b25"),
    };
    this.redraw();
  }

  private resize(): void {
    const r = this.element.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.dpr = Math.min(3, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.redraw();
  }

  private redraw(): void {
    if (this.pending) return;
    this.pending = requestAnimationFrame(() => {
      this.pending = 0;
      if (this.last) this.draw(this.last);
      else this.drawBackground();
    });
  }

  render(frame: Frame): void {
    this.last = frame;
    this.draw(frame);
  }

  fit(frame: Frame): void {
    this.last = frame;
    let minX = frame.pose.pos[0];
    let maxX = minX;
    let minY = frame.pose.pos[1];
    let maxY = minY;
    for (const s of frame.segments) {
      for (const p of [s.from, s.to]) {
        if (p[0] < minX) minX = p[0];
        if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1];
        if (p[1] > maxY) maxY = p[1];
      }
    }
    const pad = 48;
    const bw = Math.max(maxX - minX, 1);
    const bh = Math.max(maxY - minY, 1);
    const s = Math.min((this.w - pad * 2) / bw, (this.h - pad * 2) / bh);
    this.scale = clamp(Math.min(s, 4), MIN_SCALE, MAX_SCALE);
    this.cx = (minX + maxX) / 2;
    this.cy = (minY + maxY) / 2;
    this.draw(frame);
  }

  /** True when the whole drawing is inside the visible area. */
  contains(frame: Frame): boolean {
    const m = 8;
    const inside = (x: number, y: number) => {
      const [sx, sy] = this.toScreen(x, y);
      return sx >= m && sy >= m && sx <= this.w - m && sy <= this.h - m;
    };
    if (!inside(frame.pose.pos[0], frame.pose.pos[1])) return false;
    return frame.segments.every((s) => inside(s.from[0], s.from[1]) && inside(s.to[0], s.to[1]));
  }

  resetView(): void {
    this.cx = 0;
    this.cy = 0;
    this.scale = 1;
    this.redraw();
  }

  toPng(): Promise<Blob | null> {
    if (this.last) this.draw(this.last);
    return new Promise((res) => this.canvas.toBlob(res, "image/png"));
  }

  dispose(): void {
    this.ro.disconnect();
    if (this.pending) cancelAnimationFrame(this.pending);
    this.element.remove();
  }

  private toScreen(x: number, y: number): [number, number] {
    return [this.w / 2 + (x - this.cx) * this.scale, this.h / 2 - (y - this.cy) * this.scale];
  }

  private drawBackground(): void {
    const { ctx, theme } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, this.w, this.h);

    // Graph paper: minor step at least ~16px on screen, major every 5.
    const target = 16 / this.scale;
    const pow = Math.pow(10, Math.floor(Math.log10(target)));
    const step = [1, 2, 5, 10].map((m) => m * pow).find((v) => v >= target) ?? pow * 10;
    const x0 = this.cx - this.w / 2 / this.scale;
    const x1 = this.cx + this.w / 2 / this.scale;
    const y0 = this.cy - this.h / 2 / this.scale;
    const y1 = this.cy + this.h / 2 / this.scale;
    ctx.lineWidth = 1;
    for (const major of [false, true]) {
      ctx.beginPath();
      const st = major ? step * 5 : step;
      for (let x = Math.ceil(x0 / st) * st; x <= x1; x += st) {
        if (!major && Math.abs(Math.round(x / step) % 5) === 0) continue;
        const sx = Math.round(this.toScreen(x, 0)[0]) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, this.h);
      }
      for (let y = Math.ceil(y0 / st) * st; y <= y1; y += st) {
        if (!major && Math.abs(Math.round(y / step) % 5) === 0) continue;
        const sy = Math.round(this.toScreen(0, y)[1]) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(this.w, sy);
      }
      ctx.strokeStyle = major ? theme.major : theme.minor;
      ctx.stroke();
    }
    const [ox, oy] = this.toScreen(0, 0);
    ctx.beginPath();
    ctx.moveTo(Math.round(ox) + 0.5, 0);
    ctx.lineTo(Math.round(ox) + 0.5, this.h);
    ctx.moveTo(0, Math.round(oy) + 0.5);
    ctx.lineTo(this.w, Math.round(oy) + 0.5);
    ctx.strokeStyle = theme.axis;
    ctx.stroke();
  }

  private draw(frame: Frame): void {
    this.drawBackground();
    const { ctx } = this;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const segs = frame.segments;
    let i = 0;
    while (i < frame.count) {
      const first = segs[i]!;
      ctx.beginPath();
      let lastX = NaN;
      let lastY = NaN;
      while (i < frame.count && segs[i]!.color === first.color && segs[i]!.width === first.width) {
        const s = segs[i]!;
        const [ax, ay] = this.toScreen(s.from[0], s.from[1]);
        const [bx, by] = this.toScreen(s.to[0], s.to[1]);
        if (ax !== lastX || ay !== lastY) ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        lastX = bx;
        lastY = by;
        i++;
      }
      ctx.strokeStyle = first.color;
      ctx.lineWidth = first.width;
      ctx.stroke();
    }
    if (frame.partial) {
      const s = frame.partial;
      const [ax, ay] = this.toScreen(s.from[0], s.from[1]);
      const [bx, by] = this.toScreen(s.to[0], s.to[1]);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.stroke();
    }
    this.drawTurtle(frame);
  }

  private drawTurtle(frame: Frame): void {
    const { ctx, theme } = this;
    const p = frame.pose;
    const [x, y] = this.toScreen(p.pos[0], p.pos[1]);
    const angle = Math.atan2(p.heading[0], p.heading[1]);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = theme.outline;
    // legs
    ctx.fillStyle = theme.outline;
    for (const [lx, ly] of [
      [-8, -6],
      [8, -6],
      [-8, 7],
      [8, 7],
    ] as const) {
      ctx.beginPath();
      ctx.ellipse(lx, ly, 3, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // tail
    ctx.beginPath();
    ctx.moveTo(-1.5, 11);
    ctx.lineTo(0, 15);
    ctx.lineTo(1.5, 11);
    ctx.fill();
    // head
    ctx.beginPath();
    ctx.ellipse(0, -13, 3.6, 4.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.stroke();
    // shell
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 10.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = theme.bg;
    ctx.fill();
    if (p.penDown) {
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.stroke();
    // shell pattern
    ctx.beginPath();
    ctx.moveTo(0, -10.5);
    ctx.lineTo(0, 10.5);
    ctx.moveTo(-7.4, -4);
    ctx.lineTo(7.4, -4);
    ctx.moveTo(-7.4, 4);
    ctx.lineTo(7.4, 4);
    ctx.globalAlpha = 0.35;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
    // pen point
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = theme.outline;
    ctx.fill();
  }

  private bindInput(): void {
    const el = this.canvas;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2) this.pinchDist = this.pointerDist();
      this.element.classList.add("grabbing");
    });
    el.addEventListener("pointermove", (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      if (this.pointers.size === 1) {
        this.cx -= (e.clientX - prev.x) / this.scale;
        this.cy += (e.clientY - prev.y) / this.scale;
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      } else if (this.pointers.size === 2) {
        const before = this.midpoint();
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const after = this.midpoint();
        const d = this.pointerDist();
        this.cx -= (after.x - before.x) / this.scale;
        this.cy += (after.y - before.y) / this.scale;
        if (this.pinchDist > 0 && d > 0) this.zoomAt(after.x, after.y, d / this.pinchDist);
        this.pinchDist = d;
      }
      this.redraw();
    });
    const end = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinchDist = 0;
      if (this.pointers.size === 0) this.element.classList.remove("grabbing");
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015));
        this.zoomAt(e.clientX, e.clientY, factor);
        this.redraw();
      },
      { passive: false },
    );
    el.addEventListener("dblclick", () => {
      if (this.last) this.fit(this.last);
    });
  }

  private midpoint(): { x: number; y: number } {
    const ps = [...this.pointers.values()];
    return { x: (ps[0]!.x + ps[1]!.x) / 2, y: (ps[0]!.y + ps[1]!.y) / 2 };
  }

  private pointerDist(): number {
    const ps = [...this.pointers.values()];
    return Math.hypot(ps[0]!.x - ps[1]!.x, ps[0]!.y - ps[1]!.y);
  }

  /** Zoom by `factor` keeping the world point under (clientX, clientY) fixed. */
  zoomAt(clientX: number, clientY: number, factor: number): void {
    const r = this.canvas.getBoundingClientRect();
    const mx = clientX - r.left - this.w / 2;
    const my = clientY - r.top - this.h / 2;
    const wx = this.cx + mx / this.scale;
    const wy = this.cy - my / this.scale;
    this.scale = clamp(this.scale * factor, MIN_SCALE, MAX_SCALE);
    this.cx = wx - mx / this.scale;
    this.cy = wy + my / this.scale;
  }

  zoomBy(factor: number): void {
    const r = this.canvas.getBoundingClientRect();
    this.zoomAt(r.left + this.w / 2, r.top + this.h / 2, factor);
    this.redraw();
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
