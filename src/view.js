export class DrawingView {
  constructor(
    canvas,
    { mode = "2d", interactive = true, onChange = () => {} } = {},
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mode = mode;
    this.onChange = onChange;
    this.scale = 1.5;
    this.pan = [0, 0];
    this.yaw = -0.55;
    this.elevation = 0.65;
    this.state = {
      segments: [],
      position: [0, 0, 0],
      heading: [0, 1, 0],
      right: [1, 0, 0],
      up: [0, 0, 1],
    };
    this.grid = true;
    this.size = [0, 0];
    this.observer = new ResizeObserver(() =>
      this.autoFit ? this.fit() : this.draw(),
    );
    this.observer.observe(canvas);
    if (interactive) this.bind();
  }
  project(p) {
    if (this.mode === "2d") return [p[0], -p[1]];
    const c = Math.cos(this.yaw),
      s = Math.sin(this.yaw),
      e = this.elevation;
    return [
      p[0] * c - p[1] * s,
      (p[0] * s + p[1] * c) * Math.sin(e) - p[2] * Math.cos(e),
    ];
  }
  screen(p) {
    const a = this.project(p);
    return [
      this.size[0] / 2 + this.pan[0] + a[0] * this.scale,
      this.size[1] / 2 + this.pan[1] + a[1] * this.scale,
    ];
  }
  fit() {
    this.autoFit = true;
    this.draw();
    const pts = this.state.segments.flatMap((s) => [s.from, s.to]);
    pts.push(this.state.position || [0, 0, 0]);
    const ps = pts.map((p) => this.project(p)),
      xs = ps.map((p) => p[0]),
      ys = ps.map((p) => p[1]);
    let minX = Math.min(...xs),
      maxX = Math.max(...xs),
      minY = Math.min(...ys),
      maxY = Math.max(...ys);
    this.scale = Math.min(
      (this.size[0] - Math.min(100, this.size[0] * 0.28)) /
        Math.max(80, maxX - minX),
      (this.size[1] - Math.min(100, this.size[1] * 0.28)) /
        Math.max(80, maxY - minY),
      5,
    );
    this.scale = Math.max(0.0005, this.scale);
    this.pan = [
      (-(minX + maxX) / 2) * this.scale,
      (-(minY + maxY) / 2) * this.scale,
    ];
    this.draw();
  }
  reset() {
    this.yaw = -0.55;
    this.elevation = 0.65;
    this.fit();
  }
  zoom(f) {
    this.autoFit = false;
    this.scale = Math.max(0.0005, Math.min(100, this.scale * f));
    this.draw();
  }
  draw({ exporting = false } = {}) {
    let rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    let dpr = Math.min(devicePixelRatio || 1, 2);
    this.size = [rect.width, rect.height];
    if (
      this.canvas.width !== Math.round(rect.width * dpr) ||
      this.canvas.height !== Math.round(rect.height * dpr)
    ) {
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
    }
    let c = this.ctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    let dark = document.documentElement.dataset.theme === "dark",
      bg = dark ? "#17221f" : "#fcfdfb",
      grid = dark ? "#2c3c35" : "#e6ece6",
      axis = dark ? "#78988a" : "#a6bbb0";
    c.fillStyle = bg;
    c.fillRect(0, 0, ...this.size);
    const line = (a, b, color, width = 1, dash = []) => {
      c.beginPath();
      c.strokeStyle = color;
      c.lineWidth = width;
      c.setLineDash(dash);
      c.moveTo(...this.screen(a));
      c.lineTo(...this.screen(b));
      c.stroke();
      c.setLineDash([]);
    };
    if (this.grid && !exporting) {
      if (this.mode === "2d") {
        let step = 25;
        while (step * this.scale < 18) step *= 2;
        while (step * this.scale > 70) step /= 2;
        let [w, h] = this.size;
        let x0 = (-w / 2 - this.pan[0]) / this.scale,
          x1 = (w / 2 - this.pan[0]) / this.scale,
          y0 = (-h / 2 - this.pan[1]) / this.scale,
          y1 = (h / 2 - this.pan[1]) / this.scale;
        for (let x = Math.ceil(x0 / step) * step; x < x1; x += step)
          line([x, -y0, 0], [x, -y1, 0], grid);
        for (let y = Math.ceil(y0 / step) * step; y < y1; y += step)
          line([x0, -y, 0], [x1, -y, 0], grid);
        line([x0, 0, 0], [x1, 0, 0], axis, 1, [4, 5]);
        line([0, -y0, 0], [0, -y1, 0], axis, 1, [4, 5]);
      } else {
        let extent = 250;
        for (let i = -extent; i <= extent; i += 25) {
          line([i, -extent, 0], [i, extent, 0], grid);
          line([-extent, i, 0], [extent, i, 0], grid);
        }
        line([0, 0, 0], [150, 0, 0], "#b46a58", 1.4);
        line([0, 0, 0], [0, 150, 0], "#40886a", 1.4);
        line([0, 0, 0], [0, 0, 150], "#5b87b0", 1.4);
        c.font = '11px "Inter Variable",system-ui';
        for (const [p, label, color] of [
          [[160, 0, 0], "X", "#b46a58"],
          [[0, 160, 0], "Y", "#40886a"],
          [[0, 0, 160], "Z", "#5b87b0"],
        ]) {
          c.fillStyle = dark
            ? { X: "#d8aa9e", Y: "#94c4a4", Z: "#a5bfdb" }[label]
            : { X: "#935344", Y: "#286b4b", Z: "#3e678f" }[label];
          c.fillText(label, ...this.screen(p));
        }
      }
      const origin = this.screen([0, 0, 0]);
      c.fillStyle = dark ? "#a0b1a5" : "#617167";
      c.font = '10px "Inter Variable",system-ui';
      c.fillText("0", origin[0] + 7, origin[1] + 14);
      c.beginPath();
      c.arc(...origin, 3, 0, Math.PI * 2);
      c.fill();
    }
    c.lineCap = "round";
    c.lineJoin = "round";
    for (const s of this.state.segments)
      line(
        s.from,
        s.to,
        s.color,
        Math.max(0.7, s.width * Math.min(1.4, Math.max(0.6, this.scale / 1.5))),
      );
    if (!exporting && this.state.position) {
      let p = this.state.position,
        unit = 14 / this.scale;
      const offset = (h, a, r = 0) =>
          p.map((v, i) => v + h[i] * a * unit + this.state.right[i] * r * unit),
        tip = this.screen(offset(this.state.heading, 1)),
        a = this.screen(offset(this.state.heading, -0.65, 0.6)),
        b = this.screen(offset(this.state.heading, -0.65, -0.6));
      c.beginPath();
      c.moveTo(...tip);
      c.lineTo(...a);
      c.lineTo(...b);
      c.closePath();
      c.fillStyle = dark ? "#7cc9a7" : "#16866a";
      c.fill();
      c.strokeStyle = bg;
      c.lineWidth = 2;
      c.stroke();
      if (this.mode === "3d") line(p, offset(this.state.up, 1.6), "#6d8fca", 2);
    }
    this.onChange();
  }
  bind() {
    const el = this.canvas;
    let pointers = new Map(),
      drag,
      dist = 0,
      pinchCenter = null;
    el.addEventListener("pointerdown", (e) => {
      this.autoFit = false;
      el.focus();
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      drag = [e.clientX, e.clientY];
      if (pointers.size === 2) {
        const p = [...pointers.values()];
        dist = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
        pinchCenter = [(p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2];
      }
    });
    el.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      if (pointers.size === 2) {
        const p = [...pointers.values()],
          d = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
        const center = [(p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2];
        if (pinchCenter) {
          this.pan[0] += center[0] - pinchCenter[0];
          this.pan[1] += center[1] - pinchCenter[1];
        }
        pinchCenter = center;
        if (dist) this.zoom(d / dist);
        dist = d;
        drag = [e.clientX, e.clientY];
        return;
      }
      let dx = e.clientX - drag[0],
        dy = e.clientY - drag[1];
      if (this.mode === "3d" && !e.shiftKey && e.buttons !== 2) {
        this.yaw += dx * 0.008;
        this.elevation = Math.max(
          -1.5,
          Math.min(1.5, this.elevation + dy * 0.008),
        );
      } else {
        this.pan[0] += dx;
        this.pan[1] += dy;
      }
      drag = [e.clientX, e.clientY];
      this.draw();
    });
    const end = (e) => {
      pointers.delete(e.pointerId);
      drag = pointers.size ? [...pointers.values()][0] : null;
      dist = 0;
      pinchCenter = null;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("contextmenu", (e) => e.preventDefault());
    el.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.zoom(Math.exp(-e.deltaY * 0.001));
      },
      { passive: false },
    );
    el.addEventListener("keydown", (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        this.autoFit = false;
        let x = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0,
          y = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
        if (this.mode === "3d" && !e.shiftKey) {
          this.yaw += x * 0.12;
          this.elevation = Math.max(
            -1.5,
            Math.min(1.5, this.elevation + y * 0.1),
          );
        } else {
          this.pan[0] += x * 20;
          this.pan[1] += y * 20;
        }
        this.draw();
      }
      if (e.key === "+" || e.key === "=") this.zoom(1.2);
      if (e.key === "-") this.zoom(1 / 1.2);
      if (e.key === "0") this.reset();
    });
  }
}
