// Original by @N3oray, reworked for clarity & structure

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

const float PI = 3.1415926535897932384626433832795;

// Doing the smoothstep... :)
// Lets redo via more obvious distance field approach

// The sickenss sets in.

void main(void)
{
	vec2 pos = vec2(gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	pos.x += sin(time+pos.y)*.023;
	pos.y += cos(time+pos.x)*.037;
	float rad = length(pos);
	float angle = 3.0*atan(abs(pos.x), pos.y)/PI;
	float w = rad*(min(angle,abs(angle-2.0))-(abs(sin(time*34.0))*.01+.5)); // tri wings
	float s = min(0.48-rad, rad-0.1);    // segments
	float r = min(0.485-rad, rad-0.45);  // outer ring
	float i = 0.06-rad;                  // inner dot
	float d = max(i, max(r, min(s,w)));  // compose distance functions
	float sick = abs(cos(time*.32)+sin(time*.5));
	float g = smoothstep(0.0, 0.003+sick*.1, d); // threshold/aa
	
	sick *= .3;
	gl_FragColor = vec4(g,g+sick,0.0,1.0);    // colorise
}
