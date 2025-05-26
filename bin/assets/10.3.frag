#ifdef GL_ES
precision mediump float;
#endif

// Varyings from the vertex shader
varying vec2 v_texCoord;
varying vec3 v_worldPos;
varying vec3 v_normal;

// Uniforms
uniform sampler2D u_envMap;      // Reflection environment map (e.g., a skybox or cubemap rendered to 2D)
uniform float u_time;            // Time for animation
uniform vec3 u_cameraPos;        // Camera position in world space
uniform vec3 u_lightDir;         // Light direction
uniform vec3 u_waterColor;       // Base color of the water

// Simple 2D wave function for surface normal distortion
vec3 getWaveNormal(vec2 uv, float time) {
    float wave1 = sin(uv.x * 40.0 + time * 2.0) * 0.1;
    float wave2 = cos(uv.y * 30.0 - time * 1.5) * 0.1;
    float wave3 = sin((uv.x + uv.y) * 20.0 + time) * 0.05;
    vec3 normal = normalize(vec3(-wave1 - wave3, -wave2 - wave3, 1.0));
    return normal;
}

void main() {
    // Animate and distort the surface normal for waves
    vec3 normal = getWaveNormal(v_texCoord, u_time);

    // Calculate view and reflection directions
    vec3 viewDir = normalize(u_cameraPos - v_worldPos);
    vec3 reflectDir = reflect(-viewDir, normal);

    // Reflection lookup (approximate, for demo: use env map with reflectDir.xy as coordinates)
    vec2 reflectUV = reflectDir.xy * 0.5 + 0.5;
    vec3 reflection = texture2D(u_envMap, reflectUV).rgb;

    // Fresnel effect for blending reflection and base color
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0) * 0.65 + 0.35;

    // Simple specular highlight
    float spec = pow(max(dot(reflect(-u_lightDir, normal), viewDir), 0.0), 32.0);

    // Combine water color, reflection, and specular highlight
    vec3 color = mix(u_waterColor, reflection, fresnel) + spec * 0.25;

    gl_FragColor = vec4(color, 1.0);
}

