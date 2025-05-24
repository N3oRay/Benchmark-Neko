#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI    3.14159265
#define PI2   (2.0 * PI)

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;
    float aspect = resolution.x / resolution.y;
    uv.x *= aspect;

    // Lightning main oscillation
    float oscillation = cos(1.01 + time * 0.50023312) * 1.45 + 0.5;
    float lightningFreq = sin(oscillation * PI2) * 7.0;

    // Main lightning curve
    float curveX = 0.2 * (uv.x + 0.5) * sin(60.0 * uv.x * lightningFreq - 10.0 * time);

    // Extra lightning arcs
    float arc1 = 0.1 * sin(120.0 * uv.x + time * 2.0 + mouse.x * 5.0);
    float arc2 = 0.07 * sin(140.0 * uv.x - time * 1.2 + mouse.y * 4.0);
    float arc3 = 0.04 * sin(200.0 * uv.x + time * 1.7);

    float totalCurve = curveX + arc1 + arc2 + arc3;

    // Lightning intensity
    float intensityY = 1.0 / (35.0 * abs(uv.y - totalCurve));
    float intensityCenter = 1.0 / (55.0 * length(uv - vec2(uv.x, 0.0)));

    // Reflection: Mirror the upper lightning to the bottom half, with fade
    float uvY_reflect = -uv.y; // Mirror along X-axis
    float curveX_reflect = 0.2 * (uv.x + 0.5) * sin(60.0 * uv.x * lightningFreq - 10.0 * time);
    float totalCurve_reflect = curveX_reflect + arc1 + arc2 + arc3;
    float intensityY_reflect = 1.0 / (35.0 * abs(uvY_reflect - totalCurve_reflect));
    float fade = smoothstep(0.0, -0.45, uv.y); // Fade reflection towards bottom

    // Combine original and reflection
    float colorFactor = intensityY + intensityCenter + intensityY_reflect * fade * 0.6;

    // Color: Electric blue-white lightning
    vec3 color = vec3(
        (uv.x + 0.5) * colorFactor * 1.2,
        0.7 * colorFactor + 0.4 * intensityY,
        1.2 * colorFactor
    );

    // Gamma adjustment for pop
    color = pow(color, vec3(0.85));

    gl_FragColor = vec4(color, 1.0);
}
