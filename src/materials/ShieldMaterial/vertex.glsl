varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  // Mesh position in world space
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vUv = uv;
  vWorldPosition = worldPosition.xyz;
}
