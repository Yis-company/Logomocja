import { niceStep, sceneBounds, strokeRuns, type Palette, type Scene } from './scene';
import { drawTurtle2D } from './marker';

/** 2D camera: world point (cx, cy) at the centre of the canvas, `scale` pixels per unit. */
export interface Camera2D {
  cx: number;
  cy: number;
  scale: number;
}

export const MIN_SCALE_2D = 0.001;
export const MAX_SCALE_2D = 80;

export function defaultCamera2D(): Camera2D {
  return { cx: 0, cy: 0, scale: 1 };
}

/** Screen margins kept free when fitting (room for the overlay buttons and the info line). */
export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function fitCamera2D(scene: Scene, w: number, h: number, padding?: number, insets?: Insets): Camera2D {
  const pad = padding ?? Math.max(28, Math.min(w, h) * 0.06);
  const ins = insets ?? { top: 0, right: 0, bottom: 0, left: 0 };
  const b = sceneBounds(scene);
  if (b.empty && !scene.turtle) return defaultCamera2D();
  const bw = Math.max(b.max[0] - b.min[0], 1e-6);
  const bh = Math.max(b.max[1] - b.min[1], 1e-6);
  const mx = (b.min[0] + b.max[0]) / 2;
  const my = (b.min[1] + b.max[1]) / 2;
  const left = pad + ins.left;
  const right = pad + ins.right;
  const top = pad + ins.top;
  const bottom = pad + ins.bottom;
  const availW = Math.max(40, w - left - right);
  const availH = Math.max(40, h - top - bottom);
  let scale = 1;
  if (!b.empty) {
    scale = Math.min(availW / bw, availH / bh);
    scale = Math.min(Math.max(scale, MIN_SCALE_2D), 8);
  }
  // Put the middle of the drawing at the middle of the free area.
  const sx = left + availW / 2;
  const sy = top + availH / 2;
  return { cx: mx - (sx - w / 2) / scale, cy: my + (sy - h / 2) / scale, scale };
}

export function worldToScreen2D(cam: Camera2D, w: number, h: number, x: number, y: number): [number, number] {
  return [w / 2 + (x - cam.cx) * cam.scale, h / 2 - (y - cam.cy) * cam.scale];
}

export function screenToWorld2D(cam: Camera2D, w: number, h: number, sx: number, sy: number): [number, number] {
  return [cam.cx + (sx - w / 2) / cam.scale, cam.cy - (sy - h / 2) / cam.scale];
}

export interface Draw2DOptions {
  grid?: boolean;
  axes?: boolean;
  /** Multiplier for stroke widths and marker sizes (used for exports). */
  pixelScale?: number;
}

export function draw2D(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cam: Camera2D,
  scene: Scene,
  pal: Palette,
  opts: Draw2DOptions = {},
): void {
  const px = opts.pixelScale ?? 1;
  ctx.save();
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const [ox, oy] = worldToScreen2D(cam, w, h, 0, 0);

  if (opts.grid !== false) {
    const step = niceStep(28 * px / cam.scale);
    const major = step * 5;
    const [x0, y1] = screenToWorld2D(cam, w, h, 0, 0);
    const [x1, y0] = screenToWorld2D(cam, w, h, w, h);
    const drawLines = (s: number, color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1 * px;
      const startX = Math.ceil(x0 / s) * s;
      for (let x = startX; x <= x1; x += s) {
        const sx = Math.round(w / 2 + (x - cam.cx) * cam.scale) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
      }
      const startY = Math.ceil(y0 / s) * s;
      for (let y = startY; y <= y1; y += s) {
        const sy = Math.round(h / 2 - (y - cam.cy) * cam.scale) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
      }
      ctx.stroke();
    };
    if ((x1 - x0) / step < 400 && (y1 - y0) / step < 400) drawLines(step, pal.grid);
    if ((x1 - x0) / major < 400) drawLines(major, pal.gridMajor);
  }

  if (opts.axes !== false) {
    ctx.lineWidth = 1.25 * px;
    ctx.strokeStyle = pal.axisX;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(w, oy);
    ctx.stroke();
    ctx.strokeStyle = pal.axisY;
    ctx.beginPath();
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, h);
    ctx.stroke();
    // Origin marker and axis labels.
    ctx.fillStyle = pal.bg;
    ctx.strokeStyle = pal.label;
    ctx.lineWidth = 1.5 * px;
    ctx.beginPath();
    ctx.arc(ox, oy, 4 * px, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.font = `${11 * px}px system-ui, sans-serif`;
    ctx.fillStyle = pal.label;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    if (ox > -20 && ox < w + 20 && oy > -20 && oy < h + 20) ctx.fillText('0', ox + 6 * px, oy + 5 * px);
    ctx.fillStyle = pal.axisX;
    ctx.textAlign = 'right';
    if (oy > 0 && oy < h) ctx.fillText('x', w - 6 * px, oy + 4 * px);
    ctx.fillStyle = pal.axisY;
    ctx.textAlign = 'left';
    if (ox > 0 && ox < w) ctx.fillText('y', ox + 6 * px, 6 * px);
  }

  const project = (p: readonly number[]): [number, number] => [
    w / 2 + (p[0] - cam.cx) * cam.scale,
    h / 2 - (p[1] - cam.cy) * cam.scale,
  ];

  if (scene.ghost && scene.ghost.length) {
    ctx.save();
    ctx.setLineDash([6 * px, 6 * px]);
    ctx.strokeStyle = pal.ghost;
    ctx.lineWidth = 3 * px;
    ctx.beginPath();
    for (const s of scene.ghost) {
      const [ax, ay] = project(s.from);
      const [bx, by] = project(s.to);
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    }
    ctx.stroke();
    ctx.restore();
  }

  if (scene.marks && scene.marks.length) {
    ctx.save();
    ctx.setLineDash([5 * px, 5 * px]);
    ctx.lineWidth = 3.5 * px;
    for (const s of scene.marks) {
      const [ax, ay] = project(s.from);
      const [bx, by] = project(s.to);
      ctx.strokeStyle = s.color;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
    ctx.restore();
  }

  strokeRuns(ctx, scene.log, scene.start, scene.end, project, px);
  if (scene.partial) strokeRuns(ctx, [scene.partial], 0, 1, project, px);

  if (scene.turtle) {
    const t = scene.turtle;
    const [sx, sy] = project(t.pos);
    // Screen angle of the heading: 0 = up, clockwise positive.
    const ang = Math.atan2(t.h[0], t.h[1]);
    drawTurtle2D(ctx, sx, sy, ang, t, pal, px);
  }
  ctx.restore();
}
