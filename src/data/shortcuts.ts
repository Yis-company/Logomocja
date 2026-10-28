export interface Shortcut {
  keys: string[][];
  label: string;
  /** Wartość atrybutu aria-keyshortcuts. */
  aria: string;
}

export const SHORTCUTS = {
  run: { keys: [['Ctrl', 'Enter']], label: 'Uruchom program od początku', aria: 'Control+Enter Meta+Enter' },
  step: { keys: [['F10']], label: 'Wykonaj jeden krok', aria: 'F10' },
  pause: { keys: [['F8']], label: 'Wstrzymaj lub wznów', aria: 'F8' },
  reset: { keys: [['Esc']], label: 'Zatrzymaj i wyczyść rysunek', aria: 'Escape' },
  fit: { keys: [['F']], label: 'Dopasuj widok (gdy rysunek ma fokus)', aria: 'F' },
  zoom: { keys: [['+'], ['−']], label: 'Przybliż / oddal (gdy rysunek ma fokus)', aria: '+ -' },
  pan: { keys: [['←', '↑', '→', '↓']], label: 'Przesuń widok 2D lub obróć widok 3D (Shift: przesuń)', aria: 'ArrowLeft ArrowRight ArrowUp ArrowDown' },
  home: { keys: [['0']], label: 'Przywróć widok (gdy rysunek ma fokus)', aria: '0' },
  help: { keys: [['Shift', '?']], label: 'Pokaż listę skrótów', aria: 'Shift+?' },
} satisfies Record<string, Shortcut>;
