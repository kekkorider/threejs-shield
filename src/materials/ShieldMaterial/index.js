import { AdditiveBlending, Color, DoubleSide, ShaderMaterial, Vector3, Vector4 } from 'three'

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
    u_HitPointColorB: { value: new Vector4(0.20784313725490197, 0.3607843137254902, 0.6862745098039216, 0.8) },
    u_HitPointThickness: { value: 0.75 },
    u_FresnelFalloff: { value: 0.75 },
    u_FresnelStrength: { value: 0.85 },
    u_FresnelColor: { value: new Color(0xff0000) }
  }
})
