import { Settings, type ThemePref } from './store';

export type ResolvedTheme = 'light' | 'dark';

const listeners = new Set<(t: ResolvedTheme) => void>();
const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;

export function resolveTheme(pref: ThemePref = Settings.theme): ResolvedTheme {
  if (pref === 'light' || pref === 'dark') return pref;
  return mq && mq.matches ? 'dark' : 'light';
}

export function applyTheme(): ResolvedTheme {
  const pref = Settings.theme;
  const resolved = resolveTheme(pref);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.themePref = pref;
  root.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#14191c' : '#f5f2ea');
  for (const l of listeners) l(resolved);
  return resolved;
}

export function setThemePref(pref: ThemePref): void {
  Settings.theme = pref;
  applyTheme();
}

export function cycleTheme(): ThemePref {
  const order: ThemePref[] = ['system', 'light', 'dark'];
  const next = order[(order.indexOf(Settings.theme) + 1) % order.length]!;
  setThemePref(next);
  return next;
}

export function currentTheme(): ResolvedTheme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function onThemeChange(fn: (t: ResolvedTheme) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initTheme(): void {
  applyTheme();
  mq?.addEventListener?.('change', () => {
    if (Settings.theme === 'system') applyTheme();
  });
}

export const THEME_LABEL: Record<ThemePref, string> = {
  system: 'automatyczny (jak w systemie)',
  light: 'jasny',
  dark: 'ciemny',
};
