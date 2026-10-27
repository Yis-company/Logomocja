import type { Turtle } from '../logo/machine';
import type { Segment } from '../logo/types';

/** What the app needs from either drawing surface. */
export interface StageView {
  update(segments: readonly Segment[], turtle: Turtle | null): void;
  fit(): void;
}
