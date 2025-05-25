// Original by @N3oray, reworked for clarity & structure

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

const float PI = 3.1415926535897932384626433832795;

// Main fragment shader entry point
void main(void)
{
    // Normalize pixel coordinates to range centered at (0,0)
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;

    // Animate the coordinates using sine and cosine time-based offsets
    uv.x += sin(time + uv.y) * 0.023;
    uv.y += cos(time + uv.x) * 0.037;

    float radius = length(uv); // Distance from center
    float angle = 3.0 * atan(abs(uv.x), uv.y) / PI;

    // Create "tri wings" pattern by modulating width with time
    float wings = radius * (min(angle, abs(angle - 2.0)) - (abs(sin(time * 34.0)) * 0.01 + 0.5));

    // Distance fields for various features
    float seg = min(0.48 - radius, radius - 0.1);    // Segments
    float ring = min(0.485 - radius, radius - 0.45); // Outer ring
    float dot = 0.06 - radius;                       // Inner dot

    // Compose the distance field shapes
    float composed = max(dot, max(ring, min(seg, wings)));

    // Animate "sickness" color and anti-aliasing
    float sickAnim = abs(cos(time * 0.32) + sin(time * 0.5));
    float threshold = 0.003 + sickAnim * 0.1;
    float shape = smoothstep(0.0, threshold, composed);

    // Apply color with animated green component
    gl_FragColor = vec4(shape, shape + sickAnim * 0.3, 0.0, 1.0);
}
