import {test} from 'node:test';
import assert from 'node:assert/strict';
import {run} from '../src/interpreter.js';
import {examples} from '../src/examples.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('all standard examples execute in their modes',()=>{for(const e of examples){let result=run(e[4],e[2]);assert.equal(result.error,null,e[0]);assert.ok(result.segments.length,e[0])}});
test('precedence, associativity, unary signs and spacing',()=>{for(const [src,n] of [['np 20 - 5 - 3',12],['np 2 + 3 * 4',14],['np 10-5',5],['np -(3 - 5)',2],['np - -2',2]])near(run(src).segments[0].to[1],n);assert.ok(run('np 10 -5').error);});
test('parse failures draw nothing and runtime failures preserve strokes',()=>{assert.equal(run('np 10 bzdura').segments.length,0);let r=run('np 10 np 1 / 0');assert.equal(r.segments.length,1);assert.equal(r.error.column,10);});
test('2D and 3D flat geometry agree',()=>{let s='powtorz 4 [np 20 pw 90] dom';assert.deepEqual(run(s,'2d').segments,run(s,'3d').segments)});
test('orientation in three dimensions',()=>{let r=run('gora 90 np 10 pp 90 np 5','3d');near(r.segments[0].to[2],10);near(r.segments[1].to[2],15);assert.ok(run('gora 90','2d').error)});
test('procedures, recursion, locals and lexical repeat count',()=>{let s='niech x 10\noto a ma: x\n niech x x + 1 np x\njuż\na 5 np x';let r=run(s);assert.equal(r.error,null);near(r.segments[1].to[1],16);assert.ok(run('oto a\n np nrpowt\njuż\npowtorz 2 [a]').error);assert.equal(run('powtorz 3 [np nrpowt]').segments.length,3)});
test('unassigned variables, clear, home and conditionals',()=>{let r=run('np x niech x 5');assert.equal(r.error.line,1);assert.equal(r.error.column,4);r=run('np 10 czyść np 5 dom');assert.equal(r.segments.length,2);near(r.segments[1].to[1],0);assert.equal(run('jeśli 0.1 + 0.2 = 0.3 [np 10]').segments.length,0)});
test('limits and value validation',()=>{assert.ok(run('powtorz 10001 [np 1]').error);assert.ok(run('grubosc 1.5').error);assert.ok(run('np 100001').error);assert.ok(run('powtorz 10000 [pod]').error);assert.ok(run('np 1e3').error)});

test('definitions are restricted to top level',()=>{let r=run('powtorz 2 [\noto a\nnp 1\njuż\n]');assert.ok(r.error);assert.equal(r.segments.length,0)});
