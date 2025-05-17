#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution;
	vec2 mPos = resolution.xy * mouse;
	float amnt = 0.5;
	float nd = 0.0;
	vec4 cbuff = vec4(0.0);

	for(float i=0.0; i < 16.0; i += 2.0)
	{
		nd =cos(3.14159 * i * pos.x + (i * 2.75 + cos(time) * 0.25) + time) * (pos.x - 0.5) + 0.5;
		amnt = 1.0 / abs(nd - pos.y) * 0.005; 
		
		cbuff += vec4(amnt, amnt * 0.2 , amnt * pos.y, 2.0);
	}
	
	for(float i=0.0; i < 16.0; i += 2.0)
	{
		nd =cos(3.14159 * i * pos.y + (i * 2.75 + cos(time) * 0.25) + time) * (pos.y - 0.5) + 0.5;
		amnt = 1.0 / abs(nd - pos.x) * 0.005; 
		
		cbuff += vec4(amnt * pos.x, amnt * pos.y , amnt * 0.9, 1.0) * (mod(mPos.x * time, 5.0));
	}
	
	
	vec4 dbuff =  texture2D(backbuffer, 1.0 - pos) * 0.1;
  	gl_FragColor = cbuff + dbuff;
}