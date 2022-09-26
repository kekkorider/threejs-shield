import { AdditiveBlending, DoubleSide, ShaderMaterial, Vector3 } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const ShieldMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: DoubleSide,
  blending: AdditiveBlending,
  uniforms: {
    u_HitPoint: { value: new Vector3() },
    u_FresnelFalloff: { value: 0.95 },
    u_FresnelStrength: { value: 0.8 }
  }
})
