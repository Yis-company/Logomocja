import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { type Segment, type Turtle, type Vec3 } from '../lang/index';
import { cssVar, download, el } from './dom';

/*
 * Logo space is right-handed with z up. three.js is y up, so a Logo point (x, y, z)
 * is placed at three.js (x, z, -y). This map is a proper rotation, so handedness is kept.
 */
function toScene(p: Vec3): THREE.Vector3 {
  return new THREE.Vector3(p[0], p[2], -p[1]);
}

function dirToScene(v: Vec3): THREE.Vector3 {
  return toScene(v);
}

function niceCeil(v: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1))));
  for (const m of [1, 2, 5, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

/** The space view: orbit, pan, zoom, reset, ground grid and axes, with the turtle drawn as a cone. */
export class View3D {
  readonly element: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly linesRoot = new THREE.Group();
  private readonly ghostRoot = new THREE.Group();
  private readonly axesRoot = new THREE.Group();
  private grid: THREE.GridHelper | null = null;
  private groundSize = 0;
  private readonly axisMaterials = ['#c1763d', '#16866a', '#2b6fb3'].map(
    (colour) => new LineMaterial({ color: new THREE.Color(colour).getHex(), linewidth: 2 }),
  );
  private readonly marker: THREE.Group;
  private readonly materials = new Map<number, LineMaterial>();
  private readonly ghostMaterial: LineMaterial;
  private readonly resizeObserver: ResizeObserver;
  private readonly themeListener = (): void => this.refreshColours();
  private version = -1;
  private segments: readonly Segment[] = [];
  private ghost: readonly Segment[] | null = null;
  private turtle: Turtle | null = null;
  private bounds = { min: [0, 0, 0] as Vec3, max: [0, 0, 0] as Vec3 };
  /** True until the user orbits, pans or zooms; while true the camera follows the drawing. */
  autoFit = true;
  private readonly onChange: () => void;

  constructor(container: HTMLElement, onChange: () => void = () => undefined) {
    this.onChange = onChange;
    const canvas = el('canvas', { class: 'stage-canvas', role: 'img', 'aria-label': 'Rysunek żółwia w przestrzeni 3D' });
    this.element = el('div', { class: 'view view-3d' }, canvas);
    container.append(this.element);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(new THREE.Color(cssVar('--canvas-bg') || '#ffffff'), 1);

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.5, 1e8);
    this.camera.up.set(0, 1, 0);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.screenSpacePanning = true;
    this.controls.addEventListener('start', () => {
      this.autoFit = false;
      this.onChange();
    });

    this.ghostMaterial = new LineMaterial({ color: new THREE.Color(cssVar('--ghost') || '#999999').getHex(), linewidth: 2, transparent: true, opacity: 0.45 });
    this.marker = this.buildMarker();
    this.scene.add(this.linesRoot, this.ghostRoot, this.axesRoot, this.marker);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.element);
    window.addEventListener('logomocja:theme', this.themeListener);
    this.resize();
    this.renderer.setAnimationLoop(() => {
      this.controls.update();
      this.updateMarkerScale();
      this.renderer.render(this.scene, this.camera);
    });
    this.resetCamera();
  }

  /** Draws the current state. `version` is the interpreter's version; lines are rebuilt only when it changes. */
  render(segments: readonly Segment[], turtle: Turtle | null, ghost: readonly Segment[] | null, version: number): void {
    this.turtle = turtle;
    const ghostChanged = ghost !== this.ghost;
    if (version !== this.version || segments !== this.segments) {
      this.version = version;
      this.segments = segments;
      this.rebuildLines();
    }
    if (ghostChanged) {
      this.ghost = ghost;
      this.rebuildGhost();
    }
    this.updateTurtle();
    if (this.autoFit) this.fit();
  }

  fit(): void {
    this.autoFit = true;
    this.computeBounds();
    const { min, max } = this.bounds;
    const center = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2] as Vec3;
    const radius = Math.max(20, Math.hypot(max[0] - min[0], max[1] - min[1], max[2] - min[2]) / 2);
    const distance = (radius / Math.sin((this.camera.fov * Math.PI) / 360)) * 1.15;
    this.placeCamera(center, distance, this.viewDirection());
  }

  /** Zooms in (factor above 1) or out (below 1); used by the keyboard-operable buttons. */
  zoomBy(factor: number): void {
    this.autoFit = false;
    if (factor >= 1) this.controls.dollyIn(factor);
    else this.controls.dollyOut(1 / factor);
    this.controls.update();
    this.onChange();
  }

  /** Orbits the camera by a number of degrees; used by the keyboard-operable buttons. */
  orbit(horizontalDegrees: number, verticalDegrees: number): void {
    this.autoFit = false;
    this.controls.rotateLeft(THREE.MathUtils.degToRad(horizontalDegrees));
    this.controls.rotateUp(THREE.MathUtils.degToRad(verticalDegrees));
    this.controls.update();
    this.onChange();
  }

  resetCamera(): void {
    this.autoFit = false;
    this.computeBounds();
    const { min, max } = this.bounds;
    const center = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2] as Vec3;
    const radius = Math.max(60, Math.hypot(max[0] - min[0], max[1] - min[1], max[2] - min[2]) / 2);
    this.placeCamera(center, radius * 3, this.viewDirection());
    this.autoFit = true;
  }

  exportPng(filename: string): void {
    // Render and read in the same task: the drawing buffer is cleared after compositing.
    this.renderer.render(this.scene, this.camera);
    this.renderer.domElement.toBlob((blob) => {
      if (blob) download(filename, blob, 'image/png');
    }, 'image/png');
  }

  dispose(): void {
    this.renderer.setAnimationLoop(null);
    this.controls.dispose();
    this.resizeObserver.disconnect();
    window.removeEventListener('logomocja:theme', this.themeListener);
    for (const m of this.materials.values()) m.dispose();
    for (const m of this.axisMaterials) m.dispose();
    this.ghostMaterial.dispose();
    this.renderer.dispose();
    this.element.remove();
  }

  // ---- camera ----

  /** Looks from front, right and above, so the turtle's starting direction is easy to read. */
  private viewDirection(): THREE.Vector3 {
    return dirToScene([0.55, -0.85, 0.65]).normalize();
  }

  private placeCamera(center: Vec3, distance: number, dir: THREE.Vector3): void {
    const target = toScene(center);
    this.controls.target.copy(target);
    this.camera.position.copy(target).addScaledVector(dir, distance);
    this.camera.near = Math.max(0.1, distance / 2000);
    this.camera.far = distance * 200 + 1000;
    this.camera.updateProjectionMatrix();
    this.controls.minDistance = Math.max(0.05, distance / 1000);
    this.controls.maxDistance = distance * 50;
    this.controls.update();
    this.updateGround(Math.max(bboxSize(this.bounds), distance * 0.5));
  }

  private computeBounds(): void {
    const min: Vec3 = [0, 0, 0];
    const max: Vec3 = [0, 0, 0];
    const add = (p: Vec3): void => {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k]!, p[k]!);
        max[k] = Math.max(max[k]!, p[k]!);
      }
    };
    for (const s of this.segments) {
      add(s.from);
      add(s.to);
    }
    if (this.turtle) add(this.turtle.pos);
    this.bounds = { min, max };
  }

  /** Rebuilds the ground grid and axes only when the nice size changes; fitting runs every frame. */
  private updateGround(extent: number): void {
    const size = niceCeil(extent * 2);
    if (size === this.groundSize) return;
    this.groundSize = size;
    if (this.grid) {
      this.scene.remove(this.grid);
      this.grid.dispose();
    }
    // three.js colours need hex strings, so the grid uses the hex line colours rather than rgba variables.
    this.grid = new THREE.GridHelper(size, 20, cssVar('--line-strong') || '#888888', cssVar('--line') || '#cccccc');
    this.scene.add(this.grid);
    this.rebuildAxes(size / 2);
  }

  private rebuildAxes(length: number): void {
    for (const child of [...this.axesRoot.children] as LineSegments2[]) {
      child.geometry.dispose();
      this.axesRoot.remove(child);
    }
    const origin: Vec3 = [0, 0, 0];
    const axes: [Vec3, number][] = [
      [[length, 0, 0], 0],
      [[0, length, 0], 1],
      [[0, 0, length], 2],
    ];
    for (const [end, index] of axes) {
      const geometry = new LineSegmentsGeometry().setPositions([...toScene(origin).toArray(), ...toScene(end).toArray()]);
      const line = new LineSegments2(geometry, this.axisMaterials[index]!);
      this.axesRoot.add(line);
    }
  }

  // ---- drawing ----

  private rebuildLines(): void {
    for (const child of [...this.linesRoot.children]) {
      (child as LineSegments2).geometry.dispose();
      this.linesRoot.remove(child);
    }
    const byWidth = new Map<number, { pos: number[]; col: number[] }>();
    for (const s of this.segments) {
      let group = byWidth.get(s.width);
      if (!group) {
        group = { pos: [], col: [] };
        byWidth.set(s.width, group);
      }
      const a = toScene(s.from);
      const b = toScene(s.to);
      const c = new THREE.Color(s.color);
      group.pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      group.col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    for (const [width, group] of byWidth) {
      const geometry = new LineSegmentsGeometry().setPositions(group.pos).setColors(group.col);
      const line = new LineSegments2(geometry, this.materialFor(width));
      this.linesRoot.add(line);
    }
    this.updateTurtle();
  }

  private rebuildGhost(): void {
    for (const child of [...this.ghostRoot.children]) {
      (child as LineSegments2).geometry.dispose();
      this.ghostRoot.remove(child);
    }
    if (!this.ghost || this.ghost.length === 0) return;
    const pos: number[] = [];
    for (const s of this.ghost) {
      const a = toScene(s.from);
      const b = toScene(s.to);
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const line = new LineSegments2(new LineSegmentsGeometry().setPositions(pos), this.ghostMaterial);
    line.material.resolution.set(this.width(), this.height());
    this.ghostRoot.add(line);
  }

  private materialFor(width: number): LineMaterial {
    let material = this.materials.get(width);
    if (!material) {
      material = new LineMaterial({ linewidth: width, vertexColors: true });
      material.resolution.set(this.width(), this.height());
      this.materials.set(width, material);
    }
    return material;
  }

  private buildMarker(): THREE.Group {
    const group = new THREE.Group();
    // Cone points along +Y in its own frame, which is the turtle's heading.
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.6, 16), new THREE.MeshBasicMaterial({ color: cssVar('--turtle') || '#16866a' }));
    cone.position.y = 0.4;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), new THREE.MeshBasicMaterial({ color: cssVar('--turtle') || '#16866a' }));
    group.add(cone, ball);
    return group;
  }

  private updateTurtle(): void {
    const t = this.turtle;
    this.marker.visible = t !== null;
    if (!t) return;
    const xAxis = dirToScene(t.right);
    const yAxis = dirToScene(t.heading);
    const zAxis = dirToScene(t.up);
    const m = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
    this.marker.quaternion.setFromRotationMatrix(m);
    this.marker.position.copy(toScene(t.pos));
    this.updateMarkerScale();
  }

  private updateMarkerScale(): void {
    const d = this.camera.position.distanceTo(this.controls.target);
    this.marker.scale.setScalar(Math.max(0.2, d * 0.02));
  }

  private refreshColours(): void {
    this.renderer.setClearColor(new THREE.Color(cssVar('--canvas-bg') || '#ffffff'), 1);
    this.ghostMaterial.color.set(cssVar('--ghost') || '#999999');
    this.rebuildLines();
  }

  // ---- size ----

  private width(): number {
    return Math.max(1, this.element.clientWidth);
  }

  private height(): number {
    return Math.max(1, this.element.clientHeight);
  }

  private resize(): void {
    const w = this.element.clientWidth;
    const h = this.element.clientHeight;
    if (w === 0 || h === 0) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    for (const m of [...this.materials.values(), ...this.axisMaterials, this.ghostMaterial]) m.resolution.set(w, h);
  }
}

function bboxSize(b: { min: Vec3; max: Vec3 }): number {
  return Math.max(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2], 20);
}
