#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

// --- SDF Primitives ---
float sdSphere(vec3 p, float r) {
    return length(p)-r;
}
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p-a, ba = b-a;
    float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
    return length(pa-ba*h)-r;
}
float sdPlane(vec3 p, vec3 n, float h) {
    return dot(p,n)+h;
}
float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}
float sdCone(vec3 p, float h, float r1, float r2) {
    // https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
    float q = length(p.xz);
    float k1 = h*r2/(r2-r1), k2 = -h*r1/(r2-r1);
    float ca = atan(r2-r1,h);
    float d = max(dot(vec2(q,p.y), vec2(sin(ca),-cos(ca)))+k1, -p.y-k2);
    return d;
}

// --- Snowman SDF ---
float snowman(vec3 p, out int matID) {
    float b = sdSphere(p-vec3(0.0,0.23,0.0),0.23);
    float m = sdSphere(p-vec3(0.0,0.45,0.0),0.16);
    float h = sdSphere(p-vec3(0.0,0.61,0.0),0.12);
    float d = b;
    matID = 1; // body
    if(m < d) {d = m; matID = 1;}
    if(h < d) {d = h; matID = 1;}

    // Eyes
    float leye = sdSphere(p-vec3(-0.044,0.68,-0.2109),0.0218);
    float reye = sdSphere(p-vec3(0.044,0.68,-0.209),0.0218);
    if(leye < d) {d = leye; matID = 2;}
    if(reye < d) {d = reye; matID = 2;}

    // Buttons
    vec3 btns[3];
    btns[0] = vec3(0.0,0.50,-0.16); btns[1] = vec3(0.0,0.41,-0.18); btns[2] = vec3(0.0,0.32,-0.17);
    for(int i = 0; i < 3; i++) {
        float btn = sdSphere(p-btns[i],0.014);
        if(btn < d) {d = btn; matID = 2;}
    }

    // Carrot nose (capsule)
    float nose = sdCapsule(p, vec3(0.0,0.67,-0.12), vec3(0.07,0.67,0.19), 0.015);
    if(nose < d) {d = nose; matID = 3;}

    // Mouth (5 spheres)
    for(int i = -2; i <= 2; i++) {
        float ang = 0.5*float(i)/2.0;
        vec3 mouthPt = vec3(sin(ang)*0.041, 0.65-cos(ang)*0.032, -0.13);
        float mouth = sdSphere(p - mouthPt, 0.012);
        if(mouth < d) {d = mouth; matID = 2;}
    }
    // Arms (capsules)
    float armL = sdCapsule(p, vec3(-0.11,0.47,0.08), vec3(-0.36,0.73,0.14), 0.013);
    float armR = sdCapsule(p, vec3(0.11,0.47,0.08), vec3(0.36,0.73,0.04), 0.013);
    if(armL < d) {d = armL; matID = 4;}
    if(armR < d) {d = armR; matID = 4;}

    return d;
}

// --- Pine Tree SDF ---
float pineTree(vec3 p, out int matID) {
    // Tree position
    vec3 treePos = vec3(-0.8, 0.0, 0.7);
    vec3 tp = p - treePos;

    float t = 1e5;
    matID = 10;

    // Trunk (box)
    float trunk = sdBox(tp - vec3(0.0,0.17,0.0), vec3(0.04,0.17,0.04));
    if(trunk < t) { t = trunk; matID = 11; }

    // Pine layers (cones)
    float cone1 = sdCone(tp - vec3(0.0,0.54,0.0), 0.014, 0.0112, 0.05);
    float cone2 = sdCone(tp - vec3(0.0,0.0,0.0), 0.0020, 0.0017, 0.05);
    float cone3 = sdCone(tp - vec3(0.0,0.0072,0.0), 0.0013, 0.011, 0.03);

    if(cone1 < t) { t = cone1; matID = 12;}
    if(cone2 < t) { t = cone2; matID = 12;}
    if(cone3 < t) { t = cone3; matID = 12;}
    return t;
}

// --- Scene SDF ---
float map(vec3 p, out int matID) {
    float d = 1e5;
    int id = 0;
    float sm = snowman(p, id);
    d = sm;
    matID = id;

    // Tree
    int tid = 0;
    float td = pineTree(p, tid);
    if(td < d) {
        d = td;
        matID = tid;
    }

    // ground plane
    float plane = sdPlane(p, vec3(0,1,0), 0.0);
    if(plane < d) {
        d = plane;
        matID = 5;
    }
    return d;
}

// --- Lighting ---
vec3 getNormal(vec3 p) {
    int dummy;
    float eps = 0.001;
    vec2 e = vec2(1.0,-1.0)*0.5773;
    return normalize(e.xyy*map(p+e.xyy*eps,dummy) +
                     e.yyx*map(p+e.yyx*eps,dummy) +
                     e.yxy*map(p+e.yxy*eps,dummy) +
                     e.xxx*map(p+e.xxx*eps,dummy));
}
float softshadow(vec3 ro, vec3 rd, float mint, float tmax, float k) {
    float res = 1.0;
    float t = mint;
    int dummy;
    for(int i = 0; i < 32; i++) {
        float h = map(ro + rd*t, dummy);
        res = min(res, k*h/t);
        t += clamp(h,0.02,0.20);
        if(res < 0.01 || t > tmax) break;
    }
    return clamp(res,0.0,1.0);
}

// --- Falling Snow ---
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
float snowParticle(vec3 p, float t, float size) {
    float snow = 1e5;
    for(int i=0; i<32; i++) {
        float fi = float(i);
        vec3 cell = vec3(mod(fi,8.0)-4.0, 0.0, floor(fi/8.0)-2.0);
        vec3 pos = cell * 0.7;
        float y = mod(p.y + 1.0 + t*0.7 + noise(cell.xy + time)*0.9, 3.0) - 1.0;
        pos.y = y;
        snow = min(snow, length(p - pos) - size);
    }
    return snow;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    // Camera
    vec3 ro = vec3(0.0,0.45,-1.65);
    vec3 ta = vec3(0.0,0.45,0.0);
    float focus = 1.0;
    // Camera lookat
    vec3 ww = normalize(ta-ro);
    vec3 uu = normalize(cross(ww, vec3(0,1,0)));
    vec3 vv = cross(uu, ww);
    vec3 rd = normalize(uv.x*uu + uv.y*vv + focus*ww);

    // Raymarch
    float t = 0.0;
    int matID = 0;
    float maxdist = 6.0;
    bool hit = false;
    vec3 p;
    for(int i=0; i<120; i++) {
        p = ro + rd*t;
        float d = map(p, matID);
        if(d < 0.001) {hit = true; break;}
        if(t > maxdist) break;
        t += d;
    }

    // Background
    vec3 col = vec3(0.68, 0.85, 1.0);

    if(hit) {
        // Material colors
        vec3 matCol;
        if(matID == 1) matCol = vec3(1.0, 1.0, 1.0); // snow
        else if(matID == 2) matCol = vec3(0.15,0.11,0.10); // buttons, eyes, mouth
        else if(matID == 3) matCol = vec3(0.9, 0.45, 0.1); // carrot
        else if(matID == 4) matCol = vec3(0.35,0.23,0.11); // arms
        else if(matID == 5) matCol = vec3(1.0,1.0,1.0); // ground
        else if(matID == 11) matCol = vec3(0.36,0.23,0.09); // tree trunk
        else if(matID == 12) matCol = vec3(0.16,0.41,0.15); // pine green
        else matCol = vec3(1.0,0.0,0.0); // debug

        // Light
        vec3 lp = vec3(-1.2, 1.4, -1.1);
        vec3 ldir = normalize(lp-p);
        vec3 n = getNormal(p);
        float diff = max(dot(n, ldir), 0.0);
        float sh = softshadow(p + n*0.01, ldir, 0.02, 2.5, 32.0);
        diff *= sh;
        float amb = 0.35 + 0.25*n.y;
        float spec = pow(max(dot(reflect(-ldir,n), -rd),0.0), 20.0) * 0.18;
        // Snowman soft blue shadow
        vec3 shadowCol = matCol;
        if(matID == 1 || matID == 5)
            shadowCol = mix(matCol, vec3(0.65,0.78,0.97), 0.12*(1.0-n.y));
        col = shadowCol*amb + matCol*diff + vec3(1.0)*spec;
        col = clamp(col, 0.0, 1.0);
    }

    // Add ground shadow
    if(!hit) {
        float planeY = (0.0 - ro.y) / rd.y;
        if(planeY > 0.0 && planeY < maxdist && abs(rd.y) > 0.01) {
            vec3 hitPt = ro + rd * planeY;
            float d = length(hitPt.xz);
            if(d < 0.45) {
                col = mix(col, vec3(0.77,0.85,0.95), smoothstep(0.38, 0.44, d));
            }
        }
    }

    // Add falling snow (two layers)
    float snow1 = 1.0 - smoothstep(0.0, 0.035, snowParticle(p, time, 0.07));
    float snow2 = 1.0 - smoothstep(0.0, 0.016, snowParticle(p, time*1.3+14.4, 0.03));
    float snowVal = clamp(snow1 + 0.7*snow2, 0.1, 1.0);
    col = mix(col, vec3(1.0), 0.68*snowVal);

    // Gamma correction
    col = pow(col, vec3(0.4545));
    gl_FragColor = vec4(col,1.0);
}
