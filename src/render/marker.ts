import type { TurtleState } from '../lang/interpreter';
import type { Palette } from './scene';

/**
 * Draws the 2D turtle at screen point (x, y). `ang` is the heading on screen
 * in radians, 0 pointing up and growing clockwise.
 */
export function drawTurtle2D(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ang: number,
  t: TurtleState,
  pal: Palette,
  px = 1,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.scale(px, px);
  ctx.globalAlpha = t.pen ? 1 : 0.72;
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = pal.turtleOutline;
  ctx.lineJoin = 'round';

  // Legs and head.
  ctx.fillStyle = pal.turtleBottom;
  const leg = (lx: number, ly: number, rot: number) => {
    ctx.beginPath();
    ctx.ellipse(lx, ly, 2.6, 3.8, rot, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };
  leg(-7, -5, -0.6);
  leg(7, -5, 0.6);
  leg(-7, 6, 0.6);
  leg(7, 6, -0.6);
  ctx.beginPath();
  ctx.moveTo(-1.8, 9);
  ctx.lineTo(0, 13.5);
  ctx.lineTo(1.8, 9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, -12, 3.6, 4.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Shell.
  ctx.beginPath();
  ctx.ellipse(0, 0, 7.4, 9.6, 0, 0, Math.PI * 2);
  ctx.fillStyle = pal.turtle;
  ctx.fill();
  if (!t.pen) ctx.setLineDash([2.2, 2]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = pal.turtleTop;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -5.5);
  ctx.lineTo(4, -2.5);
  ctx.lineTo(4, 2.5);
  ctx.lineTo(0, 5.5);
  ctx.lineTo(-4, 2.5);
  ctx.lineTo(-4, -2.5);
  ctx.closePath();
  ctx.stroke();

  // Pen: a dot in the current colour, hollow when the pen is up.
  ctx.beginPath();
  ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
  if (t.pen) {
    ctx.fillStyle = t.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.9;
    ctx.stroke();
  } else {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  ctx.restore();
}

export interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
}

/**
 * Draws the 3D turtle as a small dart: a flat body pointing along the heading
 * (light on its upper side, dark underneath) and a fin pointing along the up
 * vector, so heading, roll and pitch are all visible.
 */
export function drawTurtle3D(
  ctx: CanvasRenderingContext2D,
  t: TurtleState,
  size: number,
  project: (p: readonly number[]) => ProjectedPoint | null,
  toCamera: (p: readonly number[]) => [number, number, number],
  pal: Palette,
  px = 1,
): void {
  const { pos: p, h, r, u } = t;
  const at = (a: number, b: number, c: number): number[] => [
    p[0] + (h[0] * a + r[0] * b + u[0] * c) * size,
    p[1] + (h[1] * a + r[1] * b + u[1] * c) * size,
    p[2] + (h[2] * a + r[2] * b + u[2] * c) * size,
  ];
  const nose = at(1, 0, 0);
  const left = at(-0.65, -0.62, 0);
  const right = at(-0.65, 0.62, 0);
  const notch = at(-0.35, 0, 0);
  const finFront = at(0.25, 0, 0);
  const finTop = at(-0.55, 0, 0.55);
  const finBack = at(-0.5, 0, 0);

  // Is the upper side of the body facing the camera?
  const camP = toCamera(p);
  const camU = toCamera([p[0] + u[0], p[1] + u[1], p[2] + u[2]]);
  const upTowardsViewer = (camU[2] - camP[2]) < 0;

  const faces: { pts: number[][]; fill: string; depth: number }[] = [
    { pts: [nose, left, notch], fill: upTowardsViewer ? pal.turtleTop : pal.turtleBottom, depth: 0 },
    { pts: [nose, notch, right], fill: upTowardsViewer ? pal.turtleTop : pal.turtleBottom, depth: 0 },
    { pts: [finFront, finTop, finBack], fill: pal.turtleFin, depth: 0 },
  ];
  const projected = faces.map((f) => {
    const pts = f.pts.map(project);
    const depth = f.pts.reduce((acc, q) => acc + toCamera(q)[2], 0) / f.pts.length;
    return { ...f, proj: pts, depth };
  });
  if (projected.some((f) => f.proj.some((q) => q === null))) return;
  // A soft halo marks the position even when the dart is seen edge-on.
  const centre = project(p);
  if (centre) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centre.x, centre.y, 15 * px, 0, Math.PI * 2);
    ctx.fillStyle = pal.turtle;
    ctx.globalAlpha = 0.16;
    ctx.fill();
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.2 * px;
    ctx.strokeStyle = pal.turtle;
    ctx.stroke();
    ctx.restore();
  }
  // Body faces first when the fin is in front, by average depth.
  projected.sort((a, b) => b.depth - a.depth);
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.globalAlpha = t.pen ? 1 : 0.75;
  for (const f of projected) {
    ctx.beginPath();
    f.proj.forEach((q, i) => (i ? ctx.lineTo(q!.x, q!.y) : ctx.moveTo(q!.x, q!.y)));
    ctx.closePath();
    ctx.fillStyle = f.fill;
    ctx.fill();
    ctx.strokeStyle = pal.turtleOutline;
    ctx.lineWidth = 1.6 * px;
    if (!t.pen) ctx.setLineDash([3 * px, 2.5 * px]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // Pen dot at the turtle's position.
  const c = project(p);
  if (c) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 3 * px, 0, Math.PI * 2);
    if (t.pen) {
      ctx.fillStyle = t.color;
      ctx.fill();
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2 * px;
    ctx.stroke();
  }
  ctx.restore();
}
