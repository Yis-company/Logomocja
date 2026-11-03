import type { Mode, Segment, Turtle, Vec } from "./interpreter";
export class View {
  ctx: CanvasRenderingContext2D;
  mode: Mode = "2d";
  segments: Segment[] = [];
  turtle?: Turtle;
  scale = 1;
  pan = [0, 0];
  yaw = -0.65;
  elevation = 0.57;
  center: Vec = [0, 0, 0];
  width = 500;
  height = 500;
  grid = true;
  showTurtle = true;
  dark = false;
  constructor(
    public canvas: HTMLCanvasElement,
    interactive = true,
  ) {
    this.ctx = canvas.getContext("2d")!;
    new ResizeObserver(() => {
      this.resize();
      this.draw();
    }).observe(canvas);
    this.resize();
    if (interactive) this.interactions();
  }
  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.width = r.width || 250;
    this.height = r.height || 180;
    const d = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = this.width * d;
    this.canvas.height = this.height * d;
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  project(p: Vec): [number, number, number] {
    const [x, y, z] = p.map((v, i) => v - this.center[i]);
    if (this.mode === "2d") return [x, -y, z];
    const a = this.yaw,
      e = this.elevation;
    const xx = x * Math.cos(a) - y * Math.sin(a),
      yy = x * Math.sin(a) + y * Math.cos(a);
    return [
      xx,
      -yy * Math.sin(e) - z * Math.cos(e),
      yy * Math.cos(e) - z * Math.sin(e),
    ];
  }
  screen(p: Vec) {
    const v = this.project(p);
    return [
      this.width / 2 + this.pan[0] + v[0] * this.scale,
      this.height / 2 + this.pan[1] + v[1] * this.scale,
    ];
  }
  fit() {
    const points = this.segments.flatMap((s) => [s.from, s.to]);
    if (!points.length) {
      this.center = [0, 0, 0];
      this.pan = [0, 0];
      this.scale = 1;
      this.draw();
      return;
    }
    this.center = [0, 0, 0];
    const ps = points.map((p) => this.project(p)),
      xs = ps.map((p) => p[0]),
      ys = ps.map((p) => p[1]);
    const minX = Math.min(...xs),
      maxX = Math.max(...xs),
      minY = Math.min(...ys),
      maxY = Math.max(...ys);
    const padding = Math.min(60, Math.min(this.width, this.height) * 0.17);
    this.scale = Math.min(
      (this.width - padding * 2) / Math.max(maxX - minX, 20),
      (this.height - padding * 2) / Math.max(maxY - minY, 20),
      3,
    );
    this.scale = Math.max(0.001, this.scale);
    this.pan = [
      (-(minX + maxX) / 2) * this.scale,
      (-(minY + maxY) / 2) * this.scale,
    ];
    this.draw();
  }
  resetCamera() {
    this.yaw = -0.65;
    this.elevation = 0.57;
    this.fit();
  }
  zoom(f: number) {
    this.scale = Math.max(0.0001, Math.min(30, this.scale * f));
    this.draw();
  }
  line(a: Vec, b: Vec, color: string, width = 1) {
    const p = this.screen(a),
      q = this.screen(b);
    const c = this.ctx;
    c.beginPath();
    c.moveTo(p[0], p[1]);
    c.lineTo(q[0], q[1]);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.stroke();
  }
  draw() {
    const c = this.ctx,
      w = this.width,
      h = this.height;
    c.clearRect(0, 0, w, h);
    c.fillStyle = this.dark ? "#17251f" : "#ffffff";
    c.fillRect(0, 0, w, h);
    if (this.grid) {
      if (this.mode === "2d") {
        const spacing = 25 * this.scale;
        const step = spacing < 12 ? spacing * Math.ceil(18 / spacing) : spacing;
        c.fillStyle = this.dark ? "#35483d" : "#dce4df";
        const o = this.screen([0, 0, 0]);
        for (let x = ((o[0] % step) + step) % step; x < w; x += step)
          for (let y = ((o[1] % step) + step) % step; y < h; y += step) {
            c.beginPath();
            c.arc(x, y, 0.8, 0, Math.PI * 2);
            c.fill();
          }
      } else {
        const extent = Math.max(200, Math.min(20000, 600 / this.scale)),
          step = Math.pow(10, Math.floor(Math.log10(extent / 8)));
        for (let v = -extent; v <= extent; v += step) {
          this.line(
            [v, -extent, 0],
            [v, extent, 0],
            this.dark ? "#2c4034" : "#e7ede8",
          );
          this.line(
            [-extent, v, 0],
            [extent, v, 0],
            this.dark ? "#2c4034" : "#e7ede8",
          );
        }
        const length = 50 / this.scale;
        this.line([0, 0, 0], [length, 0, 0], "#ba6655", 1.5);
        this.line([0, 0, 0], [0, length, 0], "#16866a", 1.5);
        this.line([0, 0, 0], [0, 0, length], "#6789b3", 1.5);
        c.font = "11px Manrope";
        for (const [p, label, color] of [
          [[length, 0, 0], "X", "#ba6655"],
          [[0, length, 0], "Y", "#16866a"],
          [[0, 0, length], "Z", "#6789b3"],
        ] as [Vec, string, string][]) {
          const xy = this.screen(p);
          c.fillStyle = color;
          c.fillText(label, xy[0] + 5, xy[1] - 5);
        }
      }
      const o = this.screen([0, 0, 0]);
      c.strokeStyle = this.dark ? "#6a8273" : "#9aaea1";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(o[0] - 5, o[1]);
      c.lineTo(o[0] + 5, o[1]);
      c.moveTo(o[0], o[1] - 5);
      c.lineTo(o[0], o[1] + 5);
      c.stroke();
      c.fillStyle = this.dark ? "#91a89a" : "#718578";
      c.font = "10px Manrope";
      c.fillText("0", o[0] + 8, o[1] + 14);
    }
    const segments =
      this.mode === "3d"
        ? [...this.segments].sort(
            (a, b) => this.project(b.to)[2] - this.project(a.to)[2],
          )
        : this.segments;
    for (const s of segments) this.line(s.from, s.to, s.color, s.width);
    if (this.turtle && this.showTurtle) {
      const t = this.turtle,
        p = this.screen(t.position),
        hh = this.project(
          t.position.map((v, i) => v + t.heading[i] * 20) as Vec,
        ),
        pp = this.project(t.position);
      let dx = hh[0] - pp[0],
        dy = hh[1] - pp[1];
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      const rx = -dy,
        ry = dx;
      c.beginPath();
      c.moveTo(p[0] + dx * 12, p[1] + dy * 12);
      c.lineTo(p[0] - dx * 8 + rx * 7, p[1] - dy * 8 + ry * 7);
      c.lineTo(p[0] - dx * 4, p[1] - dy * 4);
      c.lineTo(p[0] - dx * 8 - rx * 7, p[1] - dy * 8 - ry * 7);
      c.closePath();
      c.fillStyle = this.dark ? "#53c5a0" : "#16866a";
      c.fill();
      c.strokeStyle = this.dark ? "#17251f" : "#fff";
      c.lineWidth = 1.5;
      c.stroke();
      if (this.mode === "3d") {
        this.line(
          t.position,
          t.position.map((v, i) => v + (t.up[i] * 18) / this.scale) as Vec,
          "#6789b3",
          2,
        );
        this.line(
          t.position,
          t.position.map((v, i) => v + (t.right[i] * 18) / this.scale) as Vec,
          "#ba6655",
          2,
        );
      }
    }
  }
  interactions() {
    let drag: { x: number; y: number; pan: boolean } | undefined;
    const pointers = new Map<number, [number, number]>();
    let pinch = 0;
    let midpoint: [number, number] = [0, 0];
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    this.canvas.addEventListener("pointerdown", (e) => {
      this.canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      drag = { x: e.clientX, y: e.clientY, pan: e.shiftKey || e.button === 2 };
      if (pointers.size === 2) {
        const p = [...pointers.values()];
        pinch = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
        midpoint = [(p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2];
      }
    });
    this.canvas.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId) || !drag) return;
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      if (pointers.size === 2) {
        const p = [...pointers.values()],
          d = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
        const mid: [number, number] = [
          (p[0][0] + p[1][0]) / 2,
          (p[0][1] + p[1][1]) / 2,
        ];
        this.pan[0] += mid[0] - midpoint[0];
        this.pan[1] += mid[1] - midpoint[1];
        midpoint = mid;
        if (pinch) this.zoom(d / pinch);
        pinch = d;
        drag.x = e.clientX;
        drag.y = e.clientY;
        return;
      }
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      if (this.mode === "2d" || drag.pan) {
        this.pan[0] += dx;
        this.pan[1] += dy;
      } else {
        this.yaw += dx * 0.008;
        this.elevation = Math.max(
          -1.5,
          Math.min(1.5, this.elevation + dy * 0.008),
        );
      }
      drag.x = e.clientX;
      drag.y = e.clientY;
      this.draw();
    });
    const end = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (!pointers.size) drag = undefined;
      pinch = 0;
    };
    this.canvas.addEventListener("pointerup", end);
    this.canvas.addEventListener("pointercancel", end);
    this.canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.zoom(Math.exp(-e.deltaY * 0.001));
      },
      { passive: false },
    );
    this.canvas.addEventListener("keydown", (e) => {
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "+",
        "-",
        "=",
        "0",
        "f",
        "F",
      ];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      if (["+", "="].includes(e.key)) this.zoom(1.2);
      else if (e.key === "-") this.zoom(1 / 1.2);
      else if (["0", "f", "F"].includes(e.key)) this.resetCamera();
      else if (this.mode === "3d" && !e.shiftKey) {
        if (e.key === "ArrowLeft") this.yaw -= 0.1;
        if (e.key === "ArrowRight") this.yaw += 0.1;
        if (e.key === "ArrowUp") this.elevation -= 0.1;
        if (e.key === "ArrowDown") this.elevation += 0.1;
      } else {
        if (e.key === "ArrowLeft") this.pan[0] -= 20;
        if (e.key === "ArrowRight") this.pan[0] += 20;
        if (e.key === "ArrowUp") this.pan[1] -= 20;
        if (e.key === "ArrowDown") this.pan[1] += 20;
      }
      this.draw();
    });
  }
}
