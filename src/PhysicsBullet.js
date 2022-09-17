import { Cylinder, Body } from 'cannon-es'
import { PhysicsBody } from './PhysicsBody'

export class PhysicsBullet extends PhysicsBody {
  constructor(mesh, scene) {
    super(mesh, scene)

    this.addBody()
  }

  addBody() {
    const { position } = this.mesh
    const { radiusTop, radiusBottom, height, radialSegments: numSegments } = this.mesh.geometry.parameters

    this.physicsBody = new Body({
      mass: 0,
      position,
      shape: new Cylinder(radiusTop, radiusBottom, height, numSegments),
      type: Body.KINEMATIC
    })
  }
}
