import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { Segment, Vec, Mode } from "./interpreter";
export class Drawing {
  private canvas = document.createElement("canvas");
  private ctx: CanvasRenderingContext2D;
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private controls?: OrbitControls;
  private strokes = new THREE.Group();
  private turtle3?: THREE.Group;
  private fitted = false;
  private w = 1;
  private h = 1;
  private scale = 1.3;
  private offset = [0, 0];
  private segments: Segment[] = [];
  private position: Vec = [0, 0, 0];
  private heading: Vec = [0, 1, 0];
  mode: Mode = "2d";
  webgl = true;
  showGrid = true;
  showTurtle = true;
  constructor(
    private host: HTMLElement,
    private onZoom: (n: number) => void,
  ) {
    this.canvas.className = "drawing-canvas";
    this.canvas.setAttribute(
      "aria-label",
      "Rysunek żółwia. Przeciągnij, aby przesunąć; użyj kółka myszy, aby przybliżyć.",
    );
    this.host.append(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
    let drag: { x: number; y: number } | null = null;
    this.canvas.addEventListener("pointerdown", (e) => {
      drag = { x: e.clientX, y: e.clientY };
      this.canvas.setPointerCapture(e.pointerId);
    });
    this.canvas.addEventListener("pointermove", (e) => {
      if (drag) {
        this.fitted = false;
        this.offset[0] += e.clientX - drag.x;
        this.offset[1] += e.clientY - drag.y;
        drag = { x: e.clientX, y: e.clientY };
        this.paint();
      }
    });
    this.canvas.addEventListener("pointerup", () => (drag = null));
    this.canvas.addEventListener("pointercancel", () => (drag = null));
    this.canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12);
      },
      { passive: false },
    );
    new ResizeObserver(() => this.resize()).observe(host);
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      this.renderer.setClearColor("#fcfdfb");
      this.renderer.domElement.className = "drawing-canvas three-canvas";
      this.renderer.domElement.style.display = "none";
      this.renderer.domElement.setAttribute(
        "aria-label",
        "Przestrzeń 3D. Przeciągnij, aby obrócić kamerę; prawym przyciskiem przesuń; kółkiem przybliż.",
      );
      this.host.append(this.renderer.domElement);
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000000);
      this.camera.up.set(0, 0, 1);
      this.camera.position.set(320, -420, 400);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = false;
      this.controls.addEventListener("change", () => this.paint3d());
      const grid = new THREE.GridHelper(2000, 80, 0xcdded7, 0xe7ede8);
      grid.rotation.x = Math.PI / 2;
      grid.name = "grid";
      this.scene.add(grid, this.strokes);
      this.turtle3 = new THREE.Group();
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(5, 14, 3),
        new THREE.MeshBasicMaterial({ color: 0x16866a }),
      );
      this.turtle3.add(cone);
      this.scene.add(this.turtle3);
      this.renderer.domElement.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        this.webgl = false;
        this.setMode("2d");
        this.host.dispatchEvent(
          new CustomEvent("webgl-lost", { bubbles: true }),
        );
      });
    } catch {
      this.webgl = false;
    }
    this.resize();
  }
  private resize() {
    this.w = this.host.clientWidth;
    this.h = this.host.clientHeight;
    const d = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = this.w * d;
    this.canvas.height = this.h * d;
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
    if (this.renderer && this.camera) {
      this.renderer.setSize(this.w, this.h);
      this.camera.aspect = this.w / Math.max(this.h, 1);
      this.camera.updateProjectionMatrix();
      for (const c of this.strokes.children)
        (c as LineSegments2).material.resolution.set(this.w, this.h);
    }
    if (this.fitted) this.fit();
    else this.paint();
  }
  setMode(mode: Mode) {
    this.mode = mode;
    this.canvas.style.display = mode === "2d" ? "block" : "none";
    if (this.renderer)
      this.renderer.domElement.style.display = mode === "3d" ? "block" : "none";
    this.paint();
  }
  update(segments: Segment[], position: Vec, heading: Vec) {
    this.segments = segments;
    this.position = position;
    this.heading = heading;
    if (this.mode === "3d") this.rebuild3d();
    this.paint();
  }
  private rebuild3d() {
    for (const c of [...this.strokes.children]) {
      const line = c as LineSegments2;
      line.geometry.dispose();
      line.material.dispose();
      this.strokes.remove(c);
    }
    const groups = new Map<number, { p: number[]; c: number[] }>();
    for (const s of this.segments) {
      let g = groups.get(s.width);
      if (!g) {
        g = { p: [], c: [] };
        groups.set(s.width, g);
      }
      g.p.push(...s.from, ...s.to);
      const c = new THREE.Color(s.color);
      g.c.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    for (const [width, g] of groups) {
      const geometry = new LineSegmentsGeometry();
      geometry.setPositions(g.p);
      geometry.setColors(g.c);
      const material = new LineMaterial({
        vertexColors: true,
        linewidth: width,
        resolution: new THREE.Vector2(this.w, this.h),
      });
      this.strokes.add(new LineSegments2(geometry, material));
    }
  }
  zoom(factor: number) {
    this.fitted = false;
    if (this.mode === "2d") {
      this.scale = Math.min(20, Math.max(0.001, this.scale * factor));
      this.onZoom(Math.round(this.scale * 100));
      this.paint();
    } else if (this.camera && this.controls) {
      this.camera.position
        .sub(this.controls.target)
        .multiplyScalar(1 / factor)
        .add(this.controls.target);
      this.controls.update();
      this.paint3d();
    }
  }
  fit() {
    this.fitted = true;
    const points: Vec[] = this.segments.flatMap((s) => [s.from, s.to]);
    points.push(this.position);
    const min = [Infinity, Infinity, Infinity],
      max = [-Infinity, -Infinity, -Infinity];
    for (const p of points)
      for (let i = 0; i < 3; i++) {
        min[i] = Math.min(min[i], p[i]);
        max[i] = Math.max(max[i], p[i]);
      }
    const center = min.map((v, i) => (v + max[i]) / 2);
    if (this.mode === "2d") {
      this.scale = Math.min(
        2.5,
        Math.max(
          0.001,
          Math.min(
            (this.w - 100) / Math.max(80, max[0] - min[0]),
            (this.h - 100) / Math.max(80, max[1] - min[1]),
          ),
        ),
      );
      this.offset = [-center[0] * this.scale, center[1] * this.scale];
      this.onZoom(Math.round(this.scale * 100));
    } else if (this.camera && this.controls) {
      const size =
        (1.45 * Math.max(100, ...min.map((v, i) => max[i] - v))) /
        Math.min(1, this.w / this.h);
      this.controls.target.set(...(center as Vec));
      this.camera.position.set(
        center[0] + size * 1.1,
        center[1] - size * 1.5,
        center[2] + size * 1.35,
      );
      this.controls.update();
    }
    this.paint();
  }
  home() {
    this.scale = 1.3;
    this.offset = [0, 0];
    this.onZoom(130);
    this.paint();
  }
  paint() {
    if (this.mode === "3d") {
      this.paint3d();
      return;
    }
    const ctx = this.ctx,
      w = this.w,
      h = this.h,
      s = this.scale,
      ox = w / 2 + this.offset[0],
      oy = h / 2 + this.offset[1];
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fcfdfb";
    ctx.fillRect(0, 0, w, h);
    if (this.showGrid) {
      const gap =
        25 *
        s *
        Math.pow(10, Math.max(0, Math.ceil(Math.log10(12 / (25 * s)))));
      ctx.fillStyle = "#dce5df";
      for (let x = ((ox % gap) + gap) % gap; x < w; x += gap)
        for (let y = ((oy % gap) + gap) % gap; y < h; y += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      ctx.strokeStyle = "#e8eee9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox, 0);
      ctx.lineTo(ox, h);
      ctx.moveTo(0, oy);
      ctx.lineTo(w, oy);
      ctx.stroke();
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const seg of this.segments) {
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = seg.width;
      ctx.beginPath();
      ctx.moveTo(ox + seg.from[0] * s, oy - seg.from[1] * s);
      ctx.lineTo(ox + seg.to[0] * s, oy - seg.to[1] * s);
      ctx.stroke();
    }
    if (this.showTurtle) {
      ctx.save();
      ctx.translate(ox + this.position[0] * s, oy - this.position[1] * s);
      ctx.rotate(Math.atan2(this.heading[0], this.heading[1]));
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(8, 8);
      ctx.lineTo(0, 4);
      ctx.lineTo(-8, 8);
      ctx.closePath();
      ctx.fillStyle = "#16866a";
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }
  private paint3d() {
    if (!this.renderer || !this.camera || !this.scene) return;
    const grid = this.scene.getObjectByName("grid");
    if (grid) grid.visible = this.showGrid;
    if (this.turtle3) {
      this.turtle3.visible = this.showTurtle;
      this.turtle3.position.set(...this.position);
      this.turtle3.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(...this.heading).normalize(),
      );
    }
    this.renderer.render(this.scene, this.camera);
  }
}
