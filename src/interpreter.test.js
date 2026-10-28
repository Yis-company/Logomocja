import {test,expect} from 'bun:test';
import {run} from './interpreter.js';
import {examples} from './examples.js';
test('standardowe programy wykonują się',()=>{for(const e of examples){let r=run(e[4],e[2]);expect([e[0],r.error]).toEqual([e[0],null]);expect(r.segments.length).toBeGreaterThan(0)}});
test('wyrażenia, zmienne i błędy',()=>{expect(run('np 20 - 5 - 3','2d').segments[0].to[1]).toBe(12);expect(run('np 2 + 3 * 4','2d').segments[0].to[1]).toBe(14);expect(run('np 10 -5','2d').segments).toEqual([]);expect(run('np 5 np 1 / 0','2d').error).not.toBeNull();expect(run('np 5 niech x 1 np x / 0','2d').segments.length).toBe(1)});
test('płaskie rysunki mają te same współrzędne w obu trybach',()=>{expect(run('powtorz 4 [np 50 pw 90]','2d').segments).toEqual(run('powtorz 4 [np 50 pw 90]','3d').segments)});
