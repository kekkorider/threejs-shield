varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform vec3 u_HitPoint;
uniform float u_FresnelFalloff;
uniform float u_FresnelStrength;
uniform float u_HitPointSize;
uniform float u_HitPointThickness;

#include <clipping_planes_pars_fragment>

#define colA vec4(0.2157, 0.3137, 0.3373, 0.008)
#define colB vec4(0.0784, 0.5725, 0.6471, 0.7)

void main() {
  #include <clipping_planes_fragment>

  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

  // Draw a ring on the surface of the sphere
  float dOuter = distance(u_HitPoint, vWorldPosition);
  dOuter = smoothstep(u_HitPointSize, u_HitPointSize+u_HitPointThickness, dOuter);
  dOuter = 1.0 - dOuter;

  float dInner = distance(u_HitPoint, vWorldPosition);
  dInner = smoothstep(u_HitPointSize-u_HitPointThickness, u_HitPointSize, dInner);

  float d = dOuter*dInner;

  // Fresnel effect
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
