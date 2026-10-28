import type { Mode } from '../lang';
import { EXAMPLES } from '../data/examples';
import { storage } from './storage';

// Szkice, historia zastąpionych szkiców i postępy w wyzwaniach – tylko localStorage.

export const DEFAULT_SOURCE: Record<Mode, string> = {
  '2d': EXAMPLES.find((e) => e.id === 'kwadrat')!.source,
  '3d': EXAMPLES.find((e) => e.id === 'schody')!.source,
};

export function getMode(): Mode {
  return storage.getString('mode') === '3d' ? '3d' : '2d';
}
export function setMode(mode: Mode): void {
  storage.setString('mode', mode);
}

export function getDraft(mode: Mode): string {
  return storage.getString(`draft:${mode}`) ?? DEFAULT_SOURCE[mode];
}
export function setDraft(mode: Mode, text: string): void {
  storage.setString(`draft:${mode}`, text);
}

export function getChallengeDraft(id: string): string | null {
  return storage.getString(`challenge:${id}:draft`);
}
export function setChallengeDraft(id: string, text: string): void {
  storage.setString(`challenge:${id}:draft`, text);
}

export function getSpeed(): number | null {
  const v = storage.getString('speed');
  if (v === null) return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}
export function setSpeed(n: number): void {
  storage.setString('speed', String(n));
}

/** Tekst ostatnio zapisany do pliku / skopiowany jako link – taki szkic nie jest „niezapisany”. */
export function getSaved(mode: Mode): string | null {
  return storage.getString(`saved:${mode}`);
}
export function setSaved(mode: Mode, text: string): void {
  storage.setString(`saved:${mode}`, text);
}

/** Szkic, który można bez żalu zastąpić: pusty, równy przykładowi lub ostatnio zapisanemu. */
export function isDisposable(mode: Mode, text: string): boolean {
  if (text.trim() === '') return true;
  if (EXAMPLES.some((e) => e.source === text)) return true;
  return getSaved(mode) === text;
}

export interface HistoryEntry {
  at: number;
  mode: Mode;
  source: string;
  reason: string;
}

const HISTORY_LIMIT = 12;

export function getHistory(): HistoryEntry[] {
  return storage.getJSON<HistoryEntry[]>('history', []);
}
export function pushHistory(entry: Omit<HistoryEntry, 'at'>): HistoryEntry {
  const list = getHistory();
  const full = { ...entry, at: Date.now() };
  const next = [full, ...list.filter((e) => !(e.mode === entry.mode && e.source === entry.source))];
  storage.setJSON('history', next.slice(0, HISTORY_LIMIT));
  return full;
}
export function removeHistory(at: number): void {
  storage.setJSON('history', getHistory().filter((e) => e.at !== at));
}

export interface Progress {
  [id: string]: { done: boolean; at: number; attempts: number };
}
export function getProgress(): Progress {
  return storage.getJSON<Progress>('progress', {});
}
export function recordAttempt(id: string, passed: boolean): Progress {
  const p = getProgress();
  const prev = p[id] ?? { done: false, at: 0, attempts: 0 };
  p[id] = {
    done: prev.done || passed,
    at: passed && !prev.done ? Date.now() : prev.at,
    attempts: prev.attempts + 1,
  };
  storage.setJSON('progress', p);
  return p;
}
