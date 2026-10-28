export type Vec3 = [number, number, number];

export const ORIGIN: Vec3 = [0, 0, 0];

export function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function scale(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}

/** Sum of two vectors each multiplied by a factor: `c * a + s * b`. */
export function combine(ca: number, a: Vec3, sb: number, b: Vec3): Vec3 {
  return [ca * a[0] + sb * b[0], ca * a[1] + sb * b[1], ca * a[2] + sb * b[2]];
}

const EPSILON = 1e-12;

/** Clears floating-point dust so that axis-aligned frames stay exactly axis-aligned. */
export function snap(v: Vec3): Vec3 {
  return [
    Math.abs(v[0]) < EPSILON ? 0 : v[0],
    Math.abs(v[1]) < EPSILON ? 0 : v[1],
    Math.abs(v[2]) < EPSILON ? 0 : v[2],
  ];
}

/** Sine and cosine of an angle in degrees. Multiples of 90 are exact. */
export function sinCos(degrees: number): [number, number] {
  const quarter = degrees / 90;
  if (Number.isInteger(quarter)) {
    switch (((quarter % 4) + 4) % 4) {
      case 0:
        return [0, 1];
      case 1:
        return [1, 0];
      case 2:
        return [0, -1];
      default:
        return [-1, 0];
    }
  }
  const radians = (degrees * Math.PI) / 180;
  return [Math.sin(radians), Math.cos(radians)];
}

/** Orientation of the turtle: a right-handed frame with right = heading × up. */
export interface Frame {
  heading: Vec3;
  right: Vec3;
  up: Vec3;
}

export function initialFrame(): Frame {
  return { heading: [0, 1, 0], right: [1, 0, 0], up: [0, 0, 1] };
}

/** Turns right (positive) or left (negative) around the up vector. */
export function yaw(f: Frame, degrees: number): Frame {
  const [s, c] = sinCos(degrees);
  return {
    heading: snap(combine(c, f.heading, s, f.right)),
    right: snap(combine(c, f.right, -s, f.heading)),
    up: f.up,
  };
}

/** Nose up (positive) or down (negative), around the right vector. */
export function pitch(f: Frame, degrees: number): Frame {
  const [s, c] = sinCos(degrees);
  return {
    heading: snap(combine(c, f.heading, s, f.up)),
    right: f.right,
    up: snap(combine(c, f.up, -s, f.heading)),
  };
}

/** Rolls right (positive) or left (negative), around the heading. */
export function roll(f: Frame, degrees: number): Frame {
  const [s, c] = sinCos(degrees);
  return {
    heading: f.heading,
    right: snap(combine(c, f.right, -s, f.up)),
    up: snap(combine(c, f.up, s, f.right)),
  };
}
