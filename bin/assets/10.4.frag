#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

// Simple 2D noise function
float hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return fract(sin(p.x + p.y) * 43758.5453);
}

float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    st.y = 1.0 - st.y; // invert Y to have fire at the bottom

    float t = time * 0.7;

    // Move up over time to simulate flames
    float n = noise(st * vec2(3.0, 6.0) + vec2(0.0, t));
    n += noise(st * vec2(12.0, 24.0) + vec2(0.0, t*2.0)) * 0.3;

    // Fire shape
    float f = pow(st.y, 1.5);
    float fire = smoothstep(0.3 + 0.2*n, 1.0, f + n*0.4);

    // Color palette: black -> red -> yellow -> white
    vec3 color = mix(vec3(0.1, 0.0, 0.0), vec3(1.0, 0.3, 0.0), fire);
    color = mix(color, vec3(1.0, 1.0, 0.0), pow(fire, 2.0));
    color = mix(color, vec3(1.0), pow(fire, 6.0));

    gl_FragColor = vec4(color, 1.0);
}
