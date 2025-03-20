import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import SceneSetup from './SceneSetup';
import Road from './Road';
import Environment from './Environment';
import Car from './Car';
import Bots from './Bots';
import Obstacles from './Obstacles';
import GameLogic from './GameLogic';

const Game = () => {
  const mountRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speedKmH, setSpeedKmH] = useState(0);
  const [sceneSetup, setSceneSetup] = useState(null);
  const [carData, setCarData] = useState(null);
  const [botsData, setBotsData] = useState(null);
  const [environmentData, setEnvironmentData] = useState(null);
  const [obstacles, setObstacles] = useState(null);

  const engineSoundRef = useRef(null);
  const brakeSoundRef = useRef(null);

  const startGame = () => {
    console.log("Start button clicked");
    // Reset tất cả trạng thái
    setGameStarted(false);
    setGameOver(false);
    setSpeedKmH(0);
    setSceneSetup(null);
    setCarData(null);
    setBotsData(null);
    setEnvironmentData(null);
    setObstacles(null);
    // Sau đó khởi động lại game
    setTimeout(() => {
      setGameStarted(true);
    }, 0);
  };

  useEffect(() => {
    if (!mountRef.current || !gameStarted) return;

    console.log("Setting up audio and scene");

    const listener = new THREE.AudioListener();
    const audioLoader = new THREE.AudioLoader();

    brakeSoundRef.current = new THREE.Audio(listener);
    audioLoader.load(
      '/sounds/brake.mp3',
      (buffer) => {
        brakeSoundRef.current.setBuffer(buffer);
        brakeSoundRef.current.setLoop(false);
        brakeSoundRef.current.setVolume(0.5);
        console.log("Brake sound loaded successfully");
      },
      undefined,
      (error) => console.error("Error loading brake sound:", error)
    );

    engineSoundRef.current = new THREE.Audio(listener);
    audioLoader.load(
      '/sounds/engine.mp3',
      (buffer) => {
        engineSoundRef.current.setBuffer(buffer);
        engineSoundRef.current.setLoop(true);
        engineSoundRef.current.setVolume(0.1);
        console.log("Engine sound loaded successfully");
      },
      undefined,
      (error) => console.error("Error loading engine sound:", error)
    );

    const cleanupSceneSetup = SceneSetup({
      mount: mountRef.current,
      onSetup: (setup) => {
        console.log("Scene setup completed:", setup);
        setSceneSetup(setup);
        setup.camera.add(listener);
      },
    });

    return () => {
      console.log("Cleaning up scene setup");
      cleanupSceneSetup();
      if (brakeSoundRef.current) brakeSoundRef.current.stop();
      if (engineSoundRef.current) engineSoundRef.current.stop();
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!sceneSetup) return;

    console.log("Setting up game elements");
    Road({ scene: sceneSetup.scene });
    const { trees, signs, cityPlane } = Environment({ scene: sceneSetup.scene });
    const cleanupCar = Car({
      scene: sceneSetup.scene,
      onCarLoaded: (data) => {
        console.log("Car loaded:", data);
        setCarData(data);
      },
    });
    const botsData = Bots({ scene: sceneSetup.scene });
    console.log("Bots loaded:", botsData);
    setBotsData(botsData);
    const obstacles = Obstacles({ scene: sceneSetup.scene });
    console.log("Obstacles loaded:", obstacles);
    setObstacles(obstacles);
    setEnvironmentData({ trees, signs, cityPlane });

    return () => {
      console.log("Cleaning up car");
      cleanupCar();
    };
  }, [sceneSetup]);

  useEffect(() => {
    if (!sceneSetup || !carData || !botsData || !obstacles || !environmentData) {
      console.log("GameLogic dependencies not ready:", {
        sceneSetup: !!sceneSetup,
        carData: !!carData,
        botsData: !!botsData,
        obstacles: !!obstacles,
        environmentData: !!environmentData,
      });
      return;
    }

    console.log("Starting GameLogic");
    const cleanupGameLogic = GameLogic({
      car: carData.car,
      frontWheels: carData.frontWheels,
      rearWheels: carData.rearWheels,
      bots: botsData.bots,
      botSpeeds: botsData.botSpeeds,
      obstacles,
      trees: environmentData.trees,
      signs: environmentData.signs,
      cityPlane: environmentData.cityPlane,
      camera: sceneSetup.camera,
      pointLight: sceneSetup.pointLight,
      renderer: sceneSetup.renderer,
      scene: sceneSetup.scene,
      gameOver,
      setGameOver,
      setSpeedKmH,
      engineSoundRef,
      brakeSoundRef,
    });

    return () => {
      console.log("Cleaning up GameLogic");
      cleanupGameLogic();
    };
  }, [sceneSetup, carData, botsData, obstacles, environmentData, gameOver]);

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
      {!gameStarted && (
        <div>
          <h1>Racing Game</h1>
          <div
            onClick={startGame}
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              cursor: 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              display: 'inline-block',
            }}
          >
            Start
          </div>
        </div>
      )}
      {gameStarted && (
        <>
          <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
            Speed: {speedKmH} km/h
          </div>
          <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
          {gameOver && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'red',
                fontSize: '32px',
              }}
            >
              Game Over!{' '}
              <div
                onClick={startGame}
                style={{
                  padding: '10px 20px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  display: 'inline-block',
                }}
              >
                Restart
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;