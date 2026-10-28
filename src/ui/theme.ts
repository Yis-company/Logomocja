import { loadTheme, saveTheme, type ThemePref } from './storage';

let pref: ThemePref = loadTheme();
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const listeners = new Set<() => void>();

export const resolvedTheme = (): 'light' | 'dark' => (pref === 'system' ? (mq.matches ? 'dark' : 'light') : pref);
export const themePref = () => pref;
export const onThemeChange = (fn: () => void) => { listeners.add(fn); };

export function applyTheme(): void {
  const t = resolvedTheme();
  document.documentElement.dataset.theme = t;
  document.documentElement.style.colorScheme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#14181f' : '#f6f1e4');
  listeners.forEach((f) => f());
}

export function cycleTheme(): ThemePref {
  pref = pref === 'system' ? 'light' : pref === 'light' ? 'dark' : 'system';
  saveTheme(pref);
  applyTheme();
  return pref;
}

mq.addEventListener('change', () => { if (pref === 'system') applyTheme(); });

export const THEME_LABEL: Record<ThemePref, string> = { system: 'automatyczny', light: 'jasny', dark: 'ciemny' };

/** Colours used by canvas / WebGL drawing; the drawing sheet stays light in both themes. */
export function paper() {
  const dark = resolvedTheme() === 'dark';
  return dark
    ? { bg: '#ece7d9', grid: 'rgba(60,50,30,0.13)', gridStrong: 'rgba(60,50,30,0.28)', axis: 'rgba(60,50,30,0.55)', text: 'rgba(50,42,28,0.75)', marker: '#b4491f' }
    : { bg: '#fffdf7', grid: 'rgba(60,50,30,0.10)', gridStrong: 'rgba(60,50,30,0.24)', axis: 'rgba(60,50,30,0.5)', text: 'rgba(50,42,28,0.7)', marker: '#b4491f' };
}
