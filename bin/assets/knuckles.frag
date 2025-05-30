#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

// --- SDF helpers ---
float sdSphere(vec3 p, float r) { return length(p)-r; }
float sdEllipsoid(vec3 p, vec3 r) { return (length(p/r)-1.0)*min(min(r.x,r.y),r.z); }
float sdBox(vec3 p, vec3 b) { vec3 q=abs(p)-b; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0); }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
    return length(pa - ba*h) - r;
}
float sdCone(vec3 p, float h, float r1, float r2) {
    float d1 = -p.y - h;
    float d2 = p.y;
    float r = mix(r1, r2, clamp(p.y/h, 0.0, 1.0));
    float d3 = length(p.xz) - r;
    float inside = max(d1, d2);
    float outside = min(max(d3, inside), 0.0) + length(max(vec2(d3, inside), 0.0));
    return outside;
}
// Smooth min for blending SDFs (for shoes)
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0-h);
}

// --- Model base position (centered for camera) ---
vec3 K = vec3(0.0, 0.19, 0.0);

// --- Head (oval, slightly squashed) ---
float knuxHead(vec3 p) {
    return sdEllipsoid(p - (K + vec3(0.0, 0.13, 0.05)), vec3(0.17, 0.13, 0.13));
}

// --- Ears (pointy, slightly out/up) ---
float knuxEarL(vec3 p) {
    vec3 q = p - (K + vec3(-0.14, 0.25, 0.03));
    q.xy = mat2(cos(-0.3),-sin(-0.3),sin(-0.3),cos(-0.3)) * q.xy;
    return sdEllipsoid(q, vec3(0.032, 0.056, 0.020));
}
float knuxEarR(vec3 p) {
    vec3 q = p - (K + vec3(0.14, 0.25, 0.03));
    q.xy = mat2(cos(0.3),-sin(0.3),sin(0.3),cos(0.3)) * q.xy;
    return sdEllipsoid(q, vec3(0.032, 0.056, 0.020));
}

// --- Dreads (12, curving down) ---
float knuxDread(vec3 p, float x0, float y0, float z0, float x1, float y1, float z1, float r) {
    return sdCapsule(p, K+vec3(x0,y0,z0), K+vec3(x1,y1,z1), r);
}
float knuxDreadL1(vec3 p) { return knuxDread(p, -0.07,0.20,0.06, -0.22,0.09,-0.22, 0.034); }
float knuxDreadL2(vec3 p) { return knuxDread(p, -0.04,0.18,0.10, -0.17,0.01,-0.28, 0.029); }
float knuxDreadL3(vec3 p) { return knuxDread(p, -0.01,0.17,0.12, -0.07,-0.02,-0.32, 0.025); }
float knuxDreadL4(vec3 p) { return knuxDread(p, -0.10,0.19,0.0, -0.24,0.03,-0.08, 0.027); }
float knuxDreadL5(vec3 p) { return knuxDread(p, -0.13,0.19,0.03, -0.30,0.05,-0.11, 0.021); }
float knuxDreadR1(vec3 p) { return knuxDread(p, 0.07,0.20,0.06, 0.22,0.09,-0.22, 0.034); }
float knuxDreadR2(vec3 p) { return knuxDread(p, 0.04,0.18,0.10, 0.17,0.01,-0.28, 0.029); }
float knuxDreadR3(vec3 p) { return knuxDread(p, 0.01,0.17,0.12, 0.07,-0.02,-0.32, 0.025); }
float knuxDreadR4(vec3 p) { return knuxDread(p, 0.10,0.19,0.0, 0.24,0.03,-0.08, 0.027); }
float knuxDreadR5(vec3 p) { return knuxDread(p, 0.13,0.19,0.03, 0.30,0.05,-0.11, 0.021); }
float knuxDreadC1(vec3 p) { return knuxDread(p, -0.02,0.17,0.13, -0.04,-0.04,-0.33, 0.024); }
float knuxDreadC2(vec3 p) { return knuxDread(p, 0.02,0.17,0.13, 0.04,-0.04,-0.33, 0.024); }

// --- Muzzle (large, tan, rounded) ---
float knuxSnout(vec3 p) {
    return sdEllipsoid(p - (K + vec3(0.0, 0.10, 0.13)), vec3(0.076, 0.045, 0.10));
}
float knuxNose(vec3 p) {
    return sdSphere(p - (K + vec3(0.0, 0.13, 0.19)), 0.023);
}

// --- Brows (thick, angled) ---
float knuxBrowL(vec3 p) {
    return sdCapsule(p, K+vec3(-0.03,0.19,0.16), K+vec3(-0.10,0.18,0.15), 0.019);
}
float knuxBrowR(vec3 p) {
    return sdCapsule(p, K+vec3(0.03,0.19,0.16), K+vec3(0.10,0.18,0.15), 0.019);
}

// --- Eyes ---
float knuxEyeL(vec3 p) {
    vec3 q = p - (K + vec3(-0.045, 0.158, 0.17));
    q.xy = mat2(cos(-0.14),-sin(-2.7),sin(-0.14),cos(-0.14))*q.xy;
    return sdEllipsoid(q, vec3(0.0327, 0.0321, 0.012));
}
float knuxEyeR(vec3 p) {
    vec3 q = p - (K + vec3(0.045, 0.158, 0.17));
    q.xy = mat2(cos(0.14),-sin(2.7),sin(0.1),cos(0.14))*q.xy;
    return sdEllipsoid(q, vec3(0.0327, 0.0321, 0.012));
}
float knuxIrisL(vec3 p) { return sdEllipsoid(p - (K + vec3(-0.045, 0.158, 0.178)), vec3(0.014, 0.014, 0.009)); }
float knuxIrisR(vec3 p) { return sdEllipsoid(p - (K + vec3(0.045, 0.158, 0.178)), vec3(0.014, 0.014, 0.009)); }
float knuxPupilL(vec3 p) { return sdEllipsoid(p - (K + vec3(-0.045, 0.158, 0.188)), vec3(0.005, 0.005, 0.004)); }
float knuxPupilR(vec3 p) { return sdEllipsoid(p - (K + vec3(0.045, 0.158, 0.188)), vec3(0.005, 0.005, 0.004)); }

// --- Mouth: arc shape, big grin ---
float knuxMouth(vec3 p) {
    vec3 q = p - (K + vec3(0.0, 0.08, 0.15));
    float r = 0.043;
    float arc = abs(length(q.xy)-r);
    float zArc = abs(q.z);
    return max(arc-0.009, zArc-0.012);
}

// --- Body ---
float knuxBody(vec3 p) { return sdEllipsoid(p - (K + vec3(0.0, -0.04, 0.01)), vec3(0.072, 0.13, 0.06)); }
float knuxChest(vec3 p) { return sdEllipsoid(p - (K + vec3(0.0, -0.02, 0.08)), vec3(0.045, 0.017, 0.023)); }

// --- Arms w/ tape bands (reference pose) ---
float knuxArmL(vec3 p) {
    vec3 a = K+vec3(-0.07, -0.01, 0.03);
    vec3 b = K+vec3(-0.30, 0.10, 0.09);
    return sdCapsule(p, a, b, 0.032);
}
float knuxArmR(vec3 p) {
    vec3 a = K+vec3(0.07, -0.01, 0.03);
    vec3 b = K+vec3(0.30, 0.10, 0.09);
    return sdCapsule(p, a, b, 0.032);
}
float knuxTapeBandL(vec3 p) {
    vec3 a = K+vec3(-0.18, 0.05,0.07);
    vec3 b = K+vec3(-0.22, 0.08,0.08);
    return sdCapsule(p, a, b, 0.038);
}
float knuxTapeBandR(vec3 p) {
    vec3 a = K+vec3(0.18, 0.05,0.07);
    vec3 b = K+vec3(0.22, 0.08,0.08);
    return sdCapsule(p, a, b, 0.038);
}

// --- Gloves (5 fingers per hand, subtle adjustment) ---
float knuxHandL(vec3 p) {
    float palm = sdEllipsoid(p - (K + vec3(-0.32, 0.14, 0.11)), vec3(0.055, 0.054, 0.065));
    float fingers = 1e5;
    for(int i=0; i<4; i++) {
        float x = -0.32 - 0.018 * float(i);
        float y = 0.14 + 0.024 * float(i);
        float z = 0.14 + 0.01 * float(i);
        fingers = min(fingers, sdCapsule(p, K+vec3(x, y, z), K+vec3(x-0.03, y+0.01, z+0.03), 0.014));
    }
    fingers = min(fingers, sdCapsule(p, K+vec3(-0.33, 0.16, 0.10), K+vec3(-0.37, 0.20, 0.07), 0.016));
    return min(palm, fingers);
}
float knuxHandR(vec3 p) {
    float palm = sdEllipsoid(p - (K + vec3(0.32, 0.14, 0.11)), vec3(0.055, 0.054, 0.065));
    float fingers = 1e5;
    for(int i=0; i<4; i++) {
        float x = 0.32 + 0.018 * float(i);
        float y = 0.14 + 0.024 * float(i);
        float z = 0.14 + 0.01 * float(i);
        fingers = min(fingers, sdCapsule(p, K+vec3(x, y, z), K+vec3(x+0.03, y+0.01, z+0.03), 0.014));
    }
    fingers = min(fingers, sdCapsule(p, K+vec3(0.33, 0.16, 0.10), K+vec3(0.37, 0.20, 0.07), 0.016));
    return min(palm, fingers);
}

// --- Glove Spikes (pointier) ---
float knuxSpikeL1(vec3 p) {
    return sdCone(p-(K+vec3(-0.35,0.12,0.14)), 0.055, 0.008, 0.0);
}
float knuxSpikeL2(vec3 p) {
    return sdCone(p-(K+vec3(-0.30,0.12,0.14)), 0.055, 0.008, 0.0);
}
float knuxSpikeR1(vec3 p) {
    return sdCone(p-(K+vec3(0.35,0.12,0.14)), 0.055, 0.008, 0.0);
}
float knuxSpikeR2(vec3 p) {
    return sdCone(p-(K+vec3(0.30,0.12,0.14)), 0.055, 0.008, 0.0);
}

// --- Legs w/ tape bands (reference pose) ---
float knuxLegL(vec3 p) {
    vec3 a = K+vec3(-0.03, -0.13, 0.025);
    vec3 b = K+vec3(-0.11, -0.33, 0.04);
    return sdCapsule(p, a, b, 0.024);
}
float knuxLegR(vec3 p) {
    vec3 a = K+vec3(0.03, -0.13, 0.025);
    vec3 b = K+vec3(0.11, -0.33, 0.04);
    return sdCapsule(p, a, b, 0.024);
}
float knuxTapeLegL(vec3 p) {
    vec3 a = K+vec3(-0.09, -0.22, 0.04);
    vec3 b = K+vec3(-0.11, -0.28, 0.045);
    return sdCapsule(p, a, b, 0.029);
}
float knuxTapeLegR(vec3 p) {
    vec3 a = K+vec3(0.09, -0.22, 0.04);
    vec3 b = K+vec3(0.11, -0.28, 0.045);
    return sdCapsule(p, a, b, 0.029);
}

// --- Shoes: more curved using SDF blend ---
float knuxShoeL(vec3 p) { 
    vec3 shoeCenter = K + vec3(-0.13, -0.40, 0.04);
    float box = sdBox(p - shoeCenter, vec3(0.059, 0.034, 0.13));
    float ellipsoid = sdEllipsoid(p - shoeCenter, vec3(0.06, 0.045, 0.14));
    float blended = smin(box, ellipsoid, 0.07);
    float tongue = sdBox(p - (K + vec3(-0.13, -0.37, 0.08)), vec3(0.028, 0.018, 0.045));
    return min(blended, tongue);
}
float knuxShoeR(vec3 p) { 
    vec3 shoeCenter = K + vec3(0.13, -0.40, 0.04);
    float box = sdBox(p - shoeCenter, vec3(0.059, 0.034, 0.13));
    float ellipsoid = sdEllipsoid(p - shoeCenter, vec3(0.06, 0.045, 0.14));
    float blended = smin(box, ellipsoid, 0.07);
    float tongue = sdBox(p - (K + vec3(0.13, -0.37, 0.08)), vec3(0.028, 0.018, 0.045));
    return min(blended, tongue);
}
float knuxCuffL(vec3 p) { return sdBox(p - (K + vec3(-0.13, -0.36, 0.04)), vec3(0.064, 0.017, 0.11)); }
float knuxCuffR(vec3 p) { return sdBox(p - (K + vec3(0.13, -0.36, 0.04)), vec3(0.064, 0.017, 0.11)); }

float knuxTail(vec3 p) {
    return sdCone(p - (K + vec3(0.0, -0.094, -0.0439)), 0.08, 0.018, 0.0);
}

// --- Floor (water), animated with richer distortion ---
/**
float waterFloor(vec3 p) {
    float n = sin(8.0*p.x+time*1.2)*sin(8.0*p.z+time*1.4);
    n += 0.4*sin(3.0*p.x+time*0.7+cos(p.z+time*0.3))*cos(2.0*p.z+time*0.85);
    return p.y + 0.82 + 0.04*n;
}
**/
float waterFloor(vec3 p) {
    float n = sin(8.0*p.x+time*1.2)*sin(8.0*p.z+time*1.4);
    n += 0.4*sin(3.0*p.x+time*0.7+cos(p.z+time*0.3))*cos(2.0*p.z+time*0.85);
    return p.y + 0.62 + 0.04*n; // lowered from +0.82 to +0.62
}


// --- Sonic Checkerboard Floor ---
vec3 sonicCheckerboard(vec2 pos) {
    float scale = 4.0;
    float check = step(0.5, fract((pos.x+100.0)/scale)) + step(0.5, fract((pos.y+100.0)/scale));
    check = mod(check, 2.0);
    return mix(vec3(0.48,0.33,0.06), vec3(0.91,0.80,0.31), check); 
}

// --- Simple Sky Gradient + Rays of Light ---
vec3 sonicSky(vec2 uv) {
    vec3 base = mix(vec3(0.32,0.73,1.0), vec3(0.8,0.95,1.0), uv.y*0.7+0.3);
    vec2 sun = vec2(0.65,0.52);
    float dist = length(uv-sun);
    float rays = 0.2*sin(20.0*atan(uv.y-sun.y,uv.x-sun.x)+time*0.3+sin(uv.y*3.0+time));
    float rayMask = smoothstep(0.25,0.0,dist)*max(0.0,rays);
    return mix(base, vec3(1.0,1.0,0.85), rayMask*0.4);
}

// --- Background Palm Tree SDF (richer: more leaves, more instances) ---
float palmTreeSDF(vec3 p, vec3 base) {
    float trunk = sdCapsule(p, base, base+vec3(0,0.3,0), 0.025);
    float leaves = min(
        sdCapsule(p, base+vec3(0,0.3,0), base+vec3(0.2,0.45,0), 0.04),
        min(
            sdCapsule(p, base+vec3(0,0.3,0), base+vec3(-0.2,0.45,0), 0.04),
            min(
                sdCapsule(p, base+vec3(0,0.3,0), base+vec3(0.1,0.53,0.13), 0.04),
                min(
                    sdCapsule(p, base+vec3(0,0.3,0), base+vec3(-0.1,0.53,-0.13), 0.04),
                    min(
                        sdCapsule(p, base+vec3(0,0.3,0), base+vec3(0.0,0.52,0.19), 0.04),
                        sdCapsule(p, base+vec3(0,0.3,0), base+vec3(0.0,0.47,-0.19), 0.04)
                    )
                )
            )
        )
    );
    return min(trunk, leaves);
}

// --- Sonic World Rock SDF (simple) ---
float rockSDF(vec3 p, vec3 rockCenter, vec3 rockSize, float noiseAmp) {
    vec3 q = p - rockCenter;
    float n = sin(q.x * 7.0 + time * 0.7) * sin(q.z * 6.0 - time * 0.4) * noiseAmp;
    return sdEllipsoid(q, rockSize + n);
}

// --- Scene SDF ---
float map(vec3 p, out int partId) {
    float d=1e5; partId=-1;
    float khead = knuxHead(p); if(khead<d){ d=khead; partId=1;}
    float kearL = knuxEarL(p); if(kearL<d){ d=kearL; partId=2;}
    float kearR = knuxEarR(p); if(kearR<d){ d=kearR; partId=3;}
    float ksnout = knuxSnout(p); if(ksnout<d){ d=ksnout; partId=4;}
    float knose = knuxNose(p); if(knose<d){ d=knose; partId=5;}
    float kbrowL = knuxBrowL(p); if(kbrowL<d){ d=kbrowL; partId=6;}
    float kbrowR = knuxBrowR(p); if(kbrowR<d){ d=kbrowR; partId=7;}
    float keyeL = knuxEyeL(p); if(keyeL<d){ d=keyeL; partId=8;}
    float keyeR = knuxEyeR(p); if(keyeR<d){ d=keyeR; partId=9;}
    float kirisL = knuxIrisL(p); if(kirisL<d){ d=kirisL; partId=10;}
    float kirisR = knuxIrisR(p); if(kirisR<d){ d=kirisR; partId=11;}
    float kpupilL = knuxPupilL(p); if(kpupilL<d){ d=kpupilL; partId=12;}
    float kpupilR = knuxPupilR(p); if(kpupilR<d){ d=kpupilR; partId=13;}
    float kmouth = knuxMouth(p); if(kmouth<d){ d=kmouth; partId=14;}
    float kdreadL1 = knuxDreadL1(p); if(kdreadL1<d){ d=kdreadL1; partId=15;}
    float kdreadL2 = knuxDreadL2(p); if(kdreadL2<d){ d=kdreadL2; partId=16;}
    float kdreadL3 = knuxDreadL3(p); if(kdreadL3<d){ d=kdreadL3; partId=17;}
    float kdreadL4 = knuxDreadL4(p); if(kdreadL4<d){ d=kdreadL4; partId=18;}
    float kdreadL5 = knuxDreadL5(p); if(kdreadL5<d){ d=kdreadL5; partId=19;}
    float kdreadR1 = knuxDreadR1(p); if(kdreadR1<d){ d=kdreadR1; partId=20;}
    float kdreadR2 = knuxDreadR2(p); if(kdreadR2<d){ d=kdreadR2; partId=21;}
    float kdreadR3 = knuxDreadR3(p); if(kdreadR3<d){ d=kdreadR3; partId=22;}
    float kdreadR4 = knuxDreadR4(p); if(kdreadR4<d){ d=kdreadR4; partId=23;}
    float kdreadR5 = knuxDreadR5(p); if(kdreadR5<d){ d=kdreadR5; partId=24;}
    float kdreadC1 = knuxDreadC1(p); if(kdreadC1<d){ d=kdreadC1; partId=25;}
    float kdreadC2 = knuxDreadC2(p); if(kdreadC2<d){ d=kdreadC2; partId=26;}
    float kbody = knuxBody(p); if(kbody<d){ d=kbody; partId=27;}
    float kchest = knuxChest(p); if(kchest<d){ d=kchest; partId=28;}
    float karmL = knuxArmL(p); if(karmL<d){ d=karmL; partId=29;}
    float karmR = knuxArmR(p); if(karmR<d){ d=karmR; partId=30;}
    float ktapeL = knuxTapeBandL(p); if(ktapeL<d){ d=ktapeL; partId=31;}
    float ktapeR = knuxTapeBandR(p); if(ktapeR<d){ d=ktapeR; partId=32;}
    float khandL = knuxHandL(p); if(khandL<d){ d=khandL; partId=33;}
    float khandR = knuxHandR(p); if(khandR<d){ d=khandR; partId=34;}
    float kspikeL1 = knuxSpikeL1(p); if(kspikeL1<d){ d=kspikeL1; partId=35;}
    float kspikeL2 = knuxSpikeL2(p); if(kspikeL2<d){ d=kspikeL2; partId=36;}
    float kspikeR1 = knuxSpikeR1(p); if(kspikeR1<d){ d=kspikeR1; partId=37;}
    float kspikeR2 = knuxSpikeR2(p); if(kspikeR2<d){ d=kspikeR2; partId=38;}
    float klegL = knuxLegL(p); if(klegL<d){ d=klegL; partId=39;}
    float klegR = knuxLegR(p); if(klegR<d){ d=klegR; partId=40;}
    float ktapeLL = knuxTapeLegL(p); if(ktapeLL<d){ d=ktapeLL; partId=41;}
    float ktapeLR = knuxTapeLegR(p); if(ktapeLR<d){ d=ktapeLR; partId=42;}
    float kshoeL = knuxShoeL(p); if(kshoeL<d){ d=kshoeL; partId=43;}
    float kshoeR = knuxShoeR(p); if(kshoeR<d){ d=kshoeR; partId=44;}
    float kcuffL = knuxCuffL(p); if(kcuffL<d){ d=kcuffL; partId=45;}
    float kcuffR = knuxCuffR(p); if(kcuffR<d){ d=kcuffR; partId=46;}
    float ktail = knuxTail(p); if(ktail<d){ d=ktail; partId=47;}
    float floor = waterFloor(p); if(floor<d){ d=floor; partId=199;}
    // Palms
    float palm1 = palmTreeSDF(p, vec3(-0.35,0.0,-1.0));
    if(palm1<d) { d=palm1; partId=200; }
    float palm2 = palmTreeSDF(p, vec3(0.45,0.0,-1.2));
    if(palm2<d) { d=palm2; partId=201; }
    float palm3 = palmTreeSDF(p, vec3(-0.85,0.0,-1.3));
    if(palm3<d) { d=palm3; partId=202; }
    float palm4 = palmTreeSDF(p, vec3(0.80,0.0,-1.1));
    if(palm4<d) { d=palm4; partId=203; }
    float palm5 = palmTreeSDF(p, vec3(-1.1,0.0,-1.8));
    if(palm5<d) { d=palm5; partId=204; }
    float palm6 = palmTreeSDF(p, vec3(1.05,0.0,-1.7));
    if(palm6<d) { d=palm6; partId=205; }
    // Rocks
    float rock1 = rockSDF(p, vec3(-0.25, 0.01, -0.7), vec3(0.21,0.12,0.16), 0.07);
    if(rock1<d) { d=rock1; partId=300; }
    float rock2 = rockSDF(p, vec3(0.22, 0.02, -0.9), vec3(0.13,0.10,0.19), 0.04);
    if(rock2<d) { d=rock2; partId=301; }
    float rock3 = rockSDF(p, vec3(0.55, 0.01, -1.1), vec3(0.23,0.15,0.14), 0.06);
    if(rock3<d) { d=rock3; partId=302; }
    float rock4 = rockSDF(p, vec3(-0.65, 0.00, -0.95), vec3(0.09,0.06,0.13), 0.03);
    if(rock4<d) { d=rock4; partId=303; }
    float rock5 = rockSDF(p, vec3(0.65, 0.02, -1.3), vec3(0.17,0.11,0.10), 0.05);
    if(rock5<d) { d=rock5; partId=304; }
    float rock6 = rockSDF(p, vec3(-1.05, 0.01, -1.5), vec3(0.15,0.12,0.18), 0.06);
    if(rock6<d) { d=rock6; partId=305; }
    float rock7 = rockSDF(p, vec3(1.10, 0.01, -1.6), vec3(0.18,0.13,0.10), 0.05);
    if(rock7<d) { d=rock7; partId=306; }
    float rock8 = rockSDF(p, vec3(-1.15, 0.01, -1.8), vec3(0.12,0.09,0.13), 0.04);
    if(rock8<d) { d=rock8; partId=307; }
    float rock9 = rockSDF(p, vec3(1.25, 0.01, -1.9), vec3(0.14,0.11,0.09), 0.03);
    if(rock9<d) { d=rock9; partId=308; }
    float rock10 = rockSDF(p, vec3(0.0, 0.01, -1.1), vec3(0.18,0.13,0.17), 0.07);
    if(rock10<d) { d=rock10; partId=309; }
    return d;
}

// --- Raymarch helpers, lighting, fog, fresnel ---
vec3 getNormal(vec3 p){int id;float e=0.002;return normalize(vec3(map(p+vec3(e,0,0),id)-map(p-vec3(e,0,0),id),map(p+vec3(0,e,0),id)-map(p-vec3(0,e,0),id),map(p+vec3(0,0,e),id)-map(p-vec3(0,0,e),id)));}
float light(vec3 p,vec3 n,vec3 ldir){float diff=clamp(dot(n,ldir),0.0,1.0);float amb=0.37;return diff*0.8+amb;}
float softShadow(vec3 ro, vec3 rd, float k) {
    float res = 1.0, t = 0.02; int id;
    for(int i=0; i<40; i++) {
        float h = map(ro + rd * t, id);
        res = min(res, k * h / t);
        t += clamp(h, 0.01, 0.1);
        if(h < 0.001 || t > 2.5) break;
    }
    return clamp(res, 0.0, 1.0);
}
float fresnelTerm(vec3 n, vec3 v, float p) { return pow(1.0 - max(dot(n, v), 0.0), p); }
float phongSpecular(vec3 n, vec3 v, vec3 ldir, float shininess) {
    vec3 h = normalize(ldir + v);
    return pow(max(dot(n, h), 0.0), shininess);
}
float fogFactor(float dist, float density) {
    return 1.0 - exp(-dist * density);
}

// --- Main ---
void main(void) {
    vec2 uv = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
    vec3 col = sonicSky(uv);

    float camAngle = 0.4 * time;
    float camDist = 1.55;
    float camHeight = 0.13;
    vec3 look = vec3(0.0, 0.09, 0.0);
    vec3 ro = look + vec3(sin(camAngle)*camDist, camHeight, cos(camAngle)*camDist);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 forward = normalize(look - ro);
    vec3 right = normalize(cross(up, forward));
    vec3 up2 = cross(forward, right);

    vec3 rd = normalize(forward + uv.x * right * 1.05 + uv.y * up2 * 1.05);

    float t = 0.0;
    int partId = -1;
    bool hit = false;
    for(int i=0; i<150; i++) {
        vec3 p = ro + rd*t;
        float d = map(p, partId);
        if(d < 0.002) { hit = true; break; }
        t += d;
        if(t > 3.0) break;
    }

    float fogDensity = 1.4;
    float fog = fogFactor(t, fogDensity);

    if(hit) {
        vec3 p = ro + rd*t;
        vec3 n = getNormal(p);
        vec3 ldir = normalize(vec3(0.7,0.85,0.7));
        float li = light(p, n, ldir);
        float sshadow = softShadow(p + n*0.01, ldir, 32.0);
        float fres = fresnelTerm(n, -rd, 2.6);
        float spec = phongSpecular(n, -rd, ldir, 35.0);

        float refl = 0.0;
        if(partId==33||partId==34||partId==43||partId==44||partId==8||partId==9) {
            refl = fres * 0.22;
        }

        if(partId==1) col = vec3(0.79,0.08,0.15)*li + 0.2*spec;
        else if(partId==2||partId==3) col = vec3(0.79,0.08,0.15)*li + 0.2*spec;
        else if(partId==4) col = vec3(1.0,0.88,0.68)*li + 0.4*spec;
        else if(partId==5) col = vec3(0.08,0.06,0.13)*li + 0.9*spec;
        else if(partId==6||partId==7) col = vec3(0.73,0.09,0.15)*li + 0.7*spec;
        else if(partId==8||partId==9) col = vec3(1.0)*li + 0.7*spec + refl;
        else if(partId==10||partId==11) col = vec3(0.17,0.37,0.75)*li + 0.8*spec;
        else if(partId==12||partId==13) col = vec3(0.08,0.08,0.08)*li + 0.9*spec + refl;
        else if(partId==14) col = vec3(0.26,0.13,0.14)*li + 0.6*spec;
        else if(partId>=15&&partId<=26) col = vec3(0.79,0.08,0.15)*li + 0.2*spec;
        else if(partId==27) col = vec3(0.79,0.08,0.15)*li;
        else if(partId==28) col = vec3(1.0,0.97,0.16)*li + 0.2*spec;
        else if(partId==29||partId==30) col = vec3(0.79,0.08,0.15)*li;
        else if(partId==31||partId==32) col = vec3(1.0)*li + 0.5*spec;
        else if(partId==33||partId==34) col = vec3(1.0)*li + 0.6*spec + refl;
        else if(partId>=35&&partId<=38) col = vec3(0.95,0.95,0.94)*li + 0.95*spec;
        else if(partId==39||partId==40) col = vec3(0.79,0.08,0.15)*li;
        else if(partId==41||partId==42) col = vec3(1.0)*li + 0.5*spec;
        else if(partId==43||partId==44) col = vec3(0.70,0.25,0.12)*li + 0.3*spec + refl;
        else if(partId==45||partId==46) col = vec3(0.19,0.87,0.18)*li + 0.2*spec;
        else if(partId==47) col = vec3(0.79,0.08,0.15)*li + 0.2*spec;
        else if(partId==199) {
            vec2 ground_uv = (ro + rd*t).xz * 8.0;
            col = sonicCheckerboard(ground_uv);
        }
        else if(partId>=200&&partId<=205) col = vec3(0.14,0.49,0.13);
        else if(partId>=300&&partId<=309) {
            float rockShade = 0.14 + 0.08*sin(p.x*8.0+time*0.5)*sin(p.z*8.0-time*0.2);
            col = mix(vec3(0.41,0.34,0.23), vec3(0.64,0.59,0.52), rockShade);
            float s = phongSpecular(getNormal(p), -rd, normalize(vec3(0.7,0.85,0.7)), 15.0);
            col += s * 0.11;
        }
        col *= mix(0.55, 1.0, sshadow);
        col = mix(col, vec3(0.55,0.80,0.97), fog*0.8);
    } else {
        col = mix(col, vec3(0.55,0.80,0.97), fog);
    }

    gl_FragColor = vec4(col, 1.0);
}
