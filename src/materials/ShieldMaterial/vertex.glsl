varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

#include <clipping_planes_pars_vertex>

void main() {
  #include <begin_vertex>

  #include <project_vertex>
  #include <clipping_planes_vertex>

  vUv = uv;
  vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
  vNormal = normal;
}
