import { World, Vec3, SAPBroadphase } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'

export class Simulation {
  constructor(scene) {
    this.scene = scene
    this.items = []

    this.init()
  }

  init() {
    this.world = new World({
      gravity: new Vec3(0, 0, 0),
      broadphase: new SAPBroadphase()
    })

    this.debugger = new CannonDebugger(this.scene, this.world, {
      color: Math.random() * 0xffffff,
      onUpdate: (body, mesh) => {
        body.quaternion.copy(mesh.quaternion)
      }
    })
  }

  addItem(item) {
    this.items.push(item)
    this.world.addBody(item.physicsBody)
  }

  removeItem(item) {
    this.items = this.items.filter((b) => b !== item)
    this.world.removeBody(item.physicsBody)
  }

  update() {
    this.world.fixedStep()

    for (const item of this.items) {
      item.update()
    }

    this.debugger.update()
  }
}
