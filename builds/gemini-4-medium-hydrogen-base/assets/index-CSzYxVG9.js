(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const d of u.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function i(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(l){if(l.ep)return;l.ep=!0;const u=i(l);fetch(l.href,u)}})();var Hd={exports:{}},zl={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var jv;function ib(){if(jv)return zl;jv=1;var s=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(r,l,u){var d=null;if(u!==void 0&&(d=""+u),l.key!==void 0&&(d=""+l.key),"key"in l){u={};for(var h in l)h!=="key"&&(u[h]=l[h])}else u=l;return l=u.ref,{$$typeof:s,type:r,key:d,ref:l!==void 0?l:null,props:u}}return zl.Fragment=e,zl.jsx=i,zl.jsxs=i,zl}var Xv;function ab(){return Xv||(Xv=1,Hd.exports=ib()),Hd.exports}var j=ab(),kd={exports:{}},ce={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yv;function rb(){if(Yv)return ce;Yv=1;var s=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),d=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),m=Symbol.for("react.activity"),S=Symbol.for("react.view_transition"),x=Symbol.iterator;function E(R){return R===null||typeof R!="object"?null:(R=x&&R[x]||R["@@iterator"],typeof R=="function"?R:null)}var T={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,y={};function U(R,Y,yt){this.props=R,this.context=Y,this.refs=y,this.updater=yt||T}U.prototype.isReactComponent={},U.prototype.setState=function(R,Y){if(typeof R!="object"&&typeof R!="function"&&R!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,R,Y,"setState")},U.prototype.forceUpdate=function(R){this.updater.enqueueForceUpdate(this,R,"forceUpdate")};function O(){}O.prototype=U.prototype;function N(R,Y,yt){this.props=R,this.context=Y,this.refs=y,this.updater=yt||T}var G=N.prototype=new O;G.constructor=N,M(G,U.prototype),G.isPureReactComponent=!0;var F=Array.isArray;function z(){}var I={H:null,A:null,T:null,S:null},D=Object.prototype.hasOwnProperty;function A(R,Y,yt){var ht=yt.ref;return{$$typeof:s,type:R,key:Y,ref:ht!==void 0?ht:null,props:yt}}function B(R,Y){return A(R.type,Y,R.props)}function it(R){return typeof R=="object"&&R!==null&&R.$$typeof===s}function at(R){var Y={"=":"=0",":":"=2"};return"$"+R.replace(/[=:]/g,function(yt){return Y[yt]})}var ft=/\/+/g;function ct(R,Y){return typeof R=="object"&&R!==null&&R.key!=null?at(""+R.key):Y.toString(36)}function V(R){switch(R.status){case"fulfilled":return R.value;case"rejected":throw R.reason;default:switch(typeof R.status=="string"?R.then(z,z):(R.status="pending",R.then(function(Y){R.status==="pending"&&(R.status="fulfilled",R.value=Y)},function(Y){R.status==="pending"&&(R.status="rejected",R.reason=Y)})),R.status){case"fulfilled":return R.value;case"rejected":throw R.reason}}throw R}function st(R,Y,yt,ht,Rt){var Xt=typeof R;(Xt==="undefined"||Xt==="boolean")&&(R=null);var Ut=!1;if(R===null)Ut=!0;else switch(Xt){case"bigint":case"string":case"number":Ut=!0;break;case"object":switch(R.$$typeof){case s:case e:Ut=!0;break;case _:return Ut=R._init,st(Ut(R._payload),Y,yt,ht,Rt)}}if(Ut)return Rt=Rt(R),Ut=ht===""?"."+ct(R,0):ht,F(Rt)?(yt="",Ut!=null&&(yt=Ut.replace(ft,"$&/")+"/"),st(Rt,Y,yt,"",function(le){return le})):Rt!=null&&(it(Rt)&&(Rt=B(Rt,yt+(Rt.key==null||R&&R.key===Rt.key?"":(""+Rt.key).replace(ft,"$&/")+"/")+Ut)),Y.push(Rt)),1;Ut=0;var Ct=ht===""?".":ht+":";if(F(R))for(var kt=0;kt<R.length;kt++)ht=R[kt],Xt=Ct+ct(ht,kt),Ut+=st(ht,Y,yt,Xt,Rt);else if(kt=E(R),typeof kt=="function")for(R=kt.call(R),kt=0;!(ht=R.next()).done;)ht=ht.value,Xt=Ct+ct(ht,kt++),Ut+=st(ht,Y,yt,Xt,Rt);else if(Xt==="object"){if(typeof R.then=="function")return st(V(R),Y,yt,ht,Rt);throw Y=String(R),Error("Objects are not valid as a React child (found: "+(Y==="[object Object]"?"object with keys {"+Object.keys(R).join(", ")+"}":Y)+"). If you meant to render a collection of children, use an array instead.")}return Ut}function q(R,Y,yt){if(R==null)return R;var ht=[],Rt=0;return st(R,ht,"","",function(Xt){return Y.call(yt,Xt,Rt++)}),ht}function St(R){if(R._status===-1){var Y=R._result,yt=Y();yt.then(function(ht){(R._status===0||R._status===-1)&&(R._status=1,R._result=ht,yt.status===void 0&&(yt.status="fulfilled",yt.value=ht))},function(ht){(R._status===0||R._status===-1)&&(R._status=2,R._result=ht,yt.status===void 0&&(yt.status="rejected",yt.reason=ht))}),R._status===-1&&(R._status=0,R._result=yt)}if(R._status===1)return R._result.default;throw R._result}var vt=typeof reportError=="function"?reportError:function(R){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var Y=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof R=="object"&&R!==null&&typeof R.message=="string"?String(R.message):String(R),error:R});if(!window.dispatchEvent(Y))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",R);return}console.error(R)};function At(R){var Y=I.T,yt={};yt.types=Y!==null?Y.types:null,I.T=yt;try{var ht=R(),Rt=I.S;Rt!==null&&Rt(yt,ht),typeof ht=="object"&&ht!==null&&typeof ht.then=="function"&&ht.then(z,vt)}catch(Xt){vt(Xt)}finally{Y!==null&&yt.types!==null&&(Y.types=yt.types),I.T=Y}}function Yt(R){var Y=I.T;if(Y!==null){var yt=Y.types;yt===null?Y.types=[R]:yt.indexOf(R)===-1&&yt.push(R)}else At(Yt.bind(null,R))}var ie={map:q,forEach:function(R,Y,yt){q(R,function(){Y.apply(this,arguments)},yt)},count:function(R){var Y=0;return q(R,function(){Y++}),Y},toArray:function(R){return q(R,function(Y){return Y})||[]},only:function(R){if(!it(R))throw Error("React.Children.only expected to receive a single React element child.");return R}};return ce.Activity=m,ce.Children=ie,ce.Component=U,ce.Fragment=i,ce.Profiler=l,ce.PureComponent=N,ce.StrictMode=r,ce.Suspense=p,ce.ViewTransition=S,ce.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=I,ce.__COMPILER_RUNTIME={__proto__:null,c:function(R){return I.H.useMemoCache(R)}},ce.addTransitionType=Yt,ce.cache=function(R){return function(){return R.apply(null,arguments)}},ce.cacheSignal=function(){return null},ce.cloneElement=function(R,Y,yt){if(R==null)throw Error("The argument must be a React element, but you passed "+R+".");var ht=M({},R.props),Rt=R.key;if(Y!=null)for(Xt in Y.key!==void 0&&(Rt=""+Y.key),Y)!D.call(Y,Xt)||Xt==="key"||Xt==="__self"||Xt==="__source"||Xt==="ref"&&Y.ref===void 0||(ht[Xt]=Y[Xt]);var Xt=arguments.length-2;if(Xt===1)ht.children=yt;else if(1<Xt){for(var Ut=Array(Xt),Ct=0;Ct<Xt;Ct++)Ut[Ct]=arguments[Ct+2];ht.children=Ut}return A(R.type,Rt,ht)},ce.createContext=function(R){return R={$$typeof:d,_currentValue:R,_currentValue2:R,_threadCount:0,Provider:null,Consumer:null},R.Provider=R,R.Consumer={$$typeof:u,_context:R},R},ce.createElement=function(R,Y,yt){var ht,Rt={},Xt=null;if(Y!=null)for(ht in Y.key!==void 0&&(Xt=""+Y.key),Y)D.call(Y,ht)&&ht!=="key"&&ht!=="__self"&&ht!=="__source"&&(Rt[ht]=Y[ht]);var Ut=arguments.length-2;if(Ut===1)Rt.children=yt;else if(1<Ut){for(var Ct=Array(Ut),kt=0;kt<Ut;kt++)Ct[kt]=arguments[kt+2];Rt.children=Ct}if(R&&R.defaultProps)for(ht in Ut=R.defaultProps,Ut)Rt[ht]===void 0&&(Rt[ht]=Ut[ht]);return A(R,Xt,Rt)},ce.createRef=function(){return{current:null}},ce.forwardRef=function(R){return{$$typeof:h,render:R}},ce.isValidElement=it,ce.lazy=function(R){return{$$typeof:_,_payload:{_status:-1,_result:R},_init:St}},ce.memo=function(R,Y){return{$$typeof:g,type:R,compare:Y===void 0?null:Y}},ce.startTransition=At,ce.unstable_useCacheRefresh=function(){return I.H.useCacheRefresh()},ce.use=function(R){return I.H.use(R)},ce.useActionState=function(R,Y,yt){return I.H.useActionState(R,Y,yt)},ce.useCallback=function(R,Y){return I.H.useCallback(R,Y)},ce.useContext=function(R){return I.H.useContext(R)},ce.useDebugValue=function(){},ce.useDeferredValue=function(R,Y){return I.H.useDeferredValue(R,Y)},ce.useEffect=function(R,Y){return I.H.useEffect(R,Y)},ce.useEffectEvent=function(R){return I.H.useEffectEvent(R)},ce.useId=function(){return I.H.useId()},ce.useImperativeHandle=function(R,Y,yt){return I.H.useImperativeHandle(R,Y,yt)},ce.useInsertionEffect=function(R,Y){return I.H.useInsertionEffect(R,Y)},ce.useLayoutEffect=function(R,Y){return I.H.useLayoutEffect(R,Y)},ce.useMemo=function(R,Y){return I.H.useMemo(R,Y)},ce.useOptimistic=function(R,Y){return I.H.useOptimistic(R,Y)},ce.useReducer=function(R,Y,yt){return I.H.useReducer(R,Y,yt)},ce.useRef=function(R){return I.H.useRef(R)},ce.useState=function(R){return I.H.useState(R)},ce.useSyncExternalStore=function(R,Y,yt){return I.H.useSyncExternalStore(R,Y,yt)},ce.useTransition=function(){return I.H.useTransition()},ce.version="19.3.1",ce}var Wv;function xm(){return Wv||(Wv=1,kd.exports=rb()),kd.exports}var Pt=xm(),Gd={exports:{}},Ll={},Vd={exports:{}},jd={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qv;function sb(){return qv||(qv=1,(function(s){function e(V,st){var q=V.length;V.push(st);t:for(;0<q;){var St=q-1>>>1,vt=V[St];if(0<l(vt,st))V[St]=st,V[q]=vt,q=St;else break t}}function i(V){return V.length===0?null:V[0]}function r(V){if(V.length===0)return null;var st=V[0],q=V.pop();if(q!==st){V[0]=q;t:for(var St=0,vt=V.length,At=vt>>>1;St<At;){var Yt=2*(St+1)-1,ie=V[Yt],R=Yt+1,Y=V[R];if(0>l(ie,q))R<vt&&0>l(Y,ie)?(V[St]=Y,V[R]=q,St=R):(V[St]=ie,V[Yt]=q,St=Yt);else if(R<vt&&0>l(Y,q))V[St]=Y,V[R]=q,St=R;else break t}}return st}function l(V,st){var q=V.sortIndex-st.sortIndex;return q!==0?q:V.id-st.id}if(s.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;s.unstable_now=function(){return u.now()}}else{var d=Date,h=d.now();s.unstable_now=function(){return d.now()-h}}var p=[],g=[],_=1,m=null,S=3,x=!1,E=!1,T=!1,M=!1,y=typeof setTimeout=="function"?setTimeout:null,U=typeof clearTimeout=="function"?clearTimeout:null,O=typeof setImmediate<"u"?setImmediate:null;function N(V){for(var st=i(g);st!==null;){if(st.callback===null)r(g);else if(st.startTime<=V)r(g),st.sortIndex=st.expirationTime,e(p,st);else break;st=i(g)}}function G(V){if(T=!1,N(V),!E)if(i(p)!==null)E=!0,F||(F=!0,it());else{var st=i(g);st!==null&&ct(G,st.startTime-V)}}var F=!1,z=-1,I=5,D=-1;function A(){return M?!0:!(s.unstable_now()-D<I)}function B(){if(M=!1,F){var V=s.unstable_now();D=V;var st=!0;try{t:{E=!1,T&&(T=!1,U(z),z=-1),x=!0;var q=S;try{e:{for(N(V),m=i(p);m!==null&&!(m.expirationTime>V&&A());){var St=m.callback;if(typeof St=="function"){m.callback=null,S=m.priorityLevel;var vt=St(m.expirationTime<=V);if(V=s.unstable_now(),typeof vt=="function"){m.callback=vt,N(V),st=!0;break e}m===i(p)&&r(p),N(V)}else r(p);m=i(p)}if(m!==null)st=!0;else{var At=i(g);At!==null&&ct(G,At.startTime-V),st=!1}}break t}finally{m=null,S=q,x=!1}st=void 0}}finally{st?it():F=!1}}}var it;if(typeof O=="function")it=function(){O(B)};else if(typeof MessageChannel<"u"){var at=new MessageChannel,ft=at.port2;at.port1.onmessage=B,it=function(){ft.postMessage(null)}}else it=function(){y(B,0)};function ct(V,st){z=y(function(){V(s.unstable_now())},st)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(V){V.callback=null},s.unstable_forceFrameRate=function(V){0>V||125<V?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):I=0<V?Math.floor(1e3/V):5},s.unstable_getCurrentPriorityLevel=function(){return S},s.unstable_next=function(V){switch(S){case 1:case 2:case 3:var st=3;break;default:st=S}var q=S;S=st;try{return V()}finally{S=q}},s.unstable_requestPaint=function(){M=!0},s.unstable_runWithPriority=function(V,st){switch(V){case 1:case 2:case 3:case 4:case 5:break;default:V=3}var q=S;S=V;try{return st()}finally{S=q}},s.unstable_scheduleCallback=function(V,st,q){var St=s.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?St+q:St):q=St,V){case 1:var vt=-1;break;case 2:vt=250;break;case 5:vt=1073741823;break;case 4:vt=1e4;break;default:vt=5e3}return vt=q+vt,V={id:_++,callback:st,priorityLevel:V,startTime:q,expirationTime:vt,sortIndex:-1},q>St?(V.sortIndex=q,e(g,V),i(p)===null&&V===i(g)&&(T?(U(z),z=-1):T=!0,ct(G,q-St))):(V.sortIndex=vt,e(p,V),E||x||(E=!0,F||(F=!0,it()))),V},s.unstable_shouldYield=A,s.unstable_wrapCallback=function(V){var st=S;return function(){var q=S;S=st;try{return V.apply(this,arguments)}finally{S=q}}}})(jd)),jd}var Zv;function ob(){return Zv||(Zv=1,Vd.exports=sb()),Vd.exports}var Xd={exports:{}},Bn={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Kv;function lb(){if(Kv)return Bn;Kv=1;var s=xm();function e(_){var m="https://react.dev/errors/"+_;if(1<arguments.length){m+="?args[]="+encodeURIComponent(arguments[1]);for(var S=2;S<arguments.length;S++)m+="&args[]="+encodeURIComponent(arguments[S])}return"Minified React error #"+_+"; visit "+m+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var r={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal"),u=Symbol.for("react.recoverable"),d=Symbol.for("react.optimistic_key");function h(_,m,S){var x=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:x==null?null:x===d?d:""+x,children:_,containerInfo:m,implementation:S}}var p=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function g(_,m){if(_==="font")return"";if(typeof m=="string")return m==="use-credentials"?m:""}return Bn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,Bn.browser=function(_){return{$$typeof:u,_reason:_}},Bn.createPortal=function(_,m){var S=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!m||m.nodeType!==1&&m.nodeType!==9&&m.nodeType!==11)throw Error(e(299));return h(_,m,null,S)},Bn.flushSync=function(_){var m=p.T,S=r.p;try{if(p.T=null,r.p=2,_)return _()}finally{p.T=m,r.p=S,r.d.f()}},Bn.preconnect=function(_,m){typeof _=="string"&&(m?(m=m.crossOrigin,m=typeof m=="string"?m==="use-credentials"?m:"":void 0):m=null,r.d.C(_,m))},Bn.prefetchDNS=function(_){typeof _=="string"&&r.d.D(_)},Bn.preinit=function(_,m){if(typeof _=="string"&&m&&typeof m.as=="string"){var S=m.as,x=g(S,m.crossOrigin),E=typeof m.integrity=="string"?m.integrity:void 0,T=typeof m.fetchPriority=="string"?m.fetchPriority:void 0;S==="style"?r.d.S(_,typeof m.precedence=="string"?m.precedence:void 0,{crossOrigin:x,integrity:E,fetchPriority:T}):S==="script"&&r.d.X(_,{crossOrigin:x,integrity:E,fetchPriority:T,nonce:typeof m.nonce=="string"?m.nonce:void 0})}},Bn.preinitModule=function(_,m){if(typeof _=="string")if(typeof m=="object"&&m!==null){if(m.as==null||m.as==="script"){var S=g(m.as,m.crossOrigin);r.d.M(_,{crossOrigin:S,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0})}}else m==null&&r.d.M(_)},Bn.preload=function(_,m){if(typeof _=="string"&&typeof m=="object"&&m!==null&&typeof m.as=="string"){var S=m.as,x=g(S,m.crossOrigin);r.d.L(_,S,{crossOrigin:x,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,type:typeof m.type=="string"?m.type:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0,referrerPolicy:typeof m.referrerPolicy=="string"?m.referrerPolicy:void 0,imageSrcSet:typeof m.imageSrcSet=="string"?m.imageSrcSet:void 0,imageSizes:typeof m.imageSizes=="string"?m.imageSizes:void 0,media:typeof m.media=="string"?m.media:void 0})}},Bn.preloadModule=function(_,m){if(typeof _=="string")if(m){var S=g(m.as,m.crossOrigin);r.d.m(_,{as:typeof m.as=="string"&&m.as!=="script"?m.as:void 0,crossOrigin:S,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0})}else r.d.m(_)},Bn.requestFormReset=function(_){r.d.r(_)},Bn.unstable_batchedUpdates=function(_,m){return _(m)},Bn.useFormState=function(_,m,S){return p.H.useFormState(_,m,S)},Bn.useFormStatus=function(){return p.H.useHostTransitionStatus()},Bn.version="19.3.1",Bn}var Qv;function cb(){if(Qv)return Xd.exports;Qv=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Xd.exports=lb(),Xd.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Jv;function ub(){if(Jv)return Ll;Jv=1;var s=ob(),e=xm(),i=cb();function r(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function u(t){for(var n=t,a=n;a&&!a.alternate;)n=a,(n.flags&4098)!==0&&(t=n.return),a=n.return;for(;n.return;)n=n.return;return n.tag===3?t:null}function d(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function h(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function p(t){if(u(t)!==t)throw Error(r(188))}function g(t){var n=t.alternate;if(!n){if(n=u(t),n===null)throw Error(r(188));return n!==t?null:t}for(var a=t,o=n;;){var c=a.return;if(c===null)break;var f=c.alternate;if(f===null){if(o=c.return,o!==null){a=o;continue}break}if(c.child===f.child){for(f=c.child;f;){if(f===a)return p(c),t;if(f===o)return p(c),n;f=f.sibling}throw Error(r(188))}if(a.return!==o.return)a=c,o=f;else{for(var v=!1,b=c.child;b;){if(b===a){v=!0,a=c,o=f;break}if(b===o){v=!0,o=c,a=f;break}b=b.sibling}if(!v){for(b=f.child;b;){if(b===a){v=!0,a=f,o=c;break}if(b===o){v=!0,o=f,a=c;break}b=b.sibling}if(!v)throw Error(r(189))}}if(a.alternate!==o)throw Error(r(190))}if(a.tag!==3)throw Error(r(188));return a.stateNode.current===a?t:n}function _(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=_(t),n!==null)return n;t=t.sibling}return null}function m(t,n,a,o,c,f){for(;t!==null;){if((t.tag===5||t.tag===27||t.tag===6)&&a(t,o,c,f)||(t.tag!==22||t.memoizedState===null)&&(n||t.tag!==5&&t.tag!==27)&&m(t.child,n,a,o,c,f))return!0;t=t.sibling}return!1}function S(t){for(t=t.return;t!==null;){if(t.tag===3||t.tag===5||t.tag===27)return t;t=t.return}return null}function x(t){var n=!1;for(t=t.return;t!==null&&(t.tag===4&&(n=!0),!(t.tag===3||t.tag===5||t.tag===27));)t=t.return;return n}function E(t){var n=[null,null],a=S(t);return a===null||T(n,t,a.child,{foundSelf:!1}),n}function T(t,n,a,o){for(;a!==null;){if(a===n)o.foundSelf=!0;else if(a.tag===5||a.tag===27||a.tag===6){if(o.foundSelf)return t[1]=a,!0;t[0]=a}else if((a.tag!==22||a.memoizedState===null)&&T(t,n,a.child,o))return!0;a=a.sibling}return!1}function M(t){switch(t.tag){case 5:case 27:case 6:return t.stateNode;case 3:return t.stateNode.containerInfo;default:throw Error(r(559))}}var y=null,U=null;function O(t,n,a){return t===a?!0:t===n?(y=t,!0):!1}function N(t,n,a){return t===a?(U=t,!1):t===n?(U!==null&&(y=t),!0):!1}function G(t){if(t===null)return null;do t=t===null?null:t.return;while(t&&t.tag!==5&&t.tag!==27&&t.tag!==3);return t||null}function F(t,n,a){for(var o=0,c=t;c;c=a(c))o++;c=0;for(var f=n;f;f=a(f))c++;for(;0<o-c;)t=a(t),o--;for(;0<c-o;)n=a(n),c--;for(;o--;){if(t===n||n!==null&&t===n.alternate)return t;t=a(t),n=a(n)}return null}var z=Object.assign,I=Symbol.for("react.element"),D=Symbol.for("react.transitional.element"),A=Symbol.for("react.portal"),B=Symbol.for("react.fragment"),it=Symbol.for("react.strict_mode"),at=Symbol.for("react.profiler"),ft=Symbol.for("react.consumer"),ct=Symbol.for("react.context"),V=Symbol.for("react.forward_ref"),st=Symbol.for("react.suspense"),q=Symbol.for("react.suspense_list"),St=Symbol.for("react.memo"),vt=Symbol.for("react.lazy"),At=Symbol.for("react.activity"),Yt=Symbol.for("react.legacy_hidden"),ie=Symbol.for("react.memo_cache_sentinel"),R=Symbol.for("react.view_transition"),Y=Symbol.for("react.recoverable"),yt=Symbol.iterator;function ht(t){return t===null||typeof t!="object"?null:(t=yt&&t[yt]||t["@@iterator"],typeof t=="function"?t:null)}var Rt=Symbol.for("react.client.reference");function Xt(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===Rt?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case B:return"Fragment";case at:return"Profiler";case it:return"StrictMode";case st:return"Suspense";case q:return"SuspenseList";case At:return"Activity";case R:return"ViewTransition"}if(typeof t=="object")switch(t.$$typeof){case A:return"Portal";case ct:return t.displayName||"Context";case ft:return(t._context.displayName||"Context")+".Consumer";case V:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case St:return n=t.displayName||null,n!==null?n:Xt(t.type)||"Memo";case vt:n=t._payload,t=t._init;try{return Xt(t(n))}catch{}}return null}var Ut=Array.isArray,Ct=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,kt=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,le={pending:!1,data:null,method:null,action:null},H=[],ln=-1;function se(t){return{current:t}}function Jt(t){0>ln||(t.current=H[ln],H[ln]=null,ln--)}function tt(t,n){ln++,H[ln]=t.current,t.current=n}var bt=se(null),Et=se(null),L=se(null),w=se(null);function nt(t,n){switch(tt(L,n),tt(Et,t),tt(bt,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?$0(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=$0(n),t=tv(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}Jt(bt),tt(bt,t)}function pt(){Jt(bt),Jt(Et),Jt(L)}function Mt(t){var n=t.memoizedState;n!==null&&(no._currentValue=n.memoizedState,tt(w,t)),n=bt.current;var a=tv(n,t.type);n!==a&&(tt(Et,t),tt(bt,a))}function mt(t){Et.current===t&&(Jt(bt),Jt(Et)),w.current===t&&(Jt(w),no._currentValue=le)}var Zt,Bt;function Ht(t){if(Zt===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);Zt=n&&n[1]||"",Bt=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Zt+t+Bt}var xe=!1;function wt(t,n){if(!t||xe)return"";xe=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var _t=function(){throw Error()};if(Object.defineProperty(_t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(_t,[])}catch(zt){var W=zt}Reflect.construct(t,[],_t)}else{try{_t.call()}catch(zt){W=zt}_t=!1;try{var rt=Object.getOwnPropertyDescriptor(t.prototype,"props");Object.defineProperty(t.prototype,"props",{configurable:!0,set:function(){throw Error()}}),_t=!0,new t}finally{_t&&(rt!==void 0?Object.defineProperty(t.prototype,"props",rt):delete t.prototype.props)}}}else{try{throw Error()}catch(zt){W=zt}(_t=t())&&typeof _t.catch=="function"&&_t.catch(function(){})}}catch(zt){if(zt&&W&&typeof zt.stack=="string")return[zt.stack,W.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=o.DetermineComponentFrameRoot(),v=f[0],b=f[1];if(v&&b){var P=v.split(`
`),Q=b.split(`
`);for(c=o=0;o<P.length&&!P[o].includes("DetermineComponentFrameRoot");)o++;for(;c<Q.length&&!Q[c].includes("DetermineComponentFrameRoot");)c++;if(o===P.length||c===Q.length)for(o=P.length-1,c=Q.length-1;1<=o&&0<=c&&P[o]!==Q[c];)c--;for(;1<=o&&0<=c;o--,c--)if(P[o]!==Q[c]){if(o!==1||c!==1)do if(o--,c--,0>c||P[o]!==Q[c]){var ot=`
`+P[o].replace(" at new "," at ");return t.displayName&&ot.includes("<anonymous>")&&(ot=ot.replace("<anonymous>",t.displayName)),ot}while(1<=o&&0<=c);break}}}finally{xe=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?Ht(a):""}function Wt(t,n){switch(t.tag){case 26:case 27:case 5:return Ht(t.type);case 16:return Ht("Lazy");case 13:return t.child!==n&&n!==null?Ht("Suspense Fallback"):Ht("Suspense");case 19:return Ht("SuspenseList");case 0:case 15:return wt(t.type,!1);case 11:return wt(t.type.render,!1);case 1:return wt(t.type,!0);case 31:return Ht("Activity");case 30:return Ht("ViewTransition");default:return""}}function ee(t){try{var n="",a=null;do n+=Wt(t,a),a=t,t=t.return;while(t);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var re=Object.prototype.hasOwnProperty,jt=s.unstable_scheduleCallback,ye=s.unstable_cancelCallback,he=s.unstable_shouldYield,He=s.unstable_requestPaint,X=s.unstable_now,It=s.unstable_getCurrentPriorityLevel,dt=s.unstable_ImmediatePriority,xt=s.unstable_UserBlockingPriority,Ft=s.unstable_NormalPriority,Gt=s.unstable_LowPriority,ue=s.unstable_IdlePriority,tn=s.log,En=s.unstable_setDisableYieldValue,Re=null,Qe=null;function bn(t){if(typeof tn=="function"&&En(t),Qe&&typeof Qe.setStrictMode=="function")try{Qe.setStrictMode(Re,t)}catch{}}var Gn=Math.clz32?Math.clz32:Go,ec=Math.log,ha=Math.LN2;function Go(t){return t>>>=0,t===0?32:31-(ec(t)/ha|0)|0}var Ur=256,zr=262144,da=4194304;function Zi(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&-t;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function pa(t,n,a){var o=t.pendingLanes;if(o===0)return 0;var c=0,f=t.suspendedLanes,v=t.pingedLanes;t=t.warmLanes;var b=o&134217727;return b!==0?(o=b&~f,o!==0?c=Zi(o):(v&=b,v!==0?c=Zi(v):a||(a=b&~t,a!==0&&(c=Zi(a))))):(b=o&~f,b!==0?c=Zi(b):v!==0?c=Zi(v):a||(a=o&~t,a!==0&&(c=Zi(a)))),c===0?0:n!==0&&n!==c&&(n&f)===0&&(f=c&-c,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:c}function Xa(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Vo(t,n){(n&8)!==0&&(n|=n&32);var a=t.entangledLanes;if(a!==0)for(t=t.entanglements,a&=n;0<a;){var o=31-Gn(a),c=1<<o;n|=t[o],a&=~c}return n}function pf(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function nc(){var t=da;return da<<=1,(da&62914560)===0&&(da=4194304),t}function jo(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function Lr(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function mf(t,n,a,o,c,f){var v=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var b=t.entanglements,P=t.expirationTimes,Q=t.hiddenUpdates;for(a=v&~a;0<a;){var ot=31-Gn(a),_t=1<<ot;b[ot]=0,P[ot]=-1;var W=Q[ot];if(W!==null)for(Q[ot]=null,ot=0;ot<W.length;ot++){var rt=W[ot];rt!==null&&(rt.lane&=-536870913)}a&=~_t}o!==0&&ic(t,o,0),f!==0&&c===0&&t.tag!==0&&(t.suspendedLanes|=f&~(v&~n))}function ic(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var o=31-Gn(n);t.entangledLanes|=n,t.entanglements[o]=t.entanglements[o]|1073741824|a&261930}function C(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var o=31-Gn(a),c=1<<o;c&n|t[o]&n&&(t[o]|=n),a&=~c}}function J(t,n){var a=n&-n;return a=(a&42)!==0?1:lt(a),(a&(t.suspendedLanes|n))!==0?0:a}function lt(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function ut(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function $(){var t=kt.p;return t!==0?t:(t=window.event,t===void 0?32:Bv(t.type))}function Tt(t,n){var a=kt.p;try{return kt.p=t,n()}finally{kt.p=a}}var Nt=Math.random().toString(36).slice(2),Dt="__reactFiber$"+Nt,Ot="__reactProps$"+Nt,ne="__reactContainer$"+Nt,oe="__reactEvents$"+Nt,$t="__reactListeners$"+Nt,Ce="__reactHandles$"+Nt,Ne="__reactResources$"+Nt,qe="__reactMarker$"+Nt,je="__reactLoad$"+Nt;function Me(t){delete t[Dt],delete t[Ot],delete t[$t],delete t[Ce]}function Kt(t){var n;if(n=t[Dt])return n;for(var a=t.parentNode;a;){if(n=a[ne]||a[Dt]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=_v(t);t!==null;){if(a=t[Dt])return a;t=_v(t)}return n}t=a,a=t.parentNode}return null}function en(t){if(t=t[Dt]||t[ne]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function Te(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(r(33))}function Tn(t){var n=t[Ne];return n||(n=t[Ne]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function Je(t){t[qe]=!0}function Vn(t){t[je]=void 0}var Ya=new Set,Xe={};function un(t,n){_n(t,n),_n(t+"Capture",n)}function _n(t,n){for(Xe[t]=n,t=0;t<n.length;t++)Ya.add(n[t])}var Dn=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Nn={},ys={};function ma(t){return re.call(ys,t)?!0:re.call(Nn,t)?!1:Dn.test(t)?ys[t]=!0:(Nn[t]=!0,!1)}var Ue=!1;function Fm(){var t=Ue;return Ue=!1,t}function ac(t,n,a){if(ma(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,a)}}function rc(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,a)}}function ga(t,n,a,o){if(o===null)t.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,o)}}function li(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Hm(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Ex(t,n,a){var o=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var c=o.get,f=o.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return c.call(this)},set:function(v){a=""+v,f.call(this,v)}}),Object.defineProperty(t,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(v){a=""+v},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function gf(t){if(!t._valueTracker){var n=Hm(t)?"checked":"value";t._valueTracker=Ex(t,n,""+t[n])}}function km(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return t&&(o=Hm(t)?t.checked?"true":"false":t.value),t=o,t!==a?(n.setValue(t),!0):!1}var bx=/[\n"\\]/g;function xi(t){return t.replace(bx,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function _f(t,n,a,o,c,f,v,b){t.name="",v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"?t.type=v:t.removeAttribute("type"),n!=null?v==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+li(n)):t.value!==""+li(n)&&(t.value=""+li(n)):v!=="submit"&&v!=="reset"||t.removeAttribute("value"),n!=null?v==="number"&&t.value==n?vf(t,li(t.value)):vf(t,li(n)):a!=null?vf(t,li(a)):o!=null&&t.removeAttribute("value"),c==null&&f!=null&&(t.defaultChecked=!!f),c!=null&&(t.checked=c&&typeof c!="function"&&typeof c!="symbol"),b!=null&&typeof b!="function"&&typeof b!="symbol"&&typeof b!="boolean"?t.name=""+li(b):t.removeAttribute("name")}function Gm(t,n,a,o,c,f,v,b){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(t.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){gf(t);return}a=a!=null?""+li(a):"",n=n!=null?""+li(n):a,b||n===t.value||(t.value=n),t.defaultValue=n}o=o??c,o=typeof o!="function"&&typeof o!="symbol"&&!!o,t.checked=b?t.checked:!!o,t.defaultChecked=!!o,v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"&&(t.name=v),gf(t)}function vf(t,n){t.defaultValue!==""+n&&(t.defaultValue=""+n)}function Ss(t,n,a,o){if(t=t.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<t.length;a++)c=n.hasOwnProperty("$"+t[a].value),t[a].selected!==c&&(t[a].selected=c),c&&o&&(t[a].defaultSelected=!0)}else{for(a=""+li(a),n=null,c=0;c<t.length;c++){if(t[c].value===a){t[c].selected=!0,o&&(t[c].defaultSelected=!0);return}n!==null||t[c].disabled||(n=t[c])}n!==null&&(n.selected=!0)}}function Vm(t,n,a){if(n!=null&&(n=""+li(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+li(a):""}function jm(t,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(r(92));if(Ut(o)){if(1<o.length)throw Error(r(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=li(n),t.defaultValue=a,o=t.textContent,o===a&&o!==""&&o!==null&&(t.value=o),gf(t)}function xs(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var Tx=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Xm(t,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":o?t.setProperty(n,a):typeof a!="number"||a===0||Tx.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function Ym(t,n,a){if(n!=null&&typeof n!="object")throw Error(r(62));if(t=t.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?t.setProperty(o,""):o==="float"?t.cssFloat="":t[o]="",Ue=!0);for(var c in n)o=n[c],n.hasOwnProperty(c)&&a[c]!==o&&(Xm(t,c,o),Ue=!0)}else for(var f in n)n.hasOwnProperty(f)&&Xm(t,f,n[f])}function yf(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var wx=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Ax=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function sc(t){return Ax.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function Ki(){}var Sf=null;function xf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Ms=null,Es=null;function Wm(t){var n=en(t);if(n&&(t=n.stateNode)){var a=t[Ot]||null;t:switch(t=n.stateNode,n.type){case"input":if(_f(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+xi(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==t&&o.form===t.form){var c=o[Ot]||null;if(!c)throw Error(r(90));_f(o,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===t.form&&km(o)}break t;case"textarea":Vm(t,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&Ss(t,!!a.multiple,n,!1)}}}var Mf=!1;function qm(t,n,a){if(Mf)return t(n,a);Mf=!0;try{var o=t(n);return o}finally{if(Mf=!1,(Ms!==null||Es!==null)&&(su(),Ms&&(n=Ms,t=Es,Es=Ms=null,Wm(n),t)))for(n=0;n<t.length;n++)Wm(t[n])}}function Xo(t,n){var a=t.stateNode;if(a===null)return null;var o=a[Ot]||null;if(o===null)return null;a=o[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(t=t.type,o=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!o;break t;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(r(231,n,typeof a));return a}var _a=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ef=!1;if(_a)try{var Yo={};Object.defineProperty(Yo,"passive",{get:function(){Ef=!0}}),window.addEventListener("test",Yo,Yo),window.removeEventListener("test",Yo,Yo)}catch{Ef=!1}var Wa=null,bf=null,oc=null;function Zm(){if(oc)return oc;var t,n=bf,a=n.length,o,c="value"in Wa?Wa.value:Wa.textContent,f=c.length;for(t=0;t<a&&n[t]===c[t];t++);var v=a-t;for(o=1;o<=v&&n[a-o]===c[f-o];o++);return oc=c.slice(t,1<o?1-o:void 0)}function lc(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function cc(){return!0}function Km(){return!1}function Wn(t){function n(a,o,c,f,v){this._reactName=a,this._targetInst=c,this.type=o,this.nativeEvent=f,this.target=v,this.currentTarget=null;for(var b in t)t.hasOwnProperty(b)&&(a=t[b],this[b]=a?a(f):f[b]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?cc:Km,this.isPropagationStopped=Km,this}return z(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=cc)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=cc)},persist:function(){},isPersistent:cc}),n}var qa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},uc=Wn(qa),Wo=z({},qa,{view:0,detail:0}),Rx=Wn(Wo),Tf,wf,qo,fc=z({},Wo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Rf,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==qo&&(qo&&t.type==="mousemove"?(Tf=t.screenX-qo.screenX,wf=t.screenY-qo.screenY):wf=Tf=0,qo=t),Tf)},movementY:function(t){return"movementY"in t?t.movementY:wf}}),Qm=Wn(fc),Cx=z({},fc,{dataTransfer:0}),Dx=Wn(Cx),Nx=z({},Wo,{relatedTarget:0}),Af=Wn(Nx),Ux=z({},qa,{animationName:0,elapsedTime:0,pseudoElement:0}),zx=Wn(Ux),Lx=z({},qa,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Ox=Wn(Lx),Px=z({},qa,{data:0}),Jm=Wn(Px),Bx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ix={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Fx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Hx(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=Fx[t])?!!n[t]:!1}function Rf(){return Hx}var kx=z({},Wo,{key:function(t){if(t.key){var n=Bx[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=lc(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Ix[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Rf,charCode:function(t){return t.type==="keypress"?lc(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?lc(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Gx=Wn(kx),Vx=z({},fc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),$m=Wn(Vx),jx=z({},qa,{submitter:0}),Xx=Wn(jx),Yx=z({},Wo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Rf}),Wx=Wn(Yx),qx=z({},qa,{propertyName:0,elapsedTime:0,pseudoElement:0}),Zx=Wn(qx),Kx=z({},fc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Qx=Wn(Kx),Jx=z({},qa,{newState:0,oldState:0,source:0}),$x=Wn(Jx),tM=[9,13,27,32],Cf=_a&&"CompositionEvent"in window,Zo=null;_a&&"documentMode"in document&&(Zo=document.documentMode);var eM=_a&&"TextEvent"in window&&!Zo,tg=_a&&(!Cf||Zo&&8<Zo&&11>=Zo),eg=" ",ng=!1;function ig(t,n){switch(t){case"keyup":return tM.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ag(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var bs=!1;function nM(t,n){switch(t){case"compositionend":return ag(n);case"keypress":return n.which!==32?null:(ng=!0,eg);case"textInput":return t=n.data,t===eg&&ng?null:t;default:return null}}function iM(t,n){if(bs)return t==="compositionend"||!Cf&&ig(t,n)?(t=Zm(),oc=bf=Wa=null,bs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return tg&&n.locale!=="ko"?null:n.data;default:return null}}var aM={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function rg(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!aM[t.type]:n==="textarea"}function sg(t,n,a,o){Ms?Es?Es.push(o):Es=[o]:Ms=o,n=hu(n,"onChange"),0<n.length&&(a=new uc("onChange","change",null,a,o),t.push({event:a,listeners:n}))}var Ko=null,Qo=null;function rM(t){W0(t,0)}function hc(t){var n=Te(t);if(km(n))return t}function og(t,n){if(t==="change")return n}var lg=!1;if(_a){var Df;if(_a){var Nf="oninput"in document;if(!Nf){var cg=document.createElement("div");cg.setAttribute("oninput","return;"),Nf=typeof cg.oninput=="function"}Df=Nf}else Df=!1;lg=Df&&(!document.documentMode||9<document.documentMode)}function ug(){Ko&&(Ko.detachEvent("onpropertychange",fg),Qo=Ko=null)}function fg(t){if(t.propertyName==="value"&&hc(Qo)){var n=[];sg(n,Qo,t,xf(t)),qm(rM,n)}}function sM(t,n,a){t==="focusin"?(ug(),Ko=n,Qo=a,Ko.attachEvent("onpropertychange",fg)):t==="focusout"&&ug()}function oM(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return hc(Qo)}function lM(t,n){if(t==="click")return hc(n)}function cM(t,n){if(t==="input"||t==="change")return hc(n)}function uM(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var ci=typeof Object.is=="function"?Object.is:uM;function Jo(t,n){if(ci(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var c=a[o];if(!re.call(n,c)||!ci(t[c],n[c]))return!1}return!0}function Uf(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function hg(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function dg(t,n){var a=hg(t);t=0;for(var o;a;){if(a.nodeType===3){if(o=t+a.textContent.length,t<=n&&o>=n)return{node:a,offset:n-t};t=o}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=hg(a)}}function pg(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?pg(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function mg(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=Uf(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=Uf(t.document)}return n}function zf(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var fM=_a&&"documentMode"in document&&11>=document.documentMode,Ts=null,Lf=null,$o=null,Of=!1;function gg(t,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Of||Ts==null||Ts!==Uf(o)||(o=Ts,"selectionStart"in o&&zf(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),$o&&Jo($o,o)||($o=o,o=hu(Lf,"onSelect"),0<o.length&&(n=new uc("onSelect","select",null,n,a),t.push({event:n,listeners:o}),n.target=Ts)))}function Or(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var ws={animationend:Or("Animation","AnimationEnd"),animationiteration:Or("Animation","AnimationIteration"),animationstart:Or("Animation","AnimationStart"),transitionrun:Or("Transition","TransitionRun"),transitionstart:Or("Transition","TransitionStart"),transitioncancel:Or("Transition","TransitionCancel"),transitionend:Or("Transition","TransitionEnd")},Pf={},_g={};_a&&(_g=document.createElement("div").style,"AnimationEvent"in window||(delete ws.animationend.animation,delete ws.animationiteration.animation,delete ws.animationstart.animation),"TransitionEvent"in window||delete ws.transitionend.transition);function Pr(t){if(Pf[t])return Pf[t];if(!ws[t])return t;var n=ws[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in _g)return Pf[t]=n[a];return t}var vg=Pr("animationend"),yg=Pr("animationiteration"),Sg=Pr("animationstart"),hM=Pr("transitionrun"),dM=Pr("transitionstart"),pM=Pr("transitioncancel"),xg=Pr("transitionend"),Mg=new Map,Bf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Bf.push("scrollEnd");function Oi(t,n){Mg.set(t,n),un(n,[t])}var mM=0;function va(t,n){if(t.name!=null&&t.name!=="auto")return t.name;if(n.autoName!==null)return n.autoName;t=Fi.identifierPrefix;var a=mM++;return t="_"+t+"t_"+a.toString(32)+"_",n.autoName=t}function Eg(t){if(t==null||typeof t=="string")return t;var n=null,a=Ys;if(a!==null)for(var o=0;o<a.length;o++){var c=t[a[o]];if(c!=null){if(c==="none")return"none";n=n==null?c:n+(" "+c)}}return n??t.default}function ya(t,n){return t=Eg(t),n=Eg(n),n==null?t==="auto"?null:t:n==="auto"?null:n}var dc=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},Mi=[],As=0,If=0;function pc(){for(var t=As,n=If=As=0;n<t;){var a=Mi[n];Mi[n++]=null;var o=Mi[n];Mi[n++]=null;var c=Mi[n];Mi[n++]=null;var f=Mi[n];if(Mi[n++]=null,o!==null&&c!==null){var v=o.pending;v===null?c.next=c:(c.next=v.next,v.next=c),o.pending=c}f!==0&&bg(a,c,f)}}function mc(t,n,a,o){Mi[As++]=t,Mi[As++]=n,Mi[As++]=a,Mi[As++]=o,If|=o,t.lanes|=o,t=t.alternate,t!==null&&(t.lanes|=o)}function Ff(t,n,a,o){return mc(t,n,a,o),gc(t)}function Br(t,n){return mc(t,null,null,n),gc(t)}function bg(t,n,a){t.lanes|=a;var o=t.alternate;o!==null&&(o.lanes|=a);for(var c=!1,f=t.return;f!==null;)f.childLanes|=a,o=f.alternate,o!==null&&(o.childLanes|=a),f.tag===22&&(t=f.stateNode,t===null||t._visibility&1||(c=!0)),t=f,f=f.return;return t.tag===3?(f=t.stateNode,c&&n!==null&&(c=31-Gn(a),t=f.hiddenUpdates,o=t[c],o===null?t[c]=[n]:o.push(n),n.lane=a|536870912),f):null}function gc(t){if(50<xl)throw xl=0,ru=null,Error(r(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var Rs={};function gM(t,n,a,o){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function $n(t,n,a,o){return new gM(t,n,a,o)}function Hf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Sa(t,n){var a=t.alternate;return a===null?(a=$n(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&1206910976,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function Tg(t,n){t.flags&=1206910978;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function _c(t,n,a,o,c,f){var v=0;if(o=t,typeof o=="function")Hf(o)&&(v=1);else if(typeof o=="string")v=jE(t,a,bt.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(o){case At:return t=$n(31,a,n,c),t.elementType=At,t.lanes=f,t;case B:return Ir(a.children,c,f,n);case it:v=8,c|=24;break;case at:return t=$n(12,a,n,c|2),t.elementType=at,t.lanes=f,t;case st:return t=$n(13,a,n,c),t.elementType=st,t.lanes=f,t;case q:return t=$n(19,a,n,c),t.elementType=q,t.lanes=f,t;case Yt:case R:return t=c|32,t=$n(30,a,n,t),t.elementType=R,t.lanes=f,t.stateNode={autoName:null,paired:null,clones:null,ref:null},t;default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case ct:v=10;break t;case ft:v=9;break t;case V:v=11;break t;case St:v=14;break t;case vt:v=16,o=null;break t}v=29,a=Error(r(130,t===null?"null":typeof t,"")),o=null}return n=$n(v,a,n,c),n.elementType=t,n.type=o,n.lanes=f,n}function Ir(t,n,a,o){return t=$n(7,t,o,n),t.lanes=a,t}function kf(t,n,a){return t=$n(6,t,null,n),t.lanes=a,t}function wg(t){var n=$n(18,null,null,0);return n.stateNode=t,n}function Gf(t,n,a){return n=$n(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var Ag=new WeakMap;function Ei(t,n){if(typeof t=="object"&&t!==null){var a=Ag.get(t);return a!==void 0?a:(n={value:t,source:n,stack:ee(n)},Ag.set(t,n),n)}return{value:t,source:n,stack:ee(n)}}var Cs=[],Ds=0,vc=null,tl=0,bi=[],Ti=0,Za=null,Qi=1,Ji="";function xa(t,n){Cs[Ds++]=tl,Cs[Ds++]=vc,vc=t,tl=n}function Rg(t,n,a){bi[Ti++]=Qi,bi[Ti++]=Ji,bi[Ti++]=Za,Za=t;var o=Qi;t=Ji;var c=32-Gn(o)-1;o&=~(1<<c),a+=1;var f=32-Gn(n)+c;if(30<f){var v=c-c%5;f=(o&(1<<v)-1).toString(32),o>>=v,c-=v,Qi=1<<32-Gn(n)+c|a<<c|o,Ji=f+t}else Qi=1<<f|a<<c|o,Ji=t}function yc(t){t.return!==null&&(xa(t,1),Rg(t,1,0))}function Vf(t){for(;t===vc;)vc=Cs[--Ds],Cs[Ds]=null,tl=Cs[--Ds],Cs[Ds]=null;for(;t===Za;)Za=bi[--Ti],bi[Ti]=null,Ji=bi[--Ti],bi[Ti]=null,Qi=bi[--Ti],bi[Ti]=null}function Cg(t,n){bi[Ti++]=Qi,bi[Ti++]=Ji,bi[Ti++]=Za,Qi=n.id,Ji=n.overflow,Za=t}var wn=null,Ze=null,_e=!1,Ka=null,wi=!1,jf=Error(r(519));function Qa(t){var n=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw el(Ei(n,t)),jf}function Dg(t){var n=t.stateNode,a=t.type,o=t.memoizedProps;switch(n[Dt]=t,n[Ot]=o,a){case"dialog":be("cancel",n),be("close",n);break;case"iframe":case"object":case"embed":be("load",n);break;case"video":case"audio":for(a=0;a<El.length;a++)be(El[a],n);break;case"source":be("error",n);break;case"img":case"image":case"link":be("error",n),be("load",n);break;case"details":be("toggle",n);break;case"input":be("invalid",n),Gm(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":be("invalid",n);break;case"textarea":be("invalid",n),jm(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||Q0(n.textContent,a)?(o.popover!=null&&(be("beforetoggle",n),be("toggle",n)),o.onScroll!=null&&be("scroll",n),o.onScrollEnd!=null&&be("scrollend",n),o.onClick!=null&&(n.onclick=Ki),n=!0):n=!1,n||Qa(t,!0)}function Sc(t){for(wn=t.return;wn;)switch(wn.tag){case 5:case 31:case 13:wi=!1;return;case 27:case 3:wi=!0;return;default:wn=wn.return}}function Ns(t){if(t!==wn)return!1;if(!_e)return Sc(t),_e=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||Sd(t.type,t.memoizedProps)),a=!a),a&&Ze&&Qa(t),Sc(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Ze=gv(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Ze=gv(t)}else n===27?(n=Ze,dr(t.type)?(t=Cd,Cd=null,Ze=t):Ze=n):Ze=wn?Ri(t.stateNode.nextSibling):null;return!0}function Fr(){Ze=wn=null,_e=!1}function Xf(){var t=Ka;return t!==null&&(ni===null?ni=t:ni.push.apply(ni,t),Ka=null),t}function el(t){Ka===null?Ka=[t]:Ka.push(t)}var Yf=se(null),Hr=null,Ma=null;function Ja(t,n,a){tt(Yf,n._currentValue),n._currentValue=a}function Ea(t){t._currentValue=Yf.current,Jt(Yf)}function xc(t,n,a){for(;t!==null;){var o=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),t===a)break;t=t.return}}function Wf(t,n,a,o){var c=t.child;for(c!==null&&(c.return=t);c!==null;){var f=c.dependencies;if(f!==null){var v=c.child;f=f.firstContext;t:for(;f!==null;){var b=f;f=c;for(var P=0;P<n.length;P++)if(b.context===n[P]){f.lanes|=a,b=f.alternate,b!==null&&(b.lanes|=a),xc(f.return,a,t),o||(v=null);break t}f=b.next}}else if(c.tag===18){if(v=c.return,v===null)throw Error(r(341));v.lanes|=a,f=v.alternate,f!==null&&(f.lanes|=a),xc(v,a,t),v=null}else c.tag===13&&c.memoizedState!==null&&c.memoizedState.dehydrated===null?(c.lanes|=a,v=c.alternate,v!==null&&(v.lanes|=a),xc(c.return,a,t),v=c.child,v=v!==null?v.sibling:null):v=c.child;if(v!==null)v.return=c;else for(v=c;v!==null;){if(v===t){v=null;break}if(c=v.sibling,c!==null){c.return=v.return,v=c;break}v=v.return}c=v}}function kr(t,n,a,o){t=null;for(var c=n,f=!1;c!==null;){if(!f){if((c.flags&524288)!==0)f=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var v=c.alternate;if(v===null)throw Error(r(387));if(v=v.memoizedProps,v!==null){var b=c.type;ci(c.pendingProps.value,v.value)||(t!==null?t.push(b):t=[b])}}else if(c===w.current){if(v=c.alternate,v===null)throw Error(r(387));v.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(t!==null?t.push(no):t=[no])}c=c.return}return t!==null&&Wf(n,t,a,o),n.flags|=262144,t!==null}function Mc(t){for(t=t.firstContext;t!==null;){if(!ci(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function Gr(t){Hr=t,Ma=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Un(t){return Ng(Hr,t)}function Ec(t,n){return Hr===null&&Gr(t),Ng(t,n)}function Ng(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},Ma===null){if(t===null)throw Error(r(308));Ma=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else Ma=Ma.next=n;return a}var _M=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,o){t.push(o)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},vM=s.unstable_scheduleCallback,yM=s.unstable_NormalPriority,fn={$$typeof:ct,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function qf(){return{controller:new _M,data:new Map,refCount:0}}function nl(t){t.refCount--,t.refCount===0&&vM(yM,function(){t.controller.abort()})}function Ug(t,n){if((t.pendingLanes&4194048)!==0){var a=t.transitionTypes;for(a===null&&(a=t.transitionTypes=[]),t=0;t<n.length;t++){var o=n[t];a.indexOf(o)===-1&&a.push(o)}}}var il=null;function SM(t){var n=t.transitionTypes;return t.transitionTypes=null,n}var al=null,Zf=0,Vr=0,Us=null;function xM(t,n){if(al===null){var a=al=[];Zf=0,Vr=fd(),Us={status:"pending",value:void 0,then:function(o){a.push(o)}}}return Zf++,n.then(zg,zg),n}function zg(){if(--Zf===0&&(il=null,al!==null)){Us!==null&&(Us.status="fulfilled");var t=al;al=null,Vr=0,Us=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function MM(t,n){var a=[],o={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return t.then(function(){o.status="fulfilled",o.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(o.status="rejected",o.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),o}var Lg=Ct.S;Ct.S=function(t,n){if(w0=X(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&xM(t,n),il!==null)for(var a=Ks;a!==null;)Ug(a,il),a=a.next;if(a=t.types,a!==null){for(var o=Ks;o!==null;)Ug(o,a),o=o.next;if(Vr!==0){o=il,o===null&&(o=il=[]);for(var c=0;c<a.length;c++){var f=a[c];o.indexOf(f)===-1&&o.push(f)}}}Lg!==null&&Lg(t,n)};var jr=se(null);function Kf(){var t=jr.current;return t!==null?t:Ye.pooledCache}function bc(t,n){n===null?tt(jr,jr.current):tt(jr,n.pool)}function Og(){var t=Kf();return t===null?null:{parent:fn._currentValue,pool:t}}var zs=Error(r(460)),Qf=Error(r(474)),Tc=Error(r(542)),wc={then:function(){}};function Pg(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Bg(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(Ki,Ki),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Fg(t),t===void 0&&!("reason"in n)?Error(r(600)):t;default:if(typeof n.status=="string")n.then(Ki,Ki);else{if(t=Ye,t!==null&&100<t.shellSuspendCounter)throw Error(r(482));t=n,t.status="pending",t.then(function(o){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=o}},function(o){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Fg(t),t}throw Yr=n,zs}}function Xr(t){try{var n=t._init;return n(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Yr=a,zs):a}}var Yr=null;function Ig(){if(Yr===null)throw Error(r(459));var t=Yr;return Yr=null,t}function Fg(t){if(t===zs||t===Tc)throw Error(r(483))}var Ls=null,rl=0;function Ac(t){var n=rl;return rl+=1,Ls===null&&(Ls=[]),Bg(Ls,t,n)}function $a(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function Rc(t,n){throw n.$$typeof===I?Error(r(525)):(t=Object.prototype.toString.call(n),Error(r(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function Hg(t){function n(K,k){if(t){var et=K.deletions;et===null?(K.deletions=[k],K.flags|=16):et.push(k)}}function a(K,k){if(!t)return null;for(;k!==null;)n(K,k),k=k.sibling;return null}function o(K){for(var k=new Map;K!==null;)K.key===null?k.set(K.index,K):k.set(K.key,K),K=K.sibling;return k}function c(K,k){return K=Sa(K,k),K.index=0,K.sibling=null,K}function f(K,k,et){return K.index=et,t?(et=K.alternate,et!==null?(et=et.index,et<k?(K.flags|=2,k):et):(K.flags|=134217730,k)):(K.flags|=1048576,k)}function v(K){return t&&K.alternate===null&&(K.flags|=134217730),K}function b(K,k,et,gt){return k===null||k.tag!==6?(k=kf(et,K.mode,gt),k.return=K,k):(k=c(k,et),k.return=K,k)}function P(K,k,et,gt){var Vt=et.type;return Vt===B?(K=ot(K,k,et.props.children,gt,et.key),$a(K,et),K):k!==null&&(k.elementType===Vt||typeof Vt=="object"&&Vt!==null&&Vt.$$typeof===vt&&Xr(Vt)===k.type)?(k=c(k,et.props),$a(k,et),k.return=K,k):(k=_c(et.type,et.key,et.props,null,K.mode,gt),$a(k,et),k.return=K,k)}function Q(K,k,et,gt){return k===null||k.tag!==4||k.stateNode.containerInfo!==et.containerInfo||k.stateNode.implementation!==et.implementation?(k=Gf(et,K.mode,gt),k.return=K,k):(k=c(k,et.children||[]),k.return=K,k)}function ot(K,k,et,gt,Vt){return k===null||k.tag!==7?(k=Ir(et,K.mode,gt,Vt),k.return=K,k):(k=c(k,et),k.return=K,k)}function _t(K,k,et){if(typeof k=="string"&&k!==""||typeof k=="number"||typeof k=="bigint")return k=kf(""+k,K.mode,et),k.return=K,k;if(typeof k=="object"&&k!==null){switch(k.$$typeof){case D:return et=_c(k.type,k.key,k.props,null,K.mode,et),$a(et,k),et.return=K,et;case A:return k=Gf(k,K.mode,et),k.return=K,k;case vt:return k=Xr(k),_t(K,k,et)}if(Ut(k)||ht(k))return k=Ir(k,K.mode,et,null),k.return=K,k;if(typeof k.then=="function")return _t(K,Ac(k),et);if(k.$$typeof===ct)return _t(K,Ec(K,k),et);Rc(K,k)}return null}function W(K,k,et,gt){var Vt=k!==null?k.key:null;if(typeof et=="string"&&et!==""||typeof et=="number"||typeof et=="bigint")return Vt!==null?null:b(K,k,""+et,gt);if(typeof et=="object"&&et!==null){switch(et.$$typeof){case D:return et.key===Vt?P(K,k,et,gt):null;case A:return et.key===Vt?Q(K,k,et,gt):null;case vt:return et=Xr(et),W(K,k,et,gt)}if(Ut(et)||ht(et))return Vt!==null?null:ot(K,k,et,gt,null);if(typeof et.then=="function")return W(K,k,Ac(et),gt);if(et.$$typeof===ct)return W(K,k,Ec(K,et),gt);Rc(K,et)}return null}function rt(K,k,et,gt,Vt){if(typeof gt=="string"&&gt!==""||typeof gt=="number"||typeof gt=="bigint")return K=K.get(et)||null,b(k,K,""+gt,Vt);if(typeof gt=="object"&&gt!==null){switch(gt.$$typeof){case D:return K=K.get(gt.key===null?et:gt.key)||null,P(k,K,gt,Vt);case A:return K=K.get(gt.key===null?et:gt.key)||null,Q(k,K,gt,Vt);case vt:return gt=Xr(gt),rt(K,k,et,gt,Vt)}if(Ut(gt)||ht(gt))return K=K.get(et)||null,ot(k,K,gt,Vt,null);if(typeof gt.then=="function")return rt(K,k,et,Ac(gt),Vt);if(gt.$$typeof===ct)return rt(K,k,et,Ec(k,gt),Vt);Rc(k,gt)}return null}function zt(K,k,et,gt){for(var Vt=null,Ae=null,Qt=k,ae=k=0,pn=null;Qt!==null&&ae<et.length;ae++){Qt.index>ae?(pn=Qt,Qt=null):pn=Qt.sibling;var De=W(K,Qt,et[ae],gt);if(De===null){Qt===null&&(Qt=pn);break}t&&Qt&&De.alternate===null&&n(K,Qt),k=f(De,k,ae),Ae===null?Vt=De:Ae.sibling=De,Ae=De,Qt=pn}if(ae===et.length)return a(K,Qt),_e&&xa(K,ae),Vt;if(Qt===null){for(;ae<et.length;ae++)Qt=_t(K,et[ae],gt),Qt!==null&&(k=f(Qt,k,ae),Ae===null?Vt=Qt:Ae.sibling=Qt,Ae=Qt);return _e&&xa(K,ae),Vt}for(Qt=o(Qt);ae<et.length;ae++)pn=rt(Qt,K,ae,et[ae],gt),pn!==null&&(t&&(De=pn.alternate,De!==null&&Qt.delete(De.key===null?ae:De.key)),k=f(pn,k,ae),Ae===null?Vt=pn:Ae.sibling=pn,Ae=pn);return t&&Qt.forEach(function(vr){return n(K,vr)}),_e&&xa(K,ae),Vt}function qt(K,k,et,gt){if(et==null)throw Error(r(151));for(var Vt=null,Ae=null,Qt=k,ae=k=0,pn=null,De=et.next();Qt!==null&&!De.done;ae++,De=et.next()){Qt.index>ae?(pn=Qt,Qt=null):pn=Qt.sibling;var vr=W(K,Qt,De.value,gt);if(vr===null){Qt===null&&(Qt=pn);break}t&&Qt&&vr.alternate===null&&n(K,Qt),k=f(vr,k,ae),Ae===null?Vt=vr:Ae.sibling=vr,Ae=vr,Qt=pn}if(De.done)return a(K,Qt),_e&&xa(K,ae),Vt;if(Qt===null){for(;!De.done;ae++,De=et.next())De=_t(K,De.value,gt),De!==null&&(k=f(De,k,ae),Ae===null?Vt=De:Ae.sibling=De,Ae=De);return _e&&xa(K,ae),Vt}for(Qt=o(Qt);!De.done;ae++,De=et.next())De=rt(Qt,K,ae,De.value,gt),De!==null&&(t&&(pn=De.alternate,pn!==null&&Qt.delete(pn.key===null?ae:pn.key)),k=f(De,k,ae),Ae===null?Vt=De:Ae.sibling=De,Ae=De);return t&&Qt.forEach(function(nb){return n(K,nb)}),_e&&xa(K,ae),Vt}function pe(K,k,et,gt){if(typeof et=="object"&&et!==null&&et.type===B&&et.key===null&&et.props.ref===void 0&&(et=et.props.children),typeof et=="object"&&et!==null){switch(et.$$typeof){case D:t:{for(var Vt=et.key;k!==null;){if(k.key===Vt){if(Vt=et.type,Vt===B){if(k.tag===7){a(K,k.sibling),gt=c(k,et.props.children),$a(gt,et),gt.return=K,K=gt;break t}}else if(k.elementType===Vt||typeof Vt=="object"&&Vt!==null&&Vt.$$typeof===vt&&Xr(Vt)===k.type){a(K,k.sibling),gt=c(k,et.props),$a(gt,et),gt.return=K,K=gt;break t}a(K,k);break}else n(K,k);k=k.sibling}et.type===B?(gt=Ir(et.props.children,K.mode,gt,et.key),$a(gt,et),gt.return=K,K=gt):(gt=_c(et.type,et.key,et.props,null,K.mode,gt),$a(gt,et),gt.return=K,K=gt)}return v(K);case A:t:{for(Vt=et.key;k!==null;){if(k.key===Vt)if(k.tag===4&&k.stateNode.containerInfo===et.containerInfo&&k.stateNode.implementation===et.implementation){a(K,k.sibling),gt=c(k,et.children||[]),gt.return=K,K=gt;break t}else{a(K,k);break}else n(K,k);k=k.sibling}gt=Gf(et,K.mode,gt),gt.return=K,K=gt}return v(K);case vt:return et=Xr(et),pe(K,k,et,gt)}if(Ut(et))return zt(K,k,et,gt);if(ht(et)){if(Vt=ht(et),typeof Vt!="function")throw Error(r(150));return et=Vt.call(et),qt(K,k,et,gt)}if(typeof et.then=="function")return pe(K,k,Ac(et),gt);if(et.$$typeof===ct)return pe(K,k,Ec(K,et),gt);Rc(K,et)}return typeof et=="string"&&et!==""||typeof et=="number"||typeof et=="bigint"?(et=""+et,k!==null&&k.tag===6?(a(K,k.sibling),gt=c(k,et),gt.return=K,K=gt):(a(K,k),gt=kf(et,K.mode,gt),gt.return=K,K=gt),v(K)):a(K,k)}return function(K,k,et,gt){try{rl=0;var Vt=pe(K,k,et,gt);return Ls=null,Vt}catch(Qt){if(Qt===zs||Qt===Tc)throw Qt;var Ae=$n(29,Qt,null,K.mode);return Ae.lanes=gt,Ae.return=K,Ae}finally{}}}var Wr=Hg(!0),kg=Hg(!1),tr=!1;function Jf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function $f(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function er(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function nr(t,n,a){var o=t.updateQueue;if(o===null)return null;if(o=o.shared,(Le&2)!==0){var c=o.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),o.pending=n,n=gc(t),bg(t,null,a),n}return mc(t,o,n,a),gc(t)}function sl(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,C(t,a)}}function th(t,n){var a=t.updateQueue,o=t.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var c=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var v={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?c=f=v:f=f.next=v,a=a.next}while(a!==null);f===null?c=f=n:f=f.next=n}else c=f=n;a={baseState:o.baseState,firstBaseUpdate:c,lastBaseUpdate:f,shared:o.shared,callbacks:o.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var eh=!1;function ol(){if(eh){var t=Us;if(t!==null)throw t}}function ll(t,n,a,o){eh=!1;var c=t.updateQueue;tr=!1;var f=c.firstBaseUpdate,v=c.lastBaseUpdate,b=c.shared.pending;if(b!==null){c.shared.pending=null;var P=b,Q=P.next;P.next=null,v===null?f=Q:v.next=Q,v=P;var ot=t.alternate;ot!==null&&(ot=ot.updateQueue,b=ot.lastBaseUpdate,b!==v&&(b===null?ot.firstBaseUpdate=Q:b.next=Q,ot.lastBaseUpdate=P))}if(f!==null){var _t=c.baseState;v=0,ot=Q=P=null,b=f;do{var W=b.lane&-536870913,rt=W!==b.lane;if(rt?(we&W)===W:(o&W)===W){W!==0&&W===Vr&&(eh=!0),ot!==null&&(ot=ot.next={lane:0,tag:b.tag,payload:b.payload,callback:null,next:null});t:{var zt=t,qt=b;W=n;var pe=a;switch(qt.tag){case 1:if(zt=qt.payload,typeof zt=="function"){_t=zt.call(pe,_t,W);break t}_t=zt;break t;case 3:zt.flags=zt.flags&-65537|128;case 0:if(zt=qt.payload,W=typeof zt=="function"?zt.call(pe,_t,W):zt,W==null)break t;_t=z({},_t,W);break t;case 2:tr=!0}}W=b.callback,W!==null&&(t.flags|=64,rt&&(t.flags|=8192),rt=c.callbacks,rt===null?c.callbacks=[W]:rt.push(W))}else rt={lane:W,tag:b.tag,payload:b.payload,callback:b.callback,next:null},ot===null?(Q=ot=rt,P=_t):ot=ot.next=rt,v|=W;if(b=b.next,b===null){if(b=c.shared.pending,b===null)break;rt=b,b=rt.next,rt.next=null,c.lastBaseUpdate=rt,c.shared.pending=null}}while(!0);ot===null&&(P=_t),c.baseState=P,c.firstBaseUpdate=Q,c.lastBaseUpdate=ot,f===null&&(c.shared.lanes=0),cr|=v,t.lanes=v,t.memoizedState=_t}}function Gg(t,n){if(typeof t!="function")throw Error(r(191,t));t.call(n)}function Vg(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)Gg(a[t],n)}var ir=se(null),Cc=se(0);function jg(t,n){t=Ra,tt(Cc,t),tt(ir,n),Ra=t|n.baseLanes}function nh(){tt(Cc,Ra),tt(ir,ir.current)}function ih(){Ra=Cc.current,Jt(ir),Jt(Cc)}var zn=se(null),jn=null;function ar(t){var n=t.alternate;tt(Ln,Ln.current&1),tt(zn,t),jn===null&&(n===null||ir.current!==null||n.memoizedState!==null)&&(jn=t)}function ah(t){tt(Ln,Ln.current),tt(zn,t),jn===null&&(jn=t)}function Xg(t){t.tag===22?(tt(Ln,Ln.current),tt(zn,t),jn===null&&(jn=t)):rr()}function rr(){tt(Ln,Ln.current),tt(zn,zn.current)}function ui(t){Jt(zn),jn===t&&(jn=null),Jt(Ln)}var Ln=se(0);function cl(t,n){tt(zn,zn.current),tt(Ln,n)}function rh(t){Jt(Ln),Jt(zn),jn===t&&(jn=null)}function Dc(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Ad(a)||Rd(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var ba=0,de=null,ke=null,hn=null,Nc=!1,Os=!1,qr=!1,Uc=0,ul=0,Ps=null,EM=0;function sn(){throw Error(r(321))}function sh(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!ci(t[a],n[a]))return!1;return!0}function oh(t,n,a,o,c,f){return ba=f,de=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,Ct.H=t===null||t.memoizedState===null?R_:C_,qr=!1,f=a(o,c),qr=!1,Os&&(f=Wg(n,a,o,c)),Yg(t),f}function Yg(t){Ct.H=Fc;var n=ke!==null&&ke.next!==null;if(ba=0,hn=ke=de=null,Nc=!1,ul=0,Ps=null,n)throw Error(r(300));t===null||dn||(t=t.dependencies,t!==null&&Mc(t)&&(dn=!0))}function Wg(t,n,a,o){de=t;var c=0;do{if(Os&&(Ps=null),ul=0,Os=!1,25<=c)throw Error(r(301));if(c+=1,hn=ke=null,t.updateQueue!=null){var f=t.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}Ct.H=NM,f=n(a,o)}while(Os);return f}function bM(){var t=Ct.H,n=t.useState()[0];return n=typeof n.then=="function"?fl(n):n,t=t.useState()[0],(ke!==null?ke.memoizedState:null)!==t&&(de.flags|=1024),n}function lh(){var t=Uc!==0;return Uc=0,t}function ch(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function uh(t){if(Nc){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}Nc=!1}ba=0,hn=ke=de=null,Os=!1,ul=Uc=0,Ps=null}function qn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return hn===null?de.memoizedState=hn=t:hn=hn.next=t,hn}function cn(){if(ke===null){var t=de.alternate;t=t!==null?t.memoizedState:null}else t=ke.next;var n=hn===null?de.memoizedState:hn.next;if(n!==null)hn=n,ke=t;else{if(t===null)throw de.alternate===null?Error(r(467)):Error(r(310));ke=t,t={memoizedState:ke.memoizedState,baseState:ke.baseState,baseQueue:ke.baseQueue,queue:ke.queue,next:null},hn===null?de.memoizedState=hn=t:hn=hn.next=t}return hn}function zc(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function fl(t){var n=ul;return ul+=1,Ps===null&&(Ps=[]),t=Bg(Ps,t,n),n=de,(hn===null?n.memoizedState:hn.next)===null&&(n=n.alternate,Ct.H=n===null||n.memoizedState===null?R_:C_),t}function Lc(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return fl(t);if(t.$$typeof===Y)return;if(t.$$typeof===ct)return Un(t)}throw Error(r(438,String(t)))}function fh(t){var n=null,a=de.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=de.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=zc(),de.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),o=0;o<t;o++)a[o]=ie;return n.index++,a}function Ta(t,n){return typeof n=="function"?n(t):n}function Oc(t){var n=cn();return hh(n,ke,t)}function hh(t,n,a){var o=t.queue;if(o===null)throw Error(r(311));o.lastRenderedReducer=a;var c=t.baseQueue,f=o.pending;if(f!==null){if(c!==null){var v=c.next;c.next=f.next,f.next=v}n.baseQueue=c=f,o.pending=null}if(f=t.baseState,c===null)t.memoizedState=f;else{n=c.next;var b=v=null,P=null,Q=n,ot=!1;do{var _t=Q.lane&-536870913;if(_t!==Q.lane?(we&_t)===_t:(ba&_t)===_t){var W=Q.revertLane;if(W===0)P!==null&&(P=P.next={lane:0,revertLane:0,gesture:null,action:Q.action,hasEagerState:Q.hasEagerState,eagerState:Q.eagerState,next:null}),_t===Vr&&(ot=!0);else if((ba&W)===W){Q=Q.next,W===Vr&&(ot=!0);continue}else _t={lane:0,revertLane:Q.revertLane,gesture:null,action:Q.action,hasEagerState:Q.hasEagerState,eagerState:Q.eagerState,next:null},P===null?(b=P=_t,v=f):P=P.next=_t,de.lanes|=W,cr|=W;_t=Q.action,qr&&a(f,_t),f=Q.hasEagerState?Q.eagerState:a(f,_t)}else W={lane:_t,revertLane:Q.revertLane,gesture:Q.gesture,action:Q.action,hasEagerState:Q.hasEagerState,eagerState:Q.eagerState,next:null},P===null?(b=P=W,v=f):P=P.next=W,de.lanes|=_t,cr|=_t;Q=Q.next}while(Q!==null&&Q!==n);if(P===null?v=f:P.next=b,!ci(f,t.memoizedState)&&(dn=!0,ot&&(a=Us,a!==null)))throw a;t.memoizedState=f,t.baseState=v,t.baseQueue=P,o.lastRenderedState=f}return c===null&&(o.lanes=0),[t.memoizedState,o.dispatch]}function dh(t){var n=cn(),a=n.queue;if(a===null)throw Error(r(311));a.lastRenderedReducer=t;var o=a.dispatch,c=a.pending,f=n.memoizedState;if(c!==null){a.pending=null;var v=c=c.next;do f=t(f,v.action),v=v.next;while(v!==c);ci(f,n.memoizedState)||(dn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,o]}function qg(t,n,a){var o=de,c=cn(),f=_e;if(f){if(a===void 0)throw Error(r(407));a=a()}else a=n();var v=!ci((ke||c).memoizedState,a);if(v&&(c.memoizedState=a,dn=!0),c=c.queue,gh(Qg.bind(null,o,c,t),[t]),t=c.getSnapshot!==n||v||hn!==null&&(hn.memoizedState.tag&1)!==0,Bs(t?9:8,{destroy:void 0},Kg.bind(null,o,c,a,n),null),t){if(o.flags|=2048,Ye===null)throw Error(r(349));f||(ba&127)!==0||Zg(o,n,a)}return a}function Zg(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=de.updateQueue,n===null?(n=zc(),de.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function Kg(t,n,a,o){n.value=a,n.getSnapshot=o,Jg(n)&&$g(t)}function Qg(t,n,a){return a(function(){Jg(n)&&$g(t)})}function Jg(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!ci(t,a)}catch{return!0}}function $g(t){var n=Br(t,2);n!==null&&ii(n,t,2)}function ph(t){var n=qn();if(typeof t=="function"){var a=t;if(t=a(),qr){bn(!0);try{a()}finally{bn(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ta,lastRenderedState:t},n}function t_(t,n,a,o){return t.baseState=a,hh(t,ke,typeof o=="function"?o:Ta)}function TM(t,n,a,o,c){if(Ic(t))throw Error(r(485));if(t=n.action,t!==null){var f={payload:c,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(v){f.listeners.push(v)}};Ct.T!==null?a(!0):f.isTransition=!1,o(f),a=n.pending,a===null?(f.next=n.pending=f,e_(n,f)):(f.next=a.next,n.pending=a.next=f)}}function e_(t,n){var a=n.action,o=n.payload,c=t.state;if(n.isTransition){var f=Ct.T,v={};v.types=f!==null?f.types:null,Ct.T=v;try{var b=a(c,o),P=Ct.S;P!==null&&P(v,b),n_(t,n,b)}catch(Q){mh(t,n,Q)}finally{f!==null&&v.types!==null&&(f.types=v.types),Ct.T=f}}else try{f=a(c,o),n_(t,n,f)}catch(Q){mh(t,n,Q)}}function n_(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){i_(t,n,o)},function(o){return mh(t,n,o)}):i_(t,n,a)}function i_(t,n,a){n.status="fulfilled",n.value=a,a_(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,e_(t,a)))}function mh(t,n,a){var o=t.pending;if(t.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,a_(n),n=n.next;while(n!==o)}t.action=null}function a_(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function r_(t,n){return n}function s_(t,n){if(_e){var a=Ye.formState;if(a!==null){t:{var o=de;if(_e){if(Ze){e:{for(var c=Ze,f=wi;c.nodeType!==8;){if(!f){c=null;break e}if(c=Ri(c.nextSibling),c===null){c=null;break e}}f=c.data,c=f==="F!"||f==="F"?c:null}if(c){Ze=Ri(c.nextSibling),o=c.data==="F!";break t}}Qa(o)}o=!1}o&&(n=a[0])}}return a=qn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:r_,lastRenderedState:n},a.queue=o,a=T_.bind(null,de,o),o.dispatch=a,o=ph(!1),f=xh.bind(null,de,!1,o.queue),o=qn(),c={state:n,dispatch:null,action:t,pending:null},o.queue=c,a=TM.bind(null,de,c,f,a),c.dispatch=a,o.memoizedState=t,[n,a,!1]}function o_(t){var n=cn();return l_(n,ke,t)}function l_(t,n,a){if(n=hh(t,n,r_)[0],t=Oc(Ta)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=fl(n)}catch(v){throw v===zs?Tc:v}else o=n;n=cn();var c=n.queue,f=c.dispatch;return a!==n.memoizedState&&(de.flags|=2048,Bs(9,{destroy:void 0},wM.bind(null,c,a),null)),[o,f,t]}function wM(t,n){t.action=n}function c_(t){var n=cn(),a=ke;if(a!==null)return l_(n,a,t);cn(),n=n.memoizedState,a=cn();var o=a.queue.dispatch;return a.memoizedState=t,[n,o,!1]}function Bs(t,n,a,o){return t={tag:t,create:a,deps:o,inst:n,next:null},n=de.updateQueue,n===null&&(n=zc(),de.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(o=a.next,a.next=t,t.next=o,n.lastEffect=t),t}function u_(){return cn().memoizedState}function Pc(t,n,a,o){var c=qn();de.flags|=t,c.memoizedState=Bs(1|n,{destroy:void 0},a,o===void 0?null:o)}function Bc(t,n,a,o){var c=cn();o=o===void 0?null:o;var f=c.memoizedState.inst;ke!==null&&o!==null&&sh(o,ke.memoizedState.deps)?c.memoizedState=Bs(n,f,a,o):(de.flags|=t,c.memoizedState=Bs(1|n,f,a,o))}function f_(t,n){Pc(8390656,8,t,n)}function gh(t,n){Bc(2048,8,t,n)}function AM(t){de.flags|=4;var n=de.updateQueue;if(n===null)n=zc(),de.updateQueue=n,n.events=[t];else{var a=n.events;a===null?n.events=[t]:a.push(t)}}function h_(t){var n=cn().memoizedState;return AM({ref:n,nextImpl:t}),function(){if((Le&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}function d_(t,n){return Bc(4,2,t,n)}function p_(t,n){return Bc(4,4,t,n)}function m_(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function g_(t,n,a){a=a!=null?a.concat([t]):null,Bc(4,4,m_.bind(null,n,t),a)}function _h(){}function __(t,n){var a=cn();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&sh(n,o[1])?o[0]:(a.memoizedState=[t,n],t)}function v_(t,n){var a=cn();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&sh(n,o[1]))return o[0];if(o=t(),qr){bn(!0);try{t()}finally{bn(!1)}}return a.memoizedState=[o,n],o}function vh(t,n,a){return a===void 0||(ba&1073741824)!==0&&(we&261930)===0?t.memoizedState=n:(t.memoizedState=a,t=R0(),de.lanes|=t,cr|=t,a)}function y_(t,n,a,o){return ci(a,n)?a:ir.current!==null?(t=vh(t,a,o),ci(t,n)||(dn=!0),t):(ba&106)===0||(ba&1073741824)!==0&&(we&261930)===0?(dn=!0,t.memoizedState=a):(t=R0(),de.lanes|=t,cr|=t,n)}function S_(t,n,a,o,c){var f=kt.p;kt.p=f!==0&&8>f?f:8;var v=Ct.T,b={};b.types=v!==null?v.types:null,Ct.T=b,xh(t,!1,n,a);try{var P=c(),Q=Ct.S;if(Q!==null&&Q(b,P),P!==null&&typeof P=="object"&&typeof P.then=="function"){var ot=MM(P,o);hl(t,n,ot,pi(t))}else hl(t,n,o,pi(t))}catch(_t){hl(t,n,{then:function(){},status:"rejected",reason:_t},pi())}finally{kt.p=f,v!==null&&b.types!==null&&(v.types=b.types),Ct.T=v}}function RM(){}function yh(t,n,a,o){if(t.tag!==5)throw Error(r(476));var c=x_(t).queue;S_(t,c,n,le,a===null?RM:function(){return M_(t),a(o)})}function x_(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:le,baseState:le,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ta,lastRenderedState:le},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ta,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function M_(t){var n=x_(t);n.next===null&&(n=t.alternate.memoizedState),hl(t,n.next.queue,{},pi())}function Sh(){return Un(no)}function E_(){return cn().memoizedState}function b_(){return cn().memoizedState}function CM(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=pi();t=er(a);var o=nr(n,t,a);o!==null&&(ii(o,n,a),sl(o,n,a)),n={cache:qf()},t.payload=n;return}n=n.return}}function DM(t,n,a){var o=pi();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Ic(t)?w_(n,a):(a=Ff(t,n,a,o),a!==null&&(ii(a,t,o),A_(a,n,o)))}function T_(t,n,a){var o=pi();hl(t,n,a,o)}function hl(t,n,a,o){var c={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Ic(t))w_(n,c);else{var f=t.alternate;if(t.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var v=n.lastRenderedState,b=f(v,a);if(c.hasEagerState=!0,c.eagerState=b,ci(b,v))return mc(t,n,c,0),Ye===null&&pc(),!1}catch{}finally{}if(a=Ff(t,n,c,o),a!==null)return ii(a,t,o),A_(a,n,o),!0}return!1}function xh(t,n,a,o){if(o={lane:2,revertLane:fd(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Ic(t)){if(n)throw Error(r(479))}else n=Ff(t,a,o,2),n!==null&&ii(n,t,2)}function Ic(t){var n=t.alternate;return t===de||n!==null&&n===de}function w_(t,n){Os=Nc=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function A_(t,n,a){if((a&4194048)!==0){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,C(t,a)}}var Fc={readContext:Un,use:Lc,useCallback:sn,useContext:sn,useEffect:sn,useImperativeHandle:sn,useLayoutEffect:sn,useInsertionEffect:sn,useMemo:sn,useReducer:sn,useRef:sn,useState:sn,useDebugValue:sn,useDeferredValue:sn,useTransition:sn,useSyncExternalStore:sn,useId:sn,useHostTransitionStatus:sn,useFormState:sn,useActionState:sn,useOptimistic:sn,useMemoCache:sn,useCacheRefresh:sn,useEffectEvent:sn},R_={readContext:Un,use:Lc,useCallback:function(t,n){return qn().memoizedState=[t,n===void 0?null:n],t},useContext:Un,useEffect:f_,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,Pc(4194308,4,m_.bind(null,n,t),a)},useLayoutEffect:function(t,n){return Pc(4194308,4,t,n)},useInsertionEffect:function(t,n){Pc(4,2,t,n)},useMemo:function(t,n){var a=qn();n=n===void 0?null:n;var o=t();if(qr){bn(!0);try{t()}finally{bn(!1)}}return a.memoizedState=[o,n],o},useReducer:function(t,n,a){var o=qn();if(a!==void 0){var c=a(n);if(qr){bn(!0);try{a(n)}finally{bn(!1)}}}else c=n;return o.memoizedState=o.baseState=c,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:c},o.queue=t,t=t.dispatch=DM.bind(null,de,t),[o.memoizedState,t]},useRef:function(t){var n=qn();return t={current:t},n.memoizedState=t},useState:function(t){t=ph(t);var n=t.queue,a=T_.bind(null,de,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:_h,useDeferredValue:function(t,n){var a=qn();return vh(a,t,n)},useTransition:function(){var t=ph(!1);return t=S_.bind(null,de,t.queue,!0,!1),qn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var o=de,c=qn();if(_e){if(a===void 0)throw Error(r(407));a=a()}else{if(a=n(),Ye===null)throw Error(r(349));(we&127)!==0||Zg(o,n,a)}c.memoizedState=a;var f={value:a,getSnapshot:n};return c.queue=f,f_(Qg.bind(null,o,f,t),[t]),o.flags|=2048,Bs(9,{destroy:void 0},Kg.bind(null,o,f,a,n),null),a},useId:function(){var t=qn(),n=Ye.identifierPrefix;if(_e){var a=Ji,o=Qi;a=(o&~(1<<32-Gn(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Uc++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=EM++,n="_"+n+"r_"+a.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:Sh,useFormState:s_,useActionState:s_,useOptimistic:function(t){var n=qn();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=xh.bind(null,de,!0,a),a.dispatch=n,[t,n]},useMemoCache:fh,useCacheRefresh:function(){return qn().memoizedState=CM.bind(null,de)},useEffectEvent:function(t){var n=qn(),a={impl:t};return n.memoizedState=a,function(){if((Le&2)!==0)throw Error(r(440));return a.impl.apply(void 0,arguments)}}},C_={readContext:Un,use:Lc,useCallback:__,useContext:Un,useEffect:gh,useImperativeHandle:g_,useInsertionEffect:d_,useLayoutEffect:p_,useMemo:v_,useReducer:Oc,useRef:u_,useState:function(){return Oc(Ta)},useDebugValue:_h,useDeferredValue:function(t,n){var a=cn();return y_(a,ke.memoizedState,t,n)},useTransition:function(){var t=Oc(Ta)[0],n=cn().memoizedState;return[typeof t=="boolean"?t:fl(t),n]},useSyncExternalStore:qg,useId:E_,useHostTransitionStatus:Sh,useFormState:o_,useActionState:o_,useOptimistic:function(t,n){var a=cn();return t_(a,ke,t,n)},useMemoCache:fh,useCacheRefresh:b_,useEffectEvent:h_},NM={readContext:Un,use:Lc,useCallback:__,useContext:Un,useEffect:gh,useImperativeHandle:g_,useInsertionEffect:d_,useLayoutEffect:p_,useMemo:v_,useReducer:dh,useRef:u_,useState:function(){return dh(Ta)},useDebugValue:_h,useDeferredValue:function(t,n){var a=cn();return ke===null?vh(a,t,n):y_(a,ke.memoizedState,t,n)},useTransition:function(){var t=dh(Ta)[0],n=cn().memoizedState;return[typeof t=="boolean"?t:fl(t),n]},useSyncExternalStore:qg,useId:E_,useHostTransitionStatus:Sh,useFormState:c_,useActionState:c_,useOptimistic:function(t,n){var a=cn();return ke!==null?t_(a,ke,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:fh,useCacheRefresh:b_,useEffectEvent:h_};function Mh(t,n,a,o){n=t.memoizedState,a=a(o,n),a=a==null?n:z({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var Eh={enqueueSetState:function(t,n,a){t=t._reactInternals;var o=pi(),c=er(o);c.payload=n,a!=null&&(c.callback=a),n=nr(t,c,o),n!==null&&(ii(n,t,o),sl(n,t,o))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var o=pi(),c=er(o);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=nr(t,c,o),n!==null&&(ii(n,t,o),sl(n,t,o))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=pi(),o=er(a);o.tag=2,n!=null&&(o.callback=n),n=nr(t,o,a),n!==null&&(ii(n,t,a),sl(n,t,a))}};function D_(t,n,a,o,c,f,v){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(o,f,v):n.prototype&&n.prototype.isPureReactComponent?!Jo(a,o)||!Jo(c,f):!0}function N_(t,n,a,o){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==t&&Eh.enqueueReplaceState(n,n.state,null)}function Zr(t,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(t=t.defaultProps){a===n&&(a=z({},a));for(var c in t)a[c]===void 0&&(a[c]=t[c])}return a}function U_(t){dc(t)}function z_(t){console.error(t)}function L_(t){dc(t)}function Hc(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function O_(t,n,a){try{var o=t.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function bh(t,n,a){return a=er(a),a.tag=3,a.payload={element:null},a.callback=function(){Hc(t,n)},a}function P_(t){return t=er(t),t.tag=3,t}function B_(t,n,a,o){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var f=o.value;t.payload=function(){return c(f)},t.callback=function(){O_(n,a,o)}}var v=a.stateNode;v!==null&&typeof v.componentDidCatch=="function"&&(t.callback=function(){O_(n,a,o),typeof c!="function"&&(ur===null?ur=new Set([this]):ur.add(this));var b=o.stack;this.componentDidCatch(o.value,{componentStack:b!==null?b:""})})}function UM(t,n,a,o,c){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&kr(n,a,c,!0),a=zn.current,a!==null){switch(a.tag){case 31:case 13:case 19:return jn===null?ou():a.alternate===null&&on===0&&(on=3),a.flags&=-257,a.flags|=65536,a.lanes=c,o===wc?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),ld(t,o,c)),!1;case 22:return a.flags|=65536,o===wc?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),ld(t,o,c)),!1}throw Error(r(435,a.tag))}return ld(t,o,c),ou(),!1}if(_e)return n=zn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,o!==jf&&(t=Error(r(422),{cause:o}),el(Ei(t,a)))):(o!==jf&&(n=Error(r(423),{cause:o}),el(Ei(n,a))),t=t.current.alternate,t.flags|=65536,c&=-c,t.lanes|=c,o=Ei(o,a),c=bh(t.stateNode,o,c),th(t,c),on!==4&&(on=2)),!1;var f=Error(r(520),{cause:o});if(f=Ei(f,a),Sl===null?Sl=[f]:Sl.push(f),on!==4&&(on=2),n===null)return!0;o=Ei(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=c&-c,a.lanes|=t,t=bh(a.stateNode,o,t),th(a,t),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(ur===null||!ur.has(f))))return a.flags|=65536,c&=-c,a.lanes|=c,c=P_(c),B_(c,t,a,o),th(a,c),!1;break;case 22:if(a.memoizedState!==null)return a.flags|=65536,!1}a=a.return}while(a!==null);return!1}var Th=Error(r(461)),dn=!1;function vn(t,n,a,o){n.child=t===null?kg(n,null,a,o):Wr(n,t.child,a,o)}function I_(t,n,a,o,c){a=a.render;var f=n.ref;if("ref"in o){var v={};for(var b in o)b!=="ref"&&(v[b]=o[b])}else v=o;return Gr(n),o=oh(t,n,a,v,f,c),b=lh(),t!==null&&!dn?(ch(t,n,c),wa(t,n,c)):(_e&&b&&yc(n),n.flags|=1,vn(t,n,o,c),n.child)}function F_(t,n,a,o,c){if(t===null){var f=a.type;return typeof f=="function"&&!Hf(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,H_(t,n,f,o,c)):(t=_c(a.type,null,o,n,n.mode,c),t.ref=n.ref,t.return=n,n.child=t)}if(f=t.child,!zh(t,c)){var v=f.memoizedProps;if(a=a.compare,a=a!==null?a:Jo,a(v,o)&&t.ref===n.ref)return wa(t,n,c)}return n.flags|=1,t=Sa(f,o),t.ref=n.ref,t.return=n,n.child=t}function H_(t,n,a,o,c){if(t!==null){var f=t.memoizedProps;if(Jo(f,o)&&t.ref===n.ref)if(dn=!1,n.pendingProps=o=f,zh(t,c))(t.flags&131072)!==0&&(dn=!0);else return n.lanes=t.lanes,wa(t,n,c)}return wh(t,n,a,o,c)}function k_(t,n,a,o){var c=o.children,f=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,t!==null){for(o=n.child=t.child,c=0;o!==null;)c=c|o.lanes|o.childLanes,o=o.sibling;o=c&~f}else o=0,n.child=null;return G_(t,n,f,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&bc(n,f!==null?f.cachePool:null),f!==null?jg(n,f):nh(),Xg(n);else return o=n.lanes=536870912,G_(t,n,f!==null?f.baseLanes|a:a,a,o)}else f!==null?(bc(n,f.cachePool),jg(n,f),rr(),n.memoizedState=null):(t!==null&&bc(n,null),nh(),rr());return vn(t,n,c,a),n.child}function dl(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function G_(t,n,a,o,c){var f=Kf();return f=f===null?null:{parent:fn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},t!==null&&bc(n,null),nh(),Xg(n),t!==null&&kr(t,n,o,!0),n.childLanes=c,null}function kc(t,n){return n=Gc({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function V_(t,n,a){return Wr(n,t.child,null,a),t=kc(n,n.pendingProps),t.flags|=2,ui(n),n.memoizedState=null,t}function zM(t,n,a){var o=n.pendingProps,c=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(_e){if(o.mode==="hidden")return t=kc(n,o),n.lanes=536870912,t.memoizedState={baseLanes:0,cachePool:null},dl(null,t);if(ah(n),(t=Ze)?(t=mv(t,wi),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Za!==null?{id:Qi,overflow:Ji}:null,retryLane:536870912,hydrationErrors:null},a=wg(t),a.return=n,n.child=a,wn=n,Ze=null)):t=null,t===null)throw Qa(n);return n.lanes=536870912,null}return kc(n,o)}var f=t.memoizedState;if(f!==null){var v=f.dehydrated;if(ah(n),c)if(n.flags&256)n.flags&=-257,n=V_(t,n,a);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(r(558));else if(dn||kr(t,n,a,!1),c=(a&t.childLanes)!==0,dn||c){if(ir.current===null){if(o=Ye,o!==null&&(v=J(o,a),v!==0&&v!==f.retryLane))throw f.retryLane=v,Br(t,v),ii(o,t,v),Th;ou()}n=V_(t,n,a)}else t=f.treeContext,Ze=Ri(v.nextSibling),wn=n,_e=!0,Ka=null,wi=!1,t!==null&&Cg(n,t),n=kc(n,o),n.flags|=134221824;return n}return t=Sa(t.child,{mode:o.mode,children:o.children}),t.ref=n.ref,n.child=t,t.return=n,t}function Is(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(r(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function wh(t,n,a,o,c){return Gr(n),a=oh(t,n,a,o,void 0,c),o=lh(),t!==null&&!dn?(ch(t,n,c),wa(t,n,c)):(_e&&o&&yc(n),n.flags|=1,vn(t,n,a,c),n.child)}function j_(t,n,a,o,c,f){return Gr(n),n.updateQueue=null,a=Wg(n,o,a,c),Yg(t),o=lh(),t!==null&&!dn?(ch(t,n,f),wa(t,n,f)):(_e&&o&&yc(n),n.flags|=1,vn(t,n,a,f),n.child)}function X_(t,n,a,o,c){if(Gr(n),n.stateNode===null){var f=Rs,v=a.contextType;typeof v=="object"&&v!==null&&(f=Un(v)),f=new a(o,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=Eh,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=o,f.state=n.memoizedState,f.refs={},Jf(n),v=a.contextType,f.context=typeof v=="object"&&v!==null?Un(v):Rs,f.state=n.memoizedState,v=a.getDerivedStateFromProps,typeof v=="function"&&(Mh(n,a,v,o),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(v=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),v!==f.state&&Eh.enqueueReplaceState(f,f.state,null),ll(n,o,f,c),ol(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(t===null){f=n.stateNode;var b=n.memoizedProps,P=Zr(a,b);f.props=P;var Q=f.context,ot=a.contextType;v=Rs,typeof ot=="object"&&ot!==null&&(v=Un(ot));var _t=a.getDerivedStateFromProps;ot=typeof _t=="function"||typeof f.getSnapshotBeforeUpdate=="function",b=n.pendingProps!==b,ot||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(b||Q!==v)&&N_(n,f,o,v),tr=!1;var W=n.memoizedState;f.state=W,ll(n,o,f,c),ol(),Q=n.memoizedState,b||W!==Q||tr?(typeof _t=="function"&&(Mh(n,a,_t,o),Q=n.memoizedState),(P=tr||D_(n,a,P,o,W,Q,v))?(ot||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=Q),f.props=o,f.state=Q,f.context=v,o=P):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{f=n.stateNode,$f(t,n),v=n.memoizedProps,ot=Zr(a,v),f.props=ot,_t=n.pendingProps,W=f.context,Q=a.contextType,P=Rs,typeof Q=="object"&&Q!==null&&(P=Un(Q)),b=a.getDerivedStateFromProps,(Q=typeof b=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(v!==_t||W!==P)&&N_(n,f,o,P),tr=!1,W=n.memoizedState,f.state=W,ll(n,o,f,c),ol();var rt=n.memoizedState;v!==_t||W!==rt||tr||t!==null&&t.dependencies!==null&&Mc(t.dependencies)?(typeof b=="function"&&(Mh(n,a,b,o),rt=n.memoizedState),(ot=tr||D_(n,a,ot,o,W,rt,P)||t!==null&&t.dependencies!==null&&Mc(t.dependencies))?(Q||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(o,rt,P),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(o,rt,P)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||v===t.memoizedProps&&W===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||v===t.memoizedProps&&W===t.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=rt),f.props=o,f.state=rt,f.context=P,o=ot):(typeof f.componentDidUpdate!="function"||v===t.memoizedProps&&W===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||v===t.memoizedProps&&W===t.memoizedState||(n.flags|=1024),o=!1)}return f=o,Is(t,n),o=(n.flags&128)!==0,f||o?(f=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,t!==null&&o?(n.child=Wr(n,t.child,null,c),n.child=Wr(n,null,a,c)):vn(t,n,a,c),n.memoizedState=f.state,t=n.child):t=wa(t,n,c),t}function Y_(t,n,a,o){return Fr(),n.flags|=256,vn(t,n,a,o),n.child}var Ah={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Rh(t){return{baseLanes:t,cachePool:Og()}}function Ch(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=di),t}function W_(t,n,a){var o=n.pendingProps,c=!1,f=(n.flags&128)!==0,v;if((v=f)||(v=t!==null&&t.memoizedState===null?!1:(Ln.current&2)!==0),v&&(c=!0,n.flags&=-129),v=(n.flags&32)!==0,n.flags&=-33,t===null){if(_e){if(c?ar(n):rr(),(t=Ze)?(t=mv(t,wi),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Za!==null?{id:Qi,overflow:Ji}:null,retryLane:536870912,hydrationErrors:null},a=wg(t),a.return=n,n.child=a,wn=n,Ze=null)):t=null,t===null)throw Qa(n);return Rd(t)?n.lanes=32:n.lanes=536870912,null}return f=o.children,o=o.fallback,c?(rr(),c=n.mode,f=Gc({mode:"hidden",children:f},c),o=Ir(o,c,a,null),f.return=n,o.return=n,f.sibling=o,n.child=f,o=n.child,o.memoizedState=Rh(a),o.childLanes=Ch(t,v,a),n.memoizedState=Ah,dl(null,o)):(ar(n),Dh(n,f))}var b=t.memoizedState;if(b!==null){var P=b.dehydrated;if(P!==null)return LM(t,n,f,v,o,P,b,a)}return c?(rr(),c=o.fallback,f=n.mode,b=t.child,P=b.sibling,o=Sa(b,{mode:"hidden",children:o.children}),o.subtreeFlags=b.subtreeFlags&1206910976,P!==null?c=Sa(P,c):(c=Ir(c,f,a,null),c.flags|=2),c.return=n,o.return=n,o.sibling=c,n.child=o,dl(null,o),o=n.child,c=t.child.memoizedState,c===null?c=Rh(a):(f=c.cachePool,f!==null?(b=fn._currentValue,f=f.parent!==b?{parent:b,pool:b}:f):f=Og(),c={baseLanes:c.baseLanes|a,cachePool:f}),o.memoizedState=c,o.childLanes=Ch(t,v,a),n.memoizedState=Ah,dl(t.child,o)):(ar(n),a=t.child,t=a.sibling,a=Sa(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,t!==null&&(v=n.deletions,v===null?(n.deletions=[t],n.flags|=16):v.push(t)),n.child=a,n.memoizedState=null,a)}function Dh(t,n){return n=Gc({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function Gc(t,n){return t=$n(22,t,null,n),t.lanes=0,t}function Vc(t,n,a){return Wr(n,t.child,null,a),t=Dh(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function LM(t,n,a,o,c,f,v,b){if(a)return n.flags&256?(ar(n),n.flags&=-257,Vc(t,n,b)):n.memoizedState!==null?(rr(),n.child=t.child,n.flags|=128,null):(rr(),f=c.fallback,v=n.mode,c=Gc({mode:"visible",children:c.children},v),f=Ir(f,v,b,null),f.flags|=2,c.return=n,f.return=n,c.sibling=f,n.child=c,Wr(n,t.child,null,b),c=n.child,c.memoizedState=Rh(b),c.childLanes=Ch(t,o,b),n.memoizedState=Ah,dl(null,c));if(ar(n),Rd(f)){if(o=f.nextSibling&&f.nextSibling.dataset,o)var P=o.dgst;return o=P,o!==""&&(c=Error(r(419)),c.stack="",c.digest=o,el({value:c,source:null,stack:null})),Vc(t,n,b)}if(dn||kr(t,n,b,!1),o=(b&t.childLanes)!==0,dn||o){if(ir.current!==null)return Vc(t,n,b);if(o=Ye,o!==null&&(c=J(o,b),c!==0&&c!==v.retryLane))throw v.retryLane=c,Br(t,c),ii(o,t,c),Th;return Ad(f)||ou(),Vc(t,n,b)}return Ad(f)?(n.flags|=192,n.child=t.child,null):(t=v.treeContext,Ze=Ri(f.nextSibling),wn=n,_e=!0,Ka=null,wi=!1,t!==null&&Cg(n,t),n=Dh(n,c.children),n.flags|=134221824,n)}function q_(t,n,a){t.lanes|=n;var o=t.alternate;o!==null&&(o.lanes|=n),xc(t.return,n,a)}function Z_(t){for(var n=null;t!==null;){var a=t.alternate;a!==null&&Dc(a)===null&&(n=t),t=t.sibling}return n}function jc(t,n,a,o,c,f){var v=t.memoizedState;v===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:c,treeForkCount:f}:(v.isBackwards=n,v.rendering=null,v.renderingStartTime=0,v.last=o,v.tail=a,v.tailMode=c,v.treeForkCount=f)}function Nh(t){var n=t.child;for(t.child=null;n!==null;){var a=n.sibling;n.sibling=t.child,t.child=n,n=a}}function Uh(t,n,a){var o=n.pendingProps,c=o.revealOrder,f=o.tail;o=o.children;var v=Ln.current;if(n.flags&128)return cl(n,v),null;var b=(v&2)!==0;if(b?(v=v&1|2,n.flags|=128):v&=1,cl(n,v),c==="backwards"&&t!==null?(Nh(t),vn(t,n,o,a),Nh(t)):vn(t,n,o,a),o=_e?tl:0,!b&&t!==null&&(t.flags&128)!==0)t:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&q_(t,a,n);else if(t.tag===19)q_(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break t;for(;t.sibling===null;){if(t.return===null||t.return===n)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(c){case"backwards":a=Z_(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null,Nh(n)),jc(n,!0,c,null,f,o);break;case"unstable_legacy-backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(t=c.alternate,t!==null&&Dc(t)===null){n.child=c;break}t=c.sibling,c.sibling=a,a=c,c=t}jc(n,!0,a,null,f,o);break;case"together":jc(n,!1,null,null,void 0,o);break;case"independent":n.memoizedState=null;break;default:a=Z_(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),jc(n,!1,c,a,f,o)}return n.child}function K_(t,n,a){var o=n.pendingProps;return Ja(n,n.type,o.value),vn(t,n,o.children,a),n.child}function wa(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),cr|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(kr(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(r(153));if(n.child!==null){for(t=n.child,a=Sa(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=Sa(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function zh(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&Mc(t)))}function OM(t,n,a){switch(n.tag){case 3:nt(n,n.stateNode.containerInfo),Ja(n,fn,t.memoizedState.cache),Fr();break;case 27:case 5:Mt(n);break;case 4:nt(n,n.stateNode.containerInfo);break;case 10:Ja(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,ah(n),null;break;case 13:var o=n.memoizedState;if(o!==null){if(o.dehydrated!==null)return ar(n),n.flags|=128,null;o=kr(t,n,a,!1);var c=n.child.childLanes;return o||(a&c)!==0?W_(t,n,a):(ar(n),t=wa(t,n,a),t!==null?t.sibling:null)}ar(n);break;case 19:if(n.flags&128)return Uh(t,n,a);if(c=(t.flags&128)!==0,o=(a&n.childLanes)!==0,o||(kr(t,n,a,!1),o=(a&n.childLanes)!==0),c){if(o)return Uh(t,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),cl(n,Ln.current),o)break;return null;case 22:return n.lanes=0,k_(t,n,a,n.pendingProps);case 24:Ja(n,fn,t.memoizedState.cache)}return wa(t,n,a)}function Q_(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)dn=!0;else{if(!zh(t,a)&&(n.flags&128)===0)return dn=!1,OM(t,n,a);dn=(t.flags&131072)!==0}else dn=!1,_e&&(n.flags&1048576)!==0&&Rg(n,tl,n.index);switch(n.lanes=0,n.tag){case 16:t:{var o=n.pendingProps;if(t=Xr(n.elementType),n.type=t,typeof t=="function")Hf(t)?(o=Zr(t,o),n.tag=1,n=X_(null,n,t,o,a)):(n.tag=0,n=wh(null,n,t,o,a));else{if(t!=null){var c=t.$$typeof;if(c===V){n.tag=11,n=I_(null,n,t,o,a);break t}else if(c===St){n.tag=14,n=F_(null,n,t,o,a);break t}else if(c===ct){n.tag=10,n.type=t,n=K_(null,n,a);break t}}throw n=Xt(t)||t,Error(r(306,n,""))}}return n;case 0:return wh(t,n,n.type,n.pendingProps,a);case 1:return o=n.type,c=Zr(o,n.pendingProps),X_(t,n,o,c,a);case 3:t:{if(nt(n,n.stateNode.containerInfo),t===null)throw Error(r(387));o=n.pendingProps;var f=n.memoizedState;c=f.element,$f(t,n),ll(n,o,null,a);var v=n.memoizedState;if(o=v.cache,Ja(n,fn,o),o!==f.cache&&Wf(n,[fn],a,!0),ol(),o=v.element,f.isDehydrated)if(f={element:o,isDehydrated:!1,cache:v.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=Y_(t,n,o,a);break t}else if(o!==c){c=Ei(Error(r(424)),n),el(c),n=Y_(t,n,o,a);break t}else{switch(t=n.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(Ze=Ri(t.firstChild),wn=n,_e=!0,Ka=null,wi=!0,a=kg(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|134221824,a=a.sibling}else{if(Fr(),o===c){n=wa(t,n,a);break t}vn(t,n,o,a)}n=n.child}return n;case 26:return Is(t,n),t===null?(a=Mv(n.type,null,n.pendingProps,null))?n.memoizedState=a:_e||(n.stateNode=ev(n.type,n.pendingProps,L.current,n)):n.memoizedState=Mv(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return Mt(n),t===null&&_e&&(o=n.stateNode=vv(n.type,n.pendingProps,L.current),wn=n,wi=!0,c=Ze,dr(n.type)?(Cd=c,Ze=Ri(o.firstChild)):Ze=c),vn(t,n,n.pendingProps.children,a),Is(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&_e&&((c=o=Ze)&&(o=CE(o,n.type,n.pendingProps,wi),o!==null?(n.stateNode=o,wn=n,Ze=Ri(o.firstChild),wi=!1,c=!0):c=!1),c||Qa(n)),Mt(n),c=n.type,f=n.pendingProps,v=t!==null?t.memoizedProps:null,o=f.children,Sd(c,f)?o=null:v!==null&&Sd(c,v)&&(n.flags|=32),n.memoizedState!==null&&(c=oh(t,n,bM,null,null,a),no._currentValue=c),Is(t,n),vn(t,n,o,a),n.child;case 6:return t===null&&_e&&((t=a=Ze)&&(a=DE(a,n.pendingProps,wi),a!==null?(n.stateNode=a,wn=n,Ze=null,t=!0):t=!1),t||Qa(n)),null;case 13:return W_(t,n,a);case 4:return nt(n,n.stateNode.containerInfo),o=n.pendingProps,t===null?n.child=Wr(n,null,o,a):vn(t,n,o,a),n.child;case 11:return I_(t,n,n.type,n.pendingProps,a);case 7:return o=n.pendingProps,Is(t,n),vn(t,n,o,a),n.child;case 8:return vn(t,n,n.pendingProps.children,a),n.child;case 12:return vn(t,n,n.pendingProps.children,a),n.child;case 10:return K_(t,n,a);case 9:return c=n.type._context,o=n.pendingProps.children,Gr(n),c=Un(c),o=o(c),n.flags|=1,vn(t,n,o,a),n.child;case 14:return F_(t,n,n.type,n.pendingProps,a);case 15:return H_(t,n,n.type,n.pendingProps,a);case 19:return Uh(t,n,a);case 31:return zM(t,n,a);case 22:return k_(t,n,a,n.pendingProps);case 24:return Gr(n),o=Un(fn),t===null?(c=Kf(),c===null&&(c=Ye,f=qf(),c.pooledCache=f,f.refCount++,f!==null&&(c.pooledCacheLanes|=a),c=f),n.memoizedState={parent:o,cache:c},Jf(n),Ja(n,fn,c)):((t.lanes&a)!==0&&($f(t,n),ll(n,null,null,a),ol()),c=t.memoizedState,f=n.memoizedState,c.parent!==o?(c={parent:o,cache:o},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),Ja(n,fn,o)):(o=f.cache,Ja(n,fn,o),o!==c.cache&&Wf(n,[fn],a,!0))),vn(t,n,n.pendingProps.children,a),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),o=n.pendingProps,o.name!=null&&o.name!=="auto"?n.flags|=t===null?18882560:18874368:_e&&yc(n),t!==null&&t.memoizedProps.name!==o.name?n.flags|=4194816:Is(t,n),vn(t,n,o.children,a),n.child;case 29:throw n.pendingProps}throw Error(r(156,n.tag))}function Aa(t){t.flags|=4}function Lh(t,n,a,o,c){var f;if((f=(t.mode&32)!==0)&&(f=a===null?wv(n,o):wv(n,o)&&(o.src!==a.src||o.srcSet!==a.srcSet)),f){if(t.flags|=16777216,(c&335544128)===c)if(t.stateNode.complete)t.flags|=8192;else if(U0())t.flags|=8192;else throw Yr=wc,Qf}else t.flags&=-16777217}function J_(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!Av(n))if(U0())t.flags|=8192;else throw Yr=wc,Qf}function Xc(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?nc():536870912,t.lanes|=n,Vs|=n)}function pl(t,n){if(!_e)switch(t.tailMode){case"visible":break;case"collapsed":for(var a=t.tail,o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:o.sibling=null;break;default:for(n=t.tail,a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null}}function Ke(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,o=0;if(n)for(var c=t.child;c!==null;)a|=c.lanes|c.childLanes,o|=c.subtreeFlags&1206910976,o|=c.flags&1206910976,c.return=t,c=c.sibling;else for(c=t.child;c!==null;)a|=c.lanes|c.childLanes,o|=c.subtreeFlags,o|=c.flags,c.return=t,c=c.sibling;return t.subtreeFlags|=o,t.childLanes=a,n}function PM(t,n,a){var o=n.pendingProps;switch(Vf(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ke(n),null;case 1:return Ke(n),null;case 3:return a=n.stateNode,o=null,t!==null&&(o=t.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),Ea(fn),pt(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(Ns(n)?Aa(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Xf())),Ke(n),null;case 26:var c=n.type,f=n.memoizedState;return t===null?(Aa(n),f!==null?(Ke(n),J_(n,f)):(Ke(n),Lh(n,c,null,o,a))):f?f!==t.memoizedState?(Aa(n),Ke(n),J_(n,f)):(Ke(n),n.flags&=-16777217):(t=t.memoizedProps,t!==o&&Aa(n),Ke(n),Lh(n,c,t,o,a)),null;case 27:if(mt(n),a=L.current,c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&Aa(n);else{if(!o){if(n.stateNode===null)throw Error(r(166));return Ke(n),n.subtreeFlags&=-33554433,null}t=bt.current,Ns(n)?Dg(n):(t=vv(c,o,a),n.stateNode=t,Aa(n))}return Ke(n),n.subtreeFlags&=-33554433,null;case 5:if(mt(n),c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&Aa(n);else{if(!o){if(n.stateNode===null)throw Error(r(166));return Ke(n),n.subtreeFlags&=-33554433,null}if(f=bt.current,Ns(n))Dg(n);else{var v=Tl(L.current);switch(f){case 1:f=v.createElementNS("http://www.w3.org/2000/svg",c);break;case 2:f=v.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;default:switch(c){case"svg":f=v.createElementNS("http://www.w3.org/2000/svg",c);break;case"math":f=v.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;case"script":f=v.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof o.is=="string"?v.createElement("select",{is:o.is}):v.createElement("select"),o.multiple?f.multiple=!0:o.size&&(f.size=o.size);break;default:f=typeof o.is=="string"?v.createElement(c,{is:o.is}):v.createElement(c)}}f[Dt]=n,f[Ot]=o;t:for(v=n.child;v!==null;){if(v.tag===5||v.tag===6)f.appendChild(v.stateNode);else if(v.tag!==4&&v.tag!==27&&v.child!==null){v.child.return=v,v=v.child;continue}if(v===n)break t;for(;v.sibling===null;){if(v.return===null||v.return===n)break t;v=v.return}v.sibling.return=v.return,v=v.sibling}n.stateNode=f;t:switch(Pn(f,c,o),c){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break t;case"img":o=!0;break t;default:o=!1}o&&Aa(n)}}return Ke(n),n.subtreeFlags&=-33554433,Lh(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,a),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==o&&Aa(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(r(166));if(t=L.current,Ns(n)){if(t=n.stateNode,a=n.memoizedProps,o=null,c=wn,c!==null)switch(c.tag){case 27:case 5:o=c.memoizedProps}t[Dt]=n,t=!!(t.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||Q0(t.nodeValue,a)),t||Qa(n,!0)}else t=Tl(t).createTextNode(o),t[Dt]=n,n.stateNode=t}return Ke(n),null;case 31:if(a=n.memoizedState,t===null||t.memoizedState!==null){if(o=Ns(n),a!==null){if(t===null){if(!o)throw Error(r(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(557));t[Dt]=n}else Fr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),t=!1}else a=Xf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return n.flags&256?(ui(n),n):(ui(n),null);if((n.flags&128)!==0)throw Error(r(558))}return Ke(n),null;case 13:if(o=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(c=Ns(n),o!==null&&o.dehydrated!==null){if(t===null){if(!c)throw Error(r(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(r(317));c[Dt]=n}else Fr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),c=!1}else c=Xf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(ui(n),n):(ui(n),null)}return ui(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,t=t!==null&&t.memoizedState!==null,a&&(o=n.child,c=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(c=o.alternate.memoizedState.cachePool.pool),f=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(f=o.memoizedState.cachePool.pool),f!==c&&(o.flags|=2048)),a!==t&&a&&(n.child.flags|=8192),Xc(n,n.updateQueue),Ke(n),null);case 4:return pt(),t===null&&md(n.stateNode.containerInfo),n.flags|=67108864,Ke(n),null;case 10:return Ea(n.type),Ke(n),null;case 19:if(rh(n),o=n.memoizedState,o===null)return Ke(n),null;if(c=(n.flags&128)!==0,f=o.rendering,f===null)if(c)pl(o,!1);else{if(on!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(f=Dc(t),f!==null){for(n.flags|=128,pl(o,!1),t=f.updateQueue,n.updateQueue=t,Xc(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)Tg(a,t),a=a.sibling;return cl(n,Ln.current&1|2),_e&&xa(n,o.treeForkCount),n.child}t=t.sibling}o.tail!==null&&X()>iu&&(n.flags|=128,c=!0,pl(o,!1),n.lanes=4194304)}else{if(!c)if(t=Dc(f),t!==null){if(n.flags|=128,c=!0,t=t.updateQueue,n.updateQueue=t,Xc(n,t),pl(o,!0),o.tail===null&&o.tailMode!=="collapsed"&&o.tailMode!=="visible"&&!f.alternate&&!_e)return Ke(n),null}else 2*X()-o.renderingStartTime>iu&&a!==536870912&&(n.flags|=128,c=!0,pl(o,!1),n.lanes=4194304);o.isBackwards?(f.sibling=n.child,n.child=f):(t=o.last,t!==null?t.sibling=f:n.child=f,o.last=f)}if(o.tail!==null){t=o.tail;t:{for(a=t;a!==null;){if(a.alternate!==null){a=!1;break t}a=a.sibling}a=!0}return o.rendering=t,o.tail=t.sibling,o.renderingStartTime=X(),t.sibling=null,f=Ln.current,f=c?f&1|2:f&1,o.tailMode==="visible"||o.tailMode==="collapsed"||!a||_e?cl(n,f):(a=f,tt(zn,n),tt(Ln,a),jn===null&&(jn=n)),_e&&xa(n,o.treeForkCount),t}return Ke(n),null;case 22:case 23:return ui(n),ih(),o=n.memoizedState!==null,t!==null?t.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(Ke(n),n.subtreeFlags&6&&(n.flags|=8192)):Ke(n),a=n.updateQueue,a!==null&&Xc(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),t!==null&&Jt(jr),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),Ea(fn),Ke(n),null;case 25:return null;case 30:return n.flags|=33554432,Ke(n),null}throw Error(r(156,n.tag))}function BM(t,n){switch(Vf(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return Ea(fn),pt(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return mt(n),null;case 31:if(n.memoizedState!==null){if(ui(n),n.alternate===null)throw Error(r(340));Fr()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(ui(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(r(340));Fr()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return rh(n),t=n.flags,t&65536?(n.flags=t&-65537|128,t=n.memoizedState,t!==null&&(t.rendering=null,t.tail=null),n.flags|=4,n):null;case 4:return pt(),null;case 10:return Ea(n.type),null;case 22:case 23:return ui(n),ih(),t!==null&&Jt(jr),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return Ea(fn),null;case 25:return null;default:return null}}function $_(t,n){switch(Vf(n),n.tag){case 3:Ea(fn),pt();break;case 26:case 27:case 5:mt(n);break;case 4:pt();break;case 31:n.memoizedState!==null&&ui(n);break;case 13:ui(n);break;case 19:rh(n);break;case 10:Ea(n.type);break;case 22:case 23:ui(n),ih(),t!==null&&Jt(jr);break;case 24:Ea(fn)}}function ml(t,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var c=o.next;a=c;do{if((a.tag&t)===t){o=void 0;var f=a.create,v=a.inst;o=f(),v.destroy=o}a=a.next}while(a!==c)}}catch(b){Be(n,n.return,b)}}function sr(t,n,a){try{var o=n.updateQueue,c=o!==null?o.lastEffect:null;if(c!==null){var f=c.next;o=f;do{if((o.tag&t)===t){var v=o.inst,b=v.destroy;if(b!==void 0){v.destroy=void 0,c=n;var P=a,Q=b;try{Q()}catch(ot){Be(c,P,ot)}}}o=o.next}while(o!==f)}}catch(ot){Be(n,n.return,ot)}}function t0(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{Vg(n,a)}catch(o){Be(t,t.return,o)}}}function e0(t,n,a){a.props=Zr(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(o){Be(t,n,o)}}function $i(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var o=t.stateNode;break;case 30:var c=t.stateNode,f=va(t.memoizedProps,c);(c.ref===null||c.ref.name!==f)&&(c.ref=lv(f)),o=c.ref;break;case 7:if(t.stateNode===null){var v=new mi(t);m(t.child,!1,AE,v,void 0,void 0),t.stateNode=v}o=t.stateNode;break;default:o=t.stateNode}typeof a=="function"?t.refCleanup=a(o):a.current=o}}catch(b){Be(t,n,b)}}function On(t,n){var a=t.ref,o=t.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(c){Be(t,n,c)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){Be(t,n,c)}else a.current=null}function Yc(t,n){if((t.tag===5||t.tag===27||t.tag===6)&&t.alternate===null&&n!==null)for(var a=0;a<n.length;a++)pv(t.stateNode,n[a])}function n0(t){for(var n=t.return;n!==null&&(Ph(n)&&pv(t.stateNode,n.stateNode),!Oh(n));)n=n.return}function gl(t){for(var n=t.return;n!==null&&(Ph(n)&&RE(t.stateNode,n.stateNode),!Oh(n));)n=n.return}function Oh(t){return t.tag===5||t.tag===3||t.tag===27}function Ph(t){return t&&t.tag===7&&t.stateNode!==null}function Bh(t){var n=t.type,a=t.memoizedProps,o=t.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break t;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(c){Be(t,t.return,c)}}function Ih(t,n,a){try{var o=t.stateNode;cE(o,t.type,a,n),o[Ot]=n}catch(c){Be(t,t.return,c)}}function i0(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&dr(t.type)||t.tag===4}function Fh(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||i0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&dr(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Hh(t,n,a,o){var c=t.tag;if(c===5||c===6)c=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(c,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(c),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Ki)),Yc(t,o),Ue=!0;else if(c!==4&&(c===27&&(Yc(t,o),o=null,dr(t.type)&&(a=t.stateNode,n=null)),t=t.child,t!==null))for(Hh(t,n,a,o),t=t.sibling;t!==null;)Hh(t,n,a,o),t=t.sibling}function Wc(t,n,a,o){var c=t.tag;if(c===5||c===6)c=t.stateNode,n?a.insertBefore(c,n):a.appendChild(c),Yc(t,o),Ue=!0;else if(c!==4&&(c===27&&(Yc(t,o),o=null,dr(t.type)&&(a=t.stateNode)),t=t.child,t!==null))for(Wc(t,n,a,o),t=t.sibling;t!==null;)Wc(t,n,a,o),t=t.sibling}function a0(t){var n=t.stateNode,a=t.memoizedProps;try{for(var o=t.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);Pn(n,o,a),n[Dt]=t,n[Ot]=a}catch(f){Be(t,t.return,f)}}var qc=!1,fi=null;function r0(t){(t.tag===30||(t.subtreeFlags&33554432)!==0)&&(qc=!0)}var ta=null;function s0(){var t=ta;return ta=null,t}var ti=0;function Fs(t,n,a,o,c){return ti=0,o0(t.child,n,a,o,c)}function o0(t,n,a,o,c){for(var f=!1;t!==null;){if(t.tag===5){var v=t.stateNode;if(o!==null){var b=Ed(v);o.push(b),b.view&&(f=!0)}else f||Ed(v).view&&(f=!0);qc=!0,sv(v,ti===0?n:n+"_"+ti,a),ti++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c||o0(t.child,n,a,o,c)&&(f=!0));t=t.sibling}return f}function ea(t,n){for(;t!==null;)t.tag===5?ov(t.stateNode,t.memoizedProps):(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&n||ea(t.child,n)),t=t.sibling}function Zc(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if((t.tag!==22||t.memoizedState===null)&&(Zc(t),t.tag===30&&(t.flags&18874368)!==0&&t.stateNode.paired)){var n=t.memoizedProps;if(n.name==null||n.name==="auto")throw Error(r(544));var a=n.name;n=ya(n.default,n.share),n!=="none"&&(Fs(t,a,n,null,!1)||ea(t.child,!1))}t=t.sibling}}function kh(t,n){if(t.tag===30){var a=t.stateNode,o=t.memoizedProps,c=va(o,a),f=ya(o.default,a.paired?o.share:o.enter);f!=="none"?Fs(t,c,f,null,!1)?(Zc(t),a.paired||n||Ws(t,o.onEnter)):ea(t.child,!1):Zc(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)kh(t,n),t=t.sibling;else Zc(t)}function Gh(t){if(fi!==null&&fi.size!==0){var n=fi;if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var a=t.memoizedProps,o=a.name;if(o!=null&&o!=="auto"){var c=n.get(o);if(c!==void 0){var f=ya(a.default,a.share);if(f!=="none"&&(Fs(t,o,f,null,!1)?(f=t.stateNode,c.paired=f,f.paired=c,Ws(t,a.onShare)):ea(t.child,!1)),n.delete(o),n.size===0)break}}}Gh(t)}t=t.sibling}}}function Vh(t){if(t.tag===30){var n=t.memoizedProps,a=va(n,t.stateNode),o=fi!==null?fi.get(a):void 0,c=ya(n.default,o!==void 0?n.share:n.exit);c!=="none"&&(Fs(t,a,c,null,!1)?o!==void 0?(c=t.stateNode,o.paired=c,c.paired=o,fi.delete(a),Ws(t,n.onShare)):Ws(t,n.onExit):ea(t.child,!1)),fi!==null&&Gh(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)Vh(t),t=t.sibling;else fi!==null&&Gh(t)}function l0(t){for(t=t.child;t!==null;){if(t.tag===30){var n=t.memoizedProps,a=va(n,t.stateNode);n=ya(n.default,n.update),t.flags&=-5,n!=="none"&&Fs(t,a,n,t.memoizedState=[],!1)}else(t.subtreeFlags&33554432)!==0&&l0(t);t=t.sibling}}function jh(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var n=t.stateNode;n.paired!==null&&(n.paired=null,ea(t.child,!1))}jh(t)}t=t.sibling}}function Kc(t){if(t.tag===30)t.stateNode.paired=null,ea(t.child,!1),jh(t);else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)Kc(t),t=t.sibling;else jh(t)}function c0(t){for(t=t.child;t!==null;)t.tag===30?ea(t.child,!1):(t.subtreeFlags&33554432)!==0&&c0(t),t=t.sibling}function Xh(t,n,a,o,c,f,v){for(var b=!1;n!==null;){if(n.tag===5){var P=n.stateNode;if(f!==null&&ti<f.length){var Q=f[ti],ot=Ed(P);(Q.view||ot.view)&&(b=!0);var _t;if(_t=(t.flags&4)===0)if(ot.clip)_t=!0;else{_t=Q.rect;var W=ot.rect;_t=_t.y!==W.y||_t.x!==W.x||_t.height!==W.height||_t.width!==W.width}_t&&(t.flags|=4),ot.abs?ot=!Q.abs:(Q=Q.rect,ot=ot.rect,ot=Q.height!==ot.height||Q.width!==ot.width),ot&&(t.flags|=32)}else t.flags|=32;(t.flags&4)!==0&&sv(P,ti===0?a:a+"_"+ti,c),b&&(t.flags&4)!==0||(ta===null&&(ta=[]),ta.push(P,ti===0?o:o+"_"+ti,n.memoizedProps)),ti++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&v?t.flags|=n.flags&32:Xh(t,n.child,a,o,c,f,v)&&(b=!0));n=n.sibling}return b}function u0(t,n){for(t=t.child;t!==null;){if(t.tag===30){var a=t.memoizedProps,o=t.stateNode,c=va(a,o),f=ya(a.default,a.update),v;v=t.memoizedState,t.memoizedState=null,o=t;var b=t.child;ti=0,c=Xh(o,b,c,c,f,v,!1),(t.flags&4)!==0&&c&&Ws(t,a.onUpdate)}else(t.subtreeFlags&33554432)!==0&&u0(t);t=t.sibling}}var An=!1,Oe=!1,na=!1,Yh=!1,f0=typeof WeakSet=="function"?WeakSet:Set,Rn=null,ia=!1,_l=!1,Qc=!1,Wh=!1;function IM(t,n,a){if(t=t.containerInfo,vd=io,t=mg(t),zf(t)){if("selectionStart"in t)var o={start:t.selectionStart,end:t.selectionEnd};else t:{o=(o=t.ownerDocument)&&o.defaultView||window;var c=o.getSelection&&o.getSelection();if(c&&c.rangeCount!==0){o=c.anchorNode;var f=c.anchorOffset,v=c.focusNode;c=c.focusOffset;try{o.nodeType,v.nodeType}catch{o=null;break t}var b=0,P=-1,Q=-1,ot=0,_t=0,W=t,rt=null;e:for(;;){for(var zt;W!==o||f!==0&&W.nodeType!==3||(P=b+f),W!==v||c!==0&&W.nodeType!==3||(Q=b+c),W.nodeType===3&&(b+=W.nodeValue.length),(zt=W.firstChild)!==null;)rt=W,W=zt;for(;;){if(W===t)break e;if(rt===o&&++ot===f&&(P=b),rt===v&&++_t===c&&(Q=b),(zt=W.nextSibling)!==null)break;W=rt,rt=W.parentNode}W=zt}o=P===-1||Q===-1?null:{start:P,end:Q}}else o=null}o=o||{start:0,end:0}}else o=null;for(yd={focusedElem:t,selectionRange:o},io=!1,a=(a&335544064)===a,Rn=n,n=a?9270:1024;Rn!==null;){if(t=Rn,a&&(o=t.deletions,o!==null))for(f=0;f<o.length;f++)a&&Vh(o[f]);if(t.alternate===null&&(t.flags&2)!==0)a&&r0(t),Jc(a);else{if(t.tag===22){if(o=t.alternate,t.memoizedState!==null){o!==null&&o.memoizedState===null&&a&&Vh(o),Jc(a);continue}else if(o!==null&&o.memoizedState!==null){a&&r0(t),Jc(a);continue}}o=t.child,(t.subtreeFlags&n)!==0&&o!==null?(o.return=t,Rn=o):(a&&l0(t),Jc(a))}}fi=null}function Jc(t){for(;Rn!==null;){var n=Rn,a=t,o=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((c&1024)!==0&&o!==null){a=void 0,c=o.memoizedProps,o=o.memoizedState;var f=n.stateNode;try{var v=Zr(n.type,c);a=f.getSnapshotBeforeUpdate(v,o),f.__reactInternalSnapshotBeforeUpdate=a}catch(b){Be(n,n.return,b)}}break;case 3:if((c&1024)!==0){if(o=n.stateNode.containerInfo,a=o.nodeType,a===9)wd(o);else if(a===1)switch(o.nodeName){case"HEAD":case"HTML":case"BODY":wd(o);break;default:o.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:a&&o!==null&&(a=va(o.memoizedProps,o.stateNode),c=n.memoizedProps,c=ya(c.default,c.update),c!=="none"&&Fs(o,a,c,o.memoizedState=[],!0));break;default:if((c&1024)!==0)throw Error(r(163))}if(o=n.sibling,o!==null){o.return=n.return,Rn=o;break}Rn=n.return}}function h0(t,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:aa(t,a),o&4&&ml(5,a);break;case 1:if(aa(t,a),o&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(v){Be(a,a.return,v)}else{var c=Zr(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(c,n,t.__reactInternalSnapshotBeforeUpdate)}catch(v){Be(a,a.return,v)}}o&64&&t0(a),o&512&&$i(a,a.return);break;case 3:if(aa(t,a),o&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Vg(t,n)}catch(v){Be(a,a.return,v)}}break;case 27:n===null&&o&4&&a0(a);case 26:case 5:aa(t,a),n===null&&o&4&&Bh(a),o&512&&$i(a,a.return);break;case 12:aa(t,a);break;case 31:aa(t,a),o&4&&g0(t,a);break;case 13:aa(t,a),o&4&&_0(t,a),o&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=KM.bind(null,a),NE(t,a))));break;case 22:if(o=a.memoizedState!==null||An,!o){var f=n!==null&&n.memoizedState!==null||Oe;n=An,c=Oe,An=o,(Oe=f)&&!c?(o=2,(a.subtreeFlags&8772)!==0&&(o|=1),Ii(t,a,o)):aa(t,a),An=n,Oe=c}break;case 30:aa(t,a),o&512&&$i(a,a.return);break;case 7:o&512&&$i(a,a.return);default:aa(t,a)}}function qh(t,n){for(t=t.child;t!==null;)d0(t,n),t=t.sibling}function d0(t,n){switch(t.tag){case 5:case 26:try{var a=t.stateNode;if(n){var o=a.style;typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"}else{var c=t.stateNode,f=t.memoizedProps.style,v=f!=null&&f.hasOwnProperty("display")?f.display:null;c.style.display=v==null||typeof v=="boolean"?"":(""+v).trim()}}catch(P){Be(t,t.return,P)}Zh(t,n);break;case 6:try{t.stateNode.nodeValue=n?"":t.memoizedProps,Ue=!0}catch(P){Be(t,t.return,P)}break;case 18:try{var b=t.stateNode;n?rv(b,!0):rv(t.stateNode,!1)}catch(P){Be(t,t.return,P)}break;case 22:case 23:t.memoizedState===null&&qh(t,n);break;default:qh(t,n)}}function Zh(t,n){if(t.subtreeFlags&67108864)for(t=t.child;t!==null;){t:{var a=t,o=n;switch(a.tag){case 4:d0(a,o);break t;case 22:a.memoizedState===null&&Zh(a,o);break t;default:Zh(a,o)}}t=t.sibling}}function p0(t){var n=t.alternate;n!==null&&(t.alternate=null,p0(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&Me(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var nn=null,ei=!1;function Pi(t,n,a){for(a=a.child;a!==null;)m0(t,n,a),a=a.sibling}function m0(t,n,a){if(Qe&&typeof Qe.onCommitFiberUnmount=="function")try{Qe.onCommitFiberUnmount(Re,a)}catch{}switch(a.tag){case 26:Oe||On(a,n),Pi(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&!Oe&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Oe||On(a,n),gl(a);var o=nn,c=ei;dr(a.type)&&(nn=a.stateNode,ei=!1),Pi(t,n,a),yv(a.stateNode,a.type,a.memoizedProps),nn=o,ei=c;break;case 5:Oe||On(a,n),gl(a);case 6:if(a.tag===6&&gl(a),o=nn,c=ei,nn=null,Pi(t,n,a),nn=o,ei=c,nn!==null)if(ei)try{(nn.nodeType===9?nn.body:nn.nodeName==="HTML"?nn.ownerDocument.body:nn).removeChild(a.stateNode),Ue=!0}catch(f){Be(a,n,f)}else try{nn.removeChild(a.stateNode),Ue=!0}catch(f){Be(a,n,f)}break;case 18:nn!==null&&(ei?(t=nn,av(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),ao(t)):av(nn,a.stateNode));break;case 4:o=nn,c=ei,nn=a.stateNode.containerInfo,ei=!0,Pi(t,n,a),nn=o,ei=c;break;case 0:case 11:case 14:case 15:sr(2,a,n),Oe||sr(4,a,n),Pi(t,n,a);break;case 1:Oe||(On(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&e0(a,n,o)),Pi(t,n,a);break;case 21:Pi(t,n,a);break;case 22:Oe=(o=Oe)||a.memoizedState!==null,Pi(t,n,a),Oe=o;break;case 30:On(a,n),Pi(t,n,a);break;case 7:Oe||On(a,n),Pi(t,n,a);break;default:Pi(t,n,a)}}function g0(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{ao(t)}catch(a){Be(n,n.return,a)}}}function _0(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{ao(t)}catch(a){Be(n,n.return,a)}}function FM(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new f0),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new f0),n;default:throw Error(r(435,t.tag))}}function $c(t,n){var a=FM(t);n.forEach(function(o){if(!a.has(o)){a.add(o);var c=QM.bind(null,t,o);o.then(c,c)}})}function Zn(t,n,a){var o=n.deletions;if(o!==null)for(var c=0;c<o.length;c++){var f=o[c],v=t,b=n,P=b;t:for(;P!==null;){switch(P.tag){case 27:if(dr(P.type)){nn=P.stateNode,ei=!1;break t}break;case 5:nn=P.stateNode,ei=!1;break t;case 3:case 4:nn=P.stateNode.containerInfo,ei=!0;break t}P=P.return}if(nn===null)throw Error(r(160));m0(v,b,f),nn=null,ei=!1,v=f.alternate,v!==null&&(v.return=null),f.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)v0(n,t,a),n=n.sibling}var Bi=null;function v0(t,n,a){var o=t.alternate,c=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(c&4&&(o=t.updateQueue,o=o!==null?o.events:null,o!==null))for(var f=0;f<o.length;f++){var v=o[f];v.ref.impl=v.nextImpl}Zn(n,t,a),Kn(t),c&4&&(sr(3,t,t.return),ml(3,t),sr(5,t,t.return));break;case 1:Zn(n,t,a),Kn(t),c&512&&(Oe||o===null||On(o,o.return)),c&64&&An&&(t=t.updateQueue,t!==null&&(n=t.callbacks,n!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?n:a.concat(n))));break;case 26:if(f=Bi,Zn(n,t,a),Kn(t),c&512&&(Oe||o===null||On(o,o.return)),c&4)if(c=o!==null?o.memoizedState:null,a=t.memoizedState,o===null)if(a===null)if(t.stateNode===null)if(An)t.stateNode=ev(t.type,t.memoizedProps,n.containerInfo,t);else{t:{n=t.type,a=t.memoizedProps,c=f.ownerDocument||f;e:switch(n){case"title":o=c.getElementsByTagName("title")[0],(!o||o[qe]||o[Dt]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=c.createElement(n),c.head.insertBefore(o,c.querySelector("head > title"))),Pn(o,n,a),o[Dt]=t,Je(o),n=o;break t;case"link":if(f=Tv("link","href",c).get(n+(a.href||""))){for(v=0;v<f.length;v++)if(o=f[v],o.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&o.getAttribute("rel")===(a.rel==null?null:a.rel)&&o.getAttribute("title")===(a.title==null?null:a.title)&&o.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){f.splice(v,1);break e}}o=c.createElement(n),Pn(o,n,a),c.head.appendChild(o);break;case"meta":if(f=Tv("meta","content",c).get(n+(a.content||""))){for(v=0;v<f.length;v++)if(o=f[v],o.getAttribute("content")===(a.content==null?null:""+a.content)&&o.getAttribute("name")===(a.name==null?null:a.name)&&o.getAttribute("property")===(a.property==null?null:a.property)&&o.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&o.getAttribute("charset")===(a.charSet==null?null:a.charSet)){f.splice(v,1);break e}}o=c.createElement(n),Pn(o,n,a),c.head.appendChild(o);break;default:throw Error(r(468,n))}o[Dt]=t,Je(o),n=o}t.stateNode=n}else An||zd(f,t.type,t.stateNode);else t.stateNode=bv(f,a,t.memoizedProps);else c!==a?(c===null?(n=o.stateNode,n===null||Oe||n.parentNode.removeChild(n)):c.count--,a===null?An||zd(f,t.type,t.stateNode):bv(f,a,t.memoizedProps)):a===null&&t.stateNode!==null&&Ih(t,t.memoizedProps,o.memoizedProps);break;case 27:Zn(n,t,a),Kn(t),c&512&&(Oe||o===null||On(o,o.return)),o!==null&&c&4&&Ih(t,t.memoizedProps,o.memoizedProps);break;case 5:if(f=na,na=!1,Zn(n,t,a),na=f,Kn(t),c&512&&(Oe||o===null||On(o,o.return)),t.flags&32){n=t.stateNode;try{xs(n,""),Ue=!0}catch(ot){Be(t,t.return,ot)}}c&4&&t.stateNode!=null&&(n=t.memoizedProps,Ih(t,n,o!==null?o.memoizedProps:n)),c&1024&&(Yh=!0);break;case 6:if(Zn(n,t,a),Kn(t),c&4){if(t.stateNode===null)throw Error(r(162));n=t.memoizedProps,a=t.stateNode;try{a.nodeValue=n,Ue=!0}catch(ot){Be(t,t.return,ot)}}break;case 3:if(Ue=!1,pu=null,f=Bi,Bi=wl(n.containerInfo),Zn(n,t,a),Bi=f,Kn(t),c&4&&o!==null&&o.memoizedState.isDehydrated)try{ao(n.containerInfo)}catch(ot){Be(t,t.return,ot)}Yh&&(Yh=!1,y0(t)),Ue=!1;break;case 4:c=na,na=An,o=Fm(),f=Bi,Bi=wl(t.stateNode.containerInfo),Zn(n,t,a),Kn(t),Bi=f,Ue&&_l&&(Qc=!0),Ue=o,na=c;break;case 12:Zn(n,t,a),Kn(t);break;case 31:Zn(n,t,a),Kn(t),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,$c(t,n)));break;case 13:Zn(n,t,a),Kn(t),t.child.flags&8192&&t.memoizedState!==null!=(o!==null&&o.memoizedState!==null)&&(nu=X()),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,$c(t,n)));break;case 22:f=t.memoizedState!==null,v=o!==null&&o.memoizedState!==null;var b=An,P=Oe,Q=na;An=b||f,na=Q||f,Oe=P||v,Zn(n,t,a),Oe=P,na=Q,An=b,Kn(t),c&8192&&(n=t.stateNode,n._visibility=f?n._visibility&-2:n._visibility|1,!f||o===null||v||An||Oe||(n=v||Oe,a=An,o=Oe,An=f||An,Oe=n,or(t,2),An=a,Oe=o),!f&&na||qh(t,f)),c&4&&(n=t.updateQueue,n!==null&&(a=n.retryQueue,a!==null&&(n.retryQueue=null,$c(t,a))));break;case 19:Zn(n,t,a),Kn(t),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,$c(t,n)));break;case 30:c&512&&(Oe||o===null||On(o,o.return)),c=Fm(),f=_l,v=(a&335544064)===a,b=t.memoizedProps,_l=v&&ya(b.default,b.update)!=="none",Zn(n,t,a),Kn(t),v&&o!==null&&Ue&&(t.flags|=4),_l=f,Ue=c;break;case 21:break;case 7:c&512&&(Oe||o===null||On(o,o.return)),o&&o.stateNode!==null&&(o.stateNode._fragmentFiber=t);default:Zn(n,t,a),Kn(t)}}function Kn(t){var n=t.flags;if(n&2){try{for(var a,o=t.return;o!==null;){if(i0(o)){a=o;break}o=o.return}o=null;for(var c=t.return;c!==null;){if(Ph(c)){var f=c.stateNode;o===null?o=[f]:o.push(f)}if(Oh(c))break;c=c.return}var v=o;if(a==null)throw Error(r(160));switch(a.tag){case 27:var b=a.stateNode,P=Fh(t);Wc(t,P,b,v);break;case 5:var Q=a.stateNode;a.flags&32&&(xs(Q,""),a.flags&=-33);var ot=Fh(t);Wc(t,ot,Q,v);break;case 3:case 4:var _t=a.stateNode.containerInfo,W=Fh(t);Hh(t,W,_t,v);break;default:throw Error(r(161))}}catch(rt){Be(t,t.return,rt)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function y0(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;y0(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,io=!0,n.reset(),io=!1),t=t.sibling}}function Hs(t,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)S0(n,t),n=n.sibling;else u0(n)}function S0(t,n){var a=t.alternate;if(a===null)kh(t,!1);else switch(t.tag){case 3:if(Wh=ia=!1,s0(),Hs(n,t),!ia&&!Qc){if(t=ta,t!==null)for(var o=0;o<t.length;o+=3){a=t[o];var c=t[o+1];ov(a,t[o+2]),a=a.ownerDocument.documentElement,a!==null&&a.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+c+")"})}t=n.containerInfo,t=t.nodeType===9?t.documentElement:t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName===""&&(t.style.viewTransitionName="none",t.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),t.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Wh=!0}ta=null;break;case 5:Hs(n,t);break;case 4:o=ia,ia=!1,Hs(n,t),ia&&(Qc=!0),ia=o;break;case 22:t.memoizedState===null&&(a.memoizedState!==null?kh(t,!1):Hs(n,t));break;case 30:o=ia,c=s0(),ia=!1,Hs(n,t),ia&&(t.flags|=4);var f=t.memoizedProps,v=t.stateNode;n=va(f,v),v=va(a.memoizedProps,v);var b=ya(f.default,f.update);b==="none"?n=!1:(f=a.memoizedState,a.memoizedState=null,a=t.child,ti=0,n=Xh(t,a,n,v,b,f,!0),ti!==(f===null?0:f.length)&&(t.flags|=32)),(t.flags&4)!==0&&n?(Ws(t,t.memoizedProps.onUpdate),ta=c):c!==null&&(c.push.apply(c,ta),ta=c),ia=(t.flags&32)!==0?!0:o;break;default:Hs(n,t)}}function aa(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)h0(t,n.alternate,n),n=n.sibling}function or(t,n){for(t=t.child;t!==null;){var a=t,o=n;switch(a.tag){case 0:case 11:case 14:case 15:sr(4,a,a.return),or(a,o);break;case 1:On(a,a.return);var c=a.stateNode;typeof c.componentWillUnmount=="function"&&e0(a,a.return,c),or(a,o);break;case 27:(o&2)!==0&&yv(a.stateNode,a.type,a.memoizedProps);case 5:On(a,a.return),a.tag!==5&&a.tag!==27||gl(a),or(a,o);break;case 6:gl(a);break;case 26:On(a,a.return),c=a.stateNode,a.memoizedState!==null||c===null||Oe||c.parentNode.removeChild(c),or(a,o);break;case 22:a.memoizedState===null&&or(a,o);break;case 30:On(a,a.return),or(a,o);break;case 7:On(a,a.return);default:or(a,o)}t=t.sibling}}function Ii(t,n,a){for(a=(n.subtreeFlags&8772)!==0?a:a&-2,n=n.child;n!==null;){var o=n.alternate,c=t,f=n,v=f.flags,b=(a&1)!==0;switch(f.tag){case 0:case 11:case 15:Ii(c,f,a),ml(4,f);break;case 1:if(Ii(c,f,a),o=f,c=o.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(ot){Be(o,o.return,ot)}if(o=f,c=o.updateQueue,c!==null){var P=o.stateNode;try{var Q=c.shared.hiddenCallbacks;if(Q!==null)for(c.shared.hiddenCallbacks=null,c=0;c<Q.length;c++)Gg(Q[c],P)}catch(ot){Be(o,o.return,ot)}}b&&v&64&&t0(f),$i(f,f.return);break;case 27:(a&2)!==0&&a0(f);case 5:f.tag!==5&&f.tag!==27||n0(f),Ii(c,f,a),b&&o===null&&v&4&&Bh(f),$i(f,f.return);break;case 6:n0(f);break;case 26:P=f.stateNode,f.memoizedState!==null||P===null||An||zd(wl(P.ownerDocument),f.type,P),Ii(c,f,a),b&&o===null&&v&4&&Bh(f),$i(f,f.return);break;case 12:Ii(c,f,a);break;case 31:Ii(c,f,a),b&&v&4&&g0(c,f);break;case 13:Ii(c,f,a),b&&v&4&&_0(c,f);break;case 22:f.memoizedState===null&&Ii(c,f,a),$i(f,f.return);break;case 30:Ii(c,f,a),$i(f,f.return);break;case 7:$i(f,f.return);default:Ii(c,f,a)}n=n.sibling}}function Kh(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&nl(a))}function Qh(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&nl(t))}function Ai(t,n,a,o){var c=(a&335544064)===a;if(n.subtreeFlags&(c?10262:10256))for(n=n.child;n!==null;)x0(t,n,a,o),n=n.sibling;else c&&c0(n)}function x0(t,n,a,o){var c=(a&335544064)===a;c&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&Kc(n);var f=n.flags;switch(n.tag){case 0:case 11:case 15:Ai(t,n,a,o),f&2048&&ml(9,n);break;case 1:Ai(t,n,a,o);break;case 3:Ai(t,n,a,o),c&&Wh&&(t=t.containerInfo,t=t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,t.style.viewTransitionName==="root"&&(t.style.viewTransitionName=""),t=t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName==="none"&&(t.style.viewTransitionName="")),f&2048&&(f=null,n.alternate!==null&&(f=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==f&&(n.refCount++,f!=null&&nl(f)));break;case 12:if(f&2048){Ai(t,n,a,o),f=n.stateNode;try{var v=n.memoizedProps,b=v.id,P=v.onPostCommit;typeof P=="function"&&P(b,n.alternate===null?"mount":"update",f.passiveEffectDuration,-0)}catch(Q){Be(n,n.return,Q)}}else Ai(t,n,a,o);break;case 31:Ai(t,n,a,o);break;case 13:Ai(t,n,a,o);break;case 23:break;case 22:v=n.stateNode,b=n.alternate,n.memoizedState!==null?(c&&b!==null&&b.memoizedState===null&&Kc(b),v._visibility&2?Ai(t,n,a,o):vl(t,n)):(c&&b!==null&&b.memoizedState!==null&&Kc(n),v._visibility&2?Ai(t,n,a,o):(v._visibility|=2,ks(t,n,a,o,(n.subtreeFlags&10256)!==0||!1))),f&2048&&Kh(b,n);break;case 24:Ai(t,n,a,o),f&2048&&Qh(n.alternate,n);break;case 30:c&&(f=n.alternate,f!==null&&(ea(f.child,!0),ea(n.child,!0))),Ai(t,n,a,o);break;default:Ai(t,n,a,o)}}function ks(t,n,a,o,c){for(c=c&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=t,v=n,b=a,P=o,Q=v.flags;switch(v.tag){case 0:case 11:case 15:ks(f,v,b,P,c),ml(8,v);break;case 23:break;case 22:var ot=v.stateNode;v.memoizedState!==null?ot._visibility&2?ks(f,v,b,P,c):vl(f,v):(ot._visibility|=2,ks(f,v,b,P,c)),c&&Q&2048&&Kh(v.alternate,v);break;case 24:ks(f,v,b,P,c),c&&Q&2048&&Qh(v.alternate,v);break;default:ks(f,v,b,P,c)}n=n.sibling}}function vl(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,o=n,c=o.flags;switch(o.tag){case 22:vl(a,o),c&2048&&Kh(o.alternate,o);break;case 24:vl(a,o),c&2048&&Qh(o.alternate,o);break;default:vl(a,o)}n=n.sibling}}var Kr=8192;function Qr(t,n,a){if(t.subtreeFlags&Kr)for(t=t.child;t!==null;)M0(t,n,a),t=t.sibling}function M0(t,n,a){switch(t.tag){case 26:Qr(t,n,a),t.flags&Kr&&(t.memoizedState!==null?XE(a,Bi,t.memoizedState,t.memoizedProps):(t=t.stateNode,(n&335544128)===n&&Cv(a,t)));break;case 5:Qr(t,n,a),t.flags&Kr&&(t=t.stateNode,(n&335544128)===n&&Cv(a,t));break;case 3:case 4:var o=Bi;Bi=wl(t.stateNode.containerInfo),Qr(t,n,a),Bi=o;break;case 22:t.memoizedState===null&&(o=t.alternate,o!==null&&o.memoizedState!==null?(o=Kr,Kr=16777216,Qr(t,n,a),Kr=o):Qr(t,n,a));break;case 30:if((t.flags&Kr)!==0&&(o=t.memoizedProps.name,o!=null&&o!=="auto")){var c=t.stateNode;c.paired=null,fi===null&&(fi=new Map),fi.set(o,c)}Qr(t,n,a);break;default:Qr(t,n,a)}}function E0(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function yl(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];Rn=o,T0(o,t)}E0(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)b0(t),t=t.sibling}function b0(t){switch(t.tag){case 0:case 11:case 15:yl(t),t.flags&2048&&sr(9,t,t.return);break;case 3:yl(t);break;case 12:yl(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,tu(t)):yl(t);break;default:yl(t)}}function tu(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];Rn=o,T0(o,t)}E0(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:sr(8,n,n.return),tu(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,tu(n));break;default:tu(n)}t=t.sibling}}function T0(t,n){for(;Rn!==null;){var a=Rn;switch(a.tag){case 0:case 11:case 15:sr(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:nl(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,Rn=o;else t:for(a=t;Rn!==null;){o=Rn;var c=o.sibling,f=o.return;if(p0(o),o===a){Rn=null;break t}if(c!==null){c.return=f,Rn=c;break t}Rn=f}}}var HM={getCacheForType:function(t){var n=Un(fn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a},cacheSignal:function(){return Un(fn).controller.signal}},kM=typeof WeakMap=="function"?WeakMap:Map,Le=0,Ye=null,Ee=null,we=0,Pe=0,hi=null,lr=!1,Gs=!1,Jh=!1,Ra=0,on=0,cr=0,Jr=0,eu=0,di=0,Vs=0,Sl=null,ni=null,$h=!1,nu=0,w0=0,iu=1/0,au=null,ur=null,an=0,Fi=null,$r=null,ra=0,td=0,ed=null,A0=null,js=null,Xs=null,Ys=null,xl=0,ru=null;function pi(){return(Le&2)!==0&&we!==0?we&-we:Ct.T!==null?fd():$()}function R0(){if(di===0)if((we&536870912)===0||_e){var t=zr;zr<<=1,(zr&3932160)===0&&(zr=262144),di=t}else di=536870912;return t=zn.current,t!==null&&(t.flags|=32),di}function Ws(t,n){if(n!=null){var a=t.stateNode,o=a.ref;o===null&&(o=a.ref=lv(va(t.memoizedProps,a))),Xs===null&&(Xs=[]),Xs.push(n.bind(null,o))}}function ii(t,n,a){(t===Ye&&(Pe===2||Pe===9)||t.cancelPendingCommit!==null)&&(qs(t,0),fr(t,we,di,!1)),Lr(t,a),((Le&2)===0||t!==Ye)&&(t===Ye&&((Le&2)===0&&(Jr|=a),on===4&&fr(t,we,di,!1)),sa(t))}function C0(t,n,a){if((Le&6)!==0)throw Error(r(327));var o=!a&&(n&127)===0&&(n&t.expiredLanes)===0||Xa(t,n),c=o?jM(t,n):id(t,n,!0),f=o;do{if(c===0){Gs&&!o&&fr(t,n,0,!1);break}else{if(a=t.current.alternate,f&&!GM(a)){c=id(t,n,!1),f=!1;continue}if(c===2){if(f=n,t.errorRecoveryDisabledLanes&f)var v=0;else v=t.pendingLanes&-536870913,v=v!==0?v:v&536870912?536870912:0;if(v!==0){n=v;t:{var b=t;c=Sl;var P=b.current.memoizedState.isDehydrated;if(P&&(qs(b,v).flags|=256),v=id(b,v,!1),v!==2&&v!==6){if(Jh&&!P){b.errorRecoveryDisabledLanes|=f,Jr|=f,c=4;break t}f=ni,ni=c,f!==null&&(ni===null?ni=f:ni.push.apply(ni,f))}c=v}if(f=!1,c!==2)continue}}if(c===1){qs(t,0),fr(t,n,0,!0);break}t:{switch(o=t,f=c,f){case 0:case 1:throw Error(r(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:fr(o,n,di,!lr);break t;case 2:ni=null;break;case 3:case 5:break;default:throw Error(r(329))}if((n&62914560)===n&&(c=nu+300-X(),10<c)){if(fr(o,n,di,!lr),pa(o,0,!0)!==0)break t;ra=n,o.timeoutHandle=Md(D0.bind(null,o,a,ni,au,$h,n,di,Jr,Vs,lr,f,"Throttled",-0,0),c);break t}D0(o,a,ni,au,$h,n,di,Jr,Vs,lr,f,null,-0,0)}}break}while(!0);sa(t)}function D0(t,n,a,o,c,f,v,b,P,Q,ot,_t,W,rt){t.timeoutHandle=-1;var zt=n.subtreeFlags,qt=(f&335544064)===f;if(_t=null,(qt||zt&8192||(zt&16785408)===16785408)&&(_t={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ki},fi=null,M0(n,f,_t),qt&&(zt=_t,qt=t.containerInfo,qt=(qt.nodeType===9?qt:qt.ownerDocument).__reactViewTransition,qt!=null&&(zt.count++,zt.waitingForViewTransition=!0,zt=Cl.bind(zt),qt.finished.then(zt,zt))),zt=(f&62914560)===f?nu-X():(f&4194048)===f?w0-X():0,zt=YE(_t,zt),zt!==null)){ra=f,t.cancelPendingCommit=zt(I0.bind(null,t,n,f,a,o,c,v,b,P,Q,ot,_t,null,W,rt)),fr(t,f,v,!Q);return}I0(t,n,f,a,o,c,v,b,P,Q,ot,_t)}function GM(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var c=a[o],f=c.getSnapshot;c=c.value;try{if(!ci(f(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function fr(t,n,a,o){n=Vo(t,n),n&=~eu,n&=~Jr,t.suspendedLanes|=n,t.pingedLanes&=~n,o&&(t.warmLanes|=n),o=t.expirationTimes;for(var c=n;0<c;){var f=31-Gn(c),v=1<<f;o[f]=-1,c&=~v}a!==0&&ic(t,a,n)}function su(){return(Le&6)===0?(Ml(0),!1):!0}function nd(){if(Ee!==null){if(Pe===0)var t=Ee.return;else t=Ee,Ma=Hr=null,uh(t),Ls=null,rl=0,t=Ee;for(;t!==null;)$_(t.alternate,t),t=t.return;Ee=null}}function qs(t,n){var a=t.timeoutHandle;return a!==-1&&(t.timeoutHandle=-1,hE(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),ra=0,nd(),Ye=t,Ee=a=Sa(t.current,null),we=n,Pe=0,hi=null,lr=!1,Gs=Xa(t,n),Jh=!1,Vs=di=eu=Jr=cr=on=0,ni=Sl=null,$h=!1,Ra=Vo(t,n),pc(),a}function N0(t,n){de=null,Ct.H=Fc,n===zs||n===Tc?(n=Ig(),Pe=3):n===Qf?(n=Ig(),Pe=4):Pe=n===Th?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,hi=n,Ee===null&&(on=1,Hc(t,Ei(n,t.current)))}function U0(){var t=zn.current;return t===null?!0:(we&4194048)===we?jn===null:(we&62914560)===we||(we&536870912)!==0?t===jn:!1}function z0(){var t=Ct.H;return Ct.H=Fc,t===null?Fc:t}function L0(){var t=Ct.A;return Ct.A=HM,t}function ou(){on=4,lr||(we&4194048)!==we&&zn.current!==null||(Gs=!0),(cr&134217727)===0&&(Jr&134217727)===0||Ye===null||fr(Ye,we,di,!1)}function id(t,n,a){var o=Le;Le|=2;var c=z0(),f=L0();(Ye!==t||we!==n)&&(au=null,qs(t,n)),n=!1;var v=on;t:do try{if(Pe!==0&&Ee!==null){var b=Ee,P=hi;switch(Pe){case 8:nd(),v=6;break t;case 3:case 2:case 9:case 6:zn.current===null&&(n=!0);var Q=Pe;if(Pe=0,hi=null,Zs(t,b,P,Q),a&&Gs){v=0;break t}break;default:Q=Pe,Pe=0,hi=null,Zs(t,b,P,Q)}}VM(),v=on;break}catch(ot){N0(t,ot)}while(!0);return n&&t.shellSuspendCounter++,Ma=Hr=null,Le=o,Ct.H=c,Ct.A=f,Ee===null&&(Ye=null,we=0,pc()),v}function VM(){for(;Ee!==null;)O0(Ee)}function jM(t,n){var a=Le;Le|=2;var o=z0(),c=L0();Ye!==t||we!==n?(au=null,iu=X()+500,qs(t,n)):Gs=Xa(t,n);t:do try{if(Pe!==0&&Ee!==null){n=Ee;var f=hi;e:switch(Pe){case 1:Pe=0,hi=null,Zs(t,n,f,1);break;case 2:case 9:if(Pg(f)){Pe=0,hi=null,P0(n);break}n=function(){Pe!==2&&Pe!==9||Ye!==t||(Pe=7),sa(t)},f.then(n,n);break t;case 3:Pe=7;break t;case 4:Pe=5;break t;case 7:Pg(f)?(Pe=0,hi=null,P0(n)):(Pe=0,hi=null,Zs(t,n,f,7));break;case 5:var v=null;switch(Ee.tag){case 26:v=Ee.memoizedState;case 5:case 27:var b=Ee;if(v?Av(v):b.stateNode.complete){Pe=0,hi=null;var P=b.sibling;if(P!==null)Ee=P;else{var Q=b.return;Q!==null?(Ee=Q,lu(Q)):Ee=null}break e}}Pe=0,hi=null,Zs(t,n,f,5);break;case 6:Pe=0,hi=null,Zs(t,n,f,6);break;case 8:nd(),on=6;break t;default:throw Error(r(462))}}XM();break}catch(ot){N0(t,ot)}while(!0);return Ma=Hr=null,Ct.H=o,Ct.A=c,Le=a,Ee!==null?0:(Ye=null,we=0,pc(),on)}function XM(){for(;Ee!==null&&!he();)O0(Ee)}function O0(t){var n=Q_(t.alternate,t,Ra);t.memoizedProps=t.pendingProps,n===null?lu(t):Ee=n}function P0(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=j_(a,n,n.pendingProps,n.type,void 0,we);break;case 11:n=j_(a,n,n.pendingProps,n.type.render,n.ref,we);break;case 5:uh(n);var o=n;o===wn&&(_e?(Sc(o),o.tag===5&&o.stateNode!=null&&(Ze=o.stateNode)):(Sc(o),_e=!0));default:$_(a,n),n=Ee=Tg(n,Ra),n=Q_(a,n,Ra)}t.memoizedProps=t.pendingProps,n===null?lu(t):Ee=n}function Zs(t,n,a,o){Ma=Hr=null,uh(n),Ls=null,rl=0;var c=n.return;try{if(UM(t,c,n,a,we)){on=1,Hc(t,Ei(a,t.current)),Ee=null;return}}catch(f){if(c!==null)throw Ee=c,f;on=1,Hc(t,Ei(a,t.current)),Ee=null;return}n.flags&32768?(_e||o===1?t=!0:Gs||(we&536870912)!==0?t=!1:(lr=t=!0,(o===2||o===9||o===3||o===6)&&(o=zn.current,o!==null&&o.tag===13&&(o.flags|=16384))),B0(n,t)):lu(n)}function lu(t){var n=t;do{if((n.flags&32768)!==0){B0(n,lr);return}t=n.return;var a=PM(n.alternate,n,Ra);if(a!==null){Ee=a;return}if(n=n.sibling,n!==null){Ee=n;return}Ee=n=t}while(n!==null);on===0&&(on=5)}function B0(t,n){do{var a=BM(t.alternate,t);if(a!==null){a.flags&=32767,Ee=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){Ee=t;return}Ee=t=a}while(t!==null);on=6,Ee=null}function I0(t,n,a,o,c,f,v,b,P,Q,ot,_t){t.cancelPendingCommit=null;do cu();while(an!==0);if((Le&6)!==0)throw Error(r(327));if(n!==null){if(n===t.current)throw Error(r(177));t===Ye&&(Ee=Ye=null,we=0),$r=n,Fi=t,ra=a,ed=c,A0=o,YM(t,n,a,v,b,P,_t)}}function YM(t,n,a,o,c,f,v){var b=n.lanes|n.childLanes;if(td=b,b|=If,mf(t,a,b,o,c,f),Xs=null,(a&335544064)===a?(Ys=SM(t),o=10262):(Ys=null,o=10256),(n.subtreeFlags&o)!==0||(n.flags&o)!==0?(t.callbackNode=null,t.callbackPriority=0,JM(Ft,function(){return od(),null})):(t.callbackNode=null,t.callbackPriority=0),qc=!1,o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=Ct.T,Ct.T=null,c=kt.p,kt.p=2,f=Le,Le|=4;try{IM(t,n,a)}finally{Le=f,kt.p=c,Ct.T=o}}an=1,qc?js=vE(v,t.containerInfo,Ys,ad,rd,qM,sd,od,WM):(ad(),rd(),sd())}function WM(t){if(an!==0){var n=Fi.onRecoverableError;n(t,{componentStack:null})}}function qM(){an===3&&(an=0,S0($r,Fi),an=4)}function ad(){if(an===1){an=0;var t=Fi,n=$r,a=ra,o=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||o){o=Ct.T,Ct.T=null;var c=kt.p;kt.p=2;var f=Le;Le|=4;try{_l=Qc=!1,v0(n,t,a),a=yd;var v=mg(t.containerInfo),b=a.focusedElem,P=a.selectionRange;if(v!==b&&b&&b.ownerDocument&&pg(b.ownerDocument.documentElement,b)){if(P!==null&&zf(b)){var Q=P.start,ot=P.end;if(ot===void 0&&(ot=Q),"selectionStart"in b)b.selectionStart=Q,b.selectionEnd=Math.min(ot,b.value.length);else{var _t=b.ownerDocument||document,W=_t&&_t.defaultView||window;if(W.getSelection){var rt=W.getSelection(),zt=b.textContent.length,qt=Math.min(P.start,zt),pe=P.end===void 0?qt:Math.min(P.end,zt);!rt.extend&&qt>pe&&(v=pe,pe=qt,qt=v);var K=dg(b,qt),k=dg(b,pe);if(K&&k&&(rt.rangeCount!==1||rt.anchorNode!==K.node||rt.anchorOffset!==K.offset||rt.focusNode!==k.node||rt.focusOffset!==k.offset)){var et=_t.createRange();et.setStart(K.node,K.offset),rt.removeAllRanges(),qt>pe?(rt.addRange(et),rt.extend(k.node,k.offset)):(et.setEnd(k.node,k.offset),rt.addRange(et))}}}}for(_t=[],rt=b;rt=rt.parentNode;)rt.nodeType===1&&_t.push({element:rt,left:rt.scrollLeft,top:rt.scrollTop});for(typeof b.focus=="function"&&b.focus(),b=0;b<_t.length;b++){var gt=_t[b];gt.element.scrollLeft=gt.left,gt.element.scrollTop=gt.top}}io=!!vd,yd=vd=null}finally{Le=f,kt.p=c,Ct.T=o}}t.current=n,an=2}}function rd(){if(an===2){an=0;var t=Fi,n=$r,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=Ct.T,Ct.T=null;var o=kt.p;kt.p=2;var c=Le;Le|=4;try{h0(t,n.alternate,n)}finally{Le=c,kt.p=o,Ct.T=a}}an=3}}function sd(){if(an===4||an===3){an=0;var t=js;js=null,He();var n=Fi,a=$r,o=ra,c=A0,f=(o&335544064)===o?10262:10256;if((a.subtreeFlags&f)!==0||(a.flags&f)!==0?an=5:(an=0,$r=Fi=null,F0(n,n.pendingLanes)),f=n.pendingLanes,f===0&&(ur=null),ut(o),a=a.stateNode,Qe&&typeof Qe.onCommitFiberRoot=="function")try{Qe.onCommitFiberRoot(Re,a,void 0,(a.current.flags&128)===128)}catch{}if(c!==null){a=Ct.T,f=kt.p,kt.p=2,Ct.T=null;try{for(var v=n.onRecoverableError,b=0;b<c.length;b++){var P=c[b];v(P.value,{componentStack:P.stack})}}finally{Ct.T=a,kt.p=f}}if(c=Xs,v=Ys,Ys=null,c!==null&&(Xs=null,v===null&&(v=[]),t!==null))for(P=0;P<c.length;P++)a=(0,c[P])(v),a!==void 0&&t.finished.finally(a);(ra&3)!==0&&cu(),sa(n),f=n.pendingLanes,(o&261930)!==0&&(f&42)!==0?n===ru?xl++:(xl=0,ru=n):(xl=0,ru=null),Ml(0)}}function F0(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,nl(n)))}function cu(){return js!==null&&(js.skipTransition(),js=null),ad(),rd(),sd(),od()}function od(){if(an!==5)return!1;var t=Fi,n=td;td=0;var a=ut(ra),o=Ct.T,c=kt.p;try{kt.p=32>a?32:a,Ct.T=null,a=ed,ed=null;var f=Fi,v=ra;if(an=0,$r=Fi=null,ra=0,(Le&6)!==0)throw Error(r(331));var b=Le;if(Le|=4,b0(f.current),x0(f,f.current,v,a),Le=b,Ml(0,!1),Qe&&typeof Qe.onPostCommitFiberRoot=="function")try{Qe.onPostCommitFiberRoot(Re,f)}catch{}return!0}finally{kt.p=c,Ct.T=o,F0(t,n)}}function H0(t,n,a){n=Ei(a,n),n=bh(t.stateNode,n,2),t=nr(t,n,2),t!==null&&(Lr(t,2),sa(t))}function Be(t,n,a){if(t.tag===3)H0(t,t,a);else for(;n!==null;){if(n.tag===3){H0(n,t,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(ur===null||!ur.has(o))){t=Ei(a,t),a=P_(2),o=nr(n,a,2),o!==null&&(B_(a,o,n,t),Lr(o,2),sa(o));break}}n=n.return}}function ld(t,n,a){var o=t.pingCache;if(o===null){o=t.pingCache=new kM;var c=new Set;o.set(n,c)}else c=o.get(n),c===void 0&&(c=new Set,o.set(n,c));c.has(a)||(Jh=!0,c.add(a),t=ZM.bind(null,t,n,a),n.then(t,t))}function ZM(t,n,a){var o=t.pingCache;o!==null&&o.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,Ye===t&&(we&a)===a&&((on===4||on===3&&(we&62914560)===we&&300>X()-nu)&&(Le&2)===0?qs(t,0):eu|=a,Vs===we&&(Vs=0)),sa(t)}function k0(t,n){n===0&&(n=nc()),t=Br(t,n),t!==null&&(Lr(t,n),sa(t))}function KM(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),k0(t,a)}function QM(t,n){var a=0;switch(t.tag){case 31:case 13:var o=t.stateNode,c=t.memoizedState;c!==null&&(a=c.retryLane);break;case 19:o=t.stateNode;break;case 22:o=t.stateNode._retryCache;break;default:throw Error(r(314))}o!==null&&o.delete(n),k0(t,a)}function JM(t,n){return jt(t,n)}var Ks=null,Qs=null,cd=!1,uu=!1,ud=!1,hr=0;function sa(t){t!==Qs&&t.next===null&&(Qs===null?Ks=Qs=t:Qs=Qs.next=t),uu=!0,cd||(cd=!0,tE())}function Ml(t,n){if(!ud&&uu){ud=!0;do for(var a=!1,o=Ks;o!==null;){if(t!==0){var c=o.pendingLanes;if(c===0)var f=0;else{var v=o.suspendedLanes,b=o.pingedLanes;f=(1<<31-Gn(42|t)+1)-1,f&=c&~(v&~b),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,X0(o,f))}else f=we,f=pa(o,o===Ye?f:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(f&3)===0||Xa(o,f)||(a=!0,X0(o,f));o=o.next}while(a);ud=!1}}function $M(){G0()}function G0(){uu=cd=!1;var t=0;hr!==0&&fE()&&(t=hr);for(var n=X(),a=null,o=Ks;o!==null;){var c=o.next,f=V0(o,n);f===0?(o.next=null,a===null?Ks=c:a.next=c,c===null&&(Qs=a)):(a=o,(t!==0||(f&3)!==0)&&(uu=!0)),o=c}an!==0&&an!==5||Ml(t),hr!==0&&(hr=0)}function V0(t,n){for(var a=t.suspendedLanes,o=t.pingedLanes,c=t.expirationTimes,f=t.pendingLanes&-62914561;0<f;){var v=31-Gn(f),b=1<<v,P=c[v];P===-1?((b&a)===0||(b&o)!==0)&&(c[v]=pf(b,n)):P<=n&&(t.expiredLanes|=b),f&=~b}if(n=Ye,a=we,a=pa(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o=t.callbackNode,a===0||t===n&&(Pe===2||Pe===9)||t.cancelPendingCommit!==null)return o!==null&&o!==null&&ye(o),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||Xa(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(o!==null&&ye(o),ut(a)){case 2:case 8:a=xt;break;case 32:a=Ft;break;case 268435456:a=ue;break;default:a=Ft}return o=j0.bind(null,t),a=jt(a,o),t.callbackPriority=n,t.callbackNode=a,n}return o!==null&&o!==null&&ye(o),t.callbackPriority=2,t.callbackNode=null,2}function j0(t,n){if(an!==0&&an!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(cu()&&t.callbackNode!==a)return null;var o=we;return o=pa(t,t===Ye?o:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o===0?null:(C0(t,o,n),V0(t,X()),t.callbackNode!=null&&t.callbackNode===a?j0.bind(null,t):null)}function X0(t,n){if(cu())return null;C0(t,n,!0)}function tE(){dE(function(){(Le&6)!==0?jt(dt,$M):G0()})}function fd(){if(hr===0){var t=Vr;t===0&&(t=Ur,Ur<<=1,(Ur&261888)===0&&(Ur=256)),hr=t}return hr}function Y0(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:sc(t)}function eE(t,n,a,o,c){if(n==="submit"&&a&&a.stateNode===c){var f=Y0((c[Ot]||null).action),v=o.submitter;v&&(n=(n=v[Ot]||null)?Y0(n.formAction):v.getAttribute("formAction"),n!==null&&(f=n,v=null));var b=new uc("action","action",null,o,c);t.push({event:b,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(hr!==0){var P=new FormData(c,v);yh(a,{pending:!0,data:P,method:c.method,action:f},null,P)}}else typeof f=="function"&&(b.preventDefault(),P=new FormData(c,v),yh(a,{pending:!0,data:P,method:c.method,action:f},f,P))},currentTarget:c}]})}}for(var hd=0;hd<Bf.length;hd++){var dd=Bf[hd],nE=dd.toLowerCase(),iE=dd[0].toUpperCase()+dd.slice(1);Oi(nE,"on"+iE)}Oi(vg,"onAnimationEnd"),Oi(yg,"onAnimationIteration"),Oi(Sg,"onAnimationStart"),Oi("dblclick","onDoubleClick"),Oi("focusin","onFocus"),Oi("focusout","onBlur"),Oi(hM,"onTransitionRun"),Oi(dM,"onTransitionStart"),Oi(pM,"onTransitionCancel"),Oi(xg,"onTransitionEnd"),_n("onMouseEnter",["mouseout","mouseover"]),_n("onMouseLeave",["mouseout","mouseover"]),_n("onPointerEnter",["pointerout","pointerover"]),_n("onPointerLeave",["pointerout","pointerover"]),un("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),un("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),un("onBeforeInput",["compositionend","keypress","textInput","paste"]),un("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),un("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),un("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var El="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),aE=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(El));function W0(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var o=t[a],c=o.event;o=o.listeners;t:{var f=void 0;if(n)for(var v=o.length-1;0<=v;v--){var b=o[v],P=b.instance,Q=b.currentTarget;if(b=b.listener,P!==f&&c.isPropagationStopped())break t;f=b,c.currentTarget=Q;try{f(c)}catch(ot){dc(ot)}c.currentTarget=null,f=P}else for(v=0;v<o.length;v++){if(b=o[v],P=b.instance,Q=b.currentTarget,b=b.listener,P!==f&&c.isPropagationStopped())break t;f=b,c.currentTarget=Q;try{f(c)}catch(ot){dc(ot)}c.currentTarget=null,f=P}}}}function be(t,n){var a=n[oe];a===void 0&&(a=n[oe]=new Set);var o=t+"__bubble";a.has(o)||(q0(n,t,2,!1),a.add(o))}function pd(t,n,a){var o=0;n&&(o|=4),q0(a,t,o,n)}var fu="_reactListening"+Math.random().toString(36).slice(2);function md(t){if(!t[fu]){t[fu]=!0,Ya.forEach(function(a){a!=="selectionchange"&&(aE.has(a)||pd(a,!1,t),pd(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[fu]||(n[fu]=!0,pd("selectionchange",!1,n))}}function q0(t,n,a,o){switch(Bv(n)){case 2:var c=KE;break;case 8:c=QE;break;default:c=Od}a=c.bind(null,n,a,t),c=void 0,!Ef||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),o?c!==void 0?t.addEventListener(n,a,{capture:!0,passive:c}):t.addEventListener(n,a,!0):c!==void 0?t.addEventListener(n,a,{passive:c}):t.addEventListener(n,a,!1)}function gd(t,n,a,o,c){var f=o;if((n&1)===0&&(n&2)===0&&o!==null)t:for(;;){if(o===null)return;var v=o.tag;if(v===3||v===4){var b=o.stateNode.containerInfo;if(b===c)break;if(v===4)for(v=o.return;v!==null;){var P=v.tag;if((P===3||P===4)&&v.stateNode.containerInfo===c)return;v=v.return}for(;b!==null;){if(v=Kt(b),v===null)return;if(P=v.tag,P===5||P===6||P===26||P===27){o=f=v;continue t}b=b.parentNode}}o=o.return}qm(function(){var Q=f,ot=xf(a),_t=[];t:{var W=Mg.get(t);if(W!==void 0){var rt=uc,zt=t;switch(t){case"keypress":if(lc(a)===0)break t;case"keydown":case"keyup":rt=Gx;break;case"focusin":zt="focus",rt=Af;break;case"focusout":zt="blur",rt=Af;break;case"beforeblur":case"afterblur":rt=Af;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":rt=Qm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":rt=Dx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":rt=Wx;break;case vg:case yg:case Sg:rt=zx;break;case xg:rt=Zx;break;case"scroll":case"scrollend":rt=Rx;break;case"wheel":rt=Qx;break;case"copy":case"cut":case"paste":rt=Ox;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":rt=$m;break;case"submit":rt=Xx;break;case"toggle":case"beforetoggle":rt=$x}var qt=(n&4)!==0,pe=!qt&&(t==="scroll"||t==="scrollend"),K=qt?W!==null?W+"Capture":null:W;qt=[];for(var k=Q,et;k!==null;){var gt=k;if(et=gt.stateNode,gt=gt.tag,gt!==5&&gt!==26&&gt!==27||et===null||K===null||(gt=Xo(k,K),gt!=null&&qt.push(bl(k,gt,et))),pe)break;k=k.return}0<qt.length&&(W=new rt(W,zt,null,a,ot),_t.push({event:W,listeners:qt}))}}if((n&7)===0){t:{if(rt=t==="mouseover"||t==="pointerover",W=t==="mouseout"||t==="pointerout",rt&&a!==Sf&&(zt=a.relatedTarget||a.fromElement)&&(Kt(zt)||zt[ne]))break t;(W||rt)&&(zt=ot.window===ot?ot:(rt=ot.ownerDocument)?rt.defaultView||rt.parentWindow:window,W?(rt=a.relatedTarget||a.toElement,W=Q,rt=rt?Kt(rt):null,rt!==null&&(pe=u(rt),qt=rt.tag,rt!==pe||qt!==5&&qt!==27&&qt!==6)&&(rt=null)):(W=null,rt=Q),W!==rt&&(qt=Qm,gt="onMouseLeave",K="onMouseEnter",k="mouse",(t==="pointerout"||t==="pointerover")&&(qt=$m,gt="onPointerLeave",K="onPointerEnter",k="pointer"),pe=W==null?zt:Te(W),et=rt==null?zt:Te(rt),zt=new qt(gt,k+"leave",W,a,ot),zt.target=pe,zt.relatedTarget=et,gt=null,Kt(ot)===Q&&(qt=new qt(K,k+"enter",rt,a,ot),qt.target=et,qt.relatedTarget=pe,gt=qt),pe=gt,qt=W&&rt?F(W,rt,rE):null,W!==null&&Z0(_t,zt,W,qt,!1),rt!==null&&pe!==null&&Z0(_t,pe,rt,qt,!0)))}t:{if(W=Q?Te(Q):window,rt=W.nodeName&&W.nodeName.toLowerCase(),rt==="select"||rt==="input"&&W.type==="file")var Vt=og;else if(rg(W))if(lg)Vt=cM;else{Vt=oM;var Ae=sM}else rt=W.nodeName,!rt||rt.toLowerCase()!=="input"||W.type!=="checkbox"&&W.type!=="radio"?Q&&yf(Q.elementType)&&(Vt=og):Vt=lM;if(Vt&&(Vt=Vt(t,Q))){sg(_t,Vt,a,ot);break t}Ae&&Ae(t,W,Q)}switch(Ae=Q?Te(Q):window,t){case"focusin":(rg(Ae)||Ae.contentEditable==="true")&&(Ts=Ae,Lf=Q,$o=null);break;case"focusout":$o=Lf=Ts=null;break;case"mousedown":Of=!0;break;case"contextmenu":case"mouseup":case"dragend":Of=!1,gg(_t,a,ot);break;case"selectionchange":if(fM)break;case"keydown":case"keyup":gg(_t,a,ot)}var Qt;if(Cf)t:{switch(t){case"compositionstart":var ae="onCompositionStart";break t;case"compositionend":ae="onCompositionEnd";break t;case"compositionupdate":ae="onCompositionUpdate";break t}ae=void 0}else bs?ig(t,a)&&(ae="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(ae="onCompositionStart");ae&&(tg&&a.locale!=="ko"&&(bs||ae!=="onCompositionStart"?ae==="onCompositionEnd"&&bs&&(Qt=Zm()):(Wa=ot,bf="value"in Wa?Wa.value:Wa.textContent,bs=!0)),Ae=hu(Q,ae),0<Ae.length&&(ae=new Jm(ae,t,null,a,ot),_t.push({event:ae,listeners:Ae}),Qt?ae.data=Qt:(Qt=ag(a),Qt!==null&&(ae.data=Qt)))),(Qt=eM?nM(t,a):iM(t,a))&&(ae=hu(Q,"onBeforeInput"),0<ae.length&&(Ae=new Jm("onBeforeInput","beforeinput",null,a,ot),_t.push({event:Ae,listeners:ae}),Ae.data=Qt)),eE(_t,t,Q,a,ot)}W0(_t,n)})}function bl(t,n,a){return{instance:t,listener:n,currentTarget:a}}function hu(t,n){for(var a=n+"Capture",o=[];t!==null;){var c=t,f=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||f===null||(c=Xo(t,a),c!=null&&o.unshift(bl(t,c,f)),c=Xo(t,n),c!=null&&o.push(bl(t,c,f))),t.tag===3)return o;t=t.return}return[]}function rE(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function Z0(t,n,a,o,c){for(var f=n._reactName,v=[];a!==null&&a!==o;){var b=a,P=b.alternate,Q=b.stateNode;if(b=b.tag,P!==null&&P===o)break;b!==5&&b!==26&&b!==27||Q===null||(P=Q,c?(Q=Xo(a,f),Q!=null&&v.unshift(bl(a,Q,P))):c||(Q=Xo(a,f),Q!=null&&v.push(bl(a,Q,P)))),a=a.return}v.length!==0&&t.push({event:n,listeners:v})}var sE=/\r\n?/g,oE=/\u0000|\uFFFD/g;function K0(t){return(typeof t=="string"?t:""+t).replace(sE,`
`).replace(oE,"")}function Q0(t,n){return n=K0(n),K0(t)===n}function Ie(t,n,a,o,c,f){switch(a){case"children":if(typeof o=="string")n==="body"||n==="textarea"&&o===""||xs(t,o);else if(typeof o=="number"||typeof o=="bigint")n!=="body"&&xs(t,""+o);else return;break;case"className":rc(t,"class",o);break;case"tabIndex":rc(t,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":rc(t,a,o);break;case"style":Ym(t,o,f);return;case"data":if(n!=="object"){rc(t,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=sc(o),t.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&Ie(t,n,"name",c.name,c,null),Ie(t,n,"formEncType",c.formEncType,c,null),Ie(t,n,"formMethod",c.formMethod,c,null),Ie(t,n,"formTarget",c.formTarget,c,null)):(Ie(t,n,"encType",c.encType,c,null),Ie(t,n,"method",c.method,c,null),Ie(t,n,"target",c.target,c,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=sc(o),t.setAttribute(a,o);break;case"onClick":o!=null&&(t.onclick=Ki);return;case"onScroll":o!=null&&be("scroll",t);return;case"onScrollEnd":o!=null&&be("scrollend",t);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(r(61));if(a=o.__html,a!=null){if(c.children!=null)throw Error(r(60));f?.__html!==a&&(t.innerHTML=a)}}break;case"multiple":t.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":t.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){t.removeAttribute("xlink:href");break}a=sc(o),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,o):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":o===!0?t.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,o):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?t.setAttribute(a,o):t.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?t.removeAttribute(a):t.setAttribute(a,o);break;case"popover":be("beforetoggle",t),be("toggle",t),ac(t,"popover",o);break;case"xlinkActuate":ga(t,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":ga(t,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":ga(t,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":ga(t,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":ga(t,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":ga(t,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":ga(t,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":ga(t,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":ga(t,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":ac(t,"is",o);break;case"innerText":case"textContent":return;default:if(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")a=wx.get(a)||a,ac(t,a,o);else return}Ue=!0}function _d(t,n,a,o,c,f){switch(a){case"style":Ym(t,o,f);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(r(61));if(a=o.__html,a!=null){if(c.children!=null)throw Error(r(60));f?.__html!==a&&(t.innerHTML=a)}}break;case"children":if(typeof o=="string")xs(t,o);else if(typeof o=="number"||typeof o=="bigint")xs(t,""+o);else return;break;case"onScroll":o!=null&&be("scroll",t);return;case"onScrollEnd":o!=null&&be("scrollend",t);return;case"onClick":o!=null&&(t.onclick=Ki);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!Xe.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),f=a.slice(2,c?a.length-7:void 0),n=t[Ot]||null,n=n!=null?n[a]:null,typeof n=="function"&&t.removeEventListener(f,n,c),typeof o=="function")){typeof n!="function"&&n!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(f,o,c);break t}Ue=!0,a in t?t[a]=o:o===!0?t.setAttribute(a,""):ac(t,a,o)}return}Ue=!0}function Pn(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":be("error",t),be("load",t);var o=!1,c=!1,f;for(f in a)if(a.hasOwnProperty(f)){var v=a[f];if(v!=null)switch(f){case"src":o=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Ie(t,n,f,v,a,null)}}c&&Ie(t,n,"srcSet",a.srcSet,a,null),o&&Ie(t,n,"src",a.src,a,null);return;case"input":be("invalid",t);var b=f=v=c=null,P=null,Q=null;for(o in a)if(a.hasOwnProperty(o)){var ot=a[o];if(ot!=null)switch(o){case"name":c=ot;break;case"type":v=ot;break;case"checked":P=ot;break;case"defaultChecked":Q=ot;break;case"value":f=ot;break;case"defaultValue":b=ot;break;case"children":case"dangerouslySetInnerHTML":if(ot!=null)throw Error(r(137,n));break;default:Ie(t,n,o,ot,a,null)}}Gm(t,f,b,P,Q,v,c,!1);return;case"select":be("invalid",t),o=v=f=null;for(c in a)if(a.hasOwnProperty(c)&&(b=a[c],b!=null))switch(c){case"value":f=b;break;case"defaultValue":v=b;break;case"multiple":o=b;default:Ie(t,n,c,b,a,null)}n=f,a=v,t.multiple=!!o,n!=null?Ss(t,!!o,n,!1):a!=null&&Ss(t,!!o,a,!0);return;case"textarea":be("invalid",t),f=c=o=null;for(v in a)if(a.hasOwnProperty(v)&&(b=a[v],b!=null))switch(v){case"value":o=b;break;case"defaultValue":c=b;break;case"children":f=b;break;case"dangerouslySetInnerHTML":if(b!=null)throw Error(r(91));break;default:Ie(t,n,v,b,a,null)}jm(t,o,c,f);return;case"option":for(P in a)if(a.hasOwnProperty(P)&&(o=a[P],o!=null))switch(P){case"selected":t.selected=o&&typeof o!="function"&&typeof o!="symbol";break;default:Ie(t,n,P,o,a,null)}return;case"dialog":be("beforetoggle",t),be("toggle",t),be("cancel",t),be("close",t);break;case"iframe":case"object":be("load",t);break;case"video":case"audio":for(o=0;o<El.length;o++)be(El[o],t);break;case"image":be("error",t),be("load",t);break;case"details":be("toggle",t);break;case"embed":case"source":case"link":be("error",t),be("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(Q in a)if(a.hasOwnProperty(Q)&&(o=a[Q],o!=null))switch(Q){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Ie(t,n,Q,o,a,null)}return;default:if(yf(n)){for(ot in a)a.hasOwnProperty(ot)&&(o=a[ot],o!==void 0&&_d(t,n,ot,o,a,void 0));return}}for(b in a)a.hasOwnProperty(b)&&(o=a[b],o!=null&&Ie(t,n,b,o,a,null))}var lE={};function cE(t,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,f=null,v=null,b=null,P=null,Q=null,ot=null;for(rt in a){var _t=a[rt];if(a.hasOwnProperty(rt)&&_t!=null)switch(rt){case"checked":break;case"value":break;case"defaultValue":P=_t;default:o.hasOwnProperty(rt)||Ie(t,n,rt,null,o,_t)}}for(var W in o){var rt=o[W];if(_t=a[W],o.hasOwnProperty(W)&&(rt!=null||_t!=null))switch(W){case"type":rt!==_t&&(Ue=!0),f=rt;break;case"name":rt!==_t&&(Ue=!0),c=rt;break;case"checked":rt!==_t&&(Ue=!0),Q=rt;break;case"defaultChecked":rt!==_t&&(Ue=!0),ot=rt;break;case"value":rt!==_t&&(Ue=!0),v=rt;break;case"defaultValue":rt!==_t&&(Ue=!0),b=rt;break;case"children":case"dangerouslySetInnerHTML":if(rt!=null)throw Error(r(137,n));break;default:rt!==_t&&Ie(t,n,W,rt,o,_t)}}_f(t,v,b,P,Q,ot,f,c);return;case"select":rt=v=b=W=null;for(f in a)if(P=a[f],a.hasOwnProperty(f)&&P!=null)switch(f){case"value":break;case"multiple":rt=P;default:o.hasOwnProperty(f)||Ie(t,n,f,null,o,P)}for(c in o)if(f=o[c],P=a[c],o.hasOwnProperty(c)&&(f!=null||P!=null))switch(c){case"value":f!==P&&(Ue=!0),W=f;break;case"defaultValue":f!==P&&(Ue=!0),b=f;break;case"multiple":f!==P&&(Ue=!0),v=f;default:f!==P&&Ie(t,n,c,f,o,P)}n=b,a=v,o=rt,W!=null?Ss(t,!!a,W,!1):!!o!=!!a&&(n!=null?Ss(t,!!a,n,!0):Ss(t,!!a,a?[]:"",!1));return;case"textarea":rt=W=null;for(b in a)if(c=a[b],a.hasOwnProperty(b)&&c!=null&&!o.hasOwnProperty(b))switch(b){case"value":break;case"children":break;default:Ie(t,n,b,null,o,c)}for(v in o)if(c=o[v],f=a[v],o.hasOwnProperty(v)&&(c!=null||f!=null))switch(v){case"value":c!==f&&(Ue=!0),W=c;break;case"defaultValue":c!==f&&(Ue=!0),rt=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(r(91));break;default:c!==f&&Ie(t,n,v,c,o,f)}Vm(t,W,rt);return;case"option":for(var zt in a)if(W=a[zt],a.hasOwnProperty(zt)&&W!=null&&!o.hasOwnProperty(zt))switch(zt){case"selected":t.selected=!1;break;default:Ie(t,n,zt,null,o,W)}for(P in o)if(W=o[P],rt=a[P],o.hasOwnProperty(P)&&W!==rt&&(W!=null||rt!=null))switch(P){case"selected":W!==rt&&(Ue=!0),t.selected=W&&typeof W!="function"&&typeof W!="symbol";break;default:Ie(t,n,P,W,o,rt)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var qt in a)W=a[qt],a.hasOwnProperty(qt)&&W!=null&&!o.hasOwnProperty(qt)&&Ie(t,n,qt,null,o,W);for(Q in o)if(W=o[Q],rt=a[Q],o.hasOwnProperty(Q)&&W!==rt&&(W!=null||rt!=null))switch(Q){case"children":case"dangerouslySetInnerHTML":if(W!=null)throw Error(r(137,n));break;default:Ie(t,n,Q,W,o,rt)}return;default:if(yf(n)){for(var pe in a)W=a[pe],a.hasOwnProperty(pe)&&W!==void 0&&!o.hasOwnProperty(pe)&&_d(t,n,pe,void 0,o,W);for(ot in o)W=o[ot],rt=a[ot],!o.hasOwnProperty(ot)||W===rt||W===void 0&&rt===void 0||_d(t,n,ot,W,o,rt);return}}for(var K in a)W=a[K],a.hasOwnProperty(K)&&W!=null&&!o.hasOwnProperty(K)&&Ie(t,n,K,null,o,W);for(_t in o)W=o[_t],rt=a[_t],!o.hasOwnProperty(_t)||W===rt||W==null&&rt==null||Ie(t,n,_t,W,o,rt)}function J0(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function uE(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var c=a[o],f=c.transferSize,v=c.initiatorType,b=c.duration;if(f&&b&&J0(v)){for(v=0,b=c.responseEnd,o+=1;o<a.length;o++){var P=a[o],Q=P.startTime;if(Q>b)break;var ot=P.transferSize,_t=P.initiatorType;ot&&J0(_t)&&(P=P.responseEnd,v+=ot*(P<b?1:(b-Q)/(P-Q)))}if(--o,n+=8*(f+v)/(c.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var vd=null,yd=null;function Tl(t){return t.nodeType===9?t:t.ownerDocument}function $0(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function tv(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function ev(t,n,a,o){return a=Tl(a).createElement(t),a[Dt]=o,a[Ot]=n,Pn(a,t,n),Je(a),a}function Sd(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var xd=null;function fE(){var t=window.event;return t&&t.type==="popstate"?t===xd?!1:(xd=t,!0):(xd=null,!1)}var Md=typeof setTimeout=="function"?setTimeout:void 0,hE=typeof clearTimeout=="function"?clearTimeout:void 0,nv=typeof Promise=="function"?Promise:void 0,iv=typeof requestAnimationFrame=="function"?requestAnimationFrame:Md,dE=typeof queueMicrotask=="function"?queueMicrotask:typeof nv<"u"?function(t){return nv.resolve(null).then(t).catch(pE)}:Md;function pE(t){setTimeout(function(){throw t})}function dr(t){return t==="head"}function av(t,n){var a=n,o=0;do{var c=a.nextSibling;if(t.removeChild(a),c&&c.nodeType===8)if(a=c.data,a==="/$"||a==="/&"){if(o===0){t.removeChild(c),ao(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Dd(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,Dd(a);for(var f=a.firstChild;f;){var v=f.nextSibling,b=f.nodeName;f[qe]||b==="SCRIPT"||b==="STYLE"||b==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=v}}else a==="body"&&Dd(t.ownerDocument.body);a=c}while(a);ao(n)}function rv(t,n){var a=t;t=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=o}while(a)}function sv(t,n,a){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,t.style.viewTransitionName=n,a!=null&&(t.style.viewTransitionClass=a),a=getComputedStyle(t),a.display==="inline"){if(n=t.getClientRects(),n.length===1)var o=1;else for(var c=o=0;c<n.length;c++){var f=n[c];0<f.width&&0<f.height&&o++}o===1&&(t=t.style,t.display=n.length===1?"inline-block":"block",t.marginTop="-"+a.paddingTop,t.marginBottom="-"+a.paddingBottom)}}function ov(t,n){t=t.style,n=n.style;var a=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;t.viewTransitionName=a==null||typeof a=="boolean"?"":(""+a).trim(),a=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,t.viewTransitionClass=a==null||typeof a=="boolean"?"":(""+a).trim(),t.display==="inline-block"&&(n==null?t.display=t.margin="":(a=n.display,t.display=a==null||typeof a=="boolean"?"":a,a=n.margin,a!=null?t.margin=a:(a=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],t.marginTop=a==null||typeof a=="boolean"?"":a,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],t.marginBottom=n==null||typeof n=="boolean"?"":n)))}function mE(t,n,a){return a=a.ownerDocument.defaultView,{rect:t,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=t.bottom&&0<=t.right&&t.top<=a.innerHeight&&t.left<=a.innerWidth}}function Ed(t){var n=t.getBoundingClientRect(),a=getComputedStyle(t);return mE(n,a,t)}function gE(t){return t.documentElement.clientHeight}function _E(t){this.addEventListener("load",t),this.addEventListener("error",t)}function vE(t,n,a,o,c,f,v,b,P){var Q=n.nodeType===9?n:n.ownerDocument;try{var ot=Q.startViewTransition({update:function(){var W=Q.defaultView,rt=W.navigation&&W.navigation.transition,zt=Q.fonts.status;o();var qt=[];if(zt==="loaded"&&(gE(Q),Q.fonts.status==="loading"&&qt.push(Q.fonts.ready)),zt=qt.length,t!==null)for(var pe=t.suspenseyImages,K=0,k=0;k<pe.length;k++){var et=pe[k];if(!et.complete){var gt=et.getBoundingClientRect();if(0<gt.bottom&&0<gt.right&&gt.top<W.innerHeight&&gt.left<W.innerWidth){if(K+=Rv(et),K>mu){qt.length=zt;break}et=new Promise(_E.bind(et)),qt.push(et)}}}if(0<qt.length)return W=Promise.race([Promise.all(qt),new Promise(function(Vt){return setTimeout(Vt,500)})]).then(c,c),(rt?Promise.allSettled([rt.finished,W]):W).then(f,f);if(c(),rt)return rt.finished.then(f,f);f()},types:a});Q.__reactViewTransition=ot;var _t=[];return ot.ready.then(function(){for(var W=Q.documentElement.getAnimations({subtree:!0}),rt=0;rt<W.length;rt++){var zt=W[rt],qt=zt.effect,pe=qt.pseudoElement;if(pe!=null&&pe.startsWith("::view-transition")){_t.push(zt),zt=qt.getKeyframes();for(var K=pe=void 0,k=!0,et=0;et<zt.length;et++){var gt=zt[et],Vt=gt.width;if(pe===void 0)pe=Vt;else if(pe!==Vt){k=!1;break}if(Vt=gt.height,K===void 0)K=Vt;else if(K!==Vt){k=!1;break}delete gt.width,delete gt.height,gt.transform==="none"&&delete gt.transform}k&&pe!==void 0&&K!==void 0&&(qt.setKeyframes(zt),k=getComputedStyle(qt.target,qt.pseudoElement),k.width!==pe||k.height!==K)&&(k=zt[0],k.width=pe,k.height=K,k=zt[zt.length-1],k.width=pe,k.height=K,qt.setKeyframes(zt))}}v()},function(W){Q.__reactViewTransition===ot&&(Q.__reactViewTransition=null);try{if(typeof W=="object"&&W!==null)switch(W.name){case"InvalidStateError":(W.message==="View transition was skipped because document visibility state is hidden."||W.message==="Skipping view transition because document visibility state has become hidden."||W.message==="Skipping view transition because viewport size changed."||W.message==="Transition was aborted because of invalid state")&&(W=null)}W!==null&&P(W)}finally{o(),c(),v()}}),ot.finished.finally(function(){for(var W=0;W<_t.length;W++)_t[W].cancel();Q.__reactViewTransition===ot&&(Q.__reactViewTransition=null),b()}),ot}catch{return o(),c(),v(),null}}function ts(t,n){this._scope=document.documentElement,this._selector="::view-transition-"+t+"("+n+")"}ts.prototype.animate=function(t,n){return n=typeof n=="number"?{duration:n}:z({},n),n.pseudoElement=this._selector,this._scope.animate(t,n)},ts.prototype.getAnimations=function(){for(var t=this._scope,n=this._selector,a=t.getAnimations({subtree:!0}),o=[],c=0;c<a.length;c++){var f=a[c].effect;f!==null&&f.target===t&&f.pseudoElement===n&&o.push(a[c])}return o},ts.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function lv(t){return{name:t,group:new ts("group",t),imagePair:new ts("image-pair",t),old:new ts("old",t),new:new ts("new",t)}}function mi(t){this._fragmentFiber=t,this._observers=this._eventListeners=null}mi.prototype.addEventListener=function(t,n,a){var o=null,c=null;if(!(a!=null&&typeof a!="boolean"&&(o=a.signal||null,o!==null&&o.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var f=this._eventListeners;if(uv(f,t,n,a)===-1){var v=this,b=n;a!=null&&typeof a!="boolean"&&a.once===!0&&(b=function(P){v.removeEventListener(t,n,a),typeof n=="function"?n.call(this,P):n.handleEvent(P)}),o!==null&&(c=v.removeEventListener.bind(v,t,n,a),o.addEventListener("abort",c,{once:!0}),c=o.removeEventListener.bind(o,"abort",c)),o=Js(a),f.push({type:t,listener:n,optionsOrUseCapture:a,attachedListener:b,cleanup:c}),m(this._fragmentFiber.child,!1,yE,t,b,o)}this._eventListeners=f}};function yE(t,n,a,o){return M(t).addEventListener(n,a,o),!1}mi.prototype.removeEventListener=function(t,n,a){var o=this._eventListeners;if(o!==null&&(n=uv(o,t,n,a),n!==-1)){var c=o[n];a=c.attachedListener;var f=c.cleanup;c=Js(c.optionsOrUseCapture),m(this._fragmentFiber.child,!1,SE,t,a,c),o.splice(n,1),f!==null&&f()}};function SE(t,n,a,o){return M(t).removeEventListener(n,a,o),!1}function Js(t){return t!=null&&typeof t!="boolean"&&(t.once===!0||t.signal instanceof AbortSignal)?{capture:t.capture,passive:t.passive}:t}function cv(t){return t==null?"c=0":typeof t=="boolean"?"c="+(t?"1":"0"):"c="+(t.capture?"1":"0")}function uv(t,n,a,o){if(t.length===0)return-1;o=cv(o);for(var c=0;c<t.length;c++){var f=t[c];if(f.type===n&&f.listener===a&&cv(f.optionsOrUseCapture)===o)return c}return-1}mi.prototype.dispatchEvent=function(t){var n=S(this._fragmentFiber);if(n===null)return!0;n=M(n);var a=this._eventListeners;if(a!==null&&0<a.length||!t.bubbles){var o=n.nodeType===9?n.createComment(""):document.createTextNode("");if(a)for(var c=0;c<a.length;c++){var f=a[c];o.addEventListener(f.type,f.attachedListener,Js(f.optionsOrUseCapture))}if(n.appendChild(o),t=o.dispatchEvent(t),a)for(c=0;c<a.length;c++)f=a[c],o.removeEventListener(f.type,f.attachedListener,Js(f.optionsOrUseCapture));return n.removeChild(o),t}return n.dispatchEvent(t)},mi.prototype.focus=function(t){m(this._fragmentFiber.child,!0,fv,t,void 0,void 0)};function fv(t,n){return t.tag===6?!1:(t=M(t),UE(t,n))}mi.prototype.focusLast=function(t){var n=[];m(this._fragmentFiber.child,!0,bd,n,void 0,void 0);for(var a=n.length-1;0<=a&&!fv(n[a],t);a--);};function bd(t,n){return n.push(t),!1}mi.prototype.blur=function(){var t=S(this._fragmentFiber);t!==null&&(t=M(t),t=Tl(t).activeElement,t!==null&&m(this._fragmentFiber.child,!1,xE,t,void 0,void 0))};function xE(t,n){return t.tag===6?!1:(t=M(t),t===n||t.contains(n)?(n.blur(),!0):!1)}mi.prototype.observeUsing=function(t){this._observers===null&&(this._observers=new Set),this._observers.add(t),m(this._fragmentFiber.child,!1,ME,t,void 0,void 0)};function ME(t,n){return t.tag===6||(t=M(t),n.observe(t)),!1}mi.prototype.unobserveUsing=function(t){var n=this._observers;if(n!==null&&n.has(t)){n.delete(t),m(this._fragmentFiber.child,!1,EE,t,void 0,void 0);for(var a=n=0;a<Hi.length;a++){var o=Hi[a];o.fragmentInstance===this&&o.observer===t?t.unobserve(o.instance):Hi[n++]=o}Hi.length=n}};function EE(t,n){return t.tag===6||(t=M(t),n.unobserve(t)),!1}var Hi=[],Td=!1;function bE(t,n,a){Hi.push({fragmentInstance:t,observer:n,instance:a}),Td||(Td=!0,zE(function(){Td=!1;var o=Hi;Hi=[];for(var c=0;c<o.length;c++){var f=o[c];f.observer.unobserve(f.instance)}}))}mi.prototype.getClientRects=function(){var t=[];return m(this._fragmentFiber.child,!1,TE,t,void 0,void 0),t};function TE(t,n){if(t.tag===6){t=t.stateNode;var a=t.ownerDocument.createRange();a.selectNodeContents(t),n.push.apply(n,a.getClientRects())}else t=M(t),n.push.apply(n,t.getClientRects());return!1}mi.prototype.getRootNode=function(t){var n=S(this._fragmentFiber);return n===null?this:M(n).getRootNode(t)},mi.prototype.compareDocumentPosition=function(t){var n=S(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var a=[];m(this._fragmentFiber.child,!1,bd,a,void 0,void 0);var o=M(n);if(a.length===0){if(a=o,x(this._fragmentFiber)){t:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break t}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(a=n)}n=this._fragmentFiber;var c=o=a.compareDocumentPosition(t);return a===t?c=Node.DOCUMENT_POSITION_CONTAINS:o&Node.DOCUMENT_POSITION_CONTAINED_BY&&(a=E(n)[1],a===null?c=Node.DOCUMENT_POSITION_PRECEDING:(t=M(a).compareDocumentPosition(t),c=t===0||t&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),c|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=M(a[0]),c=M(a[a.length-1]);var f=x(this._fragmentFiber)?n.parentElement:o;if(f==null)return Node.DOCUMENT_POSITION_DISCONNECTED;o=f.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,f=f.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_CONTAINED_BY;var v=n.compareDocumentPosition(t),b=c.compareDocumentPosition(t),P=v&Node.DOCUMENT_POSITION_CONTAINED_BY||b&Node.DOCUMENT_POSITION_CONTAINED_BY;return b=o&&f&&v&Node.DOCUMENT_POSITION_FOLLOWING&&b&Node.DOCUMENT_POSITION_PRECEDING,n=o&&n===t||f&&c===t||P||b?Node.DOCUMENT_POSITION_CONTAINED_BY:!o&&n===t||!f&&c===t?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:v,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||wE(n,this._fragmentFiber,a[0],a[a.length-1],t)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function wE(t,n,a,o,c){var f=Kt(c);if(t&Node.DOCUMENT_POSITION_CONTAINED_BY){if(a=!!f)t:{for(;f!==null;){if(f.tag===7&&(f===n||f.alternate===n)){a=!0;break t}f=f.return}a=!1}return a}if(t&Node.DOCUMENT_POSITION_CONTAINS){if(f===null)return f=c.ownerDocument,c===f||c===f.documentElement||c===f.body;t:{for(f=n,n=S(n);f!==null;){if(!(f.tag!==5&&f.tag!==3&&f.tag!==27||f!==n&&f.alternate!==n)){f=!0;break t}f=f.return}f=!1}return f}return t&Node.DOCUMENT_POSITION_PRECEDING?((n=!!f)&&!(n=f===a)&&(n=F(a,f,G),n===null?n=!1:(m(n,!0,O,f,a),f=y,y=null,n=f!==null)),n):t&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!f)&&!(n=f===o)&&(n=F(o,f,G),n===null?n=!1:(m(n,!0,N,f,o),f=y,U=y=null,n=f!==null)),n):!1}function hv(t,n){var a=t.ownerDocument.createRange();a.selectNodeContents(t),t=a.getBoundingClientRect(),window.scrollTo(window.scrollX+t.left,n?window.scrollY+t.top:window.scrollY+t.bottom-window.innerHeight)}mi.prototype.scrollIntoView=function(t){if(typeof t=="object")throw Error(r(566));var n=[];m(this._fragmentFiber.child,!1,bd,n,void 0,void 0);var a=t!==!1;if(n.length===0){var o=E(this._fragmentFiber);if(o=a?o[1]||o[0]||S(this._fragmentFiber):o[0]||o[1],o===null)return;if(o.tag===6){t=M(o),hv(t,a);return}if(o=M(o),o.nodeType!==9){if(o.nodeType===11){a="host"in o?o.host:null,a!==null&&a.scrollIntoView(t);return}o.scrollIntoView(t)}}for(o=a?n.length-1:0;o!==(a?-1:n.length);){var c=n[o];c.tag===6?(c=M(c),hv(c,a)):M(c).scrollIntoView(t),o+=a?-1:1}};function AE(t,n){return t=M(t),dv(t,n),!1}function dv(t,n){t.reactFragments==null&&(t.reactFragments=new Set),t.reactFragments.add(n)}function pv(t,n){var a=n._eventListeners;if(a!==null)for(var o=0;o<a.length;o++){var c=a[o];t.addEventListener(c.type,c.attachedListener,Js(c.optionsOrUseCapture))}t.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){for(var v=0,b=0;b<Hi.length;b++){var P=Hi[b];(P.fragmentInstance!==n||P.observer!==f||P.instance!==t)&&(Hi[v++]=P)}Hi.length=v,f.observe(t)}),dv(t,n))}function RE(t,n){var a=n._eventListeners;if(a!==null)for(var o=0;o<a.length;o++){var c=a[o];t.removeEventListener(c.type,c.attachedListener,Js(c.optionsOrUseCapture))}t.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){typeof f.rootMargin=="string"?bE(n,f,t):f.unobserve(t)}),t.reactFragments!=null&&t.reactFragments.delete(n))}function wd(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":wd(a),Me(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function CE(t,n,a,o){for(;t.nodeType===1;){var c=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(o){if(!t[qe])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(f=t.getAttribute("rel"),f==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(f!==c.rel||t.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||t.getAttribute("title")!==(c.title==null?null:c.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(f=t.getAttribute("src"),(f!==(c.src==null?null:c.src)||t.getAttribute("type")!==(c.type==null?null:c.type)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&f&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var f=c.name==null?null:""+c.name;if(c.type==="hidden"&&t.getAttribute("name")===f)return t}else return t;if(t=Ri(t.nextSibling),t===null)break}return null}function DE(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=Ri(t.nextSibling),t===null))return null;return t}function mv(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=Ri(t.nextSibling),t===null))return null;return t}function Ad(t){return t.data==="$?"||t.data==="$~"}function Rd(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function NE(t,n){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),t._reactRetry=o}}function Ri(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var Cd=null;function gv(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(n===0)return Ri(t.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}t=t.nextSibling}return null}function _v(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return t;n--}else a!=="/$"&&a!=="/&"||n++}t=t.previousSibling}return null}function UE(t,n){function a(){o=!0}if(t.ownerDocument.activeElement===t)return!0;var o=!1;try{t.ownerDocument.addEventListener("focus",a,!0),(t.focus||HTMLElement.prototype.focus).call(t,n)}finally{t.ownerDocument.removeEventListener("focus",a,!0)}return o}function zE(t){iv(function(){iv(function(n){return t(n)})})}function vv(t,n,a){switch(n=Tl(a),t){case"html":if(t=n.documentElement,!t)throw Error(r(452));return t;case"head":if(t=n.head,!t)throw Error(r(453));return t;case"body":if(t=n.body,!t)throw Error(r(454));return t;default:throw Error(r(451))}}function yv(t,n,a){for(var o in a){var c=a[o];a.hasOwnProperty(o)&&c!=null&&Ie(t,n,o,null,lE,c)}a.dangerouslySetInnerHTML!=null&&(t.textContent=""),t.onclick===Ki&&(t.onclick=null),Me(t)}function Dd(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);Me(t)}var Ci=new Map,Sv=new Set;function wl(t){if(typeof t.getRootNode=="function"){var n=t.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return t.nodeType===9?t:t.ownerDocument}var Ca=kt.d;kt.d={f:LE,r:OE,D:PE,C:BE,L:IE,m:FE,X:kE,S:HE,M:GE};function LE(){var t=Ca.f(),n=su();return t||n}function OE(t){var n=en(t);n!==null&&n.tag===5&&n.type==="form"?M_(n):Ca.r(t)}var $s=typeof document>"u"?null:document;function xv(t,n,a){var o=$s;if(o&&typeof n=="string"&&n){var c=xi(n);c='link[rel="'+t+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),Sv.has(c)||(Sv.add(c),t={rel:t,crossOrigin:a,href:n},o.querySelector(c)===null&&(n=o.createElement("link"),Pn(n,"link",t),Je(n),o.head.appendChild(n)))}}function PE(t){Ca.D(t),xv("dns-prefetch",t,null)}function BE(t,n){Ca.C(t,n),xv("preconnect",t,n)}function IE(t,n,a){Ca.L(t,n,a);var o=$s;if(o&&t&&n){var c='link[rel="preload"][as="'+xi(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+xi(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+xi(a.imageSizes)+'"]')):c+='[href="'+xi(t)+'"]';var f=c;switch(n){case"style":f=to(t);break;case"script":f=eo(t)}if(!(Ci.has(f)||(t=z({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),Ci.set(f,t),o.querySelector(c)!==null||n==="style"&&o.querySelector(Al(f))||n==="script"&&o.querySelector(Rl(f))))){var v=o.createElement("link");Pn(v,"link",t),n==="style"&&(v[je]=!0,v.onload=v.onerror=function(){Vn(v)}),Je(v),o.head.appendChild(v)}}}function FE(t,n){Ca.m(t,n);var a=$s;if(a&&t){var o=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+xi(o)+'"][href="'+xi(t)+'"]',f=c;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=eo(t)}if(!Ci.has(f)&&(t=z({rel:"modulepreload",href:t},n),Ci.set(f,t),a.querySelector(c)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Rl(f)))return}o=a.createElement("link"),Pn(o,"link",t),Je(o),a.head.appendChild(o)}}}function HE(t,n,a){Ca.S(t,n,a);var o=$s;if(o&&t){var c=Tn(o).hoistableStyles,f=to(t);n=n||"default";var v=c.get(f);if(!v){var b={loading:0,preload:null};if(v=o.querySelector(Al(f)))b.loading=5;else{t=z({rel:"stylesheet",href:t,"data-precedence":n},a),(a=Ci.get(f))&&Nd(t,a);var P=v=o.createElement("link");Je(P),Pn(P,"link",t),P._p=new Promise(function(Q,ot){P.onload=Q,P.onerror=ot}),P.addEventListener("load",function(){b.loading|=1}),P.addEventListener("error",function(){b.loading|=2}),b.loading|=4,du(v,n,o)}v={type:"stylesheet",instance:v,count:1,state:b},c.set(f,v)}}}function kE(t,n){Ca.X(t,n);var a=$s;if(a&&t){var o=Tn(a).hoistableScripts,c=eo(t),f=o.get(c);f||(f=a.querySelector(Rl(c)),f||(t=z({src:t,async:!0},n),(n=Ci.get(c))&&Ud(t,n),f=a.createElement("script"),Je(f),Pn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(c,f))}}function GE(t,n){Ca.M(t,n);var a=$s;if(a&&t){var o=Tn(a).hoistableScripts,c=eo(t),f=o.get(c);f||(f=a.querySelector(Rl(c)),f||(t=z({src:t,async:!0,type:"module"},n),(n=Ci.get(c))&&Ud(t,n),f=a.createElement("script"),Je(f),Pn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(c,f))}}function Mv(t,n,a,o){var c=(c=L.current)?wl(c):null;if(!c)throw Error(r(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(a=to(a.href),n=Tn(c).hoistableStyles,o=n.get(a),o||(o={type:"style",instance:null,count:0,state:null},n.set(a,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=to(a.href);var f=Tn(c).hoistableStyles,v=f.get(t);if(v||(c=c.ownerDocument||c,v={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(t,v),(f=c.querySelector(Al(t)))?f._p||(v.instance=f,v.state.loading=5):(f=Ci.get(t),f||(f={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ci.set(t,f)),VE(c,t,f,v.state))),n&&o===null)throw Error(r(528,""));return v}if(n&&o!==null)throw Error(r(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(a=eo(a),n=Tn(c).hoistableScripts,o=n.get(a),o||(o={type:"script",instance:null,count:0,state:null},n.set(a,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,t))}}function to(t){return'href="'+xi(t)+'"'}function Al(t){return'link[rel="stylesheet"]['+t+"]"}function Ev(t){return z({},t,{"data-precedence":t.precedence,precedence:null})}function VE(t,n,a,o){if(n=t.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[je]!==!0){o.loading=1;return}}else n=t.createElement("link"),n[je]=!0,n.onload=n.onerror=Vn.bind(null,n),Pn(n,"link",a),Je(n),t.head.appendChild(n);o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2})}function eo(t){return'[src="'+xi(t)+'"]'}function Rl(t){return"script[async]"+t}function bv(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=t.querySelector('style[data-href~="'+xi(a.href)+'"]');if(o)return n.instance=o,Je(o),o;var c=z({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(t.ownerDocument||t).createElement("style"),Je(o),Pn(o,"style",c),du(o,a.precedence,t),n.instance=o;case"stylesheet":c=to(a.href);var f=t.querySelector(Al(c));if(f)return n.state.loading|=4,n.instance=f,Je(f),f;o=Ev(a),(c=Ci.get(c))&&Nd(o,c),f=(t.ownerDocument||t).createElement("link"),Je(f);var v=f;return v._p=new Promise(function(b,P){v.onload=b,v.onerror=P}),Pn(f,"link",o),n.state.loading|=4,du(f,a.precedence,t),n.instance=f;case"script":return f=eo(a.src),(c=t.querySelector(Rl(f)))?(n.instance=c,Je(c),c):(o=a,(c=Ci.get(f))&&(o=z({},a),Ud(o,c)),t=t.ownerDocument||t,c=t.createElement("script"),Je(c),Pn(c,"link",o),t.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(r(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,du(o,a.precedence,t));return n.instance}function du(t,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=o.length?o[o.length-1]:null,f=c,v=0;v<o.length;v++){var b=o[v];if(b.dataset.precedence===n)f=b;else if(f!==c)break}f?f.parentNode.insertBefore(t,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function Nd(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function Ud(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var pu=null;function Tv(t,n,a){if(pu===null){var o=new Map,c=pu=new Map;c.set(a,o)}else c=pu,o=c.get(a),o||(o=new Map,c.set(a,o));if(o.has(t))return o;for(o.set(t,null),a=a.getElementsByTagName(t),c=0;c<a.length;c++){var f=a[c];if(!(f[qe]||f[Dt]||t==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var v=f.getAttribute(n)||"";v=t+v;var b=o.get(v);b?b.push(f):o.set(v,[f])}}return o}function zd(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function jE(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return t=n.disabled,typeof n.precedence=="string"&&t==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function wv(t,n){return t==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function Av(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function Rv(t){return(t.width||100)*(t.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function Cv(t,n){typeof n.decode=="function"&&(t.imgCount++,n.complete||(t.imgBytes+=Rv(n),t.suspenseyImages.push(n)),t=WE.bind(t),n.decode().then(t,t))}function XE(t,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var c=to(o.href),f=n.querySelector(Al(c));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=Cl.bind(t),n.then(t,t)),a.state.loading|=4,a.instance=f,Je(f);return}f=n.ownerDocument||n,o=Ev(o),(c=Ci.get(c))&&Nd(o,c),f=f.createElement("link"),Je(f);var v=f;v._p=new Promise(function(b,P){v.onload=b,v.onerror=P}),Pn(f,"link",o),a.instance=f}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=Cl.bind(t),n.addEventListener("load",a),n.addEventListener("error",a))}}var mu=0;function YE(t,n){return t.stylesheets&&t.count===0&&_u(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var o=setTimeout(function(){if(t.stylesheets&&_u(t,t.stylesheets),t.unsuspend){var f=t.unsuspend;t.unsuspend=null,f()}},6e4+n);0<t.imgBytes&&mu===0&&(mu=62500*uE());var c=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&_u(t,t.stylesheets),t.unsuspend)){var f=t.unsuspend;t.unsuspend=null,f()}},(t.imgBytes>mu?50:800)+n);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(o),clearTimeout(c)}}:null}function Dv(t){if(t.count===0&&(t.imgCount===0||!t.waitingForImages)){if(t.stylesheets)_u(t,t.stylesheets);else if(t.unsuspend){var n=t.unsuspend;t.unsuspend=null,n()}}}function Cl(){this.count--,Dv(this)}function WE(){this.imgCount--,Dv(this)}var gu=null;function _u(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,gu=new Map,n.forEach(qE,t),gu=null,Cl.call(t))}function qE(t,n){if(!(n.state.loading&4)){var a=gu.get(t);if(a)var o=a.get(null);else{a=new Map,gu.set(t,a);for(var c=t.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<c.length;f++){var v=c[f];(v.nodeName==="LINK"||v.getAttribute("media")!=="not all")&&(a.set(v.dataset.precedence,v),o=v)}o&&a.set(null,o)}c=n.instance,v=c.getAttribute("data-precedence"),f=a.get(v)||o,f===o&&a.set(null,c),a.set(v,c),this.count++,o=Cl.bind(this),c.addEventListener("load",o),c.addEventListener("error",o),f?f.parentNode.insertBefore(c,f.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(c,t.firstChild)),n.state.loading|=4}}var no={$$typeof:ct,Provider:null,Consumer:null,_currentValue:le,_currentValue2:le,_threadCount:0};function ZE(t,n,a,o,c,f,v,b,P){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=jo(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=jo(0),this.hiddenUpdates=jo(null),this.identifierPrefix=o,this.onUncaughtError=c,this.onCaughtError=f,this.onRecoverableError=v,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=P,this.transitionTypes=null,this.incompleteTransitions=new Map}function Nv(t,n,a,o,c,f,v,b,P,Q,ot,_t){return t=new ZE(t,n,a,v,P,Q,ot,_t,b),n=1,f===!0&&(n|=24),f=$n(3,null,null,n),t.current=f,f.stateNode=t,n=qf(),n.refCount++,t.pooledCache=n,n.refCount++,f.memoizedState={element:o,isDehydrated:a,cache:n},Jf(f),t}function Uv(t){return t?(t=Rs,t):Rs}function zv(t,n,a,o,c,f){c=Uv(c),o.context===null?o.context=c:o.pendingContext=c,o=er(n),o.payload={element:a},f=f===void 0?null:f,f!==null&&(o.callback=f),a=nr(t,o,n),a!==null&&(ii(a,t,n),sl(a,t,n))}function Lv(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function Ld(t,n){Lv(t,n),(t=t.alternate)&&Lv(t,n)}function Ov(t){if(t.tag===13||t.tag===31){var n=Br(t,67108864);n!==null&&ii(n,t,67108864),Ld(t,67108864)}}function Pv(t){if(t.tag===13||t.tag===31){var n=pi();n=lt(n);var a=Br(t,n);a!==null&&ii(a,t,n),Ld(t,n)}}var io=!0;function KE(t,n,a,o){var c=Ct.T;Ct.T=null;var f=kt.p;try{kt.p=2,Od(t,n,a,o)}finally{kt.p=f,Ct.T=c}}function QE(t,n,a,o){var c=Ct.T;Ct.T=null;var f=kt.p;try{kt.p=8,Od(t,n,a,o)}finally{kt.p=f,Ct.T=c}}function Od(t,n,a,o){if(io){var c=Pd(o);if(c===null)gd(t,n,o,vu,a),Iv(t,o);else if($E(c,t,n,a,o))o.stopPropagation();else if(Iv(t,o),n&4&&-1<JE.indexOf(t)){for(;c!==null;){var f=en(c);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var v=Zi(f.pendingLanes);if(v!==0){var b=f;for(b.pendingLanes|=2,b.entangledLanes|=2;v;){var P=1<<31-Gn(v);b.entanglements[1]|=P,v&=~P}sa(f),(Le&6)===0&&(iu=X()+500,Ml(0))}}break;case 31:case 13:b=Br(f,2),b!==null&&ii(b,f,2),su(),Ld(f,2)}if(f=Pd(o),f===null&&gd(t,n,o,vu,a),f===c)break;c=f}c!==null&&o.stopPropagation()}else gd(t,n,o,null,a)}}function Pd(t){return t=xf(t),Bd(t)}var vu=null;function Bd(t){if(vu=null,t=Kt(t),t!==null){var n=u(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=d(n),t!==null)return t;t=null}else if(a===31){if(t=h(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return vu=t,null}function Bv(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(It()){case dt:return 2;case xt:return 8;case Ft:case Gt:return 32;case ue:return 268435456;default:return 32}default:return 32}}var Id=!1,pr=null,mr=null,gr=null,Dl=new Map,Nl=new Map,_r=[],JE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Iv(t,n){switch(t){case"focusin":case"focusout":pr=null;break;case"dragenter":case"dragleave":mr=null;break;case"mouseover":case"mouseout":gr=null;break;case"pointerover":case"pointerout":Dl.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Nl.delete(n.pointerId)}}function Ul(t,n,a,o,c,f){return t===null||t.nativeEvent!==f?(t={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:f,targetContainers:[c]},n!==null&&(n=en(n),n!==null&&Ov(n)),t):(t.eventSystemFlags|=o,n=t.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),t)}function $E(t,n,a,o,c){switch(n){case"focusin":return pr=Ul(pr,t,n,a,o,c),!0;case"dragenter":return mr=Ul(mr,t,n,a,o,c),!0;case"mouseover":return gr=Ul(gr,t,n,a,o,c),!0;case"pointerover":var f=c.pointerId;return Dl.set(f,Ul(Dl.get(f)||null,t,n,a,o,c)),!0;case"gotpointercapture":return f=c.pointerId,Nl.set(f,Ul(Nl.get(f)||null,t,n,a,o,c)),!0}return!1}function Fv(t){var n=Kt(t.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=d(a),n!==null){t.blockedOn=n,Tt(t.priority,function(){Pv(a)});return}}else if(n===31){if(n=h(a),n!==null){t.blockedOn=n,Tt(t.priority,function(){Pv(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function yu(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=Pd(t.nativeEvent);if(a===null){a=t.nativeEvent;var o=new a.constructor(a.type,a);Sf=o,a.target.dispatchEvent(o),Sf=null}else return n=en(a),n!==null&&Ov(n),t.blockedOn=a,!1;n.shift()}return!0}function Hv(t,n,a){yu(t)&&a.delete(n)}function tb(){Id=!1,pr!==null&&yu(pr)&&(pr=null),mr!==null&&yu(mr)&&(mr=null),gr!==null&&yu(gr)&&(gr=null),Dl.forEach(Hv),Nl.forEach(Hv)}function Su(t,n){t.blockedOn===n&&(t.blockedOn=null,Id||(Id=!0,s.unstable_scheduleCallback(s.unstable_NormalPriority,tb)))}var xu=null;function kv(t){xu!==t&&(xu=t,s.unstable_scheduleCallback(s.unstable_NormalPriority,function(){xu===t&&(xu=null);for(var n=0;n<t.length;n+=3){var a=t[n],o=t[n+1],c=t[n+2];if(typeof o!="function"){if(Bd(o||a)===null)continue;break}var f=en(a);f!==null&&(t.splice(n,3),n-=3,yh(f,{pending:!0,data:c,method:a.method,action:o},o,c))}}))}function ao(t){function n(P){return Su(P,t)}pr!==null&&Su(pr,t),mr!==null&&Su(mr,t),gr!==null&&Su(gr,t),Dl.forEach(n),Nl.forEach(n);for(var a=0;a<_r.length;a++){var o=_r[a];o.blockedOn===t&&(o.blockedOn=null)}for(;0<_r.length&&(a=_r[0],a.blockedOn===null);)Fv(a),a.blockedOn===null&&_r.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var c=a[o],f=a[o+1],v=c[Ot]||null;if(typeof f=="function")v||kv(a);else if(v){var b=null;if(f&&f.hasAttribute("formAction")){if(c=f,v=f[Ot]||null)b=v.formAction;else if(Bd(c)!==null)continue}else b=v.action;typeof b=="function"?a[o+1]=b:(a.splice(o,3),o-=3),kv(a)}}}function Gv(){function t(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(v){return c=v})},focusReset:"manual",scroll:"manual"})}function n(){c!==null&&(c(),c=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,c=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),c!==null&&(c(),c=null)}}}function Fd(t){this._internalRoot=t}Mu.prototype.render=Fd.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(r(409));var a=n.current,o=pi();zv(a,o,t,n,null,null)},Mu.prototype.unmount=Fd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;zv(t.current,2,null,t,null,null),su(),n[ne]=null}};function Mu(t){this._internalRoot=t}Mu.prototype.unstable_scheduleHydration=function(t){if(t){var n=$();t={blockedOn:null,target:t,priority:n};for(var a=0;a<_r.length&&n!==0&&n<_r[a].priority;a++);_r.splice(a,0,t),a===0&&Fv(t)}};var Vv=e.version;if(Vv!=="19.3.1")throw Error(r(527,Vv,"19.3.1"));kt.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(r(188)):(t=Object.keys(t).join(","),Error(r(268,t)));return t=g(n),t=t!==null?_(t):null,t=t===null?null:t.stateNode,t};var eb={bundleType:0,version:"19.3.1",rendererPackageName:"react-dom",currentDispatcherRef:Ct,reconcilerVersion:"19.3.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Eu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Eu.isDisabled&&Eu.supportsFiber)try{Re=Eu.inject(eb),Qe=Eu}catch{}}return Ll.createRoot=function(t,n){if(!l(t))throw Error(r(299));var a=!1,o="",c=U_,f=z_,v=L_;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(v=n.onRecoverableError)),n=Nv(t,1,!1,null,null,a,o,null,c,f,v,Gv),t[ne]=n.current,md(t),new Fd(n)},Ll.hydrateRoot=function(t,n,a){if(!l(t))throw Error(r(299));var o=!1,c="",f=U_,v=z_,b=L_,P=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(v=a.onCaughtError),a.onRecoverableError!==void 0&&(b=a.onRecoverableError),a.formState!==void 0&&(P=a.formState)),n=Nv(t,1,!0,n,a??null,o,c,P,f,v,b,Gv),n.context=Uv(null),a=n.current,o=pi(),o=lt(o),c=er(o),c.callback=null,nr(a,c,o),a=o,n.current.lanes=a,Lr(n,a),sa(n),t[ne]=n.current,md(t),new Mu(n)},Ll.version="19.3.1",Ll}var $v;function fb(){if($v)return Gd.exports;$v=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Gd.exports=ub(),Gd.exports}var hb=fb();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const db=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),vS=(...s)=>s.filter((e,i,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===i).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var pb={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mb=Pt.forwardRef(({color:s="currentColor",size:e=24,strokeWidth:i=2,absoluteStrokeWidth:r,className:l="",children:u,iconNode:d,...h},p)=>Pt.createElement("svg",{ref:p,...pb,width:e,height:e,stroke:s,strokeWidth:r?Number(i)*24/Number(e):i,className:vS("lucide",l),...h},[...d.map(([g,_])=>Pt.createElement(g,_)),...Array.isArray(u)?u:[u]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gn=(s,e)=>{const i=Pt.forwardRef(({className:r,...l},u)=>Pt.createElement(mb,{ref:u,iconNode:e,className:vS(`lucide-${db(s)}`,r),...l}));return i.displayName=`${s}`,i};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gb=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],_b=gn("BookOpen",gb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vb=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],yb=gn("CircleCheck",vb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sb=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],xb=gn("CircleHelp",Sb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mb=[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]],Eb=gn("Download",Mb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bb=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],Tb=gn("FolderOpen",bb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wb=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],Ab=gn("Image",wb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rb=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],Cb=gn("Layers",Rb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Db=[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]],yS=gn("Maximize2",Db);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nb=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],Ub=gn("Moon",Nb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zb=[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]],Lb=gn("Pause",zb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ob=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],SS=gn("Play",Ob);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pb=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],Mm=gn("RotateCcw",Pb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bb=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],Ib=gn("Share2",Bb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fb=[["polygon",{points:"5 4 15 12 5 20 5 4",key:"16p6eg"}],["line",{x1:"19",x2:"19",y1:"5",y2:"19",key:"futhcm"}]],Hb=gn("SkipForward",Fb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kb=[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]],Gb=gn("Sparkles",kb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vb=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],jb=gn("Sun",Vb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xb=[["path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6",key:"17hqa7"}],["path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18",key:"lmptdp"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",key:"1nw9bq"}],["path",{d:"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",key:"1np0yb"}],["path",{d:"M18 2H6v7a6 6 0 0 0 12 0V2Z",key:"u46fv3"}]],xS=gn("Trophy",Xb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yb=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],MS=gn("X",Yb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wb=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]],ES=gn("ZoomIn",Wb);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qb=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]],bS=gn("ZoomOut",qb),rn={MAX_CHARS:5e4,MAX_TOKENS:1e4,MAX_BRACKET_DEPTH:32,MAX_FRAMES:32,MAX_OPS:1e4,MAX_SEGMENTS:1e4,MAX_COORD:1e5};class Oa extends Error{logoError;constructor(e,i,r){super(e),this.logoError={message:e,line:i,column:r}}}const TS=s=>/\p{L}/u.test(s),xo=s=>s>="0"&&s<="9",Yd=s=>s==="_"||TS(s),ty=s=>s==="_"||xo(s)||TS(s),wS=s=>s===" "||s==="	"||s==="\r",Zb=s=>wS(s)||s===`
`;function Kb(s){if(s.length>rn.MAX_CHARS){let g=1,_=1;for(let m=0;m<rn.MAX_CHARS;m++)s[m]===`
`?(g++,_=1):_++;throw new Oa(`Przekroczono limit długości programu (${rn.MAX_CHARS} znaków).`,g,_)}const e=[];let i=0,r=0,l=1,u=1,d=!1;const h=(g,_,m,S,x,E,T)=>{if(g!=="NEWLINE"&&g!=="EOF"&&(i++,i>rn.MAX_TOKENS))throw new Oa(`Przekroczono limit tokenów (${rn.MAX_TOKENS}).`,m,S);const M=T<s.length?s[T]:"",y=M===""||Zb(M)||M===";";e.push({type:g,value:_,line:m,column:S,spaceBefore:x,spaceAfter:y,atLineStart:E})};let p=!0;for(;r<s.length;){const g=s[r];if(wS(g)){p=!0,r++,u++;continue}if(g===";"){for(p=!0;r<s.length&&s[r]!==`
`;)r++,u++;continue}if(g===`
`){h("NEWLINE",`
`,l,u,p,!d,r+1),r++,l++,u=1,d=!1,p=!0;continue}const _=l,m=u,S=p,x=!d;if(d=!0,p=!1,g==="["){h("LBRACKET","[",_,m,S,x,r+1),r++,u++;continue}if(g==="]"){h("RBRACKET","]",_,m,S,x,r+1),r++,u++;continue}if(g==="("){h("LPAREN","(",_,m,S,x,r+1),r++,u++;continue}if(g===")"){h("RPAREN",")",_,m,S,x,r+1),r++,u++;continue}if(g===","){h("COMMA",",",_,m,S,x,r+1),r++,u++;continue}if(g==="+"||g==="-"||g==="*"||g==="/"){h("OP",g,_,m,S,x,r+1),r++,u++;continue}if(g==="<"){const E=s[r+1];E==="="||E===">"?(h("CMP",g+E,_,m,S,x,r+2),r+=2,u+=2):(h("CMP","<",_,m,S,x,r+1),r++,u++);continue}if(g===">"){s[r+1]==="="?(h("CMP",">=",_,m,S,x,r+2),r+=2,u+=2):(h("CMP",">",_,m,S,x,r+1),r++,u++);continue}if(g==="="){h("CMP","=",_,m,S,x,r+1),r++,u++;continue}if(g==='"'){let E=r+1,T="";for(;E<s.length&&s[E]!=='"'&&s[E]!==`
`;)T+=s[E],E++;if(E>=s.length||s[E]!=='"')throw new Oa("Niezamknięty literał koloru.",_,m);const M=E-r+1;h("STRING",T,_,m,S,x,E+1),r=E+1,u+=M;continue}if(xo(g)||g==="."&&r+1<s.length&&xo(s[r+1])){let E=r;for(;E<s.length&&xo(s[E]);)E++;if(E<s.length&&s[E]==="."){if(E++,E>=s.length||!xo(s[E]))throw new Oa("Nieprawidłowy zapis liczby.",_,m);for(;E<s.length&&xo(s[E]);)E++}if(E<s.length&&(s[E]==="."||Yd(s[E])))throw new Oa("Nieprawidłowy zapis liczby.",_,m);const T=s.slice(r,E);h("NUMBER",T,_,m,S,x,E),u+=E-r,r=E;continue}if(g===":"){let E=r+1;if(E>=s.length||!Yd(s[E]))throw new Oa("Nieprawidłowa nazwa po dwukropku.",_,m);for(;E<s.length&&ty(s[E]);)E++;const T=s.slice(r+1,E).toLowerCase();h("LEGACY_VAR",T,_,m,S,x,E),u+=E-r,r=E;continue}if(Yd(g)){let E=r;for(;E<s.length&&ty(s[E]);)E++;let T=s.slice(r,E).toLowerCase();if(T==="ma"&&E<s.length&&s[E]===":")E++,T="ma:";else if(E<s.length&&s[E]===":")throw new Oa(`Nieoczekiwany dwukropek po „${s.slice(r,E)}”.`,_,m);h("WORD",T,_,m,S,x,E),u+=E-r,r=E;continue}throw new Oa(`Nieoczekiwany znak „${g}”.`,_,m)}return h("EOF","",l,u,!0,!d,s.length),e}class te extends Error{logoError;constructor(e,i,r){super(e),this.logoError={message:e,line:i,column:r}}}const AS={np:"fd",naprzod:"fd",naprzód:"fd",fd:"fd",forward:"fd",ws:"bk",wstecz:"bk",bk:"bk",back:"bk",pw:"rt",prawo:"rt",rt:"rt",right:"rt",lw:"lt",lewo:"lt",lt:"lt",left:"lt",pod:"pu",podnies:"pu",podnieś:"pu",pu:"pu",penup:"pu",opu:"pd",opusc:"pd",opuść:"pd",pd:"pd",pendown:"pd",kolor:"color",color:"color",grubosc:"width",grubość:"width",width:"width",powtorz:"repeat",powtórz:"repeat",repeat:"repeat",niech:"let",let:"let",jeśli:"if",jesli:"if",if:"if",jeżeli:"ifelse",jezeli:"ifelse",ifelse:"ifelse",stop:"stop",dom:"home",home:"home",czyść:"cs",czysc:"cs",cs:"cs",clearscreen:"cs",gora:"pitchup",góra:"pitchup",pitchup:"pitchup",dol:"pitchdown",dół:"pitchdown",pitchdown:"pitchdown",pp:"rr",przechylprawo:"rr",rr:"rr",rollright:"rr",pl:"rl",przechyllewo:"rl",rl:"rl",rollleft:"rl"},Qb=new Set(["oto","to","już","juz","end","ma:","nrpowt","repcount"]);function Ao(s){const e=s.toLowerCase();return e in AS||Qb.has(e)}function Jb(s){const e=[],i=new Map;let r=0,l=0;for(;r<s.length;){const u=s[r];if(u.type==="EOF")break;if(u.type==="LBRACKET"){if(l++,l>rn.MAX_BRACKET_DEPTH)throw new te(`Przekroczono maksymalną głębokość nawiasów [${rn.MAX_BRACKET_DEPTH}].`,u.line,u.column);e.push(u),r++;continue}if(u.type==="RBRACKET"){l=Math.max(0,l-1),e.push(u),r++;continue}if(u.type==="WORD"&&(u.value==="oto"||u.value==="to")){if(l>0)throw new te("Definicja procedury nie może znajdować się wewnątrz nawiasów [ ].",u.line,u.column);if(!u.atLineStart)throw new te("Definicja procedury („oto”) musi zaczynać się na początku wiersza.",u.line,u.column);const d=u.line,h=u.column;r++;const p=s[r];if(!p||p.type==="NEWLINE"||p.type==="EOF")throw new te("Brak nazwy procedury po „oto”.",d,h);if(p.type!=="WORD")throw new te("Nieprawidłowa nazwa procedury.",p.line,p.column);if(Ao(p.value))throw new te(`Nazwa „${p.value}” jest zarezerwowanym słowem kluczowym.`,p.line,p.column);if(i.has(p.value))throw new te(`Procedura „${p.value}” została już zdefiniowana.`,p.line,p.column);const g=p.value;r++;const _=[],m=new Set,S=s[r];if(S&&S.type==="WORD"&&S.value==="ma:")for(r++;;){const y=s[r];if(!y||y.type==="NEWLINE"||y.type==="EOF"){if(_.length===0)throw new te("Brak listy parametrów po „ma:”.",S.line,S.column);break}if(y.type!=="WORD")throw new te("Oczekiwano nazwy parametru.",y.line,y.column);if(Ao(y.value))throw new te(`Parametr nie może nazywać się „${y.value}”.`,y.line,y.column);if(m.has(y.value))throw new te(`Zduplikowana nazwa parametru „${y.value}”.`,y.line,y.column);_.push(y.value),m.add(y.value),r++;const U=s[r];if(U&&U.type==="COMMA"){r++;const O=s[r];if(!O||O.type==="NEWLINE"||O.type==="EOF")throw new te("Oczekiwano nazwy parametru po przecinku.",U.line,U.column)}else break}else if(S&&S.type==="LEGACY_VAR")for(;s[r]&&s[r].type==="LEGACY_VAR";){const y=s[r];if(Ao(y.value))throw new te(`Parametr nie może nazywać się „${y.value}”.`,y.line,y.column);if(m.has(y.value))throw new te(`Zduplikowana nazwa parametru „${y.value}”.`,y.line,y.column);_.push(y.value),m.add(y.value),r++}const x=s[r];if(!x||x.type==="EOF")throw new te(`Brak słowa „już” zamykającego procedurę „${g}”.`,d,h);if(x.type!=="NEWLINE")throw new te("Nieoczekiwany element w nagłówku procedury.",x.line,x.column);r++;const E=[];let T=!1;for(;r<s.length&&s[r].type!=="EOF";){const y=s[r];if(y.type==="WORD"&&(y.value==="już"||y.value==="juz"||y.value==="end")&&y.atLineStart){const U=s[r+1];if(!U||U.type==="NEWLINE"||U.type==="EOF"){T=!0,r++,U&&U.type==="NEWLINE"&&r++;break}throw new te("Słowo „już” musi znajdować się samo w wierszu.",U.line,U.column)}if(y.type==="WORD"&&(y.value==="oto"||y.value==="to")&&y.atLineStart)throw new te("Nie można definiować procedury wewnątrz innej procedury.",y.line,y.column);y.type!=="NEWLINE"&&E.push(y),r++}if(!T)throw new te(`Brak słowa „już” zamykającego procedurę „${g}”.`,d,h);const M=s[s.length-1];E.push(M),i.set(g,{name:g,params:_,bodyTokens:E,line:d,column:h});continue}if(u.type==="WORD"&&(u.value==="już"||u.value==="juz"||u.value==="end"))throw new te("Nieoczekiwane słowo „już” poza definicją procedury.",u.line,u.column);u.type!=="NEWLINE"&&e.push(u),r++}return e.push(s[s.length-1]),{topTokens:e,rawProcedures:i}}class ey{pos=0;bracketDepth=0;tokens;procedures;constructor(e,i){this.tokens=e,this.procedures=i}peek(e=0){const i=Math.min(this.pos+e,this.tokens.length-1);return this.tokens[i]}advance(){const e=this.peek();return e.type!=="EOF"&&this.pos++,e}parseStatements(e){const i=[];for(;;){const r=this.peek();if(r.type==="EOF"){if(e)throw new te("Brak zamykającego nawiasu „]”.",r.line,r.column);break}if(r.type==="RBRACKET"){if(e)break;throw new te("Nieoczekiwany nawias zamykający „]”.",r.line,r.column)}i.push(this.parseStmt())}return i}parseStmt(){const e=this.peek();if(e.type==="WORD"){if(e.value==="oto"||e.value==="to")throw new te("Definicja procedury nie może znajdować się wewnątrz bloku.",e.line,e.column);if(e.value==="już"||e.value==="juz"||e.value==="end")throw new te("Nieoczekiwane słowo „już” wewnątrz bloku.",e.line,e.column);if(e.value==="nrpowt"||e.value==="repcount")throw new te(`„${e.value}” jest wartością, a nie poleceniem.`,e.line,e.column);const i=AS[e.value];if(i)switch(this.advance(),i){case"fd":case"bk":case"rt":case"lt":case"pitchup":case"pitchdown":case"rr":case"rl":return{kind:i,expr:this.parseExpr(e),line:e.line,column:e.column};case"pu":case"pd":case"stop":case"home":case"cs":return{kind:i,line:e.line,column:e.column};case"color":{const l=this.peek();if(l.type==="EOF")throw new te("Brak literału koloru po poleceniu „kolor”.",e.line,e.column);if(l.type!=="STRING"||!/^#[0-9a-fA-F]{6}$/.test(l.value))throw new te('Nieprawidłowy kolor. Oczekiwano sześciocyfrowego zapisu w cudzysłowie, np. "#16866a".',l.line,l.column);return this.advance(),{kind:"color",color:l.value.toLowerCase(),line:e.line,column:e.column}}case"width":return{kind:"width",expr:this.parseExpr(e),line:e.line,column:e.column};case"let":{const l=this.peek();if(l.type==="EOF")throw new te("Brak nazwy zmiennej po „niech”.",e.line,e.column);if(l.type!=="WORD")throw new te("Oczekiwano nazwy zmiennej po „niech”.",l.line,l.column);if(Ao(l.value))throw new te(`Zmienna nie może nazywać się „${l.value}”.`,l.line,l.column);if(this.procedures.has(l.value))throw new te(`Nazwa „${l.value}” jest już nazwą procedury.`,l.line,l.column);this.advance();const u=this.parseExpr(l);return{kind:"let",name:l.value,expr:u,line:e.line,column:e.column}}case"repeat":{const l=this.parseExpr(e),u=this.parseBlock(e);return{kind:"repeat",count:l,body:u,line:e.line,column:e.column}}case"if":{const l=this.parseCondition(e),u=this.parseBlock(e);return{kind:"if",cond:l,body:u,line:e.line,column:e.column}}case"ifelse":{const l=this.parseCondition(e),u=this.parseBlock(e),d=this.parseBlock(e);return{kind:"ifelse",cond:l,thenBody:u,elseBody:d,line:e.line,column:e.column}}}const r=this.procedures.get(e.value);if(r){this.advance();const l=[];let u=e;for(let d=0;d<r.params.length;d++){const h=this.parseExpr(u);l.push(h),u=this.tokens[Math.max(0,this.pos-1)]}return{kind:"call",name:r.name,args:l,line:e.line,column:e.column}}throw new te(`Nieznane polecenie „${e.value}”.`,e.line,e.column)}throw new te(`Oczekiwano polecenia, napotkano „${e.value||e.type}”.`,e.line,e.column)}parseBlock(e){const i=this.peek();if(i.type==="EOF")throw new te("Oczekiwano bloku „[ ... ]”.",e.line,e.column);if(i.type!=="LBRACKET")throw new te("Oczekiwano nawiasu otwierającego „[”.",i.line,i.column);if(this.advance(),this.bracketDepth++,this.bracketDepth>rn.MAX_BRACKET_DEPTH)throw new te(`Przekroczono maksymalną głębokość nawiasów [${rn.MAX_BRACKET_DEPTH}].`,i.line,i.column);const r=this.parseStatements(!0),l=this.peek();if(l.type!=="RBRACKET")throw new te("Brak zamykającego nawiasu „]”.",l.line,l.column);return this.advance(),this.bracketDepth--,r}parseCondition(e){const i=this.parseExpr(e),r=this.peek();if(r.type==="EOF")throw new te("Oczekiwano operatora porównania (<, >, =, <=, >=, <>).",e.line,e.column);if(r.type!=="CMP")throw new te(`Oczekiwano operatora porównania, napotkano „${r.value}”.`,r.line,r.column);this.advance();const l=this.parseExpr(r);return{left:i,op:r.value,right:l,line:r.line,column:r.column}}parseExpr(e){return this.parseAddSub(e)}parseAddSub(e){let i=this.parseMulDiv(e);for(;;){const r=this.peek();if(r.type==="OP"&&(r.value==="+"||r.value==="-")&&r.spaceBefore===r.spaceAfter){this.advance();const l=this.parseMulDiv(r);i={kind:"binary",op:r.value,left:i,right:l,line:i.line,column:i.column}}else break}return i}parseMulDiv(e){let i=this.parseUnary(e);for(;;){const r=this.peek();if(r.type==="OP"&&(r.value==="*"||r.value==="/")&&r.spaceBefore===r.spaceAfter){this.advance();const l=this.parseUnary(r);i={kind:"binary",op:r.value,left:i,right:l,line:i.line,column:i.column}}else break}return i}parseUnary(e){const i=this.peek();if(i.type==="OP"&&(i.value==="+"||i.value==="-")){this.advance();const r=this.parseUnary(i);return{kind:"unary",op:i.value,expr:r,line:i.line,column:i.column}}return this.parsePrimary(e)}parsePrimary(e){const i=this.peek();if(i.type==="EOF")throw new te("Brak wymaganego argumentu.",e.line,e.column);if(i.type==="NUMBER"){this.advance();const r=Number(i.value);if(!Number.isFinite(r))throw new te("Nieprawidłowa liczba.",i.line,i.column);return{kind:"number",value:r,line:i.line,column:i.column}}if(i.type==="LEGACY_VAR")return this.advance(),{kind:"var",name:i.value,line:i.line,column:i.column};if(i.type==="WORD"){if(i.value==="nrpowt"||i.value==="repcount")return this.advance(),{kind:"repcount",line:i.line,column:i.column};if(Ao(i.value))throw new te(`Nieoczekiwane słowo kluczowe „${i.value}” w wyrażeniu.`,i.line,i.column);return this.advance(),{kind:"var",name:i.value,line:i.line,column:i.column}}if(i.type==="LPAREN"){this.advance();const r=this.parseExpr(i),l=this.peek();if(l.type==="EOF")throw new te("Brak zamykającego nawiasu „)”.",i.line,i.column);if(l.type!=="RPAREN")throw new te(`Oczekiwano „)”, napotkano „${l.value}”.`,l.line,l.column);return this.advance(),r}throw new te(`Oczekiwano wartości lub wyrażenia, napotkano „${i.value}”.`,i.line,i.column)}}function Yl(s,e){for(const i of s)i.kind==="let"?e.add(i.name):i.kind==="repeat"||i.kind==="if"?Yl(i.body,e):i.kind==="ifelse"&&(Yl(i.thenBody,e),Yl(i.elseBody,e))}function Wl(s){switch(s.kind){case"number":return!1;case"var":case"repcount":return!0;case"unary":return Wl(s.expr);case"binary":return Wl(s.left)||Wl(s.right)}}function ql(s){switch(s.kind){case"number":return s.value;case"unary":{const e=ql(s.expr);return s.op==="-"?-e:e}case"binary":{const e=ql(s.left),i=ql(s.right);let r;if(s.op==="+")r=e+i;else if(s.op==="-")r=e-i;else if(s.op==="*")r=e*i;else{if(i===0)throw new te("Dzielenie przez zero.",s.line,s.column);r=e/i}if(!Number.isFinite(r))throw new te("Wynik wyrażenia wykracza poza zakres liczbowy.",s.line,s.column);return r}default:throw new te("Oczekiwano stałego wyrażenia.",s.line,s.column)}}function Ui(s,e,i){switch(s.kind){case"number":return;case"repcount":if(!i)throw new te("„nrpowt” może być użyte tylko wewnątrz pętli „powtórz”.",s.line,s.column);return;case"var":if(!e.has(s.name))throw new te(`Niezadeklarowana zmienna „${s.name}”.`,s.line,s.column);return;case"unary":Ui(s.expr,e,i);return;case"binary":Ui(s.left,e,i),Ui(s.right,e,i)}}function Eo(s,e,i,r){for(const l of s)switch(l.kind){case"pitchup":case"pitchdown":case"rr":case"rl":if(r==="2d")throw new te("Polecenia obrotu w przestrzeni (góra, dół, pp, pl) są dostępne tylko w trybie 3D.",l.line,l.column);Ui(l.expr,e,i);break;case"fd":case"bk":case"rt":case"lt":case"let":Ui(l.expr,e,i);break;case"width":if(Ui(l.expr,e,i),!Wl(l.expr)){const u=ql(l.expr);if(!Number.isInteger(u)||u<1||u>12)throw new te("Grubość pisaka musi być liczbą całkowitą od 1 do 12.",l.expr.line,l.expr.column)}break;case"repeat":if(Ui(l.count,e,i),!Wl(l.count)){const u=ql(l.count);if(!Number.isInteger(u)||u<0||u>1e4)throw new te("Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.",l.count.line,l.count.column)}Eo(l.body,e,!0,r);break;case"if":Ui(l.cond.left,e,i),Ui(l.cond.right,e,i),Eo(l.body,e,i,r);break;case"ifelse":Ui(l.cond.left,e,i),Ui(l.cond.right,e,i),Eo(l.thenBody,e,i,r),Eo(l.elseBody,e,i,r);break;case"call":for(const u of l.args)Ui(u,e,i);break}}function $b(s,e){const{topTokens:i,rawProcedures:r}=Jb(s),u=new ey(i,r).parseStatements(!1),d=new Map;for(const[p,g]of r){const m=new ey(g.bodyTokens,r).parseStatements(!1);d.set(p,{name:g.name,params:g.params,body:m,line:g.line,column:g.column})}const h=new Set;Yl(u,h),Eo(u,h,!1,e);for(const p of d.values()){const g=new Set(h);for(const _ of p.params)g.add(_);Yl(p.body,g),Eo(p.body,g,!1,e)}return{procedures:d,body:u,topLevelVars:h}}function t1(s){return s instanceof Oa||s instanceof te?s.logoError:{message:s instanceof Error?s.message:"Nieznany błąd.",line:1,column:1}}class gi extends Error{logoError;constructor(e,i,r){super(e),this.logoError={message:e,line:i,column:r}}}function Tr(){return{pos:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],penDown:!0,color:"#16866a",width:3}}function Np(s,e){return[s[1]*e[2]-s[2]*e[1],s[2]*e[0]-s[0]*e[2],s[0]*e[1]-s[1]*e[0]]}function e1(s,e){return s[0]*e[0]+s[1]*e[1]+s[2]*e[2]}function Wd(s){const e=Math.hypot(s[0],s[1],s[2]);return e===0?[0,0,0]:[s[0]/e,s[1]/e,s[2]/e]}function Di(s,e,i){const r=i*Math.PI/180,l=Math.cos(r),u=Math.sin(r),d=Np(e,s),h=e1(e,s);return[s[0]*l+d[0]*u+e[0]*h*(1-l),s[1]*l+d[1]*u+e[1]*h*(1-l),s[2]*l+d[2]*u+e[2]*h*(1-l)]}function ro(s){s.heading=Wd(s.heading),s.right=Wd(Np(s.heading,s.up)),s.up=Wd(Np(s.right,s.heading))}class Vl{program;mode;segments=[];turtle=Tr();globals=new Map;frames;opCount=0;finished=!1;error=null;constructor(e,i){this.program=e,this.mode=i,this.frames=[{kind:"top",stmts:e.body,ip:0}]}isDone(){return this.finished||this.error!==null}getCurrentLine(){if(this.isDone())return null;for(let e=this.frames.length-1;e>=0;e--){const i=this.frames[e];if(i.ip<i.stmts.length)return i.stmts[i.ip].line}return null}snapshot(){return{done:this.finished,currentLine:this.getCurrentLine(),segments:this.segments,turtle:{pos:[...this.turtle.pos],heading:[...this.turtle.heading],right:[...this.turtle.right],up:[...this.turtle.up],penDown:this.turtle.penDown,color:this.turtle.color,width:this.turtle.width},error:this.error}}bumpOp(e,i){if(this.opCount++,this.opCount>rn.MAX_OPS)throw new gi(`Przekroczono limit wykonanych operacji (${rn.MAX_OPS}).`,e,i)}countActiveFrames(){let e=0;for(const i of this.frames)(i.kind==="proc"||i.kind==="repeat")&&e++;return e}lookupVar(e,i,r){for(let l=this.frames.length-1;l>=0;l--){const u=this.frames[l];if(u.kind==="proc"){if(u.locals.has(e))return u.locals.get(e);break}}if(this.globals.has(e))return this.globals.get(e);throw new gi(`Zmienna „${e}” nie została jeszcze przypisana.`,i,r)}assignVar(e,i){for(let r=this.frames.length-1;r>=0;r--){const l=this.frames[r];if(l.kind==="proc"){l.locals.set(e,i);return}}this.globals.set(e,i)}currentRepCount(){for(let e=this.frames.length-1;e>=0;e--){const i=this.frames[e];if(i.kind==="repeat")return i.iter;if(i.kind==="proc")break}throw new gi("Brak aktywnej pętli „powtórz”.",1,1)}evalExpr(e,i,r){switch(e.kind){case"number":return e.value;case"var":return this.lookupVar(e.name,i,r);case"repcount":return this.currentRepCount();case"unary":{const l=this.evalExpr(e.expr,i,r);return e.op==="-"?-l:l}case"binary":{const l=this.evalExpr(e.left,i,r),u=this.evalExpr(e.right,i,r);let d;if(e.op==="+")d=l+u;else if(e.op==="-")d=l-u;else if(e.op==="*")d=l*u;else{if(u===0)throw new gi("Dzielenie przez zero.",i,r);d=l/u}if(!Number.isFinite(d))throw new gi("Wynik wyrażenia wykracza poza zakres liczbowy.",i,r);return d}}}evalArg(e){return this.evalExpr(e,e.line,e.column)}evalCondition(e){const i=this.evalArg(e.left),r=this.evalArg(e.right);switch(e.op){case"<":return i<r;case">":return i>r;case"=":return i===r;case"<=":return i<=r;case">=":return i>=r;case"<>":return i!==r}}moveTurtle(e,i,r){if(e===0)return;const l=[...this.turtle.pos],u=[l[0]+this.turtle.heading[0]*e,l[1]+this.turtle.heading[1]*e,l[2]+this.turtle.heading[2]*e];if(!Number.isFinite(u[0])||!Number.isFinite(u[1])||!Number.isFinite(u[2])||Math.abs(u[0])>rn.MAX_COORD||Math.abs(u[1])>rn.MAX_COORD||Math.abs(u[2])>rn.MAX_COORD)throw new gi(`Żółw wyszedł poza dozwolony obszar (±${rn.MAX_COORD}).`,i,r);if(this.turtle.pos=u,this.turtle.penDown){if(this.segments.length>=rn.MAX_SEGMENTS)throw new gi(`Przekroczono limit odcinków (${rn.MAX_SEGMENTS}).`,i,r);this.segments.push({from:l,to:[...u],color:this.turtle.color,width:this.turtle.width})}}step(){if(this.isDone())return!1;try{for(;;){const e=this.frames[this.frames.length-1];if(e.ip>=e.stmts.length){if(e.kind==="top")return this.finished=!0,!1;if(e.kind==="cond"||e.kind==="proc"){this.bumpOp(e.line,e.column),this.frames.pop();continue}if(e.kind==="repeat"){if(this.bumpOp(e.line,e.column),e.iter<e.total){e.iter++,e.ip=0;continue}this.frames.pop();continue}}const i=e.stmts[e.ip++];switch(this.bumpOp(i.line,i.column),i.kind){case"fd":return this.moveTurtle(this.evalArg(i.expr),i.line,i.column),!0;case"bk":return this.moveTurtle(-this.evalArg(i.expr),i.line,i.column),!0;case"rt":{const r=this.evalArg(i.expr);return this.turtle.heading=Di(this.turtle.heading,this.turtle.up,-r),this.turtle.right=Di(this.turtle.right,this.turtle.up,-r),ro(this.turtle),!0}case"lt":{const r=this.evalArg(i.expr);return this.turtle.heading=Di(this.turtle.heading,this.turtle.up,r),this.turtle.right=Di(this.turtle.right,this.turtle.up,r),ro(this.turtle),!0}case"pitchup":{const r=this.evalArg(i.expr);return this.turtle.heading=Di(this.turtle.heading,this.turtle.right,r),this.turtle.up=Di(this.turtle.up,this.turtle.right,r),ro(this.turtle),!0}case"pitchdown":{const r=this.evalArg(i.expr);return this.turtle.heading=Di(this.turtle.heading,this.turtle.right,-r),this.turtle.up=Di(this.turtle.up,this.turtle.right,-r),ro(this.turtle),!0}case"rr":{const r=this.evalArg(i.expr);return this.turtle.up=Di(this.turtle.up,this.turtle.heading,r),this.turtle.right=Di(this.turtle.right,this.turtle.heading,r),ro(this.turtle),!0}case"rl":{const r=this.evalArg(i.expr);return this.turtle.up=Di(this.turtle.up,this.turtle.heading,-r),this.turtle.right=Di(this.turtle.right,this.turtle.heading,-r),ro(this.turtle),!0}case"pu":return this.turtle.penDown=!1,!0;case"pd":return this.turtle.penDown=!0,!0;case"color":return this.turtle.color=i.color,!0;case"width":{const r=this.evalArg(i.expr);if(!Number.isInteger(r)||r<1||r>12)throw new gi("Grubość pisaka musi być liczbą całkowitą od 1 do 12.",i.expr.line,i.expr.column);return this.turtle.width=r,!0}case"let":{const r=this.evalArg(i.expr);return this.assignVar(i.name,r),!0}case"home":{const r=[...this.turtle.pos];if((r[0]!==0||r[1]!==0||r[2]!==0)&&this.turtle.penDown){if(this.segments.length>=rn.MAX_SEGMENTS)throw new gi(`Przekroczono limit odcinków (${rn.MAX_SEGMENTS}).`,i.line,i.column);this.segments.push({from:r,to:[0,0,0],color:this.turtle.color,width:this.turtle.width})}return this.turtle.pos=[0,0,0],this.turtle.heading=[0,1,0],this.turtle.right=[1,0,0],this.turtle.up=[0,0,1],!0}case"cs":return this.segments.length=0,!0;case"stop":{for(;this.frames.length>0;){const r=this.frames[this.frames.length-1];if(r.kind==="top")return this.finished=!0,!1;if(this.frames.pop(),r.kind==="proc")return!0}return this.finished=!0,!1}case"repeat":{const r=this.evalArg(i.count);if(!Number.isInteger(r)||r<0||r>1e4)throw new gi("Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.",i.count.line,i.count.column);if(r>0){if(this.countActiveFrames()>=rn.MAX_FRAMES)throw new gi(`Przekroczono limit zagnieżdżenia wywołań i pętli (${rn.MAX_FRAMES}).`,i.line,i.column);this.frames.push({kind:"repeat",stmts:i.body,ip:0,total:r,iter:1,line:i.line,column:i.column})}return!0}case"if":return this.evalCondition(i.cond)&&this.frames.push({kind:"cond",stmts:i.body,ip:0,line:i.line,column:i.column}),!0;case"ifelse":{const r=this.evalCondition(i.cond)?i.thenBody:i.elseBody;return this.frames.push({kind:"cond",stmts:r,ip:0,line:i.line,column:i.column}),!0}case"call":{const r=this.program.procedures.get(i.name);if(this.countActiveFrames()>=rn.MAX_FRAMES)throw new gi(`Przekroczono limit zagnieżdżenia wywołań i pętli (${rn.MAX_FRAMES}).`,i.line,i.column);const l=new Map;for(let u=0;u<r.params.length;u++)l.set(r.params[u],this.evalArg(i.args[u]));return this.frames.push({kind:"proc",stmts:r.body,ip:0,locals:l,line:i.line,column:i.column}),!0}}}}catch(e){return e instanceof gi?this.error=e.logoError:this.error={message:e instanceof Error?e.message:"Nieznany błąd wykonania.",line:1,column:1},!1}}}function jl(s,e){try{const i=Kb(s);return{program:$b(i,e),error:null}}catch(i){return{program:null,error:t1(i)}}}function Ql(s,e){const{program:i,error:r}=jl(s,e);if(r||!i)return{segments:[],error:r};const l=new Vl(i,e);for(;l.step(););const u=l.snapshot();return{segments:u.segments,error:u.error}}const Ol=[{id:"wyzwanie-kwadrat",title:"1. Kwadrat o boku 100",mode:"2d",difficulty:"Łatwe",prompt:"Narysuj kwadrat o boku 100, zaczynając w punkcie (0, 0).",hint:"Użyj pętli „powtórz 4 [ np 100 pw 90 ]” (albo skręcaj w lewo).",referenceCode:`powtorz 4 [
  np 100
  pw 90
]`,starterCode:`; Narysuj kwadrat o boku 100
powtorz 4 [
  np 100
  
]`},{id:"wyzwanie-trojkat",title:"2. Trójkąt równoboczny",mode:"2d",difficulty:"Łatwe",prompt:"Narysuj trójkąt równoboczny o boku 120.",hint:"Żółw skręca o kąt zewnętrzny: 360 / 3 = 120 stopni.",referenceCode:`powtorz 3 [
  np 120
  pw 120
]`,starterCode:`; Trójkąt równoboczny o boku 120
powtorz 3 [
  np 120
  pw 120
]`},{id:"wyzwanie-szesciokat",title:"3. Sześciokąt foremny",mode:"2d",difficulty:"Łatwe",prompt:"Narysuj sześciokąt foremny o boku 70.",hint:"Sześć boków, więc każdy skręt to 360 / 6 = 60 stopni.",referenceCode:`powtorz 6 [
  np 70
  pw 60
]`,starterCode:`; Sześciokąt foremny o boku 70
`},{id:"wyzwanie-domek",title:"4. Domek z dachem",mode:"2d",difficulty:"Średnie",prompt:"Narysuj kwadrat o boku 100, a nad nim trójkątny dach o boku 100.",hint:"Najpierw narysuj kwadrat (pw 90), potem przejdź na górną krawędź (np 100 pw 30) i narysuj dach.",referenceCode:`powtorz 4 [np 100 pw 90]
np 100
pw 30
np 100
pw 120
np 100`,starterCode:`; Kwadrat 100x100 i trójkątny dach o boku 100
powtorz 4 [np 100 pw 90]
`},{id:"wyzwanie-wiatrak",title:"5. Wiatrak z czterech kwadratów",mode:"2d",difficulty:"Średnie",prompt:"Narysuj 4 kwadraty o boku 60 obrócone wokół środka co 90 stopni.",hint:"Zdefiniuj procedurę „kwadrat” albo użyj zagnieżdżonej pętli „powtórz”.",referenceCode:`powtorz 4 [
  powtorz 4 [np 60 pw 90]
  pw 90
]`,starterCode:`; Cztery kwadraty o boku 60 obrócone co 90 stopni
`},{id:"wyzwanie-wieza3d",title:"6. Maszt 3D",mode:"3d",difficulty:"Średnie",prompt:"W trybie 3D narysuj podstawę (kwadrat o boku 60) i pionowy maszt o wysokości 90 ze środka (0, 0, 0) w górę (+Z).",hint:"Najpierw narysuj kwadrat w płaszczyźnie XY, a potem „gora 90 np 90”.",referenceCode:`powtorz 4 [np 60 pw 90]
gora 90
np 90`,starterCode:`; Podstawa 60x60 i pionowy maszt wysokości 90 w +Z
`}];function ny(s,e=2){const i=[];for(const r of s){const l=r.to[0]-r.from[0],u=r.to[1]-r.from[1],d=r.to[2]-r.from[2],h=Math.hypot(l,u,d),p=Math.max(1,Math.ceil(h/e));for(let g=0;g<=p;g++){const _=g/p;i.push([r.from[0]+l*_,r.from[1]+u*_,r.from[2]+d*_])}}return i}function n1(s,e,i){const r=i[0]-e[0],l=i[1]-e[1],u=i[2]-e[2],d=r*r+l*l+u*u;if(d===0){const m=s[0]-e[0],S=s[1]-e[1],x=s[2]-e[2];return m*m+S*S+x*x}let h=((s[0]-e[0])*r+(s[1]-e[1])*l+(s[2]-e[2])*u)/d;h=Math.max(0,Math.min(1,h));const p=e[0]+h*r-s[0],g=e[1]+h*l-s[1],_=e[2]+h*u-s[2];return p*p+g*g+_*_}function iy(s,e){let i=0;for(const r of s){let l=1/0;for(const u of e){const d=n1(r,u.from,u.to);d<l&&(l=d)}l>i&&(i=l)}return Math.sqrt(i)}function i1(s,e){const i=Ql(e,s.mode);if(i.error)return{passed:!1,reason:`Program zawiera błąd w wierszu ${i.error.line}: ${i.error.message}`};if(i.segments.length===0)return{passed:!1,reason:"Nic jeszcze nie narysowano. Napisz polecenia rysujące i spróbuj ponownie."};const r=Ql(s.referenceCode,s.mode),l=1.5,u=ny(r.segments,2),d=ny(i.segments,2);return iy(u,i.segments)>l?{passed:!1,reason:"Brakuje części wzorcowego rysunku lub wymiary/kąty różnią się od zadania."}:iy(d,r.segments)>l?{passed:!1,reason:"Rysunek zawiera dodatkowe linie, których nie ma we wzorze."}:{passed:!0,reason:"Brawo! Twój rysunek idealnie odpowiada wzorowi."}}const a1=({challenge:s})=>{const{paths:e,viewBox:i}=Pt.useMemo(()=>{const r=Ql(s.referenceCode,s.mode),l=x=>{if(s.mode==="2d")return[x[0],-x[1]];const E=(x[0]-x[1])*.707,T=(x[0]+x[1])*.35-x[2]*.9;return[E,T]};let u=1/0,d=1/0,h=-1/0,p=-1/0;const g=r.segments.map(x=>{const E=l(x.from),T=l(x.to);return u=Math.min(u,E[0],T[0]),d=Math.min(d,E[1],T[1]),h=Math.max(h,E[0],T[0]),p=Math.max(p,E[1],T[1]),{a:E,b:T,color:x.color}});if(!Number.isFinite(u))return{paths:[],viewBox:"0 0 100 100"};const _=12,m=Math.max(20,h-u+_*2),S=Math.max(20,p-d+_*2);return{paths:g,viewBox:`${u-_} ${d-_} ${m} ${S}`}},[s]);return j.jsx("svg",{className:"challenge-svg",viewBox:i,"aria-hidden":"true",children:e.map((r,l)=>j.jsx("line",{x1:r.a[0],y1:r.a[1],x2:r.b[0],y2:r.b[1],stroke:r.color,strokeWidth:2.5,strokeLinecap:"round",vectorEffect:"non-scaling-stroke"},l))})},r1=({currentCode:s,solvedIds:e,onMarkSolved:i,onLoadStarter:r})=>{const[l,u]=Pt.useState(Ol[0].id),[d,h]=Pt.useState({}),p=Ol.find(m=>m.id===l)??Ol[0],g=d[p.id],_=()=>{const m=i1(p,s);h(S=>({...S,[p.id]:m})),m.passed&&i(p.id)};return j.jsxs("div",{className:"side-panel",children:[j.jsxs("div",{className:"challenges-summary",children:[j.jsx(xS,{size:16}),j.jsxs("span",{children:["Ukończono ",e.size," z ",Ol.length," zadań"]})]}),j.jsx("div",{className:"challenge-tabs",role:"tablist","aria-label":"Lista wyzwań",children:Ol.map(m=>{const S=e.has(m.id),x=m.id===p.id;return j.jsxs("button",{type:"button",role:"tab","aria-selected":x,className:`challenge-tab${x?" is-active":""}${S?" is-solved":""}`,onClick:()=>u(m.id),children:[j.jsx("span",{children:m.title}),S&&j.jsx(yb,{size:14,"aria-label":"Zaliczono"})]},m.id)})}),j.jsxs("div",{className:"challenge-detail",role:"tabpanel",children:[j.jsxs("div",{className:"challenge-meta",children:[j.jsx("span",{className:`mode-pill mode-${p.mode}`,children:p.mode.toUpperCase()}),j.jsx("span",{className:"diff-pill",children:p.difficulty}),e.has(p.id)&&j.jsx("span",{className:"solved-pill",children:"Zaliczono"})]}),j.jsx("p",{className:"challenge-prompt",children:p.prompt}),j.jsxs("p",{className:"challenge-hint",children:[j.jsx("strong",{children:"Wskazówka:"})," ",p.hint]}),j.jsxs("div",{className:"challenge-preview-box",children:[j.jsx("span",{className:"preview-label",children:"Wzór do narysowania:"}),j.jsx(a1,{challenge:p})]}),j.jsxs("div",{className:"challenge-actions",children:[j.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>r(p),children:"Otwórz szablon w edytorze"}),j.jsxs("button",{type:"button",className:"btn btn-primary",onClick:_,children:[j.jsx(SS,{size:15}),"Sprawdź rozwiązanie"]})]}),g&&j.jsx("div",{className:`challenge-result ${g.passed?"is-pass":"is-fail"}`,role:"status",children:g.reason})]})]})};function s1(s){const e=[];let i=0;for(;i<s.length;){const r=s[i];if(r===";"){e.push({text:s.slice(i),kind:"comment"});break}if(r==='"'){let l=i+1;for(;l<s.length&&s[l]!=='"';)l++;l<s.length&&l++,e.push({text:s.slice(i,l),kind:"string"}),i=l;continue}if(r===" "||r==="	"||r==="\r"){let l=i+1;for(;l<s.length&&(s[l]===" "||s[l]==="	"||s[l]==="\r");)l++;e.push({text:s.slice(i,l),kind:"plain"}),i=l;continue}if(r==="["||r==="]"||r==="("||r===")"){e.push({text:r,kind:"bracket"}),i++;continue}if("+-*/<>=,".includes(r)){let l=i+1;(r==="<"&&(s[l]==="="||s[l]===">")||r===">"&&s[l]==="=")&&l++,e.push({text:s.slice(i,l),kind:"operator"}),i=l;continue}if(r>="0"&&r<="9"||r==="."&&i+1<s.length&&s[i+1]>="0"&&s[i+1]<="9"){let l=i;for(;l<s.length&&s[l]>="0"&&s[l]<="9";)l++;if(s[l]===".")for(l++;l<s.length&&s[l]>="0"&&s[l]<="9";)l++;e.push({text:s.slice(i,l),kind:"number"}),i=l;continue}if(r===":"){let l=i+1;for(;l<s.length&&/[\p{L}0-9_]/u.test(s[l]);)l++;e.push({text:s.slice(i,l),kind:"name"}),i=l;continue}if(/[\p{L}_]/u.test(r)){let l=i+1;for(;l<s.length&&/[\p{L}0-9_]/u.test(s[l]);)l++;let u=s.slice(i,l);u.toLowerCase()==="ma"&&s[l]===":"&&(l++,u=s.slice(i,l));const d=Ao(u)?"keyword":"name";e.push({text:u,kind:d}),i=l;continue}e.push({text:r,kind:"plain"}),i++}return e}const o1=({value:s,onChange:e,activeLine:i,error:r})=>{const l=Pt.useRef(null),u=Pt.useRef(null),d=Pt.useRef(null),h=Pt.useMemo(()=>s.split(`
`),[s]),p=Pt.useMemo(()=>h.map(_=>s1(_)),[h]),g=()=>{const _=l.current;_&&(u.current&&(u.current.scrollTop=_.scrollTop,u.current.scrollLeft=_.scrollLeft),d.current&&(d.current.scrollTop=_.scrollTop))};return j.jsxs("div",{className:"editor-shell",children:[j.jsxs("div",{className:"editor-body",children:[j.jsx("div",{className:"editor-gutter",ref:d,"aria-hidden":"true",children:h.map((_,m)=>{const S=m+1,x=i===S,E=r?.line===S;return j.jsx("div",{className:`gutter-line${x?" is-exec":""}${E?" is-error":""}`,children:S},S)})}),j.jsxs("div",{className:"editor-code-area",children:[j.jsx("div",{className:"editor-highlight",ref:u,"aria-hidden":"true",children:p.map((_,m)=>{const S=m+1,x=i===S,E=r?.line===S,T=E&&r?Math.max(1,r.column):null;return j.jsxs("div",{className:`code-line${x?" is-exec":""}${E?" is-error":""}`,children:[_.length===0?j.jsx("span",{children:"​"}):_.map((M,y)=>j.jsx("span",{className:`tok-${M.kind}`,children:M.text},y)),T!==null&&j.jsx("span",{className:"inline-error-caret",style:{left:`${T-1}ch`},title:r?.message})]},S)})}),j.jsx("textarea",{ref:l,className:"editor-textarea",value:s,onChange:_=>e(_.target.value),onScroll:g,"aria-label":"Edytor programu Logo",spellCheck:!1,autoCapitalize:"off",autoComplete:"off",autoCorrect:"off",wrap:"off"})]})]}),r&&j.jsxs("div",{className:"editor-error-banner",role:"alert",children:[j.jsxs("span",{className:"error-loc",children:["Wiersz ",r.line,", kolumna ",r.column,":"]})," ",j.jsx("span",{children:r.message})]})]})},RS=[{id:"kwadrat",title:"Kwadrat",mode:"2d",description:"Cztery kroki do pierwszego rysunku.",code:`; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]`},{id:"gwiazda",title:"Gwiazda",mode:"2d",description:"Mała zmiana kąta, wielka różnica.",code:`; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]`},{id:"rozeta",title:"Rozeta",mode:"2d",description:"Jeden kwadrat. Wiele możliwości.",code:`; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]`},{id:"spirala",title:"Spirala",mode:"2d",description:"Licznik powtórzeń i zmienna zmieniają kolor.",code:`; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]`},{id:"wielokaty",title:"Wielokąty",mode:"2d",description:"Procedura liczy kąt z liczby boków.",code:`; Jedna procedura, wiele figur: kąt liczy się sam.
oto wielokąt ma: boki, bok
  powtorz boki [np bok pw 360 / boki]
już

grubosc 2
niech n 3
powtorz 7 [
  wielokąt n 60
  niech n n + 1
  pw 360 / 7
]`},{id:"drzewo",title:"Drzewo",mode:"2d",description:"Gałąź rysuje dwie mniejsze gałęzie.",code:`; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
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
gałąź 90`},{id:"sniezynka",title:"Śnieżynka",mode:"2d",description:"Krzywa Kocha z czterech poziomów.",code:`; Krzywa Kocha: każdy odcinek dzieli się na cztery.
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
]`},{id:"schody",title:"Schody",mode:"3d",description:"Pierwszy krok w trzeci wymiar.",code:`; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]`},{id:"szescian",title:"Sześcian",mode:"3d",description:"Zbuduj bryłę z prostych poleceń.",code:`; Dwa kwadraty połączone krawędziami.
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
]`},{id:"pierscien",title:"Pierścień",mode:"3d",description:"Okrąg przechylony w przestrzeni.",code:`; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]`},{id:"kula",title:"Kula",mode:"3d",description:"Okręgi obrócone wokół kierunku żółwia.",code:`; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]`},{id:"helisa",title:"Helisa",mode:"3d",description:"Spirala wznosi się obrót po obrocie.",code:`; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]`},{id:"drzewo3d",title:"Drzewo 3D",mode:"3d",description:"Gałęzie obracają się wokół pnia.",code:`; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
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
gałąź 70`}],l1=({open:s,onClose:e,hasUnsavedDraft:i,onSelectExample:r})=>{const l=Pt.useRef(null),[u,d]=Pt.useState(null);Pt.useEffect(()=>{const p=l.current;p&&(s&&!p.open?(d(null),p.showModal()):!s&&p.open&&p.close())},[s]);const h=p=>{i(p.mode)?d(p):(r(p),e())};return j.jsxs("dialog",{ref:l,className:"modal-dialog","aria-labelledby":"examples-title",onClose:()=>{d(null),e()},children:[j.jsxs("div",{className:"modal-header",children:[j.jsx("h2",{id:"examples-title",children:"Przykładowe programy"}),j.jsx("button",{type:"button",className:"icon-btn",onClick:e,"aria-label":"Zamknij okno przykładów",children:j.jsx(MS,{size:18})})]}),u?j.jsxs("div",{className:"confirm-box",children:[j.jsxs("p",{children:["Masz niezapisane zmiany w trybie ",j.jsx("strong",{children:u.mode.toUpperCase()}),". Wczytanie przykładu ",j.jsxs("strong",{children:["„",u.title,"”"]})," zastąpi obecny szkic."]}),j.jsxs("div",{className:"confirm-actions",children:[j.jsx("button",{type:"button",className:"btn btn-secondary",autoFocus:!0,onClick:()=>d(null),children:"Anuluj"}),j.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>{r(u),d(null),e()},children:"Zastąp szkic"})]})]}):j.jsx("div",{className:"examples-grid",children:RS.map(p=>j.jsxs("button",{type:"button",className:"example-card",onClick:()=>h(p),children:[j.jsxs("div",{className:"example-card-top",children:[j.jsx("span",{className:"example-title",children:p.title}),j.jsx("span",{className:`mode-pill mode-${p.mode}`,children:p.mode.toUpperCase()})]}),j.jsx("p",{className:"example-desc",children:p.description})]},p.id))})]})},c1=({open:s,onClose:e})=>{const i=Pt.useRef(null);return Pt.useEffect(()=>{const r=i.current;r&&(s&&!r.open?r.showModal():!s&&r.open&&r.close())},[s]),j.jsxs("dialog",{ref:i,className:"modal-dialog modal-narrow","aria-labelledby":"help-title",onClose:e,children:[j.jsxs("div",{className:"modal-header",children:[j.jsx("h2",{id:"help-title",children:"Skróty klawiszowe i pomoc"}),j.jsx("button",{type:"button",className:"icon-btn",onClick:e,"aria-label":"Zamknij okno skrótów",children:j.jsx(MS,{size:18})})]}),j.jsxs("div",{className:"shortcuts-list",children:[j.jsxs("div",{className:"shortcut-row",children:[j.jsx("span",{children:"Uruchom program"}),j.jsx("kbd",{children:"Ctrl / ⌘ + Enter"})]}),j.jsxs("div",{className:"shortcut-row",children:[j.jsx("span",{children:"Wykonaj jeden krok"}),j.jsx("kbd",{children:"Alt + S"})]}),j.jsxs("div",{className:"shortcut-row",children:[j.jsx("span",{children:"Wstrzymaj / wznów animację"}),j.jsx("kbd",{children:"Alt + P"})]}),j.jsxs("div",{className:"shortcut-row",children:[j.jsx("span",{children:"Resetuj rysunek i żółwia"}),j.jsx("kbd",{children:"Alt + R"})]})]}),j.jsx("p",{className:"help-note",children:"Szkice w trybach 2D i 3D oraz postęp wyzwań zapisują się automatycznie w pamięci przeglądarki (localStorage). Link z przycisku „Udostępnij” koduje aktualny program i tryb w adresie URL."})]})},u1=[{polish:"np, naprzod, naprzód",english:"fd, forward",arg:"wyrażenie",summary:"Przesuwa żółwia do przodu o podaną odległość.",example:"np 100"},{polish:"ws, wstecz",english:"bk, back",arg:"wyrażenie",summary:"Przesuwa żółwia do tyłu o podaną odległość.",example:"ws 50"},{polish:"pw, prawo",english:"rt, right",arg:"wyrażenie",summary:"Obraca żółwia w prawo o podaną liczbę stopni.",example:"pw 90"},{polish:"lw, lewo",english:"lt, left",arg:"wyrażenie",summary:"Obraca żółwia w lewo o podaną liczbę stopni.",example:"lw 45"},{polish:"pod, podnies, podnieś",english:"pu, penup",arg:"brak",summary:"Podnosi pisak — ruchy żółwia nie zostawiają śladu.",example:"pod np 40 opu"},{polish:"opu, opusc, opuść",english:"pd, pendown",arg:"brak",summary:"Opuszcza pisak — żółw znów rysuje podczas ruchu.",example:"opu np 80"},{polish:"kolor",english:"color",arg:'"#rrggbb"',summary:"Ustawia kolor pisaka jako sześciocyfrowy kod szesnastkowy w cudzysłowie.",example:'kolor "#16866a"'},{polish:"grubosc, grubość",english:"width",arg:"liczba całkowita 1–12",summary:"Ustawia grubość linii od 1 do 12 pikseli.",example:"grubosc 3"},{polish:"powtorz, powtórz",english:"repeat",arg:"liczba 0–10000, [ blok ]",summary:"Wykonuje blok poleceń zadaną liczbę razy. Wewnątrz działa licznik nrpowt (od 1).",example:"powtorz 4 [np 80 pw 90]"},{polish:"niech",english:"let",arg:"nazwa wyrażenie",summary:"Tworzy lub zmienia wartość zmiennej (globalnej na poziomie głównym, lokalnej w procedurze).",example:"niech bok 60"},{polish:"jeśli, jesli",english:"if",arg:"warunek [ blok ]",summary:"Wykonuje blok, gdy warunek jest spełniony.",example:"jeśli bok > 10 [np bok]"},{polish:"jeżeli, jezeli",english:"ifelse",arg:"warunek [ tak ] [ nie ]",summary:"Wykonuje pierwszy blok, gdy warunek jest spełniony, w przeciwnym razie drugi.",example:"jeżeli n > 0 [np 20] [ws 20]"},{polish:"stop",english:"stop",arg:"brak",summary:"Kończy bieżącą procedurę lub (na poziomie głównym) cały program.",example:"jeśli dł < 5 [stop]"},{polish:"dom",english:"home",arg:"brak",summary:"Wraca do początku układu (0, 0, 0) i początkowej orientacji (rysuje, jeśli pisak jest opuszczony).",example:"dom"},{polish:"czyść, czysc",english:"cs, clearscreen",arg:"brak",summary:"Usuwa wszystkie narysowane dotąd odcinki, nie zmieniając pozycji ani ustawień żółwia.",example:"czyść"},{polish:"gora, góra",english:"pitchup",arg:"wyrażenie",summary:"Pochyla dziób żółwia w górę o podaną liczbę stopni.",example:"gora 90",only3d:!0},{polish:"dol, dół",english:"pitchdown",arg:"wyrażenie",summary:"Pochyla dziób żółwia w dół o podaną liczbę stopni.",example:"dol 45",only3d:!0},{polish:"pp, przechylprawo",english:"rr, rollright",arg:"wyrażenie",summary:"Obraca żółwia wokół osi jego kierunku ruchu w prawo.",example:"pp 15",only3d:!0},{polish:"pl, przechyllewo",english:"rl, rollleft",arg:"wyrażenie",summary:"Obraca żółwia wokół osi jego kierunku ruchu w lewo.",example:"pl 30",only3d:!0}],f1=[{title:"Wyrażenia i operatory",body:["W miejscach oczekujących liczby można używać liczb dziesiętnych (np. 80, 12.5, .5), nazw zmiennych lub parametrów (także w starszym zapisie :nazwa), licznika nrpowt (alias repcount), nawiasów ( ) oraz operatorów +, -, *, /.","Mnożenie i dzielenie mają wyższy priorytet niż dodawanie i odejmowanie, a operatory o równym priorytecie łączą się od lewej: np 20 - 5 - 3 przesunie żółwia o 12.","Operator dwuargumentowy (+, -, *, /) musi mieć odstęp po obu stronach albo po żadnej: np 10 - 5 i np 10-5 są poprawne, ale np 10 -5 jest błędem. Operatory jednoargumentowe (+ i -) można stawiać przed wyrażeniem, np. np -(3 - 5) lub np - -2.","Dzielenie przez zero oraz wyniki nieliczbowe są błędami wykonania."]},{title:"Zmienne i pętle",body:["Zmienna zadeklarowana przez niech na poziomie głównym jest globalna. Zmienna utworzona przez niech wewnątrz procedury jest lokalna dla danego wywołania i przesłania zmienną globalną o tej samej nazwie.","Wewnątrz pętli powtórz słowo nrpowt (alias repcount) daje numer bieżącego powtórzenia, licząc od 1. Użycie nrpowt poza leksykalnym blokiem powtórz (np. w procedurze wywoływanej z pętli) jest błędem."]},{title:"Warunki",body:["Warunek ma postać wyrażenie operator wyrażenie, gdzie operatorem porównania jest <, >, =, <=, >= lub <> (różne).","Porównania są dokładne (np. 0.1 + 0.2 = 0.3 nie jest spełnione z powodu arytmetyki zmiennoprzecinkowej)."]},{title:"Procedury",body:["Definicja procedury zaczyna się od słowa oto (alias to) na początku wiersza, po którym następuje nazwa oraz opcjonalnie ma: i lista parametrów oddzielonych przecinkami (lub starszy zapis :param1 :param2). Ciało procedury kończy się słowem już (aliasy juz, end) stojącym samodzielnie w wierszu.","Procedury można definiować wyłącznie na poziomie głównym — przed lub po wywołaniach, które z nich korzystają. Procedura może wywoływać samą siebie (rekurencja)."]},{title:"Limity środowiska",body:["Maksymalna długość kodu źródłowego: 50 000 znaków.","Maksymalna liczba tokenów: 10 000.","Maksymalna głębokość nawiasów kwadratowych [ ]: 32.","Maksymalna liczba aktywnych ramek wywołań procedur i pętli powtórz: 32.","Maksymalna liczba wykonanych operacji: 10 000.","Maksymalna liczba przechowywanych odcinków: 10 000 (polecenie czyść zeruje licznik).","Dozwolony zakres współrzędnych X, Y, Z: od -100 000 do +100 000."]}],h1=()=>j.jsxs("div",{className:"side-panel reference-panel",children:[j.jsx("p",{className:"ref-intro",children:"Wielkość liter nie ma znaczenia. Polskie polecenia (z polskimi znakami lub bez nich) oraz ich angielskie odpowiedniki działają identycznie."}),j.jsx("h3",{className:"ref-heading",children:"Polecenia"}),j.jsx("div",{className:"ref-table-wrap",children:j.jsxs("table",{className:"ref-table",children:[j.jsx("thead",{children:j.jsxs("tr",{children:[j.jsx("th",{children:"Polskie"}),j.jsx("th",{children:"Angielskie"}),j.jsx("th",{children:"Argument"}),j.jsx("th",{children:"Działanie i przykład"})]})}),j.jsx("tbody",{children:u1.map(s=>j.jsxs("tr",{children:[j.jsxs("td",{children:[j.jsx("code",{children:s.polish}),s.only3d&&j.jsx("span",{className:"badge-3d",children:"3D"})]}),j.jsx("td",{children:j.jsx("code",{children:s.english})}),j.jsx("td",{children:s.arg}),j.jsxs("td",{children:[j.jsx("div",{children:s.summary}),j.jsx("code",{className:"ref-example",children:s.example})]})]},s.polish))})]})}),f1.map(s=>j.jsxs("section",{className:"ref-section",children:[j.jsx("h3",{className:"ref-heading",children:s.title}),s.body.map((e,i)=>j.jsx("p",{className:"ref-para",children:e},i))]},s.title))]}),CS=Pt.forwardRef(({segments:s,turtle:e,showTurtle:i=!0},r)=>{const l=Pt.useRef(null),u=Pt.useRef(null),d=Pt.useRef({cx:0,cy:0,zoom:1.2}),[h,p]=Pt.useState("120%"),g=Pt.useRef({active:!1,lastX:0,lastY:0}),_=Pt.useCallback(()=>{const U=u.current,O=l.current;if(!U||!O)return;const N=window.devicePixelRatio||1,G=O.clientWidth,F=O.clientHeight;if(G===0||F===0)return;(U.width!==Math.floor(G*N)||U.height!==Math.floor(F*N))&&(U.width=Math.floor(G*N),U.height=Math.floor(F*N));const z=U.getContext("2d");if(!z)return;const I=getComputedStyle(document.documentElement).colorScheme==="dark"||getComputedStyle(document.documentElement).colorScheme!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches;z.save(),z.scale(N,N),z.fillStyle=I?"#11161b":"#fbfaf7",z.fillRect(0,0,G,F);const{cx:D,cy:A,zoom:B}=d.current,it=R=>G/2+(R-D)*B,at=R=>F/2-(R-A)*B;let ct=50;for(;ct*B<28;)ct*=2;for(;ct*B>110;)ct/=2;const V=D-G/(2*B),st=D+G/(2*B),q=A-F/(2*B),St=A+F/(2*B);z.strokeStyle=I?"rgba(255,255,255,0.05)":"rgba(20,30,40,0.06)",z.lineWidth=1,z.beginPath();const vt=Math.floor(V/ct)*ct;for(let R=vt;R<=st;R+=ct){const Y=it(R);z.moveTo(Y,0),z.lineTo(Y,F)}const At=Math.floor(q/ct)*ct;for(let R=At;R<=St;R+=ct){const Y=at(R);z.moveTo(0,Y),z.lineTo(G,Y)}z.stroke();const Yt=it(0),ie=at(0);z.strokeStyle=I?"rgba(255,255,255,0.16)":"rgba(20,30,40,0.16)",z.lineWidth=1,z.beginPath(),z.moveTo(Yt-10,ie),z.lineTo(Yt+10,ie),z.moveTo(Yt,ie-10),z.lineTo(Yt,ie+10),z.stroke(),z.fillStyle=I?"rgba(255,255,255,0.38)":"rgba(20,30,40,0.38)",z.beginPath(),z.arc(Yt,ie,3,0,Math.PI*2),z.fill(),z.lineCap="round",z.lineJoin="round";for(const R of s)z.strokeStyle=R.color,z.lineWidth=R.width,z.beginPath(),z.moveTo(it(R.from[0]),at(R.from[1])),z.lineTo(it(R.to[0]),at(R.to[1])),z.stroke();if(i){const R=it(e.pos[0]),Y=at(e.pos[1]),yt=Math.atan2(-e.heading[1],e.heading[0]);z.save(),z.translate(R,Y),z.rotate(yt),z.beginPath(),z.moveTo(13,0),z.lineTo(-9,-8),z.lineTo(-5,0),z.lineTo(-9,8),z.closePath(),z.fillStyle=e.penDown?e.color:"transparent",z.fill(),z.lineWidth=2,z.strokeStyle=I?"#e8f0f2":"#1b242c",z.stroke(),z.restore()}z.restore()},[s,e,i]),m=Pt.useCallback((U,O)=>{const N=l.current;if(!N)return;const G=N.clientWidth||600,F=N.clientHeight||400,z=U??s,I=O??e;let D=0,A=0,B=0,it=0,at=!1;for(const vt of z)for(const At of[vt.from,vt.to])at?(At[0]<D&&(D=At[0]),At[0]>A&&(A=At[0]),At[1]<B&&(B=At[1]),At[1]>it&&(it=At[1])):(D=A=At[0],B=it=At[1],at=!0);at||(D=Math.min(0,I.pos[0])-100,A=Math.max(0,I.pos[0])+100,B=Math.min(0,I.pos[1])-100,it=Math.max(0,I.pos[1])+100);const ft=Math.max(20,A-D),ct=Math.max(20,it-B),V=48,st=(G-V*2)/ft,q=(F-V*2)/ct,St=Math.max(.02,Math.min(8,Math.min(st,q)));d.current={cx:(D+A)/2,cy:(B+it)/2,zoom:St},p(`${Math.round(St*100)}%`),_()},[s,e,_]),S=Pt.useCallback(()=>{d.current={cx:0,cy:0,zoom:1.2},p("120%"),_()},[_]);Pt.useImperativeHandle(r,()=>({fit:m,resetView:S,getCanvas:()=>u.current}),[m,S]),Pt.useEffect(()=>{_()},[_]),Pt.useEffect(()=>{const U=l.current;if(!U)return;const O=new ResizeObserver(()=>_());return O.observe(U),()=>O.disconnect()},[_]);const x=U=>{const O=d.current;O.zoom=Math.max(.02,Math.min(20,O.zoom*U)),p(`${Math.round(O.zoom*100)}%`),_()},E=U=>{U.preventDefault();const O=U.deltaY<0?1.12:1/1.12;x(O)},T=U=>{U.currentTarget.setPointerCapture(U.pointerId),g.current={active:!0,lastX:U.clientX,lastY:U.clientY}},M=U=>{if(!g.current.active)return;const O=U.clientX-g.current.lastX,N=U.clientY-g.current.lastY;g.current.lastX=U.clientX,g.current.lastY=U.clientY;const G=d.current;G.cx-=O/G.zoom,G.cy+=N/G.zoom,_()},y=()=>{g.current.active=!1};return j.jsxs("div",{className:"viewport-container",ref:l,children:[j.jsx("canvas",{ref:u,className:"viewport-canvas",onWheel:E,onPointerDown:T,onPointerMove:M,onPointerUp:y,onPointerCancel:y,"aria-label":"Płótno 2D"}),j.jsxs("div",{className:"viewport-overlay-controls",role:"group","aria-label":"Widok 2D",children:[j.jsx("button",{type:"button",className:"icon-btn",onClick:()=>x(1.25),"aria-label":"Przybliż widok 2D",title:"Przybliż",children:j.jsx(ES,{size:16})}),j.jsx("span",{className:"zoom-badge","aria-live":"polite",children:h}),j.jsx("button",{type:"button",className:"icon-btn",onClick:()=>x(.8),"aria-label":"Oddal widok 2D",title:"Oddal",children:j.jsx(bS,{size:16})}),j.jsx("button",{type:"button",className:"icon-btn",onClick:()=>m(),"aria-label":"Dopasuj rysunek do widoku",title:"Dopasuj",children:j.jsx(yS,{size:16})}),j.jsx("button",{type:"button",className:"icon-btn",onClick:S,"aria-label":"Wyśrodkuj na początku układu (0, 0)",title:"Środek (0, 0)",children:j.jsx(Mm,{size:16})})]})]})});CS.displayName="Viewport2D";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Em="173",Ro={ROTATE:0,DOLLY:1,PAN:2},bo={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},d1=0,ay=1,p1=2,DS=1,m1=2,Pa=3,Nr=0,si=1,Ba=2,Cr=0,Co=1,ry=2,sy=3,oy=4,g1=5,cs=100,_1=101,v1=102,y1=103,S1=104,x1=200,M1=201,E1=202,b1=203,Up=204,zp=205,T1=206,w1=207,A1=208,R1=209,C1=210,D1=211,N1=212,U1=213,z1=214,Lp=0,Op=1,Pp=2,Uo=3,Bp=4,Ip=5,Fp=6,Hp=7,NS=0,L1=1,O1=2,Dr=0,P1=1,B1=2,I1=3,F1=4,H1=5,k1=6,G1=7,US=300,zo=301,Lo=302,kp=303,Gp=304,ff=306,Vp=1e3,fs=1001,jp=1002,Wi=1003,V1=1004,bu=1005,ua=1006,qd=1007,hs=1008,Ga=1009,zS=1010,LS=1011,Jl=1012,bm=1013,ps=1014,Ia=1015,tc=1016,Tm=1017,wm=1018,Oo=1020,OS=35902,PS=1021,BS=1022,Yi=1023,IS=1024,FS=1025,Do=1026,Po=1027,HS=1028,Am=1029,kS=1030,Rm=1031,Cm=1033,Ju=33776,$u=33777,tf=33778,ef=33779,Xp=35840,Yp=35841,Wp=35842,qp=35843,Zp=36196,Kp=37492,Qp=37496,Jp=37808,$p=37809,tm=37810,em=37811,nm=37812,im=37813,am=37814,rm=37815,sm=37816,om=37817,lm=37818,cm=37819,um=37820,fm=37821,nf=36492,hm=36494,dm=36495,GS=36283,pm=36284,mm=36285,gm=36286,j1=3200,X1=3201,VS=0,Y1=1,Ar="",zi="srgb",Bo="srgb-linear",rf="linear",Ge="srgb",so=7680,ly=519,W1=512,q1=513,Z1=514,jS=515,K1=516,Q1=517,J1=518,$1=519,_m=35044,cy="300 es",Fa=2e3,sf=2001;class vs{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(i)===-1&&r[e].push(i)}hasEventListener(e,i){const r=this._listeners;return r===void 0?!1:r[e]!==void 0&&r[e].indexOf(i)!==-1}removeEventListener(e,i){const r=this._listeners;if(r===void 0)return;const l=r[e];if(l!==void 0){const u=l.indexOf(i);u!==-1&&l.splice(u,1)}}dispatchEvent(e){const i=this._listeners;if(i===void 0)return;const r=i[e.type];if(r!==void 0){e.target=this;const l=r.slice(0);for(let u=0,d=l.length;u<d;u++)l[u].call(this,e);e.target=null}}}const Xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let uy=1234567;const Zl=Math.PI/180,$l=180/Math.PI;function Ha(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Xn[s&255]+Xn[s>>8&255]+Xn[s>>16&255]+Xn[s>>24&255]+"-"+Xn[e&255]+Xn[e>>8&255]+"-"+Xn[e>>16&15|64]+Xn[e>>24&255]+"-"+Xn[i&63|128]+Xn[i>>8&255]+"-"+Xn[i>>16&255]+Xn[i>>24&255]+Xn[r&255]+Xn[r>>8&255]+Xn[r>>16&255]+Xn[r>>24&255]).toLowerCase()}function ve(s,e,i){return Math.max(e,Math.min(i,s))}function Dm(s,e){return(s%e+e)%e}function tT(s,e,i,r,l){return r+(s-e)*(l-r)/(i-e)}function eT(s,e,i){return s!==e?(i-s)/(e-s):0}function Kl(s,e,i){return(1-i)*s+i*e}function nT(s,e,i,r){return Kl(s,e,1-Math.exp(-i*r))}function iT(s,e=1){return e-Math.abs(Dm(s,e*2)-e)}function aT(s,e,i){return s<=e?0:s>=i?1:(s=(s-e)/(i-e),s*s*(3-2*s))}function rT(s,e,i){return s<=e?0:s>=i?1:(s=(s-e)/(i-e),s*s*s*(s*(s*6-15)+10))}function sT(s,e){return s+Math.floor(Math.random()*(e-s+1))}function oT(s,e){return s+Math.random()*(e-s)}function lT(s){return s*(.5-Math.random())}function cT(s){s!==void 0&&(uy=s);let e=uy+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function uT(s){return s*Zl}function fT(s){return s*$l}function hT(s){return(s&s-1)===0&&s!==0}function dT(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function pT(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function mT(s,e,i,r,l){const u=Math.cos,d=Math.sin,h=u(i/2),p=d(i/2),g=u((e+r)/2),_=d((e+r)/2),m=u((e-r)/2),S=d((e-r)/2),x=u((r-e)/2),E=d((r-e)/2);switch(l){case"XYX":s.set(h*_,p*m,p*S,h*g);break;case"YZY":s.set(p*S,h*_,p*m,h*g);break;case"ZXZ":s.set(p*m,p*S,h*_,h*g);break;case"XZX":s.set(h*_,p*E,p*x,h*g);break;case"YXY":s.set(p*x,h*_,p*E,h*g);break;case"ZYZ":s.set(p*E,p*x,h*_,h*g);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+l)}}function ji(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Fe(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const XS={DEG2RAD:Zl,RAD2DEG:$l,generateUUID:Ha,clamp:ve,euclideanModulo:Dm,mapLinear:tT,inverseLerp:eT,lerp:Kl,damp:nT,pingpong:iT,smoothstep:aT,smootherstep:rT,randInt:sT,randFloat:oT,randFloatSpread:lT,seededRandom:cT,degToRad:uT,radToDeg:fT,isPowerOfTwo:hT,ceilPowerOfTwo:dT,floorPowerOfTwo:pT,setQuaternionFromProperEuler:mT,normalize:Fe,denormalize:ji};class fe{constructor(e=0,i=0){fe.prototype.isVector2=!0,this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,r=this.y,l=e.elements;return this.x=l[0]*i+l[3]*r+l[6],this.y=l[1]*i+l[4]*r+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=ve(this.x,e.x,i.x),this.y=ve(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=ve(this.x,e,i),this.y=ve(this.y,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(ve(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(ve(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y;return i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const r=Math.cos(i),l=Math.sin(i),u=this.x-e.x,d=this.y-e.y;return this.x=u*r-d*l+e.x,this.y=u*l+d*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class me{constructor(e,i,r,l,u,d,h,p,g){me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,d,h,p,g)}set(e,i,r,l,u,d,h,p,g){const _=this.elements;return _[0]=e,_[1]=l,_[2]=h,_[3]=i,_[4]=u,_[5]=p,_[6]=r,_[7]=d,_[8]=g,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(e,i,r){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,d=r[0],h=r[3],p=r[6],g=r[1],_=r[4],m=r[7],S=r[2],x=r[5],E=r[8],T=l[0],M=l[3],y=l[6],U=l[1],O=l[4],N=l[7],G=l[2],F=l[5],z=l[8];return u[0]=d*T+h*U+p*G,u[3]=d*M+h*O+p*F,u[6]=d*y+h*N+p*z,u[1]=g*T+_*U+m*G,u[4]=g*M+_*O+m*F,u[7]=g*y+_*N+m*z,u[2]=S*T+x*U+E*G,u[5]=S*M+x*O+E*F,u[8]=S*y+x*N+E*z,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],d=e[4],h=e[5],p=e[6],g=e[7],_=e[8];return i*d*_-i*h*g-r*u*_+r*h*p+l*u*g-l*d*p}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],d=e[4],h=e[5],p=e[6],g=e[7],_=e[8],m=_*d-h*g,S=h*p-_*u,x=g*u-d*p,E=i*m+r*S+l*x;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/E;return e[0]=m*T,e[1]=(l*g-_*r)*T,e[2]=(h*r-l*d)*T,e[3]=S*T,e[4]=(_*i-l*p)*T,e[5]=(l*u-h*i)*T,e[6]=x*T,e[7]=(r*p-g*i)*T,e[8]=(d*i-r*u)*T,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,r,l,u,d,h){const p=Math.cos(u),g=Math.sin(u);return this.set(r*p,r*g,-r*(p*d+g*h)+d+e,-l*g,l*p,-l*(-g*d+p*h)+h+i,0,0,1),this}scale(e,i){return this.premultiply(Zd.makeScale(e,i)),this}rotate(e){return this.premultiply(Zd.makeRotation(-e)),this}translate(e,i){return this.premultiply(Zd.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<9;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<9;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Zd=new me;function YS(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function of(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function gT(){const s=of("canvas");return s.style.display="block",s}const fy={};function Mo(s){s in fy||(fy[s]=!0,console.warn(s))}function _T(s,e,i){return new Promise(function(r,l){function u(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:l();break;case s.TIMEOUT_EXPIRED:setTimeout(u,i);break;default:r()}}setTimeout(u,i)})}function vT(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function yT(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const hy=new me().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),dy=new me().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ST(){const s={enabled:!0,workingColorSpace:Bo,spaces:{},convert:function(l,u,d){return this.enabled===!1||u===d||!u||!d||(this.spaces[u].transfer===Ge&&(l.r=ka(l.r),l.g=ka(l.g),l.b=ka(l.b)),this.spaces[u].primaries!==this.spaces[d].primaries&&(l.applyMatrix3(this.spaces[u].toXYZ),l.applyMatrix3(this.spaces[d].fromXYZ)),this.spaces[d].transfer===Ge&&(l.r=No(l.r),l.g=No(l.g),l.b=No(l.b))),l},fromWorkingColorSpace:function(l,u){return this.convert(l,this.workingColorSpace,u)},toWorkingColorSpace:function(l,u){return this.convert(l,u,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===Ar?rf:this.spaces[l].transfer},getLuminanceCoefficients:function(l,u=this.workingColorSpace){return l.fromArray(this.spaces[u].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,u,d){return l.copy(this.spaces[u].toXYZ).multiply(this.spaces[d].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],r=[.3127,.329];return s.define({[Bo]:{primaries:e,whitePoint:r,transfer:rf,toXYZ:hy,fromXYZ:dy,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:zi},outputColorSpaceConfig:{drawingBufferColorSpace:zi}},[zi]:{primaries:e,whitePoint:r,transfer:Ge,toXYZ:hy,fromXYZ:dy,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:zi}}}),s}const ze=ST();function ka(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function No(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let oo;class xT{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{oo===void 0&&(oo=of("canvas")),oo.width=e.width,oo.height=e.height;const r=oo.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=oo}return i.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=of("canvas");i.width=e.width,i.height=e.height;const r=i.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const l=r.getImageData(0,0,e.width,e.height),u=l.data;for(let d=0;d<u.length;d++)u[d]=ka(u[d]/255)*255;return r.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let r=0;r<i.length;r++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[r]=Math.floor(ka(i[r]/255)*255):i[r]=ka(i[r]);return{data:i,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let MT=0;class WS{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:MT++}),this.uuid=Ha(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},l=this.data;if(l!==null){let u;if(Array.isArray(l)){u=[];for(let d=0,h=l.length;d<h;d++)l[d].isDataTexture?u.push(Kd(l[d].image)):u.push(Kd(l[d]))}else u=Kd(l);r.url=u}return i||(e.images[this.uuid]=r),r}}function Kd(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?xT.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ET=0;class oi extends vs{constructor(e=oi.DEFAULT_IMAGE,i=oi.DEFAULT_MAPPING,r=fs,l=fs,u=ua,d=hs,h=Yi,p=Ga,g=oi.DEFAULT_ANISOTROPY,_=Ar){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ET++}),this.uuid=Ha(),this.name="",this.source=new WS(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=l,this.magFilter=u,this.minFilter=d,this.anisotropy=g,this.format=h,this.internalFormat=null,this.type=p,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==US)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Vp:e.x=e.x-Math.floor(e.x);break;case fs:e.x=e.x<0?0:1;break;case jp:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Vp:e.y=e.y-Math.floor(e.y);break;case fs:e.y=e.y<0?0:1;break;case jp:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}oi.DEFAULT_IMAGE=null;oi.DEFAULT_MAPPING=US;oi.DEFAULT_ANISOTROPY=1;class We{constructor(e=0,i=0,r=0,l=1){We.prototype.isVector4=!0,this.x=e,this.y=i,this.z=r,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,r,l){return this.x=e,this.y=i,this.z=r,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=this.w,d=e.elements;return this.x=d[0]*i+d[4]*r+d[8]*l+d[12]*u,this.y=d[1]*i+d[5]*r+d[9]*l+d[13]*u,this.z=d[2]*i+d[6]*r+d[10]*l+d[14]*u,this.w=d[3]*i+d[7]*r+d[11]*l+d[15]*u,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,r,l,u;const p=e.elements,g=p[0],_=p[4],m=p[8],S=p[1],x=p[5],E=p[9],T=p[2],M=p[6],y=p[10];if(Math.abs(_-S)<.01&&Math.abs(m-T)<.01&&Math.abs(E-M)<.01){if(Math.abs(_+S)<.1&&Math.abs(m+T)<.1&&Math.abs(E+M)<.1&&Math.abs(g+x+y-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const O=(g+1)/2,N=(x+1)/2,G=(y+1)/2,F=(_+S)/4,z=(m+T)/4,I=(E+M)/4;return O>N&&O>G?O<.01?(r=0,l=.707106781,u=.707106781):(r=Math.sqrt(O),l=F/r,u=z/r):N>G?N<.01?(r=.707106781,l=0,u=.707106781):(l=Math.sqrt(N),r=F/l,u=I/l):G<.01?(r=.707106781,l=.707106781,u=0):(u=Math.sqrt(G),r=z/u,l=I/u),this.set(r,l,u,i),this}let U=Math.sqrt((M-E)*(M-E)+(m-T)*(m-T)+(S-_)*(S-_));return Math.abs(U)<.001&&(U=1),this.x=(M-E)/U,this.y=(m-T)/U,this.z=(S-_)/U,this.w=Math.acos((g+x+y-1)/2),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=ve(this.x,e.x,i.x),this.y=ve(this.y,e.y,i.y),this.z=ve(this.z,e.z,i.z),this.w=ve(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=ve(this.x,e,i),this.y=ve(this.y,e,i),this.z=ve(this.z,e,i),this.w=ve(this.w,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(ve(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this.w=e.w+(i.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bT extends vs{constructor(e=1,i=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=1,this.scissor=new We(0,0,e,i),this.scissorTest=!1,this.viewport=new We(0,0,e,i);const l={width:e,height:i,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ua,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const u=new oi(l,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);u.flipY=!1,u.generateMipmaps=r.generateMipmaps,u.internalFormat=r.internalFormat,this.textures=[];const d=r.count;for(let h=0;h<d;h++)this.textures[h]=u.clone(),this.textures[h].isRenderTargetTexture=!0,this.textures[h].renderTarget=this;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,i,r=1){if(this.width!==e||this.height!==i||this.depth!==r){this.width=e,this.height=i,this.depth=r;for(let l=0,u=this.textures.length;l<u;l++)this.textures[l].image.width=e,this.textures[l].image.height=i,this.textures[l].image.depth=r;this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,l=e.textures.length;r<l;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;const i=Object.assign({},e.texture.image);return this.texture.source=new WS(i),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ms extends bT{constructor(e=1,i=1,r={}){super(e,i,r),this.isWebGLRenderTarget=!0}}class qS extends oi{constructor(e=null,i=1,r=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=Wi,this.minFilter=Wi,this.wrapR=fs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class TT extends oi{constructor(e=null,i=1,r=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=Wi,this.minFilter=Wi,this.wrapR=fs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class gs{constructor(e=0,i=0,r=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=r,this._w=l}static slerpFlat(e,i,r,l,u,d,h){let p=r[l+0],g=r[l+1],_=r[l+2],m=r[l+3];const S=u[d+0],x=u[d+1],E=u[d+2],T=u[d+3];if(h===0){e[i+0]=p,e[i+1]=g,e[i+2]=_,e[i+3]=m;return}if(h===1){e[i+0]=S,e[i+1]=x,e[i+2]=E,e[i+3]=T;return}if(m!==T||p!==S||g!==x||_!==E){let M=1-h;const y=p*S+g*x+_*E+m*T,U=y>=0?1:-1,O=1-y*y;if(O>Number.EPSILON){const G=Math.sqrt(O),F=Math.atan2(G,y*U);M=Math.sin(M*F)/G,h=Math.sin(h*F)/G}const N=h*U;if(p=p*M+S*N,g=g*M+x*N,_=_*M+E*N,m=m*M+T*N,M===1-h){const G=1/Math.sqrt(p*p+g*g+_*_+m*m);p*=G,g*=G,_*=G,m*=G}}e[i]=p,e[i+1]=g,e[i+2]=_,e[i+3]=m}static multiplyQuaternionsFlat(e,i,r,l,u,d){const h=r[l],p=r[l+1],g=r[l+2],_=r[l+3],m=u[d],S=u[d+1],x=u[d+2],E=u[d+3];return e[i]=h*E+_*m+p*x-g*S,e[i+1]=p*E+_*S+g*m-h*x,e[i+2]=g*E+_*x+h*S-p*m,e[i+3]=_*E-h*m-p*S-g*x,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,r,l){return this._x=e,this._y=i,this._z=r,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const r=e._x,l=e._y,u=e._z,d=e._order,h=Math.cos,p=Math.sin,g=h(r/2),_=h(l/2),m=h(u/2),S=p(r/2),x=p(l/2),E=p(u/2);switch(d){case"XYZ":this._x=S*_*m+g*x*E,this._y=g*x*m-S*_*E,this._z=g*_*E+S*x*m,this._w=g*_*m-S*x*E;break;case"YXZ":this._x=S*_*m+g*x*E,this._y=g*x*m-S*_*E,this._z=g*_*E-S*x*m,this._w=g*_*m+S*x*E;break;case"ZXY":this._x=S*_*m-g*x*E,this._y=g*x*m+S*_*E,this._z=g*_*E+S*x*m,this._w=g*_*m-S*x*E;break;case"ZYX":this._x=S*_*m-g*x*E,this._y=g*x*m+S*_*E,this._z=g*_*E-S*x*m,this._w=g*_*m+S*x*E;break;case"YZX":this._x=S*_*m+g*x*E,this._y=g*x*m+S*_*E,this._z=g*_*E-S*x*m,this._w=g*_*m-S*x*E;break;case"XZY":this._x=S*_*m-g*x*E,this._y=g*x*m-S*_*E,this._z=g*_*E+S*x*m,this._w=g*_*m+S*x*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+d)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const r=i/2,l=Math.sin(r);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,r=i[0],l=i[4],u=i[8],d=i[1],h=i[5],p=i[9],g=i[2],_=i[6],m=i[10],S=r+h+m;if(S>0){const x=.5/Math.sqrt(S+1);this._w=.25/x,this._x=(_-p)*x,this._y=(u-g)*x,this._z=(d-l)*x}else if(r>h&&r>m){const x=2*Math.sqrt(1+r-h-m);this._w=(_-p)/x,this._x=.25*x,this._y=(l+d)/x,this._z=(u+g)/x}else if(h>m){const x=2*Math.sqrt(1+h-r-m);this._w=(u-g)/x,this._x=(l+d)/x,this._y=.25*x,this._z=(p+_)/x}else{const x=2*Math.sqrt(1+m-r-h);this._w=(d-l)/x,this._x=(u+g)/x,this._y=(p+_)/x,this._z=.25*x}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let r=e.dot(i)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ve(this.dot(e),-1,1)))}rotateTowards(e,i){const r=this.angleTo(e);if(r===0)return this;const l=Math.min(1,i/r);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const r=e._x,l=e._y,u=e._z,d=e._w,h=i._x,p=i._y,g=i._z,_=i._w;return this._x=r*_+d*h+l*g-u*p,this._y=l*_+d*p+u*h-r*g,this._z=u*_+d*g+r*p-l*h,this._w=d*_-r*h-l*p-u*g,this._onChangeCallback(),this}slerp(e,i){if(i===0)return this;if(i===1)return this.copy(e);const r=this._x,l=this._y,u=this._z,d=this._w;let h=d*e._w+r*e._x+l*e._y+u*e._z;if(h<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,h=-h):this.copy(e),h>=1)return this._w=d,this._x=r,this._y=l,this._z=u,this;const p=1-h*h;if(p<=Number.EPSILON){const x=1-i;return this._w=x*d+i*this._w,this._x=x*r+i*this._x,this._y=x*l+i*this._y,this._z=x*u+i*this._z,this.normalize(),this}const g=Math.sqrt(p),_=Math.atan2(g,h),m=Math.sin((1-i)*_)/g,S=Math.sin(i*_)/g;return this._w=d*m+this._w*S,this._x=r*m+this._x*S,this._y=l*m+this._y*S,this._z=u*m+this._z*S,this._onChangeCallback(),this}slerpQuaternions(e,i,r){return this.copy(e).slerp(i,r)}random(){const e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),r=Math.random(),l=Math.sqrt(1-r),u=Math.sqrt(r);return this.set(l*Math.sin(e),l*Math.cos(e),u*Math.sin(i),u*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Z{constructor(e=0,i=0,r=0){Z.prototype.isVector3=!0,this.x=e,this.y=i,this.z=r}set(e,i,r){return r===void 0&&(r=this.z),this.x=e,this.y=i,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(py.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(py.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[3]*r+u[6]*l,this.y=u[1]*i+u[4]*r+u[7]*l,this.z=u[2]*i+u[5]*r+u[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=e.elements,d=1/(u[3]*i+u[7]*r+u[11]*l+u[15]);return this.x=(u[0]*i+u[4]*r+u[8]*l+u[12])*d,this.y=(u[1]*i+u[5]*r+u[9]*l+u[13])*d,this.z=(u[2]*i+u[6]*r+u[10]*l+u[14])*d,this}applyQuaternion(e){const i=this.x,r=this.y,l=this.z,u=e.x,d=e.y,h=e.z,p=e.w,g=2*(d*l-h*r),_=2*(h*i-u*l),m=2*(u*r-d*i);return this.x=i+p*g+d*m-h*_,this.y=r+p*_+h*g-u*m,this.z=l+p*m+u*_-d*g,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[4]*r+u[8]*l,this.y=u[1]*i+u[5]*r+u[9]*l,this.z=u[2]*i+u[6]*r+u[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=ve(this.x,e.x,i.x),this.y=ve(this.y,e.y,i.y),this.z=ve(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=ve(this.x,e,i),this.y=ve(this.y,e,i),this.z=ve(this.z,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(ve(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const r=e.x,l=e.y,u=e.z,d=i.x,h=i.y,p=i.z;return this.x=l*p-u*h,this.y=u*d-r*p,this.z=r*h-l*d,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const r=e.dot(this)/i;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Qd.copy(this).projectOnVector(e),this.sub(Qd)}reflect(e){return this.sub(Qd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(ve(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y,l=this.z-e.z;return i*i+r*r+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,r){const l=Math.sin(i)*e;return this.x=l*Math.sin(r),this.y=Math.cos(i)*e,this.z=l*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,r){return this.x=e*Math.sin(i),this.y=r,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=r,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,i=Math.random()*2-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(e),this.y=i,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qd=new Z,py=new gs;class ja{constructor(e=new Z(1/0,1/0,1/0),i=new Z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i+=3)this.expandByPoint(ki.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,r=e.count;i<r;i++)this.expandByPoint(ki.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const r=ki.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const u=r.getAttribute("position");if(i===!0&&u!==void 0&&e.isInstancedMesh!==!0)for(let d=0,h=u.count;d<h;d++)e.isMesh===!0?e.getVertexPosition(d,ki):ki.fromBufferAttribute(u,d),ki.applyMatrix4(e.matrixWorld),this.expandByPoint(ki);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Tu.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Tu.copy(r.boundingBox)),Tu.applyMatrix4(e.matrixWorld),this.union(Tu)}const l=e.children;for(let u=0,d=l.length;u<d;u++)this.expandByObject(l[u],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ki),ki.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,r;return e.normal.x>0?(i=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),i<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pl),wu.subVectors(this.max,Pl),lo.subVectors(e.a,Pl),co.subVectors(e.b,Pl),uo.subVectors(e.c,Pl),yr.subVectors(co,lo),Sr.subVectors(uo,co),es.subVectors(lo,uo);let i=[0,-yr.z,yr.y,0,-Sr.z,Sr.y,0,-es.z,es.y,yr.z,0,-yr.x,Sr.z,0,-Sr.x,es.z,0,-es.x,-yr.y,yr.x,0,-Sr.y,Sr.x,0,-es.y,es.x,0];return!Jd(i,lo,co,uo,wu)||(i=[1,0,0,0,1,0,0,0,1],!Jd(i,lo,co,uo,wu))?!1:(Au.crossVectors(yr,Sr),i=[Au.x,Au.y,Au.z],Jd(i,lo,co,uo,wu))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ki).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ki).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Da[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Da[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Da[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Da[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Da[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Da[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Da[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Da[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Da),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Da=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],ki=new Z,Tu=new ja,lo=new Z,co=new Z,uo=new Z,yr=new Z,Sr=new Z,es=new Z,Pl=new Z,wu=new Z,Au=new Z,ns=new Z;function Jd(s,e,i,r,l){for(let u=0,d=s.length-3;u<=d;u+=3){ns.fromArray(s,u);const h=l.x*Math.abs(ns.x)+l.y*Math.abs(ns.y)+l.z*Math.abs(ns.z),p=e.dot(ns),g=i.dot(ns),_=r.dot(ns);if(Math.max(-Math.max(p,g,_),Math.min(p,g,_))>h)return!1}return!0}const wT=new ja,Bl=new Z,$d=new Z;class Fo{constructor(e=new Z,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const r=this.center;i!==void 0?r.copy(i):wT.setFromPoints(e).getCenter(r);let l=0;for(let u=0,d=e.length;u<d;u++)l=Math.max(l,r.distanceToSquared(e[u]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const r=this.center.distanceToSquared(e);return i.copy(e),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bl.subVectors(e,this.center);const i=Bl.lengthSq();if(i>this.radius*this.radius){const r=Math.sqrt(i),l=(r-this.radius)*.5;this.center.addScaledVector(Bl,l/r),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($d.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bl.copy(e.center).add($d)),this.expandByPoint(Bl.copy(e.center).sub($d))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Na=new Z,tp=new Z,Ru=new Z,xr=new Z,ep=new Z,Cu=new Z,np=new Z;class Nm{constructor(e=new Z,i=new Z(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Na)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const r=i.dot(this.direction);return r<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=Na.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(Na.copy(this.origin).addScaledVector(this.direction,i),Na.distanceToSquared(e))}distanceSqToSegment(e,i,r,l){tp.copy(e).add(i).multiplyScalar(.5),Ru.copy(i).sub(e).normalize(),xr.copy(this.origin).sub(tp);const u=e.distanceTo(i)*.5,d=-this.direction.dot(Ru),h=xr.dot(this.direction),p=-xr.dot(Ru),g=xr.lengthSq(),_=Math.abs(1-d*d);let m,S,x,E;if(_>0)if(m=d*p-h,S=d*h-p,E=u*_,m>=0)if(S>=-E)if(S<=E){const T=1/_;m*=T,S*=T,x=m*(m+d*S+2*h)+S*(d*m+S+2*p)+g}else S=u,m=Math.max(0,-(d*S+h)),x=-m*m+S*(S+2*p)+g;else S=-u,m=Math.max(0,-(d*S+h)),x=-m*m+S*(S+2*p)+g;else S<=-E?(m=Math.max(0,-(-d*u+h)),S=m>0?-u:Math.min(Math.max(-u,-p),u),x=-m*m+S*(S+2*p)+g):S<=E?(m=0,S=Math.min(Math.max(-u,-p),u),x=S*(S+2*p)+g):(m=Math.max(0,-(d*u+h)),S=m>0?u:Math.min(Math.max(-u,-p),u),x=-m*m+S*(S+2*p)+g);else S=d>0?-u:u,m=Math.max(0,-(d*S+h)),x=-m*m+S*(S+2*p)+g;return r&&r.copy(this.origin).addScaledVector(this.direction,m),l&&l.copy(tp).addScaledVector(Ru,S),x}intersectSphere(e,i){Na.subVectors(e.center,this.origin);const r=Na.dot(this.direction),l=Na.dot(Na)-r*r,u=e.radius*e.radius;if(l>u)return null;const d=Math.sqrt(u-l),h=r-d,p=r+d;return p<0?null:h<0?this.at(p,i):this.at(h,i)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/i;return r>=0?r:null}intersectPlane(e,i){const r=this.distanceToPlane(e);return r===null?null:this.at(r,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let r,l,u,d,h,p;const g=1/this.direction.x,_=1/this.direction.y,m=1/this.direction.z,S=this.origin;return g>=0?(r=(e.min.x-S.x)*g,l=(e.max.x-S.x)*g):(r=(e.max.x-S.x)*g,l=(e.min.x-S.x)*g),_>=0?(u=(e.min.y-S.y)*_,d=(e.max.y-S.y)*_):(u=(e.max.y-S.y)*_,d=(e.min.y-S.y)*_),r>d||u>l||((u>r||isNaN(r))&&(r=u),(d<l||isNaN(l))&&(l=d),m>=0?(h=(e.min.z-S.z)*m,p=(e.max.z-S.z)*m):(h=(e.max.z-S.z)*m,p=(e.min.z-S.z)*m),r>p||h>l)||((h>r||r!==r)&&(r=h),(p<l||l!==l)&&(l=p),l<0)?null:this.at(r>=0?r:l,i)}intersectsBox(e){return this.intersectBox(e,Na)!==null}intersectTriangle(e,i,r,l,u){ep.subVectors(i,e),Cu.subVectors(r,e),np.crossVectors(ep,Cu);let d=this.direction.dot(np),h;if(d>0){if(l)return null;h=1}else if(d<0)h=-1,d=-d;else return null;xr.subVectors(this.origin,e);const p=h*this.direction.dot(Cu.crossVectors(xr,Cu));if(p<0)return null;const g=h*this.direction.dot(ep.cross(xr));if(g<0||p+g>d)return null;const _=-h*xr.dot(np);return _<0?null:this.at(_/d,u)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $e{constructor(e,i,r,l,u,d,h,p,g,_,m,S,x,E,T,M){$e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,d,h,p,g,_,m,S,x,E,T,M)}set(e,i,r,l,u,d,h,p,g,_,m,S,x,E,T,M){const y=this.elements;return y[0]=e,y[4]=i,y[8]=r,y[12]=l,y[1]=u,y[5]=d,y[9]=h,y[13]=p,y[2]=g,y[6]=_,y[10]=m,y[14]=S,y[3]=x,y[7]=E,y[11]=T,y[15]=M,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $e().fromArray(this.elements)}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(e){const i=this.elements,r=e.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,r){return e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,i,r){return this.set(e.x,i.x,r.x,0,e.y,i.y,r.y,0,e.z,i.z,r.z,0,0,0,0,1),this}extractRotation(e){const i=this.elements,r=e.elements,l=1/fo.setFromMatrixColumn(e,0).length(),u=1/fo.setFromMatrixColumn(e,1).length(),d=1/fo.setFromMatrixColumn(e,2).length();return i[0]=r[0]*l,i[1]=r[1]*l,i[2]=r[2]*l,i[3]=0,i[4]=r[4]*u,i[5]=r[5]*u,i[6]=r[6]*u,i[7]=0,i[8]=r[8]*d,i[9]=r[9]*d,i[10]=r[10]*d,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,r=e.x,l=e.y,u=e.z,d=Math.cos(r),h=Math.sin(r),p=Math.cos(l),g=Math.sin(l),_=Math.cos(u),m=Math.sin(u);if(e.order==="XYZ"){const S=d*_,x=d*m,E=h*_,T=h*m;i[0]=p*_,i[4]=-p*m,i[8]=g,i[1]=x+E*g,i[5]=S-T*g,i[9]=-h*p,i[2]=T-S*g,i[6]=E+x*g,i[10]=d*p}else if(e.order==="YXZ"){const S=p*_,x=p*m,E=g*_,T=g*m;i[0]=S+T*h,i[4]=E*h-x,i[8]=d*g,i[1]=d*m,i[5]=d*_,i[9]=-h,i[2]=x*h-E,i[6]=T+S*h,i[10]=d*p}else if(e.order==="ZXY"){const S=p*_,x=p*m,E=g*_,T=g*m;i[0]=S-T*h,i[4]=-d*m,i[8]=E+x*h,i[1]=x+E*h,i[5]=d*_,i[9]=T-S*h,i[2]=-d*g,i[6]=h,i[10]=d*p}else if(e.order==="ZYX"){const S=d*_,x=d*m,E=h*_,T=h*m;i[0]=p*_,i[4]=E*g-x,i[8]=S*g+T,i[1]=p*m,i[5]=T*g+S,i[9]=x*g-E,i[2]=-g,i[6]=h*p,i[10]=d*p}else if(e.order==="YZX"){const S=d*p,x=d*g,E=h*p,T=h*g;i[0]=p*_,i[4]=T-S*m,i[8]=E*m+x,i[1]=m,i[5]=d*_,i[9]=-h*_,i[2]=-g*_,i[6]=x*m+E,i[10]=S-T*m}else if(e.order==="XZY"){const S=d*p,x=d*g,E=h*p,T=h*g;i[0]=p*_,i[4]=-m,i[8]=g*_,i[1]=S*m+T,i[5]=d*_,i[9]=x*m-E,i[2]=E*m-x,i[6]=h*_,i[10]=T*m+S}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(AT,e,RT)}lookAt(e,i,r){const l=this.elements;return _i.subVectors(e,i),_i.lengthSq()===0&&(_i.z=1),_i.normalize(),Mr.crossVectors(r,_i),Mr.lengthSq()===0&&(Math.abs(r.z)===1?_i.x+=1e-4:_i.z+=1e-4,_i.normalize(),Mr.crossVectors(r,_i)),Mr.normalize(),Du.crossVectors(_i,Mr),l[0]=Mr.x,l[4]=Du.x,l[8]=_i.x,l[1]=Mr.y,l[5]=Du.y,l[9]=_i.y,l[2]=Mr.z,l[6]=Du.z,l[10]=_i.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,d=r[0],h=r[4],p=r[8],g=r[12],_=r[1],m=r[5],S=r[9],x=r[13],E=r[2],T=r[6],M=r[10],y=r[14],U=r[3],O=r[7],N=r[11],G=r[15],F=l[0],z=l[4],I=l[8],D=l[12],A=l[1],B=l[5],it=l[9],at=l[13],ft=l[2],ct=l[6],V=l[10],st=l[14],q=l[3],St=l[7],vt=l[11],At=l[15];return u[0]=d*F+h*A+p*ft+g*q,u[4]=d*z+h*B+p*ct+g*St,u[8]=d*I+h*it+p*V+g*vt,u[12]=d*D+h*at+p*st+g*At,u[1]=_*F+m*A+S*ft+x*q,u[5]=_*z+m*B+S*ct+x*St,u[9]=_*I+m*it+S*V+x*vt,u[13]=_*D+m*at+S*st+x*At,u[2]=E*F+T*A+M*ft+y*q,u[6]=E*z+T*B+M*ct+y*St,u[10]=E*I+T*it+M*V+y*vt,u[14]=E*D+T*at+M*st+y*At,u[3]=U*F+O*A+N*ft+G*q,u[7]=U*z+O*B+N*ct+G*St,u[11]=U*I+O*it+N*V+G*vt,u[15]=U*D+O*at+N*st+G*At,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[4],l=e[8],u=e[12],d=e[1],h=e[5],p=e[9],g=e[13],_=e[2],m=e[6],S=e[10],x=e[14],E=e[3],T=e[7],M=e[11],y=e[15];return E*(+u*p*m-l*g*m-u*h*S+r*g*S+l*h*x-r*p*x)+T*(+i*p*x-i*g*S+u*d*S-l*d*x+l*g*_-u*p*_)+M*(+i*g*m-i*h*x-u*d*m+r*d*x+u*h*_-r*g*_)+y*(-l*h*_-i*p*m+i*h*S+l*d*m-r*d*S+r*p*_)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,r){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=r),this}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],d=e[4],h=e[5],p=e[6],g=e[7],_=e[8],m=e[9],S=e[10],x=e[11],E=e[12],T=e[13],M=e[14],y=e[15],U=m*M*g-T*S*g+T*p*x-h*M*x-m*p*y+h*S*y,O=E*S*g-_*M*g-E*p*x+d*M*x+_*p*y-d*S*y,N=_*T*g-E*m*g+E*h*x-d*T*x-_*h*y+d*m*y,G=E*m*p-_*T*p-E*h*S+d*T*S+_*h*M-d*m*M,F=i*U+r*O+l*N+u*G;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const z=1/F;return e[0]=U*z,e[1]=(T*S*u-m*M*u-T*l*x+r*M*x+m*l*y-r*S*y)*z,e[2]=(h*M*u-T*p*u+T*l*g-r*M*g-h*l*y+r*p*y)*z,e[3]=(m*p*u-h*S*u-m*l*g+r*S*g+h*l*x-r*p*x)*z,e[4]=O*z,e[5]=(_*M*u-E*S*u+E*l*x-i*M*x-_*l*y+i*S*y)*z,e[6]=(E*p*u-d*M*u-E*l*g+i*M*g+d*l*y-i*p*y)*z,e[7]=(d*S*u-_*p*u+_*l*g-i*S*g-d*l*x+i*p*x)*z,e[8]=N*z,e[9]=(E*m*u-_*T*u-E*r*x+i*T*x+_*r*y-i*m*y)*z,e[10]=(d*T*u-E*h*u+E*r*g-i*T*g-d*r*y+i*h*y)*z,e[11]=(_*h*u-d*m*u-_*r*g+i*m*g+d*r*x-i*h*x)*z,e[12]=G*z,e[13]=(_*T*l-E*m*l+E*r*S-i*T*S-_*r*M+i*m*M)*z,e[14]=(E*h*l-d*T*l-E*r*p+i*T*p+d*r*M-i*h*M)*z,e[15]=(d*m*l-_*h*l+_*r*p-i*m*p-d*r*S+i*h*S)*z,this}scale(e){const i=this.elements,r=e.x,l=e.y,u=e.z;return i[0]*=r,i[4]*=l,i[8]*=u,i[1]*=r,i[5]*=l,i[9]*=u,i[2]*=r,i[6]*=l,i[10]*=u,i[3]*=r,i[7]*=l,i[11]*=u,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,r,l))}makeTranslation(e,i,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const r=Math.cos(i),l=Math.sin(i),u=1-r,d=e.x,h=e.y,p=e.z,g=u*d,_=u*h;return this.set(g*d+r,g*h-l*p,g*p+l*h,0,g*h+l*p,_*h+r,_*p-l*d,0,g*p-l*h,_*p+l*d,u*p*p+r,0,0,0,0,1),this}makeScale(e,i,r){return this.set(e,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,i,r,l,u,d){return this.set(1,r,u,0,e,1,d,0,i,l,1,0,0,0,0,1),this}compose(e,i,r){const l=this.elements,u=i._x,d=i._y,h=i._z,p=i._w,g=u+u,_=d+d,m=h+h,S=u*g,x=u*_,E=u*m,T=d*_,M=d*m,y=h*m,U=p*g,O=p*_,N=p*m,G=r.x,F=r.y,z=r.z;return l[0]=(1-(T+y))*G,l[1]=(x+N)*G,l[2]=(E-O)*G,l[3]=0,l[4]=(x-N)*F,l[5]=(1-(S+y))*F,l[6]=(M+U)*F,l[7]=0,l[8]=(E+O)*z,l[9]=(M-U)*z,l[10]=(1-(S+T))*z,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,r){const l=this.elements;let u=fo.set(l[0],l[1],l[2]).length();const d=fo.set(l[4],l[5],l[6]).length(),h=fo.set(l[8],l[9],l[10]).length();this.determinant()<0&&(u=-u),e.x=l[12],e.y=l[13],e.z=l[14],Gi.copy(this);const g=1/u,_=1/d,m=1/h;return Gi.elements[0]*=g,Gi.elements[1]*=g,Gi.elements[2]*=g,Gi.elements[4]*=_,Gi.elements[5]*=_,Gi.elements[6]*=_,Gi.elements[8]*=m,Gi.elements[9]*=m,Gi.elements[10]*=m,i.setFromRotationMatrix(Gi),r.x=u,r.y=d,r.z=h,this}makePerspective(e,i,r,l,u,d,h=Fa){const p=this.elements,g=2*u/(i-e),_=2*u/(r-l),m=(i+e)/(i-e),S=(r+l)/(r-l);let x,E;if(h===Fa)x=-(d+u)/(d-u),E=-2*d*u/(d-u);else if(h===sf)x=-d/(d-u),E=-d*u/(d-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+h);return p[0]=g,p[4]=0,p[8]=m,p[12]=0,p[1]=0,p[5]=_,p[9]=S,p[13]=0,p[2]=0,p[6]=0,p[10]=x,p[14]=E,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(e,i,r,l,u,d,h=Fa){const p=this.elements,g=1/(i-e),_=1/(r-l),m=1/(d-u),S=(i+e)*g,x=(r+l)*_;let E,T;if(h===Fa)E=(d+u)*m,T=-2*m;else if(h===sf)E=u*m,T=-1*m;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+h);return p[0]=2*g,p[4]=0,p[8]=0,p[12]=-S,p[1]=0,p[5]=2*_,p[9]=0,p[13]=-x,p[2]=0,p[6]=0,p[10]=T,p[14]=-E,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<16;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<16;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e[i+9]=r[9],e[i+10]=r[10],e[i+11]=r[11],e[i+12]=r[12],e[i+13]=r[13],e[i+14]=r[14],e[i+15]=r[15],e}}const fo=new Z,Gi=new $e,AT=new Z(0,0,0),RT=new Z(1,1,1),Mr=new Z,Du=new Z,_i=new Z,my=new $e,gy=new gs;class fa{constructor(e=0,i=0,r=0,l=fa.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=r,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,r,l=this._order){return this._x=e,this._y=i,this._z=r,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,r=!0){const l=e.elements,u=l[0],d=l[4],h=l[8],p=l[1],g=l[5],_=l[9],m=l[2],S=l[6],x=l[10];switch(i){case"XYZ":this._y=Math.asin(ve(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-_,x),this._z=Math.atan2(-d,u)):(this._x=Math.atan2(S,g),this._z=0);break;case"YXZ":this._x=Math.asin(-ve(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(h,x),this._z=Math.atan2(p,g)):(this._y=Math.atan2(-m,u),this._z=0);break;case"ZXY":this._x=Math.asin(ve(S,-1,1)),Math.abs(S)<.9999999?(this._y=Math.atan2(-m,x),this._z=Math.atan2(-d,g)):(this._y=0,this._z=Math.atan2(p,u));break;case"ZYX":this._y=Math.asin(-ve(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(S,x),this._z=Math.atan2(p,u)):(this._x=0,this._z=Math.atan2(-d,g));break;case"YZX":this._z=Math.asin(ve(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-_,g),this._y=Math.atan2(-m,u)):(this._x=0,this._y=Math.atan2(h,x));break;case"XZY":this._z=Math.asin(-ve(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(S,g),this._y=Math.atan2(h,u)):(this._x=Math.atan2(-_,x),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,r){return my.makeRotationFromQuaternion(e),this.setFromRotationMatrix(my,i,r)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return gy.setFromEuler(this),this.setFromQuaternion(gy,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}fa.DEFAULT_ORDER="XYZ";class ZS{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let CT=0;const _y=new Z,ho=new gs,Ua=new $e,Nu=new Z,Il=new Z,DT=new Z,NT=new gs,vy=new Z(1,0,0),yy=new Z(0,1,0),Sy=new Z(0,0,1),xy={type:"added"},UT={type:"removed"},po={type:"childadded",child:null},ip={type:"childremoved",child:null};class kn extends vs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:CT++}),this.uuid=Ha(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=kn.DEFAULT_UP.clone();const e=new Z,i=new fa,r=new gs,l=new Z(1,1,1);function u(){r.setFromEuler(i,!1)}function d(){i.setFromQuaternion(r,void 0,!1)}i._onChange(u),r._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new $e},normalMatrix:{value:new me}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=kn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=kn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ZS,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return ho.setFromAxisAngle(e,i),this.quaternion.multiply(ho),this}rotateOnWorldAxis(e,i){return ho.setFromAxisAngle(e,i),this.quaternion.premultiply(ho),this}rotateX(e){return this.rotateOnAxis(vy,e)}rotateY(e){return this.rotateOnAxis(yy,e)}rotateZ(e){return this.rotateOnAxis(Sy,e)}translateOnAxis(e,i){return _y.copy(e).applyQuaternion(this.quaternion),this.position.add(_y.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(vy,e)}translateY(e){return this.translateOnAxis(yy,e)}translateZ(e){return this.translateOnAxis(Sy,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ua.copy(this.matrixWorld).invert())}lookAt(e,i,r){e.isVector3?Nu.copy(e):Nu.set(e,i,r);const l=this.parent;this.updateWorldMatrix(!0,!1),Il.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ua.lookAt(Il,Nu,this.up):Ua.lookAt(Nu,Il,this.up),this.quaternion.setFromRotationMatrix(Ua),l&&(Ua.extractRotation(l.matrixWorld),ho.setFromRotationMatrix(Ua),this.quaternion.premultiply(ho.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(xy),po.child=e,this.dispatchEvent(po),po.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(UT),ip.child=e,this.dispatchEvent(ip),ip.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ua.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ua.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ua),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(xy),po.child=e,this.dispatchEvent(po),po.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let r=0,l=this.children.length;r<l;r++){const d=this.children[r].getObjectByProperty(e,i);if(d!==void 0)return d}}getObjectsByProperty(e,i,r=[]){this[e]===i&&r.push(this);const l=this.children;for(let u=0,d=l.length;u<d;u++)l[u].getObjectsByProperty(e,i,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Il,e,DT),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Il,NT,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].updateMatrixWorld(e)}updateWorldMatrix(e,i){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let u=0,d=l.length;u<d;u++)l[u].updateWorldMatrix(!1,!0)}}toJSON(e){const i=e===void 0||typeof e=="string",r={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.visibility=this._visibility,l.active=this._active,l.bounds=this._bounds.map(h=>({boxInitialized:h.boxInitialized,boxMin:h.box.min.toArray(),boxMax:h.box.max.toArray(),sphereInitialized:h.sphereInitialized,sphereRadius:h.sphere.radius,sphereCenter:h.sphere.center.toArray()})),l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.geometryCount=this._geometryCount,l.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(l.boundingSphere={center:l.boundingSphere.center.toArray(),radius:l.boundingSphere.radius}),this.boundingBox!==null&&(l.boundingBox={min:l.boundingBox.min.toArray(),max:l.boundingBox.max.toArray()}));function u(h,p){return h[p.uuid]===void 0&&(h[p.uuid]=p.toJSON(e)),p.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=u(e.geometries,this.geometry);const h=this.geometry.parameters;if(h!==void 0&&h.shapes!==void 0){const p=h.shapes;if(Array.isArray(p))for(let g=0,_=p.length;g<_;g++){const m=p[g];u(e.shapes,m)}else u(e.shapes,p)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const h=[];for(let p=0,g=this.material.length;p<g;p++)h.push(u(e.materials,this.material[p]));l.material=h}else l.material=u(e.materials,this.material);if(this.children.length>0){l.children=[];for(let h=0;h<this.children.length;h++)l.children.push(this.children[h].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let h=0;h<this.animations.length;h++){const p=this.animations[h];l.animations.push(u(e.animations,p))}}if(i){const h=d(e.geometries),p=d(e.materials),g=d(e.textures),_=d(e.images),m=d(e.shapes),S=d(e.skeletons),x=d(e.animations),E=d(e.nodes);h.length>0&&(r.geometries=h),p.length>0&&(r.materials=p),g.length>0&&(r.textures=g),_.length>0&&(r.images=_),m.length>0&&(r.shapes=m),S.length>0&&(r.skeletons=S),x.length>0&&(r.animations=x),E.length>0&&(r.nodes=E)}return r.object=l,r;function d(h){const p=[];for(const g in h){const _=h[g];delete _.metadata,p.push(_)}return p}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let r=0;r<e.children.length;r++){const l=e.children[r];this.add(l.clone())}return this}}kn.DEFAULT_UP=new Z(0,1,0);kn.DEFAULT_MATRIX_AUTO_UPDATE=!0;kn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Vi=new Z,za=new Z,ap=new Z,La=new Z,mo=new Z,go=new Z,My=new Z,rp=new Z,sp=new Z,op=new Z,lp=new We,cp=new We,up=new We;class Xi{constructor(e=new Z,i=new Z,r=new Z){this.a=e,this.b=i,this.c=r}static getNormal(e,i,r,l){l.subVectors(r,i),Vi.subVectors(e,i),l.cross(Vi);const u=l.lengthSq();return u>0?l.multiplyScalar(1/Math.sqrt(u)):l.set(0,0,0)}static getBarycoord(e,i,r,l,u){Vi.subVectors(l,i),za.subVectors(r,i),ap.subVectors(e,i);const d=Vi.dot(Vi),h=Vi.dot(za),p=Vi.dot(ap),g=za.dot(za),_=za.dot(ap),m=d*g-h*h;if(m===0)return u.set(0,0,0),null;const S=1/m,x=(g*p-h*_)*S,E=(d*_-h*p)*S;return u.set(1-x-E,E,x)}static containsPoint(e,i,r,l){return this.getBarycoord(e,i,r,l,La)===null?!1:La.x>=0&&La.y>=0&&La.x+La.y<=1}static getInterpolation(e,i,r,l,u,d,h,p){return this.getBarycoord(e,i,r,l,La)===null?(p.x=0,p.y=0,"z"in p&&(p.z=0),"w"in p&&(p.w=0),null):(p.setScalar(0),p.addScaledVector(u,La.x),p.addScaledVector(d,La.y),p.addScaledVector(h,La.z),p)}static getInterpolatedAttribute(e,i,r,l,u,d){return lp.setScalar(0),cp.setScalar(0),up.setScalar(0),lp.fromBufferAttribute(e,i),cp.fromBufferAttribute(e,r),up.fromBufferAttribute(e,l),d.setScalar(0),d.addScaledVector(lp,u.x),d.addScaledVector(cp,u.y),d.addScaledVector(up,u.z),d}static isFrontFacing(e,i,r,l){return Vi.subVectors(r,i),za.subVectors(e,i),Vi.cross(za).dot(l)<0}set(e,i,r){return this.a.copy(e),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(e,i,r,l){return this.a.copy(e[i]),this.b.copy(e[r]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,r,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vi.subVectors(this.c,this.b),za.subVectors(this.a,this.b),Vi.cross(za).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Xi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return Xi.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,r,l,u){return Xi.getInterpolation(e,this.a,this.b,this.c,i,r,l,u)}containsPoint(e){return Xi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Xi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const r=this.a,l=this.b,u=this.c;let d,h;mo.subVectors(l,r),go.subVectors(u,r),rp.subVectors(e,r);const p=mo.dot(rp),g=go.dot(rp);if(p<=0&&g<=0)return i.copy(r);sp.subVectors(e,l);const _=mo.dot(sp),m=go.dot(sp);if(_>=0&&m<=_)return i.copy(l);const S=p*m-_*g;if(S<=0&&p>=0&&_<=0)return d=p/(p-_),i.copy(r).addScaledVector(mo,d);op.subVectors(e,u);const x=mo.dot(op),E=go.dot(op);if(E>=0&&x<=E)return i.copy(u);const T=x*g-p*E;if(T<=0&&g>=0&&E<=0)return h=g/(g-E),i.copy(r).addScaledVector(go,h);const M=_*E-x*m;if(M<=0&&m-_>=0&&x-E>=0)return My.subVectors(u,l),h=(m-_)/(m-_+(x-E)),i.copy(l).addScaledVector(My,h);const y=1/(M+T+S);return d=T*y,h=S*y,i.copy(r).addScaledVector(mo,d).addScaledVector(go,h)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const KS={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Er={h:0,s:0,l:0},Uu={h:0,s:0,l:0};function fp(s,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?s+(e-s)*6*i:i<1/2?e:i<2/3?s+(e-s)*6*(2/3-i):s}class Se{constructor(e,i,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,r)}set(e,i,r){if(i===void 0&&r===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=zi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ze.toWorkingColorSpace(this,i),this}setRGB(e,i,r,l=ze.workingColorSpace){return this.r=e,this.g=i,this.b=r,ze.toWorkingColorSpace(this,l),this}setHSL(e,i,r,l=ze.workingColorSpace){if(e=Dm(e,1),i=ve(i,0,1),r=ve(r,0,1),i===0)this.r=this.g=this.b=r;else{const u=r<=.5?r*(1+i):r+i-r*i,d=2*r-u;this.r=fp(d,u,e+1/3),this.g=fp(d,u,e),this.b=fp(d,u,e-1/3)}return ze.toWorkingColorSpace(this,l),this}setStyle(e,i=zi){function r(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let u;const d=l[1],h=l[2];switch(d){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return r(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,i);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return r(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,i);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return r(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const u=l[1],d=u.length;if(d===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,i);if(d===6)return this.setHex(parseInt(u,16),i);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=zi){const r=KS[e.toLowerCase()];return r!==void 0?this.setHex(r,i):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ka(e.r),this.g=ka(e.g),this.b=ka(e.b),this}copyLinearToSRGB(e){return this.r=No(e.r),this.g=No(e.g),this.b=No(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zi){return ze.fromWorkingColorSpace(Yn.copy(this),e),Math.round(ve(Yn.r*255,0,255))*65536+Math.round(ve(Yn.g*255,0,255))*256+Math.round(ve(Yn.b*255,0,255))}getHexString(e=zi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=ze.workingColorSpace){ze.fromWorkingColorSpace(Yn.copy(this),i);const r=Yn.r,l=Yn.g,u=Yn.b,d=Math.max(r,l,u),h=Math.min(r,l,u);let p,g;const _=(h+d)/2;if(h===d)p=0,g=0;else{const m=d-h;switch(g=_<=.5?m/(d+h):m/(2-d-h),d){case r:p=(l-u)/m+(l<u?6:0);break;case l:p=(u-r)/m+2;break;case u:p=(r-l)/m+4;break}p/=6}return e.h=p,e.s=g,e.l=_,e}getRGB(e,i=ze.workingColorSpace){return ze.fromWorkingColorSpace(Yn.copy(this),i),e.r=Yn.r,e.g=Yn.g,e.b=Yn.b,e}getStyle(e=zi){ze.fromWorkingColorSpace(Yn.copy(this),e);const i=Yn.r,r=Yn.g,l=Yn.b;return e!==zi?`color(${e} ${i.toFixed(3)} ${r.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(r*255)},${Math.round(l*255)})`}offsetHSL(e,i,r){return this.getHSL(Er),this.setHSL(Er.h+e,Er.s+i,Er.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,r){return this.r=e.r+(i.r-e.r)*r,this.g=e.g+(i.g-e.g)*r,this.b=e.b+(i.b-e.b)*r,this}lerpHSL(e,i){this.getHSL(Er),e.getHSL(Uu);const r=Kl(Er.h,Uu.h,i),l=Kl(Er.s,Uu.s,i),u=Kl(Er.l,Uu.l,i);return this.setHSL(r,l,u),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,r=this.g,l=this.b,u=e.elements;return this.r=u[0]*i+u[3]*r+u[6]*l,this.g=u[1]*i+u[4]*r+u[7]*l,this.b=u[2]*i+u[5]*r+u[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yn=new Se;Se.NAMES=KS;let zT=0;class Ho extends vs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zT++}),this.uuid=Ha(),this.name="",this.type="Material",this.blending=Co,this.side=Nr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Up,this.blendDst=zp,this.blendEquation=cs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Se(0,0,0),this.blendAlpha=0,this.depthFunc=Uo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ly,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=so,this.stencilZFail=so,this.stencilZPass=so,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const r=e[i];if(r===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(r):l&&l.isVector3&&r&&r.isVector3?l.copy(r):this[i]=r}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Co&&(r.blending=this.blending),this.side!==Nr&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Up&&(r.blendSrc=this.blendSrc),this.blendDst!==zp&&(r.blendDst=this.blendDst),this.blendEquation!==cs&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Uo&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ly&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==so&&(r.stencilFail=this.stencilFail),this.stencilZFail!==so&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==so&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function l(u){const d=[];for(const h in u){const p=u[h];delete p.metadata,d.push(p)}return d}if(i){const u=l(e.textures),d=l(e.images);u.length>0&&(r.textures=u),d.length>0&&(r.images=d)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let r=null;if(i!==null){const l=i.length;r=new Array(l);for(let u=0;u!==l;++u)r[u]=i[u].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class QS extends Ho{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fa,this.combine=NS,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mn=new Z,zu=new fe;let LT=0;class qi{constructor(e,i,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:LT++}),this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=r,this.usage=_m,this.updateRanges=[],this.gpuType=Ia,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,r){e*=this.itemSize,r*=i.itemSize;for(let l=0,u=this.itemSize;l<u;l++)this.array[e+l]=i.array[r+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,r=this.count;i<r;i++)zu.fromBufferAttribute(this,i),zu.applyMatrix3(e),this.setXY(i,zu.x,zu.y);else if(this.itemSize===3)for(let i=0,r=this.count;i<r;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix3(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyMatrix4(e){for(let i=0,r=this.count;i<r;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix4(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)mn.fromBufferAttribute(this,i),mn.applyNormalMatrix(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)mn.fromBufferAttribute(this,i),mn.transformDirection(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let r=this.array[e*this.itemSize+i];return this.normalized&&(r=ji(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=Fe(r,this.array)),this.array[e*this.itemSize+i]=r,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=ji(i,this.array)),i}setX(e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=ji(i,this.array)),i}setY(e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=ji(i,this.array)),i}setZ(e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=ji(i,this.array)),i}setW(e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,r){return e*=this.itemSize,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array)),this.array[e+0]=i,this.array[e+1]=r,this}setXYZ(e,i,r,l){return e*=this.itemSize,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array),l=Fe(l,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this}setXYZW(e,i,r,l,u){return e*=this.itemSize,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array),l=Fe(l,this.array),u=Fe(u,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this.array[e+3]=u,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==_m&&(e.usage=this.usage),e}}class JS extends qi{constructor(e,i,r){super(new Uint16Array(e),i,r)}}class $S extends qi{constructor(e,i,r){super(new Uint32Array(e),i,r)}}class Sn extends qi{constructor(e,i,r){super(new Float32Array(e),i,r)}}let OT=0;const Ni=new $e,hp=new kn,_o=new Z,vi=new ja,Fl=new ja,Cn=new Z;class Si extends vs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:OT++}),this.uuid=Ha(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(YS(e)?$S:JS)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,r=0){this.groups.push({start:e,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const u=new me().getNormalMatrix(e);r.applyNormalMatrix(u),r.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ni.makeRotationFromQuaternion(e),this.applyMatrix4(Ni),this}rotateX(e){return Ni.makeRotationX(e),this.applyMatrix4(Ni),this}rotateY(e){return Ni.makeRotationY(e),this.applyMatrix4(Ni),this}rotateZ(e){return Ni.makeRotationZ(e),this.applyMatrix4(Ni),this}translate(e,i,r){return Ni.makeTranslation(e,i,r),this.applyMatrix4(Ni),this}scale(e,i,r){return Ni.makeScale(e,i,r),this.applyMatrix4(Ni),this}lookAt(e){return hp.lookAt(e),hp.updateMatrix(),this.applyMatrix4(hp.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_o).negate(),this.translate(_o.x,_o.y,_o.z),this}setFromPoints(e){const i=this.getAttribute("position");if(i===void 0){const r=[];for(let l=0,u=e.length;l<u;l++){const d=e[l];r.push(d.x,d.y,d.z||0)}this.setAttribute("position",new Sn(r,3))}else{const r=Math.min(e.length,i.count);for(let l=0;l<r;l++){const u=e[l];i.setXYZ(l,u.x,u.y,u.z||0)}e.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ja);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Z(-1/0,-1/0,-1/0),new Z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let r=0,l=i.length;r<l;r++){const u=i[r];vi.setFromBufferAttribute(u),this.morphTargetsRelative?(Cn.addVectors(this.boundingBox.min,vi.min),this.boundingBox.expandByPoint(Cn),Cn.addVectors(this.boundingBox.max,vi.max),this.boundingBox.expandByPoint(Cn)):(this.boundingBox.expandByPoint(vi.min),this.boundingBox.expandByPoint(vi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fo);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Z,1/0);return}if(e){const r=this.boundingSphere.center;if(vi.setFromBufferAttribute(e),i)for(let u=0,d=i.length;u<d;u++){const h=i[u];Fl.setFromBufferAttribute(h),this.morphTargetsRelative?(Cn.addVectors(vi.min,Fl.min),vi.expandByPoint(Cn),Cn.addVectors(vi.max,Fl.max),vi.expandByPoint(Cn)):(vi.expandByPoint(Fl.min),vi.expandByPoint(Fl.max))}vi.getCenter(r);let l=0;for(let u=0,d=e.count;u<d;u++)Cn.fromBufferAttribute(e,u),l=Math.max(l,r.distanceToSquared(Cn));if(i)for(let u=0,d=i.length;u<d;u++){const h=i[u],p=this.morphTargetsRelative;for(let g=0,_=h.count;g<_;g++)Cn.fromBufferAttribute(h,g),p&&(_o.fromBufferAttribute(e,g),Cn.add(_o)),l=Math.max(l,r.distanceToSquared(Cn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=i.position,l=i.normal,u=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qi(new Float32Array(4*r.count),4));const d=this.getAttribute("tangent"),h=[],p=[];for(let I=0;I<r.count;I++)h[I]=new Z,p[I]=new Z;const g=new Z,_=new Z,m=new Z,S=new fe,x=new fe,E=new fe,T=new Z,M=new Z;function y(I,D,A){g.fromBufferAttribute(r,I),_.fromBufferAttribute(r,D),m.fromBufferAttribute(r,A),S.fromBufferAttribute(u,I),x.fromBufferAttribute(u,D),E.fromBufferAttribute(u,A),_.sub(g),m.sub(g),x.sub(S),E.sub(S);const B=1/(x.x*E.y-E.x*x.y);isFinite(B)&&(T.copy(_).multiplyScalar(E.y).addScaledVector(m,-x.y).multiplyScalar(B),M.copy(m).multiplyScalar(x.x).addScaledVector(_,-E.x).multiplyScalar(B),h[I].add(T),h[D].add(T),h[A].add(T),p[I].add(M),p[D].add(M),p[A].add(M))}let U=this.groups;U.length===0&&(U=[{start:0,count:e.count}]);for(let I=0,D=U.length;I<D;++I){const A=U[I],B=A.start,it=A.count;for(let at=B,ft=B+it;at<ft;at+=3)y(e.getX(at+0),e.getX(at+1),e.getX(at+2))}const O=new Z,N=new Z,G=new Z,F=new Z;function z(I){G.fromBufferAttribute(l,I),F.copy(G);const D=h[I];O.copy(D),O.sub(G.multiplyScalar(G.dot(D))).normalize(),N.crossVectors(F,D);const B=N.dot(p[I])<0?-1:1;d.setXYZW(I,O.x,O.y,O.z,B)}for(let I=0,D=U.length;I<D;++I){const A=U[I],B=A.start,it=A.count;for(let at=B,ft=B+it;at<ft;at+=3)z(e.getX(at+0)),z(e.getX(at+1)),z(e.getX(at+2))}}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new qi(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let S=0,x=r.count;S<x;S++)r.setXYZ(S,0,0,0);const l=new Z,u=new Z,d=new Z,h=new Z,p=new Z,g=new Z,_=new Z,m=new Z;if(e)for(let S=0,x=e.count;S<x;S+=3){const E=e.getX(S+0),T=e.getX(S+1),M=e.getX(S+2);l.fromBufferAttribute(i,E),u.fromBufferAttribute(i,T),d.fromBufferAttribute(i,M),_.subVectors(d,u),m.subVectors(l,u),_.cross(m),h.fromBufferAttribute(r,E),p.fromBufferAttribute(r,T),g.fromBufferAttribute(r,M),h.add(_),p.add(_),g.add(_),r.setXYZ(E,h.x,h.y,h.z),r.setXYZ(T,p.x,p.y,p.z),r.setXYZ(M,g.x,g.y,g.z)}else for(let S=0,x=i.count;S<x;S+=3)l.fromBufferAttribute(i,S+0),u.fromBufferAttribute(i,S+1),d.fromBufferAttribute(i,S+2),_.subVectors(d,u),m.subVectors(l,u),_.cross(m),r.setXYZ(S+0,_.x,_.y,_.z),r.setXYZ(S+1,_.x,_.y,_.z),r.setXYZ(S+2,_.x,_.y,_.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,r=e.count;i<r;i++)Cn.fromBufferAttribute(e,i),Cn.normalize(),e.setXYZ(i,Cn.x,Cn.y,Cn.z)}toNonIndexed(){function e(h,p){const g=h.array,_=h.itemSize,m=h.normalized,S=new g.constructor(p.length*_);let x=0,E=0;for(let T=0,M=p.length;T<M;T++){h.isInterleavedBufferAttribute?x=p[T]*h.data.stride+h.offset:x=p[T]*_;for(let y=0;y<_;y++)S[E++]=g[x++]}return new qi(S,_,m)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new Si,r=this.index.array,l=this.attributes;for(const h in l){const p=l[h],g=e(p,r);i.setAttribute(h,g)}const u=this.morphAttributes;for(const h in u){const p=[],g=u[h];for(let _=0,m=g.length;_<m;_++){const S=g[_],x=e(S,r);p.push(x)}i.morphAttributes[h]=p}i.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let h=0,p=d.length;h<p;h++){const g=d[h];i.addGroup(g.start,g.count,g.materialIndex)}return i}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const p=this.parameters;for(const g in p)p[g]!==void 0&&(e[g]=p[g]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const r=this.attributes;for(const p in r){const g=r[p];e.data.attributes[p]=g.toJSON(e.data)}const l={};let u=!1;for(const p in this.morphAttributes){const g=this.morphAttributes[p],_=[];for(let m=0,S=g.length;m<S;m++){const x=g[m];_.push(x.toJSON(e.data))}_.length>0&&(l[p]=_,u=!0)}u&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(e.data.groups=JSON.parse(JSON.stringify(d)));const h=this.boundingSphere;return h!==null&&(e.data.boundingSphere={center:h.center.toArray(),radius:h.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(i));const l=e.attributes;for(const g in l){const _=l[g];this.setAttribute(g,_.clone(i))}const u=e.morphAttributes;for(const g in u){const _=[],m=u[g];for(let S=0,x=m.length;S<x;S++)_.push(m[S].clone(i));this.morphAttributes[g]=_}this.morphTargetsRelative=e.morphTargetsRelative;const d=e.groups;for(let g=0,_=d.length;g<_;g++){const m=d[g];this.addGroup(m.start,m.count,m.materialIndex)}const h=e.boundingBox;h!==null&&(this.boundingBox=h.clone());const p=e.boundingSphere;return p!==null&&(this.boundingSphere=p.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ey=new $e,is=new Nm,Lu=new Fo,by=new Z,Ou=new Z,Pu=new Z,Bu=new Z,dp=new Z,Iu=new Z,Ty=new Z,Fu=new Z;class yi extends kn{constructor(e=new Si,i=new QS){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}getVertexPosition(e,i){const r=this.geometry,l=r.attributes.position,u=r.morphAttributes.position,d=r.morphTargetsRelative;i.fromBufferAttribute(l,e);const h=this.morphTargetInfluences;if(u&&h){Iu.set(0,0,0);for(let p=0,g=u.length;p<g;p++){const _=h[p],m=u[p];_!==0&&(dp.fromBufferAttribute(m,e),d?Iu.addScaledVector(dp,_):Iu.addScaledVector(dp.sub(i),_))}i.add(Iu)}return i}raycast(e,i){const r=this.geometry,l=this.material,u=this.matrixWorld;l!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Lu.copy(r.boundingSphere),Lu.applyMatrix4(u),is.copy(e.ray).recast(e.near),!(Lu.containsPoint(is.origin)===!1&&(is.intersectSphere(Lu,by)===null||is.origin.distanceToSquared(by)>(e.far-e.near)**2))&&(Ey.copy(u).invert(),is.copy(e.ray).applyMatrix4(Ey),!(r.boundingBox!==null&&is.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,i,is)))}_computeIntersections(e,i,r){let l;const u=this.geometry,d=this.material,h=u.index,p=u.attributes.position,g=u.attributes.uv,_=u.attributes.uv1,m=u.attributes.normal,S=u.groups,x=u.drawRange;if(h!==null)if(Array.isArray(d))for(let E=0,T=S.length;E<T;E++){const M=S[E],y=d[M.materialIndex],U=Math.max(M.start,x.start),O=Math.min(h.count,Math.min(M.start+M.count,x.start+x.count));for(let N=U,G=O;N<G;N+=3){const F=h.getX(N),z=h.getX(N+1),I=h.getX(N+2);l=Hu(this,y,e,r,g,_,m,F,z,I),l&&(l.faceIndex=Math.floor(N/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const E=Math.max(0,x.start),T=Math.min(h.count,x.start+x.count);for(let M=E,y=T;M<y;M+=3){const U=h.getX(M),O=h.getX(M+1),N=h.getX(M+2);l=Hu(this,d,e,r,g,_,m,U,O,N),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}else if(p!==void 0)if(Array.isArray(d))for(let E=0,T=S.length;E<T;E++){const M=S[E],y=d[M.materialIndex],U=Math.max(M.start,x.start),O=Math.min(p.count,Math.min(M.start+M.count,x.start+x.count));for(let N=U,G=O;N<G;N+=3){const F=N,z=N+1,I=N+2;l=Hu(this,y,e,r,g,_,m,F,z,I),l&&(l.faceIndex=Math.floor(N/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const E=Math.max(0,x.start),T=Math.min(p.count,x.start+x.count);for(let M=E,y=T;M<y;M+=3){const U=M,O=M+1,N=M+2;l=Hu(this,d,e,r,g,_,m,U,O,N),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}}}function PT(s,e,i,r,l,u,d,h){let p;if(e.side===si?p=r.intersectTriangle(d,u,l,!0,h):p=r.intersectTriangle(l,u,d,e.side===Nr,h),p===null)return null;Fu.copy(h),Fu.applyMatrix4(s.matrixWorld);const g=i.ray.origin.distanceTo(Fu);return g<i.near||g>i.far?null:{distance:g,point:Fu.clone(),object:s}}function Hu(s,e,i,r,l,u,d,h,p,g){s.getVertexPosition(h,Ou),s.getVertexPosition(p,Pu),s.getVertexPosition(g,Bu);const _=PT(s,e,i,r,Ou,Pu,Bu,Ty);if(_){const m=new Z;Xi.getBarycoord(Ty,Ou,Pu,Bu,m),l&&(_.uv=Xi.getInterpolatedAttribute(l,h,p,g,m,new fe)),u&&(_.uv1=Xi.getInterpolatedAttribute(u,h,p,g,m,new fe)),d&&(_.normal=Xi.getInterpolatedAttribute(d,h,p,g,m,new Z),_.normal.dot(r.direction)>0&&_.normal.multiplyScalar(-1));const S={a:h,b:p,c:g,normal:new Z,materialIndex:0};Xi.getNormal(Ou,Pu,Bu,S.normal),_.face=S,_.barycoord=m}return _}class _s extends Si{constructor(e=1,i=1,r=1,l=1,u=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:r,widthSegments:l,heightSegments:u,depthSegments:d};const h=this;l=Math.floor(l),u=Math.floor(u),d=Math.floor(d);const p=[],g=[],_=[],m=[];let S=0,x=0;E("z","y","x",-1,-1,r,i,e,d,u,0),E("z","y","x",1,-1,r,i,-e,d,u,1),E("x","z","y",1,1,e,r,i,l,d,2),E("x","z","y",1,-1,e,r,-i,l,d,3),E("x","y","z",1,-1,e,i,r,l,u,4),E("x","y","z",-1,-1,e,i,-r,l,u,5),this.setIndex(p),this.setAttribute("position",new Sn(g,3)),this.setAttribute("normal",new Sn(_,3)),this.setAttribute("uv",new Sn(m,2));function E(T,M,y,U,O,N,G,F,z,I,D){const A=N/z,B=G/I,it=N/2,at=G/2,ft=F/2,ct=z+1,V=I+1;let st=0,q=0;const St=new Z;for(let vt=0;vt<V;vt++){const At=vt*B-at;for(let Yt=0;Yt<ct;Yt++){const ie=Yt*A-it;St[T]=ie*U,St[M]=At*O,St[y]=ft,g.push(St.x,St.y,St.z),St[T]=0,St[M]=0,St[y]=F>0?1:-1,_.push(St.x,St.y,St.z),m.push(Yt/z),m.push(1-vt/I),st+=1}}for(let vt=0;vt<I;vt++)for(let At=0;At<z;At++){const Yt=S+At+ct*vt,ie=S+At+ct*(vt+1),R=S+(At+1)+ct*(vt+1),Y=S+(At+1)+ct*vt;p.push(Yt,ie,Y),p.push(ie,R,Y),q+=6}h.addGroup(x,q,D),x+=q,S+=st}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Io(s){const e={};for(const i in s){e[i]={};for(const r in s[i]){const l=s[i][r];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][r]=null):e[i][r]=l.clone():Array.isArray(l)?e[i][r]=l.slice():e[i][r]=l}}return e}function Jn(s){const e={};for(let i=0;i<s.length;i++){const r=Io(s[i]);for(const l in r)e[l]=r[l]}return e}function BT(s){const e=[];for(let i=0;i<s.length;i++)e.push(s[i].clone());return e}function tx(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ze.workingColorSpace}const Um={clone:Io,merge:Jn};var IT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,FT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Va extends Ho{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=IT,this.fragmentShader=FT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Io(e.uniforms),this.uniformsGroups=BT(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const d=this.uniforms[l].value;d&&d.isTexture?i.uniforms[l]={type:"t",value:d.toJSON(e).uuid}:d&&d.isColor?i.uniforms[l]={type:"c",value:d.getHex()}:d&&d.isVector2?i.uniforms[l]={type:"v2",value:d.toArray()}:d&&d.isVector3?i.uniforms[l]={type:"v3",value:d.toArray()}:d&&d.isVector4?i.uniforms[l]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?i.uniforms[l]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?i.uniforms[l]={type:"m4",value:d.toArray()}:i.uniforms[l]={value:d}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const r={};for(const l in this.extensions)this.extensions[l]===!0&&(r[l]=!0);return Object.keys(r).length>0&&(i.extensions=r),i}}class ex extends kn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=Fa}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const br=new Z,wy=new fe,Ay=new fe;class Li extends ex{constructor(e=50,i=1,r=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=$l*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return $l*2*Math.atan(Math.tan(Zl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,r){br.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(br.x,br.y).multiplyScalar(-e/br.z),br.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(br.x,br.y).multiplyScalar(-e/br.z)}getViewSize(e,i){return this.getViewBounds(e,wy,Ay),i.subVectors(Ay,wy)}setViewOffset(e,i,r,l,u,d){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(Zl*.5*this.fov)/this.zoom,r=2*i,l=this.aspect*r,u=-.5*l;const d=this.view;if(this.view!==null&&this.view.enabled){const p=d.fullWidth,g=d.fullHeight;u+=d.offsetX*l/p,i-=d.offsetY*r/g,l*=d.width/p,r*=d.height/g}const h=this.filmOffset;h!==0&&(u+=e*h/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+l,i,i-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const vo=-90,yo=1;class HT extends kn{constructor(e,i,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Li(vo,yo,e,i);l.layers=this.layers,this.add(l);const u=new Li(vo,yo,e,i);u.layers=this.layers,this.add(u);const d=new Li(vo,yo,e,i);d.layers=this.layers,this.add(d);const h=new Li(vo,yo,e,i);h.layers=this.layers,this.add(h);const p=new Li(vo,yo,e,i);p.layers=this.layers,this.add(p);const g=new Li(vo,yo,e,i);g.layers=this.layers,this.add(g)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[r,l,u,d,h,p]=i;for(const g of i)this.remove(g);if(e===Fa)r.up.set(0,1,0),r.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),h.up.set(0,1,0),h.lookAt(0,0,1),p.up.set(0,1,0),p.lookAt(0,0,-1);else if(e===sf)r.up.set(0,-1,0),r.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),h.up.set(0,-1,0),h.lookAt(0,0,1),p.up.set(0,-1,0),p.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const g of i)this.add(g),g.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[u,d,h,p,g,_]=this.children,m=e.getRenderTarget(),S=e.getActiveCubeFace(),x=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const T=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,l),e.render(i,u),e.setRenderTarget(r,1,l),e.render(i,d),e.setRenderTarget(r,2,l),e.render(i,h),e.setRenderTarget(r,3,l),e.render(i,p),e.setRenderTarget(r,4,l),e.render(i,g),r.texture.generateMipmaps=T,e.setRenderTarget(r,5,l),e.render(i,_),e.setRenderTarget(m,S,x),e.xr.enabled=E,r.texture.needsPMREMUpdate=!0}}class nx extends oi{constructor(e,i,r,l,u,d,h,p,g,_){e=e!==void 0?e:[],i=i!==void 0?i:zo,super(e,i,r,l,u,d,h,p,g,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class kT extends ms{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},l=[r,r,r,r,r,r];this.texture=new nx(l,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:ua}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},l=new _s(5,5,5),u=new Va({name:"CubemapFromEquirect",uniforms:Io(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:si,blending:Cr});u.uniforms.tEquirect.value=i;const d=new yi(l,u),h=i.minFilter;return i.minFilter===hs&&(i.minFilter=ua),new HT(1,10,this).update(e,d),i.minFilter=h,d.geometry.dispose(),d.material.dispose(),this}clear(e,i,r,l){const u=e.getRenderTarget();for(let d=0;d<6;d++)e.setRenderTarget(this,d),e.clear(i,r,l);e.setRenderTarget(u)}}class To extends kn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const GT={type:"move"};class pp{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new To,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new To,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new To,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Z),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const r of e.hand.values())this._getHandJoint(i,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,r){let l=null,u=null,d=null;const h=this._targetRay,p=this._grip,g=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(g&&e.hand){d=!0;for(const T of e.hand.values()){const M=i.getJointPose(T,r),y=this._getHandJoint(g,T);M!==null&&(y.matrix.fromArray(M.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=M.radius),y.visible=M!==null}const _=g.joints["index-finger-tip"],m=g.joints["thumb-tip"],S=_.position.distanceTo(m.position),x=.02,E=.005;g.inputState.pinching&&S>x+E?(g.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!g.inputState.pinching&&S<=x-E&&(g.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else p!==null&&e.gripSpace&&(u=i.getPose(e.gripSpace,r),u!==null&&(p.matrix.fromArray(u.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,u.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(u.linearVelocity)):p.hasLinearVelocity=!1,u.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(u.angularVelocity)):p.hasAngularVelocity=!1));h!==null&&(l=i.getPose(e.targetRaySpace,r),l===null&&u!==null&&(l=u),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1,this.dispatchEvent(GT)))}return h!==null&&(h.visible=l!==null),p!==null&&(p.visible=u!==null),g!==null&&(g.visible=d!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const r=new To;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[i.jointName]=r,e.add(r)}return e.joints[i.jointName]}}class VT extends kn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fa,this.environmentIntensity=1,this.environmentRotation=new fa,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}class jT{constructor(e,i){this.isInterleavedBuffer=!0,this.array=e,this.stride=i,this.count=e!==void 0?e.length/i:0,this.usage=_m,this.updateRanges=[],this.version=0,this.uuid=Ha()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,i,r){e*=this.stride,r*=i.stride;for(let l=0,u=this.stride;l<u;l++)this.array[e+l]=i.array[r+l];return this}set(e,i=0){return this.array.set(e,i),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ha()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const i=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),r=new this.constructor(i,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ha()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Qn=new Z;class Rr{constructor(e,i,r,l=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=i,this.offset=r,this.normalized=l}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let i=0,r=this.data.count;i<r;i++)Qn.fromBufferAttribute(this,i),Qn.applyMatrix4(e),this.setXYZ(i,Qn.x,Qn.y,Qn.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)Qn.fromBufferAttribute(this,i),Qn.applyNormalMatrix(e),this.setXYZ(i,Qn.x,Qn.y,Qn.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)Qn.fromBufferAttribute(this,i),Qn.transformDirection(e),this.setXYZ(i,Qn.x,Qn.y,Qn.z);return this}getComponent(e,i){let r=this.array[e*this.data.stride+this.offset+i];return this.normalized&&(r=ji(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=Fe(r,this.array)),this.data.array[e*this.data.stride+this.offset+i]=r,this}setX(e,i){return this.normalized&&(i=Fe(i,this.array)),this.data.array[e*this.data.stride+this.offset]=i,this}setY(e,i){return this.normalized&&(i=Fe(i,this.array)),this.data.array[e*this.data.stride+this.offset+1]=i,this}setZ(e,i){return this.normalized&&(i=Fe(i,this.array)),this.data.array[e*this.data.stride+this.offset+2]=i,this}setW(e,i){return this.normalized&&(i=Fe(i,this.array)),this.data.array[e*this.data.stride+this.offset+3]=i,this}getX(e){let i=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(i=ji(i,this.array)),i}getY(e){let i=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(i=ji(i,this.array)),i}getZ(e){let i=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(i=ji(i,this.array)),i}getW(e){let i=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(i=ji(i,this.array)),i}setXY(e,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array)),this.data.array[e+0]=i,this.data.array[e+1]=r,this}setXYZ(e,i,r,l){return e=e*this.data.stride+this.offset,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array),l=Fe(l,this.array)),this.data.array[e+0]=i,this.data.array[e+1]=r,this.data.array[e+2]=l,this}setXYZW(e,i,r,l,u){return e=e*this.data.stride+this.offset,this.normalized&&(i=Fe(i,this.array),r=Fe(r,this.array),l=Fe(l,this.array),u=Fe(u,this.array)),this.data.array[e+0]=i,this.data.array[e+1]=r,this.data.array[e+2]=l,this.data.array[e+3]=u,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const i=[];for(let r=0;r<this.count;r++){const l=r*this.data.stride+this.offset;for(let u=0;u<this.itemSize;u++)i.push(this.data.array[l+u])}return new qi(new this.array.constructor(i),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Rr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const i=[];for(let r=0;r<this.count;r++){const l=r*this.data.stride+this.offset;for(let u=0;u<this.itemSize;u++)i.push(this.data.array[l+u])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:i,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const mp=new Z,XT=new Z,YT=new me;class wr{constructor(e=new Z(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,r,l){return this.normal.set(e,i,r),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,r){const l=mp.subVectors(r,i).cross(XT.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i){const r=e.delta(mp),l=this.normal.dot(r);if(l===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const u=-(e.start.dot(this.normal)+this.constant)/l;return u<0||u>1?null:i.copy(e.start).addScaledVector(r,u)}intersectsLine(e){const i=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return i<0&&r>0||r<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const r=i||YT.getNormalMatrix(e),l=this.coplanarPoint(mp).applyMatrix4(e),u=this.normal.applyMatrix3(r).normalize();return this.constant=-l.dot(u),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const as=new Fo,ku=new Z;class zm{constructor(e=new wr,i=new wr,r=new wr,l=new wr,u=new wr,d=new wr){this.planes=[e,i,r,l,u,d]}set(e,i,r,l,u,d){const h=this.planes;return h[0].copy(e),h[1].copy(i),h[2].copy(r),h[3].copy(l),h[4].copy(u),h[5].copy(d),this}copy(e){const i=this.planes;for(let r=0;r<6;r++)i[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,i=Fa){const r=this.planes,l=e.elements,u=l[0],d=l[1],h=l[2],p=l[3],g=l[4],_=l[5],m=l[6],S=l[7],x=l[8],E=l[9],T=l[10],M=l[11],y=l[12],U=l[13],O=l[14],N=l[15];if(r[0].setComponents(p-u,S-g,M-x,N-y).normalize(),r[1].setComponents(p+u,S+g,M+x,N+y).normalize(),r[2].setComponents(p+d,S+_,M+E,N+U).normalize(),r[3].setComponents(p-d,S-_,M-E,N-U).normalize(),r[4].setComponents(p-h,S-m,M-T,N-O).normalize(),i===Fa)r[5].setComponents(p+h,S+m,M+T,N+O).normalize();else if(i===sf)r[5].setComponents(h,m,T,O).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),as.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),as.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(as)}intersectsSprite(e){return as.center.set(0,0,0),as.radius=.7071067811865476,as.applyMatrix4(e.matrixWorld),this.intersectsSphere(as)}intersectsSphere(e){const i=this.planes,r=e.center,l=-e.radius;for(let u=0;u<6;u++)if(i[u].distanceToPoint(r)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let r=0;r<6;r++){const l=i[r];if(ku.x=l.normal.x>0?e.max.x:e.min.x,ku.y=l.normal.y>0?e.max.y:e.min.y,ku.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(ku)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let r=0;r<6;r++)if(i[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Lm extends Ho{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Se(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const lf=new Z,cf=new Z,Ry=new $e,Hl=new Nm,Gu=new Fo,gp=new Z,Cy=new Z;class WT extends kn{constructor(e=new Si,i=new Lm){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[0];for(let l=1,u=i.count;l<u;l++)lf.fromBufferAttribute(i,l-1),cf.fromBufferAttribute(i,l),r[l]=r[l-1],r[l]+=lf.distanceTo(cf);e.setAttribute("lineDistance",new Sn(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,i){const r=this.geometry,l=this.matrixWorld,u=e.params.Line.threshold,d=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),Gu.copy(r.boundingSphere),Gu.applyMatrix4(l),Gu.radius+=u,e.ray.intersectsSphere(Gu)===!1)return;Ry.copy(l).invert(),Hl.copy(e.ray).applyMatrix4(Ry);const h=u/((this.scale.x+this.scale.y+this.scale.z)/3),p=h*h,g=this.isLineSegments?2:1,_=r.index,S=r.attributes.position;if(_!==null){const x=Math.max(0,d.start),E=Math.min(_.count,d.start+d.count);for(let T=x,M=E-1;T<M;T+=g){const y=_.getX(T),U=_.getX(T+1),O=Vu(this,e,Hl,p,y,U,T);O&&i.push(O)}if(this.isLineLoop){const T=_.getX(E-1),M=_.getX(x),y=Vu(this,e,Hl,p,T,M,E-1);y&&i.push(y)}}else{const x=Math.max(0,d.start),E=Math.min(S.count,d.start+d.count);for(let T=x,M=E-1;T<M;T+=g){const y=Vu(this,e,Hl,p,T,T+1,T);y&&i.push(y)}if(this.isLineLoop){const T=Vu(this,e,Hl,p,E-1,x,E-1);T&&i.push(T)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}}function Vu(s,e,i,r,l,u,d){const h=s.geometry.attributes.position;if(lf.fromBufferAttribute(h,l),cf.fromBufferAttribute(h,u),i.distanceSqToSegment(lf,cf,gp,Cy)>r)return;gp.applyMatrix4(s.matrixWorld);const g=e.ray.origin.distanceTo(gp);if(!(g<e.near||g>e.far))return{distance:g,point:Cy.clone().applyMatrix4(s.matrixWorld),index:d,face:null,faceIndex:null,barycoord:null,object:s}}const Dy=new Z,Ny=new Z;class ix extends WT{constructor(e,i){super(e,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[];for(let l=0,u=i.count;l<u;l+=2)Dy.fromBufferAttribute(i,l),Ny.fromBufferAttribute(i,l+1),r[l]=l===0?0:r[l-1],r[l+1]=r[l]+Dy.distanceTo(Ny);e.setAttribute("lineDistance",new Sn(r,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ax extends oi{constructor(e,i,r,l,u,d,h,p,g,_=Do){if(_!==Do&&_!==Po)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&_===Do&&(r=ps),r===void 0&&_===Po&&(r=Oo),super(null,l,u,d,h,p,_,r,g),this.isDepthTexture=!0,this.image={width:e,height:i},this.magFilter=h!==void 0?h:Wi,this.minFilter=p!==void 0?p:Wi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Om extends Si{constructor(e=1,i=1,r=1,l=32,u=1,d=!1,h=0,p=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:i,height:r,radialSegments:l,heightSegments:u,openEnded:d,thetaStart:h,thetaLength:p};const g=this;l=Math.floor(l),u=Math.floor(u);const _=[],m=[],S=[],x=[];let E=0;const T=[],M=r/2;let y=0;U(),d===!1&&(e>0&&O(!0),i>0&&O(!1)),this.setIndex(_),this.setAttribute("position",new Sn(m,3)),this.setAttribute("normal",new Sn(S,3)),this.setAttribute("uv",new Sn(x,2));function U(){const N=new Z,G=new Z;let F=0;const z=(i-e)/r;for(let I=0;I<=u;I++){const D=[],A=I/u,B=A*(i-e)+e;for(let it=0;it<=l;it++){const at=it/l,ft=at*p+h,ct=Math.sin(ft),V=Math.cos(ft);G.x=B*ct,G.y=-A*r+M,G.z=B*V,m.push(G.x,G.y,G.z),N.set(ct,z,V).normalize(),S.push(N.x,N.y,N.z),x.push(at,1-A),D.push(E++)}T.push(D)}for(let I=0;I<l;I++)for(let D=0;D<u;D++){const A=T[D][I],B=T[D+1][I],it=T[D+1][I+1],at=T[D][I+1];(e>0||D!==0)&&(_.push(A,B,at),F+=3),(i>0||D!==u-1)&&(_.push(B,it,at),F+=3)}g.addGroup(y,F,0),y+=F}function O(N){const G=E,F=new fe,z=new Z;let I=0;const D=N===!0?e:i,A=N===!0?1:-1;for(let it=1;it<=l;it++)m.push(0,M*A,0),S.push(0,A,0),x.push(.5,.5),E++;const B=E;for(let it=0;it<=l;it++){const ft=it/l*p+h,ct=Math.cos(ft),V=Math.sin(ft);z.x=D*V,z.y=M*A,z.z=D*ct,m.push(z.x,z.y,z.z),S.push(0,A,0),F.x=ct*.5+.5,F.y=V*.5*A+.5,x.push(F.x,F.y),E++}for(let it=0;it<l;it++){const at=G+it,ft=B+it;N===!0?_.push(ft,ft+1,at):_.push(ft+1,ft,at),I+=3}g.addGroup(y,I,N===!0?1:2),y+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Om(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Pm extends Om{constructor(e=1,i=1,r=32,l=1,u=!1,d=0,h=Math.PI*2){super(0,e,i,r,l,u,d,h),this.type="ConeGeometry",this.parameters={radius:e,height:i,radialSegments:r,heightSegments:l,openEnded:u,thetaStart:d,thetaLength:h}}static fromJSON(e){return new Pm(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class hf extends Si{constructor(e=1,i=1,r=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:r,heightSegments:l};const u=e/2,d=i/2,h=Math.floor(r),p=Math.floor(l),g=h+1,_=p+1,m=e/h,S=i/p,x=[],E=[],T=[],M=[];for(let y=0;y<_;y++){const U=y*S-d;for(let O=0;O<g;O++){const N=O*m-u;E.push(N,-U,0),T.push(0,0,1),M.push(O/h),M.push(1-y/p)}}for(let y=0;y<p;y++)for(let U=0;U<h;U++){const O=U+g*y,N=U+g*(y+1),G=U+1+g*(y+1),F=U+1+g*y;x.push(O,N,F),x.push(N,G,F)}this.setIndex(x),this.setAttribute("position",new Sn(E,3)),this.setAttribute("normal",new Sn(T,3)),this.setAttribute("uv",new Sn(M,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hf(e.width,e.height,e.widthSegments,e.heightSegments)}}class qT extends Si{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const i=[],r=new Set,l=new Z,u=new Z;if(e.index!==null){const d=e.attributes.position,h=e.index;let p=e.groups;p.length===0&&(p=[{start:0,count:h.count,materialIndex:0}]);for(let g=0,_=p.length;g<_;++g){const m=p[g],S=m.start,x=m.count;for(let E=S,T=S+x;E<T;E+=3)for(let M=0;M<3;M++){const y=h.getX(E+M),U=h.getX(E+(M+1)%3);l.fromBufferAttribute(d,y),u.fromBufferAttribute(d,U),Uy(l,u,r)===!0&&(i.push(l.x,l.y,l.z),i.push(u.x,u.y,u.z))}}}else{const d=e.attributes.position;for(let h=0,p=d.count/3;h<p;h++)for(let g=0;g<3;g++){const _=3*h+g,m=3*h+(g+1)%3;l.fromBufferAttribute(d,_),u.fromBufferAttribute(d,m),Uy(l,u,r)===!0&&(i.push(l.x,l.y,l.z),i.push(u.x,u.y,u.z))}}this.setAttribute("position",new Sn(i,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Uy(s,e,i){const r=`${s.x},${s.y},${s.z}-${e.x},${e.y},${e.z}`,l=`${e.x},${e.y},${e.z}-${s.x},${s.y},${s.z}`;return i.has(r)===!0||i.has(l)===!0?!1:(i.add(r),i.add(l),!0)}class zy extends Ho{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Se(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=VS,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fa,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ZT extends Ho{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=j1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class KT extends Ho{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class rx extends kn{constructor(e,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Se(e),this.intensity=i}dispose(){}copy(e,i){return super.copy(e,i),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const i=super.toJSON(e);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}const _p=new $e,Ly=new Z,Oy=new Z;class QT{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.map=null,this.mapPass=null,this.matrix=new $e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zm,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new We(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const i=this.camera,r=this.matrix;Ly.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ly),Oy.setFromMatrixPosition(e.target.matrixWorld),i.lookAt(Oy),i.updateMatrixWorld(),_p.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_p),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(_p)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class sx extends ex{constructor(e=-1,i=1,r=1,l=-1,u=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=r,this.bottom=l,this.near=u,this.far=d,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,r,l,u,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let u=r-e,d=r+e,h=l+i,p=l-i;if(this.view!==null&&this.view.enabled){const g=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=g*this.view.offsetX,d=u+g*this.view.width,h-=_*this.view.offsetY,p=h-_*this.view.height}this.projectionMatrix.makeOrthographic(u,d,h,p,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class JT extends QT{constructor(){super(new sx(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $T extends rx{constructor(e,i){super(e,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(kn.DEFAULT_UP),this.updateMatrix(),this.target=new kn,this.shadow=new JT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class tw extends rx{constructor(e,i){super(e,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class ew extends Si{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class nw extends Li{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e,this.index=0}}class vm extends jT{constructor(e,i,r=1){super(e,i),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const i=super.clone(e);return i.meshPerAttribute=this.meshPerAttribute,i}toJSON(e){const i=super.toJSON(e);return i.isInstancedInterleavedBuffer=!0,i.meshPerAttribute=this.meshPerAttribute,i}}class Py{constructor(e=1,i=0,r=0){return this.radius=e,this.phi=i,this.theta=r,this}set(e,i,r){return this.radius=e,this.phi=i,this.theta=r,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ve(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,i,r){return this.radius=Math.sqrt(e*e+i*i+r*r),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,r),this.phi=Math.acos(ve(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const By=new Z,ju=new Z;class iw{constructor(e=new Z,i=new Z){this.start=e,this.end=i}set(e,i){return this.start.copy(e),this.end.copy(i),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,i){return this.delta(i).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,i){By.subVectors(e,this.start),ju.subVectors(this.end,this.start);const r=ju.dot(ju);let u=ju.dot(By)/r;return i&&(u=ve(u,0,1)),u}closestPointToPoint(e,i,r){const l=this.closestPointToPointParameter(e,i);return this.delta(r).multiplyScalar(l).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class aw extends ix{constructor(e=10,i=10,r=4473924,l=8947848){r=new Se(r),l=new Se(l);const u=i/2,d=e/i,h=e/2,p=[],g=[];for(let S=0,x=0,E=-h;S<=i;S++,E+=d){p.push(-h,0,E,h,0,E),p.push(E,0,-h,E,0,h);const T=S===u?r:l;T.toArray(g,x),x+=3,T.toArray(g,x),x+=3,T.toArray(g,x),x+=3,T.toArray(g,x),x+=3}const _=new Si;_.setAttribute("position",new Sn(p,3)),_.setAttribute("color",new Sn(g,3));const m=new Lm({vertexColors:!0,toneMapped:!1});super(_,m),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class rw extends ix{constructor(e=1){const i=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],r=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],l=new Si;l.setAttribute("position",new Sn(i,3)),l.setAttribute("color",new Sn(r,3));const u=new Lm({vertexColors:!0,toneMapped:!1});super(l,u),this.type="AxesHelper"}setColors(e,i,r){const l=new Se,u=this.geometry.attributes.color.array;return l.set(e),l.toArray(u,0),l.toArray(u,3),l.set(i),l.toArray(u,6),l.toArray(u,9),l.set(r),l.toArray(u,12),l.toArray(u,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class sw extends vs{constructor(e,i=null){super(),this.object=e,this.domElement=i,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function Iy(s,e,i,r){const l=ow(r);switch(i){case PS:return s*e;case IS:return s*e;case FS:return s*e*2;case HS:return s*e/l.components*l.byteLength;case Am:return s*e/l.components*l.byteLength;case kS:return s*e*2/l.components*l.byteLength;case Rm:return s*e*2/l.components*l.byteLength;case BS:return s*e*3/l.components*l.byteLength;case Yi:return s*e*4/l.components*l.byteLength;case Cm:return s*e*4/l.components*l.byteLength;case Ju:case $u:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case tf:case ef:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Yp:case qp:return Math.max(s,16)*Math.max(e,8)/4;case Xp:case Wp:return Math.max(s,8)*Math.max(e,8)/2;case Zp:case Kp:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Qp:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Jp:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case $p:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case tm:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case em:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case nm:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case im:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case am:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case rm:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case sm:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case om:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case lm:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case cm:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case um:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case fm:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case nf:case hm:case dm:return Math.ceil(s/4)*Math.ceil(e/4)*16;case GS:case pm:return Math.ceil(s/4)*Math.ceil(e/4)*8;case mm:case gm:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function ow(s){switch(s){case Ga:case zS:return{byteLength:1,components:1};case Jl:case LS:case tc:return{byteLength:2,components:1};case Tm:case wm:return{byteLength:2,components:4};case ps:case bm:case Ia:return{byteLength:4,components:1};case OS:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Em}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Em);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ox(){let s=null,e=!1,i=null,r=null;function l(u,d){i(u,d),r=s.requestAnimationFrame(l)}return{start:function(){e!==!0&&i!==null&&(r=s.requestAnimationFrame(l),e=!0)},stop:function(){s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(u){i=u},setContext:function(u){s=u}}}function lw(s){const e=new WeakMap;function i(h,p){const g=h.array,_=h.usage,m=g.byteLength,S=s.createBuffer();s.bindBuffer(p,S),s.bufferData(p,g,_),h.onUploadCallback();let x;if(g instanceof Float32Array)x=s.FLOAT;else if(g instanceof Uint16Array)h.isFloat16BufferAttribute?x=s.HALF_FLOAT:x=s.UNSIGNED_SHORT;else if(g instanceof Int16Array)x=s.SHORT;else if(g instanceof Uint32Array)x=s.UNSIGNED_INT;else if(g instanceof Int32Array)x=s.INT;else if(g instanceof Int8Array)x=s.BYTE;else if(g instanceof Uint8Array)x=s.UNSIGNED_BYTE;else if(g instanceof Uint8ClampedArray)x=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+g);return{buffer:S,type:x,bytesPerElement:g.BYTES_PER_ELEMENT,version:h.version,size:m}}function r(h,p,g){const _=p.array,m=p.updateRanges;if(s.bindBuffer(g,h),m.length===0)s.bufferSubData(g,0,_);else{m.sort((x,E)=>x.start-E.start);let S=0;for(let x=1;x<m.length;x++){const E=m[S],T=m[x];T.start<=E.start+E.count+1?E.count=Math.max(E.count,T.start+T.count-E.start):(++S,m[S]=T)}m.length=S+1;for(let x=0,E=m.length;x<E;x++){const T=m[x];s.bufferSubData(g,T.start*_.BYTES_PER_ELEMENT,_,T.start,T.count)}p.clearUpdateRanges()}p.onUploadCallback()}function l(h){return h.isInterleavedBufferAttribute&&(h=h.data),e.get(h)}function u(h){h.isInterleavedBufferAttribute&&(h=h.data);const p=e.get(h);p&&(s.deleteBuffer(p.buffer),e.delete(h))}function d(h,p){if(h.isInterleavedBufferAttribute&&(h=h.data),h.isGLBufferAttribute){const _=e.get(h);(!_||_.version<h.version)&&e.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}const g=e.get(h);if(g===void 0)e.set(h,i(h,p));else if(g.version<h.version){if(g.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(g.buffer,h,p),g.version=h.version}}return{get:l,remove:u,update:d}}var cw=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uw=`#ifdef USE_ALPHAHASH
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
#endif`,fw=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hw=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dw=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pw=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mw=`#ifdef USE_AOMAP
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
#endif`,gw=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_w=`#ifdef USE_BATCHING
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
#endif`,vw=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yw=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sw=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xw=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Mw=`#ifdef USE_IRIDESCENCE
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
#endif`,Ew=`#ifdef USE_BUMPMAP
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
#endif`,bw=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Tw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ww=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Aw=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rw=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cw=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Dw=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Nw=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Uw=`#define PI 3.141592653589793
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
} // validated`,zw=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Lw=`vec3 transformedNormal = objectNormal;
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
#endif`,Ow=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Pw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Iw=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fw="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hw=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kw=`#ifdef USE_ENVMAP
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
#endif`,Gw=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vw=`#ifdef USE_ENVMAP
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
#endif`,jw=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xw=`#ifdef USE_ENVMAP
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
#endif`,Yw=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ww=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Kw=`#ifdef USE_GRADIENTMAP
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
}`,Qw=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jw=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$w=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tA=`uniform bool receiveShadow;
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
#endif`,eA=`#ifdef USE_ENVMAP
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
#endif`,nA=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,iA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,aA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sA=`PhysicalMaterial material;
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
#endif`,oA=`struct PhysicalMaterial {
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
}`,lA=`
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
#endif`,cA=`#if defined( RE_IndirectDiffuse )
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
#endif`,uA=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fA=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hA=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dA=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pA=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,mA=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gA=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,_A=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vA=`#if defined( USE_POINTS_UV )
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
#endif`,yA=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,SA=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xA=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,MA=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,EA=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bA=`#ifdef USE_MORPHTARGETS
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
#endif`,TA=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wA=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,AA=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,RA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,CA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,DA=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,NA=`#ifdef USE_NORMALMAP
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
#endif`,UA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,LA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,OA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,PA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,BA=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,IA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,FA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,HA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,GA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,VA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,XA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,YA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,WA=`float getShadowMask() {
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
}`,qA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ZA=`#ifdef USE_SKINNING
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
#endif`,KA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,QA=`#ifdef USE_SKINNING
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
#endif`,JA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$A=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tR=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,eR=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,nR=`#ifdef USE_TRANSMISSION
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
#endif`,iR=`#ifdef USE_TRANSMISSION
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
#endif`,aR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,oR=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lR=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cR=`uniform sampler2D t2D;
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
}`,uR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fR=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dR=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pR=`#include <common>
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
}`,mR=`#if DEPTH_PACKING == 3200
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
}`,gR=`#define DISTANCE
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
}`,_R=`#define DISTANCE
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
}`,vR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yR=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,SR=`uniform float scale;
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
}`,xR=`uniform vec3 diffuse;
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
}`,MR=`#include <common>
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
}`,ER=`uniform vec3 diffuse;
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
}`,bR=`#define LAMBERT
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
}`,TR=`#define LAMBERT
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
}`,wR=`#define MATCAP
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
}`,AR=`#define MATCAP
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
}`,RR=`#define NORMAL
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
}`,CR=`#define NORMAL
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
}`,DR=`#define PHONG
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
}`,NR=`#define PHONG
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
}`,UR=`#define STANDARD
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
}`,zR=`#define STANDARD
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
}`,LR=`#define TOON
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
}`,OR=`#define TOON
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
}`,PR=`uniform float size;
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
}`,BR=`uniform vec3 diffuse;
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
}`,IR=`#include <common>
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
}`,FR=`uniform vec3 color;
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
}`,HR=`uniform float rotation;
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
}`,kR=`uniform vec3 diffuse;
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
}`,ge={alphahash_fragment:cw,alphahash_pars_fragment:uw,alphamap_fragment:fw,alphamap_pars_fragment:hw,alphatest_fragment:dw,alphatest_pars_fragment:pw,aomap_fragment:mw,aomap_pars_fragment:gw,batching_pars_vertex:_w,batching_vertex:vw,begin_vertex:yw,beginnormal_vertex:Sw,bsdfs:xw,iridescence_fragment:Mw,bumpmap_pars_fragment:Ew,clipping_planes_fragment:bw,clipping_planes_pars_fragment:Tw,clipping_planes_pars_vertex:ww,clipping_planes_vertex:Aw,color_fragment:Rw,color_pars_fragment:Cw,color_pars_vertex:Dw,color_vertex:Nw,common:Uw,cube_uv_reflection_fragment:zw,defaultnormal_vertex:Lw,displacementmap_pars_vertex:Ow,displacementmap_vertex:Pw,emissivemap_fragment:Bw,emissivemap_pars_fragment:Iw,colorspace_fragment:Fw,colorspace_pars_fragment:Hw,envmap_fragment:kw,envmap_common_pars_fragment:Gw,envmap_pars_fragment:Vw,envmap_pars_vertex:jw,envmap_physical_pars_fragment:eA,envmap_vertex:Xw,fog_vertex:Yw,fog_pars_vertex:Ww,fog_fragment:qw,fog_pars_fragment:Zw,gradientmap_pars_fragment:Kw,lightmap_pars_fragment:Qw,lights_lambert_fragment:Jw,lights_lambert_pars_fragment:$w,lights_pars_begin:tA,lights_toon_fragment:nA,lights_toon_pars_fragment:iA,lights_phong_fragment:aA,lights_phong_pars_fragment:rA,lights_physical_fragment:sA,lights_physical_pars_fragment:oA,lights_fragment_begin:lA,lights_fragment_maps:cA,lights_fragment_end:uA,logdepthbuf_fragment:fA,logdepthbuf_pars_fragment:hA,logdepthbuf_pars_vertex:dA,logdepthbuf_vertex:pA,map_fragment:mA,map_pars_fragment:gA,map_particle_fragment:_A,map_particle_pars_fragment:vA,metalnessmap_fragment:yA,metalnessmap_pars_fragment:SA,morphinstance_vertex:xA,morphcolor_vertex:MA,morphnormal_vertex:EA,morphtarget_pars_vertex:bA,morphtarget_vertex:TA,normal_fragment_begin:wA,normal_fragment_maps:AA,normal_pars_fragment:RA,normal_pars_vertex:CA,normal_vertex:DA,normalmap_pars_fragment:NA,clearcoat_normal_fragment_begin:UA,clearcoat_normal_fragment_maps:zA,clearcoat_pars_fragment:LA,iridescence_pars_fragment:OA,opaque_fragment:PA,packing:BA,premultiplied_alpha_fragment:IA,project_vertex:FA,dithering_fragment:HA,dithering_pars_fragment:kA,roughnessmap_fragment:GA,roughnessmap_pars_fragment:VA,shadowmap_pars_fragment:jA,shadowmap_pars_vertex:XA,shadowmap_vertex:YA,shadowmask_pars_fragment:WA,skinbase_vertex:qA,skinning_pars_vertex:ZA,skinning_vertex:KA,skinnormal_vertex:QA,specularmap_fragment:JA,specularmap_pars_fragment:$A,tonemapping_fragment:tR,tonemapping_pars_fragment:eR,transmission_fragment:nR,transmission_pars_fragment:iR,uv_pars_fragment:aR,uv_pars_vertex:rR,uv_vertex:sR,worldpos_vertex:oR,background_vert:lR,background_frag:cR,backgroundCube_vert:uR,backgroundCube_frag:fR,cube_vert:hR,cube_frag:dR,depth_vert:pR,depth_frag:mR,distanceRGBA_vert:gR,distanceRGBA_frag:_R,equirect_vert:vR,equirect_frag:yR,linedashed_vert:SR,linedashed_frag:xR,meshbasic_vert:MR,meshbasic_frag:ER,meshlambert_vert:bR,meshlambert_frag:TR,meshmatcap_vert:wR,meshmatcap_frag:AR,meshnormal_vert:RR,meshnormal_frag:CR,meshphong_vert:DR,meshphong_frag:NR,meshphysical_vert:UR,meshphysical_frag:zR,meshtoon_vert:LR,meshtoon_frag:OR,points_vert:PR,points_frag:BR,shadow_vert:IR,shadow_frag:FR,sprite_vert:HR,sprite_frag:kR},Lt={common:{diffuse:{value:new Se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new me}},envmap:{envMap:{value:null},envMapRotation:{value:new me},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new me},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0},uvTransform:{value:new me}},sprite:{diffuse:{value:new Se(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}}},ri={basic:{uniforms:Jn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.fog]),vertexShader:ge.meshbasic_vert,fragmentShader:ge.meshbasic_frag},lambert:{uniforms:Jn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new Se(0)}}]),vertexShader:ge.meshlambert_vert,fragmentShader:ge.meshlambert_frag},phong:{uniforms:Jn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new Se(0)},specular:{value:new Se(1118481)},shininess:{value:30}}]),vertexShader:ge.meshphong_vert,fragmentShader:ge.meshphong_frag},standard:{uniforms:Jn([Lt.common,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.roughnessmap,Lt.metalnessmap,Lt.fog,Lt.lights,{emissive:{value:new Se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag},toon:{uniforms:Jn([Lt.common,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.gradientmap,Lt.fog,Lt.lights,{emissive:{value:new Se(0)}}]),vertexShader:ge.meshtoon_vert,fragmentShader:ge.meshtoon_frag},matcap:{uniforms:Jn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,{matcap:{value:null}}]),vertexShader:ge.meshmatcap_vert,fragmentShader:ge.meshmatcap_frag},points:{uniforms:Jn([Lt.points,Lt.fog]),vertexShader:ge.points_vert,fragmentShader:ge.points_frag},dashed:{uniforms:Jn([Lt.common,Lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ge.linedashed_vert,fragmentShader:ge.linedashed_frag},depth:{uniforms:Jn([Lt.common,Lt.displacementmap]),vertexShader:ge.depth_vert,fragmentShader:ge.depth_frag},normal:{uniforms:Jn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,{opacity:{value:1}}]),vertexShader:ge.meshnormal_vert,fragmentShader:ge.meshnormal_frag},sprite:{uniforms:Jn([Lt.sprite,Lt.fog]),vertexShader:ge.sprite_vert,fragmentShader:ge.sprite_frag},background:{uniforms:{uvTransform:{value:new me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ge.background_vert,fragmentShader:ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new me}},vertexShader:ge.backgroundCube_vert,fragmentShader:ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ge.cube_vert,fragmentShader:ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ge.equirect_vert,fragmentShader:ge.equirect_frag},distanceRGBA:{uniforms:Jn([Lt.common,Lt.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ge.distanceRGBA_vert,fragmentShader:ge.distanceRGBA_frag},shadow:{uniforms:Jn([Lt.lights,Lt.fog,{color:{value:new Se(0)},opacity:{value:1}}]),vertexShader:ge.shadow_vert,fragmentShader:ge.shadow_frag}};ri.physical={uniforms:Jn([ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new me},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new me},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new me},sheen:{value:0},sheenColor:{value:new Se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new me},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new me},attenuationDistance:{value:0},attenuationColor:{value:new Se(0)},specularColor:{value:new Se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new me},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new me}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag};const Xu={r:0,b:0,g:0},rs=new fa,GR=new $e;function VR(s,e,i,r,l,u,d){const h=new Se(0);let p=u===!0?0:1,g,_,m=null,S=0,x=null;function E(O){let N=O.isScene===!0?O.background:null;return N&&N.isTexture&&(N=(O.backgroundBlurriness>0?i:e).get(N)),N}function T(O){let N=!1;const G=E(O);G===null?y(h,p):G&&G.isColor&&(y(G,1),N=!0);const F=s.xr.getEnvironmentBlendMode();F==="additive"?r.buffers.color.setClear(0,0,0,1,d):F==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,d),(s.autoClear||N)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function M(O,N){const G=E(N);G&&(G.isCubeTexture||G.mapping===ff)?(_===void 0&&(_=new yi(new _s(1,1,1),new Va({name:"BackgroundCubeMaterial",uniforms:Io(ri.backgroundCube.uniforms),vertexShader:ri.backgroundCube.vertexShader,fragmentShader:ri.backgroundCube.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1})),_.geometry.deleteAttribute("normal"),_.geometry.deleteAttribute("uv"),_.onBeforeRender=function(F,z,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(_.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(_)),rs.copy(N.backgroundRotation),rs.x*=-1,rs.y*=-1,rs.z*=-1,G.isCubeTexture&&G.isRenderTargetTexture===!1&&(rs.y*=-1,rs.z*=-1),_.material.uniforms.envMap.value=G,_.material.uniforms.flipEnvMap.value=G.isCubeTexture&&G.isRenderTargetTexture===!1?-1:1,_.material.uniforms.backgroundBlurriness.value=N.backgroundBlurriness,_.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,_.material.uniforms.backgroundRotation.value.setFromMatrix4(GR.makeRotationFromEuler(rs)),_.material.toneMapped=ze.getTransfer(G.colorSpace)!==Ge,(m!==G||S!==G.version||x!==s.toneMapping)&&(_.material.needsUpdate=!0,m=G,S=G.version,x=s.toneMapping),_.layers.enableAll(),O.unshift(_,_.geometry,_.material,0,0,null)):G&&G.isTexture&&(g===void 0&&(g=new yi(new hf(2,2),new Va({name:"BackgroundMaterial",uniforms:Io(ri.background.uniforms),vertexShader:ri.background.vertexShader,fragmentShader:ri.background.fragmentShader,side:Nr,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),Object.defineProperty(g.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(g)),g.material.uniforms.t2D.value=G,g.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,g.material.toneMapped=ze.getTransfer(G.colorSpace)!==Ge,G.matrixAutoUpdate===!0&&G.updateMatrix(),g.material.uniforms.uvTransform.value.copy(G.matrix),(m!==G||S!==G.version||x!==s.toneMapping)&&(g.material.needsUpdate=!0,m=G,S=G.version,x=s.toneMapping),g.layers.enableAll(),O.unshift(g,g.geometry,g.material,0,0,null))}function y(O,N){O.getRGB(Xu,tx(s)),r.buffers.color.setClear(Xu.r,Xu.g,Xu.b,N,d)}function U(){_!==void 0&&(_.geometry.dispose(),_.material.dispose(),_=void 0),g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0)}return{getClearColor:function(){return h},setClearColor:function(O,N=1){h.set(O),p=N,y(h,p)},getClearAlpha:function(){return p},setClearAlpha:function(O){p=O,y(h,p)},render:T,addToRenderList:M,dispose:U}}function jR(s,e){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},l=S(null);let u=l,d=!1;function h(A,B,it,at,ft){let ct=!1;const V=m(at,it,B);u!==V&&(u=V,g(u.object)),ct=x(A,at,it,ft),ct&&E(A,at,it,ft),ft!==null&&e.update(ft,s.ELEMENT_ARRAY_BUFFER),(ct||d)&&(d=!1,N(A,B,it,at),ft!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(ft).buffer))}function p(){return s.createVertexArray()}function g(A){return s.bindVertexArray(A)}function _(A){return s.deleteVertexArray(A)}function m(A,B,it){const at=it.wireframe===!0;let ft=r[A.id];ft===void 0&&(ft={},r[A.id]=ft);let ct=ft[B.id];ct===void 0&&(ct={},ft[B.id]=ct);let V=ct[at];return V===void 0&&(V=S(p()),ct[at]=V),V}function S(A){const B=[],it=[],at=[];for(let ft=0;ft<i;ft++)B[ft]=0,it[ft]=0,at[ft]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:it,attributeDivisors:at,object:A,attributes:{},index:null}}function x(A,B,it,at){const ft=u.attributes,ct=B.attributes;let V=0;const st=it.getAttributes();for(const q in st)if(st[q].location>=0){const vt=ft[q];let At=ct[q];if(At===void 0&&(q==="instanceMatrix"&&A.instanceMatrix&&(At=A.instanceMatrix),q==="instanceColor"&&A.instanceColor&&(At=A.instanceColor)),vt===void 0||vt.attribute!==At||At&&vt.data!==At.data)return!0;V++}return u.attributesNum!==V||u.index!==at}function E(A,B,it,at){const ft={},ct=B.attributes;let V=0;const st=it.getAttributes();for(const q in st)if(st[q].location>=0){let vt=ct[q];vt===void 0&&(q==="instanceMatrix"&&A.instanceMatrix&&(vt=A.instanceMatrix),q==="instanceColor"&&A.instanceColor&&(vt=A.instanceColor));const At={};At.attribute=vt,vt&&vt.data&&(At.data=vt.data),ft[q]=At,V++}u.attributes=ft,u.attributesNum=V,u.index=at}function T(){const A=u.newAttributes;for(let B=0,it=A.length;B<it;B++)A[B]=0}function M(A){y(A,0)}function y(A,B){const it=u.newAttributes,at=u.enabledAttributes,ft=u.attributeDivisors;it[A]=1,at[A]===0&&(s.enableVertexAttribArray(A),at[A]=1),ft[A]!==B&&(s.vertexAttribDivisor(A,B),ft[A]=B)}function U(){const A=u.newAttributes,B=u.enabledAttributes;for(let it=0,at=B.length;it<at;it++)B[it]!==A[it]&&(s.disableVertexAttribArray(it),B[it]=0)}function O(A,B,it,at,ft,ct,V){V===!0?s.vertexAttribIPointer(A,B,it,ft,ct):s.vertexAttribPointer(A,B,it,at,ft,ct)}function N(A,B,it,at){T();const ft=at.attributes,ct=it.getAttributes(),V=B.defaultAttributeValues;for(const st in ct){const q=ct[st];if(q.location>=0){let St=ft[st];if(St===void 0&&(st==="instanceMatrix"&&A.instanceMatrix&&(St=A.instanceMatrix),st==="instanceColor"&&A.instanceColor&&(St=A.instanceColor)),St!==void 0){const vt=St.normalized,At=St.itemSize,Yt=e.get(St);if(Yt===void 0)continue;const ie=Yt.buffer,R=Yt.type,Y=Yt.bytesPerElement,yt=R===s.INT||R===s.UNSIGNED_INT||St.gpuType===bm;if(St.isInterleavedBufferAttribute){const ht=St.data,Rt=ht.stride,Xt=St.offset;if(ht.isInstancedInterleavedBuffer){for(let Ut=0;Ut<q.locationSize;Ut++)y(q.location+Ut,ht.meshPerAttribute);A.isInstancedMesh!==!0&&at._maxInstanceCount===void 0&&(at._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let Ut=0;Ut<q.locationSize;Ut++)M(q.location+Ut);s.bindBuffer(s.ARRAY_BUFFER,ie);for(let Ut=0;Ut<q.locationSize;Ut++)O(q.location+Ut,At/q.locationSize,R,vt,Rt*Y,(Xt+At/q.locationSize*Ut)*Y,yt)}else{if(St.isInstancedBufferAttribute){for(let ht=0;ht<q.locationSize;ht++)y(q.location+ht,St.meshPerAttribute);A.isInstancedMesh!==!0&&at._maxInstanceCount===void 0&&(at._maxInstanceCount=St.meshPerAttribute*St.count)}else for(let ht=0;ht<q.locationSize;ht++)M(q.location+ht);s.bindBuffer(s.ARRAY_BUFFER,ie);for(let ht=0;ht<q.locationSize;ht++)O(q.location+ht,At/q.locationSize,R,vt,At*Y,At/q.locationSize*ht*Y,yt)}}else if(V!==void 0){const vt=V[st];if(vt!==void 0)switch(vt.length){case 2:s.vertexAttrib2fv(q.location,vt);break;case 3:s.vertexAttrib3fv(q.location,vt);break;case 4:s.vertexAttrib4fv(q.location,vt);break;default:s.vertexAttrib1fv(q.location,vt)}}}}U()}function G(){I();for(const A in r){const B=r[A];for(const it in B){const at=B[it];for(const ft in at)_(at[ft].object),delete at[ft];delete B[it]}delete r[A]}}function F(A){if(r[A.id]===void 0)return;const B=r[A.id];for(const it in B){const at=B[it];for(const ft in at)_(at[ft].object),delete at[ft];delete B[it]}delete r[A.id]}function z(A){for(const B in r){const it=r[B];if(it[A.id]===void 0)continue;const at=it[A.id];for(const ft in at)_(at[ft].object),delete at[ft];delete it[A.id]}}function I(){D(),d=!0,u!==l&&(u=l,g(u.object))}function D(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:I,resetDefaultState:D,dispose:G,releaseStatesOfGeometry:F,releaseStatesOfProgram:z,initAttributes:T,enableAttribute:M,disableUnusedAttributes:U}}function XR(s,e,i){let r;function l(g){r=g}function u(g,_){s.drawArrays(r,g,_),i.update(_,r,1)}function d(g,_,m){m!==0&&(s.drawArraysInstanced(r,g,_,m),i.update(_,r,m))}function h(g,_,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,g,0,_,0,m);let x=0;for(let E=0;E<m;E++)x+=_[E];i.update(x,r,1)}function p(g,_,m,S){if(m===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let E=0;E<g.length;E++)d(g[E],_[E],S[E]);else{x.multiDrawArraysInstancedWEBGL(r,g,0,_,0,S,0,m);let E=0;for(let T=0;T<m;T++)E+=_[T]*S[T];i.update(E,r,1)}}this.setMode=l,this.render=u,this.renderInstances=d,this.renderMultiDraw=h,this.renderMultiDrawInstances=p}function YR(s,e,i,r){let l;function u(){if(l!==void 0)return l;if(e.has("EXT_texture_filter_anisotropic")===!0){const z=e.get("EXT_texture_filter_anisotropic");l=s.getParameter(z.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function d(z){return!(z!==Yi&&r.convert(z)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function h(z){const I=z===tc&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(z!==Ga&&r.convert(z)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&z!==Ia&&!I)}function p(z){if(z==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";z="mediump"}return z==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let g=i.precision!==void 0?i.precision:"highp";const _=p(g);_!==g&&(console.warn("THREE.WebGLRenderer:",g,"not supported, using",_,"instead."),g=_);const m=i.logarithmicDepthBuffer===!0,S=i.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),x=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),E=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),T=s.getParameter(s.MAX_TEXTURE_SIZE),M=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),y=s.getParameter(s.MAX_VERTEX_ATTRIBS),U=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),O=s.getParameter(s.MAX_VARYING_VECTORS),N=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),G=E>0,F=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:u,getMaxPrecision:p,textureFormatReadable:d,textureTypeReadable:h,precision:g,logarithmicDepthBuffer:m,reverseDepthBuffer:S,maxTextures:x,maxVertexTextures:E,maxTextureSize:T,maxCubemapSize:M,maxAttributes:y,maxVertexUniforms:U,maxVaryings:O,maxFragmentUniforms:N,vertexTextures:G,maxSamples:F}}function WR(s){const e=this;let i=null,r=0,l=!1,u=!1;const d=new wr,h=new me,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(m,S){const x=m.length!==0||S||r!==0||l;return l=S,r=m.length,x},this.beginShadows=function(){u=!0,_(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(m,S){i=_(m,S,0)},this.setState=function(m,S,x){const E=m.clippingPlanes,T=m.clipIntersection,M=m.clipShadows,y=s.get(m);if(!l||E===null||E.length===0||u&&!M)u?_(null):g();else{const U=u?0:r,O=U*4;let N=y.clippingState||null;p.value=N,N=_(E,S,O,x);for(let G=0;G!==O;++G)N[G]=i[G];y.clippingState=N,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=U}};function g(){p.value!==i&&(p.value=i,p.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function _(m,S,x,E){const T=m!==null?m.length:0;let M=null;if(T!==0){if(M=p.value,E!==!0||M===null){const y=x+T*4,U=S.matrixWorldInverse;h.getNormalMatrix(U),(M===null||M.length<y)&&(M=new Float32Array(y));for(let O=0,N=x;O!==T;++O,N+=4)d.copy(m[O]).applyMatrix4(U,h),d.normal.toArray(M,N),M[N+3]=d.constant}p.value=M,p.needsUpdate=!0}return e.numPlanes=T,e.numIntersection=0,M}}function qR(s){let e=new WeakMap;function i(d,h){return h===kp?d.mapping=zo:h===Gp&&(d.mapping=Lo),d}function r(d){if(d&&d.isTexture){const h=d.mapping;if(h===kp||h===Gp)if(e.has(d)){const p=e.get(d).texture;return i(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const g=new kT(p.height);return g.fromEquirectangularTexture(s,d),e.set(d,g),d.addEventListener("dispose",l),i(g.texture,d.mapping)}else return null}}return d}function l(d){const h=d.target;h.removeEventListener("dispose",l);const p=e.get(h);p!==void 0&&(e.delete(h),p.dispose())}function u(){e=new WeakMap}return{get:r,dispose:u}}const wo=4,Fy=[.125,.215,.35,.446,.526,.582],us=20,vp=new sx,Hy=new Se;let yp=null,Sp=0,xp=0,Mp=!1;const ls=(1+Math.sqrt(5))/2,So=1/ls,ky=[new Z(-ls,So,0),new Z(ls,So,0),new Z(-So,0,ls),new Z(So,0,ls),new Z(0,ls,-So),new Z(0,ls,So),new Z(-1,1,-1),new Z(1,1,-1),new Z(-1,1,1),new Z(1,1,1)];class Gy{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,i=0,r=.1,l=100){yp=this._renderer.getRenderTarget(),Sp=this._renderer.getActiveCubeFace(),xp=this._renderer.getActiveMipmapLevel(),Mp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,r,l,u),i>0&&this._blur(u,0,0,i),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xy(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jy(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(yp,Sp,xp),this._renderer.xr.enabled=Mp,e.scissorTest=!1,Yu(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===zo||e.mapping===Lo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),yp=this._renderer.getRenderTarget(),Sp=this._renderer.getActiveCubeFace(),xp=this._renderer.getActiveMipmapLevel(),Mp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=i||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,r={magFilter:ua,minFilter:ua,generateMipmaps:!1,type:tc,format:Yi,colorSpace:Bo,depthBuffer:!1},l=Vy(e,i,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vy(e,i,r);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ZR(u)),this._blurMaterial=KR(u,e,i)}return l}_compileMaterial(e){const i=new yi(this._lodPlanes[0],e);this._renderer.compile(i,vp)}_sceneToCubeUV(e,i,r,l){const h=new Li(90,1,i,r),p=[1,-1,1,1,1,1],g=[1,1,1,-1,-1,-1],_=this._renderer,m=_.autoClear,S=_.toneMapping;_.getClearColor(Hy),_.toneMapping=Dr,_.autoClear=!1;const x=new QS({name:"PMREM.Background",side:si,depthWrite:!1,depthTest:!1}),E=new yi(new _s,x);let T=!1;const M=e.background;M?M.isColor&&(x.color.copy(M),e.background=null,T=!0):(x.color.copy(Hy),T=!0);for(let y=0;y<6;y++){const U=y%3;U===0?(h.up.set(0,p[y],0),h.lookAt(g[y],0,0)):U===1?(h.up.set(0,0,p[y]),h.lookAt(0,g[y],0)):(h.up.set(0,p[y],0),h.lookAt(0,0,g[y]));const O=this._cubeSize;Yu(l,U*O,y>2?O:0,O,O),_.setRenderTarget(l),T&&_.render(E,h),_.render(e,h)}E.geometry.dispose(),E.material.dispose(),_.toneMapping=S,_.autoClear=m,e.background=M}_textureToCubeUV(e,i){const r=this._renderer,l=e.mapping===zo||e.mapping===Lo;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xy()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jy());const u=l?this._cubemapMaterial:this._equirectMaterial,d=new yi(this._lodPlanes[0],u),h=u.uniforms;h.envMap.value=e;const p=this._cubeSize;Yu(i,0,0,3*p,2*p),r.setRenderTarget(i),r.render(d,vp)}_applyPMREM(e){const i=this._renderer,r=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let u=1;u<l;u++){const d=Math.sqrt(this._sigmas[u]*this._sigmas[u]-this._sigmas[u-1]*this._sigmas[u-1]),h=ky[(l-u-1)%ky.length];this._blur(e,u-1,u,d,h)}i.autoClear=r}_blur(e,i,r,l,u){const d=this._pingPongRenderTarget;this._halfBlur(e,d,i,r,l,"latitudinal",u),this._halfBlur(d,e,r,r,l,"longitudinal",u)}_halfBlur(e,i,r,l,u,d,h){const p=this._renderer,g=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const _=3,m=new yi(this._lodPlanes[l],g),S=g.uniforms,x=this._sizeLods[r]-1,E=isFinite(u)?Math.PI/(2*x):2*Math.PI/(2*us-1),T=u/E,M=isFinite(u)?1+Math.floor(_*T):us;M>us&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${M} samples when the maximum is set to ${us}`);const y=[];let U=0;for(let z=0;z<us;++z){const I=z/T,D=Math.exp(-I*I/2);y.push(D),z===0?U+=D:z<M&&(U+=2*D)}for(let z=0;z<y.length;z++)y[z]=y[z]/U;S.envMap.value=e.texture,S.samples.value=M,S.weights.value=y,S.latitudinal.value=d==="latitudinal",h&&(S.poleAxis.value=h);const{_lodMax:O}=this;S.dTheta.value=E,S.mipInt.value=O-r;const N=this._sizeLods[l],G=3*N*(l>O-wo?l-O+wo:0),F=4*(this._cubeSize-N);Yu(i,G,F,3*N,2*N),p.setRenderTarget(i),p.render(m,vp)}}function ZR(s){const e=[],i=[],r=[];let l=s;const u=s-wo+1+Fy.length;for(let d=0;d<u;d++){const h=Math.pow(2,l);i.push(h);let p=1/h;d>s-wo?p=Fy[d-s+wo-1]:d===0&&(p=0),r.push(p);const g=1/(h-2),_=-g,m=1+g,S=[_,_,m,_,m,m,_,_,m,m,_,m],x=6,E=6,T=3,M=2,y=1,U=new Float32Array(T*E*x),O=new Float32Array(M*E*x),N=new Float32Array(y*E*x);for(let F=0;F<x;F++){const z=F%3*2/3-1,I=F>2?0:-1,D=[z,I,0,z+2/3,I,0,z+2/3,I+1,0,z,I,0,z+2/3,I+1,0,z,I+1,0];U.set(D,T*E*F),O.set(S,M*E*F);const A=[F,F,F,F,F,F];N.set(A,y*E*F)}const G=new Si;G.setAttribute("position",new qi(U,T)),G.setAttribute("uv",new qi(O,M)),G.setAttribute("faceIndex",new qi(N,y)),e.push(G),l>wo&&l--}return{lodPlanes:e,sizeLods:i,sigmas:r}}function Vy(s,e,i){const r=new ms(s,e,i);return r.texture.mapping=ff,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Yu(s,e,i,r,l){s.viewport.set(e,i,r,l),s.scissor.set(e,i,r,l)}function KR(s,e,i){const r=new Float32Array(us),l=new Z(0,1,0);return new Va({name:"SphericalGaussianBlur",defines:{n:us,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Bm(),fragmentShader:`

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
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function jy(){return new Va({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bm(),fragmentShader:`

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
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function Xy(){return new Va({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function Bm(){return`

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
	`}function QR(s){let e=new WeakMap,i=null;function r(h){if(h&&h.isTexture){const p=h.mapping,g=p===kp||p===Gp,_=p===zo||p===Lo;if(g||_){let m=e.get(h);const S=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==S)return i===null&&(i=new Gy(s)),m=g?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,e.set(h,m),m.texture;if(m!==void 0)return m.texture;{const x=h.image;return g&&x&&x.height>0||_&&x&&l(x)?(i===null&&(i=new Gy(s)),m=g?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,e.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function l(h){let p=0;const g=6;for(let _=0;_<g;_++)h[_]!==void 0&&p++;return p===g}function u(h){const p=h.target;p.removeEventListener("dispose",u);const g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function d(){e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:d}}function JR(s){const e={};function i(r){if(e[r]!==void 0)return e[r];let l;switch(r){case"WEBGL_depth_texture":l=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=s.getExtension(r)}return e[r]=l,l}return{has:function(r){return i(r)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(r){const l=i(r);return l===null&&Mo("THREE.WebGLRenderer: "+r+" extension not supported."),l}}}function $R(s,e,i,r){const l={},u=new WeakMap;function d(m){const S=m.target;S.index!==null&&e.remove(S.index);for(const E in S.attributes)e.remove(S.attributes[E]);S.removeEventListener("dispose",d),delete l[S.id];const x=u.get(S);x&&(e.remove(x),u.delete(S)),r.releaseStatesOfGeometry(S),S.isInstancedBufferGeometry===!0&&delete S._maxInstanceCount,i.memory.geometries--}function h(m,S){return l[S.id]===!0||(S.addEventListener("dispose",d),l[S.id]=!0,i.memory.geometries++),S}function p(m){const S=m.attributes;for(const x in S)e.update(S[x],s.ARRAY_BUFFER)}function g(m){const S=[],x=m.index,E=m.attributes.position;let T=0;if(x!==null){const U=x.array;T=x.version;for(let O=0,N=U.length;O<N;O+=3){const G=U[O+0],F=U[O+1],z=U[O+2];S.push(G,F,F,z,z,G)}}else if(E!==void 0){const U=E.array;T=E.version;for(let O=0,N=U.length/3-1;O<N;O+=3){const G=O+0,F=O+1,z=O+2;S.push(G,F,F,z,z,G)}}else return;const M=new(YS(S)?$S:JS)(S,1);M.version=T;const y=u.get(m);y&&e.remove(y),u.set(m,M)}function _(m){const S=u.get(m);if(S){const x=m.index;x!==null&&S.version<x.version&&g(m)}else g(m);return u.get(m)}return{get:h,update:p,getWireframeAttribute:_}}function t2(s,e,i){let r;function l(S){r=S}let u,d;function h(S){u=S.type,d=S.bytesPerElement}function p(S,x){s.drawElements(r,x,u,S*d),i.update(x,r,1)}function g(S,x,E){E!==0&&(s.drawElementsInstanced(r,x,u,S*d,E),i.update(x,r,E))}function _(S,x,E){if(E===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,x,0,u,S,0,E);let M=0;for(let y=0;y<E;y++)M+=x[y];i.update(M,r,1)}function m(S,x,E,T){if(E===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let y=0;y<S.length;y++)g(S[y]/d,x[y],T[y]);else{M.multiDrawElementsInstancedWEBGL(r,x,0,u,S,0,T,0,E);let y=0;for(let U=0;U<E;U++)y+=x[U]*T[U];i.update(y,r,1)}}this.setMode=l,this.setIndex=h,this.render=p,this.renderInstances=g,this.renderMultiDraw=_,this.renderMultiDrawInstances=m}function e2(s){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(u,d,h){switch(i.calls++,d){case s.TRIANGLES:i.triangles+=h*(u/3);break;case s.LINES:i.lines+=h*(u/2);break;case s.LINE_STRIP:i.lines+=h*(u-1);break;case s.LINE_LOOP:i.lines+=h*u;break;case s.POINTS:i.points+=h*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:r}}function n2(s,e,i){const r=new WeakMap,l=new We;function u(d,h,p){const g=d.morphTargetInfluences,_=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,m=_!==void 0?_.length:0;let S=r.get(h);if(S===void 0||S.count!==m){let A=function(){I.dispose(),r.delete(h),h.removeEventListener("dispose",A)};var x=A;S!==void 0&&S.texture.dispose();const E=h.morphAttributes.position!==void 0,T=h.morphAttributes.normal!==void 0,M=h.morphAttributes.color!==void 0,y=h.morphAttributes.position||[],U=h.morphAttributes.normal||[],O=h.morphAttributes.color||[];let N=0;E===!0&&(N=1),T===!0&&(N=2),M===!0&&(N=3);let G=h.attributes.position.count*N,F=1;G>e.maxTextureSize&&(F=Math.ceil(G/e.maxTextureSize),G=e.maxTextureSize);const z=new Float32Array(G*F*4*m),I=new qS(z,G,F,m);I.type=Ia,I.needsUpdate=!0;const D=N*4;for(let B=0;B<m;B++){const it=y[B],at=U[B],ft=O[B],ct=G*F*4*B;for(let V=0;V<it.count;V++){const st=V*D;E===!0&&(l.fromBufferAttribute(it,V),z[ct+st+0]=l.x,z[ct+st+1]=l.y,z[ct+st+2]=l.z,z[ct+st+3]=0),T===!0&&(l.fromBufferAttribute(at,V),z[ct+st+4]=l.x,z[ct+st+5]=l.y,z[ct+st+6]=l.z,z[ct+st+7]=0),M===!0&&(l.fromBufferAttribute(ft,V),z[ct+st+8]=l.x,z[ct+st+9]=l.y,z[ct+st+10]=l.z,z[ct+st+11]=ft.itemSize===4?l.w:1)}}S={count:m,texture:I,size:new fe(G,F)},r.set(h,S),h.addEventListener("dispose",A)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)p.getUniforms().setValue(s,"morphTexture",d.morphTexture,i);else{let E=0;for(let M=0;M<g.length;M++)E+=g[M];const T=h.morphTargetsRelative?1:1-E;p.getUniforms().setValue(s,"morphTargetBaseInfluence",T),p.getUniforms().setValue(s,"morphTargetInfluences",g)}p.getUniforms().setValue(s,"morphTargetsTexture",S.texture,i),p.getUniforms().setValue(s,"morphTargetsTextureSize",S.size)}return{update:u}}function i2(s,e,i,r){let l=new WeakMap;function u(p){const g=r.render.frame,_=p.geometry,m=e.get(p,_);if(l.get(m)!==g&&(e.update(m),l.set(m,g)),p.isInstancedMesh&&(p.hasEventListener("dispose",h)===!1&&p.addEventListener("dispose",h),l.get(p)!==g&&(i.update(p.instanceMatrix,s.ARRAY_BUFFER),p.instanceColor!==null&&i.update(p.instanceColor,s.ARRAY_BUFFER),l.set(p,g))),p.isSkinnedMesh){const S=p.skeleton;l.get(S)!==g&&(S.update(),l.set(S,g))}return m}function d(){l=new WeakMap}function h(p){const g=p.target;g.removeEventListener("dispose",h),i.remove(g.instanceMatrix),g.instanceColor!==null&&i.remove(g.instanceColor)}return{update:u,dispose:d}}const lx=new oi,Yy=new ax(1,1),cx=new qS,ux=new TT,fx=new nx,Wy=[],qy=[],Zy=new Float32Array(16),Ky=new Float32Array(9),Qy=new Float32Array(4);function ko(s,e,i){const r=s[0];if(r<=0||r>0)return s;const l=e*i;let u=Wy[l];if(u===void 0&&(u=new Float32Array(l),Wy[l]=u),e!==0){r.toArray(u,0);for(let d=1,h=0;d!==e;++d)h+=i,s[d].toArray(u,h)}return u}function xn(s,e){if(s.length!==e.length)return!1;for(let i=0,r=s.length;i<r;i++)if(s[i]!==e[i])return!1;return!0}function Mn(s,e){for(let i=0,r=e.length;i<r;i++)s[i]=e[i]}function df(s,e){let i=qy[e];i===void 0&&(i=new Int32Array(e),qy[e]=i);for(let r=0;r!==e;++r)i[r]=s.allocateTextureUnit();return i}function a2(s,e){const i=this.cache;i[0]!==e&&(s.uniform1f(this.addr,e),i[0]=e)}function r2(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(xn(i,e))return;s.uniform2fv(this.addr,e),Mn(i,e)}}function s2(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(xn(i,e))return;s.uniform3fv(this.addr,e),Mn(i,e)}}function o2(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(xn(i,e))return;s.uniform4fv(this.addr,e),Mn(i,e)}}function l2(s,e){const i=this.cache,r=e.elements;if(r===void 0){if(xn(i,e))return;s.uniformMatrix2fv(this.addr,!1,e),Mn(i,e)}else{if(xn(i,r))return;Qy.set(r),s.uniformMatrix2fv(this.addr,!1,Qy),Mn(i,r)}}function c2(s,e){const i=this.cache,r=e.elements;if(r===void 0){if(xn(i,e))return;s.uniformMatrix3fv(this.addr,!1,e),Mn(i,e)}else{if(xn(i,r))return;Ky.set(r),s.uniformMatrix3fv(this.addr,!1,Ky),Mn(i,r)}}function u2(s,e){const i=this.cache,r=e.elements;if(r===void 0){if(xn(i,e))return;s.uniformMatrix4fv(this.addr,!1,e),Mn(i,e)}else{if(xn(i,r))return;Zy.set(r),s.uniformMatrix4fv(this.addr,!1,Zy),Mn(i,r)}}function f2(s,e){const i=this.cache;i[0]!==e&&(s.uniform1i(this.addr,e),i[0]=e)}function h2(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(xn(i,e))return;s.uniform2iv(this.addr,e),Mn(i,e)}}function d2(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(xn(i,e))return;s.uniform3iv(this.addr,e),Mn(i,e)}}function p2(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(xn(i,e))return;s.uniform4iv(this.addr,e),Mn(i,e)}}function m2(s,e){const i=this.cache;i[0]!==e&&(s.uniform1ui(this.addr,e),i[0]=e)}function g2(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(xn(i,e))return;s.uniform2uiv(this.addr,e),Mn(i,e)}}function _2(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(xn(i,e))return;s.uniform3uiv(this.addr,e),Mn(i,e)}}function v2(s,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(xn(i,e))return;s.uniform4uiv(this.addr,e),Mn(i,e)}}function y2(s,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(s.uniform1i(this.addr,l),r[0]=l);let u;this.type===s.SAMPLER_2D_SHADOW?(Yy.compareFunction=jS,u=Yy):u=lx,i.setTexture2D(e||u,l)}function S2(s,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(s.uniform1i(this.addr,l),r[0]=l),i.setTexture3D(e||ux,l)}function x2(s,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(s.uniform1i(this.addr,l),r[0]=l),i.setTextureCube(e||fx,l)}function M2(s,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(s.uniform1i(this.addr,l),r[0]=l),i.setTexture2DArray(e||cx,l)}function E2(s){switch(s){case 5126:return a2;case 35664:return r2;case 35665:return s2;case 35666:return o2;case 35674:return l2;case 35675:return c2;case 35676:return u2;case 5124:case 35670:return f2;case 35667:case 35671:return h2;case 35668:case 35672:return d2;case 35669:case 35673:return p2;case 5125:return m2;case 36294:return g2;case 36295:return _2;case 36296:return v2;case 35678:case 36198:case 36298:case 36306:case 35682:return y2;case 35679:case 36299:case 36307:return S2;case 35680:case 36300:case 36308:case 36293:return x2;case 36289:case 36303:case 36311:case 36292:return M2}}function b2(s,e){s.uniform1fv(this.addr,e)}function T2(s,e){const i=ko(e,this.size,2);s.uniform2fv(this.addr,i)}function w2(s,e){const i=ko(e,this.size,3);s.uniform3fv(this.addr,i)}function A2(s,e){const i=ko(e,this.size,4);s.uniform4fv(this.addr,i)}function R2(s,e){const i=ko(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,i)}function C2(s,e){const i=ko(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,i)}function D2(s,e){const i=ko(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,i)}function N2(s,e){s.uniform1iv(this.addr,e)}function U2(s,e){s.uniform2iv(this.addr,e)}function z2(s,e){s.uniform3iv(this.addr,e)}function L2(s,e){s.uniform4iv(this.addr,e)}function O2(s,e){s.uniform1uiv(this.addr,e)}function P2(s,e){s.uniform2uiv(this.addr,e)}function B2(s,e){s.uniform3uiv(this.addr,e)}function I2(s,e){s.uniform4uiv(this.addr,e)}function F2(s,e,i){const r=this.cache,l=e.length,u=df(i,l);xn(r,u)||(s.uniform1iv(this.addr,u),Mn(r,u));for(let d=0;d!==l;++d)i.setTexture2D(e[d]||lx,u[d])}function H2(s,e,i){const r=this.cache,l=e.length,u=df(i,l);xn(r,u)||(s.uniform1iv(this.addr,u),Mn(r,u));for(let d=0;d!==l;++d)i.setTexture3D(e[d]||ux,u[d])}function k2(s,e,i){const r=this.cache,l=e.length,u=df(i,l);xn(r,u)||(s.uniform1iv(this.addr,u),Mn(r,u));for(let d=0;d!==l;++d)i.setTextureCube(e[d]||fx,u[d])}function G2(s,e,i){const r=this.cache,l=e.length,u=df(i,l);xn(r,u)||(s.uniform1iv(this.addr,u),Mn(r,u));for(let d=0;d!==l;++d)i.setTexture2DArray(e[d]||cx,u[d])}function V2(s){switch(s){case 5126:return b2;case 35664:return T2;case 35665:return w2;case 35666:return A2;case 35674:return R2;case 35675:return C2;case 35676:return D2;case 5124:case 35670:return N2;case 35667:case 35671:return U2;case 35668:case 35672:return z2;case 35669:case 35673:return L2;case 5125:return O2;case 36294:return P2;case 36295:return B2;case 36296:return I2;case 35678:case 36198:case 36298:case 36306:case 35682:return F2;case 35679:case 36299:case 36307:return H2;case 35680:case 36300:case 36308:case 36293:return k2;case 36289:case 36303:case 36311:case 36292:return G2}}class j2{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.setValue=E2(i.type)}}class X2{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=V2(i.type)}}class Y2{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,r){const l=this.seq;for(let u=0,d=l.length;u!==d;++u){const h=l[u];h.setValue(e,i[h.id],r)}}}const Ep=/(\w+)(\])?(\[|\.)?/g;function Jy(s,e){s.seq.push(e),s.map[e.id]=e}function W2(s,e,i){const r=s.name,l=r.length;for(Ep.lastIndex=0;;){const u=Ep.exec(r),d=Ep.lastIndex;let h=u[1];const p=u[2]==="]",g=u[3];if(p&&(h=h|0),g===void 0||g==="["&&d+2===l){Jy(i,g===void 0?new j2(h,s,e):new X2(h,s,e));break}else{let m=i.map[h];m===void 0&&(m=new Y2(h),Jy(i,m)),i=m}}}class af{constructor(e,i){this.seq=[],this.map={};const r=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let l=0;l<r;++l){const u=e.getActiveUniform(i,l),d=e.getUniformLocation(i,u.name);W2(u,d,this)}}setValue(e,i,r,l){const u=this.map[i];u!==void 0&&u.setValue(e,r,l)}setOptional(e,i,r){const l=i[r];l!==void 0&&this.setValue(e,r,l)}static upload(e,i,r,l){for(let u=0,d=i.length;u!==d;++u){const h=i[u],p=r[h.id];p.needsUpdate!==!1&&h.setValue(e,p.value,l)}}static seqWithValue(e,i){const r=[];for(let l=0,u=e.length;l!==u;++l){const d=e[l];d.id in i&&r.push(d)}return r}}function $y(s,e,i){const r=s.createShader(e);return s.shaderSource(r,i),s.compileShader(r),r}const q2=37297;let Z2=0;function K2(s,e){const i=s.split(`
`),r=[],l=Math.max(e-6,0),u=Math.min(e+6,i.length);for(let d=l;d<u;d++){const h=d+1;r.push(`${h===e?">":" "} ${h}: ${i[d]}`)}return r.join(`
`)}const tS=new me;function Q2(s){ze._getMatrix(tS,ze.workingColorSpace,s);const e=`mat3( ${tS.elements.map(i=>i.toFixed(4))} )`;switch(ze.getTransfer(s)){case rf:return[e,"LinearTransferOETF"];case Ge:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function eS(s,e,i){const r=s.getShaderParameter(e,s.COMPILE_STATUS),l=s.getShaderInfoLog(e).trim();if(r&&l==="")return"";const u=/ERROR: 0:(\d+)/.exec(l);if(u){const d=parseInt(u[1]);return i.toUpperCase()+`

`+l+`

`+K2(s.getShaderSource(e),d)}else return l}function J2(s,e){const i=Q2(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function $2(s,e){let i;switch(e){case P1:i="Linear";break;case B1:i="Reinhard";break;case I1:i="Cineon";break;case F1:i="ACESFilmic";break;case k1:i="AgX";break;case G1:i="Neutral";break;case H1:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),i="Linear"}return"vec3 "+s+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Wu=new Z;function tC(){ze.getLuminanceCoefficients(Wu);const s=Wu.x.toFixed(4),e=Wu.y.toFixed(4),i=Wu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function eC(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xl).join(`
`)}function nC(s){const e=[];for(const i in s){const r=s[i];r!==!1&&e.push("#define "+i+" "+r)}return e.join(`
`)}function iC(s,e){const i={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let l=0;l<r;l++){const u=s.getActiveAttrib(e,l),d=u.name;let h=1;u.type===s.FLOAT_MAT2&&(h=2),u.type===s.FLOAT_MAT3&&(h=3),u.type===s.FLOAT_MAT4&&(h=4),i[d]={type:u.type,location:s.getAttribLocation(e,d),locationSize:h}}return i}function Xl(s){return s!==""}function nS(s,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function iS(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const aC=/^[ \t]*#include +<([\w\d./]+)>/gm;function ym(s){return s.replace(aC,sC)}const rC=new Map;function sC(s,e){let i=ge[e];if(i===void 0){const r=rC.get(e);if(r!==void 0)i=ge[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return ym(i)}const oC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function aS(s){return s.replace(oC,lC)}function lC(s,e,i,r){let l="";for(let u=parseInt(e);u<parseInt(i);u++)l+=r.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return l}function rS(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function cC(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===DS?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===m1?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Pa&&(e="SHADOWMAP_TYPE_VSM"),e}function uC(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case zo:case Lo:e="ENVMAP_TYPE_CUBE";break;case ff:e="ENVMAP_TYPE_CUBE_UV";break}return e}function fC(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Lo:e="ENVMAP_MODE_REFRACTION";break}return e}function hC(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case NS:e="ENVMAP_BLENDING_MULTIPLY";break;case L1:e="ENVMAP_BLENDING_MIX";break;case O1:e="ENVMAP_BLENDING_ADD";break}return e}function dC(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:r,maxMip:i}}function pC(s,e,i,r){const l=s.getContext(),u=i.defines;let d=i.vertexShader,h=i.fragmentShader;const p=cC(i),g=uC(i),_=fC(i),m=hC(i),S=dC(i),x=eC(i),E=nC(u),T=l.createProgram();let M,y,U=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(M=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E].filter(Xl).join(`
`),M.length>0&&(M+=`
`),y=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E].filter(Xl).join(`
`),y.length>0&&(y+=`
`)):(M=[rS(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+_:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xl).join(`
`),y=[rS(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.envMap?"#define "+_:"",i.envMap?"#define "+m:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Dr?"#define TONE_MAPPING":"",i.toneMapping!==Dr?ge.tonemapping_pars_fragment:"",i.toneMapping!==Dr?$2("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",ge.colorspace_pars_fragment,J2("linearToOutputTexel",i.outputColorSpace),tC(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(Xl).join(`
`)),d=ym(d),d=nS(d,i),d=iS(d,i),h=ym(h),h=nS(h,i),h=iS(h,i),d=aS(d),h=aS(h),i.isRawShaderMaterial!==!0&&(U=`#version 300 es
`,M=[x,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+M,y=["#define varying in",i.glslVersion===cy?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===cy?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const O=U+M+d,N=U+y+h,G=$y(l,l.VERTEX_SHADER,O),F=$y(l,l.FRAGMENT_SHADER,N);l.attachShader(T,G),l.attachShader(T,F),i.index0AttributeName!==void 0?l.bindAttribLocation(T,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(T,0,"position"),l.linkProgram(T);function z(B){if(s.debug.checkShaderErrors){const it=l.getProgramInfoLog(T).trim(),at=l.getShaderInfoLog(G).trim(),ft=l.getShaderInfoLog(F).trim();let ct=!0,V=!0;if(l.getProgramParameter(T,l.LINK_STATUS)===!1)if(ct=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(l,T,G,F);else{const st=eS(l,G,"vertex"),q=eS(l,F,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(T,l.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+it+`
`+st+`
`+q)}else it!==""?console.warn("THREE.WebGLProgram: Program Info Log:",it):(at===""||ft==="")&&(V=!1);V&&(B.diagnostics={runnable:ct,programLog:it,vertexShader:{log:at,prefix:M},fragmentShader:{log:ft,prefix:y}})}l.deleteShader(G),l.deleteShader(F),I=new af(l,T),D=iC(l,T)}let I;this.getUniforms=function(){return I===void 0&&z(this),I};let D;this.getAttributes=function(){return D===void 0&&z(this),D};let A=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=l.getProgramParameter(T,q2)),A},this.destroy=function(){r.releaseStatesOfProgram(this),l.deleteProgram(T),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=Z2++,this.cacheKey=e,this.usedTimes=1,this.program=T,this.vertexShader=G,this.fragmentShader=F,this}let mC=0;class gC{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const i=e.vertexShader,r=e.fragmentShader,l=this._getShaderStage(i),u=this._getShaderStage(r),d=this._getShaderCacheForMaterial(e);return d.has(l)===!1&&(d.add(l),l.usedTimes++),d.has(u)===!1&&(d.add(u),u.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const r of i)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let r=i.get(e);return r===void 0&&(r=new Set,i.set(e,r)),r}_getShaderStage(e){const i=this.shaderCache;let r=i.get(e);return r===void 0&&(r=new _C(e),i.set(e,r)),r}}class _C{constructor(e){this.id=mC++,this.code=e,this.usedTimes=0}}function vC(s,e,i,r,l,u,d){const h=new ZS,p=new gC,g=new Set,_=[],m=l.logarithmicDepthBuffer,S=l.vertexTextures;let x=l.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function T(D){return g.add(D),D===0?"uv":`uv${D}`}function M(D,A,B,it,at){const ft=it.fog,ct=at.geometry,V=D.isMeshStandardMaterial?it.environment:null,st=(D.isMeshStandardMaterial?i:e).get(D.envMap||V),q=st&&st.mapping===ff?st.image.height:null,St=E[D.type];D.precision!==null&&(x=l.getMaxPrecision(D.precision),x!==D.precision&&console.warn("THREE.WebGLProgram.getParameters:",D.precision,"not supported, using",x,"instead."));const vt=ct.morphAttributes.position||ct.morphAttributes.normal||ct.morphAttributes.color,At=vt!==void 0?vt.length:0;let Yt=0;ct.morphAttributes.position!==void 0&&(Yt=1),ct.morphAttributes.normal!==void 0&&(Yt=2),ct.morphAttributes.color!==void 0&&(Yt=3);let ie,R,Y,yt;if(St){const Re=ri[St];ie=Re.vertexShader,R=Re.fragmentShader}else ie=D.vertexShader,R=D.fragmentShader,p.update(D),Y=p.getVertexShaderID(D),yt=p.getFragmentShaderID(D);const ht=s.getRenderTarget(),Rt=s.state.buffers.depth.getReversed(),Xt=at.isInstancedMesh===!0,Ut=at.isBatchedMesh===!0,Ct=!!D.map,kt=!!D.matcap,le=!!st,H=!!D.aoMap,ln=!!D.lightMap,se=!!D.bumpMap,Jt=!!D.normalMap,tt=!!D.displacementMap,bt=!!D.emissiveMap,Et=!!D.metalnessMap,L=!!D.roughnessMap,w=D.anisotropy>0,nt=D.clearcoat>0,pt=D.dispersion>0,Mt=D.iridescence>0,mt=D.sheen>0,Zt=D.transmission>0,Bt=w&&!!D.anisotropyMap,Ht=nt&&!!D.clearcoatMap,xe=nt&&!!D.clearcoatNormalMap,wt=nt&&!!D.clearcoatRoughnessMap,Wt=Mt&&!!D.iridescenceMap,ee=Mt&&!!D.iridescenceThicknessMap,re=mt&&!!D.sheenColorMap,jt=mt&&!!D.sheenRoughnessMap,ye=!!D.specularMap,he=!!D.specularColorMap,He=!!D.specularIntensityMap,X=Zt&&!!D.transmissionMap,It=Zt&&!!D.thicknessMap,dt=!!D.gradientMap,xt=!!D.alphaMap,Ft=D.alphaTest>0,Gt=!!D.alphaHash,ue=!!D.extensions;let tn=Dr;D.toneMapped&&(ht===null||ht.isXRRenderTarget===!0)&&(tn=s.toneMapping);const En={shaderID:St,shaderType:D.type,shaderName:D.name,vertexShader:ie,fragmentShader:R,defines:D.defines,customVertexShaderID:Y,customFragmentShaderID:yt,isRawShaderMaterial:D.isRawShaderMaterial===!0,glslVersion:D.glslVersion,precision:x,batching:Ut,batchingColor:Ut&&at._colorsTexture!==null,instancing:Xt,instancingColor:Xt&&at.instanceColor!==null,instancingMorph:Xt&&at.morphTexture!==null,supportsVertexTextures:S,outputColorSpace:ht===null?s.outputColorSpace:ht.isXRRenderTarget===!0?ht.texture.colorSpace:Bo,alphaToCoverage:!!D.alphaToCoverage,map:Ct,matcap:kt,envMap:le,envMapMode:le&&st.mapping,envMapCubeUVHeight:q,aoMap:H,lightMap:ln,bumpMap:se,normalMap:Jt,displacementMap:S&&tt,emissiveMap:bt,normalMapObjectSpace:Jt&&D.normalMapType===Y1,normalMapTangentSpace:Jt&&D.normalMapType===VS,metalnessMap:Et,roughnessMap:L,anisotropy:w,anisotropyMap:Bt,clearcoat:nt,clearcoatMap:Ht,clearcoatNormalMap:xe,clearcoatRoughnessMap:wt,dispersion:pt,iridescence:Mt,iridescenceMap:Wt,iridescenceThicknessMap:ee,sheen:mt,sheenColorMap:re,sheenRoughnessMap:jt,specularMap:ye,specularColorMap:he,specularIntensityMap:He,transmission:Zt,transmissionMap:X,thicknessMap:It,gradientMap:dt,opaque:D.transparent===!1&&D.blending===Co&&D.alphaToCoverage===!1,alphaMap:xt,alphaTest:Ft,alphaHash:Gt,combine:D.combine,mapUv:Ct&&T(D.map.channel),aoMapUv:H&&T(D.aoMap.channel),lightMapUv:ln&&T(D.lightMap.channel),bumpMapUv:se&&T(D.bumpMap.channel),normalMapUv:Jt&&T(D.normalMap.channel),displacementMapUv:tt&&T(D.displacementMap.channel),emissiveMapUv:bt&&T(D.emissiveMap.channel),metalnessMapUv:Et&&T(D.metalnessMap.channel),roughnessMapUv:L&&T(D.roughnessMap.channel),anisotropyMapUv:Bt&&T(D.anisotropyMap.channel),clearcoatMapUv:Ht&&T(D.clearcoatMap.channel),clearcoatNormalMapUv:xe&&T(D.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:wt&&T(D.clearcoatRoughnessMap.channel),iridescenceMapUv:Wt&&T(D.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&T(D.iridescenceThicknessMap.channel),sheenColorMapUv:re&&T(D.sheenColorMap.channel),sheenRoughnessMapUv:jt&&T(D.sheenRoughnessMap.channel),specularMapUv:ye&&T(D.specularMap.channel),specularColorMapUv:he&&T(D.specularColorMap.channel),specularIntensityMapUv:He&&T(D.specularIntensityMap.channel),transmissionMapUv:X&&T(D.transmissionMap.channel),thicknessMapUv:It&&T(D.thicknessMap.channel),alphaMapUv:xt&&T(D.alphaMap.channel),vertexTangents:!!ct.attributes.tangent&&(Jt||w),vertexColors:D.vertexColors,vertexAlphas:D.vertexColors===!0&&!!ct.attributes.color&&ct.attributes.color.itemSize===4,pointsUvs:at.isPoints===!0&&!!ct.attributes.uv&&(Ct||xt),fog:!!ft,useFog:D.fog===!0,fogExp2:!!ft&&ft.isFogExp2,flatShading:D.flatShading===!0,sizeAttenuation:D.sizeAttenuation===!0,logarithmicDepthBuffer:m,reverseDepthBuffer:Rt,skinning:at.isSkinnedMesh===!0,morphTargets:ct.morphAttributes.position!==void 0,morphNormals:ct.morphAttributes.normal!==void 0,morphColors:ct.morphAttributes.color!==void 0,morphTargetsCount:At,morphTextureStride:Yt,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:D.dithering,shadowMapEnabled:s.shadowMap.enabled&&B.length>0,shadowMapType:s.shadowMap.type,toneMapping:tn,decodeVideoTexture:Ct&&D.map.isVideoTexture===!0&&ze.getTransfer(D.map.colorSpace)===Ge,decodeVideoTextureEmissive:bt&&D.emissiveMap.isVideoTexture===!0&&ze.getTransfer(D.emissiveMap.colorSpace)===Ge,premultipliedAlpha:D.premultipliedAlpha,doubleSided:D.side===Ba,flipSided:D.side===si,useDepthPacking:D.depthPacking>=0,depthPacking:D.depthPacking||0,index0AttributeName:D.index0AttributeName,extensionClipCullDistance:ue&&D.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ue&&D.extensions.multiDraw===!0||Ut)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:D.customProgramCacheKey()};return En.vertexUv1s=g.has(1),En.vertexUv2s=g.has(2),En.vertexUv3s=g.has(3),g.clear(),En}function y(D){const A=[];if(D.shaderID?A.push(D.shaderID):(A.push(D.customVertexShaderID),A.push(D.customFragmentShaderID)),D.defines!==void 0)for(const B in D.defines)A.push(B),A.push(D.defines[B]);return D.isRawShaderMaterial===!1&&(U(A,D),O(A,D),A.push(s.outputColorSpace)),A.push(D.customProgramCacheKey),A.join()}function U(D,A){D.push(A.precision),D.push(A.outputColorSpace),D.push(A.envMapMode),D.push(A.envMapCubeUVHeight),D.push(A.mapUv),D.push(A.alphaMapUv),D.push(A.lightMapUv),D.push(A.aoMapUv),D.push(A.bumpMapUv),D.push(A.normalMapUv),D.push(A.displacementMapUv),D.push(A.emissiveMapUv),D.push(A.metalnessMapUv),D.push(A.roughnessMapUv),D.push(A.anisotropyMapUv),D.push(A.clearcoatMapUv),D.push(A.clearcoatNormalMapUv),D.push(A.clearcoatRoughnessMapUv),D.push(A.iridescenceMapUv),D.push(A.iridescenceThicknessMapUv),D.push(A.sheenColorMapUv),D.push(A.sheenRoughnessMapUv),D.push(A.specularMapUv),D.push(A.specularColorMapUv),D.push(A.specularIntensityMapUv),D.push(A.transmissionMapUv),D.push(A.thicknessMapUv),D.push(A.combine),D.push(A.fogExp2),D.push(A.sizeAttenuation),D.push(A.morphTargetsCount),D.push(A.morphAttributeCount),D.push(A.numDirLights),D.push(A.numPointLights),D.push(A.numSpotLights),D.push(A.numSpotLightMaps),D.push(A.numHemiLights),D.push(A.numRectAreaLights),D.push(A.numDirLightShadows),D.push(A.numPointLightShadows),D.push(A.numSpotLightShadows),D.push(A.numSpotLightShadowsWithMaps),D.push(A.numLightProbes),D.push(A.shadowMapType),D.push(A.toneMapping),D.push(A.numClippingPlanes),D.push(A.numClipIntersection),D.push(A.depthPacking)}function O(D,A){h.disableAll(),A.supportsVertexTextures&&h.enable(0),A.instancing&&h.enable(1),A.instancingColor&&h.enable(2),A.instancingMorph&&h.enable(3),A.matcap&&h.enable(4),A.envMap&&h.enable(5),A.normalMapObjectSpace&&h.enable(6),A.normalMapTangentSpace&&h.enable(7),A.clearcoat&&h.enable(8),A.iridescence&&h.enable(9),A.alphaTest&&h.enable(10),A.vertexColors&&h.enable(11),A.vertexAlphas&&h.enable(12),A.vertexUv1s&&h.enable(13),A.vertexUv2s&&h.enable(14),A.vertexUv3s&&h.enable(15),A.vertexTangents&&h.enable(16),A.anisotropy&&h.enable(17),A.alphaHash&&h.enable(18),A.batching&&h.enable(19),A.dispersion&&h.enable(20),A.batchingColor&&h.enable(21),D.push(h.mask),h.disableAll(),A.fog&&h.enable(0),A.useFog&&h.enable(1),A.flatShading&&h.enable(2),A.logarithmicDepthBuffer&&h.enable(3),A.reverseDepthBuffer&&h.enable(4),A.skinning&&h.enable(5),A.morphTargets&&h.enable(6),A.morphNormals&&h.enable(7),A.morphColors&&h.enable(8),A.premultipliedAlpha&&h.enable(9),A.shadowMapEnabled&&h.enable(10),A.doubleSided&&h.enable(11),A.flipSided&&h.enable(12),A.useDepthPacking&&h.enable(13),A.dithering&&h.enable(14),A.transmission&&h.enable(15),A.sheen&&h.enable(16),A.opaque&&h.enable(17),A.pointsUvs&&h.enable(18),A.decodeVideoTexture&&h.enable(19),A.decodeVideoTextureEmissive&&h.enable(20),A.alphaToCoverage&&h.enable(21),D.push(h.mask)}function N(D){const A=E[D.type];let B;if(A){const it=ri[A];B=Um.clone(it.uniforms)}else B=D.uniforms;return B}function G(D,A){let B;for(let it=0,at=_.length;it<at;it++){const ft=_[it];if(ft.cacheKey===A){B=ft,++B.usedTimes;break}}return B===void 0&&(B=new pC(s,A,D,u),_.push(B)),B}function F(D){if(--D.usedTimes===0){const A=_.indexOf(D);_[A]=_[_.length-1],_.pop(),D.destroy()}}function z(D){p.remove(D)}function I(){p.dispose()}return{getParameters:M,getProgramCacheKey:y,getUniforms:N,acquireProgram:G,releaseProgram:F,releaseShaderCache:z,programs:_,dispose:I}}function yC(){let s=new WeakMap;function e(d){return s.has(d)}function i(d){let h=s.get(d);return h===void 0&&(h={},s.set(d,h)),h}function r(d){s.delete(d)}function l(d,h,p){s.get(d)[h]=p}function u(){s=new WeakMap}return{has:e,get:i,remove:r,update:l,dispose:u}}function SC(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function sS(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function oS(){const s=[];let e=0;const i=[],r=[],l=[];function u(){e=0,i.length=0,r.length=0,l.length=0}function d(m,S,x,E,T,M){let y=s[e];return y===void 0?(y={id:m.id,object:m,geometry:S,material:x,groupOrder:E,renderOrder:m.renderOrder,z:T,group:M},s[e]=y):(y.id=m.id,y.object=m,y.geometry=S,y.material=x,y.groupOrder=E,y.renderOrder=m.renderOrder,y.z=T,y.group=M),e++,y}function h(m,S,x,E,T,M){const y=d(m,S,x,E,T,M);x.transmission>0?r.push(y):x.transparent===!0?l.push(y):i.push(y)}function p(m,S,x,E,T,M){const y=d(m,S,x,E,T,M);x.transmission>0?r.unshift(y):x.transparent===!0?l.unshift(y):i.unshift(y)}function g(m,S){i.length>1&&i.sort(m||SC),r.length>1&&r.sort(S||sS),l.length>1&&l.sort(S||sS)}function _(){for(let m=e,S=s.length;m<S;m++){const x=s[m];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:i,transmissive:r,transparent:l,init:u,push:h,unshift:p,finish:_,sort:g}}function xC(){let s=new WeakMap;function e(r,l){const u=s.get(r);let d;return u===void 0?(d=new oS,s.set(r,[d])):l>=u.length?(d=new oS,u.push(d)):d=u[l],d}function i(){s=new WeakMap}return{get:e,dispose:i}}function MC(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let i;switch(e.type){case"DirectionalLight":i={direction:new Z,color:new Se};break;case"SpotLight":i={position:new Z,direction:new Z,color:new Se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new Z,color:new Se,distance:0,decay:0};break;case"HemisphereLight":i={direction:new Z,skyColor:new Se,groundColor:new Se};break;case"RectAreaLight":i={color:new Se,position:new Z,halfWidth:new Z,halfHeight:new Z};break}return s[e.id]=i,i}}}function EC(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let i;switch(e.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=i,i}}}let bC=0;function TC(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function wC(s){const e=new MC,i=EC(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let g=0;g<9;g++)r.probe.push(new Z);const l=new Z,u=new $e,d=new $e;function h(g){let _=0,m=0,S=0;for(let D=0;D<9;D++)r.probe[D].set(0,0,0);let x=0,E=0,T=0,M=0,y=0,U=0,O=0,N=0,G=0,F=0,z=0;g.sort(TC);for(let D=0,A=g.length;D<A;D++){const B=g[D],it=B.color,at=B.intensity,ft=B.distance,ct=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)_+=it.r*at,m+=it.g*at,S+=it.b*at;else if(B.isLightProbe){for(let V=0;V<9;V++)r.probe[V].addScaledVector(B.sh.coefficients[V],at);z++}else if(B.isDirectionalLight){const V=e.get(B);if(V.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const st=B.shadow,q=i.get(B);q.shadowIntensity=st.intensity,q.shadowBias=st.bias,q.shadowNormalBias=st.normalBias,q.shadowRadius=st.radius,q.shadowMapSize=st.mapSize,r.directionalShadow[x]=q,r.directionalShadowMap[x]=ct,r.directionalShadowMatrix[x]=B.shadow.matrix,U++}r.directional[x]=V,x++}else if(B.isSpotLight){const V=e.get(B);V.position.setFromMatrixPosition(B.matrixWorld),V.color.copy(it).multiplyScalar(at),V.distance=ft,V.coneCos=Math.cos(B.angle),V.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),V.decay=B.decay,r.spot[T]=V;const st=B.shadow;if(B.map&&(r.spotLightMap[G]=B.map,G++,st.updateMatrices(B),B.castShadow&&F++),r.spotLightMatrix[T]=st.matrix,B.castShadow){const q=i.get(B);q.shadowIntensity=st.intensity,q.shadowBias=st.bias,q.shadowNormalBias=st.normalBias,q.shadowRadius=st.radius,q.shadowMapSize=st.mapSize,r.spotShadow[T]=q,r.spotShadowMap[T]=ct,N++}T++}else if(B.isRectAreaLight){const V=e.get(B);V.color.copy(it).multiplyScalar(at),V.halfWidth.set(B.width*.5,0,0),V.halfHeight.set(0,B.height*.5,0),r.rectArea[M]=V,M++}else if(B.isPointLight){const V=e.get(B);if(V.color.copy(B.color).multiplyScalar(B.intensity),V.distance=B.distance,V.decay=B.decay,B.castShadow){const st=B.shadow,q=i.get(B);q.shadowIntensity=st.intensity,q.shadowBias=st.bias,q.shadowNormalBias=st.normalBias,q.shadowRadius=st.radius,q.shadowMapSize=st.mapSize,q.shadowCameraNear=st.camera.near,q.shadowCameraFar=st.camera.far,r.pointShadow[E]=q,r.pointShadowMap[E]=ct,r.pointShadowMatrix[E]=B.shadow.matrix,O++}r.point[E]=V,E++}else if(B.isHemisphereLight){const V=e.get(B);V.skyColor.copy(B.color).multiplyScalar(at),V.groundColor.copy(B.groundColor).multiplyScalar(at),r.hemi[y]=V,y++}}M>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Lt.LTC_FLOAT_1,r.rectAreaLTC2=Lt.LTC_FLOAT_2):(r.rectAreaLTC1=Lt.LTC_HALF_1,r.rectAreaLTC2=Lt.LTC_HALF_2)),r.ambient[0]=_,r.ambient[1]=m,r.ambient[2]=S;const I=r.hash;(I.directionalLength!==x||I.pointLength!==E||I.spotLength!==T||I.rectAreaLength!==M||I.hemiLength!==y||I.numDirectionalShadows!==U||I.numPointShadows!==O||I.numSpotShadows!==N||I.numSpotMaps!==G||I.numLightProbes!==z)&&(r.directional.length=x,r.spot.length=T,r.rectArea.length=M,r.point.length=E,r.hemi.length=y,r.directionalShadow.length=U,r.directionalShadowMap.length=U,r.pointShadow.length=O,r.pointShadowMap.length=O,r.spotShadow.length=N,r.spotShadowMap.length=N,r.directionalShadowMatrix.length=U,r.pointShadowMatrix.length=O,r.spotLightMatrix.length=N+G-F,r.spotLightMap.length=G,r.numSpotLightShadowsWithMaps=F,r.numLightProbes=z,I.directionalLength=x,I.pointLength=E,I.spotLength=T,I.rectAreaLength=M,I.hemiLength=y,I.numDirectionalShadows=U,I.numPointShadows=O,I.numSpotShadows=N,I.numSpotMaps=G,I.numLightProbes=z,r.version=bC++)}function p(g,_){let m=0,S=0,x=0,E=0,T=0;const M=_.matrixWorldInverse;for(let y=0,U=g.length;y<U;y++){const O=g[y];if(O.isDirectionalLight){const N=r.directional[m];N.direction.setFromMatrixPosition(O.matrixWorld),l.setFromMatrixPosition(O.target.matrixWorld),N.direction.sub(l),N.direction.transformDirection(M),m++}else if(O.isSpotLight){const N=r.spot[x];N.position.setFromMatrixPosition(O.matrixWorld),N.position.applyMatrix4(M),N.direction.setFromMatrixPosition(O.matrixWorld),l.setFromMatrixPosition(O.target.matrixWorld),N.direction.sub(l),N.direction.transformDirection(M),x++}else if(O.isRectAreaLight){const N=r.rectArea[E];N.position.setFromMatrixPosition(O.matrixWorld),N.position.applyMatrix4(M),d.identity(),u.copy(O.matrixWorld),u.premultiply(M),d.extractRotation(u),N.halfWidth.set(O.width*.5,0,0),N.halfHeight.set(0,O.height*.5,0),N.halfWidth.applyMatrix4(d),N.halfHeight.applyMatrix4(d),E++}else if(O.isPointLight){const N=r.point[S];N.position.setFromMatrixPosition(O.matrixWorld),N.position.applyMatrix4(M),S++}else if(O.isHemisphereLight){const N=r.hemi[T];N.direction.setFromMatrixPosition(O.matrixWorld),N.direction.transformDirection(M),T++}}}return{setup:h,setupView:p,state:r}}function lS(s){const e=new wC(s),i=[],r=[];function l(_){g.camera=_,i.length=0,r.length=0}function u(_){i.push(_)}function d(_){r.push(_)}function h(){e.setup(i)}function p(_){e.setupView(i,_)}const g={lightsArray:i,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:l,state:g,setupLights:h,setupLightsView:p,pushLight:u,pushShadow:d}}function AC(s){let e=new WeakMap;function i(l,u=0){const d=e.get(l);let h;return d===void 0?(h=new lS(s),e.set(l,[h])):u>=d.length?(h=new lS(s),d.push(h)):h=d[u],h}function r(){e=new WeakMap}return{get:i,dispose:r}}const RC=`void main() {
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
}`;function DC(s,e,i){let r=new zm;const l=new fe,u=new fe,d=new We,h=new ZT({depthPacking:X1}),p=new KT,g={},_=i.maxTextureSize,m={[Nr]:si,[si]:Nr,[Ba]:Ba},S=new Va({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:RC,fragmentShader:CC}),x=S.clone();x.defines.HORIZONTAL_PASS=1;const E=new Si;E.setAttribute("position",new qi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new yi(E,S),M=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=DS;let y=this.type;this.render=function(F,z,I){if(M.enabled===!1||M.autoUpdate===!1&&M.needsUpdate===!1||F.length===0)return;const D=s.getRenderTarget(),A=s.getActiveCubeFace(),B=s.getActiveMipmapLevel(),it=s.state;it.setBlending(Cr),it.buffers.color.setClear(1,1,1,1),it.buffers.depth.setTest(!0),it.setScissorTest(!1);const at=y!==Pa&&this.type===Pa,ft=y===Pa&&this.type!==Pa;for(let ct=0,V=F.length;ct<V;ct++){const st=F[ct],q=st.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",st,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;l.copy(q.mapSize);const St=q.getFrameExtents();if(l.multiply(St),u.copy(q.mapSize),(l.x>_||l.y>_)&&(l.x>_&&(u.x=Math.floor(_/St.x),l.x=u.x*St.x,q.mapSize.x=u.x),l.y>_&&(u.y=Math.floor(_/St.y),l.y=u.y*St.y,q.mapSize.y=u.y)),q.map===null||at===!0||ft===!0){const At=this.type!==Pa?{minFilter:Wi,magFilter:Wi}:{};q.map!==null&&q.map.dispose(),q.map=new ms(l.x,l.y,At),q.map.texture.name=st.name+".shadowMap",q.camera.updateProjectionMatrix()}s.setRenderTarget(q.map),s.clear();const vt=q.getViewportCount();for(let At=0;At<vt;At++){const Yt=q.getViewport(At);d.set(u.x*Yt.x,u.y*Yt.y,u.x*Yt.z,u.y*Yt.w),it.viewport(d),q.updateMatrices(st,At),r=q.getFrustum(),N(z,I,q.camera,st,this.type)}q.isPointLightShadow!==!0&&this.type===Pa&&U(q,I),q.needsUpdate=!1}y=this.type,M.needsUpdate=!1,s.setRenderTarget(D,A,B)};function U(F,z){const I=e.update(T);S.defines.VSM_SAMPLES!==F.blurSamples&&(S.defines.VSM_SAMPLES=F.blurSamples,x.defines.VSM_SAMPLES=F.blurSamples,S.needsUpdate=!0,x.needsUpdate=!0),F.mapPass===null&&(F.mapPass=new ms(l.x,l.y)),S.uniforms.shadow_pass.value=F.map.texture,S.uniforms.resolution.value=F.mapSize,S.uniforms.radius.value=F.radius,s.setRenderTarget(F.mapPass),s.clear(),s.renderBufferDirect(z,null,I,S,T,null),x.uniforms.shadow_pass.value=F.mapPass.texture,x.uniforms.resolution.value=F.mapSize,x.uniforms.radius.value=F.radius,s.setRenderTarget(F.map),s.clear(),s.renderBufferDirect(z,null,I,x,T,null)}function O(F,z,I,D){let A=null;const B=I.isPointLight===!0?F.customDistanceMaterial:F.customDepthMaterial;if(B!==void 0)A=B;else if(A=I.isPointLight===!0?p:h,s.localClippingEnabled&&z.clipShadows===!0&&Array.isArray(z.clippingPlanes)&&z.clippingPlanes.length!==0||z.displacementMap&&z.displacementScale!==0||z.alphaMap&&z.alphaTest>0||z.map&&z.alphaTest>0){const it=A.uuid,at=z.uuid;let ft=g[it];ft===void 0&&(ft={},g[it]=ft);let ct=ft[at];ct===void 0&&(ct=A.clone(),ft[at]=ct,z.addEventListener("dispose",G)),A=ct}if(A.visible=z.visible,A.wireframe=z.wireframe,D===Pa?A.side=z.shadowSide!==null?z.shadowSide:z.side:A.side=z.shadowSide!==null?z.shadowSide:m[z.side],A.alphaMap=z.alphaMap,A.alphaTest=z.alphaTest,A.map=z.map,A.clipShadows=z.clipShadows,A.clippingPlanes=z.clippingPlanes,A.clipIntersection=z.clipIntersection,A.displacementMap=z.displacementMap,A.displacementScale=z.displacementScale,A.displacementBias=z.displacementBias,A.wireframeLinewidth=z.wireframeLinewidth,A.linewidth=z.linewidth,I.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const it=s.properties.get(A);it.light=I}return A}function N(F,z,I,D,A){if(F.visible===!1)return;if(F.layers.test(z.layers)&&(F.isMesh||F.isLine||F.isPoints)&&(F.castShadow||F.receiveShadow&&A===Pa)&&(!F.frustumCulled||r.intersectsObject(F))){F.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,F.matrixWorld);const at=e.update(F),ft=F.material;if(Array.isArray(ft)){const ct=at.groups;for(let V=0,st=ct.length;V<st;V++){const q=ct[V],St=ft[q.materialIndex];if(St&&St.visible){const vt=O(F,St,D,A);F.onBeforeShadow(s,F,z,I,at,vt,q),s.renderBufferDirect(I,null,at,vt,F,q),F.onAfterShadow(s,F,z,I,at,vt,q)}}}else if(ft.visible){const ct=O(F,ft,D,A);F.onBeforeShadow(s,F,z,I,at,ct,null),s.renderBufferDirect(I,null,at,ct,F,null),F.onAfterShadow(s,F,z,I,at,ct,null)}}const it=F.children;for(let at=0,ft=it.length;at<ft;at++)N(it[at],z,I,D,A)}function G(F){F.target.removeEventListener("dispose",G);for(const I in g){const D=g[I],A=F.target.uuid;A in D&&(D[A].dispose(),delete D[A])}}}const NC={[Lp]:Op,[Pp]:Fp,[Bp]:Hp,[Uo]:Ip,[Op]:Lp,[Fp]:Pp,[Hp]:Bp,[Ip]:Uo};function UC(s,e){function i(){let X=!1;const It=new We;let dt=null;const xt=new We(0,0,0,0);return{setMask:function(Ft){dt!==Ft&&!X&&(s.colorMask(Ft,Ft,Ft,Ft),dt=Ft)},setLocked:function(Ft){X=Ft},setClear:function(Ft,Gt,ue,tn,En){En===!0&&(Ft*=tn,Gt*=tn,ue*=tn),It.set(Ft,Gt,ue,tn),xt.equals(It)===!1&&(s.clearColor(Ft,Gt,ue,tn),xt.copy(It))},reset:function(){X=!1,dt=null,xt.set(-1,0,0,0)}}}function r(){let X=!1,It=!1,dt=null,xt=null,Ft=null;return{setReversed:function(Gt){if(It!==Gt){const ue=e.get("EXT_clip_control");It?ue.clipControlEXT(ue.LOWER_LEFT_EXT,ue.ZERO_TO_ONE_EXT):ue.clipControlEXT(ue.LOWER_LEFT_EXT,ue.NEGATIVE_ONE_TO_ONE_EXT);const tn=Ft;Ft=null,this.setClear(tn)}It=Gt},getReversed:function(){return It},setTest:function(Gt){Gt?ht(s.DEPTH_TEST):Rt(s.DEPTH_TEST)},setMask:function(Gt){dt!==Gt&&!X&&(s.depthMask(Gt),dt=Gt)},setFunc:function(Gt){if(It&&(Gt=NC[Gt]),xt!==Gt){switch(Gt){case Lp:s.depthFunc(s.NEVER);break;case Op:s.depthFunc(s.ALWAYS);break;case Pp:s.depthFunc(s.LESS);break;case Uo:s.depthFunc(s.LEQUAL);break;case Bp:s.depthFunc(s.EQUAL);break;case Ip:s.depthFunc(s.GEQUAL);break;case Fp:s.depthFunc(s.GREATER);break;case Hp:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xt=Gt}},setLocked:function(Gt){X=Gt},setClear:function(Gt){Ft!==Gt&&(It&&(Gt=1-Gt),s.clearDepth(Gt),Ft=Gt)},reset:function(){X=!1,dt=null,xt=null,Ft=null,It=!1}}}function l(){let X=!1,It=null,dt=null,xt=null,Ft=null,Gt=null,ue=null,tn=null,En=null;return{setTest:function(Re){X||(Re?ht(s.STENCIL_TEST):Rt(s.STENCIL_TEST))},setMask:function(Re){It!==Re&&!X&&(s.stencilMask(Re),It=Re)},setFunc:function(Re,Qe,bn){(dt!==Re||xt!==Qe||Ft!==bn)&&(s.stencilFunc(Re,Qe,bn),dt=Re,xt=Qe,Ft=bn)},setOp:function(Re,Qe,bn){(Gt!==Re||ue!==Qe||tn!==bn)&&(s.stencilOp(Re,Qe,bn),Gt=Re,ue=Qe,tn=bn)},setLocked:function(Re){X=Re},setClear:function(Re){En!==Re&&(s.clearStencil(Re),En=Re)},reset:function(){X=!1,It=null,dt=null,xt=null,Ft=null,Gt=null,ue=null,tn=null,En=null}}}const u=new i,d=new r,h=new l,p=new WeakMap,g=new WeakMap;let _={},m={},S=new WeakMap,x=[],E=null,T=!1,M=null,y=null,U=null,O=null,N=null,G=null,F=null,z=new Se(0,0,0),I=0,D=!1,A=null,B=null,it=null,at=null,ft=null;const ct=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,st=0;const q=s.getParameter(s.VERSION);q.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec(q)[1]),V=st>=1):q.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),V=st>=2);let St=null,vt={};const At=s.getParameter(s.SCISSOR_BOX),Yt=s.getParameter(s.VIEWPORT),ie=new We().fromArray(At),R=new We().fromArray(Yt);function Y(X,It,dt,xt){const Ft=new Uint8Array(4),Gt=s.createTexture();s.bindTexture(X,Gt),s.texParameteri(X,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(X,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ue=0;ue<dt;ue++)X===s.TEXTURE_3D||X===s.TEXTURE_2D_ARRAY?s.texImage3D(It,0,s.RGBA,1,1,xt,0,s.RGBA,s.UNSIGNED_BYTE,Ft):s.texImage2D(It+ue,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ft);return Gt}const yt={};yt[s.TEXTURE_2D]=Y(s.TEXTURE_2D,s.TEXTURE_2D,1),yt[s.TEXTURE_CUBE_MAP]=Y(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),yt[s.TEXTURE_2D_ARRAY]=Y(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),yt[s.TEXTURE_3D]=Y(s.TEXTURE_3D,s.TEXTURE_3D,1,1),u.setClear(0,0,0,1),d.setClear(1),h.setClear(0),ht(s.DEPTH_TEST),d.setFunc(Uo),se(!1),Jt(ay),ht(s.CULL_FACE),H(Cr);function ht(X){_[X]!==!0&&(s.enable(X),_[X]=!0)}function Rt(X){_[X]!==!1&&(s.disable(X),_[X]=!1)}function Xt(X,It){return m[X]!==It?(s.bindFramebuffer(X,It),m[X]=It,X===s.DRAW_FRAMEBUFFER&&(m[s.FRAMEBUFFER]=It),X===s.FRAMEBUFFER&&(m[s.DRAW_FRAMEBUFFER]=It),!0):!1}function Ut(X,It){let dt=x,xt=!1;if(X){dt=S.get(It),dt===void 0&&(dt=[],S.set(It,dt));const Ft=X.textures;if(dt.length!==Ft.length||dt[0]!==s.COLOR_ATTACHMENT0){for(let Gt=0,ue=Ft.length;Gt<ue;Gt++)dt[Gt]=s.COLOR_ATTACHMENT0+Gt;dt.length=Ft.length,xt=!0}}else dt[0]!==s.BACK&&(dt[0]=s.BACK,xt=!0);xt&&s.drawBuffers(dt)}function Ct(X){return E!==X?(s.useProgram(X),E=X,!0):!1}const kt={[cs]:s.FUNC_ADD,[_1]:s.FUNC_SUBTRACT,[v1]:s.FUNC_REVERSE_SUBTRACT};kt[y1]=s.MIN,kt[S1]=s.MAX;const le={[x1]:s.ZERO,[M1]:s.ONE,[E1]:s.SRC_COLOR,[Up]:s.SRC_ALPHA,[C1]:s.SRC_ALPHA_SATURATE,[A1]:s.DST_COLOR,[T1]:s.DST_ALPHA,[b1]:s.ONE_MINUS_SRC_COLOR,[zp]:s.ONE_MINUS_SRC_ALPHA,[R1]:s.ONE_MINUS_DST_COLOR,[w1]:s.ONE_MINUS_DST_ALPHA,[D1]:s.CONSTANT_COLOR,[N1]:s.ONE_MINUS_CONSTANT_COLOR,[U1]:s.CONSTANT_ALPHA,[z1]:s.ONE_MINUS_CONSTANT_ALPHA};function H(X,It,dt,xt,Ft,Gt,ue,tn,En,Re){if(X===Cr){T===!0&&(Rt(s.BLEND),T=!1);return}if(T===!1&&(ht(s.BLEND),T=!0),X!==g1){if(X!==M||Re!==D){if((y!==cs||N!==cs)&&(s.blendEquation(s.FUNC_ADD),y=cs,N=cs),Re)switch(X){case Co:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ry:s.blendFunc(s.ONE,s.ONE);break;case sy:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case oy:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}else switch(X){case Co:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ry:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case sy:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case oy:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}U=null,O=null,G=null,F=null,z.set(0,0,0),I=0,M=X,D=Re}return}Ft=Ft||It,Gt=Gt||dt,ue=ue||xt,(It!==y||Ft!==N)&&(s.blendEquationSeparate(kt[It],kt[Ft]),y=It,N=Ft),(dt!==U||xt!==O||Gt!==G||ue!==F)&&(s.blendFuncSeparate(le[dt],le[xt],le[Gt],le[ue]),U=dt,O=xt,G=Gt,F=ue),(tn.equals(z)===!1||En!==I)&&(s.blendColor(tn.r,tn.g,tn.b,En),z.copy(tn),I=En),M=X,D=!1}function ln(X,It){X.side===Ba?Rt(s.CULL_FACE):ht(s.CULL_FACE);let dt=X.side===si;It&&(dt=!dt),se(dt),X.blending===Co&&X.transparent===!1?H(Cr):H(X.blending,X.blendEquation,X.blendSrc,X.blendDst,X.blendEquationAlpha,X.blendSrcAlpha,X.blendDstAlpha,X.blendColor,X.blendAlpha,X.premultipliedAlpha),d.setFunc(X.depthFunc),d.setTest(X.depthTest),d.setMask(X.depthWrite),u.setMask(X.colorWrite);const xt=X.stencilWrite;h.setTest(xt),xt&&(h.setMask(X.stencilWriteMask),h.setFunc(X.stencilFunc,X.stencilRef,X.stencilFuncMask),h.setOp(X.stencilFail,X.stencilZFail,X.stencilZPass)),bt(X.polygonOffset,X.polygonOffsetFactor,X.polygonOffsetUnits),X.alphaToCoverage===!0?ht(s.SAMPLE_ALPHA_TO_COVERAGE):Rt(s.SAMPLE_ALPHA_TO_COVERAGE)}function se(X){A!==X&&(X?s.frontFace(s.CW):s.frontFace(s.CCW),A=X)}function Jt(X){X!==d1?(ht(s.CULL_FACE),X!==B&&(X===ay?s.cullFace(s.BACK):X===p1?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Rt(s.CULL_FACE),B=X}function tt(X){X!==it&&(V&&s.lineWidth(X),it=X)}function bt(X,It,dt){X?(ht(s.POLYGON_OFFSET_FILL),(at!==It||ft!==dt)&&(s.polygonOffset(It,dt),at=It,ft=dt)):Rt(s.POLYGON_OFFSET_FILL)}function Et(X){X?ht(s.SCISSOR_TEST):Rt(s.SCISSOR_TEST)}function L(X){X===void 0&&(X=s.TEXTURE0+ct-1),St!==X&&(s.activeTexture(X),St=X)}function w(X,It,dt){dt===void 0&&(St===null?dt=s.TEXTURE0+ct-1:dt=St);let xt=vt[dt];xt===void 0&&(xt={type:void 0,texture:void 0},vt[dt]=xt),(xt.type!==X||xt.texture!==It)&&(St!==dt&&(s.activeTexture(dt),St=dt),s.bindTexture(X,It||yt[X]),xt.type=X,xt.texture=It)}function nt(){const X=vt[St];X!==void 0&&X.type!==void 0&&(s.bindTexture(X.type,null),X.type=void 0,X.texture=void 0)}function pt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Mt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function mt(){try{s.texSubImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Zt(){try{s.texSubImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Bt(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Ht(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function xe(){try{s.texStorage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function wt(){try{s.texStorage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Wt(){try{s.texImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function ee(){try{s.texImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function re(X){ie.equals(X)===!1&&(s.scissor(X.x,X.y,X.z,X.w),ie.copy(X))}function jt(X){R.equals(X)===!1&&(s.viewport(X.x,X.y,X.z,X.w),R.copy(X))}function ye(X,It){let dt=g.get(It);dt===void 0&&(dt=new WeakMap,g.set(It,dt));let xt=dt.get(X);xt===void 0&&(xt=s.getUniformBlockIndex(It,X.name),dt.set(X,xt))}function he(X,It){const xt=g.get(It).get(X);p.get(It)!==xt&&(s.uniformBlockBinding(It,xt,X.__bindingPointIndex),p.set(It,xt))}function He(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),d.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),_={},St=null,vt={},m={},S=new WeakMap,x=[],E=null,T=!1,M=null,y=null,U=null,O=null,N=null,G=null,F=null,z=new Se(0,0,0),I=0,D=!1,A=null,B=null,it=null,at=null,ft=null,ie.set(0,0,s.canvas.width,s.canvas.height),R.set(0,0,s.canvas.width,s.canvas.height),u.reset(),d.reset(),h.reset()}return{buffers:{color:u,depth:d,stencil:h},enable:ht,disable:Rt,bindFramebuffer:Xt,drawBuffers:Ut,useProgram:Ct,setBlending:H,setMaterial:ln,setFlipSided:se,setCullFace:Jt,setLineWidth:tt,setPolygonOffset:bt,setScissorTest:Et,activeTexture:L,bindTexture:w,unbindTexture:nt,compressedTexImage2D:pt,compressedTexImage3D:Mt,texImage2D:Wt,texImage3D:ee,updateUBOMapping:ye,uniformBlockBinding:he,texStorage2D:xe,texStorage3D:wt,texSubImage2D:mt,texSubImage3D:Zt,compressedTexSubImage2D:Bt,compressedTexSubImage3D:Ht,scissor:re,viewport:jt,reset:He}}function zC(s,e,i,r,l,u,d){const h=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new fe,_=new WeakMap;let m;const S=new WeakMap;let x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(L,w){return x?new OffscreenCanvas(L,w):of("canvas")}function T(L,w,nt){let pt=1;const Mt=Et(L);if((Mt.width>nt||Mt.height>nt)&&(pt=nt/Math.max(Mt.width,Mt.height)),pt<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const mt=Math.floor(pt*Mt.width),Zt=Math.floor(pt*Mt.height);m===void 0&&(m=E(mt,Zt));const Bt=w?E(mt,Zt):m;return Bt.width=mt,Bt.height=Zt,Bt.getContext("2d").drawImage(L,0,0,mt,Zt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Mt.width+"x"+Mt.height+") to ("+mt+"x"+Zt+")."),Bt}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Mt.width+"x"+Mt.height+")."),L;return L}function M(L){return L.generateMipmaps}function y(L){s.generateMipmap(L)}function U(L){return L.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?s.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function O(L,w,nt,pt,Mt=!1){if(L!==null){if(s[L]!==void 0)return s[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let mt=w;if(w===s.RED&&(nt===s.FLOAT&&(mt=s.R32F),nt===s.HALF_FLOAT&&(mt=s.R16F),nt===s.UNSIGNED_BYTE&&(mt=s.R8)),w===s.RED_INTEGER&&(nt===s.UNSIGNED_BYTE&&(mt=s.R8UI),nt===s.UNSIGNED_SHORT&&(mt=s.R16UI),nt===s.UNSIGNED_INT&&(mt=s.R32UI),nt===s.BYTE&&(mt=s.R8I),nt===s.SHORT&&(mt=s.R16I),nt===s.INT&&(mt=s.R32I)),w===s.RG&&(nt===s.FLOAT&&(mt=s.RG32F),nt===s.HALF_FLOAT&&(mt=s.RG16F),nt===s.UNSIGNED_BYTE&&(mt=s.RG8)),w===s.RG_INTEGER&&(nt===s.UNSIGNED_BYTE&&(mt=s.RG8UI),nt===s.UNSIGNED_SHORT&&(mt=s.RG16UI),nt===s.UNSIGNED_INT&&(mt=s.RG32UI),nt===s.BYTE&&(mt=s.RG8I),nt===s.SHORT&&(mt=s.RG16I),nt===s.INT&&(mt=s.RG32I)),w===s.RGB_INTEGER&&(nt===s.UNSIGNED_BYTE&&(mt=s.RGB8UI),nt===s.UNSIGNED_SHORT&&(mt=s.RGB16UI),nt===s.UNSIGNED_INT&&(mt=s.RGB32UI),nt===s.BYTE&&(mt=s.RGB8I),nt===s.SHORT&&(mt=s.RGB16I),nt===s.INT&&(mt=s.RGB32I)),w===s.RGBA_INTEGER&&(nt===s.UNSIGNED_BYTE&&(mt=s.RGBA8UI),nt===s.UNSIGNED_SHORT&&(mt=s.RGBA16UI),nt===s.UNSIGNED_INT&&(mt=s.RGBA32UI),nt===s.BYTE&&(mt=s.RGBA8I),nt===s.SHORT&&(mt=s.RGBA16I),nt===s.INT&&(mt=s.RGBA32I)),w===s.RGB&&nt===s.UNSIGNED_INT_5_9_9_9_REV&&(mt=s.RGB9_E5),w===s.RGBA){const Zt=Mt?rf:ze.getTransfer(pt);nt===s.FLOAT&&(mt=s.RGBA32F),nt===s.HALF_FLOAT&&(mt=s.RGBA16F),nt===s.UNSIGNED_BYTE&&(mt=Zt===Ge?s.SRGB8_ALPHA8:s.RGBA8),nt===s.UNSIGNED_SHORT_4_4_4_4&&(mt=s.RGBA4),nt===s.UNSIGNED_SHORT_5_5_5_1&&(mt=s.RGB5_A1)}return(mt===s.R16F||mt===s.R32F||mt===s.RG16F||mt===s.RG32F||mt===s.RGBA16F||mt===s.RGBA32F)&&e.get("EXT_color_buffer_float"),mt}function N(L,w){let nt;return L?w===null||w===ps||w===Oo?nt=s.DEPTH24_STENCIL8:w===Ia?nt=s.DEPTH32F_STENCIL8:w===Jl&&(nt=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===ps||w===Oo?nt=s.DEPTH_COMPONENT24:w===Ia?nt=s.DEPTH_COMPONENT32F:w===Jl&&(nt=s.DEPTH_COMPONENT16),nt}function G(L,w){return M(L)===!0||L.isFramebufferTexture&&L.minFilter!==Wi&&L.minFilter!==ua?Math.log2(Math.max(w.width,w.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?w.mipmaps.length:1}function F(L){const w=L.target;w.removeEventListener("dispose",F),I(w),w.isVideoTexture&&_.delete(w)}function z(L){const w=L.target;w.removeEventListener("dispose",z),A(w)}function I(L){const w=r.get(L);if(w.__webglInit===void 0)return;const nt=L.source,pt=S.get(nt);if(pt){const Mt=pt[w.__cacheKey];Mt.usedTimes--,Mt.usedTimes===0&&D(L),Object.keys(pt).length===0&&S.delete(nt)}r.remove(L)}function D(L){const w=r.get(L);s.deleteTexture(w.__webglTexture);const nt=L.source,pt=S.get(nt);delete pt[w.__cacheKey],d.memory.textures--}function A(L){const w=r.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),r.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let pt=0;pt<6;pt++){if(Array.isArray(w.__webglFramebuffer[pt]))for(let Mt=0;Mt<w.__webglFramebuffer[pt].length;Mt++)s.deleteFramebuffer(w.__webglFramebuffer[pt][Mt]);else s.deleteFramebuffer(w.__webglFramebuffer[pt]);w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer[pt])}else{if(Array.isArray(w.__webglFramebuffer))for(let pt=0;pt<w.__webglFramebuffer.length;pt++)s.deleteFramebuffer(w.__webglFramebuffer[pt]);else s.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&s.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let pt=0;pt<w.__webglColorRenderbuffer.length;pt++)w.__webglColorRenderbuffer[pt]&&s.deleteRenderbuffer(w.__webglColorRenderbuffer[pt]);w.__webglDepthRenderbuffer&&s.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const nt=L.textures;for(let pt=0,Mt=nt.length;pt<Mt;pt++){const mt=r.get(nt[pt]);mt.__webglTexture&&(s.deleteTexture(mt.__webglTexture),d.memory.textures--),r.remove(nt[pt])}r.remove(L)}let B=0;function it(){B=0}function at(){const L=B;return L>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+l.maxTextures),B+=1,L}function ft(L){const w=[];return w.push(L.wrapS),w.push(L.wrapT),w.push(L.wrapR||0),w.push(L.magFilter),w.push(L.minFilter),w.push(L.anisotropy),w.push(L.internalFormat),w.push(L.format),w.push(L.type),w.push(L.generateMipmaps),w.push(L.premultiplyAlpha),w.push(L.flipY),w.push(L.unpackAlignment),w.push(L.colorSpace),w.join()}function ct(L,w){const nt=r.get(L);if(L.isVideoTexture&&tt(L),L.isRenderTargetTexture===!1&&L.version>0&&nt.__version!==L.version){const pt=L.image;if(pt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(pt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{R(nt,L,w);return}}i.bindTexture(s.TEXTURE_2D,nt.__webglTexture,s.TEXTURE0+w)}function V(L,w){const nt=r.get(L);if(L.version>0&&nt.__version!==L.version){R(nt,L,w);return}i.bindTexture(s.TEXTURE_2D_ARRAY,nt.__webglTexture,s.TEXTURE0+w)}function st(L,w){const nt=r.get(L);if(L.version>0&&nt.__version!==L.version){R(nt,L,w);return}i.bindTexture(s.TEXTURE_3D,nt.__webglTexture,s.TEXTURE0+w)}function q(L,w){const nt=r.get(L);if(L.version>0&&nt.__version!==L.version){Y(nt,L,w);return}i.bindTexture(s.TEXTURE_CUBE_MAP,nt.__webglTexture,s.TEXTURE0+w)}const St={[Vp]:s.REPEAT,[fs]:s.CLAMP_TO_EDGE,[jp]:s.MIRRORED_REPEAT},vt={[Wi]:s.NEAREST,[V1]:s.NEAREST_MIPMAP_NEAREST,[bu]:s.NEAREST_MIPMAP_LINEAR,[ua]:s.LINEAR,[qd]:s.LINEAR_MIPMAP_NEAREST,[hs]:s.LINEAR_MIPMAP_LINEAR},At={[W1]:s.NEVER,[$1]:s.ALWAYS,[q1]:s.LESS,[jS]:s.LEQUAL,[Z1]:s.EQUAL,[J1]:s.GEQUAL,[K1]:s.GREATER,[Q1]:s.NOTEQUAL};function Yt(L,w){if(w.type===Ia&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===ua||w.magFilter===qd||w.magFilter===bu||w.magFilter===hs||w.minFilter===ua||w.minFilter===qd||w.minFilter===bu||w.minFilter===hs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(L,s.TEXTURE_WRAP_S,St[w.wrapS]),s.texParameteri(L,s.TEXTURE_WRAP_T,St[w.wrapT]),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,St[w.wrapR]),s.texParameteri(L,s.TEXTURE_MAG_FILTER,vt[w.magFilter]),s.texParameteri(L,s.TEXTURE_MIN_FILTER,vt[w.minFilter]),w.compareFunction&&(s.texParameteri(L,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(L,s.TEXTURE_COMPARE_FUNC,At[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Wi||w.minFilter!==bu&&w.minFilter!==hs||w.type===Ia&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||r.get(w).__currentAnisotropy){const nt=e.get("EXT_texture_filter_anisotropic");s.texParameterf(L,nt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,l.getMaxAnisotropy())),r.get(w).__currentAnisotropy=w.anisotropy}}}function ie(L,w){let nt=!1;L.__webglInit===void 0&&(L.__webglInit=!0,w.addEventListener("dispose",F));const pt=w.source;let Mt=S.get(pt);Mt===void 0&&(Mt={},S.set(pt,Mt));const mt=ft(w);if(mt!==L.__cacheKey){Mt[mt]===void 0&&(Mt[mt]={texture:s.createTexture(),usedTimes:0},d.memory.textures++,nt=!0),Mt[mt].usedTimes++;const Zt=Mt[L.__cacheKey];Zt!==void 0&&(Mt[L.__cacheKey].usedTimes--,Zt.usedTimes===0&&D(w)),L.__cacheKey=mt,L.__webglTexture=Mt[mt].texture}return nt}function R(L,w,nt){let pt=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(pt=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(pt=s.TEXTURE_3D);const Mt=ie(L,w),mt=w.source;i.bindTexture(pt,L.__webglTexture,s.TEXTURE0+nt);const Zt=r.get(mt);if(mt.version!==Zt.__version||Mt===!0){i.activeTexture(s.TEXTURE0+nt);const Bt=ze.getPrimaries(ze.workingColorSpace),Ht=w.colorSpace===Ar?null:ze.getPrimaries(w.colorSpace),xe=w.colorSpace===Ar||Bt===Ht?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);let wt=T(w.image,!1,l.maxTextureSize);wt=bt(w,wt);const Wt=u.convert(w.format,w.colorSpace),ee=u.convert(w.type);let re=O(w.internalFormat,Wt,ee,w.colorSpace,w.isVideoTexture);Yt(pt,w);let jt;const ye=w.mipmaps,he=w.isVideoTexture!==!0,He=Zt.__version===void 0||Mt===!0,X=mt.dataReady,It=G(w,wt);if(w.isDepthTexture)re=N(w.format===Po,w.type),He&&(he?i.texStorage2D(s.TEXTURE_2D,1,re,wt.width,wt.height):i.texImage2D(s.TEXTURE_2D,0,re,wt.width,wt.height,0,Wt,ee,null));else if(w.isDataTexture)if(ye.length>0){he&&He&&i.texStorage2D(s.TEXTURE_2D,It,re,ye[0].width,ye[0].height);for(let dt=0,xt=ye.length;dt<xt;dt++)jt=ye[dt],he?X&&i.texSubImage2D(s.TEXTURE_2D,dt,0,0,jt.width,jt.height,Wt,ee,jt.data):i.texImage2D(s.TEXTURE_2D,dt,re,jt.width,jt.height,0,Wt,ee,jt.data);w.generateMipmaps=!1}else he?(He&&i.texStorage2D(s.TEXTURE_2D,It,re,wt.width,wt.height),X&&i.texSubImage2D(s.TEXTURE_2D,0,0,0,wt.width,wt.height,Wt,ee,wt.data)):i.texImage2D(s.TEXTURE_2D,0,re,wt.width,wt.height,0,Wt,ee,wt.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){he&&He&&i.texStorage3D(s.TEXTURE_2D_ARRAY,It,re,ye[0].width,ye[0].height,wt.depth);for(let dt=0,xt=ye.length;dt<xt;dt++)if(jt=ye[dt],w.format!==Yi)if(Wt!==null)if(he){if(X)if(w.layerUpdates.size>0){const Ft=Iy(jt.width,jt.height,w.format,w.type);for(const Gt of w.layerUpdates){const ue=jt.data.subarray(Gt*Ft/jt.data.BYTES_PER_ELEMENT,(Gt+1)*Ft/jt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,dt,0,0,Gt,jt.width,jt.height,1,Wt,ue)}w.clearLayerUpdates()}else i.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,dt,0,0,0,jt.width,jt.height,wt.depth,Wt,jt.data)}else i.compressedTexImage3D(s.TEXTURE_2D_ARRAY,dt,re,jt.width,jt.height,wt.depth,0,jt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else he?X&&i.texSubImage3D(s.TEXTURE_2D_ARRAY,dt,0,0,0,jt.width,jt.height,wt.depth,Wt,ee,jt.data):i.texImage3D(s.TEXTURE_2D_ARRAY,dt,re,jt.width,jt.height,wt.depth,0,Wt,ee,jt.data)}else{he&&He&&i.texStorage2D(s.TEXTURE_2D,It,re,ye[0].width,ye[0].height);for(let dt=0,xt=ye.length;dt<xt;dt++)jt=ye[dt],w.format!==Yi?Wt!==null?he?X&&i.compressedTexSubImage2D(s.TEXTURE_2D,dt,0,0,jt.width,jt.height,Wt,jt.data):i.compressedTexImage2D(s.TEXTURE_2D,dt,re,jt.width,jt.height,0,jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):he?X&&i.texSubImage2D(s.TEXTURE_2D,dt,0,0,jt.width,jt.height,Wt,ee,jt.data):i.texImage2D(s.TEXTURE_2D,dt,re,jt.width,jt.height,0,Wt,ee,jt.data)}else if(w.isDataArrayTexture)if(he){if(He&&i.texStorage3D(s.TEXTURE_2D_ARRAY,It,re,wt.width,wt.height,wt.depth),X)if(w.layerUpdates.size>0){const dt=Iy(wt.width,wt.height,w.format,w.type);for(const xt of w.layerUpdates){const Ft=wt.data.subarray(xt*dt/wt.data.BYTES_PER_ELEMENT,(xt+1)*dt/wt.data.BYTES_PER_ELEMENT);i.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,xt,wt.width,wt.height,1,Wt,ee,Ft)}w.clearLayerUpdates()}else i.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,wt.width,wt.height,wt.depth,Wt,ee,wt.data)}else i.texImage3D(s.TEXTURE_2D_ARRAY,0,re,wt.width,wt.height,wt.depth,0,Wt,ee,wt.data);else if(w.isData3DTexture)he?(He&&i.texStorage3D(s.TEXTURE_3D,It,re,wt.width,wt.height,wt.depth),X&&i.texSubImage3D(s.TEXTURE_3D,0,0,0,0,wt.width,wt.height,wt.depth,Wt,ee,wt.data)):i.texImage3D(s.TEXTURE_3D,0,re,wt.width,wt.height,wt.depth,0,Wt,ee,wt.data);else if(w.isFramebufferTexture){if(He)if(he)i.texStorage2D(s.TEXTURE_2D,It,re,wt.width,wt.height);else{let dt=wt.width,xt=wt.height;for(let Ft=0;Ft<It;Ft++)i.texImage2D(s.TEXTURE_2D,Ft,re,dt,xt,0,Wt,ee,null),dt>>=1,xt>>=1}}else if(ye.length>0){if(he&&He){const dt=Et(ye[0]);i.texStorage2D(s.TEXTURE_2D,It,re,dt.width,dt.height)}for(let dt=0,xt=ye.length;dt<xt;dt++)jt=ye[dt],he?X&&i.texSubImage2D(s.TEXTURE_2D,dt,0,0,Wt,ee,jt):i.texImage2D(s.TEXTURE_2D,dt,re,Wt,ee,jt);w.generateMipmaps=!1}else if(he){if(He){const dt=Et(wt);i.texStorage2D(s.TEXTURE_2D,It,re,dt.width,dt.height)}X&&i.texSubImage2D(s.TEXTURE_2D,0,0,0,Wt,ee,wt)}else i.texImage2D(s.TEXTURE_2D,0,re,Wt,ee,wt);M(w)&&y(pt),Zt.__version=mt.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function Y(L,w,nt){if(w.image.length!==6)return;const pt=ie(L,w),Mt=w.source;i.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+nt);const mt=r.get(Mt);if(Mt.version!==mt.__version||pt===!0){i.activeTexture(s.TEXTURE0+nt);const Zt=ze.getPrimaries(ze.workingColorSpace),Bt=w.colorSpace===Ar?null:ze.getPrimaries(w.colorSpace),Ht=w.colorSpace===Ar||Zt===Bt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);const xe=w.isCompressedTexture||w.image[0].isCompressedTexture,wt=w.image[0]&&w.image[0].isDataTexture,Wt=[];for(let xt=0;xt<6;xt++)!xe&&!wt?Wt[xt]=T(w.image[xt],!0,l.maxCubemapSize):Wt[xt]=wt?w.image[xt].image:w.image[xt],Wt[xt]=bt(w,Wt[xt]);const ee=Wt[0],re=u.convert(w.format,w.colorSpace),jt=u.convert(w.type),ye=O(w.internalFormat,re,jt,w.colorSpace),he=w.isVideoTexture!==!0,He=mt.__version===void 0||pt===!0,X=Mt.dataReady;let It=G(w,ee);Yt(s.TEXTURE_CUBE_MAP,w);let dt;if(xe){he&&He&&i.texStorage2D(s.TEXTURE_CUBE_MAP,It,ye,ee.width,ee.height);for(let xt=0;xt<6;xt++){dt=Wt[xt].mipmaps;for(let Ft=0;Ft<dt.length;Ft++){const Gt=dt[Ft];w.format!==Yi?re!==null?he?X&&i.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ft,0,0,Gt.width,Gt.height,re,Gt.data):i.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ft,ye,Gt.width,Gt.height,0,Gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):he?X&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ft,0,0,Gt.width,Gt.height,re,jt,Gt.data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ft,ye,Gt.width,Gt.height,0,re,jt,Gt.data)}}}else{if(dt=w.mipmaps,he&&He){dt.length>0&&It++;const xt=Et(Wt[0]);i.texStorage2D(s.TEXTURE_CUBE_MAP,It,ye,xt.width,xt.height)}for(let xt=0;xt<6;xt++)if(wt){he?X&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,Wt[xt].width,Wt[xt].height,re,jt,Wt[xt].data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,ye,Wt[xt].width,Wt[xt].height,0,re,jt,Wt[xt].data);for(let Ft=0;Ft<dt.length;Ft++){const ue=dt[Ft].image[xt].image;he?X&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ft+1,0,0,ue.width,ue.height,re,jt,ue.data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ft+1,ye,ue.width,ue.height,0,re,jt,ue.data)}}else{he?X&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,re,jt,Wt[xt]):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,ye,re,jt,Wt[xt]);for(let Ft=0;Ft<dt.length;Ft++){const Gt=dt[Ft];he?X&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ft+1,0,0,re,jt,Gt.image[xt]):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ft+1,ye,re,jt,Gt.image[xt])}}}M(w)&&y(s.TEXTURE_CUBE_MAP),mt.__version=Mt.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function yt(L,w,nt,pt,Mt,mt){const Zt=u.convert(nt.format,nt.colorSpace),Bt=u.convert(nt.type),Ht=O(nt.internalFormat,Zt,Bt,nt.colorSpace),xe=r.get(w),wt=r.get(nt);if(wt.__renderTarget=w,!xe.__hasExternalTextures){const Wt=Math.max(1,w.width>>mt),ee=Math.max(1,w.height>>mt);Mt===s.TEXTURE_3D||Mt===s.TEXTURE_2D_ARRAY?i.texImage3D(Mt,mt,Ht,Wt,ee,w.depth,0,Zt,Bt,null):i.texImage2D(Mt,mt,Ht,Wt,ee,0,Zt,Bt,null)}i.bindFramebuffer(s.FRAMEBUFFER,L),Jt(w)?h.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,pt,Mt,wt.__webglTexture,0,se(w)):(Mt===s.TEXTURE_2D||Mt>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Mt<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,pt,Mt,wt.__webglTexture,mt),i.bindFramebuffer(s.FRAMEBUFFER,null)}function ht(L,w,nt){if(s.bindRenderbuffer(s.RENDERBUFFER,L),w.depthBuffer){const pt=w.depthTexture,Mt=pt&&pt.isDepthTexture?pt.type:null,mt=N(w.stencilBuffer,Mt),Zt=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Bt=se(w);Jt(w)?h.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Bt,mt,w.width,w.height):nt?s.renderbufferStorageMultisample(s.RENDERBUFFER,Bt,mt,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,mt,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Zt,s.RENDERBUFFER,L)}else{const pt=w.textures;for(let Mt=0;Mt<pt.length;Mt++){const mt=pt[Mt],Zt=u.convert(mt.format,mt.colorSpace),Bt=u.convert(mt.type),Ht=O(mt.internalFormat,Zt,Bt,mt.colorSpace),xe=se(w);nt&&Jt(w)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,xe,Ht,w.width,w.height):Jt(w)?h.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,xe,Ht,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,Ht,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Rt(L,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(s.FRAMEBUFFER,L),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const pt=r.get(w.depthTexture);pt.__renderTarget=w,(!pt.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),ct(w.depthTexture,0);const Mt=pt.__webglTexture,mt=se(w);if(w.depthTexture.format===Do)Jt(w)?h.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Mt,0,mt):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Mt,0);else if(w.depthTexture.format===Po)Jt(w)?h.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Mt,0,mt):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Mt,0);else throw new Error("Unknown depthTexture format")}function Xt(L){const w=r.get(L),nt=L.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==L.depthTexture){const pt=L.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),pt){const Mt=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,pt.removeEventListener("dispose",Mt)};pt.addEventListener("dispose",Mt),w.__depthDisposeCallback=Mt}w.__boundDepthTexture=pt}if(L.depthTexture&&!w.__autoAllocateDepthBuffer){if(nt)throw new Error("target.depthTexture not supported in Cube render targets");Rt(w.__webglFramebuffer,L)}else if(nt){w.__webglDepthbuffer=[];for(let pt=0;pt<6;pt++)if(i.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[pt]),w.__webglDepthbuffer[pt]===void 0)w.__webglDepthbuffer[pt]=s.createRenderbuffer(),ht(w.__webglDepthbuffer[pt],L,!1);else{const Mt=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,mt=w.__webglDepthbuffer[pt];s.bindRenderbuffer(s.RENDERBUFFER,mt),s.framebufferRenderbuffer(s.FRAMEBUFFER,Mt,s.RENDERBUFFER,mt)}}else if(i.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=s.createRenderbuffer(),ht(w.__webglDepthbuffer,L,!1);else{const pt=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Mt=w.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Mt),s.framebufferRenderbuffer(s.FRAMEBUFFER,pt,s.RENDERBUFFER,Mt)}i.bindFramebuffer(s.FRAMEBUFFER,null)}function Ut(L,w,nt){const pt=r.get(L);w!==void 0&&yt(pt.__webglFramebuffer,L,L.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),nt!==void 0&&Xt(L)}function Ct(L){const w=L.texture,nt=r.get(L),pt=r.get(w);L.addEventListener("dispose",z);const Mt=L.textures,mt=L.isWebGLCubeRenderTarget===!0,Zt=Mt.length>1;if(Zt||(pt.__webglTexture===void 0&&(pt.__webglTexture=s.createTexture()),pt.__version=w.version,d.memory.textures++),mt){nt.__webglFramebuffer=[];for(let Bt=0;Bt<6;Bt++)if(w.mipmaps&&w.mipmaps.length>0){nt.__webglFramebuffer[Bt]=[];for(let Ht=0;Ht<w.mipmaps.length;Ht++)nt.__webglFramebuffer[Bt][Ht]=s.createFramebuffer()}else nt.__webglFramebuffer[Bt]=s.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){nt.__webglFramebuffer=[];for(let Bt=0;Bt<w.mipmaps.length;Bt++)nt.__webglFramebuffer[Bt]=s.createFramebuffer()}else nt.__webglFramebuffer=s.createFramebuffer();if(Zt)for(let Bt=0,Ht=Mt.length;Bt<Ht;Bt++){const xe=r.get(Mt[Bt]);xe.__webglTexture===void 0&&(xe.__webglTexture=s.createTexture(),d.memory.textures++)}if(L.samples>0&&Jt(L)===!1){nt.__webglMultisampledFramebuffer=s.createFramebuffer(),nt.__webglColorRenderbuffer=[],i.bindFramebuffer(s.FRAMEBUFFER,nt.__webglMultisampledFramebuffer);for(let Bt=0;Bt<Mt.length;Bt++){const Ht=Mt[Bt];nt.__webglColorRenderbuffer[Bt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,nt.__webglColorRenderbuffer[Bt]);const xe=u.convert(Ht.format,Ht.colorSpace),wt=u.convert(Ht.type),Wt=O(Ht.internalFormat,xe,wt,Ht.colorSpace,L.isXRRenderTarget===!0),ee=se(L);s.renderbufferStorageMultisample(s.RENDERBUFFER,ee,Wt,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Bt,s.RENDERBUFFER,nt.__webglColorRenderbuffer[Bt])}s.bindRenderbuffer(s.RENDERBUFFER,null),L.depthBuffer&&(nt.__webglDepthRenderbuffer=s.createRenderbuffer(),ht(nt.__webglDepthRenderbuffer,L,!0)),i.bindFramebuffer(s.FRAMEBUFFER,null)}}if(mt){i.bindTexture(s.TEXTURE_CUBE_MAP,pt.__webglTexture),Yt(s.TEXTURE_CUBE_MAP,w);for(let Bt=0;Bt<6;Bt++)if(w.mipmaps&&w.mipmaps.length>0)for(let Ht=0;Ht<w.mipmaps.length;Ht++)yt(nt.__webglFramebuffer[Bt][Ht],L,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Bt,Ht);else yt(nt.__webglFramebuffer[Bt],L,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Bt,0);M(w)&&y(s.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Zt){for(let Bt=0,Ht=Mt.length;Bt<Ht;Bt++){const xe=Mt[Bt],wt=r.get(xe);i.bindTexture(s.TEXTURE_2D,wt.__webglTexture),Yt(s.TEXTURE_2D,xe),yt(nt.__webglFramebuffer,L,xe,s.COLOR_ATTACHMENT0+Bt,s.TEXTURE_2D,0),M(xe)&&y(s.TEXTURE_2D)}i.unbindTexture()}else{let Bt=s.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Bt=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),i.bindTexture(Bt,pt.__webglTexture),Yt(Bt,w),w.mipmaps&&w.mipmaps.length>0)for(let Ht=0;Ht<w.mipmaps.length;Ht++)yt(nt.__webglFramebuffer[Ht],L,w,s.COLOR_ATTACHMENT0,Bt,Ht);else yt(nt.__webglFramebuffer,L,w,s.COLOR_ATTACHMENT0,Bt,0);M(w)&&y(Bt),i.unbindTexture()}L.depthBuffer&&Xt(L)}function kt(L){const w=L.textures;for(let nt=0,pt=w.length;nt<pt;nt++){const Mt=w[nt];if(M(Mt)){const mt=U(L),Zt=r.get(Mt).__webglTexture;i.bindTexture(mt,Zt),y(mt),i.unbindTexture()}}}const le=[],H=[];function ln(L){if(L.samples>0){if(Jt(L)===!1){const w=L.textures,nt=L.width,pt=L.height;let Mt=s.COLOR_BUFFER_BIT;const mt=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Zt=r.get(L),Bt=w.length>1;if(Bt)for(let Ht=0;Ht<w.length;Ht++)i.bindFramebuffer(s.FRAMEBUFFER,Zt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ht,s.RENDERBUFFER,null),i.bindFramebuffer(s.FRAMEBUFFER,Zt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ht,s.TEXTURE_2D,null,0);i.bindFramebuffer(s.READ_FRAMEBUFFER,Zt.__webglMultisampledFramebuffer),i.bindFramebuffer(s.DRAW_FRAMEBUFFER,Zt.__webglFramebuffer);for(let Ht=0;Ht<w.length;Ht++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(Mt|=s.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(Mt|=s.STENCIL_BUFFER_BIT)),Bt){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Zt.__webglColorRenderbuffer[Ht]);const xe=r.get(w[Ht]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,xe,0)}s.blitFramebuffer(0,0,nt,pt,0,0,nt,pt,Mt,s.NEAREST),p===!0&&(le.length=0,H.length=0,le.push(s.COLOR_ATTACHMENT0+Ht),L.depthBuffer&&L.resolveDepthBuffer===!1&&(le.push(mt),H.push(mt),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,H)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,le))}if(i.bindFramebuffer(s.READ_FRAMEBUFFER,null),i.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Bt)for(let Ht=0;Ht<w.length;Ht++){i.bindFramebuffer(s.FRAMEBUFFER,Zt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ht,s.RENDERBUFFER,Zt.__webglColorRenderbuffer[Ht]);const xe=r.get(w[Ht]).__webglTexture;i.bindFramebuffer(s.FRAMEBUFFER,Zt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ht,s.TEXTURE_2D,xe,0)}i.bindFramebuffer(s.DRAW_FRAMEBUFFER,Zt.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&p){const w=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[w])}}}function se(L){return Math.min(l.maxSamples,L.samples)}function Jt(L){const w=r.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function tt(L){const w=d.render.frame;_.get(L)!==w&&(_.set(L,w),L.update())}function bt(L,w){const nt=L.colorSpace,pt=L.format,Mt=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||nt!==Bo&&nt!==Ar&&(ze.getTransfer(nt)===Ge?(pt!==Yi||Mt!==Ga)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",nt)),w}function Et(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(g.width=L.naturalWidth||L.width,g.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(g.width=L.displayWidth,g.height=L.displayHeight):(g.width=L.width,g.height=L.height),g}this.allocateTextureUnit=at,this.resetTextureUnits=it,this.setTexture2D=ct,this.setTexture2DArray=V,this.setTexture3D=st,this.setTextureCube=q,this.rebindTextures=Ut,this.setupRenderTarget=Ct,this.updateRenderTargetMipmap=kt,this.updateMultisampleRenderTarget=ln,this.setupDepthRenderbuffer=Xt,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=Jt}function LC(s,e){function i(r,l=Ar){let u;const d=ze.getTransfer(l);if(r===Ga)return s.UNSIGNED_BYTE;if(r===Tm)return s.UNSIGNED_SHORT_4_4_4_4;if(r===wm)return s.UNSIGNED_SHORT_5_5_5_1;if(r===OS)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===zS)return s.BYTE;if(r===LS)return s.SHORT;if(r===Jl)return s.UNSIGNED_SHORT;if(r===bm)return s.INT;if(r===ps)return s.UNSIGNED_INT;if(r===Ia)return s.FLOAT;if(r===tc)return s.HALF_FLOAT;if(r===PS)return s.ALPHA;if(r===BS)return s.RGB;if(r===Yi)return s.RGBA;if(r===IS)return s.LUMINANCE;if(r===FS)return s.LUMINANCE_ALPHA;if(r===Do)return s.DEPTH_COMPONENT;if(r===Po)return s.DEPTH_STENCIL;if(r===HS)return s.RED;if(r===Am)return s.RED_INTEGER;if(r===kS)return s.RG;if(r===Rm)return s.RG_INTEGER;if(r===Cm)return s.RGBA_INTEGER;if(r===Ju||r===$u||r===tf||r===ef)if(d===Ge)if(u=e.get("WEBGL_compressed_texture_s3tc_srgb"),u!==null){if(r===Ju)return u.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===$u)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===tf)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ef)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(u=e.get("WEBGL_compressed_texture_s3tc"),u!==null){if(r===Ju)return u.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===$u)return u.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===tf)return u.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ef)return u.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Xp||r===Yp||r===Wp||r===qp)if(u=e.get("WEBGL_compressed_texture_pvrtc"),u!==null){if(r===Xp)return u.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Yp)return u.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Wp)return u.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===qp)return u.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Zp||r===Kp||r===Qp)if(u=e.get("WEBGL_compressed_texture_etc"),u!==null){if(r===Zp||r===Kp)return d===Ge?u.COMPRESSED_SRGB8_ETC2:u.COMPRESSED_RGB8_ETC2;if(r===Qp)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:u.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Jp||r===$p||r===tm||r===em||r===nm||r===im||r===am||r===rm||r===sm||r===om||r===lm||r===cm||r===um||r===fm)if(u=e.get("WEBGL_compressed_texture_astc"),u!==null){if(r===Jp)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:u.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===$p)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:u.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===tm)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:u.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===em)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:u.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===nm)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:u.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===im)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:u.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===am)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:u.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===rm)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:u.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===sm)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:u.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===om)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:u.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===lm)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:u.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===cm)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:u.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===um)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:u.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===fm)return d===Ge?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:u.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===nf||r===hm||r===dm)if(u=e.get("EXT_texture_compression_bptc"),u!==null){if(r===nf)return d===Ge?u.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:u.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===hm)return u.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===dm)return u.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===GS||r===pm||r===mm||r===gm)if(u=e.get("EXT_texture_compression_rgtc"),u!==null){if(r===nf)return u.COMPRESSED_RED_RGTC1_EXT;if(r===pm)return u.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===mm)return u.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===gm)return u.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Oo?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:i}}const OC=`
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

}`;class BC{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i,r){if(this.texture===null){const l=new oi,u=e.properties.get(l);u.__webglTexture=i.texture,(i.depthNear!==r.depthNear||i.depthFar!==r.depthFar)&&(this.depthNear=i.depthNear,this.depthFar=i.depthFar),this.texture=l}}getMesh(e){if(this.texture!==null&&this.mesh===null){const i=e.cameras[0].viewport,r=new Va({vertexShader:OC,fragmentShader:PC,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new yi(new hf(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class IC extends vs{constructor(e,i){super();const r=this;let l=null,u=1,d=null,h="local-floor",p=1,g=null,_=null,m=null,S=null,x=null,E=null;const T=new BC,M=i.getContextAttributes();let y=null,U=null;const O=[],N=[],G=new fe;let F=null;const z=new Li;z.viewport=new We;const I=new Li;I.viewport=new We;const D=[z,I],A=new nw;let B=null,it=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(R){let Y=O[R];return Y===void 0&&(Y=new pp,O[R]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(R){let Y=O[R];return Y===void 0&&(Y=new pp,O[R]=Y),Y.getGripSpace()},this.getHand=function(R){let Y=O[R];return Y===void 0&&(Y=new pp,O[R]=Y),Y.getHandSpace()};function at(R){const Y=N.indexOf(R.inputSource);if(Y===-1)return;const yt=O[Y];yt!==void 0&&(yt.update(R.inputSource,R.frame,g||d),yt.dispatchEvent({type:R.type,data:R.inputSource}))}function ft(){l.removeEventListener("select",at),l.removeEventListener("selectstart",at),l.removeEventListener("selectend",at),l.removeEventListener("squeeze",at),l.removeEventListener("squeezestart",at),l.removeEventListener("squeezeend",at),l.removeEventListener("end",ft),l.removeEventListener("inputsourceschange",ct);for(let R=0;R<O.length;R++){const Y=N[R];Y!==null&&(N[R]=null,O[R].disconnect(Y))}B=null,it=null,T.reset(),e.setRenderTarget(y),x=null,S=null,m=null,l=null,U=null,ie.stop(),r.isPresenting=!1,e.setPixelRatio(F),e.setSize(G.width,G.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(R){u=R,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(R){h=R,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return g||d},this.setReferenceSpace=function(R){g=R},this.getBaseLayer=function(){return S!==null?S:x},this.getBinding=function(){return m},this.getFrame=function(){return E},this.getSession=function(){return l},this.setSession=async function(R){if(l=R,l!==null){if(y=e.getRenderTarget(),l.addEventListener("select",at),l.addEventListener("selectstart",at),l.addEventListener("selectend",at),l.addEventListener("squeeze",at),l.addEventListener("squeezestart",at),l.addEventListener("squeezeend",at),l.addEventListener("end",ft),l.addEventListener("inputsourceschange",ct),M.xrCompatible!==!0&&await i.makeXRCompatible(),F=e.getPixelRatio(),e.getSize(G),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let yt=null,ht=null,Rt=null;M.depth&&(Rt=M.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,yt=M.stencil?Po:Do,ht=M.stencil?Oo:ps);const Xt={colorFormat:i.RGBA8,depthFormat:Rt,scaleFactor:u};m=new XRWebGLBinding(l,i),S=m.createProjectionLayer(Xt),l.updateRenderState({layers:[S]}),e.setPixelRatio(1),e.setSize(S.textureWidth,S.textureHeight,!1),U=new ms(S.textureWidth,S.textureHeight,{format:Yi,type:Ga,depthTexture:new ax(S.textureWidth,S.textureHeight,ht,void 0,void 0,void 0,void 0,void 0,void 0,yt),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:S.ignoreDepthValues===!1})}else{const yt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:u};x=new XRWebGLLayer(l,i,yt),l.updateRenderState({baseLayer:x}),e.setPixelRatio(1),e.setSize(x.framebufferWidth,x.framebufferHeight,!1),U=new ms(x.framebufferWidth,x.framebufferHeight,{format:Yi,type:Ga,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil})}U.isXRRenderTarget=!0,this.setFoveation(p),g=null,d=await l.requestReferenceSpace(h),ie.setContext(l),ie.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return T.getDepthTexture()};function ct(R){for(let Y=0;Y<R.removed.length;Y++){const yt=R.removed[Y],ht=N.indexOf(yt);ht>=0&&(N[ht]=null,O[ht].disconnect(yt))}for(let Y=0;Y<R.added.length;Y++){const yt=R.added[Y];let ht=N.indexOf(yt);if(ht===-1){for(let Xt=0;Xt<O.length;Xt++)if(Xt>=N.length){N.push(yt),ht=Xt;break}else if(N[Xt]===null){N[Xt]=yt,ht=Xt;break}if(ht===-1)break}const Rt=O[ht];Rt&&Rt.connect(yt)}}const V=new Z,st=new Z;function q(R,Y,yt){V.setFromMatrixPosition(Y.matrixWorld),st.setFromMatrixPosition(yt.matrixWorld);const ht=V.distanceTo(st),Rt=Y.projectionMatrix.elements,Xt=yt.projectionMatrix.elements,Ut=Rt[14]/(Rt[10]-1),Ct=Rt[14]/(Rt[10]+1),kt=(Rt[9]+1)/Rt[5],le=(Rt[9]-1)/Rt[5],H=(Rt[8]-1)/Rt[0],ln=(Xt[8]+1)/Xt[0],se=Ut*H,Jt=Ut*ln,tt=ht/(-H+ln),bt=tt*-H;if(Y.matrixWorld.decompose(R.position,R.quaternion,R.scale),R.translateX(bt),R.translateZ(tt),R.matrixWorld.compose(R.position,R.quaternion,R.scale),R.matrixWorldInverse.copy(R.matrixWorld).invert(),Rt[10]===-1)R.projectionMatrix.copy(Y.projectionMatrix),R.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const Et=Ut+tt,L=Ct+tt,w=se-bt,nt=Jt+(ht-bt),pt=kt*Ct/L*Et,Mt=le*Ct/L*Et;R.projectionMatrix.makePerspective(w,nt,pt,Mt,Et,L),R.projectionMatrixInverse.copy(R.projectionMatrix).invert()}}function St(R,Y){Y===null?R.matrixWorld.copy(R.matrix):R.matrixWorld.multiplyMatrices(Y.matrixWorld,R.matrix),R.matrixWorldInverse.copy(R.matrixWorld).invert()}this.updateCamera=function(R){if(l===null)return;let Y=R.near,yt=R.far;T.texture!==null&&(T.depthNear>0&&(Y=T.depthNear),T.depthFar>0&&(yt=T.depthFar)),A.near=I.near=z.near=Y,A.far=I.far=z.far=yt,(B!==A.near||it!==A.far)&&(l.updateRenderState({depthNear:A.near,depthFar:A.far}),B=A.near,it=A.far),z.layers.mask=R.layers.mask|2,I.layers.mask=R.layers.mask|4,A.layers.mask=z.layers.mask|I.layers.mask;const ht=R.parent,Rt=A.cameras;St(A,ht);for(let Xt=0;Xt<Rt.length;Xt++)St(Rt[Xt],ht);Rt.length===2?q(A,z,I):A.projectionMatrix.copy(z.projectionMatrix),vt(R,A,ht)};function vt(R,Y,yt){yt===null?R.matrix.copy(Y.matrixWorld):(R.matrix.copy(yt.matrixWorld),R.matrix.invert(),R.matrix.multiply(Y.matrixWorld)),R.matrix.decompose(R.position,R.quaternion,R.scale),R.updateMatrixWorld(!0),R.projectionMatrix.copy(Y.projectionMatrix),R.projectionMatrixInverse.copy(Y.projectionMatrixInverse),R.isPerspectiveCamera&&(R.fov=$l*2*Math.atan(1/R.projectionMatrix.elements[5]),R.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(S===null&&x===null))return p},this.setFoveation=function(R){p=R,S!==null&&(S.fixedFoveation=R),x!==null&&x.fixedFoveation!==void 0&&(x.fixedFoveation=R)},this.hasDepthSensing=function(){return T.texture!==null},this.getDepthSensingMesh=function(){return T.getMesh(A)};let At=null;function Yt(R,Y){if(_=Y.getViewerPose(g||d),E=Y,_!==null){const yt=_.views;x!==null&&(e.setRenderTargetFramebuffer(U,x.framebuffer),e.setRenderTarget(U));let ht=!1;yt.length!==A.cameras.length&&(A.cameras.length=0,ht=!0);for(let Ut=0;Ut<yt.length;Ut++){const Ct=yt[Ut];let kt=null;if(x!==null)kt=x.getViewport(Ct);else{const H=m.getViewSubImage(S,Ct);kt=H.viewport,Ut===0&&(e.setRenderTargetTextures(U,H.colorTexture,S.ignoreDepthValues?void 0:H.depthStencilTexture),e.setRenderTarget(U))}let le=D[Ut];le===void 0&&(le=new Li,le.layers.enable(Ut),le.viewport=new We,D[Ut]=le),le.matrix.fromArray(Ct.transform.matrix),le.matrix.decompose(le.position,le.quaternion,le.scale),le.projectionMatrix.fromArray(Ct.projectionMatrix),le.projectionMatrixInverse.copy(le.projectionMatrix).invert(),le.viewport.set(kt.x,kt.y,kt.width,kt.height),Ut===0&&(A.matrix.copy(le.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),ht===!0&&A.cameras.push(le)}const Rt=l.enabledFeatures;if(Rt&&Rt.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&m){const Ut=m.getDepthInformation(yt[0]);Ut&&Ut.isValid&&Ut.texture&&T.init(e,Ut,l.renderState)}}for(let yt=0;yt<O.length;yt++){const ht=N[yt],Rt=O[yt];ht!==null&&Rt!==void 0&&Rt.update(ht,Y,g||d)}At&&At(R,Y),Y.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:Y}),E=null}const ie=new ox;ie.setAnimationLoop(Yt),this.setAnimationLoop=function(R){At=R},this.dispose=function(){}}}const ss=new fa,FC=new $e;function HC(s,e){function i(M,y){M.matrixAutoUpdate===!0&&M.updateMatrix(),y.value.copy(M.matrix)}function r(M,y){y.color.getRGB(M.fogColor.value,tx(s)),y.isFog?(M.fogNear.value=y.near,M.fogFar.value=y.far):y.isFogExp2&&(M.fogDensity.value=y.density)}function l(M,y,U,O,N){y.isMeshBasicMaterial||y.isMeshLambertMaterial?u(M,y):y.isMeshToonMaterial?(u(M,y),m(M,y)):y.isMeshPhongMaterial?(u(M,y),_(M,y)):y.isMeshStandardMaterial?(u(M,y),S(M,y),y.isMeshPhysicalMaterial&&x(M,y,N)):y.isMeshMatcapMaterial?(u(M,y),E(M,y)):y.isMeshDepthMaterial?u(M,y):y.isMeshDistanceMaterial?(u(M,y),T(M,y)):y.isMeshNormalMaterial?u(M,y):y.isLineBasicMaterial?(d(M,y),y.isLineDashedMaterial&&h(M,y)):y.isPointsMaterial?p(M,y,U,O):y.isSpriteMaterial?g(M,y):y.isShadowMaterial?(M.color.value.copy(y.color),M.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function u(M,y){M.opacity.value=y.opacity,y.color&&M.diffuse.value.copy(y.color),y.emissive&&M.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(M.map.value=y.map,i(y.map,M.mapTransform)),y.alphaMap&&(M.alphaMap.value=y.alphaMap,i(y.alphaMap,M.alphaMapTransform)),y.bumpMap&&(M.bumpMap.value=y.bumpMap,i(y.bumpMap,M.bumpMapTransform),M.bumpScale.value=y.bumpScale,y.side===si&&(M.bumpScale.value*=-1)),y.normalMap&&(M.normalMap.value=y.normalMap,i(y.normalMap,M.normalMapTransform),M.normalScale.value.copy(y.normalScale),y.side===si&&M.normalScale.value.negate()),y.displacementMap&&(M.displacementMap.value=y.displacementMap,i(y.displacementMap,M.displacementMapTransform),M.displacementScale.value=y.displacementScale,M.displacementBias.value=y.displacementBias),y.emissiveMap&&(M.emissiveMap.value=y.emissiveMap,i(y.emissiveMap,M.emissiveMapTransform)),y.specularMap&&(M.specularMap.value=y.specularMap,i(y.specularMap,M.specularMapTransform)),y.alphaTest>0&&(M.alphaTest.value=y.alphaTest);const U=e.get(y),O=U.envMap,N=U.envMapRotation;O&&(M.envMap.value=O,ss.copy(N),ss.x*=-1,ss.y*=-1,ss.z*=-1,O.isCubeTexture&&O.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),M.envMapRotation.value.setFromMatrix4(FC.makeRotationFromEuler(ss)),M.flipEnvMap.value=O.isCubeTexture&&O.isRenderTargetTexture===!1?-1:1,M.reflectivity.value=y.reflectivity,M.ior.value=y.ior,M.refractionRatio.value=y.refractionRatio),y.lightMap&&(M.lightMap.value=y.lightMap,M.lightMapIntensity.value=y.lightMapIntensity,i(y.lightMap,M.lightMapTransform)),y.aoMap&&(M.aoMap.value=y.aoMap,M.aoMapIntensity.value=y.aoMapIntensity,i(y.aoMap,M.aoMapTransform))}function d(M,y){M.diffuse.value.copy(y.color),M.opacity.value=y.opacity,y.map&&(M.map.value=y.map,i(y.map,M.mapTransform))}function h(M,y){M.dashSize.value=y.dashSize,M.totalSize.value=y.dashSize+y.gapSize,M.scale.value=y.scale}function p(M,y,U,O){M.diffuse.value.copy(y.color),M.opacity.value=y.opacity,M.size.value=y.size*U,M.scale.value=O*.5,y.map&&(M.map.value=y.map,i(y.map,M.uvTransform)),y.alphaMap&&(M.alphaMap.value=y.alphaMap,i(y.alphaMap,M.alphaMapTransform)),y.alphaTest>0&&(M.alphaTest.value=y.alphaTest)}function g(M,y){M.diffuse.value.copy(y.color),M.opacity.value=y.opacity,M.rotation.value=y.rotation,y.map&&(M.map.value=y.map,i(y.map,M.mapTransform)),y.alphaMap&&(M.alphaMap.value=y.alphaMap,i(y.alphaMap,M.alphaMapTransform)),y.alphaTest>0&&(M.alphaTest.value=y.alphaTest)}function _(M,y){M.specular.value.copy(y.specular),M.shininess.value=Math.max(y.shininess,1e-4)}function m(M,y){y.gradientMap&&(M.gradientMap.value=y.gradientMap)}function S(M,y){M.metalness.value=y.metalness,y.metalnessMap&&(M.metalnessMap.value=y.metalnessMap,i(y.metalnessMap,M.metalnessMapTransform)),M.roughness.value=y.roughness,y.roughnessMap&&(M.roughnessMap.value=y.roughnessMap,i(y.roughnessMap,M.roughnessMapTransform)),y.envMap&&(M.envMapIntensity.value=y.envMapIntensity)}function x(M,y,U){M.ior.value=y.ior,y.sheen>0&&(M.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),M.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(M.sheenColorMap.value=y.sheenColorMap,i(y.sheenColorMap,M.sheenColorMapTransform)),y.sheenRoughnessMap&&(M.sheenRoughnessMap.value=y.sheenRoughnessMap,i(y.sheenRoughnessMap,M.sheenRoughnessMapTransform))),y.clearcoat>0&&(M.clearcoat.value=y.clearcoat,M.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(M.clearcoatMap.value=y.clearcoatMap,i(y.clearcoatMap,M.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(M.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,i(y.clearcoatRoughnessMap,M.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(M.clearcoatNormalMap.value=y.clearcoatNormalMap,i(y.clearcoatNormalMap,M.clearcoatNormalMapTransform),M.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===si&&M.clearcoatNormalScale.value.negate())),y.dispersion>0&&(M.dispersion.value=y.dispersion),y.iridescence>0&&(M.iridescence.value=y.iridescence,M.iridescenceIOR.value=y.iridescenceIOR,M.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],M.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(M.iridescenceMap.value=y.iridescenceMap,i(y.iridescenceMap,M.iridescenceMapTransform)),y.iridescenceThicknessMap&&(M.iridescenceThicknessMap.value=y.iridescenceThicknessMap,i(y.iridescenceThicknessMap,M.iridescenceThicknessMapTransform))),y.transmission>0&&(M.transmission.value=y.transmission,M.transmissionSamplerMap.value=U.texture,M.transmissionSamplerSize.value.set(U.width,U.height),y.transmissionMap&&(M.transmissionMap.value=y.transmissionMap,i(y.transmissionMap,M.transmissionMapTransform)),M.thickness.value=y.thickness,y.thicknessMap&&(M.thicknessMap.value=y.thicknessMap,i(y.thicknessMap,M.thicknessMapTransform)),M.attenuationDistance.value=y.attenuationDistance,M.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(M.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(M.anisotropyMap.value=y.anisotropyMap,i(y.anisotropyMap,M.anisotropyMapTransform))),M.specularIntensity.value=y.specularIntensity,M.specularColor.value.copy(y.specularColor),y.specularColorMap&&(M.specularColorMap.value=y.specularColorMap,i(y.specularColorMap,M.specularColorMapTransform)),y.specularIntensityMap&&(M.specularIntensityMap.value=y.specularIntensityMap,i(y.specularIntensityMap,M.specularIntensityMapTransform))}function E(M,y){y.matcap&&(M.matcap.value=y.matcap)}function T(M,y){const U=e.get(y).light;M.referencePosition.value.setFromMatrixPosition(U.matrixWorld),M.nearDistance.value=U.shadow.camera.near,M.farDistance.value=U.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:l}}function kC(s,e,i,r){let l={},u={},d=[];const h=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function p(U,O){const N=O.program;r.uniformBlockBinding(U,N)}function g(U,O){let N=l[U.id];N===void 0&&(E(U),N=_(U),l[U.id]=N,U.addEventListener("dispose",M));const G=O.program;r.updateUBOMapping(U,G);const F=e.render.frame;u[U.id]!==F&&(S(U),u[U.id]=F)}function _(U){const O=m();U.__bindingPointIndex=O;const N=s.createBuffer(),G=U.__size,F=U.usage;return s.bindBuffer(s.UNIFORM_BUFFER,N),s.bufferData(s.UNIFORM_BUFFER,G,F),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,O,N),N}function m(){for(let U=0;U<h;U++)if(d.indexOf(U)===-1)return d.push(U),U;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function S(U){const O=l[U.id],N=U.uniforms,G=U.__cache;s.bindBuffer(s.UNIFORM_BUFFER,O);for(let F=0,z=N.length;F<z;F++){const I=Array.isArray(N[F])?N[F]:[N[F]];for(let D=0,A=I.length;D<A;D++){const B=I[D];if(x(B,F,D,G)===!0){const it=B.__offset,at=Array.isArray(B.value)?B.value:[B.value];let ft=0;for(let ct=0;ct<at.length;ct++){const V=at[ct],st=T(V);typeof V=="number"||typeof V=="boolean"?(B.__data[0]=V,s.bufferSubData(s.UNIFORM_BUFFER,it+ft,B.__data)):V.isMatrix3?(B.__data[0]=V.elements[0],B.__data[1]=V.elements[1],B.__data[2]=V.elements[2],B.__data[3]=0,B.__data[4]=V.elements[3],B.__data[5]=V.elements[4],B.__data[6]=V.elements[5],B.__data[7]=0,B.__data[8]=V.elements[6],B.__data[9]=V.elements[7],B.__data[10]=V.elements[8],B.__data[11]=0):(V.toArray(B.__data,ft),ft+=st.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,it,B.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function x(U,O,N,G){const F=U.value,z=O+"_"+N;if(G[z]===void 0)return typeof F=="number"||typeof F=="boolean"?G[z]=F:G[z]=F.clone(),!0;{const I=G[z];if(typeof F=="number"||typeof F=="boolean"){if(I!==F)return G[z]=F,!0}else if(I.equals(F)===!1)return I.copy(F),!0}return!1}function E(U){const O=U.uniforms;let N=0;const G=16;for(let z=0,I=O.length;z<I;z++){const D=Array.isArray(O[z])?O[z]:[O[z]];for(let A=0,B=D.length;A<B;A++){const it=D[A],at=Array.isArray(it.value)?it.value:[it.value];for(let ft=0,ct=at.length;ft<ct;ft++){const V=at[ft],st=T(V),q=N%G,St=q%st.boundary,vt=q+St;N+=St,vt!==0&&G-vt<st.storage&&(N+=G-vt),it.__data=new Float32Array(st.storage/Float32Array.BYTES_PER_ELEMENT),it.__offset=N,N+=st.storage}}}const F=N%G;return F>0&&(N+=G-F),U.__size=N,U.__cache={},this}function T(U){const O={boundary:0,storage:0};return typeof U=="number"||typeof U=="boolean"?(O.boundary=4,O.storage=4):U.isVector2?(O.boundary=8,O.storage=8):U.isVector3||U.isColor?(O.boundary=16,O.storage=12):U.isVector4?(O.boundary=16,O.storage=16):U.isMatrix3?(O.boundary=48,O.storage=48):U.isMatrix4?(O.boundary=64,O.storage=64):U.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",U),O}function M(U){const O=U.target;O.removeEventListener("dispose",M);const N=d.indexOf(O.__bindingPointIndex);d.splice(N,1),s.deleteBuffer(l[O.id]),delete l[O.id],delete u[O.id]}function y(){for(const U in l)s.deleteBuffer(l[U]);d=[],l={},u={}}return{bind:p,update:g,dispose:y}}class GC{constructor(e={}){const{canvas:i=gT(),context:r=null,depth:l=!0,stencil:u=!1,alpha:d=!1,antialias:h=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:g=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:m=!1,reverseDepthBuffer:S=!1}=e;this.isWebGLRenderer=!0;let x;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=r.getContextAttributes().alpha}else x=d;const E=new Uint32Array(4),T=new Int32Array(4);let M=null,y=null;const U=[],O=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=zi,this.toneMapping=Dr,this.toneMappingExposure=1;const N=this;let G=!1,F=0,z=0,I=null,D=-1,A=null;const B=new We,it=new We;let at=null;const ft=new Se(0);let ct=0,V=i.width,st=i.height,q=1,St=null,vt=null;const At=new We(0,0,V,st),Yt=new We(0,0,V,st);let ie=!1;const R=new zm;let Y=!1,yt=!1;this.transmissionResolutionScale=1;const ht=new $e,Rt=new $e,Xt=new Z,Ut=new We,Ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let kt=!1;function le(){return I===null?q:1}let H=r;function ln(C,J){return i.getContext(C,J)}try{const C={alpha:!0,depth:l,stencil:u,antialias:h,premultipliedAlpha:p,preserveDrawingBuffer:g,powerPreference:_,failIfMajorPerformanceCaveat:m};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Em}`),i.addEventListener("webglcontextlost",xt,!1),i.addEventListener("webglcontextrestored",Ft,!1),i.addEventListener("webglcontextcreationerror",Gt,!1),H===null){const J="webgl2";if(H=ln(J,C),H===null)throw ln(J)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let se,Jt,tt,bt,Et,L,w,nt,pt,Mt,mt,Zt,Bt,Ht,xe,wt,Wt,ee,re,jt,ye,he,He,X;function It(){se=new JR(H),se.init(),he=new LC(H,se),Jt=new YR(H,se,e,he),tt=new UC(H,se),Jt.reverseDepthBuffer&&S&&tt.buffers.depth.setReversed(!0),bt=new e2(H),Et=new yC,L=new zC(H,se,tt,Et,Jt,he,bt),w=new qR(N),nt=new QR(N),pt=new lw(H),He=new jR(H,pt),Mt=new $R(H,pt,bt,He),mt=new i2(H,Mt,pt,bt),re=new n2(H,Jt,L),wt=new WR(Et),Zt=new vC(N,w,nt,se,Jt,He,wt),Bt=new HC(N,Et),Ht=new xC,xe=new AC(se),ee=new VR(N,w,nt,tt,mt,x,p),Wt=new DC(N,mt,Jt),X=new kC(H,bt,Jt,tt),jt=new XR(H,se,bt),ye=new t2(H,se,bt),bt.programs=Zt.programs,N.capabilities=Jt,N.extensions=se,N.properties=Et,N.renderLists=Ht,N.shadowMap=Wt,N.state=tt,N.info=bt}It();const dt=new IC(N,H);this.xr=dt,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const C=se.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=se.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(C){C!==void 0&&(q=C,this.setSize(V,st,!1))},this.getSize=function(C){return C.set(V,st)},this.setSize=function(C,J,lt=!0){if(dt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=C,st=J,i.width=Math.floor(C*q),i.height=Math.floor(J*q),lt===!0&&(i.style.width=C+"px",i.style.height=J+"px"),this.setViewport(0,0,C,J)},this.getDrawingBufferSize=function(C){return C.set(V*q,st*q).floor()},this.setDrawingBufferSize=function(C,J,lt){V=C,st=J,q=lt,i.width=Math.floor(C*lt),i.height=Math.floor(J*lt),this.setViewport(0,0,C,J)},this.getCurrentViewport=function(C){return C.copy(B)},this.getViewport=function(C){return C.copy(At)},this.setViewport=function(C,J,lt,ut){C.isVector4?At.set(C.x,C.y,C.z,C.w):At.set(C,J,lt,ut),tt.viewport(B.copy(At).multiplyScalar(q).round())},this.getScissor=function(C){return C.copy(Yt)},this.setScissor=function(C,J,lt,ut){C.isVector4?Yt.set(C.x,C.y,C.z,C.w):Yt.set(C,J,lt,ut),tt.scissor(it.copy(Yt).multiplyScalar(q).round())},this.getScissorTest=function(){return ie},this.setScissorTest=function(C){tt.setScissorTest(ie=C)},this.setOpaqueSort=function(C){St=C},this.setTransparentSort=function(C){vt=C},this.getClearColor=function(C){return C.copy(ee.getClearColor())},this.setClearColor=function(){ee.setClearColor.apply(ee,arguments)},this.getClearAlpha=function(){return ee.getClearAlpha()},this.setClearAlpha=function(){ee.setClearAlpha.apply(ee,arguments)},this.clear=function(C=!0,J=!0,lt=!0){let ut=0;if(C){let $=!1;if(I!==null){const Tt=I.texture.format;$=Tt===Cm||Tt===Rm||Tt===Am}if($){const Tt=I.texture.type,Nt=Tt===Ga||Tt===ps||Tt===Jl||Tt===Oo||Tt===Tm||Tt===wm,Dt=ee.getClearColor(),Ot=ee.getClearAlpha(),ne=Dt.r,oe=Dt.g,$t=Dt.b;Nt?(E[0]=ne,E[1]=oe,E[2]=$t,E[3]=Ot,H.clearBufferuiv(H.COLOR,0,E)):(T[0]=ne,T[1]=oe,T[2]=$t,T[3]=Ot,H.clearBufferiv(H.COLOR,0,T))}else ut|=H.COLOR_BUFFER_BIT}J&&(ut|=H.DEPTH_BUFFER_BIT),lt&&(ut|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(ut)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",xt,!1),i.removeEventListener("webglcontextrestored",Ft,!1),i.removeEventListener("webglcontextcreationerror",Gt,!1),ee.dispose(),Ht.dispose(),xe.dispose(),Et.dispose(),w.dispose(),nt.dispose(),mt.dispose(),He.dispose(),X.dispose(),Zt.dispose(),dt.dispose(),dt.removeEventListener("sessionstart",Gn),dt.removeEventListener("sessionend",ec),ha.stop()};function xt(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),G=!0}function Ft(){console.log("THREE.WebGLRenderer: Context Restored."),G=!1;const C=bt.autoReset,J=Wt.enabled,lt=Wt.autoUpdate,ut=Wt.needsUpdate,$=Wt.type;It(),bt.autoReset=C,Wt.enabled=J,Wt.autoUpdate=lt,Wt.needsUpdate=ut,Wt.type=$}function Gt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ue(C){const J=C.target;J.removeEventListener("dispose",ue),tn(J)}function tn(C){En(C),Et.remove(C)}function En(C){const J=Et.get(C).programs;J!==void 0&&(J.forEach(function(lt){Zt.releaseProgram(lt)}),C.isShaderMaterial&&Zt.releaseShaderCache(C))}this.renderBufferDirect=function(C,J,lt,ut,$,Tt){J===null&&(J=Ct);const Nt=$.isMesh&&$.matrixWorld.determinant()<0,Dt=pf(C,J,lt,ut,$);tt.setMaterial(ut,Nt);let Ot=lt.index,ne=1;if(ut.wireframe===!0){if(Ot=Mt.getWireframeAttribute(lt),Ot===void 0)return;ne=2}const oe=lt.drawRange,$t=lt.attributes.position;let Ce=oe.start*ne,Ne=(oe.start+oe.count)*ne;Tt!==null&&(Ce=Math.max(Ce,Tt.start*ne),Ne=Math.min(Ne,(Tt.start+Tt.count)*ne)),Ot!==null?(Ce=Math.max(Ce,0),Ne=Math.min(Ne,Ot.count)):$t!=null&&(Ce=Math.max(Ce,0),Ne=Math.min(Ne,$t.count));const qe=Ne-Ce;if(qe<0||qe===1/0)return;He.setup($,ut,Dt,lt,Ot);let je,Me=jt;if(Ot!==null&&(je=pt.get(Ot),Me=ye,Me.setIndex(je)),$.isMesh)ut.wireframe===!0?(tt.setLineWidth(ut.wireframeLinewidth*le()),Me.setMode(H.LINES)):Me.setMode(H.TRIANGLES);else if($.isLine){let Kt=ut.linewidth;Kt===void 0&&(Kt=1),tt.setLineWidth(Kt*le()),$.isLineSegments?Me.setMode(H.LINES):$.isLineLoop?Me.setMode(H.LINE_LOOP):Me.setMode(H.LINE_STRIP)}else $.isPoints?Me.setMode(H.POINTS):$.isSprite&&Me.setMode(H.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)Me.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(se.get("WEBGL_multi_draw"))Me.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const Kt=$._multiDrawStarts,en=$._multiDrawCounts,Te=$._multiDrawCount,Tn=Ot?pt.get(Ot).bytesPerElement:1,Je=Et.get(ut).currentProgram.getUniforms();for(let Vn=0;Vn<Te;Vn++)Je.setValue(H,"_gl_DrawID",Vn),Me.render(Kt[Vn]/Tn,en[Vn])}else if($.isInstancedMesh)Me.renderInstances(Ce,qe,$.count);else if(lt.isInstancedBufferGeometry){const Kt=lt._maxInstanceCount!==void 0?lt._maxInstanceCount:1/0,en=Math.min(lt.instanceCount,Kt);Me.renderInstances(Ce,qe,en)}else Me.render(Ce,qe)};function Re(C,J,lt){C.transparent===!0&&C.side===Ba&&C.forceSinglePass===!1?(C.side=si,C.needsUpdate=!0,pa(C,J,lt),C.side=Nr,C.needsUpdate=!0,pa(C,J,lt),C.side=Ba):pa(C,J,lt)}this.compile=function(C,J,lt=null){lt===null&&(lt=C),y=xe.get(lt),y.init(J),O.push(y),lt.traverseVisible(function($){$.isLight&&$.layers.test(J.layers)&&(y.pushLight($),$.castShadow&&y.pushShadow($))}),C!==lt&&C.traverseVisible(function($){$.isLight&&$.layers.test(J.layers)&&(y.pushLight($),$.castShadow&&y.pushShadow($))}),y.setupLights();const ut=new Set;return C.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const Tt=$.material;if(Tt)if(Array.isArray(Tt))for(let Nt=0;Nt<Tt.length;Nt++){const Dt=Tt[Nt];Re(Dt,lt,$),ut.add(Dt)}else Re(Tt,lt,$),ut.add(Tt)}),O.pop(),y=null,ut},this.compileAsync=function(C,J,lt=null){const ut=this.compile(C,J,lt);return new Promise($=>{function Tt(){if(ut.forEach(function(Nt){Et.get(Nt).currentProgram.isReady()&&ut.delete(Nt)}),ut.size===0){$(C);return}setTimeout(Tt,10)}se.get("KHR_parallel_shader_compile")!==null?Tt():setTimeout(Tt,10)})};let Qe=null;function bn(C){Qe&&Qe(C)}function Gn(){ha.stop()}function ec(){ha.start()}const ha=new ox;ha.setAnimationLoop(bn),typeof self<"u"&&ha.setContext(self),this.setAnimationLoop=function(C){Qe=C,dt.setAnimationLoop(C),C===null?ha.stop():ha.start()},dt.addEventListener("sessionstart",Gn),dt.addEventListener("sessionend",ec),this.render=function(C,J){if(J!==void 0&&J.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(G===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),J.parent===null&&J.matrixWorldAutoUpdate===!0&&J.updateMatrixWorld(),dt.enabled===!0&&dt.isPresenting===!0&&(dt.cameraAutoUpdate===!0&&dt.updateCamera(J),J=dt.getCamera()),C.isScene===!0&&C.onBeforeRender(N,C,J,I),y=xe.get(C,O.length),y.init(J),O.push(y),Rt.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),R.setFromProjectionMatrix(Rt),yt=this.localClippingEnabled,Y=wt.init(this.clippingPlanes,yt),M=Ht.get(C,U.length),M.init(),U.push(M),dt.enabled===!0&&dt.isPresenting===!0){const Tt=N.xr.getDepthSensingMesh();Tt!==null&&Go(Tt,J,-1/0,N.sortObjects)}Go(C,J,0,N.sortObjects),M.finish(),N.sortObjects===!0&&M.sort(St,vt),kt=dt.enabled===!1||dt.isPresenting===!1||dt.hasDepthSensing()===!1,kt&&ee.addToRenderList(M,C),this.info.render.frame++,Y===!0&&wt.beginShadows();const lt=y.state.shadowsArray;Wt.render(lt,C,J),Y===!0&&wt.endShadows(),this.info.autoReset===!0&&this.info.reset();const ut=M.opaque,$=M.transmissive;if(y.setupLights(),J.isArrayCamera){const Tt=J.cameras;if($.length>0)for(let Nt=0,Dt=Tt.length;Nt<Dt;Nt++){const Ot=Tt[Nt];zr(ut,$,C,Ot)}kt&&ee.render(C);for(let Nt=0,Dt=Tt.length;Nt<Dt;Nt++){const Ot=Tt[Nt];Ur(M,C,Ot,Ot.viewport)}}else $.length>0&&zr(ut,$,C,J),kt&&ee.render(C),Ur(M,C,J);I!==null&&z===0&&(L.updateMultisampleRenderTarget(I),L.updateRenderTargetMipmap(I)),C.isScene===!0&&C.onAfterRender(N,C,J),He.resetDefaultState(),D=-1,A=null,O.pop(),O.length>0?(y=O[O.length-1],Y===!0&&wt.setGlobalState(N.clippingPlanes,y.state.camera)):y=null,U.pop(),U.length>0?M=U[U.length-1]:M=null};function Go(C,J,lt,ut){if(C.visible===!1)return;if(C.layers.test(J.layers)){if(C.isGroup)lt=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(J);else if(C.isLight)y.pushLight(C),C.castShadow&&y.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||R.intersectsSprite(C)){ut&&Ut.setFromMatrixPosition(C.matrixWorld).applyMatrix4(Rt);const Nt=mt.update(C),Dt=C.material;Dt.visible&&M.push(C,Nt,Dt,lt,Ut.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||R.intersectsObject(C))){const Nt=mt.update(C),Dt=C.material;if(ut&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Ut.copy(C.boundingSphere.center)):(Nt.boundingSphere===null&&Nt.computeBoundingSphere(),Ut.copy(Nt.boundingSphere.center)),Ut.applyMatrix4(C.matrixWorld).applyMatrix4(Rt)),Array.isArray(Dt)){const Ot=Nt.groups;for(let ne=0,oe=Ot.length;ne<oe;ne++){const $t=Ot[ne],Ce=Dt[$t.materialIndex];Ce&&Ce.visible&&M.push(C,Nt,Ce,lt,Ut.z,$t)}}else Dt.visible&&M.push(C,Nt,Dt,lt,Ut.z,null)}}const Tt=C.children;for(let Nt=0,Dt=Tt.length;Nt<Dt;Nt++)Go(Tt[Nt],J,lt,ut)}function Ur(C,J,lt,ut){const $=C.opaque,Tt=C.transmissive,Nt=C.transparent;y.setupLightsView(lt),Y===!0&&wt.setGlobalState(N.clippingPlanes,lt),ut&&tt.viewport(B.copy(ut)),$.length>0&&da($,J,lt),Tt.length>0&&da(Tt,J,lt),Nt.length>0&&da(Nt,J,lt),tt.buffers.depth.setTest(!0),tt.buffers.depth.setMask(!0),tt.buffers.color.setMask(!0),tt.setPolygonOffset(!1)}function zr(C,J,lt,ut){if((lt.isScene===!0?lt.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[ut.id]===void 0&&(y.state.transmissionRenderTarget[ut.id]=new ms(1,1,{generateMipmaps:!0,type:se.has("EXT_color_buffer_half_float")||se.has("EXT_color_buffer_float")?tc:Ga,minFilter:hs,samples:4,stencilBuffer:u,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ze.workingColorSpace}));const Tt=y.state.transmissionRenderTarget[ut.id],Nt=ut.viewport||B;Tt.setSize(Nt.z*N.transmissionResolutionScale,Nt.w*N.transmissionResolutionScale);const Dt=N.getRenderTarget();N.setRenderTarget(Tt),N.getClearColor(ft),ct=N.getClearAlpha(),ct<1&&N.setClearColor(16777215,.5),N.clear(),kt&&ee.render(lt);const Ot=N.toneMapping;N.toneMapping=Dr;const ne=ut.viewport;if(ut.viewport!==void 0&&(ut.viewport=void 0),y.setupLightsView(ut),Y===!0&&wt.setGlobalState(N.clippingPlanes,ut),da(C,lt,ut),L.updateMultisampleRenderTarget(Tt),L.updateRenderTargetMipmap(Tt),se.has("WEBGL_multisampled_render_to_texture")===!1){let oe=!1;for(let $t=0,Ce=J.length;$t<Ce;$t++){const Ne=J[$t],qe=Ne.object,je=Ne.geometry,Me=Ne.material,Kt=Ne.group;if(Me.side===Ba&&qe.layers.test(ut.layers)){const en=Me.side;Me.side=si,Me.needsUpdate=!0,Zi(qe,lt,ut,je,Me,Kt),Me.side=en,Me.needsUpdate=!0,oe=!0}}oe===!0&&(L.updateMultisampleRenderTarget(Tt),L.updateRenderTargetMipmap(Tt))}N.setRenderTarget(Dt),N.setClearColor(ft,ct),ne!==void 0&&(ut.viewport=ne),N.toneMapping=Ot}function da(C,J,lt){const ut=J.isScene===!0?J.overrideMaterial:null;for(let $=0,Tt=C.length;$<Tt;$++){const Nt=C[$],Dt=Nt.object,Ot=Nt.geometry,ne=ut===null?Nt.material:ut,oe=Nt.group;Dt.layers.test(lt.layers)&&Zi(Dt,J,lt,Ot,ne,oe)}}function Zi(C,J,lt,ut,$,Tt){C.onBeforeRender(N,J,lt,ut,$,Tt),C.modelViewMatrix.multiplyMatrices(lt.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),$.onBeforeRender(N,J,lt,ut,C,Tt),$.transparent===!0&&$.side===Ba&&$.forceSinglePass===!1?($.side=si,$.needsUpdate=!0,N.renderBufferDirect(lt,J,ut,$,C,Tt),$.side=Nr,$.needsUpdate=!0,N.renderBufferDirect(lt,J,ut,$,C,Tt),$.side=Ba):N.renderBufferDirect(lt,J,ut,$,C,Tt),C.onAfterRender(N,J,lt,ut,$,Tt)}function pa(C,J,lt){J.isScene!==!0&&(J=Ct);const ut=Et.get(C),$=y.state.lights,Tt=y.state.shadowsArray,Nt=$.state.version,Dt=Zt.getParameters(C,$.state,Tt,J,lt),Ot=Zt.getProgramCacheKey(Dt);let ne=ut.programs;ut.environment=C.isMeshStandardMaterial?J.environment:null,ut.fog=J.fog,ut.envMap=(C.isMeshStandardMaterial?nt:w).get(C.envMap||ut.environment),ut.envMapRotation=ut.environment!==null&&C.envMap===null?J.environmentRotation:C.envMapRotation,ne===void 0&&(C.addEventListener("dispose",ue),ne=new Map,ut.programs=ne);let oe=ne.get(Ot);if(oe!==void 0){if(ut.currentProgram===oe&&ut.lightsStateVersion===Nt)return Vo(C,Dt),oe}else Dt.uniforms=Zt.getUniforms(C),C.onBeforeCompile(Dt,N),oe=Zt.acquireProgram(Dt,Ot),ne.set(Ot,oe),ut.uniforms=Dt.uniforms;const $t=ut.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&($t.clippingPlanes=wt.uniform),Vo(C,Dt),ut.needsLights=jo(C),ut.lightsStateVersion=Nt,ut.needsLights&&($t.ambientLightColor.value=$.state.ambient,$t.lightProbe.value=$.state.probe,$t.directionalLights.value=$.state.directional,$t.directionalLightShadows.value=$.state.directionalShadow,$t.spotLights.value=$.state.spot,$t.spotLightShadows.value=$.state.spotShadow,$t.rectAreaLights.value=$.state.rectArea,$t.ltc_1.value=$.state.rectAreaLTC1,$t.ltc_2.value=$.state.rectAreaLTC2,$t.pointLights.value=$.state.point,$t.pointLightShadows.value=$.state.pointShadow,$t.hemisphereLights.value=$.state.hemi,$t.directionalShadowMap.value=$.state.directionalShadowMap,$t.directionalShadowMatrix.value=$.state.directionalShadowMatrix,$t.spotShadowMap.value=$.state.spotShadowMap,$t.spotLightMatrix.value=$.state.spotLightMatrix,$t.spotLightMap.value=$.state.spotLightMap,$t.pointShadowMap.value=$.state.pointShadowMap,$t.pointShadowMatrix.value=$.state.pointShadowMatrix),ut.currentProgram=oe,ut.uniformsList=null,oe}function Xa(C){if(C.uniformsList===null){const J=C.currentProgram.getUniforms();C.uniformsList=af.seqWithValue(J.seq,C.uniforms)}return C.uniformsList}function Vo(C,J){const lt=Et.get(C);lt.outputColorSpace=J.outputColorSpace,lt.batching=J.batching,lt.batchingColor=J.batchingColor,lt.instancing=J.instancing,lt.instancingColor=J.instancingColor,lt.instancingMorph=J.instancingMorph,lt.skinning=J.skinning,lt.morphTargets=J.morphTargets,lt.morphNormals=J.morphNormals,lt.morphColors=J.morphColors,lt.morphTargetsCount=J.morphTargetsCount,lt.numClippingPlanes=J.numClippingPlanes,lt.numIntersection=J.numClipIntersection,lt.vertexAlphas=J.vertexAlphas,lt.vertexTangents=J.vertexTangents,lt.toneMapping=J.toneMapping}function pf(C,J,lt,ut,$){J.isScene!==!0&&(J=Ct),L.resetTextureUnits();const Tt=J.fog,Nt=ut.isMeshStandardMaterial?J.environment:null,Dt=I===null?N.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Bo,Ot=(ut.isMeshStandardMaterial?nt:w).get(ut.envMap||Nt),ne=ut.vertexColors===!0&&!!lt.attributes.color&&lt.attributes.color.itemSize===4,oe=!!lt.attributes.tangent&&(!!ut.normalMap||ut.anisotropy>0),$t=!!lt.morphAttributes.position,Ce=!!lt.morphAttributes.normal,Ne=!!lt.morphAttributes.color;let qe=Dr;ut.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(qe=N.toneMapping);const je=lt.morphAttributes.position||lt.morphAttributes.normal||lt.morphAttributes.color,Me=je!==void 0?je.length:0,Kt=Et.get(ut),en=y.state.lights;if(Y===!0&&(yt===!0||C!==A)){const Dn=C===A&&ut.id===D;wt.setState(ut,C,Dn)}let Te=!1;ut.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==en.state.version||Kt.outputColorSpace!==Dt||$.isBatchedMesh&&Kt.batching===!1||!$.isBatchedMesh&&Kt.batching===!0||$.isBatchedMesh&&Kt.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&Kt.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&Kt.instancing===!1||!$.isInstancedMesh&&Kt.instancing===!0||$.isSkinnedMesh&&Kt.skinning===!1||!$.isSkinnedMesh&&Kt.skinning===!0||$.isInstancedMesh&&Kt.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Kt.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&Kt.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&Kt.instancingMorph===!1&&$.morphTexture!==null||Kt.envMap!==Ot||ut.fog===!0&&Kt.fog!==Tt||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==wt.numPlanes||Kt.numIntersection!==wt.numIntersection)||Kt.vertexAlphas!==ne||Kt.vertexTangents!==oe||Kt.morphTargets!==$t||Kt.morphNormals!==Ce||Kt.morphColors!==Ne||Kt.toneMapping!==qe||Kt.morphTargetsCount!==Me)&&(Te=!0):(Te=!0,Kt.__version=ut.version);let Tn=Kt.currentProgram;Te===!0&&(Tn=pa(ut,J,$));let Je=!1,Vn=!1,Ya=!1;const Xe=Tn.getUniforms(),un=Kt.uniforms;if(tt.useProgram(Tn.program)&&(Je=!0,Vn=!0,Ya=!0),ut.id!==D&&(D=ut.id,Vn=!0),Je||A!==C){tt.buffers.depth.getReversed()?(ht.copy(C.projectionMatrix),vT(ht),yT(ht),Xe.setValue(H,"projectionMatrix",ht)):Xe.setValue(H,"projectionMatrix",C.projectionMatrix),Xe.setValue(H,"viewMatrix",C.matrixWorldInverse);const Nn=Xe.map.cameraPosition;Nn!==void 0&&Nn.setValue(H,Xt.setFromMatrixPosition(C.matrixWorld)),Jt.logarithmicDepthBuffer&&Xe.setValue(H,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(ut.isMeshPhongMaterial||ut.isMeshToonMaterial||ut.isMeshLambertMaterial||ut.isMeshBasicMaterial||ut.isMeshStandardMaterial||ut.isShaderMaterial)&&Xe.setValue(H,"isOrthographic",C.isOrthographicCamera===!0),A!==C&&(A=C,Vn=!0,Ya=!0)}if($.isSkinnedMesh){Xe.setOptional(H,$,"bindMatrix"),Xe.setOptional(H,$,"bindMatrixInverse");const Dn=$.skeleton;Dn&&(Dn.boneTexture===null&&Dn.computeBoneTexture(),Xe.setValue(H,"boneTexture",Dn.boneTexture,L))}$.isBatchedMesh&&(Xe.setOptional(H,$,"batchingTexture"),Xe.setValue(H,"batchingTexture",$._matricesTexture,L),Xe.setOptional(H,$,"batchingIdTexture"),Xe.setValue(H,"batchingIdTexture",$._indirectTexture,L),Xe.setOptional(H,$,"batchingColorTexture"),$._colorsTexture!==null&&Xe.setValue(H,"batchingColorTexture",$._colorsTexture,L));const _n=lt.morphAttributes;if((_n.position!==void 0||_n.normal!==void 0||_n.color!==void 0)&&re.update($,lt,Tn),(Vn||Kt.receiveShadow!==$.receiveShadow)&&(Kt.receiveShadow=$.receiveShadow,Xe.setValue(H,"receiveShadow",$.receiveShadow)),ut.isMeshGouraudMaterial&&ut.envMap!==null&&(un.envMap.value=Ot,un.flipEnvMap.value=Ot.isCubeTexture&&Ot.isRenderTargetTexture===!1?-1:1),ut.isMeshStandardMaterial&&ut.envMap===null&&J.environment!==null&&(un.envMapIntensity.value=J.environmentIntensity),Vn&&(Xe.setValue(H,"toneMappingExposure",N.toneMappingExposure),Kt.needsLights&&nc(un,Ya),Tt&&ut.fog===!0&&Bt.refreshFogUniforms(un,Tt),Bt.refreshMaterialUniforms(un,ut,q,st,y.state.transmissionRenderTarget[C.id]),af.upload(H,Xa(Kt),un,L)),ut.isShaderMaterial&&ut.uniformsNeedUpdate===!0&&(af.upload(H,Xa(Kt),un,L),ut.uniformsNeedUpdate=!1),ut.isSpriteMaterial&&Xe.setValue(H,"center",$.center),Xe.setValue(H,"modelViewMatrix",$.modelViewMatrix),Xe.setValue(H,"normalMatrix",$.normalMatrix),Xe.setValue(H,"modelMatrix",$.matrixWorld),ut.isShaderMaterial||ut.isRawShaderMaterial){const Dn=ut.uniformsGroups;for(let Nn=0,ys=Dn.length;Nn<ys;Nn++){const ma=Dn[Nn];X.update(ma,Tn),X.bind(ma,Tn)}}return Tn}function nc(C,J){C.ambientLightColor.needsUpdate=J,C.lightProbe.needsUpdate=J,C.directionalLights.needsUpdate=J,C.directionalLightShadows.needsUpdate=J,C.pointLights.needsUpdate=J,C.pointLightShadows.needsUpdate=J,C.spotLights.needsUpdate=J,C.spotLightShadows.needsUpdate=J,C.rectAreaLights.needsUpdate=J,C.hemisphereLights.needsUpdate=J}function jo(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(C,J,lt){Et.get(C.texture).__webglTexture=J,Et.get(C.depthTexture).__webglTexture=lt;const ut=Et.get(C);ut.__hasExternalTextures=!0,ut.__autoAllocateDepthBuffer=lt===void 0,ut.__autoAllocateDepthBuffer||se.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ut.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,J){const lt=Et.get(C);lt.__webglFramebuffer=J,lt.__useDefaultFramebuffer=J===void 0};const Lr=H.createFramebuffer();this.setRenderTarget=function(C,J=0,lt=0){I=C,F=J,z=lt;let ut=!0,$=null,Tt=!1,Nt=!1;if(C){const Ot=Et.get(C);if(Ot.__useDefaultFramebuffer!==void 0)tt.bindFramebuffer(H.FRAMEBUFFER,null),ut=!1;else if(Ot.__webglFramebuffer===void 0)L.setupRenderTarget(C);else if(Ot.__hasExternalTextures)L.rebindTextures(C,Et.get(C.texture).__webglTexture,Et.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const $t=C.depthTexture;if(Ot.__boundDepthTexture!==$t){if($t!==null&&Et.has($t)&&(C.width!==$t.image.width||C.height!==$t.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(C)}}const ne=C.texture;(ne.isData3DTexture||ne.isDataArrayTexture||ne.isCompressedArrayTexture)&&(Nt=!0);const oe=Et.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(oe[J])?$=oe[J][lt]:$=oe[J],Tt=!0):C.samples>0&&L.useMultisampledRTT(C)===!1?$=Et.get(C).__webglMultisampledFramebuffer:Array.isArray(oe)?$=oe[lt]:$=oe,B.copy(C.viewport),it.copy(C.scissor),at=C.scissorTest}else B.copy(At).multiplyScalar(q).floor(),it.copy(Yt).multiplyScalar(q).floor(),at=ie;if(lt!==0&&($=Lr),tt.bindFramebuffer(H.FRAMEBUFFER,$)&&ut&&tt.drawBuffers(C,$),tt.viewport(B),tt.scissor(it),tt.setScissorTest(at),Tt){const Ot=Et.get(C.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ot.__webglTexture,lt)}else if(Nt){const Ot=Et.get(C.texture),ne=J;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,Ot.__webglTexture,lt,ne)}else if(C!==null&&lt!==0){const Ot=Et.get(C.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Ot.__webglTexture,lt)}D=-1},this.readRenderTargetPixels=function(C,J,lt,ut,$,Tt,Nt){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=Et.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Nt!==void 0&&(Dt=Dt[Nt]),Dt){tt.bindFramebuffer(H.FRAMEBUFFER,Dt);try{const Ot=C.texture,ne=Ot.format,oe=Ot.type;if(!Jt.textureFormatReadable(ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Jt.textureTypeReadable(oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}J>=0&&J<=C.width-ut&&lt>=0&&lt<=C.height-$&&H.readPixels(J,lt,ut,$,he.convert(ne),he.convert(oe),Tt)}finally{const Ot=I!==null?Et.get(I).__webglFramebuffer:null;tt.bindFramebuffer(H.FRAMEBUFFER,Ot)}}},this.readRenderTargetPixelsAsync=async function(C,J,lt,ut,$,Tt,Nt){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=Et.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Nt!==void 0&&(Dt=Dt[Nt]),Dt){const Ot=C.texture,ne=Ot.format,oe=Ot.type;if(!Jt.textureFormatReadable(ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Jt.textureTypeReadable(oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(J>=0&&J<=C.width-ut&&lt>=0&&lt<=C.height-$){tt.bindFramebuffer(H.FRAMEBUFFER,Dt);const $t=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,$t),H.bufferData(H.PIXEL_PACK_BUFFER,Tt.byteLength,H.STREAM_READ),H.readPixels(J,lt,ut,$,he.convert(ne),he.convert(oe),0);const Ce=I!==null?Et.get(I).__webglFramebuffer:null;tt.bindFramebuffer(H.FRAMEBUFFER,Ce);const Ne=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await _T(H,Ne,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,$t),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,Tt),H.deleteBuffer($t),H.deleteSync(Ne),Tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(C,J=null,lt=0){C.isTexture!==!0&&(Mo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),J=arguments[0]||null,C=arguments[1]);const ut=Math.pow(2,-lt),$=Math.floor(C.image.width*ut),Tt=Math.floor(C.image.height*ut),Nt=J!==null?J.x:0,Dt=J!==null?J.y:0;L.setTexture2D(C,0),H.copyTexSubImage2D(H.TEXTURE_2D,lt,0,0,Nt,Dt,$,Tt),tt.unbindTexture()};const mf=H.createFramebuffer(),ic=H.createFramebuffer();this.copyTextureToTexture=function(C,J,lt=null,ut=null,$=0,Tt=null){C.isTexture!==!0&&(Mo("WebGLRenderer: copyTextureToTexture function signature has changed."),ut=arguments[0]||null,C=arguments[1],J=arguments[2],Tt=arguments[3]||0,lt=null),Tt===null&&($!==0?(Mo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Tt=$,$=0):Tt=0);let Nt,Dt,Ot,ne,oe,$t,Ce,Ne,qe;const je=C.isCompressedTexture?C.mipmaps[Tt]:C.image;if(lt!==null)Nt=lt.max.x-lt.min.x,Dt=lt.max.y-lt.min.y,Ot=lt.isBox3?lt.max.z-lt.min.z:1,ne=lt.min.x,oe=lt.min.y,$t=lt.isBox3?lt.min.z:0;else{const _n=Math.pow(2,-$);Nt=Math.floor(je.width*_n),Dt=Math.floor(je.height*_n),C.isDataArrayTexture?Ot=je.depth:C.isData3DTexture?Ot=Math.floor(je.depth*_n):Ot=1,ne=0,oe=0,$t=0}ut!==null?(Ce=ut.x,Ne=ut.y,qe=ut.z):(Ce=0,Ne=0,qe=0);const Me=he.convert(J.format),Kt=he.convert(J.type);let en;J.isData3DTexture?(L.setTexture3D(J,0),en=H.TEXTURE_3D):J.isDataArrayTexture||J.isCompressedArrayTexture?(L.setTexture2DArray(J,0),en=H.TEXTURE_2D_ARRAY):(L.setTexture2D(J,0),en=H.TEXTURE_2D),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,J.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,J.unpackAlignment);const Te=H.getParameter(H.UNPACK_ROW_LENGTH),Tn=H.getParameter(H.UNPACK_IMAGE_HEIGHT),Je=H.getParameter(H.UNPACK_SKIP_PIXELS),Vn=H.getParameter(H.UNPACK_SKIP_ROWS),Ya=H.getParameter(H.UNPACK_SKIP_IMAGES);H.pixelStorei(H.UNPACK_ROW_LENGTH,je.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,je.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,ne),H.pixelStorei(H.UNPACK_SKIP_ROWS,oe),H.pixelStorei(H.UNPACK_SKIP_IMAGES,$t);const Xe=C.isDataArrayTexture||C.isData3DTexture,un=J.isDataArrayTexture||J.isData3DTexture;if(C.isDepthTexture){const _n=Et.get(C),Dn=Et.get(J),Nn=Et.get(_n.__renderTarget),ys=Et.get(Dn.__renderTarget);tt.bindFramebuffer(H.READ_FRAMEBUFFER,Nn.__webglFramebuffer),tt.bindFramebuffer(H.DRAW_FRAMEBUFFER,ys.__webglFramebuffer);for(let ma=0;ma<Ot;ma++)Xe&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Et.get(C).__webglTexture,$,$t+ma),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Et.get(J).__webglTexture,Tt,qe+ma)),H.blitFramebuffer(ne,oe,Nt,Dt,Ce,Ne,Nt,Dt,H.DEPTH_BUFFER_BIT,H.NEAREST);tt.bindFramebuffer(H.READ_FRAMEBUFFER,null),tt.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if($!==0||C.isRenderTargetTexture||Et.has(C)){const _n=Et.get(C),Dn=Et.get(J);tt.bindFramebuffer(H.READ_FRAMEBUFFER,mf),tt.bindFramebuffer(H.DRAW_FRAMEBUFFER,ic);for(let Nn=0;Nn<Ot;Nn++)Xe?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,_n.__webglTexture,$,$t+Nn):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,_n.__webglTexture,$),un?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Dn.__webglTexture,Tt,qe+Nn):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Dn.__webglTexture,Tt),$!==0?H.blitFramebuffer(ne,oe,Nt,Dt,Ce,Ne,Nt,Dt,H.COLOR_BUFFER_BIT,H.NEAREST):un?H.copyTexSubImage3D(en,Tt,Ce,Ne,qe+Nn,ne,oe,Nt,Dt):H.copyTexSubImage2D(en,Tt,Ce,Ne,ne,oe,Nt,Dt);tt.bindFramebuffer(H.READ_FRAMEBUFFER,null),tt.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else un?C.isDataTexture||C.isData3DTexture?H.texSubImage3D(en,Tt,Ce,Ne,qe,Nt,Dt,Ot,Me,Kt,je.data):J.isCompressedArrayTexture?H.compressedTexSubImage3D(en,Tt,Ce,Ne,qe,Nt,Dt,Ot,Me,je.data):H.texSubImage3D(en,Tt,Ce,Ne,qe,Nt,Dt,Ot,Me,Kt,je):C.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,Tt,Ce,Ne,Nt,Dt,Me,Kt,je.data):C.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,Tt,Ce,Ne,je.width,je.height,Me,je.data):H.texSubImage2D(H.TEXTURE_2D,Tt,Ce,Ne,Nt,Dt,Me,Kt,je);H.pixelStorei(H.UNPACK_ROW_LENGTH,Te),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,Tn),H.pixelStorei(H.UNPACK_SKIP_PIXELS,Je),H.pixelStorei(H.UNPACK_SKIP_ROWS,Vn),H.pixelStorei(H.UNPACK_SKIP_IMAGES,Ya),Tt===0&&J.generateMipmaps&&H.generateMipmap(en),tt.unbindTexture()},this.copyTextureToTexture3D=function(C,J,lt=null,ut=null,$=0){return C.isTexture!==!0&&(Mo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),lt=arguments[0]||null,ut=arguments[1]||null,C=arguments[2],J=arguments[3],$=arguments[4]||0),Mo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(C,J,lt,ut,$)},this.initRenderTarget=function(C){Et.get(C).__webglFramebuffer===void 0&&L.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?L.setTextureCube(C,0):C.isData3DTexture?L.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?L.setTexture2DArray(C,0):L.setTexture2D(C,0),tt.unbindTexture()},this.resetState=function(){F=0,z=0,I=null,tt.reset(),He.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fa}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorspace=ze._getDrawingBufferColorSpace(e),i.unpackColorSpace=ze._getUnpackColorSpace()}}const cS={type:"change"},Im={type:"start"},hx={type:"end"},qu=new Nm,uS=new wr,VC=Math.cos(70*XS.DEG2RAD),yn=new Z,ai=2*Math.PI,Ve={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},bp=1e-6;class jC extends sw{constructor(e,i=null){super(e,i),this.state=Ve.NONE,this.enabled=!0,this.target=new Z,this.cursor=new Z,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ro.ROTATE,MIDDLE:Ro.DOLLY,RIGHT:Ro.PAN},this.touches={ONE:bo.ROTATE,TWO:bo.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new Z,this._lastQuaternion=new gs,this._lastTargetPosition=new Z,this._quat=new gs().setFromUnitVectors(e.up,new Z(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Py,this._sphericalDelta=new Py,this._scale=1,this._panOffset=new Z,this._rotateStart=new fe,this._rotateEnd=new fe,this._rotateDelta=new fe,this._panStart=new fe,this._panEnd=new fe,this._panDelta=new fe,this._dollyStart=new fe,this._dollyEnd=new fe,this._dollyDelta=new fe,this._dollyDirection=new Z,this._mouse=new fe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=YC.bind(this),this._onPointerDown=XC.bind(this),this._onPointerUp=WC.bind(this),this._onContextMenu=t3.bind(this),this._onMouseWheel=KC.bind(this),this._onKeyDown=QC.bind(this),this._onTouchStart=JC.bind(this),this._onTouchMove=$C.bind(this),this._onMouseDown=qC.bind(this),this._onMouseMove=ZC.bind(this),this._interceptControlDown=e3.bind(this),this._interceptControlUp=n3.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(cS),this.update(),this.state=Ve.NONE}update(e=null){const i=this.object.position;yn.copy(i).sub(this.target),yn.applyQuaternion(this._quat),this._spherical.setFromVector3(yn),this.autoRotate&&this.state===Ve.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let r=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(r)&&isFinite(l)&&(r<-Math.PI?r+=ai:r>Math.PI&&(r-=ai),l<-Math.PI?l+=ai:l>Math.PI&&(l-=ai),r<=l?this._spherical.theta=Math.max(r,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(r+l)/2?Math.max(r,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let u=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const d=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),u=d!=this._spherical.radius}if(yn.setFromSpherical(this._spherical),yn.applyQuaternion(this._quatInverse),i.copy(this.target).add(yn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let d=null;if(this.object.isPerspectiveCamera){const h=yn.length();d=this._clampDistance(h*this._scale);const p=h-d;this.object.position.addScaledVector(this._dollyDirection,p),this.object.updateMatrixWorld(),u=!!p}else if(this.object.isOrthographicCamera){const h=new Z(this._mouse.x,this._mouse.y,0);h.unproject(this.object);const p=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),u=p!==this.object.zoom;const g=new Z(this._mouse.x,this._mouse.y,0);g.unproject(this.object),this.object.position.sub(g).add(h),this.object.updateMatrixWorld(),d=yn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;d!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(d).add(this.object.position):(qu.origin.copy(this.object.position),qu.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(qu.direction))<VC?this.object.lookAt(this.target):(uS.setFromNormalAndCoplanarPoint(this.object.up,this.target),qu.intersectPlane(uS,this.target))))}else if(this.object.isOrthographicCamera){const d=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),d!==this.object.zoom&&(this.object.updateProjectionMatrix(),u=!0)}return this._scale=1,this._performCursorZoom=!1,u||this._lastPosition.distanceToSquared(this.object.position)>bp||8*(1-this._lastQuaternion.dot(this.object.quaternion))>bp||this._lastTargetPosition.distanceToSquared(this.target)>bp?(this.dispatchEvent(cS),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ai/60*this.autoRotateSpeed*e:ai/60/60*this.autoRotateSpeed}_getZoomScale(e){const i=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,i){yn.setFromMatrixColumn(i,0),yn.multiplyScalar(-e),this._panOffset.add(yn)}_panUp(e,i){this.screenSpacePanning===!0?yn.setFromMatrixColumn(i,1):(yn.setFromMatrixColumn(i,0),yn.crossVectors(this.object.up,yn)),yn.multiplyScalar(e),this._panOffset.add(yn)}_pan(e,i){const r=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;yn.copy(l).sub(this.target);let u=yn.length();u*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*u/r.clientHeight,this.object.matrix),this._panUp(2*i*u/r.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/r.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/r.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const r=this.domElement.getBoundingClientRect(),l=e-r.left,u=i-r.top,d=r.width,h=r.height;this._mouse.x=l/d*2-1,this._mouse.y=-(u/h)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(ai*this._rotateDelta.x/i.clientHeight),this._rotateUp(ai*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let i=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(ai*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-ai*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(ai*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-ai*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._rotateStart.set(r,l)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panStart.set(r,l)}}_handleTouchStartDolly(e){const i=this._getSecondPointerPosition(e),r=e.pageX-i.x,l=e.pageY-i.y,u=Math.sqrt(r*r+l*l);this._dollyStart.set(0,u)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const r=this._getSecondPointerPosition(e),l=.5*(e.pageX+r.x),u=.5*(e.pageY+r.y);this._rotateEnd.set(l,u)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(ai*this._rotateDelta.x/i.clientHeight),this._rotateUp(ai*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panEnd.set(r,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const i=this._getSecondPointerPosition(e),r=e.pageX-i.x,l=e.pageY-i.y,u=Math.sqrt(r*r+l*l);this._dollyEnd.set(0,u),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const d=(e.pageX+i.x)*.5,h=(e.pageY+i.y)*.5;this._updateZoomParameters(d,h)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(e){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId)return!0;return!1}_trackPointer(e){let i=this._pointerPositions[e.pointerId];i===void 0&&(i=new fe,this._pointerPositions[e.pointerId]=i),i.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const i=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(e){const i=e.deltaMode,r={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(i){case 1:r.deltaY*=16;break;case 2:r.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(r.deltaY*=10),r}}function XC(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s)))}function YC(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function WC(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(hx),this.state=Ve.NONE;break;case 1:const e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y});break}}function qC(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ro.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=Ve.DOLLY;break;case Ro.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=Ve.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=Ve.ROTATE}break;case Ro.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=Ve.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=Ve.PAN}break;default:this.state=Ve.NONE}this.state!==Ve.NONE&&this.dispatchEvent(Im)}function ZC(s){switch(this.state){case Ve.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case Ve.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case Ve.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function KC(s){this.enabled===!1||this.enableZoom===!1||this.state!==Ve.NONE||(s.preventDefault(),this.dispatchEvent(Im),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(hx))}function QC(s){this.enabled!==!1&&this._handleKeyDown(s)}function JC(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case bo.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=Ve.TOUCH_ROTATE;break;case bo.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=Ve.TOUCH_PAN;break;default:this.state=Ve.NONE}break;case 2:switch(this.touches.TWO){case bo.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=Ve.TOUCH_DOLLY_PAN;break;case bo.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=Ve.TOUCH_DOLLY_ROTATE;break;default:this.state=Ve.NONE}break;default:this.state=Ve.NONE}this.state!==Ve.NONE&&this.dispatchEvent(Im)}function $C(s){switch(this._trackPointer(s),this.state){case Ve.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case Ve.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case Ve.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case Ve.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=Ve.NONE}}function t3(s){this.enabled!==!1&&s.preventDefault()}function e3(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function n3(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}Lt.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new fe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};ri.line={uniforms:Um.merge([Lt.common,Lt.fog,Lt.line]),vertexShader:`
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
		`};class dx extends Va{constructor(e){super({type:"LineMaterial",uniforms:Um.clone(ri.line.uniforms),vertexShader:ri.line.vertexShader,fragmentShader:ri.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const fS=new ja,Zu=new Z;class px extends ew{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],i=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],r=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(r),this.setAttribute("position",new Sn(e,3)),this.setAttribute("uv",new Sn(i,2))}applyMatrix4(e){const i=this.attributes.instanceStart,r=this.attributes.instanceEnd;return i!==void 0&&(i.applyMatrix4(e),r.applyMatrix4(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const r=new vm(i,6,1);return this.setAttribute("instanceStart",new Rr(r,3,0)),this.setAttribute("instanceEnd",new Rr(r,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const r=new vm(i,6,1);return this.setAttribute("instanceColorStart",new Rr(r,3,0)),this.setAttribute("instanceColorEnd",new Rr(r,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new qT(e.geometry)),this}fromLineSegments(e){const i=e.geometry;return this.setPositions(i.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ja);const e=this.attributes.instanceStart,i=this.attributes.instanceEnd;e!==void 0&&i!==void 0&&(this.boundingBox.setFromBufferAttribute(e),fS.setFromBufferAttribute(i),this.boundingBox.union(fS))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fo),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,i=this.attributes.instanceEnd;if(e!==void 0&&i!==void 0){const r=this.boundingSphere.center;this.boundingBox.getCenter(r);let l=0;for(let u=0,d=e.count;u<d;u++)Zu.fromBufferAttribute(e,u),l=Math.max(l,r.distanceToSquared(Zu)),Zu.fromBufferAttribute(i,u),l=Math.max(l,r.distanceToSquared(Zu));this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}const Tp=new We,hS=new Z,dS=new Z,In=new We,Fn=new We,oa=new We,wp=new Z,Ap=new $e,Hn=new iw,pS=new Z,Ku=new ja,Qu=new Fo,la=new We;let ca,ds;function mS(s,e,i){return la.set(0,0,-e,1).applyMatrix4(s.projectionMatrix),la.multiplyScalar(1/la.w),la.x=ds/i.width,la.y=ds/i.height,la.applyMatrix4(s.projectionMatrixInverse),la.multiplyScalar(1/la.w),Math.abs(Math.max(la.x,la.y))}function i3(s,e){const i=s.matrixWorld,r=s.geometry,l=r.attributes.instanceStart,u=r.attributes.instanceEnd,d=Math.min(r.instanceCount,l.count);for(let h=0,p=d;h<p;h++){Hn.start.fromBufferAttribute(l,h),Hn.end.fromBufferAttribute(u,h),Hn.applyMatrix4(i);const g=new Z,_=new Z;ca.distanceSqToSegment(Hn.start,Hn.end,_,g),_.distanceTo(g)<ds*.5&&e.push({point:_,pointOnLine:g,distance:ca.origin.distanceTo(_),object:s,face:null,faceIndex:h,uv:null,uv1:null})}}function a3(s,e,i){const r=e.projectionMatrix,u=s.material.resolution,d=s.matrixWorld,h=s.geometry,p=h.attributes.instanceStart,g=h.attributes.instanceEnd,_=Math.min(h.instanceCount,p.count),m=-e.near;ca.at(1,oa),oa.w=1,oa.applyMatrix4(e.matrixWorldInverse),oa.applyMatrix4(r),oa.multiplyScalar(1/oa.w),oa.x*=u.x/2,oa.y*=u.y/2,oa.z=0,wp.copy(oa),Ap.multiplyMatrices(e.matrixWorldInverse,d);for(let S=0,x=_;S<x;S++){if(In.fromBufferAttribute(p,S),Fn.fromBufferAttribute(g,S),In.w=1,Fn.w=1,In.applyMatrix4(Ap),Fn.applyMatrix4(Ap),In.z>m&&Fn.z>m)continue;if(In.z>m){const O=In.z-Fn.z,N=(In.z-m)/O;In.lerp(Fn,N)}else if(Fn.z>m){const O=Fn.z-In.z,N=(Fn.z-m)/O;Fn.lerp(In,N)}In.applyMatrix4(r),Fn.applyMatrix4(r),In.multiplyScalar(1/In.w),Fn.multiplyScalar(1/Fn.w),In.x*=u.x/2,In.y*=u.y/2,Fn.x*=u.x/2,Fn.y*=u.y/2,Hn.start.copy(In),Hn.start.z=0,Hn.end.copy(Fn),Hn.end.z=0;const T=Hn.closestPointToPointParameter(wp,!0);Hn.at(T,pS);const M=XS.lerp(In.z,Fn.z,T),y=M>=-1&&M<=1,U=wp.distanceTo(pS)<ds*.5;if(y&&U){Hn.start.fromBufferAttribute(p,S),Hn.end.fromBufferAttribute(g,S),Hn.start.applyMatrix4(d),Hn.end.applyMatrix4(d);const O=new Z,N=new Z;ca.distanceSqToSegment(Hn.start,Hn.end,N,O),i.push({point:N,pointOnLine:O,distance:ca.origin.distanceTo(N),object:s,face:null,faceIndex:S,uv:null,uv1:null})}}}class r3 extends yi{constructor(e=new px,i=new dx({color:Math.random()*16777215})){super(e,i),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,i=e.attributes.instanceStart,r=e.attributes.instanceEnd,l=new Float32Array(2*i.count);for(let d=0,h=0,p=i.count;d<p;d++,h+=2)hS.fromBufferAttribute(i,d),dS.fromBufferAttribute(r,d),l[h]=h===0?0:l[h-1],l[h+1]=l[h]+hS.distanceTo(dS);const u=new vm(l,2,1);return e.setAttribute("instanceDistanceStart",new Rr(u,1,0)),e.setAttribute("instanceDistanceEnd",new Rr(u,1,1)),this}raycast(e,i){const r=this.material.worldUnits,l=e.camera;l===null&&!r&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const u=e.params.Line2!==void 0&&e.params.Line2.threshold||0;ca=e.ray;const d=this.matrixWorld,h=this.geometry,p=this.material;ds=p.linewidth+u,h.boundingSphere===null&&h.computeBoundingSphere(),Qu.copy(h.boundingSphere).applyMatrix4(d);let g;if(r)g=ds*.5;else{const m=Math.max(l.near,Qu.distanceToPoint(ca.origin));g=mS(l,m,p.resolution)}if(Qu.radius+=g,ca.intersectsSphere(Qu)===!1)return;h.boundingBox===null&&h.computeBoundingBox(),Ku.copy(h.boundingBox).applyMatrix4(d);let _;if(r)_=ds*.5;else{const m=Math.max(l.near,Ku.distanceToPoint(ca.origin));_=mS(l,m,p.resolution)}Ku.expandByScalar(_),ca.intersectsBox(Ku)!==!1&&(r?i3(this,i):a3(this,l,i))}onBeforeRender(e){const i=this.material.uniforms;i&&i.resolution&&(e.getViewport(Tp),this.material.uniforms.resolution.value.set(Tp.z,Tp.w))}}const mx=Pt.forwardRef(({segments:s,turtle:e,showTurtle:i=!0},r)=>{const l=Pt.useRef(null),[u,d]=Pt.useState(null),h=Pt.useRef(null),p=()=>getComputedStyle(document.documentElement).colorScheme==="dark"||getComputedStyle(document.documentElement).colorScheme!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches,g=Pt.useCallback(()=>{const x=h.current;if(!x)return;const E=p();x.scene.background=new Se(E?1119771:16513783)},[]);Pt.useEffect(()=>{const x=l.current;if(!x)return;let E;try{if(E=new GC({antialias:!0,preserveDrawingBuffer:!0}),!E.getContext())throw new Error("Brak kontekstu WebGL.")}catch{d("Widok 3D wymaga obsługi WebGL, która jest niedostępna w tym środowisku. Tryb 2D działa bez ograniczeń.");return}const T=x.clientWidth||600,M=x.clientHeight||400;E.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),E.setSize(T,M),E.domElement.className="viewport-canvas",E.domElement.setAttribute("aria-label","Scena 3D"),x.appendChild(E.domElement);const y=new VT;y.background=new Se(p()?1119771:16513783);const U=new Li(45,T/M,.5,25e4);U.up.set(0,0,1),U.position.set(160,-210,150);const O=new jC(U,E.domElement);O.enableDamping=!0,O.dampingFactor=.08,O.target.set(0,0,0),O.update(),y.add(new tw(16777215,.75));const N=new $T(16777215,.8);N.position.set(150,-100,300),y.add(N);const G=new aw(400,20,8952234,5596791);G.rotation.x=Math.PI/2,G.material.transparent=!0,G.material.opacity=.28,y.add(G);const F=new rw(60);y.add(F);const z=new To;y.add(z);const I=new To,D=new zy({color:1476202,roughness:.4,metalness:.1}),A=new Pm(5.5,16,12),B=new yi(A,D);I.add(B);const it=new _s(1.6,8,5),at=new zy({color:12678717,roughness:.4}),ft=new yi(it,at);ft.position.set(0,-2,3.5),I.add(ft);const ct=new _s(12,3,1.4),V=new yi(ct,D);V.position.set(0,-3,0),I.add(V),y.add(I),h.current={renderer:E,scene:y,camera:U,controls:O,linesGroup:z,turtleGroup:I,turtleBodyMat:D,materials:[],grid:G};let st=0;const q=()=>{st=requestAnimationFrame(q),O.update(),E.render(y,U)};q();const St=new ResizeObserver(()=>{const Yt=x.clientWidth,ie=x.clientHeight;if(!(Yt===0||ie===0)){U.aspect=Yt/ie,U.updateProjectionMatrix(),E.setSize(Yt,ie);for(const R of h.current?.materials??[])R.resolution.set(Yt,ie)}});St.observe(x);const vt=window.matchMedia("(prefers-color-scheme: dark)");vt.addEventListener("change",g);const At=new MutationObserver(g);return At.observe(document.querySelector('meta[name="color-scheme"]'),{attributes:!0,attributeFilter:["content"]}),()=>{cancelAnimationFrame(st),St.disconnect(),vt.removeEventListener("change",g),At.disconnect(),O.dispose(),E.dispose(),E.domElement.parentNode===x&&x.removeChild(E.domElement),h.current=null}},[g]),Pt.useEffect(()=>{const x=h.current;if(!x)return;for(;x.linesGroup.children.length>0;){const U=x.linesGroup.children[0];U.geometry.dispose(),x.linesGroup.remove(U)}for(const U of x.materials)U.dispose();x.materials=[];const E=l.current?.clientWidth||600,T=l.current?.clientHeight||400,M=new Map;for(const U of s){const O=`${U.color}|${U.width}`;let N=M.get(O);N||(N={color:U.color,width:U.width,positions:[]},M.set(O,N)),N.positions.push(U.from[0],U.from[1],U.from[2],U.to[0],U.to[1],U.to[2])}for(const U of M.values()){const O=new px;O.setPositions(U.positions);const N=new dx({color:new Se(U.color).getHex(),linewidth:U.width,resolution:new fe(E,T)});x.materials.push(N);const G=new r3(O,N);x.linesGroup.add(G)}x.turtleGroup.visible=i,x.turtleGroup.position.set(e.pos[0],e.pos[1],e.pos[2]);const y=new $e().makeBasis(new Z(...e.right),new Z(...e.heading),new Z(...e.up));x.turtleGroup.quaternion.setFromRotationMatrix(y),x.turtleBodyMat.color.set(e.penDown?e.color:"#8899aa"),x.renderer.render(x.scene,x.camera)},[s,e,i]);const _=Pt.useCallback((x,E)=>{const T=h.current;if(!T)return;const M=x??s,y=E??e,U=new ja;if(M.length===0)U.expandByPoint(new Z(0,0,0)),U.expandByPoint(new Z(...y.pos)),U.expandByScalar(80);else for(const D of M)U.expandByPoint(new Z(...D.from)),U.expandByPoint(new Z(...D.to));const O=U.getCenter(new Z),N=U.getSize(new Z),G=Math.max(N.x,N.y,N.z,40),F=T.camera.fov*Math.PI/180,z=G/2/Math.tan(F/2)*1.45,I=new Z(.6,-.8,.55).normalize();T.controls.target.copy(O),T.camera.position.copy(O).addScaledVector(I,z),T.controls.update(),T.renderer.render(T.scene,T.camera)},[s,e]),m=Pt.useCallback(()=>{const x=h.current;x&&(x.controls.target.set(0,0,0),x.camera.position.set(160,-210,150),x.controls.update(),x.renderer.render(x.scene,x.camera))},[]),S=x=>{const E=h.current;if(!E)return;const T=E.camera.position.clone().sub(E.controls.target);T.multiplyScalar(x),E.camera.position.copy(E.controls.target).add(T),E.controls.update()};return Pt.useImperativeHandle(r,()=>({fit:_,resetView:m,getCanvas:()=>h.current?.renderer.domElement??null}),[_,m]),u?j.jsx("div",{className:"viewport-container viewport-fallback",role:"status",children:j.jsxs("div",{className:"fallback-card",children:[j.jsx("h3",{children:"Tryb 3D niedostępny"}),j.jsx("p",{children:u})]})}):j.jsx("div",{className:"viewport-container",ref:l,children:j.jsxs("div",{className:"viewport-overlay-controls",role:"group","aria-label":"Widok 3D",children:[j.jsx("button",{type:"button",className:"icon-btn",onClick:()=>S(.8),"aria-label":"Przybliż kamerę 3D",title:"Przybliż",children:j.jsx(ES,{size:16})}),j.jsx("button",{type:"button",className:"icon-btn",onClick:()=>S(1.25),"aria-label":"Oddal kamerę 3D",title:"Oddal",children:j.jsx(bS,{size:16})}),j.jsx("button",{type:"button",className:"icon-btn",onClick:()=>_(),"aria-label":"Dopasuj bryłę do widoku",title:"Dopasuj",children:j.jsx(yS,{size:16})}),j.jsx("button",{type:"button",className:"icon-btn",onClick:m,"aria-label":"Resetuj kamerę 3D",title:"Reset kamery",children:j.jsx(Mm,{size:16})})]})})});mx.displayName="Viewport3D";function s3(s,e){s.toBlob(i=>{if(!i)return;const r=URL.createObjectURL(i),l=document.createElement("a");l.href=r,l.download=e,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(r)},"image/png")}function o3(s,e="program.logo"){const i=new Blob([s],{type:"text/plain;charset=utf-8"}),r=URL.createObjectURL(i),l=document.createElement("a");l.href=r,l.download=e,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(r)}function l3(s){const e=new TextEncoder().encode(s);let i="";for(let r=0;r<e.length;r++)i+=String.fromCharCode(e[r]);return btoa(i).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function c3(s){const e=s.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((s.length+3)%4),i=atob(e),r=new Uint8Array(i.length);for(let l=0;l<i.length;l++)r[l]=i.charCodeAt(l);return new TextDecoder().decode(r)}function u3(s,e){const i=JSON.stringify({m:s,c:e}),r=l3(i),l=new URL(window.location.href);return l.hash=`p=${r}`,l.toString()}function Rp(s){if(!s||!s.startsWith("#p="))return null;try{const e=c3(s.slice(3)),i=JSON.parse(e);return i&&(i.m==="2d"||i.m==="3d")&&typeof i.c=="string"?{mode:i.m,code:i.c}:null}catch{return null}}const gx="logomocja.draft.2d",_x="logomocja.draft.3d",vx="logomocja.savedSource.2d",yx="logomocja.savedSource.3d",Sx="logomocja.mode",xx="logomocja.challenges.solved",Sm="color-scheme";function uf(s){const e=s==="2d"?"kwadrat":"schody";return RS.find(i=>i.id===e)?.code??""}function Cp(s){try{const e=s==="2d"?gx:_x,i=localStorage.getItem(e);return i!==null?i:uf(s)}catch{return uf(s)}}function os(s,e){try{const i=s==="2d"?gx:_x;localStorage.setItem(i,e)}catch{}}function f3(s){try{const e=s==="2d"?vx:yx;return localStorage.getItem(e)??uf(s)}catch{return uf(s)}}function kl(s,e){try{const i=s==="2d"?vx:yx;localStorage.setItem(i,e)}catch{}}function gS(){try{return localStorage.getItem(Sx)==="3d"?"3d":"2d"}catch{return"2d"}}function Gl(s){try{localStorage.setItem(Sx,s)}catch{}}function h3(){try{const s=localStorage.getItem(xx);if(!s)return new Set;const e=JSON.parse(s);return Array.isArray(e)?new Set(e.filter(i=>typeof i=="string")):new Set}catch{return new Set}}function d3(s){try{localStorage.setItem(xx,JSON.stringify([...s]))}catch{}}function p3(){try{const s=localStorage.getItem(Sm);return s==="light"||s==="dark"?s:null}catch{return null}}function m3(s){try{s===null?localStorage.removeItem(Sm):localStorage.setItem(Sm,s)}catch{}}function Mx(){return window.matchMedia("(prefers-color-scheme: dark)").matches}function _S(s){return s?s==="dark":Mx()}function Dp(s){const e=document.querySelector('meta[name="color-scheme"]');e&&e.setAttribute("content",s??"light dark")}function g3(){const[s,e]=Pt.useState(()=>{const tt=Rp(window.location.hash);return tt?tt.mode:gS()}),[i,r]=Pt.useState(()=>{const tt=Rp(window.location.hash);return tt?tt.code:Cp(gS())}),[l,u]=Pt.useState([]),[d,h]=Pt.useState(()=>Tr()),[p,g]=Pt.useState(null),[_,m]=Pt.useState(null),[S,x]=Pt.useState("idle"),[E,T]=Pt.useState(85),[M,y]=Pt.useState("canvas"),[U,O]=Pt.useState("editor"),[N,G]=Pt.useState(!1),[F,z]=Pt.useState(!1),[I,D]=Pt.useState(null),[A,B]=Pt.useState(()=>h3()),[it,at]=Pt.useState(()=>p3()),ft=Pt.useRef(null),ct=Pt.useRef(null),V=Pt.useRef(null),st=Pt.useRef(null),q=Pt.useRef(E);q.current=E;const St=Pt.useCallback(tt=>{D(tt),window.setTimeout(()=>{D(bt=>bt===tt?null:bt)},2600)},[]),vt=Pt.useCallback(()=>{ct.current!==null&&(window.clearTimeout(ct.current),ct.current=null)},[]),At=Pt.useCallback(()=>{vt(),ft.current=null,u([]),h(Tr()),g(null),m(null),x("idle")},[vt]),Yt=Pt.useCallback((tt,bt,Et=!1)=>{vt(),ft.current=null;const{program:L,error:w}=jl(tt,bt);if(w||!L)return u([]),h(Tr()),g(w),m(null),x("finished"),{segments:[],error:w};const nt=new Vl(L,bt);for(;nt.step(););const pt=nt.snapshot();return u([...pt.segments]),h(pt.turtle),g(pt.error),m(null),x("finished"),Et&&requestAnimationFrame(()=>{V.current?.fit(pt.segments,pt.turtle)}),{segments:pt.segments,error:pt.error}},[vt]),ie=Pt.useCallback(()=>{vt();const tt=()=>{const Et=ft.current;if(!Et)return;const L=q.current;if(L>=100){for(;Et.step(););const mt=Et.snapshot();u([...mt.segments]),h(mt.turtle),g(mt.error),m(null),x("finished"),ft.current=null;return}const w=L>=80?Math.ceil((L-75)*1.2):1;let nt=!0;for(let mt=0;mt<w&&(nt=Et.step(),!!nt);mt++);const pt=Et.snapshot();if(u([...pt.segments]),h(pt.turtle),g(pt.error),m(pt.currentLine),!nt||pt.done||pt.error){x("finished"),m(null),ft.current=null;return}const Mt=L>=80?16:Math.round(340-L*4);ct.current=window.setTimeout(tt,Math.max(12,Mt))},bt=q.current>=100?0:16;ct.current=window.setTimeout(tt,bt)},[vt]),R=Pt.useCallback(()=>{if(q.current>=100){Yt(i,s,!1);return}vt();const{program:tt,error:bt}=jl(i,s);if(bt||!tt){ft.current=null,u([]),h(Tr()),g(bt),m(null),x("finished");return}const Et=new Vl(tt,s);ft.current=Et,u([]),h(Tr()),g(null),m(Et.getCurrentLine()),x("running"),ie()},[i,s,Yt,ie,vt]),Y=Pt.useCallback(()=>{vt();let tt=ft.current;if(!tt||S==="idle"||S==="finished"){const{program:L,error:w}=jl(i,s);if(w||!L){ft.current=null,u([]),h(Tr()),g(w),m(null),x("finished");return}tt=new Vl(L,s),ft.current=tt}const bt=tt.step(),Et=tt.snapshot();u([...Et.segments]),h(Et.turtle),g(Et.error),m(Et.currentLine),x(!bt||Et.done||Et.error?"finished":"paused"),(!bt||Et.done||Et.error)&&(ft.current=null)},[i,s,S,vt]),yt=Pt.useCallback(()=>{S==="running"?(vt(),x("paused")):S==="paused"&&ft.current&&(x("running"),ie())},[S,ie,vt]),ht=Pt.useCallback(tt=>{r(tt),os(s,tt),(S==="running"||S==="paused")&&(vt(),ft.current=null,m(null),x("idle"))},[s,S,vt]),Rt=Pt.useCallback(tt=>{tt!==s&&(os(s,i),Gl(tt),At(),e(tt),r(Cp(tt)))},[s,i,At]);Pt.useEffect(()=>{const tt=Rp(window.location.hash);tt?(os(tt.mode,tt.code),kl(tt.mode,tt.code),Gl(tt.mode),Yt(tt.code,tt.mode,!0)):Yt(i,s,!0)},[]),Pt.useEffect(()=>{Dp(it);const tt=bt=>{if(bt.key==="color-scheme"){const Et=bt.newValue==="light"||bt.newValue==="dark"?bt.newValue:null;at(Et),Dp(Et)}};return window.addEventListener("storage",tt),()=>window.removeEventListener("storage",tt)},[it]);const Xt=()=>{const bt=_S(it)?"light":"dark",Et=Mx(),L=bt==="dark"===Et?null:bt;m3(L),at(L),Dp(L)};Pt.useEffect(()=>{const tt=bt=>{(bt.ctrlKey||bt.metaKey)&&bt.key==="Enter"?(bt.preventDefault(),R()):bt.altKey&&(bt.key==="s"||bt.key==="S")?(bt.preventDefault(),Y()):bt.altKey&&(bt.key==="p"||bt.key==="P")?(bt.preventDefault(),yt()):bt.altKey&&(bt.key==="r"||bt.key==="R")&&(bt.preventDefault(),At())};return window.addEventListener("keydown",tt),()=>window.removeEventListener("keydown",tt)},[R,Y,yt,At]),Pt.useEffect(()=>{window.logomocja={version:"1.0.0",run:(tt,bt)=>Ql(tt,bt),open:(tt,bt)=>new Promise(Et=>{vt(),ft.current=null,e(bt),r(tt),Gl(bt),os(bt,tt),kl(bt,tt),y("canvas"),O("canvas");const L=Ql(tt,bt);if(u(L.segments),L.error)h(Tr());else{const{program:w}=jl(tt,bt);if(w){const nt=new Vl(w,bt);for(;nt.step(););h(nt.snapshot().turtle)}}g(L.error),m(null),x("finished"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{V.current?.fit(L.segments),requestAnimationFrame(()=>{Et(L)})})})})}},[vt]);const Ut=tt=>{const bt=tt===s?i:Cp(tt),Et=f3(tt);return bt.trim()!==""&&bt!==Et},Ct=tt=>{vt(),ft.current=null,e(tt.mode),r(tt.code),Gl(tt.mode),os(tt.mode,tt.code),kl(tt.mode,tt.code),y("canvas"),Yt(tt.code,tt.mode,!0)},kt=tt=>{vt(),ft.current=null,e(tt.mode),r(tt.starterCode),Gl(tt.mode),os(tt.mode,tt.starterCode),kl(tt.mode,tt.starterCode),At(),O("editor")},le=tt=>{B(bt=>{const Et=new Set(bt);return Et.add(tt),d3(Et),Et})},H=async()=>{const tt=u3(s,i);window.history.replaceState(null,"",tt);try{await navigator.clipboard.writeText(tt),St("Skopiowano link do schowka!")}catch{St("Zaktualizowano adres URL — możesz go skopiować z paska adresu.")}},ln=()=>{const tt=V.current?.getCanvas();if(!tt){St("Brak płótna do zapisania.");return}s3(tt,`logomocja-${s}.png`)},se=tt=>{const bt=tt.target.files?.[0];if(!bt)return;const Et=new FileReader;Et.onload=()=>{if(typeof Et.result=="string"){const L=Et.result;r(L),os(s,L),kl(s,L),Yt(L,s,!0),St(`Wczytano plik „${bt.name}”.`)}},Et.readAsText(bt,"utf-8"),tt.target.value=""},Jt=_S(it);return j.jsxs("div",{className:"app-shell",children:[j.jsxs("header",{className:"topbar",children:[j.jsxs("div",{className:"brand",children:[j.jsx("span",{className:"brand-mark","aria-hidden":"true",children:"🐢"}),j.jsx("span",{className:"brand-name",children:"Logomocja"}),j.jsxs("div",{className:"mode-switch",role:"group","aria-label":"Tryb rysowania",children:[j.jsx("button",{type:"button",className:`mode-btn${s==="2d"?" is-active":""}`,"aria-pressed":s==="2d",onClick:()=>Rt("2d"),children:"2D"}),j.jsx("button",{type:"button",className:`mode-btn${s==="3d"?" is-active":""}`,"aria-pressed":s==="3d",onClick:()=>Rt("3d"),children:"3D"})]})]}),j.jsxs("nav",{className:"topbar-actions","aria-label":"Narzędzia",children:[j.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:()=>G(!0),children:[j.jsx(Gb,{size:16}),j.jsx("span",{className:"btn-label",children:"Przykłady"})]}),j.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:()=>st.current?.click(),title:"Otwórz plik .logo",children:[j.jsx(Tb,{size:16}),j.jsx("span",{className:"btn-label",children:"Otwórz .logo"})]}),j.jsx("input",{ref:st,type:"file",accept:".logo,.txt",className:"sr-only",onChange:se,"aria-label":"Wybierz plik .logo"}),j.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:()=>o3(i),title:"Pobierz kod jako plik .logo",children:[j.jsx(Eb,{size:16}),j.jsx("span",{className:"btn-label",children:".logo"})]}),j.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:ln,title:"Zapisz rysunek jako obraz PNG",children:[j.jsx(Ab,{size:16}),j.jsx("span",{className:"btn-label",children:"PNG"})]}),j.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:H,title:"Utwórz link do programu",children:[j.jsx(Ib,{size:16}),j.jsx("span",{className:"btn-label",children:"Udostępnij"})]}),j.jsx("button",{type:"button",className:"icon-btn",onClick:Xt,"aria-label":Jt?"Przełącz na jasny motyw":"Przełącz na ciemny motyw",title:Jt?"Jasny motyw":"Ciemny motyw",children:Jt?j.jsx(jb,{size:18}):j.jsx(Ub,{size:18})}),j.jsx("button",{type:"button",className:"icon-btn",onClick:()=>z(!0),"aria-label":"Skróty klawiszowe i pomoc",title:"Skróty klawiszowe",children:j.jsx(xb,{size:18})})]})]}),j.jsxs("div",{className:"mobile-tabs",role:"tablist","aria-label":"Widoki",children:[j.jsx("button",{type:"button",role:"tab","aria-selected":U==="editor",className:`mobile-tab${U==="editor"?" is-active":""}`,onClick:()=>O("editor"),children:"Edytor"}),j.jsxs("button",{type:"button",role:"tab","aria-selected":U==="canvas",className:`mobile-tab${U==="canvas"?" is-active":""}`,onClick:()=>{O("canvas"),y("canvas")},children:["Widok ",s.toUpperCase()]}),j.jsx("button",{type:"button",role:"tab","aria-selected":U==="challenges",className:`mobile-tab${U==="challenges"?" is-active":""}`,onClick:()=>{O("challenges"),y("challenges")},children:"Wyzwania"}),j.jsx("button",{type:"button",role:"tab","aria-selected":U==="reference",className:`mobile-tab${U==="reference"?" is-active":""}`,onClick:()=>{O("reference"),y("reference")},children:"Polecenia"})]}),j.jsxs("main",{className:"workspace",children:[j.jsxs("section",{className:`pane-editor${U==="editor"?" is-mobile-visible":""}`,"aria-label":"Edytor i sterowanie",children:[j.jsxs("div",{className:"exec-bar",children:[j.jsxs("div",{className:"exec-buttons",children:[j.jsxs("button",{type:"button",className:"btn btn-primary",onClick:R,title:"Uruchom program (Ctrl+Enter)",children:[j.jsx(SS,{size:15}),"Uruchom"]}),j.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:Y,title:"Wykonaj jeden krok (Alt+S)",children:[j.jsx(Hb,{size:15}),"Krok"]}),j.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:yt,disabled:S!=="running"&&S!=="paused",title:"Wstrzymaj lub wznów animację (Alt+P)",children:[j.jsx(Lb,{size:15}),S==="paused"?"Wznów":"Pauza"]}),j.jsxs("button",{type:"button",className:"btn btn-secondary",onClick:At,title:"Resetuj rysunek i żółwia (Alt+R)",children:[j.jsx(Mm,{size:15}),"Resetuj"]})]}),j.jsxs("label",{className:"speed-control",children:[j.jsx("span",{children:"Tempo"}),j.jsx("input",{type:"range",min:1,max:100,value:E,onChange:tt=>T(Number(tt.target.value)),"aria-label":"Tempo animacji żółwia"}),j.jsx("span",{className:"speed-val",children:E>=100?"Max":`${E}%`})]})]}),j.jsx(o1,{value:i,onChange:ht,activeLine:_,error:p})]}),j.jsxs("section",{className:`pane-right${U!=="editor"?" is-mobile-visible":""}`,"aria-label":"Podgląd i materiały",children:[j.jsxs("div",{className:"right-tabs",role:"tablist","aria-label":"Panele prawe",children:[j.jsxs("button",{type:"button",role:"tab","aria-selected":M==="canvas",className:`right-tab${M==="canvas"?" is-active":""}`,onClick:()=>y("canvas"),children:[j.jsx(Cb,{size:15}),"Płótno ",s.toUpperCase()]}),j.jsxs("button",{type:"button",role:"tab","aria-selected":M==="challenges",className:`right-tab${M==="challenges"?" is-active":""}`,onClick:()=>y("challenges"),children:[j.jsx(xS,{size:15}),"Wyzwania (",A.size,"/6)"]}),j.jsxs("button",{type:"button",role:"tab","aria-selected":M==="reference",className:`right-tab${M==="reference"?" is-active":""}`,onClick:()=>y("reference"),children:[j.jsx(_b,{size:15}),"Dokumentacja"]})]}),j.jsxs("div",{className:"right-content",children:[j.jsx("div",{className:`tab-panel${M==="canvas"?" is-active":""}`,hidden:M!=="canvas",children:s==="2d"?j.jsx(CS,{ref:V,segments:l,turtle:d}):j.jsx(mx,{ref:V,segments:l,turtle:d})}),M==="challenges"&&j.jsx(r1,{currentCode:i,solvedIds:A,onMarkSolved:le,onLoadStarter:kt}),M==="reference"&&j.jsx(h1,{})]})]})]}),I&&j.jsx("div",{className:"toast",role:"status","aria-live":"polite",children:I}),j.jsx(l1,{open:N,onClose:()=>G(!1),hasUnsavedDraft:Ut,onSelectExample:Ct}),j.jsx(c1,{open:F,onClose:()=>z(!1)})]})}hb.createRoot(document.getElementById("root")).render(j.jsx(Pt.StrictMode,{children:j.jsx(g3,{})}));
