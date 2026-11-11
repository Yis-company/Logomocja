import type { Mode, Segment, TurtleState, Vec3 } from "../core/interp";

export interface Palette {
  sheet: string;
  grid: string;
  gridStrong: string;
  ink: string;
  inkSoft: string;
  turtle: string;
  target: string;
}

export interface Cam2 {
  x: number;
  y: number;
  scale: number;
}
export interface Cam3 {
  az: number;
  el: number;
  dist: number;
  t: Vec3;
}
export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
export interface Scene {
  mode: Mode;
  segments: Segment[];
  target: Segment[] | null;
  turtle: TurtleState | null;
}

export const DEFAULT_AZ = 0.5;
export const DEFAULT_EL = 0.5;
const HALF_FOV = (20 * Math.PI) / 180;
const GRID_STEPS = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];
const DASHDOT = [14, 4, 2, 4];

export interface Projector {
  (p: Vec3): [number, number, number];
  focal: number;
  near: number;
  /** rzutuje odcinek z przycięciem do płaszczyzny bliskiej; null, gdy cały jest za kamerą */
  seg(a: Vec3, b: Vec3): [number, number, number, number, number] | null;
}

export function projector(cam: Cam3, w: number, h: number, cx = w / 2, cy = h / 2): Projector {
  const ce = Math.cos(cam.el), se = Math.sin(cam.el);
  const sa = Math.sin(cam.az), ca = Math.cos(cam.az);
  const ex = cam.t[0] + ce * sa * cam.dist;
  const ey = cam.t[1] - ce * ca * cam.dist;
  const ez = cam.t[2] + se * cam.dist;
  const fx = -ce * sa, fy = ce * ca, fz = -se;
  const rx = ca, ry = sa;
  const ux = -se * sa, uy = se * ca, uz = ce;
  const focal = h / 2 / Math.tan(HALF_FOV);
  const near = Math.max(0.5, cam.dist * 0.01);
  const toCam = (p: Vec3): Vec3 => {
    const dx = p[0] - ex, dy = p[1] - ey, dz = p[2] - ez;
    return [dx * rx + dy * ry, dx * ux + dy * uy + dz * uz, dx * fx + dy * fy + dz * fz];
  };
  const fn = ((p: Vec3) => {
    const c = toCam(p);
    const z = Math.max(c[2], near);
    return [cx + (c[0] * focal) / z, cy - (c[1] * focal) / z, c[2]];
  }) as Projector;
  fn.focal = focal;
  fn.near = near;
  fn.seg = (a, b) => {
    let p = toCam(a), q = toCam(b);
    if (p[2] < near && q[2] < near) return null;
    if (p[2] < near || q[2] < near) {
      const t = (near - p[2]) / (q[2] - p[2]);
      const m: Vec3 = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, near];
      if (p[2] < near) p = m;
      else q = m;
    }
    return [
      cx + (p[0] * focal) / p[2], cy - (p[1] * focal) / p[2],
      cx + (q[0] * focal) / q[2], cy - (q[1] * focal) / q[2],
      (p[2] + q[2]) / 2,
    ];
  };
  return fn;
}

function bounds(scene: Scene): { lo: Vec3; hi: Vec3 } {
  const lo: Vec3 = [0, 0, 0];
  const hi: Vec3 = [0, 0, 0];
  const add = (p: Vec3) => {
    for (let i = 0; i < 3; i++) {
      if (p[i] < lo[i]) lo[i] = p[i];
      if (p[i] > hi[i]) hi[i] = p[i];
    }
  };
  for (const s of scene.segments) { add(s.from); add(s.to); }
  if (scene.target) for (const s of scene.target) { add(s.from); add(s.to); }
  if (scene.turtle) add(scene.turtle.pos);
  return { lo, hi };
}

export function fit2(scene: Scene, w: number, h: number, ins: Insets): Cam2 {
  const { lo, hi } = bounds(scene);
  const aw = Math.max(40, w - ins.left - ins.right);
  const ah = Math.max(40, h - ins.top - ins.bottom);
  const bw = Math.max(hi[0] - lo[0], 1), bh = Math.max(hi[1] - lo[1], 1);
  const empty = bw <= 1 && bh <= 1;
  let scale = empty ? 1.5 : Math.min((aw * 0.84) / bw, (ah * 0.84) / bh);
  scale = Math.min(scale, 3);
  const cx = (lo[0] + hi[0]) / 2, cy = (lo[1] + hi[1]) / 2;
  // środek obszaru roboczego ma trafić w środek rysunku
  const ox = (ins.left - ins.right) / 2, oy = (ins.top - ins.bottom) / 2;
  return { x: cx - ox / scale, y: cy + oy / scale, scale };
}

export function fit3(scene: Scene, w: number, h: number, ins: Insets, az = DEFAULT_AZ, el = DEFAULT_EL): Cam3 {
  const { lo, hi } = bounds(scene);
  const t: Vec3 = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
  let r = 0;
  const far = (p: Vec3) => { r = Math.max(r, Math.hypot(p[0] - t[0], p[1] - t[1], p[2] - t[2])); };
  for (const s of scene.segments) { far(s.from); far(s.to); }
  if (scene.target) for (const s of scene.target) { far(s.from); far(s.to); }
  far([0, 0, 0]);
  r = Math.max(r, 60);
  const aw = Math.max(40, w - ins.left - ins.right);
  const ah = Math.max(40, h - ins.top - ins.bottom);
  const focal = h / 2 / Math.tan(HALF_FOV);
  const half = Math.atan(Math.min(aw, ah) / 2 / focal);
  return { az, el, dist: (r / Math.sin(half)) * 1.12, t };
}

function gridStep(pxPerUnit: number, minPx: number): number {
  for (const s of GRID_STEPS) if (s * pxPerUnit >= minPx) return s;
  return GRID_STEPS[GRID_STEPS.length - 1];
}

const penPx = (width: number, pxPerUnit: number) => Math.max(0.75, width * Math.min(1, Math.max(0.4, pxPerUnit)));

function draw2(ctx: CanvasRenderingContext2D, w: number, h: number, scene: Scene, cam: Cam2, pal: Palette, deco: boolean) {
  const X = (x: number) => w / 2 + (x - cam.x) * cam.scale;
  const Y = (y: number) => h / 2 - (y - cam.y) * cam.scale;
  if (deco) {
    const minor = gridStep(cam.scale, 12);
    const major = minor * (String(minor)[0] === "1" ? 5 : 2);
    const x0 = cam.x - w / 2 / cam.scale, x1 = cam.x + w / 2 / cam.scale;
    const y0 = cam.y - h / 2 / cam.scale, y1 = cam.y + h / 2 / cam.scale;
    for (const [step, color] of [[minor, pal.grid], [major, pal.gridStrong]] as const) {
      ctx.beginPath();
      for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) {
        if (step === minor && x % major === 0) continue;
        const px = Math.round(X(x)) + 0.5;
        ctx.moveTo(px, 0); ctx.lineTo(px, h);
      }
      for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) {
        if (step === minor && y % major === 0) continue;
        const py = Math.round(Y(y)) + 0.5;
        ctx.moveTo(0, py); ctx.lineTo(w, py);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // osie przez początek układu: cienka linia punktowa, jak osie symetrii na rysunku technicznym
    const ox = Math.round(X(0)) + 0.5, oy = Math.round(Y(0)) + 0.5;
    ctx.beginPath();
    ctx.setLineDash(DASHDOT);
    ctx.lineDashOffset = -(oy % 24);
    ctx.moveTo(ox, 0); ctx.lineTo(ox, h);
    ctx.strokeStyle = pal.inkSoft;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.beginPath();
    ctx.lineDashOffset = -(ox % 24);
    ctx.moveTo(0, oy); ctx.lineTo(w, oy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(ox, oy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = pal.sheet;
    ctx.fill();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = pal.inkSoft;
    ctx.font = '13px osifont, "Public Sans", sans-serif';
    ctx.textBaseline = "top";
    ctx.fillText("0", ox + 8, oy + 6);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (scene.target) {
    ctx.beginPath();
    for (const s of scene.target) {
      ctx.moveTo(X(s.from[0]), Y(s.from[1]));
      ctx.lineTo(X(s.to[0]), Y(s.to[1]));
    }
    ctx.setLineDash([7, 5]);
    ctx.lineCap = "butt";
    ctx.strokeStyle = pal.target;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineCap = "round";
  }
  const segs = scene.segments;
  let color = "", width = -1, open = false;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (s.color !== color || s.width !== width) {
      if (open) ctx.stroke();
      color = s.color; width = s.width;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = penPx(width, cam.scale);
      open = true;
    }
    ctx.moveTo(X(s.from[0]), Y(s.from[1]));
    ctx.lineTo(X(s.to[0]), Y(s.to[1]));
  }
  if (open) ctx.stroke();
  const t = scene.turtle;
  if (t) {
    const px = X(t.pos[0]), py = Y(t.pos[1]);
    const hx = t.h[0], hy = -t.h[1];
    const n = Math.hypot(hx, hy) || 1;
    const ax = hx / n, ay = hy / n;
    const L = 15, W = 8;
    ctx.beginPath();
    ctx.moveTo(px + ax * L, py + ay * L);
    ctx.lineTo(px - ax * 7 - ay * W, py - ay * 7 + ax * W);
    ctx.lineTo(px - ax * 3, py - ay * 3);
    ctx.lineTo(px - ax * 7 + ay * W, py - ay * 7 - ax * W);
    ctx.closePath();
    ctx.fillStyle = t.pen ? pal.turtle : pal.sheet;
    ctx.fill();
    ctx.strokeStyle = t.pen ? pal.ink : pal.turtle;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function draw3(ctx: CanvasRenderingContext2D, w: number, h: number, scene: Scene, cam: Cam3, pal: Palette, deco: boolean, cx: number, cy: number) {
  const P = projector(cam, w, h, cx, cy);
  const line = (a: Vec3, b: Vec3) => {
    const s = P.seg(a, b);
    if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); }
  };
  const unitPx = P.focal / cam.dist;
  const step = gridStep(unitPx, 22);
  if (deco) {
    const N = 10;
    const gx = Math.round(cam.t[0] / step) * step, gy = Math.round(cam.t[1] / step) * step;
    ctx.beginPath();
    for (let i = -N; i <= N; i++) {
      line([gx + i * step, gy - N * step, 0], [gx + i * step, gy + N * step, 0]);
      line([gx - N * step, gy + i * step, 0], [gx + N * step, gy + i * step, 0]);
    }
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    ctx.stroke();
    // osie
    const len = step * 4;
    ctx.beginPath();
    ctx.setLineDash(DASHDOT);
    line([gx - N * step, 0, 0], [gx + N * step, 0, 0]);
    line([0, gy - N * step, 0], [0, gy + N * step, 0]);
    ctx.strokeStyle = pal.inkSoft;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    line([0, 0, 0], [len, 0, 0]);
    line([0, 0, 0], [0, len, 0]);
    line([0, 0, 0], [0, 0, len]);
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = '15px osifont, "Public Sans", sans-serif';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = pal.ink;
    const labels: [string, Vec3][] = [["X", [len * 1.12, 0, 0]], ["Y", [0, len * 1.12, 0]], ["Z", [0, 0, len * 1.12]]];
    for (const [name, p] of labels) {
      const q = P(p);
      if (q[2] > P.near) ctx.fillText(name, q[0], q[1]);
    }
    ctx.textAlign = "start";
    const o = P([0, 0, 0]);
    if (o[2] > P.near) {
      ctx.beginPath();
      ctx.arc(o[0], o[1], 3.5, 0, Math.PI * 2);
      ctx.fillStyle = pal.sheet;
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.lineJoin = "round";
  if (scene.target) {
    ctx.beginPath();
    for (const s of scene.target) line(s.from, s.to);
    ctx.setLineDash([7, 5]);
    ctx.lineCap = "butt";
    ctx.strokeStyle = pal.target;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.lineCap = "round";
  const segs = scene.segments;
  const n = segs.length;
  const proj = new Float64Array(n * 5);
  const order: number[] = [];
  for (let i = 0; i < n; i++) {
    const s = P.seg(segs[i].from, segs[i].to);
    if (!s) continue;
    proj.set(s, i * 5);
    order.push(i);
  }
  order.sort((a, b) => proj[b * 5 + 4] - proj[a * 5 + 4]);
  let color = "", lw = -1, open = false;
  for (const i of order) {
    const s = segs[i];
    const z = proj[i * 5 + 4];
    // szerokość kwantowana, żeby łączyć sąsiednie odcinki w jedną ścieżkę
    const px = Math.round(penPx(s.width, P.focal / z) * 4) / 4;
    if (s.color !== color || px !== lw) {
      if (open) ctx.stroke();
      color = s.color; lw = px;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = px;
      open = true;
    }
    ctx.moveTo(proj[i * 5], proj[i * 5 + 1]);
    ctx.lineTo(proj[i * 5 + 2], proj[i * 5 + 3]);
  }
  if (open) ctx.stroke();
  const t = scene.turtle;
  if (t) {
    const c = P(t.pos);
    if (c[2] > P.near) {
      const k = (c[2] / P.focal) * 1; // jednostek na piksel przy żółwiu
      const L = 15 * k, B = 7 * k, W = 8 * k;
      const at = (f: number, r: number, u: number): [number, number, number] =>
        P([t.pos[0] + t.h[0] * f + t.r[0] * r + t.u[0] * u, t.pos[1] + t.h[1] * f + t.r[1] * r + t.u[1] * u, t.pos[2] + t.h[2] * f + t.r[2] * r + t.u[2] * u]);
      const poly = (pts: [number, number, number][], fill: string, stroke: string) => {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };
      const body = [at(L, 0, 0), at(-B, -W, 0), at(-B * 0.4, 0, 0), at(-B, W, 0)];
      const fin = [at(L * 0.2, 0, 0), at(-B, 0, 0), at(-B, 0, W * 1.1)];
      const fill = t.pen ? pal.turtle : pal.sheet;
      const stroke = t.pen ? pal.ink : pal.turtle;
      // płetwa grzbietowa pokazuje, gdzie żółw ma „górę”; rysowana po kadłubie, gdy patrzymy z góry
      const eyeAbove = (() => {
        const ce = Math.cos(cam.el);
        const ex = cam.t[0] + ce * Math.sin(cam.az) * cam.dist - t.pos[0];
        const ey = cam.t[1] - ce * Math.cos(cam.az) * cam.dist - t.pos[1];
        const ez = cam.t[2] + Math.sin(cam.el) * cam.dist - t.pos[2];
        return ex * t.u[0] + ey * t.u[1] + ez * t.u[2] >= 0;
      })();
      if (eyeAbove) { poly(body, fill, stroke); poly(fin, pal.sheet, stroke); }
      else { poly(fin, pal.sheet, stroke); poly(body, fill, stroke); }
    }
  }
}

export function drawScene(
  ctx: CanvasRenderingContext2D, w: number, h: number, scene: Scene,
  cam2: Cam2, cam3: Cam3, pal: Palette, ins: Insets, deco = true,
) {
  ctx.save();
  ctx.fillStyle = pal.sheet;
  ctx.fillRect(0, 0, w, h);
  if (scene.mode === "2d") draw2(ctx, w, h, scene, cam2, pal, deco);
  else draw3(ctx, w, h, scene, cam3, pal, deco, w / 2 + (ins.left - ins.right) / 2, h / 2 + (ins.top - ins.bottom) / 2);
  ctx.restore();
}

const ZERO: Insets = { top: 0, right: 0, bottom: 0, left: 0 };

export class SheetView {
  canvas: HTMLCanvasElement;
  scene: Scene = { mode: "2d", segments: [], target: null, turtle: null };
  cam2: Cam2 = { x: 0, y: 0, scale: 1.5 };
  cam3: Cam3 = { az: DEFAULT_AZ, el: DEFAULT_EL, dist: 500, t: [0, 0, 0] };
  insets: Insets = { ...ZERO };
  palette: Palette;
  onCamera: () => void = () => {};
  /** true, dopóki użytkownik sam nie ruszył widoku: wtedy zmiana rozmiaru dopasowuje rysunek ponownie */
  auto = true;
  w = 300;
  h = 200;
  private ctx: CanvasRenderingContext2D;
  private dirty = false;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinch = 0;

  constructor(canvas: HTMLCanvasElement, palette: Palette) {
    this.canvas = canvas;
    this.palette = palette;
    this.ctx = canvas.getContext("2d")!;
    new ResizeObserver(() => this.resize()).observe(canvas);
    this.resize();
    this.bind();
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.w = r.width;
    this.h = r.height;
    const pw = Math.round(r.width * dpr), ph = Math.round(r.height * dpr);
    if (this.canvas.width !== pw || this.canvas.height !== ph) {
      this.canvas.width = pw;
      this.canvas.height = ph;
    }
    if (this.auto) this.fit(true);
    this.drawNow();
  }

  invalidate() {
    if (this.dirty) return;
    this.dirty = true;
    requestAnimationFrame(() => this.drawNow());
  }

  drawNow() {
    this.dirty = false;
    const dpr = this.canvas.width / this.w;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawScene(this.ctx, this.w, this.h, this.scene, this.cam2, this.cam3, this.palette, this.insets);
  }

  fit(keepAuto = false) {
    if (this.scene.mode === "2d") this.cam2 = fit2(this.scene, this.w, this.h, this.insets);
    else this.cam3 = fit3(this.scene, this.w, this.h, this.insets, this.cam3.az, this.cam3.el);
    if (!keepAuto) this.auto = true;
    this.changed(true);
  }

  resetCamera() {
    this.cam3.az = DEFAULT_AZ;
    this.cam3.el = DEFAULT_EL;
    this.fit();
  }

  zoomBy(f: number, px = this.w / 2, py = this.h / 2) {
    if (this.scene.mode === "2d") {
      const c = this.cam2;
      const ns = Math.min(200, Math.max(0.002, c.scale * f));
      const wx = c.x + (px - this.w / 2) / c.scale, wy = c.y - (py - this.h / 2) / c.scale;
      c.x = wx - (px - this.w / 2) / ns;
      c.y = wy + (py - this.h / 2) / ns;
      c.scale = ns;
    } else {
      this.cam3.dist = Math.min(600000, Math.max(5, this.cam3.dist / f));
    }
    this.changed();
  }

  panBy(dx: number, dy: number) {
    if (this.scene.mode === "2d") {
      this.cam2.x -= dx / this.cam2.scale;
      this.cam2.y += dy / this.cam2.scale;
    } else {
      const c = this.cam3;
      const k = c.dist / (this.h / 2 / Math.tan(HALF_FOV));
      const sa = Math.sin(c.az), ca = Math.cos(c.az), se = Math.sin(c.el), ce = Math.cos(c.el);
      c.t[0] += (-dx * ca + dy * -se * sa) * k;
      c.t[1] += (-dx * sa + dy * se * ca) * k;
      c.t[2] += dy * ce * k;
    }
    this.changed();
  }

  orbitBy(dx: number, dy: number) {
    const c = this.cam3;
    c.az -= dx * 0.008;
    c.el = Math.min(1.553, Math.max(-1.553, c.el + dy * 0.008));
    this.changed();
  }

  scaleLabel(): string {
    if (this.scene.mode === "3d") return `odl. ${Math.round(this.cam3.dist)}`;
    const s = this.cam2.scale;
    const f = (v: number) => (v >= 10 ? String(Math.round(v)) : String(Math.round(v * 10) / 10).replace(".", ","));
    return s >= 1 ? `${f(s)}:1` : `1:${f(1 / s)}`;
  }

  private changed(keepAuto = false) {
    if (!keepAuto) this.auto = false;
    this.onCamera();
    this.invalidate();
  }

  private bind() {
    const c = this.canvas;
    const local = (e: { clientX: number; clientY: number }) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    c.addEventListener("pointerdown", (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, local(e));
      this.pinch = 0;
      c.classList.add("is-dragging");
    });
    c.addEventListener("pointermove", (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const now = local(e);
      this.pointers.set(e.pointerId, now);
      if (this.pointers.size === 1) {
        const dx = now.x - prev.x, dy = now.y - prev.y;
        if (this.scene.mode === "3d" && !e.shiftKey && !(e.buttons & 6)) this.orbitBy(dx, dy);
        else this.panBy(dx, dy);
      } else if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if (this.pinch > 0 && d > 0) this.zoomBy(d / this.pinch, mx, my);
        this.pinch = d;
        this.panBy((now.x - prev.x) / 2, (now.y - prev.y) / 2);
      }
    });
    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      this.pinch = 0;
      if (!this.pointers.size) c.classList.remove("is-dragging");
    };
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    c.addEventListener("contextmenu", (e) => e.preventDefault());
    c.addEventListener("wheel", (e) => {
      e.preventDefault();
      const p = local(e);
      const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
      this.zoomBy(Math.exp(-d * 0.0015), p.x, p.y);
    }, { passive: false });
    c.addEventListener("dblclick", () => this.fit());
    c.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const step = 24;
      const move = (dx: number, dy: number) => {
        if (this.scene.mode === "3d" && !e.shiftKey) this.orbitBy(dx, dy);
        else this.panBy(dx, dy);
      };
      switch (e.key) {
        case "ArrowLeft": move(step, 0); break;
        case "ArrowRight": move(-step, 0); break;
        case "ArrowUp": move(0, step); break;
        case "ArrowDown": move(0, -step); break;
        case "+": case "=": this.zoomBy(1.25); break;
        case "-": case "_": this.zoomBy(0.8); break;
        case "0": this.fit(); break;
        default: return;
      }
      e.preventDefault();
    });
  }

  /** Obraz PNG bieżącego widoku, bez żółwia, w podwójnej rozdzielczości. */
  toPNG(): Promise<Blob | null> {
    const k = 2;
    const off = document.createElement("canvas");
    off.width = Math.round(this.w * k);
    off.height = Math.round(this.h * k);
    const ctx = off.getContext("2d")!;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    drawScene(ctx, this.w, this.h, { ...this.scene, turtle: null }, this.cam2, this.cam3, this.palette, this.insets);
    return new Promise((res) => off.toBlob(res, "image/png"));
  }
}
