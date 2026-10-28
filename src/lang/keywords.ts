// Słowa kluczowe dialektu Logomocji: każda pisownia (polska, bez ogonków,
// angielska) prowadzi do jednego kanonicznego identyfikatora polecenia.

export type CommandId =
  | 'fd' | 'bk' | 'rt' | 'lt'
  | 'pu' | 'pd' | 'color' | 'width'
  | 'repeat' | 'let' | 'if' | 'ifelse' | 'stop' | 'home' | 'clear'
  | 'up' | 'down' | 'rollright' | 'rollleft';

export type KeywordId = CommandId | 'repcount' | 'to' | 'end';

const SPELLINGS: Record<KeywordId, string[]> = {
  fd: ['np', 'naprzod', 'naprzód', 'fd', 'forward'],
  bk: ['ws', 'wstecz', 'bk', 'back'],
  rt: ['pw', 'prawo', 'rt', 'right'],
  lt: ['lw', 'lewo', 'lt', 'left'],
  pu: ['pod', 'podnies', 'podnieś', 'pu', 'penup'],
  pd: ['opu', 'opusc', 'opuść', 'pd', 'pendown'],
  color: ['kolor', 'color'],
  width: ['grubosc', 'grubość', 'width'],
  repeat: ['powtorz', 'powtórz', 'repeat'],
  let: ['niech', 'let'],
  if: ['jeśli', 'jesli', 'if'],
  ifelse: ['jeżeli', 'jezeli', 'ifelse'],
  stop: ['stop'],
  home: ['dom', 'home'],
  clear: ['czyść', 'czysc', 'cs', 'clearscreen'],
  up: ['gora', 'góra', 'pitchup'],
  down: ['dol', 'dół', 'pitchdown'],
  rollright: ['pp', 'przechylprawo', 'rr', 'rollright'],
  rollleft: ['pl', 'przechyllewo', 'rl', 'rollleft'],
  repcount: ['nrpowt', 'repcount'],
  to: ['oto', 'to'],
  end: ['już', 'juz', 'end'],
};

const LOOKUP = new Map<string, KeywordId>();
for (const [id, words] of Object.entries(SPELLINGS) as [KeywordId, string[]][]) {
  for (const w of words) LOOKUP.set(w.normalize('NFC'), id);
}

/** Normalizuje nazwę: wielkość liter nie ma znaczenia. */
export function normalizeName(text: string): string {
  return text.normalize('NFC').toLowerCase();
}

export function keywordOf(name: string): KeywordId | undefined {
  return LOOKUP.get(name);
}

export function spellingsOf(id: KeywordId): readonly string[] {
  return SPELLINGS[id];
}

/** Polecenia działające tylko w trybie 3D. */
export const COMMANDS_3D: ReadonlySet<CommandId> = new Set(['up', 'down', 'rollright', 'rollleft']);

/** Polska, „główna” nazwa polecenia używana w komunikatach. */
export const DISPLAY_NAME: Record<KeywordId, string> = {
  fd: 'np', bk: 'ws', rt: 'pw', lt: 'lw', pu: 'pod', pd: 'opu',
  color: 'kolor', width: 'grubość', repeat: 'powtórz', let: 'niech',
  if: 'jeśli', ifelse: 'jeżeli', stop: 'stop', home: 'dom', clear: 'czyść',
  up: 'góra', down: 'dół', rollright: 'pp', rollleft: 'pl',
  repcount: 'nrpowt', to: 'oto', end: 'już',
};
