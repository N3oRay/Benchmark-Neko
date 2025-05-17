#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
	vec2 uPos = (gl_FragCoord.xy / resolution.xy); 
	
	uPos.x -= 1.65;
	uPos.y -= 1.25;
	
	vec3 color = vec3(0.0);
	float vertColor = 123.21;
	
	float t = time * (1.3);
	
	float intensity = 3.0;
	
	for (float i = 0.0; i < 5.0; ++i)
	{	
		float j = i / 5.0;		
		
		uPos.y += sin((uPos.x - j) * (intensity + 0.5) + t + intensity /10.0) * 0.02;
		float fTempY = abs(1.0 / (uPos.y + j) / 200.0);
		
		color += vec3(fTempY * (15.0 - intensity) / 4.94, fTempY * intensity / 10.0, pow(fTempY, 1.0) * 2.0);
		
		uPos.x += sin((uPos.y + j) * (intensity +0.5) + t + 5.0 / intensity) * 0.02;
		float fTempX = abs(1.0 / (uPos.x + j) / 2000.0);
		
		color += vec3(fTempX * (15.0 - intensity) / 10.0, fTempX * intensity / 10.0, pow(fTempX, 1.0) * 2.0);
	}
	vec4 color_final = vec4(color, 1.0);
	
	gl_FragColor = color_final;
}