import { Sphere, Body } from 'cannon-es'
import { PhysicsBody } from './PhysicsBody'

export class PhysicsShield extends PhysicsBody {
  constructor(mesh, scene) {
    super(mesh, scene)

    this.addBody()
  }

  addBody() {
    const { position } = this.mesh
    const { radius } = this.mesh.geometry.parameters

    this.physicsBody = new Body({
      mass: 0,
      position,
      shape: new Sphere(radius + 0.01),
      type: Body.STATIC
    })
  }
}
