varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform vec3 u_HitPoint;
uniform float u_FresnelFalloff;
uniform float u_FresnelStrength;

#include <clipping_planes_pars_fragment>

#define colA vec4(0.2157, 0.3137, 0.3373, 0.135)
#define colB vec4(0.0784, 0.5725, 0.6471, 1.0)

void main() {
  #include <clipping_planes_fragment>

  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

  // Draw a circle on the surface of the sphere
  float d = distance(u_HitPoint, vWorldPosition);
  d = smoothstep(0.65, 0.68, d);
  d = 1.0 - d;

  float fresnel = 1.0 - max(0.0, dot(viewDirection, normal));
  fresnel = pow(fresnel, u_FresnelFalloff);
  fresnel = smoothstep(0.45, 0.65, fresnel);
  fresnel *= u_FresnelStrength;

  vec4 color = mix(colA, colB, d);

  #if !defined(FLIP_SIDED)
    color.rgb += fresnel;
  #endif

  gl_FragColor = color;
}
