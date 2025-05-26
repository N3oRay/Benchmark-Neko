attribute vec3 position;
attribute vec2 surfacePosAttrib;
// Optional normal
attribute vec3 normal;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat3 u_normalMatrix;
uniform bool u_useTransform; // Set to false if you want the fallback

varying vec2 surfacePosition;
varying vec2 v_texCoord;
varying vec3 v_worldPos;
varying vec3 v_normal;

void main() {
    surfacePosition = surfacePosAttrib;
    v_texCoord = surfacePosAttrib;

    vec4 worldPos;
    if (u_useTransform) {
        worldPos = u_modelViewMatrix * vec4(position, 1.0);
        v_worldPos = worldPos.xyz;
        gl_Position = u_projectionMatrix * worldPos;
        v_normal = normalize(u_normalMatrix * normal);
    } else {
        // Fallback if worldPos is "not initialized"
        worldPos = vec4(position, 1.0);
        v_worldPos = position;
        gl_Position = worldPos;
        v_normal = vec3(0.0, 0.0, 1.0);
    }
}
