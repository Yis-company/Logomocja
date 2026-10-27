import {
  Execution,
  LogoError,
  initialPose,
  interpolatePose,
  parse,
  type Mode,
  type Pose,
  type Segment,
  type StepEvent,
} from "../lang";

export type PlayerState = "idle" | "running" | "paused" | "done" | "error";

/** What the drawing views need to render one frame. */
export interface Frame {
  segments: Segment[];
  /** How many of `segments` are fully drawn. */
  count: number;
  /** In-progress segment of the current animated step. */
  partial: Segment | null;
  pose: Pose;
}

/** Steps per second for each speed level; the last level is "instant". */
export const SPEEDS = [1.5, 4, 12, 40, 150, Infinity];
export const SPEED_LABELS = ["bardzo wolno", "wolno", "spokojnie", "szybko", "bardzo szybko", "natychmiast"];

/**
 * Drives an Execution in time: running with animation, pausing, stepping
 * one command at a time. Rendering is left to the listener.
 */
export class Player {
  state: PlayerState = "idle";
  error: LogoError | null = null;
  /** Source text and mode of the current run. */
  source = "";
  mode: Mode = "2d";
  /** Most recent step (for highlighting the command in the editor). */
  lastStep: StepEvent | null = null;
  stepsDone = 0;
  speedLevel = 3;

  private exec: Execution | null = null;
  private current: StepEvent | null = null;
  private t = 0;
  private raf = 0;
  private lastTime = 0;

  constructor(private readonly onChange: () => void) {}

  get speed(): number {
    return SPEEDS[this.speedLevel] ?? Infinity;
  }

  /** Parse a program and prepare it. Returns false (state "error") on a parse error. */
  load(source: string, mode: Mode): boolean {
    this.stop();
    this.source = source;
    this.mode = mode;
    this.exec = null;
    this.current = null;
    this.lastStep = null;
    this.stepsDone = 0;
    this.error = null;
    try {
      this.exec = new Execution(parse(source, mode));
      this.state = "paused";
      return true;
    } catch (e) {
      if (!(e instanceof LogoError)) throw e;
      this.error = e;
      this.state = "error";
      return false;
    } finally {
      this.onChange();
    }
  }

  run(source: string, mode: Mode): void {
    if (this.load(source, mode)) this.resume();
  }

  resume(): void {
    if (!this.exec || this.state === "done" || this.state === "error") return;
    this.state = "running";
    this.lastTime = performance.now();
    this.schedule();
    this.onChange();
  }

  pause(): void {
    if (this.state !== "running") return;
    this.stop();
    this.state = "paused";
    this.onChange();
  }

  /** Execute exactly one command (finishing an animated one first). */
  step(): void {
    if (!this.exec) return;
    if (this.state === "running") this.stop();
    if (this.current) {
      this.finishCurrent();
    } else {
      this.advance();
      this.finishCurrent();
    }
    if (this.state !== "done" && this.state !== "error") this.state = "paused";
    this.onChange();
  }

  /** Run the rest of the program immediately, without animation. */
  complete(): void {
    if (!this.exec || this.state === "done" || this.state === "error") return;
    this.stop();
    this.finishCurrent();
    while (this.advance()) this.finishCurrent();
    this.onChange();
  }

  reset(): void {
    this.stop();
    this.exec = null;
    this.current = null;
    this.lastStep = null;
    this.stepsDone = 0;
    this.error = null;
    this.state = "idle";
    this.onChange();
  }

  setSpeed(level: number): void {
    this.speedLevel = Math.max(0, Math.min(SPEEDS.length - 1, level));
  }

  frame(): Frame {
    const segments = this.exec?.segments ?? [];
    if (!this.exec) return { segments, count: 0, partial: null, pose: initialPose() };
    const cur = this.current;
    if (!cur) return { segments, count: segments.length, partial: null, pose: this.exec.pose };
    const pose = interpolatePose(cur, this.t);
    let count = segments.length;
    let partial: Segment | null = null;
    if (cur.segment) {
      count--;
      partial = { ...cur.segment, to: pose.pos };
    }
    return { segments, count, partial, pose };
  }

  get hasProgram(): boolean {
    return this.exec !== null;
  }

  private stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private schedule(): void {
    this.raf = requestAnimationFrame((now) => this.tick(now));
  }

  /** Fetch the next step. Returns false when the program ended. */
  private advance(): boolean {
    const ev = this.exec!.step();
    if (!ev) {
      this.current = null;
      this.error = this.exec!.error;
      this.state = this.error ? "error" : "done";
      this.stop();
      return false;
    }
    this.current = ev;
    this.lastStep = ev;
    this.stepsDone++;
    this.t = 0;
    return true;
  }

  private finishCurrent(): void {
    this.current = null;
    this.t = 0;
  }

  private tick(now: number): void {
    this.raf = 0;
    if (this.state !== "running") return;
    // Clamp the frame time so a background tab does not dump everything at once.
    const dt = Math.min(0.1, Math.max(0, (now - this.lastTime) / 1000));
    this.lastTime = now;
    const speed = this.speed;
    if (!Number.isFinite(speed)) {
      if (this.current) this.finishCurrent();
      // Bounded work per frame keeps the page responsive.
      const deadline = performance.now() + 12;
      while (this.advance()) {
        this.finishCurrent();
        if (performance.now() > deadline) break;
      }
    } else {
      let budget = dt * speed;
      while (budget > 0) {
        if (!this.current && !this.advance()) break;
        // Pen and style changes are instant; only movement and turns take time.
        if (this.current!.kind === "pen" || this.current!.kind === "style") {
          this.finishCurrent();
          continue;
        }
        const remaining = 1 - this.t;
        if (budget >= remaining) {
          budget -= remaining;
          this.finishCurrent();
        } else {
          this.t += budget;
          budget = 0;
        }
      }
    }
    if (this.state === "running") this.schedule();
    this.onChange();
  }
}
