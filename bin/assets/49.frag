// @mix-author N3oray

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Constants
const float PI = 3.14159265;
const float TAU = 6.2831853;


// Palette selector (0, 1, 2, etc.)
int paletteType = 1;

// Color palettes
vec3 palette(float t, int type) {
    if (type == 0) {
        // Neon rainbow
        return vec3(0.5 + 0.5*cos(TAU*t + vec3(0.0,2.0,4.0)));
    } else if (type == 1) {
        // Vaporwave
        return vec3(0.7 + 0.3*cos(TAU*t + vec3(0.0,2.5,5.0)));
    } else if (type == 2) {
        // Sunset
        return vec3(0.8+0.2*cos(TAU*t + vec3(0.0,1.0,2.5)));
    } else {
        // Default blue
        return vec3(0.4 + 0.6*cos(TAU*t + vec3(1.0,2.0,3.0)));
    }
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float seed = 2.0;
float random () {
	seed = mod((13821.0 * seed), 32768.0);
	return mod(seed, 2.0)+1.0;
}

void main( void ) {

    // Normalized coordinates, aspect-correct
    vec2 uv = (gl_FragCoord.xy / resolution.xy) - 0.5;
    uv.x *= resolution.x / resolution.y;

	vec2 pixel_pos = gl_FragCoord.xy;
    // Color cycling using palette
    float colorTime = fract(time * 0.075 + uv.x * 0.5 + uv.y * 0.5);

    vec3 color1 = palette(colorTime, 0);

    vec3 color2 = palette(colorTime, 1);

    vec3 color3 = palette(colorTime, 2);


	//vec3 color1 = vec3(0.7, sin(time), 2.25*sin(time));
	//vec3 color2 = vec3(0.25, 0.7, 0.5*cos(time));
	//vec3 color3 = vec3(0.5*sin(time), 0.25, 0.7);
	
	vec3 final_color = vec3(0.05*cos(time), 0.025*cos(time*0.5), 0.05*sin(time));
	for (int i = 0; i < 9; ++i) {
		vec2 center = resolution/2.0 + vec2(sin(0.1 * float(random()) *time * 3.0 + pow(2.0, float(i*2)))*100.0, cos(0.05 * (float(i)-2.0) * time) * 100.0);
		float dist = length(pixel_pos-center);
		float intensity = pow((8.0 + 8.0 * mod(float(i), 2.5))/dist, 2.0);
		
		if (mod(float(i), 5.0) == 0.0)
			final_color += color1 * intensity * rand(gl_FragCoord.xy);
		else if (mod(float(i), 3.0) == 1.0)
			final_color += color2 * intensity * rand(gl_FragCoord.xy);
		else
			final_color += color3 * intensity * rand(gl_FragCoord.xy);
	}
//////////////the sinus..../////
vec2 uPos = ( gl_FragCoord.xy / resolution.xy );//normalize wrt y axis
float sinus=1.0; // SIN on/off  offer = 1.0,2.0,3.0 - OFF = 4.0
	uPos.x -= 1.0;
	uPos.y -= 0.5;
	vec3 color = vec3(0.0);
	float vertColor = 0.0;
	for( float i = 2.0; i < 4.0; ++i )
	{
		float t = time * (1.2);
		uPos.y += (cos( uPos.x*(exp(i+1.1)) - (t+i/2.0) )) * 0.2;
		float fTemp = tan(1.0 / uPos.y / 100.0);
		vertColor += fTemp;
		color += vec3( fTemp*(2.0-i)/10.0, fTemp*i/4.0, pow(fTemp,0.99)*1.2 );
	}
	
	vec4 show_sinus = vec4(color, 1.0);
/////  controls....
	if (sinus == 1.0) // SIN on/off
gl_FragColor = vec4(final_color * abs(sin(time * 0.25) + 1.5), 1)+show_sinus;
	else if (sinus == 2.0)
gl_FragColor = vec4(final_color * abs(sin(time * 0.25) + 1.5), 1);
        else if (sinus == 3.0)
gl_FragColor = vec4(show_sinus); //Sinus_only
	else if (sinus == 4.0)
gl_FragColor = vec4(0.0); //OFF
		
}
