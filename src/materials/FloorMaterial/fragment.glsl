varying vec2 vUv;

#define black vec3(0.0, 0.0, 0.0)
#define white vec3(1.0, 1.0, 1.0)
#define borderThickness 0.01

void main() {
  vec2 gv = fract(vUv * 20.0);

  vec3 color = step(borderThickness, gv.x) * step(borderThickness, gv.y) * white + (1.0 - step(borderThickness, gv.x) * step(borderThickness, gv.y)) * black;
  color = 1.0 - color;

  gl_FragColor = vec4(color, color.r);
}
