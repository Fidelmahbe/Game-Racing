import * as THREE from 'three';

const Road = ({ scene }) => {
  const textureLoader = new THREE.TextureLoader();
  const roadGeometry = new THREE.PlaneGeometry(20, 4000);
  const roadTexture = textureLoader.load(
    '/textures/road.png',
    () => console.log("Road texture loaded successfully"),
    undefined,
    (error) => console.error("Error loading road texture:", error)
  );
  roadTexture.wrapS = THREE.RepeatWrapping;
  roadTexture.wrapT = THREE.RepeatWrapping;
  roadTexture.repeat.set(1, 40);
  const roadMaterial = new THREE.MeshBasicMaterial({ map: roadTexture });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.rotation.x = -Math.PI / 2;
  road.position.z = -2000;
  scene.add(road);
  console.log("Road size:", { width: roadGeometry.parameters.width, height: roadGeometry.parameters.height });
  console.log("Road material:", roadMaterial);

  return road;
};

export default Road;