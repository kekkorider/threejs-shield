void main() {
  vec3 color = vec3(0.0235, 0.5922, 0.9686);
  color += color;

  gl_FragColor = vec4(color, 1.0);
}
