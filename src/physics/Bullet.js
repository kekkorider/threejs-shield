import { Cylinder, Body, Vec3 } from 'cannon-es'
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

    this.physicsBody.addEventListener('collide', this.#onCollide)
  }

  #onCollide(e) {
    const data = {
      body: e.target,
      hitPoint: new Vec3(
        e.contact.ni.x + e.body.position.x,
        e.contact.ni.y + e.body.position.y,
        e.contact.ni.z + e.body.position.z
      )
    }

    window.dispatchEvent(new CustomEvent('collide', { detail: data }))
  }
}
