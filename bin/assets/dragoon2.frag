#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

/* 
 * Creative Commons Attribution-NonCommercial-ShareAlike
 * N3oray
 *
 * Modernized, refactored, and documented by Copilot
 */

// --- UTILS ---
#define SIN(t) (0.5 + 0.5 * sin(t))

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

// Zucconi's spectral palette: https://www.alanzucconi.com/2017/07/15/improving-the-rainbow-2/
vec3 bump3y(vec3 x, vec3 yoffset) {
    vec3 y = 1.0 - x * x;
    y = clamp(y - yoffset, vec3(0), vec3(1));
    return y;
}
vec3 spectral_zucconi6(float x) {
    x = fract(x);
    const vec3 c1 = vec3(3.54585104, 2.93225262, 2.41593945);
    const vec3 x1 = vec3(0.69549072, 0.49228336, 0.27699880);
    const vec3 y1 = vec3(0.02312639, 0.15225084, 0.52607955);
    const vec3 c2 = vec3(3.90307140, 3.21182957, 3.96587128);
    const vec3 x2 = vec3(0.11748627, 0.86755042, 0.66077860);
    const vec3 y2 = vec3(0.84897130, 0.88445281, 0.73949448);
    return bump3y(c1 * (x - x1), y1) + bump3y(c2 * (x - x2), y2);
}

// --- NOISE ---
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.0, 289.0))) * 45758.5453);
}
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// --- SDF PRIMITIVES ---
float sdEllipse(vec2 p, vec2 r) {
    return (length(p / r) - 1.0) * min(r.x, r.y);
}
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}
float sdTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
    vec2 ba = b - a, pa = p - a;
    vec2 cb = c - b, pb = p - b;
    vec2 ac = a - c, pc = p - c;
    float s = sign(ba.x * ac.y - ba.y * ac.x);
    return min(min(
        s * (pa.x * ba.y - pa.y * ba.x),
        s * (pb.x * cb.y - pb.y * cb.x)),
        s * (pc.x * ac.y - pc.y * ac.x));
}

// --- DRAGON PARTS ---
float dragonEye(vec2 uv) {
    vec2 eyePos = vec2(0.22, 0.10);
    float eye   = sdEllipse(uv - eyePos, vec2(0.025, 0.012));
    float pupil = sdEllipse(uv - eyePos, vec2(0.007, 0.012));
    float glow  = sdCircle(uv - eyePos, 0.04);
    return smoothstep(0.0, 0.01, -eye)
         + 0.6 * smoothstep(0.04, 0.00, glow)
         - 0.7 * smoothstep(0.0, 0.01, -pupil);
}
float dragonWings(vec2 uv) {
    float wing = 1e5;
    wing = min(wing, sdEllipse(uv - vec2(-0.18, 0.22), vec2(0.3, 0.07)));
    wing = min(wing, sdEllipse(uv - vec2(-0.06, 0.13), vec2(0.25, 0.04)));
    for (int i = 0; i < 4; i++) {
        float ang = 0.7 + float(i) * 0.23;
        vec2 c = vec2(-0.12, 0.14) + 0.22 * vec2(cos(ang), sin(ang));
        wing = min(wing, sdEllipse(uv - c, vec2(0.09, 0.018)));
    }
    return wing;
}
float dragonClaw(vec2 uv, vec2 base, float angle) {
    vec2 p = uv - base;
    p = rot(angle) * p;
    float claw = sdTriangle(p, vec2(0.0), vec2(0.03, 0.025), vec2(0.06, -0.01));
    return smoothstep(0.01, 0.0, claw);
}
float dragonClaws(vec2 uv) {
    float claws = 0.0;
    // Forefoot
    for (int i = 0; i < 3; i++)
        claws += dragonClaw(uv, vec2(0.15, -0.17), -0.4 + 0.3 * float(i));
    // Backfoot
    for (int i = 0; i < 3; i++)
        claws += dragonClaw(uv, vec2(-0.09, -0.18), -0.5 + 0.3 * float(i));
    return clamp(claws, 0.0, 1.0);
}
float dragonBody(vec2 uv) {
    float d = 1e5;
    d = min(d, sdEllipse(uv - vec2(-0.15, 0.0), vec2(0.26, 0.17))); // Body
    d = min(d, sdEllipse(uv - vec2(0.15, 0.08), vec2(0.09, 0.06))); // Head
    d = min(d, sdEllipse(uv - vec2(0.20, 0.04), vec2(0.07, 0.025))); // Jaw
    d = min(d, sdEllipse(uv - vec2(-0.38, 0.07), vec2(0.13, 0.03))); // Tail
    d = min(d, sdEllipse(uv - vec2(-0.05, -0.21), vec2(0.10, 0.04))); // Leg 1
    d = min(d, sdEllipse(uv - vec2(0.10, -0.20), vec2(0.09, 0.03))); // Leg 2
    d = min(d, sdEllipse(uv - vec2(0.19, 0.15), vec2(0.03, 0.01))); // Horn 1
    d = min(d, sdEllipse(uv - vec2(0.14, 0.16), vec2(0.02, 0.01))); // Horn 2
    return d;
}

// --- FIRE EFFECT ---
float fire(vec2 uv, float t) {
    float f = 0.0;
    for (int i = 0; i < 28; i++) {
        float angle = float(i) * 0.12 + t * 2.0;
        float len = 0.3 + 0.21 * fract(float(i)*0.27 + t) + 0.07 * sin(t + float(i));
        vec2 pos = vec2(0.29, 0.04) + vec2(cos(angle), sin(angle)) * len;
        float rad = 0.03 + 0.05 * fract(float(i)*0.61 + t);
        float turb = 0.02 * noise(uv * 10.0 + t * vec2(2.0, 3.5) + float(i) * 2.0);
        f += smoothstep(rad + turb, rad - 0.018 - turb, length(uv - pos));
    }
    float outerGlow = smoothstep(0.14, 0.02, length(uv - vec2(0.29, 0.04)));
    return clamp(f + 0.2 * outerGlow, 0.0, 1.0);
}

// --- LIGHTING ---
vec3 applyLight(vec2 uv, vec3 col, float d, float wings, float claws) {
    vec2 lightPos = vec2(0.35, 0.45 + 0.15 * sin(time * 0.6));
    float ambient = 0.35, diffuse = 0.75;

    // Simulated normals
    vec2 normal;
    if (abs(d) < abs(wings) && abs(d) < abs(claws)) normal = normalize(uv - vec2(-0.15, 0.0));
    else if (abs(wings) < abs(d) && abs(wings) < abs(claws)) normal = normalize(uv - vec2(-0.18, 0.22));
    else normal = normalize(uv - vec2(0.15, -0.17));
    vec2 toLight = normalize(lightPos - uv);
    float diff = clamp(dot(normal, toLight), 0.0, 1.0);

    // Rim light
    float rim = pow(1.0 - abs(dot(normal, toLight)), 2.0) * 0.7;
    float shadow = 0.6 + 0.4 * smoothstep(0.0, 0.5, length(uv - lightPos));
    float spec = pow(clamp(dot(reflect(-toLight, normal), normalize(-uv)), 0.0, 1.0), 24.0);

    col *= (ambient + diffuse * diff) * shadow;
    col += vec3(1.0, 0.9, 0.7) * (spec * 0.3 + rim * 0.28);
    return clamp(col, 0.0, 1.0);
}

void main() {
    // Camera setup
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    vec2 cameraOffset = vec2(-0.14, 0.08);
    float cameraZoom = 0.7;
    uv = (uv - cameraOffset) / cameraZoom;

    float t = mod(time, 100.0);
    float tt = time * 0.5;
    uv.xy *= mix(0.8, 1.2, SIN(-tt + 5.0 * length(uv.xy)));

    // Atmospheric background
    vec3 col2 = vec3(0);
    vec3 rd = vec3(uv, 1), p = vec3(0);
    for (float i = 0.0; i < 120.0; i++) {
        p = t * rd + rd;
        p.z += tt;
        p = abs(p) - 0.3;
        float z = p.z;
        p.xy *= rot(p.z);
        p = abs(p) - 0.3;
        for (float j = 0.0; j < 3.0; j++) {
            float a = exp(j) / exp2(j);
            p += cos(3.0 * p.yzx * a + 0.5 * tt - length(p.xy) * 9.0) / a;
        }
        float d = 0.007 + abs((exp2(1.3 * p) - vec3(0, 1.0 + 0.7 * SIN(tt), 0)).y - 1.0) / 14.0;
        float k = t * 0.7 + length(p) * 0.1 - 0.2 * tt + z * 0.1;
        t += d / 4.0;
    }
    float gl = exp(-20.0 * length(uv.xy));
    col2 += 0.4 * mix(vec3(0.361, 0.957, 1.000), vec3(0.847, 1.000, 0.561), SIN(gl * 2.0 - tt)) * pow(gl * 11.0, 1.0);
    vec3 col3 = pow(col2, vec3(0.45));

    // Dragon layers
    float d = dragonBody(uv);
    float wings = dragonWings(uv);
    float eye = dragonEye(uv);
    float claws = dragonClaws(uv);

    // Electric blue base color
    vec3 blue = vec3(27, 231, 255) / 255.0;
    float scaleTex = 0.2 * noise(uv * 18.0 + sin(time) * 3.0) + 0.8;
    vec3 baseColor = mix(blue, spectral_zucconi6(t), smoothstep(0.7, 1.0, abs(d)));
    vec3 col = baseColor * scaleTex;

    // Wings: translucent orange
    float wingTex = 0.1 + 0.3 * noise(uv * 2.0 + time * 0.1);
    col = mix(col2, vec3(1.0, 0.55, 0.2) * wingTex, smoothstep(0.12, 0.0, abs(wings)));

    // Claws: shiny blueish
    col = mix(col2, vec3(1.0, 0.95, 0.9) + 0.13 * vec3(0.2, 0.3, 1.0), claws);

    // Eye: glowing yellow
    col = mix(col2, vec3(1.0, 0.93, 0.1), eye);

    // Fire
    float f = fire(uv, t);
    vec3 fireCol = vec3(1.0, 0.8, 0.25) + vec3(1.0, 0.2, 0.0) * pow(f, 1.0);
    fireCol += 0.18 * vec3(1.0, 0.3, 0.0) * smoothstep(0.5, 0.0, abs(uv.x - 0.29) + abs(uv.y - 0.04));
    col = mix(col3, fireCol, f);

    // Lighting and fog
    col = applyLight(uv, col, d, wings, claws);
    float fog = smoothstep(-1.0, 0.18, uv.y) * 0.4 + 0.4 * smoothstep(0.7, 0.1, uv.x);
    col = mix(col, col2, fog * 0.36);

    gl_FragColor = vec4(col, 1.0);
}
