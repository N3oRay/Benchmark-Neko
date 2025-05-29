#ifdef GL_ES
precision mediump float;
#endif
// dashxdr was here 20120228
// whoops the rainbow colors weren't correct...
// ugh, can't stand the previous version... too dizzy

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Emulate a texture
#define texture(s, uv) vec4(0., 0.2, 0.3, 1.)

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))




const float PI = 3.1415926535897932384626433832795;


float rainbow(float x)
{
	x=fract(0.16666 * abs(x));
	if(x>.5) x = 1.0-x;
	return smoothstep(.166666, .333333, 0.7);
}


void main( void ) {

	vec2 position = ( 2.0*gl_FragCoord.xy - resolution) / resolution.xx;
float ti=time*0.;
	vec3 color = vec3(0.0);

	float r = length(position);
	float a = atan(position.y, position.x);

	float b = a*3.0/3.14159;
	color = vec3(0.0, 0.5, 0.0);

	float t = .5*(1.0 + cos(a + 40.0 * r * (1.0 + sin(a*24.0)*.1) - ti) * (5.0 / (r+5.0)));
	//t = (t<0.5) ? 0.0 : 1.0;
	
	
	// Normalize pixel coordinates to range centered at (0,0)
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;

    // Animate the coordinates using sine and cosine time-based offsets
    uv.x += sin(time + uv.y) * 0.023;
    uv.y += cos(time + uv.x) * 0.037;

    float radius = length(uv); // Distance from center
    float angle = 3.0 * atan(abs(uv.x), uv.y) / PI;

    // Create "tri wings" pattern by modulating width with time
    float wings = radius * (min(angle, abs(angle - 2.0)) - (abs(sin(time * 34.0)) * 0.01 + 0.5));

    // Distance fields for various features
    float seg = min(0.48 - radius, radius - 0.1);    // Segments
    float ring = min(0.485 - radius, radius - 0.45); // Outer ring
    float dot = 0.06 - radius;                       // Inner dot

    // Compose the distance field shapes
    float composed = max(dot, max(ring, min(seg, wings)));

    // Animate "sickness" color and anti-aliasing
    float sickAnim = abs(cos(time * 0.32) + sin(time * 0.5));
    float threshold = 0.003 + sickAnim * 0.1;
    float shape = smoothstep(0.0, threshold, composed);
	
	  // Apply rotation matrix for dynamic effects
	
	gl_FragColor = vec4(color*t, 1.0)+vec4(shape, shape + sickAnim * 0.3, 0.0, rainbow(1.0));

}
