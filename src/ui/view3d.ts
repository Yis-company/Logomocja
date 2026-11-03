// The 3D view: orbit camera, ground grid on the XY plane, axes, fat lines and an oriented turtle.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Segment } from '../lang/interp';
import type { TurtlePose, Palette } from './view2d';
import { readPalette } from './view2d';

export class View3D {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.5, 20000);
  controls: OrbitControls;
  private lines = new THREE.Group();
  private grid = new THREE.Group();
  private turtle: THREE.Group;
  private turtleMat: THREE.MeshBasicMaterial;
  private finMat!: THREE.MeshBasicMaterial;
  private materials = new Map<number, LineMaterial>();
  private segCount = -1;
  private segRef: Segment[] | null = null;
  private raf = 0;
  private pal!: Palette;
  private extent = 0;
  segments: Segment[] = [];
  pose: TurtlePose | null = null;
  touched = false;
  onChange: () => void = () => {};

  constructor(private host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const el = this.renderer.domElement;
    el.className = 'sheet-canvas';
    el.tabIndex = 0;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Rysunek 3D. Przeciągnij, aby obracać; prawy przycisk lub Shift przesuwa; kółko przybliża. Strzałki obracają widok, plus i minus przybliżają.');
    host.appendChild(el);
    this.camera.up.set(0, 0, 1);
    this.controls = new OrbitControls(this.camera, el);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.12;
    this.controls.screenSpacePanning = true;
    this.controls.addEventListener('change', () => { this.request(); });
    this.controls.addEventListener('start', () => { this.touched = true; });
    el.addEventListener('keydown', (e) => this.key(e));
    this.scene.add(this.grid, this.lines);
    this.turtleMat = new THREE.MeshBasicMaterial({ color: 0x6a3fb5 });
    this.turtle = this.makeTurtle();
    this.scene.add(this.turtle);
    new ResizeObserver(() => this.resize()).observe(host);
    this.resize();
    this.refreshPalette();
    this.resetCamera();
  }

  private key(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) return;
    const t = this.controls.target;
    const off = this.camera.position.clone().sub(t);
    const rot = (axis: THREE.Vector3, a: number) => { off.applyAxisAngle(axis, a); this.camera.position.copy(t).add(off); };
    const right = new THREE.Vector3().crossVectors(off, this.camera.up).normalize();
    const map: Record<string, () => void> = {
      ArrowLeft: () => rot(new THREE.Vector3(0, 0, 1), -0.12),
      ArrowRight: () => rot(new THREE.Vector3(0, 0, 1), 0.12),
      ArrowUp: () => rot(right, -0.1),
      ArrowDown: () => rot(right, 0.1),
      '+': () => { off.multiplyScalar(0.8); this.camera.position.copy(t).add(off); },
      '=': () => { off.multiplyScalar(0.8); this.camera.position.copy(t).add(off); },
      '-': () => { off.multiplyScalar(1.25); this.camera.position.copy(t).add(off); },
      '0': () => this.fit(),
    };
    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
      this.touched = true;
      this.camera.lookAt(t);
      this.controls.update();
      this.request();
    }
  }

  zoom(k: number) {
    const t = this.controls.target;
    const off = this.camera.position.clone().sub(t).multiplyScalar(1 / k);
    this.camera.position.copy(t).add(off);
    this.touched = true;
    this.controls.update();
    this.request();
  }

  private makeTurtle() {
    // Local frame: x = right, y = heading, z = up.
    const g = new THREE.Group();
    const shape = new THREE.Shape();
    shape.moveTo(0, 9);
    shape.lineTo(6, -5);
    shape.lineTo(0, -2);
    shape.lineTo(-6, -5);
    shape.closePath();
    const body = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 1.6, bevelEnabled: false }), this.turtleMat);
    body.position.z = -0.8;
    // A fin standing on the up side, so roll is visible.
    const fin = new THREE.BufferGeometry();
    fin.setAttribute('position', new THREE.Float32BufferAttribute([0, -3, 0.8, 0, 4, 0.8, 0, -3, 6], 3));
    const finMesh = new THREE.Mesh(fin, new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    this.finMat = finMesh.material as THREE.MeshBasicMaterial;
    g.add(body, finMesh);
    this.turtleMat.side = THREE.DoubleSide;
    return g;
  }

  refreshPalette() {
    this.pal = readPalette(this.host);
    this.scene.background = new THREE.Color(this.pal.ground);
    this.turtleMat.color.set(this.pal.active);
    this.finMat.color.set(this.pal.ink);
    this.buildGrid();
    this.request();
  }

  private buildGrid() {
    this.grid.clear();
    const mk = (size: number, div: number, color: string) => {
      const { c, a } = parseColor(color);
      const g = new THREE.GridHelper(size, div, c, c);
      g.rotation.x = Math.PI / 2;
      const m = g.material as THREE.LineBasicMaterial;
      m.transparent = true;
      m.opacity = Math.min(1, a * 2.5);
      m.depthWrite = false;
      return g;
    };
    // Size the grid to the drawing: a 20-unit minor step, 100-unit major step, scaled up for big drawings.
    const step = this.extent > 1500 ? Math.pow(10, Math.ceil(Math.log10(this.extent / 75))) : 20;
    const half = Math.ceil(Math.max(300, this.extent * 1.6) / (step * 5)) * step * 5;
    this.grid.add(mk(half * 2, (half * 2) / step, this.pal.minor), mk(half * 2, (half * 2) / (step * 5), this.pal.major));
    const axes: [number[], number][] = [
      [[0, 0, 0, 160, 0, 0], 0xc0392b],
      [[0, 0, 0, 0, 160, 0], 0x16866a],
      [[0, 0, 0, 0, 0, 160], 0x2b6fb3],
    ];
    for (const [p, col] of axes) {
      const g = new LineSegmentsGeometry().setPositions(p);
      const m = new LineMaterial({ color: col, linewidth: 2, transparent: true, opacity: 0.9 });
      m.resolution.set(this.host.clientWidth || 1, this.host.clientHeight || 1);
      this.grid.add(new LineSegments2(g, m));
    }
    for (const [label, pos, col] of [['X', [172, 0, 0], '#c0392b'], ['Y', [0, 172, 0], '#16866a'], ['Z', [0, 0, 172], '#2b6fb3']] as const) {
      this.grid.add(textSprite(label, col, pos as unknown as [number, number, number]));
    }
  }

  resetCamera() {
    this.controls.target.set(0, 0, 0);
    this.camera.position.set(260, -380, 300);
    this.camera.lookAt(0, 0, 0);
    this.controls.update();
    this.touched = false;
    this.request();
  }

  fit() {
    this.resize();
    const box = new THREE.Box3();
    for (const s of this.segments) { box.expandByPoint(new THREE.Vector3(...s.from)); box.expandByPoint(new THREE.Vector3(...s.to)); }
    if (this.pose) box.expandByPoint(new THREE.Vector3(...this.pose.pos));
    if (box.isEmpty()) { this.resetCamera(); return; }
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const ext = Math.max(Math.abs(box.min.x), Math.abs(box.max.x), Math.abs(box.min.y), Math.abs(box.max.y));
    if (Math.abs(ext - this.extent) > this.extent * 0.25 + 50) { this.extent = ext; this.buildGrid(); }
    const r = Math.max(sphere.radius, 20);
    const dir = this.camera.position.clone().sub(this.controls.target).normalize();
    if (dir.lengthSq() < 0.5) dir.set(0.45, -0.66, 0.6).normalize();
    const fov = (this.camera.fov * Math.PI) / 180;
    const fovMin = Math.min(fov, 2 * Math.atan(Math.tan(fov / 2) * this.camera.aspect));
    const dist = (r / Math.sin(fovMin / 2)) * 1.3;
    this.controls.target.copy(sphere.center);
    this.camera.position.copy(sphere.center).add(dir.multiplyScalar(dist));
    this.camera.near = Math.max(0.1, dist / 200);
    this.camera.far = dist * 50 + 5000;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.touched = false;
    this.request();
  }

  fitIfNeeded() {
    if (!this.touched) this.fit();
  }

  private resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (w < 2 || h < 2) return;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = `${w}px`;
    this.renderer.domElement.style.height = `${h}px`;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    for (const m of this.materials.values()) m.resolution.set(w, h);
    this.grid.traverse((o) => { if (o instanceof LineSegments2) (o.material as LineMaterial).resolution.set(w, h); });
    this.request();
  }

  private material(width: number) {
    let m = this.materials.get(width);
    if (!m) {
      m = new LineMaterial({ linewidth: width, vertexColors: true, worldUnits: false });
      m.resolution.set(this.host.clientWidth || 1, this.host.clientHeight || 1);
      this.materials.set(width, m);
    }
    return m;
  }

  private rebuildLines() {
    if (this.segRef === this.segments && this.segCount === this.segments.length) return;
    // Append only the new segments when the list grew; rebuild otherwise.
    const appendFrom = this.segRef === this.segments && this.segCount >= 0 && this.segments.length > this.segCount ? this.segCount : 0;
    if (appendFrom === 0) {
      for (const c of this.lines.children) (c as LineSegments2).geometry.dispose();
      this.lines.clear();
    }
    const groups = new Map<number, { p: number[]; c: number[] }>();
    const col = new THREE.Color();
    for (let i = appendFrom; i < this.segments.length; i++) {
      const s = this.segments[i];
      let g = groups.get(s.width);
      if (!g) groups.set(s.width, (g = { p: [], c: [] }));
      g.p.push(...s.from, ...s.to);
      col.set(s.color);
      g.c.push(col.r, col.g, col.b, col.r, col.g, col.b);
    }
    for (const [w, g] of groups) {
      const geo = new LineSegmentsGeometry().setPositions(g.p);
      geo.setColors(g.c);
      this.lines.add(new LineSegments2(geo, this.material(w)));
    }
    this.segRef = this.segments;
    this.segCount = this.segments.length;
  }

  request() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.render();
      this.onChange();
    });
  }

  render() {
    this.rebuildLines();
    const p = this.pose;
    this.turtle.visible = !!p;
    if (p) {
      const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...p.r), new THREE.Vector3(...p.h), new THREE.Vector3(...p.u));
      this.turtle.quaternion.setFromRotationMatrix(m);
      this.turtle.position.set(...p.pos);
      const d = this.camera.position.distanceTo(this.turtle.position);
      this.turtle.scale.setScalar(Math.max(0.3, d / 420));
    }
    if (this.controls.update()) this.request();
    this.renderer.render(this.scene, this.camera);
  }

  toPNG(): Promise<Blob | null> {
    this.render();
    return new Promise((res) => this.renderer.domElement.toBlob(res, 'image/png'));
  }

  dispose() {
    this.renderer.dispose();
  }
}

function parseColor(css: string) {
  const m = /rgba?\(([^)]+)\)/.exec(css);
  if (m) {
    const [r, g, b, a = '1'] = m[1].split(/[ ,/]+/).filter(Boolean);
    return { c: new THREE.Color(`rgb(${r},${g},${b})`), a: parseFloat(a) };
  }
  return { c: new THREE.Color(css || '#888888'), a: 1 };
}

function textSprite(text: string, color: string, pos: [number, number, number]) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.font = '600 40px ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, 32, 34);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthWrite: false, transparent: true }));
  sp.position.set(...pos);
  sp.scale.set(18, 18, 1);
  return sp;
}

