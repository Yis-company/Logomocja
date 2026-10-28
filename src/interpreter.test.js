import {test,expect} from 'bun:test';
import {run} from './interpreter.js';
import {examples} from './examples.js';
test('wszystkie przykłady działają',()=>{for(const e of examples)expect(run(e[4],e[2]).error).toBeNull()});
test('wyrażenia i kolejność działań',()=>{let r=run('np 20 - 5 - 3 pw 90 np 2 + 3 * 4');expect(r.error).toBeNull();expect(r.segments[0].to[1]).toBe(12);expect(r.segments[1].to[0]).toBe(14)});
test('błąd składni nic nie rysuje, błąd wykonania zachowuje rysunek',()=>{expect(run('np 10 ble').segments).toHaveLength(0);let r=run('np 10 niech x 0 np 1 / x');expect(r.segments).toHaveLength(1);expect(r.error.message).toContain('zero')});
test('3D i płaskie polecenia',()=>{expect(run('np 10 pw 90 np 20','2d').segments).toEqual(run('np 10 pw 90 np 20','3d').segments);expect(run('gora 90 np 10','3d').segments[0].to[2]).toBe(10);expect(run('gora 90','2d').error).not.toBeNull()});
test('zmienne lokalne i rekurencja',()=>{let r=run('oto f ma: n\n jeśli n > 0 [np n f n - 1]\njuż\nf 3');expect(r.error).toBeNull();expect(r.segments).toHaveLength(3)});
test('czyszczenie i nrpowt',()=>{let r=run('np 5 czyść powtorz 3 [np nrpowt]');expect(r.segments).toHaveLength(3);expect(run('np nrpowt').error).not.toBeNull()});
