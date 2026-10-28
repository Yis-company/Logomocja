export const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

const MOD = isMac ? '⌘' : 'Ctrl';
const ALT = isMac ? '⌥' : 'Alt';

export interface Shortcut {
  label: string;
  aria: string;
  description: string;
}

export const SHORTCUTS = {
  run: { label: `${MOD}+Enter`, aria: isMac ? 'Meta+Enter' : 'Control+Enter', description: 'Uruchom cały program od początku' },
  step: { label: `${ALT}+K`, aria: 'Alt+K', description: 'Wykonaj jedno polecenie (krok)' },
  pause: { label: `${ALT}+P`, aria: 'Alt+P', description: 'Wstrzymaj albo wznów rysowanie' },
  reset: { label: `${ALT}+R`, aria: 'Alt+R', description: 'Od nowa: wyczyść rysunek i ustaw żółwia na starcie' },
} satisfies Record<string, Shortcut>;

export const EXTRA_SHORTCUTS: { keys: string; description: string }[] = [
  { keys: `${MOD}+Shift+Enter`, description: 'Krok (zamiennik)' },
  { keys: 'Tab / Shift+Tab', description: 'W edytorze: wcięcie i cofnięcie wcięcia zaznaczonych linii' },
  { keys: 'Esc, potem Tab', description: 'Wyjście z edytora klawiaturą (Tab przestaje wstawiać wcięcie)' },
  { keys: `${MOD}+/`, description: 'Zamień zaznaczone linie na komentarz i z powrotem' },
  { keys: 'Strzałki', description: 'Na rysunku: przesuwanie (2D) lub obracanie kamery (3D)' },
  { keys: 'Shift+strzałki', description: 'Na rysunku 3D: przesuwanie kamery' },
  { keys: '+ / −', description: 'Na rysunku: powiększanie i pomniejszanie' },
  { keys: '0', description: 'Na rysunku: dopasuj widok do rysunku' },
  { keys: '?', description: 'Pokaż tę listę skrótów' },
];
