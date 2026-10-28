import { initialTurtle, type Mode, type Segment, type Turtle, type Vec } from './interpreter';

export class DrawingView {
  mode: Mode = '2d';
  segments: Segment[] = [];
  turtle: Turtle = initialTurtle();
  scale = 1;
  center: [number, number] = [0, 0];
  yaw = -0.65;
  elevation = 0.6;
  dark = false;
  showTurtle = true;
  interactive: boolean;
  onChange?: () => void;
  private ctx: CanvasRenderingContext2D;
  private width = 1;
  private height = 1;
  private fitted = true;
  private pivot: Vec = [0, 0, 0];
  private observer: ResizeObserver;
  private pointers = new Map<number, { x: number; y: number }>();
  constructor(public canvas: HTMLCanvasElement, interactive = true) {
    this.ctx = canvas.getContext('2d')!;
    this.interactive = interactive;
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    if (interactive) this.bind();
    this.resize();
  }
  dispose() { this.observer.disconnect(); }
  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.width = rect.width; this.height = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * ratio); this.canvas.height = Math.round(this.height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0); if (this.fitted || !this.interactive) this.fit(); else this.draw();
  }
  private project(v: Vec): [number, number, number] {
    if (this.mode === '2d') return [v[0], -v[1], v[2]];
    const c = Math.cos(this.yaw), s = Math.sin(this.yaw), e = Math.sin(this.elevation), ce = Math.cos(this.elevation);
    return [v[0] * c - v[1] * s, (v[0] * s + v[1] * c) * e - v[2] * ce, (v[0] * s + v[1] * c) * ce + v[2] * e];
  }
  private screen(v: Vec): [number, number] {
    const p = this.project(v);
    return [this.width / 2 + (p[0] - this.center[0]) * this.scale, this.height / 2 + (p[1] - this.center[1]) * this.scale];
  }
  setData(segments: Segment[], turtle: Turtle) { this.segments = segments; this.turtle = turtle; this.draw(); }
  setMode(mode: Mode) { this.mode = mode; this.resetCamera(); }
  resetCamera() { this.yaw = -0.65; this.elevation = 0.6; this.fit(); }
  fit() {
    this.fitted = true;
    const points = [[0, 0, 0] as Vec, this.turtle.position];
    for (const s of this.segments) points.push(s.from, s.to);
    this.pivot = [0, 1, 2].map(axis => {
      let low = Infinity, high = -Infinity;
      for (const p of points) { low = Math.min(low, p[axis]); high = Math.max(high, p[axis]); }
      return (low + high) / 2;
    }) as Vec;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of points) { const [x, y] = this.project(p); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    this.center = [(x0 + x1) / 2, (y0 + y1) / 2];
    const padding = this.interactive ? 100 : 40;
    this.scale = Math.min(Math.max(20, this.width - padding) / Math.max(40, x1 - x0), Math.max(20, this.height - padding) / Math.max(40, y1 - y0), this.interactive ? 3 : 2);
    this.draw(); this.onChange?.();
  }
  zoom(factor: number, x = this.width / 2, y = this.height / 2) {
    this.fitted = false;
    const old = this.scale; this.scale = Math.max(0.0001, Math.min(30, this.scale * factor));
    this.center[0] += (x - this.width / 2) * (1 / old - 1 / this.scale);
    this.center[1] += (y - this.height / 2) * (1 / old - 1 / this.scale);
    this.draw(); this.onChange?.();
  }
  pan(x: number, y: number) { this.fitted = false; this.center[0] -= x / this.scale; this.center[1] -= y / this.scale; this.draw(); this.onChange?.(); }
  orbit(x: number, y: number) {
    this.fitted = false; const before = this.project(this.pivot);
    this.yaw += x; this.elevation = Math.max(-1.5, Math.min(1.5, this.elevation + y));
    const after = this.project(this.pivot); this.center[0] += after[0] - before[0]; this.center[1] += after[1] - before[1]; this.draw();
  }
  private line(a: Vec, b: Vec, color: string, width = 1) {
    const ctx = this.ctx, pa = this.screen(a), pb = this.screen(b);
    ctx.beginPath(); ctx.moveTo(...pa); ctx.lineTo(...pb); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }
  draw() {
    const ctx = this.ctx, w = this.width, h = this.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = this.dark ? '#172522' : '#fdfdf9'; ctx.fillRect(0, 0, w, h);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const grid = this.dark ? '#33433d' : '#dde4dd';
    if (this.mode === '2d') {
      const step = 25 * 2 ** Math.ceil(Math.log2(18 / (25 * this.scale))), pixels = step * this.scale;
      const ox = ((w / 2 - this.center[0] * this.scale) % pixels + pixels) % pixels;
      const oy = ((h / 2 - this.center[1] * this.scale) % pixels + pixels) % pixels;
      ctx.fillStyle = grid;
      for (let x = ox; x < w; x += pixels) for (let y = oy; y < h; y += pixels) { ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill(); }
    } else {
      let extent = 150;
      for (const s of this.segments) for (const p of [s.from, s.to]) extent = Math.max(extent, Math.abs(p[0]), Math.abs(p[1]));
      const step = 10 ** Math.floor(Math.log10(extent)) / 2; extent = Math.ceil(extent / step) * step;
      for (let d = -extent; d <= extent + 0.001; d += step) {
        this.line([d, -extent, 0], [d, extent, 0], grid, 0.65);
        this.line([-extent, d, 0], [extent, d, 0], grid, 0.65);
      }
      const axes: { point: Vec; color: string; name: string }[] = [
        { point: [extent, 0, 0], color: '#c17663', name: 'X' }, { point: [0, extent, 0], color: '#469780', name: 'Y' }, { point: [0, 0, extent], color: '#7298c0', name: 'Z' },
      ];
      ctx.font = '11px ui-monospace, monospace';
      for (const axis of axes) { this.line([0, 0, 0], axis.point, axis.color, 1); const p = this.screen(axis.point); ctx.fillStyle = axis.color; ctx.fillText(axis.name, p[0] + 5, p[1] - 5); }
    }
    // Orthographic projection of the actual XYZ segments; distant strokes are painted first.
    const ordered = this.mode === '3d' ? this.segments.slice().sort((a, b) => this.project(a.from)[2] + this.project(a.to)[2] - this.project(b.from)[2] - this.project(b.to)[2]) : this.segments;
    for (const s of ordered) this.line(s.from, s.to, s.color, Math.max(0.7, s.width * Math.min(1.4, Math.max(0.65, this.scale))));
    if (this.interactive) {
      const [ox, oy] = this.screen([0, 0, 0]);
      ctx.strokeStyle = this.dark ? '#91a49b' : '#9aa89e'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox - 5, oy); ctx.lineTo(ox + 5, oy); ctx.moveTo(ox, oy - 5); ctx.lineTo(ox, oy + 5); ctx.stroke();
      ctx.fillStyle = this.dark ? '#91a49b' : '#849187'; ctx.font = '10px ui-monospace, monospace'; ctx.fillText('0, 0', ox + 9, oy + 15);
    }
    if (this.showTurtle && this.interactive) this.drawTurtle();
  }
  private drawTurtle() {
    const ctx = this.ctx, t = this.turtle, [x, y] = this.screen(t.position);
    const p = this.project(t.heading), len = Math.hypot(p[0], p[1]);
    if (this.mode === '3d') {
      for (const [v, color] of [[t.right, '#c17663'], [t.up, '#7298c0']] as [Vec, string][]) {
        const p = this.project(v); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + p[0] * 24, y + p[1] * 24); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      }
    }
    ctx.save(); ctx.translate(x, y); ctx.rotate(len > 0.001 ? Math.atan2(p[1], p[0]) + Math.PI / 2 : 0);
    ctx.shadowColor = '#16866a26'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(0, -13); ctx.lineTo(9, 9); ctx.lineTo(0, 5); ctx.lineTo(-9, 9); ctx.closePath();
    ctx.fillStyle = t.pen ? '#e3f1da' : '#fdfdf9'; ctx.strokeStyle = '#16866a'; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  private bind() {
    const canvas = this.canvas;
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('wheel', e => { e.preventDefault(); const r = canvas.getBoundingClientRect(); this.zoom(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); });
    canvas.addEventListener('pointermove', e => {
      const old = this.pointers.get(e.pointerId); if (!old) return;
      const dx = e.clientX - old.x, dy = e.clientY - old.y;
      if (this.pointers.size === 2) {
        const other = [...this.pointers.entries()].find(([id]) => id !== e.pointerId)![1];
        const a = Math.hypot(old.x - other.x, old.y - other.y), b = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        if (a > 5 && b > 5) this.zoom(b / a); this.pan(dx / 2, dy / 2);
      } else if (this.mode === '3d' && !e.shiftKey && e.buttons !== 2) this.orbit(dx * 0.008, dy * 0.008);
      else this.pan(dx, dy);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    });
    const end = (e: PointerEvent) => this.pointers.delete(e.pointerId);
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end); canvas.addEventListener('lostpointercapture', end);
    canvas.addEventListener('keydown', e => {
      const arrows: Record<string, [number, number]> = { ArrowLeft: [30, 0], ArrowRight: [-30, 0], ArrowUp: [0, 30], ArrowDown: [0, -30] };
      if (arrows[e.key]) { e.preventDefault(); const [x, y] = arrows[e.key]; if (e.shiftKey && this.mode === '3d') this.orbit(x / 150, y / 150); else this.pan(x, y); }
      if (e.key === '+' || e.key === '=') { e.preventDefault(); this.zoom(1.2); }
      if (e.key === '-') { e.preventDefault(); this.zoom(1 / 1.2); }
      if (e.key === '0') { e.preventDefault(); this.resetCamera(); }
    });
  }
  png() { this.draw(); return this.canvas.toDataURL('image/png'); }
}
