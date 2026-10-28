import {
  type Condition,
  type Drawing,
  emptyDrawing,
  type Expr,
  type Instruction,
  LIMITS,
  LogoError,
  type Program,
  type Span,
  type Vec3,
} from "./types";
type Frame = {
  body: readonly Instruction[];
  index: number;
  remaining: number;
  iteration: number;
  kind: "top" | "call" | "repeat" | "block";
  locals: Record<string, number>;
};
export type Tick = "command" | "work" | "done";
const combine = (a: Vec3, b: Vec3, x: number, y: number): Vec3 =>
  a.map((value, i) => value * x + b[i] * y) as Vec3;
const normalize = (v: Vec3): Vec3 => {
  const length = Math.hypot(...v);
  return v.map((n) => n / length) as Vec3;
};
const radians = (degrees: number) => ((degrees % 360) * Math.PI) / 180;
export class Executor {
  drawing = emptyDrawing();
  private frames: Frame[];
  private operations = 0;
  private active = 0;
  private globals: Record<string, number> = Object.create(null);
  constructor(private program: Program) {
    this.frames = [{ body: program.instructions, index: 0, remaining: 1, iteration: 0, kind: "top", locals: this.globals }];
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
    // Reaching the end of the program is not an operation; finishing any other body is.
    if (!node && frame.kind === "top") {
      this.pop();
      return "done";
    }
    if (++this.operations > LIMITS.operations)
      throw new LogoError(
        "Program osiągnął limit 10 000 operacji. Skróć liczbę powtórzeń.",
        node?.span ?? { line: this.drawing.activeLine ?? 1, column: 1 },
      );
    if (!node) {
      if (frame.kind === "repeat" && --frame.remaining > 0) {
        frame.index = 0;
        frame.iteration++;
      } else this.pop();
      return this.done ? "done" : "work";
    }
    frame.index++;
    switch (node.kind) {
      case "repeat": {
        const count = this.evaluate(node.count, frame);
        if (!Number.isInteger(count) || count < 0 || count > LIMITS.repeat)
          throw new LogoError("Liczba powtórzeń musi być całkowita: od 0 do 10 000.", node.count.span);
        if (count > 0)
          this.push({ body: node.body, index: 0, remaining: count, iteration: 1, kind: "repeat", locals: frame.locals }, node.span);
        return "work";
      }
      case "call": {
        const definition = this.program.definitions[node.name];
        if (!definition || node.args.length !== definition.params.length)
          throw new LogoError(`Nieprawidłowe wywołanie procedury „${node.name}”.`, node.span);
        const values = node.args.map((arg) => this.evaluate(arg, frame));
        const locals: Record<string, number> = Object.create(null);
        definition.params.forEach((param, i) => {
          locals[param] = values[i];
        });
        this.push({ body: definition.body, index: 0, remaining: 1, iteration: 0, kind: "call", locals }, node.span);
        return "work";
      }
      case "let":
        frame.locals[node.name] = this.evaluate(node.value, frame);
        return "work";
      case "if": {
        const body = this.test(node.condition, frame) ? node.body : node.otherwise;
        if (body) this.frames.push({ body, index: 0, remaining: 1, iteration: 0, kind: "block", locals: frame.locals });
        return "work";
      }
      case "stop":
        while (this.frames.length && this.pop().kind !== "call");
        return this.done ? "done" : "work";
      default:
        break;
    }
    const value = "value" in node && node.kind !== "color" ? this.evaluate(node.value, frame) : 0;
    if (node.kind === "width" && (!Number.isInteger(value) || value < 1 || value > 12))
      throw new LogoError("Grubość pisaka musi być całkowita: od 1 do 12.", node.value.span);
    this.execute(node, value);
    this.drawing.commands++;
    this.drawing.activeLine = node.span.line;
    return "command";
  }
  private push(frame: Frame, span: Span) {
    if (this.active >= LIMITS.calls)
      throw new LogoError("Za dużo aktywnych ramek wykonania. Limit: 32.", span);
    this.active++;
    this.frames.push(frame);
  }
  private pop(): Frame {
    const frame = this.frames.pop() as Frame;
    if (frame.kind === "call" || frame.kind === "repeat") this.active--;
    return frame;
  }
  /** Run-time errors in an argument are reported at its first token, `at`. */
  private evaluate(expr: Expr, frame: Frame, at: Span = expr.span): number {
    switch (expr.kind) {
      case "number":
        return expr.value;
      case "name": {
        const value = expr.name in frame.locals ? frame.locals[expr.name] : this.globals[expr.name];
        if (value === undefined)
          throw new LogoError(`Zmienna „${expr.name}” nie ma jeszcze wartości.`, at);
        return value;
      }
      case "counter": {
        for (let i = this.frames.length - 1; i >= 0; i--) {
          const candidate = this.frames[i];
          if (candidate.kind === "repeat") return candidate.iteration;
          if (candidate.kind !== "block") break;
        }
        throw new LogoError("nrpowt działa tylko wewnątrz powtórz.", at);
      }
      case "unary":
        return expr.sign * this.evaluate(expr.operand, frame, at);
      case "binary": {
        const left = this.evaluate(expr.left, frame, at);
        const right = this.evaluate(expr.right, frame, at);
        if (expr.op === "/" && right === 0) throw new LogoError("Dzielenie przez zero.", at);
        const result =
          expr.op === "+" ? left + right : expr.op === "-" ? left - right : expr.op === "*" ? left * right : left / right;
        if (!Number.isFinite(result)) throw new LogoError("Wynik wyrażenia nie jest skończoną liczbą.", at);
        return result;
      }
    }
  }
  private test(condition: Condition, frame: Frame): boolean {
    const left = this.evaluate(condition.left, frame);
    const right = this.evaluate(condition.right, frame);
    switch (condition.op) {
      case "<":
        return left < right;
      case ">":
        return left > right;
      case "=":
        return left === right;
      case "<=":
        return left <= right;
      case ">=":
        return left >= right;
      case "<>":
        return left !== right;
    }
  }
  snapshot(): Drawing {
    return {
      ...this.drawing,
      turtle: { ...this.drawing.turtle },
      segments: [...this.drawing.segments],
    };
  }
  private move(next: Vec3, span: Span) {
    const turtle = this.drawing.turtle;
    if (next.some((n) => !Number.isFinite(n) || Math.abs(n) > LIMITS.coordinate))
      throw new LogoError("Rysunek przekracza zakres współrzędnych ±100 000.", span);
    if (turtle.penDown && next.some((n, i) => n !== turtle.position[i])) {
      if (this.drawing.segments.length >= LIMITS.segments)
        throw new LogoError("Rysunek osiągnął limit 10 000 odcinków.", span);
      this.drawing.segments.push({ from: turtle.position, to: next, color: turtle.color, width: turtle.width });
    }
    turtle.position = next;
  }
  private execute(command: Instruction, value: number) {
    const turtle = this.drawing.turtle;
    switch (command.kind) {
      case "forward":
      case "back":
        this.move(combine(turtle.position, turtle.forward, 1, value * (command.kind === "back" ? -1 : 1)), command.span);
        break;
      case "right":
      case "left": {
        const angle = radians(value) * (command.kind === "right" ? 1 : -1);
        const f = turtle.forward;
        const r = turtle.right;
        turtle.forward = normalize(combine(f, r, Math.cos(angle), Math.sin(angle)));
        turtle.right = normalize(combine(r, f, Math.cos(angle), -Math.sin(angle)));
        break;
      }
      case "pitchup":
      case "pitchdown": {
        const angle = radians(value) * (command.kind === "pitchup" ? 1 : -1);
        const f = turtle.forward;
        const u = turtle.up;
        turtle.forward = normalize(combine(f, u, Math.cos(angle), Math.sin(angle)));
        turtle.up = normalize(combine(u, f, Math.cos(angle), -Math.sin(angle)));
        break;
      }
      case "rollright":
      case "rollleft": {
        const angle = radians(value) * (command.kind === "rollright" ? 1 : -1);
        const u = turtle.up;
        const r = turtle.right;
        turtle.up = normalize(combine(u, r, Math.cos(angle), Math.sin(angle)));
        turtle.right = normalize(combine(r, u, Math.cos(angle), -Math.sin(angle)));
        break;
      }
      case "home":
        this.move([0, 0, 0], command.span);
        turtle.forward = [0, 1, 0];
        turtle.right = [1, 0, 0];
        turtle.up = [0, 0, 1];
        break;
      case "clear":
        this.drawing.segments = [];
        break;
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
        turtle.width = value;
        break;
      default:
        break;
    }
  }
}
