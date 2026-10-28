import type { Mode, Segment, Turtle } from '../lang';

export interface ThemeColors {
  stage: string;
  grid: string;
  axis: string;
  axisText: string;
  ghost: string;
  turtleShell: string;
  turtleSkin: string;
  turtleEdge: string;
  dark: boolean;
}

export function themeColors(): ThemeColors {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    stage: v('--stage', '#fbf8f1'),
    grid: v('--stage-grid', 'rgba(60,50,30,0.07)'),
    axis: v('--stage-axis', 'rgba(60,50,30,0.35)'),
    axisText: v('--muted', '#5d6b68'),
    ghost: v('--ghost', 'rgba(193,118,61,0.22)'),
    turtleShell: v('--turtle-shell', '#2f8f4e'),
    turtleSkin: v('--turtle-skin', '#9bc77a'),
    turtleEdge: v('--turtle-edge', '#1c3d2b'),
    dark: document.documentElement.dataset.resolvedTheme === 'dark',
  };
}

/** Żółw widziany z góry: skorupa, głowa w kierunku ruchu i cztery łapki. */
export function drawTurtle2D(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  turtle: Turtle,
  col: ThemeColors,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = col.turtleEdge;
  ctx.fillStyle = col.turtleSkin;
  // łapki
  for (const [lx, ly] of [
    [-8, -6],
    [8, -6],
    [-8, 7],
    [8, 7],
  ]) {
    ctx.beginPath();
    ctx.ellipse(lx, ly, 3.4, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  // ogon
  ctx.beginPath();
  ctx.moveTo(-1.5, 10);
  ctx.lineTo(0, 14);
  ctx.lineTo(1.5, 10);
  ctx.fill();
  // głowa
  ctx.beginPath();
  ctx.ellipse(0, -13, 3.6, 4.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // skorupa
  ctx.fillStyle = col.turtleShell;
  ctx.beginPath();
  ctx.ellipse(0, 0, 7.5, 9.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // pióro: kolorowa kropka w środku, pusta gdy podniesione
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  if (turtle.penDown) {
    ctx.fillStyle = turtle.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  } else {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  ctx.restore();
}

/** Rzut punktu 3D na płaszczyznę miniatury (widok z ukosa, jak domyślna kamera). */
export function project3D(p: readonly number[]): [number, number] {
  const az = (-30 * Math.PI) / 180;
  const el = (32 * Math.PI) / 180;
  const x = p[0] * Math.cos(az) - p[1] * Math.sin(az);
  const y = p[0] * Math.sin(az) + p[1] * Math.cos(az);
  return [x, p[2] * Math.cos(el) + y * Math.sin(el)];
}

/** Rysuje odcinki dopasowane do prostokąta (miniatury, eksport PNG, wzorce wyzwań). */
export function paintFitted(
  ctx: CanvasRenderingContext2D,
  segments: Segment[],
  mode: Mode,
  w: number,
  h: number,
  opts: { background?: string; padding?: number; widthScale?: number; color?: string; alpha?: number } = {},
): void {
  if (opts.background) {
    ctx.fillStyle = opts.background;
    ctx.fillRect(0, 0, w, h);
  }
  if (!segments.length) return;
  const proj = mode === '3d' ? project3D : (p: readonly number[]) => [p[0], p[1]] as [number, number];
  const pts = segments.map((s) => [proj(s.from), proj(s.to)]);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [a, b] of pts) {
    for (const [x, y] of [a, b]) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  const pad = opts.padding ?? 12;
  const sw = Math.max(maxX - minX, 1e-6);
  const sh = Math.max(maxY - minY, 1e-6);
  const scale = Math.min((w - pad * 2) / sw, (h - pad * 2) / sh, 8);
  const ox = w / 2 - ((minX + maxX) / 2) * scale;
  const oy = h / 2 + ((minY + maxY) / 2) * scale;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (opts.alpha !== undefined) ctx.globalAlpha = opts.alpha;
  let key = '';
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const k = `${opts.color ?? s.color}|${s.width}`;
    if (k !== key) {
      if (key) ctx.stroke();
      key = k;
      ctx.strokeStyle = opts.color ?? s.color;
      ctx.lineWidth = Math.max(0.75, s.width * (opts.widthScale ?? 1));
      ctx.beginPath();
    }
    const [a, b] = pts[i];
    ctx.moveTo(ox + a[0] * scale, oy - a[1] * scale);
    ctx.lineTo(ox + b[0] * scale, oy - b[1] * scale);
  }
  if (key) ctx.stroke();
  ctx.restore();
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Nie udało się utworzyć obrazu.'))), 'image/png'),
  );
}

/** PNG z całym rysunkiem 2D, bez siatki i żółwia. */
export async function export2DPng(segments: Segment[], background: string): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scale = 2;
  const w = 1200;
  const h = 900;
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  paintFitted(ctx, segments, '2d', w, h, { background, padding: 48 });
  return canvasToBlob(canvas);
}
