import { Machine, Vec } from "./interpreter";
export class View {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mode = "2d";
  scale = 1;
  pan = [0, 0];
  yaw = -0.65;
  tilt = 0.65;
  machine: Machine;
  drag: any = null;
  panMode = false;
  constructor(canvas: HTMLCanvasElement, m: Machine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.machine = m;
    new ResizeObserver(() => this.fit()).observe(canvas);
    canvas.onpointerdown = (e) => {
      this.drag = {
        x: e.clientX,
        y: e.clientY,
        pan: this.panMode || e.shiftKey || e.button === 2,
      };
      canvas.setPointerCapture(e.pointerId);
    };
    canvas.onpointermove = (e) => {
      if (!this.drag) return;
      let dx = e.clientX - this.drag.x,
        dy = e.clientY - this.drag.y;
      if (this.mode === "3d" && !this.drag.pan) {
        this.yaw += dx * 0.008;
        this.tilt = Math.max(-1.5, Math.min(1.5, this.tilt + dy * 0.008));
      } else {
        this.pan[0] += dx;
        this.pan[1] += dy;
      }
      this.drag.x = e.clientX;
      this.drag.y = e.clientY;
      this.draw();
    };
    canvas.onpointerup = () => (this.drag = null);
    canvas.oncontextmenu = (e) => e.preventDefault();
    canvas.onwheel = (e) => {
      e.preventDefault();
      this.scale = Math.max(
        0.015,
        Math.min(30, this.scale * Math.exp(-e.deltaY * 0.001)),
      );
      this.draw();
    };
    canvas.ondblclick = () => this.fit();
    canvas.onkeydown = (e) => {
      if (e.key === "+" || e.key === "=") this.zoom(1.2);
      if (e.key === "-") this.zoom(1 / 1.2);
      if (e.key.startsWith("Arrow") && e.altKey && this.mode === "3d") {
        e.preventDefault();
        if (e.key === "ArrowLeft") this.yaw -= 0.12;
        if (e.key === "ArrowRight") this.yaw += 0.12;
        if (e.key === "ArrowUp") this.tilt = Math.min(1.5, this.tilt + 0.12);
        if (e.key === "ArrowDown") this.tilt = Math.max(-1.5, this.tilt - 0.12);
        this.draw();
        return;
      }
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        this.pan[e.key === "ArrowLeft" || e.key === "ArrowRight" ? 0 : 1] +=
          e.key === "ArrowLeft" || e.key === "ArrowUp" ? 20 : -20;
        this.draw();
      }
    };
  }
  project(v: Vec) {
    if (this.mode === "2d") return [v[0], -v[1]];
    let x = v[0] * Math.cos(this.yaw) - v[1] * Math.sin(this.yaw),
      y = v[0] * Math.sin(this.yaw) + v[1] * Math.cos(this.yaw);
    return [x, -y * Math.sin(this.tilt) - v[2] * Math.cos(this.tilt)];
  }
  zoom(f: number) {
    this.scale *= f;
    this.draw();
  }
  reset() {
    this.yaw = -0.65;
    this.tilt = 0.65;
    this.fit();
  }
  fit() {
    if (this.canvas.clientWidth < 130 || this.canvas.clientHeight < 130) return;
    let points = this.machine.segments.flatMap((s) => [
      this.project(s.from),
      this.project(s.to),
    ]);
    if (!points.length) points = [[0, 0], this.project(this.machine.position)];
    let xs = points.map((p) => p[0]),
      ys = points.map((p) => p[1]),
      minx = Math.min(...xs),
      maxx = Math.max(...xs),
      miny = Math.min(...ys),
      maxy = Math.max(...ys);
    this.scale = Math.min(
      (this.canvas.clientWidth - 120) / Math.max(maxx - minx, 100),
      (this.canvas.clientHeight - 120) / Math.max(maxy - miny, 100),
      2.4,
    );
    this.pan = [
      (-(minx + maxx) / 2) * this.scale,
      (-(miny + maxy) / 2) * this.scale,
    ];
    this.draw();
  }
  draw() {
    this.canvas.dispatchEvent(
      new CustomEvent("viewchange", { detail: this.scale }),
    );
    let w = this.canvas.clientWidth,
      h = this.canvas.clientHeight;
    if (!w || !h) return;
    let d = devicePixelRatio || 1;
    this.canvas.width = w * d;
    this.canvas.height = h * d;
    let c = this.ctx;
    c.scale(d, d);
    let dark = document.documentElement.dataset.theme === "dark";
    c.fillStyle = dark ? "#202b2a" : "#fcfcf8";
    c.fillRect(0, 0, w, h);
    const screen = (p: Vec) => {
      let a = this.project(p);
      return [
        w / 2 + this.pan[0] + a[0] * this.scale,
        h / 2 + this.pan[1] + a[1] * this.scale,
      ];
    };
    const line = (a: Vec, b: Vec, color: string, width = 1) => {
      let p = screen(a),
        q = screen(b);
      c.strokeStyle = color;
      c.lineWidth = width;
      c.beginPath();
      c.moveTo(...(p as [number, number]));
      c.lineTo(...(q as [number, number]));
      c.stroke();
    };
    let grid = dark ? "#34413d" : "#e8ece5";
    if (this.mode === "2d") {
      let step = 25 * this.scale;
      while (step < 18) step *= 2;
      while (step > 65) step /= 2;
      c.fillStyle = dark ? "#46534c" : "#d8dfd4";
      for (let x = (w / 2 + this.pan[0]) % step; x < w; x += step)
        for (let y = (h / 2 + this.pan[1]) % step; y < h; y += step) {
          c.beginPath();
          c.arc(x, y, 0.8, 0, 7);
          c.fill();
        }
    } else {
      for (let i = -500; i <= 500; i += 25) {
        line([i, -500, 0], [i, 500, 0], grid);
        line([-500, i, 0], [500, i, 0], grid);
      }
      line([0, 0, 0], [100, 0, 0], "#bd7167");
      line([0, 0, 0], [0, 100, 0], "#6b9c7d");
      line([0, 0, 0], [0, 0, 100], "#6e91bd");
    }
    let origin = screen([0, 0, 0]);
    c.strokeStyle = dark ? "#89958c" : "#adb7aa";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(origin[0] - 6, origin[1]);
    c.lineTo(origin[0] + 6, origin[1]);
    c.moveTo(origin[0], origin[1] - 6);
    c.lineTo(origin[0], origin[1] + 6);
    c.stroke();
    c.font = "10px LogoMono";
    c.fillStyle = dark ? "#a9b8af" : "#8a9586";
    c.fillText("0, 0", origin[0] + 9, origin[1] + 15);
    c.lineCap = "round";
    for (const s of this.machine.segments) line(s.from, s.to, s.color, s.width);
    let pos = this.machine.position,
      p = screen(pos),
      head = screen(
        pos.map(
          (v, i) => v + (this.machine.heading[i] * 15) / this.scale,
        ) as Vec,
      ),
      angle = Math.atan2(head[1] - p[1], head[0] - p[0]);
    c.save();
    c.translate(p[0], p[1]);
    c.rotate(angle);
    c.beginPath();
    c.moveTo(12, 0);
    c.lineTo(-8, -7);
    c.lineTo(-5, 0);
    c.lineTo(-8, 7);
    c.closePath();
    c.fillStyle = "#16866a";
    c.fill();
    c.strokeStyle = dark ? "#d2e8dc" : "white";
    c.lineWidth = 2;
    c.stroke();
    c.restore();
    if (this.mode === "3d")
      line(
        pos,
        pos.map((v, i) => v + (this.machine.up[i] * 20) / this.scale) as Vec,
        "#a478c0",
        2,
      );
  }
}
