import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {examples} from '../src/examples';
test.beforeEach(async({page})=>{await page.goto('/');await page.waitForFunction(()=>!!window.logomocja);await expect(page.locator('#status-main')).toContainText('gotowy');});
test('API stays independent of UI; open fits 2D and real WebGL 3D',async({page})=>{
  const initial=await page.locator('#editor').inputValue();
  const result=await page.evaluate(()=>window.logomocja.run('np 5 np 1 / 0','2d'));
  expect(result.segments).toHaveLength(1);expect(result.error).toMatchObject({line:1,column:9});expect(await page.locator('#editor').inputValue()).toBe(initial);
  for(const e of examples){const result=await page.evaluate(({s,m})=>window.logomocja.open(s,m),{s:e.source,m:e.mode});expect(result.error,e.name).toBeNull();expect(result.segments.length).toBeGreaterThan(0);}
  await expect(page.locator('.webgl-error')).toBeHidden();expect(await page.locator('#drawing canvas').count()).toBe(2);
});
test('step, resume, pause, editing cancellation and positioned errors',async({page})=>{
  await page.locator('#editor').fill('np 30\npw 90\nnp 30');await page.locator('#step').click();await expect(page.locator('#highlight .executing')).toHaveCount(1);await expect(page.locator('#coordinates')).toContainText('30');
  await page.locator('#editor').fill('powtorz 100 [np 1 pw 1]');await page.locator('#run').click();await expect(page.locator('#pause')).toBeEnabled();await page.locator('#pause').click();await expect(page.locator('#run')).toContainText('Wznów');
  await page.locator('#editor').fill('np 10\nnp 5 / 0');await page.evaluate(()=>window.logomocja.open('np 10\nnp 5 / 0','2d'));await expect(page.locator('.error-pin')).toHaveCount(1);await expect(page.locator('#error-panel')).toContainText('kolumna 4');await expect(page.locator('#status-detail')).toContainText('1 odcinek');
  await page.locator('#editor').fill('np 20');await expect(page.locator('#error-panel')).toBeHidden();await page.locator('#reset').click();await expect(page.locator('#status-detail')).toContainText('0 odcinków');await expect(page.locator('#editor')).toHaveValue('np 20');
});
test('mode drafts survive reload; loading an example archives the draft',async({page})=>{
  await page.locator('#editor').fill('; mój szkic\nnp 77');await page.locator('[data-mode="3d"]').click();await page.locator('#editor').fill('gora 90 np 88');await page.reload();await expect(page.locator('#editor')).toHaveValue('gora 90 np 88');await page.locator('[data-mode="2d"]').click();await expect(page.locator('#editor')).toHaveValue('; mój szkic\nnp 77');
  await page.locator('.main-nav [data-page="examples"]').click();await page.locator('#example-grid [data-example="gwiazda"]').click();await page.locator('#file-menu-button').click();await page.locator('#show-archive').click();await page.locator('[data-archive="0"]').click();await expect(page.locator('#editor')).toHaveValue('; mój szkic\nnp 77');
});
test('permalinks restore Unicode programs and files download',async({page,context})=>{
  const code='; żółw, łąka i słońce\nkolor "#ABCDEF"\nnp 99';await page.evaluate(s=>window.logomocja.open(s,'2d'),code);await page.locator('#share').click();const url=await page.locator('#share-url').inputValue();await page.locator('#close-dialog').click();
  const linked=await context.newPage();await linked.goto(url);await linked.waitForFunction(()=>window.logomocja);await expect(linked.locator('#editor')).toHaveValue(code);await expect(linked.locator('#status-detail')).toContainText('1 odcinek');await linked.locator('#editor').fill('np 51');await linked.reload();await expect(linked.locator('#editor')).toHaveValue('np 51');await linked.close();
  const png=page.waitForEvent('download');await page.locator('#export-png').click();expect((await png).suggestedFilename()).toMatch(/\.png$/);
  await page.locator('#file-menu-button').click();const logo=page.waitForEvent('download');await page.locator('#download-code').click();expect((await logo).suggestedFilename()).toMatch(/\.logo$/);
  await page.locator('#file-input').setInputFiles({name:'test.logo',mimeType:'text/plain',buffer:Buffer.from('np 48')});await expect(page.locator('#editor')).toHaveValue('np 48');await expect(page.locator('#status-detail')).toContainText('1 odcinek');
});
test('challenge failures explain the mismatch, success persists',async({page})=>{
  await page.locator('.main-nav [data-page="challenges"]').click();await page.locator('[data-challenge="square"]').click();await page.locator('#check-challenge').click();await expect(page.locator('#challenge-result')).toHaveClass(/fail/);await page.locator('#editor').fill('powtorz 4 [np 100 pw 90]');await page.locator('#check-challenge').click();await expect(page.locator('#challenge-result')).toHaveClass(/pass/);await page.reload();await page.locator('.main-nav [data-page="challenges"]').click();await expect(page.locator('#progress-text')).toHaveText('1 / 6');
});
test('mobile pages fit the viewport, theme persists, keyboard runs',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ['studio','examples','challenges','reference']){await page.locator(`.main-nav [data-page="${route}"]`).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);}
  await page.locator('.main-nav [data-page="studio"]').click();await page.locator('#theme').click();await page.locator('#theme').click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.locator('#editor').fill('np 9');await page.locator('#editor').press('Control+Enter');await expect(page.locator('#status-detail')).toContainText('1 odcinek');
});
test('3D failure explains WebGL and leaves 2D operational',async({browser})=>{
  const context=await browser.newContext();const page=await context.newPage();await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type.includes('webgl'))return null;return original.call(this,type,...args);} as typeof original;});
  await page.goto('/');await page.waitForFunction(()=>window.logomocja);await page.locator('[data-mode="3d"]').click();await expect(page.locator('.webgl-error')).toContainText('WebGL');await page.locator('[data-mode="2d"]').click();const result=await page.evaluate(()=>window.logomocja.open('np 10','2d'));expect(result.error).toBeNull();await expect(page.locator('.webgl-error')).toBeHidden();await context.close();
});

test('all four pages pass automated WCAG A/AA checks in both themes',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const theme of ['light','dark']) {
    await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    for(const route of ['studio','examples','challenges','reference']) {
      await page.locator(`.main-nav [data-page="${route}"]`).click();
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
      expect(result.violations,`${theme}, ${route}`).toEqual([]);
    }
  }
});
