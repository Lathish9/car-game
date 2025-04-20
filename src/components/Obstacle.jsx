import React from 'react';

export default function Obstacle({ top, left }) {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/obstacle.png`}
      alt="Obstacle"
      style={{
        position: 'absolute',
        top,
        left,
        width: 50,
        height: 100,
      }}
    />
  );
}
