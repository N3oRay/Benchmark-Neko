// anal leakage
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.14159265359;

float getRForCentre (in vec2 centre, in vec2 pos)
{
	return sqrt( pow(abs(pos.x - centre.x), 2.0) + pow (abs(pos.y - centre.y), 2.0) );
}

float getAngleForCentre (in vec2 centre, in vec2 pos)
{
	float x = pos.x - centre.x;
	float y = pos.y - centre.y;
	float addMultX = float(x<0.0);
	float addMultY = float(x>0.0)*float(y<0.0);
	return (atan(y/x) + pi*addMultX + pi*2.0*addMultY) / (2.0*pi);
}

float getMovingCircleColour (in float spiralPos, in vec2 pos, in float direction, in vec2 centreOffset)
{
	vec2 newCentre = vec2 (0.1 * cos(spiralPos*direction * 2.0 * pi), 0.1 * sin (spiralPos*direction * 2.0 * pi)) + centreOffset;
	float circDist = clamp (1.0 - distance (pos, newCentre)*9.0, 0.0, 1.0);
	float circX = pos.x - newCentre.x;
	float circY = pos.y - newCentre.y;
	float textX = sin (circX*10.0 + pos.x*(/*abs(pos.y*10.0) * */1.0)) * 0.5 + 0.5;
	float textY = sin (circY*10.0 + pos.y*(/*abs(pos.x*10.0) * */1.0)) * 0.5 + 0.5;
	return circDist;//textX * textY * circDist;
}

float getSpiralTrailColour (in float movingA, in float r, in float discC)
{
	float blur  = movingA;
	float lim = smoothstep (discC, discC + blur, r);
	float lim2 = smoothstep (discC - blur, discC, r);

	float limmult = abs (lim - lim2);
	return limmult;
}

float getSpiralTextureColour1 (in float freq, in float r)
{
	return sin(r*freq);
}

float getSpiralTextureColour2 (in float movingA, in float freq)
{
	return sin ((clamp(1.0-movingA, 0.0, 1.0) * (sin(time*0.1)*0.3+0.7))*freq);
}

float getSprialTextureColour3 (in float discC, in float r, in float time, float freq)
{
	float maxL =  discC;
	float invR = 1.0 - (r / maxL);
	float sides = sin ((1.0 - abs(r)) * (freq*(invR) ) + time);
	return sides;
}

float getSpiralLengthColour (in float movingA)
{
	float spiralEnd = clamp (1.0 - movingA*1.5, 0.0, 1.0 );
	float spiralStart = smoothstep (0.01, 0.1, movingA);
	return spiralStart * spiralEnd;
}

float warpExp(in float x)
{
	return (pow(10.0, 3.0*x) - 1.0) / (pow(10.0, 3.0) - 1.0);
}

void addSpiral(in vec2 centre, 
	in vec2 pos, 
	in float rate, //e.g. 25.0
	in float offset, //0 - 1
	in float time, 
	in vec3 textureAnimationRates, // 0 - 1
	in vec3 textureAnimationDepths, // 50 - 1500?
	in vec3 textureAnimationOffsets, // 1 - 10?
	in float texture3Rate, // 0 - 1
	in vec3 spiralIntensityTextureMultipliers, //e.g. the texture rates used for a different spiral
	in float flipDirection, //-1 OR 1
	in float flipBody, // 0 OR 1
	in float flipColour, // 0 OR 1 
	out vec3 col,
	out vec3 spiralTextureRates)
{
	float r = getRForCentre (centre, pos);
	float a = getAngleForCentre (centre, pos);
	float spiralPos = flipDirection * mod(time, rate) / rate + offset;
	float movingA = mod(a + spiralPos, 1.0);
	movingA = flipBody * (1.0 - movingA) + (1.0 - flipBody) * movingA;
	float colCircle = getMovingCircleColour (spiralPos, pos, -1.0, centre);
	float discC = 0.2 + pow(movingA, 2.0);
	float spiralIntensity = getSpiralTrailColour (movingA, r, discC);
	float spiralTexture1Rate = sin(time*textureAnimationRates.x)*0.5 + 0.5;
	float spiralTexture2Rate = sin(time*textureAnimationRates.y)*0.5 + 0.5;
	float spiralTexture3Rate = sin(time*textureAnimationRates.z)*0.5 + 0.5;
	spiralTextureRates = vec3(spiralTexture1Rate, spiralTexture2Rate, spiralTexture3Rate);
	float spiralTexture1 = getSpiralTextureColour1(textureAnimationOffsets.x + spiralTexture1Rate*textureAnimationDepths.x, r);
	float spiralTexture2 = getSpiralTextureColour2 (movingA, textureAnimationOffsets.y + spiralTexture2Rate*textureAnimationDepths.y);
	float spiralTexture3 = getSprialTextureColour3 (discC, r, time * texture3Rate, textureAnimationOffsets.z + spiralTexture3Rate*textureAnimationDepths.z);
	float spiralLength = getSpiralLengthColour (movingA);
	spiralIntensity *= spiralLength;
	spiralIntensity *= 1.0 + spiralTexture1 * spiralIntensityTextureMultipliers.x;
	spiralIntensity *= 1.0 + spiralTexture2 * spiralIntensityTextureMultipliers.y;
	spiralIntensity *= 1.0 + spiralTexture3 * spiralIntensityTextureMultipliers.z;
	float red = movingA;
	red = flipColour * (2.0 - red) + (1.0 - flipColour) * red;
	float blue = 1.0 - movingA;
	blue = flipColour * (1.0 - blue) + (1.0 - flipColour) * blue;
	vec3 spiralCol = spiralIntensity * vec3(red, 0.5, blue);
	col += spiralCol;
}

void main() 
{ 
	float mmax = max (resolution.x, resolution.y);
	vec2 pos = vec2 (gl_FragCoord.xy/resolution);// / mmax);
	pos = pos * 2.0 -1.0;
	vec3 col = vec3(0.0);
	

	float xAbs = abs(pos.x);
	float yAbs = abs (pos.y);
	float mX = mouse.x * 2.0 - 1.0;
	float mY = mouse.y * 2.0 - 1.0;
	vec2 centre1 = vec2(0.0, 0.0);
	vec2 centre2 = vec2(0.0, 0.0);
	vec2 centre3 = vec2(0.0, 0.0);
	float r = getRForCentre (centre1, pos);
	float r2 = getRForCentre (centre2, pos);
	
	float a = getAngleForCentre (centre1, pos);
	float a2 = getAngleForCentre (centre2, pos);

	float rate1 = 25.0;
	float rate2 = 25.0;
	float rate3 = 25.0;
	float spiralPos = mod(time, rate1) / rate1;
	float spiralPos2 = mod(time, rate2) / rate2;
	
	float movingA = mod(a + spiralPos, 1.0); 
	float movingA2 = 1.0 - mod(a2 + spiralPos2, 1.0);

	float colCircle = getMovingCircleColour (spiralPos, pos, -1.0, centre1);
	float colCircle2 = getMovingCircleColour (spiralPos2, pos, -1.0, centre2);

	float discC = 0.18 + pow(movingA, 2.0);
	float discC2 = 0.2 + pow(movingA2, 2.0);
	float spiralIntensity = getSpiralTrailColour (movingA, r, discC);
	float spiralIntensity2 = getSpiralTrailColour (movingA2, r2, discC2);

	float spiral1Texture1Rate = sin(time*0.01)*0.5 + 0.5;
	float spiral1Texture2Rate = sin(time*0.015)*0.5 + 0.5;
	float spiral1Texture3Rate = sin(time*0.03)*0.5 + 0.5;
	float spiral1Texture1 = getSpiralTextureColour1(10.0 + spiral1Texture1Rate*90.0, r);
	float spiral1Texture2 = getSpiralTextureColour2 (movingA, 10.0 + spiral1Texture2Rate*110.0);
	float spiral1Texture3 = getSprialTextureColour3 (discC, r, time, 10.0 + spiral1Texture3Rate*100.0);

	float spiral2Texture1Rate = sin(time*0.02)*0.5 + 0.5;
	float spiral2Texture2Rate = sin(time*0.01)*0.5 + 0.5;
	float spiral2Texture3Rate = sin(time*0.015)*0.5 + 0.5;
	float spiral2Texture1 = getSpiralTextureColour1 (1.0 + spiral2Texture1Rate * 120.0, r2);
	float spiral2Texture2 = getSpiralTextureColour2 (movingA2, 5.0 + spiral2Texture2Rate*1150.0);
	float spiral2Texture3 = getSprialTextureColour3 (discC2, r2, time*0.7, 10.0 + spiral2Texture3Rate * 150.0);

	float spiral1Length = getSpiralLengthColour (movingA);
	float spiral2Length = getSpiralLengthColour (movingA2);
	
	spiralIntensity *= spiral1Length;
	spiralIntensity *= 1.0 + spiral1Texture1 * spiral2Texture1Rate;
	spiralIntensity *= 1.0 + spiral1Texture2 * spiral2Texture2Rate;
	spiralIntensity *= 1.0 + spiral1Texture3 * spiral2Texture3Rate;
	vec3 spiralCol1 = spiralIntensity * vec3(movingA, 0.5, 1.0  - movingA);
	col += spiralCol1;

	
	spiralIntensity2 *= spiral2Length;
	spiralIntensity2 *= 1.0 + spiral2Texture1 * spiral1Texture1Rate;
	spiralIntensity2 *= 1.0 + spiral2Texture2 * spiral1Texture2Rate;;
	spiralIntensity2 *= 1.0 + spiral2Texture3 * spiral1Texture3Rate;;
	col += spiralIntensity2 * vec3(1.0 - movingA2, 0.5, movingA2);

	//========================================================
	vec3 spiral3TextureRates = vec3(0.0);
	addSpiral(vec2(0.0, 0.0), pos, 25.0, 0.5, time, 
				vec3(0.011, 0.012, 0.02), 
				vec3(100.0, 500.0, 125.0), 
				vec3(10.0, 4.0, 9.0), 
				0.8, vec3(spiral1Texture1Rate, spiral1Texture2Rate, spiral1Texture3Rate), 
				1.0, 1.0, 1.0, col, spiral3TextureRates);

	addSpiral(vec2(0.0, 0.0), pos, 25.0, -0.5, time, 
				vec3(0.015, 0.021, 0.12), 
				vec3(110.0, 80.0, 525.0), 
				vec3(9.0, 5.0, 3.0), 
				0.9, spiral3TextureRates, 
				1.0, 0.0, 0.0, col, spiral3TextureRates);

	//========================================================
	vec3 spiral4TextureRates = vec3(0.0);
	addSpiral(vec2(0.0, 0.0), pos, 25.0, 0.25, time, 
				vec3(0.02, 0.01, 0.015), 
				vec3(200.0, 110.0, 225.0), 
				vec3(10.0, 4.0, 9.0), 
				0.8, spiral3TextureRates, 
				1.0, 1.0, 1.0, col, spiral4TextureRates);

	addSpiral(vec2(0.0, 0.0), pos, 25.0, 0.25, time, 
				vec3(0.011, 0.03, 0.16), 
				vec3(310.0, 80.0, 55.0), 
				vec3(9.0, 5.0, 3.0), 
				0.9, spiral4TextureRates, 
				1.0, 0.0, 0.0, col, spiral4TextureRates);

	//========================================================
	// vec3 spiral5TextureRates = vec3(0.0);
	// addSpiral(vec2(0.0, 0.0), pos, 25.0, -0.25, time, 
	// 			vec3(0.01, 0.03, 0.02), 
	// 			vec3(90.0, 105.0, 425.0), 
	// 			vec3(10.0, 4.0, 9.0), 
	// 			0.8, spiral4TextureRates, 
	// 			-1.0, 1.0, 1.0, col, spiral5TextureRates);

	// addSpiral(vec2(0.0, 0.0), pos, 25.0, -0.25, time, 
	// 			vec3(0.05, 0.01, 0.25), 
	// 			vec3(110.0, 380.0, 105.0), 
	// 			vec3(9.0, 5.0, 3.0), 
	// 			0.9, spiral5TextureRates, 
	// 			-1.0, 0.0, 0.0, col, spiral5TextureRates);
	//col += colCircle * vec3(0.1, 0.5, 1.0);
	//col += colCircle2 * vec3(1.0, 0.5, 0.1);


	gl_FragColor = vec4 (col, 1.0); 
}