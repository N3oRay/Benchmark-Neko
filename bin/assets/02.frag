#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI    3.14159265
#define PI2   (2.0 * PI)

void main(void) {
    // Normalized pixel coordinates (from -0.5 to +0.5)
    vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;

    // Dynamic value oscillating over time
    float oscillation = cos(1.01 + time * 0.50023312) * 1.45 + 0.5;
    float sineWave = sin(oscillation * PI2) * 7.0;

    // Calculate the moving x curve (can be modulated by mouse.x for interaction)
    float curveX = 0.2 * (uv.x + 0.5) * sin(60.0 * uv.x * sineWave - 10.0 * time);

    // Distance-based intensity for y and centerline
    float intensityY = 1.0 / (50.0 * abs(uv.y - curveX));
    float intensityCenter = 1.0 / (50.0 * length(uv - vec2(uv.x, 0.0)));

    float colorFactor = intensityY + intensityCenter;

    // Final color composition
    gl_FragColor = vec4(
        (uv.x + 0.5) * colorFactor, // Red channel
        0.5 * colorFactor,          // Green channel
        colorFactor,                // Blue channel
        1.0                         // Alpha
    );
}
