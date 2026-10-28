export type Vec3 = [number, number, number];

/** Sine of `rem` degrees for 0 ≤ rem ≤ 90, exact where it can be. */
function sinQuarter(rem: number): number {
  if (rem === 0) return 0;
  if (rem === 90) return 1;
  if (rem === 30) return 0.5;
  if (rem === 45) return Math.SQRT1_2;
  return Math.sin((rem * Math.PI) / 180);
}

/**
 * Sine and cosine of an angle in degrees. Exact for multiples of 90° (and
 * for 30°/60°/45° steps where possible), and symmetric across quadrants, so
 * that squares and other regular figures close precisely.
 */
export function sinCosDeg(deg: number): [number, number] {
  let r = deg % 360;
  if (r < 0) r += 360;
  if (r >= 360) r -= 360;
  const q = Math.floor(r / 90);
  const rem = r - q * 90;
  const s = sinQuarter(rem);
  const c = sinQuarter(90 - rem);
  switch (q) {
    case 0: return [s, c];
    case 1: return [c, -s];
    case 2: return [-s, -c];
    default: return [-c, s];
  }
}

/** Normalises an angle to [0, 360). */
export function normDeg(deg: number): number {
  let r = deg % 360;
  if (r < 0) r += 360;
  if (r >= 360) r -= 360;
  return r;
}
