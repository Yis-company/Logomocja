import '@fontsource-variable/manrope';
import '@fontsource/dm-mono/400.css';
import './style.css';
import { Execution, run, aliases, type Mode, type Result } from './interpreter';
import { examples, type Example } from './examples';
import { DrawingView, drawThumbnail } from './view';
import { challenges, checkChallenge, type Challenge } from './challenges';
import { icon, turtleLogo } from './icons';
import { referenceHTML } from './reference';
const $=<T extends HTMLElement=HTMLElement>(selector:string)=>document.querySelector<T>(selector)!;
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const store={ get<T>(key:string,fallback:T):T {try{return JSON.parse(localStorage.getItem('logomocja.'+key)||'null')??fallback;}catch{return fallback;}}, set(key:string,value:unknown){try{localStorage.setItem('logomocja.'+key,JSON.stringify(value));}catch{toast('Brak miejsca w pamięci przeglądarki. Pobierz szkic jako plik .logo.');}} };
let mode:Mode=store.get('mode','2d'); if(!['2d','3d'].includes(mode))mode='2d';
const drafts:Record<Mode,string>={ '2d':store.get('draft.2d',examples[2].source), '3d':store.get('draft.3d',examples[8].source) };
let source=drafts[mode], execution:Execution|null=null, running=false, frame=0, lastTime=0, credit=0, currentPage='studio';
let fileName=examples.find(e=>e.source===source)?.id||'moj-program';
let activeChallenge:Challenge|null=null;
let theme=store.get<string>('theme','system');
const completed=store.get<string[]>('progress',[]);
type Archive={source:string;mode:Mode;date:string;name:string};
let archive=store.get<Archive[]>('archive',[]);
const app=$('#app');
app.innerHTML=`
<header class="site-header"><a href="#" class="brand" aria-label="Logomocja, studio"><span class="brand-mark">${turtleLogo}</span><span>logomocja<span class="brand-dot">.</span></span></a><nav class="main-nav" aria-label="Nawigacja główna"><button class="nav-item active" data-page="studio">Studio</button><button class="nav-item" data-page="examples">Przykłady</button><button class="nav-item" data-page="challenges">Wyzwania<span class="nav-count">6</span></button><button class="nav-item" data-page="reference">Język</button></nav><div class="header-end"><span class="offline"><span></span>Bez konta. Bez pośpiechu.</span><button class="icon-button theme-button" id="theme" aria-label="Motyw: systemowy" title="Motyw: systemowy">${icon('monitor',19)}</button></div></header>
<main>
<section id="page-studio" class="page">
<div class="hero"><div><div class="eyebrow"><span class="tiny-line"></span> TWOJA WYOBRAŹNIA MA KIERUNEK</div><h1>Od jednej kreski <span>do czegoś więcej.</span></h1></div><p>Kilka poleceń. Nieskończenie wiele możliwości.<br>Rysuj, odkrywaj i myśl po swojemu.</p></div>
<div class="studio-heading"><div class="workspace-title">${icon('code',20)}<h2>Twój warsztat</h2><span class="workspace-tag">Miejsce na eksperymenty</span></div><div class="mode-switch" role="group" aria-label="Wymiar rysunku"><button data-mode="2d" aria-pressed="true">${icon('layers',16)}Płaszczyzna <b>2D</b></button><button data-mode="3d" aria-pressed="false">${icon('cube',16)}Przestrzeń <b>3D</b></button></div></div>
<div id="challenge-banner" class="challenge-banner" hidden></div>
<div class="workspace">
<section class="editor-panel" aria-label="Edytor programu"><div class="panel-header"><div class="file-label">${icon('file',15)}<span id="filename">rozeta.logo</span><span id="saved-dot" class="saved-dot" title="Zapisano lokalnie"></span></div><div class="file-actions"><span class="local-label">Zapisano lokalnie</span><div class="dropdown-wrap"><button class="icon-button" id="file-menu-button" aria-label="Pliki i zapisane szkice" aria-expanded="false" title="Pliki i szkice">${icon('folder',17)}${icon('down',12)}</button><div class="dropdown" id="file-menu" hidden><button id="new-program">${icon('plus')}Nowy szkic</button><button id="open-file">${icon('upload')}Otwórz plik .logo</button><button id="download-code">${icon('download')}Pobierz program .logo</button><button id="show-archive">${icon('folder')}Zapisane szkice <span id="archive-count"></span></button></div></div></div></div>
<div class="editor-body"><div class="line-numbers" aria-hidden="true"><div id="line-numbers"></div></div><div class="code-area"><pre id="highlight" aria-hidden="true"></pre><textarea id="editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Kod programu Logo" aria-describedby="editor-help" maxlength="50001"></textarea></div></div>
<div class="editor-meta"><span id="cursor">Wiersz 1, kol. 1</span><span>LOGO <span class="meta-dot">·</span> UTF-8</span></div>
<div class="execution-controls"><div class="execution-buttons"><button id="run" class="button primary" title="Uruchom (Ctrl/⌘ + Enter)">${icon('play',16)}<span>Uruchom</span><kbd>⌘ ↵</kbd></button><button id="step" class="icon-button control-button" title="Jeden krok (Alt + →)" aria-label="Wykonaj jeden krok">${icon('step',20)}</button><button id="pause" class="icon-button control-button" title="Pauza (Alt + P)" aria-label="Wstrzymaj wykonanie" disabled>${icon('pause',19)}</button><span class="control-divider"></span><button id="reset" class="icon-button control-button" title="Reset (Alt + R)" aria-label="Zresetuj rysunek i żółwia">${icon('reset',19)}</button></div><div class="speed-control"><label for="speed">Tempo</label><input id="speed" type="range" min="1" max="100" value="75" aria-label="Tempo animacji"/><span id="speed-label">75%</span></div></div>
</section>
<section class="canvas-panel" aria-label="Podgląd rysunku"><div class="panel-header canvas-header"><div class="canvas-caption"><span class="green-dot"></span><span id="view-name">PŁASZCZYZNA 2D</span></div><div class="drawing-actions"><button id="export-png" class="text-button" title="Pobierz rysunek jako PNG">${icon('download',15)}<span>Eksportuj</span></button><button id="share" class="text-button" title="Utwórz link do programu">${icon('share',15)}<span>Udostępnij</span></button></div></div>
<div id="drawing" class="drawing"><div class="canvas-watermark">${turtleLogo}<span>tutaj pomysł staje się rysunkiem</span></div><div class="canvas-hint" id="canvas-hint">Przeciągnij, aby przesunąć <span>·</span> przewiń, aby przybliżyć</div></div>
<div class="canvas-footer"><div class="coordinates"><span id="coordinates">x <b>0</b><span>y <b>0</b></span></span><span id="pen-state" class="pen-state"><i></i> Pisak w dół</span></div><div class="view-controls"><button class="icon-button" id="grid" aria-label="Pokaż lub ukryj siatkę" aria-pressed="true" title="Siatka">${icon('grid',16)}</button><span class="control-divider"></span><button class="icon-button" id="zoom-out" aria-label="Oddal" title="Oddal">${icon('minus',17)}</button><span id="zoom-label">100%</span><button class="icon-button" id="zoom-in" aria-label="Przybliż" title="Przybliż">${icon('plus',17)}</button><span class="control-divider"></span><button class="icon-button" id="fit" aria-label="Dopasuj cały rysunek i zresetuj kamerę" title="Dopasuj rysunek / reset kamery">${icon('fit',17)}</button></div></div></section>
<div class="status-bar" role="status" aria-live="polite"><div id="status-main">${icon('check',14)}<span>Gotowe na Twój pomysł.</span></div><div id="status-detail">0 odcinków <span>·</span> 2D</div></div>
</div>
<div id="error-panel" class="error-panel" role="alert" hidden></div>
<div class="below-workspace"><span id="editor-help">${icon('info',14)} Zacznij od <code>np 100</code>. Reszta przyjdzie z ciekawością.</span><button class="quiet-button" id="shortcut-help">${icon('keyboard',16)} Skróty klawiszowe</button></div>
<section class="inspiration"><div class="section-title"><div><span class="eyebrow">DOBRY PUNKT WYJŚCIA</span><h2>Mały kod, wielkie odkrycia<span>.</span></h2></div><button class="text-button view-all" data-page="examples">Wszystkie przykłady ${icon('arrow',17)}</button></div><div class="quick-examples" id="quick-examples"></div></section>
</section>
<section id="page-examples" class="page library-page" hidden><div class="page-title"><span class="eyebrow">ODKRYWAJ, ZMIENIAJ, TWÓRZ</span><h1>Pomysły na <span>pierwszą kreskę.</span></h1><p>13 gotowych programów. Otwórz, uruchom i zmień coś po swojemu.</p></div><div class="library-toolbar"><div class="filter-switch" role="group" aria-label="Filtr przykładów"><button class="active" data-filter="all">Wszystkie <span>13</span></button><button data-filter="2d">Płaszczyzna 2D</button><button data-filter="3d">Przestrzeń 3D</button></div><span class="library-note">${icon('folder',15)} Twój poprzedni szkic zachowamy automatycznie.</span></div><div id="example-grid" class="example-grid"></div></section>
<section id="page-challenges" class="page" hidden><div class="page-title"><span class="eyebrow">UCZ SIĘ PRZEZ ODKRYWANIE</span><h1>Małe wyzwania. <span>Duża satysfakcja.</span></h1><p>Masz cel, żółwia i własny pomysł na rozwiązanie. Kod należy do Ciebie.</p></div><div class="progress-card"><div>${icon('trophy',24)}<span>Twoja ścieżka odkrywcy</span><b id="progress-text"></b></div><progress id="progress" max="6" value="0" aria-label="Ukończone wyzwania"></progress><p>Postępy zapisują się tylko w tej przeglądarce.</p></div><div id="challenge-grid" class="challenge-grid"></div></section>
<section id="page-reference" class="page reference-page" hidden>${referenceHTML}</section>
</main><footer class="site-footer"><span>${turtleLogo}<b>logomocja.</b><span>Klasyczna idea. Nowa przestrzeń.</span></span><span>Działa lokalnie. Zostaje Twoje. ${icon('leaf',14)}</span></footer>
<dialog id="dialog" aria-labelledby="dialog-title"><div class="dialog-top"><h2 id="dialog-title"></h2><button class="icon-button" id="close-dialog" aria-label="Zamknij okno">${icon('close',20)}</button></div><div id="dialog-content"></div></dialog>
<div class="toast" id="toast" role="status" aria-live="polite" hidden></div><input type="file" id="file-input" accept=".logo,text/plain" hidden />`;
const editor=$<HTMLTextAreaElement>('#editor');editor.value=source;
const view=new DrawingView($('#drawing'));
function toast(message:string,action?:{label:string;run:()=>void}) {
  const el=$('#toast');if(!el)return;el.innerHTML=`${icon('check',17)}<span>${esc(message)}</span>${action?`<button>${esc(action.label)}</button>`:''}<button class="toast-close" aria-label="Zamknij powiadomienie">${icon('close',16)}</button>`;el.hidden=false;
  el.querySelector('.toast-close')?.addEventListener('click',()=>el.hidden=true);if(action)el.querySelector('button')?.addEventListener('click',()=>{action.run();el.hidden=true;});
  clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el.hidden=true,action?12000:5500);
}
let toastTimer=0;
function dialog(title:string,html:string) {$('#dialog-title').textContent=title;$('#dialog-content').innerHTML=html;$<HTMLDialogElement>('#dialog').showModal();}
$('#close-dialog').onclick=()=>$<HTMLDialogElement>('#dialog').close();
$('#dialog').addEventListener('click',e=>{if(e.target===$('#dialog')){const r=$('#dialog').getBoundingClientRect();const p=e as MouseEvent;if(p.clientX<r.left||p.clientX>r.right||p.clientY<r.top||p.clientY>r.bottom)$<HTMLDialogElement>('#dialog').close();}});
function applyTheme() { const dark=theme==='dark'||(theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';view.setTheme(dark);const label=theme==='system'?'systemowy':theme==='dark'?'ciemny':'jasny';$('#theme').innerHTML=icon(theme==='system'?'monitor':theme==='dark'?'moon':'sun',19);$('#theme').setAttribute('aria-label',`Motyw: ${label}. Kliknij, aby zmienić.`);$('#theme').title=`Motyw: ${label}`; }
$('#theme').onclick=()=>{theme=theme==='system'?'light':theme==='light'?'dark':'system';store.set('theme',theme);applyTheme();};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(theme==='system')applyTheme();});
function setPage(page:string) {currentPage=page;document.querySelectorAll<HTMLElement>('.page').forEach(el=>el.hidden=el.id!==`page-${page}`);document.querySelectorAll('.nav-item').forEach(el=>{el.classList.toggle('active',el.getAttribute('data-page')===page);if(el.getAttribute('data-page')===page)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});if(page==='examples')renderExamples();if(page==='challenges')renderChallenges();if(page==='studio')requestAnimationFrame(()=>view.render());window.scrollTo({top:0,behavior:'instant'});}
document.querySelectorAll<HTMLButtonElement>('[data-page]').forEach(button=>button.onclick=()=>setPage(button.dataset.page!));
$('.brand').onclick=e=>{e.preventDefault();setPage('studio');};
function paintCode() {
  const error=execution?.error;const current=execution&&!execution.done?execution.current?.line:null;
  const lines=source.split('\n');
  $('#line-numbers').innerHTML=lines.map((_,i)=>`<div class="${error?.line===i+1?'error-number':current===i+1?'active-number':''}">${i+1}</div>`).join('');
  $('#highlight').innerHTML=lines.map((line,i)=> {
    const tokens=line.match(/;[^\n]*|"[^"\n]*(?:"|$)|:?[\p{L}_][\p{L}\p{N}_]*:?|(?:\d+(?:\.\d+)?|\.\d+)|[\[\]()]|[+\-*/<>=]+|./gu)||[];
    const text=tokens.map(token=>{let cls='';if(token.startsWith(';'))cls='syn-comment';else if(token.startsWith('"'))cls='syn-string';else if(/^\d|^\.\d/.test(token))cls='syn-number';else if(/^[\[\]()]$/.test(token))cls='syn-bracket';else if(aliases.has(token.toLocaleLowerCase('pl')))cls='syn-command';else if(/^:?[\p{L}_]/u.test(token))cls='syn-name';else if(/^[+\-*/<>=]+$/.test(token))cls='syn-operator';return cls?`<span class="${cls}">${esc(token)}</span>`:esc(token);}).join('');
    const isError=error?.line===i+1;
    return `<span class="code-line ${isError?'has-error':current===i+1?'executing':''}">${text||' '}${isError?`<span class="error-pin" style="left:${error.column-1}ch" title="${esc(error.message)}">⌃</span><span class="inline-error"> ← ${esc(error.message)}</span>`:''}</span>`;
  }).join('');
  editor.setAttribute('aria-invalid',String(!!error));syncScroll();
}
function syncScroll() {$('#highlight').style.transform=`translate(${-editor.scrollLeft}px, ${-editor.scrollTop}px)`;$('#line-numbers').style.transform=`translateY(${-editor.scrollTop}px)`;}
editor.addEventListener('scroll',syncScroll);
function cursor() {const before=editor.value.slice(0,editor.selectionStart),line=before.split('\n').length,col=before.length-before.lastIndexOf('\n');$('#cursor').textContent=`Wiersz ${line}, kol. ${col}`;}
editor.addEventListener('click',cursor);editor.addEventListener('keyup',cursor);editor.addEventListener('select',cursor);
function saveDraft() {drafts[mode]=source;store.set(`draft.${mode}`,source);store.set('mode',mode);$('#filename').textContent=`${fileName}.logo`;}
function edited() {if(location.hash.startsWith('#program='))history.replaceState(null,'',location.pathname+location.search);cancelAnimationFrame(frame);running=false;execution=null;source=editor.value;saveDraft();paintCode();cursor();$('#error-panel').hidden=true;status('Program zmieniony. Uruchom, aby zobaczyć efekt.','edit');buttons();}
editor.addEventListener('input',edited);
editor.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const start=editor.selectionStart,end=editor.selectionEnd;editor.setRangeText('  ',start,end,'end');edited();}});
function segmentCount(n:number) {return `${n} ${n===1?'odcinek':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'odcinki':'odcinków'}`;}
function status(message:string,kind='ready') {$('#status-main').innerHTML=`${icon(kind==='error'?'alert':kind==='running'?'play':kind==='paused'?'pause':kind==='edit'?'code':'check',14)}<span>${esc(message)}</span>`;$('.status-bar').classList.toggle('error-status',kind==='error');$('#status-detail').innerHTML=`${segmentCount(execution?.segments.length||0)} <span>·</span> ${mode.toUpperCase()}`;}
function buttons() {const paused=execution&&!execution.done&&!running;$('#run').innerHTML=`${icon('play',16)}<span>${paused?'Wznów':'Uruchom'}</span><kbd>${navigator.platform.includes('Mac')?'⌘':'Ctrl'} ↵</kbd>`;$<HTMLButtonElement>('#pause').disabled=!running;$('#run').classList.toggle('is-running',running);}
function update(fit=false) {
  if(!execution)return;view.setData(execution.segments,execution.turtle);if(fit)view.fit();paintCode();buttons();
  const t=execution.turtle,format=(n:number)=>Math.abs(n)<.005?'0':String(Math.round(n*10)/10);
  $('#coordinates').innerHTML=`x <b>${format(t.position[0])}</b><span>y <b>${format(t.position[1])}</b></span>${mode==='3d'?`<span>z <b>${format(t.position[2])}</b></span>`:''}`;
  $('#pen-state').innerHTML=`<i style="background:${t.color}"></i> Pisak ${t.pen?'w dół':'w górze'}`;
  $('.canvas-watermark').classList.toggle('faded',execution.segments.length>0);
  if(execution.error) {
    const e=execution.error;status(`Wiersz ${e.line}, kolumna ${e.column} — ${e.message}`,'error');$('#error-panel').innerHTML=`${icon('alert',19)}<div><strong>Wiersz ${e.line}, kolumna ${e.column}</strong><p>${esc(e.message)}</p></div><button class="text-button" id="go-error">Pokaż w kodzie ${icon('arrow',15)}</button>`;$('#error-panel').hidden=false;
    $('#go-error').onclick=()=>{editor.focus();const lines=source.split('\n');const pos=lines.slice(0,e.line-1).reduce((n,l)=>n+l.length+1,0)+e.column-1;editor.setSelectionRange(pos,pos+1);editor.scrollTop=Math.max(0,(e.line-3)*26);cursor();};
  } else {$('#error-panel').hidden=true;if(execution.done)status('Rysunek gotowy. Co zmienisz tym razem?');else status(running?'Żółw rysuje…':'Wstrzymano. Każdy krok ma znaczenie.',running?'running':'paused');}
}
function fresh() {cancelAnimationFrame(frame);running=false;execution=new Execution(source,mode);credit=0;lastTime=0;update();}
function animate(time:number) {
  if(!running || !execution)return;
  if(!lastTime)lastTime=time;const speed=Number($<HTMLInputElement>('#speed').value);const rate=Math.pow(10,speed/33)/1.6;
  credit+=Math.min(100,time-lastTime)*rate/1000;lastTime=time;
  let count=Math.min(400,Math.floor(credit));credit-=count;
  while(count-->0&&!execution.done)execution.step();
  if(execution.done){running=false;update();return;}update();frame=requestAnimationFrame(animate);
}
function start() {if(running)return;if(!execution||execution.done)fresh();if(execution!.done){update();return;}running=true;lastTime=0;buttons();frame=requestAnimationFrame(animate);}
function pause() {if(!running){if(execution&&!execution.done)start();return;}running=false;cancelAnimationFrame(frame);update();}
function step() {if(running){running=false;cancelAnimationFrame(frame);}if(!execution||execution.done)fresh();execution!.step();update();}
function reset() {cancelAnimationFrame(frame);running=false;execution=new Execution('',mode);execution.finish();update(true);status('Przestrzeń gotowa na nowy pomysł.');}
$('#run').onclick=start;$('#pause').onclick=pause;$('#step').onclick=step;$('#reset').onclick=reset;
$('#speed').addEventListener('input',()=>{$('#speed-label').textContent=`${$<HTMLInputElement>('#speed').value}%`;});
function switchMode(next:Mode) {if(next===mode)return;if(location.hash.startsWith('#program='))history.replaceState(null,'',location.pathname+location.search);saveDraft();cancelAnimationFrame(frame);running=false;mode=next;source=drafts[mode];editor.value=source;fileName=examples.find(e=>e.source===source)?.id||'moj-program';execution=null;activeChallenge=null;updateChallengeBanner();syncMode();saveDraft();immediate();}
function syncMode() {document.querySelectorAll<HTMLElement>('[data-mode]').forEach(el=>{el.classList.toggle('active',el.dataset.mode===mode);el.setAttribute('aria-pressed',String(el.dataset.mode===mode));});$('#view-name').textContent=mode==='2d'?'PŁASZCZYZNA 2D':'PRZESTRZEŃ 3D';$('#canvas-hint').innerHTML=mode==='2d'?'Przeciągnij, aby przesunąć <span>·</span> przewiń, aby przybliżyć':'Przeciągnij, aby obrócić <span>·</span> dwa palce przesuwają';view.setMode(mode);$('#zoom-label').textContent=mode==='2d'?`${view.zoomPercent}%`:'3D';}
document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(b=>b.onclick=()=>switchMode(b.dataset.mode as Mode));
function immediate():Result {cancelAnimationFrame(frame);running=false;execution=new Execution(source,mode);const result=execution.finish();update(true);return result;}
function archiveDraft() {if(!source.trim())return;const item={source,mode,date:new Date().toISOString(),name:fileName};if(archive[0]?.source!==source||archive[0]?.mode!==mode){archive.unshift(item);archive=archive.slice(0,30);store.set('archive',archive);}$('#archive-count').textContent=String(archive.length);}
function loadSource(text:string,next:Mode,name='moj-program',archiveOld=true,preserveLink=false) {
  if(!preserveLink && location.hash.startsWith('#program='))history.replaceState(null,'',location.pathname+location.search);
  const previous={source,mode,name:fileName};
  if(archiveOld){archiveDraft();if(next!==mode&&drafts[next]!==text&&drafts[next].trim()){archive.unshift({source:drafts[next],mode:next,date:new Date().toISOString(),name:'moj-program'});archive=archive.slice(0,30);store.set('archive',archive);}}
  cancelAnimationFrame(frame);running=false;mode=next;source=text;fileName=name;editor.value=source;editor.scrollTop=0;editor.scrollLeft=0;execution=null;syncMode();saveDraft();paintCode();setPage('studio');
  if(archiveOld&&previous.source!==text)toast('Poprzedni szkic zapisany w menu plików.',{label:'Przywróć',run:()=>{loadSource(previous.source,previous.mode,previous.name);immediate();}});
}
function loadExample(example:Example) {activeChallenge=null;updateChallengeBanner();loadSource(example.source,example.mode,example.id);immediate();}
function exampleCard(example:Example,compact=false) {return `<button class="example-card ${compact?'compact':''}" data-example="${example.id}"><div class="example-preview"><canvas data-preview="${example.id}" aria-hidden="true"></canvas><span class="dimension-tag">${example.mode.toUpperCase()}</span></div><div class="example-info"><div><span class="card-category">${esc(example.category)}</span><h3>${esc(example.name)}</h3></div><span class="card-arrow">${icon('arrow',18)}</span></div><p>${esc(example.description)}</p></button>`;}
function previewExamples(container:HTMLElement) {container.querySelectorAll<HTMLCanvasElement>('canvas[data-preview]').forEach(canvas=>{const e=examples.find(e=>e.id===canvas.dataset.preview)!;drawThumbnail(canvas,run(e.source,e.mode).segments,e.mode);});container.querySelectorAll<HTMLButtonElement>('[data-example]').forEach(b=>b.onclick=()=>loadExample(examples.find(e=>e.id===b.dataset.example)!));}
function renderQuickExamples() {const container=$('#quick-examples');container.innerHTML=['kwadrat','gwiazda','rozeta','helisa'].map(id=>exampleCard(examples.find(e=>e.id===id)!,true)).join('');requestAnimationFrame(()=>previewExamples(container));}
let exampleFilter='all';
function renderExamples() {const container=$('#example-grid');container.innerHTML=examples.filter(e=>exampleFilter==='all'||e.mode===exampleFilter).map(e=>exampleCard(e)).join('');requestAnimationFrame(()=>previewExamples(container));}
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b=>b.onclick=()=>{exampleFilter=b.dataset.filter!;document.querySelectorAll('[data-filter]').forEach(el=>el.classList.toggle('active',el===b));renderExamples();});
function renderChallenges() {
  $('#progress-text').textContent=`${completed.length} / 6`;$<HTMLProgressElement>('#progress').value=completed.length;
  const container=$('#challenge-grid');container.innerHTML=challenges.map(c=>`<article class="challenge-card ${completed.includes(c.id)?'completed':''}"><div class="challenge-card-top"><span class="card-category">${esc(c.level)}</span><span class="challenge-check">${completed.includes(c.id)?icon('check',18):c.mode.toUpperCase()}</span></div><canvas data-challenge-preview="${c.id}" aria-label="Wzór: ${esc(c.title)}"></canvas><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><button class="button ${completed.includes(c.id)?'secondary':'outline'}" data-challenge="${c.id}">${completed.includes(c.id)?'Spróbuj ponownie':'Podejmij wyzwanie'} ${icon('arrow',16)}</button></article>`).join('');
  requestAnimationFrame(()=>container.querySelectorAll<HTMLCanvasElement>('canvas').forEach(canvas=>{const c=challenges.find(c=>c.id===canvas.dataset.challengePreview)!;drawThumbnail(canvas,run(c.expected,c.mode).segments,c.mode);}));
  container.querySelectorAll<HTMLButtonElement>('[data-challenge]').forEach(b=>b.onclick=()=>beginChallenge(challenges.find(c=>c.id===b.dataset.challenge)!));
}
function beginChallenge(c:Challenge) {activeChallenge=c;loadSource(c.starter,c.mode,`wyzwanie-${c.id}`);reset();updateChallengeBanner();}
function updateChallengeBanner() {
  const banner=$('#challenge-banner');banner.hidden=!activeChallenge;if(!activeChallenge)return;const c=activeChallenge;
  banner.innerHTML=`<div class="challenge-banner-title">${icon('trophy',22)}<div><strong>${esc(c.title)}</strong><p>${esc(c.description)}</p></div></div><div class="challenge-banner-actions"><button class="text-button" id="hint">Podpowiedź</button><button class="button primary" id="check-challenge">${icon('check',17)}Sprawdź</button><button class="icon-button" id="close-challenge" aria-label="Zamknij wyzwanie">${icon('close',18)}</button></div><div id="challenge-result" role="status" aria-live="polite" hidden></div>`;
  $('#hint').onclick=()=>{const el=$('#challenge-result');el.hidden=false;el.className='challenge-result hint';el.textContent=c.hint;};
  $('#check-challenge').onclick=()=>{immediate();const result=checkChallenge(c,source);const el=$('#challenge-result');el.hidden=false;el.className=`challenge-result ${result.pass?'pass':'fail'}`;el.innerHTML=`${icon(result.pass?'check':'info',18)}<span>${esc(result.reason)}</span>`;if(result.pass&&!completed.includes(c.id)){completed.push(c.id);store.set('progress',completed);}};
  $('#close-challenge').onclick=()=>{activeChallenge=null;updateChallengeBanner();};
}
$('#file-menu-button').onclick=()=>{const menu=$('#file-menu');menu.hidden=!menu.hidden;$('#file-menu-button').setAttribute('aria-expanded',String(!menu.hidden));};
$('#file-menu').addEventListener('click',e=>{if((e.target as Element).closest('button')){$('#file-menu').hidden=true;$('#file-menu-button').setAttribute('aria-expanded','false');}});
document.addEventListener('click',e=>{if(!(e.target as Element).closest('.dropdown-wrap')){$('#file-menu').hidden=true;$('#file-menu-button').setAttribute('aria-expanded','false');}});
$('#new-program').onclick=()=>{loadSource('; Nowy pomysł zaczyna się tutaj.\n',mode);reset();editor.focus();};
function download(blob:Blob,name:string) {const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#download-code').onclick=()=>{download(new Blob([source],{type:'text/plain;charset=utf-8'}),`${fileName}.logo`);toast('Program zapisany jako plik .logo.');};
$('#open-file').onclick=()=>$<HTMLInputElement>('#file-input').click();
$<HTMLInputElement>('#file-input').onchange=async e=>{const input=e.target as HTMLInputElement,file=input.files?.[0];if(!file)return;if(file.size>200000){toast('Plik jest zbyt duży. Limit programu to 50 000 znaków.');return;}const text=await file.text();activeChallenge=null;updateChallengeBanner();loadSource(text.replace(/^\uFEFF/,''),mode,file.name.replace(/\.logo$/i,''));immediate();input.value='';};
$('#show-archive').onclick=()=>{
  dialog('Twoje zapisane szkice',`<p class="dialog-description">Przed otwarciem innego programu zachowujemy poprzedni szkic. Ostatnie 30 kopii zostaje w tej przeglądarce.</p>${archive.length?`<div class="archive-list">${archive.map((a,i)=>`<button data-archive="${i}">${icon('file',20)}<span><strong>${esc(a.name)}.logo <small>${a.mode.toUpperCase()}</small></strong><span>${new Date(a.date).toLocaleString('pl-PL')} · ${a.source.split('\n').length} wierszy</span></span>${icon('arrow',18)}</button>`).join('')}</div>`:'<p>Tu pojawią się Twoje szkice po otwarciu innego programu.</p>'}`);
  document.querySelectorAll<HTMLButtonElement>('[data-archive]').forEach(b=>b.onclick=()=>{const a=archive[Number(b.dataset.archive)];$<HTMLDialogElement>('#dialog').close();activeChallenge=null;updateChallengeBanner();loadSource(a.source,a.mode,a.name);immediate();});
};
$('#export-png').onclick=async()=>{try{download(await view.exportPNG(),`${fileName}-${mode}.png`);toast('Rysunek zapisany jako PNG.');}catch(e){toast((e as Error).message);}};
function encodeProgram() {const bytes=new TextEncoder().encode(JSON.stringify({s:source,m:mode}));let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function decodeProgram(value:string):{s:string;m:Mode} {const binary=atob(value.replace(/-/g,'+').replace(/_/g,'/'));const parsed=JSON.parse(new TextDecoder().decode(Uint8Array.from(binary,c=>c.charCodeAt(0))));if(typeof parsed.s!=='string'||!['2d','3d'].includes(parsed.m)||parsed.s.length>50000)throw new Error('Niepoprawny link');return parsed;}
$('#share').onclick=()=>{const url=new URL(location.href);url.hash=`program=${encodeProgram()}`;dialog('Pomysłami warto się dzielić.',`<p class="dialog-description">Ten link zawiera Twój kod i tryb rysowania. Każdy, kto go otworzy, od razu zobaczy rysunek. Nie wysyłamy programu na żaden serwer.</p><label class="field-label" for="share-url">Link do Twojego programu</label><div class="share-field"><input id="share-url" readonly value="${esc(url.href)}"/><button class="button primary" id="copy-link">Kopiuj link ${icon('share',16)}</button></div><p class="small-note">Możesz też pobrać program z menu plików lub wyeksportować rysunek do PNG.</p>`);$('#copy-link').onclick=async()=>{const input=$<HTMLInputElement>('#share-url');try{await navigator.clipboard.writeText(input.value);$('#copy-link').textContent='Skopiowano ✓';}catch{input.select();const copied=document.execCommand('copy');$('#copy-link').textContent=copied?'Skopiowano ✓':'Zaznaczono — użyj Ctrl+C';}};};
$('#zoom-in').onclick=()=>view.zoom(1.2);$('#zoom-out').onclick=()=>view.zoom(1/1.2);$('#fit').onclick=()=>view.fit();$('#grid').onclick=()=>{view.toggleGrid();$('#grid').setAttribute('aria-pressed',String(view.gridVisible));};
view.onChange=()=>{$('#zoom-label').textContent=mode==='2d'?`${view.zoomPercent}%`:'3D';};
$('#shortcut-help').onclick=()=>dialog('Skróty, które dają swobodę.',`<div class="shortcut-list"><span><kbd>Ctrl / ⌘ + Enter</kbd> Uruchom lub wznów</span><span><kbd>Alt + →</kbd> Wykonaj jeden krok</span><span><kbd>Alt + P</kbd> Pauza lub wznów</span><span><kbd>Alt + R</kbd> Reset rysunku</span><span><kbd>Tab</kbd> Wcięcie w edytorze</span><span><kbd>Esc</kbd> Zamknij okno</span></div><p class="dialog-description">Na płótnie: strzałki przesuwają widok, + i − zmieniają powiększenie, a 0 dopasowuje rysunek.</p>`);
document.addEventListener('keydown',e=>{if($<HTMLDialogElement>('#dialog').open)return;if(e.key==='Escape'){$('#file-menu').hidden=true;$('#file-menu-button').setAttribute('aria-expanded','false');return;}if(currentPage!=='studio')return;if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();start();}if(e.altKey&&e.key==='ArrowRight'){e.preventDefault();step();}if(e.altKey&&e.key.toLowerCase()==='p'){e.preventDefault();pause();}if(e.altKey&&e.key.toLowerCase()==='r'){e.preventDefault();reset();}});
async function openProgram(text:string,next:Mode,preserveLink=false):Promise<Result> {if(typeof text!=='string'||!['2d','3d'].includes(next))return {segments:[],error:{message:'Niepoprawny program lub tryb.',line:1,column:1}};activeChallenge=null;updateChallengeBanner();loadSource(text,next,'udostepniony-program',true,preserveLink);const result=immediate();await new Promise<void>(resolve=>requestAnimationFrame(()=>{view.fit();view.render();requestAnimationFrame(()=>resolve());}));return result;}
declare global {interface Window {logomocja:{version:string;run:typeof run;open:typeof openProgram}}}
window.logomocja={version:'1.0.0',run,open:openProgram};
applyTheme();syncMode();paintCode();saveDraft();renderQuickExamples();
requestAnimationFrame(()=>{if(location.hash.startsWith('#program=')){try{const p=decodeProgram(location.hash.slice(9));void openProgram(p.s,p.m,true);}catch{immediate();toast('Nie udało się odczytać programu z linku. Twój szkic jest bezpieczny.');}}else {immediate();if(location.hash.startsWith('#jezyk-')){setPage('reference');requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}}});
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#program=')){try{const p=decodeProgram(location.hash.slice(9));void openProgram(p.s,p.m,true);}catch{toast('Nieprawidłowy link do programu.');}}});
window.addEventListener('resize',()=>{if(currentPage==='examples')previewExamples($('#example-grid'));previewExamples($('#quick-examples'));});
