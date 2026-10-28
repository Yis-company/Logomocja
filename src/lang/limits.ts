/** Limity języka (patrz opis dialektu) oraz kilka limitów wewnętrznych. */
export const LIMITS = {
  maxChars: 50_000,
  maxTokens: 10_000,
  maxBracketDepth: 32,
  maxFrames: 32,
  maxOps: 10_000,
  maxSegments: 10_000,
  maxCoord: 100_000,
  maxRepeat: 10_000,
  minWidth: 1,
  maxWidth: 12,
} as const;
