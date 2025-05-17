#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.14159265359;

float circle(vec2 pos, float time, float height, float amplitude, float y){
	float wave = sin(pos.x * PI + time) * amplitude * y;
	wave = wave - pos.y - height * sin(time * 0.1);
	return pow(abs(wave), 0.05) * sign(wave);
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy / resolution) * 2.0 - vec2(1.0, 1.0);
	float y = cos(pos.y * PI * 0.5);
	float value = 1.0;
	float valSign = 1.0;

	for (int i = 1; i < 10; i++) {
		float index = float(i) / 10.0;
		float sinus = circle(pos, time * 0.08 / index, 0.95, 1.0, y);

		if (abs(sinus) < value) {
			valSign = sign(sinus);
		}
		value *= abs(sinus);
	}

	if (valSign < 0.0) {
		value = 1.0 - value;
	}
	

	gl_FragColor = vec4(vec3(value), 1.0 );
}