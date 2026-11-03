// Static drawings for thumbnails and challenge targets. 3D uses an isometric projection.
import type { Segment, Vec } from '../lang/interp';
import type { Mode } from '../lang/parser';
import { readPalette, strokeSegments } from './view2d';

const C30 = Math.cos(Math.PI / 6);

export function project(p: Vec, mode: Mode): [number, number] {
  if (mode === '2d') return [p[0], p[1]];
  return [(p[0] - p[1]) * C30, p[2] + (p[0] + p[1]) * 0.5];
}

export interface Layer { segments: Segment[]; style: 'target' | 'normal' }

/** Draw layers into a canvas sized by CSS, sharing one scale so a target and an attempt compare directly. */
export function drawPreview(canvas: HTMLCanvasElement, layers: Layer[], mode: Mode, opts: { grid?: boolean; widthScale?: number } = {}) {
  const w = canvas.clientWidth || 160, h = canvas.clientHeight || 120;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pal = readPalette(canvas);
  ctx.fillStyle = pal.ground;
  ctx.fillRect(0, 0, w, h);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const l of layers) for (const s of l.segments) for (const p of [s.from, s.to]) {
    const [x, y] = project(p, mode);
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  if (x0 === Infinity) { x0 = -10; x1 = 10; y0 = -10; y1 = 10; }
  const pad = Math.max(10, Math.min(w, h) * 0.1);
  const s = Math.min((w - pad * 2) / Math.max(x1 - x0, 1), (h - pad * 2) / Math.max(y1 - y0, 1));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const tx = (p: Vec): [number, number] => {
    const [x, y] = project(p, mode);
    return [w / 2 + (x - cx) * s, h / 2 - (y - cy) * s];
  };
  if (opts.grid) {
    ctx.strokeStyle = pal.minor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const step = 10 * s >= 8 ? 10 : 50;
    for (let gx = Math.ceil((x0 - w) / step) * step; gx <= x1 + w; gx += step) {
      const sx = Math.round(w / 2 + (gx - cx) * s) + 0.5;
      if (sx >= 0 && sx <= w) { ctx.moveTo(sx, 0); ctx.lineTo(sx, h); }
    }
    for (let gy = Math.ceil((y0 - h) / step) * step; gy <= y1 + h; gy += step) {
      const sy = Math.round(h / 2 - (gy - cy) * s) + 0.5;
      if (sy >= 0 && sy <= h) { ctx.moveTo(0, sy); ctx.lineTo(w, sy); }
    }
    ctx.stroke();
  }
  const [ox, oy] = tx([0, 0, 0]);
  ctx.strokeStyle = pal.axis;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
  ctx.stroke();
  for (const l of layers) {
    if (l.style === 'target') {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.setLineDash([6, 5]);
      const t = l.segments.map((sg) => ({ ...sg, color: pal.inkSoft, width: 2 }));
      strokeSegments(ctx, t, tx, 1);
      ctx.restore();
    } else {
      strokeSegments(ctx, l.segments, tx, opts.widthScale ?? 1);
    }
  }
}
