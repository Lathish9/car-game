import React from 'react';

const Car = ({ playerX, playerY }) => {
  return (
    <img
      src="/car.png"
      alt="player car"
      style={{
        position: 'absolute',
        top: playerY,
        left: playerX,
        width: '50px',
        height: '50px',
        zIndex: 10,
      }}
    />
  );
};

export default Car;
