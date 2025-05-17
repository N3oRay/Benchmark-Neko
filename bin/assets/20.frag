/*
 * Original shader from: https://www.shadertoy.com/view/NdfGDr
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
const float maxSteps = 100.;
const int iMaxSteps = 100;
const float hitThreshold = .002;
const float maxDistance = 20.;
const float specExp = 40.;
const float AA = 2.;

struct Sphere
{
    vec3 center;
    float radius;
    vec3 color;
};

struct Ray
{
    vec3 origin;
    vec3 dir;
};

struct Light
{
    vec3 point;
    float intensity;
    vec3 color;
    float sharpness;
};

struct Hit
{
    float t;
    vec3 color;
};

Hit sphereSDF(vec3 p, Sphere s)
{
    return Hit(length(p - s.center) - s.radius, s.color);
}

vec3 rayToPos(Ray ray, float t)
{
    return ray.origin + ray.dir * t;
}

// Signed distance functions for different shapes

Hit mandelbulbSDF(vec3 p)
{
    float power = 3.;
    vec3 z = p.zyx;
    float dr = 1.;
    float r;
    vec3 c1 = vec3(0.65, 0.65, .8);
    vec3 c2 = vec3(.6, 0.2, 0.) * 0.01;
    
    for (int i = 0; i < 15; i++)
    {
        r = length(z);
        if (r > 2.)
        {
            break;
        }
        float theta = acos(z.z / r) * power + iTime;
        float phi = atan(z.y/z.x) * power + iTime;
        float zr = pow(r, power);
        dr = pow(r, power - 1.) * power * dr + 1.;
        z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
        z += p;
        c2 += c2;
    }
    return Hit(0.5 * log(r) * r / dr, c1 + c2);
}

// Smooth min to cause shapes to morph into eachother
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

// Define the objects in the scene and their relations to eachother
Hit map(vec3 p)
{
    return mandelbulbSDF(p);
}

// Calculate the gradient of the world at a point
vec3 calcNormal(vec3 p)
{
    const vec3 eps = vec3(0.001, 0., 0.);
    
    float deltaX = map(p + eps.xyy).t - map(p - eps.xyy).t;
    float deltaY = map(p + eps.yxy).t - map(p - eps.yxy).t;
    float deltaZ = map(p + eps.yyx).t - map(p - eps.yyx).t;
    
    return normalize(vec3(deltaX, deltaY, deltaZ));
}

// Convert a ray into a shadow scalar
float calcShadow(Ray ray, float maxT, float k)
{
    float res = 1.0;
    float ph = 1e20;
    float t = hitThreshold * 50.;
    for (int i = 0; i < 10; ++i)
    {
        if (t >= maxT) break;
        float h = map(rayToPos(ray, t)).t;
        if (h < hitThreshold)
        {
            return 0.;
        }
        float hsqr = pow(h, 2.);
        float y = hsqr/(2. * ph);
        float d = sqrt(hsqr - pow(y, 2.));
        res = min(res, k * d / max(0., t - y));
        ph += h;
        t += h;
        if (i > iMaxSteps) 
        {
            break;
        }
    }
    return res;
}

// Combine all the lights in the scene to color objects
vec3 calcLight(vec3 p, vec3 v, vec3 n)
{
    const int lCount = 1;
    Light lights[lCount];
    lights[0] = Light(vec3(0., 6., 5.), 20., vec3(1., 1., 1.), 8.);
    vec3 ambient = vec3(1.00,1.,1.0) * 0.09;
    
    vec3 color = vec3(0.);
    for (int i = 0; i < lCount; i++)
    {
        vec3 ldir = lights[i].point - p;
        float lmag = length(ldir); 
        ldir /= lmag;
        
        vec3 h = normalize(ldir - v);
        float spec = max(0., pow(dot(n, h), specExp));
        
        float diff = max(0., dot(ldir, n));

        float shadow = calcShadow(Ray(p, ldir), lmag, lights[i].sharpness);
        
        float strength = shadow * lights[i].intensity * (1./pow(lmag, 2.));
        color += strength * (lights[i].color * diff + vec3(1.) * spec);
    }
    
    return ambient + color;
}

// Convert Pixel Rays to Colors
vec3 raymarch(Ray ray)
{
    vec3 glow = vec3(1., .0, -.5) * .1;
    float t = 0.;
    for (float i = 0.; i < maxSteps; ++i)
    {
        vec3 currentPos = rayToPos(ray, t);
        Hit closestHit = map(currentPos);
        
        if (closestHit.t < hitThreshold)
        {
            vec3 normal = calcNormal(currentPos);
            vec3 color = closestHit.color * calcLight(currentPos, ray.dir, normal);
            return color + glow * i/maxSteps;
        }
        
        if (t > maxDistance)
        {
            break;
        }
        t += closestHit.t;
    }
    return vec3(0.01, 0.02, 0.03);// + glow * smoothstep(0., 1.5, i/maxSteps);
}

vec4 render(in vec3 e, in mat4 view, in vec2 uv) {
    // Create viewing rays and get colors from them
    vec3 p = (view * vec4(uv, -1., 1.)).xyz;
    Ray viewRay = Ray(e, normalize(p - e));
    return vec4(raymarch(viewRay), 1.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Define Camera
    vec3 viewpoint = vec3(0., 0., 0.);
    vec3 e = vec3(0., 0., 2.5);
    
    // Construct camera Matrix
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 w = -normalize(viewpoint - e);
    vec3 u = cross(w, up);
    vec3 v = normalize(cross(u, w));
    
    mat4 view = mat4(
        u, 0.0,
        v, 0.0,
        w, 0.0,
        e, 1.0
    );

    // Convert pixel coordinates to uv coordinates
    if (AA > 1.) {
      vec4 average = vec4(0.0);
      for (float s = 0.; s < AA; s++) {
        for (float t = 0.; t < AA; t++) {
            vec2 offset = (vec2(s, t) / AA) - 0.5;

            vec2 uv = (fragCoord + offset)/iResolution.xy * 2. - 1.;
            uv.y *= iResolution.y/iResolution.x;

            average += render(e, view, uv);
        }
      }  
      average /= AA*AA;
      fragColor = average;
    } else {
      vec2 uv = fragCoord/iResolution.xy * 2. - 1.;
      uv.y *= iResolution.y/iResolution.x;

      fragColor = render(e, view, uv);
    }
    
    
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}