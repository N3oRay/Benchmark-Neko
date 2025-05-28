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
#define CUBENUM 250.0
#define DISTANCEPERPHASE 250.0


// Update for higher precision
#define MAXSTEPS 1024
#define EPSILON 0.001
#define FUZZ 0.5

vec3 glow = vec3(0);
vec3 lastglow = vec3(0.2);
vec3 cubeColor = vec3(0.2);
float ringOffset = +0.5;

// --- N3ORAY SDF Text Section --- //
// Copy your SDF text and gold effect functions here (from your earlier code)
// ... [snip: all your SDF primitives, sdf_N, sdf_3, etc., goldPalette, goldShine, textReveal, etc.] ...
// --- BEGIN N3ORAY SDF+EFFECTS (from previous code) ---

float sdBox2(vec2 p, vec2 b) {    
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
// ... (Other SDF and gold effect functions as before) ...

// --- SDF Primitives ---
float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}
float sdSegment(vec2 p, vec2 a, vec2 b, float w) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
    return length(pa - ba*h) - w;
}

// --- Character SDFs ---
// N
float sdf_N(vec2 p) {
    float left = sdBox(p + vec2(0.07, 0.0), vec2(0.035, 0.17));
    float right = sdBox(p - vec2(0.07, -0.00), vec2(0.025, 0.17));
    float diag = sdSegment(p, vec2(0.07, -0.16), vec2(-0.07, 0.16), 0.01);
    return min(min(left, right), diag);
}

// SDF for arc by angle masking a circle
float arcSDF(vec2 p, vec2 center, float r, float a0, float a1) {
        vec2 d = p - center;
        float ang = atan(d.y, d.x);
        float arcMask = step(a0, ang) * step(ang, a1);
        float circle = length(d) - r;
        // Only keep arc, or use a soft mask
        return mix(1e5, circle, arcMask);
}
// --- Improved SDF for "3" ---
float sdf_3(vec2 p) {
    // Parameters for arcs
    float r = 0.1;
    vec2 topCenter = vec2(-0.02, 0.08);
    vec2 botCenter = vec2(-0.02, -0.08);

    // Angle limits for arcs (in radians)
    float topStart = -2.5, topEnd = 3.0;
    float botStart = -3.0, botEnd = 2.5;

 

    // Top and bottom arcs
    float topArc = arcSDF(p, topCenter, r, topStart, topEnd);
    float botArc = arcSDF(p, botCenter, r, botStart, botEnd);

    // Middle bar (slightly curved for style)
    float t = clamp((p.y + 0.01) / 0.11, 0.0, 1.0);
    float midY = mix(0.062, -0.062, t);
    //float midBar = sdBox(p - vec2(0.022, midY), vec2(0.052, 0.018)); // xpos - largeur - hauteur

    // Join the arcs and bar
	//float d = min(min(topArc, botArc), midBar);
    float d = min(min(topArc, botArc), 1.8);

    // Remove left side to open the "3"
    d = max(d, -sdBox(p + vec2(0.04, 0.0), vec2(0.0, 0.35)));

    return d;
}
// O
float sdf_O(vec2 p) {
    return abs(sdCircle(p, 0.15)) - 0.026;
}
// R
float sdf_R(vec2 p) {
    float stem = sdBox(p + vec2(0.07, 0.0), vec2(0.022, 0.16));
    float bowl = abs(sdCircle(p - vec2(-0.01, 0.08), 0.059)) - 0.024;
    //bowl = min(bowl, (p.y + 0.01));
    float leg = sdSegment(p, vec2(0.0, 0.0), vec2(0.085, -0.16), 0.022);
    return min(min(stem, bowl), leg);
}
// A (improved)
float sdf_A(vec2 p) {
    // Symmetric triangle sides
    float left = sdSegment(p, vec2(-0.085, -0.17), vec2(0.0, 0.16), 0.02);
    float right = sdSegment(p, vec2(0.085, -0.17), vec2(0.0, 0.16), 0.02);
    float bar = sdBox(p - vec2(-0.01, -0.045), vec2(0.045, 0.016));
    // Clip below the bar for a more "A" look
    float base = p.y + 0.16;
    return min(min(left, right), max(bar, -base));
}
// Y
float sdf_Y(vec2 p) {
    float v1 = sdSegment(p, vec2(-0.045, 0.16), vec2(0.0, 0.03), 0.017);
    float v2 = sdSegment(p, vec2(0.045, 0.16), vec2(0.0, 0.03), 0.017);
    float tail = sdSegment(p, vec2(0.0, 0.03), vec2(0.0, -0.16), 0.017);
    return min(min(v1, v2), tail);
}

float textN3ORAY(vec2 uv) {
    float spacing = 0.30;
    float d = 1.0;
    d = min(d, sdf_N(uv + vec2(2.5*spacing, 0.0)));
    d = min(d, sdf_3(uv + vec2(1.5*spacing, 0.0)));
    d = min(d, sdf_O(uv + vec2(0.5*spacing, 0.0)));
    d = min(d, sdf_R(uv - vec2(0.6*spacing, 0.0)));
    d = min(d, sdf_A(uv - vec2(1.5*spacing, 0.0)));
    d = min(d, sdf_Y(uv - vec2(2.5*spacing, 0.0)));
    return d;
}



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

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

mat3 genRotMat(float a0, float x, float y, float z) {
    float a = a0 * PI / 180.0;
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
    float interval = DISTANCEPERPHASE / CUBENUM;
    float zPhase = round(p.z / interval + 0.5) * interval - ringOffset;
    vec3 offset = displacement(zPhase);
    p -= offset;
    float num = mod(floor(p.z / interval) + 1.0, DISTANCEPERPHASE / interval) * 4.0;
    cubeColor = vec3(0.7,0.8,1.0); // Placeholder
    p.z = mod(p.z, interval) - interval * 0.5;
    float angle1 = PHASE*TWOPI*5.0;
    float angle2 = PHASE*TWOPI*18.0;
    mat3 rotationX3 = genRotMat(1.0, 0.1, 0.1, angle1);
    mat3 rotationZ3 = genRotMat(angle2, -angle2, 0.1, angle2);
    mat3 rot = rotationX3 * rotationZ3;
    p = rot * p;
    vec3 d = abs(p) - b;
    float res = length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);
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

// Gold palette with multi-band and environment reflection
vec3 goldPalette(float y, float fx) {
    vec3 gold1 = vec3(1.0, 0.85, 0.25);
    vec3 gold2 = vec3(1.0, 0.78, 0.14);
    vec3 gold3 = vec3(0.98, 0.62, 0.12);
    vec3 gold4 = vec3(0.8, 0.44, 0.07);
    float b1 = smoothstep(0.0, 0.25, y);
    float b2 = smoothstep(0.2, 0.6, y);
    float b3 = smoothstep(0.5, 0.8, y);
    float b4 = smoothstep(0.7, 1.0, y);

    vec3 base = mix(gold4, gold3, b4);
    base = mix(base, gold2, b3);
    base = mix(base, gold1, b1);

    float env = 0.08 * sin(10.0 * y + 4.0 * fx + time*1.7)
              + 0.08 * cos(14.0 * y - 6.0 * fx + time*2.1)
              + 0.12 * sin(time + fx * 1.5 + y * 4.0);
    env += 0.09 * sin(time*2.0 + fx*10.0 + y*7.0);

    base += env * vec3(1.2, 1.0, 0.6);

    return clamp(base, 0.0, 1.0);
}

// Animated shine
float goldShine(vec2 p, float edge, float t) {
    float angle = t*0.5;
    float band_w = 0.12 + 0.05*sin(t*0.7);
    float sweep = (p.x + p.y)*0.5 - 0.22*sin(angle);
    float shine = smoothstep(band_w, band_w-0.018, sweep);
    shine += 0.16*smoothstep(0.014, 0.0, 
        mod(p.x*8.0 + t*2.0, 1.0) * edge
    );
    return shine * edge;
}


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy - iResolution.xy * 0.5)/ iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;

    float aberration = 0.003;
    vec3 color = vec3(0.0);

    glow = vec3(0);
    mainImageInternal(uv - aberration * vec2(1.0, 0.0));
    color.r = glow.r;

    glow = vec3(0);
    mainImageInternal(uv);
    color.g = glow.g;

    glow = vec3(0);
    mainImageInternal(uv + aberration * vec2(1.0, 0.0));
    color.b = glow.b;

    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    // --- BACKGROUND 3D FX --- //
    vec4 baseColor = vec4(0.0);
    mainImage(baseColor, gl_FragCoord.xy);

    // --- N3ORAY SDF TEXT OVERLAY --- //
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.x = (uv.x - 0.5) * resolution.x / resolution.y + 0.5;
    uv = uv * 1.8 - 0.9; // zoom and center

    float d = textN3ORAY(uv);
    float edge = smoothstep(0.024, 0.0, d);

    float y = clamp((uv.y + 0.22) / 0.44, 0.0, 1.0);
    float fx = uv.x;
    vec3 gold = goldPalette(y, fx);

    float shine = goldShine(uv, edge, time);
    gold += shine * vec3(1.2, 1.1, 1.15);

    float sparkle = 0.10 * smoothstep(0.012, 0.0, mod(uv.x*23.0 + uv.y*44.0 + time*6.0, 1.0)) * edge;
    gold += sparkle * vec3(1.3, 1.1, 0.9);

    // Chromatic aberration (rainbow edge) for text
    vec3 aberr = vec3(
        smoothstep(0.025, 0.0, textN3ORAY(uv + vec2(0.002,0.0))),
        smoothstep(0.025, 0.0, textN3ORAY(uv + vec2(-0.002,0.0))),
        smoothstep(0.025, 0.0, textN3ORAY(uv + vec2(0.0,0.002)))
    );
    gold += 0.11 * aberr * edge;

    // Mix overlay text on top of baseColor using edge as alpha
    vec3 final = mix(baseColor.rgb, gold, edge);

    gl_FragColor = vec4(final, 1.0);
}
