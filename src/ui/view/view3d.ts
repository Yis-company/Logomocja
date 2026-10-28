import type { Pose, Segment } from '../../lang/turtle';
import {
  canvasToBlob, CanvasView, clamp, emptyBounds, EXPORT_PALETTE, extend, inkFor, isEmptyBounds, niceStep, sceneBounds,
  type Bounds, type DrawOpts, type Palette, type Scene,
} from './common';

export interface Cam3 {
  tx: number; ty: number; tz: number;
  /** Azymut kamery (rad): 0 = patrzymy od strony −Y w stronę +Y. */
  az: number;
  /** Wysokość kamery nad poziomem (rad). */
  el: number;
  dist: number;
}

export const FOV_V = (40 * Math.PI) / 180;
export const DEFAULT_AZ = -0.62;
export const DEFAULT_EL = 0.5;
const MAX_EL = (88 * Math.PI) / 180;
const MIN_DIST = 4;
const MAX_DIST = 5e6;

export interface Proj {
  ex: number; ey: number; ez: number;
  rx: number; ry: number; rz: number;
  ux: number; uy: number; uz: number;
  fx: number; fy: number; fz: number;
  focal: number;
  w: number;
  h: number;
  near: number;
}

export function makeProj(cam: Cam3, w: number, h: number): Proj {
  const ce = Math.cos(cam.el);
  const ex = cam.tx + cam.dist * Math.sin(cam.az) * ce;
  const ey = cam.ty - cam.dist * Math.cos(cam.az) * ce;
  const ez = cam.tz + cam.dist * Math.sin(cam.el);
  let fx = cam.tx - ex;
  let fy = cam.ty - ey;
  let fz = cam.tz - ez;
  const fl = Math.hypot(fx, fy, fz) || 1;
  fx /= fl; fy /= fl; fz /= fl;
  // right = f × z
  let rx = fy;
  let ry = -fx;
  let rz = 0;
  const rl = Math.hypot(rx, ry) || 1;
  rx /= rl; ry /= rl;
  // up = r × f
  const ux = ry * fz - rz * fy;
  const uy = rz * fx - rx * fz;
  const uz = rx * fy - ry * fx;
  return { ex, ey, ez, rx, ry, rz, ux, uy, uz, fx, fy, fz, focal: h / 2 / Math.tan(FOV_V / 2), w, h, near: Math.max(0.5, cam.dist * 0.01) };
}

/** Rzutuje punkt; zwraca głębokość (≤ near oznacza „za kamerą”). */
export function projectPoint(p: Proj, x: number, y: number, z: number, out: number[]): number {
  const vx = x - p.ex;
  const vy = y - p.ey;
  const vz = z - p.ez;
  const zc = vx * p.fx + vy * p.fy + vz * p.fz;
  const xc = vx * p.rx + vy * p.ry + vz * p.rz;
  const yc = vx * p.ux + vy * p.uy + vz * p.uz;
  if (zc > p.near) {
    const k = p.focal / zc;
    out[0] = p.w / 2 + xc * k;
    out[1] = p.h / 2 - yc * k;
  }
  out[2] = zc;
  return zc;
}

/** Rzut odcinka z obcięciem do płaszczyzny bliskiej. Zapisuje x0,y0,x1,y1,głębokość. */
function projectSegment(p: Proj, a: [number, number, number], b: [number, number, number], out: Float64Array, o: number): boolean {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];
  let da = (ax - p.ex) * p.fx + (ay - p.ey) * p.fy + (az - p.ez) * p.fz;
  let db = (bx - p.ex) * p.fx + (by - p.ey) * p.fy + (bz - p.ez) * p.fz;
  const near = p.near;
  if (da <= near && db <= near) return false;
  if (da <= near) {
    const t = (near - da) / (db - da);
    ax += (bx - ax) * t; ay += (by - ay) * t; az += (bz - az) * t;
    da = near;
  } else if (db <= near) {
    const t = (near - db) / (da - db);
    bx += (ax - bx) * t; by += (ay - by) * t; bz += (az - bz) * t;
    db = near;
  }
  const va = ax - p.ex, wa = ay - p.ey, xa = az - p.ez;
  const vb = bx - p.ex, wb = by - p.ey, xb = bz - p.ez;
  const ka = p.focal / da;
  const kb = p.focal / db;
  out[o] = p.w / 2 + (va * p.rx + wa * p.ry + xa * p.rz) * ka;
  out[o + 1] = p.h / 2 - (va * p.ux + wa * p.uy + xa * p.uz) * ka;
  out[o + 2] = p.w / 2 + (vb * p.rx + wb * p.ry + xb * p.rz) * kb;
  out[o + 3] = p.h / 2 - (vb * p.ux + wb * p.uy + xb * p.uz) * kb;
  out[o + 4] = (da + db) / 2;
  return true;
}

/** Najmniejszy rozmiar sceny przy dopasowaniu: malutkie rysunki nie są powiększane w nieskończoność. */
const MIN_FIT_EXTENT = 120;

/** Kamera obejmująca prostopadłościan; wyszukiwanie dystansu przez bisekcję na rzutach narożników. */
export function fitCamera3D(b: Bounds, w: number, h: number, az: number, el: number, margin: number, insetTop = 0, minExtent = MIN_FIT_EXTENT): Cam3 {
  if (isEmptyBounds(b)) return { tx: 0, ty: 0, tz: 0, az, el, dist: 520 };
  const tx = (b.minX + b.maxX) / 2;
  const ty = (b.minY + b.maxY) / 2;
  const tz = (b.minZ + b.maxZ) / 2;
  const hx = Math.max(b.maxX - b.minX, minExtent) / 2;
  const hy = Math.max(b.maxY - b.minY, minExtent) / 2;
  const hz = Math.max(b.maxZ - b.minZ, minExtent) / 2;
  const corners: Array<[number, number, number]> = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) corners.push([tx + sx * hx, ty + sy * hy, tz + sz * hz]);
  const r = Math.hypot(hx, hy, hz);
  const fits = (dist: number): boolean => {
    const p = makeProj({ tx, ty, tz, az, el, dist }, w, h);
    const out = [0, 0, 0];
    for (const c of corners) {
      if (projectPoint(p, c[0], c[1], c[2], out) <= p.near) return false;
      if (out[0] < margin || out[0] > w - margin || out[1] < margin + insetTop || out[1] > h - margin - insetTop * 0.25) return false;
    }
    return true;
  };
  let lo = r * 0.3;
  let hi = r * 60;
  for (let i = 0; i < 36; i++) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) hi = mid;
    else lo = mid;
  }
  return { tx, ty, tz, az, el, dist: clamp(hi, MIN_DIST, MAX_DIST) };
}

export class View3D extends CanvasView {
  private cam: Cam3 = { tx: 0, ty: 0, tz: 0, az: DEFAULT_AZ, el: DEFAULT_EL, dist: 520 };

  constructor() {
    super('3d', 'Przestrzeń rysunku. Przeciągnij, aby obracać widok; przeciągnij z klawiszem Shift, prawym przyciskiem albo dwoma palcami, aby przesunąć; kółko myszy lub szczypanie przybliża; klawisze strzałek obracają, Shift ze strzałkami przesuwa, plus i minus przybliżają, zero dopasowuje widok.');
  }

  private margin(): number {
    return Math.min(56, Math.max(26, Math.min(this.width, this.height) * 0.1));
  }

  fit(animate = true): void {
    this.syncSize();
    const b = sceneBounds(this.scene, true);
    this.moveTo(fitCamera3D(b, this.width, this.height, this.cam.az, this.cam.el, this.margin(), this.topInset), animate ? 340 : 0);
  }

  resetView(): void {
    this.autoFit = true;
    this.syncSize();
    const b = sceneBounds(this.scene, true);
    this.moveTo(fitCamera3D(b, this.width, this.height, DEFAULT_AZ, DEFAULT_EL, this.margin(), this.topInset), 360);
  }

  /** Widoki ustalone: z góry (jak w 2D), z przodu i z boku. */
  preset(kind: 'top' | 'front' | 'side'): void {
    this.autoFit = true;
    this.syncSize();
    const b = sceneBounds(this.scene, true);
    const az = kind === 'side' ? Math.PI / 2 : 0;
    const el = kind === 'top' ? MAX_EL : 0;
    this.moveTo(fitCamera3D(b, this.width, this.height, az, el, this.margin(), this.topInset), 360);
  }

  private moveTo(t: Cam3, dur: number): void {
    const f = { ...this.cam };
    // najkrótsza droga w azymucie
    let daz = t.az - f.az;
    daz = Math.atan2(Math.sin(daz), Math.cos(daz));
    this.animate(dur, (k) => {
      const c = this.cam;
      c.tx = f.tx + (t.tx - f.tx) * k;
      c.ty = f.ty + (t.ty - f.ty) * k;
      c.tz = f.tz + (t.tz - f.tz) * k;
      c.az = f.az + daz * k;
      c.el = f.el + (t.el - f.el) * k;
      c.dist = Math.exp(Math.log(f.dist) + (Math.log(t.dist) - Math.log(f.dist)) * k);
    });
  }

  protected override afterScene(): void {
    if (!this.autoFit) return;
    const b = sceneBounds(this.scene, true);
    if (isEmptyBounds(b)) return;
    const p = makeProj(this.cam, this.width, this.height);
    const out = [0, 0, 0];
    const m = 10;
    let inside = true;
    for (const x of [b.minX, b.maxX]) for (const y of [b.minY, b.maxY]) for (const z of [b.minZ, b.maxZ]) {
      if (projectPoint(p, x, y, z, out) <= p.near || out[0] < m || out[0] > this.width - m || out[1] < m || out[1] > this.height - m) inside = false;
    }
    if (!inside) {
      this.moveTo(fitCamera3D(b, this.width, this.height, this.cam.az, this.cam.el, this.margin() + 28, this.topInset), 260);
    }
  }

  zoomBy(factor: number): void {
    this.userCamera();
    const t = { ...this.cam, dist: clamp(this.cam.dist / factor, MIN_DIST, MAX_DIST) };
    this.moveTo(t, 140);
  }

  protected dragBy(dx: number, dy: number, secondary: boolean): void {
    if (secondary) this.panBy(dx, dy);
    else {
      this.cam.az -= dx * 0.008;
      this.cam.el = clamp(this.cam.el + dy * 0.008, -MAX_EL, MAX_EL);
    }
    this.invalidate();
  }

  private panBy(dx: number, dy: number): void {
    const p = makeProj(this.cam, this.width, this.height);
    const k = this.cam.dist / p.focal;
    this.cam.tx += (-p.rx * dx + p.ux * dy) * k;
    this.cam.ty += (-p.ry * dx + p.uy * dy) * k;
    this.cam.tz += (-p.rz * dx + p.uz * dy) * k;
  }

  protected wheelZoom(factor: number): void {
    this.cam.dist = clamp(this.cam.dist / factor, MIN_DIST, MAX_DIST);
    this.invalidate();
  }

  protected pinchBy(factor: number, _cx: number, _cy: number, dx: number, dy: number): void {
    this.cam.dist = clamp(this.cam.dist / factor, MIN_DIST, MAX_DIST);
    this.panBy(dx, dy);
    this.invalidate();
  }

  protected keyCamera(key: string, shift: boolean): boolean {
    const c = this.cam;
    if (shift) {
      switch (key) {
        case 'ArrowLeft': this.panBy(40, 0); return true;
        case 'ArrowRight': this.panBy(-40, 0); return true;
        case 'ArrowUp': this.panBy(0, 40); return true;
        case 'ArrowDown': this.panBy(0, -40); return true;
      }
    }
    switch (key) {
      case 'ArrowLeft': c.az += 0.1; return true;
      case 'ArrowRight': c.az -= 0.1; return true;
      case 'ArrowUp': c.el = clamp(c.el - 0.1, -MAX_EL, MAX_EL); return true;
      case 'ArrowDown': c.el = clamp(c.el + 0.1, -MAX_EL, MAX_EL); return true;
      case '+': case '=': c.dist = clamp(c.dist / 1.2, MIN_DIST, MAX_DIST); return true;
      case '-': case '_': c.dist = clamp(c.dist * 1.2, MIN_DIST, MAX_DIST); return true;
    }
    return false;
  }

  protected draw(ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts): void {
    render3D(ctx, w, h, this.cam, this.scene, opts.palette, { chrome: true, turtle: this.scene.showTurtle, lw: 1 });
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
    const cam = fitCamera3D(sceneBounds(scene, false), W, H, this.cam.az, this.cam.el, 56 * k, 0, 8);
    render3D(ctx, W, H, cam, scene, EXPORT_PALETTE, { chrome: false, turtle: false, lw: k });
    return canvasToBlob(canvas);
  }
}

// ---------------------------------------------------------------------------
// Rysowanie sceny 3D

export interface Render3DOpts {
  chrome: boolean;
  turtle: boolean;
  lw: number;
}

const BUCKETS = 40;
const IDX_RANGE = 16384;

export function render3D(ctx: CanvasRenderingContext2D, w: number, h: number, cam: Cam3, scene: Scene, pal: Palette, o: Render3DOpts): void {
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);
  const P = makeProj(cam, w, h);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // zasięg sceny do siatki
  const b = sceneBounds(scene, true);
  let radius = 150;
  if (!isEmptyBounds(b)) {
    radius = Math.max(
      Math.abs(b.minX), Math.abs(b.maxX), Math.abs(b.minY), Math.abs(b.maxY), Math.abs(b.minZ), Math.abs(b.maxZ), 100,
    );
  }
  const half = niceStep(radius * 1.15);

  if (o.chrome) drawGround(ctx, P, half, pal);

  const tmp = new Float64Array(5);

  if (o.chrome) drawAxes(ctx, P, Math.min(half * 0.5, cam.dist * 0.28), pal);

  if (scene.ghost && scene.ghost.length) {
    ctx.save();
    ctx.strokeStyle = pal.ghost;
    ctx.lineWidth = 3 * o.lw;
    ctx.setLineDash([7 * o.lw, 6 * o.lw]);
    ctx.beginPath();
    for (const s of scene.ghost) {
      if (projectSegment(P, s.from, s.to, tmp, 0)) {
        ctx.moveTo(tmp[0]!, tmp[1]!);
        ctx.lineTo(tmp[2]!, tmp[3]!);
      }
    }
    ctx.stroke();
    ctx.restore();
  }



  // Odcinki: kubełki głębokości od najdalszego, w kubełku grupy o jednakowym stylu.
  const n = Math.min(scene.count, scene.segments.length);
  const total = n + (scene.partial ? 1 : 0);
  const geom = new Float64Array(total * 5);
  const styleOf = new Int16Array(total);
  const ok = new Uint8Array(total);
  const styles: Array<{ color: string; width: number }> = [];
  const styleIdx = new Map<string, number>();
  let zmin = Infinity;
  let zmax = -Infinity;
  let valid = 0;
  for (let i = 0; i < total; i++) {
    const s: Segment = i < n ? scene.segments[i]! : scene.partial!;
    if (!projectSegment(P, s.from, s.to, geom, i * 5)) continue;
    const z = geom[i * 5 + 4]!;
    if (z < zmin) zmin = z;
    if (z > zmax) zmax = z;
    const key = s.color + '|' + s.width;
    let si = styleIdx.get(key);
    if (si === undefined) {
      si = Math.min(styles.length, 1023);
      if (styles.length < 1024) {
        styles.push({ color: s.color, width: s.width });
        styleIdx.set(key, si);
      }
    }
    styleOf[i] = si;
    ok[i] = 1;
    valid++;
  }
  const keys = new Float64Array(valid);
  let ki = 0;
  const range = Math.max(zmax - zmin, 1e-9);
  for (let i = 0; i < total; i++) {
    if (!ok[i]) continue;
    const bucket = Math.min(BUCKETS - 1, Math.floor(((zmax - geom[i * 5 + 4]!) / range) * BUCKETS));
    keys[ki++] = (bucket * 1024 + styleOf[i]!) * IDX_RANGE + i;
  }
  keys.sort();
  let curGroup = -1;
  let open = false;
  for (let q = 0; q < keys.length; q++) {
    const key = keys[q]!;
    const i = key % IDX_RANGE;
    const group = Math.floor(key / IDX_RANGE);
    if (group !== curGroup) {
      if (open) ctx.stroke();
      curGroup = group;
      const bucket = Math.floor(group / 1024);
      const st = styles[group % 1024]!;
      const near = 1 - bucket / (BUCKETS - 1);
      ctx.globalAlpha = 0.6 + 0.4 * near;
      ctx.lineWidth = st.width * o.lw * (0.72 + 0.5 * near);
      ctx.strokeStyle = inkFor(st.color, pal);
      ctx.beginPath();
      open = true;
    }
    ctx.moveTo(geom[i * 5]!, geom[i * 5 + 1]!);
    ctx.lineTo(geom[i * 5 + 2]!, geom[i * 5 + 3]!);
  }
  if (open) ctx.stroke();
  ctx.globalAlpha = 1;

  if (o.turtle) drawTurtle3D(ctx, P, scene.pose, pal);
  if (o.chrome) drawGizmo(ctx, P, w, h, pal);
}

function drawGround(ctx: CanvasRenderingContext2D, P: Proj, half: number, pal: Palette): void {
  const step = half / 10;
  const tmp = new Float64Array(5);
  const strokeSet = (major: boolean) => {
    ctx.strokeStyle = major ? pal.gridMajor : pal.gridMinor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = -10; i <= 10; i++) {
      if ((i % 5 === 0) !== major) continue;
      const v = i * step;
      if (projectSegment(P, [-half, v, 0], [half, v, 0], tmp, 0)) {
        ctx.moveTo(tmp[0]!, tmp[1]!);
        ctx.lineTo(tmp[2]!, tmp[3]!);
      }
      if (projectSegment(P, [v, -half, 0], [v, half, 0], tmp, 0)) {
        ctx.moveTo(tmp[0]!, tmp[1]!);
        ctx.lineTo(tmp[2]!, tmp[3]!);
      }
    }
    ctx.stroke();
  };
  strokeSet(false);
  strokeSet(true);
}

function drawAxes(ctx: CanvasRenderingContext2D, P: Proj, L: number, pal: Palette): void {
  const tmp = new Float64Array(5);
  const out = [0, 0, 0];
  const axes: Array<[[number, number, number], string, string]> = [
    [[L, 0, 0], pal.axisX, 'x'],
    [[0, L, 0], pal.axisY, 'y'],
    [[0, 0, L], pal.axisZ, 'z'],
  ];
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const [end, color, label] of axes) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    if (projectSegment(P, [0, 0, 0], end, tmp, 0)) {
      ctx.beginPath();
      ctx.moveTo(tmp[0]!, tmp[1]!);
      ctx.lineTo(tmp[2]!, tmp[3]!);
      ctx.stroke();
    }
    if (projectPoint(P, end[0], end[1], end[2], out) > P.near) {
      // grot
      const ax = out[0]!;
      const ay = out[1]!;
      let dx = ax - (tmp[0] ?? ax);
      let dy = ay - (tmp[1] ?? ay);
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl; dy /= dl;
      ctx.beginPath();
      ctx.moveTo(ax + dx * 4, ay + dy * 4);
      ctx.lineTo(ax - dx * 7 - dy * 4, ay - dy * 7 + dx * 4);
      ctx.lineTo(ax - dx * 7 + dy * 4, ay - dy * 7 - dx * 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillText(label, ax + dx * 13, ay + dy * 13);
    }
  }
  // początek układu
  if (projectPoint(P, 0, 0, 0, out) > P.near) {
    ctx.fillStyle = pal.paper;
    ctx.strokeStyle = pal.origin;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(out[0]!, out[1]!, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

/** Mały wskaźnik osi w rogu: pokazuje orientację widoku. */
function drawGizmo(ctx: CanvasRenderingContext2D, P: Proj, w: number, h: number, pal: Palette): void {
  const cx = 44;
  const cy = h - 44;
  const L = 26;
  const items: Array<{ dx: number; dy: number; z: number; color: string; label: string }> = [];
  const vecs: Array<[number, number, number, string, string]> = [
    [1, 0, 0, pal.axisX, 'x'], [0, 1, 0, pal.axisY, 'y'], [0, 0, 1, pal.axisZ, 'z'],
  ];
  for (const [x, y, z, color, label] of vecs) {
    items.push({
      dx: (x * P.rx + y * P.ry + z * P.rz) * L,
      dy: -(x * P.ux + y * P.uy + z * P.uz) * L,
      z: x * P.fx + y * P.fy + z * P.fz,
      color, label,
    });
  }
  items.sort((a, b) => b.z - a.z);
  ctx.save();
  ctx.fillStyle = pal.theme === 'dark' ? 'rgba(20,28,32,0.6)' : 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.arc(cx, cy, L + 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 2.2;
  for (const it of items) {
    ctx.strokeStyle = it.color;
    ctx.fillStyle = it.color;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + it.dx, cy + it.dy);
    ctx.stroke();
    ctx.fillText(it.label, cx + it.dx * 1.32, cy + it.dy * 1.32);
  }
  ctx.restore();
  void w;
}

/** Żółw w przestrzeni: płaska figura w płaszczyźnie (prawo, przód) oraz trzy osie orientacji. */
function drawTurtle3D(ctx: CanvasRenderingContext2D, P: Proj, pose: Pose, pal: Palette): void {
  const out = [0, 0, 0];
  const depth = projectPoint(P, pose.pos[0], pose.pos[1], pose.pos[2], out);
  if (depth <= P.near) return;
  const S = (15 * depth) / P.focal;
  const [px, py, pz] = pose.pos;
  const R = pose.r;
  const H = pose.h;
  const U = pose.u;
  const color = inkFor(pose.color, pal);
  const tp = [0, 0, 0];
  const pt = (a: number, b: number, c = 0): [number, number] => {
    projectPoint(P, px + S * (a * R[0] + b * H[0] + c * U[0]), py + S * (a * R[1] + b * H[1] + c * U[1]), pz + S * (a * R[2] + b * H[2] + c * U[2]), tp);
    return [tp[0]!, tp[1]!];
  };
  const poly = (pts: Array<[number, number]>, fill: string | null, stroke: string | null, alpha = 1) => {
    ctx.beginPath();
    pts.forEach(([a, b], i) => {
      const [x, y] = pt(a, b);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.globalAlpha = alpha;
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  };
  const ellipse = (cx: number, cy: number, rx: number, ry: number, n = 18): Array<[number, number]> =>
    Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      return [cx + Math.cos(t) * rx, cy + Math.sin(t) * ry] as [number, number];
    });

  ctx.save();
  ctx.lineWidth = 1.3;
  ctx.lineJoin = 'round';
  const fill = pose.penDown ? color : pal.paper;
  // kierunek: dodatnie b = przód
  for (const [lx, ly] of [[-0.66, 0.4], [0.66, 0.4], [-0.6, -0.42], [0.6, -0.42]] as const) {
    poly(ellipse(lx, ly, 0.22, 0.3, 10), fill, pal.ink, 0.9);
  }
  poly([[-0.12, -0.66], [0, -1.02], [0.12, -0.66]], fill, pal.ink, 0.95);
  poly(ellipse(0, 0.86, 0.3, 0.3, 14), fill, pal.ink, 0.95);
  if (!pose.penDown) ctx.setLineDash([3, 2.5]);
  poly(ellipse(0, 0, 0.62, 0.76, 22), pose.penDown ? color : pal.paper, pal.ink, pose.penDown ? 0.92 : 0.7);
  ctx.setLineDash([]);
  // osie orientacji: prawo (czerwona), przód (zielona), góra (niebieska)
  const o0 = pt(0, 0);
  const axis = (a: number, b: number, c: number, col: string) => {
    const e = pt(a, b, c);
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(o0[0], o0[1]);
    ctx.lineTo(e[0], e[1]);
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(e[0], e[1], 2.4, 0, Math.PI * 2);
    ctx.fill();
  };
  axis(1.7, 0, 0, pal.axisX);
  axis(0, 1.8, 0, pal.axisY);
  axis(0, 0, 1.9, pal.axisZ);
  ctx.restore();
}

/** Rysuje niewielki podgląd rysunku (miniatura): bez siatki i żółwia. */
export function renderThumbnail(
  canvas: HTMLCanvasElement, segments: Segment[], mode: '2d' | '3d', pal: Palette, cssW: number, cssH: number, fluid = false,
): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  if (fluid) {
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.aspectRatio = `${cssW} / ${cssH}`;
  } else {
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
  }
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const scene: Scene = {
    segments, count: segments.length, partial: null, showTurtle: false, ghost: null,
    pose: { pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1], penDown: true, color: '#16866a', width: 3 },
  };
  const b = emptyBounds();
  for (const s of segments) {
    extend(b, s.from[0], s.from[1], s.from[2]);
    extend(b, s.to[0], s.to[1], s.to[2]);
  }
  const lw = clamp(Math.min(cssW, cssH) / 220, 0.45, 1);
  if (mode === '3d') {
    const cam = fitCamera3D(b, cssW, cssH, DEFAULT_AZ, DEFAULT_EL, 10, 0, 8);
    render3D(ctx, cssW, cssH, cam, scene, pal, { chrome: false, turtle: false, lw });
  } else {
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, cssW, cssH);
    if (isEmptyBounds(b)) return;
    const bw = Math.max(b.maxX - b.minX, 1e-6);
    const bh = Math.max(b.maxY - b.minY, 1e-6);
    const scale = Math.min((cssW - 20) / bw, (cssH - 20) / bh, 8);
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const s of segments) {
      ctx.strokeStyle = inkFor(s.color, pal);
      ctx.lineWidth = s.width * lw;
      ctx.beginPath();
      ctx.moveTo(cssW / 2 + (s.from[0] - cx) * scale, cssH / 2 - (s.from[1] - cy) * scale);
      ctx.lineTo(cssW / 2 + (s.to[0] - cx) * scale, cssH / 2 - (s.to[1] - cy) * scale);
      ctx.stroke();
    }
  }
}
