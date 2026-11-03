import { store } from './storage';

export type ThemePref = 'system' | 'light' | 'dark';

const media = window.matchMedia('(prefers-color-scheme: dark)');
const listeners = new Set<() => void>();

export function themePref(): ThemePref {
  const v = store.get('theme');
  return v === 'light' || v === 'dark' ? v : 'system';
}

export function resolvedTheme(): 'light' | 'dark' {
  const p = themePref();
  return p === 'system' ? (media.matches ? 'dark' : 'light') : p;
}

export function applyTheme() {
  const t = resolvedTheme();
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#0a1311' : '#14302a');
  listeners.forEach((f) => f());
}

export function setThemePref(p: ThemePref) {
  if (p === 'system') store.remove('theme');
  else store.set('theme', p);
  applyTheme();
}

/** System → opposite of the system → the system's own → back to following the system. */
export function nextThemePref(): ThemePref {
  const p = themePref();
  const sys = media.matches ? 'dark' : 'light';
  if (p === 'system') return sys === 'dark' ? 'light' : 'dark';
  if (p !== sys) return sys;
  return 'system';
}

export function onTheme(f: () => void) {
  listeners.add(f);
}

media.addEventListener('change', () => {
  if (themePref() === 'system') applyTheme();
});
