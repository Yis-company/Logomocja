import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Mode, Segment, Vec3 } from './interpreter';

type Camera = { target: Vec3; scale: number; yaw: number; pitch: number };
export type DrawingCanvasHandle = { fit: () => void; exportPng: () => void; resetCamera: () => void; zoom: (factor: number) => void; orbit: (yaw: number, pitch: number) => void };
type Props = { mode: Mode; segments: Segment[]; turtle: { pos: Vec3; heading: Vec3; right: Vec3; up: Vec3 }; penDown: boolean; dark: boolean; fitKey: number; resetKey: number; label?: string };

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const normalize = (v: Vec3): Vec3 => { const n = Math.hypot(...v); return n ? [v[0] / n, v[1] / n, v[2] / n] : [0, 0, 0]; };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function cameraBasis(yaw: number, pitch: number) {
  const eye: Vec3 = [Math.sin(yaw) * Math.cos(pitch), -Math.cos(yaw) * Math.cos(pitch), Math.sin(pitch)];
  const forward = normalize([-eye[0], -eye[1], -eye[2]]);
  const right = normalize(cross(forward, [0, 0, 1]));
  const safeRight = Math.hypot(...right) < 0.1 ? [1, 0, 0] as Vec3 : right;
  const up = normalize(cross(safeRight, forward));
  return { right: safeRight, up };
}

function niceGridStep(raw: number) {
  const power = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 0.0001))));
  const scaled = raw / power;
  return (scaled < 1.5 ? 1 : scaled < 3.5 ? 2 : scaled < 7.5 ? 5 : 10) * power;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, Props>(function DrawingCanvas({ mode, segments, turtle, penDown, dark, fitKey, resetKey }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 640, height: 520 });
  const [camera, setCamera] = useState<Camera>({ target: [0, 0, 0], scale: 1.55, yaw: -0.42, pitch: 0.48 });
  const dragRef = useRef<{ x: number; y: number; active: boolean; button: number } | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new ResizeObserver(entries => {
      const box = entries[0]?.contentRect;
      if (box) setSize({ width: Math.max(1, box.width), height: Math.max(1, box.height) });
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const fit = () => {
    if (!segments.length) {
      setCamera(current => ({ ...current, target: [0, 0, 0], scale: Math.min(size.width, size.height) / 260 }));
      return;
    }
    const points = [[0, 0, 0] as Vec3, ...segments.flatMap(segment => [segment.from, segment.to])];
    const min: Vec3 = [0, 1, 2].map(axis => Math.min(...points.map(point => point[axis]))) as Vec3;
    const max: Vec3 = [0, 1, 2].map(axis => Math.max(...points.map(point => point[axis]))) as Vec3;
    const target: Vec3 = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
    const span = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
    const maxSpan = Math.max(...span, 24);
    setCamera(current => ({ ...current, target, scale: clamp(Math.min(size.width, size.height) * 0.68 / maxSpan, 0.12, 16) }));
  };
  const resetCamera = () => setCamera({ target: [0, 0, 0], scale: Math.min(size.width, size.height) / 260, yaw: -0.42, pitch: 0.48 });
  useEffect(() => { if (fitKey) fit(); }, [fitKey]);
  useEffect(() => { if (resetKey) resetCamera(); }, [resetKey]);
  useImperativeHandle(ref, () => ({
    fit,
    resetCamera,
    zoom: factor => setCamera(current => ({ ...current, scale: clamp(current.scale * factor, 0.08, 30) })),
    orbit: (yaw, pitch) => setCamera(current => ({ ...current, yaw: current.yaw + yaw, pitch: clamp(current.pitch + pitch, -1.42, 1.42) })),
    exportPng: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'logomocja-rysunek.png';
        anchor.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    },
  }), [camera, segments, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(size.width * ratio);
    canvas.height = Math.round(size.height * ratio);
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    const width = size.width;
    const height = size.height;
    const bg = dark ? '#151b1b' : '#fbfcf9';
    const grid = dark ? '#273130' : '#e8ece7';
    const faint = dark ? '#384442' : '#d3dbd5';
    const ink = dark ? '#e7ede9' : '#26332f';
    const muted = dark ? '#8a9993' : '#94a09a';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    const { right, up } = cameraBasis(camera.yaw, camera.pitch);
    const project = (point: Vec3): [number, number] => {
      const relative = sub(point, camera.target);
      if (mode === '2d') return [width / 2 + relative[0] * camera.scale, height / 2 - relative[1] * camera.scale];
      return [width / 2 + dot(relative, right) * camera.scale, height / 2 - dot(relative, up) * camera.scale];
    };
    const line = (from: Vec3, to: Vec3, color: string, lineWidth = 1, dash: number[] = []) => {
      const a = project(from), b = project(to);
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash(dash);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    const label = (text: string, point: Vec3, color: string) => {
      const p = project(point);
      ctx.fillStyle = color;
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(text, p[0] + 5, p[1] - 4);
    };

    if (mode === '2d') {
      const step = niceGridStep(56 / camera.scale);
      const minX = camera.target[0] - width / camera.scale / 2;
      const maxX = camera.target[0] + width / camera.scale / 2;
      const minY = camera.target[1] - height / camera.scale / 2;
      const maxY = camera.target[1] + height / camera.scale / 2;
      for (let x = Math.floor(minX / step) * step; x <= maxX; x += step) line([x, minY, 0], [x, maxY, 0], Math.abs(x) < 1e-8 ? faint : grid, x === 0 ? 1.4 : 1);
      for (let y = Math.floor(minY / step) * step; y <= maxY; y += step) line([minX, y, 0], [maxX, y, 0], Math.abs(y) < 1e-8 ? faint : grid, y === 0 ? 1.4 : 1);
      line([minX, 0, 0], [maxX, 0, 0], dark ? '#53615c' : '#b9c4bd', 1.3);
      line([0, minY, 0], [0, maxY, 0], dark ? '#53615c' : '#b9c4bd', 1.3);
      label('0, 0', [0, 0, 0], muted);
      const origin = project([0, 0, 0]);
      ctx.beginPath(); ctx.arc(origin[0], origin[1], 3, 0, Math.PI * 2); ctx.fillStyle = dark ? '#83938b' : '#9da9a1'; ctx.fill();
    } else {
      const range = Math.max(120, Math.min(600, Math.ceil(Math.max(width, height) / camera.scale / 2 / 50) * 50));
      const step = niceGridStep(48 / camera.scale);
      const minX = Math.floor((camera.target[0] - range) / step) * step;
      const maxX = Math.ceil((camera.target[0] + range) / step) * step;
      const minY = Math.floor((camera.target[1] - range) / step) * step;
      const maxY = Math.ceil((camera.target[1] + range) / step) * step;
      for (let x = minX; x <= maxX; x += step) line([x, minY, 0], [x, maxY, 0], grid, 1);
      for (let y = minY; y <= maxY; y += step) line([minX, y, 0], [maxX, y, 0], grid, 1);
      line([-range, 0, 0], [range, 0, 0], '#cb6c54', 1.7);
      line([0, -range, 0], [0, range, 0], '#55a982', 1.7);
      line([0, 0, -range / 2], [0, 0, range / 2], '#5f93d6', 1.7);
      label('X', [range, 0, 0], '#cb6c54');
      label('Y', [0, range, 0], '#55a982');
      label('Z', [0, 0, range / 2], '#5f93d6');
      const origin = project([0, 0, 0]);
      ctx.beginPath(); ctx.arc(origin[0], origin[1], 3, 0, Math.PI * 2); ctx.fillStyle = muted; ctx.fill();
    }

    for (const segment of segments) {
      line(segment.from, segment.to, segment.color, Math.max(1, segment.width * (camera.scale > 1.5 ? 0.92 : 0.72)));
    }

    const tip = project(turtle.pos);
    if (mode === '2d') {
      const forward = project(add2(turtle.pos, turtle.heading, 15));
      const angle = Math.atan2(forward[1] - tip[1], forward[0] - tip[0]);
      ctx.save();
      ctx.translate(tip[0], tip[1]);
      ctx.rotate(angle + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(8, 8);
      ctx.lineTo(0, 4);
      ctx.lineTo(-8, 8);
      ctx.closePath();
      ctx.fillStyle = dark ? '#c6f0df' : '#1f8465';
      ctx.fill();
      ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    } else {
      const axis = (vector: Vec3, color: string) => {
        line(turtle.pos, add2(turtle.pos, vector, 18), color, 2.4);
        const p = project(add2(turtle.pos, vector, 18));
        ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
      };
      axis(turtle.heading, '#55a982');
      axis(turtle.right, '#d5875f');
      axis(turtle.up, '#679ad8');
      ctx.beginPath(); ctx.arc(tip[0], tip[1], 4.5, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1.4; ctx.stroke();
    }
    ctx.fillStyle = muted;
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillText(`${turtle.pos[0].toFixed(1)}, ${turtle.pos[1].toFixed(1)}${mode === '3d' ? `, ${turtle.pos[2].toFixed(1)}` : ''}`, 14, height - 14);
    if (!penDown) {
      ctx.fillStyle = dark ? '#96a29d' : '#76847c';
      ctx.fillText('pióro uniesione', width - 112, height - 14);
    }
  }, [size, mode, segments, turtle, camera, dark, penDown]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, active: true, button: event.button };
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag?.active) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    drag.x = event.clientX; drag.y = event.clientY;
    if (mode === '2d') {
      setCamera(current => ({ ...current, target: [current.target[0] - dx / current.scale, current.target[1] + dy / current.scale, 0] }));
    } else if (event.shiftKey || drag.button === 2) {
      const basis = cameraBasis(camera.yaw, camera.pitch);
      setCamera(current => ({ ...current, target: add2(add2(current.target, basis.right, -dx / current.scale), basis.up, dy / current.scale) }));
    } else {
      setCamera(current => ({ ...current, yaw: current.yaw - dx * 0.008, pitch: clamp(current.pitch + dy * 0.008, -1.42, 1.42) }));
    }
  };
  const stopDrag = () => { if (dragRef.current) dragRef.current.active = false; };
  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const factor = Math.exp(-event.deltaY * 0.001);
    setCamera(current => ({ ...current, scale: clamp(current.scale * factor, 0.08, 30) }));
  };
  const handleKey = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    const unit = 28 / camera.scale;
    if (event.key === 'ArrowLeft') { event.preventDefault(); mode === '3d' ? setCamera(c => ({ ...c, yaw: c.yaw - 0.08 })) : setCamera(c => ({ ...c, target: [c.target[0] - unit, c.target[1], c.target[2]] })); }
    if (event.key === 'ArrowRight') { event.preventDefault(); mode === '3d' ? setCamera(c => ({ ...c, yaw: c.yaw + 0.08 })) : setCamera(c => ({ ...c, target: [c.target[0] + unit, c.target[1], c.target[2]] })); }
    if (event.key === 'ArrowUp') { event.preventDefault(); mode === '3d' ? setCamera(c => ({ ...c, pitch: clamp(c.pitch + 0.08, -1.42, 1.42) })) : setCamera(c => ({ ...c, target: [c.target[0], c.target[1] + unit, c.target[2]] })); }
    if (event.key === 'ArrowDown') { event.preventDefault(); mode === '3d' ? setCamera(c => ({ ...c, pitch: clamp(c.pitch - 0.08, -1.42, 1.42) })) : setCamera(c => ({ ...c, target: [c.target[0], c.target[1] - unit, c.target[2]] })); }
    if (event.key === '+' || event.key === '=') { event.preventDefault(); setCamera(c => ({ ...c, scale: clamp(c.scale * 1.15, 0.08, 30) })); }
    if (event.key === '-') { event.preventDefault(); setCamera(c => ({ ...c, scale: clamp(c.scale / 1.15, 0.08, 30) })); }
  };

  return <div className="canvas-host" ref={hostRef}>
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      aria-label={mode === '2d' ? 'Rysunek żółwia w dwóch wymiarach. Przeciągnij lub użyj strzałek, aby przesunąć widok; plus i minus przybliżają.' : 'Rysunek żółwia w przestrzeni. Przeciągnij lub użyj strzałek, aby obrócić kamerę; Shift i przeciągnięcie przesuwa widok, plus i minus przybliżają.'}
      role="img"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onContextMenu={event => event.preventDefault()}
      onWheel={handleWheel}
      onKeyDown={handleKey}
    />
  </div>;
});

function add2(point: Vec3, vector: Vec3, length: number): Vec3 {
  return [point[0] + vector[0] * length, point[1] + vector[1] * length, point[2] + vector[2] * length];
}
