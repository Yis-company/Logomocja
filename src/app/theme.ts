import { storage } from './storage';

export type ThemeChoice = 'auto' | 'light' | 'dark';

const listeners = new Set<() => void>();
let choice: ThemeChoice = 'auto';
let paletteCache: Palette | null = null;

export interface Palette {
  paper: string;
  gridMinor: string;
  gridMajor: string;
  axis: string;
  label: string;
  origin: string;
  ghost: string;
  axisX: string;
  axisY: string;
  axisZ: string;
  ink: string;
}

export function getChoice(): ThemeChoice {
  return choice;
}

export function effectiveTheme(): 'light' | 'dark' {
  if (choice !== 'auto') return choice;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function apply(): void {
  const root = document.documentElement;
  if (choice === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
  root.style.colorScheme = effectiveTheme();
  paletteCache = null;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', effectiveTheme() === 'dark' ? '#0f1715' : '#f4efe4');
  listeners.forEach((l) => l());
}

export function setChoice(next: ThemeChoice): void {
  choice = next;
  storage.setString('theme', next);
  apply();
}

export function cycleChoice(): ThemeChoice {
  const order: ThemeChoice[] = ['auto', 'light', 'dark'];
  const next = order[(order.indexOf(choice) + 1) % order.length];
  setChoice(next);
  return next;
}

export function onThemeChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initTheme(): void {
  const saved = storage.getString('theme');
  choice = saved === 'light' || saved === 'dark' ? saved : 'auto';
  apply();
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
    if (choice === 'auto') apply();
  });
}

export function palette(): Palette {
  if (paletteCache) return paletteCache;
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  paletteCache = {
    paper: v('--paper', '#fbf8f0'),
    gridMinor: v('--grid-minor', '#ece6d6'),
    gridMajor: v('--grid-major', '#ddd5c0'),
    axis: v('--axis', '#a89f88'),
    label: v('--canvas-label', '#8a826d'),
    origin: v('--copper', '#c1763d'),
    ghost: v('--ghost', '#8c9aa6'),
    axisX: v('--axis-x', '#c4483b'),
    axisY: v('--axis-y', '#2e9e5b'),
    axisZ: v('--axis-z', '#2b6fb3'),
    ink: v('--ink', '#1d2a26'),
  };
  return paletteCache;
}
