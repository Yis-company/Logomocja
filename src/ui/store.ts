import type { Mode } from '../lang/ast';

/** Lokalne przechowywanie: szkice, ustawienia, postępy. Nigdy nie wyrzuca wyjątków. */
const NS = 'logomocja:v1:';

let memory: Record<string, string> = {};

function rawGet(key: string): string | null {
  try {
    return localStorage.getItem(NS + key);
  } catch {
    return memory[key] ?? null;
  }
}

function rawSet(key: string, value: string): void {
  try {
    localStorage.setItem(NS + key, value);
  } catch {
    memory[key] = value;
  }
}

function rawRemove(key: string): void {
  try {
    localStorage.removeItem(NS + key);
  } catch {
    delete memory[key];
  }
}

export function getJSON<T>(key: string, fallback: T): T {
  const s = rawGet(key);
  if (s === null) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export function setJSON(key: string, value: unknown): void {
  rawSet(key, JSON.stringify(value));
}

export function getText(key: string): string | null {
  return rawGet(key);
}

export function setText(key: string, value: string): void {
  rawSet(key, value);
}

export function remove(key: string): void {
  rawRemove(key);
}

export function resetMemory(): void {
  memory = {};
}

// ---------------------------------------------------------------------------

export type ThemePref = 'system' | 'light' | 'dark';

export const Settings = {
  get mode(): Mode {
    return getText('mode') === '3d' ? '3d' : '2d';
  },
  set mode(m: Mode) {
    setText('mode', m);
  },
  get theme(): ThemePref {
    const t = getText('theme');
    return t === 'light' || t === 'dark' ? t : 'system';
  },
  set theme(t: ThemePref) {
    setText('theme', t);
  },
  get speed(): number {
    const raw = getText('speed');
    const v = raw === null ? NaN : Number(raw);
    return Number.isInteger(v) && v >= 0 && v <= 5 ? v : 3;
  },
  set speed(v: number) {
    setText('speed', String(v));
  },
  /** Udział szerokości edytora w układzie dwukolumnowym (0,25–0,7). */
  get split(): number {
    const raw = getText('split');
    const v = raw === null ? NaN : Number(raw);
    return Number.isFinite(v) && v >= 0.25 && v <= 0.7 ? v : 0.42;
  },
  set split(v: number) {
    setText('split', String(Math.round(v * 1000) / 1000));
  },
};

export const Drafts = {
  get(mode: Mode): string | null {
    return getText(`draft:${mode}`);
  },
  set(mode: Mode, text: string): void {
    setText(`draft:${mode}`, text);
  },
};

// ---------------------------------------------------------------------------
// Zachowane szkice (kopie zapasowe, gdy coś wczytujemy w miejsce niezapisanego kodu)

export interface StashEntry {
  id: string;
  mode: Mode;
  source: string;
  savedAt: number;
  label: string;
}

const STASH_MAX = 30;

export const Stash = {
  list(): StashEntry[] {
    const v = getJSON<StashEntry[]>('stash', []);
    return Array.isArray(v) ? v.filter((e) => e && typeof e.source === 'string') : [];
  },
  save(list: StashEntry[]): void {
    setJSON('stash', list.slice(0, STASH_MAX));
  },
  add(mode: Mode, source: string, label?: string): StashEntry {
    const list = Stash.list();
    const existing = list.find((e) => e.mode === mode && e.source === source);
    if (existing) return existing;
    const entry: StashEntry = {
      id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
      mode,
      source,
      savedAt: Date.now(),
      label: label ?? guessLabel(source),
    };
    Stash.save([entry, ...list]);
    return entry;
  },
  remove(id: string): void {
    Stash.save(Stash.list().filter((e) => e.id !== id));
  },
};

export function guessLabel(source: string): string {
  const first = source.split(/\r?\n/).map((l) => l.trim()).find((l) => l.length > 0) ?? '';
  const t = first.replace(/^;+\s*/, '');
  return t.length > 48 ? t.slice(0, 47) + '…' : t || 'Szkic bez nazwy';
}

// ---------------------------------------------------------------------------
// Wyzwania

export interface ChallengeProgress {
  solved: boolean;
  solvedAt?: number;
  attempts: number;
  /** Najlepsza zgodność w procentach (0–100). */
  best?: number;
}

export const Progress = {
  all(): Record<string, ChallengeProgress> {
    const v = getJSON<Record<string, ChallengeProgress>>('challenges', {});
    return v && typeof v === 'object' ? v : {};
  },
  get(id: string): ChallengeProgress {
    return Progress.all()[id] ?? { solved: false, attempts: 0 };
  },
  update(id: string, fn: (p: ChallengeProgress) => ChallengeProgress): ChallengeProgress {
    const all = Progress.all();
    const next = fn(all[id] ?? { solved: false, attempts: 0 });
    all[id] = next;
    setJSON('challenges', all);
    return next;
  },
  reset(): void {
    remove('challenges');
  },
};

export const ChallengeDrafts = {
  get(id: string): string | null {
    return getText(`challenge:${id}`);
  },
  set(id: string, text: string): void {
    setText(`challenge:${id}`, text);
  },
};

