import { World, Vec3 } from 'cannon-es'

export class Simulation {
  constructor() {
    this.bodies = []

    this.init()
  }

  init() {
    this.world = new World({
      gravity: new Vec3(0, -9.82, 0)
    })
  }

  addBody(body) {
    this.bodies.push(body)
    this.world.addBody(body.physicsBody)
  }

  removeBody(body) {
    this.bodies = this.bodies.filter((b) => b !== body)
    this.world.removeBody(body.physicsBody)
  }

  update() {
    this.world.fixedStep()

    for (const body of this.bodies) {
      body.update()
    }
  }

  toggleDebug() {
    for (const body of this.bodies) {
      body.toggleDebug()
    }
  }
}
