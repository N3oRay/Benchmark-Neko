 precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);
    
    float d = pow(p.x,2.0) +
            pow(p.y - sqrt(abs(p.x)), 2.0);
    
    gl_FragColor = vec4(distance(vec2(d),vec2(abs(sin(time))))) * vec4(abs(cos(time)-0.3),0.0,abs(cos(time)),1.0);
    
}