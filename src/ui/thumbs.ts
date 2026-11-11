import type { Mode, Segment } from "../core/interp";
import { fit3, projector } from "./view";

const cache = new Map<string, string>();

/**
 * Miniatura SVG z prawdziwych odcinków interpretera. `dashed` rysuje wzór zadania cienką linią przerywaną.
 */
export function thumbSvg(key: string, segments: Segment[], mode: Mode, dashed = false): string {
  const hit = cache.get(key);
  if (hit) return hit;
  const W = 240, H = 180, PAD = 16;
  type L = { x1: number; y1: number; x2: number; y2: number; z: number; color: string; width: number };
  let lines: L[];
  if (mode === "3d") {
    const cam = fit3({ mode, segments, target: null, turtle: null }, W, H, { top: 0, right: 0, bottom: 0, left: 0 });
    const P = projector(cam, W, H);
    lines = [];
    for (const s of segments) {
      const p = P.seg(s.from, s.to);
      if (p) lines.push({ x1: p[0], y1: p[1], x2: p[2], y2: p[3], z: p[4], color: s.color, width: s.width });
    }
    lines.sort((a, b) => b.z - a.z);
  } else {
    lines = segments.map((s) => ({ x1: s.from[0], y1: -s.from[1], x2: s.to[0], y2: -s.to[1], z: 0, color: s.color, width: s.width }));
  }
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const l of lines) {
    x0 = Math.min(x0, l.x1, l.x2); x1 = Math.max(x1, l.x1, l.x2);
    y0 = Math.min(y0, l.y1, l.y2); y1 = Math.max(y1, l.y1, l.y2);
  }
  if (!lines.length) { x0 = y0 = 0; x1 = y1 = 1; }
  const k = Math.min((W - PAD * 2) / Math.max(x1 - x0, 1), (H - PAD * 2) / Math.max(y1 - y0, 1));
  const ox = W / 2 - ((x0 + x1) / 2) * k, oy = H / 2 - ((y0 + y1) / 2) * k;
  const f = (v: number) => (Math.round(v * 10) / 10).toString();
  let body = "";
  let d = "", color = "", width = -1;
  const flush = () => {
    if (!d) return;
    body += dashed
      ? `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>`
      : `<path d="${d}" fill="none" stroke="${color}" stroke-width="${f(Math.max(1, width * 0.55))}" stroke-linecap="round" stroke-linejoin="round"/>`;
    d = "";
  };
  for (const l of lines) {
    if (!dashed && (l.color !== color || l.width !== width)) {
      flush();
      color = l.color; width = l.width;
    }
    d += `M${f(l.x1 * k + ox)} ${f(l.y1 * k + oy)}L${f(l.x2 * k + ox)} ${f(l.y2 * k + oy)}`;
  }
  flush();
  const svg = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">${body}</svg>`;
  cache.set(key, svg);
  return svg;
}
