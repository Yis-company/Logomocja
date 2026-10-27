const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/view3d-C7MqPp_J.js","assets/three-CS99BcJM.js"])))=>i.map(i=>d[i]);
import{a as e,c as t,i as n,n as r,o as i,r as a,s as o,t as s}from"./index-C8Ujrx_G.js";var c=/^[+-]?(?:\d+\.?\d*|\.\d+)$/,l=/^"#[0-9a-fA-F]{6}"$/,u=/(;.*$)|("[^"\s]*"?)|([[\],])|(\s+)|([^\s[\],;"]+)/g;function d(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function f(e){let n=e.toLowerCase();return c.test(e)?`num`:o.has(n)||t.has(n)||n===`ma:`?`kw`:i.has(n)?`cmd`:e.startsWith(`:`)&&e.length>1?`param`:`ident`}function p(e){let t=[];u.lastIndex=0;let n;for(;(n=u.exec(e))!==null;)n[1]===void 0?n[2]===void 0?n[3]===void 0?n[4]===void 0?n[5]!==void 0&&t.push([n[5],f(n[5])]):t.push([n[4],``]):t.push([n[3],`bracket`]):t.push([n[2],l.test(n[2])?`color`:`badcolor`]):t.push([n[1],`comment`]),n[0].length===0&&u.lastIndex++;return t}function m(e,t,n,r){let i=[],a=0,o=t+Math.max(n,1);for(let[n,s]of e){let e=a,c=a+n.length;if(a=c,c<=t||e>=o){i.push([n,s]);continue}let l=Math.max(e,t),u=Math.min(c,o);l>e&&i.push([n.slice(0,l-e),s]),i.push([n.slice(l-e,u-e),`${s} ${r}`.trim()]),u<c&&i.push([n.slice(u-e),s])}return a<t?(i.push([` `.repeat(t-a),``]),i.push([` `,r])):a===t&&i.push([` `,r]),i}function h(e,t){let n=e.split(`
`),r=new Map;for(let e of t){let t=r.get(e.line)??[];t.push(e),r.set(e.line,t)}let i=[];for(let e=0;e<n.length;e++){let t=p(n[e]),a=r.get(e+1);if(a)for(let e of a)t=m(t,e.column-1,e.length,e.cls);let o=``;for(let[e,n]of t){let t=d(e);if(n===`color`){let n=e.slice(1,8).toLowerCase();o+=`<span class="color"><i class="swatch" style="background:${n}"></i>${t}</span>`}else o+=n?`<span class="${n}">${t}</span>`:t}i.push(o)}return i.join(`
`)}var g=class{opts;root;gutter;pre;code;textarea;marks=[];lineCount=0;constructor(e,t){this.opts=t,this.root=e,e.classList.add(`editor`),e.innerHTML=`
      <div class="editor-gutter" aria-hidden="true"><div class="editor-gutter-inner"></div></div>
      <div class="editor-body">
        <pre class="editor-highlight" aria-hidden="true"><code></code></pre>
        <textarea class="editor-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Program w języku Logo"></textarea>
      </div>`,this.gutter=e.querySelector(`.editor-gutter-inner`),this.pre=e.querySelector(`.editor-highlight`),this.code=this.pre.querySelector(`code`),this.textarea=e.querySelector(`textarea`),this.textarea.addEventListener(`input`,()=>{this.marks=[],this.render(),this.opts.onChange(this.textarea.value)}),this.textarea.addEventListener(`scroll`,()=>this.syncScroll()),this.textarea.addEventListener(`keydown`,e=>this.onKeyDown(e)),this.render()}get value(){return this.textarea.value}set value(e){this.textarea.value=e,this.marks=[],this.render(),this.textarea.scrollTop=0,this.textarea.scrollLeft=0,this.syncScroll()}focus(){this.textarea.focus()}setMarks(e){this.marks=e,this.render()}goTo(e,t){let n=this.textarea.value.split(`
`),r=0;for(let t=0;t<e-1&&t<n.length;t++)r+=n[t].length+1;r+=Math.max(0,t-1),r=Math.min(r,this.textarea.value.length),this.textarea.focus(),this.textarea.setSelectionRange(r,r),this.revealLine(e)}revealLine(e){let t=parseFloat(getComputedStyle(this.textarea).lineHeight)||20,n=(e-1)*t,r=this.textarea,i=t*2;n<r.scrollTop+i?r.scrollTop=Math.max(0,n-i):n+t>r.scrollTop+r.clientHeight-i&&(r.scrollTop=n-r.clientHeight+i+t),this.syncScroll()}onKeyDown(e){let t=this.textarea;if(e.key===`Enter`&&(e.ctrlKey||e.metaKey))e.preventDefault(),this.opts.onRun();else if(e.key===`Tab`&&!e.ctrlKey&&!e.metaKey&&!e.altKey)e.preventDefault(),this.insert(`  `);else if(e.key===`Enter`&&!e.shiftKey&&!e.altKey){let n=t.selectionStart,r=t.value.lastIndexOf(`
`,n-1)+1,i=/^[ \t]*/.exec(t.value.slice(r,n))?.[0]??``;i&&(e.preventDefault(),this.insert(`
`+i))}}insert(e){let t=this.textarea,n=t.selectionStart,r=t.selectionEnd;typeof t.setRangeText==`function`?t.setRangeText(e,n,r,`end`):(t.value=t.value.slice(0,n)+e+t.value.slice(r),t.selectionStart=t.selectionEnd=n+e.length),t.dispatchEvent(new Event(`input`,{bubbles:!0}))}render(){let e=this.textarea.value;this.code.innerHTML=h(e,this.marks)+`
`;let t=e.split(`
`).length;if(t!==this.lineCount){this.lineCount=t;let e=``;for(let n=1;n<=t;n++)e+=`<span>${n}</span>`;this.gutter.innerHTML=e}let n=new Set(this.marks.map(e=>e.line)),r=this.gutter.children;for(let e=0;e<r.length;e++){let t=e+1,i=r[e],a=this.marks.find(e=>e.line===t);i.className=n.has(t)&&a?`ln-${a.cls}`:``}this.syncScroll()}syncScroll(){let{scrollTop:e,scrollLeft:t}=this.textarea;this.pre.style.transform=`translate(${-t}px, ${-e}px)`,this.gutter.style.transform=`translateY(${-e}px)`}},_=[{id:`kwadrat`,title:`Kwadrat`,mode:`2d`,source:`; Żółw zaczyna na środku, zwrócony w górę.
; np – naprzód, pw – w prawo (w stopniach)

powtórz 4 [
  np 120
  pw 90
]
`},{id:`gwiazda`,title:`Gwiazda`,mode:`2d`,source:`; Pięcioramienna gwiazda: pięć kroków i obroty o 144°.

kolor "#d9480f"
grubość 5
powtórz 5 [np 200 pw 144]
`},{id:`rozeta`,title:`Rozeta`,mode:`2d`,source:`; Kwadrat obracany o 10° – klasyczna rozeta.

oto kwadrat ma: bok
  powtórz 4 [np bok pw 90]
już

kolor "#1c7ed6"
grubość 2
powtórz 36 [
  kwadrat 120
  pw 10
]
`},{id:`kwiat`,title:`Kwiat`,mode:`2d`,source:`; Procedury z parametrami: płatek z dwóch łuków,
; a kwiat to płatki obracane dookoła.

oto łuk ma: krok, kąt
  powtórz 12 [np krok pw kąt]
już

oto płatek ma: krok
  łuk krok 5
  pw 120
  łuk krok 5
  pw 120
już

oto kwiat ma: ile, krok
  powtórz ile [płatek krok pw 30]
już

kolor "#e8590c"
grubość 3
kwiat 12 20

; łodyga
kolor "#2b8a3e"
grubość 6
pw 180
np 260
`},{id:`domek`,title:`Domek`,mode:`2d`,source:`; Dom z dachem i oknem. „pod” podnosi pisak,
; „opu” go opuszcza – żółw może iść, nie rysując.

oto prostokąt ma: szer, wys
  powtórz 2 [np wys pw 90 np szer pw 90]
już

oto trójkąt ma: bok
  powtórz 3 [np bok pw 120]
już

; ściany
pod ws 80 lw 90 np 90 pw 90 opu
kolor "#c92a2a"
grubość 4
prostokąt 180 120

; dach
np 120 pw 90
kolor "#5c3b1e"
lw 60
trójkąt 180
pw 60 lw 90
ws 120

; okno
pod pw 90 np 40 lw 90 np 60 opu
kolor "#1971c2"
grubość 3
prostokąt 40 40
pw 90 np 20 lw 90 np 40
lw 90 np 20 ws 40

; drzwi
pod pw 90 np 50 pw 90 np 60 pw 90 opu
kolor "#5c3b1e"
grubość 4
prostokąt 36 60
`},{id:`szescian`,title:`Sześcian (3D)`,mode:`3d`,source:`; W trybie 3D żółw może unosić nos: „góra” i „dół”.
; Obróć widok myszką (lub palcem), kółkiem przybliżaj.

oto kwadrat ma: bok
  powtórz 4 [np bok pw 90]
już

oto ściana ma: bok
  kwadrat bok
  np bok
  pw 90
już

kolor "#1864ab"
grubość 4
kwadrat 100          ; podłoga
góra 90
powtórz 4 [ściana 100]   ; 4 ściany
dół 90
`},{id:`spirala3d`,title:`Sprężyna (3D)`,mode:`3d`,source:`; Mały obrót w prawo i lekko do góry w każdym kroku
; daje w przestrzeni sprężynę.

kolor "#9c36b5"
grubość 3
powtórz 240 [
  np 12
  pw 15
  góra 4
]
`},{id:`kula`,title:`Kula (3D)`,mode:`3d`,source:`; Okrąg w pionie, obracany dookoła osi – siatka kuli.

oto okrąg ma: krok
  powtórz 36 [np krok góra 10]
już

grubość 2
kolor "#099268"
powtórz 18 [
  okrąg 14
  pw 10
]
`}];function v(e){return _.find(t=>t.id===e)}var y=`
<section>
  <h3>Polecenia</h3>
  <table class="ref">
    <thead><tr><th>Polecenie</th><th>Po angielsku</th><th>Argument</th><th>Działanie</th></tr></thead>
    <tbody>
      <tr><td><code>np</code>, <code>naprzód</code></td><td><code>fd</code>, <code>forward</code></td><td>liczba</td><td>idź naprzód</td></tr>
      <tr><td><code>ws</code>, <code>wstecz</code></td><td><code>bk</code>, <code>back</code></td><td>liczba</td><td>idź wstecz</td></tr>
      <tr><td><code>pw</code>, <code>prawo</code></td><td><code>rt</code>, <code>right</code></td><td>stopnie</td><td>obróć w prawo</td></tr>
      <tr><td><code>lw</code>, <code>lewo</code></td><td><code>lt</code>, <code>left</code></td><td>stopnie</td><td>obróć w lewo</td></tr>
      <tr><td><code>pod</code>, <code>podnieś</code></td><td><code>pu</code>, <code>penup</code></td><td>—</td><td>podnieś pisak (ruch bez rysowania)</td></tr>
      <tr><td><code>opu</code>, <code>opuść</code></td><td><code>pd</code>, <code>pendown</code></td><td>—</td><td>opuść pisak</td></tr>
      <tr><td><code>kolor</code></td><td><code>color</code></td><td><code>"#rrggbb"</code></td><td>kolor pisaka</td></tr>
      <tr><td><code>grubość</code></td><td><code>width</code></td><td>1–12</td><td>grubość linii</td></tr>
      <tr><td><code>powtórz</code></td><td><code>repeat</code></td><td>liczba <code>[ … ]</code></td><td>powtórz polecenia w nawiasach</td></tr>
      <tr><td><code>góra</code></td><td><code>pitchup</code></td><td>stopnie</td><td>unieś nos żółwia (tylko 3D)</td></tr>
      <tr><td><code>dół</code></td><td><code>pitchdown</code></td><td>stopnie</td><td>opuść nos żółwia (tylko 3D)</td></tr>
    </tbody>
  </table>
  <p>Wielkość liter nie ma znaczenia, a polskie znaki można pomijać (<code>powtorz</code>, <code>gora</code>). Średnik <code>;</code> rozpoczyna komentarz do końca wiersza.</p>
</section>
<section>
  <h3>Procedury</h3>
<pre class="sample">oto kwadrat ma: bok, kąt
  powtórz 4 [np bok pw kąt]
już

kwadrat 80 90</pre>
  <p>Definicja zaczyna się od <code>oto</code> na początku wiersza i kończy słowem <code>już</code> w osobnym wierszu. Parametry wymienia się po <code>ma:</code> (dawny zapis <code>oto kwadrat :bok :kąt</code> też działa). Parametr może zastąpić każdą liczbę w treści procedury. Procedura nie może wywoływać samej siebie.</p>
</section>
<section>
  <h3>Żółw</h3>
  <p>Startuje na środku, zwrócony do góry (oś Y), z opuszczonym pisakiem w kolorze <code>"#16866a"</code> o grubości 3. W trybie 3D oś Z wychodzi z ekranu; <code>góra</code> i <code>dół</code> obracają żółwia wokół jego prawego boku.</p>
</section>
<section>
  <h3>Skróty i obsługa</h3>
  <ul>
    <li><kbd>Ctrl</kbd>+<kbd>Enter</kbd> – uruchom program</li>
    <li><kbd>Tab</kbd> – wcięcie dwoma spacjami</li>
    <li>Rysunek: przeciągnij, by przesunąć; kółko lub szczypnięcie, by przybliżyć; dwuklik dopasowuje widok (2D)</li>
    <li>W 3D: lewy przycisk obraca, prawy (lub dwa palce) przesuwa, kółko przybliża</li>
  </ul>
</section>
<section>
  <h3>Ograniczenia</h3>
  <p>Program ma najwyżej 50 000 znaków i 10 000 słów; nawiasy i wywołania zagnieżdżają się do 32 poziomów; wykonuje się najwyżej 10 000 operacji i rysuje 10 000 odcinków; współrzędne mieszczą się w ±100 000.</p>
</section>
`,b=`logomocja.`;function x(){try{let e=window.localStorage,t=`${b}probe`;return e.setItem(t,`1`),e.removeItem(t),e}catch{return null}}var S=x();function C(e){try{return S?.getItem(b+e)??null}catch{return null}}function w(e,t){try{S?.setItem(b+e,t)}catch{}}function T(e,t){if(e.length===0&&!t)return null;let n=[1/0,1/0,1/0],r=[-1/0,-1/0,-1/0],i=e=>{for(let t=0;t<3;t++)e[t]<n[t]&&(n[t]=e[t]),e[t]>r[t]&&(r[t]=e[t])};for(let t of e)i(t.from),i(t.to);if(t&&i(t.position),e.length===0)for(let e=0;e<3;e++)n[e]=n[e]-50,r[e]=r[e]+50;return{min:n,max:r}}var E=class{element;onUserInteraction=null;ctx;segments=[];turtle=null;center={x:0,y:0};scale=1;grid=!0;dirty=!0;visible=!0;raf=0;width=0;height=0;dpr=1;pointers=new Map;pinchStart=null;observer;constructor(e){this.element=document.createElement(`canvas`),this.element.className=`stage-2d`,this.element.setAttribute(`aria-label`,`Rysunek żółwia (2D)`),e.appendChild(this.element),this.ctx=this.element.getContext(`2d`),this.observer=new ResizeObserver(()=>this.resize()),this.observer.observe(e),this.bindPointer(),this.resize(),this.loop()}setSegments(e){this.segments=e,this.dirty=!0}invalidate(){this.dirty=!0}setTurtle(e){this.turtle=e,this.dirty=!0}setGrid(e){this.grid=e,this.dirty=!0}setVisible(e){this.visible=e,this.element.style.display=e?``:`none`,e&&(this.resize(),this.dirty=!0)}fit(){let e=T(this.segments,this.turtle);if(!e||this.width===0){this.center={x:0,y:0},this.scale=1,this.dirty=!0;return}let t=Math.max(e.max[0]-e.min[0],1e-6),n=Math.max(e.max[1]-e.min[1],1e-6),r=(this.width-96)/t,i=(this.height-96)/n;this.scale=Math.min(r,i,2.5),this.scale=Math.max(this.scale,.01),this.center={x:(e.min[0]+e.max[0])/2,y:(e.min[1]+e.max[1])/2},this.dirty=!0}dispose(){cancelAnimationFrame(this.raf),this.observer.disconnect(),this.element.remove()}bindPointer(){let e=this.element;e.addEventListener(`pointerdown`,t=>{if(e.setPointerCapture(t.pointerId),this.pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),this.pointers.size===2){let[e,t]=[...this.pointers.values()];this.pinchStart={dist:Math.hypot(e.x-t.x,e.y-t.y),scale:this.scale,mid:{x:(e.x+t.x)/2,y:(e.y+t.y)/2},center:{...this.center}}}}),e.addEventListener(`pointermove`,t=>{let n=this.pointers.get(t.pointerId);if(!n)return;let r={x:t.clientX,y:t.clientY};if(this.pointers.size===1&&(this.center.x-=(r.x-n.x)/this.scale,this.center.y+=(r.y-n.y)/this.scale,this.dirty=!0,this.onUserInteraction?.()),this.pointers.set(t.pointerId,r),this.pointers.size===2&&this.pinchStart){let[t,n]=[...this.pointers.values()],r=Math.hypot(t.x-n.x,t.y-n.y),i={x:(t.x+n.x)/2,y:(t.y+n.y)/2},a=this.pinchStart,o=D(a.scale*r/Math.max(a.dist,1)),s=e.getBoundingClientRect(),c=a.center.x+(a.mid.x-s.left-this.width/2)/a.scale,l=a.center.y-(a.mid.y-s.top-this.height/2)/a.scale;this.scale=o,this.center.x=c-(i.x-s.left-this.width/2)/o,this.center.y=l+(i.y-s.top-this.height/2)/o,this.dirty=!0,this.onUserInteraction?.()}});let t=e=>{this.pointers.delete(e.pointerId),this.pointers.size<2&&(this.pinchStart=null)};e.addEventListener(`pointerup`,t),e.addEventListener(`pointercancel`,t),e.addEventListener(`wheel`,t=>{t.preventDefault();let n=Math.exp(-t.deltaY*(t.deltaMode===1?.05:.0015)),r=e.getBoundingClientRect();this.zoomAt(t.clientX-r.left,t.clientY-r.top,n),this.onUserInteraction?.()},{passive:!1}),e.addEventListener(`dblclick`,()=>{this.fit()})}zoomAt(e,t,n){let r=D(this.scale*n),i=this.center.x+(e-this.width/2)/this.scale,a=this.center.y-(t-this.height/2)/this.scale;this.scale=r,this.center.x=i-(e-this.width/2)/r,this.center.y=a+(t-this.height/2)/r,this.dirty=!0}resize(){let e=this.element.parentElement?.getBoundingClientRect();e&&(this.width=Math.max(1,Math.floor(e.width)),this.height=Math.max(1,Math.floor(e.height)),this.dpr=Math.min(window.devicePixelRatio||1,3),this.element.width=Math.floor(this.width*this.dpr),this.element.height=Math.floor(this.height*this.dpr),this.element.style.width=`${this.width}px`,this.element.style.height=`${this.height}px`,this.dirty=!0)}loop(){this.raf=requestAnimationFrame(()=>this.loop()),this.dirty&&this.visible&&(this.dirty=!1,this.draw())}toScreen(e,t){return[this.width/2+(e-this.center.x)*this.scale,this.height/2-(t-this.center.y)*this.scale]}draw(){let e=this.ctx;e.setTransform(this.dpr,0,0,this.dpr,0,0),e.clearRect(0,0,this.width,this.height),this.grid&&this.drawGrid(),this.drawSegments(),this.turtle&&this.drawTurtle(this.turtle)}drawGrid(){let e=this.ctx,t=50/this.scale,n=10**Math.floor(Math.log10(t)),r=n;for(let e of[1,2,5,10])if(n*e>=t){r=n*e;break}let i=this.center.x-this.width/2/this.scale,a=this.center.x+this.width/2/this.scale,o=this.center.y-this.height/2/this.scale,s=this.center.y+this.height/2/this.scale;e.lineWidth=1,e.strokeStyle=`rgba(31, 42, 36, 0.08)`,e.beginPath();for(let t=Math.ceil(i/r)*r;t<=a;t+=r){let[n]=this.toScreen(t,0);e.moveTo(Math.round(n)+.5,0),e.lineTo(Math.round(n)+.5,this.height)}for(let t=Math.ceil(o/r)*r;t<=s;t+=r){let[,n]=this.toScreen(0,t);e.moveTo(0,Math.round(n)+.5),e.lineTo(this.width,Math.round(n)+.5)}e.stroke(),e.strokeStyle=`rgba(31, 42, 36, 0.22)`,e.beginPath();let[c,l]=this.toScreen(0,0);e.moveTo(Math.round(c)+.5,0),e.lineTo(Math.round(c)+.5,this.height),e.moveTo(0,Math.round(l)+.5),e.lineTo(this.width,Math.round(l)+.5),e.stroke(),e.fillStyle=`rgba(31, 42, 36, 0.45)`,e.font=`11px system-ui, sans-serif`,e.textAlign=`right`,e.fillText(`siatka: ${O(r)}`,this.width-10,this.height-10)}drawSegments(){let e=this.ctx;e.lineCap=`round`,e.lineJoin=`round`;let t=``,n=-1,r=!1,i=NaN,a=NaN;for(let o of this.segments){let s=Math.max(o.width*this.scale,.75);(o.color!==t||s!==n)&&(r&&e.stroke(),e.strokeStyle=o.color,e.lineWidth=s,t=o.color,n=s,e.beginPath(),r=!0,i=NaN,a=NaN);let[c,l]=this.toScreen(o.from[0],o.from[1]),[u,d]=this.toScreen(o.to[0],o.to[1]);(c!==i||l!==a)&&e.moveTo(c,l),e.lineTo(u,d),i=u,a=d}r&&e.stroke()}drawTurtle(e){let t=this.ctx,[n,r]=this.toScreen(e.position[0],e.position[1]),i=Math.atan2(e.heading[0],e.heading[1]);t.save(),t.translate(n,r),t.rotate(i),t.lineWidth=1.5,t.strokeStyle=`#0b4d3a`,t.fillStyle=e.penDown?`#2fa37f`:`#b7d9cb`;for(let[e,n]of[[-7,-5],[7,-5],[-7,6],[7,6]])t.beginPath(),t.ellipse(e*1,n*1,3.2,2.2,0,0,Math.PI*2),t.fill(),t.stroke();t.beginPath(),t.moveTo(-1.5,8),t.lineTo(0,13),t.lineTo(1.5,8),t.closePath(),t.fill(),t.stroke(),t.beginPath(),t.ellipse(0,-11,3.6,4.4,0,0,Math.PI*2),t.fill(),t.stroke(),t.beginPath(),t.ellipse(0,0,8,9.5,0,0,Math.PI*2),t.fill(),t.stroke(),t.strokeStyle=`rgba(11, 77, 58, 0.45)`,t.lineWidth=1,t.beginPath(),t.ellipse(0,0,4,5,0,0,Math.PI*2),t.stroke(),t.fillStyle=`#0b4d3a`,t.beginPath(),t.arc(-1.5,-12.5,.8,0,Math.PI*2),t.arc(1.5,-12.5,.8,0,Math.PI*2),t.fill(),t.restore()}};function D(e){return Math.min(200,Math.max(.005,e))}function O(e){return Number.isInteger(e)?e.toLocaleString(`pl-PL`):e.toLocaleString(`pl-PL`,{maximumFractionDigits:3})}var k=[3,8,20,50,120,300,800,2e3,6e3,1/0],A=5,j={idle:`Gotowy`,running:`Rysuje…`,paused:`Wstrzymano`,finished:`Zakończono`,error:`Błąd`,stale:`Zmieniono`};function M(e){let t=document.getElementById(e);if(!t)throw Error(`Brak elementu #${e}`);return t}function N(e){let t=Math.round(e*10)/10;return(Object.is(t,-0)?0:t).toLocaleString(`pl-PL`,{maximumFractionDigits:1})}var P=class{mode=`2d`;editor;stage2d;stage3d=null;stage;runner=null;state=`idle`;segments=[];turtle=e();speedIndex=A;autoFit=!0;grid=!0;rafId=0;lastTime=0;acc=0;lastLoaded=``;el={mode2d:M(`mode-2d`),mode3d:M(`mode-3d`),examples:M(`examples`),helpBtn:M(`help-btn`),help:M(`help`),helpBody:M(`help-body`),helpClose:M(`help-close`),run:M(`btn-run`),pause:M(`btn-pause`),pauseLabel:M(`btn-pause-label`),step:M(`btn-step`),reset:M(`btn-reset`),speed:M(`speed`),message:M(`message`),stage:M(`stage`),fit:M(`btn-fit`),gridBtn:M(`btn-grid`),notice:M(`stage-notice`),stState:M(`st-state`),stPos:M(`st-pos`),stHeading:M(`st-heading`),stSegments:M(`st-segments`),stOps:M(`st-ops`),splitter:M(`splitter`),workspace:M(`workspace`)};constructor(){this.editor=new g(M(`editor`),{onChange:e=>this.onSourceChanged(e),onRun:()=>this.run()}),this.stage2d=new E(this.el.stage),this.stage=this.stage2d,this.stage.onUserInteraction=()=>this.autoFit=!1,this.stage.setSegments(this.segments),this.stage.setTurtle(this.turtle),this.fillExamples(),this.el.helpBody.innerHTML=y,this.bindControls(),this.bindSplitter(),this.updateControls(),this.updateStatus(),this.init()}async init(){await this.restore(),this.editor.value.trim()&&this.run()}fillExamples(){for(let e of _){let t=document.createElement(`option`);t.value=e.id,t.textContent=e.title,this.el.examples.appendChild(t)}}bindControls(){let e=this.el;e.run.addEventListener(`click`,()=>this.run()),e.pause.addEventListener(`click`,()=>this.state===`running`?this.pause():this.resume()),e.step.addEventListener(`click`,()=>this.stepOnce()),e.reset.addEventListener(`click`,()=>this.reset()),e.speed.addEventListener(`input`,()=>{this.speedIndex=Number(e.speed.value)-1,w(`speed`,e.speed.value),this.updateSpeedLabel()}),e.mode2d.addEventListener(`click`,()=>void this.setMode(`2d`)),e.mode3d.addEventListener(`click`,()=>void this.setMode(`3d`)),e.examples.addEventListener(`change`,()=>{let t=e.examples.value;e.examples.value=``,t&&this.loadExample(t)}),e.helpBtn.addEventListener(`click`,()=>e.help.showModal()),e.helpClose.addEventListener(`click`,()=>e.help.close()),e.help.addEventListener(`click`,t=>{t.target===e.help&&e.help.close()}),e.fit.addEventListener(`click`,()=>{this.autoFit=!0,this.stage.fit()}),e.gridBtn.addEventListener(`click`,()=>this.setGrid(!this.grid)),document.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key===`Enter`&&(e.preventDefault(),this.run())})}bindSplitter(){let e=this.el.splitter,t=this.el.workspace,n=!1,r=()=>window.matchMedia(`(min-width: 801px)`).matches;e.addEventListener(`pointerdown`,t=>{n=!0,e.setPointerCapture(t.pointerId),e.classList.add(`dragging`),t.preventDefault()}),e.addEventListener(`pointermove`,e=>{if(!n)return;let i=t.getBoundingClientRect();if(r()){let n=Math.min(75,Math.max(25,(e.clientX-i.left)/i.width*100));t.style.setProperty(`--editor-width`,`${n}%`),w(`split-x`,n.toFixed(1))}else{let n=Math.min(75,Math.max(20,(e.clientY-i.top)/i.height*100));t.style.setProperty(`--stage-height`,`${n}%`),w(`split-y`,n.toFixed(1))}});let i=()=>{n=!1,e.classList.remove(`dragging`)};e.addEventListener(`pointerup`,i),e.addEventListener(`pointercancel`,i);let a=C(`split-x`);a&&t.style.setProperty(`--editor-width`,`${a}%`);let o=C(`split-y`);o&&t.style.setProperty(`--stage-height`,`${o}%`)}async restore(){let e=C(`draft`);if(e!==null)this.editor.value=e;else{let e=_[0];this.editor.value=e.source,this.lastLoaded=e.source}let t=Number(C(`speed`));t>=1&&t<=k.length?(this.speedIndex=t-1,this.el.speed.value=String(t)):this.el.speed.value=`6`,this.updateSpeedLabel(),this.setGrid(C(`grid`)!==`0`),C(`mode`)===`3d`&&await this.setMode(`3d`)}async setMode(e){if(e===this.mode&&(e===`2d`||this.stage3d))return;if(e===`3d`&&!this.stage3d){this.el.mode3d.classList.add(`loading`),this.showNotice(`Ładowanie trybu 3D…`,`info`);try{let{View3D:e}=await s(async()=>{let{View3D:e}=await import(`./view3d-C7MqPp_J.js`);return{View3D:e}},__vite__mapDeps([0,1])),t=new e(this.el.stage);t.setVisible(!1),this.stage3d=t}catch(e){this.el.mode3d.classList.remove(`loading`);let t=e instanceof Error?e.message:String(e);this.showNotice(`Tryb 3D jest wyłączony. ${t}`,`warn`,!0),this.el.mode3d.setAttribute(`aria-disabled`,`true`),this.el.mode3d.title=`Tryb 3D niedostępny: ${t}`,w(`mode`,`2d`);return}this.el.mode3d.classList.remove(`loading`),this.hideNotice()}this.mode=e,w(`mode`,e);let t=e===`3d`?this.stage3d:this.stage2d;t!==this.stage&&(this.stage.setVisible(!1),this.stage=t,this.stage.onUserInteraction=()=>this.autoFit=!1,this.stage.setSegments(this.segments),this.stage.setTurtle(this.turtle),this.stage.setGrid(this.grid),this.stage.setVisible(!0),this.stage.fit(),this.autoFit=!0),this.el.mode2d.setAttribute(`aria-pressed`,String(e===`2d`)),this.el.mode3d.setAttribute(`aria-pressed`,String(e===`3d`)),document.body.dataset.mode=e,this.state===`error`&&this.runner===null&&(this.clearMessage(),this.editor.setMarks([]),this.setState(`idle`)),this.updateStatus()}setGrid(e){this.grid=e,this.stage2d.setGrid(e),this.stage3d?.setGrid(e),this.el.gridBtn.setAttribute(`aria-pressed`,String(e)),w(`grid`,e?`1`:`0`)}async loadExample(e){let t=v(e);if(!t)return;let n=this.editor.value;(n.trim()===``||n===this.lastLoaded||_.some(e=>e.source===n)||window.confirm(`Zastąpić bieżący program przykładem? Twoje zmiany zostaną utracone.`))&&(this.stopLoop(),this.runner=null,t.mode!==this.mode&&await this.setMode(t.mode),this.editor.value=t.source,this.lastLoaded=t.source,w(`draft`,t.source),this.autoFit=!0,this.run())}onSourceChanged(e){w(`draft`,e),this.runner?(this.stopLoop(),this.runner=null,this.setState(`stale`),this.showMessage(`Program został zmieniony. Uruchom go ponownie, aby zobaczyć nowy rysunek.`,`info`)):(this.state===`error`||this.state===`finished`)&&(this.clearMessage(),this.setState(`idle`))}start(){this.stopLoop(),this.runner=null,this.clearMessage(),this.editor.setMarks([]);let t=r(this.editor.value,this.mode);return t.error?(this.segments=[],this.turtle=e(),this.stage.setSegments(this.segments),this.stage.setTurtle(this.turtle),this.showError(t.error),this.setState(`error`),!1):(this.runner=new a(t.program),this.segments=this.runner.segments,this.turtle=this.runner.turtle,this.stage.setSegments(this.segments),this.stage.setTurtle(this.turtle),!0)}run(){this.start()&&(this.setState(`running`),k[this.speedIndex]===1/0?(this.doSteps(1/0),this.afterSteps()):this.startLoop())}pause(){this.state===`running`&&(this.stopLoop(),this.setState(`paused`))}resume(){this.state===`paused`&&this.runner&&(this.setState(`running`),this.startLoop())}stepOnce(){this.state===`running`&&this.pause(),(this.runner||this.start())&&(this.setState(`paused`),this.doSteps(1),this.afterSteps())}reset(){this.stopLoop(),this.runner=null,this.segments=[],this.turtle=e(),this.stage.setSegments(this.segments),this.stage.setTurtle(this.turtle),this.editor.setMarks([]),this.clearMessage(),this.autoFit=!0,this.stage.fit(),this.setState(`idle`)}startLoop(){this.stopLoop(),this.lastTime=performance.now(),this.acc=0;let e=t=>{this.rafId=requestAnimationFrame(e);let n=Math.min(.25,(t-this.lastTime)/1e3);this.lastTime=t;let r=k[this.speedIndex],i;r===1/0?i=1/0:(this.acc+=n*r,i=Math.floor(this.acc),this.acc-=i),i>0&&this.doSteps(i),this.afterSteps()};this.rafId=requestAnimationFrame(e)}stopLoop(){this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=0}lastEvent=null;doSteps(e){let t=this.runner;if(t)for(let n=0;n<e&&!t.finished;n++){let e=t.step();if(this.lastEvent=e,e.type===`done`||e.type===`error`)break}}afterSteps(){let e=this.runner;if(!e)return;this.stage.invalidate();let t=this.lastEvent;if(e.finished)this.stopLoop(),e.error?(this.showError(e.error,!0),this.setState(`error`)):(this.editor.setMarks([]),this.setState(`finished`),this.showMessage(e.segments.length===0?`Program zakończył się, nic nie rysując.`:`Gotowe: narysowano ${e.segments.length.toLocaleString(`pl-PL`)} ${F(e.segments.length)}.`,`ok`)),this.autoFit&&this.stage.fit();else if(t&&`stmt`in t){let e=t.stmt.pos,n={line:e.line,column:e.column,length:e.length,cls:`active`};this.editor.setMarks([n]),this.state===`paused`&&this.editor.revealLine(e.line)}this.updateStatus()}setState(e){this.state=e,this.updateControls(),this.updateStatus()}updateControls(){let e=this.el,t=this.state===`running`,n=this.state===`paused`;e.pause.disabled=!(t||n),e.pauseLabel.textContent=n?`Wznów`:`Wstrzymaj`,e.pause.classList.toggle(`is-paused`,n),e.run.classList.toggle(`is-running`,t),e.stState.textContent=j[this.state],e.stState.dataset.state=this.state}updateStatus(){let e=this.turtle,t=this.mode===`3d`?`${N(e.position[0])}, ${N(e.position[1])}, ${N(e.position[2])}`:`${N(e.position[0])}, ${N(e.position[1])}`;this.el.stPos.textContent=t,this.el.stHeading.textContent=`${N(n(e))}°`,this.el.stSegments.textContent=this.segments.length.toLocaleString(`pl-PL`),this.el.stOps.textContent=(this.runner?.operations??0).toLocaleString(`pl-PL`)}updateSpeedLabel(){let e=k[this.speedIndex];this.el.speed.title=e===1/0?`Szybkość: natychmiast`:`Szybkość: ${e} kroków na sekundę`,this.el.speed.setAttribute(`aria-valuetext`,e===1/0?`natychmiast`:`${e} kroków na sekundę`)}showError(e,t=!1){let n={line:e.line,column:e.column,length:e.length,cls:`err`};this.editor.setMarks([n]);let r=`wiersz ${e.line}, kolumna ${e.column}`,i=t?`Błąd podczas rysowania`:`Błąd w programie`;this.el.message.innerHTML=``;let a=document.createElement(`div`);a.className=`msg msg-error`,a.setAttribute(`role`,`alert`);let o=document.createElement(`strong`);o.textContent=`${i} (${r}): `,a.appendChild(o),a.appendChild(document.createTextNode(e.message+` `));let s=document.createElement(`button`);s.type=`button`,s.className=`link`,s.textContent=`Pokaż miejsce`,s.addEventListener(`click`,()=>this.editor.goTo(e.line,e.column)),a.appendChild(s),this.el.message.appendChild(a)}showMessage(e,t){this.el.message.innerHTML=``;let n=document.createElement(`div`);n.className=`msg msg-${t}`,n.textContent=e,this.el.message.appendChild(n)}clearMessage(){this.el.message.innerHTML=``}showNotice(e,t,n=!1){this.el.notice.textContent=e,this.el.notice.dataset.kind=t,this.el.notice.hidden=!1,this.el.notice.dataset.persistent=n?`1`:``}hideNotice(){this.el.notice.hidden=!0}};function F(e){let t=e%10,n=e%100;return e===1?`odcinek`:t>=2&&t<=4&&!(n>=12&&n<=14)?`odcinki`:`odcinków`}export{P as App,T as t};