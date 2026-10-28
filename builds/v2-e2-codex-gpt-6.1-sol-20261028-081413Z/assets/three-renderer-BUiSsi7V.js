import{c as _r,N as yt,S as gr,C as je,F as Fa,M as Jt,V as Ce,R as vr,a as ot,w as Qn,W as Mi,b as en,d as at,L as on,H as Dn,U as Wt,D as Dt,B as xt,e as cn,f as Ln,p as Er,E as Sr,g as Ye,P as xn,A as Mr,h as On,i as Lt,j as Cn,k as fi,l as fn,m as dn,n as Ba,o as Tr,q as Kt,r as Pn,s as xr,t as Ar,u as rn,O as Rr,v as br,x as Cr,y as Pr,z as wr,G as Dr,I as Lr,J as Ur,K as yr,Q as Ir,T as Nr,X as Or,Y as Fr,Z as Br,_ as Hr,$ as Gr,a0 as Vr,a1 as zr,a2 as Fn,a3 as qt,a4 as mn,a5 as kr,a6 as ln,a7 as Wr,a8 as Xr,a9 as Yr,aa as Kr,ab as Ha,ac as qr,ad as Zr,ae as $r,af as Ga,ag as Be,ah as jr,ai as Qr,aj as Jr,ak as It,al as Va,am as An,an as Ut,ao as za,ap as zt,aq as wt,ar as wn,as as ka,at as Wa,au as Xa,av as Ya,aw as eo,ax as to,ay as no,az as io,aA as Ka,aB as Vt,aC as ao,aD as ro,aE as oo,aF as qa,aG as so,aH as Za,aI as $a,aJ as Bn,aK as Hn,aL as Gn,aM as Vn,aN as qe,aO as Ti,aP as xi,aQ as Ai,aR as Ri,aS as bi,aT as Ci,aU as Pi,aV as wi,aW as Di,aX as Li,aY as Ui,aZ as yi,a_ as Ii,a$ as Ni,b0 as Oi,b1 as Fi,b2 as Bi,b3 as Hi,b4 as Gi,b5 as Vi,b6 as zi,b7 as ki,b8 as Wi,b9 as Xi,ba as Yi,bb as Ki,bc as qi,bd as Zi,be as Jn,bf as ei,bg as ti,bh as ni,bi as ii,bj as ai,bk as ri,bl as lo,bm as $i,bn as co,bo as Rn,bp as fo,bq as ji,br as Qi,bs as Ji,bt as oi,bu as si,bv as uo,bw as ja,bx as di,by as Un,bz as po,bA as ho,bB as Qa,bC as Ja,bD as ea,bE as er,bF as ta,bG as tr,bH as un,bI as tn,bJ as mo,bK as _o,bL as go,bM as vo,bN as Eo,bO as na,bP as So,bQ as Mo,bR as To,bS as xo,bT as Ao,bU as Ro,bV as bo,bW as Co,bX as Po,bY as wo,bZ as Do,b_ as Lo,b$ as Uo,c0 as gt,c1 as yo,c2 as Io,c3 as No,c4 as Oo,c5 as Fo,c6 as Bo,c7 as Qt,c8 as Zt,c9 as ia,ca as aa,cb as Ho,cc as nr,cd as Go,ce as ra,cf as li,cg as $t,ch as Vo,ci as ui,cj as ir,ck as zo}from"./three-core-CwWrHVY2.js";function ar(){let e=null,n=!1,t=null,i=null;function s(r,u){t(r,u),i=e.requestAnimationFrame(s)}return{start:function(){n!==!0&&t!==null&&(i=e.requestAnimationFrame(s),n=!0)},stop:function(){e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(r){t=r},setContext:function(r){e=r}}}function ko(e){const n=new WeakMap;function t(c,x){const E=c.array,w=c.usage,v=E.byteLength,S=e.createBuffer();e.bindBuffer(x,S),e.bufferData(x,E,w),c.onUploadCallback();let R;if(E instanceof Float32Array)R=e.FLOAT;else if(typeof Float16Array<"u"&&E instanceof Float16Array)R=e.HALF_FLOAT;else if(E instanceof Uint16Array)c.isFloat16BufferAttribute?R=e.HALF_FLOAT:R=e.UNSIGNED_SHORT;else if(E instanceof Int16Array)R=e.SHORT;else if(E instanceof Uint32Array)R=e.UNSIGNED_INT;else if(E instanceof Int32Array)R=e.INT;else if(E instanceof Int8Array)R=e.BYTE;else if(E instanceof Uint8Array)R=e.UNSIGNED_BYTE;else if(E instanceof Uint8ClampedArray)R=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+E);return{buffer:S,type:R,bytesPerElement:E.BYTES_PER_ELEMENT,version:c.version,size:v}}function i(c,x,E){const w=x.array,v=x.updateRanges;if(e.bindBuffer(E,c),v.length===0)e.bufferSubData(E,0,w);else{v.sort((R,F)=>R.start-F.start);let S=0;for(let R=1;R<v.length;R++){const F=v[S],L=v[R];L.start<=F.start+F.count+1?F.count=Math.max(F.count,L.start+L.count-F.start):(++S,v[S]=L)}v.length=S+1;for(let R=0,F=v.length;R<F;R++){const L=v[R];e.bufferSubData(E,L.start*w.BYTES_PER_ELEMENT,w,L.start,L.count)}x.clearUpdateRanges()}x.onUploadCallback()}function s(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const x=n.get(c);x&&(e.deleteBuffer(x.buffer),n.delete(c))}function u(c,x){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){const w=n.get(c);(!w||w.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}const E=n.get(c);if(E===void 0)n.set(c,t(c,x));else if(E.version<c.version){if(E.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(E.buffer,c,x),E.version=c.version}}return{get:s,remove:r,update:u}}var Wo=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xo=`#ifdef USE_ALPHAHASH
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
#endif`,Yo=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ko=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qo=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zo=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$o=`#ifdef USE_AOMAP
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
#endif`,jo=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qo=`#ifdef USE_BATCHING
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
#endif`,Jo=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,es=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ts=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ns=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,is=`#ifdef USE_IRIDESCENCE
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
#endif`,as=`#ifdef USE_BUMPMAP
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
#endif`,rs=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,os=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ss=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ls=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cs=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fs=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ds=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,us=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ps=`#define PI 3.141592653589793
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
} // validated`,hs=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ms=`vec3 transformedNormal = objectNormal;
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
#endif`,_s=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gs=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vs=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Es=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ss="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ms=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ts=`#ifdef USE_ENVMAP
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
#endif`,xs=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,As=`#ifdef USE_ENVMAP
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
#endif`,Rs=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,bs=`#ifdef USE_ENVMAP
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
#endif`,Cs=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ps=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ws=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ds=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ls=`#ifdef USE_GRADIENTMAP
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
}`,Us=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ys=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Is=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ns=`uniform bool receiveShadow;
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
#endif`,Os=`#ifdef USE_ENVMAP
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
#endif`,Fs=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Bs=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hs=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gs=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vs=`PhysicalMaterial material;
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
#endif`,zs=`struct PhysicalMaterial {
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
}`,ks=`
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
#endif`,Ws=`#if defined( RE_IndirectDiffuse )
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
#endif`,Xs=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ys=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ks=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qs=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zs=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$s=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,js=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qs=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Js=`#if defined( USE_POINTS_UV )
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
#endif`,el=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,tl=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,nl=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,il=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,al=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rl=`#ifdef USE_MORPHTARGETS
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
#endif`,ol=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sl=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ll=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,cl=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fl=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dl=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ul=`#ifdef USE_NORMALMAP
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
#endif`,pl=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hl=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ml=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_l=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gl=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vl=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,El=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sl=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ml=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tl=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xl=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Al=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rl=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
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
#endif`,bl=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Cl=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Pl=`float getShadowMask() {
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
}`,wl=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Dl=`#ifdef USE_SKINNING
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
#endif`,Ll=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ul=`#ifdef USE_SKINNING
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
#endif`,yl=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Il=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nl=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ol=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fl=`#ifdef USE_TRANSMISSION
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
#endif`,Bl=`#ifdef USE_TRANSMISSION
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
#endif`,Hl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,zl=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const kl=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wl=`uniform sampler2D t2D;
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
}`,Xl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yl=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Kl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ql=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zl=`#include <common>
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
}`,$l=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,jl=`#define DISTANCE
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
}`,Ql=`#define DISTANCE
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
}`,Jl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ec=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tc=`uniform float scale;
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
}`,nc=`uniform vec3 diffuse;
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
}`,ic=`#include <common>
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
}`,ac=`uniform vec3 diffuse;
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
}`,rc=`#define LAMBERT
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
}`,oc=`#define LAMBERT
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
}`,sc=`#define MATCAP
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
}`,lc=`#define MATCAP
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
}`,cc=`#define NORMAL
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
}`,fc=`#define NORMAL
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
}`,dc=`#define PHONG
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
}`,uc=`#define PHONG
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
}`,pc=`#define STANDARD
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
}`,hc=`#define STANDARD
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
}`,mc=`#define TOON
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
}`,_c=`#define TOON
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
}`,gc=`uniform float size;
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
}`,vc=`uniform vec3 diffuse;
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
}`,Ec=`#include <common>
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
}`,Sc=`uniform vec3 color;
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
}`,Mc=`uniform float rotation;
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
}`,Tc=`uniform vec3 diffuse;
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
}`,Ie={alphahash_fragment:Wo,alphahash_pars_fragment:Xo,alphamap_fragment:Yo,alphamap_pars_fragment:Ko,alphatest_fragment:qo,alphatest_pars_fragment:Zo,aomap_fragment:$o,aomap_pars_fragment:jo,batching_pars_vertex:Qo,batching_vertex:Jo,begin_vertex:es,beginnormal_vertex:ts,bsdfs:ns,iridescence_fragment:is,bumpmap_pars_fragment:as,clipping_planes_fragment:rs,clipping_planes_pars_fragment:os,clipping_planes_pars_vertex:ss,clipping_planes_vertex:ls,color_fragment:cs,color_pars_fragment:fs,color_pars_vertex:ds,color_vertex:us,common:ps,cube_uv_reflection_fragment:hs,defaultnormal_vertex:ms,displacementmap_pars_vertex:_s,displacementmap_vertex:gs,emissivemap_fragment:vs,emissivemap_pars_fragment:Es,colorspace_fragment:Ss,colorspace_pars_fragment:Ms,envmap_fragment:Ts,envmap_common_pars_fragment:xs,envmap_pars_fragment:As,envmap_pars_vertex:Rs,envmap_physical_pars_fragment:Os,envmap_vertex:bs,fog_vertex:Cs,fog_pars_vertex:Ps,fog_fragment:ws,fog_pars_fragment:Ds,gradientmap_pars_fragment:Ls,lightmap_pars_fragment:Us,lights_lambert_fragment:ys,lights_lambert_pars_fragment:Is,lights_pars_begin:Ns,lights_toon_fragment:Fs,lights_toon_pars_fragment:Bs,lights_phong_fragment:Hs,lights_phong_pars_fragment:Gs,lights_physical_fragment:Vs,lights_physical_pars_fragment:zs,lights_fragment_begin:ks,lights_fragment_maps:Ws,lights_fragment_end:Xs,logdepthbuf_fragment:Ys,logdepthbuf_pars_fragment:Ks,logdepthbuf_pars_vertex:qs,logdepthbuf_vertex:Zs,map_fragment:$s,map_pars_fragment:js,map_particle_fragment:Qs,map_particle_pars_fragment:Js,metalnessmap_fragment:el,metalnessmap_pars_fragment:tl,morphinstance_vertex:nl,morphcolor_vertex:il,morphnormal_vertex:al,morphtarget_pars_vertex:rl,morphtarget_vertex:ol,normal_fragment_begin:sl,normal_fragment_maps:ll,normal_pars_fragment:cl,normal_pars_vertex:fl,normal_vertex:dl,normalmap_pars_fragment:ul,clearcoat_normal_fragment_begin:pl,clearcoat_normal_fragment_maps:hl,clearcoat_pars_fragment:ml,iridescence_pars_fragment:_l,opaque_fragment:gl,packing:vl,premultiplied_alpha_fragment:El,project_vertex:Sl,dithering_fragment:Ml,dithering_pars_fragment:Tl,roughnessmap_fragment:xl,roughnessmap_pars_fragment:Al,shadowmap_pars_fragment:Rl,shadowmap_pars_vertex:bl,shadowmap_vertex:Cl,shadowmask_pars_fragment:Pl,skinbase_vertex:wl,skinning_pars_vertex:Dl,skinning_vertex:Ll,skinnormal_vertex:Ul,specularmap_fragment:yl,specularmap_pars_fragment:Il,tonemapping_fragment:Nl,tonemapping_pars_fragment:Ol,transmission_fragment:Fl,transmission_pars_fragment:Bl,uv_pars_fragment:Hl,uv_pars_vertex:Gl,uv_vertex:Vl,worldpos_vertex:zl,background_vert:kl,background_frag:Wl,backgroundCube_vert:Xl,backgroundCube_frag:Yl,cube_vert:Kl,cube_frag:ql,depth_vert:Zl,depth_frag:$l,distanceRGBA_vert:jl,distanceRGBA_frag:Ql,equirect_vert:Jl,equirect_frag:ec,linedashed_vert:tc,linedashed_frag:nc,meshbasic_vert:ic,meshbasic_frag:ac,meshlambert_vert:rc,meshlambert_frag:oc,meshmatcap_vert:sc,meshmatcap_frag:lc,meshnormal_vert:cc,meshnormal_frag:fc,meshphong_vert:dc,meshphong_frag:uc,meshphysical_vert:pc,meshphysical_frag:hc,meshtoon_vert:mc,meshtoon_frag:_c,points_vert:gc,points_frag:vc,shadow_vert:Ec,shadow_frag:Sc,sprite_vert:Mc,sprite_frag:Tc},ne={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new Ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new Ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},vt={basic:{uniforms:gt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.fog]),vertexShader:Ie.meshbasic_vert,fragmentShader:Ie.meshbasic_frag},lambert:{uniforms:gt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new je(0)}}]),vertexShader:Ie.meshlambert_vert,fragmentShader:Ie.meshlambert_frag},phong:{uniforms:gt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:Ie.meshphong_vert,fragmentShader:Ie.meshphong_frag},standard:{uniforms:gt([ne.common,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.roughnessmap,ne.metalnessmap,ne.fog,ne.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag},toon:{uniforms:gt([ne.common,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.gradientmap,ne.fog,ne.lights,{emissive:{value:new je(0)}}]),vertexShader:Ie.meshtoon_vert,fragmentShader:Ie.meshtoon_frag},matcap:{uniforms:gt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,{matcap:{value:null}}]),vertexShader:Ie.meshmatcap_vert,fragmentShader:Ie.meshmatcap_frag},points:{uniforms:gt([ne.points,ne.fog]),vertexShader:Ie.points_vert,fragmentShader:Ie.points_frag},dashed:{uniforms:gt([ne.common,ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ie.linedashed_vert,fragmentShader:Ie.linedashed_frag},depth:{uniforms:gt([ne.common,ne.displacementmap]),vertexShader:Ie.depth_vert,fragmentShader:Ie.depth_frag},normal:{uniforms:gt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,{opacity:{value:1}}]),vertexShader:Ie.meshnormal_vert,fragmentShader:Ie.meshnormal_frag},sprite:{uniforms:gt([ne.sprite,ne.fog]),vertexShader:Ie.sprite_vert,fragmentShader:Ie.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ie.background_vert,fragmentShader:Ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:Ie.backgroundCube_vert,fragmentShader:Ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ie.cube_vert,fragmentShader:Ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ie.equirect_vert,fragmentShader:Ie.equirect_frag},distanceRGBA:{uniforms:gt([ne.common,ne.displacementmap,{referencePosition:{value:new Ce},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ie.distanceRGBA_vert,fragmentShader:Ie.distanceRGBA_frag},shadow:{uniforms:gt([ne.lights,ne.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Ie.shadow_vert,fragmentShader:Ie.shadow_frag}};vt.physical={uniforms:gt([vt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new Ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new Ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new Ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag};const _n={r:0,b:0,g:0},Ft=new er,xc=new Jt;function Ac(e,n,t,i,s,r,u){const c=new je(0);let x=r===!0?0:1,E,w,v=null,S=0,R=null;function F(T){let _=T.isScene===!0?T.background:null;return _&&_.isTexture&&(_=(T.backgroundBlurriness>0?t:n).get(_)),_}function L(T){let _=!1;const N=F(T);N===null?a(c,x):N&&N.isColor&&(a(N,1),_=!0);const C=e.xr.getEnvironmentBlendMode();C==="additive"?i.buffers.color.setClear(0,0,0,1,u):C==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,u),(e.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function f(T,_){const N=F(_);N&&(N.isCubeTexture||N.mapping===Un)?(w===void 0&&(w=new Ut(new Ja(1,1,1),new It({name:"BackgroundCubeMaterial",uniforms:ea(vt.backgroundCube.uniforms),vertexShader:vt.backgroundCube.vertexShader,fragmentShader:vt.backgroundCube.fragmentShader,side:xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),w.geometry.deleteAttribute("normal"),w.geometry.deleteAttribute("uv"),w.onBeforeRender=function(C,I,k){this.matrixWorld.copyPosition(k.matrixWorld)},Object.defineProperty(w.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(w)),Ft.copy(_.backgroundRotation),Ft.x*=-1,Ft.y*=-1,Ft.z*=-1,N.isCubeTexture&&N.isRenderTargetTexture===!1&&(Ft.y*=-1,Ft.z*=-1),w.material.uniforms.envMap.value=N,w.material.uniforms.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,w.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,w.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,w.material.uniforms.backgroundRotation.value.setFromMatrix4(xc.makeRotationFromEuler(Ft)),w.material.toneMapped=at.getTransfer(N.colorSpace)!==qe,(v!==N||S!==N.version||R!==e.toneMapping)&&(w.material.needsUpdate=!0,v=N,S=N.version,R=e.toneMapping),w.layers.enableAll(),T.unshift(w,w.geometry,w.material,0,0,null)):N&&N.isTexture&&(E===void 0&&(E=new Ut(new Ya(2,2),new It({name:"BackgroundMaterial",uniforms:ea(vt.background.uniforms),vertexShader:vt.background.vertexShader,fragmentShader:vt.background.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),E.geometry.deleteAttribute("normal"),Object.defineProperty(E.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(E)),E.material.uniforms.t2D.value=N,E.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,E.material.toneMapped=at.getTransfer(N.colorSpace)!==qe,N.matrixAutoUpdate===!0&&N.updateMatrix(),E.material.uniforms.uvTransform.value.copy(N.matrix),(v!==N||S!==N.version||R!==e.toneMapping)&&(E.material.needsUpdate=!0,v=N,S=N.version,R=e.toneMapping),E.layers.enableAll(),T.unshift(E,E.geometry,E.material,0,0,null))}function a(T,_){T.getRGB(_n,Qa(e)),i.buffers.color.setClear(_n.r,_n.g,_n.b,_,u)}function D(){w!==void 0&&(w.geometry.dispose(),w.material.dispose(),w=void 0),E!==void 0&&(E.geometry.dispose(),E.material.dispose(),E=void 0)}return{getClearColor:function(){return c},setClearColor:function(T,_=1){c.set(T),x=_,a(c,x)},getClearAlpha:function(){return x},setClearAlpha:function(T){x=T,a(c,x)},render:L,addToRenderList:f,dispose:D}}function Rc(e,n){const t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=S(null);let r=s,u=!1;function c(d,b,B,X,Y){let Z=!1;const W=v(X,B,b);r!==W&&(r=W,E(r.object)),Z=R(d,X,B,Y),Z&&F(d,X,B,Y),Y!==null&&n.update(Y,e.ELEMENT_ARRAY_BUFFER),(Z||u)&&(u=!1,_(d,b,B,X),Y!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(Y).buffer))}function x(){return e.createVertexArray()}function E(d){return e.bindVertexArray(d)}function w(d){return e.deleteVertexArray(d)}function v(d,b,B){const X=B.wireframe===!0;let Y=i[d.id];Y===void 0&&(Y={},i[d.id]=Y);let Z=Y[b.id];Z===void 0&&(Z={},Y[b.id]=Z);let W=Z[X];return W===void 0&&(W=S(x()),Z[X]=W),W}function S(d){const b=[],B=[],X=[];for(let Y=0;Y<t;Y++)b[Y]=0,B[Y]=0,X[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:B,attributeDivisors:X,object:d,attributes:{},index:null}}function R(d,b,B,X){const Y=r.attributes,Z=b.attributes;let W=0;const ie=B.getAttributes();for(const G in ie)if(ie[G].location>=0){const Te=Y[G];let Ue=Z[G];if(Ue===void 0&&(G==="instanceMatrix"&&d.instanceMatrix&&(Ue=d.instanceMatrix),G==="instanceColor"&&d.instanceColor&&(Ue=d.instanceColor)),Te===void 0||Te.attribute!==Ue||Ue&&Te.data!==Ue.data)return!0;W++}return r.attributesNum!==W||r.index!==X}function F(d,b,B,X){const Y={},Z=b.attributes;let W=0;const ie=B.getAttributes();for(const G in ie)if(ie[G].location>=0){let Te=Z[G];Te===void 0&&(G==="instanceMatrix"&&d.instanceMatrix&&(Te=d.instanceMatrix),G==="instanceColor"&&d.instanceColor&&(Te=d.instanceColor));const Ue={};Ue.attribute=Te,Te&&Te.data&&(Ue.data=Te.data),Y[G]=Ue,W++}r.attributes=Y,r.attributesNum=W,r.index=X}function L(){const d=r.newAttributes;for(let b=0,B=d.length;b<B;b++)d[b]=0}function f(d){a(d,0)}function a(d,b){const B=r.newAttributes,X=r.enabledAttributes,Y=r.attributeDivisors;B[d]=1,X[d]===0&&(e.enableVertexAttribArray(d),X[d]=1),Y[d]!==b&&(e.vertexAttribDivisor(d,b),Y[d]=b)}function D(){const d=r.newAttributes,b=r.enabledAttributes;for(let B=0,X=b.length;B<X;B++)b[B]!==d[B]&&(e.disableVertexAttribArray(B),b[B]=0)}function T(d,b,B,X,Y,Z,W){W===!0?e.vertexAttribIPointer(d,b,B,Y,Z):e.vertexAttribPointer(d,b,B,X,Y,Z)}function _(d,b,B,X){L();const Y=X.attributes,Z=B.getAttributes(),W=b.defaultAttributeValues;for(const ie in Z){const G=Z[ie];if(G.location>=0){let ge=Y[ie];if(ge===void 0&&(ie==="instanceMatrix"&&d.instanceMatrix&&(ge=d.instanceMatrix),ie==="instanceColor"&&d.instanceColor&&(ge=d.instanceColor)),ge!==void 0){const Te=ge.normalized,Ue=ge.itemSize,He=n.get(ge);if(He===void 0)continue;const nt=He.buffer,et=He.type,ke=He.bytesPerElement,V=et===e.INT||et===e.UNSIGNED_INT||ge.gpuType===Ka;if(ge.isInterleavedBufferAttribute){const q=ge.data,ce=q.stride,Pe=ge.offset;if(q.isInstancedInterleavedBuffer){for(let Ee=0;Ee<G.locationSize;Ee++)a(G.location+Ee,q.meshPerAttribute);d.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let Ee=0;Ee<G.locationSize;Ee++)f(G.location+Ee);e.bindBuffer(e.ARRAY_BUFFER,nt);for(let Ee=0;Ee<G.locationSize;Ee++)T(G.location+Ee,Ue/G.locationSize,et,Te,ce*ke,(Pe+Ue/G.locationSize*Ee)*ke,V)}else{if(ge.isInstancedBufferAttribute){for(let q=0;q<G.locationSize;q++)a(G.location+q,ge.meshPerAttribute);d.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ge.meshPerAttribute*ge.count)}else for(let q=0;q<G.locationSize;q++)f(G.location+q);e.bindBuffer(e.ARRAY_BUFFER,nt);for(let q=0;q<G.locationSize;q++)T(G.location+q,Ue/G.locationSize,et,Te,Ue*ke,Ue/G.locationSize*q*ke,V)}}else if(W!==void 0){const Te=W[ie];if(Te!==void 0)switch(Te.length){case 2:e.vertexAttrib2fv(G.location,Te);break;case 3:e.vertexAttrib3fv(G.location,Te);break;case 4:e.vertexAttrib4fv(G.location,Te);break;default:e.vertexAttrib1fv(G.location,Te)}}}}D()}function N(){k();for(const d in i){const b=i[d];for(const B in b){const X=b[B];for(const Y in X)w(X[Y].object),delete X[Y];delete b[B]}delete i[d]}}function C(d){if(i[d.id]===void 0)return;const b=i[d.id];for(const B in b){const X=b[B];for(const Y in X)w(X[Y].object),delete X[Y];delete b[B]}delete i[d.id]}function I(d){for(const b in i){const B=i[b];if(B[d.id]===void 0)continue;const X=B[d.id];for(const Y in X)w(X[Y].object),delete X[Y];delete B[d.id]}}function k(){h(),u=!0,r!==s&&(r=s,E(r.object))}function h(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:c,reset:k,resetDefaultState:h,dispose:N,releaseStatesOfGeometry:C,releaseStatesOfProgram:I,initAttributes:L,enableAttribute:f,disableUnusedAttributes:D}}function bc(e,n,t){let i;function s(E){i=E}function r(E,w){e.drawArrays(i,E,w),t.update(w,i,1)}function u(E,w,v){v!==0&&(e.drawArraysInstanced(i,E,w,v),t.update(w,i,v))}function c(E,w,v){if(v===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,E,0,w,0,v);let R=0;for(let F=0;F<v;F++)R+=w[F];t.update(R,i,1)}function x(E,w,v,S){if(v===0)return;const R=n.get("WEBGL_multi_draw");if(R===null)for(let F=0;F<E.length;F++)u(E[F],w[F],S[F]);else{R.multiDrawArraysInstancedWEBGL(i,E,0,w,0,S,0,v);let F=0;for(let L=0;L<v;L++)F+=w[L]*S[L];t.update(F,i,1)}}this.setMode=s,this.render=r,this.renderInstances=u,this.renderMultiDraw=c,this.renderMultiDrawInstances=x}function Cc(e,n,t,i){let s;function r(){if(s!==void 0)return s;if(n.has("EXT_texture_filter_anisotropic")===!0){const I=n.get("EXT_texture_filter_anisotropic");s=e.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function u(I){return!(I!==Lt&&i.convert(I)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(I){const k=I===Dn&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(I!==Wt&&i.convert(I)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==Vt&&!k)}function x(I){if(I==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let E=t.precision!==void 0?t.precision:"highp";const w=x(E);w!==E&&(console.warn("THREE.WebGLRenderer:",E,"not supported, using",w,"instead."),E=w);const v=t.logarithmicDepthBuffer===!0,S=t.reversedDepthBuffer===!0&&n.has("EXT_clip_control"),R=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),F=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),L=e.getParameter(e.MAX_TEXTURE_SIZE),f=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),a=e.getParameter(e.MAX_VERTEX_ATTRIBS),D=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),T=e.getParameter(e.MAX_VARYING_VECTORS),_=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),N=F>0,C=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:x,textureFormatReadable:u,textureTypeReadable:c,precision:E,logarithmicDepthBuffer:v,reversedDepthBuffer:S,maxTextures:R,maxVertexTextures:F,maxTextureSize:L,maxCubemapSize:f,maxAttributes:a,maxVertexUniforms:D,maxVaryings:T,maxFragmentUniforms:_,vertexTextures:N,maxSamples:C}}function Pc(e){const n=this;let t=null,i=0,s=!1,r=!1;const u=new Ga,c=new Be,x={value:null,needsUpdate:!1};this.uniform=x,this.numPlanes=0,this.numIntersection=0,this.init=function(v,S){const R=v.length!==0||S||i!==0||s;return s=S,i=v.length,R},this.beginShadows=function(){r=!0,w(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(v,S){t=w(v,S,0)},this.setState=function(v,S,R){const F=v.clippingPlanes,L=v.clipIntersection,f=v.clipShadows,a=e.get(v);if(!s||F===null||F.length===0||r&&!f)r?w(null):E();else{const D=r?0:i,T=D*4;let _=a.clippingState||null;x.value=_,_=w(F,S,T,R);for(let N=0;N!==T;++N)_[N]=t[N];a.clippingState=_,this.numIntersection=L?this.numPlanes:0,this.numPlanes+=D}};function E(){x.value!==t&&(x.value=t,x.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function w(v,S,R,F){const L=v!==null?v.length:0;let f=null;if(L!==0){if(f=x.value,F!==!0||f===null){const a=R+L*4,D=S.matrixWorldInverse;c.getNormalMatrix(D),(f===null||f.length<a)&&(f=new Float32Array(a));for(let T=0,_=R;T!==L;++T,_+=4)u.copy(v[T]).applyMatrix4(D,c),u.normal.toArray(f,_),f[_+3]=u.constant}x.value=f,x.needsUpdate=!0}return n.numPlanes=L,n.numIntersection=0,f}}function wc(e){let n=new WeakMap;function t(u,c){return c===oi?u.mapping=un:c===si&&(u.mapping=tn),u}function i(u){if(u&&u.isTexture){const c=u.mapping;if(c===oi||c===si)if(n.has(u)){const x=n.get(u).texture;return t(x,u.mapping)}else{const x=u.image;if(x&&x.height>0){const E=new uo(x.height);return E.fromEquirectangularTexture(e,u),n.set(u,E),u.addEventListener("dispose",s),t(E.texture,u.mapping)}else return null}}return u}function s(u){const c=u.target;c.removeEventListener("dispose",s);const x=n.get(c);x!==void 0&&(n.delete(c),x.dispose())}function r(){n=new WeakMap}return{get:i,dispose:r}}const jt=4,oa=[.125,.215,.35,.446,.526,.582],Gt=20,zn=new mo,sa=new je;let kn=null,Wn=0,Xn=0,Yn=!1;const Ht=(1+Math.sqrt(5))/2,Yt=1/Ht,la=[new Ce(-Ht,Yt,0),new Ce(Ht,Yt,0),new Ce(-Yt,0,Ht),new Ce(Yt,0,Ht),new Ce(0,Ht,-Yt),new Ce(0,Ht,Yt),new Ce(-1,1,-1),new Ce(1,1,-1),new Ce(-1,1,1),new Ce(1,1,1)],Dc=new Ce;class ca{constructor(n){this._renderer=n,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(n,t=0,i=.1,s=100,r={}){const{size:u=256,position:c=Dc}=r;kn=this._renderer.getRenderTarget(),Wn=this._renderer.getActiveCubeFace(),Xn=this._renderer.getActiveMipmapLevel(),Yn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(u);const x=this._allocateTargets();return x.depthBuffer=!0,this._sceneToCubeUV(n,i,s,x,c),t>0&&this._blur(x,0,0,t),this._applyPMREM(x),this._cleanup(x),x}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ua(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=da(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(n){this._lodMax=Math.floor(Math.log2(n)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let n=0;n<this._lodPlanes.length;n++)this._lodPlanes[n].dispose()}_cleanup(n){this._renderer.setRenderTarget(kn,Wn,Xn),this._renderer.xr.enabled=Yn,n.scissorTest=!1,gn(n,0,0,n.width,n.height)}_fromTexture(n,t){n.mapping===un||n.mapping===tn?this._setSize(n.image.length===0?16:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4),kn=this._renderer.getRenderTarget(),Wn=this._renderer.getActiveCubeFace(),Xn=this._renderer.getActiveMipmapLevel(),Yn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(n,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const n=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:qt,minFilter:qt,generateMipmaps:!1,type:Dn,format:Lt,colorSpace:Ln,depthBuffer:!1},s=fa(n,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==n||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fa(n,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Lc(r)),this._blurMaterial=Uc(r,n,t)}return s}_compileMaterial(n){const t=new Ut(this._lodPlanes[0],n);this._renderer.compile(t,zn)}_sceneToCubeUV(n,t,i,s,r){const x=new xn(90,1,t,i),E=[1,-1,1,1,1,1],w=[1,1,1,-1,-1,-1],v=this._renderer,S=v.autoClear,R=v.toneMapping;v.getClearColor(sa),v.toneMapping=yt,v.autoClear=!1,v.state.buffers.depth.getReversed()&&(v.setRenderTarget(s),v.clearDepth(),v.setRenderTarget(null));const L=new _o({name:"PMREM.Background",side:xt,depthWrite:!1,depthTest:!1}),f=new Ut(new Ja,L);let a=!1;const D=n.background;D?D.isColor&&(L.color.copy(D),n.background=null,a=!0):(L.color.copy(sa),a=!0);for(let T=0;T<6;T++){const _=T%3;_===0?(x.up.set(0,E[T],0),x.position.set(r.x,r.y,r.z),x.lookAt(r.x+w[T],r.y,r.z)):_===1?(x.up.set(0,0,E[T]),x.position.set(r.x,r.y,r.z),x.lookAt(r.x,r.y+w[T],r.z)):(x.up.set(0,E[T],0),x.position.set(r.x,r.y,r.z),x.lookAt(r.x,r.y,r.z+w[T]));const N=this._cubeSize;gn(s,_*N,T>2?N:0,N,N),v.setRenderTarget(s),a&&v.render(f,x),v.render(n,x)}f.geometry.dispose(),f.material.dispose(),v.toneMapping=R,v.autoClear=S,n.background=D}_textureToCubeUV(n,t){const i=this._renderer,s=n.mapping===un||n.mapping===tn;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ua()),this._cubemapMaterial.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=da());const r=s?this._cubemapMaterial:this._equirectMaterial,u=new Ut(this._lodPlanes[0],r),c=r.uniforms;c.envMap.value=n;const x=this._cubeSize;gn(t,0,0,3*x,2*x),i.setRenderTarget(t),i.render(u,zn)}_applyPMREM(n){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const u=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),c=la[(s-r-1)%la.length];this._blur(n,r-1,r,u,c)}t.autoClear=i}_blur(n,t,i,s,r){const u=this._pingPongRenderTarget;this._halfBlur(n,u,t,i,s,"latitudinal",r),this._halfBlur(u,n,i,i,s,"longitudinal",r)}_halfBlur(n,t,i,s,r,u,c){const x=this._renderer,E=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const w=3,v=new Ut(this._lodPlanes[s],E),S=E.uniforms,R=this._sizeLods[i]-1,F=isFinite(r)?Math.PI/(2*R):2*Math.PI/(2*Gt-1),L=r/F,f=isFinite(r)?1+Math.floor(w*L):Gt;f>Gt&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${Gt}`);const a=[];let D=0;for(let I=0;I<Gt;++I){const k=I/L,h=Math.exp(-k*k/2);a.push(h),I===0?D+=h:I<f&&(D+=2*h)}for(let I=0;I<a.length;I++)a[I]=a[I]/D;S.envMap.value=n.texture,S.samples.value=f,S.weights.value=a,S.latitudinal.value=u==="latitudinal",c&&(S.poleAxis.value=c);const{_lodMax:T}=this;S.dTheta.value=F,S.mipInt.value=T-i;const _=this._sizeLods[s],N=3*_*(s>T-jt?s-T+jt:0),C=4*(this._cubeSize-_);gn(t,N,C,3*_,2*_),x.setRenderTarget(t),x.render(v,zn)}}function Lc(e){const n=[],t=[],i=[];let s=e;const r=e-jt+1+oa.length;for(let u=0;u<r;u++){const c=Math.pow(2,s);t.push(c);let x=1/c;u>e-jt?x=oa[u-e+jt-1]:u===0&&(x=0),i.push(x);const E=1/(c-2),w=-E,v=1+E,S=[w,w,v,w,v,v,w,w,v,v,w,v],R=6,F=6,L=3,f=2,a=1,D=new Float32Array(L*F*R),T=new Float32Array(f*F*R),_=new Float32Array(a*F*R);for(let C=0;C<R;C++){const I=C%3*2/3-1,k=C>2?0:-1,h=[I,k,0,I+2/3,k,0,I+2/3,k+1,0,I,k,0,I+2/3,k+1,0,I,k+1,0];D.set(h,L*F*C),T.set(S,f*F*C);const d=[C,C,C,C,C,C];_.set(d,a*F*C)}const N=new Va;N.setAttribute("position",new An(D,L)),N.setAttribute("uv",new An(T,f)),N.setAttribute("faceIndex",new An(_,a)),n.push(N),s>jt&&s--}return{lodPlanes:n,sizeLods:t,sigmas:i}}function fa(e,n,t){const i=new en(e,n,t);return i.texture.mapping=Un,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function gn(e,n,t,i,s){e.viewport.set(n,t,i,s),e.scissor.set(n,t,i,s)}function Uc(e,n,t){const i=new Float32Array(Gt),s=new Ce(0,1,0);return new It({name:"SphericalGaussianBlur",defines:{n:Gt,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:pi(),fragmentShader:`

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
		`,blending:zt,depthTest:!1,depthWrite:!1})}function da(){return new It({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pi(),fragmentShader:`

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
		`,blending:zt,depthTest:!1,depthWrite:!1})}function ua(){return new It({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pi(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zt,depthTest:!1,depthWrite:!1})}function pi(){return`

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
	`}function yc(e){let n=new WeakMap,t=null;function i(c){if(c&&c.isTexture){const x=c.mapping,E=x===oi||x===si,w=x===un||x===tn;if(E||w){let v=n.get(c);const S=v!==void 0?v.texture.pmremVersion:0;if(c.isRenderTargetTexture&&c.pmremVersion!==S)return t===null&&(t=new ca(e)),v=E?t.fromEquirectangular(c,v):t.fromCubemap(c,v),v.texture.pmremVersion=c.pmremVersion,n.set(c,v),v.texture;if(v!==void 0)return v.texture;{const R=c.image;return E&&R&&R.height>0||w&&R&&s(R)?(t===null&&(t=new ca(e)),v=E?t.fromEquirectangular(c):t.fromCubemap(c),v.texture.pmremVersion=c.pmremVersion,n.set(c,v),c.addEventListener("dispose",r),v.texture):null}}}return c}function s(c){let x=0;const E=6;for(let w=0;w<E;w++)c[w]!==void 0&&x++;return x===E}function r(c){const x=c.target;x.removeEventListener("dispose",r);const E=n.get(x);E!==void 0&&(n.delete(x),E.dispose())}function u(){n=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:u}}function Ic(e){const n={};function t(i){if(n[i]!==void 0)return n[i];let s;switch(i){case"WEBGL_depth_texture":s=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=e.getExtension(i)}return n[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Qn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Nc(e,n,t,i){const s={},r=new WeakMap;function u(v){const S=v.target;S.index!==null&&n.remove(S.index);for(const F in S.attributes)n.remove(S.attributes[F]);S.removeEventListener("dispose",u),delete s[S.id];const R=r.get(S);R&&(n.remove(R),r.delete(S)),i.releaseStatesOfGeometry(S),S.isInstancedBufferGeometry===!0&&delete S._maxInstanceCount,t.memory.geometries--}function c(v,S){return s[S.id]===!0||(S.addEventListener("dispose",u),s[S.id]=!0,t.memory.geometries++),S}function x(v){const S=v.attributes;for(const R in S)n.update(S[R],e.ARRAY_BUFFER)}function E(v){const S=[],R=v.index,F=v.attributes.position;let L=0;if(R!==null){const D=R.array;L=R.version;for(let T=0,_=D.length;T<_;T+=3){const N=D[T+0],C=D[T+1],I=D[T+2];S.push(N,C,C,I,I,N)}}else if(F!==void 0){const D=F.array;L=F.version;for(let T=0,_=D.length/3-1;T<_;T+=3){const N=T+0,C=T+1,I=T+2;S.push(N,C,C,I,I,N)}}else return;const f=new(Eo(S)?go:vo)(S,1);f.version=L;const a=r.get(v);a&&n.remove(a),r.set(v,f)}function w(v){const S=r.get(v);if(S){const R=v.index;R!==null&&S.version<R.version&&E(v)}else E(v);return r.get(v)}return{get:c,update:x,getWireframeAttribute:w}}function Oc(e,n,t){let i;function s(S){i=S}let r,u;function c(S){r=S.type,u=S.bytesPerElement}function x(S,R){e.drawElements(i,R,r,S*u),t.update(R,i,1)}function E(S,R,F){F!==0&&(e.drawElementsInstanced(i,R,r,S*u,F),t.update(R,i,F))}function w(S,R,F){if(F===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,R,0,r,S,0,F);let f=0;for(let a=0;a<F;a++)f+=R[a];t.update(f,i,1)}function v(S,R,F,L){if(F===0)return;const f=n.get("WEBGL_multi_draw");if(f===null)for(let a=0;a<S.length;a++)E(S[a]/u,R[a],L[a]);else{f.multiDrawElementsInstancedWEBGL(i,R,0,r,S,0,L,0,F);let a=0;for(let D=0;D<F;D++)a+=R[D]*L[D];t.update(a,i,1)}}this.setMode=s,this.setIndex=c,this.render=x,this.renderInstances=E,this.renderMultiDraw=w,this.renderMultiDrawInstances=v}function Fc(e){const n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,u,c){switch(t.calls++,u){case e.TRIANGLES:t.triangles+=c*(r/3);break;case e.LINES:t.lines+=c*(r/2);break;case e.LINE_STRIP:t.lines+=c*(r-1);break;case e.LINE_LOOP:t.lines+=c*r;break;case e.POINTS:t.points+=c*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Bc(e,n,t){const i=new WeakMap,s=new ot;function r(u,c,x){const E=u.morphTargetInfluences,w=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,v=w!==void 0?w.length:0;let S=i.get(c);if(S===void 0||S.count!==v){let h=function(){I.dispose(),i.delete(c),c.removeEventListener("dispose",h)};S!==void 0&&S.texture.dispose();const R=c.morphAttributes.position!==void 0,F=c.morphAttributes.normal!==void 0,L=c.morphAttributes.color!==void 0,f=c.morphAttributes.position||[],a=c.morphAttributes.normal||[],D=c.morphAttributes.color||[];let T=0;R===!0&&(T=1),F===!0&&(T=2),L===!0&&(T=3);let _=c.attributes.position.count*T,N=1;_>n.maxTextureSize&&(N=Math.ceil(_/n.maxTextureSize),_=n.maxTextureSize);const C=new Float32Array(_*N*4*v),I=new ja(C,_,N,v);I.type=Vt,I.needsUpdate=!0;const k=T*4;for(let d=0;d<v;d++){const b=f[d],B=a[d],X=D[d],Y=_*N*4*d;for(let Z=0;Z<b.count;Z++){const W=Z*k;R===!0&&(s.fromBufferAttribute(b,Z),C[Y+W+0]=s.x,C[Y+W+1]=s.y,C[Y+W+2]=s.z,C[Y+W+3]=0),F===!0&&(s.fromBufferAttribute(B,Z),C[Y+W+4]=s.x,C[Y+W+5]=s.y,C[Y+W+6]=s.z,C[Y+W+7]=0),L===!0&&(s.fromBufferAttribute(X,Z),C[Y+W+8]=s.x,C[Y+W+9]=s.y,C[Y+W+10]=s.z,C[Y+W+11]=X.itemSize===4?s.w:1)}}S={count:v,texture:I,size:new Ye(_,N)},i.set(c,S),c.addEventListener("dispose",h)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)x.getUniforms().setValue(e,"morphTexture",u.morphTexture,t);else{let R=0;for(let L=0;L<E.length;L++)R+=E[L];const F=c.morphTargetsRelative?1:1-R;x.getUniforms().setValue(e,"morphTargetBaseInfluence",F),x.getUniforms().setValue(e,"morphTargetInfluences",E)}x.getUniforms().setValue(e,"morphTargetsTexture",S.texture,t),x.getUniforms().setValue(e,"morphTargetsTextureSize",S.size)}return{update:r}}function Hc(e,n,t,i){let s=new WeakMap;function r(x){const E=i.render.frame,w=x.geometry,v=n.get(x,w);if(s.get(v)!==E&&(n.update(v),s.set(v,E)),x.isInstancedMesh&&(x.hasEventListener("dispose",c)===!1&&x.addEventListener("dispose",c),s.get(x)!==E&&(t.update(x.instanceMatrix,e.ARRAY_BUFFER),x.instanceColor!==null&&t.update(x.instanceColor,e.ARRAY_BUFFER),s.set(x,E))),x.isSkinnedMesh){const S=x.skeleton;s.get(S)!==E&&(S.update(),s.set(S,E))}return v}function u(){s=new WeakMap}function c(x){const E=x.target;E.removeEventListener("dispose",c),t.remove(E.instanceMatrix),E.instanceColor!==null&&t.remove(E.instanceColor)}return{update:r,dispose:u}}const rr=new Lo,pa=new Ba(1,1),or=new ja,sr=new Do,lr=new wo,ha=[],ma=[],_a=new Float32Array(16),ga=new Float32Array(9),va=new Float32Array(4);function nn(e,n,t){const i=e[0];if(i<=0||i>0)return e;const s=n*t;let r=ha[s];if(r===void 0&&(r=new Float32Array(s),ha[s]=r),n!==0){i.toArray(r,0);for(let u=1,c=0;u!==n;++u)c+=t,e[u].toArray(r,c)}return r}function st(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function lt(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function yn(e,n){let t=ma[n];t===void 0&&(t=new Int32Array(n),ma[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function Gc(e,n){const t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function Vc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(st(t,n))return;e.uniform2fv(this.addr,n),lt(t,n)}}function zc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(st(t,n))return;e.uniform3fv(this.addr,n),lt(t,n)}}function kc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(st(t,n))return;e.uniform4fv(this.addr,n),lt(t,n)}}function Wc(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(st(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),lt(t,n)}else{if(st(t,i))return;va.set(i),e.uniformMatrix2fv(this.addr,!1,va),lt(t,i)}}function Xc(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(st(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),lt(t,n)}else{if(st(t,i))return;ga.set(i),e.uniformMatrix3fv(this.addr,!1,ga),lt(t,i)}}function Yc(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(st(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),lt(t,n)}else{if(st(t,i))return;_a.set(i),e.uniformMatrix4fv(this.addr,!1,_a),lt(t,i)}}function Kc(e,n){const t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function qc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(st(t,n))return;e.uniform2iv(this.addr,n),lt(t,n)}}function Zc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(st(t,n))return;e.uniform3iv(this.addr,n),lt(t,n)}}function $c(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(st(t,n))return;e.uniform4iv(this.addr,n),lt(t,n)}}function jc(e,n){const t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function Qc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(st(t,n))return;e.uniform2uiv(this.addr,n),lt(t,n)}}function Jc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(st(t,n))return;e.uniform3uiv(this.addr,n),lt(t,n)}}function ef(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(st(t,n))return;e.uniform4uiv(this.addr,n),lt(t,n)}}function tf(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let r;this.type===e.SAMPLER_2D_SHADOW?(pa.compareFunction=Ha,r=pa):r=rr,t.setTexture2D(n||r,s)}function nf(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(n||sr,s)}function af(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(n||lr,s)}function rf(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(n||or,s)}function of(e){switch(e){case 5126:return Gc;case 35664:return Vc;case 35665:return zc;case 35666:return kc;case 35674:return Wc;case 35675:return Xc;case 35676:return Yc;case 5124:case 35670:return Kc;case 35667:case 35671:return qc;case 35668:case 35672:return Zc;case 35669:case 35673:return $c;case 5125:return jc;case 36294:return Qc;case 36295:return Jc;case 36296:return ef;case 35678:case 36198:case 36298:case 36306:case 35682:return tf;case 35679:case 36299:case 36307:return nf;case 35680:case 36300:case 36308:case 36293:return af;case 36289:case 36303:case 36311:case 36292:return rf}}function sf(e,n){e.uniform1fv(this.addr,n)}function lf(e,n){const t=nn(n,this.size,2);e.uniform2fv(this.addr,t)}function cf(e,n){const t=nn(n,this.size,3);e.uniform3fv(this.addr,t)}function ff(e,n){const t=nn(n,this.size,4);e.uniform4fv(this.addr,t)}function df(e,n){const t=nn(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function uf(e,n){const t=nn(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function pf(e,n){const t=nn(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function hf(e,n){e.uniform1iv(this.addr,n)}function mf(e,n){e.uniform2iv(this.addr,n)}function _f(e,n){e.uniform3iv(this.addr,n)}function gf(e,n){e.uniform4iv(this.addr,n)}function vf(e,n){e.uniform1uiv(this.addr,n)}function Ef(e,n){e.uniform2uiv(this.addr,n)}function Sf(e,n){e.uniform3uiv(this.addr,n)}function Mf(e,n){e.uniform4uiv(this.addr,n)}function Tf(e,n,t){const i=this.cache,s=n.length,r=yn(t,s);st(i,r)||(e.uniform1iv(this.addr,r),lt(i,r));for(let u=0;u!==s;++u)t.setTexture2D(n[u]||rr,r[u])}function xf(e,n,t){const i=this.cache,s=n.length,r=yn(t,s);st(i,r)||(e.uniform1iv(this.addr,r),lt(i,r));for(let u=0;u!==s;++u)t.setTexture3D(n[u]||sr,r[u])}function Af(e,n,t){const i=this.cache,s=n.length,r=yn(t,s);st(i,r)||(e.uniform1iv(this.addr,r),lt(i,r));for(let u=0;u!==s;++u)t.setTextureCube(n[u]||lr,r[u])}function Rf(e,n,t){const i=this.cache,s=n.length,r=yn(t,s);st(i,r)||(e.uniform1iv(this.addr,r),lt(i,r));for(let u=0;u!==s;++u)t.setTexture2DArray(n[u]||or,r[u])}function bf(e){switch(e){case 5126:return sf;case 35664:return lf;case 35665:return cf;case 35666:return ff;case 35674:return df;case 35675:return uf;case 35676:return pf;case 5124:case 35670:return hf;case 35667:case 35671:return mf;case 35668:case 35672:return _f;case 35669:case 35673:return gf;case 5125:return vf;case 36294:return Ef;case 36295:return Sf;case 36296:return Mf;case 35678:case 36198:case 36298:case 36306:case 35682:return Tf;case 35679:case 36299:case 36307:return xf;case 35680:case 36300:case 36308:case 36293:return Af;case 36289:case 36303:case 36311:case 36292:return Rf}}class Cf{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=of(t.type)}}class Pf{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=bf(t.type)}}class wf{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){const s=this.seq;for(let r=0,u=s.length;r!==u;++r){const c=s[r];c.setValue(n,t[c.id],i)}}}const Kn=/(\w+)(\])?(\[|\.)?/g;function Ea(e,n){e.seq.push(n),e.map[n.id]=n}function Df(e,n,t){const i=e.name,s=i.length;for(Kn.lastIndex=0;;){const r=Kn.exec(i),u=Kn.lastIndex;let c=r[1];const x=r[2]==="]",E=r[3];if(x&&(c=c|0),E===void 0||E==="["&&u+2===s){Ea(t,E===void 0?new Cf(c,e,n):new Pf(c,e,n));break}else{let v=t.map[c];v===void 0&&(v=new wf(c),Ea(t,v)),t=v}}}class bn{constructor(n,t){this.seq=[],this.map={};const i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=n.getActiveUniform(t,s),u=n.getUniformLocation(t,r.name);Df(r,u,this)}}setValue(n,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(n,i,s)}setOptional(n,t,i){const s=t[i];s!==void 0&&this.setValue(n,i,s)}static upload(n,t,i,s){for(let r=0,u=t.length;r!==u;++r){const c=t[r],x=i[c.id];x.needsUpdate!==!1&&c.setValue(n,x.value,s)}}static seqWithValue(n,t){const i=[];for(let s=0,r=n.length;s!==r;++s){const u=n[s];u.id in t&&i.push(u)}return i}}function Sa(e,n,t){const i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}const Lf=37297;let Uf=0;function yf(e,n){const t=e.split(`
`),i=[],s=Math.max(n-6,0),r=Math.min(n+6,t.length);for(let u=s;u<r;u++){const c=u+1;i.push(`${c===n?">":" "} ${c}: ${t[u]}`)}return i.join(`
`)}const Ma=new Be;function If(e){at._getMatrix(Ma,at.workingColorSpace,e);const n=`mat3( ${Ma.elements.map(t=>t.toFixed(4))} )`;switch(at.getTransfer(e)){case tr:return[n,"LinearTransferOETF"];case qe:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function Ta(e,n,t){const i=e.getShaderParameter(n,e.COMPILE_STATUS),r=(e.getShaderInfoLog(n)||"").trim();if(i&&r==="")return"";const u=/ERROR: 0:(\d+)/.exec(r);if(u){const c=parseInt(u[1]);return t.toUpperCase()+`

`+r+`

`+yf(e.getShaderSource(n),c)}else return r}function Nf(e,n){const t=If(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Of(e,n){let t;switch(n){case Po:t="Linear";break;case Co:t="Reinhard";break;case bo:t="Cineon";break;case Ro:t="ACESFilmic";break;case Ao:t="AgX";break;case xo:t="Neutral";break;case To:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",n),t="Linear"}return"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const vn=new Ce;function Ff(){at.getLuminanceCoefficients(vn);const e=vn.x.toFixed(4),n=vn.y.toFixed(4),t=vn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bf(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(sn).join(`
`)}function Hf(e){const n=[];for(const t in e){const i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function Gf(e,n){const t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=e.getActiveAttrib(n,s),u=r.name;let c=1;r.type===e.FLOAT_MAT2&&(c=2),r.type===e.FLOAT_MAT3&&(c=3),r.type===e.FLOAT_MAT4&&(c=4),t[u]={type:r.type,location:e.getAttribLocation(n,u),locationSize:c}}return t}function sn(e){return e!==""}function xa(e,n){const t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows)}function Aa(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}const Vf=/^[ \t]*#include +<([\w\d./]+)>/gm;function ci(e){return e.replace(Vf,kf)}const zf=new Map;function kf(e,n){let t=Ie[n];if(t===void 0){const i=zf.get(n);if(i!==void 0)t=Ie[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',n,i);else throw new Error("Can not resolve #include <"+n+">")}return ci(t)}const Wf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ra(e){return e.replace(Wf,Xf)}function Xf(e,n,t,i){let s="";for(let r=parseInt(n);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ba(e){let n=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}function Yf(e){let n="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===za?n="SHADOWMAP_TYPE_PCF":e.shadowMapType===Mo?n="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===wt&&(n="SHADOWMAP_TYPE_VSM"),n}function Kf(e){let n="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case un:case tn:n="ENVMAP_TYPE_CUBE";break;case Un:n="ENVMAP_TYPE_CUBE_UV";break}return n}function qf(e){let n="ENVMAP_MODE_REFLECTION";return e.envMap&&e.envMapMode===tn&&(n="ENVMAP_MODE_REFRACTION"),n}function Zf(e){let n="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case No:n="ENVMAP_BLENDING_MULTIPLY";break;case Io:n="ENVMAP_BLENDING_MIX";break;case yo:n="ENVMAP_BLENDING_ADD";break}return n}function $f(e){const n=e.envMapCubeUVHeight;if(n===null)return null;const t=Math.log2(n)-2,i=1/n;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function jf(e,n,t,i){const s=e.getContext(),r=t.defines;let u=t.vertexShader,c=t.fragmentShader;const x=Yf(t),E=Kf(t),w=qf(t),v=Zf(t),S=$f(t),R=Bf(t),F=Hf(r),L=s.createProgram();let f,a,D=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,F].filter(sn).join(`
`),f.length>0&&(f+=`
`),a=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,F].filter(sn).join(`
`),a.length>0&&(a+=`
`)):(f=[ba(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,F,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+w:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+x:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(sn).join(`
`),a=[ba(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,F,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+E:"",t.envMap?"#define "+w:"",t.envMap?"#define "+v:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+x:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yt?"#define TONE_MAPPING":"",t.toneMapping!==yt?Ie.tonemapping_pars_fragment:"",t.toneMapping!==yt?Of("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ie.colorspace_pars_fragment,Nf("linearToOutputTexel",t.outputColorSpace),Ff(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(sn).join(`
`)),u=ci(u),u=xa(u,t),u=Aa(u,t),c=ci(c),c=xa(c,t),c=Aa(c,t),u=Ra(u),c=Ra(c),t.isRawShaderMaterial!==!0&&(D=`#version 300 es
`,f=[R,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,a=["#define varying in",t.glslVersion===na?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===na?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+a);const T=D+f+u,_=D+a+c,N=Sa(s,s.VERTEX_SHADER,T),C=Sa(s,s.FRAGMENT_SHADER,_);s.attachShader(L,N),s.attachShader(L,C),t.index0AttributeName!==void 0?s.bindAttribLocation(L,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(L,0,"position"),s.linkProgram(L);function I(b){if(e.debug.checkShaderErrors){const B=s.getProgramInfoLog(L)||"",X=s.getShaderInfoLog(N)||"",Y=s.getShaderInfoLog(C)||"",Z=B.trim(),W=X.trim(),ie=Y.trim();let G=!0,ge=!0;if(s.getProgramParameter(L,s.LINK_STATUS)===!1)if(G=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,L,N,C);else{const Te=Ta(s,N,"vertex"),Ue=Ta(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(L,s.VALIDATE_STATUS)+`

Material Name: `+b.name+`
Material Type: `+b.type+`

Program Info Log: `+Z+`
`+Te+`
`+Ue)}else Z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Z):(W===""||ie==="")&&(ge=!1);ge&&(b.diagnostics={runnable:G,programLog:Z,vertexShader:{log:W,prefix:f},fragmentShader:{log:ie,prefix:a}})}s.deleteShader(N),s.deleteShader(C),k=new bn(s,L),h=Gf(s,L)}let k;this.getUniforms=function(){return k===void 0&&I(this),k};let h;this.getAttributes=function(){return h===void 0&&I(this),h};let d=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return d===!1&&(d=s.getProgramParameter(L,Lf)),d},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(L),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Uf++,this.cacheKey=n,this.usedTimes=1,this.program=L,this.vertexShader=N,this.fragmentShader=C,this}let Qf=0;class Jf{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n){const t=n.vertexShader,i=n.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),u=this._getShaderCacheForMaterial(n);return u.has(s)===!1&&(u.add(s),s.usedTimes++),u.has(r)===!1&&(u.add(r),r.usedTimes++),this}remove(n){const t=this.materialCache.get(n);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderID(n){return this._getShaderStage(n.vertexShader).id}getFragmentShaderID(n){return this._getShaderStage(n.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){const t=this.materialCache;let i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){const t=this.shaderCache;let i=t.get(n);return i===void 0&&(i=new ed(n),t.set(n,i)),i}}class ed{constructor(n){this.id=Qf++,this.code=n,this.usedTimes=0}}function td(e,n,t,i,s,r,u){const c=new So,x=new Jf,E=new Set,w=[],v=s.logarithmicDepthBuffer,S=s.vertexTextures;let R=s.precision;const F={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function L(h){return E.add(h),h===0?"uv":`uv${h}`}function f(h,d,b,B,X){const Y=B.fog,Z=X.geometry,W=h.isMeshStandardMaterial?B.environment:null,ie=(h.isMeshStandardMaterial?t:n).get(h.envMap||W),G=ie&&ie.mapping===Un?ie.image.height:null,ge=F[h.type];h.precision!==null&&(R=s.getMaxPrecision(h.precision),R!==h.precision&&console.warn("THREE.WebGLProgram.getParameters:",h.precision,"not supported, using",R,"instead."));const Te=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Ue=Te!==void 0?Te.length:0;let He=0;Z.morphAttributes.position!==void 0&&(He=1),Z.morphAttributes.normal!==void 0&&(He=2),Z.morphAttributes.color!==void 0&&(He=3);let nt,et,ke,V;if(ge){const Ge=vt[ge];nt=Ge.vertexShader,et=Ge.fragmentShader}else nt=h.vertexShader,et=h.fragmentShader,x.update(h),ke=x.getVertexShaderID(h),V=x.getFragmentShaderID(h);const q=e.getRenderTarget(),ce=e.state.buffers.depth.getReversed(),Pe=X.isInstancedMesh===!0,Ee=X.isBatchedMesh===!0,Oe=!!h.map,pt=!!h.matcap,m=!!ie,Ze=!!h.aoMap,De=!!h.lightMap,Re=!!h.bumpMap,ue=!!h.normalMap,$e=!!h.displacementMap,pe=!!h.emissiveMap,ye=!!h.metalnessMap,ct=!!h.roughnessMap,it=h.anisotropy>0,p=h.clearcoat>0,o=h.dispersion>0,P=h.iridescence>0,H=h.sheen>0,K=h.transmission>0,O=it&&!!h.anisotropyMap,ve=p&&!!h.clearcoatMap,ee=p&&!!h.clearcoatNormalMap,he=p&&!!h.clearcoatRoughnessMap,me=P&&!!h.iridescenceMap,Q=P&&!!h.iridescenceThicknessMap,oe=H&&!!h.sheenColorMap,Ae=H&&!!h.sheenRoughnessMap,_e=!!h.specularMap,ae=!!h.specularColorMap,Le=!!h.specularIntensityMap,g=K&&!!h.transmissionMap,J=K&&!!h.thicknessMap,te=!!h.gradientMap,le=!!h.alphaMap,$=h.alphaTest>0,z=!!h.alphaHash,de=!!h.extensions;let we=yt;h.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(we=e.toneMapping);const Xe={shaderID:ge,shaderType:h.type,shaderName:h.name,vertexShader:nt,fragmentShader:et,defines:h.defines,customVertexShaderID:ke,customFragmentShaderID:V,isRawShaderMaterial:h.isRawShaderMaterial===!0,glslVersion:h.glslVersion,precision:R,batching:Ee,batchingColor:Ee&&X._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&X.instanceColor!==null,instancingMorph:Pe&&X.morphTexture!==null,supportsVertexTextures:S,outputColorSpace:q===null?e.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:Ln,alphaToCoverage:!!h.alphaToCoverage,map:Oe,matcap:pt,envMap:m,envMapMode:m&&ie.mapping,envMapCubeUVHeight:G,aoMap:Ze,lightMap:De,bumpMap:Re,normalMap:ue,displacementMap:S&&$e,emissiveMap:pe,normalMapObjectSpace:ue&&h.normalMapType===ho,normalMapTangentSpace:ue&&h.normalMapType===po,metalnessMap:ye,roughnessMap:ct,anisotropy:it,anisotropyMap:O,clearcoat:p,clearcoatMap:ve,clearcoatNormalMap:ee,clearcoatRoughnessMap:he,dispersion:o,iridescence:P,iridescenceMap:me,iridescenceThicknessMap:Q,sheen:H,sheenColorMap:oe,sheenRoughnessMap:Ae,specularMap:_e,specularColorMap:ae,specularIntensityMap:Le,transmission:K,transmissionMap:g,thicknessMap:J,gradientMap:te,opaque:h.transparent===!1&&h.blending===Rn&&h.alphaToCoverage===!1,alphaMap:le,alphaTest:$,alphaHash:z,combine:h.combine,mapUv:Oe&&L(h.map.channel),aoMapUv:Ze&&L(h.aoMap.channel),lightMapUv:De&&L(h.lightMap.channel),bumpMapUv:Re&&L(h.bumpMap.channel),normalMapUv:ue&&L(h.normalMap.channel),displacementMapUv:$e&&L(h.displacementMap.channel),emissiveMapUv:pe&&L(h.emissiveMap.channel),metalnessMapUv:ye&&L(h.metalnessMap.channel),roughnessMapUv:ct&&L(h.roughnessMap.channel),anisotropyMapUv:O&&L(h.anisotropyMap.channel),clearcoatMapUv:ve&&L(h.clearcoatMap.channel),clearcoatNormalMapUv:ee&&L(h.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&L(h.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&L(h.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&L(h.iridescenceThicknessMap.channel),sheenColorMapUv:oe&&L(h.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&L(h.sheenRoughnessMap.channel),specularMapUv:_e&&L(h.specularMap.channel),specularColorMapUv:ae&&L(h.specularColorMap.channel),specularIntensityMapUv:Le&&L(h.specularIntensityMap.channel),transmissionMapUv:g&&L(h.transmissionMap.channel),thicknessMapUv:J&&L(h.thicknessMap.channel),alphaMapUv:le&&L(h.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(ue||it),vertexColors:h.vertexColors,vertexAlphas:h.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!Z.attributes.uv&&(Oe||le),fog:!!Y,useFog:h.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:h.flatShading===!0&&h.wireframe===!1,sizeAttenuation:h.sizeAttenuation===!0,logarithmicDepthBuffer:v,reversedDepthBuffer:ce,skinning:X.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:Ue,morphTextureStride:He,numDirLights:d.directional.length,numPointLights:d.point.length,numSpotLights:d.spot.length,numSpotLightMaps:d.spotLightMap.length,numRectAreaLights:d.rectArea.length,numHemiLights:d.hemi.length,numDirLightShadows:d.directionalShadowMap.length,numPointLightShadows:d.pointShadowMap.length,numSpotLightShadows:d.spotShadowMap.length,numSpotLightShadowsWithMaps:d.numSpotLightShadowsWithMaps,numLightProbes:d.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:h.dithering,shadowMapEnabled:e.shadowMap.enabled&&b.length>0,shadowMapType:e.shadowMap.type,toneMapping:we,decodeVideoTexture:Oe&&h.map.isVideoTexture===!0&&at.getTransfer(h.map.colorSpace)===qe,decodeVideoTextureEmissive:pe&&h.emissiveMap.isVideoTexture===!0&&at.getTransfer(h.emissiveMap.colorSpace)===qe,premultipliedAlpha:h.premultipliedAlpha,doubleSided:h.side===Dt,flipSided:h.side===xt,useDepthPacking:h.depthPacking>=0,depthPacking:h.depthPacking||0,index0AttributeName:h.index0AttributeName,extensionClipCullDistance:de&&h.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(de&&h.extensions.multiDraw===!0||Ee)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:h.customProgramCacheKey()};return Xe.vertexUv1s=E.has(1),Xe.vertexUv2s=E.has(2),Xe.vertexUv3s=E.has(3),E.clear(),Xe}function a(h){const d=[];if(h.shaderID?d.push(h.shaderID):(d.push(h.customVertexShaderID),d.push(h.customFragmentShaderID)),h.defines!==void 0)for(const b in h.defines)d.push(b),d.push(h.defines[b]);return h.isRawShaderMaterial===!1&&(D(d,h),T(d,h),d.push(e.outputColorSpace)),d.push(h.customProgramCacheKey),d.join()}function D(h,d){h.push(d.precision),h.push(d.outputColorSpace),h.push(d.envMapMode),h.push(d.envMapCubeUVHeight),h.push(d.mapUv),h.push(d.alphaMapUv),h.push(d.lightMapUv),h.push(d.aoMapUv),h.push(d.bumpMapUv),h.push(d.normalMapUv),h.push(d.displacementMapUv),h.push(d.emissiveMapUv),h.push(d.metalnessMapUv),h.push(d.roughnessMapUv),h.push(d.anisotropyMapUv),h.push(d.clearcoatMapUv),h.push(d.clearcoatNormalMapUv),h.push(d.clearcoatRoughnessMapUv),h.push(d.iridescenceMapUv),h.push(d.iridescenceThicknessMapUv),h.push(d.sheenColorMapUv),h.push(d.sheenRoughnessMapUv),h.push(d.specularMapUv),h.push(d.specularColorMapUv),h.push(d.specularIntensityMapUv),h.push(d.transmissionMapUv),h.push(d.thicknessMapUv),h.push(d.combine),h.push(d.fogExp2),h.push(d.sizeAttenuation),h.push(d.morphTargetsCount),h.push(d.morphAttributeCount),h.push(d.numDirLights),h.push(d.numPointLights),h.push(d.numSpotLights),h.push(d.numSpotLightMaps),h.push(d.numHemiLights),h.push(d.numRectAreaLights),h.push(d.numDirLightShadows),h.push(d.numPointLightShadows),h.push(d.numSpotLightShadows),h.push(d.numSpotLightShadowsWithMaps),h.push(d.numLightProbes),h.push(d.shadowMapType),h.push(d.toneMapping),h.push(d.numClippingPlanes),h.push(d.numClipIntersection),h.push(d.depthPacking)}function T(h,d){c.disableAll(),d.supportsVertexTextures&&c.enable(0),d.instancing&&c.enable(1),d.instancingColor&&c.enable(2),d.instancingMorph&&c.enable(3),d.matcap&&c.enable(4),d.envMap&&c.enable(5),d.normalMapObjectSpace&&c.enable(6),d.normalMapTangentSpace&&c.enable(7),d.clearcoat&&c.enable(8),d.iridescence&&c.enable(9),d.alphaTest&&c.enable(10),d.vertexColors&&c.enable(11),d.vertexAlphas&&c.enable(12),d.vertexUv1s&&c.enable(13),d.vertexUv2s&&c.enable(14),d.vertexUv3s&&c.enable(15),d.vertexTangents&&c.enable(16),d.anisotropy&&c.enable(17),d.alphaHash&&c.enable(18),d.batching&&c.enable(19),d.dispersion&&c.enable(20),d.batchingColor&&c.enable(21),d.gradientMap&&c.enable(22),h.push(c.mask),c.disableAll(),d.fog&&c.enable(0),d.useFog&&c.enable(1),d.flatShading&&c.enable(2),d.logarithmicDepthBuffer&&c.enable(3),d.reversedDepthBuffer&&c.enable(4),d.skinning&&c.enable(5),d.morphTargets&&c.enable(6),d.morphNormals&&c.enable(7),d.morphColors&&c.enable(8),d.premultipliedAlpha&&c.enable(9),d.shadowMapEnabled&&c.enable(10),d.doubleSided&&c.enable(11),d.flipSided&&c.enable(12),d.useDepthPacking&&c.enable(13),d.dithering&&c.enable(14),d.transmission&&c.enable(15),d.sheen&&c.enable(16),d.opaque&&c.enable(17),d.pointsUvs&&c.enable(18),d.decodeVideoTexture&&c.enable(19),d.decodeVideoTextureEmissive&&c.enable(20),d.alphaToCoverage&&c.enable(21),h.push(c.mask)}function _(h){const d=F[h.type];let b;if(d){const B=vt[d];b=di.clone(B.uniforms)}else b=h.uniforms;return b}function N(h,d){let b;for(let B=0,X=w.length;B<X;B++){const Y=w[B];if(Y.cacheKey===d){b=Y,++b.usedTimes;break}}return b===void 0&&(b=new jf(e,d,h,r),w.push(b)),b}function C(h){if(--h.usedTimes===0){const d=w.indexOf(h);w[d]=w[w.length-1],w.pop(),h.destroy()}}function I(h){x.remove(h)}function k(){x.dispose()}return{getParameters:f,getProgramCacheKey:a,getUniforms:_,acquireProgram:N,releaseProgram:C,releaseShaderCache:I,programs:w,dispose:k}}function nd(){let e=new WeakMap;function n(u){return e.has(u)}function t(u){let c=e.get(u);return c===void 0&&(c={},e.set(u,c)),c}function i(u){e.delete(u)}function s(u,c,x){e.get(u)[c]=x}function r(){e=new WeakMap}return{has:n,get:t,remove:i,update:s,dispose:r}}function id(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.z!==n.z?e.z-n.z:e.id-n.id}function Ca(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function Pa(){const e=[];let n=0;const t=[],i=[],s=[];function r(){n=0,t.length=0,i.length=0,s.length=0}function u(v,S,R,F,L,f){let a=e[n];return a===void 0?(a={id:v.id,object:v,geometry:S,material:R,groupOrder:F,renderOrder:v.renderOrder,z:L,group:f},e[n]=a):(a.id=v.id,a.object=v,a.geometry=S,a.material=R,a.groupOrder=F,a.renderOrder=v.renderOrder,a.z=L,a.group=f),n++,a}function c(v,S,R,F,L,f){const a=u(v,S,R,F,L,f);R.transmission>0?i.push(a):R.transparent===!0?s.push(a):t.push(a)}function x(v,S,R,F,L,f){const a=u(v,S,R,F,L,f);R.transmission>0?i.unshift(a):R.transparent===!0?s.unshift(a):t.unshift(a)}function E(v,S){t.length>1&&t.sort(v||id),i.length>1&&i.sort(S||Ca),s.length>1&&s.sort(S||Ca)}function w(){for(let v=n,S=e.length;v<S;v++){const R=e[v];if(R.id===null)break;R.id=null,R.object=null,R.geometry=null,R.material=null,R.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:x,finish:w,sort:E}}function ad(){let e=new WeakMap;function n(i,s){const r=e.get(i);let u;return r===void 0?(u=new Pa,e.set(i,[u])):s>=r.length?(u=new Pa,r.push(u)):u=r[s],u}function t(){e=new WeakMap}return{get:n,dispose:t}}function rd(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={direction:new Ce,color:new je};break;case"SpotLight":t={position:new Ce,direction:new Ce,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Ce,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Ce,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new Ce,halfWidth:new Ce,halfHeight:new Ce};break}return e[n.id]=t,t}}}function od(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}let sd=0;function ld(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function cd(e){const n=new rd,t=od(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let E=0;E<9;E++)i.probe.push(new Ce);const s=new Ce,r=new Jt,u=new Jt;function c(E){let w=0,v=0,S=0;for(let h=0;h<9;h++)i.probe[h].set(0,0,0);let R=0,F=0,L=0,f=0,a=0,D=0,T=0,_=0,N=0,C=0,I=0;E.sort(ld);for(let h=0,d=E.length;h<d;h++){const b=E[h],B=b.color,X=b.intensity,Y=b.distance,Z=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)w+=B.r*X,v+=B.g*X,S+=B.b*X;else if(b.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(b.sh.coefficients[W],X);I++}else if(b.isDirectionalLight){const W=n.get(b);if(W.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){const ie=b.shadow,G=t.get(b);G.shadowIntensity=ie.intensity,G.shadowBias=ie.bias,G.shadowNormalBias=ie.normalBias,G.shadowRadius=ie.radius,G.shadowMapSize=ie.mapSize,i.directionalShadow[R]=G,i.directionalShadowMap[R]=Z,i.directionalShadowMatrix[R]=b.shadow.matrix,D++}i.directional[R]=W,R++}else if(b.isSpotLight){const W=n.get(b);W.position.setFromMatrixPosition(b.matrixWorld),W.color.copy(B).multiplyScalar(X),W.distance=Y,W.coneCos=Math.cos(b.angle),W.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),W.decay=b.decay,i.spot[L]=W;const ie=b.shadow;if(b.map&&(i.spotLightMap[N]=b.map,N++,ie.updateMatrices(b),b.castShadow&&C++),i.spotLightMatrix[L]=ie.matrix,b.castShadow){const G=t.get(b);G.shadowIntensity=ie.intensity,G.shadowBias=ie.bias,G.shadowNormalBias=ie.normalBias,G.shadowRadius=ie.radius,G.shadowMapSize=ie.mapSize,i.spotShadow[L]=G,i.spotShadowMap[L]=Z,_++}L++}else if(b.isRectAreaLight){const W=n.get(b);W.color.copy(B).multiplyScalar(X),W.halfWidth.set(b.width*.5,0,0),W.halfHeight.set(0,b.height*.5,0),i.rectArea[f]=W,f++}else if(b.isPointLight){const W=n.get(b);if(W.color.copy(b.color).multiplyScalar(b.intensity),W.distance=b.distance,W.decay=b.decay,b.castShadow){const ie=b.shadow,G=t.get(b);G.shadowIntensity=ie.intensity,G.shadowBias=ie.bias,G.shadowNormalBias=ie.normalBias,G.shadowRadius=ie.radius,G.shadowMapSize=ie.mapSize,G.shadowCameraNear=ie.camera.near,G.shadowCameraFar=ie.camera.far,i.pointShadow[F]=G,i.pointShadowMap[F]=Z,i.pointShadowMatrix[F]=b.shadow.matrix,T++}i.point[F]=W,F++}else if(b.isHemisphereLight){const W=n.get(b);W.skyColor.copy(b.color).multiplyScalar(X),W.groundColor.copy(b.groundColor).multiplyScalar(X),i.hemi[a]=W,a++}}f>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ne.LTC_FLOAT_1,i.rectAreaLTC2=ne.LTC_FLOAT_2):(i.rectAreaLTC1=ne.LTC_HALF_1,i.rectAreaLTC2=ne.LTC_HALF_2)),i.ambient[0]=w,i.ambient[1]=v,i.ambient[2]=S;const k=i.hash;(k.directionalLength!==R||k.pointLength!==F||k.spotLength!==L||k.rectAreaLength!==f||k.hemiLength!==a||k.numDirectionalShadows!==D||k.numPointShadows!==T||k.numSpotShadows!==_||k.numSpotMaps!==N||k.numLightProbes!==I)&&(i.directional.length=R,i.spot.length=L,i.rectArea.length=f,i.point.length=F,i.hemi.length=a,i.directionalShadow.length=D,i.directionalShadowMap.length=D,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=D,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=_+N-C,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=I,k.directionalLength=R,k.pointLength=F,k.spotLength=L,k.rectAreaLength=f,k.hemiLength=a,k.numDirectionalShadows=D,k.numPointShadows=T,k.numSpotShadows=_,k.numSpotMaps=N,k.numLightProbes=I,i.version=sd++)}function x(E,w){let v=0,S=0,R=0,F=0,L=0;const f=w.matrixWorldInverse;for(let a=0,D=E.length;a<D;a++){const T=E[a];if(T.isDirectionalLight){const _=i.directional[v];_.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(f),v++}else if(T.isSpotLight){const _=i.spot[R];_.position.setFromMatrixPosition(T.matrixWorld),_.position.applyMatrix4(f),_.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(f),R++}else if(T.isRectAreaLight){const _=i.rectArea[F];_.position.setFromMatrixPosition(T.matrixWorld),_.position.applyMatrix4(f),u.identity(),r.copy(T.matrixWorld),r.premultiply(f),u.extractRotation(r),_.halfWidth.set(T.width*.5,0,0),_.halfHeight.set(0,T.height*.5,0),_.halfWidth.applyMatrix4(u),_.halfHeight.applyMatrix4(u),F++}else if(T.isPointLight){const _=i.point[S];_.position.setFromMatrixPosition(T.matrixWorld),_.position.applyMatrix4(f),S++}else if(T.isHemisphereLight){const _=i.hemi[L];_.direction.setFromMatrixPosition(T.matrixWorld),_.direction.transformDirection(f),L++}}}return{setup:c,setupView:x,state:i}}function wa(e){const n=new cd(e),t=[],i=[];function s(w){E.camera=w,t.length=0,i.length=0}function r(w){t.push(w)}function u(w){i.push(w)}function c(){n.setup(t)}function x(w){n.setupView(t,w)}const E={lightsArray:t,shadowsArray:i,camera:null,lights:n,transmissionRenderTarget:{}};return{init:s,state:E,setupLights:c,setupLightsView:x,pushLight:r,pushShadow:u}}function fd(e){let n=new WeakMap;function t(s,r=0){const u=n.get(s);let c;return u===void 0?(c=new wa(e),n.set(s,[c])):r>=u.length?(c=new wa(e),u.push(c)):c=u[r],c}function i(){n=new WeakMap}return{get:t,dispose:i}}const dd=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ud=`uniform sampler2D shadow_pass;
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
}`;function pd(e,n,t){let i=new Fa;const s=new Ye,r=new Ye,u=new ot,c=new jr({depthPacking:Qr}),x=new Jr,E={},w=t.maxTextureSize,v={[cn]:xt,[xt]:cn,[Dt]:Dt},S=new It({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ye},radius:{value:4}},vertexShader:dd,fragmentShader:ud}),R=S.clone();R.defines.HORIZONTAL_PASS=1;const F=new Va;F.setAttribute("position",new An(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const L=new Ut(F,S),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=za;let a=this.type;this.render=function(C,I,k){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||C.length===0)return;const h=e.getRenderTarget(),d=e.getActiveCubeFace(),b=e.getActiveMipmapLevel(),B=e.state;B.setBlending(zt),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const X=a!==wt&&this.type===wt,Y=a===wt&&this.type!==wt;for(let Z=0,W=C.length;Z<W;Z++){const ie=C[Z],G=ie.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const ge=G.getFrameExtents();if(s.multiply(ge),r.copy(G.mapSize),(s.x>w||s.y>w)&&(s.x>w&&(r.x=Math.floor(w/ge.x),s.x=r.x*ge.x,G.mapSize.x=r.x),s.y>w&&(r.y=Math.floor(w/ge.y),s.y=r.y*ge.y,G.mapSize.y=r.y)),G.map===null||X===!0||Y===!0){const Ue=this.type!==wt?{minFilter:ln,magFilter:ln}:{};G.map!==null&&G.map.dispose(),G.map=new en(s.x,s.y,Ue),G.map.texture.name=ie.name+".shadowMap",G.camera.updateProjectionMatrix()}e.setRenderTarget(G.map),e.clear();const Te=G.getViewportCount();for(let Ue=0;Ue<Te;Ue++){const He=G.getViewport(Ue);u.set(r.x*He.x,r.y*He.y,r.x*He.z,r.y*He.w),B.viewport(u),G.updateMatrices(ie,Ue),i=G.getFrustum(),_(I,k,G.camera,ie,this.type)}G.isPointLightShadow!==!0&&this.type===wt&&D(G,k),G.needsUpdate=!1}a=this.type,f.needsUpdate=!1,e.setRenderTarget(h,d,b)};function D(C,I){const k=n.update(L);S.defines.VSM_SAMPLES!==C.blurSamples&&(S.defines.VSM_SAMPLES=C.blurSamples,R.defines.VSM_SAMPLES=C.blurSamples,S.needsUpdate=!0,R.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new en(s.x,s.y)),S.uniforms.shadow_pass.value=C.map.texture,S.uniforms.resolution.value=C.mapSize,S.uniforms.radius.value=C.radius,e.setRenderTarget(C.mapPass),e.clear(),e.renderBufferDirect(I,null,k,S,L,null),R.uniforms.shadow_pass.value=C.mapPass.texture,R.uniforms.resolution.value=C.mapSize,R.uniforms.radius.value=C.radius,e.setRenderTarget(C.map),e.clear(),e.renderBufferDirect(I,null,k,R,L,null)}function T(C,I,k,h){let d=null;const b=k.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(b!==void 0)d=b;else if(d=k.isPointLight===!0?x:c,e.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){const B=d.uuid,X=I.uuid;let Y=E[B];Y===void 0&&(Y={},E[B]=Y);let Z=Y[X];Z===void 0&&(Z=d.clone(),Y[X]=Z,I.addEventListener("dispose",N)),d=Z}if(d.visible=I.visible,d.wireframe=I.wireframe,h===wt?d.side=I.shadowSide!==null?I.shadowSide:I.side:d.side=I.shadowSide!==null?I.shadowSide:v[I.side],d.alphaMap=I.alphaMap,d.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,d.map=I.map,d.clipShadows=I.clipShadows,d.clippingPlanes=I.clippingPlanes,d.clipIntersection=I.clipIntersection,d.displacementMap=I.displacementMap,d.displacementScale=I.displacementScale,d.displacementBias=I.displacementBias,d.wireframeLinewidth=I.wireframeLinewidth,d.linewidth=I.linewidth,k.isPointLight===!0&&d.isMeshDistanceMaterial===!0){const B=e.properties.get(d);B.light=k}return d}function _(C,I,k,h,d){if(C.visible===!1)return;if(C.layers.test(I.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&d===wt)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,C.matrixWorld);const X=n.update(C),Y=C.material;if(Array.isArray(Y)){const Z=X.groups;for(let W=0,ie=Z.length;W<ie;W++){const G=Z[W],ge=Y[G.materialIndex];if(ge&&ge.visible){const Te=T(C,ge,h,d);C.onBeforeShadow(e,C,I,k,X,Te,G),e.renderBufferDirect(k,null,X,Te,C,G),C.onAfterShadow(e,C,I,k,X,Te,G)}}}else if(Y.visible){const Z=T(C,Y,h,d);C.onBeforeShadow(e,C,I,k,X,Z,null),e.renderBufferDirect(k,null,X,Z,C,null),C.onAfterShadow(e,C,I,k,X,Z,null)}}const B=C.children;for(let X=0,Y=B.length;X<Y;X++)_(B[X],I,k,h,d)}function N(C){C.target.removeEventListener("dispose",N);for(const k in E){const h=E[k],d=C.target.uuid;d in h&&(h[d].dispose(),delete h[d])}}}const hd={[ri]:ai,[ii]:ei,[ni]:Jn,[Pn]:ti,[ai]:ri,[ei]:ii,[Jn]:ni,[ti]:Pn};function md(e,n){function t(){let g=!1;const J=new ot;let te=null;const le=new ot(0,0,0,0);return{setMask:function($){te!==$&&!g&&(e.colorMask($,$,$,$),te=$)},setLocked:function($){g=$},setClear:function($,z,de,we,Xe){Xe===!0&&($*=we,z*=we,de*=we),J.set($,z,de,we),le.equals(J)===!1&&(e.clearColor($,z,de,we),le.copy(J))},reset:function(){g=!1,te=null,le.set(-1,0,0,0)}}}function i(){let g=!1,J=!1,te=null,le=null,$=null;return{setReversed:function(z){if(J!==z){const de=n.get("EXT_clip_control");z?de.clipControlEXT(de.LOWER_LEFT_EXT,de.ZERO_TO_ONE_EXT):de.clipControlEXT(de.LOWER_LEFT_EXT,de.NEGATIVE_ONE_TO_ONE_EXT),J=z;const we=$;$=null,this.setClear(we)}},getReversed:function(){return J},setTest:function(z){z?q(e.DEPTH_TEST):ce(e.DEPTH_TEST)},setMask:function(z){te!==z&&!g&&(e.depthMask(z),te=z)},setFunc:function(z){if(J&&(z=hd[z]),le!==z){switch(z){case ri:e.depthFunc(e.NEVER);break;case ai:e.depthFunc(e.ALWAYS);break;case ii:e.depthFunc(e.LESS);break;case Pn:e.depthFunc(e.LEQUAL);break;case ni:e.depthFunc(e.EQUAL);break;case ti:e.depthFunc(e.GEQUAL);break;case ei:e.depthFunc(e.GREATER);break;case Jn:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}le=z}},setLocked:function(z){g=z},setClear:function(z){$!==z&&(J&&(z=1-z),e.clearDepth(z),$=z)},reset:function(){g=!1,te=null,le=null,$=null,J=!1}}}function s(){let g=!1,J=null,te=null,le=null,$=null,z=null,de=null,we=null,Xe=null;return{setTest:function(Ge){g||(Ge?q(e.STENCIL_TEST):ce(e.STENCIL_TEST))},setMask:function(Ge){J!==Ge&&!g&&(e.stencilMask(Ge),J=Ge)},setFunc:function(Ge,Pt,At){(te!==Ge||le!==Pt||$!==At)&&(e.stencilFunc(Ge,Pt,At),te=Ge,le=Pt,$=At)},setOp:function(Ge,Pt,At){(z!==Ge||de!==Pt||we!==At)&&(e.stencilOp(Ge,Pt,At),z=Ge,de=Pt,we=At)},setLocked:function(Ge){g=Ge},setClear:function(Ge){Xe!==Ge&&(e.clearStencil(Ge),Xe=Ge)},reset:function(){g=!1,J=null,te=null,le=null,$=null,z=null,de=null,we=null,Xe=null}}}const r=new t,u=new i,c=new s,x=new WeakMap,E=new WeakMap;let w={},v={},S=new WeakMap,R=[],F=null,L=!1,f=null,a=null,D=null,T=null,_=null,N=null,C=null,I=new je(0,0,0),k=0,h=!1,d=null,b=null,B=null,X=null,Y=null;const Z=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,ie=0;const G=e.getParameter(e.VERSION);G.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(G)[1]),W=ie>=1):G.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),W=ie>=2);let ge=null,Te={};const Ue=e.getParameter(e.SCISSOR_BOX),He=e.getParameter(e.VIEWPORT),nt=new ot().fromArray(Ue),et=new ot().fromArray(He);function ke(g,J,te,le){const $=new Uint8Array(4),z=e.createTexture();e.bindTexture(g,z),e.texParameteri(g,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(g,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let de=0;de<te;de++)g===e.TEXTURE_3D||g===e.TEXTURE_2D_ARRAY?e.texImage3D(J,0,e.RGBA,1,1,le,0,e.RGBA,e.UNSIGNED_BYTE,$):e.texImage2D(J+de,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,$);return z}const V={};V[e.TEXTURE_2D]=ke(e.TEXTURE_2D,e.TEXTURE_2D,1),V[e.TEXTURE_CUBE_MAP]=ke(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[e.TEXTURE_2D_ARRAY]=ke(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),V[e.TEXTURE_3D]=ke(e.TEXTURE_3D,e.TEXTURE_3D,1,1),r.setClear(0,0,0,1),u.setClear(1),c.setClear(0),q(e.DEPTH_TEST),u.setFunc(Pn),Re(!1),ue($i),q(e.CULL_FACE),Ze(zt);function q(g){w[g]!==!0&&(e.enable(g),w[g]=!0)}function ce(g){w[g]!==!1&&(e.disable(g),w[g]=!1)}function Pe(g,J){return v[g]!==J?(e.bindFramebuffer(g,J),v[g]=J,g===e.DRAW_FRAMEBUFFER&&(v[e.FRAMEBUFFER]=J),g===e.FRAMEBUFFER&&(v[e.DRAW_FRAMEBUFFER]=J),!0):!1}function Ee(g,J){let te=R,le=!1;if(g){te=S.get(J),te===void 0&&(te=[],S.set(J,te));const $=g.textures;if(te.length!==$.length||te[0]!==e.COLOR_ATTACHMENT0){for(let z=0,de=$.length;z<de;z++)te[z]=e.COLOR_ATTACHMENT0+z;te.length=$.length,le=!0}}else te[0]!==e.BACK&&(te[0]=e.BACK,le=!0);le&&e.drawBuffers(te)}function Oe(g){return F!==g?(e.useProgram(g),F=g,!0):!1}const pt={[rn]:e.FUNC_ADD,[Ar]:e.FUNC_SUBTRACT,[xr]:e.FUNC_REVERSE_SUBTRACT};pt[Oo]=e.MIN,pt[Fo]=e.MAX;const m={[Hr]:e.ZERO,[Br]:e.ONE,[Fr]:e.SRC_COLOR,[Or]:e.SRC_ALPHA,[Nr]:e.SRC_ALPHA_SATURATE,[Ir]:e.DST_COLOR,[yr]:e.DST_ALPHA,[Ur]:e.ONE_MINUS_SRC_COLOR,[Lr]:e.ONE_MINUS_SRC_ALPHA,[Dr]:e.ONE_MINUS_DST_COLOR,[wr]:e.ONE_MINUS_DST_ALPHA,[Pr]:e.CONSTANT_COLOR,[Cr]:e.ONE_MINUS_CONSTANT_COLOR,[br]:e.CONSTANT_ALPHA,[Rr]:e.ONE_MINUS_CONSTANT_ALPHA};function Ze(g,J,te,le,$,z,de,we,Xe,Ge){if(g===zt){L===!0&&(ce(e.BLEND),L=!1);return}if(L===!1&&(q(e.BLEND),L=!0),g!==fo){if(g!==f||Ge!==h){if((a!==rn||_!==rn)&&(e.blendEquation(e.FUNC_ADD),a=rn,_=rn),Ge)switch(g){case Rn:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Ji:e.blendFunc(e.ONE,e.ONE);break;case Qi:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case ji:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",g);break}else switch(g){case Rn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Ji:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case Qi:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ji:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",g);break}D=null,T=null,N=null,C=null,I.set(0,0,0),k=0,f=g,h=Ge}return}$=$||J,z=z||te,de=de||le,(J!==a||$!==_)&&(e.blendEquationSeparate(pt[J],pt[$]),a=J,_=$),(te!==D||le!==T||z!==N||de!==C)&&(e.blendFuncSeparate(m[te],m[le],m[z],m[de]),D=te,T=le,N=z,C=de),(we.equals(I)===!1||Xe!==k)&&(e.blendColor(we.r,we.g,we.b,Xe),I.copy(we),k=Xe),f=g,h=!1}function De(g,J){g.side===Dt?ce(e.CULL_FACE):q(e.CULL_FACE);let te=g.side===xt;J&&(te=!te),Re(te),g.blending===Rn&&g.transparent===!1?Ze(zt):Ze(g.blending,g.blendEquation,g.blendSrc,g.blendDst,g.blendEquationAlpha,g.blendSrcAlpha,g.blendDstAlpha,g.blendColor,g.blendAlpha,g.premultipliedAlpha),u.setFunc(g.depthFunc),u.setTest(g.depthTest),u.setMask(g.depthWrite),r.setMask(g.colorWrite);const le=g.stencilWrite;c.setTest(le),le&&(c.setMask(g.stencilWriteMask),c.setFunc(g.stencilFunc,g.stencilRef,g.stencilFuncMask),c.setOp(g.stencilFail,g.stencilZFail,g.stencilZPass)),pe(g.polygonOffset,g.polygonOffsetFactor,g.polygonOffsetUnits),g.alphaToCoverage===!0?q(e.SAMPLE_ALPHA_TO_COVERAGE):ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function Re(g){d!==g&&(g?e.frontFace(e.CW):e.frontFace(e.CCW),d=g)}function ue(g){g!==lo?(q(e.CULL_FACE),g!==b&&(g===$i?e.cullFace(e.BACK):g===co?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):ce(e.CULL_FACE),b=g}function $e(g){g!==B&&(W&&e.lineWidth(g),B=g)}function pe(g,J,te){g?(q(e.POLYGON_OFFSET_FILL),(X!==J||Y!==te)&&(e.polygonOffset(J,te),X=J,Y=te)):ce(e.POLYGON_OFFSET_FILL)}function ye(g){g?q(e.SCISSOR_TEST):ce(e.SCISSOR_TEST)}function ct(g){g===void 0&&(g=e.TEXTURE0+Z-1),ge!==g&&(e.activeTexture(g),ge=g)}function it(g,J,te){te===void 0&&(ge===null?te=e.TEXTURE0+Z-1:te=ge);let le=Te[te];le===void 0&&(le={type:void 0,texture:void 0},Te[te]=le),(le.type!==g||le.texture!==J)&&(ge!==te&&(e.activeTexture(te),ge=te),e.bindTexture(g,J||V[g]),le.type=g,le.texture=J)}function p(){const g=Te[ge];g!==void 0&&g.type!==void 0&&(e.bindTexture(g.type,null),g.type=void 0,g.texture=void 0)}function o(){try{e.compressedTexImage2D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function P(){try{e.compressedTexImage3D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function H(){try{e.texSubImage2D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function K(){try{e.texSubImage3D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function O(){try{e.compressedTexSubImage2D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function ve(){try{e.compressedTexSubImage3D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function ee(){try{e.texStorage2D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function he(){try{e.texStorage3D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function me(){try{e.texImage2D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function Q(){try{e.texImage3D(...arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function oe(g){nt.equals(g)===!1&&(e.scissor(g.x,g.y,g.z,g.w),nt.copy(g))}function Ae(g){et.equals(g)===!1&&(e.viewport(g.x,g.y,g.z,g.w),et.copy(g))}function _e(g,J){let te=E.get(J);te===void 0&&(te=new WeakMap,E.set(J,te));let le=te.get(g);le===void 0&&(le=e.getUniformBlockIndex(J,g.name),te.set(g,le))}function ae(g,J){const le=E.get(J).get(g);x.get(J)!==le&&(e.uniformBlockBinding(J,le,g.__bindingPointIndex),x.set(J,le))}function Le(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),u.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),w={},ge=null,Te={},v={},S=new WeakMap,R=[],F=null,L=!1,f=null,a=null,D=null,T=null,_=null,N=null,C=null,I=new je(0,0,0),k=0,h=!1,d=null,b=null,B=null,X=null,Y=null,nt.set(0,0,e.canvas.width,e.canvas.height),et.set(0,0,e.canvas.width,e.canvas.height),r.reset(),u.reset(),c.reset()}return{buffers:{color:r,depth:u,stencil:c},enable:q,disable:ce,bindFramebuffer:Pe,drawBuffers:Ee,useProgram:Oe,setBlending:Ze,setMaterial:De,setFlipSided:Re,setCullFace:ue,setLineWidth:$e,setPolygonOffset:pe,setScissorTest:ye,activeTexture:ct,bindTexture:it,unbindTexture:p,compressedTexImage2D:o,compressedTexImage3D:P,texImage2D:me,texImage3D:Q,updateUBOMapping:_e,uniformBlockBinding:ae,texStorage2D:ee,texStorage3D:he,texSubImage2D:H,texSubImage3D:K,compressedTexSubImage2D:O,compressedTexSubImage3D:ve,scissor:oe,viewport:Ae,reset:Le}}function _d(e,n,t,i,s,r,u){const c=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,x=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),E=new Ye,w=new WeakMap;let v;const S=new WeakMap;let R=!1;try{R=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function F(p,o){return R?new OffscreenCanvas(p,o):Uo("canvas")}function L(p,o,P){let H=1;const K=it(p);if((K.width>P||K.height>P)&&(H=P/Math.max(K.width,K.height)),H<1)if(typeof HTMLImageElement<"u"&&p instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&p instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&p instanceof ImageBitmap||typeof VideoFrame<"u"&&p instanceof VideoFrame){const O=Math.floor(H*K.width),ve=Math.floor(H*K.height);v===void 0&&(v=F(O,ve));const ee=o?F(O,ve):v;return ee.width=O,ee.height=ve,ee.getContext("2d").drawImage(p,0,0,O,ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+O+"x"+ve+")."),ee}else return"data"in p&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),p;return p}function f(p){return p.generateMipmaps}function a(p){e.generateMipmap(p)}function D(p){return p.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:p.isWebGL3DRenderTarget?e.TEXTURE_3D:p.isWebGLArrayRenderTarget||p.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function T(p,o,P,H,K=!1){if(p!==null){if(e[p]!==void 0)return e[p];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+p+"'")}let O=o;if(o===e.RED&&(P===e.FLOAT&&(O=e.R32F),P===e.HALF_FLOAT&&(O=e.R16F),P===e.UNSIGNED_BYTE&&(O=e.R8)),o===e.RED_INTEGER&&(P===e.UNSIGNED_BYTE&&(O=e.R8UI),P===e.UNSIGNED_SHORT&&(O=e.R16UI),P===e.UNSIGNED_INT&&(O=e.R32UI),P===e.BYTE&&(O=e.R8I),P===e.SHORT&&(O=e.R16I),P===e.INT&&(O=e.R32I)),o===e.RG&&(P===e.FLOAT&&(O=e.RG32F),P===e.HALF_FLOAT&&(O=e.RG16F),P===e.UNSIGNED_BYTE&&(O=e.RG8)),o===e.RG_INTEGER&&(P===e.UNSIGNED_BYTE&&(O=e.RG8UI),P===e.UNSIGNED_SHORT&&(O=e.RG16UI),P===e.UNSIGNED_INT&&(O=e.RG32UI),P===e.BYTE&&(O=e.RG8I),P===e.SHORT&&(O=e.RG16I),P===e.INT&&(O=e.RG32I)),o===e.RGB_INTEGER&&(P===e.UNSIGNED_BYTE&&(O=e.RGB8UI),P===e.UNSIGNED_SHORT&&(O=e.RGB16UI),P===e.UNSIGNED_INT&&(O=e.RGB32UI),P===e.BYTE&&(O=e.RGB8I),P===e.SHORT&&(O=e.RGB16I),P===e.INT&&(O=e.RGB32I)),o===e.RGBA_INTEGER&&(P===e.UNSIGNED_BYTE&&(O=e.RGBA8UI),P===e.UNSIGNED_SHORT&&(O=e.RGBA16UI),P===e.UNSIGNED_INT&&(O=e.RGBA32UI),P===e.BYTE&&(O=e.RGBA8I),P===e.SHORT&&(O=e.RGBA16I),P===e.INT&&(O=e.RGBA32I)),o===e.RGB&&(P===e.UNSIGNED_INT_5_9_9_9_REV&&(O=e.RGB9_E5),P===e.UNSIGNED_INT_10F_11F_11F_REV&&(O=e.R11F_G11F_B10F)),o===e.RGBA){const ve=K?tr:at.getTransfer(H);P===e.FLOAT&&(O=e.RGBA32F),P===e.HALF_FLOAT&&(O=e.RGBA16F),P===e.UNSIGNED_BYTE&&(O=ve===qe?e.SRGB8_ALPHA8:e.RGBA8),P===e.UNSIGNED_SHORT_4_4_4_4&&(O=e.RGBA4),P===e.UNSIGNED_SHORT_5_5_5_1&&(O=e.RGB5_A1)}return(O===e.R16F||O===e.R32F||O===e.RG16F||O===e.RG32F||O===e.RGBA16F||O===e.RGBA32F)&&n.get("EXT_color_buffer_float"),O}function _(p,o){let P;return p?o===null||o===dn||o===fn?P=e.DEPTH24_STENCIL8:o===Vt?P=e.DEPTH32F_STENCIL8:o===wn&&(P=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):o===null||o===dn||o===fn?P=e.DEPTH_COMPONENT24:o===Vt?P=e.DEPTH_COMPONENT32F:o===wn&&(P=e.DEPTH_COMPONENT16),P}function N(p,o){return f(p)===!0||p.isFramebufferTexture&&p.minFilter!==ln&&p.minFilter!==qt?Math.log2(Math.max(o.width,o.height))+1:p.mipmaps!==void 0&&p.mipmaps.length>0?p.mipmaps.length:p.isCompressedTexture&&Array.isArray(p.image)?o.mipmaps.length:1}function C(p){const o=p.target;o.removeEventListener("dispose",C),k(o),o.isVideoTexture&&w.delete(o)}function I(p){const o=p.target;o.removeEventListener("dispose",I),d(o)}function k(p){const o=i.get(p);if(o.__webglInit===void 0)return;const P=p.source,H=S.get(P);if(H){const K=H[o.__cacheKey];K.usedTimes--,K.usedTimes===0&&h(p),Object.keys(H).length===0&&S.delete(P)}i.remove(p)}function h(p){const o=i.get(p);e.deleteTexture(o.__webglTexture);const P=p.source,H=S.get(P);delete H[o.__cacheKey],u.memory.textures--}function d(p){const o=i.get(p);if(p.depthTexture&&(p.depthTexture.dispose(),i.remove(p.depthTexture)),p.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(o.__webglFramebuffer[H]))for(let K=0;K<o.__webglFramebuffer[H].length;K++)e.deleteFramebuffer(o.__webglFramebuffer[H][K]);else e.deleteFramebuffer(o.__webglFramebuffer[H]);o.__webglDepthbuffer&&e.deleteRenderbuffer(o.__webglDepthbuffer[H])}else{if(Array.isArray(o.__webglFramebuffer))for(let H=0;H<o.__webglFramebuffer.length;H++)e.deleteFramebuffer(o.__webglFramebuffer[H]);else e.deleteFramebuffer(o.__webglFramebuffer);if(o.__webglDepthbuffer&&e.deleteRenderbuffer(o.__webglDepthbuffer),o.__webglMultisampledFramebuffer&&e.deleteFramebuffer(o.__webglMultisampledFramebuffer),o.__webglColorRenderbuffer)for(let H=0;H<o.__webglColorRenderbuffer.length;H++)o.__webglColorRenderbuffer[H]&&e.deleteRenderbuffer(o.__webglColorRenderbuffer[H]);o.__webglDepthRenderbuffer&&e.deleteRenderbuffer(o.__webglDepthRenderbuffer)}const P=p.textures;for(let H=0,K=P.length;H<K;H++){const O=i.get(P[H]);O.__webglTexture&&(e.deleteTexture(O.__webglTexture),u.memory.textures--),i.remove(P[H])}i.remove(p)}let b=0;function B(){b=0}function X(){const p=b;return p>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+p+" texture units while this GPU supports only "+s.maxTextures),b+=1,p}function Y(p){const o=[];return o.push(p.wrapS),o.push(p.wrapT),o.push(p.wrapR||0),o.push(p.magFilter),o.push(p.minFilter),o.push(p.anisotropy),o.push(p.internalFormat),o.push(p.format),o.push(p.type),o.push(p.generateMipmaps),o.push(p.premultiplyAlpha),o.push(p.flipY),o.push(p.unpackAlignment),o.push(p.colorSpace),o.join()}function Z(p,o){const P=i.get(p);if(p.isVideoTexture&&ye(p),p.isRenderTargetTexture===!1&&p.isExternalTexture!==!0&&p.version>0&&P.__version!==p.version){const H=p.image;if(H===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V(P,p,o);return}}else p.isExternalTexture&&(P.__webglTexture=p.sourceTexture?p.sourceTexture:null);t.bindTexture(e.TEXTURE_2D,P.__webglTexture,e.TEXTURE0+o)}function W(p,o){const P=i.get(p);if(p.isRenderTargetTexture===!1&&p.version>0&&P.__version!==p.version){V(P,p,o);return}t.bindTexture(e.TEXTURE_2D_ARRAY,P.__webglTexture,e.TEXTURE0+o)}function ie(p,o){const P=i.get(p);if(p.isRenderTargetTexture===!1&&p.version>0&&P.__version!==p.version){V(P,p,o);return}t.bindTexture(e.TEXTURE_3D,P.__webglTexture,e.TEXTURE0+o)}function G(p,o){const P=i.get(p);if(p.version>0&&P.__version!==p.version){q(P,p,o);return}t.bindTexture(e.TEXTURE_CUBE_MAP,P.__webglTexture,e.TEXTURE0+o)}const ge={[zr]:e.REPEAT,[Vr]:e.CLAMP_TO_EDGE,[Gr]:e.MIRRORED_REPEAT},Te={[ln]:e.NEAREST,[kr]:e.NEAREST_MIPMAP_NEAREST,[mn]:e.NEAREST_MIPMAP_LINEAR,[qt]:e.LINEAR,[Fn]:e.LINEAR_MIPMAP_NEAREST,[on]:e.LINEAR_MIPMAP_LINEAR},Ue={[$r]:e.NEVER,[Zr]:e.ALWAYS,[qr]:e.LESS,[Ha]:e.LEQUAL,[Kr]:e.EQUAL,[Yr]:e.GEQUAL,[Xr]:e.GREATER,[Wr]:e.NOTEQUAL};function He(p,o){if(o.type===Vt&&n.has("OES_texture_float_linear")===!1&&(o.magFilter===qt||o.magFilter===Fn||o.magFilter===mn||o.magFilter===on||o.minFilter===qt||o.minFilter===Fn||o.minFilter===mn||o.minFilter===on)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(p,e.TEXTURE_WRAP_S,ge[o.wrapS]),e.texParameteri(p,e.TEXTURE_WRAP_T,ge[o.wrapT]),(p===e.TEXTURE_3D||p===e.TEXTURE_2D_ARRAY)&&e.texParameteri(p,e.TEXTURE_WRAP_R,ge[o.wrapR]),e.texParameteri(p,e.TEXTURE_MAG_FILTER,Te[o.magFilter]),e.texParameteri(p,e.TEXTURE_MIN_FILTER,Te[o.minFilter]),o.compareFunction&&(e.texParameteri(p,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(p,e.TEXTURE_COMPARE_FUNC,Ue[o.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(o.magFilter===ln||o.minFilter!==mn&&o.minFilter!==on||o.type===Vt&&n.has("OES_texture_float_linear")===!1)return;if(o.anisotropy>1||i.get(o).__currentAnisotropy){const P=n.get("EXT_texture_filter_anisotropic");e.texParameterf(p,P.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(o.anisotropy,s.getMaxAnisotropy())),i.get(o).__currentAnisotropy=o.anisotropy}}}function nt(p,o){let P=!1;p.__webglInit===void 0&&(p.__webglInit=!0,o.addEventListener("dispose",C));const H=o.source;let K=S.get(H);K===void 0&&(K={},S.set(H,K));const O=Y(o);if(O!==p.__cacheKey){K[O]===void 0&&(K[O]={texture:e.createTexture(),usedTimes:0},u.memory.textures++,P=!0),K[O].usedTimes++;const ve=K[p.__cacheKey];ve!==void 0&&(K[p.__cacheKey].usedTimes--,ve.usedTimes===0&&h(o)),p.__cacheKey=O,p.__webglTexture=K[O].texture}return P}function et(p,o,P){return Math.floor(Math.floor(p/P)/o)}function ke(p,o,P,H){const O=p.updateRanges;if(O.length===0)t.texSubImage2D(e.TEXTURE_2D,0,0,0,o.width,o.height,P,H,o.data);else{O.sort((Q,oe)=>Q.start-oe.start);let ve=0;for(let Q=1;Q<O.length;Q++){const oe=O[ve],Ae=O[Q],_e=oe.start+oe.count,ae=et(Ae.start,o.width,4),Le=et(oe.start,o.width,4);Ae.start<=_e+1&&ae===Le&&et(Ae.start+Ae.count-1,o.width,4)===ae?oe.count=Math.max(oe.count,Ae.start+Ae.count-oe.start):(++ve,O[ve]=Ae)}O.length=ve+1;const ee=e.getParameter(e.UNPACK_ROW_LENGTH),he=e.getParameter(e.UNPACK_SKIP_PIXELS),me=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,o.width);for(let Q=0,oe=O.length;Q<oe;Q++){const Ae=O[Q],_e=Math.floor(Ae.start/4),ae=Math.ceil(Ae.count/4),Le=_e%o.width,g=Math.floor(_e/o.width),J=ae,te=1;e.pixelStorei(e.UNPACK_SKIP_PIXELS,Le),e.pixelStorei(e.UNPACK_SKIP_ROWS,g),t.texSubImage2D(e.TEXTURE_2D,0,Le,g,J,te,P,H,o.data)}p.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,ee),e.pixelStorei(e.UNPACK_SKIP_PIXELS,he),e.pixelStorei(e.UNPACK_SKIP_ROWS,me)}}function V(p,o,P){let H=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(H=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(H=e.TEXTURE_3D);const K=nt(p,o),O=o.source;t.bindTexture(H,p.__webglTexture,e.TEXTURE0+P);const ve=i.get(O);if(O.version!==ve.__version||K===!0){t.activeTexture(e.TEXTURE0+P);const ee=at.getPrimaries(at.workingColorSpace),he=o.colorSpace===Kt?null:at.getPrimaries(o.colorSpace),me=o.colorSpace===Kt||ee===he?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);let Q=L(o.image,!1,s.maxTextureSize);Q=ct(o,Q);const oe=r.convert(o.format,o.colorSpace),Ae=r.convert(o.type);let _e=T(o.internalFormat,oe,Ae,o.colorSpace,o.isVideoTexture);He(H,o);let ae;const Le=o.mipmaps,g=o.isVideoTexture!==!0,J=ve.__version===void 0||K===!0,te=O.dataReady,le=N(o,Q);if(o.isDepthTexture)_e=_(o.format===Cn,o.type),J&&(g?t.texStorage2D(e.TEXTURE_2D,1,_e,Q.width,Q.height):t.texImage2D(e.TEXTURE_2D,0,_e,Q.width,Q.height,0,oe,Ae,null));else if(o.isDataTexture)if(Le.length>0){g&&J&&t.texStorage2D(e.TEXTURE_2D,le,_e,Le[0].width,Le[0].height);for(let $=0,z=Le.length;$<z;$++)ae=Le[$],g?te&&t.texSubImage2D(e.TEXTURE_2D,$,0,0,ae.width,ae.height,oe,Ae,ae.data):t.texImage2D(e.TEXTURE_2D,$,_e,ae.width,ae.height,0,oe,Ae,ae.data);o.generateMipmaps=!1}else g?(J&&t.texStorage2D(e.TEXTURE_2D,le,_e,Q.width,Q.height),te&&ke(o,Q,oe,Ae)):t.texImage2D(e.TEXTURE_2D,0,_e,Q.width,Q.height,0,oe,Ae,Q.data);else if(o.isCompressedTexture)if(o.isCompressedArrayTexture){g&&J&&t.texStorage3D(e.TEXTURE_2D_ARRAY,le,_e,Le[0].width,Le[0].height,Q.depth);for(let $=0,z=Le.length;$<z;$++)if(ae=Le[$],o.format!==Lt)if(oe!==null)if(g){if(te)if(o.layerUpdates.size>0){const de=ta(ae.width,ae.height,o.format,o.type);for(const we of o.layerUpdates){const Xe=ae.data.subarray(we*de/ae.data.BYTES_PER_ELEMENT,(we+1)*de/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,$,0,0,we,ae.width,ae.height,1,oe,Xe)}o.clearLayerUpdates()}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,$,0,0,0,ae.width,ae.height,Q.depth,oe,ae.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,$,_e,ae.width,ae.height,Q.depth,0,ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else g?te&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,$,0,0,0,ae.width,ae.height,Q.depth,oe,Ae,ae.data):t.texImage3D(e.TEXTURE_2D_ARRAY,$,_e,ae.width,ae.height,Q.depth,0,oe,Ae,ae.data)}else{g&&J&&t.texStorage2D(e.TEXTURE_2D,le,_e,Le[0].width,Le[0].height);for(let $=0,z=Le.length;$<z;$++)ae=Le[$],o.format!==Lt?oe!==null?g?te&&t.compressedTexSubImage2D(e.TEXTURE_2D,$,0,0,ae.width,ae.height,oe,ae.data):t.compressedTexImage2D(e.TEXTURE_2D,$,_e,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):g?te&&t.texSubImage2D(e.TEXTURE_2D,$,0,0,ae.width,ae.height,oe,Ae,ae.data):t.texImage2D(e.TEXTURE_2D,$,_e,ae.width,ae.height,0,oe,Ae,ae.data)}else if(o.isDataArrayTexture)if(g){if(J&&t.texStorage3D(e.TEXTURE_2D_ARRAY,le,_e,Q.width,Q.height,Q.depth),te)if(o.layerUpdates.size>0){const $=ta(Q.width,Q.height,o.format,o.type);for(const z of o.layerUpdates){const de=Q.data.subarray(z*$/Q.data.BYTES_PER_ELEMENT,(z+1)*$/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,z,Q.width,Q.height,1,oe,Ae,de)}o.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,oe,Ae,Q.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,_e,Q.width,Q.height,Q.depth,0,oe,Ae,Q.data);else if(o.isData3DTexture)g?(J&&t.texStorage3D(e.TEXTURE_3D,le,_e,Q.width,Q.height,Q.depth),te&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,oe,Ae,Q.data)):t.texImage3D(e.TEXTURE_3D,0,_e,Q.width,Q.height,Q.depth,0,oe,Ae,Q.data);else if(o.isFramebufferTexture){if(J)if(g)t.texStorage2D(e.TEXTURE_2D,le,_e,Q.width,Q.height);else{let $=Q.width,z=Q.height;for(let de=0;de<le;de++)t.texImage2D(e.TEXTURE_2D,de,_e,$,z,0,oe,Ae,null),$>>=1,z>>=1}}else if(Le.length>0){if(g&&J){const $=it(Le[0]);t.texStorage2D(e.TEXTURE_2D,le,_e,$.width,$.height)}for(let $=0,z=Le.length;$<z;$++)ae=Le[$],g?te&&t.texSubImage2D(e.TEXTURE_2D,$,0,0,oe,Ae,ae):t.texImage2D(e.TEXTURE_2D,$,_e,oe,Ae,ae);o.generateMipmaps=!1}else if(g){if(J){const $=it(Q);t.texStorage2D(e.TEXTURE_2D,le,_e,$.width,$.height)}te&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,oe,Ae,Q)}else t.texImage2D(e.TEXTURE_2D,0,_e,oe,Ae,Q);f(o)&&a(H),ve.__version=O.version,o.onUpdate&&o.onUpdate(o)}p.__version=o.version}function q(p,o,P){if(o.image.length!==6)return;const H=nt(p,o),K=o.source;t.bindTexture(e.TEXTURE_CUBE_MAP,p.__webglTexture,e.TEXTURE0+P);const O=i.get(K);if(K.version!==O.__version||H===!0){t.activeTexture(e.TEXTURE0+P);const ve=at.getPrimaries(at.workingColorSpace),ee=o.colorSpace===Kt?null:at.getPrimaries(o.colorSpace),he=o.colorSpace===Kt||ve===ee?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const me=o.isCompressedTexture||o.image[0].isCompressedTexture,Q=o.image[0]&&o.image[0].isDataTexture,oe=[];for(let z=0;z<6;z++)!me&&!Q?oe[z]=L(o.image[z],!0,s.maxCubemapSize):oe[z]=Q?o.image[z].image:o.image[z],oe[z]=ct(o,oe[z]);const Ae=oe[0],_e=r.convert(o.format,o.colorSpace),ae=r.convert(o.type),Le=T(o.internalFormat,_e,ae,o.colorSpace),g=o.isVideoTexture!==!0,J=O.__version===void 0||H===!0,te=K.dataReady;let le=N(o,Ae);He(e.TEXTURE_CUBE_MAP,o);let $;if(me){g&&J&&t.texStorage2D(e.TEXTURE_CUBE_MAP,le,Le,Ae.width,Ae.height);for(let z=0;z<6;z++){$=oe[z].mipmaps;for(let de=0;de<$.length;de++){const we=$[de];o.format!==Lt?_e!==null?g?te&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,de,0,0,we.width,we.height,_e,we.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,de,Le,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):g?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,de,0,0,we.width,we.height,_e,ae,we.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,de,Le,we.width,we.height,0,_e,ae,we.data)}}}else{if($=o.mipmaps,g&&J){$.length>0&&le++;const z=it(oe[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,le,Le,z.width,z.height)}for(let z=0;z<6;z++)if(Q){g?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,0,0,oe[z].width,oe[z].height,_e,ae,oe[z].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,Le,oe[z].width,oe[z].height,0,_e,ae,oe[z].data);for(let de=0;de<$.length;de++){const Xe=$[de].image[z].image;g?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,de+1,0,0,Xe.width,Xe.height,_e,ae,Xe.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,de+1,Le,Xe.width,Xe.height,0,_e,ae,Xe.data)}}else{g?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,0,0,_e,ae,oe[z]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,Le,_e,ae,oe[z]);for(let de=0;de<$.length;de++){const we=$[de];g?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,de+1,0,0,_e,ae,we.image[z]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,de+1,Le,_e,ae,we.image[z])}}}f(o)&&a(e.TEXTURE_CUBE_MAP),O.__version=K.version,o.onUpdate&&o.onUpdate(o)}p.__version=o.version}function ce(p,o,P,H,K,O){const ve=r.convert(P.format,P.colorSpace),ee=r.convert(P.type),he=T(P.internalFormat,ve,ee,P.colorSpace),me=i.get(o),Q=i.get(P);if(Q.__renderTarget=o,!me.__hasExternalTextures){const oe=Math.max(1,o.width>>O),Ae=Math.max(1,o.height>>O);K===e.TEXTURE_3D||K===e.TEXTURE_2D_ARRAY?t.texImage3D(K,O,he,oe,Ae,o.depth,0,ve,ee,null):t.texImage2D(K,O,he,oe,Ae,0,ve,ee,null)}t.bindFramebuffer(e.FRAMEBUFFER,p),pe(o)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,H,K,Q.__webglTexture,0,$e(o)):(K===e.TEXTURE_2D||K>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,H,K,Q.__webglTexture,O),t.bindFramebuffer(e.FRAMEBUFFER,null)}function Pe(p,o,P){if(e.bindRenderbuffer(e.RENDERBUFFER,p),o.depthBuffer){const H=o.depthTexture,K=H&&H.isDepthTexture?H.type:null,O=_(o.stencilBuffer,K),ve=o.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ee=$e(o);pe(o)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,ee,O,o.width,o.height):P?e.renderbufferStorageMultisample(e.RENDERBUFFER,ee,O,o.width,o.height):e.renderbufferStorage(e.RENDERBUFFER,O,o.width,o.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,ve,e.RENDERBUFFER,p)}else{const H=o.textures;for(let K=0;K<H.length;K++){const O=H[K],ve=r.convert(O.format,O.colorSpace),ee=r.convert(O.type),he=T(O.internalFormat,ve,ee,O.colorSpace),me=$e(o);P&&pe(o)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,me,he,o.width,o.height):pe(o)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,me,he,o.width,o.height):e.renderbufferStorage(e.RENDERBUFFER,he,o.width,o.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Ee(p,o){if(o&&o.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(e.FRAMEBUFFER,p),!(o.depthTexture&&o.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const H=i.get(o.depthTexture);H.__renderTarget=o,(!H.__webglTexture||o.depthTexture.image.width!==o.width||o.depthTexture.image.height!==o.height)&&(o.depthTexture.image.width=o.width,o.depthTexture.image.height=o.height,o.depthTexture.needsUpdate=!0),Z(o.depthTexture,0);const K=H.__webglTexture,O=$e(o);if(o.depthTexture.format===fi)pe(o)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,K,0,O):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,K,0);else if(o.depthTexture.format===Cn)pe(o)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,K,0,O):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function Oe(p){const o=i.get(p),P=p.isWebGLCubeRenderTarget===!0;if(o.__boundDepthTexture!==p.depthTexture){const H=p.depthTexture;if(o.__depthDisposeCallback&&o.__depthDisposeCallback(),H){const K=()=>{delete o.__boundDepthTexture,delete o.__depthDisposeCallback,H.removeEventListener("dispose",K)};H.addEventListener("dispose",K),o.__depthDisposeCallback=K}o.__boundDepthTexture=H}if(p.depthTexture&&!o.__autoAllocateDepthBuffer){if(P)throw new Error("target.depthTexture not supported in Cube render targets");const H=p.texture.mipmaps;H&&H.length>0?Ee(o.__webglFramebuffer[0],p):Ee(o.__webglFramebuffer,p)}else if(P){o.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer[H]),o.__webglDepthbuffer[H]===void 0)o.__webglDepthbuffer[H]=e.createRenderbuffer(),Pe(o.__webglDepthbuffer[H],p,!1);else{const K=p.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,O=o.__webglDepthbuffer[H];e.bindRenderbuffer(e.RENDERBUFFER,O),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,O)}}else{const H=p.texture.mipmaps;if(H&&H.length>0?t.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer[0]):t.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer),o.__webglDepthbuffer===void 0)o.__webglDepthbuffer=e.createRenderbuffer(),Pe(o.__webglDepthbuffer,p,!1);else{const K=p.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,O=o.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,O),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,O)}}t.bindFramebuffer(e.FRAMEBUFFER,null)}function pt(p,o,P){const H=i.get(p);o!==void 0&&ce(H.__webglFramebuffer,p,p.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),P!==void 0&&Oe(p)}function m(p){const o=p.texture,P=i.get(p),H=i.get(o);p.addEventListener("dispose",I);const K=p.textures,O=p.isWebGLCubeRenderTarget===!0,ve=K.length>1;if(ve||(H.__webglTexture===void 0&&(H.__webglTexture=e.createTexture()),H.__version=o.version,u.memory.textures++),O){P.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(o.mipmaps&&o.mipmaps.length>0){P.__webglFramebuffer[ee]=[];for(let he=0;he<o.mipmaps.length;he++)P.__webglFramebuffer[ee][he]=e.createFramebuffer()}else P.__webglFramebuffer[ee]=e.createFramebuffer()}else{if(o.mipmaps&&o.mipmaps.length>0){P.__webglFramebuffer=[];for(let ee=0;ee<o.mipmaps.length;ee++)P.__webglFramebuffer[ee]=e.createFramebuffer()}else P.__webglFramebuffer=e.createFramebuffer();if(ve)for(let ee=0,he=K.length;ee<he;ee++){const me=i.get(K[ee]);me.__webglTexture===void 0&&(me.__webglTexture=e.createTexture(),u.memory.textures++)}if(p.samples>0&&pe(p)===!1){P.__webglMultisampledFramebuffer=e.createFramebuffer(),P.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,P.__webglMultisampledFramebuffer);for(let ee=0;ee<K.length;ee++){const he=K[ee];P.__webglColorRenderbuffer[ee]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,P.__webglColorRenderbuffer[ee]);const me=r.convert(he.format,he.colorSpace),Q=r.convert(he.type),oe=T(he.internalFormat,me,Q,he.colorSpace,p.isXRRenderTarget===!0),Ae=$e(p);e.renderbufferStorageMultisample(e.RENDERBUFFER,Ae,oe,p.width,p.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ee,e.RENDERBUFFER,P.__webglColorRenderbuffer[ee])}e.bindRenderbuffer(e.RENDERBUFFER,null),p.depthBuffer&&(P.__webglDepthRenderbuffer=e.createRenderbuffer(),Pe(P.__webglDepthRenderbuffer,p,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(O){t.bindTexture(e.TEXTURE_CUBE_MAP,H.__webglTexture),He(e.TEXTURE_CUBE_MAP,o);for(let ee=0;ee<6;ee++)if(o.mipmaps&&o.mipmaps.length>0)for(let he=0;he<o.mipmaps.length;he++)ce(P.__webglFramebuffer[ee][he],p,o,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,he);else ce(P.__webglFramebuffer[ee],p,o,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);f(o)&&a(e.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let ee=0,he=K.length;ee<he;ee++){const me=K[ee],Q=i.get(me);let oe=e.TEXTURE_2D;(p.isWebGL3DRenderTarget||p.isWebGLArrayRenderTarget)&&(oe=p.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(oe,Q.__webglTexture),He(oe,me),ce(P.__webglFramebuffer,p,me,e.COLOR_ATTACHMENT0+ee,oe,0),f(me)&&a(oe)}t.unbindTexture()}else{let ee=e.TEXTURE_2D;if((p.isWebGL3DRenderTarget||p.isWebGLArrayRenderTarget)&&(ee=p.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(ee,H.__webglTexture),He(ee,o),o.mipmaps&&o.mipmaps.length>0)for(let he=0;he<o.mipmaps.length;he++)ce(P.__webglFramebuffer[he],p,o,e.COLOR_ATTACHMENT0,ee,he);else ce(P.__webglFramebuffer,p,o,e.COLOR_ATTACHMENT0,ee,0);f(o)&&a(ee),t.unbindTexture()}p.depthBuffer&&Oe(p)}function Ze(p){const o=p.textures;for(let P=0,H=o.length;P<H;P++){const K=o[P];if(f(K)){const O=D(p),ve=i.get(K).__webglTexture;t.bindTexture(O,ve),a(O),t.unbindTexture()}}}const De=[],Re=[];function ue(p){if(p.samples>0){if(pe(p)===!1){const o=p.textures,P=p.width,H=p.height;let K=e.COLOR_BUFFER_BIT;const O=p.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ve=i.get(p),ee=o.length>1;if(ee)for(let me=0;me<o.length;me++)t.bindFramebuffer(e.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,ve.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer);const he=p.texture.mipmaps;he&&he.length>0?t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ve.__webglFramebuffer[0]):t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let me=0;me<o.length;me++){if(p.resolveDepthBuffer&&(p.depthBuffer&&(K|=e.DEPTH_BUFFER_BIT),p.stencilBuffer&&p.resolveStencilBuffer&&(K|=e.STENCIL_BUFFER_BIT)),ee){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,ve.__webglColorRenderbuffer[me]);const Q=i.get(o[me]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Q,0)}e.blitFramebuffer(0,0,P,H,0,0,P,H,K,e.NEAREST),x===!0&&(De.length=0,Re.length=0,De.push(e.COLOR_ATTACHMENT0+me),p.depthBuffer&&p.resolveDepthBuffer===!1&&(De.push(O),Re.push(O),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Re)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,De))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ee)for(let me=0;me<o.length;me++){t.bindFramebuffer(e.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.RENDERBUFFER,ve.__webglColorRenderbuffer[me]);const Q=i.get(o[me]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,ve.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.TEXTURE_2D,Q,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(p.depthBuffer&&p.resolveDepthBuffer===!1&&x){const o=p.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[o])}}}function $e(p){return Math.min(s.maxSamples,p.samples)}function pe(p){const o=i.get(p);return p.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&o.__useRenderToTexture!==!1}function ye(p){const o=u.render.frame;w.get(p)!==o&&(w.set(p,o),p.update())}function ct(p,o){const P=p.colorSpace,H=p.format,K=p.type;return p.isCompressedTexture===!0||p.isVideoTexture===!0||P!==Ln&&P!==Kt&&(at.getTransfer(P)===qe?(H!==Lt||K!==Wt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",P)),o}function it(p){return typeof HTMLImageElement<"u"&&p instanceof HTMLImageElement?(E.width=p.naturalWidth||p.width,E.height=p.naturalHeight||p.height):typeof VideoFrame<"u"&&p instanceof VideoFrame?(E.width=p.displayWidth,E.height=p.displayHeight):(E.width=p.width,E.height=p.height),E}this.allocateTextureUnit=X,this.resetTextureUnits=B,this.setTexture2D=Z,this.setTexture2DArray=W,this.setTexture3D=ie,this.setTextureCube=G,this.rebindTextures=pt,this.setupRenderTarget=m,this.updateRenderTargetMipmap=Ze,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=pe}function gd(e,n){function t(i,s=Kt){let r;const u=at.getTransfer(s);if(i===Wt)return e.UNSIGNED_BYTE;if(i===ka)return e.UNSIGNED_SHORT_4_4_4_4;if(i===Wa)return e.UNSIGNED_SHORT_5_5_5_1;if(i===eo)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===to)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===no)return e.BYTE;if(i===io)return e.SHORT;if(i===wn)return e.UNSIGNED_SHORT;if(i===Ka)return e.INT;if(i===dn)return e.UNSIGNED_INT;if(i===Vt)return e.FLOAT;if(i===Dn)return e.HALF_FLOAT;if(i===ao)return e.ALPHA;if(i===ro)return e.RGB;if(i===Lt)return e.RGBA;if(i===fi)return e.DEPTH_COMPONENT;if(i===Cn)return e.DEPTH_STENCIL;if(i===oo)return e.RED;if(i===qa)return e.RED_INTEGER;if(i===so)return e.RG;if(i===Za)return e.RG_INTEGER;if(i===$a)return e.RGBA_INTEGER;if(i===Bn||i===Hn||i===Gn||i===Vn)if(u===qe)if(r=n.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Bn)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Hn)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Gn)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Vn)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=n.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Bn)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Hn)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Gn)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Vn)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ti||i===xi||i===Ai||i===Ri)if(r=n.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Ti)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===xi)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ai)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ri)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===bi||i===Ci||i===Pi)if(r=n.get("WEBGL_compressed_texture_etc"),r!==null){if(i===bi||i===Ci)return u===qe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Pi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===wi||i===Di||i===Li||i===Ui||i===yi||i===Ii||i===Ni||i===Oi||i===Fi||i===Bi||i===Hi||i===Gi||i===Vi||i===zi)if(r=n.get("WEBGL_compressed_texture_astc"),r!==null){if(i===wi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Di)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Li)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ui)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===yi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ii)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ni)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Oi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Fi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Bi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Hi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Gi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Vi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===zi)return u===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ki||i===Wi||i===Xi)if(r=n.get("EXT_texture_compression_bptc"),r!==null){if(i===ki)return u===qe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Wi)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Xi)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Yi||i===Ki||i===qi||i===Zi)if(r=n.get("EXT_texture_compression_rgtc"),r!==null){if(i===Yi)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ki)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===qi)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Zi)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===fn?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}const vd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ed=`
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

}`;class Sd{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t){if(this.texture===null){const i=new Xa(n.texture);(n.depthNear!==t.depthNear||n.depthFar!==t.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=i}}getMesh(n){if(this.texture!==null&&this.mesh===null){const t=n.cameras[0].viewport,i=new It({vertexShader:vd,fragmentShader:Ed,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ut(new Ya(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Md extends Sr{constructor(n,t){super();const i=this;let s=null,r=1,u=null,c="local-floor",x=1,E=null,w=null,v=null,S=null,R=null,F=null;const L=typeof XRWebGLBinding<"u",f=new Sd,a={},D=t.getContextAttributes();let T=null,_=null;const N=[],C=[],I=new Ye;let k=null;const h=new xn;h.viewport=new ot;const d=new xn;d.viewport=new ot;const b=[h,d],B=new Mr;let X=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let q=N[V];return q===void 0&&(q=new On,N[V]=q),q.getTargetRaySpace()},this.getControllerGrip=function(V){let q=N[V];return q===void 0&&(q=new On,N[V]=q),q.getGripSpace()},this.getHand=function(V){let q=N[V];return q===void 0&&(q=new On,N[V]=q),q.getHandSpace()};function Z(V){const q=C.indexOf(V.inputSource);if(q===-1)return;const ce=N[q];ce!==void 0&&(ce.update(V.inputSource,V.frame,E||u),ce.dispatchEvent({type:V.type,data:V.inputSource}))}function W(){s.removeEventListener("select",Z),s.removeEventListener("selectstart",Z),s.removeEventListener("selectend",Z),s.removeEventListener("squeeze",Z),s.removeEventListener("squeezestart",Z),s.removeEventListener("squeezeend",Z),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",ie);for(let V=0;V<N.length;V++){const q=C[V];q!==null&&(C[V]=null,N[V].disconnect(q))}X=null,Y=null,f.reset();for(const V in a)delete a[V];n.setRenderTarget(T),R=null,S=null,v=null,s=null,_=null,ke.stop(),i.isPresenting=!1,n.setPixelRatio(k),n.setSize(I.width,I.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){c=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return E||u},this.setReferenceSpace=function(V){E=V},this.getBaseLayer=function(){return S!==null?S:R},this.getBinding=function(){return v===null&&L&&(v=new XRWebGLBinding(s,t)),v},this.getFrame=function(){return F},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(T=n.getRenderTarget(),s.addEventListener("select",Z),s.addEventListener("selectstart",Z),s.addEventListener("selectend",Z),s.addEventListener("squeeze",Z),s.addEventListener("squeezestart",Z),s.addEventListener("squeezeend",Z),s.addEventListener("end",W),s.addEventListener("inputsourceschange",ie),D.xrCompatible!==!0&&await t.makeXRCompatible(),k=n.getPixelRatio(),n.getSize(I),L&&"createProjectionLayer"in XRWebGLBinding.prototype){let ce=null,Pe=null,Ee=null;D.depth&&(Ee=D.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ce=D.stencil?Cn:fi,Pe=D.stencil?fn:dn);const Oe={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:r};v=this.getBinding(),S=v.createProjectionLayer(Oe),s.updateRenderState({layers:[S]}),n.setPixelRatio(1),n.setSize(S.textureWidth,S.textureHeight,!1),_=new en(S.textureWidth,S.textureHeight,{format:Lt,type:Wt,depthTexture:new Ba(S.textureWidth,S.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,ce),stencilBuffer:D.stencil,colorSpace:n.outputColorSpace,samples:D.antialias?4:0,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}else{const ce={antialias:D.antialias,alpha:!0,depth:D.depth,stencil:D.stencil,framebufferScaleFactor:r};R=new XRWebGLLayer(s,t,ce),s.updateRenderState({baseLayer:R}),n.setPixelRatio(1),n.setSize(R.framebufferWidth,R.framebufferHeight,!1),_=new en(R.framebufferWidth,R.framebufferHeight,{format:Lt,type:Wt,colorSpace:n.outputColorSpace,stencilBuffer:D.stencil,resolveDepthBuffer:R.ignoreDepthValues===!1,resolveStencilBuffer:R.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(x),E=null,u=await s.requestReferenceSpace(c),ke.setContext(s),ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function ie(V){for(let q=0;q<V.removed.length;q++){const ce=V.removed[q],Pe=C.indexOf(ce);Pe>=0&&(C[Pe]=null,N[Pe].disconnect(ce))}for(let q=0;q<V.added.length;q++){const ce=V.added[q];let Pe=C.indexOf(ce);if(Pe===-1){for(let Oe=0;Oe<N.length;Oe++)if(Oe>=C.length){C.push(ce),Pe=Oe;break}else if(C[Oe]===null){C[Oe]=ce,Pe=Oe;break}if(Pe===-1)break}const Ee=N[Pe];Ee&&Ee.connect(ce)}}const G=new Ce,ge=new Ce;function Te(V,q,ce){G.setFromMatrixPosition(q.matrixWorld),ge.setFromMatrixPosition(ce.matrixWorld);const Pe=G.distanceTo(ge),Ee=q.projectionMatrix.elements,Oe=ce.projectionMatrix.elements,pt=Ee[14]/(Ee[10]-1),m=Ee[14]/(Ee[10]+1),Ze=(Ee[9]+1)/Ee[5],De=(Ee[9]-1)/Ee[5],Re=(Ee[8]-1)/Ee[0],ue=(Oe[8]+1)/Oe[0],$e=pt*Re,pe=pt*ue,ye=Pe/(-Re+ue),ct=ye*-Re;if(q.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(ct),V.translateZ(ye),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Ee[10]===-1)V.projectionMatrix.copy(q.projectionMatrix),V.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{const it=pt+ye,p=m+ye,o=$e-ct,P=pe+(Pe-ct),H=Ze*m/p*it,K=De*m/p*it;V.projectionMatrix.makePerspective(o,P,H,K,it,p),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function Ue(V,q){q===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(q.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let q=V.near,ce=V.far;f.texture!==null&&(f.depthNear>0&&(q=f.depthNear),f.depthFar>0&&(ce=f.depthFar)),B.near=d.near=h.near=q,B.far=d.far=h.far=ce,(X!==B.near||Y!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),X=B.near,Y=B.far),B.layers.mask=V.layers.mask|6,h.layers.mask=B.layers.mask&3,d.layers.mask=B.layers.mask&5;const Pe=V.parent,Ee=B.cameras;Ue(B,Pe);for(let Oe=0;Oe<Ee.length;Oe++)Ue(Ee[Oe],Pe);Ee.length===2?Te(B,h,d):B.projectionMatrix.copy(h.projectionMatrix),He(V,B,Pe)};function He(V,q,ce){ce===null?V.matrix.copy(q.matrixWorld):(V.matrix.copy(ce.matrixWorld),V.matrix.invert(),V.matrix.multiply(q.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(q.projectionMatrix),V.projectionMatrixInverse.copy(q.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Tr*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(S===null&&R===null))return x},this.setFoveation=function(V){x=V,S!==null&&(S.fixedFoveation=V),R!==null&&R.fixedFoveation!==void 0&&(R.fixedFoveation=V)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(B)},this.getCameraTexture=function(V){return a[V]};let nt=null;function et(V,q){if(w=q.getViewerPose(E||u),F=q,w!==null){const ce=w.views;R!==null&&(n.setRenderTargetFramebuffer(_,R.framebuffer),n.setRenderTarget(_));let Pe=!1;ce.length!==B.cameras.length&&(B.cameras.length=0,Pe=!0);for(let m=0;m<ce.length;m++){const Ze=ce[m];let De=null;if(R!==null)De=R.getViewport(Ze);else{const ue=v.getViewSubImage(S,Ze);De=ue.viewport,m===0&&(n.setRenderTargetTextures(_,ue.colorTexture,ue.depthStencilTexture),n.setRenderTarget(_))}let Re=b[m];Re===void 0&&(Re=new xn,Re.layers.enable(m),Re.viewport=new ot,b[m]=Re),Re.matrix.fromArray(Ze.transform.matrix),Re.matrix.decompose(Re.position,Re.quaternion,Re.scale),Re.projectionMatrix.fromArray(Ze.projectionMatrix),Re.projectionMatrixInverse.copy(Re.projectionMatrix).invert(),Re.viewport.set(De.x,De.y,De.width,De.height),m===0&&(B.matrix.copy(Re.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Pe===!0&&B.cameras.push(Re)}const Ee=s.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&L){v=i.getBinding();const m=v.getDepthInformation(ce[0]);m&&m.isValid&&m.texture&&f.init(m,s.renderState)}if(Ee&&Ee.includes("camera-access")&&L){n.state.unbindTexture(),v=i.getBinding();for(let m=0;m<ce.length;m++){const Ze=ce[m].camera;if(Ze){let De=a[Ze];De||(De=new Xa,a[Ze]=De);const Re=v.getCameraImage(Ze);De.sourceTexture=Re}}}}for(let ce=0;ce<N.length;ce++){const Pe=C[ce],Ee=N[ce];Pe!==null&&Ee!==void 0&&Ee.update(Pe,q,E||u)}nt&&nt(V,q),q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:q}),F=null}const ke=new ar;ke.setAnimationLoop(et),this.setAnimationLoop=function(V){nt=V},this.dispose=function(){}}}const Bt=new er,Td=new Jt;function xd(e,n){function t(f,a){f.matrixAutoUpdate===!0&&f.updateMatrix(),a.value.copy(f.matrix)}function i(f,a){a.color.getRGB(f.fogColor.value,Qa(e)),a.isFog?(f.fogNear.value=a.near,f.fogFar.value=a.far):a.isFogExp2&&(f.fogDensity.value=a.density)}function s(f,a,D,T,_){a.isMeshBasicMaterial||a.isMeshLambertMaterial?r(f,a):a.isMeshToonMaterial?(r(f,a),v(f,a)):a.isMeshPhongMaterial?(r(f,a),w(f,a)):a.isMeshStandardMaterial?(r(f,a),S(f,a),a.isMeshPhysicalMaterial&&R(f,a,_)):a.isMeshMatcapMaterial?(r(f,a),F(f,a)):a.isMeshDepthMaterial?r(f,a):a.isMeshDistanceMaterial?(r(f,a),L(f,a)):a.isMeshNormalMaterial?r(f,a):a.isLineBasicMaterial?(u(f,a),a.isLineDashedMaterial&&c(f,a)):a.isPointsMaterial?x(f,a,D,T):a.isSpriteMaterial?E(f,a):a.isShadowMaterial?(f.color.value.copy(a.color),f.opacity.value=a.opacity):a.isShaderMaterial&&(a.uniformsNeedUpdate=!1)}function r(f,a){f.opacity.value=a.opacity,a.color&&f.diffuse.value.copy(a.color),a.emissive&&f.emissive.value.copy(a.emissive).multiplyScalar(a.emissiveIntensity),a.map&&(f.map.value=a.map,t(a.map,f.mapTransform)),a.alphaMap&&(f.alphaMap.value=a.alphaMap,t(a.alphaMap,f.alphaMapTransform)),a.bumpMap&&(f.bumpMap.value=a.bumpMap,t(a.bumpMap,f.bumpMapTransform),f.bumpScale.value=a.bumpScale,a.side===xt&&(f.bumpScale.value*=-1)),a.normalMap&&(f.normalMap.value=a.normalMap,t(a.normalMap,f.normalMapTransform),f.normalScale.value.copy(a.normalScale),a.side===xt&&f.normalScale.value.negate()),a.displacementMap&&(f.displacementMap.value=a.displacementMap,t(a.displacementMap,f.displacementMapTransform),f.displacementScale.value=a.displacementScale,f.displacementBias.value=a.displacementBias),a.emissiveMap&&(f.emissiveMap.value=a.emissiveMap,t(a.emissiveMap,f.emissiveMapTransform)),a.specularMap&&(f.specularMap.value=a.specularMap,t(a.specularMap,f.specularMapTransform)),a.alphaTest>0&&(f.alphaTest.value=a.alphaTest);const D=n.get(a),T=D.envMap,_=D.envMapRotation;T&&(f.envMap.value=T,Bt.copy(_),Bt.x*=-1,Bt.y*=-1,Bt.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Bt.y*=-1,Bt.z*=-1),f.envMapRotation.value.setFromMatrix4(Td.makeRotationFromEuler(Bt)),f.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=a.reflectivity,f.ior.value=a.ior,f.refractionRatio.value=a.refractionRatio),a.lightMap&&(f.lightMap.value=a.lightMap,f.lightMapIntensity.value=a.lightMapIntensity,t(a.lightMap,f.lightMapTransform)),a.aoMap&&(f.aoMap.value=a.aoMap,f.aoMapIntensity.value=a.aoMapIntensity,t(a.aoMap,f.aoMapTransform))}function u(f,a){f.diffuse.value.copy(a.color),f.opacity.value=a.opacity,a.map&&(f.map.value=a.map,t(a.map,f.mapTransform))}function c(f,a){f.dashSize.value=a.dashSize,f.totalSize.value=a.dashSize+a.gapSize,f.scale.value=a.scale}function x(f,a,D,T){f.diffuse.value.copy(a.color),f.opacity.value=a.opacity,f.size.value=a.size*D,f.scale.value=T*.5,a.map&&(f.map.value=a.map,t(a.map,f.uvTransform)),a.alphaMap&&(f.alphaMap.value=a.alphaMap,t(a.alphaMap,f.alphaMapTransform)),a.alphaTest>0&&(f.alphaTest.value=a.alphaTest)}function E(f,a){f.diffuse.value.copy(a.color),f.opacity.value=a.opacity,f.rotation.value=a.rotation,a.map&&(f.map.value=a.map,t(a.map,f.mapTransform)),a.alphaMap&&(f.alphaMap.value=a.alphaMap,t(a.alphaMap,f.alphaMapTransform)),a.alphaTest>0&&(f.alphaTest.value=a.alphaTest)}function w(f,a){f.specular.value.copy(a.specular),f.shininess.value=Math.max(a.shininess,1e-4)}function v(f,a){a.gradientMap&&(f.gradientMap.value=a.gradientMap)}function S(f,a){f.metalness.value=a.metalness,a.metalnessMap&&(f.metalnessMap.value=a.metalnessMap,t(a.metalnessMap,f.metalnessMapTransform)),f.roughness.value=a.roughness,a.roughnessMap&&(f.roughnessMap.value=a.roughnessMap,t(a.roughnessMap,f.roughnessMapTransform)),a.envMap&&(f.envMapIntensity.value=a.envMapIntensity)}function R(f,a,D){f.ior.value=a.ior,a.sheen>0&&(f.sheenColor.value.copy(a.sheenColor).multiplyScalar(a.sheen),f.sheenRoughness.value=a.sheenRoughness,a.sheenColorMap&&(f.sheenColorMap.value=a.sheenColorMap,t(a.sheenColorMap,f.sheenColorMapTransform)),a.sheenRoughnessMap&&(f.sheenRoughnessMap.value=a.sheenRoughnessMap,t(a.sheenRoughnessMap,f.sheenRoughnessMapTransform))),a.clearcoat>0&&(f.clearcoat.value=a.clearcoat,f.clearcoatRoughness.value=a.clearcoatRoughness,a.clearcoatMap&&(f.clearcoatMap.value=a.clearcoatMap,t(a.clearcoatMap,f.clearcoatMapTransform)),a.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=a.clearcoatRoughnessMap,t(a.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),a.clearcoatNormalMap&&(f.clearcoatNormalMap.value=a.clearcoatNormalMap,t(a.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(a.clearcoatNormalScale),a.side===xt&&f.clearcoatNormalScale.value.negate())),a.dispersion>0&&(f.dispersion.value=a.dispersion),a.iridescence>0&&(f.iridescence.value=a.iridescence,f.iridescenceIOR.value=a.iridescenceIOR,f.iridescenceThicknessMinimum.value=a.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=a.iridescenceThicknessRange[1],a.iridescenceMap&&(f.iridescenceMap.value=a.iridescenceMap,t(a.iridescenceMap,f.iridescenceMapTransform)),a.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=a.iridescenceThicknessMap,t(a.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),a.transmission>0&&(f.transmission.value=a.transmission,f.transmissionSamplerMap.value=D.texture,f.transmissionSamplerSize.value.set(D.width,D.height),a.transmissionMap&&(f.transmissionMap.value=a.transmissionMap,t(a.transmissionMap,f.transmissionMapTransform)),f.thickness.value=a.thickness,a.thicknessMap&&(f.thicknessMap.value=a.thicknessMap,t(a.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=a.attenuationDistance,f.attenuationColor.value.copy(a.attenuationColor)),a.anisotropy>0&&(f.anisotropyVector.value.set(a.anisotropy*Math.cos(a.anisotropyRotation),a.anisotropy*Math.sin(a.anisotropyRotation)),a.anisotropyMap&&(f.anisotropyMap.value=a.anisotropyMap,t(a.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=a.specularIntensity,f.specularColor.value.copy(a.specularColor),a.specularColorMap&&(f.specularColorMap.value=a.specularColorMap,t(a.specularColorMap,f.specularColorMapTransform)),a.specularIntensityMap&&(f.specularIntensityMap.value=a.specularIntensityMap,t(a.specularIntensityMap,f.specularIntensityMapTransform))}function F(f,a){a.matcap&&(f.matcap.value=a.matcap)}function L(f,a){const D=n.get(a).light;f.referencePosition.value.setFromMatrixPosition(D.matrixWorld),f.nearDistance.value=D.shadow.camera.near,f.farDistance.value=D.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Ad(e,n,t,i){let s={},r={},u=[];const c=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function x(D,T){const _=T.program;i.uniformBlockBinding(D,_)}function E(D,T){let _=s[D.id];_===void 0&&(F(D),_=w(D),s[D.id]=_,D.addEventListener("dispose",f));const N=T.program;i.updateUBOMapping(D,N);const C=n.render.frame;r[D.id]!==C&&(S(D),r[D.id]=C)}function w(D){const T=v();D.__bindingPointIndex=T;const _=e.createBuffer(),N=D.__size,C=D.usage;return e.bindBuffer(e.UNIFORM_BUFFER,_),e.bufferData(e.UNIFORM_BUFFER,N,C),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,T,_),_}function v(){for(let D=0;D<c;D++)if(u.indexOf(D)===-1)return u.push(D),D;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function S(D){const T=s[D.id],_=D.uniforms,N=D.__cache;e.bindBuffer(e.UNIFORM_BUFFER,T);for(let C=0,I=_.length;C<I;C++){const k=Array.isArray(_[C])?_[C]:[_[C]];for(let h=0,d=k.length;h<d;h++){const b=k[h];if(R(b,C,h,N)===!0){const B=b.__offset,X=Array.isArray(b.value)?b.value:[b.value];let Y=0;for(let Z=0;Z<X.length;Z++){const W=X[Z],ie=L(W);typeof W=="number"||typeof W=="boolean"?(b.__data[0]=W,e.bufferSubData(e.UNIFORM_BUFFER,B+Y,b.__data)):W.isMatrix3?(b.__data[0]=W.elements[0],b.__data[1]=W.elements[1],b.__data[2]=W.elements[2],b.__data[3]=0,b.__data[4]=W.elements[3],b.__data[5]=W.elements[4],b.__data[6]=W.elements[5],b.__data[7]=0,b.__data[8]=W.elements[6],b.__data[9]=W.elements[7],b.__data[10]=W.elements[8],b.__data[11]=0):(W.toArray(b.__data,Y),Y+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,B,b.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function R(D,T,_,N){const C=D.value,I=T+"_"+_;if(N[I]===void 0)return typeof C=="number"||typeof C=="boolean"?N[I]=C:N[I]=C.clone(),!0;{const k=N[I];if(typeof C=="number"||typeof C=="boolean"){if(k!==C)return N[I]=C,!0}else if(k.equals(C)===!1)return k.copy(C),!0}return!1}function F(D){const T=D.uniforms;let _=0;const N=16;for(let I=0,k=T.length;I<k;I++){const h=Array.isArray(T[I])?T[I]:[T[I]];for(let d=0,b=h.length;d<b;d++){const B=h[d],X=Array.isArray(B.value)?B.value:[B.value];for(let Y=0,Z=X.length;Y<Z;Y++){const W=X[Y],ie=L(W),G=_%N,ge=G%ie.boundary,Te=G+ge;_+=ge,Te!==0&&N-Te<ie.storage&&(_+=N-Te),B.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=_,_+=ie.storage}}}const C=_%N;return C>0&&(_+=N-C),D.__size=_,D.__cache={},this}function L(D){const T={boundary:0,storage:0};return typeof D=="number"||typeof D=="boolean"?(T.boundary=4,T.storage=4):D.isVector2?(T.boundary=8,T.storage=8):D.isVector3||D.isColor?(T.boundary=16,T.storage=12):D.isVector4?(T.boundary=16,T.storage=16):D.isMatrix3?(T.boundary=48,T.storage=48):D.isMatrix4?(T.boundary=64,T.storage=64):D.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",D),T}function f(D){const T=D.target;T.removeEventListener("dispose",f);const _=u.indexOf(T.__bindingPointIndex);u.splice(_,1),e.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function a(){for(const D in s)e.deleteBuffer(s[D]);u=[],s={},r={}}return{bind:x,update:E,dispose:a}}class kd{constructor(n={}){const{canvas:t=_r(),context:i=null,depth:s=!0,stencil:r=!1,alpha:u=!1,antialias:c=!1,premultipliedAlpha:x=!0,preserveDrawingBuffer:E=!1,powerPreference:w="default",failIfMajorPerformanceCaveat:v=!1,reversedDepthBuffer:S=!1}=n;this.isWebGLRenderer=!0;let R;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");R=i.getContextAttributes().alpha}else R=u;const F=new Uint32Array(4),L=new Int32Array(4);let f=null,a=null;const D=[],T=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=yt,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let N=!1;this._outputColorSpace=gr;let C=0,I=0,k=null,h=-1,d=null;const b=new ot,B=new ot;let X=null;const Y=new je(0);let Z=0,W=t.width,ie=t.height,G=1,ge=null,Te=null;const Ue=new ot(0,0,W,ie),He=new ot(0,0,W,ie);let nt=!1;const et=new Fa;let ke=!1,V=!1;const q=new Jt,ce=new Ce,Pe=new ot,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Oe=!1;function pt(){return k===null?G:1}let m=i;function Ze(l,M){return t.getContext(l,M)}try{const l={alpha:!0,depth:s,stencil:r,antialias:c,premultipliedAlpha:x,preserveDrawingBuffer:E,powerPreference:w,failIfMajorPerformanceCaveat:v};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${vr}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",le,!1),t.addEventListener("webglcontextcreationerror",$,!1),m===null){const M="webgl2";if(m=Ze(M,l),m===null)throw Ze(M)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(l){throw console.error("THREE.WebGLRenderer: "+l.message),l}let De,Re,ue,$e,pe,ye,ct,it,p,o,P,H,K,O,ve,ee,he,me,Q,oe,Ae,_e,ae,Le;function g(){De=new Ic(m),De.init(),_e=new gd(m,De),Re=new Cc(m,De,n,_e),ue=new md(m,De),Re.reversedDepthBuffer&&S&&ue.buffers.depth.setReversed(!0),$e=new Fc(m),pe=new nd,ye=new _d(m,De,ue,pe,Re,_e,$e),ct=new wc(_),it=new yc(_),p=new ko(m),ae=new Rc(m,p),o=new Nc(m,p,$e,ae),P=new Hc(m,o,p,$e),Q=new Bc(m,Re,ye),ee=new Pc(pe),H=new td(_,ct,it,De,Re,ae,ee),K=new xd(_,pe),O=new ad,ve=new fd(De),me=new Ac(_,ct,it,ue,P,R,x),he=new pd(_,P,Re),Le=new Ad(m,$e,Re,ue),oe=new bc(m,De,$e),Ae=new Oc(m,De,$e),$e.programs=H.programs,_.capabilities=Re,_.extensions=De,_.properties=pe,_.renderLists=O,_.shadowMap=he,_.state=ue,_.info=$e}g();const J=new Md(_,m);this.xr=J,this.getContext=function(){return m},this.getContextAttributes=function(){return m.getContextAttributes()},this.forceContextLoss=function(){const l=De.get("WEBGL_lose_context");l&&l.loseContext()},this.forceContextRestore=function(){const l=De.get("WEBGL_lose_context");l&&l.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(l){l!==void 0&&(G=l,this.setSize(W,ie,!1))},this.getSize=function(l){return l.set(W,ie)},this.setSize=function(l,M,U=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=l,ie=M,t.width=Math.floor(l*G),t.height=Math.floor(M*G),U===!0&&(t.style.width=l+"px",t.style.height=M+"px"),this.setViewport(0,0,l,M)},this.getDrawingBufferSize=function(l){return l.set(W*G,ie*G).floor()},this.setDrawingBufferSize=function(l,M,U){W=l,ie=M,G=U,t.width=Math.floor(l*U),t.height=Math.floor(M*U),this.setViewport(0,0,l,M)},this.getCurrentViewport=function(l){return l.copy(b)},this.getViewport=function(l){return l.copy(Ue)},this.setViewport=function(l,M,U,y){l.isVector4?Ue.set(l.x,l.y,l.z,l.w):Ue.set(l,M,U,y),ue.viewport(b.copy(Ue).multiplyScalar(G).round())},this.getScissor=function(l){return l.copy(He)},this.setScissor=function(l,M,U,y){l.isVector4?He.set(l.x,l.y,l.z,l.w):He.set(l,M,U,y),ue.scissor(B.copy(He).multiplyScalar(G).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(l){ue.setScissorTest(nt=l)},this.setOpaqueSort=function(l){ge=l},this.setTransparentSort=function(l){Te=l},this.getClearColor=function(l){return l.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor(...arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha(...arguments)},this.clear=function(l=!0,M=!0,U=!0){let y=0;if(l){let A=!1;if(k!==null){const j=k.texture.format;A=j===$a||j===Za||j===qa}if(A){const j=k.texture.type,re=j===Wt||j===dn||j===wn||j===fn||j===ka||j===Wa,fe=me.getClearColor(),se=me.getClearAlpha(),xe=fe.r,be=fe.g,Se=fe.b;re?(F[0]=xe,F[1]=be,F[2]=Se,F[3]=se,m.clearBufferuiv(m.COLOR,0,F)):(L[0]=xe,L[1]=be,L[2]=Se,L[3]=se,m.clearBufferiv(m.COLOR,0,L))}else y|=m.COLOR_BUFFER_BIT}M&&(y|=m.DEPTH_BUFFER_BIT),U&&(y|=m.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),m.clear(y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",le,!1),t.removeEventListener("webglcontextcreationerror",$,!1),me.dispose(),O.dispose(),ve.dispose(),pe.dispose(),ct.dispose(),it.dispose(),P.dispose(),ae.dispose(),Le.dispose(),H.dispose(),J.dispose(),J.removeEventListener("sessionstart",At),J.removeEventListener("sessionend",mi),Nt.stop()};function te(l){l.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function le(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const l=$e.autoReset,M=he.enabled,U=he.autoUpdate,y=he.needsUpdate,A=he.type;g(),$e.autoReset=l,he.enabled=M,he.autoUpdate=U,he.needsUpdate=y,he.type=A}function $(l){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",l.statusMessage)}function z(l){const M=l.target;M.removeEventListener("dispose",z),de(M)}function de(l){we(l),pe.remove(l)}function we(l){const M=pe.get(l).programs;M!==void 0&&(M.forEach(function(U){H.releaseProgram(U)}),l.isShaderMaterial&&H.releaseShaderCache(l))}this.renderBufferDirect=function(l,M,U,y,A,j){M===null&&(M=Ee);const re=A.isMesh&&A.matrixWorld.determinant()<0,fe=fr(l,M,U,y,A);ue.setMaterial(y,re);let se=U.index,xe=1;if(y.wireframe===!0){if(se=o.getWireframeAttribute(U),se===void 0)return;xe=2}const be=U.drawRange,Se=U.attributes.position;let Ne=be.start*xe,Ve=(be.start+be.count)*xe;j!==null&&(Ne=Math.max(Ne,j.start*xe),Ve=Math.min(Ve,(j.start+j.count)*xe)),se!==null?(Ne=Math.max(Ne,0),Ve=Math.min(Ve,se.count)):Se!=null&&(Ne=Math.max(Ne,0),Ve=Math.min(Ve,Se.count));const tt=Ve-Ne;if(tt<0||tt===1/0)return;ae.setup(A,y,fe,U,se);let Ke,We=oe;if(se!==null&&(Ke=p.get(se),We=Ae,We.setIndex(Ke)),A.isMesh)y.wireframe===!0?(ue.setLineWidth(y.wireframeLinewidth*pt()),We.setMode(m.LINES)):We.setMode(m.TRIANGLES);else if(A.isLine){let Me=y.linewidth;Me===void 0&&(Me=1),ue.setLineWidth(Me*pt()),A.isLineSegments?We.setMode(m.LINES):A.isLineLoop?We.setMode(m.LINE_LOOP):We.setMode(m.LINE_STRIP)}else A.isPoints?We.setMode(m.POINTS):A.isSprite&&We.setMode(m.TRIANGLES);if(A.isBatchedMesh)if(A._multiDrawInstances!==null)Qn("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),We.renderMultiDrawInstances(A._multiDrawStarts,A._multiDrawCounts,A._multiDrawCount,A._multiDrawInstances);else if(De.get("WEBGL_multi_draw"))We.renderMultiDraw(A._multiDrawStarts,A._multiDrawCounts,A._multiDrawCount);else{const Me=A._multiDrawStarts,Qe=A._multiDrawCounts,Fe=A._multiDrawCount,Et=se?p.get(se).bytesPerElement:1,Xt=pe.get(y).currentProgram.getUniforms();for(let St=0;St<Fe;St++)Xt.setValue(m,"_gl_DrawID",St),We.render(Me[St]/Et,Qe[St])}else if(A.isInstancedMesh)We.renderInstances(Ne,tt,A.count);else if(U.isInstancedBufferGeometry){const Me=U._maxInstanceCount!==void 0?U._maxInstanceCount:1/0,Qe=Math.min(U.instanceCount,Me);We.renderInstances(Ne,tt,Qe)}else We.render(Ne,tt)};function Xe(l,M,U){l.transparent===!0&&l.side===Dt&&l.forceSinglePass===!1?(l.side=xt,l.needsUpdate=!0,hn(l,M,U),l.side=cn,l.needsUpdate=!0,hn(l,M,U),l.side=Dt):hn(l,M,U)}this.compile=function(l,M,U=null){U===null&&(U=l),a=ve.get(U),a.init(M),T.push(a),U.traverseVisible(function(A){A.isLight&&A.layers.test(M.layers)&&(a.pushLight(A),A.castShadow&&a.pushShadow(A))}),l!==U&&l.traverseVisible(function(A){A.isLight&&A.layers.test(M.layers)&&(a.pushLight(A),A.castShadow&&a.pushShadow(A))}),a.setupLights();const y=new Set;return l.traverse(function(A){if(!(A.isMesh||A.isPoints||A.isLine||A.isSprite))return;const j=A.material;if(j)if(Array.isArray(j))for(let re=0;re<j.length;re++){const fe=j[re];Xe(fe,U,A),y.add(fe)}else Xe(j,U,A),y.add(j)}),a=T.pop(),y},this.compileAsync=function(l,M,U=null){const y=this.compile(l,M,U);return new Promise(A=>{function j(){if(y.forEach(function(re){pe.get(re).currentProgram.isReady()&&y.delete(re)}),y.size===0){A(l);return}setTimeout(j,10)}De.get("KHR_parallel_shader_compile")!==null?j():setTimeout(j,10)})};let Ge=null;function Pt(l){Ge&&Ge(l)}function At(){Nt.stop()}function mi(){Nt.start()}const Nt=new ar;Nt.setAnimationLoop(Pt),typeof self<"u"&&Nt.setContext(self),this.setAnimationLoop=function(l){Ge=l,J.setAnimationLoop(l),l===null?Nt.stop():Nt.start()},J.addEventListener("sessionstart",At),J.addEventListener("sessionend",mi),this.render=function(l,M){if(M!==void 0&&M.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(l.matrixWorldAutoUpdate===!0&&l.updateMatrixWorld(),M.parent===null&&M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(M),M=J.getCamera()),l.isScene===!0&&l.onBeforeRender(_,l,M,k),a=ve.get(l,T.length),a.init(M),T.push(a),q.multiplyMatrices(M.projectionMatrix,M.matrixWorldInverse),et.setFromProjectionMatrix(q,Mi,M.reversedDepth),V=this.localClippingEnabled,ke=ee.init(this.clippingPlanes,V),f=O.get(l,D.length),f.init(),D.push(f),J.enabled===!0&&J.isPresenting===!0){const j=_.xr.getDepthSensingMesh();j!==null&&In(j,M,-1/0,_.sortObjects)}In(l,M,0,_.sortObjects),f.finish(),_.sortObjects===!0&&f.sort(ge,Te),Oe=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,Oe&&me.addToRenderList(f,l),this.info.render.frame++,ke===!0&&ee.beginShadows();const U=a.state.shadowsArray;he.render(U,l,M),ke===!0&&ee.endShadows(),this.info.autoReset===!0&&this.info.reset();const y=f.opaque,A=f.transmissive;if(a.setupLights(),M.isArrayCamera){const j=M.cameras;if(A.length>0)for(let re=0,fe=j.length;re<fe;re++){const se=j[re];gi(y,A,l,se)}Oe&&me.render(l);for(let re=0,fe=j.length;re<fe;re++){const se=j[re];_i(f,l,se,se.viewport)}}else A.length>0&&gi(y,A,l,M),Oe&&me.render(l),_i(f,l,M);k!==null&&I===0&&(ye.updateMultisampleRenderTarget(k),ye.updateRenderTargetMipmap(k)),l.isScene===!0&&l.onAfterRender(_,l,M),ae.resetDefaultState(),h=-1,d=null,T.pop(),T.length>0?(a=T[T.length-1],ke===!0&&ee.setGlobalState(_.clippingPlanes,a.state.camera)):a=null,D.pop(),D.length>0?f=D[D.length-1]:f=null};function In(l,M,U,y){if(l.visible===!1)return;if(l.layers.test(M.layers)){if(l.isGroup)U=l.renderOrder;else if(l.isLOD)l.autoUpdate===!0&&l.update(M);else if(l.isLight)a.pushLight(l),l.castShadow&&a.pushShadow(l);else if(l.isSprite){if(!l.frustumCulled||et.intersectsSprite(l)){y&&Pe.setFromMatrixPosition(l.matrixWorld).applyMatrix4(q);const re=P.update(l),fe=l.material;fe.visible&&f.push(l,re,fe,U,Pe.z,null)}}else if((l.isMesh||l.isLine||l.isPoints)&&(!l.frustumCulled||et.intersectsObject(l))){const re=P.update(l),fe=l.material;if(y&&(l.boundingSphere!==void 0?(l.boundingSphere===null&&l.computeBoundingSphere(),Pe.copy(l.boundingSphere.center)):(re.boundingSphere===null&&re.computeBoundingSphere(),Pe.copy(re.boundingSphere.center)),Pe.applyMatrix4(l.matrixWorld).applyMatrix4(q)),Array.isArray(fe)){const se=re.groups;for(let xe=0,be=se.length;xe<be;xe++){const Se=se[xe],Ne=fe[Se.materialIndex];Ne&&Ne.visible&&f.push(l,re,Ne,U,Pe.z,Se)}}else fe.visible&&f.push(l,re,fe,U,Pe.z,null)}}const j=l.children;for(let re=0,fe=j.length;re<fe;re++)In(j[re],M,U,y)}function _i(l,M,U,y){const A=l.opaque,j=l.transmissive,re=l.transparent;a.setupLightsView(U),ke===!0&&ee.setGlobalState(_.clippingPlanes,U),y&&ue.viewport(b.copy(y)),A.length>0&&pn(A,M,U),j.length>0&&pn(j,M,U),re.length>0&&pn(re,M,U),ue.buffers.depth.setTest(!0),ue.buffers.depth.setMask(!0),ue.buffers.color.setMask(!0),ue.setPolygonOffset(!1)}function gi(l,M,U,y){if((U.isScene===!0?U.overrideMaterial:null)!==null)return;a.state.transmissionRenderTarget[y.id]===void 0&&(a.state.transmissionRenderTarget[y.id]=new en(1,1,{generateMipmaps:!0,type:De.has("EXT_color_buffer_half_float")||De.has("EXT_color_buffer_float")?Dn:Wt,minFilter:on,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:at.workingColorSpace}));const j=a.state.transmissionRenderTarget[y.id],re=y.viewport||b;j.setSize(re.z*_.transmissionResolutionScale,re.w*_.transmissionResolutionScale);const fe=_.getRenderTarget(),se=_.getActiveCubeFace(),xe=_.getActiveMipmapLevel();_.setRenderTarget(j),_.getClearColor(Y),Z=_.getClearAlpha(),Z<1&&_.setClearColor(16777215,.5),_.clear(),Oe&&me.render(U);const be=_.toneMapping;_.toneMapping=yt;const Se=y.viewport;if(y.viewport!==void 0&&(y.viewport=void 0),a.setupLightsView(y),ke===!0&&ee.setGlobalState(_.clippingPlanes,y),pn(l,U,y),ye.updateMultisampleRenderTarget(j),ye.updateRenderTargetMipmap(j),De.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let Ve=0,tt=M.length;Ve<tt;Ve++){const Ke=M[Ve],We=Ke.object,Me=Ke.geometry,Qe=Ke.material,Fe=Ke.group;if(Qe.side===Dt&&We.layers.test(y.layers)){const Et=Qe.side;Qe.side=xt,Qe.needsUpdate=!0,vi(We,U,y,Me,Qe,Fe),Qe.side=Et,Qe.needsUpdate=!0,Ne=!0}}Ne===!0&&(ye.updateMultisampleRenderTarget(j),ye.updateRenderTargetMipmap(j))}_.setRenderTarget(fe,se,xe),_.setClearColor(Y,Z),Se!==void 0&&(y.viewport=Se),_.toneMapping=be}function pn(l,M,U){const y=M.isScene===!0?M.overrideMaterial:null;for(let A=0,j=l.length;A<j;A++){const re=l[A],fe=re.object,se=re.geometry,xe=re.group;let be=re.material;be.allowOverride===!0&&y!==null&&(be=y),fe.layers.test(U.layers)&&vi(fe,M,U,se,be,xe)}}function vi(l,M,U,y,A,j){l.onBeforeRender(_,M,U,y,A,j),l.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,l.matrixWorld),l.normalMatrix.getNormalMatrix(l.modelViewMatrix),A.onBeforeRender(_,M,U,y,l,j),A.transparent===!0&&A.side===Dt&&A.forceSinglePass===!1?(A.side=xt,A.needsUpdate=!0,_.renderBufferDirect(U,M,y,A,l,j),A.side=cn,A.needsUpdate=!0,_.renderBufferDirect(U,M,y,A,l,j),A.side=Dt):_.renderBufferDirect(U,M,y,A,l,j),l.onAfterRender(_,M,U,y,A,j)}function hn(l,M,U){M.isScene!==!0&&(M=Ee);const y=pe.get(l),A=a.state.lights,j=a.state.shadowsArray,re=A.state.version,fe=H.getParameters(l,A.state,j,M,U),se=H.getProgramCacheKey(fe);let xe=y.programs;y.environment=l.isMeshStandardMaterial?M.environment:null,y.fog=M.fog,y.envMap=(l.isMeshStandardMaterial?it:ct).get(l.envMap||y.environment),y.envMapRotation=y.environment!==null&&l.envMap===null?M.environmentRotation:l.envMapRotation,xe===void 0&&(l.addEventListener("dispose",z),xe=new Map,y.programs=xe);let be=xe.get(se);if(be!==void 0){if(y.currentProgram===be&&y.lightsStateVersion===re)return Si(l,fe),be}else fe.uniforms=H.getUniforms(l),l.onBeforeCompile(fe,_),be=H.acquireProgram(fe,se),xe.set(se,be),y.uniforms=fe.uniforms;const Se=y.uniforms;return(!l.isShaderMaterial&&!l.isRawShaderMaterial||l.clipping===!0)&&(Se.clippingPlanes=ee.uniform),Si(l,fe),y.needsLights=ur(l),y.lightsStateVersion=re,y.needsLights&&(Se.ambientLightColor.value=A.state.ambient,Se.lightProbe.value=A.state.probe,Se.directionalLights.value=A.state.directional,Se.directionalLightShadows.value=A.state.directionalShadow,Se.spotLights.value=A.state.spot,Se.spotLightShadows.value=A.state.spotShadow,Se.rectAreaLights.value=A.state.rectArea,Se.ltc_1.value=A.state.rectAreaLTC1,Se.ltc_2.value=A.state.rectAreaLTC2,Se.pointLights.value=A.state.point,Se.pointLightShadows.value=A.state.pointShadow,Se.hemisphereLights.value=A.state.hemi,Se.directionalShadowMap.value=A.state.directionalShadowMap,Se.directionalShadowMatrix.value=A.state.directionalShadowMatrix,Se.spotShadowMap.value=A.state.spotShadowMap,Se.spotLightMatrix.value=A.state.spotLightMatrix,Se.spotLightMap.value=A.state.spotLightMap,Se.pointShadowMap.value=A.state.pointShadowMap,Se.pointShadowMatrix.value=A.state.pointShadowMatrix),y.currentProgram=be,y.uniformsList=null,be}function Ei(l){if(l.uniformsList===null){const M=l.currentProgram.getUniforms();l.uniformsList=bn.seqWithValue(M.seq,l.uniforms)}return l.uniformsList}function Si(l,M){const U=pe.get(l);U.outputColorSpace=M.outputColorSpace,U.batching=M.batching,U.batchingColor=M.batchingColor,U.instancing=M.instancing,U.instancingColor=M.instancingColor,U.instancingMorph=M.instancingMorph,U.skinning=M.skinning,U.morphTargets=M.morphTargets,U.morphNormals=M.morphNormals,U.morphColors=M.morphColors,U.morphTargetsCount=M.morphTargetsCount,U.numClippingPlanes=M.numClippingPlanes,U.numIntersection=M.numClipIntersection,U.vertexAlphas=M.vertexAlphas,U.vertexTangents=M.vertexTangents,U.toneMapping=M.toneMapping}function fr(l,M,U,y,A){M.isScene!==!0&&(M=Ee),ye.resetTextureUnits();const j=M.fog,re=y.isMeshStandardMaterial?M.environment:null,fe=k===null?_.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:Ln,se=(y.isMeshStandardMaterial?it:ct).get(y.envMap||re),xe=y.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,be=!!U.attributes.tangent&&(!!y.normalMap||y.anisotropy>0),Se=!!U.morphAttributes.position,Ne=!!U.morphAttributes.normal,Ve=!!U.morphAttributes.color;let tt=yt;y.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(tt=_.toneMapping);const Ke=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,We=Ke!==void 0?Ke.length:0,Me=pe.get(y),Qe=a.state.lights;if(ke===!0&&(V===!0||l!==d)){const ht=l===d&&y.id===h;ee.setState(y,l,ht)}let Fe=!1;y.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==Qe.state.version||Me.outputColorSpace!==fe||A.isBatchedMesh&&Me.batching===!1||!A.isBatchedMesh&&Me.batching===!0||A.isBatchedMesh&&Me.batchingColor===!0&&A.colorTexture===null||A.isBatchedMesh&&Me.batchingColor===!1&&A.colorTexture!==null||A.isInstancedMesh&&Me.instancing===!1||!A.isInstancedMesh&&Me.instancing===!0||A.isSkinnedMesh&&Me.skinning===!1||!A.isSkinnedMesh&&Me.skinning===!0||A.isInstancedMesh&&Me.instancingColor===!0&&A.instanceColor===null||A.isInstancedMesh&&Me.instancingColor===!1&&A.instanceColor!==null||A.isInstancedMesh&&Me.instancingMorph===!0&&A.morphTexture===null||A.isInstancedMesh&&Me.instancingMorph===!1&&A.morphTexture!==null||Me.envMap!==se||y.fog===!0&&Me.fog!==j||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==ee.numPlanes||Me.numIntersection!==ee.numIntersection)||Me.vertexAlphas!==xe||Me.vertexTangents!==be||Me.morphTargets!==Se||Me.morphNormals!==Ne||Me.morphColors!==Ve||Me.toneMapping!==tt||Me.morphTargetsCount!==We)&&(Fe=!0):(Fe=!0,Me.__version=y.version);let Et=Me.currentProgram;Fe===!0&&(Et=hn(y,M,A));let Xt=!1,St=!1,an=!1;const Je=Et.getUniforms(),Mt=Me.uniforms;if(ue.useProgram(Et.program)&&(Xt=!0,St=!0,an=!0),y.id!==h&&(h=y.id,St=!0),Xt||d!==l){ue.buffers.depth.getReversed()&&l.reversedDepth!==!0&&(l._reversedDepth=!0,l.updateProjectionMatrix()),Je.setValue(m,"projectionMatrix",l.projectionMatrix),Je.setValue(m,"viewMatrix",l.matrixWorldInverse);const mt=Je.map.cameraPosition;mt!==void 0&&mt.setValue(m,ce.setFromMatrixPosition(l.matrixWorld)),Re.logarithmicDepthBuffer&&Je.setValue(m,"logDepthBufFC",2/(Math.log(l.far+1)/Math.LN2)),(y.isMeshPhongMaterial||y.isMeshToonMaterial||y.isMeshLambertMaterial||y.isMeshBasicMaterial||y.isMeshStandardMaterial||y.isShaderMaterial)&&Je.setValue(m,"isOrthographic",l.isOrthographicCamera===!0),d!==l&&(d=l,St=!0,an=!0)}if(A.isSkinnedMesh){Je.setOptional(m,A,"bindMatrix"),Je.setOptional(m,A,"bindMatrixInverse");const ht=A.skeleton;ht&&(ht.boneTexture===null&&ht.computeBoneTexture(),Je.setValue(m,"boneTexture",ht.boneTexture,ye))}A.isBatchedMesh&&(Je.setOptional(m,A,"batchingTexture"),Je.setValue(m,"batchingTexture",A._matricesTexture,ye),Je.setOptional(m,A,"batchingIdTexture"),Je.setValue(m,"batchingIdTexture",A._indirectTexture,ye),Je.setOptional(m,A,"batchingColorTexture"),A._colorsTexture!==null&&Je.setValue(m,"batchingColorTexture",A._colorsTexture,ye));const Tt=U.morphAttributes;if((Tt.position!==void 0||Tt.normal!==void 0||Tt.color!==void 0)&&Q.update(A,U,Et),(St||Me.receiveShadow!==A.receiveShadow)&&(Me.receiveShadow=A.receiveShadow,Je.setValue(m,"receiveShadow",A.receiveShadow)),y.isMeshGouraudMaterial&&y.envMap!==null&&(Mt.envMap.value=se,Mt.flipEnvMap.value=se.isCubeTexture&&se.isRenderTargetTexture===!1?-1:1),y.isMeshStandardMaterial&&y.envMap===null&&M.environment!==null&&(Mt.envMapIntensity.value=M.environmentIntensity),St&&(Je.setValue(m,"toneMappingExposure",_.toneMappingExposure),Me.needsLights&&dr(Mt,an),j&&y.fog===!0&&K.refreshFogUniforms(Mt,j),K.refreshMaterialUniforms(Mt,y,G,ie,a.state.transmissionRenderTarget[l.id]),bn.upload(m,Ei(Me),Mt,ye)),y.isShaderMaterial&&y.uniformsNeedUpdate===!0&&(bn.upload(m,Ei(Me),Mt,ye),y.uniformsNeedUpdate=!1),y.isSpriteMaterial&&Je.setValue(m,"center",A.center),Je.setValue(m,"modelViewMatrix",A.modelViewMatrix),Je.setValue(m,"normalMatrix",A.normalMatrix),Je.setValue(m,"modelMatrix",A.matrixWorld),y.isShaderMaterial||y.isRawShaderMaterial){const ht=y.uniformsGroups;for(let mt=0,Nn=ht.length;mt<Nn;mt++){const Ot=ht[mt];Le.update(Ot,Et),Le.bind(Ot,Et)}}return Et}function dr(l,M){l.ambientLightColor.needsUpdate=M,l.lightProbe.needsUpdate=M,l.directionalLights.needsUpdate=M,l.directionalLightShadows.needsUpdate=M,l.pointLights.needsUpdate=M,l.pointLightShadows.needsUpdate=M,l.spotLights.needsUpdate=M,l.spotLightShadows.needsUpdate=M,l.rectAreaLights.needsUpdate=M,l.hemisphereLights.needsUpdate=M}function ur(l){return l.isMeshLambertMaterial||l.isMeshToonMaterial||l.isMeshPhongMaterial||l.isMeshStandardMaterial||l.isShadowMaterial||l.isShaderMaterial&&l.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return k},this.setRenderTargetTextures=function(l,M,U){const y=pe.get(l);y.__autoAllocateDepthBuffer=l.resolveDepthBuffer===!1,y.__autoAllocateDepthBuffer===!1&&(y.__useRenderToTexture=!1),pe.get(l.texture).__webglTexture=M,pe.get(l.depthTexture).__webglTexture=y.__autoAllocateDepthBuffer?void 0:U,y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(l,M){const U=pe.get(l);U.__webglFramebuffer=M,U.__useDefaultFramebuffer=M===void 0};const pr=m.createFramebuffer();this.setRenderTarget=function(l,M=0,U=0){k=l,C=M,I=U;let y=!0,A=null,j=!1,re=!1;if(l){const se=pe.get(l);if(se.__useDefaultFramebuffer!==void 0)ue.bindFramebuffer(m.FRAMEBUFFER,null),y=!1;else if(se.__webglFramebuffer===void 0)ye.setupRenderTarget(l);else if(se.__hasExternalTextures)ye.rebindTextures(l,pe.get(l.texture).__webglTexture,pe.get(l.depthTexture).__webglTexture);else if(l.depthBuffer){const Se=l.depthTexture;if(se.__boundDepthTexture!==Se){if(Se!==null&&pe.has(Se)&&(l.width!==Se.image.width||l.height!==Se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ye.setupDepthRenderbuffer(l)}}const xe=l.texture;(xe.isData3DTexture||xe.isDataArrayTexture||xe.isCompressedArrayTexture)&&(re=!0);const be=pe.get(l).__webglFramebuffer;l.isWebGLCubeRenderTarget?(Array.isArray(be[M])?A=be[M][U]:A=be[M],j=!0):l.samples>0&&ye.useMultisampledRTT(l)===!1?A=pe.get(l).__webglMultisampledFramebuffer:Array.isArray(be)?A=be[U]:A=be,b.copy(l.viewport),B.copy(l.scissor),X=l.scissorTest}else b.copy(Ue).multiplyScalar(G).floor(),B.copy(He).multiplyScalar(G).floor(),X=nt;if(U!==0&&(A=pr),ue.bindFramebuffer(m.FRAMEBUFFER,A)&&y&&ue.drawBuffers(l,A),ue.viewport(b),ue.scissor(B),ue.setScissorTest(X),j){const se=pe.get(l.texture);m.framebufferTexture2D(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_CUBE_MAP_POSITIVE_X+M,se.__webglTexture,U)}else if(re){const se=M;for(let xe=0;xe<l.textures.length;xe++){const be=pe.get(l.textures[xe]);m.framebufferTextureLayer(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0+xe,be.__webglTexture,U,se)}}else if(l!==null&&U!==0){const se=pe.get(l.texture);m.framebufferTexture2D(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,se.__webglTexture,U)}h=-1},this.readRenderTargetPixels=function(l,M,U,y,A,j,re,fe=0){if(!(l&&l.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let se=pe.get(l).__webglFramebuffer;if(l.isWebGLCubeRenderTarget&&re!==void 0&&(se=se[re]),se){ue.bindFramebuffer(m.FRAMEBUFFER,se);try{const xe=l.textures[fe],be=xe.format,Se=xe.type;if(!Re.textureFormatReadable(be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Re.textureTypeReadable(Se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}M>=0&&M<=l.width-y&&U>=0&&U<=l.height-A&&(l.textures.length>1&&m.readBuffer(m.COLOR_ATTACHMENT0+fe),m.readPixels(M,U,y,A,_e.convert(be),_e.convert(Se),j))}finally{const xe=k!==null?pe.get(k).__webglFramebuffer:null;ue.bindFramebuffer(m.FRAMEBUFFER,xe)}}},this.readRenderTargetPixelsAsync=async function(l,M,U,y,A,j,re,fe=0){if(!(l&&l.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let se=pe.get(l).__webglFramebuffer;if(l.isWebGLCubeRenderTarget&&re!==void 0&&(se=se[re]),se)if(M>=0&&M<=l.width-y&&U>=0&&U<=l.height-A){ue.bindFramebuffer(m.FRAMEBUFFER,se);const xe=l.textures[fe],be=xe.format,Se=xe.type;if(!Re.textureFormatReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Re.textureTypeReadable(Se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=m.createBuffer();m.bindBuffer(m.PIXEL_PACK_BUFFER,Ne),m.bufferData(m.PIXEL_PACK_BUFFER,j.byteLength,m.STREAM_READ),l.textures.length>1&&m.readBuffer(m.COLOR_ATTACHMENT0+fe),m.readPixels(M,U,y,A,_e.convert(be),_e.convert(Se),0);const Ve=k!==null?pe.get(k).__webglFramebuffer:null;ue.bindFramebuffer(m.FRAMEBUFFER,Ve);const tt=m.fenceSync(m.SYNC_GPU_COMMANDS_COMPLETE,0);return m.flush(),await Er(m,tt,4),m.bindBuffer(m.PIXEL_PACK_BUFFER,Ne),m.getBufferSubData(m.PIXEL_PACK_BUFFER,0,j),m.deleteBuffer(Ne),m.deleteSync(tt),j}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(l,M=null,U=0){const y=Math.pow(2,-U),A=Math.floor(l.image.width*y),j=Math.floor(l.image.height*y),re=M!==null?M.x:0,fe=M!==null?M.y:0;ye.setTexture2D(l,0),m.copyTexSubImage2D(m.TEXTURE_2D,U,0,0,re,fe,A,j),ue.unbindTexture()};const hr=m.createFramebuffer(),mr=m.createFramebuffer();this.copyTextureToTexture=function(l,M,U=null,y=null,A=0,j=null){j===null&&(A!==0?(Qn("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),j=A,A=0):j=0);let re,fe,se,xe,be,Se,Ne,Ve,tt;const Ke=l.isCompressedTexture?l.mipmaps[j]:l.image;if(U!==null)re=U.max.x-U.min.x,fe=U.max.y-U.min.y,se=U.isBox3?U.max.z-U.min.z:1,xe=U.min.x,be=U.min.y,Se=U.isBox3?U.min.z:0;else{const Tt=Math.pow(2,-A);re=Math.floor(Ke.width*Tt),fe=Math.floor(Ke.height*Tt),l.isDataArrayTexture?se=Ke.depth:l.isData3DTexture?se=Math.floor(Ke.depth*Tt):se=1,xe=0,be=0,Se=0}y!==null?(Ne=y.x,Ve=y.y,tt=y.z):(Ne=0,Ve=0,tt=0);const We=_e.convert(M.format),Me=_e.convert(M.type);let Qe;M.isData3DTexture?(ye.setTexture3D(M,0),Qe=m.TEXTURE_3D):M.isDataArrayTexture||M.isCompressedArrayTexture?(ye.setTexture2DArray(M,0),Qe=m.TEXTURE_2D_ARRAY):(ye.setTexture2D(M,0),Qe=m.TEXTURE_2D),m.pixelStorei(m.UNPACK_FLIP_Y_WEBGL,M.flipY),m.pixelStorei(m.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),m.pixelStorei(m.UNPACK_ALIGNMENT,M.unpackAlignment);const Fe=m.getParameter(m.UNPACK_ROW_LENGTH),Et=m.getParameter(m.UNPACK_IMAGE_HEIGHT),Xt=m.getParameter(m.UNPACK_SKIP_PIXELS),St=m.getParameter(m.UNPACK_SKIP_ROWS),an=m.getParameter(m.UNPACK_SKIP_IMAGES);m.pixelStorei(m.UNPACK_ROW_LENGTH,Ke.width),m.pixelStorei(m.UNPACK_IMAGE_HEIGHT,Ke.height),m.pixelStorei(m.UNPACK_SKIP_PIXELS,xe),m.pixelStorei(m.UNPACK_SKIP_ROWS,be),m.pixelStorei(m.UNPACK_SKIP_IMAGES,Se);const Je=l.isDataArrayTexture||l.isData3DTexture,Mt=M.isDataArrayTexture||M.isData3DTexture;if(l.isDepthTexture){const Tt=pe.get(l),ht=pe.get(M),mt=pe.get(Tt.__renderTarget),Nn=pe.get(ht.__renderTarget);ue.bindFramebuffer(m.READ_FRAMEBUFFER,mt.__webglFramebuffer),ue.bindFramebuffer(m.DRAW_FRAMEBUFFER,Nn.__webglFramebuffer);for(let Ot=0;Ot<se;Ot++)Je&&(m.framebufferTextureLayer(m.READ_FRAMEBUFFER,m.COLOR_ATTACHMENT0,pe.get(l).__webglTexture,A,Se+Ot),m.framebufferTextureLayer(m.DRAW_FRAMEBUFFER,m.COLOR_ATTACHMENT0,pe.get(M).__webglTexture,j,tt+Ot)),m.blitFramebuffer(xe,be,re,fe,Ne,Ve,re,fe,m.DEPTH_BUFFER_BIT,m.NEAREST);ue.bindFramebuffer(m.READ_FRAMEBUFFER,null),ue.bindFramebuffer(m.DRAW_FRAMEBUFFER,null)}else if(A!==0||l.isRenderTargetTexture||pe.has(l)){const Tt=pe.get(l),ht=pe.get(M);ue.bindFramebuffer(m.READ_FRAMEBUFFER,hr),ue.bindFramebuffer(m.DRAW_FRAMEBUFFER,mr);for(let mt=0;mt<se;mt++)Je?m.framebufferTextureLayer(m.READ_FRAMEBUFFER,m.COLOR_ATTACHMENT0,Tt.__webglTexture,A,Se+mt):m.framebufferTexture2D(m.READ_FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,Tt.__webglTexture,A),Mt?m.framebufferTextureLayer(m.DRAW_FRAMEBUFFER,m.COLOR_ATTACHMENT0,ht.__webglTexture,j,tt+mt):m.framebufferTexture2D(m.DRAW_FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,ht.__webglTexture,j),A!==0?m.blitFramebuffer(xe,be,re,fe,Ne,Ve,re,fe,m.COLOR_BUFFER_BIT,m.NEAREST):Mt?m.copyTexSubImage3D(Qe,j,Ne,Ve,tt+mt,xe,be,re,fe):m.copyTexSubImage2D(Qe,j,Ne,Ve,xe,be,re,fe);ue.bindFramebuffer(m.READ_FRAMEBUFFER,null),ue.bindFramebuffer(m.DRAW_FRAMEBUFFER,null)}else Mt?l.isDataTexture||l.isData3DTexture?m.texSubImage3D(Qe,j,Ne,Ve,tt,re,fe,se,We,Me,Ke.data):M.isCompressedArrayTexture?m.compressedTexSubImage3D(Qe,j,Ne,Ve,tt,re,fe,se,We,Ke.data):m.texSubImage3D(Qe,j,Ne,Ve,tt,re,fe,se,We,Me,Ke):l.isDataTexture?m.texSubImage2D(m.TEXTURE_2D,j,Ne,Ve,re,fe,We,Me,Ke.data):l.isCompressedTexture?m.compressedTexSubImage2D(m.TEXTURE_2D,j,Ne,Ve,Ke.width,Ke.height,We,Ke.data):m.texSubImage2D(m.TEXTURE_2D,j,Ne,Ve,re,fe,We,Me,Ke);m.pixelStorei(m.UNPACK_ROW_LENGTH,Fe),m.pixelStorei(m.UNPACK_IMAGE_HEIGHT,Et),m.pixelStorei(m.UNPACK_SKIP_PIXELS,Xt),m.pixelStorei(m.UNPACK_SKIP_ROWS,St),m.pixelStorei(m.UNPACK_SKIP_IMAGES,an),j===0&&M.generateMipmaps&&m.generateMipmap(Qe),ue.unbindTexture()},this.initRenderTarget=function(l){pe.get(l).__webglFramebuffer===void 0&&ye.setupRenderTarget(l)},this.initTexture=function(l){l.isCubeTexture?ye.setTextureCube(l,0):l.isData3DTexture?ye.setTexture3D(l,0):l.isDataArrayTexture||l.isCompressedArrayTexture?ye.setTexture2DArray(l,0):ye.setTexture2D(l,0),ue.unbindTexture()},this.resetState=function(){C=0,I=0,k=null,ue.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;const t=this.getContext();t.drawingBufferColorSpace=at._getDrawingBufferColorSpace(n),t.unpackColorSpace=at._getUnpackColorSpace()}}const Da={type:"change"},hi={type:"start"},cr={type:"end"},En=new Ho,La=new Ga,Rd=Math.cos(70*nr.DEG2RAD),rt=new Ce,_t=2*Math.PI,ze={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},qn=1e-6;class Wd extends Bo{constructor(n,t=null){super(n,t),this.state=ze.NONE,this.target=new Ce,this.cursor=new Ce,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Qt.ROTATE,MIDDLE:Qt.DOLLY,RIGHT:Qt.PAN},this.touches={ONE:Zt.ROTATE,TWO:Zt.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new Ce,this._lastQuaternion=new ia,this._lastTargetPosition=new Ce,this._quat=new ia().setFromUnitVectors(n.up,new Ce(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new aa,this._sphericalDelta=new aa,this._scale=1,this._panOffset=new Ce,this._rotateStart=new Ye,this._rotateEnd=new Ye,this._rotateDelta=new Ye,this._panStart=new Ye,this._panEnd=new Ye,this._panDelta=new Ye,this._dollyStart=new Ye,this._dollyEnd=new Ye,this._dollyDelta=new Ye,this._dollyDirection=new Ce,this._mouse=new Ye,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Cd.bind(this),this._onPointerDown=bd.bind(this),this._onPointerUp=Pd.bind(this),this._onContextMenu=Nd.bind(this),this._onMouseWheel=Ld.bind(this),this._onKeyDown=Ud.bind(this),this._onTouchStart=yd.bind(this),this._onTouchMove=Id.bind(this),this._onMouseDown=wd.bind(this),this._onMouseMove=Dd.bind(this),this._interceptControlDown=Od.bind(this),this._interceptControlUp=Fd.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(n){super.connect(n),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(n){n.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=n}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Da),this.update(),this.state=ze.NONE}update(n=null){const t=this.object.position;rt.copy(t).sub(this.target),rt.applyQuaternion(this._quat),this._spherical.setFromVector3(rt),this.autoRotate&&this.state===ze.NONE&&this._rotateLeft(this._getAutoRotationAngle(n)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=_t:i>Math.PI&&(i-=_t),s<-Math.PI?s+=_t:s>Math.PI&&(s-=_t),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const u=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=u!=this._spherical.radius}if(rt.setFromSpherical(this._spherical),rt.applyQuaternion(this._quatInverse),t.copy(this.target).add(rt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let u=null;if(this.object.isPerspectiveCamera){const c=rt.length();u=this._clampDistance(c*this._scale);const x=c-u;this.object.position.addScaledVector(this._dollyDirection,x),this.object.updateMatrixWorld(),r=!!x}else if(this.object.isOrthographicCamera){const c=new Ce(this._mouse.x,this._mouse.y,0);c.unproject(this.object);const x=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=x!==this.object.zoom;const E=new Ce(this._mouse.x,this._mouse.y,0);E.unproject(this.object),this.object.position.sub(E).add(c),this.object.updateMatrixWorld(),u=rt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;u!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(u).add(this.object.position):(En.origin.copy(this.object.position),En.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(En.direction))<Rd?this.object.lookAt(this.target):(La.setFromNormalAndCoplanarPoint(this.object.up,this.target),En.intersectPlane(La,this.target))))}else if(this.object.isOrthographicCamera){const u=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),u!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>qn||8*(1-this._lastQuaternion.dot(this.object.quaternion))>qn||this._lastTargetPosition.distanceToSquared(this.target)>qn?(this.dispatchEvent(Da),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(n){return n!==null?_t/60*this.autoRotateSpeed*n:_t/60/60*this.autoRotateSpeed}_getZoomScale(n){const t=Math.abs(n*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(n){this._sphericalDelta.theta-=n}_rotateUp(n){this._sphericalDelta.phi-=n}_panLeft(n,t){rt.setFromMatrixColumn(t,0),rt.multiplyScalar(-n),this._panOffset.add(rt)}_panUp(n,t){this.screenSpacePanning===!0?rt.setFromMatrixColumn(t,1):(rt.setFromMatrixColumn(t,0),rt.crossVectors(this.object.up,rt)),rt.multiplyScalar(n),this._panOffset.add(rt)}_pan(n,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;rt.copy(s).sub(this.target);let r=rt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*n*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(n*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(n){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=n:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(n){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=n:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(n,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=n-i.left,r=t-i.top,u=i.width,c=i.height;this._mouse.x=s/u*2-1,this._mouse.y=-(r/c)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(n){return Math.max(this.minDistance,Math.min(this.maxDistance,n))}_handleMouseDownRotate(n){this._rotateStart.set(n.clientX,n.clientY)}_handleMouseDownDolly(n){this._updateZoomParameters(n.clientX,n.clientX),this._dollyStart.set(n.clientX,n.clientY)}_handleMouseDownPan(n){this._panStart.set(n.clientX,n.clientY)}_handleMouseMoveRotate(n){this._rotateEnd.set(n.clientX,n.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(_t*this._rotateDelta.x/t.clientHeight),this._rotateUp(_t*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(n){this._dollyEnd.set(n.clientX,n.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(n){this._panEnd.set(n.clientX,n.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(n){this._updateZoomParameters(n.clientX,n.clientY),n.deltaY<0?this._dollyIn(this._getZoomScale(n.deltaY)):n.deltaY>0&&this._dollyOut(this._getZoomScale(n.deltaY)),this.update()}_handleKeyDown(n){let t=!1;switch(n.code){case this.keys.UP:n.ctrlKey||n.metaKey||n.shiftKey?this.enableRotate&&this._rotateUp(_t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:n.ctrlKey||n.metaKey||n.shiftKey?this.enableRotate&&this._rotateUp(-_t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:n.ctrlKey||n.metaKey||n.shiftKey?this.enableRotate&&this._rotateLeft(_t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:n.ctrlKey||n.metaKey||n.shiftKey?this.enableRotate&&this._rotateLeft(-_t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(n.preventDefault(),this.update())}_handleTouchStartRotate(n){if(this._pointers.length===1)this._rotateStart.set(n.pageX,n.pageY);else{const t=this._getSecondPointerPosition(n),i=.5*(n.pageX+t.x),s=.5*(n.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(n){if(this._pointers.length===1)this._panStart.set(n.pageX,n.pageY);else{const t=this._getSecondPointerPosition(n),i=.5*(n.pageX+t.x),s=.5*(n.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(n){const t=this._getSecondPointerPosition(n),i=n.pageX-t.x,s=n.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(n){this.enableZoom&&this._handleTouchStartDolly(n),this.enablePan&&this._handleTouchStartPan(n)}_handleTouchStartDollyRotate(n){this.enableZoom&&this._handleTouchStartDolly(n),this.enableRotate&&this._handleTouchStartRotate(n)}_handleTouchMoveRotate(n){if(this._pointers.length==1)this._rotateEnd.set(n.pageX,n.pageY);else{const i=this._getSecondPointerPosition(n),s=.5*(n.pageX+i.x),r=.5*(n.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(_t*this._rotateDelta.x/t.clientHeight),this._rotateUp(_t*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(n){if(this._pointers.length===1)this._panEnd.set(n.pageX,n.pageY);else{const t=this._getSecondPointerPosition(n),i=.5*(n.pageX+t.x),s=.5*(n.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(n){const t=this._getSecondPointerPosition(n),i=n.pageX-t.x,s=n.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const u=(n.pageX+t.x)*.5,c=(n.pageY+t.y)*.5;this._updateZoomParameters(u,c)}_handleTouchMoveDollyPan(n){this.enableZoom&&this._handleTouchMoveDolly(n),this.enablePan&&this._handleTouchMovePan(n)}_handleTouchMoveDollyRotate(n){this.enableZoom&&this._handleTouchMoveDolly(n),this.enableRotate&&this._handleTouchMoveRotate(n)}_addPointer(n){this._pointers.push(n.pointerId)}_removePointer(n){delete this._pointerPositions[n.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==n.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(n){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==n.pointerId)return!0;return!1}_trackPointer(n){let t=this._pointerPositions[n.pointerId];t===void 0&&(t=new Ye,this._pointerPositions[n.pointerId]=t),t.set(n.pageX,n.pageY)}_getSecondPointerPosition(n){const t=n.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(n){const t=n.deltaMode,i={clientX:n.clientX,clientY:n.clientY,deltaY:n.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return n.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function bd(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType==="touch"?this._onTouchStart(e):this._onMouseDown(e)))}function Cd(e){this.enabled!==!1&&(e.pointerType==="touch"?this._onTouchMove(e):this._onMouseMove(e))}function Pd(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(cr),this.state=ze.NONE;break;case 1:const n=this._pointers[0],t=this._pointerPositions[n];this._onTouchStart({pointerId:n,pageX:t.x,pageY:t.y});break}}function wd(e){let n;switch(e.button){case 0:n=this.mouseButtons.LEFT;break;case 1:n=this.mouseButtons.MIDDLE;break;case 2:n=this.mouseButtons.RIGHT;break;default:n=-1}switch(n){case Qt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=ze.DOLLY;break;case Qt.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=ze.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=ze.ROTATE}break;case Qt.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=ze.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=ze.PAN}break;default:this.state=ze.NONE}this.state!==ze.NONE&&this.dispatchEvent(hi)}function Dd(e){switch(this.state){case ze.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case ze.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case ze.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e);break}}function Ld(e){this.enabled===!1||this.enableZoom===!1||this.state!==ze.NONE||(e.preventDefault(),this.dispatchEvent(hi),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(cr))}function Ud(e){this.enabled!==!1&&this._handleKeyDown(e)}function yd(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case Zt.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=ze.TOUCH_ROTATE;break;case Zt.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=ze.TOUCH_PAN;break;default:this.state=ze.NONE}break;case 2:switch(this.touches.TWO){case Zt.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=ze.TOUCH_DOLLY_PAN;break;case Zt.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=ze.TOUCH_DOLLY_ROTATE;break;default:this.state=ze.NONE}break;default:this.state=ze.NONE}this.state!==ze.NONE&&this.dispatchEvent(hi)}function Id(e){switch(this._trackPointer(e),this.state){case ze.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case ze.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case ze.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case ze.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=ze.NONE}}function Nd(e){this.enabled!==!1&&e.preventDefault()}function Od(e){e.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Fd(e){e.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ua=new ui,Sn=new Ce;class Bd extends Go{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const n=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new ra(n,3)),this.setAttribute("uv",new ra(t,2))}applyMatrix4(n){const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(n),i.applyMatrix4(n),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(n){let t;n instanceof Float32Array?t=n:Array.isArray(n)&&(t=new Float32Array(n));const i=new li(t,6,1);return this.setAttribute("instanceStart",new $t(i,3,0)),this.setAttribute("instanceEnd",new $t(i,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(n){let t;n instanceof Float32Array?t=n:Array.isArray(n)&&(t=new Float32Array(n));const i=new li(t,6,1);return this.setAttribute("instanceColorStart",new $t(i,3,0)),this.setAttribute("instanceColorEnd",new $t(i,3,3)),this}fromWireframeGeometry(n){return this.setPositions(n.attributes.position.array),this}fromEdgesGeometry(n){return this.setPositions(n.attributes.position.array),this}fromMesh(n){return this.fromWireframeGeometry(new Vo(n.geometry)),this}fromLineSegments(n){const t=n.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ui);const n=this.attributes.instanceStart,t=this.attributes.instanceEnd;n!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(n),Ua.setFromBufferAttribute(t),this.boundingBox.union(Ua))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ir),this.boundingBox===null&&this.computeBoundingBox();const n=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(n!==void 0&&t!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let s=0;for(let r=0,u=n.count;r<u;r++)Sn.fromBufferAttribute(n,r),s=Math.max(s,i.distanceToSquared(Sn)),Sn.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Sn));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}ne.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Ye(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};vt.line={uniforms:di.merge([ne.common,ne.fog,ne.line]),vertexShader:`
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

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

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

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class Hd extends It{constructor(n){super({type:"LineMaterial",uniforms:di.clone(vt.line.uniforms),vertexShader:vt.line.vertexShader,fragmentShader:vt.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(n)}get color(){return this.uniforms.diffuse.value}set color(n){this.uniforms.diffuse.value=n}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(n){n===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(n){this.uniforms.linewidth&&(this.uniforms.linewidth.value=n)}get dashed(){return"USE_DASH"in this.defines}set dashed(n){n===!0!==this.dashed&&(this.needsUpdate=!0),n===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(n){this.uniforms.dashScale.value=n}get dashSize(){return this.uniforms.dashSize.value}set dashSize(n){this.uniforms.dashSize.value=n}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(n){this.uniforms.dashOffset.value=n}get gapSize(){return this.uniforms.gapSize.value}set gapSize(n){this.uniforms.gapSize.value=n}get opacity(){return this.uniforms.opacity.value}set opacity(n){this.uniforms&&(this.uniforms.opacity.value=n)}get resolution(){return this.uniforms.resolution.value}set resolution(n){this.uniforms.resolution.value.copy(n)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(n){this.defines&&(n===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),n===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Zn=new ot,ya=new Ce,Ia=new Ce,ft=new ot,dt=new ot,Rt=new ot,$n=new Ce,jn=new Jt,ut=new zo,Na=new Ce,Mn=new ui,Tn=new ir,bt=new ot;let Ct,kt;function Oa(e,n,t){return bt.set(0,0,-n,1).applyMatrix4(e.projectionMatrix),bt.multiplyScalar(1/bt.w),bt.x=kt/t.width,bt.y=kt/t.height,bt.applyMatrix4(e.projectionMatrixInverse),bt.multiplyScalar(1/bt.w),Math.abs(Math.max(bt.x,bt.y))}function Gd(e,n){const t=e.matrixWorld,i=e.geometry,s=i.attributes.instanceStart,r=i.attributes.instanceEnd,u=Math.min(i.instanceCount,s.count);for(let c=0,x=u;c<x;c++){ut.start.fromBufferAttribute(s,c),ut.end.fromBufferAttribute(r,c),ut.applyMatrix4(t);const E=new Ce,w=new Ce;Ct.distanceSqToSegment(ut.start,ut.end,w,E),w.distanceTo(E)<kt*.5&&n.push({point:w,pointOnLine:E,distance:Ct.origin.distanceTo(w),object:e,face:null,faceIndex:c,uv:null,uv1:null})}}function Vd(e,n,t){const i=n.projectionMatrix,r=e.material.resolution,u=e.matrixWorld,c=e.geometry,x=c.attributes.instanceStart,E=c.attributes.instanceEnd,w=Math.min(c.instanceCount,x.count),v=-n.near;Ct.at(1,Rt),Rt.w=1,Rt.applyMatrix4(n.matrixWorldInverse),Rt.applyMatrix4(i),Rt.multiplyScalar(1/Rt.w),Rt.x*=r.x/2,Rt.y*=r.y/2,Rt.z=0,$n.copy(Rt),jn.multiplyMatrices(n.matrixWorldInverse,u);for(let S=0,R=w;S<R;S++){if(ft.fromBufferAttribute(x,S),dt.fromBufferAttribute(E,S),ft.w=1,dt.w=1,ft.applyMatrix4(jn),dt.applyMatrix4(jn),ft.z>v&&dt.z>v)continue;if(ft.z>v){const T=ft.z-dt.z,_=(ft.z-v)/T;ft.lerp(dt,_)}else if(dt.z>v){const T=dt.z-ft.z,_=(dt.z-v)/T;dt.lerp(ft,_)}ft.applyMatrix4(i),dt.applyMatrix4(i),ft.multiplyScalar(1/ft.w),dt.multiplyScalar(1/dt.w),ft.x*=r.x/2,ft.y*=r.y/2,dt.x*=r.x/2,dt.y*=r.y/2,ut.start.copy(ft),ut.start.z=0,ut.end.copy(dt),ut.end.z=0;const L=ut.closestPointToPointParameter($n,!0);ut.at(L,Na);const f=nr.lerp(ft.z,dt.z,L),a=f>=-1&&f<=1,D=$n.distanceTo(Na)<kt*.5;if(a&&D){ut.start.fromBufferAttribute(x,S),ut.end.fromBufferAttribute(E,S),ut.start.applyMatrix4(u),ut.end.applyMatrix4(u);const T=new Ce,_=new Ce;Ct.distanceSqToSegment(ut.start,ut.end,_,T),t.push({point:_,pointOnLine:T,distance:Ct.origin.distanceTo(_),object:e,face:null,faceIndex:S,uv:null,uv1:null})}}}class Xd extends Ut{constructor(n=new Bd,t=new Hd({color:Math.random()*16777215})){super(n,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const n=this.geometry,t=n.attributes.instanceStart,i=n.attributes.instanceEnd,s=new Float32Array(2*t.count);for(let u=0,c=0,x=t.count;u<x;u++,c+=2)ya.fromBufferAttribute(t,u),Ia.fromBufferAttribute(i,u),s[c]=c===0?0:s[c-1],s[c+1]=s[c]+ya.distanceTo(Ia);const r=new li(s,2,1);return n.setAttribute("instanceDistanceStart",new $t(r,1,0)),n.setAttribute("instanceDistanceEnd",new $t(r,1,1)),this}raycast(n,t){const i=this.material.worldUnits,s=n.camera;s===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=n.params.Line2!==void 0&&n.params.Line2.threshold||0;Ct=n.ray;const u=this.matrixWorld,c=this.geometry,x=this.material;kt=x.linewidth+r,c.boundingSphere===null&&c.computeBoundingSphere(),Tn.copy(c.boundingSphere).applyMatrix4(u);let E;if(i)E=kt*.5;else{const v=Math.max(s.near,Tn.distanceToPoint(Ct.origin));E=Oa(s,v,x.resolution)}if(Tn.radius+=E,Ct.intersectsSphere(Tn)===!1)return;c.boundingBox===null&&c.computeBoundingBox(),Mn.copy(c.boundingBox).applyMatrix4(u);let w;if(i)w=kt*.5;else{const v=Math.max(s.near,Mn.distanceToPoint(Ct.origin));w=Oa(s,v,x.resolution)}Mn.expandByScalar(w),Ct.intersectsBox(Mn)!==!1&&(i?Gd(this,t):Vd(this,s,t))}onBeforeRender(n){const t=this.material.uniforms;t&&t.resolution&&(n.getViewport(Zn),this.material.uniforms.resolution.value.set(Zn.z,Zn.w))}}export{Bd as L,Wd as O,kd as W,Hd as a,Xd as b};
