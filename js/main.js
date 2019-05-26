import '../scss/main.scss'
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

window._scene = scene
window._camera = camera

scene.background = new THREE.Color(0xFFFFFF)

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
window.document.body.appendChild(renderer.domElement)

var geometry = new THREE.BoxGeometry(20, 20, 20)
var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
var cube = new THREE.Mesh(geometry, material)
var light = new THREE.DirectionalLight(0xFFFF00)
light.position.set(10, 0, 100)

scene.add(cube)
scene.add(light)
camera.position.z = 100

function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera)
}

animate()
