import { Pane } from 'tweakpane'
import { Color } from 'three'
import { gsap } from 'gsap'

export class Debug {
  constructor(app) {
    this.app = app

    this.#createPanel()
    this.#createSceneConfig()
    this.#createControlsConfig()
    this.#createShieldConfig()
  }

  refresh() {
    this.pane.refresh()
  }

  #createPanel() {
    this.pane = new Pane({
      container: document.querySelector('#debug')
    })
  }

  #createSceneConfig() {
    const folder = this.pane.addFolder({ title: 'Scene' })

    const params = {
      background: { r: 18, g: 18, b: 18 }
    }

    folder.addInput(params, 'background', { label: 'Background Color' }).on('change', e => {
      this.app.renderer.setClearColor(new Color(e.value.r / 255, e.value.g / 255, e.value.b / 255))
    })

    folder.addSeparator()

    folder.addButton({ title: 'Toggle Physics Debug' }).on('click', () => {
      for (const body of this.app.simulation.bodies) {
        if (!!body.debugMesh) {
          body.removeDebugMesh()
        } else {
          body.createDebugMesh()
        }
      }
    })

    folder.addSeparator()

    folder.addButton({ title: 'Spawn Bullet from laser position' }).on('click', () => {
      this.app.spawnBullet()
    })

    folder.addButton({ title: 'Spawn Bullet from random position' }).on('click', () => {
      this.app.spawnBullet({
        x: gsap.utils.random(2, 5) * gsap.utils.random([-1, 1]),
        y: gsap.utils.random(-3, 3),
        z: gsap.utils.random(2, 5) * gsap.utils.random([-1, 1])
      })
    })
  }

  #createControlsConfig() {
    const folder = this.pane.addFolder({ title: 'Controls' })

    folder.addButton({ title: 'Remove' }).on('click', () => {
      this.app.transformControls.detach()
    })

    folder.addSeparator()

    const items = ['Plane', 'Laser']

    items.forEach(name => {
      folder.addButton({ title: `Attach to ${name}` }).on('click', () => {
        this.app.transformControls.attach(this.app.scene.getObjectByName(name))
      })
    })
  }

  #createShieldConfig() {
    const folder = this.pane.addFolder({ title: 'Shield' })
    const mesh = this.app.scene.getObjectByName('Shield')

    folder.addInput(mesh.material.uniforms.u_FresnelFalloff, 'value', { label: 'Fresnel falloff', min: 0, max: 3 })
    folder.addInput(mesh.material.uniforms.u_FresnelStrength, 'value', { label: 'Fresnel strength', min: 0, max: 1 })
  }

  /**
   * Adds a color control for the given object to the given folder.
   *
   * @param {*} obj Any THREE object with a color property
   * @param {*} folder The folder to add the control to
   */
  #createColorControl(obj, folder) {
    const baseColor255 = obj.color.clone().multiplyScalar(255)
    const params = { color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b } }

    folder.addInput(params, 'color', { label: 'Color' }).on('change', e => {
      obj.color.setRGB(e.value.r, e.value.g, e.value.b).multiplyScalar(1 / 255)
    })
  }
}
