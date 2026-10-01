import {
  emptyDrawing,
  LIMITS,
  LogoError,
  type Drawing,
  type Instruction,
  type Numeric,
  type Program,
  type Span,
  type Vec3,
} from "./types";
type Frame = { body: readonly Instruction[]; index: number; remaining: number; locals: Record<string, number> };
type ResolvedPrimitive = (
  | { kind: "forward" | "back" | "right" | "left" | "width" | "pitchup" | "pitchdown"; value: number }
  | { kind: "penup" | "pendown" }
  | { kind: "color"; value: string }
) & { span: Span };
export type Tick = "command" | "work" | "done";
const combine = (a: Vec3, b: Vec3, x: number, y: number): Vec3 =>
  a.map((value, i) => value * x + b[i] * y) as Vec3;
const normalize = (v: Vec3): Vec3 => {
  const length = Math.hypot(...v);
  return v.map((n) => n / length) as Vec3;
};
export class Executor {
  drawing = emptyDrawing();
  private frames: Frame[];
  private operations = 0;
  constructor(private program: Program) {
    this.frames = [{ body: program.instructions, index: 0, remaining: 1, locals: Object.create(null) }];
  }
  get done() {
    return this.frames.length === 0;
  }
  step(): "command" | "done" {
    let result: Tick;
    do {
      result = this.tick();
    } while (result === "work");
    return result;
  }
  tick(): Tick {
    const frame = this.frames.at(-1);
    if (!frame) return "done";
    const node = frame.body[frame.index];
    if (++this.operations > LIMITS.operations)
      throw new LogoError(
        "Program osiągnął limit 10 000 operacji. Skróć liczbę powtórzeń.",
        node?.span ?? { line: this.drawing.activeLine ?? 1, column: 1 },
      );
    if (!node) {
      if (--frame.remaining > 0) frame.index = 0;
      else {
        this.frames.pop();
      }
      return this.done ? "done" : "work";
    }
    frame.index++;
    if (node.kind === "repeat") {
      const count = this.resolve(node.count, frame.locals);
      if (!Number.isInteger(count) || count < 0 || count > LIMITS.repeat)
        throw new LogoError("Liczba powtórzeń musi być całkowita: od 0 do 10 000.", typeof node.count === "number" ? node.span : node.count.span);
      if (count > 0) {
        this.checkFrameLimit(node.span);
        this.frames.push({ body: node.body, index: 0, remaining: count, locals: frame.locals });
      }
      return "work";
    }
    if (node.kind === "call") {
      const definition = this.program.definitions[node.name];
      if (!definition || node.args.length !== definition.params.length)
        throw new LogoError(`Nieprawidłowe wywołanie procedury „${node.name}”.`, node.span);
      this.checkFrameLimit(node.span);
      const values = node.args.map((arg) => this.resolve(arg, frame.locals));
      const locals: Record<string, number> = Object.create(null);
      definition.params.forEach((param, i) => { locals[param] = values[i]; });
      this.frames.push({ body: definition.body, index: 0, remaining: 1, locals });
      return "work";
    }
    const command: ResolvedPrimitive = "value" in node && node.kind !== "color"
      ? { ...node, value: this.resolve(node.value, frame.locals) } as ResolvedPrimitive
      : node as ResolvedPrimitive;
    if (command.kind === "width" && (!Number.isInteger(command.value) || command.value < 1 || command.value > 12))
      throw new LogoError("Grubość pisaka musi być całkowita: od 1 do 12.", "value" in node && typeof node.value !== "number" && typeof node.value !== "string" ? node.value.span : command.span);
    this.execute(command);
    this.drawing.commands++;
    this.drawing.activeLine = node.span.line;
    return "command";
  }
  private checkFrameLimit(span: Span) {
    if (this.frames.length > LIMITS.calls)
      throw new LogoError("Za dużo aktywnych ramek wykonania. Limit: 32.", span);
  }
  private resolve(value: Numeric, locals: Record<string, number>): number {
    const result = typeof value === "number" ? value : locals[value.parameter];
    if (!Number.isFinite(result))
      throw new LogoError("Podaj skończoną liczbę.", typeof value === "number" ? { line: this.drawing.activeLine ?? 1, column: 1 } : value.span);
    return result;
  }
  snapshot(): Drawing {
    return {
      ...this.drawing,
      turtle: { ...this.drawing.turtle },
      segments: [...this.drawing.segments],
    };
  }
  private execute(command: ResolvedPrimitive) {
    const turtle = this.drawing.turtle;
    switch (command.kind) {
      case "forward":
      case "back": {
        const distance = command.value * (command.kind === "back" ? -1 : 1);
        const next = combine(turtle.position, turtle.forward, 1, distance);
        if (
          next.some(
            (n) => !Number.isFinite(n) || Math.abs(n) > LIMITS.coordinate,
          )
        )
          throw new LogoError(
            "Rysunek przekracza zakres współrzędnych ±100 000.",
            command.span,
          );
        if (turtle.penDown && distance !== 0) {
          if (this.drawing.segments.length >= LIMITS.segments)
            throw new LogoError(
              "Rysunek osiągnął limit 10 000 odcinków.",
              command.span,
            );
          this.drawing.segments.push({
            from: turtle.position,
            to: next,
            color: turtle.color,
            width: turtle.width,
          });
        }
        turtle.position = next;
        break;
      }
      case "right":
      case "left": {
        const angle =
          (((command.value % 360) * Math.PI) / 180) *
          (command.kind === "right" ? 1 : -1);
        const f = turtle.forward;
        const r = turtle.right;
        turtle.forward = normalize(
          combine(f, r, Math.cos(angle), Math.sin(angle)),
        );
        turtle.right = normalize(
          combine(r, f, Math.cos(angle), -Math.sin(angle)),
        );
        break;
      }
      case "pitchup":
      case "pitchdown": {
        const angle =
          (((command.value % 360) * Math.PI) / 180) *
          (command.kind === "pitchup" ? 1 : -1);
        const f = turtle.forward;
        const u = turtle.up;
        turtle.forward = normalize(
          combine(f, u, Math.cos(angle), Math.sin(angle)),
        );
        turtle.up = normalize(combine(u, f, Math.cos(angle), -Math.sin(angle)));
        break;
      }
      case "penup":
        turtle.penDown = false;
        break;
      case "pendown":
        turtle.penDown = true;
        break;
      case "color":
        turtle.color = command.value;
        break;
      case "width":
        turtle.width = command.value;
        break;
    }
  }
}
