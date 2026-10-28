import { route, type Route } from '../state/router';
import { activeChallenge, mode, setMode } from '../state/studio';
import { cycleTheme, themeLabel, themePref } from '../state/theme';
import { shortcutsOpen } from '../state/ui';
import { Icon, type IconName } from './icons';

const NAV: { href: string; label: string; short: string; icon: IconName; match: Route['name'][] }[] = [
  { href: '#/', label: 'Studio', short: 'Studio', icon: 'code', match: ['studio', 'challenge'] },
  { href: '#/przyklady', label: 'Przykłady', short: 'Przykłady', icon: 'grid', match: ['examples'] },
  { href: '#/wyzwania', label: 'Wyzwania', short: 'Wyzwania', icon: 'flag', match: ['challenges'] },
  { href: '#/opis', label: 'Opis języka', short: 'Opis', icon: 'book', match: ['reference'] },
];

export function Header() {
  const r = route.value;
  const inStudio = r.name === 'studio' || r.name === 'challenge';
  const ch = activeChallenge.value;
  const m = mode.value;
  const pref = themePref.value;
  return (
    <header class="topbar">
      <a class="skip-link" href="#main" onClick={(e) => {
        e.preventDefault();
        document.getElementById('main')?.focus();
      }}>
        Przejdź do treści
      </a>
      <a class="brand" href="#/" aria-label="Logomocja — studio">
        <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="9" class="brand-bg" />
          <ellipse cx="16" cy="17.5" rx="6.6" ry="7.8" class="brand-shell" />
          <circle cx="16" cy="7.2" r="2.7" class="brand-shell" />
          <path d="M16 12.5l3.6 2.5v4.6L16 22l-3.6-2.4V15z" class="brand-hex" />
        </svg>
        <span class="brand-name">Logomocja</span>
      </a>
      <nav class="nav" aria-label="Główna nawigacja">
        <ul>
          {NAV.map((n) => {
            const current = n.match.includes(r.name);
            return (
              <li key={n.href}>
                <a href={n.href} class="nav-link" aria-current={current ? 'page' : undefined} title={n.label}>
                  <Icon name={n.icon} size={18} />
                  {n.short === n.label ? (
                    <span>{n.label}</span>
                  ) : (
                    <>
                      <span class="nav-long">{n.label}</span>
                      <span class="nav-short" aria-hidden="true">{n.short}</span>
                    </>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div class="topbar-tools">
        {inStudio && (
          <div class="mode-switch" role="group" aria-label="Tryb rysowania">
            {(['2d', '3d'] as const).map((value) => (
              <button
                key={value}
                type="button"
                class="mode-btn"
                aria-pressed={m === value}
                disabled={!!ch && ch.mode !== value}
                title={ch ? 'Tryb ustala wyzwanie' : value === '2d' ? 'Rysowanie na płaszczyźnie' : 'Rysowanie w przestrzeni'}
                onClick={() => setMode(value)}
              >
                <Icon name={value === '2d' ? 'square' : 'cube'} size={16} />
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          class="tool tool-shortcuts"
          onClick={() => (shortcutsOpen.value = true)}
          aria-label="Skróty klawiszowe"
          title="Skróty klawiszowe (?)"
        >
          <Icon name="keyboard" />
        </button>
        <button
          type="button"
          class="tool"
          onClick={cycleTheme}
          aria-label={`Motyw: ${themeLabel(pref)}. Zmień motyw`}
          title={`Motyw: ${themeLabel(pref)} (kliknij, aby zmienić)`}
        >
          <Icon name={pref === 'system' ? 'system' : pref === 'light' ? 'sun' : 'moon'} />
        </button>
      </div>
    </header>
  );
}
