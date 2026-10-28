import type { Scene } from './geom';

export interface DrawingView {
  readonly el: HTMLElement;
  autoFit: boolean;
  readonly mode: '2d' | '3d';
  setScene(scene: Scene): void;
  invalidate(): void;
  fit(): void;
  reset(): void;
  show(): void;
  toPNG(): Promise<Blob | null>;
  describe(segmentCount: number): void;
}
