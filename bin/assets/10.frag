/*
 * @mix-author N3oray
 * Original shader from: https://www.shadertoy.com/view/wl2SRK
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate a texture
#define texture(s, uv) vec4(0., 0.2, 0.3, 1.)

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
//quick and dirty code for prototyping


#define MAXDIST 30.0
#define PI 3.1415926535898
#define TWOPI 6.28318530718
#define PHASELENGTH 30.0
#define PHASE mod(iTime/PHASELENGTH,1.0)
#define CUBENUM 100.0
#define DISTANCEPERPHASE 150.0


// Update for higher precision
#define MAXSTEPS 512
#define EPSILON 0.001
#define FUZZ 0.5

vec3 glow = vec3(0);
vec3 lastglow = vec3(0);
vec3 cubeColor = vec3(0);
float ringOffset = +0.6;

mat4 rotationX( in float angle ) {
	return mat4(	1.0,		0,			0,			0,
			 		0, 	cos(angle),	-sin(angle),		0,
					0, 	sin(angle),	 cos(angle),		0,
					0, 			0,			  0, 		1);
}

mat4 rotationY( in float angle ) {
	return mat4(	cos(angle),		0,		sin(angle),	0,
			 				0,		1.0,			 0,	0,
					-sin(angle),	0,		cos(angle),	0,
							0, 		0,				0,	1);
}

mat4 rotationZ( in float angle ) {
	return mat4(	cos(angle),		-sin(angle),	0,	0,
			 		sin(angle),		cos(angle),		0,	0,
							0,				0,		1,	0,
							0,				0,		0,	1);
}

vec3 displacement(float p) {
    p *= 8.0*TWOPI/DISTANCEPERPHASE;
    return vec3(sin(p),cos(p*0.5+PI+PHASE*TWOPI*3.0)*0.37,0)*1.7;
}


//sdf functions taken from iq
float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }


mat3 genRotMat(float a0, float x, float y, float z) {
    float a = a0 * 3.1415926535897932384626433832795 / 180.0;
    float c = cos(a);
    float s = sin(a);
    float t = 1.0 - c;
    return mat3(
        t*x*x + c,     t*x*y - s*z,   t*x*z + s*y,
        t*x*y + s*z,   t*y*y + c,     t*y*z - s*x,
        t*x*z - s*y,   t*y*z + s*x,   t*z*z + c
    );
}



// Signed distance function for a box with displacement, color, and glow effects.
float sdBox(vec3 p, vec3 b) {    
    // Calculate interval size based on constants
    float interval = DISTANCEPERPHASE / CUBENUM;

    // Apply displacement offset to the position
    float zPhase = round(p.z / interval + 0.5) * interval - ringOffset;
    vec3 offset = displacement(zPhase);
    p -= offset;
    
    // Determine cube phase and fetch corresponding color
    float num = mod(floor(p.z / interval) + 1.0, DISTANCEPERPHASE / interval) * 4.0;
    cubeColor = normalize(texture(iChannel0, vec2((num + 0.5) / 256.0, 0.2 / 256.0)).xyz);

    // Wrap Z within interval and center
    p.z = mod(p.z, interval) - interval * 0.5;

    // Apply rotation matrix for dynamic effects
    // Then
    float angle1 = PHASE*TWOPI*5.0;
    float angle2 = PHASE*TWOPI*18.0;

    mat3 rotationX3 = genRotMat(1.0, 0.1, 0.1, angle1);
 
    mat3 rotationZ3 = genRotMat(angle2, -angle2, 0.1, angle2);



    mat3 rot = rotationX3 * rotationZ3;
    p = rot * p;

    // Compute signed distance to box
    vec3 d = abs(p) - b;
    float res = length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);

    // Calculate glow effect
    lastglow = pow(max(0.0, (1.0 - (res / 2.0))), 4.0) * cubeColor * 0.09;
    glow += lastglow;
    
    return res;
}

float sdTube(vec3 p, float r)
{
    p.y += 0.8;
    p -= displacement(p.z);
    return length(p.xy)-r;
}

float sdTube2(vec3 p, float r)
{
    p -= displacement(p.z+1.5 - ringOffset);
    return min(length(p.xy - vec2(0,0.9)),min(length(p.xy + vec2(0.9,0)),length(p.xy- vec2(0.9,0))))-r;
}

float sdTorus( vec3 p, float r1, float r2 )
{
    float interval = DISTANCEPERPHASE/CUBENUM;
    vec3 offset = displacement(round(p.z / interval+0.5)*interval - ringOffset);
    p -= offset;
    p.z = mod(p.z,interval) - interval*0.5;
    return length( vec2(length(p.xy)-r1,p.z) )-r2;
}

float map(vec3 pos)
{
    vec3 p=pos;
    float d0 = sdTube(pos, 0.501);
    float d1 = sdTorus(pos, 0.9, 0.05);
    float d2 = sdTube2(pos,0.05);
    d0 = opSmoothUnion(d0,d1,0.5);
    d0 = opSmoothUnion(d0,d2,0.1);
    d1 = sdBox(pos, vec3(0.05));
    return min(d0,d1);
}

void intersect(vec3 ro, vec3 rd)
{
    float res;
    float d = 0.01;
    for(int i = 0; i < MAXSTEPS; i++)
    {
        vec3 p = ro + rd * d;
        res = map(p);
        if(res < EPSILON * d || res > MAXDIST) {
            break;
        }
        d += res*FUZZ;
    }
    glow += lastglow*6.0;
}

// Move your previous mainImage code to mainImageInternal (internal helper)
void mainImageInternal(vec2 uv)
{
    float fov = 0.22 * PI;
    vec3 origin = vec3(0,0, PHASE*DISTANCEPERPHASE);
    vec3 target = origin -vec3(0.0, 0.001, -0.05);
    target += displacement(target.z*1.0);
    origin += displacement(origin.z*1.0);

    vec3 forward = normalize(target - origin);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));   
    vec3 up = cross(right, forward);
    vec3 dir = normalize(uv.x * right + uv.y * up + fov * forward);

    intersect(origin, dir);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy - iResolution.xy * 0.5)/ iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;

    // Chromatic aberration offsets
    float aberration = 0.003;
    vec3 color = vec3(0.0);

    // March for Red channel (offset left)
    glow = vec3(0);
    mainImageInternal(uv - aberration * vec2(1.0, 0.0));
    color.r = glow.r;

    // March for Green channel (center)
    glow = vec3(0);
    mainImageInternal(uv);
    color.g = glow.g;

    // March for Blue channel (offset right)
    glow = vec3(0);
    mainImageInternal(uv + aberration * vec2(1.0, 0.0));
    color.b = glow.b;

    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //



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
	gl_FragColor += vec4(g,g+sick,0.0,1.0);    // colorise

    mainImage(gl_FragColor, gl_FragCoord.xy);
}
