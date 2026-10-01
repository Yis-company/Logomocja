import {
  LIMITS,
  LogoError,
  type Definition,
  type Instruction,
  type Mode,
  type Numeric,
  type Primitive,
  type Program,
  type Span,
} from "./types";

type Token = { text: string; span: Span };
type DefinitionBuilder = { -readonly [K in keyof Definition]: Definition[K] };
const aliases: Record<string, Primitive["kind"] | "repeat"> =
  Object.create(null);
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
} as const;
for (const [kind, words] of Object.entries(groups)) {
  for (const word of words.split(" "))
    aliases[word] = kind as Primitive["kind"] | "repeat";
}
const identifier = /^[\p{L}_][\p{L}\p{N}_]*$/u;
const numberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
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
  for (const match of source.matchAll(
    /;[^\n]*|\s+|\[|\]|"[^"\n]*"|[^\s[\];]+/gu,
  )) {
    const text = match[0];
    if (!/^\s|^;/.test(text)) {
      if (tokens.length >= LIMITS.tokens)
        throw new LogoError(
          "Za dużo poleceń i argumentów. Limit: 10 000 tokenów.",
          { line, column },
        );
      tokens.push({ text, span: { line, column } });
    }
    const lines = text.split("\n");
    if (lines.length > 1) {
      line += lines.length - 1;
      column = lines[lines.length - 1].length + 1;
    } else column += text.length;
  }
  return tokens;
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
    while (tokens[i + 1]?.span.line === start.span.line) {
      const param = tokens[++i];
      const paramName = param.text.startsWith(":") ? key(param.text.slice(1)) : "";
      if (!identifier.test(paramName) || reserved.has(paramName) || params.includes(paramName))
        throw new LogoError(`Nieprawidłowy lub powtórzony parametr „${param.text}”.`, param.span);
      params.push(paramName);
    }
    definitions[normalized] = { name: normalized, params, body: [], span: start.span };
    headers.set(startIndex, i);
  }

  let index = 0;
  let current: DefinitionBuilder | undefined;
  function argument(command: Token): Token {
    const token = tokens[index++];
    if (!token || token.text === "[" || token.text === "]" || starts.has(key(token.text)) || ends.has(key(token.text)))
      throw new LogoError(`Brakuje argumentu dla „${command.text}”.`, command.span);
    return token;
  }
  function number(command: Token): Numeric {
    const token = argument(command);
    if (token.text.startsWith(":")) {
      const parameter = key(token.text.slice(1));
      if (current?.params.includes(parameter)) return { parameter, span: token.span };
      throw new LogoError(`Nieznany parametr „${token.text}”.`, token.span);
    }
    if (!numberPattern.test(token.text) || !Number.isFinite(Number(token.text)))
      throw new LogoError("Podaj skończoną liczbę, np. 80 lub -12.5.", token.span);
    return Number(token.text);
  }
  function block(depth: number, opener?: Token): Instruction[] {
    if (depth > LIMITS.depth)
      throw new LogoError("Za dużo zagnieżdżonych powtórzeń. Limit: 32.", opener?.span);
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
        const count = number(token);
        if (typeof count === "number" && (!Number.isInteger(count) || count < 0 || count > LIMITS.repeat))
          throw new LogoError("Liczba powtórzeń musi być całkowita: od 0 do 10 000.", token.span);
        const bracket = tokens[index++];
        if (bracket?.text !== "[")
          throw new LogoError("Po liczbie powtórzeń potrzebny jest nawias [.", token.span);
        instructions.push({ kind, count, body: block(depth + 1, bracket), span: token.span });
      } else if (kind === "penup" || kind === "pendown")
        instructions.push({ kind, span: token.span });
      else if (kind === "color") {
        const color = argument(token);
        if (!/^"#[\da-f]{6}"$/i.test(color.text))
          throw new LogoError('Podaj kolor w formacie "#16866a".', color.span);
        instructions.push({ kind, value: color.text.slice(1, -1), span: token.span });
      } else if (kind) {
        if ((kind === "pitchup" || kind === "pitchdown") && mode === "2d")
          throw new LogoError("To polecenie działa w przestrzeni. Przełącz na tryb 3D.", token.span);
        const value = number(token);
        if (kind === "width" && typeof value === "number" && (!Number.isInteger(value) || value < 1 || value > 12))
          throw new LogoError("Grubość pisaka musi być całkowita: od 1 do 12.", token.span);
        instructions.push({ kind, value, span: token.span });
      } else if (definitions[word]) {
        const definition = definitions[word];
        const args = definition.params.map(() => number(token));
        const surplus = tokens[index];
        if (surplus && (numberPattern.test(surplus.text) || surplus.text.startsWith(":")))
          throw new LogoError(`Procedura „${token.text}” oczekuje ${args.length} argumentów.`, surplus.span);
        instructions.push({ kind: "call", name: word, args, span: token.span });
      } else
        throw new LogoError(`Nie znam polecenia „${token.text}”. Sprawdź słownik poleceń.`, token.span);
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
      current.body = block(0);
      if (!tokens[index] || !ends.has(key(tokens[index].text)))
        throw new LogoError(`Brakuje zakończenia procedury „${current.name}”.`, token.span);
      const end = tokens[index++];
      if (tokens[index - 2]?.span.line === end.span.line || tokens[index]?.span.line === end.span.line)
        throw new LogoError("Zakończenie procedury musi być samodzielne w wierszu.", end.span);
      current = undefined;
    } else if (ends.has(word))
      throw new LogoError("Nieoczekiwane zakończenie procedury.", token.span);
    else instructions.push(...block(0));
  }

  // Check every body, including definitions that are never called.
  const state = new Map<string, number>();
  const dependencies = (body: readonly Instruction[]): { name: string; span: Span }[] => {
    const calls: { name: string; span: Span }[] = [];
    const pending = [...body];
    while (pending.length) {
      const node = pending.pop();
      if (node?.kind === "call") calls.push({ name: node.name, span: node.span });
      else if (node?.kind === "repeat") pending.push(...node.body);
    }
    return calls;
  };
  const graph = new Map(Object.entries(definitions).map(([name, definition]) => [name, dependencies(definition.body)]));
  for (const name of Object.keys(definitions)) {
    if (state.get(name) === 2) continue;
    const stack = [{ name, index: 0 }];
    state.set(name, 1);
    while (stack.length) {
      const frame = stack[stack.length - 1];
      const edge = graph.get(frame.name)?.[frame.index++];
      if (!edge) {
        state.set(frame.name, 2);
        stack.pop();
      } else if (state.get(edge.name) === 1)
        throw new LogoError(`Procedury nie mogą wywoływać się rekurencyjnie: „${edge.name}”.`, edge.span);
      else if (state.get(edge.name) !== 2) {
        state.set(edge.name, 1);
        stack.push({ name: edge.name, index: 0 });
      }
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
    instructions: [...program.instructions, { kind: "call", name: normalized, args: [...args], span: definition.span }],
    definitions: program.definitions,
  };
}
