import { describe, expect, test } from 'bun:test';
import { ok, fails, failsAt, parseFailsAt, closeSeg, closeVec, dy, last } from './helpers';

const FD = ['np', 'naprzod', 'naprzód', 'fd', 'forward'];
const BK = ['ws', 'wstecz', 'bk', 'back'];
const RT = ['pw', 'prawo', 'rt', 'right'];
const LT = ['lw', 'lewo', 'lt', 'left'];
const PU = ['pod', 'podnies', 'podnieś', 'pu', 'penup'];
const PD = ['opu', 'opusc', 'opuść', 'pd', 'pendown'];
const COLOR = ['kolor', 'color'];
const WIDTH = ['grubosc', 'grubość', 'width'];
const REPEAT = ['powtorz', 'powtórz', 'repeat'];
const LET = ['niech', 'let'];
const IF = ['jeśli', 'jesli', 'if'];
const IFELSE = ['jeżeli', 'jezeli', 'ifelse'];
const HOME = ['dom', 'home'];
const CS = ['czyść', 'czysc', 'cs', 'clearscreen'];
const UP = ['gora', 'góra', 'pitchup'];
const DOWN = ['dol', 'dół', 'pitchdown'];
const RR = ['pp', 'przechylprawo', 'rr', 'rollright'];
const RL = ['pl', 'przechyllewo', 'rl', 'rollleft'];

describe('command aliases', () => {
  for (const c of FD)
    test(`${c} moves forward`, () => {
      const s = ok(`${c} 10`);
      expect(s.length).toBe(1);
      closeSeg(s[0], [0, 0, 0], [0, 10, 0]);
    });
  for (const c of BK)
    test(`${c} moves backward`, () => {
      const s = ok(`${c} 10`);
      expect(s.length).toBe(1);
      closeSeg(s[0], [0, 0, 0], [0, -10, 0]);
    });
  for (const c of RT)
    test(`${c} turns right`, () => {
      const s = ok(`${c} 90 np 10`);
      closeSeg(s[0], [0, 0, 0], [10, 0, 0]);
    });
  for (const c of LT)
    test(`${c} turns left`, () => {
      const s = ok(`${c} 90 np 10`);
      closeSeg(s[0], [0, 0, 0], [-10, 0, 0]);
    });
  for (const c of PU)
    test(`${c} raises the pen`, () => {
      expect(ok(`${c} np 10`)).toEqual([]);
    });
  for (const c of PD)
    test(`${c} lowers the pen`, () => {
      const s = ok(`pod np 10 ${c} np 5`);
      expect(s.length).toBe(1);
      closeSeg(s[0], [0, 10, 0], [0, 15, 0]);
    });
  for (const c of COLOR)
    test(`${c} sets the colour`, () => {
      expect(ok(`${c} "#ff0000" np 1`)[0].color).toBe('#ff0000');
    });
  for (const c of WIDTH)
    test(`${c} sets the width`, () => {
      expect(ok(`${c} 7 np 1`)[0].width).toBe(7);
    });
  for (const c of REPEAT)
    test(`${c} repeats`, () => {
      expect(dy(ok(`${c} 3 [np 1]`))).toEqual([1, 1, 1]);
    });
  for (const c of LET)
    test(`${c} assigns`, () => {
      expect(dy(ok(`${c} x 6 np x`))).toEqual([6]);
    });
  for (const c of IF)
    test(`${c} conditional`, () => {
      expect(dy(ok(`${c} 1 < 2 [np 1] ${c} 2 < 1 [np 2]`))).toEqual([1]);
    });
  for (const c of IFELSE)
    test(`${c} two-branch conditional`, () => {
      expect(dy(ok(`${c} 1 < 2 [np 1] [np 2] ${c} 2 < 1 [np 3] [np 4]`))).toEqual([1, 4]);
    });
  for (const c of HOME)
    test(`${c} returns home`, () => {
      const s = ok(`np 10 ${c}`);
      expect(s.length).toBe(2);
      closeSeg(s[1], [0, 10, 0], [0, 0, 0]);
    });
  for (const c of CS)
    test(`${c} clears the screen`, () => {
      const s = ok(`np 10 ${c} np 5`);
      expect(s.length).toBe(1);
      closeSeg(s[0], [0, 10, 0], [0, 15, 0]);
    });
  for (const c of UP)
    test(`${c} pitches up (3D)`, () => {
      closeVec(last(ok(`${c} 90 np 10`, '3d')), [0, 0, 10]);
    });
  for (const c of DOWN)
    test(`${c} pitches down (3D)`, () => {
      closeVec(last(ok(`${c} 90 np 10`, '3d')), [0, 0, -10]);
    });
  for (const c of RR)
    test(`${c} rolls right (3D)`, () => {
      closeVec(last(ok(`${c} 90 pw 90 np 10`, '3d')), [0, 0, -10]);
    });
  for (const c of RL)
    test(`${c} rolls left (3D)`, () => {
      closeVec(last(ok(`${c} 90 pw 90 np 10`, '3d')), [0, 0, 10]);
    });
  for (const c of [...UP, ...DOWN, ...RR, ...RL])
    test(`${c} is a parse-time error in 2D`, () => {
      parseFailsAt(`np 10 ${c} 10`, 1, 7, '2d');
    });
  test('pitch/roll in a never-called procedure body is an error in 2D', () => {
    parseFailsAt('oto p\ngora 10\njuż\nnp 1', 2, 1, '2d');
  });
  test('stop alias', () => {
    expect(dy(ok('np 1 STOP np 2'))).toEqual([1]);
  });
});

describe('initial state and pen', () => {
  test('default colour #16866a, width 3, pen down', () => {
    const s = ok('np 10');
    expect(s).toEqual([{ from: [0, 0, 0], to: [0, 10, 0], color: '#16866a', width: 3 }]);
  });
  test('zero move draws nothing', () => {
    expect(ok('np 0')).toEqual([]);
    expect(ok('ws 0 np 5 - 5')).toEqual([]);
  });
  test('turns draw nothing', () => {
    expect(ok('pw 90 lw 45')).toEqual([]);
  });
  test('backward then forward draws two segments', () => {
    const s = ok('np 10 ws 10');
    expect(s.length).toBe(2);
    closeSeg(s[1], [0, 10, 0], [0, 0, 0]);
  });
  test('pen up moves without drawing, state persists', () => {
    const s = ok('pod np 10 pw 90 np 5 opu np 1 np 1');
    expect(s.length).toBe(2);
    closeSeg(s[0], [5, 10, 0], [6, 10, 0]);
    closeSeg(s[1], [6, 10, 0], [7, 10, 0]);
  });
  test('opu when pen already down is harmless', () => {
    expect(ok('opu opu np 1').length).toBe(1);
  });
});

describe('colour', () => {
  test('colour persists and applies only to later segments', () => {
    const s = ok('np 1 kolor "#ff0000" np 1 np 1 kolor "#0000FF" np 1');
    expect(s.map((x) => x.color)).toEqual(['#16866a', '#ff0000', '#ff0000', '#0000ff']);
  });
  test('missing colour at end of program reported at the command', () => {
    parseFailsAt('np 1\nkolor', 2, 1);
  });
  test('missing colour before another command reported at that token', () => {
    parseFailsAt('kolor np 1', 1, 7);
  });
});

describe('width', () => {
  test('width persists', () => {
    const s = ok('np 1 grubosc 5 np 1 np 1');
    expect(s.map((x) => x.width)).toEqual([3, 5, 5]);
  });
  test('boundary widths 1 and 12 accepted', () => {
    expect(ok('grubosc 1 np 1')[0].width).toBe(1);
    expect(ok('grubosc 12 np 1')[0].width).toBe(12);
  });
  test('literal expressions are evaluated', () => {
    expect(ok('grubosc 6 * 2 np 1')[0].width).toBe(12);
    expect(ok('grubosc 24 / 2 np 1')[0].width).toBe(12);
    expect(ok('grubosc (1 + 1) np 1')[0].width).toBe(2);
  });
  test('integral decimal literal accepted', () => {
    expect(ok('grubosc 3.0 np 1')[0].width).toBe(3);
  });
  for (const bad of ['0', '13', '2.5', '-1', '2 * 6.5', '100', '- 3', '7 / 2'])
    test(`literal width ${bad} is a parse-time error at the argument`, () => {
      parseFailsAt(`np 1 grubosc ${bad}`, 1, 14);
    });
  test('width from a name is checked at run time, at the argument', () => {
    const r = failsAt('niech w 13\nnp 1\ngrubosc w\nnp 1', 3, 9);
    expect(r.segments.length).toBe(1);
  });
  test('computed width reported at first token of the argument', () => {
    const r = failsAt('niech w 6\nnp 1\ngrubosc 2 * w + 1', 3, 9);
    expect(r.segments.length).toBe(1);
  });
  test('valid computed width', () => {
    const s = ok('niech w 0.5\nnp 1\ngrubosc w * 4\nnp 1');
    expect(s.map((x) => x.width)).toEqual([3, 2]);
  });
  test('missing width at end reported at command', () => {
    parseFailsAt('np 1 grubosc', 1, 6);
  });
});

describe('dom (home)', () => {
  test('returns to origin drawing a segment and resets heading', () => {
    const s = ok('np 10 pw 90 np 5 dom np 3');
    expect(s.length).toBe(4);
    closeSeg(s[0], [0, 0, 0], [0, 10, 0]);
    closeSeg(s[1], [0, 10, 0], [5, 10, 0]);
    closeSeg(s[2], [5, 10, 0], [0, 0, 0]);
    closeSeg(s[3], [0, 0, 0], [0, 3, 0]);
  });
  test('at origin draws nothing', () => {
    expect(ok('dom')).toEqual([]);
    expect(ok('pw 90 dom np 1').length).toBe(1);
    closeVec(last(ok('pw 90 dom np 1')), [0, 1, 0]);
    expect(ok('np 5 ws 5 dom').length).toBe(2);
  });
  test('pen up: moves home without drawing, pen stays up', () => {
    expect(ok('pod np 10 dom np 5')).toEqual([]);
    const s = ok('pod np 10 dom opu np 1');
    expect(s.length).toBe(1);
    closeSeg(s[0], [0, 0, 0], [0, 1, 0]);
  });
  test('colour and width untouched', () => {
    const s = ok('kolor "#ff0000" grubosc 5 np 10 dom np 1');
    expect(s.map((x) => [x.color, x.width])).toEqual([
      ['#ff0000', 5],
      ['#ff0000', 5],
      ['#ff0000', 5],
    ]);
  });
  test('resets full 3D orientation', () => {
    const s = ok('gora 45 pp 30 pw 20 np 10 dom pw 90 np 1', '3d');
    expect(s.length).toBe(3);
    closeVec(s[1].to, [0, 0, 0]);
    closeSeg(s[2], [0, 0, 0], [1, 0, 0]);
  });
  test('resets up vector after roll', () => {
    const s = ok('pp 90 dom gora 90 np 1', '3d');
    closeSeg(s[0], [0, 0, 0], [0, 0, 1]);
  });
  test('resets right vector after roll', () => {
    const s = ok('pp 90 dom pw 90 np 5', '3d');
    closeSeg(s[0], [0, 0, 0], [5, 0, 0]);
  });
});

describe('czyść (clear screen)', () => {
  test('keeps position and heading', () => {
    const s = ok('pw 90 np 10 czyść np 5');
    expect(s.length).toBe(1);
    closeSeg(s[0], [10, 0, 0], [15, 0, 0]);
  });
  test('keeps pen, colour and width', () => {
    const s = ok('kolor "#ff0000" grubosc 7 np 1 czyść np 1');
    expect(s.length).toBe(1);
    expect(s[0].color).toBe('#ff0000');
    expect(s[0].width).toBe(7);
    expect(ok('pod np 1 czyść np 1')).toEqual([]);
  });
  test('at end leaves nothing', () => {
    expect(ok('np 1 np 2 czyść')).toEqual([]);
  });
  test('repeated clears', () => {
    expect(dy(ok('np 1 czyść np 2 czyść np 3 np 4'))).toEqual([3, 4]);
  });
  test('run-time error after czyść keeps only later segments', () => {
    const r = fails('np 10 czyść np 5 np 1 / 0');
    expect(r.segments.length).toBe(1);
    closeSeg(r.segments[0], [0, 10, 0], [0, 15, 0]);
  });
});

describe('stop at top level', () => {
  test('ends the program without error', () => {
    expect(dy(ok('np 1 stop np 2'))).toEqual([1]);
  });
  test('stop inside a top-level repeat ends the program', () => {
    expect(dy(ok('powtorz 5 [np 1 jeśli nrpowt = 3 [stop]] np 10'))).toEqual([1, 1, 1]);
  });
  test('stop inside a top-level conditional ends the program', () => {
    expect(ok('jeżeli 1 = 1 [stop] [np 5] np 1')).toEqual([]);
  });
});
