import { describe, expect, test } from 'bun:test';
import { Execution, run } from '../src/interpreter';
import { examples } from '../src/examples';
import { challenges, checkChallenge } from '../src/challenges';
const end=(source:string,mode:'2d'|'3d'='2d') => { const r=run(source,mode); expect(r.error).toBeNull(); return r.segments.at(-1)?.to; };
const errorAt=(s:string,line:number,column:number,partial=0,mode:'2d'|'3d'='2d') => { const r=run(s,mode); expect(r.error).not.toBeNull(); expect(r.error?.line).toBe(line); expect(r.error?.column).toBe(column); expect(r.segments.length).toBe(partial); return r; };
describe('wyrażenia i tokeny',()=> {
  test('priorytety, łączność, nawiasy, znaki',()=> {
    expect(end('np 20 - 5 - 3')).toEqual([0,12,0]);
    expect(end('np 2 + 3 * 4')).toEqual([0,14,0]);
    expect(end('np 10-5')).toEqual([0,5,0]);
    expect(end('np -(3 - 5)')).toEqual([0,2,0]);
    expect(end('np - -2')).toEqual([0,2,0]);
    expect(end('niech bok 4 np -bok')).toEqual([0,-4,0]);
    expect(end('np .5')).toEqual([0,.5,0]);
  });
  test('odstępy przy operatorach są symetryczne',()=> {
    errorAt('np 10 -5',1,7); errorAt('np 10- 5',1,6);
    errorAt('np 10 +5',1,7); errorAt('np 10 *5',1,7); errorAt('np 10 /5',1,7);
  });
  test('brak innych formatów liczb',()=> { for(const value of ['1e3','0x10','NaN','Infinity','1.2.3','12.']) expect(run(`np ${value}`,'2d').error).not.toBeNull(); });
  test('argumenty i pozycje błędów',()=> {
    errorAt('np',1,1); errorAt('niech x',1,1); errorAt('powtorz 2 [np ]',1,15);
    errorAt('np 5\nnp 9 / 0',2,4,1);
    errorAt('np 5\nniech x 13 grubosc x',2,20,1);
    errorAt('np 5\ngrubosc 13',2,9);
    errorAt('np 5\npowtorz 2.5 []',2,9);
    errorAt('np 5\nniech n -1 powtorz n []',2,20,1);
    errorAt('np 5\nkolor "#xyz"',2,7);
    errorAt('np 5\nnp (x + 2)\nniech x 3',2,4,1);
  });
  test('case, polskie znaki i komentarze',()=> {
    expect(end('; hej\nNiEcH DŁ 12\nNAPRZÓD :dł')).toEqual([0,12,0]);
    const r=run('CoLoR "#AbC123" WIDTH 2 FORWARD 4','2d'); expect(r.segments[0].color).toBe('#abc123');
  });
});
describe('sterowanie, procedury i zakresy',()=> {
  test('forward calls, positional expressions, parameter named like procedure',()=> {
    expect(end('kwadrat 40 * 2 90\noto kwadrat ma: kwadrat, kąt\nnp kwadrat pw kąt\njuż')).toEqual([0,80,0]);
    expect(end('oto p :a :b\nnp :a + b\nend\np 2 3')).toEqual([0,5,0]);
  });
  test('local variables, reassignment, globals',()=> {
    expect(end('niech x 7\noto p ma: a\nniech x a niech a 3 np x + a\njuż\np 2 np x')).toEqual([0,12,0]);
    expect(end('oto p\nnp x\njuż\nniech x 8 p')).toEqual([0,8,0]);
    errorAt('np 1\njeśli 0 = 1 [niech x 3]\nnp x',3,4,1);
    expect(run('oto p\nniech x 2\njuż\np np x','2d').segments).toEqual([]);
  });
  test('nested repeats and lexical repcount',()=> {
    expect(end('powtorz 2 [powtorz 3 [np nrpowt] np nrpowt]')).toEqual([0,15,0]);
    errorAt('np nrpowt',1,4);
    errorAt('oto p\nnp nrpowt\njuż\npowtorz 2 [p]',2,4);
    expect(end('oto p\npowtorz 2 [np repcount]\njuż\npowtorz 2 [p]')).toEqual([0,6,0]);
  });
  test('stop unwinds repeat/conditional to enclosing call',()=> {
    expect(end('oto p\npowtorz 5 [np 2 jeśli 1=1 [stop] np 99]\njuż\np np 3')).toEqual([0,5,0]);
    expect(end('powtorz 3 [np 2 stop] np 99')).toEqual([0,2,0]);
    expect(end('oto p\npowtorz 1 [np 1 stop]\njuż\npowtorz 100 [p]')).toEqual([0,100,0]);
  });
  test('exact comparisons',()=> {
    expect(end('jeśli 0.1 + 0.2 = 0.3 [np 100] jeżeli 3<>4 [np 1] [np 2]')).toEqual([0,1,0]);
  });
  test('validate whole program including unreachable code',()=> {
    errorAt('np 5\nstop\nnieznane',3,1);
    expect(run('powtorz 0 [gora 90]','2d').segments).toEqual([]);
    for(const s of ['oto a\nnp 2','powtorz 2 [oto p\nend\n]','oto a\nend\noto a\nend','oto p ma: a, a\nend','oto p\nend\nniech p 3','oto p ma: a, b\nend\np 3','oto p\nend\np 3','powtorz 2 [np 1','np (2 + 3']) expect(run(s,'2d').error).not.toBeNull();
  });
});
describe('geometria i limity',()=> {
  test('flat geometry identical in both modes',()=> { const s='powtorz 5 [np 20 pw 144] pod ws 5 opu dom'; expect(run(s,'2d')).toEqual(run(s,'3d')); });
  test('pitch yaw and roll right-handed vectors',()=> {
    const a=end('gora 90 np 10','3d')!; expect(a[2]).toBeCloseTo(10); expect(a[1]).toBeCloseTo(0);
    const b=end('pp 90 gora 90 np 10','3d')!; expect(b[0]).toBeCloseTo(10); expect(b[2]).toBeCloseTo(0);
    const c=end('pp 90 pw 90 np 10','3d')!; expect(c[2]).toBeCloseTo(-10);
    const d=end('pw 90 np 10','3d')!; expect(d[0]).toBeCloseTo(10);
  });
  test('home draws and restores only position/orientation',()=> {
    const r=run('kolor "#ff0000" grubosc 7 np 10 dom np 5','2d'); expect(r.segments.length).toBe(3); expect(r.segments[1].to).toEqual([0,0,0]); expect(r.segments[2].width).toBe(7); expect(r.segments[2].color).toBe('#ff0000');
  });
  test('clear preserves turtle and zero move draws nothing',()=> {
    const r=run('np 10 czysc np 0 np 5 np 1 / 0','2d'); expect(r.segments.length).toBe(1); expect(r.segments[0].from).toEqual([0,10,0]); expect(r.error).not.toBeNull();
  });
  test('coordinate and operation limits retain previous drawing',()=> {
    errorAt('np 2 np 100001',1,9,1);
    expect(run('powtorz 10000 [np 1]','2d').error?.message).toContain('operacji');
    expect(run('oto p\np\njuż\np','2d').error?.message).toContain('32');
    expect(run('powtorz 1 ['.repeat(33)+']'.repeat(33),'2d').error?.message).toContain('32');
    expect(run(';'.repeat(50001),'2d').error?.message).toContain('50 000');
    expect(run('pu '.repeat(10001),'2d').error?.message).toContain('tokenów');
  });
  test('conditional frames do not count, completion counts as an operation',()=> {
    const e=new Execution('niech x 1 jeśli x = 1 [np 1] powtorz 2 [pw 0]'); e.finish(); expect(e.operations).toBe(9);
  });
});
test('all thirteen standard examples execute in their designated modes',()=> {
  expect(examples.length).toBe(13);
  for(const example of examples) { const r=run(example.source,example.mode); expect(r.error,example.name).toBeNull(); expect(r.segments.length).toBeGreaterThan(0); }
});
test('challenge checks accept equivalent geometry and reject missing/extra lines',()=> {
  for(const c of challenges) expect(checkChallenge(c,c.expected).pass,c.title).toBe(true);
  const c=challenges[0]; expect(checkChallenge(c,'np 100 pw 90 np 50 np 50 pw 90 np 100 pw 90 np 100').pass).toBe(true);
  expect(checkChallenge(c,'np 100').pass).toBe(false); expect(checkChallenge(c,c.expected+' np 150').pass).toBe(false);
});

test('expressions up to the token limit do not add an implicit nesting limit',()=> {
  expect(end('np '+'- '.repeat(9000)+'1')).toEqual([0,1,0]);
  expect(end('np '+'('.repeat(4000)+'1'+')'.repeat(4000))).toEqual([0,1,0]);
  expect(end('np '+'1+'.repeat(4999)+'1')).toEqual([0,5000,0]);
  expect(end('grubosc '+'1'+'+0'.repeat(4997)+' np 1')).toEqual([0,1,0]);
});
