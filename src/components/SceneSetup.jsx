// Quản lý scene, camera, renderer, ánh sáng.
import * as THREE from 'three';

const SceneSetup = ({ mount, onSetup }) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  mount.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 2.5, 150);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  camera.position.set(0, 3, 5);

  const handleResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', handleResize);

  onSetup({ scene, camera, renderer, pointLight });

  return () => {
    window.removeEventListener('resize', handleResize);
    if (mount && renderer.domElement) {
      mount.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };
};

export default SceneSetup;