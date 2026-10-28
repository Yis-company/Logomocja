export type Vec3 = [number, number, number];

export interface Turtle {
  pos: Vec3;
  /** Direction of travel (the turtle's nose). */
  heading: Vec3;
  /** Points to the turtle's right side. Always heading × up. */
  right: Vec3;
  /** Points out of the turtle's back. */
  up: Vec3;
  pen: boolean;
  color: string;
  width: number;
}

export const DEFAULT_COLOUR = '#16866a';
export const DEFAULT_WIDTH = 3;

export function initialTurtle(): Turtle {
  return {
    pos: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    pen: true,
    color: DEFAULT_COLOUR,
    width: DEFAULT_WIDTH,
  };
}

/** Sine of an angle in degrees; exact at multiples of 90 so that square programs stay clean. */
function sinDeg(a: number): number {
  const m = (((a % 360) + 360) % 360);
  if (m === 0 || m === 180) return 0;
  if (m === 90) return 1;
  if (m === 270) return -1;
  return Math.sin((m * Math.PI) / 180);
}

function cosDeg(a: number): number {
  const m = (((a % 360) + 360) % 360);
  if (m === 0) return 1;
  if (m === 180) return -1;
  if (m === 90 || m === 270) return 0;
  return Math.cos((m * Math.PI) / 180);
}

export type Rotation = 'right' | 'left' | 'pitchUp' | 'pitchDown' | 'rollRight' | 'rollLeft';

function combine(a: Vec3, ca: number, b: Vec3, cb: number): Vec3 {
  return [a[0] * ca + b[0] * cb, a[1] * ca + b[1] * cb, a[2] * ca + b[2] * cb];
}

function normalise(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]);
  return len === 0 ? v : [v[0] / len, v[1] / len, v[2] / len];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

/**
 * Rotates the turtle in place. Positive angles: right turn (pw), nose up (gora),
 * roll right (pp), all measured with the right-hand rule around the axis named by the rotation.
 */
export function rotate(t: Turtle, kind: Rotation, degrees: number): void {
  const c = cosDeg(degrees);
  const s = sinDeg(degrees);
  const { heading: h, right: r, up: u } = t;
  switch (kind) {
    case 'right':
      t.heading = combine(h, c, r, s);
      t.right = combine(r, c, h, -s);
      break;
    case 'left':
      t.heading = combine(h, c, r, -s);
      t.right = combine(r, c, h, s);
      break;
    case 'pitchUp':
      t.heading = combine(h, c, u, s);
      t.up = combine(u, c, h, -s);
      break;
    case 'pitchDown':
      t.heading = combine(h, c, u, -s);
      t.up = combine(u, c, h, s);
      break;
    case 'rollRight':
      t.up = combine(u, c, r, s);
      t.right = combine(r, c, u, -s);
      break;
    case 'rollLeft':
      t.up = combine(u, c, r, -s);
      t.right = combine(r, c, u, s);
      break;
  }
  // Keep the frame orthonormal despite floating-point drift over long programs.
  t.heading = normalise(t.heading);
  t.right = normalise(t.right);
  t.up = normalise(cross(t.right, t.heading));
  t.right = normalise(cross(t.heading, t.up));
}

export function resetOrientation(t: Turtle): void {
  t.heading = [0, 1, 0];
  t.right = [1, 0, 0];
  t.up = [0, 0, 1];
}
