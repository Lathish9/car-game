import React, { useEffect, useState } from 'react';

const obstacleImages = [
  '/rock.png',
  '/cone.png',
  '/barrier.png',
  '/oil.png',
  '/obstacle.png' // Added obstacle car
];

const Obstacle = ({ x, y, type }) => {
  const [position, setPosition] = useState({ x, y });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        ...prev,
        y: prev.y + 5,
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={obstacleImages[type]}
      alt="obstacle"
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: '50px',
        height: '50px',
      }}
    />
  );
};

export default Obstacle;
