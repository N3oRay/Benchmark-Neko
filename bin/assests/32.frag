// CBS
// ported from https://www.shadertoy.com/view/lslGWr
// Added some stars: Thanks to http://glsl.heroku.com/e#6904.0

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float x){
    return fract(sin(dot(vec2(x,x) ,vec2(12.9898,78.233))) * 43758.5453);
}
// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
float field(in vec3 p) {
	float strength = 7. + .03 * log(1.e-6 + time);
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	int derp = int(time);
	for (int i = 0; i < 32; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	float maximum = rand(time * 0.0000001);//sin(time)*sin(time);
	return max(maximum, 5. * accum / tw - .7)-maximum;
}

vec3 nrand3( vec2 co )
{
	vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
	vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
	vec3 c = mix(a, b, 0.5);
	return c;
}


void main() {
	vec2 uv = 2. * gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uvs = uv * resolution.xy / max(resolution.x, resolution.y);
	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
	p += .2 * vec3(sin(time / 16.), sin(time / 12.),  sin(time / 128.));
	float t = field(p);
	float v = (1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));
	
	
	//Let's add some stars
	//Thanks to http://glsl.heroku.com/e#6904.0
	vec2 seed = p.xy * 1.2;	
	seed = floor(seed * resolution);
	vec3 rnd = nrand3( seed );
	vec4 starcolor = vec4(pow(rnd.y,40.0));

	gl_FragColor = mix(.4, 1., v) * vec4(1.8 * t * t * t, 1.4 * t * t, t, 1.0)+starcolor;
	
}