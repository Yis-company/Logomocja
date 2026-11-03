import type { Segment, Turtle, Vec } from '../lang/interp';

/** Co widok ma pokazać: odcinki, żółwia, ewentualnie wzór zadania. */
export interface Scene {
  segments: Segment[];
  turtle: Turtle;
  /** Ostatni odcinek rysowany w animacji: ułamek długości 0–1. */
  partial: { index: number; t: number } | null;
  ghost: Segment[] | null;
  /** Licznik zmian (np. `czyść`), żeby widok wiedział, kiedy zbudować geometrię od nowa. */
  version: number;
}

export interface View {
  readonly kind: '2d' | '3d';
  readonly element: HTMLElement;
  setScene(scene: Scene): void;
  fit(): void;
  zoomBy(f: number): void;
  resetView(): void;
  toPNG(): Promise<Blob | null>;
  /** Rysuje natychmiast (po zmianie sceny) i czeka, aż obraz trafi na ekran. */
  flush(): Promise<void>;
  onThemeChange(): void;
  setActive(active: boolean): void;
}

export function lerp(a: Vec, b: Vec, t: number): Vec {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Pozycja żółwia na ekranie w trakcie animowanego ruchu. */
export function shownTurtlePos(scene: Scene): Vec {
  const p = scene.partial;
  if (p && scene.segments[p.index]) {
    const s = scene.segments[p.index];
    return lerp(s.from, s.to, p.t);
  }
  return scene.turtle.pos;
}

export function cssVar(name: string, el: Element = document.documentElement): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

export const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
