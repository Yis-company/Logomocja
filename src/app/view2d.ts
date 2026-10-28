import type { Segment, TurtleState } from '../lang';
import { palette } from './theme';
import { CanvasView, attachGestures, formatNumber, niceCeil, segmentBounds } from './view';

const MIN_SCALE = 0.002;
const MAX_SCALE = 400;

export class View2D extends CanvasView {
  /** Środek widoku w układzie świata i skala (piksele na jednostkę). */
  private cx = 0;
  private cy = 60;
  private scale = 1;

  constructor() {
    super('Widok rysunku 2D. Strzałki przesuwają, plus i minus powiększają, F dopasowuje, 0 przywraca widok.');
    this.el.classList.add('view-2d');
    attachGestures(this.el, {
      drag: (dx, dy) => {
        this.cx -= dx / this.scale;
        this.cy += dy / this.scale;
        this.userNavigated();
        this.requestDraw();
      },
      pinch: (factor, mx, my, dx, dy) => {
        this.cx -= dx / this.scale;
        this.cy += dy / this.scale;
        this.zoomAt(factor, mx, my);
      },
      wheel: (deltaY, mx, my) => this.zoomAt(Math.exp(-deltaY * 0.0016), mx, my),
      key: (e) => this.onKey(e),
    });
  }

  protected onResized(first: boolean): void {
    if (first) this.resetView();
    else if (this.autoFit) this.fit();
  }

  private onKey(e: KeyboardEvent): boolean {
    const step = 60 / this.scale;
    switch (e.key) {
      case 'ArrowLeft':
        this.cx -= step;
        break;
      case 'ArrowRight':
        this.cx += step;
        break;
      case 'ArrowUp':
        this.cy += step;
        break;
      case 'ArrowDown':
        this.cy -= step;
        break;
      case '+':
      case '=':
        this.zoomBy(1.25);
        return true;
      case '-':
      case '_':
        this.zoomBy(0.8);
        return true;
      case 'f':
      case 'F':
        this.fit();
        return true;
      case '0':
      case 'Home':
        this.resetView();
        return true;
      default:
        return false;
    }
    this.userNavigated();
    this.requestDraw();
    return true;
  }

  private zoomAt(factor: number, mx: number, my: number): void {
    const before = this.toWorld(mx, my);
    this.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, this.scale * factor));
    const after = this.toWorld(mx, my);
    this.cx += before[0] - after[0];
    this.cy += before[1] - after[1];
    this.userNavigated();
    this.requestDraw();
  }

  zoomBy(factor: number): void {
    this.zoomAt(factor, this.w / 2, this.h / 2);
  }

  private toWorld(sx: number, sy: number): [number, number] {
    return [this.cx + (sx - this.w / 2) / this.scale, this.cy - (sy - this.h / 2) / this.scale];
  }

  resetView(): void {
    this.fitTarget = null;
    this.cx = 0;
    this.cy = 60;
    this.scale = Math.max(MIN_SCALE, Math.min(this.w, this.h) / 440) || 1;
    this.autoFit = true;
    this.requestDraw();
  }

  protected doFit(segments: Segment[], includeTurtle: boolean): void {
    const { ghost, turtle } = this.scene;
    const extra: [number, number, number][] | undefined =
      includeTurtle && turtle && segments.length > 0 ? [[turtle.pos[0], turtle.pos[1], 0]] : undefined;
    const merged = segmentBounds(ghost ? segments.concat(ghost) : segments, extra);
    if (!merged || this.w === 0 || this.h === 0) {
      this.resetView();
      return;
    }
    const bw = merged.max[0] - merged.min[0];
    const bh = merged.max[1] - merged.min[1];
    const pad = Math.max(28, Math.min(this.w, this.h) * 0.08);
    const sx = bw > 0 ? (this.w - 2 * pad) / bw : Infinity;
    const sy = bh > 0 ? (this.h - 2 * pad) / bh : Infinity;
    let s = Math.min(sx, sy);
    if (!Number.isFinite(s)) s = 1;
    this.scale = Math.min(10, Math.max(MIN_SCALE, s));
    this.cx = (merged.min[0] + merged.max[0]) / 2;
    this.cy = (merged.min[1] + merged.max[1]) / 2;
    this.autoFit = true;
    this.requestDraw();
  }

  describe(): string {
    const n = this.scene.segments.length;
    return n === 0 ? 'Pusty rysunek' : `Rysunek 2D: ${n} odcink${n === 1 ? '' : n < 5 ? 'i' : 'ów'}`;
  }

  // ───────────────────────── rysowanie ─────────────────────────

  private sx(x: number): number {
    return this.w / 2 + (x - this.cx) * this.scale;
  }
  private sy(y: number): number {
    return this.h / 2 - (y - this.cy) * this.scale;
  }

  protected draw(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const pal = palette();
    const { segments, turtle, ghost } = this.scene;
    ctx.fillStyle = pal.paper;
    ctx.fillRect(0, 0, w, h);
    if (!this.minimal) this.drawGrid(ctx, w, h);

    // początek układu
    const ox = this.sx(0);
    const oy = this.sy(0);
    if (!this.minimal) {
    ctx.save();
    ctx.strokeStyle = pal.origin;
    ctx.fillStyle = pal.paper;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ox, oy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ox, oy, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = pal.origin;
    ctx.fill();
    ctx.restore();
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (ghost && ghost.length) {
      ctx.save();
      ctx.strokeStyle = pal.ghost;
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([7, 6]);
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (const s of ghost) {
        ctx.moveTo(this.sx(s.from[0]), this.sy(s.from[1]));
        ctx.lineTo(this.sx(s.to[0]), this.sy(s.to[1]));
      }
      ctx.stroke();
      ctx.restore();
    }

    // odcinki: kolejne o tym samym stylu i ciągłe łączymy w jedną łamaną
    let style = '';
    let lastX = NaN;
    let lastY = NaN;
    let open = false;
    for (const s of segments) {
      const st = `${s.color}${s.width}`;
      const x0 = this.sx(s.from[0]);
      const y0 = this.sy(s.from[1]);
      if (st !== style) {
        if (open) ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        style = st;
        open = true;
        lastX = NaN;
      }
      if (x0 !== lastX || y0 !== lastY) ctx.moveTo(x0, y0);
      lastX = this.sx(s.to[0]);
      lastY = this.sy(s.to[1]);
      ctx.lineTo(lastX, lastY);
    }
    if (open) ctx.stroke();

    if (turtle && !this.minimal) this.drawTurtle(ctx, turtle);
  }

  private drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const pal = palette();
    const minor = niceCeil(26 / this.scale);
    const mantissa = Math.round(minor / Math.pow(10, Math.floor(Math.log10(minor))));
    const factor = mantissa === 5 ? 2 : 5;
    const major = minor * factor;
    const [x0, y1] = this.toWorld(0, 0);
    const [x1, y0] = this.toWorld(w, h);

    const lines = (from: number, to: number, vertical: boolean) => {
      const first = Math.ceil(from / minor);
      const last = Math.floor(to / minor);
      if (last - first > 400) return;
      for (let i = first; i <= last; i++) {
        const v = i * minor;
        const isMajor = i % factor === 0;
        ctx.beginPath();
        ctx.strokeStyle = isMajor ? pal.gridMajor : pal.gridMinor;
        ctx.lineWidth = 1;
        if (vertical) {
          const x = Math.round(this.sx(v)) + 0.5;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        } else {
          const y = Math.round(this.sy(v)) + 0.5;
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();
      }
    };
    lines(x0, x1, true);
    lines(y0, y1, false);

    // osie
    const ox = this.sx(0);
    const oy = this.sy(0);
    ctx.strokeStyle = pal.axis;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ox >= 0 && ox <= w) {
      ctx.moveTo(Math.round(ox) + 0.5, 0);
      ctx.lineTo(Math.round(ox) + 0.5, h);
    }
    if (oy >= 0 && oy <= h) {
      ctx.moveTo(0, Math.round(oy) + 0.5);
      ctx.lineTo(w, Math.round(oy) + 0.5);
    }
    ctx.stroke();

    // opisy
    ctx.fillStyle = pal.label;
    ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    const labelY = Math.min(h - 6, Math.max(14, oy + 14));
    const labelX = Math.min(w - 4, Math.max(4, ox + 5));
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    const firstX = Math.ceil(x0 / major);
    const lastX = Math.floor(x1 / major);
    if (lastX - firstX < 60) {
      for (let i = firstX; i <= lastX; i++) {
        if (i === 0) continue;
        ctx.fillText(formatNumber(i * major), this.sx(i * major), labelY);
      }
    }
    ctx.textAlign = labelX > w - 40 ? 'right' : 'left';
    const firstY = Math.ceil(y0 / major);
    const lastY = Math.floor(y1 / major);
    if (lastY - firstY < 60) {
      for (let i = firstY; i <= lastY; i++) {
        if (i === 0) continue;
        ctx.fillText(formatNumber(i * major), labelX, this.sy(i * major) - 3);
      }
    }
    ctx.textAlign = 'left';
    if (ox > 0 && ox < w && oy > 0 && oy < h) {
      ctx.fillText('0', ox + 9, oy + 15);
    }
    // nazwy osi na brzegach
    ctx.fillStyle = pal.axis;
    ctx.font = 'bold 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    if (oy >= 12 && oy <= h - 12) {
      ctx.textAlign = 'right';
      ctx.fillText('X', w - 6, oy - 6);
    }
    if (ox >= 12 && ox <= w - 12) {
      ctx.textAlign = 'left';
      ctx.fillText('Y', ox + 7, 14);
    }
  }

  private drawTurtle(ctx: CanvasRenderingContext2D, t: TurtleState): void {
    const pal = palette();
    const x = this.sx(t.pos[0]);
    const y = this.sy(t.pos[1]);
    // kierunek na ekranie: oś Y świata jest skierowana w górę
    let dx = t.fwd[0];
    let dy = -t.fwd[1];
    const len = Math.hypot(dx, dy);
    if (len < 1e-9) {
      // w 3D nos może wskazywać prosto w górę/dół – pokazujemy samą kropkę
      dx = 0;
      dy = -1;
    } else {
      dx /= len;
      dy /= len;
    }
    const size = 13;
    const px = -dy;
    const py = dx;
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + dx * size, y + dy * size);
    ctx.lineTo(x - dx * size * 0.7 + px * size * 0.62, y - dy * size * 0.7 + py * size * 0.62);
    ctx.lineTo(x - dx * size * 0.25, y - dy * size * 0.25);
    ctx.lineTo(x - dx * size * 0.7 - px * size * 0.62, y - dy * size * 0.7 - py * size * 0.62);
    ctx.closePath();
    ctx.fillStyle = t.penDown ? t.color : pal.paper;
    ctx.globalAlpha = 0.92;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.strokeStyle = pal.ink;
    if (!t.penDown) ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.restore();
  }
}
