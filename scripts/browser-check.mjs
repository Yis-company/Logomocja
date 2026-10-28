import {chromium} from '@playwright/test';
import {examples} from '../src/examples.js';
import {challenges} from '../src/challenges.js';
import assert from 'node:assert/strict';
const url=process.env.TEST_URL||'http://localhost:5173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage();const errors=[],external=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(new URL(url).origin)&&!r.url().startsWith('data:'))external.push(r.url())});
try{
 await page.goto(url);await page.waitForFunction(()=>window.logomocja);await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.evaluate(()=>typeof logomocja.version),'string');
 const original=await page.locator('#editor').inputValue();
 const result=await page.evaluate(()=>logomocja.run('np 10 np 1 / 0','2d'));assert.equal(result.segments.length,1);assert.equal(result.error.column,10);assert.equal(await page.locator('#editor').inputValue(),original);
 for(const item of examples){const result=await page.evaluate(async e=>await logomocja.open(e.source,e.mode),item);assert.equal(result.error,null,item.name);assert.ok(result.segments.length>0,item.name);assert.equal(await page.locator('#editor').inputValue(),item.source)}
 console.log('PASS: 13 standard programs and pure run / rendered open hooks');
 await page.evaluate(e=>logomocja.open(e.source,e.mode),examples[8]);await page.screenshot({path:'/tmp/logomocja-3d.png',fullPage:true});
 const before=await page.locator('#drawing').evaluate(c=>c.toDataURL());await page.locator('#drawing').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('#drawing').evaluate(c=>c.toDataURL()),before);
 await page.locator('#mode-2d').click();await page.locator('#editor').fill('np 17');await page.reload();assert.equal(await page.locator('#editor').inputValue(),'np 17');await page.locator('#mode-3d').click();assert.equal(await page.locator('#editor').inputValue(),examples[8].source);
 await page.locator('#mode-2d').click();await page.locator('[data-example="gwiazda"]').click();await page.locator('#history').click();assert.ok((await page.locator('.history-item').allTextContents()).some(s=>s.includes('np 17')));await page.locator('#close-dialog').click();
 console.log('PASS: camera keyboard controls, per-mode persistence and draft backups');
 await page.locator('#editor').fill('np 10\npw 90\nnp 20');await page.locator('#step').click();assert.match(await page.locator('#segment-count').innerText(),/^1 /);assert.equal(await page.locator('#execution-line').isVisible(),true);await page.locator('#run').click();await page.locator('#pause').click();assert.match(await page.locator('#execution-status').innerText(),/Wstrzymano/);await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#execution-status').textContent.includes('Rysunek gotowy'));
 await page.locator('#reset').click();assert.match(await page.locator('#segment-count').innerText(),/^0 /);
 await page.locator('#editor').fill('np 10\nnp 2 / 0');await page.keyboard.press('Control+Enter');await page.waitForFunction(()=>!document.querySelector('#error-panel').hidden);assert.equal(await page.locator('#inline-error').isVisible(),true);assert.match(await page.locator('#error-panel').innerText(),/Wiersz 2, kolumna 4/);assert.match(await page.locator('#segment-count').innerText(),/^1 /);
 await page.locator('#editor').fill('np 10\nnieznane');await page.locator('#run').click();assert.match(await page.locator('#segment-count').innerText(),/^0 /);
 console.log('PASS: run, step, pause, resume, reset, shortcuts and both error phases');
 for(const c of challenges){await page.locator('.nav-item[data-page="challenges"]').click();await page.locator(`[data-challenge="${c.id}"]`).click();await page.locator('#editor').fill('np 1');await page.locator('#check-challenge').click();assert.equal(await page.locator('#challenge-result').getAttribute('class'),'fail-result');await page.locator('#editor').fill(c.solution);await page.locator('#check-challenge').click();assert.equal(await page.locator('#challenge-result').getAttribute('class'),'pass-result')}
 await page.reload();await page.locator('.nav-item[data-page="challenges"]').click();assert.match(await page.locator('.progress-pill').innerText(),/6 \/ 6/);
 console.log('PASS: all 6 challenges, rejection reasons and persisted progress');
 await page.locator('.nav-item[data-page="reference"]').click();assert.equal(await page.locator('.command-entry').count(),22);await page.locator('a[href="#ref-limits"]').click();
 await page.locator('.nav-item[data-page="examples"]').click();assert.equal(await page.locator('.examples-grid .example-card').count(),13);await page.locator('[data-filter="3d"]').click();assert.equal(await page.locator('.examples-grid .example-card:visible').count(),6);
 await page.locator('.nav-item[data-page="studio"]').click();await page.locator('#file-input').setInputFiles({name:'proba.logo',mimeType:'text/plain',buffer:Buffer.from('kolor "#AABBCC"\nnp 42')});await page.waitForFunction(()=>document.querySelector('#editor').value==='kolor "#AABBCC"\nnp 42');assert.equal(await page.locator('#editor').inputValue(),'kolor "#AABBCC"\nnp 42');
 const fileWait=page.waitForEvent('download');await page.locator('#save-file').click();assert.match((await fileWait).suggestedFilename(),/\.logo$/);
 const pngWait=page.waitForEvent('download');await page.locator('#export').click();assert.match((await pngWait).suggestedFilename(),/\.png$/);
 await page.locator('#share').click();const link=await page.locator('#share-link').inputValue();await page.locator('#close-dialog').click();await page.goto(link);await page.waitForFunction(()=>window.logomocja);await page.waitForFunction(()=>document.querySelector('#execution-status').textContent.includes('Rysunek gotowy'));assert.equal(await page.locator('#editor').inputValue(),'kolor "#AABBCC"\nnp 42');
 await page.locator('#editor').fill('np 21');assert.equal(await page.evaluate(()=>location.hash),'');await page.reload();assert.equal(await page.locator('#editor').inputValue(),'np 21');
 console.log('PASS: reference, library filters, file import/export, PNG, permalink autorun and edited-link persistence');
 await page.evaluate(e=>logomocja.open(e.source,e.mode),examples[0]);await page.screenshot({path:'/tmp/logomocja-desktop.png',fullPage:true});
 await page.locator('#theme').click();await page.locator('#theme').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');await page.waitForTimeout(200);await page.screenshot({path:'/tmp/logomocja-dark.png',fullPage:true});await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.locator('#theme').click();
 for(const width of [390,320,768]){await page.setViewportSize({width,height:844});await page.waitForTimeout(120);assert.ok(await page.evaluate(()=>document.body.scrollWidth<=innerWidth),`overflow at ${width}`);for(const id of ['run','step','pause','reset','mode-2d','mode-3d']){const rect=await page.locator('#'+id).boundingBox();assert.ok(rect.x>=16&&rect.x+rect.width<=width-16,`clipped ${id} at ${width}`)}if(width===390)await page.screenshot({path:'/tmp/logomocja-mobile.png',fullPage:true});for(const section of ['examples','challenges','reference','studio']){await page.locator(`.nav-item[data-page="${section}"]`).click();assert.ok(await page.evaluate(()=>document.body.scrollWidth<=innerWidth),`overflow at ${width} in ${section}`)}}
 await context.setOffline(true);await page.locator('[data-example="rozeta"]').click();await page.locator('#run').click();await page.locator('#pause').click();assert.match(await page.locator('#execution-status').innerText(),/Wstrzymano/);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);console.log('PASS: theme persistence, phone/tablet layouts, offline interaction; no browser errors or external requests');
}finally{await browser.close()}
