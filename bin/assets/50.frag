#ifdef GL_ES
precision mediump float;
#endif

// Posted by Trisomie21 : 2D noise experiment (pan/zoom)

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;
float kPI = acos(0.0);
float kTwoPI = kPI * 2.0;

#define ENABLE_MONTE_CARLO true
vec4 gPixelRandom;
uniform vec2 surfaceSize;
vec3 gRandomNormal;



vec4 textureRND2D(vec2 uv){
	uv = floor(fract(uv)*1e3);
	float v = uv.x+uv.y*1e3;
	return fract(1e5*sin(vec4(v*1e-2, (v+1.)*1e-2, (v+1e3)*1e-2, (v+1e3+1.)*1e-2)));
}

float noise(vec2 p) {
	vec2 f = fract(p*1e3);
	vec4 r = textureRND2D(p);
	f = f*f*(3.0-2.0*f);
	return (mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y));	
}

float cloud(vec2 p) {
	float v = 0.0;
	v += noise(p*1.)*.5000;
	v += noise(p*2.)*.2500;
	v += noise(p*4.)*.1250;
	v += noise(p*8.)*.0625;
	v += noise(p*16.)*.03125;
	return v;
}

vec3 Planet(float t, vec2 p, vec3 c0, vec3 c1, vec3 c2, vec2 e0, vec2 e1, vec2 e2) {
	p = p*.1+.5;
	vec3 c = vec3(.0, .0, .1);
	vec2 d = vec2(t, 0.);
	c = mix(c, c0, pow(cloud(p*.20+d), e0.x)*e0.y);
	c = mix(c, c1, pow(cloud(p.y*p*.1+d), e1.x)*e1.y);
	c = mix(c, c2, pow(cloud(p.y*p*.05+d), e2.x)*e2.y);
	return c;
}

vec3 OrbitPoint( const in float fHeading, const in float fElevation )
{
	return vec3(sin(fHeading) * cos(fElevation), sin(fElevation), cos(fHeading) * cos(fElevation));
}

float hash(vec2 n) { return fract(sin(dot(n, vec2(14.9898,78.233))) * 43758.5453); }


void main( void ) {
	vec2 p = surfacePosition*(sin(time*.2)+1.05)*8.-.5;
	p = p*2.+1.5;
	float rnd = hash(floor(p/4.));
	float i = mod(rnd, sin(0.5*time));
	p = mod(p, 2.)-1.0;
	float d = length(p);
	// Flou effect nuage            3.141592
	//float a = acos(d) - 3.141592 / 2.0;
	float a = acos(d) - kPI;
	// Position définition
	vec2 uv = vec2(a * p.x *0.5/ d, a * p.y *0.5/ d);
	
	
	
	
	
	const float fCamreaInitialHeading = 0.5;
	const float fCamreaInitialElevation = 0.5;
	const float fCamreaInitialDist = 0.1;
	const float fCameraHeight = 0.01;
	const float fOrbitSpeed = 0.5;
	
	// This magic stolen from other 3d pan/zoom examples
	float fZoom = surfaceSize.y * 0.5 + 0.4;
	
	//vec2 vCenterPosition = (0.5 - ( gl_FragCoord.xy / resolution )) * surfaceSize + surfacePosition;
	vec2 vCenterPosition = 0.1* time +1;
	float fHeading = vCenterPosition.x * fOrbitSpeed + fCamreaInitialHeading;
	float fElevation = (vCenterPosition.y * fOrbitSpeed + fCamreaInitialElevation);

	// Définition position de la caméra.
	vec3 vCameraPos = OrbitPoint(fHeading, fElevation) * fCamreaInitialDist * fZoom;
	
	vCameraPos += vec3(0.0, -fCameraHeight, 0.0);
	#ifdef ENABLE_MONTE_CARLO             
	float fDepthOfField = 0.1;
	vCameraPos += gRandomNormal * fDepthOfField;
	#endif


	vec3 c;
	d = max(1.-d*d*d, 0.);
	float t = time*.001;
	if(i < .15)
	c = Planet(t, uv, vec3(.7, .1, .1), vec3(.5, .2, .2), vec3(1., 1., 1.), vec2(3., 2.), vec2(1., 2.), vec2(1.9, 1.2));
	else if(i < .3)
	c = Planet(-t, uv, vec3(.7, .1, .7), vec3(.7, .8, 1.), vec3(1., 0.5, 0.2), vec2(3., 2.), vec2(3., 1.), vec2(1.5, 1.0));
	else if(i < .4)
	c = Planet(-t, uv, vec3(.1, .1, .7), vec3(.2, .2, .5), vec3(1., 1., 1.), vec2(3., 2.), vec2(1., 2.), vec2(1.9, 1.2));
	else if(i < .5)
	c = Planet(-t, uv, vec3(.7, .1, .7), vec3(.7, .8, 1.), vec3(0.7, 0.5, 0.2), vec2(3., 2.), vec2(3., 1.), vec2(1.5, 1.0));
	else if(i < .6)
	c = Planet(-t, uv, vec3(.7, .1, .7), vec3(.2, .2, .5), vec3(0.0, 0.5, 0.2), vec2(3., 2.), vec2(3., 1.), vec2(1.5, 1.0));
		
	gl_FragColor = vec4(c*d, 1.);
}
