// Fused Vertex Shader: water.vert
attribute vec3 position;
attribute vec2 surfacePosAttrib;

// Optional: normal attribute for more advanced lighting (can be omitted for simple water)
attribute vec3 normal;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat3 u_normalMatrix;

varying vec2 surfacePosition;
varying vec2 v_texCoord;
varying vec3 v_worldPos;
varying vec3 v_normal;

void main() {
    surfacePosition = surfacePosAttrib;
    v_texCoord = surfacePosAttrib;

    // Calculate world position
    vec4 worldPos = u_modelViewMatrix * vec4(position, 1.0);
    v_worldPos = worldPos.xyz;

    // Calculate transformed normal, fallback to (0,0,1) if no normal provided
    #ifdef GL_OES_standard_derivatives
    v_normal = normalize(u_normalMatrix * normal);
    #else
    v_normal = vec3(0.0, 0.0, 1.0);
    #endif
	
	surfacePosition = surfacePosAttrib;

	gl_Position = vec4( position, 1.0 );

    //gl_Position = u_projectionMatrix * worldPos;

	
}
