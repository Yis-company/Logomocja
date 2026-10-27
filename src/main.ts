import { compile, Machine, runProgram, type LogoError, type Mode } from './lang'
import { View } from './render'
import { EXAMPLES } from './examples'

const VERSION = '1.0.0'
;(window as any).logomocja = { version: VERSION, run: (source: string, mode: Mode) => runProgram(String(source), mode === '3d' ? '3d' : '2d') }

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const src = $<HTMLTextAreaElement>('src')
const statusEl = $('status')
const nums = $('nums')
const hlCur = $('hlCur')
const hlErr = $('hlErr')
const speedEl = $<HTMLInputElement>('speed')
const view = new View($<HTMLCanvasElement>('cv'))

const RATES = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, Infinity]
const KEY = 'logomocja:v1'

type State = 'idle' | 'running' | 'paused' | 'done'
let state: State = 'idle'
let mode: Mode = '2d'
let machine: Machine | null = null
let lastTime = 0
let acc = 0
let errLine = 0
let curLine = 0
let lintTimer = 0

// ---------- persistence ----------
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ src: src.value, mode }))
  } catch {}
}
function load(): { src: string; mode: Mode } | null {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (d && typeof d.src === 'string') return { src: d.src, mode: d.mode === '3d' ? '3d' : '2d' }
  } catch {}
  return null
}

// ---------- editor chrome ----------
function updateNums() {
  const n = src.value.split('\n').length
  let s = ''
  for (let i = 1; i <= n; i++) s += i + '\n'
  nums.textContent = s
}
function placeBars() {
  const lh = parseFloat(getComputedStyle(src).lineHeight) || 22
  const pad = parseFloat(getComputedStyle(src).paddingTop) || 8
  nums.style.transform = `translateY(${-src.scrollTop}px)`
  for (const [el, line] of [[hlCur, curLine], [hlErr, errLine]] as const) {
    el.style.display = line ? 'block' : 'none'
    el.style.top = `${pad + (line - 1) * lh - src.scrollTop}px`
  }
}
function setStatus(text: string, isError = false, err?: LogoError) {
  statusEl.className = isError ? 'error' : ''
  statusEl.textContent = ''
  if (err) {
    const b = document.createElement('button')
    b.textContent = `Linia ${err.line}, kolumna ${err.column}`
    b.onclick = () => gotoPos(err.line, err.column)
    statusEl.append(b, `: ${err.message}`)
    errLine = err.line
  } else {
    statusEl.textContent = text
    errLine = 0
  }
  placeBars()
}
function gotoPos(line: number, col: number) {
  const lines = src.value.split('\n')
  let off = 0
  for (let i = 0; i < line - 1; i++) off += lines[i].length + 1
  off += col - 1
  src.focus()
  src.setSelectionRange(off, off)
  const lh = parseFloat(getComputedStyle(src).lineHeight) || 22
  src.scrollTop = Math.max(0, (line - 4) * lh)
  placeBars()
}

// ---------- run control ----------
function buttons() {
  const active = state === 'running' || state === 'paused'
  $('pause').toggleAttribute('disabled', !active)
  $('pause').textContent = state === 'paused' ? '▶ Wznów' : '⏸ Pauza'
  $('step').toggleAttribute('disabled', state === 'running')
  $('run').textContent = state === 'paused' ? '▶ Wznów' : '▶ Uruchom'
}

function clearDrawing() {
  machine = null
  curLine = 0
  view.setData([], { pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1] })
}

function start(): boolean {
  const c = compile(src.value, mode)
  clearDrawing()
  view.autoFit = true
  if (c.error) {
    state = 'idle'
    setStatus('', true, c.error)
    buttons()
    return false
  }
  machine = new Machine(c.program)
  view.setData([], pose())
  acc = 0
  return true
}

function pose() {
  const m = machine!
  return { pos: m.pos, h: m.h, r: m.r, u: m.u }
}

function advance(n: number) {
  const m = machine!
  let res: ReturnType<Machine['step']> = 'ok'
  for (let i = 0; i < n && res === 'ok'; i++) res = m.step()
  curLine = m.last ? m.last.line : 0
  view.setData(m.segments, pose())
  if (res === 'ok') {
    setStatus(`Wykonano: linia ${curLine} · odcinków: ${m.segments.length}`)
    return
  }
  state = 'done'
  curLine = 0
  if (res === 'error') setStatus('', true, m.error!)
  else setStatus(`Gotowe · odcinków: ${m.segments.length}`)
  buttons()
}

function frame(t: number) {
  if (state !== 'running' || !machine) return
  const dt = Math.min(0.1, (t - lastTime) / 1000)
  lastTime = t
  const rate = RATES[+speedEl.value]
  if (rate === Infinity) advance(1e9)
  else {
    acc += rate * dt
    const n = Math.floor(acc)
    acc -= n
    if (n > 0) advance(n)
  }
  if (state === 'running') requestAnimationFrame(frame)
}

function play() {
  state = 'running'
  buttons()
  lastTime = performance.now()
  requestAnimationFrame(frame)
}

$('run').onclick = () => {
  if (state === 'paused') return play()
  if (state === 'running') return
  if (start()) play()
}
$('pause').onclick = () => {
  if (state === 'running') {
    state = 'paused'
    buttons()
    setStatus(`Wstrzymano · odcinków: ${machine!.segments.length}`)
  } else if (state === 'paused') play()
}
$('step').onclick = () => {
  if (state === 'idle' || state === 'done') {
    if (!start()) return
    state = 'paused'
  }
  buttons()
  advance(1)
}
$('reset').onclick = () => {
  state = 'idle'
  clearDrawing()
  view.fit()
  setStatus('Zresetowano.')
  buttons()
  lint()
}

// ---------- editing ----------
function lint() {
  const c = compile(src.value, mode)
  if (c.error) setStatus('', true, c.error)
  else if (state === 'idle') setStatus('Program poprawny. Naciśnij Uruchom (Ctrl+Enter) lub Krok.')
}
src.addEventListener('input', () => {
  save()
  updateNums()
  if (state === 'running' || state === 'paused') {
    state = 'done'
    curLine = 0
    buttons()
    setStatus('Przerwano z powodu edycji – rysunek zostaje, uruchom program ponownie.')
  }
  clearTimeout(lintTimer)
  lintTimer = window.setTimeout(() => {
    if (state !== 'running' && state !== 'paused') {
      const c = compile(src.value, mode)
      if (c.error) setStatus('', true, c.error)
      else if (errLine) setStatus('Program poprawny.')
    }
  }, 400)
})
src.addEventListener('scroll', placeBars)
src.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    $('run').click()
  }
})
window.addEventListener('resize', placeBars)

// ---------- mode & examples ----------
function setMode(m: Mode) {
  mode = m
  $('m2').setAttribute('aria-pressed', String(m === '2d'))
  $('m3').setAttribute('aria-pressed', String(m === '3d'))
  $('hint').textContent =
    m === '2d' ? 'Przeciągnij: przesuwanie · kółko / szczypanie: zoom' : 'Przeciągnij: obrót · Shift / prawy przycisk / dwa palce: przesuwanie · kółko: zoom'
  state = 'idle'
  view.setMode(m)
  clearDrawing()
  view.fit()
  buttons()
  save()
  lint()
}
$('m2').onclick = () => setMode('2d')
$('m3').onclick = () => setMode('3d')
$('fit').onclick = () => view.fit()

const sel = $<HTMLSelectElement>('examples')
sel.append(new Option('— wybierz —', ''))
for (const e of EXAMPLES) sel.append(new Option(e.title, e.id))
sel.onchange = () => {
  const ex = EXAMPLES.find((e) => e.id === sel.value)
  if (!ex) return
  src.value = ex.source
  updateNums()
  setMode(ex.mode)
  sel.value = ''
}

function showSpeed() {
  const r = RATES[+speedEl.value]
  $('speedv').textContent = r === Infinity ? 'natychmiast' : `${r}/s`
}
speedEl.oninput = showSpeed
showSpeed()

// ---------- boot ----------
const saved = load()
src.value = saved ? saved.src : EXAMPLES[0].source
updateNums()
setMode(saved ? saved.mode : '2d')
