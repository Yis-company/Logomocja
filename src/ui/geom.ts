import type { Segment, Vec3 } from '../lang/types';
import type { Pose } from '../lang/interpreter';

export interface Scene {
  segments: Segment[];
  pose: Pose | null;
}

export interface Bounds {
  min: Vec3;
  max: Vec3;
}

/** Bounding box of the segments, always including the origin. */
export function boundsOf(segs: Segment[]): Bounds {
  const min: Vec3 = [0, 0, 0];
  const max: Vec3 = [0, 0, 0];
  for (const s of segs) {
    for (const p of [s.from, s.to]) {
      for (let i = 0; i < 3; i++) {
        if (p[i] < min[i]) min[i] = p[i];
        if (p[i] > max[i]) max[i] = p[i];
      }
    }
  }
  return { min, max };
}

/** 1-2-5 grid step such that one step spans at least `minPx` pixels. */
export function niceStep(scale: number, minPx: number): number {
  const raw = minPx / scale;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 5, 10]) if (m * pow >= raw) return m * pow;
  return 10 * pow;
}

export function fmtNum(v: number): string {
  const r = Math.round(v * 1e6) / 1e6;
  return String(r === 0 ? 0 : r);
}

/** Orthographic "isometric-ish" projection used for static 3D previews. */
export function projectIso(p: Vec3): [number, number] {
  const yaw = 0.6;
  const pitch = 0.5;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x = p[0] * cy + p[1] * sy;
  const d = -p[0] * sy + p[1] * cy;
  return [x, p[2] * Math.cos(pitch) + d * Math.sin(pitch)];
}

export interface PreviewOptions {
  bg: string;
  mode: '2d' | '3d';
  /** Draw these segments as faint dashed guide underneath. */
  ghost?: Segment[];
  ghostColor?: string;
  marks?: Vec3[];
  markColor?: string;
  lineScale?: number;
}

/** Fits and draws segments on a canvas (used by gallery, challenges and PNG export). */
export function drawPreview(canvas: HTMLCanvasElement, segs: Segment[], opts: PreviewOptions, cssW?: number, cssH?: number): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = cssW ?? (canvas.clientWidth || canvas.width);
  const H = cssH ?? (canvas.clientHeight || canvas.height);
  if (cssW && cssH) {
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
  }
  canvas.width = Math.max(1, Math.round(W * dpr));
  canvas.height = Math.max(1, Math.round(H * dpr));
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = opts.bg;
  ctx.fillRect(0, 0, W, H);
  const proj = (p: Vec3): [number, number] => (opts.mode === '3d' ? projectIso(p) : [p[0], p[1]]);
  const all = [...segs, ...(opts.ghost ?? [])];
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  const grow = (p: Vec3) => {
    const [x, y] = proj(p);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  };
  for (const s of all) { grow(s.from); grow(s.to); }
  if (!all.length) { minX = -50; maxX = 50; minY = -50; maxY = 50; }
  const m = Math.min(W, H) * 0.1 + 4;
  const bw = Math.max(maxX - minX, 10);
  const bh = Math.max(maxY - minY, 10);
  const sc = Math.min((W - 2 * m) / bw, (H - 2 * m) / bh);
  const ox = W / 2 - ((minX + maxX) / 2) * sc;
  const oy = H / 2 + ((minY + maxY) / 2) * sc;
  const tx = (p: Vec3): [number, number] => {
    const [x, y] = proj(p);
    return [ox + x * sc, oy - y * sc];
  };
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // origin cross
  const [o0, o1] = tx([0, 0, 0]);
  ctx.strokeStyle = 'rgba(60,50,30,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(o0 - 5, o1); ctx.lineTo(o0 + 5, o1);
  ctx.moveTo(o0, o1 - 5); ctx.lineTo(o0, o1 + 5);
  ctx.stroke();
  if (opts.ghost) {
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = opts.ghostColor ?? 'rgba(90,80,60,0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const s of opts.ghost) {
      const a = tx(s.from), b = tx(s.to);
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    ctx.stroke();
    ctx.restore();
  }
  const k = opts.lineScale ?? 1;
  for (const s of segs) {
    const a = tx(s.from), b = tx(s.to);
    ctx.strokeStyle = s.color;
    ctx.lineWidth = Math.max(1, s.width * k);
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  }
  if (opts.marks) {
    ctx.strokeStyle = opts.markColor ?? '#c0392b';
    ctx.lineWidth = 2;
    for (const p of opts.marks) {
      const [x, y] = tx(p);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
