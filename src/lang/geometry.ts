export type Vec3 = [number, number, number];

/**
 * Sinus i cosinus kąta w stopniach. Dla wielokrotności 30° wartości
 * „okrągłe” (0, ±0,5, ±1) są dokładne, dzięki czemu np. kwadrat
 * wraca dokładnie do punktu startu.
 */
export function sinCosDeg(deg: number): [number, number] {
  let r = deg % 360;
  if (r < 0) r += 360;
  switch (r) {
    case 0: return [0, 1];
    case 30: return [0.5, Math.cos(Math.PI / 6)];
    case 60: return [Math.sin(Math.PI / 3), 0.5];
    case 90: return [1, 0];
    case 120: return [Math.sin(Math.PI / 3), -0.5];
    case 150: return [0.5, -Math.cos(Math.PI / 6)];
    case 180: return [0, -1];
    case 210: return [-0.5, -Math.cos(Math.PI / 6)];
    case 240: return [-Math.sin(Math.PI / 3), -0.5];
    case 270: return [-1, 0];
    case 300: return [-Math.sin(Math.PI / 3), 0.5];
    case 330: return [-0.5, Math.cos(Math.PI / 6)];
  }
  const rad = (r * Math.PI) / 180;
  return [Math.sin(rad), Math.cos(rad)];
}

/**
 * Obraca parę prostopadłych wektorów (a, b) w ich płaszczyźnie o kąt
 * w stopniach, od a w stronę b: a' = a·cos + b·sin, b' = b·cos − a·sin.
 */
export function rotatePair(a: Vec3, b: Vec3, deg: number): [Vec3, Vec3] {
  const [s, c] = sinCosDeg(deg);
  return [
    [a[0] * c + b[0] * s, a[1] * c + b[1] * s, a[2] * c + b[2] * s],
    [b[0] * c - a[0] * s, b[1] * c - a[1] * s, b[2] * c - a[2] * s],
  ];
}

export const clean = (v: number) => (v === 0 ? 0 : v); // usuwa −0
