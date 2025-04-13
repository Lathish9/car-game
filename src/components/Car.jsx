import React from 'react';

export default function Car({ position }) {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/car.png`}
      alt="Car"
      style={{
        position: 'absolute',
        bottom: 10,
        left: position,
        width: 50,
        height: 100,
      }}
    />
  );
}
