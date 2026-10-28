import { computed, signal } from '@preact/signals';
import { load, save } from './storage';

export type ThemePref = 'system' | 'light' | 'dark';

const media = window.matchMedia('(prefers-color-scheme: dark)');
const systemDark = signal(media.matches);
media.addEventListener('change', (e) => {
  systemDark.value = e.matches;
});

const stored = load<string>('theme', 'system');
export const themePref = signal<ThemePref>(stored === 'light' || stored === 'dark' ? stored : 'system');
export const theme = computed<'light' | 'dark'>(() =>
  themePref.value === 'system' ? (systemDark.value ? 'dark' : 'light') : themePref.value,
);

function apply(): void {
  const root = document.documentElement;
  root.dataset.theme = theme.value;
  root.style.colorScheme = theme.value;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme.value === 'dark' ? '#14191b' : '#f6f2e9');
}

theme.subscribe(apply);

export function cycleTheme(): void {
  const order: ThemePref[] = ['system', 'light', 'dark'];
  themePref.value = order[(order.indexOf(themePref.value) + 1) % order.length];
  save('theme', themePref.value);
}

export function themeLabel(p: ThemePref): string {
  return p === 'system' ? 'systemowy' : p === 'light' ? 'jasny' : 'ciemny';
}
