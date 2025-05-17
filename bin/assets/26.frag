#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float map(vec3 p) {
	float a = 2.0 - dot(abs(p), vec3(0, 1, 0));
	//a = min(a, 4.0 - dot((p), vec3(0, 0, 1)));
	a = min(a, 5.0 - dot(abs(p), vec3(1, 0, 0)));
	
	a = max(a, (length(mod(p.xz, 2.0) - 1.0) - 0.70));
	a = max(a, (length(mod(p.xy, 2.0) - 1.0) - 0.95));
	a = max(a, (length(mod(p.yz, 2.0) - 1.0) - 0.95));
	
	return a;
}

vec3 getnor(vec3 p) {
	vec2 d = vec2(1.0 / 2560.0, 0.0);
	float a = map(p);
	return normalize(vec3(
		a - map(p + d.xyy),
		a - map(p + d.yxy),
		a - map(p + d.yyx)));
}

void main( void ) {

	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy )  / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(0, 0, time);
	float t = 0.0;
	for(int i = 0 ; i < 35; i++) {
		t += map(dir * t + pos);
	}
	vec3 ip = dir * t + pos;
	vec3 N = getnor(ip);
	float a = time;
	vec3 col = clamp(vec3(0.0), vec3(0.1), vec3(t * 0.002)) * vec3(1, 0.5, 0);
	vec3 kk = vec3(0.1, 0.2, 0.9) * 0.1;
	for(int i = 0 ; i < 20; i++) {
		float rad = 3.0;
		
		vec3 pl = vec3(0, 0, 5) + pos + (vec3(
			sin(a * 0.3) * rad,
			cos(a * 0.9) * rad,
			-sin(a * 0.7) * rad));

		float attr = 1.0 / pow(length(ip - pl), 2.0);
		vec3 L = normalize(ip - pl);
		float D = dot(N, L) * attr;
		
		col += kk * max(0.0, D);
		a += 3.5;
		kk = kk.yzx;
		kk.x += sin(kk.x);
	}
	gl_FragColor = vec4(col, 1.0);
}