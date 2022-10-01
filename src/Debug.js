import { Pane } from 'tweakpane'
import { Color, Vector4 } from 'three'
import { gsap } from 'gsap'

export class Debug {
  constructor(app) {
    this.app = app

    this.#createPanel()
    this.#createSceneConfig()
    this.#createControlsConfig()
    this.#createShieldConfig()
    this.#createHitPointConfig()
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
      window.dispatchEvent(new CustomEvent('togglePhysicsDebug'))
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

    this.#createColorUniformControl(mesh, folder, 'u_FresnelColor', 'Fresnel color')
  }

  #createHitPointConfig() {
    const folder = this.pane.addFolder({ title: 'Hit Point' })
    const mesh = this.app.scene.getObjectByName('Shield')

    folder.addInput(mesh.material.uniforms.u_HitPointSize, 'value', { label: 'Hit point size', min: 0, max: 3, step: 0.01 })
    folder.addInput(mesh.material.uniforms.u_HitPointThickness, 'value', { label: 'Hit point thickness', min: 0, max: 1, step: 0.01 })

    folder.addSeparator()

    this.#createColorUniformAlphaControl(mesh, folder, 'u_HitPointColorA', 'Color A')
    this.#createColorUniformAlphaControl(mesh, folder, 'u_HitPointColorB', 'Color B')
  }

  /**
   * Adds a color control for the given object to the given folder.
   *
   * @param {*} obj Any THREE object with a color property
   * @param {*} folder The folder to add the control to
   * @param {*} label The label of the control
   */
  #createColorControl(obj, folder, label = 'Color') {
    const baseColor255 = obj.color.clone().multiplyScalar(255)
    const params = { color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b } }

    folder.addInput(params, 'color', { label }).on('change', e => {
      obj.color.setRGB(e.value.r, e.value.g, e.value.b).multiplyScalar(1 / 255)
    })
  }

  /**
   * Adds a color control for a custom uniform to the given object in the given folder.
   *
   * @param {THREE.Mesh} obj A `THREE.Mesh` object
   * @param {*} folder The folder to add the control to
   * @param {String} uniformName The name of the uniform to control
   * @param {String} label The label to use for the control
   */
  #createColorUniformControl(obj, folder, uniformName, label = 'Color') {
    const baseColor255 = obj.material.uniforms[uniformName].value.clone().multiplyScalar(255)
    const { r, g, b } = baseColor255
    const params = { color: { r, g, b } }

    folder.addInput(params, 'color', { label, view: 'color' }).on('change', ({ value }) => {
      obj.material.uniforms[uniformName].value.setRGB(value.r, value.g, value.b).multiplyScalar(1 / 255)
    })
  }

  /**
   * Adds a color control for a custom uniform to the given object in the given folder.
   *
   * @param {THREE.Mesh} obj A `THREE.Mesh` object
   * @param {*} folder The folder to add the control to
   * @param {String} uniformName The name of the uniform to control
   * @param {String} label The label to use for the control
   */
  #createColorUniformAlphaControl(obj, folder, uniformName, label = 'Color') {
    const preMultVector = new Vector4(255, 255, 255, 1)
    const postMultVector = new Vector4(1 / 255, 1 / 255, 1 / 255, 1)

    const baseColor255 = obj.material.uniforms[uniformName].value.clone().multiply(preMultVector)
    const params = { color: { r: baseColor255.x, g: baseColor255.y, b: baseColor255.z, a: baseColor255.w } }

    folder.addInput(params, 'color', { label, view: 'color', color: { alpha: true } }).on('change', e => {
      obj.material.uniforms[uniformName].value.set(e.value.r, e.value.g, e.value.b, e.value.a).multiply(postMultVector)
    })
  }
}
