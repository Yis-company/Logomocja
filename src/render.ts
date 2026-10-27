import type { Mode, Seg, Vec } from './lang'

export interface TurtlePose {
  pos: Vec
  h: Vec
  r: Vec
  u: Vec
}

const PAPER = '#fbf9f1'
const GRID = 'rgba(60,50,30,0.08)'
const GRID_STRONG = 'rgba(60,50,30,0.2)'
const AXES = { x: '#d1495b', y: '#2e933c', z: '#2f6fd0' }
const FOV = (50 * Math.PI) / 180
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: Vec): Vec => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

export class View {
  mode: Mode = '2d'
  autoFit = true
  private ctx: CanvasRenderingContext2D
  private segs: Seg[] = []
  private turtle: TurtlePose | null = null
  private w = 0
  private h = 0
  private dpr = 1
  private queued = false
  // 2D camera
  private cx = 0
  private cy = 0
  private scale = 2
  // 3D camera
  private yaw = 0.6
  private pitch = 0.45
  private dist = 300
  private target: Vec = [0, 0, 0]
  private ptrs = new Map<number, { x: number; y: number }>()
  private pinch = 0
  onUserMove: () => void = () => {}

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
    new ResizeObserver(() => this.resize()).observe(canvas)
    this.resize()
    this.bind()
  }

  setMode(m: Mode) {
    this.mode = m
    this.autoFit = true
    this.fit()
  }

  setData(segs: Seg[], turtle: TurtlePose | null) {
    this.segs = segs
    this.turtle = turtle
    if (this.autoFit) this.fit(false)
    this.invalidate()
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect()
    this.dpr = window.devicePixelRatio || 1
    this.w = Math.max(1, r.width)
    this.h = Math.max(1, r.height)
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
    if (this.autoFit) this.fit(false)
    this.invalidate()
  }

  invalidate() {
    if (this.queued) return
    this.queued = true
    requestAnimationFrame(() => {
      this.queued = false
      this.draw()
    })
  }

  fit(reenable = true) {
    if (reenable) this.autoFit = true
    const lo: Vec = [0, 0, 0]
    const hi: Vec = [0, 0, 0]
    const add = (p: Vec) => {
      for (let k = 0; k < 3; k++) {
        lo[k] = Math.min(lo[k], p[k])
        hi[k] = Math.max(hi[k], p[k])
      }
    }
    for (const s of this.segs) {
      add(s.from)
      add(s.to)
    }
    if (this.turtle) add(this.turtle.pos)
    if (this.mode === '2d') {
      const bw = Math.max(hi[0] - lo[0], 60)
      const bh = Math.max(hi[1] - lo[1], 60)
      this.cx = (lo[0] + hi[0]) / 2
      this.cy = (lo[1] + hi[1]) / 2
      this.scale = Math.min((this.w * 0.82) / bw, (this.h * 0.82) / bh, 6)
    } else {
      this.target = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2]
      const R = Math.max(Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) / 2, 40)
      const half = Math.atan(Math.tan(FOV / 2) * Math.min(this.w, this.h) / Math.max(this.w, this.h))
      this.dist = (R / Math.sin(Math.max(half, 0.3))) * 1.05
    }
    this.invalidate()
  }

  // ----- input -----
  private bind() {
    const c = this.canvas
    c.addEventListener('contextmenu', (e) => e.preventDefault())
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId)
      this.ptrs.set(e.pointerId, { x: e.offsetX, y: e.offsetY })
      this.pinch = this.pinchDist()
    })
    const end = (e: PointerEvent) => {
      this.ptrs.delete(e.pointerId)
      this.pinch = this.pinchDist()
    }
    c.addEventListener('pointerup', end)
    c.addEventListener('pointercancel', end)
    c.addEventListener('pointermove', (e) => {
      const p = this.ptrs.get(e.pointerId)
      if (!p) return
      const dx = e.offsetX - p.x
      const dy = e.offsetY - p.y
      p.x = e.offsetX
      p.y = e.offsetY
      if (this.ptrs.size === 1) {
        const pan = this.mode === '2d' || e.shiftKey || (e.buttons & 2) !== 0 || (e.buttons & 4) !== 0
        if (pan) this.pan(dx, dy)
        else this.orbit(dx, dy)
      } else if (this.ptrs.size === 2) {
        const d = this.pinchDist()
        if (this.pinch > 0 && d > 0) this.zoom(this.pinch / d, this.mid().x, this.mid().y)
        this.pinch = d
        this.pan(dx / 2, dy / 2)
      }
    })
    c.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault()
        this.zoom(Math.exp(e.deltaY * 0.0015), e.offsetX, e.offsetY)
      },
      { passive: false },
    )
  }

  private pinchDist() {
    if (this.ptrs.size < 2) return 0
    const [a, b] = [...this.ptrs.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }
  private mid() {
    const [a, b] = [...this.ptrs.values()]
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  }

  private moved() {
    this.autoFit = false
    this.onUserMove()
    this.invalidate()
  }

  private orbit(dx: number, dy: number) {
    this.yaw -= dx * 0.008
    this.pitch = Math.max(-1.5, Math.min(1.5, this.pitch + dy * 0.008))
    this.moved()
  }

  private basis() {
    const eye: Vec = [
      this.target[0] + this.dist * Math.cos(this.pitch) * Math.sin(this.yaw),
      this.target[1] - this.dist * Math.cos(this.pitch) * Math.cos(this.yaw),
      this.target[2] + this.dist * Math.sin(this.pitch),
    ]
    const fwd = unit(sub(this.target, eye))
    const right = unit(cross(fwd, [0, 0, 1]))
    const up = cross(right, fwd)
    return { eye, fwd, right, up }
  }

  private focal() {
    return Math.min(this.w, this.h) / 2 / Math.tan(FOV / 2)
  }

  private pan(dx: number, dy: number) {
    if (this.mode === '2d') {
      this.cx -= dx / this.scale
      this.cy += dy / this.scale
    } else {
      const { right, up } = this.basis()
      const k = this.dist / this.focal()
      for (let i = 0; i < 3; i++) this.target[i] += (-dx * right[i] + dy * up[i]) * k
    }
    this.moved()
  }

  private zoom(f: number, px: number, py: number) {
    if (this.mode === '2d') {
      const wx = this.cx + (px - this.w / 2) / this.scale
      const wy = this.cy - (py - this.h / 2) / this.scale
      this.scale = Math.max(0.02, Math.min(200, this.scale / f))
      this.cx = wx - (px - this.w / 2) / this.scale
      this.cy = wy + (py - this.h / 2) / this.scale
    } else {
      this.dist = Math.max(5, Math.min(2e6, this.dist * f))
    }
    this.moved()
  }

  // ----- drawing -----
  private draw() {
    const g = this.ctx
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    g.fillStyle = PAPER
    g.fillRect(0, 0, this.w, this.h)
    g.lineCap = 'round'
    g.lineJoin = 'round'
    if (this.mode === '2d') this.draw2d(g)
    else this.draw3d(g)
  }

  private niceStep(minWorld: number) {
    const p = Math.pow(10, Math.floor(Math.log10(minWorld)))
    for (const m of [1, 2, 5, 10]) if (p * m >= minWorld) return p * m
    return p * 10
  }

  private strokeSegs(g: CanvasRenderingContext2D, pts: (s: Seg) => [number, number, number, number] | null) {
    let color = ''
    let width = 0
    let open = false
    for (const s of this.segs) {
      const q = pts(s)
      if (!q) continue
      if (!open || s.color !== color || s.width !== width) {
        if (open) g.stroke()
        g.beginPath()
        g.strokeStyle = color = s.color
        g.lineWidth = width = s.width
        open = true
      }
      g.moveTo(q[0], q[1])
      g.lineTo(q[2], q[3])
    }
    if (open) g.stroke()
  }

  private draw2d(g: CanvasRenderingContext2D) {
    const { w, h, scale: s } = this
    const X = (x: number) => w / 2 + (x - this.cx) * s
    const Y = (y: number) => h / 2 - (y - this.cy) * s
    const step = this.niceStep(28 / s)
    g.lineWidth = 1
    const x0 = Math.floor((this.cx - w / 2 / s) / step) * step
    const x1 = this.cx + w / 2 / s
    const y0 = Math.floor((this.cy - h / 2 / s) / step) * step
    const y1 = this.cy + h / 2 / s
    g.beginPath()
    g.strokeStyle = GRID
    for (let x = x0; x <= x1; x += step) {
      g.moveTo(Math.round(X(x)) + 0.5, 0)
      g.lineTo(Math.round(X(x)) + 0.5, h)
    }
    for (let y = y0; y <= y1; y += step) {
      g.moveTo(0, Math.round(Y(y)) + 0.5)
      g.lineTo(w, Math.round(Y(y)) + 0.5)
    }
    g.stroke()
    g.beginPath()
    g.strokeStyle = GRID_STRONG
    g.moveTo(0, Y(0))
    g.lineTo(w, Y(0))
    g.moveTo(X(0), 0)
    g.lineTo(X(0), h)
    g.stroke()
    g.fillStyle = 'rgba(60,50,30,0.55)'
    g.font = '11px ui-monospace, monospace'
    g.fillText(`siatka: ${+step.toPrecision(2)}`, 8, h - 8)
    this.strokeSegs(g, (sg) => [X(sg.from[0]), Y(sg.from[1]), X(sg.to[0]), Y(sg.to[1])])
    const t = this.turtle
    if (t) {
      const px = X(t.pos[0])
      const py = Y(t.pos[1])
      const dx = t.h[0]
      const dy = -t.h[1]
      const l = Math.hypot(dx, dy)
      if (l > 1e-9) this.arrow(g, px, py, dx / l, dy / l)
      else this.dot(g, px, py)
    }
  }

  private arrow(g: CanvasRenderingContext2D, px: number, py: number, dx: number, dy: number) {
    g.beginPath()
    g.moveTo(px + dx * 12, py + dy * 12)
    g.lineTo(px - dx * 7 - dy * 7, py - dy * 7 + dx * 7)
    g.lineTo(px - dx * 3, py - dy * 3)
    g.lineTo(px - dx * 7 + dy * 7, py - dy * 7 - dx * 7)
    g.closePath()
    g.fillStyle = 'rgba(30,40,35,0.85)'
    g.fill()
  }
  private dot(g: CanvasRenderingContext2D, px: number, py: number) {
    g.beginPath()
    g.arc(px, py, 5, 0, Math.PI * 2)
    g.fillStyle = 'rgba(30,40,35,0.85)'
    g.fill()
  }

  private draw3d(g: CanvasRenderingContext2D) {
    const { w, h } = this
    const { eye, fwd, right, up } = this.basis()
    const f = this.focal()
    const near = Math.max(this.dist * 0.01, 0.5)
    const cam = (p: Vec): Vec => {
      const d = sub(p, eye)
      return [dot(d, right), dot(d, up), dot(d, fwd)]
    }
    // returns screen segment or null when behind the camera
    const line = (a: Vec, b: Vec): [number, number, number, number] | null => {
      let p = cam(a)
      let q = cam(b)
      if (p[2] < near && q[2] < near) return null
      if (p[2] < near) p = lerpNear(p, q, near)
      else if (q[2] < near) q = lerpNear(q, p, near)
      return [w / 2 + (f * p[0]) / p[2], h / 2 - (f * p[1]) / p[2], w / 2 + (f * q[0]) / q[2], h / 2 - (f * q[1]) / q[2]]
    }
    const lerpNear = (a: Vec, b: Vec, z: number): Vec => {
      const t = (z - a[2]) / (b[2] - a[2])
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]
    }
    // ground grid on z = 0
    const step = this.niceStep(this.dist / 14)
    const n = 12
    const gx = Math.round(this.target[0] / step) * step
    const gy = Math.round(this.target[1] / step) * step
    g.lineWidth = 1
    g.beginPath()
    g.strokeStyle = GRID_STRONG
    for (let i = -n; i <= n; i++) {
      const a = line([gx + i * step, gy - n * step, 0], [gx + i * step, gy + n * step, 0])
      const b = line([gx - n * step, gy + i * step, 0], [gx + n * step, gy + i * step, 0])
      if (a) {
        g.moveTo(a[0], a[1])
        g.lineTo(a[2], a[3])
      }
      if (b) {
        g.moveTo(b[0], b[1])
        g.lineTo(b[2], b[3])
      }
    }
    g.globalAlpha = 0.45
    g.stroke()
    g.globalAlpha = 1
    // axes
    const L = step * 3
    const axes: [Vec, string, string][] = [
      [[L, 0, 0], AXES.x, 'X'],
      [[0, L, 0], AXES.y, 'Y'],
      [[0, 0, L], AXES.z, 'Z'],
    ]
    g.font = 'bold 12px ui-monospace, monospace'
    for (const [end, col, name] of axes) {
      const l = line([0, 0, 0], end)
      if (!l) continue
      g.beginPath()
      g.strokeStyle = col
      g.lineWidth = 1.5
      g.moveTo(l[0], l[1])
      g.lineTo(l[2], l[3])
      g.stroke()
      g.fillStyle = col
      g.fillText(name, l[2] + 4, l[3] - 4)
    }
    this.strokeSegs(g, (s) => line(s.from, s.to))
    const t = this.turtle
    if (t) {
      const k = this.dist * 0.035
      const tip: Vec = [t.pos[0] + t.h[0] * k * 1.6, t.pos[1] + t.h[1] * k * 1.6, t.pos[2] + t.h[2] * k * 1.6]
      const corner = (sr: number, su: number): Vec => [
        t.pos[0] + (t.r[0] * sr + t.u[0] * su) * k * 0.6,
        t.pos[1] + (t.r[1] * sr + t.u[1] * su) * k * 0.6,
        t.pos[2] + (t.r[2] * sr + t.u[2] * su) * k * 0.6,
      ]
      const cs = [corner(1, 0), corner(0, 1), corner(-1, 0), corner(0, -1)]
      g.strokeStyle = 'rgba(30,40,35,0.85)'
      g.lineWidth = 1.5
      g.beginPath()
      cs.forEach((c, i) => {
        for (const [a, b] of [[tip, c], [c, cs[(i + 1) % 4]]] as [Vec, Vec][]) {
          const l = line(a, b)
          if (l) {
            g.moveTo(l[0], l[1])
            g.lineTo(l[2], l[3])
          }
        }
      })
      g.stroke()
    }
  }
}
