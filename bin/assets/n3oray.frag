// N3ORAY STYLE
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

// --- SDF Primitives ---
float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}
float sdSegment(vec2 p, vec2 a, vec2 b, float w) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
    return length(pa - ba*h) - w;
}

// --- Character SDFs ---
// N
float sdf_N(vec2 p) {
    float left = sdBox(p + vec2(0.07, 0.0), vec2(0.035, 0.17));
    float right = sdBox(p - vec2(0.07, -0.00), vec2(0.025, 0.17));
    float diag = sdSegment(p, vec2(0.07, -0.16), vec2(-0.07, 0.16), 0.01);
    return min(min(left, right), diag);
}

// SDF for arc by angle masking a circle
float arcSDF(vec2 p, vec2 center, float r, float a0, float a1) {
        vec2 d = p - center;
        float ang = atan(d.y, d.x);
        float arcMask = step(a0, ang) * step(ang, a1);
        float circle = length(d) - r;
        // Only keep arc, or use a soft mask
        return mix(1e5, circle, arcMask);
}
// --- Improved SDF for "3" ---
float sdf_3(vec2 p) {
    // Parameters for arcs
    float r = 0.1;
    vec2 topCenter = vec2(-0.02, 0.08);
    vec2 botCenter = vec2(-0.02, -0.08);

    // Angle limits for arcs (in radians)
    float topStart = -2.5, topEnd = 3.0;
    float botStart = -3.0, botEnd = 2.5;

 

    // Top and bottom arcs
    float topArc = arcSDF(p, topCenter, r, topStart, topEnd);
    float botArc = arcSDF(p, botCenter, r, botStart, botEnd);

    // Middle bar (slightly curved for style)
    float t = clamp((p.y + 0.01) / 0.11, 0.0, 1.0);
    float midY = mix(0.062, -0.062, t);
    //float midBar = sdBox(p - vec2(0.022, midY), vec2(0.052, 0.018)); // xpos - largeur - hauteur

    // Join the arcs and bar
	//float d = min(min(topArc, botArc), midBar);
    float d = min(min(topArc, botArc), 1.8);

    // Remove left side to open the "3"
    d = max(d, -sdBox(p + vec2(0.04, 0.0), vec2(0.0, 0.35)));

    return d;
}
// O
float sdf_O(vec2 p) {
    return abs(sdCircle(p, 0.15)) - 0.026;
}
// R
float sdf_R(vec2 p) {
    float stem = sdBox(p + vec2(0.07, 0.0), vec2(0.022, 0.16));
    float bowl = abs(sdCircle(p - vec2(-0.01, 0.08), 0.059)) - 0.024;
    //bowl = min(bowl, (p.y + 0.01));
    float leg = sdSegment(p, vec2(0.0, 0.0), vec2(0.085, -0.16), 0.022);
    return min(min(stem, bowl), leg);
}
// A (improved)
float sdf_A(vec2 p) {
    // Symmetric triangle sides
    float left = sdSegment(p, vec2(-0.085, -0.17), vec2(0.0, 0.16), 0.02);
    float right = sdSegment(p, vec2(0.085, -0.17), vec2(0.0, 0.16), 0.02);
    float bar = sdBox(p - vec2(-0.01, -0.045), vec2(0.045, 0.016));
    // Clip below the bar for a more "A" look
    float base = p.y + 0.16;
    return min(min(left, right), max(bar, -base));
}
// Y
float sdf_Y(vec2 p) {
    float v1 = sdSegment(p, vec2(-0.045, 0.16), vec2(0.0, 0.03), 0.017);
    float v2 = sdSegment(p, vec2(0.045, 0.16), vec2(0.0, 0.03), 0.017);
    float tail = sdSegment(p, vec2(0.0, 0.03), vec2(0.0, -0.16), 0.017);
    return min(min(v1, v2), tail);
}

// --- Compose N3ORAY ---
// Corrected: leftmost is N, rightmost is Y
float textN3ORAY(vec2 uv) {
    float spacing = 0.30;
    float d = 1.0;
    d = min(d, sdf_N(uv + vec2(2.5*spacing, 0.0)));
    d = min(d, sdf_3(uv + vec2(1.5*spacing, 0.0)));
    d = min(d, sdf_O(uv + vec2(0.5*spacing, 0.0)));
    d = min(d, sdf_R(uv - vec2(0.6*spacing, 0.0)));
    d = min(d, sdf_A(uv - vec2(1.5*spacing, 0.0)));
    d = min(d, sdf_Y(uv - vec2(2.5*spacing, 0.0)));
    return d;
}

// Gold palette with multi-band and environment reflection
vec3 goldPalette(float y, float fx) {
    vec3 gold1 = vec3(1.0, 0.85, 0.25);
    vec3 gold2 = vec3(1.0, 0.78, 0.14);
    vec3 gold3 = vec3(0.98, 0.62, 0.12);
    vec3 gold4 = vec3(0.8, 0.44, 0.07);
    float b1 = smoothstep(0.0, 0.25, y);
    float b2 = smoothstep(0.2, 0.6, y);
    float b3 = smoothstep(0.5, 0.8, y);
    float b4 = smoothstep(0.7, 1.0, y);

    vec3 base = mix(gold4, gold3, b4);
    base = mix(base, gold2, b3);
    base = mix(base, gold1, b1);

    float env = 0.08 * sin(10.0 * y + 4.0 * fx + time*1.7)
              + 0.08 * cos(14.0 * y - 6.0 * fx + time*2.1)
              + 0.12 * sin(time + fx * 1.5 + y * 4.0);
    env += 0.09 * sin(time*2.0 + fx*10.0 + y*7.0);

    base += env * vec3(1.2, 1.0, 0.6);

    return clamp(base, 0.0, 1.0);
}

// Animated shine
float goldShine(vec2 p, float edge, float t) {
    float angle = t*0.5;
    float band_w = 0.12 + 0.05*sin(t*0.7);
    float sweep = (p.x + p.y)*0.5 - 0.22*sin(angle);
    float shine = smoothstep(band_w, band_w-0.018, sweep);
    shine += 0.16*smoothstep(0.014, 0.0, 
        mod(p.x*8.0 + t*2.0, 1.0) * edge
    );
    return shine * edge;
}

// Cubic reveal animation (left to right wipe)
float textReveal(vec2 uv, float t) {
    float wipe = smoothstep(-0.012, 0.05, uv.x + 1.9 - mod(t*0.95, 2.9));
    return wipe;
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.x = (uv.x - 0.5) * resolution.x / resolution.y + 0.5;

    uv = uv * 1.4 - 0.7; // zoom and center

    float d = textN3ORAY(uv);

    float reveal = textReveal(uv, time);

    float shadow = smoothstep(0.0145, 0.0125, textN3ORAY(uv + vec2(0.0025, -0.0025)));

    float edge = smoothstep(0.024, 0.0, d);

    edge *= reveal;

    float y = clamp((uv.y + 0.22) / 0.44, 0.0, 1.0);
    float fx = uv.x;
    vec3 gold = goldPalette(y, fx);

    float shine = goldShine(uv, edge, time);
    gold += shine * vec3(1.2, 1.1, 0.75);

    float sparkle = 0.10 * smoothstep(0.012, 0.0, mod(uv.x*23.0 + uv.y*44.0 + time*6.0, 1.0)) * edge;
    gold += sparkle * vec3(1.3, 1.1, 0.9);

    vec3 bg = vec3(0.11, 0.13, 0.17);
    vec3 finalColor = mix(bg, gold, edge);
    finalColor = mix(finalColor, vec3(0.0, 0.0, 0.0), shadow * 0.32);

    gl_FragColor = vec4(finalColor, 1.0);
}
