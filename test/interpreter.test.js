import test from 'node:test';
import assert from 'node:assert/strict';
import {interpret} from '../src/interpreter.js';
test('rysuje kwadrat w kolejności i zachowuje geometrię',()=>{const r=interpret('powtorz 4 [np 10 pw 90]');assert.equal(r.error,null);assert.equal(r.segments.length,4);assert.deepEqual(r.segments[0].from,[0,0,0]);assert.equal(r.segments[0].to[1],10)});
test('parse error does not draw',()=>{const r=interpret('np 10\nbleh');assert.ok(r.error);assert.equal(r.segments.length,0)});
test('2d rejects pitch at run time',()=>{const r=interpret('np 10\ngora 90');assert.ok(r.error);assert.equal(r.segments.length,1)});
