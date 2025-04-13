import React from 'react';

export default function Obstacle({ top, left }) {
  return (
    <img
      src={process.env.PUBLIC_URL + '/obstacle.png'}
      alt="Obstacle"
      style={{
        position: 'absolute',
        top: top,
        left: left,
        width: '50px',
        height: '50px',
      }}
    />
  );
}
