import { World, Vec3, SAPBroadphase } from 'cannon-es'

export class Simulation {
  constructor(scene) {
    this.scene = scene
    this.items = []

    this.init()
  }

  async init() {
    this.world = new World({
      gravity: new Vec3(0, 0, 0),
      broadphase: new SAPBroadphase()
    })

    if (window.location.hash.includes('#debug')) {
      const module = await import('cannon-es-debugger')

      this.debugger = new module.default(this.scene, this.world, {
        color: 0x005500,
        onInit: (body, mesh) => {
          window.addEventListener('togglePhysicsDebug', () => {
            mesh.visible = !mesh.visible
          })
        }
      })
    }
  }

  addItem(item) {
    this.items.push(item)
    this.world.addBody(item.physicsBody)
  }

  removeItem(item) {
    setTimeout(() => {
      this.items = this.items.filter((b) => b !== item)
      this.world.removeBody(item.physicsBody)
    }, 0)
  }

  update() {
    this.world.fixedStep()

    for (const item of this.items) {
      item.update()
    }

    this.debugger?.update()
  }
}
