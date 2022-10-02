import { AdditiveBlending, Color, DoubleSide, ShaderMaterial, Vector3, Vector4 } from 'three'
import { hitPointsNum } from '../../const'

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
  defines: {
    HIT_POINTS_NUM: hitPointsNum
  },
  uniforms: {
    t_Noise: { value: null },
    u_Time: { value: 0 },
    u_HitPoints: { value: new Array(hitPointsNum).fill({ position: new Vector3(999, 999, 999), size: 0, thickness: 0 }) },
    u_HitPointColorA: { value: new Vector4(0, 168 / 255, 245 / 255, 0.04) },
    u_HitPointColorB: { value: new Vector4(53 / 255, 175 / 255, 90 / 255, 0.8) },
    u_FresnelFalloff: { value: 0.75 },
    u_FresnelStrength: { value: 0.85 },
    u_FresnelColor: { value: new Color(1, 144 / 255, 0) }
  }
})
