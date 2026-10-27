import type { Segment } from '../logo';
import type { TurtleState } from '../logo/turtle';

/** A drawing surface (2D canvas or 3D scene) that renders segments and the turtle. */
export interface Stage {
  readonly element: HTMLElement;
  /** Binds a (live) segment array; the stage re-reads it on invalidate(). */
  setSegments(segments: Segment[]): void;
  /** Tells the stage the bound array has changed (usually grown). */
  invalidate(): void;
  setTurtle(turtle: TurtleState | null): void;
  /** Frames the whole drawing in view. */
  fit(): void;
  setGrid(on: boolean): void;
  setVisible(visible: boolean): void;
  dispose(): void;
  /** Called whenever the user pans, zooms or orbits. */
  onUserInteraction: (() => void) | null;
}

export interface Bounds {
  min: [number, number, number];
  max: [number, number, number];
}

export function segmentBounds(segments: Segment[], turtle: TurtleState | null): Bounds | null {
  if (segments.length === 0 && !turtle) return null;
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  const add = (p: readonly [number, number, number]): void => {
    for (let i = 0; i < 3; i++) {
      if (p[i]! < min[i]!) min[i] = p[i]!;
      if (p[i]! > max[i]!) max[i] = p[i]!;
    }
  };
  for (const s of segments) {
    add(s.from);
    add(s.to);
  }
  if (turtle) add(turtle.position);
  if (segments.length === 0) {
    // Only the turtle: give it some room.
    for (let i = 0; i < 3; i++) {
      min[i] = min[i]! - 50;
      max[i] = max[i]! + 50;
    }
  }
  return { min, max };
}
