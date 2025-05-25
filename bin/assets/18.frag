// Original by @N3oray, reworked for clarity & structure


#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// --- SDF for Basic Letters (crude block font for demo) ---
float sdf_B(vec2 p) {
    float d = 1.0;
    if(p.x > 0.1 && p.x < 0.3) d = 0.0; // vertical bar
    if(p.x > 0.2 && p.x < 0.4 && ((p.y > 0.6 && p.y < 0.9) || (p.y > 0.1 && p.y < 0.4))) d = 0.0;
    if(p.x > 0.3 && p.x < 0.45 && ((abs(p.y-0.75)<0.15) || (abs(p.y-0.25)<0.15))) d = 0.0;
    return d;
}
float sdf_E(vec2 p) {
    float d = 1.0;
    if(p.x > 0.1 && p.x < 0.4 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(p.x > 0.4 && p.x < 0.55 && (abs(p.y-0.9)<0.08 || abs(p.y-0.5)<0.08 || abs(p.y-0.1)<0.08)) d = 0.0;
    return d;
}
float sdf_N(vec2 p) {
    float d = 1.0;
    if(p.x > 0.1 && p.x < 0.2 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(p.x > 0.3 && p.x < 0.4 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(abs(p.x - (p.y*0.3+0.1)) < 0.07) d = 0.0;
    return d;
}
float sdf_C(vec2 p) {
    float d = 1.0;
    if(p.x > 0.1 && p.x < 0.4 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(p.x > 0.4 && p.x < 0.55 && (abs(p.y-0.9)<0.08 || abs(p.y-0.1)<0.08)) d = 0.0;
    return d;
}
float sdf_H(vec2 p) {
    float d = 1.0;
    if(p.x > 0.1 && p.x < 0.2 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(p.x > 0.35 && p.x < 0.45 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(p.y > 0.45 && p.y < 0.55 && p.x > 0.1 && p.x < 0.45) d = 0.0;
    return d;
}
float sdf_M(vec2 p) {
    float d = 1.0;
    if(p.x > 0.1 && p.x < 0.18 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(p.x > 0.37 && p.x < 0.45 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(abs(p.x - (p.y*0.13+0.18)) < 0.06 && p.y < 0.5) d = 0.0;
    if(abs(p.x - (-p.y*0.13+0.37)) < 0.06 && p.y < 0.5) d = 0.0;
    return d;
}
float sdf_A(vec2 p) {
    float d = 1.0;
    if(abs(p.x-0.275 + (p.y-0.1)*0.15)<0.07 && p.y>0.1 && p.y<0.9) d = 0.0;
    if(abs(p.x-0.275 - (p.y-0.1)*0.15)<0.07 && p.y>0.1 && p.y<0.9) d = 0.0;
    if(p.y > 0.45 && p.y < 0.55 && p.x > 0.15 && p.x < 0.40) d = 0.0;
    return d;
}
float sdf_R(vec2 p) {
    float d = 1.0;
    if(p.x > 0.1 && p.x < 0.2 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(p.x > 0.2 && p.x < 0.4 && p.y > 0.6 && p.y < 0.9) d = 0.0;
    if(p.x > 0.2 && p.x < 0.4 && abs(p.y-0.75)<0.15) d = 0.0;
    if(abs(p.x - (p.y-0.5)*0.3+0.1) < 0.07 && p.y < 0.5) d = 0.0;
    return d;
}
float sdf_K(vec2 p) {
    float d = 1.0;
    if(p.x > 0.1 && p.x < 0.18 && p.y > 0.1 && p.y < 0.9) d = 0.0;
    if(abs(p.x - (0.18 + (p.y-0.5)*0.22)) < 0.07 && p.y > 0.5) d = 0.0;
    if(abs(p.x - (0.18 - (p.y-0.5)*0.22)) < 0.07 && p.y < 0.5) d = 0.0;
    return d;
}

// Renders the text "BENCHMARK" by combining SDFs (signed distance functions) for each letter.
// - uv: The current pixel coordinate (usually normalized to [0,1]).
// - pos: The position where the text should be centered.
// - size: The scaling factor for the text.
// - aspect: The aspect ratio to maintain proper horizontal spacing.
float renderText(vec2 uv, vec2 pos, float size, float aspect) {
    float alpha = 0.0; // Accumulator for combined letter alpha values.
    // 9 letters in "BENCHMARK", set spacing between letters, scaled by aspect ratio.
    float spacing = 0.055 * aspect;
    // Transform the uv coordinate to local text space, centered around 'pos' and scaled by 'size'.
    vec2 p = (uv - pos) / size;
    
    // Combine each letter using the maximum alpha value.
    // Each letter is offset horizontally by 'spacing'.
    
    // B
    alpha = max(alpha, 1.0 - sdf_B(p - vec2(0.0, 0.0)));
    // E
    alpha = max(alpha, 1.0 - sdf_E(p - vec2(1.0 * spacing, 0.0)));
    // N
    alpha = max(alpha, 1.0 - sdf_N(p - vec2(2.0 * spacing, 0.0)));
    // C
    alpha = max(alpha, 1.0 - sdf_C(p - vec2(3.0 * spacing, 0.0)));
    // H
    alpha = max(alpha, 1.0 - sdf_H(p - vec2(4.0 * spacing, 0.0)));
    // M
    alpha = max(alpha, 1.0 - sdf_M(p - vec2(5.0 * spacing, 0.0)));
    // A
    alpha = max(alpha, 1.0 - sdf_A(p - vec2(6.0 * spacing, 0.0)));
    // R
    alpha = max(alpha, 1.0 - sdf_R(p - vec2(7.0 * spacing, 0.0)));
    // K
    alpha = max(alpha, 1.0 - sdf_K(p - vec2(8.0 * spacing, 0.0)));
    
    // Smooth the result to get anti-aliased edges for the text.
    return smoothstep(0.4, 1.0, alpha);
}

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
    for (int i = 0; i < 10; i++) {
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


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	
	// --- Water Turbulence Effect (as before) ---
    vec2 uv = surfacePosition * 8.0;
    vec2 turbulence = uv;

    float turbulenceSum = 0.5;
    float intensity = 0.2;
    const int MAX_ITER = 20;

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

    float pulse1 = abs(sin(time * 1.0));
    float pulse2 = pow(sin(time * 3.0), 0.25);

    float hue = mod(0.25 + turbulenceSum * 0.23 + time * 0.06 * 0.07, 1.0);
    float sat = 0.70 + 0.25 * sin(time + turbulenceSum * 0.5);
    float val = 0.75 + 0.20 + 0.10 * turbulenceSum;
    vec3 vividColor = hsv2rgb(vec3(hue, sat, val));

    float spark = sparkle(surfacePosition, time * 0.2);
    vividColor += vec3(spark) * 0.7 * (0.85 + 0.15);

    float bub = bubbles(fract(surfacePosition + 0.03 * time), time);
    vividColor = mix(vividColor, vividColor + vec3(0.1, 0.1, 0.1), bub * 0.5);

    float caustic = caustics(surfacePosition, time * 0.1);
    vividColor += vec3(0.1, 0.15, 1.2) * caustic * 0.23;

    float b = bloom(surfacePosition, 7.0);
    vividColor += vec3(0.2, 0.25, 0.35) * b * 0.2;

    vividColor += vividColor * 1.32 + 0.10;

    float vignette = smoothstep(1.0, 0.78, length(surfacePosition - 0.5));
    vividColor *= vignette + 0.13;

    vividColor += clamp(vividColor, 0.0, 1.0);

    // --- Text Overlay ---
    float aspect = resolution.x / resolution.y;
    float size = 0.1;
    float yPos = 0.1;
    float xPos = 0.1 - (0.055 * aspect * 4.5);

    float textAlpha = renderText(surfacePosition, vec2(xPos, yPos), size, aspect);

    vividColor = mix(vividColor, vec3(1.0), 0.001);


	gl_FragColor = vec4( vec3( color, color * pulse1, sin( color + time / pulse2 * vividColor *0.01) * 0.75 ), 1.0 )+vec4(vividColor, 0.6);

}
