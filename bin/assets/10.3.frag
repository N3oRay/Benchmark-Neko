// 4. Animated Plasma
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    float color = 0.0;
    color += sin(st.x * 10.0 + time);
    color += sin(st.y * 10.0 + time);
    color += sin((st.x + st.y) * 10.0 + time);
    color = color / 3.0;
    gl_FragColor = vec4(vec3(color * 0.5 + 0.5), 1.0);
}
