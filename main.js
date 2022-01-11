import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

/**
 * デバッグ(色つけるときに追加)
 */
// const gui = new dat.GUI();

/**
 * 必須の3要素
 */
// Canvas
const canvas = document.querySelector("#webgl");

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//ドーナツパーティクルジオメトリ
const donutsParticleGeometry = new THREE.TorusGeometry(2.8, 0.7, 16, 100);

//マテリアル
const donutParticleMaterial = new THREE.PointsMaterial({
  size: 0.023,
  color: "#40ff1a",
});

//メッシュ
const donutParticle = new THREE.Points(
  donutsParticleGeometry,
  donutParticleMaterial
);

//パーティクル
const count = 5000;
const particleGeometry = new THREE.BufferGeometry();
const positionArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 15;
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

//マテリアル
const particleMaterial = new THREE.PointsMaterial({
  size: 0.01,
});

//メッシュ
const particle = new THREE.Points(particleGeometry, particleMaterial);

scene.add(donutParticle, particle);

//debug
// gui.addColor(donutParticleMaterial, "color");

//カメラ制御
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

/**
 * アニメーション
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //カメラワーク
  camera.position.x = Math.cos(elapsedTime * 0.5) * 6;
  camera.position.z = Math.sin(elapsedTime * 0.5) * 6;

  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
