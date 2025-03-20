// Quản lý các bot (xe AI).
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Bots = ({ scene }) => {
  const bots = [];
  const botSpeeds = [];
  const maxBots = 3;
  const gltfLoader = new GLTFLoader();
  for (let i = 0; i < maxBots; i++) {
    gltfLoader.load(
      '/models/scene.gltf',
      (gltf) => {
        const bot = gltf.scene;
        bot.scale.set(1.5, 1.5, 1.5);
        bot.position.set(
          (Math.random() - 0.5) * 16,
          1,
          -50 - i * 50
        );
        bot.rotation.y = Math.PI;
        scene.add(bot);
        bots.push(bot);
        botSpeeds.push(0.2 + Math.random() * 0.1);
        console.log(`Bot ${i} initial position:`, bot.position);
      },
      undefined,
      (error) => console.error("Error loading bot model:", error)
    );
  }

  return { bots, botSpeeds };
};

export default Bots;