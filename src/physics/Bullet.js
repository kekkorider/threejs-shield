import { Cylinder, Body } from 'cannon-es'
import { PhysicsBody } from './Body'

export class PhysicsBullet extends PhysicsBody {
  constructor(mesh, scene) {
    super(mesh, scene)

    this.addBody()
  }

  addBody() {
    const { position, quaternion } = this.mesh
    const { radiusTop, radiusBottom, height, radialSegments: numSegments } = this.mesh.geometry.parameters

    this.physicsBody = new Body({
      mass: 1,
      position,
      quaternion,
      shape: new Cylinder(radiusTop, radiusBottom, height, numSegments)
    })
  }
}
