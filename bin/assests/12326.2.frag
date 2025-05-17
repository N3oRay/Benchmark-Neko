precision mediump float;
uniform vec2 resolution;


#define WW 0.0
#define OO 1.0
#define cc 2.0
#define _i 3.0

#define MKNum(a,b,c,d,e,f,g,h) (a+4.0*(b+4.0*(c+4.0*(d+4.0*(e+4.0*(f+4.0*(g+h*4.0)))))))

// looks better, uses less memory and no arrays (hurray) - by iq & movAX13h
float sample(in vec2 uv) {
	ivec2 p = ivec2(0.0);
	p.x = int( uv.x*16.);
	p.y = int( uv.y*16.);
    p.x = (p.x>7) ? 15-p.x : p.x;

    float rr=0.0;

    if(p.y== 0) rr=MKNum( _i,_i,_i,_i,_i,WW,WW,WW);
    if(p.y== 1) rr=MKNum( _i,_i,_i,WW,WW,WW,OO,cc);
    if(p.y== 2) rr=MKNum( _i,_i,WW,WW,OO,OO,OO,cc);
    if(p.y== 3) rr=MKNum( _i,WW,WW,cc,OO,OO,cc,cc);
    if(p.y== 4) rr=MKNum( _i,WW,OO,cc,cc,cc,cc,cc);
    if(p.y== 5) rr=MKNum( WW,WW,OO,OO,cc,cc,OO,OO);
    if(p.y== 6) rr=MKNum( WW,OO,OO,OO,cc,OO,OO,OO);
    if(p.y== 7) rr=MKNum( WW,OO,OO,OO,cc,OO,OO,OO);
    if(p.y== 8) rr=MKNum( WW,OO,OO,cc,cc,OO,OO,OO);
    if(p.y== 9) rr=MKNum( WW,cc,cc,cc,cc,cc,OO,OO);
    if(p.y==10) rr=MKNum( WW,cc,cc,WW,WW,WW,WW,WW);
    if(p.y==11) rr=MKNum( WW,WW,WW,WW,_i,_i,WW,_i);
    if(p.y==12) rr=MKNum( _i,WW,WW,_i,_i,_i,WW,_i);
    if(p.y==13) rr=MKNum( _i,_i,WW,_i,_i,_i,_i,_i);
    if(p.y==14) rr=MKNum( _i,_i,WW,WW,_i,_i,_i,_i);
    if(p.y==15) rr=MKNum( _i,_i,_i,WW,WW,WW,WW,WW);

    return mod( floor(rr / pow(4.0,float(p.x))), 4.0 )/3.0;
}

void main(void)
{
	float col = 1.0;
	if( abs(gl_FragCoord.x-resolution.x/2.)<resolution.y/2.0 ) {
		float rx = (gl_FragCoord.x-(resolution.x-resolution.y)/2.)/resolution.y;
		float ry = 1.0 - gl_FragCoord.y/resolution.y;
		col = sample( vec2(rx,ry) );
	}
	gl_FragColor = vec4(col, col, col, 1.0);
}
