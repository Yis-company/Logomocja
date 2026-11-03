import type { Mode, Segment } from '../lang/types';
import { drawSegments } from './view2d';
import { cssVar } from './surface';

// The default 3D camera looks from the front-right, above the ground.
const VIEW_DIR = normalize([0.55, -0.72, 0.42]);
const RIGHT = normalize(cross([-VIEW_DIR[0], -VIEW_DIR[1], -VIEW_DIR[2]], [0, 0, 1]));
const UP = cross(RIGHT, [-VIEW_DIR[0], -VIEW_DIR[1], -VIEW_DIR[2]]);

function cross(a: number[], b: number[]): [number, number, number] {
  return [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];
}
function normalize(v: number[]): [number, number, number] {
  const l = Math.hypot(v[0]!, v[1]!, v[2]!);
  return [v[0]! / l, v[1]! / l, v[2]! / l];
}

/** Axonometric projection used for 3D thumbnails and the no-WebGL preview. */
export function project3(p: readonly number[]): [number, number] {
  return [p[0]! * RIGHT[0] + p[1]! * RIGHT[1] + p[2]! * RIGHT[2], p[0]! * UP[0] + p[1]! * UP[1] + p[2]! * UP[2]];
}

export function flatten(segments: Segment[], mode: Mode): Segment[] {
  if (mode === '2d') return segments;
  return segments.map((s) => {
    const a = project3(s.from);
    const b = project3(s.to);
    return { ...s, from: [a[0], a[1], 0], to: [b[0], b[1], 0] };
  });
}

export interface ThumbOptions {
  ghost?: Segment[];
  pad?: number;
  widthScale?: number;
}

/** Draws a drawing fitted into a canvas, at device resolution. */
export function renderThumb(canvas: HTMLCanvasElement, segments: Segment[], mode: Mode, opts: ThumbOptions = {}): void {
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(1, Math.round(rect.width || Number(canvas.dataset.w) || 160));
  const cssH = Math.max(1, Math.round(rect.height || Number(canvas.dataset.h) || 120));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = cssVar('--plate');
  ctx.fillRect(0, 0, cssW, cssH);
  const flat = flatten(segments, mode);
  const ghost = opts.ghost ? flatten(opts.ghost, mode) : [];
  const all = [...flat, ...ghost];
  if (!all.length) return;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const s of all) {
    for (const p of [s.from, s.to]) {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    }
  }
  const pad = opts.pad ?? 10;
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const s = Math.min((cssW - pad * 2) / spanX, (cssH - pad * 2) / spanY);
  const ox = (cssW - spanX * s) / 2;
  const oy = (cssH - spanY * s) / 2;
  const toScreen = (x: number, y: number): [number, number] => [ox + (x - minX) * s, oy + (maxY - y) * s];
  const ws = opts.widthScale ?? 0.6;
  if (ghost.length) {
    drawSegments(ctx, ghost.map((g) => ({ ...g, color: cssVar('--plate-ghost'), width: g.width + 6 })), toScreen, 1);
  }
  drawSegments(ctx, flat.map((f) => ({ ...f, width: Math.max(0.8, f.width * ws) })), toScreen, 1);
}
