export type Mode = "2d" | "3d";
export type Vec3 = [number, number, number];
export type Span = { line: number; column: number };
export type Numeric = number | { parameter: string; span: Span };
export type Primitive = (
  | {
      kind:
        | "forward"
        | "back"
        | "right"
        | "left"
        | "width"
        | "pitchup"
        | "pitchdown";
      value: Numeric;
    }
  | { kind: "penup" | "pendown" }
  | { kind: "color"; value: string }
) & { span: Span };
export type Instruction =
  | Primitive
  | { kind: "repeat"; count: Numeric; body: Instruction[]; span: Span }
  | { kind: "call"; name: string; args: Numeric[]; span: Span };
export type Definition = {
  readonly name: string;
  readonly params: readonly string[];
  readonly body: readonly Instruction[];
  readonly span: Span;
};
export type Program = {
  readonly instructions: readonly Instruction[];
  readonly definitions: Readonly<Record<string, Definition>>;
};
export type Turtle = {
  position: Vec3;
  forward: Vec3;
  right: Vec3;
  up: Vec3;
  penDown: boolean;
  color: string;
  width: number;
};
export type Segment = { from: Vec3; to: Vec3; color: string; width: number };
export type Drawing = {
  turtle: Turtle;
  segments: Segment[];
  commands: number;
  activeLine: number | null;
};
export const LIMITS = {
  source: 50_000,
  tokens: 10_000,
  depth: 32,
  repeat: 10_000,
  operations: 10_000,
  calls: 32,
  segments: 10_000,
  coordinate: 100_000,
};
export class LogoError extends Error {
  constructor(
    message: string,
    public span: Span = { line: 1, column: 1 },
  ) {
    super(message);
    this.name = "LogoError";
  }
}
export const initialTurtle = (): Turtle => ({
  position: [0, 0, 0],
  forward: [0, 1, 0],
  right: [1, 0, 0],
  up: [0, 0, 1],
  penDown: true,
  color: "#16866a",
  width: 3,
});
export const emptyDrawing = (): Drawing => ({
  turtle: initialTurtle(),
  segments: [],
  commands: 0,
  activeLine: null,
});
