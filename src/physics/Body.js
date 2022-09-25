export class PhysicsBody {
  constructor(mesh, scene) {
    this.scene = scene
    this.mesh = mesh

    this.physicsBody = null
  }

  update() {
    if (!!!this.physicsBody) return

    this.mesh.position.copy(this.physicsBody.position)
    this.mesh.quaternion.copy(this.physicsBody.quaternion)
  }
}
