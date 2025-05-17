#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat3 genRotMat(float a0,float x,float y,float z){
  float a=a0*3.1415926535897932384626433832795/180.0;
  float c=1.0-cos(a);
  float s=sin(a);
  return mat3(
    1.0+c*(x*x-1.0),
    -z*s+c*x*y,
    y*s+c*x*z,
    z*s+c*x*y,
    1.0+c*(y*y-1.0),
    -x*s+c*y*z,
    -y*s+c*x*z,
    x*s+c*y*z,
    1.0+c*(z*z-1.0)
  );
}


float cubeDist(vec3 p){
  return max(abs(p.x),max(abs(p.y),abs(p.z)));
}

void main(){
  vec2 coord = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.x;
  float spread=1.0;
  float total=0.0;
  float delta=0.01;
  float cameraZ=-3.5;
  float nearZ=-1.0;
  float farZ=1.0;
  float gs=0.0;
  int iter=0;
  vec3 col=vec3(0.0,0.0,0.0);
  vec3 ray=vec3(0.0,0.0,0.0);
  mat3 rot=genRotMat(sin(time/46.13)*360.0,1.0,0.0,0.0);
  rot=rot*genRotMat(sin(time/52.64)*360.0,0.0,1.0,0.0);
  rot=rot*genRotMat(sin(time/56.24)*360.0,0.0,0.0,1.0);
  ray.xy+=coord.st*spread*(nearZ-cameraZ);
  vec3 rayDir=vec3(spread*coord.st*delta,delta);
  vec3 tempDir=rayDir*rot;
  vec3 norm;
  bool refracted=false;
  bool wentThrough=false;
    int asdf = 0;
    ray.z = nearZ;
  for(int asdf = 0;asdf<100;asdf++){
    vec3 temp;
    vec3 tempc;
    float val;
    temp=ray.xyz*rot;
    tempc=temp;
    float thres=0.5;
    
    if(tempc.x<0.0)tempc.x=abs(tempc.x);
    if(tempc.x<thres)tempc.x=0.0;
    else tempc.x=1.0/tempc.x*sin(time*0.251);
    if(tempc.y<0.0)tempc.y=abs(tempc.y);
    if(tempc.y<thres)tempc.y=0.0;
    else tempc.y=1.0/tempc.y*sin(time*0.242);
    if(tempc.z<0.0)tempc.z=abs(tempc.z);
    if(tempc.z<thres)tempc.z=0.0;
    else tempc.z=1.0/tempc.z*sin(time*0.132);
    
    float displacement=sin(10.0*temp.x+time*1.142)*sin(10.0*temp.y+time*1.452)*sin(10.0*temp.z+time*0.842);
    val=cubeDist(temp)+displacement/5.0*sin(time/40.0);
    if(val<thres && !refracted){
      rayDir=vec3(0.50*spread*coord.st*delta,delta);
      refracted=true;
      wentThrough=true;
    }
    if(val>thres && refracted){
      rayDir=vec3(2.00*spread*coord.st*delta,delta);
      refracted=false;
    }
    if(refracted) tempc=vec3(0.0);
    if(val<0.0)val=abs(val);
    if(val<thres)val=0.0;
    else val=1.0/val;
    
    col.x+=(val+tempc.x)/2.0;
    col.y+=(val+tempc.y)/2.0;
    col.z+=(val+tempc.z)/2.0;
    iter++;
      ray+=rayDir;
  }
  col.x=col.x/float(iter);
  col.y=col.y/float(iter);
  col.z=col.z/float(iter);
  if(wentThrough)col=col*1.5;
  gl_FragColor=vec4(col,1.0);
}
