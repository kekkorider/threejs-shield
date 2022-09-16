varying vec2 vUv;

#define col vec3(0.0784, 0.5725, 0.6471)

void main() {
  gl_FragColor = vec4(col, 1.0)*col.g;
}
