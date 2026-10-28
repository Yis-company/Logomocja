import { load, save, remove } from './storage';

export type ThemeChoice = 'auto' | 'light' | 'dark';

const media = window.matchMedia('(prefers-color-scheme: dark)');
const listeners: (() => void)[] = [];

export function themeChoice(): ThemeChoice {
  const t = load('theme');
  return t === 'light' || t === 'dark' ? t : 'auto';
}

export function resolvedTheme(): 'light' | 'dark' {
  const c = themeChoice();
  if (c !== 'auto') return c;
  return media.matches ? 'dark' : 'light';
}

function apply(): void {
  const root = document.documentElement;
  const c = themeChoice();
  if (c === 'auto') delete root.dataset.theme;
  else root.dataset.theme = c;
  root.dataset.resolvedTheme = resolvedTheme();
  for (const fn of listeners) fn();
}

export function setTheme(choice: ThemeChoice): void {
  if (choice === 'auto') remove('theme');
  else save('theme', choice);
  apply();
}

export function onThemeChange(fn: () => void): void {
  listeners.push(fn);
}

export function initTheme(): void {
  media.addEventListener('change', apply);
  apply();
}
