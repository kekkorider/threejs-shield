import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Clock,
  Vector2,
  SphereGeometry,
  Mesh,
  PlaneGeometry
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

import { ShieldMaterial } from './materials/ShieldMaterial'
import { FloorMaterial } from './materials/FloorMaterial'

class App {
  #resizeCallback = () => this.#onResize()

  constructor(container) {
    this.container = document.querySelector(container)
    this.screen = new Vector2(this.container.clientWidth, this.container.clientHeight)
  }

  async init() {
    this.#createScene()
    this.#createCamera()
    this.#createRenderer()
    this.#createClock()
    this.#createPlane()
    this.#createShield()
    this.#addListeners()
    this.#createControls()

    if (window.location.hash.includes('#debug')) {
      const panel = await import('./Debug.js')
      new panel.Debug(this)
    }

    this.renderer.setAnimationLoop(() => {
      this.#update()
      this.#render()
    })

    console.log(this)
  }

  destroy() {
    this.renderer.dispose()
    this.#removeListeners()
  }

  #update() {
    const elapsed = this.clock.getElapsedTime()
  }

  #render() {
    this.renderer.render(this.scene, this.camera)
  }

  #createScene() {
    this.scene = new Scene()
  }

  #createCamera() {
    this.camera = new PerspectiveCamera(75, this.screen.x / this.screen.y, 0.1, 100)
    this.camera.position.set(-0.7, 0.8, 3)
  }

  #createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio === 1
    })

    this.container.appendChild(this.renderer.domElement)

    this.renderer.setSize(this.screen.x, this.screen.y)
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    this.renderer.setClearColor(0x121212)
    this.renderer.physicallyCorrectLights = true
  }

  #createControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)

    this.transformControls = new TransformControls(this.camera, this.renderer.domElement)
    this.transformControls.addEventListener('dragging-changed', event => {
      this.orbitControls.enabled = !event.value
    })
    this.scene.add(this.transformControls)
  }

  #createClock() {
    this.clock = new Clock()
  }

  #createShield() {
    const geometry = new SphereGeometry(1, 32, 32)

    this.shield = new Mesh(geometry, ShieldMaterial)
    this.shield.name = 'Shield'
    this.shield.position.y = 0.35

    this.scene.add(this.shield)
  }

  #createPlane() {
    const geometry = new PlaneGeometry(20, 20, 10, 10)
    geometry.rotateX(-Math.PI * 0.5)

    this.plane = new Mesh(geometry, FloorMaterial)
    this.plane.name = 'Plane'

    this.scene.add(this.plane)
  }

  #addListeners() {
    window.addEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #removeListeners() {
    window.removeEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #onResize() {
    this.screen.set(this.container.clientWidth, this.container.clientHeight)

    this.camera.aspect = this.screen.x / this.screen.y
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.screen.x, this.screen.y)
  }
}

const app = new App('#app')
app.init()
