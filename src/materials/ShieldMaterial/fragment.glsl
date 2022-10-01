struct HitPoint {
  vec3 position;
  float thickness;
  float size;
};

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform sampler2D t_Noise;

uniform HitPoint u_HitPoints[HIT_POINTS_NUM];
uniform vec4 u_HitPointColorA;
uniform vec4 u_HitPointColorB;

uniform float u_FresnelFalloff;
uniform float u_FresnelStrength;
uniform vec3 u_FresnelColor;

uniform float u_Time;

#include <clipping_planes_pars_fragment>

void main() {
  #include <clipping_planes_fragment>

  vec4 noise = texture2D(t_Noise, vUv*3.0 + u_Time*vec2(0.127, 0.178));

  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

  // Draw a ring on the surface of the sphere
  float hits = 0.0;

  for (int i = 0; i < HIT_POINTS_NUM; i++) {
    float dOuter = distance(u_HitPoints[i].position, vWorldPosition);
    dOuter = smoothstep(u_HitPoints[i].size, u_HitPoints[i].size+u_HitPoints[i].thickness, dOuter);
    dOuter = 1.0 - dOuter;

    float dInner = distance(u_HitPoints[i].position, vWorldPosition);
    dInner = smoothstep(u_HitPoints[i].size-u_HitPoints[i].thickness, u_HitPoints[i].size, dInner);

    float d = dOuter*dInner;

    hits += d;

    hits = clamp(hits, 0.0, 2.0);
  }

  // Fresnel effect
  float fresnel = 1.0 - max(0.0, dot(viewDirection, normal));
  fresnel = pow(fresnel, u_FresnelFalloff);
  fresnel = smoothstep(0.45, 0.65, fresnel);
  fresnel *= u_FresnelStrength;

  vec4 color = mix(u_HitPointColorA, u_HitPointColorB, hits*smoothstep(0.3, 0.6, noise.r));

  #if !defined(FLIP_SIDED)
    color.rgb += fresnel*u_FresnelColor;
  #endif

  gl_FragColor = color;
}
