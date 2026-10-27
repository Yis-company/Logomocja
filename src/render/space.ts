import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import type { Turtle } from '../logo/machine';
import type { Segment } from '../logo/types';
import type { StageView } from './view';

const FOV = 50;
const VIEW_DIRECTION = new THREE.Vector3(0.55, -0.9, 0.75).normalize();

/** Orbitable 3D view with Z pointing up. Strokes are fat lines so the pen width carries over. */
export class SpaceView implements StageView {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 1e7);
  private readonly controls: OrbitControls;
  private readonly strokes = new THREE.Group();
  /** A unit cone whose base sits at the origin and whose tip points along +Y, the turtle's heading. */
  private readonly turtle = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 1, 16).translate(0, 0.5, 0),
    new THREE.MeshBasicMaterial({ color: 0x16866a }),
  );
  private guides = new THREE.Group();
  /** Bounds of the current drawing, including the turtle. */
  private bounds = new THREE.Box3();
  private frame = 0;
  private resizeObserver: ResizeObserver;

  /** Throws if WebGL cannot create a context. */
  constructor(private readonly container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.domElement.setAttribute('aria-label', 'Rysunek 3D');
    container.append(this.renderer.domElement);

    this.camera.up.set(0, 0, 1);
    this.scene.add(this.strokes, this.turtle, this.guides);
    this.turtle.visible = false;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => this.requestRender());

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
    this.fitCamera(new THREE.Box3(new THREE.Vector3(-50, -50, 0), new THREE.Vector3(50, 50, 0)));
  }

  update(segments: readonly Segment[], turtle: Turtle | null): void {
    this.clearStrokes();
    const groups = new Map<string, { color: string; width: number; positions: number[] }>();
    const box = new THREE.Box3();

    for (const s of segments) {
      const key = `${s.color}|${s.width}`;
      let group = groups.get(key);
      if (!group) {
        group = { color: s.color, width: s.width, positions: [] };
        groups.set(key, group);
      }
      group.positions.push(...s.from, ...s.to);
      box.expandByPoint(new THREE.Vector3(...s.from));
      box.expandByPoint(new THREE.Vector3(...s.to));
    }

    for (const group of groups.values()) {
      const geometry = new LineSegmentsGeometry();
      geometry.setPositions(group.positions);
      const material = new LineMaterial({ color: group.color, linewidth: group.width, worldUnits: false });
      material.resolution.set(this.width, this.height);
      this.strokes.add(new LineSegments2(geometry, material));
    }

    if (turtle) {
      box.expandByPoint(new THREE.Vector3(...turtle.position));
      this.placeTurtle(turtle, box);
    } else {
      this.turtle.visible = false;
    }
    this.bounds = box;
    this.requestRender();
  }

  fit(): void {
    this.fitCamera(this.bounds.isEmpty() ? new THREE.Box3(new THREE.Vector3(-50, -50, 0), new THREE.Vector3(50, 50, 0)) : this.bounds);
  }

  private fitCamera(box: THREE.Box3): void {
    const center = box.getCenter(new THREE.Vector3());
    const radius = Math.max(box.getSize(new THREE.Vector3()).length() / 2, 10);
    const distance = radius / Math.sin((FOV * Math.PI) / 360);

    this.controls.target.copy(center);
    this.camera.position.copy(center).addScaledVector(VIEW_DIRECTION, distance);
    this.camera.near = distance / 1000;
    this.camera.far = distance * 100;
    this.camera.updateProjectionMatrix();
    this.controls.update();

    this.scene.remove(this.guides);
    this.guides = buildGuides(radius);
    this.scene.add(this.guides);
    this.requestRender();
  }

  private placeTurtle(turtle: Turtle, box: THREE.Box3): void {
    const size = Math.max(box.getSize(new THREE.Vector3()).length() * 0.02, 0.5);
    const basis = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(...turtle.right),
      new THREE.Vector3(...turtle.heading),
      new THREE.Vector3(...turtle.up),
    );
    this.turtle.visible = true;
    this.turtle.scale.setScalar(size);
    this.turtle.position.set(...turtle.position);
    this.turtle.quaternion.setFromRotationMatrix(basis);
    (this.turtle.material as THREE.MeshBasicMaterial).color.set(turtle.pen ? 0x16866a : 0x9ccfc0);
  }

  private clearStrokes(): void {
    for (const line of this.strokes.children as LineSegments2[]) {
      line.geometry.dispose();
      (line.material as LineMaterial).dispose();
    }
    this.strokes.clear();
  }

  private resize(): void {
    const { width, height } = this;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    for (const line of this.strokes.children as LineSegments2[]) {
      (line.material as LineMaterial).resolution.set(width, height);
    }
    this.requestRender();
  }

  private get width(): number {
    return Math.max(1, this.container.clientWidth);
  }

  private get height(): number {
    return Math.max(1, this.container.clientHeight);
  }

  private requestRender(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.renderer.render(this.scene, this.camera);
    });
  }
}

/** Floor grid and axes sized to the drawing, both in the XY plane. */
function buildGuides(radius: number): THREE.Group {
  const group = new THREE.Group();
  const step = 10 ** Math.floor(Math.log10(radius));
  const divisions = 20;
  const size = step * divisions;
  const grid = new THREE.GridHelper(size, divisions, 0x9aa5a0, 0xd3dbd7);
  grid.rotation.x = Math.PI / 2;
  const axes = new THREE.AxesHelper(size / 2);
  group.add(grid, axes);
  return group;
}
