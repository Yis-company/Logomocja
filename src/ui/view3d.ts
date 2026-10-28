import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import type { Segment, Turtle, Vec3 } from '../logo';
import { cssVar } from './util';

/** Space view (XYZ, Z up). Orbit with drag, pan with right drag or Shift, zoom with the wheel. */
export class View3D {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly lines = new THREE.Group();
  private readonly marker = new THREE.Group();
  private readonly ground = new THREE.Group();
  private readonly resizer: ResizeObserver;
  private readonly host: HTMLElement;
  private frame = 0;
  private lastSegments: Segment[] | null = null;
  private lastLength = -1;
  private segments: Segment[] = [];
  private turtle: Turtle | null = null;
  private width = 1;
  private height = 1;
  private markerTip = new THREE.Vector3();

  constructor(host: HTMLElement) {
    this.host = host;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.domElement.className = 'view-canvas view-3d';
    this.renderer.domElement.tabIndex = 0;
    this.renderer.domElement.setAttribute('role', 'img');
    this.renderer.domElement.setAttribute(
      'aria-label',
      'Przestrzeń rysunku. Przeciągnij, aby obracać; prawy przycisk lub Shift, aby przesuwać; kółko, aby powiększać.',
    );
    host.append(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1e8);
    this.camera.up.set(0, 0, 1);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.screenSpacePanning = true;

    this.scene.add(this.ground, this.lines, this.marker);
    this.buildMarker();
    this.setTheme();
    this.resizer = new ResizeObserver(() => this.resize());
    this.resizer.observe(host);
    this.resize();
    this.frame = requestAnimationFrame(this.loop);
    this.placeCamera(new THREE.Vector3(0, 0, 0), 150);
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.resizer.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  setTheme() {
    this.scene.background = new THREE.Color(cssVar('--canvas-bg') || '#ffffff');
    this.buildGround(this.groundSize);
  }

  private resize() {
    const rect = this.host.getBoundingClientRect();
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.domElement.style.width = `${this.width}px`;
    this.renderer.domElement.style.height = `${this.height}px`;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    for (const child of this.lines.children) {
      const mat = (child as LineSegments2).material as LineMaterial;
      mat.resolution.set(this.width, this.height);
    }
  }

  private buildMarker() {
    const cone = new THREE.ConeGeometry(0.5, 1, 16);
    cone.translate(0, -0.5, 0);
    const body = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({ color: cssVar('--turtle') || '#c1763d' }));
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.9, 0.55),
      new THREE.MeshBasicMaterial({ color: cssVar('--turtle') || '#c1763d', transparent: true, opacity: 0.6 }),
    );
    fin.position.set(0, -0.45, 0.25);
    this.marker.add(body, fin);
  }

  private groundSize = 200;

  private buildGround(size: number) {
    this.groundSize = size;
    this.ground.clear();
    const color = new THREE.Color(cssVar('--grid') || '#cccccc');
    const grid = new THREE.GridHelper(size, Math.max(2, Math.round(size / 10)), color, color);
    grid.rotation.x = Math.PI / 2;
    const axes = new THREE.AxesHelper(size / 2);
    this.ground.add(grid, axes);
  }

  /** Redraws the strokes; the geometry is rebuilt only when the drawing changed. */
  draw(segments: Segment[], turtle: Turtle | null) {
    this.turtle = turtle;
    if (segments !== this.lastSegments || segments.length !== this.lastLength) {
      this.lastSegments = segments;
      this.lastLength = segments.length;
      this.segments = segments;
      this.rebuildLines();
    }
    if (turtle) {
      const t = turtle;
      const basis = new THREE.Matrix4().makeBasis(v3(t.r), v3(t.h), v3(t.u));
      this.marker.quaternion.setFromRotationMatrix(basis);
      this.marker.position.set(t.pos[0], t.pos[1], t.pos[2]);
    }
    this.marker.visible = !!turtle;
  }

  private rebuildLines() {
    this.lines.clear();
    const byWidth = new Map<number, Segment[]>();
    for (const s of this.segments) {
      const list = byWidth.get(s.width);
      if (list) list.push(s);
      else byWidth.set(s.width, [s]);
    }
    for (const [width, list] of byWidth) {
      const pos: number[] = [];
      const col: number[] = [];
      for (const s of list) {
        pos.push(...s.from, ...s.to);
        const c = new THREE.Color(s.color);
        col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
      const geom = new LineSegmentsGeometry();
      geom.setPositions(pos);
      geom.setColors(col);
      const mat = new LineMaterial({ linewidth: width, vertexColors: true });
      mat.resolution.set(this.width, this.height);
      this.lines.add(new LineSegments2(geom, mat));
    }
  }

  /** Frames the drawing, the origin and the turtle. */
  fit(segments: Segment[], turtle: Turtle | null) {
    const min = new THREE.Vector3(0, 0, 0);
    const max = new THREE.Vector3(0, 0, 0);
    const grow = (p: Vec3) => {
      min.min(v3(p));
      max.max(v3(p));
    };
    for (const s of segments) {
      grow(s.from);
      grow(s.to);
    }
    if (turtle) grow(turtle.pos);
    const center = min.clone().add(max).multiplyScalar(0.5);
    const radius = Math.max(min.distanceTo(max) / 2, 10);
    const size = Math.max(200, Math.ceil((radius * 3) / 100) * 100);
    this.buildGround(size);
    this.placeCamera(center, radius * 1.6 + 20);
  }

  /** Default view, looking at the origin. */
  reset() {
    this.placeCamera(new THREE.Vector3(0, 0, 0), 150);
  }

  private placeCamera(target: THREE.Vector3, distance: number) {
    this.controls.target.copy(target);
    this.camera.position.copy(target).add(new THREE.Vector3(-0.6, -0.8, 0.7).normalize().multiplyScalar(distance));
    this.controls.update();
  }

  exportPng(): Promise<Blob> {
    this.renderer.render(this.scene, this.camera);
    const url = this.renderer.domElement.toDataURL('image/png');
    return fetch(url).then((r) => r.blob());
  }

  private loop = () => {
    this.frame = requestAnimationFrame(this.loop);
    this.controls.update();
    if (this.turtle) {
      // Keep the marker a constant size on screen.
      this.markerTip.copy(this.marker.position);
      const s = this.camera.position.distanceTo(this.markerTip) * 0.025;
      this.marker.scale.setScalar(Math.max(s, 0.5));
    }
    this.renderer.render(this.scene, this.camera);
  };
}

const v3 = (a: Vec3) => new THREE.Vector3(a[0], a[1], a[2]);
