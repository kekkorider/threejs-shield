import { Sphere, Body } from 'cannon-es'
import { PhysicsBody } from './Body'

export class PhysicsShield extends PhysicsBody {
  constructor(mesh, scene) {
    super(mesh, scene)

    this.addBody()
  }

  addBody() {
    this.mesh.geometry.computeBoundingSphere()

    const { position } = this.mesh
    const { radius } = this.mesh.geometry.boundingSphere

    this.physicsBody = new Body({
      mass: 0,
      position,
      shape: new Sphere(radius + 0.01),
      type: Body.STATIC
    })
  }
}
