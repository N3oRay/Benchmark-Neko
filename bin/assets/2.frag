#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Source edited by David Hoskins - 2013.

// I took and completed this http://glsl.heroku.com/e#9743.20 - just for fun! 8|
// Locations in 3x7 font grid, inspired by http://www.claudiocc.com/the-1k-notebook-part-i/
// Had to edit it to remove line doubling.
// ABC  a:GIOMJL b:AMOIG c:IGMO d:COMGI e:OMGILJ f:CBN g:OMGIUS h:AMGIO i:EEHN j:GHTS k:AMIKO l:BN m:MGHNHIO n:MGIO
// DEF  o:GIOMG p:SGIOM q:UIGMO r:MGI s:IGJLOM t:BNO u:GMOI v:GJNLI w:GMNHNOI x:GOKMI y:GMOIUS z:GIMO
// GHI
// JKL 
// MNO
// PQR
// STU


#define font_size 20. 
#define font_spacing .05
#define STROKEWIDTH 0.05
#define PI 3.14159265359

#define A_ vec2(0.,0.)
#define B_ vec2(1.,0.)
#define C_ vec2(2.,0.)

#define D_ vec2(0.,1.)
#define E_ vec2(1.,1.)
#define F_ vec2(2.,1.)

#define G_ vec2(0.,2.)
#define H_ vec2(1.,2.)
#define I_ vec2(2.,2.)

#define J_ vec2(0.,3.)
#define K_ vec2(1.,3.)
#define L_ vec2(2.,3.)

#define M_ vec2(0.,4.)
#define N_ vec2(1.,4.)
#define O_ vec2(2.,4.)

#define P_ vec2(0.,5.)
#define Q_ vec2(1.,5.)
#define R_ vec2(1.,5.)

#define S_ vec2(0.,6.)
#define T_ vec2(1.,6.)
#define U_ vec2(2.0,6.)

#define A(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,J_,p) + t(J_,L_,p)
#define B(p) t(A_,M_,p) + t(M_,O_,p) + t(O_,I_, p) + t(I_,G_,p)
#define C(p) t(I_,G_,p) + t(G_,M_,p) + t(M_,O_,p) 
#define D(p) t(C_,O_,p) + t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p)
#define E(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,L_,p) + t(L_,J_,p)
#define F(p) t(C_,B_,p) + t(B_,N_,p) + t(G_,I_,p)
#define G(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,U_,p) + t(U_,S_,p)
#define H(p) t(A_,M_,p) + t(G_,I_,p) + t(I_,O_,p) 
#define I(p) t(E_,E_,p) + t(H_,N_,p) 
#define J(p) t(E_,E_,p) + t(H_,T_,p) + t(T_,S_,p)
#define K(p) t(A_,M_,p) + t(M_,I_,p) + t(K_,O_,p)
#define L(p) t(B_,N_,p)
#define M(p) t(M_,G_,p) + t(G_,I_,p) + t(H_,N_,p) + t(I_,O_,p)
#define N(p) t(M_,G_,p) + t(G_,I_,p) + t(I_,O_,p)
#define O(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,G_,p)
#define P(p) t(S_,G_,p) + t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p)
#define Q(p) t(U_,I_,p) + t(I_,G_,p) + t(G_,M_,p) + t(M_,O_, p)
#define R(p) t(M_,G_,p) + t(G_,I_,p)
#define S(p) t(I_,G_,p) + t(G_,J_,p) + t(J_,L_,p) + t(L_,O_,p) + t(O_,M_,p)
#define T(p) t(B_,N_,p) + t(N_,O_,p) + t(G_,I_,p)
#define U(p) t(G_,M_,p) + t(M_,O_,p) + t(O_,I_,p)
#define V(p) t(G_,J_,p) + t(J_,N_,p) + t(N_,L_,p) + t(L_,I_,p)
#define W(p) t(G_,M_,p) + t(M_,O_,p) + t(N_,H_,p) + t(O_,I_,p)
#define X(p) t(G_,O_,p) + t(I_,M_,p)
#define Y(p) t(G_,M_,p) + t(M_,O_,p) + t(I_,U_,p) + t(U_,S_,p)
#define Z(p) t(G_,I_,p) + t(I_,M_,p) + t(M_,O_,p)
#define STOP(p) t(N_,N_,p)
	
vec2 caret_origin = vec2(3.0, .7);
vec2 caret;
//float time = mod(iGlobalTime, 11.0);

//-----------------------------------------------------------------------------------
float minimum_distance(vec2 v, vec2 w, vec2 p)
{	// Return minimum distance between line segment vw and point p
  	float l2 = (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y); //length_squared(v, w);  // i.e. |w-v|^2 -  avoid a sqrt
  	if (l2 == 0.0) {
		return distance(p, v);   // v == w case
	}
	
	// Consider the line extending the segment, parameterized as v + t (w - v).
  	// We find projection of point p onto the line.  It falls where t = [(p-v) . (w-v)] / |w-v|^2
  	float t = dot(p - v, w - v) / l2;
  	if(t < 0.0) {
		// Beyond the 'v' end of the segment
		return distance(p, v);
	} else if (t > 1.0) {
		return distance(p, w);  // Beyond the 'w' end of the segment
	}
  	vec2 projection = v + t * (w - v);  // Projection falls on the segment
	return distance(p, projection);
}

//-----------------------------------------------------------------------------------
float textColor(vec2 from, vec2 to, vec2 p)
{
	p *= font_size;
	float inkNess = 0., nearLine, corner;
	nearLine = minimum_distance(from,to,p); // basic distance from segment, thanks http://glsl.heroku.com/e#6140.0
	inkNess += smoothstep(0., 1., 1.- 14.*(nearLine - STROKEWIDTH)); // ugly still
	inkNess += smoothstep(0., 2.5, 1.- (nearLine  + 5. * STROKEWIDTH)); // glow
	return inkNess;
}

//-----------------------------------------------------------------------------------
vec2 grid(vec2 letterspace) 
{
	return ( vec2( (letterspace.x / 2.) * .65 , 1.0-((letterspace.y / 2.) * .95) ));
}

//-----------------------------------------------------------------------------------
float count = 0.0;
float t(vec2 from, vec2 to, vec2 p) 
{
	count++;
	if (count > time*20.0) return 0.0;
	return textColor(grid(from), grid(to), p);
}

//-----------------------------------------------------------------------------------
vec2 r()
{
	vec2 pos = gl_FragCoord.xy/resolution.xy;
	pos.y -= caret.y;
	pos.x -= font_spacing*caret.x;
	return pos;
}

//-----------------------------------------------------------------------------------
void add()
{
	caret.x += 1.0;
}

//-----------------------------------------------------------------------------------
void space()
{
	caret.x += 1.5;
}

//-----------------------------------------------------------------------------------
void newline()
{
	caret.x = caret_origin.x;
	caret.y -= .18;
}

//-----------------------------------------------------------------------------------
void main(void)
{
	float d = 0.;
	vec3 col = vec3(0.1, .07+0.07*(.5+sin(gl_FragCoord.y*3.14159*1.1+time*2.0)) + sin(gl_FragCoord.y*.01+time+2.5)*0.05, 0.1);
	
	caret = caret_origin;

	
	float thank, you, thank2, you2 = 0.0;
	// the quick brown fox jumps over the lazy dog...
	thank += T(r()); add(); thank += H(r()); add(); thank += A(r()); add(); thank += N(r()); add(); thank += K(r()); space();
        you += Y(r()); add(); you += O(r()); add(); you += U(r());
	newline();
	thank2 += T(r()); add(); thank2 += H(r()); add(); thank2 += A(r()); add(); thank2 += N(r()); add(); thank2 += K(r()); space();
        you2 += Y(r()); add(); you2 += O(r()); add(); you2 += U(r());

	d = mix(thank, you, sin(time * 4.2));

	d += mix(you2, thank2, sin(time * 4.2));
	
        col += vec3(d*.5, d, d*.85*(0.5+0.5*sin(time*4.0)));
  	vec2 xy = gl_FragCoord.xy / resolution.xy;
	col *= vec3(.4, .4, .3) + 0.5*pow(100.0*xy.x*xy.y*(1.0-xy.x)*(1.0-xy.y), .4 );	
	
	
		float v,t=v=.001;
	for (float s=.0; s<2.; s+=.01) {
		vec3 p=s*gl_FragCoord.xyz*t+vec3(.1,.2,fract(s+floor(time*25.)*.01));
		for (int i=0; i<8; i++) p=abs(p)/dot(p,p)-.8;
		v+=dot(p,p)*t;
	}
	
    gl_FragColor = vec4( col + vec3(v,v,v * 2.1), 1.0 );
}
