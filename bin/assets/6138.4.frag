#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float tick;

float map(vec3 p)
{
    const int MAX_ITER = 15;
    const float BAILOUT=2.0;
    float Power =2.;

    vec3 v = p;
    vec3 c = v;

    float r=0.0;
    float d=1.0;
    for(int n=0; n<MAX_ITER; n++)
    {
        r = length(v);
        float zr = pow(r,Power);
        if(zr/r>BAILOUT) break; // improved

        float theta = atan(v.z/length(v.xy)*tan(mouse.x*1.57))*tan(mouse.y*1.57);
        float phi = atan(v.y, v.x);
        d = pow(r,Power-1.0)*Power*d+1.;

        //theta = theta*2.;
        phi = phi*Power;
        v = (vec3(cos(theta)*cos(phi), sin(phi)*cos(theta), sin(theta))*zr)+c;
    }
    return 0.5*log(r)*r/d;
}


void main( void )
{
    vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
    vec3 camPos = vec3(cos(time*0.3), sin(time*0.3), 1.5);
    vec3 camTarget = vec3(0.0, 0.0, 0.0);

    vec3 camDir = normalize(camTarget-camPos);
    vec3 camUp  = normalize(vec3(0.0, 1.0, 0.0));
    vec3 camSide = cross(camDir, camUp);
    float focus = 1.8;

    vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
    vec3 ray = camPos;
    float m = 0.0;
    float d = 0.0, total_d = 0.0;
    const int MAX_MARCH = 150;
    const float MAX_DISTANCE = 1000.0;
    for(int i=0; i<MAX_MARCH; ++i) {
        d = map(ray);
        total_d += d;
        ray += rayDir * d;
        m += 1.0;
        if(d<0.0002) { break; }
        if(total_d>MAX_DISTANCE) { total_d=MAX_DISTANCE; break; }
    }

    float c = (total_d)*0.0001;
    vec4 result = vec4( 1.0-vec3(c) - vec3(0.025, 0.025, 0.02)*m*0.3, 1.0 );
    gl_FragColor = result;
}
