import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DrawingCanvas, type DrawingCanvasHandle } from './DrawingCanvas';
import { commandNames, compileProgram, logoError, LogoMachine, runLogo, type Mode, type RunResult, type Segment, type Vec3 } from './interpreter';
import { examples, type Example } from './examples';
import './style.css';

type Page = 'studio' | 'examples' | 'challenges' | 'reference';
type Challenge = { id: string; title: string; tier: string; prompt: string; hint: string; expected: string };
const challenges: Challenge[] = [
  { id: 'square', title: 'Kwadrat', tier: 'Start', prompt: 'Narysuj kwadrat o boku 80. Wróć do punktu początkowego.', hint: 'Cztery równe boki i cztery kąty proste.', expected: 'powtorz 4 [np 80 pw 90]' },
  { id: 'triangle', title: 'Trójkąt', tier: 'Start', prompt: 'Zbuduj równoboczny trójkąt o boku 90.', hint: 'Skręć o 120° po każdym boku.', expected: 'powtorz 3 [np 90 pw 120]' },
  { id: 'rectangle', title: 'Prostokąt', tier: 'Ćwiczenie', prompt: 'Narysuj prostokąt o bokach 120 i 60.', hint: 'Dwa razy powtórz dłuższy i krótszy bok.', expected: 'powtorz 2 [np 120 pw 90 np 60 pw 90]' },
  { id: 'hexagon', title: 'Sześciokąt', tier: 'Ćwiczenie', prompt: 'Narysuj sześciokąt foremny o boku 60.', hint: 'Suma skrętów na pełnym okręgu to 360°.', expected: 'powtorz 6 [np 60 pw 60]' },
  { id: 'star', title: 'Pięcioramienna gwiazda', tier: 'Wyzwanie', prompt: 'Narysuj pięcioramienną gwiazdę z odcinków długości 120.', hint: 'Przeskakuj między wierzchołkami, skręcając o 144°.', expected: 'powtorz 5 [np 120 pw 144]' },
];
const defaultTurtle = { pos: [0, 0, 0] as Vec3, heading: [0, 1, 0] as Vec3, right: [1, 0, 0] as Vec3, up: [0, 0, 1] as Vec3 };
const initial2d = examples[0].source;
const initial3d = examples.find(item => item.id === 'schody')!.source;
type TurtleView = typeof defaultTurtle;
type Theme = 'system' | 'light' | 'dark';

function readStore<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function copyTurtle(machine: LogoMachine): TurtleView {
  return { pos: [...machine.turtle.pos], heading: [...machine.turtle.heading], right: [...machine.turtle.right], up: [...machine.turtle.up] };
}
function segmentWord(count: number) {
  if (count === 1) return 'odcinek';
  if (count % 10 >= 2 && count % 10 <= 4 && !(count % 100 >= 12 && count % 100 <= 14)) return 'odcinki';
  return 'odcinków';
}
function encode(value: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join('')).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}
function sharedLink() {
  try {
    const match = location.hash.match(/^#share=([\w-]+)$/);
    if (!match) return null;
    const encoded = match[1].replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - match[1].length % 4) % 4);
    const bytes = Uint8Array.from(atob(encoded), char => char.charCodeAt(0));
    const value = JSON.parse(new TextDecoder().decode(bytes));
    return typeof value.source === 'string' && ['2d', '3d'].includes(value.mode) ? value as { source: string; mode: Mode } : null;
  } catch { return null; }
}
function Icon({ name, size = 17 }: { name: string; size?: number }) {
  const icon: Record<string, React.ReactNode> = {
    turtle: <><ellipse cx="12" cy="13" rx="7" ry="5"/><path d="m7 9-2-3m12 3 2-3M7 17l-2 2m12-2 2 2M18 12h3"/><circle cx="8" cy="12" r=".4" fill="currentColor"/><circle cx="16" cy="12" r=".4" fill="currentColor"/></>,
    play: <path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/>, pause: <><path d="M7 5h4v14H7zM15 5h4v14h-4z" fill="currentColor" stroke="none"/></>,
    step: <><path d="M5 5v14l10-7z" fill="currentColor"/><path d="M19 5v14"/></>, reset: <><path d="M4 11a8 8 0 1 1 2.2 5.5"/><path d="M4 5v6h6"/></>,
    fit: <><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M8 8h8v8H8z"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>, minus: <path d="M5 12h14"/>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5"/><path d="M4 17v3h16v-3"/></>, upload: <><path d="M12 15V3m-5 5 5-5 5 5"/><path d="M4 17v3h16v-3"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></>,
    book: <><path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 5v14m4-12h8m-8 3h8"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8" fill="currentColor"/></>,
    grid: <><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.1-7.1-1.4 1.4M6.3 17.7l-1.4 1.4m14.2 0-1.4-1.4M6.3 6.3 4.9 4.9"/></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>,
    check: <path d="m5 12 4 4L19 6"/>, close: <path d="m6 6 12 12M18 6 6 18"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon[name] || <circle cx="12" cy="12" r="8" />}</svg>;
}

function App() {
  const share = useMemo(sharedLink, []);
  const [mode, setMode] = useState<Mode>(() => share?.mode || readStore('logomocja:mode', '2d'));
  const [drafts, setDrafts] = useState<Record<Mode, string>>(() => ({ '2d': readStore('logomocja:draft:2d', initial2d), '3d': readStore('logomocja:draft:3d', initial3d) }));
  const [page, setPage] = useState<Page>('studio');
  const [theme, setTheme] = useState<Theme>(() => readStore('logomocja:theme', 'system'));
  const [systemDark, setSystemDark] = useState(() => matchMedia?.('(prefers-color-scheme: dark)').matches || false);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [turtle, setTurtle] = useState<TurtleView>(defaultTurtle);
  const [penDown, setPenDown] = useState(true);
  const [error, setError] = useState<RunResult['error']>(null);
  const [runLine, setRunLine] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'done' | 'error'>('idle');
  const [speed, setSpeed] = useState(80);
  const [fitKey, setFitKey] = useState(0);
  const [cameraKey, setCameraKey] = useState(0);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState<Example | null>(null);
  const [backup, setBackup] = useState<{ mode: Mode; source: string } | null>(() => readStore('logomocja:backup', null));
  const [taskId, setTaskId] = useState(challenges[0].id);
  const [taskDrafts, setTaskDrafts] = useState<Record<string, string>>(() => readStore('logomocja:taskDrafts', {}));
  const [progress, setProgress] = useState<Record<string, boolean>>(() => readStore('logomocja:progress', {}));
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [query, setQuery] = useState('');
  const machine = useRef<LogoMachine | null>(null);
  const canvas = useRef<DrawingCanvasHandle>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const loadTextRef = useRef<(source: string, selected: Mode, immediate?: boolean) => void>(() => {});
  const current = drafts[mode];
  const dark = theme === 'dark' || (theme === 'system' && systemDark);
  const task = challenges.find(item => item.id === taskId)!;
  const expected = useMemo(() => runLogo(task.expected, '2d').segments, [task]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemDark(mq.matches);
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; document.documentElement.style.colorScheme = dark ? 'dark' : 'light'; }, [dark]);
  useEffect(() => { localStorage.setItem('logomocja:mode', JSON.stringify(mode)); localStorage.setItem('logomocja:draft:2d', JSON.stringify(drafts['2d'])); localStorage.setItem('logomocja:draft:3d', JSON.stringify(drafts['3d'])); }, [mode, drafts]);
  useEffect(() => { localStorage.setItem('logomocja:theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('logomocja:backup', JSON.stringify(backup)); }, [backup]);
  useEffect(() => { localStorage.setItem('logomocja:taskDrafts', JSON.stringify(taskDrafts)); }, [taskDrafts]);
  useEffect(() => { localStorage.setItem('logomocja:progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { if (!message) return; const id = setTimeout(() => setMessage(''), 4000); return () => clearTimeout(id); }, [message]);

  const clearOutput = () => { machine.current = null; setSegments([]); setTurtle(defaultTurtle); setPenDown(true); setRunLine(null); setError(null); setStatus('idle'); };
  const selectMode = (selected: Mode) => {
    if (selected === mode) return;
    machine.current = null;
    setMode(selected);
    clearOutput();
  };
  const updateDraft = (value: string) => {
    setDrafts(previous => ({ ...previous, [mode]: value }));
    if (status === 'running' || status === 'paused') setMessage('Wykonywanie przerwane po zmianie kodu. Szkic został zapisany.');
    if (status !== 'idle') { machine.current = null; setStatus('idle'); }
    setRunLine(null);
    setError(null);
  };
  const createMachine = (source: string, selected: Mode) => {
    try { return new LogoMachine(compileProgram(source, selected)); }
    catch (problem) { const issue = logoError(problem); setSegments([]); setTurtle(defaultTurtle); setPenDown(true); setError(issue); setRunLine(null); setStatus('error'); return null; }
  };
  const doStep = (vm: LogoMachine) => {
    const result = vm.step();
    setSegments([...vm.segments]); setTurtle(copyTurtle(vm)); setPenDown(vm.turtle.penDown); setRunLine(result.line);
    if (result.error) { setError(result.error); setStatus('error'); }
    else if (result.done) setStatus('done');
  };
  const run = () => {
    clearOutput();
    const vm = createMachine(current, mode);
    if (!vm) return;
    machine.current = vm; setStatus('running');
  };
  const step = () => {
    let vm = machine.current;
    if (!vm || vm.done) { clearOutput(); const fresh = createMachine(current, mode); if (!fresh) return; vm = fresh; machine.current = vm; }
    setStatus('paused'); doStep(vm);
  };
  useEffect(() => {
    if (status !== 'running') return;
    const id = window.setTimeout(() => { if (machine.current && !machine.current.done) doStep(machine.current); else setStatus('done'); }, speed);
    return () => window.clearTimeout(id);
  }, [status, speed, runLine, segments]);

  const loadText = (source: string, selected: Mode, immediate = false) => {
    setMode(selected); setPage('studio'); setDrafts(previous => ({ ...previous, [selected]: source }));
    machine.current = null; setSegments([]); setTurtle(defaultTurtle); setPenDown(true); setError(null); setRunLine(null); setStatus('idle');
    if (immediate) {
      try {
        const vm = new LogoMachine(compileProgram(source, selected));
        const result = vm.runToEnd(); setSegments([...result.segments]); setTurtle(copyTurtle(vm)); setPenDown(vm.turtle.penDown); setError(result.error); setStatus(result.error ? 'error' : 'done');
        if (!result.error) setFitKey(value => value + 1);
      } catch (problem) { setError(logoError(problem)); setStatus('error'); }
    }
  };
  loadTextRef.current = loadText;
  useEffect(() => {
    if (!share) return;
    loadText(share.source, share.mode, true);
    history.replaceState(null, '', location.pathname + location.search);
    // Consume the permalink once after the initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const api = {
      version: '1.0.0',
      run: (source: string, selected: Mode) => runLogo(source, selected),
      open: async (source: string, selected: Mode) => {
        loadTextRef.current(source, selected, true);
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        canvas.current?.fit();
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        return runLogo(source, selected);
      },
    };
    window.logomocja = api;
    return () => { delete window.logomocja; };
  }, []);

  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') { event.preventDefault(); run(); }
      else if (event.ctrlKey && event.key === '.') { event.preventDefault(); step(); }
      else if (event.key === 'Escape' && status === 'running') setStatus('paused');
      else if (event.ctrlKey && event.key === 'Backspace') { event.preventDefault(); clearOutput(); }
      else if (event.key === 'Tab' && event.target === editor.current) {
        event.preventDefault(); const area = editor.current!; const start = area.selectionStart, end = area.selectionEnd;
        updateDraft(`${current.slice(0, start)}  ${current.slice(end)}`);
        requestAnimationFrame(() => { area.selectionStart = area.selectionEnd = start + 2; });
      }
    };
    window.addEventListener('keydown', keys); return () => window.removeEventListener('keydown', keys);
  }, [current, mode, status, segments, runLine]);

  const loadExample = (example: Example) => setPending(example);
  const confirmExample = () => {
    if (!pending) return;
    setBackup({ mode: pending.mode, source: drafts[pending.mode] });
    loadText(pending.source, pending.mode, false);
    setMessage(`Wczytano „${pending.name}”. Poprzedni szkic możesz przywrócić w edytorze.`); setPending(null);
  };
  const restoreBackup = () => { if (!backup) return; loadText(backup.source, backup.mode); setBackup(null); setMessage('Przywrócono poprzedni szkic.'); };
  const download = () => {
    const url = URL.createObjectURL(new Blob([current], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'moj-program.logo'; anchor.click(); URL.revokeObjectURL(url);
  };
  const openFile = (file?: File) => {
    if (!file) return; const reader = new FileReader();
    reader.onload = () => { loadText(String(reader.result || ''), mode); setMessage(`Otworzono ${file.name}.`); };
    reader.readAsText(file);
  };
  const shareProgram = async () => {
    const url = `${location.origin}${location.pathname}${location.search}#share=${encode({ source: current, mode })}`;
    history.replaceState(null, '', url);
    try { await navigator.clipboard.writeText(url); setMessage('Link do programu skopiowany.'); } catch { setMessage('Link jest gotowy w pasku adresu. Skopiuj go, aby udostępnić program.'); }
  };
  const themeLabel = theme === 'system' ? 'systemowy' : theme === 'light' ? 'jasny' : 'ciemny';
  const statusLabel = status === 'running' ? 'Rysuję…' : status === 'paused' ? 'Wstrzymano' : status === 'done' ? 'Gotowe' : status === 'error' ? 'Błąd programu' : 'Gotowy do rysowania';
  const checkTask = () => {
    const result = runLogo(taskDrafts[task.id] || '', '2d');
    if (result.error) { setFeedback({ ok: false, text: `Błąd w linii ${result.error.line}, kolumnie ${result.error.column}: ${result.error.message}` }); return; }
    const mismatch = compareSegments(result.segments, expected);
    if (mismatch === 0) { setProgress(value => ({ ...value, [task.id]: true })); setFeedback({ ok: true, text: 'Świetnie! Kształt zgadza się z celem (tolerancja 1,5 jednostki).' }); }
    else if (result.segments.length !== expected.length) setFeedback({ ok: false, text: `Rysunek ma ${result.segments.length} odcinków, a cel ma ${expected.length}. Sprawdź liczbę boków.` });
    else setFeedback({ ok: false, text: 'Część wierzchołków jest w innym miejscu. Sprawdź długości i kąty.' });
  };
  const taskToStudio = () => { setBackup({ mode: '2d', source: drafts['2d'] }); loadText(taskDrafts[task.id] || `; ${task.prompt}\n`, '2d'); setMessage('Program z wyzwania otwarto w studiu. Poprzedni szkic możesz przywrócić.'); };

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setPage('studio')} aria-label="Logomocja, studio żółwia"><span className="brand-icon"><Icon name="turtle" size={22} /></span><span><b>Logomocja</b><small>STUDIO ŻÓŁWIA</small></span></button>
      <nav className="main-nav" aria-label="Nawigacja"><Nav active={page === 'studio'} icon="turtle" onClick={() => setPage('studio')}>Studio</Nav><Nav active={page === 'examples'} icon="grid" onClick={() => setPage('examples')}>Przykłady</Nav><Nav active={page === 'challenges'} icon="target" onClick={() => setPage('challenges')}>Wyzwania <i>{Object.values(progress).filter(Boolean).length}/5</i></Nav><Nav active={page === 'reference'} icon="book" onClick={() => setPage('reference')}>Język Logo</Nav></nav>
      <div className="top-actions"><span className="offline"><i />Działa offline</span><button className="icon-button theme-button" aria-label={`Motyw ${themeLabel}. Zmień motyw`} title={`Motyw ${themeLabel}`} onClick={() => setTheme(value => value === 'system' ? (systemDark ? 'light' : 'dark') : value === 'light' ? 'dark' : 'system')}><Icon name={dark ? 'moon' : 'sun'} /></button></div>
    </header>

    {page === 'studio' && <main className="studio-page">
      <div className="page-heading studio-heading"><div><div className="eyebrow"><i />TWOJE MIEJSCE DO ODKRYWANIA</div><h1>Niech żółw narysuje <em>to, co wymyślisz.</em></h1><p>Prosty język, wielkie pomysły. Zacznij od przykładu albo napisz własny program.</p></div><div className="mode-picker" role="group" aria-label="Przestrzeń rysowania"><button className={mode === '2d' ? 'active' : ''} aria-pressed={mode === '2d'} onClick={() => selectMode('2d')}><span>XY</span>Płaszczyzna <small>2D</small></button><button className={mode === '3d' ? 'active' : ''} aria-pressed={mode === '3d'} onClick={() => selectMode('3d')}><span>XYZ</span>Przestrzeń <small>3D</small></button></div></div>
      <div className="workspace-grid">
        <section className="panel editor-panel" aria-label="Edytor Logo">
          <div className="panel-heading"><div className="panel-title"><span className="title-icon"><Icon name="book" size={16} /></span><div><b>Program</b><small>Bez nazwy.logo</small></div></div><div className="file-actions">{backup && <button className="text-button" onClick={restoreBackup}><Icon name="reset" size={14} />Przywróć szkic</button>}<button className="icon-button small" onClick={() => fileInput.current?.click()} aria-label="Otwórz plik .logo" title="Otwórz plik"><Icon name="upload" size={16} /></button><button className="icon-button small" onClick={download} aria-label="Pobierz program .logo" title="Pobierz program"><Icon name="download" size={16} /></button><button className="icon-button small" onClick={shareProgram} aria-label="Udostępnij program" title="Udostępnij"><Icon name="link" size={16} /></button><input ref={fileInput} type="file" accept=".logo,text/plain" hidden onChange={event => { openFile(event.target.files?.[0]); event.currentTarget.value = ''; }} /></div></div>
          <div className="run-toolbar"><div className="run-buttons"><button className="run-button" onClick={run} title="Uruchom · Ctrl+Enter"><Icon name="play" size={15} />Uruchom</button><button className="tool-button" onClick={step} title="Krok · Ctrl+."><Icon name="step" size={16} />Krok</button><button className="icon-button small" onClick={() => setStatus(value => value === 'running' ? 'paused' : value === 'paused' ? 'running' : value)} disabled={status !== 'running' && status !== 'paused'} aria-label={status === 'running' ? 'Wstrzymaj program' : 'Wznów program'} title="Wstrzymaj lub wznów · Esc"><Icon name={status === 'running' ? 'pause' : 'play'} size={15} /></button><button className="icon-button small" onClick={clearOutput} aria-label="Zresetuj rysunek" title="Reset · Ctrl+Backspace"><Icon name="reset" size={16} /></button></div><label className="speed"><span>Tempo</span><input type="range" min="0" max="450" step="5" value={450 - speed} onChange={event => setSpeed(450 - Number(event.target.value))} aria-label="Tempo animacji" /><small>{speed < 100 ? 'Szybko' : speed > 340 ? 'Wolno' : 'Średnio'}</small></label></div>
          <CodeEditor ref={editor} source={current} runningLine={runLine} error={error} onChange={updateDraft} />
          <div id="run-status" className={`editor-status${error ? ' has-error' : ''}`} role="status" aria-live="polite"><i className={`status-dot ${status}`} />{error ? <span><b>Błąd · linia {error.line}, kolumna {error.column}</b> — {error.message}</span> : <><span>{statusLabel}</span><small>Ctrl+Enter uruchamia · Ctrl+. krok</small></>}</div>
          <div className="editor-footer"><span><Icon name="check" size={13} />Szkic zapisuje się automatycznie</span><span>Esc wstrzymuje · Ctrl+Backspace resetuje</span></div>
        </section>
        <section className="panel drawing-panel" aria-label="Obszar rysowania">
          <div className="panel-heading"><div className="panel-title"><span className="title-icon"><Icon name="target" size={16} /></span><div><b>Pracownia</b><small>{mode === '2d' ? 'Płaszczyzna XY' : 'Przestrzeń XYZ'}</small></div></div><div className="canvas-tools"><button className="icon-button small" onClick={() => canvas.current?.fit()} aria-label="Dopasuj rysunek" title="Dopasuj rysunek"><Icon name="fit" size={16} /></button><button className="icon-button small" onClick={() => canvas.current?.zoom(1.2)} aria-label="Przybliż" title="Przybliż"><Icon name="plus" size={16} /></button><button className="icon-button small" onClick={() => canvas.current?.zoom(1 / 1.2)} aria-label="Oddal" title="Oddal"><Icon name="minus" size={16} /></button>{mode === '3d' && <button className="icon-button small" onClick={() => setCameraKey(value => value + 1)} aria-label="Reset kamery" title="Reset kamery"><Icon name="reset" size={16} /></button>}<button className="icon-button small" onClick={() => canvas.current?.exportPng()} aria-label="Pobierz rysunek jako PNG" title="Eksportuj PNG"><Icon name="download" size={16} /></button></div></div>
          <div className="canvas-frame"><DrawingCanvas ref={canvas} mode={mode} segments={segments} turtle={turtle} penDown={penDown} dark={dark} fitKey={fitKey} resetKey={cameraKey} />{mode === '3d' && <span className="camera-note">Kamera 3D · przeciągnij, aby obrócić</span>}</div>
          <div className="canvas-footer"><span><i className="turtle-legend" />Żółw <i className="origin-legend" />Początek <i className="grid-legend" />Siatka</span><b>{segments.length} {segmentWord(segments.length)}</b></div>
          {mode === '3d' && <div className="orbit-controls"><span>Kamera</span><button onClick={() => canvas.current?.orbit(-.16, 0)} aria-label="Obróć kamerę w lewo">←</button><button onClick={() => canvas.current?.orbit(.16, 0)} aria-label="Obróć kamerę w prawo">→</button><button onClick={() => canvas.current?.orbit(0, .12)} aria-label="Obróć kamerę w górę">↑</button><button onClick={() => canvas.current?.orbit(0, -.12)} aria-label="Obróć kamerę w dół">↓</button><small>Shift + przeciągnięcie przesuwa</small></div>}
        </section>
      </div>
      <div className="studio-links"><button onClick={() => setPage('examples')}>Zobacz 13 gotowych programów <b>→</b></button><span>Wszystko działa na Twoim urządzeniu.</span><button onClick={() => setPage('reference')}>Poznaj wszystkie polecenia <b>→</b></button></div>
    </main>}

    {page === 'examples' && <ExamplesPage onLoad={loadExample} onBack={() => setPage('studio')} />}
    {page === 'challenges' && <ChallengesPage challenges={challenges} task={task} taskId={taskId} setTask={id => { setTaskId(id); setFeedback(null); }} taskDrafts={taskDrafts} setTaskDrafts={setTaskDrafts} progress={progress} segments={expected} feedback={feedback} check={checkTask} openStudio={taskToStudio} />}
    {page === 'reference' && <ReferencePage query={query} setQuery={setQuery} />}

    {pending && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setPending(null); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="load-title"><button className="icon-button modal-close" onClick={() => setPending(null)} aria-label="Zamknij"><Icon name="close" /></button><span className="modal-icon"><Icon name="book" size={20} /></span><small>PROGRAM Z BIBLIOTEKI</small><h2 id="load-title">Wczytać „{pending.name}”?</h2><p>Bieżący szkic w trybie {pending.mode.toUpperCase()} zachowamy jako kopię. Możesz go później przywrócić.</p><div className="modal-actions"><button className="tool-button" onClick={() => setPending(null)}>Zostaw szkic</button><button className="run-button" onClick={confirmExample}>Wczytaj przykład <b>→</b></button></div></div></div>}
    {message && <div className="toast" role="status"><Icon name="check" size={16} />{message}<button onClick={() => setMessage('')} aria-label="Zamknij komunikat"><Icon name="close" size={14} /></button></div>}
    <footer className="site-footer"><span>© Logomocja · powrót do odkrywania</span><span>Bez konta. Bez pośpiechu. Tylko Ty i żółw.</span></footer>
  </div>;
}

function Nav({ active, icon, onClick, children }: { active: boolean; icon: string; onClick: () => void; children: React.ReactNode }) {
  return <button className={`nav-button${active ? ' active' : ''}`} onClick={onClick} aria-current={active ? 'page' : undefined}><Icon name={icon} size={16} />{children}</button>;
}

const CodeEditor = React.forwardRef<HTMLTextAreaElement, { source: string; runningLine: number | null; error: RunResult['error']; onChange: (value: string) => void }>(function CodeEditor({ source, runningLine, error, onChange }, ref) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(ref, () => textarea.current!);
  useEffect(() => {
    if (!error || !textarea.current) return;
    const area = textarea.current;
    area.scrollTop = Math.max(0, (error.line - 1) * 24);
    const colPx = (error.column - 1) * 7.25;
    if (colPx > area.scrollLeft + area.clientWidth - 45) area.scrollLeft = Math.max(0, colPx - area.clientWidth + 45);
  }, [error?.line, error?.column]);
  useEffect(() => {
    if (!runningLine || !textarea.current) return;
    const area = textarea.current;
    const top = (runningLine - 1) * 24;
    if (top < area.scrollTop) area.scrollTop = top;
    else if (top + 24 > area.scrollTop + area.clientHeight) area.scrollTop = top + 24 - area.clientHeight;
  }, [runningLine]);
  const command = commandNames();
  const rows = source.split('\n');
  return <div className="code-area">
    <div className="code-underlay" aria-hidden="true">
      <div className="code-inner" style={{ transform: `translateY(${-((textarea.current?.scrollTop || 0))}px)` }}>
        {rows.map((line, index) => <div className={`code-row${runningLine === index + 1 ? ' current' : ''}`} key={index}>
          <span className={`line-number${error?.line === index + 1 ? ' error-line' : ''}`}>{error?.line === index + 1 && <i className="line-error-dot" />}{String(index + 1).padStart(2, '0')}</span>
          <code>{tokenizeLine(line, command, index)}{error?.line === index + 1 && <i className="column-error" style={{ left: `${Math.max(0, error.column - 1) * .6}em` }} title={error.message} aria-label={`Błąd w kolumnie ${error.column}`} />}</code>
        </div>)}
      </div>
    </div>
    <textarea ref={textarea} className="code-input" value={source} spellCheck={false} autoCapitalize="off" autoCorrect="off" aria-label="Kod programu Logo" aria-describedby="run-status" onChange={event => onChange(event.target.value)} onScroll={event => {
      const inner = event.currentTarget.parentElement?.querySelector<HTMLElement>('.code-inner');
      if (inner) {
        inner.style.transform = `translateY(${-event.currentTarget.scrollTop}px)`;
        inner.querySelectorAll<HTMLElement>('code').forEach(code => { code.style.transform = `translateX(${-event.currentTarget.scrollLeft}px)`; });
      }
    }} />
  </div>;
});

function tokenizeLine(line: string, commands: Set<string>, row: number) {
  const pattern = /;.*|"[^"\n]*"|:[\p{L}_][\p{L}\p{N}_]*|(?:\d+(?:\.\d*)?|\.\d+)|[\p{L}_][\p{L}\p{N}_]*|[\[\]()<>]=?|[+*/=,-]/gu;
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const result of line.matchAll(pattern)) {
    const index = result.index!;
    if (index > last) parts.push(line.slice(last, index));
    const word = result[0];
    const key = word.normalize('NFC').toLocaleLowerCase('pl-PL');
    const cls = word.startsWith(';') ? 'syntax-comment' : word.startsWith('"') ? 'syntax-color' : word.startsWith(':') ? 'syntax-variable' : /^(\d|\.\d)/.test(word) ? 'syntax-number' : commands.has(key) || ['oto', 'to', 'ma', 'już', 'juz', 'end'].includes(key) ? 'syntax-command' : /^[\p{L}_]/u.test(word) ? 'syntax-name' : 'syntax-punctuation';
    parts.push(<span className={cls} key={`${row}-${index}`}>{word}</span>);
    last = index + word.length;
    if (word.startsWith(';')) break;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts.length ? parts : '\u00a0';
}

function ExamplesPage({ onLoad, onBack }: { onLoad: (example: Example) => void; onBack: () => void }) {
  const [filter, setFilter] = useState<'all' | Mode>('all');
  const filtered = examples.filter(item => filter === 'all' || item.mode === filter);
  return <main className="content-page examples-page">
    <div className="page-heading content-heading"><div><div className="eyebrow"><i />NA DOBRY POCZĄTEK</div><h1>Pomysły, które <em>ruszają z miejsca.</em></h1><p>Otwórz program, zobacz jak działa i zmień go po swojemu.</p></div><button className="back-button" onClick={onBack}><Icon name="turtle" />Wróć do studia</button></div>
    <div className="example-filter" role="group" aria-label="Filtruj przykłady"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Wszystkie <i>13</i></button><button className={filter === '2d' ? 'active' : ''} onClick={() => setFilter('2d')}>Płaszczyzna <i>7</i></button><button className={filter === '3d' ? 'active' : ''} onClick={() => setFilter('3d')}>Przestrzeń <i>6</i></button><span>Każdy przykład jest gotowy do uruchomienia.</span></div>
    <div className="example-grid">{filtered.map((item, index) => <article className="example-card panel" key={item.id}><div className={`example-art art-${index % 5}`}><span className="example-tag">{item.mode.toUpperCase()}</span><span className="art-num">{String(examples.indexOf(item) + 1).padStart(2, '0')}</span><Preview segments={runLogo(item.source, item.mode).segments.slice(0, 18)} /></div><div className="example-card-copy"><small>{item.mode === '2d' ? 'PŁASZCZYZNA' : 'PRZESTRZEŃ'}</small><h2>{item.name}</h2><p>{item.description}</p><button className="example-load" onClick={() => onLoad(item)}>Wczytaj program <b>→</b></button></div></article>)}</div>
  </main>;
}

function Preview({ segments }: { segments: Segment[] }) {
  if (!segments.length) return <div className="preview-empty" />;
  const pts = segments.flatMap(segment => [segment.from, segment.to]);
  const xs = pts.map(point => point[0]), ys = pts.map(point => point[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = 76 / Math.max(maxX - minX, maxY - minY, 1), cx = 65 - (minX + maxX) * scale / 2, cy = 45 + (minY + maxY) * scale / 2;
  return <svg className="preview-svg" viewBox="0 0 130 90" role="img" aria-label="Podgląd rysunku"><path d="M65 4v82M15 45h100" className="preview-axis"/>{segments.map((segment, index) => <line key={index} x1={cx + segment.from[0] * scale} y1={cy - segment.from[1] * scale} x2={cx + segment.to[0] * scale} y2={cy - segment.to[1] * scale} stroke="#16866a" strokeWidth="1.8" strokeLinecap="round" />)}</svg>;
}

function ChallengesPage({ challenges, task, taskId, setTask, taskDrafts, setTaskDrafts, progress, segments, feedback, check, openStudio }: {
  challenges: Challenge[]; task: Challenge; taskId: string; setTask: (id: string) => void; taskDrafts: Record<string, string>; setTaskDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>; progress: Record<string, boolean>; segments: Segment[]; feedback: { ok: boolean; text: string } | null; check: () => void; openStudio: () => void;
}) {
  const done = Object.values(progress).filter(Boolean).length;
  return <main className="content-page challenge-page">
    <div className="page-heading content-heading"><div><div className="eyebrow"><i />PRAKTYKA CZYNI MISTRZA</div><h1>Małe zadania, <em>wielkie odkrycia.</em></h1><p>Rysuj po swojemu. Sprawdzimy kształt z tolerancją 1,5 jednostki.</p></div><div className="progress-card"><b>{done}<small>/5</small></b><span>ukończone<br/>wyzwania</span><div><i style={{ width: `${done * 20}%` }}/></div></div></div>
    <div className="challenge-layout"><aside className="challenge-list panel"><div className="challenge-list-title"><b>Ścieżka rysownika</b><span>{done}/5</span></div>{challenges.map((item, index) => <button key={item.id} className={`challenge-choice${taskId === item.id ? ' active' : ''}${progress[item.id] ? ' passed' : ''}`} onClick={() => setTask(item.id)}><span>{progress[item.id] ? <Icon name="check" size={15}/> : `0${index + 1}`}</span><b>{item.title}<small>{item.tier}</small></b><i>›</i></button>)}</aside>
      <section className="challenge-editor panel"><div className="challenge-title"><div><small>{task.tier.toUpperCase()} · {progress[task.id] ? 'ZALICZONE' : 'DO ZROBIENIA'}</small><h2>{task.title}</h2><p>{task.prompt}</p></div><div className="challenge-goal"><Preview segments={segments}/><span>Cel</span></div></div><div className="hint"><Icon name="target"/><span><b>Wskazówka:</b> {task.hint}</span></div><label className="task-code-label" htmlFor="task-code">Twój program <small>Logo · 2D</small></label><textarea id="task-code" className="task-code" value={taskDrafts[task.id] || `; ${task.prompt}\n`} onChange={event => setTaskDrafts(current => ({ ...current, [task.id]: event.target.value }))} spellCheck={false}/>
        {feedback && <div className={`task-feedback${feedback.ok ? ' success' : ' failure'}`} role="status"><Icon name={feedback.ok ? 'check' : 'close'} size={16}/>{feedback.text}</div>}
        <div className="task-actions"><button className="run-button" onClick={check}><Icon name="target" size={15}/>Sprawdź rysunek</button><button className="tool-button" onClick={openStudio}>Otwórz w studiu <b>→</b></button></div><p className="task-note">Sprawdzamy liczbę i położenie odcinków. Kolor, grubość i kolejność są dowolne.</p>
      </section></div>
  </main>;
}

function distance(a: Vec3, b: Vec3) { return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }
function compareSegments(actual: Segment[], expected: Segment[]) {
  if (actual.length !== expected.length) return 1;
  const remaining = [...expected];
  let misses = 0;
  for (const stroke of actual) {
    const match = remaining.findIndex(candidate => (distance(stroke.from, candidate.from) < 1.5 && distance(stroke.to, candidate.to) < 1.5) || (distance(stroke.from, candidate.to) < 1.5 && distance(stroke.to, candidate.from) < 1.5));
    if (match < 0) misses += 1; else remaining.splice(match, 1);
  }
  return misses;
}

function ReferencePage({ query, setQuery }: { query: string; setQuery: (value: string) => void }) {
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') { event.preventDefault(); searchInput.current?.focus(); }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  const sections = [
    { title: 'Ruch i obrót', words: 'np naprzod naprzód fd forward ws wstecz bk back pw prawo rt right lw lewo lt left', body: <><p>Żółw zaczyna w <code>(0, 0, 0)</code>, skierowany w stronę <code>+Y</code>, z opuszczonym piórem, kolorem <code>#16866a</code> i grubością 3. Przesunięcie rysuje prosty odcinek; obrót zmienia kierunek bez ruchu. Kąty podaje się w stopniach, mogą być ułamkowe lub ujemne.</p><div className="ref-table"><div><code>np d</code><span>Naprzód. Aliasy: <code>naprzod</code>, <code>naprzód</code>, <code>fd</code>, <code>forward</code>.</span><pre>np 80</pre></div><div><code>ws d</code><span>Wstecz. Aliasy: <code>wstecz</code>, <code>bk</code>, <code>back</code>.</span><pre>ws 20</pre></div><div><code>pw a</code><span>Prawo, zgodnie z ruchem wskazówek zegara. Aliasy: <code>prawo</code>, <code>rt</code>, <code>right</code>.</span><pre>pw 90</pre></div><div><code>lw a</code><span>Lewo. Aliasy: <code>lewo</code>, <code>lt</code>, <code>left</code>.</span><pre>lw 45</pre></div></div></> },
    { title: 'Pióro, kolor i grubość', words: 'pod podnies podnieś pu penup opu opusc opuść pd pendown kolor color grubosc grubość width', body: <div className="ref-table"><div><code>pod</code><span>Unosi pióro. Aliasy: <code>podnies</code>, <code>podnieś</code>, <code>pu</code>, <code>penup</code>.</span><pre>pod ws 30 opu</pre></div><div><code>opu</code><span>Opuszcza pióro. Aliasy: <code>opusc</code>, <code>opuść</code>, <code>pd</code>, <code>pendown</code>.</span><pre>opu np 30</pre></div><div><code>kolor "#rrggbb"</code><span>Ustawia sześciocyfrowy kolor HEX. Alias: <code>color</code>.</span><pre>kolor "#16866a"</pre></div><div><code>grubosc n</code><span>Szerokość musi być liczbą całkowitą od 1 do 12. Aliasy: <code>grubość</code>, <code>width</code>.</span><pre>grubosc 3</pre></div></div> },
    { title: 'Powtarzanie i nrpowt', words: 'powtorz powtórz repeat nrpowt repcount', body: <><p><code>powtorz n [polecenia]</code> wykonuje ciało 0–10 000 razy. Ciała mogą się zagnieżdżać. Aliasy: <code>powtórz</code>, <code>repeat</code>.</p><pre className="ref-code">powtorz 4 [np 80 pw 90]</pre><p><code>nrpowt</code> (alias <code>repcount</code>) oznacza numer bieżącej, najgłębiej zagnieżdżonej pętli, zaczynając od 1. To nazwa leksykalna; użycie poza ciałem powtórzenia jest błędem.</p><pre className="ref-code">powtorz 8 [np nrpowt * 5 pw 45]</pre></> },
    { title: 'Wyrażenia i zmienne', words: 'niech let zmienna parametr liczby + - * / porównania', body: <><p>Argument liczbowy to liczba dziesiętna (np. <code>80</code>, <code>12.5</code>, <code>.5</code>), nazwa zmiennej lub parametru (także <code>:nazwa</code>), <code>nrpowt</code>, nawiasy albo działanie. Jednoargumentowe znaki mogą być zagnieżdżone.</p><pre className="ref-code">niech bok 40{'\n'}np (bok * 2) + 5</pre><p>Mnożenie i dzielenie wiążą mocniej niż dodawanie i odejmowanie; równy priorytet liczy się od lewej. Operator binarny wymaga spacji po obu stronach albo po żadnej: <code>10 - 5</code> i <code>10-5</code> są poprawne, <code>10 -5</code> jest błędne. Porównania to <code>&lt;</code>, <code>&gt;</code>, <code>=</code>, <code>&lt;=</code>, <code>&gt;=</code>, <code>&lt;&gt;</code> i są dokładne. Dlatego <code>0.1 + 0.2 = 0.3</code> jest fałszywe. Dzielenie przez zero i wynik nieskończony to błędy wykonania.</p><p><code>niech x wyrażenie</code> (alias <code>let</code>) przypisuje wartość. Na najwyższym poziomie zmienna jest globalna; w procedurze jest lokalna dla wywołania, przesłania globalną i znika po powrocie. Parametr można przypisać ponownie. Odczyt przed przypisaniem na bieżącej ścieżce jest błędem.</p></> },
    { title: 'Warunki i polecenia sterujące', words: 'jeśli jesli jeżeli jezeli if ifelse stop dom home czyść czysc cs clearscreen', body: <><p><code>jeśli warunek [polecenia]</code> (aliasy <code>jesli</code>, <code>if</code>) uruchamia ciało, gdy porównanie jest prawdziwe. <code>jeżeli warunek [tak] [nie]</code> (aliasy <code>jezeli</code>, <code>ifelse</code>) wybiera jedno z dwóch ciał. Warunek ma postać wyrażenie, porównanie, wyrażenie.</p><pre className="ref-code">jeśli bok &gt; 20 [np bok]{'\n'}jeżeli x = 0 [pw 90] [lw 90]</pre><div className="ref-table"><div><code>stop</code><span>Kończy procedurę albo cały program na najwyższym poziomie.</span><pre>stop</pre></div><div><code>dom</code><span>Wraca do początku i początkowej orientacji, rysując drogę z opuszczonym piórem. Nie zmienia stanu pióra, koloru ani grubości. Alias: <code>home</code>.</span><pre>dom</pre></div><div><code>czyść</code><span>Usuwa odcinki, nie zmieniając żółwia. Aliasy: <code>czysc</code>, <code>cs</code>, <code>clearscreen</code>.</span><pre>czyść</pre></div></div></> },
    { title: 'Procedury', words: 'oto to już juz end ma parametry rekurencja', body: <><p>Definicje są na najwyższym poziomie; nagłówek <code>oto</code> stoi na początku wiersza, a <code>już</code> samodzielnie w kolejnym. Procedury mogą stać przed lub po wywołaniu i wywoływać siebie.</p><pre className="ref-code">{'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90'}</pre><p>Działa też nagłówek <code>oto kwadrat :bok :kąt</code> oraz aliasy <code>to</code>, <code>juz</code>, <code>end</code>. Argumenty pozycyjne są wyrażeniami. Nie ma wartości zwrotnych. <code>stop</code> kończy bieżące wywołanie. Parametr może mieć nazwę jak procedura; nazwy zmiennych nie mogą być poleceniami ani procedurami.</p></> },
    { title: 'Orientacja 3D', words: 'gora góra dol dół pp pl przechylprawo przechyllewo rr rl rollright rollleft pitchup pitchdown', body: <><p>Układ prawoskrętny: <code>+X</code> w prawo, <code>+Y</code> naprzód na stronie, <code>+Z</code> w górę. Płaszczyzna 2D to XY. Początkowo prawa oś żółwia wskazuje +X, a góra +Z.</p><div className="ref-table"><div><code>gora a</code><span>Unosi dziób wokół prawej osi. Aliasy: <code>góra</code>, <code>pitchup</code>.</span><pre>gora 30</pre></div><div><code>dol a</code><span>Opuszcza dziób. Aliasy: <code>dół</code>, <code>pitchdown</code>.</span><pre>dol 30</pre></div><div><code>pp a</code><span>Przechyla górę w prawo wokół kierunku. Aliasy: <code>przechylprawo</code>, <code>rr</code>, <code>rollright</code>.</span><pre>pp 15</pre></div><div><code>pl a</code><span>Przechyla górę w lewo. Aliasy: <code>przechyllewo</code>, <code>rl</code>, <code>rollleft</code>.</span><pre>pl 15</pre></div></div><p>W 2D komendy pitch i roll są błędem. Programy złożone wyłącznie z płaskich komend mają w obu trybach te same współrzędne.</p></> },
    { title: 'Składnia, błędy i limity', words: 'komentarz liczby nawiasy przecinki spacja limit błąd', body: <><p>Średnik rozpoczyna komentarz do końca wiersza. Spacje oddzielają tokeny. Nowe wiersze mają znaczenie w nagłówkach i zakończeniach procedur. Nawiasy kwadratowe obejmują ciała powtórzeń i warunków, okrągłe grupują wyrażenia. Literały liczbowe nie przyjmują wykładnika ani prefiksu szesnastkowego. Kolor ma formę <code>"#rrggbb"</code>.</p><p>Cały program jest sprawdzany przed rysowaniem. Błąd składni nie rysuje niczego; błąd wykonania zachowuje wcześniej narysowane odcinki. Komunikat wskazuje wiersz i kolumnę, a błędny argument wskazuje początek wyrażenia.</p><div className="limits-grid"><span>50 000<small>znaków źródła</small></span><span>10 000<small>tokenów</small></span><span>32<small>poziomy nawiasów</small></span><span>32<small>ramki pętli i procedur</small></span><span>10 000<small>wykonanych operacji</small></span><span>10 000<small>odcinków</small></span><span>±100 000<small>zakres współrzędnych</small></span></div></> },
  ];
  const filtered = sections.filter(section => !query || `${section.title} ${section.words}`.toLocaleLowerCase('pl-PL').includes(query.toLocaleLowerCase('pl-PL')));
  return <main className="content-page reference-page"><div className="page-heading content-heading"><div><div className="eyebrow"><i/>JĘZYK, KTÓRY RYSUJE</div><h1>Całe Logo <em>w jednym miejscu.</em></h1><p>Polecenia, wyrażenia, procedury i zasady działania interpretera.</p></div><label className="reference-search"><span className="visually-hidden">Szukaj w dokumentacji</span><input ref={searchInput} value={query} onChange={event => setQuery(event.target.value)} placeholder="Szukaj polecenia…"/><kbd>⌘ K</kbd></label></div>
    <div className="reference-layout"><aside className="reference-aside"><small>SPIS TREŚCI</small>{filtered.map(section => <a href={`#reference-${sections.indexOf(section)}`} key={section.title}>{section.title}</a>)}<div className="shortcut-list"><b>Skróty</b><span><kbd>Ctrl</kbd> + <kbd>Enter</kbd> Uruchom</span><span><kbd>Ctrl</kbd> + <kbd>.</kbd> Krok</span><span><kbd>Esc</kbd> Wstrzymaj</span><span><kbd>Ctrl</kbd> + <kbd>⌫</kbd> Reset</span></div></aside><div className="reference-content">{filtered.length ? filtered.map(section => <section className="reference-section" id={`reference-${sections.indexOf(section)}`} key={section.title}><span>{String(sections.indexOf(section) + 1).padStart(2, '0')}</span><div><h2>{section.title}</h2>{section.body}</div></section>) : <p className="no-results">Nie znaleziono polecenia. Spróbuj krótszej nazwy.</p>}</div></div></main>;
}

declare global {
  interface Window { logomocja?: { version: string; run: (source: string, mode: Mode) => RunResult; open: (source: string, mode: Mode) => Promise<RunResult> } }
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
