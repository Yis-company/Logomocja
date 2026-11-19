var NE=Object.defineProperty;var zE=(o,e,i)=>e in o?NE(o,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):o[e]=i;var _n=(o,e,i)=>zE(o,typeof e!="symbol"?e+"":e,i);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const h of u.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(l){if(l.ep)return;l.ep=!0;const u=i(l);fetch(l.href,u)}})();function cx(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var Ad={exports:{}},pl={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Nv;function UE(){if(Nv)return pl;Nv=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(r,l,u){var h=null;if(u!==void 0&&(h=""+u),l.key!==void 0&&(h=""+l.key),"key"in l){u={};for(var d in l)d!=="key"&&(u[d]=l[d])}else u=l;return l=u.ref,{$$typeof:o,type:r,key:h,ref:l!==void 0?l:null,props:u}}return pl.Fragment=e,pl.jsx=i,pl.jsxs=i,pl}var zv;function LE(){return zv||(zv=1,Ad.exports=UE()),Ad.exports}var D=LE(),Rd={exports:{}},ue={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Uv;function OE(){if(Uv)return ue;Uv=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),h=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),m=Symbol.for("react.activity"),y=Symbol.for("react.view_transition"),x=Symbol.iterator;function b(R){return R===null||typeof R!="object"?null:(R=x&&R[x]||R["@@iterator"],typeof R=="function"?R:null)}var T={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,S={};function G(R,Y,pt){this.props=R,this.context=Y,this.refs=S,this.updater=pt||T}G.prototype.isReactComponent={},G.prototype.setState=function(R,Y){if(typeof R!="object"&&typeof R!="function"&&R!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,R,Y,"setState")},G.prototype.forceUpdate=function(R){this.updater.enqueueForceUpdate(this,R,"forceUpdate")};function I(){}I.prototype=G.prototype;function z(R,Y,pt){this.props=R,this.context=Y,this.refs=S,this.updater=pt||T}var F=z.prototype=new I;F.constructor=z,M(F,G.prototype),F.isPureReactComponent=!0;var P=Array.isArray;function L(){}var V={H:null,A:null,T:null,S:null},C=Object.prototype.hasOwnProperty;function E(R,Y,pt){var ht=pt.ref;return{$$typeof:o,type:R,key:Y,ref:ht!==void 0?ht:null,props:pt}}function k(R,Y){return E(R.type,Y,R.props)}function et(R){return typeof R=="object"&&R!==null&&R.$$typeof===o}function tt(R){var Y={"=":"=0",":":"=2"};return"$"+R.replace(/[=:]/g,function(pt){return Y[pt]})}var ut=/\/+/g;function ft(R,Y){return typeof R=="object"&&R!==null&&R.key!=null?tt(""+R.key):Y.toString(36)}function X(R){switch(R.status){case"fulfilled":return R.value;case"rejected":throw R.reason;default:switch(typeof R.status=="string"?R.then(L,L):(R.status="pending",R.then(function(Y){R.status==="pending"&&(R.status="fulfilled",R.value=Y)},function(Y){R.status==="pending"&&(R.status="rejected",R.reason=Y)})),R.status){case"fulfilled":return R.value;case"rejected":throw R.reason}}throw R}function it(R,Y,pt,ht,Ct){var Ut=typeof R;(Ut==="undefined"||Ut==="boolean")&&(R=null);var bt=!1;if(R===null)bt=!0;else switch(Ut){case"bigint":case"string":case"number":bt=!0;break;case"object":switch(R.$$typeof){case o:case e:bt=!0;break;case _:return bt=R._init,it(bt(R._payload),Y,pt,ht,Ct)}}if(bt)return Ct=Ct(R),bt=ht===""?"."+ft(R,0):ht,P(Ct)?(pt="",bt!=null&&(pt=bt.replace(ut,"$&/")+"/"),it(Ct,Y,pt,"",function(se){return se})):Ct!=null&&(et(Ct)&&(Ct=k(Ct,pt+(Ct.key==null||R&&R.key===Ct.key?"":(""+Ct.key).replace(ut,"$&/")+"/")+bt)),Y.push(Ct)),1;bt=0;var Dt=ht===""?".":ht+":";if(P(R))for(var zt=0;zt<R.length;zt++)ht=R[zt],Ut=Dt+ft(ht,zt),bt+=it(ht,Y,pt,Ut,Ct);else if(zt=b(R),typeof zt=="function")for(R=zt.call(R),zt=0;!(ht=R.next()).done;)ht=ht.value,Ut=Dt+ft(ht,zt++),bt+=it(ht,Y,pt,Ut,Ct);else if(Ut==="object"){if(typeof R.then=="function")return it(X(R),Y,pt,ht,Ct);throw Y=String(R),Error("Objects are not valid as a React child (found: "+(Y==="[object Object]"?"object with keys {"+Object.keys(R).join(", ")+"}":Y)+"). If you meant to render a collection of children, use an array instead.")}return bt}function W(R,Y,pt){if(R==null)return R;var ht=[],Ct=0;return it(R,ht,"","",function(Ut){return Y.call(pt,Ut,Ct++)}),ht}function mt(R){if(R._status===-1){var Y=R._result,pt=Y();pt.then(function(ht){(R._status===0||R._status===-1)&&(R._status=1,R._result=ht,pt.status===void 0&&(pt.status="fulfilled",pt.value=ht))},function(ht){(R._status===0||R._status===-1)&&(R._status=2,R._result=ht,pt.status===void 0&&(pt.status="rejected",pt.reason=ht))}),R._status===-1&&(R._status=0,R._result=pt)}if(R._status===1)return R._result.default;throw R._result}var vt=typeof reportError=="function"?reportError:function(R){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var Y=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof R=="object"&&R!==null&&typeof R.message=="string"?String(R.message):String(R),error:R});if(!window.dispatchEvent(Y))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",R);return}console.error(R)};function At(R){var Y=V.T,pt={};pt.types=Y!==null?Y.types:null,V.T=pt;try{var ht=R(),Ct=V.S;Ct!==null&&Ct(pt,ht),typeof ht=="object"&&ht!==null&&typeof ht.then=="function"&&ht.then(L,vt)}catch(Ut){vt(Ut)}finally{Y!==null&&pt.types!==null&&(Y.types=pt.types),V.T=Y}}function Xt(R){var Y=V.T;if(Y!==null){var pt=Y.types;pt===null?Y.types=[R]:pt.indexOf(R)===-1&&pt.push(R)}else At(Xt.bind(null,R))}var he={map:W,forEach:function(R,Y,pt){W(R,function(){Y.apply(this,arguments)},pt)},count:function(R){var Y=0;return W(R,function(){Y++}),Y},toArray:function(R){return W(R,function(Y){return Y})||[]},only:function(R){if(!et(R))throw Error("React.Children.only expected to receive a single React element child.");return R}};return ue.Activity=m,ue.Children=he,ue.Component=G,ue.Fragment=i,ue.Profiler=l,ue.PureComponent=z,ue.StrictMode=r,ue.Suspense=p,ue.ViewTransition=y,ue.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=V,ue.__COMPILER_RUNTIME={__proto__:null,c:function(R){return V.H.useMemoCache(R)}},ue.addTransitionType=Xt,ue.cache=function(R){return function(){return R.apply(null,arguments)}},ue.cacheSignal=function(){return null},ue.cloneElement=function(R,Y,pt){if(R==null)throw Error("The argument must be a React element, but you passed "+R+".");var ht=M({},R.props),Ct=R.key;if(Y!=null)for(Ut in Y.key!==void 0&&(Ct=""+Y.key),Y)!C.call(Y,Ut)||Ut==="key"||Ut==="__self"||Ut==="__source"||Ut==="ref"&&Y.ref===void 0||(ht[Ut]=Y[Ut]);var Ut=arguments.length-2;if(Ut===1)ht.children=pt;else if(1<Ut){for(var bt=Array(Ut),Dt=0;Dt<Ut;Dt++)bt[Dt]=arguments[Dt+2];ht.children=bt}return E(R.type,Ct,ht)},ue.createContext=function(R){return R={$$typeof:h,_currentValue:R,_currentValue2:R,_threadCount:0,Provider:null,Consumer:null},R.Provider=R,R.Consumer={$$typeof:u,_context:R},R},ue.createElement=function(R,Y,pt){var ht,Ct={},Ut=null;if(Y!=null)for(ht in Y.key!==void 0&&(Ut=""+Y.key),Y)C.call(Y,ht)&&ht!=="key"&&ht!=="__self"&&ht!=="__source"&&(Ct[ht]=Y[ht]);var bt=arguments.length-2;if(bt===1)Ct.children=pt;else if(1<bt){for(var Dt=Array(bt),zt=0;zt<bt;zt++)Dt[zt]=arguments[zt+2];Ct.children=Dt}if(R&&R.defaultProps)for(ht in bt=R.defaultProps,bt)Ct[ht]===void 0&&(Ct[ht]=bt[ht]);return E(R,Ut,Ct)},ue.createRef=function(){return{current:null}},ue.forwardRef=function(R){return{$$typeof:d,render:R}},ue.isValidElement=et,ue.lazy=function(R){return{$$typeof:_,_payload:{_status:-1,_result:R},_init:mt}},ue.memo=function(R,Y){return{$$typeof:g,type:R,compare:Y===void 0?null:Y}},ue.startTransition=At,ue.unstable_useCacheRefresh=function(){return V.H.useCacheRefresh()},ue.use=function(R){return V.H.use(R)},ue.useActionState=function(R,Y,pt){return V.H.useActionState(R,Y,pt)},ue.useCallback=function(R,Y){return V.H.useCallback(R,Y)},ue.useContext=function(R){return V.H.useContext(R)},ue.useDebugValue=function(){},ue.useDeferredValue=function(R,Y){return V.H.useDeferredValue(R,Y)},ue.useEffect=function(R,Y){return V.H.useEffect(R,Y)},ue.useEffectEvent=function(R){return V.H.useEffectEvent(R)},ue.useId=function(){return V.H.useId()},ue.useImperativeHandle=function(R,Y,pt){return V.H.useImperativeHandle(R,Y,pt)},ue.useInsertionEffect=function(R,Y){return V.H.useInsertionEffect(R,Y)},ue.useLayoutEffect=function(R,Y){return V.H.useLayoutEffect(R,Y)},ue.useMemo=function(R,Y){return V.H.useMemo(R,Y)},ue.useOptimistic=function(R,Y){return V.H.useOptimistic(R,Y)},ue.useReducer=function(R,Y,pt){return V.H.useReducer(R,Y,pt)},ue.useRef=function(R){return V.H.useRef(R)},ue.useState=function(R){return V.H.useState(R)},ue.useSyncExternalStore=function(R,Y,pt){return V.H.useSyncExternalStore(R,Y,pt)},ue.useTransition=function(){return V.H.useTransition()},ue.version="19.3.1",ue}var Lv;function om(){return Lv||(Lv=1,Rd.exports=OE()),Rd.exports}var Et=om();const _p=cx(Et);var Cd={exports:{}},ml={},Dd={exports:{}},Nd={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ov;function PE(){return Ov||(Ov=1,(function(o){function e(X,it){var W=X.length;X.push(it);t:for(;0<W;){var mt=W-1>>>1,vt=X[mt];if(0<l(vt,it))X[mt]=it,X[W]=vt,W=mt;else break t}}function i(X){return X.length===0?null:X[0]}function r(X){if(X.length===0)return null;var it=X[0],W=X.pop();if(W!==it){X[0]=W;t:for(var mt=0,vt=X.length,At=vt>>>1;mt<At;){var Xt=2*(mt+1)-1,he=X[Xt],R=Xt+1,Y=X[R];if(0>l(he,W))R<vt&&0>l(Y,he)?(X[mt]=Y,X[R]=W,mt=R):(X[mt]=he,X[Xt]=W,mt=Xt);else if(R<vt&&0>l(Y,W))X[mt]=Y,X[R]=W,mt=R;else break t}}return it}function l(X,it){var W=X.sortIndex-it.sortIndex;return W!==0?W:X.id-it.id}if(o.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;o.unstable_now=function(){return u.now()}}else{var h=Date,d=h.now();o.unstable_now=function(){return h.now()-d}}var p=[],g=[],_=1,m=null,y=3,x=!1,b=!1,T=!1,M=!1,S=typeof setTimeout=="function"?setTimeout:null,G=typeof clearTimeout=="function"?clearTimeout:null,I=typeof setImmediate<"u"?setImmediate:null;function z(X){for(var it=i(g);it!==null;){if(it.callback===null)r(g);else if(it.startTime<=X)r(g),it.sortIndex=it.expirationTime,e(p,it);else break;it=i(g)}}function F(X){if(T=!1,z(X),!b)if(i(p)!==null)b=!0,P||(P=!0,et());else{var it=i(g);it!==null&&ft(F,it.startTime-X)}}var P=!1,L=-1,V=5,C=-1;function E(){return M?!0:!(o.unstable_now()-C<V)}function k(){if(M=!1,P){var X=o.unstable_now();C=X;var it=!0;try{t:{b=!1,T&&(T=!1,G(L),L=-1),x=!0;var W=y;try{e:{for(z(X),m=i(p);m!==null&&!(m.expirationTime>X&&E());){var mt=m.callback;if(typeof mt=="function"){m.callback=null,y=m.priorityLevel;var vt=mt(m.expirationTime<=X);if(X=o.unstable_now(),typeof vt=="function"){m.callback=vt,z(X),it=!0;break e}m===i(p)&&r(p),z(X)}else r(p);m=i(p)}if(m!==null)it=!0;else{var At=i(g);At!==null&&ft(F,At.startTime-X),it=!1}}break t}finally{m=null,y=W,x=!1}it=void 0}}finally{it?et():P=!1}}}var et;if(typeof I=="function")et=function(){I(k)};else if(typeof MessageChannel<"u"){var tt=new MessageChannel,ut=tt.port2;tt.port1.onmessage=k,et=function(){ut.postMessage(null)}}else et=function(){S(k,0)};function ft(X,it){L=S(function(){X(o.unstable_now())},it)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(X){X.callback=null},o.unstable_forceFrameRate=function(X){0>X||125<X?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):V=0<X?Math.floor(1e3/X):5},o.unstable_getCurrentPriorityLevel=function(){return y},o.unstable_next=function(X){switch(y){case 1:case 2:case 3:var it=3;break;default:it=y}var W=y;y=it;try{return X()}finally{y=W}},o.unstable_requestPaint=function(){M=!0},o.unstable_runWithPriority=function(X,it){switch(X){case 1:case 2:case 3:case 4:case 5:break;default:X=3}var W=y;y=X;try{return it()}finally{y=W}},o.unstable_scheduleCallback=function(X,it,W){var mt=o.unstable_now();switch(typeof W=="object"&&W!==null?(W=W.delay,W=typeof W=="number"&&0<W?mt+W:mt):W=mt,X){case 1:var vt=-1;break;case 2:vt=250;break;case 5:vt=1073741823;break;case 4:vt=1e4;break;default:vt=5e3}return vt=W+vt,X={id:_++,callback:it,priorityLevel:X,startTime:W,expirationTime:vt,sortIndex:-1},W>mt?(X.sortIndex=W,e(g,X),i(p)===null&&X===i(g)&&(T?(G(L),L=-1):T=!0,ft(F,W-mt))):(X.sortIndex=vt,e(p,X),b||x||(b=!0,P||(P=!0,et()))),X},o.unstable_shouldYield=E,o.unstable_wrapCallback=function(X){var it=y;return function(){var W=y;y=it;try{return X.apply(this,arguments)}finally{y=W}}}})(Nd)),Nd}var Pv;function IE(){return Pv||(Pv=1,Dd.exports=PE()),Dd.exports}var zd={exports:{}},On={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Iv;function BE(){if(Iv)return On;Iv=1;var o=om();function e(_){var m="https://react.dev/errors/"+_;if(1<arguments.length){m+="?args[]="+encodeURIComponent(arguments[1]);for(var y=2;y<arguments.length;y++)m+="&args[]="+encodeURIComponent(arguments[y])}return"Minified React error #"+_+"; visit "+m+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var r={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal"),u=Symbol.for("react.recoverable"),h=Symbol.for("react.optimistic_key");function d(_,m,y){var x=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:x==null?null:x===h?h:""+x,children:_,containerInfo:m,implementation:y}}var p=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function g(_,m){if(_==="font")return"";if(typeof m=="string")return m==="use-credentials"?m:""}return On.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,On.browser=function(_){return{$$typeof:u,_reason:_}},On.createPortal=function(_,m){var y=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!m||m.nodeType!==1&&m.nodeType!==9&&m.nodeType!==11)throw Error(e(299));return d(_,m,null,y)},On.flushSync=function(_){var m=p.T,y=r.p;try{if(p.T=null,r.p=2,_)return _()}finally{p.T=m,r.p=y,r.d.f()}},On.preconnect=function(_,m){typeof _=="string"&&(m?(m=m.crossOrigin,m=typeof m=="string"?m==="use-credentials"?m:"":void 0):m=null,r.d.C(_,m))},On.prefetchDNS=function(_){typeof _=="string"&&r.d.D(_)},On.preinit=function(_,m){if(typeof _=="string"&&m&&typeof m.as=="string"){var y=m.as,x=g(y,m.crossOrigin),b=typeof m.integrity=="string"?m.integrity:void 0,T=typeof m.fetchPriority=="string"?m.fetchPriority:void 0;y==="style"?r.d.S(_,typeof m.precedence=="string"?m.precedence:void 0,{crossOrigin:x,integrity:b,fetchPriority:T}):y==="script"&&r.d.X(_,{crossOrigin:x,integrity:b,fetchPriority:T,nonce:typeof m.nonce=="string"?m.nonce:void 0})}},On.preinitModule=function(_,m){if(typeof _=="string")if(typeof m=="object"&&m!==null){if(m.as==null||m.as==="script"){var y=g(m.as,m.crossOrigin);r.d.M(_,{crossOrigin:y,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0})}}else m==null&&r.d.M(_)},On.preload=function(_,m){if(typeof _=="string"&&typeof m=="object"&&m!==null&&typeof m.as=="string"){var y=m.as,x=g(y,m.crossOrigin);r.d.L(_,y,{crossOrigin:x,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,type:typeof m.type=="string"?m.type:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0,referrerPolicy:typeof m.referrerPolicy=="string"?m.referrerPolicy:void 0,imageSrcSet:typeof m.imageSrcSet=="string"?m.imageSrcSet:void 0,imageSizes:typeof m.imageSizes=="string"?m.imageSizes:void 0,media:typeof m.media=="string"?m.media:void 0})}},On.preloadModule=function(_,m){if(typeof _=="string")if(m){var y=g(m.as,m.crossOrigin);r.d.m(_,{as:typeof m.as=="string"&&m.as!=="script"?m.as:void 0,crossOrigin:y,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0})}else r.d.m(_)},On.requestFormReset=function(_){r.d.r(_)},On.unstable_batchedUpdates=function(_,m){return _(m)},On.useFormState=function(_,m,y){return p.H.useFormState(_,m,y)},On.useFormStatus=function(){return p.H.useHostTransitionStatus()},On.version="19.3.1",On}var Bv;function FE(){if(Bv)return zd.exports;Bv=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),zd.exports=BE(),zd.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fv;function kE(){if(Fv)return ml;Fv=1;var o=IE(),e=om(),i=FE();function r(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function u(t){for(var n=t,a=n;a&&!a.alternate;)n=a,(n.flags&4098)!==0&&(t=n.return),a=n.return;for(;n.return;)n=n.return;return n.tag===3?t:null}function h(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function d(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function p(t){if(u(t)!==t)throw Error(r(188))}function g(t){var n=t.alternate;if(!n){if(n=u(t),n===null)throw Error(r(188));return n!==t?null:t}for(var a=t,s=n;;){var c=a.return;if(c===null)break;var f=c.alternate;if(f===null){if(s=c.return,s!==null){a=s;continue}break}if(c.child===f.child){for(f=c.child;f;){if(f===a)return p(c),t;if(f===s)return p(c),n;f=f.sibling}throw Error(r(188))}if(a.return!==s.return)a=c,s=f;else{for(var v=!1,w=c.child;w;){if(w===a){v=!0,a=c,s=f;break}if(w===s){v=!0,s=c,a=f;break}w=w.sibling}if(!v){for(w=f.child;w;){if(w===a){v=!0,a=f,s=c;break}if(w===s){v=!0,s=f,a=c;break}w=w.sibling}if(!v)throw Error(r(189))}}if(a.alternate!==s)throw Error(r(190))}if(a.tag!==3)throw Error(r(188));return a.stateNode.current===a?t:n}function _(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=_(t),n!==null)return n;t=t.sibling}return null}function m(t,n,a,s,c,f){for(;t!==null;){if((t.tag===5||t.tag===27||t.tag===6)&&a(t,s,c,f)||(t.tag!==22||t.memoizedState===null)&&(n||t.tag!==5&&t.tag!==27)&&m(t.child,n,a,s,c,f))return!0;t=t.sibling}return!1}function y(t){for(t=t.return;t!==null;){if(t.tag===3||t.tag===5||t.tag===27)return t;t=t.return}return null}function x(t){var n=!1;for(t=t.return;t!==null&&(t.tag===4&&(n=!0),!(t.tag===3||t.tag===5||t.tag===27));)t=t.return;return n}function b(t){var n=[null,null],a=y(t);return a===null||T(n,t,a.child,{foundSelf:!1}),n}function T(t,n,a,s){for(;a!==null;){if(a===n)s.foundSelf=!0;else if(a.tag===5||a.tag===27||a.tag===6){if(s.foundSelf)return t[1]=a,!0;t[0]=a}else if((a.tag!==22||a.memoizedState===null)&&T(t,n,a.child,s))return!0;a=a.sibling}return!1}function M(t){switch(t.tag){case 5:case 27:case 6:return t.stateNode;case 3:return t.stateNode.containerInfo;default:throw Error(r(559))}}var S=null,G=null;function I(t,n,a){return t===a?!0:t===n?(S=t,!0):!1}function z(t,n,a){return t===a?(G=t,!1):t===n?(G!==null&&(S=t),!0):!1}function F(t){if(t===null)return null;do t=t===null?null:t.return;while(t&&t.tag!==5&&t.tag!==27&&t.tag!==3);return t||null}function P(t,n,a){for(var s=0,c=t;c;c=a(c))s++;c=0;for(var f=n;f;f=a(f))c++;for(;0<s-c;)t=a(t),s--;for(;0<c-s;)n=a(n),c--;for(;s--;){if(t===n||n!==null&&t===n.alternate)return t;t=a(t),n=a(n)}return null}var L=Object.assign,V=Symbol.for("react.element"),C=Symbol.for("react.transitional.element"),E=Symbol.for("react.portal"),k=Symbol.for("react.fragment"),et=Symbol.for("react.strict_mode"),tt=Symbol.for("react.profiler"),ut=Symbol.for("react.consumer"),ft=Symbol.for("react.context"),X=Symbol.for("react.forward_ref"),it=Symbol.for("react.suspense"),W=Symbol.for("react.suspense_list"),mt=Symbol.for("react.memo"),vt=Symbol.for("react.lazy"),At=Symbol.for("react.activity"),Xt=Symbol.for("react.legacy_hidden"),he=Symbol.for("react.memo_cache_sentinel"),R=Symbol.for("react.view_transition"),Y=Symbol.for("react.recoverable"),pt=Symbol.iterator;function ht(t){return t===null||typeof t!="object"?null:(t=pt&&t[pt]||t["@@iterator"],typeof t=="function"?t:null)}var Ct=Symbol.for("react.client.reference");function Ut(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===Ct?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case k:return"Fragment";case tt:return"Profiler";case et:return"StrictMode";case it:return"Suspense";case W:return"SuspenseList";case At:return"Activity";case R:return"ViewTransition"}if(typeof t=="object")switch(t.$$typeof){case E:return"Portal";case ft:return t.displayName||"Context";case ut:return(t._context.displayName||"Context")+".Consumer";case X:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case mt:return n=t.displayName||null,n!==null?n:Ut(t.type)||"Memo";case vt:n=t._payload,t=t._init;try{return Ut(t(n))}catch{}}return null}var bt=Array.isArray,Dt=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,zt=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,se={pending:!1,data:null,method:null,action:null},H=[],Ue=-1;function ne(t){return{current:t}}function qt(t){0>Ue||(t.current=H[Ue],H[Ue]=null,Ue--)}function Nt(t,n){Ue++,H[Ue]=t.current,t.current=n}var Wt=ne(null),Vt=ne(null),O=ne(null),A=ne(null);function rt(t,n){switch(Nt(O,n),Nt(Vt,t),Nt(Wt,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?k0(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=k0(n),t=H0(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}qt(Wt),Nt(Wt,t)}function St(){qt(Wt),qt(Vt),qt(O)}function Mt(t){var n=t.memoizedState;n!==null&&(Xs._currentValue=n.memoizedState,Nt(A,t)),n=Wt.current;var a=H0(n,t.type);n!==a&&(Nt(Vt,t),Nt(Wt,a))}function gt(t){Vt.current===t&&(qt(Wt),qt(Vt)),A.current===t&&(qt(A),Xs._currentValue=se)}var Qt,Ft;function Ht(t){if(Qt===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);Qt=n&&n[1]||"",Ft=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Qt+t+Ft}var ye=!1;function Rt(t,n){if(!t||ye)return"";ye=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var s={DetermineComponentFrameRoot:function(){try{if(n){var yt=function(){throw Error()};if(Object.defineProperty(yt.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(yt,[])}catch(It){var q=It}Reflect.construct(t,[],yt)}else{try{yt.call()}catch(It){q=It}yt=!1;try{var at=Object.getOwnPropertyDescriptor(t.prototype,"props");Object.defineProperty(t.prototype,"props",{configurable:!0,set:function(){throw Error()}}),yt=!0,new t}finally{yt&&(at!==void 0?Object.defineProperty(t.prototype,"props",at):delete t.prototype.props)}}}else{try{throw Error()}catch(It){q=It}(yt=t())&&typeof yt.catch=="function"&&yt.catch(function(){})}}catch(It){if(It&&q&&typeof It.stack=="string")return[It.stack,q.stack]}return[null,null]}};s.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(s.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=s.DetermineComponentFrameRoot(),v=f[0],w=f[1];if(v&&w){var B=v.split(`
`),K=w.split(`
`);for(c=s=0;s<B.length&&!B[s].includes("DetermineComponentFrameRoot");)s++;for(;c<K.length&&!K[c].includes("DetermineComponentFrameRoot");)c++;if(s===B.length||c===K.length)for(s=B.length-1,c=K.length-1;1<=s&&0<=c&&B[s]!==K[c];)c--;for(;1<=s&&0<=c;s--,c--)if(B[s]!==K[c]){if(s!==1||c!==1)do if(s--,c--,0>c||B[s]!==K[c]){var ot=`
`+B[s].replace(" at new "," at ");return t.displayName&&ot.includes("<anonymous>")&&(ot=ot.replace("<anonymous>",t.displayName)),ot}while(1<=s&&0<=c);break}}}finally{ye=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?Ht(a):""}function Zt(t,n){switch(t.tag){case 26:case 27:case 5:return Ht(t.type);case 16:return Ht("Lazy");case 13:return t.child!==n&&n!==null?Ht("Suspense Fallback"):Ht("Suspense");case 19:return Ht("SuspenseList");case 0:case 15:return Rt(t.type,!1);case 11:return Rt(t.type.render,!1);case 1:return Rt(t.type,!0);case 31:return Ht("Activity");case 30:return Ht("ViewTransition");default:return""}}function ie(t){try{var n="",a=null;do n+=Zt(t,a),a=t,t=t.return;while(t);return n}catch(s){return`
Error generating stack: `+s.message+`
`+s.stack}}var re=Object.prototype.hasOwnProperty,jt=o.unstable_scheduleCallback,_e=o.unstable_cancelCallback,fe=o.unstable_shouldYield,dt=o.unstable_requestPaint,U=o.unstable_now,Tt=o.unstable_getCurrentPriorityLevel,st=o.unstable_ImmediatePriority,xt=o.unstable_UserBlockingPriority,kt=o.unstable_NormalPriority,Ot=o.unstable_LowPriority,ce=o.unstable_IdlePriority,tn=o.log,Sn=o.unstable_setDisableYieldValue,Ce=null,Je=null;function Mn(t){if(typeof tn=="function"&&Sn(t),Je&&typeof Je.setStrictMode=="function")try{Je.setStrictMode(Ce,t)}catch{}}var Bn=Math.clz32?Math.clz32:Eo,Pl=Math.log,ra=Math.LN2;function Eo(t){return t>>>=0,t===0?32:31-(Pl(t)/ra|0)|0}var Sr=256,Mr=262144,sa=4194304;function Gi(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&-t;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function oa(t,n,a){var s=t.pendingLanes;if(s===0)return 0;var c=0,f=t.suspendedLanes,v=t.pingedLanes;t=t.warmLanes;var w=s&134217727;return w!==0?(s=w&~f,s!==0?c=Gi(s):(v&=w,v!==0?c=Gi(v):a||(a=w&~t,a!==0&&(c=Gi(a))))):(w=s&~f,w!==0?c=Gi(w):v!==0?c=Gi(v):a||(a=s&~t,a!==0&&(c=Gi(a)))),c===0?0:n!==0&&n!==c&&(n&f)===0&&(f=c&-c,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:c}function Ua(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function bo(t,n){(n&8)!==0&&(n|=n&32);var a=t.entangledLanes;if(a!==0)for(t=t.entanglements,a&=n;0<a;){var s=31-Bn(a),c=1<<s;n|=t[s],a&=~c}return n}function tf(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Il(){var t=sa;return sa<<=1,(sa&62914560)===0&&(sa=4194304),t}function To(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function Er(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function ef(t,n,a,s,c,f){var v=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var w=t.entanglements,B=t.expirationTimes,K=t.hiddenUpdates;for(a=v&~a;0<a;){var ot=31-Bn(a),yt=1<<ot;w[ot]=0,B[ot]=-1;var q=K[ot];if(q!==null)for(K[ot]=null,ot=0;ot<q.length;ot++){var at=q[ot];at!==null&&(at.lane&=-536870913)}a&=~yt}s!==0&&Bl(t,s,0),f!==0&&c===0&&t.tag!==0&&(t.suspendedLanes|=f&~(v&~n))}function Bl(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var s=31-Bn(n);t.entangledLanes|=n,t.entanglements[s]=t.entanglements[s]|1073741824|a&261930}function N(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var s=31-Bn(a),c=1<<s;c&n|t[s]&n&&(t[s]|=n),a&=~c}}function Q(t,n){var a=n&-n;return a=(a&42)!==0?1:lt(a),(a&(t.suspendedLanes|n))!==0?0:a}function lt(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function ct(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function J(){var t=zt.p;return t!==0?t:(t=window.event,t===void 0?32:bv(t.type))}function wt(t,n){var a=zt.p;try{return zt.p=t,n()}finally{zt.p=a}}var Pt=Math.random().toString(36).slice(2),Lt="__reactFiber$"+Pt,Bt="__reactProps$"+Pt,ae="__reactContainer$"+Pt,le="__reactEvents$"+Pt,ee="__reactListeners$"+Pt,De="__reactHandles$"+Pt,ze="__reactResources$"+Pt,Ze="__reactMarker$"+Pt,We="__reactLoad$"+Pt;function Se(t){delete t[Lt],delete t[Bt],delete t[ee],delete t[De]}function Jt(t){var n;if(n=t[Lt])return n;for(var a=t.parentNode;a;){if(n=a[ae]||a[Lt]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=av(t);t!==null;){if(a=t[Lt])return a;t=av(t)}return n}t=a,a=t.parentNode}return null}function en(t){if(t=t[Lt]||t[ae]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function we(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(r(33))}function En(t){var n=t[ze];return n||(n=t[ze]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function $e(t){t[Ze]=!0}function Fn(t){t[We]=void 0}var La=new Set,Ye={};function cn(t,n){mn(t,n),mn(t+"Capture",n)}function mn(t,n){for(Ye[t]=n,t=0;t<n.length;t++)La.add(n[t])}var Rn=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Cn={},ls={};function la(t){return re.call(ls,t)?!0:re.call(Cn,t)?!1:Rn.test(t)?ls[t]=!0:(Cn[t]=!0,!1)}var Le=!1;function wm(){var t=Le;return Le=!1,t}function Fl(t,n,a){if(la(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var s=n.toLowerCase().slice(0,5);if(s!=="data-"&&s!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,a)}}function kl(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,a)}}function ca(t,n,a,s){if(s===null)t.removeAttribute(a);else{switch(typeof s){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,s)}}function si(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Am(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Qx(t,n,a){var s=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof s<"u"&&typeof s.get=="function"&&typeof s.set=="function"){var c=s.get,f=s.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return c.call(this)},set:function(v){a=""+v,f.call(this,v)}}),Object.defineProperty(t,n,{enumerable:s.enumerable}),{getValue:function(){return a},setValue:function(v){a=""+v},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function nf(t){if(!t._valueTracker){var n=Am(t)?"checked":"value";t._valueTracker=Qx(t,n,""+t[n])}}function Rm(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),s="";return t&&(s=Am(t)?t.checked?"true":"false":t.value),t=s,t!==a?(n.setValue(t),!0):!1}var Jx=/[\n"\\]/g;function _i(t){return t.replace(Jx,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function af(t,n,a,s,c,f,v,w){t.name="",v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"?t.type=v:t.removeAttribute("type"),n!=null?v==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+si(n)):t.value!==""+si(n)&&(t.value=""+si(n)):v!=="submit"&&v!=="reset"||t.removeAttribute("value"),n!=null?v==="number"&&t.value==n?rf(t,si(t.value)):rf(t,si(n)):a!=null?rf(t,si(a)):s!=null&&t.removeAttribute("value"),c==null&&f!=null&&(t.defaultChecked=!!f),c!=null&&(t.checked=c&&typeof c!="function"&&typeof c!="symbol"),w!=null&&typeof w!="function"&&typeof w!="symbol"&&typeof w!="boolean"?t.name=""+si(w):t.removeAttribute("name")}function Cm(t,n,a,s,c,f,v,w){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(t.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){nf(t);return}a=a!=null?""+si(a):"",n=n!=null?""+si(n):a,w||n===t.value||(t.value=n),t.defaultValue=n}s=s??c,s=typeof s!="function"&&typeof s!="symbol"&&!!s,t.checked=w?t.checked:!!s,t.defaultChecked=!!s,v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"&&(t.name=v),nf(t)}function rf(t,n){t.defaultValue!==""+n&&(t.defaultValue=""+n)}function cs(t,n,a,s){if(t=t.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<t.length;a++)c=n.hasOwnProperty("$"+t[a].value),t[a].selected!==c&&(t[a].selected=c),c&&s&&(t[a].defaultSelected=!0)}else{for(a=""+si(a),n=null,c=0;c<t.length;c++){if(t[c].value===a){t[c].selected=!0,s&&(t[c].defaultSelected=!0);return}n!==null||t[c].disabled||(n=t[c])}n!==null&&(n.selected=!0)}}function Dm(t,n,a){if(n!=null&&(n=""+si(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+si(a):""}function Nm(t,n,a,s){if(n==null){if(s!=null){if(a!=null)throw Error(r(92));if(bt(s)){if(1<s.length)throw Error(r(93));s=s[0]}a=s}a==null&&(a=""),n=a}a=si(n),t.defaultValue=a,s=t.textContent,s===a&&s!==""&&s!==null&&(t.value=s),nf(t)}function us(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var $x=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function zm(t,n,a){var s=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?s?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":s?t.setProperty(n,a):typeof a!="number"||a===0||$x.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function Um(t,n,a){if(n!=null&&typeof n!="object")throw Error(r(62));if(t=t.style,a!=null){for(var s in a)!a.hasOwnProperty(s)||n!=null&&n.hasOwnProperty(s)||(s.indexOf("--")===0?t.setProperty(s,""):s==="float"?t.cssFloat="":t[s]="",Le=!0);for(var c in n)s=n[c],n.hasOwnProperty(c)&&a[c]!==s&&(zm(t,c,s),Le=!0)}else for(var f in n)n.hasOwnProperty(f)&&zm(t,f,n[f])}function sf(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var tS=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),eS=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Hl(t){return eS.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function Vi(){}var of=null;function lf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var fs=null,hs=null;function Lm(t){var n=en(t);if(n&&(t=n.stateNode)){var a=t[Bt]||null;t:switch(t=n.stateNode,n.type){case"input":if(af(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+_i(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var s=a[n];if(s!==t&&s.form===t.form){var c=s[Bt]||null;if(!c)throw Error(r(90));af(s,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)s=a[n],s.form===t.form&&Rm(s)}break t;case"textarea":Dm(t,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&cs(t,!!a.multiple,n,!1)}}}var cf=!1;function Om(t,n,a){if(cf)return t(n,a);cf=!0;try{var s=t(n);return s}finally{if(cf=!1,(fs!==null||hs!==null)&&(Hc(),fs&&(n=fs,t=hs,hs=fs=null,Lm(n),t)))for(n=0;n<t.length;n++)Lm(t[n])}}function wo(t,n){var a=t.stateNode;if(a===null)return null;var s=a[Bt]||null;if(s===null)return null;a=s[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(t=t.type,s=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!s;break t;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(r(231,n,typeof a));return a}var ua=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),uf=!1;if(ua)try{var Ao={};Object.defineProperty(Ao,"passive",{get:function(){uf=!0}}),window.addEventListener("test",Ao,Ao),window.removeEventListener("test",Ao,Ao)}catch{uf=!1}var Oa=null,ff=null,Gl=null;function Pm(){if(Gl)return Gl;var t,n=ff,a=n.length,s,c="value"in Oa?Oa.value:Oa.textContent,f=c.length;for(t=0;t<a&&n[t]===c[t];t++);var v=a-t;for(s=1;s<=v&&n[a-s]===c[f-s];s++);return Gl=c.slice(t,1<s?1-s:void 0)}function Vl(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function jl(){return!0}function Im(){return!1}function jn(t){function n(a,s,c,f,v){this._reactName=a,this._targetInst=c,this.type=s,this.nativeEvent=f,this.target=v,this.currentTarget=null;for(var w in t)t.hasOwnProperty(w)&&(a=t[w],this[w]=a?a(f):f[w]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?jl:Im,this.isPropagationStopped=Im,this}return L(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=jl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=jl)},persist:function(){},isPersistent:jl}),n}var Pa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Xl=jn(Pa),Ro=L({},Pa,{view:0,detail:0}),nS=jn(Ro),hf,df,Co,Wl=L({},Ro,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:mf,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Co&&(Co&&t.type==="mousemove"?(hf=t.screenX-Co.screenX,df=t.screenY-Co.screenY):df=hf=0,Co=t),hf)},movementY:function(t){return"movementY"in t?t.movementY:df}}),Bm=jn(Wl),iS=L({},Wl,{dataTransfer:0}),aS=jn(iS),rS=L({},Ro,{relatedTarget:0}),pf=jn(rS),sS=L({},Pa,{animationName:0,elapsedTime:0,pseudoElement:0}),oS=jn(sS),lS=L({},Pa,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),cS=jn(lS),uS=L({},Pa,{data:0}),Fm=jn(uS),fS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},hS={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},dS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function pS(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=dS[t])?!!n[t]:!1}function mf(){return pS}var mS=L({},Ro,{key:function(t){if(t.key){var n=fS[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=Vl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?hS[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:mf,charCode:function(t){return t.type==="keypress"?Vl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Vl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),gS=jn(mS),_S=L({},Wl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),km=jn(_S),vS=L({},Pa,{submitter:0}),yS=jn(vS),xS=L({},Ro,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:mf}),SS=jn(xS),MS=L({},Pa,{propertyName:0,elapsedTime:0,pseudoElement:0}),ES=jn(MS),bS=L({},Wl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),TS=jn(bS),wS=L({},Pa,{newState:0,oldState:0,source:0}),AS=jn(wS),RS=[9,13,27,32],gf=ua&&"CompositionEvent"in window,Do=null;ua&&"documentMode"in document&&(Do=document.documentMode);var CS=ua&&"TextEvent"in window&&!Do,Hm=ua&&(!gf||Do&&8<Do&&11>=Do),Gm=" ",Vm=!1;function jm(t,n){switch(t){case"keyup":return RS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Xm(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ds=!1;function DS(t,n){switch(t){case"compositionend":return Xm(n);case"keypress":return n.which!==32?null:(Vm=!0,Gm);case"textInput":return t=n.data,t===Gm&&Vm?null:t;default:return null}}function NS(t,n){if(ds)return t==="compositionend"||!gf&&jm(t,n)?(t=Pm(),Gl=ff=Oa=null,ds=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Hm&&n.locale!=="ko"?null:n.data;default:return null}}var zS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Wm(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!zS[t.type]:n==="textarea"}function Ym(t,n,a,s){fs?hs?hs.push(s):hs=[s]:fs=s,n=Yc(n,"onChange"),0<n.length&&(a=new Xl("onChange","change",null,a,s),t.push({event:a,listeners:n}))}var No=null,zo=null;function US(t){L0(t,0)}function Yl(t){var n=we(t);if(Rm(n))return t}function qm(t,n){if(t==="change")return n}var Zm=!1;if(ua){var _f;if(ua){var vf="oninput"in document;if(!vf){var Km=document.createElement("div");Km.setAttribute("oninput","return;"),vf=typeof Km.oninput=="function"}_f=vf}else _f=!1;Zm=_f&&(!document.documentMode||9<document.documentMode)}function Qm(){No&&(No.detachEvent("onpropertychange",Jm),zo=No=null)}function Jm(t){if(t.propertyName==="value"&&Yl(zo)){var n=[];Ym(n,zo,t,lf(t)),Om(US,n)}}function LS(t,n,a){t==="focusin"?(Qm(),No=n,zo=a,No.attachEvent("onpropertychange",Jm)):t==="focusout"&&Qm()}function OS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Yl(zo)}function PS(t,n){if(t==="click")return Yl(n)}function IS(t,n){if(t==="input"||t==="change")return Yl(n)}function BS(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var oi=typeof Object.is=="function"?Object.is:BS;function Uo(t,n){if(oi(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),s=Object.keys(n);if(a.length!==s.length)return!1;for(s=0;s<a.length;s++){var c=a[s];if(!re.call(n,c)||!oi(t[c],n[c]))return!1}return!0}function yf(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function $m(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function tg(t,n){var a=$m(t);t=0;for(var s;a;){if(a.nodeType===3){if(s=t+a.textContent.length,t<=n&&s>=n)return{node:a,offset:n-t};t=s}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=$m(a)}}function eg(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?eg(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function ng(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=yf(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=yf(t.document)}return n}function xf(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var FS=ua&&"documentMode"in document&&11>=document.documentMode,ps=null,Sf=null,Lo=null,Mf=!1;function ig(t,n,a){var s=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Mf||ps==null||ps!==yf(s)||(s=ps,"selectionStart"in s&&xf(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),Lo&&Uo(Lo,s)||(Lo=s,s=Yc(Sf,"onSelect"),0<s.length&&(n=new Xl("onSelect","select",null,n,a),t.push({event:n,listeners:s}),n.target=ps)))}function br(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var ms={animationend:br("Animation","AnimationEnd"),animationiteration:br("Animation","AnimationIteration"),animationstart:br("Animation","AnimationStart"),transitionrun:br("Transition","TransitionRun"),transitionstart:br("Transition","TransitionStart"),transitioncancel:br("Transition","TransitionCancel"),transitionend:br("Transition","TransitionEnd")},Ef={},ag={};ua&&(ag=document.createElement("div").style,"AnimationEvent"in window||(delete ms.animationend.animation,delete ms.animationiteration.animation,delete ms.animationstart.animation),"TransitionEvent"in window||delete ms.transitionend.transition);function Tr(t){if(Ef[t])return Ef[t];if(!ms[t])return t;var n=ms[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in ag)return Ef[t]=n[a];return t}var rg=Tr("animationend"),sg=Tr("animationiteration"),og=Tr("animationstart"),kS=Tr("transitionrun"),HS=Tr("transitionstart"),GS=Tr("transitioncancel"),lg=Tr("transitionend"),cg=new Map,bf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");bf.push("scrollEnd");function Di(t,n){cg.set(t,n),cn(n,[t])}var VS=0;function fa(t,n){if(t.name!=null&&t.name!=="auto")return t.name;if(n.autoName!==null)return n.autoName;t=Li.identifierPrefix;var a=VS++;return t="_"+t+"t_"+a.toString(32)+"_",n.autoName=t}function ug(t){if(t==null||typeof t=="string")return t;var n=null,a=Os;if(a!==null)for(var s=0;s<a.length;s++){var c=t[a[s]];if(c!=null){if(c==="none")return"none";n=n==null?c:n+(" "+c)}}return n??t.default}function ha(t,n){return t=ug(t),n=ug(n),n==null?t==="auto"?null:t:n==="auto"?null:n}var ql=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},vi=[],gs=0,Tf=0;function Zl(){for(var t=gs,n=Tf=gs=0;n<t;){var a=vi[n];vi[n++]=null;var s=vi[n];vi[n++]=null;var c=vi[n];vi[n++]=null;var f=vi[n];if(vi[n++]=null,s!==null&&c!==null){var v=s.pending;v===null?c.next=c:(c.next=v.next,v.next=c),s.pending=c}f!==0&&fg(a,c,f)}}function Kl(t,n,a,s){vi[gs++]=t,vi[gs++]=n,vi[gs++]=a,vi[gs++]=s,Tf|=s,t.lanes|=s,t=t.alternate,t!==null&&(t.lanes|=s)}function wf(t,n,a,s){return Kl(t,n,a,s),Ql(t)}function wr(t,n){return Kl(t,null,null,n),Ql(t)}function fg(t,n,a){t.lanes|=a;var s=t.alternate;s!==null&&(s.lanes|=a);for(var c=!1,f=t.return;f!==null;)f.childLanes|=a,s=f.alternate,s!==null&&(s.childLanes|=a),f.tag===22&&(t=f.stateNode,t===null||t._visibility&1||(c=!0)),t=f,f=f.return;return t.tag===3?(f=t.stateNode,c&&n!==null&&(c=31-Bn(a),t=f.hiddenUpdates,s=t[c],s===null?t[c]=[n]:s.push(n),n.lane=a|536870912),f):null}function Ql(t){if(50<nl)throw nl=0,kc=null,Error(r(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var _s={};function jS(t,n,a,s){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Qn(t,n,a,s){return new jS(t,n,a,s)}function Af(t){return t=t.prototype,!(!t||!t.isReactComponent)}function da(t,n){var a=t.alternate;return a===null?(a=Qn(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&1206910976,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function hg(t,n){t.flags&=1206910978;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function Jl(t,n,a,s,c,f){var v=0;if(s=t,typeof s=="function")Af(s)&&(v=1);else if(typeof s=="string")v=vE(t,a,Wt.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(s){case At:return t=Qn(31,a,n,c),t.elementType=At,t.lanes=f,t;case k:return Ar(a.children,c,f,n);case et:v=8,c|=24;break;case tt:return t=Qn(12,a,n,c|2),t.elementType=tt,t.lanes=f,t;case it:return t=Qn(13,a,n,c),t.elementType=it,t.lanes=f,t;case W:return t=Qn(19,a,n,c),t.elementType=W,t.lanes=f,t;case Xt:case R:return t=c|32,t=Qn(30,a,n,t),t.elementType=R,t.lanes=f,t.stateNode={autoName:null,paired:null,clones:null,ref:null},t;default:if(typeof s=="object"&&s!==null)switch(s.$$typeof){case ft:v=10;break t;case ut:v=9;break t;case X:v=11;break t;case mt:v=14;break t;case vt:v=16,s=null;break t}v=29,a=Error(r(130,t===null?"null":typeof t,"")),s=null}return n=Qn(v,a,n,c),n.elementType=t,n.type=s,n.lanes=f,n}function Ar(t,n,a,s){return t=Qn(7,t,s,n),t.lanes=a,t}function Rf(t,n,a){return t=Qn(6,t,null,n),t.lanes=a,t}function dg(t){var n=Qn(18,null,null,0);return n.stateNode=t,n}function Cf(t,n,a){return n=Qn(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var pg=new WeakMap;function yi(t,n){if(typeof t=="object"&&t!==null){var a=pg.get(t);return a!==void 0?a:(n={value:t,source:n,stack:ie(n)},pg.set(t,n),n)}return{value:t,source:n,stack:ie(n)}}var vs=[],ys=0,$l=null,Oo=0,xi=[],Si=0,Ia=null,ji=1,Xi="";function pa(t,n){vs[ys++]=Oo,vs[ys++]=$l,$l=t,Oo=n}function mg(t,n,a){xi[Si++]=ji,xi[Si++]=Xi,xi[Si++]=Ia,Ia=t;var s=ji;t=Xi;var c=32-Bn(s)-1;s&=~(1<<c),a+=1;var f=32-Bn(n)+c;if(30<f){var v=c-c%5;f=(s&(1<<v)-1).toString(32),s>>=v,c-=v,ji=1<<32-Bn(n)+c|a<<c|s,Xi=f+t}else ji=1<<f|a<<c|s,Xi=t}function tc(t){t.return!==null&&(pa(t,1),mg(t,1,0))}function Df(t){for(;t===$l;)$l=vs[--ys],vs[ys]=null,Oo=vs[--ys],vs[ys]=null;for(;t===Ia;)Ia=xi[--Si],xi[Si]=null,Xi=xi[--Si],xi[Si]=null,ji=xi[--Si],xi[Si]=null}function gg(t,n){xi[Si++]=ji,xi[Si++]=Xi,xi[Si++]=Ia,ji=n.id,Xi=n.overflow,Ia=t}var bn=null,Ke=null,xe=!1,Ba=null,Mi=!1,Nf=Error(r(519));function Fa(t){var n=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Po(yi(n,t)),Nf}function _g(t){var n=t.stateNode,a=t.type,s=t.memoizedProps;switch(n[Lt]=t,n[Bt]=s,a){case"dialog":Ee("cancel",n),Ee("close",n);break;case"iframe":case"object":case"embed":Ee("load",n);break;case"video":case"audio":for(a=0;a<al.length;a++)Ee(al[a],n);break;case"source":Ee("error",n);break;case"img":case"image":case"link":Ee("error",n),Ee("load",n);break;case"details":Ee("toggle",n);break;case"input":Ee("invalid",n),Cm(n,s.value,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name,!0);break;case"select":Ee("invalid",n);break;case"textarea":Ee("invalid",n),Nm(n,s.value,s.defaultValue,s.children)}a=s.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||s.suppressHydrationWarning===!0||B0(n.textContent,a)?(s.popover!=null&&(Ee("beforetoggle",n),Ee("toggle",n)),s.onScroll!=null&&Ee("scroll",n),s.onScrollEnd!=null&&Ee("scrollend",n),s.onClick!=null&&(n.onclick=Vi),n=!0):n=!1,n||Fa(t,!0)}function ec(t){for(bn=t.return;bn;)switch(bn.tag){case 5:case 31:case 13:Mi=!1;return;case 27:case 3:Mi=!0;return;default:bn=bn.return}}function xs(t){if(t!==bn)return!1;if(!xe)return ec(t),xe=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||od(t.type,t.memoizedProps)),a=!a),a&&Ke&&Fa(t),ec(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Ke=iv(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Ke=iv(t)}else n===27?(n=Ke,er(t.type)?(t=gd,gd=null,Ke=t):Ke=n):Ke=bn?bi(t.stateNode.nextSibling):null;return!0}function Rr(){Ke=bn=null,xe=!1}function zf(){var t=Ba;return t!==null&&(ti===null?ti=t:ti.push.apply(ti,t),Ba=null),t}function Po(t){Ba===null?Ba=[t]:Ba.push(t)}var Uf=ne(null),Cr=null,ma=null;function ka(t,n,a){Nt(Uf,n._currentValue),n._currentValue=a}function ga(t){t._currentValue=Uf.current,qt(Uf)}function nc(t,n,a){for(;t!==null;){var s=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,s!==null&&(s.childLanes|=n)):s!==null&&(s.childLanes&n)!==n&&(s.childLanes|=n),t===a)break;t=t.return}}function Lf(t,n,a,s){var c=t.child;for(c!==null&&(c.return=t);c!==null;){var f=c.dependencies;if(f!==null){var v=c.child;f=f.firstContext;t:for(;f!==null;){var w=f;f=c;for(var B=0;B<n.length;B++)if(w.context===n[B]){f.lanes|=a,w=f.alternate,w!==null&&(w.lanes|=a),nc(f.return,a,t),s||(v=null);break t}f=w.next}}else if(c.tag===18){if(v=c.return,v===null)throw Error(r(341));v.lanes|=a,f=v.alternate,f!==null&&(f.lanes|=a),nc(v,a,t),v=null}else c.tag===13&&c.memoizedState!==null&&c.memoizedState.dehydrated===null?(c.lanes|=a,v=c.alternate,v!==null&&(v.lanes|=a),nc(c.return,a,t),v=c.child,v=v!==null?v.sibling:null):v=c.child;if(v!==null)v.return=c;else for(v=c;v!==null;){if(v===t){v=null;break}if(c=v.sibling,c!==null){c.return=v.return,v=c;break}v=v.return}c=v}}function Dr(t,n,a,s){t=null;for(var c=n,f=!1;c!==null;){if(!f){if((c.flags&524288)!==0)f=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var v=c.alternate;if(v===null)throw Error(r(387));if(v=v.memoizedProps,v!==null){var w=c.type;oi(c.pendingProps.value,v.value)||(t!==null?t.push(w):t=[w])}}else if(c===A.current){if(v=c.alternate,v===null)throw Error(r(387));v.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(t!==null?t.push(Xs):t=[Xs])}c=c.return}return t!==null&&Lf(n,t,a,s),n.flags|=262144,t!==null}function ic(t){for(t=t.firstContext;t!==null;){if(!oi(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function Nr(t){Cr=t,ma=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Dn(t){return vg(Cr,t)}function ac(t,n){return Cr===null&&Nr(t),vg(t,n)}function vg(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},ma===null){if(t===null)throw Error(r(308));ma=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else ma=ma.next=n;return a}var XS=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,s){t.push(s)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},WS=o.unstable_scheduleCallback,YS=o.unstable_NormalPriority,un={$$typeof:ft,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Of(){return{controller:new XS,data:new Map,refCount:0}}function Io(t){t.refCount--,t.refCount===0&&WS(YS,function(){t.controller.abort()})}function yg(t,n){if((t.pendingLanes&4194048)!==0){var a=t.transitionTypes;for(a===null&&(a=t.transitionTypes=[]),t=0;t<n.length;t++){var s=n[t];a.indexOf(s)===-1&&a.push(s)}}}var Bo=null;function qS(t){var n=t.transitionTypes;return t.transitionTypes=null,n}var Fo=null,Pf=0,zr=0,Ss=null;function ZS(t,n){if(Fo===null){var a=Fo=[];Pf=0,zr=Jh(),Ss={status:"pending",value:void 0,then:function(s){a.push(s)}}}return Pf++,n.then(xg,xg),n}function xg(){if(--Pf===0&&(Bo=null,Fo!==null)){Ss!==null&&(Ss.status="fulfilled");var t=Fo;Fo=null,zr=0,Ss=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function KS(t,n){var a=[],s={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return t.then(function(){s.status="fulfilled",s.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(s.status="rejected",s.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),s}var Sg=Dt.S;Dt.S=function(t,n){if(d0=U(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&ZS(t,n),Bo!==null)for(var a=Fs;a!==null;)yg(a,Bo),a=a.next;if(a=t.types,a!==null){for(var s=Fs;s!==null;)yg(s,a),s=s.next;if(zr!==0){s=Bo,s===null&&(s=Bo=[]);for(var c=0;c<a.length;c++){var f=a[c];s.indexOf(f)===-1&&s.push(f)}}}Sg!==null&&Sg(t,n)};var Ur=ne(null);function If(){var t=Ur.current;return t!==null?t:qe.pooledCache}function rc(t,n){n===null?Nt(Ur,Ur.current):Nt(Ur,n.pool)}function Mg(){var t=If();return t===null?null:{parent:un._currentValue,pool:t}}var Ms=Error(r(460)),Bf=Error(r(474)),sc=Error(r(542)),oc={then:function(){}};function Eg(t){return t=t.status,t==="fulfilled"||t==="rejected"}function bg(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(Vi,Vi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,wg(t),t===void 0&&!("reason"in n)?Error(r(600)):t;default:if(typeof n.status=="string")n.then(Vi,Vi);else{if(t=qe,t!==null&&100<t.shellSuspendCounter)throw Error(r(482));t=n,t.status="pending",t.then(function(s){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=s}},function(s){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=s}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,wg(t),t}throw Or=n,Ms}}function Lr(t){try{var n=t._init;return n(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Or=a,Ms):a}}var Or=null;function Tg(){if(Or===null)throw Error(r(459));var t=Or;return Or=null,t}function wg(t){if(t===Ms||t===sc)throw Error(r(483))}var Es=null,ko=0;function lc(t){var n=ko;return ko+=1,Es===null&&(Es=[]),bg(Es,t,n)}function Ha(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function cc(t,n){throw n.$$typeof===V?Error(r(525)):(t=Object.prototype.toString.call(n),Error(r(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function Ag(t){function n(Z,j){if(t){var nt=Z.deletions;nt===null?(Z.deletions=[j],Z.flags|=16):nt.push(j)}}function a(Z,j){if(!t)return null;for(;j!==null;)n(Z,j),j=j.sibling;return null}function s(Z){for(var j=new Map;Z!==null;)Z.key===null?j.set(Z.index,Z):j.set(Z.key,Z),Z=Z.sibling;return j}function c(Z,j){return Z=da(Z,j),Z.index=0,Z.sibling=null,Z}function f(Z,j,nt){return Z.index=nt,t?(nt=Z.alternate,nt!==null?(nt=nt.index,nt<j?(Z.flags|=2,j):nt):(Z.flags|=134217730,j)):(Z.flags|=1048576,j)}function v(Z){return t&&Z.alternate===null&&(Z.flags|=134217730),Z}function w(Z,j,nt,_t){return j===null||j.tag!==6?(j=Rf(nt,Z.mode,_t),j.return=Z,j):(j=c(j,nt),j.return=Z,j)}function B(Z,j,nt,_t){var Yt=nt.type;return Yt===k?(Z=ot(Z,j,nt.props.children,_t,nt.key),Ha(Z,nt),Z):j!==null&&(j.elementType===Yt||typeof Yt=="object"&&Yt!==null&&Yt.$$typeof===vt&&Lr(Yt)===j.type)?(j=c(j,nt.props),Ha(j,nt),j.return=Z,j):(j=Jl(nt.type,nt.key,nt.props,null,Z.mode,_t),Ha(j,nt),j.return=Z,j)}function K(Z,j,nt,_t){return j===null||j.tag!==4||j.stateNode.containerInfo!==nt.containerInfo||j.stateNode.implementation!==nt.implementation?(j=Cf(nt,Z.mode,_t),j.return=Z,j):(j=c(j,nt.children||[]),j.return=Z,j)}function ot(Z,j,nt,_t,Yt){return j===null||j.tag!==7?(j=Ar(nt,Z.mode,_t,Yt),j.return=Z,j):(j=c(j,nt),j.return=Z,j)}function yt(Z,j,nt){if(typeof j=="string"&&j!==""||typeof j=="number"||typeof j=="bigint")return j=Rf(""+j,Z.mode,nt),j.return=Z,j;if(typeof j=="object"&&j!==null){switch(j.$$typeof){case C:return nt=Jl(j.type,j.key,j.props,null,Z.mode,nt),Ha(nt,j),nt.return=Z,nt;case E:return j=Cf(j,Z.mode,nt),j.return=Z,j;case vt:return j=Lr(j),yt(Z,j,nt)}if(bt(j)||ht(j))return j=Ar(j,Z.mode,nt,null),j.return=Z,j;if(typeof j.then=="function")return yt(Z,lc(j),nt);if(j.$$typeof===ft)return yt(Z,ac(Z,j),nt);cc(Z,j)}return null}function q(Z,j,nt,_t){var Yt=j!==null?j.key:null;if(typeof nt=="string"&&nt!==""||typeof nt=="number"||typeof nt=="bigint")return Yt!==null?null:w(Z,j,""+nt,_t);if(typeof nt=="object"&&nt!==null){switch(nt.$$typeof){case C:return nt.key===Yt?B(Z,j,nt,_t):null;case E:return nt.key===Yt?K(Z,j,nt,_t):null;case vt:return nt=Lr(nt),q(Z,j,nt,_t)}if(bt(nt)||ht(nt))return Yt!==null?null:ot(Z,j,nt,_t,null);if(typeof nt.then=="function")return q(Z,j,lc(nt),_t);if(nt.$$typeof===ft)return q(Z,j,ac(Z,nt),_t);cc(Z,nt)}return null}function at(Z,j,nt,_t,Yt){if(typeof _t=="string"&&_t!==""||typeof _t=="number"||typeof _t=="bigint")return Z=Z.get(nt)||null,w(j,Z,""+_t,Yt);if(typeof _t=="object"&&_t!==null){switch(_t.$$typeof){case C:return Z=Z.get(_t.key===null?nt:_t.key)||null,B(j,Z,_t,Yt);case E:return Z=Z.get(_t.key===null?nt:_t.key)||null,K(j,Z,_t,Yt);case vt:return _t=Lr(_t),at(Z,j,nt,_t,Yt)}if(bt(_t)||ht(_t))return Z=Z.get(nt)||null,ot(j,Z,_t,Yt,null);if(typeof _t.then=="function")return at(Z,j,nt,lc(_t),Yt);if(_t.$$typeof===ft)return at(Z,j,nt,ac(j,_t),Yt);cc(j,_t)}return null}function It(Z,j,nt,_t){for(var Yt=null,Re=null,$t=j,oe=j=0,dn=null;$t!==null&&oe<nt.length;oe++){$t.index>oe?(dn=$t,$t=null):dn=$t.sibling;var Ne=q(Z,$t,nt[oe],_t);if(Ne===null){$t===null&&($t=dn);break}t&&$t&&Ne.alternate===null&&n(Z,$t),j=f(Ne,j,oe),Re===null?Yt=Ne:Re.sibling=Ne,Re=Ne,$t=dn}if(oe===nt.length)return a(Z,$t),xe&&pa(Z,oe),Yt;if($t===null){for(;oe<nt.length;oe++)$t=yt(Z,nt[oe],_t),$t!==null&&(j=f($t,j,oe),Re===null?Yt=$t:Re.sibling=$t,Re=$t);return xe&&pa(Z,oe),Yt}for($t=s($t);oe<nt.length;oe++)dn=at($t,Z,oe,nt[oe],_t),dn!==null&&(t&&(Ne=dn.alternate,Ne!==null&&$t.delete(Ne.key===null?oe:Ne.key)),j=f(dn,j,oe),Re===null?Yt=dn:Re.sibling=dn,Re=dn);return t&&$t.forEach(function(sr){return n(Z,sr)}),xe&&pa(Z,oe),Yt}function Kt(Z,j,nt,_t){if(nt==null)throw Error(r(151));for(var Yt=null,Re=null,$t=j,oe=j=0,dn=null,Ne=nt.next();$t!==null&&!Ne.done;oe++,Ne=nt.next()){$t.index>oe?(dn=$t,$t=null):dn=$t.sibling;var sr=q(Z,$t,Ne.value,_t);if(sr===null){$t===null&&($t=dn);break}t&&$t&&sr.alternate===null&&n(Z,$t),j=f(sr,j,oe),Re===null?Yt=sr:Re.sibling=sr,Re=sr,$t=dn}if(Ne.done)return a(Z,$t),xe&&pa(Z,oe),Yt;if($t===null){for(;!Ne.done;oe++,Ne=nt.next())Ne=yt(Z,Ne.value,_t),Ne!==null&&(j=f(Ne,j,oe),Re===null?Yt=Ne:Re.sibling=Ne,Re=Ne);return xe&&pa(Z,oe),Yt}for($t=s($t);!Ne.done;oe++,Ne=nt.next())Ne=at($t,Z,oe,Ne.value,_t),Ne!==null&&(t&&(dn=Ne.alternate,dn!==null&&$t.delete(dn.key===null?oe:dn.key)),j=f(Ne,j,oe),Re===null?Yt=Ne:Re.sibling=Ne,Re=Ne);return t&&$t.forEach(function(DE){return n(Z,DE)}),xe&&pa(Z,oe),Yt}function pe(Z,j,nt,_t){if(typeof nt=="object"&&nt!==null&&nt.type===k&&nt.key===null&&nt.props.ref===void 0&&(nt=nt.props.children),typeof nt=="object"&&nt!==null){switch(nt.$$typeof){case C:t:{for(var Yt=nt.key;j!==null;){if(j.key===Yt){if(Yt=nt.type,Yt===k){if(j.tag===7){a(Z,j.sibling),_t=c(j,nt.props.children),Ha(_t,nt),_t.return=Z,Z=_t;break t}}else if(j.elementType===Yt||typeof Yt=="object"&&Yt!==null&&Yt.$$typeof===vt&&Lr(Yt)===j.type){a(Z,j.sibling),_t=c(j,nt.props),Ha(_t,nt),_t.return=Z,Z=_t;break t}a(Z,j);break}else n(Z,j);j=j.sibling}nt.type===k?(_t=Ar(nt.props.children,Z.mode,_t,nt.key),Ha(_t,nt),_t.return=Z,Z=_t):(_t=Jl(nt.type,nt.key,nt.props,null,Z.mode,_t),Ha(_t,nt),_t.return=Z,Z=_t)}return v(Z);case E:t:{for(Yt=nt.key;j!==null;){if(j.key===Yt)if(j.tag===4&&j.stateNode.containerInfo===nt.containerInfo&&j.stateNode.implementation===nt.implementation){a(Z,j.sibling),_t=c(j,nt.children||[]),_t.return=Z,Z=_t;break t}else{a(Z,j);break}else n(Z,j);j=j.sibling}_t=Cf(nt,Z.mode,_t),_t.return=Z,Z=_t}return v(Z);case vt:return nt=Lr(nt),pe(Z,j,nt,_t)}if(bt(nt))return It(Z,j,nt,_t);if(ht(nt)){if(Yt=ht(nt),typeof Yt!="function")throw Error(r(150));return nt=Yt.call(nt),Kt(Z,j,nt,_t)}if(typeof nt.then=="function")return pe(Z,j,lc(nt),_t);if(nt.$$typeof===ft)return pe(Z,j,ac(Z,nt),_t);cc(Z,nt)}return typeof nt=="string"&&nt!==""||typeof nt=="number"||typeof nt=="bigint"?(nt=""+nt,j!==null&&j.tag===6?(a(Z,j.sibling),_t=c(j,nt),_t.return=Z,Z=_t):(a(Z,j),_t=Rf(nt,Z.mode,_t),_t.return=Z,Z=_t),v(Z)):a(Z,j)}return function(Z,j,nt,_t){try{ko=0;var Yt=pe(Z,j,nt,_t);return Es=null,Yt}catch($t){if($t===Ms||$t===sc)throw $t;var Re=Qn(29,$t,null,Z.mode);return Re.lanes=_t,Re.return=Z,Re}finally{}}}var Pr=Ag(!0),Rg=Ag(!1),Ga=!1;function Ff(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function kf(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Va(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function ja(t,n,a){var s=t.updateQueue;if(s===null)return null;if(s=s.shared,(Ie&2)!==0){var c=s.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),s.pending=n,n=Ql(t),fg(t,null,a),n}return Kl(t,s,n,a),Ql(t)}function Ho(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,N(t,a)}}function Hf(t,n){var a=t.updateQueue,s=t.alternate;if(s!==null&&(s=s.updateQueue,a===s)){var c=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var v={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?c=f=v:f=f.next=v,a=a.next}while(a!==null);f===null?c=f=n:f=f.next=n}else c=f=n;a={baseState:s.baseState,firstBaseUpdate:c,lastBaseUpdate:f,shared:s.shared,callbacks:s.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var Gf=!1;function Go(){if(Gf){var t=Ss;if(t!==null)throw t}}function Vo(t,n,a,s){Gf=!1;var c=t.updateQueue;Ga=!1;var f=c.firstBaseUpdate,v=c.lastBaseUpdate,w=c.shared.pending;if(w!==null){c.shared.pending=null;var B=w,K=B.next;B.next=null,v===null?f=K:v.next=K,v=B;var ot=t.alternate;ot!==null&&(ot=ot.updateQueue,w=ot.lastBaseUpdate,w!==v&&(w===null?ot.firstBaseUpdate=K:w.next=K,ot.lastBaseUpdate=B))}if(f!==null){var yt=c.baseState;v=0,ot=K=B=null,w=f;do{var q=w.lane&-536870913,at=q!==w.lane;if(at?(Ae&q)===q:(s&q)===q){q!==0&&q===zr&&(Gf=!0),ot!==null&&(ot=ot.next={lane:0,tag:w.tag,payload:w.payload,callback:null,next:null});t:{var It=t,Kt=w;q=n;var pe=a;switch(Kt.tag){case 1:if(It=Kt.payload,typeof It=="function"){yt=It.call(pe,yt,q);break t}yt=It;break t;case 3:It.flags=It.flags&-65537|128;case 0:if(It=Kt.payload,q=typeof It=="function"?It.call(pe,yt,q):It,q==null)break t;yt=L({},yt,q);break t;case 2:Ga=!0}}q=w.callback,q!==null&&(t.flags|=64,at&&(t.flags|=8192),at=c.callbacks,at===null?c.callbacks=[q]:at.push(q))}else at={lane:q,tag:w.tag,payload:w.payload,callback:w.callback,next:null},ot===null?(K=ot=at,B=yt):ot=ot.next=at,v|=q;if(w=w.next,w===null){if(w=c.shared.pending,w===null)break;at=w,w=at.next,at.next=null,c.lastBaseUpdate=at,c.shared.pending=null}}while(!0);ot===null&&(B=yt),c.baseState=B,c.firstBaseUpdate=K,c.lastBaseUpdate=ot,f===null&&(c.shared.lanes=0),Qa|=v,t.lanes=v,t.memoizedState=yt}}function Cg(t,n){if(typeof t!="function")throw Error(r(191,t));t.call(n)}function Dg(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)Cg(a[t],n)}var Xa=ne(null),uc=ne(0);function Ng(t,n){t=Sa,Nt(uc,t),Nt(Xa,n),Sa=t|n.baseLanes}function Vf(){Nt(uc,Sa),Nt(Xa,Xa.current)}function jf(){Sa=uc.current,qt(Xa),qt(uc)}var Nn=ne(null),kn=null;function Wa(t){var n=t.alternate;Nt(zn,zn.current&1),Nt(Nn,t),kn===null&&(n===null||Xa.current!==null||n.memoizedState!==null)&&(kn=t)}function Xf(t){Nt(zn,zn.current),Nt(Nn,t),kn===null&&(kn=t)}function zg(t){t.tag===22?(Nt(zn,zn.current),Nt(Nn,t),kn===null&&(kn=t)):Ya()}function Ya(){Nt(zn,zn.current),Nt(Nn,Nn.current)}function li(t){qt(Nn),kn===t&&(kn=null),qt(zn)}var zn=ne(0);function jo(t,n){Nt(Nn,Nn.current),Nt(zn,n)}function Wf(t){qt(zn),qt(Nn),kn===t&&(kn=null)}function fc(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||pd(a)||md(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var _a=0,de=null,Ge=null,fn=null,hc=!1,bs=!1,Ir=!1,dc=0,Xo=0,Ts=null,QS=0;function rn(){throw Error(r(321))}function Yf(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!oi(t[a],n[a]))return!1;return!0}function qf(t,n,a,s,c,f){return _a=f,de=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,Dt.H=t===null||t.memoizedState===null?m_:g_,Ir=!1,f=a(s,c),Ir=!1,bs&&(f=Lg(n,a,s,c)),Ug(t),f}function Ug(t){Dt.H=xc;var n=Ge!==null&&Ge.next!==null;if(_a=0,fn=Ge=de=null,hc=!1,Xo=0,Ts=null,n)throw Error(r(300));t===null||hn||(t=t.dependencies,t!==null&&ic(t)&&(hn=!0))}function Lg(t,n,a,s){de=t;var c=0;do{if(bs&&(Ts=null),Xo=0,bs=!1,25<=c)throw Error(r(301));if(c+=1,fn=Ge=null,t.updateQueue!=null){var f=t.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}Dt.H=rM,f=n(a,s)}while(bs);return f}function JS(){var t=Dt.H,n=t.useState()[0];return n=typeof n.then=="function"?Wo(n):n,t=t.useState()[0],(Ge!==null?Ge.memoizedState:null)!==t&&(de.flags|=1024),n}function Zf(){var t=dc!==0;return dc=0,t}function Kf(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function Qf(t){if(hc){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}hc=!1}_a=0,fn=Ge=de=null,bs=!1,Xo=dc=0,Ts=null}function Xn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return fn===null?de.memoizedState=fn=t:fn=fn.next=t,fn}function ln(){if(Ge===null){var t=de.alternate;t=t!==null?t.memoizedState:null}else t=Ge.next;var n=fn===null?de.memoizedState:fn.next;if(n!==null)fn=n,Ge=t;else{if(t===null)throw de.alternate===null?Error(r(467)):Error(r(310));Ge=t,t={memoizedState:Ge.memoizedState,baseState:Ge.baseState,baseQueue:Ge.baseQueue,queue:Ge.queue,next:null},fn===null?de.memoizedState=fn=t:fn=fn.next=t}return fn}function pc(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Wo(t){var n=Xo;return Xo+=1,Ts===null&&(Ts=[]),t=bg(Ts,t,n),n=de,(fn===null?n.memoizedState:fn.next)===null&&(n=n.alternate,Dt.H=n===null||n.memoizedState===null?m_:g_),t}function mc(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Wo(t);if(t.$$typeof===Y)return;if(t.$$typeof===ft)return Dn(t)}throw Error(r(438,String(t)))}function Jf(t){var n=null,a=de.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var s=de.alternate;s!==null&&(s=s.updateQueue,s!==null&&(s=s.memoCache,s!=null&&(n={data:s.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=pc(),de.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),s=0;s<t;s++)a[s]=he;return n.index++,a}function va(t,n){return typeof n=="function"?n(t):n}function gc(t){var n=ln();return $f(n,Ge,t)}function $f(t,n,a){var s=t.queue;if(s===null)throw Error(r(311));s.lastRenderedReducer=a;var c=t.baseQueue,f=s.pending;if(f!==null){if(c!==null){var v=c.next;c.next=f.next,f.next=v}n.baseQueue=c=f,s.pending=null}if(f=t.baseState,c===null)t.memoizedState=f;else{n=c.next;var w=v=null,B=null,K=n,ot=!1;do{var yt=K.lane&-536870913;if(yt!==K.lane?(Ae&yt)===yt:(_a&yt)===yt){var q=K.revertLane;if(q===0)B!==null&&(B=B.next={lane:0,revertLane:0,gesture:null,action:K.action,hasEagerState:K.hasEagerState,eagerState:K.eagerState,next:null}),yt===zr&&(ot=!0);else if((_a&q)===q){K=K.next,q===zr&&(ot=!0);continue}else yt={lane:0,revertLane:K.revertLane,gesture:null,action:K.action,hasEagerState:K.hasEagerState,eagerState:K.eagerState,next:null},B===null?(w=B=yt,v=f):B=B.next=yt,de.lanes|=q,Qa|=q;yt=K.action,Ir&&a(f,yt),f=K.hasEagerState?K.eagerState:a(f,yt)}else q={lane:yt,revertLane:K.revertLane,gesture:K.gesture,action:K.action,hasEagerState:K.hasEagerState,eagerState:K.eagerState,next:null},B===null?(w=B=q,v=f):B=B.next=q,de.lanes|=yt,Qa|=yt;K=K.next}while(K!==null&&K!==n);if(B===null?v=f:B.next=w,!oi(f,t.memoizedState)&&(hn=!0,ot&&(a=Ss,a!==null)))throw a;t.memoizedState=f,t.baseState=v,t.baseQueue=B,s.lastRenderedState=f}return c===null&&(s.lanes=0),[t.memoizedState,s.dispatch]}function th(t){var n=ln(),a=n.queue;if(a===null)throw Error(r(311));a.lastRenderedReducer=t;var s=a.dispatch,c=a.pending,f=n.memoizedState;if(c!==null){a.pending=null;var v=c=c.next;do f=t(f,v.action),v=v.next;while(v!==c);oi(f,n.memoizedState)||(hn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,s]}function Og(t,n,a){var s=de,c=ln(),f=xe;if(f){if(a===void 0)throw Error(r(407));a=a()}else a=n();var v=!oi((Ge||c).memoizedState,a);if(v&&(c.memoizedState=a,hn=!0),c=c.queue,ih(Bg.bind(null,s,c,t),[t]),t=c.getSnapshot!==n||v||fn!==null&&(fn.memoizedState.tag&1)!==0,ws(t?9:8,{destroy:void 0},Ig.bind(null,s,c,a,n),null),t){if(s.flags|=2048,qe===null)throw Error(r(349));f||(_a&127)!==0||Pg(s,n,a)}return a}function Pg(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=de.updateQueue,n===null?(n=pc(),de.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function Ig(t,n,a,s){n.value=a,n.getSnapshot=s,Fg(n)&&kg(t)}function Bg(t,n,a){return a(function(){Fg(n)&&kg(t)})}function Fg(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!oi(t,a)}catch{return!0}}function kg(t){var n=wr(t,2);n!==null&&ei(n,t,2)}function eh(t){var n=Xn();if(typeof t=="function"){var a=t;if(t=a(),Ir){Mn(!0);try{a()}finally{Mn(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:va,lastRenderedState:t},n}function Hg(t,n,a,s){return t.baseState=a,$f(t,Ge,typeof s=="function"?s:va)}function $S(t,n,a,s,c){if(yc(t))throw Error(r(485));if(t=n.action,t!==null){var f={payload:c,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(v){f.listeners.push(v)}};Dt.T!==null?a(!0):f.isTransition=!1,s(f),a=n.pending,a===null?(f.next=n.pending=f,Gg(n,f)):(f.next=a.next,n.pending=a.next=f)}}function Gg(t,n){var a=n.action,s=n.payload,c=t.state;if(n.isTransition){var f=Dt.T,v={};v.types=f!==null?f.types:null,Dt.T=v;try{var w=a(c,s),B=Dt.S;B!==null&&B(v,w),Vg(t,n,w)}catch(K){nh(t,n,K)}finally{f!==null&&v.types!==null&&(f.types=v.types),Dt.T=f}}else try{f=a(c,s),Vg(t,n,f)}catch(K){nh(t,n,K)}}function Vg(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(s){jg(t,n,s)},function(s){return nh(t,n,s)}):jg(t,n,a)}function jg(t,n,a){n.status="fulfilled",n.value=a,Xg(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,Gg(t,a)))}function nh(t,n,a){var s=t.pending;if(t.pending=null,s!==null){s=s.next;do n.status="rejected",n.reason=a,Xg(n),n=n.next;while(n!==s)}t.action=null}function Xg(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function Wg(t,n){return n}function Yg(t,n){if(xe){var a=qe.formState;if(a!==null){t:{var s=de;if(xe){if(Ke){e:{for(var c=Ke,f=Mi;c.nodeType!==8;){if(!f){c=null;break e}if(c=bi(c.nextSibling),c===null){c=null;break e}}f=c.data,c=f==="F!"||f==="F"?c:null}if(c){Ke=bi(c.nextSibling),s=c.data==="F!";break t}}Fa(s)}s=!1}s&&(n=a[0])}}return a=Xn(),a.memoizedState=a.baseState=n,s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Wg,lastRenderedState:n},a.queue=s,a=h_.bind(null,de,s),s.dispatch=a,s=eh(!1),f=lh.bind(null,de,!1,s.queue),s=Xn(),c={state:n,dispatch:null,action:t,pending:null},s.queue=c,a=$S.bind(null,de,c,f,a),c.dispatch=a,s.memoizedState=t,[n,a,!1]}function qg(t){var n=ln();return Zg(n,Ge,t)}function Zg(t,n,a){if(n=$f(t,n,Wg)[0],t=gc(va)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var s=Wo(n)}catch(v){throw v===Ms?sc:v}else s=n;n=ln();var c=n.queue,f=c.dispatch;return a!==n.memoizedState&&(de.flags|=2048,ws(9,{destroy:void 0},tM.bind(null,c,a),null)),[s,f,t]}function tM(t,n){t.action=n}function Kg(t){var n=ln(),a=Ge;if(a!==null)return Zg(n,a,t);ln(),n=n.memoizedState,a=ln();var s=a.queue.dispatch;return a.memoizedState=t,[n,s,!1]}function ws(t,n,a,s){return t={tag:t,create:a,deps:s,inst:n,next:null},n=de.updateQueue,n===null&&(n=pc(),de.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(s=a.next,a.next=t,t.next=s,n.lastEffect=t),t}function Qg(){return ln().memoizedState}function _c(t,n,a,s){var c=Xn();de.flags|=t,c.memoizedState=ws(1|n,{destroy:void 0},a,s===void 0?null:s)}function vc(t,n,a,s){var c=ln();s=s===void 0?null:s;var f=c.memoizedState.inst;Ge!==null&&s!==null&&Yf(s,Ge.memoizedState.deps)?c.memoizedState=ws(n,f,a,s):(de.flags|=t,c.memoizedState=ws(1|n,f,a,s))}function Jg(t,n){_c(8390656,8,t,n)}function ih(t,n){vc(2048,8,t,n)}function eM(t){de.flags|=4;var n=de.updateQueue;if(n===null)n=pc(),de.updateQueue=n,n.events=[t];else{var a=n.events;a===null?n.events=[t]:a.push(t)}}function $g(t){var n=ln().memoizedState;return eM({ref:n,nextImpl:t}),function(){if((Ie&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}function t_(t,n){return vc(4,2,t,n)}function e_(t,n){return vc(4,4,t,n)}function n_(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function i_(t,n,a){a=a!=null?a.concat([t]):null,vc(4,4,n_.bind(null,n,t),a)}function ah(){}function a_(t,n){var a=ln();n=n===void 0?null:n;var s=a.memoizedState;return n!==null&&Yf(n,s[1])?s[0]:(a.memoizedState=[t,n],t)}function r_(t,n){var a=ln();n=n===void 0?null:n;var s=a.memoizedState;if(n!==null&&Yf(n,s[1]))return s[0];if(s=t(),Ir){Mn(!0);try{t()}finally{Mn(!1)}}return a.memoizedState=[s,n],s}function rh(t,n,a){return a===void 0||(_a&1073741824)!==0&&(Ae&261930)===0?t.memoizedState=n:(t.memoizedState=a,t=m0(),de.lanes|=t,Qa|=t,a)}function s_(t,n,a,s){return oi(a,n)?a:Xa.current!==null?(t=rh(t,a,s),oi(t,n)||(hn=!0),t):(_a&106)===0||(_a&1073741824)!==0&&(Ae&261930)===0?(hn=!0,t.memoizedState=a):(t=m0(),de.lanes|=t,Qa|=t,n)}function o_(t,n,a,s,c){var f=zt.p;zt.p=f!==0&&8>f?f:8;var v=Dt.T,w={};w.types=v!==null?v.types:null,Dt.T=w,lh(t,!1,n,a);try{var B=c(),K=Dt.S;if(K!==null&&K(w,B),B!==null&&typeof B=="object"&&typeof B.then=="function"){var ot=KS(B,s);Yo(t,n,ot,hi(t))}else Yo(t,n,s,hi(t))}catch(yt){Yo(t,n,{then:function(){},status:"rejected",reason:yt},hi())}finally{zt.p=f,v!==null&&w.types!==null&&(v.types=w.types),Dt.T=v}}function nM(){}function sh(t,n,a,s){if(t.tag!==5)throw Error(r(476));var c=l_(t).queue;o_(t,c,n,se,a===null?nM:function(){return c_(t),a(s)})}function l_(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:se,baseState:se,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:va,lastRenderedState:se},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:va,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function c_(t){var n=l_(t);n.next===null&&(n=t.alternate.memoizedState),Yo(t,n.next.queue,{},hi())}function oh(){return Dn(Xs)}function u_(){return ln().memoizedState}function f_(){return ln().memoizedState}function iM(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=hi();t=Va(a);var s=ja(n,t,a);s!==null&&(ei(s,n,a),Ho(s,n,a)),n={cache:Of()},t.payload=n;return}n=n.return}}function aM(t,n,a){var s=hi();a={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},yc(t)?d_(n,a):(a=wf(t,n,a,s),a!==null&&(ei(a,t,s),p_(a,n,s)))}function h_(t,n,a){var s=hi();Yo(t,n,a,s)}function Yo(t,n,a,s){var c={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(yc(t))d_(n,c);else{var f=t.alternate;if(t.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var v=n.lastRenderedState,w=f(v,a);if(c.hasEagerState=!0,c.eagerState=w,oi(w,v))return Kl(t,n,c,0),qe===null&&Zl(),!1}catch{}finally{}if(a=wf(t,n,c,s),a!==null)return ei(a,t,s),p_(a,n,s),!0}return!1}function lh(t,n,a,s){if(s={lane:2,revertLane:Jh(),gesture:null,action:s,hasEagerState:!1,eagerState:null,next:null},yc(t)){if(n)throw Error(r(479))}else n=wf(t,a,s,2),n!==null&&ei(n,t,2)}function yc(t){var n=t.alternate;return t===de||n!==null&&n===de}function d_(t,n){bs=hc=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function p_(t,n,a){if((a&4194048)!==0){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,N(t,a)}}var xc={readContext:Dn,use:mc,useCallback:rn,useContext:rn,useEffect:rn,useImperativeHandle:rn,useLayoutEffect:rn,useInsertionEffect:rn,useMemo:rn,useReducer:rn,useRef:rn,useState:rn,useDebugValue:rn,useDeferredValue:rn,useTransition:rn,useSyncExternalStore:rn,useId:rn,useHostTransitionStatus:rn,useFormState:rn,useActionState:rn,useOptimistic:rn,useMemoCache:rn,useCacheRefresh:rn,useEffectEvent:rn},m_={readContext:Dn,use:mc,useCallback:function(t,n){return Xn().memoizedState=[t,n===void 0?null:n],t},useContext:Dn,useEffect:Jg,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,_c(4194308,4,n_.bind(null,n,t),a)},useLayoutEffect:function(t,n){return _c(4194308,4,t,n)},useInsertionEffect:function(t,n){_c(4,2,t,n)},useMemo:function(t,n){var a=Xn();n=n===void 0?null:n;var s=t();if(Ir){Mn(!0);try{t()}finally{Mn(!1)}}return a.memoizedState=[s,n],s},useReducer:function(t,n,a){var s=Xn();if(a!==void 0){var c=a(n);if(Ir){Mn(!0);try{a(n)}finally{Mn(!1)}}}else c=n;return s.memoizedState=s.baseState=c,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:c},s.queue=t,t=t.dispatch=aM.bind(null,de,t),[s.memoizedState,t]},useRef:function(t){var n=Xn();return t={current:t},n.memoizedState=t},useState:function(t){t=eh(t);var n=t.queue,a=h_.bind(null,de,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:ah,useDeferredValue:function(t,n){var a=Xn();return rh(a,t,n)},useTransition:function(){var t=eh(!1);return t=o_.bind(null,de,t.queue,!0,!1),Xn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var s=de,c=Xn();if(xe){if(a===void 0)throw Error(r(407));a=a()}else{if(a=n(),qe===null)throw Error(r(349));(Ae&127)!==0||Pg(s,n,a)}c.memoizedState=a;var f={value:a,getSnapshot:n};return c.queue=f,Jg(Bg.bind(null,s,f,t),[t]),s.flags|=2048,ws(9,{destroy:void 0},Ig.bind(null,s,f,a,n),null),a},useId:function(){var t=Xn(),n=qe.identifierPrefix;if(xe){var a=Xi,s=ji;a=(s&~(1<<32-Bn(s)-1)).toString(32)+a,n="_"+n+"R_"+a,a=dc++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=QS++,n="_"+n+"r_"+a.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:oh,useFormState:Yg,useActionState:Yg,useOptimistic:function(t){var n=Xn();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=lh.bind(null,de,!0,a),a.dispatch=n,[t,n]},useMemoCache:Jf,useCacheRefresh:function(){return Xn().memoizedState=iM.bind(null,de)},useEffectEvent:function(t){var n=Xn(),a={impl:t};return n.memoizedState=a,function(){if((Ie&2)!==0)throw Error(r(440));return a.impl.apply(void 0,arguments)}}},g_={readContext:Dn,use:mc,useCallback:a_,useContext:Dn,useEffect:ih,useImperativeHandle:i_,useInsertionEffect:t_,useLayoutEffect:e_,useMemo:r_,useReducer:gc,useRef:Qg,useState:function(){return gc(va)},useDebugValue:ah,useDeferredValue:function(t,n){var a=ln();return s_(a,Ge.memoizedState,t,n)},useTransition:function(){var t=gc(va)[0],n=ln().memoizedState;return[typeof t=="boolean"?t:Wo(t),n]},useSyncExternalStore:Og,useId:u_,useHostTransitionStatus:oh,useFormState:qg,useActionState:qg,useOptimistic:function(t,n){var a=ln();return Hg(a,Ge,t,n)},useMemoCache:Jf,useCacheRefresh:f_,useEffectEvent:$g},rM={readContext:Dn,use:mc,useCallback:a_,useContext:Dn,useEffect:ih,useImperativeHandle:i_,useInsertionEffect:t_,useLayoutEffect:e_,useMemo:r_,useReducer:th,useRef:Qg,useState:function(){return th(va)},useDebugValue:ah,useDeferredValue:function(t,n){var a=ln();return Ge===null?rh(a,t,n):s_(a,Ge.memoizedState,t,n)},useTransition:function(){var t=th(va)[0],n=ln().memoizedState;return[typeof t=="boolean"?t:Wo(t),n]},useSyncExternalStore:Og,useId:u_,useHostTransitionStatus:oh,useFormState:Kg,useActionState:Kg,useOptimistic:function(t,n){var a=ln();return Ge!==null?Hg(a,Ge,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:Jf,useCacheRefresh:f_,useEffectEvent:$g};function ch(t,n,a,s){n=t.memoizedState,a=a(s,n),a=a==null?n:L({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var uh={enqueueSetState:function(t,n,a){t=t._reactInternals;var s=hi(),c=Va(s);c.payload=n,a!=null&&(c.callback=a),n=ja(t,c,s),n!==null&&(ei(n,t,s),Ho(n,t,s))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var s=hi(),c=Va(s);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=ja(t,c,s),n!==null&&(ei(n,t,s),Ho(n,t,s))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=hi(),s=Va(a);s.tag=2,n!=null&&(s.callback=n),n=ja(t,s,a),n!==null&&(ei(n,t,a),Ho(n,t,a))}};function __(t,n,a,s,c,f,v){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(s,f,v):n.prototype&&n.prototype.isPureReactComponent?!Uo(a,s)||!Uo(c,f):!0}function v_(t,n,a,s){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,s),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,s),n.state!==t&&uh.enqueueReplaceState(n,n.state,null)}function Br(t,n){var a=n;if("ref"in n){a={};for(var s in n)s!=="ref"&&(a[s]=n[s])}if(t=t.defaultProps){a===n&&(a=L({},a));for(var c in t)a[c]===void 0&&(a[c]=t[c])}return a}function y_(t){ql(t)}function x_(t){console.error(t)}function S_(t){ql(t)}function Sc(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(s){setTimeout(function(){throw s})}}function M_(t,n,a){try{var s=t.onCaughtError;s(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function fh(t,n,a){return a=Va(a),a.tag=3,a.payload={element:null},a.callback=function(){Sc(t,n)},a}function E_(t){return t=Va(t),t.tag=3,t}function b_(t,n,a,s){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var f=s.value;t.payload=function(){return c(f)},t.callback=function(){M_(n,a,s)}}var v=a.stateNode;v!==null&&typeof v.componentDidCatch=="function"&&(t.callback=function(){M_(n,a,s),typeof c!="function"&&(Ja===null?Ja=new Set([this]):Ja.add(this));var w=s.stack;this.componentDidCatch(s.value,{componentStack:w!==null?w:""})})}function sM(t,n,a,s,c){if(a.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){if(n=a.alternate,n!==null&&Dr(n,a,c,!0),a=Nn.current,a!==null){switch(a.tag){case 31:case 13:case 19:return kn===null?Gc():a.alternate===null&&sn===0&&(sn=3),a.flags&=-257,a.flags|=65536,a.lanes=c,s===oc?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([s]):n.add(s),Zh(t,s,c)),!1;case 22:return a.flags|=65536,s===oc?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([s])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([s]):a.add(s)),Zh(t,s,c)),!1}throw Error(r(435,a.tag))}return Zh(t,s,c),Gc(),!1}if(xe)return n=Nn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,s!==Nf&&(t=Error(r(422),{cause:s}),Po(yi(t,a)))):(s!==Nf&&(n=Error(r(423),{cause:s}),Po(yi(n,a))),t=t.current.alternate,t.flags|=65536,c&=-c,t.lanes|=c,s=yi(s,a),c=fh(t.stateNode,s,c),Hf(t,c),sn!==4&&(sn=2)),!1;var f=Error(r(520),{cause:s});if(f=yi(f,a),el===null?el=[f]:el.push(f),sn!==4&&(sn=2),n===null)return!0;s=yi(s,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=c&-c,a.lanes|=t,t=fh(a.stateNode,s,t),Hf(a,t),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(Ja===null||!Ja.has(f))))return a.flags|=65536,c&=-c,a.lanes|=c,c=E_(c),b_(c,t,a,s),Hf(a,c),!1;break;case 22:if(a.memoizedState!==null)return a.flags|=65536,!1}a=a.return}while(a!==null);return!1}var hh=Error(r(461)),hn=!1;function gn(t,n,a,s){n.child=t===null?Rg(n,null,a,s):Pr(n,t.child,a,s)}function T_(t,n,a,s,c){a=a.render;var f=n.ref;if("ref"in s){var v={};for(var w in s)w!=="ref"&&(v[w]=s[w])}else v=s;return Nr(n),s=qf(t,n,a,v,f,c),w=Zf(),t!==null&&!hn?(Kf(t,n,c),ya(t,n,c)):(xe&&w&&tc(n),n.flags|=1,gn(t,n,s,c),n.child)}function w_(t,n,a,s,c){if(t===null){var f=a.type;return typeof f=="function"&&!Af(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,A_(t,n,f,s,c)):(t=Jl(a.type,null,s,n,n.mode,c),t.ref=n.ref,t.return=n,n.child=t)}if(f=t.child,!xh(t,c)){var v=f.memoizedProps;if(a=a.compare,a=a!==null?a:Uo,a(v,s)&&t.ref===n.ref)return ya(t,n,c)}return n.flags|=1,t=da(f,s),t.ref=n.ref,t.return=n,n.child=t}function A_(t,n,a,s,c){if(t!==null){var f=t.memoizedProps;if(Uo(f,s)&&t.ref===n.ref)if(hn=!1,n.pendingProps=s=f,xh(t,c))(t.flags&131072)!==0&&(hn=!0);else return n.lanes=t.lanes,ya(t,n,c)}return dh(t,n,a,s,c)}function R_(t,n,a,s){var c=s.children,f=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),s.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,t!==null){for(s=n.child=t.child,c=0;s!==null;)c=c|s.lanes|s.childLanes,s=s.sibling;s=c&~f}else s=0,n.child=null;return C_(t,n,f,a,s)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&rc(n,f!==null?f.cachePool:null),f!==null?Ng(n,f):Vf(),zg(n);else return s=n.lanes=536870912,C_(t,n,f!==null?f.baseLanes|a:a,a,s)}else f!==null?(rc(n,f.cachePool),Ng(n,f),Ya(),n.memoizedState=null):(t!==null&&rc(n,null),Vf(),Ya());return gn(t,n,c,a),n.child}function qo(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function C_(t,n,a,s,c){var f=If();return f=f===null?null:{parent:un._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},t!==null&&rc(n,null),Vf(),zg(n),t!==null&&Dr(t,n,s,!0),n.childLanes=c,null}function Mc(t,n){return n=Ec({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function D_(t,n,a){return Pr(n,t.child,null,a),t=Mc(n,n.pendingProps),t.flags|=2,li(n),n.memoizedState=null,t}function oM(t,n,a){var s=n.pendingProps,c=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(xe){if(s.mode==="hidden")return t=Mc(n,s),n.lanes=536870912,t.memoizedState={baseLanes:0,cachePool:null},qo(null,t);if(Xf(n),(t=Ke)?(t=nv(t,Mi),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Ia!==null?{id:ji,overflow:Xi}:null,retryLane:536870912,hydrationErrors:null},a=dg(t),a.return=n,n.child=a,bn=n,Ke=null)):t=null,t===null)throw Fa(n);return n.lanes=536870912,null}return Mc(n,s)}var f=t.memoizedState;if(f!==null){var v=f.dehydrated;if(Xf(n),c)if(n.flags&256)n.flags&=-257,n=D_(t,n,a);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(r(558));else if(hn||Dr(t,n,a,!1),c=(a&t.childLanes)!==0,hn||c){if(Xa.current===null){if(s=qe,s!==null&&(v=Q(s,a),v!==0&&v!==f.retryLane))throw f.retryLane=v,wr(t,v),ei(s,t,v),hh;Gc()}n=D_(t,n,a)}else t=f.treeContext,Ke=bi(v.nextSibling),bn=n,xe=!0,Ba=null,Mi=!1,t!==null&&gg(n,t),n=Mc(n,s),n.flags|=134221824;return n}return t=da(t.child,{mode:s.mode,children:s.children}),t.ref=n.ref,n.child=t,t.return=n,t}function As(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(r(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function dh(t,n,a,s,c){return Nr(n),a=qf(t,n,a,s,void 0,c),s=Zf(),t!==null&&!hn?(Kf(t,n,c),ya(t,n,c)):(xe&&s&&tc(n),n.flags|=1,gn(t,n,a,c),n.child)}function N_(t,n,a,s,c,f){return Nr(n),n.updateQueue=null,a=Lg(n,s,a,c),Ug(t),s=Zf(),t!==null&&!hn?(Kf(t,n,f),ya(t,n,f)):(xe&&s&&tc(n),n.flags|=1,gn(t,n,a,f),n.child)}function z_(t,n,a,s,c){if(Nr(n),n.stateNode===null){var f=_s,v=a.contextType;typeof v=="object"&&v!==null&&(f=Dn(v)),f=new a(s,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=uh,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=s,f.state=n.memoizedState,f.refs={},Ff(n),v=a.contextType,f.context=typeof v=="object"&&v!==null?Dn(v):_s,f.state=n.memoizedState,v=a.getDerivedStateFromProps,typeof v=="function"&&(ch(n,a,v,s),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(v=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),v!==f.state&&uh.enqueueReplaceState(f,f.state,null),Vo(n,s,f,c),Go(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!0}else if(t===null){f=n.stateNode;var w=n.memoizedProps,B=Br(a,w);f.props=B;var K=f.context,ot=a.contextType;v=_s,typeof ot=="object"&&ot!==null&&(v=Dn(ot));var yt=a.getDerivedStateFromProps;ot=typeof yt=="function"||typeof f.getSnapshotBeforeUpdate=="function",w=n.pendingProps!==w,ot||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(w||K!==v)&&v_(n,f,s,v),Ga=!1;var q=n.memoizedState;f.state=q,Vo(n,s,f,c),Go(),K=n.memoizedState,w||q!==K||Ga?(typeof yt=="function"&&(ch(n,a,yt,s),K=n.memoizedState),(B=Ga||__(n,a,B,s,q,K,v))?(ot||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=s,n.memoizedState=K),f.props=s,f.state=K,f.context=v,s=B):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!1)}else{f=n.stateNode,kf(t,n),v=n.memoizedProps,ot=Br(a,v),f.props=ot,yt=n.pendingProps,q=f.context,K=a.contextType,B=_s,typeof K=="object"&&K!==null&&(B=Dn(K)),w=a.getDerivedStateFromProps,(K=typeof w=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(v!==yt||q!==B)&&v_(n,f,s,B),Ga=!1,q=n.memoizedState,f.state=q,Vo(n,s,f,c),Go();var at=n.memoizedState;v!==yt||q!==at||Ga||t!==null&&t.dependencies!==null&&ic(t.dependencies)?(typeof w=="function"&&(ch(n,a,w,s),at=n.memoizedState),(ot=Ga||__(n,a,ot,s,q,at,B)||t!==null&&t.dependencies!==null&&ic(t.dependencies))?(K||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(s,at,B),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(s,at,B)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||v===t.memoizedProps&&q===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||v===t.memoizedProps&&q===t.memoizedState||(n.flags|=1024),n.memoizedProps=s,n.memoizedState=at),f.props=s,f.state=at,f.context=B,s=ot):(typeof f.componentDidUpdate!="function"||v===t.memoizedProps&&q===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||v===t.memoizedProps&&q===t.memoizedState||(n.flags|=1024),s=!1)}return f=s,As(t,n),s=(n.flags&128)!==0,f||s?(f=n.stateNode,a=s&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,t!==null&&s?(n.child=Pr(n,t.child,null,c),n.child=Pr(n,null,a,c)):gn(t,n,a,c),n.memoizedState=f.state,t=n.child):t=ya(t,n,c),t}function U_(t,n,a,s){return Rr(),n.flags|=256,gn(t,n,a,s),n.child}var ph={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function mh(t){return{baseLanes:t,cachePool:Mg()}}function gh(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=fi),t}function L_(t,n,a){var s=n.pendingProps,c=!1,f=(n.flags&128)!==0,v;if((v=f)||(v=t!==null&&t.memoizedState===null?!1:(zn.current&2)!==0),v&&(c=!0,n.flags&=-129),v=(n.flags&32)!==0,n.flags&=-33,t===null){if(xe){if(c?Wa(n):Ya(),(t=Ke)?(t=nv(t,Mi),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Ia!==null?{id:ji,overflow:Xi}:null,retryLane:536870912,hydrationErrors:null},a=dg(t),a.return=n,n.child=a,bn=n,Ke=null)):t=null,t===null)throw Fa(n);return md(t)?n.lanes=32:n.lanes=536870912,null}return f=s.children,s=s.fallback,c?(Ya(),c=n.mode,f=Ec({mode:"hidden",children:f},c),s=Ar(s,c,a,null),f.return=n,s.return=n,f.sibling=s,n.child=f,s=n.child,s.memoizedState=mh(a),s.childLanes=gh(t,v,a),n.memoizedState=ph,qo(null,s)):(Wa(n),_h(n,f))}var w=t.memoizedState;if(w!==null){var B=w.dehydrated;if(B!==null)return lM(t,n,f,v,s,B,w,a)}return c?(Ya(),c=s.fallback,f=n.mode,w=t.child,B=w.sibling,s=da(w,{mode:"hidden",children:s.children}),s.subtreeFlags=w.subtreeFlags&1206910976,B!==null?c=da(B,c):(c=Ar(c,f,a,null),c.flags|=2),c.return=n,s.return=n,s.sibling=c,n.child=s,qo(null,s),s=n.child,c=t.child.memoizedState,c===null?c=mh(a):(f=c.cachePool,f!==null?(w=un._currentValue,f=f.parent!==w?{parent:w,pool:w}:f):f=Mg(),c={baseLanes:c.baseLanes|a,cachePool:f}),s.memoizedState=c,s.childLanes=gh(t,v,a),n.memoizedState=ph,qo(t.child,s)):(Wa(n),a=t.child,t=a.sibling,a=da(a,{mode:"visible",children:s.children}),a.return=n,a.sibling=null,t!==null&&(v=n.deletions,v===null?(n.deletions=[t],n.flags|=16):v.push(t)),n.child=a,n.memoizedState=null,a)}function _h(t,n){return n=Ec({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function Ec(t,n){return t=Qn(22,t,null,n),t.lanes=0,t}function bc(t,n,a){return Pr(n,t.child,null,a),t=_h(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function lM(t,n,a,s,c,f,v,w){if(a)return n.flags&256?(Wa(n),n.flags&=-257,bc(t,n,w)):n.memoizedState!==null?(Ya(),n.child=t.child,n.flags|=128,null):(Ya(),f=c.fallback,v=n.mode,c=Ec({mode:"visible",children:c.children},v),f=Ar(f,v,w,null),f.flags|=2,c.return=n,f.return=n,c.sibling=f,n.child=c,Pr(n,t.child,null,w),c=n.child,c.memoizedState=mh(w),c.childLanes=gh(t,s,w),n.memoizedState=ph,qo(null,c));if(Wa(n),md(f)){if(s=f.nextSibling&&f.nextSibling.dataset,s)var B=s.dgst;return s=B,s!==""&&(c=Error(r(419)),c.stack="",c.digest=s,Po({value:c,source:null,stack:null})),bc(t,n,w)}if(hn||Dr(t,n,w,!1),s=(w&t.childLanes)!==0,hn||s){if(Xa.current!==null)return bc(t,n,w);if(s=qe,s!==null&&(c=Q(s,w),c!==0&&c!==v.retryLane))throw v.retryLane=c,wr(t,c),ei(s,t,c),hh;return pd(f)||Gc(),bc(t,n,w)}return pd(f)?(n.flags|=192,n.child=t.child,null):(t=v.treeContext,Ke=bi(f.nextSibling),bn=n,xe=!0,Ba=null,Mi=!1,t!==null&&gg(n,t),n=_h(n,c.children),n.flags|=134221824,n)}function O_(t,n,a){t.lanes|=n;var s=t.alternate;s!==null&&(s.lanes|=n),nc(t.return,n,a)}function P_(t){for(var n=null;t!==null;){var a=t.alternate;a!==null&&fc(a)===null&&(n=t),t=t.sibling}return n}function Tc(t,n,a,s,c,f){var v=t.memoizedState;v===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:s,tail:a,tailMode:c,treeForkCount:f}:(v.isBackwards=n,v.rendering=null,v.renderingStartTime=0,v.last=s,v.tail=a,v.tailMode=c,v.treeForkCount=f)}function vh(t){var n=t.child;for(t.child=null;n!==null;){var a=n.sibling;n.sibling=t.child,t.child=n,n=a}}function yh(t,n,a){var s=n.pendingProps,c=s.revealOrder,f=s.tail;s=s.children;var v=zn.current;if(n.flags&128)return jo(n,v),null;var w=(v&2)!==0;if(w?(v=v&1|2,n.flags|=128):v&=1,jo(n,v),c==="backwards"&&t!==null?(vh(t),gn(t,n,s,a),vh(t)):gn(t,n,s,a),s=xe?Oo:0,!w&&t!==null&&(t.flags&128)!==0)t:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&O_(t,a,n);else if(t.tag===19)O_(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break t;for(;t.sibling===null;){if(t.return===null||t.return===n)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(c){case"backwards":a=P_(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null,vh(n)),Tc(n,!0,c,null,f,s);break;case"unstable_legacy-backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(t=c.alternate,t!==null&&fc(t)===null){n.child=c;break}t=c.sibling,c.sibling=a,a=c,c=t}Tc(n,!0,a,null,f,s);break;case"together":Tc(n,!1,null,null,void 0,s);break;case"independent":n.memoizedState=null;break;default:a=P_(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),Tc(n,!1,c,a,f,s)}return n.child}function I_(t,n,a){var s=n.pendingProps;return ka(n,n.type,s.value),gn(t,n,s.children,a),n.child}function ya(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),Qa|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(Dr(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(r(153));if(n.child!==null){for(t=n.child,a=da(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=da(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function xh(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&ic(t)))}function cM(t,n,a){switch(n.tag){case 3:rt(n,n.stateNode.containerInfo),ka(n,un,t.memoizedState.cache),Rr();break;case 27:case 5:Mt(n);break;case 4:rt(n,n.stateNode.containerInfo);break;case 10:ka(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Xf(n),null;break;case 13:var s=n.memoizedState;if(s!==null){if(s.dehydrated!==null)return Wa(n),n.flags|=128,null;s=Dr(t,n,a,!1);var c=n.child.childLanes;return s||(a&c)!==0?L_(t,n,a):(Wa(n),t=ya(t,n,a),t!==null?t.sibling:null)}Wa(n);break;case 19:if(n.flags&128)return yh(t,n,a);if(c=(t.flags&128)!==0,s=(a&n.childLanes)!==0,s||(Dr(t,n,a,!1),s=(a&n.childLanes)!==0),c){if(s)return yh(t,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),jo(n,zn.current),s)break;return null;case 22:return n.lanes=0,R_(t,n,a,n.pendingProps);case 24:ka(n,un,t.memoizedState.cache)}return ya(t,n,a)}function B_(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)hn=!0;else{if(!xh(t,a)&&(n.flags&128)===0)return hn=!1,cM(t,n,a);hn=(t.flags&131072)!==0}else hn=!1,xe&&(n.flags&1048576)!==0&&mg(n,Oo,n.index);switch(n.lanes=0,n.tag){case 16:t:{var s=n.pendingProps;if(t=Lr(n.elementType),n.type=t,typeof t=="function")Af(t)?(s=Br(t,s),n.tag=1,n=z_(null,n,t,s,a)):(n.tag=0,n=dh(null,n,t,s,a));else{if(t!=null){var c=t.$$typeof;if(c===X){n.tag=11,n=T_(null,n,t,s,a);break t}else if(c===mt){n.tag=14,n=w_(null,n,t,s,a);break t}else if(c===ft){n.tag=10,n.type=t,n=I_(null,n,a);break t}}throw n=Ut(t)||t,Error(r(306,n,""))}}return n;case 0:return dh(t,n,n.type,n.pendingProps,a);case 1:return s=n.type,c=Br(s,n.pendingProps),z_(t,n,s,c,a);case 3:t:{if(rt(n,n.stateNode.containerInfo),t===null)throw Error(r(387));s=n.pendingProps;var f=n.memoizedState;c=f.element,kf(t,n),Vo(n,s,null,a);var v=n.memoizedState;if(s=v.cache,ka(n,un,s),s!==f.cache&&Lf(n,[un],a,!0),Go(),s=v.element,f.isDehydrated)if(f={element:s,isDehydrated:!1,cache:v.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=U_(t,n,s,a);break t}else if(s!==c){c=yi(Error(r(424)),n),Po(c),n=U_(t,n,s,a);break t}else{switch(t=n.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(Ke=bi(t.firstChild),bn=n,xe=!0,Ba=null,Mi=!0,a=Rg(n,null,s,a),n.child=a;a;)a.flags=a.flags&-3|134221824,a=a.sibling}else{if(Rr(),s===c){n=ya(t,n,a);break t}gn(t,n,s,a)}n=n.child}return n;case 26:return As(t,n),t===null?(a=cv(n.type,null,n.pendingProps,null))?n.memoizedState=a:xe||(n.stateNode=G0(n.type,n.pendingProps,O.current,n)):n.memoizedState=cv(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return Mt(n),t===null&&xe&&(s=n.stateNode=rv(n.type,n.pendingProps,O.current),bn=n,Mi=!0,c=Ke,er(n.type)?(gd=c,Ke=bi(s.firstChild)):Ke=c),gn(t,n,n.pendingProps.children,a),As(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&xe&&((c=s=Ke)&&(s=iE(s,n.type,n.pendingProps,Mi),s!==null?(n.stateNode=s,bn=n,Ke=bi(s.firstChild),Mi=!1,c=!0):c=!1),c||Fa(n)),Mt(n),c=n.type,f=n.pendingProps,v=t!==null?t.memoizedProps:null,s=f.children,od(c,f)?s=null:v!==null&&od(c,v)&&(n.flags|=32),n.memoizedState!==null&&(c=qf(t,n,JS,null,null,a),Xs._currentValue=c),As(t,n),gn(t,n,s,a),n.child;case 6:return t===null&&xe&&((t=a=Ke)&&(a=aE(a,n.pendingProps,Mi),a!==null?(n.stateNode=a,bn=n,Ke=null,t=!0):t=!1),t||Fa(n)),null;case 13:return L_(t,n,a);case 4:return rt(n,n.stateNode.containerInfo),s=n.pendingProps,t===null?n.child=Pr(n,null,s,a):gn(t,n,s,a),n.child;case 11:return T_(t,n,n.type,n.pendingProps,a);case 7:return s=n.pendingProps,As(t,n),gn(t,n,s,a),n.child;case 8:return gn(t,n,n.pendingProps.children,a),n.child;case 12:return gn(t,n,n.pendingProps.children,a),n.child;case 10:return I_(t,n,a);case 9:return c=n.type._context,s=n.pendingProps.children,Nr(n),c=Dn(c),s=s(c),n.flags|=1,gn(t,n,s,a),n.child;case 14:return w_(t,n,n.type,n.pendingProps,a);case 15:return A_(t,n,n.type,n.pendingProps,a);case 19:return yh(t,n,a);case 31:return oM(t,n,a);case 22:return R_(t,n,a,n.pendingProps);case 24:return Nr(n),s=Dn(un),t===null?(c=If(),c===null&&(c=qe,f=Of(),c.pooledCache=f,f.refCount++,f!==null&&(c.pooledCacheLanes|=a),c=f),n.memoizedState={parent:s,cache:c},Ff(n),ka(n,un,c)):((t.lanes&a)!==0&&(kf(t,n),Vo(n,null,null,a),Go()),c=t.memoizedState,f=n.memoizedState,c.parent!==s?(c={parent:s,cache:s},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),ka(n,un,s)):(s=f.cache,ka(n,un,s),s!==c.cache&&Lf(n,[un],a,!0))),gn(t,n,n.pendingProps.children,a),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),s=n.pendingProps,s.name!=null&&s.name!=="auto"?n.flags|=t===null?18882560:18874368:xe&&tc(n),t!==null&&t.memoizedProps.name!==s.name?n.flags|=4194816:As(t,n),gn(t,n,s.children,a),n.child;case 29:throw n.pendingProps}throw Error(r(156,n.tag))}function xa(t){t.flags|=4}function Sh(t,n,a,s,c){var f;if((f=(t.mode&32)!==0)&&(f=a===null?dv(n,s):dv(n,s)&&(s.src!==a.src||s.srcSet!==a.srcSet)),f){if(t.flags|=16777216,(c&335544128)===c)if(t.stateNode.complete)t.flags|=8192;else if(y0())t.flags|=8192;else throw Or=oc,Bf}else t.flags&=-16777217}function F_(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!pv(n))if(y0())t.flags|=8192;else throw Or=oc,Bf}function wc(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?Il():536870912,t.lanes|=n,zs|=n)}function Zo(t,n){if(!xe)switch(t.tailMode){case"visible":break;case"collapsed":for(var a=t.tail,s=null;a!==null;)a.alternate!==null&&(s=a),a=a.sibling;s===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:s.sibling=null;break;default:for(n=t.tail,a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null}}function Qe(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,s=0;if(n)for(var c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags&1206910976,s|=c.flags&1206910976,c.return=t,c=c.sibling;else for(c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags,s|=c.flags,c.return=t,c=c.sibling;return t.subtreeFlags|=s,t.childLanes=a,n}function uM(t,n,a){var s=n.pendingProps;switch(Df(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qe(n),null;case 1:return Qe(n),null;case 3:return a=n.stateNode,s=null,t!==null&&(s=t.memoizedState.cache),n.memoizedState.cache!==s&&(n.flags|=2048),ga(un),St(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(xs(n)?xa(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,zf())),Qe(n),null;case 26:var c=n.type,f=n.memoizedState;return t===null?(xa(n),f!==null?(Qe(n),F_(n,f)):(Qe(n),Sh(n,c,null,s,a))):f?f!==t.memoizedState?(xa(n),Qe(n),F_(n,f)):(Qe(n),n.flags&=-16777217):(t=t.memoizedProps,t!==s&&xa(n),Qe(n),Sh(n,c,t,s,a)),null;case 27:if(gt(n),a=O.current,c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==s&&xa(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Qe(n),n.subtreeFlags&=-33554433,null}t=Wt.current,xs(n)?_g(n):(t=rv(c,s,a),n.stateNode=t,xa(n))}return Qe(n),n.subtreeFlags&=-33554433,null;case 5:if(gt(n),c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==s&&xa(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Qe(n),n.subtreeFlags&=-33554433,null}if(f=Wt.current,xs(n))_g(n);else{var v=sl(O.current);switch(f){case 1:f=v.createElementNS("http://www.w3.org/2000/svg",c);break;case 2:f=v.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;default:switch(c){case"svg":f=v.createElementNS("http://www.w3.org/2000/svg",c);break;case"math":f=v.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;case"script":f=v.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof s.is=="string"?v.createElement("select",{is:s.is}):v.createElement("select"),s.multiple?f.multiple=!0:s.size&&(f.size=s.size);break;default:f=typeof s.is=="string"?v.createElement(c,{is:s.is}):v.createElement(c)}}f[Lt]=n,f[Bt]=s;t:for(v=n.child;v!==null;){if(v.tag===5||v.tag===6)f.appendChild(v.stateNode);else if(v.tag!==4&&v.tag!==27&&v.child!==null){v.child.return=v,v=v.child;continue}if(v===n)break t;for(;v.sibling===null;){if(v.return===null||v.return===n)break t;v=v.return}v.sibling.return=v.return,v=v.sibling}n.stateNode=f;t:switch(Ln(f,c,s),c){case"button":case"input":case"select":case"textarea":s=!!s.autoFocus;break t;case"img":s=!0;break t;default:s=!1}s&&xa(n)}}return Qe(n),n.subtreeFlags&=-33554433,Sh(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,a),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==s&&xa(n);else{if(typeof s!="string"&&n.stateNode===null)throw Error(r(166));if(t=O.current,xs(n)){if(t=n.stateNode,a=n.memoizedProps,s=null,c=bn,c!==null)switch(c.tag){case 27:case 5:s=c.memoizedProps}t[Lt]=n,t=!!(t.nodeValue===a||s!==null&&s.suppressHydrationWarning===!0||B0(t.nodeValue,a)),t||Fa(n,!0)}else t=sl(t).createTextNode(s),t[Lt]=n,n.stateNode=t}return Qe(n),null;case 31:if(a=n.memoizedState,t===null||t.memoizedState!==null){if(s=xs(n),a!==null){if(t===null){if(!s)throw Error(r(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(557));t[Lt]=n}else Rr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Qe(n),t=!1}else a=zf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return n.flags&256?(li(n),n):(li(n),null);if((n.flags&128)!==0)throw Error(r(558))}return Qe(n),null;case 13:if(s=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(c=xs(n),s!==null&&s.dehydrated!==null){if(t===null){if(!c)throw Error(r(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(r(317));c[Lt]=n}else Rr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Qe(n),c=!1}else c=zf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(li(n),n):(li(n),null)}return li(n),(n.flags&128)!==0?(n.lanes=a,n):(a=s!==null,t=t!==null&&t.memoizedState!==null,a&&(s=n.child,c=null,s.alternate!==null&&s.alternate.memoizedState!==null&&s.alternate.memoizedState.cachePool!==null&&(c=s.alternate.memoizedState.cachePool.pool),f=null,s.memoizedState!==null&&s.memoizedState.cachePool!==null&&(f=s.memoizedState.cachePool.pool),f!==c&&(s.flags|=2048)),a!==t&&a&&(n.child.flags|=8192),wc(n,n.updateQueue),Qe(n),null);case 4:return St(),t===null&&nd(n.stateNode.containerInfo),n.flags|=67108864,Qe(n),null;case 10:return ga(n.type),Qe(n),null;case 19:if(Wf(n),s=n.memoizedState,s===null)return Qe(n),null;if(c=(n.flags&128)!==0,f=s.rendering,f===null)if(c)Zo(s,!1);else{if(sn!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(f=fc(t),f!==null){for(n.flags|=128,Zo(s,!1),t=f.updateQueue,n.updateQueue=t,wc(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)hg(a,t),a=a.sibling;return jo(n,zn.current&1|2),xe&&pa(n,s.treeForkCount),n.child}t=t.sibling}s.tail!==null&&U()>Bc&&(n.flags|=128,c=!0,Zo(s,!1),n.lanes=4194304)}else{if(!c)if(t=fc(f),t!==null){if(n.flags|=128,c=!0,t=t.updateQueue,n.updateQueue=t,wc(n,t),Zo(s,!0),s.tail===null&&s.tailMode!=="collapsed"&&s.tailMode!=="visible"&&!f.alternate&&!xe)return Qe(n),null}else 2*U()-s.renderingStartTime>Bc&&a!==536870912&&(n.flags|=128,c=!0,Zo(s,!1),n.lanes=4194304);s.isBackwards?(f.sibling=n.child,n.child=f):(t=s.last,t!==null?t.sibling=f:n.child=f,s.last=f)}if(s.tail!==null){t=s.tail;t:{for(a=t;a!==null;){if(a.alternate!==null){a=!1;break t}a=a.sibling}a=!0}return s.rendering=t,s.tail=t.sibling,s.renderingStartTime=U(),t.sibling=null,f=zn.current,f=c?f&1|2:f&1,s.tailMode==="visible"||s.tailMode==="collapsed"||!a||xe?jo(n,f):(a=f,Nt(Nn,n),Nt(zn,a),kn===null&&(kn=n)),xe&&pa(n,s.treeForkCount),t}return Qe(n),null;case 22:case 23:return li(n),jf(),s=n.memoizedState!==null,t!==null?t.memoizedState!==null!==s&&(n.flags|=8192):s&&(n.flags|=8192),s?(a&536870912)!==0&&(n.flags&128)===0&&(Qe(n),n.subtreeFlags&6&&(n.flags|=8192)):Qe(n),a=n.updateQueue,a!==null&&wc(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),s=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(s=n.memoizedState.cachePool.pool),s!==a&&(n.flags|=2048),t!==null&&qt(Ur),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),ga(un),Qe(n),null;case 25:return null;case 30:return n.flags|=33554432,Qe(n),null}throw Error(r(156,n.tag))}function fM(t,n){switch(Df(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return ga(un),St(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return gt(n),null;case 31:if(n.memoizedState!==null){if(li(n),n.alternate===null)throw Error(r(340));Rr()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(li(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(r(340));Rr()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return Wf(n),t=n.flags,t&65536?(n.flags=t&-65537|128,t=n.memoizedState,t!==null&&(t.rendering=null,t.tail=null),n.flags|=4,n):null;case 4:return St(),null;case 10:return ga(n.type),null;case 22:case 23:return li(n),jf(),t!==null&&qt(Ur),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return ga(un),null;case 25:return null;default:return null}}function k_(t,n){switch(Df(n),n.tag){case 3:ga(un),St();break;case 26:case 27:case 5:gt(n);break;case 4:St();break;case 31:n.memoizedState!==null&&li(n);break;case 13:li(n);break;case 19:Wf(n);break;case 10:ga(n.type);break;case 22:case 23:li(n),jf(),t!==null&&qt(Ur);break;case 24:ga(un)}}function Ko(t,n){try{var a=n.updateQueue,s=a!==null?a.lastEffect:null;if(s!==null){var c=s.next;a=c;do{if((a.tag&t)===t){s=void 0;var f=a.create,v=a.inst;s=f(),v.destroy=s}a=a.next}while(a!==c)}}catch(w){ke(n,n.return,w)}}function qa(t,n,a){try{var s=n.updateQueue,c=s!==null?s.lastEffect:null;if(c!==null){var f=c.next;s=f;do{if((s.tag&t)===t){var v=s.inst,w=v.destroy;if(w!==void 0){v.destroy=void 0,c=n;var B=a,K=w;try{K()}catch(ot){ke(c,B,ot)}}}s=s.next}while(s!==f)}}catch(ot){ke(n,n.return,ot)}}function H_(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{Dg(n,a)}catch(s){ke(t,t.return,s)}}}function G_(t,n,a){a.props=Br(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(s){ke(t,n,s)}}function Wi(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var s=t.stateNode;break;case 30:var c=t.stateNode,f=fa(t.memoizedProps,c);(c.ref===null||c.ref.name!==f)&&(c.ref=Z0(f)),s=c.ref;break;case 7:if(t.stateNode===null){var v=new di(t);m(t.child,!1,eE,v,void 0,void 0),t.stateNode=v}s=t.stateNode;break;default:s=t.stateNode}typeof a=="function"?t.refCleanup=a(s):a.current=s}}catch(w){ke(t,n,w)}}function Un(t,n){var a=t.ref,s=t.refCleanup;if(a!==null)if(typeof s=="function")try{s()}catch(c){ke(t,n,c)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){ke(t,n,c)}else a.current=null}function Ac(t,n){if((t.tag===5||t.tag===27||t.tag===6)&&t.alternate===null&&n!==null)for(var a=0;a<n.length;a++)ev(t.stateNode,n[a])}function V_(t){for(var n=t.return;n!==null&&(Eh(n)&&ev(t.stateNode,n.stateNode),!Mh(n));)n=n.return}function Qo(t){for(var n=t.return;n!==null&&(Eh(n)&&nE(t.stateNode,n.stateNode),!Mh(n));)n=n.return}function Mh(t){return t.tag===5||t.tag===3||t.tag===27}function Eh(t){return t&&t.tag===7&&t.stateNode!==null}function bh(t){var n=t.type,a=t.memoizedProps,s=t.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&s.focus();break t;case"img":a.src?s.src=a.src:a.srcSet&&(s.srcset=a.srcSet)}}catch(c){ke(t,t.return,c)}}function Th(t,n,a){try{var s=t.stateNode;IM(s,t.type,a,n),s[Bt]=n}catch(c){ke(t,t.return,c)}}function j_(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&er(t.type)||t.tag===4}function wh(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||j_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&er(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Ah(t,n,a,s){var c=t.tag;if(c===5||c===6)c=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(c,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(c),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Vi)),Ac(t,s),Le=!0;else if(c!==4&&(c===27&&(Ac(t,s),s=null,er(t.type)&&(a=t.stateNode,n=null)),t=t.child,t!==null))for(Ah(t,n,a,s),t=t.sibling;t!==null;)Ah(t,n,a,s),t=t.sibling}function Rc(t,n,a,s){var c=t.tag;if(c===5||c===6)c=t.stateNode,n?a.insertBefore(c,n):a.appendChild(c),Ac(t,s),Le=!0;else if(c!==4&&(c===27&&(Ac(t,s),s=null,er(t.type)&&(a=t.stateNode)),t=t.child,t!==null))for(Rc(t,n,a,s),t=t.sibling;t!==null;)Rc(t,n,a,s),t=t.sibling}function X_(t){var n=t.stateNode,a=t.memoizedProps;try{for(var s=t.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);Ln(n,s,a),n[Lt]=t,n[Bt]=a}catch(f){ke(t,t.return,f)}}var Cc=!1,ci=null;function W_(t){(t.tag===30||(t.subtreeFlags&33554432)!==0)&&(Cc=!0)}var Yi=null;function Y_(){var t=Yi;return Yi=null,t}var Jn=0;function Rs(t,n,a,s,c){return Jn=0,q_(t.child,n,a,s,c)}function q_(t,n,a,s,c){for(var f=!1;t!==null;){if(t.tag===5){var v=t.stateNode;if(s!==null){var w=ud(v);s.push(w),w.view&&(f=!0)}else f||ud(v).view&&(f=!0);Cc=!0,Y0(v,Jn===0?n:n+"_"+Jn,a),Jn++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c||q_(t.child,n,a,s,c)&&(f=!0));t=t.sibling}return f}function qi(t,n){for(;t!==null;)t.tag===5?q0(t.stateNode,t.memoizedProps):(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&n||qi(t.child,n)),t=t.sibling}function Dc(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if((t.tag!==22||t.memoizedState===null)&&(Dc(t),t.tag===30&&(t.flags&18874368)!==0&&t.stateNode.paired)){var n=t.memoizedProps;if(n.name==null||n.name==="auto")throw Error(r(544));var a=n.name;n=ha(n.default,n.share),n!=="none"&&(Rs(t,a,n,null,!1)||qi(t.child,!1))}t=t.sibling}}function Rh(t,n){if(t.tag===30){var a=t.stateNode,s=t.memoizedProps,c=fa(s,a),f=ha(s.default,a.paired?s.share:s.enter);f!=="none"?Rs(t,c,f,null,!1)?(Dc(t),a.paired||n||Ps(t,s.onEnter)):qi(t.child,!1):Dc(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)Rh(t,n),t=t.sibling;else Dc(t)}function Ch(t){if(ci!==null&&ci.size!==0){var n=ci;if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var a=t.memoizedProps,s=a.name;if(s!=null&&s!=="auto"){var c=n.get(s);if(c!==void 0){var f=ha(a.default,a.share);if(f!=="none"&&(Rs(t,s,f,null,!1)?(f=t.stateNode,c.paired=f,f.paired=c,Ps(t,a.onShare)):qi(t.child,!1)),n.delete(s),n.size===0)break}}}Ch(t)}t=t.sibling}}}function Dh(t){if(t.tag===30){var n=t.memoizedProps,a=fa(n,t.stateNode),s=ci!==null?ci.get(a):void 0,c=ha(n.default,s!==void 0?n.share:n.exit);c!=="none"&&(Rs(t,a,c,null,!1)?s!==void 0?(c=t.stateNode,s.paired=c,c.paired=s,ci.delete(a),Ps(t,n.onShare)):Ps(t,n.onExit):qi(t.child,!1)),ci!==null&&Ch(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)Dh(t),t=t.sibling;else ci!==null&&Ch(t)}function Z_(t){for(t=t.child;t!==null;){if(t.tag===30){var n=t.memoizedProps,a=fa(n,t.stateNode);n=ha(n.default,n.update),t.flags&=-5,n!=="none"&&Rs(t,a,n,t.memoizedState=[],!1)}else(t.subtreeFlags&33554432)!==0&&Z_(t);t=t.sibling}}function Nh(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var n=t.stateNode;n.paired!==null&&(n.paired=null,qi(t.child,!1))}Nh(t)}t=t.sibling}}function Nc(t){if(t.tag===30)t.stateNode.paired=null,qi(t.child,!1),Nh(t);else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)Nc(t),t=t.sibling;else Nh(t)}function K_(t){for(t=t.child;t!==null;)t.tag===30?qi(t.child,!1):(t.subtreeFlags&33554432)!==0&&K_(t),t=t.sibling}function zh(t,n,a,s,c,f,v){for(var w=!1;n!==null;){if(n.tag===5){var B=n.stateNode;if(f!==null&&Jn<f.length){var K=f[Jn],ot=ud(B);(K.view||ot.view)&&(w=!0);var yt;if(yt=(t.flags&4)===0)if(ot.clip)yt=!0;else{yt=K.rect;var q=ot.rect;yt=yt.y!==q.y||yt.x!==q.x||yt.height!==q.height||yt.width!==q.width}yt&&(t.flags|=4),ot.abs?ot=!K.abs:(K=K.rect,ot=ot.rect,ot=K.height!==ot.height||K.width!==ot.width),ot&&(t.flags|=32)}else t.flags|=32;(t.flags&4)!==0&&Y0(B,Jn===0?a:a+"_"+Jn,c),w&&(t.flags&4)!==0||(Yi===null&&(Yi=[]),Yi.push(B,Jn===0?s:s+"_"+Jn,n.memoizedProps)),Jn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&v?t.flags|=n.flags&32:zh(t,n.child,a,s,c,f,v)&&(w=!0));n=n.sibling}return w}function Q_(t,n){for(t=t.child;t!==null;){if(t.tag===30){var a=t.memoizedProps,s=t.stateNode,c=fa(a,s),f=ha(a.default,a.update),v;v=t.memoizedState,t.memoizedState=null,s=t;var w=t.child;Jn=0,c=zh(s,w,c,c,f,v,!1),(t.flags&4)!==0&&c&&Ps(t,a.onUpdate)}else(t.subtreeFlags&33554432)!==0&&Q_(t);t=t.sibling}}var Tn=!1,Be=!1,Zi=!1,Uh=!1,J_=typeof WeakSet=="function"?WeakSet:Set,wn=null,Ki=!1,Jo=!1,zc=!1,Lh=!1;function hM(t,n,a){if(t=t.containerInfo,rd=Ws,t=ng(t),xf(t)){if("selectionStart"in t)var s={start:t.selectionStart,end:t.selectionEnd};else t:{s=(s=t.ownerDocument)&&s.defaultView||window;var c=s.getSelection&&s.getSelection();if(c&&c.rangeCount!==0){s=c.anchorNode;var f=c.anchorOffset,v=c.focusNode;c=c.focusOffset;try{s.nodeType,v.nodeType}catch{s=null;break t}var w=0,B=-1,K=-1,ot=0,yt=0,q=t,at=null;e:for(;;){for(var It;q!==s||f!==0&&q.nodeType!==3||(B=w+f),q!==v||c!==0&&q.nodeType!==3||(K=w+c),q.nodeType===3&&(w+=q.nodeValue.length),(It=q.firstChild)!==null;)at=q,q=It;for(;;){if(q===t)break e;if(at===s&&++ot===f&&(B=w),at===v&&++yt===c&&(K=w),(It=q.nextSibling)!==null)break;q=at,at=q.parentNode}q=It}s=B===-1||K===-1?null:{start:B,end:K}}else s=null}s=s||{start:0,end:0}}else s=null;for(sd={focusedElem:t,selectionRange:s},Ws=!1,a=(a&335544064)===a,wn=n,n=a?9270:1024;wn!==null;){if(t=wn,a&&(s=t.deletions,s!==null))for(f=0;f<s.length;f++)a&&Dh(s[f]);if(t.alternate===null&&(t.flags&2)!==0)a&&W_(t),Uc(a);else{if(t.tag===22){if(s=t.alternate,t.memoizedState!==null){s!==null&&s.memoizedState===null&&a&&Dh(s),Uc(a);continue}else if(s!==null&&s.memoizedState!==null){a&&W_(t),Uc(a);continue}}s=t.child,(t.subtreeFlags&n)!==0&&s!==null?(s.return=t,wn=s):(a&&Z_(t),Uc(a))}}ci=null}function Uc(t){for(;wn!==null;){var n=wn,a=t,s=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((c&1024)!==0&&s!==null){a=void 0,c=s.memoizedProps,s=s.memoizedState;var f=n.stateNode;try{var v=Br(n.type,c);a=f.getSnapshotBeforeUpdate(v,s),f.__reactInternalSnapshotBeforeUpdate=a}catch(w){ke(n,n.return,w)}}break;case 3:if((c&1024)!==0){if(s=n.stateNode.containerInfo,a=s.nodeType,a===9)dd(s);else if(a===1)switch(s.nodeName){case"HEAD":case"HTML":case"BODY":dd(s);break;default:s.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:a&&s!==null&&(a=fa(s.memoizedProps,s.stateNode),c=n.memoizedProps,c=ha(c.default,c.update),c!=="none"&&Rs(s,a,c,s.memoizedState=[],!0));break;default:if((c&1024)!==0)throw Error(r(163))}if(s=n.sibling,s!==null){s.return=n.return,wn=s;break}wn=n.return}}function $_(t,n,a){var s=a.flags;switch(a.tag){case 0:case 11:case 15:Qi(t,a),s&4&&Ko(5,a);break;case 1:if(Qi(t,a),s&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(v){ke(a,a.return,v)}else{var c=Br(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(c,n,t.__reactInternalSnapshotBeforeUpdate)}catch(v){ke(a,a.return,v)}}s&64&&H_(a),s&512&&Wi(a,a.return);break;case 3:if(Qi(t,a),s&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Dg(t,n)}catch(v){ke(a,a.return,v)}}break;case 27:n===null&&s&4&&X_(a);case 26:case 5:Qi(t,a),n===null&&s&4&&bh(a),s&512&&Wi(a,a.return);break;case 12:Qi(t,a);break;case 31:Qi(t,a),s&4&&i0(t,a);break;case 13:Qi(t,a),s&4&&a0(t,a),s&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=bM.bind(null,a),rE(t,a))));break;case 22:if(s=a.memoizedState!==null||Tn,!s){var f=n!==null&&n.memoizedState!==null||Be;n=Tn,c=Be,Tn=s,(Be=f)&&!c?(s=2,(a.subtreeFlags&8772)!==0&&(s|=1),Ui(t,a,s)):Qi(t,a),Tn=n,Be=c}break;case 30:Qi(t,a),s&512&&Wi(a,a.return);break;case 7:s&512&&Wi(a,a.return);default:Qi(t,a)}}function Oh(t,n){for(t=t.child;t!==null;)t0(t,n),t=t.sibling}function t0(t,n){switch(t.tag){case 5:case 26:try{var a=t.stateNode;if(n){var s=a.style;typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"}else{var c=t.stateNode,f=t.memoizedProps.style,v=f!=null&&f.hasOwnProperty("display")?f.display:null;c.style.display=v==null||typeof v=="boolean"?"":(""+v).trim()}}catch(B){ke(t,t.return,B)}Ph(t,n);break;case 6:try{t.stateNode.nodeValue=n?"":t.memoizedProps,Le=!0}catch(B){ke(t,t.return,B)}break;case 18:try{var w=t.stateNode;n?W0(w,!0):W0(t.stateNode,!1)}catch(B){ke(t,t.return,B)}break;case 22:case 23:t.memoizedState===null&&Oh(t,n);break;default:Oh(t,n)}}function Ph(t,n){if(t.subtreeFlags&67108864)for(t=t.child;t!==null;){t:{var a=t,s=n;switch(a.tag){case 4:t0(a,s);break t;case 22:a.memoizedState===null&&Ph(a,s);break t;default:Ph(a,s)}}t=t.sibling}}function e0(t){var n=t.alternate;n!==null&&(t.alternate=null,e0(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&Se(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var nn=null,$n=!1;function Ni(t,n,a){for(a=a.child;a!==null;)n0(t,n,a),a=a.sibling}function n0(t,n,a){if(Je&&typeof Je.onCommitFiberUnmount=="function")try{Je.onCommitFiberUnmount(Ce,a)}catch{}switch(a.tag){case 26:Be||Un(a,n),Ni(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&!Be&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Be||Un(a,n),Qo(a);var s=nn,c=$n;er(a.type)&&(nn=a.stateNode,$n=!1),Ni(t,n,a),sv(a.stateNode,a.type,a.memoizedProps),nn=s,$n=c;break;case 5:Be||Un(a,n),Qo(a);case 6:if(a.tag===6&&Qo(a),s=nn,c=$n,nn=null,Ni(t,n,a),nn=s,$n=c,nn!==null)if($n)try{(nn.nodeType===9?nn.body:nn.nodeName==="HTML"?nn.ownerDocument.body:nn).removeChild(a.stateNode),Le=!0}catch(f){ke(a,n,f)}else try{nn.removeChild(a.stateNode),Le=!0}catch(f){ke(a,n,f)}break;case 18:nn!==null&&($n?(t=nn,X0(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),Ys(t)):X0(nn,a.stateNode));break;case 4:s=nn,c=$n,nn=a.stateNode.containerInfo,$n=!0,Ni(t,n,a),nn=s,$n=c;break;case 0:case 11:case 14:case 15:qa(2,a,n),Be||qa(4,a,n),Ni(t,n,a);break;case 1:Be||(Un(a,n),s=a.stateNode,typeof s.componentWillUnmount=="function"&&G_(a,n,s)),Ni(t,n,a);break;case 21:Ni(t,n,a);break;case 22:Be=(s=Be)||a.memoizedState!==null,Ni(t,n,a),Be=s;break;case 30:Un(a,n),Ni(t,n,a);break;case 7:Be||Un(a,n),Ni(t,n,a);break;default:Ni(t,n,a)}}function i0(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Ys(t)}catch(a){ke(n,n.return,a)}}}function a0(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Ys(t)}catch(a){ke(n,n.return,a)}}function dM(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new J_),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new J_),n;default:throw Error(r(435,t.tag))}}function Lc(t,n){var a=dM(t);n.forEach(function(s){if(!a.has(s)){a.add(s);var c=TM.bind(null,t,s);s.then(c,c)}})}function Wn(t,n,a){var s=n.deletions;if(s!==null)for(var c=0;c<s.length;c++){var f=s[c],v=t,w=n,B=w;t:for(;B!==null;){switch(B.tag){case 27:if(er(B.type)){nn=B.stateNode,$n=!1;break t}break;case 5:nn=B.stateNode,$n=!1;break t;case 3:case 4:nn=B.stateNode.containerInfo,$n=!0;break t}B=B.return}if(nn===null)throw Error(r(160));n0(v,w,f),nn=null,$n=!1,v=f.alternate,v!==null&&(v.return=null),f.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)r0(n,t,a),n=n.sibling}var zi=null;function r0(t,n,a){var s=t.alternate,c=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(c&4&&(s=t.updateQueue,s=s!==null?s.events:null,s!==null))for(var f=0;f<s.length;f++){var v=s[f];v.ref.impl=v.nextImpl}Wn(n,t,a),Yn(t),c&4&&(qa(3,t,t.return),Ko(3,t),qa(5,t,t.return));break;case 1:Wn(n,t,a),Yn(t),c&512&&(Be||s===null||Un(s,s.return)),c&64&&Tn&&(t=t.updateQueue,t!==null&&(n=t.callbacks,n!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?n:a.concat(n))));break;case 26:if(f=zi,Wn(n,t,a),Yn(t),c&512&&(Be||s===null||Un(s,s.return)),c&4)if(c=s!==null?s.memoizedState:null,a=t.memoizedState,s===null)if(a===null)if(t.stateNode===null)if(Tn)t.stateNode=G0(t.type,t.memoizedProps,n.containerInfo,t);else{t:{n=t.type,a=t.memoizedProps,c=f.ownerDocument||f;e:switch(n){case"title":s=c.getElementsByTagName("title")[0],(!s||s[Ze]||s[Lt]||s.namespaceURI==="http://www.w3.org/2000/svg"||s.hasAttribute("itemprop"))&&(s=c.createElement(n),c.head.insertBefore(s,c.querySelector("head > title"))),Ln(s,n,a),s[Lt]=t,$e(s),n=s;break t;case"link":if(f=hv("link","href",c).get(n+(a.href||""))){for(v=0;v<f.length;v++)if(s=f[v],s.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&s.getAttribute("rel")===(a.rel==null?null:a.rel)&&s.getAttribute("title")===(a.title==null?null:a.title)&&s.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){f.splice(v,1);break e}}s=c.createElement(n),Ln(s,n,a),c.head.appendChild(s);break;case"meta":if(f=hv("meta","content",c).get(n+(a.content||""))){for(v=0;v<f.length;v++)if(s=f[v],s.getAttribute("content")===(a.content==null?null:""+a.content)&&s.getAttribute("name")===(a.name==null?null:a.name)&&s.getAttribute("property")===(a.property==null?null:a.property)&&s.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&s.getAttribute("charset")===(a.charSet==null?null:a.charSet)){f.splice(v,1);break e}}s=c.createElement(n),Ln(s,n,a),c.head.appendChild(s);break;default:throw Error(r(468,n))}s[Lt]=t,$e(s),n=s}t.stateNode=n}else Tn||xd(f,t.type,t.stateNode);else t.stateNode=fv(f,a,t.memoizedProps);else c!==a?(c===null?(n=s.stateNode,n===null||Be||n.parentNode.removeChild(n)):c.count--,a===null?Tn||xd(f,t.type,t.stateNode):fv(f,a,t.memoizedProps)):a===null&&t.stateNode!==null&&Th(t,t.memoizedProps,s.memoizedProps);break;case 27:Wn(n,t,a),Yn(t),c&512&&(Be||s===null||Un(s,s.return)),s!==null&&c&4&&Th(t,t.memoizedProps,s.memoizedProps);break;case 5:if(f=Zi,Zi=!1,Wn(n,t,a),Zi=f,Yn(t),c&512&&(Be||s===null||Un(s,s.return)),t.flags&32){n=t.stateNode;try{us(n,""),Le=!0}catch(ot){ke(t,t.return,ot)}}c&4&&t.stateNode!=null&&(n=t.memoizedProps,Th(t,n,s!==null?s.memoizedProps:n)),c&1024&&(Uh=!0);break;case 6:if(Wn(n,t,a),Yn(t),c&4){if(t.stateNode===null)throw Error(r(162));n=t.memoizedProps,a=t.stateNode;try{a.nodeValue=n,Le=!0}catch(ot){ke(t,t.return,ot)}}break;case 3:if(Le=!1,Zc=null,f=zi,zi=ol(n.containerInfo),Wn(n,t,a),zi=f,Yn(t),c&4&&s!==null&&s.memoizedState.isDehydrated)try{Ys(n.containerInfo)}catch(ot){ke(t,t.return,ot)}Uh&&(Uh=!1,s0(t)),Le=!1;break;case 4:c=Zi,Zi=Tn,s=wm(),f=zi,zi=ol(t.stateNode.containerInfo),Wn(n,t,a),Yn(t),zi=f,Le&&Jo&&(zc=!0),Le=s,Zi=c;break;case 12:Wn(n,t,a),Yn(t);break;case 31:Wn(n,t,a),Yn(t),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,Lc(t,n)));break;case 13:Wn(n,t,a),Yn(t),t.child.flags&8192&&t.memoizedState!==null!=(s!==null&&s.memoizedState!==null)&&(Ic=U()),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,Lc(t,n)));break;case 22:f=t.memoizedState!==null,v=s!==null&&s.memoizedState!==null;var w=Tn,B=Be,K=Zi;Tn=w||f,Zi=K||f,Be=B||v,Wn(n,t,a),Be=B,Zi=K,Tn=w,Yn(t),c&8192&&(n=t.stateNode,n._visibility=f?n._visibility&-2:n._visibility|1,!f||s===null||v||Tn||Be||(n=v||Be,a=Tn,s=Be,Tn=f||Tn,Be=n,Za(t,2),Tn=a,Be=s),!f&&Zi||Oh(t,f)),c&4&&(n=t.updateQueue,n!==null&&(a=n.retryQueue,a!==null&&(n.retryQueue=null,Lc(t,a))));break;case 19:Wn(n,t,a),Yn(t),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,Lc(t,n)));break;case 30:c&512&&(Be||s===null||Un(s,s.return)),c=wm(),f=Jo,v=(a&335544064)===a,w=t.memoizedProps,Jo=v&&ha(w.default,w.update)!=="none",Wn(n,t,a),Yn(t),v&&s!==null&&Le&&(t.flags|=4),Jo=f,Le=c;break;case 21:break;case 7:c&512&&(Be||s===null||Un(s,s.return)),s&&s.stateNode!==null&&(s.stateNode._fragmentFiber=t);default:Wn(n,t,a),Yn(t)}}function Yn(t){var n=t.flags;if(n&2){try{for(var a,s=t.return;s!==null;){if(j_(s)){a=s;break}s=s.return}s=null;for(var c=t.return;c!==null;){if(Eh(c)){var f=c.stateNode;s===null?s=[f]:s.push(f)}if(Mh(c))break;c=c.return}var v=s;if(a==null)throw Error(r(160));switch(a.tag){case 27:var w=a.stateNode,B=wh(t);Rc(t,B,w,v);break;case 5:var K=a.stateNode;a.flags&32&&(us(K,""),a.flags&=-33);var ot=wh(t);Rc(t,ot,K,v);break;case 3:case 4:var yt=a.stateNode.containerInfo,q=wh(t);Ah(t,q,yt,v);break;default:throw Error(r(161))}}catch(at){ke(t,t.return,at)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function s0(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;s0(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,Ws=!0,n.reset(),Ws=!1),t=t.sibling}}function Cs(t,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)o0(n,t),n=n.sibling;else Q_(n)}function o0(t,n){var a=t.alternate;if(a===null)Rh(t,!1);else switch(t.tag){case 3:if(Lh=Ki=!1,Y_(),Cs(n,t),!Ki&&!zc){if(t=Yi,t!==null)for(var s=0;s<t.length;s+=3){a=t[s];var c=t[s+1];q0(a,t[s+2]),a=a.ownerDocument.documentElement,a!==null&&a.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+c+")"})}t=n.containerInfo,t=t.nodeType===9?t.documentElement:t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName===""&&(t.style.viewTransitionName="none",t.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),t.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Lh=!0}Yi=null;break;case 5:Cs(n,t);break;case 4:s=Ki,Ki=!1,Cs(n,t),Ki&&(zc=!0),Ki=s;break;case 22:t.memoizedState===null&&(a.memoizedState!==null?Rh(t,!1):Cs(n,t));break;case 30:s=Ki,c=Y_(),Ki=!1,Cs(n,t),Ki&&(t.flags|=4);var f=t.memoizedProps,v=t.stateNode;n=fa(f,v),v=fa(a.memoizedProps,v);var w=ha(f.default,f.update);w==="none"?n=!1:(f=a.memoizedState,a.memoizedState=null,a=t.child,Jn=0,n=zh(t,a,n,v,w,f,!0),Jn!==(f===null?0:f.length)&&(t.flags|=32)),(t.flags&4)!==0&&n?(Ps(t,t.memoizedProps.onUpdate),Yi=c):c!==null&&(c.push.apply(c,Yi),Yi=c),Ki=(t.flags&32)!==0?!0:s;break;default:Cs(n,t)}}function Qi(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)$_(t,n.alternate,n),n=n.sibling}function Za(t,n){for(t=t.child;t!==null;){var a=t,s=n;switch(a.tag){case 0:case 11:case 14:case 15:qa(4,a,a.return),Za(a,s);break;case 1:Un(a,a.return);var c=a.stateNode;typeof c.componentWillUnmount=="function"&&G_(a,a.return,c),Za(a,s);break;case 27:(s&2)!==0&&sv(a.stateNode,a.type,a.memoizedProps);case 5:Un(a,a.return),a.tag!==5&&a.tag!==27||Qo(a),Za(a,s);break;case 6:Qo(a);break;case 26:Un(a,a.return),c=a.stateNode,a.memoizedState!==null||c===null||Be||c.parentNode.removeChild(c),Za(a,s);break;case 22:a.memoizedState===null&&Za(a,s);break;case 30:Un(a,a.return),Za(a,s);break;case 7:Un(a,a.return);default:Za(a,s)}t=t.sibling}}function Ui(t,n,a){for(a=(n.subtreeFlags&8772)!==0?a:a&-2,n=n.child;n!==null;){var s=n.alternate,c=t,f=n,v=f.flags,w=(a&1)!==0;switch(f.tag){case 0:case 11:case 15:Ui(c,f,a),Ko(4,f);break;case 1:if(Ui(c,f,a),s=f,c=s.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(ot){ke(s,s.return,ot)}if(s=f,c=s.updateQueue,c!==null){var B=s.stateNode;try{var K=c.shared.hiddenCallbacks;if(K!==null)for(c.shared.hiddenCallbacks=null,c=0;c<K.length;c++)Cg(K[c],B)}catch(ot){ke(s,s.return,ot)}}w&&v&64&&H_(f),Wi(f,f.return);break;case 27:(a&2)!==0&&X_(f);case 5:f.tag!==5&&f.tag!==27||V_(f),Ui(c,f,a),w&&s===null&&v&4&&bh(f),Wi(f,f.return);break;case 6:V_(f);break;case 26:B=f.stateNode,f.memoizedState!==null||B===null||Tn||xd(ol(B.ownerDocument),f.type,B),Ui(c,f,a),w&&s===null&&v&4&&bh(f),Wi(f,f.return);break;case 12:Ui(c,f,a);break;case 31:Ui(c,f,a),w&&v&4&&i0(c,f);break;case 13:Ui(c,f,a),w&&v&4&&a0(c,f);break;case 22:f.memoizedState===null&&Ui(c,f,a),Wi(f,f.return);break;case 30:Ui(c,f,a),Wi(f,f.return);break;case 7:Wi(f,f.return);default:Ui(c,f,a)}n=n.sibling}}function Ih(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&Io(a))}function Bh(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&Io(t))}function Ei(t,n,a,s){var c=(a&335544064)===a;if(n.subtreeFlags&(c?10262:10256))for(n=n.child;n!==null;)l0(t,n,a,s),n=n.sibling;else c&&K_(n)}function l0(t,n,a,s){var c=(a&335544064)===a;c&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&Nc(n);var f=n.flags;switch(n.tag){case 0:case 11:case 15:Ei(t,n,a,s),f&2048&&Ko(9,n);break;case 1:Ei(t,n,a,s);break;case 3:Ei(t,n,a,s),c&&Lh&&(t=t.containerInfo,t=t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,t.style.viewTransitionName==="root"&&(t.style.viewTransitionName=""),t=t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName==="none"&&(t.style.viewTransitionName="")),f&2048&&(f=null,n.alternate!==null&&(f=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==f&&(n.refCount++,f!=null&&Io(f)));break;case 12:if(f&2048){Ei(t,n,a,s),f=n.stateNode;try{var v=n.memoizedProps,w=v.id,B=v.onPostCommit;typeof B=="function"&&B(w,n.alternate===null?"mount":"update",f.passiveEffectDuration,-0)}catch(K){ke(n,n.return,K)}}else Ei(t,n,a,s);break;case 31:Ei(t,n,a,s);break;case 13:Ei(t,n,a,s);break;case 23:break;case 22:v=n.stateNode,w=n.alternate,n.memoizedState!==null?(c&&w!==null&&w.memoizedState===null&&Nc(w),v._visibility&2?Ei(t,n,a,s):$o(t,n)):(c&&w!==null&&w.memoizedState!==null&&Nc(n),v._visibility&2?Ei(t,n,a,s):(v._visibility|=2,Ds(t,n,a,s,(n.subtreeFlags&10256)!==0||!1))),f&2048&&Ih(w,n);break;case 24:Ei(t,n,a,s),f&2048&&Bh(n.alternate,n);break;case 30:c&&(f=n.alternate,f!==null&&(qi(f.child,!0),qi(n.child,!0))),Ei(t,n,a,s);break;default:Ei(t,n,a,s)}}function Ds(t,n,a,s,c){for(c=c&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=t,v=n,w=a,B=s,K=v.flags;switch(v.tag){case 0:case 11:case 15:Ds(f,v,w,B,c),Ko(8,v);break;case 23:break;case 22:var ot=v.stateNode;v.memoizedState!==null?ot._visibility&2?Ds(f,v,w,B,c):$o(f,v):(ot._visibility|=2,Ds(f,v,w,B,c)),c&&K&2048&&Ih(v.alternate,v);break;case 24:Ds(f,v,w,B,c),c&&K&2048&&Bh(v.alternate,v);break;default:Ds(f,v,w,B,c)}n=n.sibling}}function $o(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,s=n,c=s.flags;switch(s.tag){case 22:$o(a,s),c&2048&&Ih(s.alternate,s);break;case 24:$o(a,s),c&2048&&Bh(s.alternate,s);break;default:$o(a,s)}n=n.sibling}}var Fr=8192;function kr(t,n,a){if(t.subtreeFlags&Fr)for(t=t.child;t!==null;)c0(t,n,a),t=t.sibling}function c0(t,n,a){switch(t.tag){case 26:kr(t,n,a),t.flags&Fr&&(t.memoizedState!==null?yE(a,zi,t.memoizedState,t.memoizedProps):(t=t.stateNode,(n&335544128)===n&&gv(a,t)));break;case 5:kr(t,n,a),t.flags&Fr&&(t=t.stateNode,(n&335544128)===n&&gv(a,t));break;case 3:case 4:var s=zi;zi=ol(t.stateNode.containerInfo),kr(t,n,a),zi=s;break;case 22:t.memoizedState===null&&(s=t.alternate,s!==null&&s.memoizedState!==null?(s=Fr,Fr=16777216,kr(t,n,a),Fr=s):kr(t,n,a));break;case 30:if((t.flags&Fr)!==0&&(s=t.memoizedProps.name,s!=null&&s!=="auto")){var c=t.stateNode;c.paired=null,ci===null&&(ci=new Map),ci.set(s,c)}kr(t,n,a);break;default:kr(t,n,a)}}function u0(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function tl(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];wn=s,h0(s,t)}u0(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)f0(t),t=t.sibling}function f0(t){switch(t.tag){case 0:case 11:case 15:tl(t),t.flags&2048&&qa(9,t,t.return);break;case 3:tl(t);break;case 12:tl(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,Oc(t)):tl(t);break;default:tl(t)}}function Oc(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];wn=s,h0(s,t)}u0(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:qa(8,n,n.return),Oc(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,Oc(n));break;default:Oc(n)}t=t.sibling}}function h0(t,n){for(;wn!==null;){var a=wn;switch(a.tag){case 0:case 11:case 15:qa(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var s=a.memoizedState.cachePool.pool;s!=null&&s.refCount++}break;case 24:Io(a.memoizedState.cache)}if(s=a.child,s!==null)s.return=a,wn=s;else t:for(a=t;wn!==null;){s=wn;var c=s.sibling,f=s.return;if(e0(s),s===a){wn=null;break t}if(c!==null){c.return=f,wn=c;break t}wn=f}}}var pM={getCacheForType:function(t){var n=Dn(un),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a},cacheSignal:function(){return Dn(un).controller.signal}},mM=typeof WeakMap=="function"?WeakMap:Map,Ie=0,qe=null,Me=null,Ae=0,Fe=0,ui=null,Ka=!1,Ns=!1,Fh=!1,Sa=0,sn=0,Qa=0,Hr=0,Pc=0,fi=0,zs=0,el=null,ti=null,kh=!1,Ic=0,d0=0,Bc=1/0,Fc=null,Ja=null,an=0,Li=null,Gr=null,Ji=0,Hh=0,Gh=null,p0=null,Us=null,Ls=null,Os=null,nl=0,kc=null;function hi(){return(Ie&2)!==0&&Ae!==0?Ae&-Ae:Dt.T!==null?Jh():J()}function m0(){if(fi===0)if((Ae&536870912)===0||xe){var t=Mr;Mr<<=1,(Mr&3932160)===0&&(Mr=262144),fi=t}else fi=536870912;return t=Nn.current,t!==null&&(t.flags|=32),fi}function Ps(t,n){if(n!=null){var a=t.stateNode,s=a.ref;s===null&&(s=a.ref=Z0(fa(t.memoizedProps,a))),Ls===null&&(Ls=[]),Ls.push(n.bind(null,s))}}function ei(t,n,a){(t===qe&&(Fe===2||Fe===9)||t.cancelPendingCommit!==null)&&(Is(t,0),$a(t,Ae,fi,!1)),Er(t,a),((Ie&2)===0||t!==qe)&&(t===qe&&((Ie&2)===0&&(Hr|=a),sn===4&&$a(t,Ae,fi,!1)),$i(t))}function g0(t,n,a){if((Ie&6)!==0)throw Error(r(327));var s=!a&&(n&127)===0&&(n&t.expiredLanes)===0||Ua(t,n),c=s?vM(t,n):jh(t,n,!0),f=s;do{if(c===0){Ns&&!s&&$a(t,n,0,!1);break}else{if(a=t.current.alternate,f&&!gM(a)){c=jh(t,n,!1),f=!1;continue}if(c===2){if(f=n,t.errorRecoveryDisabledLanes&f)var v=0;else v=t.pendingLanes&-536870913,v=v!==0?v:v&536870912?536870912:0;if(v!==0){n=v;t:{var w=t;c=el;var B=w.current.memoizedState.isDehydrated;if(B&&(Is(w,v).flags|=256),v=jh(w,v,!1),v!==2&&v!==6){if(Fh&&!B){w.errorRecoveryDisabledLanes|=f,Hr|=f,c=4;break t}f=ti,ti=c,f!==null&&(ti===null?ti=f:ti.push.apply(ti,f))}c=v}if(f=!1,c!==2)continue}}if(c===1){Is(t,0),$a(t,n,0,!0);break}t:{switch(s=t,f=c,f){case 0:case 1:throw Error(r(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:$a(s,n,fi,!Ka);break t;case 2:ti=null;break;case 3:case 5:break;default:throw Error(r(329))}if((n&62914560)===n&&(c=Ic+300-U(),10<c)){if($a(s,n,fi,!Ka),oa(s,0,!0)!==0)break t;Ji=n,s.timeoutHandle=cd(_0.bind(null,s,a,ti,Fc,kh,n,fi,Hr,zs,Ka,f,"Throttled",-0,0),c);break t}_0(s,a,ti,Fc,kh,n,fi,Hr,zs,Ka,f,null,-0,0)}}break}while(!0);$i(t)}function _0(t,n,a,s,c,f,v,w,B,K,ot,yt,q,at){t.timeoutHandle=-1;var It=n.subtreeFlags,Kt=(f&335544064)===f;if(yt=null,(Kt||It&8192||(It&16785408)===16785408)&&(yt={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Vi},ci=null,c0(n,f,yt),Kt&&(It=yt,Kt=t.containerInfo,Kt=(Kt.nodeType===9?Kt:Kt.ownerDocument).__reactViewTransition,Kt!=null&&(It.count++,It.waitingForViewTransition=!0,It=ul.bind(It),Kt.finished.then(It,It))),It=(f&62914560)===f?Ic-U():(f&4194048)===f?d0-U():0,It=xE(yt,It),It!==null)){Ji=f,t.cancelPendingCommit=It(T0.bind(null,t,n,f,a,s,c,v,w,B,K,ot,yt,null,q,at)),$a(t,f,v,!K);return}T0(t,n,f,a,s,c,v,w,B,K,ot,yt)}function gM(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var s=0;s<a.length;s++){var c=a[s],f=c.getSnapshot;c=c.value;try{if(!oi(f(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function $a(t,n,a,s){n=bo(t,n),n&=~Pc,n&=~Hr,t.suspendedLanes|=n,t.pingedLanes&=~n,s&&(t.warmLanes|=n),s=t.expirationTimes;for(var c=n;0<c;){var f=31-Bn(c),v=1<<f;s[f]=-1,c&=~v}a!==0&&Bl(t,a,n)}function Hc(){return(Ie&6)===0?(il(0),!1):!0}function Vh(){if(Me!==null){if(Fe===0)var t=Me.return;else t=Me,ma=Cr=null,Qf(t),Es=null,ko=0,t=Me;for(;t!==null;)k_(t.alternate,t),t=t.return;Me=null}}function Is(t,n){var a=t.timeoutHandle;return a!==-1&&(t.timeoutHandle=-1,kM(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),Ji=0,Vh(),qe=t,Me=a=da(t.current,null),Ae=n,Fe=0,ui=null,Ka=!1,Ns=Ua(t,n),Fh=!1,zs=fi=Pc=Hr=Qa=sn=0,ti=el=null,kh=!1,Sa=bo(t,n),Zl(),a}function v0(t,n){de=null,Dt.H=xc,n===Ms||n===sc?(n=Tg(),Fe=3):n===Bf?(n=Tg(),Fe=4):Fe=n===hh?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,ui=n,Me===null&&(sn=1,Sc(t,yi(n,t.current)))}function y0(){var t=Nn.current;return t===null?!0:(Ae&4194048)===Ae?kn===null:(Ae&62914560)===Ae||(Ae&536870912)!==0?t===kn:!1}function x0(){var t=Dt.H;return Dt.H=xc,t===null?xc:t}function S0(){var t=Dt.A;return Dt.A=pM,t}function Gc(){sn=4,Ka||(Ae&4194048)!==Ae&&Nn.current!==null||(Ns=!0),(Qa&134217727)===0&&(Hr&134217727)===0||qe===null||$a(qe,Ae,fi,!1)}function jh(t,n,a){var s=Ie;Ie|=2;var c=x0(),f=S0();(qe!==t||Ae!==n)&&(Fc=null,Is(t,n)),n=!1;var v=sn;t:do try{if(Fe!==0&&Me!==null){var w=Me,B=ui;switch(Fe){case 8:Vh(),v=6;break t;case 3:case 2:case 9:case 6:Nn.current===null&&(n=!0);var K=Fe;if(Fe=0,ui=null,Bs(t,w,B,K),a&&Ns){v=0;break t}break;default:K=Fe,Fe=0,ui=null,Bs(t,w,B,K)}}_M(),v=sn;break}catch(ot){v0(t,ot)}while(!0);return n&&t.shellSuspendCounter++,ma=Cr=null,Ie=s,Dt.H=c,Dt.A=f,Me===null&&(qe=null,Ae=0,Zl()),v}function _M(){for(;Me!==null;)M0(Me)}function vM(t,n){var a=Ie;Ie|=2;var s=x0(),c=S0();qe!==t||Ae!==n?(Fc=null,Bc=U()+500,Is(t,n)):Ns=Ua(t,n);t:do try{if(Fe!==0&&Me!==null){n=Me;var f=ui;e:switch(Fe){case 1:Fe=0,ui=null,Bs(t,n,f,1);break;case 2:case 9:if(Eg(f)){Fe=0,ui=null,E0(n);break}n=function(){Fe!==2&&Fe!==9||qe!==t||(Fe=7),$i(t)},f.then(n,n);break t;case 3:Fe=7;break t;case 4:Fe=5;break t;case 7:Eg(f)?(Fe=0,ui=null,E0(n)):(Fe=0,ui=null,Bs(t,n,f,7));break;case 5:var v=null;switch(Me.tag){case 26:v=Me.memoizedState;case 5:case 27:var w=Me;if(v?pv(v):w.stateNode.complete){Fe=0,ui=null;var B=w.sibling;if(B!==null)Me=B;else{var K=w.return;K!==null?(Me=K,Vc(K)):Me=null}break e}}Fe=0,ui=null,Bs(t,n,f,5);break;case 6:Fe=0,ui=null,Bs(t,n,f,6);break;case 8:Vh(),sn=6;break t;default:throw Error(r(462))}}yM();break}catch(ot){v0(t,ot)}while(!0);return ma=Cr=null,Dt.H=s,Dt.A=c,Ie=a,Me!==null?0:(qe=null,Ae=0,Zl(),sn)}function yM(){for(;Me!==null&&!fe();)M0(Me)}function M0(t){var n=B_(t.alternate,t,Sa);t.memoizedProps=t.pendingProps,n===null?Vc(t):Me=n}function E0(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=N_(a,n,n.pendingProps,n.type,void 0,Ae);break;case 11:n=N_(a,n,n.pendingProps,n.type.render,n.ref,Ae);break;case 5:Qf(n);var s=n;s===bn&&(xe?(ec(s),s.tag===5&&s.stateNode!=null&&(Ke=s.stateNode)):(ec(s),xe=!0));default:k_(a,n),n=Me=hg(n,Sa),n=B_(a,n,Sa)}t.memoizedProps=t.pendingProps,n===null?Vc(t):Me=n}function Bs(t,n,a,s){ma=Cr=null,Qf(n),Es=null,ko=0;var c=n.return;try{if(sM(t,c,n,a,Ae)){sn=1,Sc(t,yi(a,t.current)),Me=null;return}}catch(f){if(c!==null)throw Me=c,f;sn=1,Sc(t,yi(a,t.current)),Me=null;return}n.flags&32768?(xe||s===1?t=!0:Ns||(Ae&536870912)!==0?t=!1:(Ka=t=!0,(s===2||s===9||s===3||s===6)&&(s=Nn.current,s!==null&&s.tag===13&&(s.flags|=16384))),b0(n,t)):Vc(n)}function Vc(t){var n=t;do{if((n.flags&32768)!==0){b0(n,Ka);return}t=n.return;var a=uM(n.alternate,n,Sa);if(a!==null){Me=a;return}if(n=n.sibling,n!==null){Me=n;return}Me=n=t}while(n!==null);sn===0&&(sn=5)}function b0(t,n){do{var a=fM(t.alternate,t);if(a!==null){a.flags&=32767,Me=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){Me=t;return}Me=t=a}while(t!==null);sn=6,Me=null}function T0(t,n,a,s,c,f,v,w,B,K,ot,yt){t.cancelPendingCommit=null;do jc();while(an!==0);if((Ie&6)!==0)throw Error(r(327));if(n!==null){if(n===t.current)throw Error(r(177));t===qe&&(Me=qe=null,Ae=0),Gr=n,Li=t,Ji=a,Gh=c,p0=s,xM(t,n,a,v,w,B,yt)}}function xM(t,n,a,s,c,f,v){var w=n.lanes|n.childLanes;if(Hh=w,w|=Tf,ef(t,a,w,s,c,f),Ls=null,(a&335544064)===a?(Os=qS(t),s=10262):(Os=null,s=10256),(n.subtreeFlags&s)!==0||(n.flags&s)!==0?(t.callbackNode=null,t.callbackPriority=0,wM(kt,function(){return qh(),null})):(t.callbackNode=null,t.callbackPriority=0),Cc=!1,s=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||s){s=Dt.T,Dt.T=null,c=zt.p,zt.p=2,f=Ie,Ie|=4;try{hM(t,n,a)}finally{Ie=f,zt.p=c,Dt.T=s}}an=1,Cc?Us=WM(v,t.containerInfo,Os,Xh,Wh,MM,Yh,qh,SM):(Xh(),Wh(),Yh())}function SM(t){if(an!==0){var n=Li.onRecoverableError;n(t,{componentStack:null})}}function MM(){an===3&&(an=0,o0(Gr,Li),an=4)}function Xh(){if(an===1){an=0;var t=Li,n=Gr,a=Ji,s=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||s){s=Dt.T,Dt.T=null;var c=zt.p;zt.p=2;var f=Ie;Ie|=4;try{Jo=zc=!1,r0(n,t,a),a=sd;var v=ng(t.containerInfo),w=a.focusedElem,B=a.selectionRange;if(v!==w&&w&&w.ownerDocument&&eg(w.ownerDocument.documentElement,w)){if(B!==null&&xf(w)){var K=B.start,ot=B.end;if(ot===void 0&&(ot=K),"selectionStart"in w)w.selectionStart=K,w.selectionEnd=Math.min(ot,w.value.length);else{var yt=w.ownerDocument||document,q=yt&&yt.defaultView||window;if(q.getSelection){var at=q.getSelection(),It=w.textContent.length,Kt=Math.min(B.start,It),pe=B.end===void 0?Kt:Math.min(B.end,It);!at.extend&&Kt>pe&&(v=pe,pe=Kt,Kt=v);var Z=tg(w,Kt),j=tg(w,pe);if(Z&&j&&(at.rangeCount!==1||at.anchorNode!==Z.node||at.anchorOffset!==Z.offset||at.focusNode!==j.node||at.focusOffset!==j.offset)){var nt=yt.createRange();nt.setStart(Z.node,Z.offset),at.removeAllRanges(),Kt>pe?(at.addRange(nt),at.extend(j.node,j.offset)):(nt.setEnd(j.node,j.offset),at.addRange(nt))}}}}for(yt=[],at=w;at=at.parentNode;)at.nodeType===1&&yt.push({element:at,left:at.scrollLeft,top:at.scrollTop});for(typeof w.focus=="function"&&w.focus(),w=0;w<yt.length;w++){var _t=yt[w];_t.element.scrollLeft=_t.left,_t.element.scrollTop=_t.top}}Ws=!!rd,sd=rd=null}finally{Ie=f,zt.p=c,Dt.T=s}}t.current=n,an=2}}function Wh(){if(an===2){an=0;var t=Li,n=Gr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=Dt.T,Dt.T=null;var s=zt.p;zt.p=2;var c=Ie;Ie|=4;try{$_(t,n.alternate,n)}finally{Ie=c,zt.p=s,Dt.T=a}}an=3}}function Yh(){if(an===4||an===3){an=0;var t=Us;Us=null,dt();var n=Li,a=Gr,s=Ji,c=p0,f=(s&335544064)===s?10262:10256;if((a.subtreeFlags&f)!==0||(a.flags&f)!==0?an=5:(an=0,Gr=Li=null,w0(n,n.pendingLanes)),f=n.pendingLanes,f===0&&(Ja=null),ct(s),a=a.stateNode,Je&&typeof Je.onCommitFiberRoot=="function")try{Je.onCommitFiberRoot(Ce,a,void 0,(a.current.flags&128)===128)}catch{}if(c!==null){a=Dt.T,f=zt.p,zt.p=2,Dt.T=null;try{for(var v=n.onRecoverableError,w=0;w<c.length;w++){var B=c[w];v(B.value,{componentStack:B.stack})}}finally{Dt.T=a,zt.p=f}}if(c=Ls,v=Os,Os=null,c!==null&&(Ls=null,v===null&&(v=[]),t!==null))for(B=0;B<c.length;B++)a=(0,c[B])(v),a!==void 0&&t.finished.finally(a);(Ji&3)!==0&&jc(),$i(n),f=n.pendingLanes,(s&261930)!==0&&(f&42)!==0?n===kc?nl++:(nl=0,kc=n):(nl=0,kc=null),il(0)}}function w0(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,Io(n)))}function jc(){return Us!==null&&(Us.skipTransition(),Us=null),Xh(),Wh(),Yh(),qh()}function qh(){if(an!==5)return!1;var t=Li,n=Hh;Hh=0;var a=ct(Ji),s=Dt.T,c=zt.p;try{zt.p=32>a?32:a,Dt.T=null,a=Gh,Gh=null;var f=Li,v=Ji;if(an=0,Gr=Li=null,Ji=0,(Ie&6)!==0)throw Error(r(331));var w=Ie;if(Ie|=4,f0(f.current),l0(f,f.current,v,a),Ie=w,il(0,!1),Je&&typeof Je.onPostCommitFiberRoot=="function")try{Je.onPostCommitFiberRoot(Ce,f)}catch{}return!0}finally{zt.p=c,Dt.T=s,w0(t,n)}}function A0(t,n,a){n=yi(a,n),n=fh(t.stateNode,n,2),t=ja(t,n,2),t!==null&&(Er(t,2),$i(t))}function ke(t,n,a){if(t.tag===3)A0(t,t,a);else for(;n!==null;){if(n.tag===3){A0(n,t,a);break}else if(n.tag===1){var s=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(Ja===null||!Ja.has(s))){t=yi(a,t),a=E_(2),s=ja(n,a,2),s!==null&&(b_(a,s,n,t),Er(s,2),$i(s));break}}n=n.return}}function Zh(t,n,a){var s=t.pingCache;if(s===null){s=t.pingCache=new mM;var c=new Set;s.set(n,c)}else c=s.get(n),c===void 0&&(c=new Set,s.set(n,c));c.has(a)||(Fh=!0,c.add(a),t=EM.bind(null,t,n,a),n.then(t,t))}function EM(t,n,a){var s=t.pingCache;s!==null&&s.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,qe===t&&(Ae&a)===a&&((sn===4||sn===3&&(Ae&62914560)===Ae&&300>U()-Ic)&&(Ie&2)===0?Is(t,0):Pc|=a,zs===Ae&&(zs=0)),$i(t)}function R0(t,n){n===0&&(n=Il()),t=wr(t,n),t!==null&&(Er(t,n),$i(t))}function bM(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),R0(t,a)}function TM(t,n){var a=0;switch(t.tag){case 31:case 13:var s=t.stateNode,c=t.memoizedState;c!==null&&(a=c.retryLane);break;case 19:s=t.stateNode;break;case 22:s=t.stateNode._retryCache;break;default:throw Error(r(314))}s!==null&&s.delete(n),R0(t,a)}function wM(t,n){return jt(t,n)}var Fs=null,ks=null,Kh=!1,Xc=!1,Qh=!1,tr=0;function $i(t){t!==ks&&t.next===null&&(ks===null?Fs=ks=t:ks=ks.next=t),Xc=!0,Kh||(Kh=!0,RM())}function il(t,n){if(!Qh&&Xc){Qh=!0;do for(var a=!1,s=Fs;s!==null;){if(t!==0){var c=s.pendingLanes;if(c===0)var f=0;else{var v=s.suspendedLanes,w=s.pingedLanes;f=(1<<31-Bn(42|t)+1)-1,f&=c&~(v&~w),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,z0(s,f))}else f=Ae,f=oa(s,s===qe?f:0,s.cancelPendingCommit!==null||s.timeoutHandle!==-1),(f&3)===0||Ua(s,f)||(a=!0,z0(s,f));s=s.next}while(a);Qh=!1}}function AM(){C0()}function C0(){Xc=Kh=!1;var t=0;tr!==0&&FM()&&(t=tr);for(var n=U(),a=null,s=Fs;s!==null;){var c=s.next,f=D0(s,n);f===0?(s.next=null,a===null?Fs=c:a.next=c,c===null&&(ks=a)):(a=s,(t!==0||(f&3)!==0)&&(Xc=!0)),s=c}an!==0&&an!==5||il(t),tr!==0&&(tr=0)}function D0(t,n){for(var a=t.suspendedLanes,s=t.pingedLanes,c=t.expirationTimes,f=t.pendingLanes&-62914561;0<f;){var v=31-Bn(f),w=1<<v,B=c[v];B===-1?((w&a)===0||(w&s)!==0)&&(c[v]=tf(w,n)):B<=n&&(t.expiredLanes|=w),f&=~w}if(n=qe,a=Ae,a=oa(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s=t.callbackNode,a===0||t===n&&(Fe===2||Fe===9)||t.cancelPendingCommit!==null)return s!==null&&s!==null&&_e(s),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||Ua(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(s!==null&&_e(s),ct(a)){case 2:case 8:a=xt;break;case 32:a=kt;break;case 268435456:a=ce;break;default:a=kt}return s=N0.bind(null,t),a=jt(a,s),t.callbackPriority=n,t.callbackNode=a,n}return s!==null&&s!==null&&_e(s),t.callbackPriority=2,t.callbackNode=null,2}function N0(t,n){if(an!==0&&an!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(jc()&&t.callbackNode!==a)return null;var s=Ae;return s=oa(t,t===qe?s:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s===0?null:(g0(t,s,n),D0(t,U()),t.callbackNode!=null&&t.callbackNode===a?N0.bind(null,t):null)}function z0(t,n){if(jc())return null;g0(t,n,!0)}function RM(){HM(function(){(Ie&6)!==0?jt(st,AM):C0()})}function Jh(){if(tr===0){var t=zr;t===0&&(t=Sr,Sr<<=1,(Sr&261888)===0&&(Sr=256)),tr=t}return tr}function U0(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Hl(t)}function CM(t,n,a,s,c){if(n==="submit"&&a&&a.stateNode===c){var f=U0((c[Bt]||null).action),v=s.submitter;v&&(n=(n=v[Bt]||null)?U0(n.formAction):v.getAttribute("formAction"),n!==null&&(f=n,v=null));var w=new Xl("action","action",null,s,c);t.push({event:w,listeners:[{instance:null,listener:function(){if(s.defaultPrevented){if(tr!==0){var B=new FormData(c,v);sh(a,{pending:!0,data:B,method:c.method,action:f},null,B)}}else typeof f=="function"&&(w.preventDefault(),B=new FormData(c,v),sh(a,{pending:!0,data:B,method:c.method,action:f},f,B))},currentTarget:c}]})}}for(var $h=0;$h<bf.length;$h++){var td=bf[$h],DM=td.toLowerCase(),NM=td[0].toUpperCase()+td.slice(1);Di(DM,"on"+NM)}Di(rg,"onAnimationEnd"),Di(sg,"onAnimationIteration"),Di(og,"onAnimationStart"),Di("dblclick","onDoubleClick"),Di("focusin","onFocus"),Di("focusout","onBlur"),Di(kS,"onTransitionRun"),Di(HS,"onTransitionStart"),Di(GS,"onTransitionCancel"),Di(lg,"onTransitionEnd"),mn("onMouseEnter",["mouseout","mouseover"]),mn("onMouseLeave",["mouseout","mouseover"]),mn("onPointerEnter",["pointerout","pointerover"]),mn("onPointerLeave",["pointerout","pointerover"]),cn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),cn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),cn("onBeforeInput",["compositionend","keypress","textInput","paste"]),cn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),cn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),cn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var al="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),zM=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(al));function L0(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var s=t[a],c=s.event;s=s.listeners;t:{var f=void 0;if(n)for(var v=s.length-1;0<=v;v--){var w=s[v],B=w.instance,K=w.currentTarget;if(w=w.listener,B!==f&&c.isPropagationStopped())break t;f=w,c.currentTarget=K;try{f(c)}catch(ot){ql(ot)}c.currentTarget=null,f=B}else for(v=0;v<s.length;v++){if(w=s[v],B=w.instance,K=w.currentTarget,w=w.listener,B!==f&&c.isPropagationStopped())break t;f=w,c.currentTarget=K;try{f(c)}catch(ot){ql(ot)}c.currentTarget=null,f=B}}}}function Ee(t,n){var a=n[le];a===void 0&&(a=n[le]=new Set);var s=t+"__bubble";a.has(s)||(O0(n,t,2,!1),a.add(s))}function ed(t,n,a){var s=0;n&&(s|=4),O0(a,t,s,n)}var Wc="_reactListening"+Math.random().toString(36).slice(2);function nd(t){if(!t[Wc]){t[Wc]=!0,La.forEach(function(a){a!=="selectionchange"&&(zM.has(a)||ed(a,!1,t),ed(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[Wc]||(n[Wc]=!0,ed("selectionchange",!1,n))}}function O0(t,n,a,s){switch(bv(n)){case 2:var c=bE;break;case 8:c=TE;break;default:c=Md}a=c.bind(null,n,a,t),c=void 0,!uf||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),s?c!==void 0?t.addEventListener(n,a,{capture:!0,passive:c}):t.addEventListener(n,a,!0):c!==void 0?t.addEventListener(n,a,{passive:c}):t.addEventListener(n,a,!1)}function id(t,n,a,s,c){var f=s;if((n&1)===0&&(n&2)===0&&s!==null)t:for(;;){if(s===null)return;var v=s.tag;if(v===3||v===4){var w=s.stateNode.containerInfo;if(w===c)break;if(v===4)for(v=s.return;v!==null;){var B=v.tag;if((B===3||B===4)&&v.stateNode.containerInfo===c)return;v=v.return}for(;w!==null;){if(v=Jt(w),v===null)return;if(B=v.tag,B===5||B===6||B===26||B===27){s=f=v;continue t}w=w.parentNode}}s=s.return}Om(function(){var K=f,ot=lf(a),yt=[];t:{var q=cg.get(t);if(q!==void 0){var at=Xl,It=t;switch(t){case"keypress":if(Vl(a)===0)break t;case"keydown":case"keyup":at=gS;break;case"focusin":It="focus",at=pf;break;case"focusout":It="blur",at=pf;break;case"beforeblur":case"afterblur":at=pf;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":at=Bm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":at=aS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":at=SS;break;case rg:case sg:case og:at=oS;break;case lg:at=ES;break;case"scroll":case"scrollend":at=nS;break;case"wheel":at=TS;break;case"copy":case"cut":case"paste":at=cS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":at=km;break;case"submit":at=yS;break;case"toggle":case"beforetoggle":at=AS}var Kt=(n&4)!==0,pe=!Kt&&(t==="scroll"||t==="scrollend"),Z=Kt?q!==null?q+"Capture":null:q;Kt=[];for(var j=K,nt;j!==null;){var _t=j;if(nt=_t.stateNode,_t=_t.tag,_t!==5&&_t!==26&&_t!==27||nt===null||Z===null||(_t=wo(j,Z),_t!=null&&Kt.push(rl(j,_t,nt))),pe)break;j=j.return}0<Kt.length&&(q=new at(q,It,null,a,ot),yt.push({event:q,listeners:Kt}))}}if((n&7)===0){t:{if(at=t==="mouseover"||t==="pointerover",q=t==="mouseout"||t==="pointerout",at&&a!==of&&(It=a.relatedTarget||a.fromElement)&&(Jt(It)||It[ae]))break t;(q||at)&&(It=ot.window===ot?ot:(at=ot.ownerDocument)?at.defaultView||at.parentWindow:window,q?(at=a.relatedTarget||a.toElement,q=K,at=at?Jt(at):null,at!==null&&(pe=u(at),Kt=at.tag,at!==pe||Kt!==5&&Kt!==27&&Kt!==6)&&(at=null)):(q=null,at=K),q!==at&&(Kt=Bm,_t="onMouseLeave",Z="onMouseEnter",j="mouse",(t==="pointerout"||t==="pointerover")&&(Kt=km,_t="onPointerLeave",Z="onPointerEnter",j="pointer"),pe=q==null?It:we(q),nt=at==null?It:we(at),It=new Kt(_t,j+"leave",q,a,ot),It.target=pe,It.relatedTarget=nt,_t=null,Jt(ot)===K&&(Kt=new Kt(Z,j+"enter",at,a,ot),Kt.target=nt,Kt.relatedTarget=pe,_t=Kt),pe=_t,Kt=q&&at?P(q,at,UM):null,q!==null&&P0(yt,It,q,Kt,!1),at!==null&&pe!==null&&P0(yt,pe,at,Kt,!0)))}t:{if(q=K?we(K):window,at=q.nodeName&&q.nodeName.toLowerCase(),at==="select"||at==="input"&&q.type==="file")var Yt=qm;else if(Wm(q))if(Zm)Yt=IS;else{Yt=OS;var Re=LS}else at=q.nodeName,!at||at.toLowerCase()!=="input"||q.type!=="checkbox"&&q.type!=="radio"?K&&sf(K.elementType)&&(Yt=qm):Yt=PS;if(Yt&&(Yt=Yt(t,K))){Ym(yt,Yt,a,ot);break t}Re&&Re(t,q,K)}switch(Re=K?we(K):window,t){case"focusin":(Wm(Re)||Re.contentEditable==="true")&&(ps=Re,Sf=K,Lo=null);break;case"focusout":Lo=Sf=ps=null;break;case"mousedown":Mf=!0;break;case"contextmenu":case"mouseup":case"dragend":Mf=!1,ig(yt,a,ot);break;case"selectionchange":if(FS)break;case"keydown":case"keyup":ig(yt,a,ot)}var $t;if(gf)t:{switch(t){case"compositionstart":var oe="onCompositionStart";break t;case"compositionend":oe="onCompositionEnd";break t;case"compositionupdate":oe="onCompositionUpdate";break t}oe=void 0}else ds?jm(t,a)&&(oe="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(oe="onCompositionStart");oe&&(Hm&&a.locale!=="ko"&&(ds||oe!=="onCompositionStart"?oe==="onCompositionEnd"&&ds&&($t=Pm()):(Oa=ot,ff="value"in Oa?Oa.value:Oa.textContent,ds=!0)),Re=Yc(K,oe),0<Re.length&&(oe=new Fm(oe,t,null,a,ot),yt.push({event:oe,listeners:Re}),$t?oe.data=$t:($t=Xm(a),$t!==null&&(oe.data=$t)))),($t=CS?DS(t,a):NS(t,a))&&(oe=Yc(K,"onBeforeInput"),0<oe.length&&(Re=new Fm("onBeforeInput","beforeinput",null,a,ot),yt.push({event:Re,listeners:oe}),Re.data=$t)),CM(yt,t,K,a,ot)}L0(yt,n)})}function rl(t,n,a){return{instance:t,listener:n,currentTarget:a}}function Yc(t,n){for(var a=n+"Capture",s=[];t!==null;){var c=t,f=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||f===null||(c=wo(t,a),c!=null&&s.unshift(rl(t,c,f)),c=wo(t,n),c!=null&&s.push(rl(t,c,f))),t.tag===3)return s;t=t.return}return[]}function UM(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function P0(t,n,a,s,c){for(var f=n._reactName,v=[];a!==null&&a!==s;){var w=a,B=w.alternate,K=w.stateNode;if(w=w.tag,B!==null&&B===s)break;w!==5&&w!==26&&w!==27||K===null||(B=K,c?(K=wo(a,f),K!=null&&v.unshift(rl(a,K,B))):c||(K=wo(a,f),K!=null&&v.push(rl(a,K,B)))),a=a.return}v.length!==0&&t.push({event:n,listeners:v})}var LM=/\r\n?/g,OM=/\u0000|\uFFFD/g;function I0(t){return(typeof t=="string"?t:""+t).replace(LM,`
`).replace(OM,"")}function B0(t,n){return n=I0(n),I0(t)===n}function He(t,n,a,s,c,f){switch(a){case"children":if(typeof s=="string")n==="body"||n==="textarea"&&s===""||us(t,s);else if(typeof s=="number"||typeof s=="bigint")n!=="body"&&us(t,""+s);else return;break;case"className":kl(t,"class",s);break;case"tabIndex":kl(t,"tabindex",s);break;case"dir":case"role":case"viewBox":case"width":case"height":kl(t,a,s);break;case"style":Um(t,s,f);return;case"data":if(n!=="object"){kl(t,"data",s);break}case"src":case"href":if(s===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(s==null||typeof s=="function"||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Hl(s),t.setAttribute(a,s);break;case"action":case"formAction":if(typeof s=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&He(t,n,"name",c.name,c,null),He(t,n,"formEncType",c.formEncType,c,null),He(t,n,"formMethod",c.formMethod,c,null),He(t,n,"formTarget",c.formTarget,c,null)):(He(t,n,"encType",c.encType,c,null),He(t,n,"method",c.method,c,null),He(t,n,"target",c.target,c,null)));if(s==null||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Hl(s),t.setAttribute(a,s);break;case"onClick":s!=null&&(t.onclick=Vi);return;case"onScroll":s!=null&&Ee("scroll",t);return;case"onScrollEnd":s!=null&&Ee("scrollend",t);return;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));(f!=null?f.__html:void 0)!==a&&(t.innerHTML=a)}}break;case"multiple":t.multiple=s&&typeof s!="function"&&typeof s!="symbol";break;case"muted":t.muted=s&&typeof s!="function"&&typeof s!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(s==null||typeof s=="function"||typeof s=="boolean"||typeof s=="symbol"){t.removeAttribute("xlink:href");break}a=Hl(s),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,s):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":s&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":s===!0?t.setAttribute(a,""):s!==!1&&s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,s):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":s!=null&&typeof s!="function"&&typeof s!="symbol"&&!isNaN(s)&&1<=s?t.setAttribute(a,s):t.removeAttribute(a);break;case"rowSpan":case"start":s==null||typeof s=="function"||typeof s=="symbol"||isNaN(s)?t.removeAttribute(a):t.setAttribute(a,s);break;case"popover":Ee("beforetoggle",t),Ee("toggle",t),Fl(t,"popover",s);break;case"xlinkActuate":ca(t,"http://www.w3.org/1999/xlink","xlink:actuate",s);break;case"xlinkArcrole":ca(t,"http://www.w3.org/1999/xlink","xlink:arcrole",s);break;case"xlinkRole":ca(t,"http://www.w3.org/1999/xlink","xlink:role",s);break;case"xlinkShow":ca(t,"http://www.w3.org/1999/xlink","xlink:show",s);break;case"xlinkTitle":ca(t,"http://www.w3.org/1999/xlink","xlink:title",s);break;case"xlinkType":ca(t,"http://www.w3.org/1999/xlink","xlink:type",s);break;case"xmlBase":ca(t,"http://www.w3.org/XML/1998/namespace","xml:base",s);break;case"xmlLang":ca(t,"http://www.w3.org/XML/1998/namespace","xml:lang",s);break;case"xmlSpace":ca(t,"http://www.w3.org/XML/1998/namespace","xml:space",s);break;case"is":Fl(t,"is",s);break;case"innerText":case"textContent":return;default:if(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")a=tS.get(a)||a,Fl(t,a,s);else return}Le=!0}function ad(t,n,a,s,c,f){switch(a){case"style":Um(t,s,f);return;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));(f!=null?f.__html:void 0)!==a&&(t.innerHTML=a)}}break;case"children":if(typeof s=="string")us(t,s);else if(typeof s=="number"||typeof s=="bigint")us(t,""+s);else return;break;case"onScroll":s!=null&&Ee("scroll",t);return;case"onScrollEnd":s!=null&&Ee("scrollend",t);return;case"onClick":s!=null&&(t.onclick=Vi);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!Ye.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),f=a.slice(2,c?a.length-7:void 0),n=t[Bt]||null,n=n!=null?n[a]:null,typeof n=="function"&&t.removeEventListener(f,n,c),typeof s=="function")){typeof n!="function"&&n!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(f,s,c);break t}Le=!0,a in t?t[a]=s:s===!0?t.setAttribute(a,""):Fl(t,a,s)}return}Le=!0}function Ln(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Ee("error",t),Ee("load",t);var s=!1,c=!1,f;for(f in a)if(a.hasOwnProperty(f)){var v=a[f];if(v!=null)switch(f){case"src":s=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:He(t,n,f,v,a,null)}}c&&He(t,n,"srcSet",a.srcSet,a,null),s&&He(t,n,"src",a.src,a,null);return;case"input":Ee("invalid",t);var w=f=v=c=null,B=null,K=null;for(s in a)if(a.hasOwnProperty(s)){var ot=a[s];if(ot!=null)switch(s){case"name":c=ot;break;case"type":v=ot;break;case"checked":B=ot;break;case"defaultChecked":K=ot;break;case"value":f=ot;break;case"defaultValue":w=ot;break;case"children":case"dangerouslySetInnerHTML":if(ot!=null)throw Error(r(137,n));break;default:He(t,n,s,ot,a,null)}}Cm(t,f,w,B,K,v,c,!1);return;case"select":Ee("invalid",t),s=v=f=null;for(c in a)if(a.hasOwnProperty(c)&&(w=a[c],w!=null))switch(c){case"value":f=w;break;case"defaultValue":v=w;break;case"multiple":s=w;default:He(t,n,c,w,a,null)}n=f,a=v,t.multiple=!!s,n!=null?cs(t,!!s,n,!1):a!=null&&cs(t,!!s,a,!0);return;case"textarea":Ee("invalid",t),f=c=s=null;for(v in a)if(a.hasOwnProperty(v)&&(w=a[v],w!=null))switch(v){case"value":s=w;break;case"defaultValue":c=w;break;case"children":f=w;break;case"dangerouslySetInnerHTML":if(w!=null)throw Error(r(91));break;default:He(t,n,v,w,a,null)}Nm(t,s,c,f);return;case"option":for(B in a)if(a.hasOwnProperty(B)&&(s=a[B],s!=null))switch(B){case"selected":t.selected=s&&typeof s!="function"&&typeof s!="symbol";break;default:He(t,n,B,s,a,null)}return;case"dialog":Ee("beforetoggle",t),Ee("toggle",t),Ee("cancel",t),Ee("close",t);break;case"iframe":case"object":Ee("load",t);break;case"video":case"audio":for(s=0;s<al.length;s++)Ee(al[s],t);break;case"image":Ee("error",t),Ee("load",t);break;case"details":Ee("toggle",t);break;case"embed":case"source":case"link":Ee("error",t),Ee("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(K in a)if(a.hasOwnProperty(K)&&(s=a[K],s!=null))switch(K){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:He(t,n,K,s,a,null)}return;default:if(sf(n)){for(ot in a)a.hasOwnProperty(ot)&&(s=a[ot],s!==void 0&&ad(t,n,ot,s,a,void 0));return}}for(w in a)a.hasOwnProperty(w)&&(s=a[w],s!=null&&He(t,n,w,s,a,null))}var PM={};function IM(t,n,a,s){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,f=null,v=null,w=null,B=null,K=null,ot=null;for(at in a){var yt=a[at];if(a.hasOwnProperty(at)&&yt!=null)switch(at){case"checked":break;case"value":break;case"defaultValue":B=yt;default:s.hasOwnProperty(at)||He(t,n,at,null,s,yt)}}for(var q in s){var at=s[q];if(yt=a[q],s.hasOwnProperty(q)&&(at!=null||yt!=null))switch(q){case"type":at!==yt&&(Le=!0),f=at;break;case"name":at!==yt&&(Le=!0),c=at;break;case"checked":at!==yt&&(Le=!0),K=at;break;case"defaultChecked":at!==yt&&(Le=!0),ot=at;break;case"value":at!==yt&&(Le=!0),v=at;break;case"defaultValue":at!==yt&&(Le=!0),w=at;break;case"children":case"dangerouslySetInnerHTML":if(at!=null)throw Error(r(137,n));break;default:at!==yt&&He(t,n,q,at,s,yt)}}af(t,v,w,B,K,ot,f,c);return;case"select":at=v=w=q=null;for(f in a)if(B=a[f],a.hasOwnProperty(f)&&B!=null)switch(f){case"value":break;case"multiple":at=B;default:s.hasOwnProperty(f)||He(t,n,f,null,s,B)}for(c in s)if(f=s[c],B=a[c],s.hasOwnProperty(c)&&(f!=null||B!=null))switch(c){case"value":f!==B&&(Le=!0),q=f;break;case"defaultValue":f!==B&&(Le=!0),w=f;break;case"multiple":f!==B&&(Le=!0),v=f;default:f!==B&&He(t,n,c,f,s,B)}n=w,a=v,s=at,q!=null?cs(t,!!a,q,!1):!!s!=!!a&&(n!=null?cs(t,!!a,n,!0):cs(t,!!a,a?[]:"",!1));return;case"textarea":at=q=null;for(w in a)if(c=a[w],a.hasOwnProperty(w)&&c!=null&&!s.hasOwnProperty(w))switch(w){case"value":break;case"children":break;default:He(t,n,w,null,s,c)}for(v in s)if(c=s[v],f=a[v],s.hasOwnProperty(v)&&(c!=null||f!=null))switch(v){case"value":c!==f&&(Le=!0),q=c;break;case"defaultValue":c!==f&&(Le=!0),at=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(r(91));break;default:c!==f&&He(t,n,v,c,s,f)}Dm(t,q,at);return;case"option":for(var It in a)if(q=a[It],a.hasOwnProperty(It)&&q!=null&&!s.hasOwnProperty(It))switch(It){case"selected":t.selected=!1;break;default:He(t,n,It,null,s,q)}for(B in s)if(q=s[B],at=a[B],s.hasOwnProperty(B)&&q!==at&&(q!=null||at!=null))switch(B){case"selected":q!==at&&(Le=!0),t.selected=q&&typeof q!="function"&&typeof q!="symbol";break;default:He(t,n,B,q,s,at)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var Kt in a)q=a[Kt],a.hasOwnProperty(Kt)&&q!=null&&!s.hasOwnProperty(Kt)&&He(t,n,Kt,null,s,q);for(K in s)if(q=s[K],at=a[K],s.hasOwnProperty(K)&&q!==at&&(q!=null||at!=null))switch(K){case"children":case"dangerouslySetInnerHTML":if(q!=null)throw Error(r(137,n));break;default:He(t,n,K,q,s,at)}return;default:if(sf(n)){for(var pe in a)q=a[pe],a.hasOwnProperty(pe)&&q!==void 0&&!s.hasOwnProperty(pe)&&ad(t,n,pe,void 0,s,q);for(ot in s)q=s[ot],at=a[ot],!s.hasOwnProperty(ot)||q===at||q===void 0&&at===void 0||ad(t,n,ot,q,s,at);return}}for(var Z in a)q=a[Z],a.hasOwnProperty(Z)&&q!=null&&!s.hasOwnProperty(Z)&&He(t,n,Z,null,s,q);for(yt in s)q=s[yt],at=a[yt],!s.hasOwnProperty(yt)||q===at||q==null&&at==null||He(t,n,yt,q,s,at)}function F0(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function BM(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,a=performance.getEntriesByType("resource"),s=0;s<a.length;s++){var c=a[s],f=c.transferSize,v=c.initiatorType,w=c.duration;if(f&&w&&F0(v)){for(v=0,w=c.responseEnd,s+=1;s<a.length;s++){var B=a[s],K=B.startTime;if(K>w)break;var ot=B.transferSize,yt=B.initiatorType;ot&&F0(yt)&&(B=B.responseEnd,v+=ot*(B<w?1:(w-K)/(B-K)))}if(--s,n+=8*(f+v)/(c.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var rd=null,sd=null;function sl(t){return t.nodeType===9?t:t.ownerDocument}function k0(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function H0(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function G0(t,n,a,s){return a=sl(a).createElement(t),a[Lt]=s,a[Bt]=n,Ln(a,t,n),$e(a),a}function od(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var ld=null;function FM(){var t=window.event;return t&&t.type==="popstate"?t===ld?!1:(ld=t,!0):(ld=null,!1)}var cd=typeof setTimeout=="function"?setTimeout:void 0,kM=typeof clearTimeout=="function"?clearTimeout:void 0,V0=typeof Promise=="function"?Promise:void 0,j0=typeof requestAnimationFrame=="function"?requestAnimationFrame:cd,HM=typeof queueMicrotask=="function"?queueMicrotask:typeof V0<"u"?function(t){return V0.resolve(null).then(t).catch(GM)}:cd;function GM(t){setTimeout(function(){throw t})}function er(t){return t==="head"}function X0(t,n){var a=n,s=0;do{var c=a.nextSibling;if(t.removeChild(a),c&&c.nodeType===8)if(a=c.data,a==="/$"||a==="/&"){if(s===0){t.removeChild(c),Ys(n);return}s--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")s++;else if(a==="html")_d(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,_d(a);for(var f=a.firstChild;f;){var v=f.nextSibling,w=f.nodeName;f[Ze]||w==="SCRIPT"||w==="STYLE"||w==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=v}}else a==="body"&&_d(t.ownerDocument.body);a=c}while(a);Ys(n)}function W0(t,n){var a=t;t=0;do{var s=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),s&&s.nodeType===8)if(a=s.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=s}while(a)}function Y0(t,n,a){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,t.style.viewTransitionName=n,a!=null&&(t.style.viewTransitionClass=a),a=getComputedStyle(t),a.display==="inline"){if(n=t.getClientRects(),n.length===1)var s=1;else for(var c=s=0;c<n.length;c++){var f=n[c];0<f.width&&0<f.height&&s++}s===1&&(t=t.style,t.display=n.length===1?"inline-block":"block",t.marginTop="-"+a.paddingTop,t.marginBottom="-"+a.paddingBottom)}}function q0(t,n){t=t.style,n=n.style;var a=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;t.viewTransitionName=a==null||typeof a=="boolean"?"":(""+a).trim(),a=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,t.viewTransitionClass=a==null||typeof a=="boolean"?"":(""+a).trim(),t.display==="inline-block"&&(n==null?t.display=t.margin="":(a=n.display,t.display=a==null||typeof a=="boolean"?"":a,a=n.margin,a!=null?t.margin=a:(a=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],t.marginTop=a==null||typeof a=="boolean"?"":a,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],t.marginBottom=n==null||typeof n=="boolean"?"":n)))}function VM(t,n,a){return a=a.ownerDocument.defaultView,{rect:t,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=t.bottom&&0<=t.right&&t.top<=a.innerHeight&&t.left<=a.innerWidth}}function ud(t){var n=t.getBoundingClientRect(),a=getComputedStyle(t);return VM(n,a,t)}function jM(t){return t.documentElement.clientHeight}function XM(t){this.addEventListener("load",t),this.addEventListener("error",t)}function WM(t,n,a,s,c,f,v,w,B){var K=n.nodeType===9?n:n.ownerDocument;try{var ot=K.startViewTransition({update:function(){var q=K.defaultView,at=q.navigation&&q.navigation.transition,It=K.fonts.status;s();var Kt=[];if(It==="loaded"&&(jM(K),K.fonts.status==="loading"&&Kt.push(K.fonts.ready)),It=Kt.length,t!==null)for(var pe=t.suspenseyImages,Z=0,j=0;j<pe.length;j++){var nt=pe[j];if(!nt.complete){var _t=nt.getBoundingClientRect();if(0<_t.bottom&&0<_t.right&&_t.top<q.innerHeight&&_t.left<q.innerWidth){if(Z+=mv(nt),Z>Kc){Kt.length=It;break}nt=new Promise(XM.bind(nt)),Kt.push(nt)}}}if(0<Kt.length)return q=Promise.race([Promise.all(Kt),new Promise(function(Yt){return setTimeout(Yt,500)})]).then(c,c),(at?Promise.allSettled([at.finished,q]):q).then(f,f);if(c(),at)return at.finished.then(f,f);f()},types:a});K.__reactViewTransition=ot;var yt=[];return ot.ready.then(function(){for(var q=K.documentElement.getAnimations({subtree:!0}),at=0;at<q.length;at++){var It=q[at],Kt=It.effect,pe=Kt.pseudoElement;if(pe!=null&&pe.startsWith("::view-transition")){yt.push(It),It=Kt.getKeyframes();for(var Z=pe=void 0,j=!0,nt=0;nt<It.length;nt++){var _t=It[nt],Yt=_t.width;if(pe===void 0)pe=Yt;else if(pe!==Yt){j=!1;break}if(Yt=_t.height,Z===void 0)Z=Yt;else if(Z!==Yt){j=!1;break}delete _t.width,delete _t.height,_t.transform==="none"&&delete _t.transform}j&&pe!==void 0&&Z!==void 0&&(Kt.setKeyframes(It),j=getComputedStyle(Kt.target,Kt.pseudoElement),j.width!==pe||j.height!==Z)&&(j=It[0],j.width=pe,j.height=Z,j=It[It.length-1],j.width=pe,j.height=Z,Kt.setKeyframes(It))}}v()},function(q){K.__reactViewTransition===ot&&(K.__reactViewTransition=null);try{if(typeof q=="object"&&q!==null)switch(q.name){case"InvalidStateError":(q.message==="View transition was skipped because document visibility state is hidden."||q.message==="Skipping view transition because document visibility state has become hidden."||q.message==="Skipping view transition because viewport size changed."||q.message==="Transition was aborted because of invalid state")&&(q=null)}q!==null&&B(q)}finally{s(),c(),v()}}),ot.finished.finally(function(){for(var q=0;q<yt.length;q++)yt[q].cancel();K.__reactViewTransition===ot&&(K.__reactViewTransition=null),w()}),ot}catch{return s(),c(),v(),null}}function Vr(t,n){this._scope=document.documentElement,this._selector="::view-transition-"+t+"("+n+")"}Vr.prototype.animate=function(t,n){return n=typeof n=="number"?{duration:n}:L({},n),n.pseudoElement=this._selector,this._scope.animate(t,n)},Vr.prototype.getAnimations=function(){for(var t=this._scope,n=this._selector,a=t.getAnimations({subtree:!0}),s=[],c=0;c<a.length;c++){var f=a[c].effect;f!==null&&f.target===t&&f.pseudoElement===n&&s.push(a[c])}return s},Vr.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function Z0(t){return{name:t,group:new Vr("group",t),imagePair:new Vr("image-pair",t),old:new Vr("old",t),new:new Vr("new",t)}}function di(t){this._fragmentFiber=t,this._observers=this._eventListeners=null}di.prototype.addEventListener=function(t,n,a){var s=null,c=null;if(!(a!=null&&typeof a!="boolean"&&(s=a.signal||null,s!==null&&s.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var f=this._eventListeners;if(Q0(f,t,n,a)===-1){var v=this,w=n;a!=null&&typeof a!="boolean"&&a.once===!0&&(w=function(B){v.removeEventListener(t,n,a),typeof n=="function"?n.call(this,B):n.handleEvent(B)}),s!==null&&(c=v.removeEventListener.bind(v,t,n,a),s.addEventListener("abort",c,{once:!0}),c=s.removeEventListener.bind(s,"abort",c)),s=Hs(a),f.push({type:t,listener:n,optionsOrUseCapture:a,attachedListener:w,cleanup:c}),m(this._fragmentFiber.child,!1,YM,t,w,s)}this._eventListeners=f}};function YM(t,n,a,s){return M(t).addEventListener(n,a,s),!1}di.prototype.removeEventListener=function(t,n,a){var s=this._eventListeners;if(s!==null&&(n=Q0(s,t,n,a),n!==-1)){var c=s[n];a=c.attachedListener;var f=c.cleanup;c=Hs(c.optionsOrUseCapture),m(this._fragmentFiber.child,!1,qM,t,a,c),s.splice(n,1),f!==null&&f()}};function qM(t,n,a,s){return M(t).removeEventListener(n,a,s),!1}function Hs(t){return t!=null&&typeof t!="boolean"&&(t.once===!0||t.signal instanceof AbortSignal)?{capture:t.capture,passive:t.passive}:t}function K0(t){return t==null?"c=0":typeof t=="boolean"?"c="+(t?"1":"0"):"c="+(t.capture?"1":"0")}function Q0(t,n,a,s){if(t.length===0)return-1;s=K0(s);for(var c=0;c<t.length;c++){var f=t[c];if(f.type===n&&f.listener===a&&K0(f.optionsOrUseCapture)===s)return c}return-1}di.prototype.dispatchEvent=function(t){var n=y(this._fragmentFiber);if(n===null)return!0;n=M(n);var a=this._eventListeners;if(a!==null&&0<a.length||!t.bubbles){var s=n.nodeType===9?n.createComment(""):document.createTextNode("");if(a)for(var c=0;c<a.length;c++){var f=a[c];s.addEventListener(f.type,f.attachedListener,Hs(f.optionsOrUseCapture))}if(n.appendChild(s),t=s.dispatchEvent(t),a)for(c=0;c<a.length;c++)f=a[c],s.removeEventListener(f.type,f.attachedListener,Hs(f.optionsOrUseCapture));return n.removeChild(s),t}return n.dispatchEvent(t)},di.prototype.focus=function(t){m(this._fragmentFiber.child,!0,J0,t,void 0,void 0)};function J0(t,n){return t.tag===6?!1:(t=M(t),sE(t,n))}di.prototype.focusLast=function(t){var n=[];m(this._fragmentFiber.child,!0,fd,n,void 0,void 0);for(var a=n.length-1;0<=a&&!J0(n[a],t);a--);};function fd(t,n){return n.push(t),!1}di.prototype.blur=function(){var t=y(this._fragmentFiber);t!==null&&(t=M(t),t=sl(t).activeElement,t!==null&&m(this._fragmentFiber.child,!1,ZM,t,void 0,void 0))};function ZM(t,n){return t.tag===6?!1:(t=M(t),t===n||t.contains(n)?(n.blur(),!0):!1)}di.prototype.observeUsing=function(t){this._observers===null&&(this._observers=new Set),this._observers.add(t),m(this._fragmentFiber.child,!1,KM,t,void 0,void 0)};function KM(t,n){return t.tag===6||(t=M(t),n.observe(t)),!1}di.prototype.unobserveUsing=function(t){var n=this._observers;if(n!==null&&n.has(t)){n.delete(t),m(this._fragmentFiber.child,!1,QM,t,void 0,void 0);for(var a=n=0;a<Oi.length;a++){var s=Oi[a];s.fragmentInstance===this&&s.observer===t?t.unobserve(s.instance):Oi[n++]=s}Oi.length=n}};function QM(t,n){return t.tag===6||(t=M(t),n.unobserve(t)),!1}var Oi=[],hd=!1;function JM(t,n,a){Oi.push({fragmentInstance:t,observer:n,instance:a}),hd||(hd=!0,oE(function(){hd=!1;var s=Oi;Oi=[];for(var c=0;c<s.length;c++){var f=s[c];f.observer.unobserve(f.instance)}}))}di.prototype.getClientRects=function(){var t=[];return m(this._fragmentFiber.child,!1,$M,t,void 0,void 0),t};function $M(t,n){if(t.tag===6){t=t.stateNode;var a=t.ownerDocument.createRange();a.selectNodeContents(t),n.push.apply(n,a.getClientRects())}else t=M(t),n.push.apply(n,t.getClientRects());return!1}di.prototype.getRootNode=function(t){var n=y(this._fragmentFiber);return n===null?this:M(n).getRootNode(t)},di.prototype.compareDocumentPosition=function(t){var n=y(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var a=[];m(this._fragmentFiber.child,!1,fd,a,void 0,void 0);var s=M(n);if(a.length===0){if(a=s,x(this._fragmentFiber)){t:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break t}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(a=n)}n=this._fragmentFiber;var c=s=a.compareDocumentPosition(t);return a===t?c=Node.DOCUMENT_POSITION_CONTAINS:s&Node.DOCUMENT_POSITION_CONTAINED_BY&&(a=b(n)[1],a===null?c=Node.DOCUMENT_POSITION_PRECEDING:(t=M(a).compareDocumentPosition(t),c=t===0||t&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),c|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=M(a[0]),c=M(a[a.length-1]);var f=x(this._fragmentFiber)?n.parentElement:s;if(f==null)return Node.DOCUMENT_POSITION_DISCONNECTED;s=f.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,f=f.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_CONTAINED_BY;var v=n.compareDocumentPosition(t),w=c.compareDocumentPosition(t),B=v&Node.DOCUMENT_POSITION_CONTAINED_BY||w&Node.DOCUMENT_POSITION_CONTAINED_BY;return w=s&&f&&v&Node.DOCUMENT_POSITION_FOLLOWING&&w&Node.DOCUMENT_POSITION_PRECEDING,n=s&&n===t||f&&c===t||B||w?Node.DOCUMENT_POSITION_CONTAINED_BY:!s&&n===t||!f&&c===t?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:v,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||tE(n,this._fragmentFiber,a[0],a[a.length-1],t)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function tE(t,n,a,s,c){var f=Jt(c);if(t&Node.DOCUMENT_POSITION_CONTAINED_BY){if(a=!!f)t:{for(;f!==null;){if(f.tag===7&&(f===n||f.alternate===n)){a=!0;break t}f=f.return}a=!1}return a}if(t&Node.DOCUMENT_POSITION_CONTAINS){if(f===null)return f=c.ownerDocument,c===f||c===f.documentElement||c===f.body;t:{for(f=n,n=y(n);f!==null;){if(!(f.tag!==5&&f.tag!==3&&f.tag!==27||f!==n&&f.alternate!==n)){f=!0;break t}f=f.return}f=!1}return f}return t&Node.DOCUMENT_POSITION_PRECEDING?((n=!!f)&&!(n=f===a)&&(n=P(a,f,F),n===null?n=!1:(m(n,!0,I,f,a),f=S,S=null,n=f!==null)),n):t&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!f)&&!(n=f===s)&&(n=P(s,f,F),n===null?n=!1:(m(n,!0,z,f,s),f=S,G=S=null,n=f!==null)),n):!1}function $0(t,n){var a=t.ownerDocument.createRange();a.selectNodeContents(t),t=a.getBoundingClientRect(),window.scrollTo(window.scrollX+t.left,n?window.scrollY+t.top:window.scrollY+t.bottom-window.innerHeight)}di.prototype.scrollIntoView=function(t){if(typeof t=="object")throw Error(r(566));var n=[];m(this._fragmentFiber.child,!1,fd,n,void 0,void 0);var a=t!==!1;if(n.length===0){var s=b(this._fragmentFiber);if(s=a?s[1]||s[0]||y(this._fragmentFiber):s[0]||s[1],s===null)return;if(s.tag===6){t=M(s),$0(t,a);return}if(s=M(s),s.nodeType!==9){if(s.nodeType===11){a="host"in s?s.host:null,a!==null&&a.scrollIntoView(t);return}s.scrollIntoView(t)}}for(s=a?n.length-1:0;s!==(a?-1:n.length);){var c=n[s];c.tag===6?(c=M(c),$0(c,a)):M(c).scrollIntoView(t),s+=a?-1:1}};function eE(t,n){return t=M(t),tv(t,n),!1}function tv(t,n){t.reactFragments==null&&(t.reactFragments=new Set),t.reactFragments.add(n)}function ev(t,n){var a=n._eventListeners;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s];t.addEventListener(c.type,c.attachedListener,Hs(c.optionsOrUseCapture))}t.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){for(var v=0,w=0;w<Oi.length;w++){var B=Oi[w];(B.fragmentInstance!==n||B.observer!==f||B.instance!==t)&&(Oi[v++]=B)}Oi.length=v,f.observe(t)}),tv(t,n))}function nE(t,n){var a=n._eventListeners;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s];t.removeEventListener(c.type,c.attachedListener,Hs(c.optionsOrUseCapture))}t.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){typeof f.rootMargin=="string"?JM(n,f,t):f.unobserve(t)}),t.reactFragments!=null&&t.reactFragments.delete(n))}function dd(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":dd(a),Se(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function iE(t,n,a,s){for(;t.nodeType===1;){var c=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!s&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(s){if(!t[Ze])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(f=t.getAttribute("rel"),f==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(f!==c.rel||t.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||t.getAttribute("title")!==(c.title==null?null:c.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(f=t.getAttribute("src"),(f!==(c.src==null?null:c.src)||t.getAttribute("type")!==(c.type==null?null:c.type)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&f&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var f=c.name==null?null:""+c.name;if(c.type==="hidden"&&t.getAttribute("name")===f)return t}else return t;if(t=bi(t.nextSibling),t===null)break}return null}function aE(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=bi(t.nextSibling),t===null))return null;return t}function nv(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=bi(t.nextSibling),t===null))return null;return t}function pd(t){return t.data==="$?"||t.data==="$~"}function md(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function rE(t,n){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||a.readyState!=="loading")n();else{var s=function(){n(),a.removeEventListener("DOMContentLoaded",s)};a.addEventListener("DOMContentLoaded",s),t._reactRetry=s}}function bi(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var gd=null;function iv(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(n===0)return bi(t.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}t=t.nextSibling}return null}function av(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return t;n--}else a!=="/$"&&a!=="/&"||n++}t=t.previousSibling}return null}function sE(t,n){function a(){s=!0}if(t.ownerDocument.activeElement===t)return!0;var s=!1;try{t.ownerDocument.addEventListener("focus",a,!0),(t.focus||HTMLElement.prototype.focus).call(t,n)}finally{t.ownerDocument.removeEventListener("focus",a,!0)}return s}function oE(t){j0(function(){j0(function(n){return t(n)})})}function rv(t,n,a){switch(n=sl(a),t){case"html":if(t=n.documentElement,!t)throw Error(r(452));return t;case"head":if(t=n.head,!t)throw Error(r(453));return t;case"body":if(t=n.body,!t)throw Error(r(454));return t;default:throw Error(r(451))}}function sv(t,n,a){for(var s in a){var c=a[s];a.hasOwnProperty(s)&&c!=null&&He(t,n,s,null,PM,c)}a.dangerouslySetInnerHTML!=null&&(t.textContent=""),t.onclick===Vi&&(t.onclick=null),Se(t)}function _d(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);Se(t)}var Ti=new Map,ov=new Set;function ol(t){if(typeof t.getRootNode=="function"){var n=t.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return t.nodeType===9?t:t.ownerDocument}var Ma=zt.d;zt.d={f:lE,r:cE,D:uE,C:fE,L:hE,m:dE,X:mE,S:pE,M:gE};function lE(){var t=Ma.f(),n=Hc();return t||n}function cE(t){var n=en(t);n!==null&&n.tag===5&&n.type==="form"?c_(n):Ma.r(t)}var Gs=typeof document>"u"?null:document;function lv(t,n,a){var s=Gs;if(s&&typeof n=="string"&&n){var c=_i(n);c='link[rel="'+t+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),ov.has(c)||(ov.add(c),t={rel:t,crossOrigin:a,href:n},s.querySelector(c)===null&&(n=s.createElement("link"),Ln(n,"link",t),$e(n),s.head.appendChild(n)))}}function uE(t){Ma.D(t),lv("dns-prefetch",t,null)}function fE(t,n){Ma.C(t,n),lv("preconnect",t,n)}function hE(t,n,a){Ma.L(t,n,a);var s=Gs;if(s&&t&&n){var c='link[rel="preload"][as="'+_i(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+_i(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+_i(a.imageSizes)+'"]')):c+='[href="'+_i(t)+'"]';var f=c;switch(n){case"style":f=Vs(t);break;case"script":f=js(t)}if(!(Ti.has(f)||(t=L({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),Ti.set(f,t),s.querySelector(c)!==null||n==="style"&&s.querySelector(ll(f))||n==="script"&&s.querySelector(cl(f))))){var v=s.createElement("link");Ln(v,"link",t),n==="style"&&(v[We]=!0,v.onload=v.onerror=function(){Fn(v)}),$e(v),s.head.appendChild(v)}}}function dE(t,n){Ma.m(t,n);var a=Gs;if(a&&t){var s=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+_i(s)+'"][href="'+_i(t)+'"]',f=c;switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=js(t)}if(!Ti.has(f)&&(t=L({rel:"modulepreload",href:t},n),Ti.set(f,t),a.querySelector(c)===null)){switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(cl(f)))return}s=a.createElement("link"),Ln(s,"link",t),$e(s),a.head.appendChild(s)}}}function pE(t,n,a){Ma.S(t,n,a);var s=Gs;if(s&&t){var c=En(s).hoistableStyles,f=Vs(t);n=n||"default";var v=c.get(f);if(!v){var w={loading:0,preload:null};if(v=s.querySelector(ll(f)))w.loading=5;else{t=L({rel:"stylesheet",href:t,"data-precedence":n},a),(a=Ti.get(f))&&vd(t,a);var B=v=s.createElement("link");$e(B),Ln(B,"link",t),B._p=new Promise(function(K,ot){B.onload=K,B.onerror=ot}),B.addEventListener("load",function(){w.loading|=1}),B.addEventListener("error",function(){w.loading|=2}),w.loading|=4,qc(v,n,s)}v={type:"stylesheet",instance:v,count:1,state:w},c.set(f,v)}}}function mE(t,n){Ma.X(t,n);var a=Gs;if(a&&t){var s=En(a).hoistableScripts,c=js(t),f=s.get(c);f||(f=a.querySelector(cl(c)),f||(t=L({src:t,async:!0},n),(n=Ti.get(c))&&yd(t,n),f=a.createElement("script"),$e(f),Ln(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function gE(t,n){Ma.M(t,n);var a=Gs;if(a&&t){var s=En(a).hoistableScripts,c=js(t),f=s.get(c);f||(f=a.querySelector(cl(c)),f||(t=L({src:t,async:!0,type:"module"},n),(n=Ti.get(c))&&yd(t,n),f=a.createElement("script"),$e(f),Ln(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function cv(t,n,a,s){var c=(c=O.current)?ol(c):null;if(!c)throw Error(r(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(a=Vs(a.href),n=En(c).hoistableStyles,s=n.get(a),s||(s={type:"style",instance:null,count:0,state:null},n.set(a,s)),s):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=Vs(a.href);var f=En(c).hoistableStyles,v=f.get(t);if(v||(c=c.ownerDocument||c,v={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(t,v),(f=c.querySelector(ll(t)))?f._p||(v.instance=f,v.state.loading=5):(f=Ti.get(t),f||(f={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ti.set(t,f)),_E(c,t,f,v.state))),n&&s===null)throw Error(r(528,""));return v}if(n&&s!==null)throw Error(r(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(a=js(a),n=En(c).hoistableScripts,s=n.get(a),s||(s={type:"script",instance:null,count:0,state:null},n.set(a,s)),s):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,t))}}function Vs(t){return'href="'+_i(t)+'"'}function ll(t){return'link[rel="stylesheet"]['+t+"]"}function uv(t){return L({},t,{"data-precedence":t.precedence,precedence:null})}function _E(t,n,a,s){if(n=t.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[We]!==!0){s.loading=1;return}}else n=t.createElement("link"),n[We]=!0,n.onload=n.onerror=Fn.bind(null,n),Ln(n,"link",a),$e(n),t.head.appendChild(n);s.preload=n,n.addEventListener("load",function(){return s.loading|=1}),n.addEventListener("error",function(){return s.loading|=2})}function js(t){return'[src="'+_i(t)+'"]'}function cl(t){return"script[async]"+t}function fv(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var s=t.querySelector('style[data-href~="'+_i(a.href)+'"]');if(s)return n.instance=s,$e(s),s;var c=L({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return s=(t.ownerDocument||t).createElement("style"),$e(s),Ln(s,"style",c),qc(s,a.precedence,t),n.instance=s;case"stylesheet":c=Vs(a.href);var f=t.querySelector(ll(c));if(f)return n.state.loading|=4,n.instance=f,$e(f),f;s=uv(a),(c=Ti.get(c))&&vd(s,c),f=(t.ownerDocument||t).createElement("link"),$e(f);var v=f;return v._p=new Promise(function(w,B){v.onload=w,v.onerror=B}),Ln(f,"link",s),n.state.loading|=4,qc(f,a.precedence,t),n.instance=f;case"script":return f=js(a.src),(c=t.querySelector(cl(f)))?(n.instance=c,$e(c),c):(s=a,(c=Ti.get(f))&&(s=L({},a),yd(s,c)),t=t.ownerDocument||t,c=t.createElement("script"),$e(c),Ln(c,"link",s),t.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(r(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(s=n.instance,n.state.loading|=4,qc(s,a.precedence,t));return n.instance}function qc(t,n,a){for(var s=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=s.length?s[s.length-1]:null,f=c,v=0;v<s.length;v++){var w=s[v];if(w.dataset.precedence===n)f=w;else if(f!==c)break}f?f.parentNode.insertBefore(t,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function vd(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function yd(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var Zc=null;function hv(t,n,a){if(Zc===null){var s=new Map,c=Zc=new Map;c.set(a,s)}else c=Zc,s=c.get(a),s||(s=new Map,c.set(a,s));if(s.has(t))return s;for(s.set(t,null),a=a.getElementsByTagName(t),c=0;c<a.length;c++){var f=a[c];if(!(f[Ze]||f[Lt]||t==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var v=f.getAttribute(n)||"";v=t+v;var w=s.get(v);w?w.push(f):s.set(v,[f])}}return s}function xd(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function vE(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return t=n.disabled,typeof n.precedence=="string"&&t==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function dv(t,n){return t==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function pv(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function mv(t){return(t.width||100)*(t.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function gv(t,n){typeof n.decode=="function"&&(t.imgCount++,n.complete||(t.imgBytes+=mv(n),t.suspenseyImages.push(n)),t=SE.bind(t),n.decode().then(t,t))}function yE(t,n,a,s){if(a.type==="stylesheet"&&(typeof s.media!="string"||matchMedia(s.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var c=Vs(s.href),f=n.querySelector(ll(c));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=ul.bind(t),n.then(t,t)),a.state.loading|=4,a.instance=f,$e(f);return}f=n.ownerDocument||n,s=uv(s),(c=Ti.get(c))&&vd(s,c),f=f.createElement("link"),$e(f);var v=f;v._p=new Promise(function(w,B){v.onload=w,v.onerror=B}),Ln(f,"link",s),a.instance=f}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=ul.bind(t),n.addEventListener("load",a),n.addEventListener("error",a))}}var Kc=0;function xE(t,n){return t.stylesheets&&t.count===0&&Jc(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var s=setTimeout(function(){if(t.stylesheets&&Jc(t,t.stylesheets),t.unsuspend){var f=t.unsuspend;t.unsuspend=null,f()}},6e4+n);0<t.imgBytes&&Kc===0&&(Kc=62500*BM());var c=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&Jc(t,t.stylesheets),t.unsuspend)){var f=t.unsuspend;t.unsuspend=null,f()}},(t.imgBytes>Kc?50:800)+n);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(s),clearTimeout(c)}}:null}function _v(t){if(t.count===0&&(t.imgCount===0||!t.waitingForImages)){if(t.stylesheets)Jc(t,t.stylesheets);else if(t.unsuspend){var n=t.unsuspend;t.unsuspend=null,n()}}}function ul(){this.count--,_v(this)}function SE(){this.imgCount--,_v(this)}var Qc=null;function Jc(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Qc=new Map,n.forEach(ME,t),Qc=null,ul.call(t))}function ME(t,n){if(!(n.state.loading&4)){var a=Qc.get(t);if(a)var s=a.get(null);else{a=new Map,Qc.set(t,a);for(var c=t.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<c.length;f++){var v=c[f];(v.nodeName==="LINK"||v.getAttribute("media")!=="not all")&&(a.set(v.dataset.precedence,v),s=v)}s&&a.set(null,s)}c=n.instance,v=c.getAttribute("data-precedence"),f=a.get(v)||s,f===s&&a.set(null,c),a.set(v,c),this.count++,s=ul.bind(this),c.addEventListener("load",s),c.addEventListener("error",s),f?f.parentNode.insertBefore(c,f.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(c,t.firstChild)),n.state.loading|=4}}var Xs={$$typeof:ft,Provider:null,Consumer:null,_currentValue:se,_currentValue2:se,_threadCount:0};function EE(t,n,a,s,c,f,v,w,B){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=To(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=To(0),this.hiddenUpdates=To(null),this.identifierPrefix=s,this.onUncaughtError=c,this.onCaughtError=f,this.onRecoverableError=v,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=B,this.transitionTypes=null,this.incompleteTransitions=new Map}function vv(t,n,a,s,c,f,v,w,B,K,ot,yt){return t=new EE(t,n,a,v,B,K,ot,yt,w),n=1,f===!0&&(n|=24),f=Qn(3,null,null,n),t.current=f,f.stateNode=t,n=Of(),n.refCount++,t.pooledCache=n,n.refCount++,f.memoizedState={element:s,isDehydrated:a,cache:n},Ff(f),t}function yv(t){return t?(t=_s,t):_s}function xv(t,n,a,s,c,f){c=yv(c),s.context===null?s.context=c:s.pendingContext=c,s=Va(n),s.payload={element:a},f=f===void 0?null:f,f!==null&&(s.callback=f),a=ja(t,s,n),a!==null&&(ei(a,t,n),Ho(a,t,n))}function Sv(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function Sd(t,n){Sv(t,n),(t=t.alternate)&&Sv(t,n)}function Mv(t){if(t.tag===13||t.tag===31){var n=wr(t,67108864);n!==null&&ei(n,t,67108864),Sd(t,67108864)}}function Ev(t){if(t.tag===13||t.tag===31){var n=hi();n=lt(n);var a=wr(t,n);a!==null&&ei(a,t,n),Sd(t,n)}}var Ws=!0;function bE(t,n,a,s){var c=Dt.T;Dt.T=null;var f=zt.p;try{zt.p=2,Md(t,n,a,s)}finally{zt.p=f,Dt.T=c}}function TE(t,n,a,s){var c=Dt.T;Dt.T=null;var f=zt.p;try{zt.p=8,Md(t,n,a,s)}finally{zt.p=f,Dt.T=c}}function Md(t,n,a,s){if(Ws){var c=Ed(s);if(c===null)id(t,n,s,$c,a),Tv(t,s);else if(AE(c,t,n,a,s))s.stopPropagation();else if(Tv(t,s),n&4&&-1<wE.indexOf(t)){for(;c!==null;){var f=en(c);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var v=Gi(f.pendingLanes);if(v!==0){var w=f;for(w.pendingLanes|=2,w.entangledLanes|=2;v;){var B=1<<31-Bn(v);w.entanglements[1]|=B,v&=~B}$i(f),(Ie&6)===0&&(Bc=U()+500,il(0))}}break;case 31:case 13:w=wr(f,2),w!==null&&ei(w,f,2),Hc(),Sd(f,2)}if(f=Ed(s),f===null&&id(t,n,s,$c,a),f===c)break;c=f}c!==null&&s.stopPropagation()}else id(t,n,s,null,a)}}function Ed(t){return t=lf(t),bd(t)}var $c=null;function bd(t){if($c=null,t=Jt(t),t!==null){var n=u(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=h(n),t!==null)return t;t=null}else if(a===31){if(t=d(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return $c=t,null}function bv(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Tt()){case st:return 2;case xt:return 8;case kt:case Ot:return 32;case ce:return 268435456;default:return 32}default:return 32}}var Td=!1,nr=null,ir=null,ar=null,fl=new Map,hl=new Map,rr=[],wE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Tv(t,n){switch(t){case"focusin":case"focusout":nr=null;break;case"dragenter":case"dragleave":ir=null;break;case"mouseover":case"mouseout":ar=null;break;case"pointerover":case"pointerout":fl.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":hl.delete(n.pointerId)}}function dl(t,n,a,s,c,f){return t===null||t.nativeEvent!==f?(t={blockedOn:n,domEventName:a,eventSystemFlags:s,nativeEvent:f,targetContainers:[c]},n!==null&&(n=en(n),n!==null&&Mv(n)),t):(t.eventSystemFlags|=s,n=t.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),t)}function AE(t,n,a,s,c){switch(n){case"focusin":return nr=dl(nr,t,n,a,s,c),!0;case"dragenter":return ir=dl(ir,t,n,a,s,c),!0;case"mouseover":return ar=dl(ar,t,n,a,s,c),!0;case"pointerover":var f=c.pointerId;return fl.set(f,dl(fl.get(f)||null,t,n,a,s,c)),!0;case"gotpointercapture":return f=c.pointerId,hl.set(f,dl(hl.get(f)||null,t,n,a,s,c)),!0}return!1}function wv(t){var n=Jt(t.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){t.blockedOn=n,wt(t.priority,function(){Ev(a)});return}}else if(n===31){if(n=d(a),n!==null){t.blockedOn=n,wt(t.priority,function(){Ev(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function tu(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=Ed(t.nativeEvent);if(a===null){a=t.nativeEvent;var s=new a.constructor(a.type,a);of=s,a.target.dispatchEvent(s),of=null}else return n=en(a),n!==null&&Mv(n),t.blockedOn=a,!1;n.shift()}return!0}function Av(t,n,a){tu(t)&&a.delete(n)}function RE(){Td=!1,nr!==null&&tu(nr)&&(nr=null),ir!==null&&tu(ir)&&(ir=null),ar!==null&&tu(ar)&&(ar=null),fl.forEach(Av),hl.forEach(Av)}function eu(t,n){t.blockedOn===n&&(t.blockedOn=null,Td||(Td=!0,o.unstable_scheduleCallback(o.unstable_NormalPriority,RE)))}var nu=null;function Rv(t){nu!==t&&(nu=t,o.unstable_scheduleCallback(o.unstable_NormalPriority,function(){nu===t&&(nu=null);for(var n=0;n<t.length;n+=3){var a=t[n],s=t[n+1],c=t[n+2];if(typeof s!="function"){if(bd(s||a)===null)continue;break}var f=en(a);f!==null&&(t.splice(n,3),n-=3,sh(f,{pending:!0,data:c,method:a.method,action:s},s,c))}}))}function Ys(t){function n(B){return eu(B,t)}nr!==null&&eu(nr,t),ir!==null&&eu(ir,t),ar!==null&&eu(ar,t),fl.forEach(n),hl.forEach(n);for(var a=0;a<rr.length;a++){var s=rr[a];s.blockedOn===t&&(s.blockedOn=null)}for(;0<rr.length&&(a=rr[0],a.blockedOn===null);)wv(a),a.blockedOn===null&&rr.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(s=0;s<a.length;s+=3){var c=a[s],f=a[s+1],v=c[Bt]||null;if(typeof f=="function")v||Rv(a);else if(v){var w=null;if(f&&f.hasAttribute("formAction")){if(c=f,v=f[Bt]||null)w=v.formAction;else if(bd(c)!==null)continue}else w=v.action;typeof w=="function"?a[s+1]=w:(a.splice(s,3),s-=3),Rv(a)}}}function Cv(){function t(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(v){return c=v})},focusReset:"manual",scroll:"manual"})}function n(){c!==null&&(c(),c=null),s||setTimeout(a,20)}function a(){if(!s&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var s=!1,c=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){s=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),c!==null&&(c(),c=null)}}}function wd(t){this._internalRoot=t}iu.prototype.render=wd.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(r(409));var a=n.current,s=hi();xv(a,s,t,n,null,null)},iu.prototype.unmount=wd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;xv(t.current,2,null,t,null,null),Hc(),n[ae]=null}};function iu(t){this._internalRoot=t}iu.prototype.unstable_scheduleHydration=function(t){if(t){var n=J();t={blockedOn:null,target:t,priority:n};for(var a=0;a<rr.length&&n!==0&&n<rr[a].priority;a++);rr.splice(a,0,t),a===0&&wv(t)}};var Dv=e.version;if(Dv!=="19.3.1")throw Error(r(527,Dv,"19.3.1"));zt.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(r(188)):(t=Object.keys(t).join(","),Error(r(268,t)));return t=g(n),t=t!==null?_(t):null,t=t===null?null:t.stateNode,t};var CE={bundleType:0,version:"19.3.1",rendererPackageName:"react-dom",currentDispatcherRef:Dt,reconcilerVersion:"19.3.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var au=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!au.isDisabled&&au.supportsFiber)try{Ce=au.inject(CE),Je=au}catch{}}return ml.createRoot=function(t,n){if(!l(t))throw Error(r(299));var a=!1,s="",c=y_,f=x_,v=S_;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(v=n.onRecoverableError)),n=vv(t,1,!1,null,null,a,s,null,c,f,v,Cv),t[ae]=n.current,nd(t),new wd(n)},ml.hydrateRoot=function(t,n,a){if(!l(t))throw Error(r(299));var s=!1,c="",f=y_,v=x_,w=S_,B=null;return a!=null&&(a.unstable_strictMode===!0&&(s=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(v=a.onCaughtError),a.onRecoverableError!==void 0&&(w=a.onRecoverableError),a.formState!==void 0&&(B=a.formState)),n=vv(t,1,!0,n,a??null,s,c,B,f,v,w,Cv),n.context=yv(null),a=n.current,s=hi(),s=lt(s),c=Va(s),c.callback=null,ja(a,c,s),a=s,n.current.lanes=a,Er(n,a),$i(n),t[ae]=n.current,nd(t),new iu(n)},ml.version="19.3.1",ml}var kv;function HE(){if(kv)return Cd.exports;kv=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),Cd.exports=kE(),Cd.exports}var GE=HE();const VE=cx(GE),Oe={MAX_CHARS:5e4,MAX_TOKENS:1e4,MAX_BRACKET_DEPTH:32,MAX_ACTIVE_FRAMES:32,MAX_OPERATIONS:1e4,MAX_SEGMENTS:1e4,MAX_COORD:1e5,MIN_WIDTH:1,MAX_WIDTH:12,MIN_REPEAT:0,MAX_REPEAT:1e4},jE="#16866a",XE=3,Hv=/^[\p{L}_]$/u,ru=/^[\p{L}\p{N}_]$/u,WE=/^#[0-9a-fA-F]{6}$/;function YE(o){return o===" "||o==="	"||o==="\r"||o===`
`}function gl(o){return o>="0"&&o<="9"}function ku(o){return o.toLocaleLowerCase("pl-PL")}function qE(o){if(o.length>Oe.MAX_CHARS)return{tokens:[],error:{message:`Program przekracza limit ${Oe.MAX_CHARS.toLocaleString("pl-PL")} znaków.`,line:1,column:1}};const e=[];let i=0,r=1,l=1,u=!1,h=!0;const d=(p,g,_,m,y,x,b)=>{if(p!=="EOF"&&e.length>=Oe.MAX_TOKENS)return{message:`Program przekracza limit ${Oe.MAX_TOKENS.toLocaleString("pl-PL")} tokenów.`,line:_,column:m};const T=b===void 0||YE(b)||b===";";return e.push({type:p,value:g,normalized:ku(g),line:_,column:m,atLineStart:y,spaceBefore:x,spaceAfter:T}),null};for(;i<o.length;){const p=o[i];if(p===" "||p==="	"||p==="\r"){h=!0,i++,l++;continue}if(p===`
`){h=!0,u=!1,i++,r++,l=1;continue}if(p===";"){for(h=!0;i<o.length&&o[i]!==`
`;)i++,l++;continue}const g=r,_=l,m=!u,y=h;if(u=!0,h=!1,p==="["){i++,l++;const x=d("LBRACKET","[",g,_,m,y,o[i]);if(x)return{tokens:[],error:x};continue}if(p==="]"){i++,l++;const x=d("RBRACKET","]",g,_,m,y,o[i]);if(x)return{tokens:[],error:x};continue}if(p==="("){i++,l++;const x=d("LPAREN","(",g,_,m,y,o[i]);if(x)return{tokens:[],error:x};continue}if(p===")"){i++,l++;const x=d("RPAREN",")",g,_,m,y,o[i]);if(x)return{tokens:[],error:x};continue}if(p===","){i++,l++;const x=d("COMMA",",",g,_,m,y,o[i]);if(x)return{tokens:[],error:x};continue}if(p==="+"||p==="-"||p==="*"||p==="/"){i++,l++;const b=d(p==="+"?"PLUS":p==="-"?"MINUS":p==="*"?"STAR":"SLASH",p,g,_,m,y,o[i]);if(b)return{tokens:[],error:b};continue}if(p==="="){i++,l++;const x=d("EQ","=",g,_,m,y,o[i]);if(x)return{tokens:[],error:x};continue}if(p==="<"){if(o[i+1]==="="){i+=2,l+=2;const x=d("LTE","<=",g,_,m,y,o[i]);if(x)return{tokens:[],error:x}}else if(o[i+1]===">"){i+=2,l+=2;const x=d("NEQ","<>",g,_,m,y,o[i]);if(x)return{tokens:[],error:x}}else{i++,l++;const x=d("LT","<",g,_,m,y,o[i]);if(x)return{tokens:[],error:x}}continue}if(p===">"){if(o[i+1]==="="){i+=2,l+=2;const x=d("GTE",">=",g,_,m,y,o[i]);if(x)return{tokens:[],error:x}}else{i++,l++;const x=d("GT",">",g,_,m,y,o[i]);if(x)return{tokens:[],error:x}}continue}if(p==='"'){i++,l++;let x="",b=!1;for(;i<o.length&&o[i]!==`
`;){if(o[i]==='"'){i++,l++,b=!0;break}x+=o[i],i++,l++}if(!b)return{tokens:[],error:{message:'Niezamknięty literał koloru — oczekiwano zamykającego cudzysłowu `"` oraz formatu `"#rrggbb"`.',line:g,column:_}};if(!WE.test(x))return{tokens:[],error:{message:`Nieprawidłowy kolor "${x}". Podaj sześć cyfr szesnastkowych w formacie "#rrggbb", np. "#16866a".`,line:g,column:_}};const T=d("COLOR",x.toLowerCase(),g,_,m,y,o[i]);if(T)return{tokens:[],error:T};continue}if(gl(p)||p==="."&&i+1<o.length&&gl(o[i+1])){let x="",b=!1;for(p==="."&&(b=!0,x+=".",i++,l++);i<o.length&&gl(o[i]);)x+=o[i],i++,l++;if(!b&&i<o.length&&o[i]==="."){if(b=!0,x+=".",i++,l++,i>=o.length||!gl(o[i]))return{tokens:[],error:{message:`Nieprawidłowa liczba „${x}”. Po kropce dziesiętnej musi wystąpić cyfra.`,line:g,column:_}};for(;i<o.length&&gl(o[i]);)x+=o[i],i++,l++}if(i<o.length&&(ru.test(o[i])||o[i]===".")){let M=x;for(;i<o.length&&(ru.test(o[i])||o[i]===".");)M+=o[i],i++,l++;return{tokens:[],error:{message:`Nieprawidłowy zapis liczby „${M}”. Dozwolone są wyłącznie liczby dziesiętne (np. 80, 12.5, .5).`,line:g,column:_}}}const T=d("NUMBER",x,g,_,m,y,o[i]);if(T)return{tokens:[],error:T};continue}if(p===":"){if(i++,l++,i>=o.length||!Hv.test(o[i]))return{tokens:[],error:{message:"Po dwukropku `:` oczekiwano nazwy parametru lub zmiennej.",line:g,column:_}};let x="";for(;i<o.length&&ru.test(o[i]);)x+=o[i],i++,l++;const b=d("COLON_WORD",x,g,_,m,y,o[i]);if(b)return{tokens:[],error:b};continue}if(Hv.test(p)){let x="";for(;i<o.length&&ru.test(o[i]);)x+=o[i],i++,l++;if(i<o.length&&o[i]===":"){if(ku(x)==="ma"){i++,l++;const T=d("MA_COLON",x+":",g,_,m,y,o[i]);if(T)return{tokens:[],error:T};continue}return{tokens:[],error:{message:`Nieoczekiwany dwukropek po „${x}”. Dwukropek na końcu słowa jest dozwolony tylko w „ma:”.`,line:g,column:_+x.length}}}const b=d("WORD",x,g,_,m,y,o[i]);if(b)return{tokens:[],error:b};continue}return{tokens:[],error:{message:`Nieoczekiwany znak „${p}”.`,line:g,column:_}}}return e.push({type:"EOF",value:"",normalized:"",line:r,column:l,atLineStart:!u,spaceBefore:h,spaceAfter:!0}),{tokens:e,error:null}}const lm={np:"fd",naprzod:"fd",naprzód:"fd",fd:"fd",forward:"fd",ws:"bk",wstecz:"bk",bk:"bk",back:"bk",pw:"rt",prawo:"rt",rt:"rt",right:"rt",lw:"lt",lewo:"lt",lt:"lt",left:"lt",pod:"pu",podnies:"pu",podnieś:"pu",pu:"pu",penup:"pu",opu:"pd",opusc:"pd",opuść:"pd",pd:"pd",pendown:"pd",kolor:"color",color:"color",grubosc:"width",grubość:"width",width:"width",powtorz:"repeat",powtórz:"repeat",repeat:"repeat",niech:"let",let:"let",jeśli:"if",jesli:"if",if:"if",jeżeli:"ifelse",jezeli:"ifelse",ifelse:"ifelse",stop:"stop",dom:"home",home:"home",czyść:"cs",czysc:"cs",cs:"cs",clearscreen:"cs",gora:"pitchup",góra:"pitchup",pitchup:"pitchup",dol:"pitchdown",dół:"pitchdown",pitchdown:"pitchdown",pp:"rollright",przechylprawo:"rollright",rr:"rollright",rollright:"rollright",pl:"rollleft",przechyllewo:"rollleft",rl:"rollleft",rollleft:"rollleft"},ZE=new Set([...Object.keys(lm),"oto","to","już","juz","end","nrpowt","repcount"]),KE={LT:"<",GT:">",EQ:"=",LTE:"<=",GTE:">=",NEQ:"<>"};function Al(o){return ZE.has(o)}class te extends Error{constructor(i,r,l){super(i);_n(this,"line");_n(this,"column");this.line=r,this.column=l}}function vp(o){return o.type==="WORD"&&(o.normalized==="oto"||o.normalized==="to")}function Gv(o){return o.type==="WORD"&&(o.normalized==="już"||o.normalized==="juz"||o.normalized==="end")}function QE(o){return o.type==="WORD"&&(o.normalized==="nrpowt"||o.normalized==="repcount")}function Vv(o){return o.type!=="PLUS"&&o.type!=="MINUS"&&o.type!=="STAR"&&o.type!=="SLASH"?!1:o.spaceBefore===o.spaceAfter}function Rl(o){switch(o.kind){case"number":return!0;case"var":case"repcount":return!1;case"unary":return Rl(o.operand);case"binary":return Rl(o.left)&&Rl(o.right)}}function Cl(o,e,i){switch(o.kind){case"number":return o.value;case"unary":{const r=Cl(o.operand,e,i);return o.op==="-"?-r:r}case"binary":{const r=Cl(o.left,e,i),l=Cl(o.right,e,i);let u;switch(o.op){case"+":u=r+l;break;case"-":u=r-l;break;case"*":u=r*l;break;case"/":if(l===0)throw new te("Dzielenie przez zero w wyrażeniu.",e,i);u=r/l;break}if(!Number.isFinite(u))throw new te("Wynik wyrażenia nie jest skończoną liczbą.",e,i);return u}default:throw new te("Wyrażenie nie jest stałe.",e,i)}}function jv(o){const e=new Set;for(let i=0;i<o.length-1;i++){const r=o[i];if(r.type==="WORD"&&(r.normalized==="niech"||r.normalized==="let")){const l=o[i+1];l&&l.type==="WORD"&&e.add(l.normalized)}}return e}function JE(o){const e=[],i=[],r=new Set,l=o[o.length-1];let u=0,h=0;for(;u<o.length-1;){const d=o[u];if(d.type==="LBRACKET"){h++,e.push(d),u++;continue}if(d.type==="RBRACKET"){h>0&&h--,e.push(d),u++;continue}if(Gv(d))throw new te(`Nieoczekiwane „${d.value}” poza definicją procedury.`,d.line,d.column);if(vp(d)){if(h>0)throw new te("Definicje procedur („oto”) mogą występować wyłącznie na poziomie głównym programu.",d.line,d.column);if(!d.atLineStart)throw new te(`Definicja procedury „${d.value}” musi zaczynać się na początku wiersza.`,d.line,d.column);const p=d.line;u++;const g=o[u];if(!g||g.type==="EOF"||g.line!==p)throw new te("Oczekiwano nazwy procedury w tym samym wierszu co „oto”.",d.line,d.column);if(g.type!=="WORD")throw new te(`Nieprawidłowa nazwa procedury „${g.value}”.`,g.line,g.column);if(Al(g.normalized))throw new te(`Nazwa procedury „${g.value}” jest zarezerwowanym słowem języka.`,g.line,g.column);if(r.has(g.normalized))throw new te(`Procedura „${g.value}” została już zdefiniowana.`,g.line,g.column);r.add(g.normalized),u++;const _=[],m=new Set;if(u<o.length-1&&o[u].line===p){const b=o[u];if(b.type==="MA_COLON"){if(u++,u>=o.length-1||o[u].line!==p)throw new te("Po „ma:” oczekiwano co najmniej jednego parametru.",b.line,b.column);for(;;){const T=o[u];if(!T||T.type==="EOF"||T.line!==p)throw new te("Po przecinku oczekiwano kolejnej nazwy parametru.",o[u-1].line,o[u-1].column);if(T.type!=="WORD")throw new te(`Nieprawidłowa nazwa parametru „${T.value}”.`,T.line,T.column);if(Al(T.normalized))throw new te(`Nazwa parametru „${T.value}” jest zarezerwowanym słowem języka.`,T.line,T.column);if(m.has(T.normalized))throw new te(`Powtórzona nazwa parametru „${T.value}”.`,T.line,T.column);if(m.add(T.normalized),_.push(T.normalized),u++,u<o.length-1&&o[u].line===p){if(o[u].type==="COMMA"){u++;continue}throw new te(`W nagłówku procedury po „ma:” parametry należy rozdzielać przecinkiem, napotkano „${o[u].value}”.`,o[u].line,o[u].column)}break}}else if(b.type==="COLON_WORD")for(;u<o.length-1&&o[u].line===p;){const T=o[u];if(T.type!=="COLON_WORD")throw new te(`Oczekiwano parametru w formacie „:nazwa”, napotkano „${T.value}”.`,T.line,T.column);if(Al(T.normalized))throw new te(`Nazwa parametru „:${T.value}” jest zarezerwowanym słowem języka.`,T.line,T.column);if(m.has(T.normalized))throw new te(`Powtórzona nazwa parametru „:${T.value}”.`,T.line,T.column);m.add(T.normalized),_.push(T.normalized),u++}else throw new te(`Nieoczekiwany token „${b.value}” w nagłówku procedury. Użyj „ma: parametr” lub „:parametr”.`,b.line,b.column)}const y=[];let x=!1;for(;u<o.length-1;){const b=o[u];if(vp(b))throw new te("Nie można definiować procedury wewnątrz innej procedury.",b.line,b.column);if(Gv(b)){const T=o[u+1];if(!(b.atLineStart&&(!T||T.type==="EOF"||T.line>b.line)))throw new te(`Słowo „${b.value}” kończące procedurę musi stać samodzielnie w osobnym wierszu.`,b.line,b.column);u++,x=!0;break}y.push(b),u++}if(!x)throw new te(`Brak zakończenia „już” dla procedury „${g.value}”.`,d.line,d.column);y.push({...l,line:y.length>0?y[y.length-1].line:d.line,column:y.length>0?y[y.length-1].column:d.column}),i.push({name:g.normalized,displayName:g.value,params:_,bodyTokens:y,line:d.line,column:d.column});continue}e.push(d),u++}return e.push(l),{topLevelTokens:e,rawProcedures:i}}class Xv{constructor(e,i){_n(this,"tokens");_n(this,"pos",0);_n(this,"ctx");this.tokens=e,this.ctx=i}peek(e=0){const i=this.pos+e;return i<this.tokens.length?this.tokens[i]:this.tokens[this.tokens.length-1]}advance(){const e=this.peek();return this.pos<this.tokens.length-1&&this.pos++,e}parseStatements(e){const i=[];for(;;){const r=this.peek();if(r.type==="EOF"){if(e)throw new te("Niezamknięty nawias kwadratowy `[` — brakuje `]`.",r.line,r.column);break}if(r.type==="RBRACKET"){if(e)break;throw new te("Nieoczekiwany zamykający nawias `]` bez otwierającego `[`.",r.line,r.column)}i.push(this.parseStatement())}return i}parseStatement(){const e=this.peek();if(vp(e))throw new te("Definicje procedur („oto”) mogą występować wyłącznie na poziomie głównym programu.",e.line,e.column);if(e.type!=="WORD")throw new te(`Oczekiwano polecenia, a napotkano „${e.value||"koniec programu"}”.`,e.line,e.column);const i=lm[e.normalized];if(i)return this.advance(),this.parseBuiltin(i,e);const r=this.ctx.procedures.get(e.normalized);if(r){this.advance();const l=[];for(let u=0;u<r.params.length;u++)l.push(this.parseRequiredExpr(e,`argumentu ${u+1} dla procedury „${e.value}”`));return{kind:"call",name:e.normalized,displayName:e.value,args:l,line:e.line,column:e.column}}throw new te(`Nieznane polecenie lub procedura „${e.value}”.`,e.line,e.column)}parseBuiltin(e,i){switch(e){case"fd":return{kind:"move",dir:1,expr:this.parseRequiredExpr(i,"odległości"),line:i.line,column:i.column};case"bk":return{kind:"move",dir:-1,expr:this.parseRequiredExpr(i,"odległości"),line:i.line,column:i.column};case"rt":return{kind:"turn",axis:"yaw",dir:1,expr:this.parseRequiredExpr(i,"kąta"),line:i.line,column:i.column};case"lt":return{kind:"turn",axis:"yaw",dir:-1,expr:this.parseRequiredExpr(i,"kąta"),line:i.line,column:i.column};case"pitchup":case"pitchdown":case"rollright":case"rollleft":{if(this.ctx.mode==="2d")throw new te(`Polecenie „${i.value}” działa wyłącznie w trybie 3D.`,i.line,i.column);return{kind:"turn",axis:e==="pitchup"||e==="pitchdown"?"pitch":"roll",dir:e==="pitchup"||e==="rollright"?1:-1,expr:this.parseRequiredExpr(i,"kąta"),line:i.line,column:i.column}}case"pu":return{kind:"pen",down:!1,line:i.line,column:i.column};case"pd":return{kind:"pen",down:!0,line:i.line,column:i.column};case"home":return{kind:"home",line:i.line,column:i.column};case"cs":return{kind:"cs",line:i.line,column:i.column};case"stop":return{kind:"stop",line:i.line,column:i.column};case"color":{const r=this.peek();if(r.type==="EOF")throw new te('Brakuje koloru po poleceniu „kolor” (np. "#16866a").',i.line,i.column);if(r.type!=="COLOR")throw new te(`Oczekiwano koloru w formacie "#rrggbb", napotkano „${r.value}”.`,r.line,r.column);return this.advance(),{kind:"color",color:r.value,line:i.line,column:i.column}}case"width":{const r=this.parseRequiredExpr(i,"grubości (liczba całkowita 1–12)");if(Rl(r)){const l=Cl(r,r.line,r.column);if(!Number.isInteger(l)||l<Oe.MIN_WIDTH||l>Oe.MAX_WIDTH)throw new te(`Grubość pisaka musi być liczbą całkowitą od ${Oe.MIN_WIDTH} do ${Oe.MAX_WIDTH} (otrzymano ${l}).`,r.line,r.column)}return{kind:"width",expr:r,line:i.line,column:i.column}}case"let":{const r=this.peek();if(r.type==="EOF")throw new te("Brakuje nazwy zmiennej po „niech”.",i.line,i.column);if(r.type!=="WORD")throw new te(`Oczekiwano nazwy zmiennej po „niech”, napotkano „${r.value}”.`,r.line,r.column);if(Al(r.normalized))throw new te(`Nazwa zmiennej „${r.value}” jest zarezerwowanym słowem języka.`,r.line,r.column);if(this.ctx.procedures.has(r.normalized))throw new te(`Nazwa zmiennej „${r.value}” koliduje z nazwą zdefiniowanej procedury.`,r.line,r.column);this.advance();const l=this.parseRequiredExpr(r,`wartości zmiennej „${r.value}”`);return{kind:"let",name:r.normalized,displayName:r.value,expr:l,line:i.line,column:i.column}}case"repeat":{const r=this.parseRequiredExpr(i,"liczby powtórzeń (0–10000)");if(Rl(r)){const u=Cl(r,r.line,r.column);if(!Number.isInteger(u)||u<Oe.MIN_REPEAT||u>Oe.MAX_REPEAT)throw new te(`Liczba powtórzeń musi być liczbą całkowitą od ${Oe.MIN_REPEAT} do ${Oe.MAX_REPEAT} (otrzymano ${u}).`,r.line,r.column)}this.ctx.repeatDepth++;let l;try{l=this.parseBracketBlock(i,"bloku powtórzeń `[ ... ]`")}finally{this.ctx.repeatDepth--}return{kind:"repeat",countExpr:r,body:l,line:i.line,column:i.column}}case"if":{const r=this.parseCondition(i),l=this.parseBracketBlock(i,"bloku instrukcji `[ ... ]` po warunku „jeśli”");return{kind:"if",condition:r,body:l,line:i.line,column:i.column}}case"ifelse":{const r=this.parseCondition(i),l=this.parseBracketBlock(i,"pierwszego bloku `[ ... ]` dla „jeżeli”"),u=this.parseBracketBlock(i,"drugiego bloku `[ ... ]` dla „jeżeli”");return{kind:"ifelse",condition:r,thenBody:l,elseBody:u,line:i.line,column:i.column}}}}parseBracketBlock(e,i){const r=this.peek();if(r.type==="EOF")throw new te(`Brakuje ${i}.`,e.line,e.column);if(r.type!=="LBRACKET")throw new te(`Oczekiwano nawiasu otwierającego „[” dla ${i}, napotkano „${r.value}”.`,r.line,r.column);if(this.advance(),this.ctx.bracketDepth++,this.ctx.bracketDepth>Oe.MAX_BRACKET_DEPTH)throw new te(`Przekroczono maksymalną głębokość zagnieżdżenia nawiasów (${Oe.MAX_BRACKET_DEPTH}).`,r.line,r.column);let l;try{l=this.parseStatements(!0)}finally{this.ctx.bracketDepth--}if(this.peek().type!=="RBRACKET")throw new te("Niezamknięty nawias kwadratowy `[` — oczekiwano `]`.",r.line,r.column);return this.advance(),l}parseCondition(e){const i=this.parseRequiredExpr(e,"lewej strony warunku"),r=this.peek(),l=KE[r.type];if(!l)throw r.type==="EOF"?new te("Brakuje operatora porównania (`<`, `>`, `=`, `<=`, `>=`, `<>`) w warunku.",e.line,e.column):new te(`Oczekiwano operatora porównania (<, >, =, <=, >=, <>), napotkano „${r.value}”.`,r.line,r.column);this.advance();const u=this.parseRequiredExpr(r,"prawej strony warunku");return{left:i,op:l,right:u,line:i.line,column:i.column}}parseRequiredExpr(e,i){if(this.peek().type==="EOF")throw new te(`Brakuje ${i}.`,e.line,e.column);return this.parseAddSub(i)}parseAddSub(e){let i=this.parseMulDiv(e);for(;;){const r=this.peek();if((r.type==="PLUS"||r.type==="MINUS")&&Vv(r)){this.advance();const l=r.type==="PLUS"?"+":"-",u=this.parseMulDiv(`prawego argumentu operatora „${l}”`);i={kind:"binary",op:l,left:i,right:u,line:i.line,column:i.column}}else break}return i}parseMulDiv(e){let i=this.parseUnary(e);for(;;){const r=this.peek();if((r.type==="STAR"||r.type==="SLASH")&&Vv(r)){this.advance();const l=r.type==="STAR"?"*":"/",u=this.parseUnary(`prawego argumentu operatora „${l}”`);i={kind:"binary",op:l,left:i,right:u,line:i.line,column:i.column}}else break}return i}parseUnary(e){const i=this.peek();if(i.type==="MINUS"||i.type==="PLUS"){this.advance();const r=i.type==="MINUS"?"-":"+";if(this.peek().type==="EOF")throw new te(`Brakuje wyrażenia po operatorze jednoargumentowym „${r}”.`,i.line,i.column);const u=this.parseUnary(`argumentu po operatorze „${r}”`);return{kind:"unary",op:r,operand:u,line:i.line,column:i.column}}return this.parsePrimary(e)}parsePrimary(e){const i=this.peek();if(i.type==="NUMBER"){this.advance();const r=Number(i.value);if(!Number.isFinite(r))throw new te(`Nieprawidłowa liczba „${i.value}”.`,i.line,i.column);return{kind:"number",value:r,line:i.line,column:i.column}}if(i.type==="LPAREN"){this.advance();const r=this.peek();if(r.type==="RPAREN")throw new te("Puste nawiasy `()` nie są prawidłowym wyrażeniem.",i.line,i.column);if(r.type==="EOF")throw new te("Niezamknięty nawias `(` — oczekiwano wyrażenia i `)`.",i.line,i.column);const l=this.parseAddSub("wyrażenia w nawiasach"),u=this.peek();if(u.type!=="RPAREN")throw new te(u.type==="EOF"?"Niezamknięty nawias „(” — brakuje „)”.":`Oczekiwano zamykającego nawiasu „)”, napotkano „${u.value}”.`,u.type==="EOF"?i.line:u.line,u.type==="EOF"?i.column:u.column);return this.advance(),{...l,line:i.line,column:i.column}}if(QE(i)){if(this.ctx.repeatDepth<=0)throw new te(`Wartość „${i.value}” może być używana wyłącznie wewnątrz pętli „powtorz”.`,i.line,i.column);return this.advance(),{kind:"repcount",line:i.line,column:i.column}}if(i.type==="WORD"||i.type==="COLON_WORD"){const r=i.normalized;if(i.type==="WORD"&&Al(r))throw new te(`Oczekiwano ${e}, a napotkano słowo kluczowe „${i.value}”.`,i.line,i.column);if(!this.ctx.params.has(r)&&!this.ctx.localVars.has(r)&&!this.ctx.globalVars.has(r))throw r==="nan"||r==="infinity"?new te(`„${i.value}” nie jest prawidłową liczbą ani zadeklarowaną zmienną.`,i.line,i.column):new te(`Nieznana zmienna lub parametr „${i.value}”. Użyj „niech ${i.value} ...”, aby ją zadeklarować.`,i.line,i.column);return this.advance(),{kind:"var",name:r,displayName:i.value,line:i.line,column:i.column}}throw new te(`Oczekiwano ${e}, napotkano „${i.value||"koniec programu"}”.`,i.line,i.column)}}function ux(o,e){const i=qE(o);if(i.error)return{program:null,error:i.error};try{const{topLevelTokens:r,rawProcedures:l}=JE(i.tokens),u=new Map;for(const m of l)u.set(m.name,{params:m.params,displayName:m.displayName});const h=jv(r),d={mode:e,procedures:u,globalVars:h,localVars:new Set,params:new Set,repeatDepth:0,bracketDepth:0},g=new Xv(r,d).parseStatements(!1),_=new Map;for(const m of l){const y=jv(m.bodyTokens),x={mode:e,procedures:u,globalVars:h,localVars:y,params:new Set(m.params),repeatDepth:0,bracketDepth:0},T=new Xv(m.bodyTokens,x).parseStatements(!1);_.set(m.name,{name:m.name,displayName:m.displayName,params:m.params,body:T,line:m.line,column:m.column})}return{program:{procedures:_,statements:g},error:null}}catch(r){if(r instanceof te)return{program:null,error:{message:r.message,line:r.line,column:r.column}};throw r}}class Hn extends Error{constructor(i,r,l){super(i);_n(this,"line");_n(this,"column");this.line=r,this.column=l}}function Kr(){return{pos:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],penDown:!0,color:jE,width:XE}}function Wv(o){return{pos:[o.pos[0],o.pos[1],o.pos[2]],heading:[o.heading[0],o.heading[1],o.heading[2]],right:[o.right[0],o.right[1],o.right[2]],up:[o.up[0],o.up[1],o.up[2]],penDown:o.penDown,color:o.color,width:o.width}}function Ud(o){const e=Math.hypot(o[0],o[1],o[2]);return e===0?[0,1,0]:[o[0]/e,o[1]/e,o[2]/e]}function $E(o,e){return[o[1]*e[2]-o[2]*e[1],o[2]*e[0]-o[0]*e[2],o[0]*e[1]-o[1]*e[0]]}function tb(o,e){return o[0]*e[0]+o[1]*e[1]+o[2]*e[2]}function eb(o){const e=Ud(o.heading),i=tb(o.up,e),r=[o.up[0]-i*e[0],o.up[1]-i*e[1],o.up[2]-i*e[2]],l=Ud(r),u=Ud($E(e,l));o.heading=e,o.up=l,o.right=u}function Ld(o,e,i){const r=i*Math.PI/180,l=Math.cos(r),u=Math.sin(r),h=[o[0]*l+e[0]*u,o[1]*l+e[1]*u,o[2]*l+e[2]*u],d=[e[0]*l-o[0]*u,e[1]*l-o[1]*u,e[2]*l-o[2]*u];return[h,d]}class fx{constructor(e){_n(this,"program");_n(this,"stack",[]);_n(this,"activeFrames",0);_n(this,"globals",new Map);_n(this,"turtle",Kr());_n(this,"segments",[]);_n(this,"operations",0);_n(this,"done",!1);_n(this,"error",null);_n(this,"lastLine",null);_n(this,"lastColumn",null);this.program=e,this.stack.push({kind:"top",stmts:e.statements,index:0}),e.statements.length===0&&(this.done=!0)}getSnapshot(){return{done:this.done,line:this.lastLine,column:this.lastColumn,operations:this.operations,turtle:Wv(this.turtle),segments:this.segments.slice(),error:this.error}}getSegmentsRef(){return this.segments}getTurtle(){return Wv(this.turtle)}isDone(){return this.done}getError(){return this.error}getOperations(){return this.operations}getCurrentLine(){return this.lastLine}countOp(e,i){if(this.operations++,this.operations>Oe.MAX_OPERATIONS)throw new Hn(`Przekroczono limit ${Oe.MAX_OPERATIONS.toLocaleString("pl-PL")} wykonanych operacji (możliwa nieskończona pętla lub rekurencja).`,e,i)}currentProcFrame(){for(let e=this.stack.length-1;e>=0;e--){const i=this.stack[e];if(i.kind==="proc")return i}return null}currentRepcount(){for(let e=this.stack.length-1;e>=0;e--){const i=this.stack[e];if(i.kind==="repeat")return i.repcount;if(i.kind==="proc")return null}return null}lookupVar(e,i,r,l){const u=this.currentProcFrame();if(u&&u.locals.has(e))return u.locals.get(e);if(this.globals.has(e))return this.globals.get(e);throw new Hn(`Zmienna „${i}” została użyta przed przypisaniem wartości.`,r,l)}evalExpr(e,i,r){switch(e.kind){case"number":return e.value;case"var":return this.lookupVar(e.name,e.displayName,i,r);case"repcount":{const l=this.currentRepcount();if(l===null)throw new Hn("Wartość „nrpowt” jest dostępna wyłącznie wewnątrz pętli „powtorz”.",i,r);return l}case"unary":{const l=this.evalExpr(e.operand,i,r),u=e.op==="-"?-l:l;if(!Number.isFinite(u))throw new Hn("Wynik wyrażenia nie jest skończoną liczbą.",i,r);return u}case"binary":{const l=this.evalExpr(e.left,i,r),u=this.evalExpr(e.right,i,r);let h;switch(e.op){case"+":h=l+u;break;case"-":h=l-u;break;case"*":h=l*u;break;case"/":if(u===0)throw new Hn("Dzielenie przez zero.",i,r);h=l/u;break}if(!Number.isFinite(h))throw new Hn("Wynik wyrażenia nie jest skończoną liczbą.",i,r);return h}}}evalCondition(e){const i=this.evalExpr(e.left,e.left.line,e.left.column),r=this.evalExpr(e.right,e.right.line,e.right.column);switch(e.op){case"<":return i<r;case">":return i>r;case"=":return i===r;case"<=":return i<=r;case">=":return i>=r;case"<>":return i!==r}}checkCoords(e,i,r){for(let l=0;l<3;l++)if(!Number.isFinite(e[l])||Math.abs(e[l])>Oe.MAX_COORD)throw new Hn(`Żółw wyszedł poza dozwolony obszar (±${Oe.MAX_COORD.toLocaleString("pl-PL")}).`,i,r)}pushSegment(e,i,r,l){if(!(e[0]===i[0]&&e[1]===i[1]&&e[2]===i[2])){if(this.segments.length>=Oe.MAX_SEGMENTS)throw new Hn(`Przekroczono limit ${Oe.MAX_SEGMENTS.toLocaleString("pl-PL")} narysowanych odcinków.`,r,l);this.segments.push({from:[e[0],e[1],e[2]],to:[i[0],i[1],i[2]],color:this.turtle.color,width:this.turtle.width})}}step(){if(this.done)return!1;try{for(;this.stack.length>0;){const e=this.stack[this.stack.length-1];if(e.index>=e.stmts.length){if(e.kind==="top")return this.stack.pop(),this.done=!0,!1;if(e.kind==="repeat"){if(this.countOp(e.line,e.column),e.repcount<e.total){e.repcount++,e.index=0;continue}this.stack.pop(),this.activeFrames--;continue}if(e.kind==="cond"){this.countOp(e.line,e.column),this.stack.pop();continue}if(e.kind==="proc"){this.countOp(e.line,e.column),this.stack.pop(),this.activeFrames--;continue}}const i=e.stmts[e.index++];return this.lastLine=i.line,this.lastColumn=i.column,this.executeStmt(i),this.stack.length===0?(this.done=!0,!1):!this.done}return this.done=!0,!1}catch(e){if(e instanceof Hn)return this.error={message:e.message,line:e.line,column:e.column},this.lastLine=e.line,this.lastColumn=e.column,this.done=!0,!1;throw e}}executeStmt(e){switch(this.countOp(e.line,e.column),e.kind){case"move":{const i=this.evalExpr(e.expr,e.expr.line,e.expr.column)*e.dir;if(!Number.isFinite(i))throw new Hn("Odległość musi być skończoną liczbą.",e.expr.line,e.expr.column);const r=this.turtle.pos,l=[r[0]+this.turtle.heading[0]*i,r[1]+this.turtle.heading[1]*i,r[2]+this.turtle.heading[2]*i];this.checkCoords(l,e.expr.line,e.expr.column),this.turtle.penDown&&i!==0&&this.pushSegment(r,l,e.line,e.column),this.turtle.pos=l;break}case"turn":{const i=this.evalExpr(e.expr,e.expr.line,e.expr.column)*e.dir;if(!Number.isFinite(i))throw new Hn("Kąt obrotu musi być skończoną liczbą.",e.expr.line,e.expr.column);if(e.axis==="yaw"){const[r,l]=Ld(this.turtle.heading,this.turtle.right,i);this.turtle.heading=r,this.turtle.right=l}else if(e.axis==="pitch"){const[r,l]=Ld(this.turtle.heading,this.turtle.up,i);this.turtle.heading=r,this.turtle.up=l}else{const[r,l]=Ld(this.turtle.up,this.turtle.right,i);this.turtle.up=r,this.turtle.right=l}eb(this.turtle);break}case"pen":{this.turtle.penDown=e.down;break}case"color":{this.turtle.color=e.color;break}case"width":{const i=this.evalExpr(e.expr,e.expr.line,e.expr.column);if(!Number.isInteger(i)||i<Oe.MIN_WIDTH||i>Oe.MAX_WIDTH)throw new Hn(`Grubość pisaka musi być liczbą całkowitą od ${Oe.MIN_WIDTH} do ${Oe.MAX_WIDTH} (otrzymano ${i}).`,e.expr.line,e.expr.column);this.turtle.width=i;break}case"home":{const i=this.turtle.pos,r=[0,0,0];this.turtle.penDown&&(i[0]!==0||i[1]!==0||i[2]!==0)&&this.pushSegment(i,r,e.line,e.column),this.turtle.pos=r,this.turtle.heading=[0,1,0],this.turtle.right=[1,0,0],this.turtle.up=[0,0,1];break}case"cs":{this.segments.length=0;break}case"stop":{for(;this.stack.length>0;){const i=this.stack.pop();if(i.kind==="repeat")this.activeFrames--;else if(i.kind==="proc"){this.activeFrames--;return}else if(i.kind==="top"){this.done=!0;return}}this.done=!0;break}case"let":{const i=this.evalExpr(e.expr,e.expr.line,e.expr.column),r=this.currentProcFrame();r?r.locals.set(e.name,i):this.globals.set(e.name,i);break}case"repeat":{const i=this.evalExpr(e.countExpr,e.countExpr.line,e.countExpr.column);if(!Number.isInteger(i)||i<Oe.MIN_REPEAT||i>Oe.MAX_REPEAT)throw new Hn(`Liczba powtórzeń musi być liczbą całkowitą od ${Oe.MIN_REPEAT} do ${Oe.MAX_REPEAT} (otrzymano ${i}).`,e.countExpr.line,e.countExpr.column);if(i===0)break;if(this.activeFrames>=Oe.MAX_ACTIVE_FRAMES)throw new Hn(`Przekroczono limit ${Oe.MAX_ACTIVE_FRAMES} aktywnych ramek wywołań i pętli.`,e.line,e.column);this.activeFrames++,this.stack.push({kind:"repeat",stmts:e.body,index:0,total:i,repcount:1,line:e.line,column:e.column});break}case"if":{this.evalCondition(e.condition)&&this.stack.push({kind:"cond",stmts:e.body,index:0,line:e.line,column:e.column});break}case"ifelse":{const i=this.evalCondition(e.condition)?e.thenBody:e.elseBody;this.stack.push({kind:"cond",stmts:i,index:0,line:e.line,column:e.column});break}case"call":{const i=this.program.procedures.get(e.name);if(!i)throw new Hn(`Nieznana procedura „${e.displayName}”.`,e.line,e.column);const r=[];for(const u of e.args)r.push(this.evalExpr(u,u.line,u.column));if(this.activeFrames>=Oe.MAX_ACTIVE_FRAMES)throw new Hn(`Przekroczono limit ${Oe.MAX_ACTIVE_FRAMES} aktywnych ramek wywołań i pętli (zbyt głęboka rekurencja).`,e.line,e.column);const l=new Map;for(let u=0;u<i.params.length;u++)l.set(i.params[u],r[u]);this.activeFrames++,this.stack.push({kind:"proc",name:i.name,stmts:i.body,index:0,locals:l,line:e.line,column:e.column});break}}}runToEnd(){for(;!this.done;)this.step();return{segments:this.segments.slice(),error:this.error}}}function cm(o,e){const i=ux(o,e);return i.error||!i.program?{segments:[],error:i.error}:new fx(i.program).runToEnd()}function Od(o,e){const i=ux(o,e);return i.error||!i.program?{stepper:null,error:i.error}:{stepper:new fx(i.program),error:null}}const Hu=[{id:"kwadrat",name:"Kwadrat",mode:"2d",description:"Cztery kroki do pierwszego rysunku.",source:`; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]`},{id:"gwiazda",name:"Gwiazda",mode:"2d",description:"Mała zmiana kąta, wielka różnica.",source:`; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]`},{id:"rozeta",name:"Rozeta",mode:"2d",description:"Jeden kwadrat. Wiele możliwości.",source:`; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]`},{id:"spirala",name:"Spirala",mode:"2d",description:"Licznik powtórzeń i zmienna zmieniają kolor.",source:`; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]`},{id:"wielokaty",name:"Wielokąty",mode:"2d",description:"Procedura liczy kąt z liczby boków.",source:`; Jedna procedura, wiele figur: kąt liczy się sam.
oto wielokąt ma: boki, bok
  powtorz boki [np bok pw 360 / boki]
już

grubosc 2
niech n 3
powtorz 7 [
  wielokąt n 60
  niech n n + 1
  pw 360 / 7
]`},{id:"drzewo",name:"Drzewo",mode:"2d",description:"Gałąź rysuje dwie mniejsze gałęzie.",source:`; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
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
gałąź 90`},{id:"sniezynka",name:"Śnieżynka",mode:"2d",description:"Krzywa Kocha z czterech poziomów.",source:`; Krzywa Kocha: każdy odcinek dzieli się na cztery.
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
]`},{id:"schody",name:"Schody",mode:"3d",description:"Pierwszy krok w trzeci wymiar.",source:`; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]`},{id:"szescian",name:"Sześcian",mode:"3d",description:"Zbuduj bryłę z prostych poleceń.",source:`; Dwa kwadraty połączone krawędziami.
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
]`},{id:"pierscien",name:"Pierścień",mode:"3d",description:"Okrąg przechylony w przestrzeni.",source:`; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]`},{id:"kula",name:"Kula",mode:"3d",description:"Okręgi obrócone wokół kierunku żółwia.",source:`; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]`},{id:"helisa",name:"Helisa",mode:"3d",description:"Spirala wznosi się obrót po obrocie.",source:`; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]`},{id:"drzewo3d",name:"Drzewo 3D",mode:"3d",description:"Gałęzie obracają się wokół pnia.",source:`; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
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
gałąź 70`}],Jr=[{id:"ch-kwadrat-100",title:"Kwadrat o boku 100",mode:"2d",difficulty:"Podstawowe",prompt:"Narysuj kwadrat o boku 100 jednostek, zaczynając od środka układu (0, 0) w górę (+Y) i skręcając w prawo.",hint:"Użyj pętli `powtorz 4 [ ... ]` z poleceniami `np 100` oraz `pw 90`.",starterCode:`; Narysuj kwadrat o boku 100
powtorz 4 [
  np 100
  
]`,referenceSolution:"powtorz 4 [np 100 pw 90]",tolerance:2.5},{id:"ch-trojkat",title:"Trójkąt równoboczny",mode:"2d",difficulty:"Podstawowe",prompt:"Narysuj trójkąt równoboczny o boku 120 jednostek, zaczynając w górę (+Y) i skręcając w prawo.",hint:"Żółw skręca o kąt zewnętrzny: 360 / 3 = 120 stopni.",starterCode:`; Trójkąt równoboczny o boku 120
powtorz 3 [
  np 120
  pw 60
]`,referenceSolution:"powtorz 3 [np 120 pw 120]",tolerance:2.5},{id:"ch-dwa-kwadraty",title:"Dwa osobne kwadraty",mode:"2d",difficulty:"Średnie",prompt:"Narysuj kwadrat o boku 60 w punkcie startowym, a następnie bez rysowania przejdź w prawo o 100 jednostek i narysuj drugi taki sam kwadrat.",hint:"Po pierwszym kwadracie podnieś pisak (`pod`), obróć się w prawo (`pw 90`), przejdź `np 100`, wróć do kierunku w górę (`lw 90`) i opuść pisak (`opu`).",starterCode:`; Dwa kwadraty o boku 60 rozdzielone przerwą
oto kw
  powtorz 4 [np 60 pw 90]
już

kw
; Przejdź w prawo bez rysowania i narysuj drugi kwadrat`,referenceSolution:`oto kw
  powtorz 4 [np 60 pw 90]
już
kw
pod pw 90 np 100 lw 90 opu
kw`,tolerance:2.5},{id:"ch-szesciokat",title:"Sześciokąt foremny",mode:"2d",difficulty:"Średnie",prompt:"Narysuj sześciokąt foremny o boku 70 jednostek, zaczynając od (0, 0) w górę i skręcając w prawo.",hint:"Dla 6 boków kąt skrętu wynosi 360 / 6 = 60 stopni.",starterCode:`; Sześciokąt foremny o boku 70
powtorz 6 [
  
]`,referenceSolution:"powtorz 6 [np 70 pw 60]",tolerance:2.5},{id:"ch-bramka-3d",title:"Pionowa bramka 3D",mode:"3d",difficulty:"Przestrzenne",prompt:"W trybie 3D wznieś pionowy słupek o wysokości 80 jednostek w górę (+Z), przejdź poprzeczką 100 jednostek w przód (+Y), a następnie zejdź pionowo 80 jednostek w dół (-Z).",hint:"Użyj `gora 90`, aby skierować nos żółwia wzdłuż osi +Z, potem `dol 90`, aby wrócić do poziomu (+Y), i jeszcze raz `dol 90`, aby zejść w dół.",starterCode:`; Pionowa bramka w przestrzeni 3D
gora 90
np 80
; Dokończ poprzeczkę (100) i drugi słupek (80)`,referenceSolution:`gora 90
np 80
dol 90
np 100
dol 90
np 80`,tolerance:3},{id:"ch-dwa-pietra-3d",title:"Dwa piętra w przestrzeni",mode:"3d",difficulty:"Przestrzenne",prompt:"Narysuj dolny kwadrat o boku 80 na płaszczyźnie XY, wznieś się pionowo o 60 jednostek w górę (+Z) i narysuj górny kwadrat o boku 80 dokładnie nad nim.",hint:"Po dolnym kwadracie użyj `gora 90 np 60 dol 90`, a następnie powtórz kwadrat.",starterCode:`; Dwa kwadraty o boku 80 połączone pionową krawędzią o wysokości 60
powtorz 4 [np 80 pw 90]
`,referenceSolution:`powtorz 4 [np 80 pw 90]
gora 90 np 60 dol 90
powtorz 4 [np 80 pw 90]`,tolerance:3}],Yv=new Map;function yp(o){const e=Yv.get(o.id);if(e)return e;const i=cm(o.referenceSolution,o.mode);return Yv.set(o.id,i.segments),i.segments}function nb(o,e,i){const r=i[0]-e[0],l=i[1]-e[1],u=i[2]-e[2],h=o[0]-e[0],d=o[1]-e[1],p=o[2]-e[2],g=r*r+l*l+u*u;if(g===0)return Math.hypot(h,d,p);const _=Math.max(0,Math.min(1,(h*r+d*l+p*u)/g)),m=e[0]+_*r,y=e[1]+_*l,x=e[2]+_*u;return Math.hypot(o[0]-m,o[1]-y,o[2]-x)}function qv(o,e=4){const i=[];for(const r of o){const l=Math.hypot(r.to[0]-r.from[0],r.to[1]-r.from[1],r.to[2]-r.from[2]),u=Math.max(2,Math.min(60,Math.ceil(l/e)+1));for(let h=0;h<u;h++){const d=h/(u-1);i.push([r.from[0]+(r.to[0]-r.from[0])*d,r.from[1]+(r.to[1]-r.from[1])*d,r.from[2]+(r.to[2]-r.from[2])*d])}}return i}function Zv(o,e,i){if(o.length===0)return{maxDist:0,withinPct:0};let r=0,l=0;for(const u of o){let h=1/0;for(const d of e){const p=nb(u,d.from,d.to);if(p<h&&(h=p),h<.01)break}h>r&&(r=h),h<=i&&l++}return{maxDist:r,withinPct:Math.round(l/o.length*100)}}function ib(o,e,i=2.5){if(o.length===0)return{passed:!1,reason:"Program nie narysował żadnych odcinków. Upewnij się, że pisak jest opuszczony („opu”) i używasz „np” lub „ws”.",coveragePct:0,maxDeviation:1/0};const r=qv(e,4),l=qv(o,4),u=Zv(r,o,i),h=Zv(l,e,i),d=Math.max(u.maxDist,h.maxDist),p=Math.min(u.withinPct,h.withinPct);return u.maxDist<=i&&h.maxDist<=i?{passed:!0,reason:`Zaliczone! Rysunek pokrywa się ze wzorcem (maksymalne odchylenie ${d.toFixed(1)} jedn., tolerancja ${i} jedn.).`,coveragePct:100,maxDeviation:d}:u.withinPct<95&&h.withinPct>=95?{passed:!1,reason:`Rysunek jest niepełny — pokrywa ${u.withinPct}% wzorca. Brakuje części odcinków.`,coveragePct:p,maxDeviation:d}:h.withinPct<95&&u.withinPct>=95?{passed:!1,reason:`Rysunek zawiera nadmiarowe odcinki poza wzorcem (${100-h.withinPct}% linii wystaje poza kształt docelowy).`,coveragePct:p,maxDeviation:d}:{passed:!1,reason:`Kształt lub położenie różni się od wzorca (pokrycie ${p}%, maks. odchylenie ${d.toFixed(1)} jedn., wymagane ≤ ${i} jedn.).`,coveragePct:p,maxDeviation:d}}const ia={DRAFT_2D:"logomocja:draft:2d",DRAFT_3D:"logomocja:draft:3d",MODE:"logomocja:mode",THEME:"logomocja:theme",SOLVED:"logomocja:challenges:solved"};function Yu(o){try{return window.localStorage.getItem(o)}catch{return null}}function qu(o,e){try{window.localStorage.setItem(o,e)}catch{}}function Kv(o){return Yu(o==="2d"?ia.DRAFT_2D:ia.DRAFT_3D)}function Pd(o,e){qu(o==="2d"?ia.DRAFT_2D:ia.DRAFT_3D,e)}function ab(){return Yu(ia.MODE)==="3d"?"3d":"2d"}function Id(o){qu(ia.MODE,o)}function rb(){const o=Yu(ia.THEME);return o==="light"||o==="dark"||o==="system"?o:"system"}function sb(o){qu(ia.THEME,o)}function ob(){const o=Yu(ia.SOLVED);if(!o)return[];try{const e=JSON.parse(o);return Array.isArray(e)?e.filter(i=>typeof i=="string"):[]}catch{return[]}}function lb(o){qu(ia.SOLVED,JSON.stringify(o))}const cb=new Set(["pracownia","przyklady","wyzwania","slownik"]);function ub(o){const e=new TextEncoder().encode(o);let i="";for(let r=0;r<e.length;r++)i+=String.fromCharCode(e[r]);return btoa(i).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function fb(o){try{let e=o.replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4!==0;)e+="=";const i=atob(e),r=new Uint8Array(i.length);for(let l=0;l<i.length;l++)r[l]=i.charCodeAt(l);return new TextDecoder().decode(r)}catch{return null}}function hb(o,e){const i=window.location.href.split("#")[0],r=ub(o);return`${i}#pracownia?m=${e}&p=${r}`}function Qv(o){const e=o.replace(/^#\/?/,"");if(!e)return{route:"pracownia"};const[i,r]=e.split("?"),l=cb.has(i)?i:"pracownia";if(!r)return{route:l};const u=new URLSearchParams(r),h=u.get("m"),d=u.get("p");if((h==="2d"||h==="3d")&&d!==null){const p=fb(d);if(p!==null)return{route:"pracownia",sharedMode:h,sharedSource:p}}return{route:l}}const Kn=(o,e)=>({width:o,height:o,viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,className:e}),Jv=({size:o=15,className:e})=>D.jsx("svg",{...Kn(o,e),children:D.jsx("path",{d:"M5.5 3.8L15.5 10L5.5 16.2V3.8Z",fill:"currentColor",stroke:"none"})}),db=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("rect",{x:"4.5",y:"3.5",width:"3.5",height:"13",rx:"0.8",fill:"currentColor",stroke:"none"}),D.jsx("rect",{x:"12",y:"3.5",width:"3.5",height:"13",rx:"0.8",fill:"currentColor",stroke:"none"})]}),pb=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("path",{d:"M4.5 4.2L12 10L4.5 15.8V4.2Z"}),D.jsx("line",{x1:"15",y1:"4.2",x2:"15",y2:"15.8"})]}),um=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("path",{d:"M4.5 9.5a5.5 5.5 0 1 1 1.4 3.7"}),D.jsx("path",{d:"M4.5 4.5v5h5"})]}),mb=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("circle",{cx:"9",cy:"9",r:"5.5"}),D.jsx("line",{x1:"13",y1:"13",x2:"17",y2:"17"}),D.jsx("line",{x1:"9",y1:"6.5",x2:"9",y2:"11.5"}),D.jsx("line",{x1:"6.5",y1:"9",x2:"11.5",y2:"9"})]}),gb=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("circle",{cx:"9",cy:"9",r:"5.5"}),D.jsx("line",{x1:"13",y1:"13",x2:"17",y2:"17"}),D.jsx("line",{x1:"6.5",y1:"9",x2:"11.5",y2:"9"})]}),hx=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("path",{d:"M3.5 7.5V3.5h4"}),D.jsx("path",{d:"M16.5 7.5V3.5h-4"}),D.jsx("path",{d:"M3.5 12.5v4h4"}),D.jsx("path",{d:"M16.5 12.5v4h-4"})]}),_b=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("path",{d:"M8.5 11.5L11.5 8.5"}),D.jsx("path",{d:"M11 6.5l1.5-1.5a2.8 2.8 0 0 1 4 4L15 10.5"}),D.jsx("path",{d:"M9 13.5l-1.5 1.5a2.8 2.8 0 0 1-4-4L5 9.5"})]}),vb=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("path",{d:"M10 3.5v9"}),D.jsx("path",{d:"M6.5 9.5L10 13l3.5-3.5"}),D.jsx("path",{d:"M4 16h12"})]}),yb=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("path",{d:"M10 12.5v-9"}),D.jsx("path",{d:"M6.5 6.5L10 3l3.5 3.5"}),D.jsx("path",{d:"M4 16h12"})]}),xb=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("rect",{x:"3",y:"4",width:"14",height:"12",rx:"1.8"}),D.jsx("circle",{cx:"7.5",cy:"8",r:"1.2"}),D.jsx("path",{d:"M4.5 14.5l4-4 3 3 2-2 2.5 3"})]}),Sb=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("circle",{cx:"10",cy:"10",r:"3.5"}),D.jsx("line",{x1:"10",y1:"2.5",x2:"10",y2:"4.2"}),D.jsx("line",{x1:"10",y1:"15.8",x2:"10",y2:"17.5"}),D.jsx("line",{x1:"2.5",y1:"10",x2:"4.2",y2:"10"}),D.jsx("line",{x1:"15.8",y1:"10",x2:"17.5",y2:"10"}),D.jsx("line",{x1:"4.7",y1:"4.7",x2:"5.9",y2:"5.9"}),D.jsx("line",{x1:"14.1",y1:"14.1",x2:"15.3",y2:"15.3"}),D.jsx("line",{x1:"15.3",y1:"4.7",x2:"14.1",y2:"5.9"}),D.jsx("line",{x1:"5.9",y1:"14.1",x2:"4.7",y2:"15.3"})]}),Mb=({size:o=15,className:e})=>D.jsx("svg",{...Kn(o,e),children:D.jsx("path",{d:"M15.8 11.7A6.2 6.2 0 0 1 8.3 4.2a6.2 6.2 0 1 0 7.5 7.5Z"})}),dx=({size:o=15,className:e})=>D.jsx("svg",{...Kn(o,e),children:D.jsx("path",{d:"M4.2 10.5l3.6 3.6L16 5.8"})}),px=({size:o=15,className:e})=>D.jsxs("svg",{...Kn(o,e),children:[D.jsx("circle",{cx:"10",cy:"10",r:"7"}),D.jsx("line",{x1:"10",y1:"6.5",x2:"10",y2:"10.8"}),D.jsx("circle",{cx:"10",cy:"13.8",r:"0.6",fill:"currentColor"})]}),Eb=({route:o,onNavigate:e,mode:i,onModeChange:r,theme:l,onToggleTheme:u,solvedCount:h,totalChallenges:d,onSharePermalink:p,onExportPng:g,onDownloadLogo:_,onOpenLogoFile:m})=>D.jsxs("header",{className:"topbar",children:[D.jsxs("div",{className:"topbar-left",children:[D.jsxs("button",{type:"button",className:"brand-btn",onClick:()=>e("pracownia"),"aria-label":"Logomocja — przejdź do pracowni",children:[D.jsxs("svg",{className:"brand-mark",viewBox:"0 0 24 24","aria-hidden":"true",children:[D.jsx("rect",{width:"24",height:"24",rx:"5",fill:"#1d3c32",stroke:"#2c594a",strokeWidth:"1"}),D.jsx("path",{d:"M12 4.5L18.5 18L12 14.8L5.5 18L12 4.5Z",fill:"#28b08d"})]}),D.jsx("span",{children:"Logomocja"})]}),D.jsxs("div",{className:"mode-switch",role:"group","aria-label":"Tryb rysowania",children:[D.jsx("button",{type:"button",className:"mode-btn","aria-pressed":i==="2d",onClick:()=>r("2d"),children:"2D"}),D.jsx("button",{type:"button",className:"mode-btn","aria-pressed":i==="3d",onClick:()=>r("3d"),children:"3D"})]})]}),D.jsxs("nav",{className:"topbar-center nav-tabs","aria-label":"Główna nawigacja",children:[D.jsx("button",{type:"button",className:"nav-tab","aria-current":o==="pracownia"?"page":void 0,onClick:()=>e("pracownia"),children:"Pracownia"}),D.jsx("button",{type:"button",className:"nav-tab","aria-current":o==="przyklady"?"page":void 0,onClick:()=>e("przyklady"),children:"Przykłady"}),D.jsxs("button",{type:"button",className:"nav-tab","aria-current":o==="wyzwania"?"page":void 0,onClick:()=>e("wyzwania"),children:[D.jsx("span",{children:"Wyzwania"}),D.jsxs("span",{className:"nav-badge tabular","aria-label":`Ukończono ${h} z ${d}`,children:[h,"/",d]})]}),D.jsx("button",{type:"button",className:"nav-tab","aria-current":o==="slownik"?"page":void 0,onClick:()=>e("slownik"),children:"Słownik"})]}),D.jsxs("div",{className:"topbar-right",children:[D.jsxs("button",{type:"button",className:"shell-btn",onClick:p,title:"Kopiuj link do programu","aria-label":"Kopiuj link do programu",children:[D.jsx(_b,{size:15}),D.jsx("span",{className:"btn-label-desktop",children:"Udostępnij"})]}),D.jsx("button",{type:"button",className:"shell-btn icon-only",onClick:g,title:"Zapisz rysunek jako PNG","aria-label":"Zapisz rysunek jako PNG",children:D.jsx(xb,{size:15})}),D.jsx("button",{type:"button",className:"shell-btn icon-only",onClick:_,title:"Pobierz program (.logo)","aria-label":"Pobierz program jako plik .logo",children:D.jsx(vb,{size:15})}),D.jsx("button",{type:"button",className:"shell-btn icon-only",onClick:m,title:"Otwórz plik .logo","aria-label":"Otwórz plik .logo z dysku",children:D.jsx(yb,{size:15})}),D.jsx("button",{type:"button",className:"shell-btn icon-only",onClick:u,title:l==="dark"?"Przełącz na motyw jasny":"Przełącz na motyw ciemny","aria-label":l==="dark"?"Przełącz na motyw jasny":"Przełącz na motyw ciemny",children:l==="dark"?D.jsx(Sb,{size:15}):D.jsx(Mb,{size:15})})]})]}),bb=new Set(["oto","to","już","juz","end","ma:","nrpowt","repcount"]);function Tb(o){const e=[];let i=0;for(;i<o.length;){const r=o[i];if(r===";"){e.push({text:o.slice(i),cls:"tok-comment"});break}if(r===" "||r==="	"){let l=i+1;for(;l<o.length&&(o[l]===" "||o[l]==="	");)l++;e.push({text:o.slice(i,l)}),i=l;continue}if(r==='"'){let l=i+1;for(;l<o.length&&o[l]!=='"';)l++;l<o.length&&l++,e.push({text:o.slice(i,l),cls:"tok-string"}),i=l;continue}if(r==="["||r==="]"||r==="("||r===")"){e.push({text:r,cls:"tok-bracket"}),i++;continue}if("+-*/<>=,".includes(r)){let l=i+1;(r==="<"||r===">")&&(o[l]==="="||r==="<"&&o[l]===">")&&l++,e.push({text:o.slice(i,l),cls:"tok-operator"}),i=l;continue}if(r>="0"&&r<="9"||r==="."&&i+1<o.length&&o[i+1]>="0"&&o[i+1]<="9"){let l=i+1;for(;l<o.length&&(o[l]>="0"&&o[l]<="9"||o[l]===".");)l++;e.push({text:o.slice(i,l),cls:"tok-number"}),i=l;continue}if(r===":"){let l=i+1;for(;l<o.length&&/[\p{L}\p{N}_]/u.test(o[l]);)l++;e.push({text:o.slice(i,l),cls:"tok-name"}),i=l;continue}if(/[\p{L}_]/u.test(r)){let l=i+1;for(;l<o.length&&/[\p{L}\p{N}_]/u.test(o[l]);)l++;o[l]===":"&&ku(o.slice(i,l))==="ma"&&l++;const u=o.slice(i,l),h=ku(u);let d="tok-name";bb.has(h)?d="tok-keyword":lm[h]&&(d="tok-command"),e.push({text:u,cls:d}),i=l;continue}e.push({text:r}),i++}return e}function wb(o,e){if(o.length===0)return e!==null?D.jsx("span",{className:"err-caret",children:" "}):`
`;const i=Tb(o);if(e===null)return i.map((h,d)=>h.cls?D.jsx("span",{className:h.cls,children:h.text},d):D.jsx(_p.Fragment,{children:h.text},d));const r=Math.max(0,Math.min(o.length-1,e-1));let l=0;const u=[];return i.forEach((h,d)=>{const p=l,g=l+h.text.length;if(l=g,r>=p&&r<g){const _=r-p,m=h.text.slice(0,_),y=h.text.slice(_)||" ";u.push(D.jsxs("span",{className:h.cls,children:[m,D.jsx("span",{className:"err-caret",children:y})]},d))}else h.cls?u.push(D.jsx("span",{className:h.cls,children:h.text},d)):u.push(D.jsx(_p.Fragment,{children:h.text},d))}),u}const Ab=({value:o,onChange:e,activeLine:i,error:r,onRunShortcut:l})=>{const u=Et.useRef(null),h=Et.useRef(null),d=Et.useRef(null),p=Et.useMemo(()=>o.split(`
`),[o]),g=()=>{const m=u.current;m&&(h.current&&(h.current.scrollTop=m.scrollTop,h.current.scrollLeft=m.scrollLeft),d.current&&(d.current.scrollTop=m.scrollTop))},_=m=>{if((m.metaKey||m.ctrlKey)&&m.key==="Enter"){m.preventDefault(),l==null||l();return}if(m.key==="Tab"&&!m.shiftKey&&!m.ctrlKey&&!m.metaKey&&!m.altKey){m.preventDefault();const y=m.currentTarget,x=y.selectionStart,b=y.selectionEnd,T=o.slice(0,x)+"  "+o.slice(b);e(T),requestAnimationFrame(()=>{y.selectionStart=y.selectionEnd=x+2})}};return D.jsxs(D.Fragment,{children:[D.jsxs("div",{className:"code-editor-wrap",children:[D.jsx("div",{className:"code-gutter tabular",ref:d,"aria-hidden":"true",children:p.map((m,y)=>{const x=y+1,b=(r==null?void 0:r.line)===x,T=i===x&&!b;return D.jsx("div",{className:`gutter-line${b?" is-error":T?" is-active":""}`,children:x},x)})}),D.jsxs("div",{className:"code-stage",children:[D.jsx("div",{className:"code-highlight",ref:h,"aria-hidden":"true",children:p.map((m,y)=>{const x=y+1,b=(r==null?void 0:r.line)===x,T=i===x&&!b;return D.jsx("div",{className:`code-line${b?" is-error":T?" is-active":""}`,children:wb(m,b?r.column:null)},x)})}),D.jsx("textarea",{ref:u,className:"code-textarea",value:o,onChange:m=>e(m.target.value),onScroll:g,onKeyDown:_,spellCheck:!1,autoCapitalize:"off",autoComplete:"off",autoCorrect:"off","aria-label":"Edytor kodu Logo"})]})]}),r&&D.jsxs("div",{className:"diagnostic-bar",role:"alert",children:[D.jsx(px,{size:16}),D.jsxs("span",{className:"diagnostic-loc tabular",children:["W",r.line,":K",r.column]}),D.jsx("span",{children:r.message})]})]})},mx=Et.forwardRef(({segments:o,turtle:e,theme:i,guideSegments:r},l)=>{const u=Et.useRef(null),h=Et.useRef(null),[d,p]=Et.useState({x:0,y:0,scale:1.4}),g=Et.useRef(d);g.current=d;const _=Et.useRef({active:!1,startX:0,startY:0,camX:0,camY:0}),m=Et.useCallback(z=>{const F=u.current;if(!F)return;const P=F.getBoundingClientRect(),L=Math.max(200,P.width),V=Math.max(200,P.height),C=z??o;if(C.length===0&&(!r||r.length===0)){p({x:0,y:0,scale:1.4});return}let E=1/0,k=-1/0,et=1/0,tt=-1/0;const ut=At=>{for(const Xt of At)E=Math.min(E,Xt.from[0],Xt.to[0]),k=Math.max(k,Xt.from[0],Xt.to[0]),et=Math.min(et,Xt.from[1],Xt.to[1]),tt=Math.max(tt,Xt.from[1],Xt.to[1])};if(ut(C),r&&ut(r),!Number.isFinite(E)){p({x:0,y:0,scale:1.4});return}const ft=Math.max(20,k-E),X=Math.max(20,tt-et),it=56,W=(L-it*2)/ft,mt=(V-it*2)/X,vt=Math.max(.05,Math.min(20,Math.min(W,mt)));p({x:(E+k)/2,y:(et+tt)/2,scale:vt})},[o,r]),y=Et.useCallback(()=>{p({x:0,y:0,scale:1.4})},[]),x=Et.useCallback(()=>{const z=h.current;return z?z.toDataURL("image/png"):null},[]);Et.useImperativeHandle(l,()=>({fit:m,resetView:y,exportPng:x}),[m,y,x]);const b=Et.useCallback(()=>{const z=h.current,F=u.current;if(!z||!F)return;const P=F.getBoundingClientRect(),L=Math.min(window.devicePixelRatio||1,2),V=Math.max(1,Math.floor(P.width)),C=Math.max(1,Math.floor(P.height));(z.width!==Math.floor(V*L)||z.height!==Math.floor(C*L))&&(z.width=Math.floor(V*L),z.height=Math.floor(C*L));const E=z.getContext("2d");if(!E)return;E.save(),E.scale(L,L);const k=getComputedStyle(document.documentElement),et=k.getPropertyValue("--bg-canvas").trim()||(i==="dark"?"#0c1613":"#ffffff"),tt=k.getPropertyValue("--grid-minor").trim()||(i==="dark"?"#142520":"#ecefe9"),ut=k.getPropertyValue("--grid-major").trim()||(i==="dark"?"#1f3730":"#d8dfd7"),ft=k.getPropertyValue("--axis-x").trim()||"#c24b3d",X=k.getPropertyValue("--axis-y").trim()||"#16866a",it=k.getPropertyValue("--text-muted").trim()||"#5a6e66";E.fillStyle=et,E.fillRect(0,0,V,C);const{x:W,y:mt,scale:vt}=d,At=Wt=>V/2+(Wt-W)*vt,Xt=Wt=>C/2-(Wt-mt)*vt,he=40/vt,R=Math.pow(10,Math.floor(Math.log10(Math.max(he,1e-6)))),Y=he/R,pt=(Y<1.5?1:Y<3.5?2:Y<7.5?5:10)*R,ht=pt*5,Ct=W-V/(2*vt),Ut=W+V/(2*vt),bt=mt-C/(2*vt),Dt=mt+C/(2*vt),zt=Math.floor(Ct/pt)*pt,se=Math.floor(bt/pt)*pt;E.lineWidth=1;for(let Wt=zt;Wt<=Ut;Wt+=pt){const Vt=Math.round(At(Wt))+.5,O=Math.abs(Math.round(Wt/ht)*ht-Wt)<pt*.01;E.strokeStyle=O?ut:tt,E.beginPath(),E.moveTo(Vt,0),E.lineTo(Vt,C),E.stroke()}for(let Wt=se;Wt<=Dt;Wt+=pt){const Vt=Math.round(Xt(Wt))+.5,O=Math.abs(Math.round(Wt/ht)*ht-Wt)<pt*.01;E.strokeStyle=O?ut:tt,E.beginPath(),E.moveTo(0,Vt),E.lineTo(V,Vt),E.stroke()}const H=At(0),Ue=Xt(0);if(Ue>=-2&&Ue<=C+2&&(E.strokeStyle=ft,E.globalAlpha=.35,E.lineWidth=1,E.beginPath(),E.moveTo(0,Ue),E.lineTo(V,Ue),E.stroke()),H>=-2&&H<=V+2&&(E.strokeStyle=X,E.globalAlpha=.35,E.lineWidth=1,E.beginPath(),E.moveTo(H,0),E.lineTo(H,C),E.stroke()),E.globalAlpha=1,E.fillStyle=it,E.beginPath(),E.arc(H,Ue,3,0,Math.PI*2),E.fill(),E.font="11px ui-monospace, monospace",E.fillText("0,0",H+6,Ue+12),r&&r.length>0){E.save(),E.setLineDash([5,5]),E.strokeStyle=it,E.globalAlpha=.4,E.lineWidth=2,E.lineCap="round";for(const Wt of r)E.beginPath(),E.moveTo(At(Wt.from[0]),Xt(Wt.from[1])),E.lineTo(At(Wt.to[0]),Xt(Wt.to[1])),E.stroke();E.restore()}E.lineCap="round",E.lineJoin="round";for(const Wt of o)E.strokeStyle=Wt.color,E.lineWidth=Math.max(1,Wt.width*Math.min(1.6,Math.max(.65,vt*.75))),E.beginPath(),E.moveTo(At(Wt.from[0]),Xt(Wt.from[1])),E.lineTo(At(Wt.to[0]),Xt(Wt.to[1])),E.stroke();const ne=At(e.pos[0]),qt=Xt(e.pos[1]),Nt=Math.atan2(e.heading[0],e.heading[1]);E.save(),E.translate(ne,qt),E.rotate(Nt),E.beginPath(),E.moveTo(0,-12),E.lineTo(8,8),E.lineTo(0,4),E.lineTo(-8,8),E.closePath(),E.fillStyle=e.penDown?e.color:et,E.fill(),E.lineWidth=1.75,E.strokeStyle=i==="dark"?"#eef4f1":"#14221d",E.stroke(),E.restore(),E.restore()},[d,o,e,i,r]);Et.useEffect(()=>{b()},[b]),Et.useEffect(()=>{const z=u.current;if(!z)return;const F=new ResizeObserver(()=>b());return F.observe(z),()=>F.disconnect()},[b]);const T=z=>{z.currentTarget.setPointerCapture(z.pointerId),_.current={active:!0,startX:z.clientX,startY:z.clientY,camX:g.current.x,camY:g.current.y}},M=z=>{if(!_.current.active)return;const F=z.clientX-_.current.startX,P=z.clientY-_.current.startY;p(L=>({...L,x:_.current.camX-F/L.scale,y:_.current.camY+P/L.scale}))},S=()=>{_.current.active=!1},G=z=>{z.preventDefault();const F=h.current;if(!F)return;const P=F.getBoundingClientRect(),L=z.clientX-P.left,V=z.clientY-P.top,C=z.deltaY<0?1.12:1/1.12;p(E=>{const k=Math.max(.05,Math.min(40,E.scale*C)),et=E.x+(L-P.width/2)/E.scale,tt=E.y-(V-P.height/2)/E.scale;return{scale:k,x:et-(L-P.width/2)/k,y:tt+(V-P.height/2)/k}})},I=z=>{p(F=>({...F,scale:Math.max(.05,Math.min(40,F.scale*z))}))};return D.jsxs("div",{ref:u,style:{position:"relative",width:"100%",height:"100%",touchAction:"none"},children:[D.jsx("canvas",{ref:h,style:{width:"100%",height:"100%",display:"block",cursor:"grab"},onPointerDown:T,onPointerMove:M,onPointerUp:S,onPointerCancel:S,onWheel:G,"aria-label":"Płótno 2D — przeciągnij, aby przesunąć, użyj kółka myszy, aby przybliżyć"}),D.jsxs("div",{className:"viewport-overlay-controls",role:"toolbar","aria-label":"Widok 2D",children:[D.jsx("button",{type:"button",className:"btn btn-ghost btn-icon btn-sm",onClick:()=>I(1.25),title:"Przybliż","aria-label":"Przybliż widok",children:D.jsx(mb,{size:15})}),D.jsx("button",{type:"button",className:"btn btn-ghost btn-icon btn-sm",onClick:()=>I(.8),title:"Oddal","aria-label":"Oddal widok",children:D.jsx(gb,{size:15})}),D.jsx("button",{type:"button",className:"btn btn-ghost btn-icon btn-sm",onClick:()=>m(),title:"Dopasuj rysunek do ekranu","aria-label":"Dopasuj rysunek do ekranu",children:D.jsx(hx,{size:15})}),D.jsx("button",{type:"button",className:"btn btn-ghost btn-icon btn-sm",onClick:y,title:"Wyśrodkuj (0, 0)","aria-label":"Przywróć domyślny widok 2D",children:D.jsx(um,{size:15})})]})]})});mx.displayName="Canvas2D";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const fm="175",ho={ROTATE:0,DOLLY:1,PAN:2},co={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rb=0,$v=1,Cb=2,gx=1,Db=2,Ra=3,_r=0,ri=1,Ca=2,mr=0,po=1,ty=2,ey=3,ny=4,Nb=5,$r=100,zb=101,Ub=102,Lb=103,Ob=104,Pb=200,Ib=201,Bb=202,Fb=203,xp=204,Sp=205,kb=206,Hb=207,Gb=208,Vb=209,jb=210,Xb=211,Wb=212,Yb=213,qb=214,Mp=0,Ep=1,bp=2,go=3,Tp=4,wp=5,Ap=6,Rp=7,_x=0,Zb=1,Kb=2,gr=0,Qb=1,Jb=2,$b=3,tT=4,eT=5,nT=6,iT=7,vx=300,_o=301,vo=302,Cp=303,Dp=304,Zu=306,Np=1e3,es=1001,zp=1002,gi=1003,aT=1004,su=1005,ea=1006,Bd=1007,ns=1008,za=1009,yx=1010,xx=1011,Dl=1012,hm=1013,is=1014,na=1015,Ll=1016,dm=1017,pm=1018,Nl=1020,Sx=35902,Mx=1021,Ex=1022,ki=1023,bx=1024,Tx=1025,zl=1026,Ul=1027,mm=1028,gm=1029,wx=1030,_m=1031,vm=1033,zu=33776,Uu=33777,Lu=33778,Ou=33779,Up=35840,Lp=35841,Op=35842,Pp=35843,Ip=36196,Bp=37492,Fp=37496,kp=37808,Hp=37809,Gp=37810,Vp=37811,jp=37812,Xp=37813,Wp=37814,Yp=37815,qp=37816,Zp=37817,Kp=37818,Qp=37819,Jp=37820,$p=37821,Pu=36492,tm=36494,em=36495,Ax=36283,nm=36284,im=36285,am=36286,rT=3200,sT=3201,Rx=0,oT=1,pr="",Ai="srgb",yo="srgb-linear",Gu="linear",Ve="srgb",qs=7680,iy=519,lT=512,cT=513,uT=514,Cx=515,fT=516,hT=517,dT=518,pT=519,ay=35044,ry="300 es",Da=2e3,Vu=2001;class ss{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(i)===-1&&r[e].push(i)}hasEventListener(e,i){const r=this._listeners;return r===void 0?!1:r[e]!==void 0&&r[e].indexOf(i)!==-1}removeEventListener(e,i){const r=this._listeners;if(r===void 0)return;const l=r[e];if(l!==void 0){const u=l.indexOf(i);u!==-1&&l.splice(u,1)}}dispatchEvent(e){const i=this._listeners;if(i===void 0)return;const r=i[e.type];if(r!==void 0){e.target=this;const l=r.slice(0);for(let u=0,h=l.length;u<h;u++)l[u].call(this,e);e.target=null}}}const Gn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Iu=Math.PI/180,rm=180/Math.PI;function Ol(){const o=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Gn[o&255]+Gn[o>>8&255]+Gn[o>>16&255]+Gn[o>>24&255]+"-"+Gn[e&255]+Gn[e>>8&255]+"-"+Gn[e>>16&15|64]+Gn[e>>24&255]+"-"+Gn[i&63|128]+Gn[i>>8&255]+"-"+Gn[i>>16&255]+Gn[i>>24&255]+Gn[r&255]+Gn[r>>8&255]+Gn[r>>16&255]+Gn[r>>24&255]).toLowerCase()}function be(o,e,i){return Math.max(e,Math.min(i,o))}function mT(o,e){return(o%e+e)%e}function Fd(o,e,i){return(1-i)*o+i*e}function _l(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function ni(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}const gT={DEG2RAD:Iu};class me{constructor(e=0,i=0){me.prototype.isVector2=!0,this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,r=this.y,l=e.elements;return this.x=l[0]*i+l[3]*r+l[6],this.y=l[1]*i+l[4]*r+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=be(this.x,e.x,i.x),this.y=be(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=be(this.x,e,i),this.y=be(this.y,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(be(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(be(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y;return i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const r=Math.cos(i),l=Math.sin(i),u=this.x-e.x,h=this.y-e.y;return this.x=u*r-h*l+e.x,this.y=u*l+h*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ge{constructor(e,i,r,l,u,h,d,p,g){ge.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,h,d,p,g)}set(e,i,r,l,u,h,d,p,g){const _=this.elements;return _[0]=e,_[1]=l,_[2]=d,_[3]=i,_[4]=u,_[5]=p,_[6]=r,_[7]=h,_[8]=g,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(e,i,r){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,h=r[0],d=r[3],p=r[6],g=r[1],_=r[4],m=r[7],y=r[2],x=r[5],b=r[8],T=l[0],M=l[3],S=l[6],G=l[1],I=l[4],z=l[7],F=l[2],P=l[5],L=l[8];return u[0]=h*T+d*G+p*F,u[3]=h*M+d*I+p*P,u[6]=h*S+d*z+p*L,u[1]=g*T+_*G+m*F,u[4]=g*M+_*I+m*P,u[7]=g*S+_*z+m*L,u[2]=y*T+x*G+b*F,u[5]=y*M+x*I+b*P,u[8]=y*S+x*z+b*L,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],h=e[4],d=e[5],p=e[6],g=e[7],_=e[8];return i*h*_-i*d*g-r*u*_+r*d*p+l*u*g-l*h*p}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],h=e[4],d=e[5],p=e[6],g=e[7],_=e[8],m=_*h-d*g,y=d*p-_*u,x=g*u-h*p,b=i*m+r*y+l*x;if(b===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/b;return e[0]=m*T,e[1]=(l*g-_*r)*T,e[2]=(d*r-l*h)*T,e[3]=y*T,e[4]=(_*i-l*p)*T,e[5]=(l*u-d*i)*T,e[6]=x*T,e[7]=(r*p-g*i)*T,e[8]=(h*i-r*u)*T,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,r,l,u,h,d){const p=Math.cos(u),g=Math.sin(u);return this.set(r*p,r*g,-r*(p*h+g*d)+h+e,-l*g,l*p,-l*(-g*h+p*d)+d+i,0,0,1),this}scale(e,i){return this.premultiply(kd.makeScale(e,i)),this}rotate(e){return this.premultiply(kd.makeRotation(-e)),this}translate(e,i){return this.premultiply(kd.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<9;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<9;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const kd=new ge;function Dx(o){for(let e=o.length-1;e>=0;--e)if(o[e]>=65535)return!0;return!1}function ju(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function _T(){const o=ju("canvas");return o.style.display="block",o}const sy={};function Bu(o){o in sy||(sy[o]=!0,console.warn(o))}function vT(o,e,i){return new Promise(function(r,l){function u(){switch(o.clientWaitSync(e,o.SYNC_FLUSH_COMMANDS_BIT,0)){case o.WAIT_FAILED:l();break;case o.TIMEOUT_EXPIRED:setTimeout(u,i);break;default:r()}}setTimeout(u,i)})}function yT(o){const e=o.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function xT(o){const e=o.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const oy=new ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ly=new ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ST(){const o={enabled:!0,workingColorSpace:yo,spaces:{},convert:function(l,u,h){return this.enabled===!1||u===h||!u||!h||(this.spaces[u].transfer===Ve&&(l.r=Na(l.r),l.g=Na(l.g),l.b=Na(l.b)),this.spaces[u].primaries!==this.spaces[h].primaries&&(l.applyMatrix3(this.spaces[u].toXYZ),l.applyMatrix3(this.spaces[h].fromXYZ)),this.spaces[h].transfer===Ve&&(l.r=mo(l.r),l.g=mo(l.g),l.b=mo(l.b))),l},fromWorkingColorSpace:function(l,u){return this.convert(l,this.workingColorSpace,u)},toWorkingColorSpace:function(l,u){return this.convert(l,u,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===pr?Gu:this.spaces[l].transfer},getLuminanceCoefficients:function(l,u=this.workingColorSpace){return l.fromArray(this.spaces[u].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,u,h){return l.copy(this.spaces[u].toXYZ).multiply(this.spaces[h].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],r=[.3127,.329];return o.define({[yo]:{primaries:e,whitePoint:r,transfer:Gu,toXYZ:oy,fromXYZ:ly,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Ai},outputColorSpaceConfig:{drawingBufferColorSpace:Ai}},[Ai]:{primaries:e,whitePoint:r,transfer:Ve,toXYZ:oy,fromXYZ:ly,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Ai}}}),o}const Pe=ST();function Na(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function mo(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let Zs;class MT{static getDataURL(e,i="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let r;if(e instanceof HTMLCanvasElement)r=e;else{Zs===void 0&&(Zs=ju("canvas")),Zs.width=e.width,Zs.height=e.height;const l=Zs.getContext("2d");e instanceof ImageData?l.putImageData(e,0,0):l.drawImage(e,0,0,e.width,e.height),r=Zs}return r.toDataURL(i)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=ju("canvas");i.width=e.width,i.height=e.height;const r=i.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const l=r.getImageData(0,0,e.width,e.height),u=l.data;for(let h=0;h<u.length;h++)u[h]=Na(u[h]/255)*255;return r.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let r=0;r<i.length;r++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[r]=Math.floor(Na(i[r]/255)*255):i[r]=Na(i[r]);return{data:i,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ET=0;class ym{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ET++}),this.uuid=Ol(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},l=this.data;if(l!==null){let u;if(Array.isArray(l)){u=[];for(let h=0,d=l.length;h<d;h++)l[h].isDataTexture?u.push(Hd(l[h].image)):u.push(Hd(l[h]))}else u=Hd(l);r.url=u}return i||(e.images[this.uuid]=r),r}}function Hd(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?MT.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let bT=0;class Zn extends ss{constructor(e=Zn.DEFAULT_IMAGE,i=Zn.DEFAULT_MAPPING,r=es,l=es,u=ea,h=ns,d=ki,p=za,g=Zn.DEFAULT_ANISOTROPY,_=pr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bT++}),this.uuid=Ol(),this.name="",this.source=new ym(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=l,this.magFilter=u,this.minFilter=h,this.anisotropy=g,this.format=d,this.internalFormat=null,this.type=p,this.offset=new me(0,0),this.repeat=new me(1,1),this.center=new me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vx)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Np:e.x=e.x-Math.floor(e.x);break;case es:e.x=e.x<0?0:1;break;case zp:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Np:e.y=e.y-Math.floor(e.y);break;case es:e.y=e.y<0?0:1;break;case zp:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Zn.DEFAULT_IMAGE=null;Zn.DEFAULT_MAPPING=vx;Zn.DEFAULT_ANISOTROPY=1;class on{constructor(e=0,i=0,r=0,l=1){on.prototype.isVector4=!0,this.x=e,this.y=i,this.z=r,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,r,l){return this.x=e,this.y=i,this.z=r,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=this.w,h=e.elements;return this.x=h[0]*i+h[4]*r+h[8]*l+h[12]*u,this.y=h[1]*i+h[5]*r+h[9]*l+h[13]*u,this.z=h[2]*i+h[6]*r+h[10]*l+h[14]*u,this.w=h[3]*i+h[7]*r+h[11]*l+h[15]*u,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,r,l,u;const p=e.elements,g=p[0],_=p[4],m=p[8],y=p[1],x=p[5],b=p[9],T=p[2],M=p[6],S=p[10];if(Math.abs(_-y)<.01&&Math.abs(m-T)<.01&&Math.abs(b-M)<.01){if(Math.abs(_+y)<.1&&Math.abs(m+T)<.1&&Math.abs(b+M)<.1&&Math.abs(g+x+S-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const I=(g+1)/2,z=(x+1)/2,F=(S+1)/2,P=(_+y)/4,L=(m+T)/4,V=(b+M)/4;return I>z&&I>F?I<.01?(r=0,l=.707106781,u=.707106781):(r=Math.sqrt(I),l=P/r,u=L/r):z>F?z<.01?(r=.707106781,l=0,u=.707106781):(l=Math.sqrt(z),r=P/l,u=V/l):F<.01?(r=.707106781,l=.707106781,u=0):(u=Math.sqrt(F),r=L/u,l=V/u),this.set(r,l,u,i),this}let G=Math.sqrt((M-b)*(M-b)+(m-T)*(m-T)+(y-_)*(y-_));return Math.abs(G)<.001&&(G=1),this.x=(M-b)/G,this.y=(m-T)/G,this.z=(y-_)/G,this.w=Math.acos((g+x+S-1)/2),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=be(this.x,e.x,i.x),this.y=be(this.y,e.y,i.y),this.z=be(this.z,e.z,i.z),this.w=be(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=be(this.x,e,i),this.y=be(this.y,e,i),this.z=be(this.z,e,i),this.w=be(this.w,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(be(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this.w=e.w+(i.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class TT extends ss{constructor(e=1,i=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=1,this.scissor=new on(0,0,e,i),this.scissorTest=!1,this.viewport=new on(0,0,e,i);const l={width:e,height:i,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ea,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const u=new Zn(l,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);u.flipY=!1,u.generateMipmaps=r.generateMipmaps,u.internalFormat=r.internalFormat,this.textures=[];const h=r.count;for(let d=0;d<h;d++)this.textures[d]=u.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,i,r=1){if(this.width!==e||this.height!==i||this.depth!==r){this.width=e,this.height=i,this.depth=r;for(let l=0,u=this.textures.length;l<u;l++)this.textures[l].image.width=e,this.textures[l].image.height=i,this.textures[l].image.depth=r;this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++){this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},e.textures[i].image);this.textures[i].source=new ym(l)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class as extends TT{constructor(e=1,i=1,r={}){super(e,i,r),this.isWebGLRenderTarget=!0}}class Nx extends Zn{constructor(e=null,i=1,r=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=gi,this.minFilter=gi,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class wT extends Zn{constructor(e=null,i=1,r=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=gi,this.minFilter=gi,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class vr{constructor(e=0,i=0,r=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=r,this._w=l}static slerpFlat(e,i,r,l,u,h,d){let p=r[l+0],g=r[l+1],_=r[l+2],m=r[l+3];const y=u[h+0],x=u[h+1],b=u[h+2],T=u[h+3];if(d===0){e[i+0]=p,e[i+1]=g,e[i+2]=_,e[i+3]=m;return}if(d===1){e[i+0]=y,e[i+1]=x,e[i+2]=b,e[i+3]=T;return}if(m!==T||p!==y||g!==x||_!==b){let M=1-d;const S=p*y+g*x+_*b+m*T,G=S>=0?1:-1,I=1-S*S;if(I>Number.EPSILON){const F=Math.sqrt(I),P=Math.atan2(F,S*G);M=Math.sin(M*P)/F,d=Math.sin(d*P)/F}const z=d*G;if(p=p*M+y*z,g=g*M+x*z,_=_*M+b*z,m=m*M+T*z,M===1-d){const F=1/Math.sqrt(p*p+g*g+_*_+m*m);p*=F,g*=F,_*=F,m*=F}}e[i]=p,e[i+1]=g,e[i+2]=_,e[i+3]=m}static multiplyQuaternionsFlat(e,i,r,l,u,h){const d=r[l],p=r[l+1],g=r[l+2],_=r[l+3],m=u[h],y=u[h+1],x=u[h+2],b=u[h+3];return e[i]=d*b+_*m+p*x-g*y,e[i+1]=p*b+_*y+g*m-d*x,e[i+2]=g*b+_*x+d*y-p*m,e[i+3]=_*b-d*m-p*y-g*x,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,r,l){return this._x=e,this._y=i,this._z=r,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const r=e._x,l=e._y,u=e._z,h=e._order,d=Math.cos,p=Math.sin,g=d(r/2),_=d(l/2),m=d(u/2),y=p(r/2),x=p(l/2),b=p(u/2);switch(h){case"XYZ":this._x=y*_*m+g*x*b,this._y=g*x*m-y*_*b,this._z=g*_*b+y*x*m,this._w=g*_*m-y*x*b;break;case"YXZ":this._x=y*_*m+g*x*b,this._y=g*x*m-y*_*b,this._z=g*_*b-y*x*m,this._w=g*_*m+y*x*b;break;case"ZXY":this._x=y*_*m-g*x*b,this._y=g*x*m+y*_*b,this._z=g*_*b+y*x*m,this._w=g*_*m-y*x*b;break;case"ZYX":this._x=y*_*m-g*x*b,this._y=g*x*m+y*_*b,this._z=g*_*b-y*x*m,this._w=g*_*m+y*x*b;break;case"YZX":this._x=y*_*m+g*x*b,this._y=g*x*m+y*_*b,this._z=g*_*b-y*x*m,this._w=g*_*m-y*x*b;break;case"XZY":this._x=y*_*m-g*x*b,this._y=g*x*m-y*_*b,this._z=g*_*b+y*x*m,this._w=g*_*m+y*x*b;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const r=i/2,l=Math.sin(r);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,r=i[0],l=i[4],u=i[8],h=i[1],d=i[5],p=i[9],g=i[2],_=i[6],m=i[10],y=r+d+m;if(y>0){const x=.5/Math.sqrt(y+1);this._w=.25/x,this._x=(_-p)*x,this._y=(u-g)*x,this._z=(h-l)*x}else if(r>d&&r>m){const x=2*Math.sqrt(1+r-d-m);this._w=(_-p)/x,this._x=.25*x,this._y=(l+h)/x,this._z=(u+g)/x}else if(d>m){const x=2*Math.sqrt(1+d-r-m);this._w=(u-g)/x,this._x=(l+h)/x,this._y=.25*x,this._z=(p+_)/x}else{const x=2*Math.sqrt(1+m-r-d);this._w=(h-l)/x,this._x=(u+g)/x,this._y=(p+_)/x,this._z=.25*x}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let r=e.dot(i)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(be(this.dot(e),-1,1)))}rotateTowards(e,i){const r=this.angleTo(e);if(r===0)return this;const l=Math.min(1,i/r);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const r=e._x,l=e._y,u=e._z,h=e._w,d=i._x,p=i._y,g=i._z,_=i._w;return this._x=r*_+h*d+l*g-u*p,this._y=l*_+h*p+u*d-r*g,this._z=u*_+h*g+r*p-l*d,this._w=h*_-r*d-l*p-u*g,this._onChangeCallback(),this}slerp(e,i){if(i===0)return this;if(i===1)return this.copy(e);const r=this._x,l=this._y,u=this._z,h=this._w;let d=h*e._w+r*e._x+l*e._y+u*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=h,this._x=r,this._y=l,this._z=u,this;const p=1-d*d;if(p<=Number.EPSILON){const x=1-i;return this._w=x*h+i*this._w,this._x=x*r+i*this._x,this._y=x*l+i*this._y,this._z=x*u+i*this._z,this.normalize(),this}const g=Math.sqrt(p),_=Math.atan2(g,d),m=Math.sin((1-i)*_)/g,y=Math.sin(i*_)/g;return this._w=h*m+this._w*y,this._x=r*m+this._x*y,this._y=l*m+this._y*y,this._z=u*m+this._z*y,this._onChangeCallback(),this}slerpQuaternions(e,i,r){return this.copy(e).slerp(i,r)}random(){const e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),r=Math.random(),l=Math.sqrt(1-r),u=Math.sqrt(r);return this.set(l*Math.sin(e),l*Math.cos(e),u*Math.sin(i),u*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ${constructor(e=0,i=0,r=0){$.prototype.isVector3=!0,this.x=e,this.y=i,this.z=r}set(e,i,r){return r===void 0&&(r=this.z),this.x=e,this.y=i,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(cy.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(cy.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[3]*r+u[6]*l,this.y=u[1]*i+u[4]*r+u[7]*l,this.z=u[2]*i+u[5]*r+u[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=e.elements,h=1/(u[3]*i+u[7]*r+u[11]*l+u[15]);return this.x=(u[0]*i+u[4]*r+u[8]*l+u[12])*h,this.y=(u[1]*i+u[5]*r+u[9]*l+u[13])*h,this.z=(u[2]*i+u[6]*r+u[10]*l+u[14])*h,this}applyQuaternion(e){const i=this.x,r=this.y,l=this.z,u=e.x,h=e.y,d=e.z,p=e.w,g=2*(h*l-d*r),_=2*(d*i-u*l),m=2*(u*r-h*i);return this.x=i+p*g+h*m-d*_,this.y=r+p*_+d*g-u*m,this.z=l+p*m+u*_-h*g,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[4]*r+u[8]*l,this.y=u[1]*i+u[5]*r+u[9]*l,this.z=u[2]*i+u[6]*r+u[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=be(this.x,e.x,i.x),this.y=be(this.y,e.y,i.y),this.z=be(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=be(this.x,e,i),this.y=be(this.y,e,i),this.z=be(this.z,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(be(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const r=e.x,l=e.y,u=e.z,h=i.x,d=i.y,p=i.z;return this.x=l*p-u*d,this.y=u*h-r*p,this.z=r*d-l*h,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const r=e.dot(this)/i;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Gd.copy(this).projectOnVector(e),this.sub(Gd)}reflect(e){return this.sub(Gd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(be(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y,l=this.z-e.z;return i*i+r*r+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,r){const l=Math.sin(i)*e;return this.x=l*Math.sin(r),this.y=Math.cos(i)*e,this.z=l*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,r){return this.x=e*Math.sin(i),this.y=r,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=r,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,i=Math.random()*2-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(e),this.y=i,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Gd=new $,cy=new vr;class xr{constructor(e=new $(1/0,1/0,1/0),i=new $(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i+=3)this.expandByPoint(Pi.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,r=e.count;i<r;i++)this.expandByPoint(Pi.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const r=Pi.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const u=r.getAttribute("position");if(i===!0&&u!==void 0&&e.isInstancedMesh!==!0)for(let h=0,d=u.count;h<d;h++)e.isMesh===!0?e.getVertexPosition(h,Pi):Pi.fromBufferAttribute(u,h),Pi.applyMatrix4(e.matrixWorld),this.expandByPoint(Pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ou.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),ou.copy(r.boundingBox)),ou.applyMatrix4(e.matrixWorld),this.union(ou)}const l=e.children;for(let u=0,h=l.length;u<h;u++)this.expandByObject(l[u],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Pi),Pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,r;return e.normal.x>0?(i=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),i<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(vl),lu.subVectors(this.max,vl),Ks.subVectors(e.a,vl),Qs.subVectors(e.b,vl),Js.subVectors(e.c,vl),or.subVectors(Qs,Ks),lr.subVectors(Js,Qs),jr.subVectors(Ks,Js);let i=[0,-or.z,or.y,0,-lr.z,lr.y,0,-jr.z,jr.y,or.z,0,-or.x,lr.z,0,-lr.x,jr.z,0,-jr.x,-or.y,or.x,0,-lr.y,lr.x,0,-jr.y,jr.x,0];return!Vd(i,Ks,Qs,Js,lu)||(i=[1,0,0,0,1,0,0,0,1],!Vd(i,Ks,Qs,Js,lu))?!1:(cu.crossVectors(or,lr),i=[cu.x,cu.y,cu.z],Vd(i,Ks,Qs,Js,lu))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ea[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ea[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ea[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ea[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ea[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ea[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ea[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ea[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ea),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ea=[new $,new $,new $,new $,new $,new $,new $,new $],Pi=new $,ou=new xr,Ks=new $,Qs=new $,Js=new $,or=new $,lr=new $,jr=new $,vl=new $,lu=new $,cu=new $,Xr=new $;function Vd(o,e,i,r,l){for(let u=0,h=o.length-3;u<=h;u+=3){Xr.fromArray(o,u);const d=l.x*Math.abs(Xr.x)+l.y*Math.abs(Xr.y)+l.z*Math.abs(Xr.z),p=e.dot(Xr),g=i.dot(Xr),_=r.dot(Xr);if(Math.max(-Math.max(p,g,_),Math.min(p,g,_))>d)return!1}return!0}const AT=new xr,yl=new $,jd=new $;class os{constructor(e=new $,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const r=this.center;i!==void 0?r.copy(i):AT.setFromPoints(e).getCenter(r);let l=0;for(let u=0,h=e.length;u<h;u++)l=Math.max(l,r.distanceToSquared(e[u]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const r=this.center.distanceToSquared(e);return i.copy(e),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;yl.subVectors(e,this.center);const i=yl.lengthSq();if(i>this.radius*this.radius){const r=Math.sqrt(i),l=(r-this.radius)*.5;this.center.addScaledVector(yl,l/r),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(jd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(yl.copy(e.center).add(jd)),this.expandByPoint(yl.copy(e.center).sub(jd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ba=new $,Xd=new $,uu=new $,cr=new $,Wd=new $,fu=new $,Yd=new $;class xm{constructor(e=new $,i=new $(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ba)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const r=i.dot(this.direction);return r<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=ba.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(ba.copy(this.origin).addScaledVector(this.direction,i),ba.distanceToSquared(e))}distanceSqToSegment(e,i,r,l){Xd.copy(e).add(i).multiplyScalar(.5),uu.copy(i).sub(e).normalize(),cr.copy(this.origin).sub(Xd);const u=e.distanceTo(i)*.5,h=-this.direction.dot(uu),d=cr.dot(this.direction),p=-cr.dot(uu),g=cr.lengthSq(),_=Math.abs(1-h*h);let m,y,x,b;if(_>0)if(m=h*p-d,y=h*d-p,b=u*_,m>=0)if(y>=-b)if(y<=b){const T=1/_;m*=T,y*=T,x=m*(m+h*y+2*d)+y*(h*m+y+2*p)+g}else y=u,m=Math.max(0,-(h*y+d)),x=-m*m+y*(y+2*p)+g;else y=-u,m=Math.max(0,-(h*y+d)),x=-m*m+y*(y+2*p)+g;else y<=-b?(m=Math.max(0,-(-h*u+d)),y=m>0?-u:Math.min(Math.max(-u,-p),u),x=-m*m+y*(y+2*p)+g):y<=b?(m=0,y=Math.min(Math.max(-u,-p),u),x=y*(y+2*p)+g):(m=Math.max(0,-(h*u+d)),y=m>0?u:Math.min(Math.max(-u,-p),u),x=-m*m+y*(y+2*p)+g);else y=h>0?-u:u,m=Math.max(0,-(h*y+d)),x=-m*m+y*(y+2*p)+g;return r&&r.copy(this.origin).addScaledVector(this.direction,m),l&&l.copy(Xd).addScaledVector(uu,y),x}intersectSphere(e,i){ba.subVectors(e.center,this.origin);const r=ba.dot(this.direction),l=ba.dot(ba)-r*r,u=e.radius*e.radius;if(l>u)return null;const h=Math.sqrt(u-l),d=r-h,p=r+h;return p<0?null:d<0?this.at(p,i):this.at(d,i)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/i;return r>=0?r:null}intersectPlane(e,i){const r=this.distanceToPlane(e);return r===null?null:this.at(r,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let r,l,u,h,d,p;const g=1/this.direction.x,_=1/this.direction.y,m=1/this.direction.z,y=this.origin;return g>=0?(r=(e.min.x-y.x)*g,l=(e.max.x-y.x)*g):(r=(e.max.x-y.x)*g,l=(e.min.x-y.x)*g),_>=0?(u=(e.min.y-y.y)*_,h=(e.max.y-y.y)*_):(u=(e.max.y-y.y)*_,h=(e.min.y-y.y)*_),r>h||u>l||((u>r||isNaN(r))&&(r=u),(h<l||isNaN(l))&&(l=h),m>=0?(d=(e.min.z-y.z)*m,p=(e.max.z-y.z)*m):(d=(e.max.z-y.z)*m,p=(e.min.z-y.z)*m),r>p||d>l)||((d>r||r!==r)&&(r=d),(p<l||l!==l)&&(l=p),l<0)?null:this.at(r>=0?r:l,i)}intersectsBox(e){return this.intersectBox(e,ba)!==null}intersectTriangle(e,i,r,l,u){Wd.subVectors(i,e),fu.subVectors(r,e),Yd.crossVectors(Wd,fu);let h=this.direction.dot(Yd),d;if(h>0){if(l)return null;d=1}else if(h<0)d=-1,h=-h;else return null;cr.subVectors(this.origin,e);const p=d*this.direction.dot(fu.crossVectors(cr,fu));if(p<0)return null;const g=d*this.direction.dot(Wd.cross(cr));if(g<0||p+g>h)return null;const _=-d*cr.dot(Yd);return _<0?null:this.at(_/h,u)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xe{constructor(e,i,r,l,u,h,d,p,g,_,m,y,x,b,T,M){Xe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,h,d,p,g,_,m,y,x,b,T,M)}set(e,i,r,l,u,h,d,p,g,_,m,y,x,b,T,M){const S=this.elements;return S[0]=e,S[4]=i,S[8]=r,S[12]=l,S[1]=u,S[5]=h,S[9]=d,S[13]=p,S[2]=g,S[6]=_,S[10]=m,S[14]=y,S[3]=x,S[7]=b,S[11]=T,S[15]=M,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xe().fromArray(this.elements)}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(e){const i=this.elements,r=e.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,r){return e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,i,r){return this.set(e.x,i.x,r.x,0,e.y,i.y,r.y,0,e.z,i.z,r.z,0,0,0,0,1),this}extractRotation(e){const i=this.elements,r=e.elements,l=1/$s.setFromMatrixColumn(e,0).length(),u=1/$s.setFromMatrixColumn(e,1).length(),h=1/$s.setFromMatrixColumn(e,2).length();return i[0]=r[0]*l,i[1]=r[1]*l,i[2]=r[2]*l,i[3]=0,i[4]=r[4]*u,i[5]=r[5]*u,i[6]=r[6]*u,i[7]=0,i[8]=r[8]*h,i[9]=r[9]*h,i[10]=r[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,r=e.x,l=e.y,u=e.z,h=Math.cos(r),d=Math.sin(r),p=Math.cos(l),g=Math.sin(l),_=Math.cos(u),m=Math.sin(u);if(e.order==="XYZ"){const y=h*_,x=h*m,b=d*_,T=d*m;i[0]=p*_,i[4]=-p*m,i[8]=g,i[1]=x+b*g,i[5]=y-T*g,i[9]=-d*p,i[2]=T-y*g,i[6]=b+x*g,i[10]=h*p}else if(e.order==="YXZ"){const y=p*_,x=p*m,b=g*_,T=g*m;i[0]=y+T*d,i[4]=b*d-x,i[8]=h*g,i[1]=h*m,i[5]=h*_,i[9]=-d,i[2]=x*d-b,i[6]=T+y*d,i[10]=h*p}else if(e.order==="ZXY"){const y=p*_,x=p*m,b=g*_,T=g*m;i[0]=y-T*d,i[4]=-h*m,i[8]=b+x*d,i[1]=x+b*d,i[5]=h*_,i[9]=T-y*d,i[2]=-h*g,i[6]=d,i[10]=h*p}else if(e.order==="ZYX"){const y=h*_,x=h*m,b=d*_,T=d*m;i[0]=p*_,i[4]=b*g-x,i[8]=y*g+T,i[1]=p*m,i[5]=T*g+y,i[9]=x*g-b,i[2]=-g,i[6]=d*p,i[10]=h*p}else if(e.order==="YZX"){const y=h*p,x=h*g,b=d*p,T=d*g;i[0]=p*_,i[4]=T-y*m,i[8]=b*m+x,i[1]=m,i[5]=h*_,i[9]=-d*_,i[2]=-g*_,i[6]=x*m+b,i[10]=y-T*m}else if(e.order==="XZY"){const y=h*p,x=h*g,b=d*p,T=d*g;i[0]=p*_,i[4]=-m,i[8]=g*_,i[1]=y*m+T,i[5]=h*_,i[9]=x*m-b,i[2]=b*m-x,i[6]=d*_,i[10]=T*m+y}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(RT,e,CT)}lookAt(e,i,r){const l=this.elements;return pi.subVectors(e,i),pi.lengthSq()===0&&(pi.z=1),pi.normalize(),ur.crossVectors(r,pi),ur.lengthSq()===0&&(Math.abs(r.z)===1?pi.x+=1e-4:pi.z+=1e-4,pi.normalize(),ur.crossVectors(r,pi)),ur.normalize(),hu.crossVectors(pi,ur),l[0]=ur.x,l[4]=hu.x,l[8]=pi.x,l[1]=ur.y,l[5]=hu.y,l[9]=pi.y,l[2]=ur.z,l[6]=hu.z,l[10]=pi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,h=r[0],d=r[4],p=r[8],g=r[12],_=r[1],m=r[5],y=r[9],x=r[13],b=r[2],T=r[6],M=r[10],S=r[14],G=r[3],I=r[7],z=r[11],F=r[15],P=l[0],L=l[4],V=l[8],C=l[12],E=l[1],k=l[5],et=l[9],tt=l[13],ut=l[2],ft=l[6],X=l[10],it=l[14],W=l[3],mt=l[7],vt=l[11],At=l[15];return u[0]=h*P+d*E+p*ut+g*W,u[4]=h*L+d*k+p*ft+g*mt,u[8]=h*V+d*et+p*X+g*vt,u[12]=h*C+d*tt+p*it+g*At,u[1]=_*P+m*E+y*ut+x*W,u[5]=_*L+m*k+y*ft+x*mt,u[9]=_*V+m*et+y*X+x*vt,u[13]=_*C+m*tt+y*it+x*At,u[2]=b*P+T*E+M*ut+S*W,u[6]=b*L+T*k+M*ft+S*mt,u[10]=b*V+T*et+M*X+S*vt,u[14]=b*C+T*tt+M*it+S*At,u[3]=G*P+I*E+z*ut+F*W,u[7]=G*L+I*k+z*ft+F*mt,u[11]=G*V+I*et+z*X+F*vt,u[15]=G*C+I*tt+z*it+F*At,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[4],l=e[8],u=e[12],h=e[1],d=e[5],p=e[9],g=e[13],_=e[2],m=e[6],y=e[10],x=e[14],b=e[3],T=e[7],M=e[11],S=e[15];return b*(+u*p*m-l*g*m-u*d*y+r*g*y+l*d*x-r*p*x)+T*(+i*p*x-i*g*y+u*h*y-l*h*x+l*g*_-u*p*_)+M*(+i*g*m-i*d*x-u*h*m+r*h*x+u*d*_-r*g*_)+S*(-l*d*_-i*p*m+i*d*y+l*h*m-r*h*y+r*p*_)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,r){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=r),this}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],h=e[4],d=e[5],p=e[6],g=e[7],_=e[8],m=e[9],y=e[10],x=e[11],b=e[12],T=e[13],M=e[14],S=e[15],G=m*M*g-T*y*g+T*p*x-d*M*x-m*p*S+d*y*S,I=b*y*g-_*M*g-b*p*x+h*M*x+_*p*S-h*y*S,z=_*T*g-b*m*g+b*d*x-h*T*x-_*d*S+h*m*S,F=b*m*p-_*T*p-b*d*y+h*T*y+_*d*M-h*m*M,P=i*G+r*I+l*z+u*F;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/P;return e[0]=G*L,e[1]=(T*y*u-m*M*u-T*l*x+r*M*x+m*l*S-r*y*S)*L,e[2]=(d*M*u-T*p*u+T*l*g-r*M*g-d*l*S+r*p*S)*L,e[3]=(m*p*u-d*y*u-m*l*g+r*y*g+d*l*x-r*p*x)*L,e[4]=I*L,e[5]=(_*M*u-b*y*u+b*l*x-i*M*x-_*l*S+i*y*S)*L,e[6]=(b*p*u-h*M*u-b*l*g+i*M*g+h*l*S-i*p*S)*L,e[7]=(h*y*u-_*p*u+_*l*g-i*y*g-h*l*x+i*p*x)*L,e[8]=z*L,e[9]=(b*m*u-_*T*u-b*r*x+i*T*x+_*r*S-i*m*S)*L,e[10]=(h*T*u-b*d*u+b*r*g-i*T*g-h*r*S+i*d*S)*L,e[11]=(_*d*u-h*m*u-_*r*g+i*m*g+h*r*x-i*d*x)*L,e[12]=F*L,e[13]=(_*T*l-b*m*l+b*r*y-i*T*y-_*r*M+i*m*M)*L,e[14]=(b*d*l-h*T*l-b*r*p+i*T*p+h*r*M-i*d*M)*L,e[15]=(h*m*l-_*d*l+_*r*p-i*m*p-h*r*y+i*d*y)*L,this}scale(e){const i=this.elements,r=e.x,l=e.y,u=e.z;return i[0]*=r,i[4]*=l,i[8]*=u,i[1]*=r,i[5]*=l,i[9]*=u,i[2]*=r,i[6]*=l,i[10]*=u,i[3]*=r,i[7]*=l,i[11]*=u,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,r,l))}makeTranslation(e,i,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const r=Math.cos(i),l=Math.sin(i),u=1-r,h=e.x,d=e.y,p=e.z,g=u*h,_=u*d;return this.set(g*h+r,g*d-l*p,g*p+l*d,0,g*d+l*p,_*d+r,_*p-l*h,0,g*p-l*d,_*p+l*h,u*p*p+r,0,0,0,0,1),this}makeScale(e,i,r){return this.set(e,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,i,r,l,u,h){return this.set(1,r,u,0,e,1,h,0,i,l,1,0,0,0,0,1),this}compose(e,i,r){const l=this.elements,u=i._x,h=i._y,d=i._z,p=i._w,g=u+u,_=h+h,m=d+d,y=u*g,x=u*_,b=u*m,T=h*_,M=h*m,S=d*m,G=p*g,I=p*_,z=p*m,F=r.x,P=r.y,L=r.z;return l[0]=(1-(T+S))*F,l[1]=(x+z)*F,l[2]=(b-I)*F,l[3]=0,l[4]=(x-z)*P,l[5]=(1-(y+S))*P,l[6]=(M+G)*P,l[7]=0,l[8]=(b+I)*L,l[9]=(M-G)*L,l[10]=(1-(y+T))*L,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,r){const l=this.elements;let u=$s.set(l[0],l[1],l[2]).length();const h=$s.set(l[4],l[5],l[6]).length(),d=$s.set(l[8],l[9],l[10]).length();this.determinant()<0&&(u=-u),e.x=l[12],e.y=l[13],e.z=l[14],Ii.copy(this);const g=1/u,_=1/h,m=1/d;return Ii.elements[0]*=g,Ii.elements[1]*=g,Ii.elements[2]*=g,Ii.elements[4]*=_,Ii.elements[5]*=_,Ii.elements[6]*=_,Ii.elements[8]*=m,Ii.elements[9]*=m,Ii.elements[10]*=m,i.setFromRotationMatrix(Ii),r.x=u,r.y=h,r.z=d,this}makePerspective(e,i,r,l,u,h,d=Da){const p=this.elements,g=2*u/(i-e),_=2*u/(r-l),m=(i+e)/(i-e),y=(r+l)/(r-l);let x,b;if(d===Da)x=-(h+u)/(h-u),b=-2*h*u/(h-u);else if(d===Vu)x=-h/(h-u),b=-h*u/(h-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return p[0]=g,p[4]=0,p[8]=m,p[12]=0,p[1]=0,p[5]=_,p[9]=y,p[13]=0,p[2]=0,p[6]=0,p[10]=x,p[14]=b,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(e,i,r,l,u,h,d=Da){const p=this.elements,g=1/(i-e),_=1/(r-l),m=1/(h-u),y=(i+e)*g,x=(r+l)*_;let b,T;if(d===Da)b=(h+u)*m,T=-2*m;else if(d===Vu)b=u*m,T=-1*m;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return p[0]=2*g,p[4]=0,p[8]=0,p[12]=-y,p[1]=0,p[5]=2*_,p[9]=0,p[13]=-x,p[2]=0,p[6]=0,p[10]=T,p[14]=-b,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<16;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<16;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e[i+9]=r[9],e[i+10]=r[10],e[i+11]=r[11],e[i+12]=r[12],e[i+13]=r[13],e[i+14]=r[14],e[i+15]=r[15],e}}const $s=new $,Ii=new Xe,RT=new $(0,0,0),CT=new $(1,1,1),ur=new $,hu=new $,pi=new $,uy=new Xe,fy=new vr;class aa{constructor(e=0,i=0,r=0,l=aa.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=r,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,r,l=this._order){return this._x=e,this._y=i,this._z=r,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,r=!0){const l=e.elements,u=l[0],h=l[4],d=l[8],p=l[1],g=l[5],_=l[9],m=l[2],y=l[6],x=l[10];switch(i){case"XYZ":this._y=Math.asin(be(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-_,x),this._z=Math.atan2(-h,u)):(this._x=Math.atan2(y,g),this._z=0);break;case"YXZ":this._x=Math.asin(-be(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(d,x),this._z=Math.atan2(p,g)):(this._y=Math.atan2(-m,u),this._z=0);break;case"ZXY":this._x=Math.asin(be(y,-1,1)),Math.abs(y)<.9999999?(this._y=Math.atan2(-m,x),this._z=Math.atan2(-h,g)):(this._y=0,this._z=Math.atan2(p,u));break;case"ZYX":this._y=Math.asin(-be(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(y,x),this._z=Math.atan2(p,u)):(this._x=0,this._z=Math.atan2(-h,g));break;case"YZX":this._z=Math.asin(be(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-_,g),this._y=Math.atan2(-m,u)):(this._x=0,this._y=Math.atan2(d,x));break;case"XZY":this._z=Math.asin(-be(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(y,g),this._y=Math.atan2(d,u)):(this._x=Math.atan2(-_,x),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,r){return uy.makeRotationFromQuaternion(e),this.setFromRotationMatrix(uy,i,r)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return fy.setFromEuler(this),this.setFromQuaternion(fy,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}aa.DEFAULT_ORDER="XYZ";class zx{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let DT=0;const hy=new $,to=new vr,Ta=new Xe,du=new $,xl=new $,NT=new $,zT=new vr,dy=new $(1,0,0),py=new $(0,1,0),my=new $(0,0,1),gy={type:"added"},UT={type:"removed"},eo={type:"childadded",child:null},qd={type:"childremoved",child:null};class Pn extends ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:DT++}),this.uuid=Ol(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Pn.DEFAULT_UP.clone();const e=new $,i=new aa,r=new vr,l=new $(1,1,1);function u(){r.setFromEuler(i,!1)}function h(){i.setFromQuaternion(r,void 0,!1)}i._onChange(u),r._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new Xe},normalMatrix:{value:new ge}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=Pn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Pn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zx,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return to.setFromAxisAngle(e,i),this.quaternion.multiply(to),this}rotateOnWorldAxis(e,i){return to.setFromAxisAngle(e,i),this.quaternion.premultiply(to),this}rotateX(e){return this.rotateOnAxis(dy,e)}rotateY(e){return this.rotateOnAxis(py,e)}rotateZ(e){return this.rotateOnAxis(my,e)}translateOnAxis(e,i){return hy.copy(e).applyQuaternion(this.quaternion),this.position.add(hy.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(dy,e)}translateY(e){return this.translateOnAxis(py,e)}translateZ(e){return this.translateOnAxis(my,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ta.copy(this.matrixWorld).invert())}lookAt(e,i,r){e.isVector3?du.copy(e):du.set(e,i,r);const l=this.parent;this.updateWorldMatrix(!0,!1),xl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ta.lookAt(xl,du,this.up):Ta.lookAt(du,xl,this.up),this.quaternion.setFromRotationMatrix(Ta),l&&(Ta.extractRotation(l.matrixWorld),to.setFromRotationMatrix(Ta),this.quaternion.premultiply(to.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(gy),eo.child=e,this.dispatchEvent(eo),eo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(UT),qd.child=e,this.dispatchEvent(qd),qd.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ta.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ta.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ta),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(gy),eo.child=e,this.dispatchEvent(eo),eo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let r=0,l=this.children.length;r<l;r++){const h=this.children[r].getObjectByProperty(e,i);if(h!==void 0)return h}}getObjectsByProperty(e,i,r=[]){this[e]===i&&r.push(this);const l=this.children;for(let u=0,h=l.length;u<h;u++)l[u].getObjectsByProperty(e,i,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xl,e,NT),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xl,zT,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].updateMatrixWorld(e)}updateWorldMatrix(e,i){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let u=0,h=l.length;u<h;u++)l[u].updateWorldMatrix(!1,!0)}}toJSON(e){const i=e===void 0||typeof e=="string",r={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.visibility=this._visibility,l.active=this._active,l.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.geometryCount=this._geometryCount,l.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(l.boundingSphere={center:l.boundingSphere.center.toArray(),radius:l.boundingSphere.radius}),this.boundingBox!==null&&(l.boundingBox={min:l.boundingBox.min.toArray(),max:l.boundingBox.max.toArray()}));function u(d,p){return d[p.uuid]===void 0&&(d[p.uuid]=p.toJSON(e)),p.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=u(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const p=d.shapes;if(Array.isArray(p))for(let g=0,_=p.length;g<_;g++){const m=p[g];u(e.shapes,m)}else u(e.shapes,p)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let p=0,g=this.material.length;p<g;p++)d.push(u(e.materials,this.material[p]));l.material=d}else l.material=u(e.materials,this.material);if(this.children.length>0){l.children=[];for(let d=0;d<this.children.length;d++)l.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let d=0;d<this.animations.length;d++){const p=this.animations[d];l.animations.push(u(e.animations,p))}}if(i){const d=h(e.geometries),p=h(e.materials),g=h(e.textures),_=h(e.images),m=h(e.shapes),y=h(e.skeletons),x=h(e.animations),b=h(e.nodes);d.length>0&&(r.geometries=d),p.length>0&&(r.materials=p),g.length>0&&(r.textures=g),_.length>0&&(r.images=_),m.length>0&&(r.shapes=m),y.length>0&&(r.skeletons=y),x.length>0&&(r.animations=x),b.length>0&&(r.nodes=b)}return r.object=l,r;function h(d){const p=[];for(const g in d){const _=d[g];delete _.metadata,p.push(_)}return p}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let r=0;r<e.children.length;r++){const l=e.children[r];this.add(l.clone())}return this}}Pn.DEFAULT_UP=new $(0,1,0);Pn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Bi=new $,wa=new $,Zd=new $,Aa=new $,no=new $,io=new $,_y=new $,Kd=new $,Qd=new $,Jd=new $,$d=new on,tp=new on,ep=new on;class Fi{constructor(e=new $,i=new $,r=new $){this.a=e,this.b=i,this.c=r}static getNormal(e,i,r,l){l.subVectors(r,i),Bi.subVectors(e,i),l.cross(Bi);const u=l.lengthSq();return u>0?l.multiplyScalar(1/Math.sqrt(u)):l.set(0,0,0)}static getBarycoord(e,i,r,l,u){Bi.subVectors(l,i),wa.subVectors(r,i),Zd.subVectors(e,i);const h=Bi.dot(Bi),d=Bi.dot(wa),p=Bi.dot(Zd),g=wa.dot(wa),_=wa.dot(Zd),m=h*g-d*d;if(m===0)return u.set(0,0,0),null;const y=1/m,x=(g*p-d*_)*y,b=(h*_-d*p)*y;return u.set(1-x-b,b,x)}static containsPoint(e,i,r,l){return this.getBarycoord(e,i,r,l,Aa)===null?!1:Aa.x>=0&&Aa.y>=0&&Aa.x+Aa.y<=1}static getInterpolation(e,i,r,l,u,h,d,p){return this.getBarycoord(e,i,r,l,Aa)===null?(p.x=0,p.y=0,"z"in p&&(p.z=0),"w"in p&&(p.w=0),null):(p.setScalar(0),p.addScaledVector(u,Aa.x),p.addScaledVector(h,Aa.y),p.addScaledVector(d,Aa.z),p)}static getInterpolatedAttribute(e,i,r,l,u,h){return $d.setScalar(0),tp.setScalar(0),ep.setScalar(0),$d.fromBufferAttribute(e,i),tp.fromBufferAttribute(e,r),ep.fromBufferAttribute(e,l),h.setScalar(0),h.addScaledVector($d,u.x),h.addScaledVector(tp,u.y),h.addScaledVector(ep,u.z),h}static isFrontFacing(e,i,r,l){return Bi.subVectors(r,i),wa.subVectors(e,i),Bi.cross(wa).dot(l)<0}set(e,i,r){return this.a.copy(e),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(e,i,r,l){return this.a.copy(e[i]),this.b.copy(e[r]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,r,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Bi.subVectors(this.c,this.b),wa.subVectors(this.a,this.b),Bi.cross(wa).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Fi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return Fi.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,r,l,u){return Fi.getInterpolation(e,this.a,this.b,this.c,i,r,l,u)}containsPoint(e){return Fi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Fi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const r=this.a,l=this.b,u=this.c;let h,d;no.subVectors(l,r),io.subVectors(u,r),Kd.subVectors(e,r);const p=no.dot(Kd),g=io.dot(Kd);if(p<=0&&g<=0)return i.copy(r);Qd.subVectors(e,l);const _=no.dot(Qd),m=io.dot(Qd);if(_>=0&&m<=_)return i.copy(l);const y=p*m-_*g;if(y<=0&&p>=0&&_<=0)return h=p/(p-_),i.copy(r).addScaledVector(no,h);Jd.subVectors(e,u);const x=no.dot(Jd),b=io.dot(Jd);if(b>=0&&x<=b)return i.copy(u);const T=x*g-p*b;if(T<=0&&g>=0&&b<=0)return d=g/(g-b),i.copy(r).addScaledVector(io,d);const M=_*b-x*m;if(M<=0&&m-_>=0&&x-b>=0)return _y.subVectors(u,l),d=(m-_)/(m-_+(x-b)),i.copy(l).addScaledVector(_y,d);const S=1/(M+T+y);return h=T*S,d=y*S,i.copy(r).addScaledVector(no,h).addScaledVector(io,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ux={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fr={h:0,s:0,l:0},pu={h:0,s:0,l:0};function np(o,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?o+(e-o)*6*i:i<1/2?e:i<2/3?o+(e-o)*6*(2/3-i):o}class Te{constructor(e,i,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,r)}set(e,i,r){if(i===void 0&&r===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=Ai){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Pe.toWorkingColorSpace(this,i),this}setRGB(e,i,r,l=Pe.workingColorSpace){return this.r=e,this.g=i,this.b=r,Pe.toWorkingColorSpace(this,l),this}setHSL(e,i,r,l=Pe.workingColorSpace){if(e=mT(e,1),i=be(i,0,1),r=be(r,0,1),i===0)this.r=this.g=this.b=r;else{const u=r<=.5?r*(1+i):r+i-r*i,h=2*r-u;this.r=np(h,u,e+1/3),this.g=np(h,u,e),this.b=np(h,u,e-1/3)}return Pe.toWorkingColorSpace(this,l),this}setStyle(e,i=Ai){function r(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let u;const h=l[1],d=l[2];switch(h){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,i);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,i);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const u=l[1],h=u.length;if(h===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(u,16),i);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=Ai){const r=Ux[e.toLowerCase()];return r!==void 0?this.setHex(r,i):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Na(e.r),this.g=Na(e.g),this.b=Na(e.b),this}copyLinearToSRGB(e){return this.r=mo(e.r),this.g=mo(e.g),this.b=mo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ai){return Pe.fromWorkingColorSpace(Vn.copy(this),e),Math.round(be(Vn.r*255,0,255))*65536+Math.round(be(Vn.g*255,0,255))*256+Math.round(be(Vn.b*255,0,255))}getHexString(e=Ai){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Pe.workingColorSpace){Pe.fromWorkingColorSpace(Vn.copy(this),i);const r=Vn.r,l=Vn.g,u=Vn.b,h=Math.max(r,l,u),d=Math.min(r,l,u);let p,g;const _=(d+h)/2;if(d===h)p=0,g=0;else{const m=h-d;switch(g=_<=.5?m/(h+d):m/(2-h-d),h){case r:p=(l-u)/m+(l<u?6:0);break;case l:p=(u-r)/m+2;break;case u:p=(r-l)/m+4;break}p/=6}return e.h=p,e.s=g,e.l=_,e}getRGB(e,i=Pe.workingColorSpace){return Pe.fromWorkingColorSpace(Vn.copy(this),i),e.r=Vn.r,e.g=Vn.g,e.b=Vn.b,e}getStyle(e=Ai){Pe.fromWorkingColorSpace(Vn.copy(this),e);const i=Vn.r,r=Vn.g,l=Vn.b;return e!==Ai?`color(${e} ${i.toFixed(3)} ${r.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(r*255)},${Math.round(l*255)})`}offsetHSL(e,i,r){return this.getHSL(fr),this.setHSL(fr.h+e,fr.s+i,fr.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,r){return this.r=e.r+(i.r-e.r)*r,this.g=e.g+(i.g-e.g)*r,this.b=e.b+(i.b-e.b)*r,this}lerpHSL(e,i){this.getHSL(fr),e.getHSL(pu);const r=Fd(fr.h,pu.h,i),l=Fd(fr.s,pu.s,i),u=Fd(fr.l,pu.l,i);return this.setHSL(r,l,u),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,r=this.g,l=this.b,u=e.elements;return this.r=u[0]*i+u[3]*r+u[6]*l,this.g=u[1]*i+u[4]*r+u[7]*l,this.b=u[2]*i+u[5]*r+u[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vn=new Te;Te.NAMES=Ux;let LT=0;class So extends ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:LT++}),this.uuid=Ol(),this.name="",this.type="Material",this.blending=po,this.side=_r,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=xp,this.blendDst=Sp,this.blendEquation=$r,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Te(0,0,0),this.blendAlpha=0,this.depthFunc=go,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=iy,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qs,this.stencilZFail=qs,this.stencilZPass=qs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const r=e[i];if(r===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(r):l&&l.isVector3&&r&&r.isVector3?l.copy(r):this[i]=r}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==po&&(r.blending=this.blending),this.side!==_r&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==xp&&(r.blendSrc=this.blendSrc),this.blendDst!==Sp&&(r.blendDst=this.blendDst),this.blendEquation!==$r&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==go&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==iy&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qs&&(r.stencilFail=this.stencilFail),this.stencilZFail!==qs&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==qs&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function l(u){const h=[];for(const d in u){const p=u[d];delete p.metadata,h.push(p)}return h}if(i){const u=l(e.textures),h=l(e.images);u.length>0&&(r.textures=u),h.length>0&&(r.images=h)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let r=null;if(i!==null){const l=i.length;r=new Array(l);for(let u=0;u!==l;++u)r[u]=i[u].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Lx extends So{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new aa,this.combine=_x,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const pn=new $,mu=new me;let OT=0;class Hi{constructor(e,i,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:OT++}),this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=r,this.usage=ay,this.updateRanges=[],this.gpuType=na,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,r){e*=this.itemSize,r*=i.itemSize;for(let l=0,u=this.itemSize;l<u;l++)this.array[e+l]=i.array[r+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,r=this.count;i<r;i++)mu.fromBufferAttribute(this,i),mu.applyMatrix3(e),this.setXY(i,mu.x,mu.y);else if(this.itemSize===3)for(let i=0,r=this.count;i<r;i++)pn.fromBufferAttribute(this,i),pn.applyMatrix3(e),this.setXYZ(i,pn.x,pn.y,pn.z);return this}applyMatrix4(e){for(let i=0,r=this.count;i<r;i++)pn.fromBufferAttribute(this,i),pn.applyMatrix4(e),this.setXYZ(i,pn.x,pn.y,pn.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)pn.fromBufferAttribute(this,i),pn.applyNormalMatrix(e),this.setXYZ(i,pn.x,pn.y,pn.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)pn.fromBufferAttribute(this,i),pn.transformDirection(e),this.setXYZ(i,pn.x,pn.y,pn.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let r=this.array[e*this.itemSize+i];return this.normalized&&(r=_l(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=ni(r,this.array)),this.array[e*this.itemSize+i]=r,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=_l(i,this.array)),i}setX(e,i){return this.normalized&&(i=ni(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=_l(i,this.array)),i}setY(e,i){return this.normalized&&(i=ni(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=_l(i,this.array)),i}setZ(e,i){return this.normalized&&(i=ni(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=_l(i,this.array)),i}setW(e,i){return this.normalized&&(i=ni(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,r){return e*=this.itemSize,this.normalized&&(i=ni(i,this.array),r=ni(r,this.array)),this.array[e+0]=i,this.array[e+1]=r,this}setXYZ(e,i,r,l){return e*=this.itemSize,this.normalized&&(i=ni(i,this.array),r=ni(r,this.array),l=ni(l,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this}setXYZW(e,i,r,l,u){return e*=this.itemSize,this.normalized&&(i=ni(i,this.array),r=ni(r,this.array),l=ni(l,this.array),u=ni(u,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this.array[e+3]=u,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ay&&(e.usage=this.usage),e}}class Ox extends Hi{constructor(e,i,r){super(new Uint16Array(e),i,r)}}class Px extends Hi{constructor(e,i,r){super(new Uint32Array(e),i,r)}}class In extends Hi{constructor(e,i,r){super(new Float32Array(e),i,r)}}let PT=0;const wi=new Xe,ip=new Pn,ao=new $,mi=new xr,Sl=new xr,An=new $;class Ci extends ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:PT++}),this.uuid=Ol(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Dx(e)?Px:Ox)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,r=0){this.groups.push({start:e,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const u=new ge().getNormalMatrix(e);r.applyNormalMatrix(u),r.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return wi.makeRotationFromQuaternion(e),this.applyMatrix4(wi),this}rotateX(e){return wi.makeRotationX(e),this.applyMatrix4(wi),this}rotateY(e){return wi.makeRotationY(e),this.applyMatrix4(wi),this}rotateZ(e){return wi.makeRotationZ(e),this.applyMatrix4(wi),this}translate(e,i,r){return wi.makeTranslation(e,i,r),this.applyMatrix4(wi),this}scale(e,i,r){return wi.makeScale(e,i,r),this.applyMatrix4(wi),this}lookAt(e){return ip.lookAt(e),ip.updateMatrix(),this.applyMatrix4(ip.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ao).negate(),this.translate(ao.x,ao.y,ao.z),this}setFromPoints(e){const i=this.getAttribute("position");if(i===void 0){const r=[];for(let l=0,u=e.length;l<u;l++){const h=e[l];r.push(h.x,h.y,h.z||0)}this.setAttribute("position",new In(r,3))}else{const r=Math.min(e.length,i.count);for(let l=0;l<r;l++){const u=e[l];i.setXYZ(l,u.x,u.y,u.z||0)}e.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xr);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new $(-1/0,-1/0,-1/0),new $(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let r=0,l=i.length;r<l;r++){const u=i[r];mi.setFromBufferAttribute(u),this.morphTargetsRelative?(An.addVectors(this.boundingBox.min,mi.min),this.boundingBox.expandByPoint(An),An.addVectors(this.boundingBox.max,mi.max),this.boundingBox.expandByPoint(An)):(this.boundingBox.expandByPoint(mi.min),this.boundingBox.expandByPoint(mi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new os);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new $,1/0);return}if(e){const r=this.boundingSphere.center;if(mi.setFromBufferAttribute(e),i)for(let u=0,h=i.length;u<h;u++){const d=i[u];Sl.setFromBufferAttribute(d),this.morphTargetsRelative?(An.addVectors(mi.min,Sl.min),mi.expandByPoint(An),An.addVectors(mi.max,Sl.max),mi.expandByPoint(An)):(mi.expandByPoint(Sl.min),mi.expandByPoint(Sl.max))}mi.getCenter(r);let l=0;for(let u=0,h=e.count;u<h;u++)An.fromBufferAttribute(e,u),l=Math.max(l,r.distanceToSquared(An));if(i)for(let u=0,h=i.length;u<h;u++){const d=i[u],p=this.morphTargetsRelative;for(let g=0,_=d.count;g<_;g++)An.fromBufferAttribute(d,g),p&&(ao.fromBufferAttribute(e,g),An.add(ao)),l=Math.max(l,r.distanceToSquared(An))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=i.position,l=i.normal,u=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Hi(new Float32Array(4*r.count),4));const h=this.getAttribute("tangent"),d=[],p=[];for(let V=0;V<r.count;V++)d[V]=new $,p[V]=new $;const g=new $,_=new $,m=new $,y=new me,x=new me,b=new me,T=new $,M=new $;function S(V,C,E){g.fromBufferAttribute(r,V),_.fromBufferAttribute(r,C),m.fromBufferAttribute(r,E),y.fromBufferAttribute(u,V),x.fromBufferAttribute(u,C),b.fromBufferAttribute(u,E),_.sub(g),m.sub(g),x.sub(y),b.sub(y);const k=1/(x.x*b.y-b.x*x.y);isFinite(k)&&(T.copy(_).multiplyScalar(b.y).addScaledVector(m,-x.y).multiplyScalar(k),M.copy(m).multiplyScalar(x.x).addScaledVector(_,-b.x).multiplyScalar(k),d[V].add(T),d[C].add(T),d[E].add(T),p[V].add(M),p[C].add(M),p[E].add(M))}let G=this.groups;G.length===0&&(G=[{start:0,count:e.count}]);for(let V=0,C=G.length;V<C;++V){const E=G[V],k=E.start,et=E.count;for(let tt=k,ut=k+et;tt<ut;tt+=3)S(e.getX(tt+0),e.getX(tt+1),e.getX(tt+2))}const I=new $,z=new $,F=new $,P=new $;function L(V){F.fromBufferAttribute(l,V),P.copy(F);const C=d[V];I.copy(C),I.sub(F.multiplyScalar(F.dot(C))).normalize(),z.crossVectors(P,C);const k=z.dot(p[V])<0?-1:1;h.setXYZW(V,I.x,I.y,I.z,k)}for(let V=0,C=G.length;V<C;++V){const E=G[V],k=E.start,et=E.count;for(let tt=k,ut=k+et;tt<ut;tt+=3)L(e.getX(tt+0)),L(e.getX(tt+1)),L(e.getX(tt+2))}}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new Hi(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let y=0,x=r.count;y<x;y++)r.setXYZ(y,0,0,0);const l=new $,u=new $,h=new $,d=new $,p=new $,g=new $,_=new $,m=new $;if(e)for(let y=0,x=e.count;y<x;y+=3){const b=e.getX(y+0),T=e.getX(y+1),M=e.getX(y+2);l.fromBufferAttribute(i,b),u.fromBufferAttribute(i,T),h.fromBufferAttribute(i,M),_.subVectors(h,u),m.subVectors(l,u),_.cross(m),d.fromBufferAttribute(r,b),p.fromBufferAttribute(r,T),g.fromBufferAttribute(r,M),d.add(_),p.add(_),g.add(_),r.setXYZ(b,d.x,d.y,d.z),r.setXYZ(T,p.x,p.y,p.z),r.setXYZ(M,g.x,g.y,g.z)}else for(let y=0,x=i.count;y<x;y+=3)l.fromBufferAttribute(i,y+0),u.fromBufferAttribute(i,y+1),h.fromBufferAttribute(i,y+2),_.subVectors(h,u),m.subVectors(l,u),_.cross(m),r.setXYZ(y+0,_.x,_.y,_.z),r.setXYZ(y+1,_.x,_.y,_.z),r.setXYZ(y+2,_.x,_.y,_.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,r=e.count;i<r;i++)An.fromBufferAttribute(e,i),An.normalize(),e.setXYZ(i,An.x,An.y,An.z)}toNonIndexed(){function e(d,p){const g=d.array,_=d.itemSize,m=d.normalized,y=new g.constructor(p.length*_);let x=0,b=0;for(let T=0,M=p.length;T<M;T++){d.isInterleavedBufferAttribute?x=p[T]*d.data.stride+d.offset:x=p[T]*_;for(let S=0;S<_;S++)y[b++]=g[x++]}return new Hi(y,_,m)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new Ci,r=this.index.array,l=this.attributes;for(const d in l){const p=l[d],g=e(p,r);i.setAttribute(d,g)}const u=this.morphAttributes;for(const d in u){const p=[],g=u[d];for(let _=0,m=g.length;_<m;_++){const y=g[_],x=e(y,r);p.push(x)}i.morphAttributes[d]=p}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let d=0,p=h.length;d<p;d++){const g=h[d];i.addGroup(g.start,g.count,g.materialIndex)}return i}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const p=this.parameters;for(const g in p)p[g]!==void 0&&(e[g]=p[g]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const r=this.attributes;for(const p in r){const g=r[p];e.data.attributes[p]=g.toJSON(e.data)}const l={};let u=!1;for(const p in this.morphAttributes){const g=this.morphAttributes[p],_=[];for(let m=0,y=g.length;m<y;m++){const x=g[m];_.push(x.toJSON(e.data))}_.length>0&&(l[p]=_,u=!0)}u&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(e.data.groups=JSON.parse(JSON.stringify(h)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone());const l=e.attributes;for(const g in l){const _=l[g];this.setAttribute(g,_.clone(i))}const u=e.morphAttributes;for(const g in u){const _=[],m=u[g];for(let y=0,x=m.length;y<x;y++)_.push(m[y].clone(i));this.morphAttributes[g]=_}this.morphTargetsRelative=e.morphTargetsRelative;const h=e.groups;for(let g=0,_=h.length;g<_;g++){const m=h[g];this.addGroup(m.start,m.count,m.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const p=e.boundingSphere;return p!==null&&(this.boundingSphere=p.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const vy=new Xe,Wr=new xm,gu=new os,yy=new $,_u=new $,vu=new $,yu=new $,ap=new $,xu=new $,xy=new $,Su=new $;class ai extends Pn{constructor(e=new Ci,i=new Lx){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,h=l.length;u<h;u++){const d=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=u}}}}getVertexPosition(e,i){const r=this.geometry,l=r.attributes.position,u=r.morphAttributes.position,h=r.morphTargetsRelative;i.fromBufferAttribute(l,e);const d=this.morphTargetInfluences;if(u&&d){xu.set(0,0,0);for(let p=0,g=u.length;p<g;p++){const _=d[p],m=u[p];_!==0&&(ap.fromBufferAttribute(m,e),h?xu.addScaledVector(ap,_):xu.addScaledVector(ap.sub(i),_))}i.add(xu)}return i}raycast(e,i){const r=this.geometry,l=this.material,u=this.matrixWorld;l!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),gu.copy(r.boundingSphere),gu.applyMatrix4(u),Wr.copy(e.ray).recast(e.near),!(gu.containsPoint(Wr.origin)===!1&&(Wr.intersectSphere(gu,yy)===null||Wr.origin.distanceToSquared(yy)>(e.far-e.near)**2))&&(vy.copy(u).invert(),Wr.copy(e.ray).applyMatrix4(vy),!(r.boundingBox!==null&&Wr.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,i,Wr)))}_computeIntersections(e,i,r){let l;const u=this.geometry,h=this.material,d=u.index,p=u.attributes.position,g=u.attributes.uv,_=u.attributes.uv1,m=u.attributes.normal,y=u.groups,x=u.drawRange;if(d!==null)if(Array.isArray(h))for(let b=0,T=y.length;b<T;b++){const M=y[b],S=h[M.materialIndex],G=Math.max(M.start,x.start),I=Math.min(d.count,Math.min(M.start+M.count,x.start+x.count));for(let z=G,F=I;z<F;z+=3){const P=d.getX(z),L=d.getX(z+1),V=d.getX(z+2);l=Mu(this,S,e,r,g,_,m,P,L,V),l&&(l.faceIndex=Math.floor(z/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const b=Math.max(0,x.start),T=Math.min(d.count,x.start+x.count);for(let M=b,S=T;M<S;M+=3){const G=d.getX(M),I=d.getX(M+1),z=d.getX(M+2);l=Mu(this,h,e,r,g,_,m,G,I,z),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}else if(p!==void 0)if(Array.isArray(h))for(let b=0,T=y.length;b<T;b++){const M=y[b],S=h[M.materialIndex],G=Math.max(M.start,x.start),I=Math.min(p.count,Math.min(M.start+M.count,x.start+x.count));for(let z=G,F=I;z<F;z+=3){const P=z,L=z+1,V=z+2;l=Mu(this,S,e,r,g,_,m,P,L,V),l&&(l.faceIndex=Math.floor(z/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const b=Math.max(0,x.start),T=Math.min(p.count,x.start+x.count);for(let M=b,S=T;M<S;M+=3){const G=M,I=M+1,z=M+2;l=Mu(this,h,e,r,g,_,m,G,I,z),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}}}function IT(o,e,i,r,l,u,h,d){let p;if(e.side===ri?p=r.intersectTriangle(h,u,l,!0,d):p=r.intersectTriangle(l,u,h,e.side===_r,d),p===null)return null;Su.copy(d),Su.applyMatrix4(o.matrixWorld);const g=i.ray.origin.distanceTo(Su);return g<i.near||g>i.far?null:{distance:g,point:Su.clone(),object:o}}function Mu(o,e,i,r,l,u,h,d,p,g){o.getVertexPosition(d,_u),o.getVertexPosition(p,vu),o.getVertexPosition(g,yu);const _=IT(o,e,i,r,_u,vu,yu,xy);if(_){const m=new $;Fi.getBarycoord(xy,_u,vu,yu,m),l&&(_.uv=Fi.getInterpolatedAttribute(l,d,p,g,m,new me)),u&&(_.uv1=Fi.getInterpolatedAttribute(u,d,p,g,m,new me)),h&&(_.normal=Fi.getInterpolatedAttribute(h,d,p,g,m,new $),_.normal.dot(r.direction)>0&&_.normal.multiplyScalar(-1));const y={a:d,b:p,c:g,normal:new $,materialIndex:0};Fi.getNormal(_u,vu,yu,y.normal),_.face=y,_.barycoord=m}return _}class rs extends Ci{constructor(e=1,i=1,r=1,l=1,u=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:r,widthSegments:l,heightSegments:u,depthSegments:h};const d=this;l=Math.floor(l),u=Math.floor(u),h=Math.floor(h);const p=[],g=[],_=[],m=[];let y=0,x=0;b("z","y","x",-1,-1,r,i,e,h,u,0),b("z","y","x",1,-1,r,i,-e,h,u,1),b("x","z","y",1,1,e,r,i,l,h,2),b("x","z","y",1,-1,e,r,-i,l,h,3),b("x","y","z",1,-1,e,i,r,l,u,4),b("x","y","z",-1,-1,e,i,-r,l,u,5),this.setIndex(p),this.setAttribute("position",new In(g,3)),this.setAttribute("normal",new In(_,3)),this.setAttribute("uv",new In(m,2));function b(T,M,S,G,I,z,F,P,L,V,C){const E=z/L,k=F/V,et=z/2,tt=F/2,ut=P/2,ft=L+1,X=V+1;let it=0,W=0;const mt=new $;for(let vt=0;vt<X;vt++){const At=vt*k-tt;for(let Xt=0;Xt<ft;Xt++){const he=Xt*E-et;mt[T]=he*G,mt[M]=At*I,mt[S]=ut,g.push(mt.x,mt.y,mt.z),mt[T]=0,mt[M]=0,mt[S]=P>0?1:-1,_.push(mt.x,mt.y,mt.z),m.push(Xt/L),m.push(1-vt/V),it+=1}}for(let vt=0;vt<V;vt++)for(let At=0;At<L;At++){const Xt=y+At+ft*vt,he=y+At+ft*(vt+1),R=y+(At+1)+ft*(vt+1),Y=y+(At+1)+ft*vt;p.push(Xt,he,Y),p.push(he,R,Y),W+=6}d.addGroup(x,W,C),x+=W,y+=it}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function xo(o){const e={};for(const i in o){e[i]={};for(const r in o[i]){const l=o[i][r];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][r]=null):e[i][r]=l.clone():Array.isArray(l)?e[i][r]=l.slice():e[i][r]=l}}return e}function qn(o){const e={};for(let i=0;i<o.length;i++){const r=xo(o[i]);for(const l in r)e[l]=r[l]}return e}function BT(o){const e=[];for(let i=0;i<o.length;i++)e.push(o[i].clone());return e}function Ix(o){const e=o.getRenderTarget();return e===null?o.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Pe.workingColorSpace}const FT={clone:xo,merge:qn};var kT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,HT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class yr extends So{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=kT,this.fragmentShader=HT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=xo(e.uniforms),this.uniformsGroups=BT(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(e).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const r={};for(const l in this.extensions)this.extensions[l]===!0&&(r[l]=!0);return Object.keys(r).length>0&&(i.extensions=r),i}}class Bx extends Pn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=Da}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const hr=new $,Sy=new me,My=new me;class Ri extends Bx{constructor(e=50,i=1,r=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=rm*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Iu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return rm*2*Math.atan(Math.tan(Iu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,r){hr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(hr.x,hr.y).multiplyScalar(-e/hr.z),hr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(hr.x,hr.y).multiplyScalar(-e/hr.z)}getViewSize(e,i){return this.getViewBounds(e,Sy,My),i.subVectors(My,Sy)}setViewOffset(e,i,r,l,u,h){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(Iu*.5*this.fov)/this.zoom,r=2*i,l=this.aspect*r,u=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const p=h.fullWidth,g=h.fullHeight;u+=h.offsetX*l/p,i-=h.offsetY*r/g,l*=h.width/p,r*=h.height/g}const d=this.filmOffset;d!==0&&(u+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+l,i,i-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const ro=-90,so=1;class GT extends Pn{constructor(e,i,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Ri(ro,so,e,i);l.layers=this.layers,this.add(l);const u=new Ri(ro,so,e,i);u.layers=this.layers,this.add(u);const h=new Ri(ro,so,e,i);h.layers=this.layers,this.add(h);const d=new Ri(ro,so,e,i);d.layers=this.layers,this.add(d);const p=new Ri(ro,so,e,i);p.layers=this.layers,this.add(p);const g=new Ri(ro,so,e,i);g.layers=this.layers,this.add(g)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[r,l,u,h,d,p]=i;for(const g of i)this.remove(g);if(e===Da)r.up.set(0,1,0),r.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),p.up.set(0,1,0),p.lookAt(0,0,-1);else if(e===Vu)r.up.set(0,-1,0),r.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),p.up.set(0,-1,0),p.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const g of i)this.add(g),g.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[u,h,d,p,g,_]=this.children,m=e.getRenderTarget(),y=e.getActiveCubeFace(),x=e.getActiveMipmapLevel(),b=e.xr.enabled;e.xr.enabled=!1;const T=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,l),e.render(i,u),e.setRenderTarget(r,1,l),e.render(i,h),e.setRenderTarget(r,2,l),e.render(i,d),e.setRenderTarget(r,3,l),e.render(i,p),e.setRenderTarget(r,4,l),e.render(i,g),r.texture.generateMipmaps=T,e.setRenderTarget(r,5,l),e.render(i,_),e.setRenderTarget(m,y,x),e.xr.enabled=b,r.texture.needsPMREMUpdate=!0}}class Fx extends Zn{constructor(e=[],i=_o,r,l,u,h,d,p,g,_){super(e,i,r,l,u,h,d,p,g,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class VT extends as{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},l=[r,r,r,r,r,r];this.texture=new Fx(l,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:ea}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new rs(5,5,5),u=new yr({name:"CubemapFromEquirect",uniforms:xo(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:ri,blending:mr});u.uniforms.tEquirect.value=i;const h=new ai(l,u),d=i.minFilter;return i.minFilter===ns&&(i.minFilter=ea),new GT(1,10,this).update(e,h),i.minFilter=d,h.geometry.dispose(),h.material.dispose(),this}clear(e,i=!0,r=!0,l=!0){const u=e.getRenderTarget();for(let h=0;h<6;h++)e.setRenderTarget(this,h),e.clear(i,r,l);e.setRenderTarget(u)}}class uo extends Pn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const jT={type:"move"};class rp{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new uo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new uo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new $,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new $),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new uo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new $,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new $),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const r of e.hand.values())this._getHandJoint(i,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,r){let l=null,u=null,h=null;const d=this._targetRay,p=this._grip,g=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(g&&e.hand){h=!0;for(const T of e.hand.values()){const M=i.getJointPose(T,r),S=this._getHandJoint(g,T);M!==null&&(S.matrix.fromArray(M.transform.matrix),S.matrix.decompose(S.position,S.rotation,S.scale),S.matrixWorldNeedsUpdate=!0,S.jointRadius=M.radius),S.visible=M!==null}const _=g.joints["index-finger-tip"],m=g.joints["thumb-tip"],y=_.position.distanceTo(m.position),x=.02,b=.005;g.inputState.pinching&&y>x+b?(g.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!g.inputState.pinching&&y<=x-b&&(g.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else p!==null&&e.gripSpace&&(u=i.getPose(e.gripSpace,r),u!==null&&(p.matrix.fromArray(u.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,u.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(u.linearVelocity)):p.hasLinearVelocity=!1,u.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(u.angularVelocity)):p.hasAngularVelocity=!1));d!==null&&(l=i.getPose(e.targetRaySpace,r),l===null&&u!==null&&(l=u),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(jT)))}return d!==null&&(d.visible=l!==null),p!==null&&(p.visible=u!==null),g!==null&&(g.visible=h!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const r=new uo;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[i.jointName]=r,e.add(r)}return e.joints[i.jointName]}}class XT extends Pn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new aa,this.environmentIntensity=1,this.environmentRotation=new aa,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}class WT extends Zn{constructor(e=null,i=1,r=1,l,u,h,d,p,g=gi,_=gi,m,y){super(null,h,d,p,g,_,l,u,m,y),this.isDataTexture=!0,this.image={data:e,width:i,height:r},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ey extends Hi{constructor(e,i,r,l=1){super(e,i,r),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=l}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const oo=new Xe,by=new Xe,Eu=[],Ty=new xr,YT=new Xe,Ml=new ai,El=new os;class qT extends ai{constructor(e,i,r){super(e,i),this.isInstancedMesh=!0,this.instanceMatrix=new Ey(new Float32Array(r*16),16),this.instanceColor=null,this.morphTexture=null,this.count=r,this.boundingBox=null,this.boundingSphere=null;for(let l=0;l<r;l++)this.setMatrixAt(l,YT)}computeBoundingBox(){const e=this.geometry,i=this.count;this.boundingBox===null&&(this.boundingBox=new xr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let r=0;r<i;r++)this.getMatrixAt(r,oo),Ty.copy(e.boundingBox).applyMatrix4(oo),this.boundingBox.union(Ty)}computeBoundingSphere(){const e=this.geometry,i=this.count;this.boundingSphere===null&&(this.boundingSphere=new os),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let r=0;r<i;r++)this.getMatrixAt(r,oo),El.copy(e.boundingSphere).applyMatrix4(oo),this.boundingSphere.union(El)}copy(e,i){return super.copy(e,i),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,i){i.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,i){i.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,i){const r=i.morphTargetInfluences,l=this.morphTexture.source.data.data,u=r.length+1,h=e*u+1;for(let d=0;d<r.length;d++)r[d]=l[h+d]}raycast(e,i){const r=this.matrixWorld,l=this.count;if(Ml.geometry=this.geometry,Ml.material=this.material,Ml.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),El.copy(this.boundingSphere),El.applyMatrix4(r),e.ray.intersectsSphere(El)!==!1))for(let u=0;u<l;u++){this.getMatrixAt(u,oo),by.multiplyMatrices(r,oo),Ml.matrixWorld=by,Ml.raycast(e,Eu);for(let h=0,d=Eu.length;h<d;h++){const p=Eu[h];p.instanceId=u,p.object=this,i.push(p)}Eu.length=0}}setColorAt(e,i){this.instanceColor===null&&(this.instanceColor=new Ey(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),i.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,i){i.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,i){const r=i.morphTargetInfluences,l=r.length+1;this.morphTexture===null&&(this.morphTexture=new WT(new Float32Array(l*this.count),l,this.count,mm,na));const u=this.morphTexture.source.data.data;let h=0;for(let g=0;g<r.length;g++)h+=r[g];const d=this.geometry.morphTargetsRelative?1:1-h,p=l*e;u[p]=d,u.set(r,p+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const sp=new $,ZT=new $,KT=new ge;class dr{constructor(e=new $(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,r,l){return this.normal.set(e,i,r),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,r){const l=sp.subVectors(r,i).cross(ZT.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i){const r=e.delta(sp),l=this.normal.dot(r);if(l===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const u=-(e.start.dot(this.normal)+this.constant)/l;return u<0||u>1?null:i.copy(e.start).addScaledVector(r,u)}intersectsLine(e){const i=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return i<0&&r>0||r<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const r=i||KT.getNormalMatrix(e),l=this.coplanarPoint(sp).applyMatrix4(e),u=this.normal.applyMatrix3(r).normalize();return this.constant=-l.dot(u),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Yr=new os,bu=new $;class Sm{constructor(e=new dr,i=new dr,r=new dr,l=new dr,u=new dr,h=new dr){this.planes=[e,i,r,l,u,h]}set(e,i,r,l,u,h){const d=this.planes;return d[0].copy(e),d[1].copy(i),d[2].copy(r),d[3].copy(l),d[4].copy(u),d[5].copy(h),this}copy(e){const i=this.planes;for(let r=0;r<6;r++)i[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,i=Da){const r=this.planes,l=e.elements,u=l[0],h=l[1],d=l[2],p=l[3],g=l[4],_=l[5],m=l[6],y=l[7],x=l[8],b=l[9],T=l[10],M=l[11],S=l[12],G=l[13],I=l[14],z=l[15];if(r[0].setComponents(p-u,y-g,M-x,z-S).normalize(),r[1].setComponents(p+u,y+g,M+x,z+S).normalize(),r[2].setComponents(p+h,y+_,M+b,z+G).normalize(),r[3].setComponents(p-h,y-_,M-b,z-G).normalize(),r[4].setComponents(p-d,y-m,M-T,z-I).normalize(),i===Da)r[5].setComponents(p+d,y+m,M+T,z+I).normalize();else if(i===Vu)r[5].setComponents(d,m,T,I).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Yr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Yr.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Yr)}intersectsSprite(e){return Yr.center.set(0,0,0),Yr.radius=.7071067811865476,Yr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Yr)}intersectsSphere(e){const i=this.planes,r=e.center,l=-e.radius;for(let u=0;u<6;u++)if(i[u].distanceToPoint(r)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let r=0;r<6;r++){const l=i[r];if(bu.x=l.normal.x>0?e.max.x:e.min.x,bu.y=l.normal.y>0?e.max.y:e.min.y,bu.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(bu)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let r=0;r<6;r++)if(i[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ku extends So{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Xu=new $,Wu=new $,wy=new Xe,bl=new xm,Tu=new os,op=new $,Ay=new $;class QT extends Pn{constructor(e=new Ci,i=new Ku){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[0];for(let l=1,u=i.count;l<u;l++)Xu.fromBufferAttribute(i,l-1),Wu.fromBufferAttribute(i,l),r[l]=r[l-1],r[l]+=Xu.distanceTo(Wu);e.setAttribute("lineDistance",new In(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,i){const r=this.geometry,l=this.matrixWorld,u=e.params.Line.threshold,h=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),Tu.copy(r.boundingSphere),Tu.applyMatrix4(l),Tu.radius+=u,e.ray.intersectsSphere(Tu)===!1)return;wy.copy(l).invert(),bl.copy(e.ray).applyMatrix4(wy);const d=u/((this.scale.x+this.scale.y+this.scale.z)/3),p=d*d,g=this.isLineSegments?2:1,_=r.index,y=r.attributes.position;if(_!==null){const x=Math.max(0,h.start),b=Math.min(_.count,h.start+h.count);for(let T=x,M=b-1;T<M;T+=g){const S=_.getX(T),G=_.getX(T+1),I=wu(this,e,bl,p,S,G,T);I&&i.push(I)}if(this.isLineLoop){const T=_.getX(b-1),M=_.getX(x),S=wu(this,e,bl,p,T,M,b-1);S&&i.push(S)}}else{const x=Math.max(0,h.start),b=Math.min(y.count,h.start+h.count);for(let T=x,M=b-1;T<M;T+=g){const S=wu(this,e,bl,p,T,T+1,T);S&&i.push(S)}if(this.isLineLoop){const T=wu(this,e,bl,p,b-1,x,b-1);T&&i.push(T)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,h=l.length;u<h;u++){const d=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=u}}}}}function wu(o,e,i,r,l,u,h){const d=o.geometry.attributes.position;if(Xu.fromBufferAttribute(d,l),Wu.fromBufferAttribute(d,u),i.distanceSqToSegment(Xu,Wu,op,Ay)>r)return;op.applyMatrix4(o.matrixWorld);const g=e.ray.origin.distanceTo(op);if(!(g<e.near||g>e.far))return{distance:g,point:Ay.clone().applyMatrix4(o.matrixWorld),index:h,face:null,faceIndex:null,barycoord:null,object:o}}const Ry=new $,Cy=new $;class Mm extends QT{constructor(e,i){super(e,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[];for(let l=0,u=i.count;l<u;l+=2)Ry.fromBufferAttribute(i,l),Cy.fromBufferAttribute(i,l+1),r[l]=l===0?0:r[l-1],r[l+1]=r[l]+Ry.distanceTo(Cy);e.setAttribute("lineDistance",new In(r,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class kx extends Zn{constructor(e,i,r=is,l,u,h,d=gi,p=gi,g,_=zl){if(_!==zl&&_!==Ul)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super(null,l,u,h,d,p,_,r,g),this.isDepthTexture=!0,this.image={width:e,height:i},this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ym(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Qu extends Ci{constructor(e=1,i=1,r=1,l=32,u=1,h=!1,d=0,p=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:i,height:r,radialSegments:l,heightSegments:u,openEnded:h,thetaStart:d,thetaLength:p};const g=this;l=Math.floor(l),u=Math.floor(u);const _=[],m=[],y=[],x=[];let b=0;const T=[],M=r/2;let S=0;G(),h===!1&&(e>0&&I(!0),i>0&&I(!1)),this.setIndex(_),this.setAttribute("position",new In(m,3)),this.setAttribute("normal",new In(y,3)),this.setAttribute("uv",new In(x,2));function G(){const z=new $,F=new $;let P=0;const L=(i-e)/r;for(let V=0;V<=u;V++){const C=[],E=V/u,k=E*(i-e)+e;for(let et=0;et<=l;et++){const tt=et/l,ut=tt*p+d,ft=Math.sin(ut),X=Math.cos(ut);F.x=k*ft,F.y=-E*r+M,F.z=k*X,m.push(F.x,F.y,F.z),z.set(ft,L,X).normalize(),y.push(z.x,z.y,z.z),x.push(tt,1-E),C.push(b++)}T.push(C)}for(let V=0;V<l;V++)for(let C=0;C<u;C++){const E=T[C][V],k=T[C+1][V],et=T[C+1][V+1],tt=T[C][V+1];(e>0||C!==0)&&(_.push(E,k,tt),P+=3),(i>0||C!==u-1)&&(_.push(k,et,tt),P+=3)}g.addGroup(S,P,0),S+=P}function I(z){const F=b,P=new me,L=new $;let V=0;const C=z===!0?e:i,E=z===!0?1:-1;for(let et=1;et<=l;et++)m.push(0,M*E,0),y.push(0,E,0),x.push(.5,.5),b++;const k=b;for(let et=0;et<=l;et++){const ut=et/l*p+d,ft=Math.cos(ut),X=Math.sin(ut);L.x=C*X,L.y=M*E,L.z=C*ft,m.push(L.x,L.y,L.z),y.push(0,E,0),P.x=ft*.5+.5,P.y=X*.5*E+.5,x.push(P.x,P.y),b++}for(let et=0;et<l;et++){const tt=F+et,ut=k+et;z===!0?_.push(ut,ut+1,tt):_.push(ut+1,ut,tt),V+=3}g.addGroup(S,V,z===!0?1:2),S+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qu(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Em extends Qu{constructor(e=1,i=1,r=32,l=1,u=!1,h=0,d=Math.PI*2){super(0,e,i,r,l,u,h,d),this.type="ConeGeometry",this.parameters={radius:e,height:i,radialSegments:r,heightSegments:l,openEnded:u,thetaStart:h,thetaLength:d}}static fromJSON(e){return new Em(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ju extends Ci{constructor(e=1,i=1,r=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:r,heightSegments:l};const u=e/2,h=i/2,d=Math.floor(r),p=Math.floor(l),g=d+1,_=p+1,m=e/d,y=i/p,x=[],b=[],T=[],M=[];for(let S=0;S<_;S++){const G=S*y-h;for(let I=0;I<g;I++){const z=I*m-u;b.push(z,-G,0),T.push(0,0,1),M.push(I/d),M.push(1-S/p)}}for(let S=0;S<p;S++)for(let G=0;G<d;G++){const I=G+g*S,z=G+g*(S+1),F=G+1+g*(S+1),P=G+1+g*S;x.push(I,z,P),x.push(z,F,P)}this.setIndex(x),this.setAttribute("position",new In(b,3)),this.setAttribute("normal",new In(T,3)),this.setAttribute("uv",new In(M,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ju(e.width,e.height,e.widthSegments,e.heightSegments)}}class Au extends So{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rx,this.normalScale=new me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new aa,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class JT extends So{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=rT,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class $T extends So{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Hx extends Pn{constructor(e,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Te(e),this.intensity=i}dispose(){}copy(e,i){return super.copy(e,i),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const i=super.toJSON(e);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}const lp=new Xe,Dy=new $,Ny=new $;class t1{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new me(512,512),this.map=null,this.mapPass=null,this.matrix=new Xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Sm,this._frameExtents=new me(1,1),this._viewportCount=1,this._viewports=[new on(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const i=this.camera,r=this.matrix;Dy.setFromMatrixPosition(e.matrixWorld),i.position.copy(Dy),Ny.setFromMatrixPosition(e.target.matrixWorld),i.lookAt(Ny),i.updateMatrixWorld(),lp.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(lp),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(lp)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Gx extends Bx{constructor(e=-1,i=1,r=1,l=-1,u=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=r,this.bottom=l,this.near=u,this.far=h,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,r,l,u,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let u=r-e,h=r+e,d=l+i,p=l-i;if(this.view!==null&&this.view.enabled){const g=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=g*this.view.offsetX,h=u+g*this.view.width,d-=_*this.view.offsetY,p=d-_*this.view.height}this.projectionMatrix.makeOrthographic(u,h,d,p,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class e1 extends t1{constructor(){super(new Gx(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class zy extends Hx{constructor(e,i){super(e,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pn.DEFAULT_UP),this.updateMatrix(),this.target=new Pn,this.shadow=new e1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class n1 extends Hx{constructor(e,i){super(e,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class i1 extends Ri{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e,this.index=0}}class Uy{constructor(e=1,i=0,r=0){this.radius=e,this.phi=i,this.theta=r}set(e,i,r){return this.radius=e,this.phi=i,this.theta=r,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=be(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,i,r){return this.radius=Math.sqrt(e*e+i*i+r*r),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,r),this.phi=Math.acos(be(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Ly extends Mm{constructor(e=10,i=10,r=4473924,l=8947848){r=new Te(r),l=new Te(l);const u=i/2,h=e/i,d=e/2,p=[],g=[];for(let y=0,x=0,b=-d;y<=i;y++,b+=h){p.push(-d,0,b,d,0,b),p.push(b,0,-d,b,0,d);const T=y===u?r:l;T.toArray(g,x),x+=3,T.toArray(g,x),x+=3,T.toArray(g,x),x+=3,T.toArray(g,x),x+=3}const _=new Ci;_.setAttribute("position",new In(p,3)),_.setAttribute("color",new In(g,3));const m=new Ku({vertexColors:!0,toneMapped:!1});super(_,m),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class a1 extends Mm{constructor(e=1){const i=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],r=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],l=new Ci;l.setAttribute("position",new In(i,3)),l.setAttribute("color",new In(r,3));const u=new Ku({vertexColors:!0,toneMapped:!1});super(l,u),this.type="AxesHelper"}setColors(e,i,r){const l=new Te,u=this.geometry.attributes.color.array;return l.set(e),l.toArray(u,0),l.toArray(u,3),l.set(i),l.toArray(u,6),l.toArray(u,9),l.set(r),l.toArray(u,12),l.toArray(u,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class r1 extends ss{constructor(e,i=null){super(),this.object=e,this.domElement=i,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Oy(o,e,i,r){const l=s1(r);switch(i){case Mx:return o*e;case bx:return o*e;case Tx:return o*e*2;case mm:return o*e/l.components*l.byteLength;case gm:return o*e/l.components*l.byteLength;case wx:return o*e*2/l.components*l.byteLength;case _m:return o*e*2/l.components*l.byteLength;case Ex:return o*e*3/l.components*l.byteLength;case ki:return o*e*4/l.components*l.byteLength;case vm:return o*e*4/l.components*l.byteLength;case zu:case Uu:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case Lu:case Ou:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case Lp:case Pp:return Math.max(o,16)*Math.max(e,8)/4;case Up:case Op:return Math.max(o,8)*Math.max(e,8)/2;case Ip:case Bp:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case Fp:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case kp:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case Hp:return Math.floor((o+4)/5)*Math.floor((e+3)/4)*16;case Gp:return Math.floor((o+4)/5)*Math.floor((e+4)/5)*16;case Vp:return Math.floor((o+5)/6)*Math.floor((e+4)/5)*16;case jp:return Math.floor((o+5)/6)*Math.floor((e+5)/6)*16;case Xp:return Math.floor((o+7)/8)*Math.floor((e+4)/5)*16;case Wp:return Math.floor((o+7)/8)*Math.floor((e+5)/6)*16;case Yp:return Math.floor((o+7)/8)*Math.floor((e+7)/8)*16;case qp:return Math.floor((o+9)/10)*Math.floor((e+4)/5)*16;case Zp:return Math.floor((o+9)/10)*Math.floor((e+5)/6)*16;case Kp:return Math.floor((o+9)/10)*Math.floor((e+7)/8)*16;case Qp:return Math.floor((o+9)/10)*Math.floor((e+9)/10)*16;case Jp:return Math.floor((o+11)/12)*Math.floor((e+9)/10)*16;case $p:return Math.floor((o+11)/12)*Math.floor((e+11)/12)*16;case Pu:case tm:case em:return Math.ceil(o/4)*Math.ceil(e/4)*16;case Ax:case nm:return Math.ceil(o/4)*Math.ceil(e/4)*8;case im:case am:return Math.ceil(o/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function s1(o){switch(o){case za:case yx:return{byteLength:1,components:1};case Dl:case xx:case Ll:return{byteLength:2,components:1};case dm:case pm:return{byteLength:2,components:4};case is:case hm:case na:return{byteLength:4,components:1};case Sx:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${o}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fm}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fm);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Vx(){let o=null,e=!1,i=null,r=null;function l(u,h){i(u,h),r=o.requestAnimationFrame(l)}return{start:function(){e!==!0&&i!==null&&(r=o.requestAnimationFrame(l),e=!0)},stop:function(){o.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(u){i=u},setContext:function(u){o=u}}}function o1(o){const e=new WeakMap;function i(d,p){const g=d.array,_=d.usage,m=g.byteLength,y=o.createBuffer();o.bindBuffer(p,y),o.bufferData(p,g,_),d.onUploadCallback();let x;if(g instanceof Float32Array)x=o.FLOAT;else if(g instanceof Uint16Array)d.isFloat16BufferAttribute?x=o.HALF_FLOAT:x=o.UNSIGNED_SHORT;else if(g instanceof Int16Array)x=o.SHORT;else if(g instanceof Uint32Array)x=o.UNSIGNED_INT;else if(g instanceof Int32Array)x=o.INT;else if(g instanceof Int8Array)x=o.BYTE;else if(g instanceof Uint8Array)x=o.UNSIGNED_BYTE;else if(g instanceof Uint8ClampedArray)x=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+g);return{buffer:y,type:x,bytesPerElement:g.BYTES_PER_ELEMENT,version:d.version,size:m}}function r(d,p,g){const _=p.array,m=p.updateRanges;if(o.bindBuffer(g,d),m.length===0)o.bufferSubData(g,0,_);else{m.sort((x,b)=>x.start-b.start);let y=0;for(let x=1;x<m.length;x++){const b=m[y],T=m[x];T.start<=b.start+b.count+1?b.count=Math.max(b.count,T.start+T.count-b.start):(++y,m[y]=T)}m.length=y+1;for(let x=0,b=m.length;x<b;x++){const T=m[x];o.bufferSubData(g,T.start*_.BYTES_PER_ELEMENT,_,T.start,T.count)}p.clearUpdateRanges()}p.onUploadCallback()}function l(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function u(d){d.isInterleavedBufferAttribute&&(d=d.data);const p=e.get(d);p&&(o.deleteBuffer(p.buffer),e.delete(d))}function h(d,p){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const _=e.get(d);(!_||_.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const g=e.get(d);if(g===void 0)e.set(d,i(d,p));else if(g.version<d.version){if(g.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(g.buffer,d,p),g.version=d.version}}return{get:l,remove:u,update:h}}var l1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,c1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,u1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,f1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,h1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,d1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,p1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,m1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,g1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,_1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,v1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,y1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,x1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,S1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,M1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,E1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,b1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,T1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,w1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,A1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,R1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,C1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,D1=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,N1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,z1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,U1=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,L1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,O1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,P1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,I1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,B1="gl_FragColor = linearToOutputTexel( gl_FragColor );",F1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,k1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,H1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,G1=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,V1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,j1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,X1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,W1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Y1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,q1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Z1=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,K1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Q1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,J1=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$1=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,tw=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ew=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nw=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,iw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,aw=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,rw=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,sw=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ow=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lw=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,cw=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,uw=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fw=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hw=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dw=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_w=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ew=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,bw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ww=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Aw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Dw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Nw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Uw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Lw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ow=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Iw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Hw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,jw=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Xw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ww=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Yw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Zw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Qw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,$w=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tA=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,eA=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,nA=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,iA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,aA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,sA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const oA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lA=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uA=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,pA=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,mA=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,gA=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,_A=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yA=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xA=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,SA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,MA=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,EA=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bA=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,TA=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,wA=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AA=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,RA=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,CA=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,DA=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,NA=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,zA=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,UA=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,LA=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,OA=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,PA=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,IA=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,BA=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,FA=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kA=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ve={alphahash_fragment:l1,alphahash_pars_fragment:c1,alphamap_fragment:u1,alphamap_pars_fragment:f1,alphatest_fragment:h1,alphatest_pars_fragment:d1,aomap_fragment:p1,aomap_pars_fragment:m1,batching_pars_vertex:g1,batching_vertex:_1,begin_vertex:v1,beginnormal_vertex:y1,bsdfs:x1,iridescence_fragment:S1,bumpmap_pars_fragment:M1,clipping_planes_fragment:E1,clipping_planes_pars_fragment:b1,clipping_planes_pars_vertex:T1,clipping_planes_vertex:w1,color_fragment:A1,color_pars_fragment:R1,color_pars_vertex:C1,color_vertex:D1,common:N1,cube_uv_reflection_fragment:z1,defaultnormal_vertex:U1,displacementmap_pars_vertex:L1,displacementmap_vertex:O1,emissivemap_fragment:P1,emissivemap_pars_fragment:I1,colorspace_fragment:B1,colorspace_pars_fragment:F1,envmap_fragment:k1,envmap_common_pars_fragment:H1,envmap_pars_fragment:G1,envmap_pars_vertex:V1,envmap_physical_pars_fragment:tw,envmap_vertex:j1,fog_vertex:X1,fog_pars_vertex:W1,fog_fragment:Y1,fog_pars_fragment:q1,gradientmap_pars_fragment:Z1,lightmap_pars_fragment:K1,lights_lambert_fragment:Q1,lights_lambert_pars_fragment:J1,lights_pars_begin:$1,lights_toon_fragment:ew,lights_toon_pars_fragment:nw,lights_phong_fragment:iw,lights_phong_pars_fragment:aw,lights_physical_fragment:rw,lights_physical_pars_fragment:sw,lights_fragment_begin:ow,lights_fragment_maps:lw,lights_fragment_end:cw,logdepthbuf_fragment:uw,logdepthbuf_pars_fragment:fw,logdepthbuf_pars_vertex:hw,logdepthbuf_vertex:dw,map_fragment:pw,map_pars_fragment:mw,map_particle_fragment:gw,map_particle_pars_fragment:_w,metalnessmap_fragment:vw,metalnessmap_pars_fragment:yw,morphinstance_vertex:xw,morphcolor_vertex:Sw,morphnormal_vertex:Mw,morphtarget_pars_vertex:Ew,morphtarget_vertex:bw,normal_fragment_begin:Tw,normal_fragment_maps:ww,normal_pars_fragment:Aw,normal_pars_vertex:Rw,normal_vertex:Cw,normalmap_pars_fragment:Dw,clearcoat_normal_fragment_begin:Nw,clearcoat_normal_fragment_maps:zw,clearcoat_pars_fragment:Uw,iridescence_pars_fragment:Lw,opaque_fragment:Ow,packing:Pw,premultiplied_alpha_fragment:Iw,project_vertex:Bw,dithering_fragment:Fw,dithering_pars_fragment:kw,roughnessmap_fragment:Hw,roughnessmap_pars_fragment:Gw,shadowmap_pars_fragment:Vw,shadowmap_pars_vertex:jw,shadowmap_vertex:Xw,shadowmask_pars_fragment:Ww,skinbase_vertex:Yw,skinning_pars_vertex:qw,skinning_vertex:Zw,skinnormal_vertex:Kw,specularmap_fragment:Qw,specularmap_pars_fragment:Jw,tonemapping_fragment:$w,tonemapping_pars_fragment:tA,transmission_fragment:eA,transmission_pars_fragment:nA,uv_pars_fragment:iA,uv_pars_vertex:aA,uv_vertex:rA,worldpos_vertex:sA,background_vert:oA,background_frag:lA,backgroundCube_vert:cA,backgroundCube_frag:uA,cube_vert:fA,cube_frag:hA,depth_vert:dA,depth_frag:pA,distanceRGBA_vert:mA,distanceRGBA_frag:gA,equirect_vert:_A,equirect_frag:vA,linedashed_vert:yA,linedashed_frag:xA,meshbasic_vert:SA,meshbasic_frag:MA,meshlambert_vert:EA,meshlambert_frag:bA,meshmatcap_vert:TA,meshmatcap_frag:wA,meshnormal_vert:AA,meshnormal_frag:RA,meshphong_vert:CA,meshphong_frag:DA,meshphysical_vert:NA,meshphysical_frag:zA,meshtoon_vert:UA,meshtoon_frag:LA,points_vert:OA,points_frag:PA,shadow_vert:IA,shadow_frag:BA,sprite_vert:FA,sprite_frag:kA},Gt={common:{diffuse:{value:new Te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ge},alphaMap:{value:null},alphaMapTransform:{value:new ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ge}},envmap:{envMap:{value:null},envMapRotation:{value:new ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ge},normalScale:{value:new me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ge},alphaTest:{value:0},uvTransform:{value:new ge}},sprite:{diffuse:{value:new Te(16777215)},opacity:{value:1},center:{value:new me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ge},alphaMap:{value:null},alphaMapTransform:{value:new ge},alphaTest:{value:0}}},ta={basic:{uniforms:qn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.fog]),vertexShader:ve.meshbasic_vert,fragmentShader:ve.meshbasic_frag},lambert:{uniforms:qn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,Gt.lights,{emissive:{value:new Te(0)}}]),vertexShader:ve.meshlambert_vert,fragmentShader:ve.meshlambert_frag},phong:{uniforms:qn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,Gt.lights,{emissive:{value:new Te(0)},specular:{value:new Te(1118481)},shininess:{value:30}}]),vertexShader:ve.meshphong_vert,fragmentShader:ve.meshphong_frag},standard:{uniforms:qn([Gt.common,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.roughnessmap,Gt.metalnessmap,Gt.fog,Gt.lights,{emissive:{value:new Te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ve.meshphysical_vert,fragmentShader:ve.meshphysical_frag},toon:{uniforms:qn([Gt.common,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.gradientmap,Gt.fog,Gt.lights,{emissive:{value:new Te(0)}}]),vertexShader:ve.meshtoon_vert,fragmentShader:ve.meshtoon_frag},matcap:{uniforms:qn([Gt.common,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,{matcap:{value:null}}]),vertexShader:ve.meshmatcap_vert,fragmentShader:ve.meshmatcap_frag},points:{uniforms:qn([Gt.points,Gt.fog]),vertexShader:ve.points_vert,fragmentShader:ve.points_frag},dashed:{uniforms:qn([Gt.common,Gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ve.linedashed_vert,fragmentShader:ve.linedashed_frag},depth:{uniforms:qn([Gt.common,Gt.displacementmap]),vertexShader:ve.depth_vert,fragmentShader:ve.depth_frag},normal:{uniforms:qn([Gt.common,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,{opacity:{value:1}}]),vertexShader:ve.meshnormal_vert,fragmentShader:ve.meshnormal_frag},sprite:{uniforms:qn([Gt.sprite,Gt.fog]),vertexShader:ve.sprite_vert,fragmentShader:ve.sprite_frag},background:{uniforms:{uvTransform:{value:new ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ve.background_vert,fragmentShader:ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ge}},vertexShader:ve.backgroundCube_vert,fragmentShader:ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ve.cube_vert,fragmentShader:ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ve.equirect_vert,fragmentShader:ve.equirect_frag},distanceRGBA:{uniforms:qn([Gt.common,Gt.displacementmap,{referencePosition:{value:new $},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ve.distanceRGBA_vert,fragmentShader:ve.distanceRGBA_frag},shadow:{uniforms:qn([Gt.lights,Gt.fog,{color:{value:new Te(0)},opacity:{value:1}}]),vertexShader:ve.shadow_vert,fragmentShader:ve.shadow_frag}};ta.physical={uniforms:qn([ta.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ge},clearcoatNormalScale:{value:new me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ge},sheen:{value:0},sheenColor:{value:new Te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ge},transmissionSamplerSize:{value:new me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ge},attenuationDistance:{value:0},attenuationColor:{value:new Te(0)},specularColor:{value:new Te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ge},anisotropyVector:{value:new me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ge}}]),vertexShader:ve.meshphysical_vert,fragmentShader:ve.meshphysical_frag};const Ru={r:0,b:0,g:0},qr=new aa,HA=new Xe;function GA(o,e,i,r,l,u,h){const d=new Te(0);let p=u===!0?0:1,g,_,m=null,y=0,x=null;function b(I){let z=I.isScene===!0?I.background:null;return z&&z.isTexture&&(z=(I.backgroundBlurriness>0?i:e).get(z)),z}function T(I){let z=!1;const F=b(I);F===null?S(d,p):F&&F.isColor&&(S(F,1),z=!0);const P=o.xr.getEnvironmentBlendMode();P==="additive"?r.buffers.color.setClear(0,0,0,1,h):P==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,h),(o.autoClear||z)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil))}function M(I,z){const F=b(z);F&&(F.isCubeTexture||F.mapping===Zu)?(_===void 0&&(_=new ai(new rs(1,1,1),new yr({name:"BackgroundCubeMaterial",uniforms:xo(ta.backgroundCube.uniforms),vertexShader:ta.backgroundCube.vertexShader,fragmentShader:ta.backgroundCube.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),_.geometry.deleteAttribute("normal"),_.geometry.deleteAttribute("uv"),_.onBeforeRender=function(P,L,V){this.matrixWorld.copyPosition(V.matrixWorld)},Object.defineProperty(_.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(_)),qr.copy(z.backgroundRotation),qr.x*=-1,qr.y*=-1,qr.z*=-1,F.isCubeTexture&&F.isRenderTargetTexture===!1&&(qr.y*=-1,qr.z*=-1),_.material.uniforms.envMap.value=F,_.material.uniforms.flipEnvMap.value=F.isCubeTexture&&F.isRenderTargetTexture===!1?-1:1,_.material.uniforms.backgroundBlurriness.value=z.backgroundBlurriness,_.material.uniforms.backgroundIntensity.value=z.backgroundIntensity,_.material.uniforms.backgroundRotation.value.setFromMatrix4(HA.makeRotationFromEuler(qr)),_.material.toneMapped=Pe.getTransfer(F.colorSpace)!==Ve,(m!==F||y!==F.version||x!==o.toneMapping)&&(_.material.needsUpdate=!0,m=F,y=F.version,x=o.toneMapping),_.layers.enableAll(),I.unshift(_,_.geometry,_.material,0,0,null)):F&&F.isTexture&&(g===void 0&&(g=new ai(new Ju(2,2),new yr({name:"BackgroundMaterial",uniforms:xo(ta.background.uniforms),vertexShader:ta.background.vertexShader,fragmentShader:ta.background.fragmentShader,side:_r,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),g.geometry.deleteAttribute("normal"),Object.defineProperty(g.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(g)),g.material.uniforms.t2D.value=F,g.material.uniforms.backgroundIntensity.value=z.backgroundIntensity,g.material.toneMapped=Pe.getTransfer(F.colorSpace)!==Ve,F.matrixAutoUpdate===!0&&F.updateMatrix(),g.material.uniforms.uvTransform.value.copy(F.matrix),(m!==F||y!==F.version||x!==o.toneMapping)&&(g.material.needsUpdate=!0,m=F,y=F.version,x=o.toneMapping),g.layers.enableAll(),I.unshift(g,g.geometry,g.material,0,0,null))}function S(I,z){I.getRGB(Ru,Ix(o)),r.buffers.color.setClear(Ru.r,Ru.g,Ru.b,z,h)}function G(){_!==void 0&&(_.geometry.dispose(),_.material.dispose(),_=void 0),g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0)}return{getClearColor:function(){return d},setClearColor:function(I,z=1){d.set(I),p=z,S(d,p)},getClearAlpha:function(){return p},setClearAlpha:function(I){p=I,S(d,p)},render:T,addToRenderList:M,dispose:G}}function VA(o,e){const i=o.getParameter(o.MAX_VERTEX_ATTRIBS),r={},l=y(null);let u=l,h=!1;function d(E,k,et,tt,ut){let ft=!1;const X=m(tt,et,k);u!==X&&(u=X,g(u.object)),ft=x(E,tt,et,ut),ft&&b(E,tt,et,ut),ut!==null&&e.update(ut,o.ELEMENT_ARRAY_BUFFER),(ft||h)&&(h=!1,z(E,k,et,tt),ut!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e.get(ut).buffer))}function p(){return o.createVertexArray()}function g(E){return o.bindVertexArray(E)}function _(E){return o.deleteVertexArray(E)}function m(E,k,et){const tt=et.wireframe===!0;let ut=r[E.id];ut===void 0&&(ut={},r[E.id]=ut);let ft=ut[k.id];ft===void 0&&(ft={},ut[k.id]=ft);let X=ft[tt];return X===void 0&&(X=y(p()),ft[tt]=X),X}function y(E){const k=[],et=[],tt=[];for(let ut=0;ut<i;ut++)k[ut]=0,et[ut]=0,tt[ut]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:et,attributeDivisors:tt,object:E,attributes:{},index:null}}function x(E,k,et,tt){const ut=u.attributes,ft=k.attributes;let X=0;const it=et.getAttributes();for(const W in it)if(it[W].location>=0){const vt=ut[W];let At=ft[W];if(At===void 0&&(W==="instanceMatrix"&&E.instanceMatrix&&(At=E.instanceMatrix),W==="instanceColor"&&E.instanceColor&&(At=E.instanceColor)),vt===void 0||vt.attribute!==At||At&&vt.data!==At.data)return!0;X++}return u.attributesNum!==X||u.index!==tt}function b(E,k,et,tt){const ut={},ft=k.attributes;let X=0;const it=et.getAttributes();for(const W in it)if(it[W].location>=0){let vt=ft[W];vt===void 0&&(W==="instanceMatrix"&&E.instanceMatrix&&(vt=E.instanceMatrix),W==="instanceColor"&&E.instanceColor&&(vt=E.instanceColor));const At={};At.attribute=vt,vt&&vt.data&&(At.data=vt.data),ut[W]=At,X++}u.attributes=ut,u.attributesNum=X,u.index=tt}function T(){const E=u.newAttributes;for(let k=0,et=E.length;k<et;k++)E[k]=0}function M(E){S(E,0)}function S(E,k){const et=u.newAttributes,tt=u.enabledAttributes,ut=u.attributeDivisors;et[E]=1,tt[E]===0&&(o.enableVertexAttribArray(E),tt[E]=1),ut[E]!==k&&(o.vertexAttribDivisor(E,k),ut[E]=k)}function G(){const E=u.newAttributes,k=u.enabledAttributes;for(let et=0,tt=k.length;et<tt;et++)k[et]!==E[et]&&(o.disableVertexAttribArray(et),k[et]=0)}function I(E,k,et,tt,ut,ft,X){X===!0?o.vertexAttribIPointer(E,k,et,ut,ft):o.vertexAttribPointer(E,k,et,tt,ut,ft)}function z(E,k,et,tt){T();const ut=tt.attributes,ft=et.getAttributes(),X=k.defaultAttributeValues;for(const it in ft){const W=ft[it];if(W.location>=0){let mt=ut[it];if(mt===void 0&&(it==="instanceMatrix"&&E.instanceMatrix&&(mt=E.instanceMatrix),it==="instanceColor"&&E.instanceColor&&(mt=E.instanceColor)),mt!==void 0){const vt=mt.normalized,At=mt.itemSize,Xt=e.get(mt);if(Xt===void 0)continue;const he=Xt.buffer,R=Xt.type,Y=Xt.bytesPerElement,pt=R===o.INT||R===o.UNSIGNED_INT||mt.gpuType===hm;if(mt.isInterleavedBufferAttribute){const ht=mt.data,Ct=ht.stride,Ut=mt.offset;if(ht.isInstancedInterleavedBuffer){for(let bt=0;bt<W.locationSize;bt++)S(W.location+bt,ht.meshPerAttribute);E.isInstancedMesh!==!0&&tt._maxInstanceCount===void 0&&(tt._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let bt=0;bt<W.locationSize;bt++)M(W.location+bt);o.bindBuffer(o.ARRAY_BUFFER,he);for(let bt=0;bt<W.locationSize;bt++)I(W.location+bt,At/W.locationSize,R,vt,Ct*Y,(Ut+At/W.locationSize*bt)*Y,pt)}else{if(mt.isInstancedBufferAttribute){for(let ht=0;ht<W.locationSize;ht++)S(W.location+ht,mt.meshPerAttribute);E.isInstancedMesh!==!0&&tt._maxInstanceCount===void 0&&(tt._maxInstanceCount=mt.meshPerAttribute*mt.count)}else for(let ht=0;ht<W.locationSize;ht++)M(W.location+ht);o.bindBuffer(o.ARRAY_BUFFER,he);for(let ht=0;ht<W.locationSize;ht++)I(W.location+ht,At/W.locationSize,R,vt,At*Y,At/W.locationSize*ht*Y,pt)}}else if(X!==void 0){const vt=X[it];if(vt!==void 0)switch(vt.length){case 2:o.vertexAttrib2fv(W.location,vt);break;case 3:o.vertexAttrib3fv(W.location,vt);break;case 4:o.vertexAttrib4fv(W.location,vt);break;default:o.vertexAttrib1fv(W.location,vt)}}}}G()}function F(){V();for(const E in r){const k=r[E];for(const et in k){const tt=k[et];for(const ut in tt)_(tt[ut].object),delete tt[ut];delete k[et]}delete r[E]}}function P(E){if(r[E.id]===void 0)return;const k=r[E.id];for(const et in k){const tt=k[et];for(const ut in tt)_(tt[ut].object),delete tt[ut];delete k[et]}delete r[E.id]}function L(E){for(const k in r){const et=r[k];if(et[E.id]===void 0)continue;const tt=et[E.id];for(const ut in tt)_(tt[ut].object),delete tt[ut];delete et[E.id]}}function V(){C(),h=!0,u!==l&&(u=l,g(u.object))}function C(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:V,resetDefaultState:C,dispose:F,releaseStatesOfGeometry:P,releaseStatesOfProgram:L,initAttributes:T,enableAttribute:M,disableUnusedAttributes:G}}function jA(o,e,i){let r;function l(g){r=g}function u(g,_){o.drawArrays(r,g,_),i.update(_,r,1)}function h(g,_,m){m!==0&&(o.drawArraysInstanced(r,g,_,m),i.update(_,r,m))}function d(g,_,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,g,0,_,0,m);let x=0;for(let b=0;b<m;b++)x+=_[b];i.update(x,r,1)}function p(g,_,m,y){if(m===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let b=0;b<g.length;b++)h(g[b],_[b],y[b]);else{x.multiDrawArraysInstancedWEBGL(r,g,0,_,0,y,0,m);let b=0;for(let T=0;T<m;T++)b+=_[T]*y[T];i.update(b,r,1)}}this.setMode=l,this.render=u,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function XA(o,e,i,r){let l;function u(){if(l!==void 0)return l;if(e.has("EXT_texture_filter_anisotropic")===!0){const L=e.get("EXT_texture_filter_anisotropic");l=o.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function h(L){return!(L!==ki&&r.convert(L)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(L){const V=L===Ll&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(L!==za&&r.convert(L)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==na&&!V)}function p(L){if(L==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let g=i.precision!==void 0?i.precision:"highp";const _=p(g);_!==g&&(console.warn("THREE.WebGLRenderer:",g,"not supported, using",_,"instead."),g=_);const m=i.logarithmicDepthBuffer===!0,y=i.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),x=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),b=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),T=o.getParameter(o.MAX_TEXTURE_SIZE),M=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),S=o.getParameter(o.MAX_VERTEX_ATTRIBS),G=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),I=o.getParameter(o.MAX_VARYING_VECTORS),z=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),F=b>0,P=o.getParameter(o.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:u,getMaxPrecision:p,textureFormatReadable:h,textureTypeReadable:d,precision:g,logarithmicDepthBuffer:m,reverseDepthBuffer:y,maxTextures:x,maxVertexTextures:b,maxTextureSize:T,maxCubemapSize:M,maxAttributes:S,maxVertexUniforms:G,maxVaryings:I,maxFragmentUniforms:z,vertexTextures:F,maxSamples:P}}function WA(o){const e=this;let i=null,r=0,l=!1,u=!1;const h=new dr,d=new ge,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(m,y){const x=m.length!==0||y||r!==0||l;return l=y,r=m.length,x},this.beginShadows=function(){u=!0,_(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(m,y){i=_(m,y,0)},this.setState=function(m,y,x){const b=m.clippingPlanes,T=m.clipIntersection,M=m.clipShadows,S=o.get(m);if(!l||b===null||b.length===0||u&&!M)u?_(null):g();else{const G=u?0:r,I=G*4;let z=S.clippingState||null;p.value=z,z=_(b,y,I,x);for(let F=0;F!==I;++F)z[F]=i[F];S.clippingState=z,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=G}};function g(){p.value!==i&&(p.value=i,p.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function _(m,y,x,b){const T=m!==null?m.length:0;let M=null;if(T!==0){if(M=p.value,b!==!0||M===null){const S=x+T*4,G=y.matrixWorldInverse;d.getNormalMatrix(G),(M===null||M.length<S)&&(M=new Float32Array(S));for(let I=0,z=x;I!==T;++I,z+=4)h.copy(m[I]).applyMatrix4(G,d),h.normal.toArray(M,z),M[z+3]=h.constant}p.value=M,p.needsUpdate=!0}return e.numPlanes=T,e.numIntersection=0,M}}function YA(o){let e=new WeakMap;function i(h,d){return d===Cp?h.mapping=_o:d===Dp&&(h.mapping=vo),h}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===Cp||d===Dp)if(e.has(h)){const p=e.get(h).texture;return i(p,h.mapping)}else{const p=h.image;if(p&&p.height>0){const g=new VT(p.height);return g.fromEquirectangularTexture(o,h),e.set(h,g),h.addEventListener("dispose",l),i(g.texture,h.mapping)}else return null}}return h}function l(h){const d=h.target;d.removeEventListener("dispose",l);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function u(){e=new WeakMap}return{get:r,dispose:u}}const fo=4,Py=[.125,.215,.35,.446,.526,.582],ts=20,cp=new Gx,Iy=new Te;let up=null,fp=0,hp=0,dp=!1;const Qr=(1+Math.sqrt(5))/2,lo=1/Qr,By=[new $(-Qr,lo,0),new $(Qr,lo,0),new $(-lo,0,Qr),new $(lo,0,Qr),new $(0,Qr,-lo),new $(0,Qr,lo),new $(-1,1,-1),new $(1,1,-1),new $(-1,1,1),new $(1,1,1)],qA=new $;class Fy{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,i=0,r=.1,l=100,u={}){const{size:h=256,position:d=qA}=u;up=this._renderer.getRenderTarget(),fp=this._renderer.getActiveCubeFace(),hp=this._renderer.getActiveMipmapLevel(),dp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(h);const p=this._allocateTargets();return p.depthBuffer=!0,this._sceneToCubeUV(e,r,l,p,d),i>0&&this._blur(p,0,0,i),this._applyPMREM(p),this._cleanup(p),p}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gy(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hy(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(up,fp,hp),this._renderer.xr.enabled=dp,e.scissorTest=!1,Cu(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===_o||e.mapping===vo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),up=this._renderer.getRenderTarget(),fp=this._renderer.getActiveCubeFace(),hp=this._renderer.getActiveMipmapLevel(),dp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=i||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,r={magFilter:ea,minFilter:ea,generateMipmaps:!1,type:Ll,format:ki,colorSpace:yo,depthBuffer:!1},l=ky(e,i,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ky(e,i,r);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ZA(u)),this._blurMaterial=KA(u,e,i)}return l}_compileMaterial(e){const i=new ai(this._lodPlanes[0],e);this._renderer.compile(i,cp)}_sceneToCubeUV(e,i,r,l,u){const p=new Ri(90,1,i,r),g=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],m=this._renderer,y=m.autoClear,x=m.toneMapping;m.getClearColor(Iy),m.toneMapping=gr,m.autoClear=!1;const b=new Lx({name:"PMREM.Background",side:ri,depthWrite:!1,depthTest:!1}),T=new ai(new rs,b);let M=!1;const S=e.background;S?S.isColor&&(b.color.copy(S),e.background=null,M=!0):(b.color.copy(Iy),M=!0);for(let G=0;G<6;G++){const I=G%3;I===0?(p.up.set(0,g[G],0),p.position.set(u.x,u.y,u.z),p.lookAt(u.x+_[G],u.y,u.z)):I===1?(p.up.set(0,0,g[G]),p.position.set(u.x,u.y,u.z),p.lookAt(u.x,u.y+_[G],u.z)):(p.up.set(0,g[G],0),p.position.set(u.x,u.y,u.z),p.lookAt(u.x,u.y,u.z+_[G]));const z=this._cubeSize;Cu(l,I*z,G>2?z:0,z,z),m.setRenderTarget(l),M&&m.render(T,p),m.render(e,p)}T.geometry.dispose(),T.material.dispose(),m.toneMapping=x,m.autoClear=y,e.background=S}_textureToCubeUV(e,i){const r=this._renderer,l=e.mapping===_o||e.mapping===vo;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gy()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hy());const u=l?this._cubemapMaterial:this._equirectMaterial,h=new ai(this._lodPlanes[0],u),d=u.uniforms;d.envMap.value=e;const p=this._cubeSize;Cu(i,0,0,3*p,2*p),r.setRenderTarget(i),r.render(h,cp)}_applyPMREM(e){const i=this._renderer,r=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let u=1;u<l;u++){const h=Math.sqrt(this._sigmas[u]*this._sigmas[u]-this._sigmas[u-1]*this._sigmas[u-1]),d=By[(l-u-1)%By.length];this._blur(e,u-1,u,h,d)}i.autoClear=r}_blur(e,i,r,l,u){const h=this._pingPongRenderTarget;this._halfBlur(e,h,i,r,l,"latitudinal",u),this._halfBlur(h,e,r,r,l,"longitudinal",u)}_halfBlur(e,i,r,l,u,h,d){const p=this._renderer,g=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const _=3,m=new ai(this._lodPlanes[l],g),y=g.uniforms,x=this._sizeLods[r]-1,b=isFinite(u)?Math.PI/(2*x):2*Math.PI/(2*ts-1),T=u/b,M=isFinite(u)?1+Math.floor(_*T):ts;M>ts&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${M} samples when the maximum is set to ${ts}`);const S=[];let G=0;for(let L=0;L<ts;++L){const V=L/T,C=Math.exp(-V*V/2);S.push(C),L===0?G+=C:L<M&&(G+=2*C)}for(let L=0;L<S.length;L++)S[L]=S[L]/G;y.envMap.value=e.texture,y.samples.value=M,y.weights.value=S,y.latitudinal.value=h==="latitudinal",d&&(y.poleAxis.value=d);const{_lodMax:I}=this;y.dTheta.value=b,y.mipInt.value=I-r;const z=this._sizeLods[l],F=3*z*(l>I-fo?l-I+fo:0),P=4*(this._cubeSize-z);Cu(i,F,P,3*z,2*z),p.setRenderTarget(i),p.render(m,cp)}}function ZA(o){const e=[],i=[],r=[];let l=o;const u=o-fo+1+Py.length;for(let h=0;h<u;h++){const d=Math.pow(2,l);i.push(d);let p=1/d;h>o-fo?p=Py[h-o+fo-1]:h===0&&(p=0),r.push(p);const g=1/(d-2),_=-g,m=1+g,y=[_,_,m,_,m,m,_,_,m,m,_,m],x=6,b=6,T=3,M=2,S=1,G=new Float32Array(T*b*x),I=new Float32Array(M*b*x),z=new Float32Array(S*b*x);for(let P=0;P<x;P++){const L=P%3*2/3-1,V=P>2?0:-1,C=[L,V,0,L+2/3,V,0,L+2/3,V+1,0,L,V,0,L+2/3,V+1,0,L,V+1,0];G.set(C,T*b*P),I.set(y,M*b*P);const E=[P,P,P,P,P,P];z.set(E,S*b*P)}const F=new Ci;F.setAttribute("position",new Hi(G,T)),F.setAttribute("uv",new Hi(I,M)),F.setAttribute("faceIndex",new Hi(z,S)),e.push(F),l>fo&&l--}return{lodPlanes:e,sizeLods:i,sigmas:r}}function ky(o,e,i){const r=new as(o,e,i);return r.texture.mapping=Zu,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Cu(o,e,i,r,l){o.viewport.set(e,i,r,l),o.scissor.set(e,i,r,l)}function KA(o,e,i){const r=new Float32Array(ts),l=new $(0,1,0);return new yr({name:"SphericalGaussianBlur",defines:{n:ts,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:bm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:mr,depthTest:!1,depthWrite:!1})}function Hy(){return new yr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:bm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:mr,depthTest:!1,depthWrite:!1})}function Gy(){return new yr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:bm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:mr,depthTest:!1,depthWrite:!1})}function bm(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function QA(o){let e=new WeakMap,i=null;function r(d){if(d&&d.isTexture){const p=d.mapping,g=p===Cp||p===Dp,_=p===_o||p===vo;if(g||_){let m=e.get(d);const y=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==y)return i===null&&(i=new Fy(o)),m=g?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),m.texture;if(m!==void 0)return m.texture;{const x=d.image;return g&&x&&x.height>0||_&&x&&l(x)?(i===null&&(i=new Fy(o)),m=g?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),d.addEventListener("dispose",u),m.texture):null}}}return d}function l(d){let p=0;const g=6;for(let _=0;_<g;_++)d[_]!==void 0&&p++;return p===g}function u(d){const p=d.target;p.removeEventListener("dispose",u);const g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function h(){e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function JA(o){const e={};function i(r){if(e[r]!==void 0)return e[r];let l;switch(r){case"WEBGL_depth_texture":l=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=o.getExtension(r)}return e[r]=l,l}return{has:function(r){return i(r)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(r){const l=i(r);return l===null&&Bu("THREE.WebGLRenderer: "+r+" extension not supported."),l}}}function $A(o,e,i,r){const l={},u=new WeakMap;function h(m){const y=m.target;y.index!==null&&e.remove(y.index);for(const b in y.attributes)e.remove(y.attributes[b]);y.removeEventListener("dispose",h),delete l[y.id];const x=u.get(y);x&&(e.remove(x),u.delete(y)),r.releaseStatesOfGeometry(y),y.isInstancedBufferGeometry===!0&&delete y._maxInstanceCount,i.memory.geometries--}function d(m,y){return l[y.id]===!0||(y.addEventListener("dispose",h),l[y.id]=!0,i.memory.geometries++),y}function p(m){const y=m.attributes;for(const x in y)e.update(y[x],o.ARRAY_BUFFER)}function g(m){const y=[],x=m.index,b=m.attributes.position;let T=0;if(x!==null){const G=x.array;T=x.version;for(let I=0,z=G.length;I<z;I+=3){const F=G[I+0],P=G[I+1],L=G[I+2];y.push(F,P,P,L,L,F)}}else if(b!==void 0){const G=b.array;T=b.version;for(let I=0,z=G.length/3-1;I<z;I+=3){const F=I+0,P=I+1,L=I+2;y.push(F,P,P,L,L,F)}}else return;const M=new(Dx(y)?Px:Ox)(y,1);M.version=T;const S=u.get(m);S&&e.remove(S),u.set(m,M)}function _(m){const y=u.get(m);if(y){const x=m.index;x!==null&&y.version<x.version&&g(m)}else g(m);return u.get(m)}return{get:d,update:p,getWireframeAttribute:_}}function tR(o,e,i){let r;function l(y){r=y}let u,h;function d(y){u=y.type,h=y.bytesPerElement}function p(y,x){o.drawElements(r,x,u,y*h),i.update(x,r,1)}function g(y,x,b){b!==0&&(o.drawElementsInstanced(r,x,u,y*h,b),i.update(x,r,b))}function _(y,x,b){if(b===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,x,0,u,y,0,b);let M=0;for(let S=0;S<b;S++)M+=x[S];i.update(M,r,1)}function m(y,x,b,T){if(b===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let S=0;S<y.length;S++)g(y[S]/h,x[S],T[S]);else{M.multiDrawElementsInstancedWEBGL(r,x,0,u,y,0,T,0,b);let S=0;for(let G=0;G<b;G++)S+=x[G]*T[G];i.update(S,r,1)}}this.setMode=l,this.setIndex=d,this.render=p,this.renderInstances=g,this.renderMultiDraw=_,this.renderMultiDrawInstances=m}function eR(o){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(u,h,d){switch(i.calls++,h){case o.TRIANGLES:i.triangles+=d*(u/3);break;case o.LINES:i.lines+=d*(u/2);break;case o.LINE_STRIP:i.lines+=d*(u-1);break;case o.LINE_LOOP:i.lines+=d*u;break;case o.POINTS:i.points+=d*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:r}}function nR(o,e,i){const r=new WeakMap,l=new on;function u(h,d,p){const g=h.morphTargetInfluences,_=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,m=_!==void 0?_.length:0;let y=r.get(d);if(y===void 0||y.count!==m){let E=function(){V.dispose(),r.delete(d),d.removeEventListener("dispose",E)};var x=E;y!==void 0&&y.texture.dispose();const b=d.morphAttributes.position!==void 0,T=d.morphAttributes.normal!==void 0,M=d.morphAttributes.color!==void 0,S=d.morphAttributes.position||[],G=d.morphAttributes.normal||[],I=d.morphAttributes.color||[];let z=0;b===!0&&(z=1),T===!0&&(z=2),M===!0&&(z=3);let F=d.attributes.position.count*z,P=1;F>e.maxTextureSize&&(P=Math.ceil(F/e.maxTextureSize),F=e.maxTextureSize);const L=new Float32Array(F*P*4*m),V=new Nx(L,F,P,m);V.type=na,V.needsUpdate=!0;const C=z*4;for(let k=0;k<m;k++){const et=S[k],tt=G[k],ut=I[k],ft=F*P*4*k;for(let X=0;X<et.count;X++){const it=X*C;b===!0&&(l.fromBufferAttribute(et,X),L[ft+it+0]=l.x,L[ft+it+1]=l.y,L[ft+it+2]=l.z,L[ft+it+3]=0),T===!0&&(l.fromBufferAttribute(tt,X),L[ft+it+4]=l.x,L[ft+it+5]=l.y,L[ft+it+6]=l.z,L[ft+it+7]=0),M===!0&&(l.fromBufferAttribute(ut,X),L[ft+it+8]=l.x,L[ft+it+9]=l.y,L[ft+it+10]=l.z,L[ft+it+11]=ut.itemSize===4?l.w:1)}}y={count:m,texture:V,size:new me(F,P)},r.set(d,y),d.addEventListener("dispose",E)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)p.getUniforms().setValue(o,"morphTexture",h.morphTexture,i);else{let b=0;for(let M=0;M<g.length;M++)b+=g[M];const T=d.morphTargetsRelative?1:1-b;p.getUniforms().setValue(o,"morphTargetBaseInfluence",T),p.getUniforms().setValue(o,"morphTargetInfluences",g)}p.getUniforms().setValue(o,"morphTargetsTexture",y.texture,i),p.getUniforms().setValue(o,"morphTargetsTextureSize",y.size)}return{update:u}}function iR(o,e,i,r){let l=new WeakMap;function u(p){const g=r.render.frame,_=p.geometry,m=e.get(p,_);if(l.get(m)!==g&&(e.update(m),l.set(m,g)),p.isInstancedMesh&&(p.hasEventListener("dispose",d)===!1&&p.addEventListener("dispose",d),l.get(p)!==g&&(i.update(p.instanceMatrix,o.ARRAY_BUFFER),p.instanceColor!==null&&i.update(p.instanceColor,o.ARRAY_BUFFER),l.set(p,g))),p.isSkinnedMesh){const y=p.skeleton;l.get(y)!==g&&(y.update(),l.set(y,g))}return m}function h(){l=new WeakMap}function d(p){const g=p.target;g.removeEventListener("dispose",d),i.remove(g.instanceMatrix),g.instanceColor!==null&&i.remove(g.instanceColor)}return{update:u,dispose:h}}const jx=new Zn,Vy=new kx(1,1),Xx=new Nx,Wx=new wT,Yx=new Fx,jy=[],Xy=[],Wy=new Float32Array(16),Yy=new Float32Array(9),qy=new Float32Array(4);function Mo(o,e,i){const r=o[0];if(r<=0||r>0)return o;const l=e*i;let u=jy[l];if(u===void 0&&(u=new Float32Array(l),jy[l]=u),e!==0){r.toArray(u,0);for(let h=1,d=0;h!==e;++h)d+=i,o[h].toArray(u,d)}return u}function yn(o,e){if(o.length!==e.length)return!1;for(let i=0,r=o.length;i<r;i++)if(o[i]!==e[i])return!1;return!0}function xn(o,e){for(let i=0,r=e.length;i<r;i++)o[i]=e[i]}function $u(o,e){let i=Xy[e];i===void 0&&(i=new Int32Array(e),Xy[e]=i);for(let r=0;r!==e;++r)i[r]=o.allocateTextureUnit();return i}function aR(o,e){const i=this.cache;i[0]!==e&&(o.uniform1f(this.addr,e),i[0]=e)}function rR(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(yn(i,e))return;o.uniform2fv(this.addr,e),xn(i,e)}}function sR(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(o.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(yn(i,e))return;o.uniform3fv(this.addr,e),xn(i,e)}}function oR(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(yn(i,e))return;o.uniform4fv(this.addr,e),xn(i,e)}}function lR(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(yn(i,e))return;o.uniformMatrix2fv(this.addr,!1,e),xn(i,e)}else{if(yn(i,r))return;qy.set(r),o.uniformMatrix2fv(this.addr,!1,qy),xn(i,r)}}function cR(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(yn(i,e))return;o.uniformMatrix3fv(this.addr,!1,e),xn(i,e)}else{if(yn(i,r))return;Yy.set(r),o.uniformMatrix3fv(this.addr,!1,Yy),xn(i,r)}}function uR(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(yn(i,e))return;o.uniformMatrix4fv(this.addr,!1,e),xn(i,e)}else{if(yn(i,r))return;Wy.set(r),o.uniformMatrix4fv(this.addr,!1,Wy),xn(i,r)}}function fR(o,e){const i=this.cache;i[0]!==e&&(o.uniform1i(this.addr,e),i[0]=e)}function hR(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(yn(i,e))return;o.uniform2iv(this.addr,e),xn(i,e)}}function dR(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(yn(i,e))return;o.uniform3iv(this.addr,e),xn(i,e)}}function pR(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(yn(i,e))return;o.uniform4iv(this.addr,e),xn(i,e)}}function mR(o,e){const i=this.cache;i[0]!==e&&(o.uniform1ui(this.addr,e),i[0]=e)}function gR(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(yn(i,e))return;o.uniform2uiv(this.addr,e),xn(i,e)}}function _R(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(yn(i,e))return;o.uniform3uiv(this.addr,e),xn(i,e)}}function vR(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(yn(i,e))return;o.uniform4uiv(this.addr,e),xn(i,e)}}function yR(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l);let u;this.type===o.SAMPLER_2D_SHADOW?(Vy.compareFunction=Cx,u=Vy):u=jx,i.setTexture2D(e||u,l)}function xR(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture3D(e||Wx,l)}function SR(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTextureCube(e||Yx,l)}function MR(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture2DArray(e||Xx,l)}function ER(o){switch(o){case 5126:return aR;case 35664:return rR;case 35665:return sR;case 35666:return oR;case 35674:return lR;case 35675:return cR;case 35676:return uR;case 5124:case 35670:return fR;case 35667:case 35671:return hR;case 35668:case 35672:return dR;case 35669:case 35673:return pR;case 5125:return mR;case 36294:return gR;case 36295:return _R;case 36296:return vR;case 35678:case 36198:case 36298:case 36306:case 35682:return yR;case 35679:case 36299:case 36307:return xR;case 35680:case 36300:case 36308:case 36293:return SR;case 36289:case 36303:case 36311:case 36292:return MR}}function bR(o,e){o.uniform1fv(this.addr,e)}function TR(o,e){const i=Mo(e,this.size,2);o.uniform2fv(this.addr,i)}function wR(o,e){const i=Mo(e,this.size,3);o.uniform3fv(this.addr,i)}function AR(o,e){const i=Mo(e,this.size,4);o.uniform4fv(this.addr,i)}function RR(o,e){const i=Mo(e,this.size,4);o.uniformMatrix2fv(this.addr,!1,i)}function CR(o,e){const i=Mo(e,this.size,9);o.uniformMatrix3fv(this.addr,!1,i)}function DR(o,e){const i=Mo(e,this.size,16);o.uniformMatrix4fv(this.addr,!1,i)}function NR(o,e){o.uniform1iv(this.addr,e)}function zR(o,e){o.uniform2iv(this.addr,e)}function UR(o,e){o.uniform3iv(this.addr,e)}function LR(o,e){o.uniform4iv(this.addr,e)}function OR(o,e){o.uniform1uiv(this.addr,e)}function PR(o,e){o.uniform2uiv(this.addr,e)}function IR(o,e){o.uniform3uiv(this.addr,e)}function BR(o,e){o.uniform4uiv(this.addr,e)}function FR(o,e,i){const r=this.cache,l=e.length,u=$u(i,l);yn(r,u)||(o.uniform1iv(this.addr,u),xn(r,u));for(let h=0;h!==l;++h)i.setTexture2D(e[h]||jx,u[h])}function kR(o,e,i){const r=this.cache,l=e.length,u=$u(i,l);yn(r,u)||(o.uniform1iv(this.addr,u),xn(r,u));for(let h=0;h!==l;++h)i.setTexture3D(e[h]||Wx,u[h])}function HR(o,e,i){const r=this.cache,l=e.length,u=$u(i,l);yn(r,u)||(o.uniform1iv(this.addr,u),xn(r,u));for(let h=0;h!==l;++h)i.setTextureCube(e[h]||Yx,u[h])}function GR(o,e,i){const r=this.cache,l=e.length,u=$u(i,l);yn(r,u)||(o.uniform1iv(this.addr,u),xn(r,u));for(let h=0;h!==l;++h)i.setTexture2DArray(e[h]||Xx,u[h])}function VR(o){switch(o){case 5126:return bR;case 35664:return TR;case 35665:return wR;case 35666:return AR;case 35674:return RR;case 35675:return CR;case 35676:return DR;case 5124:case 35670:return NR;case 35667:case 35671:return zR;case 35668:case 35672:return UR;case 35669:case 35673:return LR;case 5125:return OR;case 36294:return PR;case 36295:return IR;case 36296:return BR;case 35678:case 36198:case 36298:case 36306:case 35682:return FR;case 35679:case 36299:case 36307:return kR;case 35680:case 36300:case 36308:case 36293:return HR;case 36289:case 36303:case 36311:case 36292:return GR}}class jR{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.setValue=ER(i.type)}}class XR{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=VR(i.type)}}class WR{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,r){const l=this.seq;for(let u=0,h=l.length;u!==h;++u){const d=l[u];d.setValue(e,i[d.id],r)}}}const pp=/(\w+)(\])?(\[|\.)?/g;function Zy(o,e){o.seq.push(e),o.map[e.id]=e}function YR(o,e,i){const r=o.name,l=r.length;for(pp.lastIndex=0;;){const u=pp.exec(r),h=pp.lastIndex;let d=u[1];const p=u[2]==="]",g=u[3];if(p&&(d=d|0),g===void 0||g==="["&&h+2===l){Zy(i,g===void 0?new jR(d,o,e):new XR(d,o,e));break}else{let m=i.map[d];m===void 0&&(m=new WR(d),Zy(i,m)),i=m}}}class Fu{constructor(e,i){this.seq=[],this.map={};const r=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let l=0;l<r;++l){const u=e.getActiveUniform(i,l),h=e.getUniformLocation(i,u.name);YR(u,h,this)}}setValue(e,i,r,l){const u=this.map[i];u!==void 0&&u.setValue(e,r,l)}setOptional(e,i,r){const l=i[r];l!==void 0&&this.setValue(e,r,l)}static upload(e,i,r,l){for(let u=0,h=i.length;u!==h;++u){const d=i[u],p=r[d.id];p.needsUpdate!==!1&&d.setValue(e,p.value,l)}}static seqWithValue(e,i){const r=[];for(let l=0,u=e.length;l!==u;++l){const h=e[l];h.id in i&&r.push(h)}return r}}function Ky(o,e,i){const r=o.createShader(e);return o.shaderSource(r,i),o.compileShader(r),r}const qR=37297;let ZR=0;function KR(o,e){const i=o.split(`
`),r=[],l=Math.max(e-6,0),u=Math.min(e+6,i.length);for(let h=l;h<u;h++){const d=h+1;r.push(`${d===e?">":" "} ${d}: ${i[h]}`)}return r.join(`
`)}const Qy=new ge;function QR(o){Pe._getMatrix(Qy,Pe.workingColorSpace,o);const e=`mat3( ${Qy.elements.map(i=>i.toFixed(4))} )`;switch(Pe.getTransfer(o)){case Gu:return[e,"LinearTransferOETF"];case Ve:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",o),[e,"LinearTransferOETF"]}}function Jy(o,e,i){const r=o.getShaderParameter(e,o.COMPILE_STATUS),l=o.getShaderInfoLog(e).trim();if(r&&l==="")return"";const u=/ERROR: 0:(\d+)/.exec(l);if(u){const h=parseInt(u[1]);return i.toUpperCase()+`

`+l+`

`+KR(o.getShaderSource(e),h)}else return l}function JR(o,e){const i=QR(e);return[`vec4 ${o}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function $R(o,e){let i;switch(e){case Qb:i="Linear";break;case Jb:i="Reinhard";break;case $b:i="Cineon";break;case tT:i="ACESFilmic";break;case nT:i="AgX";break;case iT:i="Neutral";break;case eT:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),i="Linear"}return"vec3 "+o+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Du=new $;function tC(){Pe.getLuminanceCoefficients(Du);const o=Du.x.toFixed(4),e=Du.y.toFixed(4),i=Du.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${o}, ${e}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function eC(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",o.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wl).join(`
`)}function nC(o){const e=[];for(const i in o){const r=o[i];r!==!1&&e.push("#define "+i+" "+r)}return e.join(`
`)}function iC(o,e){const i={},r=o.getProgramParameter(e,o.ACTIVE_ATTRIBUTES);for(let l=0;l<r;l++){const u=o.getActiveAttrib(e,l),h=u.name;let d=1;u.type===o.FLOAT_MAT2&&(d=2),u.type===o.FLOAT_MAT3&&(d=3),u.type===o.FLOAT_MAT4&&(d=4),i[h]={type:u.type,location:o.getAttribLocation(e,h),locationSize:d}}return i}function wl(o){return o!==""}function $y(o,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tx(o,e){return o.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const aC=/^[ \t]*#include +<([\w\d./]+)>/gm;function sm(o){return o.replace(aC,sC)}const rC=new Map;function sC(o,e){let i=ve[e];if(i===void 0){const r=rC.get(e);if(r!==void 0)i=ve[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return sm(i)}const oC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ex(o){return o.replace(oC,lC)}function lC(o,e,i,r){let l="";for(let u=parseInt(e);u<parseInt(i);u++)l+=r.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return l}function nx(o){let e=`precision ${o.precision} float;
	precision ${o.precision} int;
	precision ${o.precision} sampler2D;
	precision ${o.precision} samplerCube;
	precision ${o.precision} sampler3D;
	precision ${o.precision} sampler2DArray;
	precision ${o.precision} sampler2DShadow;
	precision ${o.precision} samplerCubeShadow;
	precision ${o.precision} sampler2DArrayShadow;
	precision ${o.precision} isampler2D;
	precision ${o.precision} isampler3D;
	precision ${o.precision} isamplerCube;
	precision ${o.precision} isampler2DArray;
	precision ${o.precision} usampler2D;
	precision ${o.precision} usampler3D;
	precision ${o.precision} usamplerCube;
	precision ${o.precision} usampler2DArray;
	`;return o.precision==="highp"?e+=`
#define HIGH_PRECISION`:o.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function cC(o){let e="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===gx?e="SHADOWMAP_TYPE_PCF":o.shadowMapType===Db?e="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===Ra&&(e="SHADOWMAP_TYPE_VSM"),e}function uC(o){let e="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case _o:case vo:e="ENVMAP_TYPE_CUBE";break;case Zu:e="ENVMAP_TYPE_CUBE_UV";break}return e}function fC(o){let e="ENVMAP_MODE_REFLECTION";if(o.envMap)switch(o.envMapMode){case vo:e="ENVMAP_MODE_REFRACTION";break}return e}function hC(o){let e="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case _x:e="ENVMAP_BLENDING_MULTIPLY";break;case Zb:e="ENVMAP_BLENDING_MIX";break;case Kb:e="ENVMAP_BLENDING_ADD";break}return e}function dC(o){const e=o.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:r,maxMip:i}}function pC(o,e,i,r){const l=o.getContext(),u=i.defines;let h=i.vertexShader,d=i.fragmentShader;const p=cC(i),g=uC(i),_=fC(i),m=hC(i),y=dC(i),x=eC(i),b=nC(u),T=l.createProgram();let M,S,G=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(M=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(wl).join(`
`),M.length>0&&(M+=`
`),S=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(wl).join(`
`),S.length>0&&(S+=`
`)):(M=[nx(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+_:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wl).join(`
`),S=[nx(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.envMap?"#define "+_:"",i.envMap?"#define "+m:"",y?"#define CUBEUV_TEXEL_WIDTH "+y.texelWidth:"",y?"#define CUBEUV_TEXEL_HEIGHT "+y.texelHeight:"",y?"#define CUBEUV_MAX_MIP "+y.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==gr?"#define TONE_MAPPING":"",i.toneMapping!==gr?ve.tonemapping_pars_fragment:"",i.toneMapping!==gr?$R("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",ve.colorspace_pars_fragment,JR("linearToOutputTexel",i.outputColorSpace),tC(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(wl).join(`
`)),h=sm(h),h=$y(h,i),h=tx(h,i),d=sm(d),d=$y(d,i),d=tx(d,i),h=ex(h),d=ex(d),i.isRawShaderMaterial!==!0&&(G=`#version 300 es
`,M=[x,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+M,S=["#define varying in",i.glslVersion===ry?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===ry?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+S);const I=G+M+h,z=G+S+d,F=Ky(l,l.VERTEX_SHADER,I),P=Ky(l,l.FRAGMENT_SHADER,z);l.attachShader(T,F),l.attachShader(T,P),i.index0AttributeName!==void 0?l.bindAttribLocation(T,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(T,0,"position"),l.linkProgram(T);function L(k){if(o.debug.checkShaderErrors){const et=l.getProgramInfoLog(T).trim(),tt=l.getShaderInfoLog(F).trim(),ut=l.getShaderInfoLog(P).trim();let ft=!0,X=!0;if(l.getProgramParameter(T,l.LINK_STATUS)===!1)if(ft=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(l,T,F,P);else{const it=Jy(l,F,"vertex"),W=Jy(l,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(T,l.VALIDATE_STATUS)+`

Material Name: `+k.name+`
Material Type: `+k.type+`

Program Info Log: `+et+`
`+it+`
`+W)}else et!==""?console.warn("THREE.WebGLProgram: Program Info Log:",et):(tt===""||ut==="")&&(X=!1);X&&(k.diagnostics={runnable:ft,programLog:et,vertexShader:{log:tt,prefix:M},fragmentShader:{log:ut,prefix:S}})}l.deleteShader(F),l.deleteShader(P),V=new Fu(l,T),C=iC(l,T)}let V;this.getUniforms=function(){return V===void 0&&L(this),V};let C;this.getAttributes=function(){return C===void 0&&L(this),C};let E=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=l.getProgramParameter(T,qR)),E},this.destroy=function(){r.releaseStatesOfProgram(this),l.deleteProgram(T),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=ZR++,this.cacheKey=e,this.usedTimes=1,this.program=T,this.vertexShader=F,this.fragmentShader=P,this}let mC=0;class gC{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const i=e.vertexShader,r=e.fragmentShader,l=this._getShaderStage(i),u=this._getShaderStage(r),h=this._getShaderCacheForMaterial(e);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(u)===!1&&(h.add(u),u.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const r of i)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let r=i.get(e);return r===void 0&&(r=new Set,i.set(e,r)),r}_getShaderStage(e){const i=this.shaderCache;let r=i.get(e);return r===void 0&&(r=new _C(e),i.set(e,r)),r}}class _C{constructor(e){this.id=mC++,this.code=e,this.usedTimes=0}}function vC(o,e,i,r,l,u,h){const d=new zx,p=new gC,g=new Set,_=[],m=l.logarithmicDepthBuffer,y=l.vertexTextures;let x=l.precision;const b={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function T(C){return g.add(C),C===0?"uv":`uv${C}`}function M(C,E,k,et,tt){const ut=et.fog,ft=tt.geometry,X=C.isMeshStandardMaterial?et.environment:null,it=(C.isMeshStandardMaterial?i:e).get(C.envMap||X),W=it&&it.mapping===Zu?it.image.height:null,mt=b[C.type];C.precision!==null&&(x=l.getMaxPrecision(C.precision),x!==C.precision&&console.warn("THREE.WebGLProgram.getParameters:",C.precision,"not supported, using",x,"instead."));const vt=ft.morphAttributes.position||ft.morphAttributes.normal||ft.morphAttributes.color,At=vt!==void 0?vt.length:0;let Xt=0;ft.morphAttributes.position!==void 0&&(Xt=1),ft.morphAttributes.normal!==void 0&&(Xt=2),ft.morphAttributes.color!==void 0&&(Xt=3);let he,R,Y,pt;if(mt){const Ce=ta[mt];he=Ce.vertexShader,R=Ce.fragmentShader}else he=C.vertexShader,R=C.fragmentShader,p.update(C),Y=p.getVertexShaderID(C),pt=p.getFragmentShaderID(C);const ht=o.getRenderTarget(),Ct=o.state.buffers.depth.getReversed(),Ut=tt.isInstancedMesh===!0,bt=tt.isBatchedMesh===!0,Dt=!!C.map,zt=!!C.matcap,se=!!it,H=!!C.aoMap,Ue=!!C.lightMap,ne=!!C.bumpMap,qt=!!C.normalMap,Nt=!!C.displacementMap,Wt=!!C.emissiveMap,Vt=!!C.metalnessMap,O=!!C.roughnessMap,A=C.anisotropy>0,rt=C.clearcoat>0,St=C.dispersion>0,Mt=C.iridescence>0,gt=C.sheen>0,Qt=C.transmission>0,Ft=A&&!!C.anisotropyMap,Ht=rt&&!!C.clearcoatMap,ye=rt&&!!C.clearcoatNormalMap,Rt=rt&&!!C.clearcoatRoughnessMap,Zt=Mt&&!!C.iridescenceMap,ie=Mt&&!!C.iridescenceThicknessMap,re=gt&&!!C.sheenColorMap,jt=gt&&!!C.sheenRoughnessMap,_e=!!C.specularMap,fe=!!C.specularColorMap,dt=!!C.specularIntensityMap,U=Qt&&!!C.transmissionMap,Tt=Qt&&!!C.thicknessMap,st=!!C.gradientMap,xt=!!C.alphaMap,kt=C.alphaTest>0,Ot=!!C.alphaHash,ce=!!C.extensions;let tn=gr;C.toneMapped&&(ht===null||ht.isXRRenderTarget===!0)&&(tn=o.toneMapping);const Sn={shaderID:mt,shaderType:C.type,shaderName:C.name,vertexShader:he,fragmentShader:R,defines:C.defines,customVertexShaderID:Y,customFragmentShaderID:pt,isRawShaderMaterial:C.isRawShaderMaterial===!0,glslVersion:C.glslVersion,precision:x,batching:bt,batchingColor:bt&&tt._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&tt.instanceColor!==null,instancingMorph:Ut&&tt.morphTexture!==null,supportsVertexTextures:y,outputColorSpace:ht===null?o.outputColorSpace:ht.isXRRenderTarget===!0?ht.texture.colorSpace:yo,alphaToCoverage:!!C.alphaToCoverage,map:Dt,matcap:zt,envMap:se,envMapMode:se&&it.mapping,envMapCubeUVHeight:W,aoMap:H,lightMap:Ue,bumpMap:ne,normalMap:qt,displacementMap:y&&Nt,emissiveMap:Wt,normalMapObjectSpace:qt&&C.normalMapType===oT,normalMapTangentSpace:qt&&C.normalMapType===Rx,metalnessMap:Vt,roughnessMap:O,anisotropy:A,anisotropyMap:Ft,clearcoat:rt,clearcoatMap:Ht,clearcoatNormalMap:ye,clearcoatRoughnessMap:Rt,dispersion:St,iridescence:Mt,iridescenceMap:Zt,iridescenceThicknessMap:ie,sheen:gt,sheenColorMap:re,sheenRoughnessMap:jt,specularMap:_e,specularColorMap:fe,specularIntensityMap:dt,transmission:Qt,transmissionMap:U,thicknessMap:Tt,gradientMap:st,opaque:C.transparent===!1&&C.blending===po&&C.alphaToCoverage===!1,alphaMap:xt,alphaTest:kt,alphaHash:Ot,combine:C.combine,mapUv:Dt&&T(C.map.channel),aoMapUv:H&&T(C.aoMap.channel),lightMapUv:Ue&&T(C.lightMap.channel),bumpMapUv:ne&&T(C.bumpMap.channel),normalMapUv:qt&&T(C.normalMap.channel),displacementMapUv:Nt&&T(C.displacementMap.channel),emissiveMapUv:Wt&&T(C.emissiveMap.channel),metalnessMapUv:Vt&&T(C.metalnessMap.channel),roughnessMapUv:O&&T(C.roughnessMap.channel),anisotropyMapUv:Ft&&T(C.anisotropyMap.channel),clearcoatMapUv:Ht&&T(C.clearcoatMap.channel),clearcoatNormalMapUv:ye&&T(C.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Rt&&T(C.clearcoatRoughnessMap.channel),iridescenceMapUv:Zt&&T(C.iridescenceMap.channel),iridescenceThicknessMapUv:ie&&T(C.iridescenceThicknessMap.channel),sheenColorMapUv:re&&T(C.sheenColorMap.channel),sheenRoughnessMapUv:jt&&T(C.sheenRoughnessMap.channel),specularMapUv:_e&&T(C.specularMap.channel),specularColorMapUv:fe&&T(C.specularColorMap.channel),specularIntensityMapUv:dt&&T(C.specularIntensityMap.channel),transmissionMapUv:U&&T(C.transmissionMap.channel),thicknessMapUv:Tt&&T(C.thicknessMap.channel),alphaMapUv:xt&&T(C.alphaMap.channel),vertexTangents:!!ft.attributes.tangent&&(qt||A),vertexColors:C.vertexColors,vertexAlphas:C.vertexColors===!0&&!!ft.attributes.color&&ft.attributes.color.itemSize===4,pointsUvs:tt.isPoints===!0&&!!ft.attributes.uv&&(Dt||xt),fog:!!ut,useFog:C.fog===!0,fogExp2:!!ut&&ut.isFogExp2,flatShading:C.flatShading===!0,sizeAttenuation:C.sizeAttenuation===!0,logarithmicDepthBuffer:m,reverseDepthBuffer:Ct,skinning:tt.isSkinnedMesh===!0,morphTargets:ft.morphAttributes.position!==void 0,morphNormals:ft.morphAttributes.normal!==void 0,morphColors:ft.morphAttributes.color!==void 0,morphTargetsCount:At,morphTextureStride:Xt,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:C.dithering,shadowMapEnabled:o.shadowMap.enabled&&k.length>0,shadowMapType:o.shadowMap.type,toneMapping:tn,decodeVideoTexture:Dt&&C.map.isVideoTexture===!0&&Pe.getTransfer(C.map.colorSpace)===Ve,decodeVideoTextureEmissive:Wt&&C.emissiveMap.isVideoTexture===!0&&Pe.getTransfer(C.emissiveMap.colorSpace)===Ve,premultipliedAlpha:C.premultipliedAlpha,doubleSided:C.side===Ca,flipSided:C.side===ri,useDepthPacking:C.depthPacking>=0,depthPacking:C.depthPacking||0,index0AttributeName:C.index0AttributeName,extensionClipCullDistance:ce&&C.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ce&&C.extensions.multiDraw===!0||bt)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:C.customProgramCacheKey()};return Sn.vertexUv1s=g.has(1),Sn.vertexUv2s=g.has(2),Sn.vertexUv3s=g.has(3),g.clear(),Sn}function S(C){const E=[];if(C.shaderID?E.push(C.shaderID):(E.push(C.customVertexShaderID),E.push(C.customFragmentShaderID)),C.defines!==void 0)for(const k in C.defines)E.push(k),E.push(C.defines[k]);return C.isRawShaderMaterial===!1&&(G(E,C),I(E,C),E.push(o.outputColorSpace)),E.push(C.customProgramCacheKey),E.join()}function G(C,E){C.push(E.precision),C.push(E.outputColorSpace),C.push(E.envMapMode),C.push(E.envMapCubeUVHeight),C.push(E.mapUv),C.push(E.alphaMapUv),C.push(E.lightMapUv),C.push(E.aoMapUv),C.push(E.bumpMapUv),C.push(E.normalMapUv),C.push(E.displacementMapUv),C.push(E.emissiveMapUv),C.push(E.metalnessMapUv),C.push(E.roughnessMapUv),C.push(E.anisotropyMapUv),C.push(E.clearcoatMapUv),C.push(E.clearcoatNormalMapUv),C.push(E.clearcoatRoughnessMapUv),C.push(E.iridescenceMapUv),C.push(E.iridescenceThicknessMapUv),C.push(E.sheenColorMapUv),C.push(E.sheenRoughnessMapUv),C.push(E.specularMapUv),C.push(E.specularColorMapUv),C.push(E.specularIntensityMapUv),C.push(E.transmissionMapUv),C.push(E.thicknessMapUv),C.push(E.combine),C.push(E.fogExp2),C.push(E.sizeAttenuation),C.push(E.morphTargetsCount),C.push(E.morphAttributeCount),C.push(E.numDirLights),C.push(E.numPointLights),C.push(E.numSpotLights),C.push(E.numSpotLightMaps),C.push(E.numHemiLights),C.push(E.numRectAreaLights),C.push(E.numDirLightShadows),C.push(E.numPointLightShadows),C.push(E.numSpotLightShadows),C.push(E.numSpotLightShadowsWithMaps),C.push(E.numLightProbes),C.push(E.shadowMapType),C.push(E.toneMapping),C.push(E.numClippingPlanes),C.push(E.numClipIntersection),C.push(E.depthPacking)}function I(C,E){d.disableAll(),E.supportsVertexTextures&&d.enable(0),E.instancing&&d.enable(1),E.instancingColor&&d.enable(2),E.instancingMorph&&d.enable(3),E.matcap&&d.enable(4),E.envMap&&d.enable(5),E.normalMapObjectSpace&&d.enable(6),E.normalMapTangentSpace&&d.enable(7),E.clearcoat&&d.enable(8),E.iridescence&&d.enable(9),E.alphaTest&&d.enable(10),E.vertexColors&&d.enable(11),E.vertexAlphas&&d.enable(12),E.vertexUv1s&&d.enable(13),E.vertexUv2s&&d.enable(14),E.vertexUv3s&&d.enable(15),E.vertexTangents&&d.enable(16),E.anisotropy&&d.enable(17),E.alphaHash&&d.enable(18),E.batching&&d.enable(19),E.dispersion&&d.enable(20),E.batchingColor&&d.enable(21),C.push(d.mask),d.disableAll(),E.fog&&d.enable(0),E.useFog&&d.enable(1),E.flatShading&&d.enable(2),E.logarithmicDepthBuffer&&d.enable(3),E.reverseDepthBuffer&&d.enable(4),E.skinning&&d.enable(5),E.morphTargets&&d.enable(6),E.morphNormals&&d.enable(7),E.morphColors&&d.enable(8),E.premultipliedAlpha&&d.enable(9),E.shadowMapEnabled&&d.enable(10),E.doubleSided&&d.enable(11),E.flipSided&&d.enable(12),E.useDepthPacking&&d.enable(13),E.dithering&&d.enable(14),E.transmission&&d.enable(15),E.sheen&&d.enable(16),E.opaque&&d.enable(17),E.pointsUvs&&d.enable(18),E.decodeVideoTexture&&d.enable(19),E.decodeVideoTextureEmissive&&d.enable(20),E.alphaToCoverage&&d.enable(21),C.push(d.mask)}function z(C){const E=b[C.type];let k;if(E){const et=ta[E];k=FT.clone(et.uniforms)}else k=C.uniforms;return k}function F(C,E){let k;for(let et=0,tt=_.length;et<tt;et++){const ut=_[et];if(ut.cacheKey===E){k=ut,++k.usedTimes;break}}return k===void 0&&(k=new pC(o,E,C,u),_.push(k)),k}function P(C){if(--C.usedTimes===0){const E=_.indexOf(C);_[E]=_[_.length-1],_.pop(),C.destroy()}}function L(C){p.remove(C)}function V(){p.dispose()}return{getParameters:M,getProgramCacheKey:S,getUniforms:z,acquireProgram:F,releaseProgram:P,releaseShaderCache:L,programs:_,dispose:V}}function yC(){let o=new WeakMap;function e(h){return o.has(h)}function i(h){let d=o.get(h);return d===void 0&&(d={},o.set(h,d)),d}function r(h){o.delete(h)}function l(h,d,p){o.get(h)[d]=p}function u(){o=new WeakMap}return{has:e,get:i,remove:r,update:l,dispose:u}}function xC(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.material.id!==e.material.id?o.material.id-e.material.id:o.z!==e.z?o.z-e.z:o.id-e.id}function ix(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.z!==e.z?e.z-o.z:o.id-e.id}function ax(){const o=[];let e=0;const i=[],r=[],l=[];function u(){e=0,i.length=0,r.length=0,l.length=0}function h(m,y,x,b,T,M){let S=o[e];return S===void 0?(S={id:m.id,object:m,geometry:y,material:x,groupOrder:b,renderOrder:m.renderOrder,z:T,group:M},o[e]=S):(S.id=m.id,S.object=m,S.geometry=y,S.material=x,S.groupOrder=b,S.renderOrder=m.renderOrder,S.z=T,S.group=M),e++,S}function d(m,y,x,b,T,M){const S=h(m,y,x,b,T,M);x.transmission>0?r.push(S):x.transparent===!0?l.push(S):i.push(S)}function p(m,y,x,b,T,M){const S=h(m,y,x,b,T,M);x.transmission>0?r.unshift(S):x.transparent===!0?l.unshift(S):i.unshift(S)}function g(m,y){i.length>1&&i.sort(m||xC),r.length>1&&r.sort(y||ix),l.length>1&&l.sort(y||ix)}function _(){for(let m=e,y=o.length;m<y;m++){const x=o[m];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:i,transmissive:r,transparent:l,init:u,push:d,unshift:p,finish:_,sort:g}}function SC(){let o=new WeakMap;function e(r,l){const u=o.get(r);let h;return u===void 0?(h=new ax,o.set(r,[h])):l>=u.length?(h=new ax,u.push(h)):h=u[l],h}function i(){o=new WeakMap}return{get:e,dispose:i}}function MC(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={direction:new $,color:new Te};break;case"SpotLight":i={position:new $,direction:new $,color:new Te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new $,color:new Te,distance:0,decay:0};break;case"HemisphereLight":i={direction:new $,skyColor:new Te,groundColor:new Te};break;case"RectAreaLight":i={color:new Te,position:new $,halfWidth:new $,halfHeight:new $};break}return o[e.id]=i,i}}}function EC(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[e.id]=i,i}}}let bC=0;function TC(o,e){return(e.castShadow?2:0)-(o.castShadow?2:0)+(e.map?1:0)-(o.map?1:0)}function wC(o){const e=new MC,i=EC(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let g=0;g<9;g++)r.probe.push(new $);const l=new $,u=new Xe,h=new Xe;function d(g){let _=0,m=0,y=0;for(let C=0;C<9;C++)r.probe[C].set(0,0,0);let x=0,b=0,T=0,M=0,S=0,G=0,I=0,z=0,F=0,P=0,L=0;g.sort(TC);for(let C=0,E=g.length;C<E;C++){const k=g[C],et=k.color,tt=k.intensity,ut=k.distance,ft=k.shadow&&k.shadow.map?k.shadow.map.texture:null;if(k.isAmbientLight)_+=et.r*tt,m+=et.g*tt,y+=et.b*tt;else if(k.isLightProbe){for(let X=0;X<9;X++)r.probe[X].addScaledVector(k.sh.coefficients[X],tt);L++}else if(k.isDirectionalLight){const X=e.get(k);if(X.color.copy(k.color).multiplyScalar(k.intensity),k.castShadow){const it=k.shadow,W=i.get(k);W.shadowIntensity=it.intensity,W.shadowBias=it.bias,W.shadowNormalBias=it.normalBias,W.shadowRadius=it.radius,W.shadowMapSize=it.mapSize,r.directionalShadow[x]=W,r.directionalShadowMap[x]=ft,r.directionalShadowMatrix[x]=k.shadow.matrix,G++}r.directional[x]=X,x++}else if(k.isSpotLight){const X=e.get(k);X.position.setFromMatrixPosition(k.matrixWorld),X.color.copy(et).multiplyScalar(tt),X.distance=ut,X.coneCos=Math.cos(k.angle),X.penumbraCos=Math.cos(k.angle*(1-k.penumbra)),X.decay=k.decay,r.spot[T]=X;const it=k.shadow;if(k.map&&(r.spotLightMap[F]=k.map,F++,it.updateMatrices(k),k.castShadow&&P++),r.spotLightMatrix[T]=it.matrix,k.castShadow){const W=i.get(k);W.shadowIntensity=it.intensity,W.shadowBias=it.bias,W.shadowNormalBias=it.normalBias,W.shadowRadius=it.radius,W.shadowMapSize=it.mapSize,r.spotShadow[T]=W,r.spotShadowMap[T]=ft,z++}T++}else if(k.isRectAreaLight){const X=e.get(k);X.color.copy(et).multiplyScalar(tt),X.halfWidth.set(k.width*.5,0,0),X.halfHeight.set(0,k.height*.5,0),r.rectArea[M]=X,M++}else if(k.isPointLight){const X=e.get(k);if(X.color.copy(k.color).multiplyScalar(k.intensity),X.distance=k.distance,X.decay=k.decay,k.castShadow){const it=k.shadow,W=i.get(k);W.shadowIntensity=it.intensity,W.shadowBias=it.bias,W.shadowNormalBias=it.normalBias,W.shadowRadius=it.radius,W.shadowMapSize=it.mapSize,W.shadowCameraNear=it.camera.near,W.shadowCameraFar=it.camera.far,r.pointShadow[b]=W,r.pointShadowMap[b]=ft,r.pointShadowMatrix[b]=k.shadow.matrix,I++}r.point[b]=X,b++}else if(k.isHemisphereLight){const X=e.get(k);X.skyColor.copy(k.color).multiplyScalar(tt),X.groundColor.copy(k.groundColor).multiplyScalar(tt),r.hemi[S]=X,S++}}M>0&&(o.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Gt.LTC_FLOAT_1,r.rectAreaLTC2=Gt.LTC_FLOAT_2):(r.rectAreaLTC1=Gt.LTC_HALF_1,r.rectAreaLTC2=Gt.LTC_HALF_2)),r.ambient[0]=_,r.ambient[1]=m,r.ambient[2]=y;const V=r.hash;(V.directionalLength!==x||V.pointLength!==b||V.spotLength!==T||V.rectAreaLength!==M||V.hemiLength!==S||V.numDirectionalShadows!==G||V.numPointShadows!==I||V.numSpotShadows!==z||V.numSpotMaps!==F||V.numLightProbes!==L)&&(r.directional.length=x,r.spot.length=T,r.rectArea.length=M,r.point.length=b,r.hemi.length=S,r.directionalShadow.length=G,r.directionalShadowMap.length=G,r.pointShadow.length=I,r.pointShadowMap.length=I,r.spotShadow.length=z,r.spotShadowMap.length=z,r.directionalShadowMatrix.length=G,r.pointShadowMatrix.length=I,r.spotLightMatrix.length=z+F-P,r.spotLightMap.length=F,r.numSpotLightShadowsWithMaps=P,r.numLightProbes=L,V.directionalLength=x,V.pointLength=b,V.spotLength=T,V.rectAreaLength=M,V.hemiLength=S,V.numDirectionalShadows=G,V.numPointShadows=I,V.numSpotShadows=z,V.numSpotMaps=F,V.numLightProbes=L,r.version=bC++)}function p(g,_){let m=0,y=0,x=0,b=0,T=0;const M=_.matrixWorldInverse;for(let S=0,G=g.length;S<G;S++){const I=g[S];if(I.isDirectionalLight){const z=r.directional[m];z.direction.setFromMatrixPosition(I.matrixWorld),l.setFromMatrixPosition(I.target.matrixWorld),z.direction.sub(l),z.direction.transformDirection(M),m++}else if(I.isSpotLight){const z=r.spot[x];z.position.setFromMatrixPosition(I.matrixWorld),z.position.applyMatrix4(M),z.direction.setFromMatrixPosition(I.matrixWorld),l.setFromMatrixPosition(I.target.matrixWorld),z.direction.sub(l),z.direction.transformDirection(M),x++}else if(I.isRectAreaLight){const z=r.rectArea[b];z.position.setFromMatrixPosition(I.matrixWorld),z.position.applyMatrix4(M),h.identity(),u.copy(I.matrixWorld),u.premultiply(M),h.extractRotation(u),z.halfWidth.set(I.width*.5,0,0),z.halfHeight.set(0,I.height*.5,0),z.halfWidth.applyMatrix4(h),z.halfHeight.applyMatrix4(h),b++}else if(I.isPointLight){const z=r.point[y];z.position.setFromMatrixPosition(I.matrixWorld),z.position.applyMatrix4(M),y++}else if(I.isHemisphereLight){const z=r.hemi[T];z.direction.setFromMatrixPosition(I.matrixWorld),z.direction.transformDirection(M),T++}}}return{setup:d,setupView:p,state:r}}function rx(o){const e=new wC(o),i=[],r=[];function l(_){g.camera=_,i.length=0,r.length=0}function u(_){i.push(_)}function h(_){r.push(_)}function d(){e.setup(i)}function p(_){e.setupView(i,_)}const g={lightsArray:i,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:l,state:g,setupLights:d,setupLightsView:p,pushLight:u,pushShadow:h}}function AC(o){let e=new WeakMap;function i(l,u=0){const h=e.get(l);let d;return h===void 0?(d=new rx(o),e.set(l,[d])):u>=h.length?(d=new rx(o),h.push(d)):d=h[u],d}function r(){e=new WeakMap}return{get:i,dispose:r}}const RC=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,CC=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function DC(o,e,i){let r=new Sm;const l=new me,u=new me,h=new on,d=new JT({depthPacking:sT}),p=new $T,g={},_=i.maxTextureSize,m={[_r]:ri,[ri]:_r,[Ca]:Ca},y=new yr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new me},radius:{value:4}},vertexShader:RC,fragmentShader:CC}),x=y.clone();x.defines.HORIZONTAL_PASS=1;const b=new Ci;b.setAttribute("position",new Hi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new ai(b,y),M=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gx;let S=this.type;this.render=function(P,L,V){if(M.enabled===!1||M.autoUpdate===!1&&M.needsUpdate===!1||P.length===0)return;const C=o.getRenderTarget(),E=o.getActiveCubeFace(),k=o.getActiveMipmapLevel(),et=o.state;et.setBlending(mr),et.buffers.color.setClear(1,1,1,1),et.buffers.depth.setTest(!0),et.setScissorTest(!1);const tt=S!==Ra&&this.type===Ra,ut=S===Ra&&this.type!==Ra;for(let ft=0,X=P.length;ft<X;ft++){const it=P[ft],W=it.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",it,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;l.copy(W.mapSize);const mt=W.getFrameExtents();if(l.multiply(mt),u.copy(W.mapSize),(l.x>_||l.y>_)&&(l.x>_&&(u.x=Math.floor(_/mt.x),l.x=u.x*mt.x,W.mapSize.x=u.x),l.y>_&&(u.y=Math.floor(_/mt.y),l.y=u.y*mt.y,W.mapSize.y=u.y)),W.map===null||tt===!0||ut===!0){const At=this.type!==Ra?{minFilter:gi,magFilter:gi}:{};W.map!==null&&W.map.dispose(),W.map=new as(l.x,l.y,At),W.map.texture.name=it.name+".shadowMap",W.camera.updateProjectionMatrix()}o.setRenderTarget(W.map),o.clear();const vt=W.getViewportCount();for(let At=0;At<vt;At++){const Xt=W.getViewport(At);h.set(u.x*Xt.x,u.y*Xt.y,u.x*Xt.z,u.y*Xt.w),et.viewport(h),W.updateMatrices(it,At),r=W.getFrustum(),z(L,V,W.camera,it,this.type)}W.isPointLightShadow!==!0&&this.type===Ra&&G(W,V),W.needsUpdate=!1}S=this.type,M.needsUpdate=!1,o.setRenderTarget(C,E,k)};function G(P,L){const V=e.update(T);y.defines.VSM_SAMPLES!==P.blurSamples&&(y.defines.VSM_SAMPLES=P.blurSamples,x.defines.VSM_SAMPLES=P.blurSamples,y.needsUpdate=!0,x.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new as(l.x,l.y)),y.uniforms.shadow_pass.value=P.map.texture,y.uniforms.resolution.value=P.mapSize,y.uniforms.radius.value=P.radius,o.setRenderTarget(P.mapPass),o.clear(),o.renderBufferDirect(L,null,V,y,T,null),x.uniforms.shadow_pass.value=P.mapPass.texture,x.uniforms.resolution.value=P.mapSize,x.uniforms.radius.value=P.radius,o.setRenderTarget(P.map),o.clear(),o.renderBufferDirect(L,null,V,x,T,null)}function I(P,L,V,C){let E=null;const k=V.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(k!==void 0)E=k;else if(E=V.isPointLight===!0?p:d,o.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0){const et=E.uuid,tt=L.uuid;let ut=g[et];ut===void 0&&(ut={},g[et]=ut);let ft=ut[tt];ft===void 0&&(ft=E.clone(),ut[tt]=ft,L.addEventListener("dispose",F)),E=ft}if(E.visible=L.visible,E.wireframe=L.wireframe,C===Ra?E.side=L.shadowSide!==null?L.shadowSide:L.side:E.side=L.shadowSide!==null?L.shadowSide:m[L.side],E.alphaMap=L.alphaMap,E.alphaTest=L.alphaTest,E.map=L.map,E.clipShadows=L.clipShadows,E.clippingPlanes=L.clippingPlanes,E.clipIntersection=L.clipIntersection,E.displacementMap=L.displacementMap,E.displacementScale=L.displacementScale,E.displacementBias=L.displacementBias,E.wireframeLinewidth=L.wireframeLinewidth,E.linewidth=L.linewidth,V.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const et=o.properties.get(E);et.light=V}return E}function z(P,L,V,C,E){if(P.visible===!1)return;if(P.layers.test(L.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&E===Ra)&&(!P.frustumCulled||r.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,P.matrixWorld);const tt=e.update(P),ut=P.material;if(Array.isArray(ut)){const ft=tt.groups;for(let X=0,it=ft.length;X<it;X++){const W=ft[X],mt=ut[W.materialIndex];if(mt&&mt.visible){const vt=I(P,mt,C,E);P.onBeforeShadow(o,P,L,V,tt,vt,W),o.renderBufferDirect(V,null,tt,vt,P,W),P.onAfterShadow(o,P,L,V,tt,vt,W)}}}else if(ut.visible){const ft=I(P,ut,C,E);P.onBeforeShadow(o,P,L,V,tt,ft,null),o.renderBufferDirect(V,null,tt,ft,P,null),P.onAfterShadow(o,P,L,V,tt,ft,null)}}const et=P.children;for(let tt=0,ut=et.length;tt<ut;tt++)z(et[tt],L,V,C,E)}function F(P){P.target.removeEventListener("dispose",F);for(const V in g){const C=g[V],E=P.target.uuid;E in C&&(C[E].dispose(),delete C[E])}}}const NC={[Mp]:Ep,[bp]:Ap,[Tp]:Rp,[go]:wp,[Ep]:Mp,[Ap]:bp,[Rp]:Tp,[wp]:go};function zC(o,e){function i(){let U=!1;const Tt=new on;let st=null;const xt=new on(0,0,0,0);return{setMask:function(kt){st!==kt&&!U&&(o.colorMask(kt,kt,kt,kt),st=kt)},setLocked:function(kt){U=kt},setClear:function(kt,Ot,ce,tn,Sn){Sn===!0&&(kt*=tn,Ot*=tn,ce*=tn),Tt.set(kt,Ot,ce,tn),xt.equals(Tt)===!1&&(o.clearColor(kt,Ot,ce,tn),xt.copy(Tt))},reset:function(){U=!1,st=null,xt.set(-1,0,0,0)}}}function r(){let U=!1,Tt=!1,st=null,xt=null,kt=null;return{setReversed:function(Ot){if(Tt!==Ot){const ce=e.get("EXT_clip_control");Ot?ce.clipControlEXT(ce.LOWER_LEFT_EXT,ce.ZERO_TO_ONE_EXT):ce.clipControlEXT(ce.LOWER_LEFT_EXT,ce.NEGATIVE_ONE_TO_ONE_EXT),Tt=Ot;const tn=kt;kt=null,this.setClear(tn)}},getReversed:function(){return Tt},setTest:function(Ot){Ot?ht(o.DEPTH_TEST):Ct(o.DEPTH_TEST)},setMask:function(Ot){st!==Ot&&!U&&(o.depthMask(Ot),st=Ot)},setFunc:function(Ot){if(Tt&&(Ot=NC[Ot]),xt!==Ot){switch(Ot){case Mp:o.depthFunc(o.NEVER);break;case Ep:o.depthFunc(o.ALWAYS);break;case bp:o.depthFunc(o.LESS);break;case go:o.depthFunc(o.LEQUAL);break;case Tp:o.depthFunc(o.EQUAL);break;case wp:o.depthFunc(o.GEQUAL);break;case Ap:o.depthFunc(o.GREATER);break;case Rp:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}xt=Ot}},setLocked:function(Ot){U=Ot},setClear:function(Ot){kt!==Ot&&(Tt&&(Ot=1-Ot),o.clearDepth(Ot),kt=Ot)},reset:function(){U=!1,st=null,xt=null,kt=null,Tt=!1}}}function l(){let U=!1,Tt=null,st=null,xt=null,kt=null,Ot=null,ce=null,tn=null,Sn=null;return{setTest:function(Ce){U||(Ce?ht(o.STENCIL_TEST):Ct(o.STENCIL_TEST))},setMask:function(Ce){Tt!==Ce&&!U&&(o.stencilMask(Ce),Tt=Ce)},setFunc:function(Ce,Je,Mn){(st!==Ce||xt!==Je||kt!==Mn)&&(o.stencilFunc(Ce,Je,Mn),st=Ce,xt=Je,kt=Mn)},setOp:function(Ce,Je,Mn){(Ot!==Ce||ce!==Je||tn!==Mn)&&(o.stencilOp(Ce,Je,Mn),Ot=Ce,ce=Je,tn=Mn)},setLocked:function(Ce){U=Ce},setClear:function(Ce){Sn!==Ce&&(o.clearStencil(Ce),Sn=Ce)},reset:function(){U=!1,Tt=null,st=null,xt=null,kt=null,Ot=null,ce=null,tn=null,Sn=null}}}const u=new i,h=new r,d=new l,p=new WeakMap,g=new WeakMap;let _={},m={},y=new WeakMap,x=[],b=null,T=!1,M=null,S=null,G=null,I=null,z=null,F=null,P=null,L=new Te(0,0,0),V=0,C=!1,E=null,k=null,et=null,tt=null,ut=null;const ft=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,it=0;const W=o.getParameter(o.VERSION);W.indexOf("WebGL")!==-1?(it=parseFloat(/^WebGL (\d)/.exec(W)[1]),X=it>=1):W.indexOf("OpenGL ES")!==-1&&(it=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),X=it>=2);let mt=null,vt={};const At=o.getParameter(o.SCISSOR_BOX),Xt=o.getParameter(o.VIEWPORT),he=new on().fromArray(At),R=new on().fromArray(Xt);function Y(U,Tt,st,xt){const kt=new Uint8Array(4),Ot=o.createTexture();o.bindTexture(U,Ot),o.texParameteri(U,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(U,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let ce=0;ce<st;ce++)U===o.TEXTURE_3D||U===o.TEXTURE_2D_ARRAY?o.texImage3D(Tt,0,o.RGBA,1,1,xt,0,o.RGBA,o.UNSIGNED_BYTE,kt):o.texImage2D(Tt+ce,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,kt);return Ot}const pt={};pt[o.TEXTURE_2D]=Y(o.TEXTURE_2D,o.TEXTURE_2D,1),pt[o.TEXTURE_CUBE_MAP]=Y(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[o.TEXTURE_2D_ARRAY]=Y(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),pt[o.TEXTURE_3D]=Y(o.TEXTURE_3D,o.TEXTURE_3D,1,1),u.setClear(0,0,0,1),h.setClear(1),d.setClear(0),ht(o.DEPTH_TEST),h.setFunc(go),ne(!1),qt($v),ht(o.CULL_FACE),H(mr);function ht(U){_[U]!==!0&&(o.enable(U),_[U]=!0)}function Ct(U){_[U]!==!1&&(o.disable(U),_[U]=!1)}function Ut(U,Tt){return m[U]!==Tt?(o.bindFramebuffer(U,Tt),m[U]=Tt,U===o.DRAW_FRAMEBUFFER&&(m[o.FRAMEBUFFER]=Tt),U===o.FRAMEBUFFER&&(m[o.DRAW_FRAMEBUFFER]=Tt),!0):!1}function bt(U,Tt){let st=x,xt=!1;if(U){st=y.get(Tt),st===void 0&&(st=[],y.set(Tt,st));const kt=U.textures;if(st.length!==kt.length||st[0]!==o.COLOR_ATTACHMENT0){for(let Ot=0,ce=kt.length;Ot<ce;Ot++)st[Ot]=o.COLOR_ATTACHMENT0+Ot;st.length=kt.length,xt=!0}}else st[0]!==o.BACK&&(st[0]=o.BACK,xt=!0);xt&&o.drawBuffers(st)}function Dt(U){return b!==U?(o.useProgram(U),b=U,!0):!1}const zt={[$r]:o.FUNC_ADD,[zb]:o.FUNC_SUBTRACT,[Ub]:o.FUNC_REVERSE_SUBTRACT};zt[Lb]=o.MIN,zt[Ob]=o.MAX;const se={[Pb]:o.ZERO,[Ib]:o.ONE,[Bb]:o.SRC_COLOR,[xp]:o.SRC_ALPHA,[jb]:o.SRC_ALPHA_SATURATE,[Gb]:o.DST_COLOR,[kb]:o.DST_ALPHA,[Fb]:o.ONE_MINUS_SRC_COLOR,[Sp]:o.ONE_MINUS_SRC_ALPHA,[Vb]:o.ONE_MINUS_DST_COLOR,[Hb]:o.ONE_MINUS_DST_ALPHA,[Xb]:o.CONSTANT_COLOR,[Wb]:o.ONE_MINUS_CONSTANT_COLOR,[Yb]:o.CONSTANT_ALPHA,[qb]:o.ONE_MINUS_CONSTANT_ALPHA};function H(U,Tt,st,xt,kt,Ot,ce,tn,Sn,Ce){if(U===mr){T===!0&&(Ct(o.BLEND),T=!1);return}if(T===!1&&(ht(o.BLEND),T=!0),U!==Nb){if(U!==M||Ce!==C){if((S!==$r||z!==$r)&&(o.blendEquation(o.FUNC_ADD),S=$r,z=$r),Ce)switch(U){case po:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case ty:o.blendFunc(o.ONE,o.ONE);break;case ey:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case ny:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case po:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case ty:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case ey:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case ny:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}G=null,I=null,F=null,P=null,L.set(0,0,0),V=0,M=U,C=Ce}return}kt=kt||Tt,Ot=Ot||st,ce=ce||xt,(Tt!==S||kt!==z)&&(o.blendEquationSeparate(zt[Tt],zt[kt]),S=Tt,z=kt),(st!==G||xt!==I||Ot!==F||ce!==P)&&(o.blendFuncSeparate(se[st],se[xt],se[Ot],se[ce]),G=st,I=xt,F=Ot,P=ce),(tn.equals(L)===!1||Sn!==V)&&(o.blendColor(tn.r,tn.g,tn.b,Sn),L.copy(tn),V=Sn),M=U,C=!1}function Ue(U,Tt){U.side===Ca?Ct(o.CULL_FACE):ht(o.CULL_FACE);let st=U.side===ri;Tt&&(st=!st),ne(st),U.blending===po&&U.transparent===!1?H(mr):H(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),h.setFunc(U.depthFunc),h.setTest(U.depthTest),h.setMask(U.depthWrite),u.setMask(U.colorWrite);const xt=U.stencilWrite;d.setTest(xt),xt&&(d.setMask(U.stencilWriteMask),d.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),d.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Wt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ht(o.SAMPLE_ALPHA_TO_COVERAGE):Ct(o.SAMPLE_ALPHA_TO_COVERAGE)}function ne(U){E!==U&&(U?o.frontFace(o.CW):o.frontFace(o.CCW),E=U)}function qt(U){U!==Rb?(ht(o.CULL_FACE),U!==k&&(U===$v?o.cullFace(o.BACK):U===Cb?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):Ct(o.CULL_FACE),k=U}function Nt(U){U!==et&&(X&&o.lineWidth(U),et=U)}function Wt(U,Tt,st){U?(ht(o.POLYGON_OFFSET_FILL),(tt!==Tt||ut!==st)&&(o.polygonOffset(Tt,st),tt=Tt,ut=st)):Ct(o.POLYGON_OFFSET_FILL)}function Vt(U){U?ht(o.SCISSOR_TEST):Ct(o.SCISSOR_TEST)}function O(U){U===void 0&&(U=o.TEXTURE0+ft-1),mt!==U&&(o.activeTexture(U),mt=U)}function A(U,Tt,st){st===void 0&&(mt===null?st=o.TEXTURE0+ft-1:st=mt);let xt=vt[st];xt===void 0&&(xt={type:void 0,texture:void 0},vt[st]=xt),(xt.type!==U||xt.texture!==Tt)&&(mt!==st&&(o.activeTexture(st),mt=st),o.bindTexture(U,Tt||pt[U]),xt.type=U,xt.texture=Tt)}function rt(){const U=vt[mt];U!==void 0&&U.type!==void 0&&(o.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function St(){try{o.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Mt(){try{o.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function gt(){try{o.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Qt(){try{o.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ft(){try{o.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ht(){try{o.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ye(){try{o.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Rt(){try{o.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Zt(){try{o.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ie(){try{o.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function re(U){he.equals(U)===!1&&(o.scissor(U.x,U.y,U.z,U.w),he.copy(U))}function jt(U){R.equals(U)===!1&&(o.viewport(U.x,U.y,U.z,U.w),R.copy(U))}function _e(U,Tt){let st=g.get(Tt);st===void 0&&(st=new WeakMap,g.set(Tt,st));let xt=st.get(U);xt===void 0&&(xt=o.getUniformBlockIndex(Tt,U.name),st.set(U,xt))}function fe(U,Tt){const xt=g.get(Tt).get(U);p.get(Tt)!==xt&&(o.uniformBlockBinding(Tt,xt,U.__bindingPointIndex),p.set(Tt,xt))}function dt(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),h.setReversed(!1),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),_={},mt=null,vt={},m={},y=new WeakMap,x=[],b=null,T=!1,M=null,S=null,G=null,I=null,z=null,F=null,P=null,L=new Te(0,0,0),V=0,C=!1,E=null,k=null,et=null,tt=null,ut=null,he.set(0,0,o.canvas.width,o.canvas.height),R.set(0,0,o.canvas.width,o.canvas.height),u.reset(),h.reset(),d.reset()}return{buffers:{color:u,depth:h,stencil:d},enable:ht,disable:Ct,bindFramebuffer:Ut,drawBuffers:bt,useProgram:Dt,setBlending:H,setMaterial:Ue,setFlipSided:ne,setCullFace:qt,setLineWidth:Nt,setPolygonOffset:Wt,setScissorTest:Vt,activeTexture:O,bindTexture:A,unbindTexture:rt,compressedTexImage2D:St,compressedTexImage3D:Mt,texImage2D:Zt,texImage3D:ie,updateUBOMapping:_e,uniformBlockBinding:fe,texStorage2D:ye,texStorage3D:Rt,texSubImage2D:gt,texSubImage3D:Qt,compressedTexSubImage2D:Ft,compressedTexSubImage3D:Ht,scissor:re,viewport:jt,reset:dt}}function UC(o,e,i,r,l,u,h){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new me,_=new WeakMap;let m;const y=new WeakMap;let x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(O,A){return x?new OffscreenCanvas(O,A):ju("canvas")}function T(O,A,rt){let St=1;const Mt=Vt(O);if((Mt.width>rt||Mt.height>rt)&&(St=rt/Math.max(Mt.width,Mt.height)),St<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){const gt=Math.floor(St*Mt.width),Qt=Math.floor(St*Mt.height);m===void 0&&(m=b(gt,Qt));const Ft=A?b(gt,Qt):m;return Ft.width=gt,Ft.height=Qt,Ft.getContext("2d").drawImage(O,0,0,gt,Qt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Mt.width+"x"+Mt.height+") to ("+gt+"x"+Qt+")."),Ft}else return"data"in O&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Mt.width+"x"+Mt.height+")."),O;return O}function M(O){return O.generateMipmaps}function S(O){o.generateMipmap(O)}function G(O){return O.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?o.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?o.TEXTURE_2D_ARRAY:o.TEXTURE_2D}function I(O,A,rt,St,Mt=!1){if(O!==null){if(o[O]!==void 0)return o[O];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let gt=A;if(A===o.RED&&(rt===o.FLOAT&&(gt=o.R32F),rt===o.HALF_FLOAT&&(gt=o.R16F),rt===o.UNSIGNED_BYTE&&(gt=o.R8)),A===o.RED_INTEGER&&(rt===o.UNSIGNED_BYTE&&(gt=o.R8UI),rt===o.UNSIGNED_SHORT&&(gt=o.R16UI),rt===o.UNSIGNED_INT&&(gt=o.R32UI),rt===o.BYTE&&(gt=o.R8I),rt===o.SHORT&&(gt=o.R16I),rt===o.INT&&(gt=o.R32I)),A===o.RG&&(rt===o.FLOAT&&(gt=o.RG32F),rt===o.HALF_FLOAT&&(gt=o.RG16F),rt===o.UNSIGNED_BYTE&&(gt=o.RG8)),A===o.RG_INTEGER&&(rt===o.UNSIGNED_BYTE&&(gt=o.RG8UI),rt===o.UNSIGNED_SHORT&&(gt=o.RG16UI),rt===o.UNSIGNED_INT&&(gt=o.RG32UI),rt===o.BYTE&&(gt=o.RG8I),rt===o.SHORT&&(gt=o.RG16I),rt===o.INT&&(gt=o.RG32I)),A===o.RGB_INTEGER&&(rt===o.UNSIGNED_BYTE&&(gt=o.RGB8UI),rt===o.UNSIGNED_SHORT&&(gt=o.RGB16UI),rt===o.UNSIGNED_INT&&(gt=o.RGB32UI),rt===o.BYTE&&(gt=o.RGB8I),rt===o.SHORT&&(gt=o.RGB16I),rt===o.INT&&(gt=o.RGB32I)),A===o.RGBA_INTEGER&&(rt===o.UNSIGNED_BYTE&&(gt=o.RGBA8UI),rt===o.UNSIGNED_SHORT&&(gt=o.RGBA16UI),rt===o.UNSIGNED_INT&&(gt=o.RGBA32UI),rt===o.BYTE&&(gt=o.RGBA8I),rt===o.SHORT&&(gt=o.RGBA16I),rt===o.INT&&(gt=o.RGBA32I)),A===o.RGB&&rt===o.UNSIGNED_INT_5_9_9_9_REV&&(gt=o.RGB9_E5),A===o.RGBA){const Qt=Mt?Gu:Pe.getTransfer(St);rt===o.FLOAT&&(gt=o.RGBA32F),rt===o.HALF_FLOAT&&(gt=o.RGBA16F),rt===o.UNSIGNED_BYTE&&(gt=Qt===Ve?o.SRGB8_ALPHA8:o.RGBA8),rt===o.UNSIGNED_SHORT_4_4_4_4&&(gt=o.RGBA4),rt===o.UNSIGNED_SHORT_5_5_5_1&&(gt=o.RGB5_A1)}return(gt===o.R16F||gt===o.R32F||gt===o.RG16F||gt===o.RG32F||gt===o.RGBA16F||gt===o.RGBA32F)&&e.get("EXT_color_buffer_float"),gt}function z(O,A){let rt;return O?A===null||A===is||A===Nl?rt=o.DEPTH24_STENCIL8:A===na?rt=o.DEPTH32F_STENCIL8:A===Dl&&(rt=o.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===is||A===Nl?rt=o.DEPTH_COMPONENT24:A===na?rt=o.DEPTH_COMPONENT32F:A===Dl&&(rt=o.DEPTH_COMPONENT16),rt}function F(O,A){return M(O)===!0||O.isFramebufferTexture&&O.minFilter!==gi&&O.minFilter!==ea?Math.log2(Math.max(A.width,A.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?A.mipmaps.length:1}function P(O){const A=O.target;A.removeEventListener("dispose",P),V(A),A.isVideoTexture&&_.delete(A)}function L(O){const A=O.target;A.removeEventListener("dispose",L),E(A)}function V(O){const A=r.get(O);if(A.__webglInit===void 0)return;const rt=O.source,St=y.get(rt);if(St){const Mt=St[A.__cacheKey];Mt.usedTimes--,Mt.usedTimes===0&&C(O),Object.keys(St).length===0&&y.delete(rt)}r.remove(O)}function C(O){const A=r.get(O);o.deleteTexture(A.__webglTexture);const rt=O.source,St=y.get(rt);delete St[A.__cacheKey],h.memory.textures--}function E(O){const A=r.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),r.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let St=0;St<6;St++){if(Array.isArray(A.__webglFramebuffer[St]))for(let Mt=0;Mt<A.__webglFramebuffer[St].length;Mt++)o.deleteFramebuffer(A.__webglFramebuffer[St][Mt]);else o.deleteFramebuffer(A.__webglFramebuffer[St]);A.__webglDepthbuffer&&o.deleteRenderbuffer(A.__webglDepthbuffer[St])}else{if(Array.isArray(A.__webglFramebuffer))for(let St=0;St<A.__webglFramebuffer.length;St++)o.deleteFramebuffer(A.__webglFramebuffer[St]);else o.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&o.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&o.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let St=0;St<A.__webglColorRenderbuffer.length;St++)A.__webglColorRenderbuffer[St]&&o.deleteRenderbuffer(A.__webglColorRenderbuffer[St]);A.__webglDepthRenderbuffer&&o.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const rt=O.textures;for(let St=0,Mt=rt.length;St<Mt;St++){const gt=r.get(rt[St]);gt.__webglTexture&&(o.deleteTexture(gt.__webglTexture),h.memory.textures--),r.remove(rt[St])}r.remove(O)}let k=0;function et(){k=0}function tt(){const O=k;return O>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+O+" texture units while this GPU supports only "+l.maxTextures),k+=1,O}function ut(O){const A=[];return A.push(O.wrapS),A.push(O.wrapT),A.push(O.wrapR||0),A.push(O.magFilter),A.push(O.minFilter),A.push(O.anisotropy),A.push(O.internalFormat),A.push(O.format),A.push(O.type),A.push(O.generateMipmaps),A.push(O.premultiplyAlpha),A.push(O.flipY),A.push(O.unpackAlignment),A.push(O.colorSpace),A.join()}function ft(O,A){const rt=r.get(O);if(O.isVideoTexture&&Nt(O),O.isRenderTargetTexture===!1&&O.version>0&&rt.__version!==O.version){const St=O.image;if(St===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(St.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{R(rt,O,A);return}}i.bindTexture(o.TEXTURE_2D,rt.__webglTexture,o.TEXTURE0+A)}function X(O,A){const rt=r.get(O);if(O.version>0&&rt.__version!==O.version){R(rt,O,A);return}i.bindTexture(o.TEXTURE_2D_ARRAY,rt.__webglTexture,o.TEXTURE0+A)}function it(O,A){const rt=r.get(O);if(O.version>0&&rt.__version!==O.version){R(rt,O,A);return}i.bindTexture(o.TEXTURE_3D,rt.__webglTexture,o.TEXTURE0+A)}function W(O,A){const rt=r.get(O);if(O.version>0&&rt.__version!==O.version){Y(rt,O,A);return}i.bindTexture(o.TEXTURE_CUBE_MAP,rt.__webglTexture,o.TEXTURE0+A)}const mt={[Np]:o.REPEAT,[es]:o.CLAMP_TO_EDGE,[zp]:o.MIRRORED_REPEAT},vt={[gi]:o.NEAREST,[aT]:o.NEAREST_MIPMAP_NEAREST,[su]:o.NEAREST_MIPMAP_LINEAR,[ea]:o.LINEAR,[Bd]:o.LINEAR_MIPMAP_NEAREST,[ns]:o.LINEAR_MIPMAP_LINEAR},At={[lT]:o.NEVER,[pT]:o.ALWAYS,[cT]:o.LESS,[Cx]:o.LEQUAL,[uT]:o.EQUAL,[dT]:o.GEQUAL,[fT]:o.GREATER,[hT]:o.NOTEQUAL};function Xt(O,A){if(A.type===na&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===ea||A.magFilter===Bd||A.magFilter===su||A.magFilter===ns||A.minFilter===ea||A.minFilter===Bd||A.minFilter===su||A.minFilter===ns)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),o.texParameteri(O,o.TEXTURE_WRAP_S,mt[A.wrapS]),o.texParameteri(O,o.TEXTURE_WRAP_T,mt[A.wrapT]),(O===o.TEXTURE_3D||O===o.TEXTURE_2D_ARRAY)&&o.texParameteri(O,o.TEXTURE_WRAP_R,mt[A.wrapR]),o.texParameteri(O,o.TEXTURE_MAG_FILTER,vt[A.magFilter]),o.texParameteri(O,o.TEXTURE_MIN_FILTER,vt[A.minFilter]),A.compareFunction&&(o.texParameteri(O,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(O,o.TEXTURE_COMPARE_FUNC,At[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===gi||A.minFilter!==su&&A.minFilter!==ns||A.type===na&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||r.get(A).__currentAnisotropy){const rt=e.get("EXT_texture_filter_anisotropic");o.texParameterf(O,rt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,l.getMaxAnisotropy())),r.get(A).__currentAnisotropy=A.anisotropy}}}function he(O,A){let rt=!1;O.__webglInit===void 0&&(O.__webglInit=!0,A.addEventListener("dispose",P));const St=A.source;let Mt=y.get(St);Mt===void 0&&(Mt={},y.set(St,Mt));const gt=ut(A);if(gt!==O.__cacheKey){Mt[gt]===void 0&&(Mt[gt]={texture:o.createTexture(),usedTimes:0},h.memory.textures++,rt=!0),Mt[gt].usedTimes++;const Qt=Mt[O.__cacheKey];Qt!==void 0&&(Mt[O.__cacheKey].usedTimes--,Qt.usedTimes===0&&C(A)),O.__cacheKey=gt,O.__webglTexture=Mt[gt].texture}return rt}function R(O,A,rt){let St=o.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(St=o.TEXTURE_2D_ARRAY),A.isData3DTexture&&(St=o.TEXTURE_3D);const Mt=he(O,A),gt=A.source;i.bindTexture(St,O.__webglTexture,o.TEXTURE0+rt);const Qt=r.get(gt);if(gt.version!==Qt.__version||Mt===!0){i.activeTexture(o.TEXTURE0+rt);const Ft=Pe.getPrimaries(Pe.workingColorSpace),Ht=A.colorSpace===pr?null:Pe.getPrimaries(A.colorSpace),ye=A.colorSpace===pr||Ft===Ht?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,A.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,A.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);let Rt=T(A.image,!1,l.maxTextureSize);Rt=Wt(A,Rt);const Zt=u.convert(A.format,A.colorSpace),ie=u.convert(A.type);let re=I(A.internalFormat,Zt,ie,A.colorSpace,A.isVideoTexture);Xt(St,A);let jt;const _e=A.mipmaps,fe=A.isVideoTexture!==!0,dt=Qt.__version===void 0||Mt===!0,U=gt.dataReady,Tt=F(A,Rt);if(A.isDepthTexture)re=z(A.format===Ul,A.type),dt&&(fe?i.texStorage2D(o.TEXTURE_2D,1,re,Rt.width,Rt.height):i.texImage2D(o.TEXTURE_2D,0,re,Rt.width,Rt.height,0,Zt,ie,null));else if(A.isDataTexture)if(_e.length>0){fe&&dt&&i.texStorage2D(o.TEXTURE_2D,Tt,re,_e[0].width,_e[0].height);for(let st=0,xt=_e.length;st<xt;st++)jt=_e[st],fe?U&&i.texSubImage2D(o.TEXTURE_2D,st,0,0,jt.width,jt.height,Zt,ie,jt.data):i.texImage2D(o.TEXTURE_2D,st,re,jt.width,jt.height,0,Zt,ie,jt.data);A.generateMipmaps=!1}else fe?(dt&&i.texStorage2D(o.TEXTURE_2D,Tt,re,Rt.width,Rt.height),U&&i.texSubImage2D(o.TEXTURE_2D,0,0,0,Rt.width,Rt.height,Zt,ie,Rt.data)):i.texImage2D(o.TEXTURE_2D,0,re,Rt.width,Rt.height,0,Zt,ie,Rt.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){fe&&dt&&i.texStorage3D(o.TEXTURE_2D_ARRAY,Tt,re,_e[0].width,_e[0].height,Rt.depth);for(let st=0,xt=_e.length;st<xt;st++)if(jt=_e[st],A.format!==ki)if(Zt!==null)if(fe){if(U)if(A.layerUpdates.size>0){const kt=Oy(jt.width,jt.height,A.format,A.type);for(const Ot of A.layerUpdates){const ce=jt.data.subarray(Ot*kt/jt.data.BYTES_PER_ELEMENT,(Ot+1)*kt/jt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,st,0,0,Ot,jt.width,jt.height,1,Zt,ce)}A.clearLayerUpdates()}else i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,st,0,0,0,jt.width,jt.height,Rt.depth,Zt,jt.data)}else i.compressedTexImage3D(o.TEXTURE_2D_ARRAY,st,re,jt.width,jt.height,Rt.depth,0,jt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else fe?U&&i.texSubImage3D(o.TEXTURE_2D_ARRAY,st,0,0,0,jt.width,jt.height,Rt.depth,Zt,ie,jt.data):i.texImage3D(o.TEXTURE_2D_ARRAY,st,re,jt.width,jt.height,Rt.depth,0,Zt,ie,jt.data)}else{fe&&dt&&i.texStorage2D(o.TEXTURE_2D,Tt,re,_e[0].width,_e[0].height);for(let st=0,xt=_e.length;st<xt;st++)jt=_e[st],A.format!==ki?Zt!==null?fe?U&&i.compressedTexSubImage2D(o.TEXTURE_2D,st,0,0,jt.width,jt.height,Zt,jt.data):i.compressedTexImage2D(o.TEXTURE_2D,st,re,jt.width,jt.height,0,jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):fe?U&&i.texSubImage2D(o.TEXTURE_2D,st,0,0,jt.width,jt.height,Zt,ie,jt.data):i.texImage2D(o.TEXTURE_2D,st,re,jt.width,jt.height,0,Zt,ie,jt.data)}else if(A.isDataArrayTexture)if(fe){if(dt&&i.texStorage3D(o.TEXTURE_2D_ARRAY,Tt,re,Rt.width,Rt.height,Rt.depth),U)if(A.layerUpdates.size>0){const st=Oy(Rt.width,Rt.height,A.format,A.type);for(const xt of A.layerUpdates){const kt=Rt.data.subarray(xt*st/Rt.data.BYTES_PER_ELEMENT,(xt+1)*st/Rt.data.BYTES_PER_ELEMENT);i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,xt,Rt.width,Rt.height,1,Zt,ie,kt)}A.clearLayerUpdates()}else i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,Rt.width,Rt.height,Rt.depth,Zt,ie,Rt.data)}else i.texImage3D(o.TEXTURE_2D_ARRAY,0,re,Rt.width,Rt.height,Rt.depth,0,Zt,ie,Rt.data);else if(A.isData3DTexture)fe?(dt&&i.texStorage3D(o.TEXTURE_3D,Tt,re,Rt.width,Rt.height,Rt.depth),U&&i.texSubImage3D(o.TEXTURE_3D,0,0,0,0,Rt.width,Rt.height,Rt.depth,Zt,ie,Rt.data)):i.texImage3D(o.TEXTURE_3D,0,re,Rt.width,Rt.height,Rt.depth,0,Zt,ie,Rt.data);else if(A.isFramebufferTexture){if(dt)if(fe)i.texStorage2D(o.TEXTURE_2D,Tt,re,Rt.width,Rt.height);else{let st=Rt.width,xt=Rt.height;for(let kt=0;kt<Tt;kt++)i.texImage2D(o.TEXTURE_2D,kt,re,st,xt,0,Zt,ie,null),st>>=1,xt>>=1}}else if(_e.length>0){if(fe&&dt){const st=Vt(_e[0]);i.texStorage2D(o.TEXTURE_2D,Tt,re,st.width,st.height)}for(let st=0,xt=_e.length;st<xt;st++)jt=_e[st],fe?U&&i.texSubImage2D(o.TEXTURE_2D,st,0,0,Zt,ie,jt):i.texImage2D(o.TEXTURE_2D,st,re,Zt,ie,jt);A.generateMipmaps=!1}else if(fe){if(dt){const st=Vt(Rt);i.texStorage2D(o.TEXTURE_2D,Tt,re,st.width,st.height)}U&&i.texSubImage2D(o.TEXTURE_2D,0,0,0,Zt,ie,Rt)}else i.texImage2D(o.TEXTURE_2D,0,re,Zt,ie,Rt);M(A)&&S(St),Qt.__version=gt.version,A.onUpdate&&A.onUpdate(A)}O.__version=A.version}function Y(O,A,rt){if(A.image.length!==6)return;const St=he(O,A),Mt=A.source;i.bindTexture(o.TEXTURE_CUBE_MAP,O.__webglTexture,o.TEXTURE0+rt);const gt=r.get(Mt);if(Mt.version!==gt.__version||St===!0){i.activeTexture(o.TEXTURE0+rt);const Qt=Pe.getPrimaries(Pe.workingColorSpace),Ft=A.colorSpace===pr?null:Pe.getPrimaries(A.colorSpace),Ht=A.colorSpace===pr||Qt===Ft?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,A.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,A.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);const ye=A.isCompressedTexture||A.image[0].isCompressedTexture,Rt=A.image[0]&&A.image[0].isDataTexture,Zt=[];for(let xt=0;xt<6;xt++)!ye&&!Rt?Zt[xt]=T(A.image[xt],!0,l.maxCubemapSize):Zt[xt]=Rt?A.image[xt].image:A.image[xt],Zt[xt]=Wt(A,Zt[xt]);const ie=Zt[0],re=u.convert(A.format,A.colorSpace),jt=u.convert(A.type),_e=I(A.internalFormat,re,jt,A.colorSpace),fe=A.isVideoTexture!==!0,dt=gt.__version===void 0||St===!0,U=Mt.dataReady;let Tt=F(A,ie);Xt(o.TEXTURE_CUBE_MAP,A);let st;if(ye){fe&&dt&&i.texStorage2D(o.TEXTURE_CUBE_MAP,Tt,_e,ie.width,ie.height);for(let xt=0;xt<6;xt++){st=Zt[xt].mipmaps;for(let kt=0;kt<st.length;kt++){const Ot=st[kt];A.format!==ki?re!==null?fe?U&&i.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,kt,0,0,Ot.width,Ot.height,re,Ot.data):i.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,kt,_e,Ot.width,Ot.height,0,Ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):fe?U&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,kt,0,0,Ot.width,Ot.height,re,jt,Ot.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,kt,_e,Ot.width,Ot.height,0,re,jt,Ot.data)}}}else{if(st=A.mipmaps,fe&&dt){st.length>0&&Tt++;const xt=Vt(Zt[0]);i.texStorage2D(o.TEXTURE_CUBE_MAP,Tt,_e,xt.width,xt.height)}for(let xt=0;xt<6;xt++)if(Rt){fe?U&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,Zt[xt].width,Zt[xt].height,re,jt,Zt[xt].data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,_e,Zt[xt].width,Zt[xt].height,0,re,jt,Zt[xt].data);for(let kt=0;kt<st.length;kt++){const ce=st[kt].image[xt].image;fe?U&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,kt+1,0,0,ce.width,ce.height,re,jt,ce.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,kt+1,_e,ce.width,ce.height,0,re,jt,ce.data)}}else{fe?U&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,re,jt,Zt[xt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,_e,re,jt,Zt[xt]);for(let kt=0;kt<st.length;kt++){const Ot=st[kt];fe?U&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,kt+1,0,0,re,jt,Ot.image[xt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+xt,kt+1,_e,re,jt,Ot.image[xt])}}}M(A)&&S(o.TEXTURE_CUBE_MAP),gt.__version=Mt.version,A.onUpdate&&A.onUpdate(A)}O.__version=A.version}function pt(O,A,rt,St,Mt,gt){const Qt=u.convert(rt.format,rt.colorSpace),Ft=u.convert(rt.type),Ht=I(rt.internalFormat,Qt,Ft,rt.colorSpace),ye=r.get(A),Rt=r.get(rt);if(Rt.__renderTarget=A,!ye.__hasExternalTextures){const Zt=Math.max(1,A.width>>gt),ie=Math.max(1,A.height>>gt);Mt===o.TEXTURE_3D||Mt===o.TEXTURE_2D_ARRAY?i.texImage3D(Mt,gt,Ht,Zt,ie,A.depth,0,Qt,Ft,null):i.texImage2D(Mt,gt,Ht,Zt,ie,0,Qt,Ft,null)}i.bindFramebuffer(o.FRAMEBUFFER,O),qt(A)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,St,Mt,Rt.__webglTexture,0,ne(A)):(Mt===o.TEXTURE_2D||Mt>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&Mt<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,St,Mt,Rt.__webglTexture,gt),i.bindFramebuffer(o.FRAMEBUFFER,null)}function ht(O,A,rt){if(o.bindRenderbuffer(o.RENDERBUFFER,O),A.depthBuffer){const St=A.depthTexture,Mt=St&&St.isDepthTexture?St.type:null,gt=z(A.stencilBuffer,Mt),Qt=A.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Ft=ne(A);qt(A)?d.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,Ft,gt,A.width,A.height):rt?o.renderbufferStorageMultisample(o.RENDERBUFFER,Ft,gt,A.width,A.height):o.renderbufferStorage(o.RENDERBUFFER,gt,A.width,A.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,Qt,o.RENDERBUFFER,O)}else{const St=A.textures;for(let Mt=0;Mt<St.length;Mt++){const gt=St[Mt],Qt=u.convert(gt.format,gt.colorSpace),Ft=u.convert(gt.type),Ht=I(gt.internalFormat,Qt,Ft,gt.colorSpace),ye=ne(A);rt&&qt(A)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,ye,Ht,A.width,A.height):qt(A)?d.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,ye,Ht,A.width,A.height):o.renderbufferStorage(o.RENDERBUFFER,Ht,A.width,A.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function Ct(O,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(o.FRAMEBUFFER,O),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const St=r.get(A.depthTexture);St.__renderTarget=A,(!St.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),ft(A.depthTexture,0);const Mt=St.__webglTexture,gt=ne(A);if(A.depthTexture.format===zl)qt(A)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Mt,0,gt):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Mt,0);else if(A.depthTexture.format===Ul)qt(A)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Mt,0,gt):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Mt,0);else throw new Error("Unknown depthTexture format")}function Ut(O){const A=r.get(O),rt=O.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==O.depthTexture){const St=O.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),St){const Mt=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,St.removeEventListener("dispose",Mt)};St.addEventListener("dispose",Mt),A.__depthDisposeCallback=Mt}A.__boundDepthTexture=St}if(O.depthTexture&&!A.__autoAllocateDepthBuffer){if(rt)throw new Error("target.depthTexture not supported in Cube render targets");Ct(A.__webglFramebuffer,O)}else if(rt){A.__webglDepthbuffer=[];for(let St=0;St<6;St++)if(i.bindFramebuffer(o.FRAMEBUFFER,A.__webglFramebuffer[St]),A.__webglDepthbuffer[St]===void 0)A.__webglDepthbuffer[St]=o.createRenderbuffer(),ht(A.__webglDepthbuffer[St],O,!1);else{const Mt=O.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,gt=A.__webglDepthbuffer[St];o.bindRenderbuffer(o.RENDERBUFFER,gt),o.framebufferRenderbuffer(o.FRAMEBUFFER,Mt,o.RENDERBUFFER,gt)}}else if(i.bindFramebuffer(o.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=o.createRenderbuffer(),ht(A.__webglDepthbuffer,O,!1);else{const St=O.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Mt=A.__webglDepthbuffer;o.bindRenderbuffer(o.RENDERBUFFER,Mt),o.framebufferRenderbuffer(o.FRAMEBUFFER,St,o.RENDERBUFFER,Mt)}i.bindFramebuffer(o.FRAMEBUFFER,null)}function bt(O,A,rt){const St=r.get(O);A!==void 0&&pt(St.__webglFramebuffer,O,O.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),rt!==void 0&&Ut(O)}function Dt(O){const A=O.texture,rt=r.get(O),St=r.get(A);O.addEventListener("dispose",L);const Mt=O.textures,gt=O.isWebGLCubeRenderTarget===!0,Qt=Mt.length>1;if(Qt||(St.__webglTexture===void 0&&(St.__webglTexture=o.createTexture()),St.__version=A.version,h.memory.textures++),gt){rt.__webglFramebuffer=[];for(let Ft=0;Ft<6;Ft++)if(A.mipmaps&&A.mipmaps.length>0){rt.__webglFramebuffer[Ft]=[];for(let Ht=0;Ht<A.mipmaps.length;Ht++)rt.__webglFramebuffer[Ft][Ht]=o.createFramebuffer()}else rt.__webglFramebuffer[Ft]=o.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){rt.__webglFramebuffer=[];for(let Ft=0;Ft<A.mipmaps.length;Ft++)rt.__webglFramebuffer[Ft]=o.createFramebuffer()}else rt.__webglFramebuffer=o.createFramebuffer();if(Qt)for(let Ft=0,Ht=Mt.length;Ft<Ht;Ft++){const ye=r.get(Mt[Ft]);ye.__webglTexture===void 0&&(ye.__webglTexture=o.createTexture(),h.memory.textures++)}if(O.samples>0&&qt(O)===!1){rt.__webglMultisampledFramebuffer=o.createFramebuffer(),rt.__webglColorRenderbuffer=[],i.bindFramebuffer(o.FRAMEBUFFER,rt.__webglMultisampledFramebuffer);for(let Ft=0;Ft<Mt.length;Ft++){const Ht=Mt[Ft];rt.__webglColorRenderbuffer[Ft]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,rt.__webglColorRenderbuffer[Ft]);const ye=u.convert(Ht.format,Ht.colorSpace),Rt=u.convert(Ht.type),Zt=I(Ht.internalFormat,ye,Rt,Ht.colorSpace,O.isXRRenderTarget===!0),ie=ne(O);o.renderbufferStorageMultisample(o.RENDERBUFFER,ie,Zt,O.width,O.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ft,o.RENDERBUFFER,rt.__webglColorRenderbuffer[Ft])}o.bindRenderbuffer(o.RENDERBUFFER,null),O.depthBuffer&&(rt.__webglDepthRenderbuffer=o.createRenderbuffer(),ht(rt.__webglDepthRenderbuffer,O,!0)),i.bindFramebuffer(o.FRAMEBUFFER,null)}}if(gt){i.bindTexture(o.TEXTURE_CUBE_MAP,St.__webglTexture),Xt(o.TEXTURE_CUBE_MAP,A);for(let Ft=0;Ft<6;Ft++)if(A.mipmaps&&A.mipmaps.length>0)for(let Ht=0;Ht<A.mipmaps.length;Ht++)pt(rt.__webglFramebuffer[Ft][Ht],O,A,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Ft,Ht);else pt(rt.__webglFramebuffer[Ft],O,A,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Ft,0);M(A)&&S(o.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Qt){for(let Ft=0,Ht=Mt.length;Ft<Ht;Ft++){const ye=Mt[Ft],Rt=r.get(ye);i.bindTexture(o.TEXTURE_2D,Rt.__webglTexture),Xt(o.TEXTURE_2D,ye),pt(rt.__webglFramebuffer,O,ye,o.COLOR_ATTACHMENT0+Ft,o.TEXTURE_2D,0),M(ye)&&S(o.TEXTURE_2D)}i.unbindTexture()}else{let Ft=o.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(Ft=O.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),i.bindTexture(Ft,St.__webglTexture),Xt(Ft,A),A.mipmaps&&A.mipmaps.length>0)for(let Ht=0;Ht<A.mipmaps.length;Ht++)pt(rt.__webglFramebuffer[Ht],O,A,o.COLOR_ATTACHMENT0,Ft,Ht);else pt(rt.__webglFramebuffer,O,A,o.COLOR_ATTACHMENT0,Ft,0);M(A)&&S(Ft),i.unbindTexture()}O.depthBuffer&&Ut(O)}function zt(O){const A=O.textures;for(let rt=0,St=A.length;rt<St;rt++){const Mt=A[rt];if(M(Mt)){const gt=G(O),Qt=r.get(Mt).__webglTexture;i.bindTexture(gt,Qt),S(gt),i.unbindTexture()}}}const se=[],H=[];function Ue(O){if(O.samples>0){if(qt(O)===!1){const A=O.textures,rt=O.width,St=O.height;let Mt=o.COLOR_BUFFER_BIT;const gt=O.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Qt=r.get(O),Ft=A.length>1;if(Ft)for(let Ht=0;Ht<A.length;Ht++)i.bindFramebuffer(o.FRAMEBUFFER,Qt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ht,o.RENDERBUFFER,null),i.bindFramebuffer(o.FRAMEBUFFER,Qt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ht,o.TEXTURE_2D,null,0);i.bindFramebuffer(o.READ_FRAMEBUFFER,Qt.__webglMultisampledFramebuffer),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Qt.__webglFramebuffer);for(let Ht=0;Ht<A.length;Ht++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(Mt|=o.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(Mt|=o.STENCIL_BUFFER_BIT)),Ft){o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,Qt.__webglColorRenderbuffer[Ht]);const ye=r.get(A[Ht]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,ye,0)}o.blitFramebuffer(0,0,rt,St,0,0,rt,St,Mt,o.NEAREST),p===!0&&(se.length=0,H.length=0,se.push(o.COLOR_ATTACHMENT0+Ht),O.depthBuffer&&O.resolveDepthBuffer===!1&&(se.push(gt),H.push(gt),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,H)),o.invalidateFramebuffer(o.READ_FRAMEBUFFER,se))}if(i.bindFramebuffer(o.READ_FRAMEBUFFER,null),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),Ft)for(let Ht=0;Ht<A.length;Ht++){i.bindFramebuffer(o.FRAMEBUFFER,Qt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ht,o.RENDERBUFFER,Qt.__webglColorRenderbuffer[Ht]);const ye=r.get(A[Ht]).__webglTexture;i.bindFramebuffer(o.FRAMEBUFFER,Qt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ht,o.TEXTURE_2D,ye,0)}i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Qt.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.resolveDepthBuffer===!1&&p){const A=O.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT;o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[A])}}}function ne(O){return Math.min(l.maxSamples,O.samples)}function qt(O){const A=r.get(O);return O.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Nt(O){const A=h.render.frame;_.get(O)!==A&&(_.set(O,A),O.update())}function Wt(O,A){const rt=O.colorSpace,St=O.format,Mt=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||rt!==yo&&rt!==pr&&(Pe.getTransfer(rt)===Ve?(St!==ki||Mt!==za)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",rt)),A}function Vt(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(g.width=O.naturalWidth||O.width,g.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(g.width=O.displayWidth,g.height=O.displayHeight):(g.width=O.width,g.height=O.height),g}this.allocateTextureUnit=tt,this.resetTextureUnits=et,this.setTexture2D=ft,this.setTexture2DArray=X,this.setTexture3D=it,this.setTextureCube=W,this.rebindTextures=bt,this.setupRenderTarget=Dt,this.updateRenderTargetMipmap=zt,this.updateMultisampleRenderTarget=Ue,this.setupDepthRenderbuffer=Ut,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=qt}function LC(o,e){function i(r,l=pr){let u;const h=Pe.getTransfer(l);if(r===za)return o.UNSIGNED_BYTE;if(r===dm)return o.UNSIGNED_SHORT_4_4_4_4;if(r===pm)return o.UNSIGNED_SHORT_5_5_5_1;if(r===Sx)return o.UNSIGNED_INT_5_9_9_9_REV;if(r===yx)return o.BYTE;if(r===xx)return o.SHORT;if(r===Dl)return o.UNSIGNED_SHORT;if(r===hm)return o.INT;if(r===is)return o.UNSIGNED_INT;if(r===na)return o.FLOAT;if(r===Ll)return o.HALF_FLOAT;if(r===Mx)return o.ALPHA;if(r===Ex)return o.RGB;if(r===ki)return o.RGBA;if(r===bx)return o.LUMINANCE;if(r===Tx)return o.LUMINANCE_ALPHA;if(r===zl)return o.DEPTH_COMPONENT;if(r===Ul)return o.DEPTH_STENCIL;if(r===mm)return o.RED;if(r===gm)return o.RED_INTEGER;if(r===wx)return o.RG;if(r===_m)return o.RG_INTEGER;if(r===vm)return o.RGBA_INTEGER;if(r===zu||r===Uu||r===Lu||r===Ou)if(h===Ve)if(u=e.get("WEBGL_compressed_texture_s3tc_srgb"),u!==null){if(r===zu)return u.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Uu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Lu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Ou)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(u=e.get("WEBGL_compressed_texture_s3tc"),u!==null){if(r===zu)return u.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Uu)return u.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Lu)return u.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Ou)return u.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Up||r===Lp||r===Op||r===Pp)if(u=e.get("WEBGL_compressed_texture_pvrtc"),u!==null){if(r===Up)return u.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Lp)return u.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Op)return u.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Pp)return u.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Ip||r===Bp||r===Fp)if(u=e.get("WEBGL_compressed_texture_etc"),u!==null){if(r===Ip||r===Bp)return h===Ve?u.COMPRESSED_SRGB8_ETC2:u.COMPRESSED_RGB8_ETC2;if(r===Fp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:u.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===kp||r===Hp||r===Gp||r===Vp||r===jp||r===Xp||r===Wp||r===Yp||r===qp||r===Zp||r===Kp||r===Qp||r===Jp||r===$p)if(u=e.get("WEBGL_compressed_texture_astc"),u!==null){if(r===kp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:u.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Hp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:u.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Gp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:u.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Vp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:u.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===jp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:u.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Xp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:u.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Wp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:u.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Yp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:u.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===qp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:u.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Zp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:u.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Kp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:u.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Qp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:u.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Jp)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:u.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===$p)return h===Ve?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:u.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Pu||r===tm||r===em)if(u=e.get("EXT_texture_compression_bptc"),u!==null){if(r===Pu)return h===Ve?u.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:u.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===tm)return u.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===em)return u.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Ax||r===nm||r===im||r===am)if(u=e.get("EXT_texture_compression_rgtc"),u!==null){if(r===Pu)return u.COMPRESSED_RED_RGTC1_EXT;if(r===nm)return u.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===im)return u.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===am)return u.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Nl?o.UNSIGNED_INT_24_8:o[r]!==void 0?o[r]:null}return{convert:i}}const OC=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,PC=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class IC{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i,r){if(this.texture===null){const l=new Zn,u=e.properties.get(l);u.__webglTexture=i.texture,(i.depthNear!==r.depthNear||i.depthFar!==r.depthFar)&&(this.depthNear=i.depthNear,this.depthFar=i.depthFar),this.texture=l}}getMesh(e){if(this.texture!==null&&this.mesh===null){const i=e.cameras[0].viewport,r=new yr({vertexShader:OC,fragmentShader:PC,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new ai(new Ju(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class BC extends ss{constructor(e,i){super();const r=this;let l=null,u=1,h=null,d="local-floor",p=1,g=null,_=null,m=null,y=null,x=null,b=null;const T=new IC,M=i.getContextAttributes();let S=null,G=null;const I=[],z=[],F=new me;let P=null;const L=new Ri;L.viewport=new on;const V=new Ri;V.viewport=new on;const C=[L,V],E=new i1;let k=null,et=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(R){let Y=I[R];return Y===void 0&&(Y=new rp,I[R]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(R){let Y=I[R];return Y===void 0&&(Y=new rp,I[R]=Y),Y.getGripSpace()},this.getHand=function(R){let Y=I[R];return Y===void 0&&(Y=new rp,I[R]=Y),Y.getHandSpace()};function tt(R){const Y=z.indexOf(R.inputSource);if(Y===-1)return;const pt=I[Y];pt!==void 0&&(pt.update(R.inputSource,R.frame,g||h),pt.dispatchEvent({type:R.type,data:R.inputSource}))}function ut(){l.removeEventListener("select",tt),l.removeEventListener("selectstart",tt),l.removeEventListener("selectend",tt),l.removeEventListener("squeeze",tt),l.removeEventListener("squeezestart",tt),l.removeEventListener("squeezeend",tt),l.removeEventListener("end",ut),l.removeEventListener("inputsourceschange",ft);for(let R=0;R<I.length;R++){const Y=z[R];Y!==null&&(z[R]=null,I[R].disconnect(Y))}k=null,et=null,T.reset(),e.setRenderTarget(S),x=null,y=null,m=null,l=null,G=null,he.stop(),r.isPresenting=!1,e.setPixelRatio(P),e.setSize(F.width,F.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(R){u=R,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(R){d=R,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return g||h},this.setReferenceSpace=function(R){g=R},this.getBaseLayer=function(){return y!==null?y:x},this.getBinding=function(){return m},this.getFrame=function(){return b},this.getSession=function(){return l},this.setSession=async function(R){if(l=R,l!==null){if(S=e.getRenderTarget(),l.addEventListener("select",tt),l.addEventListener("selectstart",tt),l.addEventListener("selectend",tt),l.addEventListener("squeeze",tt),l.addEventListener("squeezestart",tt),l.addEventListener("squeezeend",tt),l.addEventListener("end",ut),l.addEventListener("inputsourceschange",ft),M.xrCompatible!==!0&&await i.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(F),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let pt=null,ht=null,Ct=null;M.depth&&(Ct=M.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,pt=M.stencil?Ul:zl,ht=M.stencil?Nl:is);const Ut={colorFormat:i.RGBA8,depthFormat:Ct,scaleFactor:u};m=new XRWebGLBinding(l,i),y=m.createProjectionLayer(Ut),l.updateRenderState({layers:[y]}),e.setPixelRatio(1),e.setSize(y.textureWidth,y.textureHeight,!1),G=new as(y.textureWidth,y.textureHeight,{format:ki,type:za,depthTexture:new kx(y.textureWidth,y.textureHeight,ht,void 0,void 0,void 0,void 0,void 0,void 0,pt),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1})}else{const pt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:u};x=new XRWebGLLayer(l,i,pt),l.updateRenderState({baseLayer:x}),e.setPixelRatio(1),e.setSize(x.framebufferWidth,x.framebufferHeight,!1),G=new as(x.framebufferWidth,x.framebufferHeight,{format:ki,type:za,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1})}G.isXRRenderTarget=!0,this.setFoveation(p),g=null,h=await l.requestReferenceSpace(d),he.setContext(l),he.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return T.getDepthTexture()};function ft(R){for(let Y=0;Y<R.removed.length;Y++){const pt=R.removed[Y],ht=z.indexOf(pt);ht>=0&&(z[ht]=null,I[ht].disconnect(pt))}for(let Y=0;Y<R.added.length;Y++){const pt=R.added[Y];let ht=z.indexOf(pt);if(ht===-1){for(let Ut=0;Ut<I.length;Ut++)if(Ut>=z.length){z.push(pt),ht=Ut;break}else if(z[Ut]===null){z[Ut]=pt,ht=Ut;break}if(ht===-1)break}const Ct=I[ht];Ct&&Ct.connect(pt)}}const X=new $,it=new $;function W(R,Y,pt){X.setFromMatrixPosition(Y.matrixWorld),it.setFromMatrixPosition(pt.matrixWorld);const ht=X.distanceTo(it),Ct=Y.projectionMatrix.elements,Ut=pt.projectionMatrix.elements,bt=Ct[14]/(Ct[10]-1),Dt=Ct[14]/(Ct[10]+1),zt=(Ct[9]+1)/Ct[5],se=(Ct[9]-1)/Ct[5],H=(Ct[8]-1)/Ct[0],Ue=(Ut[8]+1)/Ut[0],ne=bt*H,qt=bt*Ue,Nt=ht/(-H+Ue),Wt=Nt*-H;if(Y.matrixWorld.decompose(R.position,R.quaternion,R.scale),R.translateX(Wt),R.translateZ(Nt),R.matrixWorld.compose(R.position,R.quaternion,R.scale),R.matrixWorldInverse.copy(R.matrixWorld).invert(),Ct[10]===-1)R.projectionMatrix.copy(Y.projectionMatrix),R.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const Vt=bt+Nt,O=Dt+Nt,A=ne-Wt,rt=qt+(ht-Wt),St=zt*Dt/O*Vt,Mt=se*Dt/O*Vt;R.projectionMatrix.makePerspective(A,rt,St,Mt,Vt,O),R.projectionMatrixInverse.copy(R.projectionMatrix).invert()}}function mt(R,Y){Y===null?R.matrixWorld.copy(R.matrix):R.matrixWorld.multiplyMatrices(Y.matrixWorld,R.matrix),R.matrixWorldInverse.copy(R.matrixWorld).invert()}this.updateCamera=function(R){if(l===null)return;let Y=R.near,pt=R.far;T.texture!==null&&(T.depthNear>0&&(Y=T.depthNear),T.depthFar>0&&(pt=T.depthFar)),E.near=V.near=L.near=Y,E.far=V.far=L.far=pt,(k!==E.near||et!==E.far)&&(l.updateRenderState({depthNear:E.near,depthFar:E.far}),k=E.near,et=E.far),L.layers.mask=R.layers.mask|2,V.layers.mask=R.layers.mask|4,E.layers.mask=L.layers.mask|V.layers.mask;const ht=R.parent,Ct=E.cameras;mt(E,ht);for(let Ut=0;Ut<Ct.length;Ut++)mt(Ct[Ut],ht);Ct.length===2?W(E,L,V):E.projectionMatrix.copy(L.projectionMatrix),vt(R,E,ht)};function vt(R,Y,pt){pt===null?R.matrix.copy(Y.matrixWorld):(R.matrix.copy(pt.matrixWorld),R.matrix.invert(),R.matrix.multiply(Y.matrixWorld)),R.matrix.decompose(R.position,R.quaternion,R.scale),R.updateMatrixWorld(!0),R.projectionMatrix.copy(Y.projectionMatrix),R.projectionMatrixInverse.copy(Y.projectionMatrixInverse),R.isPerspectiveCamera&&(R.fov=rm*2*Math.atan(1/R.projectionMatrix.elements[5]),R.zoom=1)}this.getCamera=function(){return E},this.getFoveation=function(){if(!(y===null&&x===null))return p},this.setFoveation=function(R){p=R,y!==null&&(y.fixedFoveation=R),x!==null&&x.fixedFoveation!==void 0&&(x.fixedFoveation=R)},this.hasDepthSensing=function(){return T.texture!==null},this.getDepthSensingMesh=function(){return T.getMesh(E)};let At=null;function Xt(R,Y){if(_=Y.getViewerPose(g||h),b=Y,_!==null){const pt=_.views;x!==null&&(e.setRenderTargetFramebuffer(G,x.framebuffer),e.setRenderTarget(G));let ht=!1;pt.length!==E.cameras.length&&(E.cameras.length=0,ht=!0);for(let bt=0;bt<pt.length;bt++){const Dt=pt[bt];let zt=null;if(x!==null)zt=x.getViewport(Dt);else{const H=m.getViewSubImage(y,Dt);zt=H.viewport,bt===0&&(e.setRenderTargetTextures(G,H.colorTexture,H.depthStencilTexture),e.setRenderTarget(G))}let se=C[bt];se===void 0&&(se=new Ri,se.layers.enable(bt),se.viewport=new on,C[bt]=se),se.matrix.fromArray(Dt.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(Dt.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(zt.x,zt.y,zt.width,zt.height),bt===0&&(E.matrix.copy(se.matrix),E.matrix.decompose(E.position,E.quaternion,E.scale)),ht===!0&&E.cameras.push(se)}const Ct=l.enabledFeatures;if(Ct&&Ct.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&m){const bt=m.getDepthInformation(pt[0]);bt&&bt.isValid&&bt.texture&&T.init(e,bt,l.renderState)}}for(let pt=0;pt<I.length;pt++){const ht=z[pt],Ct=I[pt];ht!==null&&Ct!==void 0&&Ct.update(ht,Y,g||h)}At&&At(R,Y),Y.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:Y}),b=null}const he=new Vx;he.setAnimationLoop(Xt),this.setAnimationLoop=function(R){At=R},this.dispose=function(){}}}const Zr=new aa,FC=new Xe;function kC(o,e){function i(M,S){M.matrixAutoUpdate===!0&&M.updateMatrix(),S.value.copy(M.matrix)}function r(M,S){S.color.getRGB(M.fogColor.value,Ix(o)),S.isFog?(M.fogNear.value=S.near,M.fogFar.value=S.far):S.isFogExp2&&(M.fogDensity.value=S.density)}function l(M,S,G,I,z){S.isMeshBasicMaterial||S.isMeshLambertMaterial?u(M,S):S.isMeshToonMaterial?(u(M,S),m(M,S)):S.isMeshPhongMaterial?(u(M,S),_(M,S)):S.isMeshStandardMaterial?(u(M,S),y(M,S),S.isMeshPhysicalMaterial&&x(M,S,z)):S.isMeshMatcapMaterial?(u(M,S),b(M,S)):S.isMeshDepthMaterial?u(M,S):S.isMeshDistanceMaterial?(u(M,S),T(M,S)):S.isMeshNormalMaterial?u(M,S):S.isLineBasicMaterial?(h(M,S),S.isLineDashedMaterial&&d(M,S)):S.isPointsMaterial?p(M,S,G,I):S.isSpriteMaterial?g(M,S):S.isShadowMaterial?(M.color.value.copy(S.color),M.opacity.value=S.opacity):S.isShaderMaterial&&(S.uniformsNeedUpdate=!1)}function u(M,S){M.opacity.value=S.opacity,S.color&&M.diffuse.value.copy(S.color),S.emissive&&M.emissive.value.copy(S.emissive).multiplyScalar(S.emissiveIntensity),S.map&&(M.map.value=S.map,i(S.map,M.mapTransform)),S.alphaMap&&(M.alphaMap.value=S.alphaMap,i(S.alphaMap,M.alphaMapTransform)),S.bumpMap&&(M.bumpMap.value=S.bumpMap,i(S.bumpMap,M.bumpMapTransform),M.bumpScale.value=S.bumpScale,S.side===ri&&(M.bumpScale.value*=-1)),S.normalMap&&(M.normalMap.value=S.normalMap,i(S.normalMap,M.normalMapTransform),M.normalScale.value.copy(S.normalScale),S.side===ri&&M.normalScale.value.negate()),S.displacementMap&&(M.displacementMap.value=S.displacementMap,i(S.displacementMap,M.displacementMapTransform),M.displacementScale.value=S.displacementScale,M.displacementBias.value=S.displacementBias),S.emissiveMap&&(M.emissiveMap.value=S.emissiveMap,i(S.emissiveMap,M.emissiveMapTransform)),S.specularMap&&(M.specularMap.value=S.specularMap,i(S.specularMap,M.specularMapTransform)),S.alphaTest>0&&(M.alphaTest.value=S.alphaTest);const G=e.get(S),I=G.envMap,z=G.envMapRotation;I&&(M.envMap.value=I,Zr.copy(z),Zr.x*=-1,Zr.y*=-1,Zr.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(Zr.y*=-1,Zr.z*=-1),M.envMapRotation.value.setFromMatrix4(FC.makeRotationFromEuler(Zr)),M.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,M.reflectivity.value=S.reflectivity,M.ior.value=S.ior,M.refractionRatio.value=S.refractionRatio),S.lightMap&&(M.lightMap.value=S.lightMap,M.lightMapIntensity.value=S.lightMapIntensity,i(S.lightMap,M.lightMapTransform)),S.aoMap&&(M.aoMap.value=S.aoMap,M.aoMapIntensity.value=S.aoMapIntensity,i(S.aoMap,M.aoMapTransform))}function h(M,S){M.diffuse.value.copy(S.color),M.opacity.value=S.opacity,S.map&&(M.map.value=S.map,i(S.map,M.mapTransform))}function d(M,S){M.dashSize.value=S.dashSize,M.totalSize.value=S.dashSize+S.gapSize,M.scale.value=S.scale}function p(M,S,G,I){M.diffuse.value.copy(S.color),M.opacity.value=S.opacity,M.size.value=S.size*G,M.scale.value=I*.5,S.map&&(M.map.value=S.map,i(S.map,M.uvTransform)),S.alphaMap&&(M.alphaMap.value=S.alphaMap,i(S.alphaMap,M.alphaMapTransform)),S.alphaTest>0&&(M.alphaTest.value=S.alphaTest)}function g(M,S){M.diffuse.value.copy(S.color),M.opacity.value=S.opacity,M.rotation.value=S.rotation,S.map&&(M.map.value=S.map,i(S.map,M.mapTransform)),S.alphaMap&&(M.alphaMap.value=S.alphaMap,i(S.alphaMap,M.alphaMapTransform)),S.alphaTest>0&&(M.alphaTest.value=S.alphaTest)}function _(M,S){M.specular.value.copy(S.specular),M.shininess.value=Math.max(S.shininess,1e-4)}function m(M,S){S.gradientMap&&(M.gradientMap.value=S.gradientMap)}function y(M,S){M.metalness.value=S.metalness,S.metalnessMap&&(M.metalnessMap.value=S.metalnessMap,i(S.metalnessMap,M.metalnessMapTransform)),M.roughness.value=S.roughness,S.roughnessMap&&(M.roughnessMap.value=S.roughnessMap,i(S.roughnessMap,M.roughnessMapTransform)),S.envMap&&(M.envMapIntensity.value=S.envMapIntensity)}function x(M,S,G){M.ior.value=S.ior,S.sheen>0&&(M.sheenColor.value.copy(S.sheenColor).multiplyScalar(S.sheen),M.sheenRoughness.value=S.sheenRoughness,S.sheenColorMap&&(M.sheenColorMap.value=S.sheenColorMap,i(S.sheenColorMap,M.sheenColorMapTransform)),S.sheenRoughnessMap&&(M.sheenRoughnessMap.value=S.sheenRoughnessMap,i(S.sheenRoughnessMap,M.sheenRoughnessMapTransform))),S.clearcoat>0&&(M.clearcoat.value=S.clearcoat,M.clearcoatRoughness.value=S.clearcoatRoughness,S.clearcoatMap&&(M.clearcoatMap.value=S.clearcoatMap,i(S.clearcoatMap,M.clearcoatMapTransform)),S.clearcoatRoughnessMap&&(M.clearcoatRoughnessMap.value=S.clearcoatRoughnessMap,i(S.clearcoatRoughnessMap,M.clearcoatRoughnessMapTransform)),S.clearcoatNormalMap&&(M.clearcoatNormalMap.value=S.clearcoatNormalMap,i(S.clearcoatNormalMap,M.clearcoatNormalMapTransform),M.clearcoatNormalScale.value.copy(S.clearcoatNormalScale),S.side===ri&&M.clearcoatNormalScale.value.negate())),S.dispersion>0&&(M.dispersion.value=S.dispersion),S.iridescence>0&&(M.iridescence.value=S.iridescence,M.iridescenceIOR.value=S.iridescenceIOR,M.iridescenceThicknessMinimum.value=S.iridescenceThicknessRange[0],M.iridescenceThicknessMaximum.value=S.iridescenceThicknessRange[1],S.iridescenceMap&&(M.iridescenceMap.value=S.iridescenceMap,i(S.iridescenceMap,M.iridescenceMapTransform)),S.iridescenceThicknessMap&&(M.iridescenceThicknessMap.value=S.iridescenceThicknessMap,i(S.iridescenceThicknessMap,M.iridescenceThicknessMapTransform))),S.transmission>0&&(M.transmission.value=S.transmission,M.transmissionSamplerMap.value=G.texture,M.transmissionSamplerSize.value.set(G.width,G.height),S.transmissionMap&&(M.transmissionMap.value=S.transmissionMap,i(S.transmissionMap,M.transmissionMapTransform)),M.thickness.value=S.thickness,S.thicknessMap&&(M.thicknessMap.value=S.thicknessMap,i(S.thicknessMap,M.thicknessMapTransform)),M.attenuationDistance.value=S.attenuationDistance,M.attenuationColor.value.copy(S.attenuationColor)),S.anisotropy>0&&(M.anisotropyVector.value.set(S.anisotropy*Math.cos(S.anisotropyRotation),S.anisotropy*Math.sin(S.anisotropyRotation)),S.anisotropyMap&&(M.anisotropyMap.value=S.anisotropyMap,i(S.anisotropyMap,M.anisotropyMapTransform))),M.specularIntensity.value=S.specularIntensity,M.specularColor.value.copy(S.specularColor),S.specularColorMap&&(M.specularColorMap.value=S.specularColorMap,i(S.specularColorMap,M.specularColorMapTransform)),S.specularIntensityMap&&(M.specularIntensityMap.value=S.specularIntensityMap,i(S.specularIntensityMap,M.specularIntensityMapTransform))}function b(M,S){S.matcap&&(M.matcap.value=S.matcap)}function T(M,S){const G=e.get(S).light;M.referencePosition.value.setFromMatrixPosition(G.matrixWorld),M.nearDistance.value=G.shadow.camera.near,M.farDistance.value=G.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:l}}function HC(o,e,i,r){let l={},u={},h=[];const d=o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS);function p(G,I){const z=I.program;r.uniformBlockBinding(G,z)}function g(G,I){let z=l[G.id];z===void 0&&(b(G),z=_(G),l[G.id]=z,G.addEventListener("dispose",M));const F=I.program;r.updateUBOMapping(G,F);const P=e.render.frame;u[G.id]!==P&&(y(G),u[G.id]=P)}function _(G){const I=m();G.__bindingPointIndex=I;const z=o.createBuffer(),F=G.__size,P=G.usage;return o.bindBuffer(o.UNIFORM_BUFFER,z),o.bufferData(o.UNIFORM_BUFFER,F,P),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,I,z),z}function m(){for(let G=0;G<d;G++)if(h.indexOf(G)===-1)return h.push(G),G;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function y(G){const I=l[G.id],z=G.uniforms,F=G.__cache;o.bindBuffer(o.UNIFORM_BUFFER,I);for(let P=0,L=z.length;P<L;P++){const V=Array.isArray(z[P])?z[P]:[z[P]];for(let C=0,E=V.length;C<E;C++){const k=V[C];if(x(k,P,C,F)===!0){const et=k.__offset,tt=Array.isArray(k.value)?k.value:[k.value];let ut=0;for(let ft=0;ft<tt.length;ft++){const X=tt[ft],it=T(X);typeof X=="number"||typeof X=="boolean"?(k.__data[0]=X,o.bufferSubData(o.UNIFORM_BUFFER,et+ut,k.__data)):X.isMatrix3?(k.__data[0]=X.elements[0],k.__data[1]=X.elements[1],k.__data[2]=X.elements[2],k.__data[3]=0,k.__data[4]=X.elements[3],k.__data[5]=X.elements[4],k.__data[6]=X.elements[5],k.__data[7]=0,k.__data[8]=X.elements[6],k.__data[9]=X.elements[7],k.__data[10]=X.elements[8],k.__data[11]=0):(X.toArray(k.__data,ut),ut+=it.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,et,k.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function x(G,I,z,F){const P=G.value,L=I+"_"+z;if(F[L]===void 0)return typeof P=="number"||typeof P=="boolean"?F[L]=P:F[L]=P.clone(),!0;{const V=F[L];if(typeof P=="number"||typeof P=="boolean"){if(V!==P)return F[L]=P,!0}else if(V.equals(P)===!1)return V.copy(P),!0}return!1}function b(G){const I=G.uniforms;let z=0;const F=16;for(let L=0,V=I.length;L<V;L++){const C=Array.isArray(I[L])?I[L]:[I[L]];for(let E=0,k=C.length;E<k;E++){const et=C[E],tt=Array.isArray(et.value)?et.value:[et.value];for(let ut=0,ft=tt.length;ut<ft;ut++){const X=tt[ut],it=T(X),W=z%F,mt=W%it.boundary,vt=W+mt;z+=mt,vt!==0&&F-vt<it.storage&&(z+=F-vt),et.__data=new Float32Array(it.storage/Float32Array.BYTES_PER_ELEMENT),et.__offset=z,z+=it.storage}}}const P=z%F;return P>0&&(z+=F-P),G.__size=z,G.__cache={},this}function T(G){const I={boundary:0,storage:0};return typeof G=="number"||typeof G=="boolean"?(I.boundary=4,I.storage=4):G.isVector2?(I.boundary=8,I.storage=8):G.isVector3||G.isColor?(I.boundary=16,I.storage=12):G.isVector4?(I.boundary=16,I.storage=16):G.isMatrix3?(I.boundary=48,I.storage=48):G.isMatrix4?(I.boundary=64,I.storage=64):G.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",G),I}function M(G){const I=G.target;I.removeEventListener("dispose",M);const z=h.indexOf(I.__bindingPointIndex);h.splice(z,1),o.deleteBuffer(l[I.id]),delete l[I.id],delete u[I.id]}function S(){for(const G in l)o.deleteBuffer(l[G]);h=[],l={},u={}}return{bind:p,update:g,dispose:S}}class GC{constructor(e={}){const{canvas:i=_T(),context:r=null,depth:l=!0,stencil:u=!1,alpha:h=!1,antialias:d=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:g=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:m=!1,reverseDepthBuffer:y=!1}=e;this.isWebGLRenderer=!0;let x;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=r.getContextAttributes().alpha}else x=h;const b=new Uint32Array(4),T=new Int32Array(4);let M=null,S=null;const G=[],I=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=gr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const z=this;let F=!1;this._outputColorSpace=Ai;let P=0,L=0,V=null,C=-1,E=null;const k=new on,et=new on;let tt=null;const ut=new Te(0);let ft=0,X=i.width,it=i.height,W=1,mt=null,vt=null;const At=new on(0,0,X,it),Xt=new on(0,0,X,it);let he=!1;const R=new Sm;let Y=!1,pt=!1;const ht=new Xe,Ct=new Xe,Ut=new $,bt=new on,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let zt=!1;function se(){return V===null?W:1}let H=r;function Ue(N,Q){return i.getContext(N,Q)}try{const N={alpha:!0,depth:l,stencil:u,antialias:d,premultipliedAlpha:p,preserveDrawingBuffer:g,powerPreference:_,failIfMajorPerformanceCaveat:m};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${fm}`),i.addEventListener("webglcontextlost",xt,!1),i.addEventListener("webglcontextrestored",kt,!1),i.addEventListener("webglcontextcreationerror",Ot,!1),H===null){const Q="webgl2";if(H=Ue(Q,N),H===null)throw Ue(Q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(N){throw console.error("THREE.WebGLRenderer: "+N.message),N}let ne,qt,Nt,Wt,Vt,O,A,rt,St,Mt,gt,Qt,Ft,Ht,ye,Rt,Zt,ie,re,jt,_e,fe,dt,U;function Tt(){ne=new JA(H),ne.init(),fe=new LC(H,ne),qt=new XA(H,ne,e,fe),Nt=new zC(H,ne),qt.reverseDepthBuffer&&y&&Nt.buffers.depth.setReversed(!0),Wt=new eR(H),Vt=new yC,O=new UC(H,ne,Nt,Vt,qt,fe,Wt),A=new YA(z),rt=new QA(z),St=new o1(H),dt=new VA(H,St),Mt=new $A(H,St,Wt,dt),gt=new iR(H,Mt,St,Wt),re=new nR(H,qt,O),Rt=new WA(Vt),Qt=new vC(z,A,rt,ne,qt,dt,Rt),Ft=new kC(z,Vt),Ht=new SC,ye=new AC(ne),ie=new GA(z,A,rt,Nt,gt,x,p),Zt=new DC(z,gt,qt),U=new HC(H,Wt,qt,Nt),jt=new jA(H,ne,Wt),_e=new tR(H,ne,Wt),Wt.programs=Qt.programs,z.capabilities=qt,z.extensions=ne,z.properties=Vt,z.renderLists=Ht,z.shadowMap=Zt,z.state=Nt,z.info=Wt}Tt();const st=new BC(z,H);this.xr=st,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const N=ne.get("WEBGL_lose_context");N&&N.loseContext()},this.forceContextRestore=function(){const N=ne.get("WEBGL_lose_context");N&&N.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(N){N!==void 0&&(W=N,this.setSize(X,it,!1))},this.getSize=function(N){return N.set(X,it)},this.setSize=function(N,Q,lt=!0){if(st.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=N,it=Q,i.width=Math.floor(N*W),i.height=Math.floor(Q*W),lt===!0&&(i.style.width=N+"px",i.style.height=Q+"px"),this.setViewport(0,0,N,Q)},this.getDrawingBufferSize=function(N){return N.set(X*W,it*W).floor()},this.setDrawingBufferSize=function(N,Q,lt){X=N,it=Q,W=lt,i.width=Math.floor(N*lt),i.height=Math.floor(Q*lt),this.setViewport(0,0,N,Q)},this.getCurrentViewport=function(N){return N.copy(k)},this.getViewport=function(N){return N.copy(At)},this.setViewport=function(N,Q,lt,ct){N.isVector4?At.set(N.x,N.y,N.z,N.w):At.set(N,Q,lt,ct),Nt.viewport(k.copy(At).multiplyScalar(W).round())},this.getScissor=function(N){return N.copy(Xt)},this.setScissor=function(N,Q,lt,ct){N.isVector4?Xt.set(N.x,N.y,N.z,N.w):Xt.set(N,Q,lt,ct),Nt.scissor(et.copy(Xt).multiplyScalar(W).round())},this.getScissorTest=function(){return he},this.setScissorTest=function(N){Nt.setScissorTest(he=N)},this.setOpaqueSort=function(N){mt=N},this.setTransparentSort=function(N){vt=N},this.getClearColor=function(N){return N.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(N=!0,Q=!0,lt=!0){let ct=0;if(N){let J=!1;if(V!==null){const wt=V.texture.format;J=wt===vm||wt===_m||wt===gm}if(J){const wt=V.texture.type,Pt=wt===za||wt===is||wt===Dl||wt===Nl||wt===dm||wt===pm,Lt=ie.getClearColor(),Bt=ie.getClearAlpha(),ae=Lt.r,le=Lt.g,ee=Lt.b;Pt?(b[0]=ae,b[1]=le,b[2]=ee,b[3]=Bt,H.clearBufferuiv(H.COLOR,0,b)):(T[0]=ae,T[1]=le,T[2]=ee,T[3]=Bt,H.clearBufferiv(H.COLOR,0,T))}else ct|=H.COLOR_BUFFER_BIT}Q&&(ct|=H.DEPTH_BUFFER_BIT),lt&&(ct|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(ct)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",xt,!1),i.removeEventListener("webglcontextrestored",kt,!1),i.removeEventListener("webglcontextcreationerror",Ot,!1),ie.dispose(),Ht.dispose(),ye.dispose(),Vt.dispose(),A.dispose(),rt.dispose(),gt.dispose(),dt.dispose(),U.dispose(),Qt.dispose(),st.dispose(),st.removeEventListener("sessionstart",Bn),st.removeEventListener("sessionend",Pl),ra.stop()};function xt(N){N.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),F=!0}function kt(){console.log("THREE.WebGLRenderer: Context Restored."),F=!1;const N=Wt.autoReset,Q=Zt.enabled,lt=Zt.autoUpdate,ct=Zt.needsUpdate,J=Zt.type;Tt(),Wt.autoReset=N,Zt.enabled=Q,Zt.autoUpdate=lt,Zt.needsUpdate=ct,Zt.type=J}function Ot(N){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",N.statusMessage)}function ce(N){const Q=N.target;Q.removeEventListener("dispose",ce),tn(Q)}function tn(N){Sn(N),Vt.remove(N)}function Sn(N){const Q=Vt.get(N).programs;Q!==void 0&&(Q.forEach(function(lt){Qt.releaseProgram(lt)}),N.isShaderMaterial&&Qt.releaseShaderCache(N))}this.renderBufferDirect=function(N,Q,lt,ct,J,wt){Q===null&&(Q=Dt);const Pt=J.isMesh&&J.matrixWorld.determinant()<0,Lt=tf(N,Q,lt,ct,J);Nt.setMaterial(ct,Pt);let Bt=lt.index,ae=1;if(ct.wireframe===!0){if(Bt=Mt.getWireframeAttribute(lt),Bt===void 0)return;ae=2}const le=lt.drawRange,ee=lt.attributes.position;let De=le.start*ae,ze=(le.start+le.count)*ae;wt!==null&&(De=Math.max(De,wt.start*ae),ze=Math.min(ze,(wt.start+wt.count)*ae)),Bt!==null?(De=Math.max(De,0),ze=Math.min(ze,Bt.count)):ee!=null&&(De=Math.max(De,0),ze=Math.min(ze,ee.count));const Ze=ze-De;if(Ze<0||Ze===1/0)return;dt.setup(J,ct,Lt,lt,Bt);let We,Se=jt;if(Bt!==null&&(We=St.get(Bt),Se=_e,Se.setIndex(We)),J.isMesh)ct.wireframe===!0?(Nt.setLineWidth(ct.wireframeLinewidth*se()),Se.setMode(H.LINES)):Se.setMode(H.TRIANGLES);else if(J.isLine){let Jt=ct.linewidth;Jt===void 0&&(Jt=1),Nt.setLineWidth(Jt*se()),J.isLineSegments?Se.setMode(H.LINES):J.isLineLoop?Se.setMode(H.LINE_LOOP):Se.setMode(H.LINE_STRIP)}else J.isPoints?Se.setMode(H.POINTS):J.isSprite&&Se.setMode(H.TRIANGLES);if(J.isBatchedMesh)if(J._multiDrawInstances!==null)Bu("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Se.renderMultiDrawInstances(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount,J._multiDrawInstances);else if(ne.get("WEBGL_multi_draw"))Se.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else{const Jt=J._multiDrawStarts,en=J._multiDrawCounts,we=J._multiDrawCount,En=Bt?St.get(Bt).bytesPerElement:1,$e=Vt.get(ct).currentProgram.getUniforms();for(let Fn=0;Fn<we;Fn++)$e.setValue(H,"_gl_DrawID",Fn),Se.render(Jt[Fn]/En,en[Fn])}else if(J.isInstancedMesh)Se.renderInstances(De,Ze,J.count);else if(lt.isInstancedBufferGeometry){const Jt=lt._maxInstanceCount!==void 0?lt._maxInstanceCount:1/0,en=Math.min(lt.instanceCount,Jt);Se.renderInstances(De,Ze,en)}else Se.render(De,Ze)};function Ce(N,Q,lt){N.transparent===!0&&N.side===Ca&&N.forceSinglePass===!1?(N.side=ri,N.needsUpdate=!0,oa(N,Q,lt),N.side=_r,N.needsUpdate=!0,oa(N,Q,lt),N.side=Ca):oa(N,Q,lt)}this.compile=function(N,Q,lt=null){lt===null&&(lt=N),S=ye.get(lt),S.init(Q),I.push(S),lt.traverseVisible(function(J){J.isLight&&J.layers.test(Q.layers)&&(S.pushLight(J),J.castShadow&&S.pushShadow(J))}),N!==lt&&N.traverseVisible(function(J){J.isLight&&J.layers.test(Q.layers)&&(S.pushLight(J),J.castShadow&&S.pushShadow(J))}),S.setupLights();const ct=new Set;return N.traverse(function(J){if(!(J.isMesh||J.isPoints||J.isLine||J.isSprite))return;const wt=J.material;if(wt)if(Array.isArray(wt))for(let Pt=0;Pt<wt.length;Pt++){const Lt=wt[Pt];Ce(Lt,lt,J),ct.add(Lt)}else Ce(wt,lt,J),ct.add(wt)}),S=I.pop(),ct},this.compileAsync=function(N,Q,lt=null){const ct=this.compile(N,Q,lt);return new Promise(J=>{function wt(){if(ct.forEach(function(Pt){Vt.get(Pt).currentProgram.isReady()&&ct.delete(Pt)}),ct.size===0){J(N);return}setTimeout(wt,10)}ne.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let Je=null;function Mn(N){Je&&Je(N)}function Bn(){ra.stop()}function Pl(){ra.start()}const ra=new Vx;ra.setAnimationLoop(Mn),typeof self<"u"&&ra.setContext(self),this.setAnimationLoop=function(N){Je=N,st.setAnimationLoop(N),N===null?ra.stop():ra.start()},st.addEventListener("sessionstart",Bn),st.addEventListener("sessionend",Pl),this.render=function(N,Q){if(Q!==void 0&&Q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;if(N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Q.parent===null&&Q.matrixWorldAutoUpdate===!0&&Q.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(st.cameraAutoUpdate===!0&&st.updateCamera(Q),Q=st.getCamera()),N.isScene===!0&&N.onBeforeRender(z,N,Q,V),S=ye.get(N,I.length),S.init(Q),I.push(S),Ct.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),R.setFromProjectionMatrix(Ct),pt=this.localClippingEnabled,Y=Rt.init(this.clippingPlanes,pt),M=Ht.get(N,G.length),M.init(),G.push(M),st.enabled===!0&&st.isPresenting===!0){const wt=z.xr.getDepthSensingMesh();wt!==null&&Eo(wt,Q,-1/0,z.sortObjects)}Eo(N,Q,0,z.sortObjects),M.finish(),z.sortObjects===!0&&M.sort(mt,vt),zt=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1,zt&&ie.addToRenderList(M,N),this.info.render.frame++,Y===!0&&Rt.beginShadows();const lt=S.state.shadowsArray;Zt.render(lt,N,Q),Y===!0&&Rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const ct=M.opaque,J=M.transmissive;if(S.setupLights(),Q.isArrayCamera){const wt=Q.cameras;if(J.length>0)for(let Pt=0,Lt=wt.length;Pt<Lt;Pt++){const Bt=wt[Pt];Mr(ct,J,N,Bt)}zt&&ie.render(N);for(let Pt=0,Lt=wt.length;Pt<Lt;Pt++){const Bt=wt[Pt];Sr(M,N,Bt,Bt.viewport)}}else J.length>0&&Mr(ct,J,N,Q),zt&&ie.render(N),Sr(M,N,Q);V!==null&&L===0&&(O.updateMultisampleRenderTarget(V),O.updateRenderTargetMipmap(V)),N.isScene===!0&&N.onAfterRender(z,N,Q),dt.resetDefaultState(),C=-1,E=null,I.pop(),I.length>0?(S=I[I.length-1],Y===!0&&Rt.setGlobalState(z.clippingPlanes,S.state.camera)):S=null,G.pop(),G.length>0?M=G[G.length-1]:M=null};function Eo(N,Q,lt,ct){if(N.visible===!1)return;if(N.layers.test(Q.layers)){if(N.isGroup)lt=N.renderOrder;else if(N.isLOD)N.autoUpdate===!0&&N.update(Q);else if(N.isLight)S.pushLight(N),N.castShadow&&S.pushShadow(N);else if(N.isSprite){if(!N.frustumCulled||R.intersectsSprite(N)){ct&&bt.setFromMatrixPosition(N.matrixWorld).applyMatrix4(Ct);const Pt=gt.update(N),Lt=N.material;Lt.visible&&M.push(N,Pt,Lt,lt,bt.z,null)}}else if((N.isMesh||N.isLine||N.isPoints)&&(!N.frustumCulled||R.intersectsObject(N))){const Pt=gt.update(N),Lt=N.material;if(ct&&(N.boundingSphere!==void 0?(N.boundingSphere===null&&N.computeBoundingSphere(),bt.copy(N.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),bt.copy(Pt.boundingSphere.center)),bt.applyMatrix4(N.matrixWorld).applyMatrix4(Ct)),Array.isArray(Lt)){const Bt=Pt.groups;for(let ae=0,le=Bt.length;ae<le;ae++){const ee=Bt[ae],De=Lt[ee.materialIndex];De&&De.visible&&M.push(N,Pt,De,lt,bt.z,ee)}}else Lt.visible&&M.push(N,Pt,Lt,lt,bt.z,null)}}const wt=N.children;for(let Pt=0,Lt=wt.length;Pt<Lt;Pt++)Eo(wt[Pt],Q,lt,ct)}function Sr(N,Q,lt,ct){const J=N.opaque,wt=N.transmissive,Pt=N.transparent;S.setupLightsView(lt),Y===!0&&Rt.setGlobalState(z.clippingPlanes,lt),ct&&Nt.viewport(k.copy(ct)),J.length>0&&sa(J,Q,lt),wt.length>0&&sa(wt,Q,lt),Pt.length>0&&sa(Pt,Q,lt),Nt.buffers.depth.setTest(!0),Nt.buffers.depth.setMask(!0),Nt.buffers.color.setMask(!0),Nt.setPolygonOffset(!1)}function Mr(N,Q,lt,ct){if((lt.isScene===!0?lt.overrideMaterial:null)!==null)return;S.state.transmissionRenderTarget[ct.id]===void 0&&(S.state.transmissionRenderTarget[ct.id]=new as(1,1,{generateMipmaps:!0,type:ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float")?Ll:za,minFilter:ns,samples:4,stencilBuffer:u,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Pe.workingColorSpace}));const wt=S.state.transmissionRenderTarget[ct.id],Pt=ct.viewport||k;wt.setSize(Pt.z*z.transmissionResolutionScale,Pt.w*z.transmissionResolutionScale);const Lt=z.getRenderTarget();z.setRenderTarget(wt),z.getClearColor(ut),ft=z.getClearAlpha(),ft<1&&z.setClearColor(16777215,.5),z.clear(),zt&&ie.render(lt);const Bt=z.toneMapping;z.toneMapping=gr;const ae=ct.viewport;if(ct.viewport!==void 0&&(ct.viewport=void 0),S.setupLightsView(ct),Y===!0&&Rt.setGlobalState(z.clippingPlanes,ct),sa(N,lt,ct),O.updateMultisampleRenderTarget(wt),O.updateRenderTargetMipmap(wt),ne.has("WEBGL_multisampled_render_to_texture")===!1){let le=!1;for(let ee=0,De=Q.length;ee<De;ee++){const ze=Q[ee],Ze=ze.object,We=ze.geometry,Se=ze.material,Jt=ze.group;if(Se.side===Ca&&Ze.layers.test(ct.layers)){const en=Se.side;Se.side=ri,Se.needsUpdate=!0,Gi(Ze,lt,ct,We,Se,Jt),Se.side=en,Se.needsUpdate=!0,le=!0}}le===!0&&(O.updateMultisampleRenderTarget(wt),O.updateRenderTargetMipmap(wt))}z.setRenderTarget(Lt),z.setClearColor(ut,ft),ae!==void 0&&(ct.viewport=ae),z.toneMapping=Bt}function sa(N,Q,lt){const ct=Q.isScene===!0?Q.overrideMaterial:null;for(let J=0,wt=N.length;J<wt;J++){const Pt=N[J],Lt=Pt.object,Bt=Pt.geometry,ae=Pt.group;let le=Pt.material;le.allowOverride===!0&&ct!==null&&(le=ct),Lt.layers.test(lt.layers)&&Gi(Lt,Q,lt,Bt,le,ae)}}function Gi(N,Q,lt,ct,J,wt){N.onBeforeRender(z,Q,lt,ct,J,wt),N.modelViewMatrix.multiplyMatrices(lt.matrixWorldInverse,N.matrixWorld),N.normalMatrix.getNormalMatrix(N.modelViewMatrix),J.onBeforeRender(z,Q,lt,ct,N,wt),J.transparent===!0&&J.side===Ca&&J.forceSinglePass===!1?(J.side=ri,J.needsUpdate=!0,z.renderBufferDirect(lt,Q,ct,J,N,wt),J.side=_r,J.needsUpdate=!0,z.renderBufferDirect(lt,Q,ct,J,N,wt),J.side=Ca):z.renderBufferDirect(lt,Q,ct,J,N,wt),N.onAfterRender(z,Q,lt,ct,J,wt)}function oa(N,Q,lt){Q.isScene!==!0&&(Q=Dt);const ct=Vt.get(N),J=S.state.lights,wt=S.state.shadowsArray,Pt=J.state.version,Lt=Qt.getParameters(N,J.state,wt,Q,lt),Bt=Qt.getProgramCacheKey(Lt);let ae=ct.programs;ct.environment=N.isMeshStandardMaterial?Q.environment:null,ct.fog=Q.fog,ct.envMap=(N.isMeshStandardMaterial?rt:A).get(N.envMap||ct.environment),ct.envMapRotation=ct.environment!==null&&N.envMap===null?Q.environmentRotation:N.envMapRotation,ae===void 0&&(N.addEventListener("dispose",ce),ae=new Map,ct.programs=ae);let le=ae.get(Bt);if(le!==void 0){if(ct.currentProgram===le&&ct.lightsStateVersion===Pt)return bo(N,Lt),le}else Lt.uniforms=Qt.getUniforms(N),N.onBeforeCompile(Lt,z),le=Qt.acquireProgram(Lt,Bt),ae.set(Bt,le),ct.uniforms=Lt.uniforms;const ee=ct.uniforms;return(!N.isShaderMaterial&&!N.isRawShaderMaterial||N.clipping===!0)&&(ee.clippingPlanes=Rt.uniform),bo(N,Lt),ct.needsLights=To(N),ct.lightsStateVersion=Pt,ct.needsLights&&(ee.ambientLightColor.value=J.state.ambient,ee.lightProbe.value=J.state.probe,ee.directionalLights.value=J.state.directional,ee.directionalLightShadows.value=J.state.directionalShadow,ee.spotLights.value=J.state.spot,ee.spotLightShadows.value=J.state.spotShadow,ee.rectAreaLights.value=J.state.rectArea,ee.ltc_1.value=J.state.rectAreaLTC1,ee.ltc_2.value=J.state.rectAreaLTC2,ee.pointLights.value=J.state.point,ee.pointLightShadows.value=J.state.pointShadow,ee.hemisphereLights.value=J.state.hemi,ee.directionalShadowMap.value=J.state.directionalShadowMap,ee.directionalShadowMatrix.value=J.state.directionalShadowMatrix,ee.spotShadowMap.value=J.state.spotShadowMap,ee.spotLightMatrix.value=J.state.spotLightMatrix,ee.spotLightMap.value=J.state.spotLightMap,ee.pointShadowMap.value=J.state.pointShadowMap,ee.pointShadowMatrix.value=J.state.pointShadowMatrix),ct.currentProgram=le,ct.uniformsList=null,le}function Ua(N){if(N.uniformsList===null){const Q=N.currentProgram.getUniforms();N.uniformsList=Fu.seqWithValue(Q.seq,N.uniforms)}return N.uniformsList}function bo(N,Q){const lt=Vt.get(N);lt.outputColorSpace=Q.outputColorSpace,lt.batching=Q.batching,lt.batchingColor=Q.batchingColor,lt.instancing=Q.instancing,lt.instancingColor=Q.instancingColor,lt.instancingMorph=Q.instancingMorph,lt.skinning=Q.skinning,lt.morphTargets=Q.morphTargets,lt.morphNormals=Q.morphNormals,lt.morphColors=Q.morphColors,lt.morphTargetsCount=Q.morphTargetsCount,lt.numClippingPlanes=Q.numClippingPlanes,lt.numIntersection=Q.numClipIntersection,lt.vertexAlphas=Q.vertexAlphas,lt.vertexTangents=Q.vertexTangents,lt.toneMapping=Q.toneMapping}function tf(N,Q,lt,ct,J){Q.isScene!==!0&&(Q=Dt),O.resetTextureUnits();const wt=Q.fog,Pt=ct.isMeshStandardMaterial?Q.environment:null,Lt=V===null?z.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:yo,Bt=(ct.isMeshStandardMaterial?rt:A).get(ct.envMap||Pt),ae=ct.vertexColors===!0&&!!lt.attributes.color&&lt.attributes.color.itemSize===4,le=!!lt.attributes.tangent&&(!!ct.normalMap||ct.anisotropy>0),ee=!!lt.morphAttributes.position,De=!!lt.morphAttributes.normal,ze=!!lt.morphAttributes.color;let Ze=gr;ct.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(Ze=z.toneMapping);const We=lt.morphAttributes.position||lt.morphAttributes.normal||lt.morphAttributes.color,Se=We!==void 0?We.length:0,Jt=Vt.get(ct),en=S.state.lights;if(Y===!0&&(pt===!0||N!==E)){const Rn=N===E&&ct.id===C;Rt.setState(ct,N,Rn)}let we=!1;ct.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==en.state.version||Jt.outputColorSpace!==Lt||J.isBatchedMesh&&Jt.batching===!1||!J.isBatchedMesh&&Jt.batching===!0||J.isBatchedMesh&&Jt.batchingColor===!0&&J.colorTexture===null||J.isBatchedMesh&&Jt.batchingColor===!1&&J.colorTexture!==null||J.isInstancedMesh&&Jt.instancing===!1||!J.isInstancedMesh&&Jt.instancing===!0||J.isSkinnedMesh&&Jt.skinning===!1||!J.isSkinnedMesh&&Jt.skinning===!0||J.isInstancedMesh&&Jt.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&Jt.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&Jt.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&Jt.instancingMorph===!1&&J.morphTexture!==null||Jt.envMap!==Bt||ct.fog===!0&&Jt.fog!==wt||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==Rt.numPlanes||Jt.numIntersection!==Rt.numIntersection)||Jt.vertexAlphas!==ae||Jt.vertexTangents!==le||Jt.morphTargets!==ee||Jt.morphNormals!==De||Jt.morphColors!==ze||Jt.toneMapping!==Ze||Jt.morphTargetsCount!==Se)&&(we=!0):(we=!0,Jt.__version=ct.version);let En=Jt.currentProgram;we===!0&&(En=oa(ct,Q,J));let $e=!1,Fn=!1,La=!1;const Ye=En.getUniforms(),cn=Jt.uniforms;if(Nt.useProgram(En.program)&&($e=!0,Fn=!0,La=!0),ct.id!==C&&(C=ct.id,Fn=!0),$e||E!==N){Nt.buffers.depth.getReversed()?(ht.copy(N.projectionMatrix),yT(ht),xT(ht),Ye.setValue(H,"projectionMatrix",ht)):Ye.setValue(H,"projectionMatrix",N.projectionMatrix),Ye.setValue(H,"viewMatrix",N.matrixWorldInverse);const Cn=Ye.map.cameraPosition;Cn!==void 0&&Cn.setValue(H,Ut.setFromMatrixPosition(N.matrixWorld)),qt.logarithmicDepthBuffer&&Ye.setValue(H,"logDepthBufFC",2/(Math.log(N.far+1)/Math.LN2)),(ct.isMeshPhongMaterial||ct.isMeshToonMaterial||ct.isMeshLambertMaterial||ct.isMeshBasicMaterial||ct.isMeshStandardMaterial||ct.isShaderMaterial)&&Ye.setValue(H,"isOrthographic",N.isOrthographicCamera===!0),E!==N&&(E=N,Fn=!0,La=!0)}if(J.isSkinnedMesh){Ye.setOptional(H,J,"bindMatrix"),Ye.setOptional(H,J,"bindMatrixInverse");const Rn=J.skeleton;Rn&&(Rn.boneTexture===null&&Rn.computeBoneTexture(),Ye.setValue(H,"boneTexture",Rn.boneTexture,O))}J.isBatchedMesh&&(Ye.setOptional(H,J,"batchingTexture"),Ye.setValue(H,"batchingTexture",J._matricesTexture,O),Ye.setOptional(H,J,"batchingIdTexture"),Ye.setValue(H,"batchingIdTexture",J._indirectTexture,O),Ye.setOptional(H,J,"batchingColorTexture"),J._colorsTexture!==null&&Ye.setValue(H,"batchingColorTexture",J._colorsTexture,O));const mn=lt.morphAttributes;if((mn.position!==void 0||mn.normal!==void 0||mn.color!==void 0)&&re.update(J,lt,En),(Fn||Jt.receiveShadow!==J.receiveShadow)&&(Jt.receiveShadow=J.receiveShadow,Ye.setValue(H,"receiveShadow",J.receiveShadow)),ct.isMeshGouraudMaterial&&ct.envMap!==null&&(cn.envMap.value=Bt,cn.flipEnvMap.value=Bt.isCubeTexture&&Bt.isRenderTargetTexture===!1?-1:1),ct.isMeshStandardMaterial&&ct.envMap===null&&Q.environment!==null&&(cn.envMapIntensity.value=Q.environmentIntensity),Fn&&(Ye.setValue(H,"toneMappingExposure",z.toneMappingExposure),Jt.needsLights&&Il(cn,La),wt&&ct.fog===!0&&Ft.refreshFogUniforms(cn,wt),Ft.refreshMaterialUniforms(cn,ct,W,it,S.state.transmissionRenderTarget[N.id]),Fu.upload(H,Ua(Jt),cn,O)),ct.isShaderMaterial&&ct.uniformsNeedUpdate===!0&&(Fu.upload(H,Ua(Jt),cn,O),ct.uniformsNeedUpdate=!1),ct.isSpriteMaterial&&Ye.setValue(H,"center",J.center),Ye.setValue(H,"modelViewMatrix",J.modelViewMatrix),Ye.setValue(H,"normalMatrix",J.normalMatrix),Ye.setValue(H,"modelMatrix",J.matrixWorld),ct.isShaderMaterial||ct.isRawShaderMaterial){const Rn=ct.uniformsGroups;for(let Cn=0,ls=Rn.length;Cn<ls;Cn++){const la=Rn[Cn];U.update(la,En),U.bind(la,En)}}return En}function Il(N,Q){N.ambientLightColor.needsUpdate=Q,N.lightProbe.needsUpdate=Q,N.directionalLights.needsUpdate=Q,N.directionalLightShadows.needsUpdate=Q,N.pointLights.needsUpdate=Q,N.pointLightShadows.needsUpdate=Q,N.spotLights.needsUpdate=Q,N.spotLightShadows.needsUpdate=Q,N.rectAreaLights.needsUpdate=Q,N.hemisphereLights.needsUpdate=Q}function To(N){return N.isMeshLambertMaterial||N.isMeshToonMaterial||N.isMeshPhongMaterial||N.isMeshStandardMaterial||N.isShadowMaterial||N.isShaderMaterial&&N.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(N,Q,lt){const ct=Vt.get(N);ct.__autoAllocateDepthBuffer=N.resolveDepthBuffer===!1,ct.__autoAllocateDepthBuffer===!1&&(ct.__useRenderToTexture=!1),Vt.get(N.texture).__webglTexture=Q,Vt.get(N.depthTexture).__webglTexture=ct.__autoAllocateDepthBuffer?void 0:lt,ct.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(N,Q){const lt=Vt.get(N);lt.__webglFramebuffer=Q,lt.__useDefaultFramebuffer=Q===void 0};const Er=H.createFramebuffer();this.setRenderTarget=function(N,Q=0,lt=0){V=N,P=Q,L=lt;let ct=!0,J=null,wt=!1,Pt=!1;if(N){const Bt=Vt.get(N);if(Bt.__useDefaultFramebuffer!==void 0)Nt.bindFramebuffer(H.FRAMEBUFFER,null),ct=!1;else if(Bt.__webglFramebuffer===void 0)O.setupRenderTarget(N);else if(Bt.__hasExternalTextures)O.rebindTextures(N,Vt.get(N.texture).__webglTexture,Vt.get(N.depthTexture).__webglTexture);else if(N.depthBuffer){const ee=N.depthTexture;if(Bt.__boundDepthTexture!==ee){if(ee!==null&&Vt.has(ee)&&(N.width!==ee.image.width||N.height!==ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");O.setupDepthRenderbuffer(N)}}const ae=N.texture;(ae.isData3DTexture||ae.isDataArrayTexture||ae.isCompressedArrayTexture)&&(Pt=!0);const le=Vt.get(N).__webglFramebuffer;N.isWebGLCubeRenderTarget?(Array.isArray(le[Q])?J=le[Q][lt]:J=le[Q],wt=!0):N.samples>0&&O.useMultisampledRTT(N)===!1?J=Vt.get(N).__webglMultisampledFramebuffer:Array.isArray(le)?J=le[lt]:J=le,k.copy(N.viewport),et.copy(N.scissor),tt=N.scissorTest}else k.copy(At).multiplyScalar(W).floor(),et.copy(Xt).multiplyScalar(W).floor(),tt=he;if(lt!==0&&(J=Er),Nt.bindFramebuffer(H.FRAMEBUFFER,J)&&ct&&Nt.drawBuffers(N,J),Nt.viewport(k),Nt.scissor(et),Nt.setScissorTest(tt),wt){const Bt=Vt.get(N.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Bt.__webglTexture,lt)}else if(Pt){const Bt=Vt.get(N.texture),ae=Q;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,Bt.__webglTexture,lt,ae)}else if(N!==null&&lt!==0){const Bt=Vt.get(N.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Bt.__webglTexture,lt)}C=-1},this.readRenderTargetPixels=function(N,Q,lt,ct,J,wt,Pt){if(!(N&&N.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=Vt.get(N).__webglFramebuffer;if(N.isWebGLCubeRenderTarget&&Pt!==void 0&&(Lt=Lt[Pt]),Lt){Nt.bindFramebuffer(H.FRAMEBUFFER,Lt);try{const Bt=N.texture,ae=Bt.format,le=Bt.type;if(!qt.textureFormatReadable(ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qt.textureTypeReadable(le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Q>=0&&Q<=N.width-ct&&lt>=0&&lt<=N.height-J&&H.readPixels(Q,lt,ct,J,fe.convert(ae),fe.convert(le),wt)}finally{const Bt=V!==null?Vt.get(V).__webglFramebuffer:null;Nt.bindFramebuffer(H.FRAMEBUFFER,Bt)}}},this.readRenderTargetPixelsAsync=async function(N,Q,lt,ct,J,wt,Pt){if(!(N&&N.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=Vt.get(N).__webglFramebuffer;if(N.isWebGLCubeRenderTarget&&Pt!==void 0&&(Lt=Lt[Pt]),Lt)if(Q>=0&&Q<=N.width-ct&&lt>=0&&lt<=N.height-J){Nt.bindFramebuffer(H.FRAMEBUFFER,Lt);const Bt=N.texture,ae=Bt.format,le=Bt.type;if(!qt.textureFormatReadable(ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qt.textureTypeReadable(le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ee=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,ee),H.bufferData(H.PIXEL_PACK_BUFFER,wt.byteLength,H.STREAM_READ),H.readPixels(Q,lt,ct,J,fe.convert(ae),fe.convert(le),0);const De=V!==null?Vt.get(V).__webglFramebuffer:null;Nt.bindFramebuffer(H.FRAMEBUFFER,De);const ze=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await vT(H,ze,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,ee),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,wt),H.deleteBuffer(ee),H.deleteSync(ze),wt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(N,Q=null,lt=0){const ct=Math.pow(2,-lt),J=Math.floor(N.image.width*ct),wt=Math.floor(N.image.height*ct),Pt=Q!==null?Q.x:0,Lt=Q!==null?Q.y:0;O.setTexture2D(N,0),H.copyTexSubImage2D(H.TEXTURE_2D,lt,0,0,Pt,Lt,J,wt),Nt.unbindTexture()};const ef=H.createFramebuffer(),Bl=H.createFramebuffer();this.copyTextureToTexture=function(N,Q,lt=null,ct=null,J=0,wt=null){wt===null&&(J!==0?(Bu("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),wt=J,J=0):wt=0);let Pt,Lt,Bt,ae,le,ee,De,ze,Ze;const We=N.isCompressedTexture?N.mipmaps[wt]:N.image;if(lt!==null)Pt=lt.max.x-lt.min.x,Lt=lt.max.y-lt.min.y,Bt=lt.isBox3?lt.max.z-lt.min.z:1,ae=lt.min.x,le=lt.min.y,ee=lt.isBox3?lt.min.z:0;else{const mn=Math.pow(2,-J);Pt=Math.floor(We.width*mn),Lt=Math.floor(We.height*mn),N.isDataArrayTexture?Bt=We.depth:N.isData3DTexture?Bt=Math.floor(We.depth*mn):Bt=1,ae=0,le=0,ee=0}ct!==null?(De=ct.x,ze=ct.y,Ze=ct.z):(De=0,ze=0,Ze=0);const Se=fe.convert(Q.format),Jt=fe.convert(Q.type);let en;Q.isData3DTexture?(O.setTexture3D(Q,0),en=H.TEXTURE_3D):Q.isDataArrayTexture||Q.isCompressedArrayTexture?(O.setTexture2DArray(Q,0),en=H.TEXTURE_2D_ARRAY):(O.setTexture2D(Q,0),en=H.TEXTURE_2D),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,Q.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,Q.unpackAlignment);const we=H.getParameter(H.UNPACK_ROW_LENGTH),En=H.getParameter(H.UNPACK_IMAGE_HEIGHT),$e=H.getParameter(H.UNPACK_SKIP_PIXELS),Fn=H.getParameter(H.UNPACK_SKIP_ROWS),La=H.getParameter(H.UNPACK_SKIP_IMAGES);H.pixelStorei(H.UNPACK_ROW_LENGTH,We.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,We.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,ae),H.pixelStorei(H.UNPACK_SKIP_ROWS,le),H.pixelStorei(H.UNPACK_SKIP_IMAGES,ee);const Ye=N.isDataArrayTexture||N.isData3DTexture,cn=Q.isDataArrayTexture||Q.isData3DTexture;if(N.isDepthTexture){const mn=Vt.get(N),Rn=Vt.get(Q),Cn=Vt.get(mn.__renderTarget),ls=Vt.get(Rn.__renderTarget);Nt.bindFramebuffer(H.READ_FRAMEBUFFER,Cn.__webglFramebuffer),Nt.bindFramebuffer(H.DRAW_FRAMEBUFFER,ls.__webglFramebuffer);for(let la=0;la<Bt;la++)Ye&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Vt.get(N).__webglTexture,J,ee+la),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Vt.get(Q).__webglTexture,wt,Ze+la)),H.blitFramebuffer(ae,le,Pt,Lt,De,ze,Pt,Lt,H.DEPTH_BUFFER_BIT,H.NEAREST);Nt.bindFramebuffer(H.READ_FRAMEBUFFER,null),Nt.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if(J!==0||N.isRenderTargetTexture||Vt.has(N)){const mn=Vt.get(N),Rn=Vt.get(Q);Nt.bindFramebuffer(H.READ_FRAMEBUFFER,ef),Nt.bindFramebuffer(H.DRAW_FRAMEBUFFER,Bl);for(let Cn=0;Cn<Bt;Cn++)Ye?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,mn.__webglTexture,J,ee+Cn):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,mn.__webglTexture,J),cn?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Rn.__webglTexture,wt,Ze+Cn):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Rn.__webglTexture,wt),J!==0?H.blitFramebuffer(ae,le,Pt,Lt,De,ze,Pt,Lt,H.COLOR_BUFFER_BIT,H.NEAREST):cn?H.copyTexSubImage3D(en,wt,De,ze,Ze+Cn,ae,le,Pt,Lt):H.copyTexSubImage2D(en,wt,De,ze,ae,le,Pt,Lt);Nt.bindFramebuffer(H.READ_FRAMEBUFFER,null),Nt.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else cn?N.isDataTexture||N.isData3DTexture?H.texSubImage3D(en,wt,De,ze,Ze,Pt,Lt,Bt,Se,Jt,We.data):Q.isCompressedArrayTexture?H.compressedTexSubImage3D(en,wt,De,ze,Ze,Pt,Lt,Bt,Se,We.data):H.texSubImage3D(en,wt,De,ze,Ze,Pt,Lt,Bt,Se,Jt,We):N.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,wt,De,ze,Pt,Lt,Se,Jt,We.data):N.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,wt,De,ze,We.width,We.height,Se,We.data):H.texSubImage2D(H.TEXTURE_2D,wt,De,ze,Pt,Lt,Se,Jt,We);H.pixelStorei(H.UNPACK_ROW_LENGTH,we),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,En),H.pixelStorei(H.UNPACK_SKIP_PIXELS,$e),H.pixelStorei(H.UNPACK_SKIP_ROWS,Fn),H.pixelStorei(H.UNPACK_SKIP_IMAGES,La),wt===0&&Q.generateMipmaps&&H.generateMipmap(en),Nt.unbindTexture()},this.copyTextureToTexture3D=function(N,Q,lt=null,ct=null,J=0){return Bu('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(N,Q,lt,ct,J)},this.initRenderTarget=function(N){Vt.get(N).__webglFramebuffer===void 0&&O.setupRenderTarget(N)},this.initTexture=function(N){N.isCubeTexture?O.setTextureCube(N,0):N.isData3DTexture?O.setTexture3D(N,0):N.isDataArrayTexture||N.isCompressedArrayTexture?O.setTexture2DArray(N,0):O.setTexture2D(N,0),Nt.unbindTexture()},this.resetState=function(){P=0,L=0,V=null,Nt.reset(),dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Da}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorSpace=Pe._getDrawingBufferColorSpace(e),i.unpackColorSpace=Pe._getUnpackColorSpace()}}const sx={type:"change"},Tm={type:"start"},qx={type:"end"},Nu=new xm,ox=new dr,VC=Math.cos(70*gT.DEG2RAD),vn=new $,ii=2*Math.PI,je={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},mp=1e-6;class jC extends r1{constructor(e,i=null){super(e,i),this.state=je.NONE,this.target=new $,this.cursor=new $,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ho.ROTATE,MIDDLE:ho.DOLLY,RIGHT:ho.PAN},this.touches={ONE:co.ROTATE,TWO:co.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new $,this._lastQuaternion=new vr,this._lastTargetPosition=new $,this._quat=new vr().setFromUnitVectors(e.up,new $(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Uy,this._sphericalDelta=new Uy,this._scale=1,this._panOffset=new $,this._rotateStart=new me,this._rotateEnd=new me,this._rotateDelta=new me,this._panStart=new me,this._panEnd=new me,this._panDelta=new me,this._dollyStart=new me,this._dollyEnd=new me,this._dollyDelta=new me,this._dollyDirection=new $,this._mouse=new me,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=WC.bind(this),this._onPointerDown=XC.bind(this),this._onPointerUp=YC.bind(this),this._onContextMenu=t2.bind(this),this._onMouseWheel=KC.bind(this),this._onKeyDown=QC.bind(this),this._onTouchStart=JC.bind(this),this._onTouchMove=$C.bind(this),this._onMouseDown=qC.bind(this),this._onMouseMove=ZC.bind(this),this._interceptControlDown=e2.bind(this),this._interceptControlUp=n2.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(sx),this.update(),this.state=je.NONE}update(e=null){const i=this.object.position;vn.copy(i).sub(this.target),vn.applyQuaternion(this._quat),this._spherical.setFromVector3(vn),this.autoRotate&&this.state===je.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let r=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(r)&&isFinite(l)&&(r<-Math.PI?r+=ii:r>Math.PI&&(r-=ii),l<-Math.PI?l+=ii:l>Math.PI&&(l-=ii),r<=l?this._spherical.theta=Math.max(r,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(r+l)/2?Math.max(r,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let u=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const h=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),u=h!=this._spherical.radius}if(vn.setFromSpherical(this._spherical),vn.applyQuaternion(this._quatInverse),i.copy(this.target).add(vn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let h=null;if(this.object.isPerspectiveCamera){const d=vn.length();h=this._clampDistance(d*this._scale);const p=d-h;this.object.position.addScaledVector(this._dollyDirection,p),this.object.updateMatrixWorld(),u=!!p}else if(this.object.isOrthographicCamera){const d=new $(this._mouse.x,this._mouse.y,0);d.unproject(this.object);const p=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),u=p!==this.object.zoom;const g=new $(this._mouse.x,this._mouse.y,0);g.unproject(this.object),this.object.position.sub(g).add(d),this.object.updateMatrixWorld(),h=vn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;h!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(h).add(this.object.position):(Nu.origin.copy(this.object.position),Nu.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Nu.direction))<VC?this.object.lookAt(this.target):(ox.setFromNormalAndCoplanarPoint(this.object.up,this.target),Nu.intersectPlane(ox,this.target))))}else if(this.object.isOrthographicCamera){const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),h!==this.object.zoom&&(this.object.updateProjectionMatrix(),u=!0)}return this._scale=1,this._performCursorZoom=!1,u||this._lastPosition.distanceToSquared(this.object.position)>mp||8*(1-this._lastQuaternion.dot(this.object.quaternion))>mp||this._lastTargetPosition.distanceToSquared(this.target)>mp?(this.dispatchEvent(sx),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ii/60*this.autoRotateSpeed*e:ii/60/60*this.autoRotateSpeed}_getZoomScale(e){const i=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,i){vn.setFromMatrixColumn(i,0),vn.multiplyScalar(-e),this._panOffset.add(vn)}_panUp(e,i){this.screenSpacePanning===!0?vn.setFromMatrixColumn(i,1):(vn.setFromMatrixColumn(i,0),vn.crossVectors(this.object.up,vn)),vn.multiplyScalar(e),this._panOffset.add(vn)}_pan(e,i){const r=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;vn.copy(l).sub(this.target);let u=vn.length();u*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*u/r.clientHeight,this.object.matrix),this._panUp(2*i*u/r.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/r.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/r.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const r=this.domElement.getBoundingClientRect(),l=e-r.left,u=i-r.top,h=r.width,d=r.height;this._mouse.x=l/h*2-1,this._mouse.y=-(u/d)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(ii*this._rotateDelta.x/i.clientHeight),this._rotateUp(ii*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let i=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(ii*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-ii*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(ii*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-ii*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._rotateStart.set(r,l)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panStart.set(r,l)}}_handleTouchStartDolly(e){const i=this._getSecondPointerPosition(e),r=e.pageX-i.x,l=e.pageY-i.y,u=Math.sqrt(r*r+l*l);this._dollyStart.set(0,u)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const r=this._getSecondPointerPosition(e),l=.5*(e.pageX+r.x),u=.5*(e.pageY+r.y);this._rotateEnd.set(l,u)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(ii*this._rotateDelta.x/i.clientHeight),this._rotateUp(ii*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panEnd.set(r,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const i=this._getSecondPointerPosition(e),r=e.pageX-i.x,l=e.pageY-i.y,u=Math.sqrt(r*r+l*l);this._dollyEnd.set(0,u),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const h=(e.pageX+i.x)*.5,d=(e.pageY+i.y)*.5;this._updateZoomParameters(h,d)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(e){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId)return!0;return!1}_trackPointer(e){let i=this._pointerPositions[e.pointerId];i===void 0&&(i=new me,this._pointerPositions[e.pointerId]=i),i.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const i=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(e){const i=e.deltaMode,r={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(i){case 1:r.deltaY*=16;break;case 2:r.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(r.deltaY*=10),r}}function XC(o){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(o.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(o)&&(this._addPointer(o),o.pointerType==="touch"?this._onTouchStart(o):this._onMouseDown(o)))}function WC(o){this.enabled!==!1&&(o.pointerType==="touch"?this._onTouchMove(o):this._onMouseMove(o))}function YC(o){switch(this._removePointer(o),this._pointers.length){case 0:this.domElement.releasePointerCapture(o.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(qx),this.state=je.NONE;break;case 1:const e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y});break}}function qC(o){let e;switch(o.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ho.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(o),this.state=je.DOLLY;break;case ho.ROTATE:if(o.ctrlKey||o.metaKey||o.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(o),this.state=je.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(o),this.state=je.ROTATE}break;case ho.PAN:if(o.ctrlKey||o.metaKey||o.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(o),this.state=je.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(o),this.state=je.PAN}break;default:this.state=je.NONE}this.state!==je.NONE&&this.dispatchEvent(Tm)}function ZC(o){switch(this.state){case je.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(o);break;case je.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(o);break;case je.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(o);break}}function KC(o){this.enabled===!1||this.enableZoom===!1||this.state!==je.NONE||(o.preventDefault(),this.dispatchEvent(Tm),this._handleMouseWheel(this._customWheelEvent(o)),this.dispatchEvent(qx))}function QC(o){this.enabled!==!1&&this._handleKeyDown(o)}function JC(o){switch(this._trackPointer(o),this._pointers.length){case 1:switch(this.touches.ONE){case co.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(o),this.state=je.TOUCH_ROTATE;break;case co.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(o),this.state=je.TOUCH_PAN;break;default:this.state=je.NONE}break;case 2:switch(this.touches.TWO){case co.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(o),this.state=je.TOUCH_DOLLY_PAN;break;case co.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(o),this.state=je.TOUCH_DOLLY_ROTATE;break;default:this.state=je.NONE}break;default:this.state=je.NONE}this.state!==je.NONE&&this.dispatchEvent(Tm)}function $C(o){switch(this._trackPointer(o),this.state){case je.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(o),this.update();break;case je.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(o),this.update();break;case je.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(o),this.update();break;case je.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(o),this.update();break;default:this.state=je.NONE}}function t2(o){this.enabled!==!1&&o.preventDefault()}function e2(o){o.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function n2(o){o.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function i2(){try{const o=document.createElement("canvas");return!!(o.getContext("webgl2")||o.getContext("webgl"))}catch{return!1}}const Zx=Et.forwardRef(({segments:o,turtle:e,theme:i,guideSegments:r,onSwitchTo2D:l},u)=>{const h=Et.useRef(null),[d,p]=Et.useState(()=>i2()?null:"Twoja przeglądarka lub urządzenie nie obsługuje WebGL, który jest wymagany do wyświetlania sceny 3D."),g=Et.useRef(null),_=Et.useRef(null),m=Et.useRef(null),y=Et.useRef(null),x=Et.useRef(null),b=Et.useRef(null),T=Et.useRef(null),M=Et.useRef(null),S=Et.useRef(null),G=Et.useCallback(()=>{const F=_.current,P=y.current;!F||!P||(F.position.set(170,-190,150),P.target.set(0,40,20),P.update())},[]),I=Et.useCallback(F=>{const P=_.current,L=y.current,V=m.current,C=g.current;if(!P||!L)return;const E=F??o,k=new xr;let et=!1;const tt=vt=>{if(vt)for(const At of vt)k.expandByPoint(new $(At.from[0],At.from[1],At.from[2])),k.expandByPoint(new $(At.to[0],At.to[1],At.to[2])),et=!0};if(tt(E),tt(r),!et){G();return}const ut=new $,ft=new os;k.getCenter(ut),k.getBoundingSphere(ft);const X=Math.max(25,ft.radius),it=P.fov*Math.PI/180,W=X/Math.sin(it/2)*1.18,mt=new $(.68,-.78,.56).normalize();P.position.copy(ut).addScaledVector(mt,W),P.near=Math.max(.5,W/500),P.far=Math.max(4e3,W*12),P.updateProjectionMatrix(),L.target.copy(ut),L.update(),V&&C&&V.render(C,P)},[o,r,G]),z=Et.useCallback(()=>{const F=m.current,P=g.current,L=_.current;return!F||!P||!L?null:(F.render(P,L),F.domElement.toDataURL("image/png"))},[]);return Et.useImperativeHandle(u,()=>({fit:I,resetView:G,exportPng:z}),[I,G,z]),Et.useEffect(()=>{if(d)return;const F=h.current;if(!F)return;let P;try{P=new GC({antialias:!0,preserveDrawingBuffer:!0,alpha:!1})}catch{p("Nie udało się uruchomić kontekstu WebGL w tej przeglądarce.");return}const L=Math.max(1,F.clientWidth),V=Math.max(1,F.clientHeight);P.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),P.setSize(L,V),F.innerHTML="",F.appendChild(P.domElement);const C=new XT,E=new Ri(45,L/V,1,8e3);E.up.set(0,0,1),E.position.set(170,-190,150);const k=new jC(E,P.domElement);k.enableDamping=!0,k.dampingFactor=.08,k.target.set(0,40,20),k.update();const et=new n1(16777215,.78);C.add(et);const tt=new zy(16777215,.65);tt.position.set(220,-160,320),C.add(tt);const ut=new zy(16777215,.25);ut.position.set(-180,200,-100),C.add(ut);const ft=new Ly(400,20,9347224,13950166);ft.rotation.x=Math.PI/2,C.add(ft),S.current=ft;const X=new a1(90);C.add(X);const it=new uo;C.add(it),b.current=it;const W=new uo,mt=new Em(5.5,16,12),vt=new Au({color:1476202,roughness:.35,metalness:.08}),At=new ai(mt,vt);At.position.y=4,W.add(At);const Xt=new rs(1.4,7,5),he=new Au({color:15051068,roughness:.4}),R=new ai(Xt,he);R.position.set(0,-1,3.5),W.add(R);const Y=new rs(11,1.8,1.2),pt=new Au({color:3886406,roughness:.5}),ht=new ai(Y,pt);ht.position.set(0,-2,0),W.add(ht),C.add(W),T.current=W,M.current=vt,g.current=C,_.current=E,m.current=P,y.current=k;let Ct=0;const Ut=()=>{Ct=requestAnimationFrame(Ut),k.update(),P.render(C,E)};Ut();const bt=new ResizeObserver(()=>{if(!F)return;const Dt=Math.max(1,F.clientWidth),zt=Math.max(1,F.clientHeight);E.aspect=Dt/zt,E.updateProjectionMatrix(),P.setSize(Dt,zt)});return bt.observe(F),()=>{cancelAnimationFrame(Ct),bt.disconnect(),k.dispose(),x.current&&(x.current.geometry.dispose(),x.current.material.dispose(),x.current=null),P.dispose(),g.current=null,_.current=null,m.current=null,y.current=null}},[d]),Et.useEffect(()=>{const F=g.current;if(!F)return;const P=i==="dark";if(F.background=new Te(P?792083:16448246),S.current){F.remove(S.current),S.current.dispose();const L=new Ly(400,20,P?2902592:12108988,P?1452323:15001826);L.rotation.x=Math.PI/2,F.add(L),S.current=L}},[i,d]),Et.useEffect(()=>{const F=g.current;if(!F||(x.current&&(F.remove(x.current),x.current.geometry.dispose(),x.current.material.dispose(),x.current=null),o.length===0))return;const P=new Qu(1,1,1,8,1,!1),L=new Au({color:16777215,roughness:.45,metalness:.05}),V=new qT(P,L,o.length),C=new $(0,1,0),E=new $,k=new $,et=new $,tt=new $,ut=new vr,ft=new $,X=new Xe,it=new Te;for(let W=0;W<o.length;W++){const mt=o[W];E.set(mt.from[0],mt.from[1],mt.from[2]),k.set(mt.to[0],mt.to[1],mt.to[2]),et.subVectors(k,E);const vt=et.length();if(vt<1e-6)ft.set(0,0,0),X.compose(E,ut.identity(),ft);else{tt.addVectors(E,k).multiplyScalar(.5),et.divideScalar(vt),ut.setFromUnitVectors(C,et);const At=Math.max(.45,mt.width*.42);ft.set(At,vt,At),X.compose(tt,ut,ft)}V.setMatrixAt(W,X),it.set(mt.color),V.setColorAt(W,it)}V.instanceMatrix.needsUpdate=!0,V.instanceColor&&(V.instanceColor.needsUpdate=!0),F.add(V),x.current=V},[o,d]),Et.useEffect(()=>{const F=b.current;if(!F)return;for(;F.children.length>0;){const E=F.children[0];E.geometry.dispose(),E.material.dispose(),F.remove(E)}if(!r||r.length===0)return;const P=[];for(const E of r)P.push(E.from[0],E.from[1],E.from[2],E.to[0],E.to[1],E.to[2]);const L=new Ci;L.setAttribute("position",new In(P,3));const V=new Ku({color:i==="dark"?8560019:5926502,transparent:!0,opacity:.45}),C=new Mm(L,V);F.add(C)},[r,i,d]),Et.useEffect(()=>{const F=T.current,P=M.current;if(!F||!P)return;F.position.set(e.pos[0],e.pos[1],e.pos[2]);const L=new Xe().makeBasis(new $(e.right[0],e.right[1],e.right[2]),new $(e.heading[0],e.heading[1],e.heading[2]),new $(e.up[0],e.up[1],e.up[2]));F.quaternion.setFromRotationMatrix(L),P.color.set(e.color),P.opacity=e.penDown?1:.45,P.transparent=!e.penDown},[e,d]),d?D.jsxs("div",{className:"webgl-fallback",role:"status",children:[D.jsx(px,{size:28}),D.jsx("h2",{children:"Widok 3D jest niedostępny"}),D.jsx("p",{children:d}),D.jsx("p",{children:"Tryb 2D działa bez WebGL — możesz przełączyć się na płaszczyznę i kontynuować pracę."}),D.jsx("button",{type:"button",className:"btn btn-primary",onClick:l,children:"Przejdź do trybu 2D"})]}):D.jsxs("div",{style:{position:"relative",width:"100%",height:"100%"},children:[D.jsx("div",{ref:h,style:{width:"100%",height:"100%",cursor:"grab"},"aria-label":"Scena 3D — przeciągnij, aby obrócić kamerę, prawy przycisk przesuwa, kółko przybliża"}),D.jsxs("div",{className:"viewport-overlay-controls",role:"toolbar","aria-label":"Widok 3D",children:[D.jsx("button",{type:"button",className:"btn btn-ghost btn-icon btn-sm",onClick:()=>I(),title:"Dopasuj rysunek do kadru","aria-label":"Dopasuj rysunek 3D do kadru",children:D.jsx(hx,{size:15})}),D.jsx("button",{type:"button",className:"btn btn-ghost btn-icon btn-sm",onClick:G,title:"Resetuj kamerę 3D","aria-label":"Przywróć domyślne ustawienie kamery 3D",children:D.jsx(um,{size:15})})]})]})});Zx.displayName="Canvas3D";function Tl(o){return(Math.abs(o)<.05?0:o).toFixed(1)}function a2(o){return(Math.atan2(o.heading[0],o.heading[1])*180/Math.PI%360+360)%360}function r2(o){const e=Math.max(-1,Math.min(1,o.heading[2]));return Math.asin(e)*180/Math.PI}const s2=({mode:o,turtle:e,operations:i,segmentCount:r,activeLine:l})=>{const u=a2(e),h=r2(e);return D.jsxs("div",{className:"telemetry-strip tabular","aria-label":"Telemetria żółwia",children:[D.jsxs("div",{className:"telemetry-group",children:[D.jsxs("span",{className:"telemetry-cell",children:[D.jsx("span",{className:"telemetry-key",children:"POZ"}),D.jsx("span",{className:"telemetry-val",children:o==="2d"?`(${Tl(e.pos[0])}, ${Tl(e.pos[1])})`:`(${Tl(e.pos[0])}, ${Tl(e.pos[1])}, ${Tl(e.pos[2])})`})]}),D.jsxs("span",{className:"telemetry-cell",children:[D.jsx("span",{className:"telemetry-key",children:"KĄT"}),D.jsxs("span",{className:"telemetry-val",children:[Math.round(u),"°"]})]}),o==="3d"&&D.jsxs("span",{className:"telemetry-cell",children:[D.jsx("span",{className:"telemetry-key",children:"NACHYL"}),D.jsxs("span",{className:"telemetry-val",children:[Math.round(h),"°"]})]}),D.jsxs("span",{className:"telemetry-cell",children:[D.jsx("span",{className:"telemetry-key",children:"PISAK"}),D.jsx("span",{className:"pen-swatch",style:{backgroundColor:e.penDown?e.color:"transparent"},title:e.penDown?`Opuszczony (${e.color})`:"Podniesiony"}),D.jsx("span",{className:"telemetry-val",children:e.penDown?`${e.width}px`:"podniesiony"})]})]}),D.jsxs("div",{className:"telemetry-group",children:[l!==null&&D.jsxs("span",{className:"telemetry-cell",children:[D.jsx("span",{className:"telemetry-key",children:"WIERSZ"}),D.jsx("span",{className:"telemetry-val",children:l})]}),D.jsxs("span",{className:"telemetry-cell",children:[D.jsx("span",{className:"telemetry-key",children:"KROKI"}),D.jsx("span",{className:"telemetry-val",children:i})]}),D.jsxs("span",{className:"telemetry-cell",children:[D.jsx("span",{className:"telemetry-key",children:"ODCINKI"}),D.jsx("span",{className:"telemetry-val",children:r})]})]})]})};function lx(o,e){if(e==="2d")return[o[0],-o[1]];const i=-Math.PI/4,r=Math.PI/6,l=Math.cos(i),u=Math.sin(i),h=o[0]*l-o[1]*u,d=o[0]*u+o[1]*l,p=h,g=-(o[2]*Math.cos(r)+d*Math.sin(r));return[p,g]}const Kx=({segments:o,mode:e,label:i})=>{const r=Et.useMemo(()=>{if(o.length===0)return{lines:[],viewBox:"-50 -50 100 100",strokeScale:1};let l=1/0,u=-1/0,h=1/0,d=-1/0;const p=o.map(S=>{const[G,I]=lx(S.from,e),[z,F]=lx(S.to,e);return G<l&&(l=G),z<l&&(l=z),G>u&&(u=G),z>u&&(u=z),I<h&&(h=I),F<h&&(h=F),I>d&&(d=I),F>d&&(d=F),{x1:G,y1:I,x2:z,y2:F,color:S.color,width:S.width}}),g=Math.max(10,u-l),_=Math.max(10,d-h),m=Math.max(g,_),y=m*.14,x=(l+u)/2,b=(h+d)/2,T=m+y*2,M=Math.max(.6,T/180);return{lines:p,viewBox:`${x-T/2} ${b-T/2} ${T} ${T}`,strokeScale:M}},[o,e]);return D.jsx("svg",{viewBox:r.viewBox,role:"img","aria-label":i,preserveAspectRatio:"xMidYMid meet",children:r.lines.map((l,u)=>D.jsx("line",{x1:l.x1,y1:l.y1,x2:l.x2,y2:l.y2,stroke:l.color,strokeWidth:Math.max(1.1,l.width*.55)*r.strokeScale,strokeLinecap:"round"},u))})},o2=({onSelectExample:o})=>{const[e,i]=Et.useState("all"),r=Et.useMemo(()=>{const u=new Map;for(const h of Hu)u.set(h.id,cm(h.source,h.mode).segments);return u},[]),l=Hu.filter(u=>e==="all"||u.mode===e);return D.jsx("main",{className:"page-scroll",children:D.jsxs("div",{className:"page-container",children:[D.jsxs("div",{className:"page-header",children:[D.jsxs("div",{children:[D.jsx("h1",{children:"Programy przykładowe"}),D.jsx("p",{children:"Trzynaście klasycznych rysunków 2D i 3D gotowych do uruchomienia. Wczytanie przykładu przełączy pracownię na właściwy tryb."})]}),D.jsxs("div",{className:"filter-row",role:"group","aria-label":"Filtruj przykłady według trybu",children:[D.jsx("button",{type:"button",className:"filter-btn","aria-pressed":e==="all",onClick:()=>i("all"),children:"Wszystkie (13)"}),D.jsx("button",{type:"button",className:"filter-btn","aria-pressed":e==="2d",onClick:()=>i("2d"),children:"2D (7)"}),D.jsx("button",{type:"button",className:"filter-btn","aria-pressed":e==="3d",onClick:()=>i("3d"),children:"3D (6)"})]})]}),D.jsx("div",{className:"examples-grid",children:l.map(u=>D.jsxs("article",{className:"example-card",children:[D.jsx("div",{className:"example-preview",children:D.jsx(Kx,{segments:r.get(u.id)??[],mode:u.mode,label:`Podgląd przykładu ${u.name}`})}),D.jsxs("div",{className:"example-body",children:[D.jsxs("div",{className:"example-head",children:[D.jsx("h2",{className:"example-title",children:u.name}),D.jsx("span",{className:`mode-tag${u.mode==="3d"?" is-3d":""}`,children:u.mode.toUpperCase()})]}),D.jsx("p",{className:"example-desc",children:u.description}),D.jsx("div",{className:"example-actions",children:D.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>o(u),children:"Otwórz w pracowni"})})]})]},u.id))})]})})},l2=({solvedIds:o,activeChallengeId:e,onStartChallenge:i})=>{const[r,l]=Et.useState(e??Jr[0].id),[u,h]=Et.useState(!1),d=Jr.find(_=>_.id===r)??Jr[0],p=yp(d),g=o.includes(d.id);return D.jsx("main",{className:"page-scroll",children:D.jsxs("div",{className:"page-container",children:[D.jsxs("div",{className:"page-header",children:[D.jsxs("div",{children:[D.jsx("h1",{children:"Wyzwania rysunkowe"}),D.jsx("p",{children:"Napisz program, który odtworzy wskazany kształt. Pracownia automatycznie sprawdzi geometrię Twojego rysunku i zapisze postęp w przeglądarce."})]}),D.jsxs("div",{className:"tabular",style:{fontSize:13,color:"var(--text-secondary)",fontWeight:600},children:["Ukończono: ",o.length," z ",Jr.length]})]}),D.jsxs("div",{className:"challenges-layout",children:[D.jsx("div",{className:"challenge-list",role:"list","aria-label":"Lista wyzwań",children:Jr.map(_=>{const m=o.includes(_.id);return D.jsxs("button",{type:"button",className:"challenge-item","aria-current":_.id===d.id?"true":void 0,onClick:()=>{l(_.id),h(!1)},children:[D.jsxs("div",{className:"challenge-item-top",children:[D.jsx("span",{className:"challenge-item-title",children:_.title}),D.jsx("span",{className:`mode-tag${_.mode==="3d"?" is-3d":""}`,children:_.mode.toUpperCase()})]}),D.jsxs("div",{className:"challenge-item-top",children:[D.jsx("span",{style:{fontSize:12,color:"var(--text-muted)"},children:_.difficulty}),D.jsx("span",{className:`challenge-status${m?" is-solved":""}`,children:m?"Zaliczone":"Do zrobienia"})]})]},_.id)})}),D.jsxs("section",{className:"challenge-detail","aria-label":`Szczegóły wyzwania: ${d.title}`,children:[D.jsxs("div",{className:"example-head",children:[D.jsx("h2",{style:{margin:0,fontSize:18},children:d.title}),D.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[g&&D.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:4,fontSize:12.5,fontWeight:600,color:"var(--success)"},children:[D.jsx(dx,{size:14})," Zaliczone"]}),D.jsx("span",{className:`mode-tag${d.mode==="3d"?" is-3d":""}`,children:d.mode.toUpperCase()})]})]}),D.jsxs("div",{className:"challenge-detail-grid",children:[D.jsxs("div",{className:"challenge-target-box",children:[D.jsx(Kx,{segments:p,mode:d.mode,label:`Docelowy rysunek wyzwania ${d.title}`}),D.jsxs("div",{className:"challenge-target-caption",children:["Docelowy kształt (tolerancja ±",d.tolerance," jedn.)"]})]}),D.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[D.jsx("p",{style:{margin:0,color:"var(--text-primary)"},children:d.prompt}),D.jsx("div",{children:D.jsx("button",{type:"button",className:"btn btn-sm",onClick:()=>h(_=>!_),"aria-expanded":u,children:u?"Ukryj podpowiedź":"Pokaż podpowiedź"})}),u&&D.jsx("div",{className:"challenge-hint",children:d.hint}),D.jsx("div",{style:{display:"flex",gap:8,marginTop:4},children:D.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>i(d),children:"Rozwiąż w pracowni"})})]})]})]})]})]})})},c2=[{polish:"np, naprzod, naprzód",english:"fd, forward",args:"wyrażenie",category:"Ruch",mode:"2d",meaning:"Przesuwa żółwia naprzód o podaną odległość. Gdy pisak jest opuszczony, rysuje odcinek.",example:"np 100"},{polish:"ws, wstecz",english:"bk, back",args:"wyrażenie",category:"Ruch",mode:"2d",meaning:"Przesuwa żółwia wstecz bez zmiany kierunku, w którym jest zwrócony.",example:"ws 60"},{polish:"pw, prawo",english:"rt, right",args:"wyrażenie (stopnie)",category:"Ruch",mode:"2d",meaning:"Obraca żółwia w prawo (zgodnie z ruchem wskazówek zegara patrząc z góry) o zadaną liczbę stopni.",example:`pw 90
np 80`},{polish:"lw, lewo",english:"lt, left",args:"wyrażenie (stopnie)",category:"Ruch",mode:"2d",meaning:"Obraca żółwia w lewo o zadaną liczbę stopni.",example:`lw 45
np 90`},{polish:"dom",english:"home",args:"brak",category:"Ruch",mode:"2d",meaning:"Wraca żółwia do punktu (0, 0, 0) i przywraca początkową orientację (+Y, góra +Z). Rysuje linię, jeśli pisak jest opuszczony.",example:`np 80 pw 90 np 60
dom`},{polish:"pod, podnies, podnieś",english:"pu, penup",args:"brak",category:"Pisak",mode:"2d",meaning:"Podnosi pisak — kolejne ruchy nie rysują odcinków.",example:`np 50
pod np 30 opu
np 50`},{polish:"opu, opusc, opuść",english:"pd, pendown",args:"brak",category:"Pisak",mode:"2d",meaning:"Opuszcza pisak — żółw znów zostawia ślad.",example:`pod np 40
opu np 80`},{polish:"kolor",english:"color",args:'"#rrggbb"',category:"Pisak",mode:"2d",meaning:"Ustawia kolor pisaka jako sześciocyfrowy kod szesnastkowy w cudzysłowie (wielkość liter bez znaczenia).",example:`kolor "#c1763d"
np 100`},{polish:"grubosc, grubość",english:"width",args:"wyrażenie (całkowite 1–12)",category:"Pisak",mode:"2d",meaning:"Ustawia grubość rysowanej linii (liczba całkowita od 1 do 12).",example:`grubosc 6
np 120`},{polish:"czyść, czysc",english:"cs, clearscreen",args:"brak",category:"Pisak",mode:"2d",meaning:"Usuwa wszystkie narysowane dotąd odcinki, zachowując pozycję żółwia, kolor i grubość pisaka.",example:`np 80
czyść
pw 90 np 80`},{polish:"powtorz, powtórz",english:"repeat",args:"liczba (0–10000) [ blok ]",category:"Sterowanie",mode:"2d",meaning:"Wykonuje blok poleceń wskazaną liczbę razy. Wewnątrz bloku dostępna jest wartość `nrpowt` (`repcount`) liczona od 1.",example:`powtorz 6 [
  np nrpowt * 15
  pw 60
]`},{polish:"niech",english:"let",args:"nazwa wyrażenie",category:"Sterowanie",mode:"2d",meaning:"Tworzy lub aktualizuje zmienną. Na poziomie głównym jest globalna, a w procedurze — lokalna (przesłania globalną na czas wywołania).",example:`niech bok 90
powtorz 4 [np bok pw 90]`},{polish:"jeśli, jesli",english:"if",args:"warunek [ blok ]",category:"Sterowanie",mode:"2d",meaning:"Wykonuje blok tylko wtedy, gdy warunek (`<`, `>`, `=`, `<=`, `>=`, `<>`) jest prawdziwy.",example:`powtorz 8 [
  jeśli nrpowt > 4 [kolor "#c1763d"]
  np 40 pw 45
]`},{polish:"jeżeli, jezeli",english:"ifelse",args:"warunek [ prawda ] [ fałsz ]",category:"Sterowanie",mode:"2d",meaning:"Wykonuje pierwszy blok, gdy warunek jest prawdziwy, a drugi w przeciwnym razie.",example:`niech a 1
powtorz 6 [
  jeżeli a > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech a -a
  np 50 pw 60
]`},{polish:"stop",english:"stop",args:"brak",category:"Sterowanie",mode:"2d",meaning:"Natychmiast kończy bieżące wywołanie procedury (również z wnętrza pętli lub warunku). Na poziomie głównym zatrzymuje cały program.",example:`oto linia ma: d
  jeśli d < 10 [stop]
  np d pw 90
  linia d - 15
już
linia 80`},{polish:"gora, góra",english:"pitchup",args:"wyrażenie (stopnie)",category:"Przestrzeń 3D",mode:"3d",meaning:"Podnosi nos żółwia ku górze (obrót wokół osi prawej). Działa wyłącznie w trybie 3D.",example:`gora 45
np 100`},{polish:"dol, dół",english:"pitchdown",args:"wyrażenie (stopnie)",category:"Przestrzeń 3D",mode:"3d",meaning:"Opuszcza nos żółwia w dół (odwrotność `gora`). Działa wyłącznie w trybie 3D.",example:`gora 90 np 60
dol 90 np 80`},{polish:"pp, przechylprawo",english:"rr, rollright",args:"wyrażenie (stopnie)",category:"Przestrzeń 3D",mode:"3d",meaning:"Przechyla żółwia w prawo wokół jego kierunku lotu (wektor góry skręca ku prawemu bokowi). Tylko 3D.",example:`powtorz 4 [
  powtorz 36 [np 8 gora 10]
  pp 45
]`},{polish:"pl, przechyllewo",english:"rl, rollleft",args:"wyrażenie (stopnie)",category:"Przestrzeń 3D",mode:"3d",meaning:"Przechyla żółwia w lewo wokół jego kierunku lotu. Tylko 3D.",example:`pl 45
gora 90 np 80`}],u2=[{id:"wyrazenia",title:"Wyrażenia i zasada spacji",body:["Każdy argument liczbowy przyjmuje liczbę dziesiętną (`80`, `12.5`, `.5`), nazwę zmiennej lub parametru (także w zapisie `:nazwa`), `nrpowt` (`repcount`), nawiasy `( ... )`, znaki jednoargumentowe `+` / `-` oraz operatory `+`, `-`, `*`, `/`.","Mnożenie i dzielenie wiążą silniej niż dodawanie i odejmowanie, a operatory równego priorytetu łączą od lewej (`20 - 5 - 3` daje `12`, a `2 + 3 * 4` daje `14`).","Ważna zasada: operator binarny (`+`, `-`, `*`, `/`) musi mieć spacje po obu stronach albo po żadnej (`np 10 - 5` i `np 10-5` dają `5`, natomiast `np 10 -5` oznacza dwa osobne argumenty `10` i `-5`). Porównania (`<`, `>`, `=`, `<=`, `>=`, `<>`) działają dokładnie na liczbach zmiennoprzecinkowych."],code:`; Zasada spacji i priorytety
np 2 + 3 * 4       ; 14
pw 90
np -(3 - 5) * 20   ; 40`},{id:"zmienne",title:"Zmienne i zasięg",body:["Polecenie `niech x 5` przypisuje wartość zmiennej `x`. Kolejne `niech x ...` nadpisuje ją. Nazwa zmiennej nie może być słowem kluczowym ani nazwą procedury.","Zmienna zdefiniowana na poziomie głównym jest globalna. Zmienna zdefiniowana przez `niech` w procedurze jest lokalna dla tego wywołania i przesłania zmienną globalną o tej samej nazwie.","Nazwa może pojawić się w wyrażeniu tylko wtedy, gdy jest parametrem procedury albo jest przypisana przez `niech` w tej procedurze lub na poziomie głównym. Odczyt zadeklarowanej, ale jeszcze nieprzypisanej zmiennej zgłasza błąd w trakcie wykonania."],code:`niech krok 40
powtorz 5 [
  np krok
  pw 72
  niech krok krok + 10
]`},{id:"procedury",title:"Procedury i rekurencja",body:["Definicja procedury zaczyna się od `oto` (lub `to`) na początku wiersza, po czym następuje nazwa i opcjonalnie `ma:` z listą parametrów rozdzielonych przecinkami. Akceptowany jest też klasyczny nagłówek `oto kwadrat :bok :kąt`.","Ciało procedury kończy się słowem `już` (`juz` lub `end`) stojącym samodzielnie w osobnym wierszu. Definicje mogą występować wyłącznie na poziomie głównym — przed lub po wywołaniach.","Procedury mogą wywoływać same siebie rekurencyjnie. Polecenie `stop` przerywa bieżące wywołanie procedury."],code:`oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90`},{id:"limity",title:"Ograniczenia i bezpieczeństwo wykonania",body:["Program jest sprawdzany w całości przed uruchomieniem: błąd składniowy lub statyczny nie rysuje nic. Błąd czasu wykonania (np. dzielenie przez zero lub przekroczenie limitu) zatrzymuje żółwia, zachowując dotychczasowy rysunek.","Limity: maksymalnie 50 000 znaków kodu, 10 000 tokenów, głębokość zagnieżdżenia nawiasów `[ ]` do 32, jednocześnie do 32 aktywnych ramek wywołań i pętli (bloki warunkowe nie zużywają ramek), 10 000 wykonanych operacji, 10 000 zachowanych odcinków (po ewentualnym `czyść`) oraz współrzędne w zakresie ±100 000."],code:`; Komentarze zaczynają się od średnika
; Grubość pisaka: 1–12, powtorz: 0–10000`}],f2=({onTryCode:o})=>{const[e,i]=Et.useState("Wszystkie"),r=["Wszystkie","Ruch","Pisak","Sterowanie","Przestrzeń 3D"],l=c2.filter(u=>e==="Wszystkie"||u.category===e);return D.jsx("main",{className:"page-scroll",children:D.jsxs("div",{className:"page-container",children:[D.jsxs("div",{className:"page-header",children:[D.jsxs("div",{children:[D.jsx("h1",{children:"Słownik języka Logomocja"}),D.jsx("p",{children:"Wszystkie polecenia (z polskimi i angielskimi aliasami bez rozróżniania wielkości liter), wyrażenia, zmienne, procedury oraz limity interpretera."})]}),D.jsx("div",{className:"filter-row",role:"group","aria-label":"Filtruj kategorię poleceń",children:r.map(u=>D.jsx("button",{type:"button",className:"filter-btn","aria-pressed":e===u,onClick:()=>i(u),children:u},u))})]}),D.jsx("div",{className:"ref-table-wrap",children:D.jsxs("table",{className:"ref-table",children:[D.jsx("thead",{children:D.jsxs("tr",{children:[D.jsx("th",{children:"Polski"}),D.jsx("th",{children:"Angielski"}),D.jsx("th",{children:"Argument"}),D.jsx("th",{children:"Działanie"}),D.jsx("th",{children:"Przykład"})]})}),D.jsx("tbody",{children:l.map(u=>D.jsxs("tr",{children:[D.jsx("td",{className:"ref-code",children:u.polish}),D.jsx("td",{className:"ref-code",children:u.english}),D.jsx("td",{children:u.args}),D.jsxs("td",{children:[u.meaning,u.mode==="3d"&&D.jsxs(D.Fragment,{children:[" ",D.jsx("span",{className:"mode-tag is-3d",children:"3D"})]})]}),D.jsx("td",{children:D.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-start"},children:[D.jsx("code",{className:"ref-code",style:{whiteSpace:"pre-wrap"},children:u.example}),D.jsx("button",{type:"button",className:"btn btn-sm",onClick:()=>o(u.example,u.mode),children:"Wypróbuj"})]})})]},u.polish))})]})}),D.jsx("div",{className:"ref-sections",children:u2.map(u=>D.jsxs("section",{className:"ref-section-card",children:[D.jsx("h2",{children:u.title}),u.body.map((h,d)=>D.jsx("p",{children:h},d)),D.jsx("pre",{className:"ref-pre",children:u.code})]},u.id))})]})})},h2=({open:o,title:e,message:i,confirmLabel:r,cancelLabel:l="Anuluj",onConfirm:u,onCancel:h})=>{const d=Et.useRef(null);return Et.useEffect(()=>{const p=d.current;p&&(o&&!p.open?p.showModal():!o&&p.open&&p.close())},[o]),D.jsxs("dialog",{ref:d,className:"confirm-dialog",onCancel:p=>{p.preventDefault(),h()},children:[D.jsxs("div",{className:"dialog-body",children:[D.jsx("h2",{children:e}),D.jsx("p",{children:i})]}),D.jsxs("div",{className:"dialog-footer",children:[D.jsx("button",{type:"button",className:"btn",onClick:h,children:l}),D.jsx("button",{type:"button",className:"btn btn-primary",onClick:u,children:r})]})]})},d2=Hu.find(o=>o.id==="kwadrat").source,p2=Hu.find(o=>o.id==="schody").source,gp={1:{label:"Wolno",delayMs:260,stepsPerTick:1},2:{label:"Umiark.",delayMs:90,stepsPerTick:1},3:{label:"Normalnie",delayMs:28,stepsPerTick:2},4:{label:"Szybko",delayMs:16,stepsPerTick:18},5:{label:"Natychmiast",delayMs:0,stepsPerTick:1e4}};function m2(){return typeof window>"u"||!window.matchMedia?"light":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}const g2=()=>{const o=Et.useMemo(()=>Qv(window.location.hash),[]),[e,i]=Et.useState(o.route),[r,l]=Et.useState(()=>o.sharedMode??ab()),[u,h]=Et.useState(()=>{const dt=Kv("2d")??d2,U=Kv("3d")??p2;return o.sharedMode&&o.sharedSource!==void 0?{"2d":o.sharedMode==="2d"?o.sharedSource:dt,"3d":o.sharedMode==="3d"?o.sharedSource:U}:{"2d":dt,"3d":U}}),[d,p]=Et.useState({"2d":!1,"3d":!1}),[g,_]=Et.useState(()=>rb()),[m,y]=Et.useState(m2),x=g==="system"?m:g,[b,T]=Et.useState("idle"),[M,S]=Et.useState([]),[G,I]=Et.useState(Kr),[z,F]=Et.useState(null),[P,L]=Et.useState(0),[V,C]=Et.useState(null),[E,k]=Et.useState(3),[et,tt]=Et.useState("code"),[ut,ft]=Et.useState(()=>ob()),[X,it]=Et.useState(null),[W,mt]=Et.useState(null),[vt,At]=Et.useState(null),[Xt,he]=Et.useState(null),R=Et.useRef(null),Y=Et.useRef(null),pt=Et.useRef(null),ht=Et.useRef(null),Ct=Et.useRef(null),Ut=u[r],bt=Et.useMemo(()=>Jr.find(dt=>dt.id===X)??null,[X]),Dt=Et.useMemo(()=>bt&&bt.mode===r?yp(bt):void 0,[bt,r]),zt=Et.useCallback(dt=>{he(dt),Ct.current&&window.clearTimeout(Ct.current),Ct.current=window.setTimeout(()=>he(null),2800)},[]);Et.useEffect(()=>{document.documentElement.setAttribute("data-theme",x)},[x]),Et.useEffect(()=>{if(!window.matchMedia)return;const dt=window.matchMedia("(prefers-color-scheme: dark)"),U=Tt=>y(Tt.matches?"dark":"light");return dt.addEventListener("change",U),()=>dt.removeEventListener("change",U)},[]);const se=Et.useCallback(dt=>{i(dt);const U=`#${dt}`;window.location.hash!==U&&!window.location.hash.startsWith(`${U}?`)&&window.history.replaceState(null,"",U)},[]);Et.useEffect(()=>{const dt=()=>{const U=Qv(window.location.hash);i(U.route),U.sharedMode&&U.sharedSource!==void 0&&(l(U.sharedMode),h(Tt=>({...Tt,[U.sharedMode]:U.sharedSource})),p(Tt=>({...Tt,[U.sharedMode]:!1})))};return window.addEventListener("hashchange",dt),()=>window.removeEventListener("hashchange",dt)},[]);const H=Et.useCallback(()=>{Y.current!==null&&(window.clearTimeout(Y.current),Y.current=null)},[]),Ue=Et.useCallback(()=>{H(),R.current=null,T("idle"),S([]),I(Kr()),F(null),L(0),C(null),mt(null)},[H]),ne=Et.useCallback(dt=>{const U=dt.getSnapshot();S(U.segments),I(U.turtle),F(U.done&&!U.error?null:U.line),L(U.operations),C(U.error),U.error?T("error"):U.done&&T("done")},[]),qt=Et.useCallback((dt,U,Tt=!0)=>{H();const{stepper:st,error:xt}=Od(dt,U);if(xt||!st)return R.current=null,S([]),I(Kr()),F(null),L(0),C(xt),T("error"),{segments:[],error:xt};const kt=st.runToEnd();R.current=st;const Ot=st.getSnapshot();return S(Ot.segments),I(Ot.turtle),F(Ot.error?Ot.line:null),L(Ot.operations),C(Ot.error),T(Ot.error?"error":"done"),Tt&&requestAnimationFrame(()=>{var ce;(ce=pt.current)==null||ce.fit(Ot.segments)}),kt},[H]),Nt=Et.useCallback(dt=>{H();const U=gp[dt]??gp[3],Tt=()=>{const st=R.current;if(!st||st.isDone()){T(st!=null&&st.getError()?"error":"done");return}for(let xt=0;xt<U.stepsPerTick&&!st.isDone();xt++)st.step();ne(st),st.isDone()||(Y.current=window.setTimeout(Tt,U.delayMs))};Y.current=window.setTimeout(Tt,U.delayMs)},[H,ne]),Wt=Et.useCallback(()=>{if(mt(null),E===5){qt(Ut,r,!1);return}H();const{stepper:dt,error:U}=Od(Ut,r);if(U||!dt){R.current=null,S([]),I(Kr()),F(null),L(0),C(U),T("error");return}R.current=dt,C(null),S([]),I(Kr()),L(0),T("running"),Nt(E)},[Ut,r,E,qt,H,Nt]),Vt=Et.useCallback(()=>{b==="running"?(H(),T("paused")):b==="paused"&&R.current&&!R.current.isDone()&&(T("running"),Nt(E))},[b,H,Nt,E]),O=Et.useCallback(()=>{mt(null),H();let dt=R.current;if(!dt||b==="idle"||b==="done"||b==="error"){const U=Od(Ut,r);if(U.error||!U.stepper){R.current=null,S([]),I(Kr()),F(null),L(0),C(U.error),T("error");return}dt=U.stepper,R.current=dt}dt.step(),ne(dt),dt.isDone()||T("paused")},[Ut,r,b,H,ne]),A=dt=>{k(dt),b==="running"&&(dt===5&&R.current?(H(),R.current.runToEnd(),ne(R.current)):Nt(dt))},rt=Et.useCallback(dt=>{(b==="running"||b==="paused")&&(H(),R.current=null,T("idle"),F(null)),h(U=>({...U,[r]:dt})),p(U=>({...U,[r]:!0})),Pd(r,dt),C(null),mt(null)},[r,b,H]),St=Et.useCallback(dt=>{if(dt===r)return;H(),l(dt),Id(dt),bt&&bt.mode!==dt&&it(null),mt(null);const U=u[dt];requestAnimationFrame(()=>{qt(U,dt,!0)})},[r,H,bt,u,qt]),Mt=Et.useCallback(dt=>{H(),l(dt.mode),Id(dt.mode),h(U=>({...U,[dt.mode]:dt.source})),p(U=>({...U,[dt.mode]:!1})),Pd(dt.mode,dt.source),it(dt.challengeId??null),mt(null),se("pracownia"),At(null),dt.autoRun!==!1?requestAnimationFrame(()=>{qt(dt.source,dt.mode,!0)}):Ue()},[H,se,qt,Ue]),gt=Et.useCallback(dt=>{d[dt.mode]&&u[dt.mode].trim()!==dt.source.trim()?At(dt):Mt(dt)},[d,u,Mt]),Qt=Et.useCallback(dt=>{gt({title:`Przykład: ${dt.name}`,mode:dt.mode,source:dt.source,challengeId:null,autoRun:!0})},[gt]),Ft=Et.useCallback(dt=>{gt({title:`Wyzwanie: ${dt.title}`,mode:dt.mode,source:dt.starterCode,challengeId:dt.id,autoRun:!0})},[gt]),Ht=Et.useCallback(()=>{if(!bt)return;const dt=qt(Ut,bt.mode,!0);if(dt.error){mt({passed:!1,reason:`Najpierw popraw błąd w programie (W${dt.error.line}:K${dt.error.column}): ${dt.error.message}`,coveragePct:0,maxDeviation:1/0});return}const U=yp(bt),Tt=ib(dt.segments,U,bt.tolerance);if(mt(Tt),Tt.passed&&!ut.includes(bt.id)){const st=[...ut,bt.id];ft(st),lb(st),zt(`Wyzwanie „${bt.title}” zaliczone!`)}},[bt,Ut,qt,ut,zt]),ye=Et.useCallback(async()=>{const dt=hb(Ut,r);window.history.replaceState(null,"",dt);try{navigator.clipboard&&navigator.clipboard.writeText?(await navigator.clipboard.writeText(dt),zt("Skopiowano link do programu do schowka.")):zt("Zaktualizowano link w pasku adresu.")}catch{zt("Zaktualizowano link w pasku adresu.")}},[Ut,r,zt]),Rt=Et.useCallback(()=>{var Tt;const dt=(Tt=pt.current)==null?void 0:Tt.exportPng();if(!dt){zt("Najpierw przejdź do pracowni, aby wyeksportować rysunek.");return}const U=document.createElement("a");U.href=dt,U.download=`logomocja-${r}.png`,U.click(),zt("Zapisano rysunek jako PNG.")},[r,zt]),Zt=Et.useCallback(()=>{const dt=new Blob([Ut],{type:"text/plain;charset=utf-8"}),U=URL.createObjectURL(dt),Tt=document.createElement("a");Tt.href=U,Tt.download=`program-${r}.logo`,Tt.click(),URL.revokeObjectURL(U),zt("Pobrano plik .logo.")},[Ut,r,zt]),ie=Et.useCallback(()=>{var dt;(dt=ht.current)==null||dt.click()},[]),re=Et.useCallback(dt=>{var st;const U=(st=dt.target.files)==null?void 0:st[0];if(dt.target.value="",!U)return;const Tt=new FileReader;Tt.onload=()=>{const xt=typeof Tt.result=="string"?Tt.result:"";gt({title:`Plik: ${U.name}`,mode:r,source:xt,challengeId:null,autoRun:!0})},Tt.readAsText(U,"utf-8")},[r,gt]);Et.useEffect(()=>{const dt=U=>{e==="pracownia"&&((U.metaKey||U.ctrlKey)&&U.key==="Enter"?(U.preventDefault(),Wt()):U.key==="F10"||U.altKey&&U.key.toLowerCase()==="s"?(U.preventDefault(),O()):U.altKey&&U.key.toLowerCase()==="p"?(U.preventDefault(),Vt()):U.altKey&&U.key.toLowerCase()==="r"&&(U.preventDefault(),Ue()))};return window.addEventListener("keydown",dt),()=>window.removeEventListener("keydown",dt)},[e,Wt,O,Vt,Ue]);const jt=Et.useRef(!1);Et.useEffect(()=>{jt.current||(jt.current=!0,qt(u[r],r,!0))},[u,r,qt]),Et.useEffect(()=>{window.logomocja={version:"1.0.0",run:(dt,U)=>cm(dt,U),open:async(dt,U)=>{H(),i("pracownia"),it(null),mt(null),l(U),Id(U),h(st=>({...st,[U]:dt})),p(st=>({...st,[U]:!1})),Pd(U,dt);const Tt=qt(dt,U,!1);return await new Promise(st=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>{var xt;(xt=pt.current)==null||xt.fit(Tt.segments),requestAnimationFrame(()=>st())})})}),Tt}}},[qt,H]);const _e=()=>{const dt=x==="dark"?"light":"dark";_(dt),sb(dt)},fe=b==="running"?"Wykonywanie":b==="paused"?"Wstrzymano":b==="error"?"Błąd":b==="done"?"Gotowe":"Gotowy";return D.jsxs("div",{className:"app-shell",children:[D.jsx(Eb,{route:e,onNavigate:se,mode:r,onModeChange:St,theme:x,onToggleTheme:_e,solvedCount:ut.length,totalChallenges:Jr.length,onSharePermalink:ye,onExportPng:Rt,onDownloadLogo:Zt,onOpenLogoFile:ie}),D.jsx("input",{ref:ht,type:"file",accept:".logo,.txt,text/plain",className:"sr-only",onChange:re,"aria-label":"Wybierz plik .logo"}),e==="pracownia"&&D.jsxs("main",{className:"studio-main",children:[D.jsxs("div",{className:"mobile-pane-tabs",role:"tablist","aria-label":"Widok pracowni na małym ekranie",children:[D.jsx("button",{type:"button",role:"tab",className:"mobile-pane-tab","aria-selected":et==="code",onClick:()=>tt("code"),children:"Kod"}),D.jsxs("button",{type:"button",role:"tab",className:"mobile-pane-tab","aria-selected":et==="canvas",onClick:()=>tt("canvas"),children:["Rysunek (",r.toUpperCase(),")"]})]}),D.jsxs("section",{className:`editor-pane${et==="canvas"?" mobile-hidden":""}`,"aria-label":"Edytor programu",children:[D.jsxs("div",{className:"exec-toolbar",role:"toolbar","aria-label":"Sterowanie wykonywaniem",children:[D.jsxs("div",{className:"exec-actions",children:[D.jsxs("button",{type:"button",className:"btn btn-primary",onClick:Wt,title:"Uruchom program (Ctrl+Enter)",children:[D.jsx(Jv,{size:14}),D.jsx("span",{children:"Uruchom"})]}),D.jsxs("button",{type:"button",className:"btn",onClick:O,title:"Wykonaj jeden krok (F10 lub Alt+S)",children:[D.jsx(pb,{size:14}),D.jsx("span",{children:"Krok"})]}),D.jsxs("button",{type:"button",className:"btn",onClick:Vt,disabled:b!=="running"&&b!=="paused",title:b==="paused"?"Wznów (Alt+P)":"Pauza (Alt+P)",children:[b==="paused"?D.jsx(Jv,{size:14}):D.jsx(db,{size:14}),D.jsx("span",{children:b==="paused"?"Wznów":"Pauza"})]}),D.jsx("button",{type:"button",className:"btn btn-icon",onClick:Ue,title:"Resetuj rysunek i żółwia (Alt+R)","aria-label":"Resetuj rysunek i żółwia",children:D.jsx(um,{size:14})})]}),D.jsxs("label",{className:"speed-control",children:[D.jsx("span",{children:"Tempo"}),D.jsx("input",{type:"range",min:1,max:5,step:1,value:E,onChange:dt=>A(Number(dt.target.value)),"aria-label":"Prędkość animacji żółwia"}),D.jsx("span",{className:"speed-label",children:gp[E].label})]})]}),bt&&D.jsxs("div",{className:"challenge-bar",children:[D.jsxs("div",{className:"challenge-bar-info",children:[D.jsx("span",{className:"mode-tag",children:bt.mode.toUpperCase()}),D.jsxs("span",{className:"challenge-bar-title",children:["Wyzwanie: ",bt.title]})]}),D.jsxs("div",{style:{display:"flex",gap:6,flexShrink:0},children:[D.jsxs("button",{type:"button",className:"btn btn-primary btn-sm",onClick:Ht,children:[D.jsx(dx,{size:14}),D.jsx("span",{children:"Sprawdź"})]}),D.jsx("button",{type:"button",className:"btn btn-sm",onClick:()=>{it(null),mt(null)},children:"Zamknij"})]})]}),D.jsx(Ab,{value:Ut,onChange:rt,activeLine:z,error:V,onRunShortcut:Wt}),W&&D.jsxs("div",{className:`diagnostic-bar${W.passed?" is-success":""}`,role:"status",children:[D.jsx("span",{className:"diagnostic-loc",children:W.passed?"OK":"SPRAWDŹ"}),D.jsx("span",{children:W.reason})]}),D.jsxs("div",{className:"editor-footer",children:[D.jsxs("div",{className:"shortcut-strip","aria-label":"Skróty klawiszowe",children:[D.jsxs("span",{className:"shortcut-item",children:[D.jsx("kbd",{children:"Ctrl+Enter"})," Uruchom"]}),D.jsxs("span",{className:"shortcut-item",children:[D.jsx("kbd",{children:"F10"})," / ",D.jsx("kbd",{children:"Alt+S"})," Krok"]}),D.jsxs("span",{className:"shortcut-item",children:[D.jsx("kbd",{children:"Alt+P"})," Pauza"]}),D.jsxs("span",{className:"shortcut-item",children:[D.jsx("kbd",{children:"Alt+R"})," Reset"]})]}),D.jsxs("span",{className:"tabular",children:[Ut.length.toLocaleString("pl-PL")," zn."]})]})]}),D.jsxs("section",{className:`viewport-pane${et==="code"?" mobile-hidden":""}`,"aria-label":`Płótno rysowania ${r.toUpperCase()}`,children:[D.jsxs("div",{className:"viewport-canvas-area",children:[D.jsxs("div",{className:"viewport-mode-pill","aria-live":"polite",children:[D.jsx("span",{className:`status-dot${b==="running"?" is-running":b==="paused"?" is-paused":b==="error"?" is-error":""}`}),D.jsxs("span",{children:["Tryb ",r.toUpperCase()," · ",fe]})]}),r==="2d"?D.jsx(mx,{ref:pt,segments:M,turtle:G,theme:x,guideSegments:Dt}):D.jsx(Zx,{ref:pt,segments:M,turtle:G,theme:x,guideSegments:Dt,onSwitchTo2D:()=>St("2d")})]}),D.jsx(s2,{mode:r,turtle:G,operations:P,segmentCount:M.length,activeLine:z})]})]}),e==="przyklady"&&D.jsx(o2,{onSelectExample:Qt}),e==="wyzwania"&&D.jsx(l2,{solvedIds:ut,activeChallengeId:X,onStartChallenge:Ft}),e==="slownik"&&D.jsx(f2,{onTryCode:(dt,U)=>gt({title:"Przykład ze słownika",mode:U,source:dt,challengeId:null,autoRun:!0})}),D.jsx(h2,{open:vt!==null,title:"Zastąpić bieżący szkic?",message:vt?`W trybie ${vt.mode.toUpperCase()} masz niezapisane zmiany. Wczytanie „${vt.title}” zastąpi obecny kod w edytorze.`:"",confirmLabel:"Zastąp szkic",onConfirm:()=>vt&&Mt(vt),onCancel:()=>At(null)}),Xt&&D.jsx("div",{className:"toast-banner",role:"status","aria-live":"polite",children:Xt})]})};VE.createRoot(document.getElementById("root")).render(D.jsx(_p.StrictMode,{children:D.jsx(g2,{})}));
