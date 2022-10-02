import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Clock,
  Vector2,
  Plane,
  Mesh,
  PlaneGeometry,
  CylinderGeometry,
  Vector3,
  RepeatWrapping
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing"

import { gsap } from 'gsap'

import { gltfLoader, textureLoader } from './loaders'
import { hitPointsNum } from './const'

import { ShieldMaterial } from './materials/ShieldMaterial'
import { FloorMaterial } from './materials/FloorMaterial'
import { BulletMaterial } from './materials/BulletMaterial'

import { Simulation } from './physics/Simulation'
import { PhysicsShield } from './physics/Shield'
import { PhysicsBullet } from './physics/Bullet'

class App {
  #resizeCallback = () => this.#onResize()

  constructor(container) {
    this.container = document.querySelector(container)
    this.screen = new Vector2(this.container.clientWidth, this.container.clientHeight)

    this.currentHitPointIndex = 0

    this.bulletGeometry = new CylinderGeometry(0.02, 0.02, 0.4, 12, 1)
  }

  async init() {
    this.#createScene()
    this.#createCamera()
    this.#createRenderer()
    this.#createClock()
    this.#createSimulation()
    this.#createPlane()
    this.#createClippingPlane()

    await this.#loadTextures()
    await this.#createShield()

    this.#addListeners()
    this.#createControls()
    this.#createPostprocess()

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

  spawnBullet(position) {
    // Add bullet mesh to scene
    const bullet = new Mesh(this.bulletGeometry, BulletMaterial)

    bullet.position.copy(position)
    bullet.lookAt(this.shield.position)
    bullet.rotateX(Math.PI * 0.5)

    this.scene.add(bullet)

    // Add physics body to the physics world
    const body = new PhysicsBullet(bullet, this.scene)
    this.simulation.addItem(body)

    // Shoot the bullet towards the shield
    const dirVector = new Vector3()
    dirVector.subVectors(this.shield.position, bullet.position).normalize().multiplyScalar(10)
    body.physicsBody.velocity.set(dirVector.x, dirVector.y, dirVector.z)
  }

  #update() {
    const elapsed = this.clock.getElapsedTime()

    this.shield.material.uniforms.u_Time.value = elapsed;

    this.simulation.update()
  }

  #render() {
    this.composer.render()
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
      antialias: false,
      stencil: false,
      depth: false
    })

    this.container.appendChild(this.renderer.domElement)

    this.renderer.setSize(this.screen.x, this.screen.y)
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    this.renderer.setClearColor(0x121212)
    this.renderer.physicallyCorrectLights = false
    this.renderer.localClippingEnabled = true
  }

  #createPostprocess() {
    this.composer = new EffectComposer(this.renderer)

    this.composer.addPass(new RenderPass(this.scene, this.camera))

    this.bloomPass = new EffectPass(this.camera, new BloomEffect({ intensity: 3 }))
    this.composer.addPass(this.bloomPass)
  }

  #createControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)

    this.transformControls = new TransformControls(this.camera, this.renderer.domElement)

    this.transformControls.addEventListener('dragging-changed', event => {
      this.orbitControls.enabled = !event.value
    })

    this.transformControls.addEventListener('change', event => {
      this.shield.material.clippingPlanes[0].constant = -this.plane.position.y
    })

    this.scene.add(this.transformControls)
  }

  #createClock() {
    this.clock = new Clock()
  }

  #createClippingPlane() {
    this.clippingPlane = new Plane(new Vector3(0, 1, 0), -this.plane.position.y)
  }

  async #loadTextures() {
    const [noise] = await textureLoader.load(['/perlin-noise.png'])

    noise.wrapS = noise.wrapT = RepeatWrapping

    this.textures = {
      noise
    }
  }

  async #createShield() {
    const gltf = await gltfLoader.load('/shield.glb')

    this.shield = gltf.scene.getObjectByName('Shield')

    this.shield.material = ShieldMaterial
    this.shield.material.uniforms.t_Noise.value = this.textures.noise
    this.shield.material.clippingPlanes = [this.clippingPlane]
    this.shield.position.y = 0.35

    this.scene.add(this.shield)

    const body = new PhysicsShield(this.shield, this.scene)
    this.simulation.addItem(body)
  }

  #createPlane() {
    const geometry = new PlaneGeometry(50, 50, 1, 1)
    geometry.rotateX(-Math.PI * 0.5)

    this.plane = new Mesh(geometry, FloorMaterial)
    this.plane.position.y -= 0.2
    this.plane.name = 'Plane'

    this.scene.add(this.plane)
  }

  #createSimulation() {
    this.simulation = new Simulation(this.scene)
  }

  #addListeners() {
    window.addEventListener('resize', this.#resizeCallback, { passive: true })

    window.addEventListener('collide', e => {
      this.shield.material.uniforms.u_HitPoints.value[this.currentHitPointIndex] = {
        position: e.detail.hitPoint,
        size: 0,
        thickness: 0
      }

      const hitPoint = this.shield.material.uniforms.u_HitPoints.value[this.currentHitPointIndex]

      const tl = new gsap.timeline()

      tl
        .addLabel('start')
        .to(hitPoint, { thickness: 0.45, duration: 0.4 }, 'start')
        .to(hitPoint, { size: 1, duration: 1 }, 'start')
        .to(hitPoint, { thickness: 0, duration: 0.5 }, 'start+=0.4')

      const item = this.simulation.items.find(item => item.physicsBody === e.detail.body)
      this.scene.remove(item.mesh)
      this.simulation.removeItem(item)

      this.currentHitPointIndex = gsap.utils.wrap(0, hitPointsNum, this.currentHitPointIndex + 1)
    })
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
