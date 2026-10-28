import { CHALLENGES } from '../logo/challenges';
import { solvedChallenges } from './storage';

export function mountChallenges(root: HTMLElement) {
  const solved = new Set(solvedChallenges());
  const done = CHALLENGES.filter((c) => solved.has(c.id)).length;
  root.innerHTML = `
    <section class="challenges" aria-labelledby="ch-title">
      <h1 id="ch-title">Wyzwania</h1>
      <p>Każde wyzwanie opisuje rysunek. Napisz program, a Logomocja porówna go z wzorem. Zaliczone: <strong>${done} z ${CHALLENGES.length}</strong>.</p>
      <ol class="cards">
        ${CHALLENGES.map((c) => `
          <li class="card ${solved.has(c.id) ? 'solved' : ''}">
            <p class="eyebrow">${c.mode === '2d' ? 'Plan 2D' : 'Przestrzeń 3D'}${solved.has(c.id) ? ' · ✔ zaliczone' : ''}</p>
            <h2>${c.title}</h2>
            <p>${c.task}</p>
            <a class="button primary" href="#/?wyzwanie=${encodeURIComponent(c.id)}">Rozwiąż<span class="sr-only"> wyzwanie: ${c.title}</span></a>
          </li>`).join('')}
      </ol>
    </section>`;
}
