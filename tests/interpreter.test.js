import {test} from 'node:test';import assert from 'node:assert/strict';import {run} from '../src/interpreter.js';import {examples} from '../src/examples.js';
test('standard programs execute',()=>{for(const e of examples){let r=run(e[4],e[2]);assert.equal(r.error,null,e[0]+': '+JSON.stringify(r.error));assert.ok(r.segments.length,e[0])}});
test('expressions, repeats and errors',()=>{assert.equal(run('np 20 - 5 - 3').segments[0].to[1],12);assert.equal(run('np 2 + 3 * 4').segments[0].to[1],14);assert.ok(run('np 10 -5').error);assert.ok(run('np nrpowt').error);assert.equal(run('np 10 np 1 / 0').segments.length,1)});
test('flat geometry agrees in both modes',()=>{let src='powtorz 4 [np 100 pw 90]';assert.deepEqual(run(src,'2d').segments,run(src,'3d').segments)});
test('pitch goes up and clear keeps subsequent drawing',()=>{let r=run('gora 90 np 10 czyść np 5','3d');assert.equal(r.segments.length,1);assert.ok(Math.abs(r.segments[0].to[2]-15)<1e-8)});
test('local declarations shadow globals before assignment',()=>{let r=run('niech x 10\noto p\n np x\n niech x 4\njuż\np');assert.match(r.error.message,/nie ma jeszcze wartości/);assert.equal(r.segments.length,0)});
test('definitions cannot appear inside brackets',()=>{assert.ok(run('powtorz 1 [\noto p\nnp 10\njuż\n]').error)});
