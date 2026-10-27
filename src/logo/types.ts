export type Mode = '2d' | '3d';

export type Vec3 = [number, number, number];

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface LogoErrorInfo {
  message: string;
  line: number;
  column: number;
}

export interface RunResult {
  segments: Segment[];
  error: LogoErrorInfo | null;
}
