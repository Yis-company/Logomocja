import { load, save } from './storage';

export type ThemePref = 'system' | 'light' | 'dark';
const media = window.matchMedia?.('(prefers-color-scheme: dark)');

let pref: ThemePref = (load('theme') as ThemePref) || 'system';
if (!['system', 'light', 'dark'].includes(pref)) pref = 'system';
const listeners = new Set<() => void>();

export function themePref(): ThemePref {
  return pref;
}

export function effectiveTheme(): 'light' | 'dark' {
  if (pref === 'system') return media?.matches ? 'dark' : 'light';
  return pref;
}

function apply(): void {
  document.documentElement.dataset.theme = effectiveTheme();
  listeners.forEach((l) => l());
}

export function setThemePref(p: ThemePref): void {
  pref = p;
  save('theme', p);
  apply();
}

export function onThemeChange(l: () => void): void {
  listeners.add(l);
}

media?.addEventListener?.('change', () => {
  if (pref === 'system') apply();
});
apply();
