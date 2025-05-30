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
    // SDF for a finite cone from Inigo Quilez, robust for cylinders (r1==r2)
    float d1 = -p.y - h;
    float d2 = p.y;
    float r = mix(r1, r2, clamp(p.y/h, 0.0, 1.0));
    float d3 = length(p.xz) - r;
    float inside = max(d1, d2);
    float outside = min(max(d3, inside), 0.0) + length(max(vec2(d3, inside), 0.0));
    return outside;
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

// --- Dreads (10, curving down) ---
float knuxDread(vec3 p, float x0, float y0, float z0, float x1, float y1, float z1, float r) {
    return sdCapsule(p, K+vec3(x0,y0,z0), K+vec3(x1,y1,z1), r);
}
float knuxDreadL1(vec3 p) { return knuxDread(p, -0.07,0.20,0.06, -0.22,0.09,-0.22, 0.034); }
float knuxDreadL2(vec3 p) { return knuxDread(p, -0.04,0.18,0.10, -0.17,0.01,-0.28, 0.029); }
float knuxDreadL3(vec3 p) { return knuxDread(p, -0.01,0.17,0.12, -0.07,-0.02,-0.32, 0.025); }
float knuxDreadL4(vec3 p) { return knuxDread(p, -0.10,0.19,0.0, -0.24,0.03,-0.08, 0.027); }
float knuxDreadR1(vec3 p) { return knuxDread(p, 0.07,0.20,0.06, 0.22,0.09,-0.22, 0.034); }
float knuxDreadR2(vec3 p) { return knuxDread(p, 0.04,0.18,0.10, 0.17,0.01,-0.28, 0.029); }
float knuxDreadR3(vec3 p) { return knuxDread(p, 0.01,0.17,0.12, 0.07,-0.02,-0.32, 0.025); }
float knuxDreadR4(vec3 p) { return knuxDread(p, 0.10,0.19,0.0, 0.24,0.03,-0.08, 0.027); }
float knuxDreadC1(vec3 p) { return knuxDread(p, -0.02,0.17,0.13, -0.04,-0.04,-0.33, 0.024); }
float knuxDreadC2(vec3 p) { return knuxDread(p, 0.02,0.17,0.13, 0.04,-0.04,-0.33, 0.024); }

// --- Muzzle (large, tan, rounded) ---
float knuxSnout(vec3 p) {
    return sdEllipsoid(p - (K + vec3(0.0, 0.10, 0.13)), vec3(0.076, 0.045, 0.10));
}
// Nose (black, pointed)
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
float knuxArmL(vec3 p) { // bent in, up
    vec3 a = K+vec3(-0.07, -0.01, 0.03);
    vec3 b = K+vec3(-0.30, 0.10, 0.09);
    return sdCapsule(p, a, b, 0.032);
}
float knuxArmR(vec3 p) {
    vec3 a = K+vec3(0.07, -0.01, 0.03);
    vec3 b = K+vec3(0.30, 0.10, 0.09);
    return sdCapsule(p, a, b, 0.032);
}
// Tape bands (arms)
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

// --- Gloves ---
float knuxHandL(vec3 p) { return sdEllipsoid(p - (K + vec3(-0.32, 0.14, 0.11)), vec3(0.055, 0.054, 0.065)); }
float knuxHandR(vec3 p) { return sdEllipsoid(p - (K + vec3(0.32, 0.14, 0.11)), vec3(0.055, 0.054, 0.065)); }
// Glove spikes (2 per hand)
float knuxSpikeL1(vec3 p) {
    return sdCone(p-(K+vec3(-0.35,0.12,0.14)), 0.037, 0.015, 0.0);
}
float knuxSpikeL2(vec3 p) {
    return sdCone(p-(K+vec3(-0.30,0.12,0.14)), 0.037, 0.015, 0.0);
}
float knuxSpikeR1(vec3 p) {
    return sdCone(p-(K+vec3(0.35,0.12,0.14)), 0.037, 0.015, 0.0);
}
float knuxSpikeR2(vec3 p) {
    return sdCone(p-(K+vec3(0.30,0.12,0.14)), 0.037, 0.015, 0.0);
}

// --- Legs w/ tape bands (reference pose, out, slightly bent) ---
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
// Tape bands (legs)
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

// --- Shoes: blocky boxes, green cuffs, brown soles ---
float knuxShoeL(vec3 p) { return sdBox(p - (K + vec3(-0.13, -0.40, 0.04)), vec3(0.059, 0.034, 0.13)); }
float knuxShoeR(vec3 p) { return sdBox(p - (K + vec3(0.13, -0.40, 0.04)), vec3(0.059, 0.034, 0.13)); }
float knuxCuffL(vec3 p) { return sdBox(p - (K + vec3(-0.13, -0.36, 0.04)), vec3(0.064, 0.017, 0.11)); }
float knuxCuffR(vec3 p) { return sdBox(p - (K + vec3(0.13, -0.36, 0.04)), vec3(0.064, 0.017, 0.11)); }
float knuxSoleL(vec3 p) { return sdBox(p - (K + vec3(-0.13, -0.43, 0.04)), vec3(0.060, 0.011, 0.13)); }
float knuxSoleR(vec3 p) { return sdBox(p - (K + vec3(0.13, -0.43, 0.04)), vec3(0.060, 0.011, 0.13)); }

// --- Tail (small, spiky, back) ---
float knuxTail(vec3 p) {
    return sdCone(p - (K + vec3(0.0, -0.094, -0.0439)), 0.08, 0.018, 0.0);
}

// --- Floor (water) ---
float waterFloor(vec3 p) {
    return p.y + 0.82 + 0.06*sin(8.0*p.x+time*1.2)*sin(8.0*p.z+time*1.4)*0.5;
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
    float kdreadR1 = knuxDreadR1(p); if(kdreadR1<d){ d=kdreadR1; partId=19;}
    float kdreadR2 = knuxDreadR2(p); if(kdreadR2<d){ d=kdreadR2; partId=20;}
    float kdreadR3 = knuxDreadR3(p); if(kdreadR3<d){ d=kdreadR3; partId=21;}
    float kdreadR4 = knuxDreadR4(p); if(kdreadR4<d){ d=kdreadR4; partId=22;}
    float kdreadC1 = knuxDreadC1(p); if(kdreadC1<d){ d=kdreadC1; partId=23;}
    float kdreadC2 = knuxDreadC2(p); if(kdreadC2<d){ d=kdreadC2; partId=24;}
    float kbody = knuxBody(p); if(kbody<d){ d=kbody; partId=25;}
    float kchest = knuxChest(p); if(kchest<d){ d=kchest; partId=26;}
    float karmL = knuxArmL(p); if(karmL<d){ d=karmL; partId=27;}
    float karmR = knuxArmR(p); if(karmR<d){ d=karmR; partId=28;}
    float ktapeL = knuxTapeBandL(p); if(ktapeL<d){ d=ktapeL; partId=29;}
    float ktapeR = knuxTapeBandR(p); if(ktapeR<d){ d=ktapeR; partId=30;}
    float khandL = knuxHandL(p); if(khandL<d){ d=khandL; partId=31;}
    float khandR = knuxHandR(p); if(khandR<d){ d=khandR; partId=32;}
    float kspikeL1 = knuxSpikeL1(p); if(kspikeL1<d){ d=kspikeL1; partId=33;}
    float kspikeL2 = knuxSpikeL2(p); if(kspikeL2<d){ d=kspikeL2; partId=34;}
    float kspikeR1 = knuxSpikeR1(p); if(kspikeR1<d){ d=kspikeR1; partId=35;}
    float kspikeR2 = knuxSpikeR2(p); if(kspikeR2<d){ d=kspikeR2; partId=36;}
    float klegL = knuxLegL(p); if(klegL<d){ d=klegL; partId=37;}
    float klegR = knuxLegR(p); if(klegR<d){ d=klegR; partId=38;}
    float ktapeLL = knuxTapeLegL(p); if(ktapeLL<d){ d=ktapeLL; partId=39;}
    float ktapeLR = knuxTapeLegR(p); if(ktapeLR<d){ d=ktapeLR; partId=40;}
    float kshoeL = knuxShoeL(p); if(kshoeL<d){ d=kshoeL; partId=41;}
    float kshoeR = knuxShoeR(p); if(kshoeR<d){ d=kshoeR; partId=42;}
    float kcuffL = knuxCuffL(p); if(kcuffL<d){ d=kcuffL; partId=43;}
    float kcuffR = knuxCuffR(p); if(kcuffR<d){ d=kcuffR; partId=44;}
    float ksoleL = knuxSoleL(p); if(ksoleL<d){ d=ksoleL; partId=45;}
    float ksoleR = knuxSoleR(p); if(ksoleR<d){ d=ksoleR; partId=46;}
    float ktail = knuxTail(p); if(ktail<d){ d=ktail; partId=47;}
    float floor = waterFloor(p); if(floor<d){ d=floor; partId=199;}
    return d;
}

// --- Raymarch helpers ---
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

mat2 rotmat(float a)
{
    return mat2(cos(a),sin(a),-sin(a),cos(a));
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float smax(float a,float b, float k)
{
    return -smin(-a,-b,k);
}

float shoesDist(vec3 p)
{
    vec3 op=p;
    float d=1e4;

    p.y-=1.5;

    // right shoe
    op=p;
    p-=vec3(-.5,-.6,-.9);
    p.yz=rotmat(-.7)*p.yz;
    p.xz=rotmat(0.1)*p.xz;
    d=min(d,-smin(p.y,-(length(p*vec3(1.6,1,1))-.64),.2));
    p=op;

    // left shoe
    op=p;
    p-=vec3(.55,-.8,0.4);
    p.x=-p.x;
    p.yz=rotmat(1.4)*p.yz;
    d=min(d,-smin(p.y,-(length(p*vec3(1.6,1,1))-.73),.2));
    p=op;
    return d;
}

float sceneDist(vec3 p)
{
    vec3 op=p;
    float d=shoesDist(p);

    d=min(d,p.y);
    p.y-=1.5;

    // torso
    d=min(d,length(p)-1.);

    // left arm
    op=p;
    p-=vec3(.66,.7,0);
    p.xz=rotmat(-0.1)*p.xz;
    d=smin(d,(length(p*vec3(1.8,1,1))-.58),.07);
    p=op;

    // right arm
    op=p;
    p-=vec3(-.75,0.2,0);
    d=smin(d,(length(p*vec3(1,1.5,1))-.54),.04);
    p=op;

    // mouth
    p.y-=.11;
    float md=smax(p.z+.84,smax(smax(p.x-.2,p.y-.075,.2),dot(p,vec3(.7071,-.7071,0))-.1,.08),.05);
    p.x=-p.x;
    md=smax(md,smax(p.z+.84,smax(smax(p.x-.2,p.y-.075,.2),dot(p,vec3(.7071,-.7071,0))-.1,.08),.01),.14);
    d=smax(d,-md,.012);

    // tongue
    p=op;
    d=smin(d,length((p-vec3(0,.09,-.75))*vec3(1,1,1))-.18,.0);
	
	// haha no "knob" for you today
	
	
    return min(d,10.);
}

vec3 sceneNorm(vec3 p)
{
    vec3 e=vec3(1e-3,0,0);
    float d = sceneDist(p);
    return normalize(vec3(sceneDist(p + e.xyy) - sceneDist(p - e.xyy), sceneDist(p + e.yxy) - sceneDist(p - e.yxy),
                          sceneDist(p + e.yyx) - sceneDist(p - e.yyx)));
}

// from simon green and others
float ambientOcclusion(vec3 p, vec3 n)
{
    const int steps = 4;
    const float delta = 0.15;

    float a = 0.0;
    float weight = 4.;
    for(int i=1; i<=steps; i++) {
        float d = (float(i) / float(steps)) * delta; 
        a += weight*(d - sceneDist(p + n*d));
        weight *= 0.5;
    }
    return clamp(1.0 - a, 0.0, 1.0);
}

// --- Main ---
void main(void) {
    vec2 uv = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
    vec3 col = vec3(1.0);
	
	
	float an=cos(time)*.1;

    // Sun in sky
    vec2 sunPos = vec2(0.65,0.52);
    float sunRad = 0.13;
    float sunGlow = smoothstep(sunRad+0.1, sunRad, length(uv - sunPos));
    col = mix(vec3(1.0,0.98,0.85), col, sunGlow);
    float sunDisk = smoothstep(sunRad*1.1, sunRad, length(uv - sunPos));
    col = mix(vec3(1.0,0.96,0.64), col, sunDisk);

    // Camera setup: centered for reference pose
// Camera setup: rotate around Knuckles
float camAngle = 0.4 * time; // adjust speed here
float camDist = 1.55;        // radius from model center
float camHeight = 0.13;      // vertical height of camera

vec3 look = vec3(0.0, 0.09, 0.0); // Target: Knuckles' chest
vec3 ro = look + vec3(sin(camAngle)*camDist, camHeight, cos(camAngle)*camDist); // Orbit
vec3 up = vec3(0.0, 1.0, 0.0);

vec3 forward = normalize(look - ro);
vec3 right = normalize(cross(up, forward));
vec3 up2 = cross(forward, right);

//vec2 uv = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
vec3 rd = normalize(forward + uv.x * right * 1.05 + uv.y * up2 * 1.05);

	
	
	
    // Raymarch
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
	
	    // shadow ray

    vec3 rp=ro+rd*t;
    vec3 n=sceneNorm(rp);
    float st=5e-3;
    vec3 ld=normalize(vec3(2,4,-4));
	
	    // ambient occlusion and shadowing
    vec3 ao=vec3(ambientOcclusion(rp, n));
    float shad=mix(.85,1.,step(5.,st));

    ao*=mix(.3,1.,.5+.5*n.y);

    // soft floor shadow
    if(rp.y<1e-3)
        ao*=mix(mix(vec3(1,.5,.7),vec3(1),.4)*.6,vec3(1),smoothstep(0.,1.6,length(rp.xz)));



    // Light direction
    vec3 ldir = normalize(vec3(0.7,0.85,0.7));

    if(hit) {
        vec3 p = ro + rd*t;
        vec3 n = getNormal(p);
        float li = light(p, n, ldir);
        float sshadow = softShadow(p + n*0.01, ldir, 32.0);
        float fres = fresnelTerm(n, -rd, 2.0);
        float spec = phongSpecular(n, -rd, ldir, 35.0);

        // Coloring by partId
        if(partId==1) col = vec3(0.79,0.08,0.15)*li + 0.2*spec; // Head (red)
        else if(partId==2||partId==3) col = vec3(0.79,0.08,0.15)*li + 0.2*spec; // Ears
        else if(partId==4) col = vec3(1.0,0.88,0.68)*li + 0.4*spec; // Snout
        else if(partId==5) col = vec3(0.08,0.06,0.13)*li + 0.9*spec; // Nose
        else if(partId==6||partId==7) col = vec3(0.73,0.09,0.15)*li + 0.7*spec; // Brows (dark red)
        else if(partId==8||partId==9) col = vec3(1.0)*li + 0.7*spec; // Eye whites
        else if(partId==10||partId==11) col = vec3(0.17,0.37,0.75)*li + 0.8*spec; // Iris
        else if(partId==12||partId==13) col = vec3(0.08,0.08,0.08)*li + 0.9*spec; // Pupils
        else if(partId==14) col = vec3(0.26,0.13,0.14)*li + 0.6*spec; // Mouth (dark red)
        else if(partId>=15&&partId<=24) col = vec3(0.79,0.08,0.15)*li + 0.2*spec; // Dreads (red)
        else if(partId==25) col = vec3(0.79,0.08,0.15)*li; // Body (red)
        else if(partId==26) col = vec3(1.0,0.97,0.16)*li + 0.2*spec; // Chest crescent (yellow)
        else if(partId==27||partId==28) col = vec3(0.79,0.08,0.15)*li; // Arms (red)
        else if(partId==29||partId==30) col = vec3(1.0)*li + 0.5*spec; // Arm tape (white)
        else if(partId==31||partId==32) col = vec3(1.0)*li + 0.6*spec; // Gloves (white)
        else if(partId>=33&&partId<=36) col = vec3(0.95,0.95,0.94)*li + 0.95*spec; // Glove spikes
        else if(partId==37||partId==38) col = vec3(0.79,0.08,0.15)*li; // Legs (red)
        else if(partId==39||partId==40) col = vec3(1.0)*li + 0.5*spec; // Leg tape (white)
        else if(partId==41||partId==42) col = vec3(0.70,0.25,0.12)*li + 0.3*spec; // Shoe (brown)
        else if(partId==43||partId==44) col = vec3(0.19,0.87,0.18)*li + 0.2*spec; // Shoe cuff (bright green)
        else if(partId==45||partId==46) col = vec3(0.36,0.17,0.08)*li + 0.2*spec; // Sole (dark brown)
        else if(partId==47) col = vec3(0.79,0.08,0.15)*li + 0.2*spec; // Tail (red)
        else if(partId==199) col = vec3(0.55,0.80,0.97)*(0.8+0.2*sin(10.0*p.x+time*0.2)*sin(5.0*p.z+time*0.13));
        col *= mix(0.55, 1.0, sshadow);
    }
	


    gl_FragColor = vec4(col, 1.0);
}
