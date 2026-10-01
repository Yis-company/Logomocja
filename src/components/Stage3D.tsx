import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { Drawing } from "../logo/types";
import { stagePalette, type Theme } from "../theme";
import { Icon } from "./Icon";
type SceneState = {
  scene: THREE.Scene;
  grid: THREE.GridHelper;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  lines: THREE.Group;
  turtle: THREE.Group;
};
function disposeGroup(group: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  group.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
      geometries.add(object.geometry);
      for (const m of Array.isArray(object.material)
        ? object.material
        : [object.material])
        materials.add(m);
    }
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
  group.clear();
}
export default function Stage3D({
  drawing,
  theme = "light",
}: {
  drawing: Drawing;
  theme?: Theme;
}) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef<SceneState | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-label", "Rysunek żółwia w 3D");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2_000_000);
    camera.up.set(0, 0, 1);
    camera.position.set(300, -380, 320);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 30, 20);
    controls.enableDamping = true;
    controls.minDistance = 30;
    controls.maxDistance = 600_000;
    controls.saveState();
    const grid = new THREE.GridHelper(1000, 40, "#c8d6cc", "#e0e7de");
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -0.1;
    scene.add(grid);
    scene.add(new THREE.AmbientLight("#ffffff", 2));
    const light = new THREE.DirectionalLight("#ffffff", 3);
    light.position.set(100, -100, 300);
    scene.add(light);
    const lines = new THREE.Group();
    const turtle = new THREE.Group();
    scene.add(lines, turtle);
    const shellMaterial = new THREE.MeshStandardMaterial({
      color: "#22795b",
      roughness: 0.6,
    });
    const limbMaterial = new THREE.MeshStandardMaterial({
      color: "#b3cc96",
      roughness: 0.6,
    });
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 16),
      shellMaterial,
    );
    shell.scale.set(8, 11, 5);
    turtle.add(shell);
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(4, 12, 10),
      limbMaterial,
    );
    head.position.y = 13;
    turtle.add(head);
    for (const [x, y] of [
      [-8, -7],
      [8, -7],
      [-8, 7],
      [8, 7],
    ]) {
      const limb = new THREE.Mesh(
        new THREE.SphereGeometry(3, 10, 8),
        limbMaterial,
      );
      limb.scale.set(1.7, 1, 0.6);
      limb.position.set(x, y, 0);
      turtle.add(limb);
    }
    state.current = { scene, grid, camera, renderer, controls, lines, turtle };
    const resize = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resize.observe(element);
    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });
    const lost = (event: Event) => {
      event.preventDefault();
      renderer.setAnimationLoop(null);
      setError(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      state.current = null;
      renderer.setAnimationLoop(null);
      resize.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      disposeGroup(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);
  useEffect(() => {
    const context = state.current;
    if (!context) return;
    disposeGroup(context.lines);
    const groups = new Map<number, { positions: number[]; colors: number[] }>();
    for (const segment of drawing.segments) {
      let group = groups.get(segment.width);
      if (!group) {
        group = { positions: [], colors: [] };
        groups.set(segment.width, group);
      }
      group.positions.push(...segment.from, ...segment.to);
      const color = new THREE.Color(segment.color);
      group.colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }
    for (const [width, group] of groups) {
      const geometry = new LineSegmentsGeometry();
      geometry.setPositions(group.positions);
      geometry.setColors(group.colors);
      const material = new LineMaterial({
        linewidth: width,
        vertexColors: true,
      });
      context.lines.add(new LineSegments2(geometry, material));
    }
    const { position, right, forward, up } = drawing.turtle;
    context.turtle.position.fromArray(position);
    context.turtle.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(
        new THREE.Vector3(...right),
        new THREE.Vector3(...forward),
        new THREE.Vector3(...up),
      ),
    );
  }, [drawing]);
  useEffect(() => {
    const context = state.current;
    if (!context) return;
    const palette = stagePalette[theme];
    const replacement = new THREE.GridHelper(
      1000,
      40,
      palette.axis,
      palette.grid,
    );
    context.grid.geometry.dispose();
    context.grid.geometry = replacement.geometry;
    replacement.material.dispose();
  }, [theme]);
  function view(preset: "perspective" | "top" | "front") {
    const context = state.current;
    if (!context) return;
    if (preset === "perspective") {
      context.controls.reset();
      return;
    }
    const distance = context.camera.position.distanceTo(
      context.controls.target,
    );
    const direction =
      preset === "top"
        ? new THREE.Vector3(0, -0.001, 1)
        : new THREE.Vector3(0, -1, 0.001);
    context.camera.position
      .copy(context.controls.target)
      .addScaledVector(direction.normalize(), distance);
    context.controls.update();
  }
  function zoom(factor: number) {
    const s = state.current;
    if (!s) return;
    const offset = s.camera.position.clone().sub(s.controls.target);
    offset.multiplyScalar(factor);
    offset.setLength(THREE.MathUtils.clamp(offset.length(), 30, 600_000));
    s.camera.position.copy(s.controls.target).add(offset);
    s.controls.update();
  }
  return (
    <>
      <div ref={host} className="three-host" />
      {error ? (
        <div className="stage-unavailable" role="alert">
          <Icon name="cube" size={32} />
          <h3>Tryb 3D jest niedostępny</h3>
          <p>
            Przeglądarka nie udostępnia WebGL2. Możesz dalej rysować w trybie
            2D.
          </p>
        </div>
      ) : (
        <>
          <div className="camera-presets">
            <button type="button" onClick={() => view("top")}>
              Z góry
            </button>
            <button type="button" onClick={() => view("front")}>
              Z przodu
            </button>
          </div>
          <div className="view-controls">
            <button
              type="button"
              className="icon-button"
              aria-label="Pomniejsz rysunek"
              onClick={() => zoom(1.25)}
            >
              <Icon name="minus" size={17} />
            </button>
            <span>3D</span>
            <button
              type="button"
              className="icon-button"
              aria-label="Powiększ rysunek"
              onClick={() => zoom(0.8)}
            >
              <Icon name="plus" size={17} />
            </button>
            <div className="control-divider" />
            <button
              type="button"
              className="icon-button"
              aria-label="Reset widoku"
              title="Reset widoku"
              onClick={() => view("perspective")}
            >
              <Icon name="fit" size={17} />
            </button>
          </div>
          <span className="canvas-axis">X · Y · Z</span>
        </>
      )}
    </>
  );
}
