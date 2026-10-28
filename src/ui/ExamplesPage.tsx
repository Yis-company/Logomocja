import { EXAMPLES, type Example } from '../content/examples';
import { navigate } from '../state/router';
import { deleteProgram, loadProgram, programs, renameProgram, restoreProgram, type SavedProgram } from '../state/studio';
import { ask, toast } from '../state/ui';
import { downloadText, slug } from './files';
import { Icon } from './icons';
import { Thumbnail } from './Thumbnail';

async function openExample(ex: Example): Promise<void> {
  const ok = await loadProgram(ex.source, ex.mode, { title: ex.title, animate: true });
  if (ok) navigate({ name: 'studio' });
}

async function openSaved(p: SavedProgram): Promise<void> {
  const ok = await loadProgram(p.code, p.mode, { title: p.name });
  if (ok) navigate({ name: 'studio' });
}

async function rename(p: SavedProgram): Promise<void> {
  const { choice, input } = await ask('Zmień nazwę', 'Podaj nową nazwę programu.', [
    { value: 'ok', label: 'Zmień', primary: true },
    { value: 'cancel', label: 'Anuluj' },
  ], { label: 'Nazwa', value: p.name });
  if (choice === 'ok' && input?.trim()) renameProgram(p.id, input.trim());
}

function remove(p: SavedProgram): void {
  const removed = deleteProgram(p.id);
  if (removed) toast(`Usunięto „${p.name}”.`, { action: { label: 'Cofnij', run: () => restoreProgram(removed) } });
}

function ExampleCard({ ex }: { ex: Example }) {
  return (
    <li class="card">
      <Thumbnail code={ex.source} mode={ex.mode} label={`Rysunek programu ${ex.title}`} />
      <div class="card-body">
        <h3>
          {ex.title} <span class="badge">{ex.mode.toUpperCase()}</span>
        </h3>
        <p>{ex.blurb}</p>
        <p class="card-meta">
          Nazwa: <code>{ex.id}</code>
        </p>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-primary btn-small" onClick={() => openExample(ex)} aria-label={`Otwórz przykład ${ex.title}`}>
          <Icon name="play" size={16} /> <span>Otwórz</span>
        </button>
      </div>
    </li>
  );
}

export function ExamplesPage() {
  const list = programs.value;
  return (
    <main class="page" id="main" tabIndex={-1}>
      <header class="page-head">
        <h1>Przykłady</h1>
        <p>
          Trzynaście programów na dobry początek. Otwórz dowolny, popatrz, jak rysuje żółw, a potem zmieniaj liczby i kolory. Przykład można też
          wczytać adresem <code>#/przyklad/nazwa</code>, np. <a href="#/przyklad/gwiazda">#/przyklad/gwiazda</a>.
        </p>
      </header>
      <section aria-labelledby="ex-2d">
        <h2 id="ex-2d">Na płaszczyźnie (2D)</h2>
        <ul class="cards">
          {EXAMPLES.filter((e) => e.mode === '2d').map((ex) => (
            <ExampleCard key={ex.id} ex={ex} />
          ))}
        </ul>
      </section>
      <section aria-labelledby="ex-3d">
        <h2 id="ex-3d">W przestrzeni (3D)</h2>
        <ul class="cards">
          {EXAMPLES.filter((e) => e.mode === '3d').map((ex) => (
            <ExampleCard key={ex.id} ex={ex} />
          ))}
        </ul>
      </section>
      <section aria-labelledby="mine">
        <h2 id="mine">Moje programy</h2>
        {list.length === 0 ? (
          <p class="empty">
            Nie masz jeszcze zapisanych programów. W studiu użyj przycisku <strong>Zapisz</strong>. Kopie szkiców zastąpionych przykładami też
            trafiają tutaj.
          </p>
        ) : (
          <ul class="saved">
            {list.map((p) => (
              <li key={p.id} class="saved-item">
                <Thumbnail code={p.code} mode={p.mode} label={`Rysunek programu ${p.name}`} width={96} height={64} />
                <div class="saved-info">
                  <strong>{p.name}</strong>
                  <span class="card-meta">
                    {p.mode.toUpperCase()} · {new Date(p.updated).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <div class="saved-actions">
                  <button type="button" class="btn btn-small btn-primary" onClick={() => openSaved(p)} aria-label={`Otwórz ${p.name}`}>
                    Otwórz
                  </button>
                  <button type="button" class="tool" onClick={() => rename(p)} aria-label={`Zmień nazwę: ${p.name}`} title="Zmień nazwę">
                    <Icon name="pencil" size={18} />
                  </button>
                  <button type="button" class="tool" onClick={() => downloadText(p.code, `${slug(p.name)}.logo`)} aria-label={`Pobierz ${p.name}`} title="Pobierz .logo">
                    <Icon name="download" size={18} />
                  </button>
                  <button type="button" class="tool" onClick={() => remove(p)} aria-label={`Usuń ${p.name}`} title="Usuń">
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
