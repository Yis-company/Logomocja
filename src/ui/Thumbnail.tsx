import { useEffect, useRef } from 'preact/hooks';
import type { Mode } from '../lang/ast';
import { execute, type Segment } from '../lang/interpreter';
import { readPalette, type Scene } from '../render/scene';
import { draw2D, fitCamera2D } from '../render/view2d';
import { defaultCamera3D, draw3D, fitCamera3D } from '../render/view3d';
import { theme } from '../state/theme';

const cache = new Map<string, Segment[]>();

function segmentsOf(code: string, mode: Mode): Segment[] {
  const key = `${mode}\u0000${code}`;
  let segs = cache.get(key);
  if (!segs) {
    segs = execute(code, mode).segments;
    cache.set(key, segs);
  }
  return segs;
}

interface Props {
  code: string;
  mode: Mode;
  label: string;
  /** Draw the segments as a dashed target instead of real strokes. */
  asTarget?: boolean;
  width?: number;
  height?: number;
}

/** A small static rendering of a program's drawing. */
export function Thumbnail({ code, mode, label, asTarget, width = 240, height = 160 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const t = theme.value;
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const segs = segmentsOf(code, mode);
    const scene: Scene = asTarget
      ? { log: [], start: 0, end: 0, partial: null, turtle: null, ghost: segs }
      : { log: segs, start: 0, end: segs.length, partial: null, turtle: null, ghost: null };
    const pal = readPalette();
    if (mode === '2d') {
      const cam = fitCamera2D(scene, width, height, 14);
      draw2D(ctx, width, height, cam, scene, pal, { grid: false, axes: false });
    } else {
      const cam = fitCamera3D(scene, width, height, defaultCamera3D());
      draw3D(ctx, width, height, cam, scene, pal, { axes: false });
    }
  }, [code, mode, asTarget, width, height, t]);
  return <canvas ref={ref} class="thumb" role="img" aria-label={label} style={{ aspectRatio: `${width} / ${height}` }} />;
}
