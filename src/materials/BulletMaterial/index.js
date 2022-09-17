import { ShaderMaterial } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const BulletMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true
})
