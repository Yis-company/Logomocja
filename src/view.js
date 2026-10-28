export class TurtleView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mode = "2d";
    this.scale = 1.8;
    this.offset = [0, 0];
    this.yaw = -0.65;
    this.elevation = 0.62;
    this.state = {
      segments: [],
      pos: [0, 0, 0],
      heading: [0, 1, 0],
      right: [1, 0, 0],
      up: [0, 0, 1],
    };
    this.dragMode = "orbit";
    this.pointers = new Map();
    new ResizeObserver(() => this.draw()).observe(canvas);
    canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.zoom(Math.exp(-e.deltaY * 0.001));
      },
      { passive: false },
    );
    canvas.addEventListener("pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, [e.clientX, e.clientY]);
      canvas.focus();
    });
    canvas.addEventListener("pointermove", (e) => {
      const old = this.pointers.get(e.pointerId);
      if (!old) return;
      let dx = e.clientX - old[0],
        dy = e.clientY - old[1];
      if (this.pointers.size === 2) {
        const other = [...this.pointers.entries()].find(
          ([id]) => id !== e.pointerId,
        )[1];
        const before = Math.hypot(old[0] - other[0], old[1] - other[1]),
          after = Math.hypot(e.clientX - other[0], e.clientY - other[1]);
        if (before > 2)
          this.scale = Math.min(
            50,
            Math.max(0.001, (this.scale * after) / before),
          );
        this.offset[0] += dx / 2;
        this.offset[1] += dy / 2;
      } else if (
        this.mode === "3d" &&
        this.dragMode === "orbit" &&
        !e.shiftKey &&
        e.buttons !== 2
      ) {
        this.yaw += dx * 0.008;
        this.elevation = Math.max(
          -1.5,
          Math.min(1.5, this.elevation + dy * 0.008),
        );
      } else {
        this.offset[0] += dx;
        this.offset[1] += dy;
      }
      this.pointers.set(e.pointerId, [e.clientX, e.clientY]);
      this.draw();
    });
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      canvas.addEventListener(event, (e) => this.pointers.delete(e.pointerId));
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("keydown", (e) => {
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "-",
          "0",
          "f",
          "F",
        ].includes(e.key)
      ) {
        e.preventDefault();
        if (e.key === "+") this.zoom(1.2);
        else if (e.key === "-") this.zoom(1 / 1.2);
        else if (e.key === "0") this.reset();
        else if (e.key.toLowerCase() === "f") this.fit();
        else if (this.mode === "3d" && !e.shiftKey) {
          this.yaw +=
            e.key === "ArrowLeft" ? -0.12 : e.key === "ArrowRight" ? 0.12 : 0;
          this.elevation +=
            e.key === "ArrowUp" ? -0.12 : e.key === "ArrowDown" ? 0.12 : 0;
        } else {
          this.offset[0] +=
            e.key === "ArrowLeft" ? 20 : e.key === "ArrowRight" ? -20 : 0;
          this.offset[1] +=
            e.key === "ArrowUp" ? 20 : e.key === "ArrowDown" ? -20 : 0;
        }
        this.draw();
      }
    });
  }
  project(p) {
    if (this.mode === "2d") return [p[0], -p[1]];
    const c = Math.cos(this.yaw),
      s = Math.sin(this.yaw),
      u = p[0] * s + p[1] * c;
    return [
      p[0] * c - p[1] * s,
      -u * Math.sin(this.elevation) - p[2] * Math.cos(this.elevation),
    ];
  }
  screen(p) {
    const a = this.project(p);
    return [
      this.w / 2 + this.offset[0] + a[0] * this.scale,
      this.h / 2 + this.offset[1] + a[1] * this.scale,
    ];
  }
  zoom(f) {
    this.scale = Math.min(50, Math.max(0.001, this.scale * f));
    this.offset = this.offset.map((v) => v * f);
    this.draw();
  }
  reset() {
    this.yaw = -0.65;
    this.elevation = 0.62;
    this.fit();
  }
  fit() {
    const pts = this.state.segments.flatMap((s) => [
      this.project(s.from),
      this.project(s.to),
    ]);
    pts.push(this.project(this.state.pos));
    let xs = pts.map((p) => p[0]),
      ys = pts.map((p) => p[1]),
      minX = Math.min(...xs),
      maxX = Math.max(...xs),
      minY = Math.min(...ys),
      maxY = Math.max(...ys);
    this.scale = Math.min(
      3,
      Math.max(
        0.001,
        Math.min(
          (this.canvas.clientWidth - 110) / Math.max(50, maxX - minX),
          (this.canvas.clientHeight - 110) / Math.max(50, maxY - minY),
        ),
      ),
    );
    this.offset = [
      (-(minX + maxX) / 2) * this.scale,
      (-(minY + maxY) / 2) * this.scale,
    ];
    this.draw();
  }
  draw() {
    const { canvas, ctx } = this;
    this.w = canvas.clientWidth;
    this.h = canvas.clientHeight;
    if (!this.w || !this.h) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = this.w * dpr;
    canvas.height = this.h * dpr;
    ctx.scale(dpr, dpr);
    const dark = document.documentElement.dataset.theme === "dark";
    ctx.fillStyle = dark ? "#1b2527" : "#fcfcf8";
    ctx.fillRect(0, 0, this.w, this.h);
    const line = (a, b, color, width = 1) => {
      ctx.beginPath();
      ctx.moveTo(...this.screen(a));
      ctx.lineTo(...this.screen(b));
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    };
    const grid = dark ? "#2b3738" : "#e8ece5",
      axis = dark ? "#465454" : "#d0d9ce";
    if (this.mode === "2d") {
      let spacing = 25;
      while (spacing * this.scale < 18) spacing *= 2;
      while (spacing * this.scale > 80) spacing /= 2;
      const left = (-this.w / 2 - this.offset[0]) / this.scale,
        right = (this.w / 2 - this.offset[0]) / this.scale,
        low = (-this.h / 2 + this.offset[1]) / this.scale,
        high = (this.h / 2 + this.offset[1]) / this.scale;
      ctx.fillStyle = grid;
      for (let x = Math.ceil(left / spacing) * spacing; x < right; x += spacing)
        for (
          let y = Math.ceil(low / spacing) * spacing;
          y < high;
          y += spacing
        ) {
          let [sx, sy] = this.screen([x, y, 0]);
          ctx.beginPath();
          ctx.arc(sx, sy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      line([left, 0, 0], [right, 0, 0], axis);
      line([0, low, 0], [0, high, 0], axis);
    } else {
      let extent = Math.max(250, 300 / this.scale),
        step = extent / 10;
      for (let j = -10; j <= 10; j++) {
        line([j * step, -extent, 0], [j * step, extent, 0], grid);
        line([-extent, j * step, 0], [extent, j * step, 0], grid);
      }
      for (const [p, c, label] of [
        [[extent, 0, 0], "#c17b62", "X"],
        [[0, extent, 0], "#459786", "Y"],
        [[0, 0, extent], "#668bb2", "Z"],
      ]) {
        line([0, 0, 0], p, c);
        ctx.fillStyle = c;
        ctx.font = "11px monospace";
        ctx.fillText(label, ...this.screen(p));
      }
    }
    const origin = this.screen([0, 0, 0]);
    ctx.fillStyle = dark ? "#8fa099" : "#8b9a8e";
    ctx.font = "10px monospace";
    ctx.fillText("0, 0", origin[0] + 8, origin[1] + 15);
    ctx.beginPath();
    ctx.arc(...origin, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of this.state.segments) line(s.from, s.to, s.color, s.width);
    const { pos, heading, right, up } = this.state;
    const p = this.screen(pos);
    const h = this.project(heading),
      r = this.project(right);
    const point = (a, b) => [
      p[0] + h[0] * a + r[0] * b,
      p[1] + h[1] * a + r[1] * b,
    ];
    ctx.beginPath();
    ctx.moveTo(...point(16, 0));
    ctx.lineTo(...point(-9, -9));
    ctx.lineTo(...point(-4, 0));
    ctx.lineTo(...point(-9, 9));
    ctx.closePath();
    ctx.fillStyle = "#16866a";
    ctx.fill();
    ctx.strokeStyle = dark ? "#b7e5d4" : "white";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (this.mode === "3d") {
      const u = this.project(up);
      ctx.beginPath();
      ctx.moveTo(...p);
      ctx.lineTo(p[0] + u[0] * 20, p[1] + u[1] * 20);
      ctx.strokeStyle = "#bf8e55";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    this.onDraw?.();
  }
}
export function thumbnail(segments, mode = "2d") {
  const project = (p) =>
    mode === "2d"
      ? [p[0], -p[1]]
      : [p[0] * 0.8 - p[1] * 0.6, -p[0] * 0.3 - p[1] * 0.4 - p[2] * 0.85];
  let pts = segments.flatMap((s) => [project(s.from), project(s.to)]);
  if (!pts.length) return "";
  let xs = pts.map((p) => p[0]),
    ys = pts.map((p) => p[1]),
    x = Math.min(...xs),
    y = Math.min(...ys),
    w = Math.max(...xs) - x,
    h = Math.max(...ys) - y,
    pad = Math.max(w, h) * 0.12 + 5;
  return `<svg viewBox="${x - pad} ${y - pad} ${w + pad * 2} ${h + pad * 2}" aria-hidden="true">${segments.map((s) => `<path d="M${project(s.from).join(" ")}L${project(s.to).join(" ")}" fill="none" stroke="${s.color}" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`).join("")}</svg>`;
}
