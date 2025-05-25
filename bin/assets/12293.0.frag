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
float sdSphere(vec3 p, float r) { return length(p) - r; }
float sdEllipsoid(vec3 p, vec3 r) {
    float k0 = length(p/r);
    float k1 = length(p/(r*r));
    return k0*(k0-1.0)/k1;
}
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
    return length(pa - ba*h) - r;
}

vec3 rotateX(vec3 p, float a) {
    float sa = sin(a), ca = cos(a);
    return vec3(p.x, ca*p.y - sa*p.z, sa*p.y + ca*p.z);
}
vec3 rotateY(vec3 p, float a) {
    float sa = sin(a), ca = cos(a);
    return vec3(ca*p.x + sa*p.z, p.y, -sa*p.x + ca*p.z);
}

// ----- Scene SDF with Human Face -----
float faceSDF(vec3 p) {
    // Head (ellipsoid for cuteness)
    float head = sdEllipsoid(p, vec3(0.6, 0.75, 0.6));

    // Cheeks (slightly offset spheres)
    float cheekL = sdSphere(p - vec3(-0.33, -0.18, 0.32), 0.17);
    float cheekR = sdSphere(p - vec3( 0.33, -0.18, 0.32), 0.17);

    // Eyes (depressions in head)
    float eyeL = -sdSphere(p - vec3(-0.23, 0.08, 0.53), 0.09);
    float eyeR = -sdSphere(p - vec3( 0.23, 0.08, 0.53), 0.09);

    // Nose (tiny bump)
    float nose = sdSphere(p - vec3(0.0, -0.06, 0.63), 0.06);

    // Mouth (capsule)
    float m = 0.12 + 0.03*sin(time*1.5);
    float mouth = sdCapsule(p, vec3(-0.11, -0.22, 0.56), vec3(0.11, -0.22, 0.56), m);

    // Ears (ellipsoids)
    float earL = sdEllipsoid(p - vec3(-0.46, 0.15, 0.0), vec3(0.11, 0.19, 0.14));
    float earR = sdEllipsoid(p - vec3( 0.46, 0.15, 0.0), vec3(0.11, 0.19, 0.14));

    // Combine all
    float face = head;
    face = opUnion(face, cheekL);
    face = opUnion(face, cheekR);
    face = opUnion(face, nose);
    face = opUnion(face, earL);
    face = opUnion(face, earR);

    // Carve eyes and mouth
    face = opUnion(face, eyeL);
    face = opUnion(face, eyeR);
    face = opUnion(face, mouth);

    return face;
}

float scene(vec3 p) {
    float d = faceSDF(p);

    // Add cute floating bubbles
    for (int i=0; i<3; i++) {
        float angle = time * 0.7 + float(i) * 2.1;
        vec3 offset = vec3(sin(angle)*2.0, 1.2+0.7*sin(angle*1.2), cos(angle)*1.2);
        d = opUnion(d, sdSphere(p - offset, 0.22 + 0.09*sin(angle*2.7)));
    }

    // Add ground plane
    d = opUnion(d, sdPlane(p, vec3(0.0, 1.0, 0.0), vec3(0.0, -0.85, 0.0)));
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

// ----- Pastel Palette -----
vec3 pastelPalette(float t) {
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

// ----- Shading -----
vec3 shade(vec3 pos, vec3 n, vec3 eyePos) {
    const vec3 lightPos = vec3(6.0, 12.0, 6.0);
    const float shininess = 60.0;

    // Pastel face, pinkish for skin, blue for eyes, red for mouth, etc.
    float t = 0.19 * time + 0.14 * pos.x + 0.13 * pos.y + 0.16 * pos.z;
    vec3 baseColor = pastelPalette(t);

    // Feature coloring
    // Eyes
    if (length(pos - vec3(-0.23, 0.08, 0.53)) < 0.09+0.01 || length(pos - vec3(0.23, 0.08, 0.53)) < 0.09+0.01)
        baseColor = mix(vec3(0.25,0.35,0.55), baseColor, 0.2);
    // Nose
    if (length(pos - vec3(0.0, -0.06, 0.63)) < 0.06+0.01)
        baseColor = mix(vec3(1.0,0.8,0.7), baseColor, 0.6);
    // Mouth
    if (abs(pos.y+0.22) < 0.03 && abs(pos.z-0.56)<0.03 && abs(pos.x)<0.12)
        baseColor = mix(vec3(1.0,0.45,0.6), baseColor, 0.5);
    // Cheeks
    if (length(pos - vec3(-0.33, -0.18, 0.32)) < 0.17+0.01 || length(pos - vec3(0.33, -0.18, 0.32)) < 0.17+0.01)
        baseColor = mix(vec3(1.0,0.7,0.8), baseColor, 0.4);

    vec3 l = normalize(lightPos - pos);
    vec3 v = normalize(eyePos - pos);
    vec3 h = normalize(v + l);
    float diff = 0.65 + 0.35 * dot(n, l);
    float spec = pow(max(dot(n, h), 0.0), shininess) * 0.7;
    float ao = ambientOcclusion(pos, n);

    // Add a soft highlight for cuteness
    float sparkle = pow(max(dot(reflect(-l, n), v), 0.0), 16.0) * 1.3;

    // Subtle iridescence
    vec3 iridescent = 0.21 * (0.5 + 0.5 * cos(6.28318 * (vec3(0.85, 0.31, 0.22) + t)));

    return baseColor * diff * ao + vec3(spec) + sparkle + iridescent * 0.41;
}

// ----- Voxel Traversal -----
const vec3 voxelSize = vec3(0.07);

vec3 worldToVoxel(vec3 p) { return floor(p / voxelSize); }
vec3 voxelToWorld(vec3 v) { return v * voxelSize; }

vec3 voxelTrace(vec3 ro, vec3 rd, out bool hit, out vec3 hitNormal) {
    const int maxSteps = 88;
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
    float angle = atan(rd.x, rd.z) / 6.28318 + 0.5;
    float t = mod(time * 0.08 + angle + 0.5 * rd.y, 1.0);
    vec3 pastel = pastelPalette(t);
    float vignette = smoothstep(1.0, 0.66, abs(rd.y));
    return mix(pastel, vec3(1.0,1.0,1.0), 0.17) * vignette + 0.07;
}

// ----- Lovely Reflection -----
vec3 lovelyReflection(vec3 ro, vec3 rd, float time, out bool hit, out vec3 n) {
    vec3 pos = voxelTrace(ro, rd, hit, n);
    if(hit) {
        float t = 0.19 * time + 0.18 * pos.x + 0.12 * pos.y + 0.12 * pos.z;
        vec3 reflectColor = pastelPalette(t + 0.22 * sin(time + pos.x + pos.y));
        reflectColor += 0.2 * abs(sin(10.0 * (pos.x + pos.y + time)));
        reflectColor = mix(reflectColor, vec3(1.0), 0.11);
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
    vec3 ro = vec3(0.0, 0.15, 3.2) + rd * 1.4;

    // Camera controls (mouse-driven)
    float angleX = -(1.0 - mouse.y) * 1.5;
    float angleY = -(mouse.x - 0.5) * 2.0;
    rd = rotateX(rd, angleX); ro = rotateX(ro, angleX);
    rd = rotateY(rd, angleY); ro = rotateY(ro, angleY);

    bool hit;
    vec3 n;
    vec3 pos = voxelTrace(ro, rd, hit, n);

    vec3 color;
    if (hit) {
        color = shade(pos, n, ro);

        // Pastel reflection
        vec3 v = normalize(ro - pos);
        float fresnel = 0.12 + 0.26 * pow(1.0 - dot(n, v), 5.0);
        ro = pos + n * 0.009;
        rd = reflect(-v, n);

        bool refHit;
        vec3 refN;
        vec3 reflectColor = lovelyReflection(ro, rd, time, refHit, refN);
        color = mix(color, reflectColor, fresnel);
    } else {
        color = kawaiiBackground(rd);
    }

    // Subtle bloom around edges for even more cuteness
    float vignette = smoothstep(0.82, 0.22, length(pixel));
    color = mix(color, vec3(1.0), 0.11 * vignette);

    gl_FragColor = vec4(color, 1.0);
}
