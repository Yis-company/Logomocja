import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  Group,
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  LineSegments,
  LineBasicMaterial,
  LineLoop,
  DoubleSide,
  Matrix4,
  Vector3,
  Vector2,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  SRGBColorSpace,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Segment } from '../lang/types';
import type { TurtleState } from '../lang/interpreter';
import { boundsOf, cssVar, type DrawingSurface, type Overlay } from './surface';

const DEFAULT_DIR = new Vector3(0.55, -0.72, 0.42).normalize();
const FOV = 40;

interface Batch {
  segs: Segment[];
  obj: LineSegments2 | null;
  mat: LineMaterial;
  dirty: boolean;
}

function linear(hex: string): Color {
  return new Color(hex);
}

export class View3D implements DrawingSurface {
  readonly kind = '3d' as const;
  readonly element: HTMLElement;
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(FOV, 1, 0.5, 2_000_000);
  private controls: OrbitControls;
  private batches = new Map<number, Batch>();
  private segments: Segment[] = [];
  private partialObj: LineSegments2 | null = null;
  private partialMat: LineMaterial;
  private overlayObjs: LineSegments2[] = [];
  private overlay: Overlay | null = null;
  private turtleGroup = new Group();
  private turtle: TurtleState | null = null;
  private gridGroup = new Group();
  private gridExtent = 0;
  private res = new Vector2(1, 1);
  private raf = 0;
  private anim = 0;
  private ro: ResizeObserver;
  private fillMat: MeshBasicMaterial;
  private inkMat: LineBasicMaterial;
  private finMat: MeshBasicMaterial;
  userMoved = false;

  constructor(host: HTMLElement) {
    this.element = host;
    this.renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const canvas = this.renderer.domElement;
    canvas.className = 'plate-canvas';
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-roledescription', 'przestrzeń rysunku');
    host.append(canvas);

    this.camera.up.set(0, 0, 1);
    this.camera.position.copy(DEFAULT_DIR.clone().multiplyScalar(520));
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = false;
    this.controls.screenSpacePanning = true;
    this.controls.zoomSpeed = 1.1;
    this.controls.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };
    this.controls.listenToKeyEvents(canvas);
    this.controls.addEventListener('change', () => this.request());
    this.controls.addEventListener('start', () => {
      this.userMoved = true;
      canvas.classList.add('is-dragging');
    });
    this.controls.addEventListener('end', () => canvas.classList.remove('is-dragging'));
    canvas.addEventListener('keydown', (e) => {
      if (e.key === '+' || e.key === '=') this.zoomBy(1.25);
      else if (e.key === '-' || e.key === '_') this.zoomBy(0.8);
      else if (e.key === '0') this.fit(true);
      else return;
      e.preventDefault();
    });
    canvas.addEventListener('dblclick', () => this.fit(true));

    this.partialMat = new LineMaterial({ vertexColors: true, linewidth: 3, worldUnits: false });
    this.fillMat = new MeshBasicMaterial({ side: DoubleSide });
    this.inkMat = new LineBasicMaterial();
    this.finMat = new MeshBasicMaterial({ side: DoubleSide });
    this.buildTurtle();
    this.scene.add(this.gridGroup, this.turtleGroup);
    this.refreshTheme();
    this.buildGrid(200);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.updateLabel();
  }

  private buildTurtle(): void {
    // local frame: x = right, y = heading, z = up
    const arrow = new BufferGeometry();
    arrow.setAttribute('position', new Float32BufferAttribute([0, 1.3, 0, -0.7, -0.6, 0, 0, -0.25, 0, 0, 1.3, 0, 0, -0.25, 0, 0.7, -0.6, 0], 3));
    const outline = new BufferGeometry();
    outline.setAttribute('position', new Float32BufferAttribute([0, 1.3, 0, -0.7, -0.6, 0, 0, -0.25, 0, 0.7, -0.6, 0], 3));
    const fin = new BufferGeometry();
    fin.setAttribute('position', new Float32BufferAttribute([0, 0.55, 0, 0, -0.45, 0, 0, -0.35, 0.75], 3));
    this.turtleGroup.add(new Mesh(arrow, this.fillMat), new LineLoop(outline, this.inkMat), new Mesh(fin, this.finMat));
    this.turtleGroup.matrixAutoUpdate = false;
    this.turtleGroup.visible = false;
  }

  private label(text: string, color: string): Sprite {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.font = '600 40px "Archivo Variable", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 34);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    const sprite = new Sprite(new SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    sprite.userData.isLabel = true;
    return sprite;
  }

  private buildGrid(extent: number): void {
    for (const child of [...this.gridGroup.children]) {
      this.gridGroup.remove(child);
      const any = child as unknown as { geometry?: BufferGeometry; material?: { dispose(): void; map?: { dispose(): void } } };
      any.geometry?.dispose();
      any.material?.map?.dispose();
      any.material?.dispose();
    }
    this.gridExtent = extent;
    const minorStep = extent > 600 ? 50 : 10;
    const minor: number[] = [];
    const major: number[] = [];
    for (let v = -extent; v <= extent + 1e-9; v += minorStep) {
      const list = Math.abs(v % 100) < 1e-9 ? major : minor;
      if (Math.abs(v) < 1e-9) continue;
      list.push(-extent, v, 0, extent, v, 0, v, -extent, 0, v, extent, 0);
    }
    const mk = (arr: number[], color: string) => {
      const g = new BufferGeometry();
      g.setAttribute('position', new Float32BufferAttribute(arr, 3));
      return new LineSegments(g, new LineBasicMaterial({ color: new Color(color) }));
    };
    const axisColor = cssVar('--plate-axis');
    this.gridGroup.add(mk(minor, cssVar('--plate-minor')), mk(major, cssVar('--plate-major')));
    const axes = mk([-extent, 0, 0, extent, 0, 0, 0, -extent, 0, 0, extent, 0, 0, 0, 0, 0, 0, extent * 0.6], axisColor);
    this.gridGroup.add(axes);
    const labelColor = cssVar('--plate-axis');
    const lx = this.label('x', labelColor);
    lx.position.set(extent + extent * 0.04, 0, 0);
    const ly = this.label('y', labelColor);
    ly.position.set(0, extent + extent * 0.04, 0);
    const lz = this.label('z', labelColor);
    lz.position.set(0, 0, extent * 0.6 + extent * 0.04);
    for (const l of [lx, ly, lz]) {
      l.scale.setScalar(extent * 0.045);
      this.gridGroup.add(l);
    }
  }

  private batch(width: number): Batch {
    let b = this.batches.get(width);
    if (!b) {
      b = { segs: [], obj: null, mat: new LineMaterial({ vertexColors: true, linewidth: width, worldUnits: false }), dirty: true };
      b.mat.resolution.copy(this.res);
      this.batches.set(width, b);
    }
    return b;
  }

  private geometryFor(segs: Segment[], colorOverride?: string): LineSegmentsGeometry {
    const pos = new Float32Array(segs.length * 6);
    const col = new Float32Array(segs.length * 6);
    const cache = new Map<string, Color>();
    segs.forEach((s, i) => {
      pos.set([s.from[0], s.from[1], s.from[2], s.to[0], s.to[1], s.to[2]], i * 6);
      const key = colorOverride ?? s.color;
      let c = cache.get(key);
      if (!c) {
        c = linear(key);
        cache.set(key, c);
      }
      col.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    });
    const g = new LineSegmentsGeometry();
    g.setPositions(pos);
    g.setColors(col);
    return g;
  }

  private rebuildBatches(): void {
    for (const b of this.batches.values()) {
      if (!b.dirty) continue;
      b.dirty = false;
      if (b.obj) {
        this.scene.remove(b.obj);
        b.obj.geometry.dispose();
        b.obj = null;
      }
      if (b.segs.length) {
        b.obj = new LineSegments2(this.geometryFor(b.segs), b.mat);
        b.obj.frustumCulled = false;
        b.obj.renderOrder = 2;
        this.scene.add(b.obj);
      }
    }
  }

  setSegments(list: Segment[]): void {
    this.segments = list.slice();
    for (const b of this.batches.values()) {
      b.segs = [];
      b.dirty = true;
    }
    for (const s of list) this.batch(s.width).segs.push(s);
    this.updateLabel();
    this.request();
  }

  addSegment(seg: Segment): void {
    this.segments.push(seg);
    const b = this.batch(seg.width);
    b.segs.push(seg);
    b.dirty = true;
    this.request();
  }

  setPartial(p: { seg: Segment; t: number } | null): void {
    if (this.partialObj) {
      this.scene.remove(this.partialObj);
      this.partialObj.geometry.dispose();
      this.partialObj = null;
    }
    if (p) {
      const { seg, t } = p;
      const to: [number, number, number] = [
        seg.from[0] + (seg.to[0] - seg.from[0]) * t,
        seg.from[1] + (seg.to[1] - seg.from[1]) * t,
        seg.from[2] + (seg.to[2] - seg.from[2]) * t,
      ];
      this.partialMat.linewidth = seg.width;
      this.partialObj = new LineSegments2(this.geometryFor([{ ...seg, to }]), this.partialMat);
      this.partialObj.frustumCulled = false;
      this.scene.add(this.partialObj);
    }
    this.request();
  }

  setTurtle(t: TurtleState | null): void {
    this.turtle = t;
    this.request();
  }

  setOverlay(o: Overlay | null): void {
    this.overlay = o;
    for (const obj of this.overlayObjs) {
      this.scene.remove(obj);
      obj.geometry.dispose();
      (obj.material as LineMaterial).dispose();
    }
    this.overlayObjs = [];
    if (o) {
      const add = (segs: Segment[], color: string, width: number, dashed: boolean, order: number) => {
        if (!segs.length) return;
        const mat = new LineMaterial({ color: linear(color).getHex(), linewidth: width, worldUnits: false, dashed, dashSize: 6, gapSize: 5 });
        mat.resolution.copy(this.res);
        const obj = new LineSegments2(this.geometryFor(segs, '#ffffff'), mat);
        if (dashed) obj.computeLineDistances();
        obj.frustumCulled = false;
        obj.renderOrder = order;
        this.overlayObjs.push(obj);
        this.scene.add(obj);
      };
      add(o.ghost, cssVar('--plate-ghost'), 11, false, 1);
      add(o.extra, cssVar('--amber'), 7, false, 3);
      add(o.missing, cssVar('--red'), 3, true, 4);
    }
    this.request();
  }

  private updateLabel(): void {
    const n = this.segments.length;
    this.renderer.domElement.setAttribute(
      'aria-label',
      `Rysunek w trybie 3D: ${n === 0 ? 'pusty' : `${n} odc.`}. Przeciągnij, by obracać, prawym przyciskiem lub dwoma palcami przesuwaj, kółkiem przybliżaj. Strzałki przesuwają, plus i minus przybliżają, zero dopasowuje.`,
    );
  }

  private framing(): { center: Vector3; radius: number } {
    const lists = [this.segments];
    if (this.overlay) lists.push(this.overlay.ghost);
    const extra: [number, number, number][] = [[0, 0, 0]];
    if (this.turtle) extra.push(this.turtle.pos);
    const b = boundsOf(lists, extra)!;
    const center = new Vector3((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, (b.minZ + b.maxZ) / 2);
    const radius = Math.max(Math.hypot(b.maxX - b.minX, b.maxY - b.minY, b.maxZ - b.minZ) / 2, 60);
    return { center, radius };
  }

  private moveCamera(target: Vector3, position: Vector3, animate: boolean): void {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    cancelAnimationFrame(this.anim);
    if (!animate || reduce) {
      this.controls.target.copy(target);
      this.camera.position.copy(position);
      this.controls.update();
      this.request();
      return;
    }
    const t0 = performance.now();
    const fromT = this.controls.target.clone();
    const fromP = this.camera.position.clone();
    const step = (now: number) => {
      const k = Math.min((now - t0) / 260, 1);
      const e = 1 - Math.pow(1 - k, 3);
      this.controls.target.lerpVectors(fromT, target, e);
      this.camera.position.lerpVectors(fromP, position, e);
      this.controls.update();
      this.renderNow();
      if (k < 1) this.anim = requestAnimationFrame(step);
    };
    this.anim = requestAnimationFrame(step);
  }

  private ensureGrid(center: Vector3, radius: number): void {
    const reach = Math.max(Math.abs(center.x) + radius, Math.abs(center.y) + radius, 150);
    const extent = Math.max(200, Math.ceil((reach + 40) / 100) * 100);
    if (extent !== this.gridExtent) this.buildGrid(extent);
  }

  fit(animate = false, dir?: Vector3): void {
    const { center, radius } = this.framing();
    this.ensureGrid(center, radius);
    const aspect = Math.max(this.res.x / this.res.y, 0.2);
    const halfV = (FOV * Math.PI) / 360;
    const halfH = Math.atan(Math.tan(halfV) * aspect);
    const dist = (radius / Math.sin(Math.min(halfV, halfH))) * 1.08;
    const d = dir ?? this.camera.position.clone().sub(this.controls.target).normalize();
    if (!Number.isFinite(d.x) || d.lengthSq() < 0.5) d.copy(DEFAULT_DIR);
    this.userMoved = false;
    this.moveCamera(center, center.clone().add(d.multiplyScalar(dist)), animate);
  }

  resetView(): void {
    this.fit(true, DEFAULT_DIR.clone());
  }

  contentVisible(): boolean {
    const b = boundsOf([this.segments]);
    if (!b) return true;
    this.camera.updateMatrixWorld();
    for (const x of [b.minX, b.maxX]) for (const y of [b.minY, b.maxY]) for (const z of [b.minZ, b.maxZ]) {
      const p = new Vector3(x, y, z).project(this.camera);
      if (Math.abs(p.x) > 1 || Math.abs(p.y) > 1 || p.z > 1) return false;
    }
    return true;
  }

  zoomBy(factor: number): void {
    const offset = this.camera.position.clone().sub(this.controls.target).divideScalar(factor);
    this.camera.position.copy(this.controls.target).add(offset);
    this.userMoved = true;
    this.controls.update();
    this.request();
  }

  refreshTheme(): void {
    this.scene.background = new Color(cssVar('--plate'));
    this.fillMat.color = new Color(cssVar('--yellow'));
    this.inkMat.color = new Color(cssVar('--marker-ink'));
    this.finMat.color = new Color(cssVar('--marker-ink'));
    if (this.gridExtent) this.buildGrid(this.gridExtent);
    if (this.overlay) this.setOverlay(this.overlay);
    this.request();
  }

  resize(): void {
    const rect = this.element.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === this.res.x && h === this.res.y) return;
    const wasHidden = this.res.x <= 1 || this.res.y <= 1;
    this.res.set(w, h);
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    for (const b of this.batches.values()) b.mat.resolution.copy(this.res);
    this.partialMat.resolution.copy(this.res);
    for (const o of this.overlayObjs) (o.material as LineMaterial).resolution.copy(this.res);
    if (wasHidden && w > 1 && h > 1 && !this.userMoved) this.fit(false);
    this.renderNow();
  }

  private request(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.renderNow();
    });
  }

  private placeTurtle(): void {
    const t = this.turtle;
    this.turtleGroup.visible = !!t;
    if (!t) return;
    const dist = this.camera.position.distanceTo(this.controls.target);
    const s = Math.max(dist * 0.022, 0.5);
    const m = new Matrix4().makeBasis(
      new Vector3(...t.right).multiplyScalar(s),
      new Vector3(...t.heading).multiplyScalar(s),
      new Vector3(...t.up).multiplyScalar(s),
    );
    m.setPosition(t.pos[0], t.pos[1], t.pos[2]);
    this.turtleGroup.matrix.copy(m);
    this.turtleGroup.matrixWorldNeedsUpdate = true;
  }

  renderNow(): void {
    this.rebuildBatches();
    this.placeTurtle();
    this.renderer.render(this.scene, this.camera);
  }

  async exportPNG(): Promise<Blob | null> {
    if (!this.segments.length) return null;
    this.renderNow();
    return new Promise((resolve) => this.renderer.domElement.toBlob((b) => resolve(b), 'image/png'));
  }

  destroy(): void {
    this.ro.disconnect();
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.anim);
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
