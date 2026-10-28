import type { Segment, TurtleState, Vec3 } from '../lang';
import { palette } from './theme';
import { CanvasView, attachGestures, niceCeil, segmentBounds } from './view';

// Widok przestrzenny rysowany na zwykłym płótnie 2D (rzut perspektywiczny) –
// dzięki temu nie wymaga WebGL i działa wszędzie tam, gdzie działa 2D.

const FOV = (40 * Math.PI) / 180;
const MIN_DIST = 0.5;
const MAX_DIST = 2_000_000;
const MAX_PITCH = (89 * Math.PI) / 180;

const DEFAULT_YAW = (28 * Math.PI) / 180;
const DEFAULT_PITCH = (24 * Math.PI) / 180;

interface Basis {
  pos: Vec3;
  right: Vec3;
  up: Vec3;
  fwd: Vec3;
  focal: number;
  near: number;
}

export class View3D extends CanvasView {
  private target: Vec3 = [0, 0, 60];
  private dist = 420;
  private yaw = DEFAULT_YAW;
  private pitch = DEFAULT_PITCH;

  constructor() {
    super(
      'Widok przestrzenny 3D. Strzałki obracają, Shift ze strzałkami przesuwa, plus i minus przybliżają, F dopasowuje, 0 przywraca widok.',
    );
    this.el.classList.add('view-3d');
    attachGestures(this.el, {
      drag: (dx, dy, e) => {
        if (e.buttons & 2 || e.buttons & 4 || e.shiftKey) this.pan(dx, dy);
        else this.orbit(dx, dy);
      },
      pinch: (factor, _mx, _my, dx, dy) => {
        this.dist = Math.min(MAX_DIST, Math.max(MIN_DIST, this.dist / factor));
        this.pan(dx, dy);
      },
      wheel: (deltaY) => {
        this.dist = Math.min(MAX_DIST, Math.max(MIN_DIST, this.dist * Math.exp(deltaY * 0.0014)));
        this.userNavigated();
        this.requestDraw();
      },
      key: (e) => this.onKey(e),
    });
  }

  protected onResized(first: boolean): void {
    if (first) this.resetView();
    else if (this.autoFit) this.fit();
  }

  private orbit(dx: number, dy: number): void {
    this.yaw -= dx * 0.008;
    this.pitch = Math.min(MAX_PITCH, Math.max(-MAX_PITCH, this.pitch + dy * 0.008));
    this.userNavigated();
    this.requestDraw();
  }

  private pan(dx: number, dy: number): void {
    const b = this.basis();
    const k = this.dist / b.focal;
    for (let i = 0; i < 3; i++) this.target[i] += -dx * k * b.right[i] + dy * k * b.up[i];
    this.userNavigated();
    this.requestDraw();
  }

  private onKey(e: KeyboardEvent): boolean {
    const a = (5 * Math.PI) / 180;
    switch (e.key) {
      case 'ArrowLeft':
        if (e.shiftKey) this.pan(40, 0);
        else this.orbit(-a / 0.008, 0);
        return true;
      case 'ArrowRight':
        if (e.shiftKey) this.pan(-40, 0);
        else this.orbit(a / 0.008, 0);
        return true;
      case 'ArrowUp':
        if (e.shiftKey) this.pan(0, 40);
        else this.orbit(0, -a / 0.008);
        return true;
      case 'ArrowDown':
        if (e.shiftKey) this.pan(0, -40);
        else this.orbit(0, a / 0.008);
        return true;
      case '+':
      case '=':
        this.zoomBy(1.25);
        return true;
      case '-':
      case '_':
        this.zoomBy(0.8);
        return true;
      case 'f':
      case 'F':
        this.fit();
        return true;
      case '0':
      case 'Home':
        this.resetView();
        return true;
    }
    return false;
  }

  zoomBy(factor: number): void {
    this.dist = Math.min(MAX_DIST, Math.max(MIN_DIST, this.dist / factor));
    this.userNavigated();
    this.requestDraw();
  }

  resetView(): void {
    this.fitTarget = null;
    this.yaw = DEFAULT_YAW;
    this.pitch = DEFAULT_PITCH;
    this.target = [0, 0, 60];
    this.dist = 420;
    this.autoFit = true;
    this.requestDraw();
  }

  describe(): string {
    const n = this.scene.segments.length;
    return n === 0 ? 'Pusty rysunek' : `Rysunek 3D: ${n} odcink${n === 1 ? '' : n < 5 ? 'i' : 'ów'}`;
  }

  // ───────────────────────── kamera ─────────────────────────

  private basisFor(target: Vec3, dist: number, yaw: number, pitch: number): Basis {
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const pos: Vec3 = [
      target[0] + dist * sy * cp,
      target[1] - dist * cy * cp,
      target[2] + dist * sp,
    ];
    const fwd: Vec3 = [-sy * cp, cy * cp, -sp];
    const right: Vec3 = [cy, sy, 0];
    const up: Vec3 = [-sy * sp, cy * sp, cp];
    const focal = (0.5 * Math.min(this.w, this.h * 1.15)) / Math.tan(FOV / 2);
    return { pos, right, up, fwd, focal, near: dist * 0.01 };
  }

  private basis(): Basis {
    return this.basisFor(this.target, this.dist, this.yaw, this.pitch);
  }

  /** Rzut punktu; zwraca [x, y, głębokość] albo null, gdy punkt jest za kamerą. */
  private project(b: Basis, p: Vec3, out: Vec3): boolean {
    const vx = p[0] - b.pos[0];
    const vy = p[1] - b.pos[1];
    const vz = p[2] - b.pos[2];
    const z = vx * b.fwd[0] + vy * b.fwd[1] + vz * b.fwd[2];
    if (z <= b.near) return false;
    const x = vx * b.right[0] + vy * b.right[1] + vz * b.right[2];
    const y = vx * b.up[0] + vy * b.up[1] + vz * b.up[2];
    out[0] = this.w / 2 + (x / z) * b.focal;
    out[1] = this.h / 2 - (y / z) * b.focal;
    out[2] = z;
    return true;
  }

  /** Rzutuje odcinek z obcięciem do płaszczyzny bliskiej. */
  private projectSegment(b: Basis, a: Vec3, c: Vec3, pa: Vec3, pc: Vec3): boolean {
    const da = (a[0] - b.pos[0]) * b.fwd[0] + (a[1] - b.pos[1]) * b.fwd[1] + (a[2] - b.pos[2]) * b.fwd[2];
    const dc = (c[0] - b.pos[0]) * b.fwd[0] + (c[1] - b.pos[1]) * b.fwd[1] + (c[2] - b.pos[2]) * b.fwd[2];
    if (da <= b.near && dc <= b.near) return false;
    let from = a;
    let to = c;
    if (da <= b.near) {
      const t = (b.near * 1.0001 - da) / (dc - da);
      from = [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t];
    } else if (dc <= b.near) {
      const t = (b.near * 1.0001 - dc) / (da - dc);
      to = [c[0] + (a[0] - c[0]) * t, c[1] + (a[1] - c[1]) * t, c[2] + (a[2] - c[2]) * t];
    }
    return this.project(b, from, pa) && this.project(b, to, pc);
  }

  protected doFit(segments: Segment[], includeTurtle: boolean): void {
    const { ghost, turtle } = this.scene;
    const extra: Vec3[] | undefined = includeTurtle && turtle && segments.length > 0 ? [turtle.pos] : undefined;
    const bounds = segmentBounds(ghost ? segments.concat(ghost) : segments, extra);
    if (!bounds || this.w === 0 || this.h === 0) {
      this.resetView();
      return;
    }
    const pts: Vec3[] = [];
    const all = ghost ? segments.concat(ghost) : segments;
    for (const s of all) pts.push(s.from, s.to);
    if (extra) pts.push(...extra);

    const center: Vec3 = [
      (bounds.min[0] + bounds.max[0]) / 2,
      (bounds.min[1] + bounds.max[1]) / 2,
      (bounds.min[2] + bounds.max[2]) / 2,
    ];
    const size = Math.max(
      bounds.max[0] - bounds.min[0],
      bounds.max[1] - bounds.min[1],
      bounds.max[2] - bounds.min[2],
      1e-6,
    );
    const pad = Math.max(30, Math.min(this.w, this.h) * 0.09);
    const tmp: Vec3 = [0, 0, 0];

    const fits = (c: Vec3, d: number): boolean => {
      const b = this.basisFor(c, d, this.yaw, this.pitch);
      for (const p of pts) {
        if (!this.project(b, p, tmp)) return false;
        if (Math.abs(tmp[0] - this.w / 2) > this.w / 2 - pad) return false;
        if (Math.abs(tmp[1] - this.h / 2) > this.h / 2 - pad) return false;
      }
      return true;
    };

    let c = center;
    let d = size * 2;
    for (let iter = 0; iter < 3; iter++) {
      let lo = size * 0.05 + 1e-6;
      let hi = size * 200 + 10;
      for (let k = 0; k < 40; k++) {
        const mid = Math.sqrt(lo * hi);
        if (fits(c, mid)) hi = mid;
        else lo = mid;
      }
      d = hi;
      // wyśrodkuj rzut na ekranie
      const b = this.basisFor(c, d, this.yaw, this.pitch);
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const p of pts) {
        if (!this.project(b, p, tmp)) continue;
        minX = Math.min(minX, tmp[0]);
        maxX = Math.max(maxX, tmp[0]);
        minY = Math.min(minY, tmp[1]);
        maxY = Math.max(maxY, tmp[1]);
      }
      const offX = (minX + maxX) / 2 - this.w / 2;
      const offY = (minY + maxY) / 2 - this.h / 2;
      const k = d / b.focal;
      c = [
        c[0] + offX * k * b.right[0] - offY * k * b.up[0],
        c[1] + offX * k * b.right[1] - offY * k * b.up[1],
        c[2] + offX * k * b.right[2] - offY * k * b.up[2],
      ];
    }
    this.target = c;
    this.dist = Math.min(MAX_DIST, Math.max(MIN_DIST, d * 1.02));
    this.autoFit = true;
    this.requestDraw();
  }

  // ───────────────────────── rysowanie ─────────────────────────

  protected draw(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const pal = palette();
    const b = this.basis();
    ctx.fillStyle = pal.paper;
    ctx.fillRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (!this.minimal) this.drawGroundAndAxes(ctx, b);

    const pa: Vec3 = [0, 0, 0];
    const pc: Vec3 = [0, 0, 0];
    const { segments, ghost, turtle } = this.scene;

    if (ghost && ghost.length) {
      ctx.save();
      ctx.strokeStyle = pal.ghost;
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([7, 6]);
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (const s of ghost) {
        if (this.projectSegment(b, s.from, s.to, pa, pc)) {
          ctx.moveTo(pa[0], pa[1]);
          ctx.lineTo(pc[0], pc[1]);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    let style = '';
    let open = false;
    let lastX = NaN;
    let lastY = NaN;
    for (const s of segments) {
      if (!this.projectSegment(b, s.from, s.to, pa, pc)) continue;
      const st = `${s.color}${s.width}`;
      if (st !== style) {
        if (open) ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        style = st;
        open = true;
        lastX = NaN;
      }
      if (pa[0] !== lastX || pa[1] !== lastY) ctx.moveTo(pa[0], pa[1]);
      ctx.lineTo(pc[0], pc[1]);
      lastX = pc[0];
      lastY = pc[1];
    }
    if (open) ctx.stroke();

    if (turtle && !this.minimal) this.drawTurtle(ctx, b, turtle);
  }

  private drawGroundAndAxes(ctx: CanvasRenderingContext2D, b: Basis): void {
    const pal = palette();
    const reach = Math.max(
      this.dist * 0.75,
      Math.abs(this.target[0]) * 1.3,
      Math.abs(this.target[1]) * 1.3,
    );
    const extent = niceCeil(reach);
    const step = extent / 10;
    const a: Vec3 = [0, 0, 0];
    const c: Vec3 = [0, 0, 0];

    const line = (p: Vec3, q: Vec3) => {
      if (this.projectSegment(b, p, q, a, c)) {
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(c[0], c[1]);
      }
    };

    ctx.lineWidth = 1;
    for (const major of [false, true]) {
      ctx.beginPath();
      ctx.strokeStyle = major ? pal.gridMajor : pal.gridMinor;
      for (let i = -10; i <= 10; i++) {
        if ((i % 5 === 0) !== major) continue;
        const v = i * step;
        line([v, -extent, 0], [v, extent, 0]);
        line([-extent, v, 0], [extent, v, 0]);
      }
      ctx.stroke();
    }

    // osie: dodatnie części kolorowe, ujemne cienkie i blade
    const axes: { dir: Vec3; color: string; label: string; len: number }[] = [
      { dir: [1, 0, 0], color: pal.axisX, label: 'X', len: extent },
      { dir: [0, 1, 0], color: pal.axisY, label: 'Y', len: extent },
      { dir: [0, 0, 1], color: pal.axisZ, label: 'Z', len: extent * 0.8 },
    ];
    ctx.font = 'bold 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const ax of axes) {
      const neg: Vec3 = [-ax.dir[0] * ax.len, -ax.dir[1] * ax.len, -ax.dir[2] * ax.len];
      const pos: Vec3 = [ax.dir[0] * ax.len, ax.dir[1] * ax.len, ax.dir[2] * ax.len];
      if (ax.label !== 'Z') {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = ax.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        line([0, 0, 0], neg);
        ctx.stroke();
        ctx.restore();
      }
      ctx.strokeStyle = ax.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      line([0, 0, 0], pos);
      ctx.stroke();
      const tip: Vec3 = [0, 0, 0];
      const lp: Vec3 = [pos[0] * 1.06, pos[1] * 1.06, pos[2] * 1.06];
      if (this.project(b, lp, tip)) {
        ctx.fillStyle = ax.color;
        ctx.fillText(ax.label, tip[0], tip[1]);
      }
    }
    const o: Vec3 = [0, 0, 0];
    if (this.project(b, [0, 0, 0], o)) {
      ctx.beginPath();
      ctx.fillStyle = pal.origin;
      ctx.arc(o[0], o[1], 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /** Żółw jako ostrosłup: czubek to nos, wierzchołek „grzbietu” wskazuje górę żółwia. */
  private drawTurtle(ctx: CanvasRenderingContext2D, b: Basis, t: TurtleState): void {
    const pal = palette();
    const s = this.dist * 0.032;
    const at = (f: number, r: number, u: number): Vec3 => [
      t.pos[0] + (t.fwd[0] * f + t.right[0] * r + t.up[0] * u) * s,
      t.pos[1] + (t.fwd[1] * f + t.right[1] * r + t.up[1] * u) * s,
      t.pos[2] + (t.fwd[2] * f + t.right[2] * r + t.up[2] * u) * s,
    ];
    const tip = at(1.7, 0, 0);
    const left = at(-0.9, -0.95, 0);
    const right = at(-0.9, 0.95, 0);
    const top = at(-0.6, 0, 0.9);
    const faces: { pts: Vec3[]; shade: number }[] = [
      { pts: [tip, left, right], shade: 0.55 },
      { pts: [tip, left, top], shade: 0.85 },
      { pts: [tip, top, right], shade: 1.0 },
      { pts: [left, right, top], shade: 0.7 },
    ];
    const proj = faces.map((f) => {
      const ps: Vec3[] = [];
      let depth = 0;
      for (const p of f.pts) {
        const o: Vec3 = [0, 0, 0];
        if (!this.project(b, p, o)) return null;
        ps.push(o);
        depth += o[2];
      }
      return { ps, depth: depth / ps.length, shade: f.shade };
    });
    if (proj.some((p) => !p)) return;
    const list = (proj as NonNullable<(typeof proj)[number]>[]).sort((x, y) => y.depth - x.depth);
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = pal.ink;
    for (const f of list) {
      ctx.beginPath();
      ctx.moveTo(f.ps[0][0], f.ps[0][1]);
      for (let i = 1; i < f.ps.length; i++) ctx.lineTo(f.ps[i][0], f.ps[i][1]);
      ctx.closePath();
      ctx.fillStyle = shadeColor(t.penDown ? t.color : '#9aa39f', f.shade);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }
}

function shadeColor(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * k));
  const b = Math.min(255, Math.round((n & 255) * k));
  return `rgb(${r},${g},${b})`;
}

