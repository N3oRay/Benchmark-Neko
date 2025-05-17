/*
 * Original shader from: https://www.shadertoy.com/view/fdlGzr
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
vec3 pal(float t){
    return .5+.5*cos(2.*3.1415*(1.*t+vec3(.0,.3,.7)));
}
    mat2 r(float a){
      float c=cos(a),s=sin(a);
      return mat2(c,-s,s,c);
      }
float sdf(vec3 p){

  p.x = abs(p.x)-1.1; 
   
    p.y = abs(p.y)-1.3;  
   p.zy = p.z>p.y ? p.zy:p.yz;
    p.z = abs(p.z)-1.5; p.zy = p.z>p.y ? p.zy:p.yz;
 
      p.z = abs(p.z)-1.5;
  float h = 10000.;
  const float li = 32.;
  for(float i=0.;i<li;i++){  
       float gg =fract(iTime+i/li);
    float t= .5+log(1.+gg);
    float po = i*(3.1415*2./li);
    vec3 o= vec3(sin(po)*t,cos(po)*t,1.);
     h = min(h, length(p+o)-.05);
  }
  
    return h;
  }

  
  vec3 normal(vec3 p){
     vec2 n= vec2(.001,0.);
      return normalize(vec3(
        sdf(p+n.xyy)-sdf(p-n.xyy),
     sdf(p+n.yxy)-sdf(p-n.yxy),
     sdf(p+n.yyx)-sdf(p-n.yyx))
    );
      
    }
    
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord-.5* iResolution.xy)/iResolution.y;

      vec3 ro = vec3(0.,0.,-3.);
  
  
  vec3 cameraW = normalize(vec3(0)-ro);
  vec3 cameraU = normalize(cross(cameraW,vec3(0.,1.,0.)));
  vec3 cameraV = normalize(cross(cameraU,cameraW));
  mat3 cameraMat = mat3(cameraU,cameraV,cameraW);
  vec3 rd = cameraMat* normalize(vec3(uv,.5)); 


   
  vec3 col = vec3(.1)-length(uv)*.1 ;
  vec3 light = vec3(.2,.5,-1.5);
  float rl = 1E-2;
  float isec;
  vec3 rp = ro+rd*rl;


  for(int i=0;i<256;i++) {
      isec = sdf(rp); 
      rl+=isec;
      rp = ro+rd*rl;
      if(isec<1E-2) {
 
      
        col = vec3(.4)* max(0.,dot(light,normal(rp)))*pal(length(uv.xy*2.));
        break;
      }
  }
  
  


    // Output to screen
    fragColor = vec4(pow(col,vec3(.5)),1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}