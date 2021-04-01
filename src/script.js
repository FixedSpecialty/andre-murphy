import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


/**
 * Base
 */
const delay = 6000
 const manager = new THREE.LoadingManager()
    manager.onStart = () =>
    {
       // console.log("loading started")
        document.getElementById('wrapper').style.display = "block"
    }
    manager.onProgress = () =>
    {
       // console.log("working")
        document.getElementById('wrapper').style.display = "block"
    }
    manager.onLoad = () =>
    {
       // console.log("loading finished")
        setTimeout(() =>
        {
            delay
        })
        document.getElementById('wrapper').style.display = "none"
    }

/**
 * Materials
 */
// const deskMat = new THREE.MeshStandardMaterial({
//     color: '#444444',
//     metalness: 0,
//     roughness: 0.5
// })

// const floorMat = new THREE.MeshStandardMaterial({
//     color: '#422',
//     metalness: 0,
//     roughness: 0.5
// })

// const windowMat = new THREE.MeshStandardMaterial({
//     color: '#433',
//     metalness: 0,
//     roughness: 0.5
// })


/**
 * Models
 */
const gltfLoader = new GLTFLoader(manager)
let mixer = null
gltfLoader.load(
    '/models/combined/scene.gltf',
    (gltf) => {
        const office = gltf.scene
        scene.add(office)

        const mixer = new THREE.AnimationMixer(office)

        const action = mixer.clipAction(gltf.animations[0])
        action.play()
    }
)


// Debug
const gui = new dat.GUI()
gui.destroy()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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

window.addEventListener('resize', () => {
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

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    if (mixer) {
        mixer.update(clock.getDelta())
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

function onTransitionEnd(event) {

    event.target.remove();

}
tick()
