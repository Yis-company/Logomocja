import { useMemo } from "react";
import type { Example } from "../examples";
import { parse } from "../logo/parser";
import { Executor } from "../logo/runtime";
import type { Vec3 } from "../logo/types";
const project = ([x, y, z]: Vec3, flat: boolean): [number, number] =>
  flat ? [x, -y] : [(x - y) * 0.866, (x + y) * 0.5 - z];
/** A true preview: the program's segments, projected and fitted into the card. */
export function ExampleArt({ example }: { example: Example }) {
  const paths = useMemo(() => {
    const runtime = new Executor(parse(example.source, example.mode));
    try {
      while (!runtime.done) runtime.tick();
    } catch {
      // Keep what was drawn.
    }
    const flat = example.mode === "2d";
    const lines = runtime.drawing.segments.map((s) => ({
      from: project(s.from, flat),
      to: project(s.to, flat),
      color: s.color,
    }));
    const xs = lines.flatMap((l) => [l.from[0], l.to[0]]);
    const ys = lines.flatMap((l) => [l.from[1], l.to[1]]);
    const minX = Math.min(...xs, 0);
    const maxX = Math.max(...xs, 0);
    const minY = Math.min(...ys, 0);
    const maxY = Math.max(...ys, 0);
    const scale = Math.min(108 / Math.max(1, maxX - minX), 76 / Math.max(1, maxY - minY));
    const dx = 60 - ((minX + maxX) / 2) * scale;
    const dy = 44 - ((minY + maxY) / 2) * scale;
    const byColor = new Map<string, string[]>();
    for (const l of lines) {
      const d = `M${(l.from[0] * scale + dx).toFixed(1)} ${(l.from[1] * scale + dy).toFixed(1)}L${(l.to[0] * scale + dx).toFixed(1)} ${(l.to[1] * scale + dy).toFixed(1)}`;
      byColor.set(l.color, [...(byColor.get(l.color) ?? []), d]);
    }
    return [...byColor].map(([color, ds]) => ({ color, d: ds.join("") }));
  }, [example]);
  return (
    <svg viewBox="0 0 120 88" aria-hidden="true" className="example-art">
      <g fill="none" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {paths.map((p) => (
          <path key={p.color} stroke={p.color} d={p.d} />
        ))}
      </g>
    </svg>
  );
}
