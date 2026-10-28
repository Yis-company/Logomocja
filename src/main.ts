import './style.css';
import { Execution, initialTurtle, run, type Mode, type Result } from './interpreter';
import { examples, type Example } from './examples';
import { challenges, checkChallenge, type Challenge } from './challenges';
import { Editor, escapeHTML } from './editor';
import { DrawingView } from './renderer';
import { icon } from './icons';
import { referenceHTML } from './reference';

type Draft = { source: string; title: string };
type SavedDraft = Draft & { mode: Mode; date: string; id: string };
type Theme = 'system' | 'light' | 'dark';
function read<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(`logomocja:${key}`); return value === null ? fallback : JSON.parse(value); } catch { return fallback; }
}
let storageOK = true;
function write(key: string, value: unknown) {
  try { localStorage.setItem(`logomocja:${key}`, JSON.stringify(value)); storageOK = true; } catch { storageOK = false; }
}
const draftFrom = (e: Example): Draft => ({ source: e.source, title: e.name });
const defaults = { '2d': draftFrom(examples[2]), '3d': draftFrom(examples[8]) };
function readDraft(mode: Mode): Draft {
  const d = read<Draft>(`draft:${mode}`, defaults[mode]);
  return d && typeof d.source === 'string' && typeof d.title === 'string' && d.source.length <= 50000 ? d : defaults[mode];
}
const drafts: Record<Mode, Draft> = { '2d': readDraft('2d'), '3d': readDraft('3d') };
let mode: Mode = read<Mode>('mode', '2d') === '3d' ? '3d' : '2d';
let theme: Theme = read<Theme>('theme', 'system');
if (!['system', 'light', 'dark'].includes(theme)) theme = 'system';
let history = read<SavedDraft[]>('history', []);
if (!Array.isArray(history)) history = [];
history = history.filter(d => d && typeof d.source === 'string' && typeof d.title === 'string' && ['2d', '3d'].includes(d.mode));
let progress = read<string[]>('progress', []);
if (!Array.isArray(progress)) progress = [];
let activeChallenge: Challenge | null = null;
let execution: Execution | null = null;
let running = false;
let animation = 0;
let lastTick = 0;
let route = 'studio';
let previewViews: DrawingView[] = [];
let toastTimer = 0;
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const iconButton = (id: string, symbol: string, label: string, extra = '') => `<button id="${id}" class="icon-button ${extra}" title="${label}" aria-label="${label}">${icon(symbol)}</button>`;

$('app').innerHTML = `
  <a class="skip-link" href="#workspace">Przejdź do edytora</a>
  <header class="site-header"><div class="header-inner">
    <a href="#studio" class="brand" aria-label="Logomocja — studio"><span class="brand-mark">${icon('turtle')}</span><span>logomocja<span class="brand-dot">.</span></span></a>
    <nav class="main-nav" aria-label="Główna nawigacja">
      <a href="#studio" data-page="studio">Studio</a><a href="#examples" data-page="examples">Przykłady</a><a href="#challenges" data-page="challenges">Wyzwania</a><a href="#reference" data-page="reference">Słownik<span class="nav-extra"> poleceń</span></a>
    </nav>
    <div class="header-actions"><span class="local-badge"><span></span> Wszystko zostaje u Ciebie</span>${iconButton('theme', 'sun', 'Motyw: systemowy. Zmień motyw')}</div>
  </div></header>
  <main class="main-container">
    <section id="page-studio" class="page">
      <div class="studio-intro"><div><div class="eyebrow"><span class="tiny-dot"></span> PRZESTRZEŃ DLA TWOJEJ WYOBRAŹNI</div><h1>Małe polecenia.<span> Wielkie możliwości.</span></h1><p>Napisz kilka słów. Poprowadź żółwia. Zobacz, co potrafisz.</p></div><button class="intro-link" id="first-steps">Pierwszy raz? ${icon('arrow')}<span>Zacznij od małego kroku</span></button></div>
      <section id="challenge-panel" class="challenge-panel" hidden aria-label="Aktywne wyzwanie"></section>
      <div class="workspace-topline"><div class="workspace-label">${icon('code')} TWOJE STUDIO <span class="subtle-separator">/</span><span id="project-label">Rozeta</span></div><div class="project-actions"><button id="history" class="text-button">${icon('folder')}<span>Moje szkice</span></button><button id="share" class="text-button">${icon('share')}<span>Udostępnij</span></button></div></div>
      <section id="workspace" class="workspace" aria-label="Studio programowania">
        <div class="editor-pane">
          <div class="pane-header"><div class="file-tab">${icon('file')}<span id="filename">rozeta.logo</span><span class="saved-dot" title="Szkic zapisany lokalnie"></span></div><div class="pane-header-actions">${iconButton('open-file', 'upload', 'Otwórz plik .logo')}${iconButton('save-file', 'download', 'Pobierz program .logo')}</div></div>
          <div class="editor-container"><div id="line-numbers" class="line-numbers" aria-hidden="true"></div><div class="editor-code"><pre id="code-highlight" aria-hidden="true"></pre><textarea id="code-input" aria-label="Kod programu Logo" aria-describedby="editor-help error-message" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea></div></div>
          <div class="editor-tip" id="editor-help">${icon('spark')}<p>Mała zmiana, nowy rysunek.<br><span>Spróbuj zmienić liczbę powtórzeń lub kąt.</span></p><button id="tip-help" class="icon-button" aria-label="Otwórz słownik poleceń" title="Słownik poleceń">${icon('book')}</button></div>
          <div class="run-controls"><button id="run" class="primary-button">${icon('play')}<span>Uruchom</span><kbd>⌘ ↵</kbd></button>${iconButton('step', 'step', 'Wykonaj następne polecenie (F10)')}${iconButton('pause', 'pause', 'Wstrzymaj lub wznów (F8)')}${iconButton('reset', 'reset', 'Wyczyść i resetuj (Shift+Escape)')}<div class="speed-control"><label for="speed">Tempo <span id="speed-value">5×</span></label><input id="speed" type="range" min="1" max="10" value="5" aria-label="Tempo animacji" /></div></div>
          <div class="editor-status"><span id="save-status">${icon('check')} Zapisano lokalnie</span><span id="cursor-position">Wiersz 1, kol. 1</span></div>
        </div>
        <div class="canvas-pane"><div class="pane-header canvas-header"><div class="mode-switch" role="group" aria-label="Tryb rysowania"><button id="mode-2d" aria-pressed="true">${icon('plane')}<strong>2D</strong><span>Płaszczyzna</span></button><button id="mode-3d" aria-pressed="false">${icon('cube')}<strong>3D</strong><span>Przestrzeń</span></button></div><button id="export-png" class="text-button">${icon('image')}<span>Eksport PNG</span></button></div>
          <div class="canvas-area"><canvas id="drawing" tabindex="0" role="img" aria-label="Rysunek żółwia. Strzałki przesuwają, plus i minus zmieniają powiększenie, zero dopasowuje widok." aria-describedby="camera-help"></canvas><div class="canvas-watermark">${icon('turtle')} Twoja wyobraźnia, w ruchu.</div><div class="canvas-controls"><div class="zoom-tools">${iconButton('zoom-out', 'minus', 'Oddal rysunek')}<span id="zoom-level">100%</span>${iconButton('zoom-in', 'plus', 'Przybliż rysunek')}<span class="tool-divider"></span>${iconButton('fit', 'fit', 'Dopasuj cały rysunek')}${iconButton('camera-reset', 'reset', 'Resetuj kamerę')}</div><button id="camera-help-button" class="canvas-help" aria-label="Jak poruszać widokiem?">${icon('help')}</button></div><span id="camera-help" class="sr-only">Przeciągnij, aby przesunąć widok 2D lub obrócić widok 3D. Shift i przeciągnięcie przesuwają w 3D. Dwa palce przesuwają i powiększają. Na klawiaturze: strzałki przesuwają, Shift ze strzałkami obraca widok 3D, plus i minus przybliżają i oddalają, zero resetuje kamerę.</span></div>
          <div class="canvas-status"><span class="execution-status" id="execution-status"><span class="tiny-dot"></span> Gotowe na Twój pomysł</span><div><span id="segment-count">0 odcinków</span><span class="status-divider"></span><span id="coordinates">x: 0 &nbsp; y: 0</span></div></div>
        </div>
      </section>
      <div id="error-message" class="error-message" role="alert" hidden></div>
      <div class="workspace-caption"><span>${icon('turtle')} Każdy wielki pomysł zaczyna się od jednej kreski.</span><button id="shortcuts" class="text-button">${icon('keyboard')} Skróty klawiszowe</button></div>
      <section class="inspiration"><div class="section-heading"><div><h2>Od czego zaczniemy?</h2><p>Otwórz przykład, zmień coś i zobacz, co się stanie.</p></div><a href="#examples" class="arrow-link">Wszystkie przykłady <span>13</span>${icon('arrow')}</a></div><div id="featured-examples" class="featured-grid"></div></section>
      <div class="challenge-banner"><div class="challenge-banner-icon">${icon('flag')}</div><div><h3>Teraz Twoja kolej.</h3><p>Małe wyzwania, które uczą wielkich rzeczy. Sprawdź się z żółwiem.</p></div><a href="#challenges" class="secondary-button">Podejmij wyzwanie ${icon('arrow')}</a></div>
    </section>
    <section id="page-examples" class="page" hidden><div class="page-heading"><span class="eyebrow">13 POMYSŁÓW NA PIERWSZY KROK</span><h1>Podpatrz. Zmień. Stwórz swoje.</h1><p>Od prostego kwadratu po drzewo w przestrzeni. Każdy przykład to początek czegoś nowego.</p></div><div class="library-toolbar"><div class="filter-tabs" role="group" aria-label="Filtr przykładów"><button data-filter="all" aria-pressed="true">Wszystkie <span>13</span></button><button data-filter="2d" aria-pressed="false">Na płaszczyźnie <span>7</span></button><button data-filter="3d" aria-pressed="false">W przestrzeni <span>6</span></button></div><span>${icon('folder')} Poprzedni program zachowamy w „Moich szkicach”.</span></div><div id="example-library" class="example-grid"></div></section>
    <section id="page-challenges" class="page" hidden><div class="page-heading"><span class="eyebrow">NAJLEPIEJ UCZYĆ SIĘ, RYSUJĄC</span><h1>Małe wyzwanie. Duża satysfakcja.</h1><p>Obejrzyj wzór, napisz własny program i sprawdź rezultat. Twoje postępy zapisujemy tutaj, w przeglądarce.</p></div><div class="progress-strip"><span>${icon('flag')} Twoja ścieżka</span><div class="progress-track"><div id="progress-fill"></div></div><strong id="progress-label">0 / 6 ukończonych</strong></div><div id="challenge-library" class="example-grid"></div><p class="checker-note">Sprawdzamy położenie i kształt kresek (tolerancja 0,8 jednostki) oraz łączną długość (1%, minimum 2 jednostki). Kolor, grubość i kolejność rysowania są dowolne. Możesz dzielić boki na mniejsze odcinki.</p></section>
    <section id="page-reference" class="page" hidden>${referenceHTML()}</section>
  </main>
  <footer class="site-footer"><a href="#studio" class="footer-brand">${icon('turtle')} logomocja.</a><span>Trochę nostalgii. Całe mnóstwo możliwości.</span><span>Bez konta. Bez chmury. Po Twojemu.</span></footer>
  <input type="file" id="file-input" accept=".logo,text/plain" hidden />
  <dialog id="dialog"><div class="dialog-top"><span id="dialog-eyebrow" class="eyebrow">LOGOMOCJA</span>${iconButton('close-dialog', 'close', 'Zamknij okno')}</div><div id="dialog-content"></div></dialog>
  <div id="toast" class="toast" role="status" hidden></div>
`;

const editor = new Editor($<HTMLTextAreaElement>('code-input'), $('code-highlight'), $('line-numbers'));
const view = new DrawingView($<HTMLCanvasElement>('drawing'));
const dialog = $<HTMLDialogElement>('dialog');
let dialogReturnFocus: HTMLElement | null = null;
function showDialog(content: string) {
  dialogReturnFocus = document.activeElement as HTMLElement;
  $('dialog-content').innerHTML = content;
  if (!dialog.open) dialog.showModal();
}
dialog.addEventListener('close', () => dialogReturnFocus?.focus());
$('close-dialog').onclick = () => dialog.close();
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
function toast(message: string) {
  clearTimeout(toastTimer); $('toast').textContent = message; $('toast').hidden = false;
  toastTimer = window.setTimeout(() => { $('toast').hidden = true; }, 6500);
}
function themeApply() {
  const dark = theme === 'dark' || theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  view.dark = dark; view.draw(); previewViews.forEach(v => { v.dark = dark; v.draw(); });
  if (challengePreview) { challengePreview.dark = dark; challengePreview.draw(); }
  const name = theme === 'system' ? 'systemowy' : theme === 'dark' ? 'ciemny' : 'jasny';
  $('theme').innerHTML = icon(theme === 'system' ? 'monitor' : theme === 'dark' ? 'moon' : 'sun');
  $('theme').setAttribute('aria-label', `Motyw: ${name}. Zmień motyw`); $('theme').title = `Motyw: ${name}. Kliknij, aby zmienić.`;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#12211c' : '#f6f5f0');
}
$('theme').onclick = () => { theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'; write('theme', theme); themeApply(); toast(`Motyw: ${theme === 'system' ? 'zgodny z systemem' : theme === 'light' ? 'jasny' : 'ciemny'}.`); };
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeApply);
function persist() {
  drafts[mode].source = editor.value; write(`draft:${mode}`, drafts[mode]); write('mode', mode);
  $('save-status').innerHTML = `${icon(storageOK ? 'check' : 'help')} ${storageOK ? 'Zapisano lokalnie' : 'Brak dostępu do zapisu — pobierz plik'} `;
}
function archive(draft: Draft, draftMode: Mode) {
  if (!draft.source.trim() || history.some(d => d.source === draft.source && d.mode === draftMode)) return;
  history.unshift({ ...draft, mode: draftMode, date: new Date().toISOString(), id: crypto.randomUUID?.() || String(Date.now()) });
  write('history', history);
}
function stopAnimation() { running = false; cancelAnimationFrame(animation); updateControls(); }
function updateControls() {
  $('run').innerHTML = `${icon(running ? 'play' : execution && !execution.done ? 'play' : 'play')}<span>${execution && !execution.done && !running ? 'Wznów' : 'Uruchom'}</span><kbd>${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} ↵</kbd>`;
  $<HTMLButtonElement>('run').disabled = running;
  $<HTMLButtonElement>('pause').disabled = !execution || execution.done;
  $('pause').innerHTML = icon(running ? 'pause' : 'play');
  $('pause').setAttribute('aria-label', `${running ? 'Wstrzymaj' : 'Wznów'} program (F8)`);
}
function titleUpdate() {
  $('project-label').textContent = drafts[mode].title;
  $('filename').textContent = `${drafts[mode].title.toLocaleLowerCase('pl').replace(/\s+/g, '-')}.logo`;
  for (const m of ['2d', '3d']) $(`mode-${m}`).setAttribute('aria-pressed', String(m === mode));
}
function status(text: string, kind = '') { $('execution-status').innerHTML = `<span class="tiny-dot ${kind}"></span>${escapeHTML(text)}`; }
function renderExecution() {
  if (!execution) return;
  view.setData(execution.segments, execution.turtle);
  $('segment-count').textContent = `${execution.segments.length} ${execution.segments.length === 1 ? 'odcinek' : 'odcinków'}`;
  const p = execution.turtle.position.map(n => (Math.abs(n) < 0.05 ? 0 : n).toFixed(1).replace('.0', ''));
  $('coordinates').textContent = `x: ${p[0]}   y: ${p[1]}${mode === '3d' ? `   z: ${p[2]}` : ''}`;
  editor.mark(execution.error, execution.done && !execution.error ? null : execution.current?.line || null);
  const error = execution.error;
  $('error-message').hidden = !error;
  if (error) {
    $('error-message').innerHTML = `${icon('help')}<div><strong>Wiersz ${error.line}, kolumna ${error.column}</strong><p>${escapeHTML(error.message)}</p></div><button class="text-button" id="jump-error">Przejdź do błędu ${icon('arrow')}</button>`;
    $('jump-error').onclick = () => editor.focusError();
    status('Poprawmy mały błąd', 'error');
  } else if (execution.done) status('Rysunek gotowy');
  else if (running) status('Żółw rysuje…', 'pulsing');
  else status('Pauza · kolejny krok należy do Ciebie', 'paused');
  updateControls();
}
function freshExecution() { execution = new Execution(editor.value, mode); $('error-message').hidden = true; renderExecution(); }
function animate(time: number) {
  if (!running || !execution) return;
  const speed = Number($<HTMLInputElement>('speed').value), delay = speed >= 9 ? 16 : 650 / (speed * speed);
  if (time - lastTick >= delay) {
    lastTick = time;
    const count = speed === 10 ? 100 : speed >= 8 ? 10 : speed >= 6 ? 3 : 1;
    for (let i = 0; i < count && !execution.done; i++) execution.step();
    if (execution.done) { stopAnimation(); view.fit(); }
    renderExecution();
  }
  if (running) animation = requestAnimationFrame(animate);
}
function start() {
  if (running) return;
  if (!execution || execution.done) freshExecution();
  if (execution!.done) { renderExecution(); return; }
  running = true; lastTick = 0; updateControls(); animation = requestAnimationFrame(animate);
}
function step() { stopAnimation(); if (!execution || execution.done) freshExecution(); execution!.step(); renderExecution(); if (execution!.done) view.fit(); }
function pause() { if (!execution || execution.done) return; if (running) { stopAnimation(); renderExecution(); } else start(); }
function reset() {
  stopAnimation(); execution = null; editor.mark(null, null); view.setData([], initialTurtle()); view.resetCamera();
  $('error-message').hidden = true; $('segment-count').textContent = '0 odcinków'; $('coordinates').textContent = 'x: 0   y: 0'; status('Czyste płótno, nowy początek'); updateControls();
}
function finishNow(): Result {
  stopAnimation(); freshExecution(); const result = execution!.finish(); renderExecution(); view.fit(); return result;
}
editor.onChange = () => {
  stopAnimation(); execution = null; $('error-message').hidden = true;
  if (examples.some(e => e.name === drafts[mode].title) && !examples.some(e => e.source === editor.value)) drafts[mode].title = 'Mój szkic';
  persist(); titleUpdate(); status('Zmieniono program · uruchom, aby zobaczyć');
  updateControls();
};
editor.onCursor = (line, column) => { $('cursor-position').textContent = `Wiersz ${line}, kol. ${column}`; };
view.onChange = () => { $('zoom-level').textContent = `${Math.round(view.scale * 100)}%`; };
$('run').onclick = start; $('step').onclick = step; $('pause').onclick = pause; $('reset').onclick = reset;
$<HTMLInputElement>('speed').oninput = () => { $('speed-value').textContent = `${$<HTMLInputElement>('speed').value}×`; };
$('zoom-in').onclick = () => view.zoom(1.2); $('zoom-out').onclick = () => view.zoom(1 / 1.2); $('fit').onclick = () => view.fit(); $('camera-reset').onclick = () => view.resetCamera();
function changeMode(next: Mode) {
  if (next === mode) return;
  persist(); stopAnimation(); mode = next; activeChallenge = null; renderChallengePanel();
  editor.value = drafts[mode].source; view.setMode(mode); titleUpdate(); persist(); finishNow();
}
$('mode-2d').onclick = () => changeMode('2d'); $('mode-3d').onclick = () => changeMode('3d');
function loadProgram(source: string, nextMode: Mode, title: string, notify = true) {
  clearTimeout(toastTimer); $('toast').hidden = true;
  persist(); stopAnimation();
  if (drafts[nextMode].source !== source) archive(drafts[nextMode], nextMode);
  mode = nextMode; drafts[mode] = { source, title }; editor.value = source; view.setMode(mode);
  titleUpdate(); persist(); navigate('studio'); finishNow();
  if (notify) toast('Program otwarty. Poprzedni program jest bezpieczny w „Moich szkicach”.');
}
function loadExample(example: Example) { activeChallenge = null; renderChallengePanel(); loadProgram(example.source, example.mode, example.name); }
function navigate(page: string) {
  if (!['studio', 'examples', 'challenges', 'reference'].includes(page)) page = 'studio';
  route = page;
  for (const p of ['studio', 'examples', 'challenges', 'reference']) $(`page-${p}`).hidden = p !== page;
  document.querySelectorAll<HTMLAnchorElement>('[data-page]').forEach(a => { if (a.dataset.page === page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (location.hash !== `#${page}`) window.history.replaceState(null, '', `#${page}`);
  document.title = `${page === 'studio' ? 'Studio' : page === 'examples' ? 'Przykłady' : page === 'challenges' ? 'Wyzwania' : 'Słownik poleceń'} — Logomocja`;
  if (page !== 'studio' && running) { stopAnimation(); renderExecution(); }
  requestAnimationFrame(() => { previewViews.forEach(v => v.fit()); if (page === 'studio') view.draw(); });
}
function preview(canvas: HTMLCanvasElement, source: string, previewMode: Mode) {
  const v = new DrawingView(canvas, false), e = new Execution(source, previewMode); e.finish();
  v.mode = previewMode; v.dark = document.documentElement.dataset.theme === 'dark'; v.setData(e.segments, e.turtle); v.fit(); previewViews.push(v); return v;
}
function exampleCard(e: Example, featured = false) {
  return `<button class="example-card${featured ? ' compact-card' : ''}" data-example="${e.id}"><div class="example-art"><canvas data-preview="${e.id}" aria-hidden="true"></canvas><span class="dimension-badge">${e.mode.toUpperCase()}</span>${!featured ? `<span class="example-tag">${e.tag}</span>` : ''}</div><div class="example-card-content"><div><h3>${e.name}</h3><p>${e.description}</p></div><span class="card-arrow">${icon('arrow')}</span></div></button>`;
}
function renderLibraries() {
  $('featured-examples').innerHTML = ['kwadrat', 'gwiazda', 'spirala', 'szescian'].map(id => exampleCard(examples.find(e => e.id === id)!, true)).join('');
  $('example-library').innerHTML = examples.map(e => exampleCard(e)).join('');
  document.querySelectorAll<HTMLButtonElement>('[data-example]').forEach(button => { button.onclick = () => { loadExample(examples.find(e => e.id === button.dataset.example)!); window.scrollTo({ top: 0, behavior: 'smooth' }); }; });
  document.querySelectorAll<HTMLCanvasElement>('[data-preview]').forEach(canvas => { const e = examples.find(e => e.id === canvas.dataset.preview)!; preview(canvas, e.source, e.mode); });
  $('challenge-library').innerHTML = challenges.map(c => `<button class="example-card challenge-card" data-challenge="${c.id}"><div class="example-art"><canvas data-challenge-preview="${c.id}" aria-hidden="true"></canvas><span class="dimension-badge">${c.mode.toUpperCase()}</span><span class="completed-badge" data-completed="${c.id}" ${progress.includes(c.id) ? '' : 'hidden'}>${icon('check')} Ukończone</span></div><div class="challenge-card-content"><span class="eyebrow">${c.level}</span><h3>${c.title}</h3><p>${c.description}</p><span class="arrow-link">Spróbuję ${icon('arrow')}</span></div></button>`).join('');
  document.querySelectorAll<HTMLCanvasElement>('[data-challenge-preview]').forEach(canvas => { const c = challenges.find(c => c.id === canvas.dataset.challengePreview)!; preview(canvas, c.target, c.mode); });
  document.querySelectorAll<HTMLButtonElement>('[data-challenge]').forEach(button => { button.onclick = () => chooseChallenge(challenges.find(c => c.id === button.dataset.challenge)!); });
  updateProgress();
}
function updateProgress() {
  const completed = challenges.filter(c => progress.includes(c.id)).length;
  $('progress-label').textContent = `${completed} / ${challenges.length} ukończonych`; $('progress-fill').style.width = `${completed / challenges.length * 100}%`;
  document.querySelectorAll<HTMLElement>('[data-completed]').forEach(el => { el.hidden = !progress.includes(el.dataset.completed!); });
}
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b => { b.onclick = () => {
  document.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === b)));
  $('example-library').querySelectorAll<HTMLElement>('[data-example]').forEach(card => { card.hidden = b.dataset.filter !== 'all' && examples.find(e => e.id === card.dataset.example)!.mode !== b.dataset.filter; });
  requestAnimationFrame(() => previewViews.forEach(v => v.fit()));
}; });
let challengePreview: DrawingView | null = null;
function renderChallengePanel() {
  challengePreview?.dispose(); challengePreview = null; const panel = $('challenge-panel');
  panel.hidden = !activeChallenge;
  if (!activeChallenge) { panel.innerHTML = ''; return; }
  const c = activeChallenge;
  panel.innerHTML = `<div class="challenge-target"><canvas id="challenge-target" role="img" aria-label="Wzór wyzwania: ${c.title}"></canvas><span>TWÓJ CEL</span></div><div class="challenge-instructions"><span class="eyebrow">WYZWANIE ${c.level}</span><h2>${c.title}</h2><p>${c.description}</p><details><summary>Mała podpowiedź</summary><p>${c.hint}</p></details><p id="challenge-result" role="status" hidden></p></div><div class="challenge-panel-actions"><button id="check-challenge" class="primary-button">${icon('check')} Sprawdź rysunek</button><button id="exit-challenge" class="text-button">Zakończ ćwiczenie ${icon('close')}</button></div>`;
  challengePreview = new DrawingView($<HTMLCanvasElement>('challenge-target'), false); const ex = new Execution(c.target, c.mode); ex.finish(); challengePreview.mode = c.mode; challengePreview.dark = view.dark; challengePreview.setData(ex.segments, ex.turtle); requestAnimationFrame(() => challengePreview?.fit());
  $('check-challenge').onclick = () => {
    finishNow(); const result = checkChallenge(c, editor.value); const el = $('challenge-result'); el.hidden = false; el.textContent = result.message; el.className = result.pass ? 'challenge-pass' : 'challenge-fail';
    if (result.pass && !progress.includes(c.id)) { progress.push(c.id); write('progress', progress); updateProgress(); }
  };
  $('exit-challenge').onclick = () => { activeChallenge = null; renderChallengePanel(); };
}
function chooseChallenge(c: Challenge) { activeChallenge = c; loadProgram(c.starter, c.mode, c.title); renderChallengePanel(); window.scrollTo({ top: 0, behavior: 'smooth' }); editor.input.focus({ preventScroll: true }); }

$('history').onclick = () => {
  showDialog(`<h2>Twoje pomysły mają tu miejsce.</h2><p>Przed otwarciem innego programu odkładamy tutaj poprzedni. Szkice są zapisane tylko w tej przeglądarce.</p><button class="secondary-button" id="new-program">${icon('plus')} Nowy pusty program</button><div class="history-list">${history.length ? history.map(d => `<button class="history-item" data-history="${escapeHTML(d.id)}"><span>${icon('file')}<span><strong>${escapeHTML(d.title)}</strong><small>${d.mode.toUpperCase()} · ${new Date(d.date).toLocaleString('pl-PL')} · ${d.source.split('\n').length} wierszy</small></span></span>${icon('arrow')}</button>`).join('') : '<p class="empty-state">Jeszcze nie ma tu wcześniejszych szkiców.<br>Twój bieżący program zapisuje się automatycznie.</p>'}</div>`);
  $('new-program').onclick = () => { dialog.close(); activeChallenge = null; renderChallengePanel(); loadProgram('; Tutaj zaczyna się Twój pomysł.\n', mode, 'Mój szkic'); editor.input.focus(); };
  dialog.querySelectorAll<HTMLButtonElement>('[data-history]').forEach(b => { b.onclick = () => { const d = history.find(d => d.id === b.dataset.history)!; dialog.close(); activeChallenge = null; renderChallengePanel(); loadProgram(d.source, d.mode, d.title); }; });
};
function download(url: string, filename: string, revoke = false) {
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; document.body.append(anchor); anchor.click(); anchor.remove(); if (revoke) setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$('save-file').onclick = () => { download(URL.createObjectURL(new Blob([editor.value], { type: 'text/plain;charset=utf-8' })), $('filename').textContent || 'program.logo', true); toast('Program zapisany jako plik .logo.'); };
$('open-file').onclick = () => $<HTMLInputElement>('file-input').click();
$<HTMLInputElement>('file-input').onchange = async e => {
  const input = e.target as HTMLInputElement, file = input.files?.[0]; if (!file) return;
  try {
    if (file.size > 200000) throw new Error('Plik jest za duży. Program może mieć do 50 000 znaków.');
    const source = await file.text(); if (source.length > 50000) throw new Error('Program może mieć do 50 000 znaków.');
    activeChallenge = null; renderChallengePanel(); loadProgram(source.replace(/^\uFEFF/, ''), mode, file.name.replace(/\.logo$/i, ''));
  } catch (error) { toast(error instanceof Error ? error.message : 'Nie udało się otworzyć pliku.'); }
  input.value = '';
};
$('export-png').onclick = () => { download(view.png(), `${drafts[mode].title.toLocaleLowerCase('pl')}.png`); toast('Rysunek zapisany jako PNG.'); };
function encode(source: string, shareMode: Mode) {
  const bytes = new TextEncoder().encode(JSON.stringify({ source, mode: shareMode }));
  let binary = ''; for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}
function decode(data: string): { source: string; mode: Mode } {
  if (data.length > 300000) throw new Error('Ten link jest za długi.');
  const bytes = Uint8Array.from(atob(data.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0));
  const result = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  if (!result || typeof result.source !== 'string' || result.source.length > 50000 || !['2d', '3d'].includes(result.mode)) throw new Error('Link zawiera nieprawidłowy program.');
  return result;
}
$('share').onclick = () => {
  const url = `${location.origin}${location.pathname}#p=${encode(editor.value, mode)}`;
  showDialog(`<div class="dialog-symbol">${icon('share')}</div><h2>Pomysły lubią towarzystwo.</h2><p>Ten link zawiera Twój program i tryb ${mode.toUpperCase()}. Po otwarciu rysunek powstanie automatycznie. Niczego nie wysyłamy na serwer.</p><label class="search-label" for="share-url">Link do programu</label><input id="share-url" class="search-input share-input" readonly value="${escapeHTML(url)}" /><button id="copy-link" class="primary-button wide-button">${icon('share')} Kopiuj link</button><p id="copy-result" role="status"></p>`);
  $<HTMLInputElement>('share-url').onclick = () => $<HTMLInputElement>('share-url').select();
  $('copy-link').onclick = async () => {
    try { await navigator.clipboard.writeText(url); $('copy-result').textContent = 'Link skopiowany. Podaj go dalej!'; }
    catch { const input = $<HTMLInputElement>('share-url'); input.focus(); input.select(); $('copy-result').textContent = 'Zaznaczyliśmy link. Skopiuj go skrótem Ctrl+C lub ⌘C.'; }
  };
};
function keyboardHelp() {
  showDialog(`<h2>Mniej kliknięć. Więcej rysowania.</h2><p>Skróty działają także podczas pisania w edytorze.</p><dl class="shortcut-list"><div><dt>Uruchom / wznów</dt><dd><kbd>Ctrl / ⌘</kbd> + <kbd>Enter</kbd></dd></div><div><dt>Następne polecenie</dt><dd><kbd>F10</kbd></dd></div><div><dt>Pauza / wznów</dt><dd><kbd>F8</kbd></dd></div><div><dt>Resetuj wykonanie i płótno</dt><dd><kbd>Shift</kbd> + <kbd>Esc</kbd></dd></div><div><dt>Wcięcie w edytorze</dt><dd><kbd>Tab</kbd></dd></div></dl><p>Na laptopie klawisze F8 i F10 mogą wymagać przytrzymania Fn. Z edytora wyjdziesz do poprzedniej kontrolki przez Shift+Tab.</p>`);
}
$('shortcuts').onclick = keyboardHelp;
$('camera-help-button').onclick = () => { showDialog(`<h2>Spójrz z innej strony.</h2><p>${$('camera-help').textContent}</p><p>W trybie 3D możesz też przesuwać kamerę prawym przyciskiem myszy. Widok jest ortograficzny, więc równoległe linie pozostają równoległe. Kolory osi: X — czerwony, Y — zielony, Z — niebieski.</p><p>Rysujemy rzeczywistą geometrię XYZ bez WebGL. Widok 3D działa także na urządzeniach, które nie obsługują WebGL.</p>`); };
$('first-steps').onclick = () => { chooseChallenge(challenges[0]); };
$('tip-help').onclick = () => navigate('reference');
document.addEventListener('keydown', e => {
  if (dialog.open) return;
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); if (route === 'studio') start(); }
  if (route !== 'studio') return;
  if (e.key === 'F10') { e.preventDefault(); step(); }
  if (e.key === 'F8') { e.preventDefault(); pause(); }
  if (e.key === 'Escape' && e.shiftKey) { e.preventDefault(); reset(); }
});
document.querySelectorAll<HTMLAnchorElement>('[data-section]').forEach(a => { a.onclick = e => { e.preventDefault(); $(a.dataset.section!).scrollIntoView({ behavior: 'smooth', block: 'start' }); }; });
$<HTMLInputElement>('command-search').oninput = e => {
  const query = (e.target as HTMLInputElement).value.toLocaleLowerCase('pl'), entries = [...document.querySelectorAll<HTMLElement>('.command-entry')];
  entries.forEach(entry => { entry.hidden = !entry.dataset.search!.includes(query); }); $('no-commands').hidden = entries.some(e => !e.hidden);
};
async function hashRoute() {
  const hash = location.hash.slice(1);
  if (hash.startsWith('p=')) {
    try { const shared = decode(hash.slice(2)); activeChallenge = null; renderChallengePanel(); loadProgram(shared.source, shared.mode, 'Udostępniony pomysł', false); toast('Otworzono i narysowano udostępniony program. Twój poprzedni szkic jest zachowany.'); }
    catch { navigate('studio'); toast('Nie udało się odczytać linku. Sprawdź, czy został skopiowany w całości.'); }
  } else navigate(hash || 'studio');
}
window.addEventListener('hashchange', hashRoute);
window.addEventListener('pagehide', persist);
declare global { interface Window { logomocja: { version: string; run: (source: string, mode: Mode) => Result; open: (source: string, mode: Mode) => Promise<Result> } } }
window.logomocja = {
  version: '1.0.0', run,
  async open(source, nextMode) {
    activeChallenge = null; renderChallengePanel(); loadProgram(source, nextMode, 'Mój program', false);
    await new Promise<void>(resolve => requestAnimationFrame(() => { view.fit(); requestAnimationFrame(() => resolve()); }));
    return { segments: execution!.segments, error: execution!.error };
  },
};
editor.value = drafts[mode].source; view.setMode(mode); themeApply(); titleUpdate(); renderLibraries();
await hashRoute();
if (!execution) finishNow();
requestAnimationFrame(() => { view.fit(); previewViews.forEach(v => v.fit()); });
