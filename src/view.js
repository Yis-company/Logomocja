export class DrawingView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mode = "2d";
    this.zoom = 1;
    this.pan = [0, 0];
    this.yaw = -0.55;
    this.pitch = 0.65;
    this.state = {
      segments: [],
      position: [0, 0, 0],
      heading: [0, 1, 0],
      right: [1, 0, 0],
      up: [0, 0, 1],
    };
    new ResizeObserver(() => this.draw()).observe(canvas);
    let pointers = new Map(),
      lastPinch = 0;
    canvas.addEventListener("pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      let prev = pointers.get(e.pointerId),
        dx = e.clientX - prev[0],
        dy = e.clientY - prev[1];
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      if (pointers.size === 2) {
        let a = [...pointers.values()],
          d = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]);
        if (lastPinch && d > 0)
          this.zoom = Math.max(
            0.0001,
            Math.min(20, (this.zoom * d) / lastPinch),
          );
        lastPinch = d;
      } else if (
        this.mode === "3d" &&
        !this.dragPan &&
        !e.shiftKey &&
        e.buttons !== 2
      ) {
        this.yaw += dx * 0.008;
        this.pitch = Math.max(-1.5, Math.min(1.5, this.pitch + dy * 0.008));
      } else {
        this.pan[0] += dx;
        this.pan[1] += dy;
      }
      this.draw();
    });
    const up = (e) => {
      pointers.delete(e.pointerId);
      lastPinch = 0;
    };
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.zoomBy(Math.exp(-e.deltaY * 0.001));
      },
      { passive: false },
    );
    canvas.addEventListener("keydown", (e) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "+",
          "-",
          "0",
        ].includes(e.key)
      ) {
        e.preventDefault();
        if (e.key === "+") this.zoomBy(1.2);
        else if (e.key === "-") this.zoomBy(1 / 1.2);
        else if (e.key === "0") this.fit();
        else if (e.shiftKey && this.mode === "3d") {
          this.yaw +=
            e.key === "ArrowLeft" ? -0.1 : e.key === "ArrowRight" ? 0.1 : 0;
          this.pitch = Math.max(
            -1.5,
            Math.min(
              1.5,
              this.pitch +
                (e.key === "ArrowUp" ? -0.1 : e.key === "ArrowDown" ? 0.1 : 0),
            ),
          );
          this.draw();
        } else {
          this.pan[0] +=
            e.key === "ArrowLeft" ? 20 : e.key === "ArrowRight" ? -20 : 0;
          this.pan[1] +=
            e.key === "ArrowUp" ? 20 : e.key === "ArrowDown" ? -20 : 0;
          this.draw();
        }
      }
    });
  }
  project(p) {
    if (this.mode === "2d") return [p[0], -p[1]];
    const c = Math.cos(this.yaw),
      s = Math.sin(this.yaw),
      x = p[0] * c - p[1] * s,
      y = p[0] * s + p[1] * c;
    return [x, -y * Math.sin(this.pitch) - p[2] * Math.cos(this.pitch)];
  }
  screen(p) {
    let a = this.project(p);
    return [
      this.w / 2 + this.pan[0] + a[0] * this.zoom,
      this.h / 2 + this.pan[1] + a[1] * this.zoom,
    ];
  }
  zoomBy(f) {
    this.zoom = Math.max(0.0001, Math.min(20, this.zoom * f));
    this.draw();
  }
  reset() {
    this.yaw = -0.55;
    this.pitch = 0.65;
    this.fit();
  }
  fit() {
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    let pts = this.state.segments.flatMap((s) => [
      this.project(s.from),
      this.project(s.to),
    ]);
    if (!pts.length) pts = [[0, 0]];
    let xs = pts.map((p) => p[0]),
      ys = pts.map((p) => p[1]),
      minx = Math.min(...xs),
      maxx = Math.max(...xs),
      miny = Math.min(...ys),
      maxy = Math.max(...ys);
    this.zoom = Math.min(
      (this.w - 100) / Math.max(100, maxx - minx),
      (this.h - 100) / Math.max(100, maxy - miny),
      2.4,
    );
    this.zoom = Math.max(0.0001, this.zoom);
    this.pan = [
      (-(minx + maxx) / 2) * this.zoom,
      (-(miny + maxy) / 2) * this.zoom,
    ];
    this.draw();
  }
  draw() {
    let c = this.ctx,
      dpr = devicePixelRatio || 1;
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    if (!this.w || !this.h) return;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    c.scale(dpr, dpr);
    const dark = document.documentElement.dataset.theme === "dark";
    c.fillStyle = dark ? "#1c2425" : "#fcfdf9";
    c.fillRect(0, 0, this.w, this.h);
    const line = (a, b, color, width = 1) => {
      a = this.screen(a);
      b = this.screen(b);
      c.beginPath();
      c.moveTo(...a);
      c.lineTo(...b);
      c.strokeStyle = color;
      c.lineWidth = width;
      c.stroke();
    };
    if (this.mode === "2d") {
      let step = 25 * this.zoom;
      while (step < 16) step *= 2;
      while (step > 70) step /= 2;
      let o = this.screen([0, 0, 0]);
      c.fillStyle = dark ? "#384443" : "#dce4db";
      for (let x = ((o[0] % step) + step) % step; x < this.w; x += step)
        for (let y = ((o[1] % step) + step) % step; y < this.h; y += step) {
          c.beginPath();
          c.arc(x, y, 0.85, 0, Math.PI * 2);
          c.fill();
        }
      line([-1e5, 0, 0], [1e5, 0, 0], dark ? "#35423f" : "#e3e9df");
      line([0, -1e5, 0], [0, 1e5, 0], dark ? "#35423f" : "#e3e9df");
    } else {
      for (let i = -400; i <= 400; i += 25) {
        line([i, -400, 0], [i, 400, 0], dark ? "#303d3b" : "#e2e8df");
        line([-400, i, 0], [400, i, 0], dark ? "#303d3b" : "#e2e8df");
      }
      for (let [p, col, label] of [
        [[120, 0, 0], "#bf7866", "X"],
        [[0, 120, 0], "#16866a", "Y"],
        [[0, 0, 120], "#6a87ba", "Z"],
      ]) {
        line([0, 0, 0], p, col);
        let a = this.screen(p);
        c.fillStyle = col;
        c.font = "11px monospace";
        c.fillText(label, a[0] + 5, a[1]);
      }
    }
    c.lineCap = "round";
    c.lineJoin = "round";
    for (let s of this.state.segments) line(s.from, s.to, s.color, s.width);
    let o = this.screen([0, 0, 0]);
    c.fillStyle = dark ? "#92a49b" : "#96a393";
    c.font = "10px monospace";
    c.fillText("0", o[0] + 6, o[1] + 14);
    c.beginPath();
    c.arc(o[0], o[1], 2, 0, Math.PI * 2);
    c.fill();
    let p = this.state.position,
      h = this.state.heading,
      r = this.state.right,
      u = this.state.up;
    const offset = (v, k) => p.map((x, i) => x + (v[i] * k) / this.zoom);
    let tip = this.screen(offset(h, 12)),
      left = this.screen(
        p.map((x, i) => x - (h[i] * 8) / this.zoom - (r[i] * 7) / this.zoom),
      ),
      right = this.screen(
        p.map((x, i) => x - (h[i] * 8) / this.zoom + (r[i] * 7) / this.zoom),
      );
    c.beginPath();
    c.moveTo(...tip);
    c.lineTo(...left);
    c.lineTo(...right);
    c.closePath();
    c.fillStyle = "#16866a";
    c.fill();
    c.strokeStyle = dark ? "#bcdfcc" : "#fff";
    c.lineWidth = 2;
    c.stroke();
    if (this.mode === "3d") line(p, offset(u, 20), "#9c73c2", 2);
    document
      .querySelector("#zoomValue")
      ?.replaceChildren(
        document.createTextNode(Math.round(this.zoom * 100) + "%"),
      );
  }
}
