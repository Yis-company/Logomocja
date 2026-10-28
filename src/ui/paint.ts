import type { Segment, TurtleState } from '../lang';
import type { Vec3 } from '../lang/geometry';

/** Rzutowanie punktu świata na płaszczyznę rysunku (x w prawo, y w górę). */
export type Projection = (p: Vec3) => [number, number];

export const planar: Projection = (p) => [p[0], p[1]];

/** Rzut aksonometryczny dla podglądu 3D bez WebGL i miniatur. */
export function axonometric(azimuthDeg = -35, elevationDeg = 28): Projection {
  const a = (azimuthDeg * Math.PI) / 180, e = (elevationDeg * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a), ce = Math.cos(e), se = Math.sin(e);
  return (p) => {
    const x = p[0] * ca - p[1] * sa;
    const y = p[0] * sa + p[1] * ca; // głębokość
    return [x, p[2] * ce + y * se];
  };
}

export interface SceneFrame {
  segments: readonly Segment[];
  /** Odcinek właśnie rysowany (animacja). */
  partial: Segment | null;
  turtle: TurtleState | null;
  /** Wzór wyzwania rysowany pod spodem. */
  ghost: readonly Segment[] | null;
}

export const EMPTY_FRAME: SceneFrame = { segments: [], partial: null, turtle: null, ghost: null };

export interface ViewTransform {
  /** Punkt rysunku w środku płótna. */
  cx: number;
  cy: number;
  /** Piksele CSS na jednostkę. */
  scale: number;
}

export interface Palette {
  bg: string;
  grid: string;
  gridStrong: string;
  axisX: string;
  axisY: string;
  axisZ: string;
  text: string;
  ghost: string;
  turtle: string;
}

export function readPalette(el: Element = document.documentElement): Palette {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    bg: v('--stage-bg', '#fbf8f1'),
    grid: v('--stage-grid', '#ece5d6'),
    gridStrong: v('--stage-grid-strong', '#ddd3bf'),
    axisX: v('--axis-x', '#d0574a'),
    axisY: v('--axis-y', '#3d9a5b'),
    axisZ: v('--axis-z', '#3b78c4'),
    text: v('--stage-text', '#6f6a5f'),
    ghost: v('--ghost', 'rgba(120,110,90,.35)'),
    turtle: v('--turtle-outline', '#1d2b28'),
  };
}

export interface Bounds { minX: number; minY: number; maxX: number; maxY: number }

export function boundsOf(segments: readonly Segment[], project: Projection, extra: Vec3[] = []): Bounds | null {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const add = (p: Vec3) => {
    const [x, y] = project(p);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };
  for (const s of segments) { add(s.from); add(s.to); }
  for (const p of extra) add(p);
  return minX === Infinity ? null : { minX, minY, maxX, maxY };
}

export function fitTransform(b: Bounds | null, w: number, hgt: number, pad = 32): ViewTransform {
  if (!b) return { cx: 0, cy: 0, scale: Math.max(0.2, Math.min(w, hgt) / 360) };
  const bw = Math.max(b.maxX - b.minX, 1e-6), bh = Math.max(b.maxY - b.minY, 1e-6);
  const aw = Math.max(w - pad * 2, 20), ah = Math.max(hgt - pad * 2, 20);
  let scale = Math.min(aw / bw, ah / bh);
  // Pojedynczy punkt albo odcinek: nie przybliżaj w nieskończoność.
  const maxScale = Math.min(w, hgt) / 20;
  scale = Math.min(scale, maxScale);
  return { cx: (b.minX + b.maxX) / 2, cy: (b.minY + b.maxY) / 2, scale };
}

const NICE = [1, 2, 5];
export function gridStep(scale: number, minPx = 22): number {
  for (let exp = -3; exp < 8; exp++) {
    for (const n of NICE) {
      const step = n * 10 ** exp;
      if (step * scale >= minPx) return step;
    }
  }
  return 1e8;
}

export interface PaintOptions {
  grid: boolean;
  axes: boolean;
  /** Mnożnik grubości linii (miniatury). */
  widthScale: number;
  palette: Palette;
  project: Projection;
  /** Dla rzutu 3D – osie X, Y, Z zamiast krzyża osi. */
  axes3d?: boolean;
}

/** Rysuje scenę na kontekście 2D. Współrzędne kontekstu: piksele CSS. */
export function paintScene(
  ctx: CanvasRenderingContext2D, w: number, hgt: number,
  view: ViewTransform, frame: SceneFrame, opt: PaintOptions,
): void {
  const { palette: pal, project } = opt;
  const sx = (x: number) => w / 2 + (x - view.cx) * view.scale;
  const sy = (y: number) => hgt / 2 - (y - view.cy) * view.scale;
  const toScreen = (p: Vec3): [number, number] => {
    const [x, y] = project(p);
    return [sx(x), sy(y)];
  };

  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, hgt);

  if (opt.grid && !opt.axes3d) {
    const step = gridStep(view.scale);
    const x0 = view.cx - w / 2 / view.scale, x1 = view.cx + w / 2 / view.scale;
    const y0 = view.cy - hgt / 2 / view.scale, y1 = view.cy + hgt / 2 / view.scale;
    const lines = (strong: boolean) => {
      ctx.beginPath();
      const k = strong ? step * 5 : step;
      for (let x = Math.ceil(x0 / k) * k; x <= x1; x += k) {
        if (!strong && Math.abs(Math.round(x / step)) % 5 === 0) continue;
        const X = Math.round(sx(x)) + 0.5;
        ctx.moveTo(X, 0); ctx.lineTo(X, hgt);
      }
      for (let y = Math.ceil(y0 / k) * k; y <= y1; y += k) {
        if (!strong && Math.abs(Math.round(y / step)) % 5 === 0) continue;
        const Y = Math.round(sy(y)) + 0.5;
        ctx.moveTo(0, Y); ctx.lineTo(w, Y);
      }
      ctx.strokeStyle = strong ? pal.gridStrong : pal.grid;
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    lines(false);
    lines(true);
  }

  if (opt.axes) {
    ctx.lineWidth = 1.5;
    if (opt.axes3d) {
      const len = 60 / view.scale;
      const o = toScreen([0, 0, 0]);
      const axes: [Vec3, string, string][] = [
        [[len, 0, 0], pal.axisX, 'X'], [[0, len, 0], pal.axisY, 'Y'], [[0, 0, len], pal.axisZ, 'Z'],
      ];
      ctx.font = '600 11px system-ui, sans-serif';
      for (const [p, color, label] of axes) {
        const e = toScreen(p);
        ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(e[0], e[1]);
        ctx.strokeStyle = color; ctx.stroke();
        ctx.fillStyle = color;
        ctx.fillText(label, e[0] + 4, e[1] - 4);
      }
    } else {
      const ox = Math.round(sx(0)) + 0.5, oy = Math.round(sy(0)) + 0.5;
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy);
      ctx.strokeStyle = pal.axisX; ctx.globalAlpha = 0.55; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, hgt);
      ctx.strokeStyle = pal.axisY; ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = pal.text; ctx.fill();
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillStyle = pal.axisX; ctx.fillText('x', w - 14, oy - 6);
      ctx.fillStyle = pal.axisY; ctx.fillText('y', ox + 6, 14);
    }
  }

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (frame.ghost && frame.ghost.length) {
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = pal.ghost;
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (const s of frame.ghost) {
      const a = toScreen(s.from), b = toScreen(s.to);
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    ctx.stroke();
    ctx.restore();
  }

  const strokeSegments = (segs: readonly Segment[]) => {
    let open = false, color = '', width = 0;
    let lx = NaN, ly = NaN;
    for (const s of segs) {
      const a = toScreen(s.from), b = toScreen(s.to);
      if (!open || s.color !== color || s.width !== width) {
        if (open) ctx.stroke();
        color = s.color; width = s.width;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(0.75, width * opt.widthScale);
        ctx.beginPath();
        open = true;
        ctx.moveTo(a[0], a[1]);
      } else if (Math.abs(a[0] - lx) > 0.01 || Math.abs(a[1] - ly) > 0.01) {
        ctx.moveTo(a[0], a[1]);
      }
      ctx.lineTo(b[0], b[1]);
      lx = b[0]; ly = b[1];
    }
    if (open) ctx.stroke();
  };
  strokeSegments(frame.segments);
  if (frame.partial) strokeSegments([frame.partial]);

  if (frame.turtle) paintTurtle(ctx, frame.turtle, toScreen, pal);
}

function paintTurtle(
  ctx: CanvasRenderingContext2D, t: TurtleState,
  toScreen: (p: Vec3) => [number, number], pal: Palette,
): void {
  const p = toScreen(t.pos);
  const tip = toScreen([t.pos[0] + t.h[0], t.pos[1] + t.h[1], t.pos[2] + t.h[2]]);
  let dx = tip[0] - p[0], dy = tip[1] - p[1];
  const len = Math.hypot(dx, dy);
  ctx.save();
  ctx.setLineDash(t.pen ? [] : [3, 2.5]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = pal.turtle;
  if (len < 1e-9) {
    // Kierunek prosto na widza – sam okrąg.
    ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, Math.PI * 2);
    ctx.fillStyle = t.pen ? t.color : 'transparent';
    ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }
  dx /= len; dy /= len;
  const L = 17, W = 7;
  const nx = -dy, ny = dx;
  const bx = p[0] - dx * L * 0.45, by = p[1] - dy * L * 0.45;
  ctx.beginPath();
  ctx.moveTo(p[0] + dx * L * 0.65, p[1] + dy * L * 0.65);
  ctx.lineTo(bx + nx * W, by + ny * W);
  ctx.lineTo(p[0] - dx * L * 0.2, p[1] - dy * L * 0.2);
  ctx.lineTo(bx - nx * W, by - ny * W);
  ctx.closePath();
  ctx.fillStyle = t.pen ? t.color : pal.bg;
  ctx.globalAlpha = 0.92;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(p[0], p[1], 2.2, 0, Math.PI * 2);
  ctx.fillStyle = pal.turtle; ctx.fill();
  ctx.restore();
}

/** Rysuje statyczną miniaturę (przykłady, wyzwania, dokumentacja). */
export function paintThumbnail(
  canvas: HTMLCanvasElement, segments: readonly Segment[], project: Projection,
  opts: { pad?: number; ghost?: boolean; axes3d?: boolean } = {},
): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth || canvas.width, hgt = canvas.clientHeight || canvas.height;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(hgt * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const view = fitTransform(boundsOf(segments, project), w, hgt, opts.pad ?? 12);
  paintScene(ctx, w, hgt, view, {
    segments: opts.ghost ? [] : segments, partial: null, turtle: null, ghost: opts.ghost ? segments : null,
  }, {
    grid: false, axes: !!opts.axes3d, axes3d: opts.axes3d, widthScale: 0.7, palette: readPalette(canvas), project,
  });
}
