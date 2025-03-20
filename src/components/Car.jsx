// Quản lý xe và bánh xe.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Car = ({ scene, onCarLoaded }) => {
  let car;
  let frontWheels = [];
  let rearWheels = [];
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    '/models/scene.gltf',
    (gltf) => {
      car = gltf.scene;
      car.scale.set(1.5, 1.5, 1.5);
      car.position.y = 1;
      car.position.z = 0;
      car.rotation.y = Math.PI;
      scene.add(car);

      console.log("Model structure:");
      car.traverse((child) => {
        if (child.isMesh) {
          console.log(`- Mesh: ${child.name}`);
          const worldPos = new THREE.Vector3();
          child.getWorldPosition(worldPos);
          console.log(`Mesh ${child.name} world position:`, worldPos);
          const box = new THREE.Box3().setFromObject(child);
          const size = new THREE.Vector3();
          box.getSize(size);
          console.log(`Mesh ${child.name} size:`, size);
        }
      });

      car.traverse((child) => {
        if (child.isMesh) {
          if (child.name === 'Object_10' || child.name === 'Object_8') {
            frontWheels.push(child);
            console.log("Confirmed front wheel:", child.name);
            const worldPos = new THREE.Vector3();
            child.getWorldPosition(worldPos);
            console.log(`Front wheel ${child.name} world position:`, worldPos);
          }
          if (child.name === 'Object_12' || child.name === 'Object_14') {
            rearWheels.push(child);
            console.log("Confirmed rear wheel:", child.name);
            const worldPos = new THREE.Vector3();
            child.getWorldPosition(worldPos);
            console.log(`Rear wheel ${child.name} world position:`, worldPos);
          }
        }
      });

      const box = new THREE.Box3().setFromObject(car);
      const size = new THREE.Vector3();
      box.getSize(size);
      console.log("Car size:", size);

      onCarLoaded({ car, frontWheels, rearWheels });
    },
    undefined,
    (error) => console.error("Error loading car model:", error)
  );

  return () => {};
};

export default Car;