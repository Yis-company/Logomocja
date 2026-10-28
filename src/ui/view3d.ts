import { h, iconButton, ICONS } from './dom';
import { niceStep, type Scene } from './geom';
import { paper } from './theme';
import type { DrawingView } from './view';
import type { Segment } from '../lang/types';

const VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aCorner;
layout(location=1) in vec3 iA;
layout(location=2) in vec3 iB;
layout(location=3) in vec4 iCol;
uniform mat4 uVP;
uniform vec2 uRes;
uniform float uScale;
out vec3 vCol;
void main() {
  vec4 ca = uVP * vec4(iA, 1.0);
  vec4 cb = uVP * vec4(iB, 1.0);
  float da = ca.z + ca.w;
  float db = cb.z + cb.w;
  vCol = iCol.rgb;
  if (da < 0.0 && db < 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  if (da < 0.0) ca = mix(ca, cb, da / (da - db));
  else if (db < 0.0) cb = mix(ca, cb, da / (da - db));
  vec2 sa = ca.xy / ca.w * uRes * 0.5;
  vec2 sb = cb.xy / cb.w * uRes * 0.5;
  vec2 d = sb - sa;
  float len = length(d);
  vec2 dir = len > 1e-4 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  float hw = iCol.a * uScale * 0.5;
  float t = aCorner.x;
  vec2 p = mix(sa, sb, t) + dir * (t * 2.0 - 1.0) * hw + nrm * aCorner.y * hw;
  vec4 c = mix(ca, cb, t);
  gl_Position = vec4(p / (uRes * 0.5) * c.w, c.z, c.w);
}`;

const FS = `#version 300 es
precision mediump float;
in vec3 vCol;
uniform float uAlpha;
out vec4 outColor;
void main() { outColor = vec4(vCol, uAlpha); }`;

type M4 = Float32Array;

function perspective(fov: number, aspect: number, near: number, far: number): M4 {
  const f = 1 / Math.tan(fov / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect; m[5] = f;
  m[10] = (far + near) / (near - far); m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

function lookAt(eye: number[], tgt: number[], up: number[]): M4 {
  let fx = tgt[0] - eye[0], fy = tgt[1] - eye[1], fz = tgt[2] - eye[2];
  let l = Math.hypot(fx, fy, fz) || 1;
  fx /= l; fy /= l; fz /= l;
  let sx = fy * up[2] - fz * up[1], sy = fz * up[0] - fx * up[2], sz = fx * up[1] - fy * up[0];
  l = Math.hypot(sx, sy, sz) || 1;
  sx /= l; sy /= l; sz /= l;
  const ux = sy * fz - sz * fy, uy = sz * fx - sx * fz, uz = sx * fy - sy * fx;
  const m = new Float32Array(16);
  m[0] = sx; m[4] = sy; m[8] = sz;
  m[1] = ux; m[5] = uy; m[9] = uz;
  m[2] = -fx; m[6] = -fy; m[10] = -fz;
  m[12] = -(sx * eye[0] + sy * eye[1] + sz * eye[2]);
  m[13] = -(ux * eye[0] + uy * eye[1] + uz * eye[2]);
  m[14] = fx * eye[0] + fy * eye[1] + fz * eye[2];
  m[15] = 1;
  return m;
}

function mul(a: M4, b: M4): M4 {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  }
  return o;
}

const STRIDE = 10;

function hexRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255];
}

class Batch {
  vao: WebGLVertexArrayObject;
  buf: WebGLBuffer;
  cap = 0;
  count = 0;
  constructor(private gl: WebGL2RenderingContext, quad: WebGLBuffer) {
    this.vao = gl.createVertexArray()!;
    this.buf = gl.createBuffer()!;
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    const bytes = STRIDE * 4;
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, bytes, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, bytes, 12);
    gl.vertexAttribDivisor(2, 1);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, bytes, 24);
    gl.vertexAttribDivisor(3, 1);
    gl.bindVertexArray(null);
  }
  /** Replaces the whole content. */
  set(data: Float32Array, count: number): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    if (count * STRIDE > this.cap) {
      this.cap = Math.max(count * STRIDE * 2, 1024);
      gl.bufferData(gl.ARRAY_BUFFER, this.cap * 4, gl.DYNAMIC_DRAW);
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data, 0, count * STRIDE);
    this.count = count;
  }
  /** Appends instances [from, to) of `data`. */
  append(data: Float32Array, from: number, to: number): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    if (to * STRIDE > this.cap) {
      const old = this.cap;
      this.cap = Math.max(to * STRIDE * 2, 1024);
      gl.bufferData(gl.ARRAY_BUFFER, this.cap * 4, gl.DYNAMIC_DRAW);
      if (old && from > 0) gl.bufferSubData(gl.ARRAY_BUFFER, 0, data, 0, from * STRIDE);
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, from * STRIDE * 4, data, from * STRIDE, (to - from) * STRIDE);
    this.count = to;
  }
}

const DEF_YAW = 0.65;
const DEF_PITCH = 0.5;
const FOV = (45 * Math.PI) / 180;

export class View3D implements DrawingView {
  readonly el: HTMLElement;
  autoFit = true;
  readonly mode = '3d' as const;
  /** Reason why 3D is off, or null when WebGL works. */
  unavailable: string | null = null;
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private segBatch!: Batch;
  private gridBatch!: Batch;
  private axisBatch!: Batch;
  private markBatch!: Batch;
  private scene: Scene = { segments: [], pose: null };
  private data = new Float32Array(STRIDE * 256);
  private uploaded = 0;
  private lastRef: Segment[] | null = null;
  private bmin: [number, number, number] = [0, 0, 0];
  private bmax: [number, number, number] = [0, 0, 0];
  private gridKey = '';
  private yaw = DEF_YAW;
  private pitch = DEF_PITCH;
  private dist = 400;
  private target: [number, number, number] = [0, 0, 0];
  private W = 300;
  private H = 300;
  private dpr = 1;
  private raf = 0;
  private fitted = false;
  private labels: HTMLElement[] = [];
  private ptrs = new Map<number, { x: number; y: number }>();
  private pinch = 0;
  private vp: M4 = new Float32Array(16);

  constructor() {
    this.canvas = h('canvas', {
      class: 'view-canvas', tabindex: 0, role: 'img',
      'aria-label': 'Rysunek żółwia w trybie 3D. Strzałki obracają kamerę, Shift ze strzałkami przesuwa widok, plus i minus zmieniają powiększenie, zero resetuje kamerę.',
    });
    const tools = h('div', { class: 'view-tools', role: 'group', 'aria-label': 'Narzędzia widoku 3D' },
      iconButton('Przybliż', ICONS.plus, () => this.zoomBy(0.8)),
      iconButton('Oddal', ICONS.minus, () => this.zoomBy(1.25)),
      iconButton('Dopasuj rysunek do okna', ICONS.fit, () => { this.autoFit = false; this.fit(); }),
      iconButton('Resetuj kamerę (0)', ICONS.reset, () => { this.autoFit = false; this.reset(); }),
    );
    this.labels = ['X', 'Y', 'Z'].map((t, i) => h('span', { class: `axis-label axis-${t.toLowerCase()}`, 'aria-hidden': 'true', text: t, dataset: { i: String(i) } }));
    this.el = h('div', { class: 'view view3d' }, this.canvas, ...this.labels, tools);
    this.initGL();
    if (this.unavailable) {
      this.el.replaceChildren(h('div', { class: 'view-off', role: 'status' },
        h('strong', null, 'Widok 3D jest wyłączony'),
        h('p', null, this.unavailable),
        h('p', null, 'Tryb 2D działa normalnie, a programy 3D nadal można uruchamiać i sprawdzać (liczba odcinków, błędy) – tylko bez rysunku.')));
      return;
    }
    new ResizeObserver(() => this.resize()).observe(this.el);
    this.bind();
    this.resize();
  }

  private initGL(): void {
    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = this.canvas.getContext('webgl2', { antialias: true, alpha: false, preserveDrawingBuffer: false });
    } catch { gl = null; }
    if (!gl) {
      this.unavailable = 'Ta przeglądarka lub urządzenie nie udostępnia WebGL 2 (grafiki przyspieszanej sprzętowo), który jest potrzebny do rysowania w przestrzeni.';
      return;
    }
    const compile = (type: number, src: string) => {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) throw new Error(gl!.getShaderInfoLog(sh) ?? 'shader');
      return sh;
    };
    try {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, VS));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'link');
      this.prog = p;
    } catch (e) {
      this.unavailable = `Nie udało się zainicjować shaderów WebGL (${(e as Error).message.slice(0, 120)}).`;
      return;
    }
    this.gl = gl;
    for (const n of ['uVP', 'uRes', 'uScale', 'uAlpha']) this.loc[n] = gl.getUniformLocation(this.prog!, n);
    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -1, 1, -1, 1, 1, 0, -1, 1, 1, 0, 1]), gl.STATIC_DRAW);
    this.segBatch = new Batch(gl, quad);
    this.gridBatch = new Batch(gl, quad);
    this.axisBatch = new Batch(gl, quad);
    this.markBatch = new Batch(gl, quad);
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.unavailable = 'Kontekst WebGL został utracony (np. przez system). Odśwież stronę, aby przywrócić widok 3D.';
      this.el.replaceChildren(h('div', { class: 'view-off', role: 'status' }, h('strong', null, 'Widok 3D jest wyłączony'), h('p', null, this.unavailable)));
    });
  }

  // ---------- data ----------

  setScene(scene: Scene): void {
    this.scene = scene;
    this.syncData();
    if (this.autoFit && this.fitted) this.fit();
    this.invalidate();
  }

  private syncData(): void {
    if (!this.gl) return;
    const segs = this.scene.segments;
    if (segs !== this.lastRef || segs.length < this.uploaded) {
      this.lastRef = segs;
      this.uploaded = 0;
      this.bmin = [0, 0, 0];
      this.bmax = [0, 0, 0];
    }
    const n = segs.length;
    if (n === this.uploaded) return;
    if (n * STRIDE > this.data.length) {
      const nd = new Float32Array(Math.max(n * STRIDE * 2, this.data.length * 2));
      nd.set(this.data.subarray(0, this.uploaded * STRIDE));
      this.data = nd;
    }
    for (let i = this.uploaded; i < n; i++) {
      const s = segs[i];
      const o = i * STRIDE;
      const [r, g, b] = hexRgb(s.color);
      this.data[o] = s.from[0]; this.data[o + 1] = s.from[1]; this.data[o + 2] = s.from[2];
      this.data[o + 3] = s.to[0]; this.data[o + 4] = s.to[1]; this.data[o + 5] = s.to[2];
      this.data[o + 6] = r; this.data[o + 7] = g; this.data[o + 8] = b; this.data[o + 9] = s.width;
      for (const p of [s.from, s.to]) {
        for (let k = 0; k < 3; k++) {
          if (p[k] < this.bmin[k]) this.bmin[k] = p[k];
          if (p[k] > this.bmax[k]) this.bmax[k] = p[k];
        }
      }
    }
    this.segBatch.append(this.data, this.uploaded, n);
    this.uploaded = n;
  }

  // ---------- camera ----------

  private radius(): { c: [number, number, number]; r: number } {
    const c: [number, number, number] = [0, 0, 0];
    let r = 0;
    for (let k = 0; k < 3; k++) {
      c[k] = (this.bmin[k] + this.bmax[k]) / 2;
      r += ((this.bmax[k] - this.bmin[k]) / 2) ** 2;
    }
    return { c, r: Math.max(Math.sqrt(r), 40) };
  }

  fit(): void {
    const { c, r } = this.radius();
    this.target = c;
    const aspect = this.W / Math.max(this.H, 1);
    const fovEff = aspect < 1 ? Math.atan(Math.tan(FOV / 2) * aspect) : FOV / 2;
    this.dist = (r / Math.sin(fovEff)) * 1.12;
    this.invalidate();
  }

  reset(): void {
    this.yaw = DEF_YAW;
    this.pitch = DEF_PITCH;
    this.fit();
  }

  show(): void {
    if (!this.gl) return;
    this.resize();
    this.syncData();
    this.invalidate();
  }

  zoomBy(f: number): void {
    this.autoFit = false;
    this.dist = Math.min(Math.max(this.dist * f, 0.5), 5e6);
    this.invalidate();
  }

  private orbit(dx: number, dy: number): void {
    this.autoFit = false;
    this.yaw -= dx * 0.008;
    this.pitch = Math.min(Math.max(this.pitch + dy * 0.008, -1.5), 1.5);
    this.invalidate();
  }

  private pan(dx: number, dy: number): void {
    this.autoFit = false;
    const k = (2 * this.dist * Math.tan(FOV / 2)) / Math.max(this.H, 1);
    const rx = Math.cos(this.yaw), ry = Math.sin(this.yaw);
    // camera up in world space
    const sp = Math.sin(this.pitch), cp = Math.cos(this.pitch);
    const ux = -sp * Math.sin(this.yaw), uy = sp * Math.cos(this.yaw), uz = cp;
    this.target[0] += (-dx * rx + dy * ux) * k;
    this.target[1] += (-dx * ry + dy * uy) * k;
    this.target[2] += dy * uz * k;
    this.invalidate();
  }

  private bind(): void {
    const c = this.canvas;
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoomBy(Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
    }, { passive: false });
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.pinch = this.pinchDist();
      c.classList.add('grabbing');
    });
    c.addEventListener('pointermove', (e) => {
      const p = this.ptrs.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      const before = this.center();
      p.x = e.clientX; p.y = e.clientY;
      if (this.ptrs.size === 1) {
        if (e.shiftKey || e.ctrlKey || e.buttons & 6) this.pan(dx, dy);
        else this.orbit(dx, dy);
      } else if (this.ptrs.size === 2) {
        const d = this.pinchDist();
        const ctr = this.center();
        if (this.pinch > 0 && d > 0) this.zoomBy(this.pinch / d);
        this.pan(ctr.x - before.x, ctr.y - before.y);
        this.pinch = d;
      }
    });
    const up = (e: PointerEvent) => {
      this.ptrs.delete(e.pointerId);
      this.pinch = this.pinchDist();
      if (!this.ptrs.size) c.classList.remove('grabbing');
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('dblclick', () => { this.autoFit = false; this.fit(); });
    c.addEventListener('keydown', (e) => {
      const k = 24;
      const panMode = e.shiftKey;
      switch (e.key) {
        case 'ArrowLeft': panMode ? this.pan(k, 0) : this.orbit(-k, 0); break;
        case 'ArrowRight': panMode ? this.pan(-k, 0) : this.orbit(k, 0); break;
        case 'ArrowUp': panMode ? this.pan(0, k) : this.orbit(0, -k); break;
        case 'ArrowDown': panMode ? this.pan(0, -k) : this.orbit(0, k); break;
        case '+': case '=': this.zoomBy(0.8); break;
        case '-': case '_': this.zoomBy(1.25); break;
        case '0': case 'Home': this.autoFit = false; this.reset(); break;
        default: return;
      }
      e.preventDefault();
    });
  }

  private pinchDist(): number {
    const [a, b] = [...this.ptrs.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  }
  private center(): { x: number; y: number } {
    const v = [...this.ptrs.values()];
    if (v.length < 2) return v[0] ?? { x: 0, y: 0 };
    return { x: (v[0].x + v[1].x) / 2, y: (v[0].y + v[1].y) / 2 };
  }

  // ---------- rendering ----------

  private resize(): void {
    const r = this.el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || !this.gl) return;
    this.W = r.width;
    this.H = r.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
    if (!this.fitted) { this.fitted = true; this.fit(); } else this.invalidate();
  }

  invalidate(): void {
    if (this.raf || !this.gl) return;
    this.raf = requestAnimationFrame(() => { this.raf = 0; this.draw(); });
  }

  private buildGrid(): void {
    const rxy = Math.max(Math.abs(this.bmin[0]), Math.abs(this.bmin[1]), this.bmax[0], this.bmax[1], 50);
    const step = niceStep(1, rxy / 5);
    const E = Math.ceil((rxy * 1.1) / step) * step;
    const zTop = Math.max(this.bmax[2], 0);
    const key = `${step}|${E}|${Math.ceil(zTop / step)}`;
    if (key === this.gridKey) return;
    this.gridKey = key;
    const rows: number[] = [];
    const add = (a: number[], b: number[], c: number[], w: number) => rows.push(...a, ...b, c[0], c[1], c[2], w);
    const gc = [0.24, 0.2, 0.12];
    for (let v = -E; v <= E + 1e-9; v += step) {
      add([v, -E, 0], [v, E, 0], gc, 1);
      add([-E, v, 0], [E, v, 0], gc, 1);
    }
    this.gridBatch.set(new Float32Array(rows), rows.length / STRIDE);
    const L = Math.max(E, zTop * 1.1, step);
    const ax = [
      ...[0, 0, 0, L, 0, 0, 0.75, 0.22, 0.17, 2.5],
      ...[0, 0, 0, 0, L, 0, 0.15, 0.55, 0.35, 2.5],
      ...[0, 0, 0, 0, 0, L, 0.18, 0.42, 0.85, 2.5],
    ];
    this.axisBatch.set(new Float32Array(ax), 3);
  }

  private matrices(): { vp: M4; eye: number[] } {
    const cp = Math.cos(this.pitch);
    const eye = [
      this.target[0] + this.dist * cp * Math.sin(this.yaw),
      this.target[1] - this.dist * cp * Math.cos(this.yaw),
      this.target[2] + this.dist * Math.sin(this.pitch),
    ];
    const view = lookAt(eye, this.target, [0, 0, 1]);
    const { r } = this.radius();
    const proj = perspective(FOV, this.W / Math.max(this.H, 1), Math.max(this.dist * 0.01, 0.01), (this.dist + r) * 50 + 100);
    return { vp: mul(proj, view), eye };
  }

  private markerData(s: number): Float32Array {
    const pose = this.scene.pose;
    if (!pose) return new Float32Array(0);
    const { pos: p, h: hh, r, u } = pose;
    const at = (a: number, b: number, c: number) => [
      p[0] + hh[0] * a + r[0] * b + u[0] * c,
      p[1] + hh[1] * a + r[1] * b + u[1] * c,
      p[2] + hh[2] * a + r[2] * b + u[2] * c,
    ];
    const tip = at(2 * s, 0, 0), L = at(-s, -s, 0), R = at(-s, s, 0), tail = at(-0.4 * s, 0, 0), F = at(-s, 0, 0.9 * s);
    const mc = pose.pen ? [0.71, 0.29, 0.12] : [0.55, 0.5, 0.45];
    const rows: number[] = [];
    const add = (a: number[], b: number[], c: number[], w: number) => rows.push(...a, ...b, ...c, w);
    for (const [a, b] of [[tip, L], [tip, R], [L, tail], [R, tail], [tip, F], [F, tail], [L, R]]) add(a, b, mc, 3);
    add(p as number[], at(0, 0, 2.2 * s), [0.18, 0.42, 0.85], 2);
    return new Float32Array(rows);
  }

  private draw(): void {
    const gl = this.gl;
    if (!gl || !this.prog) return;
    this.syncData();
    this.buildGrid();
    const col = paper();
    const bg = col.bg.startsWith('#') ? hexRgb(col.bg) : [1, 1, 1];
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(bg[0], bg[1], bg[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.prog);
    const { vp } = this.matrices();
    this.vp = vp;
    gl.uniformMatrix4fv(this.loc.uVP, false, vp);
    gl.uniform2f(this.loc.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.loc.uScale, this.dpr);
    const drawBatch = (b: Batch, alpha: number) => {
      if (!b.count) return;
      gl.uniform1f(this.loc.uAlpha, alpha);
      gl.bindVertexArray(b.vao);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, b.count);
    };
    drawBatch(this.gridBatch, 0.16);
    drawBatch(this.axisBatch, 0.9);
    drawBatch(this.segBatch, 1);
    const ms = this.dist * 0.035;
    const md = this.markerData(ms);
    this.markBatch.set(md, md.length / STRIDE);
    drawBatch(this.markBatch, 1);
    gl.bindVertexArray(null);
    this.placeLabels();
  }

  private project(p: number[]): { x: number; y: number; ok: boolean } {
    const m = this.vp;
    const x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12];
    const y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13];
    const w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15];
    return { x: (x / w * 0.5 + 0.5) * this.W, y: (1 - (y / w * 0.5 + 0.5)) * this.H, ok: w > 0 };
  }

  private placeLabels(): void {
    const L = this.axisLength();
    const tips = [[L, 0, 0], [0, L, 0], [0, 0, L]];
    this.labels.forEach((el, i) => {
      const pr = this.project(tips[i]);
      el.style.display = pr.ok && pr.x > 4 && pr.y > 24 && pr.x < this.W - 24 && pr.y < this.H - 4 ? 'block' : 'none';
      el.style.transform = `translate(${pr.x + 4}px, ${pr.y - 18}px)`;
    });
  }

  private axisLength(): number {
    const rxy = Math.max(Math.abs(this.bmin[0]), Math.abs(this.bmin[1]), this.bmax[0], this.bmax[1], 50);
    const step = niceStep(1, rxy / 5);
    return Math.max(Math.ceil((rxy * 1.1) / step) * step, Math.max(this.bmax[2], 0) * 1.1, step);
  }

  async toPNG(): Promise<Blob | null> {
    if (!this.gl) return null;
    this.draw();
    return new Promise((res) => this.canvas.toBlob((b) => res(b), 'image/png'));
  }

  describe(n: number): void {
    this.canvas.setAttribute('aria-label', `Rysunek żółwia w trybie 3D, odcinków: ${n}. Strzałki obracają kamerę, Shift ze strzałkami przesuwa widok, plus i minus zmieniają powiększenie, zero resetuje kamerę.`);
  }
}

