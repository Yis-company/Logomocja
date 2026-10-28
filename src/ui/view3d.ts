import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Segment, Turtle } from '../lang';
import { themeColors, type ThemeColors } from './paint';
import type { DrawingState } from './view2d';

const DEFAULT_DIR = new THREE.Vector3(0.45, -0.78, 0.5).normalize();
const DEFAULT_DISTANCE = 520;

/** Widok przestrzenny: kamera orbitująca wokół rysunku, siatka podłoża i osie. */
export class View3D {
  readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly drawing = new THREE.Group();
  private readonly ghostGroup = new THREE.Group();
  private readonly turtle: THREE.Group;
  private readonly materials: LineMaterial[] = [];
  private grid: THREE.Group = new THREE.Group();
  private state: DrawingState = { segments: [], turtle: null };
  private shownSegments: Segment[] | null = null;
  private shownCount = -1;
  private shownGhost: Segment[] | null | undefined = undefined;
  private dirty = true;
  private width = 1;
  private height = 1;
  autoFit = true;
  private colors: ThemeColors = themeColors();
  private disposed = false;
  onUserMove: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.5, 20000);
    this.camera.up.set(0, 0, 1);
    this.camera.position.copy(DEFAULT_DIR).multiplyScalar(DEFAULT_DISTANCE);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.12;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 12000;
    this.controls.addEventListener('change', () => (this.dirty = true));
    this.controls.addEventListener('start', () => this.userMoved());

    this.scene.add(this.grid, this.ghostGroup, this.drawing);
    this.turtle = this.buildTurtle();
    this.scene.add(this.turtle);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(200, -300, 500);
    this.scene.add(sun);

    this.applyTheme();
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(canvas);
    this.resize();
    this.bindKeys();

    const loop = () => {
      if (this.disposed) return;
      const moved = this.controls.update();
      if (moved || this.dirty) this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  refreshTheme(): void {
    this.colors = themeColors();
    this.applyTheme();
  }

  private applyTheme(): void {
    const c = this.colors;
    this.scene.background = new THREE.Color(c.stage);
    this.scene.remove(this.grid);
    this.grid = this.buildGrid(c);
    this.scene.add(this.grid);
    this.shownGhost = undefined; // kolor wzorca zależy od motywu
    this.dirty = true;
  }

  private buildGrid(c: ThemeColors): THREE.Group {
    const g = new THREE.Group();
    const grid = new THREE.GridHelper(1000, 20, c.dark ? 0x3b4b4d : 0xcfc5b2, c.dark ? 0x253234 : 0xe3dccd);
    grid.rotation.x = Math.PI / 2; // płaszczyzna XY
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.9;
    g.add(grid);
    const axes: [THREE.Vector3, number, string][] = [
      [new THREE.Vector3(1, 0, 0), 0xd0504a, 'x'],
      [new THREE.Vector3(0, 1, 0), 0x3a9a5b, 'y'],
      [new THREE.Vector3(0, 0, 1), 0x3d7fd0, 'z'],
    ];
    for (const [dir, color, label] of axes) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), dir.clone().multiplyScalar(160)]);
      g.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color })));
      const neg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), dir.clone().multiplyScalar(-160)]);
      g.add(new THREE.Line(neg, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 })));
      g.add(this.label(label, color, dir.clone().multiplyScalar(175)));
    }
    return g;
  }

  private label(text: string, color: number, pos: THREE.Vector3): THREE.Sprite {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const ctx = cv.getContext('2d')!;
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    ctx.fillText(text, 32, 34);
    const tex = new THREE.CanvasTexture(cv);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
    sprite.position.copy(pos);
    sprite.scale.setScalar(22);
    return sprite;
  }

  private buildTurtle(): THREE.Group {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      new THREE.MeshStandardMaterial({ color: 0x2f8f4e, roughness: 0.6 }),
    );
    shell.scale.set(0.8, 1, 0.45);
    g.add(shell);
    const skin = new THREE.MeshStandardMaterial({ color: 0x9bc77a, roughness: 0.7 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 12), skin);
    head.position.set(0, 1.25, 0.05);
    g.add(head);
    // nos (stożek) pokazuje kierunek
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0xc1763d }));
    nose.position.set(0, 1.75, 0.05);
    g.add(nose);
    // płetwa grzbietowa pokazuje „górę” żółwia (przechył)
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.5), new THREE.MeshStandardMaterial({ color: 0xc1763d }));
    fin.position.set(0, -0.1, 0.55);
    g.add(fin);
    for (const [x, y] of [
      [-0.8, 0.6],
      [0.8, 0.6],
      [-0.8, -0.6],
      [0.8, -0.6],
    ]) {
      const leg = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), skin);
      leg.position.set(x, y, -0.1);
      leg.scale.set(1, 1.3, 0.6);
      g.add(leg);
    }
    g.visible = false;
    return g;
  }

  setState(state: DrawingState): void {
    this.state = state;
    if (state.segments !== this.shownSegments || state.segments.length !== this.shownCount) this.rebuildDrawing();
    if (state.ghost !== this.shownGhost) this.rebuildGhost();
    this.updateTurtle(state.turtle);
    if (this.autoFit && !this.contentVisible()) this.fit(false, true);
    this.dirty = true;
  }

  private material(width: number, opts: { color?: THREE.Color; opacity?: number } = {}): LineMaterial {
    const m = new LineMaterial({
      linewidth: width,
      vertexColors: !opts.color,
      color: opts.color ?? 0xffffff,
      transparent: opts.opacity !== undefined,
      opacity: opts.opacity ?? 1,
      worldUnits: false,
    });
    m.resolution.set(this.width, this.height);
    this.materials.push(m);
    return m;
  }

  private buildLines(target: THREE.Group, segs: Segment[], ghost: boolean): void {
    for (const child of target.children) {
      const l = child as LineSegments2;
      l.geometry.dispose();
      const m = l.material as LineMaterial;
      m.dispose();
      const i = this.materials.indexOf(m);
      if (i >= 0) this.materials.splice(i, 1);
    }
    target.clear();
    if (!segs.length) return;
    const byWidth = new Map<number, Segment[]>();
    for (const s of segs) {
      const w = ghost ? 9 : s.width;
      let list = byWidth.get(w);
      if (!list) byWidth.set(w, (list = []));
      list.push(s);
    }
    const ghostColor = new THREE.Color().setStyle(this.colors.dark ? '#7a5a3e' : '#e9c9ab');
    for (const [w, list] of byWidth) {
      const pos = new Float32Array(list.length * 6);
      const col = new Float32Array(list.length * 6);
      const c = new THREE.Color();
      list.forEach((s, i) => {
        pos.set(s.from, i * 6);
        pos.set(s.to, i * 6 + 3);
        c.setStyle(s.color, THREE.SRGBColorSpace);
        col.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
      });
      const geo = new LineSegmentsGeometry();
      geo.setPositions(pos);
      if (!ghost) geo.setColors(col);
      const line = new LineSegments2(geo, ghost ? this.material(w, { color: ghostColor, opacity: 0.55 }) : this.material(w));
      if (ghost) line.renderOrder = -1;
      target.add(line);
    }
  }

  private rebuildDrawing(): void {
    this.shownSegments = this.state.segments;
    this.shownCount = this.state.segments.length;
    this.buildLines(this.drawing, this.state.segments, false);
  }

  private rebuildGhost(): void {
    this.shownGhost = this.state.ghost;
    this.buildLines(this.ghostGroup, this.state.ghost ?? [], true);
  }

  private updateTurtle(t: Turtle | null): void {
    this.turtle.visible = !!t;
    if (!t) return;
    const m = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(...t.right),
      new THREE.Vector3(...t.heading),
      new THREE.Vector3(...t.up),
    );
    this.turtle.quaternion.setFromRotationMatrix(m);
    this.turtle.position.set(...t.pos);
    this.scaleTurtle();
  }

  private scaleTurtle(): void {
    const d = this.camera.position.distanceTo(this.turtle.position);
    this.turtle.scale.setScalar(Math.max(0.5, d * 0.018));
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    for (const m of this.materials) m.resolution.set(this.width, this.height);
    if (this.autoFit) this.fit(false);
    this.dirty = true;
  }

  private render(): void {
    this.dirty = false;
    this.scaleTurtle();
    this.renderer.render(this.scene, this.camera);
  }

  /** Kula opisana na rysunku (i żółwiu). */
  private bounds(): THREE.Sphere | null {
    const box = new THREE.Box3();
    let any = false;
    const add = (p: readonly number[]) => {
      box.expandByPoint(new THREE.Vector3(p[0], p[1], p[2]));
      any = true;
    };
    for (const s of this.state.segments) {
      add(s.from);
      add(s.to);
    }
    for (const s of this.state.ghost ?? []) {
      add(s.from);
      add(s.to);
    }
    if (this.state.turtle) add(this.state.turtle.pos);
    if (!any) return null;
    add([0, 0, 0]); // początek układu zawsze w kadrze
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    sphere.radius = Math.max(sphere.radius, 30);
    return sphere;
  }

  private contentVisible(): boolean {
    const s = this.bounds();
    if (!s) return true;
    this.camera.updateMatrixWorld();
    const frustum = new THREE.Frustum().setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse),
    );
    // cała kula w kadrze?
    return frustum.planes.every((p) => p.distanceToPoint(s.center) >= s.radius * 0.9);
  }

  fit(markAuto = true, onlyOut = false): void {
    if (markAuto) this.autoFit = true;
    const s = this.bounds();
    const dir = this.camera.position.clone().sub(this.controls.target).normalize();
    if (!Number.isFinite(dir.x) || dir.lengthSq() === 0) dir.copy(DEFAULT_DIR);
    if (!s) {
      this.controls.target.set(0, 0, 0);
      this.camera.position.copy(dir.multiplyScalar(DEFAULT_DISTANCE));
    } else {
      const vFov = (this.camera.fov * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
      let dist = (s.radius * 1.15) / Math.sin(Math.min(vFov, hFov) / 2);
      if (onlyOut) dist = Math.max(dist, this.camera.position.distanceTo(this.controls.target));
      this.controls.target.copy(s.center);
      this.camera.position.copy(s.center).add(dir.multiplyScalar(dist));
    }
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.dirty = true;
  }

  resetCamera(): void {
    this.controls.target.set(0, 0, 0);
    this.camera.position.copy(DEFAULT_DIR).multiplyScalar(DEFAULT_DISTANCE);
    this.fit();
  }

  /** Obrót kamery wokół celu (stopnie): w poziomie i w pionie. */
  orbit(dAz: number, dEl: number): void {
    const target = this.controls.target;
    const off = this.camera.position.clone().sub(target);
    const r = off.length();
    let az = Math.atan2(off.y, off.x);
    let el = Math.asin(Math.max(-1, Math.min(1, off.z / r)));
    az += (dAz * Math.PI) / 180;
    el = Math.max(-1.5, Math.min(1.5, el + (dEl * Math.PI) / 180));
    off.set(Math.cos(el) * Math.cos(az) * r, Math.cos(el) * Math.sin(az) * r, Math.sin(el) * r);
    this.camera.position.copy(target).add(off);
    this.camera.lookAt(target);
    this.userMoved();
  }

  zoomBy(factor: number): void {
    const target = this.controls.target;
    const off = this.camera.position.clone().sub(target).divideScalar(factor);
    const len = Math.min(this.controls.maxDistance, Math.max(this.controls.minDistance, off.length()));
    this.camera.position.copy(target).add(off.setLength(len));
    this.userMoved();
  }

  panBy(dx: number, dy: number): void {
    const dist = this.camera.position.distanceTo(this.controls.target);
    const k = (2 * dist * Math.tan((this.camera.fov * Math.PI) / 360)) / this.height;
    const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 0).multiplyScalar(-dx * k);
    const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 1).multiplyScalar(dy * k);
    const delta = right.add(up);
    this.camera.position.add(delta);
    this.controls.target.add(delta);
    this.userMoved();
  }

  private userMoved(): void {
    this.autoFit = false;
    this.controls.update();
    this.dirty = true;
    this.onUserMove?.();
  }

  private bindKeys(): void {
    this.canvas.addEventListener('keydown', (e) => {
      let handled = true;
      const pan = e.shiftKey;
      switch (e.key) {
        case 'ArrowLeft':
          if (pan) this.panBy(40, 0);
          else this.orbit(-10, 0);
          break;
        case 'ArrowRight':
          if (pan) this.panBy(-40, 0);
          else this.orbit(10, 0);
          break;
        case 'ArrowUp':
          if (pan) this.panBy(0, 40);
          else this.orbit(0, 8);
          break;
        case 'ArrowDown':
          if (pan) this.panBy(0, -40);
          else this.orbit(0, -8);
          break;
        case '+':
        case '=':
          this.zoomBy(1.25);
          break;
        case '-':
        case '_':
          this.zoomBy(0.8);
          break;
        case '0':
          this.fit();
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    });
  }

  /** PNG z bieżącego ujęcia kamery (bez żółwia). */
  exportPng(): Promise<Blob> {
    const visible = this.turtle.visible;
    this.turtle.visible = false;
    this.renderer.render(this.scene, this.camera);
    const url = this.canvas.toDataURL('image/png');
    this.turtle.visible = visible;
    this.dirty = true;
    const bytes = atob(url.slice(url.indexOf(',') + 1));
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return Promise.resolve(new Blob([arr], { type: 'image/png' }));
  }

  /** Czeka, aż bieżący stan zostanie narysowany. */
  renderNow(): void {
    this.controls.update();
    this.render();
  }
}
