#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define PI 3.14159

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main(){
	vec2 p = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
	vec2 t = vec2(gl_FragCoord.xy / resolution);
	
	vec3 c = vec3(0);
	
	for(int i = 0; i < 33; i++) {
		float t = 0.4 * PI * float(i) / 30.0 * time * 5.5;
		float x = cos(3.0*t);
		float y = sin(4.0*t);
		vec2 o = 0.40 * vec2(x, y);
		float r = fract(x);
		float g = 1.0 - r;
		c += 0.01 / (length(p-o)) * vec3(r, g, 0.9);
	}
	
	vec2 pos = gl_FragCoord.xy / resolution;
    vec2 st = gl_FragCoord.xy/u_resolution.xy*3.;
    // st += st * abs(sin(u_time*0.1)*3.0);
 

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

    float f = fbm(st+r);

    vec3 color = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.666667,0.666667,0.498039),
                clamp((f*f)*4.0,0.0,1.0));

 

 

    vec4 dbuff =  texture2D(backbuffer, 1.0 - pos) * 0.1;
	
	gl_FragColor =  vec4(c, 0.6)+dbuff;
}
