#ifdef GL_ES
precision mediump float;
#endif

/**

Add more SDF-based details (eyelashes, fur texture, quill spikes, shoe buckles, whiskers, etc.)

**/

uniform float time;
uniform vec2 resolution;

// --- Helpers ---
float sdSphere(vec3 p, float r) { return length(p)-r; }
float sdEllipsoid(vec3 p, vec3 r) { return (length(p/r)-1.0)*min(min(r.x,r.y),r.z); }
float sdBox(vec3 p, vec3 b) { vec3 q=abs(p)-b; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0); }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
    return length(pa - ba*h) - r;
}
float sdHeart(vec2 p) {
    p.y += 0.20;
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p);
    float h = abs(a);
    return r-(0.5-0.4*pow(h,0.7));
}
float hash21(vec2 p) {
    p = fract(p*vec2(123.34,345.45));
    p += dot(p, p+34.345);
    return fract(p.x*p.y);
}

// --- Kitty SDFs (at x=-0.4) ---
vec3 kittyPos = vec3(-0.4,0.0,0.0);
float kittyHead(vec3 p) { return sdEllipsoid(p-kittyPos, vec3(0.35,0.33,0.28)); }
float kittyBody(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(0.0,-0.44,0.0)), vec3(0.20,0.23,0.17)); }
float kittyEarL(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(-0.23,0.32,0.0)), vec3(0.09,0.16,0.07)); }
float kittyEarR(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(0.23,0.32,0.0)), vec3(0.09,0.16,0.07)); }
float kittyArmL(vec3 p) { vec3 q=p-(kittyPos+vec3(-0.24,-0.40,0.0)); q.yz=mat2(cos(-0.5),-sin(-0.5),sin(-0.5),cos(-0.5))*q.yz; return sdEllipsoid(q,vec3(0.08,0.18,0.08)); }
float kittyArmR(vec3 p) { vec3 q=p-(kittyPos+vec3(0.24,-0.40,0.0)); q.yz=mat2(cos(0.5),-sin(0.5),sin(0.5),cos(0.5))*q.yz; return sdEllipsoid(q,vec3(0.08,0.18,0.08)); }
float kittyLegL(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(-0.11,-0.72,0.06)), vec3(0.09,0.10,0.11)); }
float kittyLegR(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(0.11,-0.72,0.06)), vec3(0.09,0.10,0.11)); }
float kittyTail(vec3 p) { vec3 q=p-(kittyPos+vec3(0.32,-0.60,-0.09)); q.xy=mat2(cos(0.7),-sin(0.7),sin(0.7),cos(0.7))*q.xy; return sdEllipsoid(q,vec3(0.04,0.13,0.04)); }
float kittyBow(vec3 p) {
    float bow1=sdEllipsoid(p-(kittyPos+vec3(-0.19,0.19,0.20)),vec3(0.06,0.045,0.04));
    float bow2=sdEllipsoid(p-(kittyPos+vec3(-0.11,0.21,0.13)),vec3(0.035,0.035,0.03));
    float knot=sdEllipsoid(p-(kittyPos+vec3(-0.15,0.22,0.16)),vec3(0.025,0.025,0.025));
    return min(min(bow1,bow2),knot);
}
float kittyNose(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(0.0,0.02,0.28)),vec3(0.045,0.03,0.025)); }
float kittyEyeL(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(-0.10,0.09,0.29)),vec3(0.025,0.045,0.015)); }
float kittyEyeR(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(0.10,0.09,0.29)),vec3(0.025,0.045,0.015)); }
float kittyDress(vec3 p){return sdBox(p-(kittyPos+vec3(0.0,-0.52,0.0)),vec3(0.21,0.12,0.13)); }
float kittyEyeShineL(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(-0.10,0.13,0.29)), vec3(0.008,0.012,0.014)); }
float kittyEyeShineR(vec3 p) { return sdEllipsoid(p-(kittyPos+vec3(0.10,0.13,0.29)), vec3(0.008,0.012,0.014)); }
// Kitty Whiskers
float kittyWhiskerL1(vec3 p){return sdCapsule(p,kittyPos+vec3(-0.18,0.08,0.21),kittyPos+vec3(-0.33,0.12,0.25),0.012);}
float kittyWhiskerL2(vec3 p){return sdCapsule(p,kittyPos+vec3(-0.18,0.04,0.23),kittyPos+vec3(-0.33,0.01,0.28),0.012);}
float kittyWhiskerL3(vec3 p){return sdCapsule(p,kittyPos+vec3(-0.18,-0.04,0.20),kittyPos+vec3(-0.33,-0.09,0.23),0.011);}
float kittyWhiskerR1(vec3 p){return sdCapsule(p,kittyPos+vec3(0.18,0.08,0.21),kittyPos+vec3(0.33,0.12,0.25),0.012);}
float kittyWhiskerR2(vec3 p){return sdCapsule(p,kittyPos+vec3(0.18,0.04,0.23),kittyPos+vec3(0.33,0.01,0.28),0.012);}
float kittyWhiskerR3(vec3 p){return sdCapsule(p,kittyPos+vec3(0.18,-0.04,0.20),kittyPos+vec3(0.33,-0.09,0.23),0.011);}
// Kitty Eyelashes (left eye, right eye)
float kittyEyelashL1(vec3 p){return sdCapsule(p,kittyPos+vec3(-0.12,0.14,0.28),kittyPos+vec3(-0.18,0.20,0.27),0.007);}
float kittyEyelashL2(vec3 p){return sdCapsule(p,kittyPos+vec3(-0.09,0.16,0.28),kittyPos+vec3(-0.13,0.23,0.27),0.007);}
float kittyEyelashR1(vec3 p){return sdCapsule(p,kittyPos+vec3(0.12,0.14,0.28),kittyPos+vec3(0.18,0.20,0.27),0.007);}
float kittyEyelashR2(vec3 p){return sdCapsule(p,kittyPos+vec3(0.09,0.16,0.28),kittyPos+vec3(0.13,0.23,0.27),0.007);}

// --- Sonic SDFs (at x=+0.4) ---
vec3 sonicPos = vec3(0.4, 0.0, 0.0);
float sonicHead(vec3 p) { return sdEllipsoid(p-sonicPos, vec3(0.33,0.31,0.29)); }
float sonicFace(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.0,-0.05,0.17)),vec3(0.22,0.17,0.14)); }
float sonicBody(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.0,-0.49,0.0)), vec3(0.13,0.19,0.11)); }
float sonicArmL(vec3 p) { vec3 q=p-(sonicPos+vec3(-0.18,-0.43,0.0)); q.yz=mat2(cos(-0.1),-sin(-0.1),sin(-0.5),cos(-0.5))*q.yz; return sdEllipsoid(q,vec3(0.05,0.15,0.05)); }
float sonicArmR(vec3 p) { vec3 q=p-(sonicPos+vec3(0.18,-0.43,0.0)); q.yz=mat2(cos(0.5),-sin(0.5),sin(0.5),cos(0.5))*q.yz; return sdEllipsoid(q,vec3(0.05,0.15,0.05)); }
float sonicLegL(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(-0.07,-0.72,0.04)), vec3(0.06,0.12,0.07)); }
float sonicLegR(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.07,-0.72,0.04)), vec3(0.06,0.12,0.07)); }
float sonicShoeL(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(-0.07,-0.88,0.09)), vec3(0.11,0.05,0.11)); }
float sonicShoeR(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.07,-0.88,0.09)), vec3(0.11,0.05,0.11)); }
float sonicSpike1(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(-0.21,0.12,-0.16)),vec3(0.10,0.35,0.18)); }
float sonicSpike2(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.0,0.17,-0.23)),vec3(0.10,0.38,0.38)); }
float sonicSpike3(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.23,0.10,-0.16)),vec3(0.08,0.35,0.15)); }
float sonicEyeL(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(-0.06,0.05,0.25)),vec3(0.08,0.099,0.03)); }
float sonicEyeR(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.06,0.05,0.25)),vec3(0.08,0.099,0.03)); }
float sonicPupilL(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(-0.06,0.06,0.28)),vec3(0.02,0.025,0.015)); }
float sonicPupilR(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.06,0.06,0.28)),vec3(0.02,0.025,0.015)); }
float sonicNose(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.0,0.01,0.32)),vec3(0.025,0.030,0.025)); }
float sonicEarL(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(-0.15,0.21,0.07)),vec3(0.105,0.165,0.14)); }
float sonicEarR(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.15,0.21,0.07)),vec3(0.105,0.165,0.14)); }
float sonicBelly(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.0,-0.465,0.089)),vec3(0.07,0.12,0.0234)); }
float sonicIrisL(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(-0.06,0.06,0.275)), vec3(0.029,0.0395,0.018)); }
float sonicIrisR(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.06,0.06,0.275)), vec3(0.029,0.0495,0.018)); }
float sonicEyeHighlightL(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(-0.053,0.085,0.292)), vec3(0.009,0.010,0.005)); }
float sonicEyeHighlightR(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.053,0.085,0.292)), vec3(0.009,0.010,0.005)); }
// Sonic shoe buckles (white bands)
float sonicShoeBuckleL(vec3 p) { return sdBox(p-(sonicPos+vec3(-0.07,-0.88,0.13)),vec3(0.07,0.013,0.05)); }
float sonicShoeBuckleR(vec3 p) { return sdBox(p-(sonicPos+vec3(0.07,-0.88,0.13)),vec3(0.07,0.013,0.05)); }
// Sonic extra quill spikes (small, on top/back)
float sonicQuillTop(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.0,0.34,-0.13)),vec3(0.08,0.12,0.09)); }
float sonicQuillBack(vec3 p) { return sdEllipsoid(p-(sonicPos+vec3(0.0,0.00,-0.38)),vec3(0.12,0.15,0.16)); }
// Sonic eyelashes (subtle, above eyes)
float sonicEyelashL(vec3 p) { return sdCapsule(p,sonicPos+vec3(-0.11,0.14,0.28),sonicPos+vec3(-0.16,0.12,0.27),0.006); }
float sonicEyelashR(vec3 p) { return sdCapsule(p,sonicPos+vec3(0.11,0.14,0.28),sonicPos+vec3(0.16,0.12,0.27),0.006); }

// --- Floor SDF (water) ---
float waterFloor(vec3 p) {
    return p.y + 0.82 + 0.07*sin(8.0*p.x+time*1.2)*sin(8.0*p.z+time*1.4)*0.5;
}

// --- Scene SDF ---
float map(vec3 p, out int partId) {
    float d=kittyHead(p); partId=0;
    float earL=kittyEarL(p); if(earL<d){d=earL;partId=1;}
    float earR=kittyEarR(p); if(earR<d){d=earR;partId=1;}
    float body=kittyBody(p); if(body<d){d=body;partId=2;}
    float armL=kittyArmL(p); if(armL<d){d=armL;partId=3;}
    float armR=kittyArmR(p); if(armR<d){d=armR;partId=3;}
    float legL=kittyLegL(p); if(legL<d){d=legL;partId=4;}
    float legR=kittyLegR(p); if(legR<d){d=legR;partId=4;}
    float tail=kittyTail(p); if(tail<d){d=tail;partId=5;}
    float dress=kittyDress(p); if(dress<d){d=dress;partId=6;}
    float bow=kittyBow(p); if(bow<d){d=bow;partId=7;}
    float nose=kittyNose(p); if(nose<d){d=nose;partId=8;}
    float eyeL=kittyEyeL(p); if(eyeL<d){d=eyeL;partId=9;}
    float eyeR=kittyEyeR(p); if(eyeR<d){d=eyeR;partId=9;}
    float keShL = kittyEyeShineL(p); if(keShL<d){d=keShL;partId=12;}
    float keShR = kittyEyeShineR(p); if(keShR<d){d=keShR;partId=12;}
    float kwL1 = kittyWhiskerL1(p); if(kwL1<d){d=kwL1;partId=14;}
    float kwL2 = kittyWhiskerL2(p); if(kwL2<d){d=kwL2;partId=14;}
    float kwL3 = kittyWhiskerL3(p); if(kwL3<d){d=kwL3;partId=14;}
    float kwR1 = kittyWhiskerR1(p); if(kwR1<d){d=kwR1;partId=14;}
    float kwR2 = kittyWhiskerR2(p); if(kwR2<d){d=kwR2;partId=14;}
    float kwR3 = kittyWhiskerR3(p); if(kwR3<d){d=kwR3;partId=14;}
    float kel1 = kittyEyelashL1(p); if(kel1<d){d=kel1;partId=15;}
    float kel2 = kittyEyelashL2(p); if(kel2<d){d=kel2;partId=15;}
    float ker1 = kittyEyelashR1(p); if(ker1<d){d=ker1;partId=15;}
    float ker2 = kittyEyelashR2(p); if(ker2<d){d=ker2;partId=15;}
    // Sonic
    float sh = sonicHead(p); if(sh<d){d=sh;partId=20;}
    float sf = sonicFace(p); if(sf<d){d=sf;partId=21;}
    float sb = sonicBody(p); if(sb<d){d=sb;partId=22;}
    float saL = sonicArmL(p); if(saL<d){d=saL;partId=23;}
    float saR = sonicArmR(p); if(saR<d){d=saR;partId=23;}
    float slL = sonicLegL(p); if(slL<d){d=slL;partId=24;}
    float slR = sonicLegR(p); if(slR<d){d=slR;partId=24;}
    float sshL = sonicShoeL(p); if(sshL<d){d=sshL;partId=25;}
    float sshR = sonicShoeR(p); if(sshR<d){d=sshR;partId=25;}
    float ssp1 = sonicSpike1(p); if(ssp1<d){d=ssp1;partId=26;}
    float ssp2 = sonicSpike2(p); if(ssp2<d){d=ssp2;partId=26;}
    float ssp3 = sonicSpike3(p); if(ssp3<d){d=ssp3;partId=26;}
    float seL = sonicEyeL(p); if(seL<d){d=seL;partId=27;}
    float seR = sonicEyeR(p); if(seR<d){d=seR;partId=27;}
    float spL = sonicPupilL(p); if(spL<d){d=spL;partId=28;}
    float spR = sonicPupilR(p); if(spR<d){d=spR;partId=28;}
    float sn = sonicNose(p); if(sn<d){d=sn;partId=29;}
    float searL = sonicEarL(p); if(searL<d){d=searL;partId=30;}
    float searR = sonicEarR(p); if(searR<d){d=searR;partId=30;}
    float sbelly = sonicBelly(p); if(sbelly<d){d=sbelly;partId=31;}
    float siL = sonicIrisL(p); if(siL<d){d=siL;partId=32;}
    float siR = sonicIrisR(p); if(siR<d){d=siR;partId=32;}
    float shlL = sonicEyeHighlightL(p); if(shlL<d){d=shlL;partId=33;}
    float shlR = sonicEyeHighlightR(p); if(shlR<d){d=shlR;partId=33;}
    float ssbL = sonicShoeBuckleL(p); if(ssbL<d){d=ssbL;partId=34;}
    float ssbR = sonicShoeBuckleR(p); if(ssbR<d){d=ssbR;partId=34;}
    float squillT = sonicQuillTop(p); if(squillT<d){d=squillT;partId=35;}
    float squillB = sonicQuillBack(p); if(squillB<d){d=squillB;partId=36;}
    float selashL = sonicEyelashL(p); if(selashL<d){d=selashL;partId=37;}
    float selashR = sonicEyelashR(p); if(selashR<d){d=selashR;partId=37;}
    // Floor
    float floor = waterFloor(p); if(floor<d){d=floor;partId=99;}
    return d;
}

// --- Raymarch Helpers ---
vec3 getNormal(vec3 p){int id;float e=0.002;return normalize(vec3(map(p+vec3(e,0,0),id)-map(p-vec3(e,0,0),id),map(p+vec3(0,e,0),id)-map(p-vec3(0,e,0),id),map(p+vec3(0,0,e),id)-map(p-vec3(0,0,e),id)));}
float light(vec3 p,vec3 n,vec3 ldir){float diff=clamp(dot(n,ldir),0.0,1.0);float amb=0.35;return diff*0.8+amb;}
float softShadow(vec3 ro, vec3 rd, float k) {
    float res = 1.0;
    float t = 0.02;
    int id;
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

// --- Main ---
void main(void) {
    vec2 uv = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
    vec3 col = vec3(1.0);

    // Sun in sky
    vec2 sunPos = vec2(0.65,0.52);
    float sunRad = 0.13;
    float sunGlow = smoothstep(sunRad+0.1, sunRad, length(uv - sunPos));
    col = mix(vec3(1.0,0.98,0.85), col, sunGlow);
    float sunDisk = smoothstep(sunRad*1.1, sunRad, length(uv - sunPos));
    col = mix(vec3(1.0,0.96,0.64), col, sunDisk);

    // Heart background
    float heart = sdHeart(uv*-1.7);
    if(heart < 0.0)
        col = mix(col, vec3(1.0,0.32,0.74), 0.85);

    // Camera setup
    vec3 ro = vec3(0.0,0.0,2.86891);
    float angle = sin(time*0.5)*0.12;
    float c = cos(angle), s = sin(angle);
    mat3 rotY = mat3(
        c, 0, s,
        0, 1, 0,
       -s, 0, c
    );
    ro = rotY * ro;
    vec3 rd = rotY * normalize(vec3(uv, -1.4));

    // Raymarch
    float t = 0.0;
    int partId = -1;
    bool hit = false;
    for(int i=0; i<130; i++) {
        vec3 p = ro + rd*t;
        float d = map(p, partId);
        if(d < 0.002) { hit = true; break; }
        t += d;
        if(t > 3.0) break;
    }

    // Light direction from sun in world space
    vec3 ldir = normalize(rotY * vec3(0.7,0.85,0.7));

    if(hit) {
        vec3 p = ro + rd*t;
        vec3 n = getNormal(p);
        float li = light(p, n, ldir);
        float sshadow = softShadow(p + n*0.01, ldir, 32.0);
        float fres = fresnelTerm(n, -rd, 2.0);
        float spec = phongSpecular(n, -rd, ldir, 35.0);
        float yNorm = clamp((p.y+0.8)/1.7, 0.0, 1.0);

        // Fur texture for Kitty: white noise on main body parts
        float fur = 1.0;
        if(partId==0||partId==1||partId==2||partId==3||partId==4) {
            float f = hash21(p.xz*24.0 + p.y*8.0 + time*0.12);
            fur = mix(1.0, mix(0.93,1.0,mod(f*7.0,1.0)), step(0.8,f));
        }

        // Kitty
        if(partId==0||partId==1) col=mix(vec3(1.0,0.98,0.98), vec3(0.98,0.92,0.93), yNorm)*li*fur;
        else if(partId==2) col=mix(vec3(1.0,0.98,0.98), vec3(0.99,0.94,0.97), yNorm)*li*fur;
        else if(partId==3) col=mix(vec3(1.0,0.98,0.98), vec3(1.0,0.97,0.97), yNorm)*li*fur;
        else if(partId==4) col=mix(vec3(1.0,0.98,0.98), vec3(0.97,0.95,0.98), yNorm)*li*fur;
        else if(partId==5) col=mix(vec3(0.92,0.8,0.7), vec3(0.88,0.76,0.7), yNorm)*li;
        else if(partId==6) col=mix(vec3(0.93,0.23,0.43), vec3(1.0,0.39,0.62), yNorm)*li;
        else if(partId==7) col=mix(vec3(0.93,0.1,0.32), vec3(1.0,0.33,0.52), yNorm)*li;
        else if(partId==8) col=mix(vec3(1.0,0.9,0.1), vec3(1.0,0.97,0.55), yNorm)*li;
        else if(partId==9) col = mix(vec3(0.1,0.1,0.1), vec3(0.2,0.2,0.23), yNorm)*li + 1.4*spec + 0.8*fres;
        else if(partId==12) col = vec3(1.0,1.0,1.0)*li + 0.8*spec;
        else if(partId==14) col = vec3(0.1,0.1,0.1)*li + 0.6*spec; // Whiskers
        else if(partId==15) col = vec3(0.05,0.05,0.08)*li + 0.5*spec; // Eyelashes
        // Sonic
        else if(partId==20) col = mix(vec3(0.12,0.32,0.85), vec3(0.32,0.6,0.95), yNorm)*li + 0.18*fres;
        else if(partId==21) col = mix(vec3(1.0,0.87,0.58), vec3(1.0,0.96,0.88), yNorm)*li;
        else if(partId==22) col = mix(vec3(0.13,0.29,0.80), vec3(0.18,0.41,0.97), yNorm)*li + 0.12*fres;
        else if(partId==23) col = mix(vec3(1.0,0.89,0.68), vec3(1.0,0.97,0.78), yNorm)*li;
        else if(partId==24) col = mix(vec3(0.18,0.20,0.65), vec3(0.20,0.35,0.85), yNorm)*li;
        else if(partId==25) col = mix(vec3(0.93,0.13,0.15), vec3(1.0,0.42,0.45), yNorm)*li + 0.09*spec;
        else if(partId==26) col = mix(vec3(0.12,0.32,0.85), vec3(0.32,0.6,0.95), yNorm)*li + 0.18*fres; // main spikes
        else if(partId==27) col = mix(vec3(0.99,0.99,0.98), vec3(0.93,0.95,0.99), yNorm)*li + 1.0*spec + 0.7*fres;
        else if(partId==28) col = mix(vec3(0.08,0.34,0.12), vec3(0.29,0.67,0.34), yNorm)*li + 0.8*spec + 0.6*fres;
        else if(partId==29) col = mix(vec3(0.1,0.1,0.1),vec3(0.23,0.23,0.25),yNorm)*li + 1.0*spec + 0.7*fres;
        else if(partId==30) col = mix(vec3(0.13,0.29,0.80), vec3(0.18,0.41,0.97), yNorm)*li;
        else if(partId==31) col = mix(vec3(1.0,0.87,0.58), vec3(1.0,0.96,0.88), yNorm)*li;
        else if(partId==32) col = mix(vec3(0.18,0.45,0.95), vec3(0.35,0.61,0.99), yNorm)*li + 1.0*spec + 0.8*fres;
        else if(partId==33) col = vec3(1.0,1.0,1.0) + 1.0*spec;
        else if(partId==34) col = vec3(0.98,0.97,0.95)*li + 0.5*spec; // shoe buckles
        else if(partId==35) col = vec3(0.31,0.53,0.96)*li + 0.22*fres; // top quill
        else if(partId==36) col = vec3(0.23,0.30,0.84)*li + 0.17*fres; // back quill
        else if(partId==37) col = vec3(0.06,0.09,0.14)*li + 0.5*spec; // Sonic eyelashes

        // Outline for all
        int dummy;
        float outline = map(p + n*0.008, dummy);
        if(outline > 0.015)
            col = mix(vec3(0.10,0.10,0.13), col, 0.23);

        // Cheeks for Kitty
        float chkl = length(p - (kittyPos+vec3(-0.13,-0.05,0.26)));
        float chkr = length(p - (kittyPos+vec3(0.13,-0.05,0.26)));
        if((partId<20)&&(chkl < 0.04 || chkr < 0.04))
            col = mix(col, vec3(1.0,0.8,0.88), 0.35);

        // Soft shadow
        col *= mix(0.5, 1.0, sshadow);
    }

    gl_FragColor = vec4(col, 1.0);
}
	
