import { loadString, saveString } from './storage';

/** 'system' follows the operating system; the other two force a theme. */
export type ThemeChoice = 'system' | 'light' | 'dark';

const KEY = 'motyw';
const ORDER: ThemeChoice[] = ['system', 'light', 'dark'];
const LABELS: Record<ThemeChoice, string> = {
  system: 'Motyw: systemowy',
  light: 'Motyw: jasny',
  dark: 'Motyw: ciemny',
};

let current: ThemeChoice = readChoice();
const listeners = new Set<() => void>();

function readChoice(): ThemeChoice {
  const stored = loadString(KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

export function themeLabel(choice: ThemeChoice = current): string {
  return LABELS[choice];
}

export function applyTheme(): void {
  const root = document.documentElement;
  if (current === 'system') delete root.dataset.theme;
  else root.dataset.theme = current;
  for (const listener of listeners) listener();
}

export function cycleTheme(): void {
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  current = next;
  saveString(KEY, next === 'system' ? '' : next);
  applyTheme();
}

/** Called whenever the theme changes, for example to repaint canvases. */
export function onThemeChange(listener: () => void): void {
  listeners.add(listener);
}

export function initTheme(): void {
  applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (current === 'system') applyTheme();
  });
}

/** Reads a CSS custom property from the document root. */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
