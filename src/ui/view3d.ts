import {
  AxesHelper,
  Color,
  ConeGeometry,
  GridHelper,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { Segment, Turtle } from '../lang';
import type { Scene as DrawScene } from './view2d';
import { cssVar } from './theme';

/** Whether this browser can create a WebGL context. Used to explain why 3D is off. */
export function webglAvailable(): boolean {
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
  } catch {
    return false;
  }
}

interface Bounds3 {
  min: [number, number, number];
  max: [number, number, number];
}

function boundsOf3(segments: readonly Segment[], turtle: Turtle | null): Bounds3 {
  const min: [number, number, number] = [0, 0, 0];
  const max: [number, number, number] = [0, 0, 0];
  const take = (p: readonly number[]) => {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], p[k]);
      max[k] = Math.max(max[k], p[k]);
    }
  };
  for (const s of segments) {
    take(s.from);
    take(s.to);
  }
  if (turtle) take(turtle.position);
  return { min, max };
}

function niceCellSize(extent: number): number {
  const target = Math.max(extent / 40, 1);
  const power = Math.pow(10, Math.floor(Math.log10(target)));
  for (const factor of [1, 2, 5, 10]) {
    if (power * factor >= target) return power * factor;
  }
  return power * 10;
}

const DEFAULT_OFFSET = new Vector3(0.62, -0.95, 0.78).normalize();

/**
 * The 3D view: fat lines (so widths are honoured), a ground grid in the XY
 * plane, axes, an oriented turtle, and orbit / pan / zoom controls with Z up.
 */
export class View3D {
  readonly canvas: HTMLCanvasElement;
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(40, 1, 0.05, 1e8);
  private readonly controls: OrbitControls;
  private readonly lines = new Group();
  private readonly ghost = new Group();
  private readonly materials = new Set<LineMaterial>();
  private readonly turtleMaterial = new MeshBasicMaterial({ color: new Color(cssVar('--accent') || '#16866a') });
  private readonly turtleMesh: Mesh<ConeGeometry, MeshBasicMaterial>;
  private grid: GridHelper | null = null;
  private axes: AxesHelper | null = null;
  private gridCell = 0;
  private builtRevision = -1;
  private builtGhost: readonly Segment[] | null = null;
  private drawScene: DrawScene = { segments: [], revision: -1, turtle: null, ghost: null };
  private width = 0;
  private height = 0;
  private frame = 0;
  private follow = false;
  private readonly observer: ResizeObserver;
  private pixelRatio = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new WebGLRenderer({ canvas, antialias: true });
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.camera.up.set(0, 0, 1);
    this.scene.add(this.lines, this.ghost);
    this.turtleMesh = new Mesh(new ConeGeometry(0.5, 1.8, 14), this.turtleMaterial);
    this.scene.add(this.turtleMesh);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.12;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 1e7;
    this.controls.listenToKeyEvents(canvas);
    canvas.tabIndex = 0;

    this.refreshTheme();
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
    this.fitTo(this.drawScene);
    this.loop();
  }

  setScene(scene: DrawScene): void {
    const first = this.drawScene.revision === -1 && scene.revision !== -1;
    this.drawScene = scene;
    if (first) this.fitTo(scene);
    else if (this.follow) this.followScene(scene);
  }

  /** While a program runs, keep the drawing in view: widen the view as it grows, keep the user's angle. */
  setFollow(enabled: boolean): void {
    this.follow = enabled;
  }

  private followScene(scene: DrawScene): void {
    const bounds = boundsOf3(scene.segments, scene.turtle);
    const center = new Vector3(
      (bounds.min[0] + bounds.max[0]) / 2,
      (bounds.min[1] + bounds.max[1]) / 2,
      (bounds.min[2] + bounds.max[2]) / 2,
    );
    const radius = Math.max(
      new Vector3(bounds.max[0] - bounds.min[0], bounds.max[1] - bounds.min[1], bounds.max[2] - bounds.min[2]).length() / 2,
      25,
    );
    const needed = (radius / Math.sin((this.camera.fov * Math.PI) / 360)) * 1.1;
    this.controls.target.lerp(center, 0.2);
    const offset = this.camera.position.clone().sub(this.controls.target);
    const current = offset.length();
    offset.setLength(current + (Math.max(current, needed) - current) * 0.2);
    this.camera.position.copy(this.controls.target).add(offset);
    if (needed * 100 > this.camera.far) {
      this.camera.far = needed * 100;
      this.camera.updateProjectionMatrix();
    }
  }

  /** Frames the drawing with the default camera angle. Also serves as "reset camera". */
  fitTo(scene: DrawScene = this.drawScene): void {
    const bounds = boundsOf3(scene.segments, scene.turtle);
    const center = new Vector3(
      (bounds.min[0] + bounds.max[0]) / 2,
      (bounds.min[1] + bounds.max[1]) / 2,
      (bounds.min[2] + bounds.max[2]) / 2,
    );
    const radius = Math.max(
      new Vector3(bounds.max[0] - bounds.min[0], bounds.max[1] - bounds.min[1], bounds.max[2] - bounds.min[2]).length() / 2,
      25,
    );
    const distance = (radius / Math.sin((this.camera.fov * Math.PI) / 360)) * 1.1;
    this.controls.target.copy(center);
    this.camera.position.copy(center).addScaledVector(DEFAULT_OFFSET, distance);
    this.camera.near = Math.max(distance / 1000, 0.01);
    this.camera.far = Math.max(distance * 100, 1000);
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.updateGrid(radius * 2.4);
  }

  zoomBy(factor: number): void {
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.multiplyScalar(factor);
    this.camera.position.copy(this.controls.target).add(offset);
    this.controls.update();
  }

  /** Call after the theme changes. */
  refreshTheme(): void {
    this.scene.background = new Color(cssVar('--canvas-bg') || '#f7f4ea');
    this.turtleMaterial.color.set(cssVar('--accent') || '#16866a');
    if (this.grid || this.axes) this.updateGrid(this.gridCell * 40, true);
    this.builtRevision = -1;
    this.builtGhost = null;
  }

  /** A PNG of the current camera view with the background filled in. */
  exportPng(): Promise<Blob> {
    // Render and capture in the same task: the drawing buffer is still valid then.
    this.renderer.render(this.scene, this.camera);
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Nie udało się zapisać obrazu.'))), 'image/png');
    });
  }

  dispose(): void {
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
  }

  private updateGrid(extent: number, force = false): void {
    const cell = niceCellSize(extent);
    if (!force && cell === this.gridCell && this.grid) return;
    this.gridCell = cell;
    if (this.grid) this.scene.remove(this.grid);
    if (this.axes) this.scene.remove(this.axes);
    const size = cell * 40;
    const center = new Color(cssVar('--grid-major') || '#d2cbb8');
    const minor = new Color(cssVar('--grid-minor') || '#e5e0d2');
    this.grid = new GridHelper(size, 40, center, minor);
    // GridHelper lies in the XZ plane; turn it so it lies on the ground (XY).
    this.grid.rotation.x = Math.PI / 2;
    this.axes = new AxesHelper(size * 0.3);
    this.scene.add(this.grid, this.axes);
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    const bufferWidth = Math.round(width * this.pixelRatio);
    const bufferHeight = Math.round(height * this.pixelRatio);
    for (const material of this.materials) material.resolution.set(bufferWidth, bufferHeight);
  }

  private rebuildLines(): void {
    const scene = this.drawScene;
    if (scene.revision !== this.builtRevision) {
      this.builtRevision = scene.revision;
      this.replaceLines(this.lines, scene.segments, false);
    }
    if (scene.ghost !== this.builtGhost) {
      this.builtGhost = scene.ghost;
      this.replaceLines(this.ghost, scene.ghost ?? [], true);
    }
  }

  private replaceLines(group: Group, segments: readonly Segment[], isGhost: boolean): void {
    for (const child of [...group.children]) {
      const line = child as LineSegments2;
      line.geometry.dispose();
      (line.material as LineMaterial).dispose();
      this.materials.delete(line.material as LineMaterial);
      group.remove(child);
    }
    const byWidth = new Map<number, { positions: number[]; colors: number[] }>();
    const ghostColor = cssVar('--ghost') || '#9a9384';
    for (const s of segments) {
      const width = isGhost ? 2 : s.width;
      let bucket = byWidth.get(width);
      if (!bucket) {
        bucket = { positions: [], colors: [] };
        byWidth.set(width, bucket);
      }
      bucket.positions.push(s.from[0], s.from[1], s.from[2], s.to[0], s.to[1], s.to[2]);
      const color = new Color(isGhost ? ghostColor : s.color);
      bucket.colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }
    const bufferWidth = Math.round(this.width * this.pixelRatio);
    const bufferHeight = Math.round(this.height * this.pixelRatio);
    for (const [width, bucket] of byWidth) {
      const geometry = new LineSegmentsGeometry();
      geometry.setPositions(bucket.positions);
      geometry.setColors(bucket.colors);
      const material = new LineMaterial({
        linewidth: width * this.pixelRatio,
        vertexColors: true,
        transparent: isGhost,
        opacity: isGhost ? 0.55 : 1,
      });
      material.resolution.set(bufferWidth, bufferHeight);
      this.materials.add(material);
      group.add(new LineSegments2(geometry, material));
    }
  }

  private placeTurtle(turtle: Turtle | null): void {
    this.turtleMesh.visible = turtle !== null;
    if (!turtle) return;
    const basis = new Matrix4().makeBasis(
      new Vector3(...turtle.right),
      new Vector3(...turtle.heading),
      new Vector3(...turtle.up),
    );
    this.turtleMesh.quaternion.setFromRotationMatrix(basis);
    this.turtleMesh.position.set(...turtle.position);
    const distance = this.camera.position.distanceTo(this.controls.target);
    this.turtleMesh.scale.setScalar(Math.max(distance * 0.018, 0.4));
  }

  private loop = (): void => {
    if (this.width > 0 && this.canvas.clientWidth > 0) {
      this.rebuildLines();
      this.placeTurtle(this.drawScene.turtle);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
    this.frame = requestAnimationFrame(this.loop);
  };
}
