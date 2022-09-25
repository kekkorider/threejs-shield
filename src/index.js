import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Clock,
  Vector2,
  SphereGeometry,
  Mesh,
  PlaneGeometry,
  CylinderGeometry,
  MeshBasicMaterial,
  Raycaster,
  Vector3
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

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

    this.bulletGeometry = new CylinderGeometry(0.03, 0.03, 0.3, 12, 1)
  }

  async init() {
    this.#createScene()
    this.#createCamera()
    this.#createRenderer()
    this.#createClock()
    this.#createSimulation()
    this.#createPlane()
    this.#createShield()
    this.#createLaser()
    this.#createRay()
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

  spawnBullet() {
    // Add bullet mesh to scene
    const bullet = new Mesh(this.bulletGeometry, BulletMaterial)

    bullet.position.copy(this.laser.position)
    bullet.lookAt(this.shield.position)
    bullet.rotateX(Math.PI * 0.5)

    this.scene.add(bullet)

    // Add physics body to the physics world
    const body = new PhysicsBullet(bullet, this.scene)
    this.simulation.addItem(body)

    // Shoot the bullet towards the shield
    const dirVector = new Vector3()
    dirVector.subVectors(this.shield.position, bullet.position).normalize().multiplyScalar(4)
    body.physicsBody.velocity.set(dirVector.x, dirVector.y, dirVector.z)
  }

  #update() {
    const elapsed = this.clock.getElapsedTime()

    this.#updateRay()
    this.simulation.update()
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
    this.renderer.physicallyCorrectLights = false
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
    const geometry = new SphereGeometry()

    this.shield = new Mesh(geometry, ShieldMaterial)
    this.shield.name = 'Shield'
    this.shield.position.y = 0.35

    this.scene.add(this.shield)

    const body = new PhysicsShield(this.shield, this.scene)
    this.simulation.addItem(body)
  }

  #createPlane() {
    const geometry = new PlaneGeometry(20, 20, 1, 1)
    geometry.rotateX(-Math.PI * 0.5)

    this.plane = new Mesh(geometry, FloorMaterial)
    this.plane.name = 'Plane'

    this.scene.add(this.plane)
  }

  #createRay() {
    this.ray = new Raycaster(this.laser.position, new Vector3())
  }

  #updateRay() {
    const shieldPos = this.shield.position.clone()
    const laserPos = this.laser.position.clone()

    this.ray.set(this.laser.position, shieldPos.sub(laserPos).normalize())
    this.laser.lookAt(this.shield.position)

    const intersects = this.ray.intersectObject(this.shield)

    if (intersects.length > 0)
      this.shield.material.uniforms.u_HitPoint.value = intersects[0].point
  }

  #createLaser() {
    const geometry = new CylinderGeometry(0.015, 0.015, 1, 12, 1)
    geometry.rotateX(-Math.PI * 0.5)
    geometry.translate(0, 0, 0.5)

    const material = new MeshBasicMaterial({ color: 0xff0000 })

    this.laser = new Mesh(geometry, material)
    this.laser.name = 'Laser'
    this.laser.position.set(4, 0.3, 2)
    this.laser.scale.z = 8

    this.scene.add(this.laser)
  }

  #createSimulation() {
    this.simulation = new Simulation(this.scene)
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
