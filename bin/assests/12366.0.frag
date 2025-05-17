#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 20

void main( void ) {
	
	vec2 p = surfacePosition*2.0- vec2(15.0);
	vec2 i = p;
	float c = 1.;
	float inten = .05;
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	
	for (int n = 0; n < MAX_ITER; n++ ){
		float t = time /4. * (1. - 5. / float(n+1));
		i = p + dot(vec2( cos(t - i.x) + sin(t + i.y), sin(t * 2. + i.x ) + cos(t + i.y)) , p / 20.);
		c += 1. / length(vec2(p.x / (4. * sin(i.x + t) / inten), p.y / (cos(i.y + t)/inten)));
	}
	c /= float (MAX_ITER);
	c = 1.5 - sqrt (pow(c , 3.));

	float color = 0.0;

	gl_FragColor = vec4( vec3 (pow(c,3.) * pos.y, pow(c,3.) * (1. - pos.y), pow (c,3.) * (sin(pos.x * 5. + sin(time * 2.) * 2.))), 1.0 );

}