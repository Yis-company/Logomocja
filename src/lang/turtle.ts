/** Żółw w przestrzeni: położenie oraz trzy wersory (kierunek, prawa strona, góra). */

export interface Segment {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  width: number;
}

export type Vec3 = [number, number, number];

export interface Pose {
  pos: Vec3;
  /** Kierunek ruchu (nos). */
  h: Vec3;
  /** Prawa strona. */
  r: Vec3;
  /** Góra żółwia. */
  u: Vec3;
  penDown: boolean;
  color: string;
  width: number;
}

export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;

/** Sinus i cosinus kąta w stopniach; wielokrotności 90° są dokładne. */
export function sinCosDeg(deg: number): [number, number] {
  let a = deg % 360;
  if (a < 0) a += 360;
  if (a === 0) return [0, 1];
  if (a === 90) return [1, 0];
  if (a === 180) return [0, -1];
  if (a === 270) return [-1, 0];
  const r = (a * Math.PI) / 180;
  return [Math.sin(r), Math.cos(r)];
}

export class Turtle {
  x = 0; y = 0; z = 0;
  hx = 0; hy = 1; hz = 0;
  rx = 1; ry = 0; rz = 0;
  ux = 0; uy = 0; uz = 1;
  penDown = true;
  color = DEFAULT_COLOR;
  width = DEFAULT_WIDTH;

  /** Przywraca położenie początkowe i orientację (pióro, kolor i grubość bez zmian). */
  resetOrientation(): void {
    this.x = 0; this.y = 0; this.z = 0;
    this.hx = 0; this.hy = 1; this.hz = 0;
    this.rx = 1; this.ry = 0; this.rz = 0;
    this.ux = 0; this.uy = 0; this.uz = 1;
  }

  /** Obrót w prawo (wokół wektora „góra”) o `deg` stopni. */
  yaw(deg: number): void {
    const [s, c] = sinCosDeg(deg);
    const { hx, hy, hz, rx, ry, rz } = this;
    this.hx = hx * c + rx * s; this.hy = hy * c + ry * s; this.hz = hz * c + rz * s;
    this.rx = rx * c - hx * s; this.ry = ry * c - hy * s; this.rz = rz * c - hz * s;
  }

  /** Uniesienie nosa (wokół wektora „prawo”) o `deg` stopni. */
  pitch(deg: number): void {
    const [s, c] = sinCosDeg(deg);
    const { hx, hy, hz, ux, uy, uz } = this;
    this.hx = hx * c + ux * s; this.hy = hy * c + uy * s; this.hz = hz * c + uz * s;
    this.ux = ux * c - hx * s; this.uy = uy * c - hy * s; this.uz = uz * c - hz * s;
  }

  /** Przechył w prawo (wokół kierunku ruchu) o `deg` stopni. */
  roll(deg: number): void {
    const [s, c] = sinCosDeg(deg);
    const { rx, ry, rz, ux, uy, uz } = this;
    this.ux = ux * c + rx * s; this.uy = uy * c + ry * s; this.uz = uz * c + rz * s;
    this.rx = rx * c - ux * s; this.ry = ry * c - uy * s; this.rz = rz * c - uz * s;
  }

  pose(): Pose {
    return {
      pos: [this.x, this.y, this.z],
      h: [this.hx, this.hy, this.hz],
      r: [this.rx, this.ry, this.rz],
      u: [this.ux, this.uy, this.uz],
      penDown: this.penDown,
      color: this.color,
      width: this.width,
    };
  }
}

export function initialPose(): Pose {
  return new Turtle().pose();
}

/** Obrót pozy o `deg` stopni — do animacji obrotów żółwia. */
export function rotatePose(p: Pose, axis: 'yaw' | 'pitch' | 'roll', deg: number): Pose {
  const t = new Turtle();
  [t.x, t.y, t.z] = p.pos;
  [t.hx, t.hy, t.hz] = p.h;
  [t.rx, t.ry, t.rz] = p.r;
  [t.ux, t.uy, t.uz] = p.u;
  t.penDown = p.penDown; t.color = p.color; t.width = p.width;
  if (axis === 'yaw') t.yaw(deg);
  else if (axis === 'pitch') t.pitch(deg);
  else t.roll(deg);
  return t.pose();
}
