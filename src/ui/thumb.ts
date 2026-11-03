import type { Segment } from '../lang/interp';
import type { Mode } from '../lang/parser';
import { isoProjection } from './view2d';

/** Miniatura rysunku jako SVG, rysowana prawdziwym interpreterem. */
export function thumbSVG(segments: Segment[], mode: Mode, label: string, ghost = false): string {
  const proj = mode === '3d' ? isoProjection() : (p: Segment['from']) => [p[0], p[1]] as [number, number];
  const pts = segments.map((s) => [proj(s.from), proj(s.to)] as const);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [a, b] of pts) {
    for (const [x, y] of [a, b]) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
  if (!pts.length) { minX = minY = -10; maxX = maxY = 10; }
  const size = Math.max(maxX - minX, maxY - minY, 1);
  const pad = size * 0.08;
  const vb = `${(minX + maxX) / 2 - size / 2 - pad} ${-((minY + maxY) / 2) - size / 2 - pad} ${size + pad * 2} ${size + pad * 2}`;
  const k = (size + pad * 2) / 120; // grubość w pikselach miniatury ~120 px
  const lines = segments.map((s, i) => {
    const [a, b] = pts[i];
    const stroke = ghost ? 'currentColor' : s.color;
    const w = Math.max(0.8, Math.min(s.width, 3)) * k;
    return `<line x1="${a[0].toFixed(2)}" y1="${(-a[1]).toFixed(2)}" x2="${b[0].toFixed(2)}" y2="${(-b[1]).toFixed(2)}" stroke="${stroke}" stroke-width="${w.toFixed(2)}"/>`;
  }).join('');
  return `<svg class="thumb" viewBox="${vb}" role="img" aria-label="${label.replace(/"/g, '&quot;')}" stroke-linecap="round" preserveAspectRatio="xMidYMid meet">${lines}</svg>`;
}
