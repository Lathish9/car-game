import React, { useEffect, useState } from 'react';
import Obstacle from './Obstacle'; // Import Obstacle component
import Car from './Car'; // Assuming you have a Car component for player car

const Game = () => {
  const [playerX, setPlayerX] = useState(150);
  const playerY = 500;
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Generate Random Obstacles including the Car Obstacle
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const newObstacle = {
        id: Date.now(),
        x: Math.floor(Math.random() * 350),
        y: -60,
        type: Math.floor(Math.random() * 5), // Random index for obstacle type
      };
      setObstacles((prev) => [...prev, newObstacle]);
    }, 1500);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Move Obstacles + Score
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setObstacles((prev) => {
        const updated = prev
          .map((o) => ({ ...o, y: o.y + 5 }))
          .filter((o) => o.y < 600);
        setScore((s) => s + 1); // score increases every frame
        return updated;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Collision Detection
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      obstacles.forEach((ob) => {
        if (
          playerX < ob.x + 50 &&
          playerX + 50 > ob.x &&
          playerY < ob.y + 50 &&
          playerY + 50 > ob.y
        ) {
          setGameOver(true);
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, [obstacles, playerX, gameOver]);

  const handleRestart = () => {
    setGameOver(false);
    setObstacles([]);
    setScore(0);
    setPlayerX(150);
  };

  return (
    <div style={styles.gameContainer}>
      {/* Player Car */}
      <Car playerX={playerX} playerY={playerY} />

      {/* Obstacles */}
      {obstacles.map((ob) => (
        <Obstacle key={ob.id} x={ob.x} y={ob.y} type={ob.type} />
      ))}

      {/* Score */}
      <div style={styles.score}>Score: {score}</div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div style={styles.gameOverOverlay}>
          <div style={styles.gameOverText}>GAME OVER</div>
          <button onClick={handleRestart} style={styles.restartButton}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  gameContainer: {
    position: 'relative',
    width: '400px',
    height: '600px',
    margin: 'auto',
    backgroundColor: '#111',
    overflow: 'hidden',
    border: '5px solid #00ff99',
    borderRadius: '10px',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  gameOverText: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  restartButton: {
    fontSize: '18px',
    padding: '10px 20px',
    backgroundColor: '#00ff99',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  score: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    zIndex: 15,
  },
};

export default Game;
