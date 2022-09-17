import { Mesh } from 'three'
import { PhysicsDebugMaterial } from './materials/PhysicsDebugMaterial'

export class PhysicsBody {
  constructor(mesh, scene) {
    this.scene = scene
    this.mesh = mesh

    this.physicsBody = null
    this.debugMesh = null
  }

  update() {
    if (!!!this.physicsBody) return

    this.mesh.position.copy(this.physicsBody.position)
    this.debugMesh?.position.copy(this.physicsBody.position)
  }

  createDebugMesh() {
    this.debugMesh = new Mesh(this.mesh.geometry, PhysicsDebugMaterial)
    this.debugMesh.position.copy(this.mesh.position)

    this.scene.add(this.debugMesh)
  }

  removeDebugMesh() {
    this.scene.remove(this.debugMesh)
    this.debugMesh = null
  }
}
