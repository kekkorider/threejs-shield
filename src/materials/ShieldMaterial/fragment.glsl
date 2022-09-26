varying vec2 vUv;
varying vec3 vWorldPosition;

uniform vec3 u_HitPoint;

#define colA vec4(0.0902, 0.0902, 0.0902, 0.5)
#define colB vec4(0.0784, 0.5725, 0.6471, 1.0)

void main() {
  vec3 color = vec3(0.0);

  // Draw a circle on the surface of the sphere
  float d = distance(u_HitPoint, vWorldPosition);
  d = smoothstep(0.65, 0.68, d);
  d = 1.0 - d;

  gl_FragColor = mix(colA, colB, d);
}
