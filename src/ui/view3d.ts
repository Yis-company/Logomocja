import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Segment, TurtleState, V3 } from '../lang/interpreter';
import { h } from './dom';
import { boundsOf, cssVar, drawCalloutMarks, leaderDir, type Callout, type DrawingView } from './view';

const DEFAULT_DIR = new THREE.Vector3(0.55, -0.75, 0.6).normalize();
const Z = new THREE.Vector3(0, 0, 1);

/**
 * The 3D drawing: orbit, pan and zoom around the turtle's space, with a
 * ground grid on the XY plane and labelled axes. +Z is up.
 */
export class View3D implements DrawingView {
  readonly element: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly overlay: HTMLCanvasElement;
  private readonly octx: CanvasRenderingContext2D;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.5, 2e6);
  private readonly controls: OrbitControls;
  private readonly strokes = new THREE.Group();
  private readonly partialGroup = new THREE.Group();
  private readonly ghostGroup = new THREE.Group();
  private grid: THREE.GridHelper | null = null;
  private axes = new THREE.Group();
  private axisLen = 120;
  private readonly turtleObj: THREE.Group;
  private readonly turtleBody: THREE.MeshBasicMaterial;
  private readonly turtleFin: THREE.MeshBasicMaterial;
  private readonly turtleEdge: THREE.LineBasicMaterial;
  private turtleSize = 12;
  private segments: Segment[] = [];
  partial: Segment | null = null;
  private turtle: TurtleState | null = null;
  private callouts: Callout[] | null = null;
  private materials: LineMaterial[] = [];
  private w = 300;
  private h = 300;
  private needsRender = true;
  private strokesDirty = true;
  private raf = 0;
  private ro: ResizeObserver;
  private ink = '#2b68a8';
  private pal = { canvas: '#fcfdfb', grid: '#e6ebe6', gridMajor: '#d4dcd5', ink: '#15211d', ink2: '#5c6a65', sheet: '#fbfcfa', ghost: '#c1763d' };
  userMoved = false;
  private programmatic = false;

  constructor(opts: { label: string } = { label: 'Rysunek 3D' }) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const gl = this.renderer.domElement;
    gl.classList.add('view-canvas');
    this.overlay = h('canvas', { class: 'view-overlay', 'aria-hidden': 'true' }) as HTMLCanvasElement;
    this.octx = this.overlay.getContext('2d')!;
    this.element = h(
      'div',
      { class: 'view view-3d', tabindex: '0', role: 'img', 'aria-roledescription': 'rysunek przestrzenny', 'aria-label': opts.label },
      gl,
      this.overlay,
    );

    this.camera.up.set(0, 0, 1);
    this.camera.position.copy(DEFAULT_DIR.clone().multiplyScalar(520));
    this.controls = new OrbitControls(this.camera, gl);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.12;
    this.controls.screenSpacePanning = true;
    this.controls.addEventListener('change', () => {
      if (!this.programmatic) this.userMoved = true;
      this.needsRender = true;
    });

    this.scene.add(this.axes, this.strokes, this.partialGroup, this.ghostGroup);

    // turtle: a flat arrowhead (heading, right) with a fin along its up vector
    this.turtleBody = new THREE.MeshBasicMaterial({ color: this.ink, side: THREE.DoubleSide });
    this.turtleFin = new THREE.MeshBasicMaterial({ color: this.ink, side: THREE.DoubleSide, transparent: true, opacity: 0.55 });
    this.turtleEdge = new THREE.LineBasicMaterial({ color: '#ffffff' });
    const body = new THREE.BufferGeometry();
    body.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 1, 0, -0.6, -0.5, 0, 0, -0.2, 0,
      0, 1, 0, 0, -0.2, 0, 0.6, -0.5, 0,
    ], 3));
    const fin = new THREE.BufferGeometry();
    fin.setAttribute('position', new THREE.Float32BufferAttribute([0, 0.55, 0, 0, -0.3, 0, 0, -0.35, 0.5], 3));
    const outline = new THREE.BufferGeometry();
    outline.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 1, 0, -0.6, -0.5, 0, -0.6, -0.5, 0, 0, -0.2, 0, 0, -0.2, 0, 0.6, -0.5, 0, 0.6, -0.5, 0, 0, 1, 0,
    ], 3));
    this.turtleObj = new THREE.Group();
    this.turtleObj.add(new THREE.Mesh(body, this.turtleBody), new THREE.Mesh(fin, this.turtleFin), new THREE.LineSegments(outline, this.turtleEdge));
    this.turtleObj.visible = false;
    this.scene.add(this.turtleObj);

    this.refreshTheme();
    this.rebuildGround(200);
    this.bindKeys();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.element);
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      const moved = this.controls.update();
      if (moved || this.needsRender) this.render();
    };
    loop();
  }

  // ------------------------------------------------------------- data

  setSegments(segments: Segment[]) {
    this.segments = segments;
    this.strokesDirty = true;
    this.needsRender = true;
  }

  setPartial(segment: Segment | null) {
    this.partial = segment;
    const old = new Set(this.partialGroup.children.map((c) => (c as LineSegments2).material));
    this.materials = this.materials.filter((m) => !old.has(m));
    clearGroup(this.partialGroup);
    if (segment) this.partialGroup.add(this.lineObject([segment], segment.width));
    this.needsRender = true;
  }

  setTurtle(t: TurtleState | null) {
    this.turtle = t;
    if (!t) this.turtleObj.visible = false;
    else {
      this.turtleObj.visible = true;
      const m = new THREE.Matrix4().makeBasis(
        new THREE.Vector3(...t.right),
        new THREE.Vector3(...t.heading),
        new THREE.Vector3(...t.up),
      );
      this.turtleObj.position.set(...t.pos);
      this.turtleObj.quaternion.setFromRotationMatrix(m);
      this.turtleObj.scale.setScalar(this.turtleSize);
      this.turtleBody.opacity = t.pen ? 1 : 0.35;
      this.turtleBody.transparent = !t.pen;
    }
    this.needsRender = true;
  }

  setGhost(segs: Segment[] | null) {
    clearGroup(this.ghostGroup);
    if (segs?.length) {
      const pos: number[] = [];
      for (const s of segs) pos.push(...s.from, ...s.to);
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const line = new THREE.LineSegments(g, new THREE.LineDashedMaterial({ color: this.pal.ghost, dashSize: 5, gapSize: 4, transparent: true, opacity: 0.8 }));
      line.computeLineDistances();
      this.ghostGroup.add(line);
    }
    this.needsRender = true;
  }

  setCallouts(c: Callout[] | null) {
    this.callouts = c;
    this.needsRender = true;
  }

  setInk(color: string) {
    this.ink = color;
    this.turtleBody.color.set(color);
    this.turtleFin.color.set(color);
    this.needsRender = true;
  }

  refreshTheme() {
    this.pal = {
      canvas: cssVar('--canvas') || '#fcfdfb',
      grid: cssVar('--grid') || '#e6ebe6',
      gridMajor: cssVar('--grid-major') || '#d4dcd5',
      ink: cssVar('--ink') || '#15211d',
      ink2: cssVar('--ink-3') || '#5c6a65',
      sheet: cssVar('--sheet') || '#fbfcfa',
      ghost: cssVar('--fill-task') || '#c1763d',
    };
    this.renderer.setClearColor(new THREE.Color(this.pal.canvas));
    this.turtleEdge.color.set(this.pal.canvas);
    this.rebuildGround(this.axisLen / 0.6 / 2);
    this.needsRender = true;
  }

  // ------------------------------------------------------------- view

  fit() {
    this.resize();
    const b = boundsOf(this.segments, this.turtle ? [this.turtle.pos] : []);
    const center = new THREE.Vector3((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2);
    const radius = Math.max(40, 0.5 * Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]));
    const fov = (this.camera.fov * Math.PI) / 180;
    const fitH = radius / Math.sin(fov / 2);
    const fitW = radius / Math.sin(Math.atan(Math.tan(fov / 2) * this.camera.aspect));
    const dist = Math.max(fitH, fitW) * 1.08;
    const dir = this.camera.position.clone().sub(this.controls.target).normalize();
    if (!Number.isFinite(dir.x) || dir.lengthSq() < 0.5) dir.copy(DEFAULT_DIR);
    this.place(center, dir, dist, radius);
  }

  resetView() {
    this.resize();
    const b = boundsOf(this.segments);
    const center = b.empty ? new THREE.Vector3() : new THREE.Vector3((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2);
    const radius = b.empty ? 120 : Math.max(40, 0.5 * Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]));
    const fov = (this.camera.fov * Math.PI) / 180;
    this.place(center, DEFAULT_DIR.clone(), (radius / Math.sin(fov / 2)) * 1.15, radius);
  }

  private place(center: THREE.Vector3, dir: THREE.Vector3, dist: number, radius: number) {
    this.programmatic = true;
    this.controls.target.copy(center);
    this.camera.position.copy(center.clone().add(dir.multiplyScalar(dist)));
    this.camera.near = Math.max(0.1, dist / 500);
    this.camera.far = dist * 50 + radius * 10;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.programmatic = false;
    this.userMoved = false;
    this.turtleSize = Math.min(40, Math.max(6, radius * 0.07));
    if (this.turtle) this.setTurtle(this.turtle);
    const b = boundsOf(this.segments);
    const extent = Math.max(Math.abs(b.min[0]), Math.abs(b.max[0]), Math.abs(b.min[1]), Math.abs(b.max[1]), radius);
    this.rebuildGround(extent * 1.2, radius);
    this.needsRender = true;
  }

  zoom(factor: number) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.multiplyScalar(1 / factor);
    this.camera.position.copy(this.controls.target.clone().add(offset));
    this.userMoved = true;
    this.controls.update();
    this.needsRender = true;
  }

  isVisible(points: V3[]) {
    this.camera.updateMatrixWorld();
    return points.every((p) => {
      const v = new THREE.Vector3(...p).project(this.camera);
      return Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z < 1;
    });
  }

  resize() {
    const r = this.element.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    this.w = r.width;
    this.h = r.height;
    this.renderer.setSize(this.w, this.h, true);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.overlay.width = Math.round(this.w * dpr);
    this.overlay.height = Math.round(this.h * dpr);
    this.overlay.style.width = `${this.w}px`;
    this.overlay.style.height = `${this.h}px`;
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    for (const m of this.materials) m.resolution.set(this.w, this.h);
    this.needsRender = true;
    this.render();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
  }

  // ------------------------------------------------------------- scene

  private rebuildGround(half: number, radius = 100) {
    const niceSteps = [10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000];
    const target = Math.max(100, half);
    const step = niceSteps.find((s) => (target * 2) / s <= 24) ?? 50000;
    const size = Math.ceil((target * 2) / step) * step;
    if (this.grid) {
      this.scene.remove(this.grid);
      this.grid.geometry.dispose();
      (this.grid.material as THREE.Material).dispose();
    }
    this.grid = new THREE.GridHelper(size, Math.round(size / step), new THREE.Color(this.pal.gridMajor), new THREE.Color(this.pal.grid));
    this.grid.rotation.x = Math.PI / 2;
    this.scene.add(this.grid);
    this.gridStep = step;

    clearGroup(this.axes);
    this.axisLen = Math.min(size * 0.3, Math.max(40, radius * 1.1));
    const L = this.axisLen;
    const axisColors: [V3, string][] = [
      [[L, 0, 0], cssVar('--fill-task') || '#c1763d'],
      [[0, L, 0], cssVar('--fill-2d') || '#16866a'],
      [[0, 0, L], cssVar('--fill-3d') || '#2b6fb3'],
    ];
    for (const [p, color] of axisColors) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, ...p], 3));
      this.axes.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color })));
    }
    this.needsRender = true;
  }

  private gridStep = 25;

  private lineObject(segs: Segment[], width: number): LineSegments2 {
    const pos: number[] = [];
    const col: number[] = [];
    const c = new THREE.Color();
    for (const s of segs) {
      pos.push(...s.from, ...s.to);
      c.set(s.color);
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    const g = new LineSegmentsGeometry();
    g.setPositions(pos);
    g.setColors(col);
    const m = new LineMaterial({ linewidth: width, vertexColors: true, worldUnits: false });
    m.resolution.set(this.w, this.h);
    this.materials.push(m);
    return new LineSegments2(g, m);
  }

  private rebuildStrokes() {
    for (const child of this.strokes.children) {
      const l = child as LineSegments2;
      l.geometry.dispose();
      (l.material as LineMaterial).dispose();
    }
    this.strokes.clear();
    this.materials = this.materials.filter((m) => this.partialGroup.children.some((c) => (c as LineSegments2).material === m));
    const byWidth = new Map<number, Segment[]>();
    for (const s of this.segments) {
      let list = byWidth.get(s.width);
      if (!list) byWidth.set(s.width, (list = []));
      list.push(s);
    }
    for (const [w, list] of byWidth) this.strokes.add(this.lineObject(list, w));
    this.strokesDirty = false;
  }

  private render() {
    this.needsRender = false;
    if (this.strokesDirty) this.rebuildStrokes();
    this.renderer.render(this.scene, this.camera);
    this.drawOverlay();
  }

  private project(p: V3): [number, number, boolean] {
    const v = new THREE.Vector3(...p).project(this.camera);
    return [((v.x + 1) / 2) * this.w, ((1 - v.y) / 2) * this.h, v.z < 1 && v.z > -1];
  }

  private drawOverlay() {
    const ctx = this.octx;
    const dpr = this.overlay.width / Math.max(1, this.w);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.font = `600 12px ${cssVar('--font-ui') || 'sans-serif'}`;
    ctx.fillStyle = this.pal.ink2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const L = this.axisLen * 1.08;
    for (const [p, label] of [[[L, 0, 0], 'x'], [[0, L, 0], 'y'], [[0, 0, L], 'z']] as [V3, string][]) {
      const [x, y, ok] = this.project(p);
      if (ok) ctx.fillText(label, x, y);
    }
    const [ox, oy, ook] = this.project([0, 0, 0]);
    if (ook) {
      ctx.textAlign = 'left';
      ctx.fillText('0', ox + 6, oy + 10);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`kratka = ${this.gridStep.toLocaleString('pl-PL')}`, this.w - 10, this.h - 8);

    if (this.callouts?.length) {
      const b = boundsOf(this.segments);
      const [cx, cy] = this.project([(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2]);
      const marks = this.callouts
        .map((c) => {
          const [x, y, ok] = this.project(c.anchor);
          if (!ok) return null;
          const [bx, by] = this.project([c.anchor[0] + c.along[0], c.anchor[1] + c.along[1], c.anchor[2] + c.along[2]]);
          const [dx, dy] = leaderDir(x, y, bx, by, cx, cy);
          return { n: c.n, x, y, dx, dy };
        })
        .filter((m): m is NonNullable<typeof m> => !!m);
      const avoid: { x: number; y: number }[] = [];
      if (this.turtle) {
        const [tx, ty, tok] = this.project(this.turtle.pos);
        if (tok) avoid.push({ x: tx, y: ty });
      }
      drawCalloutMarks(ctx, marks, this.w, this.h, { ink: this.pal.ink, sheet: this.pal.sheet }, avoid);
    }
  }

  private bindKeys() {
    this.element.addEventListener('keydown', (e) => {
      const offset = this.camera.position.clone().sub(this.controls.target);
      const a = (8 * Math.PI) / 180;
      let handled = true;
      if (e.shiftKey && e.key.startsWith('Arrow')) {
        const dist = offset.length() * 0.06;
        const right = new THREE.Vector3().crossVectors(offset, Z).normalize().multiplyScalar(-1);
        const up = new THREE.Vector3().crossVectors(right, offset).normalize().multiplyScalar(-1);
        const move = new THREE.Vector3();
        if (e.key === 'ArrowLeft') move.copy(right).multiplyScalar(-dist);
        if (e.key === 'ArrowRight') move.copy(right).multiplyScalar(dist);
        if (e.key === 'ArrowUp') move.copy(up).multiplyScalar(dist);
        if (e.key === 'ArrowDown') move.copy(up).multiplyScalar(-dist);
        this.controls.target.add(move);
        this.camera.position.add(move);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        offset.applyAxisAngle(Z, e.key === 'ArrowLeft' ? -a : a);
        this.camera.position.copy(this.controls.target.clone().add(offset));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const axis = new THREE.Vector3().crossVectors(offset, Z).normalize();
        const next = offset.clone().applyAxisAngle(axis, e.key === 'ArrowUp' ? a : -a);
        const polar = next.angleTo(Z);
        if (polar > 0.05 && polar < Math.PI - 0.05) this.camera.position.copy(this.controls.target.clone().add(next));
      } else if (e.key === '+' || e.key === '=') this.zoom(1.25);
      else if (e.key === '-' || e.key === '_') this.zoom(0.8);
      else if (e.key === '0') this.fit();
      else handled = false;
      if (handled) {
        e.preventDefault();
        this.userMoved = true;
        this.controls.update();
        this.needsRender = true;
      }
    });
  }

  // ------------------------------------------------------------- export

  async toPNG(title: string): Promise<Blob> {
    this.render();
    const src = this.renderer.domElement;
    const c = document.createElement('canvas');
    c.width = src.width;
    c.height = src.height + Math.round(48 * (src.width / this.w));
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = this.pal.canvas;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(src, 0, 0);
    ctx.drawImage(this.overlay, 0, 0, src.width, src.height);
    const k = src.width / this.w;
    ctx.fillStyle = this.pal.ink2;
    ctx.font = `600 ${Math.round(15 * k)}px ${cssVar('--font-ui') || 'sans-serif'}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(`Logomocja · ${title}`, 16 * k, src.height + 24 * k);
    return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG'))), 'image/png'));
  }
}

function clearGroup(g: THREE.Group) {
  for (const child of [...g.children]) {
    const o = child as THREE.Mesh;
    o.geometry?.dispose();
    const m = o.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(m)) m.forEach((x) => x.dispose());
    else m?.dispose();
  }
  g.clear();
}
