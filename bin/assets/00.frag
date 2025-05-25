// @mix-author N3oray

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Utility: pseudo-random number based on coordinates
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Linear Congruential Generator for random values
float seed = 2.0;
float random() {
    seed = mod(13821.0 * seed, 32768.0);
    return mod(seed, 2.0) + 1.0;
}

// Main shader function
void main(void) {
    vec2 pixel_pos = gl_FragCoord.xy;
    
    // Animated color palettes
    vec3 color1 = vec3(0.7, sin(time), 2.25 * sin(time));
    vec3 color2 = vec3(0.25, 0.7, 0.5 * cos(time));
    vec3 color3 = vec3(0.5 * sin(time), 0.25, 0.7);
    vec3 final_color = vec3(0.05 * cos(time), 0.025 * cos(time * 0.5), 0.05 * sin(time));
    
    // Layered animated blobs with color mixing
    for (int i = 0; i < 9; ++i) {
        float fi = float(i);
        // Blob center position animated over time
        vec2 center = resolution / 2.0 + vec2(
            sin(0.1 * float(random()) * time * 3.0 + pow(2.0, fi * 2.0)) * 100.0,
            cos(0.05 * (fi - 2.0) * time) * 100.0
        );
        float dist = length(pixel_pos - center);
        float intensity = pow((8.0 + 8.0 * mod(fi, 2.5)) / dist, 2.0);
        float noise = rand(gl_FragCoord.xy);
        
        if (mod(fi, 5.0) == 0.0)
            final_color += color1 * intensity * noise;
        else if (mod(fi, 3.0) == 1.0)
            final_color += color2 * intensity * noise;
        else
            final_color += color3 * intensity * noise;
    }

    // --- Animated Sinusoidal Overlay ---
    vec2 uPos = gl_FragCoord.xy / resolution.xy; // normalized coordinates
    uPos.x -= 1.0;
    uPos.y -= 0.5;
    vec3 sinus_color = vec3(0.0);
    float vertColor = 0.0;

    // Sinusoidal wave: Use a for loop for two waves
    for (float i = 2.0; i < 4.0; ++i) {
        float t = time * 1.2;
        uPos.y += cos(uPos.x * exp(i + 1.1) - (t + i / 2.0)) * 0.2;
        float fTemp = tan(1.0 / (uPos.y * 100.0));
        vertColor += fTemp;
        sinus_color += vec3(
            fTemp * (2.0 - i) / 10.0,
            fTemp * i / 4.0,
            pow(fTemp, 0.99) * 1.2
        );
    }
    vec4 show_sinus = vec4(sinus_color, 1.0);

    // --- Display modes ---
    // sinus = 1.0: overlay sinus, 2.0: only blobs, 3.0: only sinus, 4.0: off
    float sinus_mode = 1.0; // Change to 2.0, 3.0, or 4.0 for different effects

    if (sinus_mode == 1.0)
        gl_FragColor = vec4(final_color * abs(sin(time * 0.25) + 1.5), 1.0) + show_sinus;
    else if (sinus_mode == 2.0)
        gl_FragColor = vec4(final_color * abs(sin(time * 0.25) + 1.5), 1.0);
    else if (sinus_mode == 3.0)
        gl_FragColor = show_sinus;
    else // sinus_mode == 4.0
        gl_FragColor = vec4(0.0);
}
