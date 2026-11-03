import {test,expect} from 'bun:test';
import {challenges,checkDrawing} from '../src/challenges';
import {run} from '../src/interpreter';
for(const c of challenges){test('challenge '+c.id+' accepts target and rejects wrong/empty drawing',()=>{expect(checkDrawing(c,run(c.target,c.mode)).pass).toBe(true);expect(checkDrawing(c,run('',c.mode)).pass).toBe(false);expect(checkDrawing(c,run('np 7',c.mode)).pass).toBe(false);expect(checkDrawing(c,run(c.target.replace(/100|120|150|40/g,'30'),c.mode)).pass).toBe(false);});}
test('square can be drawn with split segments and different style',()=>{const r=run('color "#abcdef" width 7 repeat 4 [fd 50 fd 50 rt 90]');expect(checkDrawing(challenges[0],r).pass).toBe(true);});
