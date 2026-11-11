(()=>{var j={chars:50000,tokens:1e4,depth:32,frames:32,ops:1e4,segments:1e4,coord:1e5,repeat:1e4,widthMin:1,widthMax:12};class h extends Error{line;column;phase;constructor(e,t,o="parse"){super(e);this.line=t.line,this.column=t.col,this.phase=o}toJSON(){return{message:this.message,line:this.line,column:this.column}}}var de={fd:["np","naprzod","naprzód","fd","forward"],bk:["ws","wstecz","bk","back"],rt:["pw","prawo","rt","right"],lt:["lw","lewo","lt","left"],pu:["pod","podnies","podnieś","pu","penup"],pd:["opu","opusc","opuść","pd","pendown"],color:["kolor","color"],width:["grubosc","grubość","width"],repeat:["powtorz","powtórz","repeat"],let:["niech","let"],if:["jeśli","jesli","if"],ifelse:["jeżeli","jezeli","ifelse"],stop:["stop"],home:["dom","home"],cs:["czyść","czysc","cs","clearscreen"],pitchup:["gora","góra","pitchup"],pitchdown:["dol","dół","pitchdown"],rollright:["pp","przechylprawo","rr","rollright"],rollleft:["pl","przechyllewo","rl","rollleft"]},G=new Map;for(let e of Object.keys(de))for(let t of de[e])G.set(t,e);var Me=["oto","to"],Se=["już","juz","end"],Pe=["nrpowt","repcount"],Ct=["nan","infinity"],ie=new Set(Me),se=new Set(Se),oe=new Set(Pe),$e=new Set(Ct);function be(e){return G.has(e)||ie.has(e)||se.has(e)||oe.has(e)||$e.has(e)}function Qe(e){return G.get(e)}function re(e){return e.normalize("NFC").toLowerCase()}var Ge=/[\p{L}_]/u,le=/[\p{L}\p{N}\p{M}_]/u,ve=/\s/,Je=/(?:\d+\.\d+|\d+|\.\d+)/y;function Lt(e){let t=[],o=0,n=1,i=1,s=e.length,r=(c,d,m,p)=>{let a=o-d.length,f=a===0?" ":e[a-1],y=o>=s?" ":e[o];t.push({t:c,v:d,lc:"",n:0,line:n,col:m,sb:ve.test(f),sa:ve.test(y)||y===";",first:!1,last:!1,...p})},l=(c,d)=>{t.push({t:"err",v:c,lc:"",n:0,line:n,col:d,sb:!0,sa:!0,first:!1,last:!1})};e:while(o<s){let c=e[o];if(c===`
`){o++,n++,i=1;continue}if(c==="\r"){if(o++,e[o]===`
`)o++;n++,i=1;continue}if(ve.test(c)){o++,i++;continue}if(c===";"){while(o<s&&e[o]!==`
`&&e[o]!=="\r")o++,i++;continue}let d=i;if(c>="0"&&c<="9"||c==="."&&e[o+1]>="0"&&e[o+1]<="9"){Je.lastIndex=o;let p=Je.exec(e),a=o+p[0].length;if(a<s&&(le.test(e[a])||e[a]===".")){while(a<s&&(le.test(e[a])||e[a]==="."))a++;l(`Niepoprawna liczba „${e.slice(o,a)}”. Liczby zapisuj cyframi, z kropką dziesiętną: 80, 12.5, .5.`,d);break e}let f=Number(p[0]);if(!Number.isFinite(f)){l("Ta liczba jest zbyt duża.",d);break e}o=a,i+=p[0].length,r("num",p[0],d,{n:f});continue}if(Ge.test(c)){let p=o+1;while(p<s&&le.test(e[p]))p++;let a=e.slice(o,p),f=re(a);if(f==="ma"&&e[p]===":"){o=p+1,i+=a.length+1,r("ma:",a+":",d,{lc:"ma:"});continue}o=p,i+=a.length,r("word",a,d,{lc:f});continue}if(c===":"){if(o+1<s&&Ge.test(e[o+1])){let p=o+2;while(p<s&&le.test(e[p]))p++;let a=e.slice(o,p);o=p,i+=a.length,r("cword",a,d,{lc:re(a.slice(1))});continue}l("Po dwukropku oczekiwano nazwy, na przykład :bok.",d);break e}if(c==='"'){let p=o+1;while(p<s&&e[p]!=='"'&&e[p]!==`
`&&e[p]!=="\r")p++;if(e[p]!=='"'){l('Brakuje zamykającego cudzysłowu. Kolor zapisz tak: "#16866a".',d);break e}let a=e.slice(o,p+1);o=p+1,i+=a.length,r("str",a,d,{lc:a.slice(1,-1).toLowerCase()});continue}if(c==="["||c==="]"||c==="("||c===")"||c===","){o++,i++,r(c,c,d);continue}if(c==="+"||c==="-"||c==="*"||c==="/"){o++,i++,r("op",c,d);continue}if(c==="<"||c===">"||c==="="){let p=c;if(c==="<"&&(e[o+1]==="="||e[o+1]===">"))p+=e[o+1];else if(c===">"&&e[o+1]==="=")p+="=";o+=p.length,i+=p.length,r("cmp",p,d);continue}let m=String.fromCodePoint(e.codePointAt(o));l(`Nieznany znak „${m}”.`,d);break e}for(let c=0;c<t.length;c++)t[c].first=c===0||t[c-1].line!==t[c].line,t[c].last=c===t.length-1||t[c+1].line!==t[c].line;return t.push({t:"eof",v:"",lc:"",n:0,line:n,col:i,sb:!0,sa:!0,first:!0,last:!0}),t}function x(e){if(e.t==="eof")return"koniec programu";return`„${e.v}”`}class et{toks;i=0;mode;procs=new Map;arity=new Map;globals=new Set;procLocals=new Map;scope=null;repeatDepth=0;depth=0;constructor(e,t){if(this.mode=t,e.length>j.chars)throw new h(`Program jest za długi: ${e.length} znaków, a limit to ${j.chars}. Skróć go.`,{line:1,col:1});if(this.toks=Lt(e),this.toks.length-1>j.tokens&&this.toks.slice(0,j.tokens+1).every((n)=>n.t!=="err")){let n=this.toks[j.tokens];throw new h(`Program ma za dużo elementów: limit to ${j.tokens} słów, liczb i znaków.`,n)}this.prescan()}prescan(){let e=this.toks,t=null;for(let o=0;o<e.length;o++){let n=e[o];if(n.t!=="word")continue;if(ie.has(n.lc)&&n.first&&t===null){let i=e[o+1];if(t=new Set,i&&i.t==="word"&&i.line===n.line){let s=0,r=o+2;for(;r<e.length&&e[r].line===n.line&&e[r].t!=="eof";r++)if(e[r].t==="word"||e[r].t==="cword")s++;if(!this.arity.has(i.lc))this.arity.set(i.lc,s),this.procLocals.set(i.lc,t);o=r-1}continue}if(se.has(n.lc)&&n.first&&n.last&&t!==null){t=null;continue}if(G.get(n.lc)==="let"){let i=e[o+1];if(i&&(i.t==="word"||i.t==="cword"))(t??this.globals).add(i.lc)}}}get tok(){let e=this.toks[this.i];if(e.t==="err")throw new h(e.v,e);return e}next(){let e=this.tok;if(e.t!=="eof")this.i++;return e}parse(){let e=this.block(null,null);return{mode:this.mode,body:e,procs:this.procs}}block(e,t){let o=[];for(;;){let n=this.tok;if(n.t==="eof"){if(e)throw new h("Brakuje nawiasu zamykającego „]” dla tego nawiasu „[”.",e);if(t)throw new h("Brakuje słowa „już” kończącego tę procedurę. Wpisz „już” w osobnym wierszu.",t);return o}if(n.t==="]"){if(e)return o;throw new h("Nawias „]” nie ma pasującego nawiasu „[”.",n)}if(n.t==="word"&&se.has(n.lc)){if(e&&t)throw new h("Brakuje nawiasu zamykającego „]” przed końcem procedury.",e);if(e)throw new h(`Słowo ${x(n)} kończy procedurę i nie może stać wewnątrz nawiasów [ ].`,n);if(!t)throw new h(`Słowo ${x(n)} bez pasującego „oto”. Usuń je albo zacznij procedurę od „oto nazwa”.`,n);if(!n.first||!n.last)throw new h(`Słowo ${x(n)} musi stać samo w osobnym wierszu.`,n);return o}if(n.t==="word"&&ie.has(n.lc)){if(e)throw new h("Procedury nie można definiować wewnątrz nawiasów [ ]. Przenieś definicję na początek programu.",n);if(t)throw new h("Procedury nie można definiować wewnątrz innej procedury. Być może brakuje wcześniej słowa „już”.",n);if(!n.first)throw new h(`Definicja procedury (${x(n)}) musi zaczynać się na początku wiersza.`,n);this.procedure();continue}o.push(this.statement())}}procedure(){let e=this.next(),t=(d)=>d.t!=="eof"&&d.line===e.line,o=this.tok;if(!t(o))throw new h(`Po ${x(e)} podaj nazwę procedury w tym samym wierszu, na przykład: oto kwadrat.`,e);if(o.t!=="word")throw new h(`${x(o)} nie może być nazwą procedury. Nazwa zaczyna się od litery.`,o);if(be(o.lc))throw new h(`Nazwa ${x(o)} jest zajęta przez język. Wybierz inną nazwę procedury.`,o);if(this.procs.has(o.lc))throw new h(`Procedura ${x(o)} jest już zdefiniowana. Każdą nazwę można zdefiniować tylko raz.`,o);this.next();let n=[],i=(d)=>{if(be(d.lc))throw new h(`Nazwa ${x(d)} jest zajęta przez język. Wybierz inną nazwę parametru.`,d);if(n.includes(d.lc))throw new h(`Parametr ${x(d)} występuje dwa razy.`,d);n.push(d.lc),this.next()},s=this.tok;if(t(s)&&s.t==="ma:"){let d=this.next();for(;;){if(s=this.tok,!t(s))throw new h("Po „ma:” podaj nazwy parametrów oddzielone przecinkami, na przykład: ma: bok, kąt.",n.length?this.toks[this.i-1]:d);if(s.t!=="word"&&s.t!=="cword")throw new h(`Oczekiwano nazwy parametru, a jest ${x(s)}.`,s);if(i(s),s=this.tok,t(s)&&s.t===","){this.next();continue}break}}else if(t(s)&&s.t==="cword")while(t(this.tok)&&this.tok.t==="cword")i(this.tok);if(s=this.tok,t(s)){if(n.length&&(s.t==="word"||s.t==="cword"))throw new h(`Parametry oddziel przecinkami: brakuje przecinka przed ${x(s)}.`,s);if(!n.length&&s.t==="word")throw new h(`Parametry podaj po słowie „ma:”, na przykład: oto ${o.v} ma: ${s.v}.`,s);throw new h(`Nagłówek procedury kończy się w tym wierszu, a jest tu jeszcze ${x(s)}. Treść zacznij od nowego wiersza.`,s)}let r=this.procLocals.get(o.lc)??new Set,l={name:o.lc,shown:o.v,params:n,body:[],pos:o,end:o};this.procs.set(o.lc,l);let c={scope:this.scope,repeatDepth:this.repeatDepth,depth:this.depth};this.scope={params:new Set(n),locals:r},this.repeatDepth=0,this.depth=0,l.body=this.block(null,e),l.end=this.next(),this.scope=c.scope,this.repeatDepth=c.repeatDepth,this.depth=c.depth}statement(){let e=this.tok;if(e.t==="word"){let t=G.get(e.lc);if(t)return this.next(),this.command(t,e);let o=this.arity.get(e.lc);if(o!==void 0&&!oe.has(e.lc)){this.next();let n=[];for(let s=0;s<o;s++)n.push(this.expr(e,()=>`Procedura „${e.v}” przyjmuje ${Xe(o)}, a podano ${s}.`));let i=this.tok;if(this.startsValue(i)){let s=o===0?"nie przyjmuje argumentów":`przyjmuje ${Xe(o)}`;throw new h(`Procedura „${e.v}” ${s}, a tu jest dodatkowa wartość: ${x(i)}.`,i)}return{k:"call",name:e.lc,args:n,pos:e}}if(oe.has(e.lc))throw new h(`${x(e)} to wartość, nie polecenie. Użyj jej jako argumentu, na przykład: np ${e.v} * 10.`,e);if(this.isName(e.lc))throw new h(`W tym miejscu oczekiwano polecenia, a ${x(e)} to wartość. Być może brakuje przed nią polecenia, na przykład „np”.`,e);if($e.has(e.lc))throw new h(`${x(e)} nie jest ani poleceniem, ani liczbą.`,e);throw new h(`Nieznane polecenie ${x(e)}. Sprawdź pisownię albo zdefiniuj procedurę: oto ${e.v}.`,e)}if(e.t==="num"||e.t==="cword"||e.t==="str")throw new h(`W tym miejscu oczekiwano polecenia, a jest wartość ${x(e)}. Być może brakuje przed nią polecenia albo poprzednie polecenie ma za dużo argumentów.`,e);if(e.t==="op")throw new h(`W tym miejscu oczekiwano polecenia, a jest ${x(e)}. Operator musi mieć odstęp z obu stron albo z żadnej: „10 ${e.v} 5” lub „10${e.v}5”.`,e);if(e.t==="[")throw new h("Nieoczekiwany nawias „[”. Nawias kwadratowy może stać tylko po „powtorz”, „jeśli” lub „jeżeli”.",e);if(e.t===")")throw new h("Nawias „)” nie ma pasującego nawiasu „(”.",e);if(e.t==="(")throw new h("W tym miejscu oczekiwano polecenia, a jest nawias „(”.",e);if(e.t==="ma:")throw new h("„ma:” może wystąpić tylko w nagłówku procedury, po jej nazwie.",e);throw new h(`W tym miejscu oczekiwano polecenia, a jest ${x(e)}.`,e)}isName(e){return!!(this.scope&&(this.scope.params.has(e)||this.scope.locals.has(e)))||this.globals.has(e)}startsValue(e){if(e.t==="num"||e.t==="cword"||e.t==="(")return!0;if(e.t==="op")return!0;if(e.t==="word"){if(oe.has(e.lc))return!0;if(G.has(e.lc)||ie.has(e.lc)||se.has(e.lc))return!1;if(this.arity.has(e.lc))return!1;return this.isName(e.lc)}return!1}command(e,t){let o=`„${t.v}”`,n=(i)=>()=>`Polecenie ${o} wymaga argumentu: ${i}.`;switch(e){case"fd":return{k:"move",sign:1,e:this.expr(t,n("odległości, na przykład 100")),pos:t};case"bk":return{k:"move",sign:-1,e:this.expr(t,n("odległości, na przykład 100")),pos:t};case"rt":return{k:"turn",axis:"yaw",sign:1,e:this.expr(t,n("kąta w stopniach, na przykład 90")),pos:t};case"lt":return{k:"turn",axis:"yaw",sign:-1,e:this.expr(t,n("kąta w stopniach, na przykład 90")),pos:t};case"pitchup":case"pitchdown":case"rollright":case"rollleft":{if(this.mode==="2d")throw new h(`Polecenie ${o} działa tylko w trybie 3D. Przełącz tryb na 3D albo usuń to polecenie.`,t);let i=this.expr(t,n("kąta w stopniach, na przykład 90"));return{k:"turn",axis:e==="pitchup"||e==="pitchdown"?"pitch":"roll",sign:e==="pitchup"||e==="rollright"?1:-1,e:i,pos:t}}case"pu":return{k:"pen",down:!1,pos:t};case"pd":return{k:"pen",down:!0,pos:t};case"stop":return{k:"stop",pos:t};case"home":return{k:"home",pos:t};case"cs":return{k:"cs",pos:t};case"color":{let i=this.tok;if(i.t!=="str"){let s=`Polecenie ${o} wymaga koloru w cudzysłowie, na przykład: ${t.v} "#16866a".`;throw new h(s,i.t==="eof"?t:i)}if(!/^#[0-9a-f]{6}$/.test(i.lc))throw new h(`Niepoprawny kolor ${i.v}. Kolor to znak # i sześć cyfr szesnastkowych, na przykład "#16866a".`,i);return this.next(),{k:"color",c:i.lc,pos:t}}case"width":{let i=this.expr(t,n("liczby całkowitej od 1 do 12"));if(i.constant!==void 0)tt(i.constant,i.pos,"parse");return{k:"width",e:i,pos:t}}case"repeat":{let i=this.expr(t,n("liczby powtórzeń, na przykład 4"));if(i.constant!==void 0)ot(i.constant,i.pos,"parse");let s=this.tok;if(s.t!=="[")throw new h(`Po liczbie powtórzeń oczekiwano nawiasu „[” z poleceniami, a jest ${x(s)}.`,s.t==="eof"?t:s);this.repeatDepth++;let{body:r,close:l}=this.bracketed();return this.repeatDepth--,{k:"repeat",e:i,body:r,close:l,pos:t}}case"let":{let i=this.tok;if(i.t!=="word"&&i.t!=="cword")throw new h(`Po ${o} podaj nazwę zmiennej, a potem wartość, na przykład: ${t.v} bok 50.`,i.t==="eof"?t:i);if(be(i.lc))throw new h(`Nazwa ${x(i)} jest zajęta przez język i nie może być zmienną. Wybierz inną nazwę.`,i);if(this.arity.has(i.lc))throw new h(`${x(i)} to nazwa procedury i nie może być zmienną. Wybierz inną nazwę.`,i);this.next();let s=this.expr(t,()=>`Po nazwie zmiennej „${i.v}” podaj jej wartość, na przykład: ${t.v} ${i.v} 50.`);return{k:"let",name:i.lc,e:s,pos:t}}case"if":case"ifelse":{let i=this.condition(t),s=this.tok;if(s.t!=="[")throw new h(`Po warunku oczekiwano nawiasu „[” z poleceniami, a jest ${x(s)}.`,s.t==="eof"?t:s);let r=this.bracketed();if(e==="if")return{k:"if",cond:i,a:r.body,b:null,closeA:r.close,closeB:r.close,pos:t};let l=this.tok;if(l.t!=="[")throw new h(`Polecenie ${o} wymaga dwóch bloków: [gdy prawda] [gdy fałsz]. Brakuje drugiego nawiasu „[”.`,l.t==="eof"?t:l);let c=this.bracketed();return{k:"if",cond:i,a:r.body,b:c.body,closeA:r.close,closeB:c.close,pos:t}}}}bracketed(){let e=this.next();if(this.depth>=j.depth)throw new h(`Nawiasy [ ] są zagnieżdżone zbyt głęboko: limit to ${j.depth} poziomy.`,e);this.depth++;let t=this.block(e,this.scope?e:null),o=this.next();return this.depth--,{body:t,close:o}}condition(e){let t=`„${e.v}”`,o=this.expr(e,()=>`Polecenie ${t} wymaga warunku, na przykład: ${e.v} bok > 10 [ ... ].`),n=this.tok;if(n.t!=="cmp")throw new h(`W warunku oczekiwano porównania (<, >, =, <=, >=, <>), a jest ${x(n)}.`,n.t==="eof"?e:n);this.next();let i=this.expr(e,()=>`Po „${n.v}” oczekiwano wartości do porównania.`);return{l:o,op:n.v,r:i,pos:o.pos}}expr(e,t){let o=this.tok,n=[],i=[],s=(a)=>a==="neg"||a==="pos"?3:a==="*"||a==="/"?2:1,r=(a)=>{if(a!=="pos")n.push({k:"o",o:a})},l=!0,c=!0,d=0,m=!1;for(;;){let a=this.tok;if(c){if(a.t==="num")n.push({k:"n",v:a.n});else if(a.t==="op"&&(a.v==="-"||a.v==="+")){i.push({o:a.v==="-"?"neg":"pos",tok:a}),this.next(),m=!0;continue}else if(a.t==="("){i.push({o:"(",tok:a}),d++,this.next(),m=!0;continue}else if(a.t==="cword"||a.t==="word"&&!G.has(a.lc)&&!ie.has(a.lc)&&!se.has(a.lc)&&(oe.has(a.lc)||this.isName(a.lc)||!this.arity.has(a.lc))){if(a.t==="word"&&oe.has(a.lc)){if(this.repeatDepth===0)throw new h(`${x(a)} działa tylko wewnątrz nawiasów polecenia „powtorz”${this.scope?" w tej samej procedurze":""}.`,a);n.push({k:"rc"})}else if($e.has(a.lc)&&a.t==="word")throw new h(`${x(a)} nie jest liczbą. Liczby zapisuj cyframi: 80, 12.5, .5.`,a);else if(this.isName(a.lc))n.push({k:"v",name:a.lc});else throw new h(`Nieznana nazwa ${x(a)}. Nadaj jej wartość poleceniem „niech ${a.lc} ...” albo dodaj ją do parametrów procedury.`,a);l=!1}else{if(!m)throw new h(t(),a.t==="eof"||a.line!==e.line?e:a);let f=this.toks[this.i-1];if(f.t==="("&&a.t===")")throw new h("Pusty nawias: między „(” a „)” oczekiwano wartości.",a);if(a.t==="word"&&this.arity.has(a.lc))throw new h(`${x(a)} to procedura, a nie wartość. Procedury nie zwracają wyników.`,a);throw new h(`Po „${f.v}” oczekiwano wartości, a jest ${x(a)}.`,a.t==="eof"?f:a)}this.next(),m=!0,c=!1;continue}if(a.t===")"&&d>0){while(i[i.length-1].o!=="(")r(i.pop().o);i.pop(),d--,this.next();continue}if(a.t==="op"){if(a.sb===a.sa){let f=s(a.v);while(i.length&&i[i.length-1].o!=="("&&s(i[i.length-1].o)>=f)r(i.pop().o);i.push({o:a.v,tok:a}),this.next(),c=!0;continue}if(!a.sb&&a.sa)throw new h(`Operator „${a.v}” musi mieć odstęp z obu stron albo z żadnej: „10 ${a.v} 5” lub „10${a.v}5”.`,a);if(d>0)throw new h(`Operator „${a.v}” musi mieć odstęp z obu stron albo z żadnej: „10 ${a.v} 5” lub „10${a.v}5”.`,a);break}if(d>0){let f=i.length-1;while(i[f].o!=="(")f--;throw new h("Brakuje nawiasu zamykającego „)” dla tego nawiasu „(”.",i[f].tok)}break}while(i.length)r(i.pop().o);let p={rpn:n,pos:{line:o.line,col:o.col},literal:l};if(l)try{p.constant=xe(n,p.pos,null)}catch{}return p}}function Xe(e){if(e===1)return"1 argument";let t=e%10,o=e%100;return t>=2&&t<=4&&!(o>=12&&o<=14)?`${e} argumenty`:`${e} argumentów`}function tt(e,t,o){if(!Number.isInteger(e)||e<j.widthMin||e>j.widthMax)throw new h(`Grubość musi być liczbą całkowitą od 1 do 12, a jest ${nt(e)}.`,t,o)}function ot(e,t,o){if(!Number.isInteger(e)||e<0||e>j.repeat)throw new h(`Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000, a jest ${nt(e)}.`,t,o)}function nt(e){if(Number.isInteger(e))return String(e);let t=e.toFixed(4).replace(/0+$/,"").replace(/\.$/,"");return t==="-0"?"0":t}function xe(e,t,o){let n=[];for(let s=0;s<e.length;s++){let r=e[s];switch(r.k){case"n":n.push(r.v);break;case"rc":n.push(o.env.rc[o.env.rc.length-1]);break;case"v":{let l;if(o.env.locals&&o.env.locals.has(r.name))l=o.env.locals.get(r.name);else l=o.globals.get(r.name);if(l===void 0)throw new h(`Zmienna „${r.name}” nie ma jeszcze wartości. Nadaj ją wcześniej poleceniem „niech ${r.name} ...”.`,t,"run");n.push(l);break}case"o":{if(r.o==="neg"){n.push(-n.pop());break}let l=n.pop(),c=n.pop(),d;if(r.o==="+")d=c+l;else if(r.o==="-")d=c-l;else if(r.o==="*")d=c*l;else{if(l===0)throw new h("Dzielenie przez zero. Sprawdź, czy dzielnik nie jest równy 0.",t,"run");d=c/l}n.push(d);break}}}let i=n[0];if(!Number.isFinite(i))throw new h("Wynik wyrażenia nie jest liczbą skończoną (jest zbyt duży).",t,"run");return i===0?0:i}function pe(e,t){return new et(e,t).parse()}function Nt(e){let t=e%360;if(t<0)t+=360;if(t===0)return[0,1];if(t===90)return[1,0];if(t===180)return[0,-1];if(t===270)return[-1,0];let o=t*Math.PI/180;return[Math.sin(o),Math.cos(o)]}function je(e,t,o){let[n,i]=Nt(o);for(let s=0;s<3;s++){let r=e[s],l=t[s];e[s]=r*i+l*n+0,t[s]=l*i-r*n+0}}class he{program;segments=[];turtle={pos:[0,0,0],h:[0,1,0],r:[1,0,0],u:[0,0,1],pen:!0,color:"#16866a",width:3};ops=0;frames=0;maxFrames=0;error=null;done=!1;clears=0;globals=new Map;gen;constructor(e){this.program=e,this.gen=this.main()}step(){if(this.done)return null;try{let e=this.gen.next();if(e.done)return this.done=!0,null;return e.value}catch(e){if(this.done=!0,e instanceof h)return this.error=e,null;throw e}}runAll(){while(this.step());}tick(e){if(this.ops>=j.ops)throw new h(`Program wykonał już ${j.ops} operacji i został zatrzymany. Zmniejsz liczbę powtórzeń albo sprawdź, czy rekurencja ma warunek „stop”.`,e,"run");this.ops++}enter(e){if(this.frames>=j.frames)throw new h(`Zbyt głębokie zagnieżdżenie: limit to ${j.frames} aktywne wywołania procedur i powtórzenia. Sprawdź, czy rekurencja ma warunek „stop”.`,e,"run");if(this.frames++,this.frames>this.maxFrames)this.maxFrames=this.frames}ev(e,t){if(e.constant!==void 0)return e.constant;return xe(e.rpn,e.pos,{env:t,globals:this.globals})}moveTo(e,t){let o=this.turtle;for(let i=0;i<3;i++){if(!Number.isFinite(e[i])||Math.abs(e[i])>j.coord)throw new h("Żółw wyszedłby poza dozwolony obszar: każda współrzędna musi mieścić się w ±100000.",t,"run");if(e[i]===0)e[i]=0}if((e[0]!==o.pos[0]||e[1]!==o.pos[1]||e[2]!==o.pos[2])&&o.pen){if(this.segments.length>=j.segments)throw new h(`Rysunek ma już ${j.segments} odcinków, więcej się nie zmieści. Użyj „czyść” albo narysuj mniej.`,t,"run");this.segments.push({from:[o.pos[0],o.pos[1],o.pos[2]],to:[e[0],e[1],e[2]],color:o.color,width:o.width})}o.pos=e}*main(){yield*this.block(this.program.body,{locals:null,rc:[]})}*block(e,t){for(let o=0;o<e.length;o++){let n=e[o];this.tick(n.pos);let i={line:n.pos.line,column:n.pos.col,kind:n.k},s=this.turtle;switch(n.k){case"move":{let r=this.ev(n.e,t)*n.sign;this.moveTo([s.pos[0]+s.h[0]*r,s.pos[1]+s.h[1]*r,s.pos[2]+s.h[2]*r],n.pos),yield i;break}case"turn":{let r=this.ev(n.e,t)*n.sign;if(n.axis==="yaw")je(s.h,s.r,r);else if(n.axis==="pitch")je(s.h,s.u,r);else je(s.u,s.r,r);yield i;break}case"pen":s.pen=n.down,yield i;break;case"color":s.color=n.c,yield i;break;case"width":{let r=this.ev(n.e,t);tt(r,n.e.pos,"run"),s.width=r,yield i;break}case"home":this.moveTo([0,0,0],n.pos),s.h=[0,1,0],s.r=[1,0,0],s.u=[0,0,1],yield i;break;case"cs":this.segments.length=0,this.clears++,yield i;break;case"let":{let r=this.ev(n.e,t);if(t.locals)t.locals.set(n.name,r);else this.globals.set(n.name,r);yield i;break}case"stop":return yield i,!0;case"repeat":{let r=this.ev(n.e,t);ot(r,n.e.pos,"run"),this.enter(n.pos),yield i,t.rc.push(0);for(let l=1;l<=r;l++){if(t.rc[t.rc.length-1]=l,yield*this.block(n.body,t))return t.rc.pop(),this.frames--,!0;this.tick(n.close)}t.rc.pop(),this.frames--;break}case"if":{let r=Ye(this,n.cond.l,n.cond.pos,t),l=Ye(this,n.cond.r,n.cond.pos,t),c=n.cond.op,d=c==="<"?r<l:c===">"?r>l:c==="="?r===l:c==="<="?r<=l:c===">="?r>=l:r!==l;yield i;let m=d?n.a:n.b;if(m){if(yield*this.block(m,t))return!0;this.tick(d?n.closeA:n.closeB)}break}case"call":{let r=this.program.procs.get(n.name),l=new Map;for(let c=0;c<r.params.length;c++)l.set(r.params[c],this.ev(n.args[c],t));this.enter(n.pos),yield i,yield*this.block(r.body,{locals:l,rc:[]}),this.frames--,this.tick(r.end);break}}}return!1}_eval(e,t,o){if(e.constant!==void 0)return e.constant;return xe(e.rpn,t,{env:o,globals:this.globals})}}function Ye(e,t,o,n){return e._eval(t,o,n)}function J(e){return{message:e.message,line:e.line,column:e.column}}function ue(e){return e.map((t)=>({from:[t.from[0],t.from[1],t.from[2]],to:[t.to[0],t.to[1],t.to[2]],color:t.color,width:t.width}))}function B(e,t){if(t!=="2d"&&t!=="3d")return{segments:[],error:{message:"Nieznany tryb. Dozwolone tryby to „2d” i „3d”.",line:1,column:1}};let o;try{o=pe(String(e??""),t)}catch(i){if(i instanceof h)return{segments:[],error:J(i)};throw i}let n=new he(o);return n.runAll(),{segments:ue(n.segments),error:n.error?J(n.error):null}}function Dt(e,t){let o=t.from[0],n=t.from[1],i=t.from[2],s=t.to[0]-o,r=t.to[1]-n,l=t.to[2]-i,c=s*s+r*r+l*l,d=c===0?0:((e[0]-o)*s+(e[1]-n)*r+(e[2]-i)*l)/c;d=d<0?0:d>1?1:d;let m=o+s*d-e[0],p=n+r*d-e[1],a=i+l*d-e[2];return Math.sqrt(m*m+p*p+a*a)}function It(e){let t=0;for(let o of e)t+=Math.hypot(o.to[0]-o.from[0],o.to[1]-o.from[1],o.to[2]-o.from[2]);return t}function At(e,t){let o=[];for(let n of e){let i=Math.hypot(n.to[0]-n.from[0],n.to[1]-n.from[1],n.to[2]-n.from[2]),s=Math.max(1,Math.ceil(i/t));for(let r=0;r<=s;r++){let l=r/s;o.push([n.from[0]+(n.to[0]-n.from[0])*l,n.from[1]+(n.to[1]-n.from[1])*l,n.from[2]+(n.to[2]-n.from[2])*l])}}return o}function it(e,t,o){let n=It(e);if(n===0)return 1;let i=At(e,Math.max(1,n/1200)),s=0;for(let r of i)for(let l=0;l<t.length;l++)if(Dt(r,t[l])<=o){s++;break}return s/i.length}function st(e){let t=[1/0,1/0,1/0],o=[-1/0,-1/0,-1/0];for(let n of e)for(let i of[n.from,n.to])for(let s=0;s<3;s++){if(i[s]<t[s])t[s]=i[s];if(i[s]>o[s])o[s]=i[s]}return Math.hypot(o[0]-t[0],o[1]-t[1],o[2]-t[2])}var me=(e)=>`${Math.round(e*100)}%`;function Te(e,t,o=1.5){if(e.length===0)return{pass:!1,covered:0,extra:0,reason:"Na arkuszu nie ma żadnej kreski. Narysuj wzór i sprawdź ponownie."};let n=it(t,e,o),i=1-it(e,t,o),s=n>=0.99,r=i<=0.01;if(s&&r)return{pass:!0,covered:n,extra:i,reason:"Rysunek zgadza się ze wzorem."};let l=st(e),c=st(t),d="";if(n<0.5&&c>0&&Math.abs(l/c-1)>0.08)d=l<c?" Rysunek jest mniejszy od wzoru: sprawdź długości.":" Rysunek jest większy od wzoru: sprawdź długości.";else if(n<0.5)d=" Sprawdź kąty i kierunek pierwszego ruchu.";if(!s&&!r)return{pass:!1,covered:n,extra:i,reason:`Rysunek pokrywa ${me(n)} wzoru, a ${me(i)} kresek leży poza nim.${d}`};if(!s)return{pass:!1,covered:n,extra:i,reason:`Brakuje części wzoru: rysunek pokrywa ${me(n)} przerywanej linii.${d}`};return{pass:!1,covered:n,extra:i,reason:`Wzór jest pokryty, ale ${me(Math.max(i,0.01))} kresek leży poza nim. Usuń zbędne linie albo podnieś pisak przy przejściach.`}}var O=[{id:"trojkat",title:"Trójkąt równoboczny",mode:"2d",task:"Narysuj trójkąt równoboczny o boku 100. Pierwszy bok biegnie prosto w górę od punktu startu, kolejne skręcają w prawo.",hint:"Żółw skręca o kąt zewnętrzny. Trzy równe skręty muszą dać pełny obrót: 360 / 3.",starter:`; Trójkąt równoboczny o boku 100
`,solution:"powtorz 3 [np 100 pw 120]"},{id:"schodki",title:"Schodki",mode:"2d",task:"Narysuj pięć schodków wspinających się w prawo. Każdy stopień to 30 w górę i 30 w prawo.",hint:"Jeden stopień to: np 30, pw 90, np 30, lw 90. Powtórz go pięć razy.",starter:`; Pięć schodków: 30 w górę, 30 w prawo
`,solution:"powtorz 5 [np 30 pw 90 np 30 lw 90]"},{id:"przerywana",title:"Linia przerywana",mode:"2d",task:"Narysuj pionową linię przerywaną: pięć kresek o długości 20, a między nimi przerwy o długości 20. Linia zaczyna się w punkcie startu.",hint:"Polecenie pod podnosi pisak, a opu go opuszcza. Żółw z podniesionym pisakiem idzie, ale nie rysuje.",starter:`; Pięć kresek po 20 z przerwami po 20
`,solution:"powtorz 5 [np 20 pod np 20 opu]"},{id:"domek",title:"Domek",mode:"2d",task:"Narysuj domek: kwadrat o boku 100 (lewy dolny róg w punkcie startu) i na nim dach, czyli trójkąt równoboczny o boku 100.",hint:"Po narysowaniu kwadratu przejdź do lewego górnego rogu. Dach zaczyna się skrętem pw 30.",starter:`; Kwadrat 100 i trójkątny dach
`,solution:`powtorz 4 [np 100 pw 90]
np 100 pw 30
powtorz 3 [np 100 pw 120]`},{id:"promienie",title:"Promienie",mode:"2d",task:"Narysuj osiem promieni o długości 80, które rozchodzą się z punktu startu co 45 stopni. Pierwszy promień biegnie prosto w górę.",hint:"Po każdym promieniu wróć do środka poleceniem ws, a potem skręć.",starter:`; Osiem promieni co 45 stopni
`,solution:"powtorz 8 [np 80 ws 80 pw 45]"},{id:"rosnace",title:"Rosnące kwadraty",mode:"2d",task:"Narysuj cztery kwadraty o bokach 40, 80, 120 i 160. Wszystkie mają wspólny lewy dolny róg w punkcie startu. Użyj zmiennej albo procedury z parametrem.",hint:"Zacznij od niech bok 40. Po każdym kwadracie zwiększ zmienną: niech bok bok + 40.",starter:`; Cztery kwadraty: 40, 80, 120, 160
niech bok 40
`,solution:`niech bok 40
powtorz 4 [
  powtorz 4 [np bok pw 90]
  niech bok bok + 40
]`},{id:"naroznik",title:"Narożnik w przestrzeni",mode:"3d",task:"Narysuj trzy krawędzie o długości 80 wychodzące z punktu startu: jedną do przodu, jedną w prawo i jedną pionowo w górę.",hint:"Polecenie gora 90 kieruje żółwia pionowo w górę. Po każdej krawędzi wróć na start poleceniem ws.",starter:`; Trzy krawędzie po 80: przód, prawo, góra
`,solution:`np 80 ws 80
pw 90 np 80 ws 80 lw 90
gora 90 np 80`},{id:"piramida",title:"Piramida",mode:"3d",task:"Narysuj piramidę: kwadratową podstawę o boku 100 (jak w przykładzie Kwadrat) i cztery krawędzie boczne o długości 100, które spotykają się nad środkiem podstawy.",hint:"W każdym rogu skręć o 45 stopni do środka i unieś nos o 45 stopni: pw 45 gora 45. Po krawędzi wróć z podniesionym pisakiem i cofnij oba obroty.",starter:`; Podstawa 100 x 100 i cztery krawędzie po 100
`,solution:`powtorz 4 [
  pw 45 gora 45
  np 100
  pod ws 100 opu
  dol 45 lw 45
  np 100 pw 90
]`}],rt=new Map;function at(e){return O.find((t)=>t.id===e)}function ae(e){let t=rt.get(e.id);if(!t)t=B(e.solution,e.mode).segments,rt.set(e.id,t);return t}var Ee=[{id:"kwadrat",name:"Kwadrat",mode:"2d",blurb:"Cztery kroki do pierwszego rysunku.",source:`; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]`},{id:"gwiazda",name:"Gwiazda",mode:"2d",blurb:"Mała zmiana kąta, wielka różnica.",source:`; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]`},{id:"rozeta",name:"Rozeta",mode:"2d",blurb:"Jeden kwadrat. Wiele możliwości.",source:`; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]`},{id:"spirala",name:"Spirala",mode:"2d",blurb:"Licznik powtórzeń i zmienna zmieniają kolor.",source:`; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]`},{id:"wielokaty",name:"Wielokąty",mode:"2d",blurb:"Procedura liczy kąt z liczby boków.",source:`; Jedna procedura, wiele figur: kąt liczy się sam.
oto wielokąt ma: boki, bok
  powtorz boki [np bok pw 360 / boki]
już

grubosc 2
niech n 3
powtorz 7 [
  wielokąt n 60
  niech n n + 1
  pw 360 / 7
]`},{id:"drzewo",name:"Drzewo",mode:"2d",blurb:"Gałąź rysuje dwie mniejsze gałęzie.",source:`; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
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
gałąź 90`},{id:"sniezynka",name:"Śnieżynka",mode:"2d",blurb:"Krzywa Kocha z czterech poziomów.",source:`; Krzywa Kocha: każdy odcinek dzieli się na cztery.
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
]`},{id:"schody",name:"Schody",mode:"3d",blurb:"Pierwszy krok w trzeci wymiar.",source:`; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]`},{id:"szescian",name:"Sześcian",mode:"3d",blurb:"Zbuduj bryłę z prostych poleceń.",source:`; Dwa kwadraty połączone krawędziami.
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
]`},{id:"pierscien",name:"Pierścień",mode:"3d",blurb:"Okrąg przechylony w przestrzeni.",source:`; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]`},{id:"kula",name:"Kula",mode:"3d",blurb:"Okręgi obrócone wokół kierunku żółwia.",source:`; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]`},{id:"helisa",name:"Helisa",mode:"3d",blurb:"Spirala wznosi się obrót po obrocie.",source:`; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]`},{id:"drzewo3d",name:"Drzewo 3D",mode:"3d",blurb:"Gałęzie obracają się wokół pnia.",source:`; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
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
gałąź 70`}];function ct(e){return Ee.find((t)=>t.id===e)}var C=(e)=>`<svg class="ico" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${e}</svg>`,P={play:C('<path d="M6 3.5v13l10-6.5z" fill="currentColor"/>'),step:C('<path d="M4 4v12l8-6z" fill="currentColor"/><path d="M15.5 4v12"/>'),pause:C('<path d="M6.5 4v12M13.5 4v12" stroke-width="2.5"/>'),reset:C('<path d="M4.5 10a5.5 5.5 0 1 0 1.700-4"/><path d="M4 3v3.5h3.5"/>'),fit:C('<path d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4"/><rect x="7" y="7" width="6" height="6"/>'),plus:C('<path d="M10 4v12M4 10h12"/>'),minus:C('<path d="M4 10h12"/>'),camera:C('<path d="M10 2.5 16.5 6v8L10 17.5 3.5 14V6z"/><path d="M3.5 6 10 9.5 16.5 6M10 9.5v8"/>'),download:C('<path d="M10 3v9.5M6 9l4 4 4-4M3.5 16.5h13"/>'),open:C('<path d="M2.5 15.5v-11h5l2 2h8v9z"/>'),link:C('<path d="M8.5 11.5a3.2 3.2 0 0 0 4.5 0l3-3a3.2 3.2 0 0 0-4.5-4.5l-1 1"/><path d="M11.5 8.5a3.2 3.2 0 0 0-4.5 0l-3 3a3.2 3.2 0 0 0 4.5 4.5l1-1"/>'),image:C('<rect x="2.5" y="3.5" width="15" height="13"/><path d="m2.5 13.5 4-4 3.5 3.5 2.5-2.5 5 5"/><circle cx="13" cy="7.5" r="1.2"/>'),theme:C('<circle cx="10" cy="10" r="6.5"/><path d="M10 3.5v13a6.5 6.5 0 0 0 0-13z" fill="currentColor"/>'),check:C('<path d="m4 10.5 4 4 8-9"/>'),cross:C('<path d="m5 5 10 10M15 5 5 15"/>'),undo:C('<path d="M4 8h8a4 4 0 0 1 0 8H8"/><path d="M7 5 4 8l3 3"/>'),arrow:C('<path d="M4 10h12M11 5l5 5-5 5"/>')};var Rt=new Set([...Me,...Se,...Pe]),Ce=/(;[^\n\r]*)|("[^"\n\r]*"?)|((?:\d+\.\d+|\d+|\.\d+)[\p{L}\p{N}\p{M}_.]*)|(:?[\p{L}_][\p{L}\p{N}\p{M}_]*:?)|([\[\]()])|(<=|>=|<>|[-+*\/<>=,])|(\r\n|\n|\r)|([^\S\n\r]+)|([\s\S])/gu,we=(e)=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");function ke(e,t){let o="",n=1,i=1,s=!1;Ce.lastIndex=0;let r,l='<span class="e-point" data-err></span>';while(r=Ce.exec(e)){let c=r[0];if(r[7]){if(t&&!s&&t.line===n)o+=l,s=!0;o+=`
`,n++,i=1;continue}let d="";if(r[1])d="t-com";else if(r[2])d="t-str";else if(r[3])d="t-num";else if(r[4]){let p=c;if(p.endsWith(":")&&re(p)!=="ma:")p=p.slice(0,-1),Ce.lastIndex-=1,c=p;let a=re(p);d=a==="ma:"||Rt.has(a)||Qe(a)?"t-cmd":"t-name"}else if(r[5])d="t-br";else if(r[6])d="t-op";let m=t&&!s&&t.line===n&&t.column>=i&&t.column<i+c.length;if(m&&(r[8]||!d))o+=l+we(c),s=!0;else if(m)o+=`<span class="${d} e-mark" data-err>${we(c)}</span>`,s=!0;else o+=d?`<span class="${d}">${we(c)}</span>`:we(c);i+=c.length}if(t&&!s)o+=l;return o}function D(e,t){try{let o=localStorage.getItem("logomocja:"+e);return o===null?t:JSON.parse(o)}catch{return t}}function I(e,t){try{localStorage.setItem("logomocja:"+e,JSON.stringify(t))}catch{}}function Le(e){try{localStorage.removeItem("logomocja:"+e)}catch{}}var De=20*Math.PI/180,Ne=[10,50,100,500,1000,5000,1e4,50000,1e5],dt=[14,4,2,4];function Ie(e,t,o,n=t/2,i=o/2){let s=Math.cos(e.el),r=Math.sin(e.el),l=Math.sin(e.az),c=Math.cos(e.az),d=e.t[0]+s*l*e.dist,m=e.t[1]-s*c*e.dist,p=e.t[2]+r*e.dist,a=-s*l,f=s*c,y=-r,g=c,L=l,R=-r*l,N=r*c,T=s,w=o/2/Math.tan(De),k=Math.max(0.5,e.dist*0.01),b=(v)=>{let M=v[0]-d,z=v[1]-m,S=v[2]-p;return[M*g+z*L,M*R+z*N+S*T,M*a+z*f+S*y]},u=(v)=>{let M=b(v),z=Math.max(M[2],k);return[n+M[0]*w/z,i-M[1]*w/z,M[2]]};return u.focal=w,u.near=k,u.seg=(v,M)=>{let z=b(v),S=b(M);if(z[2]<k&&S[2]<k)return null;if(z[2]<k||S[2]<k){let F=(k-z[2])/(S[2]-z[2]),H=[z[0]+(S[0]-z[0])*F,z[1]+(S[1]-z[1])*F,k];if(z[2]<k)z=H;else S=H}return[n+z[0]*w/z[2],i-z[1]*w/z[2],n+S[0]*w/S[2],i-S[1]*w/S[2],(z[2]+S[2])/2]},u}function pt(e){let t=[0,0,0],o=[0,0,0],n=(i)=>{for(let s=0;s<3;s++){if(i[s]<t[s])t[s]=i[s];if(i[s]>o[s])o[s]=i[s]}};for(let i of e.segments)n(i.from),n(i.to);if(e.target)for(let i of e.target)n(i.from),n(i.to);if(e.turtle)n(e.turtle.pos);return{lo:t,hi:o}}function Wt(e,t,o,n){let{lo:i,hi:s}=pt(e),r=Math.max(40,t-n.left-n.right),l=Math.max(40,o-n.top-n.bottom),c=Math.max(s[0]-i[0],1),d=Math.max(s[1]-i[1],1),p=c<=1&&d<=1?1.5:Math.min(r*0.84/c,l*0.84/d);p=Math.min(p,3);let a=(i[0]+s[0])/2,f=(i[1]+s[1])/2,y=(n.left-n.right)/2,g=(n.top-n.bottom)/2;return{x:a-y/p,y:f+g/p,scale:p}}function Ae(e,t,o,n,i=0.5,s=0.5){let{lo:r,hi:l}=pt(e),c=[(r[0]+l[0])/2,(r[1]+l[1])/2,(r[2]+l[2])/2],d=0,m=(g)=>{d=Math.max(d,Math.hypot(g[0]-c[0],g[1]-c[1],g[2]-c[2]))};for(let g of e.segments)m(g.from),m(g.to);if(e.target)for(let g of e.target)m(g.from),m(g.to);m([0,0,0]),d=Math.max(d,60);let p=Math.max(40,t-n.left-n.right),a=Math.max(40,o-n.top-n.bottom),f=o/2/Math.tan(De),y=Math.atan(Math.min(p,a)/2/f);return{az:i,el:s,dist:d/Math.sin(y)*1.12,t:c}}function ht(e,t){for(let o of Ne)if(o*e>=t)return o;return Ne[Ne.length-1]}var ut=(e,t)=>Math.max(0.75,e*Math.min(1,Math.max(0.4,t)));function Ot(e,t,o,n,i,s,r){let l=(y)=>t/2+(y-i.x)*i.scale,c=(y)=>o/2-(y-i.y)*i.scale;if(r){let y=ht(i.scale,12),g=y*(String(y)[0]==="1"?5:2),L=i.x-t/2/i.scale,R=i.x+t/2/i.scale,N=i.y-o/2/i.scale,T=i.y+o/2/i.scale;for(let[b,u]of[[y,s.grid],[g,s.gridStrong]]){e.beginPath();for(let v=Math.ceil(L/b)*b;v<=R;v+=b){if(b===y&&v%g===0)continue;let M=Math.round(l(v))+0.5;e.moveTo(M,0),e.lineTo(M,o)}for(let v=Math.ceil(N/b)*b;v<=T;v+=b){if(b===y&&v%g===0)continue;let M=Math.round(c(v))+0.5;e.moveTo(0,M),e.lineTo(t,M)}e.strokeStyle=u,e.lineWidth=1,e.stroke()}let w=Math.round(l(0))+0.5,k=Math.round(c(0))+0.5;e.beginPath(),e.setLineDash(dt),e.lineDashOffset=-(k%24),e.moveTo(w,0),e.lineTo(w,o),e.strokeStyle=s.inkSoft,e.globalAlpha=0.6,e.stroke(),e.beginPath(),e.lineDashOffset=-(w%24),e.moveTo(0,k),e.lineTo(t,k),e.stroke(),e.setLineDash([]),e.lineDashOffset=0,e.globalAlpha=1,e.beginPath(),e.arc(w,k,4.5,0,Math.PI*2),e.fillStyle=s.sheet,e.fill(),e.strokeStyle=s.ink,e.lineWidth=1,e.stroke(),e.fillStyle=s.inkSoft,e.font='13px osifont, "Public Sans", sans-serif',e.textBaseline="top",e.fillText("0",w+8,k+6)}if(e.lineCap="round",e.lineJoin="round",n.target){e.beginPath();for(let y of n.target)e.moveTo(l(y.from[0]),c(y.from[1])),e.lineTo(l(y.to[0]),c(y.to[1]));e.setLineDash([7,5]),e.lineCap="butt",e.strokeStyle=s.target,e.lineWidth=1.5,e.stroke(),e.setLineDash([]),e.lineCap="round"}let d=n.segments,m="",p=-1,a=!1;for(let y=0;y<d.length;y++){let g=d[y];if(g.color!==m||g.width!==p){if(a)e.stroke();m=g.color,p=g.width,e.beginPath(),e.strokeStyle=m,e.lineWidth=ut(p,i.scale),a=!0}e.moveTo(l(g.from[0]),c(g.from[1])),e.lineTo(l(g.to[0]),c(g.to[1]))}if(a)e.stroke();let f=n.turtle;if(f){let y=l(f.pos[0]),g=c(f.pos[1]),L=f.h[0],R=-f.h[1],N=Math.hypot(L,R)||1,T=L/N,w=R/N,k=15,b=8;e.beginPath(),e.moveTo(y+T*15,g+w*15),e.lineTo(y-T*7-w*8,g-w*7+T*8),e.lineTo(y-T*3,g-w*3),e.lineTo(y-T*7+w*8,g-w*7-T*8),e.closePath(),e.fillStyle=f.pen?s.turtle:s.sheet,e.fill(),e.strokeStyle=f.pen?s.ink:s.turtle,e.lineWidth=1.5,e.stroke()}}function Ht(e,t,o,n,i,s,r,l,c){let d=Ie(i,t,o,l,c),m=(k,b)=>{let u=d.seg(k,b);if(u)e.moveTo(u[0],u[1]),e.lineTo(u[2],u[3])},p=d.focal/i.dist,a=ht(p,22);if(r){let b=Math.round(i.t[0]/a)*a,u=Math.round(i.t[1]/a)*a;e.beginPath();for(let S=-10;S<=10;S++)m([b+S*a,u-10*a,0],[b+S*a,u+10*a,0]),m([b-10*a,u+S*a,0],[b+10*a,u+S*a,0]);e.strokeStyle=s.grid,e.lineWidth=1,e.stroke();let v=a*4;e.beginPath(),e.setLineDash(dt),m([b-10*a,0,0],[b+10*a,0,0]),m([0,u-10*a,0],[0,u+10*a,0]),e.strokeStyle=s.inkSoft,e.globalAlpha=0.6,e.stroke(),e.setLineDash([]),e.globalAlpha=1,e.beginPath(),m([0,0,0],[v,0,0]),m([0,0,0],[0,v,0]),m([0,0,0],[0,0,v]),e.strokeStyle=s.ink,e.lineWidth=1,e.stroke(),e.font='15px osifont, "Public Sans", sans-serif',e.textBaseline="middle",e.textAlign="center",e.fillStyle=s.ink;let M=[["X",[v*1.12,0,0]],["Y",[0,v*1.12,0]],["Z",[0,0,v*1.12]]];for(let[S,F]of M){let H=d(F);if(H[2]>d.near)e.fillText(S,H[0],H[1])}e.textAlign="start";let z=d([0,0,0]);if(z[2]>d.near)e.beginPath(),e.arc(z[0],z[1],3.5,0,Math.PI*2),e.fillStyle=s.sheet,e.fill(),e.stroke()}if(e.lineJoin="round",n.target){e.beginPath();for(let k of n.target)m(k.from,k.to);e.setLineDash([7,5]),e.lineCap="butt",e.strokeStyle=s.target,e.lineWidth=1.5,e.stroke(),e.setLineDash([])}e.lineCap="round";let f=n.segments,y=f.length,g=new Float64Array(y*5),L=[];for(let k=0;k<y;k++){let b=d.seg(f[k].from,f[k].to);if(!b)continue;g.set(b,k*5),L.push(k)}L.sort((k,b)=>g[b*5+4]-g[k*5+4]);let R="",N=-1,T=!1;for(let k of L){let b=f[k],u=g[k*5+4],v=Math.round(ut(b.width,d.focal/u)*4)/4;if(b.color!==R||v!==N){if(T)e.stroke();R=b.color,N=v,e.beginPath(),e.strokeStyle=R,e.lineWidth=v,T=!0}e.moveTo(g[k*5],g[k*5+1]),e.lineTo(g[k*5+2],g[k*5+3])}if(T)e.stroke();let w=n.turtle;if(w){let k=d(w.pos);if(k[2]>d.near){let b=k[2]/d.focal*1,u=15*b,v=7*b,M=8*b,z=(W,q,Z)=>d([w.pos[0]+w.h[0]*W+w.r[0]*q+w.u[0]*Z,w.pos[1]+w.h[1]*W+w.r[1]*q+w.u[1]*Z,w.pos[2]+w.h[2]*W+w.r[2]*q+w.u[2]*Z]),S=(W,q,Z)=>{e.beginPath(),e.moveTo(W[0][0],W[0][1]);for(let te=1;te<W.length;te++)e.lineTo(W[te][0],W[te][1]);e.closePath(),e.fillStyle=q,e.fill(),e.strokeStyle=Z,e.lineWidth=1.5,e.stroke()},F=[z(u,0,0),z(-v,-M,0),z(-v*0.4,0,0),z(-v,M,0)],H=[z(u*0.2,0,0),z(-v,0,0),z(-v,0,M*1.1)],Ze=w.pen?s.turtle:s.sheet,ce=w.pen?s.ink:s.turtle;if((()=>{let W=Math.cos(i.el),q=i.t[0]+W*Math.sin(i.az)*i.dist-w.pos[0],Z=i.t[1]-W*Math.cos(i.az)*i.dist-w.pos[1],te=i.t[2]+Math.sin(i.el)*i.dist-w.pos[2];return q*w.u[0]+Z*w.u[1]+te*w.u[2]>=0})())S(F,Ze,ce),S(H,s.sheet,ce);else S(H,s.sheet,ce),S(F,Ze,ce)}}}function lt(e,t,o,n,i,s,r,l,c=!0){if(e.save(),e.fillStyle=r.sheet,e.fillRect(0,0,t,o),n.mode==="2d")Ot(e,t,o,n,i,r,c);else Ht(e,t,o,n,s,r,c,t/2+(l.left-l.right)/2,o/2+(l.top-l.bottom)/2);e.restore()}var Bt={top:0,right:0,bottom:0,left:0};class Re{canvas;scene={mode:"2d",segments:[],target:null,turtle:null};cam2={x:0,y:0,scale:1.5};cam3={az:0.5,el:0.5,dist:500,t:[0,0,0]};insets={...Bt};palette;onCamera=()=>{};auto=!0;w=300;h=200;ctx;dirty=!1;pointers=new Map;pinch=0;constructor(e,t){this.canvas=e,this.palette=t,this.ctx=e.getContext("2d"),new ResizeObserver(()=>this.resize()).observe(e),this.resize(),this.bind()}resize(){let e=this.canvas.getBoundingClientRect();if(e.width<2||e.height<2)return;let t=Math.min(window.devicePixelRatio||1,3);this.w=e.width,this.h=e.height;let o=Math.round(e.width*t),n=Math.round(e.height*t);if(this.canvas.width!==o||this.canvas.height!==n)this.canvas.width=o,this.canvas.height=n;if(this.auto)this.fit(!0);this.drawNow()}invalidate(){if(this.dirty)return;this.dirty=!0,requestAnimationFrame(()=>this.drawNow())}drawNow(){this.dirty=!1;let e=this.canvas.width/this.w;this.ctx.setTransform(e,0,0,e,0,0),lt(this.ctx,this.w,this.h,this.scene,this.cam2,this.cam3,this.palette,this.insets)}fit(e=!1){if(this.scene.mode==="2d")this.cam2=Wt(this.scene,this.w,this.h,this.insets);else this.cam3=Ae(this.scene,this.w,this.h,this.insets,this.cam3.az,this.cam3.el);if(!e)this.auto=!0;this.changed(!0)}resetCamera(){this.cam3.az=0.5,this.cam3.el=0.5,this.fit()}zoomBy(e,t=this.w/2,o=this.h/2){if(this.scene.mode==="2d"){let n=this.cam2,i=Math.min(200,Math.max(0.002,n.scale*e)),s=n.x+(t-this.w/2)/n.scale,r=n.y-(o-this.h/2)/n.scale;n.x=s-(t-this.w/2)/i,n.y=r+(o-this.h/2)/i,n.scale=i}else this.cam3.dist=Math.min(600000,Math.max(5,this.cam3.dist/e));this.changed()}panBy(e,t){if(this.scene.mode==="2d")this.cam2.x-=e/this.cam2.scale,this.cam2.y+=t/this.cam2.scale;else{let o=this.cam3,n=o.dist/(this.h/2/Math.tan(De)),i=Math.sin(o.az),s=Math.cos(o.az),r=Math.sin(o.el),l=Math.cos(o.el);o.t[0]+=(-e*s+t*-r*i)*n,o.t[1]+=(-e*i+t*r*s)*n,o.t[2]+=t*l*n}this.changed()}orbitBy(e,t){let o=this.cam3;o.az-=e*0.008,o.el=Math.min(1.553,Math.max(-1.553,o.el+t*0.008)),this.changed()}scaleLabel(){if(this.scene.mode==="3d")return`odl. ${Math.round(this.cam3.dist)}`;let e=this.cam2.scale,t=(o)=>o>=10?String(Math.round(o)):String(Math.round(o*10)/10).replace(".",",");return e>=1?`${t(e)}:1`:`1:${t(1/e)}`}changed(e=!1){if(!e)this.auto=!1;this.onCamera(),this.invalidate()}bind(){let e=this.canvas,t=(n)=>{let i=e.getBoundingClientRect();return{x:n.clientX-i.left,y:n.clientY-i.top}};e.addEventListener("pointerdown",(n)=>{e.setPointerCapture(n.pointerId),this.pointers.set(n.pointerId,t(n)),this.pinch=0,e.classList.add("is-dragging")}),e.addEventListener("pointermove",(n)=>{let i=this.pointers.get(n.pointerId);if(!i)return;let s=t(n);if(this.pointers.set(n.pointerId,s),this.pointers.size===1){let r=s.x-i.x,l=s.y-i.y;if(this.scene.mode==="3d"&&!n.shiftKey&&!(n.buttons&6))this.orbitBy(r,l);else this.panBy(r,l)}else if(this.pointers.size===2){let[r,l]=[...this.pointers.values()],c=Math.hypot(r.x-l.x,r.y-l.y),d=(r.x+l.x)/2,m=(r.y+l.y)/2;if(this.pinch>0&&c>0)this.zoomBy(c/this.pinch,d,m);this.pinch=c,this.panBy((s.x-i.x)/2,(s.y-i.y)/2)}});let o=(n)=>{if(this.pointers.delete(n.pointerId),this.pinch=0,!this.pointers.size)e.classList.remove("is-dragging")};e.addEventListener("pointerup",o),e.addEventListener("pointercancel",o),e.addEventListener("contextmenu",(n)=>n.preventDefault()),e.addEventListener("wheel",(n)=>{n.preventDefault();let i=t(n),s=n.deltaMode===1?n.deltaY*30:n.deltaY;this.zoomBy(Math.exp(-s*0.0015),i.x,i.y)},{passive:!1}),e.addEventListener("dblclick",()=>this.fit()),e.addEventListener("keydown",(n)=>{if(n.ctrlKey||n.metaKey||n.altKey)return;let i=24,s=(r,l)=>{if(this.scene.mode==="3d"&&!n.shiftKey)this.orbitBy(r,l);else this.panBy(r,l)};switch(n.key){case"ArrowLeft":s(i,0);break;case"ArrowRight":s(-i,0);break;case"ArrowUp":s(0,i);break;case"ArrowDown":s(0,-i);break;case"+":case"=":this.zoomBy(1.25);break;case"-":case"_":this.zoomBy(0.8);break;case"0":this.fit();break;default:return}n.preventDefault()})}toPNG(){let t=document.createElement("canvas");t.width=Math.round(this.w*2),t.height=Math.round(this.h*2);let o=t.getContext("2d");return o.setTransform(2,0,0,2,0,0),lt(o,this.w,this.h,{...this.scene,turtle:null},this.cam2,this.cam3,this.palette,this.insets),new Promise((n)=>t.toBlob(n,"image/png"))}}var mt=new Map;function fe(e,t,o,n=!1){let i=mt.get(e);if(i)return i;let s=240,r=180,l=16,c;if(o==="3d"){let u=Ae({mode:o,segments:t,target:null,turtle:null},s,r,{top:0,right:0,bottom:0,left:0}),v=Ie(u,s,r);c=[];for(let M of t){let z=v.seg(M.from,M.to);if(z)c.push({x1:z[0],y1:z[1],x2:z[2],y2:z[3],z:z[4],color:M.color,width:M.width})}c.sort((M,z)=>z.z-M.z)}else c=t.map((u)=>({x1:u.from[0],y1:-u.from[1],x2:u.to[0],y2:-u.to[1],z:0,color:u.color,width:u.width}));let d=1/0,m=1/0,p=-1/0,a=-1/0;for(let u of c)d=Math.min(d,u.x1,u.x2),p=Math.max(p,u.x1,u.x2),m=Math.min(m,u.y1,u.y2),a=Math.max(a,u.y1,u.y2);if(!c.length)d=m=0,p=a=1;let f=Math.min((s-l*2)/Math.max(p-d,1),(r-l*2)/Math.max(a-m,1)),y=s/2-(d+p)/2*f,g=r/2-(m+a)/2*f,L=(u)=>(Math.round(u*10)/10).toString(),R="",N="",T="",w=-1,k=()=>{if(!N)return;R+=n?`<path d="${N}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>`:`<path d="${N}" fill="none" stroke="${T}" stroke-width="${L(Math.max(1,w*0.55))}" stroke-linecap="round" stroke-linejoin="round"/>`,N=""};for(let u of c){if(!n&&(u.color!==T||u.width!==w))k(),T=u.color,w=u.width;N+=`M${L(u.x1*f+y)} ${L(u.y1*f+g)}L${L(u.x2*f+y)} ${L(u.y2*f+g)}`}k();let b=`<svg viewBox="0 0 ${s} ${r}" aria-hidden="true" focusable="false">${R}</svg>`;return mt.set(e,b),b}var _=(e)=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),X=(e)=>e.toString().replace(/\B(?=(\d{3})+$)/g," "),Vt=/Mac|iPhone|iPad/.test(navigator.platform||""),We=Vt?"⌘":"Ctrl";function _t(e){let t=e%10,o=e%100;if(e===1)return"odcinek";return t>=2&&t<=4&&!(o>=12&&o<=14)?"odcinki":"odcinków"}function wt(){let e=(t,o,n)=>`
    <section class="group" aria-labelledby="g-${t}">
      <div class="group-head"><h2 id="g-${t}">${o}</h2><p>${n}</p></div>
      <ul class="tiles">
        ${Ee.filter((i)=>i.mode===t).map((i)=>{let s=B(i.source,i.mode).segments;return`<li><button type="button" class="tile" data-example="${i.id}">
            <span class="thumb">${fe("ex:"+i.id,s,i.mode)}</span>
            <span class="tile-name">${_(i.name)}</span>
            <span class="tile-text">${_(i.blurb)}</span>
            <span class="tile-meta"><span class="tag">${i.mode.toUpperCase()}</span>${s.length} ${_t(s.length)}</span>
          </button></li>`}).join("")}
      </ul>
    </section>`;return`
    <div class="page page-wide">
      <header class="page-head">
        <h1 tabindex="-1">Przykłady</h1>
        <p>Trzynaście gotowych programów. Wybierz rysunek, a jego kod otworzy się w pracowni we właściwym trybie. Jeśli masz tam własny, niezapisany szkic, najpierw o niego zapytamy.</p>
      </header>
      ${e("2d","Na płaszczyźnie","Tryb 2D: żółw chodzi po kartce.")}
      ${e("3d","W przestrzeni","Tryb 3D: żółw unosi nos i przechyla się na boki.")}
    </div>`}function kt(){let e=D("zaliczone",[]);return`
    <div class="page page-wide">
      <header class="page-head">
        <h1 tabindex="-1">Zadania</h1>
        <p>Na arkuszu czeka wzór narysowany linią przerywaną. Napisz program, który go pokryje, i sprawdź rysunek. Liczy się kształt, rozmiar i położenie; kolejność kresek, kolor i grubość są dowolne.</p>
        <p class="progress"><span class="n">${O.filter((o)=>e.includes(o.id)).length} / ${O.length}</span> zaliczonych. Postęp zapisuje się w tej przeglądarce.</p>
      </header>
      <ol class="tiles tiles-tasks">
        ${O.map((o,n)=>{let i=e.includes(o.id);return`<li><a class="tile" href="#/zadania/${o.id}">
            <span class="thumb thumb-target">${fe("ch:"+o.id,ae(o),o.mode,!0)}</span>
            <span class="tile-name"><span class="n">${n+1}.</span> ${_(o.title)}</span>
            <span class="tile-text">${_(o.task)}</span>
            <span class="tile-meta"><span class="tag">${o.mode.toUpperCase()}</span>${i?`<span class="done">${P.check}zaliczone</span>`:"do zrobienia"}</span>
          </a></li>`}).join("")}
      </ol>
    </div>`}function ft(){return`<div class="page"><header class="page-head"><h1 tabindex="-1">Nie ma takiej strony</h1>
    <p>Ten adres nie prowadzi do żadnej części Logomocji. <a href="#/">Wróć do pracowni</a>.</p></header></div>`}var gt=0;function V(e,t="2d"){let o=B(e,t),n="ref:"+gt++,i=o.segments.length?`<span class="thumb thumb-small">${fe(n,o.segments,t)}</span>`:"";return`<div class="sample">
    <pre class="code"><code>${ke(e)}</code></pre>
    ${i}
    <button type="button" class="btn btn-small" data-try="${_(e)}" data-mode="${t}">${P.arrow}<span>Wypróbuj w ${t.toUpperCase()}</span></button>
  </div>`}function ge(e){let t=e.names??de[e.id];return`<article class="cmd">
    <h3><code>${_(t[0])}</code>${e.args?` <span class="args">${_(e.args)}</span>`:""}</h3>
    ${t.length>1?`<p class="aliases">Inne zapisy: ${t.slice(1).map((o)=>`<code>${_(o)}</code>`).join(", ")}</p>`:""}
    <p>${e.text}</p>
    ${V(e.code,e.mode)}
  </article>`}var Ut=[{id:"fd",args:"odległość",text:"Żółw idzie naprzód o podaną odległość. Jeśli pisak jest opuszczony, zostawia odcinek.",code:"np 100"},{id:"bk",args:"odległość",text:"Żółw cofa się o podaną odległość, nie zmieniając kierunku, w którym patrzy.",code:`np 100
ws 40`},{id:"rt",args:"kąt",text:"Obrót w prawo o kąt w stopniach. Sam obrót niczego nie rysuje.",code:`np 80
pw 90
np 80`},{id:"lt",args:"kąt",text:"Obrót w lewo o kąt w stopniach.",code:`np 80
lw 45
np 80`},{id:"home",args:"",text:"Żółw wraca do punktu startu (0, 0, 0) i ustawia się nosem do góry arkusza. Z opuszczonym pisakiem rysuje po drodze odcinek.",code:`pw 30
np 100
pw 120
np 100
dom`},{id:"cs",args:"",text:"Ściera cały dotychczasowy rysunek. Żółw zostaje tam, gdzie stał, i patrzy tam, gdzie patrzył.",code:`np 100
czyść
pw 90
np 60`}],Kt=[{id:"pu",args:"",text:"Podnosi pisak: od tej chwili żółw chodzi, ale nie rysuje.",code:`np 40
pod
np 40
opu
np 40`},{id:"pd",args:"",text:"Opuszcza pisak: żółw znów rysuje. Na początku programu pisak jest opuszczony.",code:`pod
np 50
opu
np 50`},{id:"color",args:'"#rrggbb"',text:'Ustawia kolor pisaka. Kolor to znak # i sześć cyfr szesnastkowych w cudzysłowie. Kolor początkowy to <code>"#16866a"</code>.',code:`kolor "#c1763d"
np 60
kolor "#2b6fb3"
np 60`},{id:"width",args:"liczba",text:"Ustawia grubość pisaka: liczba całkowita od 1 do 12. Grubość początkowa to 3.",code:`grubosc 1
np 40
grubosc 6
np 40
grubosc 12
np 40`}],Ft=[{id:"repeat",args:"ile [ polecenia ]",text:"Wykonuje polecenia z nawiasu podaną liczbę razy. Liczba powtórzeń musi być całkowita, od 0 do 10 000.",code:`powtorz 5 [
  np 100
  pw 144
]`},{names:["nrpowt","repcount"],args:"",text:"Numer bieżącego powtórzenia, liczony od 1. Działa tylko wewnątrz nawiasów <code>powtorz</code> i dotyczy najbliższego powtarzania.",code:`powtorz 20 [
  np nrpowt * 6
  pw 90
]`},{id:"if",args:"warunek [ polecenia ]",text:"Wykonuje polecenia tylko wtedy, gdy warunek jest prawdziwy. Warunek to dwa wyrażenia i znak porównania między nimi: <code>&lt;</code>, <code>&gt;</code>, <code>=</code>, <code>&lt;=</code>, <code>&gt;=</code> albo <code>&lt;&gt;</code> (różne).",code:`powtorz 8 [
  jeśli nrpowt > 4 [kolor "#c1763d"]
  np 60
  pw 45
]`},{id:"ifelse",args:"warunek [ gdy prawda ] [ gdy fałsz ]",text:"Wybiera jeden z dwóch bloków: pierwszy, gdy warunek jest prawdziwy, drugi, gdy fałszywy.",code:`powtorz 10 [
  jeżeli nrpowt < 6 [np 30] [np 60]
  pw 36
]`},{id:"stop",args:"",text:"Kończy bieżącą procedurę i wraca do miejsca, z którego ją wywołano, także ze środka powtarzania. Poza procedurą kończy cały program.",code:`oto promień ma: dł
  jeśli dł > 100 [stop]
  np dł
  ws dł
już

powtorz 12 [
  promień nrpowt * 12
  pw 30
]`}],qt=[{id:"pitchup",args:"kąt",mode:"3d",text:"Unosi nos żółwia o podany kąt. Po <code>gora 90</code> żółw patrzy pionowo w górę.",code:`np 80
gora 90
np 80`},{id:"pitchdown",args:"kąt",mode:"3d",text:"Opuszcza nos żółwia o podany kąt.",code:`gora 45
np 80
dol 90
np 80`},{id:"rollright",args:"kąt",mode:"3d",text:"Przechyla żółwia w prawo wokół kierunku, w którym patrzy. Sam przechył nie zmienia kierunku marszu, ale zmienia to, co znaczą następne skręty.",code:`powtorz 6 [
  powtorz 4 [np 70 pw 90]
  pp 60
]`},{id:"rollleft",args:"kąt",mode:"3d",text:"Przechyla żółwia w lewo wokół kierunku, w którym patrzy.",code:`powtorz 3 [
  powtorz 3 [np 90 pw 120]
  pl 120
]`}];function zt(){gt=0;let e=(o)=>`<kbd>${o}</kbd>`,t=[["zapis","Zapis programu",`
      <p>Program to polecenia oddzielone odstępami lub nowymi wierszami. W jednym wierszu może stać kilka poleceń. Wielkość liter nie ma znaczenia: <code>NP</code>, <code>Np</code> i <code>np</code> to to samo polecenie. Większość poleceń ma kilka zapisów: krótki, pełny (z polskimi znakami albo bez) i angielski.</p>
      <ul>
        <li><strong>Komentarz</strong> zaczyna się średnikiem i trwa do końca wiersza.</li>
        <li><strong>Liczby</strong> zapisuje się cyframi z kropką dziesiętną: <code>80</code>, <code>12.5</code>, <code>.5</code>. Zapisy takie jak <code>5.</code>, <code>1e3</code> czy <code>0x10</code> są błędem.</li>
        <li><strong>Nazwy</strong> zmiennych i procedur zaczynają się od litery (także polskiej) lub podkreślnika, dalej mogą mieć cyfry. Nie mogą powtarzać nazw poleceń.</li>
        <li><strong>Nawiasy kwadratowe</strong> obejmują polecenia do powtórzenia lub warunkowego wykonania, <strong>okrągłe</strong> grupują obliczenia.</li>
      </ul>
      ${V(`; Dwa polecenia w wierszu, potem komentarz
NP 60 pw 90 ; skręt w prawo
naprzód 60`)}
      <p>Na starcie żółw stoi w punkcie (0, 0, 0), patrzy w górę arkusza (wzdłuż osi Y), pisak jest opuszczony, ma kolor <code>"#16866a"</code> i grubość 3. Kąty podaje się w stopniach.</p>`],["ruch","Ruch i arkusz",Ut.map(ge).join("")],["pisak","Pisak",Kt.map(ge).join("")],["sterowanie","Powtarzanie i warunki",Ft.map(ge).join("")],["zmienne","Zmienne",`
      <article class="cmd">
        <h3><code>niech</code> <span class="args">nazwa wartość</span></h3>
        <p class="aliases">Inne zapisy: <code>let</code></p>
        <p>Nadaje zmiennej wartość. Tej samej zmiennej można potem nadać nową wartość, także obliczoną ze starej. W wyrażeniach nazwę zmiennej pisze się po prostu (<code>bok</code>) albo z dwukropkiem (<code>:bok</code>).</p>
        ${V(`niech bok 20
powtorz 5 [
  powtorz 4 [np bok pw 90]
  niech bok bok + 20
]`)}
        <p>Zmienna nadana poza procedurami jest wspólna dla całego programu. <code>niech</code> wewnątrz procedury tworzy zmienną lokalną, która znika po zakończeniu procedury. Procedura może czytać zmienne wspólne, jeśli nie ma własnej o tej samej nazwie. Użycie zmiennej, zanim dostanie wartość, jest błędem.</p>
      </article>`],["wyrazenia","Wyrażenia",`
      <p>Wszędzie, gdzie polecenie oczekuje liczby, można wpisać wyrażenie: liczby, zmienne, <code>nrpowt</code>, działania <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, nawiasy okrągłe i minus przed wartością. Mnożenie i dzielenie mają pierwszeństwo przed dodawaniem i odejmowaniem, a działania o tym samym pierwszeństwie liczy się od lewej.</p>
      ${V(`niech n 7
powtorz n [
  np (40 + 20) * 1.5
  pw 360 / n
]`)}
      <article class="cmd">
        <h3>Odstępy wokół działań</h3>
        <p>Polecenia nie mają nawiasów wokół argumentów, więc o tym, gdzie kończy się jedna wartość, a zaczyna następna, decydują odstępy. Znak działania musi mieć odstęp <strong>z obu stron albo z żadnej</strong>: <code>10 - 5</code> i <code>10-5</code> to odejmowanie. Znak z odstępem tylko z lewej strony zaczyna nową wartość: w <code>dwa 10 -5</code> procedura dostaje dwie wartości, 10 i −5.</p>
        ${V(`oto krok ma: a, b
  np a pw 90 np b lw 90
już

krok 60 -20
krok 60 - 20 30`)}
        <p>Dzielenie przez zero i wynik zbyt duży, by był liczbą, zatrzymują program z komunikatem.</p>
      </article>`],["procedury","Procedury",`
      <article class="cmd">
        <h3><code>oto</code> <span class="args">nazwa ma: parametr, parametr</span> … <code>już</code></h3>
        <p class="aliases">Inne zapisy: <code>to</code> … <code>juz</code>, <code>end</code>; parametry także w stylu <code>oto kwadrat :bok</code></p>
        <p>Definiuje własne polecenie. Nagłówek zajmuje cały wiersz i zaczyna się na jego początku; treść stoi w następnych wierszach, a słowo <code>już</code> w osobnym wierszu kończy definicję. Procedurę wywołuje się jej nazwą, podając tyle wartości, ile ma parametrów. Definicja może stać w programie niżej niż wywołanie.</p>
        ${V(`oto kwadrat ma: bok
  powtorz 4 [np bok pw 90]
już

kwadrat 40
kwadrat 80
kwadrat 120`)}
        <p>Procedura może wywoływać samą siebie. Taka rekurencja musi mieć warunek z poleceniem <code>stop</code>, inaczej program zatrzyma limit zagnieżdżenia albo limit operacji. Procedury nie zwracają wyników i nie można ich definiować wewnątrz nawiasów ani innych procedur.</p>
        ${V(`oto gałąź ma: dł
  jeśli dł < 10 [stop]
  np dł
  lw 30 gałąź dł * 0.65
  pw 60 gałąź dł * 0.65
  lw 30
  ws dł
już

gałąź 80`)}
      </article>`],["przestrzen","Trzeci wymiar",`
      <p>W trybie 3D żółw ma trzy osie obrotu. <code>pw</code> i <code>lw</code> skręcają go wokół jego własnego grzbietu, <code>gora</code> i <code>dol</code> unoszą i opuszczają nos, a <code>pp</code> i <code>pl</code> przechylają go na boki. Każdy obrót liczy się względem aktualnego ustawienia żółwia, nie względem arkusza. Program bez tych czterech poleceń rysuje w obu trybach dokładnie to samo, na płaszczyźnie siatki. W trybie 2D polecenia przestrzenne są błędem, zanim cokolwiek zostanie narysowane.</p>
      ${qt.map(ge).join("")}`],["bledy","Błędy",`
      <p>Każdy komunikat podaje wiersz i kolumnę oraz podpowiada, co poprawić. Miejsce błędu jest podkreślone w edytorze, a numer wiersza zaznaczony na marginesie.</p>
      <ul>
        <li><strong>Błąd w zapisie</strong> (nieznane polecenie, brak nawiasu, zła liczba argumentów) wykrywa się przed uruchomieniem. Żółw nie rysuje wtedy niczego.</li>
        <li><strong>Błąd w trakcie rysowania</strong> (dzielenie przez zero, przekroczony limit, zmienna bez wartości) zatrzymuje program. To, co żółw zdążył narysować, zostaje na arkuszu.</li>
      </ul>
      ${V(`np 100
pw 90
np 100 / 0`)}`],["limity","Ograniczenia",`
      <p>Limity chronią przeglądarkę przed programem, który nigdy się nie kończy. Tabelka rysunkowa na arkuszu pokazuje, ile odcinków i operacji program już zużył.</p>
      <table class="limits">
        <thead><tr><th scope="col">Co</th><th scope="col">Limit</th></tr></thead>
        <tbody>
          <tr><th scope="row">Długość programu</th><td class="n">${X(j.chars)} znaków</td></tr>
          <tr><th scope="row">Słowa, liczby i znaki w programie</th><td class="n">${X(j.tokens)}</td></tr>
          <tr><th scope="row">Zagnieżdżenie nawiasów [ ] w zapisie</th><td class="n">${j.depth} poziomy</td></tr>
          <tr><th scope="row">Aktywne naraz powtórzenia i wywołania procedur</th><td class="n">${j.frames}</td></tr>
          <tr><th scope="row">Operacje w jednym uruchomieniu</th><td class="n">${X(j.ops)}</td></tr>
          <tr><th scope="row">Odcinki na arkuszu</th><td class="n">${X(j.segments)}</td></tr>
          <tr><th scope="row">Każda współrzędna żółwia</th><td class="n">od −${X(j.coord)} do ${X(j.coord)}</td></tr>
          <tr><th scope="row">Liczba powtórzeń w <code>powtorz</code></th><td class="n">od 0 do ${X(j.repeat)}, całkowita</td></tr>
          <tr><th scope="row">Grubość pisaka</th><td class="n">od ${j.widthMin} do ${j.widthMax}, całkowita</td></tr>
        </tbody>
      </table>
      <p>Operacją jest każde wykonane polecenie. Dodatkowo po jednej operacji liczy się za każde zakończone powtórzenie, każdy wykonany blok warunku i każde zakończone wywołanie procedury.</p>`],["skroty","Skróty klawiszowe",`
      <table class="limits keys">
        <thead><tr><th scope="col">Czynność</th><th scope="col">Klawisze</th></tr></thead>
        <tbody>
          <tr><th scope="row">Uruchom program lub wznów po pauzie</th><td>${e(We)} + ${e("Enter")}</td></tr>
          <tr><th scope="row">Wykonaj jeden krok</th><td>${e(We)} + ${e(".")}</td></tr>
          <tr><th scope="row">Pauza</th><td>${e("Esc")}</td></tr>
          <tr><th scope="row">Reset: wyczyść arkusz, żółw na start</th><td>${e(We)} + ${e("Shift")} + ${e("Backspace")}</td></tr>
          <tr><th scope="row">Arkusz: przesuń widok (w 3D obróć kamerę)</th><td>strzałki</td></tr>
          <tr><th scope="row">Arkusz 3D: przesuń widok</th><td>${e("Shift")} + strzałki</td></tr>
          <tr><th scope="row">Arkusz: powiększ, pomniejsz, dopasuj</th><td>${e("+")} ${e("−")} ${e("0")}</td></tr>
        </tbody>
      </table>
      <p>Skróty programu działają w całej pracowni, także gdy kursor jest w edytorze. Klawisz Tab nie wstawia wcięcia, tylko przechodzi do następnej kontrolki; wcięcia robi się spacjami, a Enter zachowuje wcięcie poprzedniego wiersza. Myszą arkusz przesuwa się przeciąganiem, a w 3D przeciąganie obraca kamerę (z Shiftem lub prawym przyciskiem przesuwa). Kółko myszy i gest szczypania zmieniają powiększenie.</p>`]];return`
    <div class="page page-ref">
      <nav class="toc" aria-label="Spis treści">
        <ol>${t.map(([o,n])=>`<li><a href="#/polecenia/${o}" data-jump="${o}">${n}</a></li>`).join("")}</ol>
      </nav>
      <div class="ref-body">
        <header class="page-head">
          <h1 tabindex="-1">Polecenia</h1>
          <p>Cały dialekt Logo, którym mówi Logomocja. Każdy przykład jest prawdziwym programem: obok widać, co rysuje, i można go otworzyć w pracowni.</p>
        </header>
        ${t.map(([o,n,i])=>`<section class="ref-sec" id="sec-${o}" aria-labelledby="h-${o}"><h2 id="h-${o}" tabindex="-1">${n}</h2>${i}</section>`).join("")}
      </div>
    </div>`}var yt=(e)=>{let t="";for(let o=0;o<e.length;o+=32768)t+=String.fromCharCode(...e.subarray(o,o+32768));return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},Zt=(e)=>{let t=atob(e.replace(/-/g,"+").replace(/_/g,"/")),o=new Uint8Array(t.length);for(let n=0;n<t.length;n++)o[n]=t.charCodeAt(n);return o};async function bt(e,t){let o=new Response(new Blob([e]).stream().pipeThrough(t));return new Uint8Array(await o.arrayBuffer())}async function Gt(e){let t=new TextEncoder().encode(e),o="b."+yt(t);try{if(typeof CompressionStream<"u"){let n="z."+yt(await bt(t,new CompressionStream("deflate-raw")));if(n.length<o.length)return n}}catch{}return o}async function vt(e){let t=e.slice(0,2),o=Zt(e.slice(2));if(t==="z.")return new TextDecoder().decode(await bt(o,new DecompressionStream("deflate-raw")));if(t==="b.")return new TextDecoder().decode(o);throw Error("format")}async function jt(e,t){return`${location.href.split("#")[0]}#/?tryb=${t}&kod=${await Gt(e)}`}function Oe(e,t){let o=URL.createObjectURL(e),n=document.createElement("a");n.href=o,n.download=t,document.body.append(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(o),2000)}function He(e){let t={ą:"a",ć:"c",ę:"e",ł:"l",ń:"n",ó:"o",ś:"s",ź:"z",ż:"z"};return e.toLowerCase().replace(/[ąćęłńóśźż]/g,(n)=>t[n]).replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"program"}class Be{root;ta;onInput=()=>{};scroll;gutter;code;exec;bubble;lines=0;error=null;execLine=null;constructor(e,t){e.innerHTML=`
      <div class="ed-scroll">
        <div class="ed-gutter" aria-hidden="true"></div>
        <div class="ed-body">
          <div class="ed-exec" hidden></div>
          <pre class="ed-pre" aria-hidden="true"><code></code></pre>
          <textarea class="ed-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="${t}" aria-describedby="status"></textarea>
          <div class="ed-bubble" hidden></div>
        </div>
      </div>`,this.root=e,this.scroll=e.querySelector(".ed-scroll"),this.gutter=e.querySelector(".ed-gutter"),this.code=e.querySelector("code"),this.exec=e.querySelector(".ed-exec"),this.bubble=e.querySelector(".ed-bubble"),this.ta=e.querySelector("textarea"),this.ta.addEventListener("input",()=>{this.render(),this.onInput(this.ta.value)}),this.ta.addEventListener("pointerdown",()=>{this.bubble.hidden=!0}),this.ta.addEventListener("keydown",(o)=>this.key(o)),this.render()}get value(){return this.ta.value}setValue(e){this.ta.value=e,this.error=null,this.execLine=null,this.render(),this.scroll.scrollTop=0,this.scroll.scrollLeft=0}setError(e){if(!e&&!this.error)return;this.error=e,this.render()}setExecLine(e,t=!1){if(this.execLine=e,this.paintExec(),e&&t)this.reveal(e)}focusAt(e,t){let o=this.ta.value.split(`
`),n=0;for(let i=0;i<Math.min(e-1,o.length);i++)n+=o[i].length+1;n=Math.min(this.ta.value.length,n+Math.max(0,t-1)),this.ta.focus(),this.ta.setSelectionRange(n,n),this.reveal(e)}lh(){return parseFloat(getComputedStyle(this.ta).lineHeight)||22}reveal(e){let t=this.lh(),o=(e-1)*t,n=this.scroll;if(o<n.scrollTop+t)n.scrollTop=Math.max(0,o-t*2);else if(o>n.scrollTop+n.clientHeight-t*3)n.scrollTop=o-n.clientHeight+t*4}key(e){if(e.key!=="Enter"||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.isComposing)return;let t=this.ta,o=t.selectionStart,n=t.value.slice(0,o),i=n.slice(n.lastIndexOf(`
`)+1),s=/^[ \t]*/.exec(i)[0];if(/\[\s*$/.test(i))s+="  ";if(!s)return;e.preventDefault();let r=`
`+s;if(!document.execCommand||!document.execCommand("insertText",!1,r))t.setRangeText(r,o,t.selectionEnd,"end"),t.dispatchEvent(new Event("input",{bubbles:!0}))}render(){let e=this.ta.value;this.code.innerHTML=ke(e,this.error)+`
 `;let t=e.split(`
`).length;if(t!==this.lines){this.lines=t;let o="";for(let n=1;n<=t;n++)o+=`<div>${n}</div>`;this.gutter.innerHTML=o}if(this.gutter.querySelector(".is-error")?.classList.remove("is-error"),this.bubble.hidden=!0,this.error){this.gutter.children[this.error.line-1]?.classList.add("is-error");let o=this.code.querySelector("[data-err]");if(o){this.bubble.textContent=this.error.message,this.bubble.hidden=!1;let n=this.lh(),i=Math.max(0,this.scroll.clientWidth-this.gutter.offsetWidth-Math.min(360,this.scroll.clientWidth*0.8)-12+this.scroll.scrollLeft);this.bubble.style.left=`${Math.max(4,Math.min(o.offsetLeft,i))}px`,this.bubble.style.top=`${o.offsetTop+n+4}px`}}this.paintExec()}paintExec(){if(this.gutter.querySelector(".is-exec")?.classList.remove("is-exec"),!this.execLine){this.exec.hidden=!0;return}let e=this.lh();this.exec.hidden=!1,this.exec.style.top=`${(this.execLine-1)*e}px`,this.exec.style.height=`${e}px`,this.gutter.children[this.execLine-1]?.classList.add("is-exec")}}var Ve=[2,5,10,20,40,80,160,400,1200,1/0],Jt=/Mac|iPhone|iPad/.test(navigator.platform||""),_e=Jt?"⌘":"Ctrl",K={"2d":{name:"Szkic 2D",origin:null,source:`; Witaj w pracowni. Zmień liczby i uruchom program jeszcze raz.
powtorz 6 [
  np 90
  pw 60
]
`},"3d":{name:"Szkic 3D",origin:null,source:`; Żółw w przestrzeni: gora i dol unoszą i opuszczają nos.
powtorz 4 [
  np 90
  gora 90
  np 45
  dol 90
  pw 90
]
`}};K["2d"].origin=K["2d"].source;K["3d"].origin=K["3d"].source;var Ue=()=>({pos:[0,0,0],h:[0,1,0],r:[1,0,0],u:[0,0,1],pen:!0,color:"#16866a",width:3}),Q=(e)=>{let t=Math.round(e*10)/10;return(Object.is(t,-0)?0:t).toString().replace(".",",").replace("-","−")},Y=(e)=>e.toString().replace(/\B(?=(\d{3})+$)/g," "),$t=(e)=>{let t=Math.round(e*180/Math.PI*10)/10;if(t<0)t+=360;if(t>=360)t-=360;return Q(t)+"°"};function ze(e,t,o,n){let i=e%10,s=e%100;if(e===1)return t;return i>=2&&i<=4&&!(s>=12&&s<=14)?o:n}var U=(e)=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");class Ke{el;mode;ctx={kind:"free"};host;docs;editor;view;machine=null;state="idle";error=null;frozen=[];turtle=Ue();ops=0;speed;raf=0;last=0;budget=0;lintTimer=0;solved;$;constructor(e,t){this.el=e,this.host=t,this.mode=D("tryb","2d")==="3d"?"3d":"2d",this.docs={"2d":D("szkic:2d",{...K["2d"]}),"3d":D("szkic:3d",{...K["3d"]})};for(let o of["2d","3d"]){let n=this.docs[o];if(!n||typeof n.source!=="string")this.docs[o]={...K[o]}}this.speed=Math.min(10,Math.max(1,D("tempo",6)|0))||6,this.solved=D("zaliczone",[]),e.innerHTML=this.template(),this.$=(o)=>e.querySelector(o),this.editor=new Be(this.$(".ed"),"Program w języku Logo"),this.view=new Re(this.$("canvas"),this.readPalette()),this.view.onCamera=()=>this.paintBlock(),this.editor.onInput=(o)=>this.edited(o),this.bind(),this.measureInsets(),new ResizeObserver(()=>this.measureInsets()).observe(this.$(".sheet")),document.fonts?.load('15px "osifont"').then(()=>this.view.invalidate(),()=>{}),this.show(!1)}template(){let e=(t)=>`<kbd>${t}</kbd>`;return`
    <div class="pane pane-code">
      <section class="task" hidden aria-labelledby="task-title"></section>
      <header class="codebar">
        <h1 class="docname" id="docname"></h1>
        <div class="tools" role="group" aria-label="Plik i udostępnianie">
          <button class="btn btn-quiet" data-act="open" type="button">${P.open}<span>Otwórz</span></button>
          <button class="btn btn-quiet" data-act="save" type="button" title="Pobierz program jako plik .logo">${P.download}<span>Pobierz</span></button>
          <button class="btn btn-quiet" data-act="link" type="button" title="Link, który otwiera ten program">${P.link}<span>Link</span></button>
          <input type="file" id="file" accept=".logo,.lgo,.txt,text/plain" hidden>
        </div>
      </header>
      <div class="notice" hidden></div>
      <div class="ed"></div>
      <div class="status" id="status" role="status" aria-live="polite"></div>
      <div class="runbar" role="group" aria-label="Sterowanie programem">
        <button class="btn btn-primary" data-act="run" type="button" aria-keyshortcuts="Control+Enter">${P.play}<span class="lbl">Uruchom</span>${e(`${_e}&nbsp;Enter`)}</button>
        <button class="btn" data-act="step" type="button" aria-keyshortcuts="Control+.">${P.step}<span class="lbl">Krok</span>${e(`${_e}&nbsp;.`)}</button>
        <button class="btn" data-act="pause" type="button" aria-keyshortcuts="Escape">${P.pause}<span class="lbl">Pauza</span>${e("Esc")}</button>
        <button class="btn" data-act="reset" type="button" aria-keyshortcuts="Control+Shift+Backspace" title="Reset: czyści arkusz i ustawia żółwia na starcie (${_e}+Shift+Backspace)">${P.reset}<span class="lbl">Reset</span></button>
        <label class="speed"><span class="speed-name">Tempo</span>
          <input type="range" id="speed" min="1" max="10" step="1" value="${this.speed}">
          <output for="speed" id="speed-out"></output>
        </label>
      </div>
    </div>
    <div class="pane pane-sheet">
      <div class="sheetbar">
        <fieldset class="seg" id="mode">
          <legend class="vh">Tryb rysowania</legend>
          <label><input type="radio" name="mode" value="2d"><span>2D</span></label>
          <label><input type="radio" name="mode" value="3d"><span>3D</span></label>
        </fieldset>
        <div class="tools" role="group" aria-label="Widok arkusza">
          <button class="btn btn-icon" data-act="zoom-out" type="button" aria-label="Pomniejsz" title="Pomniejsz (−)">${P.minus}</button>
          <button class="btn btn-icon" data-act="zoom-in" type="button" aria-label="Powiększ" title="Powiększ (+)">${P.plus}</button>
          <button class="btn btn-quiet" data-act="fit" type="button" title="Dopasuj rysunek do arkusza (0)">${P.fit}<span>Dopasuj</span></button>
          <button class="btn btn-quiet" data-act="camera" type="button" title="Ustaw kamerę w położeniu początkowym">${P.camera}<span>Kamera</span></button>
          <button class="btn btn-quiet" data-act="png" type="button" title="Zapisz rysunek jako obraz PNG">${P.image}<span>PNG</span></button>
        </div>
      </div>
      <div class="sheet">
        <canvas tabindex="0" role="img" aria-label="Arkusz z rysunkiem" aria-describedby="sheet-help"></canvas>
        <p class="vh" id="sheet-help">Strzałki przesuwają widok, w trybie 3D obracają kamerę, a z klawiszem Shift przesuwają. Plus i minus zmieniają powiększenie, zero dopasowuje rysunek.</p>
        <table class="tblock" aria-label="Tabelka rysunkowa">
          <tbody>
            <tr><th scope="row">Rysunek</th><td colspan="3" id="tb-name"></td></tr>
            <tr><th scope="row">Żółw</th><td id="tb-pos" class="n"></td><th scope="row">Kurs</th><td id="tb-head" class="n"></td></tr>
            <tr><th scope="row">Odcinki</th><td id="tb-seg" class="n"></td><th scope="row">Operacje</th><td id="tb-ops" class="n"></td></tr>
            <tr class="tb-wide"><th scope="row">Pisak</th><td id="tb-pen"></td><th scope="row">Skala</th><td id="tb-scale" class="n"></td></tr>
          </tbody>
        </table>
      </div>
    </div>`}readPalette(){let e=getComputedStyle(document.documentElement),t=(o)=>e.getPropertyValue(o).trim();return{sheet:t("--sheet"),grid:t("--sheet-grid"),gridStrong:t("--sheet-grid-strong"),ink:t("--ink"),inkSoft:t("--ink-soft"),turtle:t("--turtle-mark"),target:t("--ink-soft")}}themeChanged(){this.view.palette=this.readPalette(),this.view.invalidate()}measureInsets(){let e=this.$(".tblock"),t=getComputedStyle(e).position==="absolute";if(this.view.insets={top:0,right:0,bottom:t?e.offsetHeight+8:0,left:0},this.view.auto)this.view.fit(!0)}bind(){this.el.addEventListener("click",(e)=>{let t=e.target.closest("[data-act]");if(!t||t.getAttribute("aria-disabled")==="true")return;this.act(t.dataset.act,t)}),this.$("#speed").addEventListener("input",(e)=>{this.speed=Number(e.target.value),I("tempo",this.speed),this.paintSpeed()}),this.$("#mode").addEventListener("change",(e)=>{let t=e.target.value;if(this.ctx.kind==="free")this.setMode(t)}),this.$("#file").addEventListener("change",async(e)=>{let t=e.target,o=t.files?.[0];if(t.value="",!o)return;if(o.size>400000){this.say("Ten plik jest za duży na program w Logo (limit programu to 50 000 znaków).","warn");return}let n=(await o.text()).replace(/\r\n?/g,`
`),i=o.name.replace(/\.(logo|lgo|txt)$/i,"")||"Program z pliku",s=this.ctx.kind==="challenge"?this.ctx.c.mode:this.mode;if(this.ctx.kind==="challenge")this.replaceSource(n),this.say(`Wczytano plik ${o.name} do tego zadania.`);else await this.loadProgram(n,s,i,`plik ${o.name}`)}),document.addEventListener("keydown",(e)=>{if(this.el.hidden||document.querySelector("dialog[open]"))return;let t=e.ctrlKey||e.metaKey;if(t&&e.key==="Enter")e.preventDefault(),this.act("run");else if(t&&!e.shiftKey&&e.key===".")e.preventDefault(),this.act("step");else if(t&&e.shiftKey&&e.key==="Backspace")e.preventDefault(),this.act("reset");else if(e.key==="Escape"&&this.state==="running")e.preventDefault(),this.act("pause")})}act(e,t){switch(e){case"run":this.state==="running"||this.runProgram();break;case"step":this.stepOnce();break;case"pause":if(this.state==="running")this.pause();break;case"reset":this.reset(),this.say("Arkusz wyczyszczony, żółw wrócił na start.");break;case"zoom-in":this.view.zoomBy(1.25);break;case"zoom-out":this.view.zoomBy(0.8);break;case"fit":this.view.fit();break;case"camera":this.view.resetCamera();break;case"png":this.exportPng();break;case"open":this.$("#file").click();break;case"save":{let o=He(this.docName(!1))+".logo";Oe(new Blob([this.editor.value],{type:"text/plain;charset=utf-8"}),o),this.say(`Pobrano plik ${o}.`);break}case"link":jt(this.editor.value,this.mode).then((o)=>this.host.showLink(o));break;case"restore":this.restoreBackup();break;case"drop-backup":Le(`kopia:${this.mode}`),this.paintNotice();break;case"check":this.check();break;case"goto-error":if(this.error)this.editor.focusAt(this.error.line,this.error.column);break;case"starter":if(this.ctx.kind==="challenge"){let o=this.ctx.c;this.host.confirm("Zacząć zadanie od nowa?","Twój program do tego zadania zostanie zastąpiony programem startowym.","Zacznij od nowa","Zostaw mój program").then((n)=>{if(n)this.replaceSource(o.starter),t?.focus()})}break}}get doc(){return this.docs[this.mode]}docName(e=!0){if(this.ctx.kind==="challenge")return this.ctx.c.title;let t=this.doc;return e&&t.origin!==null&&t.source!==t.origin&&!t.name.startsWith("Szkic")?`${t.name} (zmieniony)`:t.name}persist(){if(this.ctx.kind==="challenge")I(`zadanie:${this.ctx.c.id}`,this.editor.value);else this.doc.source=this.editor.value,I(`szkic:${this.mode}`,this.doc)}edited(e){if(this.persist(),this.state==="running"||this.state==="paused")this.halt(),this.state="idle",this.say("Program zmienił się w trakcie rysowania, więc wykonanie zostało zatrzymane. To, co już narysowane, zostaje na arkuszu.","warn");else if(this.error||this.state==="done"||this.state==="error")this.state="idle",this.say(this.frozen.length?"Program zmieniony. Rysunek na arkuszu pochodzi z poprzedniego uruchomienia.":"Gotowy.");this.error=null,this.editor.setError(null),this.paint(),clearTimeout(this.lintTimer),this.lintTimer=window.setTimeout(()=>this.lint(),500)}lint(){if(this.state==="running"||this.state==="paused")return;try{pe(this.editor.value,this.mode)}catch(e){if(!(e instanceof h))throw e;this.error=J(e),this.editor.setError(this.error),this.sayError("Błąd w programie")}}replaceSource(e){this.halt(),this.editor.setValue(e),this.persist(),this.runInstant(),this.view.fit(),this.paint()}setContext(e){if(this.halt(),clearTimeout(this.lintTimer),this.ctx=e,e.kind==="challenge")this.mode=e.c.mode;else this.mode=D("tryb","2d")==="3d"?"3d":"2d";this.show(!0)}show(e){let t=this.ctx.kind==="challenge"?D(`zadanie:${this.ctx.c.id}`,this.ctx.c.starter):this.doc.source;if(this.editor.setValue(typeof t==="string"?t:""),this.view.scene.mode=this.mode,this.view.scene.target=this.ctx.kind==="challenge"?ae(this.ctx.c):null,this.reset(),this.paintTask(),this.paintNotice(),e)this.runInstant(),this.view.fit();this.say(this.error?"":"Gotowy.","info",!!this.error),this.paint()}activate(){if(this.view.resize(),this.state==="idle"&&!this.frozen.length&&!this.error)this.runInstant(),this.say(this.error?"":"Gotowy.","info",!!this.error);this.view.fit(),this.paint()}setMode(e){if(e===this.mode)return;this.halt(),this.mode=e,I("tryb",e),this.show(!0)}isDirty(e){let t=this.docs[e];return t.source.trim()!==""&&t.source!==t.origin}async loadProgram(e,t,o,n){let i=this.docs[t];if(this.isDirty(t)&&i.source!==e){if(!await this.host.confirm(`Zastąpić szkic ${t.toUpperCase()}?`,`W szkicu ${t.toUpperCase()} jest program, którego nie ma w żadnym pliku. Jeśli wczytasz ${n}, szkic trafi do kopii i będzie można go przywrócić.`,"Wczytaj i zachowaj kopię","Zostaw mój szkic"))return!1;I(`kopia:${t}`,{...i,loaded:o})}if(this.docs[t]={source:e,origin:e,name:o},I(`szkic:${t}`,this.docs[t]),I("tryb",t),this.ctx.kind!=="free")this.host.goFree();return this.ctx={kind:"free"},this.halt(),this.mode=t,this.show(!0),!0}openDirect(e,t){this.ctx={kind:"free"},this.halt(),this.mode=t,I("tryb",t),this.docs[t].source=e,this.docs[t].name=K[t].name,I(`szkic:${t}`,this.docs[t]),this.show(!1),this.view.resize();let o=this.runInstant();return this.view.fit(),this.say(this.error?"":this.doneText(),"info",!!this.error),this.paint(),this.view.drawNow(),o}restoreBackup(){let e=D(`kopia:${this.mode}`,null);if(!e)return;this.docs[this.mode]={source:e.source,origin:e.origin,name:e.name},I(`szkic:${this.mode}`,this.doc),Le(`kopia:${this.mode}`),this.show(!0),this.say("Przywrócono poprzedni szkic."),this.editor.ta.focus()}halt(){if(cancelAnimationFrame(this.raf),this.raf=0,this.machine)this.frozen=ue(this.machine.segments),this.turtle=this.snapshot(this.machine.turtle),this.ops=this.machine.ops,this.machine=null;this.editor.setExecLine(null)}snapshot(e){return{...e,pos:[...e.pos],h:[...e.h],r:[...e.r],u:[...e.u]}}reset(){this.halt(),this.frozen=[],this.turtle=Ue(),this.ops=0,this.state="idle",this.error=null,this.editor.setError(null),this.paint()}prepare(){this.halt(),clearTimeout(this.lintTimer),this.frozen=[],this.turtle=Ue(),this.ops=0,this.error=null;try{this.machine=new he(pe(this.editor.value,this.mode))}catch(e){if(!(e instanceof h))throw e;return this.error=J(e),this.state="error",this.editor.setError(this.error),this.sayError("Program nie został uruchomiony"),this.paint(),!1}return this.editor.setError(null),!0}prefit(){if(!this.view.auto)return;let e=B(this.editor.value,this.mode).segments,t=this.view.scene,o=t.segments;t.segments=e,t.turtle=null,this.view.fit(!0),t.segments=o}runProgram(){if(this.state==="paused"&&this.machine){this.state="running",this.say("Rysuję dalej."),this.loop(),this.paint();return}if(!this.prepare())return;if(Ve[this.speed-1]===1/0){if(this.machine.runAll(),this.finish(),this.view.auto)this.view.fit(!0);return}this.prefit(),this.state="running",this.say("Rysuję."),this.loop(),this.paint()}runInstant(){if(!this.prepare())return{segments:[],error:this.error};let e=this.machine;e.runAll();let t={segments:ue(e.segments),error:e.error?J(e.error):null};return this.finish(!0),t}loop(){cancelAnimationFrame(this.raf),this.last=0,this.budget=1;let e=(t)=>{let o=this.machine;if(!o||this.state!=="running")return;let n=Ve[this.speed-1],i=this.last?Math.min(250,t-this.last):0;this.last=t,this.budget=n===1/0?1/0:this.budget+i/1000*n;let s=performance.now()+10,r=0;while(this.budget>=1&&!o.done){let l=o.step();if(this.budget-=1,l)r=l.line;if(performance.now()>s){this.budget=Math.min(this.budget,1);break}}if(r)this.editor.setExecLine(r,n<=20);if(o.done){this.finish();return}this.paint(),this.raf=requestAnimationFrame(e)};this.raf=requestAnimationFrame(e)}pause(){cancelAnimationFrame(this.raf),this.state="paused",this.say("Pauza. Wznów program albo wykonuj go krok po kroku."),this.paint(),this.$('[data-act="run"]').focus({preventScroll:!0})}stepOnce(){if(this.state==="running")cancelAnimationFrame(this.raf);if(!this.machine||this.state==="idle"||this.state==="done"||this.state==="error"){if(!this.prepare())return;this.prefit()}let e=this.machine;this.state="paused";let t=e.step();if(e.done){this.finish();return}if(t)this.editor.setExecLine(t.line,!0),this.say(`Krok: wiersz ${t.line}, kolumna ${t.column}. Operacja ${e.ops} z ${Y(j.ops)}.`);this.paint()}doneText(){let e=this.frozen.length;return`Gotowe: ${Y(e)} ${ze(e,"odcinek","odcinki","odcinków")}, ${Y(this.ops)} ${ze(this.ops,"operacja","operacje","operacji")}.`}finish(e=!1){let o=this.machine.error;if(this.halt(),o)this.error=J(o),this.state="error",this.editor.setError(this.error),this.sayError("Program zatrzymany");else if(this.state="done",!e)this.say(this.doneText());this.paint()}check(){if(this.ctx.kind!=="challenge")return;let e=this.ctx.c,t=this.runInstant();this.view.fit();let o=this.$(".task-result"),n=!1,i;if(t.error)i=`Program zatrzymał się na błędzie w wierszu ${t.error.line}, więc nie da się go porównać ze wzorem. Popraw błąd i sprawdź ponownie.`,this.sayError("Program zatrzymany");else{let l=Te(t.segments,ae(e));n=l.pass,i=l.reason,this.say(this.doneText())}if(n&&!this.solved.includes(e.id))this.solved.push(e.id),I("zaliczone",this.solved);let s=O.indexOf(e),r=O[s+1];o.className=`task-result ${n?"is-pass":"is-fail"}`,o.innerHTML=n?`${P.check}<p><strong>Zaliczone.</strong> ${U(i)} ${r?`<a href="#/zadania/${r.id}">Następne zadanie: ${U(r.title)}</a>`:'<a href="#/zadania">Wróć do listy zadań</a>'}</p>`:`${P.cross}<p><strong>Jeszcze nie.</strong> ${U(i)}</p>`,this.paintTaskState()}async exportPng(){let e=await this.view.toPNG();if(!e){this.say("Nie udało się zapisać obrazu PNG w tej przeglądarce.","warn");return}let t=`${He(this.docName(!1))}-${this.mode}.png`;Oe(e,t),this.say(`Zapisano obraz ${t}.`)}say(e,t="info",o=!1){if(o)return;let n=this.$("#status");n.className=`status${t==="warn"?" is-warn":""}`,n.textContent=e}sayError(e){let t=this.error,o=this.$("#status");o.className="status is-error",o.innerHTML=`<button type="button" class="status-pos" data-act="goto-error" title="Przejdź do miejsca błędu">Wiersz ${t.line}, kolumna ${t.column}</button><span><strong>${e}.</strong> ${U(t.message)}</span>`}paintSpeed(){let e=Ve[this.speed-1],t=e===1/0?"od razu":`${e} ${ze(e,"krok","kroki","kroków")}/s`;this.$("#speed-out").textContent=t,this.$("#speed").setAttribute("aria-valuetext",e===1/0?"bez animacji":`${e} kroków na sekundę`)}paintTask(){let e=this.$(".task");if(this.ctx.kind!=="challenge"){e.hidden=!0,e.innerHTML="";return}let t=this.ctx.c,o=O.indexOf(t);e.hidden=!1,e.innerHTML=`
      <p class="task-meta"><a href="#/zadania">Zadania</a><span aria-hidden="true">/</span><span>${o+1} z ${O.length}</span><span class="tag">${t.mode.toUpperCase()}</span><span class="task-state"></span></p>
      <h2 id="task-title">${U(t.title)}</h2>
      <p class="task-text">${U(t.task)} Wzór jest na arkuszu, narysowany linią przerywaną.</p>
      <details class="task-hint"><summary>Podpowiedź</summary><p>${U(t.hint)}</p></details>
      <div class="task-actions">
        <button class="btn btn-check" type="button" data-act="check">${P.check}<span>Sprawdź rysunek</span></button>
        <button class="btn btn-quiet" type="button" data-act="starter">${P.undo}<span>Od nowa</span></button>
      </div>
      <div class="task-result" role="status" aria-live="polite"></div>`,this.paintTaskState()}paintTaskState(){if(this.ctx.kind!=="challenge")return;let e=this.solved.includes(this.ctx.c.id),t=this.$(".task-state");t.innerHTML=e?`${P.check}zaliczone`:""}paintNotice(){let e=this.$(".notice"),t=this.ctx.kind==="free"?D(`kopia:${this.mode}`,null):null;if(!t){e.hidden=!0,e.innerHTML="";return}e.hidden=!1,e.innerHTML=`<p>Poprzedni szkic ${this.mode.toUpperCase()} (${U(t.name)}) jest w kopii.</p>
      <button class="btn btn-small" type="button" data-act="restore">${P.undo}<span>Przywróć szkic</span></button>
      <button class="btn btn-small btn-quiet" type="button" data-act="drop-backup">Usuń kopię</button>`}paintBlock(){let e=this.machine?this.machine.turtle:this.turtle,t=this.machine?this.machine.segments.length:this.frozen.length,o=this.machine?this.machine.ops:this.ops,n=(i,s)=>{let r=this.$(i);if(r.textContent!==s)r.textContent=s};if(n("#tb-name",this.docName()),this.mode==="2d")n("#tb-pos",`x ${Q(e.pos[0])}  y ${Q(e.pos[1])}`),n("#tb-head",$t(Math.atan2(e.h[0],e.h[1])));else{n("#tb-pos",`x ${Q(e.pos[0])}  y ${Q(e.pos[1])}  z ${Q(e.pos[2])}`);let i=Math.hypot(e.h[0],e.h[1]),s=Math.round(Math.atan2(e.h[2],i)*1800/Math.PI)/10;n("#tb-head",`${i<0.000000001?"0°":$t(Math.atan2(e.h[0],e.h[1]))}  nos ${Q(s)}°`)}n("#tb-seg",`${Y(t)} / ${Y(j.segments)}`),n("#tb-ops",`${Y(o)} / ${Y(j.ops)}`),n("#tb-pen",e.pen?`opuszczony, ${e.color}, ${e.width}`:"podniesiony"),n("#tb-scale",this.view.scaleLabel())}paint(){let e=this.machine,t=this.view.scene;t.mode=this.mode,t.segments=e?e.segments:this.frozen,t.turtle=e?e.turtle:this.turtle,this.view.invalidate(),this.paintBlock(),this.el.dataset.state=this.state,this.el.dataset.mode=this.mode,this.el.dataset.ctx=this.ctx.kind,this.$("#docname").textContent=this.docName();let o=this.$('[data-act="run"]');o.querySelector(".lbl").textContent=this.state==="paused"?"Wznów":"Uruchom",o.setAttribute("aria-disabled",String(this.state==="running")),this.$('[data-act="pause"]').setAttribute("aria-disabled",String(this.state!=="running"));for(let i of this.el.querySelectorAll('input[name="mode"]'))i.checked=i.value===this.mode,i.disabled=this.ctx.kind==="challenge"&&i.value!==this.mode;this.$('[data-act="camera"]').hidden=this.mode!=="3d";let n=t.segments.length;this.$("canvas").setAttribute("aria-label",`Arkusz ${this.mode.toUpperCase()}: ${n} ${ze(n,"odcinek","odcinki","odcinków")}${t.target?", wzór zadania linią przerywaną":""}`),this.paintSpeed()}}var Mt=window.matchMedia("(prefers-color-scheme: dark)"),St=()=>Mt.matches?"dark":"light",Xt=[["#/","Pracownia"],["#/przyklady","Przykłady"],["#/zadania","Zadania"],["#/polecenia","Polecenia"]];document.body.innerHTML=`
  <a class="skip" href="#main">Przejdź do treści</a>
  <header class="top">
    <a class="brand" href="#/" aria-label="Logomocja, pracownia">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M12 2.5 20 20l-8-4.5L4 20z" fill="currentColor"/></svg>
      <span>Logomocja</span>
    </a>
    <nav class="nav" aria-label="Główna">
      ${Xt.map(([e,t])=>`<a href="${e}">${t}</a>`).join("")}
    </nav>
    <button class="top-btn" id="theme" type="button">${P.theme}<span class="vh"></span></button>
  </header>
  <main id="main" tabindex="-1">
    <div id="studio" class="studio"></div>
    <div id="page" hidden></div>
  </main>
  <dialog class="dlg" id="confirm" aria-labelledby="confirm-title" aria-describedby="confirm-body">
    <form method="dialog">
      <h2 id="confirm-title"></h2>
      <p id="confirm-body"></p>
      <div class="dlg-actions">
        <button class="btn" value="no" id="confirm-no"></button>
        <button class="btn btn-primary" value="yes" id="confirm-yes"></button>
      </div>
    </form>
  </dialog>
  <dialog class="dlg" id="link" aria-labelledby="link-title">
    <form method="dialog">
      <h2 id="link-title">Link do programu</h2>
      <p>Ten adres zawiera cały program i tryb rysowania. Kto go otworzy, zobaczy gotowy rysunek. Nic nie jest wysyłane na żaden serwer.</p>
      <label class="field"><span>Adres</span><input id="link-url" type="text" readonly spellcheck="false"></label>
      <p class="dlg-note" id="link-note" role="status"></p>
      <div class="dlg-actions">
        <button class="btn" value="close">Zamknij</button>
        <button class="btn btn-primary" type="button" id="link-copy">${P.link}<span>Kopiuj adres</span></button>
      </div>
    </form>
  </dialog>`;var E=(e)=>document.querySelector(e),Fe=E("#studio"),ne=E("#page");function qe(){let e=D("motyw","auto"),t=e==="dark"||e==="light"?e:St();document.documentElement.dataset.theme=t;let o=E("#theme"),n=t==="dark"?"Włącz jasny motyw":"Włącz ciemny motyw";o.querySelector(".vh").textContent=n,o.title=`${n}${e==="auto"?" (teraz: jak w systemie)":""}`,document.querySelector('meta[name="theme-color"]')?.setAttribute("content",getComputedStyle(document.documentElement).getPropertyValue("--shell").trim()),A?.themeChanged()}function Pt(e,t,o,n){let i=E("#confirm");return E("#confirm-title").textContent=e,E("#confirm-body").textContent=t,E("#confirm-yes").textContent=o,E("#confirm-no").textContent=n,i.returnValue="no",i.showModal(),E("#confirm-no").focus(),new Promise((s)=>{i.addEventListener("close",()=>s(i.returnValue==="yes"),{once:!0})})}function Yt(e){let t=E("#link"),o=E("#link-url");o.value=e,E("#link-note").textContent=e.length>8000?"Ten adres jest bardzo długi. Niektóre komunikatory mogą go uciąć: w razie kłopotów pobierz plik .logo.":"",t.showModal(),o.focus(),o.select()}E("#link-copy").addEventListener("click",async()=>{let e=E("#link-url"),t=!1;try{await navigator.clipboard.writeText(e.value),t=!0}catch{e.focus(),e.select();try{t=document.execCommand("copy")}catch{t=!1}}E("#link-note").textContent=t?"Skopiowano adres do schowka.":"Nie udało się skopiować. Zaznacz adres i skopiuj go ręcznie."});var A=new Ke(Fe,{confirm:Pt,showLink:Yt,goFree:()=>{if(location.hash!=="#/"&&location.hash!=="")history.replaceState(null,"","#/")}});E("#theme").addEventListener("click",()=>{let e=document.documentElement.dataset.theme==="dark"?"light":"dark";I("motyw",e===St()?"auto":e),qe()});Mt.addEventListener("change",qe);qe();function ye(e){ne.hidden=!0,ne.innerHTML="",Fe.hidden=!1,document.title=e,A.activate()}function Qt(e,t){Fe.hidden=!0,ne.innerHTML=e,ne.hidden=!1,document.title=t}function ee(e){for(let t of document.querySelectorAll(".nav a"))if(t.getAttribute("href")===e)t.setAttribute("aria-current","page");else t.removeAttribute("aria-current")}var xt=!0;async function Tt(){let e=location.hash.replace(/^#/,"")||"/",[t,o=""]=e.split("?"),n=t.split("/").filter(Boolean),i=!xt;xt=!1;let[s,r]=n;if(!s){ee("#/");let d=new URLSearchParams(o),m=d.get("kod");if(m){let p=d.get("tryb")==="3d"?"3d":"2d";history.replaceState(null,"","#/");let a=null;try{a=await vt(m)}catch{a=null}if(A.ctx.kind!=="free")A.setContext({kind:"free"});if(ye("Logomocja: pracownia"),a===null)await Pt("Link jest uszkodzony","Nie udało się odczytać programu z tego adresu. Być może został ucięty przy kopiowaniu. Twój szkic pozostał bez zmian.","Rozumiem","Zamknij");else await A.loadProgram(a,p,"Program z linku","program z linku"),A.activate();return}if(A.ctx.kind!=="free")A.setContext({kind:"free"});if(ye("Logomocja: pracownia"),i)E("#main").focus({preventScroll:!0});return}if(s==="zadania"&&r){let d=at(r);if(d){if(ee("#/zadania"),A.ctx.kind!=="challenge"||A.ctx.c!==d)A.setContext({kind:"challenge",c:d});if(ye(`${d.title}: zadanie w Logomocji`),i)E("#task-title")?.focus?.();return}}let l,c;if(s==="przyklady"&&!r)l=wt(),c="Przykłady: Logomocja",ee("#/przyklady");else if(s==="zadania"&&!r)l=kt(),c="Zadania: Logomocja",ee("#/zadania");else if(s==="polecenia")l=zt(),c="Polecenia: Logomocja",ee("#/polecenia");else l=ft(),c="Nie ma takiej strony: Logomocja",ee("");if(Qt(l,c),window.scrollTo(0,0),s==="polecenia"&&r)Et(r,!1);else if(i)ne.querySelector("h1")?.focus({preventScroll:!0})}function Et(e,t){let o=document.getElementById("h-"+e);if(!o)return;let n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;o.scrollIntoView({behavior:t&&!n?"smooth":"auto",block:"start"}),o.focus({preventScroll:!0})}ne.addEventListener("click",async(e)=>{let t=e.target,o=t.closest("[data-example]");if(o){let s=ct(o.dataset.example);if(await A.loadProgram(s.source,s.mode,s.name,`przykład ${s.name}`))location.hash="#/";return}let n=t.closest("[data-try]");if(n){let s=n.dataset.mode;if(await A.loadProgram(n.dataset.try,s,"Przykład z opisu poleceń","ten przykład"))location.hash="#/";return}let i=t.closest("[data-jump]");if(i)e.preventDefault(),history.replaceState(null,"",`#/polecenia/${i.dataset.jump}`),Et(i.dataset.jump,!0)});window.addEventListener("hashchange",Tt);var eo=Tt(),to=()=>new Promise((e)=>{let t=!1,o=()=>{if(!t)t=!0,e()};requestAnimationFrame(()=>requestAnimationFrame(o)),setTimeout(o,250)}),oo={version:"1.0.0",run(e,t){return B(String(e),t==="3d"?"3d":"2d")},async open(e,t){await eo;let o=t==="3d"?"3d":"2d";for(let i of document.querySelectorAll("dialog[open]"))i.close();if(location.hash!=="#/"&&location.hash!=="")history.replaceState(null,"","#/");ee("#/"),ye("Logomocja: pracownia");let n=A.openDirect(String(e),o);return await document.fonts?.ready,await to(),n}};window.logomocja=oo;})();
