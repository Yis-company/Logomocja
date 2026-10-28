(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=5e4,t=class extends Error{line;column;constructor(e,t,n){super(e),this.line=t,this.column=n,this.name=`LogoError`}};function n(e){return e.normalize(`NFC`).toLowerCase()}var r=/\d+(?:\.\d+)?|\.\d+/y,i=/[\p{L}_][\p{L}\p{N}_]*/uy,a=e=>e===void 0||e===` `||e===`	`||e===`\r`||e===`
`||e===`;`;function o(e,t){let n=1,r=0;for(let i=0;i<t&&i<e.length;i++)e[i]===`
`&&(n++,r=i+1);return{line:n,col:t-r+1}}function s(s){if(s.length>5e4){let{line:n,col:r}=o(s,e);throw new t(`Program jest za długi (limit to 50 000 znaków).`,n,r)}let c=[],l=0,u=1,d=0,f=0,p=s.length,m=(e,n)=>{let r=o(s,e);throw new t(n,r.line,r.col)},h=(e,n,r,i={})=>{let o={kind:e,text:n,key:n.toLowerCase(),value:0,line:u,col:r-d+1,first:u!==f,sp:r===0||a(s[r-1]),sa:!1,...i};if(f=u,c.push(o),c.length>1e4)throw new t(`Program ma więcej niż 10 000 elementów.`,o.line,o.col);return o};for(;l<p;){let e=s[l];if(e===`
`){l++,u++,d=l;continue}if(e===` `||e===`	`||e===`\r`||e===`\f`){l++;continue}if(e===`;`){for(;l<p&&s[l]!==`
`;)l++;continue}let t=l,o;if(e>=`0`&&e<=`9`||e===`.`&&s[l+1]>=`0`&&s[l+1]<=`9`){r.lastIndex=l;let e=r.exec(s);o=h(`num`,e[0],t,{value:parseFloat(e[0])}),l+=e[0].length}else if(/[\p{L}_]/u.test(e)){i.lastIndex=l;let e=i.exec(s);o=h(`word`,e[0],t,{key:n(e[0])}),l+=e[0].length}else if(e===`:`&&/[\p{L}_]/u.test(s[l+1]??``)){i.lastIndex=l+1;let e=i.exec(s);o=h(`var`,e[0],t,{key:n(e[0])}),l+=1+e[0].length}else if(e===`"`){let e=s.indexOf(`"`,l+1),n=s.indexOf(`
`,l+1);(e===-1||n!==-1&&n<e)&&m(l,`Niedomknięty cudzysłów: napis musi mieścić się w jednym wierszu i kończyć cudzysłowem.`);let r=s.slice(l+1,e);o=h(`str`,s.slice(l,e+1),t,{key:r}),l=e+1}else{let n=s.slice(l,l+2),r=null,i=1;n===`<=`||n===`>=`||n===`<>`?(r=`cmp`,i=2):e===`<`||e===`>`||e===`=`?r=`cmp`:e===`+`||e===`-`||e===`*`||e===`/`?r=`op`:e===`[`?r=`lbr`:e===`]`?r=`rbr`:e===`(`?r=`lpar`:e===`)`?r=`rpar`:e===`,`?r=`comma`:e===`:`&&(r=`colon`),r||m(l,`Nieznany znak '${e}'.`),o=h(r,s.slice(l,l+i),t),l+=i}o.sa=a(s[l])}return c}var c=[[[`np`,`naprzod`,`naprzód`,`fd`,`forward`],{op:`fd`,args:1}],[[`ws`,`wstecz`,`bk`,`back`],{op:`bk`,args:1}],[[`pw`,`prawo`,`rt`,`right`],{op:`rt`,args:1}],[[`lw`,`lewo`,`lt`,`left`],{op:`lt`,args:1}],[[`pod`,`podnies`,`podnieś`,`pu`,`penup`],{op:`pu`,args:0}],[[`opu`,`opusc`,`opuść`,`pd`,`pendown`],{op:`pd`,args:0}],[[`kolor`,`color`],{op:`color`,args:0}],[[`grubosc`,`grubość`,`width`],{op:`width`,args:1}],[[`powtorz`,`powtórz`,`repeat`],{op:`repeat`,args:1}],[[`niech`,`let`],{op:`let`,args:1}],[[`jeśli`,`jesli`,`if`],{op:`if`,args:0}],[[`jeżeli`,`jezeli`,`ifelse`],{op:`ifelse`,args:0}],[[`stop`],{op:`stop`,args:0}],[[`dom`,`home`],{op:`home`,args:0}],[[`czyść`,`czysc`,`cs`,`clearscreen`],{op:`cs`,args:0}],[[`gora`,`góra`,`pitchup`],{op:`pitchup`,args:1,only3d:!0}],[[`dol`,`dół`,`pitchdown`],{op:`pitchdown`,args:1,only3d:!0}],[[`pp`,`przechylprawo`,`rr`,`rollright`],{op:`rollright`,args:1,only3d:!0}],[[`pl`,`przechyllewo`,`rl`,`rollleft`],{op:`rollleft`,args:1,only3d:!0}]],l=new Map;for(let[e,t]of c)for(let n of e)l.set(n.normalize(`NFC`).toLowerCase(),t);var u=new Set([`oto`,`to`]),d=new Set([`już`,`juz`,`end`]),f=new Set([`nrpowt`,`repcount`]);function p(e){return l.has(e)||u.has(e)||d.has(e)||f.has(e)||e===`ma`}var m=(e,n)=>new t(n,e.line,e.col);function h(e,t,n){switch(e.k){case`num`:return e.v;case`var`:{let r=t.get(e.tok.key);if(r===void 0)throw m(n,`Zmienna '${e.tok.text}' nie ma jeszcze wartości.`);return r}case`rep`:if(t.rep===void 0)throw m(e.tok,`'nrpowt' działa tylko wewnątrz powtórzenia.`);return t.rep;case`neg`:return-h(e.e,t,n);case`bin`:{let r=h(e.l,t,n),i=h(e.r,t,n);if(e.op===`/`&&i===0)throw m(n,`Dzielenie przez zero.`);let a=e.op===`+`?r+i:e.op===`-`?r-i:e.op===`*`?r*i:r/i;if(!Number.isFinite(a))throw m(n,`Wynik obliczenia nie jest liczbą skończoną.`);return a}}}function ee(e,t,n){switch(e){case`<`:return t<n;case`>`:return t>n;case`=`:return t===n;case`<=`:return t<=n;case`>=`:return t>=n;case`<>`:return t!==n;default:return!1}}function g(e){switch(e.k){case`num`:return!0;case`var`:case`rep`:return!1;case`neg`:return g(e.e);case`bin`:return g(e.l)&&g(e.r)}}var _=1e4,te=new Set([`pitchup`,`pitchdown`,`rollright`,`rollleft`]);function ne(e,t){let n=e[t],r=e=>e!==void 0&&e.line===n.line,i=e[t+1];if(!r(i)||i.kind!==`word`)throw m(r(i)?i:n,`Po słowie „oto” podaj nazwę procedury.`);if(p(i.key))throw m(i,`Nazwa „${i.text}” jest zarezerwowana.`);let a=[],o=e=>{if(p(e.key))throw m(e,`Nazwa „${e.text}” jest zarezerwowana.`);if(a.some(t=>t.key===e.key))throw m(e,`Parametr „${e.text}” występuje dwa razy.`);a.push({key:e.key,tok:e})},s=t+2,c=e[s];if(r(c)&&c.kind===`word`&&c.key===`ma`)for(s++,r(e[s])&&e[s].kind===`colon`&&s++;r(e[s])&&[`word`,`var`,`comma`].includes(e[s].kind);){let t=e[s++];t.kind!==`comma`&&o(t)}else for(;r(e[s])&&e[s].kind===`var`;)o(e[s++]);let l=e[s];if(l&&l.line===n.line)throw m(l,`Nagłówek procedury musi kończyć się w osobnym wierszu.`);return{name:i.key,tok:i,params:a,end:s}}function re(e){let t=new Map;return e.forEach((n,r)=>{if(n.kind===`word`&&u.has(n.key)&&n.first){let n=ne(e,r);if(t.has(n.name))throw m(n.tok,`Procedura „${n.tok.text}” jest już zdefiniowana.`);t.set(n.name,n)}}),t}var ie=class{toks;defs;procs;i=0;depth=0;inProc=!1;constructor(e,t,n){this.toks=e,this.defs=t,this.procs=n}peek(){return this.toks[this.i]}block(e){let t=[];for(;;){let n=this.peek();if(!n){if(e)throw m(e,`Nawias „[” nie ma pasującego „]”.`);return t}if(n.kind===`rbr`){if(e)return t;throw m(n,`Nawias „]” nie ma pasującego „[”.`)}if(n.kind===`word`&&d.has(n.key)){if(e)throw m(n,`Brakuje „]” przed słowem „${n.text}”.`);if(this.inProc)return t;throw m(n,`Słowo „${n.text}” nie zamyka żadnej procedury.`)}if(n.kind===`word`&&u.has(n.key)){if(e||this.inProc)throw m(n,`Definicja procedury jest dozwolona tylko na najwyższym poziomie programu.`);if(!n.first)throw m(n,`Słowo „oto” musi zaczynać wiersz.`);this.definition()}else t.push(this.statement())}}definition(){let e=ne(this.toks,this.i);this.i=e.end,this.inProc=!0;let t=this.block(null);this.inProc=!1;let n=this.peek();if(!n)throw m(e.tok,`Procedura „${e.tok.text}” nie ma zakończenia „już”.`);let r=this.toks[this.i+1];if(!n.first||r&&r.line===n.line)throw m(n,`Słowo „już” musi stać w osobnym wierszu.`);this.i++,this.procs.set(e.name,{name:e.tok.text,tok:e.tok,params:e.params,body:t})}statement(){let e=this.toks[this.i++];if(e.kind===`word`){let t=l.get(e.key);if(t)return this.command(e,t);if(this.defs.has(e.key))return this.call(e);throw f.has(e.key)?m(e,`„nrpowt” jest wartością, a nie poleceniem.`):m(e,`Nieznane polecenie „${e.text}”.`)}throw e.kind===`num`||e.kind===`var`||e.kind===`str`?m(e,`Oczekiwano polecenia, a znaleziono wartość „${e.text}”.`):m(e,`Nieoczekiwany znak „${e.text}”.`)}command(e,t){switch(t.op){case`color`:{let t=this.peek();if(!t||t.kind!==`str`)throw m(t??e,`Oczekiwano koloru w cudzysłowie, np. "#16866a".`);if(this.i++,!/^#[0-9a-f]{6}$/i.test(t.key))throw m(t,`Nieprawidłowy kolor ${t.text}: podaj sześć cyfr szesnastkowych, np. "#16866a".`);return{op:`color`,tok:e,value:t.key.toLowerCase()}}case`repeat`:return{op:`repeat`,tok:e,count:this.arg(e),body:this.body(e)};case`let`:{let t=this.peek();if(!t||t.kind!==`word`&&t.kind!==`var`)throw m(t??e,`Po słowie „niech” podaj nazwę zmiennej.`);if(this.i++,p(t.key)||this.defs.has(t.key))throw m(t,`Nazwa „${t.text}” jest zarezerwowana (polecenie lub procedura).`);return{op:`let`,tok:e,name:t.key,value:this.arg(e)}}case`if`:return{op:`if`,tok:e,cond:this.cond(e),body:this.body(e)};case`ifelse`:return{op:`ifelse`,tok:e,cond:this.cond(e),body:this.body(e),elseBody:this.body(e)};case`pu`:case`pd`:case`home`:case`cs`:case`stop`:return{op:t.op,tok:e};default:{let n=[this.arg(e)];return{op:t.op,tok:e,args:n}}}}call(e){let t=this.defs.get(e.key),n=t.params.map(()=>this.arg(e)),r=this.peek();if(r&&(r.kind===`num`||r.kind===`var`||r.kind===`lpar`))throw m(r,`Procedura „${e.text}” przyjmuje ${t.params.length} argument(y), a podano więcej.`);return{op:`call`,tok:e,name:e.key,args:n}}body(e){let t=this.peek();if(!t||t.kind!==`lbr`)throw m(t??e,`Oczekiwano „[” rozpoczynającego treść polecenia „${e.text}”.`);if(this.i++,this.depth++,this.depth>32)throw m(t,`Zbyt wiele zagnieżdżonych nawiasów [ ] (limit 32).`);let n=this.block(t);return this.i++,this.depth--,n}cond(e){let t=this.peek();if(!t||!this.canStart(t))throw m(t??e,`Brakuje warunku.`);let n=this.expr(),r=this.peek();if(!r||r.kind!==`cmp`)throw m(r??e,`W warunku brakuje porównania: =, <, >, <=, >= albo <>.`);this.i++;let i=this.peek();if(!i||!this.canStart(i))throw m(i??r,`Brakuje wartości po porównaniu.`);return{l:n,op:r.text,r:this.expr(),tok:t}}arg(e){let t=this.peek();if(!t||!this.canStart(t))throw m(t??e,`Brakuje argumentu polecenia „${e.text}”.`);return{e:this.expr(),tok:t}}canStart(e){return e.kind===`num`||e.kind===`var`||e.kind===`lpar`?!0:e.kind===`op`?e.text===`+`||e.text===`-`:e.kind===`word`&&!(l.has(e.key)||this.defs.has(e.key)||u.has(e.key)||d.has(e.key))}isBinary(e){return e!==void 0&&e.kind===`op`&&e.sp===e.sa}expr(){let e=this.term();for(;;){let t=this.peek();if(!this.isBinary(t)||t.text!==`+`&&t.text!==`-`)return e;this.i++,e={k:`bin`,op:t.text,l:e,r:this.term(t)}}}term(e){let t=this.unary(e);for(;;){let e=this.peek();if(!this.isBinary(e)||e.text!==`*`&&e.text!==`/`)return t;this.i++,t={k:`bin`,op:e.text,l:t,r:this.unary(e)}}}unary(e){let t=this.peek();if(t&&t.kind===`op`&&(t.text===`+`||t.text===`-`)){this.i++;let e=this.unary(t);return t.text===`-`?{k:`neg`,e}:e}return this.operand(e)}operand(e){let t=this.peek();if(!t)throw m(e,`Brakuje wartości po operatorze.`);if(this.i++,t.kind===`num`)return{k:`num`,v:t.value};if(t.kind===`var`)return{k:`var`,tok:t};if(t.kind===`word`&&f.has(t.key))return{k:`rep`,tok:t};if(t.kind===`word`&&this.canStart(t))return{k:`var`,tok:t};if(t.kind===`lpar`){let e=this.expr(),n=this.peek();if(!n||n.kind!==`rpar`)throw m(n??t,`Brakuje „)” zamykającego nawias.`);return this.i++,e}throw this.i--,m(t,e?`Brakuje wartości po operatorze.`:`Oczekiwano wartości.`)}};function v(e,t){for(let n of e)n.op===`let`?t.add(n.name):n.op===`repeat`||n.op===`if`?v(n.body,t):n.op===`ifelse`&&(v(n.body,t),v(n.elseBody,t))}function y(e,t,n){switch(e.k){case`num`:return;case`var`:if(!t.has(e.tok.key))throw m(e.tok,`Nieznana nazwa „${e.tok.text}”: użyj parametru procedury albo najpierw przypisz zmienną poleceniem „niech”.`);return;case`rep`:if(!n)throw m(e.tok,`„nrpowt” można użyć tylko wewnątrz powtórzenia.`);return;case`neg`:return y(e.e,t,n);case`bin`:y(e.l,t,n),y(e.r,t,n)}}function ae(e,t,n){if(g(e.e)&&!t(h(e.e,{get:()=>void 0,rep:void 0},e.tok)))throw m(e.tok,n)}var b=(e,t,n)=>Number.isInteger(e)&&e>=t&&e<=n;function x(e,t,n,r){for(let i of e)if(i.op!==`color`&&i.op!==`pu`&&i.op!==`pd`&&i.op!==`home`&&i.op!==`cs`&&i.op!==`stop`){if(i.op===`let`)y(i.value.e,t,n);else if(i.op===`repeat`)y(i.count.e,t,n),ae(i.count,e=>b(e,0,_),`Liczba powtórzeń musi być liczbą całkowitą od 0 do ${_}.`),x(i.body,t,!0,r);else if(i.op===`if`)y(i.cond.l,t,n),y(i.cond.r,t,n),x(i.body,t,n,r);else if(i.op===`ifelse`)y(i.cond.l,t,n),y(i.cond.r,t,n),x(i.body,t,n,r),x(i.elseBody,t,n,r);else if(i.op===`call`)i.args.forEach(e=>y(e.e,t,n));else{if(te.has(i.op)&&r===`2d`)throw m(i.tok,`Polecenie „${i.tok.text}” działa tylko w trybie 3D.`);if(!(`args`in i))continue;for(let e of i.args)y(e.e,t,n);i.op===`width`&&i.args.forEach(e=>ae(e,e=>b(e,1,12),`Grubość linii musi być liczbą całkowitą od 1 do 12.`))}}}function oe(e){let n=[],r=e=>{try{e()}catch(e){if(e instanceof t)n.push(e);else throw e}},i=new Set;v(e.top,i),r(()=>x(e.top,i,!1,e.mode));for(let t of e.procs.values()){let n=new Set(i);for(let e of t.params)n.add(e.key);v(t.body,n),r(()=>x(t.body,n,!1,e.mode))}if(n.length)throw n.sort((e,t)=>e.line-t.line||e.column-t.column),n[0]}function S(e,t){let n=s(e),r=re(n),i=new Map,a={top:new ie(n,r,i).block(null),procs:i,mode:t};return oe(a),a}var se=1e4,ce=1e4,le=1e5,ue=`#16866a`,de=1e-9,C=class{},fe=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],pe=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],w=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],T=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],me=e=>w(e,1/Math.hypot(e[0],e[1],e[2])),E=e=>Math.abs(e)<1e-9?0:Math.round(e*1e9)/1e9,he=e=>[E(e[0]),E(e[1]),E(e[2])],ge=(e,t)=>Math.hypot(e[0]-t[0],e[1]-t[1],e[2]-t[2]);function _e(){return{pos:[0,0,0],h:[0,1,0],r:[1,0,0],u:[0,0,1],pen:!0,color:ue,width:3}}var ve=class{prog;segments=[];turtle=_e();globals=new Map;topFrame={locals:this.globals,top:!0};ops=0;frames=0;constructor(e){this.prog=e}*execute(){try{yield*this.block(this.prog.top,{frame:this.topFrame,rep:void 0})}catch(e){if(!(e instanceof C))throw e}}*block(e,t){for(let n of e)yield n.tok,yield*this.statement(n,t)}tick(e){if(++this.ops>1e4)throw m(e,`Przekroczono limit ${se} wykonanych operacji.`)}enterFrame(e){if(this.frames>=32)throw m(e,`Przekroczono limit 32 zagnieżdżonych wywołań i powtórzeń.`);this.frames++}lookup(e,t){let n=t.frame.locals.get(e);return n!==void 0||t.frame.top?n:this.globals.get(e)}value(e,t){return h(e.e,{get:e=>this.lookup(e,t),rep:t.rep},e.tok)}*statement(e,t){switch(this.tick(e.tok),e.op){case`fd`:return this.moveBy(this.value(e.args[0],t),e);case`bk`:return this.moveBy(-this.value(e.args[0],t),e);case`rt`:return this.rotate(this.value(e.args[0],t),e,`turnRight`);case`lt`:return this.rotate(-this.value(e.args[0],t),e,`turnRight`);case`pitchup`:return this.rotate(this.value(e.args[0],t),e,`pitch`);case`pitchdown`:return this.rotate(-this.value(e.args[0],t),e,`pitch`);case`rollright`:return this.rotate(this.value(e.args[0],t),e,`roll`);case`rollleft`:return this.rotate(-this.value(e.args[0],t),e,`roll`);case`pu`:this.turtle.pen=!1;return;case`pd`:this.turtle.pen=!0;return;case`color`:this.turtle.color=e.value;return;case`width`:{let n=this.value(e.args[0],t);if(!Number.isInteger(n)||n<1||n>12)throw m(e.args[0].tok,`Grubość linii musi być liczbą całkowitą od 1 do 12.`);this.turtle.width=n;return}case`home`:return this.home(e.tok);case`cs`:this.segments=[];return;case`stop`:throw new C;case`let`:{let n=this.value(e.value,t);t.frame.locals.set(e.name,n);return}case`repeat`:{let n=this.value(e.count,t);if(!Number.isInteger(n)||n<0||n>1e4)throw m(e.count.tok,`Liczba powtórzeń musi być liczbą całkowitą od 0 do ${_}.`);this.enterFrame(e.tok);try{for(let r=1;r<=n;r++)yield*this.block(e.body,{frame:t.frame,rep:r}),this.tick(e.tok)}finally{this.frames--}return}case`if`:this.condition(e.cond,t)&&(yield*this.block(e.body,t),this.tick(e.tok));return;case`ifelse`:{let n=this.condition(e.cond,t)?e.body:e.elseBody;yield*this.block(n,t),this.tick(e.tok);return}case`call`:{let n=this.prog.procs.get(e.name),r=e.args.map(e=>this.value(e,t)),i=new Map;n.params.forEach((e,t)=>i.set(e.key,r[t])),this.enterFrame(e.tok);try{yield*this.block(n.body,{frame:{locals:i,top:!1},rep:void 0})}catch(e){if(!(e instanceof C))throw e}finally{this.frames--}this.tick(e.tok);return}}}condition(e,t){let n={get:e=>this.lookup(e,t),rep:t.rep};return ee(e.op,h(e.l,n,e.tok),h(e.r,n,e.tok))}segment(e,t,n){if(this.segments.length>=1e4)throw m(n,`Przekroczono limit ${ce} odcinków.`);let r=this.turtle;this.segments.push({from:e,to:t,color:r.color,width:r.width})}moveBy(e,t){let n=this.turtle,r=n.pos,i=he(T(r,w(n.h,e)));if(i.some(e=>Math.abs(e)>1e5))throw m(t.tok,`Żółw wyszedł poza zakres współrzędnych ±${le}.`);n.pen&&ge(r,i)>de&&this.segment(r,i,t.tok),n.pos=i}home(e){let t=this.turtle;t.pen&&ge(t.pos,[0,0,0])>de&&this.segment(t.pos,[0,0,0],e),t.pos=[0,0,0],t.h=[0,1,0],t.r=[1,0,0],t.u=[0,0,1]}rotate(e,t,n){let r=this.turtle,i=e*Math.PI/180,a=Math.cos(i),o=Math.sin(i);if(n===`turnRight`){let e=T(w(r.h,a),w(r.r,o));r.r=T(w(r.r,a),w(r.h,-o)),r.h=e}else if(n===`pitch`){let e=T(w(r.h,a),w(r.u,o));r.u=T(w(r.u,a),w(r.h,-o)),r.h=e}else{let e=T(w(r.u,a),w(r.r,o));r.r=T(w(r.r,a),w(r.u,-o)),r.u=e}this.orthonormalise()}orthonormalise(){let e=this.turtle;e.h=me(e.h),e.r=me(T(e.r,w(e.h,-fe(e.r,e.h)))),e.u=pe(e.r,e.h)}},ye=class{machine;gen;current=null;done=!1;error=null;constructor(e){this.machine=new ve(e),this.gen=this.machine.execute(),this.advance(()=>this.gen.next())}step(){this.done||this.advance(()=>this.gen.next())}runToEnd(){for(;!this.done;)this.step()}advance(e){try{let t=e();t.done?(this.done=!0,this.current=null):this.current=t.value}catch(e){if(this.done=!0,e instanceof t)this.error={message:e.message,line:e.line,column:e.column},this.current={line:e.line,col:e.column};else throw e}}};function D(e,n){let r;try{r=S(e,n)}catch(e){if(e instanceof t)return{segments:[],error:{message:e.message,line:e.line,column:e.column}};throw e}let i=new ye(r);return i.runToEnd(),{segments:i.machine.segments,error:i.error}}function be(e,n){try{return S(e,n),null}catch(e){if(e instanceof t)return{message:e.message,line:e.line,column:e.column};throw e}}var O=[{id:`kwadrat`,title:`Kwadrat`,mode:`2d`,task:`Narysuj kwadrat o boku 100. Zacznij w punkcie startowym (0, 0), żółw patrzy w górę.`,reference:`powtorz 4 [np 100 pw 90]`},{id:`trojkat`,title:`Trójkąt równoboczny`,mode:`2d`,task:`Narysuj trójkąt równoboczny o boku 100, zaczynając w (0, 0), żółw patrzy w górę.`,reference:`powtorz 3 [np 100 pw 120]`},{id:`szesciokat`,title:`Sześciokąt w procedurze`,mode:`2d`,task:`Napisz procedurę (słowo oto) rysującą sześciokąt foremny o boku podanym jako parametr, a potem wywołaj ją z bokiem 60.`,reference:`oto szesciokat ma: bok
  powtorz 6 [np bok pw 60]
juz

szesciokat 60`,requires:[{pattern:/(^|\s)(oto|to)\s/im,hint:`Zadanie wymaga procedury: użyj słowa oto.`}]},{id:`gwiazda`,title:`Pięcioramienna gwiazda`,mode:`2d`,task:`Narysuj gwiazdę o pięciu ramionach, każde długie na 100, z kątem skrętu 144 stopnie. Start: (0, 0).`,reference:`powtorz 5 [np 100 pw 144]`},{id:`drabinka`,title:`Rosnące odcinki`,mode:`2d`,task:`Narysuj pięć odcinków: pierwszy długości 20, każdy następny o 20 dłuższy, a między nimi skręt o 90 stopni w prawo. Użyj nrpowt.`,reference:`powtorz 5 [np nrpowt * 20 pw 90]`,requires:[{pattern:/nrpowt|repcount/i,hint:`Zadanie wymaga użycia nrpowt, czyli numeru powtórzenia.`}]},{id:`pionowy-kwadrat`,title:`Pionowy kwadrat w 3D`,mode:`3d`,task:`W trybie 3D narysuj kwadrat o boku 100 leżący w pionie, w płaszczyźnie XZ. Start: (0, 0, 0), żółw patrzy w górę (gora 90 przechyla nos).`,reference:`gora 90
powtorz 4 [np 100 pw 90]`}];function xe(e){return O.find(t=>t.id===e)}var k=[{name:`kwadrat`,mode:`2d`,description:`Cztery kroki do pierwszego rysunku.`,source:`; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]
`},{name:`gwiazda`,mode:`2d`,description:`Mała zmiana kąta, wielka różnica.`,source:`; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]
`},{name:`rozeta`,mode:`2d`,description:`Jeden kwadrat. Wiele możliwości.`,source:`; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]
`},{name:`spirala`,mode:`2d`,description:`Licznik powtórzeń i zmienna zmieniają kolor.`,source:`; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]
`},{name:`wielokaty`,mode:`2d`,description:`Procedura liczy kąt z liczby boków.`,source:`; Jedna procedura, wiele figur: kąt liczy się sam.
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
`},{name:`drzewo`,mode:`2d`,description:`Gałąź rysuje dwie mniejsze gałęzie.`,source:`; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
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
`},{name:`sniezynka`,mode:`2d`,description:`Krzywa Kocha z czterech poziomów.`,source:`; Krzywa Kocha: każdy odcinek dzieli się na cztery.
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
`},{name:`schody`,mode:`3d`,description:`Pierwszy krok w trzeci wymiar.`,source:`; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]
`},{name:`szescian`,mode:`3d`,description:`Zbuduj bryłę z prostych poleceń.`,source:`; Dwa kwadraty połączone krawędziami.
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
`},{name:`pierscien`,mode:`3d`,description:`Okrąg przechylony w przestrzeni.`,source:`; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]
`},{name:`kula`,mode:`3d`,description:`Okręgi obrócone wokół kierunku żółwia.`,source:`; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]
`},{name:`helisa`,mode:`3d`,description:`Spirala wznosi się obrót po obrocie.`,source:`; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]
`},{name:`drzewo3d`,mode:`3d`,description:`Gałęzie obracają się wokół pnia.`,source:`; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
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
`}],A=1.5,Se=1;function j(e){let t=[];for(let n of e){let[e,r]=[n.from,n.to],i=Math.hypot(r[0]-e[0],r[1]-e[1],r[2]-e[2]),a=Math.max(1,Math.ceil(i/Se));for(let n=0;n<=a;n++){let i=n/a;t.push([e[0]+(r[0]-e[0])*i,e[1]+(r[1]-e[1])*i,e[2]+(r[2]-e[2])*i])}}return t}var M=class{cells=new Map;constructor(e){for(let t of e){let e=this.key(Math.floor(t[0]/A),Math.floor(t[1]/A),Math.floor(t[2]/A)),n=this.cells.get(e);n?n.push(t):this.cells.set(e,[t])}}key(e,t,n){return`${e},${t},${n}`}near(e){let t=Math.floor(e[0]/A),n=Math.floor(e[1]/A),r=Math.floor(e[2]/A);for(let i=-1;i<=1;i++)for(let a=-1;a<=1;a++)for(let o=-1;o<=1;o++)if(this.cells.get(this.key(t+i,n+a,r+o))?.some(t=>Math.hypot(e[0]-t[0],e[1]-t[1],e[2]-t[2])<=1.5))return!0;return!1}},N=e=>`(${e.map(e=>Math.round(e)).join(`, `)})`;function P(e,t){for(let n of e)if(!t.near(n))return n;return null}function Ce(e,t){for(let n of t.requires??[])if(!n.pattern.test(e))return{passed:!1,reason:n.hint};let n=D(e,t.mode);if(n.error){let{line:e,column:t,message:r}=n.error;return{passed:!1,reason:`Program zawiera błąd (wiersz ${e}, kolumna ${t}): ${r}`}}if(n.segments.length===0)return{passed:!1,reason:`Nic nie narysowano. Sprawdź, czy żółw ma opuszczone pióro (opu).`};let r=j(D(t.reference,t.mode).segments),i=j(n.segments),a=P(r,new M(i));if(a)return{passed:!1,reason:`Brakuje fragmentu rysunku w punkcie ${N(a)}.`};let o=P(i,new M(r));return o?{passed:!1,reason:`Rysunek ma linię, której nie ma we wzorze, w punkcie ${N(o)}.`}:{passed:!0,reason:`Zgadza się! Rysunek pasuje do wzoru.`}}var F=e=>e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]);function I(e){try{return localStorage.getItem(e)}catch{return null}}function L(e,t){try{localStorage.setItem(e,t)}catch{}}function we(e){try{localStorage.removeItem(e)}catch{}}var R=`logomocja.motyw`,Te=window.matchMedia(`(prefers-color-scheme: dark)`);function Ee(){let e=I(R);return e===`light`||e===`dark`?e:`system`}function De(e){e===`system`?(we(R),delete document.documentElement.dataset.theme):(L(R,e),document.documentElement.dataset.theme=e),window.dispatchEvent(new Event(`logomocja:theme`))}Te.addEventListener(`change`,()=>window.dispatchEvent(new Event(`logomocja:theme`)));var Oe={system:`systemowy`,light:`jasny`,dark:`ciemny`};function z(e){return getComputedStyle(document.documentElement).getPropertyValue(e).trim()}function ke(e){let t=``;for(let n of new TextEncoder().encode(e))t+=String.fromCharCode(n);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function Ae(e){try{let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=atob(t+`=`.repeat((4-t.length%4)%4)),r=Uint8Array.from(n,e=>e.charCodeAt(0));return new TextDecoder(`utf-8`,{fatal:!0}).decode(r)}catch{return null}}function je(e){return e===`2d`||e===`3d`?e:null}function Me(){let e=location.hash.replace(/^#/,``)||`/`,t=e.indexOf(`?`),n=t===-1?e:e.slice(0,t),r=new URLSearchParams(t===-1?``:e.slice(t+1));return{path:n||`/`,query:r}}function Ne(e,t){let n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=e,document.body.append(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}function Pe(e){return e.replace(/[^\p{L}\p{N}_-]+/gu,`-`).replace(/^-+|-+$/g,``)||`program`}function Fe(){try{let e=document.createElement(`canvas`);return!!(e.getContext(`webgl2`)||e.getContext(`webgl`))}catch{return!1}}var B=class{canvas;ctx;resizer;pointers=new Map;pinchDist=0;scale=4;ox=0;oy=0;w=0;h=0;segments=[];turtle=null;constructor(e){this.canvas=document.createElement(`canvas`),this.canvas.className=`view-canvas`,this.canvas.tabIndex=0,this.canvas.setAttribute(`role`,`img`),this.canvas.setAttribute(`aria-label`,`Płaszczyzna rysunku. Strzałki przesuwają widok, plus i minus powiększają.`),e.append(this.canvas),this.ctx=this.canvas.getContext(`2d`),this.resizer=new ResizeObserver(()=>this.resize()),this.resizer.observe(e),this.canvas.addEventListener(`pointerdown`,this.onDown),this.canvas.addEventListener(`pointermove`,this.onMove),this.canvas.addEventListener(`pointerup`,this.onUp),this.canvas.addEventListener(`pointercancel`,this.onUp),this.canvas.addEventListener(`wheel`,this.onWheel,{passive:!1}),this.canvas.addEventListener(`keydown`,this.onKey),this.resize()}dispose(){this.resizer.disconnect(),this.canvas.remove()}resize(){let e=window.devicePixelRatio||1,t=this.canvas.parentElement.getBoundingClientRect(),n=Math.max(1,Math.floor(t.width)),r=Math.max(1,Math.floor(t.height));if(n===this.w&&r===this.h&&this.canvas.width===Math.floor(n*e))return;let i=this.w===0;this.w=n,this.h=r,this.canvas.width=Math.floor(n*e),this.canvas.height=Math.floor(r*e),this.canvas.style.width=`${n}px`,this.canvas.style.height=`${r}px`,i&&(this.ox=n/2,this.oy=r/2),this.paint()}setTheme(){this.paint()}draw(e,t){this.segments=e,this.turtle=t,this.paint()}fit(e,t){let n=[[0,0]];for(let t of e)n.push([t.from[0],t.from[1]],[t.to[0],t.to[1]]);t&&n.push([t.pos[0],t.pos[1]]);let r=1/0,i=-1/0,a=1/0,o=-1/0;for(let[e,t]of n)r=Math.min(r,e),i=Math.max(i,e),a=Math.min(a,t),o=Math.max(o,t);let s=Math.max(i-r,20),c=Math.max(o-a,20),l=Math.min(this.w*.85/s,this.h*.85/c);this.scale=Math.min(Math.max(l,1e-4),1e4);let u=(r+i)/2,d=(a+o)/2;this.ox=this.w/2-u*this.scale,this.oy=this.h/2+d*this.scale,this.paint()}zoom(e){this.zoomAt(this.w/2,this.h/2,e)}zoomAt(e,t,n){let r=Math.min(Math.max(this.scale*n,1e-4),1e4),i=r/this.scale;this.ox=e-(e-this.ox)*i,this.oy=t-(t-this.oy)*i,this.scale=r,this.paint()}pan(e,t){this.ox+=e,this.oy+=t,this.paint()}exportPng(){return this.paint(),new Promise((e,t)=>this.canvas.toBlob(n=>n?e(n):t(Error(`Nie udało się zapisać obrazu.`)),`image/png`))}toScreen(e,t){return[this.ox+e*this.scale,this.oy-t*this.scale]}paint(){if(!this.w)return;let e=this.ctx,t=window.devicePixelRatio||1;e.setTransform(t,0,0,t,0,0),e.fillStyle=z(`--canvas-bg`)||`#fff`,e.fillRect(0,0,this.w,this.h),this.paintGrid(),e.lineCap=`round`,e.lineJoin=`round`;for(let t of this.segments){let[n,r]=this.toScreen(t.from[0],t.from[1]),[i,a]=this.toScreen(t.to[0],t.to[1]);e.strokeStyle=t.color,e.lineWidth=t.width,e.beginPath(),e.moveTo(n,r),e.lineTo(i,a),e.stroke()}this.paintOrigin(),this.turtle&&this.paintTurtle(this.turtle)}paintGrid(){let e=this.ctx,t=80/this.scale,n=10**Math.floor(Math.log10(t)),r=[1,2,5,10].map(e=>e*n).find(e=>e*this.scale>=40)??n,i=Math.floor((0-this.ox)/this.scale/r)*r,a=(this.w-this.ox)/this.scale,o=(this.oy-this.h)/this.scale,s=Math.ceil((this.oy-0)/this.scale/r)*r;e.fillStyle=z(`--grid`)||`#ddd`;for(let t=i;t<=a;t+=r)for(let n=Math.floor(o/r)*r;n<=s;n+=r){let[r,i]=this.toScreen(t,n);e.fillRect(Math.round(r)-1,Math.round(i)-1,2,2)}}paintOrigin(){let e=this.ctx,[t,n]=this.toScreen(0,0);e.strokeStyle=z(`--axis`)||`#888`,e.lineWidth=1,e.beginPath(),e.moveTo(0,Math.round(n)+.5),e.lineTo(this.w,Math.round(n)+.5),e.moveTo(Math.round(t)+.5,0),e.lineTo(Math.round(t)+.5,this.h),e.stroke(),e.fillStyle=z(`--muted`)||`#666`,e.font=`12px system-ui, sans-serif`,e.fillText(`0,0`,t+6,n+14)}paintTurtle(e){let t=this.ctx,[n,r]=this.toScreen(e.pos[0],e.pos[1]),i=e.h[0],a=-e.h[1],o=Math.hypot(i,a)||1,s=i/o,c=a/o,l=[n+s*13,r+c*13],u=[n-s*6-c*7,r-c*6+s*7],d=[n-s*6+c*7,r-c*6-s*7];t.beginPath(),t.moveTo(l[0],l[1]),t.lineTo(u[0],u[1]),t.lineTo(d[0],d[1]),t.closePath();let f=z(`--turtle`)||`#c1763d`;t.fillStyle=e.pen?f:`transparent`,t.strokeStyle=f,t.lineWidth=2,t.fill(),t.stroke()}onDown=e=>{this.canvas.setPointerCapture(e.pointerId),this.canvas.focus({preventScroll:!0}),this.pointers.set(e.pointerId,{x:e.offsetX,y:e.offsetY}),this.pointers.size===2&&(this.pinchDist=this.spread())};onMove=e=>{let t=this.pointers.get(e.pointerId);if(!t)return;let n={x:e.offsetX,y:e.offsetY};if(this.pointers.set(e.pointerId,n),this.pointers.size===1)this.pan(n.x-t.x,n.y-t.y);else if(this.pointers.size===2){let e=this.spread();if(this.pinchDist>0&&e>0){let[t,n]=[...this.pointers.values()];this.zoomAt((t.x+n.x)/2,(t.y+n.y)/2,e/this.pinchDist)}this.pinchDist=e}};onUp=e=>{this.pointers.delete(e.pointerId),this.pinchDist=this.pointers.size===2?this.spread():0};spread(){let[e,t]=[...this.pointers.values()];return e&&t?Math.hypot(e.x-t.x,e.y-t.y):0}onWheel=e=>{e.preventDefault(),this.zoomAt(e.offsetX,e.offsetY,Math.exp(-e.deltaY*.0015))};onKey=e=>{let t={ArrowLeft:()=>this.pan(40,0),ArrowRight:()=>this.pan(-40,0),ArrowUp:()=>this.pan(0,40),ArrowDown:()=>this.pan(0,-40),"+":()=>this.zoom(1.25),"=":()=>this.zoom(1.25),"-":()=>this.zoom(.8),"−":()=>this.zoom(.8)}[e.key];t&&(e.preventDefault(),t())}},Ie=/;.*|"[^"]*"?|\d+(?:\.\d+)?|\.\d+|[\p{L}_][\p{L}\p{N}_]*|:[\p{L}_][\p{L}\p{N}_]*|<>|<=|>=|[<>=+\-*/]|[[\]()]|,|\s+|[^]/gu;function Le(e){if(e.startsWith(`;`))return`com`;if(e.startsWith(`"`))return`str`;if(/^(\d|\.\d)/.test(e))return`num`;if(e.startsWith(`:`))return`name`;if(/^[\p{L}_]/u.test(e)){let t=e.normalize(`NFC`).toLowerCase();return l.has(t)||u.has(t)||d.has(t)||f.has(t)?`kw`:`name`}return/^[[\]()]$/.test(e)?`br`:/^(<>|<=|>=|[<>=+\-*/])$/.test(e)?`op`:``}function Re(e,t){let n=``,r=0,i=!1;for(let a of e.matchAll(Ie)){let e=a[0],o=Le(e),s=r;r+=e.length;let c=t!==void 0&&t-1>=s&&t-1<r?t-1-s:-1;if(c===-1)n+=o?`<span class="${o}">${F(e)}</span>`:F(e);else{let t=e.slice(0,c),r=e[c],a=e.slice(c+1);t&&(n+=o?`<span class="${o}">${F(t)}</span>`:F(t)),n+=`<span class="err-char">${F(r)}</span>`,a&&(n+=o?`<span class="${o}">${F(a)}</span>`:F(a)),i=!0}}return t!==void 0&&!i&&t-1>=r&&(n+=`<span class="err-char eol"> </span>`),n}var ze=class{onInput;textarea;overlay;gutter;execPos=null;errorPos=null;frame=0;lineCount=0;lastKey=``;constructor(e,t){this.onInput=t,e.innerHTML=`
      <div class="editor">
        <div class="gutter" aria-hidden="true"></div>
        <div class="code">
          <div class="code-overlay" aria-hidden="true"></div>
          <textarea class="code-input" id="program" aria-label="Program w języku Logo. Ctrl+Enter uruchamia program."
            spellcheck="false" wrap="off" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
        </div>
      </div>`,this.textarea=e.querySelector(`textarea`),this.overlay=e.querySelector(`.code-overlay`),this.gutter=e.querySelector(`.gutter`),this.textarea.addEventListener(`input`,()=>{this.scheduleRender(),this.onInput()}),this.textarea.addEventListener(`scroll`,()=>this.syncScroll()),this.render()}get value(){return this.textarea.value}set value(e){this.textarea.value=e,this.textarea.scrollTop=0,this.textarea.scrollLeft=0,this.render()}setMarks(e,t){let n=e?.line!==this.execPos?.line;this.execPos=e,this.errorPos=t,this.render(),e&&n&&this.revealLine(e.line)}focus(){this.textarea.focus({preventScroll:!0})}scheduleRender(){cancelAnimationFrame(this.frame),this.frame=requestAnimationFrame(()=>this.render())}render(){let e=this.textarea.value,t=`${e}\u0000${this.execPos?.line}\u0000${this.errorPos?.line}:${this.errorPos?.col}`;if(t===this.lastKey)return;this.lastKey=t;let n=e.split(`
`),r=n.map((e,t)=>{let n=t+1,r=[`ln`];this.execPos?.line===n&&r.push(`exec`);let i=this.errorPos?.line===n?this.errorPos.col:void 0;return i!==void 0&&r.push(`err-line`),`<div class="${r.join(` `)}">${Re(e,i)||`&#8203;`}</div>`}).join(``);this.overlay.innerHTML=r,(n.length!==this.lineCount||this.gutter.childElementCount===0)&&(this.lineCount=n.length,this.gutter.innerHTML=n.map((e,t)=>`<div class="gn">${t+1}</div>`).join(``)),[...this.gutter.children].forEach((e,t)=>{e.classList.toggle(`exec`,this.execPos?.line===t+1),e.classList.toggle(`err`,this.errorPos?.line===t+1)}),this.syncScroll()}syncScroll(){this.overlay.scrollTop=this.textarea.scrollTop,this.overlay.scrollLeft=this.textarea.scrollLeft,this.gutter.scrollTop=this.textarea.scrollTop}revealLine(e){let t=parseFloat(getComputedStyle(this.textarea).lineHeight)||22,n=(e-1)*t,r=n+t,i=this.textarea;n<i.scrollTop?i.scrollTop=n:r>i.scrollTop+i.clientHeight&&(i.scrollTop=r-i.clientHeight),this.syncScroll()}},Be=`logomocja.postep`;function V(){try{let e=JSON.parse(I(Be)??`[]`);return Array.isArray(e)?e.filter(e=>typeof e==`string`):[]}catch{return[]}}function Ve(e){let t=new Set(V());t.add(e),L(Be,JSON.stringify([...t]))}var He=`modulepreload`,Ue=function(e){return`/Logomocja/builds/v2-e2-claude-claude-haiku-5-5-20261028-101757Z/`+e},We={},Ge=function(e){return e.pathname.endsWith(`.css`)},Ke=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},qe=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=Ue(t,n);let r=s(t),i=Ge(r);return Ke(We,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:He,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${r}`)))})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},H=11,U=`logomocja.kopia`,Je=`logomocja.tryb`,W=e=>e.kind===`mode`?`logomocja.szkic.${e.mode}`:`logomocja.wyzwanie.${e.challenge.id}`,Ye=e=>e>=H?1/0:2**e,Xe=e=>e>=H?`natychmiast`:`${2**e} krok/s`,Ze=`
  <div class="studio">
    <section class="pane pane-code" aria-labelledby="h-code">
      <h2 id="h-code" class="visually-hidden">Program</h2>
      <div class="toolbar" role="toolbar" aria-label="Sterowanie programem">
        <div class="seg" role="radiogroup" aria-label="Tryb rysowania">
          <button type="button" role="radio" data-mode="2d" aria-checked="true">2D</button>
          <button type="button" role="radio" data-mode="3d" aria-checked="false">3D</button>
        </div>
        <button type="button" class="btn primary" data-act="run" title="Uruchom (Ctrl+Enter)">Uruchom</button>
        <button type="button" class="btn" data-act="step" title="Krok (F10)">Krok</button>
        <button type="button" class="btn" data-act="pause" title="Pauza lub wznowienie (F9)" disabled>Pauza</button>
        <button type="button" class="btn" data-act="reset" title="Zatrzymaj i wyczyść rysunek (Esc)">Reset</button>
        <label class="tempo">Tempo
          <input type="range" min="0" max="${H}" value="6" data-tempo />
          <output data-tempo-out>${Xe(6)}</output>
        </label>
      </div>
      <div class="toolbar sub" role="toolbar" aria-label="Pliki i przykłady">
        <label class="inline">Przykład
          <select data-examples></select>
        </label>
        <button type="button" class="btn" data-act="load-example">Wczytaj przykład</button>
        <button type="button" class="btn" data-act="open">Otwórz plik</button>
        <button type="button" class="btn" data-act="download">Pobierz .logo</button>
        <button type="button" class="btn" data-act="share">Kopiuj link</button>
        <button type="button" class="btn" data-act="undo" disabled>Cofnij wczytanie</button>
      </div>
      <div class="editor-host" data-editor></div>
      <div class="messages">
        <p class="status" data-status role="status" aria-live="polite"></p>
        <p class="error" data-error role="alert"></p>
      </div>
      <div class="challenge" data-challenge hidden></div>
    </section>
    <section class="pane pane-view" aria-labelledby="h-view">
      <h2 id="h-view" class="visually-hidden">Rysunek</h2>
      <div class="toolbar" role="toolbar" aria-label="Widok rysunku">
        <button type="button" class="btn" data-act="fit">Dopasuj</button>
        <button type="button" class="btn icon" data-act="zoom-in" aria-label="Powiększ">+</button>
        <button type="button" class="btn icon" data-act="zoom-out" aria-label="Pomniejsz">&minus;</button>
        <button type="button" class="btn" data-act="reset-view" data-only-3d>Widok domyślny</button>
        <button type="button" class="btn" data-act="png">Zapisz PNG</button>
      </div>
      <div class="view-host" data-view></div>
      <p class="view-note" data-note></p>
    </section>
    <input type="file" accept=".logo,.txt,text/plain" hidden data-file />
  </div>`,Qe=class{root;doc;editor;view=null;viewToken=0;mode;exec=null;state=`idle`;error=null;raf=0;lastTs=0;carry=0;tempo=6;saveTimer=0;liveTimer=0;backup=null;verdict=null;q=e=>this.root.querySelector(e);onKey=e=>this.keyboard(e);onTheme=()=>this.view?.setTheme();destroyed=!1;ready;constructor(e,t){this.root=e,this.doc=t,this.mode=t.kind===`mode`?t.mode:t.challenge.mode,this.root.innerHTML=Ze,this.editor=new ze(this.q(`[data-editor]`),()=>this.onEdit()),this.populateExamples(),this.renderChallengePanel(),this.restoreBackup();let n=I(W(t));this.editor.value=n??(t.kind===`challenge`?``:`powtorz 4 [np 100 pw 90]
`),this.bind(),this.ready=this.useView(this.mode,!0).then(()=>void 0),this.updateControls(),this.setStatus(t.kind===`challenge`?`Napisz program i kliknij „Sprawdź”.`:`Gotowe. Uruchom program (Ctrl+Enter) albo wybierz przykład.`),this.checkLive(),window.addEventListener(`keydown`,this.onKey),window.addEventListener(`logomocja:theme`,this.onTheme)}destroy(){this.destroyed||(this.destroyed=!0,this.stopLoop(),clearTimeout(this.liveTimer),this.flushDraft(),window.removeEventListener(`keydown`,this.onKey),window.removeEventListener(`logomocja:theme`,this.onTheme),this.viewToken++,this.view?.dispose?.(),this.view=null)}flushDraft(){clearTimeout(this.saveTimer),L(W(this.doc),this.editor.value)}get source(){return this.editor.value}bind(){this.root.querySelectorAll(`[data-mode]`).forEach(e=>e.addEventListener(`click`,()=>this.switchMode(e.dataset.mode))),this.root.querySelectorAll(`[data-act]`).forEach(e=>e.addEventListener(`click`,()=>this.act(e.dataset.act)));let e=this.q(`[data-tempo]`);e.addEventListener(`input`,()=>{this.tempo=Number(e.value),this.q(`[data-tempo-out]`).textContent=Xe(this.tempo)}),this.q(`[data-file]`).addEventListener(`change`,e=>this.openFile(e))}populateExamples(){let e=this.q(`[data-examples]`);e.innerHTML=[`2d`,`3d`].map(e=>`<optgroup label="${e===`2d`?`Płaszczyzna 2D`:`Przestrzeń 3D`}">${k.filter(t=>t.mode===e).map(e=>`<option value="${e.name}">${F(e.name)} — ${F(e.description)}</option>`).join(``)}</optgroup>`).join(``),this.doc.kind===`challenge`&&(e.closest(`label`).hidden=!0,this.q(`[data-act="load-example"]`).hidden=!0)}act(e){switch(e){case`run`:return this.start();case`step`:return this.step();case`pause`:return this.togglePause();case`reset`:return this.reset();case`load-example`:return this.loadExampleByName(this.q(`[data-examples]`).value);case`open`:return this.q(`[data-file]`).click();case`download`:return this.downloadProgram();case`share`:return this.shareLink();case`undo`:return this.undoLoad();case`fit`:return this.fit();case`zoom-in`:return this.view instanceof B&&this.view.zoom(1.25);case`zoom-out`:return this.view instanceof B&&this.view.zoom(.8);case`reset-view`:return this.view?.reset?.();case`png`:return this.exportPng();case`check`:return this.check();case`show-reference`:return this.showReference()}}keyboard(e){this.destroyed||document.querySelector(`dialog[open]`)||((e.ctrlKey||e.metaKey)&&e.key===`Enter`?(e.preventDefault(),this.start()):e.key===`F10`?(e.preventDefault(),this.step()):e.key===`F9`?(e.preventDefault(),this.togglePause()):e.key===`Escape`&&document.activeElement?.closest(`.pane-code, .pane-view`)&&this.reset())}onEdit(){clearTimeout(this.saveTimer),this.saveTimer=window.setTimeout(()=>L(W(this.doc),this.editor.value),400),this.state===`running`||this.state===`paused`?(this.stopLoop(),this.exec=null,this.state=`idle`,this.error=null,this.drawNow(),this.setStatus(`Program został zmieniony w czasie rysowania: rysunek wyczyszczono. Uruchom ponownie.`)):this.state===`done`&&this.setStatus(`Program zmieniony od ostatniego uruchomienia. Uruchom ponownie, aby zobaczyć efekt.`),this.verdict=null,this.renderChallengePanel(),clearTimeout(this.liveTimer),this.liveTimer=window.setTimeout(()=>this.checkLive(),250),this.updateControls()}checkLive(){if(this.state===`running`||this.state===`paused`)return;let e=be(this.editor.value,this.mode);this.error=e,this.showError(),this.editor.setMarks(null,e?{line:e.line,col:e.column}:null)}showError(){let e=this.q(`[data-error]`);e.textContent=this.error?`Wiersz ${this.error.line}, kolumna ${this.error.column}: ${this.error.message}`:``,e.classList.toggle(`visible`,!!this.error)}setStatus(e){this.q(`[data-status]`).textContent=e}writeEditor(e){this.editor.value=e,L(W(this.doc),e)}loadText(e,t){let n=this.editor.value;this.stopLoop(),this.exec=null,this.state=`idle`,this.error=null,n.trim()!==``&&n!==e&&(this.backup={key:W(this.doc),text:n,label:t},L(U,JSON.stringify(this.backup))),this.writeEditor(e),this.verdict=null,this.renderChallengePanel(),this.drawNow(),this.checkLive(),this.setStatus(`Wczytano: ${t}.${this.backup?` Poprzedni szkic można przywrócić przyciskiem „Cofnij wczytanie”.`:``}`),this.updateControls()}restoreBackup(){try{let e=I(U);this.backup=e?JSON.parse(e):null}catch{this.backup=null}}undoLoad(){if(!this.backup)return;let e=this.backup;L(e.key,e.text),this.backup=null,we(U),e.key===W(this.doc)?(this.stopLoop(),this.exec=null,this.state=`idle`,this.editor.value=e.text,this.checkLive(),this.drawNow(),this.setStatus(`Przywrócono poprzedni szkic.`)):this.setStatus(`Poprzedni szkic przywrócono w innym trybie.`),this.updateControls()}loadExampleByName(e){let t=k.find(t=>t.name===e);t&&this.doc.kind===`mode`&&this.loadExample(t)}loadExample(e){if(this.doc.kind!==`mode`)return;let t=`przykład „${e.name}” (${e.mode.toUpperCase()})`;e.mode===this.mode?this.loadText(e.source,t):this.switchMode(e.mode).then(()=>this.loadText(e.source,t))}loadFromLink(e,t){let n=()=>{this.loadText(e,`program z linku`),this.start()};this.doc.kind===`mode`&&t!==this.mode?this.switchMode(t).then(n):n()}openFile(e){let t=e.target,n=t.files?.[0];t.value=``,n&&(n.size>2e5?this.setStatus(`Plik jest zbyt duży, aby go wczytać.`):n.text().then(e=>this.loadText(e,`plik ${n.name}`)))}downloadProgram(){Ne(`${Pe(this.doc.kind===`challenge`?this.doc.challenge.id:`program-${this.mode}`)}.logo`,new Blob([this.editor.value],{type:`text/plain;charset=utf-8`})),this.setStatus(`Zapisano plik .logo.`)}shareLink(){let e=`${location.origin}${location.pathname}#/?m=${this.mode}&p=${ke(this.editor.value)}`,t=document.createElement(`dialog`);t.className=`share-dialog`,t.innerHTML=`
      <form method="dialog">
        <h2>Link do programu</h2>
        <p>Link zawiera program i tryb. Otwarcie go uruchamia program.</p>
        <label class="stack">Adres
          <textarea readonly rows="4" data-link>${F(e)}</textarea>
        </label>
        <p class="copy-result" role="status"></p>
        <div class="dialog-actions">
          <button type="button" class="btn primary" data-copy>Kopiuj</button>
          <button type="submit" class="btn">Zamknij</button>
        </div>
      </form>`,document.body.append(t);let n=t.querySelector(`[data-link]`),r=t.querySelector(`.copy-result`);t.querySelector(`[data-copy]`).addEventListener(`click`,async()=>{n.select();try{await navigator.clipboard.writeText(e),r.textContent=`Skopiowano do schowka.`}catch{document.execCommand(`copy`),r.textContent=`Zaznaczono adres: skopiuj go ręcznie (Ctrl+C).`}}),t.addEventListener(`close`,()=>t.remove()),t.showModal(),n.focus(),n.select()}async switchMode(e){this.doc.kind===`mode`&&e!==this.mode&&(this.flushDraft(),this.stopLoop(),this.exec=null,this.state=`idle`,this.mode=e,L(Je,e),this.editor.value=I(W(this.doc))??`powtorz 4 [np 100 pw 90]
`,this.checkLive(),await this.useView(e),this.updateControls())}async useView(e,t=!1){let n=++this.viewToken,r=this.q(`[data-view]`),i=e;if(e===`3d`&&!Fe()?(i=`2d`,this.q(`[data-note]`).textContent=`Tryb 3D wymaga WebGL, a ta przeglądarka go nie udostępnia. Rysowanie w 2D działa normalnie.`,this.doc.kind===`mode`&&(this.mode=`2d`)):this.q(`[data-note]`).textContent=``,this.view?.dispose?.(),this.view=null,r.innerHTML=``,i===`2d`)this.view=new B(r);else{let{View3D:e}=await qe(async()=>{let{View3D:e}=await import(`./view3d-DFu0RO8C.js`);return{View3D:e}},[]);if(n!==this.viewToken||this.destroyed)return;this.view=new e(r)}this.syncModeButtons(),this.drawNow(),t&&this.fit(),this.updateControls()}syncModeButtons(){this.root.querySelectorAll(`[data-mode]`).forEach(e=>{let t=e.dataset.mode===this.mode;e.setAttribute(`aria-checked`,String(t)),e.classList.toggle(`on`,t),e.disabled=this.doc.kind===`challenge`}),this.root.querySelectorAll(`[data-only-3d]`).forEach(e=>e.hidden=this.mode!==`3d`)}segments(){return this.exec?this.exec.machine.segments:[]}turtle(){return this.exec?this.exec.machine.turtle:null}drawNow(){this.view&&this.view.draw(this.segments(),this.turtle())}fit(){this.view?.fit(this.segments(),this.turtle())}exportPng(){this.view&&this.view.exportPng().then(e=>{Ne(`logomocja-${this.mode}-${Date.now()}.png`,e),this.setStatus(`Zapisano obraz PNG.`)})}prepare(){try{let e=S(this.editor.value,this.mode);return this.exec=new ye(e),this.error=null,!0}catch(e){let t=e;return this.exec=null,this.error={message:t.message??String(e),line:t.line??1,column:t.column??1},this.showError(),this.drawNow(),this.editor.setMarks(null,{line:this.error.line,col:this.error.column}),this.setStatus(`Program zawiera błąd. Nic nie zostało narysowane.`),!1}}start(){if(this.stopLoop(),!this.prepare())return this.updateControls();this.state=`running`,this.carry=0,this.setStatus(`Rysowanie…`),this.startLoop(),this.updateControls()}step(){if(this.state===`running`&&this.stopLoop(),!this.exec||this.exec.done)return this.prepare()&&(this.state=`paused`,this.render(),this.setStatus(`Krok po kroku: podświetlono następne polecenie. Krok wykonuje je.`)),this.updateControls();this.exec.step(),this.state=`paused`,this.render(),this.finishIfDone(),this.updateControls()}togglePause(){this.state===`running`?(this.stopLoop(),this.state=`paused`,this.setStatus(`Wstrzymano. Wznów (F9) albo wykonaj krok (F10).`),this.updateControls()):this.state===`paused`&&this.exec&&(this.state=`running`,this.startLoop(),this.updateControls())}reset(){this.stopLoop(),this.exec=null,this.state=`idle`,this.error=null,this.drawNow(),this.editor.setMarks(null,null),this.checkLive(),this.setStatus(`Zresetowano. Rysunek wyczyszczono.`),this.updateControls()}startLoop(){this.lastTs=performance.now(),cancelAnimationFrame(this.raf),this.raf=requestAnimationFrame(this.tick)}stopLoop(){cancelAnimationFrame(this.raf),this.raf=0}tick=e=>{if(!this.exec||this.state!==`running`)return;this.raf=requestAnimationFrame(this.tick);let t=Math.min(e-this.lastTs,100);this.lastTs=e;let n=Ye(this.tempo);if(n===1/0)this.exec.runToEnd();else for(this.carry+=n*t/1e3;this.carry>=1&&!this.exec.done;)this.exec.step(),--this.carry;this.render(),this.finishIfDone()};render(){this.view&&this.drawNow();let e=this.exec&&!this.exec.done?this.exec.current:null,t=this.exec?.error?{line:this.exec.error.line,col:this.exec.error.column}:null;this.editor.setMarks(e,t),this.exec?.error&&(this.error=this.exec.error,this.showError())}finishIfDone(){this.exec&&this.exec.done&&(this.stopLoop(),this.state=`done`,this.render(),this.fit(),this.exec.error?(this.state=`done`,this.setStatus(`Wykonanie przerwane błędem. Narysowano to, co zdążyło się wykonać.`)):this.setStatus(`Gotowe: narysowano ${this.exec.machine.segments.length} odcinków.`),this.updateControls())}updateControls(){let e=this.state,t=e=>this.q(e);t(`[data-act="pause"]`).disabled=!(e===`running`||e===`paused`&&this.exec),t(`[data-act="pause"]`).textContent=e===`running`?`Pauza`:`Wznów`,t(`[data-act="reset"]`).disabled=e===`idle`&&!this.exec,t(`[data-act="undo"]`).disabled=!this.backup||this.backup.key!==W(this.doc),this.root.querySelectorAll(`[data-mode]`).forEach(t=>{this.doc.kind===`mode`&&(t.disabled=e===`running`)});let n=this.q(`[data-tempo]`);n.value=String(this.tempo)}renderChallengePanel(){let e=this.q(`[data-challenge]`);if(this.doc.kind!==`challenge`){e.hidden=!0;return}let t=this.doc.challenge,n=V().includes(t.id),r=(t.requires??[]).map(e=>`<li>${F(e.hint)}</li>`).join(``);e.hidden=!1,e.innerHTML=`
      <h2>${F(t.title)} <span class="badge ${n?`ok`:``}">${n?`zaliczone`:`do zrobienia`}</span></h2>
      <p class="task">${F(t.task)}</p>
      ${r?`<ul class="reqs">${r}</ul>`:``}
      <div class="dialog-actions left">
        <button type="button" class="btn primary" data-act="check">Sprawdź</button>
        <button type="button" class="btn" data-act="show-reference">Pokaż wzorcowy program</button>
      </div>
      <p class="verdict ${this.verdict?this.verdict.passed?`pass`:`fail`:``}" role="status">${this.verdict?F(this.verdict.reason):``}</p>
      <pre class="reference" data-reference hidden></pre>`,e.querySelectorAll(`[data-act]`).forEach(e=>e.addEventListener(`click`,()=>this.act(e.dataset.act)))}check(){if(this.doc.kind!==`challenge`)return;let e=this.doc.challenge;this.verdict=Ce(this.editor.value,e),this.verdict.passed&&Ve(e.id),this.prepare(),this.exec&&(this.exec.runToEnd(),this.state=`done`,this.render(),this.fit()),this.renderChallengePanel(),this.setStatus(this.verdict.passed?`Zadanie zaliczone.`:`Jeszcze nie. Zobacz uwagi poniżej.`),this.updateControls()}showReference(){if(this.doc.kind!==`challenge`)return;let e=this.q(`[data-reference]`);e.hidden=!1,e.textContent=this.doc.challenge.reference}async openInstant(e,t){await this.ready,this.doc.kind===`mode`&&t!==this.mode&&await this.switchMode(t),this.stopLoop(),this.writeEditor(e),this.checkLive();let n=D(e,this.mode);return this.prepare(),this.exec&&(this.exec.runToEnd(),this.render()),this.state=`done`,this.fit(),this.updateControls(),this.setStatus(`Wczytano program.`),n}},$e=[{names:[`np`,`naprzód`,`naprzod`,`fd`,`forward`],arg:`wyrażenie`,text:`Idzie do przodu o podaną długość. Jeśli pióro jest opuszczone, rysuje odcinek.`,example:`powtorz 4 [np 80 pw 90]`,mode:`2d`},{names:[`ws`,`wstecz`,`bk`,`back`],arg:`wyrażenie`,text:`Idzie do tyłu o podaną długość.`,example:`np 80 ws 40`,mode:`2d`},{names:[`pw`,`prawo`,`rt`,`right`],arg:`wyrażenie (stopnie)`,text:`Obraca żółwia w prawo o podany kąt. Ujemny kąt obraca w lewo.`,example:`np 50 pw 90 np 50`,mode:`2d`},{names:[`lw`,`lewo`,`lt`,`left`],arg:`wyrażenie (stopnie)`,text:`Obraca żółwia w lewo o podany kąt.`,example:`np 50 lw 90 np 50`,mode:`2d`},{names:[`pod`,`podnieś`,`podnies`,`pu`,`penup`],arg:`brak`,text:`Podnosi pióro: ruch nie zostawia śladu.`,example:`np 30 pod np 30 opu np 30`,mode:`2d`},{names:[`opu`,`opuść`,`opusc`,`pd`,`pendown`],arg:`brak`,text:`Opuszcza pióro: ruch znów rysuje.`,example:`pod np 30 opu np 30`,mode:`2d`},{names:[`kolor`,`color`],arg:`kolor w cudzysłowie, np. "#16866a"`,text:`Ustawia kolor pióra. Kolor zapisujemy jako sześć cyfr szesnastkowych w cudzysłowie.`,example:`kolor "#c1763d" np 60`,mode:`2d`},{names:[`grubość`,`grubosc`,`width`],arg:`liczba całkowita 1–12`,text:`Ustawia grubość linii.`,example:`grubosc 8 np 60`,mode:`2d`},{names:[`powtórz`,`powtorz`,`repeat`],arg:`liczba 0–10000, potem [ polecenia ]`,text:`Wykonuje polecenia w nawiasach podaną liczbę razy. Wewnątrz działa nrpowt.`,example:`powtorz 6 [np 40 pw 60]`,mode:`2d`},{names:[`niech`,`let`],arg:`nazwa wyrażenie`,text:`Przypisuje wartość zmiennej. Na poziomie programu zmienna jest globalna, w procedurze lokalna.`,example:`niech bok 50
np bok pw 90 np bok`,mode:`2d`},{names:[`jeśli`,`jesli`,`if`],arg:`warunek [ polecenia ]`,text:`Wykonuje polecenia, gdy warunek jest prawdziwy. Warunek to wyrażenie, porównanie (=, <, >, <=, >=, <>) i wyrażenie.`,example:`niech x 3
jeśli x > 2 [np 50]`,mode:`2d`},{names:[`jeżeli`,`jezeli`,`ifelse`],arg:`warunek [ polecenia ] [ inaczej ]`,text:`Wykonuje pierwszy blok, gdy warunek jest prawdziwy, a drugi w przeciwnym razie.`,example:`niech x 1
jeżeli x > 2 [kolor "#16866a" np 40] [kolor "#c1763d" np 80]`,mode:`2d`},{names:[`stop`],arg:`brak`,text:`Kończy bieżącą procedurę. Na poziomie programu kończy cały program.`,example:`oto kreska ma: d
  np d
  jeśli d > 50 [stop]
  np d
juz

kreska 60
kreska 20`,mode:`2d`},{names:[`dom`,`home`],arg:`brak`,text:`Wraca do punktu (0, 0) i do kierunku w górę. Pióro, kolor i grubość zostają bez zmian.`,example:`np 50 pw 90 np 50 dom`,mode:`2d`},{names:[`czyść`,`czysc`,`cs`,`clearscreen`],arg:`brak`,text:`Usuwa wszystkie dotychczas narysowane odcinki. Żółw zostaje tam, gdzie jest.`,example:`np 50 cs pw 90 np 50`,mode:`2d`},{names:[`góra`,`gora`,`pitchup`],arg:`wyrażenie (stopnie)`,text:`Tylko 3D. Podnosi nos żółwia o podany kąt, w stronę wektora „góry”.`,example:`gora 45 np 60`,mode:`3d`},{names:[`dół`,`dol`,`pitchdown`],arg:`wyrażenie (stopnie)`,text:`Tylko 3D. Opuszcza nos żółwia o podany kąt.`,example:`dol 45 np 60`,mode:`3d`},{names:[`pp`,`przechylprawo`,`rr`,`rollright`],arg:`wyrażenie (stopnie)`,text:`Tylko 3D. Przechyla żółwia w prawo wokół kierunku ruchu; kierunek się nie zmienia.`,example:`pp 45 np 40 pw 90 np 40`,mode:`3d`},{names:[`pl`,`przechyllewo`,`rl`,`rollleft`],arg:`wyrażenie (stopnie)`,text:`Tylko 3D. Przechyla żółwia w lewo wokół kierunku ruchu.`,example:`pl 45 np 40`,mode:`3d`}],et={nrpowt:`numer bieżącego powtórzenia, liczony od 1 (alias: repcount)`},G=e=>e===`3d`?`3D`:`2D`;function tt(){return`
    <h1>Przykłady</h1>
    <p class="lead">Trzynaście standardowych programów. Każdy można wczytać do studia, uruchomić i zmienić.
    Wczytanie przykładu nie kasuje Twojego szkicu: poprzedni tekst zostaje do przywrócenia przyciskiem „Cofnij wczytanie”.</p>
    <div class="cards">${k.map(e=>`
    <article class="card" id="ex-${e.name}">
      <header>
        <h2>${F(e.name)}</h2>
        <span class="badge">${G(e.mode)}</span>
      </header>
      <p>${F(e.description)}</p>
      <details>
        <summary>Pokaż program</summary>
        <pre><code>${F(e.source)}</code></pre>
      </details>
      <p class="actions">
        <a class="btn primary" href="#/?ex=${encodeURIComponent(e.name)}">Otwórz w studiu</a>
      </p>
    </article>`).join(``)}</div>`}function nt(){let e=new Set(V()),t=O.map(t=>`
    <li class="card row">
      <div>
        <h2>${F(t.title)}</h2>
        <p>${F(t.task)}</p>
        <p class="meta">${G(t.mode)}</p>
      </div>
      <div class="row-end">
        <span class="badge ${e.has(t.id)?`ok`:``}">${e.has(t.id)?`zaliczone`:`do zrobienia`}</span>
        <a class="btn primary" href="#/wyzwanie/${encodeURIComponent(t.id)}">Ćwicz</a>
      </div>
    </li>`).join(``);return`
    <h1>Wyzwania</h1>
    <p class="lead">Napisz program, który narysuje wskazany obraz. Sprawdzamy rysunek, a nie tekst programu.
    Zaliczono ${O.filter(t=>e.has(t.id)).length} z ${O.length}. Postęp zapisuje się w tej przeglądarce.</p>
    <ul class="challenge-list">${t}</ul>`}function rt(e,t){return`#/?m=${t}&p=${ke(e)}`}function it(){return $e.map(e=>`
    <article class="card" id="cmd-${e.names[0].normalize(`NFC`).toLowerCase()}">
      <header>
        <h3><code>${e.names.map(F).join(`</code>, <code>`)}</code></h3>
        <span class="badge">${G(e.mode)}</span>
      </header>
      <p><strong>Argument:</strong> ${F(e.arg)}</p>
      <p>${F(e.text)}</p>
      <pre><code>${F(e.example)}</code></pre>
      <p class="actions"><a class="btn" href="${rt(e.example,e.mode)}">Wypróbuj</a></p>
    </article>`).join(``)}function at(){return`
    <h1>Pomoc i opis języka</h1>
    <nav class="toc" aria-label="Spis treści">
      <a href="#/pomoc#wprowadzenie">Wprowadzenie</a>
      <a href="#/pomoc#skladnia">Składnia</a>
      <a href="#/pomoc#polecenia">Polecenia</a>
      <a href="#/pomoc#wyrazenia">Wyrażenia</a>
      <a href="#/pomoc#zmienne">Zmienne i warunki</a>
      <a href="#/pomoc#powtorzenia">Powtórzenia</a>
      <a href="#/pomoc#procedury">Procedury</a>
      <a href="#/pomoc#ograniczenia">Ograniczenia i błędy</a>
      <a href="#/pomoc#skroty">Skróty klawiszowe</a>
    </nav>

    <section id="wprowadzenie">
      <h2>Wprowadzenie</h2>
      <p>Żółw startuje w punkcie (0, 0) i patrzy w górę (kierunek +Y). Ma pióro, kolor i grubość linii.
      Polecenia przesuwają go i obracają; gdy pióro jest opuszczone, zostawia ślad.
      W trybie 2D rysujemy na płaszczyźnie XY. W trybie 3D dochodzi oś Z (w górę), a żółw może się przechylać.</p>
      <p>Program pisz w edytorze i naciśnij Ctrl+Enter. Krok po kroku prześledzisz każde polecenie przyciskiem Krok (F10).</p>
    </section>

    <section id="skladnia">
      <h2>Składnia</h2>
      <ul>
        <li>Słowa kluczowe, nazwy procedur, zmiennych i parametrów nie rozróżniają wielkości liter. Polskie znaki działają, ale ich brak też jest dozwolony: <code>naprzód</code> to <code>naprzod</code>.</li>
        <li>Tokeny oddziela spacja. Nowy wiersz ma znaczenie tylko dla procedur (nagłówek i <code>już</code>).</li>
        <li>Średnik zaczyna komentarz do końca wiersza: <code>; to jest komentarz</code>.</li>
        <li>Liczby to proste zapisy dziesiętne: <code>80</code>, <code>12.5</code>, <code>.5</code>. Znak minus to operator, a <code>1e3</code>, <code>0x10</code>, <code>NaN</code> są błędem.</li>
        <li>Kolor zapisujemy w cudzysłowie, jako sześć cyfr szesnastkowych: <code>"#16866a"</code>.</li>
        <li>Nawiasy kwadratowe <code>[ ]</code> ograniczają treść powtórzeń i warunków (mogą być zagnieżdżone). Okrągłe <code>( )</code> grupują wyrażenia.</li>
      </ul>
    </section>

    <section id="polecenia">
      <h2>Polecenia</h2>
      <p>Każde polecenie ma polskie i angielskie nazwy, które działają tak samo. Przy każdym jest przykład, który można od razu wypróbować.</p>
      <div class="cards">${it()}</div>
    </section>

    <section id="wyrazenia">
      <h2>Wyrażenia</h2>
      <p>Argumentem może być liczba, nazwa (parametr lub zmienna, także zapis <code>:nazwa</code>), <code>nrpowt</code>, wyrażenie w nawiasach, znak <code>-</code> lub <code>+</code> przed nimi, albo dwa wyrażenia połączone <code>+ - * /</code>.</p>
      <ul>
        <li><code>*</code> i <code>/</code> wiążą mocniej niż <code>+</code> i <code>-</code>; równe priorytety łączą się od lewej: <code>np 20 - 5 - 3</code> przesuwa o 12, a <code>np 2 + 3 * 4</code> o 14.</li>
        <li>Dwuargumentowy operator musi mieć spację po obu stronach albo po żadnej: <code>10 - 5</code> i <code>10-5</code> są poprawne, a <code>10 -5</code> nie.</li>
        <li>Dzielenie przez zero i wynik niebędący liczbą skończoną to błędy wykonania.</li>
      </ul>
      <pre><code>niech a 40
np a * 2 - 10
pw a / 2
np -a</code></pre>
    </section>

    <section id="zmienne">
      <h2>Zmienne i warunki</h2>
      <p><code>niech nazwa wyrażenie</code> przypisuje wartość. Na poziomie programu zmienna jest globalna. W procedurze tworzy zmienną lokalną, która przesłania globalną do końca wywołania.</p>
      <p>Warunek to <code>wyrażenie porównanie wyrażenie</code>, gdzie porównanie to <code>=  &lt;  &gt;  &lt;=  &gt;=  &lt;&gt;</code>. Porównania są dokładne: <code>0.1 + 0.2 = 0.3</code> jest fałszem.</p>
      <p><code>jeśli warunek [ ... ]</code> wykonuje treść, gdy warunek jest prawdziwy. <code>jeżeli warunek [ ... ] [ ... ]</code> wybiera jedną z dwóch treści.</p>
      <p>Każda nazwa musi być parametrem procedury albo zmienną przypisaną poleceniem <code>niech</code> (w procedurze lub na poziomie programu). Inaczej to błąd, który widać przed uruchomieniem.</p>
    </section>

    <section id="powtorzenia">
      <h2>Powtórzenia</h2>
      <p><code>powtórz n [ ... ]</code> wykonuje treść <code>n</code> razy; <code>n</code> to liczba całkowita od 0 do 10000.
      Wewnątrz powtórzenia <code>${Object.keys(et)[0]}</code> ma wartość ${et.nrpowt}.</p>
      <p>Użycie <code>nrpowt</code> poza powtórzeniem, także w procedurze wywoływanej z powtórzenia, jest błędem.</p>
    </section>

    <section id="procedury">
      <h2>Procedury</h2>
      <pre><code>oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90</code></pre>
      <p><code>oto nazwa ma: parametry</code> zaczyna definicję w nowym wierszu, a <code>już</code> stoi sam w swoim wierszu i ją kończy.
      Starsza forma <code>oto kwadrat :bok :kąt</code> też działa. Argumenty wywołania to wyrażenia oddzielone spacjami, w liczbie równej liczbie parametrów.
      Procedury mogą wywoływać siebie. <code>stop</code> kończy bieżącą procedurę (na poziomie programu — cały program).
      Definicje są tylko na poziomie programu, mogą być przed albo po wywołaniu. Nie ma wartości zwracanych.</p>
    </section>

    <section id="3d">
      <h2>Tryb 3D</h2>
      <p><code>gora</code> i <code>dol</code> zmieniają nachylenie nosa, <code>pp</code> i <code>pl</code> przechylają żółwia wokół kierunku ruchu. Te cztery polecenia działają tylko w trybie 3D.
      Program złożony z poleceń płaskich rysuje dokładnie to samo w obu trybach.</p>
    </section>

    <section id="ograniczenia">
      <h2>Ograniczenia i błędy</h2>
      <ul>
        <li>Program: do 50 000 znaków i 10 000 elementów składni.</li>
        <li>Zagnieżdżenie nawiasów [ ]: do 32 poziomów. Aktywnych wywołań procedur i powtórzeń naraz: do 32.</li>
        <li>Wykonanych operacji (każde polecenie, <code>niech</code>, warunek, powtórzenie i wywołanie, plus jedna za zakończenie każdej iteracji, treści warunku i wywołania): do 10 000.</li>
        <li>Narysowanych odcinków: do 10 000 (<code>cs</code> zwalnia miejsce). Współrzędne: w zakresie ±100 000.</li>
        <li>Błąd składni wykrywany przed uruchomieniem nie rysuje nic. Błąd wykonania zatrzymuje program, ale zostawia to, co już narysowano.</li>
        <li>Każdy błąd pokazuje wiersz i kolumnę w edytorze oraz opis po polsku.</li>
      </ul>
    </section>

    <section id="skroty">
      <h2>Skróty klawiszowe</h2>
      <table class="shortcuts-table">
        <thead><tr><th scope="col">Klawisz</th><th scope="col">Działanie</th></tr></thead>
        <tbody>
          <tr><td><kbd>Ctrl</kbd>+<kbd>Enter</kbd></td><td>Uruchom program</td></tr>
          <tr><td><kbd>F10</kbd></td><td>Krok: wykonaj jedno polecenie</td></tr>
          <tr><td><kbd>F9</kbd></td><td>Pauza lub wznowienie</td></tr>
          <tr><td><kbd>Esc</kbd></td><td>Reset: zatrzymaj i wyczyść rysunek</td></tr>
          <tr><td><kbd>+</kbd>, <kbd>−</kbd>, strzałki</td><td>Przybliż, oddal, przesuń widok 2D (gdy widok ma fokus)</td></tr>
        </tbody>
      </table>
    </section>`}var K=document.getElementById(`page`),q=null,J=``,Y=[],ot=`logomocja.tryb`;function X(e){document.querySelectorAll(`[data-nav]`).forEach(t=>{t.dataset.nav===e?t.setAttribute(`aria-current`,`page`):t.removeAttribute(`aria-current`)})}function Z(){q?.destroy(),q=null,J=``}function st(e,t){if(q&&J===t)return q;Z(),K.innerHTML=``,q=new Qe(K,e),J=t;for(let e of Y)e(q);return Y=[],q}function ct(e,t){let n=t.get(`p`),r=t.get(`ex`);if(n!==null){let r=Ae(n),i=je(t.get(`m`))??`2d`;r!==null&&e.loadFromLink(r,i)}else if(r!==null){let t=k.find(e=>e.name===r);t&&e.loadExample(t)}(n!==null||r!==null)&&history.replaceState(null,``,`${location.pathname}${location.search}#/`)}function lt(){let{path:e,query:t}=Me();if(e===`/`||e.startsWith(`/wyzwanie/`)||Z(),e===`/`||e===``){X(`studio`);let e=je(t.get(`m`))??(I(ot)===`3d`?`3d`:`2d`);ct(st({kind:`mode`,mode:e},`mode:${e}`),t)}else if(e.startsWith(`/wyzwanie/`)){X(`wyzwania`);let t=decodeURIComponent(e.slice(10)),n=xe(t);if(!n)return ut();st({kind:`challenge`,challenge:n},`challenge:${t}`)}else{if(e===`/przyklady`)X(`przyklady`),K.innerHTML=tt();else if(e===`/wyzwania`)X(`wyzwania`),K.innerHTML=nt();else if(e===`/pomoc`){X(`pomoc`),K.innerHTML=at();let e=location.hash.split(`#`)[2];e&&document.getElementById(e)?.scrollIntoView()}else return ut();K.focus({preventScroll:!0})}}function ut(){X(``),K.innerHTML=`<h1>Nie ma takiej strony</h1><p><a href="#/">Wróć do studia</a></p>`}function dt(){let e=Ee(),t=document.querySelector(`[data-theme-toggle]`);t.textContent=`Motyw: ${Oe[e]}`,t.setAttribute(`aria-label`,`Motyw: ${Oe[e]}. Kliknij, aby zmienić.`)}var Q=[`system`,`light`,`dark`];document.querySelector(`[data-theme-toggle]`).addEventListener(`click`,()=>{let e=Q[(Q.indexOf(Ee())+1)%Q.length];De(e),dt()}),dt();var $=document.querySelector(`[data-help]`);document.querySelector(`[data-help-open]`).addEventListener(`click`,()=>$.showModal()),$.addEventListener(`click`,e=>{e.target===$&&$.close()});function ft(){return q?Promise.resolve(q):new Promise(e=>Y.push(e))}window.addEventListener(`hashchange`,lt),window.addEventListener(`pagehide`,()=>q?.flushDraft()),window.addEventListener(`beforeunload`,()=>q?.flushDraft()),lt(),window.logomocja={version:`1.0.0`,run(e,t){return D(e,t===`3d`?`3d`:`2d`)},async open(e,t){let n=t===`3d`?`3d`:`2d`;return q||(location.hash=`#/`),(await ft()).openInstant(e,n)}};export{z as t};