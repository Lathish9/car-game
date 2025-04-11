import React from 'react';

export default function Car({ position }) {
  return (
    <img
      src="/car.png"
      alt="Car"
      style={{
        position: 'absolute',
        bottom: '20px',
        left: `${position}px`,
        width: '50px',
        height: '100px',
        transition: 'left 0.1s'
      }}
    />
  );
}
