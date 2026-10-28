import test from 'node:test';import assert from 'node:assert/strict';import {run} from './interpreter.js';import {examples} from './examples.js';
test('standard examples execute without errors and ship drawing strokes',()=>{for(const e of examples){const r=run(e.source,e.mode);assert.equal(r.error,null,`${e.name}: ${r.error?.message}`);assert.ok(r.segments.length>0,e.name)}});
test('flat programs produce identical 2D and 3D coordinates',()=>{const s='powtorz 4 [np 20 pw 90]';assert.deepEqual(run(s,'2d').segments,run(s,'3d').segments)});
test('expression precedence, left association and operator spacing',()=>{assert.equal(run('np 2 + 3 * 4').segments[0].to[1],14);assert.equal(run('np 20 - 5 - 3').segments[0].to[1],12);assert.equal(run('np 10-5').segments[0].to[1],5);assert.ok(run('np 10 -5').error)});
test('parse errors are preflighted and run errors keep prior drawing',()=>{assert.equal(run('np 20\nnieznane').segments.length,0);const r=run('np 20\nnp 1 / 0');assert.equal(r.segments.length,1);assert.ok(r.error)});
test('procedures, locals, lexical repeat counter and stop',()=>{const r=run('oto f ma: n\n powtorz n [np nrpowt]\njuż\nf 3');assert.equal(r.error,null);assert.deepEqual(r.segments.map(s=>s.to[1]),[1,3,6]);assert.ok(run('oto f\n np nrpowt\njuż').error);const stop=run('oto f\n np 10\n stop\n np 20\njuż\nf\nnp 5');assert.equal(stop.segments.length,2)});
test('3D commands are rejected in 2D, accepted in 3D',()=>{assert.ok(run('gora 30','2d').error);assert.equal(run('gora 30 np 10','3d').error,null)});
test('repeat and width literal validation and unassigned variables',()=>{assert.ok(run('grubosc 13').error);assert.equal(run('niech n 13\ngrubosc n').error.line,2);assert.ok(run('powtorz 10001 [np 1]').error);assert.ok(run('niech x y').error)});
test('clear screen removes prior strokes',()=>{const r=run('np 10\nczysc\npw 90\nnp 10');assert.equal(r.segments.length,1);assert.deepEqual(r.segments[0].from,[0,10,0])});

test('procedures can read globals and local assignment shadows them',()=>{const r=run('niech x 7\noto f\n np x\n niech x 2\n np x\njuż\nf');assert.equal(r.error,null);assert.deepEqual(r.segments.map(s=>s.to[1]),[7,9])});
