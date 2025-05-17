#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float primitiveA (vec3 p) {
	return length(p-vec3(3.0*sin (time),0.5,0.0))-1.0;
}
float primitiveC (vec3 p) {
	return length(p-vec3(0.5,3.0*cos (time),0.0))-1.0;
}
float primitiveB (vec3 p) {
	return length(max(abs(p)-vec3(1.0,1.0,1.0),0.0))-0.3;
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float opBlend1( vec3 p ) {
    float d1 = primitiveA(p);
    float d2 = primitiveB(p);
    return smin (d1, d2, 1.0);
}

float opBlend( vec3 p ) {
    float d1 = opBlend1(p);
    float d2 = primitiveC(p);
    return smin (d1, d2, 1.0);
}

float distfunc (vec3 p) {
	const vec3 c = vec3 (10.0,10.0,10.0);
    vec3 q = mod(p,c)-0.5*c;
    return opBlend (q);
}

void main (void)
{
	vec3 cameraOrigin = vec3(4.0*sin(time*0.4), 3.0*sin (time*0.7), 5.0*cos(time*0.4));
	
	const vec3 cameraTarget = vec3(0.0, 0.0, 0.0);
	const vec3 upDirection  = vec3(0.0, 1.0, 0.0);
	
	vec3 cameraDir   = normalize(cameraTarget - cameraOrigin);	
	vec3 cameraRight = normalize(cross(upDirection, cameraOrigin));
	vec3 cameraUp    = cross(cameraDir, cameraRight);
	
	vec2 screenPos = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	screenPos.x *= resolution.x / resolution.y; // Correct aspect ratio	
	vec3 rayDir = normalize(cameraRight * screenPos.x + cameraUp * screenPos.y + cameraDir);
	
	const int MAX_ITER = 32;
	const float MAX_DIST = 20.0;
	const float EPSILON = 0.001;
	
	float totalDist = 0.0;
	vec3 pos = cameraOrigin;
	float dist = EPSILON;
	
	for (int i = 0; i < MAX_ITER; i++)
	{
		if (dist < EPSILON || totalDist > MAX_DIST) break;
	
		dist = distfunc(pos);
		totalDist += dist;
		pos += dist * rayDir;
	}	
	
	if (dist < EPSILON)
	{
		vec2 eps = vec2(0.0, EPSILON);
		
		vec3 normal = normalize(vec3(
			distfunc(pos + eps.yxx) - distfunc(pos - eps.yxx),
			distfunc(pos + eps.xyx) - distfunc(pos - eps.xyx),
			distfunc(pos + eps.xxy) - distfunc(pos - eps.xxy)));
		
		float diffuse = max(0.0, dot(-rayDir, normal));
		float specular = pow(diffuse, 32.0);
		vec3 color = vec3(diffuse + specular) * vec3(0.0,0.8,0.0);
		gl_FragColor = vec4(color, 1.0);
	}
	else
	{
		gl_FragColor = vec4(0.0,0.2,0.0,1.0);
	}
}