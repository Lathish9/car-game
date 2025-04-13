import React from 'react';

export default function Car({ position }) {
  return (
    <img
      src={process.env.PUBLIC_URL + '/car.png'}
      alt="Car"
      style={{
        position: 'absolute',
        bottom: '20px',
        left: position,
        width: '50px',
        height: '100px',
      }}
    />
  );
}
