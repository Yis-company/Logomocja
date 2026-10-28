import type { Segment } from '../lang/interp';
import { boundsOf, flatProject, isoProject } from './draw';

/** Rysuje miniaturę programu (3D jako rzut izometryczny). */
export function drawThumb(canvas: HTMLCanvasElement, segs: Segment[], iso: boolean) {
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const P = iso ? isoProject : flatProject;
  const b = boundsOf(segs, P);
  if (!b) return;
  const pad = 8;
  const s = Math.min((W - 2 * pad) / Math.max(b[2] - b[0], 1), (H - 2 * pad) / Math.max(b[3] - b[1], 1));
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
  ctx.lineCap = 'round';
  let key = '';
  ctx.beginPath();
  for (const g of segs) {
    const k = g.color;
    if (k !== key) {
      if (key) ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = g.color;
      ctx.lineWidth = Math.max(1, Math.min(2.2, g.width * 0.6));
      key = k;
    }
    const [x0, y0] = P(g.from), [x1, y1] = P(g.to);
    ctx.moveTo(W / 2 + (x0 - cx) * s, H / 2 - (y0 - cy) * s);
    ctx.lineTo(W / 2 + (x1 - cx) * s, H / 2 - (y1 - cy) * s);
  }
  ctx.stroke();
}
