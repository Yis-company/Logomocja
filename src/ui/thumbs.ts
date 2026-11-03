import type { Mode } from '../lang/ast';
import type { Segment } from '../lang/interpreter';
import { h } from './dom';
import { drawFitted, flat, isoProjection } from './view2d';

/** A small drawing of a program's result, on the page's own ground. */
export function thumbnail(segs: Segment[], mode: Mode, label: string, w = 240, hgt = 168): HTMLCanvasElement {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const c = h('canvas', { class: 'thumb', role: 'img', 'aria-label': label, width: String(Math.round(w * dpr)), height: String(Math.round(hgt * dpr)) }) as HTMLCanvasElement;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
    const widthScale = Math.min(1, 0.6 + 40 / Math.max(40, segs.length));
    drawFitted(ctx, segs, mode === '3d' ? isoProjection() : flat, w, hgt, 14, widthScale, 1.25);
  }
  return c;
}
