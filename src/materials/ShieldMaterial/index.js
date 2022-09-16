import { DoubleSide, ShaderMaterial, Vector3 } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const ShieldMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: DoubleSide,
  uniforms: {
    u_HitPoint: {
      value: new Vector3()
    }
  }
})
