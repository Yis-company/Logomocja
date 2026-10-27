import {test,expect} from 'bun:test';
import {run} from './logo.js';
test('kwadrat i zgodność 2D / 3D',()=>{const a=run('powtórz 4 [np 80 pw 90]','2d'),b=run('powtórz 4 [np 80 pw 90]','3d');expect(a.error).toBeNull();expect(a.segments).toEqual(b.segments);expect(a.segments.length).toBe(4)});
test('procedury i parametry',()=>{const a=run('kwadrat 20 90\noto kwadrat ma: bok, kąt\n powtórz 4 [np bok pw kąt]\njuż','2d');expect(a.error).toBeNull();expect(a.segments.length).toBe(4)});
test('błąd przed rysowaniem',()=>{const a=run('np 20\ngóra 90','2d');expect(a.segments).toEqual([]);expect(a.error.line).toBe(2)});
test('pochylenie w przestrzeni',()=>{const a=run('góra 90 np 10','3d');expect(a.segments[0].to[2]).toBeCloseTo(10)});
test('rekurencja w nieużywanej procedurze',()=>{const a=run('oto a\n a\njuż','2d');expect(a.error).not.toBeNull()});
