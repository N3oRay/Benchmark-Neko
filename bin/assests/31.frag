#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265358979323846264
#define TWOPI 6.28318530717958647692528

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
// noise functions.
// Author : Ian McEwan, Ashima Arts.
// Maintainer : ijm
// Lastmod : 20110822 (ijm)
// License : Copyright (C) 2011 Ashima Arts. All rights reserved.
// Distributed under the MIT License. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  // x0 = x0 - 0.0 + 0.0 * C.xxx;
  // x1 = x0 - i1 + 1.0 * C.xxx;
  // x2 = x0 - i2 + 2.0 * C.xxx;
  // x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy; // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); // mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ ); // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

float clouds( vec3 coord, int octaves ) {

	float n = snoise(coord);
	float d = 1.0;
	for (int i=1; i<32; i++) {
		if (i < octaves) { 
			coord *= 2.0;
			d /= 2.0;
			n += d * snoise(coord);
		}
		else break; // GLSL doesn't seem to like breaks in the if block, but works fine in the else block
	}
	n = clamp((n + 1.) / 2., 0., 1.);
	return n;
}

vec3 rotateFromQuat( vec3 vec, vec4 quat ) {
	return vec + 2.0 * cross( cross( vec, quat.xyz ) + quat.w * vec, quat.xyz );
}

vec3 rotate(vec3 vec, vec3 axis, float angle)
{
	axis = normalize(axis);
	angle *= 0.5;
	float sinAngle = sin(angle);
	vec4 quat = vec4(axis.x * sinAngle, axis.y * sinAngle, axis.z * sinAngle, cos(angle));
	
	return rotateFromQuat(vec, quat);
}

void main( void ) {

	float r = 1.;
	
	vec2 screenPos = 3.0 * ( gl_FragCoord.xy / resolution.xy ) - 1.5;
	screenPos.x *= resolution.x / resolution.y;

	float zz = -(screenPos.x * screenPos.x + screenPos.y * screenPos.y - r * r);
	vec3 spherePos = vec3(screenPos.x, screenPos.y, sqrt(zz));
	
	vec3 lightPos = vec3(2.0, 2.0, 2.0);
	float diffuse_value = max(dot(normalize(spherePos), lightPos), 0.1);
	vec3 lightColor = vec3(0.7, 0.7, 0.9); //earth-like atmosphere turns light slightly blue
	
	vec3 color;
	vec3 cityLights;

	if (zz >= 0.0) {
	
		// Rotate around the planet's axis
		float angle = mod(0.02 * time, TWOPI);
		vec3 oPos = vec3(spherePos);
		spherePos = rotate(spherePos, vec3(-0.1, 1., 0.), angle);
		
		float n = clouds(spherePos, 6); // base noise map
		float d = clouds(spherePos * 0.8, 2); // desert noise
		float m = clouds(vec3(spherePos.x * 1.2, spherePos.y * 2.4, spherePos.z * 1.2), 4); // mountain noise
		float w = clouds(spherePos * 1.6, 2); // fresh water noise
		float f = clouds(spherePos * 2.0, 4); // forest noise
		float detail_l = 0.8 + clouds(spherePos * 4., 4) * 0.2;
		float detail_m = 0.6 + clouds(spherePos * 8., 4) * 0.4;
		float detail_h = 0.2 + clouds(spherePos * 16., 4) * 0.8;
		
		color = vec3(15.0/255.0, 21.0/255.0, 51.0/255.) * detail_l; // add water color with some minor variations
		
		float terrain = smoothstep(0.6, 0.55, n); // block out some terrain
		
		vec3 terrainColor = vec3(26./255., 57./255., 15./255.) * detail_l; // basic green with some minor variations	
		
		// mix in some forests (optional)
		terrainColor = mix(vec3(21./255., 52./255., 10./255.) * detail_l, terrainColor, smoothstep(0.3, 0.6, f)); 
		
		// mix in some deserts (optional)
		terrainColor = mix(vec3(102./255., 97./255., 31./255.) * detail_m, terrainColor, smoothstep(0.3, 0.6, d)); 
		
		// mix in mountains (optional)
		terrainColor = mix(vec3(91.0/255., 71.0/255., 19./255.) * detail_m * detail_h, terrainColor, smoothstep(0.1, .4, m));
		
		// mix in some fresh water bodies (optional)
		terrainColor = mix(vec3(15.0/255.0, 21.0/255.0, 51.0/255.) * detail_l, terrainColor, smoothstep(0.0, .1, w));
		
		// darken edges of land masses (optional)
		//terrainColor = mix(vec3(54./255., 47./255., 31./255.), terrainColor, smoothstep(0.0, 0.2, n)); 
		
		oPos.z += detail_h * detail_m * detail_l;
		float diff = min(dot(normalize(oPos), lightPos), 0.6);
		terrainColor *= diff;
		
		color = mix(terrainColor, color, terrain); // mix terrain with water
		
		//city lights bound by darkness (optional)
		float l = clouds(spherePos * 32., 1);
		l *= step(0.5, clouds(spherePos * 16., 1));
		l *= step(0.5, clouds(spherePos * 4., 1));
		l *= step(0.5, m); // not many cities in high mountains
		l *= step(0.5, w); // no cities in fresh water water
		l *= step(0.5, n);

		cityLights = vec3(240./255.0, 200./255.0, 160./255.) * smoothstep(0.6, 1.0, l);
		cityLights = mix(cityLights, vec3(0., 0., 0.), terrain); // not many cities on the water
		cityLights *= step(0.0, (0.99 - diffuse_value)); // no lights needed on the daylight side of the planet
		
		// Add some dynamic moving cloud formations
		oPos = rotate(spherePos, vec3(0.,0.,-1.), angle * 0.4);
		float c = clouds(oPos * 2., 4);
		
		oPos = rotate(spherePos, vec3(0.,0.,1.), angle * 0.4);
		float c2 = clouds(oPos * 2.2, 4);
		
		float cloud = smoothstep(.8, .1, c * c2);
		vec3 cloudColor = vec3(.5, .5, .5) * detail_l;
		color = mix(cloudColor, color, cloud);
		
		// smooth and darken the edges of the sphere
		color *= smoothstep(0.5, 0.495, length(screenPos) / 2.0);
		color *= smoothstep(0.65, .2, length(screenPos) / 2.0);	
		
	}
	else {
		float s = clouds(spherePos * 1., 3);
		vec3 starField = vec3(0.);
		starField += s;
		//color += starField;
	}
	
	vec3 glow = vec3(smoothstep(0.56, 0.3, length(screenPos) / 2.0)) * vec3(0.6, 0.8, 1.5);
	color += glow * smoothstep(0.49, 0.5, length(screenPos) / 2.0);
	
	// Apply shadowing
	color *= lightColor * diffuse_value;
	
	color += cityLights;
	gl_FragColor = vec4(color, 1.0);

}