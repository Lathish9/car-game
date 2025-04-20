import React, { useEffect, useState } from 'react';

const obstacleImages = [
  '/rock.png',
  '/cone.png',
  '/barrier.png',
  '/oil.png'
];

export default function App() {
  const [playerX, setPlayerX] = useState(150);
  const playerY = 500; // Fixed Y position
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Move player left/right with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setPlayerX(prev => Math.max(prev - 20, 0));
      } else if (e.key === 'ArrowRight') {
        setPlayerX(prev => Math.min(prev + 20, 350)); // limit within 400px width
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Spawn obstacles
  useEffect(() => {
    const interval = setInterval(() => {
      const newObstacle = {
        id: Date.now(),
        x: Math.floor(Math.random() * 350),
        y: -60,
        image: obstacleImages[Math.floor(Math.random() * obstacleImages.length)]
      };
      setObstacles(prev => [...prev, newObstacle]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Move obstacles down
  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles(prev =>
        prev
          .map(ob => ({ ...ob, y: ob.y + 5 }))
          .filter(ob => ob.y < 600)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Collision Detection
  useEffect(() => {
    const interval = setInterval(() => {
      obstacles.forEach(ob => {
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
  }, [obstacles, playerX]);

  return (
    <div
      style={{
        position: 'relative',
        width: '400px',
        height: '600px',
        margin: 'auto',
        backgroundColor: '#111',
        overflow: 'hidden',
        border: '5px solid #00ff99',
        borderRadius: '10px'
      }}
    >
      {/* Player Car */}
      <div
        style={{
          position: 'absolute',
          top: `${playerY}px`,
          left: `${playerX}px`,
          width: '50px',
          height: '50px',
          backgroundColor: 'blue',
          borderRadius: '5px',
          zIndex: 10
        }}
      />

      {/* Obstacles */}
      {obstacles.map(ob => (
        <img
          key={ob.id}
          src={ob.image}
          alt="obstacle"
          style={{
            position: 'absolute',
            top: `${ob.y}px`,
            left: `${ob.x}px`,
            width: '50px',
            height: '50px',
            zIndex: 5
          }}
        />
      ))}

      {/* Game Over Message */}
      {gameOver && (
        <div
          style={{
            position: 'absolute',
            top: '250px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '30px',
            fontWeight: 'bold',
            backgroundColor: 'red',
            padding: '10px 20px',
            borderRadius: '10px'
          }}
        >
          GAME OVER
        </div>
      )}
    </div>
  );
}
