import { el } from './dom';
import { loadItem, saveItem } from './storage';

export type ThemePreference = 'auto' | 'light' | 'dark';

const KEY = 'motyw';
const LABELS: Record<ThemePreference, string> = {
  auto: 'automatyczny',
  light: 'jasny',
  dark: 'ciemny',
};
const NEXT: Record<ThemePreference, ThemePreference> = { auto: 'light', light: 'dark', dark: 'auto' };

const media = window.matchMedia('(prefers-color-scheme: dark)');
let preference: ThemePreference = readPreference();

function readPreference(): ThemePreference {
  const raw = loadItem(KEY);
  return raw === 'light' || raw === 'dark' ? raw : 'auto';
}

function resolve(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'auto') return media.matches ? 'dark' : 'light';
  return pref;
}

function apply(): void {
  document.documentElement.dataset.theme = resolve(preference);
  document.documentElement.dataset.themePref = preference;
  window.dispatchEvent(new Event('logomocja:theme'));
}

/** Creates the theme button and keeps the page in sync with the system setting while on "automatic". */
export function createThemeButton(): HTMLButtonElement {
  const button = el('button', { class: 'btn btn-ghost', type: 'button' });
  const refresh = (): void => {
    button.textContent = `Motyw: ${LABELS[preference]}`;
    button.setAttribute('aria-label', `Motyw: ${LABELS[preference]}. Kliknij, aby zmienić na ${LABELS[NEXT[preference]]}.`);
    button.title = button.getAttribute('aria-label') ?? '';
  };
  button.addEventListener('click', () => {
    preference = NEXT[preference];
    saveItem(KEY, preference === 'auto' ? '' : preference);
    apply();
    refresh();
  });
  media.addEventListener('change', () => {
    if (preference === 'auto') apply();
  });
  apply();
  refresh();
  return button;
}
