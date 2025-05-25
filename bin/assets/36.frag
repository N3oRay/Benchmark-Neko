// @mix-author N3oray

#ifdef GL_ES
precision mediump float;
#endif

// Uniforms
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Rotation matrix setup
const float angle1 = 0.785398; // 45 degrees in radians
const float angle2 = 0.0;      // 0 degrees in radians
mat3 rotation = mat3(
    cos(angle1), 0.0, sin(angle1),
    0.0,         1.0, 0.0,
   -sin(angle1), 0.0, cos(angle1)
) * mat3(
    cos(angle2), sin(angle2), 0.0,
    sin(angle2),-cos(angle2), 0.0,
    0.0,         0.0,        1.0
);

// Signed distance functions
float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float sdCross(vec3 p, vec2 b) {
    float da = sdBox(p.xy, b);
    float db = sdBox(p.yz, b);
    float dc = sdBox(p.zx, b);
    return min(da, min(db, dc));
}

// Scene mapping
float map(vec3 p) {
    float z_clip = p.z - 0.3;
    p = rotation * p;
    p = mod(p, vec3(3.0)) - vec3(1.5);
    float cross_dist = sdCross(p, vec2(1.06));
    vec3 p2 = mod(p, vec3(0.15)) - vec3(0.075);
    float small_box = sdBox(p2, vec3(0.05));
    return max(max(-cross_dist, small_box), z_clip);
}

// Compute normal by central differences
vec3 genNormal(vec3 p) {
    const float d = 0.01;
    return normalize(vec3(
        map(p + vec3( d, 0.0, 0.0)) - map(p - vec3( d, 0.0, 0.0)),
        map(p + vec3(0.0,  d, 0.0)) - map(p - vec3(0.0,  d, 0.0)),
        map(p + vec3(0.0, 0.0,  d)) - map(p - vec3(0.0, 0.0,  d))
    ));
}

// 2D rotation helper
vec2 rotate2D(vec2 v, float t) {
    float c = cos(t);
    float s = sin(t);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

void main() {
    // Normalized coordinates
    vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;

    // Camera setup
    vec3 camPos = vec3(0.0, 0.0, 3.0);
    camPos.x += -time * 0.4;
    camPos.y += -time * 0.8;
    vec3 camDir = vec3(0.0, 0.0, -1.0);
    vec3 camUp = vec3(0.0, 1.0, 0.0);
    vec3 camSide = cross(camDir, camUp);
    float focus = 1.5;

    // Ray direction
    vec3 rayDir = normalize(camSide * pos.x + camUp * pos.y + camDir * focus);
    vec3 ray = camPos;
    int marchStep = 0;
    float dist = 0.0, totalDist = 0.0;
    const int MAX_MARCH = 128;

    // Raymarching loop
    for (int i = 0; i < MAX_MARCH; ++i) {
        marchStep = i;
        dist = map(ray);
        totalDist += dist;
        ray += rayDir * dist;
        if (dist < 0.001) break;
    }

    // Glow calculation
    float glow = 0.0;
    const float ADD_GLOW = 0.6;
    {
        const float s = 0.00075;
        const float maxDot = 0.9;
        vec3 n1 = genNormal(ray);
        vec3 n2 = genNormal(ray + vec3(s, 0.0, 0.0));
        vec3 n3 = genNormal(ray + vec3(0.0, s, 0.0));
        glow = max(1.0 - abs(dot(camDir, n1) - 0.5), 0.0) * 0.5;
        if (dot(n1, n2) < maxDot || dot(n1, n3) < maxDot) {
            glow += ADD_GLOW;
        }
    }
    // Grid overlays and extra glow
    {
        vec3 p = rotation * ray;
        float grid1 = max(0.0, max((mod((p.x + p.y + p.z * 2.0) - time * 3.0, 5.0) - 4.0) * 1.5, 0.0));
        float grid2 = max(0.0, max((mod((p.x + p.y * 2.0 + p.z) - time * 2.0, 7.0) - 6.0) * 1.2, 0.0));
        vec3 gp1 = abs(mod(p, vec3(0.24)));
        vec3 gp2 = abs(mod(p, vec3(0.36)));
        if (gp1.x < 0.235 && gp1.y < 0.235) grid1 = 0.0;
        if (gp2.y < 0.35 && gp2.z < 0.35) grid2 = 0.0;
        glow += grid1 + grid2;
    }

    // Fog
    float fog = min(1.0, (1.0 / float(MAX_MARCH)) * float(marchStep));
    vec3 fogTint = 0.01 * vec3(1.0, 1.0, 1.5) * totalDist;

    // Final color mixing
    const float baseColor = 0.15;
    const float colorMult = 1.75;
    glow *= min(1.0, 4.0 - (4.0 / float(MAX_MARCH - 1)) * float(marchStep));
    vec3 color = vec3(baseColor + glow * colorMult, baseColor + glow * colorMult, 0.2 + glow) * fog + fogTint;

    gl_FragColor = vec4(color, 1.0);
}
