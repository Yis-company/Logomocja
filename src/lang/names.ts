// Command vocabulary: every Polish and English alias maps to one canonical op.

export type PrimOp =
  | "fd"
  | "bk"
  | "rt"
  | "lt"
  | "pu"
  | "pd"
  | "color"
  | "width"
  | "up"
  | "down";

export type ArgKind = "none" | "number" | "color" | "width";

export interface PrimInfo {
  op: PrimOp;
  arg: ArgKind;
  /** Canonical Polish name used in messages. */
  pl: string;
  /** Requires 3D mode. */
  only3d?: boolean;
}

const PRIMS: Array<[PrimInfo, string[]]> = [
  [{ op: "fd", arg: "number", pl: "np" }, ["np", "naprzod", "naprzód", "fd", "forward"]],
  [{ op: "bk", arg: "number", pl: "ws" }, ["ws", "wstecz", "bk", "back"]],
  [{ op: "rt", arg: "number", pl: "pw" }, ["pw", "prawo", "rt", "right"]],
  [{ op: "lt", arg: "number", pl: "lw" }, ["lw", "lewo", "lt", "left"]],
  [{ op: "pu", arg: "none", pl: "pod" }, ["pod", "podnies", "podnieś", "pu", "penup"]],
  [{ op: "pd", arg: "none", pl: "opu" }, ["opu", "opusc", "opuść", "pd", "pendown"]],
  [{ op: "color", arg: "color", pl: "kolor" }, ["kolor", "color"]],
  [{ op: "width", arg: "width", pl: "grubość" }, ["grubosc", "grubość", "width"]],
  [{ op: "up", arg: "number", pl: "góra", only3d: true }, ["gora", "góra", "pitchup"]],
  [{ op: "down", arg: "number", pl: "dół", only3d: true }, ["dol", "dół", "pitchdown"]],
];

export const PRIMITIVES = new Map<string, PrimInfo>();
for (const [info, names] of PRIMS) for (const n of names) PRIMITIVES.set(n, info);

export const REPEAT_WORDS = new Set(["powtorz", "powtórz", "repeat"]);
export const TO_WORDS = new Set(["oto", "to"]);
export const END_WORDS = new Set(["już", "juz", "end"]);
export const PARAMS_WORD = "ma:";

/** All reserved words (cannot be used as procedure or parameter names). */
export const RESERVED = new Set<string>([
  ...PRIMITIVES.keys(),
  ...REPEAT_WORDS,
  ...TO_WORDS,
  ...END_WORDS,
  "ma",
  PARAMS_WORD,
]);

/** Case-insensitive, Unicode-normalised identifier key. */
export function norm(word: string): string {
  return word.normalize("NFC").toLowerCase();
}

export const DEFAULT_COLOR = "#16866a";
export const DEFAULT_WIDTH = 3;

export const LIMITS = {
  sourceChars: 50_000,
  tokens: 10_000,
  depth: 32,
  ops: 10_000,
  segments: 10_000,
  coord: 100_000,
  repeatMax: 10_000,
  widthMin: 1,
  widthMax: 12,
} as const;
