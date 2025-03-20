// Quản lý cây, biển báo, núi, bầu trời, thành phố.
import * as THREE from 'three';

const Environment = ({ scene }) => {
  const textureLoader = new THREE.TextureLoader();

  // Trees
  const treeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
  let treeTexture;
  try {
    treeTexture = textureLoader.load(
      '/textures/tree.png',
      () => console.log("Sky texture loaded successfully"),
      undefined,
      (error) => console.error("Error loading sky texture:", error)
    );
  } catch (error) {
    console.error("Failed to load sky texture:", error);
  }
  const treeMaterial = new THREE.MeshBasicMaterial({map: treeTexture, color: 0x228B22 });
  const trees = [];
  for (let i = 0; i < 100; i++) {
    const treeLeft = new THREE.Mesh(treeGeometry, treeMaterial);
    treeLeft.position.set(-12, 2.5, -i * 40);
    scene.add(treeLeft);
    trees.push(treeLeft);

    const treeRight = new THREE.Mesh(treeGeometry, treeMaterial);
    treeRight.position.set(12, 2.5, -i * 40);
    scene.add(treeRight);
    trees.push(treeRight);
    console.log(`Tree ${i} size:`, { width: 1, height: 5, depth: 1 });
  }

  // Signs
  const signGeometry = new THREE.BoxGeometry(1, 2, 0.1);
  const signMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
  const signs = [];
  for (let i = 0; i < 20; i++) {
    const signLeft = new THREE.Mesh(signGeometry, signMaterial);
    signLeft.position.set(-10, 1, -i * 200);
    scene.add(signLeft);
    signs.push(signLeft);

    const signRight = new THREE.Mesh(signGeometry, signMaterial);
    signRight.position.set(10, 1, -i * 200);
    scene.add(signRight);
    signs.push(signRight);
    console.log(`Sign ${i} size:`, { width: 1, height: 2, depth: 0.1 });
  }

  // Mountain
  const mountainGeometry = new THREE.ConeGeometry(50, 100, 32);
  const mountainMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
  const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
  mountain.position.set(0, 50, -4000);
  scene.add(mountain);
  console.log("Mountain size:", { width: 100, height: 100, depth: 100 });

  // Sky
  const skyGeometry = new THREE.PlaneGeometry(500, 200);
  let skyTexture;
  try {
    skyTexture = textureLoader.load(
      '/textures/sky.jpg',
      () => console.log("Sky texture loaded successfully"),
      undefined,
      (error) => console.error("Error loading sky texture:", error)
    );
  } catch (error) {
    console.error("Failed to load sky texture:", error);
  }
  const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.DoubleSide });
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  sky.position.set(0, 100, -4000);
  scene.add(sky);
  console.log("Sky size:", { width: 500, height: 200, depth: 0 });

  // City
  const cityGeometry = new THREE.PlaneGeometry(80, 40);
  let cityTexture;
  try {
    cityTexture = textureLoader.load(
      '/textures/cityscape.jpg',
      () => console.log("City texture loaded successfully"),
      undefined,
      (error) => console.error("Error loading city texture:", error)
    );
  } catch (error) {
    console.error("Failed to load city texture:", error);
  }
  const cityMaterial = new THREE.MeshBasicMaterial({ map: cityTexture, transparent: true, side: THREE.DoubleSide });
  const cityPlane = new THREE.Mesh(cityGeometry, cityMaterial);
  cityPlane.position.set(0, 50, -2000);
  scene.add(cityPlane);
  console.log("City plane position:", cityPlane.position);
  console.log("City plane size:", { width: cityGeometry.parameters.width, height: cityGeometry.parameters.height });

  return { trees, signs, cityPlane };
};

export default Environment;