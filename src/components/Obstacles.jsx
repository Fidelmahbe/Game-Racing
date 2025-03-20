// Quản lý chướng ngại vật.
import * as THREE from 'three';

const Obstacles = ({ scene }) => {
  const obstacles = [];
  const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
  const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  for (let i = 0; i < 5; i++) {
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(
      (Math.random() - 0.5) * 16,
      1,
      -200 - i * 100 // Đặt xa hơn, từ -200 thay vì -100
    );
    scene.add(obstacle);
    obstacles.push(obstacle);
    console.log(`Obstacle ${i} size:`, { width: 2, height: 2, depth: 2 });
  }

  return obstacles;
};

export default Obstacles;