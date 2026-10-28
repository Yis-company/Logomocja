export type Mode = '2d' | '3d';
export type Vec3 = [number, number, number];
export type Segment = { from: Vec3; to: Vec3; color: string; width: number };
export type LogoError = { message: string; line: number; column: number };
export type RunResult = { segments: Segment[]; error: LogoError | null };

type Loc = { line: number; column: number; start: number; end: number };
type Token = Loc & { kind: 'word' | 'number' | 'color' | 'badColor' | 'op' | 'compare' | 'open' | 'close' | 'parenOpen' | 'parenClose' | 'comma' | 'colon' | 'varref' | 'badNumber' | 'unknown'; value: string };
type Expr =
  | { kind: 'number'; value: number; loc: Loc }
  | { kind: 'variable'; name: string; loc: Loc }
  | { kind: 'repcount'; loc: Loc }
  | { kind: 'group'; value: Expr; loc: Loc }
  | { kind: 'unary'; op: '+' | '-'; value: Expr; loc: Loc }
  | { kind: 'binary'; op: '+' | '-' | '*' | '/'; left: Expr; right: Expr; loc: Loc };
type Condition = { left: Expr; op: string; right: Expr; loc: Loc };
type Node =
  | { type: 'move'; direction: 1 | -1; value: Expr; loc: Loc }
  | { type: 'turn'; direction: 1 | -1; value: Expr; loc: Loc }
  | { type: 'pen'; down: boolean; loc: Loc }
  | { type: 'color'; value: string; loc: Loc }
  | { type: 'width'; value: Expr; loc: Loc }
  | { type: 'repeat'; value: Expr; body: Node[]; loc: Loc }
  | { type: 'let'; name: string; nameLoc: Loc; value: Expr; loc: Loc }
  | { type: 'if'; condition: Condition; thenBody: Node[]; elseBody?: Node[]; loc: Loc }
  | { type: 'call'; name: string; args: Expr[]; loc: Loc }
  | { type: 'stop' | 'home' | 'clear'; loc: Loc }
  | { type: 'pitch'; direction: 1 | -1; value: Expr; loc: Loc }
  | { type: 'roll'; direction: 1 | -1; value: Expr; loc: Loc };
type Procedure = { name: string; params: string[]; body: Node[]; loc: Loc; localNames: Set<string> };
type Program = { body: Node[]; procedures: Map<string, Procedure>; globalNames: Set<string> };

const commandAliases: Record<string, string> = {};
const alias = (target: string, ...names: string[]) => names.forEach(name => { commandAliases[name] = target; });
alias('moveForward', 'np', 'naprzod', 'naprzód', 'fd', 'forward');
alias('moveBackward', 'ws', 'wstecz', 'bk', 'back');
alias('turnRight', 'pw', 'prawo', 'rt', 'right');
alias('turnLeft', 'lw', 'lewo', 'lt', 'left');
alias('penUp', 'pod', 'podnies', 'podnieś', 'pu', 'penup');
alias('penDown', 'opu', 'opusc', 'opuść', 'pd', 'pendown');
alias('color', 'kolor', 'color');
alias('width', 'grubosc', 'grubość', 'width');
alias('repeat', 'powtorz', 'powtórz', 'repeat');
alias('let', 'niech', 'let');
alias('if', 'jeśli', 'jesli', 'if');
alias('ifelse', 'jeżeli', 'jezeli', 'ifelse');
alias('stop', 'stop');
alias('home', 'dom', 'home');
alias('clear', 'czyść', 'czysc', 'cs', 'clearscreen');
alias('pitchUp', 'gora', 'góra', 'pitchup');
alias('pitchDown', 'dol', 'dół', 'pitchdown');
alias('rollRight', 'pp', 'przechylprawo', 'rr', 'rollright');
alias('rollLeft', 'pl', 'przechyllewo', 'rl', 'rollleft');
const repeatNames = new Set(['nrpowt', 'repcount']);
const commandWords = new Set(Object.keys(commandAliases));
const reservedDefinitionWords = new Set(['oto', 'to', 'już', 'juz', 'end', 'ma']);

const normalize = (value: string) => value.normalize('NFC').toLocaleLowerCase('pl-PL');
const isNameStart = (char: string) => /[\p{L}_]/u.test(char);
const isNameChar = (char: string) => /[\p{L}\p{N}_]/u.test(char);

class LogoFault extends Error {
  readonly info: LogoError;
  constructor(message: string, loc: Loc) {
    super(message);
    this.info = { message, line: loc.line, column: loc.column };
  }
}

export function logoError(error: unknown): LogoError {
  return error instanceof LogoFault ? error.info : { message: 'Wystąpił nieoczekiwany błąd programu.', line: 1, column: 1 };
}

const fault = (message: string, loc: Loc): never => { throw new LogoFault(message, loc); };

export function tokenize(source: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  let line = 1;
  let column = 1;
  const locAt = (start: number, end: number, ln: number, col: number): Loc => ({ line: ln, column: col, start, end });
  const advance = (until: number) => {
    while (i < until) {
      const ch = source[i];
      if (ch === '\n') { line += 1; column = 1; i += 1; }
      else {
        const cp = source.codePointAt(i)!;
        const char = String.fromCodePoint(cp);
        i += char.length;
        column += 1;
      }
    }
  };
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) { advance(i + 1); continue; }
    if (ch === ';') {
      while (i < source.length && source[i] !== '\n') advance(i + 1);
      continue;
    }
    const start = i;
    const ln = line;
    const col = column;
    if (ch === '"') {
      let end = i + 1;
      while (end < source.length && source[end] !== '"' && source[end] !== '\n') end += 1;
      const closed = source[end] === '"';
      if (closed) end += 1;
      const raw = source.slice(start, end);
      const valid = closed && /^"#[\da-f]{6}"$/i.test(raw);
      advance(end);
      out.push({ ...locAt(start, end, ln, col), kind: valid ? 'color' : 'badColor', value: raw });
      continue;
    }
    if (ch === ':' && isNameStart(source[i + 1] || '')) {
      let end = i + 2;
      while (isNameChar(source[end] || '')) end += 1;
      const raw = source.slice(i + 1, end);
      advance(end);
      out.push({ ...locAt(start, end, ln, col), kind: 'varref', value: normalize(raw) });
      continue;
    }
    if (/[\d]/.test(ch) || (ch === '.' && /\d/.test(source[i + 1] || ''))) {
      let end = i;
      while (end < source.length && /[\d.]/.test(source[end])) end += 1;
      // Consume a numeric-looking suffix so exponent and radix spellings fail as one token.
      if (/[\p{L}_]/u.test(source[end] || '')) {
        while (end < source.length && /[\p{L}\p{N}_.]/u.test(source[end])) end += 1;
      }
      const raw = source.slice(i, end);
      const valid = /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw) && Number.isFinite(Number(raw));
      advance(end);
      out.push({ ...locAt(start, end, ln, col), kind: valid ? 'number' : 'badNumber', value: raw });
      continue;
    }
    if (isNameStart(ch)) {
      let end = i + 1;
      while (isNameChar(source[end] || '')) end += 1;
      const raw = source.slice(i, end);
      advance(end);
      out.push({ ...locAt(start, end, ln, col), kind: 'word', value: normalize(raw) });
      continue;
    }
    const two = source.slice(i, i + 2);
    if (['<=', '>=', '<>'].includes(two)) {
      advance(i + 2);
      out.push({ ...locAt(start, i, ln, col), kind: 'compare', value: two });
      continue;
    }
    if ('+-*/'.includes(ch)) {
      advance(i + 1);
      out.push({ ...locAt(start, i, ln, col), kind: 'op', value: ch });
      continue;
    }
    if ('<>='.includes(ch)) {
      advance(i + 1);
      out.push({ ...locAt(start, i, ln, col), kind: 'compare', value: ch });
      continue;
    }
    const kind = ch === '[' ? 'open' : ch === ']' ? 'close' : ch === '(' ? 'parenOpen' : ch === ')' ? 'parenClose' : ch === ',' ? 'comma' : ch === ':' ? 'colon' : 'unknown';
    advance(i + 1);
    out.push({ ...locAt(start, i, ln, col), kind, value: ch });
  }
  return out;
}

function splitDefinitions(tokens: Token[], source: string): { main: Token[]; rawProcedures: Array<{ name: string; params: string[]; paramLocs: Token[]; tokens: Token[]; loc: Loc }> } {
  const main: Token[] = [];
  const rawProcedures: Array<{ name: string; params: string[]; paramLocs: Token[]; tokens: Token[]; loc: Loc }> = [];
  let i = 0;
  let bracketDepth = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    const atLineStart = i === 0 || tokens[i - 1].line !== t.line;
    if (bracketDepth === 0 && atLineStart && t.kind === 'word' && ['oto', 'to'].includes(t.value)) {
      const lineTokens: Token[] = [];
      let j = i;
      while (j < tokens.length && tokens[j].line === t.line) lineTokens.push(tokens[j++]);
      if (lineTokens.length < 2 || lineTokens[1].kind !== 'word') fault('Nagłówek procedury wymaga nazwy.', lineTokens[0]);
      const name = lineTokens[1].value;
      if (!/^[\p{L}_][\p{L}\p{N}_]*$/u.test(name)) fault('Nieprawidłowa nazwa procedury.', lineTokens[1]);
      const params: string[] = [];
      const paramLocs: Token[] = [];
      if (lineTokens.length > 2) {
        let p = 2;
        if (lineTokens[p]?.kind === 'word' && lineTokens[p].value === 'ma') {
          if (lineTokens[p + 1]?.kind !== 'colon') fault('Po „ma” wpisz dwukropek.', lineTokens[p]);
          p += 2;
          let expectName = true;
          while (p < lineTokens.length) {
            const token = lineTokens[p];
            if (expectName) {
              if (token.kind !== 'word' && token.kind !== 'varref') fault('Oczekiwano nazwy parametru.', token);
              params.push(token.value);
              paramLocs.push(token);
              expectName = false;
            } else {
              if (token.kind !== 'comma') fault('Parametry rozdziel przecinkami.', token);
              expectName = true;
            }
            p += 1;
          }
          if (expectName && params.length) fault('Brak nazwy parametru po przecinku.', lineTokens[lineTokens.length - 1]);
        } else {
          for (let k = p; k < lineTokens.length; k += 1) {
            if (lineTokens[k].kind !== 'varref') fault('W starym nagłówku parametry zapisuje się jako :nazwa.', lineTokens[k]);
            params.push(lineTokens[k].value);
            paramLocs.push(lineTokens[k]);
          }
        }
      }
      const seen = new Set<string>();
      for (let p = 0; p < params.length; p += 1) {
        const param = params[p];
        if (seen.has(param)) fault(`Powtórzony parametr „${param}”.`, paramLocs[p]);
        if (commandWords.has(param) || reservedDefinitionWords.has(param) || repeatNames.has(param)) fault(`„${param}” jest nazwą zarezerwowaną i nie może być parametrem.`, paramLocs[p]);
        seen.add(param);
      }
      let endStart = -1;
      let endIndex = -1;
      let bodyDepth = 0;
      for (let k = j; k < tokens.length;) {
        let end = k + 1;
        while (end < tokens.length && tokens[end].line === tokens[k].line) end += 1;
        if (bodyDepth === 0 && end - k === 1 && tokens[k].kind === 'word' && ['już', 'juz', 'end'].includes(tokens[k].value)) {
          endStart = k;
          endIndex = end;
          break;
        }
        for (let n = k; n < end; n += 1) {
          if (tokens[n].kind === 'open') bodyDepth += 1;
          else if (tokens[n].kind === 'close') bodyDepth = Math.max(0, bodyDepth - 1);
        }
        k = end;
      }
      if (endStart < 0) fault(`Procedura „${name}” nie ma zakończenia „już”.`, t);
      rawProcedures.push({ name, params, paramLocs, tokens: tokens.slice(j, endStart), loc: t });
      i = endIndex;
      continue;
    }
    if (t.kind === 'open') bracketDepth += 1;
    else if (t.kind === 'close') bracketDepth -= 1;
    main.push(t);
    i += 1;
  }
  return { main, rawProcedures };
}

class Parser {
  private index = 0;
  private bracketDepth = 0;
  constructor(private tokens: Token[], private source: string, private procedures: Map<string, Procedure>) {}
  private peek(offset = 0) { return this.tokens[this.index + offset]; }
  private take() { return this.tokens[this.index++]; }
  private commandTarget(token: Token | undefined): string | undefined {
    if (!token || token.kind !== 'word') return undefined;
    return commandAliases[token.value];
  }
  parseBody(expectClose = false): Node[] {
    const body: Node[] = [];
    while (this.index < this.tokens.length) {
      const token = this.peek()!;
      if (token.kind === 'close') {
        if (!expectClose) fault('Nawias „]” nie ma pary.', token);
        this.take();
        return body;
      }
      body.push(this.parseNode());
    }
    if (expectClose) {
      const loc = this.tokens.at(-1) || { line: 1, column: 1, start: 0, end: 0 };
      fault('Brakuje nawiasu zamykającego „]”.', loc);
    }
    return body;
  }
  private parseBracketBody(openToken: Token): Node[] {
    this.bracketDepth += 1;
    if (this.bracketDepth > 32) fault('Przekroczono limit zagnieżdżenia nawiasów (32).', openToken);
    const body = this.parseBody(true);
    this.bracketDepth -= 1;
    return body;
  }
  private parseNode(): Node {
    const token = this.take();
    if (token.kind === 'badColor') fault('Kolor musi mieć postać „#rrggbb” w cudzysłowie.', token);
    if (token.kind === 'badNumber') fault(`Nieprawidłowy zapis liczby „${token.value}”.`, token);
    if (token.kind !== 'word') {
      if (token.kind === 'open') fault('Nawias „[” musi rozpoczynać ciało powtórzenia lub warunku.', token);
      if (token.kind === 'parenOpen' || token.kind === 'parenClose') fault('Nawias okrągły występuje poza wyrażeniem.', token);
      if (token.kind === 'color') fault('Kolor może wystąpić tylko po poleceniu „kolor”.', token);
      if (token.kind === 'number' || token.kind === 'varref' || token.kind === 'op') fault('Wartość w miejscu polecenia.', token);
      fault(`Nieprawidłowy token „${token.value}”.`, token);
    }
    const target = this.commandTarget(token);
    if (target) return this.parseCommand(target, token);
    const procedure = this.procedures.get(token.value);
    if (procedure) {
      const args: Expr[] = [];
      for (let i = 0; i < procedure.params.length; i += 1) args.push(this.parseExpression(token));
      const extra = this.peek();
      const extraValue = extra && extra.kind !== 'close' && (extra.kind !== 'word'
        || (!commandAliases[extra.value] && !this.procedures.has(extra.value)));
      if (extraValue) {
        const count = procedure.params.length;
        const noun = count === 1 ? 'argument' : count > 1 && count < 5 ? 'argumenty' : 'argumentów';
        fault(`Procedura „${token.value}” wymaga dokładnie ${count} ${noun}.`, extra!);
      }
      return { type: 'call', name: token.value, args, loc: token };
    }
    if (['oto', 'to'].includes(token.value)) fault('Definicje procedur są dozwolone tylko na najwyższym poziomie.', token);
    if (['już', 'juz', 'end'].includes(token.value)) fault('Zakończenie procedury nie ma nagłówka „oto”.', token);
    if (repeatNames.has(token.value)) fault('Wartość „nrpowt” nie jest poleceniem.', token);
    fault(`Nieznane polecenie „${token.value}”.`, token);
    return fault('Nieznane polecenie.', token);
  }
  private parseCommand(command: string, token: Token): Node {
    switch (command) {
      case 'moveForward': return { type: 'move', direction: 1, value: this.parseExpression(token), loc: token };
      case 'moveBackward': return { type: 'move', direction: -1, value: this.parseExpression(token), loc: token };
      case 'turnRight': return { type: 'turn', direction: 1, value: this.parseExpression(token), loc: token };
      case 'turnLeft': return { type: 'turn', direction: -1, value: this.parseExpression(token), loc: token };
      case 'penUp': return { type: 'pen', down: false, loc: token };
      case 'penDown': return { type: 'pen', down: true, loc: token };
      case 'color': {
        const next = this.peek();
        if (!next || next.kind !== 'color') fault('Oczekiwano koloru w formacie „#rrggbb”.', next || token);
        this.take();
        return { type: 'color', value: next.value.slice(1, -1).toLowerCase(), loc: token };
      }
      case 'width': return { type: 'width', value: this.parseExpression(token), loc: token };
      case 'repeat': {
        const value = this.parseExpression(token);
        const open = this.peek();
        if (!open || open.kind !== 'open') fault('Po liczbie powtórzeń oczekiwano „[”.', open || token);
        this.take();
        return { type: 'repeat', value, body: this.parseBracketBody(open), loc: token };
      }
      case 'let': {
        const name = this.peek();
        if (!name || name.kind !== 'word') fault('Oczekiwano nazwy zmiennej.', name || token);
        this.take();
        const value = this.parseExpression(token);
        return { type: 'let', name: name.value, nameLoc: name, value, loc: token };
      }
      case 'if':
      case 'ifelse': {
        const condition = this.parseCondition(token);
        const open = this.peek();
        if (!open || open.kind !== 'open') fault('Po warunku oczekiwano ciała w nawiasach „[ ]”.', open || token);
        this.take();
        const thenBody = this.parseBracketBody(open);
        let elseBody: Node[] | undefined;
        if (command === 'ifelse') {
          const second = this.peek();
          if (!second || second.kind !== 'open') fault('„jeżeli” wymaga drugiego ciała „[ ]”.', second || token);
          this.take();
          elseBody = this.parseBracketBody(second);
        }
        return { type: 'if', condition, thenBody, elseBody, loc: token };
      }
      case 'stop': return { type: 'stop', loc: token };
      case 'home': return { type: 'home', loc: token };
      case 'clear': return { type: 'clear', loc: token };
      case 'pitchUp': return { type: 'pitch', direction: 1, value: this.parseExpression(token), loc: token };
      case 'pitchDown': return { type: 'pitch', direction: -1, value: this.parseExpression(token), loc: token };
      case 'rollRight': return { type: 'roll', direction: 1, value: this.parseExpression(token), loc: token };
      case 'rollLeft': return { type: 'roll', direction: -1, value: this.parseExpression(token), loc: token };
      default: fault('Nieznane polecenie.', token);
    }
    return fault('Nieznane polecenie.', token);
  }
  private parseCondition(commandLoc: Token): Condition {
    const left = this.parseExpression(commandLoc);
    const op = this.peek();
    if (!op || op.kind !== 'compare') fault('Oczekiwano porównania (<, >, =, <=, >= lub <>).', op || commandLoc);
    this.take();
    const right = this.parseExpression(commandLoc);
    return { left, op: op.value, right, loc: commandLoc };
  }
  private parseExpression(commandLoc: Token, minPrecedence = 0): Expr {
    const first = this.peek();
    if (!first) fault('Brakuje argumentu.', commandLoc);
    let left: Expr | undefined;
    if (first.kind === 'op' && (first.value === '+' || first.value === '-')) {
      this.take();
      const value = this.parseExpression(commandLoc, 3);
      left = { kind: 'unary', op: first.value as '+' | '-', value, loc: first };
    } else if (first.kind === 'number') {
      this.take();
      left = { kind: 'number', value: Number(first.value), loc: first };
    } else if (first.kind === 'badNumber') {
      fault(`Nieprawidłowy zapis liczby „${first.value}”.`, first);
    } else if (first.kind === 'word' || first.kind === 'varref') {
      this.take();
      const name = first.value;
      if (first.kind === 'word' && repeatNames.has(name)) left = { kind: 'repcount', loc: first };
      else if (first.kind === 'word' && commandAliases[name]) fault('Brakuje argumentu przed kolejnym poleceniem.', first);
      else left = { kind: 'variable', name, loc: first };
    } else if (first.kind === 'parenOpen') {
      this.take();
      const value = this.parseExpression(commandLoc);
      const close = this.peek();
      if (!close || close.kind !== 'parenClose') fault('Brakuje nawiasu zamykającego „)”.', close || first);
      this.take();
      left = { kind: 'group', value, loc: first };
    } else if (first.kind === 'badColor') {
      fault('Kolor może wystąpić tylko po poleceniu „kolor”.', first);
    } else if (first.kind === 'close' || first.kind === 'open' || first.kind === 'parenClose' || first.kind === 'compare') {
      fault('Brakuje argumentu.', first);
    } else {
      fault('Brakuje argumentu.', first);
    }
    if (!left) return fault('Brakuje argumentu.', first || commandLoc);
    let expression: Expr = left;
    while (true) {
      const op = this.peek();
      if (!op || op.kind !== 'op') break;
      const precedence = op.value === '*' || op.value === '/' ? 2 : 1;
      if (precedence < minPrecedence) break;
      const prev = this.tokens[this.index - 1]!;
      const next = this.peek(1);
      if (!next) break;
      const leftWhitespace = prev.end < op.start;
      const rightWhitespace = op.end < next.start;
      if (leftWhitespace !== rightWhitespace) break;
      this.take();
      const right = this.parseExpression(commandLoc, precedence + 1);
      expression = { kind: 'binary', op: op.value as '+' | '-' | '*' | '/', left: expression, right, loc: expression.loc };
    }
    return expression;
  }
}

function walkNodes(nodes: Node[], visit: (node: Node) => void) {
  for (const node of nodes) {
    visit(node);
    if (node.type === 'repeat') walkNodes(node.body, visit);
    if (node.type === 'if') { walkNodes(node.thenBody, visit); if (node.elseBody) walkNodes(node.elseBody, visit); }
  }
}
function expressionsOf(node: Node): Expr[] {
  switch (node.type) {
    case 'move': case 'turn': case 'width': case 'pitch': case 'roll': return [node.value];
    case 'repeat': return [node.value];
    case 'let': return [node.value];
    case 'call': return node.args;
    case 'if': return [node.condition.left, node.condition.right];
    default: return [];
  }
}
function visitExpr(expr: Expr, visit: (node: Expr) => void) {
  visit(expr);
  if (expr.kind === 'group') visitExpr(expr.value, visit);
  if (expr.kind === 'unary') visitExpr(expr.value, visit);
  if (expr.kind === 'binary') { visitExpr(expr.left, visit); visitExpr(expr.right, visit); }
}
function validateLetNames(nodes: Node[], procedures: Map<string, Procedure>) {
  walkNodes(nodes, node => {
    if (node.type !== 'let') return;
    const name = node.name;
    if (commandWords.has(name) || reservedDefinitionWords.has(name) || repeatNames.has(name) || procedures.has(name)) {
      fault(`„${name}” jest nazwą zarezerwowaną i nie może być zmienną.`, node.nameLoc);
    }
  });
}
function literalValue(expr: Expr): number | null {
  if (expr.kind === 'group') return literalValue(expr.value);
  if (expr.kind === 'number') return expr.value;
  if (expr.kind === 'unary') {
    const value = literalValue(expr.value);
    return value === null ? null : (expr.op === '-' ? -value : value);
  }
  if (expr.kind === 'binary') {
    const left = literalValue(expr.left);
    const right = literalValue(expr.right);
    if (left === null || right === null || (expr.op === '/' && right === 0)) return null;
    const value = expr.op === '+' ? left + right : expr.op === '-' ? left - right : expr.op === '*' ? left * right : left / right;
    return Number.isFinite(value) ? value : null;
  }
  return null;
}
function validateStatic(program: Program, mode: Mode) {
  validateLetNames(program.body, program.procedures);
  for (const procedure of program.procedures.values()) validateLetNames(procedure.body, program.procedures);
  const validateScope = (nodes: Node[], allowed: Set<string>, repeatDepth: number) => {
    for (const node of nodes) {
      if ((node.type === 'pitch' || node.type === 'roll') && mode === '2d') fault('Polecenie nachylenia działa tylko w trybie 3D.', node.loc);
      if (node.type === 'width' || node.type === 'repeat') {
        const value = literalValue(node.value);
        if (value !== null) {
          const valid = node.type === 'width' ? Number.isInteger(value) && value >= 1 && value <= 12 : Number.isInteger(value) && value >= 0 && value <= 10000;
          if (!valid) fault(node.type === 'width' ? 'Grubość musi być liczbą całkowitą od 1 do 12.' : 'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.', node.value.loc);
        }
      }
      for (const expr of expressionsOf(node)) {
        visitExpr(expr, part => {
          if (part.kind === 'repcount' && repeatDepth === 0) fault('„nrpowt” jest dostępne tylko wewnątrz powtórzenia.', part.loc);
          if (part.kind === 'variable' && !allowed.has(part.name)) fault(`Zmienna „${part.name}” nie została zadeklarowana.`, part.loc);
        });
      }
      if (node.type === 'repeat') validateScope(node.body, allowed, repeatDepth + 1);
      if (node.type === 'if') { validateScope(node.thenBody, allowed, repeatDepth); if (node.elseBody) validateScope(node.elseBody, allowed, repeatDepth); }
    }
  };
  validateScope(program.body, program.globalNames, 0);
  for (const procedure of program.procedures.values()) {
    const allowed = new Set([...program.globalNames, ...procedure.localNames, ...procedure.params]);
    validateScope(procedure.body, allowed, 0);
  }
}

export function compileProgram(source: string, mode: Mode): Program {
  if (source.length > 50000) fault('Program przekracza limit 50 000 znaków.', { line: 1, column: 1, start: 0, end: 1 });
  const tokens = tokenize(source);
  if (tokens.length > 10000) fault('Program przekracza limit 10 000 tokenów.', tokens[10000]);
  const { main, rawProcedures } = splitDefinitions(tokens, source);
  const procedures = new Map<string, Procedure>();
  for (const raw of rawProcedures) {
    if (commandWords.has(raw.name) || reservedDefinitionWords.has(raw.name) || repeatNames.has(raw.name)) fault(`„${raw.name}” jest nazwą zarezerwowaną i nie może być procedurą.`, raw.loc);
    if (procedures.has(raw.name)) fault(`Procedura „${raw.name}” jest zdefiniowana więcej niż raz.`, raw.loc);
    procedures.set(raw.name, { name: raw.name, params: raw.params, body: [], loc: raw.loc, localNames: new Set() });
  }
  for (const raw of rawProcedures) {
    const procedure = procedures.get(raw.name)!;
    const parser = new Parser(raw.tokens, source, procedures);
    procedure.body = parser.parseBody(false);
  }
  const mainParser = new Parser(main, source, procedures);
  const body = mainParser.parseBody(false);
  const globalNames = new Set<string>();
  walkNodes(body, node => { if (node.type === 'let') globalNames.add(node.name); });
  for (const procedure of procedures.values()) {
    walkNodes(procedure.body, node => { if (node.type === 'let') procedure.localNames.add(node.name); });
  }
  const program: Program = { body, procedures, globalNames };
  validateStatic(program, mode);
  return program;
}

type Scope = { kind: 'global'; values: Map<string, number> } | { kind: 'procedure'; values: Map<string, number>; localNames: Set<string>; globals: Map<string, number> };
type Task =
  | { kind: 'node'; node: Node; scope: Scope; callId: number; repcounts: number[]; frameDepth: number }
  | { kind: 'repeatFinish'; body: Node[]; iteration: number; total: number; scope: Scope; callId: number; repcounts: number[]; frameDepth: number; loc: Loc }
  | { kind: 'conditionalFinish'; scope: Scope; callId: number; repcounts: number[]; frameDepth: number; loc: Loc }
  | { kind: 'callFinish'; callId: number; parentCallId: number; scope: Scope; repcounts: number[]; frameDepth: number; loc: Loc };
type Turtle = { pos: Vec3; heading: Vec3; right: Vec3; up: Vec3; penDown: boolean; color: string; width: number };
export type StepResult = { done: boolean; segments: Segment[]; error: LogoError | null; line: number | null };

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (v: Vec3, s: number): Vec3 => [v[0] * s, v[1] * s, v[2] * s];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (v: Vec3): Vec3 => { const length = Math.hypot(...v); return length ? scale(v, 1 / length) : [0, 0, 0]; };
function rotate(v: Vec3, axis: Vec3, degrees: number): Vec3 {
  const angle = degrees * Math.PI / 180;
  const unit = norm(axis);
  const quarterTurns = ((degrees % 360) + 360) % 360 / 90;
  const exact = Number.isInteger(quarterTurns);
  const c = exact ? [1, 0, -1, 0][quarterTurns] : Math.cos(angle);
  const s = exact ? [0, 1, 0, -1][quarterTurns] : Math.sin(angle);
  const result = add(add(scale(v, c), scale(cross(unit, v), s)), scale(unit, dot(unit, v) * (1 - c)));
  return norm(result);
}

export class LogoMachine {
  readonly segments: Segment[] = [];
  readonly turtle: Turtle = { pos: [0, 0, 0], heading: [0, 1, 0], right: [1, 0, 0], up: [0, 0, 1], penDown: true, color: '#16866a', width: 3 };
  readonly globals = new Map<string, number>();
  private tasks: Task[];
  private nextCallId = 1;
  private operations = 0;
  error: LogoError | null = null;
  constructor(readonly program: Program) {
    const scope: Scope = { kind: 'global', values: this.globals };
    this.tasks = program.body.slice().reverse().map(node => ({ kind: 'node', node, scope, callId: 0, repcounts: [], frameDepth: 0 }));
  }
  get done() { return this.tasks.length === 0 || this.error !== null; }
  private count(loc: Loc) {
    this.operations += 1;
    if (this.operations > 10000) fault('Przekroczono limit 10 000 wykonywanych operacji.', loc);
  }
  private value(expr: Expr, scope: Scope, repcounts: number[], argumentLoc: Loc): number {
    const evaluate = (part: Expr): number => {
      if (part.kind === 'number') return part.value;
      if (part.kind === 'group') return evaluate(part.value);
      if (part.kind === 'repcount') {
        if (!repcounts.length) fault('Brak aktywnego powtórzenia dla „nrpowt”.', argumentLoc);
        return repcounts[repcounts.length - 1];
      }
      if (part.kind === 'variable') {
        if (scope.kind === 'global') {
          const found = scope.values.get(part.name);
          if (found === undefined) return fault(`Zmienna „${part.name}” nie ma jeszcze wartości.`, argumentLoc);
          return found;
        }
        if (scope.localNames.has(part.name)) {
          const found = scope.values.get(part.name);
          if (found === undefined) return fault(`Zmienna „${part.name}” nie ma jeszcze wartości.`, argumentLoc);
          return found;
        }
        const found = scope.globals.get(part.name);
        if (found === undefined) return fault(`Zmienna „${part.name}” nie ma jeszcze wartości.`, argumentLoc);
        return found;
      }
      if (part.kind === 'unary') return part.op === '-' ? -evaluate(part.value) : evaluate(part.value);
      const left = evaluate(part.left);
      const right = evaluate(part.right);
      if (part.op === '/' && right === 0) fault('Nie można dzielić przez zero.', argumentLoc);
      const result = part.op === '+' ? left + right : part.op === '-' ? left - right : part.op === '*' ? left * right : left / right;
      if (!Number.isFinite(result)) fault('Wynik wyrażenia nie jest liczbą skończoną.', argumentLoc);
      return result;
    };
    const result = evaluate(expr);
    if (!Number.isFinite(result)) fault('Wynik wyrażenia nie jest liczbą skończoną.', argumentLoc);
    return result;
  }
  private assign(name: string, value: number, scope: Scope, loc: Loc) {
    if (!Number.isFinite(value)) fault('Wynik wyrażenia nie jest liczbą skończoną.', loc);
    if (scope.kind === 'global') scope.values.set(name, value);
    else scope.values.set(name, value);
  }
  private segment(from: Vec3, to: Vec3, loc: Loc) {
    if (this.segments.length >= 10000) fault('Przekroczono limit 10 000 odcinków.', loc);
    this.segments.push({ from: [...from] as Vec3, to: [...to] as Vec3, color: this.turtle.color, width: this.turtle.width });
  }
  private checkPosition(pos: Vec3, loc: Loc) {
    if (pos.some(value => !Number.isFinite(value) || Math.abs(value) > 100000)) fault('Współrzędne muszą mieścić się w zakresie ±100 000.', loc);
  }
  private pushBody(body: Node[], scope: Scope, callId: number, repcounts: number[], frameDepth: number) {
    for (let i = body.length - 1; i >= 0; i -= 1) this.tasks.push({ kind: 'node', node: body[i], scope, callId, repcounts, frameDepth });
  }
  step(): StepResult {
    if (this.done) return { done: true, segments: this.segments, error: this.error, line: null };
    try {
      while (this.tasks.length) {
        const task = this.tasks.pop()!;
        if (task.kind === 'repeatFinish') {
          this.count(task.loc);
          if (task.iteration < task.total) {
            const iteration = task.iteration + 1;
            this.tasks.push({ ...task, iteration, repcounts: task.repcounts });
            this.pushBody(task.body, task.scope, task.callId, [...task.repcounts, iteration], task.frameDepth);
          }
          continue;
        }
        if (task.kind === 'conditionalFinish') {
          this.count(task.loc);
          continue;
        }
        if (task.kind === 'callFinish') {
          this.count(task.loc);
          continue;
        }
        const node = task.node;
        this.count(node.loc);
        const arg = (expr: Expr) => this.value(expr, task.scope, task.repcounts, expr.loc);
        switch (node.type) {
          case 'move': {
            const distance = arg(node.value) * node.direction;
            const from = this.turtle.pos;
            const to = add(from, scale(this.turtle.heading, distance));
            this.checkPosition(to, node.loc);
            if (distance !== 0 && this.turtle.penDown) this.segment(from, to, node.loc);
            this.turtle.pos = to;
            break;
          }
          case 'turn': {
            const angle = arg(node.value) * node.direction;
            this.turtle.heading = rotate(this.turtle.heading, this.turtle.up, -angle);
            this.turtle.right = rotate(this.turtle.right, this.turtle.up, -angle);
            break;
          }
          case 'pen': this.turtle.penDown = node.down; break;
          case 'color': this.turtle.color = `#${node.value}`; break;
          case 'width': {
            const value = arg(node.value);
            if (!Number.isInteger(value) || value < 1 || value > 12) fault('Grubość musi być liczbą całkowitą od 1 do 12.', node.value.loc);
            this.turtle.width = value;
            break;
          }
          case 'repeat': {
            const count = arg(node.value);
            if (!Number.isInteger(count) || count < 0 || count > 10000) fault('Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.', node.value.loc);
            if (count > 0) {
              if (task.frameDepth + 1 > 32) fault('Przekroczono limit 32 aktywnych ramek.', node.loc);
              this.tasks.push({ kind: 'repeatFinish', body: node.body, iteration: 1, total: count, scope: task.scope, callId: task.callId, repcounts: task.repcounts, frameDepth: task.frameDepth + 1, loc: node.loc });
              this.pushBody(node.body, task.scope, task.callId, [...task.repcounts, 1], task.frameDepth + 1);
            }
            break;
          }
          case 'let': this.assign(node.name, arg(node.value), task.scope, node.value.loc); break;
          case 'if': {
            const left = arg(node.condition.left);
            const right = arg(node.condition.right);
            const holds = node.condition.op === '<' ? left < right : node.condition.op === '>' ? left > right : node.condition.op === '=' ? left === right : node.condition.op === '<=' ? left <= right : node.condition.op === '>=' ? left >= right : left !== right;
            const selected = holds ? node.thenBody : node.elseBody;
            if (selected) {
              this.tasks.push({ kind: 'conditionalFinish', scope: task.scope, callId: task.callId, repcounts: task.repcounts, frameDepth: task.frameDepth, loc: node.loc });
              this.pushBody(selected, task.scope, task.callId, task.repcounts, task.frameDepth);
            }
            break;
          }
          case 'call': {
            const procedure = this.program.procedures.get(node.name)!;
            if (task.frameDepth + 1 > 32) fault('Przekroczono limit 32 aktywnych ramek.', node.loc);
            const values = node.args.map(expr => arg(expr));
            const scope: Scope = { kind: 'procedure', values: new Map(), localNames: new Set([...procedure.localNames, ...procedure.params]), globals: this.globals };
            procedure.params.forEach((name, index) => scope.values.set(name, values[index]));
            const callId = this.nextCallId++;
            this.tasks.push({ kind: 'callFinish', callId, parentCallId: task.callId, scope: task.scope, repcounts: task.repcounts, frameDepth: task.frameDepth, loc: node.loc });
            this.pushBody(procedure.body, scope, callId, task.repcounts, task.frameDepth + 1);
            break;
          }
          case 'stop': {
            if (task.callId === 0) this.tasks = [];
            else this.tasks = this.tasks.filter(pending => pending.callId !== task.callId || pending.kind === 'callFinish');
            break;
          }
          case 'home': {
            const from = this.turtle.pos;
            const to: Vec3 = [0, 0, 0];
            if (this.turtle.penDown && from.some((value, index) => value !== to[index])) this.segment(from, to, node.loc);
            this.turtle.pos = to;
            this.turtle.heading = [0, 1, 0];
            this.turtle.right = [1, 0, 0];
            this.turtle.up = [0, 0, 1];
            break;
          }
          case 'clear': this.segments.splice(0, this.segments.length); break;
          case 'pitch': {
            const angle = arg(node.value) * node.direction;
            this.turtle.heading = rotate(this.turtle.heading, this.turtle.right, angle);
            this.turtle.up = rotate(this.turtle.up, this.turtle.right, angle);
            break;
          }
          case 'roll': {
            const angle = arg(node.value) * node.direction;
            this.turtle.up = rotate(this.turtle.up, this.turtle.heading, angle);
            this.turtle.right = rotate(this.turtle.right, this.turtle.heading, angle);
            break;
          }
        }
        while (this.tasks.length && this.tasks[this.tasks.length - 1].kind !== 'node') {
          const completion = this.tasks.pop()!;
          if (completion.kind === 'repeatFinish') {
            this.count(completion.loc);
            if (completion.iteration < completion.total) {
              const iteration = completion.iteration + 1;
              this.tasks.push({ ...completion, iteration });
              this.pushBody(completion.body, completion.scope, completion.callId, [...completion.repcounts, iteration], completion.frameDepth);
            }
          } else if (completion.kind === 'conditionalFinish' || completion.kind === 'callFinish') {
            this.count(completion.loc);
          }
        }
        return { done: this.done, segments: this.segments, error: null, line: node.loc.line };
      }
      return { done: true, segments: this.segments, error: null, line: null };
    } catch (error) {
      this.error = error instanceof LogoFault ? error.info : { message: 'Wystąpił nieoczekiwany błąd wykonania.', line: 1, column: 1 };
      return { done: true, segments: this.segments, error: this.error, line: this.error.line };
    }
  }
  runToEnd(): RunResult {
    while (!this.done) this.step();
    return { segments: this.segments, error: this.error };
  }
}

export function runLogo(source: string, mode: Mode): RunResult {
  try {
    return new LogoMachine(compileProgram(source, mode)).runToEnd();
  } catch (error) {
    const info = error instanceof LogoFault ? error.info : { message: 'Wystąpił nieoczekiwany błąd programu.', line: 1, column: 1 };
    return { segments: [], error: info };
  }
}

export function isParseError(error: LogoError | null, source: string, mode: Mode): boolean {
  if (!error) return false;
  try { compileProgram(source, mode); return false; }
  catch { return true; }
}

export function commandNames() { return commandWords; }
