import { useEffect, useRef, useState } from "react";
import type { Drawing } from "../logo/types";
import { stagePalette, type Theme } from "../theme";
import { Icon } from "./Icon";
export default function Stage2D({
  drawing,
  theme = "light",
}: {
  drawing: Drawing;
  theme?: Theme;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const ctx = element.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    element.width = Math.round(size.width * dpr);
    element.height = Math.round(size.height * dpr);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size.width, size.height);
    const x = (n: number) => size.width / 2 + (n - view.x) * view.scale;
    const y = (n: number) => size.height / 2 - (n - view.y) * view.scale;
    const grid = Math.max(16, 25 * view.scale);
    ctx.fillStyle = stagePalette[theme].grid;
    for (let gx = ((x(0) % grid) + grid) % grid; gx < size.width; gx += grid)
      for (
        let gy = ((y(0) % grid) + grid) % grid;
        gy < size.height;
        gy += grid
      ) {
        ctx.beginPath();
        ctx.arc(gx, gy, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    ctx.strokeStyle = stagePalette[theme].axis;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    ctx.moveTo(x(0), 0);
    ctx.lineTo(x(0), size.height);
    ctx.moveTo(0, y(0));
    ctx.lineTo(size.width, y(0));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const segment of drawing.segments) {
      ctx.strokeStyle = segment.color;
      ctx.lineWidth = segment.width;
      ctx.beginPath();
      ctx.moveTo(x(segment.from[0]), y(segment.from[1]));
      ctx.lineTo(x(segment.to[0]), y(segment.to[1]));
      ctx.stroke();
    }
    const { position, forward } = drawing.turtle;
    ctx.save();
    ctx.translate(x(position[0]), y(position[1]));
    ctx.rotate(Math.atan2(forward[0], forward[1]));
    ctx.shadowColor = "#123a3326";
    ctx.shadowBlur = 12;
    ctx.fillStyle = stagePalette[theme].halo;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#adc5a2";
    for (const [tx, ty, rotation] of [
      [-11, -6, -0.6],
      [11, -6, 0.6],
      [-10, 8, 0.6],
      [10, 8, -0.6],
    ]) {
      ctx.beginPath();
      ctx.ellipse(tx, ty, 5, 3, rotation, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#317d61";
    ctx.beginPath();
    ctx.ellipse(0, -14, 4.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c8e6ad";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, 11);
    ctx.moveTo(-8, -4);
    ctx.lineTo(0, -1);
    ctx.lineTo(8, -4);
    ctx.moveTo(-8, 4);
    ctx.lineTo(0, 1);
    ctx.lineTo(8, 4);
    ctx.stroke();
    ctx.restore();
  }, [drawing, size, view, theme]);
  function fit() {
    const points = [
      drawing.turtle.position,
      [0, 0, 0],
      ...drawing.segments.flatMap((s) => [s.from, s.to]),
    ];
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const p of points) {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    }
    setView({
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      scale: Math.max(
        0.001,
        Math.min(
          3,
          (size.width - 100) / Math.max(100, maxX - minX),
          (size.height - 100) / Math.max(100, maxY - minY),
        ),
      ),
    });
  }
  return (
    <>
      <canvas
        ref={canvas}
        className="drawing-canvas"
        aria-label="Rysunek żółwia w 2D"
      />
      <div className="view-controls">
        <button
          type="button"
          className="icon-button"
          title="Pomniejsz"
          aria-label="Pomniejsz rysunek"
          onClick={() =>
            setView((v) => ({ ...v, scale: Math.max(0.001, v.scale / 1.25) }))
          }
        >
          <Icon name="minus" size={17} />
        </button>
        <span>{Math.round(view.scale * 100)}%</span>
        <button
          type="button"
          className="icon-button"
          title="Powiększ"
          aria-label="Powiększ rysunek"
          onClick={() =>
            setView((v) => ({ ...v, scale: Math.min(5, v.scale * 1.25) }))
          }
        >
          <Icon name="plus" size={17} />
        </button>
        <div className="control-divider" />
        <button
          type="button"
          className="icon-button"
          title="Dopasuj rysunek"
          aria-label="Dopasuj rysunek"
          onClick={fit}
        >
          <Icon name="fit" size={17} />
        </button>
      </div>
      <span className="canvas-axis">Y ↑ &nbsp; X →</span>
    </>
  );
}
