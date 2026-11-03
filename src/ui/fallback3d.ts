import type { Segment } from '../lang/types';
import type { TurtleState } from '../lang/interpreter';
import type { DrawingSurface, Overlay } from './surface';
import { View2D } from './view2d';
import { flatten, project3 } from './thumbs';

/** Without WebGL, 3D drawings are shown as a fixed axonometric projection on a 2D canvas. */
export class Fallback3D implements DrawingSurface {
  readonly kind = '3d' as const;
  readonly element: HTMLElement;
  private view: View2D;

  constructor(host: HTMLElement) {
    this.element = host;
    this.view = new View2D(host, { grid: false });
  }
  get userMoved(): boolean {
    return this.view.userMoved;
  }
  set userMoved(v: boolean) {
    this.view.userMoved = v;
  }
  setSegments(list: Segment[]): void {
    this.view.setSegments(flatten(list, '3d'));
  }
  addSegment(seg: Segment): void {
    this.view.addSegment(flatten([seg], '3d')[0]!);
  }
  setPartial(p: { seg: Segment; t: number } | null): void {
    this.view.setPartial(p ? { seg: flatten([p.seg], '3d')[0]!, t: p.t } : null);
  }
  setTurtle(t: TurtleState | null): void {
    if (!t) return this.view.setTurtle(null);
    const pos = project3(t.pos);
    const tip = project3([t.pos[0] + t.heading[0], t.pos[1] + t.heading[1], t.pos[2] + t.heading[2]]);
    this.view.setTurtle({ ...t, pos: [pos[0], pos[1], 0], heading: [tip[0] - pos[0], tip[1] - pos[1], 0] });
  }
  setOverlay(o: Overlay | null): void {
    this.view.setOverlay(o ? { ghost: flatten(o.ghost, '3d'), missing: flatten(o.missing, '3d'), extra: flatten(o.extra, '3d') } : null);
  }
  fit(animate?: boolean): void {
    this.view.fit(animate);
  }
  contentVisible(): boolean {
    return this.view.contentVisible();
  }
  zoomBy(f: number): void {
    this.view.zoomBy(f);
  }
  resetView(): void {
    this.view.resetView();
  }
  refreshTheme(): void {
    this.view.refreshTheme();
  }
  exportPNG(): Promise<Blob | null> {
    return this.view.exportPNG();
  }
  renderNow(): void {
    this.view.renderNow();
  }
  resize(): void {
    this.view.resize();
  }
  destroy(): void {
    this.view.destroy();
  }
}
