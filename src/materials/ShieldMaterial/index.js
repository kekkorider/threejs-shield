import { AdditiveBlending, DoubleSide, ShaderMaterial, Vector3 } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const ShieldMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: DoubleSide,
  blending: AdditiveBlending,
  clipIntersection: true,
  clipping: true,
  uniforms: {
    u_HitPoint: { value: new Vector3(0.893587099043815, 0.306668481124315, 0.4467935495219075) },
    u_HitPointSize: { value: 1 },
    u_HitPointThickness: { value: 0.1 },
    u_FresnelFalloff: { value: 1.86 },
    u_FresnelStrength: { value: 0.34 }
  }
})
