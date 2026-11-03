import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { examples } from '../src/examples.ts';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const page=await context.newPage();await page.goto('http://localhost:5173/');await page.evaluate(()=>document.fonts.ready);
const shot=async name=>{await page.waitForTimeout(150);await page.screenshot({path:`.impeccable/review/${name}.png`,fullPage:true,animations:'disabled'})};
await shot('desktop');
await page.locator('[data-tab="challenges"]').click();await page.waitForSelector('#challenges-panel:not([hidden])');await shot('challenges');
await page.locator('[data-tab="guide"]').click();await page.waitForSelector('#guide:not([hidden])');await page.screenshot({path:'.impeccable/review/guide.png',animations:'disabled'});
await page.locator('[data-tab="studio"]').click();await page.waitForSelector('#workspace:not([hidden])');await page.locator('#theme').click();await page.locator('#theme').click();await page.locator('#toast').evaluate(e=>e.hidden=true);await shot('dark');
await page.locator('#theme').click();await page.locator('#toast').evaluate(e=>e.hidden=true);
await page.evaluate(e=>window.logomocja.open(e.source,e.mode),examples.find(e=>e.id==='szescian'));await shot('spatial');
await page.evaluate(()=>window.logomocja.open('np 50\nnp 3 / 0','2d'));await shot('error');
await page.evaluate(e=>window.logomocja.open(e.source,e.mode),examples[2]);await page.locator('#reset').click();await page.locator('#step').click();await page.locator('#step').click();await page.locator('#step').click();await page.locator('#step').focus();await page.keyboard.press('Tab');await page.locator('#toast').evaluate(e=>e.hidden=true);await shot('step-focus');
for(const width of [1280,1024,768,390,320]){const p=await browser.newPage({viewport:{width,height:width<740?844:900},reducedMotion:'reduce'});await p.goto('http://localhost:5173/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width,`overflow ${width}`);await p.screenshot({path:`.impeccable/review/${width===390?'mobile':`user-${width}`}.png`,fullPage:true,animations:'disabled'});if(width===390){await p.locator('[data-tab="challenges"]').click();await p.waitForSelector('#challenges-panel:not([hidden])');await p.screenshot({path:'.impeccable/review/mobile-challenges.png',fullPage:true,animations:'disabled'});await p.locator('[data-tab="guide"]').click();await p.waitForSelector('#guide:not([hidden])');await p.screenshot({path:'.impeccable/review/mobile-guide.png',animations:'disabled'})}await p.close()}
console.log('Final captures complete: desktop, mobile, 320/768/1024/1280, dark, 3D, error, step/focus, guide and challenges. No horizontal overflow.');await browser.close();
