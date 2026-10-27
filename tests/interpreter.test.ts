import { describe, expect, test } from 'bun:test';
import { run } from '../src/logo';
import { close, err, ok } from './helpers';

describe('basic movement', () => {
  test('starts at origin heading +Y, pen down, default colour and width', () => {
    const r = ok('np 80');
    expect(r.segments).toEqual([{ from: [0, 0, 0], to: [0, 80, 0], color: '#16866a', width: 3 }]);
  });

  test('square with exact right angles', () => {
    const r = ok('powtorz 4 [np 100 pw 90]');
    expect(r.segments.map((s) => s.to)).toEqual([
      [0, 100, 0],
      [100, 100, 0],
      [100, 0, 0],
      [0, 0, 0],
    ]);
  });

  test('right turn is clockwise seen from above; left is counter-clockwise', () => {
    expect(ok('pw 90 np 10').segments[0]!.to).toEqual([10, 0, 0]);
    expect(ok('lw 90 np 10').segments[0]!.to).toEqual([-10, 0, 0]);
    expect(ok('pw -90 np 10').segments[0]!.to).toEqual([-10, 0, 0]);
    expect(ok('pw 450 np 10').segments[0]!.to).toEqual([10, 0, 0]);
  });

  test('back moves opposite to heading', () => {
    expect(ok('ws 30').segments[0]!.to).toEqual([0, -30, 0]);
    expect(ok('np -30').segments[0]!.to).toEqual([0, -30, 0]);
  });

  test('zero-length moves draw nothing', () => {
    expect(ok('np 0 ws 0 np 5').segments.length).toBe(1);
  });

  test('pen up suppresses drawing but moves the turtle', () => {
    const r = ok('pod np 50 opu np 10');
    expect(r.segments).toEqual([{ from: [0, 50, 0], to: [0, 60, 0], color: '#16866a', width: 3 }]);
  });

  test('colour and width persist', () => {
    const r = ok('kolor "#FF0000" grubosc 7 np 1 np 2 kolor "#00ff00" np 3');
    expect(r.segments.map((s) => [s.color, s.width])).toEqual([
      ['#ff0000', 7],
      ['#ff0000', 7],
      ['#00ff00', 7],
    ]);
  });

  test('decimal angles and distances', () => {
    const r = ok('pw 45 np 10');
    close(r.segments[0]!.to, [Math.SQRT1_2 * 10, Math.SQRT1_2 * 10, 0]);
  });

  test('all aliases are equivalent', () => {
    const a = ok('np 10 pw 90 ws 5 lw 45 pod np 1 opu kolor "#123456" grubosc 2 np 3 powtorz 2 [np 1]');
    const b = ok('FORWARD 10 right 90 BACK 5 LEFT 45 penup fd 1 pendown COLOR "#123456" Width 2 forward 3 REPEAT 2 [fd 1]');
    const c = ok('naprzód 10 prawo 90 wstecz 5 lewo 45 podnieś naprzod 1 opuść kolor "#123456" grubość 2 naprzod 3 powtórz 2 [np 1]');
    expect(b.segments).toEqual(a.segments);
    expect(c.segments).toEqual(a.segments);
  });

  test('newlines are insignificant between a command and its argument', () => {
    expect(ok('np\n10').segments[0]!.to).toEqual([0, 10, 0]);
    expect(ok('powtorz 2\n[\nnp 10\n]').segments.length).toBe(2);
  });

  test('comments are ignored', () => {
    expect(ok('np 10 ; pw 90 np 10\n; np 5').segments.length).toBe(1);
  });

  test('empty program draws nothing', () => {
    expect(ok('').segments).toEqual([]);
    expect(ok('   \n ; nic \n').segments).toEqual([]);
  });
});

describe('repeat', () => {
  test('zero runs nothing', () => {
    expect(ok('powtorz 0 [np 10]').segments).toEqual([]);
  });
  test('nested repeats', () => {
    const r = ok('powtorz 3 [powtorz 2 [np 1 pw 90] pw 180]');
    expect(r.segments.length).toBe(6);
  });
  test('count limits', () => {
    expect(ok('powtorz 10000 []').segments).toEqual([]);
    expect(err('powtorz 10001 [np 1]').column).toBe(9);
    expect(err('powtorz -1 [np 1]').column).toBe(9);
    expect(err('powtorz 2.5 [np 1]').column).toBe(9);
    expect(err('powtorz [np 1]').message).toContain('powtorz');
    expect(err('powtorz 4 np 1').message).toContain('[');
  });
});

describe('procedures', () => {
  test('ma: header with parameters', () => {
    const r = ok('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90');
    expect(r.segments.length).toBe(4);
    expect(r.segments[3]!.to).toEqual([0, 0, 0]);
    expect(r.segments[1]!.to).toEqual([80, 80, 0]);
  });

  test('legacy header and colon references', () => {
    const r = ok('oto kw :bok :kąt\n  powtorz 4 [np :bok pw kąt]\njuż\nkw 80 90');
    expect(r.segments.length).toBe(4);
  });

  test('definition may follow the call', () => {
    const r = ok('kw 10\noto kw ma: b\nnp b\njuż');
    expect(r.segments[0]!.to).toEqual([0, 10, 0]);
  });

  test('case-insensitive names and keywords; accented aliases', () => {
    const r = ok('OTO Kwadrat MA: Bok\n  POWTÓRZ 4 [NP bok PW 90]\nJUŻ\nKWADRAT 5');
    expect(r.segments.length).toBe(4);
  });

  test('to / end aliases', () => {
    const r = ok('to sq\nnp 5\nend\nsq');
    expect(r.segments.length).toBe(1);
  });

  test('parameters can be repeat counts and call arguments', () => {
    const src = 'oto wiele ma: n, d\n powtorz n [np d pw 90]\njuż\noto dwa ma: x\n wiele x x\njuż\ndwa 3';
    expect(ok(src).segments.length).toBe(3);
  });

  test('parameters are local', () => {
    const src = 'oto a ma: x\n np x\njuż\noto b ma: x\n a 5 np x\njuż\nb 1';
    const r = ok(src);
    expect(r.segments.map((s) => s.to)).toEqual([
      [0, 5, 0],
      [0, 6, 0],
    ]);
  });

  test('procedure with no parameters', () => {
    expect(ok('oto k\nnp 1\njuż\nk k').segments.length).toBe(2);
  });

  test('wrong argument count', () => {
    const e = err('oto kw ma: a, b\nnp a\njuż\nkw 1');
    expect(e.line).toBe(4);
    expect(e.column).toBe(1);
    expect(e.message).toContain('2 argumentów');
    const e2 = err('oto kw ma: a\nnp a\njuż\nkw 1 2');
    expect(e2.line).toBe(4);
    expect(e2.column).toBe(6);
    const e3 = err('oto kw\nnp 1\njuż\nkw 1');
    expect(e3.column).toBe(4);
  });

  test('direct recursion is an error even if never executed', () => {
    const e = err('oto a\npowtorz 0 [a]\njuż');
    expect(e.line).toBe(2);
    expect(e.column).toBe(12);
    expect(e.message).toContain('samą siebie');
  });

  test('indirect recursion is an error', () => {
    const e = err('oto a\nb\njuż\noto b\nc\njuż\noto c\na\njuż');
    expect(e.message).toContain('pośrednio');
  });

  test('duplicate definition', () => {
    const e = err('oto a\nnp 1\njuż\noto a\nnp 2\njuż');
    expect(e.line).toBe(4);
    expect(e.column).toBe(5);
  });

  test('definition inside a body is an error', () => {
    expect(err('powtorz 2 [\noto a\nnp 1\njuż\n]').line).toBe(2);
    expect(err('oto a\noto b\nnp 1\njuż\njuż').line).toBe(2);
  });

  test('missing już', () => {
    const e = err('np 1\noto a\nnp 1\n');
    expect(e.line).toBe(2);
    expect(e.column).toBe(1);
    expect(e.message).toContain('już');
  });

  test('oto must start a line; już must be alone', () => {
    expect(err('np 1 oto a\nnp 1\njuż').column).toBe(6);
    expect(err('oto a\nnp 1 już').column).toBe(6);
    expect(err('oto a\nnp 1\njuż np 2').column).toBe(5);
    expect(err('już').column).toBe(1);
  });

  test('bad headers', () => {
    expect(err('oto\nnp 1\njuż').column).toBe(1);
    expect(err('oto 5\nnp 1\njuż').column).toBe(5);
    expect(err('oto np\nnp 1\njuż').column).toBe(5);
    expect(err('oto a ma:\nnp 1\njuż').line).toBe(1);
    expect(err('oto a ma: x, x\nnp 1\njuż').column).toBe(14);
    expect(err('oto a ma: np\nnp 1\njuż').column).toBe(11);
    expect(err('oto a np 1\njuż').column).toBe(7);
  });

  test('unknown parameter and parameter outside procedure', () => {
    expect(err('oto a ma: x\nnp y\njuż').line).toBe(2);
    expect(err('np :x').column).toBe(4);
    expect(err('np x').column).toBe(4);
  });
});

describe('3D', () => {
  test('pitch rotates heading towards up', () => {
    const r = ok('gora 90 np 10', '3d');
    expect(r.segments[0]!.to).toEqual([0, 0, 10]);
    expect(ok('dol 90 np 10', '3d').segments[0]!.to).toEqual([0, 0, -10]);
    expect(ok('pitchup 90 np 10', '3d').segments[0]!.to).toEqual([0, 0, 10]);
    expect(ok('góra 90 np 10', '3d').segments[0]!.to).toEqual([0, 0, 10]);
    expect(ok('dół 90 np 10', '3d').segments[0]!.to).toEqual([0, 0, -10]);
    expect(ok('pitchdown 90 np 10', '3d').segments[0]!.to).toEqual([0, 0, -10]);
  });

  test('pitch is an error in 2D at the token', () => {
    const e = err('np 10\n  gora 30');
    expect(e.line).toBe(2);
    expect(e.column).toBe(3);
    expect(e.message).toContain('3D');
    expect(e.segments).toEqual([]);
  });

  test('right vector follows the heading; up follows pitch', () => {
    // After pitching up 90 the turtle heads +Z; turning right then heads +X.
    const r = ok('gora 90 pw 90 np 10', '3d');
    expect(r.segments[0]!.to).toEqual([10, 0, 0]);
    // After turning right 90 (heading +X), pitching up rotates around the new right (-Y): heads +Z.
    const r2 = ok('pw 90 gora 90 np 10', '3d');
    expect(r2.segments[0]!.to).toEqual([0, 0, 10]);
    // Pitch 90 then yaw 90 then pitch -90: heading should be along the former up... check orthonormality by a cube edge walk.
    const cube = ok('powtorz 4 [np 10 pw 90] gora 90 np 10 dol 90 powtorz 4 [np 10 pw 90]', '3d');
    expect(cube.segments[cube.segments.length - 1]!.to).toEqual([0, 0, 10]);
  });

  test('flat programs produce identical coordinates in 2D and 3D', () => {
    const src = 'powtorz 36 [np 37.5 pw 170 np 12 lw 33.3 kolor "#aa00aa" grubosc 2]';
    expect(run(src, '3d').segments).toEqual(run(src, '2d').segments);
  });
});

describe('errors: positions and messages', () => {
  test('unknown command', () => {
    const e = err('np 10\n   npp 5');
    expect([e.line, e.column]).toEqual([2, 4]);
    expect(e.message).toContain('npp');
  });

  test('missing and non-numeric arguments', () => {
    expect(err('np').column).toBe(1);
    expect(err('np pw 90').column).toBe(4);
    expect(err('np "#123456"').column).toBe(4);
    expect(err('pw').column).toBe(1);
    expect(err('np 10 20').column).toBe(7);
    expect(err('pod 5').column).toBe(5);
  });

  test('colour errors', () => {
    expect(err('kolor #123456').column).toBe(7);
    expect(err('kolor "#12345"').column).toBe(7);
    expect(err('kolor "#12345g"').column).toBe(7);
    expect(err('kolor 5').column).toBe(7);
    expect(err('kolor').column).toBe(1);
    expect(err('"#123456"').column).toBe(1);
  });

  test('width errors', () => {
    expect(err('grubosc 0').column).toBe(9);
    expect(err('grubosc 13').column).toBe(9);
    expect(err('grubosc 1.5').column).toBe(9);
    expect(ok('grubosc 12 np 1').segments[0]!.width).toBe(12);
    expect(ok('grubosc 1 np 1').segments[0]!.width).toBe(1);
  });

  test('brackets', () => {
    expect(err('powtorz 2 [np 1').column).toBe(11);
    expect(err('np 1 ]').column).toBe(6);
    expect(err('[np 1]').column).toBe(1);
    expect(err('oto a\npowtorz 2 [np 1\njuż').line).toBe(2);
  });

  test('parse errors draw nothing even after valid commands', () => {
    const e = err('np 10 np 10 npp');
    expect(e.segments).toEqual([]);
  });

  test('run-time parameter validation keeps earlier drawing', () => {
    const e = err('np 5\noto a ma: n\n powtorz n [np 1]\njuż\na 2.5');
    expect(e.segments.length).toBe(1);
    expect([e.line, e.column]).toEqual([3, 10]);
    const w = err('np 5\noto a ma: g\n grubosc g\njuż\na 99');
    expect(w.segments.length).toBe(1);
    expect(w.line).toBe(3);
  });
});

describe('limits', () => {
  test('source length', () => {
    const e = err('np 1 '.repeat(10_001));
    expect(e.message).toContain('za długi');
  });

  test('token count', () => {
    const e = err('pod\n'.repeat(10_001));
    expect(e.line).toBe(10_001);
    expect(ok('pod\n'.repeat(10_000)).segments).toEqual([]);
  });

  test('bracket nesting depth', () => {
    const okSrc = 'powtorz 1 ['.repeat(32) + 'np 1' + ']'.repeat(32);
    expect(ok(okSrc).segments.length).toBe(1);
    const badSrc = 'powtorz 1 ['.repeat(33) + 'np 1' + ']'.repeat(33);
    const e = err(badSrc);
    expect(e.column).toBe(11 * 32 + 11);
  });

  test('frame depth across procedures', () => {
    // Each procedure adds a call frame and a repeat frame.
    let src = '';
    for (let i = 1; i <= 17; i++) {
      src += `oto p${i}\n powtorz 1 [${i < 17 ? `p${i + 1}` : 'np 1'}]\njuż\n`;
    }
    const e = err(src + 'p1');
    expect(e.message).toContain('zagnieżdżenie');
    let src2 = '';
    for (let i = 1; i <= 16; i++) {
      src2 += `oto p${i}\n powtorz 1 [${i < 16 ? `p${i + 1}` : 'np 1'}]\njuż\n`;
    }
    expect(ok(src2 + 'p1').segments.length).toBe(1);
  });

  test('operation limit stops execution and keeps segments', () => {
    const e = err('powtorz 10000 [np 1 pw 1]');
    expect(e.message).toContain('operacji');
    expect(e.segments.length).toBe(5000);
    expect(e.line).toBe(1);
  });

  test('segment limit', () => {
    // 9999 ops for np + 1 repeat = 10000 ops: fine. Then one more segment is still under the segment limit.
    expect(ok('powtorz 9999 [np 1]').segments.length).toBe(9999);
  });

  test('coordinate limit', () => {
    const e = err('np 99999 np 2');
    expect(e.segments.length).toBe(1);
    expect(e.column).toBe(10);
    expect(ok('np 100000').segments.length).toBe(1);
  });
});

describe('run() contract', () => {
  test('returns plain data', () => {
    const r = run('np 1', '3D');
    expect(JSON.parse(JSON.stringify(r))).toEqual(r);
  });
  test('rejects bad mode', () => {
    expect(() => run('np 1', 'x')).toThrow(TypeError);
  });
});
