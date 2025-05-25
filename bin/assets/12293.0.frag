// Voxel Raymarching Shader
// Original by @N3oray, reworked for clarity & structure

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

// ----- Utility Functions -----
float opUnion(float a, float b)      { return min(a, b); }
float opIntersect(float a, float b)  { return max(a, b); }
float opDifference(float a, float b) { return max(a, -b); }

float sdPlane(vec3 p, vec3 n, vec3 pos) { return dot(p - pos, n); }
float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}
float sdCone(vec3 p, vec2 c) {
    float q = length(p.xz);
    return dot(c, vec2(q, p.y));
}
float sdSphere(vec3 p, float r) { return length(p) - r; }

vec3 rotateX(vec3 p, float a) {
    float sa = sin(a), ca = cos(a);
    return vec3(p.x, ca*p.y - sa*p.z, sa*p.y + ca*p.z);
}
vec3 rotateY(vec3 p, float a) {
    float sa = sin(a), ca = cos(a);
    return vec3(ca*p.x + sa*p.z, p.y, -sa*p.x + ca*p.z);
}

// ----- Scene SDF -----
float scene(vec3 p) {	
    float d = sdSphere(p, sin(time)*0.5 + 0.5);

    vec3 pr = p - vec3(1.5, 0.0, 0.0);
    pr = rotateX(pr, time);
    pr = rotateY(pr, time*0.3);	
    d = opUnion(d, sdBox(pr, vec3(0.6)));

    d = opUnion(d, sdCone(p + vec3(1.5, -0.5, 0.0), vec2(1.0, 0.5)));
    d = opUnion(d, sdPlane(p, vec3(0.0, 1.0, 0.0), vec3(0.0, -1.0, 0.0)));

    // Cute "bubble" overlays
    float bubbleTime = time * 0.7;
    for (int i=0; i<3; i++) {
        float angle = bubbleTime + float(i) * 2.0;
        vec3 offset = vec3(sin(angle)*2.0, 0.6+0.7*sin(angle*1.2), cos(angle)*1.2);
        d = opUnion(d, sdSphere(p - offset, 0.35 + 0.13*sin(angle*3.0)));
    }
    return d;
}

// ----- Scene Normal -----
vec3 sceneNormal(vec3 pos) {
    float eps = 1e-4;
    float d = scene(pos);
    vec3 n = vec3(
        scene(vec3(pos.x + eps, pos.y, pos.z)) - d,
        scene(vec3(pos.x, pos.y + eps, pos.z)) - d,
        scene(vec3(pos.x, pos.y, pos.z + eps)) - d
    );
    return normalize(n);
}

// ----- Ambient Occlusion -----
float ambientOcclusion(vec3 p, vec3 n) {
    const int steps = 3;
    const float delta = 0.5;
    float a = 0.0, w = 1.0;
    for(int i = 1; i <= steps; i++) {
        float d = float(i) / float(steps) * delta; 
        a += w * (d - scene(p + n * d));
        w *= 0.5;
    }
    return clamp(1.0 - a, 0.0, 1.0);
}

// ----- Soft Pastel Palette -----
vec3 pastelPalette(float t) {
    // Pink, peach, lavender, mint, sky blue, yellow
    vec3 pastel[6];
    pastel[0] = vec3(1.0, 0.8, 0.9); // pastel pink
    pastel[1] = vec3(1.0, 0.92, 0.8); // peach
    pastel[2] = vec3(0.85, 0.8, 1.0); // lavender
    pastel[3] = vec3(0.8, 1.0, 0.93); // mint
    pastel[4] = vec3(0.8, 0.9, 1.0); // sky blue
    pastel[5] = vec3(1.0, 1.0, 0.8); // yellow

    int idx = int(mod(t * 1.2, 6.0));
    int idx2 = int(mod(t * 1.2 + 1.0, 6.0));
    float blend = fract(t * 1.2);

    return mix(pastel[idx], pastel[idx2], blend);
}

// ----- Lighting with Cute Color -----
vec3 shade(vec3 pos, vec3 n, vec3 eyePos) {
    const vec3 lightPos = vec3(6.0, 12.0, 6.0);
    const float shininess = 60.0;

    float t = 0.22 * time + 0.13 * pos.x + 0.12 * pos.y + 0.19 * pos.z;
    vec3 baseColor = pastelPalette(t);

    vec3 l = normalize(lightPos - pos);
    vec3 v = normalize(eyePos - pos);
    vec3 h = normalize(v + l);
    float diff = 0.55 + 0.45 * dot(n, l);
    float spec = pow(max(dot(n, h), 0.0), shininess) * 0.6;
    float ao = ambientOcclusion(pos, n);

    // Add a soft highlight for cuteness ("kawaii sparkle")
    float sparkle = pow(max(dot(reflect(-l, n), v), 0.0), 16.0) * 1.5;

    // Subtle iridescence
    vec3 iridescent = 0.25 * (0.5 + 0.5 * cos(6.28318 * (vec3(0.75, 0.33, 0.12) + t)));

    // Combine all
    return baseColor * diff * ao + vec3(spec) + sparkle + iridescent * 0.45;
}

// ----- Voxel Traversal -----
const vec3 voxelSize = vec3(0.1);

vec3 worldToVoxel(vec3 p) { return floor(p / voxelSize); }
vec3 voxelToWorld(vec3 v) { return v * voxelSize; }

vec3 voxelTrace(vec3 ro, vec3 rd, out bool hit, out vec3 hitNormal) {
    const int maxSteps = 64;
    const float isoValue = 0.0;

    vec3 voxel = worldToVoxel(ro);
    vec3 step = sign(rd);
    vec3 nextVoxel = voxel + vec3(rd.x > 0.0, rd.y > 0.0, rd.z > 0.0);
    vec3 tMax = (voxelToWorld(nextVoxel) - ro) / rd;
    vec3 tDelta = voxelSize / abs(rd);

    vec3 hitVoxel = voxel;
    hit = false;
    for(int i = 0; i < maxSteps; i++) {
        float d = scene(voxelToWorld(voxel));
        if (d <= isoValue && !hit) {
            hit = true;
            hitVoxel = voxel;
        }
        bool c1 = tMax.x < tMax.y, c2 = tMax.x < tMax.z, c3 = tMax.y < tMax.z;
        if (c1 && c2)      { voxel.x += step.x; tMax.x += tDelta.x; if (!hit) hitNormal = vec3(-step.x, 0.0, 0.0); }
        else if (c3 && !c1){ voxel.y += step.y; tMax.y += tDelta.y; if (!hit) hitNormal = vec3(0.0, -step.y, 0.0); }
        else               { voxel.z += step.z; tMax.z += tDelta.z; if (!hit) hitNormal = vec3(0.0, 0.0, -step.z); }
    }
    return voxelToWorld(hitVoxel);
}

// ----- Kawaii Gradient Background -----
vec3 kawaiiBackground(vec3 rd) {
    // Rainbow pastel sunburst
    float angle = atan(rd.x, rd.z) / 6.28318 + 0.5;
    float t = mod(time * 0.08 + angle + 0.5 * rd.y, 1.0);
    vec3 pastel = pastelPalette(t);
    // Add a soft vignette
    float vignette = smoothstep(1.0, 0.6, abs(rd.y));
    return mix(pastel, vec3(1.0,1.0,1.0), 0.25) * vignette + 0.05;
}

// ----- Lovely Reflection -----
vec3 lovelyReflection(vec3 ro, vec3 rd, float time, out bool hit, out vec3 n) {
    vec3 pos = voxelTrace(ro, rd, hit, n);
    if(hit) {
        float t = 0.26 * time + 0.23 * pos.x + 0.18 * pos.y + 0.15 * pos.z;
        vec3 reflectColor = pastelPalette(t + 0.25 * sin(time + pos.x + pos.y));
        // Add sparkly overlay
        reflectColor += 0.3 * abs(sin(12.0 * (pos.x + pos.y + time)));
        reflectColor = mix(reflectColor, vec3(1.0), 0.15); // soft highlight
        return reflectColor;
    } else {
        return kawaiiBackground(rd);
    }
}

// ----- Main -----
void main(void) {
    vec2 pixel = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    float aspect = resolution.x / resolution.y;
    vec3 rd = normalize(vec3(aspect * pixel.x, pixel.y, -2.0));
    vec3 ro = vec3(0.0, 0.25, 4.5) + rd * 2.0;

    // Camera controls (mouse-driven)
    float angleX = -(1.0 - mouse.y) * 1.5;
    float angleY = -(mouse.x - 0.5) * 3.0;
    rd = rotateX(rd, angleX); ro = rotateX(ro, angleX);
    rd = rotateY(rd, angleY); ro = rotateY(ro, angleY);

    bool hit;
    vec3 n;
    vec3 pos = voxelTrace(ro, rd, hit, n);

    vec3 color;
    if (hit) {
        color = shade(pos, n, ro);

        // Beautiful, pastel reflection
        vec3 v = normalize(ro - pos);
        float fresnel = 0.12 + 0.35 * pow(1.0 - dot(n, v), 5.0);
        ro = pos + n * 0.01;
        rd = reflect(-v, n);

        bool refHit;
        vec3 refN;
        vec3 reflectColor = lovelyReflection(ro, rd, time, refHit, refN);
        color = mix(color, reflectColor, fresnel);
    } else {
        color = kawaiiBackground(rd);
    }

    // Subtle bloom around edges for cuteness
    float vignette = smoothstep(0.85, 0.3, length(pixel));
    color = mix(color, vec3(1.0), 0.12 * vignette);

    gl_FragColor = vec4(color, 1.0);
}
