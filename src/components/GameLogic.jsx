import * as THREE from 'three';

const GameLogic = ({
  car,
  frontWheels,
  rearWheels,
  bots,
  botSpeeds,
  obstacles,
  trees,
  signs,
  cityPlane,
  camera,
  pointLight,
  renderer,
  scene,
  gameOver,
  setGameOver,
  setSpeedKmH,
  engineSoundRef,
  brakeSoundRef,
}) => {
  let moveLeft = false;
  let moveRight = false;
  let accelerating = false;
  let braking = false;

  const handleKeyDown = (event) => {
    if (gameOver) return;
    switch (event.key) {
      case 'ArrowLeft':
        moveLeft = true;
        break;
      case 'ArrowRight':
        moveRight = true;
        break;
      case ' ':
        accelerating = true;
        break;
      case 'ArrowDown':
        if (!braking && brakeSoundRef.current) {
          braking = true;
          brakeSoundRef.current.play();
        }
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        moveLeft = false;
        break;
      case 'ArrowRight':
        moveRight = false;
        break;
      case ' ':
        accelerating = false;
        break;
      case 'ArrowDown':
        braking = false;
        if (brakeSoundRef.current) brakeSoundRef.current.stop();
        break;
      default:
        break;
    }
  };

  let speed = 0;
  const maxSpeed = 4.0; // Tăng từ 2.5 lên 4.0
  const baseAcceleration = 0.015; // Tăng từ 0.025 lên 0.04
  const brakeDeceleration = 0.008;
  const lateralSpeed = 0.15;
  const roadWidth = 20;
  const carWidth = 3;

  let wheelRotation = 0;
  let currentSteerAngle = 0;
  let targetSteerAngle = 0;
  const maxSteerAngle = Math.PI / 8;
  const clock = new THREE.Clock();
  let animationId = null;

  const resetGame = () => {
    if (car) {
      car.position.set(0, 1, 0);
      car.rotation.set(0, Math.PI, 0);
    }
    bots.forEach((bot, index) => {
      bot.position.set(
        (Math.random() - 0.5) * 16,
        1,
        -50 - index * 50
      );
    });
    obstacles.forEach((obstacle, index) => {
      obstacle.position.set(
        (Math.random() - 0.5) * 16,
        1,
        -200 - index * 100
      );
    });
    speed = 0;
    wheelRotation = 0;
    currentSteerAngle = 0;
    targetSteerAngle = 0;
  };

  resetGame();

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    if (car && !gameOver) {
      if (accelerating) {
        // Tăng tốc phi tuyến tính: nhanh ở đầu, chậm lại khi gần maxSpeed
        const speedRatio = speed / maxSpeed;
        const dynamicAcceleration = baseAcceleration * (1 - speedRatio); // Giảm acceleration khi gần maxSpeed
        speed = Math.min(speed + dynamicAcceleration, maxSpeed);
      } else if (!braking) {
        speed = Math.max(speed - baseAcceleration * 0.5, 0);
      }

      if (braking) {
        speed = Math.max(speed - brakeDeceleration, 0);
        const skidOffset = Math.sin(clock.getElapsedTime() * 10) * 0.05;
        car.position.x += skidOffset * 0.1;
      }

      if (engineSoundRef.current) {
        const speedRatio = speed / maxSpeed;
        if (accelerating && !gameOver) {
          if (!engineSoundRef.current.isPlaying) {
            engineSoundRef.current.play();
            console.log("Engine sound started playing");
          }
          engineSoundRef.current.setVolume(0.2 + speedRatio * 0.5);
          engineSoundRef.current.setPlaybackRate(0.8 + speedRatio * 0.4);
        } else {
          if (engineSoundRef.current.isPlaying) {
            engineSoundRef.current.stop();
            console.log("Engine sound stopped");
          }
        }
      }

      if (gameOver && engineSoundRef.current && engineSoundRef.current.isPlaying) {
        engineSoundRef.current.stop();
        console.log("Engine sound stopped due to game over");
      }

      // Tăng tần suất rung khi tốc độ cao
      const vibration = accelerating ? Math.sin(clock.getElapsedTime() * (15 + speed * 5)) * (speed / maxSpeed) * 0.2 : 0;
      car.position.y = 1 + vibration;

      car.position.z -= speed;
      wheelRotation -= speed * 5;
      frontWheels.forEach((wheel) => {
        wheel.rotation.x = wheelRotation;
        console.log(`Front wheel ${wheel.name} rotation:`, wheel.rotation.x);
      });
      rearWheels.forEach((wheel) => {
        wheel.rotation.x = wheelRotation;
        console.log(`Rear wheel ${wheel.name} rotation:`, wheel.rotation.x);
      });

      if (moveLeft) {
        targetSteerAngle = maxSteerAngle;
      } else if (moveRight) {
        targetSteerAngle = -maxSteerAngle;
      } else {
        targetSteerAngle = 0;
      }
      currentSteerAngle = THREE.MathUtils.lerp(currentSteerAngle, targetSteerAngle, 0.05);

      frontWheels.forEach((wheel) => {
        wheel.rotation.y = currentSteerAngle;
        console.log(`Front wheel ${wheel.name} steer angle:`, wheel.rotation.y);
      });

      car.rotation.z = 0;
      car.rotation.y = Math.PI;

      if (moveLeft && car.position.x > -roadWidth / 2 + carWidth / 2) {
        car.position.x -= lateralSpeed;
      }
      if (moveRight && car.position.x < roadWidth / 2 - carWidth / 2) {
        car.position.x += lateralSpeed;
      }

      setSpeedKmH(Math.round((speed / maxSpeed) * 400));

      bots.forEach((bot, index) => {
        bot.position.z -= botSpeeds[index] * 3.0; // Tăng tốc độ bot để phù hợp với xe
        const distance = car.position.distanceTo(bot.position);
        console.log(`Distance to bot ${index}:`, distance);
        if (distance < 5) {
          setGameOver(true);
          console.log("Collision with bot detected - Distance:", distance);
          console.log("Car position:", car.position);
          console.log(`Bot ${index} position:`, bot.position);
        }
        if (bot.position.z < car.position.z - 100) {
          bot.position.z = car.position.z + 50 + index * 50;
          bot.position.x = (Math.random() - 0.5) * 16;
          botSpeeds[index] = 0.2 + Math.random() * 0.1;
          console.log(`Bot ${index} repositioned to:`, bot.position);
        }
      });

      obstacles.forEach((obstacle, index) => {
        const distance = car.position.distanceTo(obstacle.position);
        console.log("Distance to obstacle:", distance);
        if (distance < 3) {
          setGameOver(true);
          console.log("Collision detected - Distance:", distance);
          console.log("Car position:", car.position);
          console.log("Obstacle position:", obstacle.position);
        }
        obstacle.position.z += speed * 0.5; // Tăng tốc độ di chuyển của chướng ngại vật
        if (obstacle.position.z > car.position.z + 50) {
          obstacle.position.z = car.position.z - 400 - index * 100;
          obstacle.position.x = (Math.random() - 0.5) * 16;
          console.log(`Obstacle ${index} repositioned to:`, obstacle.position);
        }
      });

      trees.forEach((tree) => {
        tree.position.z += speed * 1.2; // Tăng tốc độ di chuyển của cây
        if (tree.position.z > car.position.z + 50) {
          tree.position.z = car.position.z - 4000;
        }
      });

      signs.forEach((sign) => {
        sign.position.z += speed * 1.2; // Tăng tốc độ di chuyển của biển báo
        if (sign.position.z > car.position.z + 50) {
          sign.position.z = car.position.z - 4000;
        }
      });

      if (car.position.z < -3900) {
        car.position.z = 0;
        obstacles.forEach((obstacle) => {
          obstacle.position.z = car.position.z - 200 - Math.random() * 100;
        });
        bots.forEach((bot, index) => {
          bot.position.z = car.position.z - 50 - index * 50;
        });
      }

      pointLight.position.set(car.position.x, car.position.y + 5, car.position.z);
      camera.position.set(car.position.x, car.position.y + 3, car.position.z + 5);
      camera.lookAt(car.position.x, car.position.y + 1, car.position.z - 2);
      console.log("Camera position:", camera.position);

      if (cityPlane) {
        cityPlane.position.set(camera.position.x, 50, camera.position.z - 100);
        const distanceToCity = camera.position.distanceTo(cityPlane.position);
        console.log("Distance to city plane:", distanceToCity);
        const screenPos = cityPlane.position.clone().project(camera);
        console.log("City plane screen position:", screenPos);
        console.log("City plane visible:", cityPlane.visible);
      }
    }

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    if (animationId) cancelAnimationFrame(animationId);
    if (engineSoundRef.current && engineSoundRef.current.isPlaying) {
      engineSoundRef.current.stop();
      console.log("Engine sound stopped during cleanup");
    }
    if (brakeSoundRef.current && brakeSoundRef.current.isPlaying) {
      brakeSoundRef.current.stop();
      console.log("Brake sound stopped during cleanup");
    }
  };
};

export default GameLogic;