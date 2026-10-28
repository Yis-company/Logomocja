import type { Pose } from '../../lang/turtle';
import {
  canvasToBlob, CanvasView, clamp, EXPORT_PALETTE, inkFor, isEmptyBounds, niceStep, sceneBounds,
  type Bounds, type DrawOpts, type Palette, type Scene,
} from './common';

interface Cam2 {
  cx: number;
  cy: number;
  scale: number;
}

const DEFAULT_SCALE = 1.5;
const MIN_SCALE = 0.0005;
const MAX_SCALE = 400;
const MAX_FIT_SCALE = 8;

function fmtTick(v: number, step: number): string {
  if (Math.abs(v) < step * 1e-6) return '0';
  const d = step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(step)));
  return v.toFixed(d).replace('.', ',');
}

export class View2D extends CanvasView {
  private cam: Cam2 = { cx: 0, cy: 0, scale: DEFAULT_SCALE };

  constructor() {
    super('2d', 'Płaszczyzna rysunku. Przeciągnij, aby przesunąć; kółko myszy lub szczypanie przybliża; klawisze strzałek przesuwają, plus i minus przybliżają, zero dopasowuje widok.');
  }

  // ----- kamera ---------------------------------------------------------

  private targetFor(b: Bounds, w: number, h: number, margin: number, inset = 0): Cam2 {
    if (isEmptyBounds(b)) return { cx: 0, cy: 0, scale: DEFAULT_SCALE };
    const bw = b.maxX - b.minX;
    const bh = b.maxY - b.minY;
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    const availW = Math.max(20, w - 2 * margin);
    const availH = Math.max(20, h - 2 * margin - inset);
    let scale = Math.min(bw > 1e-9 ? availW / bw : Infinity, bh > 1e-9 ? availH / bh : Infinity);
    if (!Number.isFinite(scale)) scale = DEFAULT_SCALE;
    scale = clamp(scale, MIN_SCALE, MAX_FIT_SCALE);
    // rysunek ma leżeć w obszarze pod przybornikiem: kamera wyżej o pół pasa
    return { cx, cy: cy + inset / 2 / scale, scale };
  }

  private margin(): number {
    return Math.min(56, Math.max(24, Math.min(this.width, this.height) * 0.1));
  }

  fit(animate = true): void {
    this.syncSize();
    const b = sceneBounds(this.scene, true);
    // Bez rysunku: pokaż początek układu na środku.
    const target = this.targetFor(b, this.width, this.height, this.margin(), this.topInset);
    this.moveTo(target, animate ? 320 : 0);
  }

  resetView(): void {
    this.autoFit = true;
    this.fit(true);
  }

  private moveTo(target: Cam2, dur: number): void {
    const from = { ...this.cam };
    this.animate(
      dur,
      (k) => {
        this.cam.cx = from.cx + (target.cx - from.cx) * k;
        this.cam.cy = from.cy + (target.cy - from.cy) * k;
        this.cam.scale = Math.exp(Math.log(from.scale) + (Math.log(target.scale) - Math.log(from.scale)) * k);
      },
    );
  }

  protected override afterScene(): void {
    if (!this.autoFit) return;
    const b = sceneBounds(this.scene, true);
    if (isEmptyBounds(b)) return;
    const m = 14;
    const c = this.cam;
    const left = c.cx - (this.width / 2 - m) / c.scale;
    const right = c.cx + (this.width / 2 - m) / c.scale;
    const bottom = c.cy - (this.height / 2 - m) / c.scale;
    const top = c.cy + (this.height / 2 - m) / c.scale;
    if (b.minX < left || b.maxX > right || b.minY < bottom || b.maxY > top) {
      // Zostaw zapas, żeby nie dopasowywać przy każdym kroku.
      const t = this.targetFor(b, this.width, this.height, this.margin() + 30, this.topInset);
      this.moveTo(t, 260);
    }
  }

  zoomBy(factor: number): void {
    this.userCamera();
    const to: Cam2 = { ...this.cam, scale: clamp(this.cam.scale * factor, MIN_SCALE, MAX_SCALE) };
    this.moveTo(to, 140);
  }

  protected dragBy(dx: number, dy: number): void {
    this.cam.cx -= dx / this.cam.scale;
    this.cam.cy += dy / this.cam.scale;
    this.invalidate();
  }

  protected wheelZoom(factor: number, x: number, y: number): void {
    const c = this.cam;
    const wx = c.cx + (x - this.width / 2) / c.scale;
    const wy = c.cy - (y - this.height / 2) / c.scale;
    const s2 = clamp(c.scale * factor, MIN_SCALE, MAX_SCALE);
    c.scale = s2;
    c.cx = wx - (x - this.width / 2) / s2;
    c.cy = wy + (y - this.height / 2) / s2;
    this.invalidate();
  }

  protected pinchBy(factor: number, cx: number, cy: number, dx: number, dy: number): void {
    this.wheelZoom(factor, cx, cy);
    this.dragBy(dx, dy);
  }

  protected keyCamera(key: string, shift: boolean): boolean {
    const step = (shift ? 160 : 60) / this.cam.scale;
    switch (key) {
      case 'ArrowLeft': this.cam.cx -= step; break;
      case 'ArrowRight': this.cam.cx += step; break;
      case 'ArrowUp': this.cam.cy += step; break;
      case 'ArrowDown': this.cam.cy -= step; break;
      case '+': case '=': this.cam.scale = clamp(this.cam.scale * 1.25, MIN_SCALE, MAX_SCALE); break;
      case '-': case '_': this.cam.scale = clamp(this.cam.scale / 1.25, MIN_SCALE, MAX_SCALE); break;
      default: return false;
    }
    return true;
  }

  // ----- rysowanie ------------------------------------------------------

  protected draw(ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts): void {
    renderScene2D(ctx, w, h, this.cam, this.scene, opts.palette, { chrome: true, turtle: this.scene.showTurtle, lw: 1 });
  }

  async exportPng(maxSide = 1600): Promise<Blob> {
    const aspect = this.width / this.height;
    const W = Math.round(aspect >= 1 ? maxSide : maxSide * aspect);
    const H = Math.round(aspect >= 1 ? maxSide / aspect : maxSide);
    const k = W / this.width;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const scene: Scene = { ...this.scene, ghost: null };
    const b = sceneBounds(scene, false);
    const cam = this.targetFor(b, W, H, 56 * k);
    cam.scale = clamp(cam.scale, MIN_SCALE, MAX_FIT_SCALE * k);
    renderScene2D(ctx, W, H, cam, scene, EXPORT_PALETTE, { chrome: false, turtle: false, lw: k });
    return canvasToBlob(canvas);
  }
}

interface RenderOpts {
  chrome: boolean;
  turtle: boolean;
  lw: number;
}

export function renderScene2D(
  ctx: CanvasRenderingContext2D, w: number, h: number, cam: Cam2, scene: Scene, pal: Palette, o: RenderOpts,
): void {
  const { cx, cy, scale } = cam;
  const sx = (x: number) => w / 2 + (x - cx) * scale;
  const sy = (y: number) => h / 2 - (y - cy) * scale;

  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);

  if (o.chrome) drawGrid(ctx, w, h, cam, pal);

  // Wzór wyzwania.
  if (scene.ghost && scene.ghost.length) {
    ctx.save();
    ctx.strokeStyle = pal.ghost;
    ctx.lineWidth = 3 * o.lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([7 * o.lw, 6 * o.lw]);
    ctx.beginPath();
    for (const s of scene.ghost) {
      ctx.moveTo(sx(s.from[0]), sy(s.from[1]));
      ctx.lineTo(sx(s.to[0]), sy(s.to[1]));
    }
    ctx.stroke();
    ctx.restore();
  }

  // Odcinki: kolejne o tym samym stylu w jednej ścieżce.
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const n = Math.min(scene.count, scene.segments.length);
  let key = '';
  let open = false;
  const margin = 20;
  const flush = () => {
    if (open) ctx.stroke();
    open = false;
  };
  const drawSeg = (s: Scene['segments'][number]) => {
    const x0 = sx(s.from[0]);
    const y0 = sy(s.from[1]);
    const x1 = sx(s.to[0]);
    const y1 = sy(s.to[1]);
    if ((x0 < -margin && x1 < -margin) || (x0 > w + margin && x1 > w + margin) || (y0 < -margin && y1 < -margin) || (y0 > h + margin && y1 > h + margin)) return;
    const k = s.color + s.width;
    if (k !== key || !open) {
      flush();
      key = k;
      ctx.strokeStyle = inkFor(s.color, pal);
      ctx.lineWidth = s.width * o.lw;
      ctx.beginPath();
      open = true;
    }
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
  };
  for (let i = 0; i < n; i++) drawSeg(scene.segments[i]!);
  flush();
  if (scene.partial) {
    key = '';
    drawSeg(scene.partial);
    flush();
  }

  if (o.turtle) {
    const p = scene.pose;
    const ang = Math.atan2(p.h[0], p.h[1]);
    // Gdy żółw patrzy prosto w górę (3D), pokaż go jako kropkę z kierunkiem rzutu.
    const flat = Math.hypot(p.h[0], p.h[1]) < 1e-6;
    drawTurtle2D(ctx, sx(p.pos[0]), sy(p.pos[1]), flat ? 0 : ang, 15, p, pal, flat);
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, cam: Cam2, pal: Palette): void {
  const { cx, cy, scale } = cam;
  const left = cx - w / 2 / scale;
  const right = cx + w / 2 / scale;
  const bottom = cy - h / 2 / scale;
  const top = cy + h / 2 / scale;
  const sx = (x: number) => w / 2 + (x - cx) * scale;
  const sy = (y: number) => h / 2 - (y - cy) * scale;

  const major = niceStep(84 / scale);
  const lead = major / Math.pow(10, Math.floor(Math.log10(major)));
  const minor = lead === 2 ? major / 4 : major / 5;
  const lines = (step: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.ceil(left / step) * step; x <= right; x += step) {
      const px = Math.round(sx(x)) + 0.5;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
    }
    for (let y = Math.ceil(bottom / step) * step; y <= top; y += step) {
      const py = Math.round(sy(y)) + 0.5;
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
    }
    ctx.stroke();
  };
  if (minor * scale >= 9) lines(minor, pal.gridMinor);
  lines(major, pal.gridMajor);

  // Osie i podpisy.
  const ox = sx(0);
  const oy = sy(0);
  ctx.strokeStyle = pal.axis;
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (ox >= 0 && ox <= w) {
    ctx.moveTo(Math.round(ox) + 0.5, 0);
    ctx.lineTo(Math.round(ox) + 0.5, h);
  }
  if (oy >= 0 && oy <= h) {
    ctx.moveTo(0, Math.round(oy) + 0.5);
    ctx.lineTo(w, Math.round(oy) + 0.5);
  }
  ctx.stroke();

  ctx.font = '11px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillStyle = pal.label;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';
  const rowY = clamp(oy + 4, 2, h - 16);
  for (let x = Math.ceil(left / major) * major; x <= right; x += major) {
    if (Math.abs(x) < major * 1e-6) continue;
    ctx.fillText(fmtTick(x, major), sx(x), rowY);
  }
  ctx.textAlign = ox < 40 ? 'left' : 'right';
  ctx.textBaseline = 'middle';
  const colX = clamp(ox - 5, 4, w - 4);
  const colXAdj = ox < 40 ? Math.max(ox + 6, 4) : colX;
  for (let y = Math.ceil(bottom / major) * major; y <= top; y += major) {
    if (Math.abs(y) < major * 1e-6) continue;
    ctx.fillText(fmtTick(y, major), colXAdj, sy(y));
  }

  // Początek układu: wyraźny znacznik i dodatnie półosie ze strzałkami.
  const arrow = 46;
  const drawAxis = (dx: number, dy: number, color: string, label: string) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + dx * arrow, oy + dy * arrow);
    ctx.stroke();
    ctx.beginPath();
    const tx = ox + dx * arrow;
    const ty = oy + dy * arrow;
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - dx * 8 - dy * 4, ty - dy * 8 + dx * 4);
    ctx.lineTo(tx - dx * 8 + dy * 4, ty - dy * 8 - dx * 4);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, ox + dx * (arrow + 12) + (dy !== 0 ? 0 : 0), oy + dy * (arrow + 12));
  };
  if (ox > -60 && ox < w + 60 && oy > -60 && oy < h + 60) {
    drawAxis(1, 0, pal.axisX, 'x');
    drawAxis(0, -1, pal.axisY, 'y');
    ctx.fillStyle = pal.paper;
    ctx.strokeStyle = pal.origin;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ox, oy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

/** Żółw widziany z góry: skorupa, głowa (kierunek ruchu), łapki i ogon. */
export function drawTurtle2D(
  ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number, pose: Pose, pal: Palette, dotOnly = false,
): void {
  const color = inkFor(pose.color, pal);
  ctx.save();
  ctx.translate(x, y);
  if (dotOnly) {
    ctx.fillStyle = color;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return;
  }
  ctx.rotate(angle);
  const S = size;
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = pal.ink;
  const body = pose.penDown ? color : 'transparent';

  const limb = (lx: number, ly: number, rot: number) => {
    ctx.save();
    ctx.translate(lx * S, ly * S);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, 0.2 * S, 0.34 * S, 0, 0, Math.PI * 2);
    ctx.fillStyle = pose.penDown ? color : pal.paper;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();
    ctx.restore();
  };
  limb(-0.6, -0.38, -0.7);
  limb(0.6, -0.38, 0.7);
  limb(-0.55, 0.42, 0.6);
  limb(0.55, 0.42, -0.6);
  // ogon
  ctx.beginPath();
  ctx.moveTo(-0.12 * S, 0.66 * S);
  ctx.lineTo(0, 1.02 * S);
  ctx.lineTo(0.12 * S, 0.66 * S);
  ctx.closePath();
  ctx.fillStyle = pose.penDown ? color : pal.paper;
  ctx.fill();
  ctx.stroke();
  // głowa
  ctx.beginPath();
  ctx.arc(0, -0.9 * S, 0.34 * S, 0, Math.PI * 2);
  ctx.fillStyle = pose.penDown ? color : pal.paper;
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = pal.ink;
  ctx.beginPath();
  ctx.arc(-0.12 * S, -0.98 * S, 0.06 * S, 0, Math.PI * 2);
  ctx.moveTo(0.18 * S, -0.98 * S);
  ctx.arc(0.12 * S, -0.98 * S, 0.06 * S, 0, Math.PI * 2);
  ctx.fill();
  // skorupa
  ctx.beginPath();
  ctx.ellipse(0, 0, 0.62 * S, 0.76 * S, 0, 0, Math.PI * 2);
  ctx.fillStyle = body;
  if (pose.penDown) ctx.fill();
  else {
    ctx.fillStyle = pal.paper;
    ctx.globalAlpha = 0.75;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.setLineDash([3, 2.5]);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  // wzór na skorupie
  ctx.strokeStyle = pose.penDown ? 'rgba(255,255,255,0.65)' : pal.label;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -0.36 * S);
  ctx.lineTo(0.3 * S, -0.18 * S);
  ctx.lineTo(0.3 * S, 0.22 * S);
  ctx.lineTo(0, 0.4 * S);
  ctx.lineTo(-0.3 * S, 0.22 * S);
  ctx.lineTo(-0.3 * S, -0.18 * S);
  ctx.closePath();
  ctx.moveTo(0, -0.36 * S);
  ctx.lineTo(0, -0.72 * S);
  ctx.moveTo(0.3 * S, -0.18 * S);
  ctx.lineTo(0.56 * S, -0.3 * S);
  ctx.moveTo(-0.3 * S, -0.18 * S);
  ctx.lineTo(-0.56 * S, -0.3 * S);
  ctx.moveTo(0.3 * S, 0.22 * S);
  ctx.lineTo(0.54 * S, 0.34 * S);
  ctx.moveTo(-0.3 * S, 0.22 * S);
  ctx.lineTo(-0.54 * S, 0.34 * S);
  ctx.moveTo(0, 0.4 * S);
  ctx.lineTo(0, 0.7 * S);
  ctx.stroke();
  ctx.restore();
}
