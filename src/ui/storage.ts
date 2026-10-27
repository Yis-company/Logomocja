import type { Mode } from "../lang";

const KEY = "logomocja.v1";

export type ThemeChoice = "auto" | "light" | "dark";

export interface Saved {
  source?: string;
  mode?: Mode;
  speed?: number;
  theme?: ThemeChoice;
}

export function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Saved;
    return typeof data === "object" && data ? data : {};
  } catch {
    return {};
  }
}

export function save(patch: Saved): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...loadSaved(), ...patch }));
  } catch {
    /* storage full or disabled: the draft just isn't kept */
  }
}
