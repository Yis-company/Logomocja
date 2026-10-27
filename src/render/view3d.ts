import {
  AxesHelper,
  Box3,
  Color,
  ConeGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  GridHelper,
  BoxGeometry,
  SphereGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { Segment } from "../lang";
import type { Frame } from "../ui/player";
import { cssVar, type DrawingView } from "./view";

const DEFAULT_CAMERA = new Vector3(-260, -380, 300);

interface Batch {
  mesh: LineSegments2;
  material: LineMaterial;
}

/** Spatial drawing rendered with WebGL; the camera orbits, pans and zooms. */
export class View3D implements DrawingView {
  readonly element: HTMLDivElement;
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(45, 1, 0.5, 2_000_000);
  private readonly controls: OrbitControls;
  private readonly ro: ResizeObserver;
  private readonly lines = new Group();
  private readonly batches = new Map<number, Batch>();
  private partial: Batch | null = null;
  private grid: GridHelper | null = null;
  private gridSize = 0;
  private readonly axes = new AxesHelper(1);
  private readonly turtle = new Group();
  private readonly turtleMat = new MeshLambertMaterial({ color: 0x16866a, transparent: true });
  private w = 1;
  private h = 1;
  private raf = 0;
  private last: Frame | null = null;
  private drawnArray: Segment[] | null = null;
  private drawnCount = 0;
  private lostHandler: (() => void) | null = null;

  constructor(host: HTMLElement, onContextLost: () => void) {
    this.element = document.createElement("div");
    this.element.className = "view view-3d";
    this.renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(2.5, window.devicePixelRatio || 1));
    const canvas = this.renderer.domElement;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Rysunek żółwia (3D) – przeciągnij, aby obracać widok");
    this.element.append(canvas);
    host.append(this.element);

    this.lostHandler = onContextLost;
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.lostHandler?.();
    });

    this.camera.up.set(0, 0, 1);
    this.camera.position.copy(DEFAULT_CAMERA);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.12;
    this.controls.screenSpacePanning = true;
    this.controls.target.set(0, 0, 0);
    this.controls.addEventListener("change", () => this.requestRender());

    this.scene.add(new HemisphereLight(0xffffff, 0x445544, 2.2));
    const sun = new DirectionalLight(0xffffff, 1.6);
    sun.position.set(-1, -2, 3);
    this.scene.add(sun);
    this.scene.add(this.lines);
    this.axes.scale.setScalar(60);
    this.scene.add(this.axes);
    this.buildTurtle();
    this.scene.add(this.turtle);
    this.setGrid(400);
    this.refreshTheme();

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.element);
    this.resize();
  }

  private buildTurtle(): void {
    // Local frame: +X right, +Y heading, +Z up.
    const body = new Mesh(new ConeGeometry(0.42, 1.25, 20), this.turtleMat);
    body.position.y = 0.2;
    // Low dome as the shell, flattened along the up axis.
    const shell = new Mesh(new SphereGeometry(0.5, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), this.turtleMat);
    shell.rotation.x = Math.PI / 2;
    shell.scale.set(1, 0.5, 1);
    shell.position.y = -0.1;
    // Fin on the "up" side shows the up vector.
    const fin = new Mesh(new BoxGeometry(0.08, 0.6, 0.55), this.turtleMat);
    fin.position.set(0, -0.15, 0.32);
    this.turtle.add(body, shell, fin);
  }

  private setGrid(size: number): void {
    if (size === this.gridSize) return;
    this.gridSize = size;
    if (this.grid) {
      this.scene.remove(this.grid);
      this.grid.geometry.dispose();
      (this.grid.material as { dispose(): void }).dispose();
    }
    const major = new Color(cssVar("--grid3d-major", "#b9c4bd"));
    const minor = new Color(cssVar("--grid3d-minor", "#dde3de"));
    this.grid = new GridHelper(size, 20, major, minor);
    this.grid.rotation.x = Math.PI / 2; // into the XY plane
    this.scene.add(this.grid);
    this.axes.scale.setScalar(size * 0.15);
  }

  refreshTheme(): void {
    this.scene.background = new Color(cssVar("--paper", "#fbf8f1"));
    const size = this.gridSize;
    this.gridSize = 0;
    this.setGrid(size);
    this.requestRender();
  }

  private resize(): void {
    const r = this.element.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.renderer.setSize(this.w, this.h);
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    for (const b of this.allBatches()) b.material.resolution.set(this.w, this.h);
    this.requestRender();
  }

  private *allBatches(): Iterable<Batch> {
    yield* this.batches.values();
    if (this.partial) yield this.partial;
  }

  private requestRender(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      const moving = this.controls.update();
      this.renderer.render(this.scene, this.camera);
      if (moving) this.requestRender();
    });
  }

  private makeBatch(segs: Segment[], width: number): Batch {
    const pos = new Float32Array(segs.length * 6);
    const col = new Float32Array(segs.length * 6);
    const c = new Color();
    segs.forEach((s, i) => {
      pos.set(s.from, i * 6);
      pos.set(s.to, i * 6 + 3);
      c.set(s.color);
      col[i * 6] = col[i * 6 + 3] = c.r;
      col[i * 6 + 1] = col[i * 6 + 4] = c.g;
      col[i * 6 + 2] = col[i * 6 + 5] = c.b;
    });
    const geom = new LineSegmentsGeometry();
    geom.setPositions(pos);
    geom.setColors(col);
    const material = new LineMaterial({ linewidth: width, vertexColors: true, worldUnits: false });
    material.resolution.set(this.w, this.h);
    const mesh = new LineSegments2(geom, material);
    mesh.frustumCulled = false;
    return { mesh, material };
  }

  private dropBatch(b: Batch): void {
    this.lines.remove(b.mesh);
    b.mesh.geometry.dispose();
    b.material.dispose();
  }

  render(frame: Frame): void {
    this.last = frame;
    const segs = frame.segments;
    if (segs !== this.drawnArray || frame.count !== this.drawnCount) {
      // Rebuild only the widths that changed since the last frame.
      const dirty = new Set<number>();
      if (segs !== this.drawnArray || frame.count < this.drawnCount) {
        for (const w of this.batches.keys()) dirty.add(w);
        for (let i = 0; i < frame.count; i++) dirty.add(segs[i]!.width);
      } else {
        for (let i = this.drawnCount; i < frame.count; i++) dirty.add(segs[i]!.width);
      }
      if (dirty.size) {
        const byWidth = new Map<number, Segment[]>();
        for (let i = 0; i < frame.count; i++) {
          const s = segs[i]!;
          if (!dirty.has(s.width)) continue;
          let list = byWidth.get(s.width);
          if (!list) byWidth.set(s.width, (list = []));
          list.push(s);
        }
        for (const w of dirty) {
          const old = this.batches.get(w);
          if (old) this.dropBatch(old);
          this.batches.delete(w);
          const list = byWidth.get(w);
          if (list?.length) {
            const b = this.makeBatch(list, w);
            this.batches.set(w, b);
            this.lines.add(b.mesh);
          }
        }
      }
      this.drawnArray = segs;
      this.drawnCount = frame.count;
    }

    if (this.partial) {
      this.dropBatch(this.partial);
      this.partial = null;
    }
    if (frame.partial) {
      this.partial = this.makeBatch([frame.partial], frame.partial.width);
      this.lines.add(this.partial.mesh);
    }

    const p = frame.pose;
    this.turtle.position.set(p.pos[0], p.pos[1], p.pos[2]);
    const m = new Matrix4().makeBasis(
      new Vector3(...p.right),
      new Vector3(...p.heading),
      new Vector3(...p.up),
    );
    this.turtle.quaternion.setFromRotationMatrix(m);
    this.turtleMat.color.set(p.color);
    this.turtleMat.opacity = p.penDown ? 1 : 0.4;
    this.turtle.scale.setScalar(Math.max(6, this.gridSize * 0.05));
    this.requestRender();
  }

  private bounds(frame: Frame): Box3 {
    const box = new Box3();
    box.expandByPoint(new Vector3(...frame.pose.pos));
    const v = new Vector3();
    for (const s of frame.segments) {
      box.expandByPoint(v.set(...s.from));
      box.expandByPoint(v.set(...s.to));
    }
    return box;
  }

  fit(frame: Frame): void {
    this.last = frame;
    const box = this.bounds(frame);
    const center = box.getCenter(new Vector3());
    const radius = Math.max(box.getSize(new Vector3()).length() / 2, 20);
    const extent = Math.max(
      Math.abs(box.min.x),
      Math.abs(box.max.x),
      Math.abs(box.min.y),
      Math.abs(box.max.y),
    );
    this.setGrid(niceGrid(extent * 2.4));
    const dir = this.camera.position.clone().sub(this.controls.target).normalize();
    if (!Number.isFinite(dir.x)) dir.copy(DEFAULT_CAMERA).normalize();
    const fov = (this.camera.fov * Math.PI) / 180;
    const fovMin = Math.min(fov, 2 * Math.atan(Math.tan(fov / 2) * this.camera.aspect));
    const dist = (radius / Math.sin(fovMin / 2)) * 1.08;
    this.controls.target.copy(center);
    this.camera.position.copy(center).addScaledVector(dir, dist);
    this.camera.updateProjectionMatrix();
    this.render(frame);
  }

  contains(frame: Frame): boolean {
    const box = this.bounds(frame);
    this.camera.updateMatrixWorld();
    const v = new Vector3();
    for (let i = 0; i < 8; i++) {
      v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z);
      v.project(this.camera);
      if (Math.abs(v.x) > 0.97 || Math.abs(v.y) > 0.97 || v.z > 1 || v.z < -1) return false;
    }
    return true;
  }

  zoomBy(factor: number): void {
    const t = this.controls.target;
    const offset = this.camera.position.clone().sub(t).divideScalar(factor);
    this.camera.position.copy(t).add(offset);
    this.requestRender();
  }

  resetView(): void {
    this.controls.target.set(0, 0, 0);
    this.camera.position.copy(DEFAULT_CAMERA);
    this.setGrid(400);
    if (this.last) this.render(this.last);
    this.requestRender();
  }

  toPng(): Promise<Blob | null> {
    this.renderer.render(this.scene, this.camera);
    return new Promise((res) => this.renderer.domElement.toBlob(res, "image/png"));
  }

  dispose(): void {
    this.lostHandler = null;
    this.ro.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
    for (const b of this.allBatches()) this.dropBatch(b);
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.element.remove();
  }
}

function niceGrid(span: number): number {
  const s = Math.max(400, span);
  const pow = Math.pow(10, Math.floor(Math.log10(s)));
  for (const m of [1, 2, 5, 10]) if (m * pow >= s) return m * pow;
  return 10 * pow;
}
