// raymarching of http://glsl.heroku.com/e#9722.3

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float  tri( float x ){
	return (abs(fract(x)-0.5)-0.25);
}
vec3 tri( vec3 p ){
	return vec3( tri(p.x), tri(p.y), tri(p.z) );
}

// public domain
#define N 15
#define PI2 (3.14159265*2.0)

float mx = sin(1.32 + time * 0.00037312) * 1.45 + 0.5;
float my = cos(1.01 + time * 0.00023312) * 1.45 + 0.5;

float c1 = cos(my * PI2);
float s1 = sin(my * PI2);
float c2 = cos(mx * PI2);
float s2 = sin(mx * PI2);
/*
	float my2 = cos(1.01 + time * 0.00023312) + 0.5;
	float c3 = cos(my2 * PI2);
	float s3 = sin(my2 * PI2);
*/

float c3 = cos(mouse.x * PI2);
float s3 = sin(mouse.x * PI2);

mat3 rotmat = 
	mat3(
		c1 ,-s1 , 0.0, 
		s1 , c1 , 0.0, 
		0.0, 0.0, 1.0
	) * mat3(
		1.0,0.0, 0.0, 
		0.0,c2 ,-s2 ,
		0.0,s2 , c2 
	) * mat3(
		c3,0.0,-s3,
		0.0, 1.0, 0.0,
		s3, 0.0,c3
	);

float dist( vec3 v ) {
	vec3 vsum = vec3(0.0);
	float zoomed = 1.0;
	
	for ( int i = 0; i < N; i++ ){
		float f = float(i) / float(N);
		float mul =  1.0 + 0.1/(f*f+0.45);
		v *= mul;
		zoomed *= mul;
		
		v += (mouse.y-.5)*1.0;
		v *= rotmat;
		v = tri( v ); // fold // -0.25 <= tri() <= +0.25
	}
	return (v.x+.1) / zoomed;
}


#define M 60
void main(){
	vec3 dir = normalize(vec3( (gl_FragCoord.xy - resolution/2.0) / min(resolution.y,resolution.x) * 2.0, 1.0));
	vec3 pos = vec3(0.0);
	float t = 0.0;
	
	int j = 0;
	for ( int i = 0; i < M; i++ ){
		float d = dist( pos + dir*t );
		if ( i == 0 && d < 0.0 )
			dir = -dir;
		
		if ( abs(d) < 0.0001 ){
			float c = float(M-i) / float(M);
			gl_FragColor = vec4( c*c*1.2, c*1.0, c*c*0.5+abs(0.2/t) , 1.0 );
			return;
		}
		t += d * 1.00;
	}
	
	gl_FragColor = vec4( 0.0, 0.0, abs(0.2/t), 1.0 );

}
