import { useEffect, useRef } from 'preact/hooks';
import { findExample } from '../content/examples';
import { navigate, route } from '../state/router';
import { decodeProgram } from '../state/permalink';
import { activeChallenge, enterChallenge, getViewport, leaveChallenge, loadProgram, player, run } from '../state/studio';
import { shortcutsOpen, toast } from '../state/ui';
import { ChallengesPage } from './ChallengesPage';
import { DialogHost } from './Dialogs';
import { ExamplesPage } from './ExamplesPage';
import { Header } from './Header';
import { ReferencePage } from './ReferencePage';
import { Studio } from './Studio';
import { Toasts } from './Toasts';

const TITLES: Record<string, string> = {
  studio: 'Studio',
  challenge: 'Wyzwanie',
  examples: 'Przykłady',
  challenges: 'Wyzwania',
  reference: 'Opis języka',
  notfound: 'Nie ma takiej strony',
};

function NotFound() {
  return (
    <main class="page" id="main" tabIndex={-1}>
      <h1>Nie ma takiej strony</h1>
      <p>
        Ten adres nie prowadzi do żadnej części Logomocji. <a href="#/">Wróć do studia</a>.
      </p>
    </main>
  );
}

let initialRunDone = false;

function initialRun(): void {
  if (initialRunDone) return;
  initialRunDone = true;
  const tryRun = () => {
    if (getViewport()) {
      if (!player.outcome && !activeChallenge.peek()) run({ instant: true, fit: true, resetCamera: true });
    } else requestAnimationFrame(tryRun);
  };
  tryRun();
}

export function App() {
  const r = route.value;
  const first = useRef(true);

  useEffect(() => {
    const cur = route.value;
    document.title = `${cur.name === 'challenge' && activeChallenge.peek() ? activeChallenge.peek()!.title : TITLES[cur.name] ?? 'Studio'} — Logomocja`;
    switch (cur.name) {
      case 'studio':
        if (activeChallenge.peek()) leaveChallenge();
        initialRun();
        break;
      case 'challenge':
        initialRunDone = true;
        if (!enterChallenge(cur.id)) {
          toast('Nie ma takiego wyzwania.', { tone: 'error' });
          navigate({ name: 'challenges' }, true);
        } else {
          document.title = `${activeChallenge.peek()!.title} — Logomocja`;
        }
        break;
      case 'example': {
        initialRunDone = true;
        const ex = findExample(cur.id);
        if (!ex) {
          toast(`Nie ma przykładu „${cur.id}”.`, { tone: 'error' });
          navigate({ name: 'examples' }, true);
          break;
        }
        loadProgram(ex.source, ex.mode, { title: ex.title, animate: true }).finally(() => navigate({ name: 'studio' }, true));
        break;
      }
      case 'permalink': {
        initialRunDone = true;
        const m = cur.mode === '3d' ? '3d' : '2d';
        decodeProgram(cur.data)
          .then((code) => loadProgram(code, m, { title: 'program z linku', confirm: false }))
          .catch(() => toast('Ten link jest uszkodzony — nie udało się odczytać programu.', { tone: 'error' }))
          .finally(() => navigate({ name: 'studio' }, true));
        break;
      }
    }
    if (!first.current) {
      const main = document.getElementById('main');
      if (main && cur.name !== 'reference') main.focus({ preventScroll: true });
      if (cur.name !== 'reference') window.scrollTo(0, 0);
    }
    first.current = false;
  }, [r]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '?' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.isContentEditable)) return;
      e.preventDefault();
      shortcutsOpen.value = true;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  let page;
  switch (r.name) {
    case 'examples':
      page = <ExamplesPage />;
      break;
    case 'challenges':
      page = <ChallengesPage />;
      break;
    case 'reference':
      page = <ReferencePage section={r.section} />;
      break;
    case 'notfound':
      page = <NotFound />;
      break;
    default:
      page = <Studio />;
  }

  return (
    <div class={`app app-${r.name}`}>
      <Header />
      {page}
      <DialogHost />
      <Toasts />
    </div>
  );
}
