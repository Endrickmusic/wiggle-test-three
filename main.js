import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { WiggleBone } from "./wiggle.js/index.js"

import "./style.css"
// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader()

loader.load("./models/stick.glb", ({ scene: modelScene }) => {
  console.log(modelScene)
  const mesh = modelScene.getObjectByName("Stick")
  let rootBone
  const wiggleBones = []

  mesh.skeleton.bones.forEach((bone) => {
    if (!bone.parent.isBone) {
      rootBone = bone;
    } else {
      const wiggleBone = new WiggleBone(bone, {
        velocity: 0.5,
      });
      wiggleBones.push(wiggleBone);
    }
  })

  console.log(rootBone)
  console.log(wiggleBones)

  // Add the model scene to the main scene
  scene.add(modelScene)

  scene.add(mesh.skeleton.bones[1])

  // Create a directional light
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(1, 1, 1)

  // Add the light to the scene
  scene.add(light);

  const tick = (ms) => {
    rootBone.position.x = Math.sin(ms/500)
    wiggleBones.forEach((wiggleBone) => {
      wiggleBone.update()
    })

    // Update controls and render the scene
    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }

  tick()
})