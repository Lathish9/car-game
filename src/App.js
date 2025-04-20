import React, { useEffect, useState } from 'react';

const obstacleImages = [
  '/rock.png',
  '/cone.png',
  '/barrier.png',
  '/oil.png',
  '/obstacle.png' // New obstacle car added
];

const carWidth = 50;
const carHeight = 50;

export default function App() {
  const [playerX, setPlayerX] = useState(150);
  const playerY = 500;
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const crashSound = new Audio('/assets/crash.mp3');
  const gameOverSound = new Audio('/assets/gameover.mp3');

  // Move Car - Keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mobile Touch Controls
  const moveLeft = () => {
    setPlayerX((prev) => Math.max(prev - 20, 0));
  };

  const moveRight = () => {
    setPlayerX((prev) => Math.min(prev + 20, 350));
  };

  // Spawn Obstacles
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const newObstacle = {
        id: Date.now(),
        x: Math.floor(Math.random() * 350),
        y: -60,
        image: obstacleImages[Math.floor(Math.random() * obstacleImages.length)]
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
          playerX < ob.x + carWidth &&
          playerX + carWidth > ob.x &&
          playerY < ob.y + carHeight &&
          playerY + carHeight > ob.y
        ) {
          crashSound.play();
          setGameOver(true);
          setTimeout(() => gameOverSound.play(), 500);
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
      <img
        src="/assets/car.png"
        alt="car"
        style={{
          position: 'absolute',
          top: playerY,
          left: playerX,
          width: `${carWidth}px`,
          height: `${carHeight}px`,
          zIndex: 10
        }}
      />

      {/* Obstacles */}
      {obstacles.map((ob) => (
        <img
          key={ob.id}
          src={ob.image}
          alt="obstacle"
          style={{
            position: 'absolute',
            top: ob.y,
            left: ob.x,
            width: '50px',
            height: '50px',
            zIndex: 5
          }}
        />
      ))}

      {/* Score */}
      <div style={styles.score}>Score: {score}</div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div style={styles.gameOverOverlay}>
          <div style={styles.gameOverText}>GAME OVER</div>
          <button onClick={handleRestart} style={styles.restartButton}>Restart</button>
        </div>
      )}

      {/* Mobile Controls */}
      <div style={styles.mobileControls}>
        <button onClick={moveLeft} style={styles.controlButton}>⬅️</button>
        <button onClick={moveRight} style={styles.controlButton}>➡️</button>
      </div>
    </div>
  );
}

const styles = {
  gameContainer: {
    position: 'relative',
    width: '400px',
    height: '600px',
    margin: 'auto',
    backgroundColor: '#111',
    overflow: 'hidden',
    border: '5px solid #00ff99',
    borderRadius: '10px'
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
    zIndex: 20
  },
  gameOverText: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  restartButton: {
    fontSize: '18px',
    padding: '10px 20px',
    backgroundColor: '#00ff99',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  score: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    zIndex: 15
  },
  mobileControls: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '20px',
    zIndex: 15
  },
  controlButton: {
    fontSize: '24px',
    padding: '10px 20px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer'
  }
};
