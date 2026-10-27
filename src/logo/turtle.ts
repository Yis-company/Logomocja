export type Vec3 = [number, number, number];

/** Sine and cosine in degrees, exact for multiples of 90° so that square turns stay exact. */
export function sinCosDeg(deg: number): [number, number] {
  let r = deg % 360;
  if (r < 0) r += 360;
  if (r === 0) return [0, 1];
  if (r === 90) return [1, 0];
  if (r === 180) return [0, -1];
  if (r === 270) return [-1, 0];
  const rad = (r * Math.PI) / 180;
  return [Math.sin(rad), Math.cos(rad)];
}

export interface TurtleState {
  position: Vec3;
  heading: Vec3;
  right: Vec3;
  up: Vec3;
  penDown: boolean;
  color: string;
  width: number;
}

export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;

export function initialTurtle(): TurtleState {
  return {
    position: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    penDown: true,
    color: DEFAULT_COLOR,
    width: DEFAULT_WIDTH,
  };
}

export function cloneTurtle(t: TurtleState): TurtleState {
  return {
    position: [...t.position] as Vec3,
    heading: [...t.heading] as Vec3,
    right: [...t.right] as Vec3,
    up: [...t.up] as Vec3,
    penDown: t.penDown,
    color: t.color,
    width: t.width,
  };
}

/**
 * Rotates vector `a` towards vector `b` by `deg` degrees in the plane they span.
 * Returns the new pair [a', b'] with b' following so the frame stays orthonormal.
 */
export function rotatePair(a: Vec3, b: Vec3, deg: number): [Vec3, Vec3] {
  const [s, c] = sinCosDeg(deg);
  const a2: Vec3 = [a[0] * c + b[0] * s, a[1] * c + b[1] * s, a[2] * c + b[2] * s];
  const b2: Vec3 = [b[0] * c - a[0] * s, b[1] * c - a[1] * s, b[2] * c - a[2] * s];
  return [a2, b2];
}

/** Yaw: turn right (clockwise seen from above) by `deg` around the up vector. */
export function yaw(t: TurtleState, deg: number): void {
  const [h, r] = rotatePair(t.heading, t.right, deg);
  t.heading = h;
  t.right = r;
}

/** Pitch: nose up by `deg` around the right vector. */
export function pitch(t: TurtleState, deg: number): void {
  const [h, u] = rotatePair(t.heading, t.up, deg);
  t.heading = h;
  t.up = u;
}

export function advance(position: Vec3, heading: Vec3, distance: number): Vec3 {
  return [
    position[0] + heading[0] * distance,
    position[1] + heading[1] * distance,
    position[2] + heading[2] * distance,
  ];
}

/** Compass-style heading in degrees for a flat turtle (0 = +Y, 90 = +X), for the status bar. */
export function headingDegrees(t: TurtleState): number {
  const deg = (Math.atan2(t.heading[0], t.heading[1]) * 180) / Math.PI;
  const r = ((deg % 360) + 360) % 360;
  return Math.abs(r - 360) < 1e-9 ? 0 : r;
}
