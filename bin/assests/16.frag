#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//@jimhejl (7/26/13)
// + camera animation
// + shadow term
// + gamma-correct shading

float hash(float n)
{
	return fract(sin(n)*43758.5453);
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
	
	
	
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

vec4 map(in vec3 p)
{
	float d = 0.2 - p.y;
	vec3 q = p - vec3(1.0, 0.1, 0.0)*time;
	float f;
	f = 0.5 * noise(q); q*=2.02;
	f += 0.25 * noise(q); q *= 2.03;
	f += 0.125 * noise(q); q *= 2.01;
	f += 0.0625 * noise(q);
	d += 3.0*f;
	d = clamp(d,0.0, 1.0);
	vec4 res = vec4(d);
	res.xyz = mix(1.15*vec3(1.0, 0.99, 0.8), vec3(0.5,0.54,0.55), res.x);
	return res;
}


vec3 sundir = vec3(-1.0,0.5,1.0);

vec4 raymarch(in vec3 ro, in vec3 rd)
{
	bool bShadow = true;
	vec4 sum = vec4(0,0,0,0);
	float t = 0.0;
	for (int i=0; i < 64; i++)
	{
		if (sum.a > 0.99) continue;
		vec3 pos = ro + t*rd;
		vec4 col = map(pos);
		col.r = pow(col.r,2.2);
		col.g = pow(col.g,2.2);
		col.b = pow(col.b,2.2);
		
		if (bShadow)
		{
			float dif = clamp((col.w - map(pos+0.8*sundir).w)/0.7, 0.0, 1.0);			
			vec3 lin = vec3(0.65,0.68,0.7)*1.35 + 0.45*vec3(0.7, 0.5, 0.3)*dif;
			col.xyz *= (lin);
		}
		
		col.a *= 0.35;
		col.rgb *= col.a;
		
		sum = sum + col*(1.0 - sum.a);
		t += max(0.1, 0.025*t);
	}
	
	sum.xyz /= (0.001 + sum.w);
	sum.r = pow(sum.r,.4545);
	sum.g = pow(sum.g,.4545);
	sum.b = pow(sum.b,.4545);
	return clamp(sum, 0.0, 1.0);
	
}

void main( void ) {
	
	vec2 q = gl_FragCoord.xy / resolution.xy;
	vec2 p = -1.0 + 2.0*q;
	p.x *= resolution.x / resolution.y;
	vec2 mo = -1.0 + 2.0*mouse.xy / resolution.xy;
	
	//camera
	
	vec3 ro = mix(6.0,3.0,cos(mod(time*0.15,2.0)-1.0))*normalize(vec3(cos(2.75 - 3.0*mo.x), 0.7+(mo.y+1.0), sin(2.75-3.0*mo.x)));
	vec3 ta = normalize(vec3(-0.15,0.4,0.1));
	vec3 ww = normalize(ta - ro);
	vec3 uu = normalize(cross(vec3(-0.15,0.4,0.1), ww));
	vec3 vv = normalize(cross(ww,uu));
				
	vec3 rd = normalize(p.x*uu + p.y*vv + 1.5*ww);
	
	vec4 res = raymarch(ro, rd);
	
	float sun = clamp(dot(sundir, rd), 0.0, 1.0);			
				
	vec3 col = vec3(0.5, 0.71, 0.75) - rd.y*0.2*vec3(1.0,0.5,1.0)+0.15*0.5;
	
	col += 0.2*vec3(0.5,0.71,0.75)*pow(sun,8.0);
	col *= 0.95;
	col = mix(col, res.xyz, res.w);
	
	
	col += 0.1*vec3(1.0, 0.4, 0.2)*pow(sun, 3.0);
	
	gl_FragColor = vec4( col ,1.0);
}