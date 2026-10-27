import {test,expect} from 'bun:test';
import {run} from './interpreter.js';
test('square and flat parity',()=>{let s='powtórz 4 [np 80 pw 90]';expect(run(s,'2d')).toEqual(run(s,'3d'));expect(run(s).segments).toHaveLength(4);expect(Math.abs(run(s).segments.at(-1).to[0])).toBeLessThan(1e-10);});
test('procedures, forward calls, local parameters',()=>{let r=run('kwadrat 80 90\noto kwadrat ma: bok, kąt\n powtorz 4 [np :bok pw kąt]\njuż');expect(r.error).toBeNull();expect(r.segments).toHaveLength(4);});
test('pitch orientation',()=>{let r=run('np 10 góra 90 np 20 pw 90 np 5','3d');expect(r.error).toBeNull();let p=r.segments.at(-1).to;expect(p[0]).toBeCloseTo(5);expect(p[1]).toBeCloseTo(10);expect(p[2]).toBeCloseTo(20);});
test('full validation before execution',()=>{for(let s of ['np 10 blabla','np 10 gora 30','np 10 powtorz 0 [grubosc 13]','np 10 powtorz 1 [oto x\nnp 1\njuż\n]','np 10\noto a\nb\njuż\noto b\na\njuż']){let r=run(s);expect(r.error).not.toBeNull();expect(r.segments).toEqual([]);}});
test('runtime coordinate and operation limits keep strokes',()=>{let r=run('np 10 np 100001');expect(r.error).not.toBeNull();expect(r.segments).toHaveLength(1);expect(run('powtorz 10000 [np 1]').error).not.toBeNull();});
test('pen, color, zero, signed decimals and legacy syntax',()=>{let r=run('TO x :a\ncolor "#ABCDEF" width 12 fd :a\nEND\npu fd 10 pd fd 0 x +.5');expect(r.error).toBeNull();expect(r.segments).toEqual([{from:[0,10,0],to:[0,10.5,0],color:'#abcdef',width:12}]);});
