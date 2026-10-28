// Analiza leksykalna dialektu Logo z Logomocji.
//
// Leksyka nie zgłasza wyjątków: błędy (zły zapis liczby, nieznany znak,
// niezamknięty napis, przekroczony limit tokenów) trafiają do strumienia jako
// tokeny `error`, a parser zgłasza je dopiero wtedy, gdy do nich dojdzie.
// Dzięki temu błędy są raportowane w kolejności występowania w kodzie.

export const MAX_SOURCE_CHARS = 50_000;
export const MAX_TOKENS = 10_000;

export type TokenKind =
  | 'num' // 12, 12.5, .5
  | 'ident' // słowo: polecenie, nazwa
  | 'cname' // :nazwa (stara forma)
  | 'str' // "#16866a"
  | 'op' // + - * /
  | 'cmp' // < > = <= >= <>
  | 'lbr' // [
  | 'rbr' // ]
  | 'lp' // (
  | 'rp' // )
  | 'comma' // ,
  | 'colon' // :
  | 'comment' // ; ... (tylko w trybie podświetlania)
  | 'error'
  | 'eof';

export interface Token {
  kind: TokenKind;
  /** Tekst tokenu dokładnie tak, jak w źródle. */
  text: string;
  /** Wartość: liczba dla `num`, nazwa znormalizowana dla `ident`/`cname`, treść napisu dla `str`. */
  value: number | string;
  line: number;
  col: number;
  start: number;
  end: number;
  /** Przed tokenem jest biały znak (lub początek pliku). */
  spaceBefore: boolean;
  /** Za tokenem jest biały znak (lub koniec pliku). */
  spaceAfter: boolean;
  firstOnLine: boolean;
  lastOnLine: boolean;
  /** Dla tokenów `error`: komunikat. */
  message?: string;
}

/** Nazwy ignorują wielkość liter; porównujemy w postaci NFC z małych liter. */
export function normalizeName(s: string): string {
  return s.normalize('NFC').toLowerCase();
}

const IDENT_START = /[\p{L}_]/u;
const IDENT_PART = /[\p{L}\p{M}\p{N}_]/u;
const WS = /\s/;

export interface LexOptions {
  /** Zwracaj także komentarze (do kolorowania składni). */
  comments?: boolean;
}

export function tokenize(source: string, options: LexOptions = {}): Token[] {
  const tokens: Token[] = [];
  const n = source.length;
  let i = 0;
  let line = 1;
  let lineStart = 0;
  let counted = 0; // tokeny liczone do limitu (bez komentarzy)

  const push = (
    kind: TokenKind,
    start: number,
    end: number,
    value: number | string,
    message?: string,
  ) => {
    const t: Token = {
      kind,
      text: source.slice(start, end),
      value,
      line,
      col: start - lineStart + 1,
      start,
      end,
      spaceBefore: true,
      spaceAfter: true,
      firstOnLine: false,
      lastOnLine: false,
      message,
    };
    tokens.push(t);
    return t;
  };

  while (i < n) {
    const c = source[i];

    if (c === '\n' || c === '\r') {
      if (c === '\r' && source[i + 1] === '\n') i++;
      i++;
      line++;
      lineStart = i;
      continue;
    }
    if (WS.test(c)) {
      i++;
      continue;
    }
    if (c === ';') {
      const start = i;
      while (i < n && source[i] !== '\n' && source[i] !== '\r') i++;
      if (options.comments) push('comment', start, i, source.slice(start, i));
      continue;
    }

    if (counted >= MAX_TOKENS) {
      push('error', i, i + 1, '', `Przekroczono limit ${MAX_TOKENS} tokenów w programie`);
      break;
    }
    counted++;
    const start = i;

    // Liczba: 80, 12.5, .5 – wszystko inne zaczynające się od cyfry jest błędem.
    if ((c >= '0' && c <= '9') || (c === '.' && source[i + 1] >= '0' && source[i + 1] <= '9')) {
      while (i < n && source[i] >= '0' && source[i] <= '9') i++;
      if (source[i] === '.' && source[i + 1] >= '0' && source[i + 1] <= '9') {
        i++;
        while (i < n && source[i] >= '0' && source[i] <= '9') i++;
      }
      if (i < n && (IDENT_PART.test(source[i]) || source[i] === '.')) {
        while (i < n && (IDENT_PART.test(source[i]) || source[i] === '.')) i++;
        push(
          'error',
          start,
          i,
          '',
          `Niepoprawna liczba „${source.slice(start, i)}”: dozwolone są tylko zwykłe liczby dziesiętne, np. 80, 12.5 lub .5`,
        );
      } else {
        push('num', start, i, Number(source.slice(start, i)));
      }
      continue;
    }

    if (IDENT_START.test(c)) {
      i++;
      while (i < n && IDENT_PART.test(source[i])) i++;
      const text = source.slice(start, i);
      push('ident', start, i, normalizeName(text));
      continue;
    }

    if (c === ':') {
      if (i + 1 < n && IDENT_START.test(source[i + 1])) {
        i += 2;
        while (i < n && IDENT_PART.test(source[i])) i++;
        push('cname', start, i, normalizeName(source.slice(start + 1, i)));
      } else {
        i++;
        push('colon', start, i, ':');
      }
      continue;
    }

    if (c === '"') {
      i++;
      while (i < n && source[i] !== '"' && source[i] !== '\n' && source[i] !== '\r') i++;
      if (source[i] === '"') {
        i++;
        push('str', start, i, source.slice(start + 1, i - 1));
      } else {
        push('error', start, i, '', 'Niezamknięty napis: brakuje zamykającego cudzysłowu');
      }
      continue;
    }

    i++;
    switch (c) {
      case '[':
        push('lbr', start, i, c);
        break;
      case ']':
        push('rbr', start, i, c);
        break;
      case '(':
        push('lp', start, i, c);
        break;
      case ')':
        push('rp', start, i, c);
        break;
      case ',':
        push('comma', start, i, c);
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        push('op', start, i, c);
        break;
      case '=':
        push('cmp', start, i, '=');
        break;
      case '<':
        if (source[i] === '=' || source[i] === '>') i++;
        push('cmp', start, i, source.slice(start, i));
        break;
      case '>':
        if (source[i] === '=') i++;
        push('cmp', start, i, source.slice(start, i));
        break;
      default:
        push('error', start, i, '', `Niedozwolony znak „${c}”`);
    }
  }

  // Odstępy i położenie w wierszu.
  const real = tokens.filter((t) => t.kind !== 'comment');
  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k];
    const prev = tokens[k - 1];
    const next = tokens[k + 1];
    t.spaceBefore = !prev || prev.end < t.start;
    t.spaceAfter = !next || t.end < next.start;
  }
  for (let k = 0; k < real.length; k++) {
    const t = real[k];
    t.firstOnLine = k === 0 || real[k - 1].line !== t.line;
    t.lastOnLine = k === real.length - 1 || real[k + 1].line !== t.line;
  }
  if (options.comments) {
    for (const t of tokens) if (t.kind === 'comment') t.firstOnLine = t.lastOnLine = false;
  }

  tokens.push({
    kind: 'eof',
    text: '',
    value: '',
    line,
    col: n - lineStart + 1,
    start: n,
    end: n,
    spaceBefore: true,
    spaceAfter: true,
    firstOnLine: false,
    lastOnLine: true,
  });
  return tokens;
}
