// Hard limits from the Logomocja dialect specification. Exceeding any of them is an error.
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

export type Mode = '2d' | '3d';
