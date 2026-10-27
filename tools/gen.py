import json, sys, math
sys.path.insert(0, '/work/tools')
from logo import run

C = []
def ok(name, mode, source):
    C.append({'name': name, 'mode': mode, 'source': source, 'err': None})
def err(name, mode, source, line, col=None, segs=None):
    C.append({'name': name, 'mode': mode, 'source': source, 'err': (line, col), 'segs': segs})

# ---------- lexical: tabs, newlines, comments, headers ----------
ok('tabs separate tokens like spaces', '2d', 'np\t10\tpw\t90\tnp\t5')
ok('binary operator with tabs on both sides', '2d', 'np 10\t-\t5 pw 90 np 2\t*\t3')
ok('tab-indented repeat body across lines', '2d', 'powtorz 2 [\n\tnp 10\n\tpw 90\n]')
ok('tab-indented procedure body with legacy header', '2d', 'oto k :a\n\tnp :a\n\tpw 90\njuż\nk 10 k 20')
err('operator with whitespace only on its left before a tab', '2d', 'np 10 -5\tnp 1', 1, 7)
err('operator with a tab only on its left is a stray value', '2d', 'np\t10\t-5', 1)
ok('operand continues on the next line before the operator', '2d', 'np 10\n+ 5 pw 90 np 1')
ok('call arguments split across lines', '2d', 'oto k ma: a, b\nnp a pw b\njuż\nk 10\n90\nk 5 90')
ok('ifelse bodies on separate lines', '2d', 'jeżeli 1 < 2\n[np 10]\n[np 20]\njeżeli 1 > 2\n[np 10]\n[np 20]')
ok('comment directly after a number and after a header', '2d', 'oto f ma: a ; draws a\nnp a;pw 90\npw 90\njuż\nf 10;f 20\nf 5')
ok('uppercase MA: and parameters in a header', '2d', 'OTO K MA: A, B\nNP A PW B\nJUŻ\nk 10 90 K 5 90')
ok('33 nested parentheses are not brackets', '2d', 'np (((((((((((((((((((((((((((((((((7)))))))))))))))))))))))))))))))))')
err('error column after an accented word on the same line', '2d', 'naprzód 10 ]', 1, 12)
err('missing argument reported at the command when the program ends there', '2d', 'np 1\nnaprzód', 2, 1)
err('missing call argument reported at the command when the program ends there', '2d', 'oto f ma: a\nnp a\njuż\nf 1 f', 4, 5)
err('missing argument reported at a bracket on the next line', '2d', 'powtorz 1 [np\n]', 2, 1)
err('colour literal where an expression is expected', '2d', 'np "#123456"', 1, 4)
err('number where a colour literal is expected', '2d', 'np 1 kolor 5', 1, 12)
err('command word inside an expression', '2d', 'np 10 + pw 90', 1, 9)
err('variable name in command position', '2d', 'niech x 5\nx', 2, 1)
err('procedure name used as a value', '2d', 'oto f\nnp 1\njuż\nnp f', 4, 4)
err('parse error later in the source beats an earlier run-time error', '2d', 'np 1 / 0\nfoo', 2, 1)
err('literal width in a never-called procedure is checked at parse time', '2d', 'oto f\ngrubosc 0\njuż\nnp 1', 2, 9)
err('literal repeat count in a never-called procedure is checked at parse time', '2d', 'np 1\noto f\npowtorz 10001 [np 1]\njuż', 3, 9)
err('unknown command in a never-called procedure after drawing commands', '2d', 'np 5\noto f\nnp 1\nblah 2\njuż', 4, 1)

# ---------- expressions ----------
ok('mixed multiply and divide associate to the left', '2d', 'np 8 / 4 * 2 pw 90 np 2 * 9 / 4')
ok('mixed plus and minus associate to the left', '2d', 'np 10 - 2 + 3 pw 90 np 1 + 2 - 5')
ok('unary minus on a legacy reference and on nrpowt', '2d', 'niech x 4 np -:x pw 90 powtorz 2 [np -nrpowt]')
ok('legacy reference inside arithmetic and parentheses', '2d', 'niech x 3 np (:x + 1) * :x pw 90 np :x/:x')
ok('division by a computed zero is a run-time error after drawing', '2d', 'np 1\nnp 1 / (2 - 2)')
C[-1]['err'] = (2, 4); C[-1]['segs'] = None
ok('comparisons with expressions on both sides and tight operators', '2d', 'jeśli 2 * 3 >= 7 - 1 [np 10] jeśli 2*3>7-1 [np 100] jeśli 2*3<>7-2 [pw 90 np 5]')
ok('comparison operators with whitespace on one side only', '2d', 'jeśli 1 <>2 [np 10] jeśli 2<= 2 [np 10] jeśli 2 =2 [np 10] jeśli 3> 2 [np 10] jeśli 1 <2 [np 10]')
ok('0.1 times 3 is not 0.3 but greater', '2d', 'jeśli 0.1 * 3 = 0.3 [np 100] jeśli 0.1 * 3 > 0.3 [np 1]')
ok('1 minus 0.9 is less than 0.1', '2d', 'jeśli 1 - 0.9 = 0.1 [np 100] jeśli 1 - 0.9 < 0.1 [np 1]')
ok('0.1 plus 0.7 differs from 0.8', '2d', 'jeśli 0.1 + 0.7 <> 0.8 [np 1] jeśli 0.1 + 0.7 = 0.8 [np 100]')
ok('one third times three is exactly one', '2d', 'jeśli 1 / 3 * 3 = 1 [np 1] jeśli 1 / 3 * 3 <> 1 [np 100]')
ok('integers beyond 2 to the 53 lose precision', '2d', 'jeśli 9007199254740992 + 1 = 9007199254740992 [np 1] jeśli 9007199254740992 + 2 > 9007199254740992 [pw 90 np 1]')
ok('repeat count from a float expression that is exactly integral', '2d', 'powtorz 0.5 * 6 [np 1] powtorz 7 - 1 / 2 * 2 [pw 90 np 1]')
ok('width from nrpowt across every allowed value', '2d', 'powtorz 12 [grubosc nrpowt np 1]')
err('width from nrpowt one past the maximum', '2d', 'powtorz 13 [grubosc nrpowt np 1]', 1, 21)
err('repeat count from a global that is not an integer', '2d', 'niech n 1 np 1 powtorz 2 [niech n n + 0.5 powtorz n [np 1]]', 1, 51)
err('niech reading its own variable before assignment', '2d', 'np 1\nniech x x + 1', 2, 9)
err('unassigned global in a call argument inside a repeat', '2d', 'oto f ma: a\nnp a\njuż\npowtorz 2 [f nrpowt jeśli nrpowt = 2 [f g * 2]]\nniech g 1', 4, 41)
err('non-finite result from a parameter inside a procedure', '2d', 'oto f ma: a\nnp 1\nnp a * a\njuż\nf 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 3, 4)

# ---------- variables and scope ----------
ok('global is read inside a procedure until the local niech shadows it', '2d', 'niech x 1\noto f\nnp x niech x 5 np x\njuż\nf pw 90 np x')
ok('callee local does not change the caller local of the same name', '2d', 'oto g\nniech x 100 np x\njuż\noto f\nniech x 2 g np x\njuż\nf')
ok('global declared inside a top-level repeat body is visible in a procedure', '2d', 'powtorz 1 [niech g 4]\noto f\nnp g\njuż\nf')
ok('local declared inside a nested body of the procedure', '2d', 'oto f ma: n\npowtorz n [jeśli nrpowt = 2 [niech k nrpowt * 10]]\nnp k\njuż\nf 3')
err('local declared in a nested body but unassigned on this call', '2d', 'oto f ma: n\npowtorz n [jeśli nrpowt = 2 [niech k nrpowt * 10]]\nnp k\njuż\nf 3 f 1', 3, 4)
ok('parameter reassigned inside a repeat accumulates', '2d', 'oto f ma: d\npowtorz 3 [np d niech d d * 2]\nnp d\njuż\nf 1')
ok('global updated inside a repeat body drives a spiral', '2d', 'niech d 2 powtorz 20 [np d pw 90 niech d d + 2]')
ok('recursion keeps a separate local per call across returns', '2d', 'oto f ma: n\nniech k n * 10\njeśli n > 0 [f n - 1]\nnp k pw 90\njuż\nf 3')
ok('global niech inside a procedure call does not exist so top level keeps its own', '2d', 'niech x 1\noto f ma: x\nniech x x + 1 np x\njuż\nf 10 f x pw 90 np x')

# ---------- repeat and nrpowt ----------
ok('nrpowt restored after a recursive call inside a conditional', '2d', 'oto f ma: n\npowtorz 4 [jeśli nrpowt = n [np nrpowt pw 90 f n - 1]]\njuż\nf 4')
ok('nrpowt inside a repeat inside a conditional inside a repeat', '2d', 'powtorz 3 [jeśli nrpowt = 2 [powtorz 3 [np nrpowt]] pw 90 np nrpowt]')
ok('three nested repeats with nrpowt at each level', '2d', 'powtorz 3 [powtorz 2 [powtorz 2 [np nrpowt] pw 90 np nrpowt] pw 90 np nrpowt]')
ok('stop inside a procedure called from a repeat leaves the outer repeat running', '2d', 'oto f\npowtorz 3 [np nrpowt jeśli nrpowt = 2 [stop]]\nnp 100\njuż\npowtorz 3 [f pw 90]')
ok('czyść inside a repeat whose count is an expression of a global', '2d', 'niech n 2 powtorz n * 2 - 1 [np 10 pw 90 jeśli nrpowt = 2 [czyść]] np 5')
ok('czyść inside a procedure called from a conditional then a run-time error keeps later segments', '2d', 'niech z 0\noto wyczysc\nnp 1 czyść np 2\njuż\nnp 10\njeśli 1 < 2 [wyczysc]\nnp 3\nnp 1 / z')
C[-1]['err'] = (8, 4)
ok('dom inside a repeat with the pen toggled', '2d', 'powtorz 3 [np 10 pw 90 jeśli nrpowt = 2 [pod] dom opu]')
ok('repeat count of zero inside a procedure skips a bad name-dependent width', '2d', 'oto f ma: n\npowtorz n [grubosc 99 - 99 + n]\nnp 1\njuż\nf 0')
err('bad name-dependent width inside a procedure reported inside the body', '2d', 'oto f ma: n\npowtorz n [grubosc 99 - 99 + n]\nnp 1\njuż\nf 0 f 13', 2, 20)

# ---------- procedures ----------
ok('koch curve by recursion with ifelse and expression arguments', '2d', 'oto koch ma: d, n\njeżeli n = 0 [np d] [koch d / 3 n - 1 lw 60 koch d / 3 n - 1 pw 120 koch d / 3 n - 1 lw 60 koch d / 3 n - 1]\njuż\nkoch 81 2')
ok('binary tree by recursion with back moves', '2d', 'oto drzewo ma: d\njeśli d < 5 [stop]\nnp d\nlw 30 drzewo d / 2\npw 60 drzewo d / 2\nlw 30\nws d\njuż\ndrzewo 40')
ok('parameters passed down three levels with arithmetic', '2d', 'oto c ma: x\nnp x pw 90\njuż\noto b ma: x, y\nc x + y c x - y\njuż\noto a ma: x\nb x * 2 x / 2\njuż\na 10 a -4')
ok('procedure called from a conditional inside a repeat inside a procedure', '2d', 'oto krok ma: d\nnp d pw 90\njuż\noto f ma: n\npowtorz n [jeżeli nrpowt > 2 [krok nrpowt * 10] [krok nrpowt]]\njuż\nf 4')
ok('polygon procedure using parameter as repeat count and in the angle', '2d', 'oto wielokat ma: n, bok\npowtorz n [np bok pw 360 / n]\njuż\nwielokat 5 20 wielokat 3 10')
ok('mutual recursion through a repeat body', '2d', 'oto a ma: n\njeśli n = 0 [stop]\npowtorz 2 [np n b n - 1]\njuż\noto b ma: n\njeśli n = 0 [stop]\npw 90 a n - 1\njuż\na 2')
err('call with too few arguments inside a repeat body before the bracket', '2d', 'oto f ma: a, b\nnp a\njuż\npowtorz 1 [f 1]', 4, 15)
err('repeat at the deepest call is the 33rd frame reported at the repeat', '2d', 'oto f ma: n\nnp 1 jeśli n > 1 [f n - 1] powtorz 1 [np 1]\njuż\nf 32', 2, 28)
ok('repeat at the deepest call is the 32nd frame and unwinding draws again', '2d', 'oto f ma: n\nnp 1 jeśli n > 1 [f n - 1] powtorz 1 [np 1]\njuż\nf 31')

# ---------- limits ----------
ok('exactly ten thousand operations without a body', '2d', 'pod ' * 9999 + 'pod')
err('ten thousand and one operations inside a repeat', '2d', 'powtorz 2 [' + 'pod ' * 4999 + 'pod]', 1)
err('repeat of ten thousand single commands exceeds the operation limit', '2d', 'powtorz 10000 [pod]', 1)
err('coordinate limit exceeded on the z axis', '3d', 'dol 90 np 100000 np 1', 1)
err('coordinate limit exceeded by a diagonal move', '2d', 'pw 45 np 141422', 1)
ok('coordinate just inside the limit by a diagonal move', '2d', 'pw 45 np 141421')

# ---------- 3D ----------
ok('pitch yaw inverse pitch inverse roll compose to the identity', '3d', 'gora 90 pw 90 dol 90 pl 90 np 10 pw 90 np 10 gora 90 np 10')
ok('full turns of roll pitch and yaw in 36 steps compose to the identity', '3d', 'powtorz 36 [pp 10] powtorz 36 [gora 10] powtorz 36 [lw 10] np 10 pw 90 np 10 gora 90 np 10')
ok('roll of 180 flips yaw direction', '3d', 'pp 180 pw 90 np 10 pl 180 pw 90 np 10')
ok('back move after a pitch', '3d', 'gora 60 ws 10 pw 180 ws 10')
ok('helix with pitch and yaw in a repeat', '3d', 'gora 30 powtorz 12 [np 5 pl 30 pw 30 pp 30]')
ok('roll then pitch then square draws a tilted square', '3d', 'pp 90 gora 90 powtorz 4 [np 10 pw 90]')
ok('non-commuting pitch and yaw', '3d', 'gora 30 pw 60 np 10 dom pw 60 gora 30 np 10')
ok('dom draws a segment from a point above the plane and resets the up vector', '3d', 'gora 90 np 10 pw 90 dom pp 90 pw 90 np 10')
ok('3D commands with expression arguments from parameters', '3d', 'oto f ma: a, b\ngora a pp b pw a + b np 10\njuż\nf 30 60')
ok('rolled polygon returns to the origin', '3d', 'pp 60 gora 30 powtorz 8 [np 10 pw 45]')
ok('2D sequence of 36 turns closes a circle in 3D mode', '3d', 'powtorz 36 [np 10 pw 10]')
err('pitch in 2D mode inside a procedure called from a repeat', '2d', 'oto f\nnp 1 gora 10\njuż\npowtorz 2 [f]', 2, 6)
err('roll in 2D mode in an ifelse second body', '2d', 'np 1 jeżeli 1 < 2 [np 1] [pl 90]', 1, 27)

# ---------- long 2D state programs ----------
ok('nested repeats drawing four squares with nrpowt widths', '2d', 'powtorz 4 [grubosc nrpowt * 3 powtorz 4 [np 10 pw 90] pw 90]')
ok('colour and width changes interleaved with repeats and procedures', '2d', 'oto k ma: d\nkolor "#FF0000" np d kolor "#00FF00" pw 90\njuż\ngrubosc 2 powtorz 2 [k 10 grubosc nrpowt + 4 np 5]\nnp 1')
ok('pen state toggled inside a procedure across repeat iterations', '2d', 'oto t\njeżeli 1 < 2 [pod] [opu]\njuż\npowtorz 4 [opu np 5 jeśli nrpowt = 2 [t] np 5 pw 90]')

# ---------- extra ----------
err('33 nested brackets inside a procedure body', '2d', 'oto f\n' + 'jeśli 1 = 1 [' * 33 + 'np 1' + ']' * 33 + '\njuż\nf', 2, 13 * 33)
ok('32 nested brackets inside a procedure body called twice', '2d', 'oto f\n' + 'jeśli 1 = 1 [' * 32 + 'np 1' + ']' * 32 + '\njuż\nf f')
ok('tight operators around parentheses', '2d', 'np (1+2)*(3+4) pw 90 np 2*(3+4)-(1+1)/2')
ok('legacy references and unary plus in a condition', '2d', 'niech x 2 niech y 3 jeśli :x < :y [np +x] jeśli -:x > -:y [pw 90 np +:y]')
ok('24 steps of yaw and pitch in 3D', '3d', 'powtorz 24 [np 5 pw 15 gora 15] dom')
ok('stop in the else branch of a recursive procedure', '2d', 'oto f ma: n\njeżeli n > 0 [np n f n - 1] [pw 90 stop]\nnp 100\njuż\nf 3 np 1')
err('repeat count from a parameter above the maximum on a later call', '2d', 'oto f ma: n\npowtorz n * 1000 [np 1 stop]\njuż\nf 10 f 11', 2, 9)

out = []
seen = set()
for f in ('/work/round1/own.json','/work/round1/other.json'):
    for c in json.load(open(f))['cases']: seen.add(c['source'])
for c in C:
    res = run(c['source'], c['mode'])
    if c['err'] is None:
        assert res['error'] is None, (c['name'], res['error'])
    else:
        line, col = c['err']
        assert res['error'] is not None, (c['name'], 'no error')
        assert res['error']['line'] == line, (c['name'], res['error'])
        assert col is None or res['error']['column'] == col, (c['name'], res['error'])
    assert c['source'] not in seen; seen.add(c['source'])
    out.append((c, res))
json.dump([(c, r) for c, r in out], open('/tmp/gen_out.json', 'w'), ensure_ascii=False)
print(len(out), 'cases ok')
