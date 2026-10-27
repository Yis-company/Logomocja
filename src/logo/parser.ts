import {
  type Comparison,
  type Condition,
  type Definition,
  type Expr,
  type Instruction,
  LIMITS,
  LogoError,
  type Mode,
  type Primitive,
  type Program,
} from "./types";

/** `before`/`after`: whitespace (or the program edge) on that side of the token. */
type Token = { text: string; span: { line: number; column: number }; before: boolean; after: boolean };
type DefinitionBuilder = { -readonly [K in keyof Definition]: Definition[K] };
type Word = Primitive["kind"] | "repeat" | "let" | "if" | "ifelse" | "stop" | "counter";
const aliases: Record<string, Word> = Object.create(null);
const groups = {
  forward: "np naprzod naprzód fd forward",
  back: "ws wstecz bk back",
  right: "pw prawo rt right",
  left: "lw lewo lt left",
  penup: "pod podnies podnieś pu penup",
  pendown: "opu opusc opuść pd pendown",
  color: "kolor color",
  width: "grubosc grubość width",
  repeat: "powtorz powtórz repeat",
  pitchup: "gora góra pitchup",
  pitchdown: "dol dół pitchdown",
  rollright: "pp przechylprawo rr rollright",
  rollleft: "pl przechyllewo rl rollleft",
  home: "dom home",
  clear: "czyść czysc cs clearscreen",
  let: "niech let",
  if: "jeśli jesli if",
  ifelse: "jeżeli jezeli ifelse",
  stop: "stop",
  counter: "nrpowt repcount",
} as const;
for (const [kind, words] of Object.entries(groups))
  for (const word of words.split(" ")) aliases[word] = kind as Word;
const spatial = new Set<Word>(["pitchup", "pitchdown", "rollright", "rollleft"]);
const identifier = /^[\p{L}_][\p{L}\p{N}_]*$/u;
const numberPattern = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const comparisons = new Set<string>(["<", ">", "=", "<=", ">=", "<>"]);
const starts = new Set(["oto", "to"]);
const ends = new Set(["już", "juz", "end"]);
const reserved = new Set([...Object.keys(aliases), ...starts, ...ends]);
const key = (text: string) => text.toLowerCase();

function tokenize(source: string): Token[] {
  if (source.length > LIMITS.source)
    throw new LogoError("Program jest za długi. Limit: 50 000 znaków.");
  const tokens: Token[] = [];
  let line = 1;
  let column = 1;
  let gap = true;
  for (const match of source.matchAll(
    /;[^\n]*|\s+|\[|\]|\(|\)|"[^"\n]*"|,|ma:|<=|>=|<>|[<>=+\-*/]|[^\s[\]();,<>=+\-*/]+/giu,
  )) {
    const text = match[0];
    if (/^\s|^;/.test(text)) {
      gap = true;
      const last = tokens.at(-1);
      if (last) last.after = true;
    } else {
      if (tokens.length >= LIMITS.tokens)
        throw new LogoError("Za dużo poleceń i argumentów. Limit: 10 000 tokenów.", { line, column });
      tokens.push({ text, span: { line, column }, before: gap, after: false });
      gap = false;
    }
    const lines = text.split("\n");
    if (lines.length > 1) {
      line += lines.length - 1;
      column = lines[lines.length - 1].length + 1;
    } else column += text.length;
  }
  const last = tokens.at(-1);
  if (last) last.after = true;
  return tokens;
}

/** Value of an expression made only of literals, or null when it depends on run-time state. */
export function constant(expr: Expr): number | null {
  switch (expr.kind) {
    case "number":
      return expr.value;
    case "unary": {
      const value = constant(expr.operand);
      return value === null ? null : expr.sign * value;
    }
    case "binary": {
      const left = constant(expr.left);
      const right = constant(expr.right);
      if (left === null || right === null || (expr.op === "/" && right === 0)) return null;
      return expr.op === "+" ? left + right : expr.op === "-" ? left - right : expr.op === "*" ? left * right : left / right;
    }
    default:
      return null;
  }
}

export function parse(source: string, mode: Mode): Program {
  const tokens = tokenize(source);
  const definitions: Record<string, DefinitionBuilder> = Object.create(null);
  const headers = new Map<number, number>();
  // Collect signatures first, so a call can precede its definition.
  for (let i = 0; i < tokens.length; i++) {
    const startIndex = i;
    const start = tokens[i];
    if (!starts.has(key(start.text))) continue;
    if (tokens[startIndex - 1]?.span.line === start.span.line)
      throw new LogoError("Nagłówek procedury musi zaczynać nowy wiersz.", start.span);
    const name = tokens[++i];
    if (!name || name.span.line !== start.span.line || !identifier.test(name.text))
      throw new LogoError("Po oto/to podaj nazwę procedury w tym samym wierszu.", start.span);
    const normalized = key(name.text);
    if (reserved.has(normalized) || definitions[normalized])
      throw new LogoError(`Nazwa „${name.text}” jest zastrzeżona lub powtórzona.`, name.span);
    const params: string[] = [];
    function addParameter(param: Token, paramName: string) {
      if (!identifier.test(paramName) || reserved.has(paramName) || params.includes(paramName))
        throw new LogoError(`Nieprawidłowy lub powtórzony parametr „${param.text}”.`, param.span);
      params.push(paramName);
    }
    if (tokens[i + 1]?.span.line === start.span.line && key(tokens[i + 1].text) === "ma:") {
      const marker = tokens[++i];
      let separator = marker;
      while (true) {
        const param = tokens[i + 1];
        if (!param || param.span.line !== start.span.line)
          throw new LogoError("Po ma: i każdym przecinku podaj nazwę parametru w tym samym wierszu.", separator.span);
        i++;
        addParameter(param, key(param.text));
        if (tokens[i + 1]?.span.line !== start.span.line) break;
        separator = tokens[++i];
        if (separator.text !== ",")
          throw new LogoError("Oddziel nazwy parametrów przecinkiem.", separator.span);
      }
    } else {
      while (tokens[i + 1]?.span.line === start.span.line) {
        const param = tokens[++i];
        addParameter(param, param.text.startsWith(":") ? key(param.text.slice(1)) : "");
      }
    }
    definitions[normalized] = { name: normalized, params, body: [], span: start.span };
    headers.set(startIndex, i);
  }

  // Names declared with niech, per procedure ("" is the top level).
  const declared: Record<string, Set<string>> = { "": new Set() };
  for (const name of Object.keys(definitions)) declared[name] = new Set();
  let region = "";
  for (let i = 0; i < tokens.length; i++) {
    const last = headers.get(i);
    if (last !== undefined) {
      region = key(tokens[i + 1].text);
      i = last;
      continue;
    }
    const word = key(tokens[i].text);
    if (ends.has(word)) region = "";
    else if (aliases[word] === "let") {
      const name = tokens[i + 1];
      const normalized = name ? key(name.text) : "";
      if (name && identifier.test(name.text) && !reserved.has(normalized)) {
        if (definitions[normalized])
          throw new LogoError(`„${name.text}” jest nazwą procedury, nie może być zmienną.`, name.span);
        declared[region].add(normalized);
      }
    }
  }

  let index = 0;
  let current: DefinitionBuilder | undefined;
  let repeatDepth = 0;
  const known = (name: string) =>
    (current !== undefined && (current.params.includes(name) || declared[current.name].has(name))) ||
    declared[""].has(name);
  const startsArgument = (token: Token | undefined): boolean => {
    if (!token) return false;
    const word = key(token.text);
    if (numberPattern.test(token.text) || "(+-".includes(token.text) || token.text.startsWith(":")) return true;
    if (aliases[word] === "counter") return true;
    return identifier.test(token.text) && !reserved.has(word) && !definitions[word] && known(word);
  };
  const binaryAhead = (...ops: string[]) => {
    const token = tokens[index];
    return token !== undefined && ops.includes(token.text) && token.before === token.after;
  };
  function expression(owner: Token): Expr {
    let left = term(owner);
    while (binaryAhead("+", "-")) {
      const op = tokens[index++].text as "+" | "-";
      left = { kind: "binary", op, left, right: term(owner), span: left.span };
    }
    return left;
  }
  function term(owner: Token): Expr {
    let left = unary(owner);
    while (binaryAhead("*", "/")) {
      const op = tokens[index++].text as "*" | "/";
      left = { kind: "binary", op, left, right: unary(owner), span: left.span };
    }
    return left;
  }
  function unary(owner: Token): Expr {
    const token = tokens[index];
    if (token && (token.text === "-" || token.text === "+")) {
      index++;
      return { kind: "unary", sign: token.text === "-" ? -1 : 1, operand: unary(owner), span: token.span };
    }
    return primary(owner);
  }
  function primary(owner: Token): Expr {
    const token = tokens[index];
    // A missing argument is reported at the token found in its place, or at the command at the end.
    if (!token || "[])".includes(token.text) || starts.has(key(token.text)) || ends.has(key(token.text)))
      throw new LogoError(`Brakuje argumentu dla „${owner.text}”.`, token?.span ?? owner.span);
    index++;
    if (token.text === "(") {
      const inner = expression(owner);
      if (tokens[index]?.text !== ")") throw new LogoError("Brakuje nawiasu ).", token.span);
      index++;
      return { ...inner, span: token.span };
    }
    if (numberPattern.test(token.text)) {
      const value = Number(token.text);
      if (!Number.isFinite(value)) throw new LogoError("Podaj skończoną liczbę, np. 80 lub -12.5.", token.span);
      return { kind: "number", value, span: token.span };
    }
    const colon = token.text.startsWith(":");
    const word = key(colon ? token.text.slice(1) : token.text);
    if (!colon && aliases[word] === "counter") {
      if (repeatDepth === 0) throw new LogoError("nrpowt działa tylko wewnątrz powtórz.", token.span);
      return { kind: "counter", span: token.span };
    }
    if (identifier.test(word) && !reserved.has(word)) {
      if (known(word)) return { kind: "name", name: word, span: token.span };
      if (!definitions[word])
        throw new LogoError(`Nieznana nazwa „${token.text}”. Użyj parametru lub zmiennej z niech.`, token.span);
    }
    throw new LogoError(`Argument dla „${owner.text}” musi być liczbą, nazwą lub wyrażeniem.`, token.span);
  }
  function condition(owner: Token): Condition {
    const left = expression(owner);
    const op = tokens[index];
    if (!op || !comparisons.has(op.text))
      throw new LogoError(`Po „${owner.text}” podaj warunek, np. bok < 10.`, op?.span ?? owner.span);
    index++;
    return { op: op.text as Comparison, left, right: expression(owner), span: left.span };
  }
  function bracket(owner: Token, depth: number, loop: boolean): Instruction[] {
    const open = tokens[index++];
    if (open?.text !== "[")
      throw new LogoError(`Po „${owner.text}” potrzebny jest nawias [.`, open?.span ?? owner.span);
    if (loop) repeatDepth++;
    const body = block(depth + 1, open);
    if (loop) repeatDepth--;
    return body;
  }
  function block(depth: number, opener?: Token): Instruction[] {
    if (depth > LIMITS.depth)
      throw new LogoError("Za dużo zagnieżdżonych nawiasów. Limit: 32.", opener?.span);
    const instructions: Instruction[] = [];
    while (index < tokens.length) {
      const token = tokens[index];
      const word = key(token.text);
      if (token.text === "]") {
        index++;
        if (!opener) throw new LogoError("Nieoczekiwany nawias ].", token.span);
        return instructions;
      }
      if (starts.has(word) || ends.has(word)) {
        if (opener || (starts.has(word) && current))
          throw new LogoError("Definicja procedury może być tylko na najwyższym poziomie.", token.span);
        break;
      }
      index++;
      const kind = aliases[word];
      if (kind === "repeat") {
        const count = expression(token);
        const value = constant(count);
        if (value !== null && (!Number.isInteger(value) || value < 0 || value > LIMITS.repeat))
          throw new LogoError("Liczba powtórzeń musi być całkowita: od 0 do 10 000.", count.span);
        instructions.push({ kind, count, body: bracket(token, depth, true), span: token.span });
      } else if (kind === "if" || kind === "ifelse") {
        const test = condition(token);
        const body = bracket(token, depth, false);
        const otherwise = kind === "ifelse" ? bracket(token, depth, false) : null;
        instructions.push({ kind: "if", condition: test, body, otherwise, span: token.span });
      } else if (kind === "let") {
        const name = tokens[index++];
        const normalized = name ? key(name.text) : "";
        if (!name || !identifier.test(name.text) || reserved.has(normalized) || definitions[normalized])
          throw new LogoError("Po niech podaj nazwę zmiennej, a po niej wartość.", name?.span ?? token.span);
        instructions.push({ kind, name: normalized, value: expression(token), span: token.span });
      } else if (kind === "stop" || kind === "penup" || kind === "pendown" || kind === "home" || kind === "clear")
        instructions.push({ kind, span: token.span });
      else if (kind === "color") {
        const color = tokens[index++];
        if (!color || !/^"#[\da-f]{6}"$/i.test(color.text))
          throw new LogoError('Podaj kolor w formacie "#16866a".', color?.span ?? token.span);
        instructions.push({ kind, value: color.text.slice(1, -1).toLowerCase(), span: token.span });
      } else if (kind && kind !== "counter") {
        if (spatial.has(kind) && mode === "2d")
          throw new LogoError("To polecenie działa w przestrzeni. Przełącz na tryb 3D.", token.span);
        const value = expression(token);
        const literal = constant(value);
        if (kind === "width" && literal !== null && (!Number.isInteger(literal) || literal < 1 || literal > 12))
          throw new LogoError("Grubość pisaka musi być całkowita: od 1 do 12.", value.span);
        instructions.push({ kind, value, span: token.span });
      } else if (definitions[word]) {
        const definition = definitions[word];
        const args = definition.params.map(() => expression(token));
        const surplus = tokens[index];
        if (surplus && startsArgument(surplus))
          throw new LogoError(`Procedura „${token.text}” oczekuje ${args.length} argumentów.`, surplus.span);
        instructions.push({ kind: "call", name: word, args, span: token.span });
      } else if (kind === "counter" || startsArgument(token) || /^[-+*/()<>=:"]|^\d|^\./.test(token.text))
        throw new LogoError("Nieoczekiwana wartość. Tu powinno być polecenie.", token.span);
      else throw new LogoError(`Nie znam polecenia „${token.text}”. Sprawdź słownik poleceń.`, token.span);
    }
    if (opener) throw new LogoError("Brakuje zamykającego nawiasu ].", opener.span);
    return instructions;
  }

  const instructions: Instruction[] = [];
  while (index < tokens.length) {
    const token = tokens[index];
    const word = key(token.text);
    if (starts.has(word)) {
      const last = headers.get(index);
      if (last === undefined) throw new LogoError("Nieprawidłowa definicja.", token.span);
      current = definitions[key(tokens[index + 1].text)];
      index = last + 1;
      repeatDepth = 0;
      current.body = block(0);
      if (!tokens[index] || !ends.has(key(tokens[index].text)))
        throw new LogoError(`Brakuje zakończenia procedury „${current.name}”.`, token.span);
      const end = tokens[index++];
      if (tokens[index - 2]?.span.line === end.span.line || tokens[index]?.span.line === end.span.line)
        throw new LogoError("Zakończenie procedury musi być samodzielne w wierszu.", end.span);
      current = undefined;
    } else if (ends.has(word))
      throw new LogoError("Nieoczekiwane zakończenie procedury.", token.span);
    else {
      repeatDepth = 0;
      instructions.push(...block(0));
    }
  }
  return { instructions, definitions };
}

export function appendCall(program: Program, name: string, args: number[]): Program {
  const normalized = key(name);
  const definition = program.definitions[normalized];
  if (!definition) throw new LogoError(`Nieznana procedura „${name}”.`);
  if (args.length !== definition.params.length || args.some((arg) => !Number.isFinite(arg)))
    throw new LogoError(`Procedura „${name}” oczekuje ${definition.params.length} skończonych argumentów.`);
  return {
    instructions: [
      ...program.instructions,
      { kind: "call", name: normalized, args: args.map((value) => ({ kind: "number", value, span: definition.span })), span: definition.span },
    ],
    definitions: program.definitions,
  };
}
