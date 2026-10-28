import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Segment } from '../lang';
import type { Vec3 } from '../lang/geometry';
import { h, nextPaint } from './dom';
import { EMPTY_FRAME, readPalette, type Palette, type SceneFrame } from './paint';
import type { StageView } from './view2d';

const DEFAULT_DIR = new THREE.Vector3(0.48, -0.78, 0.55).normalize();

export class View3D implements StageView {
  readonly element: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly drawing = new THREE.Group();
  private readonly partialGroup = new THREE.Group();
  private readonly ghostGroup = new THREE.Group();
  private readonly helpers = new THREE.Group();
  private readonly turtle: THREE.Group;
  private turtleBody!: THREE.Mesh;
  private frame: SceneFrame = EMPTY_FRAME;
  private builtSegments: readonly Segment[] | null = null;
  private builtCount = -1;
  private builtGhost: readonly Segment[] | null = null;
  /**
   * Materiały linii są współdzielone i nie są niszczone między klatkami –
   * inaczej three.js kompilowałby shader od nowa przy każdym nowym odcinku.
   */
  private readonly materials = new Map<string, LineMaterial>();
  private palette: Palette;
  private autoFit = true;
  private pending = false;
  private visible = true;
  private gridSize = 0;
  private width = 300;
  private height = 300;

  constructor(label: string, private readonly onLost: () => void) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const canvas = this.renderer.domElement;
    canvas.classList.add('stage-canvas');
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', label);
    canvas.setAttribute('aria-roledescription', 'rysunek przestrzenny');
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.onLost();
    });
    this.element = h('div', { class: 'stage-view stage-3d' }, canvas);

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.5, 20000);
    this.camera.up.set(0, 0, 1);
    this.camera.position.copy(DEFAULT_DIR).multiplyScalar(520);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(0, 40, 30);
    this.controls.screenSpacePanning = true;
    this.controls.zoomToCursor = true;
    this.controls.addEventListener('change', () => this.schedule());
    this.controls.addEventListener('start', () => canvas.focus({ preventScroll: true }));
    canvas.addEventListener('wheel', () => { this.autoFit = false; }, { passive: true });
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button === 2 || e.shiftKey || e.ctrlKey || e.metaKey || e.pointerType === 'touch') this.autoFit = false;
    });

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x667766, 2.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(0.6, -0.4, 1);
    this.scene.add(sun);
    this.scene.add(this.helpers, this.ghostGroup, this.drawing, this.partialGroup);
    this.turtle = this.makeTurtle();
    this.scene.add(this.turtle);

    this.palette = readPalette();
    this.applyPalette();
    this.buildHelpers(400);
    this.camera.lookAt(this.controls.target);
    this.controls.update();

    new ResizeObserver(() => this.resize()).observe(this.element);
    this.bindKeys(canvas);
  }

  setFrame(frame: SceneFrame): void {
    this.frame = frame;
    this.schedule();
  }

  prepare(segments: readonly Segment[], points: Vec3[]): void {
    if (!this.autoFit) return;
    this.fitTo(segments, points, false);
  }

  fit(): void {
    this.autoFit = true;
    const f = this.frame;
    const segs = [...f.segments, ...(f.partial ? [f.partial] : []), ...(f.ghost ?? [])];
    this.fitTo(segs, f.turtle ? [f.turtle.pos] : [], false);
  }

  resetView(): void {
    this.autoFit = true;
    const f = this.frame;
    const segs = [...f.segments, ...(f.ghost ?? [])];
    this.fitTo(segs, f.turtle ? [f.turtle.pos] : [], true);
  }

  zoom(factor: number): void {
    this.autoFit = false;
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.multiplyScalar(1 / factor);
    this.camera.position.copy(this.controls.target).add(offset);
    this.controls.update();
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.element.hidden = !visible;
    if (visible) this.resize();
  }

  refreshTheme(): void {
    this.palette = readPalette();
    this.applyPalette();
    this.materials.get('g5')?.color.set(this.palette.text);
    this.buildHelpers(this.gridSize, true);
    this.schedule();
  }

  async painted(): Promise<void> {
    this.render();
    await nextPaint();
  }

  async exportPng(): Promise<Blob | null> {
    const prevRatio = this.renderer.getPixelRatio();
    const turtleVisible = this.turtle.visible;
    this.turtle.visible = false;
    this.ghostGroup.visible = false;
    this.renderer.setPixelRatio(Math.max(2, prevRatio));
    this.renderer.setSize(this.width, this.height, false);
    this.updateResolution();
    this.render();
    const blob = await new Promise<Blob | null>((resolve) => this.renderer.domElement.toBlob(resolve, 'image/png'));
    this.renderer.setPixelRatio(prevRatio);
    this.renderer.setSize(this.width, this.height, false);
    this.turtle.visible = turtleVisible;
    this.ghostGroup.visible = true;
    this.updateResolution();
    this.render();
    return blob;
  }

  private fitTo(segments: readonly Segment[], points: Vec3[], resetDirection: boolean): void {
    const box = new THREE.Box3();
    const v = new THREE.Vector3();
    for (const s of segments) {
      box.expandByPoint(v.set(...s.from));
      box.expandByPoint(v.set(...s.to));
    }
    for (const p of points) box.expandByPoint(v.set(...p));
    if (box.isEmpty()) box.set(new THREE.Vector3(-100, -20, 0), new THREE.Vector3(100, 140, 80));
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const radius = Math.max(sphere.radius, 20);
    const fov = (this.camera.fov * Math.PI) / 180;
    const fitH = radius / Math.sin(fov / 2);
    const fitW = radius / Math.sin(Math.atan(Math.tan(fov / 2) * this.camera.aspect));
    const dist = Math.max(fitH, fitW) * 1.08;
    const dir = resetDirection
      ? DEFAULT_DIR.clone()
      : this.camera.position.clone().sub(this.controls.target).normalize();
    this.controls.target.copy(sphere.center);
    this.camera.position.copy(sphere.center).addScaledVector(dir, dist);
    this.camera.near = Math.max(0.1, dist / 500);
    this.camera.far = dist * 50 + radius * 10;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    const extent = Math.max(Math.abs(box.min.x), Math.abs(box.max.x), Math.abs(box.min.y), Math.abs(box.max.y), radius);
    this.buildHelpers(extent * 2.4);
    this.schedule();
  }

  private applyPalette(): void {
    this.scene.background = new THREE.Color(this.palette.bg);
  }

  private buildHelpers(size: number, force = false): void {
    const step = niceStep(size / 16);
    const total = Math.max(step * 8, Math.ceil(size / step / 2) * step * 2);
    if (!force && Math.abs(total - this.gridSize) < 1e-9) return;
    this.gridSize = total;
    for (const child of [...this.helpers.children]) {
      this.helpers.remove(child);
      disposeObject(child);
    }
    const divisions = Math.round(total / step);
    const grid = new THREE.GridHelper(total, divisions, this.palette.gridStrong, this.palette.grid);
    grid.rotation.x = Math.PI / 2;
    this.helpers.add(grid);
    const L = Math.max(step * 2, total * 0.18);
    const axis = (to: THREE.Vector3, color: string, label: string) => {
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), to]);
      const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color }));
      this.helpers.add(line);
      const sprite = makeLabel(label, color);
      sprite.position.copy(to).multiplyScalar(1.08);
      this.helpers.add(sprite);
    };
    axis(new THREE.Vector3(L, 0, 0), this.palette.axisX, 'X');
    axis(new THREE.Vector3(0, L, 0), this.palette.axisY, 'Y');
    axis(new THREE.Vector3(0, 0, L), this.palette.axisZ, 'Z');
    const origin = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 8),
      new THREE.MeshBasicMaterial({ color: this.palette.text }),
    );
    origin.scale.setScalar(Math.max(1, step / 30));
    this.helpers.add(origin);
  }

  private makeTurtle(): THREE.Group {
    const g = new THREE.Group();
    // Grot: nos wzdłuż +Y, płetwa wzdłuż +Z (góra żółwia), boki wzdłuż ±X.
    const T = [0, 12, 0], L = [-7, -6, 0], R = [7, -6, 0], U = [0, -4, 5.5], B = [0, -3.5, -2];
    const faces = [T, U, L, T, R, U, T, L, B, T, B, R, L, U, R, L, R, B];
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(faces.flat(), 3));
    geom.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color: 0x16866a, flatShading: true, roughness: 0.6, metalness: 0.05, transparent: true });
    this.turtleBody = new THREE.Mesh(geom, mat);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({ color: 0x1d2b28 }),
    );
    g.add(this.turtleBody, edges);
    g.matrixAutoUpdate = false;
    g.visible = false;
    return g;
  }

  private updateTurtle(): void {
    const t = this.frame.turtle;
    if (!t) { this.turtle.visible = false; return; }
    this.turtle.visible = true;
    const dist = this.camera.position.distanceTo(this.controls.target);
    const s = Math.max(0.05, dist / 420);
    const m = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(...t.r), new THREE.Vector3(...t.h), new THREE.Vector3(...t.u),
    );
    m.scale(new THREE.Vector3(s, s, s));
    m.setPosition(t.pos[0], t.pos[1], t.pos[2]);
    this.turtle.matrix.copy(m);
    this.turtle.matrixWorldNeedsUpdate = true;
    const mat = this.turtleBody.material as THREE.MeshStandardMaterial;
    mat.color.set(t.color);
    mat.opacity = t.pen ? 0.95 : 0.35;
    const edges = this.turtle.children[1] as THREE.LineSegments;
    (edges.material as THREE.LineBasicMaterial).color.set(this.palette.turtle);
  }

  private rebuildDrawing(): void {
    const f = this.frame;
    if (f.segments !== this.builtSegments || f.segments.length !== this.builtCount) {
      this.builtSegments = f.segments;
      this.builtCount = f.segments.length;
      this.replaceLines(this.drawing, f.segments);
    }
    this.replaceLines(this.partialGroup, f.partial ? [f.partial] : []);
    if (f.ghost !== this.builtGhost) {
      this.builtGhost = f.ghost;
      this.replaceLines(this.ghostGroup, f.ghost ?? [], true);
    }
  }

  private replaceLines(group: THREE.Group, segments: readonly Segment[], ghost = false): void {
    for (const child of [...group.children]) {
      group.remove(child);
      (child as LineSegments2).geometry.dispose();
    }
    if (!segments.length) return;
    const byWidth = new Map<number, Segment[]>();
    for (const s of segments) {
      const w = ghost ? 5 : s.width;
      let list = byWidth.get(w);
      if (!list) byWidth.set(w, (list = []));
      list.push(s);
    }
    const color = new THREE.Color();
    for (const [width, list] of byWidth) {
      const pos = new Float32Array(list.length * 6);
      const col = new Float32Array(list.length * 6);
      list.forEach((s, k) => {
        pos.set(s.from, k * 6);
        pos.set(s.to, k * 6 + 3);
        color.set(s.color);
        col[k * 6] = col[k * 6 + 3] = color.r;
        col[k * 6 + 1] = col[k * 6 + 4] = color.g;
        col[k * 6 + 2] = col[k * 6 + 5] = color.b;
      });
      const geom = new LineSegmentsGeometry();
      geom.setPositions(pos);
      const mat = this.material(width, ghost);
      if (!ghost) geom.setColors(col);
      const line = new LineSegments2(geom, mat);
      if (ghost) line.computeLineDistances();
      group.add(line);
    }
  }

  private material(width: number, ghost: boolean): LineMaterial {
    const key = `${ghost ? 'g' : 'n'}${width}`;
    let mat = this.materials.get(key);
    if (!mat) {
      mat = ghost
        ? new LineMaterial({ color: new THREE.Color(this.palette.text), linewidth: width, dashed: true, dashSize: 6, gapSize: 6, transparent: true, opacity: 0.55, depthWrite: false })
        : new LineMaterial({ vertexColors: true, linewidth: width });
      const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
      const ratio = this.renderer.getPixelRatio();
      mat.resolution.set(size.x / ratio, size.y / ratio);
      this.materials.set(key, mat);
    }
    return mat;
  }

  private updateResolution(): void {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const ratio = this.renderer.getPixelRatio();
    for (const m of this.materials.values()) m.resolution.set(size.x / ratio, size.y / ratio);
  }

  private resize(): void {
    const r = this.element.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    this.width = r.width;
    this.height = r.height;
    this.renderer.setSize(r.width, r.height, false);
    this.camera.aspect = r.width / r.height;
    this.camera.updateProjectionMatrix();
    this.updateResolution();
    this.render();
  }

  private schedule(): void {
    if (this.pending || !this.visible) return;
    this.pending = true;
    requestAnimationFrame(() => {
      this.pending = false;
      this.render();
    });
  }

  private render(): void {
    this.rebuildDrawing();
    this.updateTurtle();
    this.renderer.render(this.scene, this.camera);
  }

  private bindKeys(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = this.controls.target;
      const offset = this.camera.position.clone().sub(target);
      const sph = new THREE.Spherical();
      // Sferyczne współrzędne liczone względem osi Z (góra).
      const toYUp = (v: THREE.Vector3) => new THREE.Vector3(v.x, v.z, -v.y);
      const fromYUp = (v: THREE.Vector3) => new THREE.Vector3(v.x, -v.z, v.y);
      sph.setFromVector3(toYUp(offset));
      const rot = Math.PI / 18;
      const panStep = offset.length() * 0.06;
      const pan = (dx: number, dy: number) => {
        this.autoFit = false;
        const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 0);
        const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 1);
        const delta = right.multiplyScalar(dx * panStep).add(up.multiplyScalar(dy * panStep));
        target.add(delta);
        this.camera.position.add(delta);
        this.controls.update();
      };
      switch (e.key) {
        case 'ArrowLeft': if (e.shiftKey) pan(-1, 0); else sph.theta -= rot; break;
        case 'ArrowRight': if (e.shiftKey) pan(1, 0); else sph.theta += rot; break;
        case 'ArrowUp': if (e.shiftKey) pan(0, 1); else sph.phi = Math.max(0.05, sph.phi - rot); break;
        case 'ArrowDown': if (e.shiftKey) pan(0, -1); else sph.phi = Math.min(Math.PI - 0.05, sph.phi + rot); break;
        case '+': case '=': this.zoom(1.25); e.preventDefault(); return;
        case '-': case '_': this.zoom(0.8); e.preventDefault(); return;
        case '0': case 'f': case 'F': this.fit(); e.preventDefault(); return;
        case 'r': case 'R': this.resetView(); e.preventDefault(); return;
        default: return;
      }
      e.preventDefault();
      if (!e.shiftKey) {
        this.camera.position.copy(target).add(fromYUp(new THREE.Vector3().setFromSpherical(sph)));
        this.controls.update();
      }
    });
  }
}

function niceStep(raw: number): number {
  const exp = Math.floor(Math.log10(Math.max(raw, 1e-6)));
  const base = 10 ** exp;
  for (const n of [1, 2, 5, 10]) if (n * base >= raw) return n * base;
  return 10 * base;
}

function makeLabel(text: string, color: string): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.font = '700 40px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, 32, 34);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, sizeAttenuation: false, depthTest: false }));
  sprite.scale.set(0.045, 0.045, 1);
  return sprite;
}

function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((o) => {
    const any = o as THREE.Mesh;
    any.geometry?.dispose?.();
    const m = any.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(m)) m.forEach((x) => x.dispose());
    else if (m) {
      (m as THREE.SpriteMaterial).map?.dispose?.();
      m.dispose();
    }
  });
}

