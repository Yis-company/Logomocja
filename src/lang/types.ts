export type Mode = '2d' | '3d';
export type Vec3 = [number, number, number];

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface LogoError {
  message: string;
  line: number;
  column: number;
}

export interface RunResult {
  segments: Segment[];
  error: LogoError | null;
}

export const LIMITS = {
  chars: 50000,
  tokens: 10000,
  nesting: 32,
  frames: 32,
  ops: 10000,
  segments: 10000,
  coord: 100000,
  repeatMax: 10000,
  widthMin: 1,
  widthMax: 12,
} as const;

export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;

/** Error carrying a source position (1-based). */
export class LogoErr extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number,
  ) {
    super(message);
  }
  toJSON(): LogoError {
    return { message: this.message, line: this.line, column: this.column };
  }
}
