import type { Segment } from '../lang/types';
import type { TurtleState } from '../lang/interpreter';

export interface Overlay {
  /** The target drawing, shown faintly under the user's lines. */
  ghost: Segment[];
  /** Parts of the target the user's drawing does not cover. */
  missing: Segment[];
  /** Parts of the user's drawing that are not in the target. */
  extra: Segment[];
}

export interface DrawingSurface {
  readonly kind: '2d' | '3d';
  readonly element: HTMLElement;
  setSegments(list: Segment[]): void;
  addSegment(seg: Segment): void;
  setPartial(p: { seg: Segment; t: number } | null): void;
  setTurtle(t: TurtleState | null): void;
  setOverlay(o: Overlay | null): void;
  fit(animate?: boolean): void;
  /** True when every segment is inside the visible area. */
  contentVisible(): boolean;
  zoomBy(factor: number): void;
  resetView(): void;
  /** True once the user moved the view by hand since the last fit. */
  userMoved: boolean;
  refreshTheme(): void;
  exportPNG(): Promise<Blob | null>;
  renderNow(): void;
  resize(): void;
  destroy(): void;
}

export function cssVar(name: string, el: Element = document.documentElement): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

export interface Bounds {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export function boundsOf(lists: Segment[][], extra: [number, number, number][] = []): Bounds | null {
  let b: Bounds | null = null;
  const add = (p: readonly number[]) => {
    if (!b) b = { minX: p[0]!, minY: p[1]!, minZ: p[2]!, maxX: p[0]!, maxY: p[1]!, maxZ: p[2]! };
    else {
      b.minX = Math.min(b.minX, p[0]!);
      b.minY = Math.min(b.minY, p[1]!);
      b.minZ = Math.min(b.minZ, p[2]!);
      b.maxX = Math.max(b.maxX, p[0]!);
      b.maxY = Math.max(b.maxY, p[1]!);
      b.maxZ = Math.max(b.maxZ, p[2]!);
    }
  };
  for (const list of lists) for (const s of list) {
    add(s.from);
    add(s.to);
  }
  for (const p of extra) add(p);
  return b;
}

/** Null when WebGL works; otherwise the reason, in Polish, why the 3D view is off. */
export function webglProblem(): string | null {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return 'Ta przeglądarka nie udostępnia WebGL, a widok przestrzeni go potrzebuje. Może być wyłączony w ustawieniach albo nieobsługiwany przez kartę graficzną.';
    return null;
  } catch {
    return 'Nie udało się uruchomić WebGL w tej przeglądarce, a widok przestrzeni go potrzebuje.';
  }
}
