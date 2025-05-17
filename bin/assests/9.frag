/*
 * Original shader from: https://www.shadertoy.com/view/3lVfW3
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define NUM_EXPLOSIONS 20.
#define NUM_HEART_PARTICLES 60.
#define PI 3.14159265
#define HEART_COLOR vec3(1., .015, .012)

float smoothmax(float a, float b, float k){
    float h = clamp((b-a)/k+.5, 0., 1.);
    return mix(a,b,h)+h*(1.-h)*k*.5;
}

vec2 random12(float t){ 
    float x = fract(sin(t*674.556)*453.2); 
    float y = fract(sin((t+x)*714.3)*263.2); 
    
    return vec2(x, y);
}

float random21(vec2 i){
    return fract(sin(dot(i, vec2(321.590,221.630)))*12431.1235);
}

float random11(float t){
    return fract(sin(t*451252.125)*123124.2525);
}

vec2 random_polar12(float t){ 
    // polar coordinate
    float angle = fract(sin(t*674.3)*453.2)*2.*PI; // 0 ~ 2PI 
    float radius = fract(sin((t+angle)*714.3)*263.2);
    
    return vec2(sin(angle), cos(angle)) * radius;
}

float Heart(vec2 uv, float blur, float size){
    float radius = 0.15;
    blur *= radius;
    
    uv*=size*.35;
    uv.x*=.7; 
    uv.y -= smoothmax(sqrt(abs(uv.x))*0.452, blur, 0.116); 
    float dist= length(uv);
    
    return smoothstep(radius+blur, radius-blur,dist);
}

mat2 rotated2d(float a){
    return mat2(cos(a), -sin(a),
               sin(a), cos(a));
}

float HeartExplosion(vec2 uv, float speed){
    float heart_brightness = -1.05; // total heart brightness
    vec2 dir = random_polar12(1.)*speed;
    float dist = length(uv-dir*speed);
    float brightness = mix(0.07,0.146,smoothstep(.05,0.,speed));
    brightness *= sin(speed*20.)*.25+.75;  // 0~1
    heart_brightness += brightness/dist;

    for(float i=0.; i<NUM_HEART_PARTICLES; i++){
        dir = random_polar12(i+1.)*speed;
        vec2 qt_dir = floor(dir);
        
        dist = Heart(uv-dir*speed, 0.212, i);
        brightness = smoothstep(1.512,1.120, smoothstep(.05,0.,dist));
        dist *= brightness;
        
        heart_brightness += dist;
    }
    return heart_brightness*1.5;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy/iResolution.xy;
    uv = uv*2.-1.;
    uv.x *= iResolution.x/iResolution.y;
    
    vec3 col = vec3(0);
    float colorbrightness = 0.344;
    
    for(float i=0.; i<NUM_EXPLOSIONS; i++){
        float t = iTime+i/NUM_EXPLOSIONS; 
        float qt_t = floor(t);
        
        vec3 color = sin(10.*vec3(0.980,0.542,0.390)*qt_t)*.35+.65; // 0.3 ~ 1
        // vec3 color = HEART_COLOR;
        
        vec2 offset = random12(i+1.+ qt_t)-0.5;
        offset *= random21(vec2(0.230,0.35));
        offset *= rotated2d(iTime*0.85+qt_t)*1.6;
        
        col += HeartExplosion(uv-offset, fract(t)) * color * colorbrightness;
    }
    
    col *=.09;
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}