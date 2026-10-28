export type Action = "run" | "step" | "pause" | "reset";

export const SHORTCUTS: { action: Action; keys: string[]; label: string }[] = [
  { action: "run", keys: ["Ctrl+Enter", "F8"], label: "Uruchom program" },
  { action: "step", keys: ["Ctrl+Shift+Enter", "F10"], label: "Wykonaj jeden krok" },
  { action: "pause", keys: ["Ctrl+Shift+Spacja", "F9"], label: "Pauza / wznów" },
  { action: "reset", keys: ["Ctrl+Shift+Backspace", "F7"], label: "Reset (wyczyść rysunek)" },
];

export function matchShortcut(e: KeyboardEvent): Action | null {
  const mod = e.ctrlKey || e.metaKey;
  if (!e.altKey) {
    if (e.key === "F8" && !mod) return "run";
    if (e.key === "F10" && !mod) return "step";
    if (e.key === "F9" && !mod) return "pause";
    if (e.key === "F7" && !mod) return "reset";
    if (mod && e.key === "Enter") return e.shiftKey ? "step" : "run";
    if (mod && e.shiftKey && (e.key === " " || e.code === "Space")) return "pause";
    if (mod && e.shiftKey && e.key === "Backspace") return "reset";
  }
  return null;
}
