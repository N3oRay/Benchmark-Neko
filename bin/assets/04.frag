// GLSL Fragment Shader with comments for clarity
#ifdef GL_ES
precision mediump float;
#endif

// Uniform variables passed in from the host program
uniform float time;         // animation time in seconds
uniform vec2 mouse;         // normalized mouse coordinates
uniform vec2 resolution;    // viewport resolution (width, height)

// --------------------------------------------------------------------
// srtuss, 2013
//
// Collecting some design ideas for a new game project.
// No raymarching is used in this shader, it's based on analytic geometry.
//---------------------------------------------------------------------

//#define GREEN_VERSION   // Uncomment to use the green color preset

//---------------------------------------------------------------------
// Utility Functions
//---------------------------------------------------------------------

// 2D rotation by angle 'a' in radians
vec2 rotate(vec2 p, float a)
{
    return vec2(
        p.x * cos(a) - p.y * sin(a),
        p.x * sin(a) + p.y * cos(a)
    );
}

// Compute signed distance to a rounded box at 'p' with half-size 'b' and round radius 'r'
float box(vec2 p, vec2 b, float r)
{
    return length(max(abs(p) - b, 0.0)) - r;
}

// Ray-plane intersection: returns (t, u, v) for intersection of ray (o, d) with plane (center c, spanning vectors u, v)
vec3 intersect(in vec3 o, in vec3 d, vec3 c, vec3 u, vec3 v)
{
    vec3 q = o - c;
    return vec3(
        dot(cross(u, v), q),
        dot(cross(q, u), d),
        dot(cross(v, q), d)
    ) / dot(cross(v, u), d);
}

//---------------------------------------------------------------------
// Noise and Random Functions
//---------------------------------------------------------------------

// Fast 1D random
float rand11(float p)
{
    return fract(sin(p * 591.32) * 43758.5357);
}

// Fast 2D random
float rand12(vec2 p)
{
    return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5357);
}

// 1D to 2D random
vec2 rand21(float p)
{
    return fract(vec2(sin(p * 591.32), cos(p * 391.32)));
}

// 2D to 2D random
vec2 rand22(in vec2 p)
{
    return fract(vec2(
        sin(p.x * 591.32 + p.y * 154.077),
        cos(p.x * 391.32 + p.y * 49.077)
    ));
}

// 1D value noise
float noise11(float p)
{
    float fl = floor(p);
    return mix(rand11(fl), rand11(fl + 1.0), fract(p));
}

// Fractal brownian motion (fBm), 1D
float fbm11(float p)
{
    return noise11(p) * 0.5 +
           noise11(p * 2.0) * 0.25 +
           noise11(p * 5.0) * 0.125;
}

// 1D "noise" as a 3D vector (for camera shake etc)
vec3 noise31(float p)
{
    return vec3(
        noise11(p),
        noise11(p + 18.952),
        noise11(p - 11.372)
    ) * 2.0 - 1.0;
}

//---------------------------------------------------------------------
// Godrays-like effect for the sky
//---------------------------------------------------------------------
float sky(vec3 p)
{
    float a = atan(p.x, p.z);
    float t = time * 0.1;
    float v = rand11(floor(a * 4.0 + t)) * 0.5 +
              rand11(floor(a * 8.0 - t)) * 0.25 +
              rand11(floor(a * 16.0 + t)) * 0.125;
    return v;
}

//---------------------------------------------------------------------
// Voronoi (cellular) noise for floor patterning
//---------------------------------------------------------------------
vec3 voronoi(in vec2 x)
{
    vec2 n = floor(x); // grid cell id
    vec2 f = fract(x); // position within cell
    vec2 mg; // closest cell center offset
    vec2 mr; // second
	float md = 8.0, md2 = 8.0;
	for(int j = -1; j <= 1; j ++)
	{
		for(int i = -1; i <= 1; i ++)
		{
			vec2 g = vec2(float(i), float(j)); // cell id
			vec2 o = rand22(n + g); // offset to edge point
			vec2 r = g + o - f;
			
			float d = max(abs(r.x), abs(r.y)); // distance to the edge
			
			if(d < md)
				{md2 = md; md = d; mr = r; mg = g;}
			else if(d < md2)
				{md2 = d;}
		}
	}
	return vec3(n + mg, md2 - md);
}

#define A2V(a) vec2(sin((a) * 6.28318531 / 100.0), cos((a) * 6.28318531 / 100.0))

float circles(vec2 p)
{
	float v, w, l, c;
	vec2 pp;
	l = length(p);
	
	
	pp = rotate(p, time * 3.0);
	c = max(dot(pp, normalize(vec2(-0.2, 0.5))), -dot(pp, normalize(vec2(0.2, 0.5))));
	c = min(c, max(dot(pp, normalize(vec2(0.5, -0.5))), -dot(pp, normalize(vec2(0.2, -0.5)))));
	c = min(c, max(dot(pp, normalize(vec2(0.3, 0.5))), -dot(pp, normalize(vec2(0.2, 0.5)))));
	
	// innerest stuff
	v = abs(l - 0.5) - 0.03;
	v = max(v, -c);
	v = min(v, abs(l - 0.54) - 0.02);
	v = min(v, abs(l - 0.64) - 0.05);
	
	pp = rotate(p, time * -1.333);
	c = max(dot(pp, A2V(-5.0)), -dot(pp, A2V(5.0)));
	c = min(c, max(dot(pp, A2V(25.0 - 5.0)), -dot(pp, A2V(25.0 + 5.0))));
	c = min(c, max(dot(pp, A2V(50.0 - 5.0)), -dot(pp, A2V(50.0 + 5.0))));
	c = min(c, max(dot(pp, A2V(75.0 - 5.0)), -dot(pp, A2V(75.0 + 5.0))));
	
	w = abs(l - 0.83) - 0.09;
	v = min(v, max(w, c));
	
	return v;
}

float shade1(float d)
{
	float v = 1.0 - smoothstep(0.0, mix(0.012, 0.2, 0.0), d);
	float g = exp(d * -20.0);
	return v + g * 0.5;
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = uv * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	
	// using an iq styled camera this time :)
	// ray origin
	vec3 ro = 0.7 * vec3(cos(0.2 * time), 0.0, sin(0.2 * time));
	ro.y = cos(0.6 * time) * 0.3 + 0.65;
	// camera look at
	vec3 ta = vec3(0.0, 0.2, 0.0);
	
	// camera shake intensity
	float shake = clamp(3.0 * (1.0 - length(ro.yz)), 0.3, 1.0);
	float st = mod(time, 10.0) * 143.0;
	
	// build camera matrix
	vec3 ww = normalize(ta - ro + noise31(st) * shake * 0.01);
	vec3 uu = normalize(cross(ww, normalize(vec3(0.0, 1.0, 0.2 * sin(time)))));
	vec3 vv = normalize(cross(uu, ww));
	// obtain ray direction
	vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.0 * ww);
	
	// shaking and movement
	ro += noise31(-st) * shake * 0.015;
	ro.x += time * 2.0;
	
	float inten = 0.0;
	
	// background
	float sd = dot(rd, vec3(0.0, 1.0, 0.0));
	inten = pow(1.0 - abs(sd), 20.0) + pow(sky(rd), 5.0) * step(0.0, rd.y) * 0.2;
	
	vec3 its;
	float v, g;
	
	// voronoi floor layers
	for(int i = 0; i < 4; i ++)
	{
		float layer = float(i);
		its = intersect(ro, rd, vec3(0.0, -5.0 - layer * 5.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0));
		if(its.x > 0.0)
		{
			vec3 vo = voronoi((its.yz) * 0.05 + 8.0 * rand21(float(i)));
			v = exp(-100.0 * (vo.z - 0.02));
			
			float fx = 0.0;
			
			// add some special fx to lowest layer
			if(i == 3)
			{
				float crd = 0.0;//fract(time * 0.2) * 50.0 - 25.0;
				float fxi = cos(vo.x * 0.2 + time * 1.5);//abs(crd - vo.x);
				fx = clamp(smoothstep(0.9, 1.0, fxi), 0.0, 0.9) * 1.0 * rand12(vo.xy);
				fx *= exp(-3.0 * vo.z) * 2.0;
			}
			inten += v * 0.1 + fx;
		}
	}
	
	// draw the gates, 10 should be enough
	float gatex = floor(ro.x / 8.0 + 0.5) * 8.0 + 4.0;
	float go = -16.0;
	for(int i = 0; i < 10; i ++)
	{
		its = intersect(ro, rd, vec3(gatex + go, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0));
		if(dot(its.yz, its.yz) < 2.0 && its.x > 0.0)
		{
			v = circles(its.yz);
			inten += shade1(v);
		}
		
		go += 8.0;
	}
	
	// draw the stream
	for(int j = 0; j < 40; j ++)
	{
		float id = float(j);
		
		vec3 bp = vec3(0.0, (rand11(id) * 2.0 - 1.0) * 0.25, 0.0);
		vec3 its = intersect(ro, rd, bp, vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0));
		
		if(its.x > 0.0)
		{
			vec2 pp = its.yz;
			float spd = (1.0 + rand11(id) * 3.0) * 2.5;
			pp.y += time * spd;
			pp += (rand21(id) * 2.0 - 1.0) * vec2(0.3, 1.0);
			float rep = rand11(id) + 1.5;
			pp.y = mod(pp.y, rep * 2.0) - rep;
			float d = box(pp, vec2(0.02, 0.3), 0.1);
			float foc = 0.0;
			float v = 1.0 - smoothstep(0.0, 0.03, abs(d) - 0.001);
			float g = min(exp(d * -20.0), 2.0);
			
			inten += (v + g * 0.7) * 0.5;
			
		}
	}
	
	inten *= 0.4 + (sin(time) * 0.5 + 0.5) * 0.6;
	
	// find a color for the computed intensity
#ifdef GREEN_VERSION
	vec3 col = pow(vec3(inten), vec3(2.0, 0.15, 9.0));
#else
	vec3 col = pow(vec3(inten), 1.5 * vec3(0.15, 2.0, 9.0));
#endif
	
	gl_FragColor = vec4(col, 1.0);
}
