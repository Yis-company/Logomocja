import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Segment, Turtle, Vec, Mode } from "./interpreter";
export class DrawingView {
  mode: Mode = "2d";
  segments: Segment[] = [];
  turtle?: Turtle;
  canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  scale = 1;
  private offset = { x: 0, y: 0 };
  private w = 1;
  private h = 1;
  private dragging = false;
  private last = { x: 0, y: 0 };
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private controls?: OrbitControls;
  private strokes?: THREE.Group;
  private marker?: THREE.Group;
  private grid?: THREE.GridHelper;
  private axes?: THREE.AxesHelper;
  private builtSegments: Segment[] = [];
  private threeAttempted = false;
  available3D = true;
  failure = "";
  private dark = false;
  onChange?: () => void;
  constructor(private container: HTMLElement) {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "drawing-canvas";
    this.canvas.setAttribute(
      "aria-label",
      "Rysunek żółwia. Przeciągnij, aby przesunąć; użyj kółka, aby powiększyć.",
    );
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute("role", "img");
    container.append(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.addEventListener("pointerdown", (e) => {
      if (this.mode !== "2d") return;
      this.dragging = true;
      this.last = { x: e.clientX, y: e.clientY };
      this.canvas.setPointerCapture(e.pointerId);
    });
    this.canvas.addEventListener("pointermove", (e) => {
      if (!this.dragging) return;
      this.offset.x += e.clientX - this.last.x;
      this.offset.y += e.clientY - this.last.y;
      this.last = { x: e.clientX, y: e.clientY };
      this.draw();
    });
    this.canvas.addEventListener("pointerup", () => (this.dragging = false));
    this.canvas.addEventListener(
      "pointercancel",
      () => (this.dragging = false),
    );
    this.canvas.addEventListener(
      "wheel",
      (e) => {
        if (this.mode !== "2d") return;
        e.preventDefault();
        const r = this.canvas.getBoundingClientRect();
        this.zoom(
          Math.exp(-e.deltaY * 0.001),
          e.clientX - r.left,
          e.clientY - r.top,
        );
      },
      { passive: false },
    );
    this.canvas.addEventListener("keydown", (e) => {
      const offsets: Record<string, [number, number]> = {
        ArrowLeft: [30, 0],
        ArrowRight: [-30, 0],
        ArrowUp: [0, 30],
        ArrowDown: [0, -30],
      };
      if (offsets[e.key]) {
        e.preventDefault();
        const [x, y] = offsets[e.key];
        this.offset.x += x;
        this.offset.y += y;
        this.draw();
      }
      if (e.key === "+" || e.key === "=") this.zoom(1.2);
      if (e.key === "-") this.zoom(1 / 1.2);
    });
    new ResizeObserver(() => this.resize()).observe(container);
    this.resize();
  }
  private resize() {
    const r = this.container.getBoundingClientRect();
    const oldW = this.w,
      oldH = this.h;
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    if (oldW === 1) this.offset = { x: this.w / 2, y: this.h / 2 };
    else {
      this.offset.x += (this.w - oldW) / 2;
      this.offset.y += (this.h - oldH) / 2;
    }
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    if (this.renderer) {
      this.renderer.setSize(this.w, this.h);
      this.camera!.aspect = this.w / this.h;
      this.camera!.updateProjectionMatrix();
    }
    this.draw();
  }
  setTheme(dark: boolean) {
    this.dark = dark;
    if (this.scene) {
      this.scene.background = new THREE.Color(dark ? "#1b2624" : "#fbfcf9");
      this.grid?.geometry.dispose();
      this.grid?.material && (this.grid.material as THREE.Material).dispose();
      if (this.grid) this.scene.remove(this.grid);
      this.addGrid();
    }
    this.draw();
  }
  setMode(mode: Mode) {
    this.mode = mode;
    if (mode === "3d") this.init3D();
    this.canvas.style.display =
      mode === "2d" || !this.available3D ? "block" : "none";
    if (this.renderer)
      this.renderer.domElement.style.display =
        mode === "3d" && this.available3D ? "block" : "none";
    this.draw();
  }
  private addGrid() {
    if (!this.scene) return;
    this.grid = new THREE.GridHelper(
      2000,
      80,
      this.dark ? 0x49615a : 0xc8d6cb,
      this.dark ? 0x2b3b35 : 0xe7ece4,
    );
    this.grid.rotation.x = Math.PI / 2;
    this.grid.position.z = -0.15;
    this.scene.add(this.grid);
  }
  private init3D() {
    if (this.threeAttempted) return;
    this.threeAttempted = true;
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
      });
      this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      this.renderer.setSize(this.w, this.h);
      this.renderer.domElement.className = "drawing-canvas";
      this.renderer.domElement.tabIndex = 0;
      this.renderer.domElement.setAttribute(
        "aria-label",
        "Rysunek 3D. Przeciągnij, aby obrócić; prawy przycisk przesuwa; kółko powiększa.",
      );
      this.container.append(this.renderer.domElement);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(
        this.dark ? "#1b2624" : "#fbfcf9",
      );
      this.camera = new THREE.PerspectiveCamera(
        38,
        this.w / this.h,
        0.1,
        2000000,
      );
      this.camera.up.set(0, 0, 1);
      this.camera.position.set(300, -400, 340);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = false;
      this.controls.minDistance = 2;
      this.controls.maxDistance = 400000;
      this.controls.listenToKeyEvents(this.renderer.domElement);
      this.controls.addEventListener("change", () => this.render3D());
      this.addGrid();
      this.axes = new THREE.AxesHelper(100);
      this.scene.add(this.axes);
      this.strokes = new THREE.Group();
      this.scene.add(this.strokes);
      this.marker = new THREE.Group();
      this.scene.add(this.marker);
      this.renderer.domElement.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        this.failure =
          "Kontekst WebGL został utracony. Odśwież stronę, aby ponownie włączyć 3D.";
        this.available3D = false;
        this.onChange?.();
      });
    } catch {
      this.available3D = false;
      this.failure =
        "Przeglądarka nie udostępnia WebGL. Rysowanie 2D nadal działa; do przestrzeni 3D użyj przeglądarki z włączoną akceleracją sprzętową.";
    }
  }
  update(segments: Segment[], turtle: Turtle) {
    this.segments = segments;
    this.turtle = turtle;
    if (this.mode === "3d" && this.available3D) this.rebuild3D();
    this.draw();
  }
  private disposeGroup(group: THREE.Group) {
    while (group.children.length) {
      const object = group.children[0];
      group.remove(object);
      object.traverse((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((m) => m?.dispose());
      });
    }
  }
  private rebuild3D() {
    if (!this.strokes || !this.marker) return;
    const kept = this.builtSegments.length;
    if (
      kept > this.segments.length ||
      (kept && this.builtSegments[kept - 1] !== this.segments[kept - 1])
    ) {
      this.disposeGroup(this.strokes);
      this.builtSegments = [];
    }
    this.disposeGroup(this.marker);
    // Cylinders preserve pen widths on WebGL implementations that only support one-pixel lines.
    const unit = new THREE.Vector3(0, 1, 0);
    for (const s of this.segments.slice(this.builtSegments.length)) {
      const from = new THREE.Vector3(...s.from),
        to = new THREE.Vector3(...s.to),
        d = to.clone().sub(from),
        len = d.length();
      if (len < 1e-12) continue;
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(s.width * 0.25, s.width * 0.25, len, 5),
        new THREE.MeshBasicMaterial({ color: s.color }),
      );
      mesh.position.copy(from.add(to).multiplyScalar(0.5));
      mesh.quaternion.setFromUnitVectors(unit, d.normalize());
      this.strokes.add(mesh);
    }
    this.builtSegments = this.segments.slice();
    if (this.turtle) {
      const t = this.turtle,
        pos = new THREE.Vector3(...t.position);
      const head = new THREE.Mesh(
        new THREE.ConeGeometry(4, 12, 3),
        new THREE.MeshBasicMaterial({
          color: this.dark ? 0x79d4b5 : 0x136c54,
          side: THREE.DoubleSide,
        }),
      );
      head.position.copy(pos);
      head.quaternion.setFromRotationMatrix(
        new THREE.Matrix4().makeBasis(
          new THREE.Vector3(...t.right),
          new THREE.Vector3(...t.heading),
          new THREE.Vector3(...t.up),
        ),
      );
      this.marker.add(head);
      for (const [v, c] of [
        [t.heading, 0x16866a],
        [t.right, 0xc1763d],
        [t.up, 0x528ac2],
      ] as [Vec, number][])
        this.marker.add(
          new THREE.ArrowHelper(new THREE.Vector3(...v), pos, 21, c, 5, 2),
        );
    }
  }
  private render3D() {
    if (this.renderer && this.scene && this.camera)
      this.renderer.render(this.scene, this.camera);
  }
  draw() {
    if (this.mode === "3d" && this.available3D) {
      this.render3D();
      return;
    }
    const ctx = this.ctx,
      dpr = Math.min(devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = this.dark ? "#1b2624" : "#fbfcf9";
    ctx.fillRect(0, 0, this.w, this.h);
    const spacing = 24;
    ctx.fillStyle = this.dark ? "#34463f" : "#dce3d9";
    const gx = ((this.offset.x % spacing) + spacing) % spacing,
      gy = ((this.offset.y % spacing) + spacing) % spacing;
    for (let x = gx; x < this.w; x += spacing)
      for (let y = gy; y < this.h; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    ctx.strokeStyle = this.dark ? "#3b5147" : "#d6dfd2";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, this.offset.y);
    ctx.lineTo(this.w, this.offset.y);
    ctx.moveTo(this.offset.x, 0);
    ctx.lineTo(this.offset.x, this.h);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = this.dark ? "#92a79c" : "#9da99b";
    ctx.font = "10px monospace";
    ctx.fillText("0, 0", this.offset.x + 8, this.offset.y + 16);
    for (const s of this.segments) {
      ctx.beginPath();
      ctx.moveTo(
        this.offset.x + s.from[0] * this.scale,
        this.offset.y - s.from[1] * this.scale,
      );
      ctx.lineTo(
        this.offset.x + s.to[0] * this.scale,
        this.offset.y - s.to[1] * this.scale,
      );
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }
    if (this.turtle) {
      const t = this.turtle;
      ctx.save();
      ctx.translate(
        this.offset.x + t.position[0] * this.scale,
        this.offset.y - t.position[1] * this.scale,
      );
      ctx.rotate(Math.atan2(t.heading[0], t.heading[1]));
      ctx.fillStyle = this.dark ? "#8bd8bb" : "#176a52";
      ctx.strokeStyle = this.dark ? "#1b2624" : "#fbfcf9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(7, 7);
      ctx.lineTo(0, 4);
      ctx.lineTo(-7, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    this.onChange?.();
  }
  fit() {
    this.resize();
    const points = this.segments.flatMap((s) => [s.from, s.to]);
    if (this.turtle) points.push(this.turtle.position);
    if (!points.length) points.push([0, 0, 0]);
    const mins: Vec = [Infinity, Infinity, Infinity],
      maxs: Vec = [-Infinity, -Infinity, -Infinity];
    for (const p of points)
      for (let i = 0; i < 3; i++) {
        mins[i] = Math.min(mins[i], p[i]);
        maxs[i] = Math.max(maxs[i], p[i]);
      }
    if (this.mode === "2d" || !this.available3D) {
      const dx = Math.max(60, maxs[0] - mins[0]),
        dy = Math.max(60, maxs[1] - mins[1]);
      this.scale = Math.max(
        0.0001,
        Math.min((this.w - 110) / dx, (this.h - 110) / dy, 3),
      );
      this.offset = {
        x: this.w / 2 - ((mins[0] + maxs[0]) / 2) * this.scale,
        y: this.h / 2 + ((mins[1] + maxs[1]) / 2) * this.scale,
      };
    } else if (this.controls && this.camera) {
      const center = new THREE.Vector3(...mins)
        .add(new THREE.Vector3(...maxs))
        .multiplyScalar(0.5);
      const radius = Math.max(
        45,
        Math.hypot(...maxs.map((v, i) => v - mins[i])) / 2,
      );
      const distance =
        ((radius / Math.sin((19 * Math.PI) / 180)) * 1.25) /
        Math.min(1, this.w / this.h);
      this.controls.target.copy(center);
      this.camera.position.copy(
        center
          .clone()
          .add(
            new THREE.Vector3(0.9, -1.3, 1)
              .normalize()
              .multiplyScalar(distance),
          ),
      );
      this.controls.update();
      this.rebuild3D();
    }
    this.draw();
  }
  zoom(factor: number, x = this.w / 2, y = this.h / 2) {
    if (this.mode === "3d" && this.camera && this.controls) {
      this.camera.position
        .sub(this.controls.target)
        .multiplyScalar(1 / factor)
        .add(this.controls.target);
      this.controls.update();
      this.draw();
      return;
    }
    const next = Math.max(0.0001, Math.min(20, this.scale * factor)),
      ratio = next / this.scale;
    this.offset.x = x + (this.offset.x - x) * ratio;
    this.offset.y = y + (this.offset.y - y) * ratio;
    this.scale = next;
    this.draw();
  }
  orbit(horizontal: number, vertical = 0) {
    if (!this.camera || !this.controls) return;
    const delta = this.camera.position.clone().sub(this.controls.target);
    const spherical = new THREE.Spherical().setFromVector3(
      new THREE.Vector3(delta.x, delta.z, delta.y),
    );
    spherical.theta += horizontal;
    spherical.phi = Math.max(
      0.1,
      Math.min(Math.PI - 0.1, spherical.phi + vertical),
    );
    const d = new THREE.Vector3().setFromSpherical(spherical);
    this.camera.position
      .copy(this.controls.target)
      .add(new THREE.Vector3(d.x, d.z, d.y));
    this.controls.update();
    this.draw();
  }
  resetCamera() {
    this.scale = 1;
    this.offset = { x: this.w / 2, y: this.h / 2 };
    if (this.mode === "3d") this.fit();
    this.draw();
  }
  exportPNG() {
    this.draw();
    return this.mode === "3d" && this.available3D && this.renderer
      ? this.renderer.domElement.toDataURL("image/png")
      : this.canvas.toDataURL("image/png");
  }
}
