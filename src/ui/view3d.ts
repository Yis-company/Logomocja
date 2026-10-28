import {
  AmbientLight, BufferGeometry, ConeGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments,
  Matrix4, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, CanvasTexture, Color,
  Vector3, WebGLRenderer, DirectionalLight, GridHelper, Object3D, Box3, Sphere,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Segment } from '../lang/interp';
import { h } from './dom';
import { cssVar, Draw, View } from './draw';

const DEFAULT_DIR = new Vector3(0.55, -0.85, 0.62).normalize();

function label(text: string, color: string): Sprite {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  g.font = 'bold 44px system-ui, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = color;
  g.fillText(text, 32, 34);
  const m = new SpriteMaterial({ map: new CanvasTexture(c), depthTest: false, transparent: true });
  const s = new Sprite(m);
  s.renderOrder = 10;
  return s;
}

export class View3D implements View {
  readonly el: HTMLElement;
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(45, 1, 0.1, 1e6);
  private controls: OrbitControls;
  private lines = new Group();
  private ghostLines: LineSegments | null = null;
  private lineMats: LineMaterial[] = [];
  private grid: Object3D | null = null;
  private axes = new Group();
  private turtle = new Group();
  private builtVersion = -1;
  private builtGhost = -1;
  private gridSize = 0;
  private pending = false;
  private w = 300;
  private hgt = 300;
  private waiters: Array<() => void> = [];
  private canvas: HTMLCanvasElement;

  constructor(private draw: Draw) {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.canvas = this.renderer.domElement;
    this.canvas.classList.add('view-canvas');
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label',
      'Rysunek żółwia w 3D. Przeciągnij, aby obrócić widok; prawy przycisk lub Shift przesuwa; kółko myszy lub plus i minus zmieniają powiększenie; strzałki przesuwają; zero dopasowuje.');
    this.el = h('div', { class: 'view-host' }, this.canvas);

    this.camera.up.set(0, 0, 1);
    this.scene.add(this.lines, this.axes, this.turtle);
    this.scene.add(new AmbientLight(0xffffff, 1.4));
    const dl = new DirectionalLight(0xffffff, 2.2);
    dl.position.set(1, -2, 3);
    this.scene.add(dl);
    this.buildTurtle();

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = false;
    this.controls.screenSpacePanning = true;
    this.controls.listenToKeyEvents(this.canvas);
    this.controls.keyPanSpeed = 20;
    this.controls.addEventListener('change', () => this.invalidate());
    this.canvas.addEventListener('keydown', e => {
      if (e.key === '+' || e.key === '=') this.zoom(1.25);
      else if (e.key === '-' || e.key === '_') this.zoom(0.8);
      else if (e.key === '0' || e.key === 'f' || e.key === 'F') this.fit();
      else if (e.key === 'r' || e.key === 'R') this.reset();
      else return;
      e.preventDefault();
    });
    this.canvas.addEventListener('dblclick', () => this.fit());
    new ResizeObserver(() => this.resize()).observe(this.el);
    this.reset();
  }

  private buildTurtle() {
    const geo = new ConeGeometry(0.5, 1.7, 4, 1);
    geo.rotateY(Math.PI / 4);
    const mat = new MeshStandardMaterial({ color: new Color('#16866a'), roughness: 0.5, metalness: 0.05, flatShading: true });
    const mesh = new Mesh(geo, mat);
    mesh.scale.set(1, 1, 0.5);
    const up = new BufferGeometry();
    up.setAttribute('position', new Float32BufferAttribute([0, 0, 0.25, 0, 0, 1.1], 3));
    const upLine = new LineSegments(up, new LineBasicMaterial({ color: 0xe0a21b, depthTest: false }));
    const nose = new Mesh(new ConeGeometry(0.18, 0.5, 8), new MeshStandardMaterial({ color: '#e0a21b' }));
    nose.position.set(0, 1.0, 0);
    this.turtle.add(mesh, upLine, nose);
  }

  private resize() {
    const r = this.el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    this.w = r.width; this.hgt = r.height;
    this.renderer.setSize(this.w, this.hgt, false);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.hgt}px`;
    this.camera.aspect = this.w / this.hgt;
    this.camera.updateProjectionMatrix();
    for (const m of this.lineMats) m.resolution.set(this.w, this.hgt);
    this.invalidate();
  }

  zoom(f: number) {
    const t = this.controls.target;
    const v = this.camera.position.clone().sub(t).multiplyScalar(1 / f);
    this.camera.position.copy(t).add(v);
    this.controls.update();
    this.invalidate();
  }

  private extent(segs: Segment[]): { center: Vector3; radius: number } {
    const box = new Box3(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
    for (const s of segs) {
      box.expandByPoint(new Vector3(...s.from));
      box.expandByPoint(new Vector3(...s.to));
    }
    const sp = new Sphere();
    box.getBoundingSphere(sp);
    return { center: sp.center, radius: Math.max(sp.radius, 20) };
  }

  fit(segs?: Segment[]) {
    const list = segs ?? [...this.draw.segments, ...(this.draw.ghost ?? [])];
    const { center, radius } = this.extent(list);
    this.place(center, radius, this.camera.position.clone().sub(this.controls.target).normalize());
  }

  reset() {
    const { center, radius } = this.extent(this.draw.segments.length ? this.draw.segments : []);
    this.place(this.draw.segments.length ? center : new Vector3(0, 0, 0), this.draw.segments.length ? radius : 150, DEFAULT_DIR.clone());
  }

  private place(center: Vector3, radius: number, dir: Vector3) {
    if (!isFinite(dir.length()) || dir.lengthSq() < 1e-9) dir = DEFAULT_DIR.clone();
    const fov = (this.camera.fov * Math.PI) / 180;
    const fovH = 2 * Math.atan(Math.tan(fov / 2) * Math.max(this.camera.aspect, 0.2));
    const dist = (radius * 1.08) / Math.sin(Math.min(fov, fovH) / 2);
    this.camera.position.copy(center).addScaledVector(dir, dist);
    this.camera.near = Math.max(dist / 1000, 0.01);
    this.camera.far = dist * 50 + radius * 20;
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(center);
    this.controls.maxDistance = dist * 40;
    this.controls.update();
    this.ensureGrid(radius, center);
    this.invalidate();
  }

  private ensureGrid(radius: number, center: Vector3) {
    const size = Math.max(200, Math.ceil((Math.max(radius + center.length(), 100) * 1.6) / 100) * 100);
    if (size === this.gridSize) return;
    this.gridSize = size;
    if (this.grid) { this.scene.remove(this.grid); (this.grid as GridHelper).geometry.dispose(); }
    const step = size > 2000 ? 200 : size > 800 ? 100 : size > 400 ? 50 : 20;
    const g = new GridHelper(size * 2, (size * 2) / step, new Color(cssVar('--axis-3d') || '#777'), new Color(cssVar('--grid-3d') || '#bbb'));
    g.rotation.x = Math.PI / 2;
    this.grid = g;
    this.scene.add(g);
    this.axes.clear();
    const defs: Array<[number[], string, string]> = [[[size, 0, 0], 'X', '#c0392b'], [[0, size, 0], 'Y', '#2f8f4e'], [[0, 0, size], 'Z', '#2b6fb3']];
    for (const [v, name, col] of defs) {
      const geo = new BufferGeometry();
      geo.setAttribute('position', new Float32BufferAttribute([0, 0, 0, ...v], 3));
      this.axes.add(new LineSegments(geo, new LineBasicMaterial({ color: col })));
      const s = label(name, col);
      s.position.set(v[0] * 1.04, v[1] * 1.04, v[2] * 1.04);
      s.scale.setScalar(size * 0.06);
      this.axes.add(s);
    }
  }

  private rebuildLines() {
    for (const l of this.lines.children.slice()) {
      this.lines.remove(l);
      (l as LineSegments2).geometry.dispose();
    }
    this.lineMats.forEach(m => m.dispose());
    this.lineMats = [];
    const byKey = new Map<number, { pos: number[]; col: number[] }>();
    const tmp = new Color();
    for (const s of this.draw.segments) {
      let g = byKey.get(s.width);
      if (!g) byKey.set(s.width, g = { pos: [], col: [] });
      tmp.set(s.color);
      g.pos.push(...s.from, ...s.to);
      g.col.push(tmp.r, tmp.g, tmp.b, tmp.r, tmp.g, tmp.b);
    }
    for (const [width, g] of byKey) {
      const geo = new LineSegmentsGeometry();
      geo.setPositions(g.pos);
      geo.setColors(g.col);
      const mat = new LineMaterial({ linewidth: width * 0.9 + 0.6, vertexColors: true });
      mat.resolution.set(this.w, this.hgt);
      this.lineMats.push(mat);
      this.lines.add(new LineSegments2(geo, mat));
    }
  }

  private rebuildGhost() {
    if (this.ghostLines) {
      this.scene.remove(this.ghostLines);
      this.ghostLines.geometry.dispose();
      this.ghostLines = null;
    }
    if (!this.draw.ghost || !this.draw.ghost.length) return;
    const pos: number[] = [];
    for (const s of this.draw.ghost) pos.push(...s.from, ...s.to);
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
    this.ghostLines = new LineSegments(geo, new LineBasicMaterial({ color: new Color(cssVar('--ghost-3d') || '#888'), transparent: true, opacity: 0.8 }));
    this.scene.add(this.ghostLines);
  }

  invalidate() {
    if (this.pending) return;
    this.pending = true;
    requestAnimationFrame(() => {
      this.pending = false;
      this.paint();
      const w = this.waiters; this.waiters = [];
      w.forEach(f => f());
    });
  }

  settled(): Promise<void> {
    return new Promise(res => { this.waiters.push(res); this.invalidate(); });
  }

  /** Wywoływane po zmianie motywu. */
  refreshTheme() {
    this.gridSize = 0;
    this.ensureGrid(this.extent(this.draw.segments).radius, this.controls.target);
    this.invalidate();
  }

  private paint() {
    if (this.draw.version !== this.builtVersion) {
      this.rebuildLines();
      this.builtVersion = this.draw.version;
    }
    if (this.draw.ghostVersion !== this.builtGhost) {
      this.rebuildGhost();
      this.builtGhost = this.draw.ghostVersion;
    }
    this.scene.background = new Color(cssVar('--paper') || '#fbf8f1');
    const d = this.draw;
    this.turtle.visible = d.showTurtle;
    this.turtle.position.set(...d.pos);
    const m = new Matrix4().makeBasis(new Vector3(...d.r), new Vector3(...d.h), new Vector3(...d.u));
    this.turtle.setRotationFromMatrix(m);
    const dist = this.camera.position.distanceTo(this.turtle.position);
    this.turtle.scale.setScalar(Math.max(dist * 0.03, 0.5));
    this.renderer.render(this.scene, this.camera);
  }

  async toBlob(): Promise<Blob | null> {
    this.paint();
    return new Promise(res => this.canvas.toBlob(res, 'image/png'));
  }
}
