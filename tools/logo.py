"""Reference interpreter for the Logomocja dialect, written from the specification."""
import math, re, sys, json

class LogoError(Exception):
    def __init__(self, msg, line, col):
        super().__init__(msg); self.msg = msg; self.line = line; self.col = col

CMD_ALIASES = {
    'fd': ['np','naprzod','naprzód','fd','forward'],
    'bk': ['ws','wstecz','bk','back'],
    'rt': ['pw','prawo','rt','right'],
    'lt': ['lw','lewo','lt','left'],
    'pu': ['pod','podnies','podnieś','pu','penup'],
    'pd': ['opu','opusc','opuść','pd','pendown'],
    'color': ['kolor','color'],
    'width': ['grubosc','grubość','width'],
    'repeat': ['powtorz','powtórz','repeat'],
    'let': ['niech','let'],
    'if': ['jeśli','jesli','if'],
    'ifelse': ['jeżeli','jezeli','ifelse'],
    'stop': ['stop'],
    'home': ['dom','home'],
    'cs': ['czyść','czysc','cs','clearscreen'],
    'pitchup': ['gora','góra','pitchup'],
    'pitchdown': ['dol','dół','pitchdown'],
    'rr': ['pp','przechylprawo','rr','rollright'],
    'rl': ['pl','przechyllewo','rl','rollleft'],
}
WORD2CMD = {}
for k, vs in CMD_ALIASES.items():
    for v in vs: WORD2CMD[v] = k
DEF_WORDS = {'oto','to'}
END_WORDS = {'już','juz','end'}
REPCOUNT = {'nrpowt','repcount'}
RESERVED = set(WORD2CMD) | DEF_WORDS | END_WORDS | REPCOUNT | {'ma:'}
THREE_D = {'pitchup','pitchdown','rr','rl'}

class Tok:
    __slots__ = ('kind','val','line','col','wsb','wsa','raw')
    def __init__(self, kind, val, line, col, wsb=False, wsa=False, raw=''):
        self.kind=kind; self.val=val; self.line=line; self.col=col; self.wsb=wsb; self.wsa=wsa; self.raw=raw
    def __repr__(self): return f'{self.kind}:{self.val}@{self.line}:{self.col}'

def tokenize(src):
    toks = []
    lines = src.split('\n')
    for li, line in enumerate(lines, 1):
        i = 0; n = len(line)
        while i < n:
            c = line[i]
            if c == ';': break
            if c.isspace(): i += 1; continue
            start = i
            wsb = (i == 0) or line[i-1].isspace()
            if c.isdigit() or (c == '.' and i+1 < n and line[i+1].isdigit()):
                j = i
                while j < n and line[j].isdigit(): j += 1
                if j < n and line[j] == '.':
                    j += 1
                    while j < n and line[j].isdigit(): j += 1
                # a number immediately followed by a letter/./_ is malformed
                if j < n and (line[j].isalnum() or line[j] in '._'):
                    raise LogoError('bad number', li, start+1)
                toks.append(Tok('num', float(line[i:j]), li, start+1, raw=line[i:j]))
                i = j; continue
            if c.isalpha() or c == '_':
                j = i
                while j < n and (line[j].isalnum() or line[j] == '_'): j += 1
                word = line[i:j].lower()
                if j < n and line[j] == ':' and word == 'ma':
                    toks.append(Tok('ma:', 'ma:', li, start+1)); i = j+1; continue
                if j < n and (line[j] == ':' or line[j] == '"' or line[j] == '#'):
                    raise LogoError('bad token', li, start+1)
                toks.append(Tok('name', word, li, start+1, raw=line[i:j]))
                i = j; continue
            if c == ':':
                j = i+1
                while j < n and (line[j].isalnum() or line[j] == '_'): j += 1
                if j == i+1: raise LogoError('bad token', li, start+1)
                toks.append(Tok('legacy', line[i+1:j].lower(), li, start+1, raw=line[i:j]))
                i = j; continue
            if c == '"':
                j = line.find('"', i+1)
                if j < 0: raise LogoError('bad colour', li, start+1)
                s = line[i+1:j]
                if not re.fullmatch(r'#[0-9a-fA-F]{6}', s):
                    raise LogoError('bad colour', li, start+1)
                toks.append(Tok('color', s.lower(), li, start+1)); i = j+1; continue
            if c in '+-*/':
                wsa = (i+1 >= n) or line[i+1].isspace() or line[i+1] == ';'
                toks.append(Tok('op', c, li, start+1, wsb, wsa)); i += 1; continue
            if c in '<>=':
                two = line[i:i+2]
                if two in ('<=','>=','<>'):
                    toks.append(Tok('cmp', two, li, start+1)); i += 2; continue
                toks.append(Tok('cmp', c, li, start+1)); i += 1; continue
            if c in '[](),':
                toks.append(Tok(c, c, li, start+1)); i += 1; continue
            raise LogoError('bad character', li, start+1)
        toks.append(Tok('nl', None, li, len(line)+1))
    toks.append(Tok('eof', None, len(lines), len(lines[-1])+1))
    return toks

# ---------------- AST ----------------
class Node:
    def __init__(self, kind, tok, **kw):
        self.kind = kind; self.tok = tok; self.__dict__.update(kw)

class Parser:
    def __init__(self, src, mode):
        self.mode = mode
        if len(src) > 50000:
            raise LogoError('source too long', 1, 1)
        self.toks = tokenize(src)
        real = [t for t in self.toks if t.kind not in ('nl','eof')]
        if len(real) > 10000:
            raise LogoError('too many tokens', 1, 1)
        self.pos = 0
        self.procs = {}   # name -> Node
        self.proc_order = []
        self.prescan()
        self.depth = 0
        self.ctx = None   # current procedure name or None
        self.in_repeat = 0
        self.global_lets = set()
        self.proc_lets = {}
        self.prescan_lets()

    def prescan(self):
        # find definition headers: 'oto' first token of a line
        toks = self.toks
        i = 0; at_line_start = True; cur = None
        for i, t in enumerate(toks):
            if t.kind == 'nl': at_line_start = True; continue
            if t.kind == 'eof': break
            if at_line_start and t.kind == 'name' and t.val in DEF_WORDS and cur is not None:
                raise LogoError('definition inside body', t.line, t.col)
            if at_line_start and t.kind == 'name' and t.val in DEF_WORDS and cur is None:
                # header
                j = i+1
                if j >= len(toks) or toks[j].kind != 'name' or toks[j].val in RESERVED:
                    raise LogoError('bad procedure name', toks[j].line, toks[j].col)
                name = toks[j].val
                params = []
                j += 1
                if toks[j].kind == 'ma:':
                    j += 1
                    while True:
                        if toks[j].kind != 'name' or toks[j].val in RESERVED:
                            raise LogoError('bad parameter', toks[j].line, toks[j].col)
                        params.append(toks[j].val); j += 1
                        if toks[j].kind == ',': j += 1; continue
                        break
                else:
                    while toks[j].kind == 'legacy':
                        params.append(toks[j].val); j += 1
                if toks[j].kind != 'nl':
                    raise LogoError('bad header', toks[j].line, toks[j].col)
                if name in self.procs:
                    raise LogoError('duplicate procedure', t.line, t.col)
                self.procs[name] = Node('proc', t, name=name, params=params, body=None, start=i, header_end=j)
                self.proc_order.append(name)
                cur = name
                at_line_start = False
                continue
            if at_line_start and t.kind == 'name' and t.val in END_WORDS and toks[i+1].kind == 'nl':
                if cur is None:
                    raise LogoError('stray end', t.line, t.col)
                self.procs[cur].end = i
                cur = None
                at_line_start = False
                continue
            at_line_start = False
        if cur is not None:
            p = self.procs[cur]
            raise LogoError('missing end', p.tok.line, p.tok.col)

    def prescan_lets(self):
        toks = self.toks
        for name, p in self.procs.items():
            self.proc_lets[name] = set()
        for i, t in enumerate(toks):
            if t.kind == 'name' and t.val in ('niech','let') and toks[i+1].kind == 'name':
                nm = toks[i+1].val
                owner = None
                for name, p in self.procs.items():
                    if p.start < i < p.end: owner = name
                if owner is None: self.global_lets.add(nm)
                else: self.proc_lets[owner].add(nm)

    # token helpers
    def peek(self, k=0):
        # skip newlines
        j = self.pos
        while True:
            t = self.toks[j]
            if t.kind == 'nl': j += 1; continue
            if k == 0: return t
            k -= 1; j += 1
    def next(self):
        while self.toks[self.pos].kind == 'nl': self.pos += 1
        t = self.toks[self.pos]; self.pos += 1; return t

    def parse_program(self):
        stmts = []
        while True:
            t = self.peek()
            if t.kind == 'eof': break
            if t.kind == 'name' and t.val in DEF_WORDS:
                # must be at a line start (prescan recorded it if so)
                p = next((p for p in self.procs.values() if self.toks[p.start] is t), None)
                if p is None:
                    raise LogoError('definition not at line start', t.line, t.col)
                self.parse_proc(p)
                continue
            stmts.append(self.parse_stmt())
        return stmts

    def parse_proc(self, p):
        self.pos = p.header_end
        self.ctx = p.name
        self.in_repeat = 0
        body = []
        while True:
            t = self.peek()
            if self.toks[self.pos if self.toks[self.pos].kind != 'nl' else self.pos] is None: pass
            # find the end token
            if t is self.toks[p.end]:
                self.next(); break
            if t.kind == 'eof':
                raise LogoError('missing end', p.tok.line, p.tok.col)
            body.append(self.parse_stmt())
        p.body = body
        self.ctx = None

    def expect(self, kind, what):
        t = self.next()
        if t.kind != kind:
            raise LogoError(f'expected {what}', t.line, t.col)
        return t

    def parse_body(self):
        # expects '['
        t = self.next()
        if t.kind != '[':
            raise LogoError('expected [', t.line, t.col)
        self.depth += 1
        if self.depth > 32:
            raise LogoError('nesting too deep', t.line, t.col)
        stmts = []
        while True:
            u = self.peek()
            if u.kind == ']':
                self.next(); break
            if u.kind == 'eof':
                raise LogoError('missing ]', t.line, t.col)
            stmts.append(self.parse_stmt())
        self.depth -= 1
        return stmts

    def parse_stmt(self):
        t = self.next()
        if t.kind == 'name':
            w = t.val
            if w in DEF_WORDS:
                raise LogoError('definition inside body', t.line, t.col)
            if w in END_WORDS:
                raise LogoError('stray end', t.line, t.col)
            if w in REPCOUNT:
                raise LogoError('stray value', t.line, t.col)
            if w in WORD2CMD:
                c = WORD2CMD[w]
                if c in THREE_D and self.mode == '2d':
                    raise LogoError('3d command in 2d', t.line, t.col)
                if c in ('fd','bk','rt','lt','pitchup','pitchdown','rr','rl'):
                    e = self.parse_arg(t)
                    return Node(c, t, expr=e)
                if c in ('pu','pd','stop','home','cs'):
                    return Node(c, t)
                if c == 'color':
                    u = self.next()
                    if u.kind != 'color':
                        raise LogoError('expected colour', u.line, u.col)
                    return Node(c, t, color=u.val)
                if c == 'width':
                    e = self.parse_arg(t)
                    if is_literal(e):
                        v = eval_literal(e)
                        if v is None or v != math.floor(v) or not (1 <= v <= 12):
                            raise LogoError('bad width', e.tok.line, e.tok.col)
                    return Node(c, t, expr=e)
                if c == 'repeat':
                    e = self.parse_arg(t)
                    if is_literal(e):
                        v = eval_literal(e)
                        if v is None or v != math.floor(v) or not (0 <= v <= 10000):
                            raise LogoError('bad repeat count', e.tok.line, e.tok.col)
                    self.in_repeat += 1
                    body = self.parse_body()
                    self.in_repeat -= 1
                    return Node(c, t, expr=e, body=body)
                if c == 'let':
                    u = self.next()
                    if u.kind != 'name' or u.val in RESERVED or u.val in self.procs:
                        raise LogoError('bad variable name', u.line, u.col)
                    e = self.parse_arg(t)
                    return Node(c, t, name=u.val, expr=e)
                if c == 'if':
                    cond = self.parse_cond(t)
                    body = self.parse_body()
                    return Node(c, t, cond=cond, body=body)
                if c == 'ifelse':
                    cond = self.parse_cond(t)
                    body = self.parse_body()
                    body2 = self.parse_body()
                    return Node(c, t, cond=cond, body=body, body2=body2)
                raise AssertionError(c)
            if w in self.procs:
                p = self.procs[w]
                args = [self.parse_arg(t) for _ in p.params]
                return Node('call', t, name=w, args=args)
            raise LogoError('unknown command', t.line, t.col)
        raise LogoError('stray token', t.line, t.col)

    def parse_arg(self, cmdtok):
        t = self.peek()
        if t.kind in (']', ')', ',', 'cmp', '[', 'color') or (t.kind == 'op' and t.val in '*/'):
            raise LogoError('missing argument', t.line, t.col)
        if t.kind == 'eof':
            raise LogoError('missing argument', cmdtok.line, cmdtok.col)
        if t.kind == 'name' and (t.val in WORD2CMD or t.val in DEF_WORDS or t.val in END_WORDS):
            raise LogoError('missing argument', t.line, t.col)
        return self.parse_expr()

    def parse_cond(self, cmdtok):
        left = self.parse_arg(cmdtok)
        t = self.next()
        if t.kind != 'cmp':
            raise LogoError('expected comparison', t.line, t.col)
        right = self.parse_arg(cmdtok)
        return Node('cond', left.tok, op=t.val, left=left, right=right, optok=t)

    def parse_expr(self):
        left = self.parse_term()
        while True:
            t = self.peek()
            if t.kind == 'op' and t.val in '+-' and t.wsb == t.wsa:
                self.next()
                right = self.parse_term()
                left = Node('bin', left.tok, op=t.val, left=left, right=right)
            else:
                return left

    def parse_term(self):
        left = self.parse_unary()
        while True:
            t = self.peek()
            if t.kind == 'op' and t.val in '*/' and t.wsb == t.wsa:
                self.next()
                right = self.parse_unary()
                left = Node('bin', left.tok, op=t.val, left=left, right=right)
            else:
                return left

    def parse_unary(self):
        t = self.peek()
        if t.kind == 'op' and t.val in '+-':
            self.next()
            operand = self.parse_unary()
            return Node('un', t, op=t.val, operand=operand)
        return self.parse_primary()

    def parse_primary(self):
        t = self.next()
        if t.kind == 'num':
            return Node('num', t, value=t.val)
        if t.kind == '(':
            e = self.parse_expr()
            u = self.next()
            if u.kind != ')':
                if u.kind == 'eof':
                    raise LogoError('missing )', t.line, t.col)
                raise LogoError('expected )', u.line, u.col)
            return Node('paren', t, inner=e)
        if t.kind == 'legacy' or t.kind == 'name':
            w = t.val
            if w in REPCOUNT and t.kind == 'name':
                if self.in_repeat == 0:
                    raise LogoError('nrpowt outside repeat', t.line, t.col)
                return Node('repcount', t)
            if t.kind == 'name' and (w in WORD2CMD or w in DEF_WORDS or w in END_WORDS):
                raise LogoError('missing operand', t.line, t.col)
            # declared?
            ok = False
            if self.ctx is not None:
                p = self.procs[self.ctx]
                if w in p.params or w in self.proc_lets[self.ctx]: ok = True
            if w in self.global_lets: ok = True
            if not ok:
                raise LogoError('undeclared name', t.line, t.col)
            return Node('var', t, name=w)
        raise LogoError('bad operand', t.line, t.col)

def is_literal(e):
    k = e.kind
    if k == 'num': return True
    if k == 'un': return is_literal(e.operand)
    if k == 'paren': return is_literal(e.inner)
    if k == 'bin': return is_literal(e.left) and is_literal(e.right)
    return False

def eval_literal(e):
    k = e.kind
    if k == 'num': return e.value
    if k == 'un':
        v = eval_literal(e.operand)
        return None if v is None else (-v if e.op == '-' else v)
    if k == 'paren': return eval_literal(e.inner)
    if k == 'bin':
        a = eval_literal(e.left); b = eval_literal(e.right)
        if a is None or b is None: return None
        if e.op == '+': r = a + b
        elif e.op == '-': r = a - b
        elif e.op == '*': r = a * b
        else:
            if b == 0: return None
            r = a / b
        if not math.isfinite(r): return None
        return r

# ---------------- Runtime ----------------
class Stop(Exception): pass
class Return(Exception): pass

OP_LIMIT = 10000
FRAME_LIMIT = 32
SEG_LIMIT = 10000
COORD_LIMIT = 100000

def rot(a, b, deg):
    r = math.radians(deg); c = math.cos(r); s = math.sin(r)
    na = [a[i]*c + b[i]*s for i in range(3)]
    nb = [b[i]*c - a[i]*s for i in range(3)]
    return na, nb

class Runtime:
    def __init__(self, procs, mode):
        self.procs = procs; self.mode = mode
        self.pos = [0.0,0.0,0.0]; self.H=[0.0,1.0,0.0]; self.R=[1.0,0.0,0.0]; self.U=[0.0,0.0,1.0]
        self.pen = True; self.color = '#16866a'; self.width = 3
        self.segments = []
        self.ops = 0; self.frames = 0
        self.globals = {}
        self.locals = None  # dict or None at top level
        self.repstack = []

    def op(self, tok):
        self.ops += 1
        if self.ops > OP_LIMIT:
            raise LogoError('operation limit', tok.line, tok.col)

    def lookup(self, e):
        name = e.name
        if self.locals is not None and name in self.locals: return self.locals[name]
        if name in self.globals: return self.globals[name]
        raise KeyError(name)

    def eval(self, e, argtok):
        try:
            v = self._eval(e)
        except KeyError:
            raise LogoError('unassigned variable', argtok.line, argtok.col)
        except ZeroDivisionError:
            raise LogoError('division by zero', argtok.line, argtok.col)
        except OverflowError:
            raise LogoError('non-finite', argtok.line, argtok.col)
        if not math.isfinite(v):
            raise LogoError('non-finite', argtok.line, argtok.col)
        return v

    def _eval(self, e):
        k = e.kind
        if k == 'num': return e.value
        if k == 'var': return self.lookup(e)
        if k == 'repcount': return float(self.repstack[-1])
        if k == 'paren': return self._eval(e.inner)
        if k == 'un':
            v = self._eval(e.operand); return -v if e.op == '-' else v
        if k == 'bin':
            a = self._eval(e.left); b = self._eval(e.right)
            if e.op == '+': r = a + b
            elif e.op == '-': r = a - b
            elif e.op == '*': r = a * b
            else:
                if b == 0: raise ZeroDivisionError
                r = a / b
            if not math.isfinite(r): raise OverflowError
            return r
        raise AssertionError(k)

    def move(self, d, tok):
        new = [self.pos[i] + self.H[i]*d for i in range(3)]
        for c in new:
            if abs(c) > COORD_LIMIT:
                raise LogoError('coordinate limit', tok.line, tok.col)
        if self.pen and new != self.pos:
            self.add_seg(self.pos, new, tok)
        self.pos = new

    def add_seg(self, a, b, tok):
        if len(self.segments) + 1 > SEG_LIMIT:
            raise LogoError('segment limit', tok.line, tok.col)
        self.segments.append({'from': list(a), 'to': list(b), 'color': self.color, 'width': self.width})

    def run_body(self, stmts):
        for s in stmts: self.exec(s)
        self.ops += 1  # bookkeeping of finishing a body
        if self.ops > OP_LIMIT:
            raise LogoError('operation limit', stmts[-1].tok.line if stmts else 0, stmts[-1].tok.col if stmts else 0)

    def exec(self, s):
        k = s.kind; t = s.tok
        self.op(t)
        if k == 'fd': self.move(self.eval(s.expr, s.expr.tok), t)
        elif k == 'bk': self.move(-self.eval(s.expr, s.expr.tok), t)
        elif k == 'rt':
            a = self.eval(s.expr, s.expr.tok); self.H, self.R = rot(self.H, self.R, a)
        elif k == 'lt':
            a = self.eval(s.expr, s.expr.tok); self.H, self.R = rot(self.H, self.R, -a)
        elif k == 'pitchup':
            a = self.eval(s.expr, s.expr.tok); self.H, self.U = rot(self.H, self.U, a)
        elif k == 'pitchdown':
            a = self.eval(s.expr, s.expr.tok); self.H, self.U = rot(self.H, self.U, -a)
        elif k == 'rr':
            a = self.eval(s.expr, s.expr.tok); self.U, self.R = rot(self.U, self.R, a)
        elif k == 'rl':
            a = self.eval(s.expr, s.expr.tok); self.U, self.R = rot(self.U, self.R, -a)
        elif k == 'pu': self.pen = False
        elif k == 'pd': self.pen = True
        elif k == 'color': self.color = s.color
        elif k == 'width':
            v = self.eval(s.expr, s.expr.tok)
            if v != math.floor(v) or not (1 <= v <= 12):
                raise LogoError('bad width', s.expr.tok.line, s.expr.tok.col)
            self.width = int(v)
        elif k == 'home':
            if self.pos != [0.0,0.0,0.0]:
                if self.pen: self.add_seg(self.pos, [0.0,0.0,0.0], t)
                self.pos = [0.0,0.0,0.0]
            self.H=[0.0,1.0,0.0]; self.R=[1.0,0.0,0.0]; self.U=[0.0,0.0,1.0]
        elif k == 'cs': self.segments = []
        elif k == 'stop':
            if self.locals is None: raise Stop()
            raise Return()
        elif k == 'let':
            v = self.eval(s.expr, s.expr.tok)
            if self.locals is None: self.globals[s.name] = v
            else: self.locals[s.name] = v
        elif k == 'if':
            if self.cond(s.cond): self.run_body(s.body)
        elif k == 'ifelse':
            if self.cond(s.cond): self.run_body(s.body)
            else: self.run_body(s.body2)
        elif k == 'repeat':
            n = self.eval(s.expr, s.expr.tok)
            if n != math.floor(n) or not (0 <= n <= 10000):
                raise LogoError('bad repeat count', s.expr.tok.line, s.expr.tok.col)
            n = int(n)
            self.frames += 1
            if self.frames > FRAME_LIMIT:
                raise LogoError('frame limit', t.line, t.col)
            self.repstack.append(0)
            for i in range(1, n+1):
                self.repstack[-1] = i
                self.run_body(s.body)
            self.repstack.pop()
            self.frames -= 1
        elif k == 'call':
            p = self.procs[s.name]
            args = [self.eval(a, a.tok) for a in s.args]
            self.frames += 1
            if self.frames > FRAME_LIMIT:
                raise LogoError('frame limit', t.line, t.col)
            saved = self.locals; savedrep = self.repstack
            self.locals = dict(zip(p.params, args)); self.repstack = []
            try:
                self.run_body(p.body)
            except Return:
                pass
            self.locals = saved; self.repstack = savedrep
            self.frames -= 1
        else:
            raise AssertionError(k)

    def cond(self, c):
        a = self.eval(c.left, c.left.tok)
        b = self.eval(c.right, c.right.tok)
        op = c.op
        if op == '<': return a < b
        if op == '>': return a > b
        if op == '=': return a == b
        if op == '<=': return a <= b
        if op == '>=': return a >= b
        if op == '<>': return a != b

def run(src, mode):
    try:
        p = Parser(src, mode)
        stmts = p.parse_program()
    except LogoError as e:
        return {'segments': [], 'error': {'message': e.msg, 'line': e.line, 'column': e.col}}
    rt = Runtime(p.procs, mode)
    try:
        for s in stmts: rt.exec(s)
    except Stop:
        pass
    except LogoError as e:
        return {'segments': rt.segments, 'error': {'message': e.msg, 'line': e.line, 'column': e.col}}
    return {'segments': rt.segments, 'error': None}

if __name__ == '__main__':
    src = open(sys.argv[1]).read()
    print(json.dumps(run(src, sys.argv[2] if len(sys.argv) > 2 else '2d'), ensure_ascii=False))
