#ifdef GL_ES
precision highp float;
#endif
 
uniform vec2 resolution;
uniform float time;
 
void main(void)
{
  // Be Cool
  vec2 p = gl_FragCoord.xy / resolution.xy - .5;
  p.x *= resolution.x / resolution.y;
  float a = atan(p.y, p.x);
  float r = length(p) + 0.;
 
  float b = 1.9 * sin(99.0 * r - 10.0*time - 2.0 * a);
  b = 1.3125 / r + cos(7.0 * a + b * b) / (100.0 * r);
  b *= smoothstep(0.0, 0.4, b);
 
  gl_FragColor = vec4(b * .3, .3 * b + 0.2 * sin(a + time), b * 0.5, 1.0);
}