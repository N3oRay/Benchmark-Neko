 #ifdef GL_ES
precision mediump float;
#endif
//gt
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    	vec2 uv;
	//shadertoy deform "relief tunnel"-gt
	// I see a furry object inside of this tunnel, anybody ready and skilled enough to program it ? (I'm not skilled enough for it...)
    	float r = sqrt( dot(p,p) );
    	float a = atan(p.y,p.x) + 0.9*sin(0.5*r-0.5*time);

	float s = 0.5 + 0.5*cos(7.0*a);
    	s = smoothstep(0.0,1.0,s);
    	s = smoothstep(0.0,1.0,s);
    	s = smoothstep(0.0,1.0,s);
    	s = smoothstep(0.0,1.0,s);

    	uv.x = time + 1.0/( r + .2*s);
    	  //uv.y = 3.0*a/3.1416;
	uv.y = 1.0*a/10.1416;

    	float w = (0.5 + 0.5*s)*r*r;

   	// vec3 col = texture2D(tex0,uv).xyz;

    	float ao = 0.5 + 0.5*cos(42.0*a);//amp up the ao-g
    	ao = smoothstep(0.0,0.1,ao)-smoothstep(0.4,0.7,ao);
    	ao = 1.0-0.5*ao*r;
	
	
	//faux shaded texture-gt
	float px = gl_FragCoord.x/resolution.x;
	float py = gl_FragCoord.y/resolution.y;
	float x = mod(uv.x*resolution.x,resolution.x/3.5);
	float y = mod(uv.y*resolution.y+(resolution.y/2.),resolution.y/3.5);
	float v =  (x / y)-.7;
	gl_FragColor = vec4(vec3(.1-v,.9-v,1.-v)*w*ao,1.0);

}