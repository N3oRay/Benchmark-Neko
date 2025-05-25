// Original by @N3oray, reworked for clarity & structure
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define PI 3.14159265

uniform vec2 mouse;


// Constants
const float TAU = 6.2831853;

// Palette selector (0, 1, 2, etc.)
int paletteType = 1;

// Color palettes
vec3 palette(float t, int type) {
    if (type == 0) {
        // Neon rainbow
        return vec3(0.5 + 0.5*cos(TAU*t + vec3(0.0,2.0,4.0)));
    } else if (type == 1) {
        // Vaporwave
        return vec3(0.7 + 0.3*cos(TAU*t + vec3(0.0,2.5,5.0)));
    } else if (type == 2) {
        // Sunset
        return vec3(0.8+0.2*cos(TAU*t + vec3(0.0,1.0,2.5)));
    } else {
        // Default blue
        return vec3(0.4 + 0.6*cos(TAU*t + vec3(1.0,2.0,3.0)));
    }
}

#define BlendLinearDodgef               BlendAddf
#define BlendLinearBurnf                BlendSubstractf
#define BlendAddf(base, blend)          min(base + blend, 1.0)
#define BlendSubstractf(base, blend)    max(base + blend - 1.0, 0.0)
#define BlendLightenf(base, blend)      max(blend, base)
#define BlendDarkenf(base, blend)       min(blend, base)
#define BlendLinearLightf(base, blend)  (blend < 0.5 ? BlendLinearBurnf(base, (2.0 * blend)) : BlendLinearDodgef(base, (2.0 * (blend - 0.5))))
#define BlendScreenf(base, blend)       (1.0 - ((1.0 - base) * (1.0 - blend)))
#define BlendOverlayf(base, blend)      (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)))
#define BlendSoftLightf(base, blend)    ((blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend)))
#define BlendColorDodgef(base, blend)   ((blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0))
#define BlendColorBurnf(base, blend)    ((blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)), 0.0))
#define BlendVividLightf(base, blend)   ((blend < 0.5) ? BlendColorBurnf(base, (2.0 * blend)) : BlendColorDodgef(base, (2.0 * (blend - 0.5))))
#define BlendPinLightf(base, blend)     ((blend < 0.5) ? BlendDarkenf(base, (2.0 * blend)) : BlendLightenf(base, (2.0 *(blend - 0.5))))
#define BlendHardMixf(base, blend)      ((BlendVividLightf(base, blend) < 0.5) ? 0.0 : 1.0)
#define BlendReflectf(base, blend)      ((blend == 1.0) ? blend : min(base * base / (1.0 - blend), 1.0))

// Component wise blending
#define Blend(base, blend, funcf)       vec3(funcf(base.r, blend.r), funcf(base.g, blend.g), funcf(base.b, blend.b))

#define BlendNormal(base, blend)        (blend)
#define BlendLighten                    BlendLightenf
#define BlendDarken                     BlendDarkenf
#define BlendMultiply(base, blend)      (base * blend)
#define BlendAverage(base, blend)       ((base + blend) / 2.0)
#define BlendAdd(base, blend)           min(base + blend, vec3(1.0))
#define BlendSubstract(base, blend)     max(base + blend - vec3(1.0), vec3(0.0))
#define BlendDifference(base, blend)    abs(base - blend)
#define BlendNegation(base, blend)      (vec3(1.0) - abs(vec3(1.0) - base - blend))
#define BlendExclusion(base, blend)     (base + blend - 2.0 * base * blend)
#define BlendScreen(base, blend)        Blend(base, blend, BlendScreenf)
#define BlendOverlay(base, blend)       Blend(base, blend, BlendOverlayf)
#define BlendSoftLight(base, blend)     Blend(base, blend, BlendSoftLightf)
#define BlendHardLight(base, blend)     BlendOverlay(blend, base)
#define BlendColorDodge(base, blend)    Blend(base, blend, BlendColorDodgef)
#define BlendColorBurn(base, blend)     Blend(base, blend, BlendColorBurnf)
#define BlendLinearDodge                BlendAdd
#define BlendLinearBurn                 BlendSubstract

#define BlendLinearLight(base, blend)   Blend(base, blend, BlendLinearLightf)
#define BlendVividLight(base, blend)    Blend(base, blend, BlendVividLightf)
#define BlendPinLight(base, blend)      Blend(base, blend, BlendPinLightf)
#define BlendHardMix(base, blend)       Blend(base, blend, BlendHardMixf)
#define BlendReflect(base, blend)       Blend(base, blend, BlendReflectf)
#define BlendGlow(base, blend)          BlendReflect(blend, base)
#define BlendPhoenix(base, blend)       (min(base, blend) - max(base, blend) + vec3(1.0))
#define BlendOpacity(base, blend, F, O) (F(base, blend) * O + blend * (1.0 - O))

uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;


void main(){
	vec2 p = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
	vec2 t = vec2(gl_FragCoord.xy / resolution);
	
	vec3 c = vec3(0);
	
	for(int i = 0; i < 33; i++) {
		float t = 0.4 * PI * float(i) / 30.0 * time * 5.5;
		float x = cos(3.0*t);
		float y = sin(4.0*t);
		vec2 o = 0.40 * vec2(x, y);
		float r = fract(x);
		float g = 1.0 - r;
		c += 0.01 / (length(p-o)) * vec3(r, g, 0.9);
	}
	
	vec2 pos = gl_FragCoord.xy / resolution;
    vec2 st = gl_FragCoord.xy/u_resolution.xy*3.;
    // st += st * abs(sin(u_time*0.1)*3.0);
 

    vec2 q = vec2(0.);


    // Initialize missing variables for demonstration
    vec3 color = vec3(0.0); // Initialize to black
    float f = st.x;         // Example: use screen position
    vec2 r = st - 0.5;      // Example: offset from center

    // Normalized coordinates, aspect-correct
    vec2 uv = (gl_FragCoord.xy / resolution.xy) - 0.5;
    uv.x *= resolution.x / resolution.y;

	vec2 pixel_pos = gl_FragCoord.xy;
    // Color cycling using palette
    float colorTime = fract(time * 0.075 + uv.x * 0.5 + uv.y * 0.5);

    vec3 colorA = palette(colorTime, 0);

    vec3 colorB = palette(colorTime, 1);

    vec3 colorC = palette(colorTime, 2);


    color += BlendMultiply(colorA,colorB);
    color += BlendAdd(colorA,colorB);
    color += BlendLighten(colorA,colorB);
    color += BlendDarken(colorA,colorC);
    color += BlendAverage(colorA,colorC);


	vec2 mPos = resolution.xy * mouse;
	float amnt = 0.5;
	float nd = 0.0;
	vec4 cbuff = vec4(0.0);


	for(float i=0.0; i < 16.0; i += 2.0)
	{
		nd =cos(3.14159 * i * pos.x + (i * 2.75 + cos(time) * 0.25) + time) * (pos.x - 0.5) + 0.5;
		amnt = 1.0 / abs(nd - pos.y) * 0.005; 
		
		cbuff += vec4(amnt, amnt * 0.2 , amnt * pos.y, 2.0);
	}
	
	for(float i=0.0; i < 16.0; i += 2.0)
	{
		nd =cos(3.14159 * i * pos.y + (i * 2.75 + cos(time) * 0.25) + time) * (pos.y - 0.5) + 0.5;
		amnt = 1.0 / abs(nd - pos.x) * 0.005; 
		
		cbuff += vec4(amnt * pos.x, amnt * pos.y , amnt * 0.9, 1.0) * (mod(mPos.x * time, 5.0));
	}

    vec4 dbuff =  texture2D(backbuffer, 1.0 - pos) * 0.1;
	
	gl_FragColor =  vec4(c, 0.7)+dbuff+cbuff;
}
