// 3D view (three.js): orbit camera, ground grid, axes, oriented turtle marker.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { Segment, Turtle } from "../lang/interp";
import { boundsOf } from "./view2d";

/** Returns null if WebGL works, otherwise a Polish explanation. */
export function webglProblem(): string | null {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return "Ta przeglądarka nie udostępnia WebGL (może być wyłączony albo nieobsługiwany przez kartę graficzną), więc tryb 3D jest niedostępny. Tryb 2D działa normalnie.";
    return null;
  } catch {
    return "Nie udało się uruchomić WebGL, więc tryb 3D jest niedostępny. Tryb 2D działa normalnie.";
  }
}

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export class View3D {
  canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.5, 20000);
  private controls: OrbitControls;
  private lines = new THREE.Group();
  private ghostGroup = new THREE.Group();
  private helpers = new THREE.Group();
  private turtleObj = new THREE.Group();
  private materials: LineMaterial[] = [];
  segments: Segment[] = [];
  ghost: Segment[] = [];
  turtle: Turtle | null = null;
  private drawnCount = -1;
  private drawnRef: Segment[] | null = null;
  private queued = false;
  private gridSize = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(260, -380, 300);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = false;
    this.controls.listenToKeyEvents(canvas);
    this.controls.keyPanSpeed = 20;
    this.controls.addEventListener("change", () => this.request());
    this.scene.add(this.helpers, this.ghostGroup, this.lines, this.turtleObj);
    this.buildTurtle();
    this.buildHelpers(400);
    canvas.addEventListener("keydown", (e) => {
      if (e.key === "+" || e.key === "=") this.dolly(0.8);
      else if (e.key === "-" || e.key === "_") this.dolly(1.25);
      else if (e.key === "0" || e.key === "f") this.fit();
      else if (e.key === "a") this.orbit(-15);
      else if (e.key === "d") this.orbit(15);
      else return;
      e.preventDefault();
    });
    new ResizeObserver(() => this.request()).observe(canvas);
  }

  private buildTurtle() {
    const body = new THREE.Mesh(new THREE.ConeGeometry(5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    body.name = "body";
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 8, 7), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    fin.position.set(0, -2, 5);
    fin.name = "fin";
    const wingGeom = new THREE.BoxGeometry(12, 4, 0.8);
    const wing = new THREE.Mesh(wingGeom, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    wing.position.set(0, -4, 0);
    wing.name = "wing";
    this.turtleObj.add(body, fin, wing);
  }

  private buildHelpers(size: number) {
    this.gridSize = size;
    for (const c of [...this.helpers.children]) {
      this.helpers.remove(c);
      (c as THREE.LineSegments).geometry?.dispose();
    }
    const div = 20;
    const grid = new THREE.GridHelper(size, div, new THREE.Color(css("--axis") || "#999"), new THREE.Color(css("--grid") || "#ddd"));
    grid.rotation.x = Math.PI / 2; // XY plane, Z up
    this.helpers.add(grid);
    const L = size / 2;
    const ax = (to: [number, number, number], color: number) => {
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(...to)]);
      return new THREE.Line(g, new THREE.LineBasicMaterial({ color }));
    };
    this.helpers.add(ax([L, 0, 0], 0xd9534f), ax([0, L, 0], 0x3a9d4a), ax([0, 0, L], 0x3b72c4));
  }

  private bounds() {
    const extra: [number, number, number][] = [];
    if (!this.segments.length && !this.ghost.length) extra.push([0, 0, 0]);
    if (this.turtle) extra.push(this.turtle.pos);
    return boundsOf([...this.segments, ...this.ghost], extra)!;
  }

  fit() {
    const b = this.bounds();
    const c = new THREE.Vector3((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2);
    const r = Math.max(40, Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]) / 2);
    const span = Math.max(Math.abs(b.min[0]), Math.abs(b.max[0]), Math.abs(b.min[1]), Math.abs(b.max[1]), 100);
    const pow = Math.pow(10, Math.floor(Math.log10(span)));
    const size = Math.ceil((span * 2.2) / pow) * pow;
    if (size !== this.gridSize) this.buildHelpers(size);
    const dir = new THREE.Vector3(0.55, -0.8, 0.6).normalize();
    const aspect = this.camera.aspect || 1;
    const fov = (this.camera.fov * Math.PI) / 180;
    const dist = (r / Math.sin(Math.min(fov, fov * aspect) / 2)) * 1.05;
    this.camera.position.copy(c).addScaledVector(dir, dist);
    this.camera.near = Math.max(0.1, dist / 100);
    this.camera.far = dist * 20 + size * 4;
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(c);
    this.controls.update();
    this.render();
  }

  dolly(f: number) {
    const off = this.camera.position.clone().sub(this.controls.target).multiplyScalar(f);
    this.camera.position.copy(this.controls.target).add(off);
    this.controls.update();
  }
  orbit(deg: number) {
    const off = this.camera.position.clone().sub(this.controls.target);
    off.applyAxisAngle(new THREE.Vector3(0, 0, 1), (deg * Math.PI) / 180);
    this.camera.position.copy(this.controls.target).add(off);
    this.controls.update();
  }

  private rebuild(group: THREE.Group, segs: Segment[], ghost: boolean) {
    for (const c of [...group.children]) {
      group.remove(c);
      (c as LineSegments2).geometry.dispose();
      ((c as LineSegments2).material as LineMaterial).dispose();
    }
    const byWidth = new Map<number, Segment[]>();
    for (const s of segs) {
      const w = ghost ? 9 : s.width;
      if (!byWidth.has(w)) byWidth.set(w, []);
      byWidth.get(w)!.push(s);
    }
    const ghostCol = new THREE.Color(css("--ghost-solid") || "#bbb");
    for (const [w, list] of byWidth) {
      const pos: number[] = [];
      const col: number[] = [];
      for (const s of list) {
        pos.push(...s.from, ...s.to);
        const c = ghost ? ghostCol : new THREE.Color(s.color);
        col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
      const geo = new LineSegmentsGeometry();
      geo.setPositions(pos);
      geo.setColors(col);
      const mat = new LineMaterial({ linewidth: w, vertexColors: true, transparent: ghost, opacity: ghost ? 0.45 : 1, depthWrite: !ghost });
      const line = new LineSegments2(geo, mat);
      line.computeLineDistances();
      group.add(line);
    }
  }

  setGhost(g: Segment[]) {
    this.ghost = g;
    this.rebuild(this.ghostGroup, g, true);
    this.request();
  }

  request() {
    if (this.queued) return;
    this.queued = true;
    requestAnimationFrame(() => {
      this.queued = false;
      this.render();
    });
  }

  render() {
    const c = this.canvas;
    const W = c.clientWidth;
    const H = c.clientHeight;
    if (!W || !H) return;
    const size = this.renderer.getSize(new THREE.Vector2());
    if (size.x !== W || size.y !== H) {
      this.renderer.setSize(W, H, false);
      this.camera.aspect = W / H;
      this.camera.updateProjectionMatrix();
    }
    if (this.drawnRef !== this.segments || this.drawnCount !== this.segments.length) {
      this.rebuild(this.lines, this.segments, false);
      this.drawnRef = this.segments;
      this.drawnCount = this.segments.length;
    }
    for (const g of [this.lines, this.ghostGroup])
      for (const l of g.children) ((l as LineSegments2).material as LineMaterial).resolution.set(W, H);
    this.scene.background = new THREE.Color(css("--canvas") || "#fff");
    const t = this.turtle;
    this.turtleObj.visible = !!t;
    if (t) {
      const tc = new THREE.Color(t.pen ? css("--turtle") : css("--turtle-up"));
      for (const m of this.turtleObj.children) ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).color = tc;
      ((this.turtleObj.getObjectByName("fin") as THREE.Mesh).material as THREE.MeshBasicMaterial).color = new THREE.Color(css("--accent-2") || "#c1763d");
      const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...t.r), new THREE.Vector3(...t.h), new THREE.Vector3(...t.u));
      this.turtleObj.quaternion.setFromRotationMatrix(m);
      this.turtleObj.position.set(...t.pos);
      const s = this.camera.position.distanceTo(this.controls.target) / 450;
      this.turtleObj.scale.setScalar(Math.max(0.3, s));
    }
    this.renderer.render(this.scene, this.camera);
  }

  /** Invalidate colours (theme change). */
  refreshTheme() {
    this.buildHelpers(this.gridSize);
    this.drawnCount = -1;
    this.setGhost(this.ghost);
  }

  toBlob(): Promise<Blob | null> {
    this.render();
    return new Promise((res) => this.canvas.toBlob(res, "image/png"));
  }
}
