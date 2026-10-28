import type { Vec3 } from '../lang/geometry';
import type { Segment } from '../lang/interpreter';
import { drawTurtle3D, type ProjectedPoint } from './marker';
import { niceStep, sceneBounds, type Palette, type Scene } from './scene';

/** Orbit camera around `target`; azimuth and elevation in degrees, Z is up. */
export interface Camera3D {
  target: Vec3;
  dist: number;
  az: number;
  el: number;
  fov: number;
}

export const DEFAULT_AZ = -122;
export const DEFAULT_EL = 28;

export function defaultCamera3D(): Camera3D {
  return { target: [0, 0, 0], dist: 650, az: DEFAULT_AZ, el: DEFAULT_EL, fov: 40 };
}

export type CameraPreset = 'default' | 'top' | 'front' | 'side';

export function presetAngles(p: CameraPreset): { az: number; el: number } {
  switch (p) {
    case 'top': return { az: -90, el: 89.9 };
    case 'front': return { az: -90, el: 0 };
    case 'side': return { az: 0, el: 0 };
    default: return { az: DEFAULT_AZ, el: DEFAULT_EL };
  }
}

const DEG = Math.PI / 180;

export class Projector {
  readonly eye: Vec3;
  readonly right: Vec3;
  readonly up: Vec3;
  readonly fwd: Vec3;
  readonly focal: number;
  readonly near: number;

  constructor(readonly cam: Camera3D, readonly w: number, readonly h: number) {
    const ce = Math.cos(cam.el * DEG);
    const off: Vec3 = [ce * Math.cos(cam.az * DEG), ce * Math.sin(cam.az * DEG), Math.sin(cam.el * DEG)];
    this.eye = [cam.target[0] + off[0] * cam.dist, cam.target[1] + off[1] * cam.dist, cam.target[2] + off[2] * cam.dist];
    this.fwd = [-off[0], -off[1], -off[2]];
    // right = fwd × Z, normalised; up = right × fwd.
    let rx = this.fwd[1];
    let ry = -this.fwd[0];
    const rl = Math.hypot(rx, ry) || 1;
    rx /= rl;
    ry /= rl;
    this.right = [rx, ry, 0];
    const f = this.fwd;
    this.up = [ry * f[2] - 0 * f[1], 0 * f[0] - rx * f[2], rx * f[1] - ry * f[0]];
    this.focal = (h / 2) / Math.tan((cam.fov * DEG) / 2);
    this.near = Math.max(cam.dist * 0.01, 0.01);
  }

  toCamera(p: readonly number[]): [number, number, number] {
    const vx = p[0] - this.eye[0];
    const vy = p[1] - this.eye[1];
    const vz = p[2] - this.eye[2];
    return [
      vx * this.right[0] + vy * this.right[1] + vz * this.right[2],
      vx * this.up[0] + vy * this.up[1] + vz * this.up[2],
      vx * this.fwd[0] + vy * this.fwd[1] + vz * this.fwd[2],
    ];
  }

  screen(c: readonly number[]): ProjectedPoint {
    return { x: this.w / 2 + (c[0] * this.focal) / c[2], y: this.h / 2 - (c[1] * this.focal) / c[2], z: c[2] };
  }

  project = (p: readonly number[]): ProjectedPoint | null => {
    const c = this.toCamera(p);
    if (c[2] < this.near) return null;
    return this.screen(c);
  };

  /** Projects a segment, clipping it against the near plane. */
  segment(a: readonly number[], b: readonly number[]): [ProjectedPoint, ProjectedPoint] | null {
    let ca = this.toCamera(a);
    let cb = this.toCamera(b);
    const n = this.near;
    if (ca[2] < n && cb[2] < n) return null;
    if (ca[2] < n || cb[2] < n) {
      const t = (n - ca[2]) / (cb[2] - ca[2]);
      const cut: [number, number, number] = [ca[0] + (cb[0] - ca[0]) * t, ca[1] + (cb[1] - ca[1]) * t, n];
      if (ca[2] < n) ca = cut;
      else cb = cut;
    }
    return [this.screen(ca), this.screen(cb)];
  }
}

export function fitCamera3D(scene: Scene, w: number, h: number, base: Camera3D): Camera3D {
  const b = sceneBounds(scene);
  if (b.empty && !scene.turtle) return { ...base, target: [0, 0, 0], dist: 650 };
  const target: Vec3 = [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2];
  const radius = Math.max(Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]) / 2, b.empty ? 120 : 1);
  const vfov = base.fov * DEG;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * (w / Math.max(h, 1)));
  const half = Math.min(vfov, hfov) / 2;
  const dist = Math.max((radius / Math.sin(half)) * 1.18, 4);
  return { ...base, target, dist };
}

export interface Draw3DOptions {
  grid?: boolean;
  axes?: boolean;
  pixelScale?: number;
}

interface Projected {
  a: ProjectedPoint;
  b: ProjectedPoint;
  depth: number;
  seg: Segment;
}

export function draw3D(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cam: Camera3D,
  scene: Scene,
  pal: Palette,
  opts: Draw3DOptions = {},
): void {
  const px = opts.pixelScale ?? 1;
  const pr = new Projector(cam, w, h);
  ctx.save();
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const line = (a: readonly number[], b: readonly number[]) => {
    const s = pr.segment(a, b);
    if (!s) return;
    ctx.moveTo(s[0].x, s[0].y);
    ctx.lineTo(s[1].x, s[1].y);
  };

  // Ground grid on the XY plane, centred under the camera target.
  const extentRaw = Math.max(cam.dist * 0.9, 50);
  const step = niceStep(extentRaw / 8);
  const major = step * 5;
  const half = Math.ceil(extentRaw / major) * major;
  const gx = Math.round(cam.target[0] / major) * major;
  const gy = Math.round(cam.target[1] / major) * major;
  if (opts.grid !== false) {
    const n = Math.round(half / step);
    for (let i = -n; i <= n; i++) {
      const isMajor = Math.round((gx + i * step) / step) % 5 === 0;
      const fade = 1 - Math.pow(Math.abs(i) / (n + 1), 2);
      ctx.globalAlpha = Math.max(0, fade);
      ctx.strokeStyle = isMajor ? pal.gridMajor : pal.grid;
      ctx.lineWidth = 1 * px;
      ctx.beginPath();
      line([gx + i * step, gy - half, 0], [gx + i * step, gy + half, 0]);
      ctx.stroke();
      const isMajorY = Math.round((gy + i * step) / step) % 5 === 0;
      ctx.strokeStyle = isMajorY ? pal.gridMajor : pal.grid;
      ctx.beginPath();
      line([gx - half, gy + i * step, 0], [gx + half, gy + i * step, 0]);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  if (opts.axes !== false) {
    const len = cam.dist * 0.3;
    const axes: [Vec3, string, string][] = [
      [[len, 0, 0], pal.axisX, 'X'],
      [[0, len, 0], pal.axisY, 'Y'],
      [[0, 0, len], pal.axisZ, 'Z'],
    ];
    ctx.font = `600 ${12 * px}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const [end, color, label] of axes) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6 * px;
      ctx.beginPath();
      line([0, 0, 0], end);
      ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1 * px;
      ctx.setLineDash([4 * px, 4 * px]);
      ctx.beginPath();
      line([0, 0, 0], [-end[0], -end[1], -end[2]]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      const tip = pr.project([end[0] * 1.08, end[1] * 1.08, end[2] * 1.08]);
      if (tip) {
        ctx.fillStyle = color;
        ctx.fillText(label, tip.x, tip.y);
      }
    }
    const o = pr.project([0, 0, 0]);
    if (o) {
      ctx.beginPath();
      ctx.arc(o.x, o.y, 3.5 * px, 0, Math.PI * 2);
      ctx.fillStyle = pal.bg;
      ctx.fill();
      ctx.strokeStyle = pal.label;
      ctx.lineWidth = 1.4 * px;
      ctx.stroke();
    }
  }

  if (scene.ghost && scene.ghost.length) {
    ctx.save();
    ctx.setLineDash([6 * px, 6 * px]);
    ctx.strokeStyle = pal.ghost;
    ctx.lineWidth = 3 * px;
    ctx.beginPath();
    for (const s of scene.ghost) line(s.from, s.to);
    ctx.stroke();
    ctx.restore();
  }

  if (scene.marks && scene.marks.length) {
    ctx.save();
    ctx.setLineDash([5 * px, 5 * px]);
    ctx.lineWidth = 3.5 * px;
    for (const s of scene.marks) {
      ctx.strokeStyle = s.color;
      ctx.beginPath();
      line(s.from, s.to);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Segments, painted from the farthest to the nearest.
  const list: Projected[] = [];
  const addSeg = (seg: Segment) => {
    const s = pr.segment(seg.from, seg.to);
    if (!s) return;
    list.push({ a: s[0], b: s[1], depth: s[0].z + s[1].z, seg });
  };
  for (let i = scene.start; i < scene.end; i++) addSeg(scene.log[i]);
  if (scene.partial) addSeg(scene.partial);
  list.sort((p, q) => q.depth - p.depth);
  let color = '';
  let width = -1;
  let open = false;
  for (const p of list) {
    if (p.seg.color !== color || p.seg.width !== width) {
      if (open) ctx.stroke();
      color = p.seg.color;
      width = p.seg.width;
      ctx.strokeStyle = color;
      ctx.lineWidth = width * px;
      ctx.beginPath();
      open = true;
    }
    ctx.moveTo(p.a.x, p.a.y);
    ctx.lineTo(p.b.x, p.b.y);
  }
  if (open) ctx.stroke();

  if (scene.turtle) {
    const c = pr.toCamera(scene.turtle.pos);
    if (c[2] > pr.near) {
      const size = (21 * px * c[2]) / pr.focal;
      drawTurtle3D(ctx, scene.turtle, size, pr.project, (q) => pr.toCamera(q), pal, px);
    }
  }
  ctx.restore();
}
