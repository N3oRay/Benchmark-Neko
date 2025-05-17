 // ref:
// http://blog.hvidtfeldts.net/index.php/2011/11/distance-estimated-3d-fractals-vi-the-mandelbox/


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




void sphereFold(inout vec3 z, inout float dz)
{
    const float fixedRadius2 = 1.0;
    const float minRadius2 = 0.5;
    float r2 = dot(z,z);
    if (r2<minRadius2) { 
        // linear inner scaling
        float temp = (fixedRadius2/minRadius2);
        z *= temp;
        dz*= temp;
    } else if (r2<fixedRadius2) { 
        // this is the actual sphere inversion
        float temp =(fixedRadius2/r2);
        z *= temp;
        dz*= temp;
    }
}
void boxFold(inout vec3 z, inout float dz)
{
    const float foldingLimit = 2.0;
    z = clamp(z, -foldingLimit, foldingLimit) * 2.0 - z;
}
float map(vec3 z)
{
	
    z.z += 1.0;
    float sr = sin(time*0.2);
    float cr = cos(time*0.2);
    mat3 rotz = mat3(
        cr, sr, 0,
        sr,-cr, 0,
         0,  0, 1 );
    mat3 roty = mat3(
      cr, 0, sr,
       0, 1,  0,
     -sr, 0, cr );
    //z = rotz * z;
    z = roty * z;


    float Scale = -3.0 + sin(time)*1.0;
    vec3 offset = z;
    float dr = 1.0;
    for(int n = 0; n<16; n++) {
        boxFold(z,dr);
        sphereFold(z,dr);
        z = Scale*z + offset;
        dr = dr*abs(Scale)+1.0;
    }
    float r = length(z);
    return r/abs(dr);
}

void main( void ) {
	
	vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
	vec3 camPos = vec3(0.0, 0.0, 10.0);
	vec3 camDir = vec3(0.0, 0.0, -1.0);
	vec3 camUp  = vec3(0.0, 1.0, 0.0);
	vec3 camSide = cross(camDir, camUp);
	float focus = 1.8;
	
	vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
	vec3 ray = camPos;
	float m = 0.0;
	float d = 0.0, total_d = 0.0;
	const int MAX_MARCH = 64;
	const float MAX_DISTANCE = 1000.0;
	for(int i=0; i<MAX_MARCH; ++i) {
		d = map(ray);
		total_d += d;
		ray += rayDir * d;
		m += 1.0;
		if(d<0.001) { break; }
		if(total_d>MAX_DISTANCE) { break; }
	}
	
	
	
	float c = (total_d)*0.02;
	gl_FragColor = vec4( vec3(c, c, c*2.0) + vec3(0.01, 0.01, 0.02)*m, 1.0 );

}