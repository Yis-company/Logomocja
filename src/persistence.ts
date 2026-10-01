import { defaults } from "./examples";
import { LIMITS, type Mode } from "./logo/types";
export const DRAFT_KEY = "logomocja.drafts.v1";
export type Drafts = { version: 1; mode: Mode; sources: Record<Mode, string> };
export function readDrafts(storage: Pick<Storage, "getItem">): Drafts {
  const fallback: Drafts = { version: 1, mode: "2d", sources: { ...defaults } };
  try {
    const value = JSON.parse(storage.getItem(DRAFT_KEY) ?? "null");
    if (value?.version !== 1 || !["2d", "3d"].includes(value.mode))
      return fallback;
    for (const mode of ["2d", "3d"] as const) {
      if (
        typeof value.sources?.[mode] !== "string" ||
        value.sources[mode].length > LIMITS.source
      )
        return fallback;
    }
    return {
      version: 1,
      mode: value.mode,
      sources: { "2d": value.sources["2d"], "3d": value.sources["3d"] },
    };
  } catch {
    return fallback;
  }
}
export function writeDrafts(
  storage: Pick<Storage, "setItem">,
  drafts: Drafts,
): boolean {
  try {
    storage.setItem(DRAFT_KEY, JSON.stringify(drafts));
    return true;
  } catch {
    return false;
  }
}
