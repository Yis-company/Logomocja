import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Segment } from '../lang/interp';
import { cssVar, lerp, nextFrame, shownTurtlePos, type Scene, type View } from './scene';

const DEFAULT_DIR = new THREE.Vector3(0.9, -1.3, 1.1).normalize();

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function makeLabel(text: string, color: string): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.font = '700 40px Lato, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 32, 34);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sprite.scale.set(14, 14, 1);
  return sprite;
}

export class View3D implements View {
  readonly kind = '3d' as const;
  readonly element: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene3 = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.5, 20000);
  private controls: OrbitControls;
  private lines = new Map<number, LineSegments2>();
  private ghostLine: LineSegments2 | null = null;
  private grid: THREE.GridHelper | null = null;
  private axes = new THREE.Group();
  private turtle = new THREE.Group();
  private turtleFill: THREE.MeshBasicMaterial;
  private turtleEdge: THREE.LineBasicMaterial;
  private scene: Scene | null = null;
  private builtFor = { version: -1, count: -1, partialT: -1, ghost: null as Segment[] | null };
  private queued = false;
  private gridSize = 400;
  private active = true;
  private w = 1;
  private h = 1;

  constructor(label: string) {
    this.element = document.createElement('div');
    this.element.className = 'view view-3d';
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const canvas = this.renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', label);
    this.element.append(canvas);

    this.camera.up.set(0, 0, 1);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = false;
    this.controls.screenSpacePanning = true;
    this.controls.listenToKeyEvents(canvas);
    this.controls.keyPanSpeed = 20;
    this.controls.addEventListener('change', () => this.queue());
    canvas.addEventListener('keydown', (e) => {
      if (e.key === '+' || e.key === '=') this.zoomBy(1.25);
      else if (e.key === '-' || e.key === '_') this.zoomBy(0.8);
      else if (e.key === '0') this.fit();
      else return;
      e.preventDefault();
    });

    // Żółw: grot w płaszczyźnie kierunek–prawo i płetwa wskazująca „górę” żółwia.
    this.turtleFill = new THREE.MeshBasicMaterial({ color: 0xf5c400, side: THREE.DoubleSide });
    this.turtleEdge = new THREE.LineBasicMaterial({ color: 0x17201c });
    const body = new THREE.BufferGeometry();
    // lokalne osie: x = prawo, y = kierunek, z = góra
    body.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 1.3, 0, -0.75, -0.6, 0, 0, -0.2, 0,
      0, 1.3, 0, 0, -0.2, 0, 0.75, -0.6, 0,
      0, 0.5, 0, 0, -0.45, 0, 0, -0.45, 0.7,
    ], 3));
    const outline = new THREE.BufferGeometry();
    outline.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 1.3, 0, -0.75, -0.6, 0, -0.75, -0.6, 0, 0, -0.2, 0, 0, -0.2, 0, 0.75, -0.6, 0, 0.75, -0.6, 0, 0, 1.3, 0,
      0, 0.5, 0, 0, -0.45, 0.7, 0, -0.45, 0.7, 0, -0.45, 0,
    ], 3));
    this.turtle.add(new THREE.Mesh(body, this.turtleFill), new THREE.LineSegments(outline, this.turtleEdge));
    this.turtle.renderOrder = 10;
    this.scene3.add(this.turtle, this.axes);

    this.onThemeChange();
    this.resetView();
    new ResizeObserver(() => this.resize()).observe(this.element);
  }

  setActive(active: boolean) {
    this.active = active;
    if (active) this.resize();
  }

  setLabel(label: string) {
    this.renderer.domElement.setAttribute('aria-label', label);
  }

  onThemeChange() {
    this.scene3.background = new THREE.Color(cssVar('--sheet') || '#fbfcfa');
    this.buildGrid(this.gridSize);
    this.turtleFill.color.set(cssVar('--now') || '#f5c400');
    this.turtleEdge.color.set(cssVar('--ink') || '#17201c');
    if (this.ghostLine) (this.ghostLine.material as LineMaterial).color.set(cssVar('--ghost-solid') || '#9fb8ad');
    this.queue();
  }

  private buildGrid(size: number) {
    if (this.grid) {
      this.scene3.remove(this.grid);
      this.grid.geometry.dispose();
      (this.grid.material as THREE.Material).dispose();
    }
    const divisions = 20;
    this.grid = new THREE.GridHelper(size, divisions, new THREE.Color(cssVar('--grid-major') || '#cfd4cc'), new THREE.Color(cssVar('--grid') || '#e3e6e0'));
    this.grid.rotation.x = Math.PI / 2;
    this.scene3.add(this.grid);
    this.gridSize = size;

    this.axes.clear();
    const len = size / 2;
    const colors = [cssVar('--axis-x') || '#c0392b', cssVar('--axis-y') || '#1d7a3e', cssVar('--axis-z') || '#2b6fb3'];
    const dirs = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
    ['x', 'y', 'z'].forEach((name, i) => {
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), dirs[i].clone().multiplyScalar(len * 0.5)]);
      const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: colors[i] }));
      const label = makeLabel(name, colors[i]);
      label.position.copy(dirs[i].clone().multiplyScalar(len * 0.5 + 8));
      label.scale.setScalar(Math.max(12, size / 30));
      this.axes.add(line, label);
    });
  }

  setScene(scene: Scene) {
    this.scene = scene;
    this.queue();
  }

  private rebuild() {
    const s = this.scene;
    if (!s) return;
    const b = this.builtFor;
    const pT = s.partial ? s.partial.t : -1;
    if (b.version !== s.version || b.count !== s.segments.length || b.partialT !== pT) {
      const byWidth = new Map<number, { pos: number[]; col: number[] }>();
      const c = new THREE.Color();
      s.segments.forEach((seg, i) => {
        let to = seg.to;
        if (s.partial && s.partial.index === i) to = lerp(seg.from, seg.to, s.partial.t);
        let bucket = byWidth.get(seg.width);
        if (!bucket) byWidth.set(seg.width, (bucket = { pos: [], col: [] }));
        bucket.pos.push(...seg.from, ...to);
        c.set(seg.color);
        bucket.col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      });
      for (const [w, line] of this.lines) {
        if (!byWidth.has(w)) {
          this.scene3.remove(line);
          line.geometry.dispose();
          (line.material as LineMaterial).dispose();
          this.lines.delete(w);
        }
      }
      for (const [w, data] of byWidth) {
        let line = this.lines.get(w);
        const geo = new LineSegmentsGeometry();
        geo.setPositions(data.pos);
        geo.setColors(data.col);
        if (line) {
          line.geometry.dispose();
          line.geometry = geo;
        } else {
          const mat = new LineMaterial({ linewidth: w, vertexColors: true, worldUnits: false });
          mat.resolution.set(this.w, this.h);
          line = new LineSegments2(geo, mat);
          this.lines.set(w, line);
          this.scene3.add(line);
        }
        line.computeLineDistances();
      }
      b.version = s.version;
      b.count = s.segments.length;
      b.partialT = pT;
    }
    if (b.ghost !== s.ghost) {
      if (this.ghostLine) {
        this.scene3.remove(this.ghostLine);
        this.ghostLine.geometry.dispose();
        this.ghostLine = null;
      }
      if (s.ghost && s.ghost.length) {
        const geo = new LineSegmentsGeometry();
        geo.setPositions(s.ghost.flatMap((g) => [...g.from, ...g.to]));
        const mat = new LineMaterial({ linewidth: 8, color: new THREE.Color(cssVar('--ghost-solid') || '#9fb8ad').getHex(), transparent: true, opacity: 0.55, worldUnits: false, depthWrite: false });
        mat.resolution.set(this.w, this.h);
        this.ghostLine = new LineSegments2(geo, mat);
        this.ghostLine.renderOrder = -1;
        this.scene3.add(this.ghostLine);
      }
      b.ghost = s.ghost;
    }
    const t = s.turtle;
    const pos = shownTurtlePos(s);
    const m = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(...t.right), new THREE.Vector3(...t.heading), new THREE.Vector3(...t.up),
    );
    this.turtle.quaternion.setFromRotationMatrix(m);
    this.turtle.position.set(pos[0], pos[1], pos[2]);
    this.turtleFill.transparent = !t.pen;
    this.turtleFill.opacity = t.pen ? 1 : 0.15;
  }

  private resize() {
    const r = this.element.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.w = r.width;
    this.h = r.height;
    this.renderer.setSize(r.width, r.height, true);
    this.camera.aspect = r.width / r.height;
    this.camera.updateProjectionMatrix();
    for (const l of this.lines.values()) (l.material as LineMaterial).resolution.set(r.width, r.height);
    if (this.ghostLine) (this.ghostLine.material as LineMaterial).resolution.set(r.width, r.height);
    this.paint();
  }

  private queue() {
    if (this.queued) return;
    this.queued = true;
    requestAnimationFrame(() => {
      this.queued = false;
      this.paint();
    });
  }

  private paint() {
    if (!this.active) return;
    this.rebuild();
    const d = this.camera.position.distanceTo(this.turtle.position);
    this.turtle.scale.setScalar(Math.max(d * 0.018, 0.5));
    this.renderer.render(this.scene3, this.camera);
  }

  async flush() {
    this.resize();
    this.paint();
    await nextFrame();
    await nextFrame();
  }

  zoomBy(f: number) {
    const target = this.controls.target;
    const off = this.camera.position.clone().sub(target).multiplyScalar(1 / f);
    this.camera.position.copy(target).add(off);
    this.controls.update();
    this.queue();
  }

  resetView() {
    this.controls.target.set(0, 0, 0);
    this.camera.position.copy(DEFAULT_DIR).multiplyScalar(520);
    this.controls.update();
    this.queue();
  }

  fit() {
    const box = new THREE.Box3();
    const s = this.scene;
    box.expandByPoint(new THREE.Vector3(0, 0, 0));
    if (s) {
      for (const seg of s.segments) {
        box.expandByPoint(new THREE.Vector3(...seg.from));
        box.expandByPoint(new THREE.Vector3(...seg.to));
      }
      if (s.ghost) for (const seg of s.ghost) box.expandByPoint(new THREE.Vector3(...seg.to));
      box.expandByPoint(new THREE.Vector3(...s.turtle.pos));
    }
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const radius = Math.max(sphere.radius, 30);
    const fov = (this.camera.fov * Math.PI) / 180;
    const fitH = radius / Math.sin(fov / 2);
    const fitW = radius / Math.sin(Math.atan(Math.tan(fov / 2) * this.camera.aspect));
    const dist = Math.max(fitH, fitW) * 1.08;
    let dir = this.camera.position.clone().sub(this.controls.target);
    if (dir.lengthSq() < 1e-9) dir = DEFAULT_DIR.clone();
    dir.normalize();
    this.controls.target.copy(sphere.center);
    this.camera.position.copy(sphere.center).add(dir.multiplyScalar(dist));
    this.camera.near = Math.max(0.1, dist / 1000);
    this.camera.far = dist * 20 + 2000;
    this.camera.updateProjectionMatrix();
    const extent = Math.max(Math.abs(box.min.x), Math.abs(box.max.x), Math.abs(box.min.y), Math.abs(box.max.y));
    const size = Math.max(400, Math.ceil((extent * 2.4) / 100) * 100);
    if (size !== this.gridSize) this.buildGrid(size);
    this.controls.update();
    this.queue();
  }

  async toPNG(): Promise<Blob | null> {
    const t = this.turtle.visible;
    this.turtle.visible = false;
    this.rebuild();
    this.renderer.render(this.scene3, this.camera);
    const blob = await new Promise<Blob | null>((r) => this.renderer.domElement.toBlob((b) => r(b), 'image/png'));
    this.turtle.visible = t;
    this.queue();
    return blob;
  }
}
