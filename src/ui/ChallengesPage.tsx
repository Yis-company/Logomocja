import { CHALLENGES } from '../content/challenges';
import { challengeProgress } from '../state/studio';
import { Icon } from './icons';
import { Thumbnail } from './Thumbnail';

export function ChallengesPage() {
  const prog = challengeProgress.value;
  const solved = CHALLENGES.filter((c) => prog[c.id]?.solved).length;
  return (
    <main class="page" id="main" tabIndex={-1}>
      <header class="page-head">
        <h1>Wyzwania</h1>
        <p>
          Każde wyzwanie pokazuje wzór do narysowania. Napisz program, naciśnij <strong>Sprawdź</strong>, a Logomocja porówna Twój rysunek
          ze wzorem. Liczy się kształt i wymiary — rysunek może zaczynać się w innym miejscu, a boki możesz rysować w dowolnej kolejności.
        </p>
        <div class="progress-line">
          <progress max={CHALLENGES.length} value={solved} aria-label="Postęp w wyzwaniach" />
          <span>
            Rozwiązane: {solved} z {CHALLENGES.length}
          </span>
        </div>
      </header>
      <ol class="cards">
        {CHALLENGES.map((c, i) => {
          const done = prog[c.id]?.solved;
          const started = !!prog[c.id];
          return (
            <li key={c.id} class={`card${done ? ' card-done' : ''}`}>
              <Thumbnail code={c.solution} mode={c.mode} asTarget label={`Wzór: ${c.task}`} />
              <div class="card-body">
                <h2 class="card-title">
                  {i + 1}. {c.title}
                </h2>
                <p class="card-tags">
                  <span class="badge">{c.mode.toUpperCase()}</span>
                  <span class="badge badge-level">
                    {'★'.repeat(c.level)}
                    <span class="sr-only">poziom {c.level}</span>
                  </span>
                  {done && (
                    <span class="badge badge-ok">
                      <Icon name="check" size={14} /> rozwiązane
                    </span>
                  )}
                </p>
                <p>{c.task}</p>
              </div>
              <div class="card-actions">
                <a class="btn btn-small btn-primary" href={`#/wyzwanie/${c.id}`} aria-label={`${done ? 'Otwórz' : started ? 'Kontynuuj' : 'Rozpocznij'} wyzwanie ${c.title}`}>
                  {done ? 'Otwórz' : started ? 'Kontynuuj' : 'Rozpocznij'}
                </a>
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
