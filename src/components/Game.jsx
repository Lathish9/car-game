import React, { useEffect, useState } from 'react';
import Car from './Car';
import Obstacle from './Obstacle';
import Highway from './Highway';
import './Game.css';

const GAME_WIDTH = 300;
const GAME_HEIGHT = 500;

export default function Game() {
  const [carPosition, setCarPosition] = useState(125);
  const [obstacle, setObstacle] = useState({ top: 0, left: 125 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);

  const playCrashSound = () => {
    const crashAudio = new Audio(process.env.PUBLIC_URL + '/crash.mp3');
    crashAudio.play().catch((e) => console.log('Sound blocked:', e));
  };

  // Detect user interaction to allow audio
  useEffect(() => {
    const markInteraction = () => setUserInteracted(true);
    window.addEventListener('keydown', markInteraction);
    window.addEventListener('mousedown', markInteraction);
    window.addEventListener('touchstart', markInteraction);
    return () => {
      window.removeEventListener('keydown', markInteraction);
      window.removeEventListener('mousedown', markInteraction);
      window.removeEventListener('touchstart', markInteraction);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft' && carPosition > 0) {
        setCarPosition((pos) => pos - 25);
      } else if (e.key === 'ArrowRight' && carPosition < GAME_WIDTH - 50) {
        setCarPosition((pos) => pos + 25);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carPosition, gameOver]);

  // Obstacle logic
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setObstacle((obs) => {
        const newTop = obs.top + 10;

        // Collision
        if (newTop > 400 && Math.abs(obs.left - carPosition) < 50) {
          if (userInteracted) playCrashSound();
          setGameOver(true);
          return obs;
        }

        // Reset obstacle
        if (newTop > GAME_HEIGHT) {
          setScore((s) => s + 1);
          return {
            top: 0,
            left: Math.floor(Math.random() * (GAME_WIDTH - 50)),
          };
        }

        return { ...obs, top: newTop };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [carPosition, gameOver, userInteracted]);

  const restartGame = () => {
    setCarPosition(125);
    setObstacle({ top: 0, left: 125 });
    setScore(0);
    setGameOver(false);
  };

  // Mobile Controls
  const moveLeft = () => {
    if (carPosition > 0) setCarPosition((pos) => pos - 25);
  };

  const moveRight = () => {
    if (carPosition < GAME_WIDTH - 50) setCarPosition((pos) => pos + 25);
  };

  return (
    <div style={{ width: GAME_WIDTH, margin: 'auto', textAlign: 'center' }}>
      <h1>🚗 React Car Game</h1>
      <h2>🏁 Score: {score}</h2>

      <div className="game-container">
        <Highway />
        {!gameOver ? (
          <>
            <Car position={carPosition} />
            <Obstacle top={obstacle.top} left={obstacle.left} />
          </>
        ) : (
          <div className="game-over">
            <p>💥 Game Over!</p>
            <button onClick={restartGame} className="control-btn">Restart</button>
          </div>
        )}
      </div>

      {!gameOver && (
        <div className="mobile-controls">
          <button onClick={moveLeft} onTouchStart={moveLeft} className="control-btn">⬅️ Left</button>
          <button onClick={moveRight} onTouchStart={moveRight} className="control-btn">Right ➡️</button>
        </div>
      )}
    </div>
  );
}
