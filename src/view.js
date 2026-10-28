import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
export class DrawingView {
  constructor(host, onChange) {
    this.host = host;
    this.onChange = onChange;
    this.mode = "2d";
    this.scale = 1;
    this.center = [0, 0];
    this.state = {
      segments: [],
      position: [0, 0, 0],
      heading: [0, 1, 0],
      right: [1, 0, 0],
      up: [0, 0, 1],
    };
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute(
      "aria-label",
      "Rysunek żółwia. Przeciągnij, aby przesunąć. Użyj kółka, aby przybliżyć.",
    );
    this.canvas.tabIndex = 0;
    host.append(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    let drag = null;
    this.canvas.addEventListener("pointerdown", (e) => {
      drag = [e.clientX, e.clientY];
      this.canvas.setPointerCapture(e.pointerId);
    });
    this.canvas.addEventListener("pointermove", (e) => {
      if (drag) {
        this.center[0] -= (e.clientX - drag[0]) / this.scale;
        this.center[1] += (e.clientY - drag[1]) / this.scale;
        drag = [e.clientX, e.clientY];
        this.draw();
      }
    });
    for (let ev of ["pointerup", "pointercancel"])
      this.canvas.addEventListener(ev, () => (drag = null));
    this.canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.zoom(Math.exp(-e.deltaY * 0.001));
      },
      { passive: false },
    );
    this.canvas.addEventListener("keydown", (e) => {
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "-",
          "0",
        ].includes(e.key)
      ) {
        e.preventDefault();
        if (e.key === "+") this.zoom(1.2);
        else if (e.key === "-") this.zoom(1 / 1.2);
        else if (e.key === "0") this.fit();
        else {
          this.center[0] +=
            e.key === "ArrowLeft"
              ? -20 / this.scale
              : e.key === "ArrowRight"
                ? 20 / this.scale
                : 0;
          this.center[1] +=
            e.key === "ArrowUp"
              ? 20 / this.scale
              : e.key === "ArrowDown"
                ? -20 / this.scale
                : 0;
          this.draw();
        }
      }
    });
  }
  setMode(mode) {
    this.mode = mode;
    if (mode === "3d") {
      if (!this.renderer) {
        try {
          this.init3D();
        } catch (e) {
          this.mode = "2d";
          return false;
        }
      }
      this.canvas.hidden = true;
      this.renderer.domElement.hidden = false;
    } else {
      this.canvas.hidden = false;
      if (this.renderer) this.renderer.domElement.hidden = true;
    }
    this.resize();
    this.update(this.state);
    return true;
  }
  init3D() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.domElement.setAttribute(
      "aria-label",
      "Widok przestrzenny. Przeciągnij, aby obrócić; prawy przycisk przesuwa; kółko przybliża.",
    );
    this.renderer.domElement.tabIndex = 0;
    this.host.append(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 1000000);
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(320, -420, 320);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("change", () => this.render3D());
    this.grid = new THREE.GridHelper(1000, 40, 0xbcc7be, 0xdce3da);
    this.grid.rotation.x = Math.PI / 2;
    this.scene.add(this.grid);
    this.axes = new THREE.AxesHelper(90);
    this.scene.add(this.axes);
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.renderer.domElement.addEventListener("keydown", (e) => {
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "-",
          "0",
        ].includes(e.key)
      ) {
        e.preventDefault();
        if (e.key === "0") this.fit();
        else if (e.key === "+") this.zoom(1.2);
        else if (e.key === "-") this.zoom(1 / 1.2);
        else {
          let offset = this.camera.position.clone().sub(this.controls.target),
            s = new THREE.Spherical().setFromVector3(
              new THREE.Vector3(offset.x, offset.z, offset.y),
            );
          s.theta +=
            e.key === "ArrowLeft" ? -0.12 : e.key === "ArrowRight" ? 0.12 : 0;
          s.phi +=
            e.key === "ArrowUp" ? -0.12 : e.key === "ArrowDown" ? 0.12 : 0;
          s.makeSafe();
          offset.setFromSpherical(s);
          this.camera.position
            .copy(this.controls.target)
            .add(new THREE.Vector3(offset.x, offset.z, offset.y));
          this.controls.update();
        }
      }
    });
  }
  resize() {
    this.w = this.host.clientWidth;
    this.h = this.host.clientHeight;
    let d = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = this.w * d;
    this.canvas.height = this.h * d;
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
    if (this.renderer) {
      this.renderer.setSize(this.w, this.h);
      this.camera.aspect = this.w / this.h;
      this.camera.updateProjectionMatrix();
    }
    this.draw();
  }
  update(state) {
    this.state = state;
    if (this.mode === "3d" && this.renderer) {
      while (this.group.children.length) {
        let o = this.group.children[0];
        this.group.remove(o);
        o.traverse((child) => {
          child.geometry?.dispose();
          child.material?.dispose();
        });
      }
      const addLine = (a, b, color, width) => {
        let av = new THREE.Vector3(...a),
          bv = new THREE.Vector3(...b),
          v = bv.clone().sub(av);
        if (v.length() < 1e-9) return;
        let mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(
            Math.max(0.28, width * 0.25),
            Math.max(0.28, width * 0.25),
            v.length(),
            6,
          ),
          new THREE.MeshBasicMaterial({ color }),
        );
        mesh.position.copy(av.add(bv).multiplyScalar(0.5));
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          v.normalize(),
        );
        this.group.add(mesh);
      };
      for (let s of state.segments) addLine(s.from, s.to, s.color, s.width);
      let p = state.position;
      for (let [v, c] of [
        [state.heading, 0x16866a],
        [state.right, 0xc1763d],
        [state.up, 0x4485c1],
      ]) {
        let arrow = new THREE.ArrowHelper(
          new THREE.Vector3(...v),
          new THREE.Vector3(...p),
          15,
          c,
          4,
          3,
        );
        this.group.add(arrow);
      }
      let shell = new THREE.Mesh(
        new THREE.SphereGeometry(3, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0x16866a }),
      );
      shell.position.set(...p);
      this.group.add(shell);
    }
    this.draw();
  }
  fit() {
    let points = this.state.segments.flatMap((s) => [s.from, s.to]);
    if (!points.length) points = [[0, 0, 0]];
    let lo = [0, 1, 2].map((i) => Math.min(...points.map((p) => p[i]))),
      hi = [0, 1, 2].map((i) => Math.max(...points.map((p) => p[i])));
    if (this.mode === "3d" && this.renderer) {
      let c = new THREE.Vector3(...lo.map((v, i) => (v + hi[i]) / 2)),
        radius = Math.max(
          55,
          new THREE.Vector3(...hi).distanceTo(new THREE.Vector3(...lo)) * 0.5,
        );
      this.controls.target.copy(c);
      this.fitDistance = radius * 3.3;
      this.camera.position
        .copy(c)
        .add(
          new THREE.Vector3(1.1, -1.6, 1.15)
            .normalize()
            .multiplyScalar(radius * 3.3),
        );
      this.camera.near = 0.1;
      this.camera.far = 1000000;
      this.camera.updateProjectionMatrix();
      this.controls.update();
    } else {
      this.center = lo.map((v, i) => (v + hi[i]) / 2);
      this.scale = Math.min(
        (this.w - 110) / Math.max(100, hi[0] - lo[0]),
        (this.h - 110) / Math.max(100, hi[1] - lo[1]),
        3,
      );
      this.scale = Math.max(0.001, this.scale);
    }
    this.draw();
  }
  resetCamera() {
    this.center = [0, 0];
    this.scale = 1;
    this.fit();
  }
  zoom(k) {
    if (this.mode === "3d" && this.renderer) {
      let o = this.camera.position
        .clone()
        .sub(this.controls.target)
        .multiplyScalar(1 / k);
      this.camera.position.copy(this.controls.target).add(o);
      this.controls.update();
    } else {
      this.scale = Math.max(0.001, Math.min(50, this.scale * k));
      this.draw();
    }
  }
  render3D() {
    if (this.renderer && this.mode === "3d") {
      let dark = document.documentElement.dataset.theme === "dark";
      this.scene.background = new THREE.Color(dark ? "#192621" : "#fbfcf8");
      this.renderer.render(this.scene, this.camera);
      this.onChange?.(
        (this.fitDistance || 600) /
          this.camera.position.distanceTo(this.controls.target),
      );
    }
  }
  draw() {
    if (this.mode === "3d") {
      this.render3D();
      return;
    }
    let ctx = this.ctx,
      w = this.w || 1,
      h = this.h || 1,
      s = this.scale,
      dark = document.documentElement.dataset.theme === "dark",
      project = (p) => [
        w / 2 + (p[0] - this.center[0]) * s,
        h / 2 - (p[1] - this.center[1]) * s,
      ];
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = dark ? "#192621" : "#fbfcf8";
    ctx.fillRect(0, 0, w, h);
    let step = 25;
    while (step * s < 17) step *= 2;
    while (step * s > 65) step /= 2;
    ctx.fillStyle = dark ? "#35483e" : "#dce4da";
    let firstX = this.center[0] - w / (2 * s),
      lastX = this.center[0] + w / (2 * s),
      firstY = this.center[1] - h / (2 * s),
      lastY = this.center[1] + h / (2 * s);
    for (let x = Math.ceil(firstX / step) * step; x <= lastX; x += step)
      for (let y = Math.ceil(firstY / step) * step; y <= lastY; y += step) {
        let [px, py] = project([x, y]);
        ctx.beginPath();
        ctx.arc(px, py, 0.85, 0, 7);
        ctx.fill();
      }
    let [ox, oy] = project([0, 0]);
    ctx.strokeStyle = dark ? "#3c5144" : "#dde5db";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, h);
    ctx.moveTo(0, oy);
    ctx.lineTo(w, oy);
    ctx.stroke();
    ctx.fillStyle = dark ? "#809686" : "#9cae9c";
    ctx.font = "10px monospace";
    ctx.fillText("0", ox + 7, oy + 15);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let seg of this.state.segments) {
      let a = project(seg.from),
        b = project(seg.to);
      ctx.beginPath();
      ctx.moveTo(...a);
      ctx.lineTo(...b);
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = seg.width;
      ctx.stroke();
    }
    let p = project(this.state.position),
      v = this.state.heading,
      angle = Math.atan2(v[0], v[1]);
    ctx.save();
    ctx.translate(...p);
    ctx.rotate(angle);
    ctx.fillStyle = dark ? "#91c7a4" : "#e9f2df";
    ctx.strokeStyle = "#16866a";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(9, 8);
    ctx.lineTo(0, 4);
    ctx.lineTo(-9, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 3);
    ctx.stroke();
    ctx.restore();
    this.onChange?.(s);
  }
  export() {
    this.draw();
    return (
      this.mode === "3d" ? this.renderer.domElement : this.canvas
    ).toDataURL("image/png");
  }
}
