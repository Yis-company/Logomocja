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
  sourceChars: 50_000,
  tokens: 10_000,
  bracketDepth: 32,
  frames: 32,
  operations: 10_000,
  segments: 10_000,
  coordinate: 100_000,
  repeatMax: 10_000,
  widthMin: 1,
  widthMax: 12,
} as const;

export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;
