import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */

/**
 * Materials
 */
const deskMat = new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5
})

const floorMat = new THREE.MeshStandardMaterial({
    color: '#422',
    metalness: 0,
    roughness: 0.5
})

const windowMat = new THREE.MeshStandardMaterial({
    color: '#433',
    metalness: 0,
    roughness: 0.5
})


/**
 * Models
 */
 const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/models/OldPC/scene.gltf',
    (gltf) =>
    {
        const pcmodel = gltf.scene
        pcmodel.scale = .5
        scene.add(pcmodel)

    }
)
let mixer = null
gltfLoader.load(
    '/models/combined/scene.gltf',
    (gltf) =>
    {
        const office = gltf.scene
        scene.add(office)

        const mixer = new THREE.AnimationMixer(office)

        const action = mixer.clipAction(gltf.animations[0])
        action.play()
    }
)


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Desktop
 */
const desktop = new THREE.Mesh(
    new THREE.BoxGeometry(5, 10,0.3),
    deskMat
)
desktop.receiveShadow = true
desktop.rotation.x = - Math.PI * 0.5
desktop.position.y = -.1
desktop.position.x = 0.5

/**
 * Desk Legs
 */
 const flLeg = new THREE.Mesh(
    new THREE.BoxGeometry(.3, 3,0.3),
    deskMat
)
flLeg.position.set(2.85,-1.75,4.85)

const frLeg = new THREE.Mesh(
    new THREE.BoxGeometry(.3, 3,0.3),
    deskMat
)
frLeg.position.x = 2.85
frLeg.position.set(2.85,-1.75,-4.85)

const blLeg = new THREE.Mesh(
    new THREE.BoxGeometry(.3, 3,0.3),
    deskMat
)
blLeg.position.x = 2.85
blLeg.position.set(-1.85,-1.75,4.85)

const brLeg = new THREE.Mesh(
    new THREE.BoxGeometry(.3, 3,0.3),
    deskMat
)
brLeg.position.x = 2.85
brLeg.position.set(-1.85,-1.75,-4.85)



/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8,45),
    floorMat
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = -3
floor.position.x = 2

/**
 * Walls
 */
 const backwallB = new THREE.Mesh(
    new THREE.PlaneGeometry(45,4),
    floorMat
)
backwallB.rotation.y =  Math.PI * 0.5
backwallB.position.y = -1
backwallB.position.x = -2

const backwallT = new THREE.Mesh(
    new THREE.PlaneGeometry(45,4),
    floorMat
)
backwallT.rotation.y =  Math.PI * 0.5
backwallT.position.y = 6.5
backwallT.position.x = -2

const backwallL = new THREE.Mesh(
    new THREE.PlaneGeometry(24,3.5),
    floorMat
)
backwallL.rotation.y =  Math.PI * 0.5
backwallL.position.y = 2.75
backwallL.position.x = -2
backwallL.position.z = 11

const backwallR = new THREE.Mesh(
    new THREE.PlaneGeometry(24,3.5),
    floorMat
)
backwallR.rotation.y =  Math.PI * 0.5
backwallR.position.y = 2.75
backwallR.position.x = -2
backwallR.position.z = -17
/**
 * Window
 */

 //scene.add(desktop, frLeg, flLeg, blLeg, brLeg,floor, backwallB, backwallT, backwallL, backwallR)
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2.5, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    console.log(mixer)
    if(mixer)
    {
        mixer.update(clock.getDelta())
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()