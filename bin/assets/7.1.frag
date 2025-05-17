#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const float PI = 4.0 * atan(1.0); // So many people hardcode PI by typing out its digits. Why not use THIS instead?
//float PI = 3.0;

void main() {
	vec2 p = gl_FragCoord.xy / vec2(max(resolution.x, resolution.y)) * 0.8;
	float t = time * 0.1;

	float l = 0.0;
	for (float i = 1.0; i < 7.0; i++) {
		p.x += 0.1 / i * cos(i * 8.0 * p.y + t + sin(t / 75.0));
		p.y += 0.1 / i * sin(i * 12.0 * p.x + t + cos(t / 120.0));
		l = length(vec2(0, p.y + sin(p.x * PI * i * ((sin(t / 3.0) + cos(t / 2.0)) * 0.25 + 0.5))));
	}

	float g = 1.0 - pow(l, 0.2);

	vec3 b = vec3(0.0, -1.0, -1.0);
	vec3 a = vec3(1.0, 1.0, 1.0);

	vec3 color = mix(a, b, g);
	gl_FragColor = vec4(color, 1.0);
}