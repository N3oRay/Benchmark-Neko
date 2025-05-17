#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution


mat2 rotate2D (float rad)
{
    float c = cos (rad);
    float s = sin (rad);
    return mat2 (c, s, -s, c);
}


void yonatansFractal (float t, vec2 FC, vec2 r, inout vec3 o)
{
    float g=0., e, s, k = t*.1;
    for(float i=0.; i < 59.;++i) {
        vec3 p = vec3(g*(FC.xy - .5*r)/r.y + .5,g - 1.);
        p.xz *= rotate2D(k);
        s = 3.;
        for(int i=0; i < 4; ++i ) {
            s *= e = max(1.,(8.-8.*cos(k))/dot(p,p));
            p = vec3(2,4,2) - abs(abs(p)*e - vec3(4,4,2) );
        }
        g += min(length(p.xz), p.y)/s;
        o.rg += (s/5. + .5, 11.3, s/1e5);
    }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime + 20.;   // offset the time thus the thumbnail looks not empty
    vec2 FC = fragCoord;     // pixel-coordinates
    vec3 o = vec3 (.0);      // rgb-output color
    vec2 r = iResolution.xy; // resolution for point/ray-generation

    yonatansFractal(t, FC, r, o);

    fragColor = vec4(o, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}