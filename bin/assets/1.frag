// Original by @N3oray, reworked for clarity & structure

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

void main(void) {
    // Normalized coordinates, aspect-correct
    vec2 uv = (gl_FragCoord.xy / resolution.xy) - 0.5;
    uv.x *= resolution.x / resolution.y;

    // Dynamic wave pattern
    float t = time * 0.4;
    float wave1 = sin((uv.x + t) * 6.0 + cos(t) * 2.5) * 0.25;
    float wave2 = cos((uv.x - t * 1.2) * 8.0 + sin(t*1.1) * 4.0) * 0.15;
    float combined = wave1 + wave2;

    // Glow effect
    float glow = 1.0 / (30.0 * abs(uv.y - combined) + 0.1);

    // Starfield effect (pseudo-random, time scrolling)
    float stars = smoothstep(0.995, 1.0, fract(sin(dot(uv * 50.0, vec2(12.9898,78.233))) * 43758.5453 + time * 0.2));

    // Color cycling using palette
    float colorTime = fract(time * 0.075 + uv.x * 0.5 + uv.y * 0.5);
    vec3 baseColor = palette(colorTime, paletteType);

    // Progress tempo bar (bottom of screen)
    float progress = fract(time * 0.2);
    float barY = uv.y + 0.5;
    float bar = smoothstep(0.03, 0.0, abs(barY - 0.45)) * step(uv.x + 0.5, progress);

    // Mix all effects
    vec3 color = baseColor * glow;
    color += vec3(1.0,1.0,0.8) * stars * 0.8;
    color = mix(color, vec3(0.9,0.2,0.3), bar * 0.5); // overlay progress bar

    // Output
    gl_FragColor = vec4(color, 1.0);
}
