#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// a raymarching experiment by kabuto
//fork by tigrou ind (2013.01.22)
//optimized
// turned into neon tubes in fog by psonice

const int MAXITER = 40;

vec3 field(vec3 p) {
	p = abs(fract(p)-.5);
	p *= p;
	return sqrt(p+p.yzx)-.05;
}

void main( void ) {
	vec3 dir = normalize(vec3((gl_FragCoord.xy-resolution*.5)/resolution.x,1.));
	float a = time * 0.2;
	vec3 pos = vec3(0.0,time*0.1,0.0);
	dir *= mat3(1,0,0,0,cos(a),-sin(a),0,sin(a),cos(a));
	dir *= mat3(cos(a),0,-sin(a),0,1,0,sin(a),0,cos(a));
	vec3 color = vec3(0);
	float e = 1.;
	float es = e*.5/float(MAXITER);
	for (int i = 0; i < MAXITER; i++) {
		vec3 f2 = field(pos);
		float f = min(min(f2.x,f2.y),f2.z);
		
		pos += dir*f;
		color += f2*clamp(abs(e)-f, 0., 1.);
		e -= es*f;
	}
	vec3 color3 = vec3(color);//vec3(1.-1./(1.+color*(.09/float(MAXITER*MAXITER))));

	gl_FragColor = vec4(vec3(color3.r+color3.g+color3.b),1.);
	gl_FragColor.rgb = color*color/70.;
}