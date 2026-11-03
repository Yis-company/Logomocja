const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export const SHORTCUTS = {
  run: { aria: 'Control+Enter', label: 'Uruchom program od początku' },
  step: { aria: 'Control+Shift+Enter', label: 'Wykonaj jedno polecenie (krok)' },
  pause: { aria: 'Alt+P', label: 'Pauza albo wznowienie' },
  reset: { aria: 'Alt+R', label: 'Reset: wyczyść planszę i ustaw żółwia na starcie' },
} as const;

export type ShortcutAction = keyof typeof SHORTCUTS;

/** Human label for an aria-keyshortcuts value, adapted to the platform. */
export function shortcutLabel(aria: string): string {
  return aria
    .split('+')
    .map((k) => {
      if (k === 'Control') return isMac ? '⌘' : 'Ctrl';
      if (k === 'Alt') return isMac ? '⌥' : 'Alt';
      if (k === 'Shift') return isMac ? '⇧' : 'Shift';
      return k;
    })
    .join(isMac ? '' : '+');
}

export function shortcutKeys(aria: string): string[] {
  return shortcutLabel(aria).split(isMac ? /(?=[A-Z⌘⌥⇧])/ : '+');
}

/** Maps a key event to a studio action (Ctrl or ⌘ both work). */
export function matchShortcut(e: KeyboardEvent): ShortcutAction | null {
  const mod = e.ctrlKey || e.metaKey;
  if (e.key === 'Enter' && mod && !e.altKey) return e.shiftKey ? 'step' : 'run';
  if (e.altKey && !mod && !e.shiftKey) {
    if (e.code === 'KeyP') return 'pause';
    if (e.code === 'KeyR') return 'reset';
  }
  return null;
}
