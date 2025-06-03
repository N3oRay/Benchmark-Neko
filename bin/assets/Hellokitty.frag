#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// SDF helpers
float sdTorus( vec3 p, vec2 t)
{
     float k = length( vec2(length(p.xz)-t.x,p.y) )-t.y;
	return k;
}
float sonicAnneau(vec3 p){
    return sdTorus(p - (vec3(0.0, -0.0, 0.0)), vec2(0.2,0.015));
}
float sdSphere(vec3 p, float r) { return length(p)-r; }
float sdEllipsoid(vec3 p, vec3 r) { return (length(p/r)-1.0)*min(min(r.x,r.y),r.z); }
float sdBox(vec3 p, vec3 b) { vec3 q=abs(p)-b; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0); }
float sdHeart(vec2 p) {
    p.y += 0.20;
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p);
    float h = abs(a);
    return r-(0.5-0.4*pow(h,0.7));
}

// Kitty SDFs (as before)
float kittyHead(vec3 p) { return sdEllipsoid(p, vec3(0.35,0.33,0.28)); }
float kittyBody(vec3 p) { return sdEllipsoid(p-vec3(0.0,-0.44,0.0), vec3(0.20,0.23,0.17)); }
float kittyEarL(vec3 p) { return sdEllipsoid(p-vec3(-0.23,0.32,0.0), vec3(0.09,0.16,0.07)); }
float kittyEarR(vec3 p) { return sdEllipsoid(p-vec3(0.23,0.32,0.0), vec3(0.09,0.16,0.07)); }
float kittyArmL(vec3 p) { p-=vec3(-0.24,-0.40,0.0); p.yz=mat2(cos(-0.5),-sin(-0.5),sin(-0.5),cos(-0.5))*p.yz; return sdEllipsoid(p,vec3(0.08,0.18,0.08)); }
float kittyArmR(vec3 p) { p-=vec3(0.24,-0.40,0.0); p.yz=mat2(cos(0.5),-sin(0.5),sin(0.5),cos(0.5))*p.yz; return sdEllipsoid(p,vec3(0.08,0.18,0.08)); }
float kittyLegL(vec3 p) { return sdEllipsoid(p-vec3(-0.11,-0.72,0.06), vec3(0.09,0.10,0.11)); }
float kittyLegR(vec3 p) { return sdEllipsoid(p-vec3(0.11,-0.72,0.06), vec3(0.09,0.10,0.11)); }
float kittyTail(vec3 p) { p-=vec3(0.32,-0.60,-0.09); p.xy=mat2(cos(0.7),-sin(0.7),sin(0.7),cos(0.7))*p.xy; return sdEllipsoid(p,vec3(0.04,0.13,0.04)); }
float kittyBow(vec3 p) {
    float bow1=sdEllipsoid(p-vec3(-0.19,0.19,0.20),vec3(0.06,0.045,0.04));
    float bow2=sdEllipsoid(p-vec3(-0.11,0.21,0.13),vec3(0.035,0.035,0.03));
    float knot=sdEllipsoid(p-vec3(-0.15,0.22,0.16),vec3(0.025,0.025,0.025));
    return min(min(bow1,bow2),knot);
}
float kittyNose(vec3 p) { return sdEllipsoid(p-vec3(0.0,0.02,0.28),vec3(0.045,0.03,0.025)); }
float kittyEyeL(vec3 p) { return sdEllipsoid(p-vec3(-0.10,0.09,0.27),vec3(0.025,0.035,0.025)); }
float kittyEyeR(vec3 p) { return sdEllipsoid(p-vec3(0.10,0.09,0.27),vec3(0.025,0.035,0.025)); }
float kittyWhiskerL1(vec3 p){p-=vec3(-0.23, 0.03, 0.23);p.yz=mat2(cos(0.13),-sin(0.13),sin(0.13),cos(0.13))*p.yz;return sdEllipsoid(p,vec3(0.12,0.01,0.01));}
float kittyWhiskerL2(vec3 p){p-=vec3(-0.23,-0.03, 0.18);p.yz=mat2(cos(-0.18),-sin(-0.18),sin(-0.18),cos(-0.18))*p.yz;return sdEllipsoid(p,vec3(0.12,0.01,0.01));}
float kittyWhiskerL3(vec3 p){p-=vec3(-0.23,-0.10, 0.13);p.yz=mat2(cos(-0.37),-sin(-0.37),sin(-0.37),cos(-0.37))*p.yz;return sdEllipsoid(p,vec3(0.11,0.01,0.01));}
float kittyWhiskerR1(vec3 p){p.x=-p.x;return kittyWhiskerL1(p);}
float kittyWhiskerR2(vec3 p){p.x=-p.x;return kittyWhiskerL2(p);}
float kittyWhiskerR3(vec3 p){p.x=-p.x;return kittyWhiskerL3(p);}
float kittyDress(vec3 p){return sonicAnneau(p-vec3(0.0,-0.52,0.0));}

// Combine SDFs
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
    float w1=kittyWhiskerL1(p); if(w1<d){d=w1;partId=10;}
    float w2=kittyWhiskerL2(p); if(w2<d){d=w2;partId=10;}
    float w3=kittyWhiskerL3(p); if(w3<d){d=w3;partId=10;}
    float w4=kittyWhiskerR1(p); if(w4<d){d=w4;partId=10;}
    float w5=kittyWhiskerR2(p); if(w5<d){d=w5;partId=10;}
    float w6=kittyWhiskerR3(p); if(w6<d){d=w6;partId=10;}
    // Floor: y=-0.82
    float floor = p.y + 0.82 + 0.07*sin(8.0*p.x+time*1.2)*sin(8.0*p.z+time*1.4)*0.5;
    if(floor<d){d=floor;partId=99;}
    return d;
}
vec3 getNormal(vec3 p){int id;float e=0.002;return normalize(vec3(map(p+vec3(e,0,0),id)-map(p-vec3(e,0,0),id),map(p+vec3(0,e,0),id)-map(p-vec3(0,e,0),id),map(p+vec3(0,0,e),id)-map(p-vec3(0,0,e),id)));}
float light(vec3 p,vec3 n,vec3 ldir){float diff=clamp(dot(n,ldir),0.0,1.0);float amb=0.35;return diff*0.8+amb;}

// Shadow calculation: trace shadow ray toward sun
float calcShadow(vec3 pos, vec3 ldir) {
    float res = 1.0;
    float t = 0.02;
    int id;
    for(int i=0;i<32;i++) {
        float d = map(pos + ldir*t, id);
        if(d<0.004) return 0.4; // in shadow, darken
        res = min(res, 4.0*d/t);
        t += clamp(d,0.006,0.05);
        if(t>1.5) break;
    }
    return res;
}

void main(void) {
    vec2 uv = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
    vec3 col = vec3(1.0);

    // Sun in sky (top right)
    vec2 sunPos = vec2(0.65,0.52);
    float sunRad = 0.13;
    float sunGlow = smoothstep(sunRad+0.1, sunRad, length(uv - sunPos));
    col = mix(vec3(1.0,0.98,0.85), col, sunGlow);
    float sunDisk = smoothstep(sunRad*1.1, sunRad, length(uv - sunPos));
    col = mix(vec3(1.0,0.96,0.64), col, sunDisk);

    // Heart background (draw behind everything)
    float heart = sdHeart(uv*1.7);
    if(heart < 0.0) col = mix(col, vec3(1.0,0.32,0.74), 0.85);

    // Camera setup
    vec3 ro = vec3(0.0,0.0,2.1);
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

    // Color Hello Kitty and floor, with shadow and water animation
    if(hit) {
        vec3 p = ro + rd*t;
        vec3 n = getNormal(p);
        float li = light(p, n, ldir);
        float shadow = calcShadow(p + n*0.01, ldir);

        if(partId<99){
            if(partId==0||partId==1) col=vec3(1.0,0.98,0.98)*li;
            else if(partId==2) col=vec3(1.0,0.98,0.98)*li;
            else if(partId==3) col=vec3(1.0,0.98,0.98)*li;
            else if(partId==4) col=vec3(1.0,0.98,0.98)*li;
            else if(partId==5) col=vec3(0.92,0.8,0.7)*li;
            else if(partId==6) col=vec3(0.93,0.23,0.43)*li;
            else if(partId==7) col=vec3(0.93,0.1,0.32)*li;
            else if(partId==8) col=vec3(1.0,0.9,0.1)*li;
            else if(partId==9) col=vec3(0.1,0.1,0.1)*li;
            else if(partId==10) col=vec3(0.09,0.09,0.09)*li;

            // Outline
            int dummy;
            float outline = map(p + n*0.008, dummy);
            if(outline > 0.015)
                col = mix(vec3(0.12,0.12,0.12), col, 0.3);

            // Cheeks
            float chkl = length(p - vec3(-0.13,-0.05,0.26));
            float chkr = length(p - vec3(0.13,-0.05,0.26));
            if(chkl < 0.04 || chkr < 0.04)
                col = mix(col, vec3(1.0,0.8,0.88), 0.35);

            // Apply shadow
            col *= mix(0.5, 1.0, shadow);
        }
        // Water floor
        if(partId==99){
            // Water ripples (animated)
            float freq = 16.0;
            float ripple = 0.07*sin(freq*p.x + time*2.0)+0.07*sin(freq*p.z +time*1.7);
            float h = 0.07*sin(6.0*p.x+0.8*time) * sin(7.0*p.z+0.5*time);
            float fres=pow(1.0-clamp(dot(rd,vec3(0,1,0)),0.0,1.0), 2.5);
            // Color: blue gradient, with reflection
            vec3 water = mix(vec3(0.18,0.38,0.82), vec3(0.57,0.85,0.97), 0.6+0.4*p.x);
            float reflMix = 0.7*fres + 0.2*ripple + 0.1*h;
            // Simulate simple reflection of heart (sample background at reflected direction)
            vec2 reflUV = uv; reflUV.y = abs(uv.y)-0.45;
            float heartRefl = sdHeart(reflUV*1.7);
            if(heartRefl < 0.0)
                water = mix(water, vec3(1.0,0.32,0.74), 0.5*fres);

            // Sun reflection
            float sunRef = smoothstep(0.05,0.018, length(reflUV-sunPos-vec2(0.,0.05)+0.04*sin(time*0.8)));
            water = mix(water, vec3(1.0,0.96,0.64), sunRef*0.6);

            col = mix(water, col, reflMix);
            // Add animated water highlights
            float sparkle = pow(abs(sin((p.x+p.z)*25.0-time*8.0)), 20.0)*0.6;
            col += sparkle*vec3(0.85,0.95,1.0);
            // Add specular reflection from sun
            float sp = pow(max(dot(reflect(-ldir,vec3(0,1,0)),rd),0.0),40.0);
            col += 0.12*sp;
            // Add shadow under Kitty (soft, dark circle)
            float shadowRad = 0.38;
            float kittyShadow = smoothstep(shadowRad,shadowRad-0.09,length(p.xz));
            col = mix(col, col*vec3(0.3,0.32,0.34), kittyShadow*0.55);
        }
    }

    gl_FragColor = vec4(col, 1.0);
}
