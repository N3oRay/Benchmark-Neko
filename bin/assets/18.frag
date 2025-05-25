// Water Turbulence Effect Shader (Vivid Enhanced Version)
// Original: N3oray. Enhanced by Copilot, 2025-05-25.

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 32
#define NUM_BUBBLES 7

// HSV to RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Sparkle overlay
float sparkle(vec2 uv, float t) {
    float s = 0.0;
    for (int i = 0; i < 6; i++) {
        vec2 pos = vec2(
            fract(sin(float(i) * 78.233 + t * 0.7) * 43758.5453),
            fract(cos(float(i) * 15.873 + t * 0.6) * 24634.3129)
        );
        float d = length(uv - pos * 2.0);
        s += smoothstep(0.08, 0.03, d);
    }
    return s;
}

// Bubbles overlay
float bubbles(vec2 uv, float t) {
    float b = 0.0;
    for (int i = 0; i < NUM_BUBBLES; i++) {
        float fi = float(i);
        float speed = 0.15 + 0.06 * fract(sin(fi) * 13.37);
        float x = fract(sin(fi * 12.3) * 1234.5 + 0.3 * fi + t * speed);
        float y = fract((cos(fi * 8.6) * 4321.2 + t * (0.12 + 0.04 * fi)));
        float size = 0.09 + 0.03 * fract(sin(fi * 2.7));
        float d = length(uv - vec2(x, y));
        b += smoothstep(size, size * 0.5, d);
    }
    return b;
}

// Soft radial "light bloom" centered on the screen
float bloom(vec2 uv, float strength) {
    float dist = length(uv - 0.5);
    return exp(-dist * dist * strength);
}

// Fake caustics light pattern
float caustics(vec2 uv, float t) {
    float c = 0.0;
    c += 0.3 * sin((uv.x + t) * 16.0 + sin(t)) * cos((uv.y + t) * 12.0);
    c += 0.2 * sin((uv.x - t * 0.5) * 22.0) * cos((uv.y + t * 0.4) * 18.0);
    return c * 0.5 + 0.5;
}

void main(void) {
    // --- Coordinate Setup ---
    vec2 uv = surfacePosition * 8.0;
    vec2 turbulence = uv;

    float turbulenceSum = 2.0;
    float intensity = 1.0;

    // --- Turbulence Loop ---
    for (int i = 0; i < MAX_ITER; i++) {
        float iter = float(i + 1);
        float t = time * (1.0 - (1.0 / iter));
        turbulence = uv + vec2(
            cos(t - turbulence.x) + sin(t + turbulence.y),
            sin(t - turbulence.y) + cos(t + turbulence.x)
        );
        float divisor = length(vec2(
            uv.x / (sin(turbulence.x + t) / intensity),
            uv.y / (cos(turbulence.y + t) / intensity)
        ));
        turbulenceSum += 1.0 / divisor;
    }
    turbulenceSum /= float(MAX_ITER);

    // Animated color pulses
    float pulse1 = abs(sin(time * 5.0));
    float pulse2 = pow(sin(time * 3.0), 0.25);

    // --- Vivid Color Magic ---
    // Use turbulence and time to modulate hue, saturation, and value
    float hue = mod(0.25 + turbulenceSum * 0.23 + time * 0.06 + pulse1 * 0.07, 1.0);
    float sat = 0.70 + 0.25 * sin(time + turbulenceSum * 1.5);
    float val = 0.75 + 0.20 * pulse2 + 0.10 * turbulenceSum;
    vec3 vividColor = hsv2rgb(vec3(hue, sat, val));

    // Sparkles
    float spark = sparkle(surfacePosition, time * 1.5);
    vividColor += vec3(spark) * 0.7 * (0.85 + 0.15 * pulse1);

    // Bubbles
    float bub = bubbles(fract(surfacePosition + 0.03 * time), time);
    vividColor = mix(vividColor, vividColor + vec3(1.0, 1.0, 1.0), bub * 0.5);

    // Caustic shimmer
    float caustic = caustics(surfacePosition, time * 0.5);
    vividColor += vec3(1.1, 1.15, 1.2) * caustic * 0.23;

    // Bloom from center
    float b = bloom(surfacePosition, 7.0);
    vividColor += vec3(1.2, 1.25, 1.35) * b * 0.4;

    // Brightness & contrast
    vividColor = vividColor * 1.32 + 0.10;

    // Gentle vignette
    float vignette = smoothstep(1.0, 0.78, length(surfacePosition - 0.5));
    vividColor *= vignette + 0.13;

    // Clamp for safety
    vividColor = clamp(vividColor, 0.0, 1.0);

    gl_FragColor = vec4(vividColor, 1.0);
}
