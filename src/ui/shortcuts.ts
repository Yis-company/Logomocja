/** Skróty klawiszowe — jedno źródło prawdy dla obsługi i listy w interfejsie. */

export type ShortcutId = 'run' | 'step' | 'pause' | 'reset' | 'save' | 'help' | 'fit';

export interface Shortcut {
  id: ShortcutId;
  keys: string[];
  label: string;
  /** Skrót działa także, gdy fokus jest w edytorze. */
  inEditor: boolean;
}

export const SHORTCUTS: Shortcut[] = [
  { id: 'run', keys: ['Ctrl+Enter', 'F9'], label: 'Uruchom program od początku', inEditor: true },
  { id: 'step', keys: ['Ctrl+Shift+Enter', 'F10'], label: 'Wykonaj jeden krok (polecenie po poleceniu)', inEditor: true },
  { id: 'pause', keys: ['Ctrl+.', 'F8'], label: 'Wstrzymaj albo wznów wykonanie', inEditor: true },
  { id: 'reset', keys: ['Esc'], label: 'Zatrzymaj, wyczyść rysunek i ustaw żółwia na początku', inEditor: true },
  { id: 'save', keys: ['Ctrl+S'], label: 'Pobierz program jako plik .logo', inEditor: true },
  { id: 'help', keys: ['?'], label: 'Pokaż listę skrótów (poza edytorem)', inEditor: false },
];

export const CANVAS_KEYS: Array<{ keys: string; label: string }> = [
  { keys: 'Strzałki', label: 'Przesuwanie widoku (2D) lub obracanie kamery (3D)' },
  { keys: 'Shift + strzałki', label: 'Przesuwanie widoku' },
  { keys: '+ / −', label: 'Przybliżanie i oddalanie' },
  { keys: '0 lub Home', label: 'Dopasowanie widoku do rysunku' },
];

export const MOUSE_HINTS: Array<{ keys: string; label: string }> = [
  { keys: 'Przeciąganie', label: '2D: przesuwanie widoku · 3D: obracanie kamery' },
  { keys: 'Shift / prawy przycisk + przeciąganie', label: 'Przesuwanie widoku' },
  { keys: 'Kółko myszy · szczypanie', label: 'Przybliżanie i oddalanie' },
  { keys: 'Dwukrotne kliknięcie', label: 'Dopasowanie widoku do rysunku' },
];

export function matchShortcut(e: KeyboardEvent): ShortcutId | null {
  const mod = e.ctrlKey || e.metaKey;
  if (e.altKey) return null;
  const k = e.key;
  if (mod && k === 'Enter') return e.shiftKey ? 'step' : 'run';
  if (mod && !e.shiftKey && (k === '.' || e.code === 'Period')) return 'pause';
  if (mod && !e.shiftKey && (k === 's' || k === 'S')) return 'save';
  if (!mod && !e.shiftKey && k === 'F9') return 'run';
  if (!mod && !e.shiftKey && k === 'F10') return 'step';
  if (!mod && !e.shiftKey && k === 'F8') return 'pause';
  if (!mod && !e.shiftKey && k === 'Escape') return 'reset';
  if (!mod && k === '?') return 'help';
  return null;
}

export function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}

/** Zapis skrótu do wyświetlenia (Ctrl → ⌘ na komputerach Apple). */
export function showKeys(keys: string): string {
  return isMac() ? keys.replace('Ctrl+', '⌘+') : keys;
}

export function tooltip(label: string, id: ShortcutId): string {
  const s = SHORTCUTS.find((x) => x.id === id)!;
  return `${label} (${s.keys.map(showKeys).join(' lub ')})`;
}
