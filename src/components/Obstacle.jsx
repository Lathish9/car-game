import React from 'react';

export default function Obstacle({ top, left }) {
  return (
    <img
      src="/obstacle.png"
      alt="Obstacle"
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: '50px',
        height: '100px'
      }}
    />
  );
}
