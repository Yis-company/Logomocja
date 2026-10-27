import type { Frame } from "../ui/player";

/** A drawing surface (2D canvas or 3D WebGL scene). */
export interface DrawingView {
  readonly element: HTMLElement;
  /** Render the given frame (cheap to call every animation frame). */
  render(frame: Frame): void;
  /** Frame the whole drawing in view. */
  fit(frame: Frame): void;
  /** True when the whole drawing is currently visible. */
  contains(frame: Frame): boolean;
  /** Zoom in (factor > 1) or out around the view centre. */
  zoomBy(factor: number): void;
  /** Return to the initial camera. */
  resetView(): void;
  /** Export the current picture as PNG. */
  toPng(): Promise<Blob | null>;
  /** Pick up colour changes after a theme switch. */
  refreshTheme(): void;
  dispose(): void;
}

/** Read a CSS custom property from the document root. */
export function cssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
