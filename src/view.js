export class View {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mode = "2d";
    this.scale = 1.5;
    this.offset = [0, 0];
    this.yaw = -0.55;
    this.tilt = 0.65;
    this.segments = [];
    this.state = null;
    new ResizeObserver(() => this.draw()).observe(canvas);
    let last;
    canvas.addEventListener("pointerdown", (e) => {
      last = [e.clientX, e.clientY];
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointerup", () => (last = null));
    canvas.addEventListener("pointermove", (e) => {
      if (!last) return;
      let dx = e.clientX - last[0],
        dy = e.clientY - last[1];
      last = [e.clientX, e.clientY];
      if (this.mode === "3d" && !e.shiftKey && !this.pan) {
        this.yaw += dx * 0.01;
        this.tilt = Math.max(-1.5, Math.min(1.5, this.tilt + dy * 0.01));
      } else {
        this.offset[0] += dx;
        this.offset[1] += dy;
      }
      this.draw();
    });
    canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.zoom(Math.exp(-e.deltaY * 0.001));
      },
      { passive: false },
    );
    canvas.addEventListener("keydown", (e) => {
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "-"].includes(
          e.key,
        )
      ) {
        e.preventDefault();
        if (e.key === "+") this.zoom(1.2);
        else if (e.key === "-") this.zoom(1 / 1.2);
        else {
          let x = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0,
            y = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
          if (this.mode === "3d" && !e.shiftKey && !this.pan) {
            this.yaw += x * 0.1;
            this.tilt += y * 0.1;
          } else {
            this.offset[0] += x * 20;
            this.offset[1] += y * 20;
          }
          this.draw();
        }
      }
    });
  }
  project(p) {
    if (this.mode === "2d") return [p[0], -p[1]];
    let c = Math.cos(this.yaw),
      s = Math.sin(this.yaw),
      x = p[0] * c - p[1] * s,
      y = p[0] * s + p[1] * c;
    return [x, -y * Math.sin(this.tilt) - p[2] * Math.cos(this.tilt)];
  }
  zoom(n) {
    this.scale = Math.max(0.05, Math.min(30, this.scale * n));
    this.draw();
  }
  reset() {
    this.yaw = -0.55;
    this.tilt = 0.65;
    this.fit();
  }
  fit() {
    let points = this.segments.flatMap((s) => [
      this.project(s.from),
      this.project(s.to),
    ]);
    if (!points.length)
      points = [
        [0, 0],
        [120, -120],
      ];
    let xs = points.map((p) => p[0]),
      ys = points.map((p) => p[1]),
      minX = Math.min(...xs),
      maxX = Math.max(...xs),
      minY = Math.min(...ys),
      maxY = Math.max(...ys);
    let w = this.canvas.clientWidth,
      h = this.canvas.clientHeight;
    this.scale = Math.min(
      (w - 120) / Math.max(80, maxX - minX),
      (h - 120) / Math.max(80, maxY - minY),
      3,
    );
    this.offset = [
      (-(minX + maxX) / 2) * this.scale,
      (-(minY + maxY) / 2) * this.scale,
    ];
    this.draw();
  }
  draw() {
    let c = this.canvas,
      ctx = this.ctx,
      w = c.clientWidth,
      h = c.clientHeight;
    if (!w || !h) return;
    let d = devicePixelRatio || 1;
    c.width = w * d;
    c.height = h * d;
    ctx.scale(d, d);
    let dark = document.documentElement.dataset.theme === "dark";
    ctx.fillStyle = dark ? "#19231f" : "#fcfcf8";
    ctx.fillRect(0, 0, w, h);
    let screen = (p) => {
      let q = this.project(p);
      return [
        w / 2 + this.offset[0] + q[0] * this.scale,
        h / 2 + this.offset[1] + q[1] * this.scale,
      ];
    };
    let line = (a, b, color, width = 1) => {
      ctx.beginPath();
      ctx.moveTo(...screen(a));
      ctx.lineTo(...screen(b));
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    };
    let grid = dark ? "#2a3830" : "#e9ede6";
    if (this.mode === "2d") {
      ctx.fillStyle = dark ? "#34483a" : "#dce4d9";
      let gap = 25 * this.scale;
      while (gap < 14) gap *= 2;
      for (
        let x = (((w / 2 + this.offset[0]) % gap) + gap) % gap;
        x < w;
        x += gap
      )
        for (
          let y = (((h / 2 + this.offset[1]) % gap) + gap) % gap;
          y < h;
          y += gap
        ) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, 7);
          ctx.fill();
        }
    } else {
      for (let i = -500; i <= 500; i += 50) {
        line([i, -500, 0], [i, 500, 0], grid);
        line([-500, i, 0], [500, i, 0], grid);
      }
      line([0, 0, 0], [100, 0, 0], "#cf8677");
      line([0, 0, 0], [0, 100, 0], "#74a787");
      line([0, 0, 0], [0, 0, 100], "#7a9ec9");
      ctx.font = "11px monospace";
      for (let [label, p] of [
        ["X", [110, 0, 0]],
        ["Y", [0, 110, 0]],
        ["Z", [0, 0, 110]],
      ]) {
        ctx.fillStyle = "#8b9991";
        ctx.fillText(label, ...screen(p));
      }
    }
    let o = screen([0, 0, 0]);
    ctx.strokeStyle = "#abb7aa";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(o[0] - 6, o[1]);
    ctx.lineTo(o[0] + 6, o[1]);
    ctx.moveTo(o[0], o[1] - 6);
    ctx.lineTo(o[0], o[1] + 6);
    ctx.stroke();
    ctx.fillStyle = "#97a08e";
    ctx.font = "10px monospace";
    ctx.fillText("0, 0", o[0] + 9, o[1] + 14);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let s of this.segments) line(s.from, s.to, s.color, s.width);
    if (this.state) {
      let t = this.state,
        p = t.pos,
        len = 13 / this.scale;
      let points = [
        [1, 0],
        [-0.6, 0.65],
        [-0.35, 0],
        [-0.6, -0.65],
      ].map(([a, b]) =>
        screen(p.map((v, i) => v + len * (a * t.heading[i] + b * t.right[i]))),
      );
      ctx.beginPath();
      points.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p)));
      ctx.closePath();
      ctx.fillStyle = "#16866a";
      ctx.fill();
      ctx.strokeStyle = dark ? "#19231f" : "white";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (this.mode === "3d")
        line(
          p,
          p.map((v, i) => v + (t.up[i] * 18) / this.scale),
          "#d39b4e",
          2,
        );
    }
  }
}
