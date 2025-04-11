import React, { useEffect, useState } from 'react';
import Car from './Car';
import Obstacle from './Obstacle';

const GAME_WIDTH = 300;
const GAME_HEIGHT = 500;

export default function Game() {
  const [carPosition, setCarPosition] = useState(125);
  const [obstacle, setObstacle] = useState({ top: 0, left: 125 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);

  const playCrashSound = () => {
    const crashAudio = new Audio('/crash.mp3');
    crashAudio.play().catch(e => console.log('Audio play blocked:', e));
  };

  useEffect(() => {
    const markInteraction = () => {
      setUserInteracted(true);
    };

    window.addEventListener('keydown', markInteraction);
    window.addEventListener('mousedown', markInteraction);
    window.addEventListener('touchstart', markInteraction);

    return () => {
      window.removeEventListener('keydown', markInteraction);
      window.removeEventListener('mousedown', markInteraction);
      window.removeEventListener('touchstart', markInteraction);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft' && carPosition > 0) {
        setCarPosition(pos => pos - 25);
      } else if (e.key === 'ArrowRight' && carPosition < GAME_WIDTH - 50) {
        setCarPosition(pos => pos + 25);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carPosition, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setObstacle(obs => {
        const newTop = obs.top + 10;

        // Collision
        if (newTop > 400 && Math.abs(obs.left - carPosition) < 50) {
          if (userInteracted) playCrashSound();
          setGameOver(true);
          return obs;
        }

        if (newTop > GAME_HEIGHT) {
          setScore(s => s + 1);
          return {
            top: 0,
            left: Math.floor(Math.random() * (GAME_WIDTH - 50))
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

  const moveLeft = () => {
    if (carPosition > 0) setCarPosition(carPosition - 25);
  };

  const moveRight = () => {
    if (carPosition < GAME_WIDTH - 50) setCarPosition(carPosition + 25);
  };

  return (
    <div style={{ width: GAME_WIDTH, margin: 'auto', textAlign: 'center' }}>
      <h2>🚗 Score: {score}</h2>

      <div
        style={{
          position: 'relative',
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          backgroundColor: '#e0e0e0',
          border: '2px solid #444',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {!gameOver ? (
          <>
            <Car position={carPosition} />
            <Obstacle top={obstacle.top} left={obstacle.left} />
          </>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: '40%',
              width: '100%',
              color: 'red',
              fontSize: '24px'
            }}
          >
            <p>💥 Game Over!</p>
            <button
              onClick={restartGame}
              style={{
                padding: '10px 20px',
                fontSize: '18px',
                marginTop: '10px',
                cursor: 'pointer'
              }}
            >
              Restart
            </button>
          </div>
        )}
      </div>

      {/* Mobile Buttons */}
      {!gameOver && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px'
          }}
        >
          <button onTouchStart={moveLeft} onClick={moveLeft} style={buttonStyle}>⬅️ Left</button>
          <button onTouchStart={moveRight} onClick={moveRight} style={buttonStyle}>Right ➡️</button>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '15px 25px',
  fontSize: '18px',
  backgroundColor: '#333',
  color: 'white',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer'
};
