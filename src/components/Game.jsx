import React, { useEffect, useState } from 'react';
import Car from './Car';
import Obstacle from './Obstacle';
import '../App.css';

const GAME_WIDTH = 300;
const GAME_HEIGHT = 500;

export default function Game() {
  const [carPosition, setCarPosition] = useState(125);
  const [obstacle, setObstacle] = useState({ top: 0, left: 125 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const playCrashSound = () => {
    const crashAudio = new Audio(`${process.env.PUBLIC_URL}/crash.mp3`);
    crashAudio.play().catch(() => {});
  };

  useEffect(() => {
    const handleInteraction = () => setUserInteracted(true);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

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

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setObstacle((obs) => {
        const newTop = obs.top + 10;

        if (newTop > 400 && Math.abs(obs.left - carPosition) < 50) {
          if (userInteracted) playCrashSound();
          setGameOver(true);
          return obs;
        }

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

  return (
    <div className="game-container">
      <h1>🕹️ React Car Game</h1>
      <h2>🚗 Score: {score}</h2>
      <div className="game-box">
        {!gameOver ? (
          <>
            <Car position={carPosition} />
            <Obstacle top={obstacle.top} left={obstacle.left} />
          </>
        ) : (
          <div className="game-over">
            <p>💥 Game Over!</p>
            <button onClick={restartGame} className="btn">Restart</button>
          </div>
        )}
      </div>
      {!gameOver && (
        <div className="controls">
          <button onClick={() => setCarPosition((p) => Math.max(0, p - 25))} className="btn">⬅️ Left</button>
          <button onClick={() => setCarPosition((p) => Math.min(GAME_WIDTH - 50, p + 25))} className="btn">Right ➡️</button>
        </div>
      )}
    </div>
  );
}
