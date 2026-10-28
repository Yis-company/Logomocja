(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class extends Error{line;column;constructor(e,t,n){super(e),this.line=t,this.column=n,this.name=`LogoError`}};function t(t,n){return new e(t,n.line,n.column)}var n={ops:1e4,segments:1e4,frames:32,coord:1e5,repeat:1e4},r=[0,0,0],i=[0,1,0],a=[0,0,1],o=[1,0,0];function s(e){let t=(e%360+360)%360;return t===0?1:t===90||t===270?0:t===180?-1:Math.cos(e*Math.PI/180)}function c(e){let t=(e%360+360)%360;return t===0||t===180?0:t===90?1:t===270?-1:Math.sin(e*Math.PI/180)}var l=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],u=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],d=e=>e||0,f=(e,t)=>e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2],p=class{prog;segments=[];pos=[...r];heading=[...i];up=[...a];right=[...o];pen=!0;color=`#16866a`;width=3;globals=new Map;frames=[];repeats=[];active=0;ops=0;constructor(e){this.prog=e}get turtle(){return{pos:[...this.pos],heading:[...this.heading],up:[...this.up],right:[...this.right],pen:this.pen,color:this.color,width:this.width}}*execute(){yield*this.block(this.prog.top)}*block(e){for(let t of e)if(yield t.pos,(yield*this.stmt(t))===`stop`)return`stop`;return`normal`}*stmt(e){switch(this.tick(e.pos),e.t){case`cmd`:return this.command(e),`normal`;case`stop`:return`stop`;case`let`:return this.setVar(e.name,this.value(e.value)),`normal`;case`if`:{let t=this.test(e.cond)?e.body:e.elseBody;if(!t)return`normal`;let n=yield*this.block(t);return this.tick(e.pos),n}case`repeat`:{let t=this.count(e.count);this.enter(e.pos);let n=`normal`;for(let r=1;r<=t&&(this.repeats.push(r),n=yield*this.block(e.body),this.repeats.pop(),this.tick(e.pos),n!==`stop`);r++);return this.active--,n}case`call`:{let t=this.prog.procs.get(e.proc),n=new Map;return t.params.forEach((t,r)=>n.set(t,this.value(e.args[r]))),this.enter(e.pos),this.frames.push({locals:n}),yield*this.block(t.body),this.frames.pop(),this.active--,this.tick(e.pos),`normal`}}}command(e){let n=e.args[0];switch(e.cmd){case`fd`:return this.move(this.value(n),n.pos,e.pos);case`bk`:return this.move(-this.value(n),n.pos,e.pos);case`rt`:return this.turn(this.value(n),1);case`lt`:return this.turn(this.value(n),-1);case`pitchup`:return this.pitch(this.value(n),1);case`pitchdown`:return this.pitch(this.value(n),-1);case`rollright`:return this.roll(this.value(n),1);case`rollleft`:return this.roll(this.value(n),-1);case`pu`:this.pen=!1;return;case`pd`:this.pen=!0;return;case`color`:this.color=e.color;return;case`width`:{let e=this.value(n);if(!Number.isInteger(e)||e<1||e>12)throw t(`Grubość musi być liczbą całkowitą od 1 do 12.`,n.pos);this.width=e;return}case`home`:this.pen&&!f(this.pos,r)&&this.draw(this.pos,r,e.pos),this.pos=[...r],this.heading=[...i],this.up=[...a],this.right=[...o];return;case`cs`:this.segments.length=0;return}}move(e,r,i){let a=l(this.pos,u(this.heading,e));if(a.some(e=>Math.abs(e)>n.coord))throw t(`Współrzędna poza zakresem ±${n.coord}.`,r);this.pen&&e!==0&&this.draw(this.pos,a,i),this.pos=a}draw(e,r,i){if(this.segments.length>=n.segments)throw t(`Przekroczono limit ${n.segments} odcinków.`,i);this.segments.push({from:e.map(d),to:r.map(d),color:this.color,width:this.width})}turn(e,t){let n=s(e),r=c(e)*t,i=this.heading,a=this.right;this.heading=l(u(i,n),u(a,r)),this.right=l(u(a,n),u(i,-r))}pitch(e,t){let n=s(e),r=c(e)*t,i=this.heading,a=this.up;this.heading=l(u(i,n),u(a,r)),this.up=l(u(a,n),u(i,-r))}roll(e,t){let n=s(e),r=c(e)*t,i=this.up,a=this.right;this.up=l(u(i,n),u(a,r)),this.right=l(u(a,n),u(i,-r))}tick(e){if(this.ops++,this.ops>n.ops)throw t(`Przekroczono limit ${n.ops} operacji.`,e)}enter(e){if(this.active>=n.frames)throw t(`Przekroczono limit ${n.frames} aktywnych wywołań i powtórzeń.`,e);this.active++}count(e){let r=this.value(e);if(!Number.isInteger(r)||r<0||r>n.repeat)throw t(`Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.`,e.pos);return r}test(e){let t=this.ev(e.a.e,e.a.pos),n=this.ev(e.b.e,e.b.pos);switch(e.op){case`<`:return t<n;case`>`:return t>n;case`=`:return t===n;case`<=`:return t<=n;case`>=`:return t>=n;case`<>`:return t!==n}}value(e){return this.ev(e.e,e.pos)}ev(e,n){switch(e.k){case`num`:return e.v;case`un`:return e.sign*this.ev(e.e,n);case`nrpowt`:{let e=this.repeats[this.repeats.length-1];if(e===void 0)throw t(`Wartość „nrpowt” można użyć tylko wewnątrz powtórz.`,n);return e}case`ref`:{let r=this.frames[this.frames.length-1]?.locals;if(r?.has(e.name))return r.get(e.name);if(this.globals.has(e.name))return this.globals.get(e.name);throw t(`Zmienna „${e.name}” nie ma jeszcze wartości.`,n)}case`bin`:{let r=this.ev(e.a,n),i=this.ev(e.b,n),a;switch(e.op){case`+`:a=r+i;break;case`-`:a=r-i;break;case`*`:a=r*i;break;case`/`:if(i===0)throw t(`Dzielenie przez zero.`,n);a=r/i}if(!Number.isFinite(a))throw t(`Wynik nie jest liczbą skończoną.`,n);return a}}}setVar(e,t){let n=this.frames[this.frames.length-1];n?n.locals.set(e,t):this.globals.set(e,t)}},m={fd:[`np`,`naprzod`,`naprzód`,`fd`,`forward`],bk:[`ws`,`wstecz`,`bk`,`back`],rt:[`pw`,`prawo`,`rt`,`right`],lt:[`lw`,`lewo`,`lt`,`left`],pu:[`pod`,`podnies`,`podnieś`,`pu`,`penup`],pd:[`opu`,`opusc`,`opuść`,`pd`,`pendown`],color:[`kolor`,`color`],width:[`grubosc`,`grubość`,`width`],repeat:[`powtorz`,`powtórz`,`repeat`],let:[`niech`,`let`],if:[`jeśli`,`jesli`,`if`],ifelse:[`jeżeli`,`jezeli`,`ifelse`],stop:[`stop`],home:[`dom`,`home`],cs:[`czyść`,`czysc`,`cs`,`clearscreen`],pitchup:[`gora`,`góra`,`pitchup`],pitchdown:[`dol`,`dół`,`pitchdown`],rollright:[`pp`,`przechylprawo`,`rr`,`rollright`],rollleft:[`pl`,`przechyllewo`,`rl`,`rollleft`]},h=new Map;for(let[e,t]of Object.entries(m))for(let n of t)h.set(n,e);var g=new Set([`pitchup`,`pitchdown`,`rollright`,`rollleft`]),_=new Set([`oto`,`to`]),v=new Set([`już`,`juz`,`end`]),y=new Set([`nrpowt`,`repcount`]),b=new Set([...h.keys(),..._,...v,...y]),x=32,S=1e4,C=e=>({line:e.line,column:e.column});function w(e){switch(e.k){case`num`:return e.v;case`un`:{let t=w(e.e);return t===void 0?void 0:e.sign*t}case`bin`:{let t=w(e.a),n=w(e.b);if(t===void 0||n===void 0)return;let r={"+":t+n,"-":t-n,"*":t*n,"/":n===0?NaN:t/n}[e.op];return Number.isFinite(r)?r:void 0}default:return}}var T=class{toks;mode;i=0;cur=null;repeatDepth=0;depth=0;procs=new Map;topAssigned=new Set;refs=[];constructor(e,t){this.toks=e,this.mode=t}parse(){this.collectProcs(),this.i=0;let e=this.stmts(`top`,null);for(let e of this.refs)if(!(e.proc&&(e.proc.params.includes(e.name)||e.proc.assigned.has(e.name)))&&!this.topAssigned.has(e.name))throw t(`Nieznana nazwa „${e.name}”. Użyj parametru albo najpierw przypisz wartość przez „niech”.`,e.pos);return{mode:this.mode,top:e,procs:this.procs}}lineStart(e){return e===0||this.toks[e-1].line<this.toks[e].line}header(e){let n=this.toks[e],r=e=>this.toks[e],i=e=>r(e)?.line===n.line,a=r(e+1);if(!a||!i(e+1)||a.kind!==`word`)throw t(`Oczekiwano nazwy procedury po „oto”.`,i(e+1)&&a?C(a):C(n));if(b.has(a.key))throw t(`Nazwa „${a.text}” jest zarezerwowana.`,C(a));let o=[],s=e=>{if(b.has(e.key))throw t(`Nazwa „${e.text}” jest zarezerwowana.`,C(e));if(o.includes(e.key))throw t(`Parametr „${e.text}” występuje dwa razy.`,C(e));o.push(e.key)},c=e+2;if(i(c)&&r(c).kind===`word`&&r(c).key===`ma`&&i(c+1)&&r(c+1).kind===`colon`)for(c+=2;i(c)&&r(c).kind===`word`&&(s(r(c)),c++,i(c)&&r(c).kind===`comma`);)c++;else for(;i(c)&&r(c).kind===`colon`&&i(c+1)&&r(c+1).kind===`word`;)s(r(c+1)),c+=2;if(i(c)){let e=r(c);throw t(`Nieoczekiwany symbol „${e.text}” w nagłówku procedury (oczekiwano przecinka).`,C(e))}return{name:a.key,params:o,next:c}}collectProcs(){for(let e=0;e<this.toks.length;e++){let n=this.toks[e];if(n.kind!==`word`||!_.has(n.key)||!this.lineStart(e))continue;let r=this.header(e);if(this.procs.has(r.name))throw t(`Procedura „${r.name}” jest już zdefiniowana.`,C(this.toks[e+1]));this.procs.set(r.name,{name:r.name,params:r.params,body:[],pos:C(n),assigned:new Set})}}definition(){let e=this.toks[this.i],t=this.header(this.i),n=this.procs.get(t.name);this.cur=n,this.repeatDepth=0,this.i=t.next,n.body=this.stmts(`proc`,e),this.i++,this.cur=null}stmts(e,n){let r=[];for(;;){let i=this.toks[this.i];if(!i){if(e===`bracket`)throw t(`Nie zamknięto nawiasu „[”.`,C(n));if(e===`proc`)throw t(`Brakuje słowa „już” kończącego procedurę „${this.cur.name}”.`,C(n));return r}if(i.kind===`rb`){if(e===`bracket`)return r;throw t(`Nieoczekiwany nawias „]”.`,C(i))}if(i.kind===`word`){if(v.has(i.key)){if(e===`proc`)return r;throw t(`Nieoczekiwane „już”: nie ma otwartej procedury.`,C(i))}if(_.has(i.key)){if(e===`top`&&this.lineStart(this.i)){this.definition();continue}throw t(e===`proc`?`Definicja procedury nie może znajdować się wewnątrz innej procedury (czy brakuje „już”?).`:this.lineStart(this.i)?`Definicja procedury nie może znajdować się wewnątrz bloku.`:`Definicja procedury musi zaczynać się od nowego wiersza.`,C(i))}}r.push(this.statement())}}statement(){let e=this.toks[this.i];if(e.kind!==`word`)throw t(`Oczekiwano polecenia, a znaleziono ${e.kind===`num`?`liczbę „${e.text}”`:`„${e.text}”`}.`,C(e));if(e.key===`nrpowt`||e.key===`repcount`)throw t(`„${e.text}” jest wartością, a nie poleceniem.`,C(e));let n=h.get(e.key);if(n)return this.command(n,e);if(this.procs.has(e.key))return this.call(e);throw t(`Nieznane polecenie „${e.text}”.`,C(e))}command(e,n){let r=C(n);if(g.has(e)&&this.mode===`2d`)throw t(`Polecenie „${n.text}” działa tylko w trybie 3D.`,r);this.i++;let i=()=>({t:`cmd`,pos:r,cmd:e,args:[this.arg(n)],color:``});switch(e){case`stop`:return{t:`stop`,pos:r};case`home`:case`pu`:case`pd`:case`cs`:return{t:`cmd`,pos:r,cmd:e,args:[],color:``};case`color`:{let n=this.toks[this.i];if(!n||n.kind!==`str`||!/^"#[0-9a-fA-F]{6}"$/.test(n.text))throw t(`Nieprawidłowy kolor. Oczekiwano koloru w formie "#rrggbb".`,n?C(n):r);return this.i++,{t:`cmd`,pos:r,cmd:e,args:[],color:n.text.slice(1,8).toLowerCase()}}case`width`:{let t=this.arg(n);return this.literal(t,e=>Number.isInteger(e)&&e>=1&&e<=12,`Grubość musi być liczbą całkowitą od 1 do 12.`),{t:`cmd`,pos:r,cmd:e,args:[t],color:``}}case`repeat`:{let e=this.arg(n);this.literal(e,e=>Number.isInteger(e)&&e>=0&&e<=S,`Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.`),this.repeatDepth++;let t=this.bracket(n);return this.repeatDepth--,{t:`repeat`,pos:r,count:e,body:t}}case`let`:{let e=this.toks[this.i];if(!e||e.kind!==`word`)throw t(`Oczekiwano nazwy zmiennej po „niech”.`,e?C(e):r);if(b.has(e.key)||this.procs.has(e.key))throw t(`Nazwy „${e.text}” nie można użyć jako nazwy zmiennej.`,C(e));return this.i++,(this.cur?this.cur.assigned:this.topAssigned).add(e.key),{t:`let`,pos:r,name:e.key,value:this.arg(n)}}case`if`:return{t:`if`,pos:r,cond:this.cond(n),body:this.bracket(n),elseBody:null};case`ifelse`:return{t:`if`,pos:r,cond:this.cond(n),body:this.bracket(n),elseBody:this.bracket(n)};case`fd`:case`bk`:case`rt`:case`lt`:case`pitchup`:case`pitchdown`:case`rollright`:case`rollleft`:return i()}}call(e){let n=this.procs.get(e.key);this.i++;let r=[];for(let i=0;i<n.params.length;i++){if(!this.startsExpr(this.toks[this.i]))throw t(`Procedura „${n.name}” oczekuje ${n.params.length} argumentów, podano ${i}.`,C(e));r.push(this.arg(e))}return{t:`call`,pos:C(e),proc:n.name,args:r}}bracket(e){let n=this.toks[this.i];if(!n||n.kind!==`lb`)throw t(`Oczekiwano „[”.`,C(n||e));if(this.depth>=x)throw t(`Zbyt głębokie zagnieżdżenie nawiasów (limit ${x}).`,C(n));this.i++,this.depth++;let r=this.stmts(`bracket`,n);return this.depth--,this.i++,r}cond(e){let n=this.arg(e),r=this.toks[this.i];if(!r||r.kind!==`cmp`)throw t(`Oczekiwano porównania: =, <, >, <=, >= lub <>.`,C(r||e));return this.i++,{a:n,op:r.text,b:this.arg(e)}}startsExpr(e){if(!e)return!1;switch(e.kind){case`num`:case`colon`:case`lp`:return!0;case`op`:return e.text===`+`||e.text===`-`;case`word`:return y.has(e.key)||!b.has(e.key);default:return!1}}arg(e){let n=this.toks[this.i];if(!this.startsExpr(n))throw!n||n.kind===`rb`||n.kind===`rp`?t(`Brakuje argumentu polecenia „${e.text}”.`,C(n||e)):t(`Oczekiwano liczby lub nazwy zmiennej, a znaleziono „${n.text}”.`,C(n));return{e:this.sum(),pos:C(n)}}isBinary(e){return!!e&&e.spaceBefore===e.spaceAfter}operand(e){let n=this.toks[this.i];if(!this.startsExpr(n))throw t(`Brakuje wartości po operatorze „${e.text}”.`,C(n||e));return this.product()}sum(){let e=this.product();for(;;){let t=this.toks[this.i];if(t?.kind!==`op`||t.text!==`+`&&t.text!==`-`||!this.isBinary(t))return e;this.i++,e={k:`bin`,op:t.text,a:e,b:this.operand(t)}}}product(){let e=this.unary();for(;;){let t=this.toks[this.i];if(t?.kind!==`op`||t.text!==`*`&&t.text!==`/`||!this.isBinary(t))return e;this.i++,e={k:`bin`,op:t.text,a:e,b:this.operand(t)}}}unary(){let e=this.toks[this.i];if(e?.kind===`op`&&(e.text===`+`||e.text===`-`)){this.i++;let n=this.toks[this.i];if(!this.startsExpr(n))throw t(`Brakuje wartości po znaku „${e.text}”.`,C(n||e));return{k:`un`,sign:e.text===`-`?-1:1,e:this.unary()}}return this.primary()}primary(){let e=this.toks[this.i];if(this.i++,e.kind===`num`)return{k:`num`,v:e.value};if(e.kind===`colon`){let n=this.toks[this.i];if(n?.kind!==`word`)throw t(`Oczekiwano nazwy zmiennej po dwukropku.`,C(n||e));return this.i++,this.ref(n)}if(e.kind===`lp`){let n=this.sum();if(this.toks[this.i]?.kind!==`rp`)throw t(`Nie zamknięto nawiasu „(”.`,C(e));return this.i++,n}if(e.kind===`word`){if(y.has(e.key)){if(this.repeatDepth===0)throw t(`Wartość „nrpowt” można użyć tylko wewnątrz powtórz.`,C(e));return{k:`nrpowt`}}return this.ref(e)}throw t(`Oczekiwano liczby lub nazwy zmiennej, a znaleziono „${e.text}”.`,C(e))}ref(e){return this.refs.push({name:e.key,pos:C(e),proc:this.cur}),{k:`ref`,name:e.key}}literal(e,n,r){let i=w(e.e);if(i!==void 0&&!n(i))throw t(r,e.pos)}};function E(e,t){return new T(e,t).parse()}var ee=1e4,te=/\d+(?:\.\d+)?|\.\d+/y,D=/[\p{L}_][\p{L}\p{N}_]*/uy,O=/"[^"\n]*"?/y,ne=/<=|>=|<>|[<>=]/y,k=/[+\-*/]/y,A={"(":`lp`,")":`rp`,"[":`lb`,"]":`rb`,",":`comma`,":":`colon`},j=e=>e===void 0||/\s/.test(e);function M(t){let n=[],r=0,i=1,a=0,o=e=>(e.lastIndex=r,e.exec(t)?.[0]??``);for(;r<t.length;){let s=t[r];if(s===`
`){r++,i++,a=r;continue}if(/\s/.test(s)){r++;continue}if(s===`;`){for(;r<t.length&&t[r]!==`
`;)r++;continue}let c,l=o(O);l?c=`str`:(l=o(te))?c=`num`:(l=o(D))?c=`word`:(l=o(ne))?c=`cmp`:(l=o(k))?c=`op`:(l=s,c=A[s]??`bad`);let u=r-a+1;if(n.length>=1e4)throw new e(`Program ma więcej niż ${ee} symboli.`,i,u);n.push({kind:c,text:l,key:c===`word`?l.toLowerCase():``,value:c===`num`?parseFloat(l):0,line:i,column:u,spaceBefore:j(t[r-1]),spaceAfter:j(t[r+l.length])}),r+=l.length}return n}var N=5e4;function P(e,t){let n=e.slice(0,t);return{line:n.split(`
`).length,column:t-(n.lastIndexOf(`
`)+1)+1}}function re(t,n){if(t.length>5e4){let n=P(t,N);throw new e(`Program jest za długi (limit ${N} znaków).`,n.line,n.column)}return E(M(t),n)}function F(e){return{message:e.message,line:e.line,column:e.column}}function I(t,n){let r;try{r=re(t,n)}catch(t){if(t instanceof e)return{segments:[],error:F(t)};throw t}let i=new p(r),a=i.execute();try{for(;!a.next().done;);}catch(t){if(t instanceof e)return{segments:[...i.segments],error:F(t)};throw t}return{segments:[...i.segments],error:null}}var ie=(e,t)=>n=>e.test(n)?null:`Użyj ${t}.`,L=[{id:`kwadrat-100`,title:`Kwadrat o boku 100`,mode:`2d`,task:`Narysuj kwadrat o boku 100. Żółw startuje z punktu (0, 0) i patrzy w górę ekranu.`,starter:`; Twój kwadrat
`,expected:`powtorz 4 [np 100 pw 90]`,tolerance:2},{id:`trojkat-100`,title:`Równoboczny trójkąt`,mode:`2d`,task:`Narysuj równoboczny trójkąt o boku 100, startując z punktu (0, 0).`,starter:`; Trójkąt
`,expected:`powtorz 3 [np 100 pw 120]`,tolerance:2},{id:`szesciokat-procedura`,title:`Sześciokąt z procedurą`,mode:`2d`,task:`Narysuj sześciokąt foremny o boku 50. Zdefiniuj procedurę (oto … już) i użyj jej.`,starter:`oto szesciokat ma: bok
  ; uzupełnij ciało
juz

szesciokat 50
`,expected:`oto szesciokat ma: bok
  powtorz 6 [np bok pw 60]
juz
szesciokat 50`,tolerance:2,requires:e=>/^\s*(oto|to)\s/im.test(e)?null:`Zdefiniuj procedurę słowem „oto”.`},{id:`gwiazda-180`,title:`Gwiazda pięcioramienna`,mode:`2d`,task:`Narysuj gwiazdę o pięciu ramionach, każde o długości 180. Użyj polecenia powtórz.`,starter:`; Gwiazda
`,expected:`powtorz 5 [np 180 pw 144]`,tolerance:3,requires:ie(/\bpowt[oó]rz\b/i,`polecenia „powtórz”`)},{id:`schody-2d`,title:`Schodki`,mode:`2d`,task:`Narysuj cztery stopnie schodów: w górę 20, w prawo 20, cztery razy, zaczynając w (0, 0).`,starter:`; Schodki
`,expected:`powtorz 4 [np 20 pw 90 np 20 lw 90]`,tolerance:2},{id:`pionowy-kwadrat-3d`,title:`Pionowy kwadrat w 3D`,mode:`3d`,task:`W trybie 3D narysuj kwadrat o boku 100 leżący w płaszczyźnie pionowej. Użyj polecenia gora.`,starter:`; Pionowy kwadrat
`,expected:`powtorz 4 [np 100 gora 90]`,tolerance:2,requires:ie(/\bgora\b|\bpitchup\b/i,`polecenia „gora”`)}],ae=2;function R(e,t){let[n,r,i]=t.from,a=[t.to[0]-n,t.to[1]-r,t.to[2]-i],o=a[0]*a[0]+a[1]*a[1]+a[2]*a[2],s=o===0?0:((e[0]-n)*a[0]+(e[1]-r)*a[1]+(e[2]-i)*a[2])/o;s=Math.max(0,Math.min(1,s));let c=n+a[0]*s-e[0],l=r+a[1]*s-e[1],u=i+a[2]*s-e[2];return Math.sqrt(c*c+l*l+u*u)}function z(e,t){let n=0;for(let r of e){let e=Math.hypot(r.to[0]-r.from[0],r.to[1]-r.from[1],r.to[2]-r.from[2]),i=Math.max(1,Math.min(64,Math.ceil(e/ae)));for(let e=0;e<=i;e++){let a=e/i,o=[0,1,2].map(e=>r.from[e]+(r.to[e]-r.from[e])*a),s=1/0;for(let e of t){let t=R(o,e);if(t<s&&(s=t),s===0)break}s>n&&(n=s)}}return n}function oe(e,t){let n=I(t,e.mode);if(n.error)return{ok:!1,reason:`Błąd w linii ${n.error.line}, kolumna ${n.error.column}: ${n.error.message}`};let r=e.requires?.(t);if(r)return{ok:!1,reason:r};if(n.segments.length===0)return{ok:!1,reason:`Nic nie zostało narysowane.`};let i=I(e.expected,e.mode).segments,a=z(n.segments,i);if(a>e.tolerance)return{ok:!1,reason:`Rysunek nie pasuje do wzoru: fragment jest oddalony o ok. ${a.toFixed(1)}.`};let o=z(i,n.segments);return o>e.tolerance?{ok:!1,reason:`Brakuje fragmentu rysunku: ok. ${o.toFixed(1)} jednostek od wzoru bez pokrycia.`}:{ok:!0,reason:`Zgadza się!`}}var B=[{name:`kwadrat`,mode:`2d`,title:`Kwadrat`,source:`; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]
`},{name:`gwiazda`,mode:`2d`,title:`Gwiazda`,source:`; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]
`},{name:`rozeta`,mode:`2d`,title:`Rozeta`,source:`; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]
`},{name:`spirala`,mode:`2d`,title:`Spirala`,source:`; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]
`},{name:`wielokaty`,mode:`2d`,title:`Wielokąty`,source:`; Jedna procedura, wiele figur: kąt liczy się sam.
oto wielokąt ma: boki, bok
  powtorz boki [np bok pw 360 / boki]
już

grubosc 2
niech n 3
powtorz 7 [
  wielokąt n 60
  niech n n + 1
  pw 360 / 7
]
`},{name:`drzewo`,mode:`2d`,title:`Drzewo`,source:`; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
oto gałąź ma: dł
  jeśli dł < 6 [stop]
  jeżeli dł > 30 [kolor "#6b4f2a" grubosc 3] [kolor "#2f8f4e" grubosc 1]
  np dł
  lw 25
  gałąź dł * 0.7
  pw 50
  gałąź dł * 0.7
  lw 25
  pod ws dł opu
już

pod ws 120 opu
gałąź 90
`},{name:`sniezynka`,mode:`2d`,title:`Śnieżynka`,source:`; Krzywa Kocha: każdy odcinek dzieli się na cztery.
oto koch ma: dł, poziom
  jeśli poziom = 0 [np dł stop]
  koch dł / 3 poziom - 1
  lw 60
  koch dł / 3 poziom - 1
  pw 120
  koch dł / 3 poziom - 1
  lw 60
  koch dł / 3 poziom - 1
już

kolor "#2b6fb3"
grubosc 1
pod pw 90 ws 135 lw 90 np 80 opu
powtorz 3 [
  koch 270 4
  pw 120
]
`},{name:`schody`,mode:`3d`,title:`Schody`,source:`; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]
`},{name:`szescian`,mode:`3d`,title:`Sześcian`,source:`; Dwa kwadraty połączone krawędziami.
kolor "#16866a"
grubosc 3
powtorz 4 [np 100 pw 90]
gora 90 np 100 dol 90
powtorz 4 [np 100 pw 90]
powtorz 4 [
  np 100
  dol 90 np 100
  pod ws 100 opu
  gora 90 pw 90
]
`},{name:`pierscien`,mode:`3d`,title:`Pierścień`,source:`; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]
`},{name:`kula`,mode:`3d`,title:`Kula`,source:`; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]
`},{name:`helisa`,mode:`3d`,title:`Helisa`,source:`; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]
`},{name:`drzewo3d`,mode:`3d`,title:`Drzewo 3D`,source:`; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
oto gałąź ma: dł
  jeśli dł < 8 [stop]
  jeżeli dł > 30 [kolor "#6b4f2a" grubosc 3] [kolor "#2f8f4e" grubosc 1]
  np dł
  powtorz 3 [
    gora 35
    gałąź dł * 0.6
    dol 35
    pp 120
  ]
  pod ws dł opu
już

gora 90
gałąź 70
`}],se=/;[^\n]*|"[^"\n]*"?|\d+(?:\.\d+)?|\.\d+|[\p{L}_][\p{L}\p{N}_]*|<=|>=|<>|[<>=+\-*/]|[()[\],:]/gu,V=e=>e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);function H(e){if(e.startsWith(`;`))return`c`;if(e.startsWith(`"`))return`s`;if(/^[\d.]/.test(e))return`n`;if(/^[\p{L}_]/u.test(e)){let t=e.toLowerCase();return h.has(t)?`k`:_.has(t)||v.has(t)?`d`:y.has(t)?`v`:`i`}return/^[()[\],:]$/.test(e)?`b`:`o`}function ce(e){let t=``,n=0;for(let r of e.matchAll(se)){let i=r.index??0;t+=V(e.slice(n,i));let a=H(r[0]);t+=a?`<span class="t-${a}">${V(r[0])}</span>`:V(r[0]),n=i+r[0].length}return t+V(e.slice(n))}var le=class{textarea;gutter;hl;execBand;errBand;errMark;layers;onInput=null;constructor(e){e.classList.add(`code`),e.innerHTML=`
      <div class="gutter" aria-hidden="true"></div>
      <div class="layers">
        <pre class="hl" aria-hidden="true"></pre>
        <div class="band band-exec" hidden></div>
        <div class="band band-err" hidden></div>
        <div class="mark-err" hidden></div>
        <textarea class="src" id="src" spellcheck="false" autocapitalize="off" autocomplete="off"
          aria-label="Program w języku Logo. Wiersze i kolumny podano w pasku stanu."></textarea>
      </div>`,this.gutter=e.querySelector(`.gutter`),this.layers=e.querySelector(`.layers`),this.hl=e.querySelector(`.hl`),this.execBand=e.querySelector(`.band-exec`),this.errBand=e.querySelector(`.band-err`),this.errMark=e.querySelector(`.mark-err`),this.textarea=e.querySelector(`textarea`),this.textarea.addEventListener(`input`,()=>{this.refresh(),this.onInput?.()})}get value(){return this.textarea.value}set value(e){this.textarea.value=e,this.refresh()}refresh(){let e=this.textarea.value,t=e.split(`
`),n=t.reduce((e,t)=>Math.max(e,t.length),0);this.hl.innerHTML=ce(e)+`
`,this.gutter.innerHTML=t.map((e,t)=>`<div>${t+1}</div>`).join(``);let r=t.length*24+24+24;this.textarea.style.height=`${r}px`,this.layers.style.height=`${r}px`,this.layers.style.minWidth=`calc(${n+4}ch + 24px)`}setExec(e){this.setBand(this.execBand,e)}setError(e){this.setBand(this.errBand,e),e?(this.errMark.hidden=!1,this.errMark.style.top=`${12+(e.line-1)*24}px`,this.errMark.style.left=`calc(12px + ${e.column-1}ch)`):this.errMark.hidden=!0}setBand(e,t){t?(e.hidden=!1,e.style.top=`${12+(t.line-1)*24}px`,e.style.height=`24px`):e.hidden=!0}reveal(e){let t=12+(e.line-1)*24,n=this.layers.parentElement;(t<n.scrollTop+24||t>n.scrollTop+n.clientHeight-48)&&(n.scrollTop=Math.max(0,t-n.clientHeight/3))}},U={get(e){try{return localStorage.getItem(e)}catch{return null}},set(e,t){try{localStorage.setItem(e,t)}catch{}}},ue=e=>`logomocja.szkic.${e}`,de=e=>`logomocja.kopia.${e}`,W=`logomocja.wyzwania`,G=`logomocja.motyw`;function K(){try{let e=JSON.parse(U.get(`logomocja.wyzwania`)??`[]`);return Array.isArray(e)?e.filter(e=>typeof e==`string`):[]}catch{return[]}}function fe(e){let t=new Set(K());t.add(e),U.set(W,JSON.stringify([...t]))}function q(e){let t=new TextEncoder().encode(e),n=``;for(let e of t)n+=String.fromCharCode(e);return btoa(n).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function pe(e){try{let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=atob(t.padEnd(t.length+(4-t.length%4)%4,`=`)),r=Uint8Array.from(n,e=>e.charCodeAt(0));return new TextDecoder(`utf-8`,{fatal:!0}).decode(r)}catch{return null}}function me(e,t,n={}){let r=new URLSearchParams({tryb:t,kod:q(e),...n});return`${location.origin}${location.pathname}#/?${r.toString()}`}function he(){let e=getComputedStyle(document.documentElement),t=t=>e.getPropertyValue(t).trim();return{bg:t(`--c-bg`),grid:t(`--c-grid`),axis:t(`--c-axis`),ink:t(`--c-ink`),accent:t(`--c-accent`),x:t(`--c-x`),y:t(`--c-y`),z:t(`--c-z`)}}function J(e){let t=[0,0,0],n=[0,0,0];for(let r of e)for(let e of[r.from,r.to])for(let r=0;r<3;r++)e[r]<t[r]&&(t[r]=e[r]),e[r]>n[r]&&(n[r]=e[r]);return{min:t,max:n}}function Y(e){let t=window.devicePixelRatio||1,n=Math.max(1,e.clientWidth),r=Math.max(1,e.clientHeight);(e.width!==Math.round(n*t)||e.height!==Math.round(r*t))&&(e.width=Math.round(n*t),e.height=Math.round(r*t));let i=e.getContext(`2d`);return i.setTransform(t,0,0,t,0,0),{ctx:i,w:n,h:r}}function X(e,t){let n=e*t,r=10**Math.floor(Math.log10(n));for(let e of[1,2,5,10])if(r*e>=n)return r*e;return r*10}function Z(e,t,n,r,i){let a=new Map,o=0;e.addEventListener(`pointerdown`,t=>{e.setPointerCapture(t.pointerId),a.set(t.pointerId,{x:t.clientX,y:t.clientY}),o=a.size===2?c():0}),e.addEventListener(`pointermove`,r=>{let i=a.get(r.pointerId);if(!i)return;let s=r.clientX-i.x,u=r.clientY-i.y;if(a.set(r.pointerId,{x:r.clientX,y:r.clientY}),a.size===2){let t=c();if(o>0&&t>0){let r=e.getBoundingClientRect(),i=l();n(o/t,i.x-r.left,i.y-r.top)}o=t}else a.size===1&&t(s,u,r.shiftKey||r.button===2)});let s=e=>{a.delete(e.pointerId),o=0};e.addEventListener(`pointerup`,s),e.addEventListener(`pointercancel`,s),e.addEventListener(`dblclick`,i),e.addEventListener(`wheel`,t=>{t.preventDefault();let r=e.getBoundingClientRect();n(Math.exp(-t.deltaY*.0015),t.clientX-r.left,t.clientY-r.top)},{passive:!1}),e.addEventListener(`contextmenu`,e=>e.preventDefault()),e.addEventListener(`keydown`,e=>{r(e)&&e.preventDefault()});function c(){let[e,t]=[...a.values()];return e&&t?Math.hypot(e.x-t.x,e.y-t.y):0}function l(){let[e,t]=[...a.values()];return{x:(e.x+t.x)/2,y:(e.y+t.y)/2}}}var ge=class{canvas;onChange=null;cx=0;cy=0;scale=2;constructor(e){this.canvas=e,Z(e,(e,t)=>{this.cx-=e/this.scale,this.cy+=t/this.scale,this.changed()},(e,t,n)=>{let{w:r,h:i}=this.size(),a=this.cx+(t-r/2)/this.scale,o=this.cy-(n-i/2)/this.scale;this.scale=Math.min(2e3,Math.max(.01,this.scale*e)),this.cx=a-(t-r/2)/this.scale,this.cy=o+(n-i/2)/this.scale,this.changed()},e=>this.key(e),()=>this.reset())}size(){return{w:Math.max(1,this.canvas.clientWidth),h:Math.max(1,this.canvas.clientHeight)}}changed(){this.onChange?.()}key(e){let t=40/this.scale,n={ArrowLeft:[-t,0],ArrowRight:[t,0],ArrowUp:[0,t],ArrowDown:[0,-t]}[e.key];if(n)return this.cx+=n[0],this.cy+=n[1],this.changed(),!0;if(e.key===`+`||e.key===`=`)this.zoomBy(1.25);else if(e.key===`-`)this.zoomBy(.8);else if(e.key===`0`)this.reset();else return!1;return!0}zoomBy(e){this.scale=Math.min(2e3,Math.max(.01,this.scale*e)),this.changed()}reset(){this.cx=0,this.cy=0,this.scale=2,this.changed()}fit(e){let t=J(e),{w:n,h:r}=this.size(),i=Math.max(t.max[0]-t.min[0],20),a=Math.max(t.max[1]-t.min[1],20);this.scale=Math.min(n*.86/i,r*.86/a),this.cx=(t.min[0]+t.max[0])/2,this.cy=(t.min[1]+t.max[1])/2,this.changed()}toScreen(e,t,n,r){return[n/2+(e-this.cx)*this.scale,r/2-(t-this.cy)*this.scale]}render(e,t){let{ctx:n,w:r,h:i}=Y(this.canvas),a=he();n.fillStyle=a.bg,n.fillRect(0,0,r,i);let o=X(1/this.scale,70);n.strokeStyle=a.grid,n.lineWidth=1,n.beginPath();let s=Math.floor((this.cx-r/2/this.scale)/o)*o,c=this.cx+r/2/this.scale;for(let e=s;e<=c;e+=o){let[t]=this.toScreen(e,0,r,i);n.moveTo(Math.round(t)+.5,0),n.lineTo(Math.round(t)+.5,i)}let l=Math.floor((this.cy-i/2/this.scale)/o)*o,u=this.cy+i/2/this.scale;for(let e=l;e<=u;e+=o){let[,t]=this.toScreen(0,e,r,i);n.moveTo(0,Math.round(t)+.5),n.lineTo(r,Math.round(t)+.5)}n.stroke();let[d,f]=this.toScreen(0,0,r,i);n.strokeStyle=a.axis,n.beginPath(),n.moveTo(0,Math.round(f)+.5),n.lineTo(r,Math.round(f)+.5),n.moveTo(Math.round(d)+.5,0),n.lineTo(Math.round(d)+.5,i),n.stroke(),n.fillStyle=a.axis,n.font=`12px system-ui, sans-serif`,n.fillText(`0`,d+6,f-6),n.lineCap=`round`;for(let t of e){let[e,a]=this.toScreen(t.from[0],t.from[1],r,i),[o,s]=this.toScreen(t.to[0],t.to[1],r,i);n.strokeStyle=t.color,n.lineWidth=Math.max(1,t.width*Math.min(1,Math.max(.5,this.scale/2))),n.beginPath(),n.moveTo(e,a),n.lineTo(o,s),n.stroke()}if(t){let[e,o]=this.toScreen(t.pos[0],t.pos[1],r,i),s=t.heading[0],c=t.heading[1],l=Math.hypot(s,c)||1,u=s/l,d=-c/l,f=-d,p=u;n.fillStyle=a.accent,n.beginPath(),n.moveTo(e+u*13,o+d*13),n.lineTo(e-u*6+f*7,o-d*6+p*7),n.lineTo(e-u*6-f*7,o-d*6-p*7),n.closePath(),n.fill()}}},_e=class{canvas;onChange=null;yaw=.7;pitch=.45;dist=400;target=[0,0,0];radius=100;constructor(e){this.canvas=e,Z(e,(e,t,n)=>{if(n){let{r:n,u:r}=this.basis(),i=this.dist/this.focal();for(let a=0;a<3;a++)this.target[a]+=(-e*n[a]+t*r[a])*i}else this.yaw-=e*.008,this.pitch=Math.max(-1.5,Math.min(1.5,this.pitch+t*.008));this.changed()},e=>{this.dist=Math.min(1e6,Math.max(.5,this.dist/e)),this.changed()},e=>this.key(e),()=>this.reset())}changed(){this.onChange?.()}focal(){let{w:e,h:t}={w:Math.max(1,this.canvas.clientWidth),h:Math.max(1,this.canvas.clientHeight)};return Math.min(e,t)*.9}key(e){switch(e.key){case`ArrowLeft`:this.yaw+=.08;break;case`ArrowRight`:this.yaw-=.08;break;case`ArrowUp`:this.pitch=Math.min(1.5,this.pitch+.08);break;case`ArrowDown`:this.pitch=Math.max(-1.5,this.pitch-.08);break;case`+`:case`=`:this.dist=Math.max(.5,this.dist/1.25);break;case`-`:this.dist=Math.min(1e6,this.dist*1.25);break;case`0`:return this.reset(),!0;default:return!1}return this.changed(),!0}eye(){let e=Math.cos(this.pitch);return[this.target[0]+this.dist*e*Math.cos(this.yaw),this.target[1]+this.dist*e*Math.sin(this.yaw),this.target[2]+this.dist*Math.sin(this.pitch)]}basis(){let e=this.eye(),t=Ce(ve(this.target,e)),n=Ce(Se(t,[0,0,1]));return{e,f:t,r:n,u:Se(n,t)}}project(e,t,n,r){let i=ve(e,t.e),a=xe(i,t.f);if(a<.01*this.dist)return null;let o=this.focal()/a;return[n/2+xe(i,t.r)*o,r/2-xe(i,t.u)*o]}reset(){this.yaw=.7,this.pitch=.45,this.target=[0,0,0],this.dist=Math.max(this.radius*2.6,60),this.changed()}fit(e){let t=J(e);this.target=[0,1,2].map(e=>(t.min[e]+t.max[e])/2);let n=[0,1,2].map(e=>t.max[e]-t.min[e]);this.radius=Math.max(10,Math.hypot(n[0],n[1],n[2])/2),this.dist=this.radius*2.6,this.changed()}render(e,t){let{ctx:n,w:r,h:i}=Y(this.canvas),a=he();n.fillStyle=a.bg,n.fillRect(0,0,r,i);let o=this.basis(),s=this.radius,c=X(s*2.6/900,60)*1,l=Math.ceil(s*3/c)*c;n.strokeStyle=a.grid,n.lineWidth=1,n.beginPath();for(let e=-l;e<=l+1e-9;e+=c)this.line([e,-l,0],[e,l,0],o,n,r,i),this.line([-l,e,0],[l,e,0],o,n,r,i);n.stroke();let u=s*1.2,d=[[[u,0,0],a.x,`X`],[[0,u,0],a.y,`Y`],[[0,0,u],a.z,`Z`]];n.lineWidth=2;for(let[e,t,a]of d){n.strokeStyle=t,n.beginPath(),this.line([0,0,0],e,o,n,r,i),n.stroke();let s=this.project(e,o,r,i);s&&(n.fillStyle=t,n.font=`600 13px system-ui, sans-serif`,n.fillText(a,s[0]+6,s[1]-4))}n.lineCap=`round`;for(let t of e){let e=this.project(t.from,o,r,i),a=this.project(t.to,o,r,i);e&&a&&(n.strokeStyle=t.color,n.lineWidth=Math.max(1,Math.min(8,t.width*(this.focal()/this.dist)*.25)),n.beginPath(),n.moveTo(e[0],e[1]),n.lineTo(a[0],a[1]),n.stroke())}if(t){let e=s*.12,c=this.project(t.pos,o,r,i);if(c){n.fillStyle=a.accent,n.beginPath(),n.arc(c[0],c[1],4,0,Math.PI*2),n.fill();let s=this.project(ye(t.pos,be(t.heading,e)),o,r,i),l=this.project(ye(t.pos,be(t.up,e)),o,r,i);for(let[e,t]of[[s,a.accent],[l,a.z]])e&&(n.strokeStyle=t,n.lineWidth=2.5,n.beginPath(),n.moveTo(c[0],c[1]),n.lineTo(e[0],e[1]),n.stroke())}}}line(e,t,n,r,i,a){let o=this.project(e,n,i,a),s=this.project(t,n,i,a);o&&s&&(r.moveTo(o[0],o[1]),r.lineTo(s[0],s[1]))}},ve=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],ye=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],be=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],xe=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],Se=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Ce=e=>{let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]},we=[1,2,4,8,16,32,64,128,256,512],Te={"2d":B.find(e=>e.name===`kwadrat`).source,"3d":B.find(e=>e.name===`schody`).source};function Ee(e){if(e===1)return`${e} odcinek`;let t=e%10,n=e%100>=12&&e%100<=14;return t>=2&&t<=4&&!n?`${e} odcinki`:`${e} odcinków`}var De={pos:[0,0,0],heading:[0,1,0],up:[0,0,1],right:[1,0,0],pen:!0,color:`#16866a`,width:3},Q=null,Oe=()=>Q,ke=`
<section class="workspace" aria-labelledby="ws-title">
  <h1 id="ws-title" class="sr-only">Edytor programu</h1>
  <div class="toolbar" role="toolbar" aria-label="Sterowanie programem">
    <div class="group" role="group" aria-label="Tryb rysowania">
      <button type="button" data-mode="2d" aria-pressed="true">Plan 2D</button>
      <button type="button" data-mode="3d" aria-pressed="false">Przestrzeń 3D</button>
    </div>
    <div class="group">
      <button type="button" id="run" class="primary" title="Ctrl+Enter">Uruchom <kbd>Ctrl+Enter</kbd></button>
      <button type="button" id="step" title="F8">Krok <kbd>F8</kbd></button>
      <button type="button" id="pause" title="F9">Pauza <kbd>F9</kbd></button>
      <button type="button" id="reset" title="Esc">Reset <kbd>Esc</kbd></button>
    </div>
    <label class="speed">Tempo
      <input type="range" id="speed" min="1" max="10" value="5" aria-valuetext="" />
    </label>
    <div class="group">
      <label class="sr-only" for="examples">Przykłady</label>
      <select id="examples">
        <option value="">Przykłady…</option>
        ${B.map(e=>`<option value="${e.name}">${e.title} (${e.mode===`2d`?`2D`:`3D`})</option>`).join(``)}
      </select>
      <button type="button" id="open">Wczytaj .logo</button>
      <input type="file" id="file" accept=".logo,text/plain" hidden />
      <button type="button" id="save">Pobierz .logo</button>
      <button type="button" id="share">Kopiuj link</button>
      <button type="button" id="png">Zapisz PNG</button>
    </div>
  </div>
  <div id="challenge" class="challenge" hidden></div>
  <div class="split">
    <div class="pane-code"><div id="code"></div></div>
    <div class="pane-view">
      <div class="view-tools">
        <button type="button" id="fit">Dopasuj</button>
        <button type="button" id="view-reset">Widok domyślny</button>
        <span class="hint">Przeciągnij, aby przesunąć (w 3D: obróć). Kółko: zoom.</span>
      </div>
      <div class="canvas-wrap">
        <canvas class="view" data-mode="2d" tabindex="0" role="img" aria-label="Rysunek żółwia na płaszczyźnie"></canvas>
        <canvas class="view" data-mode="3d" tabindex="0" role="img" aria-label="Rysunek żółwia w przestrzeni" hidden></canvas>
      </div>
    </div>
  </div>
  <div class="statusbar">
    <p id="status" class="status" role="status" aria-live="polite"></p>
    <button type="button" id="restore" hidden>Przywróć poprzedni szkic</button>
  </div>
  <details class="shortcuts">
    <summary>Skróty klawiszowe</summary>
    <ul>
      <li><kbd>Ctrl+Enter</kbd> uruchom program od początku</li>
      <li><kbd>F8</kbd> wykonaj jedno polecenie</li>
      <li><kbd>F9</kbd> wstrzymaj lub wznów</li>
      <li><kbd>Esc</kbd> reset rysunku</li>
      <li>Na widoku: strzałki obracają lub przesuwają, <kbd>+</kbd> i <kbd>-</kbd> przybliżają, <kbd>0</kbd> resetuje widok</li>
    </ul>
  </details>
</section>`;function Ae(t,n){t.innerHTML=ke;let r=e=>t.querySelector(e),i=new le(r(`#code`)),a=t.querySelectorAll(`canvas.view`),o={"2d":new ge(a[0]),"3d":new _e(a[1])},s=r(`#speed`),c=r(`#status`),l=r(`#restore`),u=[],d=(e,t,n)=>{e.addEventListener(t,n),u.push(()=>e.removeEventListener(t,n))},f=n.get(`tryb`)===`3d`?`3d`:`2d`,m=null,h=null,g=null,_=`idle`,v=null,y=null,b=null,x=``,S=0,C=0,w=!1,T=()=>o[f],E=()=>i.value,ee=e=>({line:e.line,column:e.column}),te=()=>{clearTimeout(C),C=window.setTimeout(()=>U.set(ue(f),E()),300)},D=()=>{clearTimeout(C),U.set(ue(f),E())},O=e=>U.get(ue(e))??Te[e];function ne(){let e=E();e.trim()&&e!==Te[f]&&(U.set(de(f),e),l.hidden=!1)}function k(e=``){let t=h?.segments.length??0,n=v?` w wierszu ${v.line}`:``,i,a=``;y?(i=`Błąd w wierszu ${y.line}, kolumnie ${y.column}: ${y.message} Narysowano ${Ee(t)}.`,a=`err`):b?(i=`Błąd w wierszu ${b.line}, kolumnie ${b.column}: ${b.message}`,a=`err`):i=_===`running`?`Wykonywanie${n}. Odcinków: ${t}.`:_===`paused`?`Wstrzymano${n}. Odcinków: ${t}.`:_===`done`?`Gotowe. Narysowano ${Ee(t)}.`:`Gotowe. Uruchom program: Ctrl+Enter.`,c.textContent=[x,i,e].filter(Boolean).join(` `),c.dataset.kind=a,r(`#pause`).innerHTML=`${_===`paused`?`Wznów`:`Pauza`} <kbd>F9</kbd>`}function A(){let e=y??b;i.setError(e?ee(e):null)}function j(){try{re(E(),f),b=null}catch(t){if(!(t instanceof e))throw t;b={message:t.message,line:t.line,column:t.column}}A()}function M(){cancelAnimationFrame(S),S=0}function N(){M(),x=``,h=null,g=null,_=`idle`,v=null,y=null,i.setExec(null)}function P(){N();let t;try{t=re(E(),f)}catch(t){if(!(t instanceof e))throw t;return b={message:t.message,line:t.line,column:t.column},_=`error`,A(),H(),k(),!1}return b=null,h=new p(t),g=h.execute(),T().fit(I(E(),f).segments),!0}function F(t){if(g){try{for(let e=0;e<t;e++){let e=g.next();if(e.done){g=null,_=`done`;break}v=e.value}}catch(t){if(!(t instanceof e))throw t;y={message:t.message,line:t.line,column:t.column},v=ee(y),g=null,_=`error`}i.setExec(_===`running`||_===`paused`?v:null),v&&(_===`running`||_===`paused`)&&i.reveal(v),A()}}function ie(){S=0,_===`running`&&(F(we[Number(s.value)-1]),H(),k(),_===`running`&&(S=requestAnimationFrame(ie)))}function ae(){_=`running`,M(),S=requestAnimationFrame(ie),k()}function R(){P()&&ae()}function z(){M(),(g||P())&&(_=`paused`,F(1),H(),k())}function se(){_===`running`?(M(),_=`paused`,i.setExec(v),H(),k()):_===`paused`&&g&&ae()}function V(){N(),A(),H(),k()}function H(){T().render(h?.segments??[],h?h.turtle:De)}function ce(e){e!==f&&(D(),W(e),i.value=O(f),N(),j(),R())}function W(e){f=e;for(let e of t.querySelectorAll(`button[data-mode]`))e.setAttribute(`aria-pressed`,String(e.dataset.mode===f));for(let e of a)e.hidden=e.dataset.mode!==f}function G(e,t,n=``){ne(),D(),t!==f&&W(t),m=null,q(),i.value=e,D(),R(),n&&(x=n,k())}function K(e,t){let n=document.createElement(`a`);n.href=URL.createObjectURL(e),n.download=t,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(n.href),1e3)}function q(){let e=r(`#challenge`);m?(e.hidden=!1,e.innerHTML=`
      <p class="eyebrow">Wyzwanie · ${m.mode===`2d`?`2D`:`3D`}</p>
      <h2>${m.title}</h2>
      <p>${m.task}</p>
      <div class="challenge-actions">
        <button type="button" class="primary" id="check">Sprawdź rozwiązanie</button>
        <a href="#/wyzwania">Wszystkie wyzwania</a>
        <span id="check-result" role="status"></span>
      </div>`,e.querySelector(`#check`).addEventListener(`click`,he)):(e.hidden=!0,e.innerHTML=``)}function he(){if(!m)return;let e=oe(m,E()),t=document.getElementById(`check-result`);t&&(t.textContent=e.ok?`✔ Zaliczone. ${e.reason}`:`✘ Nie tym razem. ${e.reason}`,t.dataset.kind=e.ok?`ok`:`err`),e.ok&&fe(m.id),R()}t.querySelectorAll(`button[data-mode]`).forEach(e=>{d(e,`click`,()=>ce(e.dataset.mode))}),d(r(`#run`),`click`,R),d(r(`#step`),`click`,z),d(r(`#pause`),`click`,se),d(r(`#reset`),`click`,V),d(s,`input`,()=>{s.setAttribute(`aria-valuetext`,`poziom ${s.value} z 10`)}),d(r(`#examples`),`change`,e=>{let t=e.target,n=B.find(e=>e.name===t.value);t.value=``,n&&G(n.source,n.mode,`Wczytano przykład „${n.title}”.`)}),d(r(`#open`),`click`,()=>r(`#file`).click()),d(r(`#file`),`change`,async e=>{let t=e.target,n=t.files?.[0];t.value=``,n&&G(await n.text(),f,`Wczytano plik „${n.name}”.`)}),d(r(`#save`),`click`,()=>{let e=m?`${m.id}.logo`:`program-${f}.logo`;K(new Blob([E()],{type:`text/plain;charset=utf-8`}),e)}),d(r(`#share`),`click`,async()=>{let e=me(E(),f);try{await navigator.clipboard.writeText(e),k(`Link skopiowano do schowka.`)}catch{k(`Nie udało się skopiować. Link: ${e}`)}}),d(r(`#png`),`click`,()=>{H(),o[f].canvas.toBlob(e=>{e&&K(e,`logomocja-${f}.png`)},`image/png`)}),d(r(`#fit`),`click`,()=>T().fit(h?.segments??[])),d(r(`#view-reset`),`click`,()=>T().reset()),d(l,`click`,()=>{let e=U.get(de(f));e!==null&&(i.value=e,D(),R()),l.hidden=!0});for(let e of Object.values(o))e.onChange=()=>H();let J=new ResizeObserver(()=>H());J.observe(t.querySelector(`.pane-view`)),u.push(()=>J.disconnect()),i.onInput=()=>{_===`running`||_===`paused`?(N(),h=null,H(),x=`Program zmieniono w trakcie wykonywania: przerwano. Uruchom ponownie (Ctrl+Enter).`):(y=null,_===`error`&&(_=`idle`)),j(),te(),k()},d(document,`keydown`,e=>{w||(e.key===`Enter`&&(e.ctrlKey||e.metaKey)?(e.preventDefault(),R()):e.key===`F8`?(e.preventDefault(),z()):e.key===`F9`?(e.preventDefault(),se()):e.key===`Escape`&&(h||_!==`idle`)&&V())}),d(window,`pagehide`,D),l.hidden=U.get(de(f))===null;let Y=n.get(`kod`),X=n.get(`wyzwanie`);X&&(m=L.find(e=>e.id===X)??null),m?(f=m.mode,i.value=m.starter,q()):i.value=Y===null?O(f):pe(Y)??O(f),W(f),s.setAttribute(`aria-valuetext`,`poziom ${s.value} z 10`),j(),R(),k();let Z={async open(e,t){t!==f&&W(t),m=null,q(),i.value=e,D(),P()&&F(1/0);let n=I(e,t);return T().fit(n.segments),H(),k(),await new Promise(e=>requestAnimationFrame(()=>e())),{segments:n.segments,error:n.error}}};return Q=Z,()=>{w=!0,M(),clearTimeout(C),D(),Q===Z&&(Q=null);for(let e of u)e()}}function je(e){let t=new Set(K());e.innerHTML=`
    <section class="challenges" aria-labelledby="ch-title">
      <h1 id="ch-title">Wyzwania</h1>
      <p>Każde wyzwanie opisuje rysunek. Napisz program, a Logomocja porówna go z wzorem. Zaliczone: <strong>${L.filter(e=>t.has(e.id)).length} z ${L.length}</strong>.</p>
      <ol class="cards">
        ${L.map(e=>`
          <li class="card ${t.has(e.id)?`solved`:``}">
            <p class="eyebrow">${e.mode===`2d`?`Plan 2D`:`Przestrzeń 3D`}${t.has(e.id)?` · ✔ zaliczone`:``}</p>
            <h2>${e.title}</h2>
            <p>${e.task}</p>
            <a class="button primary" href="#/?wyzwanie=${encodeURIComponent(e.id)}">Rozwiąż<span class="sr-only"> wyzwanie: ${e.title}</span></a>
          </li>`).join(``)}
      </ol>
    </section>`}var Me=[{names:`np, naprzod, naprzód, fd, forward`,argument:`wyrażenie`,text:`Przesuwa żółwia do przodu o podaną odległość. Rysuje, jeśli pisak jest opuszczony.`,example:`np 80`,mode:`2d`},{names:`ws, wstecz, bk, back`,argument:`wyrażenie`,text:`Przesuwa żółwia do tyłu o podaną odległość.`,example:`ws 40`,mode:`2d`},{names:`pw, prawo, rt, right`,argument:`wyrażenie (stopnie)`,text:`Obraca żółwia w prawo, wokół pionu.`,example:`pw 90`,mode:`2d`},{names:`lw, lewo, lt, left`,argument:`wyrażenie (stopnie)`,text:`Obraca żółwia w lewo, wokół pionu. Ujemny kąt obraca w drugą stronę.`,example:`lw 45`,mode:`2d`},{names:`pod, podnies, podnieś, pu, penup`,argument:`brak`,text:`Podnosi pisak: kolejne ruchy nie rysują.`,example:`pod np 50 opu`,mode:`2d`},{names:`opu, opusc, opuść, pd, pendown`,argument:`brak`,text:`Opuszcza pisak: ruchy znów rysują.`,example:`opu np 50`,mode:`2d`},{names:`kolor, color`,argument:`kolor "#rrggbb"`,text:`Ustawia kolor pisaka. Kolor zapisany jest w cudzysłowie, sześcioma cyframi szesnastkowymi.`,example:`kolor "#c1763d"`,mode:`2d`},{names:`grubosc, grubość, width`,argument:`liczba całkowita 1–12`,text:`Ustawia grubość linii.`,example:`grubosc 4`,mode:`2d`},{names:`powtorz, powtórz, repeat`,argument:`liczba 0–10000, potem [ blok ]`,text:`Wykonuje blok podaną liczbę razy. Wewnątrz bloku nrpowt daje numer obiegu, od 1.`,example:`powtorz 4 [np 50 pw 90]`,mode:`2d`},{names:`niech, let`,argument:`nazwa wyrażenie`,text:`Przypisuje wartość zmiennej. Na poziomie głównym tworzy zmienną globalną, w procedurze lokalną dla wywołania.`,example:`niech bok 40`,mode:`2d`},{names:`jeśli, jesli, if`,argument:`warunek [ blok ]`,text:`Wykonuje blok, gdy warunek jest spełniony. Warunek to wyrażenie porównania: = < > <= >= <>.`,example:`jeśli bok > 10 [np bok]`,mode:`2d`},{names:`jeżeli, jezeli, ifelse`,argument:`warunek [ blok ] [ blok ]`,text:`Wykonuje pierwszy blok, gdy warunek jest spełniony, a w przeciwnym razie drugi.`,example:`jeżeli nrpowt > 2 [kolor "#c1763d"] [kolor "#16866a"]`,mode:`2d`},{names:`stop`,argument:`brak`,text:`Kończy bieżącą procedurę. Na poziomie głównym kończy program.`,example:`jeśli bok < 5 [stop]`,mode:`2d`},{names:`dom, home`,argument:`brak`,text:`Wraca do punktu (0, 0) i do kierunku startowego. Pisak i kolor zostają bez zmian.`,example:`dom`,mode:`2d`},{names:`czyść, czysc, cs, clearscreen`,argument:`brak`,text:`Kasuje cały dotychczasowy rysunek. Żółw i jego stan zostają.`,example:`cs`,mode:`2d`},{names:`gora, góra, pitchup`,argument:`wyrażenie (stopnie)`,text:`Tylko 3D. Unosi nos żółwia o podany kąt.`,example:`gora 90 np 50`,mode:`3d`},{names:`dol, dół, pitchdown`,argument:`wyrażenie (stopnie)`,text:`Tylko 3D. Opuszcza nos żółwia o podany kąt.`,example:`dol 30 np 50`,mode:`3d`},{names:`pp, przechylprawo, rr, rollright`,argument:`wyrażenie (stopnie)`,text:`Tylko 3D. Przechyla żółwia w prawo wokół kierunku ruchu; kierunek się nie zmienia.`,example:`pp 90 gora 90 np 50`,mode:`3d`},{names:`pl, przechyllewo, rl, rollleft`,argument:`wyrażenie (stopnie)`,text:`Tylko 3D. Przechyla żółwia w lewo wokół kierunku ruchu.`,example:`pl 90 gora 90 np 50`,mode:`3d`}],Ne=[{title:`Podstawy`,html:`
      <p>Logomocja to program, który rysuje żółwiem. Żółw startuje w punkcie (0, 0), patrzy w górę ekranu i rysuje, bo pisak jest opuszczony.</p>
      <ul>
        <li>Słowa kluczowe, nazwy procedur i zmiennych nie rozróżniają wielkości liter. <code>NP</code>, <code>np</code> i <code>Np</code> to to samo.</li>
        <li>Białe znaki oddzielają symbole. Nowa linia nie kończy polecenia, za wyjątkiem nagłówka i końca procedury.</li>
        <li>Średnik zaczyna komentarz do końca wiersza: <code>; to jest komentarz</code>.</li>
        <li>Liczby są dodatnie: <code>80</code>, <code>12.5</code>, <code>.5</code>. Znak minus jest operatorem.</li>
        <li>Kierunki w 2D: +X w prawo, +Y w górę ekranu. W 3D dochodzi +Z, w górę.</li>
      </ul>`},{title:`Wyrażenia`,html:`
      <p>Wyrażenie to liczba, nazwa zmiennej lub parametru (także <code>:nazwa</code>), <code>nrpowt</code>, nawias albo działanie.</p>
      <ul>
        <li>Operatory <code>+ - * /</code>. Mnożenie i dzielenie wiążą mocniej niż dodawanie i odejmowanie. Działania tej samej wagi liczymy od lewej.</li>
        <li>Binarny operator ma spację po obu stronach albo przed żadną: <code>np 10 - 5</code> i <code>np 10-5</code> są poprawne, <code>np 10 -5</code> już nie.</li>
        <li>Znaki <code>-</code> i <code>+</code> przed wartością to znaki jednoargumentowe: <code>np -(3 - 5)</code>, <code>np - -2</code>.</li>
        <li>Porównania są dokładne: <code>0.1 + 0.2 = 0.3</code> jest fałszem.</li>
        <li>Dzielenie przez zero i wynik niebędący liczbą skończoną to błąd wykonania.</li>
      </ul>`},{title:`Zmienne i procedury`,html:`
      <p>Procedurę definiuje się słowem <code>oto</code>, parametry podaje się po <code>ma:</code>, a ciało kończy słowo <code>już</code> w osobnym wierszu.</p>
      <pre><code>oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90</code></pre>
      <ul>
        <li>Wywołanie podaje tyle argumentów, ile procedura ma parametrów, oddzielonych spacją. Każdy argument jest wyrażeniem: <code>kwadrat 40 * 2 90</code>.</li>
        <li>Definicje są tylko na poziomie głównym. Mogą stać przed wywołaniem albo po nim. Procedura może wywoływać siebie.</li>
        <li><code>niech</code> na poziomie głównym tworzy zmienną globalną. W procedurze tworzy zmienną lokalną, która przesłania globalną do końca wywołania.</li>
        <li>Nazwę można użyć tylko wtedy, gdy jest parametrem, przypisano ją przez <code>niech</code> w tej procedurze albo na poziomie głównym.</li>
      </ul>`},{title:`Powtórz i warunki`,html:`
      <p><code>powtorz n [ ... ]</code> wykonuje blok <code>n</code> razy; <code>n</code> to liczba całkowita od 0 do 10000. Wewnątrz bloku <code>nrpowt</code> to numer obiegu, zaczynając od 1. Poza powtórz <code>nrpowt</code> jest błędem.</p>
      <p><code>jeśli warunek [ ... ]</code> i <code>jeżeli warunek [ ... ] [ ... ]</code> działają jak w większości języków. Wewnątrz procedury <code>stop</code> kończy procedurę, nie tylko blok.</p>`},{title:`Limity`,html:`
      <ul>
        <li>50 000 znaków programu i 10 000 symboli.</li>
        <li>Zagnieżdżenie nawiasów [ ] do 32 poziomów.</li>
        <li>Do 32 aktywnych wywołań procedur i powtórzeń naraz; bloki warunkowe się nie liczą.</li>
        <li>10 000 wykonanych operacji. Każde polecenie, przypisanie, warunek, powtórzenie i wywołanie liczy się jako jedna operacja, a koniec obiegu, bloku lub wywołania dodaje jeszcze jedną.</li>
        <li>10 000 odcinków na rysunku oraz współrzędne w zakresie ±100 000.</li>
      </ul>
      <p>Błąd składni nie rysuje niczego. Błąd wykonania zostawia rysunek narysowany przed błędem.</p>`}],$=e=>e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`);function Pe(){let e=Me.map(e=>{let t=`#/?tryb=${e.mode}&kod=${q(e.example)}`;return`
      <article class="cmd" id="${$(e.names.split(`,`)[0].trim())}">
        <h3><code>${$(e.names.split(`,`)[0].trim())}</code>${e.mode===`3d`?` <span class="badge">tylko 3D</span>`:``}</h3>
        <p class="aliases">Aliasy: ${$(e.names)}</p>
        <p><strong>Argument:</strong> ${$(e.argument)}</p>
        <p>${$(e.text)}</p>
        <pre><code>${$(e.example)}</code></pre>
        <a class="try" href="${t}">Wypróbuj w edytorze</a>
      </article>`}).join(``),t=B.map(e=>`<li><a href="${`#/?tryb=${e.mode}&kod=${q(e.source)}`}">${$(e.title)}</a> <span class="muted">(${e.mode===`2d`?`2D`:`3D`}, ${$(e.name)})</span></li>`).join(``);return`
    <article class="reference">
      <h1>Pomoc i język Logo</h1>
      ${Ne.map(e=>`<section aria-labelledby="s-${$(e.title)}"><h2 id="s-${$(e.title)}">${$(e.title)}</h2>${e.html}</section>`).join(``)}
      <section aria-labelledby="s-polecenia">
        <h2 id="s-polecenia">Polecenia</h2>
        <p>Każde polecenie ma polskie i angielskie nazwy. Obie są równoważne.</p>
        ${e}
      </section>
      <section aria-labelledby="s-przyklady">
        <h2 id="s-przyklady">Programy przykładowe</h2>
        <ul class="examples">${t}</ul>
      </section>
    </article>`}function Fe(e){e.innerHTML=Pe()}var Ie=[`auto`,`light`,`dark`],Le={auto:`automatyczny`,light:`jasny`,dark:`ciemny`};function Re(){let e=U.get(G);return Ie.includes(e)?e:`auto`}function ze(e){document.documentElement.dataset.theme=e;let t=document.getElementById(`theme`);t&&(t.textContent=`Motyw: ${Le[e]}`)}function Be(e){let t=null,n=document.getElementById(`theme`);ze(Re()),n.addEventListener(`click`,()=>{let e=Ie[(Ie.indexOf(Re())+1)%Ie.length];U.set(G,e),ze(e)});function r(){t?.(),t=null;let[n,r]=location.hash.replace(/^#/,``).split(`?`),i=new URLSearchParams(r??``),a=n.replace(/^\/+/,``);for(let e of document.querySelectorAll(`nav a[data-route]`))e.dataset.route===a?e.setAttribute(`aria-current`,`page`):e.removeAttribute(`aria-current`);a===`pomoc`?Fe(e):a===`wyzwania`?je(e):t=Ae(e,i),document.title=a===`pomoc`?`Pomoc · Logomocja`:a===`wyzwania`?`Wyzwania · Logomocja`:`Logomocja`,e.focus({preventScroll:!0})}window.addEventListener(`hashchange`,r),r()}var Ve=async()=>{for(let e=0;e<300&&!Oe();e++)await new Promise(e=>requestAnimationFrame(()=>e(void 0)))};window.logomocja={version:`1.0.0`,run:(e,t)=>I(e,t),async open(e,t){Oe()||(location.hash=`#/`,await Ve());let n=Oe();if(!n)throw Error(`Edytor nie jest dostępny.`);return n.open(e,t)}},Be(document.getElementById(`app`));