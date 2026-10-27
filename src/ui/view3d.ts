import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Segment } from '../logo';
import type { TurtleState } from '../logo/turtle';
import { segmentBounds, type Stage } from './stage';

const BG = 0xf3eee3;
const UP = new THREE.Vector3(0, 0, 1);

export class WebGLUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebGLUnavailableError';
  }
}

export function webglSupported(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/** Spatial view with orbit/pan/zoom camera. Segments become instanced cylinders with rounded joints. */
export class View3D implements Stage {
  readonly element: HTMLCanvasElement;
  onUserInteraction: (() => void) | null = null;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly gridGroup = new THREE.Group();
  private readonly turtleGroup = new THREE.Group();
  private readonly turtleMaterial: THREE.MeshStandardMaterial;
  private tubes: THREE.InstancedMesh;
  private joints: THREE.InstancedMesh;
  private capacity = 0;
  private uploaded = 0;
  private segments: Segment[] = [];
  private turtle: TurtleState | null = null;
  private dirty = true;
  private visible = true;
  private raf = 0;
  private readonly observer: ResizeObserver;
  private readonly tubeGeometry = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
  private readonly jointGeometry = new THREE.SphereGeometry(1, 10, 8);
  private readonly material = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05 });

  constructor(private readonly container: HTMLElement) {
    if (!webglSupported()) {
      throw new WebGLUnavailableError('Przeglądarka nie udostępnia WebGL, który jest potrzebny do rysowania w przestrzeni.');
    }
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (e) {
      throw new WebGLUnavailableError(`Nie udało się uruchomić WebGL: ${e instanceof Error ? e.message : String(e)}`);
    }
    this.renderer.setClearColor(BG, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.element = this.renderer.domElement;
    this.element.className = 'stage-3d';
    this.element.setAttribute('aria-label', 'Rysunek żółwia (3D)');
    container.appendChild(this.element);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1_000_000);
    this.camera.up.copy(UP);
    this.camera.position.set(170, -260, 190);
    this.controls = new OrbitControls(this.camera, this.element);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.12;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 400_000;
    this.controls.addEventListener('start', () => this.onUserInteraction?.());
    this.controls.addEventListener('change', () => (this.dirty = true));

    this.scene.background = new THREE.Color(BG);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x8a8270, 1.1);
    hemi.position.set(0, 0, 1);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(120, -200, 300);
    this.scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-200, 150, -100);
    this.scene.add(fill);

    this.buildGrid();
    this.scene.add(this.gridGroup);

    this.turtleMaterial = new THREE.MeshStandardMaterial({ color: 0x2fa37f, roughness: 0.5 });
    this.buildTurtle();
    this.scene.add(this.turtleGroup);

    this.tubes = this.makeInstanced(this.tubeGeometry, 0);
    this.joints = this.makeInstanced(this.jointGeometry, 0);
    this.ensureCapacity(1024);

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();
    this.loop();
  }

  // ---- Stage ------------------------------------------------------------

  setSegments(segments: Segment[]): void {
    this.segments = segments;
    this.uploaded = 0;
    this.dirty = true;
  }

  invalidate(): void {
    if (this.uploaded > this.segments.length) this.uploaded = 0;
    this.dirty = true;
  }

  setTurtle(turtle: TurtleState | null): void {
    this.turtle = turtle;
    this.dirty = true;
  }

  setGrid(on: boolean): void {
    this.gridGroup.visible = on;
    this.dirty = true;
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.element.style.display = visible ? '' : 'none';
    if (visible) {
      this.resize();
      this.dirty = true;
    }
  }

  fit(): void {
    const b = segmentBounds(this.segments, this.turtle);
    const center = new THREE.Vector3();
    let radius = 120;
    if (b) {
      center.set((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2);
      radius = Math.max(
        12,
        0.5 * Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]),
      );
    }
    const fov = (this.camera.fov * Math.PI) / 180;
    const aspect = this.camera.aspect || 1;
    const effFov = aspect < 1 ? 2 * Math.atan(Math.tan(fov / 2) * aspect) : fov;
    const dist = (radius / Math.sin(effFov / 2)) * 1.15;
    const dir = new THREE.Vector3(0.55, -0.8, 0.6).normalize();
    this.controls.target.copy(center);
    this.camera.position.copy(center).addScaledVector(dir, dist);
    this.camera.near = Math.max(0.1, dist / 1000);
    this.camera.far = Math.max(1_000_000, dist * 10);
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.dirty = true;
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    this.controls.dispose();
    this.tubes.dispose();
    this.joints.dispose();
    this.tubeGeometry.dispose();
    this.jointGeometry.dispose();
    this.material.dispose();
    this.turtleMaterial.dispose();
    this.renderer.dispose();
    this.element.remove();
  }

  // ---- scene building -----------------------------------------------------

  private buildGrid(): void {
    const size = 400;
    const divisions = 40;
    const grid = new THREE.GridHelper(size, divisions, 0xb9b1a2, 0xdcd5c7);
    grid.rotation.x = Math.PI / 2; // GridHelper lies in XZ; rotate into XY.
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.9;
    this.gridGroup.add(grid);
    const axisLen = 60;
    const mk = (to: THREE.Vector3, color: number): THREE.Line => {
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), to]);
      return new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.8 }));
    };
    this.gridGroup.add(mk(new THREE.Vector3(axisLen, 0, 0), 0xd9534f));
    this.gridGroup.add(mk(new THREE.Vector3(0, axisLen, 0), 0x3f9a57));
    this.gridGroup.add(mk(new THREE.Vector3(0, 0, axisLen), 0x4a7bd0));
  }

  private buildTurtle(): void {
    const dark = new THREE.MeshStandardMaterial({ color: 0x0b4d3a, roughness: 0.6 });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), this.turtleMaterial);
    shell.scale.set(6, 7.5, 3.6);
    this.turtleGroup.add(shell);
    const head = new THREE.Mesh(new THREE.SphereGeometry(2.7, 14, 10), this.turtleMaterial);
    head.position.set(0, 9, 0.5);
    head.scale.set(1, 1.3, 0.9);
    this.turtleGroup.add(head);
    for (const [x, y] of [
      [-5.5, 4],
      [5.5, 4],
      [-5.5, -4.5],
      [5.5, -4.5],
    ] as const) {
      const leg = new THREE.Mesh(new THREE.SphereGeometry(2.2, 10, 8), this.turtleMaterial);
      leg.position.set(x, y, -0.8);
      leg.scale.set(1, 1.2, 0.6);
      this.turtleGroup.add(leg);
    }
    const tail = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4, 8), this.turtleMaterial);
    tail.position.set(0, -9, -0.3);
    tail.rotation.x = Math.PI;
    this.turtleGroup.add(tail);
    for (const x of [-1.1, 1.1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 6), dark);
      eye.position.set(x, 11.8, 1.6);
      this.turtleGroup.add(eye);
    }
  }

  private makeInstanced(geometry: THREE.BufferGeometry, capacity: number): THREE.InstancedMesh {
    const mesh = new THREE.InstancedMesh(geometry, this.material, Math.max(capacity, 1));
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(mesh);
    return mesh;
  }

  private ensureCapacity(n: number): void {
    if (n <= this.capacity) return;
    let cap = Math.max(1024, this.capacity);
    while (cap < n) cap *= 2;
    this.scene.remove(this.tubes);
    this.scene.remove(this.joints);
    this.tubes.dispose();
    this.joints.dispose();
    this.tubes = this.makeInstanced(this.tubeGeometry, cap);
    this.joints = this.makeInstanced(this.jointGeometry, cap * 2);
    this.capacity = cap;
    this.uploaded = 0;
  }

  // ---- per-frame work --------------------------------------------------------

  private readonly tmpM = new THREE.Matrix4();
  private readonly tmpQ = new THREE.Quaternion();
  private readonly tmpV = new THREE.Vector3();
  private readonly tmpV2 = new THREE.Vector3();
  private readonly tmpS = new THREE.Vector3();
  private readonly tmpC = new THREE.Color();
  private readonly yAxis = new THREE.Vector3(0, 1, 0);

  private uploadSegments(): void {
    const segs = this.segments;
    this.ensureCapacity(segs.length);
    if (this.uploaded > segs.length) this.uploaded = 0;
    for (let i = this.uploaded; i < segs.length; i++) {
      const s = segs[i]!;
      const r = s.width / 2;
      const from = this.tmpV.set(s.from[0], s.from[1], s.from[2]);
      const to = this.tmpV2.set(s.to[0], s.to[1], s.to[2]);
      const len = from.distanceTo(to);
      const dir = to.clone().sub(from).normalize();
      this.tmpQ.setFromUnitVectors(this.yAxis, dir);
      const mid = from.clone().add(to).multiplyScalar(0.5);
      this.tmpM.compose(mid, this.tmpQ, this.tmpS.set(r, len, r));
      this.tubes.setMatrixAt(i, this.tmpM);
      this.tmpC.set(s.color);
      this.tubes.setColorAt(i, this.tmpC);
      const q0 = new THREE.Quaternion();
      this.tmpM.compose(from, q0, this.tmpS.set(r, r, r));
      this.joints.setMatrixAt(2 * i, this.tmpM);
      this.joints.setColorAt(2 * i, this.tmpC);
      this.tmpM.compose(to, q0, this.tmpS);
      this.joints.setMatrixAt(2 * i + 1, this.tmpM);
      this.joints.setColorAt(2 * i + 1, this.tmpC);
    }
    if (this.uploaded !== segs.length) {
      this.tubes.count = segs.length;
      this.joints.count = segs.length * 2;
      this.tubes.instanceMatrix.needsUpdate = true;
      this.joints.instanceMatrix.needsUpdate = true;
      if (this.tubes.instanceColor) this.tubes.instanceColor.needsUpdate = true;
      if (this.joints.instanceColor) this.joints.instanceColor.needsUpdate = true;
      this.uploaded = segs.length;
    }
  }

  private updateTurtle(): void {
    const t = this.turtle;
    this.turtleGroup.visible = !!t;
    if (!t) return;
    const m = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(t.right[0], t.right[1], t.right[2]),
      new THREE.Vector3(t.heading[0], t.heading[1], t.heading[2]),
      new THREE.Vector3(t.up[0], t.up[1], t.up[2]),
    );
    m.setPosition(t.position[0], t.position[1], t.position[2]);
    this.turtleGroup.matrixAutoUpdate = false;
    this.turtleGroup.matrix.copy(m);
    this.turtleGroup.matrixWorldNeedsUpdate = true;
    this.turtleMaterial.color.set(t.penDown ? 0x2fa37f : 0xb7d9cb);
  }

  private resize(): void {
    const rect = this.container.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    this.renderer.setSize(w, h, true);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }

  private loop(): void {
    this.raf = requestAnimationFrame(() => this.loop());
    if (!this.visible) return;
    const moved = this.controls.update();
    if (!this.dirty && !moved) return;
    this.dirty = false;
    this.uploadSegments();
    this.updateTurtle();
    this.renderer.render(this.scene, this.camera);
  }
}
