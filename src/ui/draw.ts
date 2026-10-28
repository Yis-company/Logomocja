import type { Segment, Vec3 } from '../lang/interp';

/** Stan rysunku współdzielony między interpreterem a widokami. */
export interface Draw {
  segments: Segment[];
  version: number;
  pos: Vec3;
  h: Vec3;
  r: Vec3;
  u: Vec3;
  pen: boolean;
  /** Wzór zadania (półprzezroczysty). */
  ghost: Segment[] | null;
  ghostVersion: number;
  showTurtle: boolean;
}

export function newDraw(): Draw {
  return {
    segments: [], version: 0, pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1], pen: true,
    ghost: null, ghostVersion: 0, showTurtle: true,
  };
}

export interface View {
  readonly el: HTMLElement;
  invalidate(): void;
  /** Dopasowuje widok do podanych odcinków (domyślnie do całego rysunku i wzoru). */
  fit(segs?: Segment[]): void;
  /** Przywraca domyślny widok. */
  reset(): void;
  zoom(factor: number): void;
  toBlob(): Promise<Blob | null>;
  /** Czeka, aż aktualny stan zostanie narysowany. */
  settled(): Promise<void>;
}

export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function boundsOf(segs: Segment[], p: (v: Vec3) => [number, number]): [number, number, number, number] | null {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of segs) {
    for (const v of [s.from, s.to]) {
      const [x, y] = p(v);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return minX === Infinity ? null : [minX, minY, maxX, maxY];
}

export const isoProject = (v: Vec3): [number, number] => [(v[0] - v[1]) * 0.866, v[2] + (v[0] + v[1]) * 0.5];
export const flatProject = (v: Vec3): [number, number] => [v[0], v[1]];
