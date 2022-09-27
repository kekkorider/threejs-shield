import { AdditiveBlending, DoubleSide, ShaderMaterial, Vector3, Vector4 } from 'three'

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
    t_Noise: { value: null },
    u_Time: { value: 0 },
    u_HitPoint: { value: new Vector3(0.893587099043815, 0.306668481124315, 0.4467935495219075) },
    u_HitPointSize: { value: 0.6 },
    u_HitPointColorA: { value: new Vector4(0.27450980392156865, 0.027450980392156862, 0.6392156862745098, 0.008) },
    u_HitPointColorB: { value: new Vector4(0.0784313725490196, 0.6470588235294118, 0.43529411764705883, 0.7) },
    u_HitPointThickness: { value: 0.75 },
    u_FresnelFalloff: { value: 1.86 },
    u_FresnelStrength: { value: 0.34 }
  }
})
