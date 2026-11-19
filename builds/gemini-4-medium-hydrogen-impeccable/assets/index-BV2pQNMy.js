var DE=Object.defineProperty;var NE=(o,e,i)=>e in o?DE(o,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):o[e]=i;var ti=(o,e,i)=>NE(o,typeof e!="symbol"?e+"":e,i);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const h of u.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(l){if(l.ep)return;l.ep=!0;const u=i(l);fetch(l.href,u)}})();function ox(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var Uh={exports:{}},Ml={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var U_;function UE(){if(U_)return Ml;U_=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(r,l,u){var h=null;if(u!==void 0&&(h=""+u),l.key!==void 0&&(h=""+l.key),"key"in l){u={};for(var d in l)d!=="key"&&(u[d]=l[d])}else u=l;return l=u.ref,{$$typeof:o,type:r,key:h,ref:l!==void 0?l:null,props:u}}return Ml.Fragment=e,Ml.jsx=i,Ml.jsxs=i,Ml}var z_;function zE(){return z_||(z_=1,Uh.exports=UE()),Uh.exports}var C=zE(),zh={exports:{}},le={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var L_;function LE(){if(L_)return le;L_=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),h=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),v=Symbol.for("react.lazy"),m=Symbol.for("react.activity"),x=Symbol.for("react.view_transition"),M=Symbol.iterator;function T(U){return U===null||typeof U!="object"?null:(U=M&&U[M]||U["@@iterator"],typeof U=="function"?U:null)}var w={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},S=Object.assign,y={};function P(U,Q,vt){this.props=U,this.context=Q,this.refs=y,this.updater=vt||w}P.prototype.isReactComponent={},P.prototype.setState=function(U,Q){if(typeof U!="object"&&typeof U!="function"&&U!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,U,Q,"setState")},P.prototype.forceUpdate=function(U){this.updater.enqueueForceUpdate(this,U,"forceUpdate")};function z(){}z.prototype=P.prototype;function N(U,Q,vt){this.props=U,this.context=Q,this.refs=y,this.updater=vt||w}var X=N.prototype=new z;X.constructor=N,S(X,P.prototype),X.isPureReactComponent=!0;var H=Array.isArray;function B(){}var F={H:null,A:null,T:null,S:null},R=Object.prototype.hasOwnProperty;function E(U,Q,vt){var dt=vt.ref;return{$$typeof:o,type:U,key:Q,ref:dt!==void 0?dt:null,props:vt}}function L(U,Q){return E(U.type,Q,U.props)}function et(U){return typeof U=="object"&&U!==null&&U.$$typeof===o}function K(U){var Q={"=":"=0",":":"=2"};return"$"+U.replace(/[=:]/g,function(vt){return Q[vt]})}var ft=/\/+/g;function st(U,Q){return typeof U=="object"&&U!==null&&U.key!=null?K(""+U.key):Q.toString(36)}function k(U){switch(U.status){case"fulfilled":return U.value;case"rejected":throw U.reason;default:switch(typeof U.status=="string"?U.then(B,B):(U.status="pending",U.then(function(Q){U.status==="pending"&&(U.status="fulfilled",U.value=Q)},function(Q){U.status==="pending"&&(U.status="rejected",U.reason=Q)})),U.status){case"fulfilled":return U.value;case"rejected":throw U.reason}}throw U}function Y(U,Q,vt,dt,wt){var kt=typeof U;(kt==="undefined"||kt==="boolean")&&(U=null);var Et=!1;if(U===null)Et=!0;else switch(kt){case"bigint":case"string":case"number":Et=!0;break;case"object":switch(U.$$typeof){case o:case e:Et=!0;break;case v:return Et=U._init,Y(Et(U._payload),Q,vt,dt,wt)}}if(Et)return wt=wt(U),Et=dt===""?"."+st(U,0):dt,H(wt)?(vt="",Et!=null&&(vt=Et.replace(ft,"$&/")+"/"),Y(wt,Q,vt,"",function(te){return te})):wt!=null&&(et(wt)&&(wt=L(wt,vt+(wt.key==null||U&&U.key===wt.key?"":(""+wt.key).replace(ft,"$&/")+"/")+Et)),Q.push(wt)),1;Et=0;var bt=dt===""?".":dt+":";if(H(U))for(var zt=0;zt<U.length;zt++)dt=U[zt],kt=bt+st(dt,zt),Et+=Y(dt,Q,vt,kt,wt);else if(zt=T(U),typeof zt=="function")for(U=zt.call(U),zt=0;!(dt=U.next()).done;)dt=dt.value,kt=bt+st(dt,zt++),Et+=Y(dt,Q,vt,kt,wt);else if(kt==="object"){if(typeof U.then=="function")return Y(k(U),Q,vt,dt,wt);throw Q=String(U),Error("Objects are not valid as a React child (found: "+(Q==="[object Object]"?"object with keys {"+Object.keys(U).join(", ")+"}":Q)+"). If you meant to render a collection of children, use an array instead.")}return Et}function q(U,Q,vt){if(U==null)return U;var dt=[],wt=0;return Y(U,dt,"","",function(kt){return Q.call(vt,kt,wt++)}),dt}function _t(U){if(U._status===-1){var Q=U._result,vt=Q();vt.then(function(dt){(U._status===0||U._status===-1)&&(U._status=1,U._result=dt,vt.status===void 0&&(vt.status="fulfilled",vt.value=dt))},function(dt){(U._status===0||U._status===-1)&&(U._status=2,U._result=dt,vt.status===void 0&&(vt.status="rejected",vt.reason=dt))}),U._status===-1&&(U._status=0,U._result=vt)}if(U._status===1)return U._result.default;throw U._result}var mt=typeof reportError=="function"?reportError:function(U){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var Q=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof U=="object"&&U!==null&&typeof U.message=="string"?String(U.message):String(U),error:U});if(!window.dispatchEvent(Q))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",U);return}console.error(U)};function At(U){var Q=F.T,vt={};vt.types=Q!==null?Q.types:null,F.T=vt;try{var dt=U(),wt=F.S;wt!==null&&wt(vt,dt),typeof dt=="object"&&dt!==null&&typeof dt.then=="function"&&dt.then(B,mt)}catch(kt){mt(kt)}finally{Q!==null&&vt.types!==null&&(Q.types=vt.types),F.T=Q}}function Wt(U){var Q=F.T;if(Q!==null){var vt=Q.types;vt===null?Q.types=[U]:vt.indexOf(U)===-1&&vt.push(U)}else At(Wt.bind(null,U))}var Kt={map:q,forEach:function(U,Q,vt){q(U,function(){Q.apply(this,arguments)},vt)},count:function(U){var Q=0;return q(U,function(){Q++}),Q},toArray:function(U){return q(U,function(Q){return Q})||[]},only:function(U){if(!et(U))throw Error("React.Children.only expected to receive a single React element child.");return U}};return le.Activity=m,le.Children=Kt,le.Component=P,le.Fragment=i,le.Profiler=l,le.PureComponent=N,le.StrictMode=r,le.Suspense=p,le.ViewTransition=x,le.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=F,le.__COMPILER_RUNTIME={__proto__:null,c:function(U){return F.H.useMemoCache(U)}},le.addTransitionType=Wt,le.cache=function(U){return function(){return U.apply(null,arguments)}},le.cacheSignal=function(){return null},le.cloneElement=function(U,Q,vt){if(U==null)throw Error("The argument must be a React element, but you passed "+U+".");var dt=S({},U.props),wt=U.key;if(Q!=null)for(kt in Q.key!==void 0&&(wt=""+Q.key),Q)!R.call(Q,kt)||kt==="key"||kt==="__self"||kt==="__source"||kt==="ref"&&Q.ref===void 0||(dt[kt]=Q[kt]);var kt=arguments.length-2;if(kt===1)dt.children=vt;else if(1<kt){for(var Et=Array(kt),bt=0;bt<kt;bt++)Et[bt]=arguments[bt+2];dt.children=Et}return E(U.type,wt,dt)},le.createContext=function(U){return U={$$typeof:h,_currentValue:U,_currentValue2:U,_threadCount:0,Provider:null,Consumer:null},U.Provider=U,U.Consumer={$$typeof:u,_context:U},U},le.createElement=function(U,Q,vt){var dt,wt={},kt=null;if(Q!=null)for(dt in Q.key!==void 0&&(kt=""+Q.key),Q)R.call(Q,dt)&&dt!=="key"&&dt!=="__self"&&dt!=="__source"&&(wt[dt]=Q[dt]);var Et=arguments.length-2;if(Et===1)wt.children=vt;else if(1<Et){for(var bt=Array(Et),zt=0;zt<Et;zt++)bt[zt]=arguments[zt+2];wt.children=bt}if(U&&U.defaultProps)for(dt in Et=U.defaultProps,Et)wt[dt]===void 0&&(wt[dt]=Et[dt]);return E(U,kt,wt)},le.createRef=function(){return{current:null}},le.forwardRef=function(U){return{$$typeof:d,render:U}},le.isValidElement=et,le.lazy=function(U){return{$$typeof:v,_payload:{_status:-1,_result:U},_init:_t}},le.memo=function(U,Q){return{$$typeof:g,type:U,compare:Q===void 0?null:Q}},le.startTransition=At,le.unstable_useCacheRefresh=function(){return F.H.useCacheRefresh()},le.use=function(U){return F.H.use(U)},le.useActionState=function(U,Q,vt){return F.H.useActionState(U,Q,vt)},le.useCallback=function(U,Q){return F.H.useCallback(U,Q)},le.useContext=function(U){return F.H.useContext(U)},le.useDebugValue=function(){},le.useDeferredValue=function(U,Q){return F.H.useDeferredValue(U,Q)},le.useEffect=function(U,Q){return F.H.useEffect(U,Q)},le.useEffectEvent=function(U){return F.H.useEffectEvent(U)},le.useId=function(){return F.H.useId()},le.useImperativeHandle=function(U,Q,vt){return F.H.useImperativeHandle(U,Q,vt)},le.useInsertionEffect=function(U,Q){return F.H.useInsertionEffect(U,Q)},le.useLayoutEffect=function(U,Q){return F.H.useLayoutEffect(U,Q)},le.useMemo=function(U,Q){return F.H.useMemo(U,Q)},le.useOptimistic=function(U,Q){return F.H.useOptimistic(U,Q)},le.useReducer=function(U,Q,vt){return F.H.useReducer(U,Q,vt)},le.useRef=function(U){return F.H.useRef(U)},le.useState=function(U){return F.H.useState(U)},le.useSyncExternalStore=function(U,Q,vt){return F.H.useSyncExternalStore(U,Q,vt)},le.useTransition=function(){return F.H.useTransition()},le.version="19.3.1",le}var O_;function um(){return O_||(O_=1,zh.exports=LE()),zh.exports}var Rt=um();const OE=ox(Rt);var Lh={exports:{}},El={},Oh={exports:{}},Ph={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var P_;function PE(){return P_||(P_=1,(function(o){function e(k,Y){var q=k.length;k.push(Y);t:for(;0<q;){var _t=q-1>>>1,mt=k[_t];if(0<l(mt,Y))k[_t]=Y,k[q]=mt,q=_t;else break t}}function i(k){return k.length===0?null:k[0]}function r(k){if(k.length===0)return null;var Y=k[0],q=k.pop();if(q!==Y){k[0]=q;t:for(var _t=0,mt=k.length,At=mt>>>1;_t<At;){var Wt=2*(_t+1)-1,Kt=k[Wt],U=Wt+1,Q=k[U];if(0>l(Kt,q))U<mt&&0>l(Q,Kt)?(k[_t]=Q,k[U]=q,_t=U):(k[_t]=Kt,k[Wt]=q,_t=Wt);else if(U<mt&&0>l(Q,q))k[_t]=Q,k[U]=q,_t=U;else break t}}return Y}function l(k,Y){var q=k.sortIndex-Y.sortIndex;return q!==0?q:k.id-Y.id}if(o.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;o.unstable_now=function(){return u.now()}}else{var h=Date,d=h.now();o.unstable_now=function(){return h.now()-d}}var p=[],g=[],v=1,m=null,x=3,M=!1,T=!1,w=!1,S=!1,y=typeof setTimeout=="function"?setTimeout:null,P=typeof clearTimeout=="function"?clearTimeout:null,z=typeof setImmediate<"u"?setImmediate:null;function N(k){for(var Y=i(g);Y!==null;){if(Y.callback===null)r(g);else if(Y.startTime<=k)r(g),Y.sortIndex=Y.expirationTime,e(p,Y);else break;Y=i(g)}}function X(k){if(w=!1,N(k),!T)if(i(p)!==null)T=!0,H||(H=!0,et());else{var Y=i(g);Y!==null&&st(X,Y.startTime-k)}}var H=!1,B=-1,F=5,R=-1;function E(){return S?!0:!(o.unstable_now()-R<F)}function L(){if(S=!1,H){var k=o.unstable_now();R=k;var Y=!0;try{t:{T=!1,w&&(w=!1,P(B),B=-1),M=!0;var q=x;try{e:{for(N(k),m=i(p);m!==null&&!(m.expirationTime>k&&E());){var _t=m.callback;if(typeof _t=="function"){m.callback=null,x=m.priorityLevel;var mt=_t(m.expirationTime<=k);if(k=o.unstable_now(),typeof mt=="function"){m.callback=mt,N(k),Y=!0;break e}m===i(p)&&r(p),N(k)}else r(p);m=i(p)}if(m!==null)Y=!0;else{var At=i(g);At!==null&&st(X,At.startTime-k),Y=!1}}break t}finally{m=null,x=q,M=!1}Y=void 0}}finally{Y?et():H=!1}}}var et;if(typeof z=="function")et=function(){z(L)};else if(typeof MessageChannel<"u"){var K=new MessageChannel,ft=K.port2;K.port1.onmessage=L,et=function(){ft.postMessage(null)}}else et=function(){y(L,0)};function st(k,Y){B=y(function(){k(o.unstable_now())},Y)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(k){k.callback=null},o.unstable_forceFrameRate=function(k){0>k||125<k?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):F=0<k?Math.floor(1e3/k):5},o.unstable_getCurrentPriorityLevel=function(){return x},o.unstable_next=function(k){switch(x){case 1:case 2:case 3:var Y=3;break;default:Y=x}var q=x;x=Y;try{return k()}finally{x=q}},o.unstable_requestPaint=function(){S=!0},o.unstable_runWithPriority=function(k,Y){switch(k){case 1:case 2:case 3:case 4:case 5:break;default:k=3}var q=x;x=k;try{return Y()}finally{x=q}},o.unstable_scheduleCallback=function(k,Y,q){var _t=o.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?_t+q:_t):q=_t,k){case 1:var mt=-1;break;case 2:mt=250;break;case 5:mt=1073741823;break;case 4:mt=1e4;break;default:mt=5e3}return mt=q+mt,k={id:v++,callback:Y,priorityLevel:k,startTime:q,expirationTime:mt,sortIndex:-1},q>_t?(k.sortIndex=q,e(g,k),i(p)===null&&k===i(g)&&(w?(P(B),B=-1):w=!0,st(X,q-_t))):(k.sortIndex=mt,e(p,k),T||M||(T=!0,H||(H=!0,et()))),k},o.unstable_shouldYield=E,o.unstable_wrapCallback=function(k){var Y=x;return function(){var q=x;x=Y;try{return k.apply(this,arguments)}finally{x=q}}}})(Ph)),Ph}var B_;function BE(){return B_||(B_=1,Oh.exports=PE()),Oh.exports}var Bh={exports:{}},Un={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var I_;function IE(){if(I_)return Un;I_=1;var o=um();function e(v){var m="https://react.dev/errors/"+v;if(1<arguments.length){m+="?args[]="+encodeURIComponent(arguments[1]);for(var x=2;x<arguments.length;x++)m+="&args[]="+encodeURIComponent(arguments[x])}return"Minified React error #"+v+"; visit "+m+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var r={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal"),u=Symbol.for("react.recoverable"),h=Symbol.for("react.optimistic_key");function d(v,m,x){var M=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:M==null?null:M===h?h:""+M,children:v,containerInfo:m,implementation:x}}var p=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function g(v,m){if(v==="font")return"";if(typeof m=="string")return m==="use-credentials"?m:""}return Un.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,Un.browser=function(v){return{$$typeof:u,_reason:v}},Un.createPortal=function(v,m){var x=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!m||m.nodeType!==1&&m.nodeType!==9&&m.nodeType!==11)throw Error(e(299));return d(v,m,null,x)},Un.flushSync=function(v){var m=p.T,x=r.p;try{if(p.T=null,r.p=2,v)return v()}finally{p.T=m,r.p=x,r.d.f()}},Un.preconnect=function(v,m){typeof v=="string"&&(m?(m=m.crossOrigin,m=typeof m=="string"?m==="use-credentials"?m:"":void 0):m=null,r.d.C(v,m))},Un.prefetchDNS=function(v){typeof v=="string"&&r.d.D(v)},Un.preinit=function(v,m){if(typeof v=="string"&&m&&typeof m.as=="string"){var x=m.as,M=g(x,m.crossOrigin),T=typeof m.integrity=="string"?m.integrity:void 0,w=typeof m.fetchPriority=="string"?m.fetchPriority:void 0;x==="style"?r.d.S(v,typeof m.precedence=="string"?m.precedence:void 0,{crossOrigin:M,integrity:T,fetchPriority:w}):x==="script"&&r.d.X(v,{crossOrigin:M,integrity:T,fetchPriority:w,nonce:typeof m.nonce=="string"?m.nonce:void 0})}},Un.preinitModule=function(v,m){if(typeof v=="string")if(typeof m=="object"&&m!==null){if(m.as==null||m.as==="script"){var x=g(m.as,m.crossOrigin);r.d.M(v,{crossOrigin:x,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0})}}else m==null&&r.d.M(v)},Un.preload=function(v,m){if(typeof v=="string"&&typeof m=="object"&&m!==null&&typeof m.as=="string"){var x=m.as,M=g(x,m.crossOrigin);r.d.L(v,x,{crossOrigin:M,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,type:typeof m.type=="string"?m.type:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0,referrerPolicy:typeof m.referrerPolicy=="string"?m.referrerPolicy:void 0,imageSrcSet:typeof m.imageSrcSet=="string"?m.imageSrcSet:void 0,imageSizes:typeof m.imageSizes=="string"?m.imageSizes:void 0,media:typeof m.media=="string"?m.media:void 0})}},Un.preloadModule=function(v,m){if(typeof v=="string")if(m){var x=g(m.as,m.crossOrigin);r.d.m(v,{as:typeof m.as=="string"&&m.as!=="script"?m.as:void 0,crossOrigin:x,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0})}else r.d.m(v)},Un.requestFormReset=function(v){r.d.r(v)},Un.unstable_batchedUpdates=function(v,m){return v(m)},Un.useFormState=function(v,m,x){return p.H.useFormState(v,m,x)},Un.useFormStatus=function(){return p.H.useHostTransitionStatus()},Un.version="19.3.1",Un}var F_;function FE(){if(F_)return Bh.exports;F_=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),Bh.exports=IE(),Bh.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var H_;function HE(){if(H_)return El;H_=1;var o=BE(),e=um(),i=FE();function r(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function u(t){for(var n=t,a=n;a&&!a.alternate;)n=a,(n.flags&4098)!==0&&(t=n.return),a=n.return;for(;n.return;)n=n.return;return n.tag===3?t:null}function h(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function d(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function p(t){if(u(t)!==t)throw Error(r(188))}function g(t){var n=t.alternate;if(!n){if(n=u(t),n===null)throw Error(r(188));return n!==t?null:t}for(var a=t,s=n;;){var c=a.return;if(c===null)break;var f=c.alternate;if(f===null){if(s=c.return,s!==null){a=s;continue}break}if(c.child===f.child){for(f=c.child;f;){if(f===a)return p(c),t;if(f===s)return p(c),n;f=f.sibling}throw Error(r(188))}if(a.return!==s.return)a=c,s=f;else{for(var _=!1,b=c.child;b;){if(b===a){_=!0,a=c,s=f;break}if(b===s){_=!0,s=c,a=f;break}b=b.sibling}if(!_){for(b=f.child;b;){if(b===a){_=!0,a=f,s=c;break}if(b===s){_=!0,s=f,a=c;break}b=b.sibling}if(!_)throw Error(r(189))}}if(a.alternate!==s)throw Error(r(190))}if(a.tag!==3)throw Error(r(188));return a.stateNode.current===a?t:n}function v(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=v(t),n!==null)return n;t=t.sibling}return null}function m(t,n,a,s,c,f){for(;t!==null;){if((t.tag===5||t.tag===27||t.tag===6)&&a(t,s,c,f)||(t.tag!==22||t.memoizedState===null)&&(n||t.tag!==5&&t.tag!==27)&&m(t.child,n,a,s,c,f))return!0;t=t.sibling}return!1}function x(t){for(t=t.return;t!==null;){if(t.tag===3||t.tag===5||t.tag===27)return t;t=t.return}return null}function M(t){var n=!1;for(t=t.return;t!==null&&(t.tag===4&&(n=!0),!(t.tag===3||t.tag===5||t.tag===27));)t=t.return;return n}function T(t){var n=[null,null],a=x(t);return a===null||w(n,t,a.child,{foundSelf:!1}),n}function w(t,n,a,s){for(;a!==null;){if(a===n)s.foundSelf=!0;else if(a.tag===5||a.tag===27||a.tag===6){if(s.foundSelf)return t[1]=a,!0;t[0]=a}else if((a.tag!==22||a.memoizedState===null)&&w(t,n,a.child,s))return!0;a=a.sibling}return!1}function S(t){switch(t.tag){case 5:case 27:case 6:return t.stateNode;case 3:return t.stateNode.containerInfo;default:throw Error(r(559))}}var y=null,P=null;function z(t,n,a){return t===a?!0:t===n?(y=t,!0):!1}function N(t,n,a){return t===a?(P=t,!1):t===n?(P!==null&&(y=t),!0):!1}function X(t){if(t===null)return null;do t=t===null?null:t.return;while(t&&t.tag!==5&&t.tag!==27&&t.tag!==3);return t||null}function H(t,n,a){for(var s=0,c=t;c;c=a(c))s++;c=0;for(var f=n;f;f=a(f))c++;for(;0<s-c;)t=a(t),s--;for(;0<c-s;)n=a(n),c--;for(;s--;){if(t===n||n!==null&&t===n.alternate)return t;t=a(t),n=a(n)}return null}var B=Object.assign,F=Symbol.for("react.element"),R=Symbol.for("react.transitional.element"),E=Symbol.for("react.portal"),L=Symbol.for("react.fragment"),et=Symbol.for("react.strict_mode"),K=Symbol.for("react.profiler"),ft=Symbol.for("react.consumer"),st=Symbol.for("react.context"),k=Symbol.for("react.forward_ref"),Y=Symbol.for("react.suspense"),q=Symbol.for("react.suspense_list"),_t=Symbol.for("react.memo"),mt=Symbol.for("react.lazy"),At=Symbol.for("react.activity"),Wt=Symbol.for("react.legacy_hidden"),Kt=Symbol.for("react.memo_cache_sentinel"),U=Symbol.for("react.view_transition"),Q=Symbol.for("react.recoverable"),vt=Symbol.iterator;function dt(t){return t===null||typeof t!="object"?null:(t=vt&&t[vt]||t["@@iterator"],typeof t=="function"?t:null)}var wt=Symbol.for("react.client.reference");function kt(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===wt?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case L:return"Fragment";case K:return"Profiler";case et:return"StrictMode";case Y:return"Suspense";case q:return"SuspenseList";case At:return"Activity";case U:return"ViewTransition"}if(typeof t=="object")switch(t.$$typeof){case E:return"Portal";case st:return t.displayName||"Context";case ft:return(t._context.displayName||"Context")+".Consumer";case k:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case _t:return n=t.displayName||null,n!==null?n:kt(t.type)||"Memo";case mt:n=t._payload,t=t._init;try{return kt(t(n))}catch{}}return null}var Et=Array.isArray,bt=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,zt=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,te={pending:!1,data:null,method:null,action:null},G=[],an=-1;function re(t){return{current:t}}function Jt(t){0>an||(t.current=G[an],G[an]=null,an--)}function Nt(t,n){an++,G[an]=t.current,t.current=n}var ve=re(null),Yt=re(null),O=re(null),A=re(null);function lt(t,n){switch(Nt(O,n),Nt(Yt,t),Nt(ve,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?kv(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=kv(n),t=Gv(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}Jt(ve),Nt(ve,t)}function V(){Jt(ve),Jt(Yt),Jt(O)}function nt(t){var n=t.memoizedState;n!==null&&(Qs._currentValue=n.memoizedState,Nt(A,t)),n=ve.current;var a=Gv(n,t.type);n!==a&&(Nt(Yt,t),Nt(ve,a))}function ct(t){Yt.current===t&&(Jt(ve),Jt(Yt)),A.current===t&&(Jt(A),Qs._currentValue=te)}var Ot,Ct;function It(t){if(Ot===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);Ot=n&&n[1]||"",Ct=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ot+t+Ct}var pe=!1;function Tt(t,n){if(!t||pe)return"";pe=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var s={DetermineComponentFrameRoot:function(){try{if(n){var xt=function(){throw Error()};if(Object.defineProperty(xt.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(xt,[])}catch(Lt){var Z=Lt}Reflect.construct(t,[],xt)}else{try{xt.call()}catch(Lt){Z=Lt}xt=!1;try{var ot=Object.getOwnPropertyDescriptor(t.prototype,"props");Object.defineProperty(t.prototype,"props",{configurable:!0,set:function(){throw Error()}}),xt=!0,new t}finally{xt&&(ot!==void 0?Object.defineProperty(t.prototype,"props",ot):delete t.prototype.props)}}}else{try{throw Error()}catch(Lt){Z=Lt}(xt=t())&&typeof xt.catch=="function"&&xt.catch(function(){})}}catch(Lt){if(Lt&&Z&&typeof Lt.stack=="string")return[Lt.stack,Z.stack]}return[null,null]}};s.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(s.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=s.DetermineComponentFrameRoot(),_=f[0],b=f[1];if(_&&b){var I=_.split(`
`),$=b.split(`
`);for(c=s=0;s<I.length&&!I[s].includes("DetermineComponentFrameRoot");)s++;for(;c<$.length&&!$[c].includes("DetermineComponentFrameRoot");)c++;if(s===I.length||c===$.length)for(s=I.length-1,c=$.length-1;1<=s&&0<=c&&I[s]!==$[c];)c--;for(;1<=s&&0<=c;s--,c--)if(I[s]!==$[c]){if(s!==1||c!==1)do if(s--,c--,0>c||I[s]!==$[c]){var ut=`
`+I[s].replace(" at new "," at ");return t.displayName&&ut.includes("<anonymous>")&&(ut=ut.replace("<anonymous>",t.displayName)),ut}while(1<=s&&0<=c);break}}}finally{pe=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?It(a):""}function Xt(t,n){switch(t.tag){case 26:case 27:case 5:return It(t.type);case 16:return It("Lazy");case 13:return t.child!==n&&n!==null?It("Suspense Fallback"):It("Suspense");case 19:return It("SuspenseList");case 0:case 15:return Tt(t.type,!1);case 11:return Tt(t.type.render,!1);case 1:return Tt(t.type,!0);case 31:return It("Activity");case 30:return It("ViewTransition");default:return""}}function ne(t){try{var n="",a=null;do n+=Xt(t,a),a=t,t=t.return;while(t);return n}catch(s){return`
Error generating stack: `+s.message+`
`+s.stack}}var se=Object.prototype.hasOwnProperty,jt=o.unstable_scheduleCallback,_e=o.unstable_cancelCallback,ue=o.unstable_shouldYield,He=o.unstable_requestPaint,W=o.unstable_now,Ft=o.unstable_getCurrentPriorityLevel,gt=o.unstable_ImmediatePriority,St=o.unstable_UserBlockingPriority,Ht=o.unstable_NormalPriority,Gt=o.unstable_LowPriority,ce=o.unstable_IdlePriority,Je=o.log,_n=o.unstable_setDisableYieldValue,we=null,Ke=null;function yn(t){if(typeof Je=="function"&&_n(t),Ke&&typeof Ke.setStrictMode=="function")try{Ke.setStrictMode(we,t)}catch{}}var Bn=Math.clz32?Math.clz32:No,Vl=Math.log,ca=Math.LN2;function No(t){return t>>>=0,t===0?32:31-(Vl(t)/ca|0)|0}var Ar=256,Rr=262144,ua=4194304;function Xi(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&-t;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function fa(t,n,a){var s=t.pendingLanes;if(s===0)return 0;var c=0,f=t.suspendedLanes,_=t.pingedLanes;t=t.warmLanes;var b=s&134217727;return b!==0?(s=b&~f,s!==0?c=Xi(s):(_&=b,_!==0?c=Xi(_):a||(a=b&~t,a!==0&&(c=Xi(a))))):(b=s&~f,b!==0?c=Xi(b):_!==0?c=Xi(_):a||(a=s&~t,a!==0&&(c=Xi(a)))),c===0?0:n!==0&&n!==c&&(n&f)===0&&(f=c&-c,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:c}function Ha(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Uo(t,n){(n&8)!==0&&(n|=n&32);var a=t.entangledLanes;if(a!==0)for(t=t.entanglements,a&=n;0<a;){var s=31-Bn(a),c=1<<s;n|=t[s],a&=~c}return n}function sf(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function jl(){var t=ua;return ua<<=1,(ua&62914560)===0&&(ua=4194304),t}function zo(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function Cr(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function of(t,n,a,s,c,f){var _=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var b=t.entanglements,I=t.expirationTimes,$=t.hiddenUpdates;for(a=_&~a;0<a;){var ut=31-Bn(a),xt=1<<ut;b[ut]=0,I[ut]=-1;var Z=$[ut];if(Z!==null)for($[ut]=null,ut=0;ut<Z.length;ut++){var ot=Z[ut];ot!==null&&(ot.lane&=-536870913)}a&=~xt}s!==0&&Xl(t,s,0),f!==0&&c===0&&t.tag!==0&&(t.suspendedLanes|=f&~(_&~n))}function Xl(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var s=31-Bn(n);t.entangledLanes|=n,t.entanglements[s]=t.entanglements[s]|1073741824|a&261930}function D(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var s=31-Bn(a),c=1<<s;c&n|t[s]&n&&(t[s]|=n),a&=~c}}function tt(t,n){var a=n&-n;return a=(a&42)!==0?1:ht(a),(a&(t.suspendedLanes|n))!==0?0:a}function ht(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function pt(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function at(){var t=zt.p;return t!==0?t:(t=window.event,t===void 0?32:T_(t.type))}function Mt(t,n){var a=zt.p;try{return zt.p=t,n()}finally{zt.p=a}}var Ut=Math.random().toString(36).slice(2),Dt="__reactFiber$"+Ut,Bt="__reactProps$"+Ut,ee="__reactContainer$"+Ut,oe="__reactEvents$"+Ut,$t="__reactListeners$"+Ut,Ae="__reactHandles$"+Ut,Ce="__reactResources$"+Ut,qe="__reactMarker$"+Ut,Ve="__reactLoad$"+Ut;function ye(t){delete t[Dt],delete t[Bt],delete t[$t],delete t[Ae]}function Zt(t){var n;if(n=t[Dt])return n;for(var a=t.parentNode;a;){if(n=a[ee]||a[Dt]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=r_(t);t!==null;){if(a=t[Dt])return a;t=r_(t)}return n}t=a,a=t.parentNode}return null}function $e(t){if(t=t[Dt]||t[ee]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function Ee(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(r(33))}function xn(t){var n=t[Ce];return n||(n=t[Ce]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function Qe(t){t[qe]=!0}function In(t){t[Ve]=void 0}var ka=new Set,je={};function ln(t,n){pn(t,n),pn(t+"Capture",n)}function pn(t,n){for(je[t]=n,t=0;t<n.length;t++)ka.add(n[t])}var Tn=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),wn={},ps={};function da(t){return se.call(ps,t)?!0:se.call(wn,t)?!1:Tn.test(t)?ps[t]=!0:(wn[t]=!0,!1)}var Ne=!1;function Am(){var t=Ne;return Ne=!1,t}function ql(t,n,a){if(da(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var s=n.toLowerCase().slice(0,5);if(s!=="data-"&&s!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,a)}}function Wl(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,a)}}function ha(t,n,a,s){if(s===null)t.removeAttribute(a);else{switch(typeof s){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,s)}}function si(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Rm(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Kx(t,n,a){var s=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof s<"u"&&typeof s.get=="function"&&typeof s.set=="function"){var c=s.get,f=s.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return c.call(this)},set:function(_){a=""+_,f.call(this,_)}}),Object.defineProperty(t,n,{enumerable:s.enumerable}),{getValue:function(){return a},setValue:function(_){a=""+_},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function lf(t){if(!t._valueTracker){var n=Rm(t)?"checked":"value";t._valueTracker=Kx(t,n,""+t[n])}}function Cm(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),s="";return t&&(s=Rm(t)?t.checked?"true":"false":t.value),t=s,t!==a?(n.setValue(t),!0):!1}var Qx=/[\n"\\]/g;function gi(t){return t.replace(Qx,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function cf(t,n,a,s,c,f,_,b){t.name="",_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"?t.type=_:t.removeAttribute("type"),n!=null?_==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+si(n)):t.value!==""+si(n)&&(t.value=""+si(n)):_!=="submit"&&_!=="reset"||t.removeAttribute("value"),n!=null?_==="number"&&t.value==n?uf(t,si(t.value)):uf(t,si(n)):a!=null?uf(t,si(a)):s!=null&&t.removeAttribute("value"),c==null&&f!=null&&(t.defaultChecked=!!f),c!=null&&(t.checked=c&&typeof c!="function"&&typeof c!="symbol"),b!=null&&typeof b!="function"&&typeof b!="symbol"&&typeof b!="boolean"?t.name=""+si(b):t.removeAttribute("name")}function Dm(t,n,a,s,c,f,_,b){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(t.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){lf(t);return}a=a!=null?""+si(a):"",n=n!=null?""+si(n):a,b||n===t.value||(t.value=n),t.defaultValue=n}s=s??c,s=typeof s!="function"&&typeof s!="symbol"&&!!s,t.checked=b?t.checked:!!s,t.defaultChecked=!!s,_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"&&(t.name=_),lf(t)}function uf(t,n){t.defaultValue!==""+n&&(t.defaultValue=""+n)}function ms(t,n,a,s){if(t=t.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<t.length;a++)c=n.hasOwnProperty("$"+t[a].value),t[a].selected!==c&&(t[a].selected=c),c&&s&&(t[a].defaultSelected=!0)}else{for(a=""+si(a),n=null,c=0;c<t.length;c++){if(t[c].value===a){t[c].selected=!0,s&&(t[c].defaultSelected=!0);return}n!==null||t[c].disabled||(n=t[c])}n!==null&&(n.selected=!0)}}function Nm(t,n,a){if(n!=null&&(n=""+si(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+si(a):""}function Um(t,n,a,s){if(n==null){if(s!=null){if(a!=null)throw Error(r(92));if(Et(s)){if(1<s.length)throw Error(r(93));s=s[0]}a=s}a==null&&(a=""),n=a}a=si(n),t.defaultValue=a,s=t.textContent,s===a&&s!==""&&s!==null&&(t.value=s),lf(t)}function gs(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var Jx=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function zm(t,n,a){var s=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?s?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":s?t.setProperty(n,a):typeof a!="number"||a===0||Jx.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function Lm(t,n,a){if(n!=null&&typeof n!="object")throw Error(r(62));if(t=t.style,a!=null){for(var s in a)!a.hasOwnProperty(s)||n!=null&&n.hasOwnProperty(s)||(s.indexOf("--")===0?t.setProperty(s,""):s==="float"?t.cssFloat="":t[s]="",Ne=!0);for(var c in n)s=n[c],n.hasOwnProperty(c)&&a[c]!==s&&(zm(t,c,s),Ne=!0)}else for(var f in n)n.hasOwnProperty(f)&&zm(t,f,n[f])}function ff(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var $x=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),tS=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Yl(t){return tS.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function qi(){}var df=null;function hf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var vs=null,_s=null;function Om(t){var n=$e(t);if(n&&(t=n.stateNode)){var a=t[Bt]||null;t:switch(t=n.stateNode,n.type){case"input":if(cf(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+gi(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var s=a[n];if(s!==t&&s.form===t.form){var c=s[Bt]||null;if(!c)throw Error(r(90));cf(s,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)s=a[n],s.form===t.form&&Cm(s)}break t;case"textarea":Nm(t,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&ms(t,!!a.multiple,n,!1)}}}var pf=!1;function Pm(t,n,a){if(pf)return t(n,a);pf=!0;try{var s=t(n);return s}finally{if(pf=!1,(vs!==null||_s!==null)&&(Yc(),vs&&(n=vs,t=_s,_s=vs=null,Om(n),t)))for(n=0;n<t.length;n++)Om(t[n])}}function Lo(t,n){var a=t.stateNode;if(a===null)return null;var s=a[Bt]||null;if(s===null)return null;a=s[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(t=t.type,s=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!s;break t;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(r(231,n,typeof a));return a}var pa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),mf=!1;if(pa)try{var Oo={};Object.defineProperty(Oo,"passive",{get:function(){mf=!0}}),window.addEventListener("test",Oo,Oo),window.removeEventListener("test",Oo,Oo)}catch{mf=!1}var Ga=null,gf=null,Zl=null;function Bm(){if(Zl)return Zl;var t,n=gf,a=n.length,s,c="value"in Ga?Ga.value:Ga.textContent,f=c.length;for(t=0;t<a&&n[t]===c[t];t++);var _=a-t;for(s=1;s<=_&&n[a-s]===c[f-s];s++);return Zl=c.slice(t,1<s?1-s:void 0)}function Kl(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function Ql(){return!0}function Im(){return!1}function Gn(t){function n(a,s,c,f,_){this._reactName=a,this._targetInst=c,this.type=s,this.nativeEvent=f,this.target=_,this.currentTarget=null;for(var b in t)t.hasOwnProperty(b)&&(a=t[b],this[b]=a?a(f):f[b]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?Ql:Im,this.isPropagationStopped=Im,this}return B(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Ql)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Ql)},persist:function(){},isPersistent:Ql}),n}var Va={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Jl=Gn(Va),Po=B({},Va,{view:0,detail:0}),eS=Gn(Po),vf,_f,Bo,$l=B({},Po,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:xf,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Bo&&(Bo&&t.type==="mousemove"?(vf=t.screenX-Bo.screenX,_f=t.screenY-Bo.screenY):_f=vf=0,Bo=t),vf)},movementY:function(t){return"movementY"in t?t.movementY:_f}}),Fm=Gn($l),nS=B({},$l,{dataTransfer:0}),iS=Gn(nS),aS=B({},Po,{relatedTarget:0}),yf=Gn(aS),rS=B({},Va,{animationName:0,elapsedTime:0,pseudoElement:0}),sS=Gn(rS),oS=B({},Va,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),lS=Gn(oS),cS=B({},Va,{data:0}),Hm=Gn(cS),uS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},fS={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},dS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function hS(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=dS[t])?!!n[t]:!1}function xf(){return hS}var pS=B({},Po,{key:function(t){if(t.key){var n=uS[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=Kl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?fS[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:xf,charCode:function(t){return t.type==="keypress"?Kl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Kl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),mS=Gn(pS),gS=B({},$l,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),km=Gn(gS),vS=B({},Va,{submitter:0}),_S=Gn(vS),yS=B({},Po,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:xf}),xS=Gn(yS),SS=B({},Va,{propertyName:0,elapsedTime:0,pseudoElement:0}),MS=Gn(SS),ES=B({},$l,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),bS=Gn(ES),TS=B({},Va,{newState:0,oldState:0,source:0}),wS=Gn(TS),AS=[9,13,27,32],Sf=pa&&"CompositionEvent"in window,Io=null;pa&&"documentMode"in document&&(Io=document.documentMode);var RS=pa&&"TextEvent"in window&&!Io,Gm=pa&&(!Sf||Io&&8<Io&&11>=Io),Vm=" ",jm=!1;function Xm(t,n){switch(t){case"keyup":return AS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function qm(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ys=!1;function CS(t,n){switch(t){case"compositionend":return qm(n);case"keypress":return n.which!==32?null:(jm=!0,Vm);case"textInput":return t=n.data,t===Vm&&jm?null:t;default:return null}}function DS(t,n){if(ys)return t==="compositionend"||!Sf&&Xm(t,n)?(t=Bm(),Zl=gf=Ga=null,ys=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Gm&&n.locale!=="ko"?null:n.data;default:return null}}var NS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Wm(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!NS[t.type]:n==="textarea"}function Ym(t,n,a,s){vs?_s?_s.push(s):_s=[s]:vs=s,n=tu(n,"onChange"),0<n.length&&(a=new Jl("onChange","change",null,a,s),t.push({event:a,listeners:n}))}var Fo=null,Ho=null;function US(t){Ov(t,0)}function tc(t){var n=Ee(t);if(Cm(n))return t}function Zm(t,n){if(t==="change")return n}var Km=!1;if(pa){var Mf;if(pa){var Ef="oninput"in document;if(!Ef){var Qm=document.createElement("div");Qm.setAttribute("oninput","return;"),Ef=typeof Qm.oninput=="function"}Mf=Ef}else Mf=!1;Km=Mf&&(!document.documentMode||9<document.documentMode)}function Jm(){Fo&&(Fo.detachEvent("onpropertychange",$m),Ho=Fo=null)}function $m(t){if(t.propertyName==="value"&&tc(Ho)){var n=[];Ym(n,Ho,t,hf(t)),Pm(US,n)}}function zS(t,n,a){t==="focusin"?(Jm(),Fo=n,Ho=a,Fo.attachEvent("onpropertychange",$m)):t==="focusout"&&Jm()}function LS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return tc(Ho)}function OS(t,n){if(t==="click")return tc(n)}function PS(t,n){if(t==="input"||t==="change")return tc(n)}function BS(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var oi=typeof Object.is=="function"?Object.is:BS;function ko(t,n){if(oi(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),s=Object.keys(n);if(a.length!==s.length)return!1;for(s=0;s<a.length;s++){var c=a[s];if(!se.call(n,c)||!oi(t[c],n[c]))return!1}return!0}function bf(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function tg(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function eg(t,n){var a=tg(t);t=0;for(var s;a;){if(a.nodeType===3){if(s=t+a.textContent.length,t<=n&&s>=n)return{node:a,offset:n-t};t=s}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=tg(a)}}function ng(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?ng(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function ig(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=bf(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=bf(t.document)}return n}function Tf(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var IS=pa&&"documentMode"in document&&11>=document.documentMode,xs=null,wf=null,Go=null,Af=!1;function ag(t,n,a){var s=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Af||xs==null||xs!==bf(s)||(s=xs,"selectionStart"in s&&Tf(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),Go&&ko(Go,s)||(Go=s,s=tu(wf,"onSelect"),0<s.length&&(n=new Jl("onSelect","select",null,n,a),t.push({event:n,listeners:s}),n.target=xs)))}function Dr(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var Ss={animationend:Dr("Animation","AnimationEnd"),animationiteration:Dr("Animation","AnimationIteration"),animationstart:Dr("Animation","AnimationStart"),transitionrun:Dr("Transition","TransitionRun"),transitionstart:Dr("Transition","TransitionStart"),transitioncancel:Dr("Transition","TransitionCancel"),transitionend:Dr("Transition","TransitionEnd")},Rf={},rg={};pa&&(rg=document.createElement("div").style,"AnimationEvent"in window||(delete Ss.animationend.animation,delete Ss.animationiteration.animation,delete Ss.animationstart.animation),"TransitionEvent"in window||delete Ss.transitionend.transition);function Nr(t){if(Rf[t])return Rf[t];if(!Ss[t])return t;var n=Ss[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in rg)return Rf[t]=n[a];return t}var sg=Nr("animationend"),og=Nr("animationiteration"),lg=Nr("animationstart"),FS=Nr("transitionrun"),HS=Nr("transitionstart"),kS=Nr("transitioncancel"),cg=Nr("transitionend"),ug=new Map,Cf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Cf.push("scrollEnd");function Di(t,n){ug.set(t,n),ln(n,[t])}var GS=0;function ma(t,n){if(t.name!=null&&t.name!=="auto")return t.name;if(n.autoName!==null)return n.autoName;t=Li.identifierPrefix;var a=GS++;return t="_"+t+"t_"+a.toString(32)+"_",n.autoName=t}function fg(t){if(t==null||typeof t=="string")return t;var n=null,a=ks;if(a!==null)for(var s=0;s<a.length;s++){var c=t[a[s]];if(c!=null){if(c==="none")return"none";n=n==null?c:n+(" "+c)}}return n??t.default}function ga(t,n){return t=fg(t),n=fg(n),n==null?t==="auto"?null:t:n==="auto"?null:n}var ec=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},vi=[],Ms=0,Df=0;function nc(){for(var t=Ms,n=Df=Ms=0;n<t;){var a=vi[n];vi[n++]=null;var s=vi[n];vi[n++]=null;var c=vi[n];vi[n++]=null;var f=vi[n];if(vi[n++]=null,s!==null&&c!==null){var _=s.pending;_===null?c.next=c:(c.next=_.next,_.next=c),s.pending=c}f!==0&&dg(a,c,f)}}function ic(t,n,a,s){vi[Ms++]=t,vi[Ms++]=n,vi[Ms++]=a,vi[Ms++]=s,Df|=s,t.lanes|=s,t=t.alternate,t!==null&&(t.lanes|=s)}function Nf(t,n,a,s){return ic(t,n,a,s),ac(t)}function Ur(t,n){return ic(t,null,null,n),ac(t)}function dg(t,n,a){t.lanes|=a;var s=t.alternate;s!==null&&(s.lanes|=a);for(var c=!1,f=t.return;f!==null;)f.childLanes|=a,s=f.alternate,s!==null&&(s.childLanes|=a),f.tag===22&&(t=f.stateNode,t===null||t._visibility&1||(c=!0)),t=f,f=f.return;return t.tag===3?(f=t.stateNode,c&&n!==null&&(c=31-Bn(a),t=f.hiddenUpdates,s=t[c],s===null?t[c]=[n]:s.push(n),n.lane=a|536870912),f):null}function ac(t){if(50<ul)throw ul=0,Wc=null,Error(r(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var Es={};function VS(t,n,a,s){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Zn(t,n,a,s){return new VS(t,n,a,s)}function Uf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function va(t,n){var a=t.alternate;return a===null?(a=Zn(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&1206910976,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function hg(t,n){t.flags&=1206910978;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function rc(t,n,a,s,c,f){var _=0;if(s=t,typeof s=="function")Uf(s)&&(_=1);else if(typeof s=="string")_=vE(t,a,ve.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(s){case At:return t=Zn(31,a,n,c),t.elementType=At,t.lanes=f,t;case L:return zr(a.children,c,f,n);case et:_=8,c|=24;break;case K:return t=Zn(12,a,n,c|2),t.elementType=K,t.lanes=f,t;case Y:return t=Zn(13,a,n,c),t.elementType=Y,t.lanes=f,t;case q:return t=Zn(19,a,n,c),t.elementType=q,t.lanes=f,t;case Wt:case U:return t=c|32,t=Zn(30,a,n,t),t.elementType=U,t.lanes=f,t.stateNode={autoName:null,paired:null,clones:null,ref:null},t;default:if(typeof s=="object"&&s!==null)switch(s.$$typeof){case st:_=10;break t;case ft:_=9;break t;case k:_=11;break t;case _t:_=14;break t;case mt:_=16,s=null;break t}_=29,a=Error(r(130,t===null?"null":typeof t,"")),s=null}return n=Zn(_,a,n,c),n.elementType=t,n.type=s,n.lanes=f,n}function zr(t,n,a,s){return t=Zn(7,t,s,n),t.lanes=a,t}function zf(t,n,a){return t=Zn(6,t,null,n),t.lanes=a,t}function pg(t){var n=Zn(18,null,null,0);return n.stateNode=t,n}function Lf(t,n,a){return n=Zn(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var mg=new WeakMap;function _i(t,n){if(typeof t=="object"&&t!==null){var a=mg.get(t);return a!==void 0?a:(n={value:t,source:n,stack:ne(n)},mg.set(t,n),n)}return{value:t,source:n,stack:ne(n)}}var bs=[],Ts=0,sc=null,Vo=0,yi=[],xi=0,ja=null,Wi=1,Yi="";function _a(t,n){bs[Ts++]=Vo,bs[Ts++]=sc,sc=t,Vo=n}function gg(t,n,a){yi[xi++]=Wi,yi[xi++]=Yi,yi[xi++]=ja,ja=t;var s=Wi;t=Yi;var c=32-Bn(s)-1;s&=~(1<<c),a+=1;var f=32-Bn(n)+c;if(30<f){var _=c-c%5;f=(s&(1<<_)-1).toString(32),s>>=_,c-=_,Wi=1<<32-Bn(n)+c|a<<c|s,Yi=f+t}else Wi=1<<f|a<<c|s,Yi=t}function oc(t){t.return!==null&&(_a(t,1),gg(t,1,0))}function Of(t){for(;t===sc;)sc=bs[--Ts],bs[Ts]=null,Vo=bs[--Ts],bs[Ts]=null;for(;t===ja;)ja=yi[--xi],yi[xi]=null,Yi=yi[--xi],yi[xi]=null,Wi=yi[--xi],yi[xi]=null}function vg(t,n){yi[xi++]=Wi,yi[xi++]=Yi,yi[xi++]=ja,Wi=n.id,Yi=n.overflow,ja=t}var Sn=null,We=null,ge=!1,Xa=null,Si=!1,Pf=Error(r(519));function qa(t){var n=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw jo(_i(n,t)),Pf}function _g(t){var n=t.stateNode,a=t.type,s=t.memoizedProps;switch(n[Dt]=t,n[Bt]=s,a){case"dialog":Se("cancel",n),Se("close",n);break;case"iframe":case"object":case"embed":Se("load",n);break;case"video":case"audio":for(a=0;a<dl.length;a++)Se(dl[a],n);break;case"source":Se("error",n);break;case"img":case"image":case"link":Se("error",n),Se("load",n);break;case"details":Se("toggle",n);break;case"input":Se("invalid",n),Dm(n,s.value,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name,!0);break;case"select":Se("invalid",n);break;case"textarea":Se("invalid",n),Um(n,s.value,s.defaultValue,s.children)}a=s.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||s.suppressHydrationWarning===!0||Fv(n.textContent,a)?(s.popover!=null&&(Se("beforetoggle",n),Se("toggle",n)),s.onScroll!=null&&Se("scroll",n),s.onScrollEnd!=null&&Se("scrollend",n),s.onClick!=null&&(n.onclick=qi),n=!0):n=!1,n||qa(t,!0)}function lc(t){for(Sn=t.return;Sn;)switch(Sn.tag){case 5:case 31:case 13:Si=!1;return;case 27:case 3:Si=!0;return;default:Sn=Sn.return}}function ws(t){if(t!==Sn)return!1;if(!ge)return lc(t),ge=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||dh(t.type,t.memoizedProps)),a=!a),a&&We&&qa(t),lc(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));We=a_(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));We=a_(t)}else n===27?(n=We,lr(t.type)?(t=Sh,Sh=null,We=t):We=n):We=Sn?Ei(t.stateNode.nextSibling):null;return!0}function Lr(){We=Sn=null,ge=!1}function Bf(){var t=Xa;return t!==null&&(Jn===null?Jn=t:Jn.push.apply(Jn,t),Xa=null),t}function jo(t){Xa===null?Xa=[t]:Xa.push(t)}var If=re(null),Or=null,ya=null;function Wa(t,n,a){Nt(If,n._currentValue),n._currentValue=a}function xa(t){t._currentValue=If.current,Jt(If)}function cc(t,n,a){for(;t!==null;){var s=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,s!==null&&(s.childLanes|=n)):s!==null&&(s.childLanes&n)!==n&&(s.childLanes|=n),t===a)break;t=t.return}}function Ff(t,n,a,s){var c=t.child;for(c!==null&&(c.return=t);c!==null;){var f=c.dependencies;if(f!==null){var _=c.child;f=f.firstContext;t:for(;f!==null;){var b=f;f=c;for(var I=0;I<n.length;I++)if(b.context===n[I]){f.lanes|=a,b=f.alternate,b!==null&&(b.lanes|=a),cc(f.return,a,t),s||(_=null);break t}f=b.next}}else if(c.tag===18){if(_=c.return,_===null)throw Error(r(341));_.lanes|=a,f=_.alternate,f!==null&&(f.lanes|=a),cc(_,a,t),_=null}else c.tag===13&&c.memoizedState!==null&&c.memoizedState.dehydrated===null?(c.lanes|=a,_=c.alternate,_!==null&&(_.lanes|=a),cc(c.return,a,t),_=c.child,_=_!==null?_.sibling:null):_=c.child;if(_!==null)_.return=c;else for(_=c;_!==null;){if(_===t){_=null;break}if(c=_.sibling,c!==null){c.return=_.return,_=c;break}_=_.return}c=_}}function Pr(t,n,a,s){t=null;for(var c=n,f=!1;c!==null;){if(!f){if((c.flags&524288)!==0)f=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var _=c.alternate;if(_===null)throw Error(r(387));if(_=_.memoizedProps,_!==null){var b=c.type;oi(c.pendingProps.value,_.value)||(t!==null?t.push(b):t=[b])}}else if(c===A.current){if(_=c.alternate,_===null)throw Error(r(387));_.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(t!==null?t.push(Qs):t=[Qs])}c=c.return}return t!==null&&Ff(n,t,a,s),n.flags|=262144,t!==null}function uc(t){for(t=t.firstContext;t!==null;){if(!oi(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function Br(t){Or=t,ya=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function An(t){return yg(Or,t)}function fc(t,n){return Or===null&&Br(t),yg(t,n)}function yg(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},ya===null){if(t===null)throw Error(r(308));ya=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else ya=ya.next=n;return a}var jS=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,s){t.push(s)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},XS=o.unstable_scheduleCallback,qS=o.unstable_NormalPriority,cn={$$typeof:st,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Hf(){return{controller:new jS,data:new Map,refCount:0}}function Xo(t){t.refCount--,t.refCount===0&&XS(qS,function(){t.controller.abort()})}function xg(t,n){if((t.pendingLanes&4194048)!==0){var a=t.transitionTypes;for(a===null&&(a=t.transitionTypes=[]),t=0;t<n.length;t++){var s=n[t];a.indexOf(s)===-1&&a.push(s)}}}var qo=null;function WS(t){var n=t.transitionTypes;return t.transitionTypes=null,n}var Wo=null,kf=0,Ir=0,As=null;function YS(t,n){if(Wo===null){var a=Wo=[];kf=0,Ir=ih(),As={status:"pending",value:void 0,then:function(s){a.push(s)}}}return kf++,n.then(Sg,Sg),n}function Sg(){if(--kf===0&&(qo=null,Wo!==null)){As!==null&&(As.status="fulfilled");var t=Wo;Wo=null,Ir=0,As=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function ZS(t,n){var a=[],s={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return t.then(function(){s.status="fulfilled",s.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(s.status="rejected",s.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),s}var Mg=bt.S;bt.S=function(t,n){if(pv=W(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&YS(t,n),qo!==null)for(var a=Xs;a!==null;)xg(a,qo),a=a.next;if(a=t.types,a!==null){for(var s=Xs;s!==null;)xg(s,a),s=s.next;if(Ir!==0){s=qo,s===null&&(s=qo=[]);for(var c=0;c<a.length;c++){var f=a[c];s.indexOf(f)===-1&&s.push(f)}}}Mg!==null&&Mg(t,n)};var Fr=re(null);function Gf(){var t=Fr.current;return t!==null?t:Xe.pooledCache}function dc(t,n){n===null?Nt(Fr,Fr.current):Nt(Fr,n.pool)}function Eg(){var t=Gf();return t===null?null:{parent:cn._currentValue,pool:t}}var Rs=Error(r(460)),Vf=Error(r(474)),hc=Error(r(542)),pc={then:function(){}};function bg(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Tg(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(qi,qi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Ag(t),t===void 0&&!("reason"in n)?Error(r(600)):t;default:if(typeof n.status=="string")n.then(qi,qi);else{if(t=Xe,t!==null&&100<t.shellSuspendCounter)throw Error(r(482));t=n,t.status="pending",t.then(function(s){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=s}},function(s){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=s}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Ag(t),t}throw kr=n,Rs}}function Hr(t){try{var n=t._init;return n(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(kr=a,Rs):a}}var kr=null;function wg(){if(kr===null)throw Error(r(459));var t=kr;return kr=null,t}function Ag(t){if(t===Rs||t===hc)throw Error(r(483))}var Cs=null,Yo=0;function mc(t){var n=Yo;return Yo+=1,Cs===null&&(Cs=[]),Tg(Cs,t,n)}function Ya(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function gc(t,n){throw n.$$typeof===F?Error(r(525)):(t=Object.prototype.toString.call(n),Error(r(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function Rg(t){function n(J,j){if(t){var rt=J.deletions;rt===null?(J.deletions=[j],J.flags|=16):rt.push(j)}}function a(J,j){if(!t)return null;for(;j!==null;)n(J,j),j=j.sibling;return null}function s(J){for(var j=new Map;J!==null;)J.key===null?j.set(J.index,J):j.set(J.key,J),J=J.sibling;return j}function c(J,j){return J=va(J,j),J.index=0,J.sibling=null,J}function f(J,j,rt){return J.index=rt,t?(rt=J.alternate,rt!==null?(rt=rt.index,rt<j?(J.flags|=2,j):rt):(J.flags|=134217730,j)):(J.flags|=1048576,j)}function _(J){return t&&J.alternate===null&&(J.flags|=134217730),J}function b(J,j,rt,yt){return j===null||j.tag!==6?(j=zf(rt,J.mode,yt),j.return=J,j):(j=c(j,rt),j.return=J,j)}function I(J,j,rt,yt){var Vt=rt.type;return Vt===L?(J=ut(J,j,rt.props.children,yt,rt.key),Ya(J,rt),J):j!==null&&(j.elementType===Vt||typeof Vt=="object"&&Vt!==null&&Vt.$$typeof===mt&&Hr(Vt)===j.type)?(j=c(j,rt.props),Ya(j,rt),j.return=J,j):(j=rc(rt.type,rt.key,rt.props,null,J.mode,yt),Ya(j,rt),j.return=J,j)}function $(J,j,rt,yt){return j===null||j.tag!==4||j.stateNode.containerInfo!==rt.containerInfo||j.stateNode.implementation!==rt.implementation?(j=Lf(rt,J.mode,yt),j.return=J,j):(j=c(j,rt.children||[]),j.return=J,j)}function ut(J,j,rt,yt,Vt){return j===null||j.tag!==7?(j=zr(rt,J.mode,yt,Vt),j.return=J,j):(j=c(j,rt),j.return=J,j)}function xt(J,j,rt){if(typeof j=="string"&&j!==""||typeof j=="number"||typeof j=="bigint")return j=zf(""+j,J.mode,rt),j.return=J,j;if(typeof j=="object"&&j!==null){switch(j.$$typeof){case R:return rt=rc(j.type,j.key,j.props,null,J.mode,rt),Ya(rt,j),rt.return=J,rt;case E:return j=Lf(j,J.mode,rt),j.return=J,j;case mt:return j=Hr(j),xt(J,j,rt)}if(Et(j)||dt(j))return j=zr(j,J.mode,rt,null),j.return=J,j;if(typeof j.then=="function")return xt(J,mc(j),rt);if(j.$$typeof===st)return xt(J,fc(J,j),rt);gc(J,j)}return null}function Z(J,j,rt,yt){var Vt=j!==null?j.key:null;if(typeof rt=="string"&&rt!==""||typeof rt=="number"||typeof rt=="bigint")return Vt!==null?null:b(J,j,""+rt,yt);if(typeof rt=="object"&&rt!==null){switch(rt.$$typeof){case R:return rt.key===Vt?I(J,j,rt,yt):null;case E:return rt.key===Vt?$(J,j,rt,yt):null;case mt:return rt=Hr(rt),Z(J,j,rt,yt)}if(Et(rt)||dt(rt))return Vt!==null?null:ut(J,j,rt,yt,null);if(typeof rt.then=="function")return Z(J,j,mc(rt),yt);if(rt.$$typeof===st)return Z(J,j,fc(J,rt),yt);gc(J,rt)}return null}function ot(J,j,rt,yt,Vt){if(typeof yt=="string"&&yt!==""||typeof yt=="number"||typeof yt=="bigint")return J=J.get(rt)||null,b(j,J,""+yt,Vt);if(typeof yt=="object"&&yt!==null){switch(yt.$$typeof){case R:return J=J.get(yt.key===null?rt:yt.key)||null,I(j,J,yt,Vt);case E:return J=J.get(yt.key===null?rt:yt.key)||null,$(j,J,yt,Vt);case mt:return yt=Hr(yt),ot(J,j,rt,yt,Vt)}if(Et(yt)||dt(yt))return J=J.get(rt)||null,ut(j,J,yt,Vt,null);if(typeof yt.then=="function")return ot(J,j,rt,mc(yt),Vt);if(yt.$$typeof===st)return ot(J,j,rt,fc(j,yt),Vt);gc(j,yt)}return null}function Lt(J,j,rt,yt){for(var Vt=null,Te=null,Qt=j,ie=j=0,dn=null;Qt!==null&&ie<rt.length;ie++){Qt.index>ie?(dn=Qt,Qt=null):dn=Qt.sibling;var Re=Z(J,Qt,rt[ie],yt);if(Re===null){Qt===null&&(Qt=dn);break}t&&Qt&&Re.alternate===null&&n(J,Qt),j=f(Re,j,ie),Te===null?Vt=Re:Te.sibling=Re,Te=Re,Qt=dn}if(ie===rt.length)return a(J,Qt),ge&&_a(J,ie),Vt;if(Qt===null){for(;ie<rt.length;ie++)Qt=xt(J,rt[ie],yt),Qt!==null&&(j=f(Qt,j,ie),Te===null?Vt=Qt:Te.sibling=Qt,Te=Qt);return ge&&_a(J,ie),Vt}for(Qt=s(Qt);ie<rt.length;ie++)dn=ot(Qt,J,ie,rt[ie],yt),dn!==null&&(t&&(Re=dn.alternate,Re!==null&&Qt.delete(Re.key===null?ie:Re.key)),j=f(dn,j,ie),Te===null?Vt=dn:Te.sibling=dn,Te=dn);return t&&Qt.forEach(function(hr){return n(J,hr)}),ge&&_a(J,ie),Vt}function qt(J,j,rt,yt){if(rt==null)throw Error(r(151));for(var Vt=null,Te=null,Qt=j,ie=j=0,dn=null,Re=rt.next();Qt!==null&&!Re.done;ie++,Re=rt.next()){Qt.index>ie?(dn=Qt,Qt=null):dn=Qt.sibling;var hr=Z(J,Qt,Re.value,yt);if(hr===null){Qt===null&&(Qt=dn);break}t&&Qt&&hr.alternate===null&&n(J,Qt),j=f(hr,j,ie),Te===null?Vt=hr:Te.sibling=hr,Te=hr,Qt=dn}if(Re.done)return a(J,Qt),ge&&_a(J,ie),Vt;if(Qt===null){for(;!Re.done;ie++,Re=rt.next())Re=xt(J,Re.value,yt),Re!==null&&(j=f(Re,j,ie),Te===null?Vt=Re:Te.sibling=Re,Te=Re);return ge&&_a(J,ie),Vt}for(Qt=s(Qt);!Re.done;ie++,Re=rt.next())Re=ot(Qt,J,ie,Re.value,yt),Re!==null&&(t&&(dn=Re.alternate,dn!==null&&Qt.delete(dn.key===null?ie:dn.key)),j=f(Re,j,ie),Te===null?Vt=Re:Te.sibling=Re,Te=Re);return t&&Qt.forEach(function(CE){return n(J,CE)}),ge&&_a(J,ie),Vt}function de(J,j,rt,yt){if(typeof rt=="object"&&rt!==null&&rt.type===L&&rt.key===null&&rt.props.ref===void 0&&(rt=rt.props.children),typeof rt=="object"&&rt!==null){switch(rt.$$typeof){case R:t:{for(var Vt=rt.key;j!==null;){if(j.key===Vt){if(Vt=rt.type,Vt===L){if(j.tag===7){a(J,j.sibling),yt=c(j,rt.props.children),Ya(yt,rt),yt.return=J,J=yt;break t}}else if(j.elementType===Vt||typeof Vt=="object"&&Vt!==null&&Vt.$$typeof===mt&&Hr(Vt)===j.type){a(J,j.sibling),yt=c(j,rt.props),Ya(yt,rt),yt.return=J,J=yt;break t}a(J,j);break}else n(J,j);j=j.sibling}rt.type===L?(yt=zr(rt.props.children,J.mode,yt,rt.key),Ya(yt,rt),yt.return=J,J=yt):(yt=rc(rt.type,rt.key,rt.props,null,J.mode,yt),Ya(yt,rt),yt.return=J,J=yt)}return _(J);case E:t:{for(Vt=rt.key;j!==null;){if(j.key===Vt)if(j.tag===4&&j.stateNode.containerInfo===rt.containerInfo&&j.stateNode.implementation===rt.implementation){a(J,j.sibling),yt=c(j,rt.children||[]),yt.return=J,J=yt;break t}else{a(J,j);break}else n(J,j);j=j.sibling}yt=Lf(rt,J.mode,yt),yt.return=J,J=yt}return _(J);case mt:return rt=Hr(rt),de(J,j,rt,yt)}if(Et(rt))return Lt(J,j,rt,yt);if(dt(rt)){if(Vt=dt(rt),typeof Vt!="function")throw Error(r(150));return rt=Vt.call(rt),qt(J,j,rt,yt)}if(typeof rt.then=="function")return de(J,j,mc(rt),yt);if(rt.$$typeof===st)return de(J,j,fc(J,rt),yt);gc(J,rt)}return typeof rt=="string"&&rt!==""||typeof rt=="number"||typeof rt=="bigint"?(rt=""+rt,j!==null&&j.tag===6?(a(J,j.sibling),yt=c(j,rt),yt.return=J,J=yt):(a(J,j),yt=zf(rt,J.mode,yt),yt.return=J,J=yt),_(J)):a(J,j)}return function(J,j,rt,yt){try{Yo=0;var Vt=de(J,j,rt,yt);return Cs=null,Vt}catch(Qt){if(Qt===Rs||Qt===hc)throw Qt;var Te=Zn(29,Qt,null,J.mode);return Te.lanes=yt,Te.return=J,Te}finally{}}}var Gr=Rg(!0),Cg=Rg(!1),Za=!1;function jf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Xf(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Ka(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Qa(t,n,a){var s=t.updateQueue;if(s===null)return null;if(s=s.shared,(ze&2)!==0){var c=s.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),s.pending=n,n=ac(t),dg(t,null,a),n}return ic(t,s,n,a),ac(t)}function Zo(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,D(t,a)}}function qf(t,n){var a=t.updateQueue,s=t.alternate;if(s!==null&&(s=s.updateQueue,a===s)){var c=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var _={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?c=f=_:f=f.next=_,a=a.next}while(a!==null);f===null?c=f=n:f=f.next=n}else c=f=n;a={baseState:s.baseState,firstBaseUpdate:c,lastBaseUpdate:f,shared:s.shared,callbacks:s.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var Wf=!1;function Ko(){if(Wf){var t=As;if(t!==null)throw t}}function Qo(t,n,a,s){Wf=!1;var c=t.updateQueue;Za=!1;var f=c.firstBaseUpdate,_=c.lastBaseUpdate,b=c.shared.pending;if(b!==null){c.shared.pending=null;var I=b,$=I.next;I.next=null,_===null?f=$:_.next=$,_=I;var ut=t.alternate;ut!==null&&(ut=ut.updateQueue,b=ut.lastBaseUpdate,b!==_&&(b===null?ut.firstBaseUpdate=$:b.next=$,ut.lastBaseUpdate=I))}if(f!==null){var xt=c.baseState;_=0,ut=$=I=null,b=f;do{var Z=b.lane&-536870913,ot=Z!==b.lane;if(ot?(be&Z)===Z:(s&Z)===Z){Z!==0&&Z===Ir&&(Wf=!0),ut!==null&&(ut=ut.next={lane:0,tag:b.tag,payload:b.payload,callback:null,next:null});t:{var Lt=t,qt=b;Z=n;var de=a;switch(qt.tag){case 1:if(Lt=qt.payload,typeof Lt=="function"){xt=Lt.call(de,xt,Z);break t}xt=Lt;break t;case 3:Lt.flags=Lt.flags&-65537|128;case 0:if(Lt=qt.payload,Z=typeof Lt=="function"?Lt.call(de,xt,Z):Lt,Z==null)break t;xt=B({},xt,Z);break t;case 2:Za=!0}}Z=b.callback,Z!==null&&(t.flags|=64,ot&&(t.flags|=8192),ot=c.callbacks,ot===null?c.callbacks=[Z]:ot.push(Z))}else ot={lane:Z,tag:b.tag,payload:b.payload,callback:b.callback,next:null},ut===null?($=ut=ot,I=xt):ut=ut.next=ot,_|=Z;if(b=b.next,b===null){if(b=c.shared.pending,b===null)break;ot=b,b=ot.next,ot.next=null,c.lastBaseUpdate=ot,c.shared.pending=null}}while(!0);ut===null&&(I=xt),c.baseState=I,c.firstBaseUpdate=$,c.lastBaseUpdate=ut,f===null&&(c.shared.lanes=0),ar|=_,t.lanes=_,t.memoizedState=xt}}function Dg(t,n){if(typeof t!="function")throw Error(r(191,t));t.call(n)}function Ng(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)Dg(a[t],n)}var Ja=re(null),vc=re(0);function Ug(t,n){t=Ta,Nt(vc,t),Nt(Ja,n),Ta=t|n.baseLanes}function Yf(){Nt(vc,Ta),Nt(Ja,Ja.current)}function Zf(){Ta=vc.current,Jt(Ja),Jt(vc)}var Rn=re(null),Fn=null;function $a(t){var n=t.alternate;Nt(Cn,Cn.current&1),Nt(Rn,t),Fn===null&&(n===null||Ja.current!==null||n.memoizedState!==null)&&(Fn=t)}function Kf(t){Nt(Cn,Cn.current),Nt(Rn,t),Fn===null&&(Fn=t)}function zg(t){t.tag===22?(Nt(Cn,Cn.current),Nt(Rn,t),Fn===null&&(Fn=t)):tr()}function tr(){Nt(Cn,Cn.current),Nt(Rn,Rn.current)}function li(t){Jt(Rn),Fn===t&&(Fn=null),Jt(Cn)}var Cn=re(0);function Jo(t,n){Nt(Rn,Rn.current),Nt(Cn,n)}function Qf(t){Jt(Cn),Jt(Rn),Fn===t&&(Fn=null)}function _c(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||yh(a)||xh(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Sa=0,fe=null,ke=null,un=null,yc=!1,Ds=!1,Vr=!1,xc=0,$o=0,Ns=null,KS=0;function rn(){throw Error(r(321))}function Jf(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!oi(t[a],n[a]))return!1;return!0}function $f(t,n,a,s,c,f){return Sa=f,fe=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,bt.H=t===null||t.memoizedState===null?g0:v0,Vr=!1,f=a(s,c),Vr=!1,Ds&&(f=Og(n,a,s,c)),Lg(t),f}function Lg(t){bt.H=Ac;var n=ke!==null&&ke.next!==null;if(Sa=0,un=ke=fe=null,yc=!1,$o=0,Ns=null,n)throw Error(r(300));t===null||fn||(t=t.dependencies,t!==null&&uc(t)&&(fn=!0))}function Og(t,n,a,s){fe=t;var c=0;do{if(Ds&&(Ns=null),$o=0,Ds=!1,25<=c)throw Error(r(301));if(c+=1,un=ke=null,t.updateQueue!=null){var f=t.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}bt.H=aM,f=n(a,s)}while(Ds);return f}function QS(){var t=bt.H,n=t.useState()[0];return n=typeof n.then=="function"?tl(n):n,t=t.useState()[0],(ke!==null?ke.memoizedState:null)!==t&&(fe.flags|=1024),n}function td(){var t=xc!==0;return xc=0,t}function ed(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function nd(t){if(yc){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}yc=!1}Sa=0,un=ke=fe=null,Ds=!1,$o=xc=0,Ns=null}function Vn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return un===null?fe.memoizedState=un=t:un=un.next=t,un}function on(){if(ke===null){var t=fe.alternate;t=t!==null?t.memoizedState:null}else t=ke.next;var n=un===null?fe.memoizedState:un.next;if(n!==null)un=n,ke=t;else{if(t===null)throw fe.alternate===null?Error(r(467)):Error(r(310));ke=t,t={memoizedState:ke.memoizedState,baseState:ke.baseState,baseQueue:ke.baseQueue,queue:ke.queue,next:null},un===null?fe.memoizedState=un=t:un=un.next=t}return un}function Sc(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function tl(t){var n=$o;return $o+=1,Ns===null&&(Ns=[]),t=Tg(Ns,t,n),n=fe,(un===null?n.memoizedState:un.next)===null&&(n=n.alternate,bt.H=n===null||n.memoizedState===null?g0:v0),t}function Mc(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return tl(t);if(t.$$typeof===Q)return;if(t.$$typeof===st)return An(t)}throw Error(r(438,String(t)))}function id(t){var n=null,a=fe.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var s=fe.alternate;s!==null&&(s=s.updateQueue,s!==null&&(s=s.memoCache,s!=null&&(n={data:s.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Sc(),fe.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),s=0;s<t;s++)a[s]=Kt;return n.index++,a}function Ma(t,n){return typeof n=="function"?n(t):n}function Ec(t){var n=on();return ad(n,ke,t)}function ad(t,n,a){var s=t.queue;if(s===null)throw Error(r(311));s.lastRenderedReducer=a;var c=t.baseQueue,f=s.pending;if(f!==null){if(c!==null){var _=c.next;c.next=f.next,f.next=_}n.baseQueue=c=f,s.pending=null}if(f=t.baseState,c===null)t.memoizedState=f;else{n=c.next;var b=_=null,I=null,$=n,ut=!1;do{var xt=$.lane&-536870913;if(xt!==$.lane?(be&xt)===xt:(Sa&xt)===xt){var Z=$.revertLane;if(Z===0)I!==null&&(I=I.next={lane:0,revertLane:0,gesture:null,action:$.action,hasEagerState:$.hasEagerState,eagerState:$.eagerState,next:null}),xt===Ir&&(ut=!0);else if((Sa&Z)===Z){$=$.next,Z===Ir&&(ut=!0);continue}else xt={lane:0,revertLane:$.revertLane,gesture:null,action:$.action,hasEagerState:$.hasEagerState,eagerState:$.eagerState,next:null},I===null?(b=I=xt,_=f):I=I.next=xt,fe.lanes|=Z,ar|=Z;xt=$.action,Vr&&a(f,xt),f=$.hasEagerState?$.eagerState:a(f,xt)}else Z={lane:xt,revertLane:$.revertLane,gesture:$.gesture,action:$.action,hasEagerState:$.hasEagerState,eagerState:$.eagerState,next:null},I===null?(b=I=Z,_=f):I=I.next=Z,fe.lanes|=xt,ar|=xt;$=$.next}while($!==null&&$!==n);if(I===null?_=f:I.next=b,!oi(f,t.memoizedState)&&(fn=!0,ut&&(a=As,a!==null)))throw a;t.memoizedState=f,t.baseState=_,t.baseQueue=I,s.lastRenderedState=f}return c===null&&(s.lanes=0),[t.memoizedState,s.dispatch]}function rd(t){var n=on(),a=n.queue;if(a===null)throw Error(r(311));a.lastRenderedReducer=t;var s=a.dispatch,c=a.pending,f=n.memoizedState;if(c!==null){a.pending=null;var _=c=c.next;do f=t(f,_.action),_=_.next;while(_!==c);oi(f,n.memoizedState)||(fn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,s]}function Pg(t,n,a){var s=fe,c=on(),f=ge;if(f){if(a===void 0)throw Error(r(407));a=a()}else a=n();var _=!oi((ke||c).memoizedState,a);if(_&&(c.memoizedState=a,fn=!0),c=c.queue,ld(Fg.bind(null,s,c,t),[t]),t=c.getSnapshot!==n||_||un!==null&&(un.memoizedState.tag&1)!==0,Us(t?9:8,{destroy:void 0},Ig.bind(null,s,c,a,n),null),t){if(s.flags|=2048,Xe===null)throw Error(r(349));f||(Sa&127)!==0||Bg(s,n,a)}return a}function Bg(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=fe.updateQueue,n===null?(n=Sc(),fe.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function Ig(t,n,a,s){n.value=a,n.getSnapshot=s,Hg(n)&&kg(t)}function Fg(t,n,a){return a(function(){Hg(n)&&kg(t)})}function Hg(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!oi(t,a)}catch{return!0}}function kg(t){var n=Ur(t,2);n!==null&&$n(n,t,2)}function sd(t){var n=Vn();if(typeof t=="function"){var a=t;if(t=a(),Vr){yn(!0);try{a()}finally{yn(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:t},n}function Gg(t,n,a,s){return t.baseState=a,ad(t,ke,typeof s=="function"?s:Ma)}function JS(t,n,a,s,c){if(wc(t))throw Error(r(485));if(t=n.action,t!==null){var f={payload:c,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(_){f.listeners.push(_)}};bt.T!==null?a(!0):f.isTransition=!1,s(f),a=n.pending,a===null?(f.next=n.pending=f,Vg(n,f)):(f.next=a.next,n.pending=a.next=f)}}function Vg(t,n){var a=n.action,s=n.payload,c=t.state;if(n.isTransition){var f=bt.T,_={};_.types=f!==null?f.types:null,bt.T=_;try{var b=a(c,s),I=bt.S;I!==null&&I(_,b),jg(t,n,b)}catch($){od(t,n,$)}finally{f!==null&&_.types!==null&&(f.types=_.types),bt.T=f}}else try{f=a(c,s),jg(t,n,f)}catch($){od(t,n,$)}}function jg(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(s){Xg(t,n,s)},function(s){return od(t,n,s)}):Xg(t,n,a)}function Xg(t,n,a){n.status="fulfilled",n.value=a,qg(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,Vg(t,a)))}function od(t,n,a){var s=t.pending;if(t.pending=null,s!==null){s=s.next;do n.status="rejected",n.reason=a,qg(n),n=n.next;while(n!==s)}t.action=null}function qg(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function Wg(t,n){return n}function Yg(t,n){if(ge){var a=Xe.formState;if(a!==null){t:{var s=fe;if(ge){if(We){e:{for(var c=We,f=Si;c.nodeType!==8;){if(!f){c=null;break e}if(c=Ei(c.nextSibling),c===null){c=null;break e}}f=c.data,c=f==="F!"||f==="F"?c:null}if(c){We=Ei(c.nextSibling),s=c.data==="F!";break t}}qa(s)}s=!1}s&&(n=a[0])}}return a=Vn(),a.memoizedState=a.baseState=n,s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Wg,lastRenderedState:n},a.queue=s,a=h0.bind(null,fe,s),s.dispatch=a,s=sd(!1),f=hd.bind(null,fe,!1,s.queue),s=Vn(),c={state:n,dispatch:null,action:t,pending:null},s.queue=c,a=JS.bind(null,fe,c,f,a),c.dispatch=a,s.memoizedState=t,[n,a,!1]}function Zg(t){var n=on();return Kg(n,ke,t)}function Kg(t,n,a){if(n=ad(t,n,Wg)[0],t=Ec(Ma)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var s=tl(n)}catch(_){throw _===Rs?hc:_}else s=n;n=on();var c=n.queue,f=c.dispatch;return a!==n.memoizedState&&(fe.flags|=2048,Us(9,{destroy:void 0},$S.bind(null,c,a),null)),[s,f,t]}function $S(t,n){t.action=n}function Qg(t){var n=on(),a=ke;if(a!==null)return Kg(n,a,t);on(),n=n.memoizedState,a=on();var s=a.queue.dispatch;return a.memoizedState=t,[n,s,!1]}function Us(t,n,a,s){return t={tag:t,create:a,deps:s,inst:n,next:null},n=fe.updateQueue,n===null&&(n=Sc(),fe.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(s=a.next,a.next=t,t.next=s,n.lastEffect=t),t}function Jg(){return on().memoizedState}function bc(t,n,a,s){var c=Vn();fe.flags|=t,c.memoizedState=Us(1|n,{destroy:void 0},a,s===void 0?null:s)}function Tc(t,n,a,s){var c=on();s=s===void 0?null:s;var f=c.memoizedState.inst;ke!==null&&s!==null&&Jf(s,ke.memoizedState.deps)?c.memoizedState=Us(n,f,a,s):(fe.flags|=t,c.memoizedState=Us(1|n,f,a,s))}function $g(t,n){bc(8390656,8,t,n)}function ld(t,n){Tc(2048,8,t,n)}function tM(t){fe.flags|=4;var n=fe.updateQueue;if(n===null)n=Sc(),fe.updateQueue=n,n.events=[t];else{var a=n.events;a===null?n.events=[t]:a.push(t)}}function t0(t){var n=on().memoizedState;return tM({ref:n,nextImpl:t}),function(){if((ze&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}function e0(t,n){return Tc(4,2,t,n)}function n0(t,n){return Tc(4,4,t,n)}function i0(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function a0(t,n,a){a=a!=null?a.concat([t]):null,Tc(4,4,i0.bind(null,n,t),a)}function cd(){}function r0(t,n){var a=on();n=n===void 0?null:n;var s=a.memoizedState;return n!==null&&Jf(n,s[1])?s[0]:(a.memoizedState=[t,n],t)}function s0(t,n){var a=on();n=n===void 0?null:n;var s=a.memoizedState;if(n!==null&&Jf(n,s[1]))return s[0];if(s=t(),Vr){yn(!0);try{t()}finally{yn(!1)}}return a.memoizedState=[s,n],s}function ud(t,n,a){return a===void 0||(Sa&1073741824)!==0&&(be&261930)===0?t.memoizedState=n:(t.memoizedState=a,t=gv(),fe.lanes|=t,ar|=t,a)}function o0(t,n,a,s){return oi(a,n)?a:Ja.current!==null?(t=ud(t,a,s),oi(t,n)||(fn=!0),t):(Sa&106)===0||(Sa&1073741824)!==0&&(be&261930)===0?(fn=!0,t.memoizedState=a):(t=gv(),fe.lanes|=t,ar|=t,n)}function l0(t,n,a,s,c){var f=zt.p;zt.p=f!==0&&8>f?f:8;var _=bt.T,b={};b.types=_!==null?_.types:null,bt.T=b,hd(t,!1,n,a);try{var I=c(),$=bt.S;if($!==null&&$(b,I),I!==null&&typeof I=="object"&&typeof I.then=="function"){var ut=ZS(I,s);el(t,n,ut,di(t))}else el(t,n,s,di(t))}catch(xt){el(t,n,{then:function(){},status:"rejected",reason:xt},di())}finally{zt.p=f,_!==null&&b.types!==null&&(_.types=b.types),bt.T=_}}function eM(){}function fd(t,n,a,s){if(t.tag!==5)throw Error(r(476));var c=c0(t).queue;l0(t,c,n,te,a===null?eM:function(){return u0(t),a(s)})}function c0(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:te,baseState:te,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:te},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function u0(t){var n=c0(t);n.next===null&&(n=t.alternate.memoizedState),el(t,n.next.queue,{},di())}function dd(){return An(Qs)}function f0(){return on().memoizedState}function d0(){return on().memoizedState}function nM(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=di();t=Ka(a);var s=Qa(n,t,a);s!==null&&($n(s,n,a),Zo(s,n,a)),n={cache:Hf()},t.payload=n;return}n=n.return}}function iM(t,n,a){var s=di();a={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},wc(t)?p0(n,a):(a=Nf(t,n,a,s),a!==null&&($n(a,t,s),m0(a,n,s)))}function h0(t,n,a){var s=di();el(t,n,a,s)}function el(t,n,a,s){var c={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(wc(t))p0(n,c);else{var f=t.alternate;if(t.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var _=n.lastRenderedState,b=f(_,a);if(c.hasEagerState=!0,c.eagerState=b,oi(b,_))return ic(t,n,c,0),Xe===null&&nc(),!1}catch{}finally{}if(a=Nf(t,n,c,s),a!==null)return $n(a,t,s),m0(a,n,s),!0}return!1}function hd(t,n,a,s){if(s={lane:2,revertLane:ih(),gesture:null,action:s,hasEagerState:!1,eagerState:null,next:null},wc(t)){if(n)throw Error(r(479))}else n=Nf(t,a,s,2),n!==null&&$n(n,t,2)}function wc(t){var n=t.alternate;return t===fe||n!==null&&n===fe}function p0(t,n){Ds=yc=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function m0(t,n,a){if((a&4194048)!==0){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,D(t,a)}}var Ac={readContext:An,use:Mc,useCallback:rn,useContext:rn,useEffect:rn,useImperativeHandle:rn,useLayoutEffect:rn,useInsertionEffect:rn,useMemo:rn,useReducer:rn,useRef:rn,useState:rn,useDebugValue:rn,useDeferredValue:rn,useTransition:rn,useSyncExternalStore:rn,useId:rn,useHostTransitionStatus:rn,useFormState:rn,useActionState:rn,useOptimistic:rn,useMemoCache:rn,useCacheRefresh:rn,useEffectEvent:rn},g0={readContext:An,use:Mc,useCallback:function(t,n){return Vn().memoizedState=[t,n===void 0?null:n],t},useContext:An,useEffect:$g,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,bc(4194308,4,i0.bind(null,n,t),a)},useLayoutEffect:function(t,n){return bc(4194308,4,t,n)},useInsertionEffect:function(t,n){bc(4,2,t,n)},useMemo:function(t,n){var a=Vn();n=n===void 0?null:n;var s=t();if(Vr){yn(!0);try{t()}finally{yn(!1)}}return a.memoizedState=[s,n],s},useReducer:function(t,n,a){var s=Vn();if(a!==void 0){var c=a(n);if(Vr){yn(!0);try{a(n)}finally{yn(!1)}}}else c=n;return s.memoizedState=s.baseState=c,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:c},s.queue=t,t=t.dispatch=iM.bind(null,fe,t),[s.memoizedState,t]},useRef:function(t){var n=Vn();return t={current:t},n.memoizedState=t},useState:function(t){t=sd(t);var n=t.queue,a=h0.bind(null,fe,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:cd,useDeferredValue:function(t,n){var a=Vn();return ud(a,t,n)},useTransition:function(){var t=sd(!1);return t=l0.bind(null,fe,t.queue,!0,!1),Vn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var s=fe,c=Vn();if(ge){if(a===void 0)throw Error(r(407));a=a()}else{if(a=n(),Xe===null)throw Error(r(349));(be&127)!==0||Bg(s,n,a)}c.memoizedState=a;var f={value:a,getSnapshot:n};return c.queue=f,$g(Fg.bind(null,s,f,t),[t]),s.flags|=2048,Us(9,{destroy:void 0},Ig.bind(null,s,f,a,n),null),a},useId:function(){var t=Vn(),n=Xe.identifierPrefix;if(ge){var a=Yi,s=Wi;a=(s&~(1<<32-Bn(s)-1)).toString(32)+a,n="_"+n+"R_"+a,a=xc++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=KS++,n="_"+n+"r_"+a.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:dd,useFormState:Yg,useActionState:Yg,useOptimistic:function(t){var n=Vn();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=hd.bind(null,fe,!0,a),a.dispatch=n,[t,n]},useMemoCache:id,useCacheRefresh:function(){return Vn().memoizedState=nM.bind(null,fe)},useEffectEvent:function(t){var n=Vn(),a={impl:t};return n.memoizedState=a,function(){if((ze&2)!==0)throw Error(r(440));return a.impl.apply(void 0,arguments)}}},v0={readContext:An,use:Mc,useCallback:r0,useContext:An,useEffect:ld,useImperativeHandle:a0,useInsertionEffect:e0,useLayoutEffect:n0,useMemo:s0,useReducer:Ec,useRef:Jg,useState:function(){return Ec(Ma)},useDebugValue:cd,useDeferredValue:function(t,n){var a=on();return o0(a,ke.memoizedState,t,n)},useTransition:function(){var t=Ec(Ma)[0],n=on().memoizedState;return[typeof t=="boolean"?t:tl(t),n]},useSyncExternalStore:Pg,useId:f0,useHostTransitionStatus:dd,useFormState:Zg,useActionState:Zg,useOptimistic:function(t,n){var a=on();return Gg(a,ke,t,n)},useMemoCache:id,useCacheRefresh:d0,useEffectEvent:t0},aM={readContext:An,use:Mc,useCallback:r0,useContext:An,useEffect:ld,useImperativeHandle:a0,useInsertionEffect:e0,useLayoutEffect:n0,useMemo:s0,useReducer:rd,useRef:Jg,useState:function(){return rd(Ma)},useDebugValue:cd,useDeferredValue:function(t,n){var a=on();return ke===null?ud(a,t,n):o0(a,ke.memoizedState,t,n)},useTransition:function(){var t=rd(Ma)[0],n=on().memoizedState;return[typeof t=="boolean"?t:tl(t),n]},useSyncExternalStore:Pg,useId:f0,useHostTransitionStatus:dd,useFormState:Qg,useActionState:Qg,useOptimistic:function(t,n){var a=on();return ke!==null?Gg(a,ke,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:id,useCacheRefresh:d0,useEffectEvent:t0};function pd(t,n,a,s){n=t.memoizedState,a=a(s,n),a=a==null?n:B({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var md={enqueueSetState:function(t,n,a){t=t._reactInternals;var s=di(),c=Ka(s);c.payload=n,a!=null&&(c.callback=a),n=Qa(t,c,s),n!==null&&($n(n,t,s),Zo(n,t,s))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var s=di(),c=Ka(s);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=Qa(t,c,s),n!==null&&($n(n,t,s),Zo(n,t,s))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=di(),s=Ka(a);s.tag=2,n!=null&&(s.callback=n),n=Qa(t,s,a),n!==null&&($n(n,t,a),Zo(n,t,a))}};function _0(t,n,a,s,c,f,_){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(s,f,_):n.prototype&&n.prototype.isPureReactComponent?!ko(a,s)||!ko(c,f):!0}function y0(t,n,a,s){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,s),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,s),n.state!==t&&md.enqueueReplaceState(n,n.state,null)}function jr(t,n){var a=n;if("ref"in n){a={};for(var s in n)s!=="ref"&&(a[s]=n[s])}if(t=t.defaultProps){a===n&&(a=B({},a));for(var c in t)a[c]===void 0&&(a[c]=t[c])}return a}function x0(t){ec(t)}function S0(t){console.error(t)}function M0(t){ec(t)}function Rc(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(s){setTimeout(function(){throw s})}}function E0(t,n,a){try{var s=t.onCaughtError;s(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function gd(t,n,a){return a=Ka(a),a.tag=3,a.payload={element:null},a.callback=function(){Rc(t,n)},a}function b0(t){return t=Ka(t),t.tag=3,t}function T0(t,n,a,s){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var f=s.value;t.payload=function(){return c(f)},t.callback=function(){E0(n,a,s)}}var _=a.stateNode;_!==null&&typeof _.componentDidCatch=="function"&&(t.callback=function(){E0(n,a,s),typeof c!="function"&&(rr===null?rr=new Set([this]):rr.add(this));var b=s.stack;this.componentDidCatch(s.value,{componentStack:b!==null?b:""})})}function rM(t,n,a,s,c){if(a.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){if(n=a.alternate,n!==null&&Pr(n,a,c,!0),a=Rn.current,a!==null){switch(a.tag){case 31:case 13:case 19:return Fn===null?Zc():a.alternate===null&&sn===0&&(sn=3),a.flags&=-257,a.flags|=65536,a.lanes=c,s===pc?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([s]):n.add(s),th(t,s,c)),!1;case 22:return a.flags|=65536,s===pc?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([s])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([s]):a.add(s)),th(t,s,c)),!1}throw Error(r(435,a.tag))}return th(t,s,c),Zc(),!1}if(ge)return n=Rn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,s!==Pf&&(t=Error(r(422),{cause:s}),jo(_i(t,a)))):(s!==Pf&&(n=Error(r(423),{cause:s}),jo(_i(n,a))),t=t.current.alternate,t.flags|=65536,c&=-c,t.lanes|=c,s=_i(s,a),c=gd(t.stateNode,s,c),qf(t,c),sn!==4&&(sn=2)),!1;var f=Error(r(520),{cause:s});if(f=_i(f,a),cl===null?cl=[f]:cl.push(f),sn!==4&&(sn=2),n===null)return!0;s=_i(s,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=c&-c,a.lanes|=t,t=gd(a.stateNode,s,t),qf(a,t),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(rr===null||!rr.has(f))))return a.flags|=65536,c&=-c,a.lanes|=c,c=b0(c),T0(c,t,a,s),qf(a,c),!1;break;case 22:if(a.memoizedState!==null)return a.flags|=65536,!1}a=a.return}while(a!==null);return!1}var vd=Error(r(461)),fn=!1;function mn(t,n,a,s){n.child=t===null?Cg(n,null,a,s):Gr(n,t.child,a,s)}function w0(t,n,a,s,c){a=a.render;var f=n.ref;if("ref"in s){var _={};for(var b in s)b!=="ref"&&(_[b]=s[b])}else _=s;return Br(n),s=$f(t,n,a,_,f,c),b=td(),t!==null&&!fn?(ed(t,n,c),Ea(t,n,c)):(ge&&b&&oc(n),n.flags|=1,mn(t,n,s,c),n.child)}function A0(t,n,a,s,c){if(t===null){var f=a.type;return typeof f=="function"&&!Uf(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,R0(t,n,f,s,c)):(t=rc(a.type,null,s,n,n.mode,c),t.ref=n.ref,t.return=n,n.child=t)}if(f=t.child,!Td(t,c)){var _=f.memoizedProps;if(a=a.compare,a=a!==null?a:ko,a(_,s)&&t.ref===n.ref)return Ea(t,n,c)}return n.flags|=1,t=va(f,s),t.ref=n.ref,t.return=n,n.child=t}function R0(t,n,a,s,c){if(t!==null){var f=t.memoizedProps;if(ko(f,s)&&t.ref===n.ref)if(fn=!1,n.pendingProps=s=f,Td(t,c))(t.flags&131072)!==0&&(fn=!0);else return n.lanes=t.lanes,Ea(t,n,c)}return _d(t,n,a,s,c)}function C0(t,n,a,s){var c=s.children,f=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),s.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,t!==null){for(s=n.child=t.child,c=0;s!==null;)c=c|s.lanes|s.childLanes,s=s.sibling;s=c&~f}else s=0,n.child=null;return D0(t,n,f,a,s)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&dc(n,f!==null?f.cachePool:null),f!==null?Ug(n,f):Yf(),zg(n);else return s=n.lanes=536870912,D0(t,n,f!==null?f.baseLanes|a:a,a,s)}else f!==null?(dc(n,f.cachePool),Ug(n,f),tr(),n.memoizedState=null):(t!==null&&dc(n,null),Yf(),tr());return mn(t,n,c,a),n.child}function nl(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function D0(t,n,a,s,c){var f=Gf();return f=f===null?null:{parent:cn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},t!==null&&dc(n,null),Yf(),zg(n),t!==null&&Pr(t,n,s,!0),n.childLanes=c,null}function Cc(t,n){return n=Dc({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function N0(t,n,a){return Gr(n,t.child,null,a),t=Cc(n,n.pendingProps),t.flags|=2,li(n),n.memoizedState=null,t}function sM(t,n,a){var s=n.pendingProps,c=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(ge){if(s.mode==="hidden")return t=Cc(n,s),n.lanes=536870912,t.memoizedState={baseLanes:0,cachePool:null},nl(null,t);if(Kf(n),(t=We)?(t=i_(t,Si),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:ja!==null?{id:Wi,overflow:Yi}:null,retryLane:536870912,hydrationErrors:null},a=pg(t),a.return=n,n.child=a,Sn=n,We=null)):t=null,t===null)throw qa(n);return n.lanes=536870912,null}return Cc(n,s)}var f=t.memoizedState;if(f!==null){var _=f.dehydrated;if(Kf(n),c)if(n.flags&256)n.flags&=-257,n=N0(t,n,a);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(r(558));else if(fn||Pr(t,n,a,!1),c=(a&t.childLanes)!==0,fn||c){if(Ja.current===null){if(s=Xe,s!==null&&(_=tt(s,a),_!==0&&_!==f.retryLane))throw f.retryLane=_,Ur(t,_),$n(s,t,_),vd;Zc()}n=N0(t,n,a)}else t=f.treeContext,We=Ei(_.nextSibling),Sn=n,ge=!0,Xa=null,Si=!1,t!==null&&vg(n,t),n=Cc(n,s),n.flags|=134221824;return n}return t=va(t.child,{mode:s.mode,children:s.children}),t.ref=n.ref,n.child=t,t.return=n,t}function zs(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(r(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function _d(t,n,a,s,c){return Br(n),a=$f(t,n,a,s,void 0,c),s=td(),t!==null&&!fn?(ed(t,n,c),Ea(t,n,c)):(ge&&s&&oc(n),n.flags|=1,mn(t,n,a,c),n.child)}function U0(t,n,a,s,c,f){return Br(n),n.updateQueue=null,a=Og(n,s,a,c),Lg(t),s=td(),t!==null&&!fn?(ed(t,n,f),Ea(t,n,f)):(ge&&s&&oc(n),n.flags|=1,mn(t,n,a,f),n.child)}function z0(t,n,a,s,c){if(Br(n),n.stateNode===null){var f=Es,_=a.contextType;typeof _=="object"&&_!==null&&(f=An(_)),f=new a(s,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=md,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=s,f.state=n.memoizedState,f.refs={},jf(n),_=a.contextType,f.context=typeof _=="object"&&_!==null?An(_):Es,f.state=n.memoizedState,_=a.getDerivedStateFromProps,typeof _=="function"&&(pd(n,a,_,s),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(_=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),_!==f.state&&md.enqueueReplaceState(f,f.state,null),Qo(n,s,f,c),Ko(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!0}else if(t===null){f=n.stateNode;var b=n.memoizedProps,I=jr(a,b);f.props=I;var $=f.context,ut=a.contextType;_=Es,typeof ut=="object"&&ut!==null&&(_=An(ut));var xt=a.getDerivedStateFromProps;ut=typeof xt=="function"||typeof f.getSnapshotBeforeUpdate=="function",b=n.pendingProps!==b,ut||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(b||$!==_)&&y0(n,f,s,_),Za=!1;var Z=n.memoizedState;f.state=Z,Qo(n,s,f,c),Ko(),$=n.memoizedState,b||Z!==$||Za?(typeof xt=="function"&&(pd(n,a,xt,s),$=n.memoizedState),(I=Za||_0(n,a,I,s,Z,$,_))?(ut||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=s,n.memoizedState=$),f.props=s,f.state=$,f.context=_,s=I):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!1)}else{f=n.stateNode,Xf(t,n),_=n.memoizedProps,ut=jr(a,_),f.props=ut,xt=n.pendingProps,Z=f.context,$=a.contextType,I=Es,typeof $=="object"&&$!==null&&(I=An($)),b=a.getDerivedStateFromProps,($=typeof b=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(_!==xt||Z!==I)&&y0(n,f,s,I),Za=!1,Z=n.memoizedState,f.state=Z,Qo(n,s,f,c),Ko();var ot=n.memoizedState;_!==xt||Z!==ot||Za||t!==null&&t.dependencies!==null&&uc(t.dependencies)?(typeof b=="function"&&(pd(n,a,b,s),ot=n.memoizedState),(ut=Za||_0(n,a,ut,s,Z,ot,I)||t!==null&&t.dependencies!==null&&uc(t.dependencies))?($||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(s,ot,I),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(s,ot,I)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||_===t.memoizedProps&&Z===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===t.memoizedProps&&Z===t.memoizedState||(n.flags|=1024),n.memoizedProps=s,n.memoizedState=ot),f.props=s,f.state=ot,f.context=I,s=ut):(typeof f.componentDidUpdate!="function"||_===t.memoizedProps&&Z===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===t.memoizedProps&&Z===t.memoizedState||(n.flags|=1024),s=!1)}return f=s,zs(t,n),s=(n.flags&128)!==0,f||s?(f=n.stateNode,a=s&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,t!==null&&s?(n.child=Gr(n,t.child,null,c),n.child=Gr(n,null,a,c)):mn(t,n,a,c),n.memoizedState=f.state,t=n.child):t=Ea(t,n,c),t}function L0(t,n,a,s){return Lr(),n.flags|=256,mn(t,n,a,s),n.child}var yd={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function xd(t){return{baseLanes:t,cachePool:Eg()}}function Sd(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=fi),t}function O0(t,n,a){var s=n.pendingProps,c=!1,f=(n.flags&128)!==0,_;if((_=f)||(_=t!==null&&t.memoizedState===null?!1:(Cn.current&2)!==0),_&&(c=!0,n.flags&=-129),_=(n.flags&32)!==0,n.flags&=-33,t===null){if(ge){if(c?$a(n):tr(),(t=We)?(t=i_(t,Si),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:ja!==null?{id:Wi,overflow:Yi}:null,retryLane:536870912,hydrationErrors:null},a=pg(t),a.return=n,n.child=a,Sn=n,We=null)):t=null,t===null)throw qa(n);return xh(t)?n.lanes=32:n.lanes=536870912,null}return f=s.children,s=s.fallback,c?(tr(),c=n.mode,f=Dc({mode:"hidden",children:f},c),s=zr(s,c,a,null),f.return=n,s.return=n,f.sibling=s,n.child=f,s=n.child,s.memoizedState=xd(a),s.childLanes=Sd(t,_,a),n.memoizedState=yd,nl(null,s)):($a(n),Md(n,f))}var b=t.memoizedState;if(b!==null){var I=b.dehydrated;if(I!==null)return oM(t,n,f,_,s,I,b,a)}return c?(tr(),c=s.fallback,f=n.mode,b=t.child,I=b.sibling,s=va(b,{mode:"hidden",children:s.children}),s.subtreeFlags=b.subtreeFlags&1206910976,I!==null?c=va(I,c):(c=zr(c,f,a,null),c.flags|=2),c.return=n,s.return=n,s.sibling=c,n.child=s,nl(null,s),s=n.child,c=t.child.memoizedState,c===null?c=xd(a):(f=c.cachePool,f!==null?(b=cn._currentValue,f=f.parent!==b?{parent:b,pool:b}:f):f=Eg(),c={baseLanes:c.baseLanes|a,cachePool:f}),s.memoizedState=c,s.childLanes=Sd(t,_,a),n.memoizedState=yd,nl(t.child,s)):($a(n),a=t.child,t=a.sibling,a=va(a,{mode:"visible",children:s.children}),a.return=n,a.sibling=null,t!==null&&(_=n.deletions,_===null?(n.deletions=[t],n.flags|=16):_.push(t)),n.child=a,n.memoizedState=null,a)}function Md(t,n){return n=Dc({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function Dc(t,n){return t=Zn(22,t,null,n),t.lanes=0,t}function Nc(t,n,a){return Gr(n,t.child,null,a),t=Md(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function oM(t,n,a,s,c,f,_,b){if(a)return n.flags&256?($a(n),n.flags&=-257,Nc(t,n,b)):n.memoizedState!==null?(tr(),n.child=t.child,n.flags|=128,null):(tr(),f=c.fallback,_=n.mode,c=Dc({mode:"visible",children:c.children},_),f=zr(f,_,b,null),f.flags|=2,c.return=n,f.return=n,c.sibling=f,n.child=c,Gr(n,t.child,null,b),c=n.child,c.memoizedState=xd(b),c.childLanes=Sd(t,s,b),n.memoizedState=yd,nl(null,c));if($a(n),xh(f)){if(s=f.nextSibling&&f.nextSibling.dataset,s)var I=s.dgst;return s=I,s!==""&&(c=Error(r(419)),c.stack="",c.digest=s,jo({value:c,source:null,stack:null})),Nc(t,n,b)}if(fn||Pr(t,n,b,!1),s=(b&t.childLanes)!==0,fn||s){if(Ja.current!==null)return Nc(t,n,b);if(s=Xe,s!==null&&(c=tt(s,b),c!==0&&c!==_.retryLane))throw _.retryLane=c,Ur(t,c),$n(s,t,c),vd;return yh(f)||Zc(),Nc(t,n,b)}return yh(f)?(n.flags|=192,n.child=t.child,null):(t=_.treeContext,We=Ei(f.nextSibling),Sn=n,ge=!0,Xa=null,Si=!1,t!==null&&vg(n,t),n=Md(n,c.children),n.flags|=134221824,n)}function P0(t,n,a){t.lanes|=n;var s=t.alternate;s!==null&&(s.lanes|=n),cc(t.return,n,a)}function B0(t){for(var n=null;t!==null;){var a=t.alternate;a!==null&&_c(a)===null&&(n=t),t=t.sibling}return n}function Uc(t,n,a,s,c,f){var _=t.memoizedState;_===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:s,tail:a,tailMode:c,treeForkCount:f}:(_.isBackwards=n,_.rendering=null,_.renderingStartTime=0,_.last=s,_.tail=a,_.tailMode=c,_.treeForkCount=f)}function Ed(t){var n=t.child;for(t.child=null;n!==null;){var a=n.sibling;n.sibling=t.child,t.child=n,n=a}}function bd(t,n,a){var s=n.pendingProps,c=s.revealOrder,f=s.tail;s=s.children;var _=Cn.current;if(n.flags&128)return Jo(n,_),null;var b=(_&2)!==0;if(b?(_=_&1|2,n.flags|=128):_&=1,Jo(n,_),c==="backwards"&&t!==null?(Ed(t),mn(t,n,s,a),Ed(t)):mn(t,n,s,a),s=ge?Vo:0,!b&&t!==null&&(t.flags&128)!==0)t:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&P0(t,a,n);else if(t.tag===19)P0(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break t;for(;t.sibling===null;){if(t.return===null||t.return===n)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(c){case"backwards":a=B0(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null,Ed(n)),Uc(n,!0,c,null,f,s);break;case"unstable_legacy-backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(t=c.alternate,t!==null&&_c(t)===null){n.child=c;break}t=c.sibling,c.sibling=a,a=c,c=t}Uc(n,!0,a,null,f,s);break;case"together":Uc(n,!1,null,null,void 0,s);break;case"independent":n.memoizedState=null;break;default:a=B0(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),Uc(n,!1,c,a,f,s)}return n.child}function I0(t,n,a){var s=n.pendingProps;return Wa(n,n.type,s.value),mn(t,n,s.children,a),n.child}function Ea(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),ar|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(Pr(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(r(153));if(n.child!==null){for(t=n.child,a=va(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=va(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function Td(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&uc(t)))}function lM(t,n,a){switch(n.tag){case 3:lt(n,n.stateNode.containerInfo),Wa(n,cn,t.memoizedState.cache),Lr();break;case 27:case 5:nt(n);break;case 4:lt(n,n.stateNode.containerInfo);break;case 10:Wa(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Kf(n),null;break;case 13:var s=n.memoizedState;if(s!==null){if(s.dehydrated!==null)return $a(n),n.flags|=128,null;s=Pr(t,n,a,!1);var c=n.child.childLanes;return s||(a&c)!==0?O0(t,n,a):($a(n),t=Ea(t,n,a),t!==null?t.sibling:null)}$a(n);break;case 19:if(n.flags&128)return bd(t,n,a);if(c=(t.flags&128)!==0,s=(a&n.childLanes)!==0,s||(Pr(t,n,a,!1),s=(a&n.childLanes)!==0),c){if(s)return bd(t,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),Jo(n,Cn.current),s)break;return null;case 22:return n.lanes=0,C0(t,n,a,n.pendingProps);case 24:Wa(n,cn,t.memoizedState.cache)}return Ea(t,n,a)}function F0(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)fn=!0;else{if(!Td(t,a)&&(n.flags&128)===0)return fn=!1,lM(t,n,a);fn=(t.flags&131072)!==0}else fn=!1,ge&&(n.flags&1048576)!==0&&gg(n,Vo,n.index);switch(n.lanes=0,n.tag){case 16:t:{var s=n.pendingProps;if(t=Hr(n.elementType),n.type=t,typeof t=="function")Uf(t)?(s=jr(t,s),n.tag=1,n=z0(null,n,t,s,a)):(n.tag=0,n=_d(null,n,t,s,a));else{if(t!=null){var c=t.$$typeof;if(c===k){n.tag=11,n=w0(null,n,t,s,a);break t}else if(c===_t){n.tag=14,n=A0(null,n,t,s,a);break t}else if(c===st){n.tag=10,n.type=t,n=I0(null,n,a);break t}}throw n=kt(t)||t,Error(r(306,n,""))}}return n;case 0:return _d(t,n,n.type,n.pendingProps,a);case 1:return s=n.type,c=jr(s,n.pendingProps),z0(t,n,s,c,a);case 3:t:{if(lt(n,n.stateNode.containerInfo),t===null)throw Error(r(387));s=n.pendingProps;var f=n.memoizedState;c=f.element,Xf(t,n),Qo(n,s,null,a);var _=n.memoizedState;if(s=_.cache,Wa(n,cn,s),s!==f.cache&&Ff(n,[cn],a,!0),Ko(),s=_.element,f.isDehydrated)if(f={element:s,isDehydrated:!1,cache:_.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=L0(t,n,s,a);break t}else if(s!==c){c=_i(Error(r(424)),n),jo(c),n=L0(t,n,s,a);break t}else{switch(t=n.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(We=Ei(t.firstChild),Sn=n,ge=!0,Xa=null,Si=!0,a=Cg(n,null,s,a),n.child=a;a;)a.flags=a.flags&-3|134221824,a=a.sibling}else{if(Lr(),s===c){n=Ea(t,n,a);break t}mn(t,n,s,a)}n=n.child}return n;case 26:return zs(t,n),t===null?(a=u_(n.type,null,n.pendingProps,null))?n.memoizedState=a:ge||(n.stateNode=Vv(n.type,n.pendingProps,O.current,n)):n.memoizedState=u_(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return nt(n),t===null&&ge&&(s=n.stateNode=s_(n.type,n.pendingProps,O.current),Sn=n,Si=!0,c=We,lr(n.type)?(Sh=c,We=Ei(s.firstChild)):We=c),mn(t,n,n.pendingProps.children,a),zs(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&ge&&((c=s=We)&&(s=nE(s,n.type,n.pendingProps,Si),s!==null?(n.stateNode=s,Sn=n,We=Ei(s.firstChild),Si=!1,c=!0):c=!1),c||qa(n)),nt(n),c=n.type,f=n.pendingProps,_=t!==null?t.memoizedProps:null,s=f.children,dh(c,f)?s=null:_!==null&&dh(c,_)&&(n.flags|=32),n.memoizedState!==null&&(c=$f(t,n,QS,null,null,a),Qs._currentValue=c),zs(t,n),mn(t,n,s,a),n.child;case 6:return t===null&&ge&&((t=a=We)&&(a=iE(a,n.pendingProps,Si),a!==null?(n.stateNode=a,Sn=n,We=null,t=!0):t=!1),t||qa(n)),null;case 13:return O0(t,n,a);case 4:return lt(n,n.stateNode.containerInfo),s=n.pendingProps,t===null?n.child=Gr(n,null,s,a):mn(t,n,s,a),n.child;case 11:return w0(t,n,n.type,n.pendingProps,a);case 7:return s=n.pendingProps,zs(t,n),mn(t,n,s,a),n.child;case 8:return mn(t,n,n.pendingProps.children,a),n.child;case 12:return mn(t,n,n.pendingProps.children,a),n.child;case 10:return I0(t,n,a);case 9:return c=n.type._context,s=n.pendingProps.children,Br(n),c=An(c),s=s(c),n.flags|=1,mn(t,n,s,a),n.child;case 14:return A0(t,n,n.type,n.pendingProps,a);case 15:return R0(t,n,n.type,n.pendingProps,a);case 19:return bd(t,n,a);case 31:return sM(t,n,a);case 22:return C0(t,n,a,n.pendingProps);case 24:return Br(n),s=An(cn),t===null?(c=Gf(),c===null&&(c=Xe,f=Hf(),c.pooledCache=f,f.refCount++,f!==null&&(c.pooledCacheLanes|=a),c=f),n.memoizedState={parent:s,cache:c},jf(n),Wa(n,cn,c)):((t.lanes&a)!==0&&(Xf(t,n),Qo(n,null,null,a),Ko()),c=t.memoizedState,f=n.memoizedState,c.parent!==s?(c={parent:s,cache:s},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),Wa(n,cn,s)):(s=f.cache,Wa(n,cn,s),s!==c.cache&&Ff(n,[cn],a,!0))),mn(t,n,n.pendingProps.children,a),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),s=n.pendingProps,s.name!=null&&s.name!=="auto"?n.flags|=t===null?18882560:18874368:ge&&oc(n),t!==null&&t.memoizedProps.name!==s.name?n.flags|=4194816:zs(t,n),mn(t,n,s.children,a),n.child;case 29:throw n.pendingProps}throw Error(r(156,n.tag))}function ba(t){t.flags|=4}function wd(t,n,a,s,c){var f;if((f=(t.mode&32)!==0)&&(f=a===null?p_(n,s):p_(n,s)&&(s.src!==a.src||s.srcSet!==a.srcSet)),f){if(t.flags|=16777216,(c&335544128)===c)if(t.stateNode.complete)t.flags|=8192;else if(xv())t.flags|=8192;else throw kr=pc,Vf}else t.flags&=-16777217}function H0(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!m_(n))if(xv())t.flags|=8192;else throw kr=pc,Vf}function zc(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?jl():536870912,t.lanes|=n,Is|=n)}function il(t,n){if(!ge)switch(t.tailMode){case"visible":break;case"collapsed":for(var a=t.tail,s=null;a!==null;)a.alternate!==null&&(s=a),a=a.sibling;s===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:s.sibling=null;break;default:for(n=t.tail,a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null}}function Ye(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,s=0;if(n)for(var c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags&1206910976,s|=c.flags&1206910976,c.return=t,c=c.sibling;else for(c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags,s|=c.flags,c.return=t,c=c.sibling;return t.subtreeFlags|=s,t.childLanes=a,n}function cM(t,n,a){var s=n.pendingProps;switch(Of(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ye(n),null;case 1:return Ye(n),null;case 3:return a=n.stateNode,s=null,t!==null&&(s=t.memoizedState.cache),n.memoizedState.cache!==s&&(n.flags|=2048),xa(cn),V(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(ws(n)?ba(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Bf())),Ye(n),null;case 26:var c=n.type,f=n.memoizedState;return t===null?(ba(n),f!==null?(Ye(n),H0(n,f)):(Ye(n),wd(n,c,null,s,a))):f?f!==t.memoizedState?(ba(n),Ye(n),H0(n,f)):(Ye(n),n.flags&=-16777217):(t=t.memoizedProps,t!==s&&ba(n),Ye(n),wd(n,c,t,s,a)),null;case 27:if(ct(n),a=O.current,c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==s&&ba(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Ye(n),n.subtreeFlags&=-33554433,null}t=ve.current,ws(n)?_g(n):(t=s_(c,s,a),n.stateNode=t,ba(n))}return Ye(n),n.subtreeFlags&=-33554433,null;case 5:if(ct(n),c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==s&&ba(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Ye(n),n.subtreeFlags&=-33554433,null}if(f=ve.current,ws(n))_g(n);else{var _=pl(O.current);switch(f){case 1:f=_.createElementNS("http://www.w3.org/2000/svg",c);break;case 2:f=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;default:switch(c){case"svg":f=_.createElementNS("http://www.w3.org/2000/svg",c);break;case"math":f=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;case"script":f=_.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof s.is=="string"?_.createElement("select",{is:s.is}):_.createElement("select"),s.multiple?f.multiple=!0:s.size&&(f.size=s.size);break;default:f=typeof s.is=="string"?_.createElement(c,{is:s.is}):_.createElement(c)}}f[Dt]=n,f[Bt]=s;t:for(_=n.child;_!==null;){if(_.tag===5||_.tag===6)f.appendChild(_.stateNode);else if(_.tag!==4&&_.tag!==27&&_.child!==null){_.child.return=_,_=_.child;continue}if(_===n)break t;for(;_.sibling===null;){if(_.return===null||_.return===n)break t;_=_.return}_.sibling.return=_.return,_=_.sibling}n.stateNode=f;t:switch(Nn(f,c,s),c){case"button":case"input":case"select":case"textarea":s=!!s.autoFocus;break t;case"img":s=!0;break t;default:s=!1}s&&ba(n)}}return Ye(n),n.subtreeFlags&=-33554433,wd(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,a),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==s&&ba(n);else{if(typeof s!="string"&&n.stateNode===null)throw Error(r(166));if(t=O.current,ws(n)){if(t=n.stateNode,a=n.memoizedProps,s=null,c=Sn,c!==null)switch(c.tag){case 27:case 5:s=c.memoizedProps}t[Dt]=n,t=!!(t.nodeValue===a||s!==null&&s.suppressHydrationWarning===!0||Fv(t.nodeValue,a)),t||qa(n,!0)}else t=pl(t).createTextNode(s),t[Dt]=n,n.stateNode=t}return Ye(n),null;case 31:if(a=n.memoizedState,t===null||t.memoizedState!==null){if(s=ws(n),a!==null){if(t===null){if(!s)throw Error(r(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(557));t[Dt]=n}else Lr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ye(n),t=!1}else a=Bf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return n.flags&256?(li(n),n):(li(n),null);if((n.flags&128)!==0)throw Error(r(558))}return Ye(n),null;case 13:if(s=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(c=ws(n),s!==null&&s.dehydrated!==null){if(t===null){if(!c)throw Error(r(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(r(317));c[Dt]=n}else Lr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ye(n),c=!1}else c=Bf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(li(n),n):(li(n),null)}return li(n),(n.flags&128)!==0?(n.lanes=a,n):(a=s!==null,t=t!==null&&t.memoizedState!==null,a&&(s=n.child,c=null,s.alternate!==null&&s.alternate.memoizedState!==null&&s.alternate.memoizedState.cachePool!==null&&(c=s.alternate.memoizedState.cachePool.pool),f=null,s.memoizedState!==null&&s.memoizedState.cachePool!==null&&(f=s.memoizedState.cachePool.pool),f!==c&&(s.flags|=2048)),a!==t&&a&&(n.child.flags|=8192),zc(n,n.updateQueue),Ye(n),null);case 4:return V(),t===null&&oh(n.stateNode.containerInfo),n.flags|=67108864,Ye(n),null;case 10:return xa(n.type),Ye(n),null;case 19:if(Qf(n),s=n.memoizedState,s===null)return Ye(n),null;if(c=(n.flags&128)!==0,f=s.rendering,f===null)if(c)il(s,!1);else{if(sn!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(f=_c(t),f!==null){for(n.flags|=128,il(s,!1),t=f.updateQueue,n.updateQueue=t,zc(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)hg(a,t),a=a.sibling;return Jo(n,Cn.current&1|2),ge&&_a(n,s.treeForkCount),n.child}t=t.sibling}s.tail!==null&&W()>Xc&&(n.flags|=128,c=!0,il(s,!1),n.lanes=4194304)}else{if(!c)if(t=_c(f),t!==null){if(n.flags|=128,c=!0,t=t.updateQueue,n.updateQueue=t,zc(n,t),il(s,!0),s.tail===null&&s.tailMode!=="collapsed"&&s.tailMode!=="visible"&&!f.alternate&&!ge)return Ye(n),null}else 2*W()-s.renderingStartTime>Xc&&a!==536870912&&(n.flags|=128,c=!0,il(s,!1),n.lanes=4194304);s.isBackwards?(f.sibling=n.child,n.child=f):(t=s.last,t!==null?t.sibling=f:n.child=f,s.last=f)}if(s.tail!==null){t=s.tail;t:{for(a=t;a!==null;){if(a.alternate!==null){a=!1;break t}a=a.sibling}a=!0}return s.rendering=t,s.tail=t.sibling,s.renderingStartTime=W(),t.sibling=null,f=Cn.current,f=c?f&1|2:f&1,s.tailMode==="visible"||s.tailMode==="collapsed"||!a||ge?Jo(n,f):(a=f,Nt(Rn,n),Nt(Cn,a),Fn===null&&(Fn=n)),ge&&_a(n,s.treeForkCount),t}return Ye(n),null;case 22:case 23:return li(n),Zf(),s=n.memoizedState!==null,t!==null?t.memoizedState!==null!==s&&(n.flags|=8192):s&&(n.flags|=8192),s?(a&536870912)!==0&&(n.flags&128)===0&&(Ye(n),n.subtreeFlags&6&&(n.flags|=8192)):Ye(n),a=n.updateQueue,a!==null&&zc(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),s=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(s=n.memoizedState.cachePool.pool),s!==a&&(n.flags|=2048),t!==null&&Jt(Fr),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),xa(cn),Ye(n),null;case 25:return null;case 30:return n.flags|=33554432,Ye(n),null}throw Error(r(156,n.tag))}function uM(t,n){switch(Of(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return xa(cn),V(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return ct(n),null;case 31:if(n.memoizedState!==null){if(li(n),n.alternate===null)throw Error(r(340));Lr()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(li(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(r(340));Lr()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return Qf(n),t=n.flags,t&65536?(n.flags=t&-65537|128,t=n.memoizedState,t!==null&&(t.rendering=null,t.tail=null),n.flags|=4,n):null;case 4:return V(),null;case 10:return xa(n.type),null;case 22:case 23:return li(n),Zf(),t!==null&&Jt(Fr),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return xa(cn),null;case 25:return null;default:return null}}function k0(t,n){switch(Of(n),n.tag){case 3:xa(cn),V();break;case 26:case 27:case 5:ct(n);break;case 4:V();break;case 31:n.memoizedState!==null&&li(n);break;case 13:li(n);break;case 19:Qf(n);break;case 10:xa(n.type);break;case 22:case 23:li(n),Zf(),t!==null&&Jt(Fr);break;case 24:xa(cn)}}function al(t,n){try{var a=n.updateQueue,s=a!==null?a.lastEffect:null;if(s!==null){var c=s.next;a=c;do{if((a.tag&t)===t){s=void 0;var f=a.create,_=a.inst;s=f(),_.destroy=s}a=a.next}while(a!==c)}}catch(b){Be(n,n.return,b)}}function er(t,n,a){try{var s=n.updateQueue,c=s!==null?s.lastEffect:null;if(c!==null){var f=c.next;s=f;do{if((s.tag&t)===t){var _=s.inst,b=_.destroy;if(b!==void 0){_.destroy=void 0,c=n;var I=a,$=b;try{$()}catch(ut){Be(c,I,ut)}}}s=s.next}while(s!==f)}}catch(ut){Be(n,n.return,ut)}}function G0(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{Ng(n,a)}catch(s){Be(t,t.return,s)}}}function V0(t,n,a){a.props=jr(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(s){Be(t,n,s)}}function Zi(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var s=t.stateNode;break;case 30:var c=t.stateNode,f=ma(t.memoizedProps,c);(c.ref===null||c.ref.name!==f)&&(c.ref=Kv(f)),s=c.ref;break;case 7:if(t.stateNode===null){var _=new hi(t);m(t.child,!1,tE,_,void 0,void 0),t.stateNode=_}s=t.stateNode;break;default:s=t.stateNode}typeof a=="function"?t.refCleanup=a(s):a.current=s}}catch(b){Be(t,n,b)}}function Dn(t,n){var a=t.ref,s=t.refCleanup;if(a!==null)if(typeof s=="function")try{s()}catch(c){Be(t,n,c)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){Be(t,n,c)}else a.current=null}function Lc(t,n){if((t.tag===5||t.tag===27||t.tag===6)&&t.alternate===null&&n!==null)for(var a=0;a<n.length;a++)n_(t.stateNode,n[a])}function j0(t){for(var n=t.return;n!==null&&(Rd(n)&&n_(t.stateNode,n.stateNode),!Ad(n));)n=n.return}function rl(t){for(var n=t.return;n!==null&&(Rd(n)&&eE(t.stateNode,n.stateNode),!Ad(n));)n=n.return}function Ad(t){return t.tag===5||t.tag===3||t.tag===27}function Rd(t){return t&&t.tag===7&&t.stateNode!==null}function Cd(t){var n=t.type,a=t.memoizedProps,s=t.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&s.focus();break t;case"img":a.src?s.src=a.src:a.srcSet&&(s.srcset=a.srcSet)}}catch(c){Be(t,t.return,c)}}function Dd(t,n,a){try{var s=t.stateNode;PM(s,t.type,a,n),s[Bt]=n}catch(c){Be(t,t.return,c)}}function X0(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&lr(t.type)||t.tag===4}function Nd(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||X0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&lr(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Ud(t,n,a,s){var c=t.tag;if(c===5||c===6)c=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(c,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(c),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=qi)),Lc(t,s),Ne=!0;else if(c!==4&&(c===27&&(Lc(t,s),s=null,lr(t.type)&&(a=t.stateNode,n=null)),t=t.child,t!==null))for(Ud(t,n,a,s),t=t.sibling;t!==null;)Ud(t,n,a,s),t=t.sibling}function Oc(t,n,a,s){var c=t.tag;if(c===5||c===6)c=t.stateNode,n?a.insertBefore(c,n):a.appendChild(c),Lc(t,s),Ne=!0;else if(c!==4&&(c===27&&(Lc(t,s),s=null,lr(t.type)&&(a=t.stateNode)),t=t.child,t!==null))for(Oc(t,n,a,s),t=t.sibling;t!==null;)Oc(t,n,a,s),t=t.sibling}function q0(t){var n=t.stateNode,a=t.memoizedProps;try{for(var s=t.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);Nn(n,s,a),n[Dt]=t,n[Bt]=a}catch(f){Be(t,t.return,f)}}var Pc=!1,ci=null;function W0(t){(t.tag===30||(t.subtreeFlags&33554432)!==0)&&(Pc=!0)}var Ki=null;function Y0(){var t=Ki;return Ki=null,t}var Kn=0;function Ls(t,n,a,s,c){return Kn=0,Z0(t.child,n,a,s,c)}function Z0(t,n,a,s,c){for(var f=!1;t!==null;){if(t.tag===5){var _=t.stateNode;if(s!==null){var b=mh(_);s.push(b),b.view&&(f=!0)}else f||mh(_).view&&(f=!0);Pc=!0,Yv(_,Kn===0?n:n+"_"+Kn,a),Kn++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c||Z0(t.child,n,a,s,c)&&(f=!0));t=t.sibling}return f}function Qi(t,n){for(;t!==null;)t.tag===5?Zv(t.stateNode,t.memoizedProps):(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&n||Qi(t.child,n)),t=t.sibling}function Bc(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if((t.tag!==22||t.memoizedState===null)&&(Bc(t),t.tag===30&&(t.flags&18874368)!==0&&t.stateNode.paired)){var n=t.memoizedProps;if(n.name==null||n.name==="auto")throw Error(r(544));var a=n.name;n=ga(n.default,n.share),n!=="none"&&(Ls(t,a,n,null,!1)||Qi(t.child,!1))}t=t.sibling}}function zd(t,n){if(t.tag===30){var a=t.stateNode,s=t.memoizedProps,c=ma(s,a),f=ga(s.default,a.paired?s.share:s.enter);f!=="none"?Ls(t,c,f,null,!1)?(Bc(t),a.paired||n||Gs(t,s.onEnter)):Qi(t.child,!1):Bc(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)zd(t,n),t=t.sibling;else Bc(t)}function Ld(t){if(ci!==null&&ci.size!==0){var n=ci;if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var a=t.memoizedProps,s=a.name;if(s!=null&&s!=="auto"){var c=n.get(s);if(c!==void 0){var f=ga(a.default,a.share);if(f!=="none"&&(Ls(t,s,f,null,!1)?(f=t.stateNode,c.paired=f,f.paired=c,Gs(t,a.onShare)):Qi(t.child,!1)),n.delete(s),n.size===0)break}}}Ld(t)}t=t.sibling}}}function Od(t){if(t.tag===30){var n=t.memoizedProps,a=ma(n,t.stateNode),s=ci!==null?ci.get(a):void 0,c=ga(n.default,s!==void 0?n.share:n.exit);c!=="none"&&(Ls(t,a,c,null,!1)?s!==void 0?(c=t.stateNode,s.paired=c,c.paired=s,ci.delete(a),Gs(t,n.onShare)):Gs(t,n.onExit):Qi(t.child,!1)),ci!==null&&Ld(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)Od(t),t=t.sibling;else ci!==null&&Ld(t)}function K0(t){for(t=t.child;t!==null;){if(t.tag===30){var n=t.memoizedProps,a=ma(n,t.stateNode);n=ga(n.default,n.update),t.flags&=-5,n!=="none"&&Ls(t,a,n,t.memoizedState=[],!1)}else(t.subtreeFlags&33554432)!==0&&K0(t);t=t.sibling}}function Pd(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var n=t.stateNode;n.paired!==null&&(n.paired=null,Qi(t.child,!1))}Pd(t)}t=t.sibling}}function Ic(t){if(t.tag===30)t.stateNode.paired=null,Qi(t.child,!1),Pd(t);else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)Ic(t),t=t.sibling;else Pd(t)}function Q0(t){for(t=t.child;t!==null;)t.tag===30?Qi(t.child,!1):(t.subtreeFlags&33554432)!==0&&Q0(t),t=t.sibling}function Bd(t,n,a,s,c,f,_){for(var b=!1;n!==null;){if(n.tag===5){var I=n.stateNode;if(f!==null&&Kn<f.length){var $=f[Kn],ut=mh(I);($.view||ut.view)&&(b=!0);var xt;if(xt=(t.flags&4)===0)if(ut.clip)xt=!0;else{xt=$.rect;var Z=ut.rect;xt=xt.y!==Z.y||xt.x!==Z.x||xt.height!==Z.height||xt.width!==Z.width}xt&&(t.flags|=4),ut.abs?ut=!$.abs:($=$.rect,ut=ut.rect,ut=$.height!==ut.height||$.width!==ut.width),ut&&(t.flags|=32)}else t.flags|=32;(t.flags&4)!==0&&Yv(I,Kn===0?a:a+"_"+Kn,c),b&&(t.flags&4)!==0||(Ki===null&&(Ki=[]),Ki.push(I,Kn===0?s:s+"_"+Kn,n.memoizedProps)),Kn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&_?t.flags|=n.flags&32:Bd(t,n.child,a,s,c,f,_)&&(b=!0));n=n.sibling}return b}function J0(t,n){for(t=t.child;t!==null;){if(t.tag===30){var a=t.memoizedProps,s=t.stateNode,c=ma(a,s),f=ga(a.default,a.update),_;_=t.memoizedState,t.memoizedState=null,s=t;var b=t.child;Kn=0,c=Bd(s,b,c,c,f,_,!1),(t.flags&4)!==0&&c&&Gs(t,a.onUpdate)}else(t.subtreeFlags&33554432)!==0&&J0(t);t=t.sibling}}var Mn=!1,Le=!1,Ji=!1,Id=!1,$0=typeof WeakSet=="function"?WeakSet:Set,En=null,$i=!1,sl=!1,Fc=!1,Fd=!1;function fM(t,n,a){if(t=t.containerInfo,uh=Js,t=ig(t),Tf(t)){if("selectionStart"in t)var s={start:t.selectionStart,end:t.selectionEnd};else t:{s=(s=t.ownerDocument)&&s.defaultView||window;var c=s.getSelection&&s.getSelection();if(c&&c.rangeCount!==0){s=c.anchorNode;var f=c.anchorOffset,_=c.focusNode;c=c.focusOffset;try{s.nodeType,_.nodeType}catch{s=null;break t}var b=0,I=-1,$=-1,ut=0,xt=0,Z=t,ot=null;e:for(;;){for(var Lt;Z!==s||f!==0&&Z.nodeType!==3||(I=b+f),Z!==_||c!==0&&Z.nodeType!==3||($=b+c),Z.nodeType===3&&(b+=Z.nodeValue.length),(Lt=Z.firstChild)!==null;)ot=Z,Z=Lt;for(;;){if(Z===t)break e;if(ot===s&&++ut===f&&(I=b),ot===_&&++xt===c&&($=b),(Lt=Z.nextSibling)!==null)break;Z=ot,ot=Z.parentNode}Z=Lt}s=I===-1||$===-1?null:{start:I,end:$}}else s=null}s=s||{start:0,end:0}}else s=null;for(fh={focusedElem:t,selectionRange:s},Js=!1,a=(a&335544064)===a,En=n,n=a?9270:1024;En!==null;){if(t=En,a&&(s=t.deletions,s!==null))for(f=0;f<s.length;f++)a&&Od(s[f]);if(t.alternate===null&&(t.flags&2)!==0)a&&W0(t),Hc(a);else{if(t.tag===22){if(s=t.alternate,t.memoizedState!==null){s!==null&&s.memoizedState===null&&a&&Od(s),Hc(a);continue}else if(s!==null&&s.memoizedState!==null){a&&W0(t),Hc(a);continue}}s=t.child,(t.subtreeFlags&n)!==0&&s!==null?(s.return=t,En=s):(a&&K0(t),Hc(a))}}ci=null}function Hc(t){for(;En!==null;){var n=En,a=t,s=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((c&1024)!==0&&s!==null){a=void 0,c=s.memoizedProps,s=s.memoizedState;var f=n.stateNode;try{var _=jr(n.type,c);a=f.getSnapshotBeforeUpdate(_,s),f.__reactInternalSnapshotBeforeUpdate=a}catch(b){Be(n,n.return,b)}}break;case 3:if((c&1024)!==0){if(s=n.stateNode.containerInfo,a=s.nodeType,a===9)_h(s);else if(a===1)switch(s.nodeName){case"HEAD":case"HTML":case"BODY":_h(s);break;default:s.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:a&&s!==null&&(a=ma(s.memoizedProps,s.stateNode),c=n.memoizedProps,c=ga(c.default,c.update),c!=="none"&&Ls(s,a,c,s.memoizedState=[],!0));break;default:if((c&1024)!==0)throw Error(r(163))}if(s=n.sibling,s!==null){s.return=n.return,En=s;break}En=n.return}}function tv(t,n,a){var s=a.flags;switch(a.tag){case 0:case 11:case 15:ta(t,a),s&4&&al(5,a);break;case 1:if(ta(t,a),s&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(_){Be(a,a.return,_)}else{var c=jr(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(c,n,t.__reactInternalSnapshotBeforeUpdate)}catch(_){Be(a,a.return,_)}}s&64&&G0(a),s&512&&Zi(a,a.return);break;case 3:if(ta(t,a),s&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Ng(t,n)}catch(_){Be(a,a.return,_)}}break;case 27:n===null&&s&4&&q0(a);case 26:case 5:ta(t,a),n===null&&s&4&&Cd(a),s&512&&Zi(a,a.return);break;case 12:ta(t,a);break;case 31:ta(t,a),s&4&&av(t,a);break;case 13:ta(t,a),s&4&&rv(t,a),s&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=EM.bind(null,a),aE(t,a))));break;case 22:if(s=a.memoizedState!==null||Mn,!s){var f=n!==null&&n.memoizedState!==null||Le;n=Mn,c=Le,Mn=s,(Le=f)&&!c?(s=2,(a.subtreeFlags&8772)!==0&&(s|=1),zi(t,a,s)):ta(t,a),Mn=n,Le=c}break;case 30:ta(t,a),s&512&&Zi(a,a.return);break;case 7:s&512&&Zi(a,a.return);default:ta(t,a)}}function Hd(t,n){for(t=t.child;t!==null;)ev(t,n),t=t.sibling}function ev(t,n){switch(t.tag){case 5:case 26:try{var a=t.stateNode;if(n){var s=a.style;typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"}else{var c=t.stateNode,f=t.memoizedProps.style,_=f!=null&&f.hasOwnProperty("display")?f.display:null;c.style.display=_==null||typeof _=="boolean"?"":(""+_).trim()}}catch(I){Be(t,t.return,I)}kd(t,n);break;case 6:try{t.stateNode.nodeValue=n?"":t.memoizedProps,Ne=!0}catch(I){Be(t,t.return,I)}break;case 18:try{var b=t.stateNode;n?Wv(b,!0):Wv(t.stateNode,!1)}catch(I){Be(t,t.return,I)}break;case 22:case 23:t.memoizedState===null&&Hd(t,n);break;default:Hd(t,n)}}function kd(t,n){if(t.subtreeFlags&67108864)for(t=t.child;t!==null;){t:{var a=t,s=n;switch(a.tag){case 4:ev(a,s);break t;case 22:a.memoizedState===null&&kd(a,s);break t;default:kd(a,s)}}t=t.sibling}}function nv(t){var n=t.alternate;n!==null&&(t.alternate=null,nv(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&ye(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var tn=null,Qn=!1;function Ni(t,n,a){for(a=a.child;a!==null;)iv(t,n,a),a=a.sibling}function iv(t,n,a){if(Ke&&typeof Ke.onCommitFiberUnmount=="function")try{Ke.onCommitFiberUnmount(we,a)}catch{}switch(a.tag){case 26:Le||Dn(a,n),Ni(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&!Le&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Le||Dn(a,n),rl(a);var s=tn,c=Qn;lr(a.type)&&(tn=a.stateNode,Qn=!1),Ni(t,n,a),o_(a.stateNode,a.type,a.memoizedProps),tn=s,Qn=c;break;case 5:Le||Dn(a,n),rl(a);case 6:if(a.tag===6&&rl(a),s=tn,c=Qn,tn=null,Ni(t,n,a),tn=s,Qn=c,tn!==null)if(Qn)try{(tn.nodeType===9?tn.body:tn.nodeName==="HTML"?tn.ownerDocument.body:tn).removeChild(a.stateNode),Ne=!0}catch(f){Be(a,n,f)}else try{tn.removeChild(a.stateNode),Ne=!0}catch(f){Be(a,n,f)}break;case 18:tn!==null&&(Qn?(t=tn,qv(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),$s(t)):qv(tn,a.stateNode));break;case 4:s=tn,c=Qn,tn=a.stateNode.containerInfo,Qn=!0,Ni(t,n,a),tn=s,Qn=c;break;case 0:case 11:case 14:case 15:er(2,a,n),Le||er(4,a,n),Ni(t,n,a);break;case 1:Le||(Dn(a,n),s=a.stateNode,typeof s.componentWillUnmount=="function"&&V0(a,n,s)),Ni(t,n,a);break;case 21:Ni(t,n,a);break;case 22:Le=(s=Le)||a.memoizedState!==null,Ni(t,n,a),Le=s;break;case 30:Dn(a,n),Ni(t,n,a);break;case 7:Le||Dn(a,n),Ni(t,n,a);break;default:Ni(t,n,a)}}function av(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{$s(t)}catch(a){Be(n,n.return,a)}}}function rv(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{$s(t)}catch(a){Be(n,n.return,a)}}function dM(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new $0),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new $0),n;default:throw Error(r(435,t.tag))}}function kc(t,n){var a=dM(t);n.forEach(function(s){if(!a.has(s)){a.add(s);var c=bM.bind(null,t,s);s.then(c,c)}})}function jn(t,n,a){var s=n.deletions;if(s!==null)for(var c=0;c<s.length;c++){var f=s[c],_=t,b=n,I=b;t:for(;I!==null;){switch(I.tag){case 27:if(lr(I.type)){tn=I.stateNode,Qn=!1;break t}break;case 5:tn=I.stateNode,Qn=!1;break t;case 3:case 4:tn=I.stateNode.containerInfo,Qn=!0;break t}I=I.return}if(tn===null)throw Error(r(160));iv(_,b,f),tn=null,Qn=!1,_=f.alternate,_!==null&&(_.return=null),f.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)sv(n,t,a),n=n.sibling}var Ui=null;function sv(t,n,a){var s=t.alternate,c=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(c&4&&(s=t.updateQueue,s=s!==null?s.events:null,s!==null))for(var f=0;f<s.length;f++){var _=s[f];_.ref.impl=_.nextImpl}jn(n,t,a),Xn(t),c&4&&(er(3,t,t.return),al(3,t),er(5,t,t.return));break;case 1:jn(n,t,a),Xn(t),c&512&&(Le||s===null||Dn(s,s.return)),c&64&&Mn&&(t=t.updateQueue,t!==null&&(n=t.callbacks,n!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?n:a.concat(n))));break;case 26:if(f=Ui,jn(n,t,a),Xn(t),c&512&&(Le||s===null||Dn(s,s.return)),c&4)if(c=s!==null?s.memoizedState:null,a=t.memoizedState,s===null)if(a===null)if(t.stateNode===null)if(Mn)t.stateNode=Vv(t.type,t.memoizedProps,n.containerInfo,t);else{t:{n=t.type,a=t.memoizedProps,c=f.ownerDocument||f;e:switch(n){case"title":s=c.getElementsByTagName("title")[0],(!s||s[qe]||s[Dt]||s.namespaceURI==="http://www.w3.org/2000/svg"||s.hasAttribute("itemprop"))&&(s=c.createElement(n),c.head.insertBefore(s,c.querySelector("head > title"))),Nn(s,n,a),s[Dt]=t,Qe(s),n=s;break t;case"link":if(f=h_("link","href",c).get(n+(a.href||""))){for(_=0;_<f.length;_++)if(s=f[_],s.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&s.getAttribute("rel")===(a.rel==null?null:a.rel)&&s.getAttribute("title")===(a.title==null?null:a.title)&&s.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){f.splice(_,1);break e}}s=c.createElement(n),Nn(s,n,a),c.head.appendChild(s);break;case"meta":if(f=h_("meta","content",c).get(n+(a.content||""))){for(_=0;_<f.length;_++)if(s=f[_],s.getAttribute("content")===(a.content==null?null:""+a.content)&&s.getAttribute("name")===(a.name==null?null:a.name)&&s.getAttribute("property")===(a.property==null?null:a.property)&&s.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&s.getAttribute("charset")===(a.charSet==null?null:a.charSet)){f.splice(_,1);break e}}s=c.createElement(n),Nn(s,n,a),c.head.appendChild(s);break;default:throw Error(r(468,n))}s[Dt]=t,Qe(s),n=s}t.stateNode=n}else Mn||Th(f,t.type,t.stateNode);else t.stateNode=d_(f,a,t.memoizedProps);else c!==a?(c===null?(n=s.stateNode,n===null||Le||n.parentNode.removeChild(n)):c.count--,a===null?Mn||Th(f,t.type,t.stateNode):d_(f,a,t.memoizedProps)):a===null&&t.stateNode!==null&&Dd(t,t.memoizedProps,s.memoizedProps);break;case 27:jn(n,t,a),Xn(t),c&512&&(Le||s===null||Dn(s,s.return)),s!==null&&c&4&&Dd(t,t.memoizedProps,s.memoizedProps);break;case 5:if(f=Ji,Ji=!1,jn(n,t,a),Ji=f,Xn(t),c&512&&(Le||s===null||Dn(s,s.return)),t.flags&32){n=t.stateNode;try{gs(n,""),Ne=!0}catch(ut){Be(t,t.return,ut)}}c&4&&t.stateNode!=null&&(n=t.memoizedProps,Dd(t,n,s!==null?s.memoizedProps:n)),c&1024&&(Id=!0);break;case 6:if(jn(n,t,a),Xn(t),c&4){if(t.stateNode===null)throw Error(r(162));n=t.memoizedProps,a=t.stateNode;try{a.nodeValue=n,Ne=!0}catch(ut){Be(t,t.return,ut)}}break;case 3:if(Ne=!1,nu=null,f=Ui,Ui=ml(n.containerInfo),jn(n,t,a),Ui=f,Xn(t),c&4&&s!==null&&s.memoizedState.isDehydrated)try{$s(n.containerInfo)}catch(ut){Be(t,t.return,ut)}Id&&(Id=!1,ov(t)),Ne=!1;break;case 4:c=Ji,Ji=Mn,s=Am(),f=Ui,Ui=ml(t.stateNode.containerInfo),jn(n,t,a),Xn(t),Ui=f,Ne&&sl&&(Fc=!0),Ne=s,Ji=c;break;case 12:jn(n,t,a),Xn(t);break;case 31:jn(n,t,a),Xn(t),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,kc(t,n)));break;case 13:jn(n,t,a),Xn(t),t.child.flags&8192&&t.memoizedState!==null!=(s!==null&&s.memoizedState!==null)&&(jc=W()),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,kc(t,n)));break;case 22:f=t.memoizedState!==null,_=s!==null&&s.memoizedState!==null;var b=Mn,I=Le,$=Ji;Mn=b||f,Ji=$||f,Le=I||_,jn(n,t,a),Le=I,Ji=$,Mn=b,Xn(t),c&8192&&(n=t.stateNode,n._visibility=f?n._visibility&-2:n._visibility|1,!f||s===null||_||Mn||Le||(n=_||Le,a=Mn,s=Le,Mn=f||Mn,Le=n,nr(t,2),Mn=a,Le=s),!f&&Ji||Hd(t,f)),c&4&&(n=t.updateQueue,n!==null&&(a=n.retryQueue,a!==null&&(n.retryQueue=null,kc(t,a))));break;case 19:jn(n,t,a),Xn(t),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,kc(t,n)));break;case 30:c&512&&(Le||s===null||Dn(s,s.return)),c=Am(),f=sl,_=(a&335544064)===a,b=t.memoizedProps,sl=_&&ga(b.default,b.update)!=="none",jn(n,t,a),Xn(t),_&&s!==null&&Ne&&(t.flags|=4),sl=f,Ne=c;break;case 21:break;case 7:c&512&&(Le||s===null||Dn(s,s.return)),s&&s.stateNode!==null&&(s.stateNode._fragmentFiber=t);default:jn(n,t,a),Xn(t)}}function Xn(t){var n=t.flags;if(n&2){try{for(var a,s=t.return;s!==null;){if(X0(s)){a=s;break}s=s.return}s=null;for(var c=t.return;c!==null;){if(Rd(c)){var f=c.stateNode;s===null?s=[f]:s.push(f)}if(Ad(c))break;c=c.return}var _=s;if(a==null)throw Error(r(160));switch(a.tag){case 27:var b=a.stateNode,I=Nd(t);Oc(t,I,b,_);break;case 5:var $=a.stateNode;a.flags&32&&(gs($,""),a.flags&=-33);var ut=Nd(t);Oc(t,ut,$,_);break;case 3:case 4:var xt=a.stateNode.containerInfo,Z=Nd(t);Ud(t,Z,xt,_);break;default:throw Error(r(161))}}catch(ot){Be(t,t.return,ot)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function ov(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;ov(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,Js=!0,n.reset(),Js=!1),t=t.sibling}}function Os(t,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)lv(n,t),n=n.sibling;else J0(n)}function lv(t,n){var a=t.alternate;if(a===null)zd(t,!1);else switch(t.tag){case 3:if(Fd=$i=!1,Y0(),Os(n,t),!$i&&!Fc){if(t=Ki,t!==null)for(var s=0;s<t.length;s+=3){a=t[s];var c=t[s+1];Zv(a,t[s+2]),a=a.ownerDocument.documentElement,a!==null&&a.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+c+")"})}t=n.containerInfo,t=t.nodeType===9?t.documentElement:t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName===""&&(t.style.viewTransitionName="none",t.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),t.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Fd=!0}Ki=null;break;case 5:Os(n,t);break;case 4:s=$i,$i=!1,Os(n,t),$i&&(Fc=!0),$i=s;break;case 22:t.memoizedState===null&&(a.memoizedState!==null?zd(t,!1):Os(n,t));break;case 30:s=$i,c=Y0(),$i=!1,Os(n,t),$i&&(t.flags|=4);var f=t.memoizedProps,_=t.stateNode;n=ma(f,_),_=ma(a.memoizedProps,_);var b=ga(f.default,f.update);b==="none"?n=!1:(f=a.memoizedState,a.memoizedState=null,a=t.child,Kn=0,n=Bd(t,a,n,_,b,f,!0),Kn!==(f===null?0:f.length)&&(t.flags|=32)),(t.flags&4)!==0&&n?(Gs(t,t.memoizedProps.onUpdate),Ki=c):c!==null&&(c.push.apply(c,Ki),Ki=c),$i=(t.flags&32)!==0?!0:s;break;default:Os(n,t)}}function ta(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)tv(t,n.alternate,n),n=n.sibling}function nr(t,n){for(t=t.child;t!==null;){var a=t,s=n;switch(a.tag){case 0:case 11:case 14:case 15:er(4,a,a.return),nr(a,s);break;case 1:Dn(a,a.return);var c=a.stateNode;typeof c.componentWillUnmount=="function"&&V0(a,a.return,c),nr(a,s);break;case 27:(s&2)!==0&&o_(a.stateNode,a.type,a.memoizedProps);case 5:Dn(a,a.return),a.tag!==5&&a.tag!==27||rl(a),nr(a,s);break;case 6:rl(a);break;case 26:Dn(a,a.return),c=a.stateNode,a.memoizedState!==null||c===null||Le||c.parentNode.removeChild(c),nr(a,s);break;case 22:a.memoizedState===null&&nr(a,s);break;case 30:Dn(a,a.return),nr(a,s);break;case 7:Dn(a,a.return);default:nr(a,s)}t=t.sibling}}function zi(t,n,a){for(a=(n.subtreeFlags&8772)!==0?a:a&-2,n=n.child;n!==null;){var s=n.alternate,c=t,f=n,_=f.flags,b=(a&1)!==0;switch(f.tag){case 0:case 11:case 15:zi(c,f,a),al(4,f);break;case 1:if(zi(c,f,a),s=f,c=s.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(ut){Be(s,s.return,ut)}if(s=f,c=s.updateQueue,c!==null){var I=s.stateNode;try{var $=c.shared.hiddenCallbacks;if($!==null)for(c.shared.hiddenCallbacks=null,c=0;c<$.length;c++)Dg($[c],I)}catch(ut){Be(s,s.return,ut)}}b&&_&64&&G0(f),Zi(f,f.return);break;case 27:(a&2)!==0&&q0(f);case 5:f.tag!==5&&f.tag!==27||j0(f),zi(c,f,a),b&&s===null&&_&4&&Cd(f),Zi(f,f.return);break;case 6:j0(f);break;case 26:I=f.stateNode,f.memoizedState!==null||I===null||Mn||Th(ml(I.ownerDocument),f.type,I),zi(c,f,a),b&&s===null&&_&4&&Cd(f),Zi(f,f.return);break;case 12:zi(c,f,a);break;case 31:zi(c,f,a),b&&_&4&&av(c,f);break;case 13:zi(c,f,a),b&&_&4&&rv(c,f);break;case 22:f.memoizedState===null&&zi(c,f,a),Zi(f,f.return);break;case 30:zi(c,f,a),Zi(f,f.return);break;case 7:Zi(f,f.return);default:zi(c,f,a)}n=n.sibling}}function Gd(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&Xo(a))}function Vd(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&Xo(t))}function Mi(t,n,a,s){var c=(a&335544064)===a;if(n.subtreeFlags&(c?10262:10256))for(n=n.child;n!==null;)cv(t,n,a,s),n=n.sibling;else c&&Q0(n)}function cv(t,n,a,s){var c=(a&335544064)===a;c&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&Ic(n);var f=n.flags;switch(n.tag){case 0:case 11:case 15:Mi(t,n,a,s),f&2048&&al(9,n);break;case 1:Mi(t,n,a,s);break;case 3:Mi(t,n,a,s),c&&Fd&&(t=t.containerInfo,t=t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,t.style.viewTransitionName==="root"&&(t.style.viewTransitionName=""),t=t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName==="none"&&(t.style.viewTransitionName="")),f&2048&&(f=null,n.alternate!==null&&(f=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==f&&(n.refCount++,f!=null&&Xo(f)));break;case 12:if(f&2048){Mi(t,n,a,s),f=n.stateNode;try{var _=n.memoizedProps,b=_.id,I=_.onPostCommit;typeof I=="function"&&I(b,n.alternate===null?"mount":"update",f.passiveEffectDuration,-0)}catch($){Be(n,n.return,$)}}else Mi(t,n,a,s);break;case 31:Mi(t,n,a,s);break;case 13:Mi(t,n,a,s);break;case 23:break;case 22:_=n.stateNode,b=n.alternate,n.memoizedState!==null?(c&&b!==null&&b.memoizedState===null&&Ic(b),_._visibility&2?Mi(t,n,a,s):ol(t,n)):(c&&b!==null&&b.memoizedState!==null&&Ic(n),_._visibility&2?Mi(t,n,a,s):(_._visibility|=2,Ps(t,n,a,s,(n.subtreeFlags&10256)!==0||!1))),f&2048&&Gd(b,n);break;case 24:Mi(t,n,a,s),f&2048&&Vd(n.alternate,n);break;case 30:c&&(f=n.alternate,f!==null&&(Qi(f.child,!0),Qi(n.child,!0))),Mi(t,n,a,s);break;default:Mi(t,n,a,s)}}function Ps(t,n,a,s,c){for(c=c&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=t,_=n,b=a,I=s,$=_.flags;switch(_.tag){case 0:case 11:case 15:Ps(f,_,b,I,c),al(8,_);break;case 23:break;case 22:var ut=_.stateNode;_.memoizedState!==null?ut._visibility&2?Ps(f,_,b,I,c):ol(f,_):(ut._visibility|=2,Ps(f,_,b,I,c)),c&&$&2048&&Gd(_.alternate,_);break;case 24:Ps(f,_,b,I,c),c&&$&2048&&Vd(_.alternate,_);break;default:Ps(f,_,b,I,c)}n=n.sibling}}function ol(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,s=n,c=s.flags;switch(s.tag){case 22:ol(a,s),c&2048&&Gd(s.alternate,s);break;case 24:ol(a,s),c&2048&&Vd(s.alternate,s);break;default:ol(a,s)}n=n.sibling}}var Xr=8192;function qr(t,n,a){if(t.subtreeFlags&Xr)for(t=t.child;t!==null;)uv(t,n,a),t=t.sibling}function uv(t,n,a){switch(t.tag){case 26:qr(t,n,a),t.flags&Xr&&(t.memoizedState!==null?_E(a,Ui,t.memoizedState,t.memoizedProps):(t=t.stateNode,(n&335544128)===n&&v_(a,t)));break;case 5:qr(t,n,a),t.flags&Xr&&(t=t.stateNode,(n&335544128)===n&&v_(a,t));break;case 3:case 4:var s=Ui;Ui=ml(t.stateNode.containerInfo),qr(t,n,a),Ui=s;break;case 22:t.memoizedState===null&&(s=t.alternate,s!==null&&s.memoizedState!==null?(s=Xr,Xr=16777216,qr(t,n,a),Xr=s):qr(t,n,a));break;case 30:if((t.flags&Xr)!==0&&(s=t.memoizedProps.name,s!=null&&s!=="auto")){var c=t.stateNode;c.paired=null,ci===null&&(ci=new Map),ci.set(s,c)}qr(t,n,a);break;default:qr(t,n,a)}}function fv(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function ll(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];En=s,hv(s,t)}fv(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)dv(t),t=t.sibling}function dv(t){switch(t.tag){case 0:case 11:case 15:ll(t),t.flags&2048&&er(9,t,t.return);break;case 3:ll(t);break;case 12:ll(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,Gc(t)):ll(t);break;default:ll(t)}}function Gc(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];En=s,hv(s,t)}fv(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:er(8,n,n.return),Gc(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,Gc(n));break;default:Gc(n)}t=t.sibling}}function hv(t,n){for(;En!==null;){var a=En;switch(a.tag){case 0:case 11:case 15:er(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var s=a.memoizedState.cachePool.pool;s!=null&&s.refCount++}break;case 24:Xo(a.memoizedState.cache)}if(s=a.child,s!==null)s.return=a,En=s;else t:for(a=t;En!==null;){s=En;var c=s.sibling,f=s.return;if(nv(s),s===a){En=null;break t}if(c!==null){c.return=f,En=c;break t}En=f}}}var hM={getCacheForType:function(t){var n=An(cn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a},cacheSignal:function(){return An(cn).controller.signal}},pM=typeof WeakMap=="function"?WeakMap:Map,ze=0,Xe=null,xe=null,be=0,Pe=0,ui=null,ir=!1,Bs=!1,jd=!1,Ta=0,sn=0,ar=0,Wr=0,Vc=0,fi=0,Is=0,cl=null,Jn=null,Xd=!1,jc=0,pv=0,Xc=1/0,qc=null,rr=null,en=0,Li=null,Yr=null,ea=0,qd=0,Wd=null,mv=null,Fs=null,Hs=null,ks=null,ul=0,Wc=null;function di(){return(ze&2)!==0&&be!==0?be&-be:bt.T!==null?ih():at()}function gv(){if(fi===0)if((be&536870912)===0||ge){var t=Rr;Rr<<=1,(Rr&3932160)===0&&(Rr=262144),fi=t}else fi=536870912;return t=Rn.current,t!==null&&(t.flags|=32),fi}function Gs(t,n){if(n!=null){var a=t.stateNode,s=a.ref;s===null&&(s=a.ref=Kv(ma(t.memoizedProps,a))),Hs===null&&(Hs=[]),Hs.push(n.bind(null,s))}}function $n(t,n,a){(t===Xe&&(Pe===2||Pe===9)||t.cancelPendingCommit!==null)&&(Vs(t,0),sr(t,be,fi,!1)),Cr(t,a),((ze&2)===0||t!==Xe)&&(t===Xe&&((ze&2)===0&&(Wr|=a),sn===4&&sr(t,be,fi,!1)),na(t))}function vv(t,n,a){if((ze&6)!==0)throw Error(r(327));var s=!a&&(n&127)===0&&(n&t.expiredLanes)===0||Ha(t,n),c=s?vM(t,n):Zd(t,n,!0),f=s;do{if(c===0){Bs&&!s&&sr(t,n,0,!1);break}else{if(a=t.current.alternate,f&&!mM(a)){c=Zd(t,n,!1),f=!1;continue}if(c===2){if(f=n,t.errorRecoveryDisabledLanes&f)var _=0;else _=t.pendingLanes&-536870913,_=_!==0?_:_&536870912?536870912:0;if(_!==0){n=_;t:{var b=t;c=cl;var I=b.current.memoizedState.isDehydrated;if(I&&(Vs(b,_).flags|=256),_=Zd(b,_,!1),_!==2&&_!==6){if(jd&&!I){b.errorRecoveryDisabledLanes|=f,Wr|=f,c=4;break t}f=Jn,Jn=c,f!==null&&(Jn===null?Jn=f:Jn.push.apply(Jn,f))}c=_}if(f=!1,c!==2)continue}}if(c===1){Vs(t,0),sr(t,n,0,!0);break}t:{switch(s=t,f=c,f){case 0:case 1:throw Error(r(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:sr(s,n,fi,!ir);break t;case 2:Jn=null;break;case 3:case 5:break;default:throw Error(r(329))}if((n&62914560)===n&&(c=jc+300-W(),10<c)){if(sr(s,n,fi,!ir),fa(s,0,!0)!==0)break t;ea=n,s.timeoutHandle=ph(_v.bind(null,s,a,Jn,qc,Xd,n,fi,Wr,Is,ir,f,"Throttled",-0,0),c);break t}_v(s,a,Jn,qc,Xd,n,fi,Wr,Is,ir,f,null,-0,0)}}break}while(!0);na(t)}function _v(t,n,a,s,c,f,_,b,I,$,ut,xt,Z,ot){t.timeoutHandle=-1;var Lt=n.subtreeFlags,qt=(f&335544064)===f;if(xt=null,(qt||Lt&8192||(Lt&16785408)===16785408)&&(xt={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:qi},ci=null,uv(n,f,xt),qt&&(Lt=xt,qt=t.containerInfo,qt=(qt.nodeType===9?qt:qt.ownerDocument).__reactViewTransition,qt!=null&&(Lt.count++,Lt.waitingForViewTransition=!0,Lt=_l.bind(Lt),qt.finished.then(Lt,Lt))),Lt=(f&62914560)===f?jc-W():(f&4194048)===f?pv-W():0,Lt=yE(xt,Lt),Lt!==null)){ea=f,t.cancelPendingCommit=Lt(wv.bind(null,t,n,f,a,s,c,_,b,I,$,ut,xt,null,Z,ot)),sr(t,f,_,!$);return}wv(t,n,f,a,s,c,_,b,I,$,ut,xt)}function mM(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var s=0;s<a.length;s++){var c=a[s],f=c.getSnapshot;c=c.value;try{if(!oi(f(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function sr(t,n,a,s){n=Uo(t,n),n&=~Vc,n&=~Wr,t.suspendedLanes|=n,t.pingedLanes&=~n,s&&(t.warmLanes|=n),s=t.expirationTimes;for(var c=n;0<c;){var f=31-Bn(c),_=1<<f;s[f]=-1,c&=~_}a!==0&&Xl(t,a,n)}function Yc(){return(ze&6)===0?(fl(0),!1):!0}function Yd(){if(xe!==null){if(Pe===0)var t=xe.return;else t=xe,ya=Or=null,nd(t),Cs=null,Yo=0,t=xe;for(;t!==null;)k0(t.alternate,t),t=t.return;xe=null}}function Vs(t,n){var a=t.timeoutHandle;return a!==-1&&(t.timeoutHandle=-1,FM(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),ea=0,Yd(),Xe=t,xe=a=va(t.current,null),be=n,Pe=0,ui=null,ir=!1,Bs=Ha(t,n),jd=!1,Is=fi=Vc=Wr=ar=sn=0,Jn=cl=null,Xd=!1,Ta=Uo(t,n),nc(),a}function yv(t,n){fe=null,bt.H=Ac,n===Rs||n===hc?(n=wg(),Pe=3):n===Vf?(n=wg(),Pe=4):Pe=n===vd?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,ui=n,xe===null&&(sn=1,Rc(t,_i(n,t.current)))}function xv(){var t=Rn.current;return t===null?!0:(be&4194048)===be?Fn===null:(be&62914560)===be||(be&536870912)!==0?t===Fn:!1}function Sv(){var t=bt.H;return bt.H=Ac,t===null?Ac:t}function Mv(){var t=bt.A;return bt.A=hM,t}function Zc(){sn=4,ir||(be&4194048)!==be&&Rn.current!==null||(Bs=!0),(ar&134217727)===0&&(Wr&134217727)===0||Xe===null||sr(Xe,be,fi,!1)}function Zd(t,n,a){var s=ze;ze|=2;var c=Sv(),f=Mv();(Xe!==t||be!==n)&&(qc=null,Vs(t,n)),n=!1;var _=sn;t:do try{if(Pe!==0&&xe!==null){var b=xe,I=ui;switch(Pe){case 8:Yd(),_=6;break t;case 3:case 2:case 9:case 6:Rn.current===null&&(n=!0);var $=Pe;if(Pe=0,ui=null,js(t,b,I,$),a&&Bs){_=0;break t}break;default:$=Pe,Pe=0,ui=null,js(t,b,I,$)}}gM(),_=sn;break}catch(ut){yv(t,ut)}while(!0);return n&&t.shellSuspendCounter++,ya=Or=null,ze=s,bt.H=c,bt.A=f,xe===null&&(Xe=null,be=0,nc()),_}function gM(){for(;xe!==null;)Ev(xe)}function vM(t,n){var a=ze;ze|=2;var s=Sv(),c=Mv();Xe!==t||be!==n?(qc=null,Xc=W()+500,Vs(t,n)):Bs=Ha(t,n);t:do try{if(Pe!==0&&xe!==null){n=xe;var f=ui;e:switch(Pe){case 1:Pe=0,ui=null,js(t,n,f,1);break;case 2:case 9:if(bg(f)){Pe=0,ui=null,bv(n);break}n=function(){Pe!==2&&Pe!==9||Xe!==t||(Pe=7),na(t)},f.then(n,n);break t;case 3:Pe=7;break t;case 4:Pe=5;break t;case 7:bg(f)?(Pe=0,ui=null,bv(n)):(Pe=0,ui=null,js(t,n,f,7));break;case 5:var _=null;switch(xe.tag){case 26:_=xe.memoizedState;case 5:case 27:var b=xe;if(_?m_(_):b.stateNode.complete){Pe=0,ui=null;var I=b.sibling;if(I!==null)xe=I;else{var $=b.return;$!==null?(xe=$,Kc($)):xe=null}break e}}Pe=0,ui=null,js(t,n,f,5);break;case 6:Pe=0,ui=null,js(t,n,f,6);break;case 8:Yd(),sn=6;break t;default:throw Error(r(462))}}_M();break}catch(ut){yv(t,ut)}while(!0);return ya=Or=null,bt.H=s,bt.A=c,ze=a,xe!==null?0:(Xe=null,be=0,nc(),sn)}function _M(){for(;xe!==null&&!ue();)Ev(xe)}function Ev(t){var n=F0(t.alternate,t,Ta);t.memoizedProps=t.pendingProps,n===null?Kc(t):xe=n}function bv(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=U0(a,n,n.pendingProps,n.type,void 0,be);break;case 11:n=U0(a,n,n.pendingProps,n.type.render,n.ref,be);break;case 5:nd(n);var s=n;s===Sn&&(ge?(lc(s),s.tag===5&&s.stateNode!=null&&(We=s.stateNode)):(lc(s),ge=!0));default:k0(a,n),n=xe=hg(n,Ta),n=F0(a,n,Ta)}t.memoizedProps=t.pendingProps,n===null?Kc(t):xe=n}function js(t,n,a,s){ya=Or=null,nd(n),Cs=null,Yo=0;var c=n.return;try{if(rM(t,c,n,a,be)){sn=1,Rc(t,_i(a,t.current)),xe=null;return}}catch(f){if(c!==null)throw xe=c,f;sn=1,Rc(t,_i(a,t.current)),xe=null;return}n.flags&32768?(ge||s===1?t=!0:Bs||(be&536870912)!==0?t=!1:(ir=t=!0,(s===2||s===9||s===3||s===6)&&(s=Rn.current,s!==null&&s.tag===13&&(s.flags|=16384))),Tv(n,t)):Kc(n)}function Kc(t){var n=t;do{if((n.flags&32768)!==0){Tv(n,ir);return}t=n.return;var a=cM(n.alternate,n,Ta);if(a!==null){xe=a;return}if(n=n.sibling,n!==null){xe=n;return}xe=n=t}while(n!==null);sn===0&&(sn=5)}function Tv(t,n){do{var a=uM(t.alternate,t);if(a!==null){a.flags&=32767,xe=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){xe=t;return}xe=t=a}while(t!==null);sn=6,xe=null}function wv(t,n,a,s,c,f,_,b,I,$,ut,xt){t.cancelPendingCommit=null;do Qc();while(en!==0);if((ze&6)!==0)throw Error(r(327));if(n!==null){if(n===t.current)throw Error(r(177));t===Xe&&(xe=Xe=null,be=0),Yr=n,Li=t,ea=a,Wd=c,mv=s,yM(t,n,a,_,b,I,xt)}}function yM(t,n,a,s,c,f,_){var b=n.lanes|n.childLanes;if(qd=b,b|=Df,of(t,a,b,s,c,f),Hs=null,(a&335544064)===a?(ks=WS(t),s=10262):(ks=null,s=10256),(n.subtreeFlags&s)!==0||(n.flags&s)!==0?(t.callbackNode=null,t.callbackPriority=0,TM(Ht,function(){return $d(),null})):(t.callbackNode=null,t.callbackPriority=0),Pc=!1,s=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||s){s=bt.T,bt.T=null,c=zt.p,zt.p=2,f=ze,ze|=4;try{fM(t,n,a)}finally{ze=f,zt.p=c,bt.T=s}}en=1,Pc?Fs=XM(_,t.containerInfo,ks,Kd,Qd,SM,Jd,$d,xM):(Kd(),Qd(),Jd())}function xM(t){if(en!==0){var n=Li.onRecoverableError;n(t,{componentStack:null})}}function SM(){en===3&&(en=0,lv(Yr,Li),en=4)}function Kd(){if(en===1){en=0;var t=Li,n=Yr,a=ea,s=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||s){s=bt.T,bt.T=null;var c=zt.p;zt.p=2;var f=ze;ze|=4;try{sl=Fc=!1,sv(n,t,a),a=fh;var _=ig(t.containerInfo),b=a.focusedElem,I=a.selectionRange;if(_!==b&&b&&b.ownerDocument&&ng(b.ownerDocument.documentElement,b)){if(I!==null&&Tf(b)){var $=I.start,ut=I.end;if(ut===void 0&&(ut=$),"selectionStart"in b)b.selectionStart=$,b.selectionEnd=Math.min(ut,b.value.length);else{var xt=b.ownerDocument||document,Z=xt&&xt.defaultView||window;if(Z.getSelection){var ot=Z.getSelection(),Lt=b.textContent.length,qt=Math.min(I.start,Lt),de=I.end===void 0?qt:Math.min(I.end,Lt);!ot.extend&&qt>de&&(_=de,de=qt,qt=_);var J=eg(b,qt),j=eg(b,de);if(J&&j&&(ot.rangeCount!==1||ot.anchorNode!==J.node||ot.anchorOffset!==J.offset||ot.focusNode!==j.node||ot.focusOffset!==j.offset)){var rt=xt.createRange();rt.setStart(J.node,J.offset),ot.removeAllRanges(),qt>de?(ot.addRange(rt),ot.extend(j.node,j.offset)):(rt.setEnd(j.node,j.offset),ot.addRange(rt))}}}}for(xt=[],ot=b;ot=ot.parentNode;)ot.nodeType===1&&xt.push({element:ot,left:ot.scrollLeft,top:ot.scrollTop});for(typeof b.focus=="function"&&b.focus(),b=0;b<xt.length;b++){var yt=xt[b];yt.element.scrollLeft=yt.left,yt.element.scrollTop=yt.top}}Js=!!uh,fh=uh=null}finally{ze=f,zt.p=c,bt.T=s}}t.current=n,en=2}}function Qd(){if(en===2){en=0;var t=Li,n=Yr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=bt.T,bt.T=null;var s=zt.p;zt.p=2;var c=ze;ze|=4;try{tv(t,n.alternate,n)}finally{ze=c,zt.p=s,bt.T=a}}en=3}}function Jd(){if(en===4||en===3){en=0;var t=Fs;Fs=null,He();var n=Li,a=Yr,s=ea,c=mv,f=(s&335544064)===s?10262:10256;if((a.subtreeFlags&f)!==0||(a.flags&f)!==0?en=5:(en=0,Yr=Li=null,Av(n,n.pendingLanes)),f=n.pendingLanes,f===0&&(rr=null),pt(s),a=a.stateNode,Ke&&typeof Ke.onCommitFiberRoot=="function")try{Ke.onCommitFiberRoot(we,a,void 0,(a.current.flags&128)===128)}catch{}if(c!==null){a=bt.T,f=zt.p,zt.p=2,bt.T=null;try{for(var _=n.onRecoverableError,b=0;b<c.length;b++){var I=c[b];_(I.value,{componentStack:I.stack})}}finally{bt.T=a,zt.p=f}}if(c=Hs,_=ks,ks=null,c!==null&&(Hs=null,_===null&&(_=[]),t!==null))for(I=0;I<c.length;I++)a=(0,c[I])(_),a!==void 0&&t.finished.finally(a);(ea&3)!==0&&Qc(),na(n),f=n.pendingLanes,(s&261930)!==0&&(f&42)!==0?n===Wc?ul++:(ul=0,Wc=n):(ul=0,Wc=null),fl(0)}}function Av(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,Xo(n)))}function Qc(){return Fs!==null&&(Fs.skipTransition(),Fs=null),Kd(),Qd(),Jd(),$d()}function $d(){if(en!==5)return!1;var t=Li,n=qd;qd=0;var a=pt(ea),s=bt.T,c=zt.p;try{zt.p=32>a?32:a,bt.T=null,a=Wd,Wd=null;var f=Li,_=ea;if(en=0,Yr=Li=null,ea=0,(ze&6)!==0)throw Error(r(331));var b=ze;if(ze|=4,dv(f.current),cv(f,f.current,_,a),ze=b,fl(0,!1),Ke&&typeof Ke.onPostCommitFiberRoot=="function")try{Ke.onPostCommitFiberRoot(we,f)}catch{}return!0}finally{zt.p=c,bt.T=s,Av(t,n)}}function Rv(t,n,a){n=_i(a,n),n=gd(t.stateNode,n,2),t=Qa(t,n,2),t!==null&&(Cr(t,2),na(t))}function Be(t,n,a){if(t.tag===3)Rv(t,t,a);else for(;n!==null;){if(n.tag===3){Rv(n,t,a);break}else if(n.tag===1){var s=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(rr===null||!rr.has(s))){t=_i(a,t),a=b0(2),s=Qa(n,a,2),s!==null&&(T0(a,s,n,t),Cr(s,2),na(s));break}}n=n.return}}function th(t,n,a){var s=t.pingCache;if(s===null){s=t.pingCache=new pM;var c=new Set;s.set(n,c)}else c=s.get(n),c===void 0&&(c=new Set,s.set(n,c));c.has(a)||(jd=!0,c.add(a),t=MM.bind(null,t,n,a),n.then(t,t))}function MM(t,n,a){var s=t.pingCache;s!==null&&s.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,Xe===t&&(be&a)===a&&((sn===4||sn===3&&(be&62914560)===be&&300>W()-jc)&&(ze&2)===0?Vs(t,0):Vc|=a,Is===be&&(Is=0)),na(t)}function Cv(t,n){n===0&&(n=jl()),t=Ur(t,n),t!==null&&(Cr(t,n),na(t))}function EM(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),Cv(t,a)}function bM(t,n){var a=0;switch(t.tag){case 31:case 13:var s=t.stateNode,c=t.memoizedState;c!==null&&(a=c.retryLane);break;case 19:s=t.stateNode;break;case 22:s=t.stateNode._retryCache;break;default:throw Error(r(314))}s!==null&&s.delete(n),Cv(t,a)}function TM(t,n){return jt(t,n)}var Xs=null,qs=null,eh=!1,Jc=!1,nh=!1,or=0;function na(t){t!==qs&&t.next===null&&(qs===null?Xs=qs=t:qs=qs.next=t),Jc=!0,eh||(eh=!0,AM())}function fl(t,n){if(!nh&&Jc){nh=!0;do for(var a=!1,s=Xs;s!==null;){if(t!==0){var c=s.pendingLanes;if(c===0)var f=0;else{var _=s.suspendedLanes,b=s.pingedLanes;f=(1<<31-Bn(42|t)+1)-1,f&=c&~(_&~b),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,zv(s,f))}else f=be,f=fa(s,s===Xe?f:0,s.cancelPendingCommit!==null||s.timeoutHandle!==-1),(f&3)===0||Ha(s,f)||(a=!0,zv(s,f));s=s.next}while(a);nh=!1}}function wM(){Dv()}function Dv(){Jc=eh=!1;var t=0;or!==0&&IM()&&(t=or);for(var n=W(),a=null,s=Xs;s!==null;){var c=s.next,f=Nv(s,n);f===0?(s.next=null,a===null?Xs=c:a.next=c,c===null&&(qs=a)):(a=s,(t!==0||(f&3)!==0)&&(Jc=!0)),s=c}en!==0&&en!==5||fl(t),or!==0&&(or=0)}function Nv(t,n){for(var a=t.suspendedLanes,s=t.pingedLanes,c=t.expirationTimes,f=t.pendingLanes&-62914561;0<f;){var _=31-Bn(f),b=1<<_,I=c[_];I===-1?((b&a)===0||(b&s)!==0)&&(c[_]=sf(b,n)):I<=n&&(t.expiredLanes|=b),f&=~b}if(n=Xe,a=be,a=fa(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s=t.callbackNode,a===0||t===n&&(Pe===2||Pe===9)||t.cancelPendingCommit!==null)return s!==null&&s!==null&&_e(s),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||Ha(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(s!==null&&_e(s),pt(a)){case 2:case 8:a=St;break;case 32:a=Ht;break;case 268435456:a=ce;break;default:a=Ht}return s=Uv.bind(null,t),a=jt(a,s),t.callbackPriority=n,t.callbackNode=a,n}return s!==null&&s!==null&&_e(s),t.callbackPriority=2,t.callbackNode=null,2}function Uv(t,n){if(en!==0&&en!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(Qc()&&t.callbackNode!==a)return null;var s=be;return s=fa(t,t===Xe?s:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s===0?null:(vv(t,s,n),Nv(t,W()),t.callbackNode!=null&&t.callbackNode===a?Uv.bind(null,t):null)}function zv(t,n){if(Qc())return null;vv(t,n,!0)}function AM(){HM(function(){(ze&6)!==0?jt(gt,wM):Dv()})}function ih(){if(or===0){var t=Ir;t===0&&(t=Ar,Ar<<=1,(Ar&261888)===0&&(Ar=256)),or=t}return or}function Lv(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Yl(t)}function RM(t,n,a,s,c){if(n==="submit"&&a&&a.stateNode===c){var f=Lv((c[Bt]||null).action),_=s.submitter;_&&(n=(n=_[Bt]||null)?Lv(n.formAction):_.getAttribute("formAction"),n!==null&&(f=n,_=null));var b=new Jl("action","action",null,s,c);t.push({event:b,listeners:[{instance:null,listener:function(){if(s.defaultPrevented){if(or!==0){var I=new FormData(c,_);fd(a,{pending:!0,data:I,method:c.method,action:f},null,I)}}else typeof f=="function"&&(b.preventDefault(),I=new FormData(c,_),fd(a,{pending:!0,data:I,method:c.method,action:f},f,I))},currentTarget:c}]})}}for(var ah=0;ah<Cf.length;ah++){var rh=Cf[ah],CM=rh.toLowerCase(),DM=rh[0].toUpperCase()+rh.slice(1);Di(CM,"on"+DM)}Di(sg,"onAnimationEnd"),Di(og,"onAnimationIteration"),Di(lg,"onAnimationStart"),Di("dblclick","onDoubleClick"),Di("focusin","onFocus"),Di("focusout","onBlur"),Di(FS,"onTransitionRun"),Di(HS,"onTransitionStart"),Di(kS,"onTransitionCancel"),Di(cg,"onTransitionEnd"),pn("onMouseEnter",["mouseout","mouseover"]),pn("onMouseLeave",["mouseout","mouseover"]),pn("onPointerEnter",["pointerout","pointerover"]),pn("onPointerLeave",["pointerout","pointerover"]),ln("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),ln("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),ln("onBeforeInput",["compositionend","keypress","textInput","paste"]),ln("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),ln("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),ln("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var dl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),NM=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(dl));function Ov(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var s=t[a],c=s.event;s=s.listeners;t:{var f=void 0;if(n)for(var _=s.length-1;0<=_;_--){var b=s[_],I=b.instance,$=b.currentTarget;if(b=b.listener,I!==f&&c.isPropagationStopped())break t;f=b,c.currentTarget=$;try{f(c)}catch(ut){ec(ut)}c.currentTarget=null,f=I}else for(_=0;_<s.length;_++){if(b=s[_],I=b.instance,$=b.currentTarget,b=b.listener,I!==f&&c.isPropagationStopped())break t;f=b,c.currentTarget=$;try{f(c)}catch(ut){ec(ut)}c.currentTarget=null,f=I}}}}function Se(t,n){var a=n[oe];a===void 0&&(a=n[oe]=new Set);var s=t+"__bubble";a.has(s)||(Pv(n,t,2,!1),a.add(s))}function sh(t,n,a){var s=0;n&&(s|=4),Pv(a,t,s,n)}var $c="_reactListening"+Math.random().toString(36).slice(2);function oh(t){if(!t[$c]){t[$c]=!0,ka.forEach(function(a){a!=="selectionchange"&&(NM.has(a)||sh(a,!1,t),sh(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[$c]||(n[$c]=!0,sh("selectionchange",!1,n))}}function Pv(t,n,a,s){switch(T_(n)){case 2:var c=EE;break;case 8:c=bE;break;default:c=Ah}a=c.bind(null,n,a,t),c=void 0,!mf||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),s?c!==void 0?t.addEventListener(n,a,{capture:!0,passive:c}):t.addEventListener(n,a,!0):c!==void 0?t.addEventListener(n,a,{passive:c}):t.addEventListener(n,a,!1)}function lh(t,n,a,s,c){var f=s;if((n&1)===0&&(n&2)===0&&s!==null)t:for(;;){if(s===null)return;var _=s.tag;if(_===3||_===4){var b=s.stateNode.containerInfo;if(b===c)break;if(_===4)for(_=s.return;_!==null;){var I=_.tag;if((I===3||I===4)&&_.stateNode.containerInfo===c)return;_=_.return}for(;b!==null;){if(_=Zt(b),_===null)return;if(I=_.tag,I===5||I===6||I===26||I===27){s=f=_;continue t}b=b.parentNode}}s=s.return}Pm(function(){var $=f,ut=hf(a),xt=[];t:{var Z=ug.get(t);if(Z!==void 0){var ot=Jl,Lt=t;switch(t){case"keypress":if(Kl(a)===0)break t;case"keydown":case"keyup":ot=mS;break;case"focusin":Lt="focus",ot=yf;break;case"focusout":Lt="blur",ot=yf;break;case"beforeblur":case"afterblur":ot=yf;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ot=Fm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ot=iS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ot=xS;break;case sg:case og:case lg:ot=sS;break;case cg:ot=MS;break;case"scroll":case"scrollend":ot=eS;break;case"wheel":ot=bS;break;case"copy":case"cut":case"paste":ot=lS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ot=km;break;case"submit":ot=_S;break;case"toggle":case"beforetoggle":ot=wS}var qt=(n&4)!==0,de=!qt&&(t==="scroll"||t==="scrollend"),J=qt?Z!==null?Z+"Capture":null:Z;qt=[];for(var j=$,rt;j!==null;){var yt=j;if(rt=yt.stateNode,yt=yt.tag,yt!==5&&yt!==26&&yt!==27||rt===null||J===null||(yt=Lo(j,J),yt!=null&&qt.push(hl(j,yt,rt))),de)break;j=j.return}0<qt.length&&(Z=new ot(Z,Lt,null,a,ut),xt.push({event:Z,listeners:qt}))}}if((n&7)===0){t:{if(ot=t==="mouseover"||t==="pointerover",Z=t==="mouseout"||t==="pointerout",ot&&a!==df&&(Lt=a.relatedTarget||a.fromElement)&&(Zt(Lt)||Lt[ee]))break t;(Z||ot)&&(Lt=ut.window===ut?ut:(ot=ut.ownerDocument)?ot.defaultView||ot.parentWindow:window,Z?(ot=a.relatedTarget||a.toElement,Z=$,ot=ot?Zt(ot):null,ot!==null&&(de=u(ot),qt=ot.tag,ot!==de||qt!==5&&qt!==27&&qt!==6)&&(ot=null)):(Z=null,ot=$),Z!==ot&&(qt=Fm,yt="onMouseLeave",J="onMouseEnter",j="mouse",(t==="pointerout"||t==="pointerover")&&(qt=km,yt="onPointerLeave",J="onPointerEnter",j="pointer"),de=Z==null?Lt:Ee(Z),rt=ot==null?Lt:Ee(ot),Lt=new qt(yt,j+"leave",Z,a,ut),Lt.target=de,Lt.relatedTarget=rt,yt=null,Zt(ut)===$&&(qt=new qt(J,j+"enter",ot,a,ut),qt.target=rt,qt.relatedTarget=de,yt=qt),de=yt,qt=Z&&ot?H(Z,ot,UM):null,Z!==null&&Bv(xt,Lt,Z,qt,!1),ot!==null&&de!==null&&Bv(xt,de,ot,qt,!0)))}t:{if(Z=$?Ee($):window,ot=Z.nodeName&&Z.nodeName.toLowerCase(),ot==="select"||ot==="input"&&Z.type==="file")var Vt=Zm;else if(Wm(Z))if(Km)Vt=PS;else{Vt=LS;var Te=zS}else ot=Z.nodeName,!ot||ot.toLowerCase()!=="input"||Z.type!=="checkbox"&&Z.type!=="radio"?$&&ff($.elementType)&&(Vt=Zm):Vt=OS;if(Vt&&(Vt=Vt(t,$))){Ym(xt,Vt,a,ut);break t}Te&&Te(t,Z,$)}switch(Te=$?Ee($):window,t){case"focusin":(Wm(Te)||Te.contentEditable==="true")&&(xs=Te,wf=$,Go=null);break;case"focusout":Go=wf=xs=null;break;case"mousedown":Af=!0;break;case"contextmenu":case"mouseup":case"dragend":Af=!1,ag(xt,a,ut);break;case"selectionchange":if(IS)break;case"keydown":case"keyup":ag(xt,a,ut)}var Qt;if(Sf)t:{switch(t){case"compositionstart":var ie="onCompositionStart";break t;case"compositionend":ie="onCompositionEnd";break t;case"compositionupdate":ie="onCompositionUpdate";break t}ie=void 0}else ys?Xm(t,a)&&(ie="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(ie="onCompositionStart");ie&&(Gm&&a.locale!=="ko"&&(ys||ie!=="onCompositionStart"?ie==="onCompositionEnd"&&ys&&(Qt=Bm()):(Ga=ut,gf="value"in Ga?Ga.value:Ga.textContent,ys=!0)),Te=tu($,ie),0<Te.length&&(ie=new Hm(ie,t,null,a,ut),xt.push({event:ie,listeners:Te}),Qt?ie.data=Qt:(Qt=qm(a),Qt!==null&&(ie.data=Qt)))),(Qt=RS?CS(t,a):DS(t,a))&&(ie=tu($,"onBeforeInput"),0<ie.length&&(Te=new Hm("onBeforeInput","beforeinput",null,a,ut),xt.push({event:Te,listeners:ie}),Te.data=Qt)),RM(xt,t,$,a,ut)}Ov(xt,n)})}function hl(t,n,a){return{instance:t,listener:n,currentTarget:a}}function tu(t,n){for(var a=n+"Capture",s=[];t!==null;){var c=t,f=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||f===null||(c=Lo(t,a),c!=null&&s.unshift(hl(t,c,f)),c=Lo(t,n),c!=null&&s.push(hl(t,c,f))),t.tag===3)return s;t=t.return}return[]}function UM(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function Bv(t,n,a,s,c){for(var f=n._reactName,_=[];a!==null&&a!==s;){var b=a,I=b.alternate,$=b.stateNode;if(b=b.tag,I!==null&&I===s)break;b!==5&&b!==26&&b!==27||$===null||(I=$,c?($=Lo(a,f),$!=null&&_.unshift(hl(a,$,I))):c||($=Lo(a,f),$!=null&&_.push(hl(a,$,I)))),a=a.return}_.length!==0&&t.push({event:n,listeners:_})}var zM=/\r\n?/g,LM=/\u0000|\uFFFD/g;function Iv(t){return(typeof t=="string"?t:""+t).replace(zM,`
`).replace(LM,"")}function Fv(t,n){return n=Iv(n),Iv(t)===n}function Ie(t,n,a,s,c,f){switch(a){case"children":if(typeof s=="string")n==="body"||n==="textarea"&&s===""||gs(t,s);else if(typeof s=="number"||typeof s=="bigint")n!=="body"&&gs(t,""+s);else return;break;case"className":Wl(t,"class",s);break;case"tabIndex":Wl(t,"tabindex",s);break;case"dir":case"role":case"viewBox":case"width":case"height":Wl(t,a,s);break;case"style":Lm(t,s,f);return;case"data":if(n!=="object"){Wl(t,"data",s);break}case"src":case"href":if(s===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(s==null||typeof s=="function"||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Yl(s),t.setAttribute(a,s);break;case"action":case"formAction":if(typeof s=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&Ie(t,n,"name",c.name,c,null),Ie(t,n,"formEncType",c.formEncType,c,null),Ie(t,n,"formMethod",c.formMethod,c,null),Ie(t,n,"formTarget",c.formTarget,c,null)):(Ie(t,n,"encType",c.encType,c,null),Ie(t,n,"method",c.method,c,null),Ie(t,n,"target",c.target,c,null)));if(s==null||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Yl(s),t.setAttribute(a,s);break;case"onClick":s!=null&&(t.onclick=qi);return;case"onScroll":s!=null&&Se("scroll",t);return;case"onScrollEnd":s!=null&&Se("scrollend",t);return;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));(f!=null?f.__html:void 0)!==a&&(t.innerHTML=a)}}break;case"multiple":t.multiple=s&&typeof s!="function"&&typeof s!="symbol";break;case"muted":t.muted=s&&typeof s!="function"&&typeof s!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(s==null||typeof s=="function"||typeof s=="boolean"||typeof s=="symbol"){t.removeAttribute("xlink:href");break}a=Yl(s),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,s):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":s&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":s===!0?t.setAttribute(a,""):s!==!1&&s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,s):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":s!=null&&typeof s!="function"&&typeof s!="symbol"&&!isNaN(s)&&1<=s?t.setAttribute(a,s):t.removeAttribute(a);break;case"rowSpan":case"start":s==null||typeof s=="function"||typeof s=="symbol"||isNaN(s)?t.removeAttribute(a):t.setAttribute(a,s);break;case"popover":Se("beforetoggle",t),Se("toggle",t),ql(t,"popover",s);break;case"xlinkActuate":ha(t,"http://www.w3.org/1999/xlink","xlink:actuate",s);break;case"xlinkArcrole":ha(t,"http://www.w3.org/1999/xlink","xlink:arcrole",s);break;case"xlinkRole":ha(t,"http://www.w3.org/1999/xlink","xlink:role",s);break;case"xlinkShow":ha(t,"http://www.w3.org/1999/xlink","xlink:show",s);break;case"xlinkTitle":ha(t,"http://www.w3.org/1999/xlink","xlink:title",s);break;case"xlinkType":ha(t,"http://www.w3.org/1999/xlink","xlink:type",s);break;case"xmlBase":ha(t,"http://www.w3.org/XML/1998/namespace","xml:base",s);break;case"xmlLang":ha(t,"http://www.w3.org/XML/1998/namespace","xml:lang",s);break;case"xmlSpace":ha(t,"http://www.w3.org/XML/1998/namespace","xml:space",s);break;case"is":ql(t,"is",s);break;case"innerText":case"textContent":return;default:if(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")a=$x.get(a)||a,ql(t,a,s);else return}Ne=!0}function ch(t,n,a,s,c,f){switch(a){case"style":Lm(t,s,f);return;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));(f!=null?f.__html:void 0)!==a&&(t.innerHTML=a)}}break;case"children":if(typeof s=="string")gs(t,s);else if(typeof s=="number"||typeof s=="bigint")gs(t,""+s);else return;break;case"onScroll":s!=null&&Se("scroll",t);return;case"onScrollEnd":s!=null&&Se("scrollend",t);return;case"onClick":s!=null&&(t.onclick=qi);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!je.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),f=a.slice(2,c?a.length-7:void 0),n=t[Bt]||null,n=n!=null?n[a]:null,typeof n=="function"&&t.removeEventListener(f,n,c),typeof s=="function")){typeof n!="function"&&n!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(f,s,c);break t}Ne=!0,a in t?t[a]=s:s===!0?t.setAttribute(a,""):ql(t,a,s)}return}Ne=!0}function Nn(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Se("error",t),Se("load",t);var s=!1,c=!1,f;for(f in a)if(a.hasOwnProperty(f)){var _=a[f];if(_!=null)switch(f){case"src":s=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Ie(t,n,f,_,a,null)}}c&&Ie(t,n,"srcSet",a.srcSet,a,null),s&&Ie(t,n,"src",a.src,a,null);return;case"input":Se("invalid",t);var b=f=_=c=null,I=null,$=null;for(s in a)if(a.hasOwnProperty(s)){var ut=a[s];if(ut!=null)switch(s){case"name":c=ut;break;case"type":_=ut;break;case"checked":I=ut;break;case"defaultChecked":$=ut;break;case"value":f=ut;break;case"defaultValue":b=ut;break;case"children":case"dangerouslySetInnerHTML":if(ut!=null)throw Error(r(137,n));break;default:Ie(t,n,s,ut,a,null)}}Dm(t,f,b,I,$,_,c,!1);return;case"select":Se("invalid",t),s=_=f=null;for(c in a)if(a.hasOwnProperty(c)&&(b=a[c],b!=null))switch(c){case"value":f=b;break;case"defaultValue":_=b;break;case"multiple":s=b;default:Ie(t,n,c,b,a,null)}n=f,a=_,t.multiple=!!s,n!=null?ms(t,!!s,n,!1):a!=null&&ms(t,!!s,a,!0);return;case"textarea":Se("invalid",t),f=c=s=null;for(_ in a)if(a.hasOwnProperty(_)&&(b=a[_],b!=null))switch(_){case"value":s=b;break;case"defaultValue":c=b;break;case"children":f=b;break;case"dangerouslySetInnerHTML":if(b!=null)throw Error(r(91));break;default:Ie(t,n,_,b,a,null)}Um(t,s,c,f);return;case"option":for(I in a)if(a.hasOwnProperty(I)&&(s=a[I],s!=null))switch(I){case"selected":t.selected=s&&typeof s!="function"&&typeof s!="symbol";break;default:Ie(t,n,I,s,a,null)}return;case"dialog":Se("beforetoggle",t),Se("toggle",t),Se("cancel",t),Se("close",t);break;case"iframe":case"object":Se("load",t);break;case"video":case"audio":for(s=0;s<dl.length;s++)Se(dl[s],t);break;case"image":Se("error",t),Se("load",t);break;case"details":Se("toggle",t);break;case"embed":case"source":case"link":Se("error",t),Se("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for($ in a)if(a.hasOwnProperty($)&&(s=a[$],s!=null))switch($){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Ie(t,n,$,s,a,null)}return;default:if(ff(n)){for(ut in a)a.hasOwnProperty(ut)&&(s=a[ut],s!==void 0&&ch(t,n,ut,s,a,void 0));return}}for(b in a)a.hasOwnProperty(b)&&(s=a[b],s!=null&&Ie(t,n,b,s,a,null))}var OM={};function PM(t,n,a,s){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,f=null,_=null,b=null,I=null,$=null,ut=null;for(ot in a){var xt=a[ot];if(a.hasOwnProperty(ot)&&xt!=null)switch(ot){case"checked":break;case"value":break;case"defaultValue":I=xt;default:s.hasOwnProperty(ot)||Ie(t,n,ot,null,s,xt)}}for(var Z in s){var ot=s[Z];if(xt=a[Z],s.hasOwnProperty(Z)&&(ot!=null||xt!=null))switch(Z){case"type":ot!==xt&&(Ne=!0),f=ot;break;case"name":ot!==xt&&(Ne=!0),c=ot;break;case"checked":ot!==xt&&(Ne=!0),$=ot;break;case"defaultChecked":ot!==xt&&(Ne=!0),ut=ot;break;case"value":ot!==xt&&(Ne=!0),_=ot;break;case"defaultValue":ot!==xt&&(Ne=!0),b=ot;break;case"children":case"dangerouslySetInnerHTML":if(ot!=null)throw Error(r(137,n));break;default:ot!==xt&&Ie(t,n,Z,ot,s,xt)}}cf(t,_,b,I,$,ut,f,c);return;case"select":ot=_=b=Z=null;for(f in a)if(I=a[f],a.hasOwnProperty(f)&&I!=null)switch(f){case"value":break;case"multiple":ot=I;default:s.hasOwnProperty(f)||Ie(t,n,f,null,s,I)}for(c in s)if(f=s[c],I=a[c],s.hasOwnProperty(c)&&(f!=null||I!=null))switch(c){case"value":f!==I&&(Ne=!0),Z=f;break;case"defaultValue":f!==I&&(Ne=!0),b=f;break;case"multiple":f!==I&&(Ne=!0),_=f;default:f!==I&&Ie(t,n,c,f,s,I)}n=b,a=_,s=ot,Z!=null?ms(t,!!a,Z,!1):!!s!=!!a&&(n!=null?ms(t,!!a,n,!0):ms(t,!!a,a?[]:"",!1));return;case"textarea":ot=Z=null;for(b in a)if(c=a[b],a.hasOwnProperty(b)&&c!=null&&!s.hasOwnProperty(b))switch(b){case"value":break;case"children":break;default:Ie(t,n,b,null,s,c)}for(_ in s)if(c=s[_],f=a[_],s.hasOwnProperty(_)&&(c!=null||f!=null))switch(_){case"value":c!==f&&(Ne=!0),Z=c;break;case"defaultValue":c!==f&&(Ne=!0),ot=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(r(91));break;default:c!==f&&Ie(t,n,_,c,s,f)}Nm(t,Z,ot);return;case"option":for(var Lt in a)if(Z=a[Lt],a.hasOwnProperty(Lt)&&Z!=null&&!s.hasOwnProperty(Lt))switch(Lt){case"selected":t.selected=!1;break;default:Ie(t,n,Lt,null,s,Z)}for(I in s)if(Z=s[I],ot=a[I],s.hasOwnProperty(I)&&Z!==ot&&(Z!=null||ot!=null))switch(I){case"selected":Z!==ot&&(Ne=!0),t.selected=Z&&typeof Z!="function"&&typeof Z!="symbol";break;default:Ie(t,n,I,Z,s,ot)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var qt in a)Z=a[qt],a.hasOwnProperty(qt)&&Z!=null&&!s.hasOwnProperty(qt)&&Ie(t,n,qt,null,s,Z);for($ in s)if(Z=s[$],ot=a[$],s.hasOwnProperty($)&&Z!==ot&&(Z!=null||ot!=null))switch($){case"children":case"dangerouslySetInnerHTML":if(Z!=null)throw Error(r(137,n));break;default:Ie(t,n,$,Z,s,ot)}return;default:if(ff(n)){for(var de in a)Z=a[de],a.hasOwnProperty(de)&&Z!==void 0&&!s.hasOwnProperty(de)&&ch(t,n,de,void 0,s,Z);for(ut in s)Z=s[ut],ot=a[ut],!s.hasOwnProperty(ut)||Z===ot||Z===void 0&&ot===void 0||ch(t,n,ut,Z,s,ot);return}}for(var J in a)Z=a[J],a.hasOwnProperty(J)&&Z!=null&&!s.hasOwnProperty(J)&&Ie(t,n,J,null,s,Z);for(xt in s)Z=s[xt],ot=a[xt],!s.hasOwnProperty(xt)||Z===ot||Z==null&&ot==null||Ie(t,n,xt,Z,s,ot)}function Hv(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function BM(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,a=performance.getEntriesByType("resource"),s=0;s<a.length;s++){var c=a[s],f=c.transferSize,_=c.initiatorType,b=c.duration;if(f&&b&&Hv(_)){for(_=0,b=c.responseEnd,s+=1;s<a.length;s++){var I=a[s],$=I.startTime;if($>b)break;var ut=I.transferSize,xt=I.initiatorType;ut&&Hv(xt)&&(I=I.responseEnd,_+=ut*(I<b?1:(b-$)/(I-$)))}if(--s,n+=8*(f+_)/(c.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var uh=null,fh=null;function pl(t){return t.nodeType===9?t:t.ownerDocument}function kv(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Gv(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function Vv(t,n,a,s){return a=pl(a).createElement(t),a[Dt]=s,a[Bt]=n,Nn(a,t,n),Qe(a),a}function dh(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var hh=null;function IM(){var t=window.event;return t&&t.type==="popstate"?t===hh?!1:(hh=t,!0):(hh=null,!1)}var ph=typeof setTimeout=="function"?setTimeout:void 0,FM=typeof clearTimeout=="function"?clearTimeout:void 0,jv=typeof Promise=="function"?Promise:void 0,Xv=typeof requestAnimationFrame=="function"?requestAnimationFrame:ph,HM=typeof queueMicrotask=="function"?queueMicrotask:typeof jv<"u"?function(t){return jv.resolve(null).then(t).catch(kM)}:ph;function kM(t){setTimeout(function(){throw t})}function lr(t){return t==="head"}function qv(t,n){var a=n,s=0;do{var c=a.nextSibling;if(t.removeChild(a),c&&c.nodeType===8)if(a=c.data,a==="/$"||a==="/&"){if(s===0){t.removeChild(c),$s(n);return}s--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")s++;else if(a==="html")Mh(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,Mh(a);for(var f=a.firstChild;f;){var _=f.nextSibling,b=f.nodeName;f[qe]||b==="SCRIPT"||b==="STYLE"||b==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=_}}else a==="body"&&Mh(t.ownerDocument.body);a=c}while(a);$s(n)}function Wv(t,n){var a=t;t=0;do{var s=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),s&&s.nodeType===8)if(a=s.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=s}while(a)}function Yv(t,n,a){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,t.style.viewTransitionName=n,a!=null&&(t.style.viewTransitionClass=a),a=getComputedStyle(t),a.display==="inline"){if(n=t.getClientRects(),n.length===1)var s=1;else for(var c=s=0;c<n.length;c++){var f=n[c];0<f.width&&0<f.height&&s++}s===1&&(t=t.style,t.display=n.length===1?"inline-block":"block",t.marginTop="-"+a.paddingTop,t.marginBottom="-"+a.paddingBottom)}}function Zv(t,n){t=t.style,n=n.style;var a=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;t.viewTransitionName=a==null||typeof a=="boolean"?"":(""+a).trim(),a=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,t.viewTransitionClass=a==null||typeof a=="boolean"?"":(""+a).trim(),t.display==="inline-block"&&(n==null?t.display=t.margin="":(a=n.display,t.display=a==null||typeof a=="boolean"?"":a,a=n.margin,a!=null?t.margin=a:(a=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],t.marginTop=a==null||typeof a=="boolean"?"":a,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],t.marginBottom=n==null||typeof n=="boolean"?"":n)))}function GM(t,n,a){return a=a.ownerDocument.defaultView,{rect:t,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=t.bottom&&0<=t.right&&t.top<=a.innerHeight&&t.left<=a.innerWidth}}function mh(t){var n=t.getBoundingClientRect(),a=getComputedStyle(t);return GM(n,a,t)}function VM(t){return t.documentElement.clientHeight}function jM(t){this.addEventListener("load",t),this.addEventListener("error",t)}function XM(t,n,a,s,c,f,_,b,I){var $=n.nodeType===9?n:n.ownerDocument;try{var ut=$.startViewTransition({update:function(){var Z=$.defaultView,ot=Z.navigation&&Z.navigation.transition,Lt=$.fonts.status;s();var qt=[];if(Lt==="loaded"&&(VM($),$.fonts.status==="loading"&&qt.push($.fonts.ready)),Lt=qt.length,t!==null)for(var de=t.suspenseyImages,J=0,j=0;j<de.length;j++){var rt=de[j];if(!rt.complete){var yt=rt.getBoundingClientRect();if(0<yt.bottom&&0<yt.right&&yt.top<Z.innerHeight&&yt.left<Z.innerWidth){if(J+=g_(rt),J>iu){qt.length=Lt;break}rt=new Promise(jM.bind(rt)),qt.push(rt)}}}if(0<qt.length)return Z=Promise.race([Promise.all(qt),new Promise(function(Vt){return setTimeout(Vt,500)})]).then(c,c),(ot?Promise.allSettled([ot.finished,Z]):Z).then(f,f);if(c(),ot)return ot.finished.then(f,f);f()},types:a});$.__reactViewTransition=ut;var xt=[];return ut.ready.then(function(){for(var Z=$.documentElement.getAnimations({subtree:!0}),ot=0;ot<Z.length;ot++){var Lt=Z[ot],qt=Lt.effect,de=qt.pseudoElement;if(de!=null&&de.startsWith("::view-transition")){xt.push(Lt),Lt=qt.getKeyframes();for(var J=de=void 0,j=!0,rt=0;rt<Lt.length;rt++){var yt=Lt[rt],Vt=yt.width;if(de===void 0)de=Vt;else if(de!==Vt){j=!1;break}if(Vt=yt.height,J===void 0)J=Vt;else if(J!==Vt){j=!1;break}delete yt.width,delete yt.height,yt.transform==="none"&&delete yt.transform}j&&de!==void 0&&J!==void 0&&(qt.setKeyframes(Lt),j=getComputedStyle(qt.target,qt.pseudoElement),j.width!==de||j.height!==J)&&(j=Lt[0],j.width=de,j.height=J,j=Lt[Lt.length-1],j.width=de,j.height=J,qt.setKeyframes(Lt))}}_()},function(Z){$.__reactViewTransition===ut&&($.__reactViewTransition=null);try{if(typeof Z=="object"&&Z!==null)switch(Z.name){case"InvalidStateError":(Z.message==="View transition was skipped because document visibility state is hidden."||Z.message==="Skipping view transition because document visibility state has become hidden."||Z.message==="Skipping view transition because viewport size changed."||Z.message==="Transition was aborted because of invalid state")&&(Z=null)}Z!==null&&I(Z)}finally{s(),c(),_()}}),ut.finished.finally(function(){for(var Z=0;Z<xt.length;Z++)xt[Z].cancel();$.__reactViewTransition===ut&&($.__reactViewTransition=null),b()}),ut}catch{return s(),c(),_(),null}}function Zr(t,n){this._scope=document.documentElement,this._selector="::view-transition-"+t+"("+n+")"}Zr.prototype.animate=function(t,n){return n=typeof n=="number"?{duration:n}:B({},n),n.pseudoElement=this._selector,this._scope.animate(t,n)},Zr.prototype.getAnimations=function(){for(var t=this._scope,n=this._selector,a=t.getAnimations({subtree:!0}),s=[],c=0;c<a.length;c++){var f=a[c].effect;f!==null&&f.target===t&&f.pseudoElement===n&&s.push(a[c])}return s},Zr.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function Kv(t){return{name:t,group:new Zr("group",t),imagePair:new Zr("image-pair",t),old:new Zr("old",t),new:new Zr("new",t)}}function hi(t){this._fragmentFiber=t,this._observers=this._eventListeners=null}hi.prototype.addEventListener=function(t,n,a){var s=null,c=null;if(!(a!=null&&typeof a!="boolean"&&(s=a.signal||null,s!==null&&s.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var f=this._eventListeners;if(Jv(f,t,n,a)===-1){var _=this,b=n;a!=null&&typeof a!="boolean"&&a.once===!0&&(b=function(I){_.removeEventListener(t,n,a),typeof n=="function"?n.call(this,I):n.handleEvent(I)}),s!==null&&(c=_.removeEventListener.bind(_,t,n,a),s.addEventListener("abort",c,{once:!0}),c=s.removeEventListener.bind(s,"abort",c)),s=Ws(a),f.push({type:t,listener:n,optionsOrUseCapture:a,attachedListener:b,cleanup:c}),m(this._fragmentFiber.child,!1,qM,t,b,s)}this._eventListeners=f}};function qM(t,n,a,s){return S(t).addEventListener(n,a,s),!1}hi.prototype.removeEventListener=function(t,n,a){var s=this._eventListeners;if(s!==null&&(n=Jv(s,t,n,a),n!==-1)){var c=s[n];a=c.attachedListener;var f=c.cleanup;c=Ws(c.optionsOrUseCapture),m(this._fragmentFiber.child,!1,WM,t,a,c),s.splice(n,1),f!==null&&f()}};function WM(t,n,a,s){return S(t).removeEventListener(n,a,s),!1}function Ws(t){return t!=null&&typeof t!="boolean"&&(t.once===!0||t.signal instanceof AbortSignal)?{capture:t.capture,passive:t.passive}:t}function Qv(t){return t==null?"c=0":typeof t=="boolean"?"c="+(t?"1":"0"):"c="+(t.capture?"1":"0")}function Jv(t,n,a,s){if(t.length===0)return-1;s=Qv(s);for(var c=0;c<t.length;c++){var f=t[c];if(f.type===n&&f.listener===a&&Qv(f.optionsOrUseCapture)===s)return c}return-1}hi.prototype.dispatchEvent=function(t){var n=x(this._fragmentFiber);if(n===null)return!0;n=S(n);var a=this._eventListeners;if(a!==null&&0<a.length||!t.bubbles){var s=n.nodeType===9?n.createComment(""):document.createTextNode("");if(a)for(var c=0;c<a.length;c++){var f=a[c];s.addEventListener(f.type,f.attachedListener,Ws(f.optionsOrUseCapture))}if(n.appendChild(s),t=s.dispatchEvent(t),a)for(c=0;c<a.length;c++)f=a[c],s.removeEventListener(f.type,f.attachedListener,Ws(f.optionsOrUseCapture));return n.removeChild(s),t}return n.dispatchEvent(t)},hi.prototype.focus=function(t){m(this._fragmentFiber.child,!0,$v,t,void 0,void 0)};function $v(t,n){return t.tag===6?!1:(t=S(t),rE(t,n))}hi.prototype.focusLast=function(t){var n=[];m(this._fragmentFiber.child,!0,gh,n,void 0,void 0);for(var a=n.length-1;0<=a&&!$v(n[a],t);a--);};function gh(t,n){return n.push(t),!1}hi.prototype.blur=function(){var t=x(this._fragmentFiber);t!==null&&(t=S(t),t=pl(t).activeElement,t!==null&&m(this._fragmentFiber.child,!1,YM,t,void 0,void 0))};function YM(t,n){return t.tag===6?!1:(t=S(t),t===n||t.contains(n)?(n.blur(),!0):!1)}hi.prototype.observeUsing=function(t){this._observers===null&&(this._observers=new Set),this._observers.add(t),m(this._fragmentFiber.child,!1,ZM,t,void 0,void 0)};function ZM(t,n){return t.tag===6||(t=S(t),n.observe(t)),!1}hi.prototype.unobserveUsing=function(t){var n=this._observers;if(n!==null&&n.has(t)){n.delete(t),m(this._fragmentFiber.child,!1,KM,t,void 0,void 0);for(var a=n=0;a<Oi.length;a++){var s=Oi[a];s.fragmentInstance===this&&s.observer===t?t.unobserve(s.instance):Oi[n++]=s}Oi.length=n}};function KM(t,n){return t.tag===6||(t=S(t),n.unobserve(t)),!1}var Oi=[],vh=!1;function QM(t,n,a){Oi.push({fragmentInstance:t,observer:n,instance:a}),vh||(vh=!0,sE(function(){vh=!1;var s=Oi;Oi=[];for(var c=0;c<s.length;c++){var f=s[c];f.observer.unobserve(f.instance)}}))}hi.prototype.getClientRects=function(){var t=[];return m(this._fragmentFiber.child,!1,JM,t,void 0,void 0),t};function JM(t,n){if(t.tag===6){t=t.stateNode;var a=t.ownerDocument.createRange();a.selectNodeContents(t),n.push.apply(n,a.getClientRects())}else t=S(t),n.push.apply(n,t.getClientRects());return!1}hi.prototype.getRootNode=function(t){var n=x(this._fragmentFiber);return n===null?this:S(n).getRootNode(t)},hi.prototype.compareDocumentPosition=function(t){var n=x(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var a=[];m(this._fragmentFiber.child,!1,gh,a,void 0,void 0);var s=S(n);if(a.length===0){if(a=s,M(this._fragmentFiber)){t:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break t}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(a=n)}n=this._fragmentFiber;var c=s=a.compareDocumentPosition(t);return a===t?c=Node.DOCUMENT_POSITION_CONTAINS:s&Node.DOCUMENT_POSITION_CONTAINED_BY&&(a=T(n)[1],a===null?c=Node.DOCUMENT_POSITION_PRECEDING:(t=S(a).compareDocumentPosition(t),c=t===0||t&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),c|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=S(a[0]),c=S(a[a.length-1]);var f=M(this._fragmentFiber)?n.parentElement:s;if(f==null)return Node.DOCUMENT_POSITION_DISCONNECTED;s=f.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,f=f.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_CONTAINED_BY;var _=n.compareDocumentPosition(t),b=c.compareDocumentPosition(t),I=_&Node.DOCUMENT_POSITION_CONTAINED_BY||b&Node.DOCUMENT_POSITION_CONTAINED_BY;return b=s&&f&&_&Node.DOCUMENT_POSITION_FOLLOWING&&b&Node.DOCUMENT_POSITION_PRECEDING,n=s&&n===t||f&&c===t||I||b?Node.DOCUMENT_POSITION_CONTAINED_BY:!s&&n===t||!f&&c===t?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:_,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||$M(n,this._fragmentFiber,a[0],a[a.length-1],t)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function $M(t,n,a,s,c){var f=Zt(c);if(t&Node.DOCUMENT_POSITION_CONTAINED_BY){if(a=!!f)t:{for(;f!==null;){if(f.tag===7&&(f===n||f.alternate===n)){a=!0;break t}f=f.return}a=!1}return a}if(t&Node.DOCUMENT_POSITION_CONTAINS){if(f===null)return f=c.ownerDocument,c===f||c===f.documentElement||c===f.body;t:{for(f=n,n=x(n);f!==null;){if(!(f.tag!==5&&f.tag!==3&&f.tag!==27||f!==n&&f.alternate!==n)){f=!0;break t}f=f.return}f=!1}return f}return t&Node.DOCUMENT_POSITION_PRECEDING?((n=!!f)&&!(n=f===a)&&(n=H(a,f,X),n===null?n=!1:(m(n,!0,z,f,a),f=y,y=null,n=f!==null)),n):t&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!f)&&!(n=f===s)&&(n=H(s,f,X),n===null?n=!1:(m(n,!0,N,f,s),f=y,P=y=null,n=f!==null)),n):!1}function t_(t,n){var a=t.ownerDocument.createRange();a.selectNodeContents(t),t=a.getBoundingClientRect(),window.scrollTo(window.scrollX+t.left,n?window.scrollY+t.top:window.scrollY+t.bottom-window.innerHeight)}hi.prototype.scrollIntoView=function(t){if(typeof t=="object")throw Error(r(566));var n=[];m(this._fragmentFiber.child,!1,gh,n,void 0,void 0);var a=t!==!1;if(n.length===0){var s=T(this._fragmentFiber);if(s=a?s[1]||s[0]||x(this._fragmentFiber):s[0]||s[1],s===null)return;if(s.tag===6){t=S(s),t_(t,a);return}if(s=S(s),s.nodeType!==9){if(s.nodeType===11){a="host"in s?s.host:null,a!==null&&a.scrollIntoView(t);return}s.scrollIntoView(t)}}for(s=a?n.length-1:0;s!==(a?-1:n.length);){var c=n[s];c.tag===6?(c=S(c),t_(c,a)):S(c).scrollIntoView(t),s+=a?-1:1}};function tE(t,n){return t=S(t),e_(t,n),!1}function e_(t,n){t.reactFragments==null&&(t.reactFragments=new Set),t.reactFragments.add(n)}function n_(t,n){var a=n._eventListeners;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s];t.addEventListener(c.type,c.attachedListener,Ws(c.optionsOrUseCapture))}t.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){for(var _=0,b=0;b<Oi.length;b++){var I=Oi[b];(I.fragmentInstance!==n||I.observer!==f||I.instance!==t)&&(Oi[_++]=I)}Oi.length=_,f.observe(t)}),e_(t,n))}function eE(t,n){var a=n._eventListeners;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s];t.removeEventListener(c.type,c.attachedListener,Ws(c.optionsOrUseCapture))}t.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){typeof f.rootMargin=="string"?QM(n,f,t):f.unobserve(t)}),t.reactFragments!=null&&t.reactFragments.delete(n))}function _h(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":_h(a),ye(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function nE(t,n,a,s){for(;t.nodeType===1;){var c=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!s&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(s){if(!t[qe])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(f=t.getAttribute("rel"),f==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(f!==c.rel||t.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||t.getAttribute("title")!==(c.title==null?null:c.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(f=t.getAttribute("src"),(f!==(c.src==null?null:c.src)||t.getAttribute("type")!==(c.type==null?null:c.type)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&f&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var f=c.name==null?null:""+c.name;if(c.type==="hidden"&&t.getAttribute("name")===f)return t}else return t;if(t=Ei(t.nextSibling),t===null)break}return null}function iE(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=Ei(t.nextSibling),t===null))return null;return t}function i_(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=Ei(t.nextSibling),t===null))return null;return t}function yh(t){return t.data==="$?"||t.data==="$~"}function xh(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function aE(t,n){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||a.readyState!=="loading")n();else{var s=function(){n(),a.removeEventListener("DOMContentLoaded",s)};a.addEventListener("DOMContentLoaded",s),t._reactRetry=s}}function Ei(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var Sh=null;function a_(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(n===0)return Ei(t.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}t=t.nextSibling}return null}function r_(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return t;n--}else a!=="/$"&&a!=="/&"||n++}t=t.previousSibling}return null}function rE(t,n){function a(){s=!0}if(t.ownerDocument.activeElement===t)return!0;var s=!1;try{t.ownerDocument.addEventListener("focus",a,!0),(t.focus||HTMLElement.prototype.focus).call(t,n)}finally{t.ownerDocument.removeEventListener("focus",a,!0)}return s}function sE(t){Xv(function(){Xv(function(n){return t(n)})})}function s_(t,n,a){switch(n=pl(a),t){case"html":if(t=n.documentElement,!t)throw Error(r(452));return t;case"head":if(t=n.head,!t)throw Error(r(453));return t;case"body":if(t=n.body,!t)throw Error(r(454));return t;default:throw Error(r(451))}}function o_(t,n,a){for(var s in a){var c=a[s];a.hasOwnProperty(s)&&c!=null&&Ie(t,n,s,null,OM,c)}a.dangerouslySetInnerHTML!=null&&(t.textContent=""),t.onclick===qi&&(t.onclick=null),ye(t)}function Mh(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);ye(t)}var bi=new Map,l_=new Set;function ml(t){if(typeof t.getRootNode=="function"){var n=t.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return t.nodeType===9?t:t.ownerDocument}var wa=zt.d;zt.d={f:oE,r:lE,D:cE,C:uE,L:fE,m:dE,X:pE,S:hE,M:mE};function oE(){var t=wa.f(),n=Yc();return t||n}function lE(t){var n=$e(t);n!==null&&n.tag===5&&n.type==="form"?u0(n):wa.r(t)}var Ys=typeof document>"u"?null:document;function c_(t,n,a){var s=Ys;if(s&&typeof n=="string"&&n){var c=gi(n);c='link[rel="'+t+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),l_.has(c)||(l_.add(c),t={rel:t,crossOrigin:a,href:n},s.querySelector(c)===null&&(n=s.createElement("link"),Nn(n,"link",t),Qe(n),s.head.appendChild(n)))}}function cE(t){wa.D(t),c_("dns-prefetch",t,null)}function uE(t,n){wa.C(t,n),c_("preconnect",t,n)}function fE(t,n,a){wa.L(t,n,a);var s=Ys;if(s&&t&&n){var c='link[rel="preload"][as="'+gi(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+gi(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+gi(a.imageSizes)+'"]')):c+='[href="'+gi(t)+'"]';var f=c;switch(n){case"style":f=Zs(t);break;case"script":f=Ks(t)}if(!(bi.has(f)||(t=B({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),bi.set(f,t),s.querySelector(c)!==null||n==="style"&&s.querySelector(gl(f))||n==="script"&&s.querySelector(vl(f))))){var _=s.createElement("link");Nn(_,"link",t),n==="style"&&(_[Ve]=!0,_.onload=_.onerror=function(){In(_)}),Qe(_),s.head.appendChild(_)}}}function dE(t,n){wa.m(t,n);var a=Ys;if(a&&t){var s=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+gi(s)+'"][href="'+gi(t)+'"]',f=c;switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Ks(t)}if(!bi.has(f)&&(t=B({rel:"modulepreload",href:t},n),bi.set(f,t),a.querySelector(c)===null)){switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(vl(f)))return}s=a.createElement("link"),Nn(s,"link",t),Qe(s),a.head.appendChild(s)}}}function hE(t,n,a){wa.S(t,n,a);var s=Ys;if(s&&t){var c=xn(s).hoistableStyles,f=Zs(t);n=n||"default";var _=c.get(f);if(!_){var b={loading:0,preload:null};if(_=s.querySelector(gl(f)))b.loading=5;else{t=B({rel:"stylesheet",href:t,"data-precedence":n},a),(a=bi.get(f))&&Eh(t,a);var I=_=s.createElement("link");Qe(I),Nn(I,"link",t),I._p=new Promise(function($,ut){I.onload=$,I.onerror=ut}),I.addEventListener("load",function(){b.loading|=1}),I.addEventListener("error",function(){b.loading|=2}),b.loading|=4,eu(_,n,s)}_={type:"stylesheet",instance:_,count:1,state:b},c.set(f,_)}}}function pE(t,n){wa.X(t,n);var a=Ys;if(a&&t){var s=xn(a).hoistableScripts,c=Ks(t),f=s.get(c);f||(f=a.querySelector(vl(c)),f||(t=B({src:t,async:!0},n),(n=bi.get(c))&&bh(t,n),f=a.createElement("script"),Qe(f),Nn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function mE(t,n){wa.M(t,n);var a=Ys;if(a&&t){var s=xn(a).hoistableScripts,c=Ks(t),f=s.get(c);f||(f=a.querySelector(vl(c)),f||(t=B({src:t,async:!0,type:"module"},n),(n=bi.get(c))&&bh(t,n),f=a.createElement("script"),Qe(f),Nn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function u_(t,n,a,s){var c=(c=O.current)?ml(c):null;if(!c)throw Error(r(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(a=Zs(a.href),n=xn(c).hoistableStyles,s=n.get(a),s||(s={type:"style",instance:null,count:0,state:null},n.set(a,s)),s):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=Zs(a.href);var f=xn(c).hoistableStyles,_=f.get(t);if(_||(c=c.ownerDocument||c,_={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(t,_),(f=c.querySelector(gl(t)))?f._p||(_.instance=f,_.state.loading=5):(f=bi.get(t),f||(f={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},bi.set(t,f)),gE(c,t,f,_.state))),n&&s===null)throw Error(r(528,""));return _}if(n&&s!==null)throw Error(r(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(a=Ks(a),n=xn(c).hoistableScripts,s=n.get(a),s||(s={type:"script",instance:null,count:0,state:null},n.set(a,s)),s):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,t))}}function Zs(t){return'href="'+gi(t)+'"'}function gl(t){return'link[rel="stylesheet"]['+t+"]"}function f_(t){return B({},t,{"data-precedence":t.precedence,precedence:null})}function gE(t,n,a,s){if(n=t.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[Ve]!==!0){s.loading=1;return}}else n=t.createElement("link"),n[Ve]=!0,n.onload=n.onerror=In.bind(null,n),Nn(n,"link",a),Qe(n),t.head.appendChild(n);s.preload=n,n.addEventListener("load",function(){return s.loading|=1}),n.addEventListener("error",function(){return s.loading|=2})}function Ks(t){return'[src="'+gi(t)+'"]'}function vl(t){return"script[async]"+t}function d_(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var s=t.querySelector('style[data-href~="'+gi(a.href)+'"]');if(s)return n.instance=s,Qe(s),s;var c=B({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return s=(t.ownerDocument||t).createElement("style"),Qe(s),Nn(s,"style",c),eu(s,a.precedence,t),n.instance=s;case"stylesheet":c=Zs(a.href);var f=t.querySelector(gl(c));if(f)return n.state.loading|=4,n.instance=f,Qe(f),f;s=f_(a),(c=bi.get(c))&&Eh(s,c),f=(t.ownerDocument||t).createElement("link"),Qe(f);var _=f;return _._p=new Promise(function(b,I){_.onload=b,_.onerror=I}),Nn(f,"link",s),n.state.loading|=4,eu(f,a.precedence,t),n.instance=f;case"script":return f=Ks(a.src),(c=t.querySelector(vl(f)))?(n.instance=c,Qe(c),c):(s=a,(c=bi.get(f))&&(s=B({},a),bh(s,c)),t=t.ownerDocument||t,c=t.createElement("script"),Qe(c),Nn(c,"link",s),t.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(r(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(s=n.instance,n.state.loading|=4,eu(s,a.precedence,t));return n.instance}function eu(t,n,a){for(var s=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=s.length?s[s.length-1]:null,f=c,_=0;_<s.length;_++){var b=s[_];if(b.dataset.precedence===n)f=b;else if(f!==c)break}f?f.parentNode.insertBefore(t,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function Eh(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function bh(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var nu=null;function h_(t,n,a){if(nu===null){var s=new Map,c=nu=new Map;c.set(a,s)}else c=nu,s=c.get(a),s||(s=new Map,c.set(a,s));if(s.has(t))return s;for(s.set(t,null),a=a.getElementsByTagName(t),c=0;c<a.length;c++){var f=a[c];if(!(f[qe]||f[Dt]||t==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var _=f.getAttribute(n)||"";_=t+_;var b=s.get(_);b?b.push(f):s.set(_,[f])}}return s}function Th(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function vE(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return t=n.disabled,typeof n.precedence=="string"&&t==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function p_(t,n){return t==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function m_(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function g_(t){return(t.width||100)*(t.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function v_(t,n){typeof n.decode=="function"&&(t.imgCount++,n.complete||(t.imgBytes+=g_(n),t.suspenseyImages.push(n)),t=xE.bind(t),n.decode().then(t,t))}function _E(t,n,a,s){if(a.type==="stylesheet"&&(typeof s.media!="string"||matchMedia(s.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var c=Zs(s.href),f=n.querySelector(gl(c));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=_l.bind(t),n.then(t,t)),a.state.loading|=4,a.instance=f,Qe(f);return}f=n.ownerDocument||n,s=f_(s),(c=bi.get(c))&&Eh(s,c),f=f.createElement("link"),Qe(f);var _=f;_._p=new Promise(function(b,I){_.onload=b,_.onerror=I}),Nn(f,"link",s),a.instance=f}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=_l.bind(t),n.addEventListener("load",a),n.addEventListener("error",a))}}var iu=0;function yE(t,n){return t.stylesheets&&t.count===0&&ru(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var s=setTimeout(function(){if(t.stylesheets&&ru(t,t.stylesheets),t.unsuspend){var f=t.unsuspend;t.unsuspend=null,f()}},6e4+n);0<t.imgBytes&&iu===0&&(iu=62500*BM());var c=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&ru(t,t.stylesheets),t.unsuspend)){var f=t.unsuspend;t.unsuspend=null,f()}},(t.imgBytes>iu?50:800)+n);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(s),clearTimeout(c)}}:null}function __(t){if(t.count===0&&(t.imgCount===0||!t.waitingForImages)){if(t.stylesheets)ru(t,t.stylesheets);else if(t.unsuspend){var n=t.unsuspend;t.unsuspend=null,n()}}}function _l(){this.count--,__(this)}function xE(){this.imgCount--,__(this)}var au=null;function ru(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,au=new Map,n.forEach(SE,t),au=null,_l.call(t))}function SE(t,n){if(!(n.state.loading&4)){var a=au.get(t);if(a)var s=a.get(null);else{a=new Map,au.set(t,a);for(var c=t.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<c.length;f++){var _=c[f];(_.nodeName==="LINK"||_.getAttribute("media")!=="not all")&&(a.set(_.dataset.precedence,_),s=_)}s&&a.set(null,s)}c=n.instance,_=c.getAttribute("data-precedence"),f=a.get(_)||s,f===s&&a.set(null,c),a.set(_,c),this.count++,s=_l.bind(this),c.addEventListener("load",s),c.addEventListener("error",s),f?f.parentNode.insertBefore(c,f.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(c,t.firstChild)),n.state.loading|=4}}var Qs={$$typeof:st,Provider:null,Consumer:null,_currentValue:te,_currentValue2:te,_threadCount:0};function ME(t,n,a,s,c,f,_,b,I){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=zo(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=zo(0),this.hiddenUpdates=zo(null),this.identifierPrefix=s,this.onUncaughtError=c,this.onCaughtError=f,this.onRecoverableError=_,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=I,this.transitionTypes=null,this.incompleteTransitions=new Map}function y_(t,n,a,s,c,f,_,b,I,$,ut,xt){return t=new ME(t,n,a,_,I,$,ut,xt,b),n=1,f===!0&&(n|=24),f=Zn(3,null,null,n),t.current=f,f.stateNode=t,n=Hf(),n.refCount++,t.pooledCache=n,n.refCount++,f.memoizedState={element:s,isDehydrated:a,cache:n},jf(f),t}function x_(t){return t?(t=Es,t):Es}function S_(t,n,a,s,c,f){c=x_(c),s.context===null?s.context=c:s.pendingContext=c,s=Ka(n),s.payload={element:a},f=f===void 0?null:f,f!==null&&(s.callback=f),a=Qa(t,s,n),a!==null&&($n(a,t,n),Zo(a,t,n))}function M_(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function wh(t,n){M_(t,n),(t=t.alternate)&&M_(t,n)}function E_(t){if(t.tag===13||t.tag===31){var n=Ur(t,67108864);n!==null&&$n(n,t,67108864),wh(t,67108864)}}function b_(t){if(t.tag===13||t.tag===31){var n=di();n=ht(n);var a=Ur(t,n);a!==null&&$n(a,t,n),wh(t,n)}}var Js=!0;function EE(t,n,a,s){var c=bt.T;bt.T=null;var f=zt.p;try{zt.p=2,Ah(t,n,a,s)}finally{zt.p=f,bt.T=c}}function bE(t,n,a,s){var c=bt.T;bt.T=null;var f=zt.p;try{zt.p=8,Ah(t,n,a,s)}finally{zt.p=f,bt.T=c}}function Ah(t,n,a,s){if(Js){var c=Rh(s);if(c===null)lh(t,n,s,su,a),w_(t,s);else if(wE(c,t,n,a,s))s.stopPropagation();else if(w_(t,s),n&4&&-1<TE.indexOf(t)){for(;c!==null;){var f=$e(c);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var _=Xi(f.pendingLanes);if(_!==0){var b=f;for(b.pendingLanes|=2,b.entangledLanes|=2;_;){var I=1<<31-Bn(_);b.entanglements[1]|=I,_&=~I}na(f),(ze&6)===0&&(Xc=W()+500,fl(0))}}break;case 31:case 13:b=Ur(f,2),b!==null&&$n(b,f,2),Yc(),wh(f,2)}if(f=Rh(s),f===null&&lh(t,n,s,su,a),f===c)break;c=f}c!==null&&s.stopPropagation()}else lh(t,n,s,null,a)}}function Rh(t){return t=hf(t),Ch(t)}var su=null;function Ch(t){if(su=null,t=Zt(t),t!==null){var n=u(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=h(n),t!==null)return t;t=null}else if(a===31){if(t=d(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return su=t,null}function T_(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Ft()){case gt:return 2;case St:return 8;case Ht:case Gt:return 32;case ce:return 268435456;default:return 32}default:return 32}}var Dh=!1,cr=null,ur=null,fr=null,yl=new Map,xl=new Map,dr=[],TE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function w_(t,n){switch(t){case"focusin":case"focusout":cr=null;break;case"dragenter":case"dragleave":ur=null;break;case"mouseover":case"mouseout":fr=null;break;case"pointerover":case"pointerout":yl.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":xl.delete(n.pointerId)}}function Sl(t,n,a,s,c,f){return t===null||t.nativeEvent!==f?(t={blockedOn:n,domEventName:a,eventSystemFlags:s,nativeEvent:f,targetContainers:[c]},n!==null&&(n=$e(n),n!==null&&E_(n)),t):(t.eventSystemFlags|=s,n=t.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),t)}function wE(t,n,a,s,c){switch(n){case"focusin":return cr=Sl(cr,t,n,a,s,c),!0;case"dragenter":return ur=Sl(ur,t,n,a,s,c),!0;case"mouseover":return fr=Sl(fr,t,n,a,s,c),!0;case"pointerover":var f=c.pointerId;return yl.set(f,Sl(yl.get(f)||null,t,n,a,s,c)),!0;case"gotpointercapture":return f=c.pointerId,xl.set(f,Sl(xl.get(f)||null,t,n,a,s,c)),!0}return!1}function A_(t){var n=Zt(t.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){t.blockedOn=n,Mt(t.priority,function(){b_(a)});return}}else if(n===31){if(n=d(a),n!==null){t.blockedOn=n,Mt(t.priority,function(){b_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function ou(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=Rh(t.nativeEvent);if(a===null){a=t.nativeEvent;var s=new a.constructor(a.type,a);df=s,a.target.dispatchEvent(s),df=null}else return n=$e(a),n!==null&&E_(n),t.blockedOn=a,!1;n.shift()}return!0}function R_(t,n,a){ou(t)&&a.delete(n)}function AE(){Dh=!1,cr!==null&&ou(cr)&&(cr=null),ur!==null&&ou(ur)&&(ur=null),fr!==null&&ou(fr)&&(fr=null),yl.forEach(R_),xl.forEach(R_)}function lu(t,n){t.blockedOn===n&&(t.blockedOn=null,Dh||(Dh=!0,o.unstable_scheduleCallback(o.unstable_NormalPriority,AE)))}var cu=null;function C_(t){cu!==t&&(cu=t,o.unstable_scheduleCallback(o.unstable_NormalPriority,function(){cu===t&&(cu=null);for(var n=0;n<t.length;n+=3){var a=t[n],s=t[n+1],c=t[n+2];if(typeof s!="function"){if(Ch(s||a)===null)continue;break}var f=$e(a);f!==null&&(t.splice(n,3),n-=3,fd(f,{pending:!0,data:c,method:a.method,action:s},s,c))}}))}function $s(t){function n(I){return lu(I,t)}cr!==null&&lu(cr,t),ur!==null&&lu(ur,t),fr!==null&&lu(fr,t),yl.forEach(n),xl.forEach(n);for(var a=0;a<dr.length;a++){var s=dr[a];s.blockedOn===t&&(s.blockedOn=null)}for(;0<dr.length&&(a=dr[0],a.blockedOn===null);)A_(a),a.blockedOn===null&&dr.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(s=0;s<a.length;s+=3){var c=a[s],f=a[s+1],_=c[Bt]||null;if(typeof f=="function")_||C_(a);else if(_){var b=null;if(f&&f.hasAttribute("formAction")){if(c=f,_=f[Bt]||null)b=_.formAction;else if(Ch(c)!==null)continue}else b=_.action;typeof b=="function"?a[s+1]=b:(a.splice(s,3),s-=3),C_(a)}}}function D_(){function t(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(_){return c=_})},focusReset:"manual",scroll:"manual"})}function n(){c!==null&&(c(),c=null),s||setTimeout(a,20)}function a(){if(!s&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var s=!1,c=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){s=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),c!==null&&(c(),c=null)}}}function Nh(t){this._internalRoot=t}uu.prototype.render=Nh.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(r(409));var a=n.current,s=di();S_(a,s,t,n,null,null)},uu.prototype.unmount=Nh.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;S_(t.current,2,null,t,null,null),Yc(),n[ee]=null}};function uu(t){this._internalRoot=t}uu.prototype.unstable_scheduleHydration=function(t){if(t){var n=at();t={blockedOn:null,target:t,priority:n};for(var a=0;a<dr.length&&n!==0&&n<dr[a].priority;a++);dr.splice(a,0,t),a===0&&A_(t)}};var N_=e.version;if(N_!=="19.3.1")throw Error(r(527,N_,"19.3.1"));zt.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(r(188)):(t=Object.keys(t).join(","),Error(r(268,t)));return t=g(n),t=t!==null?v(t):null,t=t===null?null:t.stateNode,t};var RE={bundleType:0,version:"19.3.1",rendererPackageName:"react-dom",currentDispatcherRef:bt,reconcilerVersion:"19.3.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var fu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!fu.isDisabled&&fu.supportsFiber)try{we=fu.inject(RE),Ke=fu}catch{}}return El.createRoot=function(t,n){if(!l(t))throw Error(r(299));var a=!1,s="",c=x0,f=S0,_=M0;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(_=n.onRecoverableError)),n=y_(t,1,!1,null,null,a,s,null,c,f,_,D_),t[ee]=n.current,oh(t),new Nh(n)},El.hydrateRoot=function(t,n,a){if(!l(t))throw Error(r(299));var s=!1,c="",f=x0,_=S0,b=M0,I=null;return a!=null&&(a.unstable_strictMode===!0&&(s=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(_=a.onCaughtError),a.onRecoverableError!==void 0&&(b=a.onRecoverableError),a.formState!==void 0&&(I=a.formState)),n=y_(t,1,!0,n,a??null,s,c,I,f,_,b,D_),n.context=x_(null),a=n.current,s=di(),s=ht(s),c=Ka(s),c.callback=null,Qa(a,c,s),a=s,n.current.lanes=a,Cr(n,a),na(n),t[ee]=n.current,oh(t),new uu(n)},El.version="19.3.1",El}var k_;function kE(){if(k_)return Lh.exports;k_=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),Lh.exports=HE(),Lh.exports}var GE=kE();const VE=ox(GE),lx={np:"fd",naprzod:"fd",naprzód:"fd",fd:"fd",forward:"fd",ws:"bk",wstecz:"bk",bk:"bk",back:"bk",pw:"rt",prawo:"rt",rt:"rt",right:"rt",lw:"lt",lewo:"lt",lt:"lt",left:"lt",pod:"pu",podnies:"pu",podnieś:"pu",pu:"pu",penup:"pu",opu:"pd",opusc:"pd",opuść:"pd",pd:"pd",pendown:"pd",kolor:"color",color:"color",grubosc:"width",grubość:"width",width:"width",powtorz:"repeat",powtórz:"repeat",repeat:"repeat",niech:"let",let:"let",jeśli:"if",jesli:"if",if:"if",jeżeli:"ifelse",jezeli:"ifelse",ifelse:"ifelse",stop:"stop",dom:"home",home:"home",czyść:"cs",czysc:"cs",cs:"cs",clearscreen:"cs",gora:"pitchup",góra:"pitchup",pitchup:"pitchup",dol:"pitchdown",dół:"pitchdown",pitchdown:"pitchdown",pp:"rollright",przechylprawo:"rollright",rr:"rollright",rollright:"rollright",pl:"rollleft",przechyllewo:"rollleft",rl:"rollleft",rollleft:"rollleft"},Wu=new Set(["oto","to"]),Yu=new Set(["już","juz","end"]),jE=new Set(["nrpowt","repcount"]);function cx(o){return lx[o]??null}function vo(o){return o in lx||Wu.has(o)||Yu.has(o)||jE.has(o)||o==="ma:"}function XE(o){return o==="pitchup"||o==="pitchdown"||o==="rollright"||o==="rollleft"}const Yn={MAX_SOURCE_CHARS:5e4,MAX_TOKENS:1e4,MAX_BRACKET_DEPTH:32,MAX_ACTIVE_FRAMES:32,MAX_OPERATIONS:1e4,MAX_SEGMENTS:1e4,MAX_COORD:1e5};function G_(o){return o===" "||o==="	"||o==="\r"||o===`
`}function to(o){return o>="0"&&o<="9"}function Ih(o){return/[\p{L}_]/u.test(o)}function V_(o){return/[\p{L}\p{N}_]/u.test(o)}function qE(o){if(o.length>Yn.MAX_SOURCE_CHARS)return{tokens:[],error:{message:"Program przekracza limit 50 000 znaków.",line:1,column:1}};const e=[];let i=0,r=1,l=1;const u=o.length,h=d=>e.length>=Yn.MAX_TOKENS?{message:"Program przekracza limit 10 000 tokenów.",line:d.line,column:d.column}:(e.push(d),null);for(;i<u;){const d=o[i];if(d===`
`){i++,r++,l=1;continue}if(d===" "||d==="	"||d==="\r"){i++,l++;continue}if(d===";"){for(;i<u&&o[i]!==`
`;)i++,l++;continue}const p=r,g=l;if(d==='"'){i++,l++;let v="",m=!1;for(;i<u&&o[i]!==`
`;){if(o[i]==='"'){m=!0,i++,l++;break}v+=o[i],i++,l++}if(!m)return{tokens:e,error:{message:"Niezamknięty literał koloru.",line:p,column:g}};if(!/^#[0-9a-fA-F]{6}$/.test(v))return{tokens:e,error:{message:"Nieprawidłowy literał koloru (oczekiwano formatu „#rrggbb”).",line:p,column:g}};const x=h({type:"color",value:v.toLowerCase(),lower:v.toLowerCase(),line:p,column:g,spaceBefore:!1,spaceAfter:!1});if(x)return{tokens:e,error:x};continue}if(d===":"){if(i++,l++,i>=u||!Ih(o[i]))return{tokens:e,error:{message:"Po dwukropku oczekiwano nazwy zmiennej lub parametru.",line:p,column:g}};let v="";for(;i<u&&V_(o[i]);)v+=o[i],i++,l++;const m=h({type:"legacyVar",value:v,lower:v.toLowerCase(),line:p,column:g,spaceBefore:!1,spaceAfter:!1});if(m)return{tokens:e,error:m};continue}if(to(d)||d==="."){let v="";if(d==="."){if(i+1>=u||!to(o[i+1]))return{tokens:e,error:{message:"Nieoczekiwana kropka (oczekiwano cyfry po kropce).",line:p,column:g}};for(v+=".",i++,l++;i<u&&to(o[i]);)v+=o[i],i++,l++}else{for(;i<u&&to(o[i]);)v+=o[i],i++,l++;if(i<u&&o[i]==="."){if(i+1>=u||!to(o[i+1]))return{tokens:e,error:{message:"Nieprawidłowy literał liczbowy.",line:p,column:g}};for(v+=".",i++,l++;i<u&&to(o[i]);)v+=o[i],i++,l++}}if(i<u&&(Ih(o[i])||o[i]==="."))return{tokens:e,error:{message:"Nieprawidłowy literał liczbowy.",line:p,column:g}};const m=h({type:"number",value:v,lower:v,line:p,column:g,spaceBefore:!1,spaceAfter:!1});if(m)return{tokens:e,error:m};continue}if(d==="+"||d==="-"||d==="*"||d==="/"){const v=i===0||G_(o[i-1]);i++,l++;const m=i>=u||G_(o[i])||o[i]===";",x=h({type:"op",value:d,lower:d,line:p,column:g,spaceBefore:v,spaceAfter:m});if(x)return{tokens:e,error:x};continue}if(d==="<"||d===">"||d==="="){let v=d;i++,l++,(d==="<"&&i<u&&(o[i]==="="||o[i]===">")||d===">"&&i<u&&o[i]==="=")&&(v+=o[i],i++,l++);const m=h({type:"cmp",value:v,lower:v,line:p,column:g,spaceBefore:!1,spaceAfter:!1});if(m)return{tokens:e,error:m};continue}if(d==="["||d==="]"||d==="("||d===")"||d===","){i++,l++;const m=h({type:{"[":"lbracket","]":"rbracket","(":"lparen",")":"rparen",",":"comma"}[d],value:d,lower:d,line:p,column:g,spaceBefore:!1,spaceAfter:!1});if(m)return{tokens:e,error:m};continue}if(Ih(d)){let v="";for(;i<u&&V_(o[i]);)v+=o[i],i++,l++;v.toLowerCase()==="ma"&&i<u&&o[i]===":"&&(v+=":",i++,l++);const m=h({type:"ident",value:v,lower:v.toLowerCase(),line:p,column:g,spaceBefore:!1,spaceAfter:!1});if(m)return{tokens:e,error:m};continue}return{tokens:e,error:{message:`Nieoczekiwany znak „${d}”.`,line:p,column:g}}}return e.push({type:"eof",value:"",lower:"",line:r,column:l,spaceBefore:!0,spaceAfter:!0}),{tokens:e,error:null}}class ae extends Error{constructor(i,r,l){super(i);ti(this,"logoError");this.logoError={message:i,line:r,column:l}}}function WE(o){const e=[],i=[],r=new Set;let l=0,u=0;const h=o.length-1,d=p=>p===0?!0:o[p].line>o[p-1].line;for(;l<h;){const p=o[l];if(p.type==="lbracket"){u++,e.push(p),l++;continue}if(p.type==="rbracket"){u>0&&u--,e.push(p),l++;continue}if(p.type==="ident"&&Yu.has(p.lower))throw new ae(`Nieoczekiwane „${p.value}” poza definicją procedury.`,p.line,p.column);if(p.type==="ident"&&Wu.has(p.lower)){if(u>0)throw new ae("Definicja procedury nie może znajdować się wewnątrz nawiasów „[ ... ]”.",p.line,p.column);if(!d(l))throw new ae("Definicja procedury „oto” musi zaczynać się w nowym wierszu.",p.line,p.column);const g=p.line;if(l++,l>=h||o[l].line!==g)throw new ae("Po „oto” oczekiwano nazwy procedury.",p.line,p.column);const v=o[l];if(v.type!=="ident")throw new ae("Oczekiwano nazwy procedury.",v.line,v.column);if(vo(v.lower))throw new ae(`Nazwa „${v.value}” jest słowem kluczowym i nie może być nazwą procedury.`,v.line,v.column);if(r.has(v.lower))throw new ae(`Procedura „${v.value}” została już zdefiniowana.`,v.line,v.column);r.add(v.lower),l++;const m=[],x=new Set;if(l<h&&o[l].line===g){const S=o[l];if(S.type==="ident"&&S.lower==="ma:"){if(l++,l>=h||o[l].line!==g)throw new ae("Po „ma:” oczekiwano listy parametrów.",S.line,S.column);for(;;){const y=o[l];if(y.line!==g)throw new ae("Po przecinku oczekiwano nazwy parametru.",o[l-1].line,o[l-1].column);if(y.type!=="ident"||vo(y.lower))throw new ae(`Nieprawidłowa nazwa parametru „${y.value}”.`,y.line,y.column);if(x.has(y.lower))throw new ae(`Parametr „${y.value}” powtarza się w nagłówku procedury.`,y.line,y.column);if(x.add(y.lower),m.push(y.lower),l++,l>=h||o[l].line!==g)break;if(o[l].type==="comma"){if(l++,l>=h||o[l].line!==g)throw new ae("Po przecinku oczekiwano kolejnego parametru.",o[l-1].line,o[l-1].column);continue}throw new ae(`Nieoczekiwany token „${o[l].value}” w nagłówku procedury (oczekiwano przecinka).`,o[l].line,o[l].column)}}else if(S.type==="legacyVar")for(;l<h&&o[l].line===g;){const y=o[l];if(y.type!=="legacyVar")throw new ae(`Nieoczekiwany token „${y.value}” w nagłówku procedury.`,y.line,y.column);if(vo(y.lower))throw new ae(`Nieprawidłowa nazwa parametru „${y.value}”.`,y.line,y.column);if(x.has(y.lower))throw new ae(`Parametr „${y.value}” powtarza się w nagłówku procedury.`,y.line,y.column);x.add(y.lower),m.push(y.lower),l++}else throw new ae(`Nieoczekiwany token „${S.value}” w nagłówku procedury (użyj „ma:” lub „:parametr”).`,S.line,S.column)}const M=[];let T=!1;for(;l<h;){const S=o[l];if(S.type==="ident"&&Wu.has(S.lower)&&d(l))throw new ae("Nie można definiować procedury wewnątrz innej procedury.",S.line,S.column);if(S.type==="ident"&&Yu.has(S.lower)){if(!(d(l)&&(l+1>=h||o[l+1].line>S.line)))throw new ae(`Słowo „${S.value}” musi stać samo w osobnym wierszu.`,S.line,S.column);T=!0,l++;break}M.push(S),l++}if(!T)throw new ae(`Brak „już” zamykającego definicję procedury „${v.value}”.`,p.line,p.column);const w=M.length>0?M[M.length-1].line:p.line;M.push({type:"eof",value:"",lower:"",line:w+1,column:1,spaceBefore:!0,spaceAfter:!0}),i.push({name:v.lower,params:m,tokens:M,line:p.line,column:p.column});continue}e.push(p),l++}return e.push(o[o.length-1]),{topTokens:e,rawProcs:i}}class j_{constructor(e,i,r){ti(this,"pos",0);ti(this,"bracketDepth",0);this.tokens=e,this.procMap=i,this.mode=r}peek(){return this.tokens[this.pos]}advance(){const e=this.tokens[this.pos];return this.pos<this.tokens.length-1&&this.pos++,e}parseBlockBody(e){const i=[];for(;;){const r=this.peek();if(r.type==="eof"){if(e)throw new ae("Niezamknięty nawias kwadratowy „[”.",r.line,r.column);break}if(r.type==="rbracket"){if(!e)throw new ae("Nieoczekiwany nawias „]”.",r.line,r.column);break}i.push(this.parseStatement())}return i}parseBracketedBody(e){const i=this.peek();if(i.type==="eof")throw new ae("Oczekiwano nawiasu „[” otwierającego blok poleceń.",e.line,e.column);if(i.type!=="lbracket")throw new ae("Oczekiwano nawiasu „[” otwierającego blok poleceń.",i.line,i.column);if(this.advance(),this.bracketDepth++,this.bracketDepth>Yn.MAX_BRACKET_DEPTH)throw new ae(`Przekroczono maksymalną głębokość zagnieżdżenia nawiasów (${Yn.MAX_BRACKET_DEPTH}).`,i.line,i.column);let r;try{r=this.parseBlockBody(!0)}catch(u){throw u instanceof ae&&this.peek().type==="eof"?new ae("Niezamknięty nawias kwadratowy „[”.",i.line,i.column):u}if(this.peek().type!=="rbracket")throw new ae("Niezamknięty nawias kwadratowy „[”.",i.line,i.column);return this.advance(),this.bracketDepth--,r}parseStatement(){const e=this.peek();if(e.type!=="ident")throw new ae(`Nieoczekiwany token „${e.value}” — oczekiwano polecenia.`,e.line,e.column);const i=cx(e.lower);if(i!==null){if(this.advance(),this.mode==="2d"&&XE(i))throw new ae(`Polecenie „${e.value}” działa tylko w trybie 3D.`,e.line,e.column);switch(i){case"fd":return{kind:"move",dir:1,dist:this.parseExpr(e),line:e.line,column:e.column};case"bk":return{kind:"move",dir:-1,dist:this.parseExpr(e),line:e.line,column:e.column};case"rt":return{kind:"turn",dir:1,angle:this.parseExpr(e),line:e.line,column:e.column};case"lt":return{kind:"turn",dir:-1,angle:this.parseExpr(e),line:e.line,column:e.column};case"pitchup":return{kind:"pitch",dir:1,angle:this.parseExpr(e),line:e.line,column:e.column};case"pitchdown":return{kind:"pitch",dir:-1,angle:this.parseExpr(e),line:e.line,column:e.column};case"rollright":return{kind:"roll",dir:1,angle:this.parseExpr(e),line:e.line,column:e.column};case"rollleft":return{kind:"roll",dir:-1,angle:this.parseExpr(e),line:e.line,column:e.column};case"pu":return{kind:"pen",down:!1,line:e.line,column:e.column};case"pd":return{kind:"pen",down:!0,line:e.line,column:e.column};case"home":return{kind:"home",line:e.line,column:e.column};case"cs":return{kind:"clear",line:e.line,column:e.column};case"stop":return{kind:"stop",line:e.line,column:e.column};case"color":{const l=this.peek();if(l.type==="eof")throw new ae("Brak literału koloru po poleceniu „kolor”.",e.line,e.column);if(l.type!=="color")throw new ae("Oczekiwano literału koloru w formacie „#rrggbb”.",l.line,l.column);return this.advance(),{kind:"color",value:l.value,line:e.line,column:e.column}}case"width":return{kind:"width",value:this.parseExpr(e),line:e.line,column:e.column};case"let":{const l=this.peek();if(l.type==="eof")throw new ae("Brak nazwy zmiennej po „niech”.",e.line,e.column);if(l.type!=="ident"||vo(l.lower)||this.procMap.has(l.lower))throw new ae(`Nieprawidłowa nazwa zmiennej „${l.value}”.`,l.line,l.column);this.advance();const u=this.parseExpr(l);return{kind:"let",name:l.lower,expr:u,line:e.line,column:e.column}}case"repeat":{const l=this.parseExpr(e),u=this.parseBracketedBody(e);return{kind:"repeat",count:l,body:u,line:e.line,column:e.column}}case"if":{const l=this.parseCondition(e),u=this.parseBracketedBody(e);return{kind:"if",cond:l,thenBody:u,elseBody:null,line:e.line,column:e.column}}case"ifelse":{const l=this.parseCondition(e),u=this.parseBracketedBody(e),h=this.parseBracketedBody(e);return{kind:"if",cond:l,thenBody:u,elseBody:h,line:e.line,column:e.column}}}}const r=this.procMap.get(e.lower);if(r){this.advance();const l=[];let u=e;for(let h=0;h<r.params.length;h++){const d=this.parseExpr(u);l.push(d),u=e}return{kind:"call",name:e.lower,args:l,line:e.line,column:e.column}}throw new ae(`Nieznane polecenie „${e.value}”.`,e.line,e.column)}parseCondition(e){const i=this.parseExpr(e),r=this.peek();if(r.type==="eof")throw new ae("Oczekiwano operatora porównania (<, >, =, <=, >=, <>).",e.line,e.column);if(r.type!=="cmp")throw new ae("Oczekiwano operatora porównania (<, >, =, <=, >=, <>).",r.line,r.column);this.advance();const l=this.parseExpr(r);return{left:i,op:r.value,right:l,line:i.line,column:i.column}}canBeBinaryOp(e){return e.type==="op"&&e.spaceBefore===e.spaceAfter}parseExpr(e){return this.parseAddSub(e)}parseAddSub(e){let i=this.parseMulDiv(e);for(;this.canBeBinaryOp(this.peek())&&(this.peek().value==="+"||this.peek().value==="-");){const r=this.advance(),l=this.parseMulDiv(r);i={kind:"binary",op:r.value,left:i,right:l,line:i.line,column:i.column}}return i}parseMulDiv(e){let i=this.parseUnary(e);for(;this.canBeBinaryOp(this.peek())&&(this.peek().value==="*"||this.peek().value==="/");){const r=this.advance(),l=this.parseUnary(r);i={kind:"binary",op:r.value,left:i,right:l,line:i.line,column:i.column}}return i}parseUnary(e){const i=this.peek();if(i.type==="op"&&(i.value==="+"||i.value==="-")){this.advance();const r=this.parseUnary(i);return{kind:"unary",op:i.value,expr:r,line:i.line,column:i.column}}return this.parsePrimary(e)}parsePrimary(e){const i=this.peek();if(i.type==="eof")throw new ae("Brak oczekiwanego wyrażenia.",e.line,e.column);if(i.type==="number"){this.advance();const r=Number(i.value);if(!Number.isFinite(r))throw new ae("Liczba wykracza poza dopuszczalny zakres.",i.line,i.column);return{kind:"number",value:r,line:i.line,column:i.column}}if(i.type==="lparen"){const r=this.advance(),l=this.parseExpr(r),u=this.peek();if(u.type==="eof")throw new ae("Brak nawiasu zamykającego „)”.",r.line,r.column);if(u.type!=="rparen")throw new ae("Oczekiwano nawiasu zamykającego „)”.",u.line,u.column);return this.advance(),{...l,line:r.line,column:r.column}}if(i.type==="legacyVar")return this.advance(),{kind:"var",name:i.lower,line:i.line,column:i.column};if(i.type==="ident"){if(i.lower==="nrpowt"||i.lower==="repcount")return this.advance(),{kind:"repcount",line:i.line,column:i.column};if(vo(i.lower))throw new ae(`Nieoczekiwane słowo kluczowe „${i.value}” w wyrażeniu.`,i.line,i.column);return this.advance(),{kind:"var",name:i.lower,line:i.line,column:i.column}}throw new ae(`Oczekiwano wyrażenia zamiast „${i.value}”.`,i.line,i.column)}}function Dl(o,e){for(const i of o)i.kind==="let"?e.add(i.name):i.kind==="repeat"?Dl(i.body,e):i.kind==="if"&&(Dl(i.thenBody,e),i.elseBody&&Dl(i.elseBody,e))}function Nl(o){switch(o.kind){case"number":return!0;case"var":case"repcount":return!1;case"unary":return Nl(o.expr);case"binary":return Nl(o.left)&&Nl(o.right)}}function Ul(o){switch(o.kind){case"number":return o.value;case"unary":{const e=Ul(o.expr);return o.op==="-"?-e:e}case"binary":{const e=Ul(o.left),i=Ul(o.right);let r=0;if(o.op==="+")r=e+i;else if(o.op==="-")r=e-i;else if(o.op==="*")r=e*i;else{if(i===0)throw new ae("Dzielenie przez zero.",o.line,o.column);r=e/i}if(!Number.isFinite(r))throw new ae("Wynik działania wykracza poza dopuszczalny zakres liczbowy.",o.line,o.column);return r}default:return 0}}function Fi(o,e,i){switch(o.kind){case"number":return;case"repcount":if(!e)throw new ae("Wartość „nrpowt” może być użyta wyłącznie wewnątrz pętli „powtorz”.",o.line,o.column);return;case"var":if(!i.has(o.name))throw new ae(`Nieznana zmienna lub parametr „${o.name}”.`,o.line,o.column);return;case"unary":Fi(o.expr,e,i);return;case"binary":Fi(o.left,e,i),Fi(o.right,e,i);return}}function zl(o,e,i){for(const r of o)switch(r.kind){case"move":Fi(r.dist,e,i);break;case"turn":case"pitch":case"roll":Fi(r.angle,e,i);break;case"width":if(Fi(r.value,e,i),Nl(r.value)){const l=Ul(r.value);if(!Number.isInteger(l)||l<1||l>12)throw new ae("Grubość pisaka musi być liczbą całkowitą od 1 do 12.",r.value.line,r.value.column)}break;case"let":Fi(r.expr,e,i);break;case"repeat":if(Fi(r.count,e,i),Nl(r.count)){const l=Ul(r.count);if(!Number.isInteger(l)||l<0||l>1e4)throw new ae("Liczba powtórzeń musi być liczbą całkowitą od 0 do 10 000.",r.count.line,r.count.column)}zl(r.body,!0,i);break;case"if":Fi(r.cond.left,e,i),Fi(r.cond.right,e,i),zl(r.thenBody,e,i),r.elseBody&&zl(r.elseBody,e,i);break;case"call":for(const l of r.args)Fi(l,e,i);break}}function YE(o,e){const i=qE(o);if(i.error)return{program:null,error:i.error};try{const{topTokens:r,rawProcs:l}=WE(i.tokens),u=new Map;for(const v of l)u.set(v.name,{params:v.params});const h=new Map;for(const v of l){const x=new j_(v.tokens,u,e).parseBlockBody(!1),M=new Set;Dl(x,M),h.set(v.name,{name:v.name,params:v.params,body:x,declaredLocals:M,line:v.line,column:v.column})}const p=new j_(r,u,e).parseBlockBody(!1),g=new Set;Dl(p,g);for(const v of h.values()){const m=new Set(g);for(const x of v.params)m.add(x);for(const x of v.declaredLocals)m.add(x);zl(v.body,!1,m)}return zl(p,!1,g),{program:{procedures:h,statements:p,topLevelVars:g},error:null}}catch(r){if(r instanceof ae)return{program:null,error:r.logoError};throw r}}class Ti extends Error{constructor(i,r,l){super(i);ti(this,"logoError");this.logoError={message:i,line:r,column:l}}}function X_(o){const e=Math.hypot(o[0],o[1],o[2]);return e===0?[0,0,0]:[o[0]/e,o[1]/e,o[2]/e]}function Fh(o,e,i){const r=i*Math.PI/180,l=Math.cos(r),u=Math.sin(r),h=[o[0]*l+e[0]*u,o[1]*l+e[1]*u,o[2]*l+e[2]*u],d=[-o[0]*u+e[0]*l,-o[1]*u+e[1]*l,-o[2]*u+e[2]*l],p=X_(h),g=p[0]*d[0]+p[1]*d[1]+p[2]*d[2],v=[d[0]-g*p[0],d[1]-g*p[1],d[2]-g*p[2]];return[p,X_(v)]}class ZE{constructor(e){ti(this,"program");ti(this,"frames");ti(this,"globals",new Map);ti(this,"turtle");ti(this,"segments",[]);ti(this,"ops",0);ti(this,"activeFrames",0);ti(this,"finished",!1);ti(this,"error",null);this.program=e,this.frames=[{kind:"program",stmts:e.statements,ip:0}],this.turtle={pos:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],penDown:!0,color:"#16866a",width:3}}getTurtle(){return{...this.turtle,pos:[...this.turtle.pos],heading:[...this.turtle.heading],right:[...this.turtle.right],up:[...this.turtle.up]}}getSegments(){return this.segments}getOps(){return this.ops}getNextLine(){for(let e=this.frames.length-1;e>=0;e--){const i=this.frames[e];if(i.ip<i.stmts.length)return i.stmts[i.ip].line}return null}bumpOp(e,i){if(this.ops++,this.ops>Yn.MAX_OPERATIONS)throw new Ti(`Przekroczono limit ${Yn.MAX_OPERATIONS} wykonanych operacji.`,e,i)}currentProcFrame(){for(let e=this.frames.length-1;e>=0;e--){const i=this.frames[e];if(i.kind==="procedure")return i}return null}currentRepcount(){for(let e=this.frames.length-1;e>=0;e--){const i=this.frames[e];if(i.kind==="repeat")return i.iteration;if(i.kind==="procedure")break}return 1}evalExpr(e){switch(e.kind){case"number":return e.value;case"repcount":return this.currentRepcount();case"var":{const i=this.currentProcFrame();if(i){if(i.locals.has(e.name))return i.locals.get(e.name);if(i.declaredLocals.has(e.name))throw new Ti(`Zmienna lokalna „${e.name}” nie ma jeszcze przypisanej wartości.`,e.line,e.column)}if(this.globals.has(e.name))return this.globals.get(e.name);throw new Ti(`Zmienna „${e.name}” nie ma jeszcze przypisanej wartości.`,e.line,e.column)}case"unary":{const i=this.evalExpr(e.expr);return e.op==="-"?-i:i}case"binary":{const i=this.evalExpr(e.left),r=this.evalExpr(e.right);let l=0;if(e.op==="+")l=i+r;else if(e.op==="-")l=i-r;else if(e.op==="*")l=i*r;else{if(r===0)throw new Ti("Dzielenie przez zero.",e.line,e.column);l=i/r}if(!Number.isFinite(l))throw new Ti("Wynik działania wykracza poza dopuszczalny zakres liczbowy.",e.line,e.column);return l}}}evalCondition(e){const i=this.evalExpr(e.left),r=this.evalExpr(e.right);switch(e.op){case"<":return i<r;case">":return i>r;case"=":return i===r;case"<=":return i<=r;case">=":return i>=r;case"<>":return i!==r}}pushSegment(e,i,r,l){if(this.segments.length>=Yn.MAX_SEGMENTS)throw new Ti(`Przekroczono limit ${Yn.MAX_SEGMENTS} odcinków na rysunku.`,r,l);this.segments.push({from:[e[0],e[1],e[2]],to:[i[0],i[1],i[2]],color:this.turtle.color,width:this.turtle.width})}unwindCompletedFrames(){for(;this.frames.length>0;){const e=this.frames[this.frames.length-1];if(e.ip<e.stmts.length)return!1;if(e.kind==="program")return this.frames.pop(),this.finished=!0,!0;if(e.kind==="conditional"){this.frames.pop(),this.bumpOp(e.line,e.column);continue}if(e.kind==="procedure"){this.frames.pop(),this.activeFrames--,this.bumpOp(e.line,e.column);continue}if(e.kind==="repeat"){if(this.bumpOp(e.line,e.column),e.iteration<e.total)return e.iteration++,e.ip=0,!1;this.frames.pop(),this.activeFrames--;continue}}return this.finished=!0,!0}step(){if(this.finished||this.error)return{done:!0,line:null,error:this.error};try{if(this.unwindCompletedFrames())return{done:!0,line:null,error:null};const e=this.frames[this.frames.length-1],i=e.stmts[e.ip];switch(e.ip++,this.bumpOp(i.line,i.column),i.kind){case"move":{const r=this.evalExpr(i.dist)*i.dir,[l,u,h]=this.turtle.pos,d=l+this.turtle.heading[0]*r,p=u+this.turtle.heading[1]*r,g=h+this.turtle.heading[2]*r;if(!Number.isFinite(d)||!Number.isFinite(p)||!Number.isFinite(g)||Math.abs(d)>Yn.MAX_COORD||Math.abs(p)>Yn.MAX_COORD||Math.abs(g)>Yn.MAX_COORD)throw new Ti("Żółw przekroczył dopuszczalny zakres współrzędnych (±100 000).",i.dist.line,i.dist.column);const v=[d,p,g];r!==0&&this.turtle.penDown&&(d!==l||p!==u||g!==h)&&this.pushSegment(this.turtle.pos,v,i.line,i.column),this.turtle.pos=v;break}case"turn":{const r=this.evalExpr(i.angle)*i.dir,[l,u]=Fh(this.turtle.heading,this.turtle.right,r);this.turtle.heading=l,this.turtle.right=u;break}case"pitch":{const r=this.evalExpr(i.angle)*i.dir,[l,u]=Fh(this.turtle.heading,this.turtle.up,r);this.turtle.heading=l,this.turtle.up=u;break}case"roll":{const r=this.evalExpr(i.angle)*i.dir,[l,u]=Fh(this.turtle.up,this.turtle.right,r);this.turtle.up=l,this.turtle.right=u;break}case"pen":{this.turtle.penDown=i.down;break}case"color":{this.turtle.color=i.value;break}case"width":{const r=this.evalExpr(i.value);if(!Number.isInteger(r)||r<1||r>12)throw new Ti("Grubość pisaka musi być liczbą całkowitą od 1 do 12.",i.value.line,i.value.column);this.turtle.width=r;break}case"home":{const[r,l,u]=this.turtle.pos;this.turtle.penDown&&(r!==0||l!==0||u!==0)&&this.pushSegment(this.turtle.pos,[0,0,0],i.line,i.column),this.turtle.pos=[0,0,0],this.turtle.heading=[0,1,0],this.turtle.right=[1,0,0],this.turtle.up=[0,0,1];break}case"clear":{this.segments=[];break}case"let":{const r=this.evalExpr(i.expr),l=this.currentProcFrame();l?l.locals.set(i.name,r):this.globals.set(i.name,r);break}case"stop":{for(;this.frames.length>0;){const r=this.frames.pop();if(r.kind==="repeat")this.activeFrames--;else if(r.kind==="procedure"){this.activeFrames--,this.bumpOp(i.line,i.column);break}else if(r.kind==="program")return this.finished=!0,{done:!0,line:null,error:null}}break}case"repeat":{const r=this.evalExpr(i.count);if(!Number.isInteger(r)||r<0||r>1e4)throw new Ti("Liczba powtórzeń musi być liczbą całkowitą od 0 do 10 000.",i.count.line,i.count.column);if(r>0){if(this.activeFrames>=Yn.MAX_ACTIVE_FRAMES)throw new Ti(`Przekroczono limit ${Yn.MAX_ACTIVE_FRAMES} zagnieżdżonych wywołań i pętli.`,i.line,i.column);this.activeFrames++,this.frames.push({kind:"repeat",stmts:i.body,ip:0,iteration:1,total:r,line:i.line,column:i.column})}break}case"if":{const l=this.evalCondition(i.cond)?i.thenBody:i.elseBody;l&&this.frames.push({kind:"conditional",stmts:l,ip:0,line:i.line,column:i.column});break}case"call":{const r=this.program.procedures.get(i.name);if(this.activeFrames>=Yn.MAX_ACTIVE_FRAMES)throw new Ti(`Przekroczono limit ${Yn.MAX_ACTIVE_FRAMES} zagnieżdżonych wywołań i pętli.`,i.line,i.column);const l=new Map;for(let u=0;u<r.params.length;u++)l.set(r.params[u],this.evalExpr(i.args[u]));this.activeFrames++,this.frames.push({kind:"procedure",name:r.name,stmts:r.body,ip:0,locals:l,declaredLocals:r.declaredLocals,line:i.line,column:i.column});break}}return this.unwindCompletedFrames()?{done:!0,line:null,error:null}:{done:!1,line:i.line,error:null}}catch(e){if(e instanceof Ti)return this.error=e.logoError,this.finished=!0,{done:!0,line:null,error:this.error};throw e}}runToEnd(){for(;!this.finished&&!this.error;)this.step();return{segments:this.segments,error:this.error}}}function Hu(o,e){const i=YE(o,e);return i.error||!i.program?{vm:null,error:i.error}:{vm:new ZE(i.program),error:null}}function Pl(o,e){const{vm:i,error:r}=Hu(o,e);return r||!i?{segments:[],error:r}:i.runToEnd()}const Kr=[{id:"ch-kwadrat",title:"Kwadrat o boku 100",mode:"2d",difficulty:"Podstawowy",description:"Narysuj kwadrat o boku 100 jednostek, zaczynając od środka układu i skręcając w prawo.",hint:"Użyj pętli `powtorz 4 [ ... ]` z poleceniami `np 100` oraz `pw 90`.",starterCode:`; Narysuj kwadrat o boku 100
powtorz 4 [
  
]`,referenceSource:"powtorz 4 [np 100 pw 90]"},{id:"ch-trojkat",title:"Trójkąt równoboczny",mode:"2d",difficulty:"Podstawowy",description:"Narysuj trójkąt równoboczny o boku 120 jednostek (skręcając w prawo).",hint:"Żółw obraca się o kąt zewnętrzny trójkąta: 360 / 3 = 120 stopni.",starterCode:`; Trójkąt równoboczny o boku 120
`,referenceSource:"powtorz 3 [np 120 pw 120]"},{id:"ch-szesciokat",title:"Sześciokąt foremny",mode:"2d",difficulty:"Podstawowy",description:"Narysuj sześciokąt foremny o boku 70 jednostek, skręcając w prawo.",hint:"Sześć boków po 70 jednostek i obrót o 360 / 6 = 60 stopni.",starterCode:`; Sześciokąt foremny o boku 70
`,referenceSource:"powtorz 6 [np 70 pw 60]"},{id:"ch-dwa-kwadraty",title:"Dwa rozłączne kwadraty",mode:"2d",difficulty:"Średni",description:"Narysuj dwa osobne kwadraty o boku 60: pierwszy od (0, 0), drugi przesunięty o 100 jednostek w prawo (podnieś pisak podczas przejścia!).",hint:"Po pierwszym kwadracie wykonaj `pod pw 90 np 100 lw 90 opu`, a potem narysuj drugi kwadrat.",starterCode:`; Dwa kwadraty o boku 60 bez linii łączącej
`,referenceSource:`powtorz 4 [np 60 pw 90]
pod pw 90 np 100 lw 90 opu
powtorz 4 [np 60 pw 90]`},{id:"ch-gwiazda",title:"Gwiazda pięcioramienna",mode:"2d",difficulty:"Średni",description:"Narysuj pięcioramienną gwiazdę o długości ramienia 150 jednostek.",hint:"Pięć powtórzeń: `np 150` i skręt w prawo o `144` stopnie.",starterCode:`; Gwiazda pięcioramienna o ramieniu 150
`,referenceSource:"powtorz 5 [np 150 pw 144]"},{id:"ch-schody-3d",title:"Schody w 3D",mode:"3d",difficulty:"Przestrzenny",description:"Narysuj 3-stopniowe schody w przestrzeni: każdy stopień to krok naprzód o 40 i wzniesienie w górę o 30.",hint:"W pętli `powtorz 3`: `np 40`, potem `gora 90 np 30 dol 90`.",starterCode:`; 3-stopniowe schody w przestrzeni 3D
`,referenceSource:"powtorz 3 [np 40 gora 90 np 30 dol 90]"}];function xp(o){return Math.hypot(o.to[0]-o.from[0],o.to[1]-o.from[1],o.to[2]-o.from[2])}function q_(o,e=4){const i=[];for(const r of o){const l=xp(r),u=Math.max(2,Math.ceil(l/e));for(let h=0;h<=u;h++){const d=h/u;i.push([r.from[0]+(r.to[0]-r.from[0])*d,r.from[1]+(r.to[1]-r.from[1])*d,r.from[2]+(r.to[2]-r.from[2])*d])}}return i}function W_(o,e){let i=1/0;for(const r of e){const l=r.to[0]-r.from[0],u=r.to[1]-r.from[1],h=r.to[2]-r.from[2],d=l*l+u*u+h*h;let p=0;d>0&&(p=((o[0]-r.from[0])*l+(o[1]-r.from[1])*u+(o[2]-r.from[2])*h)/d,p<0?p=0:p>1&&(p=1));const g=r.from[0]+p*l-o[0],v=r.from[1]+p*u-o[1],m=r.from[2]+p*h-o[2],x=g*g+v*v+m*m;x<i&&(i=x)}return Math.sqrt(i)}function KE(o,e){const r=Pl(o.referenceSource,o.mode).segments,l=Pl(e,o.mode);if(l.error)return{passed:!1,reason:`Błąd w wierszu ${l.error.line}, kolumna ${l.error.column}: ${l.error.message}`,userSegments:l.segments,expectedSegments:r};const u=l.segments;if(u.length===0)return{passed:!1,reason:"Rysunek jest pusty — żółw nie narysował żadnego odcinka.",userSegments:u,expectedSegments:r};const h=2.5,d=q_(r),p=q_(u);let g=0;for(const S of d)W_(S,u)<=h&&g++;const v=g/d.length;let m=0;for(const S of p)W_(S,r)<=h&&m++;const x=m/p.length,M=r.reduce((S,y)=>S+xp(y),0),T=u.reduce((S,y)=>S+xp(y),0),w=Math.abs(T-M)/Math.max(1,M);return v<.96?{passed:!1,reason:`Brakuje części oczekiwanego kształtu (pokrycie wzorca: ${Math.round(v*100)}%).`,userSegments:u,expectedSegments:r}:x<.96?{passed:!1,reason:"Narysowano dodatkowe odcinki poza oczekiwanym kształtem (sprawdź użycie `pod` / `opu` lub kąty).",userSegments:u,expectedSegments:r}:w>.05?{passed:!1,reason:`Łączna długość ścieżki (${T.toFixed(0)}) różni się od wzorcowej (${M.toFixed(0)}).`,userSegments:u,expectedSegments:r}:{passed:!0,reason:"Zadanie zaliczone! Kształt i wymiary zgadzają się z wzorcem.",userSegments:u,expectedSegments:r}}const ux=({size:o=16,className:e})=>C.jsx("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:C.jsx("polygon",{points:"6 4 20 12 6 20 6 4",fill:"currentColor",stroke:"none"})}),QE=({size:o=16,className:e})=>C.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:[C.jsx("rect",{x:"6",y:"4",width:"4",height:"16",fill:"currentColor",stroke:"none"}),C.jsx("rect",{x:"14",y:"4",width:"4",height:"16",fill:"currentColor",stroke:"none"})]}),JE=({size:o=16,className:e})=>C.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:[C.jsx("polygon",{points:"5 4 15 12 5 20 5 4",fill:"currentColor",stroke:"none"}),C.jsx("line",{x1:"19",y1:"5",x2:"19",y2:"19"})]}),fm=({size:o=16,className:e})=>C.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:[C.jsx("path",{d:"M3 12a9 9 0 1 0 3-6.7L3 8"}),C.jsx("polyline",{points:"3 3 3 8 8 8"})]}),fx=({size:o=16,className:e})=>C.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:[C.jsx("polyline",{points:"15 3 21 3 21 9"}),C.jsx("polyline",{points:"9 21 3 21 3 15"}),C.jsx("line",{x1:"21",y1:"3",x2:"14",y2:"10"}),C.jsx("line",{x1:"3",y1:"21",x2:"10",y2:"14"})]}),$E=({size:o=16,className:e})=>C.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:[C.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),C.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),Y_=({size:o=16,className:e})=>C.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:[C.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),C.jsx("polyline",{points:"7 10 12 15 17 10"}),C.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),tb=({size:o=16,className:e})=>C.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:[C.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),C.jsx("polyline",{points:"17 8 12 3 7 8"}),C.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),eb=({size:o=16,className:e})=>C.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:[C.jsx("circle",{cx:"12",cy:"12",r:"4"}),C.jsx("line",{x1:"12",y1:"2",x2:"12",y2:"4"}),C.jsx("line",{x1:"12",y1:"20",x2:"12",y2:"22"}),C.jsx("line",{x1:"4.93",y1:"4.93",x2:"6.34",y2:"6.34"}),C.jsx("line",{x1:"17.66",y1:"17.66",x2:"19.07",y2:"19.07"}),C.jsx("line",{x1:"2",y1:"12",x2:"4",y2:"12"}),C.jsx("line",{x1:"20",y1:"12",x2:"22",y2:"12"}),C.jsx("line",{x1:"4.93",y1:"19.07",x2:"6.34",y2:"17.66"}),C.jsx("line",{x1:"17.66",y1:"6.34",x2:"19.07",y2:"4.93"})]}),nb=({size:o=16,className:e})=>C.jsx("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:C.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})}),ib=({size:o=16,className:e})=>C.jsx("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",className:e,"aria-hidden":"true",children:C.jsx("polyline",{points:"20 6 9 17 4 12"})});function ab(o){const e=[];let i=0;const r=o.length;for(;i<r;){const l=o[i];if(l===";"){e.push({text:o.slice(i),kind:"comment"});break}if(l===" "||l==="	"||l==="\r"){let u=i+1;for(;u<r&&(o[u]===" "||o[u]==="	"||o[u]==="\r");)u++;e.push({text:o.slice(i,u),kind:"plain"}),i=u;continue}if(l==='"'){let u=i+1;for(;u<r&&o[u]!=='"';)u++;u<r&&u++,e.push({text:o.slice(i,u),kind:"color"}),i=u;continue}if(l==="["||l==="]"||l==="("||l===")"){e.push({text:l,kind:"bracket"}),i++;continue}if(l==="+"||l==="-"||l==="*"||l==="/"||l==="<"||l===">"||l==="="||l===","){let u=i+1;(l==="<"||l===">")&&u<r&&(o[u]==="="||l==="<"&&o[u]===">")&&u++,e.push({text:o.slice(i,u),kind:"op"}),i=u;continue}if(l===":"){let u=i+1;for(;u<r&&/[\p{L}\p{N}_]/u.test(o[u]);)u++;e.push({text:o.slice(i,u),kind:"var"}),i=u;continue}if(l>="0"&&l<="9"||l==="."&&i+1<r&&o[i+1]>="0"&&o[i+1]<="9"){let u=i+1;for(;u<r&&(o[u]>="0"&&o[u]<="9"||o[u]===".");)u++;e.push({text:o.slice(i,u),kind:"number"}),i=u;continue}if(/[\p{L}_]/u.test(l)){let u=i+1;for(;u<r&&/[\p{L}\p{N}_]/u.test(o[u]);)u++;o.slice(i,u).toLowerCase()==="ma"&&u<r&&o[u]===":"&&u++;const h=o.slice(i,u),d=h.toLowerCase();let p="var";Wu.has(d)||Yu.has(d)||d==="ma:"||d==="nrpowt"||d==="repcount"?p="keyword":(cx(d)!==null||vo(d))&&(p="command"),e.push({text:h,kind:p}),i=u;continue}e.push({text:l,kind:"plain"}),i++}return e}const dx=({value:o,onChange:e,activeLine:i,error:r,readOnly:l=!1,ariaLabel:u="Edytor kodu Logo"})=>{const h=Rt.useRef(null),d=Rt.useRef(null),p=Rt.useRef(null),g=Rt.useMemo(()=>o.split(`
`),[o]),v=Rt.useMemo(()=>g.map(M=>ab(M)),[g]),m=()=>{const M=h.current;M&&(d.current&&(d.current.scrollTop=M.scrollTop,d.current.scrollLeft=M.scrollLeft),p.current&&(p.current.scrollTop=M.scrollTop))},x=M=>{if(M.key==="Tab"&&!M.shiftKey&&!M.ctrlKey&&!M.metaKey&&!M.altKey){M.preventDefault();const T=M.currentTarget,w=T.selectionStart,S=T.selectionEnd,y=o.slice(0,w)+"  "+o.slice(S);e(y),requestAnimationFrame(()=>{T.selectionStart=T.selectionEnd=w+2})}else M.key==="Escape"&&M.currentTarget.blur()};return C.jsxs("div",{className:"editor-shell",children:[C.jsxs("div",{className:"editor-body",children:[C.jsx("div",{className:"editor-gutter",ref:p,"aria-hidden":"true",children:g.map((M,T)=>{const w=T+1,S=i===w,y=(r==null?void 0:r.line)===w;return C.jsx("div",{className:`editor-gutter-line${S?" is-active":""}${y?" is-error":""}`,children:w},w)})}),C.jsxs("div",{className:"editor-stage",children:[C.jsx("pre",{className:"editor-highlight",ref:d,"aria-hidden":"true",children:v.map((M,T)=>{const w=T+1,S=i===w,y=(r==null?void 0:r.line)===w,P=g[T],z=y&&r?Math.max(0,Math.min(P.length,r.column-1)):-1;return C.jsxs("div",{className:`editor-code-line${S?" is-active":""}${y?" is-error":""}`,children:[M.length===0?"​":M.map((N,X)=>C.jsx("span",{className:`tok-${N.kind}`,children:N.text},X)),y&&z>=0&&C.jsx("span",{className:"editor-col-marker",style:{left:`calc(${z}ch + 12px)`}})]},w)})}),C.jsx("textarea",{ref:h,className:"editor-textarea",value:o,onChange:M=>e(M.target.value),onScroll:m,onKeyDown:x,readOnly:l,spellCheck:!1,autoCapitalize:"off",autoComplete:"off",autoCorrect:"off",wrap:"off","aria-label":u})]})]}),r&&C.jsxs("div",{className:"editor-error-banner",role:"alert",children:[C.jsxs("span",{className:"editor-error-loc",children:["Wiersz ",r.line,", kolumna ",r.column]}),C.jsx("span",{className:"editor-error-msg",children:r.message})]})]})},Sp=({source:o,mode:e,width:i=160,height:r=112})=>{const{lines:l,viewBox:u}=Rt.useMemo(()=>{const h=Pl(o,e);if(h.segments.length===0)return{lines:[],viewBox:"0 0 100 100"};const d=P=>{if(e==="2d")return[P[0],-P[1]];const z=Math.PI/6,N=(P[0]-P[1])*Math.cos(z),X=-(P[2]+(P[0]+P[1])*Math.sin(z)*.55);return[N,X]};let p=1/0,g=-1/0,v=1/0,m=-1/0;const x=h.segments.map(P=>{const z=d(P.from),N=d(P.to);return p=Math.min(p,z[0],N[0]),g=Math.max(g,z[0],N[0]),v=Math.min(v,z[1],N[1]),m=Math.max(m,z[1],N[1]),{x1:z[0],y1:z[1],x2:N[0],y2:N[1],color:P.color,width:P.width}}),M=Math.max(10,g-p),T=Math.max(10,m-v),w=Math.max(M,T)*.14,S=`${p-w} ${v-w} ${M+w*2} ${T+w*2}`,y=Math.max(M,T)/110;return{lines:x.map(P=>({...P,strokeWidth:Math.max(.7,P.width*.7*y)})),viewBox:S}},[o,e]);return C.jsx("svg",{width:i,height:r,viewBox:u,className:"mini-preview-svg","aria-hidden":"true",children:l.map((h,d)=>C.jsx("line",{x1:h.x1,y1:h.y1,x2:h.x2,y2:h.y2,stroke:h.color,strokeWidth:h.strokeWidth,strokeLinecap:"round"},d))})},rb=({completed:o,onMarkCompleted:e,onOpenInStudio:i})=>{const[r,l]=Rt.useState(Kr[0].id),[u,h]=Rt.useState(()=>{const S={};for(const y of Kr)S[y.id]=y.starterCode;return S}),[d,p]=Rt.useState(!1),[g,v]=Rt.useState(null),m=Kr.find(S=>S.id===r)??Kr[0],x=u[m.id]??m.starterCode,M=Kr.filter(S=>o[S.id]).length,T=S=>{l(S.id),v(null),p(!1)},w=()=>{const S=KE(m,x);v(S),S.passed&&e(m.id)};return C.jsxs("div",{className:"challenges-layout",children:[C.jsxs("aside",{className:"challenges-sidebar","aria-label":"Lista wyzwań",children:[C.jsxs("div",{className:"challenges-sidebar-head",children:[C.jsx("h2",{children:"Wyzwania"}),C.jsxs("span",{className:"challenges-progress tabular",children:[M," / ",Kr.length]})]}),C.jsx("ul",{className:"challenges-list",children:Kr.map(S=>{const y=!!o[S.id],P=S.id===m.id;return C.jsx("li",{children:C.jsxs("button",{type:"button",className:`challenge-nav-item${P?" is-selected":""}`,onClick:()=>T(S),"aria-current":P?"true":void 0,children:[C.jsx("span",{className:"challenge-nav-title",children:S.title}),C.jsxs("span",{className:"challenge-nav-meta",children:[C.jsx("span",{className:"mode-tag",children:S.mode.toUpperCase()}),y&&C.jsx("span",{className:"challenge-done-badge",title:"Zadanie zaliczone",children:C.jsx(ib,{size:13})})]})]})},S.id)})})]}),C.jsxs("div",{className:"challenges-main",children:[C.jsxs("div",{className:"challenge-detail-header",children:[C.jsxs("div",{children:[C.jsxs("div",{className:"challenge-title-line",children:[C.jsx("h1",{children:m.title}),C.jsx("span",{className:"mode-tag",children:m.mode.toUpperCase()}),C.jsx("span",{className:"difficulty-tag",children:m.difficulty})]}),C.jsx("p",{className:"challenge-desc",children:m.description}),C.jsxs("div",{className:"challenge-hint-row",children:[C.jsx("button",{type:"button",className:"btn btn-ghost btn-sm",onClick:()=>p(S=>!S),"aria-expanded":d,children:d?"Ukryj podpowiedź":"Pokaż podpowiedź"}),C.jsx("button",{type:"button",className:"btn btn-ghost btn-sm",onClick:()=>i(x,m.mode),children:"Otwórz w pracowni"})]}),d&&C.jsx("p",{className:"challenge-hint-box",children:m.hint})]}),C.jsxs("div",{className:"challenge-target-box",children:[C.jsx("span",{className:"challenge-preview-label",children:"Wzór docelowy"}),C.jsx(Sp,{source:m.referenceSource,mode:m.mode,width:160,height:120})]})]}),C.jsxs("div",{className:"challenge-work-area",children:[C.jsxs("div",{className:"challenge-editor-pane",children:[C.jsxs("div",{className:"challenge-toolbar",children:[C.jsxs("button",{type:"button",className:"btn btn-primary",onClick:w,children:[C.jsx(ux,{size:14}),C.jsx("span",{children:"Sprawdź rozwiązanie"})]}),C.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>{h(S=>({...S,[m.id]:m.starterCode})),v(null)},children:"Przywróć szablon"})]}),C.jsx("div",{className:"challenge-editor-wrap",children:C.jsx(dx,{value:x,onChange:S=>h(y=>({...y,[m.id]:S})),activeLine:null,error:null,ariaLabel:`Edytor rozwiązania dla zadania ${m.title}`})})]}),C.jsxs("div",{className:"challenge-result-pane",children:[C.jsxs("div",{className:"challenge-preview-card",children:[C.jsx("span",{className:"challenge-preview-label",children:"Twój rysunek"}),C.jsx(Sp,{source:x,mode:m.mode,width:220,height:170})]}),g&&C.jsxs("div",{className:`challenge-verdict ${g.passed?"is-pass":"is-fail"}`,role:"status",children:[C.jsx("strong",{children:g.passed?"Zaliczone":"Jeszcze nie"}),C.jsx("p",{children:g.reason})]})]})]})]})]})},Zu=[{id:"kwadrat",title:"Kwadrat",mode:"2d",subtitle:"Cztery kroki do pierwszego rysunku.",source:`; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]`},{id:"gwiazda",title:"Gwiazda",mode:"2d",subtitle:"Mała zmiana kąta, wielka różnica.",source:`; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]`},{id:"rozeta",title:"Rozeta",mode:"2d",subtitle:"Jeden kwadrat. Wiele możliwości.",source:`; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]`},{id:"spirala",title:"Spirala",mode:"2d",subtitle:"Licznik powtórzeń i zmienna zmieniają kolor.",source:`; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]`},{id:"wielokaty",title:"Wielokąty",mode:"2d",subtitle:"Procedura liczy kąt z liczby boków.",source:`; Jedna procedura, wiele figur: kąt liczy się sam.
oto wielokąt ma: boki, bok
  powtorz boki [np bok pw 360 / boki]
już

grubosc 2
niech n 3
powtorz 7 [
  wielokąt n 60
  niech n n + 1
  pw 360 / 7
]`},{id:"drzewo",title:"Drzewo",mode:"2d",subtitle:"Gałąź rysuje dwie mniejsze gałęzie.",source:`; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
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
gałąź 90`},{id:"sniezynka",title:"Śnieżynka",mode:"2d",subtitle:"Krzywa Kocha z czterech poziomów.",source:`; Krzywa Kocha: każdy odcinek dzieli się na cztery.
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
]`},{id:"schody",title:"Schody",mode:"3d",subtitle:"Pierwszy krok w trzeci wymiar.",source:`; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]`},{id:"szescian",title:"Sześcian",mode:"3d",subtitle:"Zbuduj bryłę z prostych poleceń.",source:`; Dwa kwadraty połączone krawędziami.
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
]`},{id:"pierscien",title:"Pierścień",mode:"3d",subtitle:"Okrąg przechylony w przestrzeni.",source:`; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]`},{id:"kula",title:"Kula",mode:"3d",subtitle:"Okręgi obrócone wokół kierunku żółwia.",source:`; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]`},{id:"helisa",title:"Helisa",mode:"3d",subtitle:"Spirala wznosi się obrót po obrocie.",source:`; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]`},{id:"drzewo3d",title:"Drzewo 3D",mode:"3d",subtitle:"Gałęzie obracają się wokół pnia.",source:`; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
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
gałąź 70`}],sb=({onSelectExample:o})=>{const e=Zu.filter(l=>l.mode==="2d"),i=Zu.filter(l=>l.mode==="3d"),r=(l,u)=>C.jsxs("section",{className:"examples-section","aria-label":l,children:[C.jsx("h2",{className:"section-heading",children:l}),C.jsx("div",{className:"examples-grid",children:u.map(h=>C.jsxs("article",{className:"example-row",children:[C.jsx("div",{className:"example-thumb",children:C.jsx(Sp,{source:h.source,mode:h.mode,width:132,height:92})}),C.jsxs("div",{className:"example-info",children:[C.jsxs("div",{className:"example-title-row",children:[C.jsx("h3",{children:h.title}),C.jsx("span",{className:"mode-tag",children:h.mode.toUpperCase()})]}),C.jsx("p",{className:"example-sub",children:h.subtitle}),C.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>o(h),children:"Wczytaj do pracowni"})]})]},h.id))})]});return C.jsx("div",{className:"page-scroll",children:C.jsxs("div",{className:"page-container",children:[C.jsxs("header",{className:"page-header",children:[C.jsx("h1",{children:"Przykłady standardowe"}),C.jsx("p",{className:"page-lead",children:"Trzynaście klasycznych programów w języku Logo — od pierwszego kwadratu po fraktale i bryły w przestrzeni 3D."})]}),r("Tryb 2D — płaszczyzna",e),r("Tryb 3D — przestrzeń",i)]})})},Z_=[{polish:["np","naprzod","naprzód"],english:["fd","forward"],argument:"wyrażenie",meaning:"Przesuwa żółwia naprzód o podaną liczbę jednostek.",example:"np 100"},{polish:["ws","wstecz"],english:["bk","back"],argument:"wyrażenie",meaning:"Przesuwa żółwia wstecz o podaną liczbę jednostek.",example:"ws 50"},{polish:["pw","prawo"],english:["rt","right"],argument:"wyrażenie",meaning:"Obraca żółwia w prawo o podaną liczbę stopni.",example:"pw 90"},{polish:["lw","lewo"],english:["lt","left"],argument:"wyrażenie",meaning:"Obraca żółwia w lewo o podaną liczbę stopni.",example:"lw 45"},{polish:["pod","podnies","podnieś"],english:["pu","penup"],argument:"brak",meaning:"Podnosi pisak — ruchy żółwia nie zostawiają śladu.",example:"pod np 40 opu"},{polish:["opu","opusc","opuść"],english:["pd","pendown"],argument:"brak",meaning:"Opuszcza pisak — żółw znów rysuje odcinki.",example:"opu np 80"},{polish:["kolor"],english:["color"],argument:'literał koloru ("#rrggbb")',meaning:"Ustawia kolor pisaka jako 6-cyfrowy zapis szesnastkowy w cudzysłowie.",example:'kolor "#16866a"'},{polish:["grubosc","grubość"],english:["width"],argument:"wyrażenie (liczba całkowita 1–12)",meaning:"Ustawia grubość linii od 1 do 12 pikseli.",example:"grubosc 3"},{polish:["powtorz","powtórz"],english:["repeat"],argument:"wyrażenie (0–10000), następnie [ ciało ]",meaning:"Wykonuje polecenia w nawiasach kwadratowych podaną liczbę razy. Wewnątrz pętli dostępna jest wartość nrpowt (repcount).",example:"powtorz 4 [np 80 pw 90]"},{polish:["niech"],english:["let"],argument:"nazwa, następnie wyrażenie",meaning:"Tworzy lub zmienia wartość zmiennej globalnej (poza procedurą) lub lokalnej (wewnątrz procedury).",example:"niech bok 60"},{polish:["jeśli","jesli"],english:["if"],argument:"warunek, następnie [ ciało ]",meaning:"Wykonuje blok poleceń, jeśli warunek jest spełniony.",example:"jeśli x > 10 [np x]"},{polish:["jeżeli","jezeli"],english:["ifelse"],argument:"warunek, następnie [ ciało1 ] [ ciało2 ]",meaning:"Wykonuje pierwszy blok, gdy warunek jest spełniony, albo drugi w przeciwnym razie.",example:'jeżeli x > 0 [kolor "#16866a"] [kolor "#c1763d"]'},{polish:["stop"],english:["stop"],argument:"brak",meaning:"Kończy bieżącą procedurę; użyte na poziomie głównym kończy cały program.",example:"jeśli dł < 5 [stop]"},{polish:["dom"],english:["home"],argument:"brak",meaning:"Wraca żółwiem do początku układu (0, 0, 0) i początkowej orientacji (+Y, góra +Z). Jeśli pisak jest opuszczony, rysuje linię powrotu.",example:"dom"},{polish:["czyść","czysc"],english:["cs","clearscreen"],argument:"brak",meaning:"Usuwa wszystkie narysowane dotąd odcinki, nie zmieniając pozycji ani ustawień pisaka.",example:"czyść"},{polish:["gora","góra"],english:["pitchup"],argument:"wyrażenie",meaning:"Unosi dziób żółwia w górę o podaną liczbę stopni (tylko w trybie 3D).",example:"gora 90",only3d:!0},{polish:["dol","dół"],english:["pitchdown"],argument:"wyrażenie",meaning:"Opuszcza dziób żółwia w dół o podaną liczbę stopni (tylko w trybie 3D).",example:"dol 45",only3d:!0},{polish:["pp","przechylprawo"],english:["rr","rollright"],argument:"wyrażenie",meaning:"Przechyla żółwia w prawo wokół jego osi kierunku (tylko w trybie 3D).",example:"pp 90",only3d:!0},{polish:["pl","przechyllewo"],english:["rl","rollleft"],argument:"wyrażenie",meaning:"Przechyla żółwia w lewo wokół jego osi kierunku (tylko w trybie 3D).",example:"pl 30",only3d:!0}],ob=[{label:"Maksymalna długość kodu",value:"50 000 znaków"},{label:"Maksymalna liczba tokenów",value:"10 000 tokenów"},{label:"Głębokość zagnieżdżenia nawiasów [ ]",value:"32 poziomy"},{label:"Aktywne ramki wywołań i pętli",value:"32 ramki jednocześnie"},{label:"Liczba wykonanych operacji",value:"10 000 operacji"},{label:"Liczba zapamiętanych odcinków",value:"10 000 odcinków"},{label:"Zakres współrzędnych X, Y, Z",value:"od −100 000 do +100 000"},{label:"Grubość pisaka",value:"liczba całkowita od 1 do 12"},{label:"Liczba powtórzeń w pętli",value:"liczba całkowita od 0 do 10 000"}],lb=()=>{const[o,e]=Rt.useState(""),i=Rt.useMemo(()=>{const r=o.trim().toLowerCase();return r?Z_.filter(l=>l.polish.some(u=>u.toLowerCase().includes(r))||l.english.some(u=>u.toLowerCase().includes(r))||l.meaning.toLowerCase().includes(r)):Z_},[o]);return C.jsx("div",{className:"page-scroll",children:C.jsxs("div",{className:"page-container ref-container",children:[C.jsxs("header",{className:"page-header",children:[C.jsx("h1",{children:"Słownik języka Logomocja"}),C.jsx("p",{className:"page-lead",children:"Pełna dokumentacja dialektu: polecenia polskie i angielskie, wyrażenia, zmienne, procedury, warunki, limity oraz skróty klawiszowe."})]}),C.jsxs("section",{className:"ref-section",children:[C.jsxs("div",{className:"ref-search-row",children:[C.jsx("h2",{children:"Polecenia"}),C.jsx("input",{type:"search",className:"ref-search-input",placeholder:"Szukaj polecenia (np. np, powtorz, pitchup)...",value:o,onChange:r=>e(r.target.value),"aria-label":"Szukaj polecenia w słowniku"})]}),C.jsx("div",{className:"ref-table-wrap",children:C.jsxs("table",{className:"ref-table",children:[C.jsx("thead",{children:C.jsxs("tr",{children:[C.jsx("th",{children:"Polskie"}),C.jsx("th",{children:"Angielskie"}),C.jsx("th",{children:"Argument"}),C.jsx("th",{children:"Działanie"}),C.jsx("th",{children:"Przykład"})]})}),C.jsxs("tbody",{children:[i.map(r=>C.jsxs("tr",{children:[C.jsxs("td",{className:"mono",children:[r.polish.join(", "),r.only3d&&C.jsx("span",{className:"mode-tag inline-tag",children:"3D"})]}),C.jsx("td",{className:"mono",children:r.english.join(", ")}),C.jsx("td",{children:r.argument}),C.jsx("td",{children:r.meaning}),C.jsx("td",{className:"mono",children:r.example})]},r.polish[0])),i.length===0&&C.jsx("tr",{children:C.jsxs("td",{colSpan:5,className:"ref-empty",children:["Brak poleceń pasujących do zapytania „",o,"”."]})})]})]})})]}),C.jsxs("div",{className:"ref-prose-grid",children:[C.jsxs("section",{className:"ref-section",children:[C.jsx("h2",{children:"Wyrażenia i operatory"}),C.jsxs("p",{children:["W miejscu argumentu liczbowego można podać liczbę dziesiętną (np. ",C.jsx("code",{children:"80"}),", ",C.jsx("code",{children:"12.5"}),", ",C.jsx("code",{children:".5"}),"), nazwę zmiennej lub parametru (także w starszej postaci ",C.jsx("code",{children:":bok"}),"), wartość ",C.jsx("code",{children:"nrpowt"})," (",C.jsx("code",{children:"repcount"}),") wewnątrz pętli, wyrażenie w nawiasach ",C.jsx("code",{children:"(...)"}),", znak jednoargumentowy ",C.jsx("code",{children:"+"})," lub ",C.jsx("code",{children:"-"})," oraz działania ",C.jsx("code",{children:"+"}),", ",C.jsx("code",{children:"-"}),", ",C.jsx("code",{children:"*"}),", ",C.jsx("code",{children:"/"}),"."]}),C.jsxs("p",{children:["Mnożenie i dzielenie wiążą silniej niż dodawanie i odejmowanie. Operator dwuargumentowy musi mieć odstęp po obu stronach albo po żadnej:",C.jsx("code",{children:"np 10 - 5"})," i ",C.jsx("code",{children:"np 10-5"})," są poprawne, natomiast ",C.jsx("code",{children:"np 10 -5"})," powoduje błąd. Porównania w warunkach to ",C.jsx("code",{children:"<"}),", ",C.jsx("code",{children:">"}),", ",C.jsx("code",{children:"="}),", ",C.jsx("code",{children:"<="}),", ",C.jsx("code",{children:">="}),", ",C.jsx("code",{children:"<>"}),"."]})]}),C.jsxs("section",{className:"ref-section",children:[C.jsx("h2",{children:"Zmienne i zasięg"}),C.jsxs("p",{children:["Polecenie ",C.jsx("code",{children:"niech x 5"})," przypisuje wartość zmiennej ",C.jsx("code",{children:"x"}),". Poza procedurą tworzy lub zmienia zmienną globalną; wewnątrz procedury tworzy zmienną lokalną dla danego wywołania, przesłaniającą zmienną globalną o tej samej nazwie. Odczyt zadeklarowanej zmiennej przed jej przypisaniem na bieżącej ścieżce wykonania zgłasza błąd czasu wykonania."]})]}),C.jsxs("section",{className:"ref-section",children:[C.jsx("h2",{children:"Warunki i pętle"}),C.jsxs("p",{children:[C.jsx("code",{children:"jeśli warunek [ ... ]"})," wykonuje blok, gdy warunek jest prawdziwy.",C.jsx("code",{children:"jeżeli warunek [ ... ] [ ... ]"})," wybiera pierwszy lub drugi blok. W pętli ",C.jsx("code",{children:"powtorz n [ ... ]"})," licznik ",C.jsx("code",{children:"nrpowt"})," zaczyna się od 1 i dotyczy najbliższej otaczającej pętli w kodzie."]})]}),C.jsxs("section",{className:"ref-section",children:[C.jsx("h2",{children:"Procedury"}),C.jsx("pre",{className:"ref-code",children:`oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90`}),C.jsxs("p",{children:["Definicja zaczyna się od ",C.jsx("code",{children:"oto"})," (",C.jsx("code",{children:"to"}),") na początku wiersza i kończy słowem ",C.jsx("code",{children:"już"})," (",C.jsx("code",{children:"juz"}),", ",C.jsx("code",{children:"end"}),") w osobnym wierszu. Obsługiwany jest również starszy nagłówek ",C.jsx("code",{children:"oto kwadrat :bok :kąt"}),". Procedury mogą wywoływać się rekurencyjnie, a ",C.jsx("code",{children:"stop"})," kończy bieżące wywołanie."]})]}),C.jsxs("section",{className:"ref-section",children:[C.jsx("h2",{children:"Limity środowiska"}),C.jsx("dl",{className:"limits-list",children:ob.map(r=>C.jsxs("div",{className:"limits-row",children:[C.jsx("dt",{children:r.label}),C.jsx("dd",{className:"tabular",children:r.value})]},r.label))})]}),C.jsxs("section",{className:"ref-section",children:[C.jsx("h2",{children:"Skróty klawiszowe w pracowni"}),C.jsxs("dl",{className:"limits-list",children:[C.jsxs("div",{className:"limits-row",children:[C.jsx("dt",{children:"Uruchom program"}),C.jsx("dd",{className:"mono",children:"Ctrl/Cmd + Enter"})]}),C.jsxs("div",{className:"limits-row",children:[C.jsx("dt",{children:"Wykonaj jeden krok"}),C.jsx("dd",{className:"mono",children:"F10 lub Alt + K"})]}),C.jsxs("div",{className:"limits-row",children:[C.jsx("dt",{children:"Pauza / Wznów"}),C.jsx("dd",{className:"mono",children:"F8 lub Alt + P"})]}),C.jsxs("div",{className:"limits-row",children:[C.jsx("dt",{children:"Resetuj wykonanie"}),C.jsx("dd",{className:"mono",children:"Alt + R"})]})]})]})]})]})})},hx=Rt.forwardRef(({segments:o,turtle:e,isDark:i},r)=>{const l=Rt.useRef(null),u=Rt.useRef(null),[h,d]=Rt.useState({cx:0,cy:0,zoom:1}),[p,g]=Rt.useState(!0),v=Rt.useRef({active:!1,startX:0,startY:0,origCx:0,origCy:0}),m=Rt.useCallback(()=>{const z=u.current;if(!z)return;const N=z.getBoundingClientRect(),X=Math.max(200,N.width),H=Math.max(200,N.height);let B=e.pos[0],F=e.pos[0],R=e.pos[1],E=e.pos[1];if(o.length===0)B=-150,F=150,R=-150,E=150;else for(const st of o)B=Math.min(B,st.from[0],st.to[0]),F=Math.max(F,st.from[0],st.to[0]),R=Math.min(R,st.from[1],st.to[1]),E=Math.max(E,st.from[1],st.to[1]);const L=Math.max(40,F-B),et=Math.max(40,E-R),K=.82,ft=Math.max(.02,Math.min(12,Math.min(X*K/L,H*K/et)));d({cx:(B+F)/2,cy:(R+E)/2,zoom:ft})},[o,e.pos]),x=Rt.useCallback(()=>{d({cx:0,cy:0,zoom:1})},[]),M=Rt.useCallback(()=>{const z=u.current;if(!z)return;const N=z.toDataURL("image/png"),X=document.createElement("a");X.href=N,X.download="logomocja-2d.png",document.body.appendChild(X),X.click(),document.body.removeChild(X)},[]);Rt.useImperativeHandle(r,()=>({fitToDrawing:m,resetView:x,exportPng:M}),[m,x,M]);const T=Rt.useCallback(()=>{const z=u.current,N=l.current;if(!z||!N)return;const X=window.devicePixelRatio||1,H=N.getBoundingClientRect(),B=Math.max(1,Math.floor(H.width)),F=Math.max(1,Math.floor(H.height));(z.width!==B*X||z.height!==F*X)&&(z.width=B*X,z.height=F*X);const R=z.getContext("2d");if(!R)return;R.save(),R.scale(X,X),R.fillStyle=i?"#111418":"#f7f6f2",R.fillRect(0,0,B,F);const E=Y=>B/2+(Y-h.cx)*h.zoom,L=Y=>F/2-(Y-h.cy)*h.zoom;if(p){let Y=50;const _t=60/h.zoom,mt=Math.pow(10,Math.floor(Math.log10(_t))),At=_t/mt;At<1.5?Y=mt:At<3.5?Y=2*mt:At<7.5?Y=5*mt:Y=10*mt;const Wt=h.cx-B/(2*h.zoom),Kt=h.cx+B/(2*h.zoom),U=h.cy-F/(2*h.zoom),Q=h.cy+F/(2*h.zoom);R.strokeStyle=i?"rgba(255,255,255,0.055)":"rgba(20,24,31,0.06)",R.lineWidth=1,R.beginPath();for(let vt=Math.floor(Wt/Y)*Y;vt<=Kt;vt+=Y){const dt=Math.round(E(vt))+.5;R.moveTo(dt,0),R.lineTo(dt,F)}for(let vt=Math.floor(U/Y)*Y;vt<=Q;vt+=Y){const dt=Math.round(L(vt))+.5;R.moveTo(0,dt),R.lineTo(B,dt)}R.stroke()}const et=E(0),K=L(0);R.strokeStyle=i?"rgba(255,255,255,0.22)":"rgba(20,24,31,0.22)",R.lineWidth=1,R.beginPath(),R.moveTo(et-10,K),R.lineTo(et+10,K),R.moveTo(et,K-10),R.lineTo(et,K+10),R.stroke(),R.beginPath(),R.arc(et,K,3,0,Math.PI*2),R.fillStyle=i?"rgba(255,255,255,0.35)":"rgba(20,24,31,0.35)",R.fill(),R.lineCap="round",R.lineJoin="round";for(const Y of o)R.strokeStyle=Y.color,R.lineWidth=Y.width,R.beginPath(),R.moveTo(E(Y.from[0]),L(Y.from[1])),R.lineTo(E(Y.to[0]),L(Y.to[1])),R.stroke();const ft=E(e.pos[0]),st=L(e.pos[1]),k=Math.atan2(-e.heading[1],e.heading[0]);R.save(),R.translate(ft,st),R.rotate(k),R.beginPath(),R.moveTo(11,0),R.lineTo(-8,-6.5),R.lineTo(-5,0),R.lineTo(-8,6.5),R.closePath(),R.fillStyle=e.penDown?e.color:"transparent",R.strokeStyle=i?"#f0f2f5":"#14181f",R.lineWidth=1.75,e.penDown&&R.fill(),R.stroke(),R.restore(),R.restore()},[h,i,o,p,e]);Rt.useEffect(()=>{T()},[T]),Rt.useEffect(()=>{const z=l.current;if(!z)return;const N=new ResizeObserver(()=>T());return N.observe(z),()=>N.disconnect()},[T]);const w=z=>{z.currentTarget.setPointerCapture(z.pointerId),v.current={active:!0,startX:z.clientX,startY:z.clientY,origCx:h.cx,origCy:h.cy}},S=z=>{if(!v.current.active)return;const N=z.clientX-v.current.startX,X=z.clientY-v.current.startY;d(H=>({...H,cx:v.current.origCx-N/H.zoom,cy:v.current.origCy+X/H.zoom}))},y=z=>{v.current.active=!1;try{z.currentTarget.releasePointerCapture(z.pointerId)}catch{}},P=z=>{z.preventDefault();const N=z.deltaY<0?1.12:1/1.12;d(X=>({...X,zoom:Math.max(.02,Math.min(25,X.zoom*N))}))};return C.jsxs("div",{className:"viewport-stage",ref:l,children:[C.jsx("canvas",{ref:u,className:"viewport-canvas",onPointerDown:w,onPointerMove:S,onPointerUp:y,onPointerCancel:y,onWheel:P,"aria-label":"Obszar rysowania 2D"}),C.jsxs("div",{className:"viewport-controls",role:"toolbar","aria-label":"Sterowanie widokiem 2D",children:[C.jsx("button",{type:"button",className:"vp-btn",onClick:()=>d(z=>({...z,zoom:Math.min(25,z.zoom*1.25)})),"aria-label":"Przybliż widok",title:"Przybliż",children:"+"}),C.jsx("button",{type:"button",className:"vp-btn",onClick:()=>d(z=>({...z,zoom:Math.max(.02,z.zoom/1.25)})),"aria-label":"Oddal widok",title:"Oddal",children:"−"}),C.jsxs("button",{type:"button",className:"vp-btn vp-btn-text",onClick:m,title:"Dopasuj rysunek do ekranu",children:[C.jsx(fx,{size:14}),C.jsx("span",{children:"Dopasuj"})]}),C.jsxs("button",{type:"button",className:"vp-btn vp-btn-text",onClick:x,title:"Przywróć domyślny widok",children:[C.jsx(fm,{size:14}),C.jsx("span",{children:"Reset"})]}),C.jsx("button",{type:"button",className:`vp-btn vp-btn-text${p?" is-pressed":""}`,onClick:()=>g(z=>!z),"aria-pressed":p,title:"Pokaż lub ukryj siatkę",children:C.jsx("span",{children:"Siatka"})})]})]})});hx.displayName="Viewport2D";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const dm="174",cb=0,K_=1,ub=2,px=1,fb=2,Ua=3,Tr=0,ni=1,ra=2,Er=0,_o=1,Q_=2,J_=3,$_=4,db=5,os=100,hb=101,pb=102,mb=103,gb=104,vb=200,_b=201,yb=202,xb=203,Mp=204,Ep=205,Sb=206,Mb=207,Eb=208,bb=209,Tb=210,wb=211,Ab=212,Rb=213,Cb=214,bp=0,Tp=1,wp=2,So=3,Ap=4,Rp=5,Cp=6,Dp=7,mx=0,Db=1,Nb=2,br=0,Ub=1,zb=2,Lb=3,Ob=4,Pb=5,Bb=6,Ib=7,gx=300,Mo=301,Eo=302,Np=303,Up=304,nf=306,zp=1e3,cs=1001,Lp=1002,Vi=1003,Fb=1004,du=1005,oa=1006,Hh=1007,us=1008,Ba=1009,vx=1010,_x=1011,Bl=1012,hm=1013,ds=1014,za=1015,Fl=1016,pm=1017,mm=1018,bo=1020,yx=35902,xx=1021,Sx=1022,Gi=1023,Mx=1024,Ex=1025,yo=1026,To=1027,bx=1028,gm=1029,Tx=1030,vm=1031,_m=1033,ku=33776,Gu=33777,Vu=33778,ju=33779,Op=35840,Pp=35841,Bp=35842,Ip=35843,Fp=36196,Hp=37492,kp=37496,Gp=37808,Vp=37809,jp=37810,Xp=37811,qp=37812,Wp=37813,Yp=37814,Zp=37815,Kp=37816,Qp=37817,Jp=37818,$p=37819,tm=37820,em=37821,Xu=36492,nm=36494,im=36495,wx=36283,am=36284,rm=36285,sm=36286,Hb=3200,kb=3201,Gb=0,Vb=1,xr="",Ai="srgb",wo="srgb-linear",Ku="linear",Ge="srgb",eo=7680,ty=519,jb=512,Xb=513,qb=514,Ax=515,Wb=516,Yb=517,Zb=518,Kb=519,om=35044,ey="300 es",La=2e3,Qu=2001;class Ro{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(i)===-1&&r[e].push(i)}hasEventListener(e,i){const r=this._listeners;return r===void 0?!1:r[e]!==void 0&&r[e].indexOf(i)!==-1}removeEventListener(e,i){const r=this._listeners;if(r===void 0)return;const l=r[e];if(l!==void 0){const u=l.indexOf(i);u!==-1&&l.splice(u,1)}}dispatchEvent(e){const i=this._listeners;if(i===void 0)return;const r=i[e.type];if(r!==void 0){e.target=this;const l=r.slice(0);for(let u=0,h=l.length;u<h;u++)l[u].call(this,e);e.target=null}}}const Hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ny=1234567;const Ll=Math.PI/180,Il=180/Math.PI;function Oa(){const o=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Hn[o&255]+Hn[o>>8&255]+Hn[o>>16&255]+Hn[o>>24&255]+"-"+Hn[e&255]+Hn[e>>8&255]+"-"+Hn[e>>16&15|64]+Hn[e>>24&255]+"-"+Hn[i&63|128]+Hn[i>>8&255]+"-"+Hn[i>>16&255]+Hn[i>>24&255]+Hn[r&255]+Hn[r>>8&255]+Hn[r>>16&255]+Hn[r>>24&255]).toLowerCase()}function Me(o,e,i){return Math.max(e,Math.min(i,o))}function ym(o,e){return(o%e+e)%e}function Qb(o,e,i,r,l){return r+(o-e)*(l-r)/(i-e)}function Jb(o,e,i){return o!==e?(i-o)/(e-o):0}function Ol(o,e,i){return(1-i)*o+i*e}function $b(o,e,i,r){return Ol(o,e,1-Math.exp(-i*r))}function tT(o,e=1){return e-Math.abs(ym(o,e*2)-e)}function eT(o,e,i){return o<=e?0:o>=i?1:(o=(o-e)/(i-e),o*o*(3-2*o))}function nT(o,e,i){return o<=e?0:o>=i?1:(o=(o-e)/(i-e),o*o*o*(o*(o*6-15)+10))}function iT(o,e){return o+Math.floor(Math.random()*(e-o+1))}function aT(o,e){return o+Math.random()*(e-o)}function rT(o){return o*(.5-Math.random())}function sT(o){o!==void 0&&(ny=o);let e=ny+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function oT(o){return o*Ll}function lT(o){return o*Il}function cT(o){return(o&o-1)===0&&o!==0}function uT(o){return Math.pow(2,Math.ceil(Math.log(o)/Math.LN2))}function fT(o){return Math.pow(2,Math.floor(Math.log(o)/Math.LN2))}function dT(o,e,i,r,l){const u=Math.cos,h=Math.sin,d=u(i/2),p=h(i/2),g=u((e+r)/2),v=h((e+r)/2),m=u((e-r)/2),x=h((e-r)/2),M=u((r-e)/2),T=h((r-e)/2);switch(l){case"XYX":o.set(d*v,p*m,p*x,d*g);break;case"YZY":o.set(p*x,d*v,p*m,d*g);break;case"ZXZ":o.set(p*m,p*x,d*v,d*g);break;case"XZX":o.set(d*v,p*T,p*M,d*g);break;case"YXY":o.set(p*M,d*v,p*T,d*g);break;case"ZYZ":o.set(p*T,p*M,d*v,d*g);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+l)}}function Hi(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function Fe(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}const hT={DEG2RAD:Ll,RAD2DEG:Il,generateUUID:Oa,clamp:Me,euclideanModulo:ym,mapLinear:Qb,inverseLerp:Jb,lerp:Ol,damp:$b,pingpong:tT,smoothstep:eT,smootherstep:nT,randInt:iT,randFloat:aT,randFloatSpread:rT,seededRandom:sT,degToRad:oT,radToDeg:lT,isPowerOfTwo:cT,ceilPowerOfTwo:uT,floorPowerOfTwo:fT,setQuaternionFromProperEuler:dT,normalize:Fe,denormalize:Hi};class Oe{constructor(e=0,i=0){Oe.prototype.isVector2=!0,this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,r=this.y,l=e.elements;return this.x=l[0]*i+l[3]*r+l[6],this.y=l[1]*i+l[4]*r+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=Me(this.x,e.x,i.x),this.y=Me(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=Me(this.x,e,i),this.y=Me(this.y,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Me(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(Me(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y;return i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const r=Math.cos(i),l=Math.sin(i),u=this.x-e.x,h=this.y-e.y;return this.x=u*r-h*l+e.x,this.y=u*l+h*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class he{constructor(e,i,r,l,u,h,d,p,g){he.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,h,d,p,g)}set(e,i,r,l,u,h,d,p,g){const v=this.elements;return v[0]=e,v[1]=l,v[2]=d,v[3]=i,v[4]=u,v[5]=p,v[6]=r,v[7]=h,v[8]=g,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(e,i,r){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,h=r[0],d=r[3],p=r[6],g=r[1],v=r[4],m=r[7],x=r[2],M=r[5],T=r[8],w=l[0],S=l[3],y=l[6],P=l[1],z=l[4],N=l[7],X=l[2],H=l[5],B=l[8];return u[0]=h*w+d*P+p*X,u[3]=h*S+d*z+p*H,u[6]=h*y+d*N+p*B,u[1]=g*w+v*P+m*X,u[4]=g*S+v*z+m*H,u[7]=g*y+v*N+m*B,u[2]=x*w+M*P+T*X,u[5]=x*S+M*z+T*H,u[8]=x*y+M*N+T*B,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],h=e[4],d=e[5],p=e[6],g=e[7],v=e[8];return i*h*v-i*d*g-r*u*v+r*d*p+l*u*g-l*h*p}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],h=e[4],d=e[5],p=e[6],g=e[7],v=e[8],m=v*h-d*g,x=d*p-v*u,M=g*u-h*p,T=i*m+r*x+l*M;if(T===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/T;return e[0]=m*w,e[1]=(l*g-v*r)*w,e[2]=(d*r-l*h)*w,e[3]=x*w,e[4]=(v*i-l*p)*w,e[5]=(l*u-d*i)*w,e[6]=M*w,e[7]=(r*p-g*i)*w,e[8]=(h*i-r*u)*w,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,r,l,u,h,d){const p=Math.cos(u),g=Math.sin(u);return this.set(r*p,r*g,-r*(p*h+g*d)+h+e,-l*g,l*p,-l*(-g*h+p*d)+d+i,0,0,1),this}scale(e,i){return this.premultiply(kh.makeScale(e,i)),this}rotate(e){return this.premultiply(kh.makeRotation(-e)),this}translate(e,i){return this.premultiply(kh.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<9;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<9;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const kh=new he;function Rx(o){for(let e=o.length-1;e>=0;--e)if(o[e]>=65535)return!0;return!1}function Ju(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function pT(){const o=Ju("canvas");return o.style.display="block",o}const iy={};function as(o){o in iy||(iy[o]=!0,console.warn(o))}function mT(o,e,i){return new Promise(function(r,l){function u(){switch(o.clientWaitSync(e,o.SYNC_FLUSH_COMMANDS_BIT,0)){case o.WAIT_FAILED:l();break;case o.TIMEOUT_EXPIRED:setTimeout(u,i);break;default:r()}}setTimeout(u,i)})}function gT(o){const e=o.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function vT(o){const e=o.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const ay=new he().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ry=new he().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _T(){const o={enabled:!0,workingColorSpace:wo,spaces:{},convert:function(l,u,h){return this.enabled===!1||u===h||!u||!h||(this.spaces[u].transfer===Ge&&(l.r=Pa(l.r),l.g=Pa(l.g),l.b=Pa(l.b)),this.spaces[u].primaries!==this.spaces[h].primaries&&(l.applyMatrix3(this.spaces[u].toXYZ),l.applyMatrix3(this.spaces[h].fromXYZ)),this.spaces[h].transfer===Ge&&(l.r=xo(l.r),l.g=xo(l.g),l.b=xo(l.b))),l},fromWorkingColorSpace:function(l,u){return this.convert(l,this.workingColorSpace,u)},toWorkingColorSpace:function(l,u){return this.convert(l,u,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===xr?Ku:this.spaces[l].transfer},getLuminanceCoefficients:function(l,u=this.workingColorSpace){return l.fromArray(this.spaces[u].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,u,h){return l.copy(this.spaces[u].toXYZ).multiply(this.spaces[h].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],r=[.3127,.329];return o.define({[wo]:{primaries:e,whitePoint:r,transfer:Ku,toXYZ:ay,fromXYZ:ry,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Ai},outputColorSpaceConfig:{drawingBufferColorSpace:Ai}},[Ai]:{primaries:e,whitePoint:r,transfer:Ge,toXYZ:ay,fromXYZ:ry,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Ai}}}),o}const Ue=_T();function Pa(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function xo(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let no;class yT{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{no===void 0&&(no=Ju("canvas")),no.width=e.width,no.height=e.height;const r=no.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=no}return i.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=Ju("canvas");i.width=e.width,i.height=e.height;const r=i.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const l=r.getImageData(0,0,e.width,e.height),u=l.data;for(let h=0;h<u.length;h++)u[h]=Pa(u[h]/255)*255;return r.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let r=0;r<i.length;r++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[r]=Math.floor(Pa(i[r]/255)*255):i[r]=Pa(i[r]);return{data:i,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xT=0;class xm{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xT++}),this.uuid=Oa(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},l=this.data;if(l!==null){let u;if(Array.isArray(l)){u=[];for(let h=0,d=l.length;h<d;h++)l[h].isDataTexture?u.push(Gh(l[h].image)):u.push(Gh(l[h]))}else u=Gh(l);r.url=u}return i||(e.images[this.uuid]=r),r}}function Gh(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?yT.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ST=0;class ii extends Ro{constructor(e=ii.DEFAULT_IMAGE,i=ii.DEFAULT_MAPPING,r=cs,l=cs,u=oa,h=us,d=Gi,p=Ba,g=ii.DEFAULT_ANISOTROPY,v=xr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ST++}),this.uuid=Oa(),this.name="",this.source=new xm(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=l,this.magFilter=u,this.minFilter=h,this.anisotropy=g,this.format=d,this.internalFormat=null,this.type=p,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new he,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=v,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==gx)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zp:e.x=e.x-Math.floor(e.x);break;case cs:e.x=e.x<0?0:1;break;case Lp:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zp:e.y=e.y-Math.floor(e.y);break;case cs:e.y=e.y<0?0:1;break;case Lp:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}ii.DEFAULT_IMAGE=null;ii.DEFAULT_MAPPING=gx;ii.DEFAULT_ANISOTROPY=1;class Ze{constructor(e=0,i=0,r=0,l=1){Ze.prototype.isVector4=!0,this.x=e,this.y=i,this.z=r,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,r,l){return this.x=e,this.y=i,this.z=r,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=this.w,h=e.elements;return this.x=h[0]*i+h[4]*r+h[8]*l+h[12]*u,this.y=h[1]*i+h[5]*r+h[9]*l+h[13]*u,this.z=h[2]*i+h[6]*r+h[10]*l+h[14]*u,this.w=h[3]*i+h[7]*r+h[11]*l+h[15]*u,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,r,l,u;const p=e.elements,g=p[0],v=p[4],m=p[8],x=p[1],M=p[5],T=p[9],w=p[2],S=p[6],y=p[10];if(Math.abs(v-x)<.01&&Math.abs(m-w)<.01&&Math.abs(T-S)<.01){if(Math.abs(v+x)<.1&&Math.abs(m+w)<.1&&Math.abs(T+S)<.1&&Math.abs(g+M+y-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const z=(g+1)/2,N=(M+1)/2,X=(y+1)/2,H=(v+x)/4,B=(m+w)/4,F=(T+S)/4;return z>N&&z>X?z<.01?(r=0,l=.707106781,u=.707106781):(r=Math.sqrt(z),l=H/r,u=B/r):N>X?N<.01?(r=.707106781,l=0,u=.707106781):(l=Math.sqrt(N),r=H/l,u=F/l):X<.01?(r=.707106781,l=.707106781,u=0):(u=Math.sqrt(X),r=B/u,l=F/u),this.set(r,l,u,i),this}let P=Math.sqrt((S-T)*(S-T)+(m-w)*(m-w)+(x-v)*(x-v));return Math.abs(P)<.001&&(P=1),this.x=(S-T)/P,this.y=(m-w)/P,this.z=(x-v)/P,this.w=Math.acos((g+M+y-1)/2),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=Me(this.x,e.x,i.x),this.y=Me(this.y,e.y,i.y),this.z=Me(this.z,e.z,i.z),this.w=Me(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=Me(this.x,e,i),this.y=Me(this.y,e,i),this.z=Me(this.z,e,i),this.w=Me(this.w,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Me(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this.w=e.w+(i.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class MT extends Ro{constructor(e=1,i=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=1,this.scissor=new Ze(0,0,e,i),this.scissorTest=!1,this.viewport=new Ze(0,0,e,i);const l={width:e,height:i,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:oa,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const u=new ii(l,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);u.flipY=!1,u.generateMipmaps=r.generateMipmaps,u.internalFormat=r.internalFormat,this.textures=[];const h=r.count;for(let d=0;d<h;d++)this.textures[d]=u.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,i,r=1){if(this.width!==e||this.height!==i||this.depth!==r){this.width=e,this.height=i,this.depth=r;for(let l=0,u=this.textures.length;l<u;l++)this.textures[l].image.width=e,this.textures[l].image.height=i,this.textures[l].image.depth=r;this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++){this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},e.textures[i].image);this.textures[i].source=new xm(l)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class hs extends MT{constructor(e=1,i=1,r={}){super(e,i,r),this.isWebGLRenderTarget=!0}}class Cx extends ii{constructor(e=null,i=1,r=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=Vi,this.minFilter=Vi,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ET extends ii{constructor(e=null,i=1,r=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=Vi,this.minFilter=Vi,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hl{constructor(e=0,i=0,r=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=r,this._w=l}static slerpFlat(e,i,r,l,u,h,d){let p=r[l+0],g=r[l+1],v=r[l+2],m=r[l+3];const x=u[h+0],M=u[h+1],T=u[h+2],w=u[h+3];if(d===0){e[i+0]=p,e[i+1]=g,e[i+2]=v,e[i+3]=m;return}if(d===1){e[i+0]=x,e[i+1]=M,e[i+2]=T,e[i+3]=w;return}if(m!==w||p!==x||g!==M||v!==T){let S=1-d;const y=p*x+g*M+v*T+m*w,P=y>=0?1:-1,z=1-y*y;if(z>Number.EPSILON){const X=Math.sqrt(z),H=Math.atan2(X,y*P);S=Math.sin(S*H)/X,d=Math.sin(d*H)/X}const N=d*P;if(p=p*S+x*N,g=g*S+M*N,v=v*S+T*N,m=m*S+w*N,S===1-d){const X=1/Math.sqrt(p*p+g*g+v*v+m*m);p*=X,g*=X,v*=X,m*=X}}e[i]=p,e[i+1]=g,e[i+2]=v,e[i+3]=m}static multiplyQuaternionsFlat(e,i,r,l,u,h){const d=r[l],p=r[l+1],g=r[l+2],v=r[l+3],m=u[h],x=u[h+1],M=u[h+2],T=u[h+3];return e[i]=d*T+v*m+p*M-g*x,e[i+1]=p*T+v*x+g*m-d*M,e[i+2]=g*T+v*M+d*x-p*m,e[i+3]=v*T-d*m-p*x-g*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,r,l){return this._x=e,this._y=i,this._z=r,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const r=e._x,l=e._y,u=e._z,h=e._order,d=Math.cos,p=Math.sin,g=d(r/2),v=d(l/2),m=d(u/2),x=p(r/2),M=p(l/2),T=p(u/2);switch(h){case"XYZ":this._x=x*v*m+g*M*T,this._y=g*M*m-x*v*T,this._z=g*v*T+x*M*m,this._w=g*v*m-x*M*T;break;case"YXZ":this._x=x*v*m+g*M*T,this._y=g*M*m-x*v*T,this._z=g*v*T-x*M*m,this._w=g*v*m+x*M*T;break;case"ZXY":this._x=x*v*m-g*M*T,this._y=g*M*m+x*v*T,this._z=g*v*T+x*M*m,this._w=g*v*m-x*M*T;break;case"ZYX":this._x=x*v*m-g*M*T,this._y=g*M*m+x*v*T,this._z=g*v*T-x*M*m,this._w=g*v*m+x*M*T;break;case"YZX":this._x=x*v*m+g*M*T,this._y=g*M*m+x*v*T,this._z=g*v*T-x*M*m,this._w=g*v*m-x*M*T;break;case"XZY":this._x=x*v*m-g*M*T,this._y=g*M*m-x*v*T,this._z=g*v*T+x*M*m,this._w=g*v*m+x*M*T;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const r=i/2,l=Math.sin(r);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,r=i[0],l=i[4],u=i[8],h=i[1],d=i[5],p=i[9],g=i[2],v=i[6],m=i[10],x=r+d+m;if(x>0){const M=.5/Math.sqrt(x+1);this._w=.25/M,this._x=(v-p)*M,this._y=(u-g)*M,this._z=(h-l)*M}else if(r>d&&r>m){const M=2*Math.sqrt(1+r-d-m);this._w=(v-p)/M,this._x=.25*M,this._y=(l+h)/M,this._z=(u+g)/M}else if(d>m){const M=2*Math.sqrt(1+d-r-m);this._w=(u-g)/M,this._x=(l+h)/M,this._y=.25*M,this._z=(p+v)/M}else{const M=2*Math.sqrt(1+m-r-d);this._w=(h-l)/M,this._x=(u+g)/M,this._y=(p+v)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let r=e.dot(i)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Me(this.dot(e),-1,1)))}rotateTowards(e,i){const r=this.angleTo(e);if(r===0)return this;const l=Math.min(1,i/r);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const r=e._x,l=e._y,u=e._z,h=e._w,d=i._x,p=i._y,g=i._z,v=i._w;return this._x=r*v+h*d+l*g-u*p,this._y=l*v+h*p+u*d-r*g,this._z=u*v+h*g+r*p-l*d,this._w=h*v-r*d-l*p-u*g,this._onChangeCallback(),this}slerp(e,i){if(i===0)return this;if(i===1)return this.copy(e);const r=this._x,l=this._y,u=this._z,h=this._w;let d=h*e._w+r*e._x+l*e._y+u*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=h,this._x=r,this._y=l,this._z=u,this;const p=1-d*d;if(p<=Number.EPSILON){const M=1-i;return this._w=M*h+i*this._w,this._x=M*r+i*this._x,this._y=M*l+i*this._y,this._z=M*u+i*this._z,this.normalize(),this}const g=Math.sqrt(p),v=Math.atan2(g,d),m=Math.sin((1-i)*v)/g,x=Math.sin(i*v)/g;return this._w=h*m+this._w*x,this._x=r*m+this._x*x,this._y=l*m+this._y*x,this._z=u*m+this._z*x,this._onChangeCallback(),this}slerpQuaternions(e,i,r){return this.copy(e).slerp(i,r)}random(){const e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),r=Math.random(),l=Math.sqrt(1-r),u=Math.sqrt(r);return this.set(l*Math.sin(e),l*Math.cos(e),u*Math.sin(i),u*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class it{constructor(e=0,i=0,r=0){it.prototype.isVector3=!0,this.x=e,this.y=i,this.z=r}set(e,i,r){return r===void 0&&(r=this.z),this.x=e,this.y=i,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(sy.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(sy.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[3]*r+u[6]*l,this.y=u[1]*i+u[4]*r+u[7]*l,this.z=u[2]*i+u[5]*r+u[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=e.elements,h=1/(u[3]*i+u[7]*r+u[11]*l+u[15]);return this.x=(u[0]*i+u[4]*r+u[8]*l+u[12])*h,this.y=(u[1]*i+u[5]*r+u[9]*l+u[13])*h,this.z=(u[2]*i+u[6]*r+u[10]*l+u[14])*h,this}applyQuaternion(e){const i=this.x,r=this.y,l=this.z,u=e.x,h=e.y,d=e.z,p=e.w,g=2*(h*l-d*r),v=2*(d*i-u*l),m=2*(u*r-h*i);return this.x=i+p*g+h*m-d*v,this.y=r+p*v+d*g-u*m,this.z=l+p*m+u*v-h*g,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[4]*r+u[8]*l,this.y=u[1]*i+u[5]*r+u[9]*l,this.z=u[2]*i+u[6]*r+u[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=Me(this.x,e.x,i.x),this.y=Me(this.y,e.y,i.y),this.z=Me(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=Me(this.x,e,i),this.y=Me(this.y,e,i),this.z=Me(this.z,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Me(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const r=e.x,l=e.y,u=e.z,h=i.x,d=i.y,p=i.z;return this.x=l*p-u*d,this.y=u*h-r*p,this.z=r*d-l*h,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const r=e.dot(this)/i;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Vh.copy(this).projectOnVector(e),this.sub(Vh)}reflect(e){return this.sub(Vh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(Me(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y,l=this.z-e.z;return i*i+r*r+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,r){const l=Math.sin(i)*e;return this.x=l*Math.sin(r),this.y=Math.cos(i)*e,this.z=l*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,r){return this.x=e*Math.sin(i),this.y=r,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=r,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,i=Math.random()*2-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(e),this.y=i,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Vh=new it,sy=new Hl;class wr{constructor(e=new it(1/0,1/0,1/0),i=new it(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i+=3)this.expandByPoint(Pi.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,r=e.count;i<r;i++)this.expandByPoint(Pi.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const r=Pi.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const u=r.getAttribute("position");if(i===!0&&u!==void 0&&e.isInstancedMesh!==!0)for(let h=0,d=u.count;h<d;h++)e.isMesh===!0?e.getVertexPosition(h,Pi):Pi.fromBufferAttribute(u,h),Pi.applyMatrix4(e.matrixWorld),this.expandByPoint(Pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),hu.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),hu.copy(r.boundingBox)),hu.applyMatrix4(e.matrixWorld),this.union(hu)}const l=e.children;for(let u=0,h=l.length;u<h;u++)this.expandByObject(l[u],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Pi),Pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,r;return e.normal.x>0?(i=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),i<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(bl),pu.subVectors(this.max,bl),io.subVectors(e.a,bl),ao.subVectors(e.b,bl),ro.subVectors(e.c,bl),pr.subVectors(ao,io),mr.subVectors(ro,ao),Qr.subVectors(io,ro);let i=[0,-pr.z,pr.y,0,-mr.z,mr.y,0,-Qr.z,Qr.y,pr.z,0,-pr.x,mr.z,0,-mr.x,Qr.z,0,-Qr.x,-pr.y,pr.x,0,-mr.y,mr.x,0,-Qr.y,Qr.x,0];return!jh(i,io,ao,ro,pu)||(i=[1,0,0,0,1,0,0,0,1],!jh(i,io,ao,ro,pu))?!1:(mu.crossVectors(pr,mr),i=[mu.x,mu.y,mu.z],jh(i,io,ao,ro,pu))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Aa[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Aa[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Aa[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Aa[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Aa[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Aa[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Aa[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Aa[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Aa),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Aa=[new it,new it,new it,new it,new it,new it,new it,new it],Pi=new it,hu=new wr,io=new it,ao=new it,ro=new it,pr=new it,mr=new it,Qr=new it,bl=new it,pu=new it,mu=new it,Jr=new it;function jh(o,e,i,r,l){for(let u=0,h=o.length-3;u<=h;u+=3){Jr.fromArray(o,u);const d=l.x*Math.abs(Jr.x)+l.y*Math.abs(Jr.y)+l.z*Math.abs(Jr.z),p=e.dot(Jr),g=i.dot(Jr),v=r.dot(Jr);if(Math.max(-Math.max(p,g,v),Math.min(p,g,v))>d)return!1}return!0}const bT=new wr,Tl=new it,Xh=new it;class Co{constructor(e=new it,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const r=this.center;i!==void 0?r.copy(i):bT.setFromPoints(e).getCenter(r);let l=0;for(let u=0,h=e.length;u<h;u++)l=Math.max(l,r.distanceToSquared(e[u]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const r=this.center.distanceToSquared(e);return i.copy(e),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Tl.subVectors(e,this.center);const i=Tl.lengthSq();if(i>this.radius*this.radius){const r=Math.sqrt(i),l=(r-this.radius)*.5;this.center.addScaledVector(Tl,l/r),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Xh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Tl.copy(e.center).add(Xh)),this.expandByPoint(Tl.copy(e.center).sub(Xh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ra=new it,qh=new it,gu=new it,gr=new it,Wh=new it,vu=new it,Yh=new it;class Dx{constructor(e=new it,i=new it(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ra)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const r=i.dot(this.direction);return r<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=Ra.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(Ra.copy(this.origin).addScaledVector(this.direction,i),Ra.distanceToSquared(e))}distanceSqToSegment(e,i,r,l){qh.copy(e).add(i).multiplyScalar(.5),gu.copy(i).sub(e).normalize(),gr.copy(this.origin).sub(qh);const u=e.distanceTo(i)*.5,h=-this.direction.dot(gu),d=gr.dot(this.direction),p=-gr.dot(gu),g=gr.lengthSq(),v=Math.abs(1-h*h);let m,x,M,T;if(v>0)if(m=h*p-d,x=h*d-p,T=u*v,m>=0)if(x>=-T)if(x<=T){const w=1/v;m*=w,x*=w,M=m*(m+h*x+2*d)+x*(h*m+x+2*p)+g}else x=u,m=Math.max(0,-(h*x+d)),M=-m*m+x*(x+2*p)+g;else x=-u,m=Math.max(0,-(h*x+d)),M=-m*m+x*(x+2*p)+g;else x<=-T?(m=Math.max(0,-(-h*u+d)),x=m>0?-u:Math.min(Math.max(-u,-p),u),M=-m*m+x*(x+2*p)+g):x<=T?(m=0,x=Math.min(Math.max(-u,-p),u),M=x*(x+2*p)+g):(m=Math.max(0,-(h*u+d)),x=m>0?u:Math.min(Math.max(-u,-p),u),M=-m*m+x*(x+2*p)+g);else x=h>0?-u:u,m=Math.max(0,-(h*x+d)),M=-m*m+x*(x+2*p)+g;return r&&r.copy(this.origin).addScaledVector(this.direction,m),l&&l.copy(qh).addScaledVector(gu,x),M}intersectSphere(e,i){Ra.subVectors(e.center,this.origin);const r=Ra.dot(this.direction),l=Ra.dot(Ra)-r*r,u=e.radius*e.radius;if(l>u)return null;const h=Math.sqrt(u-l),d=r-h,p=r+h;return p<0?null:d<0?this.at(p,i):this.at(d,i)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/i;return r>=0?r:null}intersectPlane(e,i){const r=this.distanceToPlane(e);return r===null?null:this.at(r,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let r,l,u,h,d,p;const g=1/this.direction.x,v=1/this.direction.y,m=1/this.direction.z,x=this.origin;return g>=0?(r=(e.min.x-x.x)*g,l=(e.max.x-x.x)*g):(r=(e.max.x-x.x)*g,l=(e.min.x-x.x)*g),v>=0?(u=(e.min.y-x.y)*v,h=(e.max.y-x.y)*v):(u=(e.max.y-x.y)*v,h=(e.min.y-x.y)*v),r>h||u>l||((u>r||isNaN(r))&&(r=u),(h<l||isNaN(l))&&(l=h),m>=0?(d=(e.min.z-x.z)*m,p=(e.max.z-x.z)*m):(d=(e.max.z-x.z)*m,p=(e.min.z-x.z)*m),r>p||d>l)||((d>r||r!==r)&&(r=d),(p<l||l!==l)&&(l=p),l<0)?null:this.at(r>=0?r:l,i)}intersectsBox(e){return this.intersectBox(e,Ra)!==null}intersectTriangle(e,i,r,l,u){Wh.subVectors(i,e),vu.subVectors(r,e),Yh.crossVectors(Wh,vu);let h=this.direction.dot(Yh),d;if(h>0){if(l)return null;d=1}else if(h<0)d=-1,h=-h;else return null;gr.subVectors(this.origin,e);const p=d*this.direction.dot(vu.crossVectors(gr,vu));if(p<0)return null;const g=d*this.direction.dot(Wh.cross(gr));if(g<0||p+g>h)return null;const v=-d*gr.dot(Yh);return v<0?null:this.at(v/h,u)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class nn{constructor(e,i,r,l,u,h,d,p,g,v,m,x,M,T,w,S){nn.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,h,d,p,g,v,m,x,M,T,w,S)}set(e,i,r,l,u,h,d,p,g,v,m,x,M,T,w,S){const y=this.elements;return y[0]=e,y[4]=i,y[8]=r,y[12]=l,y[1]=u,y[5]=h,y[9]=d,y[13]=p,y[2]=g,y[6]=v,y[10]=m,y[14]=x,y[3]=M,y[7]=T,y[11]=w,y[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new nn().fromArray(this.elements)}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(e){const i=this.elements,r=e.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,r){return e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,i,r){return this.set(e.x,i.x,r.x,0,e.y,i.y,r.y,0,e.z,i.z,r.z,0,0,0,0,1),this}extractRotation(e){const i=this.elements,r=e.elements,l=1/so.setFromMatrixColumn(e,0).length(),u=1/so.setFromMatrixColumn(e,1).length(),h=1/so.setFromMatrixColumn(e,2).length();return i[0]=r[0]*l,i[1]=r[1]*l,i[2]=r[2]*l,i[3]=0,i[4]=r[4]*u,i[5]=r[5]*u,i[6]=r[6]*u,i[7]=0,i[8]=r[8]*h,i[9]=r[9]*h,i[10]=r[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,r=e.x,l=e.y,u=e.z,h=Math.cos(r),d=Math.sin(r),p=Math.cos(l),g=Math.sin(l),v=Math.cos(u),m=Math.sin(u);if(e.order==="XYZ"){const x=h*v,M=h*m,T=d*v,w=d*m;i[0]=p*v,i[4]=-p*m,i[8]=g,i[1]=M+T*g,i[5]=x-w*g,i[9]=-d*p,i[2]=w-x*g,i[6]=T+M*g,i[10]=h*p}else if(e.order==="YXZ"){const x=p*v,M=p*m,T=g*v,w=g*m;i[0]=x+w*d,i[4]=T*d-M,i[8]=h*g,i[1]=h*m,i[5]=h*v,i[9]=-d,i[2]=M*d-T,i[6]=w+x*d,i[10]=h*p}else if(e.order==="ZXY"){const x=p*v,M=p*m,T=g*v,w=g*m;i[0]=x-w*d,i[4]=-h*m,i[8]=T+M*d,i[1]=M+T*d,i[5]=h*v,i[9]=w-x*d,i[2]=-h*g,i[6]=d,i[10]=h*p}else if(e.order==="ZYX"){const x=h*v,M=h*m,T=d*v,w=d*m;i[0]=p*v,i[4]=T*g-M,i[8]=x*g+w,i[1]=p*m,i[5]=w*g+x,i[9]=M*g-T,i[2]=-g,i[6]=d*p,i[10]=h*p}else if(e.order==="YZX"){const x=h*p,M=h*g,T=d*p,w=d*g;i[0]=p*v,i[4]=w-x*m,i[8]=T*m+M,i[1]=m,i[5]=h*v,i[9]=-d*v,i[2]=-g*v,i[6]=M*m+T,i[10]=x-w*m}else if(e.order==="XZY"){const x=h*p,M=h*g,T=d*p,w=d*g;i[0]=p*v,i[4]=-m,i[8]=g*v,i[1]=x*m+w,i[5]=h*v,i[9]=M*m-T,i[2]=T*m-M,i[6]=d*v,i[10]=w*m+x}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(TT,e,wT)}lookAt(e,i,r){const l=this.elements;return pi.subVectors(e,i),pi.lengthSq()===0&&(pi.z=1),pi.normalize(),vr.crossVectors(r,pi),vr.lengthSq()===0&&(Math.abs(r.z)===1?pi.x+=1e-4:pi.z+=1e-4,pi.normalize(),vr.crossVectors(r,pi)),vr.normalize(),_u.crossVectors(pi,vr),l[0]=vr.x,l[4]=_u.x,l[8]=pi.x,l[1]=vr.y,l[5]=_u.y,l[9]=pi.y,l[2]=vr.z,l[6]=_u.z,l[10]=pi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,h=r[0],d=r[4],p=r[8],g=r[12],v=r[1],m=r[5],x=r[9],M=r[13],T=r[2],w=r[6],S=r[10],y=r[14],P=r[3],z=r[7],N=r[11],X=r[15],H=l[0],B=l[4],F=l[8],R=l[12],E=l[1],L=l[5],et=l[9],K=l[13],ft=l[2],st=l[6],k=l[10],Y=l[14],q=l[3],_t=l[7],mt=l[11],At=l[15];return u[0]=h*H+d*E+p*ft+g*q,u[4]=h*B+d*L+p*st+g*_t,u[8]=h*F+d*et+p*k+g*mt,u[12]=h*R+d*K+p*Y+g*At,u[1]=v*H+m*E+x*ft+M*q,u[5]=v*B+m*L+x*st+M*_t,u[9]=v*F+m*et+x*k+M*mt,u[13]=v*R+m*K+x*Y+M*At,u[2]=T*H+w*E+S*ft+y*q,u[6]=T*B+w*L+S*st+y*_t,u[10]=T*F+w*et+S*k+y*mt,u[14]=T*R+w*K+S*Y+y*At,u[3]=P*H+z*E+N*ft+X*q,u[7]=P*B+z*L+N*st+X*_t,u[11]=P*F+z*et+N*k+X*mt,u[15]=P*R+z*K+N*Y+X*At,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[4],l=e[8],u=e[12],h=e[1],d=e[5],p=e[9],g=e[13],v=e[2],m=e[6],x=e[10],M=e[14],T=e[3],w=e[7],S=e[11],y=e[15];return T*(+u*p*m-l*g*m-u*d*x+r*g*x+l*d*M-r*p*M)+w*(+i*p*M-i*g*x+u*h*x-l*h*M+l*g*v-u*p*v)+S*(+i*g*m-i*d*M-u*h*m+r*h*M+u*d*v-r*g*v)+y*(-l*d*v-i*p*m+i*d*x+l*h*m-r*h*x+r*p*v)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,r){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=r),this}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],h=e[4],d=e[5],p=e[6],g=e[7],v=e[8],m=e[9],x=e[10],M=e[11],T=e[12],w=e[13],S=e[14],y=e[15],P=m*S*g-w*x*g+w*p*M-d*S*M-m*p*y+d*x*y,z=T*x*g-v*S*g-T*p*M+h*S*M+v*p*y-h*x*y,N=v*w*g-T*m*g+T*d*M-h*w*M-v*d*y+h*m*y,X=T*m*p-v*w*p-T*d*x+h*w*x+v*d*S-h*m*S,H=i*P+r*z+l*N+u*X;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/H;return e[0]=P*B,e[1]=(w*x*u-m*S*u-w*l*M+r*S*M+m*l*y-r*x*y)*B,e[2]=(d*S*u-w*p*u+w*l*g-r*S*g-d*l*y+r*p*y)*B,e[3]=(m*p*u-d*x*u-m*l*g+r*x*g+d*l*M-r*p*M)*B,e[4]=z*B,e[5]=(v*S*u-T*x*u+T*l*M-i*S*M-v*l*y+i*x*y)*B,e[6]=(T*p*u-h*S*u-T*l*g+i*S*g+h*l*y-i*p*y)*B,e[7]=(h*x*u-v*p*u+v*l*g-i*x*g-h*l*M+i*p*M)*B,e[8]=N*B,e[9]=(T*m*u-v*w*u-T*r*M+i*w*M+v*r*y-i*m*y)*B,e[10]=(h*w*u-T*d*u+T*r*g-i*w*g-h*r*y+i*d*y)*B,e[11]=(v*d*u-h*m*u-v*r*g+i*m*g+h*r*M-i*d*M)*B,e[12]=X*B,e[13]=(v*w*l-T*m*l+T*r*x-i*w*x-v*r*S+i*m*S)*B,e[14]=(T*d*l-h*w*l-T*r*p+i*w*p+h*r*S-i*d*S)*B,e[15]=(h*m*l-v*d*l+v*r*p-i*m*p-h*r*x+i*d*x)*B,this}scale(e){const i=this.elements,r=e.x,l=e.y,u=e.z;return i[0]*=r,i[4]*=l,i[8]*=u,i[1]*=r,i[5]*=l,i[9]*=u,i[2]*=r,i[6]*=l,i[10]*=u,i[3]*=r,i[7]*=l,i[11]*=u,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,r,l))}makeTranslation(e,i,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const r=Math.cos(i),l=Math.sin(i),u=1-r,h=e.x,d=e.y,p=e.z,g=u*h,v=u*d;return this.set(g*h+r,g*d-l*p,g*p+l*d,0,g*d+l*p,v*d+r,v*p-l*h,0,g*p-l*d,v*p+l*h,u*p*p+r,0,0,0,0,1),this}makeScale(e,i,r){return this.set(e,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,i,r,l,u,h){return this.set(1,r,u,0,e,1,h,0,i,l,1,0,0,0,0,1),this}compose(e,i,r){const l=this.elements,u=i._x,h=i._y,d=i._z,p=i._w,g=u+u,v=h+h,m=d+d,x=u*g,M=u*v,T=u*m,w=h*v,S=h*m,y=d*m,P=p*g,z=p*v,N=p*m,X=r.x,H=r.y,B=r.z;return l[0]=(1-(w+y))*X,l[1]=(M+N)*X,l[2]=(T-z)*X,l[3]=0,l[4]=(M-N)*H,l[5]=(1-(x+y))*H,l[6]=(S+P)*H,l[7]=0,l[8]=(T+z)*B,l[9]=(S-P)*B,l[10]=(1-(x+w))*B,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,r){const l=this.elements;let u=so.set(l[0],l[1],l[2]).length();const h=so.set(l[4],l[5],l[6]).length(),d=so.set(l[8],l[9],l[10]).length();this.determinant()<0&&(u=-u),e.x=l[12],e.y=l[13],e.z=l[14],Bi.copy(this);const g=1/u,v=1/h,m=1/d;return Bi.elements[0]*=g,Bi.elements[1]*=g,Bi.elements[2]*=g,Bi.elements[4]*=v,Bi.elements[5]*=v,Bi.elements[6]*=v,Bi.elements[8]*=m,Bi.elements[9]*=m,Bi.elements[10]*=m,i.setFromRotationMatrix(Bi),r.x=u,r.y=h,r.z=d,this}makePerspective(e,i,r,l,u,h,d=La){const p=this.elements,g=2*u/(i-e),v=2*u/(r-l),m=(i+e)/(i-e),x=(r+l)/(r-l);let M,T;if(d===La)M=-(h+u)/(h-u),T=-2*h*u/(h-u);else if(d===Qu)M=-h/(h-u),T=-h*u/(h-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return p[0]=g,p[4]=0,p[8]=m,p[12]=0,p[1]=0,p[5]=v,p[9]=x,p[13]=0,p[2]=0,p[6]=0,p[10]=M,p[14]=T,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(e,i,r,l,u,h,d=La){const p=this.elements,g=1/(i-e),v=1/(r-l),m=1/(h-u),x=(i+e)*g,M=(r+l)*v;let T,w;if(d===La)T=(h+u)*m,w=-2*m;else if(d===Qu)T=u*m,w=-1*m;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return p[0]=2*g,p[4]=0,p[8]=0,p[12]=-x,p[1]=0,p[5]=2*v,p[9]=0,p[13]=-M,p[2]=0,p[6]=0,p[10]=w,p[14]=-T,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<16;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<16;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e[i+9]=r[9],e[i+10]=r[10],e[i+11]=r[11],e[i+12]=r[12],e[i+13]=r[13],e[i+14]=r[14],e[i+15]=r[15],e}}const so=new it,Bi=new nn,TT=new it(0,0,0),wT=new it(1,1,1),vr=new it,_u=new it,pi=new it,oy=new nn,ly=new Hl;class Ia{constructor(e=0,i=0,r=0,l=Ia.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=r,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,r,l=this._order){return this._x=e,this._y=i,this._z=r,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,r=!0){const l=e.elements,u=l[0],h=l[4],d=l[8],p=l[1],g=l[5],v=l[9],m=l[2],x=l[6],M=l[10];switch(i){case"XYZ":this._y=Math.asin(Me(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-v,M),this._z=Math.atan2(-h,u)):(this._x=Math.atan2(x,g),this._z=0);break;case"YXZ":this._x=Math.asin(-Me(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(d,M),this._z=Math.atan2(p,g)):(this._y=Math.atan2(-m,u),this._z=0);break;case"ZXY":this._x=Math.asin(Me(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-m,M),this._z=Math.atan2(-h,g)):(this._y=0,this._z=Math.atan2(p,u));break;case"ZYX":this._y=Math.asin(-Me(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(x,M),this._z=Math.atan2(p,u)):(this._x=0,this._z=Math.atan2(-h,g));break;case"YZX":this._z=Math.asin(Me(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-v,g),this._y=Math.atan2(-m,u)):(this._x=0,this._y=Math.atan2(d,M));break;case"XZY":this._z=Math.asin(-Me(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(x,g),this._y=Math.atan2(d,u)):(this._x=Math.atan2(-v,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,r){return oy.makeRotationFromQuaternion(e),this.setFromRotationMatrix(oy,i,r)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return ly.setFromEuler(this),this.setFromQuaternion(ly,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ia.DEFAULT_ORDER="XYZ";class Nx{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let AT=0;const cy=new it,oo=new Hl,Ca=new nn,yu=new it,wl=new it,RT=new it,CT=new Hl,uy=new it(1,0,0),fy=new it(0,1,0),dy=new it(0,0,1),hy={type:"added"},DT={type:"removed"},lo={type:"childadded",child:null},Zh={type:"childremoved",child:null};class ai extends Ro{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:AT++}),this.uuid=Oa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ai.DEFAULT_UP.clone();const e=new it,i=new Ia,r=new Hl,l=new it(1,1,1);function u(){r.setFromEuler(i,!1)}function h(){i.setFromQuaternion(r,void 0,!1)}i._onChange(u),r._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new nn},normalMatrix:{value:new he}}),this.matrix=new nn,this.matrixWorld=new nn,this.matrixAutoUpdate=ai.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ai.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nx,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return oo.setFromAxisAngle(e,i),this.quaternion.multiply(oo),this}rotateOnWorldAxis(e,i){return oo.setFromAxisAngle(e,i),this.quaternion.premultiply(oo),this}rotateX(e){return this.rotateOnAxis(uy,e)}rotateY(e){return this.rotateOnAxis(fy,e)}rotateZ(e){return this.rotateOnAxis(dy,e)}translateOnAxis(e,i){return cy.copy(e).applyQuaternion(this.quaternion),this.position.add(cy.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(uy,e)}translateY(e){return this.translateOnAxis(fy,e)}translateZ(e){return this.translateOnAxis(dy,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ca.copy(this.matrixWorld).invert())}lookAt(e,i,r){e.isVector3?yu.copy(e):yu.set(e,i,r);const l=this.parent;this.updateWorldMatrix(!0,!1),wl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ca.lookAt(wl,yu,this.up):Ca.lookAt(yu,wl,this.up),this.quaternion.setFromRotationMatrix(Ca),l&&(Ca.extractRotation(l.matrixWorld),oo.setFromRotationMatrix(Ca),this.quaternion.premultiply(oo.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(hy),lo.child=e,this.dispatchEvent(lo),lo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(DT),Zh.child=e,this.dispatchEvent(Zh),Zh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ca.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ca.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ca),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(hy),lo.child=e,this.dispatchEvent(lo),lo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let r=0,l=this.children.length;r<l;r++){const h=this.children[r].getObjectByProperty(e,i);if(h!==void 0)return h}}getObjectsByProperty(e,i,r=[]){this[e]===i&&r.push(this);const l=this.children;for(let u=0,h=l.length;u<h;u++)l[u].getObjectsByProperty(e,i,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wl,e,RT),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wl,CT,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].updateMatrixWorld(e)}updateWorldMatrix(e,i){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let u=0,h=l.length;u<h;u++)l[u].updateWorldMatrix(!1,!0)}}toJSON(e){const i=e===void 0||typeof e=="string",r={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.visibility=this._visibility,l.active=this._active,l.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.geometryCount=this._geometryCount,l.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(l.boundingSphere={center:l.boundingSphere.center.toArray(),radius:l.boundingSphere.radius}),this.boundingBox!==null&&(l.boundingBox={min:l.boundingBox.min.toArray(),max:l.boundingBox.max.toArray()}));function u(d,p){return d[p.uuid]===void 0&&(d[p.uuid]=p.toJSON(e)),p.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=u(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const p=d.shapes;if(Array.isArray(p))for(let g=0,v=p.length;g<v;g++){const m=p[g];u(e.shapes,m)}else u(e.shapes,p)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let p=0,g=this.material.length;p<g;p++)d.push(u(e.materials,this.material[p]));l.material=d}else l.material=u(e.materials,this.material);if(this.children.length>0){l.children=[];for(let d=0;d<this.children.length;d++)l.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let d=0;d<this.animations.length;d++){const p=this.animations[d];l.animations.push(u(e.animations,p))}}if(i){const d=h(e.geometries),p=h(e.materials),g=h(e.textures),v=h(e.images),m=h(e.shapes),x=h(e.skeletons),M=h(e.animations),T=h(e.nodes);d.length>0&&(r.geometries=d),p.length>0&&(r.materials=p),g.length>0&&(r.textures=g),v.length>0&&(r.images=v),m.length>0&&(r.shapes=m),x.length>0&&(r.skeletons=x),M.length>0&&(r.animations=M),T.length>0&&(r.nodes=T)}return r.object=l,r;function h(d){const p=[];for(const g in d){const v=d[g];delete v.metadata,p.push(v)}return p}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let r=0;r<e.children.length;r++){const l=e.children[r];this.add(l.clone())}return this}}ai.DEFAULT_UP=new it(0,1,0);ai.DEFAULT_MATRIX_AUTO_UPDATE=!0;ai.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ii=new it,Da=new it,Kh=new it,Na=new it,co=new it,uo=new it,py=new it,Qh=new it,Jh=new it,$h=new it,tp=new Ze,ep=new Ze,np=new Ze;class ki{constructor(e=new it,i=new it,r=new it){this.a=e,this.b=i,this.c=r}static getNormal(e,i,r,l){l.subVectors(r,i),Ii.subVectors(e,i),l.cross(Ii);const u=l.lengthSq();return u>0?l.multiplyScalar(1/Math.sqrt(u)):l.set(0,0,0)}static getBarycoord(e,i,r,l,u){Ii.subVectors(l,i),Da.subVectors(r,i),Kh.subVectors(e,i);const h=Ii.dot(Ii),d=Ii.dot(Da),p=Ii.dot(Kh),g=Da.dot(Da),v=Da.dot(Kh),m=h*g-d*d;if(m===0)return u.set(0,0,0),null;const x=1/m,M=(g*p-d*v)*x,T=(h*v-d*p)*x;return u.set(1-M-T,T,M)}static containsPoint(e,i,r,l){return this.getBarycoord(e,i,r,l,Na)===null?!1:Na.x>=0&&Na.y>=0&&Na.x+Na.y<=1}static getInterpolation(e,i,r,l,u,h,d,p){return this.getBarycoord(e,i,r,l,Na)===null?(p.x=0,p.y=0,"z"in p&&(p.z=0),"w"in p&&(p.w=0),null):(p.setScalar(0),p.addScaledVector(u,Na.x),p.addScaledVector(h,Na.y),p.addScaledVector(d,Na.z),p)}static getInterpolatedAttribute(e,i,r,l,u,h){return tp.setScalar(0),ep.setScalar(0),np.setScalar(0),tp.fromBufferAttribute(e,i),ep.fromBufferAttribute(e,r),np.fromBufferAttribute(e,l),h.setScalar(0),h.addScaledVector(tp,u.x),h.addScaledVector(ep,u.y),h.addScaledVector(np,u.z),h}static isFrontFacing(e,i,r,l){return Ii.subVectors(r,i),Da.subVectors(e,i),Ii.cross(Da).dot(l)<0}set(e,i,r){return this.a.copy(e),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(e,i,r,l){return this.a.copy(e[i]),this.b.copy(e[r]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,r,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ii.subVectors(this.c,this.b),Da.subVectors(this.a,this.b),Ii.cross(Da).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ki.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return ki.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,r,l,u){return ki.getInterpolation(e,this.a,this.b,this.c,i,r,l,u)}containsPoint(e){return ki.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ki.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const r=this.a,l=this.b,u=this.c;let h,d;co.subVectors(l,r),uo.subVectors(u,r),Qh.subVectors(e,r);const p=co.dot(Qh),g=uo.dot(Qh);if(p<=0&&g<=0)return i.copy(r);Jh.subVectors(e,l);const v=co.dot(Jh),m=uo.dot(Jh);if(v>=0&&m<=v)return i.copy(l);const x=p*m-v*g;if(x<=0&&p>=0&&v<=0)return h=p/(p-v),i.copy(r).addScaledVector(co,h);$h.subVectors(e,u);const M=co.dot($h),T=uo.dot($h);if(T>=0&&M<=T)return i.copy(u);const w=M*g-p*T;if(w<=0&&g>=0&&T<=0)return d=g/(g-T),i.copy(r).addScaledVector(uo,d);const S=v*T-M*m;if(S<=0&&m-v>=0&&M-T>=0)return py.subVectors(u,l),d=(m-v)/(m-v+(M-T)),i.copy(l).addScaledVector(py,d);const y=1/(S+w+x);return h=w*y,d=x*y,i.copy(r).addScaledVector(co,h).addScaledVector(uo,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ux={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_r={h:0,s:0,l:0},xu={h:0,s:0,l:0};function ip(o,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?o+(e-o)*6*i:i<1/2?e:i<2/3?o+(e-o)*6*(2/3-i):o}class De{constructor(e,i,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,r)}set(e,i,r){if(i===void 0&&r===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=Ai){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ue.toWorkingColorSpace(this,i),this}setRGB(e,i,r,l=Ue.workingColorSpace){return this.r=e,this.g=i,this.b=r,Ue.toWorkingColorSpace(this,l),this}setHSL(e,i,r,l=Ue.workingColorSpace){if(e=ym(e,1),i=Me(i,0,1),r=Me(r,0,1),i===0)this.r=this.g=this.b=r;else{const u=r<=.5?r*(1+i):r+i-r*i,h=2*r-u;this.r=ip(h,u,e+1/3),this.g=ip(h,u,e),this.b=ip(h,u,e-1/3)}return Ue.toWorkingColorSpace(this,l),this}setStyle(e,i=Ai){function r(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let u;const h=l[1],d=l[2];switch(h){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,i);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,i);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const u=l[1],h=u.length;if(h===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(u,16),i);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=Ai){const r=Ux[e.toLowerCase()];return r!==void 0?this.setHex(r,i):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Pa(e.r),this.g=Pa(e.g),this.b=Pa(e.b),this}copyLinearToSRGB(e){return this.r=xo(e.r),this.g=xo(e.g),this.b=xo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ai){return Ue.fromWorkingColorSpace(kn.copy(this),e),Math.round(Me(kn.r*255,0,255))*65536+Math.round(Me(kn.g*255,0,255))*256+Math.round(Me(kn.b*255,0,255))}getHexString(e=Ai){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Ue.workingColorSpace){Ue.fromWorkingColorSpace(kn.copy(this),i);const r=kn.r,l=kn.g,u=kn.b,h=Math.max(r,l,u),d=Math.min(r,l,u);let p,g;const v=(d+h)/2;if(d===h)p=0,g=0;else{const m=h-d;switch(g=v<=.5?m/(h+d):m/(2-h-d),h){case r:p=(l-u)/m+(l<u?6:0);break;case l:p=(u-r)/m+2;break;case u:p=(r-l)/m+4;break}p/=6}return e.h=p,e.s=g,e.l=v,e}getRGB(e,i=Ue.workingColorSpace){return Ue.fromWorkingColorSpace(kn.copy(this),i),e.r=kn.r,e.g=kn.g,e.b=kn.b,e}getStyle(e=Ai){Ue.fromWorkingColorSpace(kn.copy(this),e);const i=kn.r,r=kn.g,l=kn.b;return e!==Ai?`color(${e} ${i.toFixed(3)} ${r.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(r*255)},${Math.round(l*255)})`}offsetHSL(e,i,r){return this.getHSL(_r),this.setHSL(_r.h+e,_r.s+i,_r.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,r){return this.r=e.r+(i.r-e.r)*r,this.g=e.g+(i.g-e.g)*r,this.b=e.b+(i.b-e.b)*r,this}lerpHSL(e,i){this.getHSL(_r),e.getHSL(xu);const r=Ol(_r.h,xu.h,i),l=Ol(_r.s,xu.s,i),u=Ol(_r.l,xu.l,i);return this.setHSL(r,l,u),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,r=this.g,l=this.b,u=e.elements;return this.r=u[0]*i+u[3]*r+u[6]*l,this.g=u[1]*i+u[4]*r+u[7]*l,this.b=u[2]*i+u[5]*r+u[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const kn=new De;De.NAMES=Ux;let NT=0;class kl extends Ro{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:NT++}),this.uuid=Oa(),this.name="",this.type="Material",this.blending=_o,this.side=Tr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mp,this.blendDst=Ep,this.blendEquation=os,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new De(0,0,0),this.blendAlpha=0,this.depthFunc=So,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ty,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=eo,this.stencilZFail=eo,this.stencilZPass=eo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const r=e[i];if(r===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(r):l&&l.isVector3&&r&&r.isVector3?l.copy(r):this[i]=r}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==_o&&(r.blending=this.blending),this.side!==Tr&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Mp&&(r.blendSrc=this.blendSrc),this.blendDst!==Ep&&(r.blendDst=this.blendDst),this.blendEquation!==os&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==So&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ty&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==eo&&(r.stencilFail=this.stencilFail),this.stencilZFail!==eo&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==eo&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function l(u){const h=[];for(const d in u){const p=u[d];delete p.metadata,h.push(p)}return h}if(i){const u=l(e.textures),h=l(e.images);u.length>0&&(r.textures=u),h.length>0&&(r.images=h)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let r=null;if(i!==null){const l=i.length;r=new Array(l);for(let u=0;u!==l;++u)r[u]=i[u].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class $u extends kl{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new De(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ia,this.combine=mx,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const hn=new it,Su=new Oe;let UT=0;class ji{constructor(e,i,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:UT++}),this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=r,this.usage=om,this.updateRanges=[],this.gpuType=za,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,r){e*=this.itemSize,r*=i.itemSize;for(let l=0,u=this.itemSize;l<u;l++)this.array[e+l]=i.array[r+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,r=this.count;i<r;i++)Su.fromBufferAttribute(this,i),Su.applyMatrix3(e),this.setXY(i,Su.x,Su.y);else if(this.itemSize===3)for(let i=0,r=this.count;i<r;i++)hn.fromBufferAttribute(this,i),hn.applyMatrix3(e),this.setXYZ(i,hn.x,hn.y,hn.z);return this}applyMatrix4(e){for(let i=0,r=this.count;i<r;i++)hn.fromBufferAttribute(this,i),hn.applyMatrix4(e),this.setXYZ(i,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)hn.fromBufferAttribute(this,i),hn.applyNormalMatrix(e),this.setXYZ(i,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)hn.fromBufferAttribute(this,i),hn.transformDirection(e),this.setXYZ(i,hn.x,hn.y,hn.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let r=this.array[e*this.itemSize+i];return this.normalized&&(r=Hi(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=Fe(r,this.array)),this.array[e*this.itemSize+i]=r,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=Hi(i,this.array)),i}setX(e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=Hi(i,this.array)),i}setY(e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=Hi(i,this.array)),i}setZ(e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=Hi(i,this.array)),i}setW(e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,r){return e*=this.itemSize,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array)),this.array[e+0]=i,this.array[e+1]=r,this}setXYZ(e,i,r,l){return e*=this.itemSize,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array),l=Fe(l,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this}setXYZW(e,i,r,l,u){return e*=this.itemSize,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array),l=Fe(l,this.array),u=Fe(u,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this.array[e+3]=u,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==om&&(e.usage=this.usage),e}}class zx extends ji{constructor(e,i,r){super(new Uint16Array(e),i,r)}}class Lx extends ji{constructor(e,i,r){super(new Uint32Array(e),i,r)}}class Pn extends ji{constructor(e,i,r){super(new Float32Array(e),i,r)}}let zT=0;const wi=new nn,ap=new ai,fo=new it,mi=new wr,Al=new wr,bn=new it;class ri extends Ro{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zT++}),this.uuid=Oa(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Rx(e)?Lx:zx)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,r=0){this.groups.push({start:e,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const u=new he().getNormalMatrix(e);r.applyNormalMatrix(u),r.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return wi.makeRotationFromQuaternion(e),this.applyMatrix4(wi),this}rotateX(e){return wi.makeRotationX(e),this.applyMatrix4(wi),this}rotateY(e){return wi.makeRotationY(e),this.applyMatrix4(wi),this}rotateZ(e){return wi.makeRotationZ(e),this.applyMatrix4(wi),this}translate(e,i,r){return wi.makeTranslation(e,i,r),this.applyMatrix4(wi),this}scale(e,i,r){return wi.makeScale(e,i,r),this.applyMatrix4(wi),this}lookAt(e){return ap.lookAt(e),ap.updateMatrix(),this.applyMatrix4(ap.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fo).negate(),this.translate(fo.x,fo.y,fo.z),this}setFromPoints(e){const i=this.getAttribute("position");if(i===void 0){const r=[];for(let l=0,u=e.length;l<u;l++){const h=e[l];r.push(h.x,h.y,h.z||0)}this.setAttribute("position",new Pn(r,3))}else{const r=Math.min(e.length,i.count);for(let l=0;l<r;l++){const u=e[l];i.setXYZ(l,u.x,u.y,u.z||0)}e.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wr);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new it(-1/0,-1/0,-1/0),new it(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let r=0,l=i.length;r<l;r++){const u=i[r];mi.setFromBufferAttribute(u),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,mi.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,mi.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(mi.min),this.boundingBox.expandByPoint(mi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Co);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new it,1/0);return}if(e){const r=this.boundingSphere.center;if(mi.setFromBufferAttribute(e),i)for(let u=0,h=i.length;u<h;u++){const d=i[u];Al.setFromBufferAttribute(d),this.morphTargetsRelative?(bn.addVectors(mi.min,Al.min),mi.expandByPoint(bn),bn.addVectors(mi.max,Al.max),mi.expandByPoint(bn)):(mi.expandByPoint(Al.min),mi.expandByPoint(Al.max))}mi.getCenter(r);let l=0;for(let u=0,h=e.count;u<h;u++)bn.fromBufferAttribute(e,u),l=Math.max(l,r.distanceToSquared(bn));if(i)for(let u=0,h=i.length;u<h;u++){const d=i[u],p=this.morphTargetsRelative;for(let g=0,v=d.count;g<v;g++)bn.fromBufferAttribute(d,g),p&&(fo.fromBufferAttribute(e,g),bn.add(fo)),l=Math.max(l,r.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=i.position,l=i.normal,u=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ji(new Float32Array(4*r.count),4));const h=this.getAttribute("tangent"),d=[],p=[];for(let F=0;F<r.count;F++)d[F]=new it,p[F]=new it;const g=new it,v=new it,m=new it,x=new Oe,M=new Oe,T=new Oe,w=new it,S=new it;function y(F,R,E){g.fromBufferAttribute(r,F),v.fromBufferAttribute(r,R),m.fromBufferAttribute(r,E),x.fromBufferAttribute(u,F),M.fromBufferAttribute(u,R),T.fromBufferAttribute(u,E),v.sub(g),m.sub(g),M.sub(x),T.sub(x);const L=1/(M.x*T.y-T.x*M.y);isFinite(L)&&(w.copy(v).multiplyScalar(T.y).addScaledVector(m,-M.y).multiplyScalar(L),S.copy(m).multiplyScalar(M.x).addScaledVector(v,-T.x).multiplyScalar(L),d[F].add(w),d[R].add(w),d[E].add(w),p[F].add(S),p[R].add(S),p[E].add(S))}let P=this.groups;P.length===0&&(P=[{start:0,count:e.count}]);for(let F=0,R=P.length;F<R;++F){const E=P[F],L=E.start,et=E.count;for(let K=L,ft=L+et;K<ft;K+=3)y(e.getX(K+0),e.getX(K+1),e.getX(K+2))}const z=new it,N=new it,X=new it,H=new it;function B(F){X.fromBufferAttribute(l,F),H.copy(X);const R=d[F];z.copy(R),z.sub(X.multiplyScalar(X.dot(R))).normalize(),N.crossVectors(H,R);const L=N.dot(p[F])<0?-1:1;h.setXYZW(F,z.x,z.y,z.z,L)}for(let F=0,R=P.length;F<R;++F){const E=P[F],L=E.start,et=E.count;for(let K=L,ft=L+et;K<ft;K+=3)B(e.getX(K+0)),B(e.getX(K+1)),B(e.getX(K+2))}}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new ji(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let x=0,M=r.count;x<M;x++)r.setXYZ(x,0,0,0);const l=new it,u=new it,h=new it,d=new it,p=new it,g=new it,v=new it,m=new it;if(e)for(let x=0,M=e.count;x<M;x+=3){const T=e.getX(x+0),w=e.getX(x+1),S=e.getX(x+2);l.fromBufferAttribute(i,T),u.fromBufferAttribute(i,w),h.fromBufferAttribute(i,S),v.subVectors(h,u),m.subVectors(l,u),v.cross(m),d.fromBufferAttribute(r,T),p.fromBufferAttribute(r,w),g.fromBufferAttribute(r,S),d.add(v),p.add(v),g.add(v),r.setXYZ(T,d.x,d.y,d.z),r.setXYZ(w,p.x,p.y,p.z),r.setXYZ(S,g.x,g.y,g.z)}else for(let x=0,M=i.count;x<M;x+=3)l.fromBufferAttribute(i,x+0),u.fromBufferAttribute(i,x+1),h.fromBufferAttribute(i,x+2),v.subVectors(h,u),m.subVectors(l,u),v.cross(m),r.setXYZ(x+0,v.x,v.y,v.z),r.setXYZ(x+1,v.x,v.y,v.z),r.setXYZ(x+2,v.x,v.y,v.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,r=e.count;i<r;i++)bn.fromBufferAttribute(e,i),bn.normalize(),e.setXYZ(i,bn.x,bn.y,bn.z)}toNonIndexed(){function e(d,p){const g=d.array,v=d.itemSize,m=d.normalized,x=new g.constructor(p.length*v);let M=0,T=0;for(let w=0,S=p.length;w<S;w++){d.isInterleavedBufferAttribute?M=p[w]*d.data.stride+d.offset:M=p[w]*v;for(let y=0;y<v;y++)x[T++]=g[M++]}return new ji(x,v,m)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new ri,r=this.index.array,l=this.attributes;for(const d in l){const p=l[d],g=e(p,r);i.setAttribute(d,g)}const u=this.morphAttributes;for(const d in u){const p=[],g=u[d];for(let v=0,m=g.length;v<m;v++){const x=g[v],M=e(x,r);p.push(M)}i.morphAttributes[d]=p}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let d=0,p=h.length;d<p;d++){const g=h[d];i.addGroup(g.start,g.count,g.materialIndex)}return i}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const p=this.parameters;for(const g in p)p[g]!==void 0&&(e[g]=p[g]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const r=this.attributes;for(const p in r){const g=r[p];e.data.attributes[p]=g.toJSON(e.data)}const l={};let u=!1;for(const p in this.morphAttributes){const g=this.morphAttributes[p],v=[];for(let m=0,x=g.length;m<x;m++){const M=g[m];v.push(M.toJSON(e.data))}v.length>0&&(l[p]=v,u=!0)}u&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(e.data.groups=JSON.parse(JSON.stringify(h)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(i));const l=e.attributes;for(const g in l){const v=l[g];this.setAttribute(g,v.clone(i))}const u=e.morphAttributes;for(const g in u){const v=[],m=u[g];for(let x=0,M=m.length;x<M;x++)v.push(m[x].clone(i));this.morphAttributes[g]=v}this.morphTargetsRelative=e.morphTargetsRelative;const h=e.groups;for(let g=0,v=h.length;g<v;g++){const m=h[g];this.addGroup(m.start,m.count,m.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const p=e.boundingSphere;return p!==null&&(this.boundingSphere=p.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const my=new nn,$r=new Dx,Mu=new Co,gy=new it,Eu=new it,bu=new it,Tu=new it,rp=new it,wu=new it,vy=new it,Au=new it;class Ci extends ai{constructor(e=new ri,i=new $u){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,h=l.length;u<h;u++){const d=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=u}}}}getVertexPosition(e,i){const r=this.geometry,l=r.attributes.position,u=r.morphAttributes.position,h=r.morphTargetsRelative;i.fromBufferAttribute(l,e);const d=this.morphTargetInfluences;if(u&&d){wu.set(0,0,0);for(let p=0,g=u.length;p<g;p++){const v=d[p],m=u[p];v!==0&&(rp.fromBufferAttribute(m,e),h?wu.addScaledVector(rp,v):wu.addScaledVector(rp.sub(i),v))}i.add(wu)}return i}raycast(e,i){const r=this.geometry,l=this.material,u=this.matrixWorld;l!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Mu.copy(r.boundingSphere),Mu.applyMatrix4(u),$r.copy(e.ray).recast(e.near),!(Mu.containsPoint($r.origin)===!1&&($r.intersectSphere(Mu,gy)===null||$r.origin.distanceToSquared(gy)>(e.far-e.near)**2))&&(my.copy(u).invert(),$r.copy(e.ray).applyMatrix4(my),!(r.boundingBox!==null&&$r.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,i,$r)))}_computeIntersections(e,i,r){let l;const u=this.geometry,h=this.material,d=u.index,p=u.attributes.position,g=u.attributes.uv,v=u.attributes.uv1,m=u.attributes.normal,x=u.groups,M=u.drawRange;if(d!==null)if(Array.isArray(h))for(let T=0,w=x.length;T<w;T++){const S=x[T],y=h[S.materialIndex],P=Math.max(S.start,M.start),z=Math.min(d.count,Math.min(S.start+S.count,M.start+M.count));for(let N=P,X=z;N<X;N+=3){const H=d.getX(N),B=d.getX(N+1),F=d.getX(N+2);l=Ru(this,y,e,r,g,v,m,H,B,F),l&&(l.faceIndex=Math.floor(N/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const T=Math.max(0,M.start),w=Math.min(d.count,M.start+M.count);for(let S=T,y=w;S<y;S+=3){const P=d.getX(S),z=d.getX(S+1),N=d.getX(S+2);l=Ru(this,h,e,r,g,v,m,P,z,N),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}else if(p!==void 0)if(Array.isArray(h))for(let T=0,w=x.length;T<w;T++){const S=x[T],y=h[S.materialIndex],P=Math.max(S.start,M.start),z=Math.min(p.count,Math.min(S.start+S.count,M.start+M.count));for(let N=P,X=z;N<X;N+=3){const H=N,B=N+1,F=N+2;l=Ru(this,y,e,r,g,v,m,H,B,F),l&&(l.faceIndex=Math.floor(N/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const T=Math.max(0,M.start),w=Math.min(p.count,M.start+M.count);for(let S=T,y=w;S<y;S+=3){const P=S,z=S+1,N=S+2;l=Ru(this,h,e,r,g,v,m,P,z,N),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}}}function LT(o,e,i,r,l,u,h,d){let p;if(e.side===ni?p=r.intersectTriangle(h,u,l,!0,d):p=r.intersectTriangle(l,u,h,e.side===Tr,d),p===null)return null;Au.copy(d),Au.applyMatrix4(o.matrixWorld);const g=i.ray.origin.distanceTo(Au);return g<i.near||g>i.far?null:{distance:g,point:Au.clone(),object:o}}function Ru(o,e,i,r,l,u,h,d,p,g){o.getVertexPosition(d,Eu),o.getVertexPosition(p,bu),o.getVertexPosition(g,Tu);const v=LT(o,e,i,r,Eu,bu,Tu,vy);if(v){const m=new it;ki.getBarycoord(vy,Eu,bu,Tu,m),l&&(v.uv=ki.getInterpolatedAttribute(l,d,p,g,m,new Oe)),u&&(v.uv1=ki.getInterpolatedAttribute(u,d,p,g,m,new Oe)),h&&(v.normal=ki.getInterpolatedAttribute(h,d,p,g,m,new it),v.normal.dot(r.direction)>0&&v.normal.multiplyScalar(-1));const x={a:d,b:p,c:g,normal:new it,materialIndex:0};ki.getNormal(Eu,bu,Tu,x.normal),v.face=x,v.barycoord=m}return v}class Gl extends ri{constructor(e=1,i=1,r=1,l=1,u=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:r,widthSegments:l,heightSegments:u,depthSegments:h};const d=this;l=Math.floor(l),u=Math.floor(u),h=Math.floor(h);const p=[],g=[],v=[],m=[];let x=0,M=0;T("z","y","x",-1,-1,r,i,e,h,u,0),T("z","y","x",1,-1,r,i,-e,h,u,1),T("x","z","y",1,1,e,r,i,l,h,2),T("x","z","y",1,-1,e,r,-i,l,h,3),T("x","y","z",1,-1,e,i,r,l,u,4),T("x","y","z",-1,-1,e,i,-r,l,u,5),this.setIndex(p),this.setAttribute("position",new Pn(g,3)),this.setAttribute("normal",new Pn(v,3)),this.setAttribute("uv",new Pn(m,2));function T(w,S,y,P,z,N,X,H,B,F,R){const E=N/B,L=X/F,et=N/2,K=X/2,ft=H/2,st=B+1,k=F+1;let Y=0,q=0;const _t=new it;for(let mt=0;mt<k;mt++){const At=mt*L-K;for(let Wt=0;Wt<st;Wt++){const Kt=Wt*E-et;_t[w]=Kt*P,_t[S]=At*z,_t[y]=ft,g.push(_t.x,_t.y,_t.z),_t[w]=0,_t[S]=0,_t[y]=H>0?1:-1,v.push(_t.x,_t.y,_t.z),m.push(Wt/B),m.push(1-mt/F),Y+=1}}for(let mt=0;mt<F;mt++)for(let At=0;At<B;At++){const Wt=x+At+st*mt,Kt=x+At+st*(mt+1),U=x+(At+1)+st*(mt+1),Q=x+(At+1)+st*mt;p.push(Wt,Kt,Q),p.push(Kt,U,Q),q+=6}d.addGroup(M,q,R),M+=q,x+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gl(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ao(o){const e={};for(const i in o){e[i]={};for(const r in o[i]){const l=o[i][r];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][r]=null):e[i][r]=l.clone():Array.isArray(l)?e[i][r]=l.slice():e[i][r]=l}}return e}function Wn(o){const e={};for(let i=0;i<o.length;i++){const r=Ao(o[i]);for(const l in r)e[l]=r[l]}return e}function OT(o){const e=[];for(let i=0;i<o.length;i++)e.push(o[i].clone());return e}function Ox(o){const e=o.getRenderTarget();return e===null?o.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ue.workingColorSpace}const Sm={clone:Ao,merge:Wn};var PT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,BT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fa extends kl{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=PT,this.fragmentShader=BT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ao(e.uniforms),this.uniformsGroups=OT(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(e).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const r={};for(const l in this.extensions)this.extensions[l]===!0&&(r[l]=!0);return Object.keys(r).length>0&&(i.extensions=r),i}}class Px extends ai{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new nn,this.projectionMatrix=new nn,this.projectionMatrixInverse=new nn,this.coordinateSystem=La}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const yr=new it,_y=new Oe,yy=new Oe;class Ri extends Px{constructor(e=50,i=1,r=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=Il*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ll*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Il*2*Math.atan(Math.tan(Ll*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,r){yr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(yr.x,yr.y).multiplyScalar(-e/yr.z),yr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(yr.x,yr.y).multiplyScalar(-e/yr.z)}getViewSize(e,i){return this.getViewBounds(e,_y,yy),i.subVectors(yy,_y)}setViewOffset(e,i,r,l,u,h){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(Ll*.5*this.fov)/this.zoom,r=2*i,l=this.aspect*r,u=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const p=h.fullWidth,g=h.fullHeight;u+=h.offsetX*l/p,i-=h.offsetY*r/g,l*=h.width/p,r*=h.height/g}const d=this.filmOffset;d!==0&&(u+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+l,i,i-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const ho=-90,po=1;class IT extends ai{constructor(e,i,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Ri(ho,po,e,i);l.layers=this.layers,this.add(l);const u=new Ri(ho,po,e,i);u.layers=this.layers,this.add(u);const h=new Ri(ho,po,e,i);h.layers=this.layers,this.add(h);const d=new Ri(ho,po,e,i);d.layers=this.layers,this.add(d);const p=new Ri(ho,po,e,i);p.layers=this.layers,this.add(p);const g=new Ri(ho,po,e,i);g.layers=this.layers,this.add(g)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[r,l,u,h,d,p]=i;for(const g of i)this.remove(g);if(e===La)r.up.set(0,1,0),r.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),p.up.set(0,1,0),p.lookAt(0,0,-1);else if(e===Qu)r.up.set(0,-1,0),r.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),p.up.set(0,-1,0),p.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const g of i)this.add(g),g.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[u,h,d,p,g,v]=this.children,m=e.getRenderTarget(),x=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),T=e.xr.enabled;e.xr.enabled=!1;const w=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,l),e.render(i,u),e.setRenderTarget(r,1,l),e.render(i,h),e.setRenderTarget(r,2,l),e.render(i,d),e.setRenderTarget(r,3,l),e.render(i,p),e.setRenderTarget(r,4,l),e.render(i,g),r.texture.generateMipmaps=w,e.setRenderTarget(r,5,l),e.render(i,v),e.setRenderTarget(m,x,M),e.xr.enabled=T,r.texture.needsPMREMUpdate=!0}}class Bx extends ii{constructor(e,i,r,l,u,h,d,p,g,v){e=e!==void 0?e:[],i=i!==void 0?i:Mo,super(e,i,r,l,u,h,d,p,g,v),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class FT extends hs{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},l=[r,r,r,r,r,r];this.texture=new Bx(l,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:oa}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},l=new Gl(5,5,5),u=new Fa({name:"CubemapFromEquirect",uniforms:Ao(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:ni,blending:Er});u.uniforms.tEquirect.value=i;const h=new Ci(l,u),d=i.minFilter;return i.minFilter===us&&(i.minFilter=oa),new IT(1,10,this).update(e,h),i.minFilter=d,h.geometry.dispose(),h.material.dispose(),this}clear(e,i,r,l){const u=e.getRenderTarget();for(let h=0;h<6;h++)e.setRenderTarget(this,h),e.clear(i,r,l);e.setRenderTarget(u)}}class Sr extends ai{constructor(){super(),this.isGroup=!0,this.type="Group"}}const HT={type:"move"};class sp{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Sr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Sr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new it,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new it),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Sr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new it,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new it),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const r of e.hand.values())this._getHandJoint(i,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,r){let l=null,u=null,h=null;const d=this._targetRay,p=this._grip,g=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(g&&e.hand){h=!0;for(const w of e.hand.values()){const S=i.getJointPose(w,r),y=this._getHandJoint(g,w);S!==null&&(y.matrix.fromArray(S.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=S.radius),y.visible=S!==null}const v=g.joints["index-finger-tip"],m=g.joints["thumb-tip"],x=v.position.distanceTo(m.position),M=.02,T=.005;g.inputState.pinching&&x>M+T?(g.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!g.inputState.pinching&&x<=M-T&&(g.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else p!==null&&e.gripSpace&&(u=i.getPose(e.gripSpace,r),u!==null&&(p.matrix.fromArray(u.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,u.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(u.linearVelocity)):p.hasLinearVelocity=!1,u.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(u.angularVelocity)):p.hasAngularVelocity=!1));d!==null&&(l=i.getPose(e.targetRaySpace,r),l===null&&u!==null&&(l=u),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(HT)))}return d!==null&&(d.visible=l!==null),p!==null&&(p.visible=u!==null),g!==null&&(g.visible=h!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const r=new Sr;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[i.jointName]=r,e.add(r)}return e.joints[i.jointName]}}class kT extends ai{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ia,this.environmentIntensity=1,this.environmentRotation=new Ia,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}class GT{constructor(e,i){this.isInterleavedBuffer=!0,this.array=e,this.stride=i,this.count=e!==void 0?e.length/i:0,this.usage=om,this.updateRanges=[],this.version=0,this.uuid=Oa()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,i,r){e*=this.stride,r*=i.stride;for(let l=0,u=this.stride;l<u;l++)this.array[e+l]=i.array[r+l];return this}set(e,i=0){return this.array.set(e,i),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Oa()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const i=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),r=new this.constructor(i,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Oa()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const qn=new it;class Mr{constructor(e,i,r,l=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=i,this.offset=r,this.normalized=l}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let i=0,r=this.data.count;i<r;i++)qn.fromBufferAttribute(this,i),qn.applyMatrix4(e),this.setXYZ(i,qn.x,qn.y,qn.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)qn.fromBufferAttribute(this,i),qn.applyNormalMatrix(e),this.setXYZ(i,qn.x,qn.y,qn.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)qn.fromBufferAttribute(this,i),qn.transformDirection(e),this.setXYZ(i,qn.x,qn.y,qn.z);return this}getComponent(e,i){let r=this.array[e*this.data.stride+this.offset+i];return this.normalized&&(r=Hi(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=Fe(r,this.array)),this.data.array[e*this.data.stride+this.offset+i]=r,this}setX(e,i){return this.normalized&&(i=Fe(i,this.array)),this.data.array[e*this.data.stride+this.offset]=i,this}setY(e,i){return this.normalized&&(i=Fe(i,this.array)),this.data.array[e*this.data.stride+this.offset+1]=i,this}setZ(e,i){return this.normalized&&(i=Fe(i,this.array)),this.data.array[e*this.data.stride+this.offset+2]=i,this}setW(e,i){return this.normalized&&(i=Fe(i,this.array)),this.data.array[e*this.data.stride+this.offset+3]=i,this}getX(e){let i=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(i=Hi(i,this.array)),i}getY(e){let i=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(i=Hi(i,this.array)),i}getZ(e){let i=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(i=Hi(i,this.array)),i}getW(e){let i=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(i=Hi(i,this.array)),i}setXY(e,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array)),this.data.array[e+0]=i,this.data.array[e+1]=r,this}setXYZ(e,i,r,l){return e=e*this.data.stride+this.offset,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array),l=Fe(l,this.array)),this.data.array[e+0]=i,this.data.array[e+1]=r,this.data.array[e+2]=l,this}setXYZW(e,i,r,l,u){return e=e*this.data.stride+this.offset,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array),l=Fe(l,this.array),u=Fe(u,this.array)),this.data.array[e+0]=i,this.data.array[e+1]=r,this.data.array[e+2]=l,this.data.array[e+3]=u,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const i=[];for(let r=0;r<this.count;r++){const l=r*this.data.stride+this.offset;for(let u=0;u<this.itemSize;u++)i.push(this.data.array[l+u])}return new ji(new this.array.constructor(i),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Mr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const i=[];for(let r=0;r<this.count;r++){const l=r*this.data.stride+this.offset;for(let u=0;u<this.itemSize;u++)i.push(this.data.array[l+u])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:i,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const op=new it,VT=new it,jT=new he;class rs{constructor(e=new it(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,r,l){return this.normal.set(e,i,r),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,r){const l=op.subVectors(r,i).cross(VT.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i){const r=e.delta(op),l=this.normal.dot(r);if(l===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const u=-(e.start.dot(this.normal)+this.constant)/l;return u<0||u>1?null:i.copy(e.start).addScaledVector(r,u)}intersectsLine(e){const i=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return i<0&&r>0||r<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const r=i||jT.getNormalMatrix(e),l=this.coplanarPoint(op).applyMatrix4(e),u=this.normal.applyMatrix3(r).normalize();return this.constant=-l.dot(u),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ts=new Co,Cu=new it;class Ix{constructor(e=new rs,i=new rs,r=new rs,l=new rs,u=new rs,h=new rs){this.planes=[e,i,r,l,u,h]}set(e,i,r,l,u,h){const d=this.planes;return d[0].copy(e),d[1].copy(i),d[2].copy(r),d[3].copy(l),d[4].copy(u),d[5].copy(h),this}copy(e){const i=this.planes;for(let r=0;r<6;r++)i[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,i=La){const r=this.planes,l=e.elements,u=l[0],h=l[1],d=l[2],p=l[3],g=l[4],v=l[5],m=l[6],x=l[7],M=l[8],T=l[9],w=l[10],S=l[11],y=l[12],P=l[13],z=l[14],N=l[15];if(r[0].setComponents(p-u,x-g,S-M,N-y).normalize(),r[1].setComponents(p+u,x+g,S+M,N+y).normalize(),r[2].setComponents(p+h,x+v,S+T,N+P).normalize(),r[3].setComponents(p-h,x-v,S-T,N-P).normalize(),r[4].setComponents(p-d,x-m,S-w,N-z).normalize(),i===La)r[5].setComponents(p+d,x+m,S+w,N+z).normalize();else if(i===Qu)r[5].setComponents(d,m,w,z).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),ts.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){return ts.center.set(0,0,0),ts.radius=.7071067811865476,ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){const i=this.planes,r=e.center,l=-e.radius;for(let u=0;u<6;u++)if(i[u].distanceToPoint(r)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let r=0;r<6;r++){const l=i[r];if(Cu.x=l.normal.x>0?e.max.x:e.min.x,Cu.y=l.normal.y>0?e.max.y:e.min.y,Cu.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(Cu)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let r=0;r<6;r++)if(i[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Mm extends kl{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new De(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const tf=new it,ef=new it,xy=new nn,Rl=new Dx,Du=new Co,lp=new it,Sy=new it;class Fx extends ai{constructor(e=new ri,i=new Mm){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[0];for(let l=1,u=i.count;l<u;l++)tf.fromBufferAttribute(i,l-1),ef.fromBufferAttribute(i,l),r[l]=r[l-1],r[l]+=tf.distanceTo(ef);e.setAttribute("lineDistance",new Pn(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,i){const r=this.geometry,l=this.matrixWorld,u=e.params.Line.threshold,h=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),Du.copy(r.boundingSphere),Du.applyMatrix4(l),Du.radius+=u,e.ray.intersectsSphere(Du)===!1)return;xy.copy(l).invert(),Rl.copy(e.ray).applyMatrix4(xy);const d=u/((this.scale.x+this.scale.y+this.scale.z)/3),p=d*d,g=this.isLineSegments?2:1,v=r.index,x=r.attributes.position;if(v!==null){const M=Math.max(0,h.start),T=Math.min(v.count,h.start+h.count);for(let w=M,S=T-1;w<S;w+=g){const y=v.getX(w),P=v.getX(w+1),z=Nu(this,e,Rl,p,y,P,w);z&&i.push(z)}if(this.isLineLoop){const w=v.getX(T-1),S=v.getX(M),y=Nu(this,e,Rl,p,w,S,T-1);y&&i.push(y)}}else{const M=Math.max(0,h.start),T=Math.min(x.count,h.start+h.count);for(let w=M,S=T-1;w<S;w+=g){const y=Nu(this,e,Rl,p,w,w+1,w);y&&i.push(y)}if(this.isLineLoop){const w=Nu(this,e,Rl,p,T-1,M,T-1);w&&i.push(w)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,h=l.length;u<h;u++){const d=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=u}}}}}function Nu(o,e,i,r,l,u,h){const d=o.geometry.attributes.position;if(tf.fromBufferAttribute(d,l),ef.fromBufferAttribute(d,u),i.distanceSqToSegment(tf,ef,lp,Sy)>r)return;lp.applyMatrix4(o.matrixWorld);const g=e.ray.origin.distanceTo(lp);if(!(g<e.near||g>e.far))return{distance:g,point:Sy.clone().applyMatrix4(o.matrixWorld),index:h,face:null,faceIndex:null,barycoord:null,object:o}}const My=new it,Ey=new it;class XT extends Fx{constructor(e,i){super(e,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[];for(let l=0,u=i.count;l<u;l+=2)My.fromBufferAttribute(i,l),Ey.fromBufferAttribute(i,l+1),r[l]=l===0?0:r[l-1],r[l+1]=r[l]+My.distanceTo(Ey);e.setAttribute("lineDistance",new Pn(r,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Hx extends ii{constructor(e,i,r,l,u,h,d,p,g,v=yo){if(v!==yo&&v!==To)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&v===yo&&(r=ds),r===void 0&&v===To&&(r=bo),super(null,l,u,h,d,p,v,r,g),this.isDepthTexture=!0,this.image={width:e,height:i},this.magFilter=d!==void 0?d:Vi,this.minFilter=p!==void 0?p:Vi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new xm(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Em extends ri{constructor(e=1,i=1,r=1,l=32,u=1,h=!1,d=0,p=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:i,height:r,radialSegments:l,heightSegments:u,openEnded:h,thetaStart:d,thetaLength:p};const g=this;l=Math.floor(l),u=Math.floor(u);const v=[],m=[],x=[],M=[];let T=0;const w=[],S=r/2;let y=0;P(),h===!1&&(e>0&&z(!0),i>0&&z(!1)),this.setIndex(v),this.setAttribute("position",new Pn(m,3)),this.setAttribute("normal",new Pn(x,3)),this.setAttribute("uv",new Pn(M,2));function P(){const N=new it,X=new it;let H=0;const B=(i-e)/r;for(let F=0;F<=u;F++){const R=[],E=F/u,L=E*(i-e)+e;for(let et=0;et<=l;et++){const K=et/l,ft=K*p+d,st=Math.sin(ft),k=Math.cos(ft);X.x=L*st,X.y=-E*r+S,X.z=L*k,m.push(X.x,X.y,X.z),N.set(st,B,k).normalize(),x.push(N.x,N.y,N.z),M.push(K,1-E),R.push(T++)}w.push(R)}for(let F=0;F<l;F++)for(let R=0;R<u;R++){const E=w[R][F],L=w[R+1][F],et=w[R+1][F+1],K=w[R][F+1];(e>0||R!==0)&&(v.push(E,L,K),H+=3),(i>0||R!==u-1)&&(v.push(L,et,K),H+=3)}g.addGroup(y,H,0),y+=H}function z(N){const X=T,H=new Oe,B=new it;let F=0;const R=N===!0?e:i,E=N===!0?1:-1;for(let et=1;et<=l;et++)m.push(0,S*E,0),x.push(0,E,0),M.push(.5,.5),T++;const L=T;for(let et=0;et<=l;et++){const ft=et/l*p+d,st=Math.cos(ft),k=Math.sin(ft);B.x=R*k,B.y=S*E,B.z=R*st,m.push(B.x,B.y,B.z),x.push(0,E,0),H.x=st*.5+.5,H.y=k*.5*E+.5,M.push(H.x,H.y),T++}for(let et=0;et<l;et++){const K=X+et,ft=L+et;N===!0?v.push(ft,ft+1,K):v.push(ft+1,ft,K),F+=3}g.addGroup(y,F,N===!0?1:2),y+=F}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Em(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class bm extends Em{constructor(e=1,i=1,r=32,l=1,u=!1,h=0,d=Math.PI*2){super(0,e,i,r,l,u,h,d),this.type="ConeGeometry",this.parameters={radius:e,height:i,radialSegments:r,heightSegments:l,openEnded:u,thetaStart:h,thetaLength:d}}static fromJSON(e){return new bm(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class af extends ri{constructor(e=1,i=1,r=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:r,heightSegments:l};const u=e/2,h=i/2,d=Math.floor(r),p=Math.floor(l),g=d+1,v=p+1,m=e/d,x=i/p,M=[],T=[],w=[],S=[];for(let y=0;y<v;y++){const P=y*x-h;for(let z=0;z<g;z++){const N=z*m-u;T.push(N,-P,0),w.push(0,0,1),S.push(z/d),S.push(1-y/p)}}for(let y=0;y<p;y++)for(let P=0;P<d;P++){const z=P+g*y,N=P+g*(y+1),X=P+1+g*(y+1),H=P+1+g*y;M.push(z,N,H),M.push(N,X,H)}this.setIndex(M),this.setAttribute("position",new Pn(T,3)),this.setAttribute("normal",new Pn(w,3)),this.setAttribute("uv",new Pn(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new af(e.width,e.height,e.widthSegments,e.heightSegments)}}class qT extends ri{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const i=[],r=new Set,l=new it,u=new it;if(e.index!==null){const h=e.attributes.position,d=e.index;let p=e.groups;p.length===0&&(p=[{start:0,count:d.count,materialIndex:0}]);for(let g=0,v=p.length;g<v;++g){const m=p[g],x=m.start,M=m.count;for(let T=x,w=x+M;T<w;T+=3)for(let S=0;S<3;S++){const y=d.getX(T+S),P=d.getX(T+(S+1)%3);l.fromBufferAttribute(h,y),u.fromBufferAttribute(h,P),by(l,u,r)===!0&&(i.push(l.x,l.y,l.z),i.push(u.x,u.y,u.z))}}}else{const h=e.attributes.position;for(let d=0,p=h.count/3;d<p;d++)for(let g=0;g<3;g++){const v=3*d+g,m=3*d+(g+1)%3;l.fromBufferAttribute(h,v),u.fromBufferAttribute(h,m),by(l,u,r)===!0&&(i.push(l.x,l.y,l.z),i.push(u.x,u.y,u.z))}}this.setAttribute("position",new Pn(i,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function by(o,e,i){const r=`${o.x},${o.y},${o.z}-${e.x},${e.y},${e.z}`,l=`${e.x},${e.y},${e.z}-${o.x},${o.y},${o.z}`;return i.has(r)===!0||i.has(l)===!0?!1:(i.add(r),i.add(l),!0)}class WT extends kl{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hb,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class YT extends kl{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ZT extends Px{constructor(e=-1,i=1,r=1,l=-1,u=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=r,this.bottom=l,this.near=u,this.far=h,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,r,l,u,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let u=r-e,h=r+e,d=l+i,p=l-i;if(this.view!==null&&this.view.enabled){const g=(this.right-this.left)/this.view.fullWidth/this.zoom,v=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=g*this.view.offsetX,h=u+g*this.view.width,d-=v*this.view.offsetY,p=d-v*this.view.height}this.projectionMatrix.makeOrthographic(u,h,d,p,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class KT extends ri{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class QT extends Ri{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e,this.index=0}}class lm extends GT{constructor(e,i,r=1){super(e,i),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const i=super.clone(e);return i.meshPerAttribute=this.meshPerAttribute,i}toJSON(e){const i=super.toJSON(e);return i.isInstancedInterleavedBuffer=!0,i.meshPerAttribute=this.meshPerAttribute,i}}const Ty=new it,Uu=new it;class JT{constructor(e=new it,i=new it){this.start=e,this.end=i}set(e,i){return this.start.copy(e),this.end.copy(i),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,i){return this.delta(i).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,i){Ty.subVectors(e,this.start),Uu.subVectors(this.end,this.start);const r=Uu.dot(Uu);let u=Uu.dot(Ty)/r;return i&&(u=Me(u,0,1)),u}closestPointToPoint(e,i,r){const l=this.closestPointToPointParameter(e,i);return this.delta(r).multiplyScalar(l).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class $T extends XT{constructor(e=10,i=10,r=4473924,l=8947848){r=new De(r),l=new De(l);const u=i/2,h=e/i,d=e/2,p=[],g=[];for(let x=0,M=0,T=-d;x<=i;x++,T+=h){p.push(-d,0,T,d,0,T),p.push(T,0,-d,T,0,d);const w=x===u?r:l;w.toArray(g,M),M+=3,w.toArray(g,M),M+=3,w.toArray(g,M),M+=3,w.toArray(g,M),M+=3}const v=new ri;v.setAttribute("position",new Pn(p,3)),v.setAttribute("color",new Pn(g,3));const m=new Mm({vertexColors:!0,toneMapped:!1});super(v,m),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}function wy(o,e,i,r){const l=t1(r);switch(i){case xx:return o*e;case Mx:return o*e;case Ex:return o*e*2;case bx:return o*e/l.components*l.byteLength;case gm:return o*e/l.components*l.byteLength;case Tx:return o*e*2/l.components*l.byteLength;case vm:return o*e*2/l.components*l.byteLength;case Sx:return o*e*3/l.components*l.byteLength;case Gi:return o*e*4/l.components*l.byteLength;case _m:return o*e*4/l.components*l.byteLength;case ku:case Gu:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case Vu:case ju:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case Pp:case Ip:return Math.max(o,16)*Math.max(e,8)/4;case Op:case Bp:return Math.max(o,8)*Math.max(e,8)/2;case Fp:case Hp:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case kp:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case Gp:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case Vp:return Math.floor((o+4)/5)*Math.floor((e+3)/4)*16;case jp:return Math.floor((o+4)/5)*Math.floor((e+4)/5)*16;case Xp:return Math.floor((o+5)/6)*Math.floor((e+4)/5)*16;case qp:return Math.floor((o+5)/6)*Math.floor((e+5)/6)*16;case Wp:return Math.floor((o+7)/8)*Math.floor((e+4)/5)*16;case Yp:return Math.floor((o+7)/8)*Math.floor((e+5)/6)*16;case Zp:return Math.floor((o+7)/8)*Math.floor((e+7)/8)*16;case Kp:return Math.floor((o+9)/10)*Math.floor((e+4)/5)*16;case Qp:return Math.floor((o+9)/10)*Math.floor((e+5)/6)*16;case Jp:return Math.floor((o+9)/10)*Math.floor((e+7)/8)*16;case $p:return Math.floor((o+9)/10)*Math.floor((e+9)/10)*16;case tm:return Math.floor((o+11)/12)*Math.floor((e+9)/10)*16;case em:return Math.floor((o+11)/12)*Math.floor((e+11)/12)*16;case Xu:case nm:case im:return Math.ceil(o/4)*Math.ceil(e/4)*16;case wx:case am:return Math.ceil(o/4)*Math.ceil(e/4)*8;case rm:case sm:return Math.ceil(o/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function t1(o){switch(o){case Ba:case vx:return{byteLength:1,components:1};case Bl:case _x:case Fl:return{byteLength:2,components:1};case pm:case mm:return{byteLength:2,components:4};case ds:case hm:case za:return{byteLength:4,components:1};case yx:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${o}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dm}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dm);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function kx(){let o=null,e=!1,i=null,r=null;function l(u,h){i(u,h),r=o.requestAnimationFrame(l)}return{start:function(){e!==!0&&i!==null&&(r=o.requestAnimationFrame(l),e=!0)},stop:function(){o.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(u){i=u},setContext:function(u){o=u}}}function e1(o){const e=new WeakMap;function i(d,p){const g=d.array,v=d.usage,m=g.byteLength,x=o.createBuffer();o.bindBuffer(p,x),o.bufferData(p,g,v),d.onUploadCallback();let M;if(g instanceof Float32Array)M=o.FLOAT;else if(g instanceof Uint16Array)d.isFloat16BufferAttribute?M=o.HALF_FLOAT:M=o.UNSIGNED_SHORT;else if(g instanceof Int16Array)M=o.SHORT;else if(g instanceof Uint32Array)M=o.UNSIGNED_INT;else if(g instanceof Int32Array)M=o.INT;else if(g instanceof Int8Array)M=o.BYTE;else if(g instanceof Uint8Array)M=o.UNSIGNED_BYTE;else if(g instanceof Uint8ClampedArray)M=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+g);return{buffer:x,type:M,bytesPerElement:g.BYTES_PER_ELEMENT,version:d.version,size:m}}function r(d,p,g){const v=p.array,m=p.updateRanges;if(o.bindBuffer(g,d),m.length===0)o.bufferSubData(g,0,v);else{m.sort((M,T)=>M.start-T.start);let x=0;for(let M=1;M<m.length;M++){const T=m[x],w=m[M];w.start<=T.start+T.count+1?T.count=Math.max(T.count,w.start+w.count-T.start):(++x,m[x]=w)}m.length=x+1;for(let M=0,T=m.length;M<T;M++){const w=m[M];o.bufferSubData(g,w.start*v.BYTES_PER_ELEMENT,v,w.start,w.count)}p.clearUpdateRanges()}p.onUploadCallback()}function l(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function u(d){d.isInterleavedBufferAttribute&&(d=d.data);const p=e.get(d);p&&(o.deleteBuffer(p.buffer),e.delete(d))}function h(d,p){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const v=e.get(d);(!v||v.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const g=e.get(d);if(g===void 0)e.set(d,i(d,p));else if(g.version<d.version){if(g.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(g.buffer,d,p),g.version=d.version}}return{get:l,remove:u,update:h}}var n1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,i1=`#ifdef USE_ALPHAHASH
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
#endif`,a1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,r1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,s1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,o1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,l1=`#ifdef USE_AOMAP
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
#endif`,c1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,u1=`#ifdef USE_BATCHING
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
#endif`,f1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,d1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,h1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,p1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,m1=`#ifdef USE_IRIDESCENCE
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
#endif`,g1=`#ifdef USE_BUMPMAP
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
#endif`,v1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,_1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,y1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,x1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,S1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,M1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,E1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,b1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,T1=`#define PI 3.141592653589793
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
} // validated`,w1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,A1=`vec3 transformedNormal = objectNormal;
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
#endif`,R1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,C1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,D1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,N1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,U1="gl_FragColor = linearToOutputTexel( gl_FragColor );",z1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,L1=`#ifdef USE_ENVMAP
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
#endif`,O1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,P1=`#ifdef USE_ENVMAP
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
#endif`,B1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,I1=`#ifdef USE_ENVMAP
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
#endif`,F1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,H1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,k1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,G1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,V1=`#ifdef USE_GRADIENTMAP
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
}`,j1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,X1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,q1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,W1=`uniform bool receiveShadow;
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
#endif`,Y1=`#ifdef USE_ENVMAP
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
#endif`,Z1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,K1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Q1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,J1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$1=`PhysicalMaterial material;
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
#endif`,tw=`struct PhysicalMaterial {
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
}`,ew=`
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
#endif`,nw=`#if defined( RE_IndirectDiffuse )
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
#endif`,iw=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,aw=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rw=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sw=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ow=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,uw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,fw=`#if defined( USE_POINTS_UV )
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
#endif`,dw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vw=`#ifdef USE_MORPHTARGETS
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
#endif`,_w=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,xw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ew=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bw=`#ifdef USE_NORMALMAP
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
#endif`,Tw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ww=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Aw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Dw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Nw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Uw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Lw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ow=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Pw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Bw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Iw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Hw=`float getShadowMask() {
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
}`,kw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gw=`#ifdef USE_SKINNING
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
#endif`,Vw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jw=`#ifdef USE_SKINNING
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
#endif`,Xw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ww=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Yw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zw=`#ifdef USE_TRANSMISSION
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
#endif`,Kw=`#ifdef USE_TRANSMISSION
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
#endif`,Qw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$w=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const eA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nA=`uniform sampler2D t2D;
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
}`,iA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aA=`#ifdef ENVMAP_TYPE_CUBE
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
}`,rA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oA=`#include <common>
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
}`,lA=`#if DEPTH_PACKING == 3200
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
}`,cA=`#define DISTANCE
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
}`,uA=`#define DISTANCE
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
}`,fA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hA=`uniform float scale;
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
}`,pA=`uniform vec3 diffuse;
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
}`,mA=`#include <common>
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
}`,gA=`uniform vec3 diffuse;
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
}`,vA=`#define LAMBERT
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
}`,_A=`#define LAMBERT
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
}`,yA=`#define MATCAP
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
}`,xA=`#define MATCAP
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
}`,SA=`#define NORMAL
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
}`,MA=`#define NORMAL
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
}`,EA=`#define PHONG
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
}`,bA=`#define PHONG
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
}`,TA=`#define STANDARD
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
}`,wA=`#define STANDARD
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
}`,AA=`#define TOON
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
}`,RA=`#define TOON
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
}`,CA=`uniform float size;
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
}`,DA=`uniform vec3 diffuse;
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
}`,NA=`#include <common>
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
}`,UA=`uniform vec3 color;
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
}`,zA=`uniform float rotation;
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
}`,LA=`uniform vec3 diffuse;
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
}`,me={alphahash_fragment:n1,alphahash_pars_fragment:i1,alphamap_fragment:a1,alphamap_pars_fragment:r1,alphatest_fragment:s1,alphatest_pars_fragment:o1,aomap_fragment:l1,aomap_pars_fragment:c1,batching_pars_vertex:u1,batching_vertex:f1,begin_vertex:d1,beginnormal_vertex:h1,bsdfs:p1,iridescence_fragment:m1,bumpmap_pars_fragment:g1,clipping_planes_fragment:v1,clipping_planes_pars_fragment:_1,clipping_planes_pars_vertex:y1,clipping_planes_vertex:x1,color_fragment:S1,color_pars_fragment:M1,color_pars_vertex:E1,color_vertex:b1,common:T1,cube_uv_reflection_fragment:w1,defaultnormal_vertex:A1,displacementmap_pars_vertex:R1,displacementmap_vertex:C1,emissivemap_fragment:D1,emissivemap_pars_fragment:N1,colorspace_fragment:U1,colorspace_pars_fragment:z1,envmap_fragment:L1,envmap_common_pars_fragment:O1,envmap_pars_fragment:P1,envmap_pars_vertex:B1,envmap_physical_pars_fragment:Y1,envmap_vertex:I1,fog_vertex:F1,fog_pars_vertex:H1,fog_fragment:k1,fog_pars_fragment:G1,gradientmap_pars_fragment:V1,lightmap_pars_fragment:j1,lights_lambert_fragment:X1,lights_lambert_pars_fragment:q1,lights_pars_begin:W1,lights_toon_fragment:Z1,lights_toon_pars_fragment:K1,lights_phong_fragment:Q1,lights_phong_pars_fragment:J1,lights_physical_fragment:$1,lights_physical_pars_fragment:tw,lights_fragment_begin:ew,lights_fragment_maps:nw,lights_fragment_end:iw,logdepthbuf_fragment:aw,logdepthbuf_pars_fragment:rw,logdepthbuf_pars_vertex:sw,logdepthbuf_vertex:ow,map_fragment:lw,map_pars_fragment:cw,map_particle_fragment:uw,map_particle_pars_fragment:fw,metalnessmap_fragment:dw,metalnessmap_pars_fragment:hw,morphinstance_vertex:pw,morphcolor_vertex:mw,morphnormal_vertex:gw,morphtarget_pars_vertex:vw,morphtarget_vertex:_w,normal_fragment_begin:yw,normal_fragment_maps:xw,normal_pars_fragment:Sw,normal_pars_vertex:Mw,normal_vertex:Ew,normalmap_pars_fragment:bw,clearcoat_normal_fragment_begin:Tw,clearcoat_normal_fragment_maps:ww,clearcoat_pars_fragment:Aw,iridescence_pars_fragment:Rw,opaque_fragment:Cw,packing:Dw,premultiplied_alpha_fragment:Nw,project_vertex:Uw,dithering_fragment:zw,dithering_pars_fragment:Lw,roughnessmap_fragment:Ow,roughnessmap_pars_fragment:Pw,shadowmap_pars_fragment:Bw,shadowmap_pars_vertex:Iw,shadowmap_vertex:Fw,shadowmask_pars_fragment:Hw,skinbase_vertex:kw,skinning_pars_vertex:Gw,skinning_vertex:Vw,skinnormal_vertex:jw,specularmap_fragment:Xw,specularmap_pars_fragment:qw,tonemapping_fragment:Ww,tonemapping_pars_fragment:Yw,transmission_fragment:Zw,transmission_pars_fragment:Kw,uv_pars_fragment:Qw,uv_pars_vertex:Jw,uv_vertex:$w,worldpos_vertex:tA,background_vert:eA,background_frag:nA,backgroundCube_vert:iA,backgroundCube_frag:aA,cube_vert:rA,cube_frag:sA,depth_vert:oA,depth_frag:lA,distanceRGBA_vert:cA,distanceRGBA_frag:uA,equirect_vert:fA,equirect_frag:dA,linedashed_vert:hA,linedashed_frag:pA,meshbasic_vert:mA,meshbasic_frag:gA,meshlambert_vert:vA,meshlambert_frag:_A,meshmatcap_vert:yA,meshmatcap_frag:xA,meshnormal_vert:SA,meshnormal_frag:MA,meshphong_vert:EA,meshphong_frag:bA,meshphysical_vert:TA,meshphysical_frag:wA,meshtoon_vert:AA,meshtoon_frag:RA,points_vert:CA,points_frag:DA,shadow_vert:NA,shadow_frag:UA,sprite_vert:zA,sprite_frag:LA},Pt={common:{diffuse:{value:new De(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new he},alphaMap:{value:null},alphaMapTransform:{value:new he},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new he}},envmap:{envMap:{value:null},envMapRotation:{value:new he},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new he}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new he}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new he},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new he},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new he},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new he}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new he}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new he}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new De(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new De(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new he},alphaTest:{value:0},uvTransform:{value:new he}},sprite:{diffuse:{value:new De(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new he},alphaMap:{value:null},alphaMapTransform:{value:new he},alphaTest:{value:0}}},ei={basic:{uniforms:Wn([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.fog]),vertexShader:me.meshbasic_vert,fragmentShader:me.meshbasic_frag},lambert:{uniforms:Wn([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new De(0)}}]),vertexShader:me.meshlambert_vert,fragmentShader:me.meshlambert_frag},phong:{uniforms:Wn([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new De(0)},specular:{value:new De(1118481)},shininess:{value:30}}]),vertexShader:me.meshphong_vert,fragmentShader:me.meshphong_frag},standard:{uniforms:Wn([Pt.common,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.roughnessmap,Pt.metalnessmap,Pt.fog,Pt.lights,{emissive:{value:new De(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:me.meshphysical_vert,fragmentShader:me.meshphysical_frag},toon:{uniforms:Wn([Pt.common,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.gradientmap,Pt.fog,Pt.lights,{emissive:{value:new De(0)}}]),vertexShader:me.meshtoon_vert,fragmentShader:me.meshtoon_frag},matcap:{uniforms:Wn([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,{matcap:{value:null}}]),vertexShader:me.meshmatcap_vert,fragmentShader:me.meshmatcap_frag},points:{uniforms:Wn([Pt.points,Pt.fog]),vertexShader:me.points_vert,fragmentShader:me.points_frag},dashed:{uniforms:Wn([Pt.common,Pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:me.linedashed_vert,fragmentShader:me.linedashed_frag},depth:{uniforms:Wn([Pt.common,Pt.displacementmap]),vertexShader:me.depth_vert,fragmentShader:me.depth_frag},normal:{uniforms:Wn([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,{opacity:{value:1}}]),vertexShader:me.meshnormal_vert,fragmentShader:me.meshnormal_frag},sprite:{uniforms:Wn([Pt.sprite,Pt.fog]),vertexShader:me.sprite_vert,fragmentShader:me.sprite_frag},background:{uniforms:{uvTransform:{value:new he},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:me.background_vert,fragmentShader:me.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new he}},vertexShader:me.backgroundCube_vert,fragmentShader:me.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:me.cube_vert,fragmentShader:me.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:me.equirect_vert,fragmentShader:me.equirect_frag},distanceRGBA:{uniforms:Wn([Pt.common,Pt.displacementmap,{referencePosition:{value:new it},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:me.distanceRGBA_vert,fragmentShader:me.distanceRGBA_frag},shadow:{uniforms:Wn([Pt.lights,Pt.fog,{color:{value:new De(0)},opacity:{value:1}}]),vertexShader:me.shadow_vert,fragmentShader:me.shadow_frag}};ei.physical={uniforms:Wn([ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new he},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new he},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new he},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new he},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new he},sheen:{value:0},sheenColor:{value:new De(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new he},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new he},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new he},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new he},attenuationDistance:{value:0},attenuationColor:{value:new De(0)},specularColor:{value:new De(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new he},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new he},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new he}}]),vertexShader:me.meshphysical_vert,fragmentShader:me.meshphysical_frag};const zu={r:0,b:0,g:0},es=new Ia,OA=new nn;function PA(o,e,i,r,l,u,h){const d=new De(0);let p=u===!0?0:1,g,v,m=null,x=0,M=null;function T(z){let N=z.isScene===!0?z.background:null;return N&&N.isTexture&&(N=(z.backgroundBlurriness>0?i:e).get(N)),N}function w(z){let N=!1;const X=T(z);X===null?y(d,p):X&&X.isColor&&(y(X,1),N=!0);const H=o.xr.getEnvironmentBlendMode();H==="additive"?r.buffers.color.setClear(0,0,0,1,h):H==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,h),(o.autoClear||N)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil))}function S(z,N){const X=T(N);X&&(X.isCubeTexture||X.mapping===nf)?(v===void 0&&(v=new Ci(new Gl(1,1,1),new Fa({name:"BackgroundCubeMaterial",uniforms:Ao(ei.backgroundCube.uniforms),vertexShader:ei.backgroundCube.vertexShader,fragmentShader:ei.backgroundCube.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1})),v.geometry.deleteAttribute("normal"),v.geometry.deleteAttribute("uv"),v.onBeforeRender=function(H,B,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(v.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(v)),es.copy(N.backgroundRotation),es.x*=-1,es.y*=-1,es.z*=-1,X.isCubeTexture&&X.isRenderTargetTexture===!1&&(es.y*=-1,es.z*=-1),v.material.uniforms.envMap.value=X,v.material.uniforms.flipEnvMap.value=X.isCubeTexture&&X.isRenderTargetTexture===!1?-1:1,v.material.uniforms.backgroundBlurriness.value=N.backgroundBlurriness,v.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,v.material.uniforms.backgroundRotation.value.setFromMatrix4(OA.makeRotationFromEuler(es)),v.material.toneMapped=Ue.getTransfer(X.colorSpace)!==Ge,(m!==X||x!==X.version||M!==o.toneMapping)&&(v.material.needsUpdate=!0,m=X,x=X.version,M=o.toneMapping),v.layers.enableAll(),z.unshift(v,v.geometry,v.material,0,0,null)):X&&X.isTexture&&(g===void 0&&(g=new Ci(new af(2,2),new Fa({name:"BackgroundMaterial",uniforms:Ao(ei.background.uniforms),vertexShader:ei.background.vertexShader,fragmentShader:ei.background.fragmentShader,side:Tr,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),Object.defineProperty(g.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(g)),g.material.uniforms.t2D.value=X,g.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,g.material.toneMapped=Ue.getTransfer(X.colorSpace)!==Ge,X.matrixAutoUpdate===!0&&X.updateMatrix(),g.material.uniforms.uvTransform.value.copy(X.matrix),(m!==X||x!==X.version||M!==o.toneMapping)&&(g.material.needsUpdate=!0,m=X,x=X.version,M=o.toneMapping),g.layers.enableAll(),z.unshift(g,g.geometry,g.material,0,0,null))}function y(z,N){z.getRGB(zu,Ox(o)),r.buffers.color.setClear(zu.r,zu.g,zu.b,N,h)}function P(){v!==void 0&&(v.geometry.dispose(),v.material.dispose(),v=void 0),g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0)}return{getClearColor:function(){return d},setClearColor:function(z,N=1){d.set(z),p=N,y(d,p)},getClearAlpha:function(){return p},setClearAlpha:function(z){p=z,y(d,p)},render:w,addToRenderList:S,dispose:P}}function BA(o,e){const i=o.getParameter(o.MAX_VERTEX_ATTRIBS),r={},l=x(null);let u=l,h=!1;function d(E,L,et,K,ft){let st=!1;const k=m(K,et,L);u!==k&&(u=k,g(u.object)),st=M(E,K,et,ft),st&&T(E,K,et,ft),ft!==null&&e.update(ft,o.ELEMENT_ARRAY_BUFFER),(st||h)&&(h=!1,N(E,L,et,K),ft!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e.get(ft).buffer))}function p(){return o.createVertexArray()}function g(E){return o.bindVertexArray(E)}function v(E){return o.deleteVertexArray(E)}function m(E,L,et){const K=et.wireframe===!0;let ft=r[E.id];ft===void 0&&(ft={},r[E.id]=ft);let st=ft[L.id];st===void 0&&(st={},ft[L.id]=st);let k=st[K];return k===void 0&&(k=x(p()),st[K]=k),k}function x(E){const L=[],et=[],K=[];for(let ft=0;ft<i;ft++)L[ft]=0,et[ft]=0,K[ft]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:et,attributeDivisors:K,object:E,attributes:{},index:null}}function M(E,L,et,K){const ft=u.attributes,st=L.attributes;let k=0;const Y=et.getAttributes();for(const q in Y)if(Y[q].location>=0){const mt=ft[q];let At=st[q];if(At===void 0&&(q==="instanceMatrix"&&E.instanceMatrix&&(At=E.instanceMatrix),q==="instanceColor"&&E.instanceColor&&(At=E.instanceColor)),mt===void 0||mt.attribute!==At||At&&mt.data!==At.data)return!0;k++}return u.attributesNum!==k||u.index!==K}function T(E,L,et,K){const ft={},st=L.attributes;let k=0;const Y=et.getAttributes();for(const q in Y)if(Y[q].location>=0){let mt=st[q];mt===void 0&&(q==="instanceMatrix"&&E.instanceMatrix&&(mt=E.instanceMatrix),q==="instanceColor"&&E.instanceColor&&(mt=E.instanceColor));const At={};At.attribute=mt,mt&&mt.data&&(At.data=mt.data),ft[q]=At,k++}u.attributes=ft,u.attributesNum=k,u.index=K}function w(){const E=u.newAttributes;for(let L=0,et=E.length;L<et;L++)E[L]=0}function S(E){y(E,0)}function y(E,L){const et=u.newAttributes,K=u.enabledAttributes,ft=u.attributeDivisors;et[E]=1,K[E]===0&&(o.enableVertexAttribArray(E),K[E]=1),ft[E]!==L&&(o.vertexAttribDivisor(E,L),ft[E]=L)}function P(){const E=u.newAttributes,L=u.enabledAttributes;for(let et=0,K=L.length;et<K;et++)L[et]!==E[et]&&(o.disableVertexAttribArray(et),L[et]=0)}function z(E,L,et,K,ft,st,k){k===!0?o.vertexAttribIPointer(E,L,et,ft,st):o.vertexAttribPointer(E,L,et,K,ft,st)}function N(E,L,et,K){w();const ft=K.attributes,st=et.getAttributes(),k=L.defaultAttributeValues;for(const Y in st){const q=st[Y];if(q.location>=0){let _t=ft[Y];if(_t===void 0&&(Y==="instanceMatrix"&&E.instanceMatrix&&(_t=E.instanceMatrix),Y==="instanceColor"&&E.instanceColor&&(_t=E.instanceColor)),_t!==void 0){const mt=_t.normalized,At=_t.itemSize,Wt=e.get(_t);if(Wt===void 0)continue;const Kt=Wt.buffer,U=Wt.type,Q=Wt.bytesPerElement,vt=U===o.INT||U===o.UNSIGNED_INT||_t.gpuType===hm;if(_t.isInterleavedBufferAttribute){const dt=_t.data,wt=dt.stride,kt=_t.offset;if(dt.isInstancedInterleavedBuffer){for(let Et=0;Et<q.locationSize;Et++)y(q.location+Et,dt.meshPerAttribute);E.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let Et=0;Et<q.locationSize;Et++)S(q.location+Et);o.bindBuffer(o.ARRAY_BUFFER,Kt);for(let Et=0;Et<q.locationSize;Et++)z(q.location+Et,At/q.locationSize,U,mt,wt*Q,(kt+At/q.locationSize*Et)*Q,vt)}else{if(_t.isInstancedBufferAttribute){for(let dt=0;dt<q.locationSize;dt++)y(q.location+dt,_t.meshPerAttribute);E.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=_t.meshPerAttribute*_t.count)}else for(let dt=0;dt<q.locationSize;dt++)S(q.location+dt);o.bindBuffer(o.ARRAY_BUFFER,Kt);for(let dt=0;dt<q.locationSize;dt++)z(q.location+dt,At/q.locationSize,U,mt,At*Q,At/q.locationSize*dt*Q,vt)}}else if(k!==void 0){const mt=k[Y];if(mt!==void 0)switch(mt.length){case 2:o.vertexAttrib2fv(q.location,mt);break;case 3:o.vertexAttrib3fv(q.location,mt);break;case 4:o.vertexAttrib4fv(q.location,mt);break;default:o.vertexAttrib1fv(q.location,mt)}}}}P()}function X(){F();for(const E in r){const L=r[E];for(const et in L){const K=L[et];for(const ft in K)v(K[ft].object),delete K[ft];delete L[et]}delete r[E]}}function H(E){if(r[E.id]===void 0)return;const L=r[E.id];for(const et in L){const K=L[et];for(const ft in K)v(K[ft].object),delete K[ft];delete L[et]}delete r[E.id]}function B(E){for(const L in r){const et=r[L];if(et[E.id]===void 0)continue;const K=et[E.id];for(const ft in K)v(K[ft].object),delete K[ft];delete et[E.id]}}function F(){R(),h=!0,u!==l&&(u=l,g(u.object))}function R(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:F,resetDefaultState:R,dispose:X,releaseStatesOfGeometry:H,releaseStatesOfProgram:B,initAttributes:w,enableAttribute:S,disableUnusedAttributes:P}}function IA(o,e,i){let r;function l(g){r=g}function u(g,v){o.drawArrays(r,g,v),i.update(v,r,1)}function h(g,v,m){m!==0&&(o.drawArraysInstanced(r,g,v,m),i.update(v,r,m))}function d(g,v,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,g,0,v,0,m);let M=0;for(let T=0;T<m;T++)M+=v[T];i.update(M,r,1)}function p(g,v,m,x){if(m===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let T=0;T<g.length;T++)h(g[T],v[T],x[T]);else{M.multiDrawArraysInstancedWEBGL(r,g,0,v,0,x,0,m);let T=0;for(let w=0;w<m;w++)T+=v[w]*x[w];i.update(T,r,1)}}this.setMode=l,this.render=u,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function FA(o,e,i,r){let l;function u(){if(l!==void 0)return l;if(e.has("EXT_texture_filter_anisotropic")===!0){const B=e.get("EXT_texture_filter_anisotropic");l=o.getParameter(B.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function h(B){return!(B!==Gi&&r.convert(B)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(B){const F=B===Fl&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(B!==Ba&&r.convert(B)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_TYPE)&&B!==za&&!F)}function p(B){if(B==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";B="mediump"}return B==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let g=i.precision!==void 0?i.precision:"highp";const v=p(g);v!==g&&(console.warn("THREE.WebGLRenderer:",g,"not supported, using",v,"instead."),g=v);const m=i.logarithmicDepthBuffer===!0,x=i.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),M=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),T=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=o.getParameter(o.MAX_TEXTURE_SIZE),S=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),y=o.getParameter(o.MAX_VERTEX_ATTRIBS),P=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),z=o.getParameter(o.MAX_VARYING_VECTORS),N=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),X=T>0,H=o.getParameter(o.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:u,getMaxPrecision:p,textureFormatReadable:h,textureTypeReadable:d,precision:g,logarithmicDepthBuffer:m,reverseDepthBuffer:x,maxTextures:M,maxVertexTextures:T,maxTextureSize:w,maxCubemapSize:S,maxAttributes:y,maxVertexUniforms:P,maxVaryings:z,maxFragmentUniforms:N,vertexTextures:X,maxSamples:H}}function HA(o){const e=this;let i=null,r=0,l=!1,u=!1;const h=new rs,d=new he,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(m,x){const M=m.length!==0||x||r!==0||l;return l=x,r=m.length,M},this.beginShadows=function(){u=!0,v(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(m,x){i=v(m,x,0)},this.setState=function(m,x,M){const T=m.clippingPlanes,w=m.clipIntersection,S=m.clipShadows,y=o.get(m);if(!l||T===null||T.length===0||u&&!S)u?v(null):g();else{const P=u?0:r,z=P*4;let N=y.clippingState||null;p.value=N,N=v(T,x,z,M);for(let X=0;X!==z;++X)N[X]=i[X];y.clippingState=N,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=P}};function g(){p.value!==i&&(p.value=i,p.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function v(m,x,M,T){const w=m!==null?m.length:0;let S=null;if(w!==0){if(S=p.value,T!==!0||S===null){const y=M+w*4,P=x.matrixWorldInverse;d.getNormalMatrix(P),(S===null||S.length<y)&&(S=new Float32Array(y));for(let z=0,N=M;z!==w;++z,N+=4)h.copy(m[z]).applyMatrix4(P,d),h.normal.toArray(S,N),S[N+3]=h.constant}p.value=S,p.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,S}}function kA(o){let e=new WeakMap;function i(h,d){return d===Np?h.mapping=Mo:d===Up&&(h.mapping=Eo),h}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===Np||d===Up)if(e.has(h)){const p=e.get(h).texture;return i(p,h.mapping)}else{const p=h.image;if(p&&p.height>0){const g=new FT(p.height);return g.fromEquirectangularTexture(o,h),e.set(h,g),h.addEventListener("dispose",l),i(g.texture,h.mapping)}else return null}}return h}function l(h){const d=h.target;d.removeEventListener("dispose",l);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function u(){e=new WeakMap}return{get:r,dispose:u}}const go=4,Ay=[.125,.215,.35,.446,.526,.582],ls=20,cp=new ZT,Ry=new De;let up=null,fp=0,dp=0,hp=!1;const ss=(1+Math.sqrt(5))/2,mo=1/ss,Cy=[new it(-ss,mo,0),new it(ss,mo,0),new it(-mo,0,ss),new it(mo,0,ss),new it(0,ss,-mo),new it(0,ss,mo),new it(-1,1,-1),new it(1,1,-1),new it(-1,1,1),new it(1,1,1)],GA=new it;class Dy{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,i=0,r=.1,l=100,u={}){const{size:h=256,position:d=GA}=u;up=this._renderer.getRenderTarget(),fp=this._renderer.getActiveCubeFace(),dp=this._renderer.getActiveMipmapLevel(),hp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(h);const p=this._allocateTargets();return p.depthBuffer=!0,this._sceneToCubeUV(e,r,l,p,d),i>0&&this._blur(p,0,0,i),this._applyPMREM(p),this._cleanup(p),p}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zy(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uy(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(up,fp,dp),this._renderer.xr.enabled=hp,e.scissorTest=!1,Lu(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===Mo||e.mapping===Eo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),up=this._renderer.getRenderTarget(),fp=this._renderer.getActiveCubeFace(),dp=this._renderer.getActiveMipmapLevel(),hp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=i||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,r={magFilter:oa,minFilter:oa,generateMipmaps:!1,type:Fl,format:Gi,colorSpace:wo,depthBuffer:!1},l=Ny(e,i,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ny(e,i,r);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=VA(u)),this._blurMaterial=jA(u,e,i)}return l}_compileMaterial(e){const i=new Ci(this._lodPlanes[0],e);this._renderer.compile(i,cp)}_sceneToCubeUV(e,i,r,l,u){const p=new Ri(90,1,i,r),g=[1,-1,1,1,1,1],v=[1,1,1,-1,-1,-1],m=this._renderer,x=m.autoClear,M=m.toneMapping;m.getClearColor(Ry),m.toneMapping=br,m.autoClear=!1;const T=new $u({name:"PMREM.Background",side:ni,depthWrite:!1,depthTest:!1}),w=new Ci(new Gl,T);let S=!1;const y=e.background;y?y.isColor&&(T.color.copy(y),e.background=null,S=!0):(T.color.copy(Ry),S=!0);for(let P=0;P<6;P++){const z=P%3;z===0?(p.up.set(0,g[P],0),p.position.set(u.x,u.y,u.z),p.lookAt(u.x+v[P],u.y,u.z)):z===1?(p.up.set(0,0,g[P]),p.position.set(u.x,u.y,u.z),p.lookAt(u.x,u.y+v[P],u.z)):(p.up.set(0,g[P],0),p.position.set(u.x,u.y,u.z),p.lookAt(u.x,u.y,u.z+v[P]));const N=this._cubeSize;Lu(l,z*N,P>2?N:0,N,N),m.setRenderTarget(l),S&&m.render(w,p),m.render(e,p)}w.geometry.dispose(),w.material.dispose(),m.toneMapping=M,m.autoClear=x,e.background=y}_textureToCubeUV(e,i){const r=this._renderer,l=e.mapping===Mo||e.mapping===Eo;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=zy()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Uy());const u=l?this._cubemapMaterial:this._equirectMaterial,h=new Ci(this._lodPlanes[0],u),d=u.uniforms;d.envMap.value=e;const p=this._cubeSize;Lu(i,0,0,3*p,2*p),r.setRenderTarget(i),r.render(h,cp)}_applyPMREM(e){const i=this._renderer,r=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let u=1;u<l;u++){const h=Math.sqrt(this._sigmas[u]*this._sigmas[u]-this._sigmas[u-1]*this._sigmas[u-1]),d=Cy[(l-u-1)%Cy.length];this._blur(e,u-1,u,h,d)}i.autoClear=r}_blur(e,i,r,l,u){const h=this._pingPongRenderTarget;this._halfBlur(e,h,i,r,l,"latitudinal",u),this._halfBlur(h,e,r,r,l,"longitudinal",u)}_halfBlur(e,i,r,l,u,h,d){const p=this._renderer,g=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const v=3,m=new Ci(this._lodPlanes[l],g),x=g.uniforms,M=this._sizeLods[r]-1,T=isFinite(u)?Math.PI/(2*M):2*Math.PI/(2*ls-1),w=u/T,S=isFinite(u)?1+Math.floor(v*w):ls;S>ls&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${ls}`);const y=[];let P=0;for(let B=0;B<ls;++B){const F=B/w,R=Math.exp(-F*F/2);y.push(R),B===0?P+=R:B<S&&(P+=2*R)}for(let B=0;B<y.length;B++)y[B]=y[B]/P;x.envMap.value=e.texture,x.samples.value=S,x.weights.value=y,x.latitudinal.value=h==="latitudinal",d&&(x.poleAxis.value=d);const{_lodMax:z}=this;x.dTheta.value=T,x.mipInt.value=z-r;const N=this._sizeLods[l],X=3*N*(l>z-go?l-z+go:0),H=4*(this._cubeSize-N);Lu(i,X,H,3*N,2*N),p.setRenderTarget(i),p.render(m,cp)}}function VA(o){const e=[],i=[],r=[];let l=o;const u=o-go+1+Ay.length;for(let h=0;h<u;h++){const d=Math.pow(2,l);i.push(d);let p=1/d;h>o-go?p=Ay[h-o+go-1]:h===0&&(p=0),r.push(p);const g=1/(d-2),v=-g,m=1+g,x=[v,v,m,v,m,m,v,v,m,m,v,m],M=6,T=6,w=3,S=2,y=1,P=new Float32Array(w*T*M),z=new Float32Array(S*T*M),N=new Float32Array(y*T*M);for(let H=0;H<M;H++){const B=H%3*2/3-1,F=H>2?0:-1,R=[B,F,0,B+2/3,F,0,B+2/3,F+1,0,B,F,0,B+2/3,F+1,0,B,F+1,0];P.set(R,w*T*H),z.set(x,S*T*H);const E=[H,H,H,H,H,H];N.set(E,y*T*H)}const X=new ri;X.setAttribute("position",new ji(P,w)),X.setAttribute("uv",new ji(z,S)),X.setAttribute("faceIndex",new ji(N,y)),e.push(X),l>go&&l--}return{lodPlanes:e,sizeLods:i,sigmas:r}}function Ny(o,e,i){const r=new hs(o,e,i);return r.texture.mapping=nf,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Lu(o,e,i,r,l){o.viewport.set(e,i,r,l),o.scissor.set(e,i,r,l)}function jA(o,e,i){const r=new Float32Array(ls),l=new it(0,1,0);return new Fa({name:"SphericalGaussianBlur",defines:{n:ls,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Tm(),fragmentShader:`

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
		`,blending:Er,depthTest:!1,depthWrite:!1})}function Uy(){return new Fa({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tm(),fragmentShader:`

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
		`,blending:Er,depthTest:!1,depthWrite:!1})}function zy(){return new Fa({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Er,depthTest:!1,depthWrite:!1})}function Tm(){return`

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
	`}function XA(o){let e=new WeakMap,i=null;function r(d){if(d&&d.isTexture){const p=d.mapping,g=p===Np||p===Up,v=p===Mo||p===Eo;if(g||v){let m=e.get(d);const x=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==x)return i===null&&(i=new Dy(o)),m=g?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),m.texture;if(m!==void 0)return m.texture;{const M=d.image;return g&&M&&M.height>0||v&&M&&l(M)?(i===null&&(i=new Dy(o)),m=g?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),d.addEventListener("dispose",u),m.texture):null}}}return d}function l(d){let p=0;const g=6;for(let v=0;v<g;v++)d[v]!==void 0&&p++;return p===g}function u(d){const p=d.target;p.removeEventListener("dispose",u);const g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function h(){e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function qA(o){const e={};function i(r){if(e[r]!==void 0)return e[r];let l;switch(r){case"WEBGL_depth_texture":l=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=o.getExtension(r)}return e[r]=l,l}return{has:function(r){return i(r)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(r){const l=i(r);return l===null&&as("THREE.WebGLRenderer: "+r+" extension not supported."),l}}}function WA(o,e,i,r){const l={},u=new WeakMap;function h(m){const x=m.target;x.index!==null&&e.remove(x.index);for(const T in x.attributes)e.remove(x.attributes[T]);x.removeEventListener("dispose",h),delete l[x.id];const M=u.get(x);M&&(e.remove(M),u.delete(x)),r.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,i.memory.geometries--}function d(m,x){return l[x.id]===!0||(x.addEventListener("dispose",h),l[x.id]=!0,i.memory.geometries++),x}function p(m){const x=m.attributes;for(const M in x)e.update(x[M],o.ARRAY_BUFFER)}function g(m){const x=[],M=m.index,T=m.attributes.position;let w=0;if(M!==null){const P=M.array;w=M.version;for(let z=0,N=P.length;z<N;z+=3){const X=P[z+0],H=P[z+1],B=P[z+2];x.push(X,H,H,B,B,X)}}else if(T!==void 0){const P=T.array;w=T.version;for(let z=0,N=P.length/3-1;z<N;z+=3){const X=z+0,H=z+1,B=z+2;x.push(X,H,H,B,B,X)}}else return;const S=new(Rx(x)?Lx:zx)(x,1);S.version=w;const y=u.get(m);y&&e.remove(y),u.set(m,S)}function v(m){const x=u.get(m);if(x){const M=m.index;M!==null&&x.version<M.version&&g(m)}else g(m);return u.get(m)}return{get:d,update:p,getWireframeAttribute:v}}function YA(o,e,i){let r;function l(x){r=x}let u,h;function d(x){u=x.type,h=x.bytesPerElement}function p(x,M){o.drawElements(r,M,u,x*h),i.update(M,r,1)}function g(x,M,T){T!==0&&(o.drawElementsInstanced(r,M,u,x*h,T),i.update(M,r,T))}function v(x,M,T){if(T===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,M,0,u,x,0,T);let S=0;for(let y=0;y<T;y++)S+=M[y];i.update(S,r,1)}function m(x,M,T,w){if(T===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let y=0;y<x.length;y++)g(x[y]/h,M[y],w[y]);else{S.multiDrawElementsInstancedWEBGL(r,M,0,u,x,0,w,0,T);let y=0;for(let P=0;P<T;P++)y+=M[P]*w[P];i.update(y,r,1)}}this.setMode=l,this.setIndex=d,this.render=p,this.renderInstances=g,this.renderMultiDraw=v,this.renderMultiDrawInstances=m}function ZA(o){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(u,h,d){switch(i.calls++,h){case o.TRIANGLES:i.triangles+=d*(u/3);break;case o.LINES:i.lines+=d*(u/2);break;case o.LINE_STRIP:i.lines+=d*(u-1);break;case o.LINE_LOOP:i.lines+=d*u;break;case o.POINTS:i.points+=d*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:r}}function KA(o,e,i){const r=new WeakMap,l=new Ze;function u(h,d,p){const g=h.morphTargetInfluences,v=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,m=v!==void 0?v.length:0;let x=r.get(d);if(x===void 0||x.count!==m){let E=function(){F.dispose(),r.delete(d),d.removeEventListener("dispose",E)};var M=E;x!==void 0&&x.texture.dispose();const T=d.morphAttributes.position!==void 0,w=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,y=d.morphAttributes.position||[],P=d.morphAttributes.normal||[],z=d.morphAttributes.color||[];let N=0;T===!0&&(N=1),w===!0&&(N=2),S===!0&&(N=3);let X=d.attributes.position.count*N,H=1;X>e.maxTextureSize&&(H=Math.ceil(X/e.maxTextureSize),X=e.maxTextureSize);const B=new Float32Array(X*H*4*m),F=new Cx(B,X,H,m);F.type=za,F.needsUpdate=!0;const R=N*4;for(let L=0;L<m;L++){const et=y[L],K=P[L],ft=z[L],st=X*H*4*L;for(let k=0;k<et.count;k++){const Y=k*R;T===!0&&(l.fromBufferAttribute(et,k),B[st+Y+0]=l.x,B[st+Y+1]=l.y,B[st+Y+2]=l.z,B[st+Y+3]=0),w===!0&&(l.fromBufferAttribute(K,k),B[st+Y+4]=l.x,B[st+Y+5]=l.y,B[st+Y+6]=l.z,B[st+Y+7]=0),S===!0&&(l.fromBufferAttribute(ft,k),B[st+Y+8]=l.x,B[st+Y+9]=l.y,B[st+Y+10]=l.z,B[st+Y+11]=ft.itemSize===4?l.w:1)}}x={count:m,texture:F,size:new Oe(X,H)},r.set(d,x),d.addEventListener("dispose",E)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)p.getUniforms().setValue(o,"morphTexture",h.morphTexture,i);else{let T=0;for(let S=0;S<g.length;S++)T+=g[S];const w=d.morphTargetsRelative?1:1-T;p.getUniforms().setValue(o,"morphTargetBaseInfluence",w),p.getUniforms().setValue(o,"morphTargetInfluences",g)}p.getUniforms().setValue(o,"morphTargetsTexture",x.texture,i),p.getUniforms().setValue(o,"morphTargetsTextureSize",x.size)}return{update:u}}function QA(o,e,i,r){let l=new WeakMap;function u(p){const g=r.render.frame,v=p.geometry,m=e.get(p,v);if(l.get(m)!==g&&(e.update(m),l.set(m,g)),p.isInstancedMesh&&(p.hasEventListener("dispose",d)===!1&&p.addEventListener("dispose",d),l.get(p)!==g&&(i.update(p.instanceMatrix,o.ARRAY_BUFFER),p.instanceColor!==null&&i.update(p.instanceColor,o.ARRAY_BUFFER),l.set(p,g))),p.isSkinnedMesh){const x=p.skeleton;l.get(x)!==g&&(x.update(),l.set(x,g))}return m}function h(){l=new WeakMap}function d(p){const g=p.target;g.removeEventListener("dispose",d),i.remove(g.instanceMatrix),g.instanceColor!==null&&i.remove(g.instanceColor)}return{update:u,dispose:h}}const Gx=new ii,Ly=new Hx(1,1),Vx=new Cx,jx=new ET,Xx=new Bx,Oy=[],Py=[],By=new Float32Array(16),Iy=new Float32Array(9),Fy=new Float32Array(4);function Do(o,e,i){const r=o[0];if(r<=0||r>0)return o;const l=e*i;let u=Oy[l];if(u===void 0&&(u=new Float32Array(l),Oy[l]=u),e!==0){r.toArray(u,0);for(let h=1,d=0;h!==e;++h)d+=i,o[h].toArray(u,d)}return u}function gn(o,e){if(o.length!==e.length)return!1;for(let i=0,r=o.length;i<r;i++)if(o[i]!==e[i])return!1;return!0}function vn(o,e){for(let i=0,r=e.length;i<r;i++)o[i]=e[i]}function rf(o,e){let i=Py[e];i===void 0&&(i=new Int32Array(e),Py[e]=i);for(let r=0;r!==e;++r)i[r]=o.allocateTextureUnit();return i}function JA(o,e){const i=this.cache;i[0]!==e&&(o.uniform1f(this.addr,e),i[0]=e)}function $A(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(gn(i,e))return;o.uniform2fv(this.addr,e),vn(i,e)}}function t2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(o.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(gn(i,e))return;o.uniform3fv(this.addr,e),vn(i,e)}}function e2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(gn(i,e))return;o.uniform4fv(this.addr,e),vn(i,e)}}function n2(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(gn(i,e))return;o.uniformMatrix2fv(this.addr,!1,e),vn(i,e)}else{if(gn(i,r))return;Fy.set(r),o.uniformMatrix2fv(this.addr,!1,Fy),vn(i,r)}}function i2(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(gn(i,e))return;o.uniformMatrix3fv(this.addr,!1,e),vn(i,e)}else{if(gn(i,r))return;Iy.set(r),o.uniformMatrix3fv(this.addr,!1,Iy),vn(i,r)}}function a2(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(gn(i,e))return;o.uniformMatrix4fv(this.addr,!1,e),vn(i,e)}else{if(gn(i,r))return;By.set(r),o.uniformMatrix4fv(this.addr,!1,By),vn(i,r)}}function r2(o,e){const i=this.cache;i[0]!==e&&(o.uniform1i(this.addr,e),i[0]=e)}function s2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(gn(i,e))return;o.uniform2iv(this.addr,e),vn(i,e)}}function o2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(gn(i,e))return;o.uniform3iv(this.addr,e),vn(i,e)}}function l2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(gn(i,e))return;o.uniform4iv(this.addr,e),vn(i,e)}}function c2(o,e){const i=this.cache;i[0]!==e&&(o.uniform1ui(this.addr,e),i[0]=e)}function u2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(gn(i,e))return;o.uniform2uiv(this.addr,e),vn(i,e)}}function f2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(gn(i,e))return;o.uniform3uiv(this.addr,e),vn(i,e)}}function d2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(gn(i,e))return;o.uniform4uiv(this.addr,e),vn(i,e)}}function h2(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l);let u;this.type===o.SAMPLER_2D_SHADOW?(Ly.compareFunction=Ax,u=Ly):u=Gx,i.setTexture2D(e||u,l)}function p2(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture3D(e||jx,l)}function m2(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTextureCube(e||Xx,l)}function g2(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture2DArray(e||Vx,l)}function v2(o){switch(o){case 5126:return JA;case 35664:return $A;case 35665:return t2;case 35666:return e2;case 35674:return n2;case 35675:return i2;case 35676:return a2;case 5124:case 35670:return r2;case 35667:case 35671:return s2;case 35668:case 35672:return o2;case 35669:case 35673:return l2;case 5125:return c2;case 36294:return u2;case 36295:return f2;case 36296:return d2;case 35678:case 36198:case 36298:case 36306:case 35682:return h2;case 35679:case 36299:case 36307:return p2;case 35680:case 36300:case 36308:case 36293:return m2;case 36289:case 36303:case 36311:case 36292:return g2}}function _2(o,e){o.uniform1fv(this.addr,e)}function y2(o,e){const i=Do(e,this.size,2);o.uniform2fv(this.addr,i)}function x2(o,e){const i=Do(e,this.size,3);o.uniform3fv(this.addr,i)}function S2(o,e){const i=Do(e,this.size,4);o.uniform4fv(this.addr,i)}function M2(o,e){const i=Do(e,this.size,4);o.uniformMatrix2fv(this.addr,!1,i)}function E2(o,e){const i=Do(e,this.size,9);o.uniformMatrix3fv(this.addr,!1,i)}function b2(o,e){const i=Do(e,this.size,16);o.uniformMatrix4fv(this.addr,!1,i)}function T2(o,e){o.uniform1iv(this.addr,e)}function w2(o,e){o.uniform2iv(this.addr,e)}function A2(o,e){o.uniform3iv(this.addr,e)}function R2(o,e){o.uniform4iv(this.addr,e)}function C2(o,e){o.uniform1uiv(this.addr,e)}function D2(o,e){o.uniform2uiv(this.addr,e)}function N2(o,e){o.uniform3uiv(this.addr,e)}function U2(o,e){o.uniform4uiv(this.addr,e)}function z2(o,e,i){const r=this.cache,l=e.length,u=rf(i,l);gn(r,u)||(o.uniform1iv(this.addr,u),vn(r,u));for(let h=0;h!==l;++h)i.setTexture2D(e[h]||Gx,u[h])}function L2(o,e,i){const r=this.cache,l=e.length,u=rf(i,l);gn(r,u)||(o.uniform1iv(this.addr,u),vn(r,u));for(let h=0;h!==l;++h)i.setTexture3D(e[h]||jx,u[h])}function O2(o,e,i){const r=this.cache,l=e.length,u=rf(i,l);gn(r,u)||(o.uniform1iv(this.addr,u),vn(r,u));for(let h=0;h!==l;++h)i.setTextureCube(e[h]||Xx,u[h])}function P2(o,e,i){const r=this.cache,l=e.length,u=rf(i,l);gn(r,u)||(o.uniform1iv(this.addr,u),vn(r,u));for(let h=0;h!==l;++h)i.setTexture2DArray(e[h]||Vx,u[h])}function B2(o){switch(o){case 5126:return _2;case 35664:return y2;case 35665:return x2;case 35666:return S2;case 35674:return M2;case 35675:return E2;case 35676:return b2;case 5124:case 35670:return T2;case 35667:case 35671:return w2;case 35668:case 35672:return A2;case 35669:case 35673:return R2;case 5125:return C2;case 36294:return D2;case 36295:return N2;case 36296:return U2;case 35678:case 36198:case 36298:case 36306:case 35682:return z2;case 35679:case 36299:case 36307:return L2;case 35680:case 36300:case 36308:case 36293:return O2;case 36289:case 36303:case 36311:case 36292:return P2}}class I2{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.setValue=v2(i.type)}}class F2{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=B2(i.type)}}class H2{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,r){const l=this.seq;for(let u=0,h=l.length;u!==h;++u){const d=l[u];d.setValue(e,i[d.id],r)}}}const pp=/(\w+)(\])?(\[|\.)?/g;function Hy(o,e){o.seq.push(e),o.map[e.id]=e}function k2(o,e,i){const r=o.name,l=r.length;for(pp.lastIndex=0;;){const u=pp.exec(r),h=pp.lastIndex;let d=u[1];const p=u[2]==="]",g=u[3];if(p&&(d=d|0),g===void 0||g==="["&&h+2===l){Hy(i,g===void 0?new I2(d,o,e):new F2(d,o,e));break}else{let m=i.map[d];m===void 0&&(m=new H2(d),Hy(i,m)),i=m}}}class qu{constructor(e,i){this.seq=[],this.map={};const r=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let l=0;l<r;++l){const u=e.getActiveUniform(i,l),h=e.getUniformLocation(i,u.name);k2(u,h,this)}}setValue(e,i,r,l){const u=this.map[i];u!==void 0&&u.setValue(e,r,l)}setOptional(e,i,r){const l=i[r];l!==void 0&&this.setValue(e,r,l)}static upload(e,i,r,l){for(let u=0,h=i.length;u!==h;++u){const d=i[u],p=r[d.id];p.needsUpdate!==!1&&d.setValue(e,p.value,l)}}static seqWithValue(e,i){const r=[];for(let l=0,u=e.length;l!==u;++l){const h=e[l];h.id in i&&r.push(h)}return r}}function ky(o,e,i){const r=o.createShader(e);return o.shaderSource(r,i),o.compileShader(r),r}const G2=37297;let V2=0;function j2(o,e){const i=o.split(`
`),r=[],l=Math.max(e-6,0),u=Math.min(e+6,i.length);for(let h=l;h<u;h++){const d=h+1;r.push(`${d===e?">":" "} ${d}: ${i[h]}`)}return r.join(`
`)}const Gy=new he;function X2(o){Ue._getMatrix(Gy,Ue.workingColorSpace,o);const e=`mat3( ${Gy.elements.map(i=>i.toFixed(4))} )`;switch(Ue.getTransfer(o)){case Ku:return[e,"LinearTransferOETF"];case Ge:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",o),[e,"LinearTransferOETF"]}}function Vy(o,e,i){const r=o.getShaderParameter(e,o.COMPILE_STATUS),l=o.getShaderInfoLog(e).trim();if(r&&l==="")return"";const u=/ERROR: 0:(\d+)/.exec(l);if(u){const h=parseInt(u[1]);return i.toUpperCase()+`

`+l+`

`+j2(o.getShaderSource(e),h)}else return l}function q2(o,e){const i=X2(e);return[`vec4 ${o}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function W2(o,e){let i;switch(e){case Ub:i="Linear";break;case zb:i="Reinhard";break;case Lb:i="Cineon";break;case Ob:i="ACESFilmic";break;case Bb:i="AgX";break;case Ib:i="Neutral";break;case Pb:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),i="Linear"}return"vec3 "+o+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Ou=new it;function Y2(){Ue.getLuminanceCoefficients(Ou);const o=Ou.x.toFixed(4),e=Ou.y.toFixed(4),i=Ou.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${o}, ${e}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Z2(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",o.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cl).join(`
`)}function K2(o){const e=[];for(const i in o){const r=o[i];r!==!1&&e.push("#define "+i+" "+r)}return e.join(`
`)}function Q2(o,e){const i={},r=o.getProgramParameter(e,o.ACTIVE_ATTRIBUTES);for(let l=0;l<r;l++){const u=o.getActiveAttrib(e,l),h=u.name;let d=1;u.type===o.FLOAT_MAT2&&(d=2),u.type===o.FLOAT_MAT3&&(d=3),u.type===o.FLOAT_MAT4&&(d=4),i[h]={type:u.type,location:o.getAttribLocation(e,h),locationSize:d}}return i}function Cl(o){return o!==""}function jy(o,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Xy(o,e){return o.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const J2=/^[ \t]*#include +<([\w\d./]+)>/gm;function cm(o){return o.replace(J2,tR)}const $2=new Map;function tR(o,e){let i=me[e];if(i===void 0){const r=$2.get(e);if(r!==void 0)i=me[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return cm(i)}const eR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qy(o){return o.replace(eR,nR)}function nR(o,e,i,r){let l="";for(let u=parseInt(e);u<parseInt(i);u++)l+=r.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return l}function Wy(o){let e=`precision ${o.precision} float;
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
#define LOW_PRECISION`),e}function iR(o){let e="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===px?e="SHADOWMAP_TYPE_PCF":o.shadowMapType===fb?e="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===Ua&&(e="SHADOWMAP_TYPE_VSM"),e}function aR(o){let e="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case Mo:case Eo:e="ENVMAP_TYPE_CUBE";break;case nf:e="ENVMAP_TYPE_CUBE_UV";break}return e}function rR(o){let e="ENVMAP_MODE_REFLECTION";if(o.envMap)switch(o.envMapMode){case Eo:e="ENVMAP_MODE_REFRACTION";break}return e}function sR(o){let e="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case mx:e="ENVMAP_BLENDING_MULTIPLY";break;case Db:e="ENVMAP_BLENDING_MIX";break;case Nb:e="ENVMAP_BLENDING_ADD";break}return e}function oR(o){const e=o.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:r,maxMip:i}}function lR(o,e,i,r){const l=o.getContext(),u=i.defines;let h=i.vertexShader,d=i.fragmentShader;const p=iR(i),g=aR(i),v=rR(i),m=sR(i),x=oR(i),M=Z2(i),T=K2(u),w=l.createProgram();let S,y,P=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(S=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(Cl).join(`
`),S.length>0&&(S+=`
`),y=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(Cl).join(`
`),y.length>0&&(y+=`
`)):(S=[Wy(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+v:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cl).join(`
`),y=[Wy(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.envMap?"#define "+v:"",i.envMap?"#define "+m:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==br?"#define TONE_MAPPING":"",i.toneMapping!==br?me.tonemapping_pars_fragment:"",i.toneMapping!==br?W2("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",me.colorspace_pars_fragment,q2("linearToOutputTexel",i.outputColorSpace),Y2(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(Cl).join(`
`)),h=cm(h),h=jy(h,i),h=Xy(h,i),d=cm(d),d=jy(d,i),d=Xy(d,i),h=qy(h),d=qy(d),i.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,S=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,y=["#define varying in",i.glslVersion===ey?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===ey?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const z=P+S+h,N=P+y+d,X=ky(l,l.VERTEX_SHADER,z),H=ky(l,l.FRAGMENT_SHADER,N);l.attachShader(w,X),l.attachShader(w,H),i.index0AttributeName!==void 0?l.bindAttribLocation(w,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(w,0,"position"),l.linkProgram(w);function B(L){if(o.debug.checkShaderErrors){const et=l.getProgramInfoLog(w).trim(),K=l.getShaderInfoLog(X).trim(),ft=l.getShaderInfoLog(H).trim();let st=!0,k=!0;if(l.getProgramParameter(w,l.LINK_STATUS)===!1)if(st=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(l,w,X,H);else{const Y=Vy(l,X,"vertex"),q=Vy(l,H,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(w,l.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+et+`
`+Y+`
`+q)}else et!==""?console.warn("THREE.WebGLProgram: Program Info Log:",et):(K===""||ft==="")&&(k=!1);k&&(L.diagnostics={runnable:st,programLog:et,vertexShader:{log:K,prefix:S},fragmentShader:{log:ft,prefix:y}})}l.deleteShader(X),l.deleteShader(H),F=new qu(l,w),R=Q2(l,w)}let F;this.getUniforms=function(){return F===void 0&&B(this),F};let R;this.getAttributes=function(){return R===void 0&&B(this),R};let E=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=l.getProgramParameter(w,G2)),E},this.destroy=function(){r.releaseStatesOfProgram(this),l.deleteProgram(w),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=V2++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=X,this.fragmentShader=H,this}let cR=0;class uR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const i=e.vertexShader,r=e.fragmentShader,l=this._getShaderStage(i),u=this._getShaderStage(r),h=this._getShaderCacheForMaterial(e);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(u)===!1&&(h.add(u),u.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const r of i)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let r=i.get(e);return r===void 0&&(r=new Set,i.set(e,r)),r}_getShaderStage(e){const i=this.shaderCache;let r=i.get(e);return r===void 0&&(r=new fR(e),i.set(e,r)),r}}class fR{constructor(e){this.id=cR++,this.code=e,this.usedTimes=0}}function dR(o,e,i,r,l,u,h){const d=new Nx,p=new uR,g=new Set,v=[],m=l.logarithmicDepthBuffer,x=l.vertexTextures;let M=l.precision;const T={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(R){return g.add(R),R===0?"uv":`uv${R}`}function S(R,E,L,et,K){const ft=et.fog,st=K.geometry,k=R.isMeshStandardMaterial?et.environment:null,Y=(R.isMeshStandardMaterial?i:e).get(R.envMap||k),q=Y&&Y.mapping===nf?Y.image.height:null,_t=T[R.type];R.precision!==null&&(M=l.getMaxPrecision(R.precision),M!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",M,"instead."));const mt=st.morphAttributes.position||st.morphAttributes.normal||st.morphAttributes.color,At=mt!==void 0?mt.length:0;let Wt=0;st.morphAttributes.position!==void 0&&(Wt=1),st.morphAttributes.normal!==void 0&&(Wt=2),st.morphAttributes.color!==void 0&&(Wt=3);let Kt,U,Q,vt;if(_t){const we=ei[_t];Kt=we.vertexShader,U=we.fragmentShader}else Kt=R.vertexShader,U=R.fragmentShader,p.update(R),Q=p.getVertexShaderID(R),vt=p.getFragmentShaderID(R);const dt=o.getRenderTarget(),wt=o.state.buffers.depth.getReversed(),kt=K.isInstancedMesh===!0,Et=K.isBatchedMesh===!0,bt=!!R.map,zt=!!R.matcap,te=!!Y,G=!!R.aoMap,an=!!R.lightMap,re=!!R.bumpMap,Jt=!!R.normalMap,Nt=!!R.displacementMap,ve=!!R.emissiveMap,Yt=!!R.metalnessMap,O=!!R.roughnessMap,A=R.anisotropy>0,lt=R.clearcoat>0,V=R.dispersion>0,nt=R.iridescence>0,ct=R.sheen>0,Ot=R.transmission>0,Ct=A&&!!R.anisotropyMap,It=lt&&!!R.clearcoatMap,pe=lt&&!!R.clearcoatNormalMap,Tt=lt&&!!R.clearcoatRoughnessMap,Xt=nt&&!!R.iridescenceMap,ne=nt&&!!R.iridescenceThicknessMap,se=ct&&!!R.sheenColorMap,jt=ct&&!!R.sheenRoughnessMap,_e=!!R.specularMap,ue=!!R.specularColorMap,He=!!R.specularIntensityMap,W=Ot&&!!R.transmissionMap,Ft=Ot&&!!R.thicknessMap,gt=!!R.gradientMap,St=!!R.alphaMap,Ht=R.alphaTest>0,Gt=!!R.alphaHash,ce=!!R.extensions;let Je=br;R.toneMapped&&(dt===null||dt.isXRRenderTarget===!0)&&(Je=o.toneMapping);const _n={shaderID:_t,shaderType:R.type,shaderName:R.name,vertexShader:Kt,fragmentShader:U,defines:R.defines,customVertexShaderID:Q,customFragmentShaderID:vt,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:M,batching:Et,batchingColor:Et&&K._colorsTexture!==null,instancing:kt,instancingColor:kt&&K.instanceColor!==null,instancingMorph:kt&&K.morphTexture!==null,supportsVertexTextures:x,outputColorSpace:dt===null?o.outputColorSpace:dt.isXRRenderTarget===!0?dt.texture.colorSpace:wo,alphaToCoverage:!!R.alphaToCoverage,map:bt,matcap:zt,envMap:te,envMapMode:te&&Y.mapping,envMapCubeUVHeight:q,aoMap:G,lightMap:an,bumpMap:re,normalMap:Jt,displacementMap:x&&Nt,emissiveMap:ve,normalMapObjectSpace:Jt&&R.normalMapType===Vb,normalMapTangentSpace:Jt&&R.normalMapType===Gb,metalnessMap:Yt,roughnessMap:O,anisotropy:A,anisotropyMap:Ct,clearcoat:lt,clearcoatMap:It,clearcoatNormalMap:pe,clearcoatRoughnessMap:Tt,dispersion:V,iridescence:nt,iridescenceMap:Xt,iridescenceThicknessMap:ne,sheen:ct,sheenColorMap:se,sheenRoughnessMap:jt,specularMap:_e,specularColorMap:ue,specularIntensityMap:He,transmission:Ot,transmissionMap:W,thicknessMap:Ft,gradientMap:gt,opaque:R.transparent===!1&&R.blending===_o&&R.alphaToCoverage===!1,alphaMap:St,alphaTest:Ht,alphaHash:Gt,combine:R.combine,mapUv:bt&&w(R.map.channel),aoMapUv:G&&w(R.aoMap.channel),lightMapUv:an&&w(R.lightMap.channel),bumpMapUv:re&&w(R.bumpMap.channel),normalMapUv:Jt&&w(R.normalMap.channel),displacementMapUv:Nt&&w(R.displacementMap.channel),emissiveMapUv:ve&&w(R.emissiveMap.channel),metalnessMapUv:Yt&&w(R.metalnessMap.channel),roughnessMapUv:O&&w(R.roughnessMap.channel),anisotropyMapUv:Ct&&w(R.anisotropyMap.channel),clearcoatMapUv:It&&w(R.clearcoatMap.channel),clearcoatNormalMapUv:pe&&w(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Tt&&w(R.clearcoatRoughnessMap.channel),iridescenceMapUv:Xt&&w(R.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&w(R.iridescenceThicknessMap.channel),sheenColorMapUv:se&&w(R.sheenColorMap.channel),sheenRoughnessMapUv:jt&&w(R.sheenRoughnessMap.channel),specularMapUv:_e&&w(R.specularMap.channel),specularColorMapUv:ue&&w(R.specularColorMap.channel),specularIntensityMapUv:He&&w(R.specularIntensityMap.channel),transmissionMapUv:W&&w(R.transmissionMap.channel),thicknessMapUv:Ft&&w(R.thicknessMap.channel),alphaMapUv:St&&w(R.alphaMap.channel),vertexTangents:!!st.attributes.tangent&&(Jt||A),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!st.attributes.color&&st.attributes.color.itemSize===4,pointsUvs:K.isPoints===!0&&!!st.attributes.uv&&(bt||St),fog:!!ft,useFog:R.fog===!0,fogExp2:!!ft&&ft.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:m,reverseDepthBuffer:wt,skinning:K.isSkinnedMesh===!0,morphTargets:st.morphAttributes.position!==void 0,morphNormals:st.morphAttributes.normal!==void 0,morphColors:st.morphAttributes.color!==void 0,morphTargetsCount:At,morphTextureStride:Wt,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:R.dithering,shadowMapEnabled:o.shadowMap.enabled&&L.length>0,shadowMapType:o.shadowMap.type,toneMapping:Je,decodeVideoTexture:bt&&R.map.isVideoTexture===!0&&Ue.getTransfer(R.map.colorSpace)===Ge,decodeVideoTextureEmissive:ve&&R.emissiveMap.isVideoTexture===!0&&Ue.getTransfer(R.emissiveMap.colorSpace)===Ge,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===ra,flipSided:R.side===ni,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionClipCullDistance:ce&&R.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ce&&R.extensions.multiDraw===!0||Et)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()};return _n.vertexUv1s=g.has(1),_n.vertexUv2s=g.has(2),_n.vertexUv3s=g.has(3),g.clear(),_n}function y(R){const E=[];if(R.shaderID?E.push(R.shaderID):(E.push(R.customVertexShaderID),E.push(R.customFragmentShaderID)),R.defines!==void 0)for(const L in R.defines)E.push(L),E.push(R.defines[L]);return R.isRawShaderMaterial===!1&&(P(E,R),z(E,R),E.push(o.outputColorSpace)),E.push(R.customProgramCacheKey),E.join()}function P(R,E){R.push(E.precision),R.push(E.outputColorSpace),R.push(E.envMapMode),R.push(E.envMapCubeUVHeight),R.push(E.mapUv),R.push(E.alphaMapUv),R.push(E.lightMapUv),R.push(E.aoMapUv),R.push(E.bumpMapUv),R.push(E.normalMapUv),R.push(E.displacementMapUv),R.push(E.emissiveMapUv),R.push(E.metalnessMapUv),R.push(E.roughnessMapUv),R.push(E.anisotropyMapUv),R.push(E.clearcoatMapUv),R.push(E.clearcoatNormalMapUv),R.push(E.clearcoatRoughnessMapUv),R.push(E.iridescenceMapUv),R.push(E.iridescenceThicknessMapUv),R.push(E.sheenColorMapUv),R.push(E.sheenRoughnessMapUv),R.push(E.specularMapUv),R.push(E.specularColorMapUv),R.push(E.specularIntensityMapUv),R.push(E.transmissionMapUv),R.push(E.thicknessMapUv),R.push(E.combine),R.push(E.fogExp2),R.push(E.sizeAttenuation),R.push(E.morphTargetsCount),R.push(E.morphAttributeCount),R.push(E.numDirLights),R.push(E.numPointLights),R.push(E.numSpotLights),R.push(E.numSpotLightMaps),R.push(E.numHemiLights),R.push(E.numRectAreaLights),R.push(E.numDirLightShadows),R.push(E.numPointLightShadows),R.push(E.numSpotLightShadows),R.push(E.numSpotLightShadowsWithMaps),R.push(E.numLightProbes),R.push(E.shadowMapType),R.push(E.toneMapping),R.push(E.numClippingPlanes),R.push(E.numClipIntersection),R.push(E.depthPacking)}function z(R,E){d.disableAll(),E.supportsVertexTextures&&d.enable(0),E.instancing&&d.enable(1),E.instancingColor&&d.enable(2),E.instancingMorph&&d.enable(3),E.matcap&&d.enable(4),E.envMap&&d.enable(5),E.normalMapObjectSpace&&d.enable(6),E.normalMapTangentSpace&&d.enable(7),E.clearcoat&&d.enable(8),E.iridescence&&d.enable(9),E.alphaTest&&d.enable(10),E.vertexColors&&d.enable(11),E.vertexAlphas&&d.enable(12),E.vertexUv1s&&d.enable(13),E.vertexUv2s&&d.enable(14),E.vertexUv3s&&d.enable(15),E.vertexTangents&&d.enable(16),E.anisotropy&&d.enable(17),E.alphaHash&&d.enable(18),E.batching&&d.enable(19),E.dispersion&&d.enable(20),E.batchingColor&&d.enable(21),R.push(d.mask),d.disableAll(),E.fog&&d.enable(0),E.useFog&&d.enable(1),E.flatShading&&d.enable(2),E.logarithmicDepthBuffer&&d.enable(3),E.reverseDepthBuffer&&d.enable(4),E.skinning&&d.enable(5),E.morphTargets&&d.enable(6),E.morphNormals&&d.enable(7),E.morphColors&&d.enable(8),E.premultipliedAlpha&&d.enable(9),E.shadowMapEnabled&&d.enable(10),E.doubleSided&&d.enable(11),E.flipSided&&d.enable(12),E.useDepthPacking&&d.enable(13),E.dithering&&d.enable(14),E.transmission&&d.enable(15),E.sheen&&d.enable(16),E.opaque&&d.enable(17),E.pointsUvs&&d.enable(18),E.decodeVideoTexture&&d.enable(19),E.decodeVideoTextureEmissive&&d.enable(20),E.alphaToCoverage&&d.enable(21),R.push(d.mask)}function N(R){const E=T[R.type];let L;if(E){const et=ei[E];L=Sm.clone(et.uniforms)}else L=R.uniforms;return L}function X(R,E){let L;for(let et=0,K=v.length;et<K;et++){const ft=v[et];if(ft.cacheKey===E){L=ft,++L.usedTimes;break}}return L===void 0&&(L=new lR(o,E,R,u),v.push(L)),L}function H(R){if(--R.usedTimes===0){const E=v.indexOf(R);v[E]=v[v.length-1],v.pop(),R.destroy()}}function B(R){p.remove(R)}function F(){p.dispose()}return{getParameters:S,getProgramCacheKey:y,getUniforms:N,acquireProgram:X,releaseProgram:H,releaseShaderCache:B,programs:v,dispose:F}}function hR(){let o=new WeakMap;function e(h){return o.has(h)}function i(h){let d=o.get(h);return d===void 0&&(d={},o.set(h,d)),d}function r(h){o.delete(h)}function l(h,d,p){o.get(h)[d]=p}function u(){o=new WeakMap}return{has:e,get:i,remove:r,update:l,dispose:u}}function pR(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.material.id!==e.material.id?o.material.id-e.material.id:o.z!==e.z?o.z-e.z:o.id-e.id}function Yy(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.z!==e.z?e.z-o.z:o.id-e.id}function Zy(){const o=[];let e=0;const i=[],r=[],l=[];function u(){e=0,i.length=0,r.length=0,l.length=0}function h(m,x,M,T,w,S){let y=o[e];return y===void 0?(y={id:m.id,object:m,geometry:x,material:M,groupOrder:T,renderOrder:m.renderOrder,z:w,group:S},o[e]=y):(y.id=m.id,y.object=m,y.geometry=x,y.material=M,y.groupOrder=T,y.renderOrder=m.renderOrder,y.z=w,y.group=S),e++,y}function d(m,x,M,T,w,S){const y=h(m,x,M,T,w,S);M.transmission>0?r.push(y):M.transparent===!0?l.push(y):i.push(y)}function p(m,x,M,T,w,S){const y=h(m,x,M,T,w,S);M.transmission>0?r.unshift(y):M.transparent===!0?l.unshift(y):i.unshift(y)}function g(m,x){i.length>1&&i.sort(m||pR),r.length>1&&r.sort(x||Yy),l.length>1&&l.sort(x||Yy)}function v(){for(let m=e,x=o.length;m<x;m++){const M=o[m];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:i,transmissive:r,transparent:l,init:u,push:d,unshift:p,finish:v,sort:g}}function mR(){let o=new WeakMap;function e(r,l){const u=o.get(r);let h;return u===void 0?(h=new Zy,o.set(r,[h])):l>=u.length?(h=new Zy,u.push(h)):h=u[l],h}function i(){o=new WeakMap}return{get:e,dispose:i}}function gR(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={direction:new it,color:new De};break;case"SpotLight":i={position:new it,direction:new it,color:new De,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new it,color:new De,distance:0,decay:0};break;case"HemisphereLight":i={direction:new it,skyColor:new De,groundColor:new De};break;case"RectAreaLight":i={color:new De,position:new it,halfWidth:new it,halfHeight:new it};break}return o[e.id]=i,i}}}function vR(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[e.id]=i,i}}}let _R=0;function yR(o,e){return(e.castShadow?2:0)-(o.castShadow?2:0)+(e.map?1:0)-(o.map?1:0)}function xR(o){const e=new gR,i=vR(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let g=0;g<9;g++)r.probe.push(new it);const l=new it,u=new nn,h=new nn;function d(g){let v=0,m=0,x=0;for(let R=0;R<9;R++)r.probe[R].set(0,0,0);let M=0,T=0,w=0,S=0,y=0,P=0,z=0,N=0,X=0,H=0,B=0;g.sort(yR);for(let R=0,E=g.length;R<E;R++){const L=g[R],et=L.color,K=L.intensity,ft=L.distance,st=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)v+=et.r*K,m+=et.g*K,x+=et.b*K;else if(L.isLightProbe){for(let k=0;k<9;k++)r.probe[k].addScaledVector(L.sh.coefficients[k],K);B++}else if(L.isDirectionalLight){const k=e.get(L);if(k.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Y=L.shadow,q=i.get(L);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize=Y.mapSize,r.directionalShadow[M]=q,r.directionalShadowMap[M]=st,r.directionalShadowMatrix[M]=L.shadow.matrix,P++}r.directional[M]=k,M++}else if(L.isSpotLight){const k=e.get(L);k.position.setFromMatrixPosition(L.matrixWorld),k.color.copy(et).multiplyScalar(K),k.distance=ft,k.coneCos=Math.cos(L.angle),k.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),k.decay=L.decay,r.spot[w]=k;const Y=L.shadow;if(L.map&&(r.spotLightMap[X]=L.map,X++,Y.updateMatrices(L),L.castShadow&&H++),r.spotLightMatrix[w]=Y.matrix,L.castShadow){const q=i.get(L);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize=Y.mapSize,r.spotShadow[w]=q,r.spotShadowMap[w]=st,N++}w++}else if(L.isRectAreaLight){const k=e.get(L);k.color.copy(et).multiplyScalar(K),k.halfWidth.set(L.width*.5,0,0),k.halfHeight.set(0,L.height*.5,0),r.rectArea[S]=k,S++}else if(L.isPointLight){const k=e.get(L);if(k.color.copy(L.color).multiplyScalar(L.intensity),k.distance=L.distance,k.decay=L.decay,L.castShadow){const Y=L.shadow,q=i.get(L);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize=Y.mapSize,q.shadowCameraNear=Y.camera.near,q.shadowCameraFar=Y.camera.far,r.pointShadow[T]=q,r.pointShadowMap[T]=st,r.pointShadowMatrix[T]=L.shadow.matrix,z++}r.point[T]=k,T++}else if(L.isHemisphereLight){const k=e.get(L);k.skyColor.copy(L.color).multiplyScalar(K),k.groundColor.copy(L.groundColor).multiplyScalar(K),r.hemi[y]=k,y++}}S>0&&(o.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Pt.LTC_FLOAT_1,r.rectAreaLTC2=Pt.LTC_FLOAT_2):(r.rectAreaLTC1=Pt.LTC_HALF_1,r.rectAreaLTC2=Pt.LTC_HALF_2)),r.ambient[0]=v,r.ambient[1]=m,r.ambient[2]=x;const F=r.hash;(F.directionalLength!==M||F.pointLength!==T||F.spotLength!==w||F.rectAreaLength!==S||F.hemiLength!==y||F.numDirectionalShadows!==P||F.numPointShadows!==z||F.numSpotShadows!==N||F.numSpotMaps!==X||F.numLightProbes!==B)&&(r.directional.length=M,r.spot.length=w,r.rectArea.length=S,r.point.length=T,r.hemi.length=y,r.directionalShadow.length=P,r.directionalShadowMap.length=P,r.pointShadow.length=z,r.pointShadowMap.length=z,r.spotShadow.length=N,r.spotShadowMap.length=N,r.directionalShadowMatrix.length=P,r.pointShadowMatrix.length=z,r.spotLightMatrix.length=N+X-H,r.spotLightMap.length=X,r.numSpotLightShadowsWithMaps=H,r.numLightProbes=B,F.directionalLength=M,F.pointLength=T,F.spotLength=w,F.rectAreaLength=S,F.hemiLength=y,F.numDirectionalShadows=P,F.numPointShadows=z,F.numSpotShadows=N,F.numSpotMaps=X,F.numLightProbes=B,r.version=_R++)}function p(g,v){let m=0,x=0,M=0,T=0,w=0;const S=v.matrixWorldInverse;for(let y=0,P=g.length;y<P;y++){const z=g[y];if(z.isDirectionalLight){const N=r.directional[m];N.direction.setFromMatrixPosition(z.matrixWorld),l.setFromMatrixPosition(z.target.matrixWorld),N.direction.sub(l),N.direction.transformDirection(S),m++}else if(z.isSpotLight){const N=r.spot[M];N.position.setFromMatrixPosition(z.matrixWorld),N.position.applyMatrix4(S),N.direction.setFromMatrixPosition(z.matrixWorld),l.setFromMatrixPosition(z.target.matrixWorld),N.direction.sub(l),N.direction.transformDirection(S),M++}else if(z.isRectAreaLight){const N=r.rectArea[T];N.position.setFromMatrixPosition(z.matrixWorld),N.position.applyMatrix4(S),h.identity(),u.copy(z.matrixWorld),u.premultiply(S),h.extractRotation(u),N.halfWidth.set(z.width*.5,0,0),N.halfHeight.set(0,z.height*.5,0),N.halfWidth.applyMatrix4(h),N.halfHeight.applyMatrix4(h),T++}else if(z.isPointLight){const N=r.point[x];N.position.setFromMatrixPosition(z.matrixWorld),N.position.applyMatrix4(S),x++}else if(z.isHemisphereLight){const N=r.hemi[w];N.direction.setFromMatrixPosition(z.matrixWorld),N.direction.transformDirection(S),w++}}}return{setup:d,setupView:p,state:r}}function Ky(o){const e=new xR(o),i=[],r=[];function l(v){g.camera=v,i.length=0,r.length=0}function u(v){i.push(v)}function h(v){r.push(v)}function d(){e.setup(i)}function p(v){e.setupView(i,v)}const g={lightsArray:i,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:l,state:g,setupLights:d,setupLightsView:p,pushLight:u,pushShadow:h}}function SR(o){let e=new WeakMap;function i(l,u=0){const h=e.get(l);let d;return h===void 0?(d=new Ky(o),e.set(l,[d])):u>=h.length?(d=new Ky(o),h.push(d)):d=h[u],d}function r(){e=new WeakMap}return{get:i,dispose:r}}const MR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ER=`uniform sampler2D shadow_pass;
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
}`;function bR(o,e,i){let r=new Ix;const l=new Oe,u=new Oe,h=new Ze,d=new WT({depthPacking:kb}),p=new YT,g={},v=i.maxTextureSize,m={[Tr]:ni,[ni]:Tr,[ra]:ra},x=new Fa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:MR,fragmentShader:ER}),M=x.clone();M.defines.HORIZONTAL_PASS=1;const T=new ri;T.setAttribute("position",new ji(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new Ci(T,x),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=px;let y=this.type;this.render=function(H,B,F){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||H.length===0)return;const R=o.getRenderTarget(),E=o.getActiveCubeFace(),L=o.getActiveMipmapLevel(),et=o.state;et.setBlending(Er),et.buffers.color.setClear(1,1,1,1),et.buffers.depth.setTest(!0),et.setScissorTest(!1);const K=y!==Ua&&this.type===Ua,ft=y===Ua&&this.type!==Ua;for(let st=0,k=H.length;st<k;st++){const Y=H[st],q=Y.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;l.copy(q.mapSize);const _t=q.getFrameExtents();if(l.multiply(_t),u.copy(q.mapSize),(l.x>v||l.y>v)&&(l.x>v&&(u.x=Math.floor(v/_t.x),l.x=u.x*_t.x,q.mapSize.x=u.x),l.y>v&&(u.y=Math.floor(v/_t.y),l.y=u.y*_t.y,q.mapSize.y=u.y)),q.map===null||K===!0||ft===!0){const At=this.type!==Ua?{minFilter:Vi,magFilter:Vi}:{};q.map!==null&&q.map.dispose(),q.map=new hs(l.x,l.y,At),q.map.texture.name=Y.name+".shadowMap",q.camera.updateProjectionMatrix()}o.setRenderTarget(q.map),o.clear();const mt=q.getViewportCount();for(let At=0;At<mt;At++){const Wt=q.getViewport(At);h.set(u.x*Wt.x,u.y*Wt.y,u.x*Wt.z,u.y*Wt.w),et.viewport(h),q.updateMatrices(Y,At),r=q.getFrustum(),N(B,F,q.camera,Y,this.type)}q.isPointLightShadow!==!0&&this.type===Ua&&P(q,F),q.needsUpdate=!1}y=this.type,S.needsUpdate=!1,o.setRenderTarget(R,E,L)};function P(H,B){const F=e.update(w);x.defines.VSM_SAMPLES!==H.blurSamples&&(x.defines.VSM_SAMPLES=H.blurSamples,M.defines.VSM_SAMPLES=H.blurSamples,x.needsUpdate=!0,M.needsUpdate=!0),H.mapPass===null&&(H.mapPass=new hs(l.x,l.y)),x.uniforms.shadow_pass.value=H.map.texture,x.uniforms.resolution.value=H.mapSize,x.uniforms.radius.value=H.radius,o.setRenderTarget(H.mapPass),o.clear(),o.renderBufferDirect(B,null,F,x,w,null),M.uniforms.shadow_pass.value=H.mapPass.texture,M.uniforms.resolution.value=H.mapSize,M.uniforms.radius.value=H.radius,o.setRenderTarget(H.map),o.clear(),o.renderBufferDirect(B,null,F,M,w,null)}function z(H,B,F,R){let E=null;const L=F.isPointLight===!0?H.customDistanceMaterial:H.customDepthMaterial;if(L!==void 0)E=L;else if(E=F.isPointLight===!0?p:d,o.localClippingEnabled&&B.clipShadows===!0&&Array.isArray(B.clippingPlanes)&&B.clippingPlanes.length!==0||B.displacementMap&&B.displacementScale!==0||B.alphaMap&&B.alphaTest>0||B.map&&B.alphaTest>0){const et=E.uuid,K=B.uuid;let ft=g[et];ft===void 0&&(ft={},g[et]=ft);let st=ft[K];st===void 0&&(st=E.clone(),ft[K]=st,B.addEventListener("dispose",X)),E=st}if(E.visible=B.visible,E.wireframe=B.wireframe,R===Ua?E.side=B.shadowSide!==null?B.shadowSide:B.side:E.side=B.shadowSide!==null?B.shadowSide:m[B.side],E.alphaMap=B.alphaMap,E.alphaTest=B.alphaTest,E.map=B.map,E.clipShadows=B.clipShadows,E.clippingPlanes=B.clippingPlanes,E.clipIntersection=B.clipIntersection,E.displacementMap=B.displacementMap,E.displacementScale=B.displacementScale,E.displacementBias=B.displacementBias,E.wireframeLinewidth=B.wireframeLinewidth,E.linewidth=B.linewidth,F.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const et=o.properties.get(E);et.light=F}return E}function N(H,B,F,R,E){if(H.visible===!1)return;if(H.layers.test(B.layers)&&(H.isMesh||H.isLine||H.isPoints)&&(H.castShadow||H.receiveShadow&&E===Ua)&&(!H.frustumCulled||r.intersectsObject(H))){H.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,H.matrixWorld);const K=e.update(H),ft=H.material;if(Array.isArray(ft)){const st=K.groups;for(let k=0,Y=st.length;k<Y;k++){const q=st[k],_t=ft[q.materialIndex];if(_t&&_t.visible){const mt=z(H,_t,R,E);H.onBeforeShadow(o,H,B,F,K,mt,q),o.renderBufferDirect(F,null,K,mt,H,q),H.onAfterShadow(o,H,B,F,K,mt,q)}}}else if(ft.visible){const st=z(H,ft,R,E);H.onBeforeShadow(o,H,B,F,K,st,null),o.renderBufferDirect(F,null,K,st,H,null),H.onAfterShadow(o,H,B,F,K,st,null)}}const et=H.children;for(let K=0,ft=et.length;K<ft;K++)N(et[K],B,F,R,E)}function X(H){H.target.removeEventListener("dispose",X);for(const F in g){const R=g[F],E=H.target.uuid;E in R&&(R[E].dispose(),delete R[E])}}}const TR={[bp]:Tp,[wp]:Cp,[Ap]:Dp,[So]:Rp,[Tp]:bp,[Cp]:wp,[Dp]:Ap,[Rp]:So};function wR(o,e){function i(){let W=!1;const Ft=new Ze;let gt=null;const St=new Ze(0,0,0,0);return{setMask:function(Ht){gt!==Ht&&!W&&(o.colorMask(Ht,Ht,Ht,Ht),gt=Ht)},setLocked:function(Ht){W=Ht},setClear:function(Ht,Gt,ce,Je,_n){_n===!0&&(Ht*=Je,Gt*=Je,ce*=Je),Ft.set(Ht,Gt,ce,Je),St.equals(Ft)===!1&&(o.clearColor(Ht,Gt,ce,Je),St.copy(Ft))},reset:function(){W=!1,gt=null,St.set(-1,0,0,0)}}}function r(){let W=!1,Ft=!1,gt=null,St=null,Ht=null;return{setReversed:function(Gt){if(Ft!==Gt){const ce=e.get("EXT_clip_control");Ft?ce.clipControlEXT(ce.LOWER_LEFT_EXT,ce.ZERO_TO_ONE_EXT):ce.clipControlEXT(ce.LOWER_LEFT_EXT,ce.NEGATIVE_ONE_TO_ONE_EXT);const Je=Ht;Ht=null,this.setClear(Je)}Ft=Gt},getReversed:function(){return Ft},setTest:function(Gt){Gt?dt(o.DEPTH_TEST):wt(o.DEPTH_TEST)},setMask:function(Gt){gt!==Gt&&!W&&(o.depthMask(Gt),gt=Gt)},setFunc:function(Gt){if(Ft&&(Gt=TR[Gt]),St!==Gt){switch(Gt){case bp:o.depthFunc(o.NEVER);break;case Tp:o.depthFunc(o.ALWAYS);break;case wp:o.depthFunc(o.LESS);break;case So:o.depthFunc(o.LEQUAL);break;case Ap:o.depthFunc(o.EQUAL);break;case Rp:o.depthFunc(o.GEQUAL);break;case Cp:o.depthFunc(o.GREATER);break;case Dp:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}St=Gt}},setLocked:function(Gt){W=Gt},setClear:function(Gt){Ht!==Gt&&(Ft&&(Gt=1-Gt),o.clearDepth(Gt),Ht=Gt)},reset:function(){W=!1,gt=null,St=null,Ht=null,Ft=!1}}}function l(){let W=!1,Ft=null,gt=null,St=null,Ht=null,Gt=null,ce=null,Je=null,_n=null;return{setTest:function(we){W||(we?dt(o.STENCIL_TEST):wt(o.STENCIL_TEST))},setMask:function(we){Ft!==we&&!W&&(o.stencilMask(we),Ft=we)},setFunc:function(we,Ke,yn){(gt!==we||St!==Ke||Ht!==yn)&&(o.stencilFunc(we,Ke,yn),gt=we,St=Ke,Ht=yn)},setOp:function(we,Ke,yn){(Gt!==we||ce!==Ke||Je!==yn)&&(o.stencilOp(we,Ke,yn),Gt=we,ce=Ke,Je=yn)},setLocked:function(we){W=we},setClear:function(we){_n!==we&&(o.clearStencil(we),_n=we)},reset:function(){W=!1,Ft=null,gt=null,St=null,Ht=null,Gt=null,ce=null,Je=null,_n=null}}}const u=new i,h=new r,d=new l,p=new WeakMap,g=new WeakMap;let v={},m={},x=new WeakMap,M=[],T=null,w=!1,S=null,y=null,P=null,z=null,N=null,X=null,H=null,B=new De(0,0,0),F=0,R=!1,E=null,L=null,et=null,K=null,ft=null;const st=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,Y=0;const q=o.getParameter(o.VERSION);q.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(q)[1]),k=Y>=1):q.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),k=Y>=2);let _t=null,mt={};const At=o.getParameter(o.SCISSOR_BOX),Wt=o.getParameter(o.VIEWPORT),Kt=new Ze().fromArray(At),U=new Ze().fromArray(Wt);function Q(W,Ft,gt,St){const Ht=new Uint8Array(4),Gt=o.createTexture();o.bindTexture(W,Gt),o.texParameteri(W,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(W,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let ce=0;ce<gt;ce++)W===o.TEXTURE_3D||W===o.TEXTURE_2D_ARRAY?o.texImage3D(Ft,0,o.RGBA,1,1,St,0,o.RGBA,o.UNSIGNED_BYTE,Ht):o.texImage2D(Ft+ce,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,Ht);return Gt}const vt={};vt[o.TEXTURE_2D]=Q(o.TEXTURE_2D,o.TEXTURE_2D,1),vt[o.TEXTURE_CUBE_MAP]=Q(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),vt[o.TEXTURE_2D_ARRAY]=Q(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),vt[o.TEXTURE_3D]=Q(o.TEXTURE_3D,o.TEXTURE_3D,1,1),u.setClear(0,0,0,1),h.setClear(1),d.setClear(0),dt(o.DEPTH_TEST),h.setFunc(So),re(!1),Jt(K_),dt(o.CULL_FACE),G(Er);function dt(W){v[W]!==!0&&(o.enable(W),v[W]=!0)}function wt(W){v[W]!==!1&&(o.disable(W),v[W]=!1)}function kt(W,Ft){return m[W]!==Ft?(o.bindFramebuffer(W,Ft),m[W]=Ft,W===o.DRAW_FRAMEBUFFER&&(m[o.FRAMEBUFFER]=Ft),W===o.FRAMEBUFFER&&(m[o.DRAW_FRAMEBUFFER]=Ft),!0):!1}function Et(W,Ft){let gt=M,St=!1;if(W){gt=x.get(Ft),gt===void 0&&(gt=[],x.set(Ft,gt));const Ht=W.textures;if(gt.length!==Ht.length||gt[0]!==o.COLOR_ATTACHMENT0){for(let Gt=0,ce=Ht.length;Gt<ce;Gt++)gt[Gt]=o.COLOR_ATTACHMENT0+Gt;gt.length=Ht.length,St=!0}}else gt[0]!==o.BACK&&(gt[0]=o.BACK,St=!0);St&&o.drawBuffers(gt)}function bt(W){return T!==W?(o.useProgram(W),T=W,!0):!1}const zt={[os]:o.FUNC_ADD,[hb]:o.FUNC_SUBTRACT,[pb]:o.FUNC_REVERSE_SUBTRACT};zt[mb]=o.MIN,zt[gb]=o.MAX;const te={[vb]:o.ZERO,[_b]:o.ONE,[yb]:o.SRC_COLOR,[Mp]:o.SRC_ALPHA,[Tb]:o.SRC_ALPHA_SATURATE,[Eb]:o.DST_COLOR,[Sb]:o.DST_ALPHA,[xb]:o.ONE_MINUS_SRC_COLOR,[Ep]:o.ONE_MINUS_SRC_ALPHA,[bb]:o.ONE_MINUS_DST_COLOR,[Mb]:o.ONE_MINUS_DST_ALPHA,[wb]:o.CONSTANT_COLOR,[Ab]:o.ONE_MINUS_CONSTANT_COLOR,[Rb]:o.CONSTANT_ALPHA,[Cb]:o.ONE_MINUS_CONSTANT_ALPHA};function G(W,Ft,gt,St,Ht,Gt,ce,Je,_n,we){if(W===Er){w===!0&&(wt(o.BLEND),w=!1);return}if(w===!1&&(dt(o.BLEND),w=!0),W!==db){if(W!==S||we!==R){if((y!==os||N!==os)&&(o.blendEquation(o.FUNC_ADD),y=os,N=os),we)switch(W){case _o:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case Q_:o.blendFunc(o.ONE,o.ONE);break;case J_:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case $_:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case _o:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case Q_:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case J_:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case $_:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}P=null,z=null,X=null,H=null,B.set(0,0,0),F=0,S=W,R=we}return}Ht=Ht||Ft,Gt=Gt||gt,ce=ce||St,(Ft!==y||Ht!==N)&&(o.blendEquationSeparate(zt[Ft],zt[Ht]),y=Ft,N=Ht),(gt!==P||St!==z||Gt!==X||ce!==H)&&(o.blendFuncSeparate(te[gt],te[St],te[Gt],te[ce]),P=gt,z=St,X=Gt,H=ce),(Je.equals(B)===!1||_n!==F)&&(o.blendColor(Je.r,Je.g,Je.b,_n),B.copy(Je),F=_n),S=W,R=!1}function an(W,Ft){W.side===ra?wt(o.CULL_FACE):dt(o.CULL_FACE);let gt=W.side===ni;Ft&&(gt=!gt),re(gt),W.blending===_o&&W.transparent===!1?G(Er):G(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),h.setFunc(W.depthFunc),h.setTest(W.depthTest),h.setMask(W.depthWrite),u.setMask(W.colorWrite);const St=W.stencilWrite;d.setTest(St),St&&(d.setMask(W.stencilWriteMask),d.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),d.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),ve(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?dt(o.SAMPLE_ALPHA_TO_COVERAGE):wt(o.SAMPLE_ALPHA_TO_COVERAGE)}function re(W){E!==W&&(W?o.frontFace(o.CW):o.frontFace(o.CCW),E=W)}function Jt(W){W!==cb?(dt(o.CULL_FACE),W!==L&&(W===K_?o.cullFace(o.BACK):W===ub?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):wt(o.CULL_FACE),L=W}function Nt(W){W!==et&&(k&&o.lineWidth(W),et=W)}function ve(W,Ft,gt){W?(dt(o.POLYGON_OFFSET_FILL),(K!==Ft||ft!==gt)&&(o.polygonOffset(Ft,gt),K=Ft,ft=gt)):wt(o.POLYGON_OFFSET_FILL)}function Yt(W){W?dt(o.SCISSOR_TEST):wt(o.SCISSOR_TEST)}function O(W){W===void 0&&(W=o.TEXTURE0+st-1),_t!==W&&(o.activeTexture(W),_t=W)}function A(W,Ft,gt){gt===void 0&&(_t===null?gt=o.TEXTURE0+st-1:gt=_t);let St=mt[gt];St===void 0&&(St={type:void 0,texture:void 0},mt[gt]=St),(St.type!==W||St.texture!==Ft)&&(_t!==gt&&(o.activeTexture(gt),_t=gt),o.bindTexture(W,Ft||vt[W]),St.type=W,St.texture=Ft)}function lt(){const W=mt[_t];W!==void 0&&W.type!==void 0&&(o.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function V(){try{o.compressedTexImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function nt(){try{o.compressedTexImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ct(){try{o.texSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ot(){try{o.texSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ct(){try{o.compressedTexSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function It(){try{o.compressedTexSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function pe(){try{o.texStorage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Tt(){try{o.texStorage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Xt(){try{o.texImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ne(){try{o.texImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function se(W){Kt.equals(W)===!1&&(o.scissor(W.x,W.y,W.z,W.w),Kt.copy(W))}function jt(W){U.equals(W)===!1&&(o.viewport(W.x,W.y,W.z,W.w),U.copy(W))}function _e(W,Ft){let gt=g.get(Ft);gt===void 0&&(gt=new WeakMap,g.set(Ft,gt));let St=gt.get(W);St===void 0&&(St=o.getUniformBlockIndex(Ft,W.name),gt.set(W,St))}function ue(W,Ft){const St=g.get(Ft).get(W);p.get(Ft)!==St&&(o.uniformBlockBinding(Ft,St,W.__bindingPointIndex),p.set(Ft,St))}function He(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),h.setReversed(!1),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),v={},_t=null,mt={},m={},x=new WeakMap,M=[],T=null,w=!1,S=null,y=null,P=null,z=null,N=null,X=null,H=null,B=new De(0,0,0),F=0,R=!1,E=null,L=null,et=null,K=null,ft=null,Kt.set(0,0,o.canvas.width,o.canvas.height),U.set(0,0,o.canvas.width,o.canvas.height),u.reset(),h.reset(),d.reset()}return{buffers:{color:u,depth:h,stencil:d},enable:dt,disable:wt,bindFramebuffer:kt,drawBuffers:Et,useProgram:bt,setBlending:G,setMaterial:an,setFlipSided:re,setCullFace:Jt,setLineWidth:Nt,setPolygonOffset:ve,setScissorTest:Yt,activeTexture:O,bindTexture:A,unbindTexture:lt,compressedTexImage2D:V,compressedTexImage3D:nt,texImage2D:Xt,texImage3D:ne,updateUBOMapping:_e,uniformBlockBinding:ue,texStorage2D:pe,texStorage3D:Tt,texSubImage2D:ct,texSubImage3D:Ot,compressedTexSubImage2D:Ct,compressedTexSubImage3D:It,scissor:se,viewport:jt,reset:He}}function AR(o,e,i,r,l,u,h){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new Oe,v=new WeakMap;let m;const x=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function T(O,A){return M?new OffscreenCanvas(O,A):Ju("canvas")}function w(O,A,lt){let V=1;const nt=Yt(O);if((nt.width>lt||nt.height>lt)&&(V=lt/Math.max(nt.width,nt.height)),V<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){const ct=Math.floor(V*nt.width),Ot=Math.floor(V*nt.height);m===void 0&&(m=T(ct,Ot));const Ct=A?T(ct,Ot):m;return Ct.width=ct,Ct.height=Ot,Ct.getContext("2d").drawImage(O,0,0,ct,Ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+ct+"x"+Ot+")."),Ct}else return"data"in O&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),O;return O}function S(O){return O.generateMipmaps}function y(O){o.generateMipmap(O)}function P(O){return O.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?o.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?o.TEXTURE_2D_ARRAY:o.TEXTURE_2D}function z(O,A,lt,V,nt=!1){if(O!==null){if(o[O]!==void 0)return o[O];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let ct=A;if(A===o.RED&&(lt===o.FLOAT&&(ct=o.R32F),lt===o.HALF_FLOAT&&(ct=o.R16F),lt===o.UNSIGNED_BYTE&&(ct=o.R8)),A===o.RED_INTEGER&&(lt===o.UNSIGNED_BYTE&&(ct=o.R8UI),lt===o.UNSIGNED_SHORT&&(ct=o.R16UI),lt===o.UNSIGNED_INT&&(ct=o.R32UI),lt===o.BYTE&&(ct=o.R8I),lt===o.SHORT&&(ct=o.R16I),lt===o.INT&&(ct=o.R32I)),A===o.RG&&(lt===o.FLOAT&&(ct=o.RG32F),lt===o.HALF_FLOAT&&(ct=o.RG16F),lt===o.UNSIGNED_BYTE&&(ct=o.RG8)),A===o.RG_INTEGER&&(lt===o.UNSIGNED_BYTE&&(ct=o.RG8UI),lt===o.UNSIGNED_SHORT&&(ct=o.RG16UI),lt===o.UNSIGNED_INT&&(ct=o.RG32UI),lt===o.BYTE&&(ct=o.RG8I),lt===o.SHORT&&(ct=o.RG16I),lt===o.INT&&(ct=o.RG32I)),A===o.RGB_INTEGER&&(lt===o.UNSIGNED_BYTE&&(ct=o.RGB8UI),lt===o.UNSIGNED_SHORT&&(ct=o.RGB16UI),lt===o.UNSIGNED_INT&&(ct=o.RGB32UI),lt===o.BYTE&&(ct=o.RGB8I),lt===o.SHORT&&(ct=o.RGB16I),lt===o.INT&&(ct=o.RGB32I)),A===o.RGBA_INTEGER&&(lt===o.UNSIGNED_BYTE&&(ct=o.RGBA8UI),lt===o.UNSIGNED_SHORT&&(ct=o.RGBA16UI),lt===o.UNSIGNED_INT&&(ct=o.RGBA32UI),lt===o.BYTE&&(ct=o.RGBA8I),lt===o.SHORT&&(ct=o.RGBA16I),lt===o.INT&&(ct=o.RGBA32I)),A===o.RGB&&lt===o.UNSIGNED_INT_5_9_9_9_REV&&(ct=o.RGB9_E5),A===o.RGBA){const Ot=nt?Ku:Ue.getTransfer(V);lt===o.FLOAT&&(ct=o.RGBA32F),lt===o.HALF_FLOAT&&(ct=o.RGBA16F),lt===o.UNSIGNED_BYTE&&(ct=Ot===Ge?o.SRGB8_ALPHA8:o.RGBA8),lt===o.UNSIGNED_SHORT_4_4_4_4&&(ct=o.RGBA4),lt===o.UNSIGNED_SHORT_5_5_5_1&&(ct=o.RGB5_A1)}return(ct===o.R16F||ct===o.R32F||ct===o.RG16F||ct===o.RG32F||ct===o.RGBA16F||ct===o.RGBA32F)&&e.get("EXT_color_buffer_float"),ct}function N(O,A){let lt;return O?A===null||A===ds||A===bo?lt=o.DEPTH24_STENCIL8:A===za?lt=o.DEPTH32F_STENCIL8:A===Bl&&(lt=o.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ds||A===bo?lt=o.DEPTH_COMPONENT24:A===za?lt=o.DEPTH_COMPONENT32F:A===Bl&&(lt=o.DEPTH_COMPONENT16),lt}function X(O,A){return S(O)===!0||O.isFramebufferTexture&&O.minFilter!==Vi&&O.minFilter!==oa?Math.log2(Math.max(A.width,A.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?A.mipmaps.length:1}function H(O){const A=O.target;A.removeEventListener("dispose",H),F(A),A.isVideoTexture&&v.delete(A)}function B(O){const A=O.target;A.removeEventListener("dispose",B),E(A)}function F(O){const A=r.get(O);if(A.__webglInit===void 0)return;const lt=O.source,V=x.get(lt);if(V){const nt=V[A.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&R(O),Object.keys(V).length===0&&x.delete(lt)}r.remove(O)}function R(O){const A=r.get(O);o.deleteTexture(A.__webglTexture);const lt=O.source,V=x.get(lt);delete V[A.__cacheKey],h.memory.textures--}function E(O){const A=r.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),r.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(A.__webglFramebuffer[V]))for(let nt=0;nt<A.__webglFramebuffer[V].length;nt++)o.deleteFramebuffer(A.__webglFramebuffer[V][nt]);else o.deleteFramebuffer(A.__webglFramebuffer[V]);A.__webglDepthbuffer&&o.deleteRenderbuffer(A.__webglDepthbuffer[V])}else{if(Array.isArray(A.__webglFramebuffer))for(let V=0;V<A.__webglFramebuffer.length;V++)o.deleteFramebuffer(A.__webglFramebuffer[V]);else o.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&o.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&o.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let V=0;V<A.__webglColorRenderbuffer.length;V++)A.__webglColorRenderbuffer[V]&&o.deleteRenderbuffer(A.__webglColorRenderbuffer[V]);A.__webglDepthRenderbuffer&&o.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const lt=O.textures;for(let V=0,nt=lt.length;V<nt;V++){const ct=r.get(lt[V]);ct.__webglTexture&&(o.deleteTexture(ct.__webglTexture),h.memory.textures--),r.remove(lt[V])}r.remove(O)}let L=0;function et(){L=0}function K(){const O=L;return O>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+O+" texture units while this GPU supports only "+l.maxTextures),L+=1,O}function ft(O){const A=[];return A.push(O.wrapS),A.push(O.wrapT),A.push(O.wrapR||0),A.push(O.magFilter),A.push(O.minFilter),A.push(O.anisotropy),A.push(O.internalFormat),A.push(O.format),A.push(O.type),A.push(O.generateMipmaps),A.push(O.premultiplyAlpha),A.push(O.flipY),A.push(O.unpackAlignment),A.push(O.colorSpace),A.join()}function st(O,A){const lt=r.get(O);if(O.isVideoTexture&&Nt(O),O.isRenderTargetTexture===!1&&O.version>0&&lt.__version!==O.version){const V=O.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{U(lt,O,A);return}}i.bindTexture(o.TEXTURE_2D,lt.__webglTexture,o.TEXTURE0+A)}function k(O,A){const lt=r.get(O);if(O.version>0&&lt.__version!==O.version){U(lt,O,A);return}i.bindTexture(o.TEXTURE_2D_ARRAY,lt.__webglTexture,o.TEXTURE0+A)}function Y(O,A){const lt=r.get(O);if(O.version>0&&lt.__version!==O.version){U(lt,O,A);return}i.bindTexture(o.TEXTURE_3D,lt.__webglTexture,o.TEXTURE0+A)}function q(O,A){const lt=r.get(O);if(O.version>0&&lt.__version!==O.version){Q(lt,O,A);return}i.bindTexture(o.TEXTURE_CUBE_MAP,lt.__webglTexture,o.TEXTURE0+A)}const _t={[zp]:o.REPEAT,[cs]:o.CLAMP_TO_EDGE,[Lp]:o.MIRRORED_REPEAT},mt={[Vi]:o.NEAREST,[Fb]:o.NEAREST_MIPMAP_NEAREST,[du]:o.NEAREST_MIPMAP_LINEAR,[oa]:o.LINEAR,[Hh]:o.LINEAR_MIPMAP_NEAREST,[us]:o.LINEAR_MIPMAP_LINEAR},At={[jb]:o.NEVER,[Kb]:o.ALWAYS,[Xb]:o.LESS,[Ax]:o.LEQUAL,[qb]:o.EQUAL,[Zb]:o.GEQUAL,[Wb]:o.GREATER,[Yb]:o.NOTEQUAL};function Wt(O,A){if(A.type===za&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===oa||A.magFilter===Hh||A.magFilter===du||A.magFilter===us||A.minFilter===oa||A.minFilter===Hh||A.minFilter===du||A.minFilter===us)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),o.texParameteri(O,o.TEXTURE_WRAP_S,_t[A.wrapS]),o.texParameteri(O,o.TEXTURE_WRAP_T,_t[A.wrapT]),(O===o.TEXTURE_3D||O===o.TEXTURE_2D_ARRAY)&&o.texParameteri(O,o.TEXTURE_WRAP_R,_t[A.wrapR]),o.texParameteri(O,o.TEXTURE_MAG_FILTER,mt[A.magFilter]),o.texParameteri(O,o.TEXTURE_MIN_FILTER,mt[A.minFilter]),A.compareFunction&&(o.texParameteri(O,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(O,o.TEXTURE_COMPARE_FUNC,At[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Vi||A.minFilter!==du&&A.minFilter!==us||A.type===za&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||r.get(A).__currentAnisotropy){const lt=e.get("EXT_texture_filter_anisotropic");o.texParameterf(O,lt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,l.getMaxAnisotropy())),r.get(A).__currentAnisotropy=A.anisotropy}}}function Kt(O,A){let lt=!1;O.__webglInit===void 0&&(O.__webglInit=!0,A.addEventListener("dispose",H));const V=A.source;let nt=x.get(V);nt===void 0&&(nt={},x.set(V,nt));const ct=ft(A);if(ct!==O.__cacheKey){nt[ct]===void 0&&(nt[ct]={texture:o.createTexture(),usedTimes:0},h.memory.textures++,lt=!0),nt[ct].usedTimes++;const Ot=nt[O.__cacheKey];Ot!==void 0&&(nt[O.__cacheKey].usedTimes--,Ot.usedTimes===0&&R(A)),O.__cacheKey=ct,O.__webglTexture=nt[ct].texture}return lt}function U(O,A,lt){let V=o.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(V=o.TEXTURE_2D_ARRAY),A.isData3DTexture&&(V=o.TEXTURE_3D);const nt=Kt(O,A),ct=A.source;i.bindTexture(V,O.__webglTexture,o.TEXTURE0+lt);const Ot=r.get(ct);if(ct.version!==Ot.__version||nt===!0){i.activeTexture(o.TEXTURE0+lt);const Ct=Ue.getPrimaries(Ue.workingColorSpace),It=A.colorSpace===xr?null:Ue.getPrimaries(A.colorSpace),pe=A.colorSpace===xr||Ct===It?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,A.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,A.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe);let Tt=w(A.image,!1,l.maxTextureSize);Tt=ve(A,Tt);const Xt=u.convert(A.format,A.colorSpace),ne=u.convert(A.type);let se=z(A.internalFormat,Xt,ne,A.colorSpace,A.isVideoTexture);Wt(V,A);let jt;const _e=A.mipmaps,ue=A.isVideoTexture!==!0,He=Ot.__version===void 0||nt===!0,W=ct.dataReady,Ft=X(A,Tt);if(A.isDepthTexture)se=N(A.format===To,A.type),He&&(ue?i.texStorage2D(o.TEXTURE_2D,1,se,Tt.width,Tt.height):i.texImage2D(o.TEXTURE_2D,0,se,Tt.width,Tt.height,0,Xt,ne,null));else if(A.isDataTexture)if(_e.length>0){ue&&He&&i.texStorage2D(o.TEXTURE_2D,Ft,se,_e[0].width,_e[0].height);for(let gt=0,St=_e.length;gt<St;gt++)jt=_e[gt],ue?W&&i.texSubImage2D(o.TEXTURE_2D,gt,0,0,jt.width,jt.height,Xt,ne,jt.data):i.texImage2D(o.TEXTURE_2D,gt,se,jt.width,jt.height,0,Xt,ne,jt.data);A.generateMipmaps=!1}else ue?(He&&i.texStorage2D(o.TEXTURE_2D,Ft,se,Tt.width,Tt.height),W&&i.texSubImage2D(o.TEXTURE_2D,0,0,0,Tt.width,Tt.height,Xt,ne,Tt.data)):i.texImage2D(o.TEXTURE_2D,0,se,Tt.width,Tt.height,0,Xt,ne,Tt.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){ue&&He&&i.texStorage3D(o.TEXTURE_2D_ARRAY,Ft,se,_e[0].width,_e[0].height,Tt.depth);for(let gt=0,St=_e.length;gt<St;gt++)if(jt=_e[gt],A.format!==Gi)if(Xt!==null)if(ue){if(W)if(A.layerUpdates.size>0){const Ht=wy(jt.width,jt.height,A.format,A.type);for(const Gt of A.layerUpdates){const ce=jt.data.subarray(Gt*Ht/jt.data.BYTES_PER_ELEMENT,(Gt+1)*Ht/jt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,gt,0,0,Gt,jt.width,jt.height,1,Xt,ce)}A.clearLayerUpdates()}else i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,gt,0,0,0,jt.width,jt.height,Tt.depth,Xt,jt.data)}else i.compressedTexImage3D(o.TEXTURE_2D_ARRAY,gt,se,jt.width,jt.height,Tt.depth,0,jt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ue?W&&i.texSubImage3D(o.TEXTURE_2D_ARRAY,gt,0,0,0,jt.width,jt.height,Tt.depth,Xt,ne,jt.data):i.texImage3D(o.TEXTURE_2D_ARRAY,gt,se,jt.width,jt.height,Tt.depth,0,Xt,ne,jt.data)}else{ue&&He&&i.texStorage2D(o.TEXTURE_2D,Ft,se,_e[0].width,_e[0].height);for(let gt=0,St=_e.length;gt<St;gt++)jt=_e[gt],A.format!==Gi?Xt!==null?ue?W&&i.compressedTexSubImage2D(o.TEXTURE_2D,gt,0,0,jt.width,jt.height,Xt,jt.data):i.compressedTexImage2D(o.TEXTURE_2D,gt,se,jt.width,jt.height,0,jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ue?W&&i.texSubImage2D(o.TEXTURE_2D,gt,0,0,jt.width,jt.height,Xt,ne,jt.data):i.texImage2D(o.TEXTURE_2D,gt,se,jt.width,jt.height,0,Xt,ne,jt.data)}else if(A.isDataArrayTexture)if(ue){if(He&&i.texStorage3D(o.TEXTURE_2D_ARRAY,Ft,se,Tt.width,Tt.height,Tt.depth),W)if(A.layerUpdates.size>0){const gt=wy(Tt.width,Tt.height,A.format,A.type);for(const St of A.layerUpdates){const Ht=Tt.data.subarray(St*gt/Tt.data.BYTES_PER_ELEMENT,(St+1)*gt/Tt.data.BYTES_PER_ELEMENT);i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,St,Tt.width,Tt.height,1,Xt,ne,Ht)}A.clearLayerUpdates()}else i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,Tt.width,Tt.height,Tt.depth,Xt,ne,Tt.data)}else i.texImage3D(o.TEXTURE_2D_ARRAY,0,se,Tt.width,Tt.height,Tt.depth,0,Xt,ne,Tt.data);else if(A.isData3DTexture)ue?(He&&i.texStorage3D(o.TEXTURE_3D,Ft,se,Tt.width,Tt.height,Tt.depth),W&&i.texSubImage3D(o.TEXTURE_3D,0,0,0,0,Tt.width,Tt.height,Tt.depth,Xt,ne,Tt.data)):i.texImage3D(o.TEXTURE_3D,0,se,Tt.width,Tt.height,Tt.depth,0,Xt,ne,Tt.data);else if(A.isFramebufferTexture){if(He)if(ue)i.texStorage2D(o.TEXTURE_2D,Ft,se,Tt.width,Tt.height);else{let gt=Tt.width,St=Tt.height;for(let Ht=0;Ht<Ft;Ht++)i.texImage2D(o.TEXTURE_2D,Ht,se,gt,St,0,Xt,ne,null),gt>>=1,St>>=1}}else if(_e.length>0){if(ue&&He){const gt=Yt(_e[0]);i.texStorage2D(o.TEXTURE_2D,Ft,se,gt.width,gt.height)}for(let gt=0,St=_e.length;gt<St;gt++)jt=_e[gt],ue?W&&i.texSubImage2D(o.TEXTURE_2D,gt,0,0,Xt,ne,jt):i.texImage2D(o.TEXTURE_2D,gt,se,Xt,ne,jt);A.generateMipmaps=!1}else if(ue){if(He){const gt=Yt(Tt);i.texStorage2D(o.TEXTURE_2D,Ft,se,gt.width,gt.height)}W&&i.texSubImage2D(o.TEXTURE_2D,0,0,0,Xt,ne,Tt)}else i.texImage2D(o.TEXTURE_2D,0,se,Xt,ne,Tt);S(A)&&y(V),Ot.__version=ct.version,A.onUpdate&&A.onUpdate(A)}O.__version=A.version}function Q(O,A,lt){if(A.image.length!==6)return;const V=Kt(O,A),nt=A.source;i.bindTexture(o.TEXTURE_CUBE_MAP,O.__webglTexture,o.TEXTURE0+lt);const ct=r.get(nt);if(nt.version!==ct.__version||V===!0){i.activeTexture(o.TEXTURE0+lt);const Ot=Ue.getPrimaries(Ue.workingColorSpace),Ct=A.colorSpace===xr?null:Ue.getPrimaries(A.colorSpace),It=A.colorSpace===xr||Ot===Ct?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,A.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,A.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const pe=A.isCompressedTexture||A.image[0].isCompressedTexture,Tt=A.image[0]&&A.image[0].isDataTexture,Xt=[];for(let St=0;St<6;St++)!pe&&!Tt?Xt[St]=w(A.image[St],!0,l.maxCubemapSize):Xt[St]=Tt?A.image[St].image:A.image[St],Xt[St]=ve(A,Xt[St]);const ne=Xt[0],se=u.convert(A.format,A.colorSpace),jt=u.convert(A.type),_e=z(A.internalFormat,se,jt,A.colorSpace),ue=A.isVideoTexture!==!0,He=ct.__version===void 0||V===!0,W=nt.dataReady;let Ft=X(A,ne);Wt(o.TEXTURE_CUBE_MAP,A);let gt;if(pe){ue&&He&&i.texStorage2D(o.TEXTURE_CUBE_MAP,Ft,_e,ne.width,ne.height);for(let St=0;St<6;St++){gt=Xt[St].mipmaps;for(let Ht=0;Ht<gt.length;Ht++){const Gt=gt[Ht];A.format!==Gi?se!==null?ue?W&&i.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ht,0,0,Gt.width,Gt.height,se,Gt.data):i.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ht,_e,Gt.width,Gt.height,0,Gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ue?W&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ht,0,0,Gt.width,Gt.height,se,jt,Gt.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ht,_e,Gt.width,Gt.height,0,se,jt,Gt.data)}}}else{if(gt=A.mipmaps,ue&&He){gt.length>0&&Ft++;const St=Yt(Xt[0]);i.texStorage2D(o.TEXTURE_CUBE_MAP,Ft,_e,St.width,St.height)}for(let St=0;St<6;St++)if(Tt){ue?W&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,0,0,Xt[St].width,Xt[St].height,se,jt,Xt[St].data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,_e,Xt[St].width,Xt[St].height,0,se,jt,Xt[St].data);for(let Ht=0;Ht<gt.length;Ht++){const ce=gt[Ht].image[St].image;ue?W&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ht+1,0,0,ce.width,ce.height,se,jt,ce.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ht+1,_e,ce.width,ce.height,0,se,jt,ce.data)}}else{ue?W&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,0,0,se,jt,Xt[St]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,_e,se,jt,Xt[St]);for(let Ht=0;Ht<gt.length;Ht++){const Gt=gt[Ht];ue?W&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ht+1,0,0,se,jt,Gt.image[St]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ht+1,_e,se,jt,Gt.image[St])}}}S(A)&&y(o.TEXTURE_CUBE_MAP),ct.__version=nt.version,A.onUpdate&&A.onUpdate(A)}O.__version=A.version}function vt(O,A,lt,V,nt,ct){const Ot=u.convert(lt.format,lt.colorSpace),Ct=u.convert(lt.type),It=z(lt.internalFormat,Ot,Ct,lt.colorSpace),pe=r.get(A),Tt=r.get(lt);if(Tt.__renderTarget=A,!pe.__hasExternalTextures){const Xt=Math.max(1,A.width>>ct),ne=Math.max(1,A.height>>ct);nt===o.TEXTURE_3D||nt===o.TEXTURE_2D_ARRAY?i.texImage3D(nt,ct,It,Xt,ne,A.depth,0,Ot,Ct,null):i.texImage2D(nt,ct,It,Xt,ne,0,Ot,Ct,null)}i.bindFramebuffer(o.FRAMEBUFFER,O),Jt(A)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,V,nt,Tt.__webglTexture,0,re(A)):(nt===o.TEXTURE_2D||nt>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,V,nt,Tt.__webglTexture,ct),i.bindFramebuffer(o.FRAMEBUFFER,null)}function dt(O,A,lt){if(o.bindRenderbuffer(o.RENDERBUFFER,O),A.depthBuffer){const V=A.depthTexture,nt=V&&V.isDepthTexture?V.type:null,ct=N(A.stencilBuffer,nt),Ot=A.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Ct=re(A);Jt(A)?d.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,Ct,ct,A.width,A.height):lt?o.renderbufferStorageMultisample(o.RENDERBUFFER,Ct,ct,A.width,A.height):o.renderbufferStorage(o.RENDERBUFFER,ct,A.width,A.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,Ot,o.RENDERBUFFER,O)}else{const V=A.textures;for(let nt=0;nt<V.length;nt++){const ct=V[nt],Ot=u.convert(ct.format,ct.colorSpace),Ct=u.convert(ct.type),It=z(ct.internalFormat,Ot,Ct,ct.colorSpace),pe=re(A);lt&&Jt(A)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,pe,It,A.width,A.height):Jt(A)?d.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,pe,It,A.width,A.height):o.renderbufferStorage(o.RENDERBUFFER,It,A.width,A.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function wt(O,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(o.FRAMEBUFFER,O),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const V=r.get(A.depthTexture);V.__renderTarget=A,(!V.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),st(A.depthTexture,0);const nt=V.__webglTexture,ct=re(A);if(A.depthTexture.format===yo)Jt(A)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,nt,0,ct):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,nt,0);else if(A.depthTexture.format===To)Jt(A)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,nt,0,ct):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function kt(O){const A=r.get(O),lt=O.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==O.depthTexture){const V=O.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),V){const nt=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,V.removeEventListener("dispose",nt)};V.addEventListener("dispose",nt),A.__depthDisposeCallback=nt}A.__boundDepthTexture=V}if(O.depthTexture&&!A.__autoAllocateDepthBuffer){if(lt)throw new Error("target.depthTexture not supported in Cube render targets");wt(A.__webglFramebuffer,O)}else if(lt){A.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(i.bindFramebuffer(o.FRAMEBUFFER,A.__webglFramebuffer[V]),A.__webglDepthbuffer[V]===void 0)A.__webglDepthbuffer[V]=o.createRenderbuffer(),dt(A.__webglDepthbuffer[V],O,!1);else{const nt=O.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ct=A.__webglDepthbuffer[V];o.bindRenderbuffer(o.RENDERBUFFER,ct),o.framebufferRenderbuffer(o.FRAMEBUFFER,nt,o.RENDERBUFFER,ct)}}else if(i.bindFramebuffer(o.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=o.createRenderbuffer(),dt(A.__webglDepthbuffer,O,!1);else{const V=O.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,nt=A.__webglDepthbuffer;o.bindRenderbuffer(o.RENDERBUFFER,nt),o.framebufferRenderbuffer(o.FRAMEBUFFER,V,o.RENDERBUFFER,nt)}i.bindFramebuffer(o.FRAMEBUFFER,null)}function Et(O,A,lt){const V=r.get(O);A!==void 0&&vt(V.__webglFramebuffer,O,O.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),lt!==void 0&&kt(O)}function bt(O){const A=O.texture,lt=r.get(O),V=r.get(A);O.addEventListener("dispose",B);const nt=O.textures,ct=O.isWebGLCubeRenderTarget===!0,Ot=nt.length>1;if(Ot||(V.__webglTexture===void 0&&(V.__webglTexture=o.createTexture()),V.__version=A.version,h.memory.textures++),ct){lt.__webglFramebuffer=[];for(let Ct=0;Ct<6;Ct++)if(A.mipmaps&&A.mipmaps.length>0){lt.__webglFramebuffer[Ct]=[];for(let It=0;It<A.mipmaps.length;It++)lt.__webglFramebuffer[Ct][It]=o.createFramebuffer()}else lt.__webglFramebuffer[Ct]=o.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){lt.__webglFramebuffer=[];for(let Ct=0;Ct<A.mipmaps.length;Ct++)lt.__webglFramebuffer[Ct]=o.createFramebuffer()}else lt.__webglFramebuffer=o.createFramebuffer();if(Ot)for(let Ct=0,It=nt.length;Ct<It;Ct++){const pe=r.get(nt[Ct]);pe.__webglTexture===void 0&&(pe.__webglTexture=o.createTexture(),h.memory.textures++)}if(O.samples>0&&Jt(O)===!1){lt.__webglMultisampledFramebuffer=o.createFramebuffer(),lt.__webglColorRenderbuffer=[],i.bindFramebuffer(o.FRAMEBUFFER,lt.__webglMultisampledFramebuffer);for(let Ct=0;Ct<nt.length;Ct++){const It=nt[Ct];lt.__webglColorRenderbuffer[Ct]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,lt.__webglColorRenderbuffer[Ct]);const pe=u.convert(It.format,It.colorSpace),Tt=u.convert(It.type),Xt=z(It.internalFormat,pe,Tt,It.colorSpace,O.isXRRenderTarget===!0),ne=re(O);o.renderbufferStorageMultisample(o.RENDERBUFFER,ne,Xt,O.width,O.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ct,o.RENDERBUFFER,lt.__webglColorRenderbuffer[Ct])}o.bindRenderbuffer(o.RENDERBUFFER,null),O.depthBuffer&&(lt.__webglDepthRenderbuffer=o.createRenderbuffer(),dt(lt.__webglDepthRenderbuffer,O,!0)),i.bindFramebuffer(o.FRAMEBUFFER,null)}}if(ct){i.bindTexture(o.TEXTURE_CUBE_MAP,V.__webglTexture),Wt(o.TEXTURE_CUBE_MAP,A);for(let Ct=0;Ct<6;Ct++)if(A.mipmaps&&A.mipmaps.length>0)for(let It=0;It<A.mipmaps.length;It++)vt(lt.__webglFramebuffer[Ct][It],O,A,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,It);else vt(lt.__webglFramebuffer[Ct],O,A,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,0);S(A)&&y(o.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Ot){for(let Ct=0,It=nt.length;Ct<It;Ct++){const pe=nt[Ct],Tt=r.get(pe);i.bindTexture(o.TEXTURE_2D,Tt.__webglTexture),Wt(o.TEXTURE_2D,pe),vt(lt.__webglFramebuffer,O,pe,o.COLOR_ATTACHMENT0+Ct,o.TEXTURE_2D,0),S(pe)&&y(o.TEXTURE_2D)}i.unbindTexture()}else{let Ct=o.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(Ct=O.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),i.bindTexture(Ct,V.__webglTexture),Wt(Ct,A),A.mipmaps&&A.mipmaps.length>0)for(let It=0;It<A.mipmaps.length;It++)vt(lt.__webglFramebuffer[It],O,A,o.COLOR_ATTACHMENT0,Ct,It);else vt(lt.__webglFramebuffer,O,A,o.COLOR_ATTACHMENT0,Ct,0);S(A)&&y(Ct),i.unbindTexture()}O.depthBuffer&&kt(O)}function zt(O){const A=O.textures;for(let lt=0,V=A.length;lt<V;lt++){const nt=A[lt];if(S(nt)){const ct=P(O),Ot=r.get(nt).__webglTexture;i.bindTexture(ct,Ot),y(ct),i.unbindTexture()}}}const te=[],G=[];function an(O){if(O.samples>0){if(Jt(O)===!1){const A=O.textures,lt=O.width,V=O.height;let nt=o.COLOR_BUFFER_BIT;const ct=O.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Ot=r.get(O),Ct=A.length>1;if(Ct)for(let It=0;It<A.length;It++)i.bindFramebuffer(o.FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+It,o.RENDERBUFFER,null),i.bindFramebuffer(o.FRAMEBUFFER,Ot.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+It,o.TEXTURE_2D,null,0);i.bindFramebuffer(o.READ_FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Ot.__webglFramebuffer);for(let It=0;It<A.length;It++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(nt|=o.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(nt|=o.STENCIL_BUFFER_BIT)),Ct){o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,Ot.__webglColorRenderbuffer[It]);const pe=r.get(A[It]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,pe,0)}o.blitFramebuffer(0,0,lt,V,0,0,lt,V,nt,o.NEAREST),p===!0&&(te.length=0,G.length=0,te.push(o.COLOR_ATTACHMENT0+It),O.depthBuffer&&O.resolveDepthBuffer===!1&&(te.push(ct),G.push(ct),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,G)),o.invalidateFramebuffer(o.READ_FRAMEBUFFER,te))}if(i.bindFramebuffer(o.READ_FRAMEBUFFER,null),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),Ct)for(let It=0;It<A.length;It++){i.bindFramebuffer(o.FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+It,o.RENDERBUFFER,Ot.__webglColorRenderbuffer[It]);const pe=r.get(A[It]).__webglTexture;i.bindFramebuffer(o.FRAMEBUFFER,Ot.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+It,o.TEXTURE_2D,pe,0)}i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Ot.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.resolveDepthBuffer===!1&&p){const A=O.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT;o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[A])}}}function re(O){return Math.min(l.maxSamples,O.samples)}function Jt(O){const A=r.get(O);return O.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Nt(O){const A=h.render.frame;v.get(O)!==A&&(v.set(O,A),O.update())}function ve(O,A){const lt=O.colorSpace,V=O.format,nt=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||lt!==wo&&lt!==xr&&(Ue.getTransfer(lt)===Ge?(V!==Gi||nt!==Ba)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",lt)),A}function Yt(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(g.width=O.naturalWidth||O.width,g.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(g.width=O.displayWidth,g.height=O.displayHeight):(g.width=O.width,g.height=O.height),g}this.allocateTextureUnit=K,this.resetTextureUnits=et,this.setTexture2D=st,this.setTexture2DArray=k,this.setTexture3D=Y,this.setTextureCube=q,this.rebindTextures=Et,this.setupRenderTarget=bt,this.updateRenderTargetMipmap=zt,this.updateMultisampleRenderTarget=an,this.setupDepthRenderbuffer=kt,this.setupFrameBufferTexture=vt,this.useMultisampledRTT=Jt}function RR(o,e){function i(r,l=xr){let u;const h=Ue.getTransfer(l);if(r===Ba)return o.UNSIGNED_BYTE;if(r===pm)return o.UNSIGNED_SHORT_4_4_4_4;if(r===mm)return o.UNSIGNED_SHORT_5_5_5_1;if(r===yx)return o.UNSIGNED_INT_5_9_9_9_REV;if(r===vx)return o.BYTE;if(r===_x)return o.SHORT;if(r===Bl)return o.UNSIGNED_SHORT;if(r===hm)return o.INT;if(r===ds)return o.UNSIGNED_INT;if(r===za)return o.FLOAT;if(r===Fl)return o.HALF_FLOAT;if(r===xx)return o.ALPHA;if(r===Sx)return o.RGB;if(r===Gi)return o.RGBA;if(r===Mx)return o.LUMINANCE;if(r===Ex)return o.LUMINANCE_ALPHA;if(r===yo)return o.DEPTH_COMPONENT;if(r===To)return o.DEPTH_STENCIL;if(r===bx)return o.RED;if(r===gm)return o.RED_INTEGER;if(r===Tx)return o.RG;if(r===vm)return o.RG_INTEGER;if(r===_m)return o.RGBA_INTEGER;if(r===ku||r===Gu||r===Vu||r===ju)if(h===Ge)if(u=e.get("WEBGL_compressed_texture_s3tc_srgb"),u!==null){if(r===ku)return u.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Gu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Vu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ju)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(u=e.get("WEBGL_compressed_texture_s3tc"),u!==null){if(r===ku)return u.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Gu)return u.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Vu)return u.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ju)return u.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Op||r===Pp||r===Bp||r===Ip)if(u=e.get("WEBGL_compressed_texture_pvrtc"),u!==null){if(r===Op)return u.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Pp)return u.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Bp)return u.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ip)return u.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Fp||r===Hp||r===kp)if(u=e.get("WEBGL_compressed_texture_etc"),u!==null){if(r===Fp||r===Hp)return h===Ge?u.COMPRESSED_SRGB8_ETC2:u.COMPRESSED_RGB8_ETC2;if(r===kp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:u.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Gp||r===Vp||r===jp||r===Xp||r===qp||r===Wp||r===Yp||r===Zp||r===Kp||r===Qp||r===Jp||r===$p||r===tm||r===em)if(u=e.get("WEBGL_compressed_texture_astc"),u!==null){if(r===Gp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:u.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Vp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:u.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===jp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:u.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Xp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:u.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===qp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:u.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Wp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:u.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Yp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:u.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Zp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:u.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Kp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:u.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Qp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:u.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Jp)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:u.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===$p)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:u.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===tm)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:u.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===em)return h===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:u.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Xu||r===nm||r===im)if(u=e.get("EXT_texture_compression_bptc"),u!==null){if(r===Xu)return h===Ge?u.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:u.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===nm)return u.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===im)return u.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===wx||r===am||r===rm||r===sm)if(u=e.get("EXT_texture_compression_rgtc"),u!==null){if(r===Xu)return u.COMPRESSED_RED_RGTC1_EXT;if(r===am)return u.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===rm)return u.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===sm)return u.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===bo?o.UNSIGNED_INT_24_8:o[r]!==void 0?o[r]:null}return{convert:i}}const CR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,DR=`
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

}`;class NR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i,r){if(this.texture===null){const l=new ii,u=e.properties.get(l);u.__webglTexture=i.texture,(i.depthNear!==r.depthNear||i.depthFar!==r.depthFar)&&(this.depthNear=i.depthNear,this.depthFar=i.depthFar),this.texture=l}}getMesh(e){if(this.texture!==null&&this.mesh===null){const i=e.cameras[0].viewport,r=new Fa({vertexShader:CR,fragmentShader:DR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Ci(new af(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class UR extends Ro{constructor(e,i){super();const r=this;let l=null,u=1,h=null,d="local-floor",p=1,g=null,v=null,m=null,x=null,M=null,T=null;const w=new NR,S=i.getContextAttributes();let y=null,P=null;const z=[],N=[],X=new Oe;let H=null;const B=new Ri;B.viewport=new Ze;const F=new Ri;F.viewport=new Ze;const R=[B,F],E=new QT;let L=null,et=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let Q=z[U];return Q===void 0&&(Q=new sp,z[U]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(U){let Q=z[U];return Q===void 0&&(Q=new sp,z[U]=Q),Q.getGripSpace()},this.getHand=function(U){let Q=z[U];return Q===void 0&&(Q=new sp,z[U]=Q),Q.getHandSpace()};function K(U){const Q=N.indexOf(U.inputSource);if(Q===-1)return;const vt=z[Q];vt!==void 0&&(vt.update(U.inputSource,U.frame,g||h),vt.dispatchEvent({type:U.type,data:U.inputSource}))}function ft(){l.removeEventListener("select",K),l.removeEventListener("selectstart",K),l.removeEventListener("selectend",K),l.removeEventListener("squeeze",K),l.removeEventListener("squeezestart",K),l.removeEventListener("squeezeend",K),l.removeEventListener("end",ft),l.removeEventListener("inputsourceschange",st);for(let U=0;U<z.length;U++){const Q=N[U];Q!==null&&(N[U]=null,z[U].disconnect(Q))}L=null,et=null,w.reset(),e.setRenderTarget(y),M=null,x=null,m=null,l=null,P=null,Kt.stop(),r.isPresenting=!1,e.setPixelRatio(H),e.setSize(X.width,X.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){u=U,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){d=U,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return g||h},this.setReferenceSpace=function(U){g=U},this.getBaseLayer=function(){return x!==null?x:M},this.getBinding=function(){return m},this.getFrame=function(){return T},this.getSession=function(){return l},this.setSession=async function(U){if(l=U,l!==null){if(y=e.getRenderTarget(),l.addEventListener("select",K),l.addEventListener("selectstart",K),l.addEventListener("selectend",K),l.addEventListener("squeeze",K),l.addEventListener("squeezestart",K),l.addEventListener("squeezeend",K),l.addEventListener("end",ft),l.addEventListener("inputsourceschange",st),S.xrCompatible!==!0&&await i.makeXRCompatible(),H=e.getPixelRatio(),e.getSize(X),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,dt=null,wt=null;S.depth&&(wt=S.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,vt=S.stencil?To:yo,dt=S.stencil?bo:ds);const kt={colorFormat:i.RGBA8,depthFormat:wt,scaleFactor:u};m=new XRWebGLBinding(l,i),x=m.createProjectionLayer(kt),l.updateRenderState({layers:[x]}),e.setPixelRatio(1),e.setSize(x.textureWidth,x.textureHeight,!1),P=new hs(x.textureWidth,x.textureHeight,{format:Gi,type:Ba,depthTexture:new Hx(x.textureWidth,x.textureHeight,dt,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1})}else{const vt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:u};M=new XRWebGLLayer(l,i,vt),l.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),P=new hs(M.framebufferWidth,M.framebufferHeight,{format:Gi,type:Ba,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1})}P.isXRRenderTarget=!0,this.setFoveation(p),g=null,h=await l.requestReferenceSpace(d),Kt.setContext(l),Kt.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return w.getDepthTexture()};function st(U){for(let Q=0;Q<U.removed.length;Q++){const vt=U.removed[Q],dt=N.indexOf(vt);dt>=0&&(N[dt]=null,z[dt].disconnect(vt))}for(let Q=0;Q<U.added.length;Q++){const vt=U.added[Q];let dt=N.indexOf(vt);if(dt===-1){for(let kt=0;kt<z.length;kt++)if(kt>=N.length){N.push(vt),dt=kt;break}else if(N[kt]===null){N[kt]=vt,dt=kt;break}if(dt===-1)break}const wt=z[dt];wt&&wt.connect(vt)}}const k=new it,Y=new it;function q(U,Q,vt){k.setFromMatrixPosition(Q.matrixWorld),Y.setFromMatrixPosition(vt.matrixWorld);const dt=k.distanceTo(Y),wt=Q.projectionMatrix.elements,kt=vt.projectionMatrix.elements,Et=wt[14]/(wt[10]-1),bt=wt[14]/(wt[10]+1),zt=(wt[9]+1)/wt[5],te=(wt[9]-1)/wt[5],G=(wt[8]-1)/wt[0],an=(kt[8]+1)/kt[0],re=Et*G,Jt=Et*an,Nt=dt/(-G+an),ve=Nt*-G;if(Q.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(ve),U.translateZ(Nt),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert(),wt[10]===-1)U.projectionMatrix.copy(Q.projectionMatrix),U.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const Yt=Et+Nt,O=bt+Nt,A=re-ve,lt=Jt+(dt-ve),V=zt*bt/O*Yt,nt=te*bt/O*Yt;U.projectionMatrix.makePerspective(A,lt,V,nt,Yt,O),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}}function _t(U,Q){Q===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(Q.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(l===null)return;let Q=U.near,vt=U.far;w.texture!==null&&(w.depthNear>0&&(Q=w.depthNear),w.depthFar>0&&(vt=w.depthFar)),E.near=F.near=B.near=Q,E.far=F.far=B.far=vt,(L!==E.near||et!==E.far)&&(l.updateRenderState({depthNear:E.near,depthFar:E.far}),L=E.near,et=E.far),B.layers.mask=U.layers.mask|2,F.layers.mask=U.layers.mask|4,E.layers.mask=B.layers.mask|F.layers.mask;const dt=U.parent,wt=E.cameras;_t(E,dt);for(let kt=0;kt<wt.length;kt++)_t(wt[kt],dt);wt.length===2?q(E,B,F):E.projectionMatrix.copy(B.projectionMatrix),mt(U,E,dt)};function mt(U,Q,vt){vt===null?U.matrix.copy(Q.matrixWorld):(U.matrix.copy(vt.matrixWorld),U.matrix.invert(),U.matrix.multiply(Q.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(Q.projectionMatrix),U.projectionMatrixInverse.copy(Q.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=Il*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return E},this.getFoveation=function(){if(!(x===null&&M===null))return p},this.setFoveation=function(U){p=U,x!==null&&(x.fixedFoveation=U),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=U)},this.hasDepthSensing=function(){return w.texture!==null},this.getDepthSensingMesh=function(){return w.getMesh(E)};let At=null;function Wt(U,Q){if(v=Q.getViewerPose(g||h),T=Q,v!==null){const vt=v.views;M!==null&&(e.setRenderTargetFramebuffer(P,M.framebuffer),e.setRenderTarget(P));let dt=!1;vt.length!==E.cameras.length&&(E.cameras.length=0,dt=!0);for(let Et=0;Et<vt.length;Et++){const bt=vt[Et];let zt=null;if(M!==null)zt=M.getViewport(bt);else{const G=m.getViewSubImage(x,bt);zt=G.viewport,Et===0&&(e.setRenderTargetTextures(P,G.colorTexture,x.ignoreDepthValues?void 0:G.depthStencilTexture),e.setRenderTarget(P))}let te=R[Et];te===void 0&&(te=new Ri,te.layers.enable(Et),te.viewport=new Ze,R[Et]=te),te.matrix.fromArray(bt.transform.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale),te.projectionMatrix.fromArray(bt.projectionMatrix),te.projectionMatrixInverse.copy(te.projectionMatrix).invert(),te.viewport.set(zt.x,zt.y,zt.width,zt.height),Et===0&&(E.matrix.copy(te.matrix),E.matrix.decompose(E.position,E.quaternion,E.scale)),dt===!0&&E.cameras.push(te)}const wt=l.enabledFeatures;if(wt&&wt.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&m){const Et=m.getDepthInformation(vt[0]);Et&&Et.isValid&&Et.texture&&w.init(e,Et,l.renderState)}}for(let vt=0;vt<z.length;vt++){const dt=N[vt],wt=z[vt];dt!==null&&wt!==void 0&&wt.update(dt,Q,g||h)}At&&At(U,Q),Q.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:Q}),T=null}const Kt=new kx;Kt.setAnimationLoop(Wt),this.setAnimationLoop=function(U){At=U},this.dispose=function(){}}}const ns=new Ia,zR=new nn;function LR(o,e){function i(S,y){S.matrixAutoUpdate===!0&&S.updateMatrix(),y.value.copy(S.matrix)}function r(S,y){y.color.getRGB(S.fogColor.value,Ox(o)),y.isFog?(S.fogNear.value=y.near,S.fogFar.value=y.far):y.isFogExp2&&(S.fogDensity.value=y.density)}function l(S,y,P,z,N){y.isMeshBasicMaterial||y.isMeshLambertMaterial?u(S,y):y.isMeshToonMaterial?(u(S,y),m(S,y)):y.isMeshPhongMaterial?(u(S,y),v(S,y)):y.isMeshStandardMaterial?(u(S,y),x(S,y),y.isMeshPhysicalMaterial&&M(S,y,N)):y.isMeshMatcapMaterial?(u(S,y),T(S,y)):y.isMeshDepthMaterial?u(S,y):y.isMeshDistanceMaterial?(u(S,y),w(S,y)):y.isMeshNormalMaterial?u(S,y):y.isLineBasicMaterial?(h(S,y),y.isLineDashedMaterial&&d(S,y)):y.isPointsMaterial?p(S,y,P,z):y.isSpriteMaterial?g(S,y):y.isShadowMaterial?(S.color.value.copy(y.color),S.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function u(S,y){S.opacity.value=y.opacity,y.color&&S.diffuse.value.copy(y.color),y.emissive&&S.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(S.map.value=y.map,i(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,i(y.alphaMap,S.alphaMapTransform)),y.bumpMap&&(S.bumpMap.value=y.bumpMap,i(y.bumpMap,S.bumpMapTransform),S.bumpScale.value=y.bumpScale,y.side===ni&&(S.bumpScale.value*=-1)),y.normalMap&&(S.normalMap.value=y.normalMap,i(y.normalMap,S.normalMapTransform),S.normalScale.value.copy(y.normalScale),y.side===ni&&S.normalScale.value.negate()),y.displacementMap&&(S.displacementMap.value=y.displacementMap,i(y.displacementMap,S.displacementMapTransform),S.displacementScale.value=y.displacementScale,S.displacementBias.value=y.displacementBias),y.emissiveMap&&(S.emissiveMap.value=y.emissiveMap,i(y.emissiveMap,S.emissiveMapTransform)),y.specularMap&&(S.specularMap.value=y.specularMap,i(y.specularMap,S.specularMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest);const P=e.get(y),z=P.envMap,N=P.envMapRotation;z&&(S.envMap.value=z,ns.copy(N),ns.x*=-1,ns.y*=-1,ns.z*=-1,z.isCubeTexture&&z.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),S.envMapRotation.value.setFromMatrix4(zR.makeRotationFromEuler(ns)),S.flipEnvMap.value=z.isCubeTexture&&z.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=y.reflectivity,S.ior.value=y.ior,S.refractionRatio.value=y.refractionRatio),y.lightMap&&(S.lightMap.value=y.lightMap,S.lightMapIntensity.value=y.lightMapIntensity,i(y.lightMap,S.lightMapTransform)),y.aoMap&&(S.aoMap.value=y.aoMap,S.aoMapIntensity.value=y.aoMapIntensity,i(y.aoMap,S.aoMapTransform))}function h(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,y.map&&(S.map.value=y.map,i(y.map,S.mapTransform))}function d(S,y){S.dashSize.value=y.dashSize,S.totalSize.value=y.dashSize+y.gapSize,S.scale.value=y.scale}function p(S,y,P,z){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.size.value=y.size*P,S.scale.value=z*.5,y.map&&(S.map.value=y.map,i(y.map,S.uvTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,i(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function g(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.rotation.value=y.rotation,y.map&&(S.map.value=y.map,i(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,i(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function v(S,y){S.specular.value.copy(y.specular),S.shininess.value=Math.max(y.shininess,1e-4)}function m(S,y){y.gradientMap&&(S.gradientMap.value=y.gradientMap)}function x(S,y){S.metalness.value=y.metalness,y.metalnessMap&&(S.metalnessMap.value=y.metalnessMap,i(y.metalnessMap,S.metalnessMapTransform)),S.roughness.value=y.roughness,y.roughnessMap&&(S.roughnessMap.value=y.roughnessMap,i(y.roughnessMap,S.roughnessMapTransform)),y.envMap&&(S.envMapIntensity.value=y.envMapIntensity)}function M(S,y,P){S.ior.value=y.ior,y.sheen>0&&(S.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),S.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(S.sheenColorMap.value=y.sheenColorMap,i(y.sheenColorMap,S.sheenColorMapTransform)),y.sheenRoughnessMap&&(S.sheenRoughnessMap.value=y.sheenRoughnessMap,i(y.sheenRoughnessMap,S.sheenRoughnessMapTransform))),y.clearcoat>0&&(S.clearcoat.value=y.clearcoat,S.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(S.clearcoatMap.value=y.clearcoatMap,i(y.clearcoatMap,S.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,i(y.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(S.clearcoatNormalMap.value=y.clearcoatNormalMap,i(y.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===ni&&S.clearcoatNormalScale.value.negate())),y.dispersion>0&&(S.dispersion.value=y.dispersion),y.iridescence>0&&(S.iridescence.value=y.iridescence,S.iridescenceIOR.value=y.iridescenceIOR,S.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(S.iridescenceMap.value=y.iridescenceMap,i(y.iridescenceMap,S.iridescenceMapTransform)),y.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=y.iridescenceThicknessMap,i(y.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),y.transmission>0&&(S.transmission.value=y.transmission,S.transmissionSamplerMap.value=P.texture,S.transmissionSamplerSize.value.set(P.width,P.height),y.transmissionMap&&(S.transmissionMap.value=y.transmissionMap,i(y.transmissionMap,S.transmissionMapTransform)),S.thickness.value=y.thickness,y.thicknessMap&&(S.thicknessMap.value=y.thicknessMap,i(y.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=y.attenuationDistance,S.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(S.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(S.anisotropyMap.value=y.anisotropyMap,i(y.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=y.specularIntensity,S.specularColor.value.copy(y.specularColor),y.specularColorMap&&(S.specularColorMap.value=y.specularColorMap,i(y.specularColorMap,S.specularColorMapTransform)),y.specularIntensityMap&&(S.specularIntensityMap.value=y.specularIntensityMap,i(y.specularIntensityMap,S.specularIntensityMapTransform))}function T(S,y){y.matcap&&(S.matcap.value=y.matcap)}function w(S,y){const P=e.get(y).light;S.referencePosition.value.setFromMatrixPosition(P.matrixWorld),S.nearDistance.value=P.shadow.camera.near,S.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:l}}function OR(o,e,i,r){let l={},u={},h=[];const d=o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS);function p(P,z){const N=z.program;r.uniformBlockBinding(P,N)}function g(P,z){let N=l[P.id];N===void 0&&(T(P),N=v(P),l[P.id]=N,P.addEventListener("dispose",S));const X=z.program;r.updateUBOMapping(P,X);const H=e.render.frame;u[P.id]!==H&&(x(P),u[P.id]=H)}function v(P){const z=m();P.__bindingPointIndex=z;const N=o.createBuffer(),X=P.__size,H=P.usage;return o.bindBuffer(o.UNIFORM_BUFFER,N),o.bufferData(o.UNIFORM_BUFFER,X,H),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,z,N),N}function m(){for(let P=0;P<d;P++)if(h.indexOf(P)===-1)return h.push(P),P;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(P){const z=l[P.id],N=P.uniforms,X=P.__cache;o.bindBuffer(o.UNIFORM_BUFFER,z);for(let H=0,B=N.length;H<B;H++){const F=Array.isArray(N[H])?N[H]:[N[H]];for(let R=0,E=F.length;R<E;R++){const L=F[R];if(M(L,H,R,X)===!0){const et=L.__offset,K=Array.isArray(L.value)?L.value:[L.value];let ft=0;for(let st=0;st<K.length;st++){const k=K[st],Y=w(k);typeof k=="number"||typeof k=="boolean"?(L.__data[0]=k,o.bufferSubData(o.UNIFORM_BUFFER,et+ft,L.__data)):k.isMatrix3?(L.__data[0]=k.elements[0],L.__data[1]=k.elements[1],L.__data[2]=k.elements[2],L.__data[3]=0,L.__data[4]=k.elements[3],L.__data[5]=k.elements[4],L.__data[6]=k.elements[5],L.__data[7]=0,L.__data[8]=k.elements[6],L.__data[9]=k.elements[7],L.__data[10]=k.elements[8],L.__data[11]=0):(k.toArray(L.__data,ft),ft+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,et,L.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function M(P,z,N,X){const H=P.value,B=z+"_"+N;if(X[B]===void 0)return typeof H=="number"||typeof H=="boolean"?X[B]=H:X[B]=H.clone(),!0;{const F=X[B];if(typeof H=="number"||typeof H=="boolean"){if(F!==H)return X[B]=H,!0}else if(F.equals(H)===!1)return F.copy(H),!0}return!1}function T(P){const z=P.uniforms;let N=0;const X=16;for(let B=0,F=z.length;B<F;B++){const R=Array.isArray(z[B])?z[B]:[z[B]];for(let E=0,L=R.length;E<L;E++){const et=R[E],K=Array.isArray(et.value)?et.value:[et.value];for(let ft=0,st=K.length;ft<st;ft++){const k=K[ft],Y=w(k),q=N%X,_t=q%Y.boundary,mt=q+_t;N+=_t,mt!==0&&X-mt<Y.storage&&(N+=X-mt),et.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),et.__offset=N,N+=Y.storage}}}const H=N%X;return H>0&&(N+=X-H),P.__size=N,P.__cache={},this}function w(P){const z={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(z.boundary=4,z.storage=4):P.isVector2?(z.boundary=8,z.storage=8):P.isVector3||P.isColor?(z.boundary=16,z.storage=12):P.isVector4?(z.boundary=16,z.storage=16):P.isMatrix3?(z.boundary=48,z.storage=48):P.isMatrix4?(z.boundary=64,z.storage=64):P.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",P),z}function S(P){const z=P.target;z.removeEventListener("dispose",S);const N=h.indexOf(z.__bindingPointIndex);h.splice(N,1),o.deleteBuffer(l[z.id]),delete l[z.id],delete u[z.id]}function y(){for(const P in l)o.deleteBuffer(l[P]);h=[],l={},u={}}return{bind:p,update:g,dispose:y}}class PR{constructor(e={}){const{canvas:i=pT(),context:r=null,depth:l=!0,stencil:u=!1,alpha:h=!1,antialias:d=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:g=!1,powerPreference:v="default",failIfMajorPerformanceCaveat:m=!1,reverseDepthBuffer:x=!1}=e;this.isWebGLRenderer=!0;let M;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=r.getContextAttributes().alpha}else M=h;const T=new Uint32Array(4),w=new Int32Array(4);let S=null,y=null;const P=[],z=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ai,this.toneMapping=br,this.toneMappingExposure=1;const N=this;let X=!1,H=0,B=0,F=null,R=-1,E=null;const L=new Ze,et=new Ze;let K=null;const ft=new De(0);let st=0,k=i.width,Y=i.height,q=1,_t=null,mt=null;const At=new Ze(0,0,k,Y),Wt=new Ze(0,0,k,Y);let Kt=!1;const U=new Ix;let Q=!1,vt=!1;this.transmissionResolutionScale=1;const dt=new nn,wt=new nn,kt=new it,Et=new Ze,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let zt=!1;function te(){return F===null?q:1}let G=r;function an(D,tt){return i.getContext(D,tt)}try{const D={alpha:!0,depth:l,stencil:u,antialias:d,premultipliedAlpha:p,preserveDrawingBuffer:g,powerPreference:v,failIfMajorPerformanceCaveat:m};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${dm}`),i.addEventListener("webglcontextlost",St,!1),i.addEventListener("webglcontextrestored",Ht,!1),i.addEventListener("webglcontextcreationerror",Gt,!1),G===null){const tt="webgl2";if(G=an(tt,D),G===null)throw an(tt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let re,Jt,Nt,ve,Yt,O,A,lt,V,nt,ct,Ot,Ct,It,pe,Tt,Xt,ne,se,jt,_e,ue,He,W;function Ft(){re=new qA(G),re.init(),ue=new RR(G,re),Jt=new FA(G,re,e,ue),Nt=new wR(G,re),Jt.reverseDepthBuffer&&x&&Nt.buffers.depth.setReversed(!0),ve=new ZA(G),Yt=new hR,O=new AR(G,re,Nt,Yt,Jt,ue,ve),A=new kA(N),lt=new XA(N),V=new e1(G),He=new BA(G,V),nt=new WA(G,V,ve,He),ct=new QA(G,nt,V,ve),se=new KA(G,Jt,O),Tt=new HA(Yt),Ot=new dR(N,A,lt,re,Jt,He,Tt),Ct=new LR(N,Yt),It=new mR,pe=new SR(re),ne=new PA(N,A,lt,Nt,ct,M,p),Xt=new bR(N,ct,Jt),W=new OR(G,ve,Jt,Nt),jt=new IA(G,re,ve),_e=new YA(G,re,ve),ve.programs=Ot.programs,N.capabilities=Jt,N.extensions=re,N.properties=Yt,N.renderLists=It,N.shadowMap=Xt,N.state=Nt,N.info=ve}Ft();const gt=new UR(N,G);this.xr=gt,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const D=re.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=re.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(D){D!==void 0&&(q=D,this.setSize(k,Y,!1))},this.getSize=function(D){return D.set(k,Y)},this.setSize=function(D,tt,ht=!0){if(gt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=D,Y=tt,i.width=Math.floor(D*q),i.height=Math.floor(tt*q),ht===!0&&(i.style.width=D+"px",i.style.height=tt+"px"),this.setViewport(0,0,D,tt)},this.getDrawingBufferSize=function(D){return D.set(k*q,Y*q).floor()},this.setDrawingBufferSize=function(D,tt,ht){k=D,Y=tt,q=ht,i.width=Math.floor(D*ht),i.height=Math.floor(tt*ht),this.setViewport(0,0,D,tt)},this.getCurrentViewport=function(D){return D.copy(L)},this.getViewport=function(D){return D.copy(At)},this.setViewport=function(D,tt,ht,pt){D.isVector4?At.set(D.x,D.y,D.z,D.w):At.set(D,tt,ht,pt),Nt.viewport(L.copy(At).multiplyScalar(q).round())},this.getScissor=function(D){return D.copy(Wt)},this.setScissor=function(D,tt,ht,pt){D.isVector4?Wt.set(D.x,D.y,D.z,D.w):Wt.set(D,tt,ht,pt),Nt.scissor(et.copy(Wt).multiplyScalar(q).round())},this.getScissorTest=function(){return Kt},this.setScissorTest=function(D){Nt.setScissorTest(Kt=D)},this.setOpaqueSort=function(D){_t=D},this.setTransparentSort=function(D){mt=D},this.getClearColor=function(D){return D.copy(ne.getClearColor())},this.setClearColor=function(){ne.setClearColor(...arguments)},this.getClearAlpha=function(){return ne.getClearAlpha()},this.setClearAlpha=function(){ne.setClearAlpha(...arguments)},this.clear=function(D=!0,tt=!0,ht=!0){let pt=0;if(D){let at=!1;if(F!==null){const Mt=F.texture.format;at=Mt===_m||Mt===vm||Mt===gm}if(at){const Mt=F.texture.type,Ut=Mt===Ba||Mt===ds||Mt===Bl||Mt===bo||Mt===pm||Mt===mm,Dt=ne.getClearColor(),Bt=ne.getClearAlpha(),ee=Dt.r,oe=Dt.g,$t=Dt.b;Ut?(T[0]=ee,T[1]=oe,T[2]=$t,T[3]=Bt,G.clearBufferuiv(G.COLOR,0,T)):(w[0]=ee,w[1]=oe,w[2]=$t,w[3]=Bt,G.clearBufferiv(G.COLOR,0,w))}else pt|=G.COLOR_BUFFER_BIT}tt&&(pt|=G.DEPTH_BUFFER_BIT),ht&&(pt|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(pt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",St,!1),i.removeEventListener("webglcontextrestored",Ht,!1),i.removeEventListener("webglcontextcreationerror",Gt,!1),ne.dispose(),It.dispose(),pe.dispose(),Yt.dispose(),A.dispose(),lt.dispose(),ct.dispose(),He.dispose(),W.dispose(),Ot.dispose(),gt.dispose(),gt.removeEventListener("sessionstart",Bn),gt.removeEventListener("sessionend",Vl),ca.stop()};function St(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),X=!0}function Ht(){console.log("THREE.WebGLRenderer: Context Restored."),X=!1;const D=ve.autoReset,tt=Xt.enabled,ht=Xt.autoUpdate,pt=Xt.needsUpdate,at=Xt.type;Ft(),ve.autoReset=D,Xt.enabled=tt,Xt.autoUpdate=ht,Xt.needsUpdate=pt,Xt.type=at}function Gt(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function ce(D){const tt=D.target;tt.removeEventListener("dispose",ce),Je(tt)}function Je(D){_n(D),Yt.remove(D)}function _n(D){const tt=Yt.get(D).programs;tt!==void 0&&(tt.forEach(function(ht){Ot.releaseProgram(ht)}),D.isShaderMaterial&&Ot.releaseShaderCache(D))}this.renderBufferDirect=function(D,tt,ht,pt,at,Mt){tt===null&&(tt=bt);const Ut=at.isMesh&&at.matrixWorld.determinant()<0,Dt=sf(D,tt,ht,pt,at);Nt.setMaterial(pt,Ut);let Bt=ht.index,ee=1;if(pt.wireframe===!0){if(Bt=nt.getWireframeAttribute(ht),Bt===void 0)return;ee=2}const oe=ht.drawRange,$t=ht.attributes.position;let Ae=oe.start*ee,Ce=(oe.start+oe.count)*ee;Mt!==null&&(Ae=Math.max(Ae,Mt.start*ee),Ce=Math.min(Ce,(Mt.start+Mt.count)*ee)),Bt!==null?(Ae=Math.max(Ae,0),Ce=Math.min(Ce,Bt.count)):$t!=null&&(Ae=Math.max(Ae,0),Ce=Math.min(Ce,$t.count));const qe=Ce-Ae;if(qe<0||qe===1/0)return;He.setup(at,pt,Dt,ht,Bt);let Ve,ye=jt;if(Bt!==null&&(Ve=V.get(Bt),ye=_e,ye.setIndex(Ve)),at.isMesh)pt.wireframe===!0?(Nt.setLineWidth(pt.wireframeLinewidth*te()),ye.setMode(G.LINES)):ye.setMode(G.TRIANGLES);else if(at.isLine){let Zt=pt.linewidth;Zt===void 0&&(Zt=1),Nt.setLineWidth(Zt*te()),at.isLineSegments?ye.setMode(G.LINES):at.isLineLoop?ye.setMode(G.LINE_LOOP):ye.setMode(G.LINE_STRIP)}else at.isPoints?ye.setMode(G.POINTS):at.isSprite&&ye.setMode(G.TRIANGLES);if(at.isBatchedMesh)if(at._multiDrawInstances!==null)as("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ye.renderMultiDrawInstances(at._multiDrawStarts,at._multiDrawCounts,at._multiDrawCount,at._multiDrawInstances);else if(re.get("WEBGL_multi_draw"))ye.renderMultiDraw(at._multiDrawStarts,at._multiDrawCounts,at._multiDrawCount);else{const Zt=at._multiDrawStarts,$e=at._multiDrawCounts,Ee=at._multiDrawCount,xn=Bt?V.get(Bt).bytesPerElement:1,Qe=Yt.get(pt).currentProgram.getUniforms();for(let In=0;In<Ee;In++)Qe.setValue(G,"_gl_DrawID",In),ye.render(Zt[In]/xn,$e[In])}else if(at.isInstancedMesh)ye.renderInstances(Ae,qe,at.count);else if(ht.isInstancedBufferGeometry){const Zt=ht._maxInstanceCount!==void 0?ht._maxInstanceCount:1/0,$e=Math.min(ht.instanceCount,Zt);ye.renderInstances(Ae,qe,$e)}else ye.render(Ae,qe)};function we(D,tt,ht){D.transparent===!0&&D.side===ra&&D.forceSinglePass===!1?(D.side=ni,D.needsUpdate=!0,fa(D,tt,ht),D.side=Tr,D.needsUpdate=!0,fa(D,tt,ht),D.side=ra):fa(D,tt,ht)}this.compile=function(D,tt,ht=null){ht===null&&(ht=D),y=pe.get(ht),y.init(tt),z.push(y),ht.traverseVisible(function(at){at.isLight&&at.layers.test(tt.layers)&&(y.pushLight(at),at.castShadow&&y.pushShadow(at))}),D!==ht&&D.traverseVisible(function(at){at.isLight&&at.layers.test(tt.layers)&&(y.pushLight(at),at.castShadow&&y.pushShadow(at))}),y.setupLights();const pt=new Set;return D.traverse(function(at){if(!(at.isMesh||at.isPoints||at.isLine||at.isSprite))return;const Mt=at.material;if(Mt)if(Array.isArray(Mt))for(let Ut=0;Ut<Mt.length;Ut++){const Dt=Mt[Ut];we(Dt,ht,at),pt.add(Dt)}else we(Mt,ht,at),pt.add(Mt)}),y=z.pop(),pt},this.compileAsync=function(D,tt,ht=null){const pt=this.compile(D,tt,ht);return new Promise(at=>{function Mt(){if(pt.forEach(function(Ut){Yt.get(Ut).currentProgram.isReady()&&pt.delete(Ut)}),pt.size===0){at(D);return}setTimeout(Mt,10)}re.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let Ke=null;function yn(D){Ke&&Ke(D)}function Bn(){ca.stop()}function Vl(){ca.start()}const ca=new kx;ca.setAnimationLoop(yn),typeof self<"u"&&ca.setContext(self),this.setAnimationLoop=function(D){Ke=D,gt.setAnimationLoop(D),D===null?ca.stop():ca.start()},gt.addEventListener("sessionstart",Bn),gt.addEventListener("sessionend",Vl),this.render=function(D,tt){if(tt!==void 0&&tt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(X===!0)return;if(D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),tt.parent===null&&tt.matrixWorldAutoUpdate===!0&&tt.updateMatrixWorld(),gt.enabled===!0&&gt.isPresenting===!0&&(gt.cameraAutoUpdate===!0&&gt.updateCamera(tt),tt=gt.getCamera()),D.isScene===!0&&D.onBeforeRender(N,D,tt,F),y=pe.get(D,z.length),y.init(tt),z.push(y),wt.multiplyMatrices(tt.projectionMatrix,tt.matrixWorldInverse),U.setFromProjectionMatrix(wt),vt=this.localClippingEnabled,Q=Tt.init(this.clippingPlanes,vt),S=It.get(D,P.length),S.init(),P.push(S),gt.enabled===!0&&gt.isPresenting===!0){const Mt=N.xr.getDepthSensingMesh();Mt!==null&&No(Mt,tt,-1/0,N.sortObjects)}No(D,tt,0,N.sortObjects),S.finish(),N.sortObjects===!0&&S.sort(_t,mt),zt=gt.enabled===!1||gt.isPresenting===!1||gt.hasDepthSensing()===!1,zt&&ne.addToRenderList(S,D),this.info.render.frame++,Q===!0&&Tt.beginShadows();const ht=y.state.shadowsArray;Xt.render(ht,D,tt),Q===!0&&Tt.endShadows(),this.info.autoReset===!0&&this.info.reset();const pt=S.opaque,at=S.transmissive;if(y.setupLights(),tt.isArrayCamera){const Mt=tt.cameras;if(at.length>0)for(let Ut=0,Dt=Mt.length;Ut<Dt;Ut++){const Bt=Mt[Ut];Rr(pt,at,D,Bt)}zt&&ne.render(D);for(let Ut=0,Dt=Mt.length;Ut<Dt;Ut++){const Bt=Mt[Ut];Ar(S,D,Bt,Bt.viewport)}}else at.length>0&&Rr(pt,at,D,tt),zt&&ne.render(D),Ar(S,D,tt);F!==null&&B===0&&(O.updateMultisampleRenderTarget(F),O.updateRenderTargetMipmap(F)),D.isScene===!0&&D.onAfterRender(N,D,tt),He.resetDefaultState(),R=-1,E=null,z.pop(),z.length>0?(y=z[z.length-1],Q===!0&&Tt.setGlobalState(N.clippingPlanes,y.state.camera)):y=null,P.pop(),P.length>0?S=P[P.length-1]:S=null};function No(D,tt,ht,pt){if(D.visible===!1)return;if(D.layers.test(tt.layers)){if(D.isGroup)ht=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(tt);else if(D.isLight)y.pushLight(D),D.castShadow&&y.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||U.intersectsSprite(D)){pt&&Et.setFromMatrixPosition(D.matrixWorld).applyMatrix4(wt);const Ut=ct.update(D),Dt=D.material;Dt.visible&&S.push(D,Ut,Dt,ht,Et.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||U.intersectsObject(D))){const Ut=ct.update(D),Dt=D.material;if(pt&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),Et.copy(D.boundingSphere.center)):(Ut.boundingSphere===null&&Ut.computeBoundingSphere(),Et.copy(Ut.boundingSphere.center)),Et.applyMatrix4(D.matrixWorld).applyMatrix4(wt)),Array.isArray(Dt)){const Bt=Ut.groups;for(let ee=0,oe=Bt.length;ee<oe;ee++){const $t=Bt[ee],Ae=Dt[$t.materialIndex];Ae&&Ae.visible&&S.push(D,Ut,Ae,ht,Et.z,$t)}}else Dt.visible&&S.push(D,Ut,Dt,ht,Et.z,null)}}const Mt=D.children;for(let Ut=0,Dt=Mt.length;Ut<Dt;Ut++)No(Mt[Ut],tt,ht,pt)}function Ar(D,tt,ht,pt){const at=D.opaque,Mt=D.transmissive,Ut=D.transparent;y.setupLightsView(ht),Q===!0&&Tt.setGlobalState(N.clippingPlanes,ht),pt&&Nt.viewport(L.copy(pt)),at.length>0&&ua(at,tt,ht),Mt.length>0&&ua(Mt,tt,ht),Ut.length>0&&ua(Ut,tt,ht),Nt.buffers.depth.setTest(!0),Nt.buffers.depth.setMask(!0),Nt.buffers.color.setMask(!0),Nt.setPolygonOffset(!1)}function Rr(D,tt,ht,pt){if((ht.isScene===!0?ht.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[pt.id]===void 0&&(y.state.transmissionRenderTarget[pt.id]=new hs(1,1,{generateMipmaps:!0,type:re.has("EXT_color_buffer_half_float")||re.has("EXT_color_buffer_float")?Fl:Ba,minFilter:us,samples:4,stencilBuffer:u,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ue.workingColorSpace}));const Mt=y.state.transmissionRenderTarget[pt.id],Ut=pt.viewport||L;Mt.setSize(Ut.z*N.transmissionResolutionScale,Ut.w*N.transmissionResolutionScale);const Dt=N.getRenderTarget();N.setRenderTarget(Mt),N.getClearColor(ft),st=N.getClearAlpha(),st<1&&N.setClearColor(16777215,.5),N.clear(),zt&&ne.render(ht);const Bt=N.toneMapping;N.toneMapping=br;const ee=pt.viewport;if(pt.viewport!==void 0&&(pt.viewport=void 0),y.setupLightsView(pt),Q===!0&&Tt.setGlobalState(N.clippingPlanes,pt),ua(D,ht,pt),O.updateMultisampleRenderTarget(Mt),O.updateRenderTargetMipmap(Mt),re.has("WEBGL_multisampled_render_to_texture")===!1){let oe=!1;for(let $t=0,Ae=tt.length;$t<Ae;$t++){const Ce=tt[$t],qe=Ce.object,Ve=Ce.geometry,ye=Ce.material,Zt=Ce.group;if(ye.side===ra&&qe.layers.test(pt.layers)){const $e=ye.side;ye.side=ni,ye.needsUpdate=!0,Xi(qe,ht,pt,Ve,ye,Zt),ye.side=$e,ye.needsUpdate=!0,oe=!0}}oe===!0&&(O.updateMultisampleRenderTarget(Mt),O.updateRenderTargetMipmap(Mt))}N.setRenderTarget(Dt),N.setClearColor(ft,st),ee!==void 0&&(pt.viewport=ee),N.toneMapping=Bt}function ua(D,tt,ht){const pt=tt.isScene===!0?tt.overrideMaterial:null;for(let at=0,Mt=D.length;at<Mt;at++){const Ut=D[at],Dt=Ut.object,Bt=Ut.geometry,ee=pt===null?Ut.material:pt,oe=Ut.group;Dt.layers.test(ht.layers)&&Xi(Dt,tt,ht,Bt,ee,oe)}}function Xi(D,tt,ht,pt,at,Mt){D.onBeforeRender(N,tt,ht,pt,at,Mt),D.modelViewMatrix.multiplyMatrices(ht.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),at.onBeforeRender(N,tt,ht,pt,D,Mt),at.transparent===!0&&at.side===ra&&at.forceSinglePass===!1?(at.side=ni,at.needsUpdate=!0,N.renderBufferDirect(ht,tt,pt,at,D,Mt),at.side=Tr,at.needsUpdate=!0,N.renderBufferDirect(ht,tt,pt,at,D,Mt),at.side=ra):N.renderBufferDirect(ht,tt,pt,at,D,Mt),D.onAfterRender(N,tt,ht,pt,at,Mt)}function fa(D,tt,ht){tt.isScene!==!0&&(tt=bt);const pt=Yt.get(D),at=y.state.lights,Mt=y.state.shadowsArray,Ut=at.state.version,Dt=Ot.getParameters(D,at.state,Mt,tt,ht),Bt=Ot.getProgramCacheKey(Dt);let ee=pt.programs;pt.environment=D.isMeshStandardMaterial?tt.environment:null,pt.fog=tt.fog,pt.envMap=(D.isMeshStandardMaterial?lt:A).get(D.envMap||pt.environment),pt.envMapRotation=pt.environment!==null&&D.envMap===null?tt.environmentRotation:D.envMapRotation,ee===void 0&&(D.addEventListener("dispose",ce),ee=new Map,pt.programs=ee);let oe=ee.get(Bt);if(oe!==void 0){if(pt.currentProgram===oe&&pt.lightsStateVersion===Ut)return Uo(D,Dt),oe}else Dt.uniforms=Ot.getUniforms(D),D.onBeforeCompile(Dt,N),oe=Ot.acquireProgram(Dt,Bt),ee.set(Bt,oe),pt.uniforms=Dt.uniforms;const $t=pt.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&($t.clippingPlanes=Tt.uniform),Uo(D,Dt),pt.needsLights=zo(D),pt.lightsStateVersion=Ut,pt.needsLights&&($t.ambientLightColor.value=at.state.ambient,$t.lightProbe.value=at.state.probe,$t.directionalLights.value=at.state.directional,$t.directionalLightShadows.value=at.state.directionalShadow,$t.spotLights.value=at.state.spot,$t.spotLightShadows.value=at.state.spotShadow,$t.rectAreaLights.value=at.state.rectArea,$t.ltc_1.value=at.state.rectAreaLTC1,$t.ltc_2.value=at.state.rectAreaLTC2,$t.pointLights.value=at.state.point,$t.pointLightShadows.value=at.state.pointShadow,$t.hemisphereLights.value=at.state.hemi,$t.directionalShadowMap.value=at.state.directionalShadowMap,$t.directionalShadowMatrix.value=at.state.directionalShadowMatrix,$t.spotShadowMap.value=at.state.spotShadowMap,$t.spotLightMatrix.value=at.state.spotLightMatrix,$t.spotLightMap.value=at.state.spotLightMap,$t.pointShadowMap.value=at.state.pointShadowMap,$t.pointShadowMatrix.value=at.state.pointShadowMatrix),pt.currentProgram=oe,pt.uniformsList=null,oe}function Ha(D){if(D.uniformsList===null){const tt=D.currentProgram.getUniforms();D.uniformsList=qu.seqWithValue(tt.seq,D.uniforms)}return D.uniformsList}function Uo(D,tt){const ht=Yt.get(D);ht.outputColorSpace=tt.outputColorSpace,ht.batching=tt.batching,ht.batchingColor=tt.batchingColor,ht.instancing=tt.instancing,ht.instancingColor=tt.instancingColor,ht.instancingMorph=tt.instancingMorph,ht.skinning=tt.skinning,ht.morphTargets=tt.morphTargets,ht.morphNormals=tt.morphNormals,ht.morphColors=tt.morphColors,ht.morphTargetsCount=tt.morphTargetsCount,ht.numClippingPlanes=tt.numClippingPlanes,ht.numIntersection=tt.numClipIntersection,ht.vertexAlphas=tt.vertexAlphas,ht.vertexTangents=tt.vertexTangents,ht.toneMapping=tt.toneMapping}function sf(D,tt,ht,pt,at){tt.isScene!==!0&&(tt=bt),O.resetTextureUnits();const Mt=tt.fog,Ut=pt.isMeshStandardMaterial?tt.environment:null,Dt=F===null?N.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:wo,Bt=(pt.isMeshStandardMaterial?lt:A).get(pt.envMap||Ut),ee=pt.vertexColors===!0&&!!ht.attributes.color&&ht.attributes.color.itemSize===4,oe=!!ht.attributes.tangent&&(!!pt.normalMap||pt.anisotropy>0),$t=!!ht.morphAttributes.position,Ae=!!ht.morphAttributes.normal,Ce=!!ht.morphAttributes.color;let qe=br;pt.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(qe=N.toneMapping);const Ve=ht.morphAttributes.position||ht.morphAttributes.normal||ht.morphAttributes.color,ye=Ve!==void 0?Ve.length:0,Zt=Yt.get(pt),$e=y.state.lights;if(Q===!0&&(vt===!0||D!==E)){const Tn=D===E&&pt.id===R;Tt.setState(pt,D,Tn)}let Ee=!1;pt.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==$e.state.version||Zt.outputColorSpace!==Dt||at.isBatchedMesh&&Zt.batching===!1||!at.isBatchedMesh&&Zt.batching===!0||at.isBatchedMesh&&Zt.batchingColor===!0&&at.colorTexture===null||at.isBatchedMesh&&Zt.batchingColor===!1&&at.colorTexture!==null||at.isInstancedMesh&&Zt.instancing===!1||!at.isInstancedMesh&&Zt.instancing===!0||at.isSkinnedMesh&&Zt.skinning===!1||!at.isSkinnedMesh&&Zt.skinning===!0||at.isInstancedMesh&&Zt.instancingColor===!0&&at.instanceColor===null||at.isInstancedMesh&&Zt.instancingColor===!1&&at.instanceColor!==null||at.isInstancedMesh&&Zt.instancingMorph===!0&&at.morphTexture===null||at.isInstancedMesh&&Zt.instancingMorph===!1&&at.morphTexture!==null||Zt.envMap!==Bt||pt.fog===!0&&Zt.fog!==Mt||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==Tt.numPlanes||Zt.numIntersection!==Tt.numIntersection)||Zt.vertexAlphas!==ee||Zt.vertexTangents!==oe||Zt.morphTargets!==$t||Zt.morphNormals!==Ae||Zt.morphColors!==Ce||Zt.toneMapping!==qe||Zt.morphTargetsCount!==ye)&&(Ee=!0):(Ee=!0,Zt.__version=pt.version);let xn=Zt.currentProgram;Ee===!0&&(xn=fa(pt,tt,at));let Qe=!1,In=!1,ka=!1;const je=xn.getUniforms(),ln=Zt.uniforms;if(Nt.useProgram(xn.program)&&(Qe=!0,In=!0,ka=!0),pt.id!==R&&(R=pt.id,In=!0),Qe||E!==D){Nt.buffers.depth.getReversed()?(dt.copy(D.projectionMatrix),gT(dt),vT(dt),je.setValue(G,"projectionMatrix",dt)):je.setValue(G,"projectionMatrix",D.projectionMatrix),je.setValue(G,"viewMatrix",D.matrixWorldInverse);const wn=je.map.cameraPosition;wn!==void 0&&wn.setValue(G,kt.setFromMatrixPosition(D.matrixWorld)),Jt.logarithmicDepthBuffer&&je.setValue(G,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(pt.isMeshPhongMaterial||pt.isMeshToonMaterial||pt.isMeshLambertMaterial||pt.isMeshBasicMaterial||pt.isMeshStandardMaterial||pt.isShaderMaterial)&&je.setValue(G,"isOrthographic",D.isOrthographicCamera===!0),E!==D&&(E=D,In=!0,ka=!0)}if(at.isSkinnedMesh){je.setOptional(G,at,"bindMatrix"),je.setOptional(G,at,"bindMatrixInverse");const Tn=at.skeleton;Tn&&(Tn.boneTexture===null&&Tn.computeBoneTexture(),je.setValue(G,"boneTexture",Tn.boneTexture,O))}at.isBatchedMesh&&(je.setOptional(G,at,"batchingTexture"),je.setValue(G,"batchingTexture",at._matricesTexture,O),je.setOptional(G,at,"batchingIdTexture"),je.setValue(G,"batchingIdTexture",at._indirectTexture,O),je.setOptional(G,at,"batchingColorTexture"),at._colorsTexture!==null&&je.setValue(G,"batchingColorTexture",at._colorsTexture,O));const pn=ht.morphAttributes;if((pn.position!==void 0||pn.normal!==void 0||pn.color!==void 0)&&se.update(at,ht,xn),(In||Zt.receiveShadow!==at.receiveShadow)&&(Zt.receiveShadow=at.receiveShadow,je.setValue(G,"receiveShadow",at.receiveShadow)),pt.isMeshGouraudMaterial&&pt.envMap!==null&&(ln.envMap.value=Bt,ln.flipEnvMap.value=Bt.isCubeTexture&&Bt.isRenderTargetTexture===!1?-1:1),pt.isMeshStandardMaterial&&pt.envMap===null&&tt.environment!==null&&(ln.envMapIntensity.value=tt.environmentIntensity),In&&(je.setValue(G,"toneMappingExposure",N.toneMappingExposure),Zt.needsLights&&jl(ln,ka),Mt&&pt.fog===!0&&Ct.refreshFogUniforms(ln,Mt),Ct.refreshMaterialUniforms(ln,pt,q,Y,y.state.transmissionRenderTarget[D.id]),qu.upload(G,Ha(Zt),ln,O)),pt.isShaderMaterial&&pt.uniformsNeedUpdate===!0&&(qu.upload(G,Ha(Zt),ln,O),pt.uniformsNeedUpdate=!1),pt.isSpriteMaterial&&je.setValue(G,"center",at.center),je.setValue(G,"modelViewMatrix",at.modelViewMatrix),je.setValue(G,"normalMatrix",at.normalMatrix),je.setValue(G,"modelMatrix",at.matrixWorld),pt.isShaderMaterial||pt.isRawShaderMaterial){const Tn=pt.uniformsGroups;for(let wn=0,ps=Tn.length;wn<ps;wn++){const da=Tn[wn];W.update(da,xn),W.bind(da,xn)}}return xn}function jl(D,tt){D.ambientLightColor.needsUpdate=tt,D.lightProbe.needsUpdate=tt,D.directionalLights.needsUpdate=tt,D.directionalLightShadows.needsUpdate=tt,D.pointLights.needsUpdate=tt,D.pointLightShadows.needsUpdate=tt,D.spotLights.needsUpdate=tt,D.spotLightShadows.needsUpdate=tt,D.rectAreaLights.needsUpdate=tt,D.hemisphereLights.needsUpdate=tt}function zo(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(D,tt,ht){Yt.get(D.texture).__webglTexture=tt,Yt.get(D.depthTexture).__webglTexture=ht;const pt=Yt.get(D);pt.__hasExternalTextures=!0,pt.__autoAllocateDepthBuffer=ht===void 0,pt.__autoAllocateDepthBuffer||re.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),pt.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(D,tt){const ht=Yt.get(D);ht.__webglFramebuffer=tt,ht.__useDefaultFramebuffer=tt===void 0};const Cr=G.createFramebuffer();this.setRenderTarget=function(D,tt=0,ht=0){F=D,H=tt,B=ht;let pt=!0,at=null,Mt=!1,Ut=!1;if(D){const Bt=Yt.get(D);if(Bt.__useDefaultFramebuffer!==void 0)Nt.bindFramebuffer(G.FRAMEBUFFER,null),pt=!1;else if(Bt.__webglFramebuffer===void 0)O.setupRenderTarget(D);else if(Bt.__hasExternalTextures)O.rebindTextures(D,Yt.get(D.texture).__webglTexture,Yt.get(D.depthTexture).__webglTexture);else if(D.depthBuffer){const $t=D.depthTexture;if(Bt.__boundDepthTexture!==$t){if($t!==null&&Yt.has($t)&&(D.width!==$t.image.width||D.height!==$t.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");O.setupDepthRenderbuffer(D)}}const ee=D.texture;(ee.isData3DTexture||ee.isDataArrayTexture||ee.isCompressedArrayTexture)&&(Ut=!0);const oe=Yt.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(oe[tt])?at=oe[tt][ht]:at=oe[tt],Mt=!0):D.samples>0&&O.useMultisampledRTT(D)===!1?at=Yt.get(D).__webglMultisampledFramebuffer:Array.isArray(oe)?at=oe[ht]:at=oe,L.copy(D.viewport),et.copy(D.scissor),K=D.scissorTest}else L.copy(At).multiplyScalar(q).floor(),et.copy(Wt).multiplyScalar(q).floor(),K=Kt;if(ht!==0&&(at=Cr),Nt.bindFramebuffer(G.FRAMEBUFFER,at)&&pt&&Nt.drawBuffers(D,at),Nt.viewport(L),Nt.scissor(et),Nt.setScissorTest(K),Mt){const Bt=Yt.get(D.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Bt.__webglTexture,ht)}else if(Ut){const Bt=Yt.get(D.texture),ee=tt;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Bt.__webglTexture,ht,ee)}else if(D!==null&&ht!==0){const Bt=Yt.get(D.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Bt.__webglTexture,ht)}R=-1},this.readRenderTargetPixels=function(D,tt,ht,pt,at,Mt,Ut){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=Yt.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Ut!==void 0&&(Dt=Dt[Ut]),Dt){Nt.bindFramebuffer(G.FRAMEBUFFER,Dt);try{const Bt=D.texture,ee=Bt.format,oe=Bt.type;if(!Jt.textureFormatReadable(ee)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Jt.textureTypeReadable(oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}tt>=0&&tt<=D.width-pt&&ht>=0&&ht<=D.height-at&&G.readPixels(tt,ht,pt,at,ue.convert(ee),ue.convert(oe),Mt)}finally{const Bt=F!==null?Yt.get(F).__webglFramebuffer:null;Nt.bindFramebuffer(G.FRAMEBUFFER,Bt)}}},this.readRenderTargetPixelsAsync=async function(D,tt,ht,pt,at,Mt,Ut){if(!(D&&D.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=Yt.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Ut!==void 0&&(Dt=Dt[Ut]),Dt){const Bt=D.texture,ee=Bt.format,oe=Bt.type;if(!Jt.textureFormatReadable(ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Jt.textureTypeReadable(oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(tt>=0&&tt<=D.width-pt&&ht>=0&&ht<=D.height-at){Nt.bindFramebuffer(G.FRAMEBUFFER,Dt);const $t=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,$t),G.bufferData(G.PIXEL_PACK_BUFFER,Mt.byteLength,G.STREAM_READ),G.readPixels(tt,ht,pt,at,ue.convert(ee),ue.convert(oe),0);const Ae=F!==null?Yt.get(F).__webglFramebuffer:null;Nt.bindFramebuffer(G.FRAMEBUFFER,Ae);const Ce=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await mT(G,Ce,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,$t),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,Mt),G.deleteBuffer($t),G.deleteSync(Ce),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(D,tt=null,ht=0){D.isTexture!==!0&&(as("WebGLRenderer: copyFramebufferToTexture function signature has changed."),tt=arguments[0]||null,D=arguments[1]);const pt=Math.pow(2,-ht),at=Math.floor(D.image.width*pt),Mt=Math.floor(D.image.height*pt),Ut=tt!==null?tt.x:0,Dt=tt!==null?tt.y:0;O.setTexture2D(D,0),G.copyTexSubImage2D(G.TEXTURE_2D,ht,0,0,Ut,Dt,at,Mt),Nt.unbindTexture()};const of=G.createFramebuffer(),Xl=G.createFramebuffer();this.copyTextureToTexture=function(D,tt,ht=null,pt=null,at=0,Mt=null){D.isTexture!==!0&&(as("WebGLRenderer: copyTextureToTexture function signature has changed."),pt=arguments[0]||null,D=arguments[1],tt=arguments[2],Mt=arguments[3]||0,ht=null),Mt===null&&(at!==0?(as("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Mt=at,at=0):Mt=0);let Ut,Dt,Bt,ee,oe,$t,Ae,Ce,qe;const Ve=D.isCompressedTexture?D.mipmaps[Mt]:D.image;if(ht!==null)Ut=ht.max.x-ht.min.x,Dt=ht.max.y-ht.min.y,Bt=ht.isBox3?ht.max.z-ht.min.z:1,ee=ht.min.x,oe=ht.min.y,$t=ht.isBox3?ht.min.z:0;else{const pn=Math.pow(2,-at);Ut=Math.floor(Ve.width*pn),Dt=Math.floor(Ve.height*pn),D.isDataArrayTexture?Bt=Ve.depth:D.isData3DTexture?Bt=Math.floor(Ve.depth*pn):Bt=1,ee=0,oe=0,$t=0}pt!==null?(Ae=pt.x,Ce=pt.y,qe=pt.z):(Ae=0,Ce=0,qe=0);const ye=ue.convert(tt.format),Zt=ue.convert(tt.type);let $e;tt.isData3DTexture?(O.setTexture3D(tt,0),$e=G.TEXTURE_3D):tt.isDataArrayTexture||tt.isCompressedArrayTexture?(O.setTexture2DArray(tt,0),$e=G.TEXTURE_2D_ARRAY):(O.setTexture2D(tt,0),$e=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,tt.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,tt.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,tt.unpackAlignment);const Ee=G.getParameter(G.UNPACK_ROW_LENGTH),xn=G.getParameter(G.UNPACK_IMAGE_HEIGHT),Qe=G.getParameter(G.UNPACK_SKIP_PIXELS),In=G.getParameter(G.UNPACK_SKIP_ROWS),ka=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,Ve.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Ve.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,ee),G.pixelStorei(G.UNPACK_SKIP_ROWS,oe),G.pixelStorei(G.UNPACK_SKIP_IMAGES,$t);const je=D.isDataArrayTexture||D.isData3DTexture,ln=tt.isDataArrayTexture||tt.isData3DTexture;if(D.isDepthTexture){const pn=Yt.get(D),Tn=Yt.get(tt),wn=Yt.get(pn.__renderTarget),ps=Yt.get(Tn.__renderTarget);Nt.bindFramebuffer(G.READ_FRAMEBUFFER,wn.__webglFramebuffer),Nt.bindFramebuffer(G.DRAW_FRAMEBUFFER,ps.__webglFramebuffer);for(let da=0;da<Bt;da++)je&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Yt.get(D).__webglTexture,at,$t+da),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Yt.get(tt).__webglTexture,Mt,qe+da)),G.blitFramebuffer(ee,oe,Ut,Dt,Ae,Ce,Ut,Dt,G.DEPTH_BUFFER_BIT,G.NEAREST);Nt.bindFramebuffer(G.READ_FRAMEBUFFER,null),Nt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(at!==0||D.isRenderTargetTexture||Yt.has(D)){const pn=Yt.get(D),Tn=Yt.get(tt);Nt.bindFramebuffer(G.READ_FRAMEBUFFER,of),Nt.bindFramebuffer(G.DRAW_FRAMEBUFFER,Xl);for(let wn=0;wn<Bt;wn++)je?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,pn.__webglTexture,at,$t+wn):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,pn.__webglTexture,at),ln?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Tn.__webglTexture,Mt,qe+wn):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Tn.__webglTexture,Mt),at!==0?G.blitFramebuffer(ee,oe,Ut,Dt,Ae,Ce,Ut,Dt,G.COLOR_BUFFER_BIT,G.NEAREST):ln?G.copyTexSubImage3D($e,Mt,Ae,Ce,qe+wn,ee,oe,Ut,Dt):G.copyTexSubImage2D($e,Mt,Ae,Ce,ee,oe,Ut,Dt);Nt.bindFramebuffer(G.READ_FRAMEBUFFER,null),Nt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else ln?D.isDataTexture||D.isData3DTexture?G.texSubImage3D($e,Mt,Ae,Ce,qe,Ut,Dt,Bt,ye,Zt,Ve.data):tt.isCompressedArrayTexture?G.compressedTexSubImage3D($e,Mt,Ae,Ce,qe,Ut,Dt,Bt,ye,Ve.data):G.texSubImage3D($e,Mt,Ae,Ce,qe,Ut,Dt,Bt,ye,Zt,Ve):D.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,Mt,Ae,Ce,Ut,Dt,ye,Zt,Ve.data):D.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,Mt,Ae,Ce,Ve.width,Ve.height,ye,Ve.data):G.texSubImage2D(G.TEXTURE_2D,Mt,Ae,Ce,Ut,Dt,ye,Zt,Ve);G.pixelStorei(G.UNPACK_ROW_LENGTH,Ee),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,xn),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Qe),G.pixelStorei(G.UNPACK_SKIP_ROWS,In),G.pixelStorei(G.UNPACK_SKIP_IMAGES,ka),Mt===0&&tt.generateMipmaps&&G.generateMipmap($e),Nt.unbindTexture()},this.copyTextureToTexture3D=function(D,tt,ht=null,pt=null,at=0){return D.isTexture!==!0&&(as("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ht=arguments[0]||null,pt=arguments[1]||null,D=arguments[2],tt=arguments[3],at=arguments[4]||0),as('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(D,tt,ht,pt,at)},this.initRenderTarget=function(D){Yt.get(D).__webglFramebuffer===void 0&&O.setupRenderTarget(D)},this.initTexture=function(D){D.isCubeTexture?O.setTextureCube(D,0):D.isData3DTexture?O.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?O.setTexture2DArray(D,0):O.setTexture2D(D,0),Nt.unbindTexture()},this.resetState=function(){H=0,B=0,F=null,Nt.reset(),He.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return La}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorspace=Ue._getDrawingBufferColorSpace(e),i.unpackColorSpace=Ue._getUnpackColorSpace()}}const Qy=new wr,Pu=new it;class qx extends KT{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],i=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],r=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(r),this.setAttribute("position",new Pn(e,3)),this.setAttribute("uv",new Pn(i,2))}applyMatrix4(e){const i=this.attributes.instanceStart,r=this.attributes.instanceEnd;return i!==void 0&&(i.applyMatrix4(e),r.applyMatrix4(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const r=new lm(i,6,1);return this.setAttribute("instanceStart",new Mr(r,3,0)),this.setAttribute("instanceEnd",new Mr(r,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const r=new lm(i,6,1);return this.setAttribute("instanceColorStart",new Mr(r,3,0)),this.setAttribute("instanceColorEnd",new Mr(r,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new qT(e.geometry)),this}fromLineSegments(e){const i=e.geometry;return this.setPositions(i.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wr);const e=this.attributes.instanceStart,i=this.attributes.instanceEnd;e!==void 0&&i!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Qy.setFromBufferAttribute(i),this.boundingBox.union(Qy))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Co),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,i=this.attributes.instanceEnd;if(e!==void 0&&i!==void 0){const r=this.boundingSphere.center;this.boundingBox.getCenter(r);let l=0;for(let u=0,h=e.count;u<h;u++)Pu.fromBufferAttribute(e,u),l=Math.max(l,r.distanceToSquared(Pu)),Pu.fromBufferAttribute(i,u),l=Math.max(l,r.distanceToSquared(Pu));this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}Pt.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Oe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};ei.line={uniforms:Sm.merge([Pt.common,Pt.fog,Pt.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class wm extends Fa{constructor(e){super({type:"LineMaterial",uniforms:Sm.clone(ei.line.uniforms),vertexShader:ei.line.vertexShader,fragmentShader:ei.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const mp=new Ze,Jy=new it,$y=new it,zn=new Ze,Ln=new Ze,ia=new Ze,gp=new it,vp=new nn,On=new JT,tx=new it,Bu=new wr,Iu=new Co,aa=new Ze;let sa,fs;function ex(o,e,i){return aa.set(0,0,-e,1).applyMatrix4(o.projectionMatrix),aa.multiplyScalar(1/aa.w),aa.x=fs/i.width,aa.y=fs/i.height,aa.applyMatrix4(o.projectionMatrixInverse),aa.multiplyScalar(1/aa.w),Math.abs(Math.max(aa.x,aa.y))}function BR(o,e){const i=o.matrixWorld,r=o.geometry,l=r.attributes.instanceStart,u=r.attributes.instanceEnd,h=Math.min(r.instanceCount,l.count);for(let d=0,p=h;d<p;d++){On.start.fromBufferAttribute(l,d),On.end.fromBufferAttribute(u,d),On.applyMatrix4(i);const g=new it,v=new it;sa.distanceSqToSegment(On.start,On.end,v,g),v.distanceTo(g)<fs*.5&&e.push({point:v,pointOnLine:g,distance:sa.origin.distanceTo(v),object:o,face:null,faceIndex:d,uv:null,uv1:null})}}function IR(o,e,i){const r=e.projectionMatrix,u=o.material.resolution,h=o.matrixWorld,d=o.geometry,p=d.attributes.instanceStart,g=d.attributes.instanceEnd,v=Math.min(d.instanceCount,p.count),m=-e.near;sa.at(1,ia),ia.w=1,ia.applyMatrix4(e.matrixWorldInverse),ia.applyMatrix4(r),ia.multiplyScalar(1/ia.w),ia.x*=u.x/2,ia.y*=u.y/2,ia.z=0,gp.copy(ia),vp.multiplyMatrices(e.matrixWorldInverse,h);for(let x=0,M=v;x<M;x++){if(zn.fromBufferAttribute(p,x),Ln.fromBufferAttribute(g,x),zn.w=1,Ln.w=1,zn.applyMatrix4(vp),Ln.applyMatrix4(vp),zn.z>m&&Ln.z>m)continue;if(zn.z>m){const z=zn.z-Ln.z,N=(zn.z-m)/z;zn.lerp(Ln,N)}else if(Ln.z>m){const z=Ln.z-zn.z,N=(Ln.z-m)/z;Ln.lerp(zn,N)}zn.applyMatrix4(r),Ln.applyMatrix4(r),zn.multiplyScalar(1/zn.w),Ln.multiplyScalar(1/Ln.w),zn.x*=u.x/2,zn.y*=u.y/2,Ln.x*=u.x/2,Ln.y*=u.y/2,On.start.copy(zn),On.start.z=0,On.end.copy(Ln),On.end.z=0;const w=On.closestPointToPointParameter(gp,!0);On.at(w,tx);const S=hT.lerp(zn.z,Ln.z,w),y=S>=-1&&S<=1,P=gp.distanceTo(tx)<fs*.5;if(y&&P){On.start.fromBufferAttribute(p,x),On.end.fromBufferAttribute(g,x),On.start.applyMatrix4(h),On.end.applyMatrix4(h);const z=new it,N=new it;sa.distanceSqToSegment(On.start,On.end,N,z),i.push({point:N,pointOnLine:z,distance:sa.origin.distanceTo(N),object:o,face:null,faceIndex:x,uv:null,uv1:null})}}}class FR extends Ci{constructor(e=new qx,i=new wm({color:Math.random()*16777215})){super(e,i),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,i=e.attributes.instanceStart,r=e.attributes.instanceEnd,l=new Float32Array(2*i.count);for(let h=0,d=0,p=i.count;h<p;h++,d+=2)Jy.fromBufferAttribute(i,h),$y.fromBufferAttribute(r,h),l[d]=d===0?0:l[d-1],l[d+1]=l[d]+Jy.distanceTo($y);const u=new lm(l,2,1);return e.setAttribute("instanceDistanceStart",new Mr(u,1,0)),e.setAttribute("instanceDistanceEnd",new Mr(u,1,1)),this}raycast(e,i){const r=this.material.worldUnits,l=e.camera;l===null&&!r&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const u=e.params.Line2!==void 0&&e.params.Line2.threshold||0;sa=e.ray;const h=this.matrixWorld,d=this.geometry,p=this.material;fs=p.linewidth+u,d.boundingSphere===null&&d.computeBoundingSphere(),Iu.copy(d.boundingSphere).applyMatrix4(h);let g;if(r)g=fs*.5;else{const m=Math.max(l.near,Iu.distanceToPoint(sa.origin));g=ex(l,m,p.resolution)}if(Iu.radius+=g,sa.intersectsSphere(Iu)===!1)return;d.boundingBox===null&&d.computeBoundingBox(),Bu.copy(d.boundingBox).applyMatrix4(h);let v;if(r)v=fs*.5;else{const m=Math.max(l.near,Bu.distanceToPoint(sa.origin));v=ex(l,m,p.resolution)}Bu.expandByScalar(v),sa.intersectsBox(Bu)!==!1&&(r?BR(this,i):IR(this,l,i))}onBeforeRender(e){const i=this.material.uniforms;i&&i.resolution&&(e.getViewport(mp),this.material.uniforms.resolution.value.set(mp.z,mp.w))}}class Wx extends qx{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const i=e.length-3,r=new Float32Array(2*i);for(let l=0;l<i;l+=3)r[2*l]=e[l],r[2*l+1]=e[l+1],r[2*l+2]=e[l+2],r[2*l+3]=e[l+3],r[2*l+4]=e[l+4],r[2*l+5]=e[l+5];return super.setPositions(r),this}setColors(e){const i=e.length-3,r=new Float32Array(2*i);for(let l=0;l<i;l+=3)r[2*l]=e[l],r[2*l+1]=e[l+1],r[2*l+2]=e[l+2],r[2*l+3]=e[l+3],r[2*l+4]=e[l+4],r[2*l+5]=e[l+5];return super.setColors(r),this}setFromPoints(e){const i=e.length-1,r=new Float32Array(6*i);for(let l=0;l<i;l++)r[6*l]=e[l].x,r[6*l+1]=e[l].y,r[6*l+2]=e[l].z||0,r[6*l+3]=e[l+1].x,r[6*l+4]=e[l+1].y,r[6*l+5]=e[l+1].z||0;return super.setPositions(r),this}fromLine(e){const i=e.geometry;return this.setPositions(i.attributes.position.array),this}}class HR extends FR{constructor(e=new Wx,i=new wm({color:Math.random()*16777215})){super(e,i),this.isLine2=!0,this.type="Line2"}}const nx=()=>({target:new it(0,0,20),radius:320,theta:-Math.PI/4,phi:Math.PI/3}),Yx=Rt.forwardRef(({segments:o,turtle:e,isDark:i},r)=>{const l=Rt.useRef(null),[u,h]=Rt.useState(null),[d,p]=Rt.useState(!0),g=Rt.useRef(nx()),v=Rt.useRef(null),m=Rt.useRef(null),x=Rt.useRef(null),M=Rt.useRef(null),T=Rt.useRef(null),w=Rt.useRef(null),S=Rt.useRef([]),y=Rt.useRef({active:!1,mode:"orbit",lastX:0,lastY:0}),P=Rt.useCallback(()=>{const E=m.current,L=x.current,et=v.current;if(!E||!L||!et)return;const{target:K,radius:ft,theta:st,phi:k}=g.current,Y=Math.max(.05,Math.min(Math.PI-.05,k)),q=Math.sin(Y),_t=K.x+ft*q*Math.cos(st),mt=K.y+ft*q*Math.sin(st),At=K.z+ft*Math.cos(Y);E.position.set(_t,mt,At),E.up.set(0,0,1),E.lookAt(K),E.updateMatrixWorld(),L.render(et,E)},[]),z=Rt.useCallback(()=>{let E=e.pos[0],L=e.pos[0],et=e.pos[1],K=e.pos[1],ft=e.pos[2],st=e.pos[2];if(o.length===0)E=-100,L=100,et=-100,K=100,ft=-20,st=100;else for(const Kt of o)E=Math.min(E,Kt.from[0],Kt.to[0]),L=Math.max(L,Kt.from[0],Kt.to[0]),et=Math.min(et,Kt.from[1],Kt.to[1]),K=Math.max(K,Kt.from[1],Kt.to[1]),ft=Math.min(ft,Kt.from[2],Kt.to[2]),st=Math.max(st,Kt.from[2],Kt.to[2]);const k=(E+L)/2,Y=(et+K)/2,q=(ft+st)/2,_t=Math.max(40,Math.hypot(L-E,K-et,st-ft)),mt=m.current,At=((mt==null?void 0:mt.fov)??45)*Math.PI/180,Wt=_t/2/Math.tan(At/2)*1.35;g.current={...g.current,target:new it(k,Y,q),radius:Math.max(40,Math.min(2e5,Wt))},P()},[o,e.pos,P]),N=Rt.useCallback(()=>{g.current=nx(),P()},[P]),X=Rt.useCallback(()=>{const E=x.current,L=v.current,et=m.current;if(!E||!L||!et)return;E.render(L,et);const K=E.domElement.toDataURL("image/png"),ft=document.createElement("a");ft.href=K,ft.download="logomocja-3d.png",document.body.appendChild(ft),ft.click(),document.body.removeChild(ft)},[]);Rt.useImperativeHandle(r,()=>({fitToDrawing:z,resetView:N,exportPng:X}),[z,N,X]),Rt.useEffect(()=>{const E=l.current;if(!E)return;let L;try{L=new PR({antialias:!0,preserveDrawingBuffer:!0})}catch{h("Widok 3D wymaga obsługi WebGL, która jest niedostępna w tej przeglądarce lub środowisku. Tryb 2D działa normalnie.");return}if(!L.getContext()){h("Nie udało się zainicjalizować kontekstu WebGL dla widoku 3D. Tryb 2D działa normalnie."),L.dispose();return}const et=E.getBoundingClientRect(),K=Math.max(100,et.width),ft=Math.max(100,et.height);L.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),L.setSize(K,ft),L.domElement.style.display="block",L.domElement.style.width="100%",L.domElement.style.height="100%",E.insertBefore(L.domElement,E.firstChild);const st=new kT,k=new Ri(45,K/ft,.5,5e5);k.up.set(0,0,1);const Y=new Sr,q=new $T(400,20,8950427,8950427);q.rotation.x=Math.PI/2,q.material.transparent=!0,q.material.opacity=.24,Y.add(q);const _t=new Sr,mt=(Et,bt)=>{const zt=new ri().setFromPoints([new it(0,0,0),new it(...Et)]),te=new Mm({color:bt});return new Fx(zt,te)};_t.add(mt([120,0,0],12678717)),_t.add(mt([0,120,0],1476202)),_t.add(mt([0,0,120],2846643)),Y.add(_t),st.add(Y);const At=new Sr;st.add(At);const Wt=new Sr,Kt=new bm(5,16,4),U=new $u({color:1476202}),Q=new Ci(Kt,U);Wt.add(Q);const vt=new ri().setFromPoints([new it(0,-4,0),new it(0,4,0),new it(0,-4,7)]),dt=new $u({color:12678717,side:ra}),wt=new Ci(vt,dt);Wt.add(wt),st.add(Wt),v.current=st,m.current=k,x.current=L,M.current=At,T.current=Y,w.current=Wt;const kt=new ResizeObserver(()=>{const Et=E.getBoundingClientRect(),bt=Math.max(100,Et.width),zt=Math.max(100,Et.height);k.aspect=bt/zt,k.updateProjectionMatrix(),L.setSize(bt,zt);for(const te of S.current)te.resolution.set(bt,zt);L.render(st,k)});return kt.observe(E),P(),()=>{kt.disconnect(),L.domElement.parentNode===E&&E.removeChild(L.domElement),L.dispose(),x.current=null}},[P]),Rt.useEffect(()=>{const E=v.current,L=T.current;E&&(E.background=new De(i?"#111418":"#f7f6f2")),L&&(L.visible=d),P()},[i,d,P]),Rt.useEffect(()=>{const E=M.current,L=l.current;if(!E||!L)return;for(;E.children.length>0;){const k=E.children[0];E.remove(k),k.geometry.dispose(),k.material.dispose()}S.current=[];const et=L.getBoundingClientRect(),K=Math.max(100,et.width),ft=Math.max(100,et.height),st=new Map;for(const k of o){const Y=`${k.color}|${k.width}`;let q=st.get(Y);q||(q={color:k.color,width:k.width,segs:[]},st.set(Y,q)),q.segs.push(k)}for(const k of st.values()){let Y=[],q=null;const _t=()=>{if(Y.length<6)return;const mt=new Wx;mt.setPositions(Y);const At=new wm({color:new De(k.color).getHex(),linewidth:k.width,resolution:new Oe(K,ft)});S.current.push(At);const Wt=new HR(mt,At);Wt.computeLineDistances(),E.add(Wt),Y=[]};for(const mt of k.segs)q&&q[0]===mt.from[0]&&q[1]===mt.from[1]&&q[2]===mt.from[2]?Y.push(mt.to[0],mt.to[1],mt.to[2]):(_t(),Y=[mt.from[0],mt.from[1],mt.from[2],mt.to[0],mt.to[1],mt.to[2]]),q=mt.to;_t()}P()},[o,P]),Rt.useEffect(()=>{const E=w.current;if(!E)return;E.position.set(e.pos[0],e.pos[1],e.pos[2]);const L=new nn,et=new it(...e.right),K=new it(...e.heading),ft=new it(...e.up);L.makeBasis(et,K,ft),E.quaternion.setFromRotationMatrix(L),P()},[e,P]);const H=E=>{if(E.target.closest(".viewport-controls"))return;E.currentTarget.setPointerCapture(E.pointerId);const L=E.button===2||E.shiftKey;y.current={active:!0,mode:L?"pan":"orbit",lastX:E.clientX,lastY:E.clientY}},B=E=>{if(!y.current.active)return;const L=E.clientX-y.current.lastX,et=E.clientY-y.current.lastY;if(y.current.lastX=E.clientX,y.current.lastY=E.clientY,y.current.mode==="orbit")g.current.theta-=L*.008,g.current.phi=Math.max(.05,Math.min(Math.PI-.05,g.current.phi-et*.008));else{const K=m.current;if(K){const ft=g.current.radius*.0015,st=new it,k=new it;K.matrixWorld.extractBasis(st,k,new it),g.current.target.addScaledVector(st,-L*ft),g.current.target.addScaledVector(k,et*ft)}}P()},F=E=>{y.current.active=!1;try{E.currentTarget.releasePointerCapture(E.pointerId)}catch{}},R=E=>{E.preventDefault();const L=E.deltaY<0?.9:1.11;g.current.radius=Math.max(15,Math.min(2e5,g.current.radius*L)),P()};return u?C.jsx("div",{className:"viewport-stage viewport-fallback",role:"alert",children:C.jsxs("div",{className:"viewport-fallback-box",children:[C.jsx("h3",{children:"Widok 3D niedostępny"}),C.jsx("p",{children:u})]})}):C.jsx("div",{className:"viewport-stage",ref:l,onPointerDown:H,onPointerMove:B,onPointerUp:F,onPointerCancel:F,onContextMenu:E=>E.preventDefault(),onWheel:R,"aria-label":"Obszar rysowania 3D",children:C.jsxs("div",{className:"viewport-controls",role:"toolbar","aria-label":"Sterowanie widokiem 3D",children:[C.jsx("button",{type:"button",className:"vp-btn",onClick:()=>{g.current.radius=Math.max(15,g.current.radius*.8),P()},"aria-label":"Przybliż kamerę",title:"Przybliż",children:"+"}),C.jsx("button",{type:"button",className:"vp-btn",onClick:()=>{g.current.radius=Math.min(2e5,g.current.radius*1.25),P()},"aria-label":"Oddal kamerę",title:"Oddal",children:"−"}),C.jsxs("button",{type:"button",className:"vp-btn vp-btn-text",onClick:z,title:"Dopasuj bryłę do widoku",children:[C.jsx(fx,{size:14}),C.jsx("span",{children:"Dopasuj"})]}),C.jsxs("button",{type:"button",className:"vp-btn vp-btn-text",onClick:N,title:"Przywróć domyślną kamerę",children:[C.jsx(fm,{size:14}),C.jsx("span",{children:"Reset"})]}),C.jsx("button",{type:"button",className:`vp-btn vp-btn-text${d?" is-pressed":""}`,onClick:()=>p(E=>!E),"aria-pressed":d,title:"Pokaż lub ukryj siatkę i osie",children:C.jsx("span",{children:"Siatka i osie"})})]})})});Yx.displayName="Viewport3D";const la={DRAFT_2D:"logomocja:draft:2d",DRAFT_3D:"logomocja:draft:3d",MODE:"logomocja:mode",THEME:"logomocja:theme",CHALLENGES:"logomocja:challenges"};function Fu(o){try{return localStorage.getItem(o==="2d"?la.DRAFT_2D:la.DRAFT_3D)}catch{return null}}function _p(o,e){try{localStorage.setItem(o==="2d"?la.DRAFT_2D:la.DRAFT_3D,e)}catch{}}function kR(){try{return localStorage.getItem(la.MODE)==="3d"?"3d":"2d"}catch{return"2d"}}function yp(o){try{localStorage.setItem(la.MODE,o)}catch{}}function GR(){try{const o=localStorage.getItem(la.THEME);return o==="light"||o==="dark"||o==="system"?o:"system"}catch{return"system"}}function VR(o){try{localStorage.setItem(la.THEME,o)}catch{}}function Zx(){try{const o=localStorage.getItem(la.CHALLENGES);return o?JSON.parse(o):{}}catch{return{}}}function jR(o,e){const i=Zx();{i[o]=!0;try{localStorage.setItem(la.CHALLENGES,JSON.stringify(i))}catch{}}return i}function XR(o){const e=new TextEncoder().encode(o);let i="";for(let r=0;r<e.length;r++)i+=String.fromCharCode(e[r]);return btoa(i).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function qR(o){try{let e=o.replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4!==0;)e+="=";const i=atob(e),r=new Uint8Array(i.length);for(let l=0;l<i.length;l++)r[l]=i.charCodeAt(l);return new TextDecoder().decode(r)}catch{return null}}function WR(o,e){const i=new URL(window.location.href),r=XR(e);return i.hash=`#/?mode=${o}&code=${r}`,i.toString()}function ix(){const o=window.location.hash;if(!o)return null;const e=o.indexOf("?");if(e===-1)return null;const i=new URLSearchParams(o.slice(e+1)),r=i.get("code");if(!r)return null;const l=qR(r);return l===null?null:{mode:i.get("mode")==="3d"?"3d":"2d",code:l}}function YR(o,e){const i=new Blob([e],{type:"text/plain;charset=utf-8"}),r=URL.createObjectURL(i),l=document.createElement("a");l.href=r,l.download=o,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(r)}const is={pos:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],penDown:!0,color:"#16866a",width:3},ax=Zu.find(o=>o.id==="kwadrat").source,rx=Zu.find(o=>o.id==="schody").source;function sx(){const o=window.location.hash.replace(/^#\/?/,"").split("?")[0];return o==="przyklady"?"przyklady":o==="wyzwania"?"wyzwania":o==="slownik"?"slownik":"pracownia"}const ZR=()=>{const o=Rt.useMemo(()=>ix(),[]),[e,i]=Rt.useState(()=>o?"pracownia":sx()),[r,l]=Rt.useState(()=>o?o.mode:kR()),[u,h]=Rt.useState(()=>({"2d":o&&o.mode==="2d"?o.code:Fu("2d")??ax,"3d":o&&o.mode==="3d"?o.code:Fu("3d")??rx})),[d,p]=Rt.useState(()=>({"2d":Fu("2d")??ax,"3d":Fu("3d")??rx})),[g,v]=Rt.useState(()=>GR()),[m,x]=Rt.useState(()=>typeof window<"u"&&window.matchMedia("(prefers-color-scheme: dark)").matches),[M,T]=Rt.useState(()=>Zx()),[w,S]=Rt.useState("idle"),[y,P]=Rt.useState([]),[z,N]=Rt.useState(is),[X,H]=Rt.useState(null),[B,F]=Rt.useState(null),[R,E]=Rt.useState(0),[L,et]=Rt.useState(75),[K,ft]=Rt.useState("code"),[st,k]=Rt.useState(null),[Y,q]=Rt.useState(null),_t=Rt.useRef(null),mt=Rt.useRef(null),At=Rt.useRef(null),Wt=Rt.useRef(null),Kt=g==="dark"||g==="system"&&m,U=u[r];Rt.useEffect(()=>{document.documentElement.dataset.theme=Kt?"dark":"light"},[Kt]),Rt.useEffect(()=>{const V=window.matchMedia("(prefers-color-scheme: dark)"),nt=ct=>x(ct.matches);return V.addEventListener("change",nt),()=>V.removeEventListener("change",nt)},[]),Rt.useEffect(()=>{const V=()=>{const nt=ix();if(nt){l(nt.mode),h(ct=>({...ct,[nt.mode]:nt.code})),i("pracownia");return}i(sx())};return window.addEventListener("hashchange",V),()=>window.removeEventListener("hashchange",V)},[]);const Q=V=>{i(V),window.location.hash=`#/${V}`},vt=Rt.useCallback(V=>{q(V),window.setTimeout(()=>{q(nt=>nt===V?null:nt)},2400)},[]),dt=Rt.useCallback(()=>{mt.current!==null&&(window.clearTimeout(mt.current),mt.current=null)},[]),wt=Rt.useCallback(()=>{dt(),_t.current=null,S("idle"),P([]),N(is),H(null),F(null),E(0)},[dt]),kt=Rt.useCallback(V=>{P([...V.getSegments()]),N(V.getTurtle()),E(V.getOps()),H(V.getNextLine()),F(V.error)},[]),Et=Rt.useCallback((V,nt)=>{dt(),_t.current=null;const ct=Pl(V,nt),{vm:Ot}=Hu(V,nt);return Ot?(Ot.runToEnd(),N(Ot.getTurtle()),E(Ot.getOps())):(N(is),E(0)),P(ct.segments),H(null),F(ct.error),S(ct.error?"error":"done"),ct},[dt]);Rt.useEffect(()=>{Et(U,r),requestAnimationFrame(()=>{var V;(V=At.current)==null||V.fitToDrawing()})},[]),Rt.useEffect(()=>{if(w!=="running"){dt();return}let V=!1;const nt=()=>{if(V||!_t.current)return;const ct=_t.current,Ot=L>=98?1e4:L>=80?25:L>=60?6:1,Ct=L>=98?0:L>=60?16:Math.round(320-(L-1)/59*290);for(let It=0;It<Ot;It++){const pe=ct.step();if(pe.done){kt(ct),H(null),S(pe.error?"error":"done");return}}kt(ct),mt.current=window.setTimeout(nt,Ct)};return mt.current=window.setTimeout(nt,0),()=>{V=!0,dt()}},[w,L,dt,kt]);const bt=Rt.useCallback(()=>{if(L>=98){Et(U,r);return}dt();const{vm:V,error:nt}=Hu(U,r);if(nt||!V){_t.current=null,P([]),N(is),H(null),F(nt),E(0),S("error");return}_t.current=V,F(null),P([]),N(is),E(0),H(V.getNextLine()),S("running")},[U,r,Et,L,dt]),zt=Rt.useCallback(()=>{dt();let V=_t.current;if(!V||w==="done"||w==="error"||w==="idle"){const ct=Hu(U,r);if(ct.error||!ct.vm){_t.current=null,P([]),N(is),H(null),F(ct.error),E(0),S("error");return}V=ct.vm,_t.current=V,F(null),P([]),N(is),E(0),H(V.getNextLine()),S("paused");return}const nt=V.step();kt(V),nt.done?(H(null),S(nt.error?"error":"done")):S("paused")},[U,w,r,dt,kt]),te=Rt.useCallback(()=>{w==="running"?(dt(),S("paused")):w==="paused"&&S("running")},[w,dt]);Rt.useEffect(()=>{const V=nt=>{e==="pracownia"&&((nt.ctrlKey||nt.metaKey)&&nt.key==="Enter"?(nt.preventDefault(),bt()):nt.key==="F10"||nt.altKey&&nt.key.toLowerCase()==="k"?(nt.preventDefault(),zt()):nt.key==="F8"||nt.altKey&&nt.key.toLowerCase()==="p"?(nt.preventDefault(),te()):nt.altKey&&nt.key.toLowerCase()==="r"&&(nt.preventDefault(),wt()))};return window.addEventListener("keydown",V),()=>window.removeEventListener("keydown",V)},[te,bt,zt,wt,e]);const G=V=>{(w==="running"||w==="paused")&&(dt(),_t.current=null,H(null),S("idle")),h(nt=>({...nt,[r]:V})),_p(r,V)},an=V=>{V!==r&&(dt(),_t.current=null,l(V),yp(V),Et(u[V],V),requestAnimationFrame(()=>{var nt;(nt=At.current)==null||nt.fitToDrawing()}))},re=Rt.useCallback((V,nt)=>{l(nt),yp(nt),h(ct=>({...ct,[nt]:V})),p(ct=>({...ct,[nt]:V})),_p(nt,V),i("pracownia"),window.location.hash="#/pracownia",Et(V,nt),requestAnimationFrame(()=>{var ct;(ct=At.current)==null||ct.fitToDrawing()})},[Et]),Jt=(V,nt,ct)=>{const Ot=u[ct],Ct=d[ct];Ot!==Ct&&Ot.trim()!==""?k({label:V,targetMode:ct,source:nt}):re(nt,ct)},Nt=V=>{Jt(V.title,V.source,V.mode)},ve=V=>{var Ot;const nt=(Ot=V.target.files)==null?void 0:Ot[0];if(V.target.value="",!nt)return;const ct=new FileReader;ct.onload=()=>{const Ct=typeof ct.result=="string"?ct.result:"";Jt(nt.name,Ct,r)},ct.readAsText(nt,"utf-8")},Yt=async()=>{const V=WR(r,U);try{await navigator.clipboard.writeText(V),vt("Skopiowano link do programu.")}catch{window.location.hash=new URL(V).hash,vt("Zaktualizowano adres URL w pasku przeglądarki.")}},O=()=>{const V=["system","light","dark"],nt=V[(V.indexOf(g)+1)%V.length];v(nt),VR(nt)};Rt.useEffect(()=>(window.logomocja={version:"1.0.0",run:(V,nt)=>Pl(V,nt),open:(V,nt)=>{l(nt),yp(nt),h(Ot=>({...Ot,[nt]:V})),p(Ot=>({...Ot,[nt]:V})),_p(nt,V),i("pracownia");const ct=Et(V,nt);return new Promise(Ot=>{requestAnimationFrame(()=>{var Ct;(Ct=At.current)==null||Ct.fitToDrawing(),requestAnimationFrame(()=>{Ot(ct)})})})}},()=>{delete window.logomocja}),[Et]);const A=g==="system"?"Motyw: System":g==="light"?"Motyw: Jasny":"Motyw: Ciemny",lt=Math.round((Math.atan2(z.heading[0],z.heading[1])*180/Math.PI+360)%360);return C.jsxs("div",{className:"app-shell",children:[C.jsxs("header",{className:"topbar",children:[C.jsxs("div",{className:"topbar-left",children:[C.jsxs("a",{href:"#/pracownia",className:"brand",onClick:V=>{V.preventDefault(),Q("pracownia")},children:[C.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 32 32","aria-hidden":"true",children:[C.jsx("rect",{width:"32",height:"32",rx:"6",fill:"var(--accent)"}),C.jsx("polygon",{points:"16,6 25,24 16,20 7,24",fill:"var(--bg)"})]}),C.jsx("span",{children:"Logomocja"})]}),C.jsx("nav",{className:"nav-tabs","aria-label":"Główna nawigacja",children:[["pracownia","Pracownia"],["przyklady","Przykłady"],["wyzwania","Wyzwania"],["slownik","Słownik"]].map(([V,nt])=>C.jsx("button",{type:"button",className:`nav-tab${e===V?" is-active":""}`,onClick:()=>Q(V),"aria-current":e===V?"page":void 0,children:nt},V))})]}),C.jsxs("div",{className:"topbar-right",children:[e==="pracownia"&&C.jsxs(C.Fragment,{children:[C.jsxs("div",{className:"mode-switch",role:"group","aria-label":"Tryb rysowania",children:[C.jsx("button",{type:"button",className:`mode-btn${r==="2d"?" is-active":""}`,onClick:()=>an("2d"),"aria-pressed":r==="2d",children:"2D"}),C.jsx("button",{type:"button",className:`mode-btn${r==="3d"?" is-active":""}`,onClick:()=>an("3d"),"aria-pressed":r==="3d",children:"3D"})]}),C.jsxs("div",{className:"file-actions",children:[C.jsx("input",{ref:Wt,type:"file",accept:".logo,.txt",className:"sr-only",onChange:ve,"aria-label":"Wczytaj plik .logo"}),C.jsxs("button",{type:"button",className:"icon-action-btn",onClick:()=>{var V;return(V=Wt.current)==null?void 0:V.click()},title:"Otwórz plik .logo","aria-label":"Otwórz plik .logo",children:[C.jsx(tb,{size:15}),C.jsx("span",{className:"hide-sm",children:"Otwórz"})]}),C.jsxs("button",{type:"button",className:"icon-action-btn",onClick:()=>YR(`logomocja-${r}.logo`,U),title:"Pobierz jako plik .logo","aria-label":"Pobierz jako plik .logo",children:[C.jsx(Y_,{size:15}),C.jsx("span",{className:"hide-sm",children:".logo"})]}),C.jsxs("button",{type:"button",className:"icon-action-btn",onClick:()=>{var V;return(V=At.current)==null?void 0:V.exportPng()},title:"Eksportuj rysunek jako PNG","aria-label":"Eksportuj rysunek jako PNG",children:[C.jsx(Y_,{size:15}),C.jsx("span",{className:"hide-sm",children:"PNG"})]}),C.jsxs("button",{type:"button",className:"icon-action-btn",onClick:Yt,title:"Kopiuj link do programu","aria-label":"Kopiuj link do programu",children:[C.jsx($E,{size:15}),C.jsx("span",{className:"hide-sm",children:"Link"})]})]})]}),C.jsxs("button",{type:"button",className:"icon-action-btn",onClick:O,title:A,"aria-label":A,children:[Kt?C.jsx(nb,{size:15}):C.jsx(eb,{size:15}),C.jsx("span",{className:"hide-md",children:g==="system"?"System":g==="light"?"Jasny":"Ciemny"})]})]})]}),st&&C.jsxs("div",{className:"confirm-bar",role:"alertdialog","aria-label":"Potwierdzenie wczytania",children:[C.jsxs("span",{children:["Masz niezapisane zmiany w trybie ",st.targetMode.toUpperCase(),". Czy zastąpić je plikiem „",st.label,"”?"]}),C.jsxs("div",{className:"confirm-actions",children:[C.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>{re(st.source,st.targetMode),k(null)},children:"Tak, wczytaj"}),C.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>k(null),children:"Anuluj"})]})]}),Y&&C.jsx("div",{className:"toast-pill",role:"status",children:Y}),C.jsxs("main",{className:"main-area",children:[e==="pracownia"&&C.jsxs("div",{className:"workspace",children:[C.jsxs("div",{className:"mobile-pane-tabs",role:"tablist","aria-label":"Widok na telefonie",children:[C.jsx("button",{type:"button",role:"tab","aria-selected":K==="code",className:`mobile-pane-tab${K==="code"?" is-active":""}`,onClick:()=>ft("code"),children:"Kod programu"}),C.jsxs("button",{type:"button",role:"tab","aria-selected":K==="view",className:`mobile-pane-tab${K==="view"?" is-active":""}`,onClick:()=>ft("view"),children:["Rysunek (",r.toUpperCase(),")"]})]}),C.jsxs("section",{className:`pane-editor${K==="code"?" is-mobile-visible":""}`,"aria-label":"Edytor programu",children:[C.jsxs("div",{className:"exec-bar",children:[C.jsxs("div",{className:"exec-buttons",children:[C.jsxs("button",{type:"button",className:"btn btn-primary",onClick:bt,title:"Uruchom program (Ctrl/Cmd + Enter)",children:[C.jsx(ux,{size:14}),C.jsx("span",{children:"Uruchom"})]}),C.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:zt,title:"Wykonaj jeden krok (F10 lub Alt + K)",children:[C.jsx(JE,{size:14}),C.jsx("span",{children:"Krok"})]}),C.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:te,disabled:w!=="running"&&w!=="paused",title:"Pauza lub wznowienie (F8 lub Alt + P)",children:[C.jsx(QE,{size:14}),C.jsx("span",{children:w==="paused"?"Wznów":"Pauza"})]}),C.jsxs("button",{type:"button",className:"btn btn-ghost",onClick:wt,title:"Resetuj rysunek i stan żółwia (Alt + R)",children:[C.jsx(fm,{size:14}),C.jsx("span",{children:"Reset"})]})]}),C.jsxs("label",{className:"speed-control",children:[C.jsx("span",{children:"Prędkość"}),C.jsx("input",{type:"range",min:1,max:100,value:L,onChange:V=>et(Number(V.target.value)),"aria-label":"Prędkość animacji"})]})]}),C.jsx("div",{className:"editor-container",children:C.jsx(dx,{value:U,onChange:G,activeLine:X,error:B})}),C.jsxs("div",{className:"shortcuts-strip","aria-label":"Skróty klawiszowe",children:[C.jsx("span",{children:"Ctrl+Enter: Uruchom"}),C.jsx("span",{children:"F10 / Alt+K: Krok"}),C.jsx("span",{children:"F8 / Alt+P: Pauza"}),C.jsx("span",{children:"Alt+R: Reset"})]})]}),C.jsxs("section",{className:`pane-viewport${K==="view"?" is-mobile-visible":""}`,"aria-label":"Scena żółwia",children:[C.jsx("div",{className:"viewport-frame",children:r==="2d"?C.jsx(hx,{ref:At,segments:y,turtle:z,isDark:Kt}):C.jsx(Yx,{ref:At,segments:y,turtle:z,isDark:Kt})}),C.jsxs("div",{className:"telemetry-bar","aria-label":"Stan żółwia",children:[C.jsxs("span",{className:"telemetry-item tabular",children:[C.jsx("strong",{children:"Pozycja:"})," ",z.pos[0].toFixed(1),","," ",z.pos[1].toFixed(1),r==="3d"?`, ${z.pos[2].toFixed(1)}`:""]}),C.jsxs("span",{className:"telemetry-item tabular",children:[C.jsx("strong",{children:"Kierunek:"})," ",lt,"°"]}),C.jsxs("span",{className:"telemetry-item",children:[C.jsx("strong",{children:"Pisak:"})," ",C.jsx("span",{className:"pen-swatch",style:{backgroundColor:z.color},"aria-hidden":"true"}),z.penDown?`opuszczony (${z.width}px)`:"podniesiony"]}),C.jsxs("span",{className:"telemetry-item tabular",children:[C.jsx("strong",{children:"Odcinki:"})," ",y.length]}),C.jsxs("span",{className:"telemetry-item tabular",children:[C.jsx("strong",{children:"Operacje:"})," ",R]})]})]})]}),e==="przyklady"&&C.jsx(sb,{onSelectExample:Nt}),e==="wyzwania"&&C.jsx(rb,{completed:M,onMarkCompleted:V=>T(jR(V)),onOpenInStudio:(V,nt)=>re(V,nt)}),e==="slownik"&&C.jsx(lb,{})]})]})};VE.createRoot(document.getElementById("root")).render(C.jsx(OE.StrictMode,{children:C.jsx(ZR,{})}));
