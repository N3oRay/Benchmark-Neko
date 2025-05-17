/*
 * Original shader from: https://www.shadertoy.com/view/3ttcRr
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// Reference
// SDF for raymarching by gaz : https://neort.io/product/bvcrf5s3p9f7gigeevf0

#define resolution iResolution.xy
#define time iTime

#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))
#define TAU atan(1.)*8.
#define sabs(x) sqrt(x*x+1e-2)


vec2 fold(vec2 p, vec2 v) {
    float g = dot(p,v);
    return (p-(g-abs(g))*v)*vec2(sign(g),1);
}

vec2 spmod(vec2 p, float n) {
    float h=floor(log2(n));
    float a = TAU*exp2(h)/n;
    for (int i = 0; i<10;i++) {
        if (i >= int(h)+2) break;
        vec2 v = vec2(-cos(a),sin(a));
        float g = dot(p, v);
        p-=(g-sabs(g))*v;
        a*=0.5;
    }
    return p;
}

float map(vec3 p) {
    p.z+=time*8.;
    p.xy*=rot(time*0.2+length(p.xy)*0.2+p.z*0.2);
    p.xy=spmod(p.xy,3.);
    p.xz=spmod(p.xz,4.);
    p = mod(p, 4.)-2.;
    p=-.7+abs(p);
    
    //if(p.x<p.y)p.xy=p.yx;
    //if(p.x<p.z)p.xz=p.zx;
    //if(p.y<p.z)p.yz=p.zy;
    
    vec2 v = normalize(vec2(2,-1));
    p.xy=fold(p.xy,v);
    p.xz=fold(p.xz,v);
    p.yz=fold(p.yz,v);
    p.xy*=rot(time*.5);
    p.xz*=rot(time*.8);
    
    return (length(p.xy)-.1)*1.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord-.5*resolution)/resolution.y;
    vec3 rd = normalize(vec3(uv,1));
    vec3 p = vec3(0,0,-3);
    float d = 1.,i = 0.;
    for(int ii=0;ii<99;++ii) {
        if (ii>=99||d<=.001) break;
        p+=rd*(d=map(p));
        ++i;
    }
    vec3 col = vec3(.1,0,.4);
    if(d<.001)col+=6./i*vec3(0.0,.7,1.);
    fragColor = vec4(col, 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}