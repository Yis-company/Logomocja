import { run } from '../lang/interp';
import { EXAMPLES } from '../examples';
import { TASKS, solutionSegments } from '../challenges';
import { thumbSVG } from './thumb';
import { icon } from './icons';
import { loadJSON, type Progress } from './store';
import { plural } from '../lang/parser';

export function galleryPage(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'page page-gallery';
  const cells = EXAMPLES.map((ex, i) => {
    const r = run(ex.source, ex.mode);
    return `
      <li>
        <a class="cell" href="#/przyklady/${ex.id}">
          <span class="cell-fig">${thumbSVG(r.segments, ex.mode, `Rysunek: ${ex.title}`)}</span>
          <span class="cell-meta">
            <span class="cell-no">Rys. ${i + 1}.</span>
            <span class="cell-title">${ex.title}</span>
            <span class="chip">${ex.mode.toUpperCase()}</span>
          </span>
          <span class="cell-desc">${ex.tagline}</span>
        </a>
      </li>`;
  }).join('');
  el.innerHTML = `
    <header class="page-head">
      <h1>Przykłady</h1>
      <p class="lede">Trzynaście programów do uruchomienia i przerabiania. Wybierz rysunek, a jego kod otworzy się w pracowni we właściwym trybie. Twój szkic trafi do schowka, więc go nie stracisz.</p>
    </header>
    <ul class="grid" role="list">${cells}</ul>`;
  return el;
}

export function tasksPage(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'page page-tasks';
  const progress = loadJSON<Progress>('zadania', {});
  const solved = TASKS.filter((t) => progress[t.id]?.solved).length;
  const cells = TASKS.map((t, i) => {
    const ok = !!progress[t.id]?.solved;
    return `
      <li>
        <a class="cell cell-task ${ok ? 'is-solved' : ''}" href="#/zadania/${t.id}">
          <span class="cell-fig ghost">${thumbSVG(solutionSegments(t), t.mode, `Wzór: ${t.title}`, true)}</span>
          <span class="cell-meta">
            <span class="zad" aria-hidden="true">${i + 1}</span>
            <span class="cell-title"><span class="sr-only">Zadanie ${i + 1}. </span>${t.title}</span>
            <span class="chip ${ok ? 'chip-ok' : ''}">${ok ? icon('check') + 'Rozwiązane' : t.mode.toUpperCase()}</span>
          </span>
          <span class="cell-desc">${t.prompt}</span>
        </a>
      </li>`;
  }).join('');
  el.innerHTML = `
    <header class="page-head">
      <h1>Zadania</h1>
      <p class="lede">Każde zadanie pokazuje wzór. Napisz program, który go narysuje, i naciśnij „Sprawdź”. Liczy się kształt: kolejność i kierunek rysowania są dowolne, dopuszczalna odchyłka to 1,5 kroku żółwia.</p>
      <p class="progress" aria-label="Postęp"><span class="progress-bar" style="--p:${solved / TASKS.length}" aria-hidden="true"></span><span>Rozwiązane: <strong>${solved}</strong> z ${TASKS.length} ${plural(TASKS.length, 'zadania', 'zadań', 'zadań')}</span></p>
    </header>
    <ul class="grid" role="list">${cells}</ul>`;
  return el;
}
